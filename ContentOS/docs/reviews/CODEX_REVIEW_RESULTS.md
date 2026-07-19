# Codex review results

**Status: NOT YET EXECUTED.**

The Codex CLI is not installed in the build container (checked: no `codex`
on PATH; the Windows fallback path
`C:\Users\corey\AppData\Roaming\npm\node_modules\@openai\codex\bin\codex.js`
is on the workstation). No Codex review has run, and nothing in this
repository represents itself as one — the internal adversarial pass in
docs/agents/AGENT_G_REFUTER_REPORT.md is a Claude-side refuter, not Codex.

To execute the review on the workstation:
```powershell
powershell -ExecutionPolicy Bypass -File RUN_CODEX_REVIEW.ps1
```
The script detects the installed CLI, prefers a read-only review of the
branch, falls back to `codex exec` with docs/reviews/CODEX_REVIEW_PROMPT.md,
and captures the full output into this file.
