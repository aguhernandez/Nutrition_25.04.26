/*
  # Seed Supplements Batch 3: Sports Drinks, Drink Mixes, Creatine
*/

INSERT INTO foods_v2 (
  name_es, name_en, category, brand, product_form, serving_unit, serving_size_g,
  serving_description, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
  fiber_per_100g, sugar_per_100g, sodium_mg, potassium_mg, magnesium_mg, caffeine_mg,
  creatine_mg, is_supplement, is_verified, region, antidoping_note, source, flavors,
  electrolytes_note
) VALUES

-- ========== BEBIDAS DEPORTIVAS (LISTAS) ==========
('Gatorade Thirst Quencher', 'Gatorade Thirst Quencher', 'supplements',
 'Gatorade (PepsiCo)', 'liquid', 'ml', 591,
 '1 botella (591ml)', 26, 0, 6, 0, 0, 6, 110, 30, 0, 0, 0,
 true, true, 'north_america', '',
 'internal', '["Lemon-Lime","Orange","Fruit Punch","Cool Blue","Fierce Grape"]'::jsonb,
 'Na 110mg, K 30mg per serving'),

('Powerade ION4', 'Powerade ION4', 'supplements',
 'Powerade (Coca-Cola)', 'liquid', 'ml', 600,
 '1 botella (600ml)', 27, 0, 7, 0, 0, 7, 100, 35, 2, 0, 0,
 true, true, 'north_america', '',
 'internal', '["Mountain Berry Blast","Fruit Punch","Cherry Limeade","Orange"]'::jsonb,
 'Na 100mg, K 35mg, Ca 2mg, Mg 2mg per 600ml'),

('Lucozade Sport', 'Lucozade Sport', 'supplements',
 'Lucozade', 'liquid', 'ml', 500,
 '1 bottle (500ml)', 40, 0, 10, 0, 0, 7, 46, 72, 0, 0, 0,
 true, true, 'europe', '',
 'internal', '["Orange","Lemon Lime","Berry Burst","Watermelon & Strawberry"]'::jsonb,
 'Na 46mg, K 72mg per 500ml'),

-- ========== POLVOS PARA BEBIDAS DEPORTIVAS ==========
('Maurten Drink Mix 160', 'Maurten Drink Mix 160', 'supplements',
 'Maurten', 'powder', 'sachet', 40,
 '1 sachet (40g) + 500ml water', 375, 0, 94, 0, 0, 62, 450, 0, 0, 0, 0,
 true, true, 'global', 'Used by pro road cyclists',
 'internal', '["Unflavoured"]'::jsonb,
 'Na 450mg per serving — high carbohydrate hydrogel'),

('Maurten Drink Mix 320', 'Maurten Drink Mix 320', 'supplements',
 'Maurten', 'powder', 'sachet', 80,
 '1 sachet (80g) + 500ml water', 375, 0, 94, 0, 0, 62, 960, 0, 0, 0, 0,
 true, true, 'global', '',
 'internal', '["Unflavoured"]'::jsonb,
 'Na 960mg per serving — race intensity formula'),

('SiS GO Electrolyte Powder', 'SiS GO Electrolyte Powder', 'supplements',
 'Science in Sport', 'powder', 'scoop', 40,
 '1 scoop (40g) + 500ml water', 375, 0, 92, 0, 0, 36, 345, 163, 18, 0, 0,
 true, true, 'europe', 'Informed Sport certified',
 'internal', '["Orange","Lemon","Berry","Tropical"]'::jsonb,
 'Na 345mg, K 163mg, Mg 18mg per 500ml'),

('Gatorade Endurance Formula', 'Gatorade Endurance Formula', 'supplements',
 'Gatorade', 'powder', 'scoop', 24,
 '1 scoop (24g) + 500ml water', 375, 0, 92, 0, 0, 18, 625, 110, 0, 0, 0,
 true, true, 'north_america', '',
 'internal', '["Lemon-Lime","Orange","Fruit Punch","Grape"]'::jsonb,
 'Na 625mg — enhanced sodium for heat and ultra endurance'),

('Precision Hydration PH 1000', 'Precision Hydration PH 1000', 'supplements',
 'Precision Hydration', 'tablet', 'tablet', 4,
 '1 tablet in 500ml water', 0, 0, 0, 0, 0, 0, 500, 150, 30, 0, 0,
 true, true, 'global', 'Informed Sport certified',
 'internal', '["Orange","Lemon","Watermelon","Mango"]'::jsonb,
 'Na 500mg, K 150mg, Mg 30mg per tablet'),

('Nuun Sport Electrolyte Tablets', 'Nuun Sport Electrolyte Tablets', 'supplements',
 'Nuun', 'tablet', 'tablet', 5,
 '1 tablet in 480ml water', 0, 0, 2, 0, 0, 1, 300, 150, 25, 0, 0,
 true, true, 'north_america', 'NSF Certified',
 'internal', '["Lemon Lime","Tri-Berry","Watermelon","Orange","Cherry Lemonade"]'::jsonb,
 'Na 300mg, K 150mg, Mg 25mg, Ca 13mg per tablet'),

('USN Hyperdrive Endurance', 'USN Hyperdrive Endurance', 'supplements',
 'USN', 'powder', 'scoop', 55,
 '1 scoop (55g) in water', 382, 0, 94, 0, 0, 42, 380, 120, 15, 0, 0,
 true, true, 'east_africa', '',
 'internal', '["Orange","Lemon","Berry","Watermelon"]'::jsonb,
 'Na 380mg, K 120mg, Mg 15mg per serving'),

-- ========== CREATINA ==========
('Creatine Monohydrate Powder', 'Creatine Monohydrate Powder', 'supplements',
 'Optimum Nutrition', 'powder', 'scoop', 5,
 '1 scoop (5g) — 5g creatine monohydrate', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000,
 true, true, 'north_america', 'Informed Sport certified',
 'internal', '["Unflavoured"]'::jsonb, ''),

('Creapure Creatine Monohydrate', 'Creapure Creatine Monohydrate', 'supplements',
 'Myprotein', 'powder', 'scoop', 5,
 '1 scoop (5g) — Creapure® grade', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000,
 true, true, 'europe', 'Informed Sport certified — Creapure® purity',
 'internal', '["Unflavoured"]'::jsonb, ''),

('USN Creatine Monohydrate', 'USN Creatine Monohydrate', 'supplements',
 'USN', 'powder', 'scoop', 5,
 '1 scoop (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000,
 true, true, 'east_africa', 'Informed Sport certified',
 'internal', '["Unflavoured"]'::jsonb, ''),

('Micronized Creatine Powder', 'Micronized Creatine Powder', 'supplements',
 'BulkSupplements', 'powder', 'scoop', 5,
 '1 scoop (5g) — micronized for fast dissolution', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000,
 true, true, 'north_america', '',
 'internal', '["Unflavoured"]'::jsonb, ''),

('Con-Cret Creatine HCl', 'Con-Cret Creatine HCl', 'supplements',
 'ProLab', 'powder', 'scoop', 2,
 '1 micro-scoop (750mg) — HCl form, higher bioavailability', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 750,
 true, true, 'north_america', '',
 'internal', '["Unflavoured","Pineapple","Watermelon"]'::jsonb, ''),

('Creatina Monohidratada', 'Creatine Monohydrate', 'supplements',
 'Probiótica', 'powder', 'scoop', 5,
 '1 scoop (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000,
 true, true, 'south_america', '',
 'internal', '["Sem Sabor"]'::jsonb, '')

ON CONFLICT DO NOTHING;
