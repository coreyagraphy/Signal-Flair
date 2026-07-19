"""Distribution adapter contract."""
from __future__ import annotations

from abc import ABC, abstractmethod


class DistributionAdapter(ABC):
    name: str = "base"

    @abstractmethod
    def available(self) -> tuple[bool, str]:
        ...

    @abstractmethod
    def publish(self, plan: dict) -> dict:
        """Execute a publish plan. Must be idempotent per plan['idempotency_key'].

        Returns {"status": "exported"|"scheduled"|"skipped", ...detail}.
        Must NEVER go live when plan['dry_run'] is truthy.
        """
        ...
