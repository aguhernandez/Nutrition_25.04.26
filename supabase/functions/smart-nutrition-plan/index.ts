import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const HUB_BRIDGE_BASE = "https://ngkcbygyoobqhlmlnuvl.supabase.co/functions/v1/nutrition-satellite-bridge";
const HUB_AUTH_ME_URL = "https://hub.asciende.pro/functions/v1/auth-me";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const CALCULATOR_VERSION = "smart-v1";
const PREFLIGHT_CONTRACT_VERSION = "preflight-v1";
const PROFESSIONAL_ROLES = new Set(["coach", "trainer", "nutritionist", "head_coach", "admin"]);
const QUOTA_LIMITS = { full: 1, partial: 2 } as const;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type PlanKind = "personal" | "professional";
type GenerationMode = "full" | "partial";
type RequestAction = "preflight" | "generate";

interface Requester {
  id: string;
  role: string;
  membership_slug: string | null;
}

interface SmartRequest {
  action: RequestAction;
  athlete_id: string;
  plan_kind: PlanKind;
  mode: GenerationMode;
  request_key?: string;
  professional_justification?: string;
  parent_plan_id?: string;
}

class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResponse(error: HttpError) {
  return jsonResponse({ error: error.code, message: error.message, ...error.details }, error.status);
}

function getServiceClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new HttpError(503, "SERVICE_CONFIGURATION", "Service configuration is missing");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

async function getRequester(req: Request): Promise<Requester> {
  const authorization = req.headers.get("Authorization") ?? "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!token) throw new HttpError(401, "UNAUTHORIZED", "Session required");

  const response = await fetch(`${HUB_AUTH_ME_URL}?session_token=${encodeURIComponent(token)}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!response.ok) throw new HttpError(401, "UNAUTHORIZED", "Session is not valid");

  const data = await response.json().catch(() => null);
  const user = data?.user ?? data;
  if (!user?.id) throw new HttpError(401, "UNAUTHORIZED", "Session is not valid");
  return {
    id: String(user.id),
    role: String(user.role ?? "athlete"),
    membership_slug: typeof user.membership_slug === "string" ? user.membership_slug : null,
  };
}

async function getPlannerToken(satellite: ReturnType<typeof getServiceClient>): Promise<string> {
  const { data, error } = await satellite.from("lab_settings").select("planner_token").maybeSingle();
  if (error) throw new HttpError(503, "PLANNER_TOKEN_UNAVAILABLE", "Planner token could not be loaded");
  const token = typeof data?.planner_token === "string" ? data.planner_token.trim() : "";
  if (!token) throw new HttpError(503, "PLANNER_TOKEN_UNAVAILABLE", "Planner token is not configured");
  return token;
}

function parseRequest(body: unknown): SmartRequest {
  const input = (body ?? {}) as Record<string, unknown>;
  const action = input.action === undefined ? "generate" : input.action;
  const athleteId = typeof input.athlete_id === "string" ? input.athlete_id.trim() : "";
  const planKind = input.plan_kind;
  const mode = input.mode;
  const requestKey = typeof input.request_key === "string" ? input.request_key.trim() : "";
  const justification = typeof input.professional_justification === "string"
    ? input.professional_justification.trim()
    : undefined;
  const parentPlanId = typeof input.parent_plan_id === "string" ? input.parent_plan_id.trim() : undefined;

  if (action !== "preflight" && action !== "generate") {
    throw new HttpError(400, "INVALID_REQUEST", "action must be preflight or generate");
  }
  if (!UUID_RE.test(athleteId)) throw new HttpError(400, "INVALID_REQUEST", "athlete_id must be a UUID");
  if (planKind !== "personal" && planKind !== "professional") {
    throw new HttpError(400, "INVALID_REQUEST", "plan_kind must be personal or professional");
  }
  if (mode !== "full" && mode !== "partial") {
    throw new HttpError(400, "INVALID_REQUEST", "mode must be full or partial");
  }
  if (action === "generate" && (requestKey.length < 8 || requestKey.length > 100)) {
    throw new HttpError(400, "INVALID_REQUEST", "request_key must be between 8 and 100 characters");
  }
  if (parentPlanId && !UUID_RE.test(parentPlanId)) {
    throw new HttpError(400, "INVALID_REQUEST", "parent_plan_id must be a UUID");
  }
  return {
    action,
    athlete_id: athleteId,
    plan_kind: planKind,
    mode,
    request_key: requestKey,
    professional_justification: justification,
    parent_plan_id: parentPlanId,
  };
}

async function canProfessionalAccessAthlete(requester: Requester, hubAthleteId: string, plannerToken: string) {
  if (!PROFESSIONAL_ROLES.has(requester.role)) return false;
  const response = await fetch(
    `https://ngkcbygyoobqhlmlnuvl.supabase.co/functions/v1/planner-hub-api/coach-athletes?coach_id=${encodeURIComponent(requester.id)}`,
    { headers: { "Content-Type": "application/json", "X-Planner-Token": plannerToken } },
  );
  if (!response.ok) return false;
  const data = await response.json().catch(() => null);
  const athletes: Array<{ id?: string }> = Array.isArray(data?.athletes) ? data.athletes : [];
  return athletes.some((athlete) => athlete.id === hubAthleteId);
}

