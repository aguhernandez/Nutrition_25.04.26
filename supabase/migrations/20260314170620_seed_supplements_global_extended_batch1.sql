/*
  # Supplements - Global Extended Batch 1
  More North America, more EU, iron/vitamin supplements, recovery drinks
  Brands: Clif, SiS, Precision Hydration, Gatorade, Powerbar, Naturo,
  Thorne, Athletic Greens/AG1, Spring Energy, Muir Energy, Secret Training
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
-- THORNE (NA — alto rendimiento)
-- ==============================
('Hierro Bisglicinato Thorne', 'Thorne Iron Bisglycinate', 'supplements',
 'Thorne', 'capsule', 'capsule', 1,
 '1 cápsula — 25mg hierro bisglicinato quelado', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', 'NSF Certified for Sport', 'internal',
 '["Sin sabor"]'::jsonb),

('Vitamina D3/K2 Thorne', 'Thorne Vitamin D3/K2 Liquid', 'supplements',
 'Thorne', 'liquid', 'ml', 0.25,
 '1 gota (0.25ml) — 1000 UI D3 + 200mcg K2', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, '',
 true, true, 'north_america', 'NSF Certified for Sport', 'internal',
 '["Natural sabor cítrico"]'::jsonb),

('Vitamina B12 1mg Thorne', 'Thorne Vitamin B12 1mg', 'supplements',
 'Thorne', 'tablet', 'tablet', 1,
 '1 comprimido masticable — 1000mcg B12 metilcobalamina', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, '',
 true, true, 'north_america', 'NSF Certified for Sport', 'internal',
 '["Cherry","Natural"]'::jsonb),

('Magnesio Malato Thorne', 'Thorne Magnesium Malate', 'supplements',
 'Thorne', 'capsule', 'capsule', 3,
 '3 cápsulas — 300mg magnesio malato', 0, 0, 0, 0, 0, 0, 0, 0, 0, 300, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', 'NSF Certified for Sport', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- SPRING ENERGY (EUA — gel natural)
-- ==============================
('Gel de Energía Spring Speednut', 'Spring Energy Speednut Gel', 'supplements',
 'Spring Energy', 'gel', 'sachet', 45,
 '1 sachet (45g) — base comida real', 302, 5, 44, 12, 3, 14, 80, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 80mg, K 85mg',
 true, true, 'north_america', '', 'internal',
 '["Mantequilla Mani Miel","Almond Og","Cinnamon Apple"]'::jsonb),

('Gel Triple Berry Spring Energy', 'Spring Energy Triple Berry Gel', 'supplements',
 'Spring Energy', 'gel', 'sachet', 45,
 '1 sachet (45g) — fruta real', 302, 3, 70, 1, 4, 30, 90, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 90mg, K 120mg',
 true, true, 'north_america', '', 'internal',
 '["Arándanos Frambuesas Fresas","Cereza","Sandía"]'::jsonb),

-- ==============================
-- MUIR ENERGY (EUA — gel natural triatlón)
-- ==============================
('Gel Muir Energy Caffeinated', 'Muir Energy Caffeinated Gel', 'supplements',
 'Muir Energy', 'gel', 'sachet', 47,
 '1 sachet (47g) — 100mg cafeína natural', 266, 2, 62, 3, 2, 28, 95, 75, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 'Na 95mg, K 75mg',
 true, true, 'north_america', '', 'internal',
 '["Cafe y Coco","Chocolate Oscuro Naranja","Matcha Limon"]'::jsonb),

-- ==============================
-- SECRET TRAINING (UK — cycling/triathlon)
-- ==============================
('Gel de Energía Secret Training', 'Secret Training Energy Gel', 'supplements',
 'Secret Training', 'gel', 'sachet', 40,
 '1 sachet (40g)', 263, 0, 66, 0, 0, 25, 165, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 165mg, K 70mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Cereza Mentolada","Maracuya","Cola con Cafeína 80mg"]'::jsonb),

-- ==============================
-- TORQ NUTRITION (UK)
-- ==============================
('Gel de Energía TORQ Fitness', 'TORQ Energy Gel', 'supplements',
 'TORQ Nutrition', 'gel', 'sachet', 45,
 '1 sachet (45g) — 2:1 glucosa:fructosa', 222, 0, 56, 0, 0, 30, 70, 105, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 70mg, K 105mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Baya Mixta","Naranja y Fruta de la Pasion","Mango y Maracuya","Apple Crumble","Limon y Jengibre"]'::jsonb),

('Bebida TORQ en Polvo 500g', 'TORQ Energy Powder 500g', 'supplements',
 'TORQ Nutrition', 'powder', 'scoop', 45,
 '1 medida (45g) en 500ml', 373, 0, 93, 0, 0, 36, 280, 130, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 280mg, K 130mg — ratio 2:1',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Baya","Mango"]'::jsonb),

-- ==============================
-- PRECISION HYDRATION (Global extended)
-- ==============================
('Precision Hydration PH 250 Tableta', 'Precision Hydration PH 250 Tablet', 'supplements',
 'Precision Hydration', 'tablet', 'tablet', 4,
 '1 tableta en 500ml — bajo sodio', 0, 0, 0, 0, 0, 0, 125, 100, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 125mg, K 100mg, Ca 10mg',
 true, true, 'global', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Sandía"]'::jsonb),

('Precision Hydration PH 1500 Tableta', 'Precision Hydration PH 1500 Tablet', 'supplements',
 'Precision Hydration', 'tablet', 'tablet', 4,
 '1 tableta en 500ml — muy alto sodio (sudadores intensos)', 0, 0, 0, 0, 0, 0, 750, 150, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 750mg, K 150mg, Mg 30mg — para calor extremo',
 true, true, 'global', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Mango"]'::jsonb),

('Polvo de Bebida Electrolítica PH 1000', 'Precision Hydration PH 1000 Powder', 'supplements',
 'Precision Hydration', 'powder', 'sachet', 12,
 '1 sachet (12g) en 500ml', 0, 0, 0, 0, 0, 0, 500, 150, 30, 25, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 500mg, K 150mg, Ca 30mg, Mg 25mg',
 true, true, 'global', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Sandía","Natural"]'::jsonb),

-- ==============================
-- CRANK SPORTS / E-GEL (USA)
-- ==============================
('E-Gel Electrolyte Energy Gel', 'E-Gel Electrolyte Energy Gel', 'supplements',
 'Crank Sports', 'gel', 'sachet', 35,
 '1 sachet (35g) — alto electrolitos', 229, 0, 57, 0, 0, 18, 230, 85, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 'Na 230mg, K 85mg — sin agua requerida',
 true, true, 'north_america', '', 'internal',
 '["Naranja","Limon","Baya Mixta","Uva","Sandía"]'::jsonb),

-- ==============================
-- FISIOCREM / VICTORY ENDURANCE (España extendida)
-- ==============================
('Gel Energético Victory Endurance', 'Victory Endurance Energy Gel', 'supplements',
 'Victory Endurance', 'gel', 'sachet', 35,
 '1 sachet (35g)', 271, 0, 68, 0, 0, 22, 160, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 160mg, K 55mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Cola","Baya Acai","Fresa","Tropical con Cafeína 80mg"]'::jsonb),

('Bebida Hidratante Victory Endurance', 'Victory Endurance Hydration Drink', 'supplements',
 'Victory Endurance', 'powder', 'scoop', 38,
 '1 medida (38g) en 500ml', 371, 0, 92, 0, 0, 40, 355, 148, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 355mg, K 148mg, Mg 14mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Baya","Tropical"]'::jsonb),

-- ==============================
-- CLIF EXTENDED (NA/Global)
-- ==============================
('Clif Bloks Energy Chews', 'Clif Bloks Energy Chews', 'supplements',
 'Clif Bar', 'chew', 'tablet', 33,
 '3 masticables (33g) = 1 serving — 24g CHO', 364, 0, 91, 0, 0, 25, 100, 70, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 'Na 100mg, K 70mg',
 true, true, 'north_america', '', 'internal',
 '["Naranja","Fresa","Sandía","Mountainberry","Black Cherry con Cafeína 25mg"]'::jsonb),

('Clif Bar Minis 28g', 'Clif Bar Minis 28g', 'supplements',
 'Clif Bar', 'bar', 'bar', 28,
 '1 barrita mini (28g)', 371, 10, 68, 7, 5, 25, 85, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', '', 'internal',
 '["Chocolate Chip","Oatmeal Raisin","White Choc Macadamia"]'::jsonb),

-- ==============================
-- HUMA GEL (USA — natural)
-- ==============================
('Huma Gel Plus Energía con Cafeína', 'Huma Gel Plus Caffeinated', 'supplements',
 'Huma Gel', 'gel', 'sachet', 43,
 '1 sachet (43g) — 25mg cafeína natural de café', 261, 2, 64, 0, 1, 24, 75, 55, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 'Na 75mg, K 55mg',
 true, true, 'north_america', '', 'internal',
 '["Café Expresso","Fresas y Bananas","Mango","Frambuesa"]'::jsonb),

-- ==============================
-- VELOFORTE (UK — natural)
-- ==============================
('Gel Natural Veloforte Nova', 'Veloforte Nova Natural Gel', 'supplements',
 'Veloforte', 'gel', 'sachet', 33,
 '1 sachet (33g) — comida real, 50mg cafeína', 333, 0, 79, 2, 1, 44, 20, 80, 0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 'Na 20mg, K 80mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Espresso Almendra","Cítricos","Limon Miel","Chocolate Datil"]'::jsonb),

('Barrita Natural Veloforte Di Bosco', 'Veloforte Di Bosco Energy Bar', 'supplements',
 'Veloforte', 'bar', 'bar', 62,
 '1 barrita (62g) — sin gluten, sin lácteos', 421, 4, 70, 12, 6, 58, 15, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Frutos del Bosque","Almendra Albaricoque","Datil Coco","Arándano Avellana"]'::jsonb),

-- ==============================
-- AG1 / ATHLETIC GREENS (Global)
-- ==============================
('AG1 Athletic Greens Travel Sachet', 'AG1 Athletic Greens Daily Supplement', 'supplements',
 'AG1 Athletic Greens', 'powder', 'sachet', 12,
 '1 sachet (12g) — multivitamínico de espirulina y verdes', 0, 8, 5, 1, 1, 2, 0, 0, 200, 100, 9, 15, 100000, 25, 10, 0, 0, 0, '',
 true, true, 'global', 'NSF Certified for Sport', 'internal',
 '["Natural Piña Vainilla"]'::jsonb),

-- ==============================
-- GARDEN OF LIFE EXTENDED
-- ==============================
('Mykind Organics Hierro 18mg', 'Garden of Life mykind Iron 18mg', 'supplements',
 'Garden of Life', 'tablet', 'tablet', 1,
 '1 comprimido — 18mg hierro alimentario + Vit C + B12', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 18, 0, 45000, 0, 4, 0, 0, 0, '',
 true, true, 'north_america', 'NSF Certified for Sport', 'internal',
 '["Sin sabor"]'::jsonb),

('Vitamin Code Vitamina D3 5000 UI', 'Garden of Life Vitamin Code D3 5000 IU', 'supplements',
 'Garden of Life', 'capsule', 'capsule', 1,
 '1 cápsula — 5000 UI D3 (125mcg)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 125, 0, 0, 0, 0, '',
 true, true, 'north_america', 'NSF Certified for Sport', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- NOW SPORTS EXTENDED
-- ==============================
('Now Iron Double Strength 36mg', 'NOW Iron Double Strength 36mg', 'supplements',
 'NOW Foods', 'tablet', 'tablet', 1,
 '1 comprimido — 36mg hierro bisglicinato', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Now Vitamina C-1000 Sustained Release', 'NOW Vitamin C-1000 Sustained Release', 'supplements',
 'NOW Foods', 'tablet', 'tablet', 2,
 '2 comprimidos liberación sostenida — 1000mg C + 500mg bioflavonoides', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100000, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Now Zinc Gluconate 50mg', 'NOW Zinc Gluconate 50mg', 'supplements',
 'NOW Foods', 'tablet', 'tablet', 1,
 '1 comprimido — 50mg zinc gluconato', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- ELITE (Italia — ciclismo)
-- ==============================
('Gel de Energía Elite Carbosnack', 'Elite Carbosnack Energy Gel', 'supplements',
 'Elite', 'gel', 'sachet', 25,
 '1 sachet (25g)', 400, 0, 100, 0, 0, 50, 20, 50, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 'Na 20mg, K 50mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Baya","Cola con Cafeína"]'::jsonb),

-- ==============================
-- 226ERS (España — triatlón)
-- ==============================
('High Energy Gel 226ERS', '226ERS High Energy Gel', 'supplements',
 '226ERS', 'gel', 'sachet', 76,
 '1 sachet (76g) — 60g CHO, doble porción', 263, 0, 66, 0, 0, 23, 177, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 177mg, K 70mg',
 true, true, 'europe', '', 'internal',
 '["Limon","Naranja","Cola","Baya Acai","Piña Coco"]'::jsonb),

('SUB9 Gel 226ERS con Cafeína', '226ERS SUB9 Gel with Caffeine', 'supplements',
 '226ERS', 'gel', 'sachet', 30,
 '1 sachet (30g) — 75mg cafeína', 333, 0, 83, 0, 0, 28, 190, 80, 0, 0, 0, 0, 0, 0, 0, 75, 0, 0, 'Na 190mg, K 80mg',
 true, true, 'europe', '', 'internal',
 '["Cola","Cafe Negro","Limon Menta","Naranja Cafeína"]'::jsonb),

('Bebida Isotónica 226ERS en Polvo', '226ERS Isotonic Drink Mix', 'supplements',
 '226ERS', 'powder', 'scoop', 41,
 '1 medida (41g) en 500ml', 370, 0, 92, 0, 0, 38, 360, 150, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 360mg, K 150mg, Mg 14mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Baya","Tropical","Sin Sabor"]'::jsonb),

('Barrita Sub9 226ERS', '226ERS SUB9 Energy Bar', 'supplements',
 '226ERS', 'bar', 'bar', 50,
 '1 barra (50g) — 35g CHO', 380, 5, 70, 8, 3, 28, 160, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Platano Chocolate","Datil Coco","Limon Jengibre","Fresa Yogur"]'::jsonb)

ON CONFLICT DO NOTHING;
