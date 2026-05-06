import { useState } from 'react';
import {
  X, Plus, Trash2, ChevronDown, ChevronUp, Save, Loader2,
  CheckCircle, AlertCircle, Copy
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePreferences } from '../../lib/preferences';

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

const SLOTS = [
  { value: 'wake_up',         labelEs: 'Despertar',        labelEn: 'Wake Up' },
  { value: 'breakfast',       labelEs: 'Desayuno',         labelEn: 'Breakfast' },
  { value: 'mid_morning',     labelEs: 'Media Mañana',     labelEn: 'Mid-Morning' },
  { value: 'lunch',           labelEs: 'Almuerzo',         labelEn: 'Lunch' },
  { value: 'pre_training',    labelEs: 'Pre-Entreno',      labelEn: 'Pre-Training' },
  { value: 'during_training', labelEs: 'Durante Entreno',  labelEn: 'During Training' },
  { value: 'post_training',   labelEs: 'Post-Entreno',     labelEn: 'Post-Training' },
  { value: 'afternoon_snack', labelEs: 'Merienda',         labelEn: 'Afternoon Snack' },
  { value: 'dinner',          labelEs: 'Cena',             labelEn: 'Dinner' },
  { value: 'evening_snack',   labelEs: 'Snack Nocturno',   labelEn: 'Evening Snack' },
  { value: 'pre_sleep',       labelEs: 'Pre-Sueño',        labelEn: 'Pre-Sleep' },
];

const FOCUS_OPTIONS = [
  { value: 'balanced',     labelEs: 'Balanceado',        labelEn: 'Balanced' },
  { value: 'high_carb',    labelEs: 'Alto en Carbos',    labelEn: 'High Carb' },
  { value: 'high_protein', labelEs: 'Alto en Proteína',  labelEn: 'High Protein' },
  { value: 'endurance',    labelEs: 'Resistencia',       labelEn: 'Endurance' },
  { value: 'strength',     labelEs: 'Fuerza',            labelEn: 'Strength' },
  { value: 'weight_loss',  labelEs: 'Pérdida de Peso',   labelEn: 'Weight Loss' },
  { value: 'recovery',     labelEs: 'Recuperación',      labelEn: 'Recovery' },
];

const DIETARY_OPTIONS = [
  { value: 'omnivore',    labelEs: 'Omnívoro',    labelEn: 'Omnivore' },
  { value: 'vegetarian',  labelEs: 'Vegetariano', labelEn: 'Vegetarian' },
  { value: 'vegan',       labelEs: 'Vegano',      labelEn: 'Vegan' },
];

const DAY_NAMES_ES = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const DAY_NAMES_EN = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

