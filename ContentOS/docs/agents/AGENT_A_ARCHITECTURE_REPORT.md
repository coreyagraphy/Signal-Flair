# Agent A — Repository & Architecture workstream report

Executed by the lead agent as a dedicated workstream (this build used one real
spawned subagent — the Agent G refuter — plus lead-agent workstreams; no fake
20-agent theater).

## Delivered
- CONTENTOS_ROOT-relative path system (`core/paths.py`) with traversal-safe
  filenames and symlink containment checks
- Typed configuration: env > settings.yaml > defaults; secrets env-only,
  excluded from snapshots (`core/config.py`)
- SQLite persistence + ordered SQL migrations (0001 core, 0002 asset library)
- 19-stage state machine with review-loop branches; 'failed' is a status,
  never a stage
- Durable jobs: atomic compare-and-swap transitions (rowcount-checked),
  hostname:PID claims refreshed per stage, artifact-verified checkpoints
- Pipeline orchestrator with typed errors, StageBlocked for external
  capability gaps, retry that re-runs only incomplete stages
- Safe subprocess layer: argv arrays, shell=False, timeouts, redaction
- Windows compatibility: no shell strings, posix=False arg parsing, font
  directory resolution, OneDrive attribute detection, case-collision check in
  validate_project.py

## Decisions
- stdlib `sqlite3` + SQL migrations instead of SQLAlchemy/Alembic: fewer
  dependencies, no ORM layer to audit; documented in docs/decisions/.
- argparse over typer: zero-dependency CLI.
