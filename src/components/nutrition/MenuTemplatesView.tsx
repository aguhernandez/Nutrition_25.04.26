import React, { useEffect, useState, useCallback } from 'react';
import {
  ArrowLeft, ChevronDown, ChevronUp, Filter, Zap, Dumbbell, Wind, Scale,
  BookOpen, Calendar, Utensils, Info, Users, ShoppingCart, ChevronsDownUp,
  ChevronsUpDown, BarChart2, Tag, CheckCircle, X, Loader2, TrendingUp,
  AlertCircle, Plus
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { upsertMealPlan } from '../../lib/nutritionService';
import { usePreferences } from '../../lib/preferences';
import { useAuth } from '../../lib/auth';
import CreateTemplateModal from './CreateTemplateModal';

interface TemplateFood {
  name_es: string;
  name_en: string;
  quantity_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface TemplateMeal {
  slot: string;
  name_es: string;
  name_en: string;
  foods: TemplateFood[];
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  notes_es: string;
  notes_en: string;
}

interface TemplateDay {
  day_number: number;
  day_name: string;
  meals: TemplateMeal[];
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
}

interface MealPlanTemplate {
  id: string;
  name: string;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  calories_target: number;
  focus: string;
  dietary_pattern: string;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  days: TemplateDay[];
  tags: string[];
  suitable_for: string[];
  is_active: boolean;
  created_at: string;
}

interface AthleteProfile {
  id: string;
  full_name: string;
  email: string;
  hub_user_id?: string;
}

type DetailTab = 'day' | 'week' | 'macros' | 'shopping';

const FOCUS_CONFIG: Record<string, { label: string; labelEs: string; color: string; bg: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  balanced:     { label: 'Balanced',     labelEs: 'Balanceado',      color: '#059669', bg: '#d1fae5', icon: Scale },
  high_carb:    { label: 'High Carb',    labelEs: 'Alto en Carbos',  color: '#d97706', bg: '#fef3c7', icon: Zap },
  high_protein: { label: 'High Protein', labelEs: 'Alto en Proteína',color: '#dc2626', bg: '#fee2e2', icon: Dumbbell },
  endurance:    { label: 'Endurance',    labelEs: 'Resistencia',     color: '#2563eb', bg: '#dbeafe', icon: Wind },
  strength:     { label: 'Strength',     labelEs: 'Fuerza',          color: '#b45309', bg: '#fef3c7', icon: Dumbbell },
  weight_loss:  { label: 'Weight Loss',  labelEs: 'Pérdida de Peso', color: '#0891b2', bg: '#cffafe', icon: Scale },
  recovery:     { label: 'Recovery',     labelEs: 'Recuperación',    color: '#16a34a', bg: '#dcfce7', icon: Utensils },
};

const SLOT_LABELS_ES: Record<string, string> = {
  wake_up:          'Despertar',
  breakfast:        'Desayuno',
  mid_morning:      'Media Mañana',
  lunch:            'Almuerzo',
  pre_training:     'Pre-Entreno',
  during_training:  'Durante Entreno',
  post_training:    'Post-Entreno',
  afternoon_snack:  'Merienda',
  dinner:           'Cena',
  evening_snack:    'Snack Nocturno',
  pre_sleep:        'Pre-Sueño',
};

const SLOT_LABELS_EN: Record<string, string> = {
  wake_up:          'Wake Up',
  breakfast:        'Breakfast',
  mid_morning:      'Mid-Morning',
  lunch:            'Lunch',
  pre_training:     'Pre-Training',
  during_training:  'During Training',
  post_training:    'Post-Training',
  afternoon_snack:  'Afternoon Snack',
  dinner:           'Dinner',
  evening_snack:    'Evening Snack',
  pre_sleep:        'Pre-Sleep',
};

const CALORIE_OPTIONS = [1800, 2000, 2300, 2500, 2800, 3000, 3500, 4000, 5000];

const DAY_COLORS = [
  '#3b82f6', '#059669', '#d97706', '#dc2626', '#8b5cf6', '#0891b2', '#16a34a',
];

function MacroBar({ protein, carbs, fat, height = 'h-2' }: { protein: number; carbs: number; fat: number; height?: string }) {
  const total = protein * 4 + carbs * 4 + fat * 9;
  if (total === 0) return null;
  const pPct = Math.round((protein * 4 / total) * 100);
  const cPct = Math.round((carbs * 4 / total) * 100);
  const fPct = 100 - pPct - cPct;
  return (
    <div className={`flex rounded-full overflow-hidden ${height} w-full`}>
      <div style={{ width: `${pPct}%`, backgroundColor: '#ef4444' }} title={`Proteína ${pPct}%`} />
      <div style={{ width: `${cPct}%`, backgroundColor: '#f59e0b' }} title={`Carbos ${cPct}%`} />
      <div style={{ width: `${fPct}%`, backgroundColor: '#3b82f6' }} title={`Grasa ${fPct}%`} />
    </div>
  );
}

function getWeeklyStats(template: MealPlanTemplate) {
  const totalDays = template.days.length;
  if (totalDays === 0) return null;
  const totalCal = template.days.reduce((s, d) => s + d.total_calories, 0);
  const totalP   = template.days.reduce((s, d) => s + d.total_protein_g, 0);
  const totalC   = template.days.reduce((s, d) => s + d.total_carbs_g, 0);
  const totalF   = template.days.reduce((s, d) => s + d.total_fat_g, 0);
  return {
    avgCal: Math.round(totalCal / totalDays),
    avgP:   Math.round(totalP / totalDays),
    avgC:   Math.round(totalC / totalDays),
    avgF:   Math.round(totalF / totalDays),
    totalMeals: template.days.reduce((s, d) => s + d.meals.length, 0),
  };
}

function getUniqueFoods(template: MealPlanTemplate, lang: 'es' | 'en' = 'es'): string[] {
  const names = new Set<string>();
  template.days.forEach(d => d.meals.forEach(m => m.foods.forEach(f => names.add(lang === 'es' ? f.name_es : f.name_en))));
  return Array.from(names);
}

interface ShoppingItem {
  name_es: string;
  name_en: string;
  total_g: number;
  times_used: number;
}

function buildShoppingList(template: MealPlanTemplate): ShoppingItem[] {
  const map = new Map<string, ShoppingItem>();
  template.days.forEach(d =>
    d.meals.forEach(m =>
      m.foods.forEach(f => {
        const key = f.name_es.toLowerCase().trim();
        const existing = map.get(key);
        if (existing) {
          existing.total_g += f.quantity_g;
          existing.times_used += 1;
        } else {
          map.set(key, { name_es: f.name_es, name_en: f.name_en, total_g: f.quantity_g, times_used: 1 });
        }
      })
    )
  );
  return Array.from(map.values()).sort((a, b) => b.total_g - a.total_g);
}

export default function MenuTemplatesView({ onBack }: { onBack: () => void }) {
  const { language } = usePreferences();
  const { profile } = useAuth();
  const es = language === 'es';
  const SLOT_LABELS = es ? SLOT_LABELS_ES : SLOT_LABELS_EN;
  const canCreate = profile?.role === 'admin' || profile?.role === 'coach';

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [templates, setTemplates]           = useState<MealPlanTemplate[]>([]);
  const [loading, setLoading]               = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<MealPlanTemplate | null>(null);
  const [selectedDay, setSelectedDay]       = useState(0);
  const [expandedMeals, setExpandedMeals]   = useState<Set<string>>(new Set());
  const [filterCalories, setFilterCalories] = useState<number | null>(null);
  const [filterFocus, setFilterFocus]       = useState<string>('');
  const [showFilters, setShowFilters]       = useState(false);
  const [detailTab, setDetailTab]           = useState<DetailTab>('day');

  const [athletes, setAthletes]             = useState<AthleteProfile[]>([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyLoading, setApplyLoading]     = useState(false);
  const [applySuccess, setApplySuccess]     = useState(false);
  const [applyError, setApplyError]         = useState('');

  const [copiedItems, setCopiedItems]       = useState<Set<string>>(new Set());

  useEffect(() => { loadTemplates(); loadAthletes(); }, []);

  async function loadTemplates() {
    setLoading(true);
    const { data, error } = await supabase
      .from('meal_plan_templates')
      .select('*')
      .eq('is_active', true)
      .order('calories_target', { ascending: true });
    if (!error && data) setTemplates(data as MealPlanTemplate[]);
    setLoading(false);
  }

  async function loadAthletes() {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email, hub_user_id')
      .eq('role', 'athlete')
      .order('full_name');
    if (data) setAthletes(data as AthleteProfile[]);
  }

  const filtered = templates.filter(t => {
    if (filterCalories && t.calories_target !== filterCalories) return false;
    if (filterFocus && t.focus !== filterFocus) return false;
    return true;
  });

  function toggleMeal(key: string) {
    setExpandedMeals(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function expandAllMeals() {
    if (!selectedTemplate) return;
    const day = selectedTemplate.days[selectedDay];
    if (!day) return;
    const keys = day.meals.map((_, mi) => `${day.day_number}-${mi}`);
    setExpandedMeals(new Set(keys));
  }

  function collapseAllMeals() { setExpandedMeals(new Set()); }

  const allExpanded = useCallback(() => {
    if (!selectedTemplate) return false;
    const day = selectedTemplate.days[selectedDay];
    if (!day) return false;
    return day.meals.every((_, mi) => expandedMeals.has(`${day.day_number}-${mi}`));
  }, [selectedTemplate, selectedDay, expandedMeals]);

  async function applyToAthlete(athleteId: string) {
    if (!selectedTemplate) return;
    setApplyLoading(true);
    setApplyError('');

    const mealsObj: Record<string, Record<string, { foods: { name: string; quantity_g: number; calories: number; protein_g: number; carbs_g: number; fat_g: number }[] }>> = {};
    selectedTemplate.days.forEach((day, di) => {
      const dayKey = `day_${di + 1}`;
      mealsObj[dayKey] = {};
      day.meals.forEach(meal => {
        mealsObj[dayKey][meal.slot] = {
          foods: meal.foods.map(f => ({
            name: f.name_es,
            quantity_g: f.quantity_g,
            calories: f.calories,
            protein_g: f.protein_g,
            carbs_g: f.carbs_g,
            fat_g: f.fat_g,
          })),
        };
      });
    });

    const dailyTotals: Record<string, { calories: number; protein_g: number; carbs_g: number; fat_g: number }> = {};
    selectedTemplate.days.forEach((day, di) => {
      dailyTotals[`day_${di + 1}`] = {
        calories: day.total_calories,
        protein_g: day.total_protein_g,
        carbs_g: day.total_carbs_g,
        fat_g: day.total_fat_g,
      };
    });

    const { error } = await upsertMealPlan({
      user_id: athleteId,
      name: selectedTemplate.name_es,
      description: selectedTemplate.description_es,
      plan_type: selectedTemplate.focus as never,
      duration_days: selectedTemplate.days.length,
      meals: mealsObj as never,
      daily_totals: dailyTotals as never,
      is_template: false,
      is_active: true,
      tags: selectedTemplate.tags as never,
    });

    if (error) {
      setApplyError('Error al aplicar el template. Intenta nuevamente.');
    } else {
      setApplySuccess(true);
      setTimeout(() => { setShowApplyModal(false); setApplySuccess(false); }, 1800);
    }
    setApplyLoading(false);
  }

  function toggleShoppingCopied(name: string) {
    setCopiedItems(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }

  if (selectedTemplate) {
    const focusCfg = FOCUS_CONFIG[selectedTemplate.focus];
    const FocusIcon = focusCfg?.icon ?? Utensils;
    const weekStats = getWeeklyStats(selectedTemplate);
    const uniqueFoods = getUniqueFoods(selectedTemplate, language);
    const shoppingList = buildShoppingList(selectedTemplate);
    const day = selectedTemplate.days[selectedDay];
    const isAllExp = allExpanded();

    return (
      <div className="flex flex-col min-h-full bg-gray-50">
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#f3f4f6' }}>
                <div>
                  <h2 className="font-bold text-base" style={{ color: '#1f2937' }}>{es ? 'Aplicar a Atleta' : 'Apply to Athlete'}</h2>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{es ? selectedTemplate.name_es : selectedTemplate.name_en}</p>
                </div>
                <button onClick={() => { setShowApplyModal(false); setApplySuccess(false); setApplyError(''); }}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4" style={{ color: '#6b7280' }} />
                </button>
              </div>
              <div className="p-5">
                {applySuccess ? (
                  <div className="flex flex-col items-center py-6 gap-3">
                    <CheckCircle className="w-12 h-12" style={{ color: '#059669' }} />
                    <p className="font-semibold text-sm" style={{ color: '#059669' }}>{es ? 'Plan aplicado exitosamente' : 'Plan applied!'}</p>
                  </div>
                ) : (
                  <>
                    {applyError && (
                      <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ backgroundColor: '#fee2e2' }}>
                        <AlertCircle className="w-4 h-4" style={{ color: '#dc2626' }} />
                        <span className="text-xs" style={{ color: '#dc2626' }}>{applyError}</span>
                      </div>
                    )}
                    {athletes.length === 0 ? (
                      <p className="text-sm text-center py-4" style={{ color: '#6b7280' }}>{es ? 'No hay atletas disponibles' : 'No athletes available'}</p>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto">
                        {athletes.map(a => (
                          <button
                            key={a.id}
                            onClick={() => applyToAthlete(a.id)}
                            disabled={applyLoading}
                            className="w-full flex items-center gap-3 p-3 rounded-xl border text-left hover:border-gray-300 transition-all disabled:opacity-50"
                            style={{ borderColor: '#e5e7eb' }}
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                              style={{ backgroundColor: '#514163' }}>
                              {(a.full_name || a.email || '?')[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold truncate" style={{ color: '#1f2937' }}>{a.full_name || a.email}</div>
                              {a.full_name && <div className="text-xs truncate" style={{ color: '#9ca3af' }}>{a.email}</div>}
                            </div>
                            {applyLoading
                              ? <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" style={{ color: '#9ca3af' }} />
                              : <ChevronDown className="w-4 h-4 flex-shrink-0 rotate-[-90deg]" style={{ color: '#9ca3af' }} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="sticky top-0 z-20 bg-white border-b" style={{ borderColor: '#e5e7eb' }}>
          <div className="px-4 lg:px-8 py-4 flex items-center gap-3">
            <button
              onClick={() => { setSelectedTemplate(null); setSelectedDay(0); setExpandedMeals(new Set()); setDetailTab('day'); }}
              className="p-2 rounded-xl border hover:bg-gray-50 transition-all"
              style={{ borderColor: '#e5e7eb' }}>
              <ArrowLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg truncate" style={{ color: '#1f2937' }}>{es ? selectedTemplate.name_es : selectedTemplate.name_en}</h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => { setShowApplyModal(true); setApplyError(''); setApplySuccess(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
                style={{ borderColor: '#514163', color: '#514163', backgroundColor: '#fff' }}>
                <Users className="w-3.5 h-3.5" />
                {es ? 'Aplicar' : 'Apply'}
              </button>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: focusCfg?.bg ?? '#f3f4f6', color: focusCfg?.color ?? '#374151' }}>
                <FocusIcon className="w-3 h-3" />
                {selectedTemplate.calories_target.toLocaleString()} kcal
              </div>
            </div>
          </div>

          {(es ? selectedTemplate.description_es : selectedTemplate.description_en) && (
            <div className="px-4 lg:px-8 pb-3">
              <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{es ? selectedTemplate.description_es : selectedTemplate.description_en}</p>
            </div>
          )}

          {(selectedTemplate.tags?.length > 0 || selectedTemplate.suitable_for?.length > 0) && (
            <div className="px-4 lg:px-8 pb-3 flex flex-wrap gap-1.5">
              {selectedTemplate.suitable_for?.map(s => (
                <span key={s} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                  <Users className="w-2.5 h-2.5" />{s}
                </span>
              ))}
              {selectedTemplate.tags?.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>
                  <Tag className="w-2.5 h-2.5" />{tag}
                </span>
              ))}
            </div>
          )}

          {weekStats && (
            <div className="px-4 lg:px-8 pb-3">
              <div className="rounded-xl p-3 flex flex-wrap gap-x-5 gap-y-1.5" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: '#514163' }} />
                  <span className="text-xs font-bold" style={{ color: '#1f2937' }}>{weekStats.avgCal.toLocaleString()} kcal</span>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>{es ? 'prom/día' : 'avg/day'}</span>
                </div>
                {[
                  { label: 'P', value: weekStats.avgP, color: '#ef4444' },
                  { label: 'C', value: weekStats.avgC, color: '#f59e0b' },
                  { label: 'G', value: weekStats.avgF, color: '#3b82f6' },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="text-xs font-semibold" style={{ color: '#374151' }}>{m.value}g</span>
                    <span className="text-xs" style={{ color: '#9ca3af' }}>{m.label}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3" style={{ color: '#9ca3af' }} />
                  <span className="text-xs" style={{ color: '#6b7280' }}>{uniqueFoods.length} {es ? 'alimentos distintos' : 'unique foods'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Utensils className="w-3 h-3" style={{ color: '#9ca3af' }} />
                  <span className="text-xs" style={{ color: '#6b7280' }}>{weekStats.totalMeals} {es ? 'comidas/semana' : 'meals/week'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 lg:px-8 pb-3">
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {([
                { id: 'day' as DetailTab, label: es ? 'Día' : 'Day', icon: Calendar },
                { id: 'week' as DetailTab, label: es ? 'Semana' : 'Week', icon: BarChart2 },
                { id: 'macros' as DetailTab, label: 'Macros', icon: TrendingUp },
                { id: 'shopping' as DetailTab, label: es ? 'Compras' : 'Shopping', icon: ShoppingCart },
              ] as { id: DetailTab; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDetailTab(tab.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all"
                    style={detailTab === tab.id
                      ? { backgroundColor: '#514163', color: '#fdda36' }
                      : { color: '#6b7280' }}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 lg:px-8 py-6 max-w-5xl mx-auto w-full">

          {detailTab === 'day' && day && (
            <>
              <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5" style={{ scrollbarWidth: 'none' }}>
                {selectedTemplate.days.map((d, i) => (
                  <button
                    key={d.day_number}
                    onClick={() => { setSelectedDay(i); setExpandedMeals(new Set()); }}
                    className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={selectedDay === i
                      ? { backgroundColor: '#514163', color: '#fdda36' }
                      : { backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                    {es ? d.day_name.split(' / ')[0] : (d.day_name.split(' / ')[1] ?? d.day_name.split(' / ')[0])}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl p-4 mb-5 flex items-center justify-between" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div>
                  <div className="text-sm font-bold" style={{ color: '#1f2937' }}>{es ? day.day_name.split(' / ')[0] : (day.day_name.split(' / ')[1] ?? day.day_name.split(' / ')[0])}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{day.meals.length} {es ? 'comidas' : 'meals'}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xl font-bold" style={{ color: '#059669' }}>{day.total_calories.toLocaleString()}</div>
                    <div className="text-xs" style={{ color: '#6b7280' }}>{es ? 'kcal totales' : 'total kcal'}</div>
                  </div>
                  <button
                    onClick={isAllExp ? collapseAllMeals : expandAllMeals}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                    style={{ borderColor: '#bbf7d0', color: '#059669', backgroundColor: '#fff' }}>
                    {isAllExp
                      ? <><ChevronsDownUp className="w-3.5 h-3.5" />{es ? 'Colapsar' : 'Collapse'}</>
                      : <><ChevronsUpDown className="w-3.5 h-3.5" />{es ? 'Expandir' : 'Expand'}</>}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { labelEs: 'Proteína', labelEn: 'Protein', value: `${day.total_protein_g}g`, color: '#ef4444', bg: '#fee2e2' },
                  { labelEs: 'Carbos',   labelEn: 'Carbs',   value: `${day.total_carbs_g}g`,   color: '#d97706', bg: '#fef3c7' },
                  { labelEs: 'Grasa',    labelEn: 'Fat',     value: `${day.total_fat_g}g`,     color: '#2563eb', bg: '#dbeafe' },
                ].map(m => (
                  <div key={m.labelEs} className="rounded-xl p-3 text-center" style={{ backgroundColor: m.bg }}>
                    <div className="text-lg font-bold" style={{ color: m.color }}>{m.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{es ? m.labelEs : m.labelEn}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {day.meals.map((meal, mi) => {
                  const key = `${day.day_number}-${mi}`;
                  const expanded = expandedMeals.has(key);
                  const slotLabel = SLOT_LABELS[meal.slot] ?? meal.slot;
                  return (
                    <div key={key} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
                      <button
                        onClick={() => toggleMeal(key)}
                        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f3f4f6' }}>
                          <Utensils className="w-4 h-4" style={{ color: '#514163' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold mb-0.5" style={{ color: '#9ca3af' }}>{slotLabel}</div>
                          <div className="text-sm font-bold truncate" style={{ color: '#1f2937' }}>{es ? meal.name_es : meal.name_en}</div>
                        </div>
                        <div className="text-right flex-shrink-0 mr-1">
                          <div className="text-sm font-bold" style={{ color: '#1f2937' }}>{meal.calories} kcal</div>
                          <div className="text-xs" style={{ color: '#9ca3af' }}>P:{meal.protein_g}g C:{meal.carbs_g}g G:{meal.fat_g}g</div>
                        </div>
                        {expanded
                          ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: '#9ca3af' }} />
                          : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#9ca3af' }} />}
                      </button>
                      {expanded && (
                        <div className="px-4 pb-4 border-t" style={{ borderColor: '#f3f4f6' }}>
                          {(meal.notes_es || meal.notes_en) && (
                            <div className="mt-3 mb-3 flex items-start gap-2 p-3 rounded-xl" style={{ backgroundColor: '#fffbeb' }}>
                              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#d97706' }} />
                              <span className="text-xs" style={{ color: '#92400e' }}>{es ? (meal.notes_es || meal.notes_en) : (meal.notes_en || meal.notes_es)}</span>
                            </div>
                          )}
                          <div className="mt-3 space-y-2">
                            {meal.foods.map((food, fi) => (
                              <div key={fi} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: '#f9fafb' }}>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium" style={{ color: '#374151' }}>{es ? food.name_es : food.name_en}</div>
                                  <div className="text-xs" style={{ color: '#9ca3af' }}>{food.quantity_g}g</div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-3">
                                  <div className="text-sm font-bold" style={{ color: '#1f2937' }}>{food.calories} kcal</div>
                                  <div className="text-xs" style={{ color: '#9ca3af' }}>P:{food.protein_g} C:{food.carbs_g} G:{food.fat_g}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {detailTab === 'week' && (
            <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm" style={{ borderColor: '#e5e7eb' }}>
              <table className="w-full text-xs min-w-[640px]">
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th className="text-left px-4 py-3 font-semibold" style={{ color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                      {es ? 'Comida' : 'Meal'}
                    </th>
                    {selectedTemplate.days.map((d, i) => (
                      <th key={i} className="text-center px-3 py-3 font-semibold" style={{ color: '#374151', borderBottom: '1px solid #e5e7eb', minWidth: 90 }}>
                        <div style={{ color: DAY_COLORS[i % DAY_COLORS.length] }}>{es ? d.day_name.split(' / ')[0] : (d.day_name.split(' / ')[1] ?? d.day_name.split(' / ')[0])}</div>
                        <div className="font-normal text-xs mt-0.5" style={{ color: '#9ca3af' }}>{d.total_calories} kcal</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from(new Set(
                    selectedTemplate.days.flatMap(d => d.meals.map(m => m.slot))
                  )).map((slot, si) => (
                    <tr key={slot} style={{ backgroundColor: si % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: '#514163', borderBottom: '1px solid #f3f4f6' }}>
                        {SLOT_LABELS[slot] ?? slot}
                      </td>
                      {selectedTemplate.days.map((d, di) => {
                        const meal = d.meals.find(m => m.slot === slot);
                        return (
                          <td key={di} className="px-3 py-3 text-center" style={{ borderBottom: '1px solid #f3f4f6' }}>
                            {meal ? (
                              <div>
                                <div className="font-medium leading-tight" style={{ color: '#1f2937' }}>{es ? meal.name_es : meal.name_en}</div>
                                <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{meal.calories} kcal</div>
                                <MacroBar protein={meal.protein_g} carbs={meal.carbs_g} fat={meal.fat_g} height="h-1.5" />
                              </div>
                            ) : (
                              <span style={{ color: '#d1d5db' }}>—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: '#f0fdf4' }}>
                    <td className="px-4 py-3 font-bold text-xs" style={{ color: '#059669' }}>
                      Total kcal
                    </td>
                    {selectedTemplate.days.map((d, di) => (
                      <td key={di} className="px-3 py-3 text-center font-bold" style={{ color: '#059669' }}>
                        {d.total_calories.toLocaleString()}
                        <div className="font-normal text-xs mt-0.5" style={{ color: '#6b7280' }}>
                          P:{d.total_protein_g} C:{d.total_carbs_g} G:{d.total_fat_g}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {detailTab === 'macros' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: '#1f2937' }}>{es ? 'Calorías por Día' : 'Calories per Day'}</h3>
                <div className="space-y-3">
                  {selectedTemplate.days.map((d, i) => {
                    const maxCal = Math.max(...selectedTemplate.days.map(x => x.total_calories));
                    const pct = maxCal > 0 ? (d.total_calories / maxCal) * 100 : 0;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold" style={{ color: '#374151' }}>{es ? d.day_name.split(' / ')[0] : (d.day_name.split(' / ')[1] ?? d.day_name.split(' / ')[0])}</span>
                          <span className="text-xs font-bold" style={{ color: DAY_COLORS[i % DAY_COLORS.length] }}>{d.total_calories.toLocaleString()} kcal</span>
                        </div>
                        <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: DAY_COLORS[i % DAY_COLORS.length] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: '#1f2937' }}>{es ? 'Distribución de Macros' : 'Macro Distribution'}</h3>
                <div className="space-y-4">
                  {selectedTemplate.days.map((d, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold" style={{ color: '#374151' }}>{es ? d.day_name.split(' / ')[0] : (d.day_name.split(' / ')[1] ?? d.day_name.split(' / ')[0])}</span>
                        <div className="flex gap-3 text-xs">
                          <span style={{ color: '#ef4444' }}>P {d.total_protein_g}g</span>
                          <span style={{ color: '#f59e0b' }}>C {d.total_carbs_g}g</span>
                          <span style={{ color: '#3b82f6' }}>G {d.total_fat_g}g</span>
                        </div>
                      </div>
                      <MacroBar protein={d.total_protein_g} carbs={d.total_carbs_g} fat={d.total_fat_g} height="h-4" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t" style={{ borderColor: '#f3f4f6' }}>
                  {[
                    { labelEs: 'Proteína', labelEn: 'Protein', color: '#ef4444' },
                    { labelEs: 'Carbos',   labelEn: 'Carbs',   color: '#f59e0b' },
                    { labelEs: 'Grasa',    labelEn: 'Fat',     color: '#3b82f6' },
                  ].map(l => (
                    <div key={l.labelEs} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
                      <span className="text-xs" style={{ color: '#6b7280' }}>{es ? l.labelEs : l.labelEn}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: '#1f2937' }}>{es ? 'Variedad de Alimentos' : 'Food Variety'}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl font-bold" style={{ color: '#514163' }}>{uniqueFoods.length}</div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#1f2937' }}>{es ? 'alimentos distintos' : 'unique foods'}</div>
                    <div className="text-xs" style={{ color: '#6b7280' }}>{es ? 'a lo largo de la semana' : 'across the week'}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {uniqueFoods.slice(0, 60).map(f => (
                    <span key={f} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{f}</span>
                  ))}
                  {uniqueFoods.length > 60 && (
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#f3f4f6', color: '#9ca3af' }}>+{uniqueFoods.length - 60} {es ? 'más' : 'more'}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {detailTab === 'shopping' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: '#1f2937' }}>{es ? 'Lista de Compras Semanal' : 'Weekly Shopping List'}</h3>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                    {shoppingList.length} {es ? 'ingredientes · cantidades totales para la semana' : 'ingredients · total quantities for the week'}
                  </p>
                </div>
                <button
                  onClick={() => setCopiedItems(new Set())}
                  className="text-xs px-3 py-1.5 rounded-lg border transition-all"
                  style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
                  {es ? 'Limpiar ticks' : 'Clear ticks'}
                </button>
              </div>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
                {shoppingList.map((item, i) => {
                  const checked = copiedItems.has(item.name_es);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleShoppingCopied(item.name_es)}
                      className="w-full flex items-center gap-3 px-4 py-3 border-b last:border-0 text-left hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#f3f4f6' }}>
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                        style={checked
                          ? { backgroundColor: '#059669', borderColor: '#059669' }
                          : { borderColor: '#d1d5db' }}>
                        {checked && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ color: checked ? '#9ca3af' : '#1f2937', textDecoration: checked ? 'line-through' : 'none' }}>
                          {es ? item.name_es : item.name_en}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold" style={{ color: '#374151' }}>{item.total_g.toLocaleString()}g</div>
                        <div className="text-xs" style={{ color: '#9ca3af' }}>{item.times_used}x {es ? 'en semana' : 'this week'}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <div className="sticky top-0 z-20 bg-white border-b" style={{ borderColor: '#e5e7eb' }}>
        <div className="px-4 lg:px-8 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border hover:bg-gray-50 transition-all"
            style={{ borderColor: '#e5e7eb' }}>
            <ArrowLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-xl" style={{ color: '#1f2937' }}>{es ? 'Templates de Alimentación' : 'Meal Plan Templates'}</h1>
            <p className="text-sm" style={{ color: '#6b7280' }}>{es ? 'Planes semanales de ejemplo' : 'Weekly example plans'} · 1800–5000 kcal</p>
          </div>
          {canCreate && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ backgroundColor: '#514163', color: '#fdda36', border: '1px solid #514163' }}
            >
              <Plus className="w-4 h-4" />
              {es ? 'Nuevo Template' : 'New Template'}
            </button>
          )}
          <button
            onClick={() => setShowFilters(f => !f)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all"
            style={
              showFilters || filterCalories !== null || filterFocus
                ? { backgroundColor: '#514163', color: '#fdda36', borderColor: '#514163' }
                : { borderColor: '#e5e7eb', color: '#6b7280' }
            }>
            <Filter className="w-4 h-4" />
            {es ? 'Filtrar' : 'Filter'}
          </button>
        </div>

        {showFilters && (
          <div className="px-4 lg:px-8 pb-4 flex flex-wrap gap-3 border-t pt-3" style={{ borderColor: '#f3f4f6' }}>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold" style={{ color: '#6b7280' }}>{es ? 'Calorías' : 'Calories'}</span>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => setFilterCalories(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={filterCalories === null ? { backgroundColor: '#514163', color: '#fdda36' } : { backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                  {es ? 'Todas' : 'All'}
                </button>
                {CALORIE_OPTIONS.map(c => (
                  <button
                    key={c}
                    onClick={() => setFilterCalories(filterCalories === c ? null : c)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={filterCalories === c ? { backgroundColor: '#514163', color: '#fdda36' } : { backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold" style={{ color: '#6b7280' }}>{es ? 'Enfoque' : 'Focus'}</span>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => setFilterFocus('')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={filterFocus === '' ? { backgroundColor: '#514163', color: '#fdda36' } : { backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                  {es ? 'Todos' : 'All'}
                </button>
                {Object.entries(FOCUS_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setFilterFocus(filterFocus === key ? '' : key)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={filterFocus === key
                      ? { backgroundColor: cfg.color, color: '#fff' }
                      : { backgroundColor: cfg.bg, color: cfg.color }}>
                    {es ? cfg.labelEs : cfg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 px-4 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#514163', borderTopColor: 'transparent' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: '#d1d5db' }} />
            <p className="font-semibold" style={{ color: '#6b7280' }}>{es ? 'Sin templates' : 'No templates found'}</p>
            <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>{es ? 'Intenta otro filtro' : 'Try another filter'}</p>
          </div>
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
              {filtered.length} template{filtered.length !== 1 ? 's' : ''} {es ? `disponible${filtered.length !== 1 ? 's' : ''}` : `available`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(t => {
                const focusCfg = FOCUS_CONFIG[t.focus];
                const FocusIcon = focusCfg?.icon ?? Utensils;
                const totalCalPercent = Math.round((t.protein_g * 4 / t.calories_target) * 100);
                const carbPercent    = Math.round((t.carbs_g * 4 / t.calories_target) * 100);
                const fatPercent     = 100 - totalCalPercent - carbPercent;
                const uniqueCount    = getUniqueFoods(t, language).length;
                const weekMeals      = t.days.reduce((acc, d) => acc + d.meals.length, 0);

                return (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedTemplate(t); setSelectedDay(0); setExpandedMeals(new Set()); setDetailTab('day'); }}
                    className="bg-white rounded-2xl p-5 text-left hover:shadow-md transition-all duration-200 group"
                    style={{ border: '1px solid #e5e7eb' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: focusCfg?.bg ?? '#f3f4f6' }}>
                        <FocusIcon className="w-5 h-5" style={{ color: focusCfg?.color ?? '#374151' }} />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: '#1f2937' }}>
                          {t.calories_target.toLocaleString()}
                        </div>
                        <div className="text-xs" style={{ color: '#9ca3af' }}>{es ? 'kcal / día' : 'kcal / day'}</div>
                      </div>
                    </div>

                    <div className="mb-1">
                      <div className="font-bold text-sm leading-tight" style={{ color: '#1f2937' }}>{es ? t.name_es : t.name_en}</div>
                    </div>

                    {(es ? t.description_es : t.description_en) && (
                      <p className="text-xs mt-1.5 leading-relaxed line-clamp-2" style={{ color: '#6b7280' }}>{es ? t.description_es : t.description_en}</p>
                    )}

                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-2 mb-3"
                      style={{ backgroundColor: focusCfg?.bg ?? '#f3f4f6', color: focusCfg?.color ?? '#374151' }}>
                      <FocusIcon className="w-3 h-3" />
                      {es ? (focusCfg?.labelEs ?? t.focus) : (focusCfg?.label ?? t.focus)}
                    </div>

                    {(t.suitable_for?.length > 0 || t.tags?.length > 0) && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {t.suitable_for?.slice(0, 2).map(s => (
                          <span key={s} className="text-xs px-1.5 py-0.5 rounded-md" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>{s}</span>
                        ))}
                        {t.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 rounded-md" style={{ backgroundColor: '#f8fafc', color: '#64748b' }}>{tag}</span>
                        ))}
                        {((t.suitable_for?.length ?? 0) + (t.tags?.length ?? 0)) > 4 && (
                          <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ backgroundColor: '#f3f4f6', color: '#9ca3af' }}>+{((t.suitable_for?.length ?? 0) + (t.tags?.length ?? 0)) - 4}</span>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <MacroBar protein={t.protein_g} carbs={t.carbs_g} fat={t.fat_g} />
                      <div className="flex justify-between text-xs">
                        <span style={{ color: '#ef4444' }}>P: {t.protein_g}g ({totalCalPercent}%)</span>
                        <span style={{ color: '#f59e0b' }}>C: {t.carbs_g}g ({carbPercent}%)</span>
                        <span style={{ color: '#3b82f6' }}>G: {t.fat_g}g ({fatPercent}%)</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: '#f3f4f6' }}>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
                        <span className="text-xs" style={{ color: '#6b7280' }}>
                          {t.days.length} {es ? 'días' : 'days'} · {weekMeals} {es ? 'comidas' : 'meals'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" style={{ color: '#9ca3af' }} />
                        <span className="text-xs" style={{ color: '#6b7280' }}>{uniqueCount} {es ? 'alimentos' : 'foods'}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {showCreateModal && (
        <CreateTemplateModal
          onClose={() => setShowCreateModal(false)}
          onSaved={() => { loadTemplates(); setShowCreateModal(false); }}
        />
      )}
    </div>
  );
}
