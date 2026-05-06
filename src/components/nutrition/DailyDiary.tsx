import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, CreditCard as Edit2, Check, X, Loader2, ClipboardList, Coffee, Sun, Sunset, Moon, Dumbbell, Search, Copy } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';
import { getDiaryEntries, insertDiaryEntry, updateDiaryEntry, deleteDiaryEntry } from '../../lib/nutritionService';
import { getAnamnesis } from '../../lib/nutritionService';
import { supabase } from '../../lib/supabase';
import type { DiaryEntry, MealSlot, Macros, NutritionAnamnesis } from '../../types/nutritionModule';

interface FoodDBResult {
  id: string;
  name: string;
  name_es?: string;
  brand?: string;
  calories_kcal: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  fiber_g?: number;
  sodium_mg?: number;
  serving_size_g: number;
  serving_description: string;
}

function FoodSearchModal({
  slot, userId, date, onAdd, onClose, es,
}: {
  slot: MealSlot; userId: string; date: string; onAdd: (entry: DiaryEntry) => void; onClose: () => void; es: boolean;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodDBResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<FoodDBResult | null>(null);
  const [qty, setQty] = useState(100);
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      const { data } = await supabase
        .from('foods_v2')
        .select('id, name, name_es, brand, calories_kcal, carbs_g, protein_g, fat_g, fiber_g, sodium_mg, serving_size_g, serving_description')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,name_es.ilike.%${query}%,brand.ilike.%${query}%`)
        .limit(15);
      setResults((data ?? []) as FoodDBResult[]);
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const scale = (base: number, servingG: number, q: number) => servingG > 0 ? (base / servingG) * q : 0;

  const handleAdd = async () => {
    if (!selected) return;
    setAdding(true);
    const ratio = qty / (selected.serving_size_g || 100);
    const { data } = await supabase
      .from('daily_food_diary')
      .insert({
        user_id: userId,
        diary_date: date,
        meal_slot: slot,
        food_name: selected.name_es || selected.name,
        brand: selected.brand ?? '',
        serving_quantity: qty,
        serving_unit: 'g',
        calories_kcal: Math.round(selected.calories_kcal * ratio),
        carbs_g: Math.round(selected.carbs_g * ratio * 10) / 10,
        protein_g: Math.round(selected.protein_g * ratio * 10) / 10,
        fat_g: Math.round(selected.fat_g * ratio * 10) / 10,
        fiber_g: Math.round((selected.fiber_g ?? 0) * ratio * 10) / 10,
        sodium_mg: Math.round((selected.sodium_mg ?? 0) * ratio),
        sugar_g: 0,
        notes: '',
        ai_suggestion: '',
        is_training_day: false,
        training_type: '',
        sort_order: 0,
      })
      .select()
      .maybeSingle();
    if (data) onAdd(data as DiaryEntry);
    setAdding(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col" style={{ border: '2px solid #e5e7eb' }}>
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#f3f4f6' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#9ca3af' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
            placeholder={es ? 'Buscar alimento en la base de datos...' : 'Search food in database...'}
            className="flex-1 text-sm outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {searching && <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin" style={{ color: '#514163' }} /></div>}
          {!searching && query.length >= 2 && results.length === 0 && (
            <div className="text-center py-6 text-sm" style={{ color: '#9ca3af' }}>{es ? 'Sin resultados' : 'No results'}</div>
          )}
          {!searching && !selected && results.map((f) => (
            <button
              key={f.id}
              onClick={() => { setSelected(f); setQty(f.serving_size_g ?? 100); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left border-b transition-all"
              style={{ borderColor: '#f3f4f6' }}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate" style={{ color: '#1f2937' }}>{f.name_es || f.name}</div>
                {f.brand && <div className="text-xs" style={{ color: '#9ca3af' }}>{f.brand}</div>}
              </div>
              <div className="text-xs text-right flex-shrink-0" style={{ color: '#9ca3af' }}>
                <div style={{ color: '#f59e0b', fontWeight: 600 }}>{Math.round(f.calories_kcal)} kcal</div>
                <div>/{f.serving_description ?? `${f.serving_size_g}g`}</div>
              </div>
            </button>
          ))}
          {selected && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
                </button>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#1f2937' }}>{selected.name_es || selected.name}</div>
                  {selected.brand && <div className="text-xs" style={{ color: '#9ca3af' }}>{selected.brand}</div>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{es ? 'Cantidad (g)' : 'Amount (g)'}</label>
                <input type="number" min={1} value={qty} onChange={(e) => setQty(parseFloat(e.target.value) || 100)} className="input-brand" autoFocus />
                <div className="text-xs mt-1" style={{ color: '#9ca3af' }}>{es ? 'Porción estándar' : 'Standard serving'}: {selected.serving_description}</div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'kcal', val: scale(selected.calories_kcal, selected.serving_size_g, qty), color: '#f59e0b' },
                  { label: 'Carbs', val: scale(selected.carbs_g, selected.serving_size_g, qty), color: '#3b82f6' },
                  { label: es ? 'Prot' : 'Prot', val: scale(selected.protein_g, selected.serving_size_g, qty), color: '#10b981' },
                  { label: es ? 'Grasa' : 'Fat', val: scale(selected.fat_g, selected.serving_size_g, qty), color: '#f97316' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="text-center rounded-xl py-2" style={{ backgroundColor: '#f9fafb' }}>
                    <div className="font-bold text-sm" style={{ color }}>{Math.round(val)}</div>
                    <div className="text-xs" style={{ color: '#9ca3af' }}>{label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleAdd}
                disabled={adding}
                className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {es ? 'Agregar al diario' : 'Add to diary'}
              </button>
            </div>
          )}
        </div>
        {!selected && (
          <div className="px-4 py-2 border-t text-xs" style={{ borderColor: '#f3f4f6', color: '#9ca3af' }}>
            {es ? 'Escribe al menos 2 caracteres para buscar' : 'Type at least 2 characters to search'}
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  onBack: () => void;
}

const MEAL_SLOTS: { value: MealSlot; label_en: string; label_es: string; icon: React.ElementType; group_en: string; group_es: string }[] = [
  { value: 'wake_up', label_en: 'Wake Up', label_es: 'Al Despertar', icon: Sun, group_en: 'Morning', group_es: 'Mañana' },
  { value: 'breakfast', label_en: 'Breakfast', label_es: 'Desayuno', icon: Coffee, group_en: 'Morning', group_es: 'Mañana' },
  { value: 'mid_morning', label_en: 'Mid Morning', label_es: 'Media Mañana', icon: Sun, group_en: 'Morning', group_es: 'Mañana' },
  { value: 'pre_training', label_en: 'Pre Training', label_es: 'Pre Entrenamiento', icon: Dumbbell, group_en: 'Training', group_es: 'Entrenamiento' },
  { value: 'during_training', label_en: 'During Training', label_es: 'Durante Entrenamiento', icon: Dumbbell, group_en: 'Training', group_es: 'Entrenamiento' },
  { value: 'post_training', label_en: 'Post Training', label_es: 'Post Entrenamiento', icon: Dumbbell, group_en: 'Training', group_es: 'Entrenamiento' },
  { value: 'lunch', label_en: 'Lunch', label_es: 'Almuerzo', icon: Sun, group_en: 'Afternoon', group_es: 'Tarde' },
  { value: 'afternoon_snack', label_en: 'Afternoon Snack', label_es: 'Merienda', icon: Sunset, group_en: 'Afternoon', group_es: 'Tarde' },
  { value: 'dinner', label_en: 'Dinner', label_es: 'Cena', icon: Sunset, group_en: 'Evening', group_es: 'Noche' },
  { value: 'evening_snack', label_en: 'Evening Snack', label_es: 'Snack Nocturno', icon: Moon, group_en: 'Evening', group_es: 'Noche' },
  { value: 'pre_sleep', label_en: 'Pre Sleep', label_es: 'Antes de Dormir', icon: Moon, group_en: 'Evening', group_es: 'Noche' },
];

const GROUP_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Morning: { bg: '#fef9c3', text: '#854d0e', border: '#fde68a' },
  Mañana: { bg: '#fef9c3', text: '#854d0e', border: '#fde68a' },
  Training: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  Entrenamiento: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  Afternoon: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  Tarde: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  Evening: { bg: '#f5f3ff', text: '#4c1d95', border: '#ddd6fe' },
  Noche: { bg: '#f5f3ff', text: '#4c1d95', border: '#ddd6fe' },
};

function sumEntries(entries: DiaryEntry[]): Macros {
  return entries.reduce(
    (acc, e) => ({
      calories_kcal: acc.calories_kcal + e.calories_kcal,
      carbs_g: acc.carbs_g + e.carbs_g,
      protein_g: acc.protein_g + e.protein_g,
      fat_g: acc.fat_g + e.fat_g,
    }),
    { calories_kcal: 0, carbs_g: 0, protein_g: 0, fat_g: 0 }
  );
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

interface AddEntryForm {
  meal_slot: MealSlot;
  food_name: string;
  brand: string;
  serving_quantity: number;
  serving_unit: string;
  calories_kcal: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  fiber_g: number;
  sodium_mg: number;
  sugar_g: number;
  notes: string;
}

const EMPTY_FORM: AddEntryForm = {
  meal_slot: 'breakfast',
  food_name: '',
  brand: '',
  serving_quantity: 1,
  serving_unit: 'serving',
  calories_kcal: 0,
  carbs_g: 0,
  protein_g: 0,
  fat_g: 0,
  fiber_g: 0,
  sodium_mg: 0,
  sugar_g: 0,
  notes: '',
};

export default function DailyDiary({ onBack }: Props) {
  const { user } = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';

  const [date, setDate] = useState(new Date());
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [anamnesis, setAnamnesis] = useState<NutritionAnamnesis | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddEntryForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [_addSlot, setAddSlot] = useState<MealSlot>('breakfast');
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [foodSearchSlot, setFoodSearchSlot] = useState<MealSlot>('breakfast');
  const [copying, setCopying] = useState(false);
  const [copiedDone, setCopiedDone] = useState(false);

  const dateStr = formatDate(date);
  const isToday = formatDate(new Date()) === dateStr;

  useEffect(() => {
    if (!user?.id || user.id.startsWith('demo-')) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      getDiaryEntries(user.id, dateStr),
      getAnamnesis(user.id),
    ]).then(([diaryRes, anaRes]) => {
      setEntries(diaryRes.data);
      setAnamnesis(anaRes.data);
      setLoading(false);
    });
  }, [user?.id, dateStr]);

  const prevDay = () => setDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; });
  const nextDay = () => setDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });

  const openAdd = (slot: MealSlot) => {
    setAddSlot(slot);
    setForm({ ...EMPTY_FORM, meal_slot: slot });
    setEditingId(null);
    setShowAddForm(true);
  };

  const openEdit = (entry: DiaryEntry) => {
    setForm({
      meal_slot: entry.meal_slot,
      food_name: entry.food_name,
      brand: entry.brand,
      serving_quantity: entry.serving_quantity,
      serving_unit: entry.serving_unit,
      calories_kcal: entry.calories_kcal,
      carbs_g: entry.carbs_g,
      protein_g: entry.protein_g,
      fat_g: entry.fat_g,
      fiber_g: entry.fiber_g ?? 0,
      sodium_mg: entry.sodium_mg ?? 0,
      sugar_g: entry.sugar_g ?? 0,
      notes: entry.notes,
    });
    setEditingId(entry.id);
    setShowAddForm(true);
  };

  const handleSave = async () => {
    if (!user?.id || !form.food_name.trim()) return;
    setSaving(true);

    if (editingId) {
      const { data } = await updateDiaryEntry(editingId, {
        ...form,
        diary_date: dateStr,
      });
      if (data) setEntries((prev) => prev.map((e) => (e.id === editingId ? data : e)));
    } else {
      const { data } = await insertDiaryEntry({
        user_id: user.id,
        diary_date: dateStr,
        is_training_day: false,
        training_type: '',
        ai_suggestion: '',
        sort_order: entries.length,
        ...form,
      });
      if (data) setEntries((prev) => [...prev, data]);
    }

    setSaving(false);
    setShowAddForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = async (id: string) => {
    await deleteDiaryEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const openFoodSearch = (slot: MealSlot) => {
    setFoodSearchSlot(slot);
    setShowFoodSearch(true);
  };

  const handleCopyPreviousDay = async () => {
    if (!user?.id) return;
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateStr = formatDate(prevDate);
    setCopying(true);
    const { data: prevEntries } = await getDiaryEntries(user.id, prevDateStr);
    if (!prevEntries || prevEntries.length === 0) { setCopying(false); return; }
    const inserts = prevEntries.map((e) => ({
      user_id: user.id!,
      diary_date: dateStr,
      meal_slot: e.meal_slot,
      food_name: e.food_name,
      brand: e.brand,
      serving_quantity: e.serving_quantity,
      serving_unit: e.serving_unit,
      calories_kcal: e.calories_kcal,
      carbs_g: e.carbs_g,
      protein_g: e.protein_g,
      fat_g: e.fat_g,
      fiber_g: e.fiber_g,
      sodium_mg: e.sodium_mg,
      sugar_g: e.sugar_g,
      notes: e.notes,
      ai_suggestion: '',
      is_training_day: e.is_training_day,
      training_type: e.training_type,
      sort_order: e.sort_order,
    }));
    const { data: inserted } = await supabase
      .from('daily_food_diary')
      .insert(inserts)
      .select();
    if (inserted) setEntries((prev) => [...prev, ...(inserted as DiaryEntry[])]);
    setCopying(false);
    setCopiedDone(true);
    setTimeout(() => setCopiedDone(false), 2000);
  };

  const totals = sumEntries(entries);
  const targets = anamnesis
    ? {
        calories_kcal: anamnesis.target_calories_kcal ?? 0,
        carbs_g: anamnesis.target_carbs_g ?? 0,
        protein_g: anamnesis.target_protein_g ?? 0,
        fat_g: anamnesis.target_fat_g ?? 0,
      }
    : null;

  const groups = es
    ? ['Mañana', 'Entrenamiento', 'Tarde', 'Noche']
    : ['Morning', 'Training', 'Afternoon', 'Evening'];

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl border hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb' }}>
          <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={prevDay} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all">
            <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
          <div className="text-center min-w-[140px]">
            <div className="font-semibold text-sm" style={{ color: '#1f2937' }}>
              {date.toLocaleDateString(es ? 'es' : 'en', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
            {isToday && <div className="text-xs" style={{ color: '#9ca3af' }}>{es ? 'Hoy' : 'Today'}</div>}
          </div>
          <button onClick={nextDay} disabled={isToday} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-30">
            <ChevronRight className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleCopyPreviousDay}
            disabled={copying}
            title={es ? 'Copiar menú de ayer' : "Copy yesterday's menu"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all hover:bg-gray-50"
            style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
          >
            {copying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : copiedDone ? <Check className="w-3.5 h-3.5" style={{ color: '#10b981' }} /> : <Copy className="w-3.5 h-3.5" />}
            {copiedDone ? (es ? 'Copiado' : 'Copied') : (es ? 'Copiar ayer' : 'Copy yesterday')}
          </button>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
            <ClipboardList className="w-4 h-4" style={{ color: '#2563eb' }} />
          </div>
        </div>
      </div>

      {/* Daily Totals */}
      {entries.length > 0 && (
        <div className="bg-white rounded-2xl p-4" style={{ border: '2px solid #e5e7eb' }}>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: es ? 'Calorías' : 'Calories', value: Math.round(totals.calories_kcal), target: targets?.calories_kcal, unit: 'kcal', color: '#f59e0b' },
              { label: es ? 'Carbos' : 'Carbs', value: Math.round(totals.carbs_g), target: targets?.carbs_g, unit: 'g', color: '#3b82f6' },
              { label: es ? 'Proteína' : 'Protein', value: Math.round(totals.protein_g), target: targets?.protein_g, unit: 'g', color: '#10b981' },
              { label: es ? 'Grasa' : 'Fat', value: Math.round(totals.fat_g), target: targets?.fat_g, unit: 'g', color: '#f97316' },
            ].map(({ label, value, target, unit, color }) => (
              <div key={label} className="text-center">
                <div className="text-base font-bold" style={{ color }}>{value}<span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>{unit}</span></div>
                {target && target > 0 && (
                  <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>/ {target}{unit}</div>
                )}
                <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meal Slots by Group */}
      {groups.map((group) => {
        const slots = MEAL_SLOTS.filter((s) => (es ? s.group_es : s.group_en) === group);
        const groupEntries = entries.filter((e) => slots.some((s) => s.value === e.meal_slot));
        const gc = GROUP_COLORS[group];
        return (
          <div key={group} className="bg-white rounded-2xl overflow-hidden" style={{ border: '2px solid #e5e7eb' }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: gc.bg, borderBottom: `1px solid ${gc.border}` }}>
              <span className="text-sm font-semibold" style={{ color: gc.text }}>{group}</span>
              {groupEntries.length > 0 && (
                <span className="text-xs" style={{ color: gc.text }}>
                  {Math.round(sumEntries(groupEntries).calories_kcal)} kcal
                </span>
              )}
            </div>
            <div className="divide-y" style={{ borderColor: '#f3f4f6' }}>
              {slots.map((slot) => {
                const slotEntries = entries.filter((e) => e.meal_slot === slot.value);
                const SlotIcon = slot.icon;
                return (
                  <div key={slot.value} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <SlotIcon className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
                        <span className="text-xs font-medium" style={{ color: '#6b7280' }}>{es ? slot.label_es : slot.label_en}</span>
                        {slotEntries.length > 0 && (
                          <span className="text-xs" style={{ color: '#9ca3af' }}>
                            {Math.round(sumEntries(slotEntries).calories_kcal)} kcal
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openFoodSearch(slot.value)}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all hover:bg-gray-100"
                          style={{ color: '#9ca3af' }}
                          title={es ? 'Buscar en BD' : 'Search DB'}
                        >
                          <Search className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => openAdd(slot.value)}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all hover:bg-gray-100"
                          style={{ color: '#9ca3af' }}
                        >
                          <Plus className="w-3 h-3" /> {es ? 'Agregar' : 'Add'}
                        </button>
                      </div>
                    </div>
                    {slotEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between py-1.5 px-2 rounded-lg group hover:bg-gray-50"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block" style={{ color: '#1f2937' }}>
                            {entry.food_name}
                            {entry.brand && <span className="text-xs ml-1" style={{ color: '#9ca3af' }}>({entry.brand})</span>}
                          </span>
                          <span className="text-xs" style={{ color: '#9ca3af' }}>
                            {entry.serving_quantity} {entry.serving_unit} · {Math.round(entry.carbs_g)}g C · {Math.round(entry.protein_g)}g P · {Math.round(entry.fat_g)}g F
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-medium mr-2" style={{ color: '#6b7280' }}>{Math.round(entry.calories_kcal)} kcal</span>
                          <button onClick={() => openEdit(entry)} className="p-1 rounded hover:bg-gray-200 transition-all">
                            <Edit2 className="w-3.5 h-3.5" style={{ color: '#6b7280' }} />
                          </button>
                          <button onClick={() => handleDelete(entry.id)} className="p-1 rounded hover:bg-red-100 transition-all">
                            <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                          </button>
                        </div>
                        <span className="text-xs font-medium ml-2 block group-hover:hidden" style={{ color: '#6b7280' }}>
                          {Math.round(entry.calories_kcal)} kcal
                        </span>
                      </div>
                    ))}
                    {slotEntries.length === 0 && (
                      <p className="text-xs py-1" style={{ color: '#d1d5db' }}>{es ? 'Nada registrado aún' : 'Nothing logged yet'}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ border: '2px solid #e5e7eb' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#f3f4f6' }}>
              <h3 className="font-semibold" style={{ color: '#1f2937' }}>{editingId ? (es ? 'Editar Entrada' : 'Edit Entry') : (es ? 'Agregar Alimento' : 'Add Food')}</h3>
              <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" style={{ color: '#6b7280' }} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{es ? 'Momento' : 'Meal Slot'}</label>
                <select
                  value={form.meal_slot}
                  onChange={(e) => setForm((f) => ({ ...f, meal_slot: e.target.value as MealSlot }))}
                  className="input-brand"
                >
                  {MEAL_SLOTS.map((s) => (
                    <option key={s.value} value={s.value}>{es ? s.label_es : s.label_en}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{es ? 'Nombre del alimento *' : 'Food Name *'}</label>
                  <input
                    type="text"
                    value={form.food_name}
                    onChange={(e) => setForm((f) => ({ ...f, food_name: e.target.value }))}
                    placeholder={es ? 'ej. Avena' : 'e.g. Oatmeal'}
                    className="input-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{es ? 'Marca' : 'Brand'}</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    placeholder={es ? 'opcional' : 'optional'}
                    className="input-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{es ? 'Cantidad' : 'Quantity'}</label>
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={form.serving_quantity}
                    onChange={(e) => setForm((f) => ({ ...f, serving_quantity: parseFloat(e.target.value) || 1 }))}
                    className="input-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{es ? 'Unidad' : 'Unit'}</label>
                  <input
                    type="text"
                    value={form.serving_unit}
                    onChange={(e) => setForm((f) => ({ ...f, serving_unit: e.target.value }))}
                    placeholder={es ? 'g, ml, porción...' : 'g, ml, serving...'}
                    className="input-brand"
                  />
                </div>
              </div>
              <div className="border-t pt-4" style={{ borderColor: '#f3f4f6' }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9ca3af' }}>{es ? 'Macros por porción' : 'Macros per serving'}</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'calories_kcal' as const, label: es ? 'Calorías (kcal)' : 'Calories (kcal)', color: '#f59e0b' },
                    { key: 'carbs_g' as const, label: es ? 'Carbos (g)' : 'Carbs (g)', color: '#3b82f6' },
                    { key: 'protein_g' as const, label: es ? 'Proteína (g)' : 'Protein (g)', color: '#10b981' },
                    { key: 'fat_g' as const, label: es ? 'Grasa (g)' : 'Fat (g)', color: '#f97316' },
                    { key: 'fiber_g' as const, label: es ? 'Fibra (g)' : 'Fiber (g)', color: '#8b5cf6' },
                    { key: 'sodium_mg' as const, label: es ? 'Sodio (mg)' : 'Sodium (mg)', color: '#6b7280' },
                  ].map(({ key, label, color }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium mb-1" style={{ color }}>
                        {label}
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={form[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: parseFloat(e.target.value) || 0 }))}
                        className="input-brand text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{es ? 'Notas' : 'Notes'}</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder={es ? 'opcional' : 'optional'}
                  className="input-brand"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowAddForm(false); setEditingId(null); }}
                  className="flex-1 py-2.5 rounded-xl border font-medium text-sm transition-all"
                  style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
                >
                  {es ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.food_name.trim()}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingId ? (es ? 'Actualizar' : 'Update') : (es ? 'Agregar' : 'Add Entry')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} />
        </div>
      )}

      {showFoodSearch && user?.id && (
        <FoodSearchModal
          slot={foodSearchSlot}
          userId={user.id}
          date={dateStr}
          onAdd={(entry) => setEntries((prev) => [...prev, entry])}
          onClose={() => setShowFoodSearch(false)}
          es={es}
        />
      )}
    </div>
  );
}
