export type Sport =
  | 'running'
  | 'trail_running'
  | 'cycling_road'
  | 'cycling_gravel'
  | 'cycling_mtb'
  | 'swimming'
  | 'triathlon'
  | 'hyrox';

export interface SportConfig {
  id: Sport;
  label: string;
  category: 'running' | 'cycling' | 'multisport' | 'other';
  icon: string;
  color: string;
}

export interface RaceData {
  raceName: string;
  distance: number;
  distanceUnit: 'km' | 'miles';
  elevationGain: number;
  expectedDurationMin: number;
  temperature: number;
  humidity: number;
  altitude: number;
  raceDate: string;
}

export interface AthleteData {
  bodyWeightKg: number;
  vo2max: number;
  thresholdPace: number;
  thresholdPower: number;
  vvo2maxPace: number;
  cp: number;
  highCarbExperience: 'none' | 'some' | 'experienced';
  giIssuesHistory: boolean;
  sweatRateLh: number;
  hasSweatRate: boolean;
}

export interface StrategyPreferences {
  target: 'performance' | 'finish_strong' | 'safe';
  carbTargetGH?: number;
  caffeineYes: boolean;
  gutTrained: boolean;
  choType: 'liquid' | 'solid' | 'gel' | 'mix';
  preCompDays: 0 | 1 | 2 | 3;
  trainingVolume: 'low' | 'moderate' | 'high';
  giTrainingWanted: boolean;
}

export interface PacingStrategy {
  estimatedPaceMinKm: number;
  intensityPercent: number;
  intensityZone: string;
  recommendation: string;
}

export interface CarbStrategy {
  estimatedCarbUseGMin: number;
  recommendedIntakeGH: number;
  totalCarbsG: number;
  sources: string[];
  timing: string;
}

export interface HydrationStrategy {
  sweatRateLH: number;
  fluidIntakeLH: number;
  totalFluidL: number;
  sodiumMgH: number;
  totalSodiumMg: number;
  projectedMassLossPct: number;
}

export interface RiskFlag {
  level: 'warning' | 'critical';
  message: string;
}

export interface CaffeineDose {
  label: string;
  timingMin: number;
  mg: number;
}

export interface CaffeinePlan {
  totalMg: number;
  mgPerKg: number;
  preDoseMg: number;
  preDoseMinBeforeStart: number;
  midRaceDoses: CaffeineDose[];
  sources: string[];
  notes: string;
}

export interface DayMeal {
  timing: string;
  description: string;
  carbsG: number;
}

export interface DayNutrition {
  dayLabel: string;
  carbsGkg: number;
  totalCarbsG: number;
  proteinG: number;
  totalKcal: number;
  meals: DayMeal[];
  notes: string;
}

export interface PreCompNutrition {
  choLoadingDays: number;
  tapering: boolean;
  plan: DayNutrition[];
  raceBreakfast: { timingBeforeStart: string; description: string; carbsG: number };
  notes: string;
}

export interface GITrainingSession {
  week: number;
  intakeGH: number;
  fluidMlH: number;
  duration: string;
  format: string;
  notes: string;
}

export interface GITrainingPlan {
  weeks: number;
  targetGH: number;
  sessions: GITrainingSession[];
  notes: string;
}

export interface StrategyOutput {
  pacing: PacingStrategy;
  carbs: CarbStrategy;
  hydration: HydrationStrategy;
  caffeine: CaffeinePlan;
  preComp: PreCompNutrition;
  giTraining?: GITrainingPlan;
  risks: RiskFlag[];
  generatedAt: string;
}

export interface Competition {
  id?: string;
  athleteId?: string;
  sport: Sport;
  subSport?: string;
  raceName: string;
  raceData: RaceData;
  athleteData: AthleteData;
  strategyPreferences: StrategyPreferences;
  strategyOutput?: StrategyOutput;
  raceDate?: string;
  createdAt?: string;
}

export interface PostRaceFeedback {
  id?: string;
  competitionId: string;
  actualDurationMin: number;
  averageHr: number;
  giIssues: boolean;
  actualCarbIntakeGH: number;
  actualTemperature: number;
  notes: string;
}

export interface RaceCatalogEntry {
  id: string;
  name: string;
  sport: Sport;
  country: string;
  city: string;
  distance_km: number;
  elevation_gain_m: number;
  typical_month: number;
  typical_day: number;
  avg_temperature_c: number;
  avg_humidity_pct: number;
  altitude_m: number;
  description: string;
  is_verified?: boolean;
  race_date?: string | null;
}

export interface HydrationStation {
  id: string;
  km: number;
  label: string;
  hasFood: boolean;
  altitudeM?: number;
  supplyTypes?: string[];
  services?: string[];
}

export interface ElevationPoint {
  km: number;
  elevationM: number;
}

export interface RaceCourseProfile {
  id?: string;
  raceCatalogId?: string;
  userId?: string;
  editionYear: number;
  hydrationStations: HydrationStation[];
  elevationPoints: ElevationPoint[];
  notes: string;
}

export type PlannerStep = 'sport' | 'questionnaire' | 'results' | 'saved';
export type QuestionnaireStep = 1 | 2 | 3;
