/*
  # Race Activity & Smart Fuel Notifications

  ## Overview
  Implements the RecordRaceActivity + Smart Fuel Notifications module as part of the Race Planner.
  Separate from the HUB but designed for future integration.

  ## New Tables

  ### race_activity
  Tracks a live race session tied to a saved competition plan.
  - id (uuid, pk)
  - competition_id (uuid, fk → competitions)
  - athlete_id (uuid, fk → auth.users)
  - start_time (timestamptz)
  - end_time (timestamptz, nullable)
  - status: 'active' | 'paused' | 'completed' | 'abandoned'
  - current_km (numeric)
  - elapsed_time_min (numeric)
  - adaptive_fluid_factor (numeric, default 1.0) — multiplier for adaptive adjustments
  - conditions: jsonb — real-time temperature, humidity, pace factor

  ### race_events
  Each fuel/GPS/acknowledgement event during a race session.
  - id (uuid, pk)
  - race_activity_id (uuid, fk → race_activity)
  - athlete_id (uuid, fk → auth.users)
  - event_type: 'GPS' | 'CARB_REMINDER' | 'FLUID_REMINDER' | 'CAFFEINE_REMINDER' | 'ELECTROLYTE_REMINDER' | 'PACE_ALERT' | 'AID_STATION'
  - scheduled_at_sec (integer) — seconds from race start when alert was scheduled
  - fired_at_sec (integer, nullable) — actual seconds from race start when fired
  - km_mark (numeric, nullable)
  - message (text)
  - acknowledged (boolean, default false)
  - snoozed_sec (integer, nullable) — snooze duration in seconds
  - payload (jsonb) — carbs_g, fluid_ml, sodium_mg, caffeine_mg etc

  ## Security
  - RLS enabled on both tables
  - Users can only read/write their own race activities and events
*/

CREATE TABLE IF NOT EXISTS race_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid REFERENCES competitions(id) ON DELETE SET NULL,
  athlete_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  current_km numeric NOT NULL DEFAULT 0,
  elapsed_time_min numeric NOT NULL DEFAULT 0,
  adaptive_fluid_factor numeric NOT NULL DEFAULT 1.0,
  conditions jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS race_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  race_activity_id uuid NOT NULL REFERENCES race_activity(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('GPS','CARB_REMINDER','FLUID_REMINDER','CAFFEINE_REMINDER','ELECTROLYTE_REMINDER','PACE_ALERT','AID_STATION','INFO')),
  scheduled_at_sec integer NOT NULL DEFAULT 0,
  fired_at_sec integer,
  km_mark numeric,
  message text NOT NULL DEFAULT '',
  acknowledged boolean NOT NULL DEFAULT false,
  snoozed_sec integer,
  payload jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE race_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can select own race activities"
  ON race_activity FOR SELECT
  TO authenticated
  USING (auth.uid() = athlete_id);

CREATE POLICY "Athletes can insert own race activities"
  ON race_activity FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Athletes can update own race activities"
  ON race_activity FOR UPDATE
  TO authenticated
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Athletes can select own race events"
  ON race_events FOR SELECT
  TO authenticated
  USING (auth.uid() = athlete_id);

CREATE POLICY "Athletes can insert own race events"
  ON race_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Athletes can update own race events"
  ON race_events FOR UPDATE
  TO authenticated
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

CREATE INDEX IF NOT EXISTS idx_race_activity_athlete ON race_activity(athlete_id);
CREATE INDEX IF NOT EXISTS idx_race_events_activity ON race_events(race_activity_id);
CREATE INDEX IF NOT EXISTS idx_race_events_athlete ON race_events(athlete_id);
