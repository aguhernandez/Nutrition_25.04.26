/*
  # Add Foods Table and Athlete Nutrition Link

  ## Summary
  Creates the foods database table (admin-managed, USDA-seeded) and adds
  a table to link nutrition plans to athletes for coach-athlete workflows.

  ## New Tables

  ### foods
  Central food database. Admins/coaches can add foods manually or via USDA API.
  Contains full macro + micro nutritional data per 100g.

  ### athlete_nutrition_plans
  Links meal plans from coaches to athletes, enabling the coach → athlete
  nutrition delivery workflow.

  ## Security
  - foods: readable by all authenticated, writable only by admin/coach
  - athlete_nutrition_plans: readable/writable by coach and the athlete it belongs to
*/

-- ─────────────────────────────────────────────
-- foods
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES auth.users(id),
  name text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'other',
  -- Per 100g values
  calories_kcal numeric NOT NULL DEFAULT 0,
  carbs_g numeric NOT NULL DEFAULT 0,
  protein_g numeric NOT NULL DEFAULT 0,
  fat_g numeric NOT NULL DEFAULT 0,
  fiber_g numeric NOT NULL DEFAULT 0,
  sugar_g numeric NOT NULL DEFAULT 0,
  sodium_mg numeric NOT NULL DEFAULT 0,
  potassium_mg numeric NOT NULL DEFAULT 0,
  -- Serving info
  serving_size_g numeric NOT NULL DEFAULT 100,
  serving_description text NOT NULL DEFAULT '100g',
  -- Source
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'usda', 'imported')),
  usda_fdc_id text,
  is_verified boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  tags jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read active foods"
  ON foods FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admin and coach can insert foods"
  ON foods FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'coach')
    )
  );

CREATE POLICY "Admin and coach can update foods"
  ON foods FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'coach')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'coach')
    )
  );

CREATE POLICY "Admin can delete foods"
  ON foods FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS foods_name_idx ON foods(name);
CREATE INDEX IF NOT EXISTS foods_category_idx ON foods(category);

-- ─────────────────────────────────────────────
-- athlete_nutrition_plans
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS athlete_nutrition_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES auth.users(id),
  coach_id uuid NOT NULL REFERENCES auth.users(id),
  meal_plan_id uuid NOT NULL REFERENCES meal_plans(id),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE athlete_nutrition_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athlete can read their own plans"
  ON athlete_nutrition_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = athlete_id OR auth.uid() = coach_id);

CREATE POLICY "Coach can assign plans to athletes"
  ON athlete_nutrition_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coach can update assigned plans"
  ON athlete_nutrition_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = coach_id)
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coach can delete assigned plans"
  ON athlete_nutrition_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = coach_id);

CREATE INDEX IF NOT EXISTS athlete_nutrition_plans_athlete_idx ON athlete_nutrition_plans(athlete_id);
CREATE INDEX IF NOT EXISTS athlete_nutrition_plans_coach_idx ON athlete_nutrition_plans(coach_id);
