-- Run once: wrangler d1 execute fieldmapper-db --file=schema.sql

CREATE TABLE IF NOT EXISTS mappings (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  source_file TEXT NOT NULL,
  target_file TEXT NOT NULL,
  rules       TEXT NOT NULL,  -- JSON: [{sourceField, targetField, transform}]
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_mappings_updated ON mappings(updated_at DESC);
