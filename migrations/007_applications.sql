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

INSERT OR IGNORE INTO application_types
  (type_key, name, description, department, reviewer_group)
VALUES
  ('human-resources', 'Human Resources', 'Apply to help support, develop and manage the Jet2 | PTFS staff team.', 'Human Resources', 'hr'),
  ('pr-marketing', 'PR & Marketing', 'Help represent Jet2 | PTFS, create campaigns and grow the community.', 'PR & Marketing', 'pr'),
  ('flight-operations', 'Flight Operations', 'Help plan, host and coordinate Jet2 | PTFS flight operations.', 'Flight Operations', 'flight_ops'),
  ('management', 'Management', 'Apply for a management opportunity when a management intake is open.', 'Management', 'management');

INSERT INTO application_questions (application_type_id, question_order, prompt, help_text, required, max_length)
SELECT id, 1, 'Why would you like to join this department?', 'Tell us what interests you about this department and the role.', 1, 1500 FROM application_types WHERE type_key = 'human-resources'
AND NOT EXISTS (SELECT 1 FROM application_questions q WHERE q.application_type_id = application_types.id AND q.question_order = 1);
INSERT INTO application_questions (application_type_id, question_order, prompt, help_text, required, max_length)
SELECT id, 2, 'What qualities would you bring to the team?', 'Consider communication, reliability, teamwork and professionalism.', 1, 1500 FROM application_types WHERE type_key = 'human-resources'
AND NOT EXISTS (SELECT 1 FROM application_questions q WHERE q.application_type_id = application_types.id AND q.question_order = 2);
INSERT INTO application_questions (application_type_id, question_order, prompt, help_text, required, max_length)
SELECT id, 3, 'How would you handle a staff member who needs support or correction?', 'We are interested in your approach, not a perfect answer.', 1, 1800 FROM application_types WHERE type_key = 'human-resources'
AND NOT EXISTS (SELECT 1 FROM application_questions q WHERE q.application_type_id = application_types.id AND q.question_order = 3);

INSERT INTO application_questions (application_type_id, question_order, prompt, help_text, required, max_length)
SELECT id, 1, 'Why are you interested in PR & Marketing?', 'Tell us what you would like to contribute.', 1, 1500 FROM application_types WHERE type_key = 'pr-marketing'
AND NOT EXISTS (SELECT 1 FROM application_questions q WHERE q.application_type_id = application_types.id AND q.question_order = 1);
INSERT INTO application_questions (application_type_id, question_order, prompt, help_text, required, max_length)
SELECT id, 2, 'Describe one idea you would use to promote Jet2 | PTFS.', 'It can be a social post, event, campaign or another creative idea.', 1, 1800 FROM application_types WHERE type_key = 'pr-marketing'
AND NOT EXISTS (SELECT 1 FROM application_questions q WHERE q.application_type_id = application_types.id AND q.question_order = 2);
INSERT INTO application_questions (application_type_id, question_order, prompt, help_text, required, max_length)
SELECT id, 3, 'How would you work with another department on a campaign?', 'Explain how you would communicate and coordinate.', 1, 1500 FROM application_types WHERE type_key = 'pr-marketing'
AND NOT EXISTS (SELECT 1 FROM application_questions q WHERE q.application_type_id = application_types.id AND q.question_order = 3);

INSERT INTO application_questions (application_type_id, question_order, prompt, help_text, required, max_length)
SELECT id, 1, 'Why would you like to join Flight Operations?', 'Tell us what interests you about flight operations.', 1, 1500 FROM application_types WHERE type_key = 'flight-operations'
AND NOT EXISTS (SELECT 1 FROM application_questions q WHERE q.application_type_id = application_types.id AND q.question_order = 1);
INSERT INTO application_questions (application_type_id, question_order, prompt, help_text, required, max_length)
SELECT id, 2, 'How would you keep a flight organized from boarding to completion?', 'Think about communication, timing and passenger experience.', 1, 1800 FROM application_types WHERE type_key = 'flight-operations'
AND NOT EXISTS (SELECT 1 FROM application_questions q WHERE q.application_type_id = application_types.id AND q.question_order = 2);
INSERT INTO application_questions (application_type_id, question_order, prompt, help_text, required, max_length)
SELECT id, 3, 'What would you do if something went wrong during a flight?', 'Explain how you would respond calmly and communicate with the team.', 1, 1800 FROM application_types WHERE type_key = 'flight-operations'
AND NOT EXISTS (SELECT 1 FROM application_questions q WHERE q.application_type_id = application_types.id AND q.question_order = 3);

INSERT INTO application_questions (application_type_id, question_order, prompt, help_text, required, max_length)
SELECT id, 1, 'Why do you believe you are ready for a management role?', 'Tell us about your leadership approach and what you would contribute.', 1, 1800 FROM application_types WHERE type_key = 'management'
AND NOT EXISTS (SELECT 1 FROM application_questions q WHERE q.application_type_id = application_types.id AND q.question_order = 1);
INSERT INTO application_questions (application_type_id, question_order, prompt, help_text, required, max_length)
SELECT id, 2, 'Describe a time you solved a problem or helped a team.', 'Use a real example where possible.', 1, 1800 FROM application_types WHERE type_key = 'management'
AND NOT EXISTS (SELECT 1 FROM application_questions q WHERE q.application_type_id = application_types.id AND q.question_order = 2);
INSERT INTO application_questions (application_type_id, question_order, prompt, help_text, required, max_length)
SELECT id, 3, 'How would you handle disagreement between two staff members?', 'We are looking for a fair and professional approach.', 1, 1800 FROM application_types WHERE type_key = 'management'
AND NOT EXISTS (SELECT 1 FROM application_questions q WHERE q.application_type_id = application_types.id AND q.question_order = 3);
