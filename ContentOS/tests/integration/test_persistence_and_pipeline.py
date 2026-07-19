"""Integration: SQLite persistence, restart/resume, failure/retry, dedupe."""
from __future__ import annotations

import pytest

from core import pipeline
from core.database import migrate, reset_connection_cache
from core.exceptions import ContentOSError, DuplicateAsset
from core.job_store import JobStore


def test_migrations_idempotent(settings):
    first = migrate(settings.paths)
    assert "0001_initial.sql" in first
    assert migrate(settings.paths) == []  # second run applies nothing


def test_job_survives_reconnect(settings, store):
    asset = store.create_asset(original_path=settings.paths.root / "v.mp4",
                               sha256="a" * 64, size_bytes=10)
    job_id = store.create_job(asset_id=asset)
    reset_connection_cache()  # simulate process restart
    store2 = JobStore(settings)
    job = store2.get_job(job_id)
    assert job is not None
    assert job["stage"] == "discovered"


def test_duplicate_hash_rejected(settings, store):
    store.create_asset(original_path=settings.paths.root / "v.mp4",
                       sha256="b" * 64, size_bytes=10)
    with pytest.raises(DuplicateAsset):
        store.create_asset(original_path=settings.paths.root / "v2.mp4",
                           sha256="b" * 64, size_bytes=10)


def test_claim_is_exclusive(settings, store):
    asset = store.create_asset(original_path=settings.paths.root / "v.mp4",
                               sha256="c" * 64, size_bytes=10)
    job_id = store.create_job(asset_id=asset)
    assert store.claim_job(job_id, "worker-a")
    assert not store.claim_job(job_id, "worker-b")   # someone else holds it
    assert store.claim_job(job_id, "worker-a")       # re-entrant for owner
    store.release_job(job_id)
    assert store.claim_job(job_id, "worker-b")


def test_failed_stage_records_error_and_retries(settings, store, monkeypatch):
    from services import stage_registry
    stage_registry.register_all()

    asset = store.create_asset(original_path=settings.paths.root / "v.mp4",
                               sha256="d" * 64, size_bytes=10)
    job_id = store.create_job(asset_id=asset)
    store.set_artifact(job_id, "managed_original", settings.paths.root / "v.mp4")
    store.transition(job_id, "ingested")

    calls = {"n": 0}

    def flaky_runner(_settings, _store, _job_id):
        calls["n"] += 1
        if calls["n"] == 1:
            raise ContentOSError("probe exploded", code="media_error")
        out = settings.paths.job_dir(_job_id) / "metadata.json"
        out.write_text("{}", encoding="utf-8")
        _store.set_artifact(_job_id, "metadata_json", out)
        codec = settings.paths.job_dir(_job_id) / "codec_report.json"
        codec.write_text("{}", encoding="utf-8")
        _store.set_artifact(_job_id, "codec_report", codec)
        return {}

    pipeline.register("analyzed", flaky_runner)
    stage = pipeline.advance(settings, store, job_id, target="analyzed")
    job = store.get_job(job_id)
    assert job["status"] == "failed"
    assert job["error_code"] == "media_error"
    assert stage == "analyzed"

    # Retry re-runs ONLY the failed stage and succeeds.
    pipeline.retry(settings, store, job_id, target="analyzed")
    job = store.get_job(job_id)
    assert job["status"] != "failed"
    assert calls["n"] == 2
    stage_registry.register_all()  # restore real runners


def test_stage_incomplete_artifacts_fail_checkpoint(settings, store):
    from core import checkpoints
    asset = store.create_asset(original_path=settings.paths.root / "v.mp4",
                               sha256="e" * 64, size_bytes=10)
    job_id = store.create_job(asset_id=asset)
    ok, missing = checkpoints.verify_stage(store, job_id, "ingested")
    assert not ok
    assert missing == ["managed_original"]
