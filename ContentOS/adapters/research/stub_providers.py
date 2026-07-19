"""Honest stubs for external research providers.

Each declares itself unavailable until its credential is configured AND a
verified client implementation exists. They never fabricate results.
YouTube Data API / Brave / Perplexity / Firecrawl clients are intentionally
NOT implemented yet — see docs/12_LIMITATIONS_AND_MANUAL_STEPS.md.
"""
from __future__ import annotations

from core.exceptions import ProviderUnavailable

from .base import Evidence, ResearchProvider


class _UnimplementedProvider(ResearchProvider):
    requires: str = ""

    def __init__(self, api_key: str = ""):
        self.api_key = api_key

    def available(self) -> tuple[bool, str]:
        if not self.api_key:
            return False, f"{self.requires} is not set"
        return False, (f"{self.name} client is not implemented yet; the adapter "
                       "interface is ready but no verified API client exists")

    def search(self, query: str, *, limit: int = 5) -> list[Evidence]:
        ok, reason = self.available()
        raise ProviderUnavailable(f"{self.name}: {reason}")


class BraveSearchProvider(_UnimplementedProvider):
    name = "brave_search"
    requires = "BRAVE_SEARCH_API_KEY"


class PerplexityProvider(_UnimplementedProvider):
    name = "perplexity"
    requires = "PERPLEXITY_API_KEY"


class FirecrawlProvider(_UnimplementedProvider):
    name = "firecrawl"
    requires = "FIRECRAWL_API_KEY"


class YouTubeDataProvider(_UnimplementedProvider):
    name = "youtube_data"
    requires = "YOUTUBE_API_KEY"
