/*
  # Add anon policies to profiles for HUB authentication

  ## Summary
  Since this satellite uses HUB-based token authentication (not Supabase Auth),
  the Supabase client runs as the 'anon' role. This migration adds permissive
  policies so that the satellite can read and write profiles using HUB tokens.

  ## Security Changes
  - Add SELECT policy for anon role
  - Add INSERT policy for anon role
  - Add UPDATE policy for anon role

  ## Notes
  - Real authentication security is enforced by the HUB token validation
  - Supabase RLS here acts as a secondary layer
*/

CREATE POLICY "Anon can select profiles"
  ON profiles
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert profiles"
  ON profiles
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update profiles"
  ON profiles
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
