# Premiere MCP integration

**Truthful status: no real Premiere call has been made.** Premiere Pro and
the MCP server live on the Windows workstation; this environment shipped the
verified machinery and an honest `status: unavailable` capability file.

## What exists and is tested
- `premiere/transport.py` — JSON-RPC 2.0 stdio client (initialize →
  tools/list → tools/call, timeouts) — tested against a scripted fake server.
- `premiere/capability_discovery.py` — records ONLY tools the server actually
  exposes; writes `config/premiere_capabilities.yaml` +
  `docs/premiere/PREMIERE_MCP_CAPABILITY_REPORT.md`. Re-discovery preserves
  valid hand-mapped operations.
- `premiere/tool_mapper.py` — internal operation → observed tool, or
  `UnsupportedOperation`. Success is never faked.
- `premiere/sequence_builder.py` — always writes the editable fallback
  package (`Output/premiere/<job>/`: schema-valid manifest, captions, source
  map, edit-decision report, export settings, manual instructions,
  mcp_execution_log). Runs the vertical slice only when enabled AND capable.

## Windows bring-up (one-time, on the workstation)
1. Inspect the candidate server BEFORE running it:
   `python scripts/inspect_premiere_mcp.py C:\Users\corey\Tools\premiere-mcp`
   (license, install scripts, network/fs behavior; pin + record the commit).
2. Set env: `CONTENTOS_PREMIERE_MCP_ENABLED=true`,
   `CONTENTOS_PREMIERE_MCP_COMMAND` (+`_ARGS`) to launch the server.
3. `python contentos_cli.py premiere-discover` — writes the real tool list.
4. Hand-map `operation_map` entries in `config/premiere_capabilities.yaml`
   to the observed tool names (never guessed).
5. With Premiere open: `python contentos_cli.py premiere-run <job_id>` —
   the vertical slice (health → project → bin → import → sequence → inserts →
   captions → save → export) executes and logs every call; verify the export
   with ffprobe. Unmapped operations return `unsupported` and the fallback
   package remains authoritative.
