import { supabase } from './supabase';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isLocalProfileId(value: string | null | undefined): value is string {
  return Boolean(value && UUID_RE.test(value));
}

export async function getPreferredSupplementIds(athleteId: string | null | undefined) {
  if (!isLocalProfileId(athleteId)) return { data: [] as string[], error: null };
  const { data, error } = await supabase
    .from('athlete_preferred_supplements')
    .select('product_id')
    .eq('athlete_id', athleteId);
  return { data: (data ?? []).map((row) => row.product_id as string), error };
}

export async function setPreferredSupplement(athleteId: string, productId: string, preferred: boolean) {
  if (preferred) {
    return supabase.from('athlete_preferred_supplements').insert({ athlete_id: athleteId, product_id: productId });
  }
  return supabase
    .from('athlete_preferred_supplements')
    .delete()
    .eq('athlete_id', athleteId)
    .eq('product_id', productId);
}
