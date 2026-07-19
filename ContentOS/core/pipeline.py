"""Pipeline orchestrator.

Runs a job stage-by-stage through registered stage runners, checkpointing
after each stage. A failed stage records a typed error and stops; ``retry``
resumes from the failed stage without redoing verified work.
"""
from __future__ import annotations

import socket
import traceback
from typing import Callable

from . import checkpoints, state_machine
from .config import Settings
from .events import append_event
from .exceptions import ContentOSError, StageBlocked
from .job_store import JobStore
from .logging import get_logger

log = get_logger("contentos.pipeline")

# stage name -> callable(settings, store, job_id) -> dict (detail)
StageRunner = Callable[[Settings, JobStore, str], dict]

_RUNNERS: dict[str, StageRunner] = {}

# Stages the automatic pipeline advances through. Review and post-approval
# stages are driven by explicit operator commands, not the worker loop.
AUTO_TARGET = "awaiting_review"


def register(stage: str, runner: StageRunner) -> None:
    if stage not in state_machine.STAGES:
        raise ValueError(f"Cannot register runner for unknown stage {stage}")
    _RUNNERS[stage] = runner


def registered_stages() -> list[str]:
    return [s for s in state_machine.STAGES if s in _RUNNERS]


def _worker_name() -> str:
    return f"{socket.gethostname()}"


def run_stage(settings: Settings, store: JobStore, job_id: str, stage: str) -> dict:
    runner = _RUNNERS.get(stage)
    if runner is None:
        raise ContentOSError(f"No runner registered for stage {stage}")
    store.mark_stage(job_id, stage, "running")
    append_event(settings.paths, job_id, "stage_started", {"stage": stage})
    detail = runner(settings, store, job_id) or {}
    ok, missing = checkpoints.verify_stage(store, job_id, stage)
    if not ok:
        raise ContentOSError(
            f"Stage {stage} reported success but artifacts missing: {missing}",
            code="artifact_missing")
    store.mark_stage(job_id, stage, "done", detail)
    append_event(settings.paths, job_id, "stage_done", {"stage": stage, **detail})
    return detail


def advance(settings: Settings, store: JobStore, job_id: str,
            target: str = AUTO_TARGET) -> str:
    """Advance a job toward *target*. Returns the stage reached."""
    worker = _worker_name()
    if not store.claim_job(job_id, worker):
        log.info("Job %s is claimed by another worker; skipping", job_id)
        return store.get_job(job_id)["stage"]
    try:
        while True:
            job = store.get_job(job_id)
            current = job["stage"]
            if current == target or current == "failed":
                return current
            nxt = _next_auto_stage(current, target)
            if nxt is None:
                return current
            try:
                store.transition(job_id, nxt, status="running")
                run_stage(settings, store, job_id, nxt)
                store.conn.execute(
                    "UPDATE jobs SET status = 'pending', updated_at = datetime('now')"
                    " WHERE id = ?", (job_id,))
            except StageBlocked as exc:
                # Blocked on an external capability: record honestly, keep going
                # is NOT allowed — stop here so the operator can see why.
                store.mark_stage(job_id, nxt, "blocked", {"reason": str(exc)})
                store.conn.execute(
                    "UPDATE jobs SET status = 'blocked', error_code = ?,"
                    " error_message = ?, updated_at = datetime('now') WHERE id = ?",
                    (exc.code, str(exc), job_id))
                append_event(settings.paths, job_id, "stage_blocked",
                             {"stage": nxt, "reason": str(exc)})
                return nxt
            except ContentOSError as exc:
                store.mark_stage(job_id, nxt, "failed", {"error": str(exc)})
                store.set_error(job_id, exc.code, str(exc))
                append_event(settings.paths, job_id, "stage_failed",
                             {"stage": nxt, "code": exc.code, "error": str(exc)})
                log.error("Job %s failed at %s: %s", job_id, nxt, exc)
                return nxt
            except Exception as exc:  # unexpected bug — never lose the job
                store.mark_stage(job_id, nxt, "failed", {"error": str(exc)})
                store.set_error(job_id, "unexpected_error", f"{exc}\n{traceback.format_exc()[-1500:]}")
                append_event(settings.paths, job_id, "stage_failed",
                             {"stage": nxt, "code": "unexpected_error", "error": str(exc)})
                log.exception("Job %s crashed at %s", job_id, nxt)
                return nxt
    finally:
        store.release_job(job_id)


def _next_auto_stage(current: str, target: str) -> str | None:
    order = state_machine.STAGES
    try:
        ci, ti = order.index(current), order.index(target)
    except ValueError:
        return None
    if ci >= ti:
        return None
    return order[ci + 1]


def retry(settings: Settings, store: JobStore, job_id: str,
          target: str = AUTO_TARGET) -> str:
    """Clear the error and resume from the failed stage.

    Verified stages are not re-run; the failed stage is re-entered. Stage
    pointers stay where they were because a failed transition already moved
    the job into the failing stage — we just clear the error and continue.
    """
    job = store.get_job(job_id)
    if job is None:
        raise ContentOSError(f"Unknown job {job_id}")
    current = job["stage"]
    # Re-verify the current stage's artifacts; if incomplete, re-run it.
    ok, _missing = checkpoints.verify_stage(store, job_id, current)
    store.clear_error(job_id)
    append_event(settings.paths, job_id, "retry", {"stage": current, "artifacts_ok": ok})
    if not ok:
        try:
            run_stage(settings, store, job_id, current)
            store.conn.execute(
                "UPDATE jobs SET status = 'pending', updated_at = datetime('now')"
                " WHERE id = ?", (job_id,))
        except ContentOSError as exc:
            store.set_error(job_id, exc.code, str(exc))
            return current
    return advance(settings, store, job_id, target)
