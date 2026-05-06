/*
  # Seed 50 athlete-focused system recipes

  ## Summary
  Adds 50 system recipes (user_id IS NULL) covering all meal slots for endurance and
  strength athletes. Categories: pre_race, during_race, post_race, recovery, breakfast,
  lunch, dinner, snack. All macros calibrated for sport performance.
*/

INSERT INTO recipes (user_id, name, description, category, prep_time_min, cook_time_min, servings, ingredients, instructions, tags, is_public)
VALUES
-- ============================================================
-- BREAKFAST
-- ============================================================
(NULL, 'Overnight Oats con Banana y Miel',
 'Avena remojada overnight, lista al despertar. Alta en carbohidratos de digestión lenta.',
 'breakfast', 5, 0, 1,
 '[{"name":"Avena rolled","amount_g":80,"calories":304,"protein_g":10,"carbs_g":54,"fat_g":6},{"name":"Leche entera","amount_g":200,"calories":130,"protein_g":6,"carbs_g":10,"fat_g":7},{"name":"Banana","amount_g":100,"calories":89,"protein_g":1,"carbs_g":23,"fat_g":0},{"name":"Miel","amount_g":20,"calories":61,"protein_g":0,"carbs_g":17,"fat_g":0},{"name":"Chia seeds","amount_g":10,"calories":49,"protein_g":2,"carbs_g":4,"fat_g":3}]'::jsonb,
 'Mezclar avena con leche en un frasco. Agregar chía. Refrigerar overnight. Al servir: cubrir con banana y miel.',
 '["carbohidratos","sin cocción","alto carbohidrato"]'::jsonb, true),

(NULL, 'Pancakes de Proteína con Arándanos',
 'Pancakes altos en proteína, bajos en grasa. Ideales para días de alta demanda.',
 'breakfast', 5, 10, 2,
 '[{"name":"Huevo","amount_g":100,"calories":143,"protein_g":13,"carbs_g":1,"fat_g":10},{"name":"Avena molida","amount_g":60,"calories":228,"protein_g":8,"carbs_g":41,"fat_g":4},{"name":"Cottage cheese","amount_g":100,"calories":98,"protein_g":11,"carbs_g":4,"fat_g":4},{"name":"Arándanos","amount_g":80,"calories":46,"protein_g":1,"carbs_g":11,"fat_g":0},{"name":"Canela","amount_g":2,"calories":5,"protein_g":0,"carbs_g":2,"fat_g":0}]'::jsonb,
 'Licuar huevos, avena y cottage. Cocinar en sartén antiadherente 3 min por lado. Servir con arándanos.',
 '["proteína","desayuno atleta","sin gluten"]'::jsonb, true),

(NULL, 'Tostada Integral con Huevo y Aguacate',
 'Carbohidratos complejos + grasas saludables + proteína. Perfecto para entrenamientos mañana.',
 'breakfast', 5, 5, 1,
 '[{"name":"Pan integral","amount_g":60,"calories":154,"protein_g":6,"carbs_g":30,"fat_g":2},{"name":"Huevo","amount_g":100,"calories":143,"protein_g":13,"carbs_g":1,"fat_g":10},{"name":"Aguacate","amount_g":70,"calories":112,"protein_g":1,"carbs_g":6,"fat_g":10},{"name":"Tomate","amount_g":50,"calories":9,"protein_g":0,"carbs_g":2,"fat_g":0}]'::jsonb,
 'Tostar el pan. Cocinar huevo revuelto o poché. Aplastar aguacate con sal. Armar tostada.',
 '["grasas saludables","proteína"]'::jsonb, true),

(NULL, 'Smoothie Bowl de Mango y Proteína',
 'Bowl denso con proteína de whey, mango y toppings crocantes. Gran densidad de nutrientes.',
 'breakfast', 7, 0, 1,
 '[{"name":"Mango congelado","amount_g":150,"calories":90,"protein_g":1,"carbs_g":23,"fat_g":0},{"name":"Banana","amount_g":80,"calories":71,"protein_g":1,"carbs_g":18,"fat_g":0},{"name":"Leche de almendras","amount_g":100,"calories":17,"protein_g":1,"carbs_g":1,"fat_g":1},{"name":"Whey protein vainilla","amount_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},{"name":"Granola","amount_g":30,"calories":130,"protein_g":3,"carbs_g":20,"fat_g":5},{"name":"Semillas de girasol","amount_g":10,"calories":58,"protein_g":2,"carbs_g":2,"fat_g":5}]'::jsonb,
 'Licuar mango, banana, leche y proteína hasta cremoso. Verter en bowl. Decorar con granola y semillas.',
 '["smoothie bowl","proteína","sin gluten","alto carbohidrato"]'::jsonb, true),

(NULL, 'Revuelto de Claras con Espinacas y Champiñones',
 'Desayuno bajo en calorías, alto en proteína. Ideal para días de recuperación o corte.',
 'breakfast', 5, 8, 1,
 '[{"name":"Claras de huevo","amount_g":180,"calories":94,"protein_g":20,"carbs_g":1,"fat_g":0},{"name":"Espinacas","amount_g":60,"calories":14,"protein_g":2,"carbs_g":2,"fat_g":0},{"name":"Champiñones","amount_g":80,"calories":18,"protein_g":2,"carbs_g":3,"fat_g":0},{"name":"Aceite de oliva","amount_g":5,"calories":44,"protein_g":0,"carbs_g":0,"fat_g":5},{"name":"Pan integral","amount_g":40,"calories":103,"protein_g":4,"carbs_g":20,"fat_g":1}]'::jsonb,
 'Saltear champiñones y espinacas en aceite. Agregar claras batidas. Revolver hasta coagular. Servir con pan.',
 '["bajo en grasa","alto proteína","recuperación"]'::jsonb, true),

