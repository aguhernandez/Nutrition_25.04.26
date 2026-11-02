import { createClient } from "npm:@supabase/supabase-js@2";
import { parseGpxTrack, type GpxTrackSummary } from "./gpx.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GEMINI_MODELS = ["gemini-flash-latest", "gemini-2.5-flash"];
const MAX_QUERY_LENGTH = 120;
const MAX_GPX_BYTES = 5 * 1024 * 1024;
const GPX_TIMEOUT_MS = 15000;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function buildPrompt(query: string, sport: string): string {
  return `You are researching a sports event for a race catalog.
Event (as typed by the user): "${query}"
Sport: ${sport}

Use Google Search to find the official information for this event (the most recent edition). Reply ONLY with a JSON object, no markdown, with these keys:
{
  "name": official event name,
  "country": country name in English,
  "city": main city or town of the start,
  "distance_km": total distance in kilometres (number),
  "elevation_gain_m": total positive elevation gain in metres (number, D+),
  "typical_month": month of the event (1-12),
  "typical_day": day of the month (1-31),
  "race_date": next or most recent known date as YYYY-MM-DD, or null,
  "description": one short sentence in Spanish describing the event,
  "gpx_url": a direct https link to a public GPX track file of this race course (the .gpx file itself, not a web page), or null,
  "found": true if you found reliable information, false otherwise
}
If you cannot find reliable information, return found false and use null for numeric fields.`;
}

function isSafeGpxUrl(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  const isIpLiteral = /^[\d.]+$/.test(host) || host.includes(":");
  if (url.protocol !== "https:" || isIpLiteral || host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) {
    return null;
  }
  return url;
}

async function fetchGpxTrack(raw: string): Promise<GpxTrackSummary | null> {
  const url = isSafeGpxUrl(raw);
  if (!url) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(GPX_TIMEOUT_MS) });
    if (!res.ok) return null;
    if (res.url && !isSafeGpxUrl(res.url)) return null;
    const declared = Number(res.headers.get("content-length") ?? 0);
    if (declared > MAX_GPX_BYTES) return null;
    const text = await res.text();
    if (text.length > MAX_GPX_BYTES) return null;
    return parseGpxTrack(text);
  } catch {
    return null;
  }
}

function extractJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!geminiKey || !supabaseUrl || !serviceKey) {
      return jsonResponse({ error: "Server is not configured" }, 500);
    }

    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const body = await req.json().catch(() => null);
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    const sport = typeof body?.sport === "string" ? body.sport.trim() : "";
    if (query.length < 3 || query.length > MAX_QUERY_LENGTH || sport.length === 0 || sport.length > 40) {
      return jsonResponse({ error: "Invalid query or sport" }, 400);
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const requestBody = JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(query, sport) }] }],
      tools: [{ google_search: {} }],
      generationConfig: { temperature: 0.2 },
    });
    let geminiRes: Response | null = null;
    for (const model of GEMINI_MODELS) {
      geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
          body: requestBody,
        },
      );
      if (geminiRes.status !== 404) break;
    }
    if (!geminiRes || !geminiRes.ok) {
      return jsonResponse({ error: `AI service error (${geminiRes?.status ?? "no response"})` }, 502);
    }

    const geminiData = await geminiRes.json();
    const candidate = geminiData?.candidates?.[0];
    const text: string = (candidate?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
    const parsed = extractJson(text);
    if (!parsed || parsed.found !== true) {
      return jsonResponse({ error: "No reliable information found for this race" }, 404);
    }

    const name = typeof parsed.name === "string" ? parsed.name.trim() : "";
    const country = typeof parsed.country === "string" ? parsed.country.trim() : "";
    const city = typeof parsed.city === "string" ? parsed.city.trim() : "";
    const distanceKm = Number(parsed.distance_km);
    const elevationGainM = Number(parsed.elevation_gain_m);
    const typicalMonth = Number(parsed.typical_month);
    const typicalDay = Number(parsed.typical_day ?? 1);
    const raceDate = typeof parsed.race_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(parsed.race_date)
      ? parsed.race_date
      : null;
    const description = typeof parsed.description === "string" ? parsed.description.trim() : "";
    const gpxUrl = typeof parsed.gpx_url === "string" ? parsed.gpx_url.trim() : "";

    if (
      !name || !country || !city ||
      !Number.isFinite(distanceKm) || distanceKm <= 0 ||
      !Number.isFinite(elevationGainM) || elevationGainM < 0 ||
      !Number.isInteger(typicalMonth) || typicalMonth < 1 || typicalMonth > 12 ||
      !Number.isInteger(typicalDay) || typicalDay < 1 || typicalDay > 31
    ) {
      return jsonResponse({ error: "AI returned incomplete data" }, 502);
    }

    const { data: existing, error: existingError } = await supabase
      .from("races_catalog")
      .select("*")
      .eq("sport", sport)
      .ilike("name", name)
      .limit(1)
      .maybeSingle();
    if (existingError) {
      return jsonResponse({ error: "Could not check the catalog" }, 500);
    }
    if (existing) {
      return jsonResponse({ race: existing, created: false, elevation_status: "existing" });
    }

    const track = gpxUrl ? await fetchGpxTrack(gpxUrl) : null;

    const groundingChunks = candidate?.groundingMetadata?.groundingChunks ?? [];
    const sourceUrl: string | null = groundingChunks.find((c: { web?: { uri?: string } }) => c.web?.uri)?.web?.uri ?? null;

    const { data: inserted, error: insertError } = await supabase
      .from("races_catalog")
      .insert({
        name,
        sport,
        country,
        city,
        distance_km: track?.distanceKm ?? distanceKm,
        elevation_gain_m: track?.elevationGainM ?? elevationGainM,
        typical_month: typicalMonth,
        typical_day: typicalDay,
        race_date: raceDate,
        description,
        is_verified: false,
        data_source: "ai_draft",
        source_url: sourceUrl,
      })
      .select("*")
      .single();
    if (insertError || !inserted) {
      return jsonResponse({ error: "Could not save the race" }, 500);
    }

    let elevationStatus: "gpx" | "not_found" = "not_found";
    if (track) {
      const { error: profileError } = await supabase
        .from("race_elevation_data")
        .upsert(
          {
            race_catalog_id: inserted.id,
            elevation_points: track.profile,
            source: "gpx_auto",
            updated_by: "ai_lookup",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "race_catalog_id" },
        );
      if (!profileError) elevationStatus = "gpx";
    }

    return jsonResponse({ race: inserted, created: true, elevation_status: elevationStatus });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return jsonResponse({ error: message }, 500);
  }
});
