export interface FoodV2 {
  id: string;
  name_es: string;
  name_en: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  source?: string;
  is_verified?: boolean;
  off_product_id?: string;
  usda_fdc_id?: string;
  product_form?: string;
  brand?: string;
  vitamin_a_mcg?: number;
  vitamin_c_mg?: number;
  vitamin_d_mcg?: number;
  vitamin_e_mg?: number;
  vitamin_k_mcg?: number;
  vitamin_b1_mg?: number;
  vitamin_b2_mg?: number;
  vitamin_b3_mg?: number;
  vitamin_b5_mg?: number;
  vitamin_b6_mg?: number;
  vitamin_b7_ug?: number;
  vitamin_b12_mcg?: number;
  folate_mcg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  magnesium_mg?: number;
  phosphorus_mg?: number;
  potassium_mg?: number;
  zinc_mg?: number;
  sodium_mg?: number;
  iodine_ug?: number;
  choline_mg?: number;
  beta_carotene_ug?: number;
}

export interface RecipeIngredientFull {
  name: string;
  name_es?: string;
  name_en?: string;
  brand?: string;
  source?: string;
  food_id?: string;
  quantity: number;
  unit: string;
  base_quantity_g: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium_mg?: number;
  potassium_mg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  magnesium_mg?: number;
  phosphorus_mg?: number;
  zinc_mg?: number;
  vitamin_a_mcg?: number;
  vitamin_c_mg?: number;
  vitamin_d_mcg?: number;
  vitamin_e_mg?: number;
  vitamin_k_mcg?: number;
  vitamin_b1_mg?: number;
  vitamin_b2_mg?: number;
  vitamin_b3_mg?: number;
  vitamin_b5_mg?: number;
  vitamin_b6_mg?: number;
  vitamin_b7_ug?: number;
  vitamin_b12_mcg?: number;
  folate_mcg?: number;
  iodine_ug?: number;
  choline_mg?: number;
  beta_carotene_ug?: number;
}

export interface NutritionTotals {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium_mg: number;
  potassium_mg: number;
  calcium_mg: number;
  iron_mg: number;
  magnesium_mg: number;
  phosphorus_mg: number;
  zinc_mg: number;
  vitamin_a_mcg: number;
  vitamin_c_mg: number;
  vitamin_d_mcg: number;
  vitamin_e_mg: number;
  vitamin_k_mcg: number;
  vitamin_b1_mg: number;
  vitamin_b2_mg: number;
  vitamin_b3_mg: number;
  vitamin_b5_mg: number;
  vitamin_b6_mg: number;
  vitamin_b7_ug: number;
  vitamin_b12_mcg: number;
  folate_mcg: number;
  iodine_ug: number;
  choline_mg: number;
  beta_carotene_ug: number;
}

export const EMPTY_TOTALS: NutritionTotals = {
  calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0, sugar: 0,
  sodium_mg: 0, potassium_mg: 0, calcium_mg: 0, iron_mg: 0,
  magnesium_mg: 0, phosphorus_mg: 0, zinc_mg: 0,
  vitamin_a_mcg: 0, vitamin_c_mg: 0, vitamin_d_mcg: 0, vitamin_e_mg: 0,
  vitamin_k_mcg: 0, vitamin_b1_mg: 0, vitamin_b2_mg: 0, vitamin_b3_mg: 0,
  vitamin_b5_mg: 0, vitamin_b6_mg: 0, vitamin_b7_ug: 0, vitamin_b12_mcg: 0,
  folate_mcg: 0, iodine_ug: 0, choline_mg: 0, beta_carotene_ug: 0,
};

export const MICRONUTRIENT_FIELDS: { key: keyof NutritionTotals; label_es: string; label_en: string; unit: string }[] = [
  { key: 'fiber', label_es: 'Fibra', label_en: 'Fiber', unit: 'g' },
  { key: 'sugar', label_es: 'Azúcar', label_en: 'Sugar', unit: 'g' },
  { key: 'sodium_mg', label_es: 'Sodio', label_en: 'Sodium', unit: 'mg' },
  { key: 'potassium_mg', label_es: 'Potasio', label_en: 'Potassium', unit: 'mg' },
  { key: 'calcium_mg', label_es: 'Calcio', label_en: 'Calcium', unit: 'mg' },
  { key: 'iron_mg', label_es: 'Hierro', label_en: 'Iron', unit: 'mg' },
  { key: 'magnesium_mg', label_es: 'Magnesio', label_en: 'Magnesium', unit: 'mg' },
  { key: 'phosphorus_mg', label_es: 'Fósforo', label_en: 'Phosphorus', unit: 'mg' },
  { key: 'zinc_mg', label_es: 'Zinc', label_en: 'Zinc', unit: 'mg' },
  { key: 'vitamin_a_mcg', label_es: 'Vitamina A', label_en: 'Vitamin A', unit: 'mcg' },
  { key: 'vitamin_c_mg', label_es: 'Vitamina C', label_en: 'Vitamin C', unit: 'mg' },
  { key: 'vitamin_d_mcg', label_es: 'Vitamina D', label_en: 'Vitamin D', unit: 'mcg' },
  { key: 'vitamin_e_mg', label_es: 'Vitamina E', label_en: 'Vitamin E', unit: 'mg' },
  { key: 'vitamin_k_mcg', label_es: 'Vitamina K', label_en: 'Vitamin K', unit: 'mcg' },
  { key: 'vitamin_b1_mg', label_es: 'Vitamina B1', label_en: 'Vitamin B1', unit: 'mg' },
  { key: 'vitamin_b2_mg', label_es: 'Vitamina B2', label_en: 'Vitamin B2', unit: 'mg' },
  { key: 'vitamin_b3_mg', label_es: 'Vitamina B3', label_en: 'Vitamin B3', unit: 'mg' },
  { key: 'vitamin_b5_mg', label_es: 'Vitamina B5', label_en: 'Vitamin B5', unit: 'mg' },
  { key: 'vitamin_b6_mg', label_es: 'Vitamina B6', label_en: 'Vitamin B6', unit: 'mg' },
  { key: 'vitamin_b7_ug', label_es: 'Biotina', label_en: 'Biotin', unit: 'ug' },
  { key: 'vitamin_b12_mcg', label_es: 'Vitamina B12', label_en: 'Vitamin B12', unit: 'mcg' },
  { key: 'folate_mcg', label_es: 'Folato', label_en: 'Folate', unit: 'mcg' },
  { key: 'iodine_ug', label_es: 'Yodo', label_en: 'Iodine', unit: 'ug' },
  { key: 'choline_mg', label_es: 'Colina', label_en: 'Choline', unit: 'mg' },
  { key: 'beta_carotene_ug', label_es: 'Beta-caroteno', label_en: 'Beta-carotene', unit: 'ug' },
];
