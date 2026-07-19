"""End-to-end: synthetic MP4 through the complete local pipeline.

Covers: ingest → metadata → proxy → audio → transcript (fixture) → captions
→ strategy → clips → edit plan → draft render → premiere manifest → review
package → quality report → revision loop → approval → final render →
distribution dry run.
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

import pytest

pytestmark = pytest.mark.skipif(shutil.which("ffmpeg") is None,
                                reason="ffmpeg not installed")


@pytest.fixture()
def pipeline_env(settings, store, synthetic_media):
    from services import stage_registry
    stage_registry.register_all()
    inbox = settings.paths.input_inbox / synthetic_media.name
    shutil.copy2(synthetic_media, inbox)
    return inbox


def _place_fixture(settings, job_id, synthetic_media):
    shutil.copy2(synthetic_media.with_name("synthetic_talking_head.transcript.json"),
                 settings.paths.media_audio / f"{job_id}.transcript.json")


def test_full_pipeline_to_review_and_approval(settings, store, synthetic_media,
                                              pipeline_env):
    from core import pipeline
    from services import (distribution_service, ingest_service, render_service,
                          review_service)
    from services.quality_service import run_quality

    job_id = ingest_service.ingest_file(settings, store, pipeline_env,
                                        wait_stable=False)
    _place_fixture(settings, job_id, synthetic_media)

    # Duplicate protection: same file cannot be ingested twice.
    from core.exceptions import DuplicateAsset, MediaError
    dup = settings.paths.input_inbox / "copy.mp4"
    shutil.copy2(synthetic_media, dup)
    with pytest.raises(DuplicateAsset):
        ingest_service.ingest_file(settings, store, dup, wait_stable=False)

    stage = pipeline.advance(settings, store, job_id)
    job = store.get_job(job_id)
    assert stage == "awaiting_review", (job["error_code"], job["error_message"])
    assert job["status"] != "failed"

    artifacts = store.artifacts(job_id)
    for key in ("managed_original", "metadata_json", "proxy_video",
                "audio_asr_wav", "transcript_json", "captions_srt",
                "strategy_brief", "clip_candidates", "edit_plan",
                "draft_horizontal", "draft_vertical", "premiere_manifest",
                "review_package"):
        assert artifacts.get(key), f"missing artifact {key}"
        assert Path(artifacts[key]).exists(), f"artifact file missing: {key}"

    # Transcript came from the fixture adapter, honestly labeled.
    transcript = json.loads(Path(artifacts["transcript_json"]).read_text())
    assert transcript["engine"] == "fixture"

    # Edit plan: chronological, schema-valid, with an explainable cut report.
    plan = json.loads(Path(artifacts["edit_plan"]).read_text())
    orders = [s["order"] for s in plan["segments"]]
    assert orders == sorted(orders)
    assert (settings.paths.job_dir(job_id) / "cut_report.md").exists()

    # Premiere package: manifest + fallback instructions, honest MCP status.
    pkg = Path(artifacts["premiere_manifest"]).parent
    assert (pkg / "FALLBACK_INSTRUCTIONS.md").exists()
    mcp_log = json.loads((pkg / "mcp_execution_log.json").read_text())
    assert mcp_log["status"] == "fallback_only"

    # Quality gates pass on the draft.
    report = run_quality(settings, store, job_id)
    assert report["passed"], [g for g in report["gates"] if not g["passed"]]

    # Revision loop: a 'remove' note invalidates edit_planned and rebuilds.
    result = review_service.submit_feedback(
        settings, store, job_id,
        ratings={"overall": 62, "pacing": 55},
        decision="revision_requested",
        notes=[{"timestamp_seconds": 20.0, "end_seconds": 22.0,
                "note_type": "remove", "text": "too many cuts here, trim this"}])
    assert "edit_planned" in result["invalidated"]
    assert result["taste_rules_learned"]  # "too many cuts" → taste rule

    stage = pipeline.advance(settings, store, job_id)
    assert stage == "awaiting_review"
    # Prior draft preserved.
    assert list((settings.paths.job_dir(job_id) / "prior_drafts").glob("*.mp4"))

    # Approve → final render → distribution prep → dry run.
    review_service.submit_feedback(settings, store, job_id,
                                   ratings={"overall": 96}, decision="approved")
    render_service.render_final(settings, store, job_id)
    store.transition(job_id, "final_rendered")
    distribution_service.run(settings, store, job_id)
    store.transition(job_id, "distribution_prepared")

    results = distribution_service.execute(settings, store, job_id, dry_run=True)
    assert results
    assert all(r["status"] in ("exported", "skipped") for r in results)
    # Dry-run exports actually exist on disk.
    exported = [r for r in results if r["status"] == "exported"]
    assert exported
    for r in exported:
        assert Path(r["path"]).exists()

    # Idempotency: executing again skips, never double-publishes.
    again = distribution_service.execute(settings, store, job_id, dry_run=True)
    assert all(r["status"] == "skipped" for r in again)

    store.transition(job_id, "exported")
    store.transition(job_id, "analytics_pending")
    assert store.get_job(job_id)["stage"] == "analytics_pending"


def test_restart_resume(settings, store, synthetic_media, pipeline_env):
    """A restart mid-pipeline must not lose the job or redo verified stages."""
    from core import pipeline
    from core.database import reset_connection_cache
    from core.job_store import JobStore
    from services import ingest_service

    job_id = ingest_service.ingest_file(settings, store, pipeline_env,
                                        wait_stable=False)
    _place_fixture(settings, job_id, synthetic_media)
    pipeline.advance(settings, store, job_id, target="transcribed")
    assert store.get_job(job_id)["stage"] == "transcribed"

    reset_connection_cache()  # simulate restart
    store2 = JobStore(settings)
    assert store2.get_job(job_id)["stage"] == "transcribed"
    stage = pipeline.advance(settings, store2, job_id)
    assert stage == "awaiting_review"
