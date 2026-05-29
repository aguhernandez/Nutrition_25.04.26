import { useState, useEffect } from 'react';
import { ChevronLeft, Search, Plus, Trash2, CheckCircle2, Loader2, Database, ExternalLink, CreditCard as Edit2, X, Save, Leaf, Zap, FlaskConical, ChevronDown, ChevronRight, AlertCircle, Languages } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePreferences } from '../../lib/preferences';

interface Props {
  onBack: () => void;
}

interface FoodV2 {
  id: string;
  name_es: string;
  name_en: string;
  brand: string;
  category: string;
  calories_per_100g: number;
  carbs_per_100g: number;
  protein_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sugar_per_100g: number;
  sodium_mg: number;
  potassium_mg: number;
  serving_size_g: number;
  serving_description: string;
  source: string;
  usda_fdc_id: string | null;
  is_verified: boolean;
  is_supplement: boolean;
  calcium_mg: number | null;
  iron_mg: number | null;
  magnesium_mg: number | null;
  zinc_mg: number | null;
  vitamin_c_mg: number | null;
  vitamin_d_ug: number | null;
  vitamin_b12_ug: number | null;
  created_at: string;
}

interface USDASearchResult {
  fdcId: number;
  description: string;
  name_en: string;
  name_es: string;
  category: string;
  dataType: string;
  nutrients: Record<string, number>;
}

interface ImportDraft {
  result: USDASearchResult;
  name_es: string;
  name_en: string;
}

const FOOD_CATEGORIES = [
  'meat_fish', 'dairy', 'grain', 'fruit', 'fruits_veg', 'vegetable',
  'legume', 'nuts', 'fat', 'egg', 'beverages', 'other',
];

const CATEGORY_LABELS: Record<string, string> = {
  meat_fish: 'Carnes/Pescados',
  dairy: 'Lácteos',
  grain: 'Granos/Cereales',
  fruit: 'Frutas',
  fruits_veg: 'Frutas/Verduras',
  vegetable: 'Verduras',
  legume: 'Legumbres',
  nuts: 'Frutos Secos',
  fat: 'Grasas/Aceites',
  egg: 'Huevos',
  beverages: 'Bebidas',
  other: 'Otros',
};

