/*
  # Supplements - Argentina Batch 2 + Brazil, Chile, Colombia, Peru, Uruguay
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
-- SAN NUTRITION (Argentina local)
-- ==============================
('100% Whey Protein SAN AR', '100% Whey Protein SAN AR', 'supplements',
 'SAN Nutrition', 'powder', 'scoop', 35,
 '1 medida (35g)', 377, 74, 7, 6, 0, 4, 205, 0, 118, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Cookies & Cream"]'::jsonb),

('Intra Fuel Carbohidratos SAN', 'SAN Intra Fuel Carbohydrate Drink', 'supplements',
 'SAN Nutrition', 'powder', 'scoop', 45,
 '1 medida (45g) en 500ml', 377, 0, 94, 0, 0, 42, 315, 130, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 315mg, K 130mg, Mg 10mg',
 true, true, 'south_america', '', 'internal',
 '["Naranja","Limon","Baya","Tropical"]'::jsonb),

-- ==============================
-- NUTRI NATION (Argentina)
-- ==============================
('Whey Gold Nutri Nation', 'Nutri Nation Whey Gold', 'supplements',
 'Nutri Nation', 'powder', 'scoop', 33,
 '1 medida (33g)', 373, 72, 8, 5, 0, 4, 210, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Maní y Caramelo"]'::jsonb),

-- ==============================
-- BIOQ (Argentina)
-- ==============================
('Proteína Whey BioQ', 'BioQ Whey Protein', 'supplements',
 'BioQ', 'powder', 'scoop', 33,
 '1 medida (33g)', 375, 71, 9, 5, 0, 4, 200, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Dulce de Leche"]'::jsonb),

('Creatina BioQ 300g', 'BioQ Creatine 300g', 'supplements',
 'BioQ', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- GOLD NUTRITION (Argentina/Brasil)
-- ==============================
('Proteína Competition Whey Gold Nutrition', 'Gold Nutrition Competition Whey', 'supplements',
 'Gold Nutrition', 'powder', 'scoop', 33,
 '1 medida (33g)', 377, 75, 6, 5, 0, 3, 195, 0, 118, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Natural"]'::jsonb),

('Gel Energético Gold Nutrition Elite Gel', 'Gold Nutrition Elite Gel', 'supplements',
 'Gold Nutrition', 'gel', 'sachet', 35,
 '1 sachet (35g)', 286, 0, 71, 0, 0, 26, 160, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 160mg, K 55mg',
 true, true, 'south_america', '', 'internal',
 '["Naranja","Limon","Cola","Frutas Tropicales"]'::jsonb),

-- ==============================
-- PROBIÓTICA (Brasil — muy distribuida en AR)
-- ==============================
('Whey Protein Isolado Probiótica', 'Probiótica Whey Protein Isolate', 'supplements',
 'Probiótica', 'powder', 'scoop', 32,
 '1 medida (32g)', 390, 88, 2, 1, 0, 1, 165, 0, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Baunilha","Morango","Sin Sabor"]'::jsonb),

('Proteína Vegana Probiótica', 'Probiótica Vegan Protein', 'supplements',
 'Probiótica', 'powder', 'scoop', 30,
 '1 medida (30g)', 367, 70, 6, 5, 3, 2, 250, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Baunilha"]'::jsonb),

('Gel Energético Probiótica', 'Probiótica Energy Gel', 'supplements',
 'Probiótica', 'gel', 'sachet', 30,
 '1 sachet (30g)', 333, 0, 83, 0, 0, 27, 150, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 150mg, K 50mg',
 true, true, 'south_america', '', 'internal',
 '["Laranja","Limão","Maçã Verde"]'::jsonb),

('Bebida Isotónica Probiótica Hydra Energy', 'Probiótica Hydra Energy Isotonic', 'supplements',
 'Probiótica', 'powder', 'scoop', 35,
 '1 medida (35g) em 500ml', 380, 0, 94, 0, 0, 40, 305, 120, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 305mg, K 120mg, Mg 9mg',
 true, true, 'south_america', '', 'internal',
 '["Laranja","Limão","Maracujá","Abacaxi"]'::jsonb),

('Vitamina C 1000mg Probiótica', 'Probiótica Vitamin C 1000mg', 'supplements',
 'Probiótica', 'tablet', 'tablet', 1,
 '1 comprimido efervescente — 1000mg Vit C', 0, 0, 2, 0, 0, 1, 180, 0, 0, 0, 0, 0, 100000, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Laranja","Limão","Morango"]'::jsonb),

-- ==============================
-- INTEGRALMÉDICA (Brasil)
-- ==============================
('Nitro Hard Whey Integralmédica', 'Integralmédica Nitro Hard Whey', 'supplements',
 'Integralmédica', 'powder', 'scoop', 32,
 '1 medida (32g)', 378, 72, 8, 5, 0, 4, 210, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Baunilha","Morango","Cookies"]'::jsonb),

('Creatina Monoidratada Integralmédica', 'Integralmédica Creatine Monohydrate', 'supplements',
 'Integralmédica', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'south_america', '', 'internal',
 '["Sem Sabor"]'::jsonb),

-- ==============================
-- MAX TITANIUM (Brasil)
-- ==============================
('Whey Protein Max Titanium 100%', 'Max Titanium 100% Whey', 'supplements',
 'Max Titanium', 'powder', 'scoop', 33,
 '1 medida (33g)', 367, 70, 9, 5, 0, 4, 200, 0, 112, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Baunilha","Morango","Amendoim","Cookies"]'::jsonb),

('Gel Endurance Max Titanium', 'Max Titanium Endurance Gel', 'supplements',
 'Max Titanium', 'gel', 'sachet', 30,
 '1 sachet (30g)', 333, 0, 83, 0, 0, 27, 145, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 145mg, K 50mg',
 true, true, 'south_america', '', 'internal',
 '["Laranja","Limão","Maçã","Café c/ Cafeína (80mg)"]'::jsonb),

-- ==============================
-- BODYTECH (Colombia)
-- ==============================
('Proteína Whey Bodytech 100%', 'Bodytech 100% Whey Protein', 'supplements',
 'Bodytech', 'powder', 'scoop', 35,
 '1 medida (35g)', 377, 74, 8, 5, 0, 4, 210, 0, 118, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Galletas y Crema","Banano"]'::jsonb),

('Isolado de Suero Bodytech', 'Bodytech Whey Isolate', 'supplements',
 'Bodytech', 'powder', 'scoop', 30,
 '1 medida (30g)', 390, 88, 2, 1, 0, 1, 155, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Sin Sabor"]'::jsonb),

('Creatina Bodytech 300g', 'Bodytech Creatine 300g', 'supplements',
 'Bodytech', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Hierro Quelado Bodytech', 'Bodytech Chelated Iron', 'supplements',
 'Bodytech', 'tablet', 'tablet', 1,
 '1 comprimido — 18mg hierro', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- QUAMTRAX (España, gran distribución SA)
-- ==============================
('Proteína Whey Quamtrax', 'Quamtrax Whey Protein', 'supplements',
 'Quamtrax', 'powder', 'scoop', 33,
 '1 medida (33g)', 383, 77, 5, 5, 0, 3, 185, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Cafe","Natural"]'::jsonb),

('Isolado Quamtrax 90%', 'Quamtrax Whey Isolate 90%', 'supplements',
 'Quamtrax', 'powder', 'scoop', 30,
 '1 medida (30g)', 400, 90, 1, 1, 0, 1, 135, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Sin Sabor"]'::jsonb),

-- ==============================
-- ATENAS NUTRITION (Chile)
-- ==============================
('Proteína Whey Atenas 100%', 'Atenas 100% Whey Protein', 'supplements',
 'Atenas Nutrition', 'powder', 'scoop', 33,
 '1 medida (33g)', 373, 72, 8, 5, 0, 4, 210, 0, 112, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Galleta Dulce"]'::jsonb),

('Creatina Monohidrato Atenas', 'Atenas Creatine Monohydrate', 'supplements',
 'Atenas Nutrition', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- BSAS NUTRITION (Argentina — Buenos Aires)
-- ==============================
('Whey Protein BSAS Nutrition', 'BSAS Nutrition Whey Protein', 'supplements',
 'BSAS Nutrition', 'powder', 'scoop', 33,
 '1 medida (33g)', 370, 71, 9, 5, 0, 4, 205, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Dulce de Leche","Cookies"]'::jsonb),

-- ==============================
-- NUTRICION EXTREMA / RN SPORT (Argentina)
-- ==============================
('Pure Whey RN Sport', 'RN Sport Pure Whey', 'supplements',
 'RN Sport', 'powder', 'scoop', 35,
 '1 medida (35g)', 374, 73, 8, 5, 0, 4, 215, 0, 118, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Natural"]'::jsonb),

-- ==============================
-- SCIENTEC NUTRITION (Argentina)
-- ==============================
('Whey Protein Scientec 100%', 'Scientec Nutrition 100% Whey', 'supplements',
 'Scientec Nutrition', 'powder', 'scoop', 33,
 '1 medida (33g)', 375, 71, 9, 5, 0, 4, 205, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Moka"]'::jsonb),

('Beta-Alanina Scientec 200g', 'Scientec Nutrition Beta-Alanine 200g', 'supplements',
 'Scientec Nutrition', 'powder', 'scoop', 5,
 '1 medida (5g) — 5000mg beta-alanina', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- UNIVERSAL NUTRITION (distribución AR/SA)
-- ==============================
('Animal Pak Universal Nutrition SA', 'Universal Nutrition Animal Pak SA', 'supplements',
 'Universal Nutrition', 'tablet', 'tablet', 11,
 '1 pack (11 tabletas)', 0, 0, 4, 0, 0, 0, 130, 0, 500, 100, 18, 15, 100000, 5, 6, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Ultra Whey Pro Universal SA', 'Universal Nutrition Ultra Whey Pro SA', 'supplements',
 'Universal Nutrition', 'powder', 'scoop', 33,
 '1 medida (33g)', 370, 71, 8, 5, 0, 4, 215, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Natural"]'::jsonb),

-- ==============================
-- PERU: FITMAX / NAKKA / NUTRIBIO
-- ==============================
('Proteína Whey Fitmax Peru', 'Fitmax Whey Protein Peru', 'supplements',
 'Fitmax', 'powder', 'scoop', 33,
 '1 medida (33g)', 370, 70, 9, 5, 0, 4, 210, 0, 112, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Fresa"]'::jsonb),

-- ==============================
-- URUGUAY: ATLETICA / NUTRI-SPORT UY
-- ==============================
('Whey Protein Atlética 100%', 'Atlética 100% Whey Protein UY', 'supplements',
 'Atlética', 'powder', 'scoop', 33,
 '1 medida (33g)', 373, 72, 8, 5, 0, 4, 205, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla"]'::jsonb)

ON CONFLICT DO NOTHING;
