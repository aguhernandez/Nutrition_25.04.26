import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Plus, Save, Trash2, Calendar, Loader2, Check,
  Search, GripVertical, X, TrendingUp, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { getMealPlans, upsertMealPlan, deleteMealPlan } from '../../lib/nutritionService';
import { getAnamnesis } from '../../lib/nutritionService';
import { supabase } from '../../lib/supabase';
import type { MealPlan, PlanType, MealFoodItem, NutritionAnamnesis } from '../../types/nutritionModule';
import { getTagsForMealPlan, setTagsForMealPlan, syncAthleteTagsToHub } from '../../lib/tagService';
import type { Tag } from '../../lib/tagService';
import TagSelector from '../shared/TagSelector';

interface Props {
  onBack: () => void;
  targetUserId?: string;
  targetUserName?: string;
  targetUserEmail?: string;
}

interface Food {
  id: string;
  name: string;
  brand: string;
  category: string;
  calories_kcal: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  sodium_mg: number;
  serving_size_g: number;
  serving_description: string;
}

const PLAN_TYPES: { value: PlanType; label: string; desc: string; color: string; bg: string; border: string }[] = [
  { value: 'base', label: 'Base Day', desc: 'Normal training day', color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
  { value: 'load', label: 'Load Day', desc: 'High carb', color: '#b45309', bg: '#fef3c7', border: '#fcd34d' },
  { value: 'taper', label: 'Taper', desc: 'Reduce volume', color: '#1d4ed8', bg: '#eff6ff', border: '#93c5fd' },
  { value: 'race_day', label: 'Race Day', desc: 'Competition', color: '#be185d', bg: '#fdf2f8', border: '#f9a8d4' },
  { value: 'recovery', label: 'Recovery', desc: 'Rest day', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  { value: 'custom', label: 'Custom', desc: 'Freestyle', color: '#374151', bg: '#f9fafb', border: '#e5e7eb' },
];

const MEAL_SLOTS = [
  { key: 'wake_up', label: 'Wake Up', emoji: '☀️' },
  { key: 'breakfast', label: 'Breakfast', emoji: '🥣' },
  { key: 'mid_morning', label: 'Mid Morning', emoji: '🍎' },
  { key: 'pre_training', label: 'Pre Training', emoji: '⚡' },
  { key: 'during_training', label: 'During Training', emoji: '🏃' },
  { key: 'post_training', label: 'Post Training', emoji: '💪' },
  { key: 'lunch', label: 'Lunch', emoji: '🥗' },
  { key: 'afternoon_snack', label: 'Afternoon Snack', emoji: '🍌' },
  { key: 'dinner', label: 'Dinner', emoji: '🍽' },
  { key: 'evening_snack', label: 'Evening Snack', emoji: '🌙' },
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface DayMacros {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

function calcDayMacros(plan: MealPlan, dayKey: string): DayMacros {
  const day = plan.meals?.[dayKey] ?? {};
  let cal = 0, carbs = 0, protein = 0, fat = 0;
  Object.values(day).forEach((slot: any) => {
    (slot as MealFoodItem[]).forEach((item) => {
      cal += item.calories_kcal ?? 0;
      carbs += item.carbs_g ?? 0;
      protein += item.protein_g ?? 0;
      fat += item.fat_g ?? 0;
    });
  });
  return { calories: Math.round(cal), carbs: Math.round(carbs), protein: Math.round(protein), fat: Math.round(fat) };
}

function MacroBar({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-body text-xs" style={{ color: '#9ca3af' }}>{label}</span>
        <span className="font-body text-xs font-semibold" style={{ color }}>
          {value}g {target > 0 && <span style={{ color: '#9ca3af' }}>/ {target}g</span>}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function FoodSearch({ onAdd, slot }: { onAdd: (food: Food, qty: number) => void; slot: string }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [qty, setQty] = useState(100);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const search = async (query: string) => {
    setQ(query);
    if (query.length < 2) { setResults([]); return; }
    setSearching(true);
    const { data } = await supabase
      .from('foods')
      .select('*')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .limit(8);
    setResults((data ?? []) as Food[]);
    setShowResults(true);
    setSearching(false);
  };

  const handleAdd = (food: Food) => {
    const ratio = qty / food.serving_size_g;
    const scaledFood = {
      ...food,
      calories_kcal: Math.round(food.calories_kcal * ratio),
      carbs_g: Math.round(food.carbs_g * ratio * 10) / 10,
      protein_g: Math.round(food.protein_g * ratio * 10) / 10,
      fat_g: Math.round(food.fat_g * ratio * 10) / 10,
      sodium_mg: Math.round(food.sodium_mg * ratio),
    };
    onAdd(scaledFood, qty);
    setQ('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={ref} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
          <input
            type="text"
            value={q}
            onChange={(e) => search(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Search food database..."
            className="input-brand pl-9 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(parseFloat(e.target.value) || 100)}
            min={1}
            className="input-brand py-2 text-sm text-center w-16"
            title="Serving quantity in grams"
          />
          <span className="font-body text-xs" style={{ color: '#9ca3af' }}>g</span>
        </div>
      </div>
      {showResults && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 z-30 mt-1 bg-white rounded-xl overflow-hidden"
          style={{ border: '2px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
        >
          {results.map((food) => {
            const ratio = qty / food.serving_size_g;
            return (
              <button
                key={food.id}
                onClick={() => handleAdd(food)}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors text-left border-b last:border-0"
                style={{ borderColor: '#f3f4f6' }}
              >
                <div>
                  <div className="font-body font-semibold text-sm" style={{ color: '#1f2937' }}>{food.name}</div>
                  <div className="font-body text-xs" style={{ color: '#9ca3af' }}>{food.serving_description}</div>
                </div>
                <div className="flex items-center gap-2 text-xs font-body ml-3">
                  <span style={{ color: '#f59e0b' }}>{Math.round(food.calories_kcal * ratio)} kcal</span>
                  <span style={{ color: '#3b82f6' }}>{Math.round(food.carbs_g * ratio)}g C</span>
                  <span style={{ color: '#10b981' }}>{Math.round(food.protein_g * ratio)}g P</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
      {searching && <Loader2 className="absolute right-28 top-3 w-3.5 h-3.5 animate-spin" style={{ color: '#9ca3af' }} />}
    </div>
  );
}

export default function MealPlanEditor({ onBack, targetUserId, targetUserName, targetUserEmail }: Props) {
  const { user, profile } = useAuth();
  const effectiveUserId = targetUserId ?? user?.id;
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [anamnesis, setAnamnesis] = useState<NutritionAnamnesis | null>(null);
  const [collapsedSlots, setCollapsedSlots] = useState<Set<string>>(new Set());
  const [planTags, setPlanTags] = useState<Tag[]>([]);
  const [tagsByPlanId, setTagsByPlanId] = useState<Record<string, Tag[]>>({});

  const [newForm, setNewForm] = useState({ name: '', description: '', plan_type: 'base' as PlanType, duration_days: 7 });

  useEffect(() => {
    if (!effectiveUserId || effectiveUserId.startsWith('demo-')) { setLoading(false); return; }
    Promise.all([
      getMealPlans(effectiveUserId),
      getAnamnesis(effectiveUserId),
    ]).then(([plansRes, anaRes]) => {
      setPlans(plansRes.data);
      setAnamnesis(anaRes.data);
      setLoading(false);
      plansRes.data.forEach((plan) => {
        if (plan.id) {
          getTagsForMealPlan(plan.id).then((tags) => {
            setTagsByPlanId((prev) => ({ ...prev, [plan.id]: tags }));
          });
        }
      });
      const hubTarget = targetUserEmail ?? profile?.email;
      const localId = targetUserId ?? profile?.id;
      if (hubTarget && localId) {
        syncAthleteTagsToHub(hubTarget, localId);
      }
    });
  }, [effectiveUserId]);

  useEffect(() => {
    if (!selectedPlan?.id) { setPlanTags([]); return; }
    const cached = tagsByPlanId[selectedPlan.id];
    if (cached) { setPlanTags(cached); return; }
    getTagsForMealPlan(selectedPlan.id).then((tags) => {
      setPlanTags(tags);
      setTagsByPlanId((prev) => ({ ...prev, [selectedPlan.id]: tags }));
    });
  }, [selectedPlan?.id]);

  const targets = anamnesis
    ? { carbs: anamnesis.target_carbs_g ?? 0, protein: anamnesis.target_protein_g ?? 0, fat: anamnesis.target_fat_g ?? 0 }
    : { carbs: 0, protein: 0, fat: 0 };

  const handleCreate = async () => {
    if (!effectiveUserId || !newForm.name.trim()) return;
    setSaving(true);
    const { data } = await upsertMealPlan({
      user_id: effectiveUserId, ...newForm, meals: {}, daily_totals: [],
      is_template: false, is_active: true, competition_id: null, tags: [],
    });
    if (data) { setPlans((p) => [data, ...p]); setSelectedPlan(data); setShowCreate(false); }
    setSaving(false);
  };

  const handleSave = async () => {
    if (!selectedPlan || !effectiveUserId) return;
    setSaving(true);
    const { data } = await upsertMealPlan({ ...selectedPlan, user_id: effectiveUserId });
    if (data) {
      setPlans((p) => p.map((pl) => (pl.id === selectedPlan.id ? data : pl)));
      if (selectedPlan.id) {
        await setTagsForMealPlan(selectedPlan.id, planTags.map((t) => t.id));
        setTagsByPlanId((prev) => ({ ...prev, [selectedPlan.id]: planTags }));
      }
      const hubTarget = targetUserEmail ?? profile?.email;
      const localId = targetUserId ?? profile?.id;
      if (hubTarget && localId) {
        syncAthleteTagsToHub(hubTarget, localId);
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addFoodToSlot = (dayKey: string, slotKey: string, food: Food, qty: number) => {
    if (!selectedPlan) return;
    const newItem: MealFoodItem = {
      id: crypto.randomUUID(),
      food_name: food.name,
      brand: food.brand,
      serving_quantity: qty,
      serving_unit: 'g',
      calories_kcal: food.calories_kcal,
      carbs_g: food.carbs_g,
      protein_g: food.protein_g,
      fat_g: food.fat_g,
      sodium_mg: food.sodium_mg,
    };
    const updatedMeals = { ...selectedPlan.meals };
    if (!updatedMeals[dayKey]) updatedMeals[dayKey] = {} as any;
    updatedMeals[dayKey] = {
      ...updatedMeals[dayKey],
      [slotKey]: [...(updatedMeals[dayKey][slotKey] ?? []), newItem],
    };
    setSelectedPlan({ ...selectedPlan, meals: updatedMeals });
  };

  const removeItem = (dayKey: string, slotKey: string, itemId: string) => {
    if (!selectedPlan) return;
    const updatedMeals = { ...selectedPlan.meals };
    if (updatedMeals[dayKey]?.[slotKey]) {
      updatedMeals[dayKey][slotKey] = (updatedMeals[dayKey][slotKey] as MealFoodItem[]).filter((i) => i.id !== itemId);
    }
    setSelectedPlan({ ...selectedPlan, meals: updatedMeals });
  };

  const toggleSlot = (key: string) => {
    setCollapsedSlots((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const planTypeInfo = (t: PlanType) => PLAN_TYPES.find((p) => p.value === t) ?? PLAN_TYPES[0];

  // ─── Plan List view ───
  if (!selectedPlan) {
    return (
      <div className="p-4 lg:p-8 max-w-7xl mx-auto animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="btn-ghost p-2 rounded-xl border" style={{ borderColor: '#e5e7eb' }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
              <Calendar className="w-5 h-5" style={{ color: '#15803d' }} />
            </div>
            <div>
              <h1 className="font-heading text-xl" style={{ color: '#1f2937' }}>Meal Plans</h1>
              {targetUserName && (
                <p className="font-body text-xs mt-0.5" style={{ color: '#9ca3af' }}>for {targetUserName}</p>
              )}
            </div>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 py-2 px-4">
            <Plus className="w-4 h-4" /> New Plan
          </button>
        </div>

        {/* Plan types guide */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {PLAN_TYPES.map((pt) => (
            <div key={pt.value} className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: pt.bg, border: `1px solid ${pt.border}` }}>
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: pt.color }} />
              <div>
                <div className="font-body font-semibold text-xs" style={{ color: pt.color }}>{pt.label}</div>
                <div className="font-body text-xs" style={{ color: '#6b7280' }}>{pt.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} /></div>
        ) : plans.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl card-brand">
            <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: '#d1d5db' }} />
            <h3 className="font-heading text-lg mb-2" style={{ color: '#1f2937' }}>No meal plans yet</h3>
            <p className="font-body text-sm mb-5" style={{ color: '#9ca3af' }}>Build structured weekly nutrition plans for each training phase</p>
            <button onClick={() => setShowCreate(true)} className="btn-primary">Create First Plan</button>
          </div>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => {
              const pt = planTypeInfo(plan.plan_type);
              const dayMacros = calcDayMacros(plan, 'day_1');
              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl p-5 cursor-pointer card-brand"
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: pt.bg }}>
                        <Calendar className="w-5 h-5" style={{ color: pt.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-body font-bold" style={{ color: '#1f2937' }}>{plan.name}</div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="badge text-xs" style={{ backgroundColor: pt.bg, color: pt.color }}>{pt.label}</span>
                          <span className="font-body text-xs" style={{ color: '#9ca3af' }}>{plan.duration_days} days</span>
                          {plan.is_active && <span className="badge badge-green text-xs">Active</span>}
                        </div>
                        {(tagsByPlanId[plan.id] ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {(tagsByPlanId[plan.id] ?? []).map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{ backgroundColor: tag.color + '18', color: tag.color, border: `1px solid ${tag.color}33` }}
                              >
                                {tag.name_es || tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {dayMacros.calories > 0 && (
                        <div className="text-right mr-2">
                          <div className="font-heading text-sm" style={{ color: '#f59e0b' }}>{dayMacros.calories} kcal</div>
                          <div className="font-body text-xs" style={{ color: '#9ca3af' }}>Day 1 avg</div>
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteMealPlan(plan.id); setPlans((p) => p.filter((pl) => pl.id !== plan.id)); }}
                        className="p-2 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.opacity = '1'}
                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.opacity = '0'}
                      >
                        <Trash2 className="w-4 h-4" style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="bg-white rounded-2xl w-full max-w-md" style={{ border: '2px solid #e5e7eb' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#f3f4f6' }}>
                <h3 className="font-body font-semibold" style={{ color: '#1f2937' }}>New Meal Plan</h3>
                <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" style={{ color: '#6b7280' }} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Plan Name *</label>
                  <input type="text" value={newForm.name} onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Race Week Plan" className="input-brand" />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium mb-2" style={{ color: '#374151' }}>Plan Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PLAN_TYPES.map((pt) => (
                      <button
                        key={pt.value}
                        type="button"
                        onClick={() => setNewForm((f) => ({ ...f, plan_type: pt.value }))}
                        className="text-left p-2.5 rounded-xl border transition-all"
                        style={{ borderColor: newForm.plan_type === pt.value ? pt.color : '#e5e7eb', backgroundColor: newForm.plan_type === pt.value ? pt.bg : '#fff' }}
                      >
                        <div className="font-body text-xs font-semibold" style={{ color: pt.color }}>{pt.label}</div>
                        <div className="font-body text-xs" style={{ color: '#9ca3af' }}>{pt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Duration (days)</label>
                  <input type="number" min={1} max={30} value={newForm.duration_days} onChange={(e) => setNewForm((f) => ({ ...f, duration_days: parseInt(e.target.value) || 7 }))} className="input-brand" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl border font-body font-medium text-sm" style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>Cancel</button>
                  <button onClick={handleCreate} disabled={saving || !newForm.name.trim()} className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Plan Editor view ───
  const dayKey = `day_${selectedDay + 1}`;
  const dayMacros = calcDayMacros(selectedPlan, dayKey);
  const pt = planTypeInfo(selectedPlan.plan_type);

  const carbCycleSuggested = (() => {
    const t = selectedPlan.plan_type;
    if (t === 'load') return { carbs: Math.round((anamnesis?.body_weight_kg ?? 70) * 9), protein: Math.round((anamnesis?.body_weight_kg ?? 70) * 1.6), fat: Math.round((anamnesis?.body_weight_kg ?? 70) * 0.8) };
    if (t === 'taper') return { carbs: Math.round((anamnesis?.body_weight_kg ?? 70) * 6), protein: Math.round((anamnesis?.body_weight_kg ?? 70) * 1.8), fat: Math.round((anamnesis?.body_weight_kg ?? 70) * 1.2) };
    if (t === 'race_day') return { carbs: Math.round((anamnesis?.body_weight_kg ?? 70) * 10), protein: Math.round((anamnesis?.body_weight_kg ?? 70) * 1.4), fat: Math.round((anamnesis?.body_weight_kg ?? 70) * 0.6) };
    if (t === 'recovery') return { carbs: Math.round((anamnesis?.body_weight_kg ?? 70) * 4), protein: Math.round((anamnesis?.body_weight_kg ?? 70) * 2.0), fat: Math.round((anamnesis?.body_weight_kg ?? 70) * 1.2) };
    return { carbs: targets.carbs, protein: targets.protein, fat: targets.fat };
  })();

  const dayTargets = carbCycleSuggested;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => setSelectedPlan(null)} className="btn-ghost p-2 rounded-xl border" style={{ borderColor: '#e5e7eb' }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="font-heading text-xl" style={{ color: '#1f2937' }}>{selectedPlan.name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="badge text-xs" style={{ backgroundColor: pt.bg, color: pt.color }}>{pt.label}</span>
            <span className="font-body text-xs" style={{ color: '#9ca3af' }}>{selectedPlan.duration_days} days</span>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2 py-2 px-4"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Plan'}
        </button>
      </div>

      <div className="mb-5">
        <TagSelector
          selectedTags={planTags}
          onChange={(tags) => setPlanTags(tags)}
          placeholder="Add tags to this plan..."
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Day selector + macro summary (left sidebar) */}
        <div className="lg:col-span-1 space-y-4">
          {/* Day selector */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '2px solid #e5e7eb' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: '#f3f4f6', backgroundColor: '#f9fafb' }}>
              <span className="font-body font-semibold text-sm" style={{ color: '#1f2937' }}>Days</span>
            </div>
            <div className="p-2">
              {Array.from({ length: Math.min(selectedPlan.duration_days, 7) }, (_, i) => {
                const dk = `day_${i + 1}`;
                const dm = calcDayMacros(selectedPlan, dk);
                const hasFoods = dm.calories > 0;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(i)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all mb-1"
                    style={{
                      backgroundColor: selectedDay === i ? '#514163' : 'transparent',
                      color: selectedDay === i ? '#fdda36' : '#374151',
                    }}
                  >
                    <div className="text-left">
                      <div className="font-body font-semibold text-sm">{DAYS_OF_WEEK[i] ?? `Day ${i + 1}`}</div>
                      {hasFoods && (
                        <div className="font-body text-xs mt-0.5" style={{ color: selectedDay === i ? 'rgba(253,218,54,0.7)' : '#9ca3af' }}>
                          {dm.calories} kcal
                        </div>
                      )}
                    </div>
                    {hasFoods && (
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedDay === i ? '#fdda36' : '#10b981' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day macro summary */}
          <div className="bg-white rounded-2xl p-4" style={{ border: '2px solid #e5e7eb' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4" style={{ color: '#514163' }} />
              <span className="font-body font-semibold text-sm" style={{ color: '#1f2937' }}>Day Totals</span>
            </div>
            <div className="text-center mb-3">
              <div className="font-heading text-2xl" style={{ color: '#f59e0b' }}>{dayMacros.calories}</div>
              <div className="font-body text-xs" style={{ color: '#9ca3af' }}>kcal</div>
            </div>
            <div className="space-y-2">
              <MacroBar label="Carbs" value={dayMacros.carbs} target={dayTargets.carbs} color="#3b82f6" />
              <MacroBar label="Protein" value={dayMacros.protein} target={dayTargets.protein} color="#10b981" />
              <MacroBar label="Fat" value={dayMacros.fat} target={dayTargets.fat} color="#f97316" />
            </div>
            {anamnesis && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: '#f3f4f6' }}>
                <div className="flex items-center gap-1 mb-2">
                  <Info className="w-3 h-3" style={{ color: '#9ca3af' }} />
                  <span className="font-body text-xs" style={{ color: '#9ca3af' }}>Carb cycling — {pt.label}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-body text-xs">
                    <span style={{ color: '#9ca3af' }}>Target carbs</span>
                    <span style={{ color: '#3b82f6' }}>{dayTargets.carbs}g</span>
                  </div>
                  <div className="flex justify-between font-body text-xs">
                    <span style={{ color: '#9ca3af' }}>Target protein</span>
                    <span style={{ color: '#10b981' }}>{dayTargets.protein}g</span>
                  </div>
                  <div className="flex justify-between font-body text-xs">
                    <span style={{ color: '#9ca3af' }}>Target fat</span>
                    <span style={{ color: '#f97316' }}>{dayTargets.fat}g</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Meal slots (main area) */}
        <div className="lg:col-span-3 space-y-3">
          {MEAL_SLOTS.map((slot) => {
            const slotKey = `${dayKey}_${slot.key}`;
            const items = (selectedPlan.meals?.[dayKey]?.[slot.key] as MealFoodItem[]) ?? [];
            const slotMacros = items.reduce((a, i) => ({ cal: a.cal + (i.calories_kcal ?? 0), c: a.c + (i.carbs_g ?? 0), p: a.p + (i.protein_g ?? 0), f: a.f + (i.fat_g ?? 0) }), { cal: 0, c: 0, p: 0, f: 0 });
            const collapsed = collapsedSlots.has(slotKey);

            return (
              <div key={slot.key} className="bg-white rounded-2xl overflow-hidden" style={{ border: '2px solid #e5e7eb' }}>
                {/* Slot header */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ borderBottom: collapsed ? 'none' : '1px solid #f3f4f6' }}
                  onClick={() => toggleSlot(slotKey)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{slot.emoji}</span>
                    <span className="font-body font-semibold text-sm" style={{ color: '#1f2937' }}>{slot.label}</span>
                    {slotMacros.cal > 0 && (
                      <span className="font-body text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fef9c3', color: '#b45309' }}>
                        {Math.round(slotMacros.cal)} kcal
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {slotMacros.cal > 0 && (
                      <div className="hidden sm:flex items-center gap-2 text-xs font-body">
                        <span style={{ color: '#3b82f6' }}>{Math.round(slotMacros.c)}g C</span>
                        <span style={{ color: '#10b981' }}>{Math.round(slotMacros.p)}g P</span>
                        <span style={{ color: '#f97316' }}>{Math.round(slotMacros.f)}g F</span>
                      </div>
                    )}
                    {collapsed ? <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} /> : <ChevronUp className="w-4 h-4" style={{ color: '#9ca3af' }} />}
                  </div>
                </div>

                {!collapsed && (
                  <div className="p-4 space-y-3">
                    {/* Food items */}
                    {items.length > 0 && (
                      <div className="space-y-1">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 py-2 px-2 rounded-xl group hover:bg-gray-50 transition-colors"
                          >
                            <GripVertical className="w-3.5 h-3.5 flex-shrink-0 cursor-grab opacity-30 group-hover:opacity-60" style={{ color: '#9ca3af' }} />
                            <div className="flex-1 min-w-0">
                              <span className="font-body font-medium text-sm" style={{ color: '#1f2937' }}>{item.food_name}</span>
                              <span className="font-body text-xs ml-2" style={{ color: '#9ca3af' }}>{item.serving_quantity}g</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-body flex-shrink-0">
                              <span style={{ color: '#f59e0b' }}>{Math.round(item.calories_kcal)} kcal</span>
                              <span className="hidden sm:block" style={{ color: '#3b82f6' }}>{Math.round(item.carbs_g)}g C</span>
                              <span className="hidden sm:block" style={{ color: '#10b981' }}>{Math.round(item.protein_g)}g P</span>
                            </div>
                            <button
                              onClick={() => removeItem(dayKey, slot.key, item.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 transition-all"
                            >
                              <X className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Food search */}
                    <FoodSearch
                      slot={slot.key}
                      onAdd={(food, qty) => addFoodToSlot(dayKey, slot.key, food, qty)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
