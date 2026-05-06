/*
  # Fix profiles table hub_user_id constraints

  1. Changes
    - Add NOT NULL constraint to hub_user_id
    - Add UNIQUE constraint to hub_user_id
    - These are critical for HUB integration

  2. Security
    - Ensures each HUB user maps to exactly one profile
    - Prevents duplicate profiles for same HUB user
*/

DO $$
BEGIN
  -- Add NOT NULL constraint if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'hub_user_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN hub_user_id SET NOT NULL;
  END IF;

  -- Add UNIQUE constraint if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'profiles' AND column_name = 'hub_user_id'
    AND constraint_name LIKE '%hub_user_id%unique%'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_hub_user_id_unique UNIQUE(hub_user_id);
  END IF;
END $$;
