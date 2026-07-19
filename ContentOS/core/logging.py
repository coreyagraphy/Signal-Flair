"""Logging with secret redaction.

Any environment variable whose name looks like a credential is redacted from
every log record, so a leaked key never reaches the log files.
"""
from __future__ import annotations

import logging
import logging.handlers
import os
import re
from pathlib import Path

_SECRET_ENV_PATTERN = re.compile(r"(KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL)", re.IGNORECASE)


def _secret_values() -> list[str]:
    values = []
    for name, value in os.environ.items():
        if _SECRET_ENV_PATTERN.search(name) and value and len(value) >= 8:
            values.append(value)
    return values


class RedactionFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        try:
            message = record.getMessage()
        except Exception:
            return True
        redacted = message
        for value in _secret_values():
            if value in redacted:
                redacted = redacted.replace(value, "[REDACTED]")
        if redacted != message:
            record.msg = redacted
            record.args = ()
        # Tracebacks bypass msg — pre-format and redact them too, otherwise a
        # secret inside an exception message leaks via logger.exception().
        if record.exc_info and not record.exc_text:
            import traceback
            text = "".join(traceback.format_exception(*record.exc_info))
            for value in _secret_values():
                if value in text:
                    text = text.replace(value, "[REDACTED]")
            record.exc_text = text
            record.exc_info = None
        return True


def redact(text: str) -> str:
    for value in _secret_values():
        if value in text:
            text = text.replace(value, "[REDACTED]")
    return text


def setup_logging(log_dir: Path | None = None, level: str = "INFO") -> logging.Logger:
    logger = logging.getLogger("contentos")
    if logger.handlers:
        return logger
    logger.setLevel(level.upper())
    fmt = logging.Formatter("%(asctime)s %(levelname)-7s %(name)s %(message)s")

    console = logging.StreamHandler()
    console.setFormatter(fmt)
    console.addFilter(RedactionFilter())
    logger.addHandler(console)

    if log_dir is not None:
        log_dir.mkdir(parents=True, exist_ok=True)
        handler = logging.handlers.RotatingFileHandler(
            log_dir / "contentos.log", maxBytes=5_000_000, backupCount=3, encoding="utf-8"
        )
        handler.setFormatter(fmt)
        handler.addFilter(RedactionFilter())
        logger.addHandler(handler)
    return logger


def get_logger(name: str = "contentos") -> logging.Logger:
    return logging.getLogger(name)
