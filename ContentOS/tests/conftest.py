"""Shared fixtures: every test runs in an isolated CONTENTOS_ROOT sandbox."""
from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO))

from core.database import reset_connection_cache  # noqa: E402


@pytest.fixture()
def sandbox(tmp_path, monkeypatch):
    """Isolated Content OS root with repo config/schemas/migrations copied in."""
    root = tmp_path / "contentos"
    root.mkdir()
    for rel in ("config", "formats", "schemas", "database", "Knowledge_Base",
                "review", "premiere"):
        src = REPO / rel
        if src.exists():
            shutil.copytree(src, root / rel, dirs_exist_ok=True)
    monkeypatch.setenv("CONTENTOS_ROOT", str(root))
    monkeypatch.setenv("CONTENTOS_LLM_ADAPTER", "template")
    monkeypatch.delenv("CONTENTOS_DATABASE_URL", raising=False)
    reset_connection_cache()
    yield root
    reset_connection_cache()


@pytest.fixture()
def settings(sandbox):
    from core.config import load_settings
    s = load_settings()
    s.paths.ensure()
    return s


@pytest.fixture()
def store(settings):
    from core.database import migrate
    from core.job_store import JobStore
    migrate(settings.paths)
    return JobStore(settings)


@pytest.fixture(scope="session")
def synthetic_media(tmp_path_factory):
    """Session-scoped synthetic MP4 + transcript fixture (needs ffmpeg)."""
    import shutil as _shutil
    if not _shutil.which("ffmpeg"):
        pytest.skip("ffmpeg not available")
    out_dir = tmp_path_factory.mktemp("media")
    from scripts.generate_test_media import main as gen
    video = gen(out_dir)
    return video