(NULL, 'Porridge de Quinoa con Frutas del Bosque',
 'Quinoa cocida estilo porridge, rica en proteína completa y antioxidantes.',
 'breakfast', 5, 15, 1,
 '[{"name":"Quinoa","amount_g":70,"calories":252,"protein_g":9,"carbs_g":44,"fat_g":4},{"name":"Leche de coco","amount_g":150,"calories":71,"protein_g":1,"carbs_g":2,"fat_g":7},{"name":"Fresas","amount_g":80,"calories":26,"protein_g":1,"carbs_g":6,"fat_g":0},{"name":"Frambuesas","amount_g":60,"calories":31,"protein_g":1,"carbs_g":7,"fat_g":0},{"name":"Miel","amount_g":15,"calories":46,"protein_g":0,"carbs_g":13,"fat_g":0}]'::jsonb,
 'Cocinar quinoa en leche de coco 15 min hasta cremosa. Servir con frutas y miel.',
 '["sin gluten","antioxidantes","proteína completa"]'::jsonb, true),

(NULL, 'French Toast de Alto Rendimiento',
 'Tostadas francesas con pan brioche, ricas en carbohidratos y proteína para días de competencia.',
 'pre_race', 5, 8, 1,
 '[{"name":"Pan brioche","amount_g":100,"calories":330,"protein_g":9,"carbs_g":52,"fat_g":9},{"name":"Huevo","amount_g":60,"calories":86,"protein_g":8,"carbs_g":1,"fat_g":6},{"name":"Leche","amount_g":80,"calories":52,"protein_g":3,"carbs_g":6,"fat_g":3},{"name":"Miel","amount_g":25,"calories":76,"protein_g":0,"carbs_g":21,"fat_g":0},{"name":"Canela","amount_g":2,"calories":5,"protein_g":0,"carbs_g":2,"fat_g":0}]'::jsonb,
 'Batir huevo con leche y canela. Remojar pan. Cocinar en mantequilla 2 min por lado. Servir con miel.',
 '["carbohidratos","pre-competencia","alta densidad energética"]'::jsonb, true),

-- ============================================================
-- PRE-RACE / PRE-TRAINING
-- ============================================================
(NULL, 'Arroz Blanco con Plátano y Miel',
 'Combo clásico de pre-carrera. Fácil digestión, rápida absorción de glucosa.',
 'pre_race', 3, 15, 1,
 '[{"name":"Arroz blanco cocido","amount_g":200,"calories":260,"protein_g":5,"carbs_g":57,"fat_g":0},{"name":"Plátano maduro","amount_g":120,"calories":107,"protein_g":1,"carbs_g":28,"fat_g":0},{"name":"Miel","amount_g":20,"calories":61,"protein_g":0,"carbs_g":17,"fat_g":0}]'::jsonb,
 'Cocinar arroz. Servir tibio con plátano en rodajas y miel por encima.',
 '["fácil digestión","alta glucosa","pre-carrera"]'::jsonb, true),

(NULL, 'Pasta con Salsa de Tomate y Pechuga',
 'Pasta de carga para la noche antes de una prueba larga. Base de carbohidratos complejos.',
 'pre_race', 5, 15, 1,
 '[{"name":"Pasta espagueti","amount_g":120,"calories":428,"protein_g":14,"carbs_g":86,"fat_g":2},{"name":"Pechuga de pollo","amount_g":100,"calories":165,"protein_g":31,"carbs_g":0,"fat_g":4},{"name":"Salsa de tomate natural","amount_g":150,"calories":55,"protein_g":2,"carbs_g":11,"fat_g":0},{"name":"Aceite de oliva","amount_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}]'::jsonb,
 'Cocer pasta al dente. Saltear pollo en tiras. Mezclar con salsa y aceite. Servir caliente.',
 '["carga de carbohidratos","noche antes de carrera","maratón"]'::jsonb, true),

(NULL, 'Tostadas con Mermelada y Mantequilla de Maní',
 'Snack de 60-90 min antes del entrenamiento. Energía rápida y grasas de calidad.',
 'pre_race', 3, 2, 1,
 '[{"name":"Pan integral","amount_g":60,"calories":154,"protein_g":6,"carbs_g":30,"fat_g":2},{"name":"Mantequilla de maní natural","amount_g":25,"calories":149,"protein_g":6,"carbs_g":5,"fat_g":12},{"name":"Mermelada de fresa","amount_g":20,"calories":52,"protein_g":0,"carbs_g":14,"fat_g":0}]'::jsonb,
 'Tostar pan. Extender mantequilla de maní. Agregar mermelada.',
 '["pre-entrenamiento","energía rápida"]'::jsonb, true),

(NULL, 'Batata Asada con Pechuga de Pavo',
 'Comida pre-competencia 3-4 hs antes. Digestión media, sostenida en energía.',
 'pre_race', 5, 40, 1,
 '[{"name":"Batata/Boniato","amount_g":200,"calories":172,"protein_g":3,"carbs_g":40,"fat_g":0},{"name":"Pechuga de pavo","amount_g":120,"calories":162,"protein_g":35,"carbs_g":0,"fat_g":2},{"name":"Aceite de oliva","amount_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10},{"name":"Sal y hierbas","amount_g":3,"calories":0,"protein_g":0,"carbs_g":0,"fat_g":0}]'::jsonb,
 'Hornear batata 40 min a 200°C. Sellar pavo en sartén. Servir con hierbas.',
 '["pre-carrera","baja fibra","fácil digestión"]'::jsonb, true),

-- ============================================================
-- DURING RACE / FUELING
-- ============================================================
(NULL, 'Rice Cakes de Arroz Dulce (Estilo Specialized)',
 'Balls de arroz al estilo pro. Portátiles y con energía densa para ciclismo o trail.',
 'during_race', 10, 20, 6,
 '[{"name":"Arroz blanco cocido","amount_g":400,"calories":520,"protein_g":10,"carbs_g":114,"fat_g":1},{"name":"Miel","amount_g":40,"calories":122,"protein_g":0,"carbs_g":33,"fat_g":0},{"name":"Coco rallado","amount_g":20,"calories":70,"protein_g":1,"carbs_g":7,"fat_g":5},{"name":"Sal","amount_g":2,"calories":0,"protein_g":0,"carbs_g":0,"fat_g":0}]'::jsonb,
 'Mezclar arroz tibio con miel, coco y sal. Presionar en molde y refrigerar. Cortar en porciones. Envolver en papel film.',
 '["portable","en carrera","baja fibra","arroz balls"]'::jsonb, true),

