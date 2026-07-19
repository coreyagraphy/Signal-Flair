# File inventory

Generated 2026-07-19 from the committed tree.

## (root) (13 files)
- `.env.example`
- `.gitignore`
- `RUN_TESTS.bat`
- `START_CONTENT_OS.bat`
- `START_CONTENT_OS.ps1`
- `START_REVIEW.bat`
- `START_WORKER.bat`
- `app.py`
- `contentos_cli.py`
- `pyproject.toml`
- `requirements-dev.txt`
- `requirements.txt`
- `validate_project.py`

## Input (4 files)
- `Input/completed/.gitkeep`
- `Input/failed/.gitkeep`
- `Input/inbox/.gitkeep`
- `Input/processing/.gitkeep`

## Knowledge_Base (16 files)
- `Knowledge_Base/audience/AUDIENCE_PROFILE.md`
- `Knowledge_Base/brand/BRAND_PROFILE.md`
- `Knowledge_Base/brand/BRAND_VOICE.md`
- `Knowledge_Base/brand/GLOSSARY.md`
- `Knowledge_Base/brand/VISUAL_SYSTEM.md`
- `Knowledge_Base/examples/.gitkeep`
- `Knowledge_Base/formats/.gitkeep`
- `Knowledge_Base/offers/CLAIMS_AND_PROOF.md`
- `Knowledge_Base/offers/OFFERS.md`
- `Knowledge_Base/offers/PROHIBITED_LANGUAGE.md`
- `Knowledge_Base/products/CONTENT_PILLARS.md`
- `Knowledge_Base/products/CREATIVE_REFERENCES.md`
- `Knowledge_Base/research/README.md`
- `Knowledge_Base/scripts/.gitkeep`
- `Knowledge_Base/strategy/.gitkeep`
- `Knowledge_Base/taste/TASTE_RULES.md`

## Media (7 files)
- `Media/audio/.gitkeep`
- `Media/broll/.gitkeep`
- `Media/graphics/.gitkeep`
- `Media/music/.gitkeep`
- `Media/originals/.gitkeep`
- `Media/proxies/.gitkeep`
- `Media/sound_effects/.gitkeep`

## Output (8 files)
- `Output/captions/.gitkeep`
- `Output/drafts/.gitkeep`
- `Output/finals/.gitkeep`
- `Output/manifests/.gitkeep`
- `Output/premiere/.gitkeep`
- `Output/reports/.gitkeep`
- `Output/social/.gitkeep`
- `Output/thumbnails/.gitkeep`

## adapters (21 files)
- `adapters/__init__.py`
- `adapters/distribution/__init__.py`
- `adapters/distribution/base.py`
- `adapters/distribution/dry_run_adapter.py`
- `adapters/distribution/live_adapters.py`
- `adapters/llm/__init__.py`
- `adapters/llm/anthropic_adapter.py`
- `adapters/llm/base.py`
- `adapters/llm/ollama_adapter.py`
- `adapters/llm/template_adapter.py`
- `adapters/premiere/.gitkeep`
- `adapters/research/__init__.py`
- `adapters/research/base.py`
- `adapters/research/local_docs_provider.py`
- `adapters/research/stub_providers.py`
- `adapters/storage/.gitkeep`
- `adapters/transcription/__init__.py`
- `adapters/transcription/base.py`
- `adapters/transcription/energy_adapter.py`
- `adapters/transcription/faster_whisper_adapter.py`
- `adapters/transcription/fixture_adapter.py`

## config (6 files)
- `config/caption_styles.yaml`
- `config/logging.yaml`
- `config/platforms.yaml`
- `config/premiere_capabilities.yaml`
- `config/research_providers.yaml`
- `config/settings.yaml`

## core (16 files)
- `core/__init__.py`
- `core/checkpoints.py`
- `core/config.py`
- `core/database.py`
- `core/events.py`
- `core/exceptions.py`
- `core/hashing.py`
- `core/job_store.py`
- `core/logging.py`
- `core/models.py`
- `core/paths.py`
- `core/pipeline.py`
- `core/proc.py`
- `core/retries.py`
- `core/state_machine.py`
- `core/validation.py`

## database (2 files)
- `database/migrations/0001_initial.sql`
- `database/migrations/0002_asset_library.sql`

## docs (2 files)
- `docs/audit/CODEC_TEST_MATRIX.md`
- `docs/audit/INSTALLED_CODEC_CAPABILITY_REPORT.md`

## formats (5 files)
- `formats/educational_short.json`
- `formats/format.schema.json`
- `formats/promotional_short.json`
- `formats/talking_head_long.json`
- `formats/talking_head_short.json`

## premiere (7 files)
- `premiere/__init__.py`
- `premiere/capability_discovery.py`
- `premiere/manifest_builder.py`
- `premiere/premiere_manifest.schema.json`
- `premiere/sequence_builder.py`
- `premiere/tool_mapper.py`
- `premiere/transport.py`

## review (3 files)
- `review/review_server.py`
- `review/review_template.html`
- `review/static/.gitkeep`

## schemas (6 files)
- `schemas/edit_plan.schema.json`
- `schemas/job.schema.json`
- `schemas/publish_plan.schema.json`
- `schemas/review.schema.json`
- `schemas/strategy.schema.json`
- `schemas/transcript.schema.json`

## scripts (8 files)
- `scripts/doctor.ps1`
- `scripts/generate_test_media.py`
- `scripts/inspect_premiere_mcp.py`
- `scripts/install.ps1`
- `scripts/migrate_database.py`
- `scripts/run_codec_matrix.py`
- `scripts/run_e2e.py`
- `scripts/verify_gpu.py`

## services (22 files)
- `services/__init__.py`
- `services/analytics_service.py`
- `services/asset_library_service.py`
- `services/capability_service.py`
- `services/caption_service.py`
- `services/clip_scoring_service.py`
- `services/codec_service.py`
- `services/distribution_service.py`
- `services/edit_plan_service.py`
- `services/ingest_service.py`
- `services/media_probe_service.py`
- `services/proxy_service.py`
- `services/quality_service.py`
- `services/render_service.py`
- `services/research_service.py`
- `services/review_service.py`
- `services/script_service.py`
- `services/stage_registry.py`
- `services/strategy_service.py`
- `services/taste_service.py`
- `services/transcript_cleanup_service.py`
- `services/transcription_service.py`

## tests (13 files)
- `tests/__init__.py`
- `tests/conftest.py`
- `tests/e2e/__init__.py`
- `tests/e2e/test_full_pipeline.py`
- `tests/integration/__init__.py`
- `tests/integration/test_codec_and_assets.py`
- `tests/integration/test_mcp_transport.py`
- `tests/integration/test_media_pipeline.py`
- `tests/integration/test_persistence_and_pipeline.py`
- `tests/unit/__init__.py`
- `tests/unit/test_captions_and_cuts.py`
- `tests/unit/test_core.py`
- `tests/unit/test_scoring_taste_distribution.py`
