"""Integration: MCP stdio transport against a scripted fake server.

Proves the JSON-RPC framing (initialize → tools/list → tools/call) works —
without pretending Premiere itself was driven.
"""
from __future__ import annotations

import sys
import textwrap
from pathlib import Path

import pytest

from core.exceptions import ProviderUnavailable
from premiere.transport import StdioMcpClient

FAKE_SERVER = textwrap.dedent("""
    import json, sys
    for line in sys.stdin:
        msg = json.loads(line)
        method, mid = msg.get("method"), msg.get("id")
        if mid is None:
            continue
        if method == "initialize":
            result = {"protocolVersion": "2024-11-05", "capabilities": {},
                      "serverInfo": {"name": "fake-premiere", "version": "0"}}
        elif method == "tools/list":
            result = {"tools": [{"name": "premiere_health",
                                 "description": "health check",
                                 "inputSchema": {"type": "object"}}]}
        elif method == "tools/call":
            result = {"content": [{"type": "text",
                                   "text": json.dumps({"ok": True,
                                       "tool": msg["params"]["name"]})}]}
        else:
            result = {}
        sys.stdout.write(json.dumps({"jsonrpc": "2.0", "id": mid,
                                     "result": result}) + "\\n")
        sys.stdout.flush()
""")


@pytest.fixture()
def fake_server(tmp_path) -> Path:
    path = tmp_path / "fake_mcp_server.py"
    path.write_text(FAKE_SERVER, encoding="utf-8")
    return path


def test_transport_lists_and_calls_tools(fake_server):
    client = StdioMcpClient(sys.executable, [str(fake_server)], timeout_seconds=15)
    try:
        client.start()
        tools = client.list_tools()
        assert [t.name for t in tools] == ["premiere_health"]
        result = client.call_tool("premiere_health", {})
        assert "content" in result
    finally:
        client.close()


def test_transport_refuses_missing_command():
    with pytest.raises(ProviderUnavailable):
        StdioMcpClient("", [])


def test_transport_reports_missing_executable():
    client = StdioMcpClient("/nonexistent/premiere-mcp-binary", [])
    with pytest.raises(ProviderUnavailable):
        client.start()


def test_capability_discovery_honest_when_disabled(settings):
    from premiere.capability_discovery import discover
    doc = discover(settings)
    assert doc["status"] == "unavailable"
    assert "PREMIERE_MCP_ENABLED" in doc["reason"]
    assert doc["observed_tools"] == []


def test_capability_discovery_against_fake_server(settings, fake_server,
                                                  monkeypatch):
    monkeypatch.setenv("CONTENTOS_PREMIERE_MCP_ENABLED", "true")
    monkeypatch.setenv("CONTENTOS_PREMIERE_MCP_COMMAND", sys.executable)
    monkeypatch.setenv("CONTENTOS_PREMIERE_MCP_ARGS", str(fake_server))
    from core.config import load_settings
    from premiere.capability_discovery import discover, write_capabilities
    s = load_settings()
    doc = discover(s)
    assert doc["status"] == "available"
    assert doc["observed_tools"][0]["name"] == "premiere_health"
    path = write_capabilities(s, doc)
    assert path.exists()
    report = s.paths.root / "docs" / "premiere" / "PREMIERE_MCP_CAPABILITY_REPORT.md"
    assert "premiere_health" in report.read_text(encoding="utf-8")
