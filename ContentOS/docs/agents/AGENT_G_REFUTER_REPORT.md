# Agent G — Adversarial refuter report (real subagent run, 2026-07-19)

Agent G ran as an independent subagent against the completed implementation
with instructions to DISPROVE the build's claims. It read code, wrote and ran
its own repro scripts, and ran the test suite. Its findings are reproduced
below with the lead agent's resolution for each. A fix commit
(`fix(qa): resolve all P1/P2 findings…`) addresses every accepted finding;
regression tests were added where marked.

## Verdict summary

- P0 critical: **0**
- P1 major: 2 — **both fixed** (+ regression tests)
- P2 minor: 13 — **12 fixed, 1 accepted-as-documented**
- Claims attacked but CONFIRMED WORKING: subprocess injection safety,
  impossibility of accidental live publishing (three independent guards),
  no faked Premiere success anywhere, secret handling, behavioral test
  quality, review server exposure, restart/resume correctness.

## Findings and resolutions

| # | Sev | Finding | Resolution |
|---|---|---|---|
| 1 | P1 | Generic revision feedback (audio/graphic/note-only or ratings-only) crashed on an illegal `revision_requested → draft_rendered` transition, permanently wedging the job | FIXED: revision_requested may re-enter any rebuildable stage; e2e regression `test_generic_note_revision_does_not_wedge` |
| 2 | P1 | Worker claims used bare hostname (two processes on one machine share a claim → duplicate processing) and the 30-min claim timeout expired during 2-hour renders | FIXED: worker id is hostname:PID, claims refresh at every stage boundary, timeout 240 min |
| 3 | P2 | Symlink refusal was dead code (`resolve()` before `is_symlink()`) | FIXED: check order swapped |
| 4 | P2 | A failed managed copy left an orphan asset row that permanently blocked re-ingest as "duplicate" | FIXED: rollback on copy failure + orphan-row cleanup on re-ingest |
| 5 | P2 | Speech fragments shorter than min_clip_seconds silently deleted from the timeline | FIXED: the adjacent cut is skipped instead (recorded as `skipped`); regression test |
| 6 | P2 | `_word_safe` missed words swallowed whole inside a cut | FIXED + test |
| 7 | P2 | Dense speech could undercut caption min-duration/reading-speed despite docstring claims | ACCEPTED AS DOCUMENTED: overlap truncation is inherent; docstrings now state best-effort, quality gate reports it |
| 8 | P2 | Segment-based cues could render 6 lines with max_lines=2 | FIXED: long segments split into proportional cues, wrap clamps to max_lines; test |
| 9 | P2 | Transcript cleanup never touched words[], so captions kept fillers | FIXED: cleanup filters filler word timings + applies glossary to words |
| 10 | P2 | Distribution adapter hardcoded to Zernio for every platform; blanket except on insert; re-runs wrote an empty plans artifact | FIXED: platform routing, IntegrityError-only catch, artifact reflects all existing plans |
| 11 | P2 | HDR tone-map fallback was dead code (filtered a string that never matched argv) and mis-caught exception types | FIXED: command rebuilt without tonemap on SubprocessFailed, honestly recorded |
| 12 | P2 | Secret redaction missed exception tracebacks | FIXED: RedactionFilter pre-formats and scrubs exc_info |
| 13 | P2 | `transition(job, "failed")` entered an unrecoverable black-hole stage; CAS rowcount unchecked (phantom events) | FIXED: 'failed' rejected as a stage; rowcount enforced; test updated |
| 14 | P2 | POSIX shlex mangled Windows backslash paths for the Premiere MCP command | FIXED: posix=False on Windows |
| 15 | P2 | Font fallback was fictional (declared but never read); presets used fonts absent on Windows | FIXED: real platform font-directory lookup with fallback |
| P3 | — | render hard-indexed draft_horizontal; final_render hardcoded vertical path; re-discovery wiped hand-mapped operations; transport busy-spin on unmatched messages; docs dirs empty | FIXED (all four code items); docs written in this commit |

The full raw subagent output is preserved in the session transcript; this file
is the canonical record of findings and dispositions.
