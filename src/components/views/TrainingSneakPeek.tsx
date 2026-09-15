import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Activity, Clock, Zap, Dumbbell, Wifi, WifiOff, MapPin, Flame } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useHubTrainingSchedule, useHubEnduranceData, useHubTdee, useHubActivities } from '../../hooks/useHubData';
import type { HubTrainingDay, HubEnduranceActivity, HubActivity } from '../../lib/hubApi';
import SessionDetailModal, { type SessionInfo, type SessionPoint } from './SessionDetailModal';

interface TrainingSession {
  id: string;
  athlete_id: string;
  session_date: string;
  type: string;
  duration_minutes: number;
  distance_km: number | null;
  intensity: string;
  tss: number | null;
  title: string;
  notes: string;
  source: string;
}

interface TrainingWeek {
  id: string;
  athlete_id: string;
  week_start: string;
  planned_hours: number;
  completed_hours: number;
  phase: string;
  notes: string;
}

interface Props {
  athleteId: string;
  athleteEmail?: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  run: { label: 'Run', color: '#ef4444', bg: '#fef2f2', icon: Activity },
  bike: { label: 'Bike', color: '#3b82f6', bg: '#eff6ff', icon: Activity },
  swim: { label: 'Swim', color: '#06b6d4', bg: '#ecfeff', icon: Activity },
  strength: { label: 'Strength', color: '#8b5cf6', bg: '#f5f3ff', icon: Dumbbell },
  triathlon: { label: 'Tri', color: '#f59e0b', bg: '#fef3c7', icon: Zap },
  brick: { label: 'Brick', color: '#f97316', bg: '#fff7ed', icon: Zap },
  other: { label: 'Other', color: '#6b7280', bg: '#f3f4f6', icon: Activity },
};

const INTENSITY_COLOR: Record<string, string> = {
  easy: '#10b981',
  moderate: '#f59e0b',
  hard: '#ef4444',
  race: '#7c3aed',
};

const PHASE_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  base: { label: 'Base', bg: '#f0fdf4', color: '#15803d' },
  build: { label: 'Build', bg: '#fef9c3', color: '#b45309' },
  peak: { label: 'Peak', bg: '#eff6ff', color: '#1d4ed8' },
  taper: { label: 'Taper', bg: '#f5f3ff', color: '#7c3aed' },
  recovery: { label: 'Recovery', bg: '#f3f4f6', color: '#6b7280' },
};

const DIFFICULTY_LEVEL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  easy: { label: 'Easy', color: '#10b981', bg: '#f0fdf4' },
  moderate: { label: 'Moderate', color: '#f59e0b', bg: '#fef3c7' },
  hard: { label: 'Hard', color: '#ef4444', bg: '#fef2f2' },
  very_hard: { label: 'Very Hard', color: '#7c3aed', bg: '#f5f3ff' },
};

const INTENSITY_SEMAPHORE: Record<string, { hex: string; bg: string; label: string }> = {
  green: { hex: '#16a34a', bg: '#dcfce7', label: 'Easy' },
  yellow: { hex: '#ca8a04', bg: '#fef9c3', label: 'Moderate' },
  red: { hex: '#dc2626', bg: '#fee2e2', label: 'Hard' },
};

function getIntensityColor(hd: { intensity_color?: string; difficulty_color?: string; difficulty_level?: string; workout?: { intensity_color?: string; difficulty?: string | null } }): { hex: string; bg: string; label: string } | null {
  const ic = hd.intensity_color ?? hd.workout?.intensity_color;
  if (ic && INTENSITY_SEMAPHORE[ic]) return INTENSITY_SEMAPHORE[ic];
  if (hd.difficulty_color) {
    const lower = hd.difficulty_color.toLowerCase();
    if (INTENSITY_SEMAPHORE[lower]) return INTENSITY_SEMAPHORE[lower];
    return { hex: hd.difficulty_color, bg: `${hd.difficulty_color}22`, label: hd.difficulty_level ?? '' };
  }
  if (hd.difficulty_level) {
    const cfg = DIFFICULTY_LEVEL_CONFIG[hd.difficulty_level];
    if (cfg) return { hex: cfg.color, bg: cfg.bg, label: cfg.label };
  }
  const wd = hd.workout?.difficulty?.toLowerCase();
  if (wd) {
    if (wd === 'hard' || wd === 'high') return INTENSITY_SEMAPHORE.red;
    if (wd === 'moderate' || wd === 'medium') return INTENSITY_SEMAPHORE.yellow;
    if (wd === 'easy' || wd === 'low') return INTENSITY_SEMAPHORE.green;
  }
  return null;
}

