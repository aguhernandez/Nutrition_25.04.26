import { Scale, Ruler, Percent, Heart, RefreshCw, Wifi, WifiOff, Activity, Zap, Wind } from 'lucide-react';
import { useHubBiologicalPassport } from '../../hooks/useHubData';

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
}: {
  label: string;
  value: string | number | undefined | null;
  unit?: string;
  color: string;
  icon: React.ElementType;
}) {
  if (value === undefined || value === null) return null;
  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-1"
      style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-0.5" style={{ backgroundColor: `${color}18` }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div className="text-base font-bold" style={{ color: '#1f2937' }}>
        {value}
        {unit && <span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>{unit}</span>}
      </div>
      <div className="text-xs" style={{ color: '#9ca3af' }}>{label}</div>
    </div>
  );
}

export default function HubBiologicalPassport({ athleteEmail, athleteName }: Props) {
  const { data, loading, error, refetch } = useHubBiologicalPassport(athleteEmail);

  const header = (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
        <Activity className="w-4 h-4" style={{ color: '#2563eb' }} />
      </div>
      <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Pasaporte Biologico</span>
      <div
        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-1"
        style={{ backgroundColor: error ? '#fef2f2' : '#f0fdf4', color: error ? '#b91c1c' : '#15803d' }}
      >
        {error ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
        Hub
      </div>
      <button
        onClick={refetch}
        className="ml-auto p-1 rounded-lg hover:bg-gray-100 transition-colors"
        title="Actualizar desde Hub"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} style={{ color: '#9ca3af' }} />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="card-brand p-5">
        {header}
        <div className="flex items-center justify-center py-8">
          <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#fdda36', borderTopColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-brand p-5">
        {header}
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
          <p className="text-sm" style={{ color: '#b91c1c' }}>No se pudo cargar el Hub</p>
          <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{error}</p>
        </div>
      </div>
    );
  }

  const hasData = data && Object.keys(data).length > 0 && (
    data.vo2max != null || data.weight_kg != null || data.body_fat_percent != null
  );

  if (!hasData) {
    return (
      <div className="card-brand p-5">
        {header}
        <div className="text-center py-6 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px dashed #e5e7eb' }}>
          <Activity className="w-8 h-8 mx-auto mb-2" style={{ color: '#d1d5db' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>Sin pasaporte biologico en Hub</p>
          <p className="text-xs mt-1" style={{ color: '#d1d5db' }}>
            {athleteName ?? athleteEmail} no tiene mediciones registradas
          </p>
        </div>
      </div>
    );
  }

  const hasPerf = data.vo2max != null || data.ftp_watts != null || data.lt1_hr != null || data.lt2_hr != null;
  const hasBody = data.weight_kg != null || data.height_cm != null || data.body_fat_percent != null || data.muscle_mass_kg != null;

  const bmi = data.weight_kg && data.height_cm
    ? (data.weight_kg / ((data.height_cm / 100) ** 2)).toFixed(1)
    : null;

  return (
    <div className="card-brand p-5">
      {header}

      {/* Meta: date, source, status */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {data.measurement_date && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            {new Date(data.measurement_date + 'T12:00:00').toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
        {data.athlete_level && (
          <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
            {data.athlete_level}
          </span>
        )}
        {data.source && (
          <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: '#f9fafb', color: '#6b7280' }}>
            {data.source.replace(/_/g, ' ')}
          </span>
        )}
        {data.status && (
          <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: data.status === 'active' ? '#f0fdf4' : '#fef3c7', color: data.status === 'active' ? '#15803d' : '#b45309' }}>
            {data.status}
          </span>
        )}
      </div>

      {/* Performance data */}
      {hasPerf && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>
            Rendimiento
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            <StatCard label="VO2max" value={data.vo2max} unit="ml/kg/min" color="#2563eb" icon={Wind} />
            <StatCard label="FTP" value={data.ftp_watts} unit="W" color="#f59e0b" icon={Zap} />
            <StatCard label="FC LT1" value={data.lt1_hr} unit="bpm" color="#10b981" icon={Heart} />
            <StatCard label="FC LT2" value={data.lt2_hr} unit="bpm" color="#ef4444" icon={Heart} />
            <StatCard label="Ritmo umbral" value={data.running_threshold_pace} unit="km/h" color="#8b5cf6" icon={Activity} />
            <StatCard label="Potencia critica" value={data.critical_power} unit="W" color="#f97316" icon={Zap} />
          </div>
        </div>
      )}

      {/* Body composition */}
      {hasBody && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6b7280' }}>
            Composicion corporal
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            <StatCard label="Peso" value={data.weight_kg} unit="kg" color="#3b82f6" icon={Scale} />
            <StatCard label="Talla" value={data.height_cm} unit="cm" color="#6b7280" icon={Ruler} />
            <StatCard label="% Grasa" value={data.body_fat_percent != null ? Number(data.body_fat_percent).toFixed(1) : null} unit="%" color="#f59e0b" icon={Percent} />
            <StatCard label="Masa muscular" value={data.muscle_mass_kg != null ? Number(data.muscle_mass_kg).toFixed(1) : null} unit="kg" color="#10b981" icon={Activity} />
            <StatCard label="Masa magra" value={data.lean_mass_kg != null ? Number(data.lean_mass_kg).toFixed(1) : null} unit="kg" color="#06b6d4" icon={Activity} />
            <StatCard label="Masa osea" value={data.bone_mass_kg != null ? Number(data.bone_mass_kg).toFixed(1) : null} unit="kg" color="#8b5cf6" icon={Activity} />
            <StatCard label="IMC" value={bmi} color="#6b7280" icon={Scale} />
            <StatCard label="Sum pliegues x6" value={data.skinfold_sum_6} unit="mm" color="#f97316" icon={Activity} />
          </div>
        </div>
      )}

      {data.notes && (
        <div className="mt-4 rounded-xl px-3 py-2" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#6b7280' }}>Notas</p>
          <p className="text-sm" style={{ color: '#374151' }}>{data.notes}</p>
        </div>
      )}
    </div>
  );
}