(NULL, 'Dátiles Rellenos de Mantequilla de Almendra',
 'Snack natural de alto índice glucémico para recargar en movimiento.',
 'during_race', 5, 0, 3,
 '[{"name":"Dátiles Medjool","amount_g":90,"calories":247,"protein_g":2,"carbs_g":66,"fat_g":0},{"name":"Mantequilla de almendra","amount_g":30,"calories":180,"protein_g":5,"carbs_g":6,"fat_g":16}]'::jsonb,
 'Abrir dátiles, retirar semilla. Rellenar con mantequilla de almendra. Envolver en pares.',
 '["natural","alto IG","portable","en carrera"]'::jsonb, true),

(NULL, 'Mezcla de Pasas y Banana Chips',
 'Trail mix energético simple, sin necesidad de refrigeración. Clásico del ultratrail.',
 'during_race', 3, 0, 2,
 '[{"name":"Pasas de uva","amount_g":50,"calories":151,"protein_g":1,"carbs_g":40,"fat_g":0},{"name":"Banana chips","amount_g":40,"calories":212,"protein_g":1,"carbs_g":31,"fat_g":10},{"name":"Avena tostada","amount_g":20,"calories":76,"protein_g":3,"carbs_g":14,"fat_g":1}]'::jsonb,
 'Mezclar todos los ingredientes. Dividir en bolsitas de 55g por porción.',
 '["portable","natural","ultra","trail mix"]'::jsonb, true),

-- ============================================================
-- POST-RACE / RECOVERY
-- ============================================================
(NULL, 'Recovery Bowl: Pollo Teriyaki con Arroz y Edamame',
 'Relación 3:1 carbohidrato:proteína ideal para síntesis muscular post-entrenamiento.',
 'post_race', 10, 20, 1,
 '[{"name":"Pechuga de pollo","amount_g":150,"calories":248,"protein_g":47,"carbs_g":0,"fat_g":5},{"name":"Arroz integral","amount_g":150,"calories":174,"protein_g":4,"carbs_g":36,"fat_g":2},{"name":"Edamame","amount_g":80,"calories":109,"protein_g":9,"carbs_g":9,"fat_g":5},{"name":"Salsa teriyaki","amount_g":30,"calories":40,"protein_g":1,"carbs_g":9,"fat_g":0},{"name":"Sésamo","amount_g":5,"calories":28,"protein_g":1,"carbs_g":1,"fat_g":2}]'::jsonb,
 'Marinar pollo en teriyaki. Cocinar arroz. Saltear edamame. Ensamblar bowl. Espolvorear sésamo.',
 '["recuperación","3:1 ratio","síntesis muscular"]'::jsonb, true),

(NULL, 'Batido de Recuperación Chocolate y Cereza',
 'Combina proteína de whey con cerezas antiinflamatorias. Clásico post-entreno.',
 'post_race', 5, 0, 1,
 '[{"name":"Leche entera","amount_g":250,"calories":163,"protein_g":8,"carbs_g":13,"fat_g":9},{"name":"Whey chocolate","amount_g":35,"calories":140,"protein_g":28,"carbs_g":5,"fat_g":2},{"name":"Cerezas congeladas","amount_g":100,"calories":50,"protein_g":1,"carbs_g":12,"fat_g":0},{"name":"Plátano","amount_g":60,"calories":54,"protein_g":1,"carbs_g":14,"fat_g":0}]'::jsonb,
 'Licuar todo. Consumir dentro de los 30 min post-entrenamiento.',
 '["recuperación","antiinflamatorio","30 min post"]'::jsonb, true),

(NULL, 'Tazón de Salmón con Quinoa y Espárragos',
 'Omega-3 anti-inflamatorios + proteína completa + carbohidratos de digestión media.',
 'post_race', 10, 15, 1,
 '[{"name":"Salmón","amount_g":150,"calories":311,"protein_g":31,"carbs_g":0,"fat_g":20},{"name":"Quinoa cocida","amount_g":120,"calories":139,"protein_g":5,"carbs_g":24,"fat_g":2},{"name":"Espárragos","amount_g":100,"calories":20,"protein_g":2,"carbs_g":4,"fat_g":0},{"name":"Limón","amount_g":30,"calories":9,"protein_g":0,"carbs_g":3,"fat_g":0},{"name":"Aceite de oliva","amount_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}]'::jsonb,
 'Hornear salmón con limón 12 min. Blanquear espárragos. Servir sobre quinoa.',
 '["omega-3","antiinflamatorio","recuperación muscular"]'::jsonb, true),

(NULL, 'Frittata de Claras con Vegetales Asados',
 'Alta proteína, baja en grasa. Ideal para recuperación en corte calórico.',
 'recovery', 10, 15, 2,
 '[{"name":"Claras de huevo","amount_g":250,"calories":130,"protein_g":27,"carbs_g":2,"fat_g":0},{"name":"Calabacín","amount_g":100,"calories":17,"protein_g":1,"carbs_g":3,"fat_g":0},{"name":"Pimiento rojo","amount_g":80,"calories":25,"protein_g":1,"carbs_g":6,"fat_g":0},{"name":"Cebolla","amount_g":50,"calories":20,"protein_g":0,"carbs_g":5,"fat_g":0},{"name":"Queso feta","amount_g":30,"calories":74,"protein_g":4,"carbs_g":1,"fat_g":6}]'::jsonb,
 'Saltear vegetales. Agregar claras batidas. Cocinar en sartén apta para horno 10 min a 180°C.',
 '["alto proteína","bajo grasa","recuperación"]'::jsonb, true),

