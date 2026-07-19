# Testing and verification

Suites (58 tests, all passing in this build environment):
- **unit/** — hashing, state machine (incl. revision re-entry and 'failed'
  rejection), config snapshots, path safety, retries, redaction, caption
  wrapping/monotonicity/reading-speed, word-safe cuts (incl. swallowed
  words), fragment-preserving segment building, clip scoring dimensions +
  unsupported-claim penalty, taste confidence growth, publish idempotency,
  Premiere tool-mapper refusals, manifest schema rejection.
- **integration/** — real ffprobe/ffmpeg over generated media, silence
  detection, fixture ASR, research provenance + caching, SQLite restart
  survival, exclusive claims, failure/retry re-running only the failed
  stage, MCP transport + discovery against a scripted fake server, codec
  capability inventory, decode-ladder verification (incl. ProRes/DNxHR,
  truncated/corrupt/empty differentiation, seek-noise vs real corruption),
  mezzanine generation, asset library scan/classify/preview/report/selection.
- **e2e/** — full pipeline on synthetic media: ingest → … → awaiting_review,
  duplicate rejection, quality gates, revision loop (remove-note AND
  generic-note regression), approval, final render, dry-run distribution +
  idempotency, restart/resume.

Commands (run from the repo root):
```
python validate_project.py
python -m pytest -q
python -m pytest --cov
python contentos_cli.py doctor
python contentos_cli.py validate
python scripts/generate_test_media.py
python scripts/run_e2e.py
python scripts/run_codec_matrix.py
```
Real-environment verification (Windows workstation only): `verify_gpu.py`,
Ollama reachability via doctor, Premiere vertical slice (docs/05), real
camera samples in `tests/codec_samples_private/` through the matrix.
