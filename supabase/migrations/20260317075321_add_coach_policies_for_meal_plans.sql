/*
  # Allow coaches to manage meal plans for their athletes

  ## Problem
  The meal_plans INSERT policy uses `auth.uid() = user_id`, which blocks coaches
  from creating meal plans assigned to their athletes. Same applies to UPDATE.

  ## Changes
  - Add INSERT policy for authenticated coaches/admins to insert plans for any profile user
  - Add UPDATE policy for coaches/admins to update plans for any profile user
  - Coach/admin check: role in ('coach', 'admin') in the profiles table
*/

CREATE POLICY "Coach can insert meal plans for athletes"
  ON meal_plans FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
    AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = meal_plans.user_id
    )
  );

CREATE POLICY "Coach can update meal plans for athletes"
  ON meal_plans FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('coach', 'admin')
    )
  );
