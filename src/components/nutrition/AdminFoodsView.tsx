import { useState, useEffect } from 'react';
import {
  ChevronLeft, Search, Plus, Trash2, CheckCircle2, Loader2,
  Database, ExternalLink, Edit2, X, Save, Leaf, Zap, FlaskConical,
  ChevronDown, ChevronRight, AlertCircle,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Props {
  onBack: () => void;
}

interface Food {
  id: string;
  name: string;
  name_en: string | null;
  name_es: string | null;
  brand: string;
  category: string;
  calories_kcal: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  potassium_mg: number;
  serving_size_g: number;
  serving_description: string;
  source: string;
  usda_fdc_id: string | null;
  usda_description: string | null;
  usda_data_type: string | null;
  is_verified: boolean;
  tags: string[];
  vitamin_a_ug: number | null;
  vitamin_b1_mg: number | null;
  vitamin_b2_mg: number | null;
  vitamin_b3_mg: number | null;
  vitamin_b6_mg: number | null;
  vitamin_b12_ug: number | null;
  vitamin_c_mg: number | null;
  vitamin_d_ug: number | null;
  vitamin_e_mg: number | null;
  vitamin_k_ug: number | null;
  folate_ug: number | null;
  calcium_mg: number | null;
  iron_mg: number | null;
  magnesium_mg: number | null;
  phosphorus_mg: number | null;
  zinc_mg: number | null;
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

const FOOD_CATEGORIES = [
  'grains', 'protein', 'dairy', 'fruit', 'vegetables', 'legumes',
  'nuts', 'fats', 'beverages', 'supplements', 'meat', 'fish', 'egg',
  'grain', 'vegetable', 'legume', 'fat', 'other',
];

const UNIQUE_CATEGORIES = Array.from(new Set(FOOD_CATEGORIES));

const EMPTY_FOOD: Omit<Food, 'id'> = {
  name: '', name_en: null, name_es: null, brand: '', category: 'other',
  calories_kcal: 0, carbs_g: 0, protein_g: 0, fat_g: 0,
  fiber_g: 0, sugar_g: 0, sodium_mg: 0, potassium_mg: 0,
  serving_size_g: 100, serving_description: '100g',
  source: 'manual', usda_fdc_id: null, usda_description: null, usda_data_type: null,
  is_verified: false, tags: [],
  vitamin_a_ug: null, vitamin_b1_mg: null, vitamin_b2_mg: null,
  vitamin_b3_mg: null, vitamin_b6_mg: null, vitamin_b12_ug: null,
  vitamin_c_mg: null, vitamin_d_ug: null, vitamin_e_mg: null,
  vitamin_k_ug: null, folate_ug: null, calcium_mg: null, iron_mg: null,
  magnesium_mg: null, phosphorus_mg: null, zinc_mg: null,
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
  if (v == null) return '—';
  return Number(v).toFixed(decimals);
}

function hasMicronutrients(food: Food): boolean {
  return !!(food.calcium_mg != null || food.vitamin_c_mg != null || food.iron_mg != null);
}

export default function AdminFoodsView({ onBack }: Props) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Food, 'id'>>(EMPTY_FOOD);
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

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    setLoading(true);
    const { data } = await supabase.from('foods').select('*').order('name');
    setFoods((data ?? []) as Food[]);
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
        setUsdaError('No results found. Try a different search term.');
        setUsdaResults([]);
      }
    } catch {
      setUsdaError('Could not reach USDA database. Check connection and API key.');
      setUsdaResults([]);
    }
    setUsdaLoading(false);
  };

  const importUSDAFood = async (result: USDASearchResult) => {
    setUsdaImporting(result.fdcId);
    try {
      const json = await callUSDAProxy(`/food/${result.fdcId}`);
      const f = json.food;

      const record = {
        name: f.name_es || f.description,
        name_en: f.name_en || f.description,
        name_es: f.name_es || null,
        brand: '',
        category: f.category ?? 'other',
        calories_kcal: f.calories_kcal ?? 0,
        carbs_g: f.carbs_g ?? 0,
        protein_g: f.protein_g ?? 0,
        fat_g: f.fat_g ?? 0,
        fiber_g: f.fiber_g ?? 0,
        sugar_g: f.sugar_g ?? 0,
        sodium_mg: f.sodium_mg ?? 0,
        potassium_mg: f.potassium_mg ?? 0,
        serving_size_g: 100,
        serving_description: '100g',
        source: 'usda',
        usda_fdc_id: String(f.fdcId ?? result.fdcId),
        usda_description: f.usda_description ?? f.description,
        usda_data_type: f.usda_data_type ?? f.dataType ?? null,
        is_verified: true,
        is_active: true,
        tags: [],
        vitamin_a_ug: f.vitamin_a_ug ?? null,
        vitamin_b1_mg: f.vitamin_b1_mg ?? null,
        vitamin_b2_mg: f.vitamin_b2_mg ?? null,
        vitamin_b3_mg: f.vitamin_b3_mg ?? null,
        vitamin_b6_mg: f.vitamin_b6_mg ?? null,
        vitamin_b12_ug: f.vitamin_b12_ug ?? null,
        vitamin_c_mg: f.vitamin_c_mg ?? null,
        vitamin_d_ug: f.vitamin_d_ug ?? null,
        vitamin_e_mg: f.vitamin_e_mg ?? null,
        vitamin_k_ug: f.vitamin_k_ug ?? null,
        folate_ug: f.folate_ug ?? null,
        calcium_mg: f.calcium_mg ?? null,
        iron_mg: f.iron_mg ?? null,
        magnesium_mg: f.magnesium_mg ?? null,
        phosphorus_mg: f.phosphorus_mg ?? null,
        zinc_mg: f.zinc_mg ?? null,
      };

      const { data, error } = await supabase.from('foods').insert(record).select().maybeSingle();
      if (!error && data) {
        setFoods((prev) => [data as Food, ...prev]);
        setUsdaImported((prev) => new Set([...prev, result.fdcId]));
      }
    } catch {
      // silent — user sees button revert
    }
    setUsdaImporting(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    if (editingId) {
      const { data } = await supabase
        .from('foods')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', editingId)
        .select()
        .maybeSingle();
      if (data) setFoods((prev) => prev.map((f) => (f.id === editingId ? data as Food : f)));
    } else {
      const { data } = await supabase.from('foods').insert(form).select().maybeSingle();
      if (data) setFoods((prev) => [data as Food, ...prev]);
    }
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FOOD);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('foods').delete().eq('id', id);
    setFoods((prev) => prev.filter((f) => f.id !== id));
    if (expandedRow === id) setExpandedRow(null);
  };

  const openEdit = (food: Food) => {
    setForm({ ...food });
    setEditingId(food.id);
    setShowForm(true);
  };

  const filtered = foods.filter((f) => {
    const q = search.toLowerCase();
    const matchSearch = !q || f.name.toLowerCase().includes(q) || (f.brand ?? '').toLowerCase().includes(q);
    const matchCat = filterCat === 'all' || f.category === filterCat;
    return matchSearch && matchCat;
  });

  const microStats = {
    total: foods.length,
    withMicro: foods.filter(hasMicronutrients).length,
    usda: foods.filter((f) => f.source === 'usda').length,
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="btn-ghost p-2 rounded-xl border" style={{ borderColor: '#e5e7eb' }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(253,218,54,0.2)' }}>
            <Database className="w-5 h-5" style={{ color: '#514163' }} />
          </div>
          <div>
            <h1 className="font-heading text-xl" style={{ color: '#1f2937' }}>Food Database</h1>
            <p className="font-body text-xs" style={{ color: '#9ca3af' }}>
              {microStats.total} foods · {microStats.withMicro} with micronutrients · {microStats.usda} from USDA
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => { setShowUsda(true); setUsdaResults([]); setUsdaQuery(''); setUsdaError(''); setUsdaImported(new Set()); }}
            className="btn-secondary flex items-center gap-2 py-2 px-4"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Import from</span> USDA
          </button>
          <button
            onClick={() => { setForm(EMPTY_FOOD); setEditingId(null); setShowForm(true); }}
            className="btn-primary flex items-center gap-2 py-2 px-4"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span> Food
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total Foods', value: microStats.total, icon: Database, color: '#514163', bg: 'rgba(81,65,99,0.08)' },
          { label: 'With Micronutrients', value: microStats.withMicro, icon: FlaskConical, color: '#0891b2', bg: '#e0f2fe' },
          { label: 'From USDA', value: microStats.usda, icon: Leaf, color: '#16a34a', bg: '#dcfce7' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl p-3 flex items-center gap-3" style={{ border: '1.5px solid #f3f4f6' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <div className="font-heading text-lg leading-none" style={{ color: '#1f2937' }}>{value}</div>
              <div className="font-body text-xs mt-0.5" style={{ color: '#9ca3af' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search foods..."
            className="input-brand pl-10"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="input-brand sm:w-48"
        >
          <option value="all">All Categories</option>
          {UNIQUE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Foods Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl" style={{ border: '2px solid #e5e7eb' }}>
          <Database className="w-12 h-12 mx-auto mb-3" style={{ color: '#d1d5db' }} />
          <h3 className="font-heading text-lg mb-2" style={{ color: '#1f2937' }}>No foods found</h3>
          <p className="font-body text-sm" style={{ color: '#9ca3af' }}>Add foods manually or import from USDA</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '2px solid #e5e7eb' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  {['', 'Food', 'Category', 'Cal', 'P / C / F', 'Micros', 'Source', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((food) => (
                  <>
                    <tr
                      key={food.id}
                      className="border-b hover:bg-gray-50 transition-colors group cursor-pointer"
                      style={{ borderColor: '#f3f4f6' }}
                      onClick={() => setExpandedRow(expandedRow === food.id ? null : food.id)}
                    >
                      <td className="pl-3 pr-1 py-3">
                        {expandedRow === food.id
                          ? <ChevronDown className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
                          : <ChevronRight className="w-3.5 h-3.5" style={{ color: '#d1d5db' }} />
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-body font-semibold text-sm" style={{ color: '#1f2937' }}>{food.name}</div>
                        {food.name_en && food.name_en !== food.name && (
                          <div className="font-body text-xs" style={{ color: '#9ca3af' }}>{food.name_en}</div>
                        )}
                        {food.brand && <div className="font-body text-xs" style={{ color: '#9ca3af' }}>{food.brand}</div>}
                        <div className="font-body text-xs" style={{ color: '#d1d5db' }}>{food.serving_description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge badge-purple capitalize text-xs">{food.category}</span>
                      </td>
                      <td className="px-4 py-3 font-body text-sm font-semibold" style={{ color: '#f59e0b' }}>
                        {food.calories_kcal}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 font-body text-xs">
                          <span className="font-semibold" style={{ color: '#10b981' }}>{food.protein_g}g</span>
                          <span style={{ color: '#d1d5db' }}>/</span>
                          <span className="font-semibold" style={{ color: '#3b82f6' }}>{food.carbs_g}g</span>
                          <span style={{ color: '#d1d5db' }}>/</span>
                          <span className="font-semibold" style={{ color: '#f97316' }}>{food.fat_g}g</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {hasMicronutrients(food) ? (
                          <div className="flex items-center gap-1">
                            <FlaskConical className="w-3.5 h-3.5" style={{ color: '#0891b2' }} />
                            <span className="font-body text-xs" style={{ color: '#0891b2' }}>24 nutrients</span>
                          </div>
                        ) : (
                          <span className="font-body text-xs" style={{ color: '#d1d5db' }}>macros only</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="badge text-xs"
                            style={{
                              backgroundColor: food.source === 'usda' ? '#dbeafe' : food.source === 'manual' ? '#f0fdf4' : '#fef3c7',
                              color: food.source === 'usda' ? '#2563eb' : food.source === 'manual' ? '#15803d' : '#b45309',
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
                          <button onClick={() => openEdit(food)} className="p-1.5 rounded-lg hover:bg-gray-100">
                            <Edit2 className="w-3.5 h-3.5" style={{ color: '#6b7280' }} />
                          </button>
                          <button onClick={() => handleDelete(food.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Micronutrients Row */}
                    {expandedRow === food.id && (
                      <tr key={`${food.id}-expanded`} style={{ backgroundColor: '#f8fafc' }}>
                        <td colSpan={8} className="px-6 py-4">
                          {hasMicronutrients(food) ? (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <FlaskConical className="w-4 h-4" style={{ color: '#0891b2' }} />
                                <span className="font-body text-sm font-semibold" style={{ color: '#0891b2' }}>
                                  Micronutrients per 100g — {food.usda_description ?? food.name}
                                </span>
                                {food.usda_fdc_id && (
                                  <span className="font-body text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>
                                    USDA FDC #{food.usda_fdc_id}
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                  <div className="font-body text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#6b7280' }}>Vitamins</div>
                                  {[
                                    { label: 'Vitamin A', value: food.vitamin_a_ug, unit: 'μg' },
                                    { label: 'Vitamin B1', value: food.vitamin_b1_mg, unit: 'mg' },
                                    { label: 'Vitamin B2', value: food.vitamin_b2_mg, unit: 'mg' },
                                    { label: 'Vitamin B3', value: food.vitamin_b3_mg, unit: 'mg' },
                                    { label: 'Vitamin B6', value: food.vitamin_b6_mg, unit: 'mg' },
                                    { label: 'Vitamin B12', value: food.vitamin_b12_ug, unit: 'μg' },
                                  ].map(({ label, value, unit }) => (
                                    <div key={label} className="flex justify-between py-0.5">
                                      <span className="font-body text-xs" style={{ color: '#6b7280' }}>{label}</span>
                                      <span className="font-body text-xs font-semibold" style={{ color: value != null ? '#1f2937' : '#d1d5db' }}>
                                        {fmt(value)} {value != null ? unit : ''}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <div className="font-body text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#6b7280' }}>Vitamins (cont.)</div>
                                  {[
                                    { label: 'Vitamin C', value: food.vitamin_c_mg, unit: 'mg' },
                                    { label: 'Vitamin D', value: food.vitamin_d_ug, unit: 'μg' },
                                    { label: 'Vitamin E', value: food.vitamin_e_mg, unit: 'mg' },
                                    { label: 'Vitamin K', value: food.vitamin_k_ug, unit: 'μg' },
                                    { label: 'Folate', value: food.folate_ug, unit: 'μg' },
                                  ].map(({ label, value, unit }) => (
                                    <div key={label} className="flex justify-between py-0.5">
                                      <span className="font-body text-xs" style={{ color: '#6b7280' }}>{label}</span>
                                      <span className="font-body text-xs font-semibold" style={{ color: value != null ? '#1f2937' : '#d1d5db' }}>
                                        {fmt(value)} {value != null ? unit : ''}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <div className="font-body text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#6b7280' }}>Minerals</div>
                                  {[
                                    { label: 'Calcium', value: food.calcium_mg, unit: 'mg' },
                                    { label: 'Iron', value: food.iron_mg, unit: 'mg' },
                                    { label: 'Magnesium', value: food.magnesium_mg, unit: 'mg' },
                                    { label: 'Phosphorus', value: food.phosphorus_mg, unit: 'mg' },
                                    { label: 'Potassium', value: food.potassium_mg, unit: 'mg' },
                                    { label: 'Zinc', value: food.zinc_mg, unit: 'mg' },
                                  ].map(({ label, value, unit }) => (
                                    <div key={label} className="flex justify-between py-0.5">
                                      <span className="font-body text-xs" style={{ color: '#6b7280' }}>{label}</span>
                                      <span className="font-body text-xs font-semibold" style={{ color: value != null ? '#1f2937' : '#d1d5db' }}>
                                        {fmt(value)} {value != null ? unit : ''}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <div className="font-body text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#6b7280' }}>Macros Detail</div>
                                  {[
                                    { label: 'Calories', value: food.calories_kcal, unit: 'kcal' },
                                    { label: 'Protein', value: food.protein_g, unit: 'g' },
                                    { label: 'Carbs', value: food.carbs_g, unit: 'g' },
                                    { label: 'Fat', value: food.fat_g, unit: 'g' },
                                    { label: 'Fiber', value: food.fiber_g, unit: 'g' },
                                    { label: 'Sugar', value: food.sugar_g, unit: 'g' },
                                    { label: 'Sodium', value: food.sodium_mg, unit: 'mg' },
                                  ].map(({ label, value, unit }) => (
                                    <div key={label} className="flex justify-between py-0.5">
                                      <span className="font-body text-xs" style={{ color: '#6b7280' }}>{label}</span>
                                      <span className="font-body text-xs font-semibold" style={{ color: '#1f2937' }}>
                                        {fmt(value, 0)} {unit}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 py-2">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
                                <AlertCircle className="w-4 h-4" style={{ color: '#b45309' }} />
                              </div>
                              <div>
                                <div className="font-body text-sm font-semibold" style={{ color: '#92400e' }}>No micronutrient data</div>
                                <div className="font-body text-xs" style={{ color: '#b45309' }}>
                                  This food was added manually. Import from USDA to get full vitamin and mineral data.
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USDA Import Modal */}
      {showUsda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col" style={{ border: '2px solid #e5e7eb' }}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#f3f4f6' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                  <ExternalLink className="w-4 h-4" style={{ color: '#2563eb' }} />
                </div>
                <div>
                  <span className="font-body font-semibold" style={{ color: '#1f2937' }}>USDA FoodData Central</span>
                  <p className="font-body text-xs" style={{ color: '#9ca3af' }}>Foundation Foods & SR Legacy · Full micronutrient data</p>
                </div>
              </div>
              <button onClick={() => setShowUsda(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" style={{ color: '#6b7280' }} />
              </button>
            </div>

            {/* Search input */}
            <div className="p-4 border-b" style={{ borderColor: '#f3f4f6' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={usdaQuery}
                  onChange={(e) => setUsdaQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchUSDA()}
                  placeholder="Search foods (e.g., chicken breast, oats, salmon...)"
                  className="input-brand flex-1"
                  autoFocus
                />
                <button
                  onClick={searchUSDA}
                  disabled={usdaLoading || !usdaQuery.trim()}
                  className="btn-primary px-4 py-2 flex items-center gap-2 flex-shrink-0 disabled:opacity-50"
                >
                  {usdaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Search
                </button>
              </div>
              {usdaError && (
                <p className="font-body text-xs mt-2" style={{ color: '#ef4444' }}>{usdaError}</p>
              )}
              {usdaTotalHits > 0 && usdaResults.length > 0 && (
                <p className="font-body text-xs mt-1" style={{ color: '#9ca3af' }}>
                  Showing {usdaResults.length} of {usdaTotalHits.toLocaleString()} results
                </p>
              )}
            </div>

            {/* API key missing notice */}
            {usdaApiMissing && (
              <div className="mx-4 mt-4 p-3 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#b45309' }} />
                <div>
                  <div className="font-body text-sm font-semibold" style={{ color: '#92400e' }}>USDA API Key not configured</div>
                  <div className="font-body text-xs mt-0.5" style={{ color: '#b45309' }}>
                    Add <code className="bg-amber-100 px-1 rounded">USDA_API_KEY</code> to your Supabase Edge Function secrets.
                    Get a free key at{' '}
                    <a href="https://fdc.nal.usda.gov/api-key-signup.html" target="_blank" rel="noopener noreferrer" className="underline">
                      fdc.nal.usda.gov
                    </a>
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
                        style={{ border: '1.5px solid', borderColor: alreadyImported ? '#bbf7d0' : '#f3f4f6', backgroundColor: alreadyImported ? '#f0fdf4' : '#ffffff' }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-body font-semibold text-sm truncate" style={{ color: '#1f2937' }}>{food.name_es}</div>
                          <div className="font-body text-xs truncate" style={{ color: '#9ca3af' }}>{food.name_en}</div>
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
                            <span
                              className="font-body text-xs px-1.5 py-0.5 rounded-full capitalize"
                              style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
                            >
                              {food.dataType}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => !alreadyImported && importUSDAFood(food)}
                          disabled={alreadyImported || isImporting}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs font-semibold flex-shrink-0 transition-all disabled:cursor-default"
                          style={{
                            backgroundColor: alreadyImported ? '#dcfce7' : '#1f2937',
                            color: alreadyImported ? '#15803d' : '#ffffff',
                          }}
                        >
                          {isImporting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : alreadyImported ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                          {alreadyImported ? 'Added' : 'Import'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {usdaResults.length === 0 && !usdaLoading && !usdaError && !usdaApiMissing && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#f1f5f9' }}>
                    <Zap className="w-6 h-6" style={{ color: '#94a3b8' }} />
                  </div>
                  <p className="font-body text-sm font-semibold" style={{ color: '#1f2937' }}>Search USDA FoodData Central</p>
                  <p className="font-body text-xs mt-1" style={{ color: '#9ca3af' }}>
                    Over 300,000 foods with complete vitamin & mineral data
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {['chicken breast', 'brown rice', 'salmon', 'avocado', 'spinach', 'almonds'].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setUsdaQuery(s); }}
                        className="px-3 py-1 rounded-full font-body text-xs transition-colors"
                        style={{ backgroundColor: '#f1f5f9', color: '#475569' }}
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

      {/* Add/Edit Food Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ border: '2px solid #e5e7eb' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white z-10" style={{ borderColor: '#f3f4f6' }}>
              <h3 className="font-body font-semibold" style={{ color: '#1f2937' }}>{editingId ? 'Edit Food' : 'Add Food'}</h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" style={{ color: '#6b7280' }} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {form.source === 'usda' && (
                <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#dbeafe', border: '1px solid #93c5fd' }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#2563eb' }} />
                  <span className="font-body text-xs" style={{ color: '#1d4ed8' }}>
                    USDA FDC #{form.usda_fdc_id} — values per 100g
                  </span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Food Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="input-brand"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Brand</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    placeholder="optional"
                    className="input-brand"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="input-brand"
                  >
                    {UNIQUE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Serving Size (g)</label>
                  <input
                    type="number"
                    value={form.serving_size_g}
                    onChange={(e) => setForm((f) => ({ ...f, serving_size_g: parseFloat(e.target.value) || 100 }))}
                    className="input-brand"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Serving Description</label>
                  <input
                    type="text"
                    value={form.serving_description}
                    onChange={(e) => setForm((f) => ({ ...f, serving_description: e.target.value }))}
                    className="input-brand"
                  />
                </div>
              </div>

              {/* Macros */}
              <div className="border-t pt-3" style={{ borderColor: '#f3f4f6' }}>
                <div className="font-body text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9ca3af' }}>
                  Macros per 100g
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'calories_kcal' as const, label: 'Calories (kcal)', color: '#f59e0b' },
                    { key: 'carbs_g' as const, label: 'Carbohydrates (g)', color: '#3b82f6' },
                    { key: 'protein_g' as const, label: 'Protein (g)', color: '#10b981' },
                    { key: 'fat_g' as const, label: 'Fat (g)', color: '#f97316' },
                    { key: 'fiber_g' as const, label: 'Fiber (g)', color: '#6b7280' },
                    { key: 'sugar_g' as const, label: 'Sugar (g)', color: '#ec4899' },
                    { key: 'sodium_mg' as const, label: 'Sodium (mg)', color: '#6b7280' },
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
                        className="input-brand text-sm py-2"
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
                    borderColor: form.is_verified ? '#10b981' : '#e5e7eb',
                    backgroundColor: form.is_verified ? '#f0fdf4' : '#ffffff',
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: form.is_verified ? '#10b981' : '#d1d5db' }} />
                  <span className="font-body text-xs font-medium" style={{ color: form.is_verified ? '#15803d' : '#6b7280' }}>
                    Verified
                  </span>
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="flex-1 py-2.5 rounded-xl border font-body font-medium text-sm"
                  style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.name.trim()}
                  className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingId ? 'Update' : 'Add Food'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
