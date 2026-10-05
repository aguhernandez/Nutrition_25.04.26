/*
# Create race nutrition timeline planner

1. New Tables
- `race_nutrition_assignments` stores every supplement assignment in a race plan.
- `id` is the assignment identifier.
- `competition_id` links the assignment to a saved race.
- `product_id` links to the existing `nutrition_products` catalog.
- `timing_mode` identifies time, distance, or aid-station placement.
- `timing_minutes` stores elapsed race minutes for time-based assignments.
- `distance_marker` stores the kilometer or mile marker for distance-based assignments.
- `aid_station_name` stores a named checkpoint when applicable.
- `quantity` stores how many servings are taken at that moment.
- `note` stores athlete-specific instructions.

2. Modified Tables
- `nutrition_products.category` now accepts `gummy`, `capsule`, and `real_food` in addition to existing categories.

3. Security
- Row level security is enabled on `race_nutrition_assignments`.
- The project uses a shared anon-key application flow, so anon and authenticated roles can perform the four explicit CRUD operations.
- Nutrition products remain readable through the existing public catalog policy.

4. Important Notes
- Assignments are independent rows, so the same product can be used at multiple moments and multiple products can share one moment.
- Deleting an assignment does not delete the catalog product or race plan.
*/

ALTER TABLE nutrition_products
  DROP CONSTRAINT IF EXISTS nutrition_products_category_check;

ALTER TABLE nutrition_products
  ADD CONSTRAINT nutrition_products_category_check
  CHECK (category IN ('drink', 'gel', 'chew', 'bar', 'electrolyte_tablet', 'gummy', 'capsule', 'real_food'));

CREATE TABLE IF NOT EXISTS race_nutrition_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES nutrition_products(id) ON DELETE RESTRICT,
  timing_mode text NOT NULL CHECK (timing_mode IN ('time', 'distance', 'aid_station')),
  timing_minutes integer CHECK (timing_minutes IS NULL OR timing_minutes >= 0),
  distance_marker numeric(8,2) CHECK (distance_marker IS NULL OR distance_marker >= 0),
  aid_station_name text,
  quantity numeric(6,2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT race_nutrition_assignment_timing_check CHECK (
    (timing_mode = 'time' AND timing_minutes IS NOT NULL)
    OR (timing_mode = 'distance' AND distance_marker IS NOT NULL)
    OR (timing_mode = 'aid_station' AND aid_station_name IS NOT NULL AND length(trim(aid_station_name)) > 0)
  )
);

ALTER TABLE race_nutrition_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read race nutrition assignments" ON race_nutrition_assignments;
CREATE POLICY "Anyone can read race nutrition assignments"
  ON race_nutrition_assignments FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can create race nutrition assignments" ON race_nutrition_assignments;
CREATE POLICY "Anyone can create race nutrition assignments"
  ON race_nutrition_assignments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update race nutrition assignments" ON race_nutrition_assignments;
CREATE POLICY "Anyone can update race nutrition assignments"
  ON race_nutrition_assignments FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete race nutrition assignments" ON race_nutrition_assignments;
CREATE POLICY "Anyone can delete race nutrition assignments"
  ON race_nutrition_assignments FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_race_nutrition_assignments_competition
  ON race_nutrition_assignments(competition_id, timing_mode);

CREATE INDEX IF NOT EXISTS idx_race_nutrition_assignments_product
  ON race_nutrition_assignments(product_id);

INSERT INTO nutrition_products (
  brand, product_name, full_name, category, calories_per_serving, carbs_g,
  sugars_g, sodium_mg, potassium_mg, caffeine_mg, serving_size_g,
  price_range, notes, suitable_for
)
SELECT * FROM (VALUES
  ('Clif', 'Bloks Energy Chews', 'Clif Bloks Energy Chews', 'gummy', 200, 48, 24, 70, 20, 0, 48, '$$', 'Chewable carbohydrate cubes for repeated small doses.', '["running", "cycling", "triathlon", "all"]'::jsonb),
  ('Precision Fuel', 'PF 30 Chew', 'Precision Fuel PF 30 Chew', 'chew', 120, 30, 10, 0, 0, 0, 40, '$$', 'Soft chew designed for steady carbohydrate intake.', '["running", "cycling", "triathlon", "all"]'::jsonb),
  ('Precision Fuel', 'PF 30 Caffeine Chew', 'Precision Fuel PF 30 Caffeine Chew', 'chew', 120, 30, 10, 0, 0, 100, 40, '$$', 'Carbohydrate chew with caffeine for later race moments.', '["running", "cycling", "triathlon", "all"]'::jsonb),
  ('SaltStick', 'FastChews', 'SaltStick FastChews Electrolyte Tablets', 'capsule', 10, 0, 0, 100, 0, 0, 4, '$$', 'Electrolyte tablets for use with water.', '["running", "cycling", "triathlon", "all"]'::jsonb),
  ('Maurten', 'Solid 225', 'Maurten Solid 225', 'real_food', 225, 44, 12, 0, 0, 0, 50, '$$$', 'Compact solid carbohydrate option for long events.', '["cycling", "trail_running", "triathlon", "all"]'::jsonb),
  ('Gatorade', 'Endurance Formula', 'Gatorade Endurance Formula', 'drink', 90, 22, 12, 300, 140, 0, NULL, '$', 'Sport drink for aid-station bottles or course cups.', '["running", "cycling", "triathlon", "all"]'::jsonb)
) AS seed(brand, product_name, full_name, category, calories_per_serving, carbs_g, sugars_g, sodium_mg, potassium_mg, caffeine_mg, serving_size_g, price_range, notes, suitable_for)
WHERE NOT EXISTS (
  SELECT 1 FROM nutrition_products p WHERE p.full_name = seed.full_name
);
