-- Jet2 | PTFS â€” Migration 007: Applications

CREATE TABLE IF NOT EXISTS application_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT '',
  reviewer_group TEXT NOT NULL DEFAULT 'leadership',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS application_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_type_id INTEGER NOT NULL,
  question_order INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  help_text TEXT NOT NULL DEFAULT '',
  required INTEGER NOT NULL DEFAULT 1,
  max_length INTEGER NOT NULL DEFAULT 1500,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_type_id) REFERENCES application_types(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_application_questions_order
  ON application_questions(application_type_id, question_order);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  public_id TEXT NOT NULL UNIQUE,
  application_type_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'awaiting_discord',
  discord_user_id TEXT,
  discord_username TEXT,
  discord_global_name TEXT,
  answers_json TEXT NOT NULL DEFAULT '{}',
  forum_thread_id TEXT,
  reviewer_discord_user_id TEXT,
  reviewer_username TEXT,
  decision TEXT,
  decision_reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at TEXT,
  decided_at TEXT,
  FOREIGN KEY (application_type_id) REFERENCES application_types(id)
);

CREATE INDEX IF NOT EXISTS idx_applications_discord_user
  ON applications(discord_user_id);

CREATE INDEX IF NOT EXISTS idx_applications_status
  ON applications(status);
