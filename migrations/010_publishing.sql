-- Jet2 | PTFS â€” Migration 010: Separate publishing from open/closed availability
-- Run against the existing jet2-ptfs-db database only.
-- Existing application types default to unpublished. Publishing is controlled by the Owner Control Room;
-- opening/closing remains a separate CHRO/owner action.
ALTER TABLE application_types ADD COLUMN published INTEGER NOT NULL DEFAULT 0;
