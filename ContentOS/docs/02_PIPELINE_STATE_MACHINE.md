# Pipeline state machine

Linear stages (auto-advanced by the worker to `awaiting_review`):

discovered → ingested → analyzed → proxied → transcribed → captioned →
strategized → clips_selected → edit_planned → draft_rendered →
premiere_prepared → awaiting_review

Review branches:
- awaiting_review → approved | revision_requested
- revision_requested → transcribed | captioned | strategized |
  clips_selected | edit_planned | draft_rendered | awaiting_review
  (re-entry point chosen from the note types; only affected stages rebuild)
- approved → final_rendered → distribution_prepared → scheduled|exported →
  analytics_pending (terminal)

Rules:
- `failed` / `blocked` are **statuses**, never stages. A failed stage records
  a typed error code; `retry <job_id>` re-verifies artifacts and resumes.
- `blocked` marks external capability gaps (e.g. `unsupported_codec`,
  Premiere unavailable) with a precise reason — never a generic error.
- Transitions are compare-and-swap on (id, stage) with rowcount verification;
  claims are `hostname:PID`, refreshed each stage, reclaimed after 240 min.
- Every transition is recorded in `job_events` and mirrored to
  `data/events/<job>.jsonl`.
