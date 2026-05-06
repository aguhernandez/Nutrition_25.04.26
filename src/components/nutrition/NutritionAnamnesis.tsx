import { useState, useEffect } from 'react';
import { Save, ChevronLeft, User, Dumbbell, Utensils, Zap, Target, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { getAnamnesis, upsertAnamnesis } from '../../lib/nutritionService';
import type { NutritionAnamnesis, NutritionGoal, TrainingPhase, DietaryPattern, GIHistory } from '../../types/nutritionModule';

interface Props {
  onBack: () => void;
}

const GOALS: { value: NutritionGoal; label: string; desc: string }[] = [
  { value: 'performance', label: 'Performance', desc: 'Optimize for race results' },
  { value: 'endurance', label: 'Endurance', desc: 'Fuel longer efforts' },
  { value: 'muscle_gain', label: 'Muscle Gain', desc: 'Build strength & mass' },
  { value: 'weight_loss', label: 'Weight Loss', desc: 'Reduce body fat' },
  { value: 'health', label: 'General Health', desc: 'Balanced lifestyle' },
];

const PHASES: { value: TrainingPhase; label: string }[] = [
  { value: 'base', label: 'Base' },
  { value: 'build', label: 'Build' },
  { value: 'peak', label: 'Peak' },
  { value: 'taper', label: 'Taper' },
  { value: 'recovery', label: 'Recovery' },
  { value: 'off', label: 'Off Season' },
];

const DIETARY: { value: DietaryPattern; label: string }[] = [
  { value: 'omnivore', label: 'Omnivore' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'other', label: 'Other' },
];

const SPORTS = ['running', 'cycling', 'triathlon', 'swimming', 'trail running', 'mtb', 'gravel', 'duathlon', 'other'];

const COMMON_ALLERGIES = ['gluten', 'lactose', 'nuts', 'peanuts', 'soy', 'eggs', 'shellfish', 'fish'];
const COMMON_SUPPLEMENTS = ['caffeine', 'creatine', 'beta-alanine', 'iron', 'vitamin D', 'magnesium', 'BCAA', 'protein powder', 'electrolytes'];

function TagInput({ label, tags, suggestions, onChange }: {
  label: string;
  tags: string[];
  suggestions: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const add = (val: string) => {
    const v = val.trim().toLowerCase();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput('');
  };

  const remove = (t: string) => onChange(tags.filter((x) => x !== t));

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t) => (
          <span
            key={t}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer"
            style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d' }}
            onClick={() => remove(t)}
          >
            {t} ×
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {suggestions.filter((s) => !tags.includes(s)).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => add(s)}
            className="px-2.5 py-1 rounded-full text-xs border transition-all hover:bg-gray-100"
            style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
          >
            + {s}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(input); } }}
        placeholder="Type and press Enter..."
        className="input-brand"
      />
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: '2px solid #e5e7eb' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f9fafb' }}>
          <Icon className="w-4 h-4" style={{ color: '#514163' }} />
        </div>
        <h3 className="font-semibold text-sm" style={{ color: '#1f2937' }}>{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function calcTargets(a: Partial<NutritionAnamnesis>): {
  calories: number; carbs: number; protein: number; fat: number; hydration: number;
} {
  const w = a.body_weight_kg ?? 70;
  const h = a.weekly_training_hours ?? 8;
  const phase = a.training_phase ?? 'base';
  const goal = a.primary_goal ?? 'performance';

  const bmr = 370 + 21.6 * (w * (1 - (a.body_fat_pct ?? 20) / 100));
  const actFactor = 1.4 + Math.min(0.5, h * 0.01);
  let tdee = bmr * actFactor;

  if (goal === 'weight_loss') tdee -= 300;
  if (goal === 'muscle_gain') tdee += 200;

  const carbMultiplier = phase === 'load' ? 8 : phase === 'taper' ? 6 : phase === 'race_day' ? 10 : 5;
  const carbs = Math.round(w * carbMultiplier);
  const protein = Math.round(w * (goal === 'muscle_gain' ? 2.0 : 1.6));
  const fat = Math.round((tdee - carbs * 4 - protein * 4) / 9);
  const hydration = Math.round(w * 35 + h * 200);

  return { calories: Math.round(tdee), carbs, protein, fat: Math.max(40, fat), hydration };
}

export default function NutritionAnamnesis({ onBack }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<NutritionAnamnesis>>({
    primary_goal: 'performance',
    secondary_goals: [],
    body_weight_kg: 70,
    body_height_cm: 170,
    body_fat_pct: null,
    lean_mass_kg: null,
    weekly_training_hours: 8,
    primary_sport: 'running',
    training_phase: 'base',
    next_race_date: null,
    dietary_pattern: 'omnivore',
    food_allergies: [],
    food_intolerances: [],
    disliked_foods: [],
    preferred_foods: [],
    gi_history: 'none',
    gut_trained: false,
    current_supplements: [],
    target_calories_kcal: null,
    target_carbs_g: null,
    target_protein_g: null,
    target_fat_g: null,
    target_hydration_ml: null,
    notes: '',
  });

  const [useAutoTargets, setUseAutoTargets] = useState(true);
  const autoCalc = calcTargets(form);

  useEffect(() => {
    if (!user?.id || user.id.startsWith('demo-')) {
      setLoading(false);
      return;
    }
    getAnamnesis(user.id).then(({ data }) => {
      if (data) {
        setExistingId(data.id);
        setForm(data);
        setUseAutoTargets(!data.target_calories_kcal);
      }
      setLoading(false);
    });
  }, [user?.id]);

  const set = <K extends keyof NutritionAnamnesis>(key: K, value: NutritionAnamnesis[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user?.id || user.id.startsWith('demo-')) return;
    setSaving(true);
    const targets = useAutoTargets
      ? {
          target_calories_kcal: autoCalc.calories,
          target_carbs_g: autoCalc.carbs,
          target_protein_g: autoCalc.protein,
          target_fat_g: autoCalc.fat,
          target_hydration_ml: autoCalc.hydration,
        }
      : {};
    await upsertAnamnesis({ ...form, ...targets, user_id: user.id, ...(existingId ? { id: existingId } : {}) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl border hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb' }}>
          <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
        </button>
        <div>
          <h1 className="font-heading text-xl" style={{ color: '#1f2937' }}>Nutritional Anamnesis</h1>
          <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Your personal nutrition profile</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#15803d' }}>
              <CheckCircle2 className="w-4 h-4" /> Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      {user?.id?.startsWith('demo-') && (
        <div className="flex items-start gap-2 p-3 rounded-xl text-sm" style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d', color: '#b45309' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          Demo mode — changes won't be saved. Log in with real credentials to persist data.
        </div>
      )}

      {/* Goal */}
      <Section icon={Target} title="Primary Goal">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GOALS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => set('primary_goal', g.value)}
              className="text-left p-3 rounded-xl border transition-all"
              style={{
                borderColor: form.primary_goal === g.value ? '#514163' : '#e5e7eb',
                backgroundColor: form.primary_goal === g.value ? '#f5f3ff' : '#ffffff',
              }}
            >
              <div className="font-semibold text-sm" style={{ color: '#1f2937' }}>{g.label}</div>
              <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{g.desc}</div>
            </button>
          ))}
        </div>
      </Section>

      {/* Anthropometrics */}
      <Section icon={User} title="Body Composition">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Weight (kg)</label>
            <input
              type="number"
              min={30}
              max={200}
              value={form.body_weight_kg ?? ''}
              onChange={(e) => set('body_weight_kg', parseFloat(e.target.value) || 70)}
              className="input-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Height (cm)</label>
            <input
              type="number"
              min={100}
              max={250}
              value={form.body_height_cm ?? ''}
              onChange={(e) => set('body_height_cm', parseFloat(e.target.value) || 170)}
              className="input-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Body Fat % <span style={{ color: '#9ca3af' }}>(optional)</span></label>
            <input
              type="number"
              min={3}
              max={50}
              placeholder="e.g. 18"
              value={form.body_fat_pct ?? ''}
              onChange={(e) => set('body_fat_pct', e.target.value ? parseFloat(e.target.value) : null)}
              className="input-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Lean Mass (kg) <span style={{ color: '#9ca3af' }}>(optional)</span></label>
            <input
              type="number"
              min={20}
              max={150}
              placeholder="e.g. 62"
              value={form.lean_mass_kg ?? ''}
              onChange={(e) => set('lean_mass_kg', e.target.value ? parseFloat(e.target.value) : null)}
              className="input-brand"
            />
          </div>
        </div>
      </Section>

      {/* Training Context */}
      <Section icon={Dumbbell} title="Training Context">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Weekly Training Hours</label>
            <input
              type="number"
              min={1}
              max={40}
              value={form.weekly_training_hours ?? ''}
              onChange={(e) => set('weekly_training_hours', parseFloat(e.target.value) || 8)}
              className="input-brand"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Primary Sport</label>
            <select
              value={form.primary_sport ?? 'running'}
              onChange={(e) => set('primary_sport', e.target.value)}
              className="input-brand"
            >
              {SPORTS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>Training Phase</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PHASES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => set('training_phase', p.value)}
                className="py-2 px-3 rounded-xl border text-xs font-medium transition-all"
                style={{
                  borderColor: form.training_phase === p.value ? '#514163' : '#e5e7eb',
                  backgroundColor: form.training_phase === p.value ? '#514163' : '#ffffff',
                  color: form.training_phase === p.value ? '#fdda36' : '#374151',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Next Race Date <span style={{ color: '#9ca3af' }}>(optional)</span></label>
          <input
            type="date"
            value={form.next_race_date ?? ''}
            onChange={(e) => set('next_race_date', e.target.value || null)}
            className="input-brand"
          />
        </div>
      </Section>

      {/* Dietary Profile */}
      <Section icon={Utensils} title="Dietary Profile">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>Dietary Pattern</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DIETARY.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => set('dietary_pattern', d.value)}
                className="py-2 px-3 rounded-xl border text-sm font-medium transition-all"
                style={{
                  borderColor: form.dietary_pattern === d.value ? '#514163' : '#e5e7eb',
                  backgroundColor: form.dietary_pattern === d.value ? '#514163' : '#ffffff',
                  color: form.dietary_pattern === d.value ? '#fdda36' : '#374151',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <TagInput
          label="Food Allergies"
          tags={form.food_allergies ?? []}
          suggestions={COMMON_ALLERGIES}
          onChange={(v) => set('food_allergies', v)}
        />

        <TagInput
          label="Food Intolerances"
          tags={form.food_intolerances ?? []}
          suggestions={['lactose', 'fructose', 'FODMAP', 'histamine']}
          onChange={(v) => set('food_intolerances', v)}
        />

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>GI Tolerance History</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['none', 'mild', 'moderate', 'severe'] as GIHistory[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => set('gi_history', g)}
                className="py-2 px-3 rounded-xl border text-sm font-medium transition-all"
                style={{
                  borderColor: form.gi_history === g ? '#514163' : '#e5e7eb',
                  backgroundColor: form.gi_history === g ? '#514163' : '#ffffff',
                  color: form.gi_history === g ? '#fdda36' : '#374151',
                }}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
          <div>
            <div className="text-sm font-medium" style={{ color: '#1f2937' }}>Gut Trained</div>
            <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Have you practiced high-carb intake during training?</div>
          </div>
          <button
            type="button"
            onClick={() => set('gut_trained', !form.gut_trained)}
            className="w-12 h-6 rounded-full transition-all relative"
            style={{ backgroundColor: form.gut_trained ? '#514163' : '#d1d5db' }}
          >
            <div
              className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
              style={{ left: form.gut_trained ? '26px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
            />
          </button>
        </div>
      </Section>

      {/* Supplements */}
      <Section icon={Zap} title="Current Supplements">
        <TagInput
          label="What supplements are you currently using?"
          tags={form.current_supplements ?? []}
          suggestions={COMMON_SUPPLEMENTS}
          onChange={(v) => set('current_supplements', v)}
        />
      </Section>

      {/* Targets */}
      <Section icon={Target} title="Daily Targets">
        <div className="flex items-center justify-between p-3 rounded-xl mb-4" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
          <div>
            <div className="text-sm font-medium" style={{ color: '#1f2937' }}>Auto-calculate targets</div>
            <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Based on your body weight, phase, and goal</div>
          </div>
          <button
            type="button"
            onClick={() => setUseAutoTargets((v) => !v)}
            className="w-12 h-6 rounded-full transition-all relative"
            style={{ backgroundColor: useAutoTargets ? '#514163' : '#d1d5db' }}
          >
            <div
              className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
              style={{ left: useAutoTargets ? '26px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
            />
          </button>
        </div>

        {useAutoTargets ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Calories', value: autoCalc.calories, unit: 'kcal', color: '#f59e0b' },
              { label: 'Carbs', value: autoCalc.carbs, unit: 'g', color: '#3b82f6' },
              { label: 'Protein', value: autoCalc.protein, unit: 'g', color: '#10b981' },
              { label: 'Fat', value: autoCalc.fat, unit: 'g', color: '#f97316' },
            ].map(({ label, value, unit, color }) => (
              <div key={label} className="text-center rounded-xl py-3" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <div className="text-lg font-bold" style={{ color }}>{value}<span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>{unit}</span></div>
                <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'target_calories_kcal' as const, label: 'Calories (kcal)', min: 1200, max: 6000 },
              { key: 'target_carbs_g' as const, label: 'Carbs (g)', min: 100, max: 1200 },
              { key: 'target_protein_g' as const, label: 'Protein (g)', min: 50, max: 400 },
              { key: 'target_fat_g' as const, label: 'Fat (g)', min: 30, max: 300 },
            ].map(({ key, label, min, max }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{label}</label>
                <input
                  type="number"
                  min={min}
                  max={max}
                  value={form[key] ?? ''}
                  onChange={(e) => set(key, e.target.value ? parseInt(e.target.value) : null)}
                  className="input-brand"
                />
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Daily Hydration Target (ml)</label>
          <input
            type="number"
            min={1000}
            max={8000}
            placeholder={`Recommended: ${autoCalc.hydration}ml`}
            value={form.target_hydration_ml ?? ''}
            onChange={(e) => set('target_hydration_ml', e.target.value ? parseInt(e.target.value) : null)}
            className="input-brand"
          />
        </div>
      </Section>

      {/* Notes */}
      <div className="bg-white rounded-2xl p-5" style={{ border: '2px solid #e5e7eb' }}>
        <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Additional Notes</label>
        <textarea
          rows={3}
          value={form.notes ?? ''}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Any relevant health history, specific goals, or notes for your nutritionist..."
          className="input-brand resize-none"
        />
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
        style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}
      >
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  );
}
