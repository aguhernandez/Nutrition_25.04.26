import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Hub-Planner-Token",
};

const HUB_API_BASE = "https://ngkcbygyoobqhlmlnuvl.supabase.co/functions/v1/planner-hub-api";
const HUB_BRIDGE_BASE = "https://ngkcbygyoobqhlmlnuvl.supabase.co/functions/v1/nutrition-satellite-bridge";
const PLANNER_TOKEN_DEFAULT = "planner_71a6e1bf0ed740638958a79232f1a24a";

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
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const endpoint = segments[segments.length - 1];
    const headerToken = req.headers.get("X-Hub-Planner-Token") ?? "";
    const PLANNER_TOKEN = headerToken && !headerToken.includes("xxxxx") ? headerToken : PLANNER_TOKEN_DEFAULT;

    if (!ALLOWED_ENDPOINTS.has(endpoint)) {
      return new Response(
        JSON.stringify({ error: "Unknown endpoint", endpoint }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isBridge = BRIDGE_ENDPOINTS.has(endpoint);

    // Bridge endpoints require athlete_id (UUID). If only athlete_email is provided, resolve it.
    if (isBridge && url.searchParams.has("athlete_email") && !url.searchParams.has("athlete_id")) {
      const email = url.searchParams.get("athlete_email")!;
      const athleteId = await resolveAthleteId(email, PLANNER_TOKEN);
      if (!athleteId) {
        return new Response(
          JSON.stringify({ error: "Could not resolve athlete_email to athlete_id", email }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
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

    return new Response(JSON.stringify(data), {
      status: hubResponse.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Proxy error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
