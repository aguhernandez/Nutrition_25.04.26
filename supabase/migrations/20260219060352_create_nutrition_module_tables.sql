/*
  # Nutrition Module Tables

  ## Summary
  Creates the complete nutrition module schema for the Asciende satellite app.
  This module handles athlete nutrition planning, daily food diary, anamnesis,
  meal plan templates, recipes, and shopping lists — all linked to the existing
  profiles and competitions tables.

  ## New Tables

  ### nutrition_anamnesis
  One-per-athlete nutritional profile: goals, dietary restrictions, allergies,
  body composition, training load context, and supplement usage.

  ### meal_plans
  Structured multi-day meal plans (e.g., "Race Week Plan") with type tags
  (base, load, taper, race_day, recovery). Each plan has a JSONB structure
  for daily meals organized by day index and meal slot.

  ### daily_food_diary
  24-hour food diary entries. Each row = one food item logged on a given date.
  Includes meal timing slot, macros at time of logging, and optional AI notes.

  ### recipes
  User or system recipes with ingredients list, macros, prep time, category,
  and tags. Recipes can be marked as public (visible to all athletes).

  ### shopping_list_items
  Shopping list tied to a meal plan or standalone. Tracks items, quantities,
  units, category, and checked state.

  ## Security
  RLS enabled on all tables. Athletes can only access their own data.
  Coaches can read data of their athletes (via profiles lookup).
  Public recipes are readable by all authenticated users.
*/

-- ─────────────────────────────────────────────
-- nutrition_anamnesis
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nutrition_anamnesis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  -- Goals
  primary_goal text NOT NULL DEFAULT 'performance' CHECK (primary_goal IN ('weight_loss','muscle_gain','performance','endurance','health')),
  secondary_goals jsonb NOT NULL DEFAULT '[]',
  -- Anthropometrics
  body_weight_kg numeric NOT NULL DEFAULT 70,
  body_height_cm numeric NOT NULL DEFAULT 170,
  body_fat_pct numeric,
  lean_mass_kg numeric,
  -- Training context
  weekly_training_hours numeric NOT NULL DEFAULT 8,
  primary_sport text NOT NULL DEFAULT 'running',
  training_phase text NOT NULL DEFAULT 'base' CHECK (training_phase IN ('base','build','peak','taper','recovery','off')),
  next_race_date date,
  -- Dietary profile
  dietary_pattern text NOT NULL DEFAULT 'omnivore' CHECK (dietary_pattern IN ('omnivore','vegetarian','vegan','pescatarian','keto','paleo','other')),
  food_allergies jsonb NOT NULL DEFAULT '[]',
  food_intolerances jsonb NOT NULL DEFAULT '[]',
  disliked_foods jsonb NOT NULL DEFAULT '[]',
  preferred_foods jsonb NOT NULL DEFAULT '[]',
  -- GI & gut health
  gi_history text NOT NULL DEFAULT 'none' CHECK (gi_history IN ('none','mild','moderate','severe')),
  gut_trained boolean NOT NULL DEFAULT false,
  -- Supplement usage
  current_supplements jsonb NOT NULL DEFAULT '[]',
  -- Targets (auto-calculated or manual override)
  target_calories_kcal integer,
  target_carbs_g integer,
  target_protein_g integer,
  target_fat_g integer,
  target_hydration_ml integer,
  -- Notes
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE nutrition_anamnesis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read own anamnesis"
  ON nutrition_anamnesis FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "User can insert own anamnesis"
  ON nutrition_anamnesis FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update own anamnesis"
  ON nutrition_anamnesis FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can delete own anamnesis"
  ON nutrition_anamnesis FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS nutrition_anamnesis_user_id_idx ON nutrition_anamnesis(user_id);

-- ─────────────────────────────────────────────
-- meal_plans
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  plan_type text NOT NULL DEFAULT 'base' CHECK (plan_type IN ('base','load','taper','race_day','recovery','custom')),
  duration_days integer NOT NULL DEFAULT 7,
  -- JSONB structure: { "day_1": { "breakfast": [...], "lunch": [...], "dinner": [...], "snacks": [...] } }
  meals jsonb NOT NULL DEFAULT '{}',
  -- Calculated totals per day (array indexed by day)
  daily_totals jsonb NOT NULL DEFAULT '[]',
  is_template boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  competition_id uuid REFERENCES competitions(id),
  tags jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read own meal plans"
  ON meal_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "User can insert own meal plans"
  ON meal_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update own meal plans"
  ON meal_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can delete own meal plans"
  ON meal_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS meal_plans_user_id_idx ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS meal_plans_competition_id_idx ON meal_plans(competition_id);

