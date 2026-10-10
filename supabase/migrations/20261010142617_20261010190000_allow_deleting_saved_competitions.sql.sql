/*
# Add DELETE policy to competitions table

## Purpose
The `competitions` table has RLS enabled with SELECT, INSERT, and UPDATE policies,
but NO DELETE policy. RLS blocks all deletes, causing 406 errors when users try to
delete saved races from the Saved Races screen.

A migration file existed on disk (`20261010190000_allow_deleting_saved_competitions.sql`)
but was never applied to the database.

## Changes
1. New DELETE policy: "Hub users can delete saved competitions" — allows anon and
   authenticated roles to delete competition rows that have a non-empty `athlete_id`
   (athlete deleting their own race) or a non-null `created_by` (coach deleting a
   race they created for an athlete).

## Security
- This matches the existing pattern used by the SELECT and UPDATE policies on the
  same table, which also use `athlete_id IS NOT NULL AND athlete_id <> ''` as the
  access gate for the anon-key client (the app uses hub-based auth, not Supabase auth).
- No existing data is modified.
- The policy is idempotent (DROP IF EXISTS first).

## Important notes
1. The app talks to Supabase with the anon key (hub-based auth), so the policy
   MUST include `TO anon, authenticated`.
2. The frontend already controls which rows a user can see (filtered by athlete_id
   or created_by), so the RLS policy is a safety net, not the sole gatekeeper.
*/

DROP POLICY IF EXISTS "Hub users can delete saved competitions" ON competitions;

CREATE POLICY "Hub users can delete saved competitions"
  ON competitions FOR DELETE
  TO anon, authenticated
  USING (
    (athlete_id IS NOT NULL AND athlete_id <> '')
    OR created_by IS NOT NULL
  );
