/*
  # Coach Notes & Food Search Improvements

  ## New Tables
  
  ### `coach_athlete_notes`
  - Allows coaches/admins to leave nutrition notes for specific athletes
  - Fields: id, coach_id, athlete_id, title, content, note_type, is_pinned, created_at, updated_at
  - note_type: 'general' | 'race_protocol' | 'macro_adjustment' | 'supplement' | 'warning'

  ## Modifications

  ### `foods_v2` - Ensure micronutrient columns are queriable
  - Add a generated column `search_vector` or rely on existing micronutrient columns
  - No structural changes needed; the table already has micronutrient columns from previous migration

  ## Security
  - Enable RLS on coach_athlete_notes
  - Coaches/admins can insert/update/delete their own notes
  - Athletes can read notes addressed to them
  - Coaches can read all notes they authored
*/

CREATE TABLE IF NOT EXISTS coach_athlete_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL,
  athlete_id uuid NOT NULL,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  note_type text NOT NULL DEFAULT 'general',
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE coach_athlete_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can insert their own notes"
  ON coach_athlete_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can view notes they authored"
  ON coach_athlete_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = coach_id OR auth.uid() = athlete_id);

CREATE POLICY "Coaches can update their own notes"
  ON coach_athlete_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = coach_id)
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete their own notes"
  ON coach_athlete_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = coach_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coach_athlete_notes' AND column_name = 'note_type'
  ) THEN
    ALTER TABLE coach_athlete_notes ADD COLUMN note_type text NOT NULL DEFAULT 'general';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_coach_athlete_notes_athlete ON coach_athlete_notes(athlete_id);
CREATE INDEX IF NOT EXISTS idx_coach_athlete_notes_coach ON coach_athlete_notes(coach_id);
