#!/usr/bin/env python3
"""Repository health validation: compiles Python, validates JSON/YAML,
checks schema validity, and verifies required structure exists."""
from __future__ import annotations

import json
import py_compile
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

REQUIRED_DIRS = [
    "Input/inbox", "Media/originals", "Output/drafts", "Knowledge_Base",
    "config", "formats", "core", "services", "adapters", "premiere",
    "database/migrations", "schemas", "scripts", "tests", "docs",
]
REQUIRED_FILES = [
    "contentos_cli.py", "requirements.txt", ".env.example", ".gitignore",
    "core/pipeline.py", "core/job_store.py", "services/ingest_service.py",
    "premiere/premiere_manifest.schema.json", "schemas/edit_plan.schema.json",
]


def main() -> int:
    problems: list[str] = []
    checked = {"py": 0, "json": 0, "yaml": 0}

    for rel in REQUIRED_DIRS:
        if not (ROOT / rel).is_dir():
            problems.append(f"missing directory: {rel}")
    for rel in REQUIRED_FILES:
        if not (ROOT / rel).is_file():
            problems.append(f"missing file: {rel}")

    for path in ROOT.rglob("*.py"):
        if any(part in (".venv", "venv", "__pycache__", "data", "Media", "Output")
               for part in path.parts):
            continue
        try:
            py_compile.compile(str(path), doraise=True)
            checked["py"] += 1
        except py_compile.PyCompileError as exc:
            problems.append(f"python compile error: {path.relative_to(ROOT)}: {exc.msg}")

    for path in ROOT.rglob("*.json"):
        if any(part in ("data", "Media", "Output", "node_modules", ".git")
               for part in path.parts):
            continue
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            checked["json"] += 1
        except (json.JSONDecodeError, UnicodeDecodeError) as exc:
            problems.append(f"invalid JSON: {path.relative_to(ROOT)}: {exc}")
            continue
        if path.name.endswith(".schema.json"):
            try:
                import jsonschema
                jsonschema.Draft202012Validator.check_schema(data)
            except Exception as exc:
                problems.append(f"invalid JSON Schema: {path.relative_to(ROOT)}: {exc}")

    try:
        import yaml
        for path in list(ROOT.rglob("*.yaml")) + list(ROOT.rglob("*.yml")):
            if any(part in ("data", ".git") for part in path.parts):
                continue
            try:
                yaml.safe_load(path.read_text(encoding="utf-8"))
                checked["yaml"] += 1
            except yaml.YAMLError as exc:
                problems.append(f"invalid YAML: {path.relative_to(ROOT)}: {exc}")
    except ImportError:
        problems.append("pyyaml not installed — cannot validate YAML")

    # Format templates must validate against the format schema.
    try:
        import jsonschema
        schema = json.loads((ROOT / "formats" / "format.schema.json").read_text())
        for fmt in (ROOT / "formats").glob("*.json"):
            if fmt.name == "format.schema.json":
                continue
            try:
                jsonschema.validate(json.loads(fmt.read_text()), schema)
            except jsonschema.ValidationError as exc:
                problems.append(f"format {fmt.name} fails schema: {exc.message}")
    except Exception as exc:
        problems.append(f"format validation error: {exc}")

    # Case-collision check (Windows safety).
    seen: dict[str, str] = {}
    for path in ROOT.rglob("*"):
        if ".git" in path.parts:
            continue
        rel = str(path.relative_to(ROOT))
        low = rel.lower()
        if low in seen and seen[low] != rel:
            problems.append(f"case collision: {rel} vs {seen[low]}")
        seen[low] = rel

    print(f"Validated: {checked['py']} py, {checked['json']} json, "
          f"{checked['yaml']} yaml files")
    if problems:
        print(f"\n{len(problems)} problem(s):")
        for p in problems:
            print(f"  - {p}")
        return 1
    print("validate_project: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
