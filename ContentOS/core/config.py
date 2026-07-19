"""Typed configuration from environment variables plus config/settings.yaml.

Precedence: environment variable > settings.yaml > built-in default.
Secret values are never logged and never included in ``snapshot()``.
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field, fields
from pathlib import Path
from typing import Any

import yaml

from .exceptions import ConfigError
from .paths import Paths

SECRET_KEYS = {
    "anthropic_api_key", "openai_api_key", "gemini_api_key", "perplexity_api_key",
    "firecrawl_api_key", "brave_search_api_key", "youtube_api_key",
    "zernio_api_key", "zernio_profile_id",
}


def _as_bool(value: Any, default: bool) -> bool:
    if value is None or value == "":
        return default
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


@dataclass
class Settings:
    env: str = "development"
    default_mode: str = "review_required"  # dry_run | review_required | trusted_format_autopilot
    autopilot_min_score: int = 95
    autopilot_approval_count: int = 5
    distribution_dry_run: bool = True

    whisper_model: str = "large-v3"
    whisper_device: str = "cuda"
    whisper_compute_type: str = "float16"
    whisper_language: str = "en"
    whisper_cpu_fallback: bool = True
    transcription_adapter: str = "auto"  # auto | faster_whisper | fixture | energy

    ollama_url: str = "http://127.0.0.1:11434"
    ollama_model: str = "qwen3:14b"
    llm_adapter: str = "auto"  # auto | ollama | anthropic | openai | template

    premiere_mcp_enabled: bool = False
    premiere_mcp_command: str = ""
    premiere_mcp_args: str = ""
    premiere_mcp_timeout_seconds: int = 120

    ingest_stable_seconds: float = 2.0
    ingest_poll_seconds: float = 1.0
    ingest_max_file_gb: float = 64.0
    worker_claim_timeout_minutes: int = 30

    # Cut analysis defaults (mandate section 14) — conservative on purpose.
    minimum_removable_silence_ms: int = 1200
    maximum_natural_pause_ms: int = 900
    pre_cut_padding_ms: int = 150
    post_cut_padding_ms: int = 200
    minimum_clip_duration_ms: int = 800
    minimum_gap_between_cuts_ms: int = 2000
    protect_sentence_endings: bool = True
    silence_noise_floor_db: float = -35.0

    # Secrets (never logged, never snapshotted)
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    gemini_api_key: str = ""
    perplexity_api_key: str = ""
    firecrawl_api_key: str = ""
    brave_search_api_key: str = ""
    youtube_api_key: str = ""
    zernio_api_key: str = ""
    zernio_profile_id: str = ""

    paths: Paths = field(default_factory=Paths)

    def snapshot(self) -> dict:
        """Non-secret configuration as a dict, safe to persist with a job."""
        out = {}
        for f in fields(self):
            if f.name in SECRET_KEYS or f.name == "paths":
                continue
            out[f.name] = getattr(self, f.name)
        return out


_ENV_MAP = {
    "env": "CONTENTOS_ENV",
    "default_mode": "CONTENTOS_DEFAULT_MODE",
    "autopilot_min_score": "CONTENTOS_AUTOPILOT_MIN_SCORE",
    "autopilot_approval_count": "CONTENTOS_AUTOPILOT_APPROVAL_COUNT",
    "distribution_dry_run": "CONTENTOS_DISTRIBUTION_DRY_RUN",
    "whisper_model": "CONTENTOS_WHISPER_MODEL",
    "whisper_device": "CONTENTOS_WHISPER_DEVICE",
    "whisper_compute_type": "CONTENTOS_WHISPER_COMPUTE_TYPE",
    "whisper_language": "CONTENTOS_WHISPER_LANGUAGE",
    "whisper_cpu_fallback": "CONTENTOS_WHISPER_CPU_FALLBACK",
    "transcription_adapter": "CONTENTOS_TRANSCRIPTION_ADAPTER",
    "ollama_url": "CONTENTOS_OLLAMA_URL",
    "ollama_model": "CONTENTOS_OLLAMA_MODEL",
    "llm_adapter": "CONTENTOS_LLM_ADAPTER",
    "premiere_mcp_enabled": "CONTENTOS_PREMIERE_MCP_ENABLED",
    "premiere_mcp_command": "CONTENTOS_PREMIERE_MCP_COMMAND",
    "premiere_mcp_args": "CONTENTOS_PREMIERE_MCP_ARGS",
    "premiere_mcp_timeout_seconds": "CONTENTOS_PREMIERE_MCP_TIMEOUT_SECONDS",
    "anthropic_api_key": "ANTHROPIC_API_KEY",
    "openai_api_key": "OPENAI_API_KEY",
    "gemini_api_key": "GEMINI_API_KEY",
    "perplexity_api_key": "PERPLEXITY_API_KEY",
    "firecrawl_api_key": "FIRECRAWL_API_KEY",
    "brave_search_api_key": "BRAVE_SEARCH_API_KEY",
    "youtube_api_key": "YOUTUBE_API_KEY",
    "zernio_api_key": "ZERNIO_API_KEY",
    "zernio_profile_id": "ZERNIO_PROFILE_ID",
}

_BOOL_FIELDS = {
    "distribution_dry_run", "whisper_cpu_fallback", "premiere_mcp_enabled",
    "protect_sentence_endings",
}
_INT_FIELDS = {
    "autopilot_min_score", "autopilot_approval_count", "premiere_mcp_timeout_seconds",
    "minimum_removable_silence_ms", "maximum_natural_pause_ms", "pre_cut_padding_ms",
    "post_cut_padding_ms", "minimum_clip_duration_ms", "minimum_gap_between_cuts_ms",
    "worker_claim_timeout_minutes",
}
_FLOAT_FIELDS = {"ingest_stable_seconds", "ingest_poll_seconds", "ingest_max_file_gb",
                 "silence_noise_floor_db"}


def load_settings(root: Path | None = None) -> Settings:
    paths = Paths(root)
    settings = Settings(paths=paths)

    yaml_path = paths.config / "settings.yaml"
    file_values: dict = {}
    if yaml_path.exists():
        try:
            loaded = yaml.safe_load(yaml_path.read_text(encoding="utf-8"))
        except yaml.YAMLError as exc:
            raise ConfigError(f"settings.yaml is not valid YAML: {exc}") from exc
        if loaded is not None and not isinstance(loaded, dict):
            raise ConfigError("settings.yaml must contain a mapping")
        file_values = loaded or {}

    for f in fields(Settings):
        if f.name == "paths":
            continue
        raw = None
        env_name = _ENV_MAP.get(f.name, f"CONTENTOS_{f.name.upper()}")
        if os.environ.get(env_name, "") != "":
            raw = os.environ[env_name]
        elif f.name in file_values and f.name not in SECRET_KEYS:
            raw = file_values[f.name]
        if raw is None:
            continue
        try:
            if f.name in _BOOL_FIELDS:
                setattr(settings, f.name, _as_bool(raw, getattr(settings, f.name)))
            elif f.name in _INT_FIELDS:
                setattr(settings, f.name, int(raw))
            elif f.name in _FLOAT_FIELDS:
                setattr(settings, f.name, float(raw))
            else:
                setattr(settings, f.name, str(raw))
        except (TypeError, ValueError) as exc:
            raise ConfigError(f"Invalid value for {f.name}: {raw!r}") from exc

    if settings.default_mode not in {"dry_run", "review_required", "trusted_format_autopilot"}:
        raise ConfigError(f"Unknown default_mode: {settings.default_mode}")
    return settings
