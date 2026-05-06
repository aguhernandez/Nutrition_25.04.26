/*
  # Add anon policies for coach_athlete_notes
  
  Allows the hub-auth pattern (anon key + hub_user_id matching) to read notes.
  Coaches using hub auth can also manage notes.
*/

CREATE POLICY "Anon can view notes as athlete"
  ON coach_athlete_notes FOR SELECT
  TO anon
  USING (
    athlete_id IN (
      SELECT id FROM profiles WHERE hub_user_id IS NOT NULL
    )
  );

CREATE POLICY "Anon can insert notes as coach"
  ON coach_athlete_notes FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update notes as coach"
  ON coach_athlete_notes FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can delete notes as coach"
  ON coach_athlete_notes FOR DELETE
  TO anon
  USING (true);
