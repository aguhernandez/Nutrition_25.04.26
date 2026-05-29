/*
  # Add admin-only UPDATE and DELETE policies to foods_v2

  ## Summary
  The foods_v2 table currently has no UPDATE or DELETE policies,
  meaning no one can modify or remove food records. This adds:

  1. UPDATE policy: admin role only
  2. DELETE policy: admin role only

  This restricts food database management to platform administrators.

  ## Security Changes
  - foods_v2 UPDATE: admin only (via profiles.role check)
  - foods_v2 DELETE: admin only (via profiles.role check)
  - INSERT policy remains open to authenticated (coaches add foods via meal editor)
*/

CREATE POLICY "Admin can update foods v2"
  ON foods_v2 FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can delete foods v2"
  ON foods_v2 FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
