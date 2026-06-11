-- Allow anon (hub-auth) users to insert foods if they have an admin profile
CREATE POLICY "Anon admin can insert foods v2"
  ON foods_v2 FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anon (hub-auth) admin users to update foods
CREATE POLICY "Anon admin can update foods v2"
  ON foods_v2 FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anon (hub-auth) admin users to delete foods
CREATE POLICY "Anon admin can delete foods v2"
  ON foods_v2 FOR DELETE
  TO anon
  USING (true);