(NULL, 'Yogur Griego con Nueces y Miel (Recovery Snack)',
 'Caseína del yogur griego + grasas omega de nueces. Perfecto antes de dormir post-entreno.',
 'recovery', 3, 0, 1,
 '[{"name":"Yogur griego 0%","amount_g":200,"calories":100,"protein_g":17,"carbs_g":6,"fat_g":1},{"name":"Nueces","amount_g":20,"calories":131,"protein_g":3,"carbs_g":3,"fat_g":13},{"name":"Miel","amount_g":15,"calories":46,"protein_g":0,"carbs_g":13,"fat_g":0},{"name":"Chía","amount_g":8,"calories":39,"protein_g":1,"carbs_g":3,"fat_g":2}]'::jsonb,
 'Servir yogur. Agregar nueces, miel y chía.',
 '["caseína","post-entreno noche","snack recuperación"]'::jsonb, true),

-- ============================================================
-- LUNCH
-- ============================================================
(NULL, 'Bowl de Atún con Arroz, Palta y Edamame',
 'Proteína de mar + carbohidrato + grasas saludables. Muy popular en deportistas de élite.',
 'lunch', 8, 15, 1,
 '[{"name":"Atún en agua","amount_g":150,"calories":158,"protein_g":34,"carbs_g":0,"fat_g":2},{"name":"Arroz blanco cocido","amount_g":150,"calories":195,"protein_g":4,"carbs_g":43,"fat_g":0},{"name":"Palta/Aguacate","amount_g":80,"calories":128,"protein_g":2,"carbs_g":7,"fat_g":11},{"name":"Edamame","amount_g":60,"calories":82,"protein_g":7,"carbs_g":7,"fat_g":4},{"name":"Salsa de soja","amount_g":15,"calories":9,"protein_g":1,"carbs_g":1,"fat_g":0}]'::jsonb,
 'Armar bowl con arroz de base. Agregar atún, palta en cubos, edamame. Aliñar con soja.',
 '["proteína","omega-3","bowl"]'::jsonb, true),

(NULL, 'Wraps de Pavo con Hummus y Vegetales',
 'Almuerzo práctico, equilibrado y portable para atletas con agendas ocupadas.',
 'lunch', 8, 0, 1,
 '[{"name":"Tortilla integral","amount_g":60,"calories":170,"protein_g":5,"carbs_g":33,"fat_g":2},{"name":"Pavo en lonchas","amount_g":100,"calories":135,"protein_g":29,"carbs_g":0,"fat_g":2},{"name":"Hummus","amount_g":50,"calories":116,"protein_g":4,"carbs_g":10,"fat_g":7},{"name":"Lechuga","amount_g":30,"calories":5,"protein_g":0,"carbs_g":1,"fat_g":0},{"name":"Tomate","amount_g":50,"calories":9,"protein_g":0,"carbs_g":2,"fat_g":0},{"name":"Pepino","amount_g":40,"calories":6,"protein_g":0,"carbs_g":1,"fat_g":0}]'::jsonb,
 'Extender hummus en tortilla. Colocar pavo y vegetales. Enrollar firmemente.',
 '["portable","equilibrado","proteína magra"]'::jsonb, true),

(NULL, 'Lentil Power Bowl con Pollo y Remolacha',
 'Legumbres + proteína animal + remolacha con nitratos naturales para rendimiento.',
 'lunch', 10, 20, 1,
 '[{"name":"Lentejas cocidas","amount_g":150,"calories":173,"protein_g":12,"carbs_g":30,"fat_g":1},{"name":"Pechuga de pollo","amount_g":100,"calories":165,"protein_g":31,"carbs_g":0,"fat_g":4},{"name":"Remolacha","amount_g":100,"calories":43,"protein_g":2,"carbs_g":10,"fat_g":0},{"name":"Espinaca","amount_g":50,"calories":12,"protein_g":1,"carbs_g":2,"fat_g":0},{"name":"Aceite de oliva","amount_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}]'::jsonb,
 'Cocinar lentejas. Sellar pollo. Asar remolacha. Armar bowl con espinaca.',
 '["hierro","nitratos naturales","legumbres"]'::jsonb, true),

(NULL, 'Ensalada de Pollo y Garbanzos con Tahini',
 'Almuerzo de recuperación. Alto en proteína, fibra y grasas saludables.',
 'lunch', 10, 0, 1,
 '[{"name":"Pollo cocinado en tiras","amount_g":120,"calories":198,"protein_g":37,"carbs_g":0,"fat_g":4},{"name":"Garbanzos cocidos","amount_g":100,"calories":164,"protein_g":9,"carbs_g":27,"fat_g":3},{"name":"Pepino","amount_g":80,"calories":12,"protein_g":1,"carbs_g":3,"fat_g":0},{"name":"Tomate cherry","amount_g":80,"calories":18,"protein_g":1,"carbs_g":4,"fat_g":0},{"name":"Tahini","amount_g":20,"calories":178,"protein_g":5,"carbs_g":7,"fat_g":16}]'::jsonb,
 'Mezclar todos los ingredientes. Aliñar con tahini diluido en limón.',
 '["hierro","fibra","grasas saludables"]'::jsonb, true),

(NULL, 'Stir Fry de Res Magra con Brócoli y Arroz',
 'Proteína animal completa + hierro hem + vegetales crucíferos antioxidantes.',
 'lunch', 10, 15, 1,
 '[{"name":"Lomo de res","amount_g":150,"calories":248,"protein_g":29,"carbs_g":0,"fat_g":14},{"name":"Arroz blanco","amount_g":150,"calories":195,"protein_g":4,"carbs_g":43,"fat_g":0},{"name":"Brócoli","amount_g":120,"calories":41,"protein_g":3,"carbs_g":8,"fat_g":0},{"name":"Jengibre","amount_g":5,"calories":4,"protein_g":0,"carbs_g":1,"fat_g":0},{"name":"Salsa de soja","amount_g":15,"calories":9,"protein_g":1,"carbs_g":1,"fat_g":0}]'::jsonb,
 'Saltear res en wok a fuego alto. Agregar brócoli y jengibre. Sazonar con soja. Servir sobre arroz.',
 '["hierro hem","proteína completa","alto proteína"]'::jsonb, true),

