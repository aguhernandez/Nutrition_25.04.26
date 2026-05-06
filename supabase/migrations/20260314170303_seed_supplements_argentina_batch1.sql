/*
  # Supplements - Argentina & South America Batch 1
  Brands: Nutremax, SAN Nutrition AR, Advance Nutrition, Infisport AR,
  ENA Sport, Fulvic, RedServ, VidaNaturals, Optimum Nutrition AR,
  Next Nutrition, Nutricion Extrema, GNC Argentina, Cellucor AR
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
-- ENA SPORT (Argentina — icónica)
-- ==============================
('Whey Protein ENA Sport', 'ENA Sport Whey Protein', 'supplements',
 'ENA Sport', 'powder', 'scoop', 35,
 '1 medida (35g)', 377, 74, 8, 5, 0, 4, 210, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Dulce de Leche","Cookie"]'::jsonb),

('Isolado de Suero ENA Sport', 'ENA Sport Whey Isolate', 'supplements',
 'ENA Sport', 'powder', 'scoop', 30,
 '1 medida (30g) — 90% proteína', 393, 90, 2, 1, 0, 1, 160, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Sin Sabor"]'::jsonb),

('Creatina ENA Sport Monohidrato', 'ENA Sport Creatine Monohydrate', 'supplements',
 'ENA Sport', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Gel Energético ENA Endurance', 'ENA Endurance Energy Gel', 'supplements',
 'ENA Sport', 'gel', 'sachet', 40,
 '1 sachet (40g)', 275, 0, 69, 0, 0, 24, 160, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 160mg, K 55mg',
 true, true, 'south_america', '', 'internal',
 '["Naranja","Limon","Frutas Rojas","Pomelo","Manzana Verde"]'::jsonb),

('Gel con Cafeína ENA Endurance', 'ENA Endurance Caffeinated Gel', 'supplements',
 'ENA Sport', 'gel', 'sachet', 40,
 '1 sachet (40g) — 80mg cafeína', 275, 0, 69, 0, 0, 24, 160, 55, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 'Na 160mg, K 55mg',
 true, true, 'south_america', '', 'internal',
 '["Cola Limon","Cafe Expresso","Naranja Amarga"]'::jsonb),

('Bebida Isotónica ENA Hydra+', 'ENA Hydra+ Isotonic Drink Mix', 'supplements',
 'ENA Sport', 'powder', 'scoop', 35,
 '1 medida (35g) en 500ml', 377, 0, 94, 0, 0, 42, 310, 120, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 310mg, K 120mg, Mg 10mg',
 true, true, 'south_america', '', 'internal',
 '["Naranja","Limon","Pomelo","Frutas Tropicales","Sandía"]'::jsonb),

('Barrita Proteica ENA Sport', 'ENA Sport Protein Bar', 'supplements',
 'ENA Sport', 'bar', 'bar', 60,
 '1 barra (60g)', 383, 33, 38, 13, 6, 9, 280, 0, 180, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Dulce de Leche","Vainilla","Mani Caramelo"]'::jsonb),

('Cafeína 200mg ENA Sport', 'ENA Sport Caffeine 200mg', 'supplements',
 'ENA Sport', 'tablet', 'tablet', 1,
 '1 comprimido — 200mg cafeína', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Beta-Alanina ENA Sport', 'ENA Sport Beta-Alanine', 'supplements',
 'ENA Sport', 'powder', 'scoop', 5,
 '1 medida (5g) — 5000mg beta-alanina', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Hierro Quelado ENA Sport', 'ENA Sport Chelated Iron', 'supplements',
 'ENA Sport', 'tablet', 'tablet', 1,
 '1 comprimido — 18mg hierro bisglicinato', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- ADVANCE NUTRITION (Argentina)
-- ==============================
('Proteína Whey Advance Nutrition', 'Advance Nutrition Whey Protein', 'supplements',
 'Advance Nutrition', 'powder', 'scoop', 35,
 '1 medida (35g)', 371, 71, 8, 6, 0, 4, 220, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Dulce de Leche","Cookies"]'::jsonb),

('Isolado Advance Nutrition Whey Isolate', 'Advance Nutrition Whey Isolate', 'supplements',
 'Advance Nutrition', 'powder', 'scoop', 30,
 '1 medida (30g)', 390, 88, 2, 1, 0, 1, 155, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Sin Sabor"]'::jsonb),

('Creatina Advance Nutrition 300g', 'Advance Nutrition Creatine 300g', 'supplements',
 'Advance Nutrition', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('Proteína Vegana Advance', 'Advance Nutrition Vegan Protein', 'supplements',
 'Advance Nutrition', 'powder', 'scoop', 30,
 '1 medida (30g) — guisante + arroz', 367, 72, 6, 5, 3, 2, 240, 0, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Sin Sabor"]'::jsonb),

-- ==============================
-- NUTREMAX (Argentina)
-- ==============================
('Proteína Whey Complex Nutremax', 'Nutremax Whey Complex', 'supplements',
 'Nutremax', 'powder', 'scoop', 33,
 '1 medida (33g)', 375, 72, 8, 6, 0, 4, 205, 0, 118, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Dulce de Leche"]'::jsonb),

('Suero Isolado Nutremax 100%', 'Nutremax 100% Whey Isolate', 'supplements',
 'Nutremax', 'powder', 'scoop', 30,
 '1 medida (30g)', 390, 88, 1, 1, 0, 1, 150, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Sin Sabor"]'::jsonb),

('Multivitamínico Deportivo Nutremax', 'Nutremax Sports Multivitamin', 'supplements',
 'Nutremax', 'tablet', 'tablet', 1,
 '1 comprimido', 0, 0, 3, 0, 0, 0, 90, 0, 200, 100, 9, 10, 80000, 5, 2, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- NEXT NUTRITION (Argentina)
-- ==============================
('Designer Whey Next Nutrition AR', 'Next Nutrition Designer Whey AR', 'supplements',
 'Next Nutrition', 'powder', 'scoop', 33,
 '1 medida (33g)', 368, 71, 7, 5, 0, 4, 215, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Cafe Moca"]'::jsonb),

('Super Whey Next Nutrition', 'Next Nutrition Super Whey', 'supplements',
 'Next Nutrition', 'powder', 'scoop', 35,
 '1 medida (35g)', 380, 75, 7, 5, 0, 3, 200, 0, 125, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Dulce de Leche","Sin Sabor"]'::jsonb),

-- ==============================
-- GNC (Argentina — franquicia)
-- ==============================
('GNC AMP Wheybolic Elixir', 'GNC AMP Wheybolic Elixir AR', 'supplements',
 'GNC', 'powder', 'scoop', 35,
 '1 medida (35g)', 386, 76, 6, 6, 0, 3, 220, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Frutilla","Cookies Cream"]'::jsonb),

('GNC Pro Performance Creatine Monohydrate', 'GNC Pro Performance Creatine AR', 'supplements',
 'GNC', 'powder', 'scoop', 5,
 '1 medida (5g)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('GNC Mega Men Sport Multivitamínico', 'GNC Mega Men Sport Multivitamin AR', 'supplements',
 'GNC', 'tablet', 'tablet', 2,
 '2 comprimidos — fórmula para deportistas', 0, 0, 4, 0, 0, 0, 95, 0, 200, 100, 9, 15, 100000, 10, 4, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('GNC Vitamina C 1000mg AR', 'GNC Vitamin C 1000mg AR', 'supplements',
 'GNC', 'tablet', 'tablet', 1,
 '1 comprimido — 1000mg Vitamina C', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100000, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('GNC Hierro 28mg AR', 'GNC Iron 28mg AR', 'supplements',
 'GNC', 'tablet', 'tablet', 1,
 '1 comprimido — 28mg hierro fumarato', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

('GNC Vitamina D3 2000 UI AR', 'GNC Vitamin D3 2000 IU AR', 'supplements',
 'GNC', 'capsule', 'capsule', 1,
 '1 cápsula — 50mcg D3', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb),

-- ==============================
-- CELLUCOR (Argentina/Regional)
-- ==============================
('C4 Pre-Workout Cellucor AR', 'Cellucor C4 Pre-Workout AR', 'supplements',
 'Cellucor', 'powder', 'scoop', 6,
 '1 medida (6g) — 150mg cafeína, 1600mg beta-alanina', 0, 0, 4, 0, 0, 1, 50, 0, 0, 0, 0, 0, 0, 0, 0, 150, 1600, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Sandía","Naranja Explosivo","Limon Lima","Baya Mixta","Cherry Limeade"]'::jsonb),

('Cor-Performance Whey Cellucor', 'Cellucor Cor-Performance Whey AR', 'supplements',
 'Cellucor', 'powder', 'scoop', 35,
 '1 medida (35g)', 383, 71, 9, 7, 0, 5, 280, 0, 130, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Molten Chocolate","Cor-Fetti","Peanut Butter Marshmallow","Cinnamon Swirl"]'::jsonb),

-- ==============================
-- INFISPORT (España, muy vendida en AR)
-- ==============================
('Proteína Whey Infisport', 'Infisport Whey Protein', 'supplements',
 'Infisport', 'powder', 'scoop', 30,
 '1 medida (30g)', 388, 79, 5, 5, 0, 3, 190, 0, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Vainilla","Fresa","Natural","Cafe"]'::jsonb),

('Gel Carbogel Infisport', 'Infisport Carbogel Energy Gel', 'supplements',
 'Infisport', 'gel', 'sachet', 37,
 '1 sachet (37g)', 270, 0, 67, 0, 0, 22, 195, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 195mg, K 80mg',
 true, true, 'south_america', '', 'internal',
 '["Naranja","Limon","Frutas Rojas","Cola con Cafeína (80mg)"]'::jsonb),

('Bebida Deportiva Infisport +F', 'Infisport +F Sports Drink Mix', 'supplements',
 'Infisport', 'powder', 'scoop', 40,
 '1 medida (40g) en 500ml', 370, 0, 91, 0, 0, 42, 370, 150, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 'Na 370mg, K 150mg, Mg 15mg',
 true, true, 'south_america', '', 'internal',
 '["Naranja","Limon","Baya Tropical","Sin Sabor"]'::jsonb),

-- ==============================
-- MUSCLETECH (Argentina/Regional)
-- ==============================
('Nitro Tech Whey Gold MuscleTech AR', 'MuscleTech Nitro Tech Whey Gold AR', 'supplements',
 'MuscleTech', 'powder', 'scoop', 46,
 '1 medida (46g)', 384, 74, 6, 7, 0, 2, 280, 0, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, '',
 true, true, 'south_america', 'Informed Choice certified', 'internal',
 '["Chocolate","Vainilla","Frutilla","Dulce de Leche"]'::jsonb),

('Creatina Elite MuscleTech AR', 'MuscleTech Platinum Creatine AR', 'supplements',
 'MuscleTech', 'powder', 'scoop', 5,
 '1 medida (5g) — micronizada', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, '',
 true, true, 'south_america', '', 'internal',
 '["Sin sabor"]'::jsonb)

ON CONFLICT DO NOTHING;
