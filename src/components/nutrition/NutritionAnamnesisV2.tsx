import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, Loader2, Check, User, Dumbbell, Utensils, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';
import { supabase } from '../../lib/supabase';
import { calculateBMR, calculateTDEE } from '../../utils/nutritionCalculations';

interface Props {
  onBack: () => void;
  lang?: string;
}

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_MACROS: Record<string, { protein: number; carbs: number; fat: number }> = {
  muscle_gain: { protein: 2.2, carbs: 6, fat: 1 },
  fat_loss: { protein: 2.4, carbs: 3, fat: 0.8 },
  performance: { protein: 2.0, carbs: 6, fat: 1 },
  recovery: { protein: 1.8, carbs: 5, fat: 1.2 },
  maintain: { protein: 2.0, carbs: 4, fat: 1 },
};

const SECTIONS = [
  { id: 'health', label: 'Salud Básica', labelEn: 'Basic Health', icon: User },
  { id: 'training', label: 'Entrenamiento', labelEn: 'Training', icon: Dumbbell },
  { id: 'habits', label: 'Hábitos Nutricionales', labelEn: 'Nutritional Habits', icon: Utensils },
  { id: 'goals', label: 'Objetivos', labelEn: 'Goals', icon: Target },
];

type FormData = {
  age: string; sex: string; height_cm: string; weight_kg: string; occupation: string;
  activity_level: string; work_hours: string; medical_conditions: string;
  medications_supplements: string; allergies_intolerances: string; sleep_hours: string;
  sleep_quality: string; energy_levels: string; stress_level: string;
  sport: string; training_frequency: string; training_hours_weekly: string;
  training_time: string; pre_workout_nutrition: string; during_workout_nutrition: string;
  post_workout_nutrition: string; eating_pattern: string; dietary_preferences: string;
  dietary_restrictions: string; breakfast_description: string; lunch_description: string;
  dinner_description: string; snacks_description: string; beverages_description: string;
  food_likes: string; food_dislikes: string; cooking_frequency: string;
  eating_out_frequency: string; appetite_changes: string; relationship_with_food: string;
  main_goal: string; nutrition_goals: string; performance_expectations: string;
  upcoming_events: string; additional_notes: string;
};

const EMPTY_FORM: FormData = {
  age: '', sex: '', height_cm: '', weight_kg: '', occupation: '', activity_level: 'moderate',
  work_hours: '', medical_conditions: '', medications_supplements: '', allergies_intolerances: '',
  sleep_hours: '', sleep_quality: 'good', energy_levels: 'moderate', stress_level: 'moderate',
  sport: '', training_frequency: '', training_hours_weekly: '', training_time: '',
  pre_workout_nutrition: '', during_workout_nutrition: '', post_workout_nutrition: '',
  eating_pattern: '', dietary_preferences: '', dietary_restrictions: '',
  breakfast_description: '', lunch_description: '', dinner_description: '',
  snacks_description: '', beverages_description: '', food_likes: '', food_dislikes: '',
  cooking_frequency: '', eating_out_frequency: '', appetite_changes: '', relationship_with_food: '',
  main_goal: 'performance', nutrition_goals: '', performance_expectations: '',
  upcoming_events: '', additional_notes: '',
};

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-brand"
    />
  );
}

function NumberInput({ value, onChange, placeholder, min, max }: { value: string; onChange: (v: string) => void; placeholder?: string; min?: number; max?: number }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      className="input-brand"
    />
  );
}

