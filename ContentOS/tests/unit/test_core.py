"""Unit tests: hashing, state machine, config, paths, retries, redaction."""
from __future__ import annotations

import pytest

from core import state_machine
from core.exceptions import ContentOSError, TransitionError
from core.hashing import sha256_file, sha256_text
from core.logging import redact
from core.paths import is_within, safe_name
from core.retries import with_retries


def test_sha256_file_stable(tmp_path):
    f = tmp_path / "a.bin"
    f.write_bytes(b"content-os")
    assert sha256_file(f) == sha256_file(f)
    assert sha256_file(f) != sha256_text("different")


def test_state_machine_linear_advance():
    state_machine.check_transition("discovered", "ingested")
    state_machine.check_transition("ingested", "analyzed")
    with pytest.raises(TransitionError):
        state_machine.check_transition("discovered", "transcribed")


def test_state_machine_review_branches():
    assert "revision_requested" in state_machine.allowed_next("awaiting_review")
    assert "approved" in state_machine.allowed_next("awaiting_review")
    assert "edit_planned" in state_machine.allowed_next("revision_requested")
    with pytest.raises(TransitionError):
        state_machine.check_transition("approved", "discovered")


def test_failed_always_allowed():
    state_machine.check_transition("transcribed", "failed")


def test_safe_name_blocks_traversal():
    assert "/" not in safe_name("../../etc/passwd")
    assert "\\" not in safe_name("..\\..\\windows\\system32")
    assert safe_name("...") == "unnamed"
    assert safe_name("") == "unnamed"
    assert len(safe_name("x" * 500)) <= 180


def test_is_within(tmp_path):
    child = tmp_path / "a" / "b.txt"
    child.parent.mkdir()
    child.write_text("x")
    assert is_within(child, tmp_path)
    assert not is_within(tmp_path.parent, tmp_path)


def test_retries_bounded():
    calls = []

    def flaky():
        calls.append(1)
        raise ContentOSError("boom", retryable=True)

    with pytest.raises(ContentOSError):
        with_retries(flaky, attempts=3, sleep=lambda _t: None)
    assert len(calls) == 3


def test_non_retryable_fails_fast():
    calls = []

    def broken():
        calls.append(1)
        raise ContentOSError("fatal", retryable=False)

    with pytest.raises(ContentOSError):
        with_retries(broken, attempts=5, sleep=lambda _t: None)
    assert len(calls) == 1


def test_secret_redaction(monkeypatch):
    monkeypatch.setenv("FAKE_API_KEY", "supersecretvalue123")
    assert "supersecretvalue123" not in redact("key is supersecretvalue123 ok")
    assert "[REDACTED]" in redact("key is supersecretvalue123 ok")


def test_config_loads_and_snapshots(settings):
    snap = settings.snapshot()
    assert "anthropic_api_key" not in snap
    assert "zernio_api_key" not in snap
    assert snap["default_mode"] == "review_required"
    assert snap["distribution_dry_run"] is True
