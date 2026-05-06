/*
  # Migrate existing foods to foods_v2

  The foods_v2 table is empty but foods has 20 active records.
  Maps 'manual' source -> 'internal' to satisfy the check constraint.
  Also normalizes category names to match foods_v2 expected values.
*/

INSERT INTO foods_v2 (
  id,
  name_es,
  name_en,
  category,
  calories_per_100g,
  protein_per_100g,
  carbs_per_100g,
  fat_per_100g,
  fiber_per_100g,
  sugar_per_100g,
  source,
  is_verified,
  created_at
)
SELECT
  id,
  COALESCE(name_es, name_en, name) AS name_es,
  COALESCE(name_en, name_es, name) AS name_en,
  CASE category
    WHEN 'protein' THEN 'meat_fish'
    WHEN 'fruit' THEN 'fruits_veg'
    WHEN 'vegetable' THEN 'fruits_veg'
    WHEN 'vegetables' THEN 'fruits_veg'
    ELSE category
  END AS category,
  calories_kcal::numeric AS calories_per_100g,
  protein_g AS protein_per_100g,
  carbs_g AS carbs_per_100g,
  fat_g AS fat_per_100g,
  fiber_g AS fiber_per_100g,
  sugar_g AS sugar_per_100g,
  CASE source
    WHEN 'manual' THEN 'internal'
    WHEN 'usda' THEN 'usda'
    WHEN 'open_food_facts' THEN 'open_food_facts'
    ELSE 'internal'
  END AS source,
  is_verified,
  COALESCE(created_at, now())
FROM foods
WHERE is_active = true
ON CONFLICT (id) DO NOTHING;
