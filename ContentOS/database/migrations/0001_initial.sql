-- Content OS initial schema.

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS source_assets (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id),
    original_path TEXT NOT NULL,
    managed_path TEXT,
    sha256 TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    container TEXT,
    duration_seconds REAL,
    width INTEGER,
    height INTEGER,
    frame_rate REAL,
    video_codec TEXT,
    audio_codec TEXT,
    audio_sample_rate INTEGER,
    audio_channels INTEGER,
    metadata_json TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_source_assets_sha256 ON source_assets(sha256);

CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id),
    asset_id TEXT REFERENCES source_assets(id),
    format_id TEXT NOT NULL DEFAULT 'talking_head_short',
    stage TEXT NOT NULL DEFAULT 'discovered',
    status TEXT NOT NULL DEFAULT 'pending',  -- pending|running|blocked|failed|done
    retry_count INTEGER NOT NULL DEFAULT 0,
    error_code TEXT,
    error_message TEXT,
    claimed_by TEXT,
    claimed_at TEXT,
    config_snapshot_json TEXT,
    artifacts_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS ix_jobs_stage ON jobs(stage, status);

CREATE TABLE IF NOT EXISTS job_stages (
    job_id TEXT NOT NULL REFERENCES jobs(id),
    stage TEXT NOT NULL,
    status TEXT NOT NULL,
    started_at TEXT,
    finished_at TEXT,
    detail_json TEXT,
    PRIMARY KEY (job_id, stage)
);

CREATE TABLE IF NOT EXISTS job_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id TEXT NOT NULL REFERENCES jobs(id),
    event_type TEXT NOT NULL,
    detail_json TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS ix_job_events_job ON job_events(job_id, id);

CREATE TABLE IF NOT EXISTS transcripts (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id),
    revision INTEGER NOT NULL DEFAULT 0,
    kind TEXT NOT NULL DEFAULT 'raw',       -- raw|clean
    engine TEXT NOT NULL,
    engine_mode TEXT,                        -- e.g. cuda-float16, cpu-int8, fixture
    language TEXT,
    path TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS clip_candidates (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id),
    start_seconds REAL NOT NULL,
    end_seconds REAL NOT NULL,
    platform TEXT,
    score REAL NOT NULL,
    score_breakdown_json TEXT,
    transcript_text TEXT,
    hook TEXT,
    payoff TEXT,
    selected INTEGER NOT NULL DEFAULT 0,
    rejection_reason TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS edit_plans (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id),
    revision INTEGER NOT NULL DEFAULT 0,
    path TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS renders (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id),
    kind TEXT NOT NULL,        -- draft|final|proxy
    variant TEXT NOT NULL,     -- horizontal|vertical|square
    path TEXT NOT NULL,
    duration_seconds REAL,
    verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quality_reports (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id),
    passed INTEGER NOT NULL,
    critical_failures INTEGER NOT NULL DEFAULT 0,
    path TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id),
    overall_score INTEGER,
    ratings_json TEXT,
    decision TEXT,             -- approved|revision_requested|open
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS review_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    review_id TEXT NOT NULL REFERENCES reviews(id),
    timestamp_seconds REAL,
    end_seconds REAL,
    note_type TEXT NOT NULL DEFAULT 'note',  -- note|remove|protect|caption|graphic|framing|audio
    text TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS taste_rules (
    id TEXT PRIMARY KEY,
    rule_text TEXT NOT NULL,
    scope TEXT NOT NULL DEFAULT 'global',
    format_id TEXT,
    platform TEXT,
    polarity TEXT NOT NULL DEFAULT 'negative',  -- positive|negative
    confidence REAL NOT NULL DEFAULT 0.3,
    evidence_count INTEGER NOT NULL DEFAULT 1,
    source_review_id TEXT,
    learned_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_confirmed_at TEXT,
    review_after TEXT,
    active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS revision_requests (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id),
    review_id TEXT REFERENCES reviews(id),
    invalidated_stages_json TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS research_sources (
    id TEXT PRIMARY KEY,
    url TEXT,
    title TEXT,
    publisher TEXT,
    published_at TEXT,
    captured_at TEXT NOT NULL DEFAULT (datetime('now')),
    query TEXT,
    provider TEXT NOT NULL,
    evidence TEXT,
    confidence REAL,
    relevance REAL,
    source_class TEXT,          -- primary|secondary|anecdotal
    content_sha256 TEXT
);

CREATE TABLE IF NOT EXISTS strategy_briefs (
    id TEXT PRIMARY KEY,
    job_id TEXT REFERENCES jobs(id),
    path TEXT NOT NULL,
    provider TEXT,
    prompt_version TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS publish_plans (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES jobs(id),
    platform TEXT NOT NULL,
    media_path TEXT NOT NULL,
    title TEXT,
    description TEXT,
    scheduled_at TEXT,
    timezone TEXT,
    privacy TEXT NOT NULL DEFAULT 'private',
    idempotency_key TEXT NOT NULL,
    approval_state TEXT NOT NULL DEFAULT 'pending',
    dry_run INTEGER NOT NULL DEFAULT 1,
    validation_json TEXT,
    plan_json TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_publish_idempotency ON publish_plans(idempotency_key);

CREATE TABLE IF NOT EXISTS publish_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id TEXT NOT NULL REFERENCES publish_plans(id),
    event_type TEXT NOT NULL,
    detail_json TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS analytics_snapshots (
    id TEXT PRIMARY KEY,
    plan_id TEXT REFERENCES publish_plans(id),
    platform TEXT,
    captured_at TEXT NOT NULL DEFAULT (datetime('now')),
    metrics_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS provider_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider TEXT NOT NULL,
    operation TEXT NOT NULL,
    job_id TEXT,
    status TEXT NOT NULL,
    duration_ms INTEGER,
    detail_json TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