async function fetchBridge(endpoint: string, hubAthleteId: string, plannerToken: string): Promise<unknown> {
  const response = await fetch(
    `${HUB_BRIDGE_BASE}/${endpoint}?athlete_id=${encodeURIComponent(hubAthleteId)}`,
    { headers: { "Content-Type": "application/json", "X-Planner-Token": plannerToken } },
  );
  if (!response.ok) {
    throw new HttpError(502, "HUB_UNAVAILABLE", `Hub did not return ${endpoint}`, { endpoint });
  }
  return response.json().catch(() => null);
}

function asNumber(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? parseFloat(value) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function pickNumber(sources: unknown[], keys: string[]): number | null {
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    for (const key of keys) {
      const value = asNumber((source as Record<string, unknown>)[key]);
      if (value !== null) return value;
    }
  }
  return null;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function extractWorkouts(data: unknown): Array<Record<string, unknown>> {
  const record = asRecord(data);
  const list = Array.isArray(data) ? data : record.workouts ?? record.scheduled_workouts ?? [];
  return Array.isArray(list) ? list.map(asRecord) : [];
}

function buildSnapshot(profileData: unknown, anamnesisData: unknown, workoutsData: unknown, diaryData: unknown) {
  // The Hub bridge returns profile and body_composition as siblings. Keep the
  // adapter explicit so a valid Bioimpedance result is not treated as missing.
  const profilePayload = asRecord(profileData);
  const profile = asRecord(profilePayload.profile ?? profileData);
  const bodyComposition = asRecord(profilePayload.body_composition ?? profile.body_composition);
  const anamnesis = asRecord(asRecord(anamnesisData).anamnesis ?? anamnesisData);
  const sources = [bodyComposition, profile, anamnesis];

  // Hub exposes completed 24-hour recalls as food_diary_sessions[].entries.
  // Older bridge versions can still return a flat entry list, so preserve that
  // fallback without assuming an arbitrary `date` field on every entry.
  const diaryRecord = asRecord(diaryData);
  const diarySessions = Array.isArray(diaryData)
    ? diaryData
    : diaryRecord.food_diary_sessions ?? diaryRecord.sessions ?? [];
  const completed24hEntries = (Array.isArray(diarySessions) ? diarySessions : []).reduce((count, session) => {
    const row = asRecord(session);
    const periodHours = asNumber(row.period_hours) ?? 0;
    const status = String(row.status ?? "").toLowerCase();
    const entries = Array.isArray(row.entries) ? row.entries : [];
    return status === "completed" && periodHours >= 24 ? count + entries.length : count;
  }, 0);
  const flatDiaryEntries = Array.isArray(diaryData)
    ? diaryData
    : diaryRecord.entries ?? diaryRecord.food_entries ?? diaryRecord.items ?? [];
  const diaryEntries24h = completed24hEntries > 0
    ? completed24hEntries
    : (Array.isArray(flatDiaryEntries) ? flatDiaryEntries.length : 0);

  const weightKg = pickNumber(sources, ["weight_kg", "body_weight_kg", "weight"]);
  const heightCm = pickNumber(sources, ["height_cm", "body_height_cm", "height"]);
  const sexRaw = String(profile.sex ?? anamnesis.sex ?? "").toLowerCase();
  const sex = sexRaw.startsWith("m") || sexRaw === "male" ? "male"
    : sexRaw.startsWith("f") || sexRaw === "female" ? "female"
    : null;
  const birthDate = typeof profile.date_of_birth === "string" ? profile.date_of_birth : null;
  const ageYears = birthDate
    ? Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 3600 * 1000))
    : pickNumber([profile, anamnesis], ["age"]);

  const today = new Date();
  const weekEnd = new Date(today.getTime() + 7 * 24 * 3600 * 1000);
  const upcoming = extractWorkouts(workoutsData).filter((workout) => {
    const rawDate = workout.scheduled_date ?? workout.date;
    const date = typeof rawDate === "string" ? new Date(rawDate) : null;
    return !date || (date >= today && date <= weekEnd);
  });
  const durationOf = (workout: Record<string, unknown>) => {
    const nested = asRecord(workout.workouts);
    return asNumber(workout.duration_minutes) ?? asNumber(nested.duration_minutes) ?? asNumber(workout.duration_min) ?? 0;
  };
  const weeklyMinutes = upcoming.reduce((sum, workout) => sum + durationOf(workout), 0);
  const weeklyImpulse = upcoming.reduce((sum, workout) => sum + (asNumber(workout.estimated_impulse) ?? 0), 0);

  return {
    weight_kg: weightKg,
    height_cm: heightCm,
    age_years: ageYears && ageYears > 0 ? Math.round(ageYears) : null,
    sex,
    weekly_training_minutes: Math.round(weeklyMinutes),
    weekly_estimated_impulse: Math.round(weeklyImpulse),
    upcoming_workouts: upcoming.length,
    anamnesis_complete: Object.keys(anamnesis).length > 0,
    diary_entries_24h: diaryEntries24h,
    allergies: [anamnesis.food_allergies, anamnesis.allergies_intolerances, anamnesis.intolerances]
      .flatMap((value) => Array.isArray(value) ? value : typeof value === "string" ? value.split(/[,;\n]/) : [])
      .map((value) => String(value).trim().toLowerCase())
      .filter(Boolean),
    dietary_restrictions: [anamnesis.dietary_restrictions, anamnesis.food_restrictions, anamnesis.dietary_pattern]
      .flatMap((value) => Array.isArray(value) ? value : typeof value === "string" ? value.split(/[,;\n]/) : [])
      .map((value) => String(value).trim().toLowerCase())
      .filter(Boolean),
    scheduled_workouts: upcoming.map((workout) => ({
      scheduled_date: typeof (workout.scheduled_date ?? workout.date) === "string" ? String(workout.scheduled_date ?? workout.date) : null,
      duration_minutes: durationOf(workout),
      estimated_impulse: asNumber(workout.estimated_impulse) ?? 0,
    })),
    body_composition_measured_at: typeof bodyComposition.measured_at === "string" ? bodyComposition.measured_at : null,
    anamnesis_updated_at: typeof anamnesis.updated_at === "string" ? anamnesis.updated_at : null,
    diary_completed_at: (Array.isArray(diarySessions) ? diarySessions : [])
      .map((session) => asRecord(session).completed_at)
      .filter((value): value is string => typeof value === "string")
      .sort()
      .at(-1) ?? null,
    captured_at: new Date().toISOString(),
  };
}

