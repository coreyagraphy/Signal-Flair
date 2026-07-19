"""LLM adapter contract.

Runtime intelligence must never hard-depend on a specific provider
(mandate section 20). Every adapter reports availability honestly and
records which provider/model actually produced an output.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass

PROMPT_VERSION = "2026-07-19.1"


@dataclass
class LLMResult:
    text: str
    provider: str
    model: str
    prompt_version: str = PROMPT_VERSION
    heuristic: bool = False  # True when produced by the template fallback


class LLMAdapter(ABC):
    name: str = "base"

    @abstractmethod
    def available(self) -> tuple[bool, str]:
        ...

    @abstractmethod
    def complete(self, prompt: str, *, system: str = "", max_tokens: int = 1500) -> LLMResult:
        ...
