export interface NutritionProfile {
  age: number;
  sex: 'male' | 'female';
  weight_kg: number;
  height_cm: number;
  activity_factor?: number;
  goal_type?: 'maintain' | 'gain_muscle' | 'lose_fat' | 'recomp';
  lean_mass_kg?: number;
  fat_mass_kg?: number;
}

export interface TrainingLoad {
  duration_minutes: number;
  intensity: 'low' | 'moderate' | 'high' | 'very_high';
  type: 'strength' | 'endurance' | 'mixed' | 'rest';
}

export interface FuelDayResult {
  fuel_day_type: 'green' | 'yellow' | 'red';
  total_kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  protein_percent: number;
  carbs_percent: number;
  fat_percent: number;
  training_load_score: number;
}

export function calculateBMR(profile: NutritionProfile): number {
  const { age, sex, weight_kg, height_cm } = profile;
  if (sex === 'male') return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
}

export function calculateTDEE(bmr: number, activityFactor: number = 1.2): number {
  return bmr * activityFactor;
}

export function calculateProteinTarget(profile: NutritionProfile): number {
  if (profile.lean_mass_kg) return profile.lean_mass_kg * 2.2;
  return profile.weight_kg * 2.0;
}

export function calculateTrainingLoadScore(training: TrainingLoad): number {
  const intensityScores = { low: 1, moderate: 2, high: 3, very_high: 4 };
  const typeMultipliers = { rest: 0, strength: 1.0, endurance: 1.2, mixed: 1.1 };
  if (training.type === 'rest') return 0;
  const baseScore = intensityScores[training.intensity];
  const durationFactor = Math.min(training.duration_minutes / 60, 3);
  const typeMultiplier = typeMultipliers[training.type];
  return baseScore * durationFactor * typeMultiplier;
}

export function determineFuelDayType(trainingLoadScore: number): 'green' | 'yellow' | 'red' {
  if (trainingLoadScore >= 3.5) return 'green';
  if (trainingLoadScore >= 1.5) return 'yellow';
  return 'red';
}

export function calculateDailyMacros(profile: NutritionProfile, trainingLoad: TrainingLoad): FuelDayResult {
  const bmr = calculateBMR(profile);
  const activityFactor = profile.activity_factor || 1.2;
  const tdee = calculateTDEE(bmr, activityFactor);
  const trainingLoadScore = calculateTrainingLoadScore(trainingLoad);
  const fuelDayType = determineFuelDayType(trainingLoadScore);
  const proteinTarget = calculateProteinTarget(profile);
  const goalMultipliers = { maintain: 1.0, gain_muscle: 1.15, lose_fat: 0.85, recomp: 0.95 };
  const goalMultiplier = goalMultipliers[profile.goal_type || 'maintain'];

  let totalKcal: number, carbsPercent: number, proteinPercent: number, fatPercent: number;

  if (fuelDayType === 'green') {
    totalKcal = Math.round(tdee * goalMultiplier * 1.2);
    carbsPercent = 55; proteinPercent = 20; fatPercent = 25;
  } else if (fuelDayType === 'yellow') {
    totalKcal = Math.round(tdee * goalMultiplier);
    carbsPercent = 45; proteinPercent = 25; fatPercent = 30;
  } else {
    totalKcal = Math.round(tdee * goalMultiplier * 0.85);
    carbsPercent = 35; proteinPercent = 30; fatPercent = 35;
  }

  const proteinKcalFromPercent = (totalKcal * proteinPercent) / 100;
  const finalProteinG = Math.max(proteinTarget, proteinKcalFromPercent / 4);
  const remainingKcal = totalKcal - (finalProteinG * 4);
  const carbsG = Math.round((remainingKcal * (carbsPercent / (carbsPercent + fatPercent))) / 4);
  const fatG = Math.round((remainingKcal * (fatPercent / (carbsPercent + fatPercent))) / 9);

  return {
    fuel_day_type: fuelDayType,
    total_kcal: totalKcal,
    protein_g: Math.round(finalProteinG),
    carbs_g: carbsG,
    fat_g: fatG,
    protein_percent: Math.round((finalProteinG * 4 / totalKcal) * 100),
    carbs_percent: Math.round((carbsG * 4 / totalKcal) * 100),
    fat_percent: Math.round((fatG * 9 / totalKcal) * 100),
    training_load_score: trainingLoadScore,
  };
}

