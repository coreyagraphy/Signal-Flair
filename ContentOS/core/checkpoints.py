"""Stage checkpoints: a stage is complete only when its artifacts exist.

``verify_stage`` re-checks artifacts on disk, so a restarted worker can trust
the recorded stage instead of re-running work — and can detect artifacts that
were deleted out from under the database.
"""
from __future__ import annotations

from pathlib import Path

from .job_store import JobStore

# Artifact keys that must exist on disk for each stage to be considered done.
STAGE_ARTIFACTS: dict[str, list[str]] = {
    "ingested": ["managed_original"],
    "analyzed": ["metadata_json"],
    "proxied": ["proxy_video", "audio_asr_wav"],
    "transcribed": ["transcript_json"],
    "captioned": ["captions_srt", "captions_vtt"],
    "strategized": ["strategy_brief"],
    "clips_selected": ["clip_candidates"],
    "edit_planned": ["edit_plan"],
    "draft_rendered": ["draft_horizontal"],
    "premiere_prepared": ["premiere_manifest"],
    "awaiting_review": ["review_package"],
    "final_rendered": ["final_render"],
    "distribution_prepared": ["publish_plan"],
}


def verify_stage(store: JobStore, job_id: str, stage: str) -> tuple[bool, list[str]]:
    """Return (ok, missing_artifact_keys) for a stage of a job."""
    required = STAGE_ARTIFACTS.get(stage, [])
    artifacts = store.artifacts(job_id)
    missing = []
    for key in required:
        path = artifacts.get(key)
        if not path or not Path(path).exists() or Path(path).stat().st_size == 0:
            missing.append(key)
    return (not missing, missing)
