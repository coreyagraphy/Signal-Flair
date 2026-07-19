"""The pipeline state machine (mandate section 2).

Stages are strictly ordered; a job may only advance to the next stage,
branch through the review loop, or enter ``failed`` from anywhere.
"""
from __future__ import annotations

from .exceptions import TransitionError

STAGES: list[str] = [
    "discovered",
    "ingested",
    "analyzed",
    "proxied",
    "transcribed",
    "captioned",
    "strategized",
    "clips_selected",
    "edit_planned",
    "draft_rendered",
    "premiere_prepared",
    "awaiting_review",
    "revision_requested",
    "approved",
    "final_rendered",
    "distribution_prepared",
    "scheduled",
    "exported",
    "analytics_pending",
]

TERMINAL = {"analytics_pending"}

# Extra transitions beyond simple linear advancement.
_EXTRA: dict[str, set[str]] = {
    "awaiting_review": {"revision_requested", "approved"},
    # A revision may re-enter ANY rebuildable stage: caption-only feedback
    # restarts at captioned; ratings-only or audio/graphic notes restart at
    # draft_rendered (cheapest rebuild that yields a new draft).
    "revision_requested": {"transcribed", "captioned", "strategized",
                           "clips_selected", "edit_planned", "draft_rendered",
                           "awaiting_review"},
    "approved": {"final_rendered"},
    "distribution_prepared": {"scheduled", "exported"},
    "scheduled": {"analytics_pending"},
    "exported": {"analytics_pending"},
}


def stage_index(stage: str) -> int:
    try:
        return STAGES.index(stage)
    except ValueError:
        raise TransitionError(f"Unknown stage: {stage}")


def allowed_next(stage: str) -> set[str]:
    idx = stage_index(stage)
    nxt: set[str] = set(_EXTRA.get(stage, set()))
    if idx + 1 < len(STAGES) and stage not in ("awaiting_review", "revision_requested",
                                               "distribution_prepared", "scheduled", "exported"):
        nxt.add(STAGES[idx + 1])
    return nxt


def check_transition(current: str, target: str) -> None:
    # "failed" is a STATUS, never a stage — entering it as a stage would make
    # the job unrecoverable (Agent G finding 13).
    if target == "failed":
        raise TransitionError(
            "'failed' is a job status, not a stage; use JobStore.set_error")
    if target not in allowed_next(current):
        raise TransitionError(f"Illegal transition {current} -> {target}")
