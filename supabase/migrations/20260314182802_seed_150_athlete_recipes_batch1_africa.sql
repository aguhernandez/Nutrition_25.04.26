/*
  # Seed 150 Athlete Recipes - Batch 1: Ethiopian & Kenyan Runners (50 recipes)

  System recipes (user_id = NULL, is_public = true) covering:
  - Ethiopian running culture: injera, teff porridge, shiro
  - Kenyan running culture: ugali, sukuma wiki, githeri, arrowroot
  - East African endurance athlete favorites
  All recipes are bilingual (name_es + name_en + name field)
*/

INSERT INTO recipes (
  user_id, name, name_es, name_en, description, category,
  prep_time_min, cook_time_min, servings,
  ingredients, instructions,
  calories_kcal, carbs_g, protein_g, fat_g, fiber_g, sodium_mg,
  tags, suitable_for, image_url, is_public, culture
) VALUES

-- ETHIOPIAN RUNNER RECIPES
('00000000-0000-0000-0000-000000000000'::uuid,
 'Gachas de Teff Etíope', 'Gachas de Teff Etíope', 'Ethiopian Teff Porridge',
 'Desayuno tradicional etíope rico en hierro y carbohidratos. Base de la dieta de los corredores de Etiopía. / Traditional Ethiopian breakfast, rich in iron and carbs. Staple of Ethiopian runners.',
 'breakfast', 10, 20, 1,
 '[{"name":"Harina de teff / Teff flour","quantity":80,"unit":"g","calories":280,"carbs":56,"protein":10,"fat":2},{"name":"Agua / Water","quantity":400,"unit":"ml","calories":0,"carbs":0,"protein":0,"fat":0},{"name":"Miel / Honey","quantity":20,"unit":"g","calories":60,"carbs":16,"protein":0,"fat":0},{"name":"Banana / Banana","quantity":100,"unit":"g","calories":89,"carbs":23,"protein":1,"fat":0}]',
 '1. Hervir el agua en una olla mediana. / Bring water to boil in medium pot.
2. Agregar la harina de teff poco a poco, revolviendo constantemente. / Add teff flour gradually, stirring constantly.
3. Cocinar a fuego bajo por 15-20 minutos hasta espesar. / Cook on low heat 15-20 min until thick.
4. Servir con miel y banana en rodajas. / Serve with honey and sliced banana.',
 429, 95, 11, 2, 8, 15,
 '["teff","hierro","Ethiopia","corredor","desayuno","bajo en grasa"]',
 '["endurance","runners","vegetarian"]',
 'https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg',
 true, 'ethiopian'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Injera con Lentejas Misir', 'Injera con Lentejas Misir', 'Injera with Misir Lentils',
 'El plato principal etíope por excelencia. La injera es pan fermentado de teff, alta en carbohidratos complejos. / The quintessential Ethiopian main dish. Injera is fermented teff flatbread, high in complex carbs.',
 'lunch', 15, 30, 2,
 '[{"name":"Injera / Injera bread","quantity":200,"unit":"g","calories":350,"carbs":70,"protein":10,"fat":2},{"name":"Lentejas rojas / Red lentils","quantity":150,"unit":"g","calories":180,"carbs":30,"protein":13,"fat":1},{"name":"Cebolla / Onion","quantity":80,"unit":"g","calories":32,"carbs":7,"protein":1,"fat":0},{"name":"Berbere (mezcla de especias) / Berbere spice mix","quantity":10,"unit":"g","calories":30,"carbs":5,"protein":1,"fat":1},{"name":"Aceite / Oil","quantity":15,"unit":"ml","calories":135,"carbs":0,"protein":0,"fat":15}]',
 '1. Cocinar lentejas en agua hasta ablandar (15 min). / Cook lentils in water until soft (15 min).
2. Sofreír cebolla con aceite hasta dorar. / Sauté onion in oil until golden.
3. Agregar berbere y lentejas cocidas, mezclar bien. / Add berbere and cooked lentils, mix well.
4. Servir sobre la injera como plato común. / Serve on top of injera as communal dish.',
 727, 112, 25, 19, 18, 420,
 '["injera","teff","lentils","Ethiopia","traditional","carb-load"]',
 '["endurance","vegetarian","gluten-free"]',
 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
 true, 'ethiopian'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Shiro Wat (Puré de Garbanzos Etíope)', 'Shiro Wat (Puré de Garbanzos Etíope)', 'Shiro Wat (Ethiopian Chickpea Stew)',
 'Estofado cremoso de harina de garbanzos, ideal para recuperación muscular. Muy popular entre los corredores etíopes. / Creamy chickpea flour stew, ideal for muscle recovery. Very popular among Ethiopian runners.',
 'dinner', 5, 25, 2,
 '[{"name":"Harina de garbanzo / Chickpea flour","quantity":100,"unit":"g","calories":360,"carbs":58,"protein":22,"fat":6},{"name":"Cebolla / Onion","quantity":100,"unit":"g","calories":40,"carbs":9,"protein":1,"fat":0},{"name":"Ajo / Garlic","quantity":10,"unit":"g","calories":15,"carbs":3,"protein":1,"fat":0},{"name":"Berbere / Berbere","quantity":8,"unit":"g","calories":24,"carbs":4,"protein":1,"fat":1},{"name":"Aceite de niter kibbeh / Spiced butter","quantity":20,"unit":"ml","calories":180,"carbs":0,"protein":0,"fat":20}]',
 '1. Sofreír cebolla y ajo con aceite especiado. / Sauté onion and garlic in spiced butter.
2. Agregar berbere y cocinar 2 minutos. / Add berbere and cook 2 minutes.
3. Incorporar harina de garbanzo con 300ml agua. / Add chickpea flour with 300ml water.
4. Cocinar 20 min revolviendo hasta consistencia cremosa. / Cook 20 min stirring until creamy.',
 619, 74, 24, 27, 12, 380,
 '["shiro","Ethiopia","garbanzo","proteína","recovery","tradicional"]',
 '["endurance","vegetarian","high-protein"]',
 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
 true, 'ethiopian'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Batido de Mango y Teff', 'Batido de Mango y Teff', 'Mango Teff Recovery Smoothie',
 'Batido de recuperación con mango fresco y teff tostado. Rico en antioxidantes y hierro. / Recovery smoothie with fresh mango and toasted teff. Rich in antioxidants and iron.',
 'post_race', 5, 0, 1,
 '[{"name":"Mango fresco / Fresh mango","quantity":200,"unit":"g","calories":130,"carbs":32,"protein":2,"fat":1},{"name":"Teff tostado / Toasted teff","quantity":30,"unit":"g","calories":105,"carbs":21,"protein":4,"fat":1},{"name":"Leche / Milk","quantity":200,"unit":"ml","calories":98,"carbs":10,"protein":7,"fat":4},{"name":"Jengibre / Ginger","quantity":5,"unit":"g","calories":5,"carbs":1,"protein":0,"fat":0},{"name":"Miel / Honey","quantity":15,"unit":"g","calories":46,"carbs":12,"protein":0,"fat":0}]',
 '1. Colocar todos los ingredientes en licuadora. / Place all ingredients in blender.
2. Licuar hasta obtener mezcla homogénea. / Blend until smooth.
3. Servir inmediatamente. / Serve immediately.',
 384, 76, 13, 6, 5, 105,
 '["smoothie","mango","teff","recovery","antioxidantes","hierro"]',
 '["endurance","post-race","vegetarian"]',
 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg',
 true, 'ethiopian'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Avena Etíope con Especias', 'Avena Etíope con Especias', 'Ethiopian Spiced Oatmeal',
 'Avena con especias etíopes como cardamomo y canela. Energía sostenida para entrenamientos largos. / Oatmeal with Ethiopian spices like cardamom and cinnamon. Sustained energy for long training.',
 'breakfast', 5, 10, 1,
 '[{"name":"Avena / Oats","quantity":80,"unit":"g","calories":312,"carbs":52,"protein":11,"fat":6},{"name":"Leche / Milk","quantity":250,"unit":"ml","calories":122,"carbs":12,"protein":9,"fat":5},{"name":"Cardamomo / Cardamom","quantity":2,"unit":"g","calories":6,"carbs":1,"protein":0,"fat":0},{"name":"Canela / Cinnamon","quantity":2,"unit":"g","calories":5,"carbs":2,"protein":0,"fat":0},{"name":"Miel / Honey","quantity":20,"unit":"g","calories":60,"carbs":16,"protein":0,"fat":0},{"name":"Nueces / Nuts","quantity":20,"unit":"g","calories":130,"carbs":3,"protein":3,"fat":12}]',
 '1. Calentar leche en olla. / Heat milk in pot.
2. Agregar avena y cocinar 5 min revolviendo. / Add oats and cook 5 min stirring.
3. Incorporar especias y miel. / Add spices and honey.
4. Servir con nueces por encima. / Serve topped with nuts.',
 635, 86, 23, 23, 9, 130,
 '["avena","Ethiopia","especias","desayuno","energía"]',
 '["endurance","vegetarian","pre-training"]',
 'https://images.pexels.com/photos/543730/pexels-photo-543730.jpeg',
 true, 'ethiopian'),

