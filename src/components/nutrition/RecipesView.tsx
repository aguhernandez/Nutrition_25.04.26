import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Plus, Heart, Clock, Users, Search, Trash2, BookOpen, Loader2, X, Check, CreditCard as Edit2, Globe, ChefHat, Flame } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';
import { getRecipes, upsertRecipe, deleteRecipe } from '../../lib/nutritionService';
import type { Recipe, RecipeCategory, RecipeIngredient } from '../../types/nutritionModule';
import { getTagsForRecipe, setTagsForRecipe } from '../../lib/tagService';
import type { Tag } from '../../lib/tagService';
import TagSelector from '../shared/TagSelector';

interface Props {
  onBack: () => void;
  isAdmin?: boolean;
}

const CATEGORIES: { value: RecipeCategory; label_es: string; label_en: string; color: string; bg: string }[] = [
  { value: 'breakfast', label_es: 'Desayuno', label_en: 'Breakfast', color: '#b45309', bg: '#fef3c7' },
  { value: 'pre_race', label_es: 'Pre Carrera', label_en: 'Pre Race', color: '#be185d', bg: '#fdf2f8' },
  { value: 'during_race', label_es: 'Durante Carrera', label_en: 'During Race', color: '#dc2626', bg: '#fef2f2' },
  { value: 'post_race', label_es: 'Post Carrera', label_en: 'Post Race', color: '#15803d', bg: '#f0fdf4' },
  { value: 'recovery', label_es: 'Recuperación', label_en: 'Recovery', color: '#0369a1', bg: '#e0f2fe' },
  { value: 'snack', label_es: 'Snack', label_en: 'Snack', color: '#7c3aed', bg: '#f5f3ff' },
  { value: 'lunch', label_es: 'Almuerzo', label_en: 'Lunch', color: '#374151', bg: '#f9fafb' },
  { value: 'dinner', label_es: 'Cena', label_en: 'Dinner', color: '#1d4ed8', bg: '#eff6ff' },
  { value: 'meal', label_es: 'General', label_en: 'General', color: '#6b7280', bg: '#f3f4f6' },
];

const CULTURES: { value: string; label_es: string; label_en: string; flag: string }[] = [
  { value: 'all', label_es: 'Todas', label_en: 'All', flag: '🌍' },
  { value: 'ethiopian', label_es: 'Etiopía', label_en: 'Ethiopian', flag: '🇪🇹' },
  { value: 'kenyan', label_es: 'Kenia', label_en: 'Kenyan', flag: '🇰🇪' },
  { value: 'west_african', label_es: 'África Occidental', label_en: 'West African', flag: '🌍' },
  { value: 'south_african', label_es: 'Sudáfrica', label_en: 'South African', flag: '🇿🇦' },
  { value: 'north_african', label_es: 'Norte África', label_en: 'North African', flag: '🇲🇦' },
  { value: 'latin_american', label_es: 'Latinoamérica', label_en: 'Latin American', flag: '🌎' },
  { value: 'japanese', label_es: 'Japonesa', label_en: 'Japanese', flag: '🇯🇵' },
  { value: 'korean', label_es: 'Coreana', label_en: 'Korean', flag: '🇰🇷' },
  { value: 'chinese', label_es: 'China', label_en: 'Chinese', flag: '🇨🇳' },
  { value: 'thai', label_es: 'Tailandesa', label_en: 'Thai', flag: '🇹🇭' },
  { value: 'vietnamese', label_es: 'Vietnamita', label_en: 'Vietnamese', flag: '🇻🇳' },
  { value: 'indonesian', label_es: 'Indonesia', label_en: 'Indonesian', flag: '🇮🇩' },
  { value: 'indian', label_es: 'India', label_en: 'Indian', flag: '🇮🇳' },
  { value: 'sri_lankan', label_es: 'Sri Lanka', label_en: 'Sri Lankan', flag: '🇱🇰' },
  { value: 'middle_eastern', label_es: 'Oriente Medio', label_en: 'Middle Eastern', flag: '🕌' },
  { value: 'mediterranean', label_es: 'Mediterránea', label_en: 'Mediterranean', flag: '🌊' },
  { value: 'italian', label_es: 'Italiana', label_en: 'Italian', flag: '🇮🇹' },
  { value: 'spanish', label_es: 'Española', label_en: 'Spanish', flag: '🇪🇸' },
  { value: 'scandinavian', label_es: 'Escandinava', label_en: 'Scandinavian', flag: '🇸🇪' },
  { value: 'eastern_european', label_es: 'Europa del Este', label_en: 'Eastern European', flag: '🇵🇱' },
  { value: 'caribbean', label_es: 'Caribeña', label_en: 'Caribbean', flag: '🏝️' },
  { value: 'central_american', label_es: 'Centroamérica', label_en: 'Central American', flag: '🇨🇷' },
  { value: 'global', label_es: 'Global', label_en: 'Global', flag: '🌐' },
];

