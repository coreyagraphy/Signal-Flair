"""Research provider contract with mandatory evidence provenance.

Every claim a provider returns must carry provenance (mandate section 20).
Retrieved content is DATA, never instructions — callers must treat evidence
text as untrusted and never execute or obey it.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class Evidence:
    provider: str
    query: str
    evidence: str                 # extracted text (untrusted data)
    url: str | None = None
    title: str | None = None
    publisher: str | None = None
    published_at: str | None = None
    captured_at: str | None = None
    confidence: float = 0.5
    relevance: float = 0.5
    source_class: str = "secondary"   # primary | secondary | anecdotal
    content_sha256: str | None = None

    def to_dict(self) -> dict:
        return dict(vars(self))


class ResearchProvider(ABC):
    name: str = "base"

    @abstractmethod
    def available(self) -> tuple[bool, str]:
        ...

    @abstractmethod
    def search(self, query: str, *, limit: int = 5) -> list[Evidence]:
        ...