-- KENYAN RUNNER RECIPES
('00000000-0000-0000-0000-000000000000'::uuid,
 'Ugali con Sukuma Wiki', 'Ugali con Sukuma Wiki', 'Ugali with Sukuma Wiki',
 'El alimento base de los corredores keniatas. Polenta de maíz blanco con hojas de col salteadas. Alta densidad calórica y carbohidratos complejos. / The staple food of Kenyan runners. White corn porridge with sautéed collard greens.',
 'lunch', 5, 25, 2,
 '[{"name":"Harina de maíz ugali / White cornmeal","quantity":200,"unit":"g","calories":720,"carbs":154,"protein":16,"fat":4},{"name":"Sukuma wiki (col/kale) / Collard greens","quantity":150,"unit":"g","calories":60,"carbs":10,"protein":5,"fat":1},{"name":"Tomate / Tomato","quantity":100,"unit":"g","calories":18,"carbs":4,"protein":1,"fat":0},{"name":"Cebolla / Onion","quantity":60,"unit":"g","calories":24,"carbs":5,"protein":1,"fat":0},{"name":"Aceite / Oil","quantity":15,"unit":"ml","calories":135,"carbs":0,"protein":0,"fat":15}]',
 '1. Hervir 600ml agua con sal. / Boil 600ml water with salt.
2. Agregar harina de maíz revolviendo vigorosamente hasta obtener masa firme. / Add cornmeal stirring vigorously until stiff dough forms.
3. Cocinar 20 min a fuego bajo tapado. / Cook 20 min on low heat covered.
4. Saltear sukuma wiki con tomate y cebolla. / Sauté greens with tomato and onion.
5. Servir ugali con sukuma wiki al lado. / Serve ugali with sukuma wiki on side.',
 957, 173, 23, 20, 15, 280,
 '["ugali","Kenya","maíz","corredor","tradicional","carb-load"]',
 '["endurance","vegetarian","runners"]',
 'https://images.pexels.com/photos/5949901/pexels-photo-5949901.jpeg',
 true, 'kenyan'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Githeri (Maíz y Frijoles Keniata)', 'Githeri (Maíz y Frijoles Keniata)', 'Githeri (Kenyan Corn and Beans)',
 'Plato ancestral keniata de maíz y frijoles. Proteína y carbohidratos completos. El plato favorito de muchos campeones olímpicos keniatas. / Ancient Kenyan dish of corn and beans. Complete protein and carbs. Favorite of many Kenyan Olympic champions.',
 'lunch', 10, 60, 4,
 '[{"name":"Maíz seco / Dry corn kernels","quantity":200,"unit":"g","calories":680,"carbs":138,"protein":18,"fat":8},{"name":"Frijoles rojos / Red kidney beans","quantity":150,"unit":"g","calories":375,"carbs":68,"protein":24,"fat":2},{"name":"Tomate / Tomato","quantity":120,"unit":"g","calories":22,"carbs":5,"protein":1,"fat":0},{"name":"Cebolla / Onion","quantity":80,"unit":"g","calories":32,"carbs":7,"protein":1,"fat":0},{"name":"Aceite / Oil","quantity":20,"unit":"ml","calories":180,"carbs":0,"protein":0,"fat":20}]',
 '1. Remojar maíz y frijoles toda la noche. / Soak corn and beans overnight.
2. Hervir juntos 45-60 min hasta ablandar. / Boil together 45-60 min until soft.
3. Sofreír cebolla y tomate en aceite. / Sauté onion and tomato in oil.
4. Mezclar con el maíz y frijoles cocidos. / Mix with cooked corn and beans.
5. Sazonar al gusto y servir. / Season to taste and serve.',
 1289, 218, 44, 30, 30, 320,
 '["githeri","Kenya","maíz","frijoles","proteína completa","tradicional"]',
 '["endurance","vegetarian","high-protein"]',
 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
 true, 'kenyan'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Arrurruz con Leche de Cabra Keniata', 'Arrurruz con Leche de Cabra Keniata', 'Kenyan Arrowroot with Goat Milk Porridge',
 'Papilla de arrurruz con leche de cabra. Fácil digestión, ideal antes de competencias. Usado por corredores del Valle del Rift. / Arrowroot porridge with goat milk. Easy digestion, ideal before races. Used by Rift Valley runners.',
 'pre_race', 5, 20, 1,
 '[{"name":"Arrurruz / Arrowroot","quantity":150,"unit":"g","calories":155,"carbs":38,"protein":1,"fat":0},{"name":"Leche de cabra / Goat milk","quantity":300,"unit":"ml","calories":185,"carbs":13,"protein":9,"fat":11},{"name":"Azúcar / Sugar","quantity":15,"unit":"g","calories":58,"carbs":15,"protein":0,"fat":0},{"name":"Canela / Cinnamon","quantity":2,"unit":"g","calories":5,"carbs":2,"protein":0,"fat":0}]',
 '1. Pelar y cortar el arrurruz en trozos pequeños. / Peel and cut arrowroot into small pieces.
2. Hervir con leche de cabra 20 minutos. / Boil with goat milk for 20 minutes.
3. Aplastar hasta obtener papilla suave. / Mash until smooth porridge.
4. Agregar azúcar y canela al gusto. / Add sugar and cinnamon to taste.',
 403, 68, 10, 11, 4, 130,
 '["arrurruz","leche de cabra","Kenya","pre-carrera","digestión fácil"]',
 '["endurance","pre-race","easy-digest"]',
 'https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg',
 true, 'kenyan'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Batido de Plátano y Leche Entera Keniata', 'Batido de Plátano y Leche Entera Keniata', 'Kenyan Banana Whole Milk Shake',
 'Recuperación simple y efectiva usada por los corredores de Iten, Kenia. Plátano para el potasio y carbohidratos rápidos. / Simple and effective recovery used by Iten runners in Kenya. Banana for potassium and fast carbs.',
 'post_race', 5, 0, 1,
 '[{"name":"Plátano maduro / Ripe banana","quantity":200,"unit":"g","calories":178,"carbs":46,"protein":2,"fat":1},{"name":"Leche entera / Whole milk","quantity":400,"unit":"ml","calories":244,"carbs":18,"protein":13,"fat":14},{"name":"Azúcar / Sugar","quantity":10,"unit":"g","calories":39,"carbs":10,"protein":0,"fat":0}]',
 '1. Pelar plátano y colocar en licuadora. / Peel banana and place in blender.
2. Agregar leche y azúcar. / Add milk and sugar.
3. Licuar 30 segundos hasta homogéneo. / Blend 30 seconds until smooth.
4. Beber inmediatamente post-entrenamiento. / Drink immediately post-training.',
 461, 74, 15, 15, 3, 165,
 '["plátano","leche","Kenya","recovery","potasio","simple"]',
 '["endurance","post-race","recovery"]',
 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg',
 true, 'kenyan'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Chapati Keniata', 'Chapati Keniata', 'Kenyan Chapati',
 'Pan plano keniata de harina de trigo. Más nutritivo que el pan blanco, excelente fuente de energía para entrenamientos. / Kenyan wheat flatbread. More nutritious than white bread, excellent energy source for training.',
 'snack', 15, 20, 4,
 '[{"name":"Harina de trigo / Wheat flour","quantity":250,"unit":"g","calories":855,"carbs":178,"protein":28,"fat":4},{"name":"Agua tibia / Warm water","quantity":150,"unit":"ml","calories":0,"carbs":0,"protein":0,"fat":0},{"name":"Aceite / Oil","quantity":30,"unit":"ml","calories":270,"carbs":0,"protein":0,"fat":30},{"name":"Sal / Salt","quantity":5,"unit":"g","calories":0,"carbs":0,"protein":0,"fat":0}]',
 '1. Mezclar harina, sal y agua hasta formar masa. / Mix flour, salt and water to form dough.
2. Amasar 10 min hasta suave y elástica. / Knead 10 min until smooth and elastic.
3. Dividir en 4 porciones y estirar fino. / Divide into 4 portions and roll thin.
4. Cocinar en sartén caliente con un poco de aceite. / Cook in hot pan with a little oil.
5. Dar vuelta cuando aparezcan burbujas. / Flip when bubbles appear.',
 1125, 178, 28, 34, 8, 1200,
 '["chapati","Kenya","pan","carbohidratos","energía","tradicional"]',
 '["endurance","vegetarian","snack"]',
 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
 true, 'kenyan'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Mandazi (Rosquillas Keniatas)', 'Mandazi (Rosquillas Keniatas)', 'Mandazi (Kenyan Doughnuts)',
 'Bollos fritos esponjosos, ricos en carbohidratos. Snack común entre corredores keniatas antes de entrenamientos matutinos. / Fluffy fried buns, rich in carbohydrates. Common snack among Kenyan runners before morning training.',
 'pre_race', 20, 15, 6,
 '[{"name":"Harina de trigo / Wheat flour","quantity":300,"unit":"g","calories":1026,"carbs":214,"protein":33,"fat":5},{"name":"Leche de coco / Coconut milk","quantity":150,"unit":"ml","calories":225,"carbs":8,"protein":2,"fat":21},{"name":"Azúcar / Sugar","quantity":50,"unit":"g","calories":193,"carbs":50,"protein":0,"fat":0},{"name":"Levadura / Yeast","quantity":7,"unit":"g","calories":22,"carbs":3,"protein":3,"fat":0},{"name":"Aceite para freír / Oil for frying","quantity":30,"unit":"ml","calories":270,"carbs":0,"protein":0,"fat":30}]',
 '1. Mezclar harina, azúcar, levadura y leche de coco. / Mix flour, sugar, yeast and coconut milk.
2. Amasar hasta masa suave, dejar reposar 30 min. / Knead until smooth, rest 30 min.
3. Estirar y cortar en triángulos. / Roll and cut into triangles.
4. Freír en aceite caliente hasta dorar. / Fry in hot oil until golden.',
 1736, 275, 38, 56, 10, 120,
 '["mandazi","Kenya","desayuno","carbohidratos","frito","tradicional"]',
 '["endurance","pre-race","athletes"]',
 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
 true, 'kenyan'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Té con Leche Keniata (Chai ya Maziwa)', 'Té con Leche Keniata (Chai ya Maziwa)', 'Kenyan Milk Tea (Chai ya Maziwa)',
 'El té con leche keniata: fuerte, con leche completa y azúcar. Parte del ritual pre-entrenamiento de los corredores de Iten. / Kenyan milk tea: strong, with full milk and sugar. Part of the pre-training ritual of Iten runners.',
 'breakfast', 2, 10, 1,
 '[{"name":"Té negro fuerte / Strong black tea","quantity":300,"unit":"ml","calories":5,"carbs":1,"protein":0,"fat":0},{"name":"Leche entera / Whole milk","quantity":200,"unit":"ml","calories":122,"carbs":10,"protein":6,"fat":7},{"name":"Azúcar / Sugar","quantity":25,"unit":"g","calories":97,"carbs":25,"protein":0,"fat":0},{"name":"Jengibre / Ginger","quantity":5,"unit":"g","calories":5,"carbs":1,"protein":0,"fat":0}]',
 '1. Hervir agua con jengibre 5 min. / Boil water with ginger 5 min.
2. Agregar té negro y hervir 2 min. / Add black tea and boil 2 min.
3. Añadir leche y azúcar. / Add milk and sugar.
4. Colar y servir caliente. / Strain and serve hot.',
 229, 37, 6, 7, 0, 90,
 '["té","Kenya","leche","desayuno","ritual","energía"]',
 '["endurance","runners","pre-training"]',
 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
 true, 'kenyan'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Pollo Guisado Keniata con Arroz', 'Pollo Guisado Keniata con Arroz', 'Kenyan Chicken Stew with Rice',
 'Guiso de pollo con especias africanas servido sobre arroz. Excelente para recuperación proteica post-competencia. / Chicken stew with African spices served over rice. Excellent for post-competition protein recovery.',
 'dinner', 15, 40, 3,
 '[{"name":"Pollo / Chicken","quantity":400,"unit":"g","calories":660,"carbs":0,"protein":80,"fat":36},{"name":"Arroz / Rice","quantity":250,"unit":"g","calories":890,"carbs":196,"protein":18,"fat":2},{"name":"Tomate / Tomato","quantity":200,"unit":"g","calories":36,"carbs":8,"protein":2,"fat":0},{"name":"Cebolla / Onion","quantity":100,"unit":"g","calories":40,"carbs":9,"protein":1,"fat":0},{"name":"Especias africanas / African spices","quantity":10,"unit":"g","calories":30,"carbs":5,"protein":1,"fat":1},{"name":"Aceite / Oil","quantity":20,"unit":"ml","calories":180,"carbs":0,"protein":0,"fat":20}]',
 '1. Dorar el pollo en aceite caliente. / Brown chicken in hot oil.
2. Agregar cebolla y tomate picados. / Add chopped onion and tomato.
3. Incorporar especias y cocinar 30 min. / Add spices and cook 30 min.
4. Servir sobre arroz cocido. / Serve over cooked rice.',
 1836, 218, 102, 59, 8, 480,
 '["pollo","Kenya","arroz","proteína","recuperación","guiso"]',
 '["endurance","high-protein","recovery"]',
 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
 true, 'kenyan'),

