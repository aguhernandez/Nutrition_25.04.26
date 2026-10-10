-- Saved Races deletes competition rows through the Hub-authenticated anon client.
-- Restrict deletion to race rows tied to an athlete or explicitly created by a coach.
DROP POLICY IF EXISTS "Hub users can delete saved competitions" ON competitions;

CREATE POLICY "Hub users can delete saved competitions"
  ON competitions FOR DELETE
  TO anon, authenticated
  USING (
    (athlete_id IS NOT NULL AND athlete_id <> '')
    OR created_by IS NOT NULL
  );
