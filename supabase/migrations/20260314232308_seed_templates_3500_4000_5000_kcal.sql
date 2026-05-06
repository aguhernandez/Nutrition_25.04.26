/*
  # Seed Meal Plan Templates: 3500, 4000, 5000 kcal
  
  High-calorie templates for elite athletes, ultra-endurance, and very high energy needs:
  - 3500 kcal balanced (omnivore, strength/mass gain)
  - 4000 kcal endurance (ironman, ultra cycling)
  - 5000 kcal ultra-endurance / Tour-level cycling
*/

INSERT INTO meal_plan_templates (name, name_es, name_en, description_es, description_en, calories_target, focus, dietary_pattern, protein_g, carbs_g, fat_g, fiber_g, tags, suitable_for, days) VALUES

-- ====================================================
-- 3500 kcal BALANCED (Mass Gain / Fuerza)
-- ====================================================
(
  '3500 kcal - Ganancia de Masa / Mass Gain',
  '3500 kcal - Ganancia de Masa Muscular',
  '3500 kcal - Muscle Mass Gain',
  'Plan de 3500 kcal para ganancia de masa muscular con distribución equilibrada. Para atletas de fuerza en superávit.',
  '3500 kcal plan for muscle mass gain. For strength athletes in caloric surplus.',
  3500,
  'strength',
  'omnivore',
  230,
  400,
  95,
  40,
  ARRAY['3500kcal','ganancia_masa','mass_gain','fuerza','strength','bulking','rugby','football'],
  ARRAY['weightlifting','rugby','american_football','crossfit','bodybuilding'],
  '[
    {"day_number":1,"day_name":"Lunes / Monday","meals":[
      {"slot":"breakfast","name_es":"Desayuno enorme proteico y energético","name_en":"Large protein and energy breakfast",
       "foods":[
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":275,"calories":390,"protein_g":33,"carbs_g":2,"fat_g":27},
         {"name_es":"Avena","name_en":"Oats","quantity_g":100,"calories":370,"protein_g":13,"carbs_g":66,"fat_g":7},
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Leche entera","name_en":"Whole milk","quantity_g":200,"calories":124,"protein_g":7,"carbs_g":10,"fat_g":7}
       ],"calories":1018,"protein_g":55,"carbs_g":112,"fat_g":41,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Batido de proteína con avena y mantequilla de maní","name_en":"Protein shake with oats and peanut butter",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":50,"calories":200,"protein_g":40,"carbs_g":5,"fat_g":3},
         {"name_es":"Avena","name_en":"Oats","quantity_g":60,"calories":222,"protein_g":8,"carbs_g":40,"fat_g":4},
         {"name_es":"Mantequilla de maní","name_en":"Peanut butter","quantity_g":30,"calories":177,"protein_g":7,"carbs_g":6,"fat_g":15},
         {"name_es":"Leche","name_en":"Milk","quantity_g":250,"calories":155,"protein_g":10,"carbs_g":15,"fat_g":6}
       ],"calories":754,"protein_g":65,"carbs_g":66,"fat_g":28,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Triple ración de arroz con pollo y vegetales","name_en":"Triple portion rice with chicken and vegetables",
       "foods":[
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":300,"calories":330,"protein_g":62,"carbs_g":0,"fat_g":7},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":300,"calories":390,"protein_g":7,"carbs_g":86,"fat_g":1},
         {"name_es":"Brócoli","name_en":"Broccoli","quantity_g":200,"calories":68,"protein_g":6,"carbs_g":13,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":15,"calories":133,"protein_g":0,"carbs_g":0,"fat_g":15}
       ],"calories":921,"protein_g":75,"carbs_g":99,"fat_g":23,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Pan con aguacate y atún","name_en":"Bread with avocado and tuna",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":100,"calories":265,"protein_g":10,"carbs_g":50,"fat_g":3},
         {"name_es":"Aguacate","name_en":"Avocado","quantity_g":80,"calories":128,"protein_g":2,"carbs_g":7,"fat_g":12},
         {"name_es":"Atún en agua","name_en":"Canned tuna in water","quantity_g":120,"calories":139,"protein_g":31,"carbs_g":0,"fat_g":1}
       ],"calories":532,"protein_g":43,"carbs_g":57,"fat_g":16,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Carne magra grande con batata y ensalada","name_en":"Large lean beef with sweet potato and salad",
       "foods":[
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":300,"calories":462,"protein_g":66,"carbs_g":0,"fat_g":21},
         {"name_es":"Batata cocida","name_en":"Cooked sweet potato","quantity_g":250,"calories":215,"protein_g":4,"carbs_g":50,"fat_g":0},
         {"name_es":"Ensalada verde","name_en":"Green salad","quantity_g":120,"calories":24,"protein_g":2,"carbs_g":5,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":789,"protein_g":72,"carbs_g":55,"fat_g":31,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Caseína con leche entera","name_en":"Casein with whole milk",
       "foods":[
         {"name_es":"Proteína caseína","name_en":"Casein protein","quantity_g":40,"calories":152,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Leche entera","name_en":"Whole milk","quantity_g":200,"calories":124,"protein_g":7,"carbs_g":10,"fat_g":7}
       ],"calories":276,"protein_g":39,"carbs_g":14,"fat_g":9,"notes_es":"","notes_en":""}
    ],"total_calories":4290,"total_protein_g":349,"total_carbs_g":403,"total_fat_g":148},
    {"day_number":2,"day_name":"Martes / Tuesday","meals":[
      {"slot":"breakfast","name_es":"Panqueques proteicos grandes con frutas","name_en":"Large protein pancakes with fruit",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":120,"calories":444,"protein_g":15,"carbs_g":79,"fat_g":8},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":40,"calories":160,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":165,"calories":234,"protein_g":19,"carbs_g":1,"fat_g":16},
         {"name_es":"Mango","name_en":"Mango","quantity_g":150,"calories":95,"protein_g":1,"carbs_g":25,"fat_g":0},
         {"name_es":"Sirope de arce","name_en":"Maple syrup","quantity_g":20,"calories":69,"protein_g":0,"carbs_g":18,"fat_g":0}
       ],"calories":1002,"protein_g":67,"carbs_g":127,"fat_g":26,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Arroz con atún y vegetales","name_en":"Rice with tuna and vegetables",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":200,"calories":260,"protein_g":5,"carbs_g":57,"fat_g":0},
         {"name_es":"Atún en agua","name_en":"Canned tuna in water","quantity_g":150,"calories":174,"protein_g":39,"carbs_g":0,"fat_g":1},
         {"name_es":"Tomate y pepino","name_en":"Tomato and cucumber","quantity_g":120,"calories":25,"protein_g":1,"carbs_g":6,"fat_g":0}
       ],"calories":459,"protein_g":45,"carbs_g":63,"fat_g":1,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Salmón con pasta entera y espárragos","name_en":"Salmon with whole pasta and asparagus",
       "foods":[
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":250,"calories":467,"protein_g":50,"carbs_g":0,"fat_g":29},
         {"name_es":"Pasta integral cocida","name_en":"Cooked whole wheat pasta","quantity_g":300,"calories":414,"protein_g":18,"carbs_g":83,"fat_g":2},
         {"name_es":"Espárragos","name_en":"Asparagus","quantity_g":150,"calories":30,"protein_g":3,"carbs_g":6,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":999,"protein_g":71,"carbs_g":89,"fat_g":41,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Batido hiper-proteico","name_en":"High-protein shake",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":60,"calories":240,"protein_g":48,"carbs_g":6,"fat_g":4},
         {"name_es":"Leche entera","name_en":"Whole milk","quantity_g":300,"calories":186,"protein_g":10,"carbs_g":15,"fat_g":10}
       ],"calories":426,"protein_g":58,"carbs_g":21,"fat_g":14,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pechuga de pavo con patata y vegetales asados","name_en":"Turkey breast with potato and roasted vegetables",
       "foods":[
         {"name_es":"Pechuga de pavo","name_en":"Turkey breast","quantity_g":280,"calories":308,"protein_g":63,"carbs_g":0,"fat_g":4},
         {"name_es":"Patata cocida","name_en":"Cooked potato","quantity_g":250,"calories":213,"protein_g":5,"carbs_g":49,"fat_g":0},
         {"name_es":"Vegetales asados","name_en":"Roasted vegetables","quantity_g":200,"calories":70,"protein_g":3,"carbs_g":15,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":12,"calories":106,"protein_g":0,"carbs_g":0,"fat_g":12}
       ],"calories":697,"protein_g":71,"carbs_g":64,"fat_g":16,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Quark proteico","name_en":"Protein quark",
       "foods":[
         {"name_es":"Quark","name_en":"Quark","quantity_g":200,"calories":133,"protein_g":23,"carbs_g":5,"fat_g":1}
       ],"calories":133,"protein_g":23,"carbs_g":5,"fat_g":1,"notes_es":"","notes_en":""}
    ],"total_calories":3716,"total_protein_g":335,"total_carbs_g":369,"total_fat_g":99},
    {"day_number":3,"day_name":"Miércoles / Wednesday","meals":[
      {"slot":"breakfast","name_es":"Avena gigante con proteína y frutos secos","name_en":"Giant protein oats with nuts",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":120,"calories":444,"protein_g":15,"carbs_g":79,"fat_g":8},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":40,"calories":160,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Nueces mixtas","name_en":"Mixed nuts","quantity_g":40,"calories":247,"protein_g":7,"carbs_g":9,"fat_g":22},
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Leche","name_en":"Milk","quantity_g":200,"calories":124,"protein_g":8,"carbs_g":12,"fat_g":5}
       ],"calories":1109,"protein_g":64,"carbs_g":138,"fat_g":37,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Tortilla de claras con pan integral","name_en":"Egg white omelette with whole grain bread",
       "foods":[
         {"name_es":"Claras de huevo","name_en":"Egg whites","quantity_g":360,"calories":186,"protein_g":39,"carbs_g":3,"fat_g":0},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":80,"calories":212,"protein_g":8,"carbs_g":40,"fat_g":3},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":469,"protein_g":47,"carbs_g":43,"fat_g":11,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Bowl maxi de arroz, carne y garbanzos","name_en":"Maxi bowl rice, beef and chickpeas",
       "foods":[
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":280,"calories":431,"protein_g":62,"carbs_g":0,"fat_g":19},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":300,"calories":390,"protein_g":7,"carbs_g":86,"fat_g":1},
         {"name_es":"Garbanzos cocidos","name_en":"Cooked chickpeas","quantity_g":150,"calories":246,"protein_g":13,"carbs_g":41,"fat_g":4},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":12,"calories":106,"protein_g":0,"carbs_g":0,"fat_g":12}
       ],"calories":1173,"protein_g":82,"carbs_g":127,"fat_g":36,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Pan con mantequilla de maní y plátano","name_en":"Bread with peanut butter and banana",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":80,"calories":212,"protein_g":8,"carbs_g":40,"fat_g":3},
         {"name_es":"Mantequilla de maní","name_en":"Peanut butter","quantity_g":30,"calories":177,"protein_g":7,"carbs_g":6,"fat_g":15},
         {"name_es":"Banana","name_en":"Banana","quantity_g":120,"calories":107,"protein_g":1,"carbs_g":27,"fat_g":0}
       ],"calories":496,"protein_g":16,"carbs_g":73,"fat_g":18,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pollo al horno con quinoa y espinaca","name_en":"Baked chicken with quinoa and spinach",
       "foods":[
         {"name_es":"Pechuga de pollo al horno","name_en":"Baked chicken breast","quantity_g":280,"calories":308,"protein_g":58,"carbs_g":0,"fat_g":7},
         {"name_es":"Quinoa cocida","name_en":"Cooked quinoa","quantity_g":200,"calories":244,"protein_g":9,"carbs_g":44,"fat_g":4},
         {"name_es":"Espinaca salteada","name_en":"Sautéed spinach","quantity_g":150,"calories":35,"protein_g":4,"carbs_g":6,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":675,"protein_g":71,"carbs_g":50,"fat_g":21,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Caseína y leche","name_en":"Casein and milk",
       "foods":[
         {"name_es":"Proteína caseína","name_en":"Casein protein","quantity_g":45,"calories":171,"protein_g":36,"carbs_g":4,"fat_g":2}
       ],"calories":171,"protein_g":36,"carbs_g":4,"fat_g":2,"notes_es":"","notes_en":""}
    ],"total_calories":4093,"total_protein_g":316,"total_carbs_g":435,"total_fat_g":125},
    {"day_number":4,"day_name":"Jueves / Thursday","meals":[
      {"slot":"breakfast","name_es":"Smoothie bowl hiper-calórico","name_en":"High-calorie smoothie bowl",
       "foods":[
         {"name_es":"Banana congelada","name_en":"Frozen banana","quantity_g":200,"calories":178,"protein_g":2,"carbs_g":46,"fat_g":0},
         {"name_es":"Mantequilla de almendras","name_en":"Almond butter","quantity_g":40,"calories":242,"protein_g":8,"carbs_g":8,"fat_g":22},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":40,"calories":160,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Granola","name_en":"Granola","quantity_g":80,"calories":357,"protein_g":9,"carbs_g":53,"fat_g":14},
         {"name_es":"Leche de coco","name_en":"Coconut milk","quantity_g":150,"calories":78,"protein_g":1,"carbs_g":7,"fat_g":5}
       ],"calories":1015,"protein_g":52,"carbs_g":118,"fat_g":43,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Sándwich de atún y aguacate","name_en":"Tuna and avocado sandwich",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":120,"calories":318,"protein_g":12,"carbs_g":60,"fat_g":4},
         {"name_es":"Atún en agua","name_en":"Canned tuna in water","quantity_g":150,"calories":174,"protein_g":39,"carbs_g":0,"fat_g":1},
         {"name_es":"Aguacate","name_en":"Avocado","quantity_g":80,"calories":128,"protein_g":2,"carbs_g":7,"fat_g":12}
       ],"calories":620,"protein_g":53,"carbs_g":67,"fat_g":17,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Salmón con arroz y lentejas","name_en":"Salmon with rice and lentils",
       "foods":[
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":250,"calories":467,"protein_g":50,"carbs_g":0,"fat_g":29},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":250,"calories":325,"protein_g":6,"carbs_g":71,"fat_g":1},
         {"name_es":"Lentejas cocidas","name_en":"Cooked lentils","quantity_g":150,"calories":173,"protein_g":13,"carbs_g":30,"fat_g":1},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":1053,"protein_g":69,"carbs_g":101,"fat_g":41,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Batido calórico de masa","name_en":"Mass gainer shake",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":50,"calories":200,"protein_g":40,"carbs_g":5,"fat_g":3},
         {"name_es":"Avena","name_en":"Oats","quantity_g":60,"calories":222,"protein_g":8,"carbs_g":40,"fat_g":4},
         {"name_es":"Mantequilla de maní","name_en":"Peanut butter","quantity_g":30,"calories":177,"protein_g":7,"carbs_g":6,"fat_g":15},
         {"name_es":"Leche entera","name_en":"Whole milk","quantity_g":300,"calories":186,"protein_g":10,"carbs_g":15,"fat_g":10}
       ],"calories":785,"protein_g":65,"carbs_g":66,"fat_g":32,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pechuga de pollo con patata y ensalada grande","name_en":"Chicken breast with potato and large salad",
       "foods":[
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":280,"calories":308,"protein_g":58,"carbs_g":0,"fat_g":7},
         {"name_es":"Patata cocida","name_en":"Cooked potato","quantity_g":250,"calories":213,"protein_g":5,"carbs_g":49,"fat_g":0},
         {"name_es":"Ensalada mixta grande","name_en":"Large mixed salad","quantity_g":150,"calories":38,"protein_g":3,"carbs_g":7,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":12,"calories":106,"protein_g":0,"carbs_g":0,"fat_g":12}
       ],"calories":665,"protein_g":66,"carbs_g":56,"fat_g":19,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Requesón nocturno con nueces","name_en":"Overnight quark with walnuts",
       "foods":[
         {"name_es":"Quark","name_en":"Quark","quantity_g":200,"calories":133,"protein_g":23,"carbs_g":5,"fat_g":1},
         {"name_es":"Nueces","name_en":"Walnuts","quantity_g":20,"calories":131,"protein_g":3,"carbs_g":3,"fat_g":13}
       ],"calories":264,"protein_g":26,"carbs_g":8,"fat_g":14,"notes_es":"","notes_en":""}
    ],"total_calories":4402,"total_protein_g":331,"total_carbs_g":416,"total_fat_g":166},
    {"day_number":5,"day_name":"Viernes / Friday","meals":[
      {"slot":"breakfast","name_es":"Tortilla entera y avena con proteína","name_en":"Whole omelette and protein oats",
       "foods":[
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":220,"calories":312,"protein_g":26,"carbs_g":1,"fat_g":22},
         {"name_es":"Avena","name_en":"Oats","quantity_g":100,"calories":370,"protein_g":13,"carbs_g":66,"fat_g":7},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},
         {"name_es":"Leche","name_en":"Milk","quantity_g":200,"calories":124,"protein_g":8,"carbs_g":12,"fat_g":5}
       ],"calories":926,"protein_g":71,"carbs_g":82,"fat_g":36,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Yogur con granola y frutos secos","name_en":"Yogurt with granola and nuts",
       "foods":[
         {"name_es":"Yogur griego","name_en":"Greek yogurt","quantity_g":200,"calories":174,"protein_g":23,"carbs_g":8,"fat_g":5},
         {"name_es":"Granola","name_en":"Granola","quantity_g":60,"calories":268,"protein_g":6,"carbs_g":40,"fat_g":11},
         {"name_es":"Nueces mixtas","name_en":"Mixed nuts","quantity_g":30,"calories":185,"protein_g":5,"carbs_g":6,"fat_g":17}
       ],"calories":627,"protein_g":34,"carbs_g":54,"fat_g":33,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Carne con arroz grande y ensalada","name_en":"Beef with large rice and salad",
       "foods":[
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":300,"calories":462,"protein_g":66,"carbs_g":0,"fat_g":21},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":350,"calories":455,"protein_g":8,"carbs_g":100,"fat_g":1},
         {"name_es":"Ensalada mixta","name_en":"Mixed salad","quantity_g":120,"calories":30,"protein_g":2,"carbs_g":6,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":12,"calories":106,"protein_g":0,"carbs_g":0,"fat_g":12}
       ],"calories":1053,"protein_g":76,"carbs_g":106,"fat_g":34,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Pan tostado con mantequilla y miel","name_en":"Toast with butter and honey",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":100,"calories":265,"protein_g":10,"carbs_g":50,"fat_g":3},
         {"name_es":"Mantequilla","name_en":"Butter","quantity_g":15,"calories":108,"protein_g":0,"carbs_g":0,"fat_g":12},
         {"name_es":"Miel","name_en":"Honey","quantity_g":20,"calories":61,"protein_g":0,"carbs_g":17,"fat_g":0}
       ],"calories":434,"protein_g":10,"carbs_g":67,"fat_g":15,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pollo con quinoa y vegetales abundantes","name_en":"Chicken with quinoa and abundant vegetables",
       "foods":[
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":280,"calories":308,"protein_g":58,"carbs_g":0,"fat_g":7},
         {"name_es":"Quinoa cocida","name_en":"Cooked quinoa","quantity_g":200,"calories":244,"protein_g":9,"carbs_g":44,"fat_g":4},
         {"name_es":"Vegetales mixtos","name_en":"Mixed vegetables","quantity_g":200,"calories":70,"protein_g":3,"carbs_g":15,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":710,"protein_g":70,"carbs_g":59,"fat_g":21,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Batido de caseína nocturno","name_en":"Overnight casein shake",
       "foods":[
         {"name_es":"Proteína caseína","name_en":"Casein protein","quantity_g":40,"calories":152,"protein_g":32,"carbs_g":4,"fat_g":2}
       ],"calories":152,"protein_g":32,"carbs_g":4,"fat_g":2,"notes_es":"","notes_en":""}
    ],"total_calories":3902,"total_protein_g":293,"total_carbs_g":372,"total_fat_g":141},
    {"day_number":6,"day_name":"Sábado / Saturday","meals":[
      {"slot":"breakfast","name_es":"Desayuno festivo alto-calórico","name_en":"Festive high-calorie breakfast",
       "foods":[
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":275,"calories":390,"protein_g":33,"carbs_g":2,"fat_g":27},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":120,"calories":318,"protein_g":12,"carbs_g":60,"fat_g":4},
         {"name_es":"Aguacate","name_en":"Avocado","quantity_g":100,"calories":160,"protein_g":2,"carbs_g":9,"fat_g":15},
         {"name_es":"Salmón ahumado","name_en":"Smoked salmon","quantity_g":80,"calories":105,"protein_g":17,"carbs_g":0,"fat_g":4},
         {"name_es":"Naranja","name_en":"Orange","quantity_g":150,"calories":71,"protein_g":1,"carbs_g":18,"fat_g":0}
       ],"calories":1044,"protein_g":65,"carbs_g":89,"fat_g":50,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Batido calórico de coco y frutas","name_en":"Calorie-dense coconut and fruit shake",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":40,"calories":160,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Leche de coco entera","name_en":"Full-fat coconut milk","quantity_g":200,"calories":425,"protein_g":4,"carbs_g":6,"fat_g":44}
       ],"calories":719,"protein_g":38,"carbs_g":44,"fat_g":46,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Parrilla completa con guarnición grande","name_en":"Full grill with large side",
       "foods":[
         {"name_es":"Carne vacuna magra a la parrilla","name_en":"Grilled lean beef","quantity_g":300,"calories":462,"protein_g":66,"carbs_g":0,"fat_g":21},
         {"name_es":"Chorizo puro de cerdo","name_en":"Pork chorizo","quantity_g":60,"calories":246,"protein_g":12,"carbs_g":2,"fat_g":21},
         {"name_es":"Patata asada","name_en":"Roasted potato","quantity_g":300,"calories":315,"protein_g":6,"carbs_g":73,"fat_g":0},
         {"name_es":"Ensalada mixta","name_en":"Mixed salad","quantity_g":150,"calories":38,"protein_g":3,"carbs_g":7,"fat_g":0}
       ],"calories":1061,"protein_g":87,"carbs_g":82,"fat_g":42,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Pan con mantequilla de maní y mermelada","name_en":"Bread with peanut butter and jam",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":80,"calories":212,"protein_g":8,"carbs_g":40,"fat_g":3},
         {"name_es":"Mantequilla de maní","name_en":"Peanut butter","quantity_g":30,"calories":177,"protein_g":7,"carbs_g":6,"fat_g":15},
         {"name_es":"Mermelada de fresa","name_en":"Strawberry jam","quantity_g":20,"calories":52,"protein_g":0,"carbs_g":13,"fat_g":0}
       ],"calories":441,"protein_g":15,"carbs_g":59,"fat_g":18,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Salmón al horno con arroz y ensalada","name_en":"Baked salmon with rice and salad",
       "foods":[
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":250,"calories":467,"protein_g":50,"carbs_g":0,"fat_g":29},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":250,"calories":325,"protein_g":6,"carbs_g":71,"fat_g":1},
         {"name_es":"Ensalada verde","name_en":"Green salad","quantity_g":100,"calories":20,"protein_g":1,"carbs_g":4,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":900,"protein_g":57,"carbs_g":75,"fat_g":40,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Quark con cacao y almendras","name_en":"Quark with cocoa and almonds",
       "foods":[
         {"name_es":"Quark","name_en":"Quark","quantity_g":150,"calories":100,"protein_g":17,"carbs_g":4,"fat_g":1},
         {"name_es":"Almendras","name_en":"Almonds","quantity_g":25,"calories":145,"protein_g":5,"carbs_g":5,"fat_g":13},
         {"name_es":"Cacao en polvo","name_en":"Cocoa powder","quantity_g":10,"calories":28,"protein_g":2,"carbs_g":5,"fat_g":1}
       ],"calories":273,"protein_g":24,"carbs_g":14,"fat_g":15,"notes_es":"","notes_en":""}
    ],"total_calories":4438,"total_protein_g":286,"total_carbs_g":363,"total_fat_g":211},
    {"day_number":7,"day_name":"Domingo / Sunday","meals":[
      {"slot":"breakfast","name_es":"Desayuno completo dominical","name_en":"Full Sunday breakfast",
       "foods":[
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":275,"calories":390,"protein_g":33,"carbs_g":2,"fat_g":27},
         {"name_es":"Avena con leche","name_en":"Oats with milk","quantity_g":100,"calories":370,"protein_g":13,"carbs_g":66,"fat_g":7},
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Nueces","name_en":"Walnuts","quantity_g":30,"calories":196,"protein_g":4,"carbs_g":4,"fat_g":20}
       ],"calories":1090,"protein_g":52,"carbs_g":106,"fat_g":54,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Batido proteico y fruta","name_en":"Protein shake and fruit",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":50,"calories":200,"protein_g":40,"carbs_g":5,"fat_g":3},
         {"name_es":"Manzana","name_en":"Apple","quantity_g":150,"calories":78,"protein_g":0,"carbs_g":21,"fat_g":0},
         {"name_es":"Leche","name_en":"Milk","quantity_g":250,"calories":155,"protein_g":10,"carbs_g":15,"fat_g":6}
       ],"calories":433,"protein_g":50,"carbs_g":41,"fat_g":9,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Asado dominical con arroz y vegetales","name_en":"Sunday roast with rice and vegetables",
       "foods":[
         {"name_es":"Pollo asado","name_en":"Roast chicken","quantity_g":300,"calories":444,"protein_g":65,"carbs_g":0,"fat_g":20},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":300,"calories":390,"protein_g":7,"carbs_g":86,"fat_g":1},
         {"name_es":"Zanahorias y patatas asadas","name_en":"Roasted carrots and potatoes","quantity_g":250,"calories":183,"protein_g":4,"carbs_g":43,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":12,"calories":106,"protein_g":0,"carbs_g":0,"fat_g":12}
       ],"calories":1123,"protein_g":76,"carbs_g":129,"fat_g":33,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Galletas con queso y fruta","name_en":"Crackers with cheese and fruit",
       "foods":[
         {"name_es":"Galletas integrales","name_en":"Whole grain crackers","quantity_g":50,"calories":215,"protein_g":5,"carbs_g":35,"fat_g":7},
         {"name_es":"Queso manchego","name_en":"Manchego cheese","quantity_g":50,"calories":196,"protein_g":11,"carbs_g":0,"fat_g":17},
         {"name_es":"Pera","name_en":"Pear","quantity_g":150,"calories":85,"protein_g":1,"carbs_g":23,"fat_g":0}
       ],"calories":496,"protein_g":17,"carbs_g":58,"fat_g":24,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pasta con carne y vegetales","name_en":"Pasta with beef and vegetables",
       "foods":[
         {"name_es":"Pasta cocida","name_en":"Cooked pasta","quantity_g":300,"calories":414,"protein_g":15,"carbs_g":83,"fat_g":2},
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":200,"calories":308,"protein_g":44,"carbs_g":0,"fat_g":14},
         {"name_es":"Salsa de tomate","name_en":"Tomato sauce","quantity_g":150,"calories":53,"protein_g":2,"carbs_g":12,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":8,"calories":71,"protein_g":0,"carbs_g":0,"fat_g":8}
       ],"calories":846,"protein_g":61,"carbs_g":95,"fat_g":24,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Caseína y frutos secos","name_en":"Casein and nuts",
       "foods":[
         {"name_es":"Proteína caseína","name_en":"Casein protein","quantity_g":40,"calories":152,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Nueces mixtas","name_en":"Mixed nuts","quantity_g":20,"calories":131,"protein_g":3,"carbs_g":3,"fat_g":13}
       ],"calories":283,"protein_g":35,"carbs_g":7,"fat_g":15,"notes_es":"","notes_en":""}
    ],"total_calories":4271,"total_protein_g":291,"total_carbs_g":436,"total_fat_g":159}
  ]'::jsonb
),