-- NORTH AFRICAN (Morocco, Tunisia) RUNNER RECIPES
('00000000-0000-0000-0000-000000000000'::uuid,
 'Cuscús con Verduras Marroquí', 'Cuscús con Verduras Marroquí', 'Moroccan Vegetable Couscous',
 'Cargamento de carbohidratos pre-competencia. Rico en semolina, verduras y especias del Norte de África. Favorito de los corredores marroquíes. / Pre-competition carb loading. Rich in semolina, vegetables and North African spices. Favorite of Moroccan runners.',
 'pre_race', 10, 20, 2,
 '[{"name":"Cuscús / Couscous","quantity":200,"unit":"g","calories":700,"carbs":146,"protein":24,"fat":2},{"name":"Zucchini / Zucchini","quantity":150,"unit":"g","calories":24,"carbs":4,"protein":2,"fat":0},{"name":"Zanahoria / Carrot","quantity":100,"unit":"g","calories":41,"carbs":10,"protein":1,"fat":0},{"name":"Caldo de verduras / Vegetable broth","quantity":400,"unit":"ml","calories":20,"carbs":4,"protein":1,"fat":0},{"name":"Ras el hanout / Ras el hanout","quantity":8,"unit":"g","calories":25,"carbs":4,"protein":1,"fat":1},{"name":"Aceite de oliva / Olive oil","quantity":20,"unit":"ml","calories":180,"carbs":0,"protein":0,"fat":20}]',
 '1. Hervir caldo con especias. / Boil broth with spices.
2. Verter sobre cuscús, tapar 5 min. / Pour over couscous, cover 5 min.
3. Sofreír verduras en aceite de oliva. / Sauté vegetables in olive oil.
4. Mezclar cuscús esponjado con verduras. / Mix fluffy couscous with vegetables.',
 990, 168, 28, 23, 12, 380,
 '["cuscús","Marruecos","carbohidratos","pre-carrera","especias","Norte de África"]',
 '["endurance","vegetarian","pre-race"]',
 'https://images.pexels.com/photos/5949901/pexels-photo-5949901.jpeg',
 true, 'north_african'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Harira (Sopa de Lentejas Marroquí)', 'Harira (Sopa de Lentejas Marroquí)', 'Harira (Moroccan Lentil Soup)',
 'Sopa nutritiva con lentejas, garbanzos y tomate. Ideal para recuperación y reposición de glucógeno. / Nutritious soup with lentils, chickpeas and tomato. Ideal for recovery and glycogen replenishment.',
 'recovery', 15, 40, 4,
 '[{"name":"Lentejas / Lentils","quantity":150,"unit":"g","calories":180,"carbs":30,"protein":13,"fat":1},{"name":"Garbanzos / Chickpeas","quantity":100,"unit":"g","calories":240,"carbs":40,"protein":13,"fat":4},{"name":"Tomate / Tomato","quantity":200,"unit":"g","calories":36,"carbs":8,"protein":2,"fat":0},{"name":"Apio / Celery","quantity":80,"unit":"g","calories":16,"carbs":3,"protein":1,"fat":0},{"name":"Limón / Lemon","quantity":30,"unit":"g","calories":9,"carbs":3,"protein":0,"fat":0},{"name":"Cilantro / Cilantro","quantity":15,"unit":"g","calories":5,"carbs":1,"protein":0,"fat":0}]',
 '1. Hervir lentejas y garbanzos 30 min. / Boil lentils and chickpeas 30 min.
2. Agregar tomate y apio picados. / Add chopped tomato and celery.
3. Sazonar con especias y cocinar 10 min más. / Season with spices and cook 10 more min.
4. Servir con limón y cilantro fresco. / Serve with lemon and fresh cilantro.',
 486, 85, 29, 5, 20, 340,
 '["harira","Marruecos","lentejas","sopa","recuperación","proteína"]',
 '["endurance","vegetarian","recovery"]',
 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
 true, 'north_african'),

