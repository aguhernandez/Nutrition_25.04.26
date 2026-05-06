import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const USDA_BASE = "https://api.nal.usda.gov/fdc/v1";

const NUTRIENT_IDS: Record<string, string> = {
  "1008": "calories_kcal",
  "1003": "protein_g",
  "1005": "carbs_g",
  "1004": "fat_g",
  "1079": "fiber_g",
  "2000": "sugar_g",
  "1093": "sodium_mg",
  "1092": "potassium_mg",
  "1087": "calcium_mg",
  "1089": "iron_mg",
  "1090": "magnesium_mg",
  "1091": "phosphorus_mg",
  "1095": "zinc_mg",
  "1106": "vitamin_a_ug",
  "1165": "vitamin_b1_mg",
  "1166": "vitamin_b2_mg",
  "1167": "vitamin_b3_mg",
  "1175": "vitamin_b6_mg",
  "1178": "vitamin_b12_ug",
  "1162": "vitamin_c_mg",
  "1114": "vitamin_d_ug",
  "1109": "vitamin_e_mg",
  "1185": "vitamin_k_ug",
  "1177": "folate_ug",
};

const SPANISH_TRANSLATIONS: Record<string, string> = {
  chicken: "pollo",
  breast: "pechuga",
  salmon: "salmón",
  tuna: "atún",
  egg: "huevo",
  eggs: "huevos",
  beef: "carne de res",
  yogurt: "yogur",
  milk: "leche",
  cheese: "queso",
  rice: "arroz",
  oats: "avena",
  quinoa: "quinoa",
  bread: "pan",
  pasta: "pasta",
  banana: "banana",
  apple: "manzana",
  orange: "naranja",
  strawberry: "frutilla",
  strawberries: "frutillas",
  blueberry: "arándano",
  blueberries: "arándanos",
  broccoli: "brócoli",
  spinach: "espinaca",
  potato: "papa",
  sweet: "dulce",
  carrot: "zanahoria",
  carrots: "zanahorias",
  tomato: "tomate",
  tomatoes: "tomates",
  pepper: "pimiento",
  peppers: "pimientos",
  almond: "almendra",
  almonds: "almendras",
  walnut: "nuez",
  walnuts: "nueces",
  peanut: "maní",
  butter: "mantequilla",
  chia: "chía",
  bean: "frijol",
  beans: "frijoles",
  chickpea: "garbanzo",
  chickpeas: "garbanzos",
  lentil: "lenteja",
  lentils: "lentejas",
  olive: "aceituna",
  oil: "aceite",
  avocado: "palta",
  fish: "pescado",
  raw: "crudo",
  cooked: "cocido",
  whole: "integral",
  ground: "molido",
  brown: "integral",
  wheat: "trigo",
  lean: "magro",
  fat: "grasa",
  reduced: "reducida",
  low: "bajo",
  plain: "natural",
  nonfat: "descremado",
  greek: "griego",
  atlantic: "atlántico",
  wild: "silvestre",
  boneless: "sin hueso",
  skinless: "sin piel",
  meat: "carne",
  only: "solo",
  broiler: "pollo de granja",
  cheddar: "cheddar",
  black: "negro",
};

function translateName(englishName: string): string {
  const lower = englishName.toLowerCase();
  let translated = lower;
  for (const [en, es] of Object.entries(SPANISH_TRANSLATIONS)) {
    translated = translated.replace(new RegExp(`\\b${en}\\b`, "gi"), es);
  }
  return translated
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function extractNutrients(foodNutrients: any[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const n of foodNutrients) {
    const nutrientId = String(n.nutrient?.id ?? n.nutrientId ?? "");
    const field = NUTRIENT_IDS[nutrientId];
    if (field && n.amount != null) {
      result[field] = Number(n.amount);
    }
  }
  return result;
}

function mapCategory(usda: string): string {
  const u = usda.toLowerCase();
  if (u.includes("chicken") || u.includes("beef") || u.includes("pork") || u.includes("poultry")) return "meat";
  if (u.includes("fish") || u.includes("salmon") || u.includes("tuna") || u.includes("seafood")) return "fish";
  if (u.includes("egg")) return "egg";
  if (u.includes("milk") || u.includes("cheese") || u.includes("yogurt") || u.includes("dairy")) return "dairy";
  if (u.includes("rice") || u.includes("oat") || u.includes("bread") || u.includes("pasta") || u.includes("grain") || u.includes("wheat") || u.includes("quinoa")) return "grain";
  if (u.includes("apple") || u.includes("banana") || u.includes("berry") || u.includes("orange") || u.includes("fruit")) return "fruit";
  if (u.includes("broccoli") || u.includes("spinach") || u.includes("carrot") || u.includes("tomato") || u.includes("pepper") || u.includes("vegetable") || u.includes("potato")) return "vegetable";
  if (u.includes("almond") || u.includes("walnut") || u.includes("peanut") || u.includes("nut") || u.includes("seed") || u.includes("chia")) return "nuts";
  if (u.includes("bean") || u.includes("lentil") || u.includes("chickpea") || u.includes("legume")) return "legume";
  if (u.includes("oil") || u.includes("avocado") || u.includes("fat")) return "fat";
  return "other";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const apiKey = Deno.env.get("USDA_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "USDA_API_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/usda-proxy/, "");

    if (path === "/search" || path === "") {
      const query = url.searchParams.get("query") ?? "";
      const pageSize = url.searchParams.get("pageSize") ?? "25";
      const dataType = url.searchParams.get("dataType") ?? "Foundation,SR Legacy";

      if (!query) {
        return new Response(
          JSON.stringify({ error: "query parameter required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const usdaUrl = `${USDA_BASE}/foods/search?query=${encodeURIComponent(query)}&pageSize=${pageSize}&dataType=${encodeURIComponent(dataType)}&api_key=${apiKey}`;
      const usdaRes = await fetch(usdaUrl);
      const usdaData = await usdaRes.json();

      const foods = (usdaData.foods ?? []).map((f: any) => ({
        fdcId: f.fdcId,
        description: f.description,
        name_en: f.description,
        name_es: translateName(f.description),
        category: mapCategory(f.description),
        dataType: f.dataType,
        nutrients: extractNutrients(f.foodNutrients ?? []),
      }));

      return new Response(
        JSON.stringify({ foods, totalHits: usdaData.totalHits }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (path.startsWith("/food/")) {
      const fdcId = path.replace("/food/", "").split("?")[0];
      const usdaUrl = `${USDA_BASE}/food/${fdcId}?api_key=${apiKey}`;
      const usdaRes = await fetch(usdaUrl);
      const f = await usdaRes.json();

      const nutrients = extractNutrients(f.foodNutrients ?? []);
      const food = {
        fdcId: f.fdcId,
        description: f.description,
        name_en: f.description,
        name_es: translateName(f.description),
        category: mapCategory(f.description),
        dataType: f.dataType,
        usda_description: f.description,
        usda_data_type: f.dataType,
        source: "usda",
        usda_fdc_id: String(f.fdcId),
        serving_size_g: 100,
        serving_description: "100g",
        is_verified: true,
        is_active: true,
        tags: [],
        ...nutrients,
      };

      return new Response(
        JSON.stringify({ food }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown path" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message ?? "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