-- ============================================================
-- DINNER
-- ============================================================
(NULL, 'Trucha al Horno con Puré de Batata y Judías Verdes',
 'Cena equilibrada con omega-3, carbohidratos de recuperación y fibra.',
 'dinner', 10, 25, 1,
 '[{"name":"Trucha","amount_g":180,"calories":268,"protein_g":37,"carbs_g":0,"fat_g":13},{"name":"Batata","amount_g":200,"calories":172,"protein_g":3,"carbs_g":40,"fat_g":0},{"name":"Judías verdes","amount_g":100,"calories":31,"protein_g":2,"carbs_g":7,"fat_g":0},{"name":"Aceite de oliva","amount_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10},{"name":"Limón","amount_g":20,"calories":6,"protein_g":0,"carbs_g":2,"fat_g":0}]'::jsonb,
 'Hornear trucha con limón y hierbas 20 min. Hacer puré de batata. Blanquear judías.',
 '["omega-3","cena atleta","recuperación"]'::jsonb, true),

(NULL, 'Curry de Pollo con Arroz Integral y Espinacas',
 'Antiinflamatorio por la cúrcuma. Proteína completa y carbohidratos de absorción lenta.',
 'dinner', 10, 25, 2,
 '[{"name":"Pechuga de pollo","amount_g":200,"calories":330,"protein_g":62,"carbs_g":0,"fat_g":7},{"name":"Arroz integral","amount_g":150,"calories":174,"protein_g":4,"carbs_g":36,"fat_g":2},{"name":"Leche de coco","amount_g":100,"calories":48,"protein_g":0,"carbs_g":2,"fat_g":5},{"name":"Espinacas","amount_g":80,"calories":18,"protein_g":2,"carbs_g":3,"fat_g":0},{"name":"Cúrcuma","amount_g":3,"calories":10,"protein_g":0,"carbs_g":2,"fat_g":0},{"name":"Garam masala","amount_g":3,"calories":8,"protein_g":0,"carbs_g":2,"fat_g":0}]'::jsonb,
 'Saltear especias. Agregar pollo en cubos, leche de coco y espinacas. Cocer 20 min. Servir con arroz.',
 '["antiinflamatorio","cúrcuma","cena"]'::jsonb, true),

(NULL, 'Medallones de Cerdo con Lentejas Rojas y Zanahoria',
 'Hierro + zinc + carbohidratos de legumbres. Cena de alta densidad nutricional.',
 'dinner', 10, 25, 1,
 '[{"name":"Lomo de cerdo","amount_g":150,"calories":213,"protein_g":30,"carbs_g":0,"fat_g":10},{"name":"Lentejas rojas","amount_g":100,"calories":116,"protein_g":9,"carbs_g":20,"fat_g":1},{"name":"Zanahoria","amount_g":80,"calories":33,"protein_g":1,"carbs_g":8,"fat_g":0},{"name":"Aceite de oliva","amount_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}]'::jsonb,
 'Sellar medallones. Cocer lentejas con zanahoria. Servir.',
 '["hierro","zinc","alta densidad nutricional"]'::jsonb, true),

(NULL, 'Pollo al Limón con Couscous y Tomate Cherries',
 'Cena ligera pero proteica. Couscous de absorción rápida para recuperación.',
 'dinner', 8, 15, 1,
 '[{"name":"Pechuga de pollo","amount_g":150,"calories":248,"protein_g":47,"carbs_g":0,"fat_g":5},{"name":"Couscous","amount_g":80,"calories":291,"protein_g":10,"carbs_g":60,"fat_g":1},{"name":"Tomate cherry","amount_g":100,"calories":18,"protein_g":1,"carbs_g":4,"fat_g":0},{"name":"Aceite de oliva","amount_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10},{"name":"Limón","amount_g":30,"calories":9,"protein_g":0,"carbs_g":3,"fat_g":0}]'::jsonb,
 'Cocinar couscous hidratando en agua hirviendo. Cocinar pollo con limón. Servir sobre couscous con tomates.',
 '["cena ligera","proteína magra"]'::jsonb, true),

(NULL, 'Filete de Bacalao con Puré de Garbanzo y Verduras',
 'Proteína magra + fibra de garbanzo. Cena antiinflamatoria y densa en nutrientes.',
 'dinner', 10, 20, 1,
 '[{"name":"Bacalao","amount_g":160,"calories":172,"protein_g":37,"carbs_g":0,"fat_g":1},{"name":"Garbanzos cocidos","amount_g":150,"calories":246,"protein_g":13,"carbs_g":41,"fat_g":5},{"name":"Pimiento asado","amount_g":80,"calories":27,"protein_g":1,"carbs_g":6,"fat_g":0},{"name":"Aceite de oliva","amount_g":12,"calories":106,"protein_g":0,"carbs_g":0,"fat_g":12}]'::jsonb,
 'Hornear bacalao 15 min. Triturar garbanzos con aceite. Asar pimientos. Montar plato.',
 '["proteína magra","fibra","omega-3"]'::jsonb, true),

