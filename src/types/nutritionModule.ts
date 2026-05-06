export type NutritionGoal = 'weight_loss' | 'muscle_gain' | 'performance' | 'endurance' | 'health';
export type TrainingPhase = 'base' | 'build' | 'peak' | 'taper' | 'recovery' | 'off';
export type DietaryPattern = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo' | 'other';
export type GIHistory = 'none' | 'mild' | 'moderate' | 'severe';
export type PlanType = 'base' | 'load' | 'taper' | 'race_day' | 'recovery' | 'custom';
export type RecipeCategory = 'breakfast' | 'snack' | 'lunch' | 'dinner' | 'recovery' | 'pre_race' | 'during_race' | 'post_race' | 'meal';
export type ShoppingCategory = 'produce' | 'protein' | 'dairy' | 'grains' | 'fats' | 'supplements' | 'beverages' | 'frozen' | 'pantry' | 'other';

export type MealSlot =
  | 'pre_sleep'
  | 'wake_up'
  | 'breakfast'
  | 'mid_morning'
  | 'lunch'
  | 'pre_training'
  | 'during_training'
  | 'post_training'
  | 'afternoon_snack'
  | 'dinner'
  | 'evening_snack';

export interface Macros {
  calories_kcal: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  fiber_g?: number;
  sodium_mg?: number;
  sugar_g?: number;
}

export interface NutritionAnamnesis {
  id: string;
  user_id: string;
  primary_goal: NutritionGoal;
  secondary_goals: string[];
  body_weight_kg: number;
  body_height_cm: number;
  body_fat_pct: number | null;
  lean_mass_kg: number | null;
  weekly_training_hours: number;
  primary_sport: string;
  training_phase: TrainingPhase;
  next_race_date: string | null;
  dietary_pattern: DietaryPattern;
  food_allergies: string[];
  food_intolerances: string[];
  disliked_foods: string[];
  preferred_foods: string[];
  gi_history: GIHistory;
  gut_trained: boolean;
  current_supplements: string[];
  target_calories_kcal: number | null;
  target_carbs_g: number | null;
  target_protein_g: number | null;
  target_fat_g: number | null;
  target_hydration_ml: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface MealFoodItem extends Macros {
  id: string;
  food_name: string;
  brand: string;
  serving_quantity: number;
  serving_unit: string;
}

export interface DayMeals {
  breakfast: MealFoodItem[];
  mid_morning: MealFoodItem[];
  lunch: MealFoodItem[];
  pre_training: MealFoodItem[];
  during_training: MealFoodItem[];
  post_training: MealFoodItem[];
  afternoon_snack: MealFoodItem[];
  dinner: MealFoodItem[];
  evening_snack: MealFoodItem[];
  [key: string]: MealFoodItem[];
}

export interface MealPlan {
  id: string;
  user_id: string;
  name: string;
  description: string;
  plan_type: PlanType;
  duration_days: number;
  meals: Record<string, DayMeals>;
  daily_totals: Macros[];
  is_template: boolean;
  is_active: boolean;
  competition_id: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface DiaryEntry extends Macros {
  id: string;
  user_id: string;
  diary_date: string;
  meal_slot: MealSlot;
  food_name: string;
  brand: string;
  serving_quantity: number;
  serving_unit: string;
  is_training_day: boolean;
  training_type: string;
  notes: string;
  ai_suggestion: string;
  sort_order: number;
  created_at: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface Recipe {
  id: string;
  user_id: string | null;
  name: string;
  name_es: string;
  name_en: string;
  culture: string;
  description: string;
  description_es: string;
  description_en: string;
  category: RecipeCategory;
  prep_time_min: number;
  cook_time_min: number;
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: string;
  instructions_es: string;
  instructions_en: string;
  calories_kcal: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  fiber_g: number;
  sodium_mg: number;
  tags: string[];
  suitable_for: string[];
  image_url: string;
  is_public: boolean;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItem {
  id: string;
  user_id: string;
  meal_plan_id: string | null;
  item_name: string;
  quantity: number;
  unit: string;
  category: ShoppingCategory;
  is_checked: boolean;
  notes: string;
  sort_order: number;
  created_at: string;
}

export interface DailyNutritionSummary {
  date: string;
  total: Macros;
  target: Macros | null;
  entries: DiaryEntry[];
  adherence_pct: number;
  training_day: boolean;
  training_type: string;
}
