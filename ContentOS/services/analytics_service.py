"""Analytics ingestion and cautious recommendations.

Snapshots are ingested from JSON/CSV exports (no live platform client yet).
Recommendations always carry sample size and never mutate taste rules from a
single post — correlation is reported as correlation.
"""
from __future__ import annotations

import csv
import json
from pathlib import Path

from core.config import Settings
from core.job_store import JobStore, new_id

MIN_SAMPLE_FOR_RECOMMENDATION = 5

KNOWN_METRICS = {"views", "watch_time_seconds", "avg_percentage_viewed", "likes",
                 "comments", "shares", "saves", "clicks", "leads"}


def ingest_snapshot(store: JobStore, *, platform: str, metrics: dict,
                    plan_id: str | None = None) -> str:
    clean = {k: v for k, v in metrics.items() if k in KNOWN_METRICS}
    snap_id = new_id("an")
    store.conn.execute(
        "INSERT INTO analytics_snapshots(id, plan_id, platform, metrics_json)"
        " VALUES (?,?,?,?)",
        (snap_id, plan_id, platform, json.dumps(clean)))
    return snap_id


def ingest_file(store: JobStore, path: Path) -> int:
    """Ingest a JSON list or CSV of snapshots. Returns count."""
    count = 0
    if path.suffix.lower() == ".json":
        rows = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(rows, dict):
            rows = [rows]
    else:
        with open(path, newline="", encoding="utf-8") as fh:
            rows = list(csv.DictReader(fh))
    for row in rows:
        platform = row.get("platform", "unknown")
        metrics = {k: float(v) for k, v in row.items()
                   if k in KNOWN_METRICS and v not in (None, "")}
        ingest_snapshot(store, platform=platform, metrics=metrics,
                        plan_id=row.get("plan_id"))
        count += 1
    return count


def recommendations(store: JobStore) -> list[dict]:
    rows = store.conn.execute(
        "SELECT platform, metrics_json FROM analytics_snapshots").fetchall()
    by_platform: dict[str, list[dict]] = {}
    for row in rows:
        by_platform.setdefault(row["platform"], []).append(
            json.loads(row["metrics_json"]))
    recs = []
    for platform, snaps in by_platform.items():
        n = len(snaps)
        if n < MIN_SAMPLE_FOR_RECOMMENDATION:
            recs.append({"platform": platform, "sample_size": n,
                         "recommendation": None,
                         "note": f"insufficient sample ({n} < "
                                 f"{MIN_SAMPLE_FOR_RECOMMENDATION}) — no conclusion"})
            continue
        views = [s.get("views", 0) for s in snaps if "views" in s]
        avg_views = sum(views) / len(views) if views else 0
        recs.append({"platform": platform, "sample_size": n,
                     "avg_views": round(avg_views, 1),
                     "recommendation": "correlational only — compare against "
                                       "format/hook metadata before acting",
                     "confidence": "low" if n < 20 else "medium"})
    return recs