function missingFields(snapshot: ReturnType<typeof buildSnapshot>): string[] {
  const required: string[] = [];
  if (snapshot.weight_kg === null) required.push("weight_kg");
  if (snapshot.height_cm === null) required.push("height_cm");
  if (snapshot.age_years === null) required.push("age_years");
  if (snapshot.sex === null) required.push("sex");
  if (!snapshot.anamnesis_complete) required.push("anamnesis");
  if (snapshot.diary_entries_24h === 0) required.push("food_diary_24h");
  return required;
}

function calculateTargets(snapshot: ReturnType<typeof buildSnapshot>) {
  const weight = snapshot.weight_kg as number;
  const height = snapshot.height_cm as number;
  const age = snapshot.age_years as number;
  const sexOffset = snapshot.sex === "male" ? 5 : -161;
  const bmr = 10 * weight + 6.25 * height - 5 * age + sexOffset;

  const weeklyHours = snapshot.weekly_training_minutes / 60;
  const activityFactor = weeklyHours < 3 ? 1.4 : weeklyHours < 6 ? 1.6 : weeklyHours < 10 ? 1.75 : 1.9;
  const calories = Math.round((bmr * activityFactor) / 10) * 10;

  const protein = Math.round(weight * 1.6);
  const fats = Math.round(weight * 1.0);
  const carbs = Math.max(Math.round((calories - protein * 4 - fats * 9) / 4), Math.round(weight * 2));

  return {
    calories_goal: calories,
    protein_goal: protein,
    carbs_goal: carbs,
    fats_goal: fats,
    bmr: Math.round(bmr),
    activity_factor: activityFactor,
  };
}

