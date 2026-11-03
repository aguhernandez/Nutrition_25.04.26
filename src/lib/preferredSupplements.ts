import { supabase } from './supabase';

export interface PreferredSupplementReference {
  foodId: string;
  nameEs: string;
  nameEn: string;
  brand: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isLocalProfileId(value: string | null | undefined): value is string {
  return Boolean(value && UUID_RE.test(value));
}

export async function getPreferredSupplementIds(athleteId: string | null | undefined) {
  if (!isLocalProfileId(athleteId)) return { data: [] as string[], error: null };
  const { data, error } = await supabase
    .from('athlete_preferred_library_supplements')
    .select('food_id')
    .eq('athlete_id', athleteId);
  return { data: (data ?? []).map((row) => row.food_id as string), error };
}

export async function setPreferredSupplement(athleteId: string, foodId: string, preferred: boolean) {
  if (preferred) {
    return supabase.from('athlete_preferred_library_supplements').insert({ athlete_id: athleteId, food_id: foodId });
  }
  return supabase
    .from('athlete_preferred_library_supplements')
    .delete()
    .eq('athlete_id', athleteId)
    .eq('food_id', foodId);
}

export async function getPreferredSupplementReferences(athleteId: string | null | undefined) {
  if (!isLocalProfileId(athleteId)) return { data: [] as PreferredSupplementReference[], error: null };
  const { data, error } = await supabase
    .from('athlete_preferred_library_supplements')
    .select('food_id, foods_v2(name_es, name_en, brand)')
    .eq('athlete_id', athleteId);
  return {
    data: (data ?? []).map((row) => {
      const food = Array.isArray(row.foods_v2) ? row.foods_v2[0] : row.foods_v2;
      return { foodId: row.food_id as string, nameEs: food?.name_es ?? '', nameEn: food?.name_en ?? '', brand: food?.brand ?? '' };
    }),
    error,
  };
}