function TextareaInput({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="input-brand resize-none"
    />
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="input-brand">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export default function NutritionAnamnesisV2({ onBack, lang }: Props) {
  const { profile } = useAuth();
  const { language } = usePreferences();
  const es = (lang ?? language) === 'es';

  const [section, setSection] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  const t = (esStr: string, en: string) => es ? esStr : en;

  useEffect(() => {
    if (!profile?.id || profile.id.startsWith('demo-')) { setLoading(false); return; }
    supabase
      .from('nutrition_anamnesis_v2')
      .select('*')
      .eq('athlete_id', profile.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setExistingId(data.id);
          setForm({
            age: data.age?.toString() || '',
            sex: data.sex || '',
            height_cm: data.height_cm?.toString() || '',
            weight_kg: data.weight_kg?.toString() || '',
            occupation: data.occupation || '',
            activity_level: data.activity_level || 'moderate',
            work_hours: data.work_hours?.toString() || '',
            medical_conditions: data.medical_conditions || '',
            medications_supplements: data.medications_supplements || '',
            allergies_intolerances: data.allergies_intolerances || '',
            sleep_hours: data.sleep_hours?.toString() || '',
            sleep_quality: data.sleep_quality || 'good',
            energy_levels: data.energy_levels || 'moderate',
            stress_level: data.stress_level || 'moderate',
            sport: data.sport || '',
            training_frequency: data.training_frequency || '',
            training_hours_weekly: data.training_hours_weekly?.toString() || '',
            training_time: data.training_time || '',
            pre_workout_nutrition: data.pre_workout_nutrition || '',
            during_workout_nutrition: data.during_workout_nutrition || '',
            post_workout_nutrition: data.post_workout_nutrition || '',
            eating_pattern: data.eating_pattern || '',
            dietary_preferences: data.dietary_preferences || '',
            dietary_restrictions: data.dietary_restrictions || '',
            breakfast_description: data.breakfast_description || '',
            lunch_description: data.lunch_description || '',
            dinner_description: data.dinner_description || '',
            snacks_description: data.snacks_description || '',
            beverages_description: data.beverages_description || '',
            food_likes: data.food_likes || '',
            food_dislikes: data.food_dislikes || '',
            cooking_frequency: data.cooking_frequency || '',
            eating_out_frequency: data.eating_out_frequency || '',
            appetite_changes: data.appetite_changes || '',
            relationship_with_food: data.relationship_with_food || '',
            main_goal: data.main_goal || 'performance',
            nutrition_goals: data.nutrition_goals || '',
            performance_expectations: data.performance_expectations || '',
            upcoming_events: data.upcoming_events || '',
            additional_notes: data.additional_notes || '',
          });
        }
        setLoading(false);
      });
  }, [profile?.id]);

  const f = (key: keyof FormData) => form[key];
  const set = (key: keyof FormData) => (val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const calcResults = () => {
    const age = parseInt(f('age') as string);
    const weight = parseFloat(f('weight_kg') as string);
    const height = parseFloat(f('height_cm') as string);
    const sex = f('sex') as 'male' | 'female';
    const activity = f('activity_level') as string;
    const goal = f('main_goal') as string;

    if (!age || !weight || !height || !sex) return null;

    const bmr = calculateBMR({ age, sex, weight_kg: weight, height_cm: height });
    const actFactor = ACTIVITY_FACTORS[activity as keyof typeof ACTIVITY_FACTORS] || 1.55;
    const tdee = calculateTDEE(bmr, actFactor);
    const macroRatios = GOAL_MACROS[goal] || GOAL_MACROS.performance;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      protein_g: Math.round(weight * macroRatios.protein),
      carbs_g: Math.round(weight * macroRatios.carbs),
      fat_g: Math.round(weight * macroRatios.fat),
      protein_kcal: Math.round(weight * macroRatios.protein * 4),
      carbs_kcal: Math.round(weight * macroRatios.carbs * 4),
      fat_kcal: Math.round(weight * macroRatios.fat * 9),
    };
  };

  const results = calcResults();

  const handleSave = async () => {
    if (!profile?.id) return;
    setSaving(true);

    const payload: Record<string, any> = {
      athlete_id: profile.id,
      age: parseInt(f('age') as string) || null,
      sex: f('sex') || null,
      height_cm: parseFloat(f('height_cm') as string) || null,
      weight_kg: parseFloat(f('weight_kg') as string) || null,
      occupation: f('occupation') || null,
      activity_level: f('activity_level'),
      work_hours: parseInt(f('work_hours') as string) || null,
      medical_conditions: f('medical_conditions') || null,
      medications_supplements: f('medications_supplements') || null,
      allergies_intolerances: f('allergies_intolerances') || null,
      sleep_hours: parseFloat(f('sleep_hours') as string) || null,
      sleep_quality: f('sleep_quality') || null,
      energy_levels: f('energy_levels') || null,
      stress_level: f('stress_level') || null,
      sport: f('sport') || null,
      training_frequency: f('training_frequency') || null,
      training_hours_weekly: parseFloat(f('training_hours_weekly') as string) || null,
      training_time: f('training_time') || null,
      pre_workout_nutrition: f('pre_workout_nutrition') || null,
      during_workout_nutrition: f('during_workout_nutrition') || null,
      post_workout_nutrition: f('post_workout_nutrition') || null,
      eating_pattern: f('eating_pattern') || null,
      dietary_preferences: f('dietary_preferences') || null,
      dietary_restrictions: f('dietary_restrictions') || null,
      breakfast_description: f('breakfast_description') || null,
      lunch_description: f('lunch_description') || null,
      dinner_description: f('dinner_description') || null,
      snacks_description: f('snacks_description') || null,
      beverages_description: f('beverages_description') || null,
      food_likes: f('food_likes') || null,
      food_dislikes: f('food_dislikes') || null,
      cooking_frequency: f('cooking_frequency') || null,
      eating_out_frequency: f('eating_out_frequency') || null,
      appetite_changes: f('appetite_changes') || null,
      relationship_with_food: f('relationship_with_food') || null,
      main_goal: f('main_goal'),
      nutrition_goals: f('nutrition_goals') || null,
      performance_expectations: f('performance_expectations') || null,
      upcoming_events: f('upcoming_events') || null,
      additional_notes: f('additional_notes') || null,
      updated_at: new Date().toISOString(),
      is_complete: section === SECTIONS.length - 1,
    };

    if (existingId) {
      await supabase.from('nutrition_anamnesis_v2').update(payload).eq('id', existingId);
    } else {
      const { data } = await supabase.from('nutrition_anamnesis_v2').insert(payload).select().maybeSingle();
      if (data) setExistingId(data.id);
    }

    if (results) {
      await supabase.from('nutrition_targets').upsert({
        athlete_id: profile.id,
        target_calories: results.tdee,
        protein_g: results.protein_g,
        carbs_g: results.carbs_g,
        fat_g: results.fat_g,
        bmr: results.bmr,
        tdee: results.tdee,
        calculation_date: new Date().toISOString().split('T')[0],
      }, { onConflict: 'athlete_id' });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-64"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} /></div>;
  }

  const progressPct = ((section) / SECTIONS.length) * 100;
  const sec = SECTIONS[section];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-xl border hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb' }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="font-heading text-xl" style={{ color: '#1f2937' }}>
            {t('Anamnesis Nutricional', 'Nutritional Anamnesis')}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, backgroundColor: '#514163' }} />
            </div>
            <span className="text-xs" style={{ color: '#9ca3af' }}>{section + 1}/{SECTIONS.length}</span>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2 py-2 px-4"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? t('¡Guardado!', 'Saved!') : t('Guardar', 'Save')}
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 overflow-x-auto mb-6 pb-1" style={{ scrollbarWidth: 'none' }}>
        {SECTIONS.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setSection(i)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all"
              style={section === i
                ? { backgroundColor: '#514163', color: '#fdda36' }
                : { color: '#6b7280', backgroundColor: '#f9fafb' }
              }
            >
              <Icon className="w-4 h-4" />
              {es ? s.label : s.labelEn}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-5" style={{ border: '2px solid #e5e7eb' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f3f0f7' }}>
                <sec.icon className="w-5 h-5" style={{ color: '#514163' }} />
              </div>
              <h2 className="font-heading text-lg" style={{ color: '#1f2937' }}>
                {es ? sec.label : sec.labelEn}
              </h2>
            </div>

            {section === 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <FieldRow label={t('Edad', 'Age')}>
                  <NumberInput value={f('age') as string} onChange={set('age')} placeholder="30" min={10} max={100} />
                </FieldRow>
                <FieldRow label={t('Sexo', 'Sex')}>
                  <SelectInput value={f('sex') as string} onChange={set('sex')} options={[
                    { value: '', label: t('Seleccionar', 'Select') },
                    { value: 'male', label: t('Masculino', 'Male') },
                    { value: 'female', label: t('Femenino', 'Female') },
                  ]} />
                </FieldRow>
                <FieldRow label={t('Altura (cm)', 'Height (cm)')}>
                  <NumberInput value={f('height_cm') as string} onChange={set('height_cm')} placeholder="170" min={100} max={250} />
                </FieldRow>
                <FieldRow label={t('Peso (kg)', 'Weight (kg)')}>
                  <NumberInput value={f('weight_kg') as string} onChange={set('weight_kg')} placeholder="70" min={30} max={250} />
                </FieldRow>
                <FieldRow label={t('Ocupación', 'Occupation')}>
                  <TextInput value={f('occupation') as string} onChange={set('occupation')} placeholder={t('ej. Ingeniero', 'e.g. Engineer')} />
                </FieldRow>
                <FieldRow label={t('Nivel de actividad', 'Activity level')}>
                  <SelectInput value={f('activity_level') as string} onChange={set('activity_level')} options={[
                    { value: 'sedentary', label: t('Sedentario (1.2)', 'Sedentary (1.2)') },
                    { value: 'light', label: t('Ligero (1.375)', 'Light (1.375)') },
                    { value: 'moderate', label: t('Moderado (1.55)', 'Moderate (1.55)') },
                    { value: 'active', label: t('Activo (1.725)', 'Active (1.725)') },
                    { value: 'very_active', label: t('Muy activo (1.9)', 'Very active (1.9)') },
                  ]} />
                </FieldRow>
                <FieldRow label={t('Horas de trabajo / día', 'Work hours / day')}>
                  <NumberInput value={f('work_hours') as string} onChange={set('work_hours')} placeholder="8" min={0} max={24} />
                </FieldRow>
                <FieldRow label={t('Horas de sueño', 'Sleep hours')}>
                  <NumberInput value={f('sleep_hours') as string} onChange={set('sleep_hours')} placeholder="7.5" min={0} max={24} />
                </FieldRow>
                <FieldRow label={t('Calidad de sueño', 'Sleep quality')}>
                  <SelectInput value={f('sleep_quality') as string} onChange={set('sleep_quality')} options={[
                    { value: 'poor', label: t('Mala', 'Poor') },
                    { value: 'fair', label: t('Regular', 'Fair') },
                    { value: 'good', label: t('Buena', 'Good') },
                    { value: 'excellent', label: t('Excelente', 'Excellent') },
                  ]} />
                </FieldRow>
                <FieldRow label={t('Niveles de energía', 'Energy levels')}>
                  <SelectInput value={f('energy_levels') as string} onChange={set('energy_levels')} options={[
                    { value: 'low', label: t('Bajo', 'Low') },
                    { value: 'moderate', label: t('Moderado', 'Moderate') },
                    { value: 'high', label: t('Alto', 'High') },
                  ]} />
                </FieldRow>
                <FieldRow label={t('Nivel de estrés', 'Stress level')}>
                  <SelectInput value={f('stress_level') as string} onChange={set('stress_level')} options={[
                    { value: 'low', label: t('Bajo', 'Low') },
                    { value: 'moderate', label: t('Moderado', 'Moderate') },
                    { value: 'high', label: t('Alto', 'High') },
                  ]} />
                </FieldRow>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Condiciones médicas', 'Medical conditions')}>
                    <TextareaInput value={f('medical_conditions') as string} onChange={set('medical_conditions')} placeholder={t('ej. Hipotiroidismo, diabetes...', 'e.g. Hypothyroidism, diabetes...')} rows={2} />
                  </FieldRow>
                </div>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Medicamentos / suplementos actuales', 'Current medications / supplements')}>
                    <TextareaInput value={f('medications_supplements') as string} onChange={set('medications_supplements')} rows={2} />
                  </FieldRow>
                </div>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Alergias / intolerancias', 'Allergies / intolerances')}>
                    <TextInput value={f('allergies_intolerances') as string} onChange={set('allergies_intolerances')} placeholder={t('ej. Lactosa, gluten...', 'e.g. Lactose, gluten...')} />
                  </FieldRow>
                </div>
              </div>
            )}

            {section === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <FieldRow label={t('Deporte principal', 'Main sport')}>
                  <TextInput value={f('sport') as string} onChange={set('sport')} placeholder={t('ej. Running, ciclismo...', 'e.g. Running, cycling...')} />
                </FieldRow>
                <FieldRow label={t('Frecuencia de entrenamiento', 'Training frequency')}>
                  <TextInput value={f('training_frequency') as string} onChange={set('training_frequency')} placeholder={t('ej. 5 veces / semana', 'e.g. 5 times / week')} />
                </FieldRow>
                <FieldRow label={t('Horas semanales', 'Weekly hours')}>
                  <NumberInput value={f('training_hours_weekly') as string} onChange={set('training_hours_weekly')} placeholder="8" min={0} />
                </FieldRow>
                <FieldRow label={t('Horario habitual', 'Usual schedule')}>
                  <TextInput value={f('training_time') as string} onChange={set('training_time')} placeholder={t('ej. Mañana, 7-9am', 'e.g. Morning, 7-9am')} />
                </FieldRow>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Nutrición pre-entrenamiento habitual', 'Usual pre-training nutrition')}>
                    <TextareaInput value={f('pre_workout_nutrition') as string} onChange={set('pre_workout_nutrition')} rows={2} />
                  </FieldRow>
                </div>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Nutrición durante el entrenamiento', 'During training nutrition')}>
                    <TextareaInput value={f('during_workout_nutrition') as string} onChange={set('during_workout_nutrition')} rows={2} />
                  </FieldRow>
                </div>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Nutrición post-entrenamiento habitual', 'Usual post-training nutrition')}>
                    <TextareaInput value={f('post_workout_nutrition') as string} onChange={set('post_workout_nutrition')} rows={2} />
                  </FieldRow>
                </div>
              </div>
            )}

            {section === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <FieldRow label={t('Patrón alimentario', 'Eating pattern')}>
                  <TextInput value={f('eating_pattern') as string} onChange={set('eating_pattern')} placeholder={t('ej. 3 comidas + 2 colaciones', 'e.g. 3 meals + 2 snacks')} />
                </FieldRow>
                <FieldRow label={t('Preferencias dietéticas', 'Dietary preferences')}>
                  <TextInput value={f('dietary_preferences') as string} onChange={set('dietary_preferences')} placeholder={t('ej. Omnívoro, vegano...', 'e.g. Omnivore, vegan...')} />
                </FieldRow>
                <FieldRow label={t('Restricciones alimentarias', 'Dietary restrictions')}>
                  <TextInput value={f('dietary_restrictions') as string} onChange={set('dietary_restrictions')} />
                </FieldRow>
                <FieldRow label={t('¿Con qué frecuencia cocina?', 'How often do you cook?')}>
                  <TextInput value={f('cooking_frequency') as string} onChange={set('cooking_frequency')} placeholder={t('ej. Todos los días', 'e.g. Every day')} />
                </FieldRow>
                <FieldRow label={t('¿Con qué frecuencia come afuera?', 'How often do you eat out?')}>
                  <TextInput value={f('eating_out_frequency') as string} onChange={set('eating_out_frequency')} placeholder={t('ej. 2-3 veces / semana', 'e.g. 2-3 times / week')} />
                </FieldRow>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Descripción del desayuno habitual', 'Usual breakfast description')}>
                    <TextareaInput value={f('breakfast_description') as string} onChange={set('breakfast_description')} rows={2} />
                  </FieldRow>
                </div>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Descripción del almuerzo habitual', 'Usual lunch description')}>
                    <TextareaInput value={f('lunch_description') as string} onChange={set('lunch_description')} rows={2} />
                  </FieldRow>
                </div>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Descripción de la cena habitual', 'Usual dinner description')}>
                    <TextareaInput value={f('dinner_description') as string} onChange={set('dinner_description')} rows={2} />
                  </FieldRow>
                </div>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Colaciones / snacks habituales', 'Usual snacks')}>
                    <TextareaInput value={f('snacks_description') as string} onChange={set('snacks_description')} rows={2} />
                  </FieldRow>
                </div>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Bebidas habituales (agua, café, alcohol...)', 'Usual beverages (water, coffee, alcohol...)')}>
                    <TextareaInput value={f('beverages_description') as string} onChange={set('beverages_description')} rows={2} />
                  </FieldRow>
                </div>
                <FieldRow label={t('Alimentos que le gustan', 'Foods you like')}>
                  <TextareaInput value={f('food_likes') as string} onChange={set('food_likes')} rows={2} />
                </FieldRow>
                <FieldRow label={t('Alimentos que no le gustan', 'Foods you dislike')}>
                  <TextareaInput value={f('food_dislikes') as string} onChange={set('food_dislikes')} rows={2} />
                </FieldRow>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Cambios en el apetito', 'Appetite changes')}>
                    <TextareaInput value={f('appetite_changes') as string} onChange={set('appetite_changes')} rows={2} />
                  </FieldRow>
                </div>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Relación con la comida', 'Relationship with food')}>
                    <TextareaInput value={f('relationship_with_food') as string} onChange={set('relationship_with_food')} rows={2} />
                  </FieldRow>
                </div>
              </div>
            )}

            {section === 3 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FieldRow label={t('Objetivo principal', 'Main goal')}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                      {[
                        { value: 'muscle_gain', es: 'Ganancia muscular', en: 'Muscle Gain' },
                        { value: 'fat_loss', es: 'Pérdida de grasa', en: 'Fat Loss' },
                        { value: 'performance', es: 'Rendimiento', en: 'Performance' },
                        { value: 'recovery', es: 'Recuperación', en: 'Recovery' },
                        { value: 'maintain', es: 'Mantenimiento', en: 'Maintenance' },
                      ].map((g) => (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() => set('main_goal')(g.value)}
                          className="py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all text-left"
                          style={{
                            borderColor: f('main_goal') === g.value ? '#514163' : '#e5e7eb',
                            backgroundColor: f('main_goal') === g.value ? '#f3f0f7' : '#fff',
                            color: f('main_goal') === g.value ? '#514163' : '#374151',
                          }}
                        >
                          {es ? g.es : g.en}
                        </button>
                      ))}
                    </div>
                  </FieldRow>
                </div>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Objetivos nutricionales detallados', 'Detailed nutritional goals')}>
                    <TextareaInput value={f('nutrition_goals') as string} onChange={set('nutrition_goals')} rows={3} />
                  </FieldRow>
                </div>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Expectativas de rendimiento', 'Performance expectations')}>
                    <TextareaInput value={f('performance_expectations') as string} onChange={set('performance_expectations')} rows={3} />
                  </FieldRow>
                </div>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Eventos próximos (carreras, competencias...)', 'Upcoming events (races, competitions...)')}>
                    <TextareaInput value={f('upcoming_events') as string} onChange={set('upcoming_events')} rows={2} />
                  </FieldRow>
                </div>
                <div className="sm:col-span-2">
                  <FieldRow label={t('Notas adicionales', 'Additional notes')}>
                    <TextareaInput value={f('additional_notes') as string} onChange={set('additional_notes')} rows={3} />
                  </FieldRow>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: '#f3f4f6' }}>
              <button
                onClick={() => setSection((s) => Math.max(0, s - 1))}
                disabled={section === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40"
                style={{ borderColor: '#e5e7eb', color: '#374151' }}
              >
                <ChevronLeft className="w-4 h-4" />
                {t('Anterior', 'Previous')}
              </button>
              <button
                onClick={() => section < SECTIONS.length - 1 ? setSection((s) => s + 1) : handleSave()}
                className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
              >
                {section < SECTIONS.length - 1 ? (
                  <>{t('Siguiente', 'Next')} <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {t('Guardar', 'Save')}</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 sticky top-4" style={{ border: '2px solid #e5e7eb' }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" style={{ color: '#514163' }} />
              <span className="font-semibold text-sm" style={{ color: '#1f2937' }}>
                {t('Resultados calculados', 'Calculated results')}
              </span>
            </div>

            {results ? (
              <div className="space-y-3">
                <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f3f0f7' }}>
                  <div className="text-xs mb-1" style={{ color: '#514163' }}>BMR</div>
                  <div className="text-2xl font-bold" style={{ color: '#514163' }}>{results.bmr}</div>
                  <div className="text-xs" style={{ color: '#9ca3af' }}>{t('kcal/día en reposo', 'kcal/day at rest')}</div>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#fef9c3' }}>
                  <div className="text-xs mb-1" style={{ color: '#b45309' }}>TDEE</div>
                  <div className="text-2xl font-bold" style={{ color: '#b45309' }}>{results.tdee}</div>
                  <div className="text-xs" style={{ color: '#9ca3af' }}>{t('kcal/día total', 'kcal/day total')}</div>
                </div>

                <div className="space-y-2 pt-2 border-t" style={{ borderColor: '#f3f4f6' }}>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9ca3af' }}>
                    {t('Macros objetivo', 'Target macros')}
                  </div>
                  {[
                    { label: t('Proteína', 'Protein'), value: results.protein_g, unit: 'g', color: '#ef4444', bg: '#fef2f2' },
                    { label: t('Carbohidratos', 'Carbs'), value: results.carbs_g, unit: 'g', color: '#16a34a', bg: '#f0fdf4' },
                    { label: t('Grasas', 'Fat'), value: results.fat_g, unit: 'g', color: '#ca8a04', bg: '#fefce8' },
                  ].map(({ label, value, unit, color, bg }) => (
                    <div key={label} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: bg }}>
                      <span className="text-xs font-medium" style={{ color }}>{label}</span>
                      <span className="text-sm font-bold" style={{ color }}>{value}{unit}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-center pt-1" style={{ color: '#9ca3af' }}>
                  {t('Basado en Mifflin-St Jeor', 'Based on Mifflin-St Jeor')}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm" style={{ color: '#9ca3af' }}>
                  {t('Completa edad, sexo, peso y altura para ver los cálculos', 'Complete age, sex, weight and height to see calculations')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
