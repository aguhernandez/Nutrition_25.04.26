/*
  # Nutrition V2 Tables

  ## Summary
  Creates new normalized nutrition tables to support the full meal planner system:
  - meal_plans_v2: Structured meal plans linked to athletes with calorie/macro goals
  - meal_plan_meals: Individual meals within a plan (breakfast, lunch, etc.) per day
  - meal_plan_items: Food items within each meal with gram-based macros
  - nutrition_anamnesis_v2: Comprehensive nutritional assessment (4 sections)
  - nutrition_targets: Calculated BMR/TDEE/macro targets
  - food_diary_sessions: 24/48h food diary tracking sessions
  - food_diary_entries: Individual food log entries within a session
  - nutrition_recipes_v2: Recipe library with ingredient lists

  ## Security
  All tables have RLS enabled with owner-based access policies.
*/

-- meal_plans_v2
CREATE TABLE IF NOT EXISTS meal_plans_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES auth.users(id),
  coach_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  description text,
  calories_goal integer DEFAULT 2000,
  protein_goal integer DEFAULT 150,
  carbs_goal integer DEFAULT 200,
  fats_goal integer DEFAULT 60,
  notes text,
  start_date date DEFAULT CURRENT_DATE,
  duration_days integer DEFAULT 7,
  day_names jsonb DEFAULT '{}',
  week_pattern jsonb DEFAULT '["yellow","green","yellow","green","yellow","red","red"]',
  status text DEFAULT 'active' CHECK (status IN ('active','archived','draft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE meal_plans_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes read own plans v2"
  ON meal_plans_v2 FOR SELECT
  TO authenticated
  USING (auth.uid() = athlete_id OR auth.uid() = coach_id);

CREATE POLICY "Athletes insert own plans v2"
  ON meal_plans_v2 FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = athlete_id OR auth.uid() = coach_id);

CREATE POLICY "Athletes update own plans v2"
  ON meal_plans_v2 FOR UPDATE
  TO authenticated
  USING (auth.uid() = athlete_id OR auth.uid() = coach_id)
  WITH CHECK (auth.uid() = athlete_id OR auth.uid() = coach_id);

CREATE POLICY "Athletes delete own plans v2"
  ON meal_plans_v2 FOR DELETE
  TO authenticated
  USING (auth.uid() = athlete_id OR auth.uid() = coach_id);

-- meal_plan_meals
CREATE TABLE IF NOT EXISTS meal_plan_meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES meal_plans_v2(id) ON DELETE CASCADE,
  meal_type text DEFAULT 'meal',
  meal_name text,
  meal_time text,
  sort_order integer DEFAULT 0,
  day_number integer DEFAULT 1,
  calories integer DEFAULT 0,
  protein numeric DEFAULT 0,
  carbs numeric DEFAULT 0,
  fat numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meal_plan_meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plan owners select meals"
  ON meal_plan_meals FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM meal_plans_v2
    WHERE meal_plans_v2.id = plan_id
    AND (meal_plans_v2.athlete_id = auth.uid() OR meal_plans_v2.coach_id = auth.uid())
  ));

CREATE POLICY "Plan owners insert meals"
  ON meal_plan_meals FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM meal_plans_v2
    WHERE meal_plans_v2.id = plan_id
    AND (meal_plans_v2.athlete_id = auth.uid() OR meal_plans_v2.coach_id = auth.uid())
  ));

CREATE POLICY "Plan owners update meals"
  ON meal_plan_meals FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM meal_plans_v2
    WHERE meal_plans_v2.id = plan_id
    AND (meal_plans_v2.athlete_id = auth.uid() OR meal_plans_v2.coach_id = auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM meal_plans_v2
    WHERE meal_plans_v2.id = plan_id
    AND (meal_plans_v2.athlete_id = auth.uid() OR meal_plans_v2.coach_id = auth.uid())
  ));

CREATE POLICY "Plan owners delete meals"
  ON meal_plan_meals FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM meal_plans_v2
    WHERE meal_plans_v2.id = plan_id
    AND (meal_plans_v2.athlete_id = auth.uid() OR meal_plans_v2.coach_id = auth.uid())
  ));