const EMPTY_RECIPE: Omit<Recipe, 'id' | 'created_at' | 'updated_at'> = {
  user_id: null,
  name: '',
  name_es: '',
  name_en: '',
  culture: 'global',
  description: '',
  description_es: '',
  description_en: '',
  category: 'meal',
  prep_time_min: 15,
  cook_time_min: 0,
  servings: 1,
  ingredients: [],
  instructions: '',
  instructions_es: '',
  instructions_en: '',
  calories_kcal: 0,
  carbs_g: 0,
  protein_g: 0,
  fat_g: 0,
  fiber_g: 0,
  sodium_mg: 0,
  tags: [],
  suitable_for: ['all'],
  image_url: '',
  is_public: false,
  is_favorite: false,
};

function getCultureInfo(culture: string) {
  return CULTURES.find((c) => c.value === culture) ?? { flag: '🌐', label_es: culture, label_en: culture };
}

function getDisplayName(recipe: Recipe, es: boolean) {
  if (es) return recipe.name_es || recipe.name_en || recipe.name;
  return recipe.name_en || recipe.name_es || recipe.name;
}

function getDisplayDescription(recipe: Recipe, es: boolean) {
  if (es) return recipe.description_es || recipe.description_en || recipe.description || '';
  return recipe.description_en || recipe.description_es || recipe.description || '';
}

function getDisplayInstructions(recipe: Recipe, es: boolean) {
  if (es) return recipe.instructions_es || recipe.instructions_en || recipe.instructions || '';
  return recipe.instructions_en || recipe.instructions_es || recipe.instructions || '';
}

