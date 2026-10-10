-- Allow the race nutrition timeline to reference imported USDA foods.
ALTER TABLE race_nutrition_assignments
  ADD COLUMN IF NOT EXISTS food_id uuid REFERENCES foods_v2(id) ON DELETE RESTRICT;

ALTER TABLE race_nutrition_assignments
  DROP CONSTRAINT IF EXISTS race_nutrition_assignment_source_check;

ALTER TABLE race_nutrition_assignments
  ADD CONSTRAINT race_nutrition_assignment_source_check
  CHECK (
    (product_id IS NOT NULL AND recipe_id IS NULL AND food_id IS NULL)
    OR (product_id IS NULL AND recipe_id IS NOT NULL AND food_id IS NULL)
    OR (product_id IS NULL AND recipe_id IS NULL AND food_id IS NOT NULL)
  );

CREATE INDEX IF NOT EXISTS idx_race_nutrition_assignments_food
  ON race_nutrition_assignments(food_id);
