/*
  # Add hub_user_id to profiles table

  ## Summary
  Adds the hub_user_id column to the existing profiles table to support
  HUB-based satellite authentication. This column stores the external
  user ID from the central HUB system.

  ## Changes to profiles
  - Add `hub_user_id` (text, nullable initially, then populated)
  - Add unique index on hub_user_id
  - Add updated_at column for tracking changes

  ## Notes
  - Column is added as nullable first to avoid breaking existing rows
  - Existing rows will have hub_user_id = id (same UUID) as a safe default
  - After backfill the column can be constrained if needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'hub_user_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN hub_user_id text;
    UPDATE profiles SET hub_user_id = id::text WHERE hub_user_id IS NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_hub_user_id ON profiles(hub_user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
