import { Activity, Bike, Calendar, ChevronDown, ChevronUp, Clock, Flame, Heart, MapPin, Mountain, Route, Tag, X, Zap, Dumbbell } from 'lucide-react';

export interface SessionPoint {
  timeMin: number;
  value: number;
}

export interface SessionInfo {
  title: string;
  type: string;
  date?: string;
  durationMin?: number | null;
  distanceKm?: number | null;
  calories?: number | null;
  source: string;
  avgHr?: number | null;
  maxHr?: number | null;
  power?: number | null;
  avgPace?: number | null;
  avgSpeed?: number | null;
  elevation?: number | null;
  tss?: number | null;
  points: SessionPoint[];
}

interface Props {
  session: SessionInfo;
  onClose: () => void;
}

const TYPE_ICON: Record<string, React.ElementType> = {
  run: Activity,
  runnning: Activity,
  bike: Bike,
  cycling: Bike,
  swim: Activity,
  strength: Dumbbell,
  gym: Dumbbell,
  triathlon: Zap,
  brick: Zap,
  other: Activity,
};

const SOURCE_STYLE: Record<string, { label: string; bg: string; color: string; icon: React.ElementType }> = {
  strava: { label: 'Strava', bg: '#fff7ed', color: '#ea580c', icon: Route },
  hub: { label: 'Hub', bg: '#eff6ff', color: '#2563eb', icon: Activity },
  asciende_hub: { label: 'Hub', bg: '#eff6ff', color: '#2563eb', icon: Activity },
  gym: { label: 'Gym', bg: '#f5f3ff', color: '#7c3aed', icon: Dumbbell },
  asciende_gym: { label: 'Gym', bg: '#f5f3ff', color: '#7c3aed', icon: Dumbbell },
  garmin: { label: 'Garmin', bg: '#f0fdf4', color: '#15803d', icon: Activity },
  local: { label: 'Manual', bg: '#f3f4f6', color: '#6b7280', icon: Activity },
  gps: { label: 'GPS', bg: '#eff6ff', color: '#2563eb', icon: MapPin },
};

function formatTitleDate(date?: string) {
  if (!date) return null;
  return new Date(date + 'T12:00:00').toLocaleDateString('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDuration(minutes: number) {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}` : `${Math.round(minutes)}m`;
}

function formatPace(minPerKm: number) {
  const m = Math.floor(minPerKm);
  const s = Math.round((minPerKm - m) * 60);
  return `${m}:${String(s).padStart(2, '0')} /km`;
}

export default function SessionDetailModal({ session, onClose }: Props) {
  const srcKey = session.source.toLowerCase().replace(/\s+/g, '_');
  const src = SOURCE_STYLE[srcKey] ?? { label: session.source, bg: '#f3f4f6', color: '#6b7280', icon: Tag };
  const SrcIcon = src.icon;
  const TypeIcon = TYPE_ICON[session.type.toLowerCase()] ?? Activity;

  const hasChart = session.points.length > 1;

  const metaItems: { label: string; value: string; icon: React.ElementType }[] = [];
  if (session.durationMin != null) metaItems.push({ label: 'Duration', value: formatDuration(session.durationMin), icon: Clock });
  if (session.distanceKm != null && session.distanceKm > 0) metaItems.push({ label: 'Distance', value: `${session.distanceKm.toFixed(1)} km`, icon: MapPin });
  if (session.calories != null) metaItems.push({ label: 'Calories', value: `${Math.round(session.calories)} kcal`, icon: Flame });
  if (session.avgHr != null) metaItems.push({ label: 'Avg HR', value: `${Math.round(session.avgHr)} bpm`, icon: Heart });
  if (session.elevation != null && session.elevation > 0) metaItems.push({ label: 'Elevation', value: `${Math.round(session.elevation)} m`, icon: Mountain });
  if (session.avgPace != null) metaItems.push({ label: 'Avg pace', value: formatPace(session.avgPace), icon: Activity });
  if (session.avgSpeed != null) metaItems.push({ label: 'Avg speed', value: `${session.avgSpeed.toFixed(1)} km/h`, icon: Activity });
  if (session.power != null) metaItems.push({ label: 'Power', value: `${Math.round(session.power)} W`, icon: Zap });
  if (session.tss != null) metaItems.push({ label: 'TSS', value: String(Math.round(session.tss)), icon: Zap });

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-5 pb-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#514163' }}>
            <TypeIcon className="w-5 h-5" style={{ color: '#fdda36' }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-base font-bold truncate" style={{ color: '#1f2937' }}>{session.title}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {session.date && (
                <span className="flex items-center gap-1 text-xs" style={{ color: '#9ca3af' }}>
                  <Calendar className="w-3 h-3" />
                  {formatTitleDate(session.date)}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={{ backgroundColor: src.bg, color: src.color }}>
                <SrcIcon className="w-3 h-3" />
                {src.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-gray-100"
            style={{ backgroundColor: '#f3f4f6' }}
          >
            <X className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
        </div>

        {/* Intensity chart */}
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <ChevronUp className="w-3.5 h-3.5" style={{ color: '#f97316' }} />
            <span className="text-xs font-body font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>Intensity over time</span>
          </div>
          {hasChart ? (
            <svg viewBox="0 0 300 80" className="w-full" style={{ height: '80px' }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="session-intensity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {(() => {
                const pts = session.points;
                const maxV = Math.max(...pts.map((p) => p.value), 1);
                const minV = Math.min(...pts.map((p) => p.value), 0);
                const range = maxV - minV || 1;
                const maxT = Math.max(...pts.map((p) => p.timeMin), 1);
                const toX = (t: number) => (t / maxT) * 300;
                const toY = (v: number) => 72 - ((v - minV) / range) * 60;
                const line = pts.map((p) => `${toX(p.timeMin).toFixed(1)},${toY(p.value).toFixed(1)}`).join(' ');
                const area = `0,80 ${line} 300,80`;
                return (
                  <>
                    <polygon points={area} fill="url(#session-intensity)" />
                    <polyline points={line} fill="none" stroke="#f97316" strokeWidth="2" strokeLinejoin="round" />
                  </>
                );
              })()}
            </svg>
          ) : (
            <div className="flex items-center gap-2 py-3 rounded-xl justify-center" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: '#d1d5db' }} />
              <span className="text-xs" style={{ color: '#9ca3af' }}>No stream data available for this session</span>
            </div>
          )}
        </div>

        {/* Metadata grid */}
        <div className="p-5 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {metaItems.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl p-3" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon className="w-3 h-3" style={{ color: '#9ca3af' }} />
                  <span className="text-[10px] uppercase tracking-wide font-body" style={{ color: '#9ca3af' }}>{label}</span>
                </div>
                <span className="text-sm font-semibold font-body" style={{ color: '#1f2937' }}>{value}</span>
              </div>
            ))}
          </div>
          {metaItems.length === 0 && (
            <p className="text-center text-xs py-3" style={{ color: '#9ca3af' }}>No additional metrics recorded</p>
          )}
        </div>
      </div>
    </div>
  );
}
