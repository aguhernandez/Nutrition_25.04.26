import type { Competition } from '../types/race';
import type { RaceNutritionPlan } from '../types/nutrition';
import type { HydrationStation } from '../types/race';

export type NotificationType =
  | 'CARB_REMINDER'
  | 'FLUID_REMINDER'
  | 'CAFFEINE_REMINDER'
  | 'ELECTROLYTE_REMINDER'
  | 'PACE_ALERT'
  | 'AID_STATION'
  | 'INFO';

export type NotificationStatus = 'pending' | 'active' | 'acknowledged' | 'snoozed' | 'expired';

export interface FuelNotification {
  id: string;
  type: NotificationType;
  scheduledAtSec: number;
  firedAtSec?: number;
  kmMark?: number;
  message: string;
  detail?: string;
  status: NotificationStatus;
  snoozedUntilSec?: number;
  payload: {
    carbsG?: number;
    fluidMl?: number;
    sodiumMg?: number;
    caffeineMg?: number;
  };
}

export interface AdaptiveConditions {
  currentPaceMinKm: number;
  targetPaceMinKm: number;
  temperatureC: number;
  elapsedSec: number;
}

export interface FuelSchedule {
  notifications: FuelNotification[];
  carbsPerHour: number;
  fluidsPerHour: number;
  sodiumPerHour: number;
  adaptiveFluidFactor: number;
}

function buildCarbReminders(
  carbsGH: number,
  durationMin: number,
  paceMinKm: number
): FuelNotification[] {
  const reminders: FuelNotification[] = [];
  const portionG = 20;
  const intervalMin = portionG / (carbsGH / 60);
  let nextMin = Math.max(15, intervalMin);
  let idx = 0;

  while (nextMin < durationMin - 3) {
    const kmMark = nextMin / paceMinKm;
    const accumulated = portionG * (idx + 1);
    reminders.push({
      id: `carb-${idx}`,
      type: 'CARB_REMINDER',
      scheduledAtSec: Math.round(nextMin * 60),
      kmMark: Math.round(kmMark * 10) / 10,
      message: `Consumir ${portionG}g CHO`,
      detail: `Acumulado: ${accumulated}g · ${carbsGH}g/h objetivo`,
      status: 'pending',
      payload: { carbsG: portionG },
    });
    nextMin += intervalMin;
    idx++;
  }
  return reminders;
}

function buildFluidReminders(
  fluidLH: number,
  sodiumMgH: number,
  durationMin: number,
  paceMinKm: number
): FuelNotification[] {
  const reminders: FuelNotification[] = [];
  const portionMl = 200;
  const intervalMin = portionMl / (fluidLH * 1000 / 60);
  const clampedInterval = Math.min(20, Math.max(8, intervalMin));
  const sodiumPerDose = Math.round(sodiumMgH * (clampedInterval / 60));
  let nextMin = clampedInterval;
  let idx = 0;

  while (nextMin < durationMin - 2) {
    const kmMark = nextMin / paceMinKm;
    reminders.push({
      id: `fluid-${idx}`,
      type: 'FLUID_REMINDER',
      scheduledAtSec: Math.round(nextMin * 60),
      kmMark: Math.round(kmMark * 10) / 10,
      message: `Beber ${portionMl}ml`,
      detail: `+${sodiumPerDose}mg sodio · ${Math.round(fluidLH * 1000)}ml/h objetivo`,
      status: 'pending',
      payload: { fluidMl: portionMl, sodiumMg: sodiumPerDose },
    });
    nextMin += clampedInterval;
    idx++;
  }
  return reminders;
}

function buildCaffeineReminders(
  scheduleMin: number[],
  doseMg: number[],
  paceMinKm: number,
  durationMin: number
): FuelNotification[] {
  return scheduleMin
    .filter((m) => m < durationMin - 3)
    .map((min, i) => ({
      id: `caf-${i}`,
      type: 'CAFFEINE_REMINDER' as NotificationType,
      scheduledAtSec: Math.round(min * 60),
      kmMark: Math.round((min / paceMinKm) * 10) / 10,
      message: `Dosis cafeína · ${doseMg[i] ?? Math.round(doseMg[0])}mg`,
      detail: i === scheduleMin.length - 1 ? 'Última dosis · activación final' : `Min ${min} desde inicio`,
      status: 'pending' as NotificationStatus,
      payload: { caffeineMg: doseMg[i] ?? doseMg[0] },
    }));
}

function buildAidStationAlerts(
  stations: HydrationStation[],
  paceMinKm: number
): FuelNotification[] {
  return stations.map((s) => {
    const timeAtStation = s.km * paceMinKm * 60;
    return {
      id: `aid-${s.id}`,
      type: 'AID_STATION' as NotificationType,
      scheduledAtSec: Math.max(0, Math.round(timeAtStation - 90)),
      kmMark: Math.max(0, s.km - 0.3),
      message: `Zona de avituallamiento · ${s.label}`,
      detail: `km ${s.km}${s.hasFood ? ' · comida disponible' : ''}${s.supplyTypes?.includes('medical') ? ' · servicio médico' : ''}`,
      status: 'pending' as NotificationStatus,
      payload: {},
    };
  });
}