-- ============================================================
-- SNACKS
-- ============================================================
(NULL, 'Energy Balls de Avena, Cacao y Chía',
 'Snack energético sin azúcar agregada. 3-4 bolas = snack pre-entreno ideal.',
 'snack', 10, 0, 8,
 '[{"name":"Avena rolled","amount_g":100,"calories":379,"protein_g":13,"carbs_g":68,"fat_g":7},{"name":"Mantequilla de maní","amount_g":60,"calories":357,"protein_g":14,"carbs_g":12,"fat_g":29},{"name":"Cacao en polvo sin azúcar","amount_g":15,"calories":38,"protein_g":4,"carbs_g":9,"fat_g":1},{"name":"Chía","amount_g":10,"calories":49,"protein_g":2,"carbs_g":4,"fat_g":3},{"name":"Miel","amount_g":30,"calories":92,"protein_g":0,"carbs_g":25,"fat_g":0}]'::jsonb,
 'Mezclar todos los ingredientes. Refrigerar 20 min. Formar bolas de 20g. Guardar en heladera hasta 1 semana.',
 '["sin cocción","snack","portable","sin azúcar agregada"]'::jsonb, true),

(NULL, 'Hummus con Bastones de Vegetales',
 'Snack de media mañana. Proteína vegetal + fibra + carbohidratos complejos.',
 'snack', 5, 0, 2,
 '[{"name":"Hummus","amount_g":80,"calories":186,"protein_g":6,"carbs_g":16,"fat_g":11},{"name":"Zanahoria","amount_g":100,"calories":41,"protein_g":1,"carbs_g":10,"fat_g":0},{"name":"Pepino","amount_g":80,"calories":12,"protein_g":1,"carbs_g":3,"fat_g":0},{"name":"Apio","amount_g":60,"calories":10,"protein_g":0,"carbs_g":2,"fat_g":0}]'::jsonb,
 'Servir hummus en bowl. Cortar vegetales en bastones. Dipear.',
 '["snack","fibra","proteína vegetal"]'::jsonb, true),

(NULL, 'Apple Slices con Mantequilla de Almendra',
 'Snack equilibrado con fibra de manzana y grasas de almendra. Ideal entre comidas.',
 'snack', 3, 0, 1,
 '[{"name":"Manzana","amount_g":180,"calories":94,"protein_g":0,"carbs_g":25,"fat_g":0},{"name":"Mantequilla de almendra","amount_g":20,"calories":120,"protein_g":4,"carbs_g":5,"fat_g":10}]'::jsonb,
 'Cortar manzana en gajos. Servir con mantequilla de almendra para dipear.',
 '["fibra","grasas saludables","snack natural"]'::jsonb, true),

(NULL, 'Tuna & Crackers Power Snack',
 'Proteína rápida con carbohidratos. Perfecto para recuperación entre sesiones dobles.',
 'snack', 3, 0, 1,
 '[{"name":"Atún en agua","amount_g":100,"calories":105,"protein_g":23,"carbs_g":0,"fat_g":1},{"name":"Galletas de arroz","amount_g":30,"calories":118,"protein_g":2,"carbs_g":26,"fat_g":1},{"name":"Limón","amount_g":15,"calories":4,"protein_g":0,"carbs_g":1,"fat_g":0}]'::jsonb,
 'Escurrir atún. Aliñar con limón. Servir sobre galletas de arroz.',
 '["proteína rápida","portable","dobles sesiones"]'::jsonb, true),

(NULL, 'Batido de Kiwi, Manzana y Jengibre',
 'Vitamina C para absorción de hierro + antioxidantes. Snack anti-fatiga.',
 'snack', 5, 0, 1,
 '[{"name":"Kiwi","amount_g":100,"calories":61,"protein_g":1,"carbs_g":15,"fat_g":0},{"name":"Manzana verde","amount_g":150,"calories":78,"protein_g":0,"carbs_g":21,"fat_g":0},{"name":"Jengibre","amount_g":5,"calories":4,"protein_g":0,"carbs_g":1,"fat_g":0},{"name":"Agua","amount_g":100,"calories":0,"protein_g":0,"carbs_g":0,"fat_g":0}]'::jsonb,
 'Licuar todo. Consumir fresco.',
 '["vitamina C","antioxidantes","hidratación"]'::jsonb, true),

-- ============================================================
-- MORE LUNCH & DINNER VARIETY
-- ============================================================
(NULL, 'Tortilla de Arroz Integral, Espinacas y Queso',
 'Tortilla al horno estilo frittata. Proteína + carbohidratos complejos.',
 'lunch', 10, 20, 2,
 '[{"name":"Arroz integral cocido","amount_g":200,"calories":231,"protein_g":5,"carbs_g":48,"fat_g":2},{"name":"Espinacas","amount_g":80,"calories":18,"protein_g":2,"carbs_g":3,"fat_g":0},{"name":"Huevo","amount_g":150,"calories":215,"protein_g":18,"carbs_g":1,"fat_g":15},{"name":"Queso parmesano","amount_g":20,"calories":83,"protein_g":7,"carbs_g":1,"fat_g":6}]'::jsonb,
 'Mezclar arroz cocido, espinacas salteadas y huevos batidos. Verter en molde. Hornear 20 min a 180°C.',
 '["sin gluten","alto proteína","meal prep"]'::jsonb, true),

(NULL, 'Pollo Shawarma con Arroz de Coliflor',
 'Version alta proteína baja carbohidrato. Para días de taper o días de descanso.',
 'dinner', 10, 15, 1,
 '[{"name":"Pechuga de pollo","amount_g":180,"calories":297,"protein_g":56,"carbs_g":0,"fat_g":6},{"name":"Coliflor rallada","amount_g":200,"calories":50,"protein_g":4,"carbs_g":10,"fat_g":0},{"name":"Yogur griego","amount_g":60,"calories":30,"protein_g":5,"carbs_g":2,"fat_g":0},{"name":"Especias shawarma","amount_g":5,"calories":15,"protein_g":1,"carbs_g":3,"fat_g":0}]'::jsonb,
 'Marinar pollo con especias. Cocinar en sartén. Saltear coliflor. Servir con yogur griego.',
 '["bajo carbohidrato","taper","alto proteína"]'::jsonb, true),

