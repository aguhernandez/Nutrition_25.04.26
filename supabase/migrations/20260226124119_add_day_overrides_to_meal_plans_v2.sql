/*
  # Add day_overrides column to meal_plans_v2

  ## Summary
  Adds a JSONB column to store per-day macro target overrides.
  This allows coaches/athletes to customize calorie and macronutrient
  targets for each individual day, overriding the plan-level defaults.

  ## Changes
  - `meal_plans_v2`: New column `day_overrides` (jsonb, default '{}')
    - Keys: "day_1", "day_2", etc.
    - Values: { calories, protein, carbs, fat } (all numbers in g or kcal)

  ## Notes
  - Existing rows default to empty object, preserving backward compatibility
  - No RLS changes needed (inherits existing policies)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meal_plans_v2' AND column_name = 'day_overrides'
  ) THEN
    ALTER TABLE meal_plans_v2 ADD COLUMN day_overrides jsonb DEFAULT '{}';
  END IF;
END $$;
