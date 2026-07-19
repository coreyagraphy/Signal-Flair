"""Deterministic template fallback.

Produces structured, clearly-labeled heuristic output when no LLM is
available, so the pipeline never blocks offline. Output is marked
``heuristic=True`` and never fabricates facts, trends, or testimonials.
"""
from __future__ import annotations

from .base import LLMAdapter, LLMResult


class TemplateAdapter(LLMAdapter):
    name = "template"

    def available(self) -> tuple[bool, str]:
        return True, "deterministic template fallback (no model required)"

    def complete(self, prompt: str, *, system: str = "", max_tokens: int = 1500) -> LLMResult:
        text = (
            "[HEURISTIC OUTPUT — no LLM was available; this is a deterministic "
            "template, not model-generated strategy]\n"
            "The request could not be sent to a language model. Configure Ollama "
            "(CONTENTOS_OLLAMA_URL) or an API key to enable generated content.\n"
        )
        return LLMResult(text=text, provider=self.name, model="none", heuristic=True)


def resolve_adapter(settings) -> LLMAdapter:
    """Pick the best available adapter per settings.llm_adapter."""
    from .anthropic_adapter import AnthropicAdapter
    from .ollama_adapter import OllamaAdapter

    ollama = OllamaAdapter(url=settings.ollama_url, model=settings.ollama_model)
    anthropic = AnthropicAdapter(api_key=settings.anthropic_api_key)
    template = TemplateAdapter()

    choice = settings.llm_adapter
    if choice == "ollama":
        return ollama
    if choice == "anthropic":
        return anthropic
    if choice == "template":
        return template
    for adapter in (ollama, anthropic):
        ok, _ = adapter.available()
        if ok:
            return adapter
    return template