-- LATIN AMERICAN RUNNER RECIPES
('00000000-0000-0000-0000-000000000000'::uuid,
 'Arroz con Frijoles Negros (Clásico Latinoamericano)', 'Arroz con Frijoles Negros (Clásico Latinoamericano)', 'Rice and Black Beans (Latin Classic)',
 'El dúo clásico latinoamericano que ofrece proteína completa. Base de la dieta de atletas de resistencia de Cuba, Colombia y Brasil. / The classic Latin American duo providing complete protein. Base diet of endurance athletes from Cuba, Colombia and Brazil.',
 'lunch', 10, 30, 2,
 '[{"name":"Arroz blanco / White rice","quantity":200,"unit":"g","calories":714,"carbs":158,"protein":14,"fat":2},{"name":"Frijoles negros / Black beans","quantity":200,"unit":"g","calories":320,"carbs":58,"protein":21,"fat":2},{"name":"Cebolla / Onion","quantity":60,"unit":"g","calories":24,"carbs":5,"protein":1,"fat":0},{"name":"Ajo / Garlic","quantity":10,"unit":"g","calories":15,"carbs":3,"protein":1,"fat":0},{"name":"Aceite / Oil","quantity":15,"unit":"ml","calories":135,"carbs":0,"protein":0,"fat":15},{"name":"Comino / Cumin","quantity":3,"unit":"g","calories":9,"carbs":1,"protein":0,"fat":0}]',
 '1. Cocinar arroz según instrucciones. / Cook rice according to instructions.
2. Sofreír ajo y cebolla con aceite. / Sauté garlic and onion in oil.
3. Agregar frijoles y comino, cocinar 10 min. / Add beans and cumin, cook 10 min.
4. Servir arroz con frijoles al lado. / Serve rice with beans on side.',
 1217, 225, 37, 19, 22, 320,
 '["arroz","frijoles","Latinoamérica","proteína completa","clásico","energía"]',
 '["endurance","vegetarian","complete-protein"]',
 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
 true, 'latin_american'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Arepas con Huevo y Aguacate (Colombia/Venezuela)', 'Arepas con Huevo y Aguacate (Colombia/Venezuela)', 'Arepas with Egg and Avocado (Colombia/Venezuela)',
 'Arepas de maíz con huevo y aguacate. Desayuno pre-entrenamiento ideal. Popular entre triatletas colombianos. / Corn arepas with egg and avocado. Ideal pre-training breakfast. Popular among Colombian triathletes.',
 'breakfast', 10, 15, 2,
 '[{"name":"Harina de maíz precocida / Pre-cooked cornmeal","quantity":200,"unit":"g","calories":760,"carbs":164,"protein":18,"fat":6},{"name":"Huevos / Eggs","quantity":120,"unit":"g","calories":185,"carbs":1,"protein":16,"fat":13},{"name":"Aguacate / Avocado","quantity":100,"unit":"g","calories":160,"carbs":9,"protein":2,"fat":15},{"name":"Sal / Salt","quantity":5,"unit":"g","calories":0,"carbs":0,"protein":0,"fat":0}]',
 '1. Mezclar harina de maíz con agua tibia y sal. / Mix cornmeal with warm water and salt.
2. Formar arepas redondas de 1cm de grosor. / Shape round arepas 1cm thick.
3. Cocinar en plancha caliente 7 min por lado. / Cook on hot griddle 7 min per side.
4. Abrir y rellenar con huevo frito y aguacate. / Open and fill with fried egg and avocado.',
 1105, 174, 36, 34, 14, 600,
 '["arepa","Colombia","Venezuela","maíz","aguacate","desayuno"]',
 '["endurance","vegetarian","pre-training"]',
 'https://images.pexels.com/photos/543730/pexels-photo-543730.jpeg',
 true, 'latin_american'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Locro Andino (Sopa de Papa y Maíz)', 'Locro Andino (Sopa de Papa y Maíz)', 'Andean Locro (Potato and Corn Soup)',
 'Sopa andina tradicional de papa y maíz. Fuente excelente de carbohidratos complejos para altitud. Popular en Ecuador, Perú y Argentina. / Traditional Andean potato and corn soup. Excellent source of complex carbs for altitude. Popular in Ecuador, Peru and Argentina.',
 'dinner', 15, 35, 3,
 '[{"name":"Papa / Potato","quantity":400,"unit":"g","calories":308,"carbs":70,"protein":8,"fat":0},{"name":"Maíz / Corn","quantity":150,"unit":"g","calories":173,"carbs":37,"protein":5,"fat":2},{"name":"Crema / Cream","quantity":80,"unit":"ml","calories":286,"carbs":2,"protein":2,"fat":30},{"name":"Cebolla / Onion","quantity":80,"unit":"g","calories":32,"carbs":7,"protein":1,"fat":0},{"name":"Queso / Cheese","quantity":60,"unit":"g","calories":217,"carbs":2,"protein":14,"fat":17}]',
 '1. Sofreír cebolla hasta transparente. / Sauté onion until transparent.
2. Agregar papas en cubos y cubrir con agua. / Add cubed potatoes and cover with water.
3. Cocinar 20 min hasta ablandar. / Cook 20 min until soft.
4. Agregar maíz, crema y queso. / Add corn, cream and cheese.
5. Sazonar y servir caliente. / Season and serve hot.',
 1016, 118, 30, 49, 12, 380,
 '["locro","Andes","papa","maíz","sopa","altitud","energía"]',
 '["endurance","vegetarian","high-altitude"]',
 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
 true, 'latin_american'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Tamal de Maíz Pre-Carrera', 'Tamal de Maíz Pre-Carrera', 'Pre-Race Corn Tamale',
 'Tamal de maíz clásico, energía lenta y sostenida. Ideal 2-3 horas antes de carrera. Tradicional de México, Guatemala y Colombia. / Classic corn tamale, slow and sustained energy. Ideal 2-3 hours before race. Traditional in Mexico, Guatemala and Colombia.',
 'pre_race', 30, 60, 4,
 '[{"name":"Masa de maíz / Corn masa","quantity":300,"unit":"g","calories":1050,"carbs":228,"protein":24,"fat":12},{"name":"Pollo / Chicken","quantity":200,"unit":"g","calories":330,"carbs":0,"protein":40,"fat":18},{"name":"Salsa verde / Green salsa","quantity":100,"unit":"g","calories":45,"carbs":8,"protein":2,"fat":1},{"name":"Hoja de maíz / Corn husks","quantity":0,"unit":"g","calories":0,"carbs":0,"protein":0,"fat":0}]',
 '1. Preparar la masa con manteca, agua y sal. / Prepare masa with lard, water and salt.
2. Extender masa en hoja de maíz húmeda. / Spread masa on wet corn husk.
3. Colocar pollo y salsa en el centro. / Place chicken and salsa in center.
4. Envolver y cocinar al vapor 1 hora. / Wrap and steam 1 hour.',
 1425, 236, 66, 31, 10, 520,
 '["tamal","México","Guatemala","maíz","pre-carrera","energía sostenida"]',
 '["endurance","pre-race","high-carb"]',
 'https://images.pexels.com/photos/5949901/pexels-photo-5949901.jpeg',
 true, 'latin_american'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Quinoa con Pollo y Verduras (Andino)', 'Quinoa con Pollo y Verduras (Andino)', 'Andean Quinoa with Chicken and Vegetables',
 'Superalimento andino con proteína completa. La quinoa tiene todos los aminoácidos esenciales. Favorita de atletas de Bolivia y Perú. / Andean superfood with complete protein. Quinoa has all essential amino acids. Favorite of athletes from Bolivia and Peru.',
 'lunch', 10, 25, 2,
 '[{"name":"Quinoa / Quinoa","quantity":160,"unit":"g","calories":591,"carbs":103,"protein":23,"fat":10},{"name":"Pechuga de pollo / Chicken breast","quantity":250,"unit":"g","calories":412,"carbs":0,"protein":77,"fat":9},{"name":"Pimiento / Bell pepper","quantity":100,"unit":"g","calories":31,"carbs":7,"protein":1,"fat":0},{"name":"Cebolla morada / Red onion","quantity":60,"unit":"g","calories":24,"carbs":5,"protein":1,"fat":0},{"name":"Limón / Lemon","quantity":30,"unit":"g","calories":9,"carbs":3,"protein":0,"fat":0}]',
 '1. Lavar quinoa y cocinar con doble agua 15 min. / Rinse quinoa and cook with double water 15 min.
2. Grilliar pollo con especias. / Grill chicken with spices.
3. Picar pimiento y cebolla morada. / Chop bell pepper and red onion.
4. Mezclar todo con jugo de limón. / Mix everything with lemon juice.',
 1067, 118, 102, 19, 14, 340,
 '["quinoa","Andes","pollo","proteína completa","Bolivia","Perú"]',
 '["endurance","high-protein","complete-protein"]',
 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
 true, 'latin_american'),

