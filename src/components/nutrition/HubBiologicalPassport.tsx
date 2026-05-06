import { Scale, Ruler, Percent, Heart, TrendingDown, TrendingUp, RefreshCw, Wifi, WifiOff, Activity } from 'lucide-react';
import { useHubAnthropometry } from '../../hooks/useHubData';

interface Props {
  athleteEmail: string;
  athleteName?: string;
}

function StatCard({
  label,
  value,
  unit,
  color,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number | undefined;
  unit?: string;
  color: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | null;
}) {
  if (value === undefined || value === null) return null;
  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-1"
      style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}
    >
      <div className="flex items-center justify-between">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" style={{ color: '#10b981' }} />}
        {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />}
      </div>
      <div className="text-base font-bold" style={{ color: '#1f2937' }}>
        {value}
        {unit && <span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>{unit}</span>}
      </div>
      <div className="text-xs" style={{ color: '#9ca3af' }}>{label}</div>
    </div>
  );
}

function KerrTrendChart({ history }: { history: Array<{ date: string; sum_skinfolds?: number; z_score?: number }> }) {
  if (!history || history.length < 2) return null;

  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const values = sorted.map((h) => h.sum_skinfolds ?? 0).filter((v) => v > 0);
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 200;
  const height = 48;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  });

  const isImproving = values[values.length - 1] <= values[0];

  return (
    <div className="mt-3 pt-3 border-t" style={{ borderColor: '#f3f4f6' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: '#6b7280' }}>
          Kerr Skinfold Trend ({sorted.length} measurements)
        </span>
        {isImproving ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
            Improving
          </span>
        ) : (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            Watch
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: '48px' }}>
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke={isImproving ? '#10b981' : '#f59e0b'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => {
          const [x, y] = p.split(',').map(Number);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill={isImproving ? '#10b981' : '#f59e0b'}
            />
          );
        })}
      </svg>
      <div className="flex justify-between mt-1">
        <span className="text-xs" style={{ color: '#d1d5db' }}>
          {new Date(sorted[0].date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
        </span>
        <span className="text-xs" style={{ color: '#d1d5db' }}>
          {new Date(sorted[sorted.length - 1].date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}

export default function HubBiologicalPassport({ athleteEmail, athleteName }: Props) {
  const { data, loading, error, refetch } = useHubAnthropometry(athleteEmail);

  if (loading) {
    return (
      <div className="card-brand p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
            <Activity className="w-4 h-4" style={{ color: '#2563eb' }} />
          </div>
          <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Biological Passport</span>
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-1"
            style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}
          >
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
            <Activity className="w-4 h-4" style={{ color: '#b91c1c' }} />
          </div>
          <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Biological Passport</span>
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-1"
            style={{ backgroundColor: '#fef2f2', color: '#b91c1c' }}
          >
            <WifiOff className="w-3 h-3" />
            Hub offline
          </div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
          <p className="text-sm" style={{ color: '#b91c1c' }}>Could not load Hub data</p>
          <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{error}</p>
          <button
            onClick={refetch}
            className="mt-3 flex items-center gap-1.5 mx-auto text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const bc = data?.latest_body_composition;
  const bio = data?.bioimpedance_history?.[0];
  const kerrHistory = data?.kerr_history ?? [];

  if (!bc && !bio && kerrHistory.length === 0) {
    return (
      <div className="card-brand p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
            <Activity className="w-4 h-4" style={{ color: '#2563eb' }} />
          </div>
          <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Biological Passport</span>
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-1"
            style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}
          >
            <Wifi className="w-3 h-3" />
            Hub
          </div>
        </div>
        <div className="text-center py-6 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px dashed #e5e7eb' }}>
          <Activity className="w-8 h-8 mx-auto mb-2" style={{ color: '#d1d5db' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>No anthropometry data in Hub yet</p>
          <p className="text-xs mt-1" style={{ color: '#d1d5db' }}>
            {athleteName ?? athleteEmail} has no measurements recorded
          </p>
        </div>
      </div>
    );
  }

  const measuredAt = bc?.measured_at ?? bio?.date;

  return (
    <div className="card-brand p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
          <Activity className="w-4 h-4" style={{ color: '#2563eb' }} />
        </div>
        <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Biological Passport</span>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-1"
          style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}
        >
          <Wifi className="w-3 h-3" />
          Hub
        </div>
        {measuredAt && (
          <span className="ml-auto text-xs" style={{ color: '#9ca3af' }}>
            {new Date(measuredAt + (measuredAt.includes('T') ? '' : 'T12:00:00')).toLocaleDateString('en', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        )}
        <button
          onClick={refetch}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          title="Refresh from Hub"
        >
          <RefreshCw className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        <StatCard
          label="Body Weight"
          value={bc?.weight_kg ?? bio?.weight_kg}
          unit="kg"
          color="#3b82f6"
          icon={Scale}
        />
        <StatCard
          label="Height"
          value={bc?.height_cm}
          unit="cm"
          color="#6b7280"
          icon={Ruler}
        />
        <StatCard
          label="Body Fat"
          value={bc?.body_fat_pct ?? bio?.body_fat_pct}
          unit="%"
          color="#f59e0b"
          icon={Percent}
          trend={
            (bc?.body_fat_pct ?? bio?.body_fat_pct) !== undefined &&
            data?.bioimpedance_history &&
            data.bioimpedance_history.length > 1
              ? (bc?.body_fat_pct ?? bio?.body_fat_pct)! <
                (data.bioimpedance_history[1]?.body_fat_pct ?? Infinity)
                ? 'down'
                : 'up'
              : null
          }
        />
        <StatCard
          label="Muscle Mass"
          value={bc?.muscle_mass_kg ?? bio?.muscle_mass_kg}
          unit="kg"
          color="#10b981"
          icon={Activity}
        />
        <StatCard
          label="BMI"
          value={bc?.bmi !== undefined ? bc.bmi.toFixed(1) : undefined}
          color="#8b5cf6"
          icon={Heart}
        />
        <StatCard
          label="Visceral Fat"
          value={bc?.visceral_fat ?? bio?.visceral_fat}
          color="#ef4444"
          icon={Heart}
        />
        {bc?.kerr_sum !== undefined && (
          <StatCard
            label="Kerr Sum (skinfolds)"
            value={bc.kerr_sum.toFixed(1)}
            unit="mm"
            color="#f97316"
            icon={Activity}
          />
        )}
        {bc?.z_score !== undefined && (
          <StatCard
            label="Z-Score"
            value={bc.z_score.toFixed(2)}
            color="#2563eb"
            icon={TrendingDown}
          />
        )}
      </div>

      {kerrHistory.length > 1 && <KerrTrendChart history={kerrHistory} />}

      {data?.bioimpedance_history && data.bioimpedance_history.length > 1 && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: '#f3f4f6' }}>
          <p className="text-xs font-medium mb-2" style={{ color: '#6b7280' }}>
            Bioimpedance History ({data.bioimpedance_history.length} records)
          </p>
          <div className="space-y-1.5">
            {data.bioimpedance_history.slice(0, 3).map((rec, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg"
                style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}
              >
                <span className="text-xs" style={{ color: '#9ca3af', minWidth: '70px' }}>
                  {new Date(rec.date + 'T12:00:00').toLocaleDateString('en', { day: 'numeric', month: 'short' })}
                </span>
                <span className="text-xs font-medium" style={{ color: '#1f2937' }}>{rec.weight_kg}kg</span>
                {rec.body_fat_pct !== undefined && (
                  <span className="text-xs" style={{ color: '#f59e0b' }}>{rec.body_fat_pct}% fat</span>
                )}
                {rec.muscle_mass_kg !== undefined && (
                  <span className="text-xs" style={{ color: '#10b981' }}>{rec.muscle_mass_kg}kg muscle</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
