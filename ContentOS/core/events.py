"""Append-only JSONL event journal mirrored beside the database.

The database ``job_events`` table is authoritative; this journal is a
human-greppable audit trail under ``data/events/``.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from .logging import redact
from .paths import Paths, safe_name


def append_event(paths: Paths, job_id: str, event_type: str, detail: dict | None = None) -> None:
    paths.data_events.mkdir(parents=True, exist_ok=True)
    record = {
        "at": datetime.now(timezone.utc).isoformat(),
        "job_id": job_id,
        "type": event_type,
        "detail": detail or {},
    }
    line = redact(json.dumps(record, ensure_ascii=False))
    path = paths.data_events / f"{safe_name(job_id)}.jsonl"
    with open(path, "a", encoding="utf-8") as fh:
        fh.write(line + "\n")


def read_events(paths: Paths, job_id: str) -> list[dict]:
    path = paths.data_events / f"{safe_name(job_id)}.jsonl"
    if not path.exists():
        return []
    out = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line:
            try:
                out.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return out
