/*
  # Supplements - Global Extended Batch 3
  More plant proteins, recovery, more Argentina brands, EU brands, more EA brands
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
-- VEGA (Canadá — plant protein)
-- ==============================
('Proteína Sport Vega 30g', 'Vega Sport Premium Protein', 'supplements',
 'Vega', 'powder', 'scoop', 41,
 '1 medida (41g)', 376, 63, 15, 7, 5, 5, 410, 0, 150, 0, 8, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', 'NSF Certified for Sport', 'internal',
 '["Chocolate Proteína","Vainilla","Mocha","Baya","Berry"]'::jsonb),

('Vega One Nutritional Shake', 'Vega One All-in-One Nutritional Shake', 'supplements',
 'Vega', 'powder', 'scoop', 41,
 '1 medida (41g) — todo en uno vegano', 366, 51, 24, 8, 10, 7, 280, 0, 200, 0, 9, 0, 100000, 10, 4, 0, 0, 0, '',
 true, true, 'north_america', '', 'internal',
 '["Chocolate Oscuro","Vainilla","Baya Mixta","Mocha","Natural"]'::jsonb),

-- ==============================
-- HEMP YEAH! (NA plant)
-- ==============================
('Manitoba Harvest Hemp Yeah Protein', 'Manitoba Harvest Hemp Yeah! Protein', 'supplements',
 'Manitoba Harvest', 'powder', 'scoop', 30,
 '1 medida (30g) — proteína de cáñamo', 350, 47, 20, 9, 9, 4, 0, 0, 0, 250, 3, 3, 0, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', '', 'internal',
 '["Sin Sabor","Chocolate","Vainilla","Baya Açaí"]'::jsonb),

-- ==============================
-- NATURYA (UK — superfoods)
-- ==============================
('Proteína de Cáñamo Orgánica Naturya', 'Naturya Organic Hemp Protein', 'supplements',
 'Naturya', 'powder', 'scoop', 30,
 '1 medida (30g)', 350, 47, 17, 12, 12, 1, 0, 0, 0, 200, 3, 4, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Sin Sabor"]'::jsonb),

-- ==============================
-- FORM NUTRITION (UK — vegan)
-- ==============================
('Proteína Performance Form Nutrition', 'Form Nutrition Performance Protein', 'supplements',
 'Form Nutrition', 'powder', 'scoop', 35,
 '1 medida (35g) — guisante + arroz + calabaza', 371, 69, 11, 7, 5, 3, 310, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate Salted Caramel","Vainilla Dreamy","Matcha y Menta","Baya Mixta"]'::jsonb),

-- ==============================
-- WARRIOR (UK)
-- ==============================
('Proteína Whey Warrior Blend', 'Warrior Blend Whey Protein', 'supplements',
 'Warrior Supplements', 'powder', 'scoop', 35,
 '1 medida (35g)', 377, 74, 7, 5, 0, 4, 200, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate Cremoso","Vainilla","Fresa","Cookies","Caramelo Salado","Platano Split"]'::jsonb),

('Barrita Warrior Crunch', 'Warrior Crunch Protein Bar', 'supplements',
 'Warrior Supplements', 'bar', 'bar', 64,
 '1 barra (64g)', 375, 34, 34, 13, 8, 4, 260, 0, 185, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate Caramel","White Choc Raspberry","Chocolate Mint","Chocolate Orange","Birthday Cake"]'::jsonb),

-- ==============================
-- PROTEIN WORKS (UK)
-- ==============================
('Proteína Whey Protein Works 80', 'Protein Works Whey 80 Protein', 'supplements',
 'The Protein Works', 'powder', 'scoop', 30,
 '1 medida (30g)', 387, 80, 7, 4, 0, 3, 175, 0, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate Suave","Vainilla Cremosa","Fresa","Moca Cafe","Caramelo Salado","Sin Sabor"]'::jsonb),

('Clear Whey Isolate Protein Works', 'The Protein Works Clear Whey Isolate', 'supplements',
 'The Protein Works', 'powder', 'scoop', 21,
 '1 medida (21g) — bebida clara tipo refresco', 381, 90, 2, 0, 0, 2, 100, 0, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Limon Lima","Naranja Tropical","Sandía","Pomelo Rosa","Mango Maracuya"]'::jsonb),

-- ==============================
-- REFLEX NUTRITION (UK)
-- ==============================
('Proteína Instant Whey Reflex', 'Reflex Nutrition Instant Whey Pro', 'supplements',
 'Reflex Nutrition', 'powder', 'scoop', 25,
 '1 medida (25g)', 380, 76, 8, 5, 0, 4, 165, 0, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Plátano","Sin Sabor","Caramel Toffee"]'::jsonb),

-- ==============================
-- ZERO NUTRITION (España)
-- ==============================
('Zero Whey Protein España', 'Zero Whey Protein Spain', 'supplements',
 'Zero Nutrition', 'powder', 'scoop', 30,
 '1 medida (30g)', 387, 80, 5, 5, 0, 3, 180, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Cookie","Natural"]'::jsonb),

-- ==============================
-- VITOBEST (España)
-- ==============================
('Whey Protein Vitobest 100%', 'Vitobest 100% Whey Protein', 'supplements',
 'Vitobest', 'powder', 'scoop', 33,
 '1 medida (33g)', 383, 76, 7, 5, 0, 4, 185, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Cookie Crunch","Platano","Moka"]'::jsonb),

('Proteína Isolada Vitobest CFM', 'Vitobest CFM Isolate Protein', 'supplements',
 'Vitobest', 'powder', 'scoop', 30,
 '1 medida (30g)', 400, 90, 1, 1, 0, 1, 130, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Sin Sabor","Cafe"]'::jsonb),

-- ==============================
-- AMIX NUTRITION (República Checa/EU)
-- ==============================
('Proteína Whey Core Amix 100%', 'Amix Core Whey 100%', 'supplements',
 'Amix Nutrition', 'powder', 'scoop', 30,
 '1 medida (30g)', 382, 75, 7, 5, 0, 4, 200, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Cafe Moca","Platano Split","Cookies"]'::jsonb),

('Creatina Monohidrato Amix', 'Amix Creatine Monohydrate', 'supplements',
 'Amix Nutrition', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- PEAK NUTRITION (Alemania)
-- ==============================
('Proteína Whey Peak 100%', 'Peak Performance Whey 100%', 'supplements',
 'Peak Nutrition', 'powder', 'scoop', 30,
 '1 medida (30g)', 390, 80, 6, 5, 0, 3, 190, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Cafe","Sin Sabor"]'::jsonb),

-- ==============================
-- BORN SPORTS (Holanda — triatlón/ciclismo)
-- ==============================
('Gel Energético Born Sports', 'Born Sports Energy Gel', 'supplements',
 'Born Sports', 'gel', 'sachet', 40,
 '1 sachet (40g)', 225, 0, 56, 0, 0, 20, 195, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 195mg, K 85mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Cola","Tropicales"]'::jsonb),

('Bebida Born Sports OTE Race Day', 'Born Sports Race Day Drink Mix', 'supplements',
 'Born Sports', 'powder', 'scoop', 70,
 '1 medida (70g) en 750ml', 371, 0, 92, 0, 0, 36, 510, 210, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 510mg, K 210mg, Mg 22mg — alto sodio competencia',
 true, true, 'europe', '', 'internal',
 '["Limon","Naranja","Baya","Sin Sabor"]'::jsonb),

-- ==============================
-- CANIBAL (España — específico)
-- ==============================
('Proteína Hipro Canibal Nutrition', 'Canibal Nutrition HiPro Whey', 'supplements',
 'Canibal Nutrition', 'powder', 'scoop', 30,
 '1 medida (30g)', 393, 82, 4, 5, 0, 3, 185, 0, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Galleta Oreo","Caramelo","Coco"]'::jsonb),

-- ==============================
-- PILEJE / NUTERGIA (Francia — clínico)
-- ==============================
('Ergymag Magnesio Marino Nutergia', 'Nutergia Ergymag Marine Magnesium', 'supplements',
 'Nutergia', 'tablet', 'tablet', 2,
 '2 comprimidos — 300mg magnesio marino', 0, 0, 0, 0, 0, 0, 0, 0, 0, 300, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- KENYA SPECIFIC BRANDS
-- ==============================
('Proteína Whey JIK Sports Kenya', 'JIK Sports Whey Protein Kenya', 'supplements',
 'JIK Sports', 'powder', 'scoop', 33,
 '1 medida (33g)', 370, 70, 9, 5, 0, 4, 210, 0, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vainilla","Fresa"]'::jsonb),

('Supplement Shop Kenya Creatine', 'Supplement Shop Kenya Creatine', 'supplements',
 'Supplement Shop Kenya', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Gel Energético Kenyan Runner Elite Gel', 'Kenyan Runner Elite Energy Gel', 'supplements',
 'Kenyan Runner Nutrition', 'gel', 'sachet', 40,
 '1 sachet (40g) — electrolitos para altitud', 250, 0, 62, 0, 0, 22, 190, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 190mg, K 85mg — formulado para atletas de altitud',
 true, true, 'east_africa', '', 'internal',
 '["Naranja","Tropical","Cola","Limon"]'::jsonb),

('Cafeína 200mg Nairobi Sports', 'Nairobi Sports Caffeine 200mg', 'supplements',
 'Nairobi Sports Nutrition', 'tablet', 'tablet', 1,
 '1 comprimido — 200mg cafeína anhidra', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- FAST&UP (India/Global distribución EA/SA)
-- ==============================
('Recuperación FAST&UP Reload', 'FAST&UP Reload Recovery', 'supplements',
 'FAST&UP', 'tablet', 'tablet', 4,
 '4 tabletas efervescentes en 500ml', 0, 0, 4, 0, 0, 3, 420, 155, 0, 28, 0, 0, 100000, 0, 0, 0, 0, 0, 'Na 420mg, K 155mg, Mg 28mg + Vit C',
 true, true, 'global', '', 'internal',
 '["Naranja","Limon","Baya Mixta","Sandía"]'::jsonb),

('FAST&UP Charge Cafeína 75mg', 'FAST&UP Charge Caffeine 75mg', 'supplements',
 'FAST&UP', 'tablet', 'tablet', 1,
 '1 tableta efervescente — 75mg cafeína + taurina', 0, 0, 3, 0, 0, 2, 50, 0, 0, 0, 0, 0, 0, 0, 0, 75, 0, 0, '',
 true, true, 'global', '', 'internal',
 '["Cola","Limon","Naranja Menta"]'::jsonb),

-- ==============================
-- DR. HULL / HAMMER EXTENDED
-- ==============================
('Endurolytes Fizz Hammer Electrolitos', 'Hammer Endurolytes Fizz Electrolyte Tabs', 'supplements',
 'Hammer Nutrition', 'tablet', 'tablet', 4,
 '1 tableta en 480ml — sin azúcar', 0, 0, 0, 0, 0, 0, 100, 50, 100, 25, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 100mg, K 50mg, Ca 100mg, Mg 25mg',
 true, true, 'east_africa', '', 'internal',
 '["Naranja","Limon","Mango","Sin Sabor"]'::jsonb),

-- ==============================
-- SPORTIKA (Argentina — distribuidora)
-- ==============================
('Proteína Suero Sportika 100%', 'Sportika 100% Whey Protein AR', 'supplements',
 'Sportika', 'powder', 'scoop', 33,
 '1 medida (33g)', 373, 72, 8, 5, 0, 4, 205, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Dulce de Leche","Moka"]'::jsonb),

-- ==============================
-- DEXTRO ENERGY (EU)
-- ==============================
('Tableta de Glucosa Dextro Energy Original', 'Dextro Energy Original Glucose Tablet', 'supplements',
 'Dextro Energy', 'tablet', 'tablet', 14,
 '1 barra tabletas (14g) — glucosa pura', 357, 0, 89, 0, 0, 89, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Glucosa pura de absorción inmediata',
 true, true, 'europe', '', 'internal',
 '["Original","Limon","Naranja","Foresta","Saúco","Tropical"]'::jsonb),

('Gel Dextro Energy Sport Gel', 'Dextro Energy Sport Gel', 'supplements',
 'Dextro Energy', 'gel', 'sachet', 33,
 '1 sachet (33g)', 333, 0, 83, 0, 0, 33, 40, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 40mg, K 55mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Cola Cafeína","Baya"]'::jsonb),

-- ==============================
-- ZIPVIT (UK endurance)
-- ==============================
('Gel ZipVit Sport ZV7', 'ZipVit Sport ZV7 Energy Gel', 'supplements',
 'ZipVit Sport', 'gel', 'sachet', 60,
 '1 sachet (60ml)', 100, 0, 25, 0, 0, 10, 80, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 80mg, K 70mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Frutas Rojas","Cola con Cafeína 75mg"]'::jsonb),

-- ==============================
-- SIS TEAM EDITION (EU)
-- ==============================
('Gel SiS Team Gel + Caffeine 75mg', 'SiS Team Gel + Caffeine 75mg', 'supplements',
 'Science in Sport', 'gel', 'sachet', 60,
 '1 sachet (60g) — 75mg cafeína — gel de equipo UCI', 83, 0, 20, 0, 0, 4, 50, 30, 0, 0, 0, 0, 0, 0, 0, 75, 0, 0, 'Na 50mg, K 30mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Cola","Cafe","Limon Menta","Expresso"]'::jsonb),

-- ==============================
-- NUTRISPORT (España)
-- ==============================
('Proteína Sport 80 Nutrisport', 'Nutrisport Sport 80 Protein', 'supplements',
 'Nutrisport', 'powder', 'scoop', 30,
 '1 medida (30g)', 383, 76, 7, 5, 0, 4, 185, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Natural","Cafe","Galleta"]'::jsonb),

('Gel Nutrisport Endurance Gel', 'Nutrisport Endurance Energy Gel', 'supplements',
 'Nutrisport', 'gel', 'sachet', 44,
 '1 sachet (44g)', 268, 0, 67, 0, 0, 23, 165, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 165mg, K 70mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Cola","Tropical","Baya con Cafeína 65mg"]'::jsonb),

('Bebida Isotónica Nutrisport ISO 80g', 'Nutrisport Iso 80g Drink Mix', 'supplements',
 'Nutrisport', 'powder', 'scoop', 40,
 '1 medida (40g) en 500ml', 371, 0, 92, 0, 0, 40, 340, 148, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 340mg, K 148mg, Mg 14mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Baya","Tropical","Sin Sabor"]'::jsonb)

ON CONFLICT DO NOTHING;
