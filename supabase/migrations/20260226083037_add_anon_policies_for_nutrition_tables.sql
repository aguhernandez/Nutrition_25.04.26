/*
  # Add anon policies for nutrition tables (satellite HUB auth support)

  This satellite uses HUB-based authentication. Users are not in auth.users,
  so auth.uid() is always NULL. We need anon policies that allow access
  when the row's user/athlete id matches a profile that exists in the profiles table.

  The frontend passes the profile id directly in queries. The policy verifies
  it exists in profiles (which is accessible to anon role).

  Tables updated:
  - nutrition_anamnesis (user_id column)
  - nutrition_anamnesis_v2 (athlete_id column)
  - meal_plans (user_id column)
  - meal_plans_v2 (athlete_id column)
  - meal_plan_meals (via plan_id -> meal_plans_v2)
  - meal_plan_items (via meal_id -> meal_plan_meals -> meal_plans_v2)
  - daily_food_diary (user_id column)
  - recipes (user_id column)
  - shopping_list_items (user_id column)
  - nutrition_targets (athlete_id column)
  - nutrition_recipes_v2 (created_by column)
  - foods_v2 (read-only, all anon)
  - foods (read-only, all anon)
*/

-- nutrition_anamnesis
CREATE POLICY "Anon can select own anamnesis"
  ON nutrition_anamnesis FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_anamnesis.user_id));

CREATE POLICY "Anon can insert own anamnesis"
  ON nutrition_anamnesis FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_anamnesis.user_id));

CREATE POLICY "Anon can update own anamnesis"
  ON nutrition_anamnesis FOR UPDATE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_anamnesis.user_id))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_anamnesis.user_id));

CREATE POLICY "Anon can delete own anamnesis"
  ON nutrition_anamnesis FOR DELETE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_anamnesis.user_id));

-- nutrition_anamnesis_v2
CREATE POLICY "Anon can select own anamnesis v2"
  ON nutrition_anamnesis_v2 FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_anamnesis_v2.athlete_id));

CREATE POLICY "Anon can insert own anamnesis v2"
  ON nutrition_anamnesis_v2 FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_anamnesis_v2.athlete_id));

CREATE POLICY "Anon can update own anamnesis v2"
  ON nutrition_anamnesis_v2 FOR UPDATE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_anamnesis_v2.athlete_id))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_anamnesis_v2.athlete_id));

-- meal_plans (v1)
CREATE POLICY "Anon can select own meal plans"
  ON meal_plans FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = meal_plans.user_id));

CREATE POLICY "Anon can insert own meal plans"
  ON meal_plans FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = meal_plans.user_id));

CREATE POLICY "Anon can update own meal plans"
  ON meal_plans FOR UPDATE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = meal_plans.user_id))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = meal_plans.user_id));

CREATE POLICY "Anon can delete own meal plans"
  ON meal_plans FOR DELETE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = meal_plans.user_id));

-- meal_plans_v2
CREATE POLICY "Anon can select own meal plans v2"
  ON meal_plans_v2 FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = meal_plans_v2.athlete_id));

CREATE POLICY "Anon can insert own meal plans v2"
  ON meal_plans_v2 FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = meal_plans_v2.athlete_id));

CREATE POLICY "Anon can update own meal plans v2"
  ON meal_plans_v2 FOR UPDATE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = meal_plans_v2.athlete_id))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = meal_plans_v2.athlete_id));

CREATE POLICY "Anon can delete own meal plans v2"
  ON meal_plans_v2 FOR DELETE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = meal_plans_v2.athlete_id));

-- meal_plan_meals (access via plan ownership)
CREATE POLICY "Anon can select plan meals"
  ON meal_plan_meals FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM meal_plans_v2 mp
    JOIN profiles p ON p.id = mp.athlete_id
    WHERE mp.id = meal_plan_meals.plan_id
  ));

CREATE POLICY "Anon can insert plan meals"
  ON meal_plan_meals FOR INSERT TO anon
  WITH CHECK (EXISTS (
    SELECT 1 FROM meal_plans_v2 mp
    JOIN profiles p ON p.id = mp.athlete_id
    WHERE mp.id = meal_plan_meals.plan_id
  ));

CREATE POLICY "Anon can update plan meals"
  ON meal_plan_meals FOR UPDATE TO anon
  USING (EXISTS (
    SELECT 1 FROM meal_plans_v2 mp
    JOIN profiles p ON p.id = mp.athlete_id
    WHERE mp.id = meal_plan_meals.plan_id
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM meal_plans_v2 mp
    JOIN profiles p ON p.id = mp.athlete_id
    WHERE mp.id = meal_plan_meals.plan_id
  ));

CREATE POLICY "Anon can delete plan meals"
  ON meal_plan_meals FOR DELETE TO anon
  USING (EXISTS (
    SELECT 1 FROM meal_plans_v2 mp
    JOIN profiles p ON p.id = mp.athlete_id
    WHERE mp.id = meal_plan_meals.plan_id
  ));

