/*
  # Create Meal Plan Templates Table

  1. New Tables
    - `meal_plan_templates`
      - `id` (uuid, primary key)
      - `name` (text) - Template display name (bilingual)
      - `name_es` (text) - Spanish name
      - `name_en` (text) - English name
      - `description_es` (text) - Spanish description
      - `description_en` (text) - English description
      - `calories_target` (integer) - Target daily calories (1800, 2000, 2300, etc.)
      - `focus` (text) - Diet focus: 'balanced' | 'high_carb' | 'high_protein' | 'endurance' | 'strength'
      - `dietary_pattern` (text) - 'omnivore' | 'vegetarian' | 'vegan'
      - `protein_g` (integer) - Daily protein grams
      - `carbs_g` (integer) - Daily carbs grams
      - `fat_g` (integer) - Daily fat grams
      - `fiber_g` (integer) - Daily fiber grams
      - `days` (jsonb) - Array of 7 days, each with meals array
      - `tags` (text[]) - Searchable tags
      - `suitable_for` (text[]) - Sports/goals this template suits
      - `is_active` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - All authenticated and anon users can SELECT (public templates)
    - Only admin can INSERT/UPDATE/DELETE

  3. Notes
    - The `days` JSONB structure:
      [
        {
          "day_number": 1,
          "day_name": "Lunes / Monday",
          "meals": [
            {
              "slot": "breakfast",
              "name_es": "Avena con frutas",
              "name_en": "Oatmeal with fruits",
              "foods": [
                {
                  "name_es": "Avena",
                  "name_en": "Oats",
                  "quantity_g": 80,
                  "calories": 296,
                  "protein_g": 10.4,
                  "carbs_g": 54.4,
                  "fat_g": 5.4
                }
              ],
              "calories": 350,
              "protein_g": 12,
              "carbs_g": 60,
              "fat_g": 7,
              "notes_es": "",
              "notes_en": ""
            }
          ],
          "total_calories": 2000,
          "total_protein_g": 150,
          "total_carbs_g": 250,
          "total_fat_g": 65
        }
      ]
*/

CREATE TABLE IF NOT EXISTS meal_plan_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_es text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '',
  description_es text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  calories_target integer NOT NULL DEFAULT 2000,
  focus text NOT NULL DEFAULT 'balanced' CHECK (focus IN ('balanced', 'high_carb', 'high_protein', 'endurance', 'strength', 'weight_loss', 'recovery')),
  dietary_pattern text NOT NULL DEFAULT 'omnivore' CHECK (dietary_pattern IN ('omnivore', 'vegetarian', 'vegan')),
  protein_g integer NOT NULL DEFAULT 150,
  carbs_g integer NOT NULL DEFAULT 250,
  fat_g integer NOT NULL DEFAULT 65,
  fiber_g integer NOT NULL DEFAULT 30,
  days jsonb NOT NULL DEFAULT '[]',
  tags text[] NOT NULL DEFAULT '{}',
  suitable_for text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE meal_plan_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active meal plan templates"
  ON meal_plan_templates
  FOR SELECT
  USING (is_active = true);
