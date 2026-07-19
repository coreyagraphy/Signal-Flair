# Security and secrets

- **Secrets**: env vars only (`.env` gitignored, `.env.example` documented);
  refused from settings.yaml; excluded from job config snapshots; redacted
  from log messages AND tracebacks; doctor never prints values.
- **Subprocess**: every external call goes through `core/proc.run_command`
  (argv arrays, shell=False, timeouts, typed errors) — no shell strings
  anywhere; confirmed by adversarial review.
- **Filesystem**: `safe_name` strips traversal/reserved characters;
  symlinked inputs refused (checked pre-resolve); containment checks before
  moving inbox files; originals never deleted or overwritten; quarantine
  never destroys the only copy.
- **Untrusted data**: transcripts, research evidence, subtitles, filenames,
  and asset files are data, never instructions — prompts label them as such;
  asset previews never execute project files; review HTML escapes injected
  values; the review server binds 127.0.0.1 with a body cap.
- **External actions**: publishing requires layered explicit authorization
  (see docs/07); idempotency keys prevent duplicate side effects; MCP tools
  are allowlisted via the discovered capability map.
- **Third-party code**: `scripts/inspect_premiere_mcp.py` reviews license,
  install hooks, network and fs behavior read-only before anything runs.
