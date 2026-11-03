import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Planner-Token",
};

const HUB_API_BASE = "https://ngkcbygyoobqhlmlnuvl.supabase.co/functions/v1/planner-hub-api";
const HUB_BRIDGE_BASE = "https://ngkcbygyoobqhlmlnuvl.supabase.co/functions/v1/nutrition-satellite-bridge";
const HUB_AUTH_ME_URL = "https://hub.asciende.pro/functions/v1/auth-me";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const BRIDGE_ENDPOINTS = new Set([
  "athlete-profile",
  "biological-passport",
  "anamnesis",
  "nutrition-anamnesis",
  "nutrition-summary",
  "active-plan",
  "food-diary",
  "training-load",
  "scheduled-workouts",
  "activities",
  "push-nutrition-plan",
  "save-anamnesis",
  "save-food-diary",
]);

const BRIDGE_ALIAS: Record<string, string> = {
  "nutrition-anamnesis": "anamnesis",
};

const LEGACY_ENDPOINTS = new Set([
  "coach-athletes",
  "push-race-plan",
  "push-tags",
  "athlete-habits",
  "wellness",
  "anthropometry",
  "training-schedule",
  "endurance-data",
  "tdee",
]);

const ALLOWED_ENDPOINTS = new Set([...BRIDGE_ENDPOINTS, ...LEGACY_ENDPOINTS]);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface HubRequester {
  id: string;
  email?: string;
  role?: string;
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getRequester(req: Request): Promise<HubRequester | null> {
  const authorization = req.headers.get("Authorization") ?? "";
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const response = await fetch(`${HUB_AUTH_ME_URL}?session_token=${encodeURIComponent(token)}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!response.ok) return null;
  const data = await response.json().catch(() => null);
  const user = data?.user ?? data;
  return user?.id ? { id: String(user.id), email: user.email, role: user.role } : null;
}

async function getPlannerToken(): Promise<string | null> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  const satellite = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await satellite.from("lab_settings").select("planner_token").maybeSingle();
  if (error) {
    console.error("Could not load planner token from lab_settings", error);
    return null;
  }
  return typeof data?.planner_token === "string" && data.planner_token.trim()
    ? data.planner_token.trim()
    : null;
}

async function getCoachAthleteIds(coachId: string, token: string): Promise<Set<string>> {
  const response = await fetch(`${HUB_API_BASE}/coach-athletes?coach_id=${encodeURIComponent(coachId)}`, {
    headers: { "Content-Type": "application/json", "X-Planner-Token": token },
  });
  if (!response.ok) return new Set();
  const data = await response.json().catch(() => null);
  return new Set((data?.athletes ?? []).map((athlete: { id?: string }) => athlete.id).filter(Boolean));
}

async function canAccessAthlete(requester: HubRequester, athleteId: string, token: string): Promise<boolean> {
  if (requester.id === athleteId) return true;
  const professionalRoles = new Set(["coach", "trainer", "nutritionist", "head_coach", "admin"]);
  if (!professionalRoles.has(requester.role ?? "")) return false;
  return (await getCoachAthleteIds(requester.id, token)).has(athleteId);
}

async function toHubAthleteId(athleteId: string): Promise<string> {
  if (!UUID_RE.test(athleteId) || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return athleteId;
  const satellite = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await satellite.from("profiles").select("hub_user_id").or(`id.eq.${athleteId},hub_user_id.eq.${athleteId}`).maybeSingle();
  return data?.hub_user_id ?? athleteId;
}

async function resolveAthleteId(email: string, token: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${HUB_BRIDGE_BASE}/athlete-profile?athlete_email=${encodeURIComponent(email)}`,
      { headers: { "Content-Type": "application/json", "X-Planner-Token": token } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.profile?.id ?? null;
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("hub-data-proxy is missing its required server secrets");
      return jsonResponse({ error: "Service configuration error" }, 503);
    }
    const plannerToken = await getPlannerToken();
    if (!plannerToken) return jsonResponse({ error: "Planner token not configured" }, 503);
    const requester = await getRequester(req);
    if (!requester) return jsonResponse({ error: "Unauthorized" }, 401);

    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const endpoint = segments[segments.length - 1];
    const PLANNER_TOKEN = plannerToken;

    if (!ALLOWED_ENDPOINTS.has(endpoint)) {
      return jsonResponse({ error: "Unknown endpoint", endpoint }, 400);
    }

    const isBridge = BRIDGE_ENDPOINTS.has(endpoint);

    // Bridge endpoints require athlete_id (UUID). If only athlete_email is provided, resolve it.
    if (isBridge && url.searchParams.has("athlete_email") && !url.searchParams.has("athlete_id")) {
      const email = url.searchParams.get("athlete_email")!;
      const athleteId = await resolveAthleteId(email, PLANNER_TOKEN);
      if (!athleteId) {
        return jsonResponse({ error: "Could not resolve athlete_email to athlete_id", email }, 404);
      }
      url.searchParams.delete("athlete_email");
      url.searchParams.set("athlete_id", athleteId);
    }

    // Legacy endpoints: convert athlete_email → athlete_id for consistency
    if (!isBridge && url.searchParams.has("athlete_email") && !url.searchParams.has("athlete_id")) {
      const email = url.searchParams.get("athlete_email")!;
      const athleteId = await resolveAthleteId(email, PLANNER_TOKEN);
      if (athleteId) {
        url.searchParams.delete("athlete_email");
        url.searchParams.set("athlete_id", athleteId);
      }
    }

    if (endpoint === "coach-athletes") {
      const professionalRoles = new Set(["coach", "trainer", "nutritionist", "head_coach", "admin"]);
      if (!professionalRoles.has(requester.role ?? "")) return jsonResponse({ error: "Forbidden" }, 403);
      url.searchParams.delete("coach_id");
      url.searchParams.delete("coach_email");
      url.searchParams.set("coach_id", requester.id);
    }

    const requestedAthleteId = url.searchParams.get("athlete_id");
    if (requestedAthleteId) {
      const hubAthleteId = await toHubAthleteId(requestedAthleteId);
      if (!(await canAccessAthlete(requester, hubAthleteId, PLANNER_TOKEN))) {
        return jsonResponse({ error: "Forbidden" }, 403);
      }
      url.searchParams.set("athlete_id", hubAthleteId);
    }

    const params = url.searchParams.toString();
    const isPush = req.method === "POST";
    let body: string | undefined;
    if (isPush) body = await req.text();

    let hubUrl: string;
    if (isBridge) {
      const bridgeEndpoint = BRIDGE_ALIAS[endpoint] ?? endpoint;
      hubUrl = `${HUB_BRIDGE_BASE}/${bridgeEndpoint}${params ? `?${params}` : ""}`;
    } else {
      hubUrl = `${HUB_API_BASE}/${endpoint}${params ? `?${params}` : ""}`;
    }

    console.log(`[hub-data-proxy] ${req.method} ${endpoint} → ${hubUrl}`);

    const hubResponse = await fetch(hubUrl, {
      method: isPush ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Planner-Token": PLANNER_TOKEN,
      },
      body: body || undefined,
    });

    const responseText = await hubResponse.text();
    let data: unknown;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { error: "Invalid response from Hub", raw: responseText.substring(0, 500) };
    }

    console.log(`[hub-data-proxy] ${endpoint} → Hub responded ${hubResponse.status}`, !hubResponse.ok ? responseText.substring(0, 800) : "");

    return jsonResponse(data, hubResponse.status);
  } catch (error) {
    return jsonResponse({ error: "Proxy error", details: String(error) }, 500);
  }
});
