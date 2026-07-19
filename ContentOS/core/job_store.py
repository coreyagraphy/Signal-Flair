"""Durable job storage: creation, claiming, atomic transitions, artifacts."""
from __future__ import annotations

import json
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path

from . import state_machine
from .config import Settings
from .database import connect
from .exceptions import DuplicateAsset, TransitionError


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"


class JobStore:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.conn = connect(settings.paths)

    # ----- assets -------------------------------------------------------
    def find_asset_by_hash(self, sha256: str) -> sqlite3.Row | None:
        return self.conn.execute(
            "SELECT * FROM source_assets WHERE sha256 = ?", (sha256,)
        ).fetchone()

    def create_asset(self, *, original_path: Path, sha256: str, size_bytes: int) -> str:
        if self.find_asset_by_hash(sha256) is not None:
            raise DuplicateAsset(f"Asset with hash {sha256[:12]}… already ingested")
        asset_id = new_id("asset")
        self.conn.execute(
            "INSERT INTO source_assets(id, original_path, sha256, size_bytes) VALUES (?,?,?,?)",
            (asset_id, str(original_path), sha256, size_bytes),
        )
        return asset_id

    def update_asset(self, asset_id: str, **cols) -> None:
        allowed = {"managed_path", "container", "duration_seconds", "width", "height",
                   "frame_rate", "video_codec", "audio_codec", "audio_sample_rate",
                   "audio_channels", "metadata_json", "project_id"}
        bad = set(cols) - allowed
        if bad:
            raise ValueError(f"Unknown asset columns: {bad}")
        sets = ", ".join(f"{k} = ?" for k in cols)
        self.conn.execute(
            f"UPDATE source_assets SET {sets} WHERE id = ?", (*cols.values(), asset_id)
        )

    def get_asset(self, asset_id: str) -> sqlite3.Row | None:
        return self.conn.execute(
            "SELECT * FROM source_assets WHERE id = ?", (asset_id,)
        ).fetchone()

    # ----- jobs ---------------------------------------------------------
    def create_job(self, *, asset_id: str, format_id: str = "talking_head_short") -> str:
        job_id = new_id("job")
        self.conn.execute(
            "INSERT INTO jobs(id, asset_id, format_id, stage, status, config_snapshot_json)"
            " VALUES (?,?,?,?,?,?)",
            (job_id, asset_id, format_id, "discovered", "pending",
             json.dumps(self.settings.snapshot())),
        )
        self.add_event(job_id, "job_created", {"asset_id": asset_id, "format": format_id})
        return job_id

    def get_job(self, job_id: str) -> sqlite3.Row | None:
        return self.conn.execute("SELECT * FROM jobs WHERE id = ?", (job_id,)).fetchone()

    def list_jobs(self, stage: str | None = None, status: str | None = None) -> list[sqlite3.Row]:
        sql, params = "SELECT * FROM jobs", []
        clauses = []
        if stage:
            clauses.append("stage = ?"); params.append(stage)
        if status:
            clauses.append("status = ?"); params.append(status)
        if clauses:
            sql += " WHERE " + " AND ".join(clauses)
        sql += " ORDER BY created_at DESC"
        return list(self.conn.execute(sql, params))

    def claim_job(self, job_id: str, worker: str) -> bool:
        """Atomically claim a job. Also reclaims claims older than the timeout."""
        timeout_min = self.settings.worker_claim_timeout_minutes
        cur = self.conn.execute(
            "UPDATE jobs SET claimed_by = ?, claimed_at = ?, updated_at = ?"
            " WHERE id = ? AND (claimed_by IS NULL OR claimed_by = ?"
            "   OR claimed_at < datetime('now', ?))",
            (worker, _now(), _now(), job_id, worker, f"-{timeout_min} minutes"),
        )
        return cur.rowcount == 1

    def release_job(self, job_id: str) -> None:
        self.conn.execute(
            "UPDATE jobs SET claimed_by = NULL, claimed_at = NULL, updated_at = ? WHERE id = ?",
            (_now(), job_id),
        )

    def transition(self, job_id: str, target_stage: str, *, status: str = "pending",
                   error_code: str | None = None, error_message: str | None = None) -> None:
        """Atomic, validated stage transition."""
        job = self.get_job(job_id)
        if job is None:
            raise TransitionError(f"Unknown job: {job_id}")
        current = job["stage"]
        if target_stage != current:
            state_machine.check_transition(current, target_stage)
        cur = self.conn.execute(
            "UPDATE jobs SET stage = ?, status = ?, error_code = ?, error_message = ?,"
            " updated_at = ? WHERE id = ? AND stage = ?",
            (target_stage, status, error_code, error_message, _now(), job_id, current),
        )
        if cur.rowcount != 1:
            raise TransitionError(
                f"Concurrent modification: job {job_id} left stage {current} "
                "while transitioning")
        self.add_event(job_id, "transition",
                       {"from": current, "to": target_stage, "status": status,
                        "error_code": error_code})

    def mark_stage(self, job_id: str, stage: str, status: str,
                   detail: dict | None = None) -> None:
        now = _now()
        self.conn.execute(
            "INSERT INTO job_stages(job_id, stage, status, started_at, finished_at, detail_json)"
            " VALUES (?,?,?,?,?,?)"
            " ON CONFLICT(job_id, stage) DO UPDATE SET status = excluded.status,"
            "   finished_at = excluded.finished_at, detail_json = excluded.detail_json",
            (job_id, stage, status,
             now if status == "running" else None,
             now if status in ("done", "failed", "blocked") else None,
             json.dumps(detail or {})),
        )

    def set_error(self, job_id: str, code: str, message: str) -> None:
        self.conn.execute(
            "UPDATE jobs SET status = 'failed', error_code = ?, error_message = ?,"
            " retry_count = retry_count + 1, updated_at = ? WHERE id = ?",
            (code, message[:2000], _now(), job_id),
        )
        self.add_event(job_id, "error", {"code": code, "message": message[:2000]})

    def clear_error(self, job_id: str) -> None:
        self.conn.execute(
            "UPDATE jobs SET status = 'pending', error_code = NULL, error_message = NULL,"
            " updated_at = ? WHERE id = ?", (_now(), job_id),
        )

    # ----- artifacts ----------------------------------------------------
    def set_artifact(self, job_id: str, key: str, path: str | Path) -> None:
        job = self.get_job(job_id)
        artifacts = json.loads(job["artifacts_json"] or "{}")
        artifacts[key] = str(path)
        self.conn.execute(
            "UPDATE jobs SET artifacts_json = ?, updated_at = ? WHERE id = ?",
            (json.dumps(artifacts), _now(), job_id),
        )

    def artifacts(self, job_id: str) -> dict:
        job = self.get_job(job_id)
        return json.loads(job["artifacts_json"] or "{}") if job else {}

    # ----- events -------------------------------------------------------
    def add_event(self, job_id: str, event_type: str, detail: dict | None = None) -> None:
        self.conn.execute(
            "INSERT INTO job_events(job_id, event_type, detail_json) VALUES (?,?,?)",
            (job_id, event_type, json.dumps(detail or {})),
        )

    def events(self, job_id: str) -> list[sqlite3.Row]:
        return list(self.conn.execute(
            "SELECT * FROM job_events WHERE job_id = ? ORDER BY id", (job_id,)
        ))
