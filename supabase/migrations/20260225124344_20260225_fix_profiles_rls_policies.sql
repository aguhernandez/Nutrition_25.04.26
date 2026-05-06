/*
  # Fix profiles RLS policies for HUB integration

  1. Changes
    - Add DELETE policy for anonymous users
    - Ensure proper policy ordering and permissiveness
    - Anonymous operations are required for satellite HUB integration

  2. Security
    - Policies allow anon operations during development/integration
    - Authenticated policies maintain user isolation
    - Admins can read all profiles
*/

-- Drop the restrictive authenticated INSERT policy if exists, to be safe
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Add DELETE policy for anonymous users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'Anon can delete profiles'
  ) THEN
    CREATE POLICY "Anon can delete profiles"
      ON profiles FOR DELETE
      TO anon
      USING (true);
  END IF;
END $$;

-- Ensure anon policies are permissive (not restrictive)
DO $$
BEGIN
  -- Drop and recreate anon INSERT policy to ensure proper WITH CHECK
  DROP POLICY IF EXISTS "Anon can insert profiles" ON profiles;
  CREATE POLICY "Anon can insert profiles"
    ON profiles FOR INSERT
    TO anon
    WITH CHECK (true);

  -- Drop and recreate anon UPDATE policy
  DROP POLICY IF EXISTS "Anon can update profiles" ON profiles;
  CREATE POLICY "Anon can update profiles"
    ON profiles FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);
END $$;
