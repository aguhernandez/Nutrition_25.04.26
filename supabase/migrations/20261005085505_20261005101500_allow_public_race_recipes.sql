/*
# Allow public race recipes in the planner

1. Security Changes
- Replaces the authenticated-only public recipe read policy with a policy that also permits the anon role to read recipes marked `is_public`.

2. Important Notes
- Private recipes remain restricted by the existing owner policy.
- This only affects recipe discovery in the race nutrition planner; it does not allow anonymous recipe creation, editing, or deletion.
*/

DROP POLICY IF EXISTS "Authenticated users can read public recipes" ON recipes;

CREATE POLICY "Anyone can read public recipes"
  ON recipes FOR SELECT
  TO anon, authenticated
  USING (is_public = true);
