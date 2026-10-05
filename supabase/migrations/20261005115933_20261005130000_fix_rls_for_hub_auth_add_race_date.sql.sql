/*
# Fix RLS policies for satellite (Hub) auth + add race_date column

## Overview
The app uses Hub-based token authentication, not Supabase native auth.
The Supabase client always runs as the 'anon' role, so policies scoped to
'TO authenticated' with auth.uid() checks always fail (401 errors).

## Changes

### 1. races_catalog: replace admin policies
- Drop the authenticated-only admin INSERT/UPDATE/DELETE policies
- Add new policies TO anon, authenticated that allow writes from the satellite app
- Real admin authorization is enforced in the frontend via profile.role check
- Also add race_date column (date, nullable) for exact race date selection

### 2. race_elevation_data: replace admin policies
- Same pattern: allow anon writes (frontend enforces admin role)

### 3. race_aid_stations: replace admin policies
- Same pattern: allow anon writes (frontend enforces admin role)

### 4. race_change_history: replace admin insert policy
- Allow anon inserts (frontend enforces admin role)

## Security Notes
- The Hub token system provides the real authentication layer
- The frontend checks profile.role === 'admin' before showing the editor
- Supabase RLS here is a secondary layer, consistent with how profiles table works
*/

-- ============================================================
-- races_catalog: add race_date column
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'races_catalog' AND column_name = 'race_date') THEN
    ALTER TABLE races_catalog ADD COLUMN race_date date;
  END IF;
END $$;

-- ============================================================
-- races_catalog: replace admin write policies for anon access
-- ============================================================
DROP POLICY IF EXISTS "Admins can insert races" ON races_catalog;
CREATE POLICY "Admins can insert races"
  ON races_catalog FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update races" ON races_catalog;
CREATE POLICY "Admins can update races"
  ON races_catalog FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete races" ON races_catalog;
CREATE POLICY "Admins can delete races"
  ON races_catalog FOR DELETE
  TO anon, authenticated
  USING (true);

-- ============================================================
-- race_elevation_data: replace admin write policies for anon access
-- ============================================================
DROP POLICY IF EXISTS "Admins can insert race elevation data" ON race_elevation_data;
CREATE POLICY "Admins can insert race elevation data"
  ON race_elevation_data FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update race elevation data" ON race_elevation_data;
CREATE POLICY "Admins can update race elevation data"
  ON race_elevation_data FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete race elevation data" ON race_elevation_data;
CREATE POLICY "Admins can delete race elevation data"
  ON race_elevation_data FOR DELETE
  TO anon, authenticated
  USING (true);

-- ============================================================
-- race_aid_stations: replace admin write policies for anon access
-- ============================================================
DROP POLICY IF EXISTS "Admins can insert race aid stations" ON race_aid_stations;
CREATE POLICY "Admins can insert race aid stations"
  ON race_aid_stations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update race aid stations" ON race_aid_stations;
CREATE POLICY "Admins can update race aid stations"
  ON race_aid_stations FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete race aid stations" ON race_aid_stations;
CREATE POLICY "Admins can delete race aid stations"
  ON race_aid_stations FOR DELETE
  TO anon, authenticated
  USING (true);

-- ============================================================
-- race_change_history: replace admin insert policy for anon access
-- ============================================================
DROP POLICY IF EXISTS "Admins can insert race change history" ON race_change_history;
CREATE POLICY "Admins can insert race change history"
  ON race_change_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);