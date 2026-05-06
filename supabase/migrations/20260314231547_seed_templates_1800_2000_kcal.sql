/*
  # Seed Meal Plan Templates: 1800 kcal and 2000 kcal
  
  Inserts templates for:
  - 1800 kcal balanced (omnivore)
  - 1800 kcal high protein (omnivore)
  - 1800 kcal high carb (endurance)
  - 2000 kcal balanced (omnivore)
  - 2000 kcal high protein (omnivore)
  - 2000 kcal high carb (endurance)
  
  Each template contains a full 7-day meal plan with breakfast, mid-morning snack,
  lunch, afternoon snack, dinner, and optional pre/post training meals.
  All food names are bilingual (es/en).
*/

INSERT INTO meal_plan_templates (name, name_es, name_en, description_es, description_en, calories_target, focus, dietary_pattern, protein_g, carbs_g, fat_g, fiber_g, tags, suitable_for, days) VALUES

-- ====================================================
-- 1800 kcal BALANCED
-- ====================================================
(
  '1800 kcal - Balanceado / Balanced',
  '1800 kcal - Balanceado',
  '1800 kcal - Balanced',
  'Plan semanal de 1800 kcal con macros equilibrados. Ideal para mantenimiento o pérdida de peso moderada.',
  'Weekly 1800 kcal plan with balanced macros. Ideal for maintenance or moderate weight loss.',
  1800,
  'balanced',
  'omnivore',
  145,
  200,
  55,
  32,
  ARRAY['1800kcal','balanceado','balanced','mantenimiento','maintenance'],
  ARRAY['running','cycling','triathlon','general_fitness'],
  '[
    {
      "day_number":1,"day_name":"Lunes / Monday",
      "meals":[
        {"slot":"breakfast","name_es":"Avena con banana y huevo","name_en":"Oats with banana and egg",
         "foods":[
           {"name_es":"Avena","name_en":"Oats","quantity_g":60,"calories":222,"protein_g":8,"carbs_g":40,"fat_g":4},
           {"name_es":"Banana","name_en":"Banana","quantity_g":100,"calories":89,"protein_g":1,"carbs_g":23,"fat_g":0},
           {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":55,"calories":78,"protein_g":6,"carbs_g":0,"fat_g":5}
         ],"calories":389,"protein_g":15,"carbs_g":63,"fat_g":9,"notes_es":"","notes_en":""},
        {"slot":"mid_morning","name_es":"Yogur griego con nueces","name_en":"Greek yogurt with walnuts",
         "foods":[
           {"name_es":"Yogur griego","name_en":"Greek yogurt","quantity_g":150,"calories":130,"protein_g":17,"carbs_g":6,"fat_g":4},
           {"name_es":"Nueces","name_en":"Walnuts","quantity_g":20,"calories":131,"protein_g":3,"carbs_g":3,"fat_g":13}
         ],"calories":261,"protein_g":20,"carbs_g":9,"fat_g":17,"notes_es":"","notes_en":""},
        {"slot":"lunch","name_es":"Pollo con arroz y ensalada","name_en":"Chicken with rice and salad",
         "foods":[
           {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":150,"calories":165,"protein_g":31,"carbs_g":0,"fat_g":4},
           {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":150,"calories":195,"protein_g":4,"carbs_g":43,"fat_g":0},
           {"name_es":"Ensalada mixta","name_en":"Mixed salad","quantity_g":100,"calories":25,"protein_g":2,"carbs_g":4,"fat_g":0},
           {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
         ],"calories":473,"protein_g":37,"carbs_g":47,"fat_g":14,"notes_es":"","notes_en":""},
        {"slot":"afternoon_snack","name_es":"Manzana con mantequilla de maní","name_en":"Apple with peanut butter",
         "foods":[
           {"name_es":"Manzana","name_en":"Apple","quantity_g":150,"calories":78,"protein_g":0,"carbs_g":21,"fat_g":0},
           {"name_es":"Mantequilla de maní","name_en":"Peanut butter","quantity_g":20,"calories":118,"protein_g":5,"carbs_g":4,"fat_g":10}
         ],"calories":196,"protein_g":5,"carbs_g":25,"fat_g":10,"notes_es":"","notes_en":""},
        {"slot":"dinner","name_es":"Salmón con batata y brócoli","name_en":"Salmon with sweet potato and broccoli",
         "foods":[
           {"name_es":"Salmón","name_en":"Salmon","quantity_g":150,"calories":280,"protein_g":30,"carbs_g":0,"fat_g":17},
           {"name_es":"Batata cocida","name_en":"Cooked sweet potato","quantity_g":120,"calories":103,"protein_g":2,"carbs_g":24,"fat_g":0},
           {"name_es":"Brócoli al vapor","name_en":"Steamed broccoli","quantity_g":150,"calories":51,"protein_g":4,"carbs_g":10,"fat_g":0}
         ],"calories":434,"protein_g":36,"carbs_g":34,"fat_g":17,"notes_es":"","notes_en":""}
      ],
      "total_calories":1753,"total_protein_g":113,"total_carbs_g":178,"total_fat_g":67
    },
    {
      "day_number":2,"day_name":"Martes / Tuesday",
      "meals":[
        {"slot":"breakfast","name_es":"Tostadas con huevo revuelto y aguacate","name_en":"Toast with scrambled eggs and avocado",
         "foods":[
           {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":60,"calories":159,"protein_g":6,"carbs_g":30,"fat_g":2},
           {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":110,"calories":156,"protein_g":13,"carbs_g":1,"fat_g":11},
           {"name_es":"Aguacate","name_en":"Avocado","quantity_g":50,"calories":80,"protein_g":1,"carbs_g":4,"fat_g":7}
         ],"calories":395,"protein_g":20,"carbs_g":35,"fat_g":20,"notes_es":"","notes_en":""},
        {"slot":"mid_morning","name_es":"Frutos secos y fruta seca","name_en":"Mixed nuts and dried fruit",
         "foods":[
           {"name_es":"Almendras","name_en":"Almonds","quantity_g":25,"calories":145,"protein_g":5,"carbs_g":5,"fat_g":13},
           {"name_es":"Arándanos secos","name_en":"Dried cranberries","quantity_g":25,"calories":86,"protein_g":0,"carbs_g":22,"fat_g":0}
         ],"calories":231,"protein_g":5,"carbs_g":27,"fat_g":13,"notes_es":"","notes_en":""},
        {"slot":"lunch","name_es":"Lentejas con verduras","name_en":"Lentils with vegetables",
         "foods":[
           {"name_es":"Lentejas cocidas","name_en":"Cooked lentils","quantity_g":200,"calories":230,"protein_g":18,"carbs_g":40,"fat_g":1},
           {"name_es":"Zanahoria","name_en":"Carrot","quantity_g":80,"calories":33,"protein_g":1,"carbs_g":8,"fat_g":0},
           {"name_es":"Espinaca","name_en":"Spinach","quantity_g":60,"calories":14,"protein_g":2,"carbs_g":2,"fat_g":0},
           {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
         ],"calories":365,"protein_g":21,"carbs_g":50,"fat_g":11,"notes_es":"","notes_en":""},
        {"slot":"afternoon_snack","name_es":"Batido de proteína con leche","name_en":"Protein shake with milk",
         "foods":[
           {"name_es":"Proteína en polvo (whey)","name_en":"Whey protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},
           {"name_es":"Leche descremada","name_en":"Skim milk","quantity_g":200,"calories":70,"protein_g":7,"carbs_g":10,"fat_g":0}
         ],"calories":190,"protein_g":31,"carbs_g":13,"fat_g":2,"notes_es":"","notes_en":""},
        {"slot":"dinner","name_es":"Carne magra con quinoa y zucchini","name_en":"Lean beef with quinoa and zucchini",
         "foods":[
           {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":150,"calories":232,"protein_g":33,"carbs_g":0,"fat_g":10},
           {"name_es":"Quinoa cocida","name_en":"Cooked quinoa","quantity_g":120,"calories":147,"protein_g":5,"carbs_g":26,"fat_g":2},
           {"name_es":"Zucchini","name_en":"Zucchini","quantity_g":150,"calories":25,"protein_g":2,"carbs_g":5,"fat_g":0}
         ],"calories":404,"protein_g":40,"carbs_g":31,"fat_g":12,"notes_es":"","notes_en":""}
      ],
      "total_calories":1585,"total_protein_g":117,"total_carbs_g":156,"total_fat_g":58
    },
    {
      "day_number":3,"day_name":"Miércoles / Wednesday",
      "meals":[
        {"slot":"breakfast","name_es":"Smoothie bowl de frutas y proteína","name_en":"Fruit and protein smoothie bowl",
         "foods":[
           {"name_es":"Proteína en polvo (whey)","name_en":"Whey protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},
           {"name_es":"Banana congelada","name_en":"Frozen banana","quantity_g":100,"calories":89,"protein_g":1,"carbs_g":23,"fat_g":0},
           {"name_es":"Fresas","name_en":"Strawberries","quantity_g":100,"calories":32,"protein_g":1,"carbs_g":8,"fat_g":0},
           {"name_es":"Granola","name_en":"Granola","quantity_g":30,"calories":134,"protein_g":3,"carbs_g":20,"fat_g":5}
         ],"calories":375,"protein_g":29,"carbs_g":54,"fat_g":7,"notes_es":"","notes_en":""},
        {"slot":"mid_morning","name_es":"Queso cottage con pepino","name_en":"Cottage cheese with cucumber",
         "foods":[
           {"name_es":"Queso cottage","name_en":"Cottage cheese","quantity_g":150,"calories":128,"protein_g":17,"carbs_g":5,"fat_g":5},
           {"name_es":"Pepino","name_en":"Cucumber","quantity_g":100,"calories":16,"protein_g":1,"carbs_g":4,"fat_g":0}
         ],"calories":144,"protein_g":18,"carbs_g":9,"fat_g":5,"notes_es":"","notes_en":""},
        {"slot":"lunch","name_es":"Pasta de trigo integral con atún","name_en":"Whole wheat pasta with tuna",
         "foods":[
           {"name_es":"Pasta integral cocida","name_en":"Cooked whole wheat pasta","quantity_g":180,"calories":249,"protein_g":10,"carbs_g":48,"fat_g":2},
           {"name_es":"Atún en agua","name_en":"Canned tuna in water","quantity_g":100,"calories":116,"protein_g":26,"carbs_g":0,"fat_g":1},
           {"name_es":"Tomate","name_en":"Tomato","quantity_g":100,"calories":18,"protein_g":1,"carbs_g":4,"fat_g":0},
           {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
         ],"calories":454,"protein_g":37,"carbs_g":52,"fat_g":11,"notes_es":"","notes_en":""},
        {"slot":"afternoon_snack","name_es":"Naranja y almendras","name_en":"Orange and almonds",
         "foods":[
           {"name_es":"Naranja","name_en":"Orange","quantity_g":150,"calories":71,"protein_g":1,"carbs_g":18,"fat_g":0},
           {"name_es":"Almendras","name_en":"Almonds","quantity_g":20,"calories":116,"protein_g":4,"carbs_g":4,"fat_g":10}
         ],"calories":187,"protein_g":5,"carbs_g":22,"fat_g":10,"notes_es":"","notes_en":""},
        {"slot":"dinner","name_es":"Pollo al horno con papa y ensalada verde","name_en":"Baked chicken with potato and green salad",
         "foods":[
           {"name_es":"Pechuga de pollo al horno","name_en":"Baked chicken breast","quantity_g":150,"calories":165,"protein_g":31,"carbs_g":0,"fat_g":4},
           {"name_es":"Papa cocida","name_en":"Cooked potato","quantity_g":150,"calories":128,"protein_g":3,"carbs_g":29,"fat_g":0},
           {"name_es":"Lechuga romana","name_en":"Romaine lettuce","quantity_g":80,"calories":14,"protein_g":1,"carbs_g":3,"fat_g":0},
           {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
         ],"calories":378,"protein_g":35,"carbs_g":32,"fat_g":12,"notes_es":"","notes_en":""}
      ],
      "total_calories":1538,"total_protein_g":124,"total_carbs_g":169,"total_fat_g":45
    },
    {
      "day_number":4,"day_name":"Jueves / Thursday",
      "meals":[
        {"slot":"breakfast","name_es":"Panqueques de avena y banana","name_en":"Oat and banana pancakes",
         "foods":[
           {"name_es":"Avena","name_en":"Oats","quantity_g":60,"calories":222,"protein_g":8,"carbs_g":40,"fat_g":4},
           {"name_es":"Banana","name_en":"Banana","quantity_g":80,"calories":71,"protein_g":1,"carbs_g":18,"fat_g":0},
           {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":55,"calories":78,"protein_g":6,"carbs_g":0,"fat_g":5},
           {"name_es":"Miel","name_en":"Honey","quantity_g":15,"calories":46,"protein_g":0,"carbs_g":12,"fat_g":0}
         ],"calories":417,"protein_g":15,"carbs_g":70,"fat_g":9,"notes_es":"","notes_en":""},
        {"slot":"mid_morning","name_es":"Kéfir con semillas de chía","name_en":"Kefir with chia seeds",
         "foods":[
           {"name_es":"Kéfir","name_en":"Kefir","quantity_g":200,"calories":122,"protein_g":10,"carbs_g":10,"fat_g":4},
           {"name_es":"Semillas de chía","name_en":"Chia seeds","quantity_g":15,"calories":73,"protein_g":2,"carbs_g":6,"fat_g":5}
         ],"calories":195,"protein_g":12,"carbs_g":16,"fat_g":9,"notes_es":"","notes_en":""},
        {"slot":"lunch","name_es":"Arroz con frijoles negros y vegetales","name_en":"Rice with black beans and vegetables",
         "foods":[
           {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":150,"calories":195,"protein_g":4,"carbs_g":43,"fat_g":0},
           {"name_es":"Frijoles negros cocidos","name_en":"Cooked black beans","quantity_g":150,"calories":182,"protein_g":12,"carbs_g":33,"fat_g":1},
           {"name_es":"Pimiento rojo","name_en":"Red pepper","quantity_g":80,"calories":25,"protein_g":1,"carbs_g":6,"fat_g":0},
           {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
         ],"calories":473,"protein_g":17,"carbs_g":82,"fat_g":9,"notes_es":"","notes_en":""},
        {"slot":"afternoon_snack","name_es":"Yogur con granola","name_en":"Yogurt with granola",
         "foods":[
           {"name_es":"Yogur natural","name_en":"Natural yogurt","quantity_g":120,"calories":74,"protein_g":5,"carbs_g":8,"fat_g":2},
           {"name_es":"Granola","name_en":"Granola","quantity_g":25,"calories":112,"protein_g":2,"carbs_g":16,"fat_g":4}
         ],"calories":186,"protein_g":7,"carbs_g":24,"fat_g":6,"notes_es":"","notes_en":""},
        {"slot":"dinner","name_es":"Merluza al vapor con quinoa","name_en":"Steamed hake with quinoa",
         "foods":[
           {"name_es":"Merluza","name_en":"Hake","quantity_g":200,"calories":172,"protein_g":36,"carbs_g":0,"fat_g":2},
           {"name_es":"Quinoa cocida","name_en":"Cooked quinoa","quantity_g":120,"calories":147,"protein_g":5,"carbs_g":26,"fat_g":2},
           {"name_es":"Espárragos","name_en":"Asparagus","quantity_g":100,"calories":20,"protein_g":2,"carbs_g":4,"fat_g":0}
         ],"calories":339,"protein_g":43,"carbs_g":30,"fat_g":4,"notes_es":"","notes_en":""}
      ],
      "total_calories":1610,"total_protein_g":94,"total_carbs_g":222,"total_fat_g":37
    },
    {
      "day_number":5,"day_name":"Viernes / Friday",
      "meals":[
        {"slot":"breakfast","name_es":"Tostadas con salmón ahumado y queso","name_en":"Toast with smoked salmon and cheese",
         "foods":[
           {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":60,"calories":159,"protein_g":6,"carbs_g":30,"fat_g":2},
           {"name_es":"Salmón ahumado","name_en":"Smoked salmon","quantity_g":80,"calories":105,"protein_g":17,"carbs_g":0,"fat_g":4},
           {"name_es":"Queso crema light","name_en":"Light cream cheese","quantity_g":30,"calories":62,"protein_g":3,"carbs_g":2,"fat_g":5}
         ],"calories":326,"protein_g":26,"carbs_g":32,"fat_g":11,"notes_es":"","notes_en":""},
        {"slot":"mid_morning","name_es":"Batido verde con proteína","name_en":"Green smoothie with protein",
         "foods":[
           {"name_es":"Espinaca","name_en":"Spinach","quantity_g":50,"calories":12,"protein_g":1,"carbs_g":2,"fat_g":0},
           {"name_es":"Banana","name_en":"Banana","quantity_g":100,"calories":89,"protein_g":1,"carbs_g":23,"fat_g":0},
           {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":25,"calories":100,"protein_g":20,"carbs_g":2,"fat_g":1}
         ],"calories":201,"protein_g":22,"carbs_g":27,"fat_g":1,"notes_es":"","notes_en":""},
        {"slot":"lunch","name_es":"Bowl de pollo, arroz y vegetales asados","name_en":"Chicken, rice and roasted veggie bowl",
         "foods":[
           {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":150,"calories":165,"protein_g":31,"carbs_g":0,"fat_g":4},
           {"name_es":"Arroz integral cocido","name_en":"Cooked brown rice","quantity_g":150,"calories":165,"protein_g":4,"carbs_g":34,"fat_g":1},
           {"name_es":"Pimiento amarillo","name_en":"Yellow pepper","quantity_g":80,"calories":25,"protein_g":1,"carbs_g":6,"fat_g":0},
           {"name_es":"Cebolla asada","name_en":"Roasted onion","quantity_g":50,"calories":23,"protein_g":1,"carbs_g":5,"fat_g":0},
           {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
         ],"calories":449,"protein_g":37,"carbs_g":45,"fat_g":13,"notes_es":"","notes_en":""},
        {"slot":"afternoon_snack","name_es":"Hummus con palitos de zanahoria","name_en":"Hummus with carrot sticks",
         "foods":[
           {"name_es":"Hummus","name_en":"Hummus","quantity_g":60,"calories":140,"protein_g":5,"carbs_g":12,"fat_g":8},
           {"name_es":"Zanahoria","name_en":"Carrot","quantity_g":100,"calories":41,"protein_g":1,"carbs_g":10,"fat_g":0}
         ],"calories":181,"protein_g":6,"carbs_g":22,"fat_g":8,"notes_es":"","notes_en":""},
        {"slot":"dinner","name_es":"Tortilla española con ensalada","name_en":"Spanish omelette with salad",
         "foods":[
           {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":165,"calories":234,"protein_g":19,"carbs_g":1,"fat_g":16},
           {"name_es":"Papa","name_en":"Potato","quantity_g":150,"calories":128,"protein_g":3,"carbs_g":29,"fat_g":0},
           {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10},
           {"name_es":"Ensalada mixta","name_en":"Mixed salad","quantity_g":80,"calories":20,"protein_g":1,"carbs_g":4,"fat_g":0}
         ],"calories":470,"protein_g":23,"carbs_g":34,"fat_g":26,"notes_es":"","notes_en":""}
      ],
      "total_calories":1627,"total_protein_g":114,"total_carbs_g":160,"total_fat_g":59
    },
    {
      "day_number":6,"day_name":"Sábado / Saturday",
      "meals":[
        {"slot":"breakfast","name_es":"Bowl de granola, frutas y yogur","name_en":"Granola, fruit and yogurt bowl",
         "foods":[
           {"name_es":"Granola","name_en":"Granola","quantity_g":50,"calories":223,"protein_g":5,"carbs_g":33,"fat_g":9},
           {"name_es":"Yogur griego","name_en":"Greek yogurt","quantity_g":150,"calories":130,"protein_g":17,"carbs_g":6,"fat_g":4},
           {"name_es":"Fresas","name_en":"Strawberries","quantity_g":100,"calories":32,"protein_g":1,"carbs_g":8,"fat_g":0}
         ],"calories":385,"protein_g":23,"carbs_g":47,"fat_g":13,"notes_es":"","notes_en":""},
        {"slot":"mid_morning","name_es":"Kiwi y queso cottage","name_en":"Kiwi and cottage cheese",
         "foods":[
           {"name_es":"Kiwi","name_en":"Kiwi","quantity_g":100,"calories":61,"protein_g":1,"carbs_g":15,"fat_g":0},
           {"name_es":"Queso cottage","name_en":"Cottage cheese","quantity_g":100,"calories":85,"protein_g":11,"carbs_g":4,"fat_g":4}
         ],"calories":146,"protein_g":12,"carbs_g":19,"fat_g":4,"notes_es":"","notes_en":""},
        {"slot":"lunch","name_es":"Guiso de garbanzos con espinaca","name_en":"Chickpea and spinach stew",
         "foods":[
           {"name_es":"Garbanzos cocidos","name_en":"Cooked chickpeas","quantity_g":200,"calories":328,"protein_g":18,"carbs_g":55,"fat_g":5},
           {"name_es":"Espinaca","name_en":"Spinach","quantity_g":100,"calories":23,"protein_g":3,"carbs_g":4,"fat_g":0},
           {"name_es":"Tomate triturado","name_en":"Crushed tomato","quantity_g":100,"calories":25,"protein_g":1,"carbs_g":5,"fat_g":0},
           {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
         ],"calories":447,"protein_g":22,"carbs_g":64,"fat_g":13,"notes_es":"","notes_en":""},
        {"slot":"afternoon_snack","name_es":"Barrita de proteína","name_en":"Protein bar",
         "foods":[
           {"name_es":"Barrita de proteína","name_en":"Protein bar","quantity_g":60,"calories":220,"protein_g":20,"carbs_g":22,"fat_g":7}
         ],"calories":220,"protein_g":20,"carbs_g":22,"fat_g":7,"notes_es":"","notes_en":""},
        {"slot":"dinner","name_es":"Pavo con boniato y judías verdes","name_en":"Turkey with sweet potato and green beans",
         "foods":[
           {"name_es":"Pechuga de pavo","name_en":"Turkey breast","quantity_g":150,"calories":165,"protein_g":34,"carbs_g":0,"fat_g":2},
           {"name_es":"Boniato cocido","name_en":"Cooked sweet potato","quantity_g":120,"calories":103,"protein_g":2,"carbs_g":24,"fat_g":0},
           {"name_es":"Judías verdes","name_en":"Green beans","quantity_g":120,"calories":38,"protein_g":2,"carbs_g":8,"fat_g":0}
         ],"calories":306,"protein_g":38,"carbs_g":32,"fat_g":2,"notes_es":"","notes_en":""}
      ],
      "total_calories":1504,"total_protein_g":115,"total_carbs_g":184,"total_fat_g":39
    },
    {
      "day_number":7,"day_name":"Domingo / Sunday",
      "meals":[
        {"slot":"breakfast","name_es":"Huevos benedictinos ligeros con aguacate","name_en":"Light eggs Benedict with avocado",
         "foods":[
           {"name_es":"Huevo pochado","name_en":"Poached egg","quantity_g":110,"calories":156,"protein_g":13,"carbs_g":1,"fat_g":11},
           {"name_es":"Pan integral inglés","name_en":"Whole grain English muffin","quantity_g":70,"calories":185,"protein_g":7,"carbs_g":35,"fat_g":2},
           {"name_es":"Aguacate","name_en":"Avocado","quantity_g":60,"calories":96,"protein_g":1,"carbs_g":5,"fat_g":9}
         ],"calories":437,"protein_g":21,"carbs_g":41,"fat_g":22,"notes_es":"","notes_en":""},
        {"slot":"mid_morning","name_es":"Smoothie de frutos rojos","name_en":"Red berry smoothie",
         "foods":[
           {"name_es":"Frutos rojos mixtos","name_en":"Mixed berries","quantity_g":150,"calories":66,"protein_g":1,"carbs_g":16,"fat_g":0},
           {"name_es":"Leche de almendras","name_en":"Almond milk","quantity_g":200,"calories":30,"protein_g":1,"carbs_g":1,"fat_g":2},
           {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":25,"calories":100,"protein_g":20,"carbs_g":2,"fat_g":1}
         ],"calories":196,"protein_g":22,"carbs_g":19,"fat_g":3,"notes_es":"","notes_en":""},
        {"slot":"lunch","name_es":"Asado de pollo con ensalada mediterránea","name_en":"Roast chicken with Mediterranean salad",
         "foods":[
           {"name_es":"Pollo asado","name_en":"Roast chicken","quantity_g":200,"calories":296,"protein_g":44,"carbs_g":0,"fat_g":13},
           {"name_es":"Tomate cherry","name_en":"Cherry tomatoes","quantity_g":100,"calories":18,"protein_g":1,"carbs_g":4,"fat_g":0},
           {"name_es":"Aceitunas","name_en":"Olives","quantity_g":30,"calories":42,"protein_g":0,"carbs_g":1,"fat_g":4},
           {"name_es":"Pepino","name_en":"Cucumber","quantity_g":80,"calories":13,"protein_g":1,"carbs_g":3,"fat_g":0},
           {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
         ],"calories":440,"protein_g":46,"carbs_g":8,"fat_g":25,"notes_es":"","notes_en":""},
        {"slot":"afternoon_snack","name_es":"Puñado de nueces mixtas","name_en":"Handful of mixed nuts",
         "foods":[
           {"name_es":"Nueces mixtas","name_en":"Mixed nuts","quantity_g":30,"calories":185,"protein_g":5,"carbs_g":6,"fat_g":17}
         ],"calories":185,"protein_g":5,"carbs_g":6,"fat_g":17,"notes_es":"","notes_en":""},
        {"slot":"dinner","name_es":"Crema de verduras con pollo desmenuzado","name_en":"Vegetable cream soup with shredded chicken",
         "foods":[
           {"name_es":"Pechuga de pollo desmenuzada","name_en":"Shredded chicken breast","quantity_g":120,"calories":132,"protein_g":25,"carbs_g":0,"fat_g":3},
           {"name_es":"Calabaza","name_en":"Pumpkin","quantity_g":200,"calories":50,"protein_g":2,"carbs_g":12,"fat_g":0},
           {"name_es":"Papa","name_en":"Potato","quantity_g":100,"calories":85,"protein_g":2,"carbs_g":19,"fat_g":0},
           {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
         ],"calories":338,"protein_g":29,"carbs_g":31,"fat_g":11,"notes_es":"","notes_en":""}
      ],
      "total_calories":1596,"total_protein_g":123,"total_carbs_g":105,"total_fat_g":78
    }
  ]'::jsonb
),

-- ====================================================
-- 1800 kcal HIGH PROTEIN
-- ====================================================
(
  '1800 kcal - Alto en Proteína / High Protein',
  '1800 kcal - Alto en Proteína',
  '1800 kcal - High Protein',
  'Plan de 1800 kcal enfocado en alto aporte proteico. Ideal para masa muscular y fuerza.',
  '1800 kcal plan focused on high protein intake. Ideal for muscle building and strength training.',
  1800,
  'high_protein',
  'omnivore',
  175,
  155,
  50,
  28,
  ARRAY['1800kcal','alto_proteina','high_protein','fuerza','strength','musculos'],
  ARRAY['weightlifting','crossfit','strength','triathlon'],
  '[
    {"day_number":1,"day_name":"Lunes / Monday","meals":[
      {"slot":"breakfast","name_es":"Claras de huevo con avena y arándanos","name_en":"Egg whites with oats and blueberries",
       "foods":[
         {"name_es":"Claras de huevo","name_en":"Egg whites","quantity_g":180,"calories":93,"protein_g":20,"carbs_g":1,"fat_g":0},
         {"name_es":"Avena","name_en":"Oats","quantity_g":60,"calories":222,"protein_g":8,"carbs_g":40,"fat_g":4},
         {"name_es":"Arándanos","name_en":"Blueberries","quantity_g":80,"calories":46,"protein_g":1,"carbs_g":12,"fat_g":0}
       ],"calories":361,"protein_g":29,"carbs_g":53,"fat_g":4,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Batido de proteína con leche descremada","name_en":"Protein shake with skim milk",
       "foods":[
         {"name_es":"Proteína en polvo (whey)","name_en":"Whey protein powder","quantity_g":35,"calories":140,"protein_g":28,"carbs_g":3,"fat_g":2},
         {"name_es":"Leche descremada","name_en":"Skim milk","quantity_g":250,"calories":86,"protein_g":8,"carbs_g":12,"fat_g":0}
       ],"calories":226,"protein_g":36,"carbs_g":15,"fat_g":2,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Doble pechuga de pollo con arroz y brócoli","name_en":"Double chicken breast with rice and broccoli",
       "foods":[
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":250,"calories":275,"protein_g":52,"carbs_g":0,"fat_g":6},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":100,"calories":130,"protein_g":3,"carbs_g":29,"fat_g":0},
         {"name_es":"Brócoli al vapor","name_en":"Steamed broccoli","quantity_g":150,"calories":51,"protein_g":4,"carbs_g":10,"fat_g":0}
       ],"calories":456,"protein_g":59,"carbs_g":39,"fat_g":6,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Atún con arroz","name_en":"Tuna with rice",
       "foods":[
         {"name_es":"Atún en agua","name_en":"Canned tuna in water","quantity_g":120,"calories":139,"protein_g":31,"carbs_g":0,"fat_g":1},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":80,"calories":104,"protein_g":2,"carbs_g":23,"fat_g":0}
       ],"calories":243,"protein_g":33,"carbs_g":23,"fat_g":1,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Carne magra con batata y espinaca","name_en":"Lean beef with sweet potato and spinach",
       "foods":[
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":200,"calories":308,"protein_g":44,"carbs_g":0,"fat_g":14},
         {"name_es":"Batata cocida","name_en":"Cooked sweet potato","quantity_g":100,"calories":86,"protein_g":2,"carbs_g":20,"fat_g":0},
         {"name_es":"Espinaca salteada","name_en":"Sautéed spinach","quantity_g":100,"calories":23,"protein_g":3,"carbs_g":4,"fat_g":0}
       ],"calories":417,"protein_g":49,"carbs_g":24,"fat_g":14,"notes_es":"","notes_en":""}
    ],"total_calories":1703,"total_protein_g":206,"total_carbs_g":154,"total_fat_g":27},
    {"day_number":2,"day_name":"Martes / Tuesday","meals":[
      {"slot":"breakfast","name_es":"Omelette de claras con vegetales","name_en":"Egg white omelette with vegetables",
       "foods":[
         {"name_es":"Claras de huevo","name_en":"Egg whites","quantity_g":240,"calories":124,"protein_g":26,"carbs_g":1,"fat_g":0},
         {"name_es":"Pimiento rojo","name_en":"Red pepper","quantity_g":80,"calories":25,"protein_g":1,"carbs_g":6,"fat_g":0},
         {"name_es":"Champiñones","name_en":"Mushrooms","quantity_g":80,"calories":18,"protein_g":2,"carbs_g":3,"fat_g":0},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":40,"calories":106,"protein_g":4,"carbs_g":20,"fat_g":1}
       ],"calories":273,"protein_g":33,"carbs_g":30,"fat_g":1,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Queso cottage con piña","name_en":"Cottage cheese with pineapple",
       "foods":[
         {"name_es":"Queso cottage","name_en":"Cottage cheese","quantity_g":200,"calories":170,"protein_g":23,"carbs_g":7,"fat_g":7},
         {"name_es":"Piña fresca","name_en":"Fresh pineapple","quantity_g":80,"calories":42,"protein_g":0,"carbs_g":11,"fat_g":0}
       ],"calories":212,"protein_g":23,"carbs_g":18,"fat_g":7,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Salmón con quinoa y espárragos","name_en":"Salmon with quinoa and asparagus",
       "foods":[
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":200,"calories":374,"protein_g":40,"carbs_g":0,"fat_g":23},
         {"name_es":"Quinoa cocida","name_en":"Cooked quinoa","quantity_g":120,"calories":147,"protein_g":5,"carbs_g":26,"fat_g":2},
         {"name_es":"Espárragos","name_en":"Asparagus","quantity_g":100,"calories":20,"protein_g":2,"carbs_g":4,"fat_g":0}
       ],"calories":541,"protein_g":47,"carbs_g":30,"fat_g":25,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Yogur griego con frutos rojos","name_en":"Greek yogurt with berries",
       "foods":[
         {"name_es":"Yogur griego (0%)","name_en":"Greek yogurt (0%)","quantity_g":200,"calories":116,"protein_g":20,"carbs_g":7,"fat_g":0},
         {"name_es":"Frutos rojos","name_en":"Mixed berries","quantity_g":80,"calories":35,"protein_g":1,"carbs_g":9,"fat_g":0}
       ],"calories":151,"protein_g":21,"carbs_g":16,"fat_g":0,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pechuga de pavo con papa y judías","name_en":"Turkey breast with potato and beans",
       "foods":[
         {"name_es":"Pechuga de pavo","name_en":"Turkey breast","quantity_g":200,"calories":220,"protein_g":45,"carbs_g":0,"fat_g":3},
         {"name_es":"Papa cocida","name_en":"Cooked potato","quantity_g":120,"calories":102,"protein_g":2,"carbs_g":24,"fat_g":0},
         {"name_es":"Judías verdes","name_en":"Green beans","quantity_g":120,"calories":38,"protein_g":2,"carbs_g":8,"fat_g":0}
       ],"calories":360,"protein_g":49,"carbs_g":32,"fat_g":3,"notes_es":"","notes_en":""}
    ],"total_calories":1537,"total_protein_g":173,"total_carbs_g":126,"total_fat_g":36},
    {"day_number":3,"day_name":"Miércoles / Wednesday","meals":[
      {"slot":"breakfast","name_es":"Pudding de chía y proteína","name_en":"Chia and protein pudding",
       "foods":[
         {"name_es":"Semillas de chía","name_en":"Chia seeds","quantity_g":30,"calories":146,"protein_g":5,"carbs_g":12,"fat_g":9},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},
         {"name_es":"Leche descremada","name_en":"Skim milk","quantity_g":200,"calories":70,"protein_g":7,"carbs_g":10,"fat_g":0},
         {"name_es":"Banana","name_en":"Banana","quantity_g":80,"calories":71,"protein_g":1,"carbs_g":18,"fat_g":0}
       ],"calories":407,"protein_g":37,"carbs_g":43,"fat_g":11,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Tuna roll con aguacate","name_en":"Tuna roll with avocado",
       "foods":[
         {"name_es":"Atún en agua","name_en":"Canned tuna in water","quantity_g":100,"calories":116,"protein_g":26,"carbs_g":0,"fat_g":1},
         {"name_es":"Aguacate","name_en":"Avocado","quantity_g":40,"calories":64,"protein_g":1,"carbs_g":3,"fat_g":6},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":40,"calories":106,"protein_g":4,"carbs_g":20,"fat_g":1}
       ],"calories":286,"protein_g":31,"carbs_g":23,"fat_g":8,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Bowl proteico de pollo y vegetales","name_en":"High protein chicken and veggie bowl",
       "foods":[
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":200,"calories":220,"protein_g":41,"carbs_g":0,"fat_g":5},
         {"name_es":"Arroz integral cocido","name_en":"Cooked brown rice","quantity_g":100,"calories":110,"protein_g":3,"carbs_g":23,"fat_g":1},
         {"name_es":"Pepino","name_en":"Cucumber","quantity_g":100,"calories":16,"protein_g":1,"carbs_g":4,"fat_g":0},
         {"name_es":"Tomate","name_en":"Tomato","quantity_g":100,"calories":18,"protein_g":1,"carbs_g":4,"fat_g":0}
       ],"calories":364,"protein_g":46,"carbs_g":31,"fat_g":6,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Batido de proteína post-entrenamiento","name_en":"Post-workout protein shake",
       "foods":[
         {"name_es":"Proteína en polvo (whey)","name_en":"Whey protein powder","quantity_g":35,"calories":140,"protein_g":28,"carbs_g":3,"fat_g":2},
         {"name_es":"Agua","name_en":"Water","quantity_g":300,"calories":0,"protein_g":0,"carbs_g":0,"fat_g":0}
       ],"calories":140,"protein_g":28,"carbs_g":3,"fat_g":2,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Carne magra con vegetales asados","name_en":"Lean meat with roasted vegetables",
       "foods":[
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":180,"calories":277,"protein_g":40,"carbs_g":0,"fat_g":12},
         {"name_es":"Calabacín","name_en":"Zucchini","quantity_g":150,"calories":25,"protein_g":2,"carbs_g":5,"fat_g":0},
         {"name_es":"Berenjena","name_en":"Eggplant","quantity_g":100,"calories":25,"protein_g":1,"carbs_g":6,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":398,"protein_g":43,"carbs_g":11,"fat_g":20,"notes_es":"","notes_en":""}
    ],"total_calories":1595,"total_protein_g":185,"total_carbs_g":111,"total_fat_g":47},
    {"day_number":4,"day_name":"Jueves / Thursday","meals":[
      {"slot":"breakfast","name_es":"Panqueques proteicos de banana","name_en":"Protein banana pancakes",
       "foods":[
         {"name_es":"Claras de huevo","name_en":"Egg whites","quantity_g":180,"calories":93,"protein_g":20,"carbs_g":1,"fat_g":0},
         {"name_es":"Avena","name_en":"Oats","quantity_g":50,"calories":185,"protein_g":6,"carbs_g":33,"fat_g":3},
         {"name_es":"Banana","name_en":"Banana","quantity_g":80,"calories":71,"protein_g":1,"carbs_g":18,"fat_g":0}
       ],"calories":349,"protein_g":27,"carbs_g":52,"fat_g":3,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Yogur griego con nueces","name_en":"Greek yogurt with walnuts",
       "foods":[
         {"name_es":"Yogur griego (0%)","name_en":"Greek yogurt (0%)","quantity_g":200,"calories":116,"protein_g":20,"carbs_g":7,"fat_g":0},
         {"name_es":"Nueces","name_en":"Walnuts","quantity_g":20,"calories":131,"protein_g":3,"carbs_g":3,"fat_g":13}
       ],"calories":247,"protein_g":23,"carbs_g":10,"fat_g":13,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Salmón con lentejas y espinaca","name_en":"Salmon with lentils and spinach",
       "foods":[
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":180,"calories":336,"protein_g":36,"carbs_g":0,"fat_g":21},
         {"name_es":"Lentejas cocidas","name_en":"Cooked lentils","quantity_g":150,"calories":173,"protein_g":13,"carbs_g":30,"fat_g":1},
         {"name_es":"Espinaca","name_en":"Spinach","quantity_g":80,"calories":18,"protein_g":2,"carbs_g":3,"fat_g":0}
       ],"calories":527,"protein_g":51,"carbs_g":33,"fat_g":22,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Queso cottage con pimiento","name_en":"Cottage cheese with bell pepper",
       "foods":[
         {"name_es":"Queso cottage","name_en":"Cottage cheese","quantity_g":150,"calories":128,"protein_g":17,"carbs_g":5,"fat_g":5},
         {"name_es":"Pimiento","name_en":"Bell pepper","quantity_g":100,"calories":31,"protein_g":1,"carbs_g":7,"fat_g":0}
       ],"calories":159,"protein_g":18,"carbs_g":12,"fat_g":5,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pollo grillado con quinoa","name_en":"Grilled chicken with quinoa",
       "foods":[
         {"name_es":"Pechuga de pollo grillada","name_en":"Grilled chicken breast","quantity_g":200,"calories":220,"protein_g":41,"carbs_g":0,"fat_g":5},
         {"name_es":"Quinoa cocida","name_en":"Cooked quinoa","quantity_g":100,"calories":122,"protein_g":4,"carbs_g":21,"fat_g":2}
       ],"calories":342,"protein_g":45,"carbs_g":21,"fat_g":7,"notes_es":"","notes_en":""}
    ],"total_calories":1624,"total_protein_g":164,"total_carbs_g":128,"total_fat_g":50},
    {"day_number":5,"day_name":"Viernes / Friday","meals":[
      {"slot":"breakfast","name_es":"Tazón de proteína con avena y frutas","name_en":"Protein bowl with oats and fruits",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},
         {"name_es":"Avena","name_en":"Oats","quantity_g":60,"calories":222,"protein_g":8,"carbs_g":40,"fat_g":4},
         {"name_es":"Mango","name_en":"Mango","quantity_g":80,"calories":51,"protein_g":1,"carbs_g":13,"fat_g":0}
       ],"calories":393,"protein_g":33,"carbs_g":56,"fat_g":6,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Huevo duro con palitos de apio","name_en":"Hard boiled eggs with celery sticks",
       "foods":[
         {"name_es":"Huevo duro","name_en":"Hard boiled egg","quantity_g":110,"calories":156,"protein_g":13,"carbs_g":1,"fat_g":11},
         {"name_es":"Apio","name_en":"Celery","quantity_g":80,"calories":13,"protein_g":1,"carbs_g":3,"fat_g":0}
       ],"calories":169,"protein_g":14,"carbs_g":4,"fat_g":11,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Pechuga de pavo con pasta integral","name_en":"Turkey breast with whole wheat pasta",
       "foods":[
         {"name_es":"Pechuga de pavo","name_en":"Turkey breast","quantity_g":200,"calories":220,"protein_g":45,"carbs_g":0,"fat_g":3},
         {"name_es":"Pasta integral cocida","name_en":"Cooked whole wheat pasta","quantity_g":150,"calories":207,"protein_g":8,"carbs_g":40,"fat_g":2},
         {"name_es":"Salsa de tomate natural","name_en":"Natural tomato sauce","quantity_g":80,"calories":29,"protein_g":1,"carbs_g":7,"fat_g":0}
       ],"calories":456,"protein_g":54,"carbs_g":47,"fat_g":5,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Batido de proteína","name_en":"Protein shake",
       "foods":[
         {"name_es":"Proteína en polvo (whey)","name_en":"Whey protein powder","quantity_g":35,"calories":140,"protein_g":28,"carbs_g":3,"fat_g":2}
       ],"calories":140,"protein_g":28,"carbs_g":3,"fat_g":2,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Merluza con arroz y zucchini","name_en":"Hake with rice and zucchini",
       "foods":[
         {"name_es":"Merluza","name_en":"Hake","quantity_g":250,"calories":215,"protein_g":45,"carbs_g":0,"fat_g":3},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":100,"calories":130,"protein_g":3,"carbs_g":29,"fat_g":0},
         {"name_es":"Zucchini","name_en":"Zucchini","quantity_g":150,"calories":25,"protein_g":2,"carbs_g":5,"fat_g":0}
       ],"calories":370,"protein_g":50,"carbs_g":34,"fat_g":3,"notes_es":"","notes_en":""}
    ],"total_calories":1528,"total_protein_g":179,"total_carbs_g":144,"total_fat_g":27},
    {"day_number":6,"day_name":"Sábado / Saturday","meals":[
      {"slot":"breakfast","name_es":"Tortilla de claras con espinaca y queso","name_en":"Egg white omelette with spinach and cheese",
       "foods":[
         {"name_es":"Claras de huevo","name_en":"Egg whites","quantity_g":240,"calories":124,"protein_g":26,"carbs_g":1,"fat_g":0},
         {"name_es":"Espinaca","name_en":"Spinach","quantity_g":80,"calories":18,"protein_g":2,"carbs_g":3,"fat_g":0},
         {"name_es":"Queso fresco","name_en":"Fresh cheese","quantity_g":40,"calories":88,"protein_g":6,"carbs_g":1,"fat_g":7},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":40,"calories":106,"protein_g":4,"carbs_g":20,"fat_g":1}
       ],"calories":336,"protein_g":38,"carbs_g":25,"fat_g":8,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Yogur griego con almendras","name_en":"Greek yogurt with almonds",
       "foods":[
         {"name_es":"Yogur griego","name_en":"Greek yogurt","quantity_g":200,"calories":174,"protein_g":23,"carbs_g":8,"fat_g":5},
         {"name_es":"Almendras","name_en":"Almonds","quantity_g":20,"calories":116,"protein_g":4,"carbs_g":4,"fat_g":10}
       ],"calories":290,"protein_g":27,"carbs_g":12,"fat_g":15,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Carne magra con papa hervida","name_en":"Lean beef with boiled potato",
       "foods":[
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":200,"calories":308,"protein_g":44,"carbs_g":0,"fat_g":14},
         {"name_es":"Papa hervida","name_en":"Boiled potato","quantity_g":150,"calories":128,"protein_g":3,"carbs_g":29,"fat_g":0},
         {"name_es":"Tomate","name_en":"Tomato","quantity_g":100,"calories":18,"protein_g":1,"carbs_g":4,"fat_g":0}
       ],"calories":454,"protein_g":48,"carbs_g":33,"fat_g":14,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Cottage cheese con pepino","name_en":"Cottage cheese with cucumber",
       "foods":[
         {"name_es":"Queso cottage","name_en":"Cottage cheese","quantity_g":150,"calories":128,"protein_g":17,"carbs_g":5,"fat_g":5},
         {"name_es":"Pepino","name_en":"Cucumber","quantity_g":100,"calories":16,"protein_g":1,"carbs_g":4,"fat_g":0}
       ],"calories":144,"protein_g":18,"carbs_g":9,"fat_g":5,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pollo al horno con quinoa y brócoli","name_en":"Baked chicken with quinoa and broccoli",
       "foods":[
         {"name_es":"Pechuga de pollo al horno","name_en":"Baked chicken breast","quantity_g":200,"calories":220,"protein_g":41,"carbs_g":0,"fat_g":5},
         {"name_es":"Quinoa cocida","name_en":"Cooked quinoa","quantity_g":100,"calories":122,"protein_g":4,"carbs_g":21,"fat_g":2},
         {"name_es":"Brócoli al vapor","name_en":"Steamed broccoli","quantity_g":150,"calories":51,"protein_g":4,"carbs_g":10,"fat_g":0}
       ],"calories":393,"protein_g":49,"carbs_g":31,"fat_g":7,"notes_es":"","notes_en":""}
    ],"total_calories":1617,"total_protein_g":180,"total_carbs_g":110,"total_fat_g":49},
    {"day_number":7,"day_name":"Domingo / Sunday","meals":[
      {"slot":"breakfast","name_es":"Revuelto de huevos con salmón y aguacate","name_en":"Scrambled eggs with salmon and avocado",
       "foods":[
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":165,"calories":234,"protein_g":19,"carbs_g":1,"fat_g":16},
         {"name_es":"Salmón ahumado","name_en":"Smoked salmon","quantity_g":80,"calories":105,"protein_g":17,"carbs_g":0,"fat_g":4},
         {"name_es":"Aguacate","name_en":"Avocado","quantity_g":50,"calories":80,"protein_g":1,"carbs_g":4,"fat_g":7}
       ],"calories":419,"protein_g":37,"carbs_g":5,"fat_g":27,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Batido de proteína con avena","name_en":"Protein oat shake",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},
         {"name_es":"Avena","name_en":"Oats","quantity_g":30,"calories":111,"protein_g":4,"carbs_g":20,"fat_g":2},
         {"name_es":"Leche descremada","name_en":"Skim milk","quantity_g":200,"calories":70,"protein_g":7,"carbs_g":10,"fat_g":0}
       ],"calories":301,"protein_g":35,"carbs_g":33,"fat_g":4,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Pollo asado con ensalada y garbanzos","name_en":"Roast chicken with salad and chickpeas",
       "foods":[
         {"name_es":"Pollo asado","name_en":"Roast chicken","quantity_g":200,"calories":296,"protein_g":44,"carbs_g":0,"fat_g":13},
         {"name_es":"Garbanzos cocidos","name_en":"Cooked chickpeas","quantity_g":100,"calories":164,"protein_g":9,"carbs_g":27,"fat_g":3},
         {"name_es":"Lechuga","name_en":"Lettuce","quantity_g":80,"calories":12,"protein_g":1,"carbs_g":2,"fat_g":0}
       ],"calories":472,"protein_g":54,"carbs_g":29,"fat_g":16,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Requesón con frutos rojos","name_en":"Ricotta with berries",
       "foods":[
         {"name_es":"Requesón","name_en":"Ricotta","quantity_g":100,"calories":174,"protein_g":11,"carbs_g":3,"fat_g":13},
         {"name_es":"Frutos rojos","name_en":"Mixed berries","quantity_g":80,"calories":35,"protein_g":1,"carbs_g":9,"fat_g":0}
       ],"calories":209,"protein_g":12,"carbs_g":12,"fat_g":13,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Merluza al horno con ensalada","name_en":"Baked hake with salad",
       "foods":[
         {"name_es":"Merluza","name_en":"Hake","quantity_g":250,"calories":215,"protein_g":45,"carbs_g":0,"fat_g":3},
         {"name_es":"Ensalada mixta","name_en":"Mixed salad","quantity_g":150,"calories":38,"protein_g":3,"carbs_g":7,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":324,"protein_g":48,"carbs_g":7,"fat_g":11,"notes_es":"","notes_en":""}
    ],"total_calories":1725,"total_protein_g":186,"total_carbs_g":86,"total_fat_g":71}
  ]'::jsonb
),

-- ====================================================
-- 2000 kcal BALANCED
-- ====================================================
(
  '2000 kcal - Balanceado / Balanced',
  '2000 kcal - Balanceado',
  '2000 kcal - Balanced',
  'Plan semanal de 2000 kcal con distribución equilibrada de macros. Perfecto para deportistas recreativos.',
  'Weekly 2000 kcal plan with balanced macros. Perfect for recreational athletes.',
  2000,
  'balanced',
  'omnivore',
  155,
  225,
  60,
  33,
  ARRAY['2000kcal','balanceado','balanced','mantenimiento','fitness'],
  ARRAY['running','cycling','swimming','general_fitness','triathlon'],
  '[
    {"day_number":1,"day_name":"Lunes / Monday","meals":[
      {"slot":"breakfast","name_es":"Avena con proteína, banana y mantequilla de maní","name_en":"Protein oats with banana and peanut butter",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":70,"calories":259,"protein_g":9,"carbs_g":47,"fat_g":5},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":25,"calories":100,"protein_g":20,"carbs_g":2,"fat_g":1},
         {"name_es":"Banana","name_en":"Banana","quantity_g":100,"calories":89,"protein_g":1,"carbs_g":23,"fat_g":0},
         {"name_es":"Mantequilla de maní","name_en":"Peanut butter","quantity_g":15,"calories":89,"protein_g":4,"carbs_g":3,"fat_g":7}
       ],"calories":537,"protein_g":34,"carbs_g":75,"fat_g":13,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Yogur griego con nueces y miel","name_en":"Greek yogurt with walnuts and honey",
       "foods":[
         {"name_es":"Yogur griego","name_en":"Greek yogurt","quantity_g":150,"calories":130,"protein_g":17,"carbs_g":6,"fat_g":4},
         {"name_es":"Nueces","name_en":"Walnuts","quantity_g":20,"calories":131,"protein_g":3,"carbs_g":3,"fat_g":13},
         {"name_es":"Miel","name_en":"Honey","quantity_g":10,"calories":30,"protein_g":0,"carbs_g":8,"fat_g":0}
       ],"calories":291,"protein_g":20,"carbs_g":17,"fat_g":17,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Pollo con arroz integral y vegetales","name_en":"Chicken with brown rice and vegetables",
       "foods":[
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":180,"calories":198,"protein_g":37,"carbs_g":0,"fat_g":4},
         {"name_es":"Arroz integral cocido","name_en":"Cooked brown rice","quantity_g":180,"calories":198,"protein_g":5,"carbs_g":41,"fat_g":1},
         {"name_es":"Brócoli al vapor","name_en":"Steamed broccoli","quantity_g":150,"calories":51,"protein_g":4,"carbs_g":10,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":535,"protein_g":46,"carbs_g":51,"fat_g":15,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Manzana con almendras","name_en":"Apple with almonds",
       "foods":[
         {"name_es":"Manzana","name_en":"Apple","quantity_g":180,"calories":94,"protein_g":0,"carbs_g":25,"fat_g":0},
         {"name_es":"Almendras","name_en":"Almonds","quantity_g":25,"calories":145,"protein_g":5,"carbs_g":5,"fat_g":13}
       ],"calories":239,"protein_g":5,"carbs_g":30,"fat_g":13,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Salmón con batata y ensalada verde","name_en":"Salmon with sweet potato and green salad",
       "foods":[
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":180,"calories":336,"protein_g":36,"carbs_g":0,"fat_g":21},
         {"name_es":"Batata cocida","name_en":"Cooked sweet potato","quantity_g":150,"calories":129,"protein_g":3,"carbs_g":30,"fat_g":0},
         {"name_es":"Ensalada verde","name_en":"Green salad","quantity_g":100,"calories":20,"protein_g":1,"carbs_g":4,"fat_g":0}
       ],"calories":485,"protein_g":40,"carbs_g":34,"fat_g":21,"notes_es":"","notes_en":""}
    ],"total_calories":2087,"total_protein_g":145,"total_carbs_g":207,"total_fat_g":79},
    {"day_number":2,"day_name":"Martes / Tuesday","meals":[
      {"slot":"breakfast","name_es":"Tostadas con huevo y aguacate","name_en":"Toast with eggs and avocado",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":80,"calories":212,"protein_g":8,"carbs_g":40,"fat_g":3},
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":110,"calories":156,"protein_g":13,"carbs_g":1,"fat_g":11},
         {"name_es":"Aguacate","name_en":"Avocado","quantity_g":70,"calories":112,"protein_g":1,"carbs_g":6,"fat_g":10}
       ],"calories":480,"protein_g":22,"carbs_g":47,"fat_g":24,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Batido de frutas con proteína","name_en":"Fruit protein shake",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},
         {"name_es":"Banana","name_en":"Banana","quantity_g":100,"calories":89,"protein_g":1,"carbs_g":23,"fat_g":0},
         {"name_es":"Leche descremada","name_en":"Skim milk","quantity_g":200,"calories":70,"protein_g":7,"carbs_g":10,"fat_g":0}
       ],"calories":279,"protein_g":32,"carbs_g":36,"fat_g":2,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Bowl de atún con arroz y vegetales","name_en":"Tuna bowl with rice and vegetables",
       "foods":[
         {"name_es":"Atún en agua","name_en":"Canned tuna in water","quantity_g":150,"calories":174,"protein_g":39,"carbs_g":0,"fat_g":1},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":180,"calories":234,"protein_g":5,"carbs_g":52,"fat_g":0},
         {"name_es":"Tomate","name_en":"Tomato","quantity_g":100,"calories":18,"protein_g":1,"carbs_g":4,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":514,"protein_g":45,"carbs_g":56,"fat_g":11,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Queso cottage con fruta","name_en":"Cottage cheese with fruit",
       "foods":[
         {"name_es":"Queso cottage","name_en":"Cottage cheese","quantity_g":150,"calories":128,"protein_g":17,"carbs_g":5,"fat_g":5},
         {"name_es":"Naranja","name_en":"Orange","quantity_g":150,"calories":71,"protein_g":1,"carbs_g":18,"fat_g":0}
       ],"calories":199,"protein_g":18,"carbs_g":23,"fat_g":5,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Carne magra con quinoa y espárragos","name_en":"Lean beef with quinoa and asparagus",
       "foods":[
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":180,"calories":277,"protein_g":40,"carbs_g":0,"fat_g":12},
         {"name_es":"Quinoa cocida","name_en":"Cooked quinoa","quantity_g":150,"calories":183,"protein_g":7,"carbs_g":33,"fat_g":3},
         {"name_es":"Espárragos","name_en":"Asparagus","quantity_g":120,"calories":24,"protein_g":3,"carbs_g":5,"fat_g":0}
       ],"calories":484,"protein_g":50,"carbs_g":38,"fat_g":15,"notes_es":"","notes_en":""}
    ],"total_calories":1956,"total_protein_g":167,"total_carbs_g":200,"total_fat_g":57},
    {"day_number":3,"day_name":"Miércoles / Wednesday","meals":[
      {"slot":"breakfast","name_es":"Smoothie bowl tropical","name_en":"Tropical smoothie bowl",
       "foods":[
         {"name_es":"Mango congelado","name_en":"Frozen mango","quantity_g":150,"calories":95,"protein_g":1,"carbs_g":25,"fat_g":0},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},
         {"name_es":"Leche de coco (ligera)","name_en":"Light coconut milk","quantity_g":100,"calories":52,"protein_g":0,"carbs_g":5,"fat_g":3},
         {"name_es":"Granola","name_en":"Granola","quantity_g":40,"calories":179,"protein_g":4,"carbs_g":27,"fat_g":7},
         {"name_es":"Kiwi","name_en":"Kiwi","quantity_g":80,"calories":49,"protein_g":1,"carbs_g":12,"fat_g":0}
       ],"calories":495,"protein_g":30,"carbs_g":72,"fat_g":12,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Requesón con arándanos","name_en":"Ricotta with blueberries",
       "foods":[
         {"name_es":"Requesón","name_en":"Ricotta","quantity_g":100,"calories":174,"protein_g":11,"carbs_g":3,"fat_g":13},
         {"name_es":"Arándanos","name_en":"Blueberries","quantity_g":80,"calories":46,"protein_g":1,"carbs_g":12,"fat_g":0}
       ],"calories":220,"protein_g":12,"carbs_g":15,"fat_g":13,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Lentejas con arroz y vegetales mixtos","name_en":"Lentils with rice and mixed vegetables",
       "foods":[
         {"name_es":"Lentejas cocidas","name_en":"Cooked lentils","quantity_g":200,"calories":230,"protein_g":18,"carbs_g":40,"fat_g":1},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":120,"calories":156,"protein_g":3,"carbs_g":34,"fat_g":0},
         {"name_es":"Zanahoria","name_en":"Carrot","quantity_g":100,"calories":41,"protein_g":1,"carbs_g":10,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":515,"protein_g":22,"carbs_g":84,"fat_g":11,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Banana con mantequilla de almendras","name_en":"Banana with almond butter",
       "foods":[
         {"name_es":"Banana","name_en":"Banana","quantity_g":120,"calories":107,"protein_g":1,"carbs_g":27,"fat_g":0},
         {"name_es":"Mantequilla de almendras","name_en":"Almond butter","quantity_g":20,"calories":121,"protein_g":4,"carbs_g":4,"fat_g":11}
       ],"calories":228,"protein_g":5,"carbs_g":31,"fat_g":11,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pollo a la plancha con papa y ensalada","name_en":"Grilled chicken with potato and salad",
       "foods":[
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":180,"calories":198,"protein_g":37,"carbs_g":0,"fat_g":4},
         {"name_es":"Papa cocida","name_en":"Cooked potato","quantity_g":180,"calories":153,"protein_g":3,"carbs_g":35,"fat_g":0},
         {"name_es":"Ensalada mixta","name_en":"Mixed salad","quantity_g":100,"calories":25,"protein_g":2,"carbs_g":4,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":447,"protein_g":42,"carbs_g":39,"fat_g":12,"notes_es":"","notes_en":""}
    ],"total_calories":1905,"total_protein_g":111,"total_carbs_g":241,"total_fat_g":59},
    {"day_number":4,"day_name":"Jueves / Thursday","meals":[
      {"slot":"breakfast","name_es":"Panqueques de avena con frutas y sirope","name_en":"Oat pancakes with fruits and syrup",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":80,"calories":296,"protein_g":10,"carbs_g":53,"fat_g":5},
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":55,"calories":78,"protein_g":6,"carbs_g":0,"fat_g":5},
         {"name_es":"Banana","name_en":"Banana","quantity_g":100,"calories":89,"protein_g":1,"carbs_g":23,"fat_g":0},
         {"name_es":"Sirope de arce","name_en":"Maple syrup","quantity_g":15,"calories":52,"protein_g":0,"carbs_g":13,"fat_g":0}
       ],"calories":515,"protein_g":17,"carbs_g":89,"fat_g":10,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Yogur con semillas y kiwi","name_en":"Yogurt with seeds and kiwi",
       "foods":[
         {"name_es":"Yogur natural","name_en":"Natural yogurt","quantity_g":150,"calories":92,"protein_g":6,"carbs_g":10,"fat_g":3},
         {"name_es":"Semillas de girasol","name_en":"Sunflower seeds","quantity_g":15,"calories":88,"protein_g":3,"carbs_g":3,"fat_g":8},
         {"name_es":"Kiwi","name_en":"Kiwi","quantity_g":100,"calories":61,"protein_g":1,"carbs_g":15,"fat_g":0}
       ],"calories":241,"protein_g":10,"carbs_g":28,"fat_g":11,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Pasta integral con pollo y pesto","name_en":"Whole wheat pasta with chicken and pesto",
       "foods":[
         {"name_es":"Pasta integral cocida","name_en":"Cooked whole wheat pasta","quantity_g":200,"calories":276,"protein_g":12,"carbs_g":55,"fat_g":2},
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":150,"calories":165,"protein_g":31,"carbs_g":0,"fat_g":4},
         {"name_es":"Pesto","name_en":"Pesto","quantity_g":20,"calories":88,"protein_g":2,"carbs_g":2,"fat_g":8}
       ],"calories":529,"protein_g":45,"carbs_g":57,"fat_g":14,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Barrita de proteína y fruta","name_en":"Protein bar and fruit",
       "foods":[
         {"name_es":"Barrita proteínica","name_en":"Protein bar","quantity_g":45,"calories":165,"protein_g":15,"carbs_g":17,"fat_g":5},
         {"name_es":"Pera","name_en":"Pear","quantity_g":150,"calories":85,"protein_g":1,"carbs_g":23,"fat_g":0}
       ],"calories":250,"protein_g":16,"carbs_g":40,"fat_g":5,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Salmón al horno con arroz y zucchini","name_en":"Baked salmon with rice and zucchini",
       "foods":[
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":180,"calories":336,"protein_g":36,"carbs_g":0,"fat_g":21},
         {"name_es":"Arroz basmati cocido","name_en":"Cooked basmati rice","quantity_g":130,"calories":169,"protein_g":4,"carbs_g":37,"fat_g":0},
         {"name_es":"Zucchini","name_en":"Zucchini","quantity_g":150,"calories":25,"protein_g":2,"carbs_g":5,"fat_g":0}
       ],"calories":530,"protein_g":42,"carbs_g":42,"fat_g":21,"notes_es":"","notes_en":""}
    ],"total_calories":2065,"total_protein_g":130,"total_carbs_g":256,"total_fat_g":61},
    {"day_number":5,"day_name":"Viernes / Friday","meals":[
      {"slot":"breakfast","name_es":"Bowl de frutas con avena y nueces","name_en":"Fruit bowl with oats and nuts",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":70,"calories":259,"protein_g":9,"carbs_g":47,"fat_g":5},
         {"name_es":"Fresas","name_en":"Strawberries","quantity_g":100,"calories":32,"protein_g":1,"carbs_g":8,"fat_g":0},
         {"name_es":"Mango","name_en":"Mango","quantity_g":100,"calories":60,"protein_g":1,"carbs_g":15,"fat_g":0},
         {"name_es":"Nueces","name_en":"Walnuts","quantity_g":20,"calories":131,"protein_g":3,"carbs_g":3,"fat_g":13}
       ],"calories":482,"protein_g":14,"carbs_g":73,"fat_g":18,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Atún con tostadas","name_en":"Tuna with toast",
       "foods":[
         {"name_es":"Atún en agua","name_en":"Canned tuna in water","quantity_g":100,"calories":116,"protein_g":26,"carbs_g":0,"fat_g":1},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":40,"calories":106,"protein_g":4,"carbs_g":20,"fat_g":1}
       ],"calories":222,"protein_g":30,"carbs_g":20,"fat_g":2,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Arroz con vegetales y huevo frito","name_en":"Rice with vegetables and fried egg",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":200,"calories":260,"protein_g":5,"carbs_g":57,"fat_g":0},
         {"name_es":"Huevo frito","name_en":"Fried egg","quantity_g":55,"calories":90,"protein_g":6,"carbs_g":0,"fat_g":7},
         {"name_es":"Pimiento mixto","name_en":"Mixed bell pepper","quantity_g":120,"calories":37,"protein_g":1,"carbs_g":9,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":475,"protein_g":12,"carbs_g":66,"fat_g":17,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Yogur griego con granola","name_en":"Greek yogurt with granola",
       "foods":[
         {"name_es":"Yogur griego","name_en":"Greek yogurt","quantity_g":150,"calories":130,"protein_g":17,"carbs_g":6,"fat_g":4},
         {"name_es":"Granola","name_en":"Granola","quantity_g":30,"calories":134,"protein_g":3,"carbs_g":20,"fat_g":5}
       ],"calories":264,"protein_g":20,"carbs_g":26,"fat_g":9,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pavo con batata y judías verdes","name_en":"Turkey with sweet potato and green beans",
       "foods":[
         {"name_es":"Pechuga de pavo","name_en":"Turkey breast","quantity_g":180,"calories":198,"protein_g":41,"carbs_g":0,"fat_g":2},
         {"name_es":"Batata cocida","name_en":"Cooked sweet potato","quantity_g":150,"calories":129,"protein_g":3,"carbs_g":30,"fat_g":0},
         {"name_es":"Judías verdes","name_en":"Green beans","quantity_g":150,"calories":47,"protein_g":3,"carbs_g":11,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":445,"protein_g":47,"carbs_g":41,"fat_g":10,"notes_es":"","notes_en":""}
    ],"total_calories":1888,"total_protein_g":123,"total_carbs_g":226,"total_fat_g":56},
    {"day_number":6,"day_name":"Sábado / Saturday","meals":[
      {"slot":"breakfast","name_es":"French toast integral con frutas","name_en":"Whole grain French toast with fruits",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":80,"calories":212,"protein_g":8,"carbs_g":40,"fat_g":3},
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":110,"calories":156,"protein_g":13,"carbs_g":1,"fat_g":11},
         {"name_es":"Fresas","name_en":"Strawberries","quantity_g":120,"calories":38,"protein_g":1,"carbs_g":9,"fat_g":0},
         {"name_es":"Miel","name_en":"Honey","quantity_g":15,"calories":46,"protein_g":0,"carbs_g":12,"fat_g":0}
       ],"calories":452,"protein_g":22,"carbs_g":62,"fat_g":14,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Batido verde con espinaca y proteína","name_en":"Green smoothie with spinach and protein",
       "foods":[
         {"name_es":"Espinaca","name_en":"Spinach","quantity_g":60,"calories":14,"protein_g":2,"carbs_g":2,"fat_g":0},
         {"name_es":"Banana","name_en":"Banana","quantity_g":100,"calories":89,"protein_g":1,"carbs_g":23,"fat_g":0},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":25,"calories":100,"protein_g":20,"carbs_g":2,"fat_g":1},
         {"name_es":"Leche de almendras","name_en":"Almond milk","quantity_g":200,"calories":30,"protein_g":1,"carbs_g":1,"fat_g":2}
       ],"calories":233,"protein_g":24,"carbs_g":28,"fat_g":3,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Bowl mediterráneo de pollo y garbanzos","name_en":"Mediterranean chicken and chickpea bowl",
       "foods":[
         {"name_es":"Pechuga de pollo grillada","name_en":"Grilled chicken breast","quantity_g":180,"calories":198,"protein_g":37,"carbs_g":0,"fat_g":4},
         {"name_es":"Garbanzos cocidos","name_en":"Cooked chickpeas","quantity_g":150,"calories":246,"protein_g":13,"carbs_g":41,"fat_g":4},
         {"name_es":"Tomate cherry","name_en":"Cherry tomatoes","quantity_g":100,"calories":18,"protein_g":1,"carbs_g":4,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":550,"protein_g":51,"carbs_g":45,"fat_g":18,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Hummus con pan pita","name_en":"Hummus with pita bread",
       "foods":[
         {"name_es":"Hummus","name_en":"Hummus","quantity_g":60,"calories":140,"protein_g":5,"carbs_g":12,"fat_g":8},
         {"name_es":"Pan pita integral","name_en":"Whole wheat pita bread","quantity_g":40,"calories":120,"protein_g":4,"carbs_g":24,"fat_g":1}
       ],"calories":260,"protein_g":9,"carbs_g":36,"fat_g":9,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Merluza a la plancha con arroz y ensalada","name_en":"Grilled hake with rice and salad",
       "foods":[
         {"name_es":"Merluza","name_en":"Hake","quantity_g":200,"calories":172,"protein_g":36,"carbs_g":0,"fat_g":2},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":150,"calories":195,"protein_g":4,"carbs_g":43,"fat_g":0},
         {"name_es":"Ensalada mixta","name_en":"Mixed salad","quantity_g":100,"calories":25,"protein_g":2,"carbs_g":4,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":463,"protein_g":42,"carbs_g":47,"fat_g":10,"notes_es":"","notes_en":""}
    ],"total_calories":1958,"total_protein_g":148,"total_carbs_g":218,"total_fat_g":54},
    {"day_number":7,"day_name":"Domingo / Sunday","meals":[
      {"slot":"breakfast","name_es":"Desayuno completo con huevos, tostadas y frutas","name_en":"Full breakfast with eggs, toast and fruits",
       "foods":[
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":165,"calories":234,"protein_g":19,"carbs_g":1,"fat_g":16},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":60,"calories":159,"protein_g":6,"carbs_g":30,"fat_g":2},
         {"name_es":"Tomate cherry","name_en":"Cherry tomatoes","quantity_g":80,"calories":14,"protein_g":1,"carbs_g":3,"fat_g":0},
         {"name_es":"Naranja","name_en":"Orange","quantity_g":150,"calories":71,"protein_g":1,"carbs_g":18,"fat_g":0}
       ],"calories":478,"protein_g":27,"carbs_g":52,"fat_g":18,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Pudding de avena y chía","name_en":"Oat and chia pudding",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":40,"calories":148,"protein_g":5,"carbs_g":27,"fat_g":3},
         {"name_es":"Semillas de chía","name_en":"Chia seeds","quantity_g":15,"calories":73,"protein_g":2,"carbs_g":6,"fat_g":5},
         {"name_es":"Leche de almendras","name_en":"Almond milk","quantity_g":200,"calories":30,"protein_g":1,"carbs_g":1,"fat_g":2}
       ],"calories":251,"protein_g":8,"carbs_g":34,"fat_g":10,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Pollo asado familiar con guarniciones","name_en":"Family-style roast chicken with sides",
       "foods":[
         {"name_es":"Pollo asado","name_en":"Roast chicken","quantity_g":220,"calories":325,"protein_g":48,"carbs_g":0,"fat_g":14},
         {"name_es":"Papa asada","name_en":"Roasted potato","quantity_g":150,"calories":158,"protein_g":3,"carbs_g":37,"fat_g":0},
         {"name_es":"Zanahorias asadas","name_en":"Roasted carrots","quantity_g":120,"calories":55,"protein_g":1,"carbs_g":13,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":609,"protein_g":52,"carbs_g":50,"fat_g":22,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Frutos secos mixtos","name_en":"Mixed nuts",
       "foods":[
         {"name_es":"Nueces mixtas","name_en":"Mixed nuts","quantity_g":30,"calories":185,"protein_g":5,"carbs_g":6,"fat_g":17}
       ],"calories":185,"protein_g":5,"carbs_g":6,"fat_g":17,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Sopa de vegetales con carne","name_en":"Vegetable soup with beef",
       "foods":[
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":120,"calories":185,"protein_g":27,"carbs_g":0,"fat_g":8},
         {"name_es":"Papa","name_en":"Potato","quantity_g":100,"calories":85,"protein_g":2,"carbs_g":19,"fat_g":0},
         {"name_es":"Zanahoria","name_en":"Carrot","quantity_g":80,"calories":33,"protein_g":1,"carbs_g":8,"fat_g":0},
         {"name_es":"Calabaza","name_en":"Pumpkin","quantity_g":100,"calories":25,"protein_g":1,"carbs_g":6,"fat_g":0}
       ],"calories":328,"protein_g":31,"carbs_g":33,"fat_g":8,"notes_es":"","notes_en":""}
    ],"total_calories":1851,"total_protein_g":123,"total_carbs_g":181,"total_fat_g":75}
  ]'::jsonb
);
