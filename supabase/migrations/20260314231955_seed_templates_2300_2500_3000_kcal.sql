/*
  # Seed Meal Plan Templates: 2300, 2500, 3000 kcal
  
  Templates for endurance athletes and higher calorie needs:
  - 2300 kcal balanced (omnivore)
  - 2300 kcal high carb (endurance)
  - 2500 kcal balanced (omnivore)
  - 2500 kcal high protein (strength)
  - 3000 kcal endurance (high carb)
  - 3000 kcal high protein (strength/hypertrophy)
*/

INSERT INTO meal_plan_templates (name, name_es, name_en, description_es, description_en, calories_target, focus, dietary_pattern, protein_g, carbs_g, fat_g, fiber_g, tags, suitable_for, days) VALUES

-- ====================================================
-- 2300 kcal HIGH CARB (Endurance)
-- ====================================================
(
  '2300 kcal - Alto en Carbohidratos / High Carb (Endurance)',
  '2300 kcal - Alto en Carbohidratos',
  '2300 kcal - High Carb (Endurance)',
  'Plan de 2300 kcal rico en carbohidratos para deportistas de resistencia. Ideal para ciclismo, triatlón y maratón.',
  '2300 kcal high carb plan for endurance athletes. Ideal for cycling, triathlon and marathon.',
  2300,
  'high_carb',
  'omnivore',
  140,
  320,
  55,
  40,
  ARRAY['2300kcal','alto_carbohidratos','high_carb','resistencia','endurance','ciclismo','maratón'],
  ARRAY['cycling','triathlon','marathon','running','swimming'],
  '[
    {"day_number":1,"day_name":"Lunes / Monday","meals":[
      {"slot":"wake_up","name_es":"Dátiles y café","name_en":"Dates and coffee",
       "foods":[
         {"name_es":"Dátiles","name_en":"Dates","quantity_g":30,"calories":83,"protein_g":1,"carbs_g":22,"fat_g":0},
         {"name_es":"Café negro","name_en":"Black coffee","quantity_g":240,"calories":5,"protein_g":0,"carbs_g":1,"fat_g":0}
       ],"calories":88,"protein_g":1,"carbs_g":23,"fat_g":0,"notes_es":"Antes del entrenamiento","notes_en":"Pre-training"},
      {"slot":"breakfast","name_es":"Avena grande con plátano, miel y proteína","name_en":"Large oatmeal with banana, honey and protein",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":100,"calories":370,"protein_g":13,"carbs_g":66,"fat_g":7},
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Miel","name_en":"Honey","quantity_g":20,"calories":61,"protein_g":0,"carbs_g":17,"fat_g":0},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":25,"calories":100,"protein_g":20,"carbs_g":2,"fat_g":1}
       ],"calories":665,"protein_g":35,"carbs_g":119,"fat_g":8,"notes_es":"Después del entrenamiento","notes_en":"Post-training"},
      {"slot":"mid_morning","name_es":"Arroz con leche y frutos rojos","name_en":"Rice pudding with berries",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":120,"calories":156,"protein_g":3,"carbs_g":34,"fat_g":0},
         {"name_es":"Leche descremada","name_en":"Skim milk","quantity_g":150,"calories":52,"protein_g":5,"carbs_g":7,"fat_g":0},
         {"name_es":"Frutos rojos","name_en":"Mixed berries","quantity_g":80,"calories":35,"protein_g":1,"carbs_g":9,"fat_g":0}
       ],"calories":243,"protein_g":9,"carbs_g":50,"fat_g":0,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Pasta integral grande con pollo y vegetales","name_en":"Large whole wheat pasta with chicken and vegetables",
       "foods":[
         {"name_es":"Pasta integral cocida","name_en":"Cooked whole wheat pasta","quantity_g":250,"calories":345,"protein_g":14,"carbs_g":69,"fat_g":2},
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":150,"calories":165,"protein_g":31,"carbs_g":0,"fat_g":4},
         {"name_es":"Salsa de tomate","name_en":"Tomato sauce","quantity_g":100,"calories":35,"protein_g":1,"carbs_g":8,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":616,"protein_g":46,"carbs_g":77,"fat_g":14,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Pan con mermelada y queso","name_en":"Bread with jam and cheese",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":80,"calories":212,"protein_g":8,"carbs_g":40,"fat_g":3},
         {"name_es":"Mermelada de frutas","name_en":"Fruit jam","quantity_g":30,"calories":78,"protein_g":0,"carbs_g":20,"fat_g":0},
         {"name_es":"Queso fresco","name_en":"Fresh cheese","quantity_g":40,"calories":88,"protein_g":6,"carbs_g":1,"fat_g":7}
       ],"calories":378,"protein_g":14,"carbs_g":61,"fat_g":10,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Arroz con pollo y ensalada","name_en":"Rice with chicken and salad",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":200,"calories":260,"protein_g":5,"carbs_g":57,"fat_g":0},
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":150,"calories":165,"protein_g":31,"carbs_g":0,"fat_g":4},
         {"name_es":"Ensalada verde","name_en":"Green salad","quantity_g":100,"calories":20,"protein_g":1,"carbs_g":4,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":516,"protein_g":37,"carbs_g":61,"fat_g":12,"notes_es":"","notes_en":""}
    ],"total_calories":2506,"total_protein_g":142,"total_carbs_g":391,"total_fat_g":44},
    {"day_number":2,"day_name":"Martes / Tuesday","meals":[
      {"slot":"breakfast","name_es":"Tostadas francesas con plátano y sirope","name_en":"French toast with banana and syrup",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":100,"calories":265,"protein_g":10,"carbs_g":50,"fat_g":3},
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":110,"calories":156,"protein_g":13,"carbs_g":1,"fat_g":11},
         {"name_es":"Banana","name_en":"Banana","quantity_g":120,"calories":107,"protein_g":1,"carbs_g":27,"fat_g":0},
         {"name_es":"Sirope de agave","name_en":"Agave syrup","quantity_g":15,"calories":47,"protein_g":0,"carbs_g":12,"fat_g":0}
       ],"calories":575,"protein_g":24,"carbs_g":90,"fat_g":14,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Granola con leche y fruta","name_en":"Granola with milk and fruit",
       "foods":[
         {"name_es":"Granola","name_en":"Granola","quantity_g":60,"calories":268,"protein_g":6,"carbs_g":40,"fat_g":11},
         {"name_es":"Leche semidesnatada","name_en":"Semi-skim milk","quantity_g":200,"calories":92,"protein_g":7,"carbs_g":10,"fat_g":3},
         {"name_es":"Manzana","name_en":"Apple","quantity_g":120,"calories":63,"protein_g":0,"carbs_g":17,"fat_g":0}
       ],"calories":423,"protein_g":13,"carbs_g":67,"fat_g":14,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Lentejas con batata y arroz","name_en":"Lentils with sweet potato and rice",
       "foods":[
         {"name_es":"Lentejas cocidas","name_en":"Cooked lentils","quantity_g":200,"calories":230,"protein_g":18,"carbs_g":40,"fat_g":1},
         {"name_es":"Batata cocida","name_en":"Cooked sweet potato","quantity_g":150,"calories":129,"protein_g":3,"carbs_g":30,"fat_g":0},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":100,"calories":130,"protein_g":3,"carbs_g":29,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":560,"protein_g":24,"carbs_g":99,"fat_g":9,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Plátano con mantequilla de maní","name_en":"Banana with peanut butter",
       "foods":[
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Mantequilla de maní","name_en":"Peanut butter","quantity_g":20,"calories":118,"protein_g":5,"carbs_g":4,"fat_g":10}
       ],"calories":252,"protein_g":7,"carbs_g":38,"fat_g":10,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Atún con pasta y vegetales","name_en":"Tuna with pasta and vegetables",
       "foods":[
         {"name_es":"Atún en agua","name_en":"Canned tuna in water","quantity_g":150,"calories":174,"protein_g":39,"carbs_g":0,"fat_g":1},
         {"name_es":"Pasta cocida","name_en":"Cooked pasta","quantity_g":200,"calories":276,"protein_g":10,"carbs_g":56,"fat_g":1},
         {"name_es":"Pimiento y cebolla","name_en":"Bell pepper and onion","quantity_g":100,"calories":35,"protein_g":1,"carbs_g":8,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":556,"protein_g":50,"carbs_g":64,"fat_g":10,"notes_es":"","notes_en":""}
    ],"total_calories":2366,"total_protein_g":118,"total_carbs_g":358,"total_fat_g":57},
    {"day_number":3,"day_name":"Miércoles / Wednesday","meals":[
      {"slot":"breakfast","name_es":"Smoothie bowl de frutas con granola","name_en":"Fruit smoothie bowl with granola",
       "foods":[
         {"name_es":"Banana congelada","name_en":"Frozen banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Fresas","name_en":"Strawberries","quantity_g":100,"calories":32,"protein_g":1,"carbs_g":8,"fat_g":0},
         {"name_es":"Granola","name_en":"Granola","quantity_g":60,"calories":268,"protein_g":6,"carbs_g":40,"fat_g":11},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":25,"calories":100,"protein_g":20,"carbs_g":2,"fat_g":1}
       ],"calories":534,"protein_g":29,"carbs_g":84,"fat_g":12,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Arroz con leche de coco y mango","name_en":"Rice with coconut milk and mango",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":150,"calories":195,"protein_g":4,"carbs_g":43,"fat_g":0},
         {"name_es":"Leche de coco","name_en":"Coconut milk","quantity_g":100,"calories":52,"protein_g":0,"carbs_g":5,"fat_g":3},
         {"name_es":"Mango","name_en":"Mango","quantity_g":100,"calories":60,"protein_g":1,"carbs_g":15,"fat_g":0}
       ],"calories":307,"protein_g":5,"carbs_g":63,"fat_g":3,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Bowl de arroz, salmón y aguacate","name_en":"Rice, salmon and avocado bowl",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":250,"calories":325,"protein_g":6,"carbs_g":71,"fat_g":1},
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":150,"calories":280,"protein_g":30,"carbs_g":0,"fat_g":17},
         {"name_es":"Aguacate","name_en":"Avocado","quantity_g":60,"calories":96,"protein_g":1,"carbs_g":5,"fat_g":9}
       ],"calories":701,"protein_g":37,"carbs_g":76,"fat_g":27,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Dátiles con frutos secos","name_en":"Dates with nuts",
       "foods":[
         {"name_es":"Dátiles","name_en":"Dates","quantity_g":40,"calories":111,"protein_g":1,"carbs_g":29,"fat_g":0},
         {"name_es":"Almendras","name_en":"Almonds","quantity_g":20,"calories":116,"protein_g":4,"carbs_g":4,"fat_g":10}
       ],"calories":227,"protein_g":5,"carbs_g":33,"fat_g":10,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Cuscús con pollo y vegetales mediterráneos","name_en":"Couscous with chicken and Mediterranean vegetables",
       "foods":[
         {"name_es":"Cuscús cocido","name_en":"Cooked couscous","quantity_g":200,"calories":252,"protein_g":9,"carbs_g":51,"fat_g":0},
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":150,"calories":165,"protein_g":31,"carbs_g":0,"fat_g":4},
         {"name_es":"Berenjena y calabacín","name_en":"Eggplant and zucchini","quantity_g":150,"calories":40,"protein_g":2,"carbs_g":9,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":528,"protein_g":42,"carbs_g":60,"fat_g":12,"notes_es":"","notes_en":""}
    ],"total_calories":2297,"total_protein_g":118,"total_carbs_g":316,"total_fat_g":64},
    {"day_number":4,"day_name":"Jueves / Thursday","meals":[
      {"slot":"breakfast","name_es":"Avena nocturna con frutas y semillas","name_en":"Overnight oats with fruits and seeds",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":90,"calories":333,"protein_g":12,"carbs_g":60,"fat_g":6},
         {"name_es":"Leche","name_en":"Milk","quantity_g":200,"calories":124,"protein_g":8,"carbs_g":12,"fat_g":5},
         {"name_es":"Manzana rallada","name_en":"Grated apple","quantity_g":100,"calories":52,"protein_g":0,"carbs_g":14,"fat_g":0},
         {"name_es":"Semillas de chía","name_en":"Chia seeds","quantity_g":10,"calories":49,"protein_g":2,"carbs_g":4,"fat_g":3}
       ],"calories":558,"protein_g":22,"carbs_g":90,"fat_g":14,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Tostadas con plátano y miel","name_en":"Toast with banana and honey",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":60,"calories":159,"protein_g":6,"carbs_g":30,"fat_g":2},
         {"name_es":"Banana","name_en":"Banana","quantity_g":100,"calories":89,"protein_g":1,"carbs_g":23,"fat_g":0},
         {"name_es":"Miel","name_en":"Honey","quantity_g":15,"calories":46,"protein_g":0,"carbs_g":12,"fat_g":0}
       ],"calories":294,"protein_g":7,"carbs_g":65,"fat_g":2,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Arroz salteado con huevos y vegetales","name_en":"Fried rice with eggs and vegetables",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":250,"calories":325,"protein_g":6,"carbs_g":71,"fat_g":1},
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":110,"calories":156,"protein_g":13,"carbs_g":1,"fat_g":11},
         {"name_es":"Maíz","name_en":"Corn","quantity_g":80,"calories":87,"protein_g":3,"carbs_g":19,"fat_g":1},
         {"name_es":"Guisantes","name_en":"Peas","quantity_g":60,"calories":50,"protein_g":3,"carbs_g":9,"fat_g":0},
         {"name_es":"Aceite de sésamo","name_en":"Sesame oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":689,"protein_g":25,"carbs_g":100,"fat_g":21,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Gel energético y fruta","name_en":"Energy gel and fruit",
       "foods":[
         {"name_es":"Gel energético","name_en":"Energy gel","quantity_g":32,"calories":100,"protein_g":0,"carbs_g":25,"fat_g":0},
         {"name_es":"Naranja","name_en":"Orange","quantity_g":150,"calories":71,"protein_g":1,"carbs_g":18,"fat_g":0}
       ],"calories":171,"protein_g":1,"carbs_g":43,"fat_g":0,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Garbanzos con patata y espinaca","name_en":"Chickpeas with potato and spinach",
       "foods":[
         {"name_es":"Garbanzos cocidos","name_en":"Cooked chickpeas","quantity_g":200,"calories":328,"protein_g":18,"carbs_g":55,"fat_g":5},
         {"name_es":"Patata cocida","name_en":"Cooked potato","quantity_g":150,"calories":128,"protein_g":3,"carbs_g":29,"fat_g":0},
         {"name_es":"Espinaca","name_en":"Spinach","quantity_g":100,"calories":23,"protein_g":3,"carbs_g":4,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":550,"protein_g":24,"carbs_g":88,"fat_g":13,"notes_es":"","notes_en":""}
    ],"total_calories":2262,"total_protein_g":79,"total_carbs_g":386,"total_fat_g":50},
    {"day_number":5,"day_name":"Viernes / Friday","meals":[
      {"slot":"breakfast","name_es":"Avena con proteína y frutas tropicales","name_en":"Oats with protein and tropical fruits",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":100,"calories":370,"protein_g":13,"carbs_g":66,"fat_g":7},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":25,"calories":100,"protein_g":20,"carbs_g":2,"fat_g":1},
         {"name_es":"Piña","name_en":"Pineapple","quantity_g":100,"calories":50,"protein_g":1,"carbs_g":13,"fat_g":0},
         {"name_es":"Coco rallado","name_en":"Shredded coconut","quantity_g":15,"calories":99,"protein_g":1,"carbs_g":4,"fat_g":9}
       ],"calories":619,"protein_g":35,"carbs_g":85,"fat_g":17,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Zumo de naranja con galletas de avena","name_en":"Orange juice with oat cookies",
       "foods":[
         {"name_es":"Zumo de naranja","name_en":"Orange juice","quantity_g":250,"calories":112,"protein_g":2,"carbs_g":26,"fat_g":0},
         {"name_es":"Galletas de avena","name_en":"Oat cookies","quantity_g":40,"calories":172,"protein_g":4,"carbs_g":28,"fat_g":6}
       ],"calories":284,"protein_g":6,"carbs_g":54,"fat_g":6,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Pasta con salmón y crema de espinaca","name_en":"Pasta with salmon and spinach cream",
       "foods":[
         {"name_es":"Pasta cocida","name_en":"Cooked pasta","quantity_g":250,"calories":345,"protein_g":12,"carbs_g":69,"fat_g":2},
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":120,"calories":224,"protein_g":24,"carbs_g":0,"fat_g":14},
         {"name_es":"Espinaca","name_en":"Spinach","quantity_g":80,"calories":18,"protein_g":2,"carbs_g":3,"fat_g":0},
         {"name_es":"Queso para fundir ligero","name_en":"Light melting cheese","quantity_g":30,"calories":62,"protein_g":4,"carbs_g":2,"fat_g":4}
       ],"calories":649,"protein_g":42,"carbs_g":74,"fat_g":20,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Barrita energética y plátano","name_en":"Energy bar and banana",
       "foods":[
         {"name_es":"Barrita energética","name_en":"Energy bar","quantity_g":45,"calories":165,"protein_g":4,"carbs_g":28,"fat_g":5},
         {"name_es":"Banana","name_en":"Banana","quantity_g":100,"calories":89,"protein_g":1,"carbs_g":23,"fat_g":0}
       ],"calories":254,"protein_g":5,"carbs_g":51,"fat_g":5,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pechuga de pollo con patata y vegetales","name_en":"Chicken breast with potato and vegetables",
       "foods":[
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":180,"calories":198,"protein_g":37,"carbs_g":0,"fat_g":4},
         {"name_es":"Patata cocida","name_en":"Cooked potato","quantity_g":200,"calories":170,"protein_g":4,"carbs_g":39,"fat_g":0},
         {"name_es":"Brócoli al vapor","name_en":"Steamed broccoli","quantity_g":150,"calories":51,"protein_g":4,"carbs_g":10,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":490,"protein_g":45,"carbs_g":49,"fat_g":12,"notes_es":"","notes_en":""}
    ],"total_calories":2296,"total_protein_g":133,"total_carbs_g":313,"total_fat_g":60},
    {"day_number":6,"day_name":"Sábado / Saturday (Entrenamiento largo / Long training day)","meals":[
      {"slot":"wake_up","name_es":"Gel y bebida isotónica","name_en":"Gel and isotonic drink",
       "foods":[
         {"name_es":"Gel energético","name_en":"Energy gel","quantity_g":32,"calories":100,"protein_g":0,"carbs_g":25,"fat_g":0},
         {"name_es":"Bebida isotónica","name_en":"Isotonic drink","quantity_g":500,"calories":150,"protein_g":0,"carbs_g":38,"fat_g":0}
       ],"calories":250,"protein_g":0,"carbs_g":63,"fat_g":0,"notes_es":"Durante el entrenamiento largo","notes_en":"During long training"},
      {"slot":"breakfast","name_es":"Cargamento de carbos - arroz con miel y proteína","name_en":"Carb load - rice with honey and protein",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":250,"calories":325,"protein_g":6,"carbs_g":71,"fat_g":1},
         {"name_es":"Miel","name_en":"Honey","quantity_g":25,"calories":77,"protein_g":0,"carbs_g":21,"fat_g":0},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2}
       ],"calories":522,"protein_g":30,"carbs_g":95,"fat_g":3,"notes_es":"Post-entrenamiento largo","notes_en":"Post long training"},
      {"slot":"mid_morning","name_es":"Tostadas con huevo y aguacate","name_en":"Toast with egg and avocado",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":80,"calories":212,"protein_g":8,"carbs_g":40,"fat_g":3},
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":110,"calories":156,"protein_g":13,"carbs_g":1,"fat_g":11},
         {"name_es":"Aguacate","name_en":"Avocado","quantity_g":60,"calories":96,"protein_g":1,"carbs_g":5,"fat_g":9}
       ],"calories":464,"protein_g":22,"carbs_g":46,"fat_g":23,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Bowl de arroz, atún y vegetales","name_en":"Rice, tuna and vegetable bowl",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":250,"calories":325,"protein_g":6,"carbs_g":71,"fat_g":1},
         {"name_es":"Atún en agua","name_en":"Canned tuna in water","quantity_g":150,"calories":174,"protein_g":39,"carbs_g":0,"fat_g":1},
         {"name_es":"Pepino y tomate","name_en":"Cucumber and tomato","quantity_g":150,"calories":30,"protein_g":2,"carbs_g":7,"fat_g":0}
       ],"calories":529,"protein_g":47,"carbs_g":78,"fat_g":2,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Plátano y galletas de arroz","name_en":"Banana and rice cakes",
       "foods":[
         {"name_es":"Banana","name_en":"Banana","quantity_g":120,"calories":107,"protein_g":1,"carbs_g":27,"fat_g":0},
         {"name_es":"Galletas de arroz","name_en":"Rice cakes","quantity_g":30,"calories":116,"protein_g":2,"carbs_g":25,"fat_g":1}
       ],"calories":223,"protein_g":3,"carbs_g":52,"fat_g":1,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pasta con carne magra","name_en":"Pasta with lean beef",
       "foods":[
         {"name_es":"Pasta cocida","name_en":"Cooked pasta","quantity_g":200,"calories":276,"protein_g":10,"carbs_g":56,"fat_g":1},
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":150,"calories":231,"protein_g":33,"carbs_g":0,"fat_g":10},
         {"name_es":"Salsa de tomate","name_en":"Tomato sauce","quantity_g":100,"calories":35,"protein_g":1,"carbs_g":8,"fat_g":0}
       ],"calories":542,"protein_g":44,"carbs_g":64,"fat_g":11,"notes_es":"","notes_en":""}
    ],"total_calories":2530,"total_protein_g":146,"total_carbs_g":398,"total_fat_g":40},
    {"day_number":7,"day_name":"Domingo / Sunday (Recuperación / Recovery)","meals":[
      {"slot":"breakfast","name_es":"Avena cremosa con frutas y nueces","name_en":"Creamy oats with fruits and nuts",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":80,"calories":296,"protein_g":10,"carbs_g":53,"fat_g":5},
         {"name_es":"Leche","name_en":"Milk","quantity_g":200,"calories":124,"protein_g":8,"carbs_g":12,"fat_g":5},
         {"name_es":"Banana","name_en":"Banana","quantity_g":100,"calories":89,"protein_g":1,"carbs_g":23,"fat_g":0},
         {"name_es":"Nueces","name_en":"Walnuts","quantity_g":20,"calories":131,"protein_g":3,"carbs_g":3,"fat_g":13}
       ],"calories":640,"protein_g":22,"carbs_g":91,"fat_g":23,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Yogur griego con miel y granola","name_en":"Greek yogurt with honey and granola",
       "foods":[
         {"name_es":"Yogur griego","name_en":"Greek yogurt","quantity_g":150,"calories":130,"protein_g":17,"carbs_g":6,"fat_g":4},
         {"name_es":"Miel","name_en":"Honey","quantity_g":15,"calories":46,"protein_g":0,"carbs_g":12,"fat_g":0},
         {"name_es":"Granola","name_en":"Granola","quantity_g":30,"calories":134,"protein_g":3,"carbs_g":20,"fat_g":5}
       ],"calories":310,"protein_g":20,"carbs_g":38,"fat_g":9,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Asado dominical con guarnición de arroz","name_en":"Sunday roast with rice side",
       "foods":[
         {"name_es":"Pollo asado","name_en":"Roast chicken","quantity_g":200,"calories":296,"protein_g":44,"carbs_g":0,"fat_g":13},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":180,"calories":234,"protein_g":5,"carbs_g":52,"fat_g":0},
         {"name_es":"Ensalada mixta","name_en":"Mixed salad","quantity_g":100,"calories":25,"protein_g":2,"carbs_g":4,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":626,"protein_g":51,"carbs_g":56,"fat_g":21,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Frutas variadas con queso","name_en":"Assorted fruits with cheese",
       "foods":[
         {"name_es":"Uvas","name_en":"Grapes","quantity_g":100,"calories":67,"protein_g":1,"carbs_g":17,"fat_g":0},
         {"name_es":"Queso fresco","name_en":"Fresh cheese","quantity_g":40,"calories":88,"protein_g":6,"carbs_g":1,"fat_g":7}
       ],"calories":155,"protein_g":7,"carbs_g":18,"fat_g":7,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Caldo con pasta y vegetales","name_en":"Broth with pasta and vegetables",
       "foods":[
         {"name_es":"Pasta cocida","name_en":"Cooked pasta","quantity_g":150,"calories":207,"protein_g":8,"carbs_g":41,"fat_g":1},
         {"name_es":"Zanahoria","name_en":"Carrot","quantity_g":80,"calories":33,"protein_g":1,"carbs_g":8,"fat_g":0},
         {"name_es":"Apio","name_en":"Celery","quantity_g":60,"calories":10,"protein_g":0,"carbs_g":2,"fat_g":0},
         {"name_es":"Pollo desmenuzado","name_en":"Shredded chicken","quantity_g":80,"calories":88,"protein_g":16,"carbs_g":0,"fat_g":2}
       ],"calories":338,"protein_g":25,"carbs_g":51,"fat_g":3,"notes_es":"","notes_en":""}
    ],"total_calories":2069,"total_protein_g":125,"total_carbs_g":254,"total_fat_g":63}
  ]'::jsonb
),

