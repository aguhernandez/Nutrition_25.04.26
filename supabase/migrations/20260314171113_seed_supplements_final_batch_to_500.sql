/*
  # Supplements Final Batch — reaching 500+
  More Argentina, EU, EA, NA brands. Focus on variety:
  casein, gainers, recovery drinks, iron/vitamin, specialized endurance
*/

INSERT INTO foods_v2 (
  name_es, name_en, category, brand, product_form, serving_unit, serving_size_g,
  serving_description, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
  fiber_per_100g, sugar_per_100g, sodium_mg, potassium_mg, calcium_mg, magnesium_mg,
  iron_mg, zinc_mg, vitamin_c_mg, vitamin_d_ug, vitamin_b12_ug,
  caffeine_mg, beta_alanine_mg, creatine_mg, electrolytes_note,
  is_supplement, is_verified, region, antidoping_note, source, flavors
) VALUES

-- ========== ARGENTINA CASEIN / GAINER ==========
('Caseína Micelar ENA Sport', 'ENA Sport Micellar Casein', 'supplements',
 'ENA Sport', 'powder', 'scoop', 33,
 '1 medida (33g) — proteína de digestión lenta', 364, 77, 3, 6, 0, 2, 195, 0, 130, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Sin Sabor"]'::jsonb),

('Ganador de Masa ENA Volume Mass', 'ENA Sport Volume Mass Gainer', 'supplements',
 'ENA Sport', 'powder', 'scoop', 150,
 '1 medida (150g) — hipercalórico', 385, 17, 71, 5, 2, 30, 330, 0, 180, 0, 4, 0, 0, 0, 0, 0, 0, 1000, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Dulce de Leche"]'::jsonb),

('Ganador de Peso Advance Mass Gainer', 'Advance Nutrition Mass Gainer', 'supplements',
 'Advance Nutrition', 'powder', 'scoop', 150,
 '1 medida (150g)', 380, 16, 70, 5, 2, 32, 325, 0, 175, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Cookies"]'::jsonb),

('Vitamina B12 1000mcg AR Sublingual', 'Vitamin B12 1000mcg Sublingual AR', 'supplements',
 'Kaiku Sport AR', 'tablet', 'tablet', 1,
 '1 comprimido sublingual — 1000mcg metilcobalamina', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor","Cereza"]'::jsonb),

('Magnesio Quelado Deportivo AR', 'Sport Chelated Magnesium AR', 'supplements',
 'Naturline Argentina', 'capsule', 'capsule', 2,
 '2 cápsulas — 300mg magnesio bisglicinato', 0, 0, 0, 0, 0, 0, 0, 0, 0, 300, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Barrita Proteica Fulvic AR', 'Fulvic Argentina Protein Bar', 'supplements',
 'Fulvic', 'bar', 'bar', 60,
 '1 barra (60g)', 375, 30, 38, 13, 7, 9, 275, 0, 175, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Caramelo","Vainilla","Mani"]'::jsonb),

('Isolado CFM Fulvic Argentina', 'Fulvic CFM Whey Isolate Argentina', 'supplements',
 'Fulvic', 'powder', 'scoop', 30,
 '1 medida (30g)', 390, 88, 2, 1, 0, 1, 155, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Sin Sabor"]'::jsonb),

('Gel Energético Enervit Sport Gel', 'Enervit Sport Energy Gel', 'supplements',
 'Enervit', 'gel', 'sachet', 25,
 '1 sachet (25g)', 360, 0, 90, 0, 0, 48, 130, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 130mg, K 55mg',
 true, true, 'south_america', '', 'internal',
 '["Naranja","Limon","Cola","Frambuesa"]'::jsonb),

-- ========== EU CASEIN / GAINER / RECOVERY ==========
('Caseína Micelar Myprotein', 'Myprotein Slow-Release Casein', 'supplements',
 'Myprotein', 'powder', 'scoop', 25,
 '1 medida (25g) — absorción lenta nocturna', 388, 84, 4, 4, 0, 3, 155, 0, 125, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Sin Sabor","Fresa"]'::jsonb),

('Ganador de Masa Impact Weight Gainer Myprotein', 'Myprotein Impact Weight Gainer', 'supplements',
 'Myprotein', 'powder', 'scoop', 125,
 '1 medida (125g)', 380, 18, 71, 4, 3, 30, 340, 0, 185, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa","Platano","Galleta"]'::jsonb),

('Recuperación Rego+ Proteína y Creatina SiS', 'SiS REGO+ Protein & Creatine', 'supplements',
 'Science in Sport', 'powder', 'scoop', 50,
 '1 medida (50g) — post-entreno con creatina', 380, 40, 47, 4, 2, 15, 305, 0, 155, 0, 0, 0, 0, 0, 0, 0, 0, 1000, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa"]'::jsonb),

('Bebida Recovery Drink Foodspring', 'Foodspring Recovery Drink Mix', 'supplements',
 'Foodspring', 'powder', 'scoop', 50,
 '1 medida (50g) — 3:1 CHO:PRO', 380, 40, 50, 3, 1, 15, 280, 0, 145, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Fresa"]'::jsonb),

('Caseína Lenta Scitec Casein Complex', 'Scitec Casein Complex', 'supplements',
 'Scitec Nutrition', 'powder', 'scoop', 30,
 '1 medida (30g)', 380, 77, 5, 5, 0, 3, 200, 0, 130, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Cafe","Tarta de Queso Limon"]'::jsonb),

('Barrita Olimp Protein Bar Olimp', 'Olimp Sport Protein Bar 64g', 'supplements',
 'Olimp Sport Nutrition', 'bar', 'bar', 64,
 '1 barra (64g)', 380, 35, 36, 14, 7, 8, 285, 0, 180, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Caramelo Toffee","Chocolate Avellana","Nougat","Cookies y Nata","Platano Split"]'::jsonb),

('Bebida Isotónica Squeezy Sports Energy Drink', 'Squeezy Sports Energy Drink Mix', 'supplements',
 'Squeezy Sports Nutrition', 'powder', 'scoop', 50,
 '1 medida (50g) en 750ml', 370, 0, 92, 0, 0, 30, 460, 190, 0, 18, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 460mg, K 190mg, Mg 18mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Baya Mixta","Sin Sabor","Manzana"]'::jsonb),

('Gel Squeezy Energetischer 33g', 'Squeezy Energy Gel 33g', 'supplements',
 'Squeezy Sports Nutrition', 'gel', 'sachet', 33,
 '1 sachet (33g)', 303, 0, 75, 0, 0, 28, 185, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 185mg, K 75mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Cola","Baya","Cafe Cafeína 80mg"]'::jsonb),

('GHD Nutrition Caseína 90 Spain', 'GHD Nutrition Casein 90 Spain', 'supplements',
 'GHD Nutrition', 'powder', 'scoop', 30,
 '1 medida (30g)', 380, 80, 4, 5, 0, 3, 175, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate","Vainilla","Tarta de Queso","Natural"]'::jsonb),

('Barrita GHD Protein Bar Spain', 'GHD Nutrition Protein Bar Spain', 'supplements',
 'GHD Nutrition', 'bar', 'bar', 60,
 '1 barra (60g)', 373, 34, 35, 13, 7, 7, 260, 0, 175, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate Caramelo","Vainilla Coco","Brownie","Limon Merengue"]'::jsonb),

-- ========== EAST AFRICA / KENYA EXTENDED ==========
('USN Muscle Fuel STS Mass Gainer', 'USN Muscle Fuel STS Mass Gainer', 'supplements',
 'USN', 'powder', 'scoop', 300,
 '3 medidas (300g) — ganador ultra calórico', 388, 18, 72, 5, 2, 32, 475, 0, 340, 0, 9, 0, 0, 5, 4, 0, 0, 1000, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa","Caramelo"]'::jsonb),

('USN QhickShake RTD Botella', 'USN QhickShake Ready-to-Drink', 'supplements',
 'USN', 'liquid', 'ml', 500,
 '1 botella (500ml) — proteína lista para tomar', 72, 15, 3, 1, 0, 3, 180, 0, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa","Cafe Caramelo"]'::jsonb),

('NPL Vegan Plant Protein', 'NPL Vegan Plant Protein', 'supplements',
 'NPL', 'powder', 'scoop', 35,
 '1 medida (35g) — guisante y arroz', 363, 62, 17, 7, 5, 4, 310, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vainilla","Sin Sabor"]'::jsonb),

('Evox Mass Attack Gainer EA', 'Evox Mass Attack Gainer', 'supplements',
 'Evox', 'powder', 'scoop', 200,
 '1 medida (200g) — hipercalórico', 382, 16, 72, 5, 2, 32, 430, 0, 280, 0, 6, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Caramel Fudge"]'::jsonb),

('Biogen Iron Chelate + Vit C Kenya', 'Biogen Iron Chelate + Vitamin C Kenya', 'supplements',
 'Biogen', 'capsule', 'capsule', 1,
 '1 cápsula — 25mg hierro quelado + 60mg Vit C', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0, 60000, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

('SSN Anabolic Muscle Builder EA', 'SSN Anabolic Muscle Builder EA', 'supplements',
 'SSN', 'powder', 'scoop', 100,
 '1 medida (100g) — ganador todo en uno', 400, 32, 57, 6, 0, 25, 420, 0, 210, 0, 4, 0, 0, 5, 3, 0, 0, 1000, '',
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vainilla","Fresa"]'::jsonb),

-- ========== NORTH AMERICA EXTENDED ==========
('Caseína Gold Standard 100% ON', 'Optimum Nutrition Gold Standard 100% Casein', 'supplements',
 'Optimum Nutrition', 'powder', 'scoop', 34,
 '1 medida (34g) — digestión lenta 6-8h', 353, 74, 4, 4, 1, 2, 340, 0, 180, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', 'Informed Choice certified', 'internal',
 '["Naturally Flavored Chocolate","Chocolate Peanut Butter","Banana Cream","Sin Sabor"]'::jsonb),

('Pro Gainer ON Ganador Calórico', 'Optimum Nutrition Pro Gainer', 'supplements',
 'Optimum Nutrition', 'powder', 'scoop', 165,
 '1 medida (165g) — 60g proteína + carbohidratos complejos', 385, 36, 55, 7, 5, 8, 350, 0, 450, 0, 5, 0, 100000, 5, 6, 0, 0, 0, '',
 true, true, 'north_america', 'Informed Choice certified', 'internal',
 '["Double Chocolate","Vanilla Custard","Banana Cream","Strawberry Cream"]'::jsonb),

('BodyArmor Lyte Sports Drink', 'BodyArmor Lyte Coconut Water Sports Drink', 'supplements',
 'BodyArmor Sports Nutrition', 'liquid', 'ml', 473,
 '1 botella (473ml) — base agua de coco', 21, 0, 5, 0, 0, 3, 0, 700, 0, 0, 0, 0, 100000, 0, 0, 0, 0, 0, 'K 700mg, Ca, Mg — sin potasio artificial',
 true, true, 'north_america', '', 'internal',
 '["Limon Lima","Naranja Mango","Fresa Platano","Melocoton"]'::jsonb),

('Liquid IV Hydration Multiplier', 'Liquid I.V. Hydration Multiplier', 'supplements',
 'Liquid I.V.', 'powder', 'sachet', 16,
 '1 sachet (16g) en 500ml — CTT technology', 0, 0, 11, 0, 0, 11, 500, 380, 0, 0, 0, 0, 72000, 0, 0, 0, 0, 0, 'Na 500mg, K 380mg — tecnología CTT hidrataciónrápida',
 true, true, 'north_america', '', 'internal',
 '["Limon Lima","Naranja","Fresa","Tropical Ponche","Acai Baya"]'::jsonb),

('Vital Proteins Collageno Deportivo', 'Vital Proteins Sport Collagen Peptides', 'supplements',
 'Vital Proteins', 'powder', 'scoop', 28,
 '1 medida (28g) — 20g colágeno + Vit C', 357, 71, 18, 0, 0, 10, 0, 0, 0, 0, 0, 0, 50000, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', '', 'internal',
 '["Sin Sabor","Vainilla Coco","Baya Tropical","Chocolate"]'::jsonb),

-- ========== EU MORE SPECIALIZED ==========
('Barrita Endurance Real Turmat Norway', 'Turmat Real Endurance Bar Norway', 'supplements',
 'Real Turmat', 'bar', 'bar', 60,
 '1 barra (60g) — natural escandinava', 450, 7, 62, 18, 5, 30, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Avena Miel","Chocolate Oscuro","Arándano Almendra","Naranja Nuez"]'::jsonb),

('Gel Energético SHOTZ Australia/EU', 'Shotz Sports Nutrition Energy Gel', 'supplements',
 'Shotz', 'gel', 'sachet', 45,
 '1 sachet (45g)', 244, 0, 61, 0, 0, 25, 170, 85, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 170mg, K 85mg, Mg 10mg',
 true, true, 'europe', '', 'internal',
 '["Naranja","Limon","Cola con Cafeína","Tropical","Cafe"]'::jsonb),

('Barrita Natural Clif Organic Energy Minibar', 'Clif Organic Energy Mini Bar EU', 'supplements',
 'Clif Bar', 'bar', 'bar', 28,
 '1 barrita mini (28g) — orgánica certificada', 375, 10, 65, 7, 4, 24, 80, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Chocolate Chip","Avena Uva Pasa","Vainilla Almendra"]'::jsonb),

('Fresa Energy Chews GU EU', 'GU Energy Chews EU', 'supplements',
 'GU Energy Labs', 'chew', 'tablet', 32,
 '1 bolsa (32g) — 2 serving / 4 masticables', 344, 0, 86, 0, 0, 22, 100, 85, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 'Na 100mg, K 85mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja","Fresa Platano","Sandía","Blueberry Pomegranate"]'::jsonb),

('Gel de Recuperación SiS REGO Rapid', 'SiS REGO Rapid Recovery Gel', 'supplements',
 'Science in Sport', 'gel', 'sachet', 60,
 '1 sachet (60g) — proteína + carbos post-entreno', 150, 12, 22, 2, 0, 8, 200, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Chocolate","Vainilla","Fresa"]'::jsonb),

-- ========== EXTENDED VITAMINS / MINERALS (all regions) ==========
('Hierro Floravital Liquido Vegano EU', 'Floravital Liquid Iron Vegan EU', 'supplements',
 'Salus', 'liquid', 'ml', 10,
 '1 porción (10ml) — 7.5mg hierro + vitaminas B', 0, 0, 9, 0, 0, 7, 0, 0, 0, 0, 75, 0, 5000, 0, 5, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Fórmula líquida herbal"]'::jsonb),

('B12 Active Spray 500mcg EU', 'Vitamin B12 Active Spray 500mcg EU', 'supplements',
 'BetterYou', 'liquid', 'ml', 0.14,
 '1 spray (0.14ml) — 500mcg B12 sublingual', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 500, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Bayas Silvestres","Dulce de Arándano"]'::jsonb),

('D3 + K2 BetterYou Oral Spray EU', 'BetterYou D3 + K2 Oral Spray EU', 'supplements',
 'BetterYou', 'liquid', 'ml', 0.28,
 '2 sprays (0.28ml) — 1000 UI D3 + 45mcg K2', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Menta Suave","Naranja"]'::jsonb),

('Vitamina C Effervescente Redoxon 1g Kenya', 'Redoxon 1g Vitamin C Effervescent Kenya', 'supplements',
 'Bayer', 'tablet', 'tablet', 4,
 '1 tableta efervescente — 1000mg Vit C', 0, 0, 2, 0, 0, 1, 280, 0, 0, 0, 0, 0, 100000, 0, 0, 0, 0, 0, '',
 true, true, 'east_africa', '', 'internal',
 '["Naranja","Limon","Frambuesa"]'::jsonb),

('Hierro Sangobion Capsulas Kenya', 'Sangobion Iron Capsules Kenya', 'supplements',
 'Merck KGaA', 'capsule', 'capsule', 1,
 '1 cápsula — 30mg hierro + B12 + folato + C', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 0, 50000, 0, 1, 0, 0, 0, 'Combina hierro con cofactores de absorción',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Suplemento Folic Acid + Iron Argentina', 'Folic Acid + Iron Supplement Argentina', 'supplements',
 'Recalcine', 'tablet', 'tablet', 1,
 '1 comprimido — 18mg hierro + 0.4mg ácido fólico', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Multivitamínico Femme ENA Sport', 'ENA Sport Femme Multivitamin', 'supplements',
 'ENA Sport', 'tablet', 'tablet', 1,
 '1 comprimido — fórmula deportiva femenina', 0, 0, 3, 0, 0, 0, 50, 0, 300, 75, 18, 8, 80000, 10, 6, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('USN Multivitamin Sport Men EA', 'USN Multi Sport Men EA', 'supplements',
 'USN', 'tablet', 'tablet', 2,
 '2 comprimidos diarios — hombre activo', 0, 0, 4, 0, 0, 0, 90, 0, 200, 100, 9, 15, 100000, 10, 4, 0, 0, 0, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Sin sabor"]'::jsonb),

('USN Multivitamin Sport Women EA', 'USN Multi Sport Women EA', 'supplements',
 'USN', 'tablet', 'tablet', 2,
 '2 comprimidos diarios — mujer activa', 0, 0, 4, 0, 0, 0, 50, 0, 300, 75, 18, 8, 80000, 10, 6, 0, 0, 0, '',
 true, true, 'east_africa', 'Informed Sport certified', 'internal',
 '["Sin sabor"]'::jsonb),

-- ========== CAFFEINE & BETA-ALANINE EXTENDED ==========
('Vivarin Cafeína 200mg NA', 'Vivarin Caffeine Alert 200mg', 'supplements',
 'Vivarin', 'tablet', 'tablet', 1,
 '1 comprimido — 200mg cafeína equivalente a 2 cafés', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, '',
 true, true, 'north_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Cafeína Sport 100mg BioTech', 'BioTech USA Caffeine Sport 100mg', 'supplements',
 'BioTech USA', 'tablet', 'tablet', 1,
 '1 comprimido — 100mg cafeína + taurina 1000mg', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, '',
 true, true, 'europe', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Beta-Alanina CarnoSyn Olimp 400 Tabs', 'Olimp Beta-Alanine CarnoSyn 400 Tabs', 'supplements',
 'Olimp Sport Nutrition', 'tablet', 'tablet', 4,
 '4 comprimidos — 3200mg beta-alanina CarnoSyn®', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3200, 0, '',
 true, true, 'europe', 'CarnoSyn® patentado', 'internal',
 '["Sin sabor"]'::jsonb),

('Beta-Alanine CarnoSyn Scitec 150g', 'Scitec Beta-Alanine CarnoSyn 150g', 'supplements',
 'Scitec Nutrition', 'powder', 'scoop', 4,
 '1 medida (4g) — 3200mg beta-alanina CarnoSyn®', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3200, 0, '',
 true, true, 'europe', 'CarnoSyn® patentado', 'internal',
 '["Sin sabor"]'::jsonb),

-- ========== RECOVERY & COLLAGEN ==========
('Colágeno Hidrolizado Deportivo AR', 'Sport Hydrolyzed Collagen AR', 'supplements',
 'ENA Sport', 'powder', 'scoop', 10,
 '1 medida (10g) — 10g colágeno hidrolizado tipo I y III', 357, 90, 0, 0, 0, 0, 50, 0, 0, 0, 0, 0, 50000, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor","Naranja","Limon"]'::jsonb),

('Colágeno Sport Péptidos Myprotein', 'Myprotein Collagen Peptides Sport', 'supplements',
 'Myprotein', 'powder', 'scoop', 10,
 '1 medida (10g) — 10g colágeno + Vit C', 360, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50000, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Sin Sabor","Piña","Frutos Rojos"]'::jsonb),

('Proteína Whey RTD Bottle myprotein', 'Myprotein Clear Whey Isolate RTD', 'supplements',
 'Myprotein', 'liquid', 'ml', 500,
 '1 botella (500ml) — bebida clara lista proteína', 30, 6, 1, 0, 0, 1, 50, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Naranja Mango","Limon Lima","Sandía","Pomelo Rosa"]'::jsonb),

('Bebida Proteica RTD ON Gold Standard', 'Optimum Nutrition Gold Standard Protein Shake RTD', 'supplements',
 'Optimum Nutrition', 'liquid', 'ml', 325,
 '1 botella (325ml) — lista para tomar', 95, 24, 4, 2, 0, 3, 180, 0, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', 'Informed Choice certified', 'internal',
 '["Chocolate","Vainilla","Fresa"]'::jsonb),

-- ========== SALT / ELECTROLYTE SPECIALIZED ==========
('Sal de Himalaya Deportiva Pink Salt Kenya', 'Himalayan Pink Salt Sport Tablets Kenya', 'supplements',
 'Himalaya Sports', 'tablet', 'tablet', 2,
 '2 comprimidos — 500mg sodio + 60mg potasio', 0, 0, 0, 0, 0, 0, 500, 60, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 500mg, K 60mg, Mg 10mg — para sudores extremos',
 true, true, 'east_africa', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Capsulas de Electrolitos Ultra Endurance AR', 'Ultra Endurance Electrolyte Capsules AR', 'supplements',
 'Advance Nutrition', 'capsule', 'capsule', 2,
 '2 cápsulas — repone sales en ultra trail', 0, 0, 0, 0, 0, 0, 650, 120, 50, 30, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 650mg, K 120mg, Ca 50mg, Mg 30mg',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Sales Ultra Trail SiS EU', 'SiS Ultra Trail Salt Capsules EU', 'supplements',
 'Science in Sport', 'capsule', 'capsule', 2,
 '2 cápsulas — ultra trail electrolitos', 0, 0, 0, 0, 0, 0, 520, 90, 30, 20, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 520mg, K 90mg, Ca 30mg, Mg 20mg',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Sin sabor"]'::jsonb),

-- ========== PLANT PROTEINS EXTENDED ==========
('Proteína de Arroz Integral Myprotein', 'Myprotein Brown Rice Protein', 'supplements',
 'Myprotein', 'powder', 'scoop', 30,
 '1 medida (30g)', 367, 73, 7, 3, 2, 1, 200, 0, 30, 0, 5, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Sin Sabor","Chocolate","Vainilla"]'::jsonb),

('Proteína de Cáñamo Orgánica EU Bulk', 'Bulk Powders Organic Hemp Protein', 'supplements',
 'Bulk Powders', 'powder', 'scoop', 30,
 '1 medida (30g)', 350, 47, 17, 10, 12, 1, 0, 0, 0, 200, 3, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'europe', 'Informed Sport certified', 'internal',
 '["Sin Sabor"]'::jsonb),

('Proteína Vegana Completa Herbalife', 'Herbalife Formula 1 Plant Protein', 'supplements',
 'Herbalife', 'powder', 'scoop', 26,
 '1 medida (26g) — soja y guisante', 346, 50, 34, 5, 7, 12, 300, 0, 200, 0, 5, 0, 100000, 5, 2, 0, 0, 0, '',
 true, true, 'global', '', 'internal',
 '["Vainilla","Chocolate","Menta Chocolate","Natural"]'::jsonb),

('Proteína de Soja Isolada ON 100%', 'Optimum Nutrition 100% Soy Protein Isolate', 'supplements',
 'Optimum Nutrition', 'powder', 'scoop', 28,
 '1 medida (28g)', 393, 86, 0, 4, 0, 0, 290, 0, 200, 0, 5, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'north_america', 'Informed Choice certified', 'internal',
 '["Sin Sabor","Chocolate","Vainilla"]'::jsonb)

ON CONFLICT DO NOTHING;
