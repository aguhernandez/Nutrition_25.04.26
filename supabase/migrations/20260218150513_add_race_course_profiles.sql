/*
  # Add Race Course Profiles Table

  ## Purpose
  Stores customizable course data per race edition including hydration station positions.
  Races can change their aid station locations year to year, so this is user-editable.

  ## New Tables

  ### race_course_profiles
  - `id` (uuid, primary key)
  - `race_catalog_id` (uuid, FK to races_catalog) - links to the base race
  - `user_id` (uuid, FK to auth.users) - owner of this customization
  - `edition_year` (int) - which race year this profile applies to
  - `hydration_stations` (jsonb) - array of {km: number, label: string, hasFood: boolean}
  - `elevation_points` (jsonb) - array of {km: number, elevationM: number} for course profile
  - `notes` (text) - free-form notes about this edition
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - Users can read/create/update/delete their own profiles
  - Public profiles (user_id IS NULL) are readable by all (for seeded official data)
*/

CREATE TABLE IF NOT EXISTS race_course_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  race_catalog_id uuid REFERENCES races_catalog(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  edition_year integer NOT NULL DEFAULT extract(year from now())::integer,
  hydration_stations jsonb NOT NULL DEFAULT '[]'::jsonb,
  elevation_points jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE race_course_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own course profiles"
  ON race_course_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public profiles are readable by all"
  ON race_course_profiles FOR SELECT
  TO anon, authenticated
  USING (user_id IS NULL);

CREATE POLICY "Users can create own course profiles"
  ON race_course_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course profiles"
  ON race_course_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own course profiles"
  ON race_course_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_race_course_profiles_catalog ON race_course_profiles(race_catalog_id);
CREATE INDEX IF NOT EXISTS idx_race_course_profiles_user ON race_course_profiles(user_id);
