/*
# Add created_by column to competitions and backfill from race_assignments

## Purpose
When a coach/nutritionist/head coach creates a race plan for an athlete, the race is
saved with `athlete_id` set to the athlete's ID. The coach had no way to see, edit, or
delete races they created for athletes — only the athlete could see them in Saved Races.

This migration adds a `created_by` column to `competitions` so we can track who created
each race plan, and backfills existing coach-created races using data from
`race_assignments`.

## Changes
1. New column: `competitions.created_by` (text, nullable) — stores the profile ID or
   hub_user_id of the coach who created the race. NULL for athlete-created races.
2. Backfill: Sets `created_by` on existing competitions using `race_assignments.coach_id`
   where a matching assignment exists.

## Security
- No RLS changes. The competitions table already has open SELECT/INSERT/UPDATE/DELETE
  policies for anon + authenticated (the app uses hub-based auth, not Supabase auth,
  so all access is controlled at the application level).
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'competitions' AND column_name = 'created_by') THEN
    ALTER TABLE competitions ADD COLUMN created_by text DEFAULT NULL;
  END IF;
END $$;

-- Backfill: set created_by from race_assignments where the coach created the race
UPDATE competitions c
SET created_by = ra.coach_id
FROM race_assignments ra
WHERE c.id = ra.competition_id
  AND c.created_by IS NULL;
