import { useState } from 'react';
import { UtensilsCrossed, RefreshCw, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useHubFoodDiary } from '../../hooks/useHubData';

interface Props {
  athleteEmail: string;
  athleteName?: string;
}

const MEAL_ORDER = ['breakfast', 'desayuno', 'lunch', 'almuerzo', 'dinner', 'cena', 'snack', 'merienda', 'pre-workout', 'post-workout'];

function sortMeals(a: string, b: string) {
  const ai = MEAL_ORDER.findIndex((m) => a.toLowerCase().includes(m));
  const bi = MEAL_ORDER.findIndex((m) => b.toLowerCase().includes(m));
  if (ai === -1 && bi === -1) return a.localeCompare(b);
  if (ai === -1) return 1;
  if (bi === -1) return -1;
  return ai - bi;
}

function MacroBadge({ label, value, unit, color }: { label: string; value?: number; unit: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-base font-bold" style={{ color }}>
        {value != null ? Math.round(value) : '—'}<span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>{unit}</span>
      </span>
      <span className="text-xs" style={{ color: '#9ca3af' }}>{label}</span>
    </div>
  );
}

export default function HubFoodDiary({ athleteEmail, athleteName }: Props) {
  const today = new Date();
  const dateTo = today.toISOString().slice(0, 10);
  const [days7, setDays7] = useState(7);
  const dateFrom = new Date(today.getTime() - days7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const { data, loading, error, refetch } = useHubFoodDiary(athleteEmail, dateFrom, dateTo);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const days = Object.keys(data?.totals_by_day ?? {}).sort((a, b) => b.localeCompare(a));

  const entriesByDay: Record<string, typeof data.entries> = {};
  if (data?.entries) {
    for (const entry of data.entries) {
      const d = entry.date?.slice(0, 10) ?? 'unknown';
      if (!entriesByDay[d]) entriesByDay[d] = [];
      entriesByDay[d].push(entry);
    }
  }

  const mealsByDayAndType: Record<string, Record<string, typeof data.entries>> = {};
  for (const [day, entries] of Object.entries(entriesByDay)) {
    mealsByDayAndType[day] = {};
    for (const entry of entries ?? []) {
      const mt = entry.meal_type ?? 'other';
      if (!mealsByDayAndType[day][mt]) mealsByDayAndType[day][mt] = [];
      mealsByDayAndType[day][mt].push(entry);
    }
  }

  const allDays = [...new Set([...days, ...Object.keys(entriesByDay)])].sort((a, b) => b.localeCompare(a));

  function formatDay(d: string) {
    try {
      return new Date(d + 'T12:00:00').toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
    } catch {
      return d;
    }
  }

  return (
    <div className="card-brand p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef9c3' }}>
          <UtensilsCrossed className="w-4 h-4" style={{ color: '#d97706' }} />
        </div>
        <span className="font-heading text-sm" style={{ color: '#1f2937' }}>
          Diario alimentario · Hub
        </span>
        <div className="flex items-center gap-1 ml-2 p-0.5 rounded-lg" style={{ backgroundColor: '#f3f4f6' }}>
          {[3, 7, 14].map((d) => (
            <button
              key={d}
              onClick={() => setDays7(d)}
              className="px-2 py-0.5 rounded-md text-xs font-body font-medium transition-all"
              style={days7 === d ? { backgroundColor: '#fdda36', color: '#514163' } : { color: '#9ca3af' }}
            >
              {d}d
            </button>
          ))}
        </div>
        <button
          onClick={refetch}
          className="ml-auto p-1.5 rounded-lg transition-colors hover:bg-gray-100"
          title="Actualizar"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} style={{ color: '#9ca3af' }} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#fdda36', borderTopColor: 'transparent' }} />
        </div>
      )}

      {!loading && error && (
        <div className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: '#dc2626' }}>No se pudo cargar el diario del Hub</p>
            <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && allDays.length === 0 && (
        <div className="text-center py-8">
          <UtensilsCrossed className="w-8 h-8 mx-auto mb-2" style={{ color: '#d1d5db' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            {athleteName ?? 'El atleta'} no tiene registros en el Hub para los últimos {days7} días
          </p>
        </div>
      )}

      {!loading && !error && allDays.length > 0 && (
        <div className="space-y-3">
          {allDays.map((day) => {
            const totals = data?.totals_by_day?.[day];
            const meals = mealsByDayAndType[day] ?? {};
            const mealTypes = Object.keys(meals).sort(sortMeals);
            const isExpanded = expandedDay === day;

            return (
              <div key={day} className="rounded-xl overflow-hidden" style={{ border: '1px solid #f3f4f6' }}>
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : day)}
                  className="w-full flex items-center gap-3 p-4 text-left transition-colors"
                  style={{ backgroundColor: isExpanded ? '#fafafa' : '#ffffff' }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold capitalize" style={{ color: '#1f2937' }}>{formatDay(day)}</p>
                    {totals && (
                      <div className="flex items-center gap-4 mt-1.5">
                        <MacroBadge label="kcal" value={totals.kcal} unit="" color="#f59e0b" />
                        <MacroBadge label="CH" value={totals.carbs_g} unit="g" color="#3b82f6" />
                        <MacroBadge label="Prot" value={totals.protein_g} unit="g" color="#10b981" />
                        <MacroBadge label="Grasa" value={totals.fat_g} unit="g" color="#f97316" />
                      </div>
                    )}
                  </div>
                  {mealTypes.length > 0 && (
                    isExpanded
                      ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: '#9ca3af' }} />
                      : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#9ca3af' }} />
                  )}
                </button>

                {isExpanded && mealTypes.length > 0 && (
                  <div className="border-t" style={{ borderColor: '#f3f4f6' }}>
                    {mealTypes.map((mealType) => (
                      <div key={mealType} className="p-4 border-b last:border-b-0" style={{ borderColor: '#f9fafb' }}>
                        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#514163' }}>
                          {mealType}
                        </p>
                        <div className="space-y-1.5">
                          {meals[mealType]?.map((entry, i) => (
                            <div key={i} className="flex items-center justify-between gap-2">
                              <span className="text-sm flex-1" style={{ color: '#374151' }}>
                                {entry.food_name_es ?? entry.food_name ?? '—'}
                                {entry.quantity_g != null && (
                                  <span className="ml-1 text-xs" style={{ color: '#9ca3af' }}>{entry.quantity_g}g</span>
                                )}
                              </span>
                              {entry.kcal != null && (
                                <span className="text-xs font-medium flex-shrink-0" style={{ color: '#6b7280' }}>
                                  {Math.round(entry.kcal)} kcal
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
