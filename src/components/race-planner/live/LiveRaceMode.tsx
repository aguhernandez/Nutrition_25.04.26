import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Play, Pause, MapPin, Navigation, Droplets, Flame, Zap,
  Bell, BellOff, Timer, ChevronDown, ChevronUp, AlertCircle,
  CheckCircle, Clock, Thermometer, Activity, TrendingUp,
} from 'lucide-react';
import type { Competition } from '../../../types/race';
import type { RaceNutritionPlan } from '../../../types/nutrition';
import type { HydrationStation } from '../../../types/race';
import {
  buildFuelSchedule,
  computeAdaptiveFactor,
  applyAdaptiveAdjustments,
  getActiveNotifications,
  getUpcomingNotifications,
  acknowledgeNotification,
  snoozeNotification,
  expireOldNotifications,
  type FuelSchedule,
  type FuelNotification,
  type NotificationType,
} from '../../../engine/fuelNotificationEngine';
import { useAuth } from '../../../lib/auth';
import {
  createRaceActivity,
  updateRaceActivity,
  logRaceEvent,
} from '../../../lib/raceActivityService';

interface Props {
  competition: Competition;
  nutritionPlan?: RaceNutritionPlan;
  hydrationStations?: HydrationStation[];
  onClose: () => void;
}

