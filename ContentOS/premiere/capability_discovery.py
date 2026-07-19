"""Discover what the actual installed Premiere MCP server can do.

Writes config/premiere_capabilities.yaml (machine-readable) and
docs/premiere/PREMIERE_MCP_CAPABILITY_REPORT.md (human-readable) from the
REAL tools/list response — never from a README.
"""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import yaml

from core.config import Settings
from core.exceptions import ProviderUnavailable
from core.logging import get_logger

from .transport import client_from_settings

log = get_logger("contentos.premiere.discovery")

# Internal operations Content OS wants (mandate section 26). Mapping to real
# tool names happens ONLY after discovery fills observed_tools.
INTERNAL_OPERATIONS = [
    "health_check", "list_projects", "open_project", "create_project",
    "create_bin", "import_media", "create_sequence", "insert_source_range",
    "remove_timeline_range", "move_clip", "set_clip_transform", "add_marker",
    "import_captions", "add_audio", "set_audio_level", "apply_transition",
    "set_sequence_settings", "save_project", "export_sequence", "poll_export",
]


def discover(settings: Settings) -> dict:
    """Probe the configured MCP server. Returns the capability document."""
    doc = {
        "discovered_at": datetime.now(timezone.utc).isoformat(),
        "enabled": settings.premiere_mcp_enabled,
        "command": settings.premiere_mcp_command or None,
        "status": "unavailable",
        "reason": "",
        "observed_tools": [],
        "operation_map": {op: None for op in INTERNAL_OPERATIONS},
    }
    if not settings.premiere_mcp_enabled:
        doc["reason"] = "CONTENTOS_PREMIERE_MCP_ENABLED is false"
        return doc
    if not settings.premiere_mcp_command:
        doc["reason"] = "CONTENTOS_PREMIERE_MCP_COMMAND is not set"
        return doc
    client = None
    try:
        client = client_from_settings(settings)
        client.start()
        tools = client.list_tools()
        doc["status"] = "available"
        doc["observed_tools"] = [
            {"name": t.name, "description": t.description,
             "input_schema": t.input_schema} for t in tools]
        doc["reason"] = f"{len(tools)} tools exposed"
    except (ProviderUnavailable, Exception) as exc:
        doc["reason"] = f"discovery failed: {exc}"
    finally:
        if client is not None:
            client.close()
    return doc


def load_capabilities(settings: Settings) -> dict:
    path = settings.paths.config / "premiere_capabilities.yaml"
    if not path.exists():
        return {"status": "unavailable", "reason": "no capability file; run "
                "`python contentos_cli.py premiere-discover`", "operation_map": {}}
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


def write_capabilities(settings: Settings, doc: dict) -> Path:
    path = settings.paths.config / "premiere_capabilities.yaml"
    # Preserve hand-mapped operation_map entries that still point at tools the
    # server actually exposes — re-discovery must not wipe operator work.
    if path.exists():
        try:
            previous = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
            observed = {t["name"] for t in doc.get("observed_tools", [])}
            for op, tool in (previous.get("operation_map") or {}).items():
                if tool and tool in observed and not doc["operation_map"].get(op):
                    doc["operation_map"][op] = tool
        except yaml.YAMLError:
            pass
    path.write_text(yaml.safe_dump(doc, sort_keys=False, allow_unicode=True),
                    encoding="utf-8")
    report = settings.paths.root / "docs" / "premiere" / "PREMIERE_MCP_CAPABILITY_REPORT.md"
    report.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Premiere MCP capability report", "",
        f"- Discovered: {doc.get('discovered_at')}",
        f"- Status: **{doc.get('status')}**",
        f"- Reason: {doc.get('reason')}",
        f"- Command: `{doc.get('command')}`", "",
        "## Observed tools", "",
    ]
    tools = doc.get("observed_tools", [])
    if tools:
        for t in tools:
            lines.append(f"- `{t['name']}` — {t.get('description', '')[:140]}")
    else:
        lines.append("_None observed. No tool names have been assumed._")
    lines += ["", "## Internal operation map", ""]
    for op, mapped in doc.get("operation_map", {}).items():
        lines.append(f"- `{op}` → {('`' + mapped + '`') if mapped else '**unmapped**'}")
    lines += ["", "Unmapped operations return `unsupported` — they are never faked.", ""]
    report.write_text("\n".join(lines), encoding="utf-8")
    return path
