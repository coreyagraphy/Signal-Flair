"""Safe subprocess execution: argument arrays, timeouts, typed errors.

Never build shell strings from filenames. Every external call goes through
``run_command`` so injection, hangs, and silent failures are impossible to
introduce by accident.
"""
from __future__ import annotations

import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

from .exceptions import SubprocessFailed, ToolMissing
from .logging import get_logger, redact

log = get_logger("contentos.proc")


@dataclass
class CommandResult:
    args: list[str]
    returncode: int
    stdout: str
    stderr: str


def which(tool: str) -> str:
    path = shutil.which(tool)
    if not path:
        raise ToolMissing(f"Required tool not found on PATH: {tool}")
    return path


def run_command(args: list[str], *, timeout: int = 600, check: bool = True,
                cwd: Path | None = None) -> CommandResult:
    if not args or not isinstance(args, list):
        raise ValueError("run_command requires a non-empty argument list")
    display = redact(" ".join(str(a) for a in args))
    log.debug("exec: %s", display)
    try:
        proc = subprocess.run(
            [str(a) for a in args],
            capture_output=True, text=True, timeout=timeout,
            cwd=str(cwd) if cwd else None,
            shell=False,
        )
    except FileNotFoundError as exc:
        raise ToolMissing(f"Executable not found: {args[0]}") from exc
    except subprocess.TimeoutExpired as exc:
        raise SubprocessFailed(f"Timed out after {timeout}s: {display}") from exc
    result = CommandResult(args=[str(a) for a in args], returncode=proc.returncode,
                           stdout=proc.stdout or "", stderr=proc.stderr or "")
    if check and proc.returncode != 0:
        tail = (proc.stderr or proc.stdout or "").strip()[-800:]
        raise SubprocessFailed(
            f"Command failed ({proc.returncode}): {display}\n{redact(tail)}"
        )
    return result


def expect_output_file(path: Path, description: str) -> Path:
    if not path.exists() or path.stat().st_size == 0:
        raise SubprocessFailed(f"Expected output missing or empty: {description} at {path}",
                               retryable=False)
    return path
