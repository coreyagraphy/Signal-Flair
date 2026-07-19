"""Map internal operations to discovered MCP tools — or answer 'unsupported'."""
from __future__ import annotations

from core.exceptions import UnsupportedOperation


class ToolMapper:
    def __init__(self, capabilities: dict):
        self.capabilities = capabilities or {}
        self.operation_map: dict = self.capabilities.get("operation_map", {}) or {}
        self.observed = {t["name"] for t in self.capabilities.get("observed_tools", [])}

    @property
    def available(self) -> bool:
        return self.capabilities.get("status") == "available"

    def resolve(self, operation: str) -> str:
        """Return the real MCP tool name for an internal operation.

        Raises UnsupportedOperation when the operation is unmapped or maps to
        a tool the server did not actually expose. Success is never faked.
        """
        if not self.available:
            raise UnsupportedOperation(
                f"Premiere MCP unavailable: {self.capabilities.get('reason', 'unknown')}")
        mapped = self.operation_map.get(operation)
        if not mapped:
            raise UnsupportedOperation(
                f"Operation '{operation}' has no mapping to a discovered tool")
        if mapped not in self.observed:
            raise UnsupportedOperation(
                f"Operation '{operation}' maps to '{mapped}', which the server "
                "did not expose at discovery time — re-run premiere-discover")
        return mapped