-- ASIAN ENDURANCE RECIPES
('00000000-0000-0000-0000-000000000000'::uuid,
 'Onigiri de Atún (Bola de Arroz Japonesa)', 'Onigiri de Atún (Bola de Arroz Japonesa)', 'Tuna Onigiri (Japanese Rice Ball)',
 'El snack de carrera favorito de los corredores japoneses. Carbohidratos rápidos, proteína y sodio en formato portátil. / The favorite race snack of Japanese runners. Fast carbs, protein and sodium in portable format.',
 'during_race', 15, 30, 4,
 '[{"name":"Arroz japonés / Japanese rice","quantity":300,"unit":"g","calories":1035,"carbs":228,"protein":21,"fat":2},{"name":"Atún en lata / Canned tuna","quantity":140,"unit":"g","calories":175,"carbs":0,"protein":37,"fat":2},{"name":"Mayonesa / Mayo","quantity":20,"unit":"g","calories":134,"carbs":0,"protein":0,"fat":15},{"name":"Alga nori / Nori seaweed","quantity":8,"unit":"g","calories":14,"carbs":2,"protein":2,"fat":0},{"name":"Sal / Salt","quantity":5,"unit":"g","calories":0,"carbs":0,"protein":0,"fat":0}]',
 '1. Cocinar arroz con poca sal. / Cook rice with little salt.
2. Mezclar atún con mayonesa. / Mix tuna with mayo.
3. Con manos húmedas, tomar arroz y poner atún en el centro. / With wet hands, take rice and put tuna in center.
4. Formar triángulo o bola apretando bien. / Shape into triangle or ball pressing firmly.
5. Envolver con nori. / Wrap with nori.',
 1358, 230, 60, 19, 3, 1200,
 '["onigiri","Japón","arroz","atún","durante-carrera","portátil"]',
 '["endurance","during-race","portable"]',
 'https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg',
 true, 'asian'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Congee de Pollo (Arroz Aguado Asiático)', 'Congee de Pollo (Arroz Aguado Asiático)', 'Chicken Congee (Asian Rice Porridge)',
 'Papilla de arroz ultra digestiva. Excelente para recuperación gastrointestinal post-carrera. Usada por atletas chinos y de toda Asia. / Ultra digestive rice porridge. Excellent for gastrointestinal recovery post-race. Used by Chinese athletes across Asia.',
 'recovery', 5, 45, 2,
 '[{"name":"Arroz de grano largo / Long grain rice","quantity":100,"unit":"g","calories":365,"carbs":80,"protein":8,"fat":1},{"name":"Caldo de pollo / Chicken broth","quantity":800,"unit":"ml","calories":40,"carbs":2,"protein":4,"fat":2},{"name":"Pollo / Chicken","quantity":150,"unit":"g","calories":248,"carbs":0,"protein":30,"fat":14},{"name":"Jengibre / Ginger","quantity":10,"unit":"g","calories":8,"carbs":2,"protein":0,"fat":0},{"name":"Cebollín / Green onion","quantity":20,"unit":"g","calories":8,"carbs":1,"protein":0,"fat":0}]',
 '1. Hervir arroz en caldo 45 min hasta muy blando. / Boil rice in broth 45 min until very soft.
2. Agregar pollo desmenuzado y jengibre. / Add shredded chicken and ginger.
3. Cocinar 10 min más. / Cook 10 more min.
4. Servir con cebollín picado. / Serve with chopped green onion.',
 669, 83, 42, 17, 3, 540,
 '["congee","China","arroz","digestión","recovery","pollo"]',
 '["endurance","recovery","easy-digest"]',
 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
 true, 'asian'),

