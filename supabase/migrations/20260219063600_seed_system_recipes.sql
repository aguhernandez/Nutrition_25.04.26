/*
  # Seed System Recipes

  ## Summary
  Makes user_id nullable in recipes table to allow system/public recipes
  that are not owned by any specific user, then seeds 10 example recipes
  covering common athlete nutrition scenarios: pre-race, post-race,
  breakfast, snacks, and recovery meals.

  ## Changes
  - Alters `recipes.user_id` to be nullable (system recipes have NULL user_id)
  - Adds policy: any authenticated user can read recipes where user_id IS NULL (system)
  - Inserts 10 curated athlete-focused recipes as public system recipes

  ## New Recipes
  1. Race Day Oatmeal - pre-race breakfast
  2. Post-Race Recovery Smoothie - recovery
  3. Athlete's Chicken & Rice Bowl - lunch/dinner
  4. Pre-Training Banana Toast - snack
  5. Salmon Power Bowl - dinner
  6. Energy Dates Balls - during_race snack
  7. Greek Yogurt Parfait - breakfast
  8. Pasta Bolognese Athlete Edition - pre-race dinner
  9. Tuna Avocado Wrap - lunch
  10. Egg White Omelet with Veggies - breakfast
*/

ALTER TABLE recipes ALTER COLUMN user_id DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'recipes' AND policyname = 'Authenticated users can read system recipes'
  ) THEN
    CREATE POLICY "Authenticated users can read system recipes"
      ON recipes FOR SELECT
      TO authenticated
      USING (user_id IS NULL AND is_public = true);
  END IF;
END $$;

