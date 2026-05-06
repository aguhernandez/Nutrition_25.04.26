import { useState, useEffect } from 'react';
import { ChevronLeft, Trophy, Flame, Droplets, Clock, Calendar, AlertTriangle, Check, ChevronRight, Loader2, Coffee } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';
import { supabase } from '../../lib/supabase';
import type { StrategyOutput, DayNutrition } from '../../types/race';

interface Props {
  onBack: () => void;
}

interface SavedCompetition {
  id: string;
  raceName: string;
  sport: string;
  raceData: { raceDate: string; distance: number; distanceUnit: string; expectedDurationMin: number; temperature: number };
  strategyOutput?: StrategyOutput;
  raceDate?: string;
}

function formatDate(d: string) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
}

function daysUntil(dateStr: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const race = new Date(dateStr + 'T12:00:00');
  return Math.round((race.getTime() - today.getTime()) / 86400000);
}

function DayProtocolCard({ day, index, es }: { day: DayNutrition; index: number; es: boolean }) {
  const [open, setOpen] = useState(index === 0);
  const colors = [
    { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', label: 'Day -3' },
    { bg: '#fef3c7', border: '#fde68a', text: '#b45309', label: 'Day -2' },
    { bg: '#fdf2f8', border: '#f9a8d4', text: '#be185d', label: 'Day -1' },
    { bg: '#fef9c3', border: '#fef08a', text: '#ca8a04', label: es ? 'Día de Carrera' : 'Race Day' },
  ];
  const c = colors[Math.min(index, colors.length - 1)];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${c.border}`, backgroundColor: c.bg }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: c.text, color: '#fff' }}>
            {c.label.split(' ')[1]}
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm" style={{ color: '#1f2937' }}>{day.dayLabel}</div>
            <div className="text-xs" style={{ color: '#6b7280' }}>
              {day.carbsGkg} g CHO/kg · {Math.round(day.totalCarbsG)}g carbs · {Math.round(day.totalKcal)} kcal
            </div>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 transition-transform ${open ? 'rotate-90' : ''}`} style={{ color: c.text }} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center py-2 rounded-xl bg-white">
              <div className="font-bold text-sm" style={{ color: '#3b82f6' }}>{Math.round(day.totalCarbsG)}g</div>
              <div className="text-xs" style={{ color: '#9ca3af' }}>Carbs</div>
            </div>
            <div className="text-center py-2 rounded-xl bg-white">
              <div className="font-bold text-sm" style={{ color: '#10b981' }}>{Math.round(day.proteinG)}g</div>
              <div className="text-xs" style={{ color: '#9ca3af' }}>{es ? 'Prot' : 'Protein'}</div>
            </div>
            <div className="text-center py-2 rounded-xl bg-white">
              <div className="font-bold text-sm" style={{ color: '#f59e0b' }}>{Math.round(day.totalKcal)}</div>
              <div className="text-xs" style={{ color: '#9ca3af' }}>kcal</div>
            </div>
          </div>

          {day.meals.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: c.text }}>
                {es ? 'Comidas sugeridas' : 'Suggested meals'}
              </div>
              {day.meals.map((meal, i) => (
                <div key={i} className="flex items-start gap-2 bg-white rounded-xl p-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: c.text }} />
                  <div className="flex-1">
                    <div className="text-xs font-medium" style={{ color: '#6b7280' }}>{meal.timing}</div>
                    <div className="text-sm" style={{ color: '#1f2937' }}>{meal.description}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{meal.carbsG}g carbs</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {day.notes && (
            <div className="text-xs italic px-3 py-2 rounded-xl bg-white" style={{ color: '#6b7280' }}>
              {day.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RaceNutritionProtocol({ onBack }: Props) {
  const { user } = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';
  const [competitions, setCompetitions] = useState<SavedCompetition[]>([]);
  const [selected, setSelected] = useState<SavedCompetition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || user.id.startsWith('demo-')) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from('competitions')
        .select('id, race_name, sport, race_data, athlete_data, strategy_preferences, strategy_output, race_date')
        .eq('athlete_id', user.id)
        .not('strategy_output', 'is', null)
        .order('race_date', { ascending: true });

      if (data) {
        const comps: SavedCompetition[] = data.map((r: Record<string, unknown>) => ({
          id: r.id as string,
          raceName: r.race_name as string,
          sport: r.sport as string,
          raceData: r.race_data as SavedCompetition['raceData'],
          strategyOutput: r.strategy_output as StrategyOutput | undefined,
          raceDate: r.race_date as string | undefined,
        }));
        setCompetitions(comps);
        const upcoming = comps.find(c => c.raceDate && daysUntil(c.raceDate) >= 0);
        if (upcoming) setSelected(upcoming);
        else if (comps.length > 0) setSelected(comps[0]);
      }
      setLoading(false);
    })();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} />
      </div>
    );
  }

  const strategy = selected?.strategyOutput;
  const preComp = strategy?.preComp;
  const carbs = strategy?.carbs;
  const hydration = strategy?.hydration;
  const caffeine = strategy?.caffeine;
  const raceDate = selected?.raceDate ?? selected?.raceData?.raceDate;
  const days = raceDate ? daysUntil(raceDate) : null;

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl border hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb' }}>
          <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fdf2f8' }}>
            <Trophy className="w-4 h-4" style={{ color: '#be185d' }} />
          </div>
          <div>
            <h1 className="font-heading text-xl leading-tight" style={{ color: '#1f2937' }}>
              {es ? 'Protocolo de Carrera' : 'Race Protocol'}
            </h1>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              {es ? 'Plan nutricional pre · durante · post carrera' : 'Pre · during · post race nutrition'}
            </p>
          </div>
        </div>
      </div>

      {competitions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl" style={{ border: '2px solid #e5e7eb' }}>
          <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: '#d1d5db' }} />
          <h3 className="font-semibold mb-1" style={{ color: '#1f2937' }}>
            {es ? 'Sin carreras guardadas' : 'No races saved'}
          </h3>
          <p className="text-sm mb-2" style={{ color: '#9ca3af' }}>
            {es
              ? 'Crea un plan en el Race Planner para generar tu protocolo automáticamente.'
              : 'Create a plan in the Race Planner to generate your protocol automatically.'}
          </p>
          <button
            onClick={onBack}
            className="mt-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}
          >
            {es ? 'Ir al Race Planner' : 'Go to Race Planner'}
          </button>
        </div>
      ) : (
        <>
          {competitions.length > 1 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                {es ? 'Seleccionar carrera' : 'Select race'}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {competitions.map((c) => {
                  const d = c.raceDate ?? c.raceData?.raceDate;
                  const daysLeft = d ? daysUntil(d) : null;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className="flex-shrink-0 flex flex-col items-start px-4 py-3 rounded-2xl border-2 text-left transition-all"
                      style={{
                        borderColor: selected?.id === c.id ? '#be185d' : '#e5e7eb',
                        backgroundColor: selected?.id === c.id ? '#fdf2f8' : '#fff',
                      }}
                    >
                      <span className="font-semibold text-sm" style={{ color: '#1f2937' }}>{c.raceName}</span>
                      {d && (
                        <span className="text-xs mt-0.5" style={{ color: daysLeft !== null && daysLeft >= 0 ? '#be185d' : '#9ca3af' }}>
                          {daysLeft !== null && daysLeft >= 0
                            ? es ? `En ${daysLeft} días` : `In ${daysLeft} days`
                            : formatDate(d)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selected && (
            <>
              <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', border: '2px solid #f9a8d4' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-heading font-bold text-lg" style={{ color: '#1f2937' }}>{selected.raceName}</h2>
                    {raceDate && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5" style={{ color: '#be185d' }} />
                        <span className="text-sm capitalize" style={{ color: '#6b7280' }}>{formatDate(raceDate)}</span>
                      </div>
                    )}
                  </div>
                  {days !== null && (
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: days >= 0 ? '#be185d' : '#9ca3af' }}>
                        {days >= 0 ? days : '—'}
                      </div>
                      <div className="text-xs" style={{ color: '#9ca3af' }}>
                        {days >= 0
                          ? es ? 'días restantes' : 'days to go'
                          : es ? 'completada' : 'completed'}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    { icon: Clock, val: selected.raceData?.expectedDurationMin ? `${Math.floor(selected.raceData.expectedDurationMin / 60)}h ${selected.raceData.expectedDurationMin % 60}m` : '—', label: es ? 'Duración' : 'Duration' },
                    { icon: Flame, val: `${selected.raceData?.distance ?? '—'}${selected.raceData?.distanceUnit ?? ''}`, label: es ? 'Distancia' : 'Distance' },
                    { icon: Droplets, val: `${selected.raceData?.temperature ?? '—'}°C`, label: es ? 'Temp' : 'Temp' },
                  ].map(({ icon: Icon, val, label }) => (
                    <div key={label} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full">
                      <Icon className="w-3.5 h-3.5" style={{ color: '#be185d' }} />
                      <span className="text-xs font-medium" style={{ color: '#1f2937' }}>{val}</span>
                      <span className="text-xs" style={{ color: '#9ca3af' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {strategy && (
                <>
                  {preComp && preComp.plan.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
                          <Calendar className="w-3.5 h-3.5" style={{ color: '#1d4ed8' }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm" style={{ color: '#1f2937' }}>
                            {es ? 'Pre-Competencia — Carga de Carbos' : 'Pre-Competition — Carb Loading'}
                          </h3>
                          <p className="text-xs" style={{ color: '#9ca3af' }}>
                            {preComp.choLoadingDays} {es ? 'días de carga' : 'loading days'}{preComp.tapering ? (es ? ' · con tapering' : ' · with tapering') : ''}
                          </p>
                        </div>
                      </div>
                      {preComp.plan.map((day, i) => (
                        <DayProtocolCard key={i} day={day} index={i} es={es} />
                      ))}
                      {preComp.raceBreakfast && (
                        <div className="rounded-2xl p-4" style={{ border: '2px solid #fde68a', backgroundColor: '#fefce8' }}>
                          <div className="flex items-center gap-2 mb-3">
                            <Flame className="w-4 h-4" style={{ color: '#ca8a04' }} />
                            <span className="font-semibold text-sm" style={{ color: '#1f2937' }}>
                              {es ? 'Desayuno Día de Carrera' : 'Race Day Breakfast'}
                            </span>
                          </div>
                          <div className="text-sm mb-2" style={{ color: '#374151' }}>{preComp.raceBreakfast.description}</div>
                          <div className="flex gap-3 text-xs">
                            <span style={{ color: '#9ca3af' }}>
                              {es ? 'Timing' : 'Timing'}: <strong style={{ color: '#1f2937' }}>{preComp.raceBreakfast.timingBeforeStart}</strong>
                            </span>
                            <span style={{ color: '#9ca3af' }}>
                              Carbs: <strong style={{ color: '#3b82f6' }}>{preComp.raceBreakfast.carbsG}g</strong>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {carbs && (
                    <div className="bg-white rounded-2xl p-4" style={{ border: '2px solid #dbeafe' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
                          <Flame className="w-3.5 h-3.5" style={{ color: '#3b82f6' }} />
                        </div>
                        <h3 className="font-semibold text-sm" style={{ color: '#1f2937' }}>
                          {es ? 'Durante la Carrera — Carbohidratos' : 'During Race — Carbohydrates'}
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center rounded-xl py-3" style={{ backgroundColor: '#eff6ff' }}>
                          <div className="text-base font-bold" style={{ color: '#1d4ed8' }}>{carbs.recommendedIntakeGH}</div>
                          <div className="text-xs" style={{ color: '#9ca3af' }}>g/h</div>
                        </div>
                        <div className="text-center rounded-xl py-3" style={{ backgroundColor: '#f0fdf4' }}>
                          <div className="text-base font-bold" style={{ color: '#15803d' }}>{Math.round(carbs.totalCarbsG)}</div>
                          <div className="text-xs" style={{ color: '#9ca3af' }}>g total</div>
                        </div>
                        <div className="text-center rounded-xl py-3" style={{ backgroundColor: '#fef9c3' }}>
                          <div className="text-base font-bold" style={{ color: '#ca8a04' }}>{carbs.estimatedCarbUseGMin.toFixed(1)}</div>
                          <div className="text-xs" style={{ color: '#9ca3af' }}>g/min</div>
                        </div>
                      </div>
                      {carbs.sources.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {carbs.sources.map((s, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {carbs.timing && (
                        <p className="text-xs" style={{ color: '#6b7280' }}>{carbs.timing}</p>
                      )}
                    </div>
                  )}

                  {hydration && (
                    <div className="bg-white rounded-2xl p-4" style={{ border: '2px solid #bae6fd' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e0f2fe' }}>
                          <Droplets className="w-3.5 h-3.5" style={{ color: '#0369a1' }} />
                        </div>
                        <h3 className="font-semibold text-sm" style={{ color: '#1f2937' }}>
                          {es ? 'Hidratación' : 'Hydration'}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { val: `${hydration.fluidIntakeLH.toFixed(1)}`, unit: 'L/h', label: es ? 'Ingesta' : 'Intake', color: '#0369a1' },
                          { val: `${hydration.totalFluidL.toFixed(1)}`, unit: 'L', label: 'Total', color: '#0e7490' },
                          { val: `${hydration.sodiumMgH}`, unit: 'mg/h', label: es ? 'Sodio' : 'Sodium', color: '#0891b2' },
                          { val: `${hydration.projectedMassLossPct.toFixed(1)}`, unit: '%', label: es ? 'Pérd. masa' : 'Mass loss', color: hydration.projectedMassLossPct > 2 ? '#dc2626' : '#0369a1' },
                        ].map(({ val, unit, label, color }) => (
                          <div key={label} className="text-center rounded-xl py-2.5" style={{ backgroundColor: '#f0f9ff' }}>
                            <div className="font-bold text-sm" style={{ color }}>{val}<span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>{unit}</span></div>
                            <div className="text-xs" style={{ color: '#9ca3af' }}>{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {caffeine && caffeine.totalMg > 0 && (
                    <div className="bg-white rounded-2xl p-4" style={{ border: '2px solid #e9d5ff' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f5f3ff' }}>
                          <Coffee className="w-3.5 h-3.5" style={{ color: '#7c3aed' }} />
                        </div>
                        <h3 className="font-semibold text-sm" style={{ color: '#1f2937' }}>
                          {es ? 'Cafeína' : 'Caffeine'}
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center rounded-xl py-2.5" style={{ backgroundColor: '#f5f3ff' }}>
                          <div className="font-bold text-sm" style={{ color: '#7c3aed' }}>{caffeine.totalMg}mg</div>
                          <div className="text-xs" style={{ color: '#9ca3af' }}>total</div>
                        </div>
                        <div className="text-center rounded-xl py-2.5" style={{ backgroundColor: '#f5f3ff' }}>
                          <div className="font-bold text-sm" style={{ color: '#7c3aed' }}>{caffeine.mgPerKg.toFixed(1)}</div>
                          <div className="text-xs" style={{ color: '#9ca3af' }}>mg/kg</div>
                        </div>
                        <div className="text-center rounded-xl py-2.5" style={{ backgroundColor: '#f5f3ff' }}>
                          <div className="font-bold text-sm" style={{ color: '#7c3aed' }}>{caffeine.preDoseMg}mg</div>
                          <div className="text-xs" style={{ color: '#9ca3af' }}>pre-race</div>
                        </div>
                      </div>
                      {caffeine.midRaceDoses.length > 0 && (
                        <div className="space-y-1.5">
                          {caffeine.midRaceDoses.map((d, i) => (
                            <div key={i} className="flex items-center justify-between text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: '#f5f3ff' }}>
                              <span style={{ color: '#7c3aed' }}>{d.label}</span>
                              <span className="font-medium" style={{ color: '#1f2937' }}>{d.mg}mg · min {d.timingMin}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {caffeine.notes && (
                        <p className="text-xs mt-2 italic" style={{ color: '#9ca3af' }}>{caffeine.notes}</p>
                      )}
                    </div>
                  )}

                  {strategy.risks && strategy.risks.length > 0 && (
                    <div className="space-y-2">
                      {strategy.risks.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-3 rounded-xl"
                          style={{
                            backgroundColor: r.level === 'critical' ? '#fef2f2' : '#fef9c3',
                            border: `1px solid ${r.level === 'critical' ? '#fecaca' : '#fef08a'}`,
                          }}
                        >
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: r.level === 'critical' ? '#dc2626' : '#ca8a04' }} />
                          <p className="text-xs" style={{ color: r.level === 'critical' ? '#b91c1c' : '#92400e' }}>{r.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {es
                        ? 'Protocolo generado desde tu Race Planner'
                        : 'Protocol auto-generated from your Race Planner'}
                    </span>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