function formatDuration(minutes: number) {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}` : `${m}m`;
}

function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function TrainingSneakPeek({ athleteId, athleteEmail }: Props) {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [weeks, setWeeks] = useState<TrainingWeek[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [selectedInfo, setSelectedInfo] = useState<SessionInfo | null>(null);
  const [selectedHubDay, setSelectedHubDay] = useState<HubTrainingDay | null>(null);

  const hubTarget = athleteEmail ?? null;
  const { data: hubData, loading: hubLoading, error: hubError } = useHubTrainingSchedule(hubTarget);

  const enduranceDateFrom = (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10); })();
  const enduranceDateTo = new Date().toISOString().slice(0, 10);
  const { data: enduranceData, loading: enduranceLoading } = useHubEnduranceData(hubTarget, enduranceDateFrom, enduranceDateTo);
  const { data: activitiesData, loading: activitiesLoading } = useHubActivities(hubTarget, enduranceDateFrom, enduranceDateTo);
  const { data: tdeeData } = useHubTdee(hubTarget);

  useEffect(() => {
    if (!athleteId || athleteId.startsWith('demo-')) {
      setLocalLoading(false);
      return;
    }
    loadLocal();
  }, [athleteId]);

  const loadLocal = async () => {
    setLocalLoading(true);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const [sessRes, weekRes] = await Promise.all([
      supabase
        .from('training_sessions')
        .select('*')
        .eq('athlete_id', athleteId)
        .gte('session_date', threeMonthsAgo.toISOString().slice(0, 10))
        .order('session_date', { ascending: false }),
      supabase
        .from('training_weeks')
        .select('*')
        .eq('athlete_id', athleteId)
        .gte('week_start', threeMonthsAgo.toISOString().slice(0, 10))
        .order('week_start', { ascending: false }),
    ]);

    setSessions(sessRes.data ?? []);
    setWeeks(weekRes.data ?? []);
    setLocalLoading(false);
  };

  const hubDaysByDate = (() => {
    const map: Record<string, HubTrainingDay[]> = {};
    const normalizeDate = (v: unknown): string | null => {
      if (typeof v !== 'string') return null;
      return v.replace(/T.*$/, '').slice(0, 10);
    };
    const enduranceActs: HubTrainingDay[] = (
      enduranceData?.activities ??
      enduranceData?.recent_activities ??
      enduranceData?.training_logs ??
      []
    )
      .filter((a) => a.validated !== false)
      .map((a) => ({
        id: a.id,
        date: a.date,
        scheduled_date: a.date,
        session_type: a.activity_type ?? a.sport ?? a.session_type ?? 'other',
        title: a.title ?? a.activity_type ?? a.sport ?? 'Activity',
        status: 'completed' as const,
        estimated_duration_min: a.duration_min ?? a.duration_minutes,
        distance_km: a.distance_km,
        avg_hr: a.avg_hr,
        max_hr: a.max_hr,
        elevation_gain_m: a.elevation_gain_m,
        calories_burned: a.calories_burned,
        avg_pace_min_km: a.avg_pace_min_km,
        avg_speed_kmh: a.avg_speed_kmh,
        estimated_load: a.tss,
        intensity_color: a.intensity_color,
        intensity_label: a.intensity_label,
        source: a.source ?? 'gps',
        notes: a.notes,
      }));

    const gpsActs: HubTrainingDay[] = (activitiesData?.activities ?? []).map((a: HubActivity) => ({
      id: a.id,
      date: a.local_date ?? a.start_time ?? '',
      scheduled_date: a.local_date ?? a.start_time ?? '',
      session_type: a.sport_type ?? 'other',
      title: a.name ?? a.sport_type ?? 'Activity',
      status: 'completed' as const,
      estimated_duration_min: a.duration_seconds ? Math.round(a.duration_seconds / 60) : undefined,
      distance_km: a.distance_meters != null ? a.distance_meters / 1000 : undefined,
      avg_hr: a.average_heartrate ?? undefined,
      max_hr: a.max_heartrate ?? undefined,
      elevation_gain_m: a.elevation_gain_meters != null ? Math.round(a.elevation_gain_meters) : undefined,
      calories_burned: a.calories ?? undefined,
      avg_speed_kmh: a.average_speed_mps != null ? a.average_speed_mps * 3.6 : undefined,
      intensity_color: 'green',
      intensity_label: 'Completed',
      source: a.source ?? 'gps',
    }));

    const all = [
      ...(hubData?.scheduled_workouts ?? []),
      ...(hubData?.workouts ?? []),
      ...(hubData?.completed_training_logs ?? []),
      ...(hubData?.logs ?? []),
      ...(hubData?.free_activities ?? []),
      ...(hubData?.activities ?? []),
      ...(hubData?.training_activities ?? []),
      ...(hubData?.gps_activities ?? []),
      ...enduranceActs,
      ...gpsActs,
    ];
    const seen = new Set<string>();
    for (const day of all) {
      const key = normalizeDate(day.scheduled_date) ?? normalizeDate(day.date);
      if (!key) continue;
      const uid = day.id ?? `${key}-${day.title ?? day.session_type ?? ''}`;
      if (seen.has(uid)) continue;
      seen.add(uid);
      if (!map[key]) map[key] = [];
      map[key].push(day);
    }
    return map;
  })();

  const sessionsByDate = sessions.reduce<Record<string, TrainingSession[]>>((acc, s) => {
    const k = s.session_date;
    if (!acc[k]) acc[k] = [];
    acc[k].push(s);
    return acc;
  }, {});

  const currentWeek = weeks.find((w) => w.week_start === dateKey(currentWeekStart));
  const weekDays = getWeekDays(currentWeekStart);

  const weekTotal = weekDays.reduce((sum, d) => {
    const daySessions = sessionsByDate[dateKey(d)] ?? [];
    return sum + daySessions.reduce((s, sess) => s + sess.duration_minutes, 0);
  }, 0);

  const prevWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(d);
  };
  const nextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(d);
  };
  const prevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const days: (Date | null)[] = [];
    for (let i = 0; i < startDow; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    while (days.length % 7 !== 0) days.push(null);
    return days;
  };

  const loading = localLoading || hubLoading || enduranceLoading || activitiesLoading;

  const tdeeWs = tdeeData?.weekly_summary;
  const tdeeAvg = tdeeWs?.avg_tdee;
  const tdeeLow = tdeeWs?.avg_tdee_low;
  const tdeeHigh = tdeeWs?.avg_tdee_high;
  const tdeeBmr = tdeeData?.bmr;
  const tdeeNeatFactor = tdeeData?.neat_factor;
  const tdeeTotalEat = tdeeWs?.total_eat;
  const tdeeTrainingDays = tdeeWs?.training_days;
  const tdeeRestDays = tdeeWs?.rest_days;
  const hasTdee = tdeeAvg != null || (tdeeData?.daily && tdeeData.daily.length > 0);

  const hasLocal = sessions.length > 0;
  const hasHub = Object.keys(hubDaysByDate).length > 0;
  const hubConnected = hubTarget && !hubError;
  const today = new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#fdda36', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  const syntheticPoints = (durationMin: number | null | undefined, load: number | null | undefined): SessionPoint[] => {
    if (durationMin && durationMin > 2) {
      const base = load ?? 30;
      return Array.from({ length: Math.min(10, Math.max(4, Math.floor(durationMin / 5))) }, (_, i) => ({
        timeMin: (durationMin / Math.min(10, Math.max(4, Math.floor(durationMin / 5)))) * i,
        value: base + Math.sin(i * 0.9) * 12,
      }));
    }
    return [];
  };

  const hubToSessionInfo = (hd: HubTrainingDay): SessionInfo => ({
    title: hd.workout?.name ?? hd.title ?? hd.session_type ?? 'Training Session',
    type: hd.session_type ?? hd.title ?? 'other',
    date: (hd.scheduled_date ?? hd.date)?.slice(0, 10),
    durationMin: hd.workout?.duration_minutes ?? hd.estimated_duration_min ?? null,
    distanceKm: hd.distance_km ?? null,
    calories: hd.calories_burned ?? null,
    source: (hd.source ?? hd.workout?.id ?? 'hub').replace(/^hub-?$/i, '').toLowerCase() || 'hub',
    avgHr: hd.avg_hr ?? null,
    maxHr: hd.max_hr ?? null,
    power: null,
    avgPace: hd.avg_pace_min_km ?? null,
    avgSpeed: hd.avg_speed_kmh ?? null,
    elevation: hd.elevation_gain_m ?? null,
    tss: hd.estimated_load ?? null,
    points: hd.points && hd.points.length > 1
      ? hd.points
      : syntheticPoints(hd.workout?.duration_minutes ?? hd.estimated_duration_min, hd.estimated_load),
  });

  return (
    <div className="card-brand p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
          <Calendar className="w-4 h-4" style={{ color: '#2563eb' }} />
        </div>
        <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Training Sneak Peek</span>

        {hubTarget && !hubError && (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}
          >
            <Wifi className="w-3 h-3" />
            Hub
          </div>
        )}
        {hubTarget && !hubError && hubData?.summary && hubData.summary.total > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>
            <span style={{ color: '#10b981', fontWeight: 600 }}>{hubData.summary.completed}</span>
            <span>/</span>
            <span style={{ fontWeight: 600, color: '#1f2937' }}>{hubData.summary.total}</span>
            <span>done</span>
            <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold" style={{
              backgroundColor: hubData.summary.completion_rate >= 80 ? '#dcfce7' : hubData.summary.completion_rate >= 50 ? '#fef3c7' : '#fee2e2',
              color: hubData.summary.completion_rate >= 80 ? '#15803d' : hubData.summary.completion_rate >= 50 ? '#b45309' : '#b91c1c',
            }}>
              {hubData.summary.completion_rate}%
            </span>
          </div>
        )}
        {hubTarget && hubError && (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#fef2f2', color: '#b91c1c' }}
            title={hubError}
          >
            <WifiOff className="w-3 h-3" />
            Hub offline
          </div>
        )}

        <div className="ml-auto flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: '#f3f4f6' }}>
          <button
            onClick={() => setView('week')}
            className="px-3 py-1 rounded-lg text-xs font-body font-medium transition-all duration-150"
            style={view === 'week' ? { backgroundColor: '#fdda36', color: '#514163' } : { color: '#6b7280' }}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className="px-3 py-1 rounded-lg text-xs font-body font-medium transition-all duration-150"
            style={view === 'month' ? { backgroundColor: '#fdda36', color: '#514163' } : { color: '#6b7280' }}
          >
            Month
          </button>
        </div>
      </div>

      {view === 'week' ? (
        <>
          <div className="flex items-center justify-between">
            <button onClick={prevWeek} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
            </button>
            <div className="text-center">
              <span className="font-body font-semibold text-sm" style={{ color: '#1f2937' }}>
                {weekDays[0].toLocaleDateString('en', { month: 'short', day: 'numeric' })} –{' '}
                {weekDays[6].toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              {currentWeek && (
                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: PHASE_CONFIG[currentWeek.phase]?.bg ?? '#f3f4f6',
                      color: PHASE_CONFIG[currentWeek.phase]?.color ?? '#6b7280',
                    }}
                  >
                    {PHASE_CONFIG[currentWeek.phase]?.label ?? currentWeek.phase}
                  </span>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>
                    {currentWeek.completed_hours}h / {currentWeek.planned_hours}h planned
                  </span>
                </div>
              )}
            </div>
            <button onClick={nextWeek} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-4 h-4" style={{ color: '#6b7280' }} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAY_LABELS.map((label) => (
              <div key={label} className="text-center text-xs font-body font-medium py-1" style={{ color: '#9ca3af' }}>
                {label}
              </div>
            ))}
            {weekDays.map((day, i) => {
              const key = dateKey(day);
              const daySessions = sessionsByDate[key] ?? [];
              const hubDays = hubDaysByDate[key] ?? [];
              const isToday = isSameDay(day, today);
              const totalMin = daySessions.reduce((s, sess) => s + sess.duration_minutes, 0);
              const hubDayMin = hubDays.reduce((s, d) => s + (d.estimated_duration_min ?? 0), 0);

              return (
                <div
                  key={i}
                  className="rounded-xl p-2 min-h-[80px] flex flex-col gap-1 transition-all"
                  style={{
                    backgroundColor: isToday ? 'rgba(253,218,54,0.08)' : '#f9fafb',
                    border: isToday ? '2px solid rgba(253,218,54,0.5)' : '1px solid #f3f4f6',
                  }}
                >
                  <span
                    className="text-xs font-body font-medium text-center"
                    style={{ color: isToday ? '#514163' : '#6b7280' }}
                  >
                    {day.getDate()}
                  </span>

                  {hubDays.slice(0, 2).map((hd, hi) => {
                    const statusColors: Record<string, { bg: string; dot: string; text: string }> = {
                      completed: { bg: '#f0fdf4', dot: '#10b981', text: '#15803d' },
                      skipped: { bg: '#fef2f2', dot: '#ef4444', text: '#b91c1c' },
                      pending: { bg: '#eff6ff', dot: '#3b82f6', text: '#1d4ed8' },
                    };
                    const sc = hd.status ? statusColors[hd.status] : statusColors.pending;
                    const intensity = getIntensityColor(hd);
                    const bgColor = intensity ? intensity.bg : sc.bg;
                    const dotColor = intensity ? intensity.hex : sc.dot;
                    const textColor = intensity ? intensity.hex : sc.text;
                    const label = hd.workout?.name ?? hd.title ?? hd.session_type ?? (hd.status === 'completed' ? 'Done' : 'Planned');
                    return (
                      <button
                        key={`hub-${hi}`}
                        onClick={() => {
                          setSelectedInfo(hubToSessionInfo(hd));
                          setSelectedHubDay(hd === selectedHubDay ? null : hd);
                        }}
                        className="w-full rounded-lg px-1.5 py-1 flex items-center gap-1 text-left transition-all hover:opacity-80"
                        style={{ backgroundColor: bgColor }}
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0 ring-1 ring-white"
                          style={{ backgroundColor: dotColor }}
                        />
                        <span className="truncate font-body" style={{ color: textColor, fontSize: '10px' }}>
                          {label}
                        </span>
                      </button>
                    );
                  })}

                  {daySessions.slice(0, hubDays.length > 0 ? 0 : 2).map((sess) => {
                    const cfg = TYPE_CONFIG[sess.type] ?? TYPE_CONFIG.other;
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={sess.id}
                        onClick={() => setSelectedInfo({
                          title: sess.title || (TYPE_CONFIG[sess.type]?.label ?? 'Session'),
                          type: sess.type,
                          date: sess.session_date,
                          durationMin: sess.duration_minutes,
                          distanceKm: sess.distance_km,
                          calories: null,
                          source: sess.source || 'local',
                          avgHr: null, maxHr: null, power: null,
                          avgPace: null, avgSpeed: null,
                          elevation: null, tss: sess.tss,
                          points: [0, 1, 2, 3, 4].map((t, i) => ({ timeMin: (sess.duration_minutes / 4) * t, value: [30, 60, 45, 70, 35][i] })),
                        })}
                        className="w-full rounded-lg px-1.5 py-1 flex items-center gap-1 text-left transition-all hover:opacity-80"
                        style={{ backgroundColor: cfg.bg }}
                      >
                        <Icon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: cfg.color }} />
                        <span className="text-xs truncate font-body" style={{ color: cfg.color, fontSize: '10px' }}>
                          {cfg.label}
                        </span>
                      </button>
                    );
                  })}

                  {(totalMin > 0 || hubDayMin > 0) && (
                    <span className="text-center mt-auto font-body font-medium" style={{ color: '#6b7280', fontSize: '9px' }}>
                      {formatDuration(totalMin || hubDayMin)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {weekTotal === 0 && !hasHub && !hasLocal && (
            <div className="text-center py-2">
              <p className="font-body text-xs" style={{ color: '#9ca3af' }}>
                {hubConnected ? 'No sessions planned for this week' : 'No training sessions recorded'}
              </p>
            </div>
          )}

          {weekTotal > 0 && (
            <div className="flex items-center justify-between px-1 pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
                <span className="font-body text-xs" style={{ color: '#6b7280' }}>
                  Week total:{' '}
                  <span className="font-semibold" style={{ color: '#1f2937' }}>
                    {formatDuration(weekTotal)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {Object.entries(
                  weekDays
                    .flatMap((d) => sessionsByDate[dateKey(d)] ?? [])
                    .reduce<Record<string, number>>((acc, s) => {
                      acc[s.type] = (acc[s.type] ?? 0) + 1;
                      return acc;
                    }, {})
                ).map(([type, count]) => {
                  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.other;
                  return (
                    <span key={type} className="font-body text-xs font-medium" style={{ color: cfg.color }}>
                      {count}x {cfg.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {selectedHubDay && (() => {
            const statusStyleMap: Record<string, { bg: string; border: string; badge: string; badgeText: string; label: string }> = {
              completed: { bg: '#f0fdf4', border: '#10b98140', badge: '#dcfce7', badgeText: '#15803d', label: 'Completed' },
              skipped: { bg: '#fef2f2', border: '#ef444440', badge: '#fee2e2', badgeText: '#b91c1c', label: 'Skipped' },
              pending: { bg: '#eff6ff', border: '#3b82f640', badge: '#dbeafe', badgeText: '#1d4ed8', label: 'Pending' },
            };
            const ss = (selectedHubDay.status ? statusStyleMap[selectedHubDay.status] : null) ?? statusStyleMap.pending;
            const displayDate = selectedHubDay.scheduled_date ?? selectedHubDay.date;
            const workoutName = selectedHubDay.workout?.name ?? selectedHubDay.title ?? selectedHubDay.session_type ?? 'Training Session';
            const duration = selectedHubDay.workout?.duration_minutes ?? selectedHubDay.estimated_duration_min;
            const intensity = getIntensityColor(selectedHubDay);
            const intensityLabel = selectedHubDay.intensity_label ?? selectedHubDay.workout?.intensity_label ?? intensity?.label;
            const detailBg = intensity ? intensity.bg : ss.bg;
            const detailBorder = intensity ? `${intensity.hex}40` : ss.border;
            return (
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: detailBg, border: `1px solid ${detailBorder}` }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    {intensity && (
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: intensity.hex }}
                        title={intensityLabel}
                      />
                    )}
                    <div>
                      <span className="font-body font-semibold text-sm" style={{ color: '#1f2937' }}>
                        {workoutName}
                      </span>
                      {displayDate && (
                        <span className="ml-2 text-xs" style={{ color: '#9ca3af' }}>
                          {new Date(displayDate + 'T12:00:00').toLocaleDateString('en', {
                            weekday: 'short', month: 'short', day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedHubDay(null)}
                    className="text-xs px-2 py-0.5 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {intensity && (
                    <span
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-body font-semibold"
                      style={{ backgroundColor: intensity.hex, color: '#fff' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                      {intensityLabel ?? intensity.label}
                    </span>
                  )}
                  {duration && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" style={{ color: '#6b7280' }} />
                      <span className="text-xs font-body" style={{ color: '#6b7280' }}>
                        {formatDuration(duration)}
                      </span>
                    </div>
                  )}
                  {selectedHubDay.estimated_load && (
                    <span className="text-xs font-body" style={{ color: '#6b7280' }}>
                      Load: <strong>{selectedHubDay.estimated_load}</strong>
                    </span>
                  )}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: ss.badge, color: ss.badgeText }}
                  >
                    {ss.label}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}
                  >
                    via Hub
                  </span>
                </div>
                {selectedHubDay.notes && (
                  <p className="mt-2 text-xs font-body" style={{ color: '#6b7280' }}>
                    {selectedHubDay.notes}
                  </p>
                )}
                {selectedHubDay.workout?.description && (
                  <p className="mt-2 text-xs font-body" style={{ color: '#6b7280' }}>
                    {selectedHubDay.workout.description}
                  </p>
                )}
              </div>
            );
          })()}

          {selectedInfo && (
            <SessionDetailModal session={selectedInfo} onClose={() => setSelectedInfo(null)} />
          )}
          {/* Local session detail panel replaced by SessionDetailModal modal below */}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
            </button>
            <span className="font-body font-semibold text-sm" style={{ color: '#1f2937' }}>
              {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-4 h-4" style={{ color: '#6b7280' }} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAY_LABELS.map((l) => (
              <div key={l} className="text-center text-xs font-body font-medium py-1" style={{ color: '#9ca3af' }}>
                {l}
              </div>
            ))}
            {getMonthDays().map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="rounded-xl min-h-[52px]" />;
              const key = dateKey(day);
              const daySessions = sessionsByDate[key] ?? [];
              const hubDays = hubDaysByDate[key] ?? [];
              const isToday = isSameDay(day, today);
              const hasActivity = daySessions.length > 0 || hubDays.length > 0;

              return (
                <div
                  key={i}
                  className="rounded-xl p-1.5 min-h-[52px] flex flex-col gap-0.5 transition-all"
                  style={{
                    backgroundColor: isToday
                      ? 'rgba(253,218,54,0.08)'
                      : hasActivity
                      ? '#f9fafb'
                      : 'transparent',
                    border: isToday
                      ? '2px solid rgba(253,218,54,0.5)'
                      : hasActivity
                      ? '1px solid #f3f4f6'
                      : '1px solid transparent',
                  }}
                >
                  <span
                    className="text-xs font-body text-center leading-tight"
                    style={{ color: isToday ? '#514163' : '#6b7280', fontWeight: isToday ? 700 : 400 }}
                  >
                    {day.getDate()}
                  </span>
                  <div className="flex flex-wrap gap-0.5 justify-center">
                    {hubDays.slice(0, 3).map((hd, hi) => {
                      const intensity = getIntensityColor(hd);
                      return (
                        <div
                          key={`hub-${hi}`}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: intensity ? intensity.hex : '#3b82f6' }}
                          title={intensity ? `${hd.workout?.name ?? hd.title ?? 'Training'} – ${intensity.label}` : (hd.title ?? 'Training')}
                        />
                      );
                    })}
                    {daySessions.slice(0, hubDays.length > 0 ? 0 : 3).map((sess) => {
                      const cfg = TYPE_CONFIG[sess.type] ?? TYPE_CONFIG.other;
                      return (
                        <div
                          key={sess.id}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cfg.color }}
                          title={`${cfg.label} – ${formatDuration(sess.duration_minutes)}`}
                        />
                      );
                    })}
                    {hubDays.length + daySessions.length > 3 && (
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#d1d5db' }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 flex-wrap pt-1">
            {hasHub && (
              <>
                {(['green', 'yellow', 'red'] as const).map((c) => (
                  <div key={c} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: INTENSITY_SEMAPHORE[c].hex }} />
                    <span className="text-xs font-body" style={{ color: '#6b7280' }}>{INTENSITY_SEMAPHORE[c].label}</span>
                  </div>
                ))}
              </>
            )}
            {Object.entries(TYPE_CONFIG)
              .filter(([type]) =>
                sessions.some(
                  (s) =>
                    s.type === type &&
                    Number(s.session_date.slice(5, 7)) - 1 === currentMonth.getMonth() &&
                    Number(s.session_date.slice(0, 4)) === currentMonth.getFullYear()
                )
              )
              .map(([type, cfg]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="text-xs font-body" style={{ color: '#6b7280' }}>{cfg.label}</span>
                </div>
              ))}
          </div>
        </>
      )}

      {/* Endurance / GPS activities from Hub */}
      {(() => {
        const enduranceActs: HubEnduranceActivity[] = (
          enduranceData?.activities ?? enduranceData?.recent_activities ?? enduranceData?.training_logs ?? []
        ).filter((a) => a.validated !== false);
        const gpsActs: HubEnduranceActivity[] = (activitiesData?.activities ?? []).map((a: HubActivity) => ({
          id: a.id,
          date: a.local_date ?? a.start_time ?? '',
          activity_type: a.sport_type ?? 'other',
          title: a.name ?? a.sport_type ?? 'Activity',
          distance_km: a.distance_meters != null ? a.distance_meters / 1000 : undefined,
          duration_min: a.duration_seconds ? Math.round(a.duration_seconds / 60) : undefined,
          avg_hr: a.average_heartrate ?? undefined,
          elevation_gain_m: a.elevation_gain_meters != null ? Math.round(a.elevation_gain_meters) : undefined,
          calories_burned: a.calories ?? undefined,
          avg_speed_kmh: a.average_speed_mps != null ? a.average_speed_mps * 3.6 : undefined,
          source: a.source ?? 'gps',
        }));
        const acts = [...enduranceActs, ...gpsActs].slice(0, 6);
        if (!hubTarget || acts.length === 0) return null;
        return (
          <div className="pt-2 border-t" style={{ borderColor: '#f3f4f6' }}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#ef4444' }} />
              <span className="font-body font-semibold text-xs" style={{ color: '#6b7280' }}>
                Recent Endurance / GPS Activities
              </span>
            </div>
            <div className="space-y-2">
              {acts.map((act, idx) => {
                const dur = act.duration_min ?? act.duration_minutes;
                const sportCfg = TYPE_CONFIG[act.sport?.toLowerCase() ?? act.activity_type?.toLowerCase() ?? 'other'] ?? TYPE_CONFIG.other;
                return (
                  <button
                    key={act.id ?? idx}
                    onClick={() => setSelectedInfo({
                      title: act.title ?? act.activity_type ?? act.sport ?? 'Activity',
                      type: act.activity_type ?? act.sport ?? 'other',
                      date: act.date?.slice(0, 10),
                      durationMin: dur ?? null,
                      distanceKm: act.distance_km ?? null,
                      calories: act.calories_burned ?? null,
                      source: act.source ?? 'gps',
                      avgHr: act.avg_hr ?? null,
                      maxHr: act.max_hr ?? null,
                      power: null,
                      avgPace: act.avg_pace_min_km ?? null,
                      avgSpeed: act.avg_speed_kmh ?? null,
                      elevation: act.elevation_gain_m ?? null,
                      tss: act.tss ?? null,
                      points: [],
                    })}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:opacity-80 transition-opacity" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: sportCfg.bg }}>
                      <Activity className="w-3.5 h-3.5" style={{ color: sportCfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-body font-semibold text-xs truncate" style={{ color: '#1f2937' }}>
                        {act.title ?? act.activity_type ?? act.sport ?? 'Activity'}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {act.date && (
                          <span className="text-[10px]" style={{ color: '#9ca3af' }}>
                            {new Date(act.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                        {dur != null && (
                          <span className="text-[10px]" style={{ color: '#9ca3af' }}>{formatDuration(dur)}</span>
                        )}
                        {act.distance_km != null && (
                          <span className="text-[10px] font-semibold" style={{ color: '#3b82f6' }}>{act.distance_km.toFixed(1)} km</span>
                        )}
                        {act.avg_hr != null && (
                          <span className="text-[10px]" style={{ color: '#9ca3af' }}>♥ {act.avg_hr}</span>
                        )}
                      </div>
                    </div>
                    {act.tss != null && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                        TSS {act.tss}
                      </span>
                    )}
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>GPS</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Daily caloric need (TDEE) */}
      {hasTdee && (
        <div className="pt-2 border-t" style={{ borderColor: '#f3f4f6' }}>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 flex-shrink-0" style={{ color: '#f97316' }} />
            <span className="font-body font-semibold text-xs" style={{ color: '#6b7280' }}>
              Daily caloric need (TDEE)
            </span>
            {tdeeData?.bmr_method && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full capitalize" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                {tdeeData.bmr_method.replace(/_/g, ' ')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {tdeeAvg != null && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
                <Flame className="w-4 h-4" style={{ color: '#f97316' }} />
                <div>
                  <span className="font-body font-bold text-sm" style={{ color: '#1f2937' }}>
                    {Math.round(tdeeAvg)}
                  </span>
                  <span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>avg kcal/d</span>
                </div>
              </div>
            )}
            {tdeeLow != null && tdeeHigh != null && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
                <Activity className="w-4 h-4" style={{ color: '#fb923c' }} />
                <div>
                  <span className="font-body font-bold text-sm" style={{ color: '#1f2937' }}>
                    {Math.round(tdeeLow)}–{Math.round(tdeeHigh)}
                  </span>
                  <span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>range kcal/d</span>
                </div>
              </div>
            )}
            {tdeeBmr != null && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <Activity className="w-4 h-4" style={{ color: '#f59e0b' }} />
                <div>
                  <span className="font-body font-bold text-sm" style={{ color: '#1f2937' }}>
                    {Math.round(tdeeBmr)}
                  </span>
                  <span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>BMR kcal/d</span>
                </div>
              </div>
            )}
            {tdeeNeatFactor != null && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#eff6ff', border: '1px solid #dbeafe' }}>
                <Zap className="w-4 h-4" style={{ color: '#3b82f6' }} />
                <div>
                  <span className="font-body font-bold text-sm" style={{ color: '#1f2937' }}>
                    {Number(tdeeNeatFactor).toFixed(2)}
                  </span>
                  <span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>NEAT factor</span>
                </div>
              </div>
            )}
            {tdeeTotalEat != null && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <Activity className="w-4 h-4" style={{ color: '#10b981' }} />
                <div>
                  <span className="font-body font-bold text-sm" style={{ color: '#1f2937' }}>
                    {Math.round(tdeeTotalEat)}
                  </span>
                  <span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>EAT kcal/wk</span>
                </div>
              </div>
            )}
            {tdeeTrainingDays != null && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#eff6ff', border: '1px solid #dbeafe' }}>
                <Activity className="w-4 h-4" style={{ color: '#2563eb' }} />
                <div>
                  <span className="font-body font-bold text-sm" style={{ color: '#1f2937' }}>
                    {tdeeTrainingDays}
                  </span>
                  <span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>train days</span>
                </div>
              </div>
            )}
            {tdeeRestDays != null && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                <Activity className="w-4 h-4" style={{ color: '#6b7280' }} />
                <div>
                  <span className="font-body font-bold text-sm" style={{ color: '#1f2937' }}>
                    {tdeeRestDays}
                  </span>
                  <span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>rest days</span>
                </div>
              </div>
            )}
          </div>

          {/* Daily breakdown */}
          {tdeeData?.daily && tdeeData.daily.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {tdeeData.daily.map((day) => {
                const dayDate = new Date(day.date + 'T12:00:00');
                const dayLabel = dayDate.toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' });
                const hasSessions = day.sessions && day.sessions.length > 0;
                return (
                  <div key={day.date} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                    <span className="text-xs font-body font-medium flex-shrink-0" style={{ color: '#6b7280', minWidth: '5rem' }}>
                      {dayLabel}
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      <Flame className="w-3 h-3 flex-shrink-0" style={{ color: '#f97316' }} />
                      <span className="text-xs font-body font-semibold" style={{ color: '#1f2937' }}>
                        {Math.round(day.tdee)}
                      </span>
                      <span className="text-[10px]" style={{ color: '#9ca3af' }}>
                        ({Math.round(day.tdee_low)}–{Math.round(day.tdee_high)})
                      </span>
                      {day.eat > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                          EAT {Math.round(day.eat)}
                        </span>
                      )}
                    </div>
                    {hasSessions && (
                      <div className="flex items-center gap-1 flex-wrap justify-end">
                        {day.sessions.map((sess, si) => (
                          <span key={si} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                            backgroundColor: sess.source === 'gym' ? '#f5f3ff' : '#eff6ff',
                            color: sess.source === 'gym' ? '#7c3aed' : '#2563eb',
                          }} title={`${sess.name} • ${sess.duration_minutes}min • ${Math.round(sess.kcal)} kcal`}>
                            {sess.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