function daysSince(value: string | null): number | null {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? Math.floor((Date.now() - time) / 86_400_000) : null;
}

/**
 * Builds a transparent 28-day macro calendar. It intentionally does not infer
 * food choices: allergies and restrictions remain hard constraints for the
 * editor/professional rather than an unsafe automatic substitution.
 */
function buildContextualPlan(snapshot: ReturnType<typeof buildSnapshot>, targets: ReturnType<typeof calculateTargets>) {
  const weight = snapshot.weight_kg as number;
  const warnings: string[] = [];
  const bodyAge = daysSince(snapshot.body_composition_measured_at);
  const anamnesisAge = daysSince(snapshot.anamnesis_updated_at);
  const diaryAge = daysSince(snapshot.diary_completed_at);

  if (bodyAge === null || bodyAge > 90) warnings.push("BODY_COMPOSITION_STALE");
  if (anamnesisAge === null || anamnesisAge > 180) warnings.push("ANAMNESIS_STALE");
  if (diaryAge === null || diaryAge > 14) warnings.push("FOOD_DIARY_STALE");
  if (snapshot.allergies.length > 0) warnings.push("ALLERGIES_REVIEW_REQUIRED");
  if (snapshot.dietary_restrictions.length > 0) warnings.push("RESTRICTIONS_REVIEW_REQUIRED");

  const today = new Date();
  const workoutsByDate = new Map(
    snapshot.scheduled_workouts
      .filter((workout) => workout.scheduled_date)
      .map((workout) => [String(workout.scheduled_date).slice(0, 10), workout]),
  );

  const days = Array.from({ length: 28 }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() + index);
    const iso = date.toISOString().slice(0, 10);
    // Training beyond the supplied schedule is deliberately marked provisional,
    // not fabricated. The weekly pattern is repeated only for macro planning.
    const scheduled = workoutsByDate.get(iso) ?? snapshot.scheduled_workouts[index % Math.max(snapshot.scheduled_workouts.length, 1)];
    const duration = scheduled?.duration_minutes ?? 0;
    const carbGkg = duration >= 150 ? 6 : duration >= 76 ? 5 : duration >= 30 ? 4 : 3;
    const carbs = Math.round(weight * carbGkg);
    const protein = Math.round(weight * 1.6);
    const fats = Math.round(weight * 1.0);
    const calories = Math.round((carbs * 4 + protein * 4 + fats * 9) / 10) * 10;
    const intensity = duration >= 150 ? "green" : duration >= 60 ? "yellow" : "red";
    return {
      day: index + 1,
      date: iso,
      status: index < 7 ? "scheduled" : "provisional",
      duration_minutes: Math.round(duration),
      estimated_impulse: Math.round(scheduled?.estimated_impulse ?? 0),
      intensity,
      calories_goal: calories,
      protein_goal: protein,
      carbs_goal: carbs,
      fats_goal: fats,
      carb_g_per_kg: carbGkg,
    };
  });

  // RED-S is not diagnosed by this planner. This flag asks for clinician review
  // when a high-volume day has a notably low carbohydrate target or source data
  // is stale, rather than inventing energy-availability inputs we do not have.
  const redSReviewRequired = days.some((day) => day.duration_minutes >= 90 && day.carb_g_per_kg < 5)
    || warnings.includes("BODY_COMPOSITION_STALE")
    || warnings.includes("FOOD_DIARY_STALE");
  if (redSReviewRequired) warnings.push("RED_S_CLINICAL_REVIEW_REQUIRED");

  return {
    version: "contextual-v1",
    days,
    warnings,
    constraints: {
      allergies: snapshot.allergies,
      dietary_restrictions: snapshot.dietary_restrictions,
      red_s_review_required: redSReviewRequired,
    },
    assumptions: [
      "Carbohydrate periodization uses 3/4/5/6 g/kg by planned duration bands.",
      "Estimated impulse is retained as context and is not converted to calories.",
      "Days after the supplied schedule are provisional until training data is refreshed.",
    ],
  };
}

async function findLocalAthlete(satellite: ReturnType<typeof getServiceClient>, athleteId: string) {
  const { data, error } = await satellite
    .from("profiles")
    .select("id, hub_user_id, membership_slug")
    .eq("id", athleteId)
    .maybeSingle();
  if (error) throw new HttpError(500, "DATABASE_ERROR", "Athlete lookup failed");
  if (!data) throw new HttpError(404, "ATHLETE_NOT_FOUND", "Athlete was not found");
  return data as { id: string; hub_user_id: string | null; membership_slug: string | null };
}

