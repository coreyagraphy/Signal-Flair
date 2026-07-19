# Agent F — Distribution & Analytics workstream report

## Delivered
- Dry-run filesystem exporter (always available): writes the exact package a
  live adapter would send into Output/social/<platform>/, idempotency-keyed
- Platform validation from config/platforms.yaml (duration, aspect, size)
- Publish plans persisted with unique idempotency keys; re-preparation keeps
  all existing plans; publish events recorded
- Live adapters (Zernio — spelling corrected from "Cernio" — and direct
  YouTube) are credential-gated refusals until clients are implemented
  against verified current documentation; five independent guards prevent
  accidental live publishing (session dry_run flag, settings flag, row flag,
  approval state, validation pass)
- Analytics: snapshot ingestion (JSON/CSV), known-metric whitelist,
  recommendations that refuse to conclude under 5 samples and label
  correlation as correlation