interface GpsPosition {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

interface RaceStats {
  elapsedSec: number;
  distanceKm: number;
  currentPaceMinKm: number;
  avgPaceMinKm: number;
  carbsConsumedG: number;
  sodiumConsumedMg: number;
  fluidConsumedMl: number;
  caffeineConsumedMg: number;
}

function formatTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatPace(minKm: number): string {
  if (!minKm || !isFinite(minKm) || minKm <= 0) return '--:--';
  const m = Math.floor(minKm);
  const s = Math.round((minKm - m) * 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const TYPE_CONFIG: Record<NotificationType, {
  label: string;
  color: string;
  border: string;
  bg: string;
  icon: React.ElementType;
}> = {
  CARB_REMINDER:        { label: 'Carbohidratos', color: 'text-yellow-300',  border: 'border-yellow-500/50', bg: 'bg-yellow-500/10',  icon: Flame },
  FLUID_REMINDER:       { label: 'Hidratación',   color: 'text-sky-300',     border: 'border-sky-500/50',    bg: 'bg-sky-500/10',     icon: Droplets },
  CAFFEINE_REMINDER:    { label: 'Cafeína',        color: 'text-amber-300',   border: 'border-amber-500/50',  bg: 'bg-amber-500/10',   icon: Zap },
  ELECTROLYTE_REMINDER: { label: 'Electrolitos',   color: 'text-teal-300',    border: 'border-teal-500/50',   bg: 'bg-teal-500/10',    icon: Droplets },
  PACE_ALERT:           { label: 'Ritmo',          color: 'text-orange-300',  border: 'border-orange-500/50', bg: 'bg-orange-500/10',  icon: Timer },
  AID_STATION:          { label: 'Avituallamiento',color: 'text-emerald-300', border: 'border-emerald-500/50',bg: 'bg-emerald-500/10', icon: MapPin },
  INFO:                 { label: 'Info',           color: 'text-gray-300',    border: 'border-gray-500/50',   bg: 'bg-gray-500/10',    icon: AlertCircle },
};

interface ActiveNotificationCardProps {
  notification: FuelNotification;
  elapsedSec: number;
  onAcknowledge: (id: string) => void;
  onSnooze: (id: string) => void;
}

function ActiveNotificationCard({ notification, elapsedSec, onAcknowledge, onSnooze }: ActiveNotificationCardProps) {
  const cfg = TYPE_CONFIG[notification.type];
  const Icon = cfg.icon;
  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-4 animate-pulse`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg} border ${cfg.border} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${cfg.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-bold uppercase tracking-wider ${cfg.color} mb-0.5`}>{cfg.label}</div>
          <div className="text-white font-semibold text-base leading-tight">{notification.message}</div>
          {notification.detail && (
            <div className="text-gray-400 text-xs mt-1">{notification.detail}</div>
          )}
          {notification.kmMark !== undefined && (
            <div className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> km {notification.kmMark}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onAcknowledge(notification.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold transition-all hover:bg-emerald-500/30"
        >
          <CheckCircle className="w-4 h-4" />
          Consumido
        </button>
        <button
          onClick={() => onSnooze(notification.id)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gray-700/60 border border-gray-600/40 text-gray-300 text-sm font-medium transition-all hover:bg-gray-700"
        >
          <Clock className="w-4 h-4" />
          +2min
        </button>
      </div>
    </div>
  );
}

export default function LiveRaceMode({ competition, nutritionPlan, hydrationStations, onClose }: Props) {
  const { user } = useAuth();
  const output = competition.strategyOutput;
  const targetPace = output?.pacing.estimatedPaceMinKm ?? 6;
  const targetDurationSec = competition.raceData.expectedDurationMin * 60;
  const distanceKm = competition.raceData.distanceUnit === 'miles'
    ? competition.raceData.distance * 1.60934
    : competition.raceData.distance;

  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState<RaceStats>({
    elapsedSec: 0,
    distanceKm: 0,
    currentPaceMinKm: 0,
    avgPaceMinKm: 0,
    carbsConsumedG: 0,
    sodiumConsumedMg: 0,
    fluidConsumedMl: 0,
    caffeineConsumedMg: 0,
  });

  const [schedule, setSchedule] = useState<FuelSchedule>(() =>
    buildFuelSchedule(competition, nutritionPlan, hydrationStations)
  );
  const [activeNotifications, setActiveNotifications] = useState<FuelNotification[]>([]);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  const [gps, setGps] = useState<GpsPosition | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const [adaptiveFactor, setAdaptiveFactor] = useState(1.0);
  const [raceActivityId, setRaceActivityId] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastPosRef = useRef<{ lat: number; lng: number; time: number } | null>(null);
  const totalDistRef = useRef(0);
  const statsRef = useRef(stats);
  statsRef.current = stats;
  const scheduleRef = useRef(schedule);
  scheduleRef.current = schedule;
  const raceActivityIdRef = useRef<string | null>(null);
  raceActivityIdRef.current = raceActivityId;

  const sendBrowserNotification = useCallback((n: FuelNotification) => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(TYPE_CONFIG[n.type].label, {
        body: n.message + (n.detail ? `\n${n.detail}` : ''),
        icon: '/favicon.ico',
        tag: n.id,
        silent: false,
      });
    }
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [notificationsEnabled]);

  const handleAcknowledge = useCallback((id: string) => {
    setSchedule((prev) => {
      const updated = acknowledgeNotification(prev, id, statsRef.current.elapsedSec);
      const n = updated.notifications.find((x) => x.id === id);
      if (n && raceActivityIdRef.current && user) {
        logRaceEvent(raceActivityIdRef.current, user.id, n, statsRef.current.elapsedSec);
      }
      return updated;
    });
    setActiveNotifications((prev) => prev.filter((n) => n.id !== id));

    setStats((prev) => {
      const n = scheduleRef.current.notifications.find((x) => x.id === id);
      if (!n) return prev;
      return {
        ...prev,
        carbsConsumedG: prev.carbsConsumedG + (n.payload.carbsG ?? 0),
        sodiumConsumedMg: prev.sodiumConsumedMg + (n.payload.sodiumMg ?? 0),
        fluidConsumedMl: prev.fluidConsumedMl + (n.payload.fluidMl ?? 0),
        caffeineConsumedMg: prev.caffeineConsumedMg + (n.payload.caffeineMg ?? 0),
      };
    });
  }, [user]);

  const handleSnooze = useCallback((id: string) => {
    setSchedule((prev) => snoozeNotification(prev, id, statsRef.current.elapsedSec, 120));
    setActiveNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const tick = useCallback(() => {
    setStats((prev) => {
      const newElapsed = prev.elapsedSec + 1;
      const estimatedKm = (newElapsed / 60) / targetPace;
      return {
        ...prev,
        elapsedSec: newElapsed,
        distanceKm: gpsEnabled && totalDistRef.current > 0
          ? Math.round(totalDistRef.current * 100) / 100
          : Math.round(estimatedKm * 100) / 100,
        currentPaceMinKm: targetPace + (Math.random() - 0.5) * 0.3,
        avgPaceMinKm: newElapsed > 0 ? (newElapsed / 60) / Math.max(estimatedKm, 0.001) : targetPace,
      };
    });

    setSchedule((prev) => {
      const elapsed = statsRef.current.elapsedSec + 1;
      let updated = expireOldNotifications(prev, elapsed);

      const fired = getActiveNotifications(updated, elapsed);
      if (fired.length > 0) {
        fired.forEach((n) => sendBrowserNotification(n));
        setActiveNotifications((prevActive) => {
          const newIds = new Set(prevActive.map((x) => x.id));
          const toAdd = fired.filter((n) => !newIds.has(n.id));
          return [...toAdd, ...prevActive].slice(0, 6);
        });
        fired.forEach((n) => {
          updated = acknowledgeNotification(updated, n.id, elapsed);
          updated = { ...updated, notifications: updated.notifications.map((x) => x.id === n.id ? { ...x, status: 'active' } : x) };
        });
      }
      return updated;
    });

    if ((statsRef.current.elapsedSec + 1) % 30 === 0 && raceActivityIdRef.current) {
      const s = statsRef.current;
      updateRaceActivity(raceActivityIdRef.current, {
        current_km: s.distanceKm,
        elapsed_time_min: (s.elapsedSec + 1) / 60,
        adaptive_fluid_factor: adaptiveFactor,
        conditions: { temperature: competition.raceData.temperature ?? 20 },
      });
    }
  }, [targetPace, gpsEnabled, sendBrowserNotification, adaptiveFactor, competition.raceData.temperature]);

  useEffect(() => {
    if (running) {
      timerRef.current = window.setInterval(tick, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, tick]);

  useEffect(() => {
    const temp = (competition.raceData as Record<string, unknown>).temperature as number ?? 20;
    const factor = computeAdaptiveFactor({
      currentPaceMinKm: stats.currentPaceMinKm || targetPace,
      targetPaceMinKm: targetPace,
      temperatureC: temp,
      elapsedSec: stats.elapsedSec,
    });
    if (Math.abs(factor - adaptiveFactor) > 0.05) {
      setAdaptiveFactor(factor);
      setSchedule((prev) => applyAdaptiveAdjustments(prev, factor));
    }
  }, [stats.elapsedSec, stats.currentPaceMinKm, targetPace, adaptiveFactor, competition.raceData]);

  const handleStartResume = async () => {
    if (!running && stats.elapsedSec === 0 && user) {
      const actId = await createRaceActivity(
        (competition as unknown as { id?: string }).id ?? null,
        user.id
      );
      setRaceActivityId(actId);
    }
    setRunning((r) => !r);
  };

  const handlePause = () => {
    setRunning(false);
    if (raceActivityId) {
      updateRaceActivity(raceActivityId, {
        status: 'paused',
        current_km: stats.distanceKm,
        elapsed_time_min: stats.elapsedSec / 60,
      });
    }
  };

  const requestNotifications = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationsEnabled(perm === 'granted');
    }
  };

  const startGps = () => {
    if (!navigator.geolocation) { setGpsError('GPS no disponible en este dispositivo'); return; }
    setGpsEnabled(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, timestamp: pos.timestamp };
        setGps(newPos);
        setGpsError(null);
        if (lastPosRef.current && running) {
          const dLat = newPos.lat - lastPosRef.current.lat;
          const dLng = newPos.lng - lastPosRef.current.lng;
          totalDistRef.current += Math.sqrt(dLat * dLat + dLng * dLng) * 111;
        }
        lastPosRef.current = { lat: newPos.lat, lng: newPos.lng, time: newPos.timestamp };
      },
      (err) => setGpsError(err.message),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );
  };

  const stopGps = () => {
    setGpsEnabled(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setGps(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const progressPct = Math.min(100, (stats.elapsedSec / targetDurationSec) * 100);
  const distancePct = Math.min(100, (stats.distanceKm / distanceKm) * 100);

  const carbTarget = output?.carbs.totalCarbsG ?? 0;
  const carbPct = carbTarget > 0 ? Math.min(100, (stats.carbsConsumedG / carbTarget) * 100) : 0;

  const sodiumTarget = output?.hydration.totalSodiumMg ?? 0;

  const upcoming = getUpcomingNotifications(scheduleRef.current, stats.elapsedSec, showAllUpcoming ? 20 : 5);
  const acknowledged = schedule.notifications.filter((n) => n.status === 'acknowledged').length;
  const total = schedule.notifications.length;

  const isAdaptiveActive = adaptiveFactor > 1.05;
  const temp = (competition.raceData as Record<string, unknown>).temperature as number ?? 20;

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-800/80">
        <div>
          <h1 className="text-base font-bold text-white truncate max-w-[210px]">{competition.raceName}</h1>
          <p className="text-xs text-gray-500">
            {competition.raceData.distance} {competition.raceData.distanceUnit} · Modo en Vivo
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdaptiveActive && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30">
              <TrendingUp className="w-3 h-3 text-orange-400" />
              <span className="text-xs text-orange-300 font-medium">Adaptativo</span>
            </div>
          )}
          <button
            onClick={notificationsEnabled ? () => setNotificationsEnabled(false) : requestNotifications}
            className={`p-2 rounded-xl transition-all ${notificationsEnabled ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-500 hover:text-gray-300'}`}
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
          <button onClick={onClose} className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Timer + Progress */}
        <div className="px-4 py-5 text-center">
          <div className="text-6xl font-mono font-bold text-white tracking-tight mb-1">
            {formatTime(stats.elapsedSec)}
          </div>
          <div className="text-xs text-gray-500 mb-4">tiempo transcurrido</div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>0</span>
            <span>{Math.round(progressPct)}% completado</span>
            <span>{competition.raceData.expectedDurationMin}min objetivo</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="px-4 grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800/60 rounded-2xl p-4">
            <div className="text-xs text-gray-500 mb-1">Distancia</div>
            <div className="text-2xl font-bold text-white">
              {stats.distanceKm}<span className="text-sm text-gray-500 ml-1">km</span>
            </div>
            <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${distancePct}%` }} />
            </div>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-4">
            <div className="text-xs text-gray-500 mb-1">Ritmo Actual</div>
            <div className="text-2xl font-bold text-white">
              {formatPace(stats.currentPaceMinKm)}<span className="text-sm text-gray-500 ml-1">/km</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">prom {formatPace(stats.avgPaceMinKm)}/km</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-1 text-xs text-yellow-400 mb-1">
              <Flame className="w-3 h-3" /> CHO Consumido
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.carbsConsumedG}<span className="text-sm text-gray-500 ml-1">g</span>
            </div>
            <div className="mt-1.5 h-1 bg-yellow-900/40 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${carbPct}%` }} />
            </div>
            <div className="text-xs text-gray-500 mt-1">objetivo {carbTarget}g</div>
          </div>
          <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-1 text-xs text-sky-400 mb-1">
              <Droplets className="w-3 h-3" /> Fluidos
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.fluidConsumedMl}<span className="text-sm text-gray-500 ml-1">ml</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              sodio {stats.sodiumConsumedMg}mg · obj {sodiumTarget}mg
            </div>
          </div>
        </div>

        {/* Adaptive status bar */}
        {isAdaptiveActive && (
          <div className="px-4 mb-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/25">
              <Thermometer className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-orange-300">Ajuste Adaptativo Activo</div>
                <div className="text-xs text-gray-400">
                  {temp > 28 ? `Temp ${temp}°C — incremento fluidos ×${adaptiveFactor.toFixed(2)}` : `Ritmo elevado — incremento fluidos ×${adaptiveFactor.toFixed(2)}`}
                </div>
              </div>
              <Activity className="w-4 h-4 text-orange-400" />
            </div>
          </div>
        )}

        {/* Active Notifications */}
        {activeNotifications.length > 0 && (
          <div className="px-4 mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white uppercase tracking-wider font-bold">
                Alertas Activas
              </div>
              <span className="text-xs text-gray-500">{activeNotifications.length} pendiente{activeNotifications.length !== 1 ? 's' : ''}</span>
            </div>
            {activeNotifications.map((n) => (
              <ActiveNotificationCard
                key={n.id}
                notification={n}
                elapsedSec={stats.elapsedSec}
                onAcknowledge={handleAcknowledge}
                onSnooze={handleSnooze}
              />
            ))}
          </div>
        )}

        {/* GPS */}
        <div className="px-4 mb-4">
          <div className="bg-gray-800/60 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${gpsEnabled ? (gps ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400 animate-pulse') : 'bg-gray-600'}`} />
              <div>
                <div className="text-sm font-medium text-white">GPS</div>
                {gps ? (
                  <div className="text-xs text-gray-500">{gps.lat.toFixed(5)}, {gps.lng.toFixed(5)} · ±{Math.round(gps.accuracy)}m</div>
                ) : gpsError ? (
                  <div className="text-xs text-red-400">{gpsError}</div>
                ) : (
                  <div className="text-xs text-gray-500">{gpsEnabled ? 'Adquiriendo señal...' : 'No activo'}</div>
                )}
              </div>
            </div>
            <button
              onClick={gpsEnabled ? stopGps : startGps}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${gpsEnabled ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'}`}
            >
              <Navigation className="w-3.5 h-3.5" />
              {gpsEnabled ? 'Detener' : 'Activar GPS'}
            </button>
          </div>
        </div>

        {/* Upcoming schedule */}
        <div className="px-4 mb-4">
          <button
            onClick={() => setShowAllUpcoming((v) => !v)}
            className="flex items-center justify-between w-full mb-3"
          >
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Próximas alertas ({upcoming.length})
            </div>
            {showAllUpcoming ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </button>
          <div className="space-y-2">
            {upcoming.map((n) => {
              const cfg = TYPE_CONFIG[n.type];
              const Icon = cfg.icon;
              const effective = n.snoozedUntilSec ?? n.scheduledAtSec;
              const timeLeft = effective - stats.elapsedSec;
              return (
                <div key={n.id} className="flex items-center gap-3 bg-gray-800/40 rounded-xl px-3 py-2.5">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-300 truncate">{n.message}</div>
                    {n.kmMark !== undefined && (
                      <div className="text-xs text-gray-600">km {n.kmMark}</div>
                    )}
                    {n.status === 'snoozed' && (
                      <div className="text-xs text-amber-500">pospuesta</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0 font-mono tabular-nums">
                    -{formatTime(Math.max(0, timeLeft))}
                  </div>
                </div>
              );
            })}
            {upcoming.length === 0 && (
              <div className="text-center text-xs text-gray-600 py-4">No hay alertas próximas</div>
            )}
          </div>
        </div>

        {/* Progress summary */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800/40 rounded-2xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Resumen Nutricional</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-white">{acknowledged}</div>
                <div className="text-xs text-gray-500">completadas</div>
              </div>
              <div>
                <div className="text-lg font-bold text-amber-400">
                  {schedule.notifications.filter((n) => n.status === 'snoozed').length}
                </div>
                <div className="text-xs text-gray-500">pospuestas</div>
              </div>
              <div>
                <div className="text-lg font-bold text-sky-400">
                  {total - acknowledged - schedule.notifications.filter((n) => n.status === 'snoozed' || n.status === 'expired').length}
                </div>
                <div className="text-xs text-gray-500">pendientes</div>
              </div>
            </div>
            {stats.caffeineConsumedMg > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-amber-400">
                  <Zap className="w-3 h-3" /> Cafeína consumida
                </div>
                <span className="text-xs text-white font-semibold">{stats.caffeineConsumedMg}mg</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-4 border-t border-gray-800/80 bg-gray-950">
        <button
          onClick={running ? handlePause : handleStartResume}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-lg font-bold transition-all ${
            running
              ? 'bg-red-500/20 text-red-300 border-2 border-red-500/40'
              : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
          }`}
        >
          {running
            ? <><Pause className="w-6 h-6" /> Pausar Carrera</>
            : <><Play className="w-6 h-6" /> {stats.elapsedSec > 0 ? 'Reanudar' : 'Iniciar Carrera'}</>
          }
        </button>
        {!notificationsEnabled && (
          <p className="text-xs text-center text-gray-600 mt-2">
            Activa las notificaciones para recibir alertas en tu dispositivo
          </p>
        )}
      </div>
    </div>
  );
}