async function createPlanWithQuota(
  satellite: ReturnType<typeof getServiceClient>,
  input: SmartRequest,
  athlete: { id: string },
  requester: Requester,
  coachId: string | null,
  title: string,
  targets: ReturnType<typeof calculateTargets>,
  snapshot: ReturnType<typeof buildSnapshot>,
) {
  const { data, error } = await satellite.rpc("create_smart_plan_with_quota", {
    p_athlete_id: athlete.id,
    p_request_key: input.request_key,
    p_requester_hub_id: requester.id,
    p_kind: input.mode,
    p_title: title,
    p_description: `Generado con ${CALCULATOR_VERSION}`,
    p_calories_goal: targets.calories_goal,
    p_protein_goal: targets.protein_goal,
    p_carbs_goal: targets.carbs_goal,
    p_fats_goal: targets.fats_goal,
    p_plan_kind: input.plan_kind,
    p_smart_status: input.plan_kind === "personal" ? "suggested" : "under_review",
    p_calculator_version: CALCULATOR_VERSION,
    p_source_snapshot: snapshot,
    p_generation_parameters: { mode: input.mode, targets, request_key: input.request_key },
    p_professional_justification: input.professional_justification ?? null,
    p_parent_plan_id: input.parent_plan_id ?? null,
    p_coach_id: coachId,
  });

  if (error) {
    if (error.message.includes("SMART_PLAN_QUOTA_EXCEEDED")) {
      throw new HttpError(429, "QUOTA_EXCEEDED", "Monthly limit reached for this kind of generation", {
        mode: input.mode,
        limit: QUOTA_LIMITS[input.mode],
      });
    }
    if (error.message.includes("SMART_PLAN_REQUEST_KEY_CONFLICT")) {
      throw new HttpError(409, "REQUEST_KEY_CONFLICT", "request_key was already used for another athlete");
    }
    throw new HttpError(500, "DATABASE_ERROR", "Plan could not be saved");
  }

  const row = Array.isArray(data) ? data[0] : data;
  const status = typeof row?.status === "string" ? row.status : "";
  const planId = typeof row?.plan_id === "string" ? row.plan_id : "";
  if (!planId || (status !== "created" && status !== "existing")) {
    throw new HttpError(500, "DATABASE_ERROR", "Plan creation did not return a valid result");
  }

  const plan = await loadPlanById(satellite, planId);
  if (!plan) throw new HttpError(500, "DATABASE_ERROR", "Plan could not be loaded after creation");
  return { status, plan };
}

