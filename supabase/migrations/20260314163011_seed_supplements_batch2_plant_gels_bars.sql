/*
  # Seed Supplements Batch 2: Plant Protein, Energy Gels, Protein Bars
*/

INSERT INTO foods_v2 (
  name_es, name_en, category, brand, product_form, serving_unit, serving_size_g,
  serving_description, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g,
  fiber_per_100g, sugar_per_100g, sodium_mg, caffeine_mg, calcium_mg, iron_mg,
  is_supplement, is_verified, region, antidoping_note, source, flavors
) VALUES

-- ========== PLANT / VEGAN PROTEIN ==========
('Pea Protein Isolate', 'Pea Protein Isolate', 'supplements',
 'Myprotein', 'powder', 'scoop', 30,
 '1 scoop (30g)', 387, 83, 3, 6, 2, 1, 330, 0, 30, 9,
 true, true, 'global', '', 'internal',
 '["Unflavoured","Vanilla","Chocolate"]'::jsonb),

('Vegan Protein Blend', 'Vegan Protein Blend', 'supplements',
 'Optimum Nutrition', 'powder', 'scoop', 38,
 '1 scoop (38g)', 342, 61, 19, 5, 6, 8, 370, 0, 200, 6,
 true, true, 'north_america', 'Informed Sport certified',
 'internal', '["Chocolate","Vanilla","Creamy Vanilla"]'::jsonb),

('Sport Organic Plant Protein', 'Sport Organic Plant Protein', 'supplements',
 'Garden of Life', 'powder', 'scoop', 41,
 '1 scoop (41g)', 366, 61, 17, 7, 5, 5, 420, 0, 150, 8,
 true, true, 'north_america', 'NSF Certified for Sport',
 'internal', '["Chocolate","Vanilla","Berry Cherry"]'::jsonb),

('Soy Protein Isolate', 'Soy Protein Isolate', 'supplements',
 'Now Sports', 'powder', 'scoop', 28,
 '1 scoop (28g)', 393, 86, 0, 4, 0, 0, 290, 0, 200, 5,
 true, true, 'north_america', '', 'internal',
 '["Unflavoured","Chocolate","Vanilla"]'::jsonb),

('Vegan Vanilla Protein', 'Vegan Vanilla Protein', 'supplements',
 'Nuzest', 'powder', 'scoop', 25,
 '1 scoop (25g)', 388, 80, 4, 5, 2, 1, 280, 0, 120, 4,
 true, true, 'global', '', 'internal',
 '["Vanilla","Just Natural","Rich Chocolate","Wild Strawberry"]'::jsonb),

('Plant Protein Brown Rice', 'Plant Protein Brown Rice', 'supplements',
 'Sunwarrior', 'powder', 'scoop', 30,
 '1 scoop (30g)', 367, 73, 7, 3, 2, 1, 200, 0, 30, 5,
 true, true, 'north_america', '', 'internal',
 '["Natural","Vanilla","Chocolate","Mocha"]'::jsonb),

('Proteína Vegetal 100%', 'Plant Protein 100%', 'supplements',
 'Probiótica', 'powder', 'scoop', 30,
 '1 scoop (30g)', 367, 70, 6, 5, 3, 2, 250, 0, 90, 5,
 true, true, 'south_america', '', 'internal',
 '["Chocolate","Baunilha"]'::jsonb),

-- ========== ENERGY GELS ==========
('GU Energy Gel', 'GU Energy Gel', 'supplements',
 'GU Energy Labs', 'gel', 'sachet', 32,
 '1 sachet (32g)', 344, 3, 75, 3, 0, 19, 200, 40, 0, 0,
 true, true, 'north_america', 'Informed Sport certified',
 'internal', '["Salted Caramel","Chocolate Outrage","Jet Blackberry","Tri-Berry","Vanilla Bean"]'::jsonb),

('GU Roctane Energy Gel', 'GU Roctane Energy Gel', 'supplements',
 'GU Energy Labs', 'gel', 'sachet', 32,
 '1 sachet (32g) — ultra endurance formula', 344, 3, 75, 3, 0, 16, 250, 35, 0, 0,
 true, true, 'north_america', 'Informed Sport certified',
 'internal', '["Vanilla Orange","Chocolate Coconut","Salted Watermelon","Blueberry Pomegranate"]'::jsonb),

('Maurten Gel 100', 'Maurten Gel 100', 'supplements',
 'Maurten', 'gel', 'sachet', 40,
 '1 sachet (40g)', 250, 0, 62, 0, 0, 26, 140, 0, 0, 0,
 true, true, 'global', '', 'internal',
 '["Unflavoured"]'::jsonb),

('Maurten Gel 100 CAF 100', 'Maurten Gel 100 CAF 100', 'supplements',
 'Maurten', 'gel', 'sachet', 40,
 '1 sachet (40g) — 100mg caffeine', 250, 0, 62, 0, 0, 26, 140, 250, 0, 0,
 true, true, 'global', 'Used by elite marathoners',
 'internal', '["Unflavoured"]'::jsonb),

