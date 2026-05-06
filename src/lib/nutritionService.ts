import { supabase } from './supabase';
import type { NutritionAnamnesis, MealPlan, DiaryEntry, Recipe, ShoppingListItem } from '../types/nutritionModule';

export async function getAnamnesis(userId: string) {
  const { data, error } = await supabase
    .from('nutrition_anamnesis')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return { data: data as NutritionAnamnesis | null, error };
}

export async function upsertAnamnesis(anamnesis: Partial<NutritionAnamnesis> & { user_id: string }) {
  const now = new Date().toISOString();
  if (anamnesis.id) {
    const { data, error } = await supabase
      .from('nutrition_anamnesis')
      .update({ ...anamnesis, updated_at: now })
      .eq('id', anamnesis.id)
      .select()
      .maybeSingle();
    return { data: data as NutritionAnamnesis | null, error };
  } else {
    const { data, error } = await supabase
      .from('nutrition_anamnesis')
      .insert({ ...anamnesis, updated_at: now })
      .select()
      .maybeSingle();
    return { data: data as NutritionAnamnesis | null, error };
  }
}

export async function getMealPlans(userId: string) {
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data: (data ?? []) as MealPlan[], error };
}

export async function upsertMealPlan(plan: Partial<MealPlan> & { user_id: string }) {
  const now = new Date().toISOString();
  if (plan.id) {
    const { data, error } = await supabase
      .from('meal_plans')
      .update({ ...plan, updated_at: now })
      .eq('id', plan.id)
      .select()
      .maybeSingle();
    return { data: data as MealPlan | null, error };
  } else {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert({ ...plan, updated_at: now })
      .select()
      .maybeSingle();
    return { data: data as MealPlan | null, error };
  }
}

export async function deleteMealPlan(id: string) {
  return supabase.from('meal_plans').delete().eq('id', id);
}

export async function getDiaryEntries(userId: string, date: string) {
  const { data, error } = await supabase
    .from('daily_food_diary')
    .select('*')
    .eq('user_id', userId)
    .eq('diary_date', date)
    .order('sort_order');
  return { data: (data ?? []) as DiaryEntry[], error };
}

export async function getDiaryRange(userId: string, from: string, to: string) {
  const { data, error } = await supabase
    .from('daily_food_diary')
    .select('*')
    .eq('user_id', userId)
    .gte('diary_date', from)
    .lte('diary_date', to)
    .order('diary_date')
    .order('sort_order');
  return { data: (data ?? []) as DiaryEntry[], error };
}

export async function insertDiaryEntry(entry: Omit<DiaryEntry, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('daily_food_diary')
    .insert(entry)
    .select()
    .maybeSingle();
  return { data: data as DiaryEntry | null, error };
}

export async function updateDiaryEntry(id: string, updates: Partial<DiaryEntry>) {
  const { data, error } = await supabase
    .from('daily_food_diary')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  return { data: data as DiaryEntry | null, error };
}

export async function deleteDiaryEntry(id: string) {
  return supabase.from('daily_food_diary').delete().eq('id', id);
}

export async function getRecipes(userId: string) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .or(`user_id.eq.${userId},is_public.eq.true`)
    .order('is_favorite', { ascending: false })
    .order('name');
  return { data: (data ?? []) as Recipe[], error };
}

export async function upsertRecipe(recipe: Partial<Recipe> & { user_id: string }) {
  const now = new Date().toISOString();
  if (recipe.id) {
    const { data, error } = await supabase
      .from('recipes')
      .update({ ...recipe, updated_at: now })
      .eq('id', recipe.id)
      .select()
      .maybeSingle();
    return { data: data as Recipe | null, error };
  } else {
    const { data, error } = await supabase
      .from('recipes')
      .insert({ ...recipe, updated_at: now })
      .select()
      .maybeSingle();
    return { data: data as Recipe | null, error };
  }
}

export async function deleteRecipe(id: string) {
  return supabase.from('recipes').delete().eq('id', id);
}

export async function getShoppingList(userId: string, mealPlanId?: string) {
  let q = supabase
    .from('shopping_list_items')
    .select('*')
    .eq('user_id', userId)
    .order('category')
    .order('sort_order');
  if (mealPlanId) q = q.eq('meal_plan_id', mealPlanId);
  const { data, error } = await q;
  return { data: (data ?? []) as ShoppingListItem[], error };
}

export async function insertShoppingItem(item: Omit<ShoppingListItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('shopping_list_items')
    .insert(item)
    .select()
    .maybeSingle();
  return { data: data as ShoppingListItem | null, error };
}

export async function updateShoppingItem(id: string, updates: Partial<ShoppingListItem>) {
  const { data, error } = await supabase
    .from('shopping_list_items')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  return { data: data as ShoppingListItem | null, error };
}

export async function deleteShoppingItem(id: string) {
  return supabase.from('shopping_list_items').delete().eq('id', id);
}

export async function clearCheckedItems(userId: string) {
  return supabase
    .from('shopping_list_items')
    .delete()
    .eq('user_id', userId)
    .eq('is_checked', true);
}
