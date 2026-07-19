-- Audio-analysis metrics for sound-design assets (Ocular library support).
ALTER TABLE creative_assets ADD COLUMN integrated_lufs REAL;
ALTER TABLE creative_assets ADD COLUMN true_peak_db REAL;
ALTER TABLE creative_assets ADD COLUMN leading_silence_seconds REAL;
ALTER TABLE creative_assets ADD COLUMN trailing_silence_seconds REAL;
ALTER TABLE creative_assets ADD COLUMN loop_or_oneshot TEXT;