-- meal_plan_items
CREATE TABLE IF NOT EXISTS meal_plan_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id uuid NOT NULL REFERENCES meal_plan_meals(id) ON DELETE CASCADE,
  food_id uuid,
  food_name text NOT NULL,
  quantity_g numeric NOT NULL DEFAULT 100,
  calories numeric DEFAULT 0,
  protein_g numeric DEFAULT 0,
  carbs_g numeric DEFAULT 0,
  fat_g numeric DEFAULT 0,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plan owners select items"
  ON meal_plan_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM meal_plan_meals mpm
    JOIN meal_plans_v2 mp ON mp.id = mpm.plan_id
    WHERE mpm.id = meal_id
    AND (mp.athlete_id = auth.uid() OR mp.coach_id = auth.uid())
  ));

CREATE POLICY "Plan owners insert items"
  ON meal_plan_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM meal_plan_meals mpm
    JOIN meal_plans_v2 mp ON mp.id = mpm.plan_id
    WHERE mpm.id = meal_id
    AND (mp.athlete_id = auth.uid() OR mp.coach_id = auth.uid())
  ));

CREATE POLICY "Plan owners update items"
  ON meal_plan_items FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM meal_plan_meals mpm
    JOIN meal_plans_v2 mp ON mp.id = mpm.plan_id
    WHERE mpm.id = meal_id
    AND (mp.athlete_id = auth.uid() OR mp.coach_id = auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM meal_plan_meals mpm
    JOIN meal_plans_v2 mp ON mp.id = mpm.plan_id
    WHERE mpm.id = meal_id
    AND (mp.athlete_id = auth.uid() OR mp.coach_id = auth.uid())
  ));

CREATE POLICY "Plan owners delete items"
  ON meal_plan_items FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM meal_plan_meals mpm
    JOIN meal_plans_v2 mp ON mp.id = mpm.plan_id
    WHERE mpm.id = meal_id
    AND (mp.athlete_id = auth.uid() OR mp.coach_id = auth.uid())
  ));

-- nutrition_anamnesis_v2
CREATE TABLE IF NOT EXISTS nutrition_anamnesis_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES auth.users(id),
  trainer_id uuid REFERENCES auth.users(id),
  age integer,
  sex text,
  height_cm numeric,
  weight_kg numeric,
  occupation text,
  activity_level text DEFAULT 'moderate',
  work_hours integer,
  medical_conditions text,
  medications_supplements text,
  allergies_intolerances text,
  sleep_hours numeric,
  sleep_quality text,
  energy_levels text,
  stress_level text,
  sport text,
  training_frequency text,
  training_hours_weekly numeric,
  training_time text,
  pre_workout_nutrition text,
  during_workout_nutrition text,
  post_workout_nutrition text,
  eating_pattern text,
  dietary_preferences text,
  dietary_restrictions text,
  breakfast_description text,
  lunch_description text,
  dinner_description text,
  snacks_description text,
  beverages_description text,
  food_likes text,
  food_dislikes text,
  cooking_frequency text,
  eating_out_frequency text,
  appetite_changes text,
  relationship_with_food text,
  main_goal text DEFAULT 'performance',
  nutrition_goals text,
  performance_expectations text,
  upcoming_events text,
  additional_notes text,
  section_progress jsonb DEFAULT '{}',
  is_complete boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(athlete_id)
);

ALTER TABLE nutrition_anamnesis_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes read own anamnesis v2"
  ON nutrition_anamnesis_v2 FOR SELECT
  TO authenticated
  USING (auth.uid() = athlete_id OR auth.uid() = trainer_id);

CREATE POLICY "Athletes insert own anamnesis v2"
  ON nutrition_anamnesis_v2 FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = athlete_id OR auth.uid() = trainer_id);

CREATE POLICY "Athletes update own anamnesis v2"
  ON nutrition_anamnesis_v2 FOR UPDATE
  TO authenticated
  USING (auth.uid() = athlete_id OR auth.uid() = trainer_id)
  WITH CHECK (auth.uid() = athlete_id OR auth.uid() = trainer_id);

-- nutrition_targets
CREATE TABLE IF NOT EXISTS nutrition_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES auth.users(id),
  target_calories integer,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  protein_percent numeric,
  carbs_percent numeric,
  fat_percent numeric,
  protein_g_per_kg numeric,
  carbs_g_per_kg numeric,
  fat_g_per_kg numeric,
  bmr numeric,
  activity_factor numeric DEFAULT 1.55,
  tdee numeric,
  calculation_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(athlete_id)
);

ALTER TABLE nutrition_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes read own targets"
  ON nutrition_targets FOR SELECT
  TO authenticated
  USING (auth.uid() = athlete_id);