INSERT INTO recipes (user_id, name, description, category, prep_time_min, cook_time_min, servings, ingredients, instructions, calories_kcal, carbs_g, protein_g, fat_g, fiber_g, sodium_mg, tags, suitable_for, is_public)
VALUES
(
  NULL,
  'Race Day Oatmeal',
  'High-carb, easily digestible oatmeal perfect for the morning before a race. Low fiber to minimize GI distress.',
  'pre_race',
  5, 10, 1,
  '[{"name":"Rolled oats","quantity":80,"unit":"g","calories":296,"carbs":53,"protein":10,"fat":5},{"name":"Banana","quantity":1,"unit":"medium","calories":89,"carbs":23,"protein":1,"fat":0},{"name":"Honey","quantity":15,"unit":"g","calories":46,"carbs":12,"protein":0,"fat":0},{"name":"Almond milk","quantity":200,"unit":"ml","calories":30,"carbs":1,"protein":1,"fat":3}]',
  '1. Cook oats in almond milk for 5-7 minutes over medium heat.\n2. Slice banana and arrange on top.\n3. Drizzle honey over oatmeal.\n4. Eat 2-3 hours before race start.',
  461, 89, 12, 8, 6, 180,
  '["high-carb","easy-digest","pre-race","breakfast"]',
  '["all"]', true
),
(
  NULL,
  'Post-Race Recovery Smoothie',
  'Fast-absorbing protein and carb blend to kickstart muscle recovery within 30 minutes of finishing.',
  'post_race',
  5, 0, 1,
  '[{"name":"Whey protein","quantity":30,"unit":"g","calories":120,"carbs":3,"protein":25,"fat":1},{"name":"Banana","quantity":1,"unit":"medium","calories":89,"carbs":23,"protein":1,"fat":0},{"name":"Greek yogurt","quantity":150,"unit":"g","calories":100,"carbs":6,"protein":17,"fat":0},{"name":"Oats","quantity":30,"unit":"g","calories":111,"carbs":20,"protein":4,"fat":2},{"name":"Frozen berries","quantity":80,"unit":"g","calories":32,"carbs":8,"protein":0,"fat":0},{"name":"Milk","quantity":200,"unit":"ml","calories":68,"carbs":5,"protein":3,"fat":4}]',
  '1. Add all ingredients to blender.\n2. Blend on high for 60 seconds.\n3. Consume within 30 minutes post-race or training.\n4. Add ice for a thicker consistency.',
  520, 65, 50, 7, 4, 220,
  '["recovery","protein","smoothie","post-race"]',
  '["all"]', true
),
(
  NULL,
  'Athlete Chicken & Rice Bowl',
  'Balanced macro bowl for training day lunch. Lean protein, complex carbs, and healthy fats from avocado.',
  'lunch',
  10, 20, 1,
  '[{"name":"Chicken breast","quantity":150,"unit":"g","calories":165,"carbs":0,"protein":31,"fat":4},{"name":"Brown rice","quantity":180,"unit":"g cooked","calories":218,"carbs":46,"protein":5,"fat":2},{"name":"Avocado","quantity":50,"unit":"g","calories":80,"carbs":4,"protein":1,"fat":7},{"name":"Cherry tomatoes","quantity":80,"unit":"g","calories":14,"carbs":3,"protein":1,"fat":0},{"name":"Spinach","quantity":40,"unit":"g","calories":9,"carbs":1,"protein":1,"fat":0},{"name":"Olive oil","quantity":10,"unit":"ml","calories":88,"carbs":0,"protein":0,"fat":10},{"name":"Lemon juice","quantity":15,"unit":"ml","calories":4,"carbs":1,"protein":0,"fat":0}]',
  '1. Season and grill chicken breast until cooked through (165°F internal).\n2. Let rest 5 min then slice.\n3. Layer brown rice in bowl, top with spinach.\n4. Add sliced chicken, tomatoes, and avocado.\n5. Drizzle olive oil and lemon juice. Season with salt and pepper.',
  578, 55, 39, 23, 7, 320,
  '["balanced","high-protein","training-day"]',
  '["omnivore"]', true
),
(
  NULL,
  'Pre-Training Energy Toast',
  'Quick and effective pre-training fuel. Simple carbs with a touch of protein and potassium from banana.',
  'snack',
  3, 2, 1,
  '[{"name":"Whole grain bread","quantity":60,"unit":"g (2 slices)","calories":160,"carbs":30,"protein":6,"fat":2},{"name":"Banana","quantity":1,"unit":"medium","calories":89,"carbs":23,"protein":1,"fat":0},{"name":"Almond butter","quantity":15,"unit":"g","calories":90,"carbs":3,"protein":3,"fat":8},{"name":"Honey","quantity":10,"unit":"g","calories":30,"carbs":8,"protein":0,"fat":0}]',
  '1. Toast bread slices.\n2. Spread almond butter on each slice.\n3. Slice banana and layer on top.\n4. Drizzle honey.\n5. Eat 45-60 minutes before training.',
  369, 64, 10, 10, 4, 240,
  '["pre-training","quick","carbs"]',
  '["vegetarian","vegan"]', true
),
(
  NULL,
  'Salmon Power Bowl',
  'Omega-3 rich dinner for recovery days. Anti-inflammatory salmon with quinoa and roasted vegetables.',
  'dinner',
  10, 20, 1,
  '[{"name":"Salmon fillet","quantity":180,"unit":"g","calories":367,"carbs":0,"protein":36,"fat":24},{"name":"Quinoa","quantity":80,"unit":"g dry","calories":296,"carbs":55,"protein":11,"fat":5},{"name":"Sweet potato","quantity":150,"unit":"g","calories":129,"carbs":30,"protein":2,"fat":0},{"name":"Broccoli","quantity":100,"unit":"g","calories":34,"carbs":7,"protein":3,"fat":0},{"name":"Olive oil","quantity":15,"unit":"ml","calories":132,"carbs":0,"protein":0,"fat":15}]',
  '1. Cook quinoa per package directions.\n2. Cube sweet potato and roast at 400°F for 20 min with olive oil.\n3. Season salmon with salt, pepper, lemon.\n4. Pan-sear salmon skin-side down 4 min, flip 3 min.\n5. Steam broccoli until tender.\n6. Assemble bowl with quinoa base, add salmon, sweet potato, and broccoli.',
  958, 92, 52, 44, 9, 380,
  '["omega-3","recovery","anti-inflammatory","dinner"]',
  '["omnivore","pescatarian"]', true
),
(
  NULL,
  'Race Day Energy Bites',
  'No-bake energy balls perfect for carrying during long events. Easily digestible with fast-acting carbs.',
  'during_race',
  15, 0, 12,
  '[{"name":"Medjool dates","quantity":200,"unit":"g (pitted)","calories":560,"carbs":150,"protein":4,"fat":0},{"name":"Rolled oats","quantity":80,"unit":"g","calories":296,"carbs":53,"protein":10,"fat":5},{"name":"Almond butter","quantity":60,"unit":"g","calories":360,"carbs":12,"protein":12,"fat":32},{"name":"Dark chocolate chips","quantity":40,"unit":"g","calories":200,"carbs":22,"protein":2,"fat":12},{"name":"Sea salt","quantity":1,"unit":"pinch","calories":0,"carbs":0,"protein":0,"fat":0}]',
  '1. Process dates in food processor until paste forms.\n2. Add oats, almond butter, and salt. Pulse to combine.\n3. Fold in chocolate chips.\n4. Roll into 12 balls (about 2 tbsp each).\n5. Refrigerate 30 min to firm up.\n6. Wrap individually for races. Consume 1-2 per hour.',
  143, 20, 2, 4, 2, 30,
  '["during-race","portable","energy","no-bake"]',
  '["vegetarian","vegan","gluten-free"]', true
),
(
  NULL,
  'Greek Yogurt Berry Parfait',
  'High-protein breakfast or snack layered with antioxidant-rich berries and granola for crunch.',
  'breakfast',
  5, 0, 1,
  '[{"name":"Greek yogurt (0%)","quantity":200,"unit":"g","calories":110,"carbs":6,"protein":20,"fat":0},{"name":"Mixed berries","quantity":100,"unit":"g","calories":40,"carbs":10,"protein":1,"fat":0},{"name":"Granola","quantity":30,"unit":"g","calories":130,"carbs":20,"protein":3,"fat":5},{"name":"Honey","quantity":10,"unit":"g","calories":30,"carbs":8,"protein":0,"fat":0},{"name":"Chia seeds","quantity":5,"unit":"g","calories":24,"carbs":2,"protein":1,"fat":2}]',
  '1. Spoon half the yogurt into a glass or bowl.\n2. Add half the berries.\n3. Repeat layer with remaining yogurt and berries.\n4. Top with granola, honey, and chia seeds.\n5. Consume immediately to keep granola crunchy.',
  334, 46, 25, 7, 5, 65,
  '["breakfast","high-protein","antioxidants","quick"]',
  '["vegetarian"]', true
),
(
  NULL,
  'Pre-Race Pasta Bolognese',
  'Classic carb-loading dinner the night before race day. Rich in complex carbs with a moderate protein hit.',
  'pre_race',
  10, 25, 2,
  '[{"name":"Spaghetti","quantity":200,"unit":"g dry","calories":700,"carbs":140,"protein":25,"fat":4},{"name":"Ground beef (lean)","quantity":150,"unit":"g","calories":255,"carbs":0,"protein":26,"fat":16},{"name":"Tomato sauce","quantity":200,"unit":"g","calories":70,"carbs":14,"protein":3,"fat":1},{"name":"Onion","quantity":80,"unit":"g","calories":32,"carbs":7,"protein":1,"fat":0},{"name":"Garlic","quantity":2,"unit":"cloves","calories":10,"carbs":2,"protein":0,"fat":0},{"name":"Olive oil","quantity":10,"unit":"ml","calories":88,"carbs":0,"protein":0,"fat":10}]',
  '1. Cook pasta al dente per package directions.\n2. Sauté onion and garlic in olive oil until soft.\n3. Add ground beef and brown completely.\n4. Pour in tomato sauce, simmer 15 min.\n5. Season with salt, pepper, Italian herbs.\n6. Serve sauce over pasta. Makes 2 portions.',
  578, 82, 28, 16, 5, 480,
  '["carb-loading","pre-race","pasta","dinner"]',
  '["omnivore"]', true
),
(
  NULL,
  'Tuna Avocado Wrap',
  'Quick high-protein lunch wrap with healthy fats from avocado. Ideal for training day midday meal.',
  'lunch',
  8, 0, 1,
  '[{"name":"Tuna in water","quantity":140,"unit":"g (1 can)","calories":140,"carbs":0,"protein":30,"fat":1},{"name":"Avocado","quantity":80,"unit":"g","calories":128,"carbs":7,"protein":2,"fat":12},{"name":"Whole wheat tortilla","quantity":60,"unit":"g","calories":180,"carbs":30,"protein":6,"fat":4},{"name":"Spinach","quantity":30,"unit":"g","calories":7,"carbs":1,"protein":1,"fat":0},{"name":"Lemon juice","quantity":10,"unit":"ml","calories":2,"carbs":1,"protein":0,"fat":0},{"name":"Greek yogurt","quantity":30,"unit":"g","calories":18,"carbs":1,"protein":3,"fat":0}]',
  '1. Drain tuna and mix with Greek yogurt, lemon juice, salt and pepper.\n2. Mash avocado with a fork, season with salt.\n3. Warm tortilla 30 sec in microwave.\n4. Spread avocado on tortilla.\n5. Add spinach leaves.\n6. Spoon tuna mixture in center.\n7. Roll tightly, cut diagonally.',
  475, 40, 42, 17, 6, 540,
  '["high-protein","quick","lunch","omega-3"]',
  '["omnivore","pescatarian"]', true
),
(
  NULL,
  'Egg White Veggie Omelet',
  'Light, high-protein breakfast that keeps calories low while maximizing protein for muscle maintenance.',
  'breakfast',
  5, 8, 1,
  '[{"name":"Egg whites","quantity":200,"unit":"g (6 whites)","calories":104,"carbs":1,"protein":22,"fat":0},{"name":"Spinach","quantity":40,"unit":"g","calories":9,"carbs":1,"protein":1,"fat":0},{"name":"Cherry tomatoes","quantity":60,"unit":"g","calories":11,"carbs":2,"protein":1,"fat":0},{"name":"Bell pepper","quantity":60,"unit":"g","calories":18,"carbs":4,"protein":1,"fat":0},{"name":"Mushrooms","quantity":50,"unit":"g","calories":11,"carbs":2,"protein":2,"fat":0},{"name":"Olive oil spray","quantity":2,"unit":"g","calories":18,"carbs":0,"protein":0,"fat":2}]',
  '1. Whisk egg whites with salt and pepper.\n2. Dice vegetables into small pieces.\n3. Heat non-stick pan, spray with oil.\n4. Sauté vegetables 3 min until soft.\n5. Pour egg whites over vegetables.\n6. Cook on medium-low 4 min.\n7. Fold omelet in half. Serve immediately.',
  171, 10, 27, 2, 3, 380,
  '["low-calorie","high-protein","breakfast","weight-loss"]',
  '["vegetarian"]', true
);
