/*
  # Race Planner Database Schema

  ## Overview
  Creates the core tables for the Race Planner module, independent from any training planner.

  ## New Tables

  ### competitions
  Stores all race/competition records with athlete inputs and calculated strategy outputs.
  - `id` - Unique identifier
  - `athlete_id` - Optional user/athlete identifier for future auth integration
  - `sport` - Sport category (running, cycling, triathlon, swimming, trail_running, hyrox)
  - `sub_sport` - Sub-category (road, trail, gravel, mountain_bike, etc.)
  - `race_name` - Name of the race/event
  - `race_data` - JSON blob with all race parameters (distance, elevation, temp, humidity, altitude)
  - `athlete_data` - JSON blob with athlete metrics (weight, VO2max, threshold pace/power, etc.)
  - `strategy_preferences` - JSON blob with strategy choices (target, caffeine, gut trained)
  - `strategy_output` - JSON blob with full calculated output (pacing, carbs, hydration, risks)
  - `race_date` - Scheduled date of the race
  - `created_at` - Record creation timestamp

  ### post_race_feedback
  Stores post-race actual data for future model improvement.
  - `id` - Unique identifier
  - `competition_id` - Foreign key to competitions
  - `actual_duration_min` - Actual finish time in minutes
  - `average_hr` - Average heart rate during race
  - `gi_issues` - Whether GI issues were experienced
  - `actual_carb_intake_g_h` - Actual carb intake in g/hour
  - `actual_temperature` - Actual race day temperature
  - `notes` - Free text notes
  - `created_at` - Record creation timestamp

  ## Security
  - RLS enabled on both tables
  - Public insert/select allowed for now (no auth required for v1)
  - Policies scoped to anon and authenticated roles
*/

CREATE TABLE IF NOT EXISTS competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id text DEFAULT '',
  sport text NOT NULL,
  sub_sport text DEFAULT '',
  race_name text NOT NULL,
  race_data jsonb NOT NULL DEFAULT '{}',
  athlete_data jsonb NOT NULL DEFAULT '{}',
  strategy_preferences jsonb NOT NULL DEFAULT '{}',
  strategy_output jsonb NOT NULL DEFAULT '{}',
  race_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert competitions"
  ON competitions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read competitions"
  ON competitions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update competitions"
  ON competitions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS post_race_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid REFERENCES competitions(id) ON DELETE CASCADE,
  actual_duration_min numeric,
  average_hr numeric,
  gi_issues boolean DEFAULT false,
  actual_carb_intake_g_h numeric,
  actual_temperature numeric,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_race_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert post race feedback"
  ON post_race_feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read post race feedback"
  ON post_race_feedback FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update post race feedback"
  ON post_race_feedback FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
