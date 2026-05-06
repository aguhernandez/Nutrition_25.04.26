/*
  # Drop auth.users foreign keys from nutrition and race tables

  ## Problem
  All user-related tables reference auth.users(id) via foreign keys.
  In dev mode (and hub-auth mode), user IDs come from the profiles table,
  not auth.users. This causes FK violations (409 Conflict) when inserting
  records because the profile.id UUID doesn't exist in auth.users.

  ## Solution
  Drop the FK constraints that reference auth.users on all actively used tables.
  Data integrity is maintained through RLS policies instead of FK constraints.

  ## Tables modified
  - meal_plans_v2 (athlete_id, coach_id)
  - nutrition_anamnesis (user_id)
  - daily_food_diary (user_id)
  - recipes (user_id)
  - shopping_list_items (user_id)
  - meal_plans (user_id)
  - competitions (user_id)
  - race_events (athlete_id)
  - race_activity (athlete_id)
  - race_course_profiles (user_id)
  - training_sessions (athlete_id)
  - training_weeks (athlete_id)
  - nutrition_anamnesis_v2 (athlete_id, trainer_id)
  - nutrition_targets (athlete_id)
  - athlete_nutrition_plans (athlete_id, coach_id)
  - food_diary_sessions (athlete_id)
*/

ALTER TABLE meal_plans_v2 DROP CONSTRAINT IF EXISTS meal_plans_v2_athlete_id_fkey;
ALTER TABLE meal_plans_v2 DROP CONSTRAINT IF EXISTS meal_plans_v2_coach_id_fkey;

ALTER TABLE nutrition_anamnesis DROP CONSTRAINT IF EXISTS nutrition_anamnesis_user_id_fkey;

ALTER TABLE daily_food_diary DROP CONSTRAINT IF EXISTS daily_food_diary_user_id_fkey;

ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipes_user_id_fkey;

ALTER TABLE shopping_list_items DROP CONSTRAINT IF EXISTS shopping_list_items_user_id_fkey;

ALTER TABLE meal_plans DROP CONSTRAINT IF EXISTS meal_plans_user_id_fkey;

ALTER TABLE competitions DROP CONSTRAINT IF EXISTS competitions_user_id_fkey;

ALTER TABLE race_events DROP CONSTRAINT IF EXISTS race_events_athlete_id_fkey;

ALTER TABLE race_activity DROP CONSTRAINT IF EXISTS race_activity_athlete_id_fkey;

ALTER TABLE race_course_profiles DROP CONSTRAINT IF EXISTS race_course_profiles_user_id_fkey;

ALTER TABLE training_sessions DROP CONSTRAINT IF EXISTS training_sessions_athlete_id_fkey;

ALTER TABLE training_weeks DROP CONSTRAINT IF EXISTS training_weeks_athlete_id_fkey;

ALTER TABLE nutrition_anamnesis_v2 DROP CONSTRAINT IF EXISTS nutrition_anamnesis_v2_athlete_id_fkey;
ALTER TABLE nutrition_anamnesis_v2 DROP CONSTRAINT IF EXISTS nutrition_anamnesis_v2_trainer_id_fkey;

ALTER TABLE nutrition_targets DROP CONSTRAINT IF EXISTS nutrition_targets_athlete_id_fkey;

ALTER TABLE athlete_nutrition_plans DROP CONSTRAINT IF EXISTS athlete_nutrition_plans_athlete_id_fkey;
ALTER TABLE athlete_nutrition_plans DROP CONSTRAINT IF EXISTS athlete_nutrition_plans_coach_id_fkey;

ALTER TABLE food_diary_sessions DROP CONSTRAINT IF EXISTS food_diary_sessions_athlete_id_fkey;
