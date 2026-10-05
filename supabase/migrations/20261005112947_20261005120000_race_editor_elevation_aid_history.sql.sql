/*
# Race Editor: Elevation Data, AID Station Details, Change History

## Overview
Adds support for the admin Race Editor feature:
1. Per-race elevation point arrays stored as shared/public data (not per-user)
2. Rich AID station metadata (altitude, supply types, services)
3. Change history log tracking who changed what and when for each race
4. Admin-only write policies on races_catalog and new tables

## New Tables

### race_elevation_data
- `id` (uuid, PK)
- `race_catalog_id` (uuid, FK to races_catalog ON DELETE CASCADE) - unique per race
- `elevation_points` (jsonb) - array of {km, elevationM} defining the course profile
- `source` (text) - how data was provided: 'manual', 'gpx_import', 'csv_import'
- `updated_by` (text) - email/name of the admin who last updated
- `updated_at` (timestamptz)
- One row per race (UNIQUE on race_catalog_id)

### race_aid_stations
- `id` (uuid, PK)
- `race_catalog_id` (uuid, FK to races_catalog ON DELETE CASCADE)
- `name` (text) - station name
- `distance_km` (numeric) - distance from start in km
- `altitude_m` (numeric) - altitude at station in meters
- `supply_types` (text[]) - water, food, medical, energy_gel, drop_bags, etc.
- `services` (text[]) - medical_assistance, drop_bags, restroom, crew_access, etc.
- `sort_order` (int) - ordering by distance
- `created_at`, `updated_at` (timestamptz)

### race_change_history
- `id` (uuid, PK)
- `race_catalog_id` (uuid, FK to races_catalog ON DELETE CASCADE)
- `changed_by` (text) - admin email or name
- `changed_by_role` (text) - role of the user
- `change_type` (text) - 'create', 'update', 'delete', 'elevation_import', 'aid_add', 'aid_update', 'aid_delete'
- `field_name` (text, nullable) - which field changed (for update type)
- `old_value` (text, nullable) - previous value
- `new_value` (text, nullable) - new value
- `summary` (text) - human-readable description of the change
- `created_at` (timestamptz)

## Security
- `race_elevation_data`: public read (anon+authenticated), admin-only write
- `race_aid_stations`: public read (anon+authenticated), admin-only write
- `race_change_history`: public read (anon+authenticated), admin-only insert; append-only (no update/delete)
- `races_catalog`: add admin INSERT/UPDATE/DELETE policies (existing SELECT stays public)

## Admin Write Access Pattern
Admins are identified by their profile role:
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
*/

-- ============================================================
-- race_elevation_data: shared/public elevation profile per race
-- ============================================================
CREATE TABLE IF NOT EXISTS race_elevation_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  race_catalog_id uuid NOT NULL UNIQUE REFERENCES races_catalog(id) ON DELETE CASCADE,
  elevation_points jsonb NOT NULL DEFAULT '[]'::jsonb,
  source text NOT NULL DEFAULT 'manual',
  updated_by text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE race_elevation_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read race elevation data" ON race_elevation_data;
CREATE POLICY "Public can read race elevation data"
  ON race_elevation_data FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert race elevation data" ON race_elevation_data;
CREATE POLICY "Admins can insert race elevation data"
  ON race_elevation_data FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Admins can update race elevation data" ON race_elevation_data;
CREATE POLICY "Admins can update race elevation data"
  ON race_elevation_data FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Admins can delete race elevation data" ON race_elevation_data;
CREATE POLICY "Admins can delete race elevation data"
  ON race_elevation_data FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============================================================
-- race_aid_stations: rich AID station metadata per race
-- ============================================================
CREATE TABLE IF NOT EXISTS race_aid_stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  race_catalog_id uuid NOT NULL REFERENCES races_catalog(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  distance_km numeric NOT NULL DEFAULT 0,
  altitude_m numeric NOT NULL DEFAULT 0,
  supply_types text[] NOT NULL DEFAULT '{}',
  services text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE race_aid_stations ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_race_aid_stations_catalog ON race_aid_stations(race_catalog_id);

DROP POLICY IF EXISTS "Public can read race aid stations" ON race_aid_stations;
CREATE POLICY "Public can read race aid stations"
  ON race_aid_stations FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert race aid stations" ON race_aid_stations;
CREATE POLICY "Admins can insert race aid stations"
  ON race_aid_stations FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Admins can update race aid stations" ON race_aid_stations;
CREATE POLICY "Admins can update race aid stations"
  ON race_aid_stations FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Admins can delete race aid stations" ON race_aid_stations;
CREATE POLICY "Admins can delete race aid stations"
  ON race_aid_stations FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============================================================
-- race_change_history: append-only audit log
-- ============================================================
CREATE TABLE IF NOT EXISTS race_change_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  race_catalog_id uuid NOT NULL REFERENCES races_catalog(id) ON DELETE CASCADE,
  changed_by text NOT NULL DEFAULT '',
  changed_by_role text NOT NULL DEFAULT '',
  change_type text NOT NULL DEFAULT 'update',
  field_name text,
  old_value text,
  new_value text,
  summary text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE race_change_history ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_race_change_history_catalog ON race_change_history(race_catalog_id);
CREATE INDEX IF NOT EXISTS idx_race_change_history_created ON race_change_history(created_at DESC);

DROP POLICY IF EXISTS "Public can read race change history" ON race_change_history;
CREATE POLICY "Public can read race change history"
  ON race_change_history FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert race change history" ON race_change_history;
CREATE POLICY "Admins can insert race change history"
  ON race_change_history FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============================================================
-- races_catalog: add admin write policies (INSERT/UPDATE/DELETE)
-- ============================================================
DROP POLICY IF EXISTS "Admins can insert races" ON races_catalog;
CREATE POLICY "Admins can insert races"
  ON races_catalog FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Admins can update races" ON races_catalog;
CREATE POLICY "Admins can update races"
  ON races_catalog FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Admins can delete races" ON races_catalog;
CREATE POLICY "Admins can delete races"
  ON races_catalog FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));