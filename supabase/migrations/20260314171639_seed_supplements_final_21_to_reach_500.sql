/*
  # Seed Final 21+ Supplements to Reach 500+

  Adds remaining supplements across all regions to reach 500+ total.
  Covers additional brands from Europe, South America, East Africa, and North America.
*/

INSERT INTO foods_v2 (
  name_es, name_en, brand, category, product_form,
  calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
  serving_size_g, serving_description, serving_unit,
  sodium_mg, potassium_mg, magnesium_mg, calcium_mg, iron_mg, zinc_mg,
  vitamin_c_mg, vitamin_d_ug, vitamin_b12_ug,
  caffeine_mg, beta_alanine_mg, creatine_mg,
  electrolytes_note, flavors, region, is_supplement, source
) VALUES

-- Multipower Protein (Germany/Europe)
('Multipower 100% Whey Protein Chocolate', 'Multipower 100% Whey Protein Chocolate',
 'Multipower', 'supplements', 'powder',
 378, 75, 8, 6,
 30, '1 scoop (30g)', 'g',
 110, 180, 40, 120, 1.5, 2,
 0, 0, 0.8,
 0, 0, 0,
 '', '["Chocolate", "Vanilla", "Strawberry"]', 'europe', true, 'internal'),

-- Inkospor Active Protein (Germany)
('Inkospor Active Protein Vainilla', 'Inkospor Active Protein Vanilla',
 'Inkospor', 'supplements', 'powder',
 370, 70, 10, 5,
 30, '1 scoop (30g)', 'g',
 100, 170, 35, 110, 1.2, 1.8,
 0, 0, 0.5,
 0, 0, 0,
 '', '["Vanilla", "Chocolate", "Neutral"]', 'europe', true, 'internal'),

-- Anderson Research Italy
('Anderson Research Whey Protein Advanced Chocolate', 'Anderson Research Whey Protein Advanced Chocolate',
 'Anderson Research', 'supplements', 'powder',
 375, 74, 9, 6,
 30, '1 scoop (30g)', 'g',
 105, 175, 38, 115, 1.4, 1.9,
 0, 0, 0.6,
 0, 0, 0,
 '', '["Chocolate", "Vanilla", "Caramel"]', 'europe', true, 'internal'),

-- FA Engineered Nutrition (Poland)
('FA Engineered Nutrition Whey Protein Vainilla', 'FA Engineered Nutrition Whey Protein Vanilla',
 'FA Engineered Nutrition', 'supplements', 'powder',
 372, 73, 9, 5.5,
 30, '1 scoop (30g)', 'g',
 108, 172, 37, 112, 1.3, 1.9,
 0, 0, 0.7,
 0, 0, 0,
 '', '["Vanilla", "Chocolate", "Cookies & Cream"]', 'europe', true, 'internal'),

-- Nutrend Carnitine (Czech Republic)
('Nutrend L-Carnitine 3000 Ampolla', 'Nutrend L-Carnitine 3000 Ampoule',
 'Nutrend', 'supplements', 'liquid',
 20, 0, 4, 0,
 25, '1 ampolla (25ml)', 'ml',
 10, 5, 0, 0, 0, 0,
 0, 0, 0,
 0, 0, 0,
 '', '["Cherry", "Green Apple", "Lime"]', 'europe', true, 'internal'),

-- Quamtrax Endurance Gel (Spain)
('Quamtrax Gel de Energía Endurance Naranja', 'Quamtrax Endurance Energy Gel Orange',
 'Quamtrax', 'supplements', 'gel',
 300, 1, 72, 0,
 45, '1 gel (45g)', 'g',
 50, 40, 10, 5, 0, 0,
 0, 0, 0,
 25, 0, 0,
 'Sodio 50mg', '["Orange", "Lemon", "Berry"]', 'south_america', true, 'internal'),

