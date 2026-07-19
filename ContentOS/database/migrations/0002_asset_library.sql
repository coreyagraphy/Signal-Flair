-- Creative asset library (Four Editors and other external media packs).

CREATE TABLE IF NOT EXISTS asset_libraries (
    id TEXT PRIMARY KEY,
    root_path TEXT NOT NULL UNIQUE,
    name TEXT,
    registered_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_scanned_at TEXT,
    scan_status TEXT NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS creative_assets (
    id TEXT PRIMARY KEY,
    library_id TEXT NOT NULL REFERENCES asset_libraries(id),
    relative_path TEXT NOT NULL,
    filename TEXT NOT NULL,
    extension TEXT,
    asset_type TEXT NOT NULL,           -- sound_effect|music|lut|transition|premiere_preset|mogrt|after_effects|overlay|film_grain|broll|image|logo|font|project_template|data|unknown
    size_bytes INTEGER,
    sha256 TEXT,
    duration_seconds REAL,
    width INTEGER,
    height INTEGER,
    frame_rate REAL,
    sample_rate INTEGER,
    channels INTEGER,
    has_alpha INTEGER,
    codec TEXT,
    lut_size INTEGER,
    routing TEXT NOT NULL DEFAULT 'unknown',  -- direct|remotion|premiere|after_effects|indexed_but_not_automatable|unknown
    app_dependency TEXT,
    plugin_dependency TEXT,
    license_notes TEXT,
    availability TEXT NOT NULL DEFAULT 'unknown', -- local|online_only|missing|permission_denied|unreadable
    preview_path TEXT,
    disabled INTEGER NOT NULL DEFAULT 0,
    favorite INTEGER NOT NULL DEFAULT 0,
    protected_from_auto_use INTEGER NOT NULL DEFAULT 0,
    last_verified_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(library_id, relative_path)
);
CREATE INDEX IF NOT EXISTS ix_assets_type ON creative_assets(asset_type, disabled);

CREATE TABLE IF NOT EXISTS asset_tags (
    asset_id TEXT NOT NULL REFERENCES creative_assets(id),
    tag TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'auto',   -- auto|owner
    PRIMARY KEY (asset_id, tag)
);

CREATE TABLE IF NOT EXISTS asset_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id TEXT NOT NULL REFERENCES creative_assets(id),
    job_id TEXT,
    used_at TEXT NOT NULL DEFAULT (datetime('now')),
    context TEXT,
    reason TEXT,
    confidence REAL
);

CREATE TABLE IF NOT EXISTS asset_dependencies (
    asset_id TEXT NOT NULL REFERENCES creative_assets(id),
    dependency TEXT NOT NULL,
    verified INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (asset_id, dependency)
);
