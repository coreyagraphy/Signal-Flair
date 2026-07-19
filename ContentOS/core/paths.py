"""Canonical path resolution for Content OS.

Every path in the system derives from CONTENTOS_ROOT so the repository works
identically at C:\\Users\\corey\\OneDrive\\Desktop\\ContentOS_Claude_Codex_Ready,
inside a git checkout, or in a test sandbox.
"""
from __future__ import annotations

import os
from pathlib import Path

_PACKAGE_ROOT = Path(__file__).resolve().parent.parent


def repo_root() -> Path:
    env = os.environ.get("CONTENTOS_ROOT", "").strip()
    if env:
        return Path(env).expanduser().resolve()
    return _PACKAGE_ROOT


class Paths:
    """All standard directories, resolved against a root."""

    def __init__(self, root: Path | None = None):
        self.root = (root or repo_root()).resolve()
        self.input_inbox = self.root / "Input" / "inbox"
        self.input_processing = self.root / "Input" / "processing"
        self.input_completed = self.root / "Input" / "completed"
        self.input_failed = self.root / "Input" / "failed"
        self.media_originals = self.root / "Media" / "originals"
        self.media_proxies = self.root / "Media" / "proxies"
        self.media_audio = self.root / "Media" / "audio"
        self.output = self.root / "Output"
        self.output_drafts = self.output / "drafts"
        self.output_finals = self.output / "finals"
        self.output_captions = self.output / "captions"
        self.output_thumbnails = self.output / "thumbnails"
        self.output_premiere = self.output / "premiere"
        self.output_manifests = self.output / "manifests"
        self.output_social = self.output / "social"
        self.output_reports = self.output / "reports"
        self.knowledge = self.root / "Knowledge_Base"
        self.config = self.root / "config"
        self.formats = self.root / "formats"
        self.schemas = self.root / "schemas"
        self.data = self.root / "data"
        self.data_jobs = self.data / "jobs"
        self.data_review = self.data / "review"
        self.data_cache = self.data / "cache"
        self.data_research = self.data / "research"
        self.data_events = self.data / "events"
        self.data_logs = self.data / "logs"
        self.database_dir = self.root / "database"
        self.migrations = self.database_dir / "migrations"

    def ensure(self) -> None:
        for name, value in vars(self).items():
            if isinstance(value, Path):
                value.mkdir(parents=True, exist_ok=True)

    def job_dir(self, job_id: str) -> Path:
        d = self.data_jobs / safe_name(job_id)
        d.mkdir(parents=True, exist_ok=True)
        return d


def safe_name(name: str) -> str:
    """Sanitize a string for use as a single filesystem component.

    Guards against path traversal and reserved characters in untrusted
    filenames (section 37 of the build mandate).
    """
    cleaned = "".join(c if c.isalnum() or c in "._- " else "_" for c in name)
    cleaned = cleaned.strip(" .")
    if not cleaned or set(cleaned) <= {".", "_"}:
        cleaned = "unnamed"
    return cleaned[:180]


def is_within(child: Path, parent: Path) -> bool:
    """True when *child* resolves inside *parent* (symlink-safe containment)."""
    try:
        child.resolve().relative_to(parent.resolve())
        return True
    except ValueError:
        return False
