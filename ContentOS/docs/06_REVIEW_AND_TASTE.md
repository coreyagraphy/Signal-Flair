# Review and taste

## Review loop
`awaiting_review` writes `data/review/<job>/review.html` (drafts, timestamp
notes with typed categories, ten 1–100 rating dimensions, cut report).
Feedback paths (both land in the database, which is authoritative):
- `python contentos_cli.py review <job>` → http://127.0.0.1:8765 → buttons
- offline: "Download notes JSON" in the page, then
  `python contentos_cli.py feedback-complete <job> --file <json>`

Revision: prior drafts archived to `prior_drafts/`, a revision_request row
records the invalidated stages (chosen from note types — caption notes
rebuild captions; remove/protect/framing rebuild the edit plan; anything
else re-renders), and the pipeline rebuilds only those stages.
"This is 62/100, get it to 95" works: rate overall 62, add notes, request
revision, re-review the rebuilt draft.

## Taste Database
Rules extracted from review notes start at confidence 0.3 and grow +0.2 per
repeated confirmation (cap 0.95, 90-day review dates, per-format scope) — one
comment never becomes permanent universal taste. Active rules are retrieved
into every strategy prompt and future edit decisions. `contentos_cli.py taste`
lists them.

## Autopilot
`review_required` is the default. `trusted_format_autopilot` eligibility is
computed, explainable, and off until: ≥5 scored approvals for the format,
recent average ≥95, no unresolved reviews, no failed gates in 30 days, and
Corey explicitly enables it.
