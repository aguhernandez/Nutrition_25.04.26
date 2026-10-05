export type NutritionCategory = 'drink' | 'gel' | 'chew' | 'bar' | 'electrolyte_tablet' | 'gummy' | 'capsule' | 'real_food';

export interface NutritionProduct {
  id: string;
  brand: string;
  product_name: string;
  full_name: string;
  category: NutritionCategory;
  calories_per_serving: number;
  carbs_g: number;
  sugars_g: number;
  sodium_mg: number;
  potassium_mg: number;
  caffeine_mg: number;
  serving_size_ml?: number;
  serving_size_g?: number;
  flavors: string[];
  price_range: '$' | '$$' | '$$$';
  notes: string;
  suitable_for: string[];
}

export type FuelType = 'gel' | 'chew' | 'bar' | 'liquid';

export interface SegmentFuelItem {
  productId: string;
  productName: string;
  brand: string;
  quantity: number;
  carbsG: number;
  sodiumMg: number;
  caffeineM: number;
  type: FuelType;
}

export interface RaceNutritionAssignment {
  id: string;
  competition_id: string;
  product_id: string;
  product: NutritionProduct;
  timing_mode: 'time' | 'distance' | 'aid_station';
  timing_minutes: number | null;
  distance_marker: number | null;
  aid_station_name: string | null;
  quantity: number;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface RaceNutritionPlan {
  primaryFuelType: FuelType;
  primaryDrinkProductId?: string;
  primaryGelProductId?: string;
  electrolyteProductId?: string;
  segmentFueling: Record<string, SegmentFuelItem[]>;
  totalCarbsG: number;
  totalSodiumMg: number;
  totalCaffeineM: number;
  notes: string;
  timeline?: RaceNutritionAssignment[];
}
