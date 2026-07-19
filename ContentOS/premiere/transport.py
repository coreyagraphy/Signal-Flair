"""MCP stdio transport for a Premiere MCP server.

Speaks JSON-RPC 2.0 over stdin/stdout of a spawned server process
(initialize → tools/list → tools/call). This is real protocol code — it is
exercised in tests against a scripted fake server — but no Premiere tool
names are assumed anywhere: capability discovery records what the actual
server exposes before any call is mapped.
"""
from __future__ import annotations

import json
import shlex
import subprocess
import threading
import queue
from dataclasses import dataclass, field

from core.exceptions import ProviderUnavailable, SubprocessFailed
from core.logging import get_logger

log = get_logger("contentos.premiere.transport")

PROTOCOL_VERSION = "2024-11-05"


@dataclass
class McpTool:
    name: str
    description: str = ""
    input_schema: dict = field(default_factory=dict)


class StdioMcpClient:
    def __init__(self, command: str, args: list[str] | None = None,
                 timeout_seconds: int = 120):
        if not command:
            raise ProviderUnavailable("Premiere MCP command is not configured")
        self.command = command
        self.args = args or []
        self.timeout = timeout_seconds
        self._proc: subprocess.Popen | None = None
        self._next_id = 0
        self._responses: "queue.Queue[dict]" = queue.Queue()
        self._reader: threading.Thread | None = None

    # -- lifecycle -------------------------------------------------------
    def start(self) -> None:
        try:
            self._proc = subprocess.Popen(
                [self.command, *self.args],
                stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                stderr=subprocess.PIPE, text=True, bufsize=1,
            )
        except FileNotFoundError as exc:
            raise ProviderUnavailable(
                f"Premiere MCP executable not found: {self.command}") from exc
        self._reader = threading.Thread(target=self._read_loop, daemon=True)
        self._reader.start()
        self._request("initialize", {
            "protocolVersion": PROTOCOL_VERSION,
            "capabilities": {},
            "clientInfo": {"name": "contentos", "version": "1.0"},
        })
        self._notify("notifications/initialized", {})

    def close(self) -> None:
        if self._proc and self._proc.poll() is None:
            try:
                self._proc.terminate()
                self._proc.wait(timeout=5)
            except Exception:
                self._proc.kill()

    def _read_loop(self) -> None:
        assert self._proc and self._proc.stdout
        for line in self._proc.stdout:
            line = line.strip()
            if not line:
                continue
            try:
                self._responses.put(json.loads(line))
            except json.JSONDecodeError:
                log.debug("Non-JSON line from MCP server: %.120s", line)

    # -- rpc -------------------------------------------------------------
    def _send(self, payload: dict) -> None:
        if not self._proc or self._proc.poll() is not None or not self._proc.stdin:
            raise SubprocessFailed("Premiere MCP server process is not running")
        self._proc.stdin.write(json.dumps(payload) + "\n")
        self._proc.stdin.flush()

    def _notify(self, method: str, params: dict) -> None:
        self._send({"jsonrpc": "2.0", "method": method, "params": params})

    def _request(self, method: str, params: dict) -> dict:
        self._next_id += 1
        req_id = self._next_id
        self._send({"jsonrpc": "2.0", "id": req_id, "method": method,
                    "params": params})
        import time
        deadline = time.monotonic() + self.timeout
        while time.monotonic() < deadline:
            try:
                msg = self._responses.get(timeout=1.0)
            except queue.Empty:
                continue
            if msg.get("id") == req_id:
                if "error" in msg:
                    raise SubprocessFailed(
                        f"MCP {method} error: {msg['error']}", retryable=False)
                return msg.get("result", {})
            # Requeue unrelated messages (notifications are dropped).
            if "id" in msg:
                self._responses.put(msg)
        raise SubprocessFailed(f"MCP {method} timed out after {self.timeout}s")

    # -- public ----------------------------------------------------------
    def list_tools(self) -> list[McpTool]:
        result = self._request("tools/list", {})
        return [McpTool(name=t["name"], description=t.get("description", ""),
                        input_schema=t.get("inputSchema", {}))
                for t in result.get("tools", [])]

    def call_tool(self, name: str, arguments: dict) -> dict:
        return self._request("tools/call", {"name": name, "arguments": arguments})


def client_from_settings(settings) -> StdioMcpClient:
    args = shlex.split(settings.premiere_mcp_args) if settings.premiere_mcp_args else []
    return StdioMcpClient(settings.premiere_mcp_command, args,
                          settings.premiere_mcp_timeout_seconds)
