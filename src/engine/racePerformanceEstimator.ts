import type { ElevationPoint, Sport } from '../types/race';

export const ESTIMATOR_MODEL_VERSION = 'race-performance-estimator-v1';
export const KM_PER_MILE = 1.609344;

const MIN_REFERENCES = 2;
const MIN_DISTANCE_SPREAD_LN = Math.log(1.1);
const EXPONENT_RANGE: [number, number] = [1.0, 1.3];
const GRADE_LIMIT = 0.3;
const ALTITUDE_WARNING_M = 2000;
const FLAT_COST_J_KG_M = 3.6;
const RUNNING_SPORTS: Sport[] = ['running', 'trail_running'];

export type EstimationState = 'individualized' | 'limited' | 'manual_required';

export interface RaceReference {
  id: string;
  label: string;
  date: string;
  distanceKm: number;
  durationMin: number;
  elevationGainM: number;
  elevationPoints?: ElevationPoint[];
}

export interface EstimatorCourse {
  sport: Sport;
  distanceKm: number;
  elevationGainM: number;
  elevationPoints?: ElevationPoint[];
  maxAltitudeM?: number;
}

export interface ReferenceSnapshot {
  id: string;
  label: string;
  date: string;
  distanceKm: number;
  durationMin: number;
  gradeFactor: number;
  effectiveDistanceKm: number;
}

export interface EstimationInputsSnapshot {
  modelVersion: string;
  state: EstimationState;
  targetDistanceKm: number;
  targetGradeFactor: number;
  targetEffectiveDistanceKm: number;
  exponent: number | null;
  coefficient: number | null;
  references: ReferenceSnapshot[];
  warnings: string[];
}

export interface EstimationResult {
  state: EstimationState;
  finishTimeMin: number | null;
  paceMinPerKm: number | null;
  warnings: string[];
  snapshot: EstimationInputsSnapshot;
}

/** Minetti et al. (2002) energy cost of running on a gradient, as a multiple of flat cost. Grade is a decimal (0.1 = 10%). */
export function minettiCostRatio(grade: number): number {
  const i = Math.max(-GRADE_LIMIT, Math.min(GRADE_LIMIT, grade));
  const cost =
    155.4 * i ** 5 - 30.4 * i ** 4 - 43.3 * i ** 3 + 46.3 * i ** 2 + 19.5 * i + FLAT_COST_J_KG_M;
  return cost / FLAT_COST_J_KG_M;
}

interface GradeAdjustment {
  factor: number;
  hasProfile: boolean;
  clampedSegments: number;
}

/** Distance-weighted Minetti factor over the segments of an elevation profile. */
export function courseGradeAdjustment(points: ElevationPoint[] | undefined): GradeAdjustment {
  if (!points || points.length < 2) return { factor: 1, hasProfile: false, clampedSegments: 0 };
  const sorted = [...points].sort((a, b) => a.km - b.km);
  let weightedCost = 0;
  let weight = 0;
  let clampedSegments = 0;
  for (let i = 1; i < sorted.length; i++) {
    const dKm = sorted[i].km - sorted[i - 1].km;
    if (dKm <= 0) continue;
    const grade = (sorted[i].elevationM - sorted[i - 1].elevationM) / (dKm * 1000);
    if (Math.abs(grade) > GRADE_LIMIT) clampedSegments += 1;
    weightedCost += dKm * minettiCostRatio(grade);
    weight += dKm;
  }
  if (weight <= 0) return { factor: 1, hasProfile: false, clampedSegments: 0 };
  return { factor: weightedCost / weight, hasProfile: true, clampedSegments };
}

interface LogLogFit {
  exponent: number;
  coefficient: number;
}

/** Fits duration = coefficient * distance^exponent on log-log axes. Returns null when the references cannot support a stable fit. */
export function fitLogLog(points: { effectiveDistanceKm: number; durationMin: number }[]): LogLogFit | null {
  if (points.length < MIN_REFERENCES) return null;
  const xs = points.map((p) => Math.log(p.effectiveDistanceKm));
  const ys = points.map((p) => Math.log(p.durationMin));
  const n = xs.length;
  const mx = xs.reduce((s, x) => s + x, 0) / n;
  const my = ys.reduce((s, y) => s + y, 0) / n;
  const spread = Math.max(...xs) - Math.min(...xs);
  if (spread < MIN_DISTANCE_SPREAD_LN) return null;
  let cov = 0;
  let varX = 0;
  for (let i = 0; i < n; i++) {
    cov += (xs[i] - mx) * (ys[i] - my);
    varX += (xs[i] - mx) ** 2;
  }
  const exponent = cov / varX;
  if (exponent < EXPONENT_RANGE[0] || exponent > EXPONENT_RANGE[1]) return null;
  return { exponent, coefficient: Math.exp(my - exponent * mx) };
}

