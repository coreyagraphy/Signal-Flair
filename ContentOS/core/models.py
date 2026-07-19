"""Dataclass views over durable rows, used by services and the CLI."""
from __future__ import annotations

import json
import sqlite3
from dataclasses import dataclass, field


@dataclass
class Asset:
    id: str
    original_path: str
    managed_path: str | None
    sha256: str
    size_bytes: int
    duration_seconds: float | None = None
    width: int | None = None
    height: int | None = None
    frame_rate: float | None = None
    metadata: dict = field(default_factory=dict)

    @classmethod
    def from_row(cls, row: sqlite3.Row) -> "Asset":
        return cls(
            id=row["id"], original_path=row["original_path"],
            managed_path=row["managed_path"], sha256=row["sha256"],
            size_bytes=row["size_bytes"], duration_seconds=row["duration_seconds"],
            width=row["width"], height=row["height"], frame_rate=row["frame_rate"],
            metadata=json.loads(row["metadata_json"]) if row["metadata_json"] else {},
        )


@dataclass
class Job:
    id: str
    asset_id: str
    format_id: str
    stage: str
    status: str
    retry_count: int
    error_code: str | None
    error_message: str | None
    artifacts: dict = field(default_factory=dict)

    @classmethod
    def from_row(cls, row: sqlite3.Row) -> "Job":
        return cls(
            id=row["id"], asset_id=row["asset_id"], format_id=row["format_id"],
            stage=row["stage"], status=row["status"], retry_count=row["retry_count"],
            error_code=row["error_code"], error_message=row["error_message"],
            artifacts=json.loads(row["artifacts_json"] or "{}"),
        )
