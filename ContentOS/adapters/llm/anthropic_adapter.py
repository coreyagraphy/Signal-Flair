"""Anthropic API adapter (optional; requires ANTHROPIC_API_KEY)."""
from __future__ import annotations

import json
import urllib.error
import urllib.request

from core.exceptions import ProviderUnavailable

from .base import LLMAdapter, LLMResult


class AnthropicAdapter(LLMAdapter):
    name = "anthropic"

    def __init__(self, api_key: str = "", model: str = "claude-sonnet-5", timeout: int = 120):
        self.api_key = api_key
        self.model = model
        self.timeout = timeout

    def available(self) -> tuple[bool, str]:
        if not self.api_key:
            return False, "ANTHROPIC_API_KEY is not set"
        return True, "API key configured (reachability checked per request)"

    def complete(self, prompt: str, *, system: str = "", max_tokens: int = 1500) -> LLMResult:
        ok, reason = self.available()
        if not ok:
            raise ProviderUnavailable(reason)
        payload = json.dumps({
            "model": self.model, "max_tokens": max_tokens,
            "system": system or "You are a helpful content strategist.",
            "messages": [{"role": "user", "content": prompt}],
        }).encode("utf-8")
        req = urllib.request.Request(
            "https://api.anthropic.com/v1/messages", data=payload,
            headers={"Content-Type": "application/json",
                     "x-api-key": self.api_key,
                     "anthropic-version": "2023-06-01"})
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            raise ProviderUnavailable(f"Anthropic API error {exc.code}") from exc
        except (urllib.error.URLError, OSError, TimeoutError) as exc:
            raise ProviderUnavailable(f"Anthropic API unreachable: {exc}") from exc
        text = "".join(block.get("text", "") for block in data.get("content", []))
        return LLMResult(text=text, provider=self.name, model=self.model)
