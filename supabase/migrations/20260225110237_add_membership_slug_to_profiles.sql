/*
  # Add membership fields to profiles table

  ## Summary
  Adds membership_slug and membership_name columns to the profiles table to store
  the membership tier information coming from the HUB authentication system.

  ## Changes to profiles
  - Add `membership_slug` (text) — technical identifier: 'inicia', 'intermediate', or 'pro'
  - Add `membership_name` (text) — human-readable name (e.g. 'Asciende Pro')

  ## Notes
  - Both columns are nullable; if absent, the app defaults to 'inicia'
  - Values are synced from the HUB JWT on every auth-me call
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'membership_slug'
  ) THEN
    ALTER TABLE profiles ADD COLUMN membership_slug text DEFAULT 'inicia';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'membership_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN membership_name text;
  END IF;
END $$;
