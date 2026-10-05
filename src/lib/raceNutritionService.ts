import { supabase } from './supabase';
import type { NutritionProduct, RaceNutritionAssignment, RaceNutritionRecipe } from '../types/nutrition';

interface AssignmentRow {
  id: string;
  competition_id: string;
  product_id: string | null;
  recipe_id: string | null;
  timing_mode: RaceNutritionAssignment['timing_mode'];
  timing_minutes: number | null;
  distance_marker: number | null;
  aid_station_name: string | null;
  quantity: number;
  note: string;
  created_at: string;
  updated_at: string;
  nutrition_products: NutritionProduct | NutritionProduct[] | null;
  recipes: RaceNutritionRecipe | RaceNutritionRecipe[] | null;
}

function toAssignment(row: AssignmentRow): RaceNutritionAssignment | null {
  const product = Array.isArray(row.nutrition_products) ? row.nutrition_products[0] : row.nutrition_products;
  const recipe = Array.isArray(row.recipes) ? row.recipes[0] : row.recipes;
  if (!product && !recipe) return null;
  return { ...row, product: product ?? null, recipe: recipe ?? null };
}

export async function getRaceNutritionAssignments(competitionId: string): Promise<RaceNutritionAssignment[]> {
  const { data, error } = await supabase
    .from('race_nutrition_assignments')
    .select('*, nutrition_products(*), recipes(*)')
    .eq('competition_id', competitionId)
    .order('timing_minutes', { ascending: true, nullsFirst: false })
    .order('distance_marker', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[raceNutritionService] load error:', error);
    return [];
  }
  return ((data ?? []) as AssignmentRow[]).map(toAssignment).filter((item): item is RaceNutritionAssignment => item !== null);
}

export async function createRaceNutritionAssignment(input: {
  competitionId: string;
  productId?: string | null;
  recipeId?: string | null;
  timingMode: RaceNutritionAssignment['timing_mode'];
  timingMinutes?: number | null;
  distanceMarker?: number | null;
  aidStationName?: string | null;
  quantity: number;
  note: string;
}): Promise<RaceNutritionAssignment | null> {
  const { data, error } = await supabase
    .from('race_nutrition_assignments')
    .insert({
      competition_id: input.competitionId,
      product_id: input.productId ?? null,
      recipe_id: input.recipeId ?? null,
      timing_mode: input.timingMode,
      timing_minutes: input.timingMode === 'time' ? input.timingMinutes : null,
      distance_marker: input.timingMode === 'distance' ? input.distanceMarker : null,
      aid_station_name: input.timingMode === 'aid_station' ? input.aidStationName?.trim() || null : null,
      quantity: input.quantity,
      note: input.note.trim(),
    })
    .select('*, nutrition_products(*), recipes(*)')
    .maybeSingle();

  if (error) {
    console.error('[raceNutritionService] create error:', error);
    return null;
  }
  return data ? toAssignment(data as AssignmentRow) : null;
}

export async function updateRaceNutritionAssignment(
  id: string,
  input: Omit<Parameters<typeof createRaceNutritionAssignment>[0], 'competitionId'>,
): Promise<RaceNutritionAssignment | null> {
  const { data, error } = await supabase
    .from('race_nutrition_assignments')
    .update({
      product_id: input.productId ?? null,
      recipe_id: input.recipeId ?? null,
      timing_mode: input.timingMode,
      timing_minutes: input.timingMode === 'time' ? input.timingMinutes : null,
      distance_marker: input.timingMode === 'distance' ? input.distanceMarker : null,
      aid_station_name: input.timingMode === 'aid_station' ? input.aidStationName?.trim() || null : null,
      quantity: input.quantity,
      note: input.note.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, nutrition_products(*), recipes(*)')
    .maybeSingle();

  if (error) {
    console.error('[raceNutritionService] update error:', error);
    return null;
  }
  return data ? toAssignment(data as AssignmentRow) : null;
}

export async function deleteRaceNutritionAssignment(id: string): Promise<boolean> {
  const { error } = await supabase.from('race_nutrition_assignments').delete().eq('id', id);
  if (error) {
    console.error('[raceNutritionService] delete error:', error);
    return false;
  }
  return true;
}
