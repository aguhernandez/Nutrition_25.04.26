/*
# Add race nutrition recipes

1. Modified Tables
- `race_nutrition_assignments.product_id` is now optional so an assignment can reference a recipe instead.
- `race_nutrition_assignments.recipe_id` references the existing `recipes` catalog.
- A validation rule requires exactly one source: a supplement product or a recipe.

2. Security
- The existing four explicit CRUD policies on race nutrition assignments remain unchanged.
- Recipe visibility continues to follow the existing recipes table policies.

3. Important Notes
- Existing supplement assignments keep their product reference and remain valid.
- Recipes such as rice cakes can now be assigned to time, distance, or aid-station moments with quantity and notes.
*/

ALTER TABLE race_nutrition_assignments
  ALTER COLUMN product_id DROP NOT NULL;

ALTER TABLE race_nutrition_assignments
  ADD COLUMN IF NOT EXISTS recipe_id uuid REFERENCES recipes(id) ON DELETE RESTRICT;

ALTER TABLE race_nutrition_assignments
  DROP CONSTRAINT IF EXISTS race_nutrition_assignment_source_check;

ALTER TABLE race_nutrition_assignments
  ADD CONSTRAINT race_nutrition_assignment_source_check
  CHECK ((product_id IS NOT NULL AND recipe_id IS NULL) OR (product_id IS NULL AND recipe_id IS NOT NULL));

CREATE INDEX IF NOT EXISTS idx_race_nutrition_assignments_recipe
  ON race_nutrition_assignments(recipe_id);