CREATE POLICY "Athletes insert own targets"
  ON nutrition_targets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Athletes update own targets"
  ON nutrition_targets FOR UPDATE
  TO authenticated
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

-- food_diary_sessions
CREATE TABLE IF NOT EXISTS food_diary_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES auth.users(id),
  period_hours integer DEFAULT 24,
  start_date date DEFAULT CURRENT_DATE,
  day_of_week text,
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),
  completed_at timestamptz,
  total_calories numeric,
  total_carbs_g numeric,
  total_protein_g numeric,
  total_fat_g numeric,
  ai_observations jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE food_diary_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes select own sessions"
  ON food_diary_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = athlete_id);

CREATE POLICY "Athletes insert own sessions"
  ON food_diary_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Athletes update own sessions"
  ON food_diary_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Athletes delete own sessions"
  ON food_diary_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = athlete_id);

-- food_diary_entries
CREATE TABLE IF NOT EXISTS food_diary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES food_diary_sessions(id) ON DELETE CASCADE,
  entry_time text,
  meal_type text DEFAULT 'other',
  entry_method text DEFAULT 'manual',
  food_description text NOT NULL,
  estimated_calories numeric DEFAULT 0,
  estimated_carbs_g numeric DEFAULT 0,
  estimated_protein_g numeric DEFAULT 0,
  estimated_fat_g numeric DEFAULT 0,
  additional_notes text,
  needs_review boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE food_diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes select own entries"
  ON food_diary_entries FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM food_diary_sessions
    WHERE food_diary_sessions.id = session_id
    AND food_diary_sessions.athlete_id = auth.uid()
  ));

CREATE POLICY "Athletes insert own entries"
  ON food_diary_entries FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM food_diary_sessions
    WHERE food_diary_sessions.id = session_id
    AND food_diary_sessions.athlete_id = auth.uid()
  ));

CREATE POLICY "Athletes update own entries"
  ON food_diary_entries FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM food_diary_sessions
    WHERE food_diary_sessions.id = session_id
    AND food_diary_sessions.athlete_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM food_diary_sessions
    WHERE food_diary_sessions.id = session_id
    AND food_diary_sessions.athlete_id = auth.uid()
  ));

CREATE POLICY "Athletes delete own entries"
  ON food_diary_entries FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM food_diary_sessions
    WHERE food_diary_sessions.id = session_id
    AND food_diary_sessions.athlete_id = auth.uid()
  ));

-- nutrition_recipes_v2
CREATE TABLE IF NOT EXISTS nutrition_recipes_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  category text DEFAULT 'main',
  servings integer DEFAULT 1,
  prep_time_minutes integer,
  cook_time_minutes integer,
  total_calories numeric DEFAULT 0,
  total_protein_g numeric DEFAULT 0,
  total_carbs_g numeric DEFAULT 0,
  total_fat_g numeric DEFAULT 0,
  calories_per_serving numeric DEFAULT 0,
  protein_per_serving numeric DEFAULT 0,
  carbs_per_serving numeric DEFAULT 0,
  fat_per_serving numeric DEFAULT 0,
  ingredients jsonb DEFAULT '[]',
  instructions text,
  tags text[] DEFAULT '{}',
  is_public boolean DEFAULT false,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE nutrition_recipes_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read own or public recipes v2"
  ON nutrition_recipes_v2 FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by OR is_public = true);

CREATE POLICY "Insert own recipes v2"
  ON nutrition_recipes_v2 FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Update own recipes v2"
  ON nutrition_recipes_v2 FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Delete own recipes v2"
  ON nutrition_recipes_v2 FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- foods_v2 (new normalized foods table)
CREATE TABLE IF NOT EXISTS foods_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_es text NOT NULL,
  name_en text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  calories_per_100g numeric NOT NULL DEFAULT 0,
  protein_per_100g numeric NOT NULL DEFAULT 0,
  carbs_per_100g numeric NOT NULL DEFAULT 0,
  fat_per_100g numeric NOT NULL DEFAULT 0,
  fiber_per_100g numeric DEFAULT 0,
  sugar_per_100g numeric DEFAULT 0,
  source text DEFAULT 'internal' CHECK (source IN ('internal','usda','open_food_facts')),
  is_verified boolean DEFAULT false,
  off_product_id text,
  usda_fdc_id text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foods_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read foods v2"
  ON foods_v2 FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Auth users insert foods v2"
  ON foods_v2 FOR INSERT
  TO authenticated
  WITH CHECK (true);
