import { RefreshCw, Wifi, WifiOff, Heart, Moon, Zap, Brain, Activity, Droplets } from 'lucide-react';
import { useHubWellness } from '../../hooks/useHubData';

interface Props {
  athleteEmail: string;
  athleteName?: string;
}

const TODAY = new Date().toISOString().slice(0, 10);
const THIRTY_DAYS_AGO = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
})();

const URINE_COLORS: Record<number, { hex: string; label: string; status: 'ok' | 'warning' | 'bad' }> = {
  1: { hex: '#fef9c3', label: 'Muy clara', status: 'ok' },
  2: { hex: '#fef08a', label: 'Clara', status: 'ok' },
  3: { hex: '#fde047', label: 'Normal', status: 'ok' },
  4: { hex: '#facc15', label: 'Amarilla', status: 'ok' },
  5: { hex: '#eab308', label: 'Oscura', status: 'warning' },
  6: { hex: '#ca8a04', label: 'Muy oscura', status: 'warning' },
  7: { hex: '#a16207', label: 'Naranja', status: 'bad' },
  8: { hex: '#92400e', label: 'Marrón', status: 'bad' },
};

const STATUS_COLOR = { ok: '#10b981', warning: '#f59e0b', bad: '#ef4444' };

function ScoreCircle({ value, max = 10, label, color }: { value?: number; max?: number; label: string; color: string }) {
  if (value == null) return null;
  const pct = (value / max) * 100;
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: 48, height: 48 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="24" cy="24" r={r} fill="none" stroke="#f3f4f6" strokeWidth="4" />
          <circle
            cx="24" cy="24" r={r}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold" style={{ color }}>{value.toFixed(1)}</span>
        </div>
      </div>
      <span className="text-xs text-center leading-tight" style={{ color: '#9ca3af', maxWidth: 52 }}>{label}</span>
    </div>
  );
}

function WellnessScore100({ value }: { value: number }) {
  const color = value >= 75 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444';
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: 72, height: 72 }}>
        <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="36" cy="36" r={r} fill="none" stroke="#f3f4f6" strokeWidth="5" />
          <circle
            cx="36" cy="36" r={r}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-lg leading-none" style={{ color }}>{Math.round(value)}</span>
          <span className="text-xs leading-none" style={{ color: '#9ca3af' }}>/100</span>
        </div>
      </div>
      <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Wellness score</span>
    </div>
  );
}

