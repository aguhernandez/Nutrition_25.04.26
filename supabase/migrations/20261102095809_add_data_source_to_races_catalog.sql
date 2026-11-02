/*
# Track where race data came from

1. Modified Tables
- `races_catalog`
  - `data_source` (text, not null, default 'manual'): 'manual' for races entered by staff, 'ai_draft' for races added by the AI lookup.
  - `source_url` (text, nullable): web page the AI used as its reference, so the admin can double-check it.

2. Notes
- Existing rows keep is_verified as they are; AI-added rows are inserted with is_verified = false so an admin must confirm them.
- No security policies change in this migration.
*/

ALTER TABLE races_catalog ADD COLUMN IF NOT EXISTS data_source text NOT NULL DEFAULT 'manual';
ALTER TABLE races_catalog ADD COLUMN IF NOT EXISTS source_url text;
