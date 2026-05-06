/*
  # Update Competitions RLS for Authenticated Users

  ## Overview
  Updates competition and post_race_feedback RLS policies so:
  - Athletes can only see/create their own competitions (via user_id column)
  - Coaches and Admins can see all competitions
  - Adds user_id column to competitions for ownership tracking

  ## Changes
  - Add `user_id` uuid column to competitions (nullable for backwards compat)
  - Drop old open policies
  - Add new scoped policies per role
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'competitions' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE competitions ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

DROP POLICY IF EXISTS "Anyone can insert competitions" ON competitions;
DROP POLICY IF EXISTS "Anyone can read competitions" ON competitions;
DROP POLICY IF EXISTS "Anyone can update competitions" ON competitions;

CREATE POLICY "Users can insert own competitions"
  ON competitions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Athletes see own competitions"
  ON competitions FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR user_id IS NULL
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'coach')
    )
  );

CREATE POLICY "Users can update own competitions"
  ON competitions FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'coach')
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'coach')
    )
  );

DROP POLICY IF EXISTS "Anyone can insert post race feedback" ON post_race_feedback;
DROP POLICY IF EXISTS "Anyone can read post race feedback" ON post_race_feedback;
DROP POLICY IF EXISTS "Anyone can update post race feedback" ON post_race_feedback;

CREATE POLICY "Users can insert feedback for own competitions"
  ON post_race_feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM competitions c
      WHERE c.id = competition_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)
    )
  );

CREATE POLICY "Users can read feedback for visible competitions"
  ON post_race_feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM competitions c
      WHERE c.id = competition_id
        AND (
          c.user_id = auth.uid()
          OR c.user_id IS NULL
          OR EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() AND p.role IN ('admin', 'coach')
          )
        )
    )
  );
