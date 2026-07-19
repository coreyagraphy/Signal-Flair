"""JSON Schema validation helpers for pipeline artifacts."""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

import jsonschema

from .exceptions import ValidationFailed
from .paths import Paths


@lru_cache(maxsize=32)
def _load_schema(schema_path: str) -> dict:
    return json.loads(Path(schema_path).read_text(encoding="utf-8"))


def validate_against(data: dict, schema_file: Path) -> None:
    schema = _load_schema(str(schema_file))
    try:
        jsonschema.validate(instance=data, schema=schema)
    except jsonschema.ValidationError as exc:
        raise ValidationFailed(
            f"{schema_file.name}: {exc.message} (at {'/'.join(str(p) for p in exc.absolute_path)})"
        ) from exc


def validate_artifact(data: dict, schema_name: str, paths: Paths) -> None:
    validate_against(data, paths.schemas / schema_name)
