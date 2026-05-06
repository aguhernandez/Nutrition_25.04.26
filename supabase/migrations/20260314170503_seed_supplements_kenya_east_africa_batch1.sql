/*
  # Supplements - Kenya & East Africa Batch 1
  Brands: USN (extended), Evox, NPL, Biogen, SSN, Nutri-Sport EA,
  IronMax Kenya, PowerBar EA, Hammer Nutrition EA, SCI-MX UK (dist EA)
*/

INSERT INTO foods_v2 (
  name_es, name_en, category, brand, product_form, serving_unit, serving_size_g,
  serving_description, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
  fiber_per_100g, sugar_per_100g, sodium_mg, potassium_mg, calcium_mg, magnesium_mg,
  iron_mg, zinc_mg, vitamin_c_mg, vitamin_d_ug, vitamin_b12_ug,
  caffeine_mg, beta_alanine_mg, creatine_mg, electrolytes_note,
  is_supplement, is_verified, region, antidoping_note, source, flavors
) VALUES

-- ==============================
-- USN (Sudáfrica/Kenya — extended)
-- ==============================
('USN Muscle Fuel Anabolic Chocolate', 'USN Muscle Fuel Anabolic Chocolate', 'supplements',
 'USN', 'powder', 'scoop', 100,
 '1 serving (100g) — ganador todo-en-uno', 403, 35, 53, 8, 0, 22, 430, 0, 200, 0, 3, 0, 100000, 5, 6, 0, 0, 1000, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa","Platano","Caramelo"]'::jsonb),

('USN Trust Creatine Monohydrate', 'USN Trust Creatine Monohydrate', 'supplements',
 'USN', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Sin sabor"]'::jsonb),

('USN 3XT-Mass Ganador de Masa', 'USN 3XT-Mass Gainer', 'supplements',
 'USN', 'powder', 'scoop', 300,
 '3 medidas (300g) — hipercalórico', 380, 18, 70, 5, 2, 32, 460, 0, 320, 0, 10, 0, 0, 5, 4, 0, 0, 1000, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vainilla","Fresa"]'::jsonb),

('USN Whey Protein Premium', 'USN Whey Protein Premium', 'supplements',
 'USN', 'powder', 'scoop', 33,
 '1 medida (33g)', 385, 78, 5, 5, 0, 3, 195, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa","Galletas y Crema","Caramelo Salado"]'::jsonb),

('USN Purefit Pro Recover', 'USN Purefit Pro Recover', 'supplements',
 'USN', 'powder', 'scoop', 50,
 '1 medida (50g) — recuperación 3:1', 380, 38, 50, 4, 1, 18, 310, 0, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa"]'::jsonb),

('USN Virtual Whey Lean', 'USN Virtual Whey Lean', 'supplements',
 'USN', 'powder', 'scoop', 35,
 '1 medida (35g) — definición muscular', 386, 77, 4, 5, 0, 2, 200, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Caramelo","Cookies Cream"]'::jsonb),

('USN Iso-GH Whey Isolate', 'USN Iso-GH Whey Isolate', 'supplements',
 'USN', 'powder', 'scoop', 30,
 '1 medida (30g)', 393, 87, 2, 1, 0, 1, 175, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa","Cookies"]'::jsonb),

('USN Energy Gel Running', 'USN Energy Gel Running', 'supplements',
 'USN', 'gel', 'sachet', 40,
 '1 sachet (40g)', 225, 1, 55, 0, 0, 10, 170, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 170mg, K 60mg',
 true, true, 'east_africa', '', 'internal',
 '["Naranja","Baya","Tropical","Platano"]'::jsonb),

('USN Carb+ Bebida Energía', 'USN Carb+ Energy Drink Mix', 'supplements',
 'USN', 'powder', 'scoop', 60,
 '1 medida (60g) en 750ml', 375, 0, 93, 0, 0, 45, 390, 170, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 390mg, K 170mg, Mg 12mg',
 true, true, 'east_africa', '', 'internal',
 '["Naranja","Limon","Baya","Tropical"]'::jsonb),

('USN Barrita de Proteína Pure Protein', 'USN Pure Protein Bar', 'supplements',
 'USN', 'bar', 'bar', 55,
 '1 barra (55g)', 364, 36, 34, 11, 7, 6, 290, 0, 175, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Caramelo","Nougat Avellana"]'::jsonb),

('USN Vitamina C 1000mg', 'USN Vitamin C 1000mg', 'supplements',
 'USN', 'tablet', 'tablet', 2,
 '2 comprimidos efervescentes — 1000mg Vit C', 0, 0, 2, 0, 0, 1, 200, 0, 0, 0, 0, 0, 100000, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Naranja","Limon","Baya"]'::jsonb),

('USN Hierro con Vitamina C', 'USN Iron with Vitamin C', 'supplements',
 'USN', 'tablet', 'tablet', 1,
 '1 comprimido — 14mg hierro + 80mg Vit C', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 80000, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

('USN Vitamina D3 1000 UI', 'USN Vitamin D3 1000 IU', 'supplements',
 'USN', 'capsule', 'capsule', 1,
 '1 cápsula — 25mcg D3', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

('USN Cafeína 200mg Sport', 'USN Caffeine 200mg Sport', 'supplements',
 'USN', 'tablet', 'tablet', 1,
 '1 comprimido — 200mg cafeína', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- EVOX (Sudáfrica/Kenya)
-- ==============================
('Proteína Whey Evox 100%', 'Evox 100% Whey Protein', 'supplements',
 'Evox', 'powder', 'scoop', 35,
 '1 medida (35g)', 377, 74, 8, 5, 0, 4, 205, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Caramelo","Nougat"]'::jsonb),

('Evox Whey Isolate Premium', 'Evox Whey Isolate Premium', 'supplements',
 'Evox', 'powder', 'scoop', 30,
 '1 medida (30g)', 390, 88, 2, 1, 0, 1, 165, 0, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vainilla","Sin Sabor"]'::jsonb),

('Creatina Evox 300g', 'Evox Creatine 300g', 'supplements',
 'Evox', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Barrita Evox Pro Protein Bar', 'Evox Pro Protein Bar', 'supplements',
 'Evox', 'bar', 'bar', 60,
 '1 barra (60g)', 367, 35, 35, 12, 7, 7, 275, 0, 180, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Caramelo","Vainilla","Baya Mixta"]'::jsonb),

('Gel Energético Evox Marathon Gel', 'Evox Marathon Energy Gel', 'supplements',
 'Evox', 'gel', 'sachet', 40,
 '1 sachet (40g)', 225, 0, 56, 0, 0, 22, 180, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 180mg, K 70mg',
 true, true, 'east_africa', '', 'internal',
 '["Naranja","Limon","Cola","Tropical"]'::jsonb),

-- ==============================
-- NPL (Nutrition Performance Lab — SA/Kenya)
-- ==============================
('Proteína Whey NPL Premium', 'NPL Premium Whey Protein', 'supplements',
 'NPL', 'powder', 'scoop', 35,
 '1 medida (35g)', 377, 73, 8, 5, 0, 4, 200, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Cookies y Crema","Rocky Road"]'::jsonb),

('Creatina NPL Micronizada', 'NPL Micronized Creatine', 'supplements',
 'NPL', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Barrita NPL High Protein Bar', 'NPL High Protein Bar', 'supplements',
 'NPL', 'bar', 'bar', 60,
 '1 barra (60g)', 367, 34, 36, 12, 7, 7, 280, 0, 175, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Caramelo Salado","Vainilla","Fresa Nougat"]'::jsonb),

-- ==============================
-- BIOGEN (Sudáfrica/Kenya)
-- ==============================
('Proteína Whey Biogen', 'Biogen Whey Protein', 'supplements',
 'Biogen', 'powder', 'scoop', 35,
 '1 medida (35g)', 374, 72, 9, 5, 0, 4, 205, 0, 112, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Caramelo"]'::jsonb),

('Biogen Complete Whey Isolate', 'Biogen Complete Whey Isolate', 'supplements',
 'Biogen', 'powder', 'scoop', 30,
 '1 medida (30g)', 387, 86, 2, 1, 0, 1, 160, 0, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vainilla","Sin Sabor"]'::jsonb),

('Barrita Biogen Protein Bar', 'Biogen Protein Bar', 'supplements',
 'Biogen', 'bar', 'bar', 55,
 '1 barra (55g)', 364, 33, 36, 11, 7, 6, 270, 0, 170, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Caramelo","Vainilla"]'::jsonb),

('Hierro + C Biogen 30 cápsulas', 'Biogen Iron + C 30 caps', 'supplements',
 'Biogen', 'capsule', 'capsule', 1,
 '1 cápsula — 14mg hierro + 75mg Vit C', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 75000, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- SSN (Supplement Support Network — Kenya/SA)
-- ==============================
('Proteína Whey SSN Premium', 'SSN Premium Whey Protein', 'supplements',
 'SSN', 'powder', 'scoop', 35,
 '1 medida (35g)', 380, 74, 8, 5, 0, 4, 205, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Nougat de Nuez"]'::jsonb),

('Creatina SSN 200g', 'SSN Creatine 200g', 'supplements',
 'SSN', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- SCI-MX (UK, muy distribuida en Kenya/EA)
-- ==============================
('Proteína ULTRA Whey SCI-MX', 'SCI-MX ULTRA Whey Protein', 'supplements',
 'SCI-MX', 'powder', 'scoop', 40,
 '1 medida (40g)', 385, 75, 7, 6, 0, 4, 215, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Chocolate Belga","Vainilla","Fresa","Sin Sabor"]'::jsonb),

('Barrita Pro Recover SCI-MX', 'SCI-MX Pro Recover Bar', 'supplements',
 'SCI-MX', 'bar', 'bar', 60,
 '1 barra (60g)', 370, 32, 38, 12, 8, 9, 270, 0, 175, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Chocolate","Caramelo","Vainilla"]'::jsonb),

-- ==============================
-- HAMMER NUTRITION (EA Distribution)
-- ==============================
('Gel de Energía Hammer Gel', 'Hammer Gel Energy', 'supplements',
 'Hammer Nutrition', 'gel', 'sachet', 33,
 '1 sachet (33g) — bajo azúcar', 273, 0, 68, 0, 0, 3, 55, 30, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 55mg, K 30mg, Mg 3mg — bajo en azúcar simple',
 true, true, 'east_africa', '', 'internal',
 '["Vainilla","Apple-Cinnamon","Banana","Montana Huckleberry","Espresso con Cafeína (50mg)"]'::jsonb),

('Bebida HEED Hammer Electrolitos', 'Hammer HEED Sports Drink Mix', 'supplements',
 'Hammer Nutrition', 'powder', 'scoop', 29,
 '1 medida (29g) en 750ml', 379, 0, 94, 0, 0, 0, 138, 100, 0, 52, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 138mg, K 100mg, Mg 52mg — sin azúcar simple',
 true, true, 'east_africa', '', 'internal',
 '["Limon-Lima","Melon","Fresa","Apple-Cinnamon"]'::jsonb),

-- ==============================
-- POWERBAR (Distribución EA/Global extended)
-- ==============================
('Gel PowerGel Hydro PowerBar', 'PowerBar PowerGel Hydro', 'supplements',
 'PowerBar', 'gel', 'sachet', 67,
 '1 sachet (67ml) — gel acuoso, no necesita agua', 134, 0, 33, 0, 0, 10, 200, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 200mg, K 110mg',
 true, true, 'east_africa', '', 'internal',
 '["Cola con Cafeína (75mg)","Naranja","Tropical","Fresa"]'::jsonb),

('Bebida Isoactive PowerBar', 'PowerBar Isoactive Drink Mix', 'supplements',
 'PowerBar', 'powder', 'sachet', 41,
 '1 sachet (41g) en 750ml', 366, 0, 91, 0, 0, 35, 400, 200, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 400mg, K 200mg, Mg 24mg — fórmula isotónica oficial UCI',
 true, true, 'east_africa', '', 'internal',
 '["Naranja","Limon","Pomelo Rosa","Sandía"]'::jsonb)

ON CONFLICT DO NOTHING;
