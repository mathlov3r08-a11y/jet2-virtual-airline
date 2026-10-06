-- Jet2 | PTFS — Migration 006: myJet2 usernames
-- Database: jet2-ptfs-db
-- D1 ID: 7edad159-71d2-44d1-9ac2-c561208e9cbb

ALTER TABLE myjet2_accounts
  ADD COLUMN username TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_myjet2_accounts_username
  ON myjet2_accounts(username COLLATE NOCASE);
