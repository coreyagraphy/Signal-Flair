"""Ingest: stability wait, probe, hash, dedupe, managed copy, durable job.

The original in the drop folder is only moved after the managed copy's hash
has been verified — the system never holds a single copy of the footage.
"""
from __future__ import annotations

import shutil
import time
from pathlib import Path

from core.config import Settings
from core.events import append_event
from core.exceptions import DuplicateAsset, MediaError
from core.hashing import sha256_file
from core.job_store import JobStore
from core.logging import get_logger
from core.paths import is_within, safe_name

from . import media_probe_service

log = get_logger("contentos.ingest")

ACCEPTED_EXTENSIONS = {".mp4", ".mov"}


def is_candidate(path: Path) -> bool:
    return path.is_file() and path.suffix.lower() in ACCEPTED_EXTENSIONS \
        and not path.name.startswith(".")


def wait_until_stable(path: Path, *, stable_seconds: float, poll_seconds: float,
                      max_wait_seconds: float = 3600.0) -> bool:
    """True once size and mtime stop changing for *stable_seconds*."""
    deadline = time.monotonic() + max_wait_seconds
    last = None
    stable_since = None
    while time.monotonic() < deadline:
        try:
            st = path.stat()
        except OSError:
            return False
        sig = (st.st_size, st.st_mtime)
        now = time.monotonic()
        if sig == last:
            if stable_since is not None and now - stable_since >= stable_seconds:
                return st.st_size > 0
        else:
            last, stable_since = sig, now
        time.sleep(poll_seconds)
    return False


def quarantine(settings: Settings, path: Path, reason: str) -> Path:
    dest = settings.paths.input_failed / safe_name(path.name)
    i = 1
    while dest.exists():
        dest = settings.paths.input_failed / f"{i}_{safe_name(path.name)}"
        i += 1
    shutil.move(str(path), str(dest))
    log.warning("Quarantined %s: %s", path.name, reason)
    return dest


def ingest_file(settings: Settings, store: JobStore, source: Path,
                *, format_id: str = "talking_head_short",
                wait_stable: bool = True) -> str:
    """Ingest one file and return the created job id.

    Raises DuplicateAsset / MediaError; caller decides whether to quarantine.
    """
    source = source.resolve()
    if not source.exists():
        raise MediaError(f"File does not exist: {source}")
    if source.is_symlink():
        raise MediaError(f"Refusing symlinked input: {source}")
    if source.suffix.lower() not in ACCEPTED_EXTENSIONS:
        raise MediaError(f"Unsupported extension {source.suffix}: {source.name}")

    if wait_stable and not wait_until_stable(
            source, stable_seconds=settings.ingest_stable_seconds,
            poll_seconds=settings.ingest_poll_seconds):
        raise MediaError(f"File never became stable: {source.name}")

    size = source.stat().st_size
    if size == 0:
        raise MediaError(f"Zero-byte file: {source.name}")
    if size > settings.ingest_max_file_gb * 1024**3:
        raise MediaError(f"File exceeds {settings.ingest_max_file_gb} GB limit: {source.name}")

    # Probe BEFORE accepting — corrupt media is rejected at the door.
    probe = media_probe_service.probe_media(source)
    if probe.get("duration_seconds", 0) <= 0:
        raise MediaError(f"Media has no readable duration: {source.name}")
    if not probe.get("has_video"):
        raise MediaError(f"No video stream found: {source.name}")

    digest = sha256_file(source)
    existing = store.find_asset_by_hash(digest)
    if existing is not None:
        raise DuplicateAsset(
            f"{source.name} already ingested as asset {existing['id']}"
        )

    asset_id = store.create_asset(original_path=source, sha256=digest, size_bytes=size)

    # Managed copy + hash verification before anything moves.
    managed = settings.paths.media_originals / f"{asset_id}_{safe_name(source.name)}"
    shutil.copy2(str(source), str(managed))
    copied_hash = sha256_file(managed)
    if copied_hash != digest:
        managed.unlink(missing_ok=True)
        raise MediaError(f"Managed copy hash mismatch for {source.name}")

    store.update_asset(
        asset_id, managed_path=str(managed),
        container=probe.get("container"), duration_seconds=probe.get("duration_seconds"),
        width=probe.get("width"), height=probe.get("height"),
        frame_rate=probe.get("frame_rate"), video_codec=probe.get("video_codec"),
        audio_codec=probe.get("audio_codec"),
        audio_sample_rate=probe.get("audio_sample_rate"),
        audio_channels=probe.get("audio_channels"),
    )

    job_id = store.create_job(asset_id=asset_id, format_id=format_id)
    store.set_artifact(job_id, "managed_original", managed)
    store.transition(job_id, "ingested")
    store.mark_stage(job_id, "ingested", "done", {"sha256": digest, "size": size})
    append_event(settings.paths, job_id, "ingested",
                 {"file": source.name, "sha256": digest, "asset_id": asset_id})

    # Only now is the drop-folder copy moved out of the inbox.
    if is_within(source, settings.paths.input_inbox):
        done = settings.paths.input_completed / safe_name(source.name)
        i = 1
        while done.exists():
            done = settings.paths.input_completed / f"{i}_{safe_name(source.name)}"
            i += 1
        shutil.move(str(source), str(done))

    log.info("Ingested %s as job %s (asset %s)", source.name, job_id, asset_id)
    return job_id


def scan_inbox(settings: Settings, store: JobStore) -> list[str]:
    """One pass over the inbox. Returns job ids created."""
    created = []
    for path in sorted(settings.paths.input_inbox.iterdir()):
        if not is_candidate(path):
            continue
        try:
            created.append(ingest_file(settings, store, path))
        except DuplicateAsset as exc:
            log.info("Skipping duplicate %s: %s", path.name, exc)
            quarantine(settings, path, f"duplicate: {exc}")
        except MediaError as exc:
            quarantine(settings, path, str(exc))
    return created
