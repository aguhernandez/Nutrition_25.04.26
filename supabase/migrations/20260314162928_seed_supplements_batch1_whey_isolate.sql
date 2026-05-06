/*
  # Seed Supplements Batch 1: Whey Protein & Isolate
  North America, Europe, South America, East Africa brands.
  All values per 100g unless noted. serving_size_g = label serving.
*/

INSERT INTO foods_v2 (
  name_es, name_en, category, brand, product_form, serving_unit, serving_size_g,
  serving_description, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
  fiber_per_100g, sugar_per_100g, sodium_mg, calcium_mg, iron_mg,
  is_supplement, is_verified, region, antidoping_note, source, flavors
) VALUES

-- ========== WHEY PROTEIN — NORTH AMERICA ==========
('Whey Protein Gold Standard', 'Whey Protein Gold Standard', 'supplements',
 'Optimum Nutrition', 'powder', 'scoop', 31,
 '1 scoop (31g)', 390, 74, 10, 5, 0, 4, 580, 161, 0,
 true, true, 'north_america', 'Informed Choice certified',
 'internal', '["Double Rich Chocolate","Vanilla Ice Cream","Strawberry","Cookies & Cream","Banana Cream"]'::jsonb),

('100% Whey Protein', '100% Whey Protein', 'supplements',
 'MuscleTech', 'powder', 'scoop', 35,
 '1 scoop (35g)', 371, 68, 7, 6, 0, 3, 400, 140, 0,
 true, true, 'north_america', 'Informed Choice certified',
 'internal', '["Chocolate Brownie","Vanilla Milkshake","Rocky Road","Birthday Cake"]'::jsonb),

('Combat 100% Whey', 'Combat 100% Whey', 'supplements',
 'MusclePharm', 'powder', 'scoop', 35,
 '1 scoop (35g)', 371, 71, 7, 5, 0, 2, 350, 130, 0,
 true, true, 'north_america', 'Informed Sport certified',
 'internal', '["Chocolate Milk","Vanilla","Strawberry","Banana Cream"]'::jsonb),

('Whey Sport', 'Whey Sport', 'supplements',
 'Garden of Life', 'powder', 'scoop', 36,
 '1 scoop (36g)', 361, 67, 10, 5, 2, 3, 280, 150, 0,
 true, true, 'north_america', 'NSF Certified for Sport',
 'internal', '["Vanilla","Chocolate","Strawberry"]'::jsonb),

('Nitro-Tech Whey Gold', 'Nitro-Tech Whey Gold', 'supplements',
 'MuscleTech', 'powder', 'scoop', 36,
 '1 scoop (36g)', 389, 75, 4, 7, 0, 2, 400, 120, 0,
 true, true, 'north_america', 'Informed Choice certified',
 'internal', '["Double Chocolate","French Vanilla Swirl","Birthday Cake"]'::jsonb),

('Syntha-6 Ultra-Premium Protein', 'Syntha-6 Ultra-Premium Protein', 'supplements',
 'BSN', 'powder', 'scoop', 47,
 '1 scoop (47g)', 383, 51, 25, 13, 4, 9, 340, 150, 0,
 true, true, 'north_america', 'Informed Choice certified',
 'internal', '["Chocolate Milkshake","Vanilla Ice Cream","Chocolate Peanut Butter"]'::jsonb),

-- ========== WHEY PROTEIN — EUROPE ==========
('Impact Whey Protein', 'Impact Whey Protein', 'supplements',
 'Myprotein', 'powder', 'scoop', 25,
 '1 scoop (25g)', 392, 80, 7, 5, 0, 4, 140, 120, 0,
 true, true, 'europe', 'Informed Sport certified',
 'internal', '["Chocolate Smooth","Vanilla","Natural Strawberry","Salted Caramel","Unflavoured"]'::jsonb),

