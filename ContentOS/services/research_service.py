"""Research service: provider fan-out, evidence capture, caching.

Evidence is cached under data/research keyed by (provider, query) so runs
are reproducible and repeat queries cost nothing. All evidence rows are
persisted to research_sources with full provenance.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from adapters.research.base import Evidence, ResearchProvider
from adapters.research.local_docs_provider import LocalDocsProvider
from adapters.research.stub_providers import (BraveSearchProvider,
                                              FirecrawlProvider,
                                              PerplexityProvider,
                                              YouTubeDataProvider)
from core.config import Settings
from core.hashing import sha256_text
from core.job_store import JobStore, new_id
from core.logging import get_logger

log = get_logger("contentos.research")


def build_providers(settings: Settings) -> list[ResearchProvider]:
    return [
        LocalDocsProvider(settings.paths.knowledge / "research"),
        BraveSearchProvider(settings.brave_search_api_key),
        PerplexityProvider(settings.perplexity_api_key),
        FirecrawlProvider(settings.firecrawl_api_key),
        YouTubeDataProvider(settings.youtube_api_key),
    ]


def _cache_path(settings: Settings, provider: str, query: str) -> Path:
    key = sha256_text(f"{provider}::{query}")[:24]
    return settings.paths.data_research / f"{provider}_{key}.json"


def research(settings: Settings, store: JobStore | None, query: str,
             *, limit: int = 5, use_cache: bool = True) -> list[Evidence]:
    all_evidence: list[Evidence] = []
    for provider in build_providers(settings):
        ok, reason = provider.available()
        if not ok:
            log.debug("Provider %s unavailable: %s", provider.name, reason)
            continue
        cache = _cache_path(settings, provider.name, query)
        if use_cache and cache.exists():
            cached = json.loads(cache.read_text(encoding="utf-8"))
            all_evidence.extend(Evidence(**e) for e in cached)
            continue
        try:
            results = provider.search(query, limit=limit)
        except Exception as exc:
            log.warning("Provider %s failed for %r: %s", provider.name, query, exc)
            continue
        cache.parent.mkdir(parents=True, exist_ok=True)
        cache.write_text(json.dumps([e.to_dict() for e in results], indent=2,
                                    ensure_ascii=False), encoding="utf-8")
        all_evidence.extend(results)

    if store is not None:
        now = datetime.now(timezone.utc).isoformat()
        for ev in all_evidence:
            store.conn.execute(
                "INSERT INTO research_sources(id, url, title, publisher, published_at,"
                " captured_at, query, provider, evidence, confidence, relevance,"
                " source_class, content_sha256) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (new_id("src"), ev.url, ev.title, ev.publisher, ev.published_at,
                 ev.captured_at or now, ev.query, ev.provider, ev.evidence,
                 ev.confidence, ev.relevance, ev.source_class, ev.content_sha256))
    return all_evidence


def classify_signal(evidence_list: list[Evidence]) -> str:
    """Verified trend > emerging signal > anecdotal > internal hypothesis."""
    if not evidence_list:
        return "internal_hypothesis"
    primary = sum(1 for e in evidence_list if e.source_class == "primary")
    secondary = sum(1 for e in evidence_list if e.source_class == "secondary")
    if primary >= 2:
        return "verified_trend"
    if primary + secondary >= 2:
        return "emerging_signal"
    return "anecdotal_signal"
