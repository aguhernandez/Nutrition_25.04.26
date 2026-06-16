const PROXY_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hub-data-proxy`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export class HubApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'HubApiError';
  }
}

function getProxyHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ANON_KEY}`,
    'apikey': ANON_KEY,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    if (errorData?.error) {
      throw new HubApiError(
        errorData.error.code ?? 'API_ERROR',
        errorData.error.message ?? `HTTP ${response.status}`,
        errorData.error.details
      );
    }
    throw new HubApiError('HTTP_ERROR', `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

class RateLimiter {
  private queue: Array<() => Promise<unknown>> = [];
  private processing = false;
  private lastRequest = 0;
  private readonly minInterval = 650;

  execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await fn());
        } catch (err) {
          reject(err);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;
    while (this.queue.length > 0) {
      const now = Date.now();
      const elapsed = now - this.lastRequest;
      if (elapsed < this.minInterval) {
        await new Promise((r) => setTimeout(r, this.minInterval - elapsed));
      }
      const fn = this.queue.shift();
      if (fn) {
        this.lastRequest = Date.now();
        await fn();
      }
    }
    this.processing = false;
  }
}

const rateLimiter = new RateLimiter();

function athleteParam(athleteEmailOrId: string): string {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(athleteEmailOrId);
  return isUuid
    ? `athlete_id=${encodeURIComponent(athleteEmailOrId)}`
    : `athlete_email=${encodeURIComponent(athleteEmailOrId)}`;
}

export interface HubBodyComposition {
  weight_kg?: number;
  height_cm?: number;
  body_fat_pct?: number;
  muscle_mass_kg?: number;
  bone_mass_kg?: number;
  visceral_fat?: number;
  bmi?: number;
  measured_at?: string;
  kerr_sum?: number;
  z_score?: number;
}

export interface HubNutritionTargets {
  target_kcal?: number;
  target_protein_g?: number;
  target_carbs_g?: number;
  target_fat_g?: number;
}

export interface HubAthleteProfile {
  id?: string;
  email?: string;
  full_name?: string;
  date_of_birth?: string;
  gender?: string;
  sport_primary?: string;
  sport_secondary?: string;
  body_composition?: HubBodyComposition;
  nutrition_targets?: HubNutritionTargets;
}

export interface HubAnthropometry {
  latest_body_composition?: HubBodyComposition;
  kerr_history?: Array<{
    date: string;
    sum_skinfolds?: number;
    z_score?: number;
  }>;
  raw_measurements_by_date?: Record<string, {
    weight_kg?: number;
    skinfolds?: Record<string, number>;
    girths?: Record<string, number>;
  }>;
  bioimpedance_history?: Array<{
    date: string;
    weight_kg?: number;
    body_fat_pct?: number;
    muscle_mass_kg?: number;
    visceral_fat?: number;
  }>;
}

export interface HubTrainingDay {
  date: string;
  difficulty_color?: string;
  difficulty_level?: string;
  intensity_color?: 'red' | 'yellow' | 'green' | string;
  intensity_label?: string;
  estimated_duration_min?: number;
  estimated_load?: number;
  title?: string;
  session_type?: string;
  planned?: boolean;
  completed?: boolean;
  id?: string;
  scheduled_date?: string;
  status?: 'pending' | 'completed' | 'skipped';
  completed_at?: string | null;
  notes?: string | null;
  workout?: {
    id?: string;
    name?: string;
    difficulty?: string | null;
    description?: string;
    duration_minutes?: number | null;
    intensity_color?: 'red' | 'yellow' | 'green' | string;
    intensity_label?: string;
  };
  set_log_summary?: unknown;
}

export interface HubTrainingSchedule {
  scheduled_workouts?: HubTrainingDay[];
  completed_training_logs?: HubTrainingDay[];
  workouts?: HubTrainingDay[];
  logs?: HubTrainingDay[];
  /** GPS / free / unstructured activities recorded by the athlete */
  free_activities?: HubTrainingDay[];
  activities?: HubTrainingDay[];
  training_activities?: HubTrainingDay[];
  gps_activities?: HubTrainingDay[];
  weekly_loads?: Array<{
    week_start: string;
    tss?: number;
    hours?: number;
    phase?: string;
  }>;
  summary?: {
    total: number;
    completed: number;
    pending: number;
    skipped: number;
    completion_rate: number;
  };
}

export interface HubNutritionPlanIngredient {
  name: string;
  quantity_g?: number;
  unit?: string;
}

export type HubNutritionPlanItemType = 'food' | 'recipe' | 'supplement' | 'product';

export interface HubNutritionPlanItemBase {
  item_type: HubNutritionPlanItemType;
  quantity_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface HubNutritionPlanFoodItem extends HubNutritionPlanItemBase {
  item_type: 'food';
  food_name: string;
}

export interface HubNutritionPlanRecipeItem extends HubNutritionPlanItemBase {
  item_type: 'recipe';
  recipe_name: string;
  recipe_id: string;
  servings?: number;
  prep_time_min?: number;
  cook_time_min?: number;
  ingredients?: HubNutritionPlanIngredient[];
}

export interface HubNutritionPlanSupplementItem extends HubNutritionPlanItemBase {
  item_type: 'supplement';
  product_name: string;
  brand?: string;
  supplement_type?: string;
  serving_unit?: string;
}

export interface HubNutritionPlanProductItem extends HubNutritionPlanItemBase {
  item_type: 'product';
  product_name: string;
  brand?: string;
  serving_unit?: string;
}

export type HubNutritionPlanItem =
  | HubNutritionPlanFoodItem
  | HubNutritionPlanRecipeItem
  | HubNutritionPlanSupplementItem
  | HubNutritionPlanProductItem;

export interface HubNutritionPlanMeal {
  meal_type: string;
  meal_name: string;
  meal_time?: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  items: HubNutritionPlanItem[];
}

export interface HubNutritionPlanDay {
  day: number;
  day_name: string;
  training_intensity?: 'green' | 'yellow' | 'red' | null;
  day_targets?: {
    target_kcal: number;
    target_protein_g: number;
    target_carbs_g: number;
    target_fat_g: number;
  } | null;
  meals: HubNutritionPlanMeal[];
}

export interface HubNutritionPlanPayload {
  plan_date: string;
  plan_name: string;
  plan_duration_days?: number;
  summary: {
    target_kcal: number;
    target_protein_g: number;
    target_carbs_g: number;
    target_fat_g: number;
    avg_daily_kcal?: number;
  };
  plan_data: {
    days: HubNutritionPlanDay[];
  };
  adherence_data?: Record<string, unknown>;
  notes?: string;
}

export function getAthleteProfile(athleteEmailOrId: string): Promise<HubAthleteProfile> {
  return rateLimiter.execute(() =>
    fetch(`${PROXY_BASE}/athlete-profile?${athleteParam(athleteEmailOrId)}`, {
      method: 'GET',
      headers: getProxyHeaders(),
    }).then((r) => handleResponse<HubAthleteProfile>(r))
  );
}

export interface HubNutritionAnamnesis {
  primary_sport?: string;
  sport_primary?: string;
  sport_secondary?: string;
  weekly_training_hours?: number;
  training_hours_per_week?: number;
  dietary_pattern?: string;
  diet_type?: string;
  food_restrictions?: string[];
  food_allergies?: string[];
  intolerances?: string[];
  meal_frequency?: number;
  meals_per_day?: number;
  supplements?: string[];
  hydration_liters_daily?: number;
  hydration_daily?: number;
  sleep_hours?: number;
  sleep_quality?: number;
  target_weight_kg?: number;
  goal_weight_kg?: number;
  weight_goal?: string;
  target_calories_kcal?: number;
  target_kcal?: number;
  target_protein_g?: number;
  target_carbs_g?: number;
  target_fat_g?: number;
  created_at?: string;
  updated_at?: string;
  notes?: string;
  coach_notes?: string;
  [key: string]: unknown;
}

export function getNutritionAnamnesis(athleteEmailOrId: string): Promise<HubNutritionAnamnesis> {
  return rateLimiter.execute(() =>
    fetch(`${PROXY_BASE}/nutrition-anamnesis?${athleteParam(athleteEmailOrId)}`, {
      method: 'GET',
      headers: getProxyHeaders(),
    }).then((r) => handleResponse<HubNutritionAnamnesis>(r))
  );
}

export function getAnthropometry(athleteEmailOrId: string, limit = 5): Promise<HubAnthropometry> {
  return rateLimiter.execute(() =>
    fetch(`${PROXY_BASE}/anthropometry?${athleteParam(athleteEmailOrId)}&limit=${limit}`, {
      method: 'GET',
      headers: getProxyHeaders(),
    }).then((r) => handleResponse<HubAnthropometry>(r))
  );
}

/** Calls the dedicated biological-passport endpoint (ISAK / Kerr data). */
export function getBiologicalPassport(athleteEmailOrId: string): Promise<HubAnthropometry> {
  return rateLimiter.execute(() =>
    fetch(`${PROXY_BASE}/biological-passport?${athleteParam(athleteEmailOrId)}`, {
      method: 'GET',
      headers: getProxyHeaders(),
    }).then((r) => handleResponse<HubAnthropometry>(r))
  );
}

export function getTrainingSchedule(
  athleteEmailOrId: string,
  dateFrom?: string,
  dateTo?: string
): Promise<HubTrainingSchedule> {
  const dateParams = dateFrom && dateTo ? `&date_from=${dateFrom}&date_to=${dateTo}` : '';
  return rateLimiter.execute(() =>
    fetch(
      `${PROXY_BASE}/training-schedule?${athleteParam(athleteEmailOrId)}${dateParams}`,
      { method: 'GET', headers: getProxyHeaders() }
    ).then((r) => handleResponse<HubTrainingSchedule>(r))
  );
}

export interface HubFoodDiaryEntry {
  date: string;
  meal_type?: string;
  food_name?: string;
  food_name_es?: string;
  quantity_g?: number;
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

export interface HubFoodDiary {
  entries?: HubFoodDiaryEntry[];
  totals_by_day?: Record<string, {
    kcal?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
  }>;
}

export function getFoodDiary(
  athleteEmailOrId: string,
  dateFrom: string,
  dateTo: string
): Promise<HubFoodDiary> {
  return rateLimiter.execute(() =>
    fetch(
      `${PROXY_BASE}/food-diary?${athleteParam(athleteEmailOrId)}&date_from=${dateFrom}&date_to=${dateTo}`,
      { method: 'GET', headers: getProxyHeaders() }
    ).then(async (r) => {
      const raw = await handleResponse<Record<string, unknown>>(r);
      return normalizeFoodDiaryResponse(raw);
    })
  );
}

function normalizeFoodDiaryResponse(raw: Record<string, unknown>): HubFoodDiary {
  if (!raw || typeof raw !== 'object') return {};

  // Already in expected shape
  if (Array.isArray(raw.entries) || raw.totals_by_day) {
    return raw as HubFoodDiary;
  }

  // Hub returns { diary_entries: [...] }
  const rawEntries =
    (raw.diary_entries as HubFoodDiaryEntry[] | undefined) ??
    (raw.records as HubFoodDiaryEntry[] | undefined) ??
    (raw.logs as HubFoodDiaryEntry[] | undefined);

  if (rawEntries && Array.isArray(rawEntries)) {
    const totals_by_day: HubFoodDiary['totals_by_day'] = {};
    for (const e of rawEntries) {
      const day = (e.date ?? '').slice(0, 10);
      if (!day) continue;
      if (!totals_by_day[day]) totals_by_day[day] = {};
      const t = totals_by_day[day]!;
      t.kcal = (t.kcal ?? 0) + (e.kcal ?? 0);
      t.protein_g = (t.protein_g ?? 0) + (e.protein_g ?? 0);
      t.carbs_g = (t.carbs_g ?? 0) + (e.carbs_g ?? 0);
      t.fat_g = (t.fat_g ?? 0) + (e.fat_g ?? 0);
    }
    return { entries: rawEntries, totals_by_day };
  }

  // Hub returns nested by day: { days: { "2026-06-16": { entries: [...], totals: {...} } } }
  const rawDays =
    (raw.days as Record<string, unknown> | undefined) ??
    (raw.diary as Record<string, unknown> | undefined);

  if (rawDays && typeof rawDays === 'object') {
    const entries: HubFoodDiaryEntry[] = [];
    const totals_by_day: HubFoodDiary['totals_by_day'] = {};
    for (const [day, dayData] of Object.entries(rawDays)) {
      const d = dayData as Record<string, unknown>;
      const dayEntries = (d.entries ?? d.items ?? d.records) as HubFoodDiaryEntry[] | undefined;
      if (Array.isArray(dayEntries)) {
        for (const e of dayEntries) {
          entries.push({ ...e, date: e.date ?? day });
        }
      }
      const t = (d.totals ?? d.summary ?? d.macros) as Record<string, number> | undefined;
      if (t) {
        totals_by_day[day] = {
          kcal: t.kcal ?? t.calories,
          protein_g: t.protein_g ?? t.protein,
          carbs_g: t.carbs_g ?? t.carbs ?? t.carbohydrates,
          fat_g: t.fat_g ?? t.fat,
        };
      }
    }
    return { entries, totals_by_day };
  }

  return {};
}

export interface HubHabit {
  id?: string;
  category?: string;
  name?: string;
  name_es?: string;
  frequency?: string;
  target_value?: number;
  target_unit?: string;
  current_streak?: number;
  best_streak?: number;
  compliance_pct?: number;
  last_logged?: string;
  active?: boolean;
}

export interface HubAthleteHabits {
  habits?: HubHabit[];
  sleep_avg_hours?: number;
  hydration_avg_liters?: number;
  recovery_score_avg?: number;
  summary?: {
    total_habits?: number;
    active_habits?: number;
    avg_compliance_pct?: number;
  };
}

export interface HubWellnessEntry {
  date: string;
  fatigue?: number;
  mood?: number;
  sleep_quality?: number;
  sleep_hours?: number;
  muscle_soreness?: number;
  stress?: number;
  motivation?: number;
  hrv?: number;
  resting_hr?: number;
  notes?: string;
  overall_score?: number;
  wellness_score_100?: number;
  urine_color?: number;
}

export interface HubWellness {
  entries?: HubWellnessEntry[];
  latest?: HubWellnessEntry;
  averages?: {
    fatigue?: number;
    mood?: number;
    sleep_quality?: number;
    sleep_hours?: number;
    muscle_soreness?: number;
    stress?: number;
    motivation?: number;
    hrv?: number;
    resting_hr?: number;
    overall_score?: number;
    wellness_score_100?: number;
    urine_color?: number;
  };
}

export function getAthleteHabits(athleteEmailOrId: string, days = 30): Promise<HubAthleteHabits> {
  return rateLimiter.execute(() =>
    fetch(`${PROXY_BASE}/athlete-habits?${athleteParam(athleteEmailOrId)}&days=${days}`, {
      method: 'GET',
      headers: getProxyHeaders(),
    }).then((r) => handleResponse<HubAthleteHabits>(r))
  );
}

export function getWellness(
  athleteEmailOrId: string,
  dateFrom: string,
  dateTo: string
): Promise<HubWellness> {
  return rateLimiter.execute(() =>
    fetch(
      `${PROXY_BASE}/wellness?${athleteParam(athleteEmailOrId)}&date_from=${dateFrom}&date_to=${dateTo}`,
      { method: 'GET', headers: getProxyHeaders() }
    ).then((r) => handleResponse<HubWellness>(r))
  );
}

export function pushNutritionPlan(
  athleteEmailOrId: string,
  payload: HubNutritionPlanPayload
): Promise<{ success: boolean; id?: string }> {
  return rateLimiter.execute(() =>
    fetch(`${PROXY_BASE}/push-nutrition-plan?${athleteParam(athleteEmailOrId)}`, {
      method: 'POST',
      headers: getProxyHeaders(),
      body: JSON.stringify(payload),
    }).then((r) => handleResponse<{ success: boolean; id?: string }>(r))
  );
}

export interface HubTagPayload {
  name: string;
  name_es?: string;
  slug: string;
  category: string;
  color?: string;
  description?: string;
  source_context?: string;
}

export interface PushTagsResult {
  success: boolean;
  saved: string[];
  errors: string[];
  message: string;
}

export function pushTags(
  athleteEmailOrId: string,
  tags: HubTagPayload[]
): Promise<PushTagsResult> {
  return rateLimiter.execute(() =>
    fetch(`${PROXY_BASE}/push-tags?${athleteParam(athleteEmailOrId)}`, {
      method: 'POST',
      headers: getProxyHeaders(),
      body: JSON.stringify({ tags }),
    }).then((r) => handleResponse<PushTagsResult>(r))
  );
}

// ─── Race Plan ────────────────────────────────────────────────────────────────

export interface HubRacePlanSegment {
  time_min: number;
  distance_km: number;
  cho_g: number;
  fluid_ml: number;
  sodium_mg: number;
  caffeine_note: string;
}

export interface HubRacePlanDayMeal {
  timing: string;
  description: string;
  carbs_g: number;
}

export interface HubRacePlanPreCompDay {
  day_label: string;
  carbs_gkg: number;
  total_carbs_g: number;
  protein_g: number;
  total_kcal: number;
  meals: HubRacePlanDayMeal[];
  notes: string;
}

export interface HubRacePlanPayload {
  // Race identity
  race_name: string;
  sport: string;
  race_date: string | null;
  distance_km: number;
  expected_duration_min: number;
  temperature_c: number;
  humidity_pct: number;
  altitude_m: number;

  // Key metrics
  intensity_percent: number;
  intensity_zone: string;
  target_pace_min_km: number;
  pacing_recommendation: string;

  // Carbohydrates
  carbs_g_per_hour: number;
  total_carbs_g: number;
  carb_sources: string[];
  carb_timing: string;

  // Hydration
  fluid_l_per_hour: number;
  total_fluid_l: number;
  sodium_mg_per_hour: number;
  total_sodium_mg: number;
  sweat_rate_l_per_hour: number;
  projected_mass_loss_pct: number;

  // Caffeine
  caffeine_total_mg: number;
  caffeine_mg_per_kg: number;
  caffeine_pre_dose_mg: number;
  caffeine_pre_dose_min_before: number;
  caffeine_mid_race_doses: Array<{ label: string; timing_min: number; mg: number }>;
  caffeine_sources: string[];
  caffeine_notes: string;

  // Race execution segments (every 20–60 min)
  segments: HubRacePlanSegment[];

  // Pre-competition nutrition
  pre_comp_notes: string;
  cho_loading_days: number;
  pre_comp_days: HubRacePlanPreCompDay[];
  race_breakfast_timing: string;
  race_breakfast_description: string;
  race_breakfast_carbs_g: number;

  // GI training (optional)
  gi_training_weeks: number | null;
  gi_training_target_g_per_hour: number | null;
  gi_training_notes: string | null;
  gi_sessions: Array<{
    week: number;
    intake_g_per_hour: number;
    duration: string;
    format: string;
    notes: string;
  }> | null;

  // Risk flags
  risks: Array<{ level: 'warning' | 'critical'; message: string }>;

  // Athlete notes (editable overrides)
  athlete_notes: {
    pacing?: string;
    carbs?: string;
    hydration?: string;
    caffeine?: string;
    general?: string;
  };

  // Metadata
  generated_at: string;
  plan_version: string;
}

export function pushRacePlan(
  athleteEmailOrId: string,
  payload: HubRacePlanPayload
): Promise<{ success: boolean; id?: string }> {
  const bodyStr = JSON.stringify(payload);
  console.log('[pushRacePlan] body que se envía (race_date):', JSON.parse(bodyStr).race_date);
  console.log('[pushRacePlan] body completo:', bodyStr.substring(0, 300));
  return rateLimiter.execute(() =>
    fetch(`${PROXY_BASE}/push-race-plan?${athleteParam(athleteEmailOrId)}`, {
      method: 'POST',
      headers: getProxyHeaders(),
      body: bodyStr,
    }).then((r) => handleResponse<{ success: boolean; id?: string }>(r))
  );
}

// ─── Endurance Data ──────────────────────────────────────────────────────────

export interface HubEnduranceActivity {
  id?: string;
  date: string;
  activity_type?: string;
  session_type?: string;
  title?: string;
  sport?: string;
  distance_km?: number;
  duration_min?: number;
  duration_minutes?: number;
  avg_pace_min_km?: number;
  avg_speed_kmh?: number;
  avg_hr?: number;
  max_hr?: number;
  elevation_gain_m?: number;
  calories_burned?: number;
  tss?: number;
  intensity_color?: string;
  intensity_label?: string;
  source?: string;
  validated?: boolean;
  notes?: string;
}

export interface HubEnduranceData {
  activities?: HubEnduranceActivity[];
  recent_activities?: HubEnduranceActivity[];
  training_logs?: HubEnduranceActivity[];
  summary?: {
    total_distance_km?: number;
    total_duration_min?: number;
    total_activities?: number;
    avg_pace_min_km?: number;
    weekly_volume_km?: number;
  };
}

export function getEnduranceData(
  athleteEmailOrId: string,
  dateFrom?: string,
  dateTo?: string
): Promise<HubEnduranceData> {
  const dateParams = dateFrom && dateTo ? `&date_from=${dateFrom}&date_to=${dateTo}` : '';
  return rateLimiter.execute(() =>
    fetch(`${PROXY_BASE}/endurance-data?${athleteParam(athleteEmailOrId)}${dateParams}`, {
      method: 'GET',
      headers: getProxyHeaders(),
    }).then((r) => handleResponse<HubEnduranceData>(r))
  );
}

// ─── Coach Athletes ──────────────────────────────────────────────────────────
export interface HubCoachAthlete {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  sport_primary?: string;
  membership_slug?: string;
}

export interface HubCoachAthletesResponse {
  athletes?: HubCoachAthlete[];
}

export function getCoachAthletes(coachEmailOrId: string): Promise<HubCoachAthletesResponse> {
  const param = athleteParam(coachEmailOrId).replace('athlete_', 'coach_');
  return rateLimiter.execute(() =>
    fetch(`${PROXY_BASE}/coach-athletes?${param}`, {
      method: 'GET',
      headers: getProxyHeaders(),
    }).then((r) => handleResponse<HubCoachAthletesResponse>(r))
  );
}