-- Prozis Electrolytes (Portugal)
('Prozis Electrolitos en Polvo Tropical', 'Prozis Electrolytes Powder Tropical',
 'Prozis', 'supplements', 'powder',
 15, 0, 3, 0,
 5, '1 scoop (5g)', 'g',
 500, 400, 80, 100, 0, 0,
 0, 0, 0,
 0, 0, 0,
 'Sodio 500mg, Potasio 400mg, Magnesio 80mg, Calcio 100mg', '["Tropical", "Lemon", "Watermelon"]', 'europe', true, 'internal'),

-- ENA Sport Hidratacion AR
('ENA Sport Hidratación Isotónica Limón', 'ENA Sport Isotonic Hydration Lemon',
 'ENA Sport', 'supplements', 'powder',
 170, 0, 42, 0,
 45, '1 scoop (45g)', 'g',
 600, 300, 60, 0, 0, 0,
 60, 0, 0,
 0, 0, 0,
 'Sodio 600mg, Potasio 300mg', '["Limón", "Naranja", "Manzana Verde"]', 'south_america', true, 'internal'),

-- Bodytech Colombia Creatina
('Bodytech Creatina Monohidrato', 'Bodytech Creatine Monohydrate',
 'Bodytech', 'supplements', 'powder',
 0, 0, 0, 0,
 5, '1 scoop (5g)', 'g',
 0, 0, 0, 0, 0, 0,
 0, 0, 0,
 0, 0, 5000,
 '', '["Unflavored"]', 'south_america', true, 'internal'),

-- Max Titanium Brazil Iso Zero
('Max Titanium Iso Zero Chocolate', 'Max Titanium Iso Zero Chocolate',
 'Max Titanium', 'supplements', 'powder',
 360, 80, 3, 1,
 30, '1 scoop (30g)', 'g',
 100, 160, 30, 100, 1, 1.5,
 0, 0, 0.5,
 0, 0, 0,
 '', '["Chocolate", "Vanilla", "Morango"]', 'south_america', true, 'internal'),

-- Integralmédica Brazil Beta-alanina
('Integralmédica Beta-Alanina Pura', 'Integralmédica Pure Beta-Alanine',
 'Integralmédica', 'supplements', 'powder',
 0, 0, 0, 0,
 3, '1 scoop (3g)', 'g',
 0, 0, 0, 0, 0, 0,
 0, 0, 0,
 0, 3200, 0,
 '', '["Unflavored"]', 'south_america', true, 'internal'),

-- Biogen Vitamin D3 South Africa/Kenya
('Biogen Vitamina D3 1000 UI', 'Biogen Vitamin D3 1000 IU',
 'Biogen', 'supplements', 'capsule',
 0, 0, 0, 0,
 1, '1 cápsula', 'capsule',
 0, 0, 0, 0, 0, 0,
 0, 25, 0,
 0, 0, 0,
 '', '["Unflavored"]', 'east_africa', true, 'internal'),

-- SSN Hyper Whey South Africa
('SSN Hyper Whey Chocolate Extremo', 'SSN Hyper Whey Extreme Chocolate',
 'SSN', 'supplements', 'powder',
 375, 73, 9, 5,
 30, '1 scoop (30g)', 'g',
 110, 175, 40, 115, 1.4, 2,
 0, 0, 0.8,
 0, 0, 0,
 '', '["Chocolate", "Vanilla", "Strawberry"]', 'east_africa', true, 'internal'),

-- NPL Hydro ISO South Africa/Kenya
('NPL Hydro ISO Protein Vainilla', 'NPL Hydro ISO Protein Vanilla',
 'NPL', 'supplements', 'powder',
 368, 82, 4, 1.5,
 30, '1 scoop (30g)', 'g',
 95, 165, 28, 108, 0.8, 1.6,
 0, 0, 0.4,
 0, 0, 0,
 '', '["Vanilla", "Chocolate", "Banana"]', 'east_africa', true, 'internal'),

