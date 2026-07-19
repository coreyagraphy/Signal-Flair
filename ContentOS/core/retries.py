"""Bounded retry with exponential backoff for retryable operations."""
from __future__ import annotations

import time
from typing import Callable, TypeVar

from .exceptions import ContentOSError

T = TypeVar("T")


def with_retries(fn: Callable[[], T], *, attempts: int = 3, base_delay: float = 1.0,
                 max_delay: float = 30.0, sleep: Callable[[float], None] = time.sleep) -> T:
    last: Exception | None = None
    for attempt in range(attempts):
        try:
            return fn()
        except ContentOSError as exc:
            if not exc.retryable or attempt == attempts - 1:
                raise
            last = exc
            sleep(min(base_delay * (2 ** attempt), max_delay))
    raise last  # pragma: no cover - unreachable
