/*
  # Supplements - Global Extended Batch 2
  More varieties: protein isolates, vitamins, minerals, caffeine,
  more gels, more bars, plant proteins across all regions
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
-- NAKD / TREK BARS (UK natural)
-- ==============================
('Barrita Proteica Trek Protein Flapjack', 'Trek Protein Flapjack Bar', 'supplements',
 'Trek Foods', 'bar', 'bar', 50,
 '1 barra (50g) — avena y proteína natural', 440, 10, 60, 16, 6, 24, 100, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Avellana","Almond Caramel","Mango Coco"]'::jsonb),

('Barrita Energética Trek Oat Bar', 'Trek Whole Oat Energy Bar', 'supplements',
 'Trek Foods', 'bar', 'bar', 50,
 '1 barra (50g) — avena entera y frutas', 400, 8, 64, 13, 6, 26, 85, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Limon Naranja","Baya Mixta","Manzana Canela","Coco Datil"]'::jsonb),

-- ==============================
-- CORNY / POWERBAR EU extended
-- ==============================
('Barrita PowerBar Energize Wafer', 'PowerBar Energize Wafer', 'supplements',
 'PowerBar', 'bar', 'bar', 40,
 '1 barra (40g) — galleta energética', 388, 7, 73, 7, 2, 28, 120, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Vainilla","Chocolate","Avena y Miel"]'::jsonb),

('Gel PowerBar Perform Doble Sal', 'PowerBar Perform Double Salt Gel', 'supplements',
 'PowerBar', 'gel', 'sachet', 41,
 '1 sachet (41g) — alto sodio para calor', 244, 0, 61, 0, 0, 14, 400, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 400mg, K 140mg — doble electrolitos para calor',
 true, true, 'europe', '', 'internal',
 '["Naranja Sal Marina","Limón Sal","Cola Sal"]'::jsonb),

-- ==============================
-- OTE SPORTS (UK — triatlón)
-- ==============================
('Gel de Energía OTE Sports', 'OTE Sports Energy Gel', 'supplements',
 'OTE Sports', 'gel', 'sachet', 56,
 '1 sachet (56g)', 214, 0, 53, 0, 0, 26, 79, 79, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 79mg, K 79mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Baya","Manzana","Tropical","Cola con Cafeína 75mg"]'::jsonb),

('Polvo de Bebida OTE Sports Isoenergy', 'OTE Isoenergy Drink Mix', 'supplements',
 'OTE Sports', 'powder', 'scoop', 43,
 '1 medida (43g) en 500ml', 372, 0, 93, 0, 0, 36, 220, 130, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 220mg, K 130mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Limon","Baya Mixta","Piña"]'::jsonb),

-- ==============================
-- SIS EXTENDED
-- ==============================
('Barrita SiS GO Energy Bar', 'SiS GO Energy Bar', 'supplements',
 'Science in Sport', 'bar', 'bar', 40,
 '1 barra (40g)', 350, 3, 76, 3, 2, 24, 60, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Platano","Chocolate","Frutos del Bosque","Caramel Fudge"]'::jsonb),

('Polvo de Proteína Plant SiS Vegan', 'SiS Plant Protein Vegan', 'supplements',
 'Science in Sport', 'powder', 'scoop', 30,
 '1 medida (30g)', 360, 67, 18, 6, 6, 5, 260, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Cafe"]'::jsonb),

-- ==============================
-- MYPROTEIN EXTENDED EU
-- ==============================
('Snack de Proteína Myprotein Filled Brownie', 'Myprotein Filled Protein Brownie', 'supplements',
 'Myprotein', 'bar', 'bar', 75,
 '1 brownie (75g)', 373, 28, 42, 13, 7, 15, 280, 0, 185, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate Relleno Caramelo","Relleno Galleta","Limon Relleno Cheesecake"]'::jsonb),

('Proteína Casein Lenta Myprotein', 'Myprotein Micellar Casein', 'supplements',
 'Myprotein', 'powder', 'scoop', 25,
 '1 medida (25g) — digestión lenta nocturna', 383, 84, 4, 5, 0, 3, 160, 0, 130, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa","Sin Sabor"]'::jsonb),

-- ==============================
-- BSN (EU extended)
-- ==============================
('Syntha-6 Edge BSN EU', 'BSN Syntha-6 Edge EU', 'supplements',
 'BSN', 'powder', 'scoop', 47,
 '1 medida (47g)', 381, 51, 22, 13, 4, 8, 340, 0, 148, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Choice certified', 'internal',
 '["Chocolate de Leche","Vainilla","Mantequilla Mani Chocolate","Galleta"]'::jsonb),

('True-Mass Ganador BSN', 'BSN True-Mass Gainer', 'supplements',
 'BSN', 'powder', 'scoop', 165,
 '1 medida (165g) — hipercalórico', 391, 27, 55, 10, 4, 22, 320, 0, 300, 0, 6, 0, 0, 5, 3, 0, 0, 0, '',
 true, true, 'europe', 'Informed Choice certified', 'internal',
 '["Chocolate Batido de Leche","Vainilla","Fresa Batido"]'::jsonb),

-- ==============================
-- MET-Rx (NA)
-- ==============================
('Barrita Big 100 MET-Rx', 'MET-Rx Big 100 Bar', 'supplements',
 'MET-Rx', 'bar', 'bar', 100,
 '1 barra grande (100g)', 380, 27, 52, 9, 2, 23, 240, 0, 290, 0, 0, 0, 100000, 5, 3, 0, 0, 0, '',
 true, true, 'north_america', '', 'internal',
 '["Super Cookie Crunch","Fudge Brownie","Crispy Apple Pie","Birthday Cake"]'::jsonb),

('Proteína Whey MET-Rx 100%', 'MET-Rx 100% Whey Protein', 'supplements',
 'MET-Rx', 'powder', 'scoop', 35,
 '1 medida (35g)', 386, 77, 5, 6, 0, 4, 270, 0, 130, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Cookies Cream"]'::jsonb),

-- ==============================
-- SOLGAR (Global — vitaminas premium)
-- ==============================
('Hierro Quelado Solgar 25mg', 'Solgar Chelated Iron 25mg', 'supplements',
 'Solgar', 'tablet', 'tablet', 1,
 '1 comprimido — 25mg hierro aminoquelado', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'global', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Vitamina D3 4000 UI Solgar', 'Solgar Vitamin D3 4000 IU', 'supplements',
 'Solgar', 'capsule', 'capsule', 1,
 '1 cápsula softgel — 100mcg D3', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, '',
 true, true, 'global', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Vitamina C 1000mg Bioflavonoides Solgar', 'Solgar Vitamin C 1000mg Bioflavonoids', 'supplements',
 'Solgar', 'tablet', 'tablet', 1,
 '1 comprimido — 1000mg Vit C + 100mg bioflavonoides', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100000, 0, 0, 0, 0, 0, '',
 true, true, 'global', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Vitamina B12 1000mcg Methylcobalamin Solgar', 'Solgar B12 1000mcg Methylcobalamin', 'supplements',
 'Solgar', 'tablet', 'tablet', 1,
 '1 comprimido masticable — 1000mcg B12 metilcobalamina', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, '',
 true, true, 'global', '', 'internal',
 '["Cherry Natural","Frambuesa"]'::jsonb),

('Magnesio Citrato 400mg Solgar', 'Solgar Magnesium Citrate 400mg', 'supplements',
 'Solgar', 'tablet', 'tablet', 3,
 '3 comprimidos — 400mg magnesio citrato', 0, 0, 0, 0, 0, 0, 0, 0, 0, 400, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'global', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- NATEX / INKOSPOR (EU triatlón)
-- ==============================
('Gel de Energía INKOSPOR X-TREME', 'Inkospor X-Treme Energy Gel', 'supplements',
 'Inkospor', 'gel', 'sachet', 45,
 '1 sachet (45g)', 244, 0, 61, 0, 0, 22, 185, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 185mg, K 85mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Cola con Cafeína 80mg","Baya"]'::jsonb),

-- ==============================
-- TAILWIND NUTRITION (NA — ultra trail)
-- ==============================
('Tailwind Endurance Fuel Chocolate', 'Tailwind Endurance Fuel Chocolate', 'supplements',
 'Tailwind Nutrition', 'powder', 'scoop', 54,
 '2 medidas (54g) en 700ml — calorías completas', 370, 0, 92, 0, 0, 92, 303, 119, 0, 16, 0, 0, 0, 0, 0, 35, 0, 0, 'Na 303mg, K 119mg, Mg 16mg, Ca 10mg — combustible todo en uno',
 true, true, 'north_america', '', 'internal',
 '["Chocolate","Mandarina Naranja","Tropical","Baya Acai","Colorado Cola con Cafeína","Naked (sin sabor)"]'::jsonb),

-- ==============================
-- SKRATCH LABS (NA)
-- ==============================
('Mezcla de Ejercicio Skratch Labs', 'Skratch Labs Exercise Hydration Mix', 'supplements',
 'Skratch Labs', 'powder', 'scoop', 21,
 '1 medida (21g) en 500ml', 381, 0, 95, 0, 0, 71, 390, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 390mg, K 50mg — electrolitos equilibrados',
 true, true, 'north_america', '', 'internal',
 '["Sandia y Lima","Limon y Lima","Melocoton Frambesa","Mango Naranja","Matcha Limon"]'::jsonb),

('Mezcla de Hidratación Cotidiana Skratch', 'Skratch Labs Sport Hydration Daily Drink Mix', 'supplements',
 'Skratch Labs', 'powder', 'scoop', 17,
 '1 medida (17g) en 500ml — uso diario', 0, 0, 4, 0, 0, 4, 380, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 380mg, K 50mg — hidratación diaria baja cal',
 true, true, 'north_america', '', 'internal',
 '["Limon Lima","Naranja","Fresa Melocoton","Pepino Lima"]'::jsonb),

-- ==============================
-- MAURTEN EXTENDED
-- ==============================
('Maurten Drink Mix 160 CAF 100', 'Maurten Drink Mix 160 CAF 100', 'supplements',
 'Maurten', 'powder', 'sachet', 40,
 '1 sachet (40g) en 500ml — 100mg cafeína', 375, 0, 94, 0, 0, 62, 450, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 'Na 450mg — hidrogel con cafeína',
 true, true, 'global', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- INFINIT NUTRITION (NA — personalizable)
-- ==============================
('Infinit Ride Base Cycling Fuel', 'Infinit Nutrition Ride Base Cycling Fuel', 'supplements',
 'Infinit Nutrition', 'powder', 'scoop', 70,
 '1 medida (70g) en 750ml — base ciclismo 3h', 371, 4, 91, 1, 0, 36, 400, 200, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 400mg, K 200mg, Mg 25mg',
 true, true, 'north_america', '', 'internal',
 '["Limon","Naranja","Baya","Sin Sabor","Menta"]'::jsonb),

-- ==============================
-- COMPEED / IRONMAN / ZDOROVYE
-- ==============================
('Gel Energético IRONMAN Performance', 'IRONMAN Performance Energy Gel', 'supplements',
 'IRONMAN Nutrition', 'gel', 'sachet', 30,
 '1 sachet (30g)', 333, 0, 83, 0, 0, 28, 185, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 185mg, K 70mg',
 true, true, 'global', '', 'internal',
 '["Naranja","Limon","Cola","Tropical con Cafeína 75mg"]'::jsonb),

-- ==============================
-- APTONIA (Decathlon Marca Propia — extendida)
-- ==============================
('Gel Energético Aptonia con Cafeína', 'Aptonia Caffeinated Energy Gel', 'supplements',
 'Decathlon / Aptonia', 'gel', 'sachet', 32,
 '1 sachet (32g) — 50mg cafeína', 344, 0, 86, 0, 0, 28, 130, 55, 0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 'Na 130mg, K 55mg',
 true, true, 'europe', '', 'internal',
 '["Cola","Cafe","Limon Menta"]'::jsonb),

('Tableta de Sal Aptonia 3000mg Sodio', 'Aptonia Salt Tablet 3000mg Sodium', 'supplements',
 'Decathlon / Aptonia', 'tablet', 'tablet', 3,
 '3 tabletas = 3000mg sodio — ultratrail calor extremo', 0, 0, 0, 0, 0, 0, 3000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 3000mg, Mg 150mg, K 100mg por toma',
 true, true, 'europe', '', 'internal',
 '["Sin sabor","Limon"]'::jsonb),

-- ==============================
-- SALTSTICK (USA/Global — sales)
-- ==============================
('Cápsulas de Sal SaltStick', 'SaltStick Electrolyte Capsules', 'supplements',
 'SaltStick', 'capsule', 'capsule', 2,
 '2 cápsulas — perfil electrolítico completo', 0, 0, 0, 0, 0, 0, 440, 95, 44, 22, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 440mg, K 95mg, Ca 44mg, Mg 22mg — reemplaza electrolitos del sudor',
 true, true, 'global', 'NSF Certified for Sport', 'internal',
 '["Sin sabor"]'::jsonb),

('SaltStick FAST Chews Electrolitos', 'SaltStick FAST Electrolyte Chews', 'supplements',
 'SaltStick', 'chew', 'tablet', 4,
 '4 masticables — electrolitos rápidos', 0, 0, 2, 0, 0, 1, 260, 60, 30, 15, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 260mg, K 60mg, Ca 30mg, Mg 15mg',
 true, true, 'global', 'NSF Certified for Sport', 'internal',
 '["Naranja","Limon","Baya"]'::jsonb),

-- ==============================
-- SPRING ENERGY / CLIF extended
-- ==============================
('Chomps Clif Gominolas', 'Clif Organic Energy Chews', 'supplements',
 'Clif Bar', 'chew', 'tablet', 36,
 '1 bolsa (36g) = 6 gominolas — 25g CHO', 361, 0, 89, 0, 0, 22, 55, 65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 55mg, K 65mg — orgánico',
 true, true, 'north_america', '', 'internal',
 '["Strawberry","Mango","Tropical","Black Cherry Caffeine"]'::jsonb),

-- ==============================
-- JET BLACKBERRY / GU EXTENDED
-- ==============================
('GU Roctane Ultra Endurance Protein Drink', 'GU Roctane Protein Recovery Drink Mix', 'supplements',
 'GU Energy Labs', 'powder', 'scoop', 64,
 '1 medida (64g) — recuperación post-ultra', 375, 38, 47, 6, 1, 20, 275, 0, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', 'Informed Sport certified', 'internal',
 '["Vainilla Beans","Chocolate Smooth","Fresa Bananas"]'::jsonb),

-- ==============================
-- VITALIBIS / PHYTO-PHARMA ARGENTINA
-- ==============================
('Hierro Aminoquelado Argentina Jarabe', 'Chelated Iron Syrup Argentina', 'supplements',
 'Roux Ocefa', 'liquid', 'ml', 10,
 '1 cucharada (10ml) — 50mg hierro + Vit C', 0, 0, 5, 0, 0, 4, 5, 0, 0, 0, 50, 0, 50000, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Uva","Durazno"]'::jsonb),

('Vitamina D3 en Gotas Argentina', 'Vitamin D3 Drops Argentina', 'supplements',
 'Laboratorio Bago', 'liquid', 'ml', 0.1,
 '5 gotas (0.5ml) — 1000 UI D3', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Vitamina C 500mg Efervescente Argentina', 'Vitamin C 500mg Effervescent Argentina', 'supplements',
 'Bagóvit A', 'tablet', 'tablet', 4,
 '1 comprimido efervescente — 500mg Vit C', 0, 0, 2, 0, 0, 1, 280, 0, 0, 0, 0, 0, 50000, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Naranja","Limon","Pomelo"]'::jsonb),

('Hierro Fumarato 200mg Comprimidos Kenya', 'Iron Fumarate 200mg Tablets Kenya', 'supplements',
 'Laboratory & Allied', 'tablet', 'tablet', 1,
 '1 comprimido — 65mg hierro elemental (fumarato ferroso 200mg)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 65, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', 'Aprobado por KEBS', 'internal',
 '["Sin sabor"]'::jsonb),

('Multivitamínico Sportlife Kenya', 'SportLife Multivitamin Kenya', 'supplements',
 'SportLife Kenya', 'tablet', 'tablet', 1,
 '1 comprimido', 0, 0, 3, 0, 0, 0, 80, 0, 200, 60, 9, 10, 80000, 5, 2, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb)

ON CONFLICT DO NOTHING;