-- ====================================================
-- 5000 kcal ULTRA-ENDURANCE
-- ====================================================
(
  '5000 kcal - Ultra Resistencia / Ultra-Endurance',
  '5000 kcal - Ultra Resistencia (Ciclismo Tour / Ironman)',
  '5000 kcal - Ultra-Endurance (Tour Cycling / Ironman)',
  'Plan de 5000 kcal para atletas de ultra-resistencia: ciclismo de gran fondo, Ironman, ultra-maratón. Alto en carbohidratos.',
  '5000 kcal plan for ultra-endurance athletes: gran fondo cycling, Ironman, ultra-marathon. High in carbohydrates.',
  5000,
  'endurance',
  'omnivore',
  200,
  700,
  120,
  55,
  ARRAY['5000kcal','ultra_resistencia','ultra_endurance','ironman','tour','gran_fondo','ultra_maraton'],
  ARRAY['ironman','ultra_cycling','gran_fondo','ultra_marathon','stage_race'],
  '[
    {"day_number":1,"day_name":"Lunes / Monday (Etapa larga / Long stage)","meals":[
      {"slot":"wake_up","name_es":"Pre-activación (5h30)","name_en":"Pre-activation (5:30am)",
       "foods":[
         {"name_es":"Pan con miel","name_en":"Bread with honey","quantity_g":120,"calories":341,"protein_g":8,"carbs_g":77,"fat_g":2},
         {"name_es":"Café con azúcar","name_en":"Coffee with sugar","quantity_g":250,"calories":50,"protein_g":0,"carbs_g":13,"fat_g":0}
       ],"calories":391,"protein_g":8,"carbs_g":90,"fat_g":2,"notes_es":"1.5h antes del inicio","notes_en":"1.5h before start"},
      {"slot":"during_training","name_es":"Nutrición durante etapa (5h+)","name_en":"Stage nutrition (5h+)",
       "foods":[
         {"name_es":"Geles energéticos x8","name_en":"Energy gels x8","quantity_g":256,"calories":800,"protein_g":0,"carbs_g":200,"fat_g":0},
         {"name_es":"Bebida isotónica (3L)","name_en":"Isotonic drink (3L)","quantity_g":3000,"calories":600,"protein_g":0,"carbs_g":150,"fat_g":0},
         {"name_es":"Barrita energética x2","name_en":"Energy bar x2","quantity_g":120,"calories":444,"protein_g":10,"carbs_g":74,"fat_g":14}
       ],"calories":1844,"protein_g":10,"carbs_g":424,"fat_g":14,"notes_es":"Distribuido durante la actividad","notes_en":"Distributed throughout activity"},
      {"slot":"post_training","name_es":"Recuperación inmediata","name_en":"Immediate recovery",
       "foods":[
         {"name_es":"Leche chocolatada","name_en":"Chocolate milk","quantity_g":500,"calories":385,"protein_g":20,"carbs_g":65,"fat_g":6},
         {"name_es":"Plátano","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0}
       ],"calories":519,"protein_g":22,"carbs_g":99,"fat_g":6,"notes_es":"Inmediatamente post-etapa","notes_en":"Immediately post-stage"},
      {"slot":"lunch","name_es":"Carga de carbohidratos post-etapa","name_en":"Post-stage carb loading",
       "foods":[
         {"name_es":"Pasta cocida","name_en":"Cooked pasta","quantity_g":400,"calories":552,"protein_g":20,"carbs_g":111,"fat_g":2},
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":200,"calories":220,"protein_g":41,"carbs_g":0,"fat_g":5},
         {"name_es":"Salsa de tomate","name_en":"Tomato sauce","quantity_g":150,"calories":53,"protein_g":2,"carbs_g":12,"fat_g":0},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":80,"calories":212,"protein_g":8,"carbs_g":40,"fat_g":3}
       ],"calories":1037,"protein_g":71,"carbs_g":163,"fat_g":10,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Merienda de recuperación","name_en":"Recovery snack",
       "foods":[
         {"name_es":"Arroz con leche","name_en":"Rice pudding","quantity_g":300,"calories":315,"protein_g":8,"carbs_g":63,"fat_g":4},
         {"name_es":"Plátano","name_en":"Banana","quantity_g":120,"calories":107,"protein_g":1,"carbs_g":27,"fat_g":0}
       ],"calories":422,"protein_g":9,"carbs_g":90,"fat_g":4,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Cena de recuperación y pre-carga","name_en":"Recovery and pre-load dinner",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":350,"calories":455,"protein_g":8,"carbs_g":100,"fat_g":1},
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":200,"calories":374,"protein_g":40,"carbs_g":0,"fat_g":23},
         {"name_es":"Batata cocida","name_en":"Cooked sweet potato","quantity_g":200,"calories":172,"protein_g":4,"carbs_g":40,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":1089,"protein_g":52,"carbs_g":140,"fat_g":34,"notes_es":"","notes_en":""}
    ],"total_calories":5302,"total_protein_g":172,"total_carbs_g":1006,"total_fat_g":70},
    {"day_number":2,"day_name":"Martes / Tuesday (Descanso / Rest)","meals":[
      {"slot":"breakfast","name_es":"Desayuno de descanso","name_en":"Rest day breakfast",
       "foods":[
         {"name_es":"Avena","name_en":"Oats","quantity_g":100,"calories":370,"protein_g":13,"carbs_g":66,"fat_g":7},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":30,"calories":120,"protein_g":24,"carbs_g":3,"fat_g":2},
         {"name_es":"Leche","name_en":"Milk","quantity_g":300,"calories":186,"protein_g":12,"carbs_g":18,"fat_g":7},
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0}
       ],"calories":810,"protein_g":51,"carbs_g":121,"fat_g":16,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Tostadas con aguacate y huevos","name_en":"Toast with avocado and eggs",
       "foods":[
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":100,"calories":265,"protein_g":10,"carbs_g":50,"fat_g":3},
         {"name_es":"Aguacate","name_en":"Avocado","quantity_g":100,"calories":160,"protein_g":2,"carbs_g":9,"fat_g":15},
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":165,"calories":234,"protein_g":19,"carbs_g":1,"fat_g":16}
       ],"calories":659,"protein_g":31,"carbs_g":60,"fat_g":34,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Arroz con legumbres y pollo","name_en":"Rice with legumes and chicken",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":300,"calories":390,"protein_g":7,"carbs_g":86,"fat_g":1},
         {"name_es":"Lentejas cocidas","name_en":"Cooked lentils","quantity_g":200,"calories":230,"protein_g":18,"carbs_g":40,"fat_g":1},
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":200,"calories":220,"protein_g":41,"carbs_g":0,"fat_g":5},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":15,"calories":133,"protein_g":0,"carbs_g":0,"fat_g":15}
       ],"calories":973,"protein_g":66,"carbs_g":126,"fat_g":22,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Batido proteico con frutas","name_en":"Protein shake with fruits",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":40,"calories":160,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Leche","name_en":"Milk","quantity_g":300,"calories":186,"protein_g":12,"carbs_g":18,"fat_g":7}
       ],"calories":480,"protein_g":46,"carbs_g":56,"fat_g":9,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Cena abundante de descanso","name_en":"Abundant rest day dinner",
       "foods":[
         {"name_es":"Pasta integral cocida","name_en":"Cooked whole wheat pasta","quantity_g":300,"calories":414,"protein_g":18,"carbs_g":83,"fat_g":2},
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":200,"calories":374,"protein_g":40,"carbs_g":0,"fat_g":23},
         {"name_es":"Espinaca y tomate","name_en":"Spinach and tomato","quantity_g":150,"calories":40,"protein_g":3,"carbs_g":7,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":12,"calories":106,"protein_g":0,"carbs_g":0,"fat_g":12},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":60,"calories":159,"protein_g":6,"carbs_g":30,"fat_g":2}
       ],"calories":1093,"protein_g":67,"carbs_g":120,"fat_g":39,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Caseína nocturna","name_en":"Overnight casein",
       "foods":[
         {"name_es":"Proteína caseína","name_en":"Casein protein","quantity_g":45,"calories":171,"protein_g":36,"carbs_g":4,"fat_g":2}
       ],"calories":171,"protein_g":36,"carbs_g":4,"fat_g":2,"notes_es":"","notes_en":""}
    ],"total_calories":4186,"total_protein_g":297,"total_carbs_g":487,"total_fat_g":122},
    {"day_number":3,"day_name":"Miércoles / Wednesday (Etapa media / Medium stage)","meals":[
      {"slot":"wake_up","name_es":"Pre-etapa media","name_en":"Pre medium stage",
       "foods":[
         {"name_es":"Tostadas con mermelada y miel","name_en":"Toast with jam and honey","quantity_g":120,"calories":341,"protein_g":8,"carbs_g":77,"fat_g":2},
         {"name_es":"Zumo de naranja","name_en":"Orange juice","quantity_g":300,"calories":135,"protein_g":2,"carbs_g":31,"fat_g":0}
       ],"calories":476,"protein_g":10,"carbs_g":108,"fat_g":2,"notes_es":"","notes_en":""},
      {"slot":"during_training","name_es":"Nutrición etapa 3h","name_en":"3h stage nutrition",
       "foods":[
         {"name_es":"Geles x5","name_en":"Gels x5","quantity_g":160,"calories":500,"protein_g":0,"carbs_g":125,"fat_g":0},
         {"name_es":"Bebida isotónica 2L","name_en":"Isotonic drink 2L","quantity_g":2000,"calories":400,"protein_g":0,"carbs_g":100,"fat_g":0}
       ],"calories":900,"protein_g":0,"carbs_g":225,"fat_g":0,"notes_es":"","notes_en":""},
      {"slot":"post_training","name_es":"Recuperación rápida","name_en":"Quick recovery",
       "foods":[
         {"name_es":"Leche chocolatada","name_en":"Chocolate milk","quantity_g":400,"calories":308,"protein_g":16,"carbs_g":52,"fat_g":5},
         {"name_es":"Banana","name_en":"Banana","quantity_g":120,"calories":107,"protein_g":1,"carbs_g":27,"fat_g":0}
       ],"calories":415,"protein_g":17,"carbs_g":79,"fat_g":5,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Almuerzo de reposición energética","name_en":"Energy replenishment lunch",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":400,"calories":520,"protein_g":10,"carbs_g":114,"fat_g":1},
         {"name_es":"Carne vacuna magra","name_en":"Lean beef","quantity_g":200,"calories":308,"protein_g":44,"carbs_g":0,"fat_g":14},
         {"name_es":"Vegetales cocidos","name_en":"Cooked vegetables","quantity_g":200,"calories":70,"protein_g":3,"carbs_g":15,"fat_g":0},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":60,"calories":159,"protein_g":6,"carbs_g":30,"fat_g":2},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":12,"calories":106,"protein_g":0,"carbs_g":0,"fat_g":12}
       ],"calories":1163,"protein_g":63,"carbs_g":159,"fat_g":29,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Merienda energética","name_en":"Energy snack",
       "foods":[
         {"name_es":"Granola con yogur","name_en":"Granola with yogurt","quantity_g":80,"calories":357,"protein_g":9,"carbs_g":53,"fat_g":14},
         {"name_es":"Yogur griego","name_en":"Greek yogurt","quantity_g":150,"calories":130,"protein_g":17,"carbs_g":6,"fat_g":4},
         {"name_es":"Miel","name_en":"Honey","quantity_g":20,"calories":61,"protein_g":0,"carbs_g":17,"fat_g":0}
       ],"calories":548,"protein_g":26,"carbs_g":76,"fat_g":18,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Pasta de recuperación","name_en":"Recovery pasta",
       "foods":[
         {"name_es":"Pasta cocida","name_en":"Cooked pasta","quantity_g":350,"calories":483,"protein_g":17,"carbs_g":97,"fat_g":2},
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":180,"calories":336,"protein_g":36,"carbs_g":0,"fat_g":21},
         {"name_es":"Espárragos","name_en":"Asparagus","quantity_g":150,"calories":30,"protein_g":3,"carbs_g":6,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":937,"protein_g":56,"carbs_g":103,"fat_g":33,"notes_es":"","notes_en":""}
    ],"total_calories":4439,"total_protein_g":172,"total_carbs_g":750,"total_fat_g":87},
    {"day_number":4,"day_name":"Jueves / Thursday","meals":[
      {"slot":"breakfast","name_es":"Gran desayuno de carga","name_en":"Large carb-load breakfast",
       "foods":[
         {"name_es":"Avena con leche","name_en":"Oats with milk","quantity_g":150,"calories":555,"protein_g":20,"carbs_g":99,"fat_g":11},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":40,"calories":160,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Banana x2","name_en":"Banana x2","quantity_g":250,"calories":223,"protein_g":3,"carbs_g":57,"fat_g":0},
         {"name_es":"Miel","name_en":"Honey","quantity_g":25,"calories":77,"protein_g":0,"carbs_g":21,"fat_g":0}
       ],"calories":1015,"protein_g":55,"carbs_g":181,"fat_g":13,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Snack de media mañana","name_en":"Mid-morning snack",
       "foods":[
         {"name_es":"Pan con mermelada","name_en":"Bread with jam","quantity_g":100,"calories":343,"protein_g":8,"carbs_g":70,"fat_g":3},
         {"name_es":"Zumo de fruta","name_en":"Fruit juice","quantity_g":300,"calories":135,"protein_g":2,"carbs_g":31,"fat_g":0}
       ],"calories":478,"protein_g":10,"carbs_g":101,"fat_g":3,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Bowl de arroz, pollo y garbanzos","name_en":"Rice, chicken and chickpea bowl",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":400,"calories":520,"protein_g":10,"carbs_g":114,"fat_g":1},
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":250,"calories":275,"protein_g":52,"carbs_g":0,"fat_g":6},
         {"name_es":"Garbanzos cocidos","name_en":"Cooked chickpeas","quantity_g":150,"calories":246,"protein_g":13,"carbs_g":41,"fat_g":4},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":12,"calories":106,"protein_g":0,"carbs_g":0,"fat_g":12}
       ],"calories":1147,"protein_g":75,"carbs_g":155,"fat_g":23,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Batido calórico de masa y plátanos","name_en":"Mass calorie shake and bananas",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":50,"calories":200,"protein_g":40,"carbs_g":5,"fat_g":3},
         {"name_es":"Avena","name_en":"Oats","quantity_g":80,"calories":296,"protein_g":10,"carbs_g":53,"fat_g":5},
         {"name_es":"Leche entera","name_en":"Whole milk","quantity_g":400,"calories":248,"protein_g":13,"carbs_g":20,"fat_g":14},
         {"name_es":"Mantequilla de maní","name_en":"Peanut butter","quantity_g":30,"calories":177,"protein_g":7,"carbs_g":6,"fat_g":15}
       ],"calories":921,"protein_g":70,"carbs_g":84,"fat_g":37,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Cena completa de carbohidratos","name_en":"Full carbohydrate dinner",
       "foods":[
         {"name_es":"Pasta integral cocida","name_en":"Cooked whole wheat pasta","quantity_g":350,"calories":483,"protein_g":20,"carbs_g":97,"fat_g":2},
         {"name_es":"Atún en agua","name_en":"Canned tuna in water","quantity_g":200,"calories":232,"protein_g":52,"carbs_g":0,"fat_g":2},
         {"name_es":"Salsa de tomate","name_en":"Tomato sauce","quantity_g":150,"calories":53,"protein_g":2,"carbs_g":12,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":856,"protein_g":74,"carbs_g":109,"fat_g":14,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Caseína y arroz","name_en":"Casein and rice",
       "foods":[
         {"name_es":"Proteína caseína","name_en":"Casein protein","quantity_g":40,"calories":152,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":100,"calories":130,"protein_g":3,"carbs_g":29,"fat_g":0}
       ],"calories":282,"protein_g":35,"carbs_g":33,"fat_g":2,"notes_es":"","notes_en":""}
    ],"total_calories":4699,"total_protein_g":319,"total_carbs_g":663,"total_fat_g":92},
    {"day_number":5,"day_name":"Viernes / Friday","meals":[
      {"slot":"breakfast","name_es":"Smoothie bowl tropical calórico","name_en":"High-calorie tropical smoothie bowl",
       "foods":[
         {"name_es":"Banana x2","name_en":"Banana x2","quantity_g":250,"calories":223,"protein_g":3,"carbs_g":57,"fat_g":0},
         {"name_es":"Mango","name_en":"Mango","quantity_g":200,"calories":120,"protein_g":2,"carbs_g":30,"fat_g":0},
         {"name_es":"Granola","name_en":"Granola","quantity_g":100,"calories":447,"protein_g":11,"carbs_g":67,"fat_g":18},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":40,"calories":160,"protein_g":32,"carbs_g":4,"fat_g":2},
         {"name_es":"Coco rallado","name_en":"Shredded coconut","quantity_g":30,"calories":200,"protein_g":2,"carbs_g":7,"fat_g":18}
       ],"calories":1150,"protein_g":50,"carbs_g":165,"fat_g":38,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Pan de masa madre con plátano y miel","name_en":"Sourdough bread with banana and honey",
       "foods":[
         {"name_es":"Pan de masa madre","name_en":"Sourdough bread","quantity_g":150,"calories":388,"protein_g":14,"carbs_g":78,"fat_g":2},
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Miel","name_en":"Honey","quantity_g":20,"calories":61,"protein_g":0,"carbs_g":17,"fat_g":0}
       ],"calories":583,"protein_g":16,"carbs_g":129,"fat_g":2,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Gran bowl de sushi+","name_en":"Super sushi bowl+",
       "foods":[
         {"name_es":"Arroz de sushi cocido","name_en":"Cooked sushi rice","quantity_g":400,"calories":560,"protein_g":12,"carbs_g":124,"fat_g":1},
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":200,"calories":374,"protein_g":40,"carbs_g":0,"fat_g":23},
         {"name_es":"Aguacate","name_en":"Avocado","quantity_g":100,"calories":160,"protein_g":2,"carbs_g":9,"fat_g":15},
         {"name_es":"Edamame","name_en":"Edamame","quantity_g":100,"calories":121,"protein_g":12,"carbs_g":9,"fat_g":5}
       ],"calories":1215,"protein_g":66,"carbs_g":142,"fat_g":44,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Barrita y bebida energética","name_en":"Bar and energy drink",
       "foods":[
         {"name_es":"Barrita energética x2","name_en":"Energy bar x2","quantity_g":120,"calories":444,"protein_g":10,"carbs_g":74,"fat_g":14},
         {"name_es":"Bebida deportiva","name_en":"Sports drink","quantity_g":500,"calories":150,"protein_g":0,"carbs_g":38,"fat_g":0}
       ],"calories":594,"protein_g":10,"carbs_g":112,"fat_g":14,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Cena pre-competición","name_en":"Pre-competition dinner",
       "foods":[
         {"name_es":"Pasta blanca cocida","name_en":"Cooked white pasta","quantity_g":400,"calories":552,"protein_g":20,"carbs_g":111,"fat_g":2},
         {"name_es":"Pechuga de pollo","name_en":"Chicken breast","quantity_g":200,"calories":220,"protein_g":41,"carbs_g":0,"fat_g":5},
         {"name_es":"Salsa de tomate","name_en":"Tomato sauce","quantity_g":150,"calories":53,"protein_g":2,"carbs_g":12,"fat_g":0},
         {"name_es":"Pan","name_en":"Bread","quantity_g":80,"calories":212,"protein_g":8,"carbs_g":40,"fat_g":3},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":1125,"protein_g":71,"carbs_g":163,"fat_g":20,"notes_es":"Noche anterior a competición","notes_en":"Night before competition"},
      {"slot":"pre_sleep","name_es":"Arroz con leche dulce","name_en":"Sweet rice pudding",
       "foods":[
         {"name_es":"Arroz cocido","name_en":"Cooked rice","quantity_g":150,"calories":195,"protein_g":4,"carbs_g":43,"fat_g":0},
         {"name_es":"Leche","name_en":"Milk","quantity_g":200,"calories":124,"protein_g":8,"carbs_g":12,"fat_g":5},
         {"name_es":"Miel","name_en":"Honey","quantity_g":20,"calories":61,"protein_g":0,"carbs_g":17,"fat_g":0}
       ],"calories":380,"protein_g":12,"carbs_g":72,"fat_g":5,"notes_es":"","notes_en":""}
    ],"total_calories":5047,"total_protein_g":225,"total_carbs_g":783,"total_fat_g":123},
    {"day_number":6,"day_name":"Sábado / Saturday (Día de competición / Race day)","meals":[
      {"slot":"wake_up","name_es":"Desayuno de carrera (3h antes)","name_en":"Race breakfast (3h before)",
       "foods":[
         {"name_es":"Avena con plátano y miel","name_en":"Oats with banana and honey","quantity_g":100,"calories":370,"protein_g":13,"carbs_g":66,"fat_g":7},
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Miel","name_en":"Honey","quantity_g":20,"calories":61,"protein_g":0,"carbs_g":17,"fat_g":0},
         {"name_es":"Café","name_en":"Coffee","quantity_g":200,"calories":4,"protein_g":0,"carbs_g":0,"fat_g":0},
         {"name_es":"Pan tostado","name_en":"Toast","quantity_g":60,"calories":159,"protein_g":6,"carbs_g":30,"fat_g":2}
       ],"calories":728,"protein_g":21,"carbs_g":147,"fat_g":9,"notes_es":"3 horas antes de la salida","notes_en":"3 hours before start"},
      {"slot":"during_training","name_es":"Nutrición durante ironman/gran fondo","name_en":"Ironman/gran fondo nutrition",
       "foods":[
         {"name_es":"Geles x10","name_en":"Gels x10","quantity_g":320,"calories":1000,"protein_g":0,"carbs_g":250,"fat_g":0},
         {"name_es":"Bebida isotónica 4L","name_en":"Isotonic drink 4L","quantity_g":4000,"calories":800,"protein_g":0,"carbs_g":200,"fat_g":0},
         {"name_es":"Barrita de arroz x3","name_en":"Rice bar x3","quantity_g":150,"calories":450,"protein_g":9,"carbs_g":90,"fat_g":6},
         {"name_es":"Cola x2 (últimas horas)","name_en":"Cola x2 (last hours)","quantity_g":500,"calories":210,"protein_g":0,"carbs_g":52,"fat_g":0}
       ],"calories":2460,"protein_g":9,"carbs_g":592,"fat_g":6,"notes_es":"Distribuido durante toda la carrera","notes_en":"Distributed throughout the race"},
      {"slot":"post_training","name_es":"Recuperación inmediata post-carrera","name_en":"Immediate post-race recovery",
       "foods":[
         {"name_es":"Leche chocolatada","name_en":"Chocolate milk","quantity_g":600,"calories":462,"protein_g":24,"carbs_g":78,"fat_g":8},
         {"name_es":"Banana x2","name_en":"Banana x2","quantity_g":250,"calories":223,"protein_g":3,"carbs_g":57,"fat_g":0}
       ],"calories":685,"protein_g":27,"carbs_g":135,"fat_g":8,"notes_es":"Inmediatamente al finalizar","notes_en":"Immediately upon finishing"},
      {"slot":"dinner","name_es":"Cena de recuperación post-carrera","name_en":"Post-race recovery dinner",
       "foods":[
         {"name_es":"Pasta cocida","name_en":"Cooked pasta","quantity_g":300,"calories":414,"protein_g":15,"carbs_g":83,"fat_g":2},
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":200,"calories":374,"protein_g":40,"carbs_g":0,"fat_g":23},
         {"name_es":"Pan integral","name_en":"Whole grain bread","quantity_g":80,"calories":212,"protein_g":8,"carbs_g":40,"fat_g":3},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":1088,"protein_g":63,"carbs_g":123,"fat_g":38,"notes_es":"","notes_en":""}
    ],"total_calories":4961,"total_protein_g":120,"total_carbs_g":997,"total_fat_g":61},
    {"day_number":7,"day_name":"Domingo / Sunday (Recuperación activa / Active recovery)","meals":[
      {"slot":"breakfast","name_es":"Desayuno de recuperación activa","name_en":"Active recovery breakfast",
       "foods":[
         {"name_es":"Huevo entero","name_en":"Whole egg","quantity_g":165,"calories":234,"protein_g":19,"carbs_g":1,"fat_g":16},
         {"name_es":"Avena","name_en":"Oats","quantity_g":100,"calories":370,"protein_g":13,"carbs_g":66,"fat_g":7},
         {"name_es":"Banana","name_en":"Banana","quantity_g":150,"calories":134,"protein_g":2,"carbs_g":34,"fat_g":0},
         {"name_es":"Leche","name_en":"Milk","quantity_g":300,"calories":186,"protein_g":12,"carbs_g":18,"fat_g":7}
       ],"calories":924,"protein_g":46,"carbs_g":119,"fat_g":30,"notes_es":"","notes_en":""},
      {"slot":"mid_morning","name_es":"Smoothie anti-inflamatorio","name_en":"Anti-inflammatory smoothie",
       "foods":[
         {"name_es":"Frutos del bosque","name_en":"Mixed berries","quantity_g":200,"calories":88,"protein_g":2,"carbs_g":21,"fat_g":0},
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":35,"calories":140,"protein_g":28,"carbs_g":3,"fat_g":2},
         {"name_es":"Jengibre","name_en":"Ginger","quantity_g":10,"calories":8,"protein_g":0,"carbs_g":2,"fat_g":0},
         {"name_es":"Leche de almendras","name_en":"Almond milk","quantity_g":300,"calories":45,"protein_g":1,"carbs_g":2,"fat_g":3}
       ],"calories":281,"protein_g":31,"carbs_g":28,"fat_g":5,"notes_es":"","notes_en":""},
      {"slot":"lunch","name_es":"Arroz con salmón y vegetales ricos en antioxidantes","name_en":"Rice with salmon and antioxidant-rich vegetables",
       "foods":[
         {"name_es":"Arroz blanco cocido","name_en":"Cooked white rice","quantity_g":350,"calories":455,"protein_g":8,"carbs_g":100,"fat_g":1},
         {"name_es":"Salmón","name_en":"Salmon","quantity_g":250,"calories":467,"protein_g":50,"carbs_g":0,"fat_g":29},
         {"name_es":"Espinaca","name_en":"Spinach","quantity_g":150,"calories":35,"protein_g":4,"carbs_g":6,"fat_g":0},
         {"name_es":"Tomate cherry","name_en":"Cherry tomatoes","quantity_g":100,"calories":18,"protein_g":1,"carbs_g":4,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":15,"calories":133,"protein_g":0,"carbs_g":0,"fat_g":15}
       ],"calories":1108,"protein_g":63,"carbs_g":110,"fat_g":45,"notes_es":"","notes_en":""},
      {"slot":"afternoon_snack","name_es":"Batido de recuperación muscular","name_en":"Muscle recovery shake",
       "foods":[
         {"name_es":"Proteína en polvo","name_en":"Protein powder","quantity_g":50,"calories":200,"protein_g":40,"carbs_g":5,"fat_g":3},
         {"name_es":"Leche entera","name_en":"Whole milk","quantity_g":400,"calories":248,"protein_g":13,"carbs_g":20,"fat_g":14},
         {"name_es":"Banana","name_en":"Banana","quantity_g":120,"calories":107,"protein_g":1,"carbs_g":27,"fat_g":0}
       ],"calories":555,"protein_g":54,"carbs_g":52,"fat_g":17,"notes_es":"","notes_en":""},
      {"slot":"dinner","name_es":"Cena ligera de recuperación","name_en":"Light recovery dinner",
       "foods":[
         {"name_es":"Pasta integral cocida","name_en":"Cooked whole wheat pasta","quantity_g":250,"calories":345,"protein_g":14,"carbs_g":69,"fat_g":2},
         {"name_es":"Pollo asado","name_en":"Roast chicken","quantity_g":200,"calories":296,"protein_g":44,"carbs_g":0,"fat_g":13},
         {"name_es":"Brócoli y zanahoria","name_en":"Broccoli and carrot","quantity_g":200,"calories":70,"protein_g":4,"carbs_g":15,"fat_g":0},
         {"name_es":"Aceite de oliva","name_en":"Olive oil","quantity_g":10,"calories":88,"protein_g":0,"carbs_g":0,"fat_g":10}
       ],"calories":799,"protein_g":62,"carbs_g":84,"fat_g":25,"notes_es":"","notes_en":""},
      {"slot":"pre_sleep","name_es":"Caseína de recuperación","name_en":"Recovery casein",
       "foods":[
         {"name_es":"Proteína caseína","name_en":"Casein protein","quantity_g":50,"calories":190,"protein_g":40,"carbs_g":5,"fat_g":2}
       ],"calories":190,"protein_g":40,"carbs_g":5,"fat_g":2,"notes_es":"","notes_en":""}
    ],"total_calories":3857,"total_protein_g":296,"total_carbs_g":398,"total_fat_g":124}
  ]'::jsonb
);
