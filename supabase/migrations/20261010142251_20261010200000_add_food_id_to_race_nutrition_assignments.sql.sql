/*
# Add food_id to race_nutrition_assignments

## Purpose
The app now queries and saves race nutrition assignments that can reference foods from
the `foods_v2` table (USDA / Open Food Facts imports), not just products or recipes.
The 400 errors occur because the schema lacks the `food_id` column.

## Changes
1. New column: `race_nutrition_assignments.food_id` (uuid, nullable) — foreign key to
   `foods_v2(id)` with `ON DELETE RESTRICT` so foods in use cannot be accidentally removed.
2. Updated constraint: `race_nutrition_assignment_source_check` — replaced to enforce
   that exactly one of `product_id`, `recipe_id`, or `food_id` is set (XOR).
3. New index: `idx_race_nutrition_assignments_food` on `food_id` for fast lookups.
4. `NOTIFY pgrst, 'reload schema'` so PostgREST picks up the new column immediately.

## Security
- No RLS or policy changes. Existing policies on race_nutrition_assignments remain unchanged.

## Important notes
1. The DROP CONSTRAINT IF EXISTS + ADD CONSTRAINT pattern makes this safe to re-run.
2. No existing data is modified — the constraint allows the same product/recipe assignments
   that were valid before, plus the new food_id option.
3. Existing rows with product_id or recipe_id set (and food_id NULL) still satisfy the
   new constraint.
*/

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

NOTIFY pgrst, 'reload schema';
