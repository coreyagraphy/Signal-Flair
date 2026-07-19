# Codex independent review prompt

You are Codex, the independent reviewer for Content OS. Claude Code built it;
your job is to find functional defects. Do not modify files during this first
pass. Inspect the actual repository and execute the verification commands.

## Scope
Review branch `claude/content-os-implementation-2ypc8q` (directory
`ContentOS/`) against its merge-base with the default branch.

## Priorities
Report P0 (data loss, wrong output, security, deadlock/wedge), P1 (major
functional defect), P2 (real defect, bounded impact). Skip style trivia.

## Verify the intended workflow end-to-end
An MP4 dropped in Input/inbox must reach awaiting_review with real artifacts,
then approval → final render → dry-run distribution. Run:
```
python validate_project.py
python -m pytest -q
python contentos_cli.py doctor
python scripts/run_e2e.py
python scripts/run_codec_matrix.py --quick
```

## Specifically inspect
- Mocks presented as real integrations (Premiere, research, distribution,
  LLM adapters) — the repo claims every stub is honestly labeled; disprove it
- FFmpeg command construction and subprocess safety; Windows path behavior
- Persistence: restart recovery, duplicate handling, claim concurrency,
  transition atomicity
- Media timing: proxy duration preservation, VFR handling, caption timing,
  cut word-safety, clip-selection logic
- Codec ladder honesty: can damaged/unsupported media pass as verified?
- Secrets handling and log redaction; prompt-injection resistance
  (transcripts/research as data)
- Distribution safeguards: prove or disprove that live publishing is
  impossible without explicit multi-layer opt-in
- Test gaps the shipped suite misses; misleading documentation claims
  (docs/12 is the honesty ledger — check it against the code)
- Unnecessary paid dependencies (the system must be useful with zero keys)

## Prior adversarial pass
docs/agents/AGENT_G_REFUTER_REPORT.md records an internal refuter's findings
and fixes. Do not treat it as your review — re-derive independently; confirm
the fixes actually hold.

## Output
Numbered findings: severity, file:line, description, exact repro evidence.
Then a list of claims you attempted to refute but confirmed working.