-- EUROPEAN ENDURANCE RECIPES
('00000000-0000-0000-0000-000000000000'::uuid,
 'Pasta al Pesto con Pechuga de Pollo (Italia)', 'Pasta al Pesto con Pechuga de Pollo (Italia)', 'Chicken Pesto Pasta (Italy)',
 'Clásico de pre-carrera italiano. Hidratos de carbono complejos con proteína magra. Base de los corredores y ciclistas italianos. / Classic Italian pre-race meal. Complex carbohydrates with lean protein. Base of Italian runners and cyclists.',
 'pre_race', 10, 20, 2,
 '[{"name":"Pasta / Pasta","quantity":200,"unit":"g","calories":714,"carbs":142,"protein":26,"fat":4},{"name":"Pechuga de pollo / Chicken breast","quantity":200,"unit":"g","calories":330,"carbs":0,"protein":62,"fat":7},{"name":"Pesto / Pesto","quantity":60,"unit":"g","calories":300,"carbs":4,"protein":5,"fat":30},{"name":"Parmesano / Parmesan","quantity":30,"unit":"g","calories":117,"carbs":0,"protein":11,"fat":8}]',
 '1. Cocinar pasta al dente. / Cook pasta al dente.
2. Grilliar pollo y cortar en lonchas. / Grill chicken and slice.
3. Mezclar pasta caliente con pesto. / Mix hot pasta with pesto.
4. Agregar pollo y parmesano rallado. / Add chicken and grated parmesan.',
 1461, 146, 104, 49, 8, 480,
 '["pasta","Italia","pesto","pollo","pre-carrera","carbohidratos"]',
 '["endurance","high-protein","pre-race"]',
 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
 true, 'european'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Porridge Escocés con Bayas', 'Porridge Escocés con Bayas', 'Scottish Oat Porridge with Berries',
 'Avena tradicional escocesa de corte grueso. Más fibra y digestión más lenta que la avena instantánea. Clásico de los corredores británicos. / Traditional Scottish thick-cut oats. More fiber and slower digestion than instant oats. Classic of British runners.',
 'breakfast', 5, 15, 1,
 '[{"name":"Avena de corte grueso / Steel-cut oats","quantity":80,"unit":"g","calories":312,"carbs":52,"protein":11,"fat":6},{"name":"Leche / Milk","quantity":300,"unit":"ml","calories":147,"carbs":14,"protein":10,"fat":8},{"name":"Frutos rojos / Mixed berries","quantity":100,"unit":"g","calories":50,"carbs":12,"protein":1,"fat":0},{"name":"Miel de abeja / Honey","quantity":20,"unit":"g","calories":60,"carbs":16,"protein":0,"fat":0},{"name":"Semillas de chía / Chia seeds","quantity":15,"unit":"g","calories":73,"carbs":6,"protein":3,"fat":5}]',
 '1. Llevar leche a hervor. / Bring milk to boil.
2. Agregar avena de corte grueso. / Add steel-cut oats.
3. Cocinar 10-15 min revolviendo frecuentemente. / Cook 10-15 min stirring frequently.
4. Servir con berries y miel. / Serve with berries and honey.',
 642, 100, 25, 19, 12, 145,
 '["porridge","Escocia","avena","berries","desayuno","fibra"]',
 '["endurance","vegetarian","high-fiber"]',
 'https://images.pexels.com/photos/543730/pexels-photo-543730.jpeg',
 true, 'european'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Tortilla Española (Omelet de Papa)', 'Tortilla Española (Omelet de Papa)', 'Spanish Omelette (Potato Omelette)',
 'Clásico español de proteína y carbohidratos. Excelente para recuperación. Favorita de los ciclistas y triatletas españoles. / Spanish classic of protein and carbohydrates. Excellent for recovery. Favorite of Spanish cyclists and triathletes.',
 'dinner', 15, 30, 3,
 '[{"name":"Papa / Potato","quantity":400,"unit":"g","calories":308,"carbs":70,"protein":8,"fat":0},{"name":"Huevos / Eggs","quantity":240,"unit":"g","calories":370,"carbs":2,"protein":32,"fat":26},{"name":"Cebolla / Onion","quantity":80,"unit":"g","calories":32,"carbs":7,"protein":1,"fat":0},{"name":"Aceite de oliva / Olive oil","quantity":40,"unit":"ml","calories":360,"carbs":0,"protein":0,"fat":40},{"name":"Sal / Salt","quantity":5,"unit":"g","calories":0,"carbs":0,"protein":0,"fat":0}]',
 '1. Freír papas y cebolla en aceite de oliva 20 min. / Fry potatoes and onion in olive oil 20 min.
2. Batir huevos con sal. / Beat eggs with salt.
3. Mezclar papas con huevos batidos. / Mix potatoes with beaten eggs.
4. Cocinar en sartén volteando para dorar ambos lados. / Cook in pan flipping to brown both sides.',
 1070, 79, 41, 66, 8, 540,
 '["tortilla","España","papa","huevo","recuperación","proteína"]',
 '["endurance","vegetarian","recovery"]',
 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
 true, 'european'),

-- MIDDLE EASTERN / MEDITERRANEAN
('00000000-0000-0000-0000-000000000000'::uuid,
 'Hummus con Pan Pita Integral', 'Hummus con Pan Pita Integral', 'Hummus with Whole Wheat Pita',
 'Proteína vegetal de garbanzo con carbohidratos de bajo IG. Snack perfecto para deportistas mediterráneos. / Chickpea plant protein with low GI carbohydrates. Perfect snack for Mediterranean athletes.',
 'snack', 10, 0, 2,
 '[{"name":"Garbanzos cocidos / Cooked chickpeas","quantity":200,"unit":"g","calories":480,"carbs":82,"protein":26,"fat":8},{"name":"Tahini (pasta sésamo) / Tahini","quantity":30,"unit":"g","calories":177,"carbs":6,"protein":5,"fat":16},{"name":"Aceite de oliva / Olive oil","quantity":15,"unit":"ml","calories":135,"carbs":0,"protein":0,"fat":15},{"name":"Limón / Lemon","quantity":30,"unit":"g","calories":9,"carbs":3,"protein":0,"fat":0},{"name":"Pan pita integral / Whole wheat pita","quantity":100,"unit":"g","calories":275,"carbs":56,"protein":9,"fat":2}]',
 '1. Procesar garbanzos con tahini, aceite, limón y ajo. / Process chickpeas with tahini, oil, lemon and garlic.
2. Licuar hasta obtener textura cremosa. / Blend until creamy texture.
3. Servir con pita integral cortada. / Serve with sliced whole wheat pita.',
 1076, 147, 40, 41, 18, 320,
 '["hummus","Mediterráneo","garbanzo","proteína vegetal","snack","bajo IG"]',
 '["endurance","vegetarian","high-protein"]',
 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
 true, 'middle_eastern'),

