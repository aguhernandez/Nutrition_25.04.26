import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Plus, X, Loader2, ChevronDown, ChevronRight, FlaskConical, Apple, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePreferences } from '../../lib/preferences';
import type { FoodV2, RecipeIngredientFull, NutritionTotals } from '../../types/ingredientBuilder';
import { EMPTY_TOTALS, MICRONUTRIENT_FIELDS } from '../../types/ingredientBuilder';
import { UNIT_OPTIONS, convertToGrams, getUnitLabel } from '../../utils/unitConversions';

interface Props {
  ingredients: RecipeIngredientFull[];
  onChange: (ingredients: RecipeIngredientFull[]) => void;
  servings: number;
}

function scaleNutrient(per100g: number | undefined, grams: number): number {
  if (!per100g) return 0;
  return Math.round(per100g * (grams / 100) * 100) / 100;
}

function calcIngredientNutrition(food: FoodV2, grams: number): RecipeIngredientFull {
  return {
    name: food.name_en || food.name_es,
    name_es: food.name_es,
    name_en: food.name_en,
    brand: food.brand,
    source: food.source,
    food_id: food.id,
    quantity: grams,
    unit: 'g',
    base_quantity_g: grams,
    calories: scaleNutrient(food.calories_per_100g, grams),
    carbs: scaleNutrient(food.carbs_per_100g, grams),
    protein: scaleNutrient(food.protein_per_100g, grams),
    fat: scaleNutrient(food.fat_per_100g, grams),
    fiber: scaleNutrient(food.fiber_per_100g, grams),
    sugar: scaleNutrient(food.sugar_per_100g, grams),
    sodium_mg: scaleNutrient(food.sodium_mg, grams),
    potassium_mg: scaleNutrient(food.potassium_mg, grams),
    calcium_mg: scaleNutrient(food.calcium_mg, grams),
    iron_mg: scaleNutrient(food.iron_mg, grams),
    magnesium_mg: scaleNutrient(food.magnesium_mg, grams),
    phosphorus_mg: scaleNutrient(food.phosphorus_mg, grams),
    zinc_mg: scaleNutrient(food.zinc_mg, grams),
    vitamin_a_mcg: scaleNutrient(food.vitamin_a_mcg, grams),
    vitamin_c_mg: scaleNutrient(food.vitamin_c_mg, grams),
    vitamin_d_mcg: scaleNutrient(food.vitamin_d_mcg, grams),
    vitamin_e_mg: scaleNutrient(food.vitamin_e_mg, grams),
    vitamin_k_mcg: scaleNutrient(food.vitamin_k_mcg, grams),
    vitamin_b1_mg: scaleNutrient(food.vitamin_b1_mg, grams),
    vitamin_b2_mg: scaleNutrient(food.vitamin_b2_mg, grams),
    vitamin_b3_mg: scaleNutrient(food.vitamin_b3_mg, grams),
    vitamin_b5_mg: scaleNutrient(food.vitamin_b5_mg, grams),
    vitamin_b6_mg: scaleNutrient(food.vitamin_b6_mg, grams),
    vitamin_b7_ug: scaleNutrient(food.vitamin_b7_ug, grams),
    vitamin_b12_mcg: scaleNutrient(food.vitamin_b12_mcg, grams),
    folate_mcg: scaleNutrient(food.folate_mcg, grams),
    iodine_ug: scaleNutrient(food.iodine_ug, grams),
    choline_mg: scaleNutrient(food.choline_mg, grams),
    beta_carotene_ug: scaleNutrient(food.beta_carotene_ug, grams),
  };
}

function sumTotals(ingredients: RecipeIngredientFull[]): NutritionTotals {
  const totals = { ...EMPTY_TOTALS };
  const microKeys = MICRONUTRIENT_FIELDS.map((f) => f.key);
  for (const ing of ingredients) {
    totals.calories += ing.calories || 0;
    totals.carbs += ing.carbs || 0;
    totals.protein += ing.protein || 0;
    totals.fat += ing.fat || 0;
    for (const key of microKeys) {
      totals[key] += (ing[key] as number) || 0;
    }
  }
  const roundKeys: (keyof NutritionTotals)[] = ['calories', ...microKeys];
  for (const k of roundKeys) {
    totals[k] = Math.round(totals[k] * 100) / 100;
  }
  totals.carbs = Math.round(totals.carbs * 10) / 10;
  totals.protein = Math.round(totals.protein * 10) / 10;
  totals.fat = Math.round(totals.fat * 10) / 10;
  return totals;
}