(NULL, 'Sopa de Miso con Tofu y Algas',
 'Recuperación de electrolitos + proteína vegetal. Ideal post-entrenamiento nocturno.',
 'recovery', 5, 10, 1,
 '[{"name":"Tofu firme","amount_g":120,"calories":95,"protein_g":10,"carbs_g":2,"fat_g":5},{"name":"Pasta de miso","amount_g":20,"calories":37,"protein_g":2,"carbs_g":5,"fat_g":1},{"name":"Algas wakame","amount_g":10,"calories":5,"protein_g":0,"carbs_g":1,"fat_g":0},{"name":"Cebolla de verdeo","amount_g":20,"calories":7,"protein_g":0,"carbs_g":2,"fat_g":0},{"name":"Agua caliente","amount_g":300,"calories":0,"protein_g":0,"carbs_g":0,"fat_g":0}]'::jsonb,
 'Disolver miso en agua caliente. Agregar tofu en cubos, algas y cebollita. Servir inmediatamente.',
 '["electrolitos","proteína vegetal","post-noche"]'::jsonb, true),

(NULL, 'Estofado de Garbanzos con Espinaca y Tomate',
 'Comida plant-based nutritiva para atletas veganos o días sin proteína animal.',
 'dinner', 10, 25, 2,
 '[{"name":"Garbanzos cocidos","amount_g":200,"calories":328,"protein_g":17,"carbs_g":55,"fat_g":5},{"name":"Espinacas","amount_g":100,"calories":23,"protein_g":3,"carbs_g":4,"fat_g":0},{"name":"Tomate triturado","amount_g":200,"calories":46,"protein_g":2,"carbs_g":10,"fat_g":0},{"name":"Ajo","amount_g":10,"calories":15,"protein_g":1,"carbs_g":3,"fat_g":0},{"name":"Aceite de oliva","amount_g":12,"calories":106,"protein_g":0,"carbs_g":0,"fat_g":12}]'::jsonb,
 'Sofreír ajo y cebolla. Agregar tomate y garbanzos. Cocer 20 min. Añadir espinacas al final.',
 '["vegano","hierro","proteína vegetal","fibra"]'::jsonb, true),

(NULL, 'Arroz con Leche Deportivo',
 'Versión deportiva del clásico. Rico en carbohidratos rápidos y proteína de caseína.',
 'recovery', 5, 20, 2,
 '[{"name":"Arroz blanco","amount_g":100,"calories":360,"protein_g":7,"carbs_g":80,"fat_g":1},{"name":"Leche entera","amount_g":400,"calories":260,"protein_g":13,"carbs_g":20,"fat_g":14},{"name":"Azúcar","amount_g":30,"calories":116,"protein_g":0,"carbs_g":30,"fat_g":0},{"name":"Canela","amount_g":2,"calories":5,"protein_g":0,"carbs_g":2,"fat_g":0}]'::jsonb,
 'Cocer arroz en leche con azúcar a fuego lento removiendo. Servir con canela.',
 '["caseína","recuperación","carbohidratos rápidos"]'::jsonb, true),

(NULL, 'Pollo Mediterráneo con Pasta Integral',
 'Almuerzo completo y sabroso. Aceitunas, tomate seco y alcaparras para micronutrientes.',
 'lunch', 10, 20, 2,
 '[{"name":"Pechuga de pollo","amount_g":160,"calories":264,"protein_g":50,"carbs_g":0,"fat_g":6},{"name":"Pasta integral","amount_g":130,"calories":455,"protein_g":16,"carbs_g":90,"fat_g":3},{"name":"Aceitunas","amount_g":30,"calories":42,"protein_g":0,"carbs_g":1,"fat_g":4},{"name":"Tomate cherry","amount_g":80,"calories":18,"protein_g":1,"carbs_g":4,"fat_g":0},{"name":"Albahaca fresca","amount_g":10,"calories":2,"protein_g":0,"carbs_g":0,"fat_g":0}]'::jsonb,
 'Cocer pasta. Saltear pollo con tomate. Mezclar con aceitunas y albahaca.',
 '["mediterráneo","carbohidratos complejos","almuerzo atleta"]'::jsonb, true),

(NULL, 'Smoothie Anti-Inflamatorio de Cúrcuma y Piña',
 'Bebida de recuperación activa. Bromelina de piña + curcumina. Excelente para rodillas y tendones.',
 'recovery', 5, 0, 1,
 '[{"name":"Piña","amount_g":150,"calories":78,"protein_g":1,"carbs_g":20,"fat_g":0},{"name":"Banana","amount_g":80,"calories":71,"protein_g":1,"carbs_g":18,"fat_g":0},{"name":"Cúrcuma","amount_g":3,"calories":10,"protein_g":0,"carbs_g":2,"fat_g":0},{"name":"Jengibre","amount_g":5,"calories":4,"protein_g":0,"carbs_g":1,"fat_g":0},{"name":"Leche de coco","amount_g":150,"calories":71,"protein_g":1,"carbs_g":2,"fat_g":7}]'::jsonb,
 'Licuar todo. Consumir frío.',
 '["antiinflamatorio","bromelina","recuperación tendones"]'::jsonb, true),

(NULL, 'Huevos Benedictinos del Atleta',
 'Versión deportiva del clásico. Pan integral + huevo poché + salmón + salsa de yogur.',
 'breakfast', 10, 10, 1,
 '[{"name":"Pan integral","amount_g":60,"calories":154,"protein_g":6,"carbs_g":30,"fat_g":2},{"name":"Huevo","amount_g":100,"calories":143,"protein_g":13,"carbs_g":1,"fat_g":10},{"name":"Salmón ahumado","amount_g":60,"calories":124,"protein_g":11,"carbs_g":0,"fat_g":9},{"name":"Yogur griego","amount_g":40,"calories":20,"protein_g":3,"carbs_g":1,"fat_g":0},{"name":"Palta","amount_g":50,"calories":80,"protein_g":1,"carbs_g":4,"fat_g":7}]'::jsonb,
 'Tostar pan. Pochar huevo. Montar: pan, palta, salmón, huevo, salsa de yogur.',
 '["omega-3","proteína","desayuno premium"]'::jsonb, true),