function emptyResult(
  state: EstimationState,
  course: EstimatorCourse,
  warnings: string[],
  references: ReferenceSnapshot[] = [],
): EstimationResult {
  return {
    state,
    finishTimeMin: null,
    paceMinPerKm: null,
    warnings,
    snapshot: {
      modelVersion: ESTIMATOR_MODEL_VERSION,
      state,
      targetDistanceKm: course.distanceKm,
      targetGradeFactor: 1,
      targetEffectiveDistanceKm: course.distanceKm,
      exponent: null,
      coefficient: null,
      references,
      warnings,
    },
  };
}

export function estimateRaceTime(course: EstimatorCourse, references: RaceReference[]): EstimationResult {
  if (!RUNNING_SPORTS.includes(course.sport)) {
    return emptyResult('manual_required', course, ['El estimador solo aplica a running y trail running.']);
  }
  if (!(course.distanceKm > 0)) {
    return emptyResult('manual_required', course, ['Falta la distancia de la carrera.']);
  }

  const sameSport = references
    .filter((r) => r.distanceKm > 0 && r.durationMin > 0)
    .sort((a, b) => a.distanceKm - b.distanceKm || a.id.localeCompare(b.id));
  if (sameSport.length < MIN_REFERENCES) {
    return emptyResult('manual_required', course, [
      'Se necesitan al menos dos carreras o tests reales del mismo deporte, anteriores a la fecha objetivo.',
    ]);
  }

  const referenceAdjustments = sameSport.map((r) => courseGradeAdjustment(r.elevationPoints));
  const referenceSnapshots: ReferenceSnapshot[] = sameSport.map((r, i) => ({
    id: r.id,
    label: r.label,
    date: r.date,
    distanceKm: r.distanceKm,
    durationMin: r.durationMin,
    gradeFactor: referenceAdjustments[i].factor,
    effectiveDistanceKm: r.distanceKm * referenceAdjustments[i].factor,
  }));

  const fit = fitLogLog(referenceSnapshots);
  if (!fit) {
    return emptyResult(
      'manual_required',
      course,
      ['Las referencias disponibles no permiten un ajuste fiable (distancias demasiado parecidas o ritmos inconsistentes).'],
      referenceSnapshots,
    );
  }

  const target = courseGradeAdjustment(course.elevationPoints);
  const targetEffectiveDistanceKm = course.distanceKm * target.factor;
  const finishTimeMin = Math.round(fit.coefficient * targetEffectiveDistanceKm ** fit.exponent);

  const limits: string[] = [];
  if (course.sport === 'trail_running') {
    limits.push('Perfil técnico (trail): el modelo no contempla terreno técnico ni desnivel irregular.');
  }
  if ((course.maxAltitudeM ?? 0) >= ALTITUDE_WARNING_M) {
    limits.push('Altitud elevada: el rendimiento puede caer más de lo que estima el modelo.');
  }
  const referenceClamped = referenceAdjustments.some((a) => a.clampedSegments > 0);
  if (target.clampedSegments > 0 || referenceClamped) {
    limits.push('Hay pendientes fuera de ±30%: el ajuste por pendiente queda limitado a ese rango.');
  }
  if (course.elevationGainM > 0 && !target.hasProfile) {
    limits.push('Sin perfil de elevación de la carrera: el desnivel no fue ajustado.');
  }
  if (references.some((r) => r.elevationGainM > 0 && !r.elevationPoints?.length)) {
    limits.push('Alguna referencia no tiene perfil de elevación: su ajuste por desnivel no está disponible.');
  }

  const notes: string[] = [];
  if (target.factor !== 1 || referenceAdjustments.some((a) => a.factor !== 1)) {
    notes.push('El ajuste por pendiente usa el coste energético de Minetti. No es una predicción validada para tu deporte.');
  }

  const warnings = [...limits, ...notes];
  const state: EstimationState = limits.length > 0 ? 'limited' : 'individualized';

  return {
    state,
    finishTimeMin,
    paceMinPerKm: Math.round((finishTimeMin / course.distanceKm) * 100) / 100,
    warnings,
    snapshot: {
      modelVersion: ESTIMATOR_MODEL_VERSION,
      state,
      targetDistanceKm: course.distanceKm,
      targetGradeFactor: target.factor,
      targetEffectiveDistanceKm,
      exponent: fit.exponent,
      coefficient: fit.coefficient,
      references: referenceSnapshots,
      warnings,
    },
  };
}
