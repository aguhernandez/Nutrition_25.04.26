import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const HUB_API_URL = "https://hub.asciende.pro";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface HubUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  membership_slug?: string;
  membership_name?: string;
}

async function ensureUserInSatellite(hubUser: HubUser) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing Supabase environment variables");
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: existingUser, error: selectError } = await supabase
    .from("profiles")
    .select("id")
    .eq("hub_user_id", hubUser.id)
    .maybeSingle();

  if (selectError && selectError.code !== "PGRST116") {
    console.error("Error checking existing user:", selectError);
    return;
  }

  if (existingUser) {
    console.log("User already exists in satellite");
    return;
  }

  const { error: insertError } = await supabase
    .from("profiles")
    .insert({
      hub_user_id: hubUser.id,
      email: hubUser.email,
      full_name: hubUser.name || hubUser.email.split("@")[0],
      role: hubUser.role || "athlete",
      membership_slug: hubUser.membership_slug || "inicia",
      membership_name: hubUser.membership_name || "Asciende Inicia",
    });

  if (insertError) {
    console.error("Error creating user in satellite:", insertError);
  } else {
    console.log("User created in satellite:", hubUser.id);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const pathname = url.pathname;

    let hubUrl: string;
    let method = req.method;
    let body: string | undefined;

    const token = authHeader.replace(/^Bearer\s+/i, "");

    if (pathname.endsWith("/logout")) {
      hubUrl = `${HUB_API_URL}/functions/v1/auth-logout`;
      method = "POST";
      body = req.method === "POST" ? await req.text() : undefined;
    } else {
      hubUrl = `${HUB_API_URL}/functions/v1/auth-me?session_token=${encodeURIComponent(token)}`;
      method = "GET";
    }

    console.log("[Proxy] Calling HUB:", hubUrl.replace(token, token.substring(0, 20) + "..."));

    const hubResponse = await fetch(hubUrl, {
      method,
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: body || undefined,
    });

    const responseText = await hubResponse.text();

    let data: unknown;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { error: "Invalid response from HUB", raw: responseText.substring(0, 500) };
    }

    if (hubResponse.ok && method === "GET" && typeof data === "object" && data !== null) {
      const hubUser = (data as Record<string, unknown>).user ?? data;
      if (typeof hubUser === "object" && hubUser !== null && "id" in hubUser) {
        await ensureUserInSatellite(hubUser as HubUser);
      }
    }

    return new Response(JSON.stringify(data), {
      status: hubResponse.ok ? hubResponse.status : 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Proxy error", details: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
