#!/usr/bin/env node

/**
 * USDA Foods Bulk Import Script
 *
 * Fetches 32 common foods from USDA FoodData Central API,
 * extracts all 24 nutrients (macros + micros), translates
 * names to Spanish, and inserts into your Supabase foods table.
 *
 * Usage:
 *   node load-usda-foods.js
 *
 * Prerequisites:
 *   - USDA_API_KEY in your .env file (free at https://fdc.nal.usda.gov/api-key-signup.html)
 *   - VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ─── Load .env manually (no dotenv dependency required) ──────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnv() {
  try {
    const envPath = join(__dirname, '.env');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    console.error('Could not read .env file');
    process.exit(1);
  }
}

loadEnv();

const USDA_API_KEY = process.env.USDA_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!USDA_API_KEY || USDA_API_KEY === 'your_actual_api_key_here') {
  console.error('\n❌ USDA_API_KEY not found or not set in your .env file.');
  console.error('   Get a free key at: https://fdc.nal.usda.gov/api-key-signup.html');
  console.error('   Then add: USDA_API_KEY=your_key_here to your .env file\n');
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error('\n❌ VITE_SUPABASE_URL not found in .env\n');
  process.exit(1);
}

if (!SUPABASE_SERVICE_KEY) {
  console.error('\n❌ SUPABASE_SERVICE_ROLE_KEY not found in .env');
  console.error('   This script needs the service role key to bypass RLS (admin-only writes).');
  console.error('   Find it in: Supabase Dashboard > Settings > API > service_role key');
  console.error('   Then add: SUPABASE_SERVICE_ROLE_KEY=eyJ... to your .env file\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── Nutrient ID → field name mapping ────────────────────────────────────────
const NUTRIENT_MAP = {
  1008: 'calories_kcal',
  1003: 'protein_g',
  1005: 'carbs_g',
  1004: 'fat_g',
  1079: 'fiber_g',
  2000: 'sugar_g',
  1093: 'sodium_mg',
  1092: 'potassium_mg',
  1087: 'calcium_mg',
  1089: 'iron_mg',
  1090: 'magnesium_mg',
  1091: 'phosphorus_mg',
  1095: 'zinc_mg',
  1106: 'vitamin_a_ug',
  1165: 'vitamin_b1_mg',
  1166: 'vitamin_b2_mg',
  1167: 'vitamin_b3_mg',
  1175: 'vitamin_b6_mg',
  1178: 'vitamin_b12_ug',
  1162: 'vitamin_c_mg',
  1114: 'vitamin_d_ug',
  1109: 'vitamin_e_mg',
  1185: 'vitamin_k_ug',
  1177: 'folate_ug',
};

// ─── Spanish translation dictionary ──────────────────────────────────────────
const TRANSLATIONS = {
  chicken: 'pollo', breast: 'pechuga', broiler: 'pollo de granja',
  skinless: 'sin piel', boneless: 'sin hueso', meat: 'carne', only: 'solo',
  salmon: 'salmón', atlantic: 'atlántico', wild: 'silvestre',
  tuna: 'atún', light: 'light', canned: 'enlatado', water: 'agua',
  egg: 'huevo', eggs: 'huevos', whole: 'entero', raw: 'crudo',
  beef: 'carne de res', ground: 'molido', lean: 'magro',
  yogurt: 'yogur', greek: 'griego', plain: 'natural', nonfat: 'descremado',
  milk: 'leche', reduced: 'reducida', fat: 'grasa', fluid: 'líquida',
  cheese: 'queso', cheddar: 'cheddar',
  rice: 'arroz', brown: 'integral', long: 'grano largo', grain: 'grano',
  cooked: 'cocido', oats: 'avena', rolled: 'laminada',
  quinoa: 'quinoa', uncooked: 'sin cocinar',
  bread: 'pan', wheat: 'trigo', whole: 'integral',
  pasta: 'pasta', spaghetti: 'espagueti', dry: 'seco',
  banana: 'banana', bananas: 'bananas', raw: 'crudo',
  apple: 'manzana', apples: 'manzanas', with: 'con', skin: 'piel',
  orange: 'naranja', oranges: 'naranjas',
  strawberry: 'frutilla', strawberries: 'frutillas',
  blueberry: 'arándano', blueberries: 'arándanos',
  broccoli: 'brócoli', boiled: 'hervido', drained: 'escurrido',
  spinach: 'espinaca',
  sweet: 'batata', potato: 'papa', potatoes: 'papas',
  carrot: 'zanahoria', carrots: 'zanahorias',
  tomato: 'tomate', tomatoes: 'tomates', red: 'rojo',
  pepper: 'pimiento', peppers: 'pimientos',
  almond: 'almendra', almonds: 'almendras', blanched: 'pelada',
  walnut: 'nuez', walnuts: 'nueces', english: 'inglesa',
  peanut: 'maní', butter: 'mantequilla', smooth: 'suave',
  chia: 'chía', seeds: 'semillas', seed: 'semilla', dried: 'seco',
  black: 'negro', bean: 'frijol', beans: 'frijoles', mature: 'maduro',
  chickpea: 'garbanzo', chickpeas: 'garbanzos',
  lentil: 'lenteja', lentils: 'lentejas',
  olive: 'oliva', oil: 'aceite', salad: 'ensalada',
  avocado: 'palta', fish: 'pescado', pork: 'cerdo',
  without: 'sin', added: 'añadida', salt: 'sal',
};

function translateName(englishName) {
  const lower = englishName.toLowerCase();
  let translated = lower;
  const sorted = Object.entries(TRANSLATIONS).sort((a, b) => b[0].length - a[0].length);
  for (const [en, es] of sorted) {
    translated = translated.replace(new RegExp(`\\b${en}\\b`, 'gi'), es);
  }
  return translated
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function mapCategory(description) {
  const d = description.toLowerCase();
  if (d.includes('chicken') || d.includes('beef') || d.includes('pork') || d.includes('turkey')) return 'meat';
  if (d.includes('fish') || d.includes('salmon') || d.includes('tuna') || d.includes('seafood')) return 'fish';
  if (d.includes('egg')) return 'egg';
  if (d.includes('milk') || d.includes('cheese') || d.includes('yogurt') || d.includes('dairy')) return 'dairy';
  if (d.includes('rice') || d.includes('oat') || d.includes('bread') || d.includes('pasta') || d.includes('wheat') || d.includes('quinoa') || d.includes('grain')) return 'grain';
  if (d.includes('apple') || d.includes('banana') || d.includes('berry') || d.includes('orange') || d.includes('fruit')) return 'fruit';
  if (d.includes('broccoli') || d.includes('spinach') || d.includes('carrot') || d.includes('tomato') || d.includes('pepper') || d.includes('potato')) return 'vegetable';
  if (d.includes('almond') || d.includes('walnut') || d.includes('peanut') || d.includes('nut') || d.includes('seed') || d.includes('chia')) return 'nuts';
  if (d.includes('bean') || d.includes('lentil') || d.includes('chickpea') || d.includes('legume')) return 'legume';
  if (d.includes('oil') || d.includes('avocado') || d.includes('fat') || d.includes('olive')) return 'fat';
  return 'other';
}

function extractNutrients(foodNutrients) {
  const result = {};
  for (const n of foodNutrients) {
    const id = n.nutrient?.id ?? n.nutrientId;
    const field = NUTRIENT_MAP[id];
    if (field && n.amount != null) {
      result[field] = Math.round(Number(n.amount) * 100) / 100;
    }
  }
  return result;
}

// ─── 32 common foods with their USDA FDC IDs ─────────────────────────────────
// IDs from USDA Foundation Foods & SR Legacy databases
const COMMON_FOODS = [
  // Proteins
  { fdcId: 331960,  category: 'meat',      label: 'Chicken breast' },
  { fdcId: 175167,  category: 'fish',      label: 'Salmon, Atlantic, wild' },
  { fdcId: 175159,  category: 'fish',      label: 'Tuna, light, canned in water' },
  { fdcId: 748967,  category: 'egg',       label: 'Eggs, whole, raw' },
  { fdcId: 174036,  category: 'meat',      label: 'Ground beef, 90% lean' },
  { fdcId: 170903,  category: 'dairy',     label: 'Yogurt, Greek, plain, nonfat' },
  { fdcId: 746776,  category: 'dairy',     label: 'Milk, 2% fat' },
  { fdcId: 746771,  category: 'dairy',     label: 'Cheese, cheddar' },
  // Grains
  { fdcId: 169704,  category: 'grain',     label: 'Rice, brown, long-grain, cooked' },
  { fdcId: 173904,  category: 'grain',     label: 'Oats, rolled, dry' },
  { fdcId: 168917,  category: 'grain',     label: 'Quinoa, uncooked' },
  { fdcId: 325871,  category: 'grain',     label: 'Bread, whole wheat' },
  { fdcId: 168936,  category: 'grain',     label: 'Pasta, whole wheat, dry' },
  // Fruits
  { fdcId: 173944,  category: 'fruit',     label: 'Banana, raw' },
  { fdcId: 171688,  category: 'fruit',     label: 'Apple, with skin, raw' },
  { fdcId: 169097,  category: 'fruit',     label: 'Orange, raw' },
  { fdcId: 167762,  category: 'fruit',     label: 'Strawberries, raw' },
  { fdcId: 171711,  category: 'fruit',     label: 'Blueberries, raw' },
  // Vegetables
  { fdcId: 170379,  category: 'vegetable', label: 'Broccoli, raw' },
  { fdcId: 168462,  category: 'vegetable', label: 'Spinach, raw' },
  { fdcId: 168482,  category: 'vegetable', label: 'Sweet potato, raw' },
  { fdcId: 170393,  category: 'vegetable', label: 'Carrots, raw' },
  { fdcId: 170457,  category: 'vegetable', label: 'Tomatoes, red, raw' },
  { fdcId: 170108,  category: 'vegetable', label: 'Peppers, red, raw' },
  // Nuts & Seeds
  { fdcId: 170567,  category: 'nuts',      label: 'Almonds, blanched' },
  { fdcId: 170187,  category: 'nuts',      label: 'Walnuts, English' },
  { fdcId: 172470,  category: 'nuts',      label: 'Peanut butter, smooth' },
  { fdcId: 170554,  category: 'nuts',      label: 'Chia seeds, dried' },
  // Legumes
  { fdcId: 173735,  category: 'legume',    label: 'Black beans, mature, cooked' },
  { fdcId: 173756,  category: 'legume',    label: 'Chickpeas, mature, cooked' },
  { fdcId: 172421,  category: 'legume',    label: 'Lentils, mature, cooked' },
  // Fats
  { fdcId: 171413,  category: 'fat',       label: 'Olive oil, salad or cooking' },
  { fdcId: 171706,  category: 'fat',       label: 'Avocado, raw' },
];

// ─── Main script ──────────────────────────────────────────────────────────────
async function fetchFood(fdcId) {
  const url = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${USDA_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for FDC ${fdcId}`);
  return res.json();
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('\n🚀 Starting USDA food import...\n');

  // Check existing foods
  const { data: existing, error: existErr } = await supabase
    .from('foods')
    .select('id, name, source')
    .order('name');

  if (existErr) {
    console.error('❌ Could not connect to Supabase:', existErr.message);
    process.exit(1);
  }

  const existingCount = existing?.length ?? 0;
  console.log(`📊 Found ${existingCount} existing foods in database`);

  if (existingCount > 0) {
    const usdaCount = existing.filter((f) => f.source === 'usda').length;
    const manualCount = existingCount - usdaCount;
    if (usdaCount > 0) console.log(`   ✅ ${usdaCount} already from USDA`);
    if (manualCount > 0) console.log(`   ⚠️  ${manualCount} manual foods (no micronutrient data)`);
  }

  // Check which FDC IDs are already imported
  const { data: existingUsda } = await supabase
    .from('foods')
    .select('usda_fdc_id')
    .eq('source', 'usda')
    .not('usda_fdc_id', 'is', null);

  const alreadyImported = new Set((existingUsda ?? []).map((f) => String(f.usda_fdc_id)));

  const toImport = COMMON_FOODS.filter((f) => !alreadyImported.has(String(f.fdcId)));

  if (toImport.length === 0) {
    console.log('\n✅ All 32 foods already imported! Nothing to do.\n');
    return;
  }

  console.log(`\n📥 Importing ${toImport.length} foods (skipping ${COMMON_FOODS.length - toImport.length} already imported)...\n`);

  let success = 0;
  let failed = 0;
  const errors = [];

  for (let i = 0; i < toImport.length; i++) {
    const item = toImport[i];
    const progress = `[${i + 1}/${toImport.length}]`;

    process.stdout.write(`${progress} Fetching: ${item.label}... `);

    try {
      const food = await fetchFood(item.fdcId);
      const nutrients = extractNutrients(food.foodNutrients ?? []);
      const nameEn = food.description;
      const nameEs = translateName(nameEn);

      const record = {
        name: nameEs,
        name_en: nameEn,
        name_es: nameEs,
        brand: '',
        category: item.category ?? mapCategory(nameEn),
        serving_size_g: 100,
        serving_description: '100g',
        source: 'usda',
        usda_fdc_id: String(food.fdcId),
        usda_description: nameEn,
        usda_data_type: food.dataType ?? null,
        is_verified: true,
        is_active: true,
        tags: [],
        calories_kcal: nutrients.calories_kcal ?? 0,
        protein_g: nutrients.protein_g ?? 0,
        carbs_g: nutrients.carbs_g ?? 0,
        fat_g: nutrients.fat_g ?? 0,
        fiber_g: nutrients.fiber_g ?? 0,
        sugar_g: nutrients.sugar_g ?? 0,
        sodium_mg: nutrients.sodium_mg ?? 0,
        potassium_mg: nutrients.potassium_mg ?? 0,
        calcium_mg: nutrients.calcium_mg ?? null,
        iron_mg: nutrients.iron_mg ?? null,
        magnesium_mg: nutrients.magnesium_mg ?? null,
        phosphorus_mg: nutrients.phosphorus_mg ?? null,
        zinc_mg: nutrients.zinc_mg ?? null,
        vitamin_a_ug: nutrients.vitamin_a_ug ?? null,
        vitamin_b1_mg: nutrients.vitamin_b1_mg ?? null,
        vitamin_b2_mg: nutrients.vitamin_b2_mg ?? null,
        vitamin_b3_mg: nutrients.vitamin_b3_mg ?? null,
        vitamin_b6_mg: nutrients.vitamin_b6_mg ?? null,
        vitamin_b12_ug: nutrients.vitamin_b12_ug ?? null,
        vitamin_c_mg: nutrients.vitamin_c_mg ?? null,
        vitamin_d_ug: nutrients.vitamin_d_ug ?? null,
        vitamin_e_mg: nutrients.vitamin_e_mg ?? null,
        vitamin_k_ug: nutrients.vitamin_k_ug ?? null,
        folate_ug: nutrients.folate_ug ?? null,
      };

      const { error: insertErr } = await supabase.from('foods').insert(record);

      if (insertErr) {
        if (insertErr.code === '23505') {
          process.stdout.write(`⏭️  already exists\n`);
        } else {
          process.stdout.write(`❌ insert error\n`);
          errors.push({ food: item.label, error: insertErr.message });
          failed++;
          continue;
        }
      } else {
        const cal = Math.round(nutrients.calories_kcal ?? 0);
        const p = (nutrients.protein_g ?? 0).toFixed(1);
        const c = (nutrients.carbs_g ?? 0).toFixed(1);
        const f = (nutrients.fat_g ?? 0).toFixed(1);
        const ca = nutrients.calcium_mg ? `Ca:${nutrients.calcium_mg}mg` : '';
        const fe = nutrients.iron_mg ? `Fe:${nutrients.iron_mg}mg` : '';
        const vc = nutrients.vitamin_c_mg != null ? `VitC:${nutrients.vitamin_c_mg}mg` : '';
        const micro = [ca, fe, vc].filter(Boolean).join(' | ');
        process.stdout.write(`✅\n`);
        console.log(`   "${nameEs}"`);
        console.log(`   📊 ${cal}kcal | P:${p}g C:${c}g F:${f}g`);
        if (micro) console.log(`   💊 ${micro}`);
        success++;
      }
    } catch (err) {
      process.stdout.write(`❌ ${err.message}\n`);
      errors.push({ food: item.label, error: err.message });
      failed++;
    }

    // Throttle to avoid rate limits (max 1000 req/hr)
    if (i < toImport.length - 1) await sleep(200);
  }

  // Summary
  console.log('\n' + '─'.repeat(50));
  console.log('✨ Import Complete!\n');
  console.log(`✅ Success: ${success} foods`);
  if (failed > 0) {
    console.log(`❌ Failed:  ${failed} foods`);
    console.log('\nFailed items:');
    for (const e of errors) {
      console.log(`  - ${e.food}: ${e.error}`);
    }
  }

  // Final count
  const { count } = await supabase
    .from('foods')
    .select('*', { count: 'exact', head: true });
  console.log(`\n📦 Total foods in database: ${count ?? '?'}`);
  console.log('─'.repeat(50) + '\n');
}

main().catch((err) => {
  console.error('\n❌ Unexpected error:', err.message);
  process.exit(1);
});
