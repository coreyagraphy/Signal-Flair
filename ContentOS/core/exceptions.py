"""Typed exceptions with stable error codes."""
from __future__ import annotations


class ContentOSError(Exception):
    code = "contentos_error"
    retryable = False

    def __init__(self, message: str, *, code: str | None = None, retryable: bool | None = None):
        super().__init__(message)
        if code is not None:
            self.code = code
        if retryable is not None:
            self.retryable = retryable


class ConfigError(ContentOSError):
    code = "config_error"


class ValidationFailed(ContentOSError):
    code = "validation_failed"


class MediaError(ContentOSError):
    code = "media_error"


class ToolMissing(ContentOSError):
    code = "tool_missing"


class SubprocessFailed(ContentOSError):
    code = "subprocess_failed"
    retryable = True


class DuplicateAsset(ContentOSError):
    code = "duplicate_asset"


class StageBlocked(ContentOSError):
    """A stage cannot run because an external capability is unavailable."""
    code = "stage_blocked"


class TransitionError(ContentOSError):
    code = "invalid_transition"


class ProviderUnavailable(ContentOSError):
    """An optional provider (LLM, research, distribution) is not configured."""
    code = "provider_unavailable"


class UnsupportedOperation(ContentOSError):
    """A capability-driven adapter does not support the requested operation.

    Adapters must raise this instead of faking success (mandate section 26).
    """
    code = "unsupported_operation"


class QualityGateFailed(ContentOSError):
    code = "quality_gate_failed"
