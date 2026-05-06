/*
  # Supplements Extra — filling to 500+ total
  Focus: more EU gels/bars/vitamins, more Argentina brands,
  more Kenya, specialized items across all regions
*/

INSERT INTO foods_v2 (
  name_es, name_en, category, brand, product_form, serving_unit, serving_size_g,
  serving_description, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
  fiber_per_100g, sugar_per_100g, sodium_mg, potassium_mg, calcium_mg, magnesium_mg,
  iron_mg, zinc_mg, vitamin_c_mg, vitamin_d_ug, vitamin_b12_ug,
  caffeine_mg, beta_alanine_mg, creatine_mg, electrolytes_note,
  is_supplement, is_verified, region, antidoping_note, source, flavors
) VALUES

-- ========== EU — más marcas y productos ==========
('Barrita Natural Bounce Ball Cacao EU', 'Bounce Cacao Mint Energy Ball EU', 'supplements',
 'Bounce Foods', 'bar', 'bar', 42,
 '1 bolita (42g) — base cacao y almendras', 452, 14, 40, 26, 5, 24, 45, 0, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Cacao Menta","Mantequilla Almendra","Anacardo y Arándano","Espirulina y Limon"]'::jsonb),

('Gel PF30 Precision Fuel EU', 'Precision Fuel & Hydration PF30 Gel', 'supplements',
 'Precision Hydration', 'gel', 'sachet', 30,
 '1 sachet (30g) — 30g CHO glucosa pura', 333, 0, 83, 0, 0, 83, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Sin electrolitos — usar con bebida hidratante',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Sin sabor","Naranja"]'::jsonb),

('Gel PF30 Caffeine 100mg Precision Fuel', 'Precision Fuel PF30 Caffeine Gel 100mg', 'supplements',
 'Precision Hydration', 'gel', 'sachet', 30,
 '1 sachet (30g) — 30g CHO + 100mg cafeína', 333, 0, 83, 0, 0, 83, 10, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Sin sabor"]'::jsonb),

('Barrita PF90 Energy Chew Precision Fuel', 'Precision Fuel PF90 Energy Chew', 'supplements',
 'Precision Hydration', 'chew', 'tablet', 30,
 '1 bolsa masticables (30g) — 30g CHO', 333, 0, 83, 0, 0, 44, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Limon Jengibre"]'::jsonb),

('Gel de Cafeína Gu Vainilla Naranja EU', 'GU Roctane Vanilla Orange Gel EU', 'supplements',
 'GU Energy Labs', 'gel', 'sachet', 32,
 '1 sachet (32g) — 35mg cafeína', 344, 3, 75, 3, 0, 16, 250, 0, 0, 0, 0, 0, 0, 0, 0, 35, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Vanilla Orange","Salted Watermelon","Chocolate Coconut"]'::jsonb),

('Gel Maurten 100 CAF 100 EU', 'Maurten Gel 100 CAF 100 EU', 'supplements',
 'Maurten', 'gel', 'sachet', 40,
 '1 sachet (40g) — 100mg cafeína hidrogel', 250, 0, 62, 0, 0, 26, 140, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Barrita de Arroz Scratch Labs', 'Skratch Labs Anytime Energy Bar', 'supplements',
 'Skratch Labs', 'bar', 'bar', 50,
 '1 barra (50g) — ingredientes reales', 410, 8, 62, 14, 4, 22, 170, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', '', 'internal',
 '["Mantequilla Mani y Miel","Chocolate y Almendra","Manzana Canela","Arándano"]'::jsonb),

('Proteína Rice Cakes GU Choc EU', 'GU Energy Stroopwafel EU', 'supplements',
 'GU Energy Labs', 'bar', 'bar', 32,
 '1 wafel (32g) — carbohidratos y sal', 344, 1, 74, 6, 0, 22, 65, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Caramel Coffee","Chocolate Chip","Wild Berry"]'::jsonb),

('Barrita Multifibra Cereales Overstims Solid 2', 'Overstims Solid 2 Cereal Bar', 'supplements',
 'Overstims', 'bar', 'bar', 60,
 '1 barra (60g) — multifibra endurance', 373, 9, 68, 7, 4, 28, 145, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Frutos del Bosque","Albaricoque Miel","Chocolate Avellana","Coco Limon"]'::jsonb),

('Tabs Electrolitos Nuun Sport Cafeína', 'Nuun Sport + Caffeine Electrolyte Tabs', 'supplements',
 'Nuun', 'tablet', 'tablet', 5,
 '1 tableta en 480ml — 40mg cafeína', 0, 0, 2, 0, 0, 1, 360, 150, 30, 25, 0, 0, 0, 0, 0, 40, 0, 0, 'Na 360mg, K 150mg, Mg 25mg + 40mg cafeína',
 true, true, 'north_america', 'NSF Certified', 'internal',
 '["Wild Berry","Fresh Lime","Cherry Limeade"]'::jsonb),

-- ========== ARGENTINA EXTENDED ==========
('Barrita Advance ProBar Argentina', 'Advance Nutrition ProBar Argentina', 'supplements',
 'Advance Nutrition', 'bar', 'bar', 60,
 '1 barra (60g)', 375, 32, 38, 13, 6, 9, 275, 0, 178, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Dulce de Leche","Vainilla","Mani Caramelo"]'::jsonb),

('Whey Protein ON 100% AR importado', 'Optimum Nutrition Gold Standard Whey AR', 'supplements',
 'Optimum Nutrition', 'powder', 'scoop', 31,
 '1 medida (31g) importado', 390, 74, 10, 5, 0, 4, 580, 0, 161, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', 'Informed Choice certified', 'internal',
 '["Chocolate","Vainilla","Frutilla","Banana Cream"]'::jsonb),

('Cafeína 200mg Scientec Pura', 'Scientec Nutrition Pure Caffeine 200mg', 'supplements',
 'Scientec Nutrition', 'tablet', 'tablet', 1,
 '1 comprimido — 200mg cafeína', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Creatina Creapure ENA Alemana', 'ENA Sport Creapure Creatine', 'supplements',
 'ENA Sport', 'powder', 'scoop', 5,
 '1 medida (5g) — Creapure® alemana grado farmacéutico', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'south_america', 'Creapure® grado farmacéutico', 'internal',
 '["Sin sabor"]'::jsonb),

('Bebida de Recuperación 4:1 ENA Recovery', 'ENA Sport 4:1 Recovery Drink', 'supplements',
 'ENA Sport', 'powder', 'scoop', 60,
 '1 medida (60g) — ratio 4:1 CHO:PRO post-carrera', 375, 20, 72, 2, 1, 28, 360, 120, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 360mg, K 120mg, Mg 10mg — fórmula post-competencia',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla"]'::jsonb),

('Zinc + Cobre Deportivo AR', 'Sport Zinc + Copper AR', 'supplements',
 'Nutremax', 'tablet', 'tablet', 1,
 '1 comprimido — 15mg zinc + 1mg cobre', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Proteína de Suero Argentina Scientec 100%', 'Scientec Nutrition 100% Whey 2nd Edition', 'supplements',
 'Scientec Nutrition', 'powder', 'scoop', 35,
 '1 medida (35g)', 377, 73, 8, 5, 0, 4, 210, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Cafe Moca","Frutilla","Banana"]'::jsonb),

('Gel Infisport Carbogel Cafe Cafeína AR', 'Infisport Carbogel Coffee Caffeine AR', 'supplements',
 'Infisport', 'gel', 'sachet', 37,
 '1 sachet (37g) — 80mg cafeína natural', 270, 0, 67, 0, 0, 22, 195, 80, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 'Na 195mg, K 80mg',
 true, true, 'south_america', '', 'internal',
 '["Cafe Expresso","Cola Cafeína","Naranja Amarga"]'::jsonb),

-- ========== KENYA / EAST AFRICA EXTENDED ==========
('USN B4 Bomb Pre-Workout EA', 'USN B4 Bomb Pre-Workout EA', 'supplements',
 'USN', 'powder', 'scoop', 8,
 '1 medida (8g) — 200mg cafeína + beta-alanina', 0, 0, 5, 0, 0, 4, 150, 0, 0, 0, 0, 0, 0, 0, 0, 200, 1600, 0, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Sandía","Baya Mixta","Naranja Mango","Limon"]'::jsonb),

('Evox Amino Hydrate Electrolyte EA', 'Evox Amino Hydrate Electrolyte Drink EA', 'supplements',
 'Evox', 'powder', 'scoop', 12,
 '1 medida (12g) en 500ml', 0, 0, 3, 0, 0, 1, 420, 160, 0, 28, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 420mg, K 160mg, Mg 28mg',
 true, true, 'east_africa', '', 'internal',
 '["Naranja","Limon","Baya","Tropical"]'::jsonb),

('NPL Beta-Alanine 200g EA', 'NPL Beta-Alanine 200g EA', 'supplements',
 'NPL', 'powder', 'scoop', 5,
 '1 medida (5g) — 4000mg beta-alanina', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4000, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Biogen Omega-3 Fish Oil 1000mg EA', 'Biogen Omega-3 Fish Oil 1000mg EA', 'supplements',
 'Biogen', 'capsule', 'capsule', 2,
 '2 cápsulas — 600mg EPA + DHA', 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

('SSN Whey Protein Chocolate 1kg EA', 'SSN Whey Chocolate 1kg EA', 'supplements',
 'SSN', 'powder', 'scoop', 35,
 '1 medida (35g)', 380, 73, 9, 5, 0, 5, 210, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vainilla","Fresa"]'::jsonb),

('USN Hyperbolic Mass 6kg EA', 'USN Hyperbolic Mass 6kg EA', 'supplements',
 'USN', 'powder', 'scoop', 200,
 '2 medidas (200g) — ganador extremo', 390, 18, 73, 4, 2, 38, 510, 0, 380, 0, 10, 0, 100000, 5, 4, 0, 0, 1000, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa","Platano Caramelo"]'::jsonb),

-- ========== GLOBAL — Electrolytes & Specialty ==========
('Nooma Organic Electrolyte Drink RTD', 'Nooma Organic Electrolyte Drink RTD', 'supplements',
 'Nooma', 'liquid', 'ml', 450,
 '1 botella (450ml) — orgánica, sin azúcar', 0, 0, 1, 0, 0, 0, 490, 320, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 490mg, K 320mg — sin azúcar',
 true, true, 'north_america', '', 'internal',
 '["Limon Lima","Naranja Jengibre","Melocoton","Sandia"]'::jsonb),

('Waterboy After Party Electrolitos', 'Waterboy After-Party Electrolyte Mix', 'supplements',
 'Waterboy', 'powder', 'sachet', 8,
 '1 sachet (8g) en 500ml — post-esfuerzo', 0, 0, 0, 0, 0, 0, 730, 250, 0, 30, 0, 0, 100000, 0, 0, 0, 0, 0, 'Na 730mg, K 250mg, Vit C 90mg',
 true, true, 'north_america', '', 'internal',
 '["Limon Lima","Naranja","Uva"]'::jsonb),

('DripDrop ORS Hydration Mix', 'DripDrop ORS Hydration Mix', 'supplements',
 'DripDrop', 'powder', 'sachet', 10,
 '1 sachet (10g) en 240ml — solución de rehidratación oral', 0, 0, 8, 0, 0, 5, 330, 185, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 330mg, K 185mg — formato médico deportivo',
 true, true, 'global', '', 'internal',
 '["Limon","Naranja","Sandia","Ponche de Frutas"]'::jsonb),

('LMNT Recharge Electrolyte Mix', 'LMNT Recharge Electrolyte Mix', 'supplements',
 'LMNT', 'powder', 'sachet', 6,
 '1 sachet (6g) en 500ml — sin azúcar, alto sodio', 0, 0, 0, 0, 0, 0, 1000, 200, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 1000mg, K 200mg, Mg 60mg — sin azúcar',
 true, true, 'north_america', '', 'internal',
 '["Naranja Sal Marina","Limon Habanero","Frambuesa Sal","Chocolate","Sin Sabor","Raw Unflavoured"]'::jsonb),

('Osmo Nutrition Active Hydration Women', 'Osmo Nutrition Active Hydration Women', 'supplements',
 'Osmo Nutrition', 'powder', 'scoop', 17,
 '1 medida (17g) en 500ml — fórmula femenina', 0, 0, 8, 0, 0, 7, 300, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 300mg, K 100mg — fórmula adapatada mujer atleta',
 true, true, 'north_america', '', 'internal',
 '["Limon","Melocoton","Frambuesa"]'::jsonb),

-- ========== VITAMINAS EXTENDED GLOBAL ==========
('Ferro Sol Hierro + Vitamina C Argentina', 'Ferro Sol Iron + Vitamin C AR', 'supplements',
 'Investi', 'tablet', 'tablet', 1,
 '1 comprimido — 80mg hierro + 200mg Vit C', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 80, 0, 200000, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Supradyn Sport Multivitamínico EU', 'Supradyn Sport Multivitamin EU', 'supplements',
 'Bayer', 'tablet', 'tablet', 1,
 '1 comprimido efervescente — multivitamínico deportivo', 0, 0, 3, 0, 0, 2, 220, 0, 160, 75, 9, 7, 60000, 5, 3, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Frambuesa"]'::jsonb),

('Wellman Sport Multivitamínico UK', 'Wellman Sport Multivitamin UK', 'supplements',
 'Vitabiotics', 'tablet', 'tablet', 3,
 '3 comprimidos diarios — hombre activo', 0, 0, 4, 0, 0, 0, 75, 0, 200, 100, 9, 15, 80000, 10, 2, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Wellwoman Sport Multivitamínico UK', 'Wellwoman Sport Multivitamin UK', 'supplements',
 'Vitabiotics', 'tablet', 'tablet', 3,
 '3 comprimidos diarios — mujer activa', 0, 0, 4, 0, 0, 0, 50, 0, 400, 75, 18, 8, 80000, 10, 6, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Hierro Maltofer Gotas Kenya', 'Maltofer Iron Drops Kenya', 'supplements',
 'Vifor Pharma', 'liquid', 'ml', 1,
 '1ml gotas — 50mg hierro polimaltosa', 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Hierro Tardyferon 80mg EU', 'Tardyferon Prolonged Release Iron 80mg EU', 'supplements',
 'Pierre Fabre', 'tablet', 'tablet', 1,
 '1 comprimido — 80mg hierro sulfato liberación prolongada', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

('D-Pearls 4000 Omega/D3 Pharma Nord', 'Pharma Nord D-Pearls 4000 IU', 'supplements',
 'Pharma Nord', 'capsule', 'capsule', 1,
 '1 cápsula softgel — 4000 UI D3 + aceite oliva', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ========== CREATINE FORMS EXTENDED ==========
('Con-Cret Creatine HCl Capsulas', 'Con-Cret Creatine HCl Capsules', 'supplements',
 'ProLab', 'capsule', 'capsule', 2,
 '2 cápsulas — 750mg HCl creatina, sin retención hídrica', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 750, '',
 true, true, 'north_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Creatina Kre-Alkalyn EFX 750mg', 'Kre-Alkalyn EFX Buffered Creatine', 'supplements',
 'EFX Sports', 'capsule', 'capsule', 2,
 '2 cápsulas — 1500mg creatina tamponada pH 12', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1500, '',
 true, true, 'north_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Creatina Monohidrato Nutremax 300g AR', 'Nutremax Creatine Monohydrate 300g AR', 'supplements',
 'Nutremax', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ========== MISCELLANEOUS — special Argentina/Kenya ==========
('Batido de Proteína Listo Ser Lactovit AR', 'Ser Lactovit Protein Shake RTD AR', 'supplements',
 'Ser (Mastellone)', 'liquid', 'ml', 250,
 '1 botella (250ml) — proteína láctea lista para tomar', 88, 12, 11, 2, 0, 9, 200, 0, 300, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla"]'::jsonb),

('Gel de Energía Enervit Gel Plus AR', 'Enervit Gel Plus Energy AR', 'supplements',
 'Enervit', 'gel', 'sachet', 25,
 '1 sachet (25g) — carbo rápido', 360, 0, 90, 0, 0, 48, 130, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 130mg, K 55mg',
 true, true, 'south_america', '', 'internal',
 '["Naranja","Limon","Cola","Baya"]'::jsonb),

('Bebida Deportiva Gatorade Kenya Botella', 'Gatorade Original Thirst Quencher Kenya', 'supplements',
 'Gatorade (PepsiCo)', 'liquid', 'ml', 600,
 '1 botella (600ml)', 27, 0, 7, 0, 0, 7, 110, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 110mg, K 30mg',
 true, true, 'east_africa', '', 'internal',
 '["Naranja","Limon Lima","Tropical","Uva"]'::jsonb),

('Powerade ION4 Kenya Botella', 'Powerade ION4 Kenya Bottle', 'supplements',
 'Powerade (Coca-Cola)', 'liquid', 'ml', 600,
 '1 botella (600ml)', 27, 0, 7, 0, 0, 7, 100, 35, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 100mg, K 35mg, Ca 2mg, Mg 2mg',
 true, true, 'east_africa', '', 'internal',
 '["Naranja","Limon Lima","Baya Mixta","Uva"]'::jsonb),

('USN Omega-3 Fish Oil 1000mg EA', 'USN Omega-3 Fish Oil 1000mg EA', 'supplements',
 'USN', 'capsule', 'capsule', 2,
 '2 cápsulas — 600mg EPA + DHA', 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Sin sabor"]'::jsonb),

('Recover 360 SiS Powder EU', 'SiS Recover 360 Powder EU', 'supplements',
 'Science in Sport', 'powder', 'scoop', 50,
 '1 medida (50g) — recuperación con electrolitos', 382, 40, 48, 4, 2, 16, 420, 150, 155, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 420mg, K 150mg — recuperación con electrolitos',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa"]'::jsonb)

ON CONFLICT DO NOTHING;