-- Evox Omega-3 South Africa
('Evox Omega-3 Aceite de Pescado 1000mg', 'Evox Omega-3 Fish Oil 1000mg',
 'Evox', 'supplements', 'capsule',
 900, 0, 0, 100,
 1, '1 cápsula blanda', 'capsule',
 0, 0, 0, 0, 0, 0,
 0, 0, 0,
 0, 0, 0,
 '', '["Unflavored"]', 'east_africa', true, 'internal'),

-- USN Blue Lab Whey Salted Caramel
('USN Blue Lab Whey Caramelo Salado', 'USN Blue Lab Whey Salted Caramel',
 'USN', 'supplements', 'powder',
 378, 76, 7, 4,
 32, '1 scoop (32g)', 'g',
 135, 185, 42, 125, 1.5, 2.2,
 0, 0, 0.8,
 0, 0, 0,
 '', '["Salted Caramel", "Chocolate", "Vanilla", "Strawberry"]', 'east_africa', true, 'internal'),

-- OTE Energy Bar (UK)
('OTE Barra de Energía Avena y Miel', 'OTE Oat & Honey Energy Bar',
 'OTE Sports', 'supplements', 'bar',
 345, 6, 68, 5,
 65, '1 barra (65g)', 'g',
 80, 120, 25, 60, 1.2, 0.8,
 0, 0, 0,
 0, 0, 0,
 '', '["Honey Oat", "Banana", "Chocolate"]', 'europe', true, 'internal'),

-- Clif Bloks Citrus Caffeine (North America)
('Clif Bloks Cítricos con Cafeína', 'Clif Bloks Citrus with Caffeine',
 'Clif Bar', 'supplements', 'chew',
 280, 0, 70, 0,
 60, '6 bloques (60g)', 'g',
 70, 55, 10, 0, 0, 0,
 0, 0, 0,
 25, 0, 0,
 'Sodio 70mg', '["Citrus", "Tropical Punch", "Strawberry"]', 'north_america', true, 'internal'),

-- Maurten Bar 256
('Maurten Bar 256 Avena y Vainilla', 'Maurten Bar 256 Oat & Vanilla',
 'Maurten', 'supplements', 'bar',
 343, 6, 67, 4,
 88, '1 barra (88g)', 'g',
 100, 80, 20, 40, 0.5, 0.5,
 0, 0, 0,
 0, 0, 0,
 '', '["Oat & Vanilla"]', 'global', true, 'internal'),

-- Skratch Labs Sport Recovery Drink
('Skratch Labs Bebida de Recuperación Chocolate', 'Skratch Labs Sport Recovery Drink Chocolate',
 'Skratch Labs', 'supplements', 'powder',
 370, 18, 65, 3,
 65, '1 scoop (65g)', 'g',
 190, 350, 50, 200, 2, 2.5,
 0, 5, 1.2,
 0, 0, 0,
 'Sodio 190mg, Potasio 350mg', '["Chocolate", "Vanilla Latte"]', 'north_america', true, 'internal'),

-- Tailwind Rebuild Recovery (North America)
('Tailwind Rebuild Recuperación Post-Esfuerzo Cacao', 'Tailwind Rebuild Recovery Cocoa',
 'Tailwind Nutrition', 'supplements', 'powder',
 395, 20, 62, 5,
 68, '1 scoop (68g)', 'g',
 220, 380, 55, 180, 1.8, 2.2,
 10, 6, 1.4,
 0, 0, 0,
 'Sodio 220mg, Potasio 380mg', '["Cocoa", "Vanilla"]', 'north_america', true, 'internal'),

-- GU Energy Stroopwafel (Global)
('GU Stroopwafel Barquillo Energético Caramelo', 'GU Energy Stroopwafel Caramel Coffee',
 'GU Energy', 'supplements', 'bar',
 410, 4, 70, 10,
 32, '1 stroopwafel (32g)', 'g',
 70, 55, 10, 30, 0.5, 0.3,
 0, 0, 0,
 20, 0, 0,
 '', '["Caramel Coffee", "Salted Chocolate", "Wild Berry"]', 'north_america', true, 'internal')

ON CONFLICT DO NOTHING;