const EMPTY_FOOD: Omit<FoodV2, 'id' | 'created_at'> = {
  name_es: '', name_en: '', brand: '', category: 'other',
  calories_per_100g: 0, carbs_per_100g: 0, protein_per_100g: 0, fat_per_100g: 0,
  fiber_per_100g: 0, sugar_per_100g: 0, sodium_mg: 0, potassium_mg: 0,
  serving_size_g: 100, serving_description: '100g',
  source: 'internal', usda_fdc_id: null,
  is_verified: false, is_supplement: false,
  calcium_mg: null, iron_mg: null, magnesium_mg: null, zinc_mg: null,
  vitamin_c_mg: null, vitamin_d_ug: null, vitamin_b12_ug: null,
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

async function callUSDAProxy(path: string): Promise<any> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/usda-proxy${path}`, {
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`USDA proxy error: ${res.status}`);
  return res.json();
}

function fmt(v: number | null | undefined, decimals = 1): string {
  if (v == null) return '-';
  return Number(v).toFixed(decimals);
}

function hasMinerals(food: FoodV2): boolean {
  return !!(food.calcium_mg || food.iron_mg || food.zinc_mg || food.vitamin_c_mg);
}

export default function AdminFoodsView({ onBack }: Props) {
  const { theme, language } = usePreferences();
  const isDark = theme === 'dark';

  const [foods, setFoods] = useState<FoodV2[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<FoodV2, 'id' | 'created_at'>>(EMPTY_FOOD);
  const [saving, setSaving] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const [usdaQuery, setUsdaQuery] = useState('');
  const [usdaResults, setUsdaResults] = useState<USDASearchResult[]>([]);
  const [usdaLoading, setUsdaLoading] = useState(false);
  const [usdaError, setUsdaError] = useState('');
  const [usdaImporting, setUsdaImporting] = useState<number | null>(null);
  const [usdaImported, setUsdaImported] = useState<Set<number>>(new Set());
  const [showUsda, setShowUsda] = useState(false);
  const [usdaTotalHits, setUsdaTotalHits] = useState(0);
  const [usdaApiMissing, setUsdaApiMissing] = useState(false);

  const [importDraft, setImportDraft] = useState<ImportDraft | null>(null);

  const cardBg = isDark ? '#1e1a2e' : '#ffffff';
  const cardBorder = isDark ? '#2d2640' : '#e5e7eb';
  const textMain = isDark ? '#f3f4f6' : '#1f2937';
  const textMuted = isDark ? '#9ca3af' : '#6b7280';
  const textDim = isDark ? '#6b7280' : '#9ca3af';
  const rowHover = isDark ? '#251f38' : '#f9fafb';

  useEffect(() => { loadFoods(); }, []);

  const loadFoods = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('foods_v2')
      .select('*')
      .eq('is_supplement', false)
      .order('name_es');
    setFoods((data ?? []) as FoodV2[]);
    setLoading(false);
  };

  const searchUSDA = async () => {
    if (!usdaQuery.trim()) return;
    setUsdaLoading(true);
    setUsdaError('');
    setUsdaApiMissing(false);
    try {
      const json = await callUSDAProxy(
        `/search?query=${encodeURIComponent(usdaQuery)}&pageSize=15&dataType=Foundation,SR%20Legacy`
      );
      if (json.error && json.error.includes('USDA_API_KEY')) {
        setUsdaApiMissing(true);
        setUsdaResults([]);
      } else if (json.foods && json.foods.length > 0) {
        setUsdaResults(json.foods as USDASearchResult[]);
        setUsdaTotalHits(json.totalHits ?? 0);
      } else {
        setUsdaError(language === 'es' ? 'Sin resultados. Intenta otro término.' : 'No results found. Try a different term.');
        setUsdaResults([]);
      }
    } catch {
      setUsdaError(language === 'es' ? 'Error al conectar con USDA.' : 'Could not reach USDA. Check connection.');
      setUsdaResults([]);
    }
    setUsdaLoading(false);
  };

  const startImport = (result: USDASearchResult) => {
    setImportDraft({
      result,
      name_es: result.name_es,
      name_en: result.name_en,
    });
  };

  const confirmImport = async () => {
    if (!importDraft) return;
    const { result, name_es, name_en } = importDraft;
    setUsdaImporting(result.fdcId);
    try {
      const json = await callUSDAProxy(`/food/${result.fdcId}`);
      const f = json.food;

      const record = {
        name_es: name_es || f.name_es || f.description,
        name_en: name_en || f.name_en || f.description,
        brand: '',
        category: f.category ?? 'other',
        calories_per_100g: f.calories_kcal ?? 0,
        protein_per_100g: f.protein_g ?? 0,
        carbs_per_100g: f.carbs_g ?? 0,
        fat_per_100g: f.fat_g ?? 0,
        fiber_per_100g: f.fiber_g ?? 0,
        sugar_per_100g: f.sugar_g ?? 0,
        sodium_mg: f.sodium_mg ?? 0,
        potassium_mg: f.potassium_mg ?? 0,
        serving_size_g: 100,
        serving_description: '100g',
        source: 'usda',
        usda_fdc_id: String(f.fdcId ?? result.fdcId),
        is_verified: true,
        is_supplement: false,
        calcium_mg: f.calcium_mg ?? null,
        iron_mg: f.iron_mg ?? null,
        magnesium_mg: f.magnesium_mg ?? null,
        zinc_mg: f.zinc_mg ?? null,
        vitamin_c_mg: f.vitamin_c_mg ?? null,
        vitamin_d_ug: f.vitamin_d_ug ?? null,
        vitamin_b12_ug: f.vitamin_b12_ug ?? null,
      };

      const { data, error } = await supabase.from('foods_v2').insert(record).select().maybeSingle();
      if (!error && data) {
        setFoods((prev) => [data as FoodV2, ...prev]);
        setUsdaImported((prev) => new Set([...prev, result.fdcId]));
      }
    } catch {
      // silent
    }
    setUsdaImporting(null);
    setImportDraft(null);
  };

  const handleSave = async () => {
    if (!form.name_es.trim() && !form.name_en.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      name_es: form.name_es || form.name_en,
      name_en: form.name_en || form.name_es,
    };
    if (editingId) {
      const { data } = await supabase
        .from('foods_v2')
        .update(payload)
        .eq('id', editingId)
        .select()
        .maybeSingle();
      if (data) setFoods((prev) => prev.map((f) => (f.id === editingId ? data as FoodV2 : f)));
    } else {
      const { data } = await supabase.from('foods_v2').insert(payload).select().maybeSingle();
      if (data) setFoods((prev) => [data as FoodV2, ...prev]);
    }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FOOD);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('foods_v2').delete().eq('id', id);
    setFoods((prev) => prev.filter((f) => f.id !== id));
    if (expandedRow === id) setExpandedRow(null);
  };

  const openEdit = (food: FoodV2) => {
    const { id, created_at, ...rest } = food;
    setForm(rest);
    setEditingId(food.id);
    setShowForm(true);
  };

  const filtered = foods.filter((f) => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || f.name_es.toLowerCase().includes(q)
      || f.name_en.toLowerCase().includes(q)
      || (f.brand ?? '').toLowerCase().includes(q);
    const matchCat = filterCat === 'all' || f.category === filterCat;
    return matchSearch && matchCat;
  });

  const microStats = {
    total: foods.length,
    withMicro: foods.filter(hasMinerals).length,
    usda: foods.filter((f) => f.source === 'usda').length,
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-xl border transition-colors hover:bg-gray-50" style={{ borderColor: cardBorder, backgroundColor: cardBg }}>
          <ChevronLeft className="w-4 h-4" style={{ color: textMain }} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(253,218,54,0.2)' }}>
            <Database className="w-5 h-5" style={{ color: '#514163' }} />
          </div>
          <div>
            <h1 className="font-heading text-xl" style={{ color: textMain }}>Food Database</h1>
            <p className="font-body text-xs" style={{ color: textDim }}>
              {microStats.total} foods | {microStats.withMicro} with minerals | {microStats.usda} from USDA
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => { setShowUsda(true); setUsdaResults([]); setUsdaQuery(''); setUsdaError(''); setUsdaImported(new Set()); setImportDraft(null); }}
            className="flex items-center gap-2 py-2 px-4 rounded-xl border font-body text-sm font-medium transition-colors"
            style={{ borderColor: cardBorder, backgroundColor: cardBg, color: textMain }}
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span> USDA
          </button>
          <button
            onClick={() => { setForm(EMPTY_FOOD); setEditingId(null); setShowForm(true); }}
            className="flex items-center gap-2 py-2 px-4 rounded-xl font-body text-sm font-semibold transition-all"
            style={{ backgroundColor: '#514163', color: '#fdda36' }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'es' ? 'Agregar' : 'Add'}</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: language === 'es' ? 'Total Alimentos' : 'Total Foods', value: microStats.total, icon: Database, color: '#514163', bg: isDark ? 'rgba(81,65,99,0.2)' : 'rgba(81,65,99,0.08)' },
          { label: language === 'es' ? 'Con Minerales' : 'With Minerals', value: microStats.withMicro, icon: FlaskConical, color: '#0891b2', bg: isDark ? 'rgba(8,145,178,0.15)' : '#e0f2fe' },
          { label: 'From USDA', value: microStats.usda, icon: Leaf, color: '#16a34a', bg: isDark ? 'rgba(22,163,74,0.15)' : '#dcfce7' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-xl p-3 flex items-center gap-3" style={{ backgroundColor: cardBg, border: `1.5px solid ${cardBorder}` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <div className="font-heading text-lg leading-none" style={{ color: textMain }}>{value}</div>
              <div className="font-body text-xs mt-0.5" style={{ color: textDim }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: textDim }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'es' ? 'Buscar alimentos...' : 'Search foods...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border font-body text-sm transition-colors"
            style={{ borderColor: cardBorder, backgroundColor: cardBg, color: textMain }}
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="py-2.5 px-3 rounded-xl border font-body text-sm sm:w-48"
          style={{ borderColor: cardBorder, backgroundColor: cardBg, color: textMain }}
        >
          <option value="all">{language === 'es' ? 'Todas las Categorías' : 'All Categories'}</option>
          {FOOD_CATEGORIES.map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>
          ))}
        </select>
      </div>

      {/* Foods Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: cardBg, border: `2px solid ${cardBorder}` }}>
          <Database className="w-12 h-12 mx-auto mb-3" style={{ color: textDim }} />
          <h3 className="font-heading text-lg mb-2" style={{ color: textMain }}>
            {language === 'es' ? 'Sin alimentos' : 'No foods found'}
          </h3>
          <p className="font-body text-sm" style={{ color: textDim }}>
            {language === 'es' ? 'Agrega alimentos manualmente o importa desde USDA' : 'Add foods manually or import from USDA'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: cardBg, border: `2px solid ${cardBorder}` }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: isDark ? '#251f38' : '#f9fafb', borderBottom: `2px solid ${cardBorder}` }}>
                  {['', language === 'es' ? 'Alimento' : 'Food', language === 'es' ? 'Categoría' : 'Category', 'Cal', 'P / C / F', 'Minerals', 'Source', ''].map((h, i) => (
                    <th key={i} className="text-left px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider" style={{ color: textDim }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((food) => (
                  <FoodRow
                    key={food.id}
                    food={food}
                    expanded={expandedRow === food.id}
                    onToggle={() => setExpandedRow(expandedRow === food.id ? null : food.id)}
                    onEdit={() => openEdit(food)}
                    onDelete={() => handleDelete(food.id)}
                    isDark={isDark}
                    textMain={textMain}
                    textMuted={textMuted}
                    textDim={textDim}
                    rowHover={rowHover}
                    cardBorder={cardBorder}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USDA Import Modal */}
      {showUsda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <div className="rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col" style={{ backgroundColor: cardBg, border: `2px solid ${cardBorder}` }}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: cardBorder }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(37,99,235,0.15)' : '#dbeafe' }}>
                  <ExternalLink className="w-4 h-4" style={{ color: '#2563eb' }} />
                </div>
                <div>
                  <span className="font-body font-semibold" style={{ color: textMain }}>USDA FoodData Central</span>
                  <p className="font-body text-xs" style={{ color: textDim }}>Foundation Foods & SR Legacy</p>
                </div>
              </div>
              <button onClick={() => setShowUsda(false)} className="p-1.5 rounded-lg transition-colors" style={{ color: textMuted }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search input */}
            <div className="p-4 border-b" style={{ borderColor: cardBorder }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={usdaQuery}
                  onChange={(e) => setUsdaQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchUSDA()}
                  placeholder={language === 'es' ? 'Buscar en USDA (ej: chicken breast, oats, salmon...)' : 'Search USDA (e.g., chicken breast, oats, salmon...)'}
                  className="flex-1 px-4 py-2.5 rounded-xl border font-body text-sm"
                  style={{ borderColor: cardBorder, backgroundColor: isDark ? '#150f23' : '#ffffff', color: textMain }}
                  autoFocus
                />
                <button
                  onClick={searchUSDA}
                  disabled={usdaLoading || !usdaQuery.trim()}
                  className="px-4 py-2 rounded-xl flex items-center gap-2 flex-shrink-0 font-body text-sm font-semibold disabled:opacity-50 transition-all"
                  style={{ backgroundColor: '#514163', color: '#fdda36' }}
                >
                  {usdaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {language === 'es' ? 'Buscar' : 'Search'}
                </button>
              </div>
              {usdaError && (
                <p className="font-body text-xs mt-2" style={{ color: '#ef4444' }}>{usdaError}</p>
              )}
              {usdaTotalHits > 0 && usdaResults.length > 0 && (
                <p className="font-body text-xs mt-1" style={{ color: textDim }}>
                  {language === 'es' ? `Mostrando ${usdaResults.length} de ${usdaTotalHits.toLocaleString()}` : `Showing ${usdaResults.length} of ${usdaTotalHits.toLocaleString()} results`}
                </p>
              )}
            </div>

            {/* API key missing */}
            {usdaApiMissing && (
              <div className="mx-4 mt-4 p-3 rounded-xl flex items-start gap-3" style={{ backgroundColor: isDark ? 'rgba(180,121,9,0.12)' : '#fef3c7', border: '1px solid #fcd34d' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#b45309' }} />
                <div>
                  <div className="font-body text-sm font-semibold" style={{ color: '#92400e' }}>USDA API Key not configured</div>
                  <div className="font-body text-xs mt-0.5" style={{ color: '#b45309' }}>
                    Add <code className="px-1 rounded" style={{ backgroundColor: isDark ? '#3b2f00' : '#fef3c7' }}>USDA_API_KEY</code> to your Edge Function secrets.
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-3">
              {usdaResults.length > 0 && (
                <div className="space-y-1">
                  {usdaResults.map((food) => {
                    const alreadyImported = usdaImported.has(food.fdcId);
                    const isImporting = usdaImporting === food.fdcId;
                    return (
                      <div
                        key={food.fdcId}
                        className="flex items-start gap-3 p-3 rounded-xl transition-all"
                        style={{
                          border: `1.5px solid`,
                          borderColor: alreadyImported ? (isDark ? '#166534' : '#bbf7d0') : cardBorder,
                          backgroundColor: alreadyImported ? (isDark ? 'rgba(22,163,74,0.08)' : '#f0fdf4') : cardBg,
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-body font-semibold text-sm truncate" style={{ color: textMain }}>{food.name_es}</div>
                          <div className="font-body text-xs truncate" style={{ color: textDim }}>{food.name_en}</div>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className="font-body text-xs font-semibold" style={{ color: '#f59e0b' }}>
                              {Math.round(food.nutrients.calories_kcal ?? 0)} kcal
                            </span>
                            <span className="font-body text-xs" style={{ color: '#10b981' }}>
                              P: {fmt(food.nutrients.protein_g ?? 0, 0)}g
                            </span>
                            <span className="font-body text-xs" style={{ color: '#3b82f6' }}>
                              C: {fmt(food.nutrients.carbs_g ?? 0, 0)}g
                            </span>
                            <span className="font-body text-xs" style={{ color: '#f97316' }}>
                              F: {fmt(food.nutrients.fat_g ?? 0, 0)}g
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => !alreadyImported && startImport(food)}
                          disabled={alreadyImported || isImporting}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs font-semibold flex-shrink-0 transition-all disabled:cursor-default"
                          style={{
                            backgroundColor: alreadyImported ? (isDark ? '#166534' : '#dcfce7') : '#514163',
                            color: alreadyImported ? '#15803d' : '#fdda36',
                          }}
                        >
                          {isImporting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : alreadyImported ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                          {alreadyImported ? (language === 'es' ? 'Agregado' : 'Added') : 'Import'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {usdaResults.length === 0 && !usdaLoading && !usdaError && !usdaApiMissing && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: isDark ? '#251f38' : '#f1f5f9' }}>
                    <Zap className="w-6 h-6" style={{ color: textDim }} />
                  </div>
                  <p className="font-body text-sm font-semibold" style={{ color: textMain }}>
                    {language === 'es' ? 'Buscar en USDA FoodData Central' : 'Search USDA FoodData Central'}
                  </p>
                  <p className="font-body text-xs mt-1" style={{ color: textDim }}>
                    {language === 'es' ? '+300,000 alimentos con datos de vitaminas y minerales' : 'Over 300,000 foods with vitamin & mineral data'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {['chicken breast', 'brown rice', 'salmon', 'avocado', 'spinach', 'almonds'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setUsdaQuery(s)}
                        className="px-3 py-1 rounded-full font-body text-xs transition-colors"
                        style={{ backgroundColor: isDark ? '#2d2640' : '#f1f5f9', color: textMuted }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Translation / Import Confirmation Modal */}
      {importDraft && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="rounded-2xl w-full max-w-md" style={{ backgroundColor: cardBg, border: `2px solid ${cardBorder}` }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: cardBorder }}>
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5" style={{ color: '#514163' }} />
                <span className="font-body font-semibold" style={{ color: textMain }}>
                  {language === 'es' ? 'Confirmar Nombre' : 'Confirm Name'}
                </span>
              </div>
              <button onClick={() => setImportDraft(null)} className="p-1.5 rounded-lg" style={{ color: textMuted }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: isDark ? '#251f38' : '#f9fafb', border: `1px solid ${cardBorder}` }}>
                <div className="font-body text-xs font-medium uppercase tracking-wider mb-1" style={{ color: textDim }}>
                  USDA Original
                </div>
                <div className="font-body text-sm" style={{ color: textMuted }}>
                  {importDraft.result.description}
                </div>
              </div>

              <div>
                <label className="block font-body text-sm font-medium mb-1.5" style={{ color: textMain }}>
                  {language === 'es' ? 'Nombre en Español' : 'Spanish Name'} *
                </label>
                <input
                  type="text"
                  value={importDraft.name_es}
                  onChange={(e) => setImportDraft((d) => d ? { ...d, name_es: e.target.value } : d)}
                  className="w-full px-4 py-2.5 rounded-xl border font-body text-sm"
                  style={{ borderColor: cardBorder, backgroundColor: isDark ? '#150f23' : '#ffffff', color: textMain }}
                  placeholder="ej: Mantequilla"
                />
                <p className="font-body text-xs mt-1" style={{ color: textDim }}>
                  {language === 'es'
                    ? 'Traduccion automatica de USDA. Modifica si es necesario.'
                    : 'Auto-translated from USDA. Edit if needed.'}
                </p>
              </div>

              <div>
                <label className="block font-body text-sm font-medium mb-1.5" style={{ color: textMain }}>
                  {language === 'es' ? 'Nombre en Inglés' : 'English Name'}
                </label>
                <input
                  type="text"
                  value={importDraft.name_en}
                  onChange={(e) => setImportDraft((d) => d ? { ...d, name_en: e.target.value } : d)}
                  className="w-full px-4 py-2.5 rounded-xl border font-body text-sm"
                  style={{ borderColor: cardBorder, backgroundColor: isDark ? '#150f23' : '#ffffff', color: textMain }}
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: isDark ? 'rgba(253,218,54,0.06)' : '#fffbeb', border: `1px solid ${isDark ? '#4a3f00' : '#fef3c7'}` }}>
                <div className="flex items-center gap-2 flex-wrap font-body text-xs" style={{ color: textMuted }}>
                  <span className="font-semibold" style={{ color: '#f59e0b' }}>{Math.round(importDraft.result.nutrients.calories_kcal ?? 0)} kcal</span>
                  <span>P: {fmt(importDraft.result.nutrients.protein_g ?? 0, 0)}g</span>
                  <span>C: {fmt(importDraft.result.nutrients.carbs_g ?? 0, 0)}g</span>
                  <span>F: {fmt(importDraft.result.nutrients.fat_g ?? 0, 0)}g</span>
                  <span className="px-1.5 py-0.5 rounded capitalize" style={{ backgroundColor: isDark ? '#2d2640' : '#f1f5f9' }}>
                    {importDraft.result.category}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setImportDraft(null)}
                  className="flex-1 py-2.5 rounded-xl border font-body font-medium text-sm transition-colors"
                  style={{ borderColor: cardBorder, color: textMuted }}
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={confirmImport}
                  disabled={!importDraft.name_es.trim() || usdaImporting !== null}
                  className="flex-1 py-2.5 rounded-xl font-body font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  style={{ backgroundColor: '#514163', color: '#fdda36' }}
                >
                  {usdaImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {language === 'es' ? 'Importar' : 'Import'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Food Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ backgroundColor: cardBg, border: `2px solid ${cardBorder}` }}>
            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10" style={{ borderColor: cardBorder, backgroundColor: cardBg }}>
              <h3 className="font-body font-semibold" style={{ color: textMain }}>
                {editingId ? (language === 'es' ? 'Editar Alimento' : 'Edit Food') : (language === 'es' ? 'Agregar Alimento' : 'Add Food')}
              </h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1.5 rounded-lg" style={{ color: textMuted }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: textMain }}>
                    {language === 'es' ? 'Nombre en Español' : 'Spanish Name'} *
                  </label>
                  <input
                    type="text"
                    value={form.name_es}
                    onChange={(e) => setForm((f) => ({ ...f, name_es: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border font-body text-sm"
                    style={{ borderColor: cardBorder, backgroundColor: isDark ? '#150f23' : '#ffffff', color: textMain }}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: textMain }}>
                    {language === 'es' ? 'Nombre en Inglés' : 'English Name'}
                  </label>
                  <input
                    type="text"
                    value={form.name_en}
                    onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border font-body text-sm"
                    style={{ borderColor: cardBorder, backgroundColor: isDark ? '#150f23' : '#ffffff', color: textMain }}
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: textMain }}>
                    {language === 'es' ? 'Marca' : 'Brand'}
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    placeholder={language === 'es' ? 'opcional' : 'optional'}
                    className="w-full px-4 py-2.5 rounded-xl border font-body text-sm"
                    style={{ borderColor: cardBorder, backgroundColor: isDark ? '#150f23' : '#ffffff', color: textMain }}
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: textMain }}>
                    {language === 'es' ? 'Categoría' : 'Category'}
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border font-body text-sm"
                    style={{ borderColor: cardBorder, backgroundColor: isDark ? '#150f23' : '#ffffff', color: textMain }}
                  >
                    {FOOD_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Macros */}
              <div className="border-t pt-3" style={{ borderColor: cardBorder }}>
                <div className="font-body text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: textDim }}>
                  Macros per 100g
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'calories_per_100g' as const, label: 'Calories (kcal)', color: '#f59e0b' },
                    { key: 'carbs_per_100g' as const, label: language === 'es' ? 'Carbohidratos (g)' : 'Carbs (g)', color: '#3b82f6' },
                    { key: 'protein_per_100g' as const, label: language === 'es' ? 'Proteína (g)' : 'Protein (g)', color: '#10b981' },
                    { key: 'fat_per_100g' as const, label: language === 'es' ? 'Grasa (g)' : 'Fat (g)', color: '#f97316' },
                    { key: 'fiber_per_100g' as const, label: 'Fiber (g)', color: textMuted },
                    { key: 'sugar_per_100g' as const, label: language === 'es' ? 'Azúcar (g)' : 'Sugar (g)', color: '#ec4899' },
                    { key: 'sodium_mg' as const, label: 'Sodium (mg)', color: textMuted },
                    { key: 'potassium_mg' as const, label: 'Potassium (mg)', color: '#0891b2' },
                  ].map(({ key, label, color }) => (
                    <div key={key}>
                      <label className="block font-body text-xs font-medium mb-1" style={{ color }}>{label}</label>
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={form[key] ?? 0}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 rounded-xl border font-body text-sm"
                        style={{ borderColor: cardBorder, backgroundColor: isDark ? '#150f23' : '#ffffff', color: textMain }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_verified: !f.is_verified }))}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all"
                  style={{
                    borderColor: form.is_verified ? '#10b981' : cardBorder,
                    backgroundColor: form.is_verified ? (isDark ? 'rgba(16,185,129,0.1)' : '#f0fdf4') : 'transparent',
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: form.is_verified ? '#10b981' : textDim }} />
                  <span className="font-body text-xs font-medium" style={{ color: form.is_verified ? '#10b981' : textMuted }}>
                    Verified
                  </span>
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="flex-1 py-2.5 rounded-xl border font-body font-medium text-sm"
                  style={{ borderColor: cardBorder, color: textMuted }}
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || (!form.name_es.trim() && !form.name_en.trim())}
                  className="flex-1 py-2.5 rounded-xl font-body font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  style={{ backgroundColor: '#514163', color: '#fdda36' }}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingId ? (language === 'es' ? 'Actualizar' : 'Update') : (language === 'es' ? 'Agregar' : 'Add Food')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FoodRowProps {
  food: FoodV2;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDark: boolean;
  textMain: string;
  textMuted: string;
  textDim: string;
  rowHover: string;
  cardBorder: string;
}

function FoodRow({ food, expanded, onToggle, onEdit, onDelete, isDark, textMain, textMuted, textDim, rowHover, cardBorder }: FoodRowProps) {
  return (
    <>
      <tr
        className="border-b group cursor-pointer transition-colors"
        style={{ borderColor: cardBorder }}
        onClick={onToggle}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = rowHover; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
      >
        <td className="pl-3 pr-1 py-3">
          {expanded
            ? <ChevronDown className="w-3.5 h-3.5" style={{ color: textDim }} />
            : <ChevronRight className="w-3.5 h-3.5" style={{ color: textDim }} />
          }
        </td>
        <td className="px-4 py-3">
          <div className="font-body font-semibold text-sm" style={{ color: textMain }}>{food.name_es}</div>
          {food.name_en && food.name_en !== food.name_es && (
            <div className="font-body text-xs" style={{ color: textDim }}>{food.name_en}</div>
          )}
          {food.brand && <div className="font-body text-xs" style={{ color: textDim }}>{food.brand}</div>}
        </td>
        <td className="px-4 py-3">
          <span className="px-2 py-0.5 rounded-full font-body text-xs capitalize" style={{ backgroundColor: isDark ? '#2d2640' : '#f3f4f6', color: textMuted }}>
            {CATEGORY_LABELS[food.category] || food.category}
          </span>
        </td>
        <td className="px-4 py-3 font-body text-sm font-semibold" style={{ color: '#f59e0b' }}>
          {Math.round(food.calories_per_100g)}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2 font-body text-xs">
            <span className="font-semibold" style={{ color: '#10b981' }}>{fmt(food.protein_per_100g, 0)}g</span>
            <span style={{ color: textDim }}>/</span>
            <span className="font-semibold" style={{ color: '#3b82f6' }}>{fmt(food.carbs_per_100g, 0)}g</span>
            <span style={{ color: textDim }}>/</span>
            <span className="font-semibold" style={{ color: '#f97316' }}>{fmt(food.fat_per_100g, 0)}g</span>
          </div>
        </td>
        <td className="px-4 py-3">
          {hasMinerals(food) ? (
            <div className="flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5" style={{ color: '#0891b2' }} />
              <span className="font-body text-xs" style={{ color: '#0891b2' }}>yes</span>
            </div>
          ) : (
            <span className="font-body text-xs" style={{ color: textDim }}>-</span>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span
              className="px-2 py-0.5 rounded-full font-body text-xs"
              style={{
                backgroundColor: food.source === 'usda' ? (isDark ? 'rgba(37,99,235,0.15)' : '#dbeafe') : (isDark ? 'rgba(22,163,74,0.12)' : '#f0fdf4'),
                color: food.source === 'usda' ? '#2563eb' : '#15803d',
              }}
            >
              {food.source}
            </span>
            {food.is_verified && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#10b981' }} />}
          </div>
        </td>
        <td className="px-4 py-3">
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onEdit} className="p-1.5 rounded-lg transition-colors" style={{ color: textMuted }}>
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDelete} className="p-1.5 rounded-lg transition-colors" style={{ color: '#ef4444' }}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr style={{ backgroundColor: isDark ? '#1a1528' : '#f8fafc' }}>
          <td colSpan={8} className="px-6 py-4">
            {hasMinerals(food) ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Calcium', value: food.calcium_mg, unit: 'mg' },
                  { label: 'Iron', value: food.iron_mg, unit: 'mg' },
                  { label: 'Magnesium', value: food.magnesium_mg, unit: 'mg' },
                  { label: 'Zinc', value: food.zinc_mg, unit: 'mg' },
                  { label: 'Vitamin C', value: food.vitamin_c_mg, unit: 'mg' },
                  { label: 'Vitamin D', value: food.vitamin_d_ug, unit: 'ug' },
                  { label: 'Vitamin B12', value: food.vitamin_b12_ug, unit: 'ug' },
                  { label: 'Potassium', value: food.potassium_mg, unit: 'mg' },
                ].map(({ label, value, unit }) => (
                  <div key={label} className="flex justify-between">
                    <span className="font-body text-xs" style={{ color: textMuted }}>{label}</span>
                    <span className="font-body text-xs font-semibold" style={{ color: value ? textMain : textDim }}>
                      {fmt(value)} {value != null ? unit : ''}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4" style={{ color: '#b45309' }} />
                <span className="font-body text-sm" style={{ color: textMuted }}>No mineral data available</span>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