-- meal_plan_items (access via meal -> plan ownership)
CREATE POLICY "Anon can select plan items"
  ON meal_plan_items FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM meal_plan_meals mpm
    JOIN meal_plans_v2 mp ON mp.id = mpm.plan_id
    JOIN profiles p ON p.id = mp.athlete_id
    WHERE mpm.id = meal_plan_items.meal_id
  ));

CREATE POLICY "Anon can insert plan items"
  ON meal_plan_items FOR INSERT TO anon
  WITH CHECK (EXISTS (
    SELECT 1 FROM meal_plan_meals mpm
    JOIN meal_plans_v2 mp ON mp.id = mpm.plan_id
    JOIN profiles p ON p.id = mp.athlete_id
    WHERE mpm.id = meal_plan_items.meal_id
  ));

CREATE POLICY "Anon can update plan items"
  ON meal_plan_items FOR UPDATE TO anon
  USING (EXISTS (
    SELECT 1 FROM meal_plan_meals mpm
    JOIN meal_plans_v2 mp ON mp.id = mpm.plan_id
    JOIN profiles p ON p.id = mp.athlete_id
    WHERE mpm.id = meal_plan_items.meal_id
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM meal_plan_meals mpm
    JOIN meal_plans_v2 mp ON mp.id = mpm.plan_id
    JOIN profiles p ON p.id = mp.athlete_id
    WHERE mpm.id = meal_plan_items.meal_id
  ));

CREATE POLICY "Anon can delete plan items"
  ON meal_plan_items FOR DELETE TO anon
  USING (EXISTS (
    SELECT 1 FROM meal_plan_meals mpm
    JOIN meal_plans_v2 mp ON mp.id = mpm.plan_id
    JOIN profiles p ON p.id = mp.athlete_id
    WHERE mpm.id = meal_plan_items.meal_id
  ));

-- daily_food_diary
CREATE POLICY "Anon can select own diary"
  ON daily_food_diary FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = daily_food_diary.user_id));

CREATE POLICY "Anon can insert own diary"
  ON daily_food_diary FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = daily_food_diary.user_id));

CREATE POLICY "Anon can update own diary"
  ON daily_food_diary FOR UPDATE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = daily_food_diary.user_id))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = daily_food_diary.user_id));

CREATE POLICY "Anon can delete own diary"
  ON daily_food_diary FOR DELETE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = daily_food_diary.user_id));

-- recipes
CREATE POLICY "Anon can select own or public recipes"
  ON recipes FOR SELECT TO anon
  USING (is_public = true OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = recipes.user_id));

CREATE POLICY "Anon can insert own recipes"
  ON recipes FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = recipes.user_id));

CREATE POLICY "Anon can update own recipes"
  ON recipes FOR UPDATE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = recipes.user_id))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = recipes.user_id));

CREATE POLICY "Anon can delete own recipes"
  ON recipes FOR DELETE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = recipes.user_id));

-- shopping_list_items
CREATE POLICY "Anon can select own shopping list"
  ON shopping_list_items FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = shopping_list_items.user_id));

CREATE POLICY "Anon can insert own shopping list"
  ON shopping_list_items FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = shopping_list_items.user_id));

CREATE POLICY "Anon can update own shopping list"
  ON shopping_list_items FOR UPDATE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = shopping_list_items.user_id))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = shopping_list_items.user_id));

CREATE POLICY "Anon can delete own shopping list"
  ON shopping_list_items FOR DELETE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = shopping_list_items.user_id));

-- nutrition_targets
CREATE POLICY "Anon can select own nutrition targets"
  ON nutrition_targets FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_targets.athlete_id));

CREATE POLICY "Anon can insert own nutrition targets"
  ON nutrition_targets FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_targets.athlete_id));

CREATE POLICY "Anon can update own nutrition targets"
  ON nutrition_targets FOR UPDATE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_targets.athlete_id))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_targets.athlete_id));

-- nutrition_recipes_v2
CREATE POLICY "Anon can select own or public recipes v2"
  ON nutrition_recipes_v2 FOR SELECT TO anon
  USING (is_public = true OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_recipes_v2.created_by));

CREATE POLICY "Anon can insert own recipes v2"
  ON nutrition_recipes_v2 FOR INSERT TO anon
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_recipes_v2.created_by));

CREATE POLICY "Anon can update own recipes v2"
  ON nutrition_recipes_v2 FOR UPDATE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_recipes_v2.created_by))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_recipes_v2.created_by));

CREATE POLICY "Anon can delete own recipes v2"
  ON nutrition_recipes_v2 FOR DELETE TO anon
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = nutrition_recipes_v2.created_by));

-- foods and foods_v2 (read-only for anon)
CREATE POLICY "Anon can read foods"
  ON foods FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "Anon can read foods v2"
  ON foods_v2 FOR SELECT TO anon
  USING (true);
