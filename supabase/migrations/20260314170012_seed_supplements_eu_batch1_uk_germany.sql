/*
  # Supplements - Europe Batch 1: UK & Germany brands
  Full label detail. All nutrients per 100g; serving_size_g = label serving.
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
-- MYPROTEIN (UK) — extended
-- ==============================
('Proteína Total', 'Total Protein', 'supplements',
 'Myprotein', 'powder', 'scoop', 30,
 '1 scoop (30g)', 370, 79, 4, 4, 0, 3, 200, 0, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate Natural","Vainilla","Fresa","Caramelo Salado","Platano"]'::jsonb),

('Proteína Clear Whey Isolate', 'Clear Whey Isolate', 'supplements',
 'Myprotein', 'powder', 'scoop', 20,
 '1 scoop (20g) — bebida clara tipo jugo', 375, 88, 2, 0, 0, 2, 95, 0, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja Mango","Sandía","Pomelo Rosa","Limon Lima","Melocoton"]'::jsonb),

('Proteína All-In-One', 'All-In-One Protein', 'supplements',
 'Myprotein', 'powder', 'scoop', 60,
 '1 scoop (60g)', 355, 42, 33, 7, 3, 10, 330, 0, 150, 30, 0, 5, 0, 0, 0, 0, 0, 1500, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa"]'::jsonb),

('Barrita de Proteína Layered', 'Layered Protein Bar', 'supplements',
 'Myprotein', 'bar', 'bar', 60,
 '1 barra (60g)', 375, 32, 35, 14, 5, 10, 270, 0, 190, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Caramelo Chocolate","Donut de Coco","Melocoton Caramelo","Frambuesa Jelly"]'::jsonb),

('Gel de Energía para Ciclismo', 'Cyclone Energy Gel', 'supplements',
 'Myprotein', 'gel', 'sachet', 50,
 '1 sachet (50g)', 260, 0, 63, 0, 0, 22, 180, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 180mg, K 90mg per sachet',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Limon","Naranja","Baya","Tropical"]'::jsonb),

('Tableta de Cafeína 200mg', 'Caffeine 200mg Tablet', 'supplements',
 'Myprotein', 'tablet', 'tablet', 1,
 '1 comprimido — 200mg cafeína anhidra', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Sin sabor"]'::jsonb),

('Beta-Alanina en Polvo', 'Beta-Alanine Powder', 'supplements',
 'Myprotein', 'powder', 'scoop', 4,
 '1 scoop (4g) — 3600mg beta-alanina', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3600, 0, '',
 true, true, 'europe', 'Informed Sport certified — CarnoSyn®', 'internal',
 '["Sin sabor"]'::jsonb),

('Vitamina D3 3000 UI', 'Vitamin D3 3000 IU', 'supplements',
 'Myprotein', 'capsule', 'capsule', 1,
 '1 cápsula — 75mcg D3', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 75, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Sin sabor"]'::jsonb),

('Vitamina B12 1000mcg', 'Vitamin B12 1000mcg', 'supplements',
 'Myprotein', 'tablet', 'tablet', 1,
 '1 comprimido sublingual — 1000mcg B12', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Sin sabor"]'::jsonb),

('Magnesio Bisglicinato 375mg', 'Magnesium Bisglycinate 375mg', 'supplements',
 'Myprotein', 'tablet', 'tablet', 2,
 '2 comprimidos — 375mg magnesio', 0, 0, 0, 0, 0, 0, 0, 0, 0, 375, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Sin sabor"]'::jsonb),

('Zinc 15mg', 'Zinc 15mg', 'supplements',
 'Myprotein', 'tablet', 'tablet', 1,
 '1 comprimido — 15mg zinc', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Sin sabor"]'::jsonb),

('Tabletas de Electrolitos Myprotein', 'Electrolyte Tablets', 'supplements',
 'Myprotein', 'tablet', 'tablet', 3,
 '3 comprimidos efervescentes en 500ml', 0, 0, 3, 0, 0, 1, 420, 200, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 420mg, K 200mg, Mg 32mg per serving',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Baya Mixta"]'::jsonb),

('Polvo de Bebida Hidratante', 'Hydration Drink Powder', 'supplements',
 'Myprotein', 'powder', 'scoop', 7,
 '1 scoop (7g) en 500ml', 0, 0, 1, 0, 0, 0, 350, 150, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 350mg, K 150mg, Mg 25mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Limon Lima","Sandía","Mango"]'::jsonb),

-- ==============================
-- BULK POWDERS (UK)
-- ==============================
('Proteína Whey Concentrada', 'Pure Whey Protein', 'supplements',
 'Bulk Powders', 'powder', 'scoop', 30,
 '1 scoop (30g)', 388, 82, 5, 5, 0, 4, 160, 0, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate Puro","Vainilla","Fresa y Nata","Cafe","Sin Sabor","Galletas"]'::jsonb),

('Proteína Whey Isolada 97%', 'Whey Isolate 97', 'supplements',
 'Bulk Powders', 'powder', 'scoop', 25,
 '1 scoop (25g)', 396, 93, 0, 1, 0, 0, 110, 0, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Sin Sabor","Chocolate","Vainilla","Fresa"]'::jsonb),

('Creatina Monohidrato Pura', 'Pure Creatine Monohydrate', 'supplements',
 'Bulk Powders', 'powder', 'scoop', 5,
 '1 scoop (5g) — 5g creatina monohidrato', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Sin Sabor"]'::jsonb),

('Pre-Entreno Elevate', 'Pre-Workout Elevate', 'supplements',
 'Bulk Powders', 'powder', 'scoop', 10,
 '1 scoop (10g)', 0, 0, 3, 0, 0, 1, 200, 0, 0, 0, 0, 0, 0, 0, 0, 200, 2000, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Lima","Baya","Sandía"]'::jsonb),

('Barrita Macro Munch Whey', 'Macro Munch Whey Bar', 'supplements',
 'Bulk Powders', 'bar', 'bar', 62,
 '1 barra (62g)', 380, 30, 37, 13, 7, 9, 300, 0, 180, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Caramelo y Galleta","Doble Chocolate","Platano Split","Roca Rocosa"]'::jsonb),

('Electrolitos en Polvo', 'Complete Electrolytes Powder', 'supplements',
 'Bulk Powders', 'powder', 'scoop', 6,
 '1 scoop (6g) en 500ml', 0, 0, 2, 0, 0, 1, 380, 175, 0, 28, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 380mg, K 175mg, Mg 28mg, Ca 90mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Baya Acai","Sin Sabor"]'::jsonb),

('Vitamina C con Zinc 1000mg', 'Vitamin C with Zinc 1000mg', 'supplements',
 'Bulk Powders', 'tablet', 'tablet', 2,
 '2 comprimidos — 1000mg Vit C + 10mg Zinc', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 100000, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- OPTIMUM NUTRITION (UK/EU)
-- ==============================
('Serious Mass Ganador', 'Serious Mass Gainer', 'supplements',
 'Optimum Nutrition', 'powder', 'scoop', 334,
 '1 serving (334g) — fórmula de volumen', 388, 16, 73, 4, 3, 22, 490, 0, 310, 0, 9, 0, 100000, 5, 6, 0, 0, 0, '',
 true, true, 'europe', 'Informed Choice certified', 'internal',
 '["Chocolate","Vainilla","Fresas con Nata","Platano"]'::jsonb),

('Proteína Whey Gold Standard doble chocolate', 'Gold Standard Whey Double Chocolate EU', 'supplements',
 'Optimum Nutrition', 'powder', 'scoop', 31,
 '1 scoop (31g)', 390, 74, 10, 5, 0, 4, 580, 0, 161, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Choice certified', 'internal',
 '["Doble Chocolate","Vainilla","Fresa Platano","Extreme Milk Chocolate"]'::jsonb),

('Tabletas de Hierro con Vitamina C', 'Iron with Vitamin C Tablets', 'supplements',
 'Optimum Nutrition', 'tablet', 'tablet', 1,
 '1 comprimido — 14mg hierro + 80mg Vit C', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 80000, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- PROZIS (Portugal/Europa)
-- ==============================
('Concentrado de Proteína de Suero', 'Whey Protein Concentrate', 'supplements',
 'Prozis', 'powder', 'scoop', 30,
 '1 scoop (30g)', 380, 75, 8, 5, 0, 3, 180, 0, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Caramelo","Natural","Cafe Mocca"]'::jsonb),

('Isolado de Proteína de Suero', 'Whey Protein Isolate', 'supplements',
 'Prozis', 'powder', 'scoop', 30,
 '1 scoop (30g)', 393, 87, 2, 1, 0, 1, 180, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Sin Sabor"]'::jsonb),

('Proteína Vegana 100%', 'Vegan Protein 100%', 'supplements',
 'Prozis', 'powder', 'scoop', 30,
 '1 scoop (30g)', 377, 73, 6, 5, 3, 2, 250, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Cafe","Neutro"]'::jsonb),

('Creatina Monohidrato Prozis', 'Creatine Monohydrate Prozis', 'supplements',
 'Prozis', 'powder', 'scoop', 5,
 '1 scoop (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Gel de Energía con Cafeína', 'Energy Gel with Caffeine', 'supplements',
 'Prozis', 'gel', 'sachet', 40,
 '1 sachet (40g) — 75mg cafeína', 275, 0, 68, 0, 0, 22, 160, 50, 0, 0, 0, 0, 0, 0, 0, 75, 0, 0, 'Na 160mg, K 50mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Cola","Baya"]'::jsonb),

-- ==============================
-- FOODSPRING (Alemania)
-- ==============================
('Proteína Whey Foodspring', 'Whey Protein Foodspring', 'supplements',
 'Foodspring', 'powder', 'scoop', 30,
 '1 scoop (30g)', 400, 80, 7, 5, 0, 4, 170, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Cookie Dough","Cafe Caramelo"]'::jsonb),

('Proteína Vegetal Foodspring', 'Vegan Protein Foodspring', 'supplements',
 'Foodspring', 'powder', 'scoop', 30,
 '1 scoop (30g)', 370, 70, 10, 6, 4, 3, 230, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Avellana","Mango Maracuya"]'::jsonb),

('Barrita Proteína Foodspring', 'Protein Bar Foodspring', 'supplements',
 'Foodspring', 'bar', 'bar', 60,
 '1 barra (60g)', 367, 32, 37, 12, 9, 6, 250, 0, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate Negro","Cacahuete","Coco Chocolate","Cheesecake Fruta"]'::jsonb),

('Creatina Creapure Foodspring', 'Creatine Creapure Foodspring', 'supplements',
 'Foodspring', 'powder', 'scoop', 5,
 '1 scoop (5g) — Creapure®', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'europe', 'Creapure® grado farmacéutico', 'internal',
 '["Sin sabor"]'::jsonb),

('Shape Shake 2.0 Proteína y Fibra', 'Shape Shake 2.0 Protein & Fiber', 'supplements',
 'Foodspring', 'powder', 'scoop', 60,
 '1 serving (60g)', 357, 45, 38, 7, 8, 10, 280, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Coco Chocolate"]'::jsonb),

-- ==============================
-- WEIDER (Alemania/Europa)
-- ==============================
('Whey Protein Weider', 'Whey Protein Weider', 'supplements',
 'Weider', 'powder', 'scoop', 35,
 '1 scoop (35g)', 371, 74, 6, 6, 0, 4, 210, 0, 130, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Platano Caramelo","Galleta"]'::jsonb),

('Creatina Pura Weider', 'Pure Creatine Weider', 'supplements',
 'Weider', 'powder', 'scoop', 5,
 '1 scoop (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Barrita Energética Weider Endurance', 'Weider Endurance Bar', 'supplements',
 'Weider', 'bar', 'bar', 50,
 '1 barra (50g)', 380, 8, 72, 5, 3, 30, 100, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 100mg, K 120mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Baya Roja","Manzana"]'::jsonb),

('Gel Energético Weider 100%', 'Weider 100% Energy Gel', 'supplements',
 'Weider', 'gel', 'sachet', 35,
 '1 sachet (35g)', 280, 0, 70, 0, 0, 20, 190, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 190mg, K 80mg',
 true, true, 'europe', '', 'internal',
 '["Cola","Naranja","Limon","Platano"]'::jsonb),

-- ==============================
-- SCITEC NUTRITION (Hungría/EU)
-- ==============================
('100% Whey Professional Scitec', '100% Whey Professional', 'supplements',
 'Scitec Nutrition', 'powder', 'scoop', 30,
 '1 scoop (30g)', 387, 73, 6, 7, 0, 5, 250, 0, 130, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate Rico","Vainilla","Mantequilla de Mani","Cookies y Nata","Matcha"]'::jsonb),

('100% Whey Isolate Scitec', '100% Whey Isolate Scitec', 'supplements',
 'Scitec Nutrition', 'powder', 'scoop', 30,
 '1 scoop (30g)', 393, 87, 2, 1, 0, 1, 180, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Sin Sabor"]'::jsonb),

('Proteína Vegetal Scitec', 'Plant Protein Scitec', 'supplements',
 'Scitec Nutrition', 'powder', 'scoop', 35,
 '1 scoop (35g)', 360, 62, 20, 6, 5, 5, 290, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Sin Sabor"]'::jsonb),

('Barrita Protein Bar Deluxe Scitec', 'Protein Bar Deluxe Scitec', 'supplements',
 'Scitec Nutrition', 'bar', 'bar', 65,
 '1 barra (65g)', 385, 38, 33, 15, 5, 8, 290, 0, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Caramelo Chocolate","Vainilla","Cheesecake de Fresa","Double Choc"]'::jsonb),

('Creatina Monohidrato Scitec', 'Creatine Monohydrate Scitec', 'supplements',
 'Scitec Nutrition', 'powder', 'scoop', 5,
 '1 scoop (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- BIOTECH USA (Hungría/EU)
-- ==============================
('Whey Zero BioTech', 'Whey Zero BioTech', 'supplements',
 'BioTech USA', 'powder', 'scoop', 25,
 '1 scoop (25g)', 372, 79, 3, 5, 0, 2, 220, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Platano","Churros"]'::jsonb),

('Proteína Iso Whey Zero BioTech', 'Iso Whey Zero BioTech', 'supplements',
 'BioTech USA', 'powder', 'scoop', 25,
 '1 scoop (25g) — sin lactosa, sin gluten', 388, 86, 1, 1, 0, 1, 150, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Mantequilla Cacahuete","Chocolate Blanco","Cereza"]'::jsonb),

('Barrita Nitro-X BioTech', 'Nitro-X Protein Bar BioTech', 'supplements',
 'BioTech USA', 'bar', 'bar', 55,
 '1 barra (55g)', 380, 36, 35, 13, 6, 8, 280, 0, 180, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Caramelo","Cookies","Vainilla Nougat"]'::jsonb),

('Pre-Workout Shot BioTech', 'Pre-Workout Shot BioTech', 'supplements',
 'BioTech USA', 'liquid', 'ml', 60,
 '1 shot (60ml) — 150mg cafeína', 0, 0, 5, 0, 0, 5, 100, 0, 0, 0, 0, 0, 0, 0, 0, 150, 1600, 0, '',
 true, true, 'europe', '', 'internal',
 '["Naranja","Baya","Tropical","Cereza"]'::jsonb)

ON CONFLICT DO NOTHING;