function recalcIngredient(ing: RecipeIngredientFull, newQty: number, newUnit: string): RecipeIngredientFull {
  const grams = convertToGrams(newQty, newUnit);
  if (grams <= 0 || ing.base_quantity_g <= 0) {
    return { ...ing, quantity: newQty, unit: newUnit, base_quantity_g: grams };
  }
  const ratio = grams / ing.base_quantity_g;
  const updated = { ...ing };
  (Object.keys(updated) as (keyof RecipeIngredientFull)[]).forEach((k) => {
    if (typeof updated[k] === 'number' && k !== 'quantity' && k !== 'base_quantity_g' && k !== 'unit') {
      const orig = ing[k] as number;
      if (ing.base_quantity_g > 0 && (ing.base_quantity_g !== ing.quantity || ing.unit === 'g')) {
        const perGram = orig / ing.base_quantity_g;
        updated[k] = Math.round(perGram * grams * 100) / 100;
      } else {
        updated[k] = Math.round(orig * ratio * 100) / 100;
      }
    }
  });
  updated.quantity = newQty;
  updated.unit = newUnit;
  updated.base_quantity_g = grams;
  return updated;
}

export default function IngredientBuilder({ ingredients, onChange, servings }: Props) {
  const { language } = usePreferences();
  const es = language === 'es';
  const t = (esStr: string, en: string) => (es ? esStr : en);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodV2[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [expandedMicro, setExpandedMicro] = useState(false);
  const [perServing, setPerServing] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodV2 | null>(null);
  const [foodQty, setFoodQty] = useState(100);
  const [foodUnit, setFoodUnit] = useState('g');

  const [manualForm, setManualForm] = useState({
    name: '', calories: 0, carbs: 0, protein: 0, fat: 0,
    fiber: 0, sugar: 0, sodium_mg: 0, potassium_mg: 0, calcium_mg: 0, iron_mg: 0,
  });
  const [manualQty, setManualQty] = useState(100);
  const [manualUnit, setManualUnit] = useState('g');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      const q = searchQuery.trim().toLowerCase();
      const { data, error } = await supabase
        .from('foods_v2')
        .select('*')
        .or(`name_es.ilike.%${q}%,name_en.ilike.%${q}%`)
        .limit(20);
      if (error) {
        setSearching(false);
        return;
      }
      setSearchResults((data || []) as FoodV2[]);
      setShowResults(true);
      setSearching(false);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  const totals = useMemo(() => sumTotals(ingredients), [ingredients]);
  const displayTotals = useMemo(() => {
    if (!perServing || servings <= 0) return totals;
    const div = servings;
    const scaled = { ...EMPTY_TOTALS };
    (Object.keys(totals) as (keyof NutritionTotals)[]).forEach((k) => {
      scaled[k] = Math.round((totals[k] / div) * 100) / 100;
    });
    return scaled;
  }, [totals, perServing, servings]);

  const addFoodIngredient = () => {
    if (!selectedFood) return;
    const grams = convertToGrams(foodQty, foodUnit);
    const ing = calcIngredientNutrition(selectedFood, grams);
    ing.quantity = foodQty;
    ing.unit = foodUnit;
    onChange([...ingredients, ing]);
    setSelectedFood(null);
    setFoodQty(100);
    setFoodUnit('g');
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const addManualIngredient = () => {
    if (!manualForm.name.trim()) return;
    const grams = convertToGrams(manualQty, manualUnit);
    const r = grams / 100;
    const ing: RecipeIngredientFull = {
      name: manualForm.name.trim(),
      quantity: manualQty,
      unit: manualUnit,
      base_quantity_g: grams,
      calories: Math.round(manualForm.calories * r),
      carbs: Math.round(manualForm.carbs * r * 10) / 10,
      protein: Math.round(manualForm.protein * r * 10) / 10,
      fat: Math.round(manualForm.fat * r * 10) / 10,
      fiber: Math.round(manualForm.fiber * r * 10) / 10,
      sugar: Math.round(manualForm.sugar * r * 10) / 10,
      sodium_mg: Math.round(manualForm.sodium_mg * r),
      potassium_mg: Math.round(manualForm.potassium_mg * r),
      calcium_mg: Math.round(manualForm.calcium_mg * r),
      iron_mg: Math.round(manualForm.iron_mg * r),
    };
    onChange([...ingredients, ing]);
    setManualForm({ name: '', calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0, sugar: 0, sodium_mg: 0, potassium_mg: 0, calcium_mg: 0, iron_mg: 0 });
    setManualQty(100);
    setManualUnit('g');
    setShowManual(false);
  };

  const updateIngredientQty = (index: number, qty: number, unit: string) => {
    const updated = ingredients.map((ing, i) => i === index ? recalcIngredient(ing, qty, unit) : ing);
    onChange(updated);
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const sourceBadge = (source?: string) => {
    if (!source || source === 'internal') return null;
    const label = source === 'usda' ? 'USDA' : source === 'open_food_facts' ? 'OFF' : source.toUpperCase();
    const color = source === 'usda' ? '#0369a1' : '#15803d';
    return <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: color + '18', color }}>{label}</span>;
  };

  const inputStyle = 'w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all';
  const inputClass = `${inputStyle} border-gray-200 focus:ring-yellow-400/30 focus:border-yellow-400`;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
          {t('Ingredientes', 'Ingredients')}
        </label>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder={t('Buscar ingredientes (español o inglés)...', 'Search ingredients (Spanish or English)...')}
            className={`${inputClass} pl-10`}
          />
          {searching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" style={{ color: '#9ca3af' }} />
          )}

          {showResults && searchResults.length > 0 && (
            <div className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-xl shadow-lg max-h-64 overflow-y-auto" style={{ border: '1px solid #e5e7eb' }}>
              {searchResults.map((food) => (
                <button
                  key={food.id}
                  onMouseDown={() => {
                    setSelectedFood(food);
                    setSearchQuery(es ? food.name_es : food.name_en || food.name_es);
                    setShowResults(false);
                    setFoodQty(100);
                    setFoodUnit('g');
                  }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 hover:bg-gray-50 text-left border-b last:border-0 transition-all"
                  style={{ borderColor: '#f3f4f6' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: '#1f2937' }}>
                      {es ? food.name_es : food.name_en || food.name_es}
                    </div>
                    {food.brand && (
                      <div className="text-xs truncate" style={{ color: '#9ca3af' }}>{food.brand}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {sourceBadge(food.source)}
                    <span className="text-xs" style={{ color: '#9ca3af' }}>
                      {Math.round(food.calories_per_100g)} kcal/100g
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showResults && searchResults.length === 0 && !searching && (
            <div className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-xl shadow-lg p-4" style={{ border: '1px solid #e5e7eb' }}>
              <p className="text-sm text-center mb-2" style={{ color: '#6b7280' }}>
                {t('Sin resultados en la base de datos', 'No results in database')}
              </p>
              <button
                onMouseDown={() => { setShowManual(true); setShowResults(false); }}
                className="w-full py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
              >
                <FlaskConical className="w-4 h-4" />
                {t('Ingresar valores manualmente', 'Enter values manually')}
              </button>
            </div>
          )}
        </div>

        {selectedFood && (
          <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Apple className="w-4 h-4" style={{ color: '#15803d' }} />
                <span className="text-sm font-medium" style={{ color: '#15803d' }}>
                  {es ? selectedFood.name_es : selectedFood.name_en || selectedFood.name_es}
                </span>
                {sourceBadge(selectedFood.source)}
              </div>
              <button onClick={() => setSelectedFood(null)} className="p-1 rounded hover:bg-green-100">
                <X className="w-3.5 h-3.5" style={{ color: '#15803d' }} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>{t('Cantidad', 'Quantity')}</label>
                <input
                  type="number"
                  min={0}
                  value={foodQty}
                  onChange={(e) => setFoodQty(parseFloat(e.target.value) || 0)}
                  className={`${inputClass} px-2 py-1.5`}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>{t('Unidad', 'Unit')}</label>
                <select
                  value={foodUnit}
                  onChange={(e) => setFoodUnit(e.target.value)}
                  className={`${inputClass} px-2 py-1.5`}
                >
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u.value} value={u.value}>{es ? u.label_es : u.label_en}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={addFoodIngredient}
                  className="w-full py-1.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{ backgroundColor: '#15803d', color: '#fff' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t('Agregar', 'Add')}
                </button>
              </div>
            </div>
            <div className="flex gap-3 text-xs" style={{ color: '#6b7280' }}>
              <span>{Math.round(scaleNutrient(selectedFood.calories_per_100g, convertToGrams(foodQty, foodUnit)))} kcal</span>
              <span>{scaleNutrient(selectedFood.carbs_per_100g, convertToGrams(foodQty, foodUnit))}g {t('Carbos', 'Carbs')}</span>
              <span>{scaleNutrient(selectedFood.protein_per_100g, convertToGrams(foodQty, foodUnit))}g {t('Prot', 'Protein')}</span>
              <span>{scaleNutrient(selectedFood.fat_per_100g, convertToGrams(foodQty, foodUnit))}g {t('Grasa', 'Fat')}</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowManual(!showManual)}
          className="w-full py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 mb-3"
          style={{ border: '1px dashed #d1d5db', color: '#6b7280' }}
        >
          <FlaskConical className="w-4 h-4" />
          {t('Ingreso manual de ingrediente', 'Manual ingredient entry')}
        </button>

        {showManual && (
          <div className="rounded-xl p-3 mb-3 space-y-2" style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a' }}>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>{t('Nombre del ingrediente', 'Ingredient name')}</label>
              <input
                type="text"
                value={manualForm.name}
                onChange={(e) => setManualForm((f) => ({ ...f, name: e.target.value }))}
                placeholder={t('ej. Aceite de oliva', 'e.g. Olive oil')}
                className={`${inputClass} px-2 py-1.5`}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>{t('Cantidad', 'Quantity')}</label>
                <input type="number" min={0} value={manualQty} onChange={(e) => setManualQty(parseFloat(e.target.value) || 0)} className={`${inputClass} px-2 py-1.5`} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6b7280' }}>{t('Unidad', 'Unit')}</label>
                <select value={manualUnit} onChange={(e) => setManualUnit(e.target.value)} className={`${inputClass} px-2 py-1.5`}>
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u.value} value={u.value}>{es ? u.label_es : u.label_en}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={addManualIngredient}
                  disabled={!manualForm.name.trim()}
                  className="w-full py-1.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
                  style={{ backgroundColor: '#b45309', color: '#fff' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t('Agregar', 'Add')}
                </button>
              </div>
            </div>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              {t('Valores nutricionales por 100g/ml', 'Nutritional values per 100g/ml')}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'calories', label: 'kcal' }, { key: 'carbs', label: t('Carbos g', 'Carbs g') },
                { key: 'protein', label: t('Prot g', 'Protein g') }, { key: 'fat', label: t('Grasa g', 'Fat g') },
                { key: 'fiber', label: t('Fibra g', 'Fiber g') }, { key: 'sugar', label: t('Azúcar g', 'Sugar g') },
                { key: 'sodium_mg', label: t('Sodio mg', 'Sodium mg') }, { key: 'potassium_mg', label: t('Potasio mg', 'Potassium mg') },
                { key: 'calcium_mg', label: t('Calcio mg', 'Calcium mg') }, { key: 'iron_mg', label: t('Hierro mg', 'Iron mg') },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[10px] mb-0.5" style={{ color: '#9ca3af' }}>{f.label}</label>
                  <input
                    type="number"
                    min={0}
                    value={(manualForm as any)[f.key]}
                    onChange={(e) => setManualForm((prev) => ({ ...prev, [f.key]: parseFloat(e.target.value) || 0 }))}
                    className={`${inputClass} px-1.5 py-1 text-xs`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {ingredients.length > 0 && (
        <div className="space-y-1.5">
          {ingredients.map((ing, i) => (
            <div key={i} className="rounded-xl p-2.5 flex items-center gap-2" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: '#1f2937' }}>
                  {ing.name}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <input
                    type="number"
                    min={0}
                    value={ing.quantity}
                    onChange={(e) => updateIngredientQty(i, parseFloat(e.target.value) || 0, ing.unit)}
                    className="w-16 px-1.5 py-0.5 rounded-lg border text-xs"
                    style={{ borderColor: '#e5e7eb' }}
                  />
                  <select
                    value={ing.unit}
                    onChange={(e) => updateIngredientQty(i, ing.quantity, e.target.value)}
                    className="px-1.5 py-0.5 rounded-lg border text-xs"
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>{es ? u.label_es : u.label_en}</option>
                    ))}
                  </select>
                  <span className="text-xs" style={{ color: '#f59e0b' }}>{ing.calories} kcal</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs flex-shrink-0">
                <span style={{ color: '#3b82f6' }}>{ing.carbs}g</span>
                <span style={{ color: '#10b981' }}>{ing.protein}g</span>
                <span style={{ color: '#f97316' }}>{ing.fat}g</span>
              </div>
              <button onClick={() => removeIngredient(i)} className="p-1 rounded-lg hover:bg-red-50 flex-shrink-0">
                <X className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {ingredients.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid #e5e7eb' }}>
          <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: '#514163' }}>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: '#fdda36' }} />
              <span className="text-sm font-semibold" style={{ color: '#fdda36' }}>
                {t('Resumen nutricional', 'Nutrition summary')}
              </span>
            </div>
            <button
              onClick={() => setPerServing(!perServing)}
              className="text-xs px-3 py-1 rounded-full font-medium transition-all"
              style={{ backgroundColor: perServing ? '#fdda36' : 'transparent', color: perServing ? '#3b2a50' : '#fdda36', border: '1px solid #fdda36' }}
            >
              {perServing
                ? `${t('Por porción', 'Per serving')} (${servings})`
                : t('Receta completa', 'Full recipe')}
            </button>
          </div>

          <div className="p-4 bg-white">
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { label_es: 'Calorías', label_en: 'Calories', value: Math.round(displayTotals.calories), unit: 'kcal', color: '#f59e0b' },
                { label_es: 'Carbos', label_en: 'Carbs', value: Math.round(displayTotals.carbs * 10) / 10, unit: 'g', color: '#3b82f6' },
                { label_es: 'Proteína', label_en: 'Protein', value: Math.round(displayTotals.protein * 10) / 10, unit: 'g', color: '#10b981' },
                { label_es: 'Grasa', label_en: 'Fat', value: Math.round(displayTotals.fat * 10) / 10, unit: 'g', color: '#f97316' },
              ].map((m) => (
                <div key={m.label_en} className="text-center rounded-xl py-2.5" style={{ backgroundColor: '#f9fafb' }}>
                  <div className="text-lg font-bold" style={{ color: m.color }}>
                    {m.value}<span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>{m.unit}</span>
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{es ? m.label_es : m.label_en}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setExpandedMicro(!expandedMicro)}
              className="w-full flex items-center justify-between py-1.5 text-xs font-medium transition-all"
              style={{ color: '#6b7280' }}
            >
              <span>{t('Micronutrientes', 'Micronutrients')}</span>
              {expandedMicro ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {expandedMicro && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 mt-2">
                {MICRONUTRIENT_FIELDS.map((f) => {
                  const val = displayTotals[f.key];
                  if (val === 0) return null;
                  return (
                    <div key={f.key} className="rounded-lg px-2 py-1.5" style={{ backgroundColor: '#f9fafb' }}>
                      <div className="text-xs font-semibold" style={{ color: '#374151' }}>
                        {Math.round(val * 10) / 10}<span className="text-[10px] ml-0.5" style={{ color: '#9ca3af' }}>{f.unit}</span>
                      </div>
                      <div className="text-[10px] leading-tight" style={{ color: '#9ca3af' }}>{es ? f.label_es : f.label_en}</div>
                    </div>
                  );
                })}
                {MICRONUTRIENT_FIELDS.every((f) => displayTotals[f.key] === 0) && (
                  <div className="col-span-full text-center text-xs py-3" style={{ color: '#9ca3af' }}>
                    {t('Sin datos de micronutrientes', 'No micronutrient data')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
