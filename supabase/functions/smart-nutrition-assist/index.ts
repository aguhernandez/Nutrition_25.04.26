import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};
const HUB_BRIDGE_BASE = "https://ngkcbygyoobqhlmlnuvl.supabase.co/functions/v1/nutrition-satellite-bridge";
const HUB_AUTH_ME_URL = "https://hub.asciende.pro/functions/v1/auth-me";
const HUB_PLANNER_API = "https://ngkcbygyoobqhlmlnuvl.supabase.co/functions/v1/planner-hub-api";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PROFESSIONAL_ROLES = new Set(["coach", "trainer", "nutritionist", "head_coach", "admin"]);

type Language = "es" | "en";
interface Requester { id: string; role: string; membership_slug: string | null }
interface FoodCandidate {
  id: string; name: string; category: string | null;
  calories_per_100g: number | null; carbs_per_100g: number | null;
  protein_per_100g: number | null; fat_per_100g: number | null;
}
class HttpError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: Record<string, unknown>) {
    super(message);
  }
}
const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, "Content-Type": "application/json" },
});
const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? value as Record<string, unknown> : {};
const asTextList = (value: unknown): string[] =>
  (Array.isArray(value) ? value : typeof value === "string" ? value.split(/[,;\n]/) : [])
    .map(String).map((item) => item.trim().toLowerCase()).filter(Boolean);

