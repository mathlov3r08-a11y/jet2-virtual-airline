-- Jet2 | PTFS — Migration 005: myJet2 core
-- Database: jet2-ptfs-db
-- D1 ID: 7edad159-71d2-44d1-9ac2-c561208e9cbb
--
-- Creates the backend foundation for myJet2.
-- No tiers, point values, or perks are seeded yet.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS myjet2_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  points_balance INTEGER NOT NULL DEFAULT 0 CHECK (points_balance >= 0),
  tier_id INTEGER,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'closed')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS myjet2_tiers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tier_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  minimum_points INTEGER NOT NULL DEFAULT 0 CHECK (minimum_points >= 0),
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS myjet2_points_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  amount INTEGER NOT NULL CHECK (amount <> 0),
  transaction_type TEXT NOT NULL CHECK (
    transaction_type IN ('earned','redeemed','adjustment','refund','bonus','penalty')
  ),
  source TEXT NOT NULL,
  description TEXT,
  reference_type TEXT,
  reference_id TEXT,
  balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
  created_by_user_id INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (account_id) REFERENCES myjet2_accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS myjet2_perks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  perk_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL DEFAULT 0 CHECK (points_cost >= 0),
  acquisition_type TEXT NOT NULL DEFAULT 'purchase'
    CHECK (acquisition_type IN ('purchase','automatic','both')),
  redemption_type TEXT NOT NULL DEFAULT 'one_time'
    CHECK (redemption_type IN ('one_time','permanent')),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  display_order INTEGER NOT NULL DEFAULT 0,
  metadata_json TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS myjet2_account_perks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  perk_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('unlocked','active','used','expired','revoked')),
  granted_source TEXT NOT NULL DEFAULT 'system',
  granted_by_user_id INTEGER,
  source_redemption_id INTEGER,
  granted_at INTEGER NOT NULL DEFAULT (unixepoch()),
  expires_at INTEGER,
  metadata_json TEXT,
  FOREIGN KEY (account_id) REFERENCES myjet2_accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (perk_id) REFERENCES myjet2_perks(id) ON DELETE RESTRICT,
  FOREIGN KEY (granted_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS myjet2_redemptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  perk_id INTEGER NOT NULL,
  account_perk_id INTEGER,
  points_spent INTEGER NOT NULL CHECK (points_spent >= 0),
  status TEXT NOT NULL DEFAULT 'completed'
    CHECK (status IN ('pending','completed','cancelled','refunded')),
  reference_type TEXT,
  reference_id TEXT,
  metadata_json TEXT,
  redeemed_at INTEGER NOT NULL DEFAULT (unixepoch()),
  completed_at INTEGER,
  FOREIGN KEY (account_id) REFERENCES myjet2_accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (perk_id) REFERENCES myjet2_perks(id) ON DELETE RESTRICT,
  FOREIGN KEY (account_perk_id) REFERENCES myjet2_account_perks(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS myjet2_priority_passes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  pass_type TEXT NOT NULL CHECK (pass_type IN ('one_time','permanent')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','used','expired','revoked')),
  source_redemption_id INTEGER,
  flight_reference TEXT,
  issued_at INTEGER NOT NULL DEFAULT (unixepoch()),
  expires_at INTEGER,
  used_at INTEGER,
  metadata_json TEXT,
  FOREIGN KEY (account_id) REFERENCES myjet2_accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (source_redemption_id) REFERENCES myjet2_redemptions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_myjet2_accounts_user
  ON myjet2_accounts(user_id);

CREATE INDEX IF NOT EXISTS idx_myjet2_points_account
  ON myjet2_points_transactions(account_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_myjet2_perks_active
  ON myjet2_perks(active, display_order);

CREATE INDEX IF NOT EXISTS idx_myjet2_account_perks_account
  ON myjet2_account_perks(account_id, status);

CREATE INDEX IF NOT EXISTS idx_myjet2_redemptions_account
  ON myjet2_redemptions(account_id, redeemed_at DESC);

CREATE INDEX IF NOT EXISTS idx_myjet2_priority_passes_account
  ON myjet2_priority_passes(account_id, status);

CREATE TRIGGER IF NOT EXISTS trg_myjet2_accounts_updated_at
AFTER UPDATE ON myjet2_accounts
FOR EACH ROW
BEGIN
  UPDATE myjet2_accounts SET updated_at = unixepoch() WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_myjet2_tiers_updated_at
AFTER UPDATE ON myjet2_tiers
FOR EACH ROW
BEGIN
  UPDATE myjet2_tiers SET updated_at = unixepoch() WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_myjet2_perks_updated_at
AFTER UPDATE ON myjet2_perks
FOR EACH ROW
BEGIN
  UPDATE myjet2_perks SET updated_at = unixepoch() WHERE id = NEW.id;
END;