-- ====================================================
-- 2500 kcal HIGH PROTEIN (Strength/Hypertrophy)
-- ====================================================
(
  '2500 kcal - Alto en Proteína / High Protein (Fuerza)',
  '2500 kcal - Alto en Proteína (Fuerza)',
  '2500 kcal - High Protein (Strength)',
  'Plan de 2500 kcal con alta proteína para deportistas de fuerza e hipertrofia. +2g proteína/kg.',
  '2500 kcal high protein plan for strength athletes and hypertrophy. 2g+ protein/kg.',
  2500,
  'high_protein',
  'omnivore',
  220,
  220,
  70,
  30,
  ARRAY['2500kcal','alto_proteina','high_protein','fuerza','strength','hipertrofia','musculacion'],
  ARRAY['weightlifting','crossfit','powerlifting','bodybuilding','rugby'],
  '[
    {"day_number":1,"day_name":"Lunes / Monday","meals":[
      {"slot":"breakfast","name_es":"Tortilla de 5 claras con avena y frutas","name_en":"5-egg white omelette with oats and fruit",
       "foods":[
         {"name_es":"Claras de huevo","name_en":"Egg whites","quantity_g":300,"calories":155,"protein_g":33,"carbs_g":2,"fat_g":0},
         {"name_es":"Avena","name_en":"Oats","quantity_g":80,"calories":296,"protein_g":10,"carbs_g":53,"fat_g":5},
         {"name_es":"Banana","name_en":"Banana","quantity_g":100,"calories":89,"protein_g":1,"carbs_g":23,"fat_g":0}
       ],"calories":540,"protein_g":44,"carbs_g":78,"fat_g":5,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Batido de proteína doble con leche","name_en":"Double protein shake with milk",
       "foods":[
         {"name_es":"Proteína en polvo (whey)","name_en":"Whey protein powder","quantity_g":60,"calories":240,"protein_g":48,"carbs_g":6,"fat_g":4},
         {"name_es":"Leche semidesnatada","name_en":"Semi-skim milk","quantity_g":300,"calories":138,"protein_g":10,"carbs_g":15,"fat_g":4}
       ],"calories":378,"protein_g":58,"carbs_g":21,"fat_g":8,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Doble ración de pollo con arroz y brócoli","name_en":"Double portion chicken with rice and broccoli",
       "foods":[
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":300,"calories":330,"protein_g":62,"carbs_g":0,"fat_g":7},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":200,"calories":260,"protein_g":5,"carbs_g":57,"fat_g":0},
         {"name_es":"Brócoli al vapor","name_en":"Steamed broccoli","quantity_g":200,"calories":68,"protein_g":6,"carbs_g":13,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":746,"protein_g":73,"carbs_g":70,"fat_g":17,"notes_es":"","notes_en":""},
      {"slot":"post_training","name_es":"Batido de recuperación con creatina","name_en":"Recovery shake with creatine",
       "foods":[
         {"name_es":"Proteína en polvo (whey)","name_en":"Whey protein powder","quantity_g":40,"calories":160,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Dextrosa","name_en":"Dextrose","quantity_g":40,"calories":156,"protein_g":0,"carbs_g":40,"fat_g":0}
       ],"calories":316,"protein_g":32,"carbs_g":44,"fat_g":2,"notes_es":"Inmediatamente post entreno","notes_en":"Immediately post-workout"},
      {"slot":"dinner","name_es":"Carne vacuna magra con quinoa y espárragos","name_en":"Lean beef with quinoa and asparagus",
       "foods":[
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":250,"calories":385,"protein_g":55,"carbs_g":0,"fat_g":17},
         {"name_es":"Quinoa cocida","name_en":"Cooked quinoa","quantity_g":150,"calories":183,"protein_g":7,"carbs_g":33,"fat_g":3},
         {"name_es":"Espárragos","name_en":"Asparagus","quantity_g":150,"calories":30,"protein_g":3,"carbs_g":6,"fat_g":0}
       ],"calories":598,"protein_g":65,"carbs_g":39,"fat_g":20,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Caseína con leche","name_en":"Casein with milk",
       "foods":[
         {"name_es":"Proteína caseína","name_en":"Casein protein","quantity_g":35,"calories":133,"protein_g":28,"carbs_g":3,"fat_g":2}
       ],"calories":133,"protein_g":28,"carbs_g":3,"fat_g":2,"notes_es":"Antes de dormir","notes_en":"Before sleep"}
    ],"total_calories":2711,"total_protein_g":300,"total_carbs_g":255,"total_fat_g":54},
    {"day_number":2,"day_name":"Martes / Tuesday","meals":[
      {"slot":"breakfast","name_es":"Tortilla entera con pan integral y aguacate","name_en":"Whole egg omelette with whole grain bread and avocado",
       "foods":[
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":220,"calories":312,"protein_g":26,"carbs_g":1,"fat_g":22},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":80,"calories":212,"protein_g":8,"carbs_g":40,"fat_g":3},
         {"name_es":"Aguacate","name_en":"Avocado","quantity_g":60,"calories":96,"protein_g":1,"carbs_g":5,"fat_g":9}
       ],"calories":620,"protein_g":35,"carbs_g":46,"fat_g":34,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Atún con arroz integral","name_en":"Tuna with brown rice",
       "foods":[
         {"name_es":"Atún en agua","name_en":"Canned tuna in water","quantity_g":180,"calories":209,"protein_g":46,"carbs_g":0,"fat_g":2},
         {"name_es":"Arroz integral cocido","name_en":"Cooked brown rice","quantity_g":150,"calories":165,"protein_g":4,"carbs_g":34,"fat_g":1}
       ],"calories":374,"protein_g":50,"carbs_g":34,"fat_g":3,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Salmón con pasta integral y vegetales","name_en":"Salmon with whole wheat pasta and vegetables",
       "foods":[
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":250,"calories":467,"protein_g":50,"carbs_g":0,"fat_g":29},
         {"name_es":"Pasta integral cocida","name_en":"Cooked whole wheat pasta","quantity_g":200,"calories":276,"protein_g":12,"carbs_g":55,"fat_g":2},
         {"name_es":"Espinaca salteada","name_en":"Sautéed spinach","quantity_g":100,"calories":23,"protein_g":3,"carbs_g":4,"fat_g":0}
       ],"calories":766,"protein_g":65,"carbs_g":59,"fat_g":31,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Yogur griego con frutos secos","name_en":"Greek yogurt with nuts",
       "foods":[
         {"name_es":"Yogur griego","name_en":"Greek yogurt","quantity_g":250,"calories":217,"protein_g":29,"carbs_g":10,"fat_g":6},
         {"name_es":"Almendras","name_en":"Almonds","quantity_g":25,"calories":145,"protein_g":5,"carbs_g":5,"fat_g":13}
       ],"calories":362,"protein_g":34,"carbs_g":15,"fat_g":19,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pechuga de pavo con batata y judías","name_en":"Turkey breast with sweet potato and beans",
       "foods":[
         {"name_es":"Pechuga de pavo","name_en":"Turkey breast","quantity_g":250,"calories":275,"protein_g":56,"carbs_g":0,"fat_g":4},
         {"name_es":"Batata cocida","name_en":"Cooked sweet potato","quantity_g":180,"calories":155,"protein_g":3,"carbs_g":36,"fat_g":0},
         {"name_es":"Judías verdes","name_en":"Green beans","quantity_g":150,"calories":47,"protein_g":3,"carbs_g":11,"fat_g":0}
       ],"calories":477,"protein_g":62,"carbs_g":47,"fat_g":4,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Requesón proteico","name_en":"Protein quark",
       "foods":[
         {"name_es":"Quark/requesón","name_en":"Quark","quantity_g":150,"calories":100,"protein_g":17,"carbs_g":4,"fat_g":1}
       ],"calories":100,"protein_g":17,"carbs_g":4,"fat_g":1,"notes_es":"","notes_en":""}
    ],"total_calories":2699,"total_protein_g":263,"total_carbs_g":205,"total_fat_g":92},
    {"day_number":3,"day_name":"Miércoles / Wednesday","meals":[
      {"slot":"breakfast","name_es":"Pudding proteico de chía y avena","name_en":"Protein chia and oat pudding",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":40,"calories":160,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Semillas de chía","name_en":"Chia seeds","quantity_g":30,"calories":146,"protein_g":5,"carbs_g":12,"fat_g":9},
         {"name_es":"Avena","name_en":"Oats","quantity_g":60,"calories":222,"protein_g":8,"carbs_g":40,"fat_g":4},
         {"name_es":"Leche descremada","name_en":"Skim milk","quantity_g":200,"calories":70,"protein_g":7,"carbs_g":10,"fat_g":0}
       ],"calories":598,"protein_g":52,"carbs_g":66,"fat_g":15,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Queso cottage con piña","name_en":"Cottage cheese with pineapple",
       "foods":[
         {"name_es":"Queso cottage","name_en":"Cottage cheese","quantity_g":250,"calories":213,"protein_g":29,"carbs_g":9,"fat_g":9},
         {"name_es":"Piña","name_en":"Pineapple","quantity_g":100,"calories":50,"protein_g":1,"carbs_g":13,"fat_g":0}
       ],"calories":263,"protein_g":30,"carbs_g":22,"fat_g":9,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Carne magra con arroz y vegetales variados","name_en":"Lean beef with rice and mixed vegetables",
       "foods":[
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":280,"calories":431,"protein_g":62,"carbs_g":0,"fat_g":19},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":200,"calories":260,"protein_g":5,"carbs_g":57,"fat_g":0},
         {"name_es":"Pimiento mixto","name_en":"Mixed pepper","quantity_g":150,"calories":47,"protein_g":2,"carbs_g":11,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":809,"protein_g":69,"carbs_g":68,"fat_g":27,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Batido de proteína y plátano","name_en":"Protein shake and banana",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":40,"calories":160,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Banana","name_en":"Banana","quantity_g":120,"calories":107,"protein_g":1,"carbs_g":27,"fat_g":0}
       ],"calories":267,"protein_g":33,"carbs_g":31,"fat_g":2,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Merluza al horno con quinoa y brócoli","name_en":"Baked hake with quinoa and broccoli",
       "foods":[
         {"name_es":"Merluza","name_en":"Hake","quantity_g":300,"calories":258,"protein_g":54,"carbs_g":0,"fat_g":4},
         {"name_es":"Quinoa cocida","name_en":"Cooked quinoa","quantity_g":150,"calories":183,"protein_g":7,"carbs_g":33,"fat_g":3},
         {"name_es":"Brócoli","name_en":"Broccoli","quantity_g":200,"calories":68,"protein_g":6,"carbs_g":13,"fat_g":0}
       ],"calories":509,"protein_g":67,"carbs_g":46,"fat_g":7,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Caseína nocturna","name_en":"Overnight casein",
       "foods":[
         {"name_es":"Proteína caseína","name_en":"Casein protein","quantity_g":40,"calories":152,"protein_g":32,"carbs_g":4,"fat_g":2}
       ],"calories":152,"protein_g":32,"carbs_g":4,"fat_g":2,"notes_es":"","notes_en":""}
    ],"total_calories":2598,"total_protein_g":283,"total_carbs_g":237,"total_fat_g":62},
    {"day_number":4,"day_name":"Jueves / Thursday","meals":[
      {"slot":"breakfast","name_es":"Huevos completos con avena y frutas","name_en":"Whole eggs with oats and fruit",
       "foods":[
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":165,"calories":234,"protein_g":19,"carbs_g":1,"fat_g":16},
         {"name_es":"Claras de huevo","name_en":"Egg whites","quantity_g":120,"calories":62,"protein_g":13,"carbs_g":1,"fat_g":0},
         {"name_es":"Avena","name_en":"Oats","quantity_g":80,"calories":296,"protein_g":10,"carbs_g":53,"fat_g":5},
         {"name_es":"Fresas","name_en":"Strawberries","quantity_g":100,"calories":32,"protein_g":1,"carbs_g":8,"fat_g":0}
       ],"calories":624,"protein_g":43,"carbs_g":63,"fat_g":21,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Batido de proteína con avena y mantequilla de maní","name_en":"Protein shake with oats and peanut butter",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":40,"calories":160,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Avena","name_en":"Oats","quantity_g":40,"calories":148,"protein_g":5,"carbs_g":27,"fat_g":3},
         {"name_es":"Mantequilla de maní","name_en":"Peanut butter","quantity_g":20,"calories":118,"protein_g":5,"carbs_g":4,"fat_g":10}
       ],"calories":426,"protein_g":42,"carbs_g":35,"fat_g":15,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Pollo con pasta integral y salsa de tomate","name_en":"Chicken with whole wheat pasta and tomato sauce",
       "foods":[
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":250,"calories":275,"protein_g":52,"carbs_g":0,"fat_g":6},
         {"name_es":"Pasta integral cocida","name_en":"Cooked whole wheat pasta","quantity_g":250,"calories":345,"protein_g":14,"carbs_g":68,"fat_g":2},
         {"name_es":"Salsa de tomate","name_en":"Tomato sauce","quantity_g":100,"calories":35,"protein_g":1,"carbs_g":8,"fat_g":0}
       ],"calories":655,"protein_g":67,"carbs_g":76,"fat_g":8,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Yogur griego alto proteico","name_en":"High protein Greek yogurt",
       "foods":[
         {"name_es":"Yogur griego (0%)","name_en":"Greek yogurt (0%)","quantity_g":250,"calories":145,"protein_g":25,"carbs_g":9,"fat_g":0},
         {"name_es":"Miel","name_en":"Honey","quantity_g":10,"calories":30,"protein_g":0,"carbs_g":8,"fat_g":0}
       ],"calories":175,"protein_g":25,"carbs_g":17,"fat_g":0,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Carne de res con batata y espinaca","name_en":"Beef with sweet potato and spinach",
       "foods":[
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":250,"calories":385,"protein_g":55,"carbs_g":0,"fat_g":17},
         {"name_es":"Batata cocida","name_en":"Cooked sweet potato","quantity_g":200,"calories":172,"protein_g":4,"carbs_g":40,"fat_g":0},
         {"name_es":"Espinaca","name_en":"Spinach","quantity_g":150,"calories":35,"protein_g":4,"carbs_g":6,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":663,"protein_g":63,"carbs_g":46,"fat_g":25,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Quark con arándanos","name_en":"Quark with blueberries",
       "foods":[
         {"name_es":"Quark","name_en":"Quark","quantity_g":150,"calories":100,"protein_g":17,"carbs_g":4,"fat_g":1},
         {"name_es":"Arándanos","name_en":"Blueberries","quantity_g":50,"calories":29,"protein_g":0,"carbs_g":7,"fat_g":0}
       ],"calories":129,"protein_g":17,"carbs_g":11,"fat_g":1,"notes_es":"","notes_en":""}
    ],"total_calories":2672,"total_protein_g":257,"total_carbs_g":248,"total_fat_g":70},
    {"day_number":5,"day_name":"Viernes / Friday","meals":[
      {"slot":"breakfast","name_es":"Tortilla de claras con salmón ahumado","name_en":"Egg white omelette with smoked salmon",
       "foods":[
         {"name_es":"Claras de huevo","name_en":"Egg whites","quantity_g":300,"calories":155,"protein_g":33,"carbs_g":2,"fat_g":0},
         {"name_es":"Salmón ahumado","name_en":"Smoked salmon","quantity_g":80,"calories":105,"protein_g":17,"carbs_g":0,"fat_g":4},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":80,"calories":212,"protein_g":8,"carbs_g":40,"fat_g":3}
       ],"calories":472,"protein_g":58,"carbs_g":42,"fat_g":7,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Batido de proteína post-entreno","name_en":"Post-workout protein shake",
       "foods":[
         {"name_es":"Proteína en polvo (whey)","name_en":"Whey protein powder","quantity_g":50,"calories":200,"protein_g":40,"carbs_g":5,"fat_g":3},
         {"name_es":"Banana","name_en":"Banana","quantity_g":120,"calories":107,"protein_g":1,"carbs_g":27,"fat_g":0}
       ],"calories":307,"protein_g":41,"carbs_g":32,"fat_g":3,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Pechuga de pavo con garbanzos y quinoa","name_en":"Turkey breast with chickpeas and quinoa",
       "foods":[
         {"name_es":"Pechuga de pavo","name_en":"Turkey breast","quantity_g":250,"calories":275,"protein_g":56,"carbs_g":0,"fat_g":4},
         {"name_es":"Garbanzos cocidos","name_en":"Cooked chickpeas","quantity_g":150,"calories":246,"protein_g":13,"carbs_g":41,"fat_g":4},
         {"name_es":"Quinoa cocida","name_en":"Cooked quinoa","quantity_g":100,"calories":122,"protein_g":4,"carbs_g":21,"fat_g":2},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":714,"protein_g":73,"carbs_g":62,"fat_g":18,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Cottage con kiwi","name_en":"Cottage cheese with kiwi",
       "foods":[
         {"name_es":"Queso cottage","name_en":"Cottage cheese","quantity_g":200,"calories":170,"protein_g":23,"carbs_g":7,"fat_g":7},
         {"name_es":"Kiwi","name_en":"Kiwi","quantity_g":120,"calories":74,"protein_g":1,"carbs_g":18,"fat_g":0}
       ],"calories":244,"protein_g":24,"carbs_g":25,"fat_g":7,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Atún al horno con papa y ensalada","name_en":"Baked tuna with potato and salad",
       "foods":[
         {"name_es":"Atún fresco","name_en":"Fresh tuna","quantity_g":250,"calories":250,"protein_g":55,"carbs_g":0,"fat_g":2},
         {"name_es":"Papa cocida","name_en":"Cooked potato","quantity_g":200,"calories":170,"protein_g":4,"carbs_g":39,"fat_g":0},
         {"name_es":"Ensalada verde","name_en":"Green salad","quantity_g":100,"calories":20,"protein_g":1,"carbs_g":4,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":511,"protein_g":60,"carbs_g":43,"fat_g":10,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Caseína con leche","name_en":"Casein with milk",
       "foods":[
         {"name_es":"Proteína caseína","name_en":"Casein protein","quantity_g":35,"calories":133,"protein_g":28,"carbs_g":3,"fat_g":2}
       ],"calories":133,"protein_g":28,"carbs_g":3,"fat_g":2,"notes_es":"","notes_en":""}
    ],"total_calories":2381,"total_protein_g":284,"total_carbs_g":205,"total_fat_g":47},
    {"day_number":6,"day_name":"Sábado / Saturday","meals":[
      {"slot":"breakfast","name_es":"Pancakes proteicos con frutos del bosque","name_en":"Protein pancakes with mixed berries",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":40,"calories":160,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Avena","name_en":"Oats","quantity_g":60,"calories":222,"protein_g":8,"carbs_g":40,"fat_g":4},
         {"name_es":"Claras de huevo","name_en":"Egg whites","quantity_g":120,"calories":62,"protein_g":13,"carbs_g":1,"fat_g":0},
         {"name_es":"Frutos del bosque","name_en":"Mixed berries","quantity_g":100,"calories":45,"protein_g":1,"carbs_g":11,"fat_g":0}
       ],"calories":489,"protein_g":54,"carbs_g":56,"fat_g":6,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Batido de proteína y avena","name_en":"Protein and oat shake",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":40,"calories":160,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Avena","name_en":"Oats","quantity_g":40,"calories":148,"protein_g":5,"carbs_g":27,"fat_g":3},
         {"name_es":"Leche descremada","name_en":"Skim milk","quantity_g":250,"calories":86,"protein_g":8,"carbs_g":12,"fat_g":0}
       ],"calories":394,"protein_g":45,"carbs_g":43,"fat_g":5,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Carne con arroz grande y ensalada","name_en":"Beef with large rice and salad",
       "foods":[
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":280,"calories":431,"protein_g":62,"carbs_g":0,"fat_g":19},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":250,"calories":325,"protein_g":6,"carbs_g":71,"fat_g":1},
         {"name_es":"Ensalada mixta","name_en":"Mixed salad","quantity_g":100,"calories":25,"protein_g":2,"carbs_g":4,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":852,"protein_g":70,"carbs_g":75,"fat_g":28,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Yogur griego y frutos secos","name_en":"Greek yogurt and mixed nuts",
       "foods":[
         {"name_es":"Yogur griego","name_en":"Greek yogurt","quantity_g":200,"calories":174,"protein_g":23,"carbs_g":8,"fat_g":5},
         {"name_es":"Nueces mixtas","name_en":"Mixed nuts","quantity_g":25,"calories":154,"protein_g":4,"carbs_g":5,"fat_g":14}
       ],"calories":328,"protein_g":27,"carbs_g":13,"fat_g":19,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Salmón con lentejas y espinaca","name_en":"Salmon with lentils and spinach",
       "foods":[
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":200,"calories":374,"protein_g":40,"carbs_g":0,"fat_g":23},
         {"name_es":"Lentejas cocidas","name_en":"Cooked lentils","quantity_g":200,"calories":230,"protein_g":18,"carbs_g":40,"fat_g":1},
         {"name_es":"Espinaca","name_en":"Spinach","quantity_g":100,"calories":23,"protein_g":3,"carbs_g":4,"fat_g":0}
       ],"calories":627,"protein_g":61,"carbs_g":44,"fat_g":24,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Requesón nocturno","name_en":"Overnight quark",
       "foods":[
         {"name_es":"Quark/requesón","name_en":"Quark","quantity_g":200,"calories":133,"protein_g":23,"carbs_g":5,"fat_g":1}
       ],"calories":133,"protein_g":23,"carbs_g":5,"fat_g":1,"notes_es":"","notes_en":""}
    ],"total_calories":2823,"total_protein_g":280,"total_carbs_g":236,"total_fat_g":83},
    {"day_number":7,"day_name":"Domingo / Sunday","meals":[
      {"slot":"breakfast","name_es":"Revuelto de huevos con espinaca y tostadas","name_en":"Scrambled eggs with spinach and toast",
       "foods":[
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":165,"calories":234,"protein_g":19,"carbs_g":1,"fat_g":16},
         {"name_es":"Claras de huevo","name_en":"Egg whites","quantity_g":180,"calories":93,"protein_g":20,"carbs_g":1,"fat_g":0},
         {"name_es":"Espinaca","name_en":"Spinach","quantity_g":80,"calories":18,"protein_g":2,"carbs_g":3,"fat_g":0},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":60,"calories":159,"protein_g":6,"carbs_g":30,"fat_g":2}
       ],"calories":504,"protein_g":47,"carbs_g":35,"fat_g":18,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Proteína con fruta y mantequilla de maní","name_en":"Protein with fruit and peanut butter",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":35,"calories":140,"protein_g":28,"carbs_g":3,"fat_g":2},
         {"name_es":"Manzana","name_en":"Apple","quantity_g":150,"calories":78,"protein_g":0,"carbs_g":21,"fat_g":0},
         {"name_es":"Mantequilla de maní","name_en":"Peanut butter","quantity_g":20,"calories":118,"protein_g":5,"carbs_g":4,"fat_g":10}
       ],"calories":336,"protein_g":33,"carbs_g":28,"fat_g":12,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Pechuga de pollo doble con arroz y garbanzos","name_en":"Double chicken breast with rice and chickpeas",
       "foods":[
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":300,"calories":330,"protein_g":62,"carbs_g":0,"fat_g":7},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":150,"calories":195,"protein_g":4,"carbs_g":43,"fat_g":0},
         {"name_es":"Garbanzos cocidos","name_en":"Cooked chickpeas","quantity_g":120,"calories":197,"protein_g":10,"carbs_g":33,"fat_g":3},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":793,"protein_g":76,"carbs_g":76,"fat_g":18,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Cottage cheese con piña","name_en":"Cottage cheese with pineapple",
       "foods":[
         {"name_es":"Queso cottage","name_en":"Cottage cheese","quantity_g":200,"calories":170,"protein_g":23,"carbs_g":7,"fat_g":7},
         {"name_es":"Piña","name_en":"Pineapple","quantity_g":100,"calories":50,"protein_g":1,"carbs_g":13,"fat_g":0}
       ],"calories":220,"protein_g":24,"carbs_g":20,"fat_g":7,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Carne vacuna con quinoa y brócoli","name_en":"Beef with quinoa and broccoli",
       "foods":[
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":200,"calories":308,"protein_g":44,"carbs_g":0,"fat_g":14},
         {"name_es":"Quinoa cocida","name_en":"Cooked quinoa","quantity_g":150,"calories":183,"protein_g":7,"carbs_g":33,"fat_g":3},
         {"name_es":"Brócoli","name_en":"Broccoli","quantity_g":180,"calories":61,"protein_g":5,"carbs_g":12,"fat_g":0}
       ],"calories":552,"protein_g":56,"carbs_g":45,"fat_g":17,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Caseína con canela","name_en":"Casein with cinnamon",
       "foods":[
         {"name_es":"Proteína caseína","name_en":"Casein protein","quantity_g":40,"calories":152,"protein_g":32,"carbs_g":4,"fat_g":2}
       ],"calories":152,"protein_g":32,"carbs_g":4,"fat_g":2,"notes_es":"","notes_en":""}
    ],"total_calories":2557,"total_protein_g":268,"total_carbs_g":208,"total_fat_g":74}
  ]'::jsonb
),