-- NORTH AMERICAN
('00000000-0000-0000-0000-000000000000'::uuid,
 'Bowl de Açaí para Atletas', 'Bowl de Açaí para Atletas', 'Athlete Açaí Bowl',
 'Bowl de açaí rico en antioxidantes y carbohidratos de fruta. Popular entre atletas de triatlón de Florida y California. / Açaí bowl rich in antioxidants and fruit carbohydrates. Popular among triathlon athletes in Florida and California.',
 'breakfast', 10, 0, 1,
 '[{"name":"Açaí congelado / Frozen açaí","quantity":200,"unit":"g","calories":250,"carbs":20,"protein":4,"fat":14},{"name":"Banana / Banana","quantity":100,"unit":"g","calories":89,"carbs":23,"protein":1,"fat":0},{"name":"Granola / Granola","quantity":60,"unit":"g","calories":264,"carbs":44,"protein":6,"fat":8},{"name":"Frutos rojos / Mixed berries","quantity":80,"unit":"g","calories":40,"carbs":10,"protein":1,"fat":0},{"name":"Leche de almendras / Almond milk","quantity":100,"unit":"ml","calories":35,"carbs":3,"protein":1,"fat":3}]',
 '1. Licuar açaí con leche de almendras hasta suave. / Blend açaí with almond milk until smooth.
2. Verter en bowl. / Pour into bowl.
3. Decorar con granola, banana y berries. / Top with granola, banana and berries.',
 678, 100, 13, 25, 12, 95,
 '["açaí","antioxidantes","bowl","desayuno","frutas","Norteamérica"]',
 '["endurance","vegetarian","antioxidants"]',
 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg',
 true, 'north_american'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Wrap de Pavo y Aguacate', 'Wrap de Pavo y Aguacate', 'Turkey and Avocado Wrap',
 'Lunch post-entrenamiento rico en proteína magra y grasas saludables. Favorito de los triatletas norteamericanos. / Post-training lunch rich in lean protein and healthy fats. Favorite of North American triathletes.',
 'lunch', 10, 0, 1,
 '[{"name":"Tortilla de trigo integral / Whole wheat tortilla","quantity":70,"unit":"g","calories":210,"carbs":40,"protein":7,"fat":3},{"name":"Pechuga de pavo / Turkey breast","quantity":100,"unit":"g","calories":135,"carbs":0,"protein":30,"fat":1},{"name":"Aguacate / Avocado","quantity":80,"unit":"g","calories":128,"carbs":7,"protein":2,"fat":12},{"name":"Lechuga / Lettuce","quantity":30,"unit":"g","calories":5,"carbs":1,"protein":0,"fat":0},{"name":"Tomate / Tomato","quantity":50,"unit":"g","calories":9,"carbs":2,"protein":0,"fat":0},{"name":"Mostaza / Mustard","quantity":10,"unit":"g","calories":6,"carbs":1,"protein":0,"fat":0}]',
 '1. Extender tortilla sobre superficie plana. / Lay tortilla on flat surface.
2. Colocar todos los ingredientes en el centro. / Place all ingredients in center.
3. Enrollar bien apretando los extremos. / Roll tightly pressing the ends.
4. Cortar a la mitad diagonalmente. / Cut in half diagonally.',
 493, 51, 39, 16, 8, 580,
 '["wrap","pavo","aguacate","Norteamérica","almuerzo","proteína magra"]',
 '["endurance","high-protein","lunch"]',
 'https://images.pexels.com/photos/5949901/pexels-photo-5949901.jpeg',
 true, 'north_american'),

-- STRENGTH ATHLETES
('00000000-0000-0000-0000-000000000000'::uuid,
 'Bowl de Proteína con Salmón y Arroz', 'Bowl de Proteína con Salmón y Arroz', 'Salmon Protein Rice Bowl',
 'Bowl de alto contenido proteico con Omega-3 del salmón. Ideal para recuperación muscular post-fuerza. / High protein bowl with Omega-3 from salmon. Ideal for post-strength muscle recovery.',
 'post_race', 10, 20, 1,
 '[{"name":"Salmón / Salmon","quantity":180,"unit":"g","calories":360,"carbs":0,"protein":40,"fat":22},{"name":"Arroz integral / Brown rice","quantity":180,"unit":"g","calories":642,"carbs":134,"protein":14,"fat":5},{"name":"Edamame / Edamame","quantity":80,"unit":"g","calories":108,"carbs":8,"protein":11,"fat":5},{"name":"Pepino / Cucumber","quantity":60,"unit":"g","calories":9,"carbs":2,"protein":1,"fat":0},{"name":"Salsa de soja / Soy sauce","quantity":15,"unit":"ml","calories":9,"carbs":1,"protein":1,"fat":0}]',
 '1. Cocinar arroz integral 30 min. / Cook brown rice 30 min.
2. Asar salmón a la plancha 4 min por lado. / Grill salmon 4 min per side.
3. Servir arroz en bowl, colocar salmón encima. / Serve rice in bowl, place salmon on top.
4. Agregar edamame, pepino y salsa de soja. / Add edamame, cucumber and soy sauce.',
 1128, 145, 67, 32, 10, 680,
 '["salmón","arroz integral","Omega-3","bowl","proteína","recovery"]',
 '["endurance","high-protein","omega3"]',
 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
 true, 'global'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Pancakes de Proteína con Arándanos', 'Pancakes de Proteína con Arándanos', 'Blueberry Protein Pancakes',
 'Pancakes altos en proteína ideales para recuperación muscular. Combinan carbohidratos y proteína en proporciones perfectas. / High protein pancakes ideal for muscle recovery. Combine carbs and protein in perfect ratios.',
 'breakfast', 10, 15, 2,
 '[{"name":"Avena / Oats","quantity":100,"unit":"g","calories":390,"carbs":65,"protein":14,"fat":7},{"name":"Proteína en polvo / Protein powder","quantity":30,"unit":"g","calories":120,"carbs":3,"protein":24,"fat":2},{"name":"Huevo / Egg","quantity":120,"unit":"g","calories":185,"carbs":1,"protein":16,"fat":13},{"name":"Leche / Milk","quantity":150,"unit":"ml","calories":74,"carbs":7,"protein":5,"fat":4},{"name":"Arándanos / Blueberries","quantity":100,"unit":"g","calories":57,"carbs":14,"protein":1,"fat":0},{"name":"Miel / Honey","quantity":15,"unit":"g","calories":46,"carbs":12,"protein":0,"fat":0}]',
 '1. Mezclar avena molida con proteína, huevos y leche. / Mix ground oats with protein, eggs and milk.
2. Agregar arándanos a la mezcla. / Add blueberries to mix.
3. Cocinar en sartén antiadherente caliente. / Cook in hot non-stick pan.
4. Dar vuelta cuando aparezcan burbujas. Servir con miel. / Flip when bubbles appear. Serve with honey.',
 872, 102, 60, 26, 10, 200,
 '["pancakes","proteína","arándanos","desayuno","carbohidratos","recuperación"]',
 '["endurance","high-protein","breakfast"]',
 'https://images.pexels.com/photos/543730/pexels-photo-543730.jpeg',
 true, 'global'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Ensalada de Pasta Integral con Atún', 'Ensalada de Pasta Integral con Atún', 'Whole Wheat Tuna Pasta Salad',
 'Ensalada fría de pasta integral con atún. Perfecta para preparar con anticipación. Equilibrio de macronutrientes. / Cold whole wheat pasta salad with tuna. Perfect to prepare in advance. Balanced macronutrients.',
 'lunch', 10, 15, 2,
 '[{"name":"Pasta integral / Whole wheat pasta","quantity":180,"unit":"g","calories":630,"carbs":120,"protein":26,"fat":4},{"name":"Atún en agua / Tuna in water","quantity":160,"unit":"g","calories":192,"carbs":0,"protein":42,"fat":2},{"name":"Aceitunas / Olives","quantity":40,"unit":"g","calories":60,"carbs":2,"protein":0,"fat":6},{"name":"Tomate cherry / Cherry tomatoes","quantity":80,"unit":"g","calories":20,"carbs":4,"protein":1,"fat":0},{"name":"Aceite de oliva / Olive oil","quantity":20,"unit":"ml","calories":180,"carbs":0,"protein":0,"fat":20}]',
 '1. Cocinar pasta al dente, enfriar con agua fría. / Cook pasta al dente, cool with cold water.
2. Escurrir atún y desmenuzar. / Drain and flake tuna.
3. Mezclar pasta, atún, aceitunas y tomate. / Mix pasta, tuna, olives and tomato.
4. Aliñar con aceite de oliva, sal y pimienta. / Dress with olive oil, salt and pepper.',
 1082, 126, 69, 32, 14, 720,
 '["pasta integral","atún","ensalada","almuerzo","equilibrio","proteína"]',
 '["endurance","high-protein","meal-prep"]',
 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
 true, 'global'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Batata al Horno con Ricotta', 'Batata al Horno con Ricotta', 'Baked Sweet Potato with Ricotta',
 'Batata al horno con crema de ricotta. Alta en betacaroteno, vitaminas y carbohidratos de bajo IG. / Baked sweet potato with ricotta cream. High in beta-carotene, vitamins and low GI carbohydrates.',
 'snack', 5, 45, 1,
 '[{"name":"Batata / Sweet potato","quantity":250,"unit":"g","calories":215,"carbs":50,"protein":4,"fat":0},{"name":"Ricotta / Ricotta","quantity":100,"unit":"g","calories":174,"carbs":3,"protein":11,"fat":13},{"name":"Miel / Honey","quantity":15,"unit":"g","calories":46,"carbs":12,"protein":0,"fat":0},{"name":"Canela / Cinnamon","quantity":2,"unit":"g","calories":5,"carbs":2,"protein":0,"fat":0},{"name":"Nueces / Walnuts","quantity":20,"unit":"g","calories":131,"carbs":3,"protein":3,"fat":13}]',
 '1. Hornear batata entera a 200°C por 45 min. / Bake whole sweet potato at 200°C for 45 min.
2. Abrir la batata por la mitad. / Cut sweet potato in half.
3. Cubrir con ricotta mezclada con miel y canela. / Top with ricotta mixed with honey and cinnamon.
4. Agregar nueces trituradas. / Add crushed walnuts.',
 571, 70, 18, 26, 8, 120,
 '["batata","ricotta","snack","betacaroteno","bajo IG","vitaminas"]',
 '["endurance","vegetarian","antioxidants"]',
 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
 true, 'global'),

