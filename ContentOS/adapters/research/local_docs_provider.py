"""Local documents provider: searches Knowledge_Base/research markdown/text.

Always available, fully offline. Source class is 'secondary' unless the
document declares 'source_class: primary' in a leading metadata line.
"""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

from core.hashing import sha256_text

from .base import Evidence, ResearchProvider


class LocalDocsProvider(ResearchProvider):
    name = "local_docs"

    def __init__(self, research_dir: Path):
        self.research_dir = research_dir

    def available(self) -> tuple[bool, str]:
        if not self.research_dir.exists():
            return False, f"research directory missing: {self.research_dir}"
        return True, f"local documents at {self.research_dir}"

    def search(self, query: str, *, limit: int = 5) -> list[Evidence]:
        terms = [t.lower() for t in query.split() if len(t) > 2]
        results: list[tuple[float, Evidence]] = []
        now = datetime.now(timezone.utc).isoformat()
        for path in sorted(self.research_dir.rglob("*")):
            if path.suffix.lower() not in (".md", ".txt") or not path.is_file():
                continue
            try:
                text = path.read_text(encoding="utf-8", errors="replace")
            except OSError:
                continue
            lower = text.lower()
            hits = sum(lower.count(t) for t in terms)
            if hits == 0:
                continue
            # Extract the most relevant paragraph as evidence.
            best_para, best_score = "", 0
            for para in text.split("\n\n"):
                score = sum(para.lower().count(t) for t in terms)
                if score > best_score:
                    best_para, best_score = para.strip(), score
            relevance = min(1.0, hits / (len(terms) * 3 + 1))
            results.append((relevance, Evidence(
                provider=self.name, query=query,
                evidence=best_para[:1500],
                url=path.as_uri(), title=path.stem, publisher="local",
                captured_at=now, confidence=0.6, relevance=relevance,
                source_class="secondary",
                content_sha256=sha256_text(text),
            )))
        results.sort(key=lambda r: r[0], reverse=True)
        return [e for _, e in results[:limit]]
