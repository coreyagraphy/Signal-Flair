"""Distribution: platform validation, publish plans, dry-run-first execution.

Live publishing requires ALL of: credentials configured, media validation
passed, plan approved, dry-run explicitly disabled, and idempotency active.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import yaml

from adapters.distribution.dry_run_adapter import DryRunAdapter
from adapters.distribution.live_adapters import YouTubeAdapter, ZernioAdapter
from core.config import Settings
from core.exceptions import ProviderUnavailable, ValidationFailed
from core.hashing import sha256_text
from core.job_store import JobStore, new_id

from . import media_probe_service, script_service


def load_platform_rules(settings: Settings) -> dict:
    path = settings.paths.config / "platforms.yaml"
    if not path.exists():
        return {}
    return (yaml.safe_load(path.read_text(encoding="utf-8")) or {}).get("platforms", {})


def validate_media_for_platform(media: Path, rules: dict) -> list[str]:
    problems = []
    if not media.exists():
        return [f"media file missing: {media}"]
    meta = media_probe_service.probe_media(media)
    max_seconds = rules.get("max_duration_seconds")
    if max_seconds and meta["duration_seconds"] > max_seconds:
        problems.append(f"duration {meta['duration_seconds']:.1f}s exceeds "
                        f"platform max {max_seconds}s")
    min_seconds = rules.get("min_duration_seconds")
    if min_seconds and meta["duration_seconds"] < min_seconds:
        problems.append(f"duration below platform minimum {min_seconds}s")
    aspect = rules.get("aspect")
    if aspect and meta["width"] and meta["height"]:
        want_w, want_h = (int(x) for x in aspect.split(":"))
        actual = meta["width"] / meta["height"]
        expected = want_w / want_h
        if abs(actual - expected) > 0.05:
            problems.append(f"aspect {meta['width']}x{meta['height']} != {aspect}")
    max_gb = rules.get("max_file_gb")
    if max_gb and media.stat().st_size > max_gb * 1024**3:
        problems.append(f"file exceeds platform max {max_gb} GB")
    return problems


def run(settings: Settings, store: JobStore, job_id: str) -> dict:
    """Stage runner for 'distribution_prepared': build validated publish plans."""
    artifacts = store.artifacts(job_id)
    script_service.write_social_package(settings, store, job_id)
    social = json.loads(Path(artifacts.get("social_package") or
                             store.artifacts(job_id)["social_package"])
                        .read_text(encoding="utf-8"))
    rules_by_platform = load_platform_rules(settings)

    media_map = {
        "youtube_short": artifacts.get("final_render") or artifacts.get("draft_vertical"),
        "tiktok": artifacts.get("final_render") or artifacts.get("draft_vertical"),
        "instagram_reel": artifacts.get("final_render") or artifacts.get("draft_vertical"),
        "linkedin": artifacts.get("final_render") or artifacts.get("draft_vertical"),
    }
    plans = []
    for platform, media_path in media_map.items():
        if not media_path:
            continue
        media = Path(media_path)
        problems = validate_media_for_platform(
            media, rules_by_platform.get(platform, {}))
        copy = social["platforms"].get(platform, {})
        idem = sha256_text(f"{job_id}:{platform}:{media.name}")[:32]
        plan = {
            "plan_id": new_id("pub"),
            "job_id": job_id,
            "platform": platform,
            "media_path": str(media),
            "title": copy.get("title", ""),
            "description": copy.get("description", ""),
            "scheduled_at": None,
            "timezone": "America/Indiana/Indianapolis",
            "privacy": "private",
            "idempotency_key": idem,
            "dry_run": True,
            "approval_state": "pending",
            "validation": {"passed": not problems, "problems": problems},
        }
        try:
            store.conn.execute(
                "INSERT INTO publish_plans(id, job_id, platform, media_path, title,"
                " description, scheduled_at, timezone, privacy, idempotency_key,"
                " approval_state, dry_run, validation_json, plan_json)"
                " VALUES (?,?,?,?,?,?,?,?,?,?,?,1,?,?)",
                (plan["plan_id"], job_id, platform, plan["media_path"], plan["title"],
                 plan["description"], None, plan["timezone"], plan["privacy"], idem,
                 "pending", json.dumps(plan["validation"]), json.dumps(plan)))
        except Exception:
            # Idempotency collision — this plan already exists; keep existing.
            continue
        plans.append(plan)

    job_dir = settings.paths.job_dir(job_id)
    out = job_dir / "publish_plans.json"
    out.write_text(json.dumps({"plans": plans}, indent=2, ensure_ascii=False),
                   encoding="utf-8")
    store.set_artifact(job_id, "publish_plan", out)
    return {"plans": len(plans),
            "validation_failures": sum(1 for p in plans
                                       if not p["validation"]["passed"])}


def execute(settings: Settings, store: JobStore, job_id: str,
            *, dry_run: bool = True) -> list[dict]:
    """Execute publish plans. Live execution is heavily guarded."""
    rows = store.conn.execute(
        "SELECT * FROM publish_plans WHERE job_id = ?", (job_id,)).fetchall()
    if not rows:
        raise ValidationFailed(f"No publish plans exist for {job_id}; run the "
                               "distribution_prepared stage first")
    dry = DryRunAdapter(settings.paths.output_social)
    results = []
    for row in rows:
        plan = json.loads(row["plan_json"])
        effective_dry = dry_run or settings.distribution_dry_run or bool(row["dry_run"])
        plan["dry_run"] = effective_dry
        if not effective_dry:
            validation = json.loads(row["validation_json"] or "{}")
            if not validation.get("passed"):
                results.append({"platform": row["platform"], "status": "blocked",
                                "reason": "media validation failed"})
                continue
            if row["approval_state"] != "approved":
                results.append({"platform": row["platform"], "status": "blocked",
                                "reason": "plan not approved"})
                continue
            adapter = {"zernio": ZernioAdapter(settings.zernio_api_key,
                                               settings.zernio_profile_id),
                       }.get("zernio")
            try:
                result = adapter.publish(plan)
            except ProviderUnavailable as exc:
                result = {"status": "blocked", "reason": str(exc)}
        else:
            result = dry.publish(plan)
        store.conn.execute(
            "INSERT INTO publish_events(plan_id, event_type, detail_json)"
            " VALUES (?,?,?)",
            (row["id"], result.get("status", "unknown"), json.dumps(result)))
        results.append({"platform": row["platform"], **result})
    return results
