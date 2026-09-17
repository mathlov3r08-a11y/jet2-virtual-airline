-- Jet2 | PTFS - Organization People
-- Migration 004
-- Stores current and past Leadership, Board of Directors, and future Directors.

CREATE TABLE IF NOT EXISTS organization_people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_user_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  group_type TEXT NOT NULL CHECK (group_type IN ('leadership', 'bod', 'directors')),
  status TEXT NOT NULL DEFAULT 'current' CHECK (status IN ('current', 'past')),
  display_order INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  custom_photo_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_organization_people_group_status_order
  ON organization_people (group_type, status, display_order);

CREATE INDEX IF NOT EXISTS idx_organization_people_discord_user
  ON organization_people (discord_user_id);
