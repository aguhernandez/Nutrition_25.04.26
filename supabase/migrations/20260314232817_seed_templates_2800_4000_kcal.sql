/*
  # Seed Meal Plan Templates: 2800 kcal and 4000 kcal

  ## Summary
  Adds two missing calorie-level templates to complete the full range:
  - 2800 kcal Balanced (omnivore) - 180g P, 320g C, 80g F
  - 4000 kcal Endurance High Carb (omnivore) - 180g P, 560g C, 100g F

  Both include full 7-day meal plans with bilingual food names (ES/EN),
  appropriate meal slots, and realistic macro distributions.
*/

INSERT INTO meal_plan_templates (
  name, name_es, name_en,
  description_es, description_en,
  calories_target, focus, dietary_pattern,
  protein_g, carbs_g, fat_g, fiber_g,
  days, tags, suitable_for, is_active
) VALUES
(
  '2800 kcal - Balanceado / Balanced',
  '2800 kcal - Balanceado',
  '2800 kcal - Balanced',
  'Plan balanceado de 2800 kcal ideal para atletas de entrenamiento moderado-alto con buen balance de macronutrientes.',
  'Balanced 2800 kcal plan ideal for moderate-to-high training athletes with well-distributed macronutrients.',
  2800, 'balanced', 'omnivore',
  180, 320, 80, 38,
  '[
    {
      "day_number": 1, "day_name": "Lunes / Monday",
      "meals": [
        {"slot": "breakfast", "name_es": "Avena con frutos rojos, huevos y tostada", "name_en": "Oats with berries, eggs and toast",
         "foods": [
           {"name_es": "Avena", "name_en": "Oats", "quantity_g": 80, "calories": 296, "protein_g": 10, "carbs_g": 53, "fat_g": 5},
           {"name_es": "Arándanos", "name_en": "Blueberries", "quantity_g": 80, "calories": 46, "protein_g": 1, "carbs_g": 11, "fat_g": 0},
           {"name_es": "Huevos enteros", "name_en": "Whole eggs", "quantity_g": 120, "calories": 172, "protein_g": 15, "carbs_g": 1, "fat_g": 12},
           {"name_es": "Pan integral", "name_en": "Whole grain bread", "quantity_g": 60, "calories": 159, "protein_g": 6, "carbs_g": 30, "fat_g": 2}
         ],
         "calories": 673, "protein_g": 32, "carbs_g": 95, "fat_g": 19, "notes_es": "", "notes_en": ""},
        {"slot": "mid_morning", "name_es": "Yogur griego con granola", "name_en": "Greek yogurt with granola",
         "foods": [
           {"name_es": "Yogur griego", "name_en": "Greek yogurt", "quantity_g": 200, "calories": 130, "protein_g": 17, "carbs_g": 9, "fat_g": 3},
           {"name_es": "Granola", "name_en": "Granola", "quantity_g": 40, "calories": 180, "protein_g": 4, "carbs_g": 28, "fat_g": 6}
         ],
         "calories": 310, "protein_g": 21, "carbs_g": 37, "fat_g": 9, "notes_es": "", "notes_en": ""},
        {"slot": "lunch", "name_es": "Pollo a la plancha con arroz y ensalada", "name_en": "Grilled chicken with rice and salad",
         "foods": [
           {"name_es": "Pechuga de pollo", "name_en": "Chicken breast", "quantity_g": 180, "calories": 297, "protein_g": 56, "carbs_g": 0, "fat_g": 6},
           {"name_es": "Arroz blanco cocido", "name_en": "Cooked white rice", "quantity_g": 250, "calories": 325, "protein_g": 6, "carbs_g": 72, "fat_g": 1},
           {"name_es": "Ensalada mixta", "name_en": "Mixed salad", "quantity_g": 150, "calories": 35, "protein_g": 2, "carbs_g": 6, "fat_g": 1},
           {"name_es": "Aceite de oliva", "name_en": "Olive oil", "quantity_g": 10, "calories": 88, "protein_g": 0, "carbs_g": 0, "fat_g": 10}
         ],
         "calories": 745, "protein_g": 64, "carbs_g": 78, "fat_g": 18, "notes_es": "", "notes_en": ""},
        {"slot": "pre_training", "name_es": "Banana y tostada con mantequilla de maní", "name_en": "Banana and toast with peanut butter",
         "foods": [
           {"name_es": "Banana", "name_en": "Banana", "quantity_g": 120, "calories": 107, "protein_g": 1, "carbs_g": 27, "fat_g": 0},
           {"name_es": "Pan integral", "name_en": "Whole grain bread", "quantity_g": 40, "calories": 106, "protein_g": 4, "carbs_g": 20, "fat_g": 1},
           {"name_es": "Mantequilla de maní", "name_en": "Peanut butter", "quantity_g": 15, "calories": 90, "protein_g": 4, "carbs_g": 3, "fat_g": 8}
         ],
         "calories": 303, "protein_g": 9, "carbs_g": 50, "fat_g": 9, "notes_es": "30-45 min antes / 30-45 min before", "notes_en": "30-45 min before training"},
        {"slot": "post_training", "name_es": "Batido de proteína con leche y banana", "name_en": "Protein shake with milk and banana",
         "foods": [
           {"name_es": "Proteína whey", "name_en": "Whey protein", "quantity_g": 40, "calories": 156, "protein_g": 32, "carbs_g": 4, "fat_g": 2},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 200, "calories": 130, "protein_g": 7, "carbs_g": 10, "fat_g": 7},
           {"name_es": "Banana", "name_en": "Banana", "quantity_g": 80, "calories": 71, "protein_g": 1, "carbs_g": 18, "fat_g": 0}
         ],
         "calories": 357, "protein_g": 40, "carbs_g": 32, "fat_g": 9, "notes_es": "", "notes_en": ""},
        {"slot": "dinner", "name_es": "Salmón con batata y brócoli", "name_en": "Salmon with sweet potato and broccoli",
         "foods": [
           {"name_es": "Salmón", "name_en": "Salmon", "quantity_g": 180, "calories": 374, "protein_g": 36, "carbs_g": 0, "fat_g": 25},
           {"name_es": "Batata / Camote", "name_en": "Sweet potato", "quantity_g": 200, "calories": 172, "protein_g": 3, "carbs_g": 40, "fat_g": 0},
           {"name_es": "Brócoli cocido", "name_en": "Cooked broccoli", "quantity_g": 150, "calories": 51, "protein_g": 4, "carbs_g": 9, "fat_g": 1}
         ],
         "calories": 597, "protein_g": 43, "carbs_g": 49, "fat_g": 26, "notes_es": "", "notes_en": ""}
      ],
      "total_calories": 2985, "total_protein_g": 209, "total_carbs_g": 341, "total_fat_g": 90
    },
    {
      "day_number": 2, "day_name": "Martes / Tuesday",
      "meals": [
        {"slot": "breakfast", "name_es": "Tostadas con huevo, aguacate y jugo de naranja", "name_en": "Toast with egg, avocado and orange juice",
         "foods": [
           {"name_es": "Pan integral", "name_en": "Whole grain bread", "quantity_g": 80, "calories": 212, "protein_g": 8, "carbs_g": 40, "fat_g": 3},
           {"name_es": "Huevos revueltos", "name_en": "Scrambled eggs", "quantity_g": 120, "calories": 172, "protein_g": 15, "carbs_g": 1, "fat_g": 12},
           {"name_es": "Aguacate", "name_en": "Avocado", "quantity_g": 60, "calories": 96, "protein_g": 1, "carbs_g": 5, "fat_g": 9},
           {"name_es": "Jugo de naranja", "name_en": "Orange juice", "quantity_g": 200, "calories": 88, "protein_g": 1, "carbs_g": 21, "fat_g": 0}
         ],
         "calories": 568, "protein_g": 25, "carbs_g": 67, "fat_g": 24, "notes_es": "", "notes_en": ""},
        {"slot": "mid_morning", "name_es": "Frutas y nueces mixtas", "name_en": "Mixed fruits and nuts",
         "foods": [
           {"name_es": "Manzana", "name_en": "Apple", "quantity_g": 150, "calories": 78, "protein_g": 0, "carbs_g": 21, "fat_g": 0},
           {"name_es": "Nueces mixtas", "name_en": "Mixed nuts", "quantity_g": 30, "calories": 186, "protein_g": 5, "carbs_g": 6, "fat_g": 16}
         ],
         "calories": 264, "protein_g": 5, "carbs_g": 27, "fat_g": 16, "notes_es": "", "notes_en": ""},
        {"slot": "lunch", "name_es": "Carne molida con pasta y tomate", "name_en": "Ground beef with pasta and tomato",
         "foods": [
           {"name_es": "Carne molida magra", "name_en": "Lean ground beef", "quantity_g": 150, "calories": 225, "protein_g": 31, "carbs_g": 0, "fat_g": 11},
           {"name_es": "Pasta cocida", "name_en": "Cooked pasta", "quantity_g": 250, "calories": 390, "protein_g": 13, "carbs_g": 79, "fat_g": 2},
           {"name_es": "Salsa de tomate", "name_en": "Tomato sauce", "quantity_g": 100, "calories": 35, "protein_g": 1, "carbs_g": 8, "fat_g": 0},
           {"name_es": "Queso parmesano", "name_en": "Parmesan cheese", "quantity_g": 20, "calories": 83, "protein_g": 7, "carbs_g": 1, "fat_g": 6}
         ],
         "calories": 733, "protein_g": 52, "carbs_g": 88, "fat_g": 19, "notes_es": "", "notes_en": ""},
        {"slot": "afternoon_snack", "name_es": "Requesón con piña", "name_en": "Cottage cheese with pineapple",
         "foods": [
           {"name_es": "Requesón / Cottage cheese", "name_en": "Cottage cheese", "quantity_g": 200, "calories": 180, "protein_g": 22, "carbs_g": 8, "fat_g": 6},
           {"name_es": "Piña fresca", "name_en": "Fresh pineapple", "quantity_g": 100, "calories": 50, "protein_g": 1, "carbs_g": 13, "fat_g": 0}
         ],
         "calories": 230, "protein_g": 23, "carbs_g": 21, "fat_g": 6, "notes_es": "", "notes_en": ""},
        {"slot": "dinner", "name_es": "Pollo al horno con quinoa y vegetales asados", "name_en": "Baked chicken with quinoa and roasted vegetables",
         "foods": [
           {"name_es": "Pechuga de pollo al horno", "name_en": "Baked chicken breast", "quantity_g": 200, "calories": 330, "protein_g": 62, "carbs_g": 0, "fat_g": 7},
           {"name_es": "Quinoa cocida", "name_en": "Cooked quinoa", "quantity_g": 180, "calories": 222, "protein_g": 8, "carbs_g": 40, "fat_g": 4},
           {"name_es": "Vegetales asados", "name_en": "Roasted vegetables", "quantity_g": 200, "calories": 80, "protein_g": 3, "carbs_g": 14, "fat_g": 2}
         ],
         "calories": 632, "protein_g": 73, "carbs_g": 54, "fat_g": 13, "notes_es": "", "notes_en": ""}
      ],
      "total_calories": 2427, "total_protein_g": 178, "total_carbs_g": 257, "total_fat_g": 78
    },
    {
      "day_number": 3, "day_name": "Miércoles / Wednesday",
      "meals": [
        {"slot": "breakfast", "name_es": "Batido de proteína con avena y fruta", "name_en": "Protein smoothie with oats and fruit",
         "foods": [
           {"name_es": "Proteína whey", "name_en": "Whey protein", "quantity_g": 35, "calories": 136, "protein_g": 28, "carbs_g": 3, "fat_g": 2},
           {"name_es": "Avena", "name_en": "Oats", "quantity_g": 60, "calories": 222, "protein_g": 7, "carbs_g": 40, "fat_g": 4},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 300, "calories": 195, "protein_g": 10, "carbs_g": 15, "fat_g": 11},
           {"name_es": "Frutillas / Fresas", "name_en": "Strawberries", "quantity_g": 100, "calories": 32, "protein_g": 1, "carbs_g": 8, "fat_g": 0}
         ],
         "calories": 585, "protein_g": 46, "carbs_g": 66, "fat_g": 17, "notes_es": "", "notes_en": ""},
        {"slot": "lunch", "name_es": "Atún con arroz integral, legumbres y aguacate", "name_en": "Tuna with brown rice, legumes and avocado",
         "foods": [
           {"name_es": "Atún en agua", "name_en": "Canned tuna in water", "quantity_g": 160, "calories": 176, "protein_g": 38, "carbs_g": 0, "fat_g": 2},
           {"name_es": "Arroz integral cocido", "name_en": "Cooked brown rice", "quantity_g": 200, "calories": 260, "protein_g": 5, "carbs_g": 55, "fat_g": 2},
           {"name_es": "Lentejas cocidas", "name_en": "Cooked lentils", "quantity_g": 150, "calories": 175, "protein_g": 13, "carbs_g": 30, "fat_g": 1},
           {"name_es": "Aguacate", "name_en": "Avocado", "quantity_g": 80, "calories": 128, "protein_g": 2, "carbs_g": 7, "fat_g": 12}
         ],
         "calories": 739, "protein_g": 58, "carbs_g": 92, "fat_g": 17, "notes_es": "", "notes_en": ""},
        {"slot": "mid_morning", "name_es": "Arroz con leche y canela", "name_en": "Rice pudding with cinnamon",
         "foods": [
           {"name_es": "Arroz con leche", "name_en": "Rice pudding", "quantity_g": 200, "calories": 280, "protein_g": 8, "carbs_g": 48, "fat_g": 7}
         ],
         "calories": 280, "protein_g": 8, "carbs_g": 48, "fat_g": 7, "notes_es": "", "notes_en": ""},
        {"slot": "pre_training", "name_es": "Banana y miel", "name_en": "Banana and honey",
         "foods": [
           {"name_es": "Banana grande", "name_en": "Large banana", "quantity_g": 130, "calories": 116, "protein_g": 1, "carbs_g": 30, "fat_g": 0},
           {"name_es": "Miel", "name_en": "Honey", "quantity_g": 20, "calories": 61, "protein_g": 0, "carbs_g": 17, "fat_g": 0}
         ],
         "calories": 177, "protein_g": 1, "carbs_g": 47, "fat_g": 0, "notes_es": "20-30 min antes / 20-30 min before", "notes_en": "20-30 min before"},
        {"slot": "dinner", "name_es": "Cerdo magro con papa y espinaca", "name_en": "Lean pork with potato and spinach",
         "foods": [
           {"name_es": "Lomo de cerdo", "name_en": "Pork loin", "quantity_g": 180, "calories": 270, "protein_g": 43, "carbs_g": 0, "fat_g": 10},
           {"name_es": "Papa / Patata hervida", "name_en": "Boiled potato", "quantity_g": 250, "calories": 193, "protein_g": 5, "carbs_g": 44, "fat_g": 0},
           {"name_es": "Espinaca salteada", "name_en": "Sautéed spinach", "quantity_g": 150, "calories": 55, "protein_g": 5, "carbs_g": 5, "fat_g": 3}
         ],
         "calories": 518, "protein_g": 53, "carbs_g": 49, "fat_g": 13, "notes_es": "", "notes_en": ""}
      ],
      "total_calories": 2299, "total_protein_g": 166, "total_carbs_g": 302, "total_fat_g": 54
    },
    {
      "day_number": 4, "day_name": "Jueves / Thursday",
      "meals": [
        {"slot": "breakfast", "name_es": "Pancakes de avena con arándanos y miel", "name_en": "Oat pancakes with blueberries and honey",
         "foods": [
           {"name_es": "Harina de avena", "name_en": "Oat flour", "quantity_g": 100, "calories": 370, "protein_g": 13, "carbs_g": 66, "fat_g": 7},
           {"name_es": "Huevo entero", "name_en": "Whole egg", "quantity_g": 60, "calories": 86, "protein_g": 7, "carbs_g": 1, "fat_g": 6},
           {"name_es": "Arándanos", "name_en": "Blueberries", "quantity_g": 80, "calories": 46, "protein_g": 1, "carbs_g": 11, "fat_g": 0},
           {"name_es": "Miel", "name_en": "Honey", "quantity_g": 20, "calories": 61, "protein_g": 0, "carbs_g": 17, "fat_g": 0}
         ],
         "calories": 563, "protein_g": 21, "carbs_g": 95, "fat_g": 13, "notes_es": "", "notes_en": ""},
        {"slot": "mid_morning", "name_es": "Batido de proteína con leche", "name_en": "Protein shake with milk",
         "foods": [
           {"name_es": "Proteína whey", "name_en": "Whey protein", "quantity_g": 35, "calories": 136, "protein_g": 28, "carbs_g": 3, "fat_g": 2},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 250, "calories": 163, "protein_g": 9, "carbs_g": 12, "fat_g": 9}
         ],
         "calories": 299, "protein_g": 37, "carbs_g": 15, "fat_g": 11, "notes_es": "", "notes_en": ""},
        {"slot": "lunch", "name_es": "Pollo con cuscús y garbanzos", "name_en": "Chicken with couscous and chickpeas",
         "foods": [
           {"name_es": "Pechuga de pollo", "name_en": "Chicken breast", "quantity_g": 180, "calories": 297, "protein_g": 56, "carbs_g": 0, "fat_g": 6},
           {"name_es": "Cuscús cocido", "name_en": "Cooked couscous", "quantity_g": 180, "calories": 248, "protein_g": 8, "carbs_g": 51, "fat_g": 0},
           {"name_es": "Garbanzos cocidos", "name_en": "Cooked chickpeas", "quantity_g": 100, "calories": 164, "protein_g": 9, "carbs_g": 27, "fat_g": 3}
         ],
         "calories": 709, "protein_g": 73, "carbs_g": 78, "fat_g": 9, "notes_es": "", "notes_en": ""},
        {"slot": "afternoon_snack", "name_es": "Tostada con queso fresco y tomate", "name_en": "Toast with fresh cheese and tomato",
         "foods": [
           {"name_es": "Pan integral", "name_en": "Whole grain bread", "quantity_g": 60, "calories": 159, "protein_g": 6, "carbs_g": 30, "fat_g": 2},
           {"name_es": "Queso fresco / Ricotta", "name_en": "Fresh cheese / Ricotta", "quantity_g": 60, "calories": 100, "protein_g": 7, "carbs_g": 3, "fat_g": 7},
           {"name_es": "Tomate", "name_en": "Tomato", "quantity_g": 100, "calories": 18, "protein_g": 1, "carbs_g": 4, "fat_g": 0}
         ],
         "calories": 277, "protein_g": 14, "carbs_g": 37, "fat_g": 9, "notes_es": "", "notes_en": ""},
        {"slot": "dinner", "name_es": "Merluza al horno con arroz y verduras", "name_en": "Baked hake with rice and vegetables",
         "foods": [
           {"name_es": "Merluza / Pescado blanco", "name_en": "Hake / White fish", "quantity_g": 220, "calories": 198, "protein_g": 42, "carbs_g": 0, "fat_g": 3},
           {"name_es": "Arroz blanco cocido", "name_en": "Cooked white rice", "quantity_g": 200, "calories": 260, "protein_g": 5, "carbs_g": 57, "fat_g": 0},
           {"name_es": "Verduras salteadas", "name_en": "Sautéed vegetables", "quantity_g": 150, "calories": 60, "protein_g": 2, "carbs_g": 10, "fat_g": 2}
         ],
         "calories": 518, "protein_g": 49, "carbs_g": 67, "fat_g": 5, "notes_es": "", "notes_en": ""}
      ],
      "total_calories": 2366, "total_protein_g": 194, "total_carbs_g": 292, "total_fat_g": 47
    },
    {
      "day_number": 5, "day_name": "Viernes / Friday",
      "meals": [
        {"slot": "breakfast", "name_es": "Huevos con jamón, tostada y fruta", "name_en": "Eggs with ham, toast and fruit",
         "foods": [
           {"name_es": "Huevos revueltos", "name_en": "Scrambled eggs", "quantity_g": 180, "calories": 259, "protein_g": 22, "carbs_g": 2, "fat_g": 18},
           {"name_es": "Jamón cocido", "name_en": "Cooked ham", "quantity_g": 60, "calories": 78, "protein_g": 11, "carbs_g": 1, "fat_g": 3},
           {"name_es": "Pan integral", "name_en": "Whole grain bread", "quantity_g": 60, "calories": 159, "protein_g": 6, "carbs_g": 30, "fat_g": 2},
           {"name_es": "Naranja", "name_en": "Orange", "quantity_g": 150, "calories": 70, "protein_g": 1, "carbs_g": 18, "fat_g": 0}
         ],
         "calories": 566, "protein_g": 40, "carbs_g": 51, "fat_g": 23, "notes_es": "", "notes_en": ""},
        {"slot": "mid_morning", "name_es": "Kéfir con semillas de chía", "name_en": "Kefir with chia seeds",
         "foods": [
           {"name_es": "Kéfir", "name_en": "Kefir", "quantity_g": 250, "calories": 150, "protein_g": 10, "carbs_g": 12, "fat_g": 6},
           {"name_es": "Semillas de chía", "name_en": "Chia seeds", "quantity_g": 20, "calories": 97, "protein_g": 3, "carbs_g": 8, "fat_g": 6}
         ],
         "calories": 247, "protein_g": 13, "carbs_g": 20, "fat_g": 12, "notes_es": "", "notes_en": ""},
        {"slot": "lunch", "name_es": "Ternera con papa, ensalada y aceite de oliva", "name_en": "Beef with potato, salad and olive oil",
         "foods": [
           {"name_es": "Filete de ternera", "name_en": "Beef steak", "quantity_g": 180, "calories": 306, "protein_g": 45, "carbs_g": 0, "fat_g": 13},
           {"name_es": "Papa / Patata hervida", "name_en": "Boiled potato", "quantity_g": 250, "calories": 193, "protein_g": 5, "carbs_g": 44, "fat_g": 0},
           {"name_es": "Ensalada verde", "name_en": "Green salad", "quantity_g": 100, "calories": 20, "protein_g": 1, "carbs_g": 4, "fat_g": 0},
           {"name_es": "Aceite de oliva", "name_en": "Olive oil", "quantity_g": 15, "calories": 133, "protein_g": 0, "carbs_g": 0, "fat_g": 15}
         ],
         "calories": 652, "protein_g": 51, "carbs_g": 48, "fat_g": 28, "notes_es": "", "notes_en": ""},
        {"slot": "post_training", "name_es": "Batido de recuperación", "name_en": "Recovery shake",
         "foods": [
           {"name_es": "Proteína whey", "name_en": "Whey protein", "quantity_g": 40, "calories": 156, "protein_g": 32, "carbs_g": 4, "fat_g": 2},
           {"name_es": "Banana", "name_en": "Banana", "quantity_g": 100, "calories": 89, "protein_g": 1, "carbs_g": 23, "fat_g": 0},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 200, "calories": 130, "protein_g": 7, "carbs_g": 10, "fat_g": 7}
         ],
         "calories": 375, "protein_g": 40, "carbs_g": 37, "fat_g": 9, "notes_es": "", "notes_en": ""},
        {"slot": "dinner", "name_es": "Salmón con pasta y espárragos", "name_en": "Salmon with pasta and asparagus",
         "foods": [
           {"name_es": "Salmón", "name_en": "Salmon", "quantity_g": 150, "calories": 311, "protein_g": 30, "carbs_g": 0, "fat_g": 21},
           {"name_es": "Pasta cocida", "name_en": "Cooked pasta", "quantity_g": 200, "calories": 312, "protein_g": 11, "carbs_g": 63, "fat_g": 2},
           {"name_es": "Espárragos", "name_en": "Asparagus", "quantity_g": 100, "calories": 22, "protein_g": 2, "carbs_g": 4, "fat_g": 0}
         ],
         "calories": 645, "protein_g": 43, "carbs_g": 67, "fat_g": 23, "notes_es": "", "notes_en": ""}
      ],
      "total_calories": 2485, "total_protein_g": 187, "total_carbs_g": 223, "total_fat_g": 95
    },
    {
      "day_number": 6, "day_name": "Sábado / Saturday",
      "meals": [
        {"slot": "breakfast", "name_es": "Desayuno completo: omelette, avocado y tostada", "name_en": "Full breakfast: omelette, avocado and toast",
         "foods": [
           {"name_es": "Omelette de 3 huevos", "name_en": "3-egg omelette", "quantity_g": 180, "calories": 259, "protein_g": 22, "carbs_g": 2, "fat_g": 18},
           {"name_es": "Aguacate", "name_en": "Avocado", "quantity_g": 80, "calories": 128, "protein_g": 2, "carbs_g": 7, "fat_g": 12},
           {"name_es": "Pan integral", "name_en": "Whole grain bread", "quantity_g": 80, "calories": 212, "protein_g": 8, "carbs_g": 40, "fat_g": 3}
         ],
         "calories": 599, "protein_g": 32, "carbs_g": 49, "fat_g": 33, "notes_es": "", "notes_en": ""},
        {"slot": "mid_morning", "name_es": "Yogur con nueces y miel", "name_en": "Yogurt with nuts and honey",
         "foods": [
           {"name_es": "Yogur griego", "name_en": "Greek yogurt", "quantity_g": 200, "calories": 130, "protein_g": 17, "carbs_g": 9, "fat_g": 3},
           {"name_es": "Nueces", "name_en": "Walnuts", "quantity_g": 20, "calories": 131, "protein_g": 3, "carbs_g": 3, "fat_g": 13},
           {"name_es": "Miel", "name_en": "Honey", "quantity_g": 15, "calories": 46, "protein_g": 0, "carbs_g": 12, "fat_g": 0}
         ],
         "calories": 307, "protein_g": 20, "carbs_g": 24, "fat_g": 16, "notes_es": "", "notes_en": ""},
        {"slot": "lunch", "name_es": "Pollo al curry con arroz basmati", "name_en": "Chicken curry with basmati rice",
         "foods": [
           {"name_es": "Pollo en cubos", "name_en": "Diced chicken", "quantity_g": 200, "calories": 330, "protein_g": 62, "carbs_g": 0, "fat_g": 7},
           {"name_es": "Arroz basmati cocido", "name_en": "Cooked basmati rice", "quantity_g": 250, "calories": 325, "protein_g": 7, "carbs_g": 73, "fat_g": 0},
           {"name_es": "Leche de coco (ligera)", "name_en": "Coconut milk (light)", "quantity_g": 100, "calories": 60, "protein_g": 1, "carbs_g": 8, "fat_g": 3}
         ],
         "calories": 715, "protein_g": 70, "carbs_g": 81, "fat_g": 10, "notes_es": "", "notes_en": ""},
        {"slot": "afternoon_snack", "name_es": "Batido de proteína con fresas", "name_en": "Protein shake with strawberries",
         "foods": [
           {"name_es": "Proteína whey", "name_en": "Whey protein", "quantity_g": 35, "calories": 136, "protein_g": 28, "carbs_g": 3, "fat_g": 2},
           {"name_es": "Frutillas / Fresas", "name_en": "Strawberries", "quantity_g": 150, "calories": 48, "protein_g": 1, "carbs_g": 12, "fat_g": 0},
           {"name_es": "Agua", "name_en": "Water", "quantity_g": 250, "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}
         ],
         "calories": 184, "protein_g": 29, "carbs_g": 15, "fat_g": 2, "notes_es": "", "notes_en": ""},
        {"slot": "dinner", "name_es": "Langostinos salteados con pasta y vegetales", "name_en": "Sautéed prawns with pasta and vegetables",
         "foods": [
           {"name_es": "Langostinos / Camarones", "name_en": "Prawns / Shrimp", "quantity_g": 200, "calories": 212, "protein_g": 44, "carbs_g": 2, "fat_g": 2},
           {"name_es": "Pasta cocida", "name_en": "Cooked pasta", "quantity_g": 200, "calories": 312, "protein_g": 11, "carbs_g": 63, "fat_g": 2},
           {"name_es": "Aceite de oliva", "name_en": "Olive oil", "quantity_g": 10, "calories": 88, "protein_g": 0, "carbs_g": 0, "fat_g": 10}
         ],
         "calories": 612, "protein_g": 55, "carbs_g": 65, "fat_g": 14, "notes_es": "", "notes_en": ""}
      ],
      "total_calories": 2417, "total_protein_g": 206, "total_carbs_g": 234, "total_fat_g": 75
    },
    {
      "day_number": 7, "day_name": "Domingo / Sunday",
      "meals": [
        {"slot": "breakfast", "name_es": "Desayuno de recuperación: avena, fruta y proteína", "name_en": "Recovery breakfast: oats, fruit and protein",
         "foods": [
           {"name_es": "Avena", "name_en": "Oats", "quantity_g": 80, "calories": 296, "protein_g": 10, "carbs_g": 53, "fat_g": 5},
           {"name_es": "Banana", "name_en": "Banana", "quantity_g": 100, "calories": 89, "protein_g": 1, "carbs_g": 23, "fat_g": 0},
           {"name_es": "Proteína whey", "name_en": "Whey protein", "quantity_g": 30, "calories": 117, "protein_g": 24, "carbs_g": 3, "fat_g": 1},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 200, "calories": 130, "protein_g": 7, "carbs_g": 10, "fat_g": 7}
         ],
         "calories": 632, "protein_g": 42, "carbs_g": 89, "fat_g": 13, "notes_es": "", "notes_en": ""},
        {"slot": "lunch", "name_es": "Asado de pollo con papa asada y ensalada", "name_en": "Roast chicken with baked potato and salad",
         "foods": [
           {"name_es": "Pollo entero asado (pechuga+muslo)", "name_en": "Roast chicken (breast+thigh)", "quantity_g": 250, "calories": 463, "protein_g": 65, "carbs_g": 0, "fat_g": 21},
           {"name_es": "Papa asada", "name_en": "Baked potato", "quantity_g": 250, "calories": 218, "protein_g": 5, "carbs_g": 50, "fat_g": 0},
           {"name_es": "Ensalada griega", "name_en": "Greek salad", "quantity_g": 200, "calories": 160, "protein_g": 5, "carbs_g": 10, "fat_g": 12}
         ],
         "calories": 841, "protein_g": 75, "carbs_g": 60, "fat_g": 33, "notes_es": "", "notes_en": ""},
        {"slot": "afternoon_snack", "name_es": "Fruta fresca y almendras", "name_en": "Fresh fruit and almonds",
         "foods": [
           {"name_es": "Mango", "name_en": "Mango", "quantity_g": 150, "calories": 99, "protein_g": 1, "carbs_g": 25, "fat_g": 1},
           {"name_es": "Almendras", "name_en": "Almonds", "quantity_g": 25, "calories": 145, "protein_g": 5, "carbs_g": 5, "fat_g": 13}
         ],
         "calories": 244, "protein_g": 6, "carbs_g": 30, "fat_g": 14, "notes_es": "", "notes_en": ""},
        {"slot": "dinner", "name_es": "Cena familiar: pasta con boloñesa de pavo", "name_en": "Family dinner: pasta with turkey bolognese",
         "foods": [
           {"name_es": "Pechuga de pavo molida", "name_en": "Ground turkey breast", "quantity_g": 180, "calories": 270, "protein_g": 45, "carbs_g": 0, "fat_g": 9},
           {"name_es": "Pasta cocida", "name_en": "Cooked pasta", "quantity_g": 250, "calories": 390, "protein_g": 13, "carbs_g": 79, "fat_g": 2},
           {"name_es": "Salsa de tomate casera", "name_en": "Homemade tomato sauce", "quantity_g": 100, "calories": 35, "protein_g": 1, "carbs_g": 8, "fat_g": 0},
           {"name_es": "Queso rallado", "name_en": "Grated cheese", "quantity_g": 20, "calories": 80, "protein_g": 5, "carbs_g": 1, "fat_g": 6}
         ],
         "calories": 775, "protein_g": 64, "carbs_g": 88, "fat_g": 17, "notes_es": "", "notes_en": ""}
      ],
      "total_calories": 2492, "total_protein_g": 187, "total_carbs_g": 267, "total_fat_g": 77
    }
  ]'::jsonb,
  ARRAY['semana completa', 'balanceado', 'moderado', 'full week', 'balanced', 'moderate'],
  ARRAY['ciclistas', 'triatletas', 'nadadores', 'atletas de fuerza', 'cyclists', 'triathletes', 'swimmers', 'strength athletes'],
  true
),
(
  '4000 kcal - Resistencia Avanzada / Advanced Endurance',
  '4000 kcal - Resistencia Avanzada',
  '4000 kcal - Advanced Endurance',
  'Plan de alto volumen calórico para atletas de resistencia avanzados con entrenamiento de alto volumen e intensidad.',
  'High-calorie plan for advanced endurance athletes with high-volume, high-intensity training.',
  4000, 'endurance', 'omnivore',
  180, 560, 100, 52,
  '[
    {
      "day_number": 1, "day_name": "Lunes / Monday",
      "meals": [
        {"slot": "wake_up", "name_es": "Despertar: banana y café", "name_en": "Wake up: banana and coffee",
         "foods": [
           {"name_es": "Banana", "name_en": "Banana", "quantity_g": 120, "calories": 107, "protein_g": 1, "carbs_g": 27, "fat_g": 0},
           {"name_es": "Café con leche", "name_en": "Coffee with milk", "quantity_g": 200, "calories": 60, "protein_g": 3, "carbs_g": 6, "fat_g": 3}
         ],
         "calories": 167, "protein_g": 4, "carbs_g": 33, "fat_g": 3, "notes_es": "", "notes_en": ""},
        {"slot": "breakfast", "name_es": "Desayuno energético: avena grande, huevos y jugo", "name_en": "Energy breakfast: large oats, eggs and juice",
         "foods": [
           {"name_es": "Avena", "name_en": "Oats", "quantity_g": 120, "calories": 444, "protein_g": 15, "carbs_g": 80, "fat_g": 7},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 300, "calories": 195, "protein_g": 10, "carbs_g": 15, "fat_g": 11},
           {"name_es": "Huevos revueltos", "name_en": "Scrambled eggs", "quantity_g": 180, "calories": 259, "protein_g": 22, "carbs_g": 2, "fat_g": 18},
           {"name_es": "Jugo de naranja", "name_en": "Orange juice", "quantity_g": 250, "calories": 110, "protein_g": 2, "carbs_g": 26, "fat_g": 0},
           {"name_es": "Pan integral", "name_en": "Whole grain bread", "quantity_g": 60, "calories": 159, "protein_g": 6, "carbs_g": 30, "fat_g": 2}
         ],
         "calories": 1167, "protein_g": 55, "carbs_g": 153, "fat_g": 38, "notes_es": "", "notes_en": ""},
        {"slot": "mid_morning", "name_es": "Snack energético: granola, yogur y fruta", "name_en": "Energy snack: granola, yogurt and fruit",
         "foods": [
           {"name_es": "Yogur griego", "name_en": "Greek yogurt", "quantity_g": 200, "calories": 130, "protein_g": 17, "carbs_g": 9, "fat_g": 3},
           {"name_es": "Granola", "name_en": "Granola", "quantity_g": 60, "calories": 270, "protein_g": 6, "carbs_g": 42, "fat_g": 9},
           {"name_es": "Mango", "name_en": "Mango", "quantity_g": 150, "calories": 99, "protein_g": 1, "carbs_g": 25, "fat_g": 1}
         ],
         "calories": 499, "protein_g": 24, "carbs_g": 76, "fat_g": 13, "notes_es": "", "notes_en": ""},
        {"slot": "lunch", "name_es": "Almuerzo potente: arroz, pollo, legumbres", "name_en": "Power lunch: rice, chicken, legumes",
         "foods": [
           {"name_es": "Pechuga de pollo", "name_en": "Chicken breast", "quantity_g": 200, "calories": 330, "protein_g": 62, "carbs_g": 0, "fat_g": 7},
           {"name_es": "Arroz blanco cocido", "name_en": "Cooked white rice", "quantity_g": 350, "calories": 455, "protein_g": 8, "carbs_g": 101, "fat_g": 1},
           {"name_es": "Frijoles / Porotos negros", "name_en": "Black beans", "quantity_g": 150, "calories": 171, "protein_g": 11, "carbs_g": 31, "fat_g": 1},
           {"name_es": "Aceite de oliva", "name_en": "Olive oil", "quantity_g": 15, "calories": 133, "protein_g": 0, "carbs_g": 0, "fat_g": 15}
         ],
         "calories": 1089, "protein_g": 81, "carbs_g": 132, "fat_g": 24, "notes_es": "", "notes_en": ""},
        {"slot": "pre_training", "name_es": "Pre-entreno: banana y miel con agua", "name_en": "Pre-training: banana and honey with water",
         "foods": [
           {"name_es": "Banana grande", "name_en": "Large banana", "quantity_g": 150, "calories": 134, "protein_g": 2, "carbs_g": 34, "fat_g": 0},
           {"name_es": "Miel", "name_en": "Honey", "quantity_g": 30, "calories": 91, "protein_g": 0, "carbs_g": 25, "fat_g": 0}
         ],
         "calories": 225, "protein_g": 2, "carbs_g": 59, "fat_g": 0, "notes_es": "45 min antes / 45 min before", "notes_en": "45 min before"},
        {"slot": "during_training", "name_es": "Durante: gel energético + bebida isotónica", "name_en": "During: energy gel + isotonic drink",
         "foods": [
           {"name_es": "Gel energético", "name_en": "Energy gel", "quantity_g": 44, "calories": 99, "protein_g": 0, "carbs_g": 24, "fat_g": 0},
           {"name_es": "Bebida isotónica", "name_en": "Isotonic drink", "quantity_g": 500, "calories": 100, "protein_g": 0, "carbs_g": 25, "fat_g": 0}
         ],
         "calories": 199, "protein_g": 0, "carbs_g": 49, "fat_g": 0, "notes_es": "Cada 45 min / Every 45 min", "notes_en": "Every 45 min"},
        {"slot": "post_training", "name_es": "Post-entreno: batido de recuperación", "name_en": "Post-training: recovery shake",
         "foods": [
           {"name_es": "Proteína whey", "name_en": "Whey protein", "quantity_g": 50, "calories": 195, "protein_g": 40, "carbs_g": 5, "fat_g": 3},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 300, "calories": 195, "protein_g": 10, "carbs_g": 15, "fat_g": 11},
           {"name_es": "Banana", "name_en": "Banana", "quantity_g": 120, "calories": 107, "protein_g": 1, "carbs_g": 27, "fat_g": 0}
         ],
         "calories": 497, "protein_g": 51, "carbs_g": 47, "fat_g": 14, "notes_es": "", "notes_en": ""},
        {"slot": "dinner", "name_es": "Cena carbohidratos y proteína: pasta y salmón", "name_en": "Dinner carbs + protein: pasta and salmon",
         "foods": [
           {"name_es": "Salmón", "name_en": "Salmon", "quantity_g": 200, "calories": 415, "protein_g": 40, "carbs_g": 0, "fat_g": 28},
           {"name_es": "Pasta cocida", "name_en": "Cooked pasta", "quantity_g": 300, "calories": 468, "protein_g": 16, "carbs_g": 95, "fat_g": 2},
           {"name_es": "Espinaca", "name_en": "Spinach", "quantity_g": 100, "calories": 23, "protein_g": 3, "carbs_g": 4, "fat_g": 0}
         ],
         "calories": 906, "protein_g": 59, "carbs_g": 99, "fat_g": 30, "notes_es": "", "notes_en": ""}
      ],
      "total_calories": 4749, "total_protein_g": 276, "total_carbs_g": 648, "total_fat_g": 122
    },
    {
      "day_number": 2, "day_name": "Martes / Tuesday",
      "meals": [
        {"slot": "breakfast", "name_es": "Avena con leche, miel, plátano y nueces", "name_en": "Oats with milk, honey, banana and nuts",
         "foods": [
           {"name_es": "Avena", "name_en": "Oats", "quantity_g": 100, "calories": 370, "protein_g": 13, "carbs_g": 66, "fat_g": 7},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 300, "calories": 195, "protein_g": 10, "carbs_g": 15, "fat_g": 11},
           {"name_es": "Miel", "name_en": "Honey", "quantity_g": 25, "calories": 76, "protein_g": 0, "carbs_g": 21, "fat_g": 0},
           {"name_es": "Banana", "name_en": "Banana", "quantity_g": 100, "calories": 89, "protein_g": 1, "carbs_g": 23, "fat_g": 0},
           {"name_es": "Nueces mixtas", "name_en": "Mixed nuts", "quantity_g": 30, "calories": 186, "protein_g": 5, "carbs_g": 6, "fat_g": 16}
         ],
         "calories": 916, "protein_g": 29, "carbs_g": 131, "fat_g": 34, "notes_es": "", "notes_en": ""},
        {"slot": "mid_morning", "name_es": "Requesón con fruta y granola", "name_en": "Cottage cheese with fruit and granola",
         "foods": [
           {"name_es": "Requesón / Cottage cheese", "name_en": "Cottage cheese", "quantity_g": 200, "calories": 180, "protein_g": 22, "carbs_g": 8, "fat_g": 6},
           {"name_es": "Mango", "name_en": "Mango", "quantity_g": 150, "calories": 99, "protein_g": 1, "carbs_g": 25, "fat_g": 1},
           {"name_es": "Granola", "name_en": "Granola", "quantity_g": 40, "calories": 180, "protein_g": 4, "carbs_g": 28, "fat_g": 6}
         ],
         "calories": 459, "protein_g": 27, "carbs_g": 61, "fat_g": 13, "notes_es": "", "notes_en": ""},
        {"slot": "lunch", "name_es": "Carne con pasta, ensalada y pan", "name_en": "Meat with pasta, salad and bread",
         "foods": [
           {"name_es": "Filete de res magro", "name_en": "Lean beef steak", "quantity_g": 200, "calories": 340, "protein_g": 50, "carbs_g": 0, "fat_g": 14},
           {"name_es": "Pasta cocida", "name_en": "Cooked pasta", "quantity_g": 300, "calories": 468, "protein_g": 16, "carbs_g": 95, "fat_g": 2},
           {"name_es": "Pan integral", "name_en": "Whole grain bread", "quantity_g": 80, "calories": 212, "protein_g": 8, "carbs_g": 40, "fat_g": 3},
           {"name_es": "Ensalada verde", "name_en": "Green salad", "quantity_g": 100, "calories": 20, "protein_g": 1, "carbs_g": 4, "fat_g": 0}
         ],
         "calories": 1040, "protein_g": 75, "carbs_g": 139, "fat_g": 19, "notes_es": "", "notes_en": ""},
        {"slot": "afternoon_snack", "name_es": "Batido de carbohidratos", "name_en": "Carbohydrate shake",
         "foods": [
           {"name_es": "Maltodextrina / Dextrose", "name_en": "Maltodextrin / Dextrose", "quantity_g": 60, "calories": 240, "protein_g": 0, "carbs_g": 60, "fat_g": 0},
           {"name_es": "Proteína whey", "name_en": "Whey protein", "quantity_g": 30, "calories": 117, "protein_g": 24, "carbs_g": 3, "fat_g": 1},
           {"name_es": "Agua", "name_en": "Water", "quantity_g": 400, "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}
         ],
         "calories": 357, "protein_g": 24, "carbs_g": 63, "fat_g": 1, "notes_es": "", "notes_en": ""},
        {"slot": "dinner", "name_es": "Pollo con arroz, batata y verduras", "name_en": "Chicken with rice, sweet potato and vegetables",
         "foods": [
           {"name_es": "Pechuga de pollo", "name_en": "Chicken breast", "quantity_g": 220, "calories": 363, "protein_g": 68, "carbs_g": 0, "fat_g": 8},
           {"name_es": "Arroz blanco cocido", "name_en": "Cooked white rice", "quantity_g": 300, "calories": 390, "protein_g": 7, "carbs_g": 86, "fat_g": 1},
           {"name_es": "Batata / Camote", "name_en": "Sweet potato", "quantity_g": 200, "calories": 172, "protein_g": 3, "carbs_g": 40, "fat_g": 0},
           {"name_es": "Brócoli al vapor", "name_en": "Steamed broccoli", "quantity_g": 100, "calories": 34, "protein_g": 3, "carbs_g": 7, "fat_g": 0}
         ],
         "calories": 959, "protein_g": 81, "carbs_g": 133, "fat_g": 9, "notes_es": "", "notes_en": ""}
      ],
      "total_calories": 3731, "total_protein_g": 236, "total_carbs_g": 527, "total_fat_g": 76
    },
    {
      "day_number": 3, "day_name": "Miércoles / Wednesday",
      "meals": [
        {"slot": "breakfast", "name_es": "Pancakes de avena con fruta y miel", "name_en": "Oat pancakes with fruit and honey",
         "foods": [
           {"name_es": "Harina de avena", "name_en": "Oat flour", "quantity_g": 120, "calories": 444, "protein_g": 16, "carbs_g": 79, "fat_g": 8},
           {"name_es": "Huevos", "name_en": "Eggs", "quantity_g": 120, "calories": 172, "protein_g": 15, "carbs_g": 1, "fat_g": 12},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 200, "calories": 130, "protein_g": 7, "carbs_g": 10, "fat_g": 7},
           {"name_es": "Miel", "name_en": "Honey", "quantity_g": 30, "calories": 91, "protein_g": 0, "carbs_g": 25, "fat_g": 0},
           {"name_es": "Banana", "name_en": "Banana", "quantity_g": 100, "calories": 89, "protein_g": 1, "carbs_g": 23, "fat_g": 0}
         ],
         "calories": 926, "protein_g": 39, "carbs_g": 138, "fat_g": 27, "notes_es": "", "notes_en": ""},
        {"slot": "mid_morning", "name_es": "Batido de proteína con avena y frutos secos", "name_en": "Protein shake with oats and dried fruit",
         "foods": [
           {"name_es": "Proteína whey", "name_en": "Whey protein", "quantity_g": 40, "calories": 156, "protein_g": 32, "carbs_g": 4, "fat_g": 2},
           {"name_es": "Avena cocida", "name_en": "Cooked oats", "quantity_g": 80, "calories": 296, "protein_g": 10, "carbs_g": 53, "fat_g": 5},
           {"name_es": "Pasas", "name_en": "Raisins", "quantity_g": 30, "calories": 90, "protein_g": 1, "carbs_g": 23, "fat_g": 0}
         ],
         "calories": 542, "protein_g": 43, "carbs_g": 80, "fat_g": 7, "notes_es": "", "notes_en": ""},
        {"slot": "lunch", "name_es": "Salmón con arroz, aguacate y ensalada", "name_en": "Salmon with rice, avocado and salad",
         "foods": [
           {"name_es": "Salmón", "name_en": "Salmon", "quantity_g": 200, "calories": 415, "protein_g": 40, "carbs_g": 0, "fat_g": 28},
           {"name_es": "Arroz blanco cocido", "name_en": "Cooked white rice", "quantity_g": 350, "calories": 455, "protein_g": 8, "carbs_g": 101, "fat_g": 1},
           {"name_es": "Aguacate", "name_en": "Avocado", "quantity_g": 80, "calories": 128, "protein_g": 2, "carbs_g": 7, "fat_g": 12},
           {"name_es": "Ensalada verde", "name_en": "Green salad", "quantity_g": 150, "calories": 30, "protein_g": 2, "carbs_g": 6, "fat_g": 0}
         ],
         "calories": 1028, "protein_g": 52, "carbs_g": 114, "fat_g": 41, "notes_es": "", "notes_en": ""},
        {"slot": "afternoon_snack", "name_es": "Tostadas con mantequilla de almendras y mermelada", "name_en": "Toast with almond butter and jam",
         "foods": [
           {"name_es": "Pan integral", "name_en": "Whole grain bread", "quantity_g": 80, "calories": 212, "protein_g": 8, "carbs_g": 40, "fat_g": 3},
           {"name_es": "Mantequilla de almendras", "name_en": "Almond butter", "quantity_g": 30, "calories": 189, "protein_g": 7, "carbs_g": 6, "fat_g": 17},
           {"name_es": "Mermelada de frutos rojos", "name_en": "Berry jam", "quantity_g": 20, "calories": 52, "protein_g": 0, "carbs_g": 14, "fat_g": 0}
         ],
         "calories": 453, "protein_g": 15, "carbs_g": 60, "fat_g": 20, "notes_es": "", "notes_en": ""},
        {"slot": "dinner", "name_es": "Pollo con pasta, legumbres y queso", "name_en": "Chicken with pasta, legumes and cheese",
         "foods": [
           {"name_es": "Pechuga de pollo", "name_en": "Chicken breast", "quantity_g": 180, "calories": 297, "protein_g": 56, "carbs_g": 0, "fat_g": 6},
           {"name_es": "Pasta cocida", "name_en": "Cooked pasta", "quantity_g": 250, "calories": 390, "protein_g": 13, "carbs_g": 79, "fat_g": 2},
           {"name_es": "Lentejas cocidas", "name_en": "Cooked lentils", "quantity_g": 100, "calories": 116, "protein_g": 9, "carbs_g": 20, "fat_g": 0},
           {"name_es": "Queso parmesano", "name_en": "Parmesan cheese", "quantity_g": 20, "calories": 83, "protein_g": 7, "carbs_g": 1, "fat_g": 6}
         ],
         "calories": 886, "protein_g": 85, "carbs_g": 100, "fat_g": 14, "notes_es": "", "notes_en": ""}
      ],
      "total_calories": 3835, "total_protein_g": 234, "total_carbs_g": 492, "total_fat_g": 109
    },
    {
      "day_number": 4, "day_name": "Jueves / Thursday",
      "meals": [
        {"slot": "breakfast", "name_es": "Tazón de granola con leche, banana y proteína", "name_en": "Granola bowl with milk, banana and protein",
         "foods": [
           {"name_es": "Granola", "name_en": "Granola", "quantity_g": 100, "calories": 450, "protein_g": 10, "carbs_g": 70, "fat_g": 15},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 300, "calories": 195, "protein_g": 10, "carbs_g": 15, "fat_g": 11},
           {"name_es": "Banana grande", "name_en": "Large banana", "quantity_g": 150, "calories": 134, "protein_g": 2, "carbs_g": 34, "fat_g": 0},
           {"name_es": "Proteína whey", "name_en": "Whey protein", "quantity_g": 30, "calories": 117, "protein_g": 24, "carbs_g": 3, "fat_g": 1}
         ],
         "calories": 896, "protein_g": 46, "carbs_g": 122, "fat_g": 27, "notes_es": "", "notes_en": ""},
        {"slot": "mid_morning", "name_es": "Arroz con leche y frutos secos", "name_en": "Rice pudding with dried fruits",
         "foods": [
           {"name_es": "Arroz con leche", "name_en": "Rice pudding", "quantity_g": 250, "calories": 350, "protein_g": 10, "carbs_g": 60, "fat_g": 9},
           {"name_es": "Pasas", "name_en": "Raisins", "quantity_g": 40, "calories": 120, "protein_g": 1, "carbs_g": 31, "fat_g": 0},
           {"name_es": "Almendras", "name_en": "Almonds", "quantity_g": 20, "calories": 116, "protein_g": 4, "carbs_g": 4, "fat_g": 10}
         ],
         "calories": 586, "protein_g": 15, "carbs_g": 95, "fat_g": 19, "notes_es": "", "notes_en": ""},
        {"slot": "lunch", "name_es": "Ternera con arroz, frijoles y aguacate", "name_en": "Beef with rice, beans and avocado",
         "foods": [
           {"name_es": "Ternera / Res magra", "name_en": "Lean beef", "quantity_g": 200, "calories": 340, "protein_g": 50, "carbs_g": 0, "fat_g": 14},
           {"name_es": "Arroz blanco cocido", "name_en": "Cooked white rice", "quantity_g": 350, "calories": 455, "protein_g": 8, "carbs_g": 101, "fat_g": 1},
           {"name_es": "Frijoles negros", "name_en": "Black beans", "quantity_g": 150, "calories": 171, "protein_g": 11, "carbs_g": 31, "fat_g": 1},
           {"name_es": "Aguacate", "name_en": "Avocado", "quantity_g": 60, "calories": 96, "protein_g": 1, "carbs_g": 5, "fat_g": 9}
         ],
         "calories": 1062, "protein_g": 70, "carbs_g": 137, "fat_g": 25, "notes_es": "", "notes_en": ""},
        {"slot": "afternoon_snack", "name_es": "Batido de proteína con fruta y avena", "name_en": "Protein shake with fruit and oats",
         "foods": [
           {"name_es": "Proteína whey", "name_en": "Whey protein", "quantity_g": 40, "calories": 156, "protein_g": 32, "carbs_g": 4, "fat_g": 2},
           {"name_es": "Avena cruda", "name_en": "Raw oats", "quantity_g": 40, "calories": 148, "protein_g": 5, "carbs_g": 26, "fat_g": 3},
           {"name_es": "Mango", "name_en": "Mango", "quantity_g": 150, "calories": 99, "protein_g": 1, "carbs_g": 25, "fat_g": 1},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 200, "calories": 130, "protein_g": 7, "carbs_g": 10, "fat_g": 7}
         ],
         "calories": 533, "protein_g": 45, "carbs_g": 65, "fat_g": 13, "notes_es": "", "notes_en": ""},
        {"slot": "dinner", "name_es": "Atún con pasta y vegetales salteados", "name_en": "Tuna with pasta and sautéed vegetables",
         "foods": [
           {"name_es": "Atún en agua", "name_en": "Canned tuna in water", "quantity_g": 200, "calories": 220, "protein_g": 47, "carbs_g": 0, "fat_g": 3},
           {"name_es": "Pasta cocida", "name_en": "Cooked pasta", "quantity_g": 300, "calories": 468, "protein_g": 16, "carbs_g": 95, "fat_g": 2},
           {"name_es": "Vegetales salteados", "name_en": "Sautéed vegetables", "quantity_g": 200, "calories": 80, "protein_g": 3, "carbs_g": 14, "fat_g": 2},
           {"name_es": "Aceite de oliva", "name_en": "Olive oil", "quantity_g": 10, "calories": 88, "protein_g": 0, "carbs_g": 0, "fat_g": 10}
         ],
         "calories": 856, "protein_g": 66, "carbs_g": 109, "fat_g": 17, "notes_es": "", "notes_en": ""}
      ],
      "total_calories": 3933, "total_protein_g": 242, "total_carbs_g": 528, "total_fat_g": 101
    },
    {
      "day_number": 5, "day_name": "Viernes / Friday",
      "meals": [
        {"slot": "breakfast", "name_es": "Desayuno de competencia: carbohidratos altos", "name_en": "Competition breakfast: high carbs",
         "foods": [
           {"name_es": "Avena con leche", "name_en": "Oats with milk", "quantity_g": 120, "calories": 444, "protein_g": 15, "carbs_g": 80, "fat_g": 7},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 300, "calories": 195, "protein_g": 10, "carbs_g": 15, "fat_g": 11},
           {"name_es": "Tostadas con miel", "name_en": "Toast with honey", "quantity_g": 80, "calories": 212, "protein_g": 8, "carbs_g": 40, "fat_g": 3},
           {"name_es": "Miel", "name_en": "Honey", "quantity_g": 25, "calories": 76, "protein_g": 0, "carbs_g": 21, "fat_g": 0},
           {"name_es": "Jugo de naranja", "name_en": "Orange juice", "quantity_g": 250, "calories": 110, "protein_g": 2, "carbs_g": 26, "fat_g": 0}
         ],
         "calories": 1037, "protein_g": 35, "carbs_g": 182, "fat_g": 21, "notes_es": "", "notes_en": ""},
        {"slot": "mid_morning", "name_es": "Yogur con cereales y fruta fresca", "name_en": "Yogurt with cereal and fresh fruit",
         "foods": [
           {"name_es": "Yogur griego", "name_en": "Greek yogurt", "quantity_g": 200, "calories": 130, "protein_g": 17, "carbs_g": 9, "fat_g": 3},
           {"name_es": "Cereales deportivos", "name_en": "Sports cereal", "quantity_g": 60, "calories": 240, "protein_g": 4, "carbs_g": 50, "fat_g": 3},
           {"name_es": "Frutillas / Fresas", "name_en": "Strawberries", "quantity_g": 150, "calories": 48, "protein_g": 1, "carbs_g": 12, "fat_g": 0}
         ],
         "calories": 418, "protein_g": 22, "carbs_g": 71, "fat_g": 6, "notes_es": "", "notes_en": ""},
        {"slot": "lunch", "name_es": "Carne con patata, pan y ensalada grande", "name_en": "Meat with potato, bread and large salad",
         "foods": [
           {"name_es": "Pollo asado entero", "name_en": "Whole roast chicken", "quantity_g": 300, "calories": 555, "protein_g": 78, "carbs_g": 0, "fat_g": 25},
           {"name_es": "Papa / Patata asada", "name_en": "Baked potato", "quantity_g": 300, "calories": 261, "protein_g": 6, "carbs_g": 59, "fat_g": 0},
           {"name_es": "Pan integral", "name_en": "Whole grain bread", "quantity_g": 60, "calories": 159, "protein_g": 6, "carbs_g": 30, "fat_g": 2},
           {"name_es": "Ensalada grande", "name_en": "Large salad", "quantity_g": 200, "calories": 60, "protein_g": 3, "carbs_g": 12, "fat_g": 1}
         ],
         "calories": 1035, "protein_g": 93, "carbs_g": 101, "fat_g": 28, "notes_es": "", "notes_en": ""},
        {"slot": "afternoon_snack", "name_es": "Batido hipercalórico", "name_en": "High-calorie shake",
         "foods": [
           {"name_es": "Ganador de masa / Mass gainer", "name_en": "Mass gainer", "quantity_g": 100, "calories": 380, "protein_g": 30, "carbs_g": 55, "fat_g": 5},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 300, "calories": 195, "protein_g": 10, "carbs_g": 15, "fat_g": 11}
         ],
         "calories": 575, "protein_g": 40, "carbs_g": 70, "fat_g": 16, "notes_es": "", "notes_en": ""},
        {"slot": "dinner", "name_es": "Salmón con arroz y batata al horno", "name_en": "Salmon with rice and baked sweet potato",
         "foods": [
           {"name_es": "Salmón al horno", "name_en": "Baked salmon", "quantity_g": 200, "calories": 415, "protein_g": 40, "carbs_g": 0, "fat_g": 28},
           {"name_es": "Arroz blanco cocido", "name_en": "Cooked white rice", "quantity_g": 300, "calories": 390, "protein_g": 7, "carbs_g": 86, "fat_g": 1},
           {"name_es": "Batata / Camote asada", "name_en": "Baked sweet potato", "quantity_g": 200, "calories": 172, "protein_g": 3, "carbs_g": 40, "fat_g": 0}
         ],
         "calories": 977, "protein_g": 50, "carbs_g": 126, "fat_g": 29, "notes_es": "", "notes_en": ""}
      ],
      "total_calories": 4042, "total_protein_g": 240, "total_carbs_g": 550, "total_fat_g": 100
    },
    {
      "day_number": 6, "day_name": "Sábado / Saturday — Día de Competencia / Race Day",
      "meals": [
        {"slot": "wake_up", "name_es": "Despertar (3h antes): tostada con miel", "name_en": "Wake up (3h before): toast with honey",
         "foods": [
           {"name_es": "Pan blanco tostado", "name_en": "Toasted white bread", "quantity_g": 100, "calories": 265, "protein_g": 9, "carbs_g": 54, "fat_g": 2},
           {"name_es": "Miel", "name_en": "Honey", "quantity_g": 30, "calories": 91, "protein_g": 0, "carbs_g": 25, "fat_g": 0}
         ],
         "calories": 356, "protein_g": 9, "carbs_g": 79, "fat_g": 2, "notes_es": "3 horas antes de la carrera / 3 hours before race", "notes_en": "3 hours before race"},
        {"slot": "breakfast", "name_es": "Desayuno pre-carrera (2h): avena y jugo", "name_en": "Pre-race breakfast (2h): oats and juice",
         "foods": [
           {"name_es": "Avena fácil de digerir", "name_en": "Easy-digest oats", "quantity_g": 80, "calories": 296, "protein_g": 10, "carbs_g": 53, "fat_g": 5},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 200, "calories": 130, "protein_g": 7, "carbs_g": 10, "fat_g": 7},
           {"name_es": "Jugo de naranja", "name_en": "Orange juice", "quantity_g": 300, "calories": 132, "protein_g": 2, "carbs_g": 31, "fat_g": 0},
           {"name_es": "Banana", "name_en": "Banana", "quantity_g": 100, "calories": 89, "protein_g": 1, "carbs_g": 23, "fat_g": 0}
         ],
         "calories": 647, "protein_g": 20, "carbs_g": 117, "fat_g": 12, "notes_es": "2 horas antes / 2 hours before race", "notes_en": "2 hours before race"},
        {"slot": "pre_training", "name_es": "Pre-largada (15-20 min): gel + bebida", "name_en": "Pre-start (15-20 min): gel + drink",
         "foods": [
           {"name_es": "Gel energético con cafeína", "name_en": "Caffeinated energy gel", "quantity_g": 44, "calories": 99, "protein_g": 0, "carbs_g": 24, "fat_g": 0},
           {"name_es": "Bebida isotónica", "name_en": "Isotonic drink", "quantity_g": 500, "calories": 100, "protein_g": 0, "carbs_g": 25, "fat_g": 0}
         ],
         "calories": 199, "protein_g": 0, "carbs_g": 49, "fat_g": 0, "notes_es": "15-20 min antes de la largada / 15-20 min before start", "notes_en": "15-20 min before start"},
        {"slot": "during_training", "name_es": "Durante competencia: geles e isotónico", "name_en": "During race: gels and isotonic",
         "foods": [
           {"name_es": "Geles energéticos (x5)", "name_en": "Energy gels (x5)", "quantity_g": 220, "calories": 495, "protein_g": 0, "carbs_g": 120, "fat_g": 0},
           {"name_es": "Bebida isotónica", "name_en": "Isotonic drink", "quantity_g": 1500, "calories": 300, "protein_g": 0, "carbs_g": 75, "fat_g": 0},
           {"name_es": "Plátano / Banana en estación", "name_en": "Banana at aid station", "quantity_g": 100, "calories": 89, "protein_g": 1, "carbs_g": 23, "fat_g": 0}
         ],
         "calories": 884, "protein_g": 1, "carbs_g": 218, "fat_g": 0, "notes_es": "Gel cada 40 min / Gel every 40 min", "notes_en": "Gel every 40 min"},
        {"slot": "post_training", "name_es": "Recuperación post-carrera", "name_en": "Post-race recovery",
         "foods": [
           {"name_es": "Proteína whey", "name_en": "Whey protein", "quantity_g": 50, "calories": 195, "protein_g": 40, "carbs_g": 5, "fat_g": 3},
           {"name_es": "Leche de chocolate", "name_en": "Chocolate milk", "quantity_g": 300, "calories": 285, "protein_g": 12, "carbs_g": 45, "fat_g": 7},
           {"name_es": "Banana", "name_en": "Banana", "quantity_g": 120, "calories": 107, "protein_g": 1, "carbs_g": 27, "fat_g": 0}
         ],
         "calories": 587, "protein_g": 53, "carbs_g": 77, "fat_g": 10, "notes_es": "Inmediatamente después / Immediately after", "notes_en": "Immediately after"},
        {"slot": "dinner", "name_es": "Cena de recuperación: arroz, pollo y verduras", "name_en": "Recovery dinner: rice, chicken and vegetables",
         "foods": [
           {"name_es": "Pechuga de pollo", "name_en": "Chicken breast", "quantity_g": 250, "calories": 413, "protein_g": 78, "carbs_g": 0, "fat_g": 9},
           {"name_es": "Arroz blanco cocido", "name_en": "Cooked white rice", "quantity_g": 350, "calories": 455, "protein_g": 8, "carbs_g": 101, "fat_g": 1},
           {"name_es": "Zanahorias y espinaca", "name_en": "Carrots and spinach", "quantity_g": 200, "calories": 70, "protein_g": 4, "carbs_g": 14, "fat_g": 0},
           {"name_es": "Aceite de oliva", "name_en": "Olive oil", "quantity_g": 10, "calories": 88, "protein_g": 0, "carbs_g": 0, "fat_g": 10}
         ],
         "calories": 1026, "protein_g": 90, "carbs_g": 115, "fat_g": 20, "notes_es": "", "notes_en": ""}
      ],
      "total_calories": 3699, "total_protein_g": 173, "total_carbs_g": 655, "total_fat_g": 44
    },
    {
      "day_number": 7, "day_name": "Domingo / Sunday — Recuperación / Recovery",
      "meals": [
        {"slot": "breakfast", "name_es": "Desayuno de recuperación activa", "name_en": "Active recovery breakfast",
         "foods": [
           {"name_es": "Avena con leche y miel", "name_en": "Oats with milk and honey", "quantity_g": 100, "calories": 370, "protein_g": 13, "carbs_g": 66, "fat_g": 7},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 300, "calories": 195, "protein_g": 10, "carbs_g": 15, "fat_g": 11},
           {"name_es": "Huevos", "name_en": "Eggs", "quantity_g": 120, "calories": 172, "protein_g": 15, "carbs_g": 1, "fat_g": 12},
           {"name_es": "Naranja", "name_en": "Orange", "quantity_g": 150, "calories": 70, "protein_g": 1, "carbs_g": 18, "fat_g": 0}
         ],
         "calories": 807, "protein_g": 39, "carbs_g": 100, "fat_g": 30, "notes_es": "", "notes_en": ""},
        {"slot": "mid_morning", "name_es": "Batido proteico de recuperación", "name_en": "Recovery protein shake",
         "foods": [
           {"name_es": "Proteína whey", "name_en": "Whey protein", "quantity_g": 40, "calories": 156, "protein_g": 32, "carbs_g": 4, "fat_g": 2},
           {"name_es": "Leche entera", "name_en": "Whole milk", "quantity_g": 300, "calories": 195, "protein_g": 10, "carbs_g": 15, "fat_g": 11},
           {"name_es": "Arándanos", "name_en": "Blueberries", "quantity_g": 100, "calories": 57, "protein_g": 1, "carbs_g": 14, "fat_g": 0}
         ],
         "calories": 408, "protein_g": 43, "carbs_g": 33, "fat_g": 13, "notes_es": "", "notes_en": ""},
        {"slot": "lunch", "name_es": "Almuerzo familiar de recuperación", "name_en": "Family recovery lunch",
         "foods": [
           {"name_es": "Salmón a la plancha", "name_en": "Grilled salmon", "quantity_g": 250, "calories": 519, "protein_g": 50, "carbs_g": 0, "fat_g": 35},
           {"name_es": "Arroz integral cocido", "name_en": "Cooked brown rice", "quantity_g": 300, "calories": 390, "protein_g": 8, "carbs_g": 82, "fat_g": 3},
           {"name_es": "Brócoli al vapor", "name_en": "Steamed broccoli", "quantity_g": 200, "calories": 68, "protein_g": 6, "carbs_g": 14, "fat_g": 0},
           {"name_es": "Ensalada con aceite de oliva", "name_en": "Salad with olive oil", "quantity_g": 150, "calories": 100, "protein_g": 1, "carbs_g": 8, "fat_g": 7}
         ],
         "calories": 1077, "protein_g": 65, "carbs_g": 104, "fat_g": 45, "notes_es": "", "notes_en": ""},
        {"slot": "afternoon_snack", "name_es": "Yogur griego con fruta y miel", "name_en": "Greek yogurt with fruit and honey",
         "foods": [
           {"name_es": "Yogur griego", "name_en": "Greek yogurt", "quantity_g": 200, "calories": 130, "protein_g": 17, "carbs_g": 9, "fat_g": 3},
           {"name_es": "Kiwi", "name_en": "Kiwi", "quantity_g": 150, "calories": 90, "protein_g": 2, "carbs_g": 22, "fat_g": 1},
           {"name_es": "Miel", "name_en": "Honey", "quantity_g": 20, "calories": 61, "protein_g": 0, "carbs_g": 17, "fat_g": 0}
         ],
         "calories": 281, "protein_g": 19, "carbs_g": 48, "fat_g": 4, "notes_es": "", "notes_en": ""},
        {"slot": "dinner", "name_es": "Cena ligera de recuperación nocturna", "name_en": "Light recovery evening dinner",
         "foods": [
           {"name_es": "Pechuga de pollo al vapor", "name_en": "Steamed chicken breast", "quantity_g": 200, "calories": 330, "protein_g": 62, "carbs_g": 0, "fat_g": 7},
           {"name_es": "Batata / Camote al vapor", "name_en": "Steamed sweet potato", "quantity_g": 250, "calories": 215, "protein_g": 4, "carbs_g": 50, "fat_g": 0},
           {"name_es": "Espinaca y zanahoria", "name_en": "Spinach and carrots", "quantity_g": 200, "calories": 60, "protein_g": 4, "carbs_g": 12, "fat_g": 0},
           {"name_es": "Caseína proteica", "name_en": "Casein protein", "quantity_g": 30, "calories": 111, "protein_g": 24, "carbs_g": 3, "fat_g": 1}
         ],
         "calories": 716, "protein_g": 94, "carbs_g": 65, "fat_g": 8, "notes_es": "Proteína de lenta absorción para recuperación nocturna / Slow-release protein for overnight recovery", "notes_en": "Slow-release protein for overnight recovery"}
      ],
      "total_calories": 3289, "total_protein_g": 260, "total_carbs_g": 350, "total_fat_g": 100
    }
  ]'::jsonb,
  ARRAY['resistencia avanzada', 'alto volumen', 'endurance', 'cycling', 'triathlon', 'marathon', 'carbo loading'],
  ARRAY['ciclistas avanzados', 'triatletas', 'maratonistas', 'ironman', 'advanced cyclists', 'triathletes', 'marathoners'],
  true
);
