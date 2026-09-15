import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Hub-Planner-Token",
};

// Legacy API (coach-athletes, push-race-plan, push-tags, wellness, athlete-habits)
const HUB_API_BASE = "https://ngkcbygyoobqhlmlnuvl.supabase.co/functions/v1/planner-hub-api";
// New bridge (all nutrition/athlete data endpoints)
const HUB_BRIDGE_BASE = "https://ngkcbygyoobqhlmlnuvl.supabase.co/functions/v1/nutrition-satellite-bridge";
const PLANNER_TOKEN_DEFAULT = "planner_717ed201d73949a6b59b702a5d705958";

// Endpoints served by the nutrition-satellite-bridge
const BRIDGE_ENDPOINTS = new Set([
  "athlete-profile",
  "biological-passport",
  "anamnesis",
  "nutrition-anamnesis",   // alias → anamnesis
  "nutrition-summary",
  "active-plan",
  "food-diary",
  "training-load",
  "scheduled-workouts",
  "activities",
  "push-nutrition-plan",
]);

// Internal alias normalisation: what the frontend calls → what the bridge expects
const BRIDGE_ALIAS: Record<string, string> = {
  "nutrition-anamnesis": "anamnesis",
};

// Endpoints still on the legacy planner-hub-api
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

    const params = url.searchParams.toString();
    const isPush = req.method === "POST";
    let body: string | undefined;
    if (isPush) body = await req.text();

    let hubUrl: string;
    if (BRIDGE_ENDPOINTS.has(endpoint)) {
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
