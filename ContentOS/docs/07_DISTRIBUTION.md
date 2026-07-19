# Distribution

Dry run is the hard default (`CONTENTOS_DISTRIBUTION_DRY_RUN=true`). The
dry-run exporter writes the exact package a live adapter would send —
media copy + full plan JSON — to `Output/social/<platform>/`, keyed by
idempotency key (re-execution = `skipped`, never a double publish).

Publish plans (per platform) carry media, title/description from the social
package, timezone, privacy=private, validation results (duration/aspect/size
vs `config/platforms.yaml`), approval state, and an idempotency key enforced
by a unique DB index.

Live publishing requires ALL of: credentials configured · a real client
implementation (Zernio and YouTube adapters currently refuse — no endpoint
was guessed; implement against verified current docs first) · media
validation passed · plan approved · dry-run explicitly disabled at three
layers. Until then `--live` safely reports `blocked` per plan.

Analytics: `contentos_cli.py analytics --ingest <file>` accepts JSON/CSV
snapshots; recommendations refuse to conclude under 5 samples and are labeled
correlational.
