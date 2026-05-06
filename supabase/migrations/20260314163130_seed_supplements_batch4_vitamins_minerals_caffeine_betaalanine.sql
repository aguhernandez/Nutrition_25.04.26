/*
  # Seed Supplements Batch 4: Vitamins, Iron, Caffeine tabs, Beta-Alanine
*/

INSERT INTO foods_v2 (
  name_es, name_en, category, brand, product_form, serving_unit, serving_size_g,
  serving_description, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
  fiber_per_100g, sugar_per_100g, sodium_mg, calcium_mg, iron_mg, vitamin_c_mg,
  vitamin_d_ug, vitamin_b12_ug, zinc_mg, magnesium_mg, caffeine_mg, beta_alanine_mg,
  is_supplement, is_verified, region, antidoping_note, source, flavors, electrolytes_note
) VALUES

-- ========== VITAMINA C ==========
('Vitamina C 1000mg', 'Vitamin C 1000mg', 'supplements',
 'Ester-C (American Health)', 'tablet', 'tablet', 2,
 '1 tablet (2g) — 1000mg Vitamin C', 0, 0, 0, 0, 0, 0, 0, 42, 0, 100000, 0, 0, 0, 0, 0, 0,
 true, true, 'north_america', '',
 'internal', '["Unflavoured"]'::jsonb, ''),

('Redoxon Vitamina C 1000mg', 'Redoxon Vitamin C 1000mg', 'supplements',
 'Bayer', 'tablet', 'tablet', 4,
 '1 effervescent tablet (4g) in water — 1000mg Vit C', 0, 0, 2, 0, 0, 0, 280, 0, 0, 100000, 0, 0, 0, 0, 0, 0,
 true, true, 'global', '',
 'internal', '["Orange","Lemon","Blackcurrant"]'::jsonb, ''),

('Cebion Vitamina C 500mg', 'Cebion Vitamin C 500mg', 'supplements',
 'Merck Consumer Health', 'tablet', 'tablet', 3,
 '1 chewable tablet (3g) — 500mg Vit C', 0, 0, 2, 0, 0, 1, 0, 0, 0, 50000, 0, 0, 0, 0, 0, 0,
 true, true, 'south_america', '',
 'internal', '["Orange","Lemon"]'::jsonb, ''),

('Myprotein Vitamin C 1000mg', 'Myprotein Vitamin C 1000mg', 'supplements',
 'Myprotein', 'tablet', 'tablet', 2,
 '1 tablet (2g) — 1000mg Vit C', 0, 0, 0, 0, 0, 0, 0, 0, 0, 100000, 0, 0, 0, 0, 0, 0,
 true, true, 'europe', 'Informed Sport certified',
 'internal', '["Unflavoured"]'::jsonb, ''),

-- ========== VITAMINA D ==========
('Vitamina D3 2000 IU', 'Vitamin D3 2000 IU', 'supplements',
 'NOW Foods', 'capsule', 'capsule', 1,
 '1 softgel — 2000 IU (50mcg) Vitamin D3', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0, 0, 0,
 true, true, 'north_america', '',
 'internal', '["Unflavoured"]'::jsonb, ''),

('Vitamina D3 5000 IU', 'Vitamin D3 5000 IU', 'supplements',
 'Jarrow Formulas', 'capsule', 'capsule', 1,
 '1 capsule — 5000 IU (125mcg) D3', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 125, 0, 0, 0, 0, 0,
 true, true, 'north_america', '',
 'internal', '["Unflavoured"]'::jsonb, ''),

('D-Pearls Vitamina D3', 'D-Pearls Vitamin D3', 'supplements',
 'Pharma Nord', 'capsule', 'capsule', 1,
 '1 softgel — 1600 IU (40mcg) D3', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0,
 true, true, 'europe', '',
 'internal', '["Unflavoured"]'::jsonb, ''),

-- ========== VITAMINA B12 ==========
('Vitamina B12 1000mcg Metilcobalamina', 'Vitamin B12 1000mcg Methylcobalamin', 'supplements',
 'Solgar', 'tablet', 'tablet', 1,
 '1 sublingual tablet — 1000mcg B12', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0,
 true, true, 'global', '',
 'internal', '["Cherry","Raspberry"]'::jsonb, ''),

('B12 Cyanocobalamin 500mcg', 'B12 Cyanocobalamin 500mcg', 'supplements',
 'NOW Foods', 'capsule', 'capsule', 1,
 '1 capsule — 500mcg B12', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 500, 0, 0, 0, 0,
 true, true, 'north_america', '',
 'internal', '["Unflavoured"]'::jsonb, ''),

-- ========== HIERRO ==========
('Ferro-Gradumet (Sulfato de Hierro)', 'Ferro-Gradumet (Iron Sulfate)', 'supplements',
 'Abbott', 'tablet', 'tablet', 2,
 '1 tablet — 105mg elemental iron', 0, 0, 0, 0, 0, 0, 0, 0, 105, 0, 0, 0, 0, 0, 0, 0,
 true, true, 'global', 'Medical grade — consult healthcare provider',
 'internal', '["Unflavoured"]'::jsonb, ''),

('Floradix Liquid Iron Formula', 'Floradix Liquid Iron Formula', 'supplements',
 'Salus', 'liquid', 'ml', 10,
 '1 portion (10ml) — 7.5mg elemental iron', 0, 0, 9, 0, 0, 6, 0, 0, 75, 5000, 0, 1, 0, 0, 0, 0,
 true, true, 'europe', '',
 'internal', '["Liquid herbal formula"]'::jsonb, '+ vit C, B12 for absorption'),

