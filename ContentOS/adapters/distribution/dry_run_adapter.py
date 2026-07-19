"""Dry-run filesystem exporter: writes the exact package a live adapter
would send, into Output/social/<platform>/ — nothing leaves the machine."""
from __future__ import annotations

import json
import shutil
from pathlib import Path

from core.paths import safe_name

from .base import DistributionAdapter


class DryRunAdapter(DistributionAdapter):
    name = "dry_run"

    def __init__(self, social_dir: Path):
        self.social_dir = social_dir

    def available(self) -> tuple[bool, str]:
        return True, "filesystem exporter (no credentials required)"

    def publish(self, plan: dict) -> dict:
        platform_dir = self.social_dir / safe_name(plan["platform"])
        platform_dir.mkdir(parents=True, exist_ok=True)
        key = safe_name(plan["idempotency_key"])
        manifest_path = platform_dir / f"{key}.json"
        if manifest_path.exists():
            return {"status": "skipped", "reason": "idempotency key already exported",
                    "path": str(manifest_path)}
        media = Path(plan["media_path"])
        media_dest = None
        if media.exists():
            media_dest = platform_dir / f"{key}{media.suffix}"
            shutil.copy2(media, media_dest)
        manifest_path.write_text(json.dumps({**plan, "exported_media":
                                             str(media_dest) if media_dest else None},
                                            indent=2, ensure_ascii=False),
                                 encoding="utf-8")
        return {"status": "exported", "path": str(manifest_path),
                "media": str(media_dest) if media_dest else None}
