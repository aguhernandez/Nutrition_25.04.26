/*
  # Supplements - Europe Batch 2: Spain, France, Italy, Nordic, Netherlands brands
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
-- NUTREND (República Checa/EU)
-- ==============================
('Proteína Whey Nutrend 100%', 'Whey Protein Nutrend 100%', 'supplements',
 'Nutrend', 'powder', 'scoop', 30,
 '1 scoop (30g)', 382, 75, 7, 5, 0, 3, 210, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Cookies","Moca"]'::jsonb),

('Gel Nutrend SPRINT', 'Nutrend SPRINT Gel', 'supplements',
 'Nutrend', 'gel', 'sachet', 45,
 '1 sachet (45g)', 267, 0, 67, 0, 0, 23, 175, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 175mg, K 70mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Manzana","Fresa","Sandía"]'::jsonb),

('Gel TURBO Nutrend con Cafeína', 'Nutrend TURBO Gel with Caffeine', 'supplements',
 'Nutrend', 'gel', 'sachet', 45,
 '1 sachet (45g) — 80mg cafeína', 267, 0, 67, 0, 0, 23, 175, 70, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 'Na 175mg, K 70mg',
 true, true, 'europe', '', 'internal',
 '["Cola","Cafe","Limon","Naranja"]'::jsonb),

('Barrita Protein Bar 55g Nutrend', 'Protein Bar 55g Nutrend', 'supplements',
 'Nutrend', 'bar', 'bar', 55,
 '1 barra (55g)', 367, 30, 37, 13, 5, 11, 260, 0, 180, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate Caramelo","Fresa Frambuesa","Coco Chocolate","Mani Caramelo"]'::jsonb),

('Carnitina Concentrada Nutrend', 'Carnitine Concentrate Nutrend', 'supplements',
 'Nutrend', 'liquid', 'ml', 20,
 '1 ampolla (20ml) — 1500mg L-carnitina', 0, 0, 4, 0, 0, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Limon","Naranja","Cereza","Natural"]'::jsonb),

-- ==============================
-- HIGH5 (UK)
-- ==============================
('Gel de Energía HIGH5', 'HIGH5 Energy Gel', 'supplements',
 'HIGH5', 'gel', 'sachet', 40,
 '1 sachet (40g)', 275, 0, 69, 0, 0, 26, 55, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 55mg, K 100mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Baya Mixta","Manzana","Tropical","Vainilla"]'::jsonb),

('Gel Cafeína HIGH5 Plus', 'HIGH5 Plus Caffeine Gel', 'supplements',
 'HIGH5', 'gel', 'sachet', 40,
 '1 sachet (40g) — 30mg cafeína', 275, 0, 69, 0, 0, 26, 55, 100, 0, 0, 0, 0, 0, 0, 0, 30, 0, 0, 'Na 55mg, K 100mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Limon","Cola","Cafe"]'::jsonb),

('HIGH5 ZERO Bebida Electrolitos', 'HIGH5 ZERO Electrolyte Drink', 'supplements',
 'HIGH5', 'tablet', 'tablet', 5,
 '1 tableta en 500ml — 0 calorías', 0, 0, 0, 0, 0, 0, 480, 220, 64, 28, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 480mg, K 220mg, Ca 64mg, Mg 28mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Frutos Rojos","Cola","Menta"]'::jsonb),

('HIGH5 Protein Bar', 'HIGH5 Protein Bar', 'supplements',
 'HIGH5', 'bar', 'bar', 50,
 '1 barra (50g)', 370, 30, 36, 13, 8, 7, 260, 0, 165, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate Puro","Caramelo Salado","Galleta"]'::jsonb),

('HIGH5 Drink Mix 47g', 'HIGH5 Energy Drink Mix', 'supplements',
 'HIGH5', 'powder', 'sachet', 47,
 '1 sachet (47g) + 750ml agua', 362, 1, 87, 0, 0, 46, 255, 155, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 255mg, K 155mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Baya","Limon","Tropical"]'::jsonb),

-- ==============================
-- ANDERSON (España)
-- ==============================
('Proteína Whey Anderson Research', 'Anderson Research Whey Protein', 'supplements',
 'Anderson Research', 'powder', 'scoop', 30,
 '1 scoop (30g)', 385, 80, 5, 5, 0, 3, 190, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Cookie Dough"]'::jsonb),

-- ==============================
-- HSN (España)
-- ==============================
('Proteína EssentialSeries Whey HSN', 'HSN EssentialSeries Whey', 'supplements',
 'HSN', 'powder', 'scoop', 25,
 '1 scoop (25g)', 392, 80, 7, 4, 0, 4, 165, 0, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Natural","Cookie"]'::jsonb),

('Isolado de Suero EvoSeries HSN', 'HSN EvoSeries Whey Isolate', 'supplements',
 'HSN', 'powder', 'scoop', 30,
 '1 scoop (30g)', 397, 90, 1, 1, 0, 1, 130, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Sin Sabor"]'::jsonb),

('Creatina EssentialSeries HSN', 'HSN EssentialSeries Creatine', 'supplements',
 'HSN', 'powder', 'scoop', 5,
 '1 scoop (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Beta-Alanina EvoSeries HSN', 'HSN EvoSeries Beta-Alanine', 'supplements',
 'HSN', 'powder', 'scoop', 5,
 '1 scoop (5g) — 5000mg beta-alanina', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, 0, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- SPONSER (Suiza)
-- ==============================
('Whey Proteína Sponser', 'Sponser Whey Protein', 'supplements',
 'Sponser', 'powder', 'scoop', 40,
 '1 scoop (40g)', 375, 75, 9, 5, 0, 5, 200, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa","Natural"]'::jsonb),

('Gel de Energía Liqua-Gel Sponser', 'Sponser Liqua-Gel Energy', 'supplements',
 'Sponser', 'gel', 'sachet', 70,
 '1 sachet (70ml) — gel líquido fácil consumo', 200, 0, 49, 0, 0, 24, 250, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 250mg, K 120mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Frutos Rojos","Pepino Menta"]'::jsonb),

('Bebida Deportiva Sponser Long Energy', 'Sponser Long Energy Drink', 'supplements',
 'Sponser', 'powder', 'scoop', 60,
 '1 serving (60g) en 500ml', 370, 1, 85, 0, 0, 35, 560, 220, 0, 18, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 560mg, K 220mg, Mg 18mg — alto sodio para calor',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Baya","Manzana"]'::jsonb),

-- ==============================
-- OVERSTIMS (Francia)
-- ==============================
('Gel Electro Overstims', 'Overstims Electro Endurance Gel', 'supplements',
 'Overstims', 'gel', 'sachet', 34,
 '1 sachet (34g)', 279, 0, 69, 0, 0, 29, 280, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 280mg, K 60mg',
 true, true, 'europe', '', 'internal',
 '["Naranja Cítrica","Limon","Albaricoque","Grosella Negra","Manzana Verde"]'::jsonb),

('Gatosport Bebida Energía Overstims', 'Overstims Gatosport Energy Drink', 'supplements',
 'Overstims', 'powder', 'scoop', 40,
 '1 serving (40g) en 500ml', 370, 1, 90, 0, 0, 42, 380, 170, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 380mg, K 170mg, Mg 12mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Baya","Tropical"]'::jsonb),

('Endurance Solid Overstims', 'Overstims Endurance Solid Bar', 'supplements',
 'Overstims', 'bar', 'bar', 60,
 '1 barra (60g) — para esfuerzos largos', 380, 8, 72, 8, 3, 28, 150, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Datil Miel","Albaricoque","Cereza","Datil Coco"]'::jsonb),

-- ==============================
-- SIS (Science in Sport UK) — extended
-- ==============================
('Polvo GO Energy SiS', 'SiS GO Energy Powder', 'supplements',
 'Science in Sport', 'powder', 'scoop', 40,
 '1 scoop (40g) en 500ml', 375, 0, 93, 0, 0, 35, 110, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 110mg, K 70mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Baya","Sin Sabor"]'::jsonb),

('Bebida Beta Fuel SiS 80g', 'SiS Beta Fuel 80g Drink Mix', 'supplements',
 'Science in Sport', 'powder', 'sachet', 82,
 '1 sachet (82g) — ratio 1:0.8 glucosa:fructosa', 372, 0, 91, 0, 0, 36, 500, 190, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 500mg, K 190mg — fórmula 80g CHO/hora',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Baya","Tropical"]'::jsonb),

('Gel Beta Fuel SiS con Nopea', 'SiS Beta Fuel Gel with Nopal', 'supplements',
 'Science in Sport', 'gel', 'sachet', 60,
 '1 sachet (60g) — 40g CHO', 200, 0, 47, 0, 0, 21, 250, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 250mg, K 100mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Baya","Limon","Tropical"]'::jsonb),

('Polvo REGO Recovery SiS', 'SiS REGO Rapid Recovery Powder', 'supplements',
 'Science in Sport', 'powder', 'scoop', 50,
 '1 scoop (50g) — recuperación post-entreno', 376, 40, 50, 3, 2, 15, 300, 0, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa"]'::jsonb),

-- ==============================
-- NATURO SCIENCES / MULTIPOWER (EU)
-- ==============================
('Proteína Whey Multipower', 'Multipower Whey Protein', 'supplements',
 'Multipower', 'powder', 'scoop', 30,
 '1 scoop (30g)', 383, 74, 7, 6, 0, 4, 220, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Sin Sabor"]'::jsonb),

('Barrita Proteína Multipower', 'Multipower Protein Bar', 'supplements',
 'Multipower', 'bar', 'bar', 45,
 '1 barra (45g)', 380, 33, 38, 12, 5, 9, 270, 0, 170, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Cacahuete","Caramelo","Cookies"]'::jsonb),

-- ==============================
-- OLIMP SPORT NUTRITION (Polonia)
-- ==============================
('Proteína Whey Olimp Pure', 'Olimp Pure Whey Protein', 'supplements',
 'Olimp Sport Nutrition', 'powder', 'scoop', 35,
 '1 scoop (35g)', 380, 74, 8, 5, 0, 4, 200, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate Brownie","Vainilla","Cookies","Mantequilla Mani","Nougat"]'::jsonb),

('Proteína Iso Whey Olimp Zero', 'Olimp Iso Whey Zero', 'supplements',
 'Olimp Sport Nutrition', 'powder', 'scoop', 30,
 '1 scoop (30g) — sin lactosa', 393, 87, 2, 1, 0, 1, 180, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla Bourbon","Galleta Cookies","Dulce de Leche","Mango Pasion"]'::jsonb),

('Gel Energético Olimp Carbo NOX', 'Olimp Carbo NOX Gel', 'supplements',
 'Olimp Sport Nutrition', 'gel', 'sachet', 30,
 '1 sachet (30g)', 347, 0, 87, 0, 0, 30, 200, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 200mg, K 80mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Baya","Manzana Verde"]'::jsonb),

('Barrita Protein Bar Olimp', 'Olimp Protein Bar', 'supplements',
 'Olimp Sport Nutrition', 'bar', 'bar', 64,
 '1 barra (64g)', 385, 35, 36, 14, 7, 8, 290, 0, 185, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate Caramelo","Vainilla Nougat","Toffee Salado","Cheesecake Limon"]'::jsonb),

-- ==============================
-- XENOFIT (Alemania) — triatlón y trail
-- ==============================
('Gel de Carbohidratos Xenofit', 'Xenofit Carbohydrate Gel', 'supplements',
 'Xenofit', 'gel', 'sachet', 60,
 '1 sachet (60ml)', 100, 0, 23, 0, 0, 11, 200, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 200mg, K 100mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Baya","Cola con Cafeína 75mg"]'::jsonb),

('Bebida Competencia Xenofit Competition', 'Xenofit Competition Drink', 'supplements',
 'Xenofit', 'powder', 'scoop', 40,
 '1 serving (40g) en 500ml', 370, 0, 91, 0, 0, 38, 490, 200, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 490mg, K 200mg, Mg 20mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Manzana","Baya Roja"]'::jsonb),

-- ==============================
-- STINGER (Holanda/Global) — triatlón
-- ==============================
('Gel de Miel Bee Stinger', 'Honey Stinger Organic Gel', 'supplements',
 'Honey Stinger', 'gel', 'sachet', 32,
 '1 sachet (32g) — base de miel orgánica', 369, 0, 90, 0, 0, 83, 105, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Miel Pura","Frambuesa","Fruta del Dragon","Cafe Organico (32mg caf)","Tamarindo Limon"]'::jsonb),

('Barrita Energética Bee Stinger', 'Honey Stinger Energy Bar', 'supplements',
 'Honey Stinger', 'bar', 'bar', 45,
 '1 barra (45g) — orgánica base miel', 440, 5, 73, 14, 2, 24, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Mantequilla Mani Miel","Chocolate Oscuro","Granola Fruta","Almendra Vainilla"]'::jsonb),

-- ==============================
-- DECATHLON (España/Francia/Global) — marcas propias
-- ==============================
('Proteína Whey Isotar Decathlon', 'Decathlon Isotar Whey Protein', 'supplements',
 'Decathlon / Isotar', 'powder', 'scoop', 30,
 '1 scoop (30g)', 383, 74, 6, 6, 0, 4, 210, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Natural"]'::jsonb),

('Gel de Energía Isotar', 'Decathlon Isotar Energy Gel', 'supplements',
 'Decathlon / Isotar', 'gel', 'sachet', 32,
 '1 sachet (32g)', 344, 0, 86, 0, 0, 28, 120, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Baya","Tropical","Manzana"]'::jsonb),

('Bebida Isotónica Isotar en Polvo', 'Decathlon Isotar Isotonic Drink Mix', 'supplements',
 'Decathlon / Isotar', 'powder', 'sachet', 35,
 '1 sachet (35g) en 500ml', 377, 0, 94, 0, 0, 40, 280, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 280mg, K 120mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Baya","Menta"]'::jsonb),

('Barrita Energética Isotar Decathlon', 'Decathlon Isotar Energy Bar', 'supplements',
 'Decathlon / Isotar', 'bar', 'bar', 40,
 '1 barra (40g)', 388, 5, 74, 7, 3, 30, 100, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Datil","Albaricoque","Chocolate","Platano"]'::jsonb),

-- ==============================
-- NATURO SCIENCES NORDICS (Suecia/Noruega)
-- ==============================
('Proteína Whey Gainomax', 'Gainomax Whey Protein', 'supplements',
 'Gainomax', 'powder', 'scoop', 30,
 '1 scoop (30g)', 390, 80, 6, 5, 0, 3, 190, 0, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Caramelo Salado"]'::jsonb),

('Batido de Recuperación Gainomax', 'Gainomax Recovery Drink RTD', 'supplements',
 'Gainomax', 'liquid', 'ml', 500,
 '1 botella (500ml) — listo para tomar', 74, 15, 5, 0, 0, 5, 100, 0, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Frutas del Bosque"]'::jsonb)

ON CONFLICT DO NOTHING;