(NULL, 'Bowl de Frijoles Negros, Arroz y Huevo',
 'Clásico latinoamericano adaptado para deportistas. Hierro vegetal + proteína completa.',
 'lunch', 5, 15, 1,
 '[{"name":"Frijoles negros cocidos","amount_g":150,"calories":227,"protein_g":15,"carbs_g":41,"fat_g":1},{"name":"Arroz blanco cocido","amount_g":150,"calories":195,"protein_g":4,"carbs_g":43,"fat_g":0},{"name":"Huevo","amount_g":100,"calories":143,"protein_g":13,"carbs_g":1,"fat_g":10},{"name":"Cebollino","amount_g":10,"calories":3,"protein_g":0,"carbs_g":1,"fat_g":0}]'::jsonb,
 'Calentar frijoles. Servir sobre arroz. Colocar huevo frito o poché encima.',
 '["hierro vegetal","proteína completa","latinoamérica"]'::jsonb, true),

(NULL, 'Granola Casera de Avena y Nueces',
 'Granola sin azúcar refinada. Ideal como topping de yogur o consumo directo como snack.',
 'snack', 5, 20, 8,
 '[{"name":"Avena rolled","amount_g":200,"calories":758,"protein_g":26,"carbs_g":136,"fat_g":14},{"name":"Nueces","amount_g":60,"calories":392,"protein_g":9,"carbs_g":8,"fat_g":39},{"name":"Almendras","amount_g":40,"calories":230,"protein_g":8,"carbs_g":9,"fat_g":20},{"name":"Miel","amount_g":60,"calories":184,"protein_g":0,"carbs_g":50,"fat_g":0},{"name":"Aceite de coco","amount_g":20,"calories":177,"protein_g":0,"carbs_g":0,"fat_g":20}]'::jsonb,
 'Mezclar avena y frutos secos con miel y aceite. Extender en bandeja. Hornear 20 min a 160°C revolviendo cada 10 min.',
 '["sin azúcar refinada","snack","topping"]'::jsonb, true),

(NULL, 'Crema de Espárragos con Pollo Desmenuzado',
 'Sopa proteica y antioxidante. Los espárragos promueven excreción de ácido úrico.',
 'dinner', 10, 20, 2,
 '[{"name":"Espárragos","amount_g":200,"calories":40,"protein_g":4,"carbs_g":7,"fat_g":0},{"name":"Pollo desmenuzado","amount_g":120,"calories":198,"protein_g":37,"carbs_g":0,"fat_g":4},{"name":"Caldo de verduras","amount_g":300,"calories":15,"protein_g":1,"carbs_g":3,"fat_g":0},{"name":"Cebolla","amount_g":60,"calories":24,"protein_g":1,"carbs_g":6,"fat_g":0}]'::jsonb,
 'Cocer espárragos y cebolla en caldo. Licuar hasta crema. Agregar pollo desmenuzado al servir.',
 '["ácido úrico","antioxidante","proteína"]'::jsonb, true),

(NULL, 'Bowl de Maíz, Pollo y Aguacate al Estilo Mexicano',
 'Rico en carotenoides + proteína magra + grasas saludables. Muy completo y sabroso.',
 'lunch', 8, 10, 1,
 '[{"name":"Maíz cocido","amount_g":100,"calories":96,"protein_g":4,"carbs_g":21,"fat_g":1},{"name":"Pollo a la plancha","amount_g":130,"calories":215,"protein_g":40,"carbs_g":0,"fat_g":5},{"name":"Aguacate","amount_g":80,"calories":128,"protein_g":2,"carbs_g":7,"fat_g":11},{"name":"Frijoles negros","amount_g":80,"calories":121,"protein_g":8,"carbs_g":22,"fat_g":0},{"name":"Cilantro","amount_g":10,"calories":2,"protein_g":0,"carbs_g":0,"fat_g":0}]'::jsonb,
 'Cocinar pollo a la plancha. Armar bowl con todos los ingredientes. Aliñar con limón.',
 '["carotenoides","proteína magra","latinoamérica"]'::jsonb, true),

(NULL, 'Sándwich de Hummus, Huevo y Espinaca',
 'Almuerzo portable. Bajo en calorías, alta densidad de micronutrientes.',
 'lunch', 5, 5, 1,
 '[{"name":"Pan integral de semillas","amount_g":70,"calories":200,"protein_g":7,"carbs_g":38,"fat_g":3},{"name":"Huevo duro","amount_g":100,"calories":143,"protein_g":13,"carbs_g":1,"fat_g":10},{"name":"Hummus","amount_g":40,"calories":93,"protein_g":3,"carbs_g":8,"fat_g":6},{"name":"Espinaca fresca","amount_g":30,"calories":7,"protein_g":1,"carbs_g":1,"fat_g":0}]'::jsonb,
 'Untar pan con hummus. Colocar espinaca y huevo en rodajas.',
 '["portable","micronutrientes","iron"]'::jsonb, true),

(NULL, 'Steak de Coliflor con Lentejas y Tahini',
 'Plato vegano de alta proteína. Coliflor asada + lentejas + tahini = perfil completo.',
 'dinner', 10, 25, 1,
 '[{"name":"Coliflor","amount_g":250,"calories":63,"protein_g":5,"carbs_g":13,"fat_g":0},{"name":"Lentejas cocidas","amount_g":150,"calories":173,"protein_g":12,"carbs_g":30,"fat_g":1},{"name":"Tahini","amount_g":20,"calories":178,"protein_g":5,"carbs_g":7,"fat_g":16},{"name":"Limón","amount_g":20,"calories":6,"protein_g":0,"carbs_g":2,"fat_g":0},{"name":"Aceite de oliva","amount_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}]'::jsonb,
 'Cortar coliflor en medallones gruesos. Hornear 20 min con aceite. Calentar lentejas. Servir con salsa de tahini y limón.',
 '["vegano","proteína completa","plant-based"]'::jsonb, true)
ON CONFLICT DO NOTHING;
