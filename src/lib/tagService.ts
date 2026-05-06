import { supabase } from './supabase';
import { pushTags } from './hubApi';
import type { HubTagPayload } from './hubApi';

export interface Tag {
  id: string;
  name: string;
  name_es: string | null;
  slug: string;
  category: string;
  description: string | null;
  color: string;
  created_by: string | null;
  created_at: string;
}

export type TagCategory = 'training' | 'nutrition' | 'recovery' | 'performance' | 'mindset' | 'methodology' | 'other';

export const TAG_CATEGORIES: { value: TagCategory; label_es: string; label_en: string; color: string }[] = [
  { value: 'training', label_es: 'Entrenamiento', label_en: 'Training', color: '#2563eb' },
  { value: 'nutrition', label_es: 'Nutrición', label_en: 'Nutrition', color: '#16a34a' },
  { value: 'recovery', label_es: 'Recuperación', label_en: 'Recovery', color: '#0891b2' },
  { value: 'performance', label_es: 'Rendimiento', label_en: 'Performance', color: '#d97706' },
  { value: 'mindset', label_es: 'Mentalidad', label_en: 'Mindset', color: '#7c3aed' },
  { value: 'methodology', label_es: 'Metodología', label_en: 'Methodology', color: '#be185d' },
  { value: 'other', label_es: 'Otro', label_en: 'Other', color: '#6b7280' },
];

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getAllTags(): Promise<Tag[]> {
  const { data } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true });
  return (data ?? []) as Tag[];
}

export async function searchTags(query: string): Promise<Tag[]> {
  if (!query.trim()) return getAllTags();
  const { data } = await supabase
    .from('tags')
    .select('*')
    .or(`name.ilike.%${query}%,name_es.ilike.%${query}%,slug.ilike.%${query}%`)
    .order('name', { ascending: true })
    .limit(20);
  return (data ?? []) as Tag[];
}

export async function createTag(name: string, category: TagCategory, color: string, createdBy?: string): Promise<Tag | null> {
  const slug = toSlug(name);
  const { data } = await supabase
    .from('tags')
    .insert({ name, name_es: name, slug, category, color, created_by: createdBy ?? null })
    .select()
    .maybeSingle();
  return data as Tag | null;
}

export async function getTagsForMealPlan(planId: string): Promise<Tag[]> {
  const { data } = await supabase
    .from('meal_plan_tags')
    .select('tags(*)')
    .eq('meal_plan_id', planId);
  return ((data ?? []).map((row: any) => row.tags).filter(Boolean)) as Tag[];
}

export async function setTagsForMealPlan(planId: string, tagIds: string[]): Promise<void> {
  await supabase.from('meal_plan_tags').delete().eq('meal_plan_id', planId);
  if (tagIds.length === 0) return;
  await supabase.from('meal_plan_tags').insert(tagIds.map((tag_id) => ({ meal_plan_id: planId, tag_id })));
}

export async function getTagsForCompetition(competitionId: string): Promise<Tag[]> {
  const { data } = await supabase
    .from('competition_tags')
    .select('tags(*)')
    .eq('competition_id', competitionId);
  return ((data ?? []).map((row: any) => row.tags).filter(Boolean)) as Tag[];
}

export async function setTagsForCompetition(competitionId: string, tagIds: string[]): Promise<void> {
  await supabase.from('competition_tags').delete().eq('competition_id', competitionId);
  if (tagIds.length === 0) return;
  await supabase.from('competition_tags').insert(tagIds.map((tag_id) => ({ competition_id: competitionId, tag_id })));
}

export async function getTagsForRecipe(recipeId: string): Promise<Tag[]> {
  const { data } = await supabase
    .from('recipe_tags')
    .select('tags(*)')
    .eq('recipe_id', recipeId);
  return ((data ?? []).map((row: any) => row.tags).filter(Boolean)) as Tag[];
}

export async function setTagsForRecipe(recipeId: string, tagIds: string[]): Promise<void> {
  await supabase.from('recipe_tags').delete().eq('recipe_id', recipeId);
  if (tagIds.length === 0) return;
  await supabase.from('recipe_tags').insert(tagIds.map((tag_id) => ({ recipe_id: recipeId, tag_id })));
}

export async function collectAthleteTagsForHub(athleteId: string): Promise<HubTagPayload[]> {
  const tagMap = new Map<string, Tag & { source_context?: string }>();

  const { data: planRows } = await supabase
    .from('meal_plan_tags')
    .select('tags(*), meal_plan_id, meal_plans_v2!inner(athlete_id, title)')
    .eq('meal_plans_v2.athlete_id', athleteId);

  (planRows ?? []).forEach((row: any) => {
    const tag = row.tags as Tag;
    if (!tag || tagMap.has(tag.slug)) return;
    tagMap.set(tag.slug, { ...tag, source_context: row.meal_plans_v2?.title ?? undefined });
  });

  const { data: compRows } = await supabase
    .from('competition_tags')
    .select('tags(*), competition_id, competitions!inner(user_id, race_name)')
    .eq('competitions.user_id', athleteId);

  (compRows ?? []).forEach((row: any) => {
    const tag = row.tags as Tag;
    if (!tag || tagMap.has(tag.slug)) return;
    tagMap.set(tag.slug, { ...tag, source_context: row.competitions?.race_name ?? undefined });
  });

  const { data: recipeRows } = await supabase
    .from('recipe_tags')
    .select('tags(*), recipe_id, nutrition_recipes_v2!inner(created_by, name)')
    .eq('nutrition_recipes_v2.created_by', athleteId);

  (recipeRows ?? []).forEach((row: any) => {
    const tag = row.tags as Tag;
    if (!tag || tagMap.has(tag.slug)) return;
    tagMap.set(tag.slug, { ...tag, source_context: row.nutrition_recipes_v2?.name ?? undefined });
  });

  return Array.from(tagMap.values()).map((tag) => ({
    name: tag.name,
    name_es: tag.name_es ?? undefined,
    slug: tag.slug,
    category: tag.category,
    color: tag.color,
    description: tag.description ?? undefined,
    source_context: tag.source_context,
  }));
}

export async function syncAthleteTagsToHub(
  athleteEmailOrId: string,
  profileId: string
): Promise<void> {
  try {
    const tags = await collectAthleteTagsForHub(profileId);
    if (tags.length === 0) return;
    await pushTags(athleteEmailOrId, tags);
  } catch {
    // Non-critical: sync failure should not break main flow
  }
}