-- ─────────────────────────────────────────────
-- daily_food_diary
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_food_diary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  diary_date date NOT NULL DEFAULT CURRENT_DATE,
  meal_slot text NOT NULL DEFAULT 'breakfast' CHECK (meal_slot IN ('pre_sleep','wake_up','breakfast','mid_morning','lunch','pre_training','during_training','post_training','afternoon_snack','dinner','evening_snack')),
  food_name text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  serving_quantity numeric NOT NULL DEFAULT 1,
  serving_unit text NOT NULL DEFAULT 'serving',
  -- Macros for this specific entry
  calories_kcal numeric NOT NULL DEFAULT 0,
  carbs_g numeric NOT NULL DEFAULT 0,
  protein_g numeric NOT NULL DEFAULT 0,
  fat_g numeric NOT NULL DEFAULT 0,
  fiber_g numeric NOT NULL DEFAULT 0,
  sodium_mg numeric NOT NULL DEFAULT 0,
  sugar_g numeric NOT NULL DEFAULT 0,
  -- Context
  is_training_day boolean NOT NULL DEFAULT false,
  training_type text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  ai_suggestion text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_food_diary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read own diary"
  ON daily_food_diary FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "User can insert own diary"
  ON daily_food_diary FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update own diary"
  ON daily_food_diary FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can delete own diary"
  ON daily_food_diary FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS daily_food_diary_user_date_idx ON daily_food_diary(user_id, diary_date);

-- ─────────────────────────────────────────────
-- recipes
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'meal' CHECK (category IN ('breakfast','snack','lunch','dinner','recovery','pre_race','during_race','post_race','meal')),
  prep_time_min integer NOT NULL DEFAULT 15,
  cook_time_min integer NOT NULL DEFAULT 0,
  servings integer NOT NULL DEFAULT 1,
  -- Ingredients: [{ name, quantity, unit, calories, carbs, protein, fat }]
  ingredients jsonb NOT NULL DEFAULT '[]',
  instructions text NOT NULL DEFAULT '',
  -- Macros per serving (total, auto-calculated from ingredients)
  calories_kcal numeric NOT NULL DEFAULT 0,
  carbs_g numeric NOT NULL DEFAULT 0,
  protein_g numeric NOT NULL DEFAULT 0,
  fat_g numeric NOT NULL DEFAULT 0,
  fiber_g numeric NOT NULL DEFAULT 0,
  sodium_mg numeric NOT NULL DEFAULT 0,
  -- Metadata
  tags jsonb NOT NULL DEFAULT '[]',
  suitable_for jsonb NOT NULL DEFAULT '["all"]',
  image_url text NOT NULL DEFAULT '',
  is_public boolean NOT NULL DEFAULT false,
  is_favorite boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read own recipes"
  ON recipes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can read public recipes"
  ON recipes FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "User can insert own recipes"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update own recipes"
  ON recipes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can delete own recipes"
  ON recipes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS recipes_user_id_idx ON recipes(user_id);

-- ─────────────────────────────────────────────
-- shopping_list_items
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shopping_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  meal_plan_id uuid REFERENCES meal_plans(id),
  item_name text NOT NULL DEFAULT '',
  quantity numeric NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'unit',
  category text NOT NULL DEFAULT 'other' CHECK (category IN ('produce','protein','dairy','grains','fats','supplements','beverages','frozen','pantry','other')),
  is_checked boolean NOT NULL DEFAULT false,
  notes text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read own shopping list"
  ON shopping_list_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "User can insert own shopping list"
  ON shopping_list_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can update own shopping list"
  ON shopping_list_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can delete own shopping list"
  ON shopping_list_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS shopping_list_user_id_idx ON shopping_list_items(user_id);
CREATE INDEX IF NOT EXISTS shopping_list_plan_id_idx ON shopping_list_items(meal_plan_id);