async function loadPlanById(satellite: ReturnType<typeof getServiceClient>, planId: string) {
  const { data, error } = await satellite.from("meal_plans_v2").select("*").eq("id", planId).maybeSingle();
  if (error) throw new HttpError(500, "DATABASE_ERROR", "Plan lookup failed");
  return data;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") throw new HttpError(405, "METHOD_NOT_ALLOWED", "Use POST");

    const body = await req.json().catch(() => null);
    const input = parseRequest(body);
    const requester = await getRequester(req);
    const satellite = getServiceClient();

    const athlete = await findLocalAthlete(satellite, input.athlete_id);
    const isSelf = requester.id === athlete.hub_user_id || requester.id === athlete.id;

    if (!isSelf && input.plan_kind === "personal") {
      throw new HttpError(403, "FORBIDDEN", "Personal plans can only be generated by the athlete");
    }
    if (isSelf && input.plan_kind === "professional") {
      throw new HttpError(403, "FORBIDDEN", "Professional plans must be requested by a nutritionist");
    }
    if (input.plan_kind === "professional" && !input.professional_justification) {
      throw new HttpError(422, "JUSTIFICATION_REQUIRED", "Professional plans need a justification");
    }
    if (input.mode === "partial" && !input.parent_plan_id) {
      throw new HttpError(422, "PARENT_PLAN_REQUIRED", "Partial reviews need the plan they revise");
    }
    if (!isSelf && !PROFESSIONAL_ROLES.has(requester.role)) {
      throw new HttpError(403, "FORBIDDEN", "Role cannot access this athlete");
    }
    const athleteMembership = isSelf && requester.membership_slug ? requester.membership_slug : athlete.membership_slug;
    if (athleteMembership !== "pro") {
      throw new HttpError(403, "MEMBERSHIP_REQUIRED", "Smart planning requires a Pro membership");
    }

    const plannerToken = await getPlannerToken(satellite);
    const hubAthleteId = athlete.hub_user_id ?? athlete.id;
    if (!isSelf && requester.role !== "admin" && !(await canProfessionalAccessAthlete(requester, hubAthleteId, plannerToken))) {
      throw new HttpError(403, "FORBIDDEN", "Athlete is not on this professional's roster");
    }

    if (input.parent_plan_id) {
      const parent = await loadPlanById(satellite, input.parent_plan_id);
      if (!parent || (parent as { athlete_id: string }).athlete_id !== athlete.id) {
        throw new HttpError(422, "INVALID_PARENT_PLAN", "parent_plan_id does not belong to this athlete");
      }
    }

    const [profileData, anamnesisData, workoutsData, diaryData] = await Promise.all([
      fetchBridge("athlete-profile", hubAthleteId, plannerToken),
      fetchBridge("anamnesis", hubAthleteId, plannerToken),
      fetchBridge("scheduled-workouts", hubAthleteId, plannerToken),
      fetchBridge("food-diary", hubAthleteId, plannerToken),
    ]);

    const snapshot = buildSnapshot(profileData, anamnesisData, workoutsData, diaryData);
    const missing = missingFields(snapshot);

    // Preflight never creates a plan or ledger event. It is safe to call while
    // the athlete/professional completes the data required for generation.
    const targets = missing.length > 0 ? null : calculateTargets(snapshot);
    const contextualPlan = targets ? buildContextualPlan(snapshot, targets) : null;

    if (input.action === "preflight") {
      return jsonResponse({
        status: missing.length > 0 ? "needs_data" : "ready",
        contract_version: PREFLIGHT_CONTRACT_VERSION,
        missing,
        snapshot,
        targets,
        contextual_plan: contextualPlan,
      }, 200);
    }

    if (missing.length > 0) {
      throw new HttpError(422, "SMART_DATA_INCOMPLETE", "Athlete data is incomplete for a smart plan", { missing });
    }

    if (!targets || !contextualPlan) {
      throw new HttpError(500, "CALCULATION_ERROR", "Contextual plan could not be calculated");
    }
    const isPersonal = input.plan_kind === "personal";
    const title = input.mode === "partial"
      ? "Revision de plan inteligente"
      : isPersonal ? "Plan nutricional inteligente" : "Plan nutricional profesional";

    const { data: requesterProfile } = isSelf
      ? { data: null }
      : await satellite.from("profiles").select("id").eq("hub_user_id", requester.id).maybeSingle();

    const result = await createPlanWithQuota(
      satellite,
      input,
      athlete,
      requester,
      requesterProfile?.id ?? null,
      title,
      targets,
      { ...snapshot, contextual_plan: contextualPlan },
    );

    // A smart full plan is a 28-day calendar draft. No meals are fabricated:
    // FullMealEditor receives daily targets and the user/professional chooses
    // foods, which keeps allergies and preferences under explicit review.
    let plan = result.plan;
    if (result.status === "created" && input.mode === "full") {
      const dayOverrides = Object.fromEntries(contextualPlan.days.map((day) => [
        `day_${day.day}`,
        { calories: day.calories_goal, protein: day.protein_goal, carbs: day.carbs_goal, fat: day.fats_goal },
      ]));
      const { error: calendarError } = await satellite.from("meal_plans_v2").update({
        duration_days: 28,
        plan_mode: "calendar",
        start_date: contextualPlan.days[0]?.date,
        week_pattern: contextualPlan.days.map((day) => day.intensity),
        day_overrides: dayOverrides,
        generation_parameters: { mode: input.mode, targets, contextual_plan: contextualPlan, request_key: input.request_key },
      }).eq("id", result.plan.id);
      if (calendarError) throw new HttpError(500, "DATABASE_ERROR", "Monthly calendar could not be prepared");
      plan = await loadPlanById(satellite, result.plan.id);
    }

    return jsonResponse(
      { status: result.status, plan, targets, snapshot, contextual_plan: contextualPlan },
      result.status === "created" ? 201 : 200,
    );
  } catch (error) {
    if (error instanceof HttpError) return errorResponse(error);
    console.error("[smart-nutrition-plan]", error);
    return jsonResponse({ error: "INTERNAL_ERROR", message: "Smart plan generation failed" }, 500);
  }
});
