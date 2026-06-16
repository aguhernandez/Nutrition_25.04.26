import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const HUB_API_BASE = "https://ngkcbygyoobqhlmlnuvl.supabase.co/functions/v1/planner-hub-api";
const HUB_BRIDGE_BASE = "https://ngkcbygyoobqhlmlnuvl.supabase.co/functions/v1/nutrition-satellite-bridge";
const PLANNER_TOKEN = Deno.env.get("HUB_PLANNER_TOKEN") ?? "";

// Endpoints that live on the nutrition-satellite-bridge function.
// Key = what the planner calls, value = what the Hub bridge calls.
const BRIDGE_ENDPOINT_MAP: Record<string, string> = {
  "biological-passport": "biological-passport",
  "nutrition-anamnesis": "anamnesis",
  "food-diary": "food-diary",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    const segments = pathname.split("/");
    const endpoint = segments[segments.length - 1];

    const ALLOWED_ENDPOINTS = [
      "athlete-profile",
      "anthropometry",
      "training-schedule",
      "endurance-data",
      "food-diary",
      "push-nutrition-plan",
      "push-race-plan",
      "push-tags",
      "athlete-habits",
      "wellness",
      "biological-passport",
      "nutrition-anamnesis",
      "coach-athletes",
    ];

    if (!ALLOWED_ENDPOINTS.includes(endpoint)) {
      return new Response(
        JSON.stringify({ error: "Unknown endpoint", endpoint }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const params = url.searchParams.toString();

    let hubUrl: string;
    if (endpoint in BRIDGE_ENDPOINT_MAP) {
      const hubEndpoint = BRIDGE_ENDPOINT_MAP[endpoint];
      hubUrl = `${HUB_BRIDGE_BASE}/${hubEndpoint}${params ? `?${params}` : ""}`;
    } else {
      hubUrl = `${HUB_API_BASE}/${endpoint}${params ? `?${params}` : ""}`;
    }

    const isPush = req.method === "POST";
    let body: string | undefined;
    if (isPush) {
      body = await req.text();
      if (endpoint === "push-race-plan") {
        try {
          const parsed = JSON.parse(body);
          console.log(`[hub-data-proxy] push-race-plan race_date received: ${JSON.stringify(parsed.race_date)}`);
        } catch { /* ignore */ }
      }
    }

    console.log(`[hub-data-proxy] ${endpoint} → ${hubUrl}`);

    const isBridgeEndpoint = endpoint in BRIDGE_ENDPOINT_MAP;

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

    const hubStatus = hubResponse.status;
    console.log(`[hub-data-proxy] ${endpoint} → Hub responded ${hubStatus}`, !hubResponse.ok ? responseText.substring(0, 800) : "");

    return new Response(JSON.stringify(data), {
      status: hubStatus,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Proxy error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});


Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    const segments = pathname.split("/");
    const endpoint = segments[segments.length - 1];

    const ALLOWED_ENDPOINTS = [
      "athlete-profile",
      "anthropometry",
      "training-schedule",
      "endurance-data",
      "food-diary",
      "push-nutrition-plan",
      "push-race-plan",
      "push-tags",
      "athlete-habits",
      "wellness",
      "biological-passport",
      "nutrition-anamnesis",
      "coach-athletes",
    ];

    if (!ALLOWED_ENDPOINTS.includes(endpoint)) {
      return new Response(
        JSON.stringify({ error: "Unknown endpoint", endpoint }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const params = url.searchParams.toString();
    const hubUrl = `${HUB_API_BASE}/${endpoint}${params ? `?${params}` : ""}`;

    const isPush = req.method === "POST";
    let body: string | undefined;
    if (isPush) {
      body = await req.text();
      if (endpoint === "push-race-plan") {
        try {
          const parsed = JSON.parse(body);
          console.log(`[hub-data-proxy] push-race-plan race_date received: ${JSON.stringify(parsed.race_date)}`);
        } catch { /* ignore */ }
      }
    }

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

    const hubStatus = hubResponse.status;
    console.log(`[hub-data-proxy] ${endpoint} → Hub responded ${hubStatus}`, !hubResponse.ok ? responseText.substring(0, 800) : "");

    return new Response(JSON.stringify(data), {
      status: hubStatus,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Proxy error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
