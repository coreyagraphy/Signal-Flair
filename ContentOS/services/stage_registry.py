"""Wire every stage runner into the pipeline orchestrator."""
from __future__ import annotations

from core import pipeline
from core.config import Settings
from core.job_store import JobStore

from . import (caption_service, clip_scoring_service, edit_plan_service,
               media_probe_service, proxy_service, render_service,
               review_service, strategy_service, transcript_cleanup_service,
               transcription_service)
from premiere import sequence_builder


def _captioned(settings: Settings, store: JobStore, job_id: str) -> dict:
    cleanup = transcript_cleanup_service.run(settings, store, job_id)
    captions = caption_service.run(settings, store, job_id)
    return {**captions, "cleanup_changes": cleanup["changes"]}


def register_all() -> None:
    pipeline.register("analyzed", media_probe_service.run)
    pipeline.register("proxied", proxy_service.run)
    pipeline.register("transcribed", transcription_service.run)
    pipeline.register("captioned", _captioned)
    pipeline.register("strategized", strategy_service.run)
    pipeline.register("clips_selected", clip_scoring_service.run)
    pipeline.register("edit_planned", edit_plan_service.run)
    pipeline.register("draft_rendered", render_service.run)
    pipeline.register("premiere_prepared", sequence_builder.run)
    pipeline.register("awaiting_review", review_service.run)