('Hierro Hemo-Fe 100mg', 'Hemo-Fe Iron 100mg', 'supplements',
 'Farmacias del Ahorro', 'tablet', 'tablet', 1,
 '1 tablet — 100mg iron fumarate', 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0,
 true, true, 'south_america', 'Consult healthcare provider',
 'internal', '["Unflavoured"]'::jsonb, ''),

('USN Iron + Vitamin C', 'USN Iron + Vitamin C', 'supplements',
 'USN', 'tablet', 'tablet', 1,
 '1 tablet — 14mg iron + 80mg vit C', 0, 0, 0, 0, 0, 0, 0, 0, 14, 80000, 0, 0, 0, 0, 0, 0,
 true, true, 'east_africa', '',
 'internal', '["Unflavoured"]'::jsonb, ''),

-- ========== MULTIVITAMÍNICO ==========
('Animal Pak Sport', 'Animal Pak Sport', 'supplements',
 'Universal Nutrition', 'tablet', 'tablet', 7,
 '1 pack (7 tablets daily)', 0, 0, 4, 0, 0, 0, 130, 500, 18, 100000, 5, 6, 15, 400, 0, 0,
 true, true, 'north_america', '',
 'internal', '["Unflavoured"]'::jsonb, ''),

('Opti-Men Sport Multivitamin', 'Opti-Men Sport Multivitamin', 'supplements',
 'Optimum Nutrition', 'tablet', 'tablet', 3,
 '3 tablets per day', 0, 0, 5, 0, 0, 0, 90, 200, 9, 100000, 10, 25, 15, 100, 0, 0,
 true, true, 'north_america', 'Informed Sport certified',
 'internal', '["Unflavoured"]'::jsonb, ''),

('Womens Multi+ Sport', 'Womens Multi+ Sport', 'supplements',
 'Garden of Life', 'tablet', 'tablet', 4,
 '4 tablets per day — women-specific', 0, 0, 3, 0, 0, 0, 50, 300, 18, 100000, 25, 8, 8, 50, 0, 0,
 true, true, 'north_america', 'NSF Certified for Sport',
 'internal', '["Unflavoured"]'::jsonb, ''),

-- ========== CAFEÍNA EN TABLETAS / SUPLEMENTOS ==========
('ProLab Caffeine 200mg', 'ProLab Caffeine 200mg', 'supplements',
 'ProLab', 'tablet', 'tablet', 1,
 '1 tablet — 200mg pure caffeine', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0,
 true, true, 'north_america', '',
 'internal', '["Unflavoured"]'::jsonb, ''),

('Caffeine 200mg Tablets', 'Caffeine 200mg Tablets', 'supplements',
 'Myprotein', 'tablet', 'tablet', 1,
 '1 tablet — 200mg caffeine anhydrous', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0,
 true, true, 'europe', 'Informed Sport certified',
 'internal', '["Unflavoured"]'::jsonb, ''),

('NOW Foods Caffeine 100mg', 'NOW Foods Caffeine 100mg', 'supplements',
 'NOW Foods', 'tablet', 'tablet', 1,
 '1 capsule — 100mg caffeine with L-Theanine 200mg', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0,
 true, true, 'north_america', '',
 'internal', '["Unflavoured"]'::jsonb, ''),

('Cafeína 200mg Naturale', 'Caffeine 200mg Natural', 'supplements',
 'Probiótica', 'tablet', 'tablet', 1,
 '1 comprimido — 200mg cafeína anidra', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0,
 true, true, 'south_america', '',
 'internal', '["Sem Sabor"]'::jsonb, ''),

-- ========== BETA-ALANINA ==========
('Beta-Alanine Powder', 'Beta-Alanine Powder', 'supplements',
 'NOW Sports', 'powder', 'scoop', 5,
 '1 scoop (5g) — 5000mg Beta-Alanine', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000,
 true, true, 'north_america', '',
 'internal', '["Unflavoured"]'::jsonb, ''),

('Beta-Alanine 3200mg', 'Beta-Alanine 3200mg', 'supplements',
 'Myprotein', 'tablet', 'tablet', 4,
 '4 capsules — 3200mg Beta-Alanine (CarnoSyn®)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3200,
 true, true, 'europe', 'Informed Sport certified — CarnoSyn® brand',
 'internal', '["Unflavoured"]'::jsonb, ''),

('MuscleTech Beta-Alanine', 'MuscleTech Beta-Alanine', 'supplements',
 'MuscleTech', 'powder', 'scoop', 5,
 '1 scoop (5g) — 3200mg Beta-Alanine', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3200,
 true, true, 'north_america', '',
 'internal', '["Unflavoured","Fruit Punch"]'::jsonb, ''),

('Beta-Alanina Pura', 'Pure Beta-Alanine', 'supplements',
 'Max Titanium', 'powder', 'scoop', 5,
 '1 scoop (5g) — 5000mg Beta-Alanine', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000,
 true, true, 'south_america', '',
 'internal', '["Sem Sabor"]'::jsonb, ''),

-- ========== MAGNESIO ==========
('Magnesium Bisglycinate 400mg', 'Magnesium Bisglycinate 400mg', 'supplements',
 'NOW Foods', 'capsule', 'capsule', 2,
 '2 capsules — 400mg elemental magnesium', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 400, 0, 0,
 true, true, 'north_america', '',
 'internal', '["Unflavoured"]'::jsonb, ''),

('Magnesio Sport', 'Sport Magnesium', 'supplements',
 'Myprotein', 'tablet', 'tablet', 1,
 '1 tablet — 375mg elemental magnesium', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 375, 0, 0,
 true, true, 'europe', 'Informed Sport certified',
 'internal', '["Unflavoured"]'::jsonb, '')

ON CONFLICT DO NOTHING;
