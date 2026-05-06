/*
  # Add plan_mode to meal_plans_v2

  ## Summary
  Adds a `plan_mode` column to distinguish between two types of meal plans:

  1. **template** (default): Generic example plan with Day 1, Day 2, Day 3...
     No calendar anchoring. Can be reused across different periods.

  2. **calendar**: Anchored to a real start date. Each day maps to a specific
     calendar date. The athlete sees "today's" plan highlighted automatically.

  ## Changes
  - `meal_plans_v2`: Adds `plan_mode` column (text, default 'template')

  ## Notes
  - Existing plans default to 'template' mode (no breaking change)
  - start_date is only meaningful when plan_mode = 'calendar'
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meal_plans_v2' AND column_name = 'plan_mode'
  ) THEN
    ALTER TABLE meal_plans_v2 ADD COLUMN plan_mode text NOT NULL DEFAULT 'template';
  END IF;
END $$;