export function buildFuelSchedule(
  competition: Competition,
  nutritionPlan?: RaceNutritionPlan,
  hydrationStations?: HydrationStation[]
): FuelSchedule {
  const output = competition.strategyOutput;
  if (!output) {
    return { notifications: [], carbsPerHour: 0, fluidsPerHour: 0, sodiumPerHour: 0, adaptiveFluidFactor: 1 };
  }

  const durationMin = competition.raceData.expectedDurationMin;
  const pace = output.pacing.estimatedPaceMinKm ?? 6;
  const carbsGH = output.carbs.recommendedIntakeGH;
  const fluidLH = output.hydration.fluidIntakeLH;
  const sodiumMgH = output.hydration.sodiumMgH;

  const carbs = buildCarbReminders(carbsGH, durationMin, pace);
  const fluids = buildFluidReminders(fluidLH, sodiumMgH, durationMin, pace);

  let caffeine: FuelNotification[] = [];
  if (output.caffeine.totalMg > 0) {
    const cafScheduleMin: number[] = [];
    const cafDoses: number[] = [];
    const quarter = Math.round(durationMin * 0.25);
    cafScheduleMin.push(quarter);
    cafDoses.push(Math.round(output.caffeine.totalMg * 0.4));
    if (durationMin > 150) {
      cafScheduleMin.push(Math.round(durationMin * 0.7));
      cafDoses.push(Math.round(output.caffeine.totalMg * 0.35));
    }
    if (output.caffeine.midRaceDoses) {
      output.caffeine.midRaceDoses.forEach((d, i) => {
        if (cafScheduleMin[i] !== undefined) cafDoses[i] = d.mg;
      });
    }
    caffeine = buildCaffeineReminders(cafScheduleMin, cafDoses, pace, durationMin);
  }

  const aidAlerts = hydrationStations
    ? buildAidStationAlerts(hydrationStations, pace)
    : [];

  const all = [...carbs, ...fluids, ...caffeine, ...aidAlerts].sort(
    (a, b) => a.scheduledAtSec - b.scheduledAtSec
  );

  return {
    notifications: all,
    carbsPerHour: carbsGH,
    fluidsPerHour: fluidLH * 1000,
    sodiumPerHour: sodiumMgH,
    adaptiveFluidFactor: 1.0,
  };
}

export function computeAdaptiveFactor(conditions: AdaptiveConditions): number {
  let factor = 1.0;

  const paceRatio = conditions.currentPaceMinKm / conditions.targetPaceMinKm;
  if (paceRatio < 0.9) {
    factor += 0.1;
  }

  if (conditions.temperatureC > 28) {
    factor += 0.15;
  } else if (conditions.temperatureC > 32) {
    factor += 0.25;
  }

  return Math.min(factor, 1.5);
}

export function applyAdaptiveAdjustments(
  schedule: FuelSchedule,
  factor: number
): FuelSchedule {
  if (factor === 1.0) return schedule;

  const adjusted = schedule.notifications.map((n) => {
    if (n.type !== 'FLUID_REMINDER') return n;
    const newMl = Math.round((n.payload.fluidMl ?? 200) * factor);
    return {
      ...n,
      message: `Beber ${newMl}ml`,
      detail: `${n.detail} · ajuste adaptativo ×${factor.toFixed(2)}`,
      payload: { ...n.payload, fluidMl: newMl },
    };
  });

  return { ...schedule, notifications: adjusted, adaptiveFluidFactor: factor };
}

export function getActiveNotifications(
  schedule: FuelSchedule,
  elapsedSec: number,
  windowSec = 3
): FuelNotification[] {
  return schedule.notifications.filter((n) => {
    if (n.status === 'acknowledged' || n.status === 'expired') return false;
    if (n.status === 'snoozed' && n.snoozedUntilSec !== undefined && elapsedSec < n.snoozedUntilSec) return false;
    const effective = n.snoozedUntilSec ?? n.scheduledAtSec;
    return elapsedSec >= effective && elapsedSec < effective + windowSec;
  });
}

export function getUpcomingNotifications(
  schedule: FuelSchedule,
  elapsedSec: number,
  limit = 8
): FuelNotification[] {
  return schedule.notifications
    .filter((n) => {
      if (n.status === 'acknowledged' || n.status === 'expired') return false;
      const effective = n.snoozedUntilSec ?? n.scheduledAtSec;
      return effective > elapsedSec;
    })
    .slice(0, limit);
}

export function acknowledgeNotification(
  schedule: FuelSchedule,
  id: string,
  firedAtSec: number
): FuelSchedule {
  return {
    ...schedule,
    notifications: schedule.notifications.map((n) =>
      n.id === id ? { ...n, status: 'acknowledged', firedAtSec } : n
    ),
  };
}

export function snoozeNotification(
  schedule: FuelSchedule,
  id: string,
  currentSec: number,
  snoozeDurationSec = 120
): FuelSchedule {
  return {
    ...schedule,
    notifications: schedule.notifications.map((n) =>
      n.id === id ? { ...n, status: 'snoozed', snoozedUntilSec: currentSec + snoozeDurationSec } : n
    ),
  };
}

export function expireOldNotifications(
  schedule: FuelSchedule,
  elapsedSec: number,
  gracePeriodSec = 60
): FuelSchedule {
  return {
    ...schedule,
    notifications: schedule.notifications.map((n) => {
      if (n.status !== 'pending' && n.status !== 'active') return n;
      const cutoff = (n.snoozedUntilSec ?? n.scheduledAtSec) + gracePeriodSec;
      if (elapsedSec > cutoff) return { ...n, status: 'expired' };
      return n;
    }),
  };
}
