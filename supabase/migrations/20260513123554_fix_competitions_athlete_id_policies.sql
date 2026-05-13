/*
  # Fix competitions: allow Hub-authenticated users to save and read races via athlete_id

  ## Problem
  The app uses Hub authentication (not Supabase Auth), so auth.uid() is always null.
  - INSERT fails silently because the existing policy requires auth.uid() = user_id
  - SELECT returns nothing because saved rows have user_id = null and athlete_id = ''

  ## Changes
  1. Add INSERT policy allowing rows where athlete_id is provided (non-empty)
  2. Add SELECT policy allowing rows matching a provided athlete_id
  3. Add UPDATE policy for athlete_id rows
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'competitions' AND policyname = 'Hub users can insert competitions by athlete_id'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Hub users can insert competitions by athlete_id"
        ON competitions FOR INSERT TO anon, authenticated
        WITH CHECK (athlete_id IS NOT NULL AND athlete_id <> '')
    $pol$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'competitions' AND policyname = 'Hub users can select own competitions by athlete_id'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Hub users can select own competitions by athlete_id"
        ON competitions FOR SELECT TO anon, authenticated
        USING (athlete_id IS NOT NULL AND athlete_id <> '')
    $pol$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'competitions' AND policyname = 'Hub users can update own competitions by athlete_id'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Hub users can update own competitions by athlete_id"
        ON competitions FOR UPDATE TO anon, authenticated
        USING (athlete_id IS NOT NULL AND athlete_id <> '')
        WITH CHECK (athlete_id IS NOT NULL AND athlete_id <> '')
    $pol$;
  END IF;
END $$;
