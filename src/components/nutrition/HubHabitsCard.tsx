import { RefreshCw, Wifi, WifiOff, Repeat, Flame, Droplets, Moon, CheckCircle, XCircle } from 'lucide-react';
import { useHubHabits } from '../../hooks/useHubData';

interface Props {
  athleteEmail: string;
  athleteName?: string;
}

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  sleep: { color: '#6366f1', bg: '#eef2ff', label: 'Sueño' },
  hydration: { color: '#0ea5e9', bg: '#f0f9ff', label: 'Hidratación' },
  nutrition: { color: '#f59e0b', bg: '#fef3c7', label: 'Nutrición' },
  training: { color: '#10b981', bg: '#f0fdf4', label: 'Entrenamiento' },
  recovery: { color: '#8b5cf6', bg: '#f5f3ff', label: 'Recuperación' },
  mental: { color: '#ec4899', bg: '#fdf4ff', label: 'Mental' },
  supplements: { color: '#f97316', bg: '#fff7ed', label: 'Suplementos' },
  other: { color: '#6b7280', bg: '#f3f4f6', label: 'Otro' },
};

function ComplianceBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height: '4px', backgroundColor: '#e5e7eb' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function HubHabitsCard({ athleteEmail, athleteName }: Props) {
  const { data, loading, error, refetch } = useHubHabits(athleteEmail);

  if (loading) {
    return (
      <div className="card-brand p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
            <Repeat className="w-4 h-4" style={{ color: '#10b981' }} />
          </div>
          <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Hábitos</span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-1" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Wifi className="w-3 h-3" />
            Hub
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#fdda36', borderTopColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-brand p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
            <Repeat className="w-4 h-4" style={{ color: '#b91c1c' }} />
          </div>
          <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Hábitos</span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-1" style={{ backgroundColor: '#fef2f2', color: '#b91c1c' }}>
            <WifiOff className="w-3 h-3" />
            Hub offline
          </div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
          <p className="text-sm" style={{ color: '#b91c1c' }}>No se pudieron cargar los hábitos</p>
          <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{error}</p>
          <button
            onClick={refetch}
            className="mt-3 flex items-center gap-1.5 mx-auto text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}
          >
            <RefreshCw className="w-3 h-3" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const habits = data?.habits ?? [];
  const summary = data?.summary;

  if (habits.length === 0 && !data?.sleep_avg_hours && !data?.hydration_avg_liters) {
    return (
      <div className="card-brand p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
            <Repeat className="w-4 h-4" style={{ color: '#10b981' }} />
          </div>
          <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Hábitos</span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-1" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
            <Wifi className="w-3 h-3" />
            Hub
          </div>
        </div>
        <div className="text-center py-6 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px dashed #e5e7eb' }}>
          <Repeat className="w-8 h-8 mx-auto mb-2" style={{ color: '#d1d5db' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>Sin hábitos registrados en Hub</p>
          <p className="text-xs mt-1" style={{ color: '#d1d5db' }}>{athleteName ?? athleteEmail} no tiene hábitos configurados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-brand p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
          <Repeat className="w-4 h-4" style={{ color: '#10b981' }} />
        </div>
        <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Hábitos</span>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-1" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
          <Wifi className="w-3 h-3" />
          Hub
        </div>
        <button
          onClick={refetch}
          className="ml-auto p-1 rounded-lg hover:bg-gray-100 transition-colors"
          title="Actualizar desde Hub"
        >
          <RefreshCw className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
        </button>
      </div>

      {(data?.sleep_avg_hours || data?.hydration_avg_liters || summary) && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {data?.sleep_avg_hours != null && (
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#eef2ff', border: '1px solid #e0e7ff' }}>
              <Moon className="w-4 h-4 mx-auto mb-1" style={{ color: '#6366f1' }} />
              <div className="text-base font-bold" style={{ color: '#4338ca' }}>{data.sleep_avg_hours.toFixed(1)}<span className="text-xs font-normal ml-0.5" style={{ color: '#818cf8' }}>h</span></div>
              <div className="text-xs mt-0.5" style={{ color: '#818cf8' }}>Sueño prom.</div>
            </div>
          )}
          {data?.hydration_avg_liters != null && (
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
              <Droplets className="w-4 h-4 mx-auto mb-1" style={{ color: '#0ea5e9' }} />
              <div className="text-base font-bold" style={{ color: '#0284c7' }}>{data.hydration_avg_liters.toFixed(1)}<span className="text-xs font-normal ml-0.5" style={{ color: '#38bdf8' }}>L</span></div>
              <div className="text-xs mt-0.5" style={{ color: '#38bdf8' }}>Hidratación prom.</div>
            </div>
          )}
          {summary?.avg_compliance_pct != null && (
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <Flame className="w-4 h-4 mx-auto mb-1" style={{ color: '#10b981' }} />
              <div className="text-base font-bold" style={{ color: '#059669' }}>{Math.round(summary.avg_compliance_pct)}<span className="text-xs font-normal ml-0.5" style={{ color: '#34d399' }}>%</span></div>
              <div className="text-xs mt-0.5" style={{ color: '#34d399' }}>Cumplimiento</div>
            </div>
          )}
        </div>
      )}

      {habits.length > 0 && (
        <div className="space-y-2">
          {habits.map((habit, i) => {
            const cfg = CATEGORY_CONFIG[habit.category ?? 'other'] ?? CATEGORY_CONFIG.other;
            return (
              <div
                key={habit.id ?? i}
                className="rounded-xl p-3 flex items-center gap-3"
                style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: cfg.bg }}
                >
                  <Repeat className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate" style={{ color: '#1f2937' }}>
                      {habit.name_es ?? habit.name ?? 'Hábito'}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                    {habit.active === false && (
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#d1d5db' }} />
                    )}
                    {habit.active === true && (
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#10b981' }} />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    {habit.compliance_pct != null && (
                      <div className="flex-1">
                        <ComplianceBar pct={habit.compliance_pct} />
                      </div>
                    )}
                    {habit.current_streak != null && habit.current_streak > 0 && (
                      <span className="text-xs flex-shrink-0 flex items-center gap-0.5" style={{ color: '#f59e0b' }}>
                        <Flame className="w-3 h-3" />
                        {habit.current_streak}d
                      </span>
                    )}
                    {habit.compliance_pct != null && (
                      <span className="text-xs flex-shrink-0 font-medium" style={{ color: habit.compliance_pct >= 80 ? '#10b981' : habit.compliance_pct >= 50 ? '#f59e0b' : '#ef4444' }}>
                        {Math.round(habit.compliance_pct)}%
                      </span>
                    )}
                  </div>
                  {habit.target_value != null && (
                    <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                      Meta: {habit.target_value} {habit.target_unit ?? ''} · {habit.frequency ?? 'diario'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
