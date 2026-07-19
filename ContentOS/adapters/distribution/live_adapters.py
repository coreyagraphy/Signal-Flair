"""Live distribution adapters: Zernio and direct YouTube.

Both are credential-gated stubs by design: the adapter interface, validation,
idempotency, and dry-run guard are real, but no live API client has been
verified against current official documentation yet (mandate section 29
forbids guessing endpoints). They refuse honestly instead of faking success.
"""
from __future__ import annotations

from core.exceptions import ProviderUnavailable

from .base import DistributionAdapter


class ZernioAdapter(DistributionAdapter):
    name = "zernio"

    def __init__(self, api_key: str = "", profile_id: str = ""):
        self.api_key = api_key
        self.profile_id = profile_id

    def available(self) -> tuple[bool, str]:
        if not self.api_key or not self.profile_id:
            return False, "ZERNIO_API_KEY / ZERNIO_PROFILE_ID not configured"
        return False, ("credentials configured, but the Zernio API client has not "
                       "been implemented against verified current documentation")

    def publish(self, plan: dict) -> dict:
        if plan.get("dry_run", True):
            raise ProviderUnavailable(
                "zernio: refusing — plan is dry_run; use the dry_run adapter")
        ok, reason = self.available()
        raise ProviderUnavailable(f"zernio: {reason}")


class YouTubeAdapter(DistributionAdapter):
    name = "youtube"

    def __init__(self, api_key: str = ""):
        self.api_key = api_key

    def available(self) -> tuple[bool, str]:
        if not self.api_key:
            return False, "YOUTUBE_API_KEY not configured (upload also requires OAuth)"
        return False, ("API key configured, but YouTube upload requires an OAuth "
                       "client that has not been implemented/verified yet")

    def publish(self, plan: dict) -> dict:
        if plan.get("dry_run", True):
            raise ProviderUnavailable(
                "youtube: refusing — plan is dry_run; use the dry_run adapter")
        ok, reason = self.available()
        raise ProviderUnavailable(f"youtube: {reason}")