function emptyFood(): TemplateFood {
  return { name_es: '', name_en: '', quantity_g: 0, calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
}

function emptyMeal(): TemplateMeal {
  return {
    slot: 'breakfast',
    name_es: '', name_en: '',
    foods: [emptyFood()],
    calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0,
    notes_es: '', notes_en: '',
  };
}

function emptyDay(dayNumber: number, es: boolean): TemplateDay {
  return {
    day_number: dayNumber,
    day_name: es ? DAY_NAMES_ES[dayNumber - 1] : DAY_NAMES_EN[dayNumber - 1],
    meals: [emptyMeal()],
    total_calories: 0, total_protein_g: 0, total_carbs_g: 0, total_fat_g: 0,
  };
}

function recomputeDay(day: TemplateDay): TemplateDay {
  const meals = day.meals.map(m => {
    const cal = m.foods.reduce((s, f) => s + (f.calories || 0), 0);
    const p   = m.foods.reduce((s, f) => s + (f.protein_g || 0), 0);
    const c   = m.foods.reduce((s, f) => s + (f.carbs_g || 0), 0);
    const fat = m.foods.reduce((s, f) => s + (f.fat_g || 0), 0);
    return { ...m, calories: cal, protein_g: p, carbs_g: c, fat_g: fat };
  });
  return {
    ...day,
    meals,
    total_calories: meals.reduce((s, m) => s + m.calories, 0),
    total_protein_g: meals.reduce((s, m) => s + m.protein_g, 0),
    total_carbs_g: meals.reduce((s, m) => s + m.carbs_g, 0),
    total_fat_g: meals.reduce((s, m) => s + m.fat_g, 0),
  };
}

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function CreateTemplateModal({ onClose, onSaved }: Props) {
  const { language } = usePreferences();
  const es = language === 'es';

  const [step, setStep] = useState<'meta' | 'days'>('meta');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [nameEs, setNameEs] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descEs, setDescEs] = useState('');
  const [descEn, setDescEn] = useState('');
  const [caloriesTarget, setCaloriesTarget] = useState(2000);
  const [focus, setFocus] = useState('balanced');
  const [dietaryPattern, setDietaryPattern] = useState('omnivore');
  const [tags, setTags] = useState('');
  const [suitableFor, setSuitableFor] = useState('');
  const [numDays, setNumDays] = useState(7);

  const [days, setDays] = useState<TemplateDay[]>(() =>
    Array.from({ length: 7 }, (_, i) => emptyDay(i + 1, language === 'es'))
  );
  const [activeDay, setActiveDay] = useState(0);
  const [expandedMeals, setExpandedMeals] = useState<Set<string>>(new Set(['0-0']));

  function toggleMeal(key: string) {
    setExpandedMeals(prev => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key); else n.add(key);
      return n;
    });
  }

  function updateDay(dayIdx: number, updater: (d: TemplateDay) => TemplateDay) {
    setDays(prev => {
      const next = [...prev];
      next[dayIdx] = recomputeDay(updater(next[dayIdx]));
      return next;
    });
  }

  function addMeal(dayIdx: number) {
    updateDay(dayIdx, d => ({ ...d, meals: [...d.meals, emptyMeal()] }));
    const key = `${dayIdx}-${days[dayIdx].meals.length}`;
    setExpandedMeals(prev => new Set([...prev, key]));
  }

  function removeMeal(dayIdx: number, mealIdx: number) {
    updateDay(dayIdx, d => ({ ...d, meals: d.meals.filter((_, i) => i !== mealIdx) }));
  }

  function updateMeal(dayIdx: number, mealIdx: number, field: keyof TemplateMeal, value: string) {
    updateDay(dayIdx, d => {
      const meals = [...d.meals];
      meals[mealIdx] = { ...meals[mealIdx], [field]: value };
      return { ...d, meals };
    });
  }

  function addFood(dayIdx: number, mealIdx: number) {
    updateDay(dayIdx, d => {
      const meals = [...d.meals];
      meals[mealIdx] = { ...meals[mealIdx], foods: [...meals[mealIdx].foods, emptyFood()] };
      return { ...d, meals };
    });
  }

  function removeFood(dayIdx: number, mealIdx: number, foodIdx: number) {
    updateDay(dayIdx, d => {
      const meals = [...d.meals];
      meals[mealIdx] = { ...meals[mealIdx], foods: meals[mealIdx].foods.filter((_, i) => i !== foodIdx) };
      return { ...d, meals };
    });
  }

  function updateFood(dayIdx: number, mealIdx: number, foodIdx: number, field: keyof TemplateFood, value: string | number) {
    updateDay(dayIdx, d => {
      const meals = [...d.meals];
      const foods = [...meals[mealIdx].foods];
      foods[foodIdx] = { ...foods[foodIdx], [field]: typeof value === 'string' ? value : Number(value) };
      meals[mealIdx] = { ...meals[mealIdx], foods };
      return { ...d, meals };
    });
  }

  function copyDayToNext(dayIdx: number) {
    if (dayIdx >= days.length - 1) return;
    setDays(prev => {
      const next = [...prev];
      const src = prev[dayIdx];
      next[dayIdx + 1] = {
        ...src,
        day_number: dayIdx + 2,
        day_name: es ? DAY_NAMES_ES[dayIdx + 1] : DAY_NAMES_EN[dayIdx + 1],
      };
      return next;
    });
  }

  function handleNumDaysChange(n: number) {
    setNumDays(n);
    setDays(prev => {
      if (n > prev.length) {
        const extra = Array.from({ length: n - prev.length }, (_, i) =>
          emptyDay(prev.length + i + 1, es)
        );
        return [...prev, ...extra];
      }
      return prev.slice(0, n);
    });
    if (activeDay >= n) setActiveDay(n - 1);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    const totalDays = days.length;
    const avgP   = Math.round(days.reduce((s, d) => s + d.total_protein_g, 0) / totalDays);
    const avgC   = Math.round(days.reduce((s, d) => s + d.total_carbs_g, 0) / totalDays);
    const avgF   = Math.round(days.reduce((s, d) => s + d.total_fat_g, 0) / totalDays);
    const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean);
    const sfArr  = suitableFor.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      name: nameEs || nameEn,
      name_es: nameEs,
      name_en: nameEn,
      description_es: descEs,
      description_en: descEn,
      calories_target: caloriesTarget,
      focus,
      dietary_pattern: dietaryPattern,
      protein_g: avgP,
      carbs_g: avgC,
      fat_g: avgF,
      fiber_g: 0,
      days,
      tags: tagArr,
      suitable_for: sfArr,
      is_active: true,
    };

    const { error } = await supabase.from('meal_plan_templates').insert(payload);
    setSaving(false);
    if (error) {
      setSaveError(error.message);
    } else {
      setSaveSuccess(true);
      setTimeout(() => { onSaved(); onClose(); }, 1200);
    }
  }

  const currentDay = days[activeDay];
  const avgCal = days.length > 0
    ? Math.round(days.reduce((s, d) => s + d.total_calories, 0) / days.length)
    : 0;

  const inputCls = 'w-full px-3 py-2 rounded-lg text-sm outline-none transition-all border border-gray-200 bg-white text-gray-800 focus:border-blue-400 focus:ring-1 focus:ring-blue-100';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-heading text-lg font-bold text-gray-900">
              {es ? 'Crear Nuevo Template' : 'Create New Template'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {es ? 'Completa los datos generales y luego carga los días' : 'Fill in general info then build each day'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {step === 'days' && (
              <div className="text-xs font-mono px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                {es ? 'Prom.' : 'Avg.'} {avgCal} kcal
              </div>
            )}
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Step tabs */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
          <button
            onClick={() => setStep('meta')}
            className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${step === 'meta' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {es ? '1. Datos Generales' : '1. General Info'}
          </button>
          <button
            onClick={() => setStep('days')}
            className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${step === 'days' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {es ? '2. Días y Comidas' : '2. Days & Meals'}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── STEP 1: META ── */}
          {step === 'meta' && (
            <div className="p-6 space-y-5 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{es ? 'Nombre (Español)' : 'Name (Spanish)'}</label>
                  <input className={inputCls} value={nameEs} onChange={e => setNameEs(e.target.value)}
                    placeholder="Ej: Plan Alto en Proteína" />
                </div>
                <div>
                  <label className={labelCls}>{es ? 'Nombre (Inglés)' : 'Name (English)'}</label>
                  <input className={inputCls} value={nameEn} onChange={e => setNameEn(e.target.value)}
                    placeholder="E.g. High Protein Plan" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{es ? 'Descripción (ES)' : 'Description (ES)'}</label>
                  <textarea className={`${inputCls} resize-none`} rows={3} value={descEs}
                    onChange={e => setDescEs(e.target.value)}
                    placeholder={es ? 'Descripción en español...' : 'Spanish description...'} />
                </div>
                <div>
                  <label className={labelCls}>{es ? 'Descripción (EN)' : 'Description (EN)'}</label>
                  <textarea className={`${inputCls} resize-none`} rows={3} value={descEn}
                    onChange={e => setDescEn(e.target.value)}
                    placeholder={es ? 'Descripción en inglés...' : 'English description...'} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>{es ? 'Calorías Objetivo' : 'Target Calories'}</label>
                  <input type="number" className={inputCls} value={caloriesTarget}
                    onChange={e => setCaloriesTarget(Number(e.target.value))} min={1000} max={8000} step={50} />
                </div>
                <div>
                  <label className={labelCls}>{es ? 'Foco' : 'Focus'}</label>
                  <select className={inputCls} value={focus} onChange={e => setFocus(e.target.value)}>
                    {FOCUS_OPTIONS.map(f => (
                      <option key={f.value} value={f.value}>{es ? f.labelEs : f.labelEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{es ? 'Patrón Alimentario' : 'Dietary Pattern'}</label>
                  <select className={inputCls} value={dietaryPattern} onChange={e => setDietaryPattern(e.target.value)}>
                    {DIETARY_OPTIONS.map(d => (
                      <option key={d.value} value={d.value}>{es ? d.labelEs : d.labelEn}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{es ? 'Tags (separados por coma)' : 'Tags (comma separated)'}</label>
                  <input className={inputCls} value={tags} onChange={e => setTags(e.target.value)}
                    placeholder={es ? 'atleta, fuerza, hipertrofia' : 'athlete, strength, hypertrophy'} />
                </div>
                <div>
                  <label className={labelCls}>{es ? 'Apto para (separados por coma)' : 'Suitable for (comma separated)'}</label>
                  <input className={inputCls} value={suitableFor} onChange={e => setSuitableFor(e.target.value)}
                    placeholder={es ? 'corredor, triatleta' : 'runner, triathlete'} />
                </div>
              </div>

              <div>
                <label className={labelCls}>{es ? 'Cantidad de días' : 'Number of days'}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 5, 7].map(n => (
                    <button
                      key={n}
                      onClick={() => handleNumDaysChange(n)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${numDays === n ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {n} {es ? (n === 1 ? 'día' : 'días') : (n === 1 ? 'day' : 'days')}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep('days')}
                disabled={!nameEs && !nameEn}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-40"
              >
                {es ? 'Siguiente: Cargar días →' : 'Next: Build days →'}
              </button>
            </div>
          )}

          {/* ── STEP 2: DAYS ── */}
          {step === 'days' && (
            <div className="flex h-full min-h-0">

              {/* Day sidebar */}
              <div className="w-40 border-r border-gray-100 flex-shrink-0 overflow-y-auto py-3">
                {days.map((day, di) => (
                  <button
                    key={di}
                    onClick={() => setActiveDay(di)}
                    className={`w-full text-left px-3 py-2.5 transition-all ${activeDay === di ? 'bg-blue-50 border-r-2 border-blue-500' : 'hover:bg-gray-50'}`}
                  >
                    <p className={`text-xs font-bold ${activeDay === di ? 'text-blue-700' : 'text-gray-700'}`}>
                      {es ? 'Día' : 'Day'} {di + 1}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{day.day_name}</p>
                    {day.total_calories > 0 && (
                      <p className="text-xs font-mono text-gray-500 mt-0.5">{Math.round(day.total_calories)} kcal</p>
                    )}
                  </button>
                ))}
              </div>

              {/* Day editor */}
              <div className="flex-1 overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {es ? 'Día' : 'Day'} {activeDay + 1} — {currentDay?.day_name}
                    </h3>
                    {currentDay && currentDay.total_calories > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {Math.round(currentDay.total_calories)} kcal · {Math.round(currentDay.total_protein_g)}g P · {Math.round(currentDay.total_carbs_g)}g C · {Math.round(currentDay.total_fat_g)}g F
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {activeDay < days.length - 1 && (
                      <button
                        onClick={() => copyDayToNext(activeDay)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {es ? 'Copiar al siguiente' : 'Copy to next'}
                      </button>
                    )}
                    <button
                      onClick={() => addMeal(activeDay)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {es ? 'Agregar comida' : 'Add meal'}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentDay?.meals.map((meal, mi) => {
                    const key = `${activeDay}-${mi}`;
                    const open = expandedMeals.has(key);
                    return (
                      <div key={mi} className="border border-gray-200 rounded-xl overflow-hidden">
                        {/* Meal header */}
                        <div
                          className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => toggleMeal(key)}
                        >
                          <select
                            value={meal.slot}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateMeal(activeDay, mi, 'slot', e.target.value)}
                            className="text-xs font-semibold bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 outline-none"
                          >
                            {SLOTS.map(s => (
                              <option key={s.value} value={s.value}>{es ? s.labelEs : s.labelEn}</option>
                            ))}
                          </select>
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <input
                              value={meal.name_es}
                              onClick={e => e.stopPropagation()}
                              onChange={e => updateMeal(activeDay, mi, 'name_es', e.target.value)}
                              placeholder={es ? 'Nombre (ES)' : 'Name (ES)'}
                              className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white outline-none focus:border-blue-400"
                            />
                            <input
                              value={meal.name_en}
                              onClick={e => e.stopPropagation()}
                              onChange={e => updateMeal(activeDay, mi, 'name_en', e.target.value)}
                              placeholder={es ? 'Nombre (EN)' : 'Name (EN)'}
                              className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white outline-none focus:border-blue-400"
                            />
                          </div>
                          {meal.calories > 0 && (
                            <span className="text-xs font-mono text-gray-500 flex-shrink-0">{Math.round(meal.calories)} kcal</span>
                          )}
                          <button
                            onClick={e => { e.stopPropagation(); removeMeal(activeDay, mi); }}
                            className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                        </div>

                        {/* Meal body */}
                        {open && (
                          <div className="p-4 space-y-3">
                            {/* Notes */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className={labelCls}>{es ? 'Notas (ES)' : 'Notes (ES)'}</label>
                                <input
                                  value={meal.notes_es}
                                  onChange={e => updateMeal(activeDay, mi, 'notes_es', e.target.value)}
                                  className={inputCls}
                                  placeholder={es ? 'Preparación, tips...' : 'Prep, tips...'}
                                />
                              </div>
                              <div>
                                <label className={labelCls}>{es ? 'Notas (EN)' : 'Notes (EN)'}</label>
                                <input
                                  value={meal.notes_en}
                                  onChange={e => updateMeal(activeDay, mi, 'notes_en', e.target.value)}
                                  className={inputCls}
                                  placeholder={es ? 'Notas en inglés...' : 'English notes...'}
                                />
                              </div>
                            </div>

                            {/* Foods table */}
                            <div>
                              <div className="grid grid-cols-[1fr_1fr_72px_72px_72px_72px_72px_32px] gap-1.5 mb-1.5 px-1">
                                {['Nombre ES','Nombre EN','g','kcal','P(g)','C(g)','F(g)',''].map((h, i) => (
                                  <span key={i} className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</span>
                                ))}
                              </div>
                              <div className="space-y-1.5">
                                {meal.foods.map((food, fi) => (
                                  <div key={fi} className="grid grid-cols-[1fr_1fr_72px_72px_72px_72px_72px_32px] gap-1.5 items-center">
                                    <input
                                      value={food.name_es}
                                      onChange={e => updateFood(activeDay, mi, fi, 'name_es', e.target.value)}
                                      className="px-2 py-1.5 rounded-lg text-xs border border-gray-200 outline-none focus:border-blue-400"
                                      placeholder="Avena..."
                                    />
                                    <input
                                      value={food.name_en}
                                      onChange={e => updateFood(activeDay, mi, fi, 'name_en', e.target.value)}
                                      className="px-2 py-1.5 rounded-lg text-xs border border-gray-200 outline-none focus:border-blue-400"
                                      placeholder="Oats..."
                                    />
                                    {(['quantity_g','calories','protein_g','carbs_g','fat_g'] as const).map(field => (
                                      <input
                                        key={field}
                                        type="number"
                                        value={food[field] || ''}
                                        onChange={e => updateFood(activeDay, mi, fi, field, e.target.value)}
                                        className="px-2 py-1.5 rounded-lg text-xs border border-gray-200 outline-none focus:border-blue-400 text-center"
                                        min={0}
                                        step={field === 'quantity_g' ? 5 : 1}
                                      />
                                    ))}
                                    <button
                                      onClick={() => removeFood(activeDay, mi, fi)}
                                      className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <button
                                onClick={() => addFood(activeDay, mi)}
                                className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                {es ? 'Agregar alimento' : 'Add food'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            {saveError && (
              <div className="flex items-center gap-1.5 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                <CheckCircle className="w-4 h-4" />
                {es ? 'Template guardado!' : 'Template saved!'}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors">
              {es ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || (!nameEs && !nameEn)}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-40"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {es ? 'Guardar Template' : 'Save Template'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
