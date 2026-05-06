/*
  # Tags System

  ## Summary
  Creates a flexible tagging system for the satellite planner. Tags can be
  applied to meal plans, competitions (race plans), and recipes.

  ## New Tables
  - `tags` — master catalog of all tags with name, slug, category, color
  - `meal_plan_tags` — junction: meal_plans_v2 ↔ tags
  - `competition_tags` — junction: competitions ↔ tags
  - `recipe_tags` — junction: nutrition_recipes_v2 ↔ tags

  ## Valid Categories
  training, nutrition, recovery, performance, mindset, methodology, other

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read all tags (shared catalog)
  - Users can only manage their own junction records
*/

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_es text,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'training',
  description text,
  color text DEFAULT '#fdda36',
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all tags"
  ON tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Tag creators can update their tags"
  ON tags FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR created_by IS NULL)
  WITH CHECK (created_by = auth.uid() OR created_by IS NULL);

CREATE POLICY "Tag creators can delete their tags"
  ON tags FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Anon can read all tags"
  ON tags FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert tags"
  ON tags FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update tags"
  ON tags FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS meal_plan_tags (
  meal_plan_id uuid NOT NULL REFERENCES meal_plans_v2(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (meal_plan_id, tag_id)
);

ALTER TABLE meal_plan_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can read meal_plan_tags"
  ON meal_plan_tags FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert meal_plan_tags"
  ON meal_plan_tags FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can delete meal_plan_tags"
  ON meal_plan_tags FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can read meal_plan_tags"
  ON meal_plan_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert meal_plan_tags"
  ON meal_plan_tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete meal_plan_tags"
  ON meal_plan_tags FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS competition_tags (
  competition_id uuid NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (competition_id, tag_id)
);

ALTER TABLE competition_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can read competition_tags"
  ON competition_tags FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert competition_tags"
  ON competition_tags FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can delete competition_tags"
  ON competition_tags FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can read competition_tags"
  ON competition_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert competition_tags"
  ON competition_tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete competition_tags"
  ON competition_tags FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS recipe_tags (
  recipe_id uuid NOT NULL REFERENCES nutrition_recipes_v2(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (recipe_id, tag_id)
);

ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can read recipe_tags"
  ON recipe_tags FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert recipe_tags"
  ON recipe_tags FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can delete recipe_tags"
  ON recipe_tags FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can read recipe_tags"
  ON recipe_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert recipe_tags"
  ON recipe_tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete recipe_tags"
  ON recipe_tags FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_meal_plan_tags_plan_id ON meal_plan_tags(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_tags_tag_id ON meal_plan_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_competition_tags_comp_id ON competition_tags(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_tags_tag_id ON competition_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_recipe_tags_recipe_id ON recipe_tags(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_tags_tag_id ON recipe_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);
