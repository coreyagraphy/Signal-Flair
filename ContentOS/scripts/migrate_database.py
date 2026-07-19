#!/usr/bin/env python3
"""Standalone migration runner (same as `contentos_cli.py migrate`)."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.config import load_settings  # noqa: E402
from core.database import migrate      # noqa: E402


def main() -> int:
    settings = load_settings()
    settings.paths.ensure()
    ran = migrate(settings.paths)
    print(f"Applied {len(ran)} migration(s): {ran or 'none pending'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