-- More global recipes to complete batch 1
('00000000-0000-0000-0000-000000000000'::uuid,
 'Overnight Oats de Chía y Coco', 'Overnight Oats de Chía y Coco', 'Coconut Chia Overnight Oats',
 'Avena nocturna con chía y leche de coco. Preparación de 5 minutos para tenerlo listo en la mañana. / Overnight oats with chia and coconut milk. 5-minute prep to have it ready in the morning.',
 'breakfast', 5, 0, 1,
 '[{"name":"Avena / Oats","quantity":80,"unit":"g","calories":312,"carbs":52,"protein":11,"fat":6},{"name":"Leche de coco / Coconut milk","quantity":200,"unit":"ml","calories":300,"carbs":8,"protein":3,"fat":28},{"name":"Semillas de chía / Chia seeds","quantity":20,"unit":"g","calories":97,"carbs":8,"protein":3,"fat":7},{"name":"Mango / Mango","quantity":100,"unit":"g","calories":65,"carbs":17,"protein":1,"fat":0},{"name":"Coco rallado / Shredded coconut","quantity":15,"unit":"g","calories":98,"carbs":4,"protein":1,"fat":9}]',
 '1. Mezclar avena, chía y leche de coco en jar. / Mix oats, chia and coconut milk in jar.
2. Refrigerar toda la noche. / Refrigerate overnight.
3. En la mañana, agregar mango y coco rallado. / In the morning, add mango and shredded coconut.',
 872, 89, 19, 50, 18, 95,
 '["overnight oats","chía","coco","desayuno","prep nocturno","energía"]',
 '["endurance","vegetarian","meal-prep"]',
 'https://images.pexels.com/photos/543730/pexels-photo-543730.jpeg',
 true, 'global'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Batido Verde Pre-Entrenamiento', 'Batido Verde Pre-Entrenamiento', 'Green Pre-Workout Smoothie',
 'Smoothie de espinaca y frutas con alta concentración de nitratos naturales. Mejora el flujo sanguíneo y el rendimiento. / Spinach and fruit smoothie with high concentration of natural nitrates. Improves blood flow and performance.',
 'pre_race', 5, 0, 1,
 '[{"name":"Espinaca / Spinach","quantity":80,"unit":"g","calories":18,"carbs":3,"protein":2,"fat":0},{"name":"Banana / Banana","quantity":120,"unit":"g","calories":107,"carbs":27,"protein":1,"fat":0},{"name":"Manzana / Apple","quantity":150,"unit":"g","calories":78,"carbs":21,"protein":0,"fat":0},{"name":"Jengibre / Ginger","quantity":5,"unit":"g","calories":5,"carbs":1,"protein":0,"fat":0},{"name":"Agua de coco / Coconut water","quantity":200,"unit":"ml","calories":38,"carbs":9,"protein":0,"fat":0},{"name":"Limón / Lemon","quantity":20,"unit":"g","calories":6,"carbs":2,"protein":0,"fat":0}]',
 '1. Colocar espinaca y agua de coco en licuadora. / Place spinach and coconut water in blender.
2. Agregar banana, manzana, jengibre y limón. / Add banana, apple, ginger and lemon.
3. Licuar hasta obtener mezcla homogénea. / Blend until smooth.
4. Beber 45-60 min antes del entrenamiento. / Drink 45-60 min before training.',
 252, 63, 3, 0, 6, 82,
 '["smoothie verde","espinaca","nitratos","pre-entrenamiento","flujo sanguíneo"]',
 '["endurance","vegetarian","pre-training"]',
 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg',
 true, 'global'),

('00000000-0000-0000-0000-000000000000'::uuid,
 'Pollo Teriyaki con Arroz y Brócoli', 'Pollo Teriyaki con Arroz y Brócoli', 'Teriyaki Chicken with Rice and Broccoli',
 'Plato equilibrado de alto contenido proteico con carbohidratos complejos. Combinación perfecta de macronutrientes para recuperación. / Balanced high protein meal with complex carbohydrates. Perfect macronutrient combination for recovery.',
 'dinner', 10, 25, 2,
 '[{"name":"Pechuga de pollo / Chicken breast","quantity":300,"unit":"g","calories":495,"carbs":0,"protein":93,"fat":11},{"name":"Arroz / Rice","quantity":200,"unit":"g","calories":714,"carbs":158,"protein":14,"fat":2},{"name":"Brócoli / Broccoli","quantity":200,"unit":"g","calories":68,"carbs":14,"protein":5,"fat":1},{"name":"Salsa teriyaki / Teriyaki sauce","quantity":40,"unit":"ml","calories":56,"carbs":12,"protein":2,"fat":0},{"name":"Aceite de sésamo / Sesame oil","quantity":10,"unit":"ml","calories":90,"carbs":0,"protein":0,"fat":10}]',
 '1. Marinar pollo en teriyaki 15 min. / Marinate chicken in teriyaki 15 min.
2. Cocinar arroz al vapor. / Steam rice.
3. Cocinar brócoli al vapor 5 min. / Steam broccoli 5 min.
4. Grilliar pollo hasta dorar. / Grill chicken until golden.
5. Servir en bowl con arroz y brócoli. / Serve in bowl with rice and broccoli.',
 1423, 184, 114, 24, 12, 780,
 '["teriyaki","pollo","arroz","brócoli","proteína","Japón"]',
 '["endurance","high-protein","recovery"]',
 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
 true, 'asian')

ON CONFLICT DO NOTHING;