export function getFuelDayColor(type: 'green' | 'yellow' | 'red') {
  switch (type) {
    case 'green': return { bg: 'bg-gradient-to-br from-green-50 to-emerald-100', text: 'text-green-700', border: 'border-green-300', badge: 'bg-green-500' };
    case 'yellow': return { bg: 'bg-gradient-to-br from-yellow-50 to-amber-100', text: 'text-yellow-700', border: 'border-yellow-300', badge: 'bg-yellow-500' };
    case 'red': return { bg: 'bg-gradient-to-br from-red-50 to-orange-100', text: 'text-red-700', border: 'border-red-300', badge: 'bg-red-500' };
  }
}

export function getMealTypeIcon(mealType: string): string {
  const icons: Record<string, string> = {
    breakfast: '🌅',
    morning_snack: '☕',
    lunch: '🍽️',
    afternoon_snack: '🍎',
    pre_training: '⚡',
    during_training: '💧',
    post_training: '💪',
    dinner: '🌙',
    evening_snack: '🌃',
  };
  return icons[mealType] || '🍴';
}

export function getMealTypeLabel(mealType: string, lang: 'es' | 'en' = 'es'): string {
  const labels: Record<string, { es: string; en: string }> = {
    breakfast: { es: 'Desayuno', en: 'Breakfast' },
    morning_snack: { es: 'Colación Mañana', en: 'Morning Snack' },
    lunch: { es: 'Almuerzo', en: 'Lunch' },
    afternoon_snack: { es: 'Merienda', en: 'Afternoon Snack' },
    pre_training: { es: 'Pre-Entrenamiento', en: 'Pre-Training' },
    during_training: { es: 'Durante Entreno', en: 'During Training' },
    post_training: { es: 'Post-Entrenamiento', en: 'Post-Training' },
    dinner: { es: 'Cena', en: 'Dinner' },
    evening_snack: { es: 'Colación Nocturna', en: 'Evening Snack' },
  };
  return labels[mealType]?.[lang] || mealType;
}

export function calculateAdherenceScore(
  targetKcal: number, actualKcal: number,
  targetProtein: number, actualProtein: number,
  targetCarbs: number, actualCarbs: number,
  targetFat: number, actualFat: number
): number {
  const kcalScore = Math.max(0, 100 - (Math.abs(targetKcal - actualKcal) / targetKcal * 100));
  const proteinScore = Math.max(0, 100 - (Math.abs(targetProtein - actualProtein) / targetProtein * 100));
  const carbsScore = Math.max(0, 100 - (Math.abs(targetCarbs - actualCarbs) / targetCarbs * 100));
  const fatScore = Math.max(0, 100 - (Math.abs(targetFat - actualFat) / targetFat * 100));
  return Math.round(kcalScore * 0.4 + proteinScore * 0.3 + carbsScore * 0.2 + fatScore * 0.1);
}

export const DEFAULT_WEEK_PATTERN: Array<'green' | 'yellow' | 'red'> = [
  'yellow',
  'green',
  'yellow',
  'green',
  'yellow',
  'red',
  'red',
];

export const FUEL_DAY_LABELS = {
  green: { es: 'Alto CHO', en: 'High Carb', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300', dot: 'bg-green-500' },
  yellow: { es: 'CHO Moderado', en: 'Moderate Carb', color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-300', dot: 'bg-yellow-500' },
  red: { es: 'Bajo CHO', en: 'Low Carb', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300', dot: 'bg-red-500' },
};

export function getDayTargetMacros(
  baseCals: number, baseProtein: number, baseCarbs: number, baseFat: number,
  fuelType: 'green' | 'yellow' | 'red'
) {
  const multipliers = { green: 1.2, yellow: 1.0, red: 0.85 };
  const macroSplits = {
    green: { carbs: 55, protein: 20, fat: 25 },
    yellow: { carbs: 45, protein: 25, fat: 30 },
    red: { carbs: 35, protein: 30, fat: 35 },
  };
  const kcal = Math.round(baseCals * multipliers[fuelType]);
  const split = macroSplits[fuelType];
  return {
    calories: kcal,
    protein: Math.round((kcal * split.protein / 100) / 4),
    carbs: Math.round((kcal * split.carbs / 100) / 4),
    fat: Math.round((kcal * split.fat / 100) / 9),
  };
}
