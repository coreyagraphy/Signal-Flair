"""Local Ollama adapter (default runtime brain when Ollama is running)."""
from __future__ import annotations

import json
import urllib.error
import urllib.request

from core.exceptions import ProviderUnavailable

from .base import LLMAdapter, LLMResult


class OllamaAdapter(LLMAdapter):
    name = "ollama"

    def __init__(self, url: str = "http://127.0.0.1:11434", model: str = "qwen3:14b",
                 timeout: int = 300):
        self.url = url.rstrip("/")
        self.model = model
        self.timeout = timeout

    def available(self) -> tuple[bool, str]:
        try:
            with urllib.request.urlopen(f"{self.url}/api/tags", timeout=5) as resp:
                if resp.status == 200:
                    return True, f"Ollama reachable at {self.url}"
        except (urllib.error.URLError, OSError, TimeoutError) as exc:
            return False, f"Ollama unreachable at {self.url}: {exc}"
        return False, f"Ollama returned unexpected status at {self.url}"

    def complete(self, prompt: str, *, system: str = "", max_tokens: int = 1500) -> LLMResult:
        ok, reason = self.available()
        if not ok:
            raise ProviderUnavailable(reason)
        payload = json.dumps({
            "model": self.model, "prompt": prompt, "system": system,
            "stream": False, "options": {"num_predict": max_tokens},
        }).encode("utf-8")
        req = urllib.request.Request(
            f"{self.url}/api/generate", data=payload,
            headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except (urllib.error.URLError, OSError, TimeoutError) as exc:
            raise ProviderUnavailable(f"Ollama request failed: {exc}") from exc
        return LLMResult(text=data.get("response", ""), provider=self.name,
                         model=self.model)