-- ====================================================
-- 3000 kcal ENDURANCE (High Carb)
-- ====================================================
(
  '3000 kcal - Resistencia / Endurance (Alto Carbo)',
  '3000 kcal - Resistencia (Alto Carbohidratos)',
  '3000 kcal - Endurance (High Carb)',
  'Plan de 3000 kcal alto en carbohidratos para triatletas, ciclistas y maratonistas con alto volumen.',
  '3000 kcal high carb plan for triathletes, cyclists and marathon runners with high training volume.',
  3000,
  'endurance',
  'omnivore',
  160,
  420,
  75,
  45,
  ARRAY['3000kcal','resistencia','endurance','alto_carbohidratos','high_carb','triatlon','ciclismo'],
  ARRAY['triathlon','cycling','marathon','ironman','ultra_running'],
  '[
    {"day_number":1,"day_name":"Lunes / Monday","meals":[
      {"slot":"wake_up","name_es":"Gel + bebida isotónica (pre-entreno)","name_en":"Gel + isotonic drink (pre-training)",
       "foods":[
         {"name_es":"Gel energético","name_en":"Energy gel","quantity_g":32,"calories":100,"protein_g":0,"carbs_g":25,"fat_g":0},
         {"name_es":"Bebida isotónica","name_en":"Isotonic drink","quantity_g":500,"calories":150,"protein_g":0,"carbs_g":38,"fat_g":0}
       ],"calories":250,"protein_g":0,"carbs_g":63,"fat_g":0,"notes_es":"Pre-entrenamiento","notes_en":"Pre-training"},
      {"slot":"breakfast","name_es":"Gran avena con proteína y 2 plátanos","name_en":"Large protein oats with 2 bananas",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":120,"calories":444,"protein_g":15,"carbs_g":79,"fat_g":8},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},
         {"name_es":"Banana","name_en":"Banana","quantity_g":200,"calories":178,"protein_g":2,"carbs_g":46,"fat_g":0},
         {"name_es":"Miel","name_en":"Honey","quantity_g":20,"calories":61,"protein_g":0,"carbs_g":17,"fat_g":0},
         {"name_es":"Leche","name_en":"Milk","quantity_g":200,"calories":124,"protein_g":8,"carbs_g":12,"fat_g":5}
       ],"calories":927,"protein_g":49,"carbs_g":157,"fat_g":15,"notes_es":"Post-entreno","notes_en":"Post-training"},
      {"slot":"mid_morning","name_es":"Arroz de leche con frutas","name_en":"Rice pudding with fruit",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":150,"calories":195,"protein_g":4,"carbs_g":43,"fat_g":0},
         {"name_es":"Leche","name_en":"Milk","quantity_g":200,"calories":124,"protein_g":8,"carbs_g":12,"fat_g":5},
         {"name_es":"Mango","name_en":"Mango","quantity_g":120,"calories":76,"protein_g":1,"carbs_g":19,"fat_g":0}
       ],"calories":395,"protein_g":13,"carbs_g":74,"fat_g":5,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Pasta XXL con pollo y salsa de tomate","name_en":"XXL pasta with chicken and tomato sauce",
       "foods":[
         {"name_es":"Pasta integral cocida","name_en":"Cooked whole wheat pasta","quantity_g":300,"calories":414,"protein_g":18,"carbs_g":83,"fat_g":2},
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":200,"calories":220,"protein_g":41,"carbs_g":0,"fat_g":5},
         {"name_es":"Salsa de tomate","name_en":"Tomato sauce","quantity_g":150,"calories":53,"protein_g":2,"carbs_g":12,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":775,"protein_g":61,"carbs_g":95,"fat_g":17,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Plátanos con mantequilla de maní y pan","name_en":"Bananas with peanut butter and bread",
       "foods":[
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Mantequilla de maní","name_en":"Peanut butter","quantity_g":25,"calories":148,"protein_g":6,"carbs_g":5,"fat_g":13},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":60,"calories":159,"protein_g":6,"carbs_g":30,"fat_g":2}
       ],"calories":441,"protein_g":14,"carbs_g":69,"fat_g":15,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Arroz con salmón y batata","name_en":"Rice with salmon and sweet potato",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":250,"calories":325,"protein_g":6,"carbs_g":71,"fat_g":1},
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":150,"calories":280,"protein_g":30,"carbs_g":0,"fat_g":17},
         {"name_es":"Batata cocida","name_en":"Cooked sweet potato","quantity_g":150,"calories":129,"protein_g":3,"carbs_g":30,"fat_g":0}
       ],"calories":734,"protein_g":39,"carbs_g":101,"fat_g":18,"notes_es":"","notes_en":""}
    ],"total_calories":3522,"total_protein_g":176,"total_carbs_g":559,"total_fat_g":70},
    {"day_number":2,"day_name":"Martes / Tuesday (Descanso / Rest day)","meals":[
      {"slot":"breakfast","name_es":"Avena con proteína y frutas","name_en":"Protein oats with fruit",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":100,"calories":370,"protein_g":13,"carbs_g":66,"fat_g":7},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":25,"calories":100,"protein_g":20,"carbs_g":2,"fat_g":1},
         {"name_es":"Fresas","name_en":"Strawberries","quantity_g":150,"calories":48,"protein_g":1,"carbs_g":12,"fat_g":0}
       ],"calories":518,"protein_g":34,"carbs_g":80,"fat_g":8,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Tostadas con aguacate y huevo","name_en":"Toast with avocado and egg",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":80,"calories":212,"protein_g":8,"carbs_g":40,"fat_g":3},
         {"name_es":"Aguacate","name_en":"Avocado","quantity_g":80,"calories":128,"protein_g":2,"carbs_g":7,"fat_g":12},
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":55,"calories":78,"protein_g":6,"carbs_g":0,"fat_g":5}
       ],"calories":418,"protein_g":16,"carbs_g":47,"fat_g":20,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Arroz con legumbres y pollo","name_en":"Rice with legumes and chicken",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":200,"calories":260,"protein_g":5,"carbs_g":57,"fat_g":0},
         {"name_es":"Lentejas cocidas","name_en":"Cooked lentils","quantity_g":150,"calories":173,"protein_g":13,"carbs_g":30,"fat_g":1},
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":150,"calories":165,"protein_g":31,"carbs_g":0,"fat_g":4},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":686,"protein_g":49,"carbs_g":87,"fat_g":15,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Smoothie de recuperación","name_en":"Recovery smoothie",
       "foods":[
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},
         {"name_es":"Leche de almendras","name_en":"Almond milk","quantity_g":300,"calories":45,"protein_g":1,"carbs_g":2,"fat_g":3}
       ],"calories":299,"protein_g":27,"carbs_g":39,"fat_g":5,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Atún con pasta y verduras","name_en":"Tuna with pasta and vegetables",
       "foods":[
         {"name_es":"Pasta cocida","name_en":"Cooked pasta","quantity_g":250,"calories":345,"protein_g":12,"carbs_g":69,"fat_g":2},
         {"name_es":"Atún en agua","name_en":"Canned tuna in water","quantity_g":150,"calories":174,"protein_g":39,"carbs_g":0,"fat_g":1},
         {"name_es":"Pimiento y tomate","name_en":"Pepper and tomato","quantity_g":150,"calories":45,"protein_g":2,"carbs_g":10,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":635,"protein_g":53,"carbs_g":79,"fat_g":11,"notes_es":"","notes_en":""}
    ],"total_calories":2556,"total_protein_g":179,"total_carbs_g":332,"total_fat_g":59},
    {"day_number":3,"day_name":"Miércoles / Wednesday","meals":[
      {"slot":"breakfast","name_es":"Panqueques de avena y plátano con sirope","name_en":"Oat and banana pancakes with syrup",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":100,"calories":370,"protein_g":13,"carbs_g":66,"fat_g":7},
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":110,"calories":156,"protein_g":13,"carbs_g":1,"fat_g":11},
         {"name_es":"Sirope de arce","name_en":"Maple syrup","quantity_g":25,"calories":87,"protein_g":0,"carbs_g":22,"fat_g":0}
       ],"calories":747,"protein_g":28,"carbs_g":123,"fat_g":18,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Barrita energética y bebida isotónica","name_en":"Energy bar and isotonic drink",
       "foods":[
         {"name_es":"Barrita energética","name_en":"Energy bar","quantity_g":60,"calories":222,"protein_g":5,"carbs_g":37,"fat_g":7},
         {"name_es":"Bebida isotónica","name_en":"Isotonic drink","quantity_g":500,"calories":150,"protein_g":0,"carbs_g":38,"fat_g":0}
       ],"calories":372,"protein_g":5,"carbs_g":75,"fat_g":7,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Gran bowl de sushi con arroz y salmón","name_en":"Large sushi bowl with rice and salmon",
       "foods":[
         {"name_es":"Arroz de sushi cocido","name_en":"Cooked sushi rice","quantity_g":300,"calories":420,"protein_g":9,"carbs_g":93,"fat_g":1},
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":200,"calories":374,"protein_g":40,"carbs_g":0,"fat_g":23},
         {"name_es":"Aguacate","name_en":"Avocado","quantity_g":60,"calories":96,"protein_g":1,"carbs_g":5,"fat_g":9},
         {"name_es":"Pepino","name_en":"Cucumber","quantity_g":80,"calories":13,"protein_g":1,"carbs_g":3,"fat_g":0}
       ],"calories":903,"protein_g":51,"carbs_g":101,"fat_g":33,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Dátiles y yogur","name_en":"Dates and yogurt",
       "foods":[
         {"name_es":"Dátiles","name_en":"Dates","quantity_g":60,"calories":166,"protein_g":1,"carbs_g":44,"fat_g":0},
         {"name_es":"Yogur natural","name_en":"Natural yogurt","quantity_g":150,"calories":92,"protein_g":6,"carbs_g":10,"fat_g":3}
       ],"calories":258,"protein_g":7,"carbs_g":54,"fat_g":3,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pollo con arroz integral y vegetales asados","name_en":"Chicken with brown rice and roasted vegetables",
       "foods":[
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":200,"calories":220,"protein_g":41,"carbs_g":0,"fat_g":5},
         {"name_es":"Arroz integral cocido","name_en":"Cooked brown rice","quantity_g":250,"calories":275,"protein_g":6,"carbs_g":57,"fat_g":2},
         {"name_es":"Vegetales asados mixtos","name_en":"Mixed roasted vegetables","quantity_g":200,"calories":70,"protein_g":3,"carbs_g":15,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":653,"protein_g":50,"carbs_g":72,"fat_g":17,"notes_es":"","notes_en":""}
    ],"total_calories":2933,"total_protein_g":141,"total_carbs_g":425,"total_fat_g":78},
    {"day_number":4,"day_name":"Jueves / Thursday","meals":[
      {"slot":"breakfast","name_es":"Batido de carbohidratos post-entreno","name_en":"Post-training carb shake",
       "foods":[
         {"name_es":"Maltodextrina","name_en":"Maltodextrin","quantity_g":60,"calories":228,"protein_g":0,"carbs_g":57,"fat_g":0},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0}
       ],"calories":482,"protein_g":26,"carbs_g":94,"fat_g":2,"notes_es":"Inmediatamente post-entreno","notes_en":"Immediately post-training"},
      {"slot":"mid_morning","name_es":"Tazón de granola con yogur y frutas","name_en":"Granola bowl with yogurt and fruit",
       "foods":[
         {"name_es":"Granola","name_en":"Granola","quantity_g":80,"calories":357,"protein_g":9,"carbs_g":53,"fat_g":14},
         {"name_es":"Yogur griego","name_en":"Greek yogurt","quantity_g":150,"calories":130,"protein_g":17,"carbs_g":6,"fat_g":4},
         {"name_es":"Fresas","name_en":"Strawberries","quantity_g":100,"calories":32,"protein_g":1,"carbs_g":8,"fat_g":0}
       ],"calories":519,"protein_g":27,"carbs_g":67,"fat_g":18,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Arroz con carne y vegetales","name_en":"Rice with beef and vegetables",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":300,"calories":390,"protein_g":7,"carbs_g":86,"fat_g":1},
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":200,"calories":308,"protein_g":44,"carbs_g":0,"fat_g":14},
         {"name_es":"Espinaca y pimiento","name_en":"Spinach and pepper","quantity_g":150,"calories":45,"protein_g":3,"carbs_g":9,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":831,"protein_g":54,"carbs_g":95,"fat_g":25,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Batido de plátano y avena","name_en":"Banana and oat shake",
       "foods":[
         {"name_es":"Banana","name_en":"Banana","quantity_g":200,"calories":178,"protein_g":2,"carbs_g":46,"fat_g":0},
         {"name_es":"Avena","name_en":"Oats","quantity_g":40,"calories":148,"protein_g":5,"carbs_g":27,"fat_g":3},
         {"name_es":"Leche","name_en":"Milk","quantity_g":200,"calories":124,"protein_g":8,"carbs_g":12,"fat_g":5}
       ],"calories":450,"protein_g":15,"carbs_g":85,"fat_g":8,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Merluza con patata asada y ensalada","name_en":"Hake with roasted potato and salad",
       "foods":[
         {"name_es":"Merluza","name_en":"Hake","quantity_g":250,"calories":215,"protein_g":45,"carbs_g":0,"fat_g":3},
         {"name_es":"Patata asada","name_en":"Roasted potato","quantity_g":250,"calories":263,"protein_g":5,"carbs_g":61,"fat_g":0},
         {"name_es":"Ensalada","name_en":"Salad","quantity_g":100,"calories":25,"protein_g":2,"carbs_g":4,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":574,"protein_g":52,"carbs_g":65,"fat_g":11,"notes_es":"","notes_en":""}
    ],"total_calories":2856,"total_protein_g":174,"total_carbs_g":406,"total_fat_g":64},
    {"day_number":5,"day_name":"Viernes / Friday","meals":[
      {"slot":"breakfast","name_es":"Avena tropical con proteína","name_en":"Tropical protein oats",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":100,"calories":370,"protein_g":13,"carbs_g":66,"fat_g":7},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},
         {"name_es":"Piña","name_en":"Pineapple","quantity_g":150,"calories":75,"protein_g":1,"carbs_g":19,"fat_g":0},
         {"name_es":"Coco rallado","name_en":"Shredded coconut","quantity_g":20,"calories":133,"protein_g":1,"carbs_g":5,"fat_g":12}
       ],"calories":698,"protein_g":39,"carbs_g":93,"fat_g":21,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Pan con mermelada y queso cottage","name_en":"Bread with jam and cottage cheese",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":100,"calories":265,"protein_g":10,"carbs_g":50,"fat_g":3},
         {"name_es":"Mermelada","name_en":"Jam","quantity_g":30,"calories":78,"protein_g":0,"carbs_g":20,"fat_g":0},
         {"name_es":"Queso cottage","name_en":"Cottage cheese","quantity_g":100,"calories":85,"protein_g":11,"carbs_g":4,"fat_g":4}
       ],"calories":428,"protein_g":21,"carbs_g":74,"fat_g":7,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Bowl de arroz japonés con pollo y alga","name_en":"Japanese rice bowl with chicken and seaweed",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":300,"calories":390,"protein_g":7,"carbs_g":86,"fat_g":1},
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":200,"calories":220,"protein_g":41,"carbs_g":0,"fat_g":5},
         {"name_es":"Edamame","name_en":"Edamame","quantity_g":80,"calories":109,"protein_g":9,"carbs_g":9,"fat_g":5},
         {"name_es":"Aceite de sésamo","name_en":"Sesame oil","quantity_g":5,"calories":44,"protein_g":0,"carbs_g":0,"fat_g":5}
       ],"calories":763,"protein_g":57,"carbs_g":95,"fat_g":16,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Galletas de arroz con mantequilla de almendras","name_en":"Rice cakes with almond butter",
       "foods":[
         {"name_es":"Galletas de arroz","name_en":"Rice cakes","quantity_g":60,"calories":232,"protein_g":4,"carbs_g":49,"fat_g":2},
         {"name_es":"Mantequilla de almendras","name_en":"Almond butter","quantity_g":25,"calories":151,"protein_g":5,"carbs_g":5,"fat_g":14}
       ],"calories":383,"protein_g":9,"carbs_g":54,"fat_g":16,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pasta con pavo y salsa boloñesa light","name_en":"Pasta with turkey bolognese sauce",
       "foods":[
         {"name_es":"Pasta cocida","name_en":"Cooked pasta","quantity_g":280,"calories":386,"protein_g":14,"carbs_g":78,"fat_g":1},
         {"name_es":"Pechuga de pavo","name_en":"Turkey breast","quantity_g":150,"calories":165,"protein_g":34,"carbs_g":0,"fat_g":2},
         {"name_es":"Salsa de tomate","name_en":"Tomato sauce","quantity_g":150,"calories":53,"protein_g":2,"carbs_g":12,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":675,"protein_g":50,"carbs_g":90,"fat_g":11,"notes_es":"","notes_en":""}
    ],"total_calories":2947,"total_protein_g":176,"total_carbs_g":406,"total_fat_g":71},
    {"day_number":6,"day_name":"Sábado / Saturday (Carrera larga / Long run)","meals":[
      {"slot":"wake_up","name_es":"Pre-entreno largo (2h+)","name_en":"Pre long training (2h+)",
       "foods":[
         {"name_es":"Tostadas con mermelada","name_en":"Toast with jam","quantity_g":80,"calories":291,"protein_g":8,"carbs_g":65,"fat_g":2},
         {"name_es":"Café con azúcar","name_en":"Coffee with sugar","quantity_g":250,"calories":50,"protein_g":0,"carbs_g":13,"fat_g":0}
       ],"calories":341,"protein_g":8,"carbs_g":78,"fat_g":2,"notes_es":"90 min antes","notes_en":"90 min before"},
      {"slot":"during_training","name_es":"Geles y bebida (durante)","name_en":"Gels and drink (during)",
       "foods":[
         {"name_es":"Gel energético x3","name_en":"Energy gel x3","quantity_g":96,"calories":300,"protein_g":0,"carbs_g":75,"fat_g":0},
         {"name_es":"Bebida isotónica","name_en":"Isotonic drink","quantity_g":750,"calories":225,"protein_g":0,"carbs_g":56,"fat_g":0}
       ],"calories":525,"protein_g":0,"carbs_g":131,"fat_g":0,"notes_es":"Durante el ejercicio","notes_en":"During exercise"},
      {"slot":"post_training","name_es":"Recuperación inmediata","name_en":"Immediate recovery",
       "foods":[
         {"name_es":"Leche chocolatada","name_en":"Chocolate milk","quantity_g":400,"calories":308,"protein_g":16,"carbs_g":52,"fat_g":5},
         {"name_es":"Banana","name_en":"Banana","quantity_g":120,"calories":107,"protein_g":1,"carbs_g":27,"fat_g":0}
       ],"calories":415,"protein_g":17,"carbs_g":79,"fat_g":5,"notes_es":"Inmediatamente post-entreno","notes_en":"Immediately post-training"},
      {"slot":"lunch","name_es":"Gran pasta con salmón y espárragos","name_en":"Large pasta with salmon and asparagus",
       "foods":[
         {"name_es":"Pasta cocida","name_en":"Cooked pasta","quantity_g":350,"calories":483,"protein_g":17,"carbs_g":97,"fat_g":2},
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":180,"calories":336,"protein_g":36,"carbs_g":0,"fat_g":21},
         {"name_es":"Espárragos","name_en":"Asparagus","quantity_g":150,"calories":30,"protein_g":3,"carbs_g":6,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":937,"protein_g":56,"carbs_g":103,"fat_g":33,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Galletas con queso y fruta","name_en":"Crackers with cheese and fruit",
       "foods":[
         {"name_es":"Galletas integrales","name_en":"Whole grain crackers","quantity_g":40,"calories":172,"protein_g":4,"carbs_g":28,"fat_g":6},
         {"name_es":"Queso fresco","name_en":"Fresh cheese","quantity_g":40,"calories":88,"protein_g":6,"carbs_g":1,"fat_g":7},
         {"name_es":"Uvas","name_en":"Grapes","quantity_g":100,"calories":67,"protein_g":1,"carbs_g":17,"fat_g":0}
       ],"calories":327,"protein_g":11,"carbs_g":46,"fat_g":13,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Arroz con pollo y ensalada","name_en":"Rice with chicken and salad",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":250,"calories":325,"protein_g":6,"carbs_g":71,"fat_g":1},
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":180,"calories":198,"protein_g":37,"carbs_g":0,"fat_g":4},
         {"name_es":"Ensalada mixta","name_en":"Mixed salad","quantity_g":100,"calories":25,"protein_g":2,"carbs_g":4,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":619,"protein_g":45,"carbs_g":75,"fat_g":13,"notes_es":"","notes_en":""}
    ],"total_calories":3164,"total_protein_g":137,"total_carbs_g":512,"total_fat_g":66},
    {"day_number":7,"day_name":"Domingo / Sunday (Recuperación activa / Active recovery)","meals":[
      {"slot":"breakfast","name_es":"Avena cremosa con miel y fruta","name_en":"Creamy oats with honey and fruit",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":100,"calories":370,"protein_g":13,"carbs_g":66,"fat_g":7},
         {"name_es":"Leche","name_en":"Milk","quantity_g":250,"calories":155,"protein_g":10,"carbs_g":15,"fat_g":6},
         {"name_es":"Miel","name_en":"Honey","quantity_g":20,"calories":61,"protein_g":0,"carbs_g":17,"fat_g":0},
         {"name_es":"Banana","name_en":"Banana","quantity_g":100,"calories":89,"protein_g":1,"carbs_g":23,"fat_g":0}
       ],"calories":675,"protein_g":24,"carbs_g":121,"fat_g":13,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Zumo natural y tostadas","name_en":"Natural juice and toast",
       "foods":[
         {"name_es":"Zumo de naranja","name_en":"Orange juice","quantity_g":300,"calories":135,"protein_g":2,"carbs_g":31,"fat_g":0},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":60,"calories":159,"protein_g":6,"carbs_g":30,"fat_g":2}
       ],"calories":294,"protein_g":8,"carbs_g":61,"fat_g":2,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Pollo al horno con arroz y vegetales","name_en":"Baked chicken with rice and vegetables",
       "foods":[
         {"name_es":"Pollo al horno","name_en":"Baked chicken","quantity_g":220,"calories":325,"protein_g":48,"carbs_g":0,"fat_g":14},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":250,"calories":325,"protein_g":6,"carbs_g":71,"fat_g":1},
         {"name_es":"Vegetales asados","name_en":"Roasted vegetables","quantity_g":200,"calories":70,"protein_g":3,"carbs_g":15,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":808,"protein_g":57,"carbs_g":86,"fat_g":25,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Fruta variada con yogur","name_en":"Assorted fruit with yogurt",
       "foods":[
         {"name_es":"Frutos del bosque","name_en":"Mixed berries","quantity_g":150,"calories":66,"protein_g":1,"carbs_g":16,"fat_g":0},
         {"name_es":"Naranja","name_en":"Orange","quantity_g":150,"calories":71,"protein_g":1,"carbs_g":18,"fat_g":0},
         {"name_es":"Yogur natural","name_en":"Natural yogurt","quantity_g":150,"calories":92,"protein_g":6,"carbs_g":10,"fat_g":3}
       ],"calories":229,"protein_g":8,"carbs_g":44,"fat_g":3,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Sopa de pasta con pollo y vegetales","name_en":"Chicken pasta soup with vegetables",
       "foods":[
         {"name_es":"Pasta cocida","name_en":"Cooked pasta","quantity_g":200,"calories":276,"protein_g":10,"carbs_g":56,"fat_g":1},
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":150,"calories":165,"protein_g":31,"carbs_g":0,"fat_g":4},
         {"name_es":"Zanahoria y apio","name_en":"Carrot and celery","quantity_g":150,"calories":50,"protein_g":2,"carbs_g":11,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":562,"protein_g":43,"carbs_g":67,"fat_g":13,"notes_es":"","notes_en":""}
    ],"total_calories":2568,"total_protein_g":140,"total_carbs_g":379,"total_fat_g":56}
  ]'::jsonb
);
