import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Activity, Clock, Zap, Dumbbell, Wifi, WifiOff, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useHubTrainingSchedule, useHubEnduranceData } from '../../hooks/useHubData';
import type { HubTrainingDay } from '../../lib/hubApi';

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
  return d.toISOString().slice(0, 10);
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
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [selectedHubDay, setSelectedHubDay] = useState<HubTrainingDay | null>(null);

  const hubTarget = athleteEmail ?? null;
  const { data: hubData, loading: hubLoading, error: hubError } = useHubTrainingSchedule(hubTarget);

  const enduranceDateFrom = (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10); })();
  const enduranceDateTo = new Date().toISOString().slice(0, 10);
  const { data: enduranceData, loading: enduranceLoading } = useHubEnduranceData(hubTarget, enduranceDateFrom, enduranceDateTo);

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
    const all = [
      ...(hubData?.scheduled_workouts ?? hubData?.workouts ?? []),
      ...(hubData?.completed_training_logs ?? hubData?.logs ?? []),
      // GPS / free workouts — Hub may return these under several different field names
      ...(hubData?.free_activities ?? []),
      ...(hubData?.activities ?? []),
      ...(hubData?.training_activities ?? []),
      ...(hubData?.gps_activities ?? []),
    ];
    // Deduplicate by id so the same workout isn't shown twice if Hub sends it in multiple arrays
    const seen = new Set<string>();
    for (const day of all) {
      const key = day.scheduled_date ?? day.date;
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

  const loading = localLoading || hubLoading || enduranceLoading;
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
                        onClick={() => setSelectedHubDay(hd === selectedHubDay ? null : hd)}
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
                        onClick={() => setSelectedSession(sess === selectedSession ? null : sess)}
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

          {selectedSession && (
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: TYPE_CONFIG[selectedSession.type]?.bg ?? '#f9fafb',
                border: `1px solid ${TYPE_CONFIG[selectedSession.type]?.color ?? '#e5e7eb'}20`,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-body font-semibold text-sm" style={{ color: '#1f2937' }}>
                    {selectedSession.title || TYPE_CONFIG[selectedSession.type]?.label}
                  </span>
                  <span className="ml-2 text-xs" style={{ color: '#9ca3af' }}>
                    {new Date(selectedSession.session_date + 'T12:00:00').toLocaleDateString('en', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-xs px-2 py-0.5 rounded-lg"
                  style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" style={{ color: '#6b7280' }} />
                  <span className="text-xs font-body" style={{ color: '#6b7280' }}>
                    {formatDuration(selectedSession.duration_minutes)}
                  </span>
                </div>
                {selectedSession.distance_km && (
                  <span className="text-xs font-body" style={{ color: '#6b7280' }}>
                    {selectedSession.distance_km} km
                  </span>
                )}
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-body font-medium capitalize"
                  style={{
                    backgroundColor: `${INTENSITY_COLOR[selectedSession.intensity]}20`,
                    color: INTENSITY_COLOR[selectedSession.intensity],
                  }}
                >
                  {selectedSession.intensity}
                </span>
                {selectedSession.tss && (
                  <span className="text-xs font-body" style={{ color: '#6b7280' }}>
                    TSS: <strong>{selectedSession.tss}</strong>
                  </span>
                )}
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#f3f4f6', color: '#9ca3af' }}
                >
                  via {selectedSession.source}
                </span>
              </div>
              {selectedSession.notes && (
                <p className="mt-2 text-xs font-body" style={{ color: '#6b7280' }}>
                  {selectedSession.notes}
                </p>
              )}
            </div>
          )}
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
                    new Date(s.session_date).getMonth() === currentMonth.getMonth() &&
                    new Date(s.session_date).getFullYear() === currentMonth.getFullYear()
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
        const acts = [
          ...(enduranceData?.activities ?? enduranceData?.recent_activities ?? enduranceData?.training_logs ?? []),
        ].filter((a) => a.validated !== false).slice(0, 6);
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
                  <div key={act.id ?? idx} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
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
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