function service() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new HttpError(503, "SERVICE_CONFIGURATION", "Service configuration is missing");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}
function parseInput(body: unknown) {
  const input = asRecord(body);
  const athleteId = typeof input.athlete_id === "string" ? input.athlete_id.trim() : "";
  const notes = typeof input.preference_notes === "string" ? input.preference_notes.trim() : "";
  const language: Language = input.language === "en" ? "en" : "es";
  if (!UUID_RE.test(athleteId)) throw new HttpError(400, "INVALID_REQUEST", "athlete_id must be a UUID");
  if (notes.length > 500) throw new HttpError(400, "INVALID_REQUEST", "preference_notes must not exceed 500 characters");
  return { athleteId, notes, language };
}
async function requester(req: Request): Promise<Requester> {
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!token) throw new HttpError(401, "UNAUTHORIZED", "Session required");
  const auth = await fetch(`${HUB_AUTH_ME_URL}?session_token=${encodeURIComponent(token)}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  const payload = await auth.json().catch(() => null);
  const user = payload?.user ?? payload;
  if (!auth.ok || !user?.id) throw new HttpError(401, "UNAUTHORIZED", "Session is not valid");
  return { id: String(user.id), role: String(user.role ?? "athlete"), membership_slug: typeof user.membership_slug === "string" ? user.membership_slug : null };
}
async function plannerToken(db: ReturnType<typeof service>) {
  const { data, error } = await db.from("lab_settings").select("planner_token").maybeSingle();
  const token = typeof data?.planner_token === "string" ? data.planner_token.trim() : "";
  if (error || !token) throw new HttpError(503, "PLANNER_TOKEN_UNAVAILABLE", "Planner token is not configured");
  return token;
}
async function localAthlete(db: ReturnType<typeof service>, athleteId: string) {
  const { data, error } = await db.from("profiles").select("id, hub_user_id, membership_slug").eq("id", athleteId).maybeSingle();
  if (error) throw new HttpError(500, "DATABASE_ERROR", "Athlete lookup failed");
  if (!data) throw new HttpError(404, "ATHLETE_NOT_FOUND", "Athlete was not found");
  return data as { id: string; hub_user_id: string | null; membership_slug: string | null };
}
async function professionalCanAccess(requesterId: string, hubAthleteId: string, token: string) {
  const result = await fetch(`${HUB_PLANNER_API}/coach-athletes?coach_id=${encodeURIComponent(requesterId)}`, {
    headers: { "Content-Type": "application/json", "X-Planner-Token": token },
  });
  const data = await result.json().catch(() => null);
  return result.ok && Array.isArray(data?.athletes) && data.athletes.some((athlete: { id?: string }) => athlete.id === hubAthleteId);
}
async function bridge(endpoint: string, hubAthleteId: string, token: string) {
  const result = await fetch(`${HUB_BRIDGE_BASE}/${endpoint}?athlete_id=${encodeURIComponent(hubAthleteId)}`, {
    headers: { "Content-Type": "application/json", "X-Planner-Token": token },
  });
  if (!result.ok) throw new HttpError(502, "HUB_UNAVAILABLE", `Hub did not return ${endpoint}`);
  return result.json().catch(() => null);
}
function constraintsFromAnamnesis(payload: unknown) {
  const record = asRecord(payload);
  const anamnesis = asRecord(record.anamnesis ?? payload);
  return {
    allergies: [anamnesis.food_allergies, anamnesis.allergies_intolerances, anamnesis.intolerances].flatMap(asTextList),
    restrictions: [anamnesis.dietary_restrictions, anamnesis.food_restrictions, anamnesis.dietary_pattern].flatMap(asTextList),
  };
}
async function candidates(db: ReturnType<typeof service>, language: Language): Promise<FoodCandidate[]> {
  const { data, error } = await db
    .from("foods_v2")
    .select("id,name_es,name_en,category,calories_per_100g,carbs_per_100g,protein_per_100g,fat_per_100g")
    .eq("is_supplement", false)
    .order(language === "en" ? "name_en" : "name_es")
    .limit(100);
  if (error) throw new HttpError(500, "DATABASE_ERROR", "Food library could not be loaded");
  return (data ?? []).map((food: Record<string, unknown>) => ({
    id: String(food.id), name: String(food[language === "en" ? "name_en" : "name_es"] ?? food.name_en ?? food.name_es ?? ""),
    category: typeof food.category === "string" ? food.category : null,
    calories_per_100g: typeof food.calories_per_100g === "number" ? food.calories_per_100g : null,
    carbs_per_100g: typeof food.carbs_per_100g === "number" ? food.carbs_per_100g : null,
    protein_per_100g: typeof food.protein_per_100g === "number" ? food.protein_per_100g : null,
    fat_per_100g: typeof food.fat_per_100g === "number" ? food.fat_per_100g : null,
  })).filter((food: FoodCandidate) => food.name);
}
function safeArray(value: unknown, max = 8) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, max) : [];
}
async function askGemini(input: {
  language: Language; notes: string; restrictions: string[]; foods: FoodCandidate[];
}) {
  if (!GEMINI_API_KEY) throw new HttpError(503, "AI_CONFIGURATION", "AI assistance is not configured");
  const languageLabel = input.language === "en" ? "English" : "Spanish";
  const prompt = [
    "You are a nutrition-planning assistant. Return JSON only.",
    "This is a read-only proposal. Never prescribe treatment, diagnose, calculate RED-S, invent food facts, or propose an item outside CANDIDATES.",
    "Select at most 8 IDs from CANDIDATES. Respect RESTRICTIONS as hard exclusions. If constraints cannot be satisfied, return selected_food_ids: [] and explain why.",
    "Report in " + languageLabel + ".",
    "Required JSON schema: {\"selected_food_ids\":string[],\"rationale\":string[],\"restriction_checks\":string[],\"uncertainties\":string[],\"report\":string,\"requires_professional_review\":boolean}.",
    "PREFERENCES: " + (input.notes || "(none)"),
    "RESTRICTIONS: " + JSON.stringify(input.restrictions),
    "CANDIDATES: " + JSON.stringify(input.foods),
  ].join("\n");
  let lastError = "";
  for (const model of ["gemini-2.5-flash", "gemini-flash-latest"]) {
    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" },
      }),
    });
    const payload = await result.json().catch(() => null);
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (result.ok && typeof text === "string") {
      try { return JSON.parse(text) as Record<string, unknown>; } catch { lastError = "invalid JSON"; }
    } else lastError = payload?.error?.message ?? `HTTP ${result.status}`;
  }
  throw new HttpError(502, "AI_UNAVAILABLE", "AI assistance is temporarily unavailable", { reason: lastError });
}
function validateProposal(raw: Record<string, unknown>, foods: FoodCandidate[]) {
  const allowed = new Set(foods.map((food) => food.id));
  const ids = safeArray(raw.selected_food_ids, 8);
  if (!Array.isArray(raw.selected_food_ids) || ids.length !== raw.selected_food_ids.length || ids.some((id) => !allowed.has(id))) {
    throw new HttpError(502, "AI_INVALID_RESPONSE", "AI returned an invalid food selection");
  }
  return {
    selected_food_ids: ids,
    foods: ids.map((id) => foods.find((food) => food.id === id)).filter(Boolean),
    rationale: safeArray(raw.rationale),
    restriction_checks: safeArray(raw.restriction_checks),
    uncertainties: safeArray(raw.uncertainties),
    report: typeof raw.report === "string" ? raw.report.slice(0, 1200) : "",
    requires_professional_review: raw.requires_professional_review === true,
  };
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  try {
    if (req.method !== "POST") throw new HttpError(405, "METHOD_NOT_ALLOWED", "Use POST");
    const input = parseInput(await req.json().catch(() => null));
    const user = await requester(req);
    const db = service();
    const athlete = await localAthlete(db, input.athleteId);
    const isSelf = user.id === athlete.id || user.id === athlete.hub_user_id;
    if (!isSelf && !PROFESSIONAL_ROLES.has(user.role)) throw new HttpError(403, "FORBIDDEN", "Role cannot access this athlete");
    const membership = isSelf && user.membership_slug ? user.membership_slug : athlete.membership_slug;
    if (membership !== "pro") throw new HttpError(403, "MEMBERSHIP_REQUIRED", "Smart planning requires a Pro membership");
    const token = await plannerToken(db);
    const hubAthleteId = athlete.hub_user_id ?? athlete.id;
    if (!isSelf && user.role !== "admin" && !(await professionalCanAccess(user.id, hubAthleteId, token))) {
      throw new HttpError(403, "FORBIDDEN", "Athlete is not on this professional's roster");
    }
    const constraints = constraintsFromAnamnesis(await bridge("anamnesis", hubAthleteId, token));
    // Foods have no verified allergen metadata. Returning any selection in this
    // case would falsely claim safety, so the assistant refuses and requests review.
    if (constraints.allergies.length > 0) {
      return response({
        selected_food_ids: [], foods: [], rationale: [],
        restriction_checks: ["Allergy or intolerance present: automatic food selection withheld."],
        uncertainties: ["The food library does not carry verified allergen metadata."],
        report: input.language === "en"
          ? "No foods were suggested because the recorded allergy/intolerance requires manual professional verification."
          : "No se sugirieron alimentos porque la alergia o intolerancia registrada requiere verificación manual profesional.",
        requires_professional_review: true,
      });
    }
    const foodList = await candidates(db, input.language);
    if (!foodList.length) throw new HttpError(503, "FOOD_LIBRARY_EMPTY", "Food library has no eligible candidates");
    const proposal = validateProposal(await askGemini({
      language: input.language, notes: input.notes, restrictions: constraints.restrictions, foods: foodList,
    }), foodList);
    return response({ ...proposal, proposal_only: true });
  } catch (error) {
    if (error instanceof HttpError) return response({ error: error.code, message: error.message, ...error.details }, error.status);
    console.error("[smart-nutrition-assist]", error);
    return response({ error: "INTERNAL_ERROR", message: "AI assistance failed" }, 500);
  }
});
