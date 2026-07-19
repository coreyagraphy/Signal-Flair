"""SQLite persistence with ordered SQL migrations.

The database is the single durable source of truth. Streamlit/CLI state is
always derived from here, never the other way around.
"""
from __future__ import annotations

import os
import re
import sqlite3
import threading
from pathlib import Path

from .paths import Paths

_local = threading.local()


def database_path(paths: Paths) -> Path:
    url = os.environ.get("CONTENTOS_DATABASE_URL", "").strip()
    if url.startswith("sqlite:///"):
        raw = url[len("sqlite:///"):]
        p = Path(raw)
        if not p.is_absolute():
            p = paths.root / raw
        return p
    return paths.data / "contentos.db"


def connect(paths: Paths) -> sqlite3.Connection:
    """Per-thread connection with WAL and foreign keys enabled."""
    db_path = database_path(paths)
    key = str(db_path)
    cache = getattr(_local, "conns", None)
    if cache is None:
        cache = _local.conns = {}
    conn = cache.get(key)
    if conn is not None:
        return conn
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path, timeout=30, isolation_level=None)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.execute("PRAGMA busy_timeout=30000")
    cache[key] = conn
    return conn


_MIGRATION_NAME = re.compile(r"^(\d{4})_[a-z0-9_]+\.sql$")


def migrate(paths: Paths) -> list[str]:
    """Apply pending migrations in filename order. Returns names applied."""
    conn = connect(paths)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS schema_migrations ("
        " name TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime('now')))"
    )
    applied = {row["name"] for row in conn.execute("SELECT name FROM schema_migrations")}
    ran: list[str] = []
    migration_files = sorted(paths.migrations.glob("*.sql"))
    for path in migration_files:
        if not _MIGRATION_NAME.match(path.name):
            raise ValueError(f"Migration name not in NNNN_snake_case.sql form: {path.name}")
        if path.name in applied:
            continue
        sql = path.read_text(encoding="utf-8")
        # executescript issues its own implicit COMMIT, so migrations are not
        # wrapped in an outer transaction; a failed script simply is not
        # recorded and re-runs (all statements use IF NOT EXISTS).
        conn.executescript(sql)
        conn.execute("INSERT INTO schema_migrations(name) VALUES (?)", (path.name,))
        ran.append(path.name)
    return ran


def reset_connection_cache() -> None:
    cache = getattr(_local, "conns", None)
    if cache:
        for conn in cache.values():
            try:
                conn.close()
            except Exception:
                pass
        _local.conns = {}
