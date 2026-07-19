#!/usr/bin/env python3
"""Inspect a Premiere MCP checkout BEFORE trusting or running it.

Read-only: reports license, install scripts, network calls, and filesystem
access patterns so the operator can review third-party code before use
(mandate section 26). Never executes the inspected code.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

RISK_PATTERNS = {
    "network": re.compile(r"(fetch\(|axios|http\.request|net\.connect|urllib|requests\.)"),
    "shell": re.compile(r"(child_process|execSync|spawnSync|subprocess|os\.system)"),
    "fs_write": re.compile(r"(writeFileSync|fs\.write|unlinkSync|rmSync|shutil\.rmtree)"),
    "install_hook": re.compile(r'"(pre|post)install"\s*:'),
}


def main(target: str) -> int:
    root = Path(target)
    if not root.is_dir():
        print(f"Not a directory: {root}", file=sys.stderr)
        return 1
    print(f"Inspecting {root} (read-only)\n")
    license_files = list(root.glob("LICENSE*")) + list(root.glob("COPYING*"))
    print("License:", license_files[0].name if license_files else
          "NOT FOUND — verify licensing before use")
    findings: dict[str, list[str]] = {k: [] for k in RISK_PATTERNS}
    for path in root.rglob("*"):
        if path.suffix.lower() not in (".js", ".ts", ".mjs", ".py", ".json", ".sh", ".ps1"):
            continue
        if "node_modules" in path.parts or ".git" in path.parts:
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        for kind, pattern in RISK_PATTERNS.items():
            if pattern.search(text):
                findings[kind].append(str(path.relative_to(root)))
    for kind, files in findings.items():
        print(f"\n{kind} ({len(files)} file(s)):")
        for f in files[:15]:
            print(f"  - {f}")
    print("\nReview these files by hand, pin the commit hash, and record both in")
    print("docs/premiere/PREMIERE_MCP_CAPABILITY_REPORT.md before enabling the server.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: python scripts/inspect_premiere_mcp.py <path-to-mcp-checkout>")
    sys.exit(main(sys.argv[1]))