('SiS GO Energy Gel', 'SiS GO Energy Gel', 'supplements',
 'Science in Sport', 'gel', 'sachet', 60,
 '1 sachet (60g)', 83, 0, 20, 0, 0, 4, 50, 0, 0, 0,
 true, true, 'europe', 'Informed Sport certified',
 'internal', '["Lemon","Berry","Apple","Orange","Tropical"]'::jsonb),

('SiS GO Energy + Caffeine Gel', 'SiS GO Energy + Caffeine Gel', 'supplements',
 'Science in Sport', 'gel', 'sachet', 60,
 '1 sachet (60g) — 75mg caffeine', 83, 0, 20, 0, 0, 4, 50, 125, 0, 0,
 true, true, 'europe', 'Informed Sport certified',
 'internal', '["Cola","Lemon & Mint","Espresso"]'::jsonb),

('Powerbar Powergel', 'Powerbar Powergel', 'supplements',
 'PowerBar', 'gel', 'sachet', 41,
 '1 sachet (41g)', 244, 0, 58, 0, 0, 14, 220, 0, 0, 0,
 true, true, 'global', '', 'internal',
 '["Raspberry","Mango","Chocolate","Strawberry-Banana"]'::jsonb),

('Clif Shot Energy Gel', 'Clif Shot Energy Gel', 'supplements',
 'Clif Bar', 'gel', 'sachet', 34,
 '1 sachet (34g)', 365, 3, 76, 3, 0, 23, 115, 25, 0, 0,
 true, true, 'north_america', '', 'internal',
 '["Chocolate","Vanilla","Citrus","Strawberry","Double Espresso (100mg caf)"]'::jsonb),

('USN Energy Gel', 'USN Energy Gel', 'supplements',
 'USN', 'gel', 'sachet', 40,
 '1 sachet (40g)', 225, 1, 55, 0, 0, 10, 160, 0, 0, 0,
 true, true, 'east_africa', '', 'internal',
 '["Orange","Berry","Tropical"]'::jsonb),

-- ========== PROTEIN BARS ==========
('Quest Bar', 'Quest Bar', 'supplements',
 'Quest Nutrition', 'bar', 'bar', 60,
 '1 bar (60g)', 383, 37, 43, 15, 27, 4, 350, 0, 150, 2,
 true, true, 'north_america', 'Informed Choice certified',
 'internal', '["Chocolate Chip Cookie Dough","Birthday Cake","Cookies & Cream","Peanut Butter Chocolate Chip"]'::jsonb),

('RX Bar', 'RX Bar', 'supplements',
 'RXBAR', 'bar', 'bar', 52,
 '1 bar (52g)', 385, 29, 48, 13, 4, 25, 260, 0, 80, 3,
 true, true, 'north_america', '', 'internal',
 '["Chocolate Sea Salt","Blueberry","Peanut Butter","Mixed Berry","Mint Chocolate"]'::jsonb),

('Clif Bar', 'Clif Bar', 'supplements',
 'Clif Bar', 'bar', 'bar', 68,
 '1 bar (68g)', 368, 10, 65, 7, 5, 25, 200, 0, 100, 4,
 true, true, 'north_america', '', 'internal',
 '["Chocolate Chip","Oatmeal Raisin Walnut","White Chocolate Macadamia Nut","Blueberry Crisp"]'::jsonb),

('Grenade Carb Killa', 'Grenade Carb Killa', 'supplements',
 'Grenade', 'bar', 'bar', 60,
 '1 bar (60g)', 367, 37, 30, 15, 8, 3, 310, 0, 230, 2,
 true, true, 'europe', '', 'internal',
 '["Caramel Chaos","Dark Chocolate Raspberry","Chocolate Chip Salted Caramel","White Chocolate Cookie"]'::jsonb),

('Myprotein Protein Bar', 'Myprotein Protein Bar', 'supplements',
 'Myprotein', 'bar', 'bar', 65,
 '1 bar (65g)', 369, 37, 33, 12, 11, 4, 280, 0, 180, 2,
 true, true, 'europe', 'Informed Sport certified',
 'internal', '["Chocolate Brownie","Cookies & Cream","Lemon Drizzle","Rocky Road"]'::jsonb),

('ONE Bar', 'ONE Bar', 'supplements',
 'ONE Brands', 'bar', 'bar', 60,
 '1 bar (60g)', 333, 37, 35, 9, 10, 1, 350, 0, 200, 2,
 true, true, 'north_america', '', 'internal',
 '["Birthday Cake","Chocolate Brownie","Peanut Butter Pie","Maple Glazed Doughnut"]'::jsonb),

('USN Protein Bar', 'USN Protein Bar', 'supplements',
 'USN', 'bar', 'bar', 60,
 '1 bar (60g)', 367, 38, 33, 11, 8, 5, 300, 0, 190, 2,
 true, true, 'east_africa', '', 'internal',
 '["Chocolate","Vanilla","Strawberry Cream","Caramel"]'::jsonb),

('PowerBar Protein Plus', 'PowerBar Protein Plus', 'supplements',
 'PowerBar', 'bar', 'bar', 65,
 '1 bar (65g)', 385, 37, 40, 12, 2, 18, 260, 0, 200, 2,
 true, true, 'global', '', 'internal',
 '["Chocolate Peanut Butter","Vanilla Caramel","Chocolate Brownie"]'::jsonb)

ON CONFLICT DO NOTHING;