('Iso-Whey Zero', 'Iso-Whey Zero', 'supplements',
 'BioTech USA', 'powder', 'scoop', 25,
 '1 scoop (25g)', 372, 79, 3, 5, 0, 2, 220, 100, 0,
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vanilla","Banana","Strawberry"]'::jsonb),

('100% Whey Protein Professional', '100% Whey Protein Professional', 'supplements',
 'Scitec Nutrition', 'powder', 'scoop', 30,
 '1 scoop (30g)', 387, 73, 6, 7, 0, 5, 250, 130, 0,
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vanilla","Cookies & Cream","Strawberry White Chocolate"]'::jsonb),

('Whey-Pro', 'Whey-Pro', 'supplements',
 'Prozis', 'powder', 'scoop', 30,
 '1 scoop (30g)', 380, 75, 8, 5, 0, 3, 180, 110, 0,
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vanilla","Strawberry","Natural"]'::jsonb),

-- ========== WHEY PROTEIN — SOUTH AMERICA ==========
('Whey 100%', 'Whey 100%', 'supplements',
 'Probiótica', 'powder', 'scoop', 30,
 '1 scoop (30g)', 367, 70, 8, 6, 0, 3, 220, 120, 0,
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Baunilha","Morango"]'::jsonb),

('Whey Protein Arnold', 'Whey Protein Arnold', 'supplements',
 'Universal Nutrition BR', 'powder', 'scoop', 33,
 '1 scoop (33g)', 364, 66, 8, 7, 0, 4, 200, 110, 0,
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Baunilha","Cookies"]'::jsonb),

('Gold Whey Protein Max Titanium', 'Gold Whey Protein Max Titanium', 'supplements',
 'Max Titanium', 'powder', 'scoop', 33,
 '1 scoop (33g)', 364, 67, 9, 6, 0, 4, 180, 115, 0,
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Baunilha","Morango","Amendoim"]'::jsonb),

-- ========== WHEY PROTEIN — EAST AFRICA / GLOBAL ==========
('USN Muscle Fuel Anabolic', 'USN Muscle Fuel Anabolic', 'supplements',
 'USN', 'powder', 'scoop', 100,
 '1 scoop (100g) as directed', 403, 35, 53, 8, 0, 22, 430, 200, 3,
 true, true, 'east_africa', 'Informed Sport certified',
 'internal', '["Strawberry","Chocolate","Vanilla","Banana"]'::jsonb),

('USN Blue Lab 100% Whey', 'USN Blue Lab 100% Whey', 'supplements',
 'USN', 'powder', 'scoop', 34,
 '1 scoop (34g)', 382, 77, 5, 5, 0, 3, 200, 130, 0,
 true, true, 'east_africa', 'Informed Sport certified',
 'internal', '["Chocolate","Vanilla","Strawberry","Peanut Butter Fudge"]'::jsonb),

('USN Hardcore Whey gH', 'USN Hardcore Whey gH', 'supplements',
 'USN', 'powder', 'scoop', 33,
 '1 scoop (33g)', 376, 73, 6, 6, 0, 3, 250, 120, 0,
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vanilla","Strawberry Cream"]'::jsonb),

-- ========== ISOLATE — NORTH AMERICA ==========
('Gold Standard 100% Isolate', 'Gold Standard 100% Isolate', 'supplements',
 'Optimum Nutrition', 'powder', 'scoop', 31,
 '1 scoop (31g)', 387, 90, 3, 1, 0, 1, 430, 105, 0,
 true, true, 'north_america', 'Informed Choice certified',
 'internal', '["Chocolate Bliss","Vanilla Bean","Strawberry"]'::jsonb),

('Dymatize ISO 100', 'Dymatize ISO 100', 'supplements',
 'Dymatize', 'powder', 'scoop', 29,
 '1 scoop (29g)', 379, 86, 4, 1, 0, 1, 480, 110, 0,
 true, true, 'north_america', 'Informed Choice & NSF certified',
 'internal', '["Gourmet Chocolate","Gourmet Vanilla","Fruity Pebbles","Birthday Cake"]'::jsonb),

('Isopure Zero Carb', 'Isopure Zero Carb', 'supplements',
 'Nature''s Best', 'powder', 'scoop', 31,
 '1 scoop (31g)', 387, 90, 0, 0, 0, 0, 460, 100, 0,
 true, true, 'north_america', 'Informed Sport certified',
 'internal', '["Chocolate","Vanilla","Strawberry Cream","Alpine Punch"]'::jsonb),

-- ========== ISOLATE — EUROPE ==========
('Impact Whey Isolate', 'Impact Whey Isolate', 'supplements',
 'Myprotein', 'powder', 'scoop', 25,
 '1 scoop (25g)', 404, 90, 3, 1, 0, 2, 90, 80, 0,
 true, true, 'europe', 'Informed Sport certified',
 'internal', '["Natural Chocolate","Vanilla","Unflavoured","Strawberry Cream"]'::jsonb),

('Platinum Whey Isolate', 'Platinum Whey Isolate', 'supplements',
 'Scitec Nutrition', 'powder', 'scoop', 30,
 '1 scoop (30g)', 393, 87, 2, 1, 0, 1, 180, 90, 0,
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vanilla","Strawberry"]'::jsonb)

ON CONFLICT DO NOTHING;