function UrineColorWidget({ value }: { value: number }) {
  const cfg = URINE_COLORS[Math.round(value)] ?? URINE_COLORS[4];
  const statusColor = STATUS_COLOR[cfg.status];
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {Object.entries(URINE_COLORS).map(([k, c]) => (
          <div
            key={k}
            className="rounded-full transition-all"
            style={{
              width: Math.round(value) === Number(k) ? 22 : 14,
              height: Math.round(value) === Number(k) ? 22 : 14,
              backgroundColor: c.hex,
              border: Math.round(value) === Number(k) ? `2px solid ${statusColor}` : '2px solid transparent',
              opacity: Math.round(value) === Number(k) ? 1 : 0.45,
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-1">
        <Droplets className="w-3 h-3" style={{ color: statusColor }} />
        <span className="text-xs font-medium" style={{ color: statusColor }}>{cfg.label}</span>
      </div>
      <span className="text-xs" style={{ color: '#9ca3af' }}>Hidratación (orina)</span>
    </div>
  );
}

function TrendSparkline({ entries, field }: { entries: Array<Record<string, unknown>>; field: string }) {
  const values = entries
    .map((e) => typeof e[field] === 'number' ? (e[field] as number) : null)
    .filter((v): v is number => v !== null);
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 100, h = 28;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 6) - 3;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 28 }}>
      <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HubWellnessCard({ athleteEmail, athleteName }: Props) {
  const { data, loading, error, refetch } = useHubWellness(athleteEmail, THIRTY_DAYS_AGO, TODAY);

  if (loading) {
    return (
      <div className="card-brand p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fdf4ff' }}>
            <Heart className="w-4 h-4" style={{ color: '#ec4899' }} />
          </div>
          <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Wellness Questionary</span>
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
            <Heart className="w-4 h-4" style={{ color: '#b91c1c' }} />
          </div>
          <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Wellness Questionary</span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-1" style={{ backgroundColor: '#fef2f2', color: '#b91c1c' }}>
            <WifiOff className="w-3 h-3" />
            Hub offline
          </div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
          <p className="text-sm" style={{ color: '#b91c1c' }}>No se pudieron cargar los datos de wellness</p>
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

  const latest = data?.latest;
  const avgs = data?.averages;
  const entries = data?.entries ?? [];

  if (!latest && !avgs && entries.length === 0) {
    return (
      <div className="card-brand p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fdf4ff' }}>
            <Heart className="w-4 h-4" style={{ color: '#ec4899' }} />
          </div>
          <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Wellness Questionary</span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-1" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
            <Wifi className="w-3 h-3" />
            Hub
          </div>
        </div>
        <div className="text-center py-6 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px dashed #e5e7eb' }}>
          <Heart className="w-8 h-8 mx-auto mb-2" style={{ color: '#d1d5db' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>Sin datos de wellness en Hub</p>
          <p className="text-xs mt-1" style={{ color: '#d1d5db' }}>{athleteName ?? athleteEmail} no tiene cuestionarios completados</p>
        </div>
      </div>
    );
  }

  const ref = avgs ?? latest;
  const showScore100 = ref?.wellness_score_100 != null;
  const showUrine = ref?.urine_color != null;

  return (
    <div className="card-brand p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fdf4ff' }}>
          <Heart className="w-4 h-4" style={{ color: '#ec4899' }} />
        </div>
        <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Wellness Questionary</span>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-1" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
          <Wifi className="w-3 h-3" />
          Hub
        </div>
        {latest?.date && (
          <span className="ml-auto text-xs" style={{ color: '#9ca3af' }}>
            Último: {new Date(latest.date + 'T12:00:00').toLocaleDateString('es', { day: 'numeric', month: 'short' })}
          </span>
        )}
        <button
          onClick={refetch}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          title="Actualizar desde Hub"
        >
          <RefreshCw className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
        </button>
      </div>

      {avgs && entries.length > 1 && (
        <p className="text-xs mb-3" style={{ color: '#6b7280' }}>
          Promedios últimos 30 días ({entries.length} registros)
        </p>
      )}

      {(showScore100 || showUrine) && (
        <div className="flex items-start justify-around gap-4 mb-5 p-4 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
          {showScore100 && <WellnessScore100 value={ref!.wellness_score_100!} />}
          {showUrine && <UrineColorWidget value={ref!.urine_color!} />}
        </div>
      )}

      <div className="flex items-start justify-around flex-wrap gap-3 mb-4">
        <ScoreCircle value={ref?.fatigue} label="Fatiga" color="#ef4444" />
        <ScoreCircle value={ref?.mood} label="Humor" color="#f59e0b" />
        <ScoreCircle value={ref?.sleep_quality} label="Calidad sueño" color="#6366f1" />
        <ScoreCircle value={ref?.muscle_soreness} label="Dolor musc." color="#f97316" />
        <ScoreCircle value={ref?.motivation} label="Motivación" color="#10b981" />
        <ScoreCircle value={ref?.stress} label="Estrés" color="#ec4899" />
        {!showScore100 && ref?.overall_score != null && (
          <ScoreCircle value={ref.overall_score} label="Score gral." color="#2563eb" />
        )}
      </div>

      {(ref?.sleep_hours != null || ref?.hrv != null || ref?.resting_hr != null) && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {ref?.sleep_hours != null && (
            <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: '#eef2ff', border: '1px solid #e0e7ff' }}>
              <Moon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: '#6366f1' }} />
              <div className="text-sm font-bold" style={{ color: '#4338ca' }}>
                {ref.sleep_hours.toFixed(1)}<span className="text-xs font-normal" style={{ color: '#818cf8' }}>h</span>
              </div>
              <div className="text-xs" style={{ color: '#818cf8' }}>Sueño</div>
            </div>
          )}
          {ref?.hrv != null && (
            <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <Activity className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: '#10b981' }} />
              <div className="text-sm font-bold" style={{ color: '#059669' }}>
                {Math.round(ref.hrv)}<span className="text-xs font-normal" style={{ color: '#34d399' }}>ms</span>
              </div>
              <div className="text-xs" style={{ color: '#34d399' }}>HRV</div>
            </div>
          )}
          {ref?.resting_hr != null && (
            <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3' }}>
              <Heart className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: '#f43f5e' }} />
              <div className="text-sm font-bold" style={{ color: '#e11d48' }}>
                {Math.round(ref.resting_hr)}<span className="text-xs font-normal" style={{ color: '#fb7185' }}>bpm</span>
              </div>
              <div className="text-xs" style={{ color: '#fb7185' }}>FC reposo</div>
            </div>
          )}
        </div>
      )}

      {entries.length > 2 && (
        <div className="pt-3 border-t" style={{ borderColor: '#f3f4f6' }}>
          <p className="text-xs font-medium mb-2" style={{ color: '#6b7280' }}>Tendencia motivación (30d)</p>
          <TrendSparkline entries={entries as Array<Record<string, unknown>>} field="motivation" />
        </div>
      )}

      {latest?.notes && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: '#f3f4f6' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Brain className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
            <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Nota del atleta</span>
          </div>
          <p className="text-xs italic" style={{ color: '#9ca3af' }}>{latest.notes}</p>
        </div>
      )}

      {!avgs && latest && (
        <div className="mt-3 pt-3 border-t flex items-center gap-2" style={{ borderColor: '#f3f4f6' }}>
          <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#f59e0b' }} />
          <p className="text-xs" style={{ color: '#9ca3af' }}>Solo se encontró el último registro (sin historial de 30 días)</p>
        </div>
      )}
    </div>
  );
}
