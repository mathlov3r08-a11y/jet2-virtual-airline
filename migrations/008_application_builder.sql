-- Jet2 | PTFS â€” Migration 008: Application Builder Metadata
-- Additive only: preserves the existing D1 database and all submitted applications.

ALTER TABLE application_types ADD COLUMN image_url TEXT NOT NULL DEFAULT '';
ALTER TABLE application_types ADD COLUMN requirements TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_applications_recent_submissions
  ON applications(discord_user_id, submitted_at);