function RecipeCard({
  recipe, isAdmin, onFavorite, onDelete, onView, onEdit, es, tags,
}: {
  recipe: Recipe;
  isAdmin: boolean;
  onFavorite: (r: Recipe) => void;
  onDelete: (id: string) => void;
  onView: (r: Recipe) => void;
  onEdit: (r: Recipe) => void;
  es: boolean;
  tags?: Tag[];
}) {
  const cat = CATEGORIES.find((c) => c.value === recipe.category) ?? CATEGORIES[8];
  const culture = getCultureInfo(recipe.culture ?? 'global');
  const isSystem = recipe.user_id === null;
  const displayName = getDisplayName(recipe, es);
  const displayDesc = getDisplayDescription(recipe, es);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col"
      style={{ border: '2px solid #e5e7eb' }}
      onClick={() => onView(recipe)}
    >
      {recipe.image_url ? (
        <div className="relative">
          <img
            src={recipe.image_url}
            alt={displayName}
            className="w-full h-36 object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
            }}
          />
          <div className="w-full h-36 items-center justify-center hidden" style={{ backgroundColor: cat.bg }}>
            <BookOpen className="w-8 h-8" style={{ color: cat.color, opacity: 0.5 }} />
          </div>
          {isSystem && (
            <div className="absolute top-2 left-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#514163', color: '#fdda36' }}>
                {es ? 'Sistema' : 'System'}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-24 flex items-center justify-center" style={{ backgroundColor: cat.bg }}>
          <BookOpen className="w-8 h-8" style={{ color: cat.color, opacity: 0.5 }} />
          {isSystem && (
            <div className="absolute top-2 left-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#514163', color: '#fdda36' }}>
                {es ? 'Sistema' : 'System'}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ backgroundColor: cat.bg, color: cat.color }}>
            {es ? cat.label_es : cat.label_en}
          </span>
          <div className="flex items-center gap-0.5">
            <span className="text-xs" title={es ? culture.label_es : culture.label_en}>{culture.flag}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite(recipe); }}
              className="p-1 rounded-lg transition-all hover:bg-gray-100"
            >
              <Heart className="w-3.5 h-3.5" style={{ color: recipe.is_favorite ? '#ef4444' : '#d1d5db', fill: recipe.is_favorite ? '#ef4444' : 'none' }} />
            </button>
            {(isAdmin || (!isSystem)) && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(recipe); }}
                  className="p-1 rounded-lg hover:bg-blue-50 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}
                  className="p-1 rounded-lg hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
                </button>
              </>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-sm mb-1 leading-tight" style={{ color: '#1f2937' }}>{displayName}</h3>
        {displayDesc && (
          <p className="text-xs mb-2 line-clamp-2 flex-1" style={{ color: '#9ca3af' }}>{displayDesc}</p>
        )}

        <div className="flex items-center gap-3 text-xs mb-2" style={{ color: '#9ca3af' }}>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.prep_time_min + recipe.cook_time_min}m</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{recipe.servings}</span>
          <span className="flex items-center gap-1"><Flame className="w-3 h-3" style={{ color: '#f59e0b' }} />{Math.round(recipe.calories_kcal)} kcal</span>
        </div>

        <div className="grid grid-cols-3 gap-1 pt-2 border-t" style={{ borderColor: '#f3f4f6' }}>
          <div className="text-center">
            <div className="text-xs font-semibold" style={{ color: '#3b82f6' }}>{Math.round(recipe.carbs_g)}g</div>
            <div className="text-xs" style={{ color: '#9ca3af' }}>Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold" style={{ color: '#10b981' }}>{Math.round(recipe.protein_g)}g</div>
            <div className="text-xs" style={{ color: '#9ca3af' }}>{es ? 'Prot' : 'Prot'}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold" style={{ color: '#f97316' }}>{Math.round(recipe.fat_g)}g</div>
            <div className="text-xs" style={{ color: '#9ca3af' }}>{es ? 'Grasa' : 'Fat'}</div>
          </div>
        </div>
        {(tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 mt-1 border-t" style={{ borderColor: '#f3f4f6' }}>
            {(tags ?? []).slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: tag.color + '18', color: tag.color, border: `1px solid ${tag.color}33` }}
              >
                {tag.name_es || tag.name}
              </span>
            ))}
            {(tags ?? []).length > 3 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs" style={{ color: '#9ca3af' }}>
                +{(tags ?? []).length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

type LangTab = 'es' | 'en';

function RecipeFormModal({
  initial,
  initialRecipeId,
  isAdmin,
  userId,
  onClose,
  onSave,
  es,
}: {
  initial: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>;
  initialRecipeId?: string;
  isAdmin: boolean;
  userId: string;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
  es: boolean;
}) {
  const [form, setForm] = useState(initial);
  const [newIng, setNewIng] = useState<RecipeIngredient>({ name: '', quantity: 1, unit: 'g', calories: 0, carbs: 0, protein: 0, fat: 0 });
  const [saving, setSaving] = useState(false);
  const [langTab, setLangTab] = useState<LangTab>(es ? 'es' : 'en');
  const [recipeTags, setRecipeTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (initialRecipeId) {
      getTagsForRecipe(initialRecipeId).then(setRecipeTags);
    }
  }, [initialRecipeId]);

  const calcMacros = (ingredients: RecipeIngredient[]) => ({
    calories_kcal: ingredients.reduce((s, i) => s + i.calories, 0),
    carbs_g: ingredients.reduce((s, i) => s + i.carbs, 0),
    protein_g: ingredients.reduce((s, i) => s + i.protein, 0),
    fat_g: ingredients.reduce((s, i) => s + i.fat, 0),
  });

  const addIng = () => {
    if (!newIng.name.trim()) return;
    const updated = [...form.ingredients, { ...newIng }];
    setForm((f) => ({ ...f, ingredients: updated, ...calcMacros(updated) }));
    setNewIng({ name: '', quantity: 1, unit: 'g', calories: 0, carbs: 0, protein: 0, fat: 0 });
  };

  const removeIng = (i: number) => {
    const updated = form.ingredients.filter((_, idx) => idx !== i);
    setForm((f) => ({ ...f, ingredients: updated, ...calcMacros(updated) }));
  };

  const handleSave = async () => {
    if (!form.name_es.trim() && !form.name_en.trim()) return;
    setSaving(true);
    const primaryName = form.name_es || form.name_en;
    const payload: Omit<Recipe, 'id' | 'created_at' | 'updated_at'> = {
      ...form,
      name: primaryName,
      user_id: (isAdmin && form.user_id === null) ? null : userId,
    };
    const { data } = await upsertRecipe(payload as unknown as Partial<Recipe> & { user_id: string });
    if (data) {
      if (data.id && recipeTags.length >= 0) {
        await setTagsForRecipe(data.id, recipeTags.map((t) => t.id));
      }
      onSave(data);
    }
    setSaving(false);
  };

  const isEdit = !!(initial.name_es || initial.name_en || initial.name);

  const tabStyle = (tab: LangTab) => ({
    padding: '6px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600' as const,
    cursor: 'pointer' as const,
    border: 'none',
    backgroundColor: langTab === tab ? '#514163' : 'transparent',
    color: langTab === tab ? '#fdda36' : '#9ca3af',
    transition: 'all 0.15s',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ border: '2px solid #e5e7eb' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white z-10" style={{ borderColor: '#f3f4f6' }}>
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" style={{ color: '#514163' }} />
            <h3 className="font-semibold" style={{ color: '#1f2937' }}>
              {isEdit
                ? (es ? 'Editar Receta' : 'Edit Recipe')
                : (es ? 'Nueva Receta' : 'New Recipe')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {isAdmin && (
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: '#fef3c7' }}>
              <input
                type="checkbox"
                id="isSystemRecipe"
                checked={form.user_id === null}
                onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.checked ? null : userId }))}
                className="rounded"
              />
              <label htmlFor="isSystemRecipe" className="text-sm font-medium" style={{ color: '#b45309' }}>
                {es ? 'Receta del sistema (visible para todos)' : 'System recipe (visible to all)'}
              </label>
            </div>
          )}

          <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #e5e7eb' }}>
            <div className="flex items-center gap-1 p-1.5" style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <button style={tabStyle('es')} onClick={() => setLangTab('es')}>
                Español
              </button>
              <button style={tabStyle('en')} onClick={() => setLangTab('en')}>
                English
              </button>
              <div className="ml-auto flex items-center gap-1 text-xs" style={{ color: '#9ca3af' }}>
                <Globe className="w-3 h-3" />
                {langTab === 'es' ? 'Contenido en Español' : 'English Content'}
              </div>
            </div>

            <div className="p-4 space-y-3">
              {langTab === 'es' ? (
                <>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
                      Nombre en Español *
                    </label>
                    <input
                      type="text"
                      value={form.name_es}
                      onChange={(e) => setForm((f) => ({ ...f, name_es: e.target.value }))}
                      placeholder="ej. Porridge de avena con frutas"
                      className="input-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
                      Descripción
                    </label>
                    <textarea
                      rows={2}
                      value={form.description_es}
                      onChange={(e) => setForm((f) => ({ ...f, description_es: e.target.value }))}
                      placeholder="Breve descripción..."
                      className="input-brand resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
                      Instrucciones
                    </label>
                    <textarea
                      rows={4}
                      value={form.instructions_es}
                      onChange={(e) => setForm((f) => ({ ...f, instructions_es: e.target.value }))}
                      placeholder="Paso a paso..."
                      className="input-brand resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
                      Name in English *
                    </label>
                    <input
                      type="text"
                      value={form.name_en}
                      onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
                      placeholder="e.g. Oat Porridge with Fruits"
                      className="input-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={form.description_en}
                      onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))}
                      placeholder="Brief description..."
                      className="input-brand resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
                      Instructions
                    </label>
                    <textarea
                      rows={4}
                      value={form.instructions_en}
                      onChange={(e) => setForm((f) => ({ ...f, instructions_en: e.target.value }))}
                      placeholder="Step by step..."
                      className="input-brand resize-none"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                {es ? 'Categoría' : 'Category'}
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as RecipeCategory }))}
                className="input-brand"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{es ? c.label_es : c.label_en}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                {es ? 'Cultura' : 'Culture'}
              </label>
              <select
                value={form.culture ?? 'global'}
                onChange={(e) => setForm((f) => ({ ...f, culture: e.target.value }))}
                className="input-brand"
              >
                {CULTURES.filter((c) => c.value !== 'all').map((c) => (
                  <option key={c.value} value={c.value}>{c.flag} {es ? c.label_es : c.label_en}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                {es ? 'Prep (min)' : 'Prep (min)'}
              </label>
              <input type="number" min={0} value={form.prep_time_min} onChange={(e) => setForm((f) => ({ ...f, prep_time_min: parseInt(e.target.value) || 0 }))} className="input-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                {es ? 'Cocción (min)' : 'Cook (min)'}
              </label>
              <input type="number" min={0} value={form.cook_time_min} onChange={(e) => setForm((f) => ({ ...f, cook_time_min: parseInt(e.target.value) || 0 }))} className="input-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                {es ? 'Porciones' : 'Servings'}
              </label>
              <input type="number" min={1} value={form.servings} onChange={(e) => setForm((f) => ({ ...f, servings: parseInt(e.target.value) || 1 }))} className="input-brand" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
              {es ? 'Foto (URL)' : 'Photo (URL)'}
            </label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="https://images.pexels.com/..."
              className="input-brand"
            />
            {form.image_url && (
              <img src={form.image_url} alt="preview" className="mt-2 h-24 w-full object-cover rounded-xl" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              {es ? 'Ingredientes' : 'Ingredients'}
            </label>
            {form.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b" style={{ borderColor: '#f3f4f6' }}>
                <span className="text-sm flex-1" style={{ color: '#1f2937' }}>{ing.quantity} {ing.unit} {ing.name}</span>
                <span className="text-xs" style={{ color: '#9ca3af' }}>{ing.calories} kcal</span>
                <button onClick={() => removeIng(i)} className="p-1 hover:bg-red-50 rounded">
                  <X className="w-3 h-3" style={{ color: '#ef4444' }} />
                </button>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                type="text"
                value={newIng.name}
                onChange={(e) => setNewIng((f) => ({ ...f, name: e.target.value }))}
                placeholder={es ? 'Nombre' : 'Name'}
                className="input-brand col-span-2"
              />
              <input type="number" value={newIng.quantity} onChange={(e) => setNewIng((f) => ({ ...f, quantity: parseFloat(e.target.value) || 1 }))} placeholder={es ? 'Cant' : 'Qty'} className="input-brand" />
              <input type="text" value={newIng.unit} onChange={(e) => setNewIng((f) => ({ ...f, unit: e.target.value }))} placeholder={es ? 'Unidad' : 'Unit'} className="input-brand" />
              <input type="number" value={newIng.calories} onChange={(e) => setNewIng((f) => ({ ...f, calories: parseFloat(e.target.value) || 0 }))} placeholder="kcal" className="input-brand" />
              <input type="number" value={newIng.carbs} onChange={(e) => setNewIng((f) => ({ ...f, carbs: parseFloat(e.target.value) || 0 }))} placeholder="Carbs g" className="input-brand" />
              <input type="number" value={newIng.protein} onChange={(e) => setNewIng((f) => ({ ...f, protein: parseFloat(e.target.value) || 0 }))} placeholder={es ? 'Prot g' : 'Prot g'} className="input-brand" />
              <input type="number" value={newIng.fat} onChange={(e) => setNewIng((f) => ({ ...f, fat: parseFloat(e.target.value) || 0 }))} placeholder={es ? 'Grasa g' : 'Fat g'} className="input-brand" />
              <button
                onClick={addIng}
                className="col-span-2 py-2 rounded-xl border font-medium text-sm transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
                style={{ borderColor: '#e5e7eb', color: '#374151' }}
              >
                <Plus className="w-4 h-4" /> {es ? 'Agregar ingrediente' : 'Add ingredient'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                {es ? 'Calorías (kcal)' : 'Calories (kcal)'}
              </label>
              <input type="number" min={0} value={Math.round(form.calories_kcal)} onChange={(e) => setForm((f) => ({ ...f, calories_kcal: parseFloat(e.target.value) || 0 }))} className="input-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
                {es ? 'Fibra (g)' : 'Fiber (g)'}
              </label>
              <input type="number" min={0} value={form.fiber_g} onChange={(e) => setForm((f) => ({ ...f, fiber_g: parseFloat(e.target.value) || 0 }))} className="input-brand" />
            </div>
          </div>

          <TagSelector
            selectedTags={recipeTags}
            onChange={setRecipeTags}
            label={es ? 'Etiquetas' : 'Tags'}
            placeholder={es ? 'Agregar etiquetas...' : 'Add tags...'}
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border font-medium text-sm"
              style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
            >
              {es ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || (!form.name_es.trim() && !form.name_en.trim())}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {es ? 'Guardar' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecipesView({ onBack }: Props) {
  const { user, profile } = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';
  const isAdmin = profile?.role === 'admin' || profile?.role === 'coach';

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<RecipeCategory | 'all'>('all');
  const [filterCulture, setFilterCulture] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [viewRecipe, setViewRecipe] = useState<Recipe | null>(null);
  const [tagsByRecipeId, setTagsByRecipeId] = useState<Record<string, Tag[]>>({});

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    getRecipes(user.id).then(({ data }) => {
      setRecipes(data);
      setLoading(false);
      data.forEach((recipe) => {
        if (recipe.id) {
          getTagsForRecipe(recipe.id).then((tags) => {
            if (tags.length > 0) {
              setTagsByRecipeId((prev) => ({ ...prev, [recipe.id]: tags }));
            }
          });
        }
      });
    });
  }, [user?.id]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return recipes.filter((r) => {
      const matchSearch = !q
        || r.name.toLowerCase().includes(q)
        || (r.name_es ?? '').toLowerCase().includes(q)
        || (r.name_en ?? '').toLowerCase().includes(q)
        || (r.description_es ?? '').toLowerCase().includes(q)
        || (r.description_en ?? '').toLowerCase().includes(q);
      const matchCat = filterCat === 'all' || r.category === filterCat;
      const matchCulture = filterCulture === 'all' || (r.culture ?? 'global') === filterCulture;
      return matchSearch && matchCat && matchCulture;
    });
  }, [recipes, search, filterCat, filterCulture]);

  const systemCount = recipes.filter((r) => r.user_id === null).length;
  const myCount = recipes.filter((r) => r.user_id !== null).length;

  const handleFavorite = async (recipe: Recipe) => {
    if (!user?.id) return;
    const updated = { ...recipe, is_favorite: !recipe.is_favorite };
    await upsertRecipe({ ...updated, user_id: user.id });
    setRecipes((prev) => prev.map((r) => (r.id === recipe.id ? updated : r)));
  };

  const handleDelete = async (id: string) => {
    await deleteRecipe(id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    if (viewRecipe?.id === id) setViewRecipe(null);
  };

  const handleSaveRecipe = (saved: Recipe) => {
    setRecipes((prev) => {
      const exists = prev.find((r) => r.id === saved.id);
      if (exists) return prev.map((r) => (r.id === saved.id ? saved : r));
      return [saved, ...prev];
    });
    if (saved.id) {
      getTagsForRecipe(saved.id).then((tags) => {
        setTagsByRecipeId((prev) => ({ ...prev, [saved.id]: tags }));
      });
    }
    setShowForm(false);
    setEditRecipe(null);
  };

  const openNewRecipe = () => {
    setEditRecipe(null);
    setShowForm(true);
  };

  const openEditRecipe = (r: Recipe) => {
    setEditRecipe(r);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} />
      </div>
    );
  }

  if (viewRecipe) {
    const cat = CATEGORIES.find((c) => c.value === viewRecipe.category) ?? CATEGORIES[8];
    const culture = getCultureInfo(viewRecipe.culture ?? 'global');
    const isSystem = viewRecipe.user_id === null;
    const displayName = getDisplayName(viewRecipe, es);
    const displayDesc = getDisplayDescription(viewRecipe, es);
    const displayInstructions = getDisplayInstructions(viewRecipe, es);

    return (
      <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={() => setViewRecipe(null)} className="p-2 rounded-xl border hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb' }}>
            <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
          <h1 className="font-heading text-xl flex-1 leading-tight" style={{ color: '#1f2937' }}>{displayName}</h1>
          <div className="flex items-center gap-1">
            {(isAdmin || !isSystem) && (
              <button
                onClick={() => openEditRecipe(viewRecipe)}
                className="p-2 rounded-xl border hover:bg-blue-50 transition-all"
                style={{ borderColor: '#e5e7eb' }}
              >
                <Edit2 className="w-4 h-4" style={{ color: '#3b82f6' }} />
              </button>
            )}
            <button onClick={() => handleFavorite(viewRecipe)} className="p-2 rounded-xl border hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb' }}>
              <Heart className="w-4 h-4" style={{ color: viewRecipe.is_favorite ? '#ef4444' : '#d1d5db', fill: viewRecipe.is_favorite ? '#ef4444' : 'none' }} />
            </button>
          </div>
        </div>

        {viewRecipe.image_url && (
          <img
            src={viewRecipe.image_url}
            alt={displayName}
            className="w-full h-52 object-cover rounded-2xl"
          />
        )}

        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: cat.bg, color: cat.color }}>
            {es ? cat.label_es : cat.label_en}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>
            {culture.flag} {es ? culture.label_es : culture.label_en}
          </span>
          {isSystem && (
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: '#514163', color: '#fdda36' }}>
              {es ? 'Sistema' : 'System'}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs ml-auto" style={{ color: '#9ca3af' }}>
            <Clock className="w-3 h-3" />{viewRecipe.prep_time_min + viewRecipe.cook_time_min} min
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: '#9ca3af' }}>
            <Users className="w-3 h-3" />{viewRecipe.servings} {es ? 'porc' : 'serv'}
          </span>
        </div>

        {displayDesc && (
          <p className="text-sm" style={{ color: '#6b7280' }}>{displayDesc}</p>
        )}

        <div className="bg-white rounded-2xl p-4" style={{ border: '2px solid #e5e7eb' }}>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label_es: 'Calorías', label_en: 'Calories', value: Math.round(viewRecipe.calories_kcal), unit: 'kcal', color: '#f59e0b' },
              { label_es: 'Carbos', label_en: 'Carbs', value: Math.round(viewRecipe.carbs_g), unit: 'g', color: '#3b82f6' },
              { label_es: 'Proteína', label_en: 'Protein', value: Math.round(viewRecipe.protein_g), unit: 'g', color: '#10b981' },
              { label_es: 'Grasa', label_en: 'Fat', value: Math.round(viewRecipe.fat_g), unit: 'g', color: '#f97316' },
            ].map(({ label_es, label_en, value, unit, color }) => (
              <div key={label_en} className="text-center rounded-xl py-2" style={{ backgroundColor: '#f9fafb' }}>
                <div className="text-sm font-bold" style={{ color }}>{value}<span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>{unit}</span></div>
                <div className="text-xs mt-0.5 leading-tight" style={{ color: '#9ca3af' }}>{es ? label_es : label_en}</div>
              </div>
            ))}
          </div>
        </div>

        {viewRecipe.ingredients.length > 0 && (
          <div className="bg-white rounded-2xl p-4" style={{ border: '2px solid #e5e7eb' }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: '#1f2937' }}>
              {es ? 'Ingredientes' : 'Ingredients'}
            </h3>
            <div className="space-y-2">
              {viewRecipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: '#f3f4f6' }}>
                  <span className="text-sm" style={{ color: '#1f2937' }}>{ing.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: '#9ca3af' }}>{ing.quantity} {ing.unit}</span>
                    <span className="text-xs" style={{ color: '#f59e0b' }}>{ing.calories} kcal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {displayInstructions && (
          <div className="bg-white rounded-2xl p-4" style={{ border: '2px solid #e5e7eb' }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: '#1f2937' }}>
              {es ? 'Instrucciones' : 'Instructions'}
            </h3>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#374151' }}>{displayInstructions}</p>
          </div>
        )}

        {(isAdmin || !isSystem) && (
          <div className="flex gap-3">
            <button
              onClick={() => openEditRecipe(viewRecipe)}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: '#f0f9ff', color: '#0369a1', border: '2px solid #bae6fd' }}
            >
              <Edit2 className="w-4 h-4" /> {es ? 'Editar' : 'Edit'}
            </button>
            <button
              onClick={() => handleDelete(viewRecipe.id)}
              className="px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '2px solid #fecaca' }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl border hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb' }}>
          <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
            <BookOpen className="w-4 h-4" style={{ color: '#b45309' }} />
          </div>
          <div>
            <h1 className="font-heading text-xl leading-tight" style={{ color: '#1f2937' }}>
              {es ? 'Recetas' : 'Recipes'}
            </h1>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              {systemCount} {es ? 'sistema' : 'system'} · {myCount} {es ? 'propias' : 'mine'} · {recipes.length} total
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={openNewRecipe}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}
          >
            <Plus className="w-4 h-4" /> {es ? 'Agregar' : 'Add'}
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={es ? 'Buscar recetas...' : 'Search recipes...'}
            className="input-brand pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterCat('all')}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={{
              borderColor: filterCat === 'all' ? '#514163' : '#e5e7eb',
              backgroundColor: filterCat === 'all' ? '#514163' : '#ffffff',
              color: filterCat === 'all' ? '#fdda36' : '#6b7280',
            }}
          >
            {es ? 'Todas' : 'All'}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilterCat(c.value)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={{
                borderColor: filterCat === c.value ? c.color : '#e5e7eb',
                backgroundColor: filterCat === c.value ? c.bg : '#ffffff',
                color: filterCat === c.value ? c.color : '#6b7280',
              }}
            >
              {es ? c.label_es : c.label_en}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <Globe className="w-4 h-4 flex-shrink-0 self-center" style={{ color: '#9ca3af' }} />
          {CULTURES.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilterCulture(c.value)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap"
              style={{
                borderColor: filterCulture === c.value ? '#514163' : '#e5e7eb',
                backgroundColor: filterCulture === c.value ? '#514163' : '#ffffff',
                color: filterCulture === c.value ? '#fdda36' : '#6b7280',
              }}
            >
              {c.flag} {es ? c.label_es : c.label_en}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl" style={{ border: '2px solid #e5e7eb' }}>
          <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: '#d1d5db' }} />
          <h3 className="font-semibold mb-1" style={{ color: '#1f2937' }}>
            {es ? 'Sin resultados' : 'No results'}
          </h3>
          <p className="text-sm mb-4" style={{ color: '#9ca3af' }}>
            {es ? 'Intenta con otro filtro' : 'Try a different filter'}
          </p>
          {isAdmin && (
            <button
              onClick={openNewRecipe}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}
            >
              {es ? 'Agregar receta' : 'Add Recipe'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isAdmin={isAdmin}
              onFavorite={handleFavorite}
              onDelete={handleDelete}
              onView={setViewRecipe}
              onEdit={openEditRecipe}
              es={es}
              tags={tagsByRecipeId[recipe.id]}
            />
          ))}
        </div>
      )}

      {showForm && (
        <RecipeFormModal
          initial={editRecipe
            ? {
                ...editRecipe,
                description_es: editRecipe.description_es || editRecipe.description || '',
                description_en: editRecipe.description_en || editRecipe.description || '',
                instructions_es: editRecipe.instructions_es || editRecipe.instructions || '',
                instructions_en: editRecipe.instructions_en || editRecipe.instructions || '',
              }
            : { ...EMPTY_RECIPE, user_id: isAdmin ? null : (user?.id ?? null) }}
          initialRecipeId={editRecipe?.id}
          isAdmin={isAdmin}
          userId={user?.id ?? ''}
          onClose={() => { setShowForm(false); setEditRecipe(null); }}
          onSave={handleSaveRecipe}
          es={es}
        />
      )}
    </div>
  );
}
