/*
  # Create Training Sessions Table (Hub Bridge)

  ## Purpose
  This table receives training data from the Hub app (Asciende Metabolic Lab or similar).
  Both apps share the same Supabase project, so the Hub can write to this table and
  the Nutrition & Race Planner can read it to show coaches a sneak peek of athlete training.

  ## New Tables

  ### training_sessions
  Stores individual training sessions per athlete. The Hub writes here, the Planner reads here.
  - `id` - UUID primary key
  - `athlete_id` - References auth.users(id) — MUST match the same Supabase Auth user
  - `session_date` - Date of the session
  - `type` - Session type: run, bike, swim, strength, triathlon, other
  - `duration_minutes` - Duration in minutes
  - `distance_km` - Distance covered (nullable)
  - `intensity` - Perceived intensity: easy, moderate, hard, race
  - `tss` - Training Stress Score (optional, from Hub analytics)
  - `title` - Optional short title for the session
  - `notes` - Coach/athlete notes
  - `source` - Which app wrote this record ('hub', 'planner', 'manual')
  - `created_at`, `updated_at`

  ### training_weeks
  Weekly summary rolled up from sessions or written directly by the Hub.
  - `athlete_id`, `week_start` - composite unique key
  - `planned_hours`, `completed_hours`
  - `phase` - Training phase: base, build, peak, taper, recovery

  ## Security
  - RLS enabled on both tables
  - Athletes can read/write their own sessions
  - Coaches and admins can read all sessions
  - Service role (used by Hub backend/edge functions) can write on behalf of athletes
*/

-- Training Sessions
CREATE TABLE IF NOT EXISTS training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date date NOT NULL,
  type text NOT NULL DEFAULT 'other' CHECK (type IN ('run', 'bike', 'swim', 'strength', 'triathlon', 'brick', 'other')),
  duration_minutes integer NOT NULL DEFAULT 0,
  distance_km numeric(7,2),
  intensity text NOT NULL DEFAULT 'moderate' CHECK (intensity IN ('easy', 'moderate', 'hard', 'race')),
  tss integer,
  title text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('hub', 'planner', 'manual')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS training_sessions_athlete_date ON training_sessions (athlete_id, session_date DESC);

ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can read own training sessions"
  ON training_sessions FOR SELECT
  TO authenticated
  USING (
    auth.uid() = athlete_id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'coach')
    )
  );

CREATE POLICY "Athletes can insert own training sessions"
  ON training_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Athletes can update own training sessions"
  ON training_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Athletes can delete own training sessions"
  ON training_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = athlete_id);

-- Training Weeks (summary view)
CREATE TABLE IF NOT EXISTS training_weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  planned_hours numeric(5,2) NOT NULL DEFAULT 0,
  completed_hours numeric(5,2) NOT NULL DEFAULT 0,
  phase text NOT NULL DEFAULT 'base' CHECK (phase IN ('base', 'build', 'peak', 'taper', 'recovery')),
  notes text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('hub', 'planner', 'manual')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (athlete_id, week_start)
);

CREATE INDEX IF NOT EXISTS training_weeks_athlete_week ON training_weeks (athlete_id, week_start DESC);

ALTER TABLE training_weeks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can read own training weeks"
  ON training_weeks FOR SELECT
  TO authenticated
  USING (
    auth.uid() = athlete_id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'coach')
    )
  );

CREATE POLICY "Athletes can insert own training weeks"
  ON training_weeks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Athletes can update own training weeks"
  ON training_weeks FOR UPDATE
  TO authenticated
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Athletes can delete own training weeks"
  ON training_weeks FOR DELETE
  TO authenticated
  USING (auth.uid() = athlete_id);
