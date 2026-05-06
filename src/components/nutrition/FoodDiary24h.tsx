import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ChevronRight, ChevronLeft, Loader2, Check, Clock } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

interface Props {
  onClose: () => void;
  lang?: 'es' | 'en';
}

interface DiaryEntry {
  id: string;
  entry_time: string;
  meal_type: string;
  food_description: string;
  estimated_calories: number;
  estimated_carbs_g: number;
  estimated_protein_g: number;
  estimated_fat_g: number;
  additional_notes: string;
  needs_review: boolean;
}

const MEAL_TYPES_ES = [
  { value: 'breakfast', label: 'Desayuno', icon: '🌅' },
  { value: 'morning_snack', label: 'Colación Mañana', icon: '☕' },
  { value: 'lunch', label: 'Almuerzo', icon: '🍽️' },
  { value: 'afternoon_snack', label: 'Merienda', icon: '🍎' },
  { value: 'pre_training', label: 'Pre-Entreno', icon: '⚡' },
  { value: 'post_training', label: 'Post-Entreno', icon: '💪' },
  { value: 'dinner', label: 'Cena', icon: '🌙' },
  { value: 'other', label: 'Otro', icon: '🍴' },
];

const MEAL_TYPES_EN = [
  { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { value: 'morning_snack', label: 'Morning Snack', icon: '☕' },
  { value: 'lunch', label: 'Lunch', icon: '🍽️' },
  { value: 'afternoon_snack', label: 'Afternoon Snack', icon: '🍎' },
  { value: 'pre_training', label: 'Pre-Training', icon: '⚡' },
  { value: 'post_training', label: 'Post-Training', icon: '💪' },
  { value: 'dinner', label: 'Dinner', icon: '🌙' },
  { value: 'other', label: 'Other', icon: '🍴' },
];

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const EMPTY_ENTRY: Omit<DiaryEntry, 'id'> = {
  entry_time: '',
  meal_type: 'breakfast',
  food_description: '',
  estimated_calories: 0,
  estimated_carbs_g: 0,
  estimated_protein_g: 0,
  estimated_fat_g: 0,
  additional_notes: '',
  needs_review: false,
};

export default function FoodDiary24h({ onClose, lang = 'es' }: Props) {
  const { profile } = useAuth();
  const [step, setStep] = useState(0);
  const [periodHours, setPeriodHours] = useState(24);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [entryForm, setEntryForm] = useState<Omit<DiaryEntry, 'id'>>(EMPTY_ENTRY);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [finalized, setFinalized] = useState(false);

  const t = (es: string, en: string) => lang === 'es' ? es : en;
  const mealTypes = lang === 'es' ? MEAL_TYPES_ES : MEAL_TYPES_EN;
  const days = lang === 'es' ? DAYS_ES : DAYS_EN;

  useEffect(() => {
    if (step === 1 && !sessionId && profile?.id && !profile.id.startsWith('demo-')) {
      createSession();
    }
  }, [step]);

  const createSession = async () => {
    const { data } = await supabase
      .from('food_diary_sessions')
      .insert({
        athlete_id: profile!.id,
        period_hours: periodHours,
        start_date: new Date().toISOString().split('T')[0],
        day_of_week: days[selectedDay],
        status: 'in_progress',
      })
      .select()
      .maybeSingle();
    if (data) setSessionId(data.id);
  };

  const handleAddEntry = () => {
    setEntryForm(EMPTY_ENTRY);
    setEditingEntry(null);
    setShowAddForm(true);
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setEntryForm({
      entry_time: entry.entry_time,
      meal_type: entry.meal_type,
      food_description: entry.food_description,
      estimated_calories: entry.estimated_calories,
      estimated_carbs_g: entry.estimated_carbs_g,
      estimated_protein_g: entry.estimated_protein_g,
      estimated_fat_g: entry.estimated_fat_g,
      additional_notes: entry.additional_notes,
      needs_review: entry.needs_review,
    });
    setEditingEntry(entry);
    setShowAddForm(true);
  };

  const handleSaveEntry = async () => {
    if (!entryForm.food_description.trim()) return;
    setSaving(true);

    const newEntry: DiaryEntry = {
      id: editingEntry?.id || crypto.randomUUID(),
      ...entryForm,
    };

    if (editingEntry) {
      setEntries((prev) => prev.map((e) => e.id === editingEntry.id ? newEntry : e));
      if (sessionId) {
        await supabase.from('food_diary_entries').update({
          entry_time: entryForm.entry_time,
          meal_type: entryForm.meal_type,
          food_description: entryForm.food_description,
          estimated_calories: entryForm.estimated_calories,
          estimated_carbs_g: entryForm.estimated_carbs_g,
          estimated_protein_g: entryForm.estimated_protein_g,
          estimated_fat_g: entryForm.estimated_fat_g,
          additional_notes: entryForm.additional_notes,
        }).eq('id', editingEntry.id);
      }
    } else {
      setEntries((prev) => [...prev, newEntry]);
      if (sessionId) {
        const { data } = await supabase.from('food_diary_entries').insert({
          session_id: sessionId,
          entry_time: entryForm.entry_time,
          meal_type: entryForm.meal_type,
          food_description: entryForm.food_description,
          estimated_calories: entryForm.estimated_calories,
          estimated_carbs_g: entryForm.estimated_carbs_g,
          estimated_protein_g: entryForm.estimated_protein_g,
          estimated_fat_g: entryForm.estimated_fat_g,
          additional_notes: entryForm.additional_notes,
        }).select().maybeSingle();
        if (data) {
          setEntries((prev) => prev.map((e) => e.id === newEntry.id ? { ...e, id: data.id } : e));
        }
      }
    }

    setSaving(false);
    setShowAddForm(false);
    setEditingEntry(null);
  };

  const handleDeleteEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (sessionId) {
      await supabase.from('food_diary_entries').delete().eq('id', id);
    }
  };

  const handleFinalize = async () => {
    setFinalizing(true);
    const totals = calcTotals();

    if (sessionId) {
      await supabase.from('food_diary_sessions').update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        total_calories: totals.calories,
        total_protein_g: totals.protein_g,
        total_carbs_g: totals.carbs_g,
        total_fat_g: totals.fat_g,
      }).eq('id', sessionId);
    }

    setFinalizing(false);
    setFinalized(true);
    setStep(2);
  };

  const calcTotals = () => entries.reduce(
    (a, e) => ({
      calories: a.calories + (e.estimated_calories || 0),
      protein_g: a.protein_g + (e.estimated_protein_g || 0),
      carbs_g: a.carbs_g + (e.estimated_carbs_g || 0),
      fat_g: a.fat_g + (e.estimated_fat_g || 0),
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  );

  const groupedEntries = mealTypes.map((mt) => ({
    ...mt,
    entries: entries.filter((e) => e.meal_type === mt.value),
  })).filter((g) => g.entries.length > 0);

  const totals = calcTotals();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl" style={{ border: '2px solid #e5e7eb' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#e5e7eb' }}>
          <div>
            <h2 className="font-heading text-lg" style={{ color: '#1f2937' }}>
              {t(`Diario ${periodHours}h`, `${periodHours}h Diary`)}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              {[0, 1, 2].map((s) => (
                <div
                  key={s}
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: s <= step ? '24px' : '12px', backgroundColor: s <= step ? '#514163' : '#e5e7eb' }}
                />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-all">
            <X className="w-5 h-5" style={{ color: '#6b7280' }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* STEP 0: Configuration */}
          {step === 0 && (
            <div className="p-5 space-y-5">
              <div>
                <h3 className="font-semibold mb-3" style={{ color: '#1f2937' }}>
                  {t('Período de registro', 'Recording period')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[24, 48].map((h) => (
                    <button
                      key={h}
                      onClick={() => setPeriodHours(h)}
                      className="py-4 rounded-xl text-center border transition-all"
                      style={{
                        borderColor: periodHours === h ? '#514163' : '#e5e7eb',
                        backgroundColor: periodHours === h ? '#f3f0f7' : '#fff',
                        color: periodHours === h ? '#514163' : '#374151',
                      }}
                    >
                      <div className="text-2xl font-bold">{h}h</div>
                      <div className="text-sm mt-1" style={{ color: '#9ca3af' }}>
                        {h === 24 ? t('Un día completo', 'Full day') : t('Dos días', 'Two days')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3" style={{ color: '#1f2937' }}>
                  {t('Día de la semana', 'Day of the week')}
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {days.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(i)}
                      className="py-2.5 rounded-xl text-sm border font-medium transition-all"
                      style={{
                        borderColor: selectedDay === i ? '#514163' : '#e5e7eb',
                        backgroundColor: selectedDay === i ? '#514163' : '#fff',
                        color: selectedDay === i ? '#fdda36' : '#374151',
                      }}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Entry */}
          {step === 1 && (
            <div className="p-5 space-y-4">
              {!showAddForm && (
                <button
                  onClick={handleAddEntry}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-semibold transition-all hover:bg-gray-50"
                  style={{ borderColor: '#514163', color: '#514163' }}
                >
                  <Plus className="w-4 h-4" />
                  {t('Agregar alimento / comida', 'Add food / meal')}
                </button>
              )}

              {showAddForm && (
                <div className="rounded-2xl p-4 space-y-3" style={{ border: '2px solid #514163', backgroundColor: '#f9f7fb' }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
                        {t('Hora', 'Time')}
                      </label>
                      <input
                        type="time"
                        value={entryForm.entry_time}
                        onChange={(e) => setEntryForm((f) => ({ ...f, entry_time: e.target.value }))}
                        className="input-brand py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
                        {t('Tipo de comida', 'Meal type')}
                      </label>
                      <select
                        value={entryForm.meal_type}
                        onChange={(e) => setEntryForm((f) => ({ ...f, meal_type: e.target.value }))}
                        className="input-brand py-2 text-sm"
                      >
                        {mealTypes.map((mt) => (
                          <option key={mt.value} value={mt.value}>{mt.icon} {mt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
                      {t('Descripción del alimento *', 'Food description *')}
                    </label>
                    <textarea
                      value={entryForm.food_description}
                      onChange={(e) => setEntryForm((f) => ({ ...f, food_description: e.target.value }))}
                      placeholder={t('ej. 1 taza de arroz integral con 150g de pollo a la plancha...', 'e.g. 1 cup of brown rice with 150g grilled chicken...')}
                      rows={2}
                      className="input-brand resize-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { key: 'estimated_calories', label: t('Kcal', 'Kcal'), color: '#f59e0b' },
                      { key: 'estimated_protein_g', label: t('Prot (g)', 'Prot (g)'), color: '#ef4444' },
                      { key: 'estimated_carbs_g', label: t('CHO (g)', 'Carbs (g)'), color: '#16a34a' },
                      { key: 'estimated_fat_g', label: t('Grasas (g)', 'Fat (g)'), color: '#ca8a04' },
                    ].map(({ key, label, color }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium mb-1" style={{ color }}>{label}</label>
                        <input
                          type="number"
                          value={(entryForm as any)[key] || ''}
                          onChange={(e) => setEntryForm((f) => ({ ...f, [key]: parseFloat(e.target.value) || 0 }))}
                          min={0}
                          className="input-brand py-1.5 text-sm text-center"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>
                      {t('Notas adicionales', 'Additional notes')}
                    </label>
                    <input
                      type="text"
                      value={entryForm.additional_notes}
                      onChange={(e) => setEntryForm((f) => ({ ...f, additional_notes: e.target.value }))}
                      placeholder={t('ej. Comí rápido, no terminé...', 'e.g. Ate quickly, didn\'t finish...')}
                      className="input-brand py-2 text-sm"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => { setShowAddForm(false); setEditingEntry(null); }}
                      className="flex-1 py-2 rounded-xl border text-sm font-medium"
                      style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
                    >
                      {t('Cancelar', 'Cancel')}
                    </button>
                    <button
                      onClick={handleSaveEntry}
                      disabled={saving || !entryForm.food_description.trim()}
                      className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      {t('Agregar', 'Add')}
                    </button>
                  </div>
                </div>
              )}

              {/* Grouped entries */}
              {groupedEntries.map((group) => (
                <div key={group.value} className="rounded-xl overflow-hidden" style={{ border: '1px solid #f3f4f6' }}>
                  <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: '#f9fafb' }}>
                    <span>{group.icon}</span>
                    <span className="text-sm font-semibold" style={{ color: '#374151' }}>{group.label}</span>
                    <span className="ml-auto text-xs" style={{ color: '#9ca3af' }}>
                      {Math.round(group.entries.reduce((a, e) => a + e.estimated_calories, 0))} kcal
                    </span>
                  </div>
                  {group.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 px-3 py-2.5 border-t hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#f3f4f6' }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {entry.entry_time && (
                            <span className="flex items-center gap-1 text-xs" style={{ color: '#9ca3af' }}>
                              <Clock className="w-3 h-3" />{entry.entry_time}
                            </span>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: '#374151' }}>{entry.food_description}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs">
                          <span style={{ color: '#f59e0b' }}>{Math.round(entry.estimated_calories)} kcal</span>
                          <span style={{ color: '#ef4444' }}>{entry.estimated_protein_g}g P</span>
                          <span style={{ color: '#16a34a' }}>{entry.estimated_carbs_g}g C</span>
                          <span style={{ color: '#ca8a04' }}>{entry.estimated_fat_g}g G</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => handleEditEntry(entry)} className="p-1.5 rounded-lg hover:bg-gray-200 transition-all">
                          <ChevronRight className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
                        </button>
                        <button onClick={() => handleDeleteEntry(entry.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-all">
                          <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {entries.length === 0 && !showAddForm && (
                <div className="text-center py-10">
                  <p className="text-sm" style={{ color: '#9ca3af' }}>
                    {t('Aún no hay entradas. Agrega tu primera comida arriba.', 'No entries yet. Add your first meal above.')}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Summary */}
          {step === 2 && (
            <div className="p-5 space-y-5">
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#f0fdf4' }}>
                  <Check className="w-7 h-7" style={{ color: '#16a34a' }} />
                </div>
                <h3 className="font-heading text-xl mb-1" style={{ color: '#1f2937' }}>
                  {t('¡Diario completado!', 'Diary completed!')}
                </h3>
                <p className="text-sm" style={{ color: '#6b7280' }}>
                  {t(`${entries.length} entradas registradas`, `${entries.length} entries recorded`)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t('Calorías totales', 'Total calories'), value: Math.round(totals.calories), unit: 'kcal', color: '#f59e0b', bg: '#fefce8' },
                  { label: t('Proteína total', 'Total protein'), value: Math.round(totals.protein_g), unit: 'g', color: '#ef4444', bg: '#fef2f2' },
                  { label: t('Carbohidratos', 'Carbohydrates'), value: Math.round(totals.carbs_g), unit: 'g', color: '#16a34a', bg: '#f0fdf4' },
                  { label: t('Grasas totales', 'Total fat'), value: Math.round(totals.fat_g), unit: 'g', color: '#ca8a04', bg: '#fefce8' },
                ].map(({ label, value, unit, color, bg }) => (
                  <div key={label} className="rounded-xl p-4 text-center" style={{ backgroundColor: bg }}>
                    <div className="text-2xl font-bold mb-0.5" style={{ color }}>{value}<span className="text-sm ml-1">{unit}</span></div>
                    <div className="text-xs" style={{ color: '#9ca3af' }}>{label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-4" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <h4 className="font-semibold text-sm mb-3" style={{ color: '#374151' }}>
                  {t('Distribución por comida', 'Distribution by meal')}
                </h4>
                {groupedEntries.map((group) => {
                  const groupCals = group.entries.reduce((a, e) => a + e.estimated_calories, 0);
                  const pct = totals.calories > 0 ? Math.round((groupCals / totals.calories) * 100) : 0;
                  return (
                    <div key={group.value} className="flex items-center gap-2 mb-2">
                      <span className="text-base">{group.icon}</span>
                      <span className="text-xs flex-1" style={{ color: '#374151' }}>{group.label}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#514163' }} />
                      </div>
                      <span className="text-xs w-10 text-right" style={{ color: '#9ca3af' }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: '#e5e7eb' }}>
          {step > 0 && !finalized && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium"
              style={{ borderColor: '#e5e7eb', color: '#374151' }}
            >
              <ChevronLeft className="w-4 h-4" />
              {t('Atrás', 'Back')}
            </button>
          )}
          {step === 0 && <div />}
          {finalized && <div />}

          {step === 0 && (
            <button
              onClick={() => setStep(1)}
              className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
            >
              {t('Continuar', 'Continue')}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === 1 && (
            <button
              onClick={handleFinalize}
              disabled={finalizing || entries.length === 0}
              className="btn-primary flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50"
            >
              {finalizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {t('Finalizar sesión', 'Finalize session')}
            </button>
          )}

          {step === 2 && (
            <button
              onClick={onClose}
              className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
            >
              {t('Cerrar', 'Close')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
