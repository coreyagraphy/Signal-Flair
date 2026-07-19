# Architecture

```
contentos_cli.py / app.py / review server        (operator surfaces)
        │
core/pipeline.py  ── stage registry ──►  services/*   (one service per stage)
        │                                     │
core/job_store.py + state_machine + checkpoints│
        │                                adapters/*   (llm, research,
data/contentos.db (SQLite, migrations)         │        transcription,
data/events/*.jsonl (audit journal)            │        distribution)
                                          premiere/*  (transport, discovery,
                                                       mapper, manifests)
```

- **core/** — persistence, config, state machine, orchestration, safe
  subprocess, logging with redaction. No service imports another service's
  internals; everything flows through artifacts + the job store.
- **services/** — pipeline stages plus codec, capability, asset library,
  quality, taste, analytics.
- **adapters/** — every optional/paid provider sits behind an availability-
  reporting adapter; core never imports a provider directly.
- **premiere/** — capability-driven: internal operations map to tools the
  actual server exposed at discovery, or raise UnsupportedOperation.
- **Artifacts** are files on disk, recorded per-job; a stage is complete only
  when its artifacts exist (checkpoints re-verified on restart/retry).

Key decisions are recorded in docs/decisions/.
