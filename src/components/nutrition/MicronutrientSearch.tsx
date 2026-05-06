import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Search, Microscope, ChevronDown, ChevronUp, Loader2, Leaf, Pill } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePreferences } from '../../lib/preferences';

interface Props {
  onBack: () => void;
}

interface FoodResult {
  id: string;
  name: string;
  name_es?: string;
  brand?: string;
  category?: string;
  calories_kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  serving_size_g?: number;
  serving_description?: string;
  is_supplement?: boolean;
  vitamin_d_mcg?: number;
  vitamin_c_mg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  magnesium_mg?: number;
  potassium_mg?: number;
  zinc_mg?: number;
  sodium_mg?: number;
  vitamin_b12_mcg?: number;
  vitamin_a_mcg?: number;
  folate_mcg?: number;
  omega3_g?: number;
  fiber_g?: number;
  phosphorus_mg?: number;
  selenium_mcg?: number;
  vitamin_e_mg?: number;
  vitamin_k_mcg?: number;
}

interface Micronutrient {
  key: keyof FoodResult;
  label: string;
  unit: string;
  rda?: number;
  icon: string;
  color: string;
  bg: string;
  description: string;
}

function getMicronutrients(es: boolean): Micronutrient[] {
  return [
    { key: 'vitamin_d_mcg', label: es ? 'Vitamina D' : 'Vitamin D', unit: 'mcg', rda: 15, icon: '☀️', color: '#b45309', bg: '#fef3c7', description: es ? 'Absorción de calcio, inmunidad, función muscular' : 'Calcium absorption, immunity, muscle function' },
    { key: 'iron_mg', label: es ? 'Hierro' : 'Iron', unit: 'mg', rda: 18, icon: '🩸', color: '#b91c1c', bg: '#fef2f2', description: es ? 'Transporte de oxígeno, energía, síntesis de hemoglobina' : 'Oxygen transport, energy, hemoglobin synthesis' },
    { key: 'calcium_mg', label: es ? 'Calcio' : 'Calcium', unit: 'mg', rda: 1000, icon: '🦴', color: '#0369a1', bg: '#e0f2fe', description: es ? 'Salud ósea, contracción muscular, señalización celular' : 'Bone health, muscle contraction, cell signaling' },
    { key: 'magnesium_mg', label: es ? 'Magnesio' : 'Magnesium', unit: 'mg', rda: 400, icon: '⚡', color: '#0891b2', bg: '#ecfeff', description: es ? 'Producción de energía, síntesis proteica, función nerviosa' : 'Energy production, protein synthesis, nerve function' },
    { key: 'potassium_mg', label: es ? 'Potasio' : 'Potassium', unit: 'mg', rda: 3500, icon: '💧', color: '#15803d', bg: '#f0fdf4', description: es ? 'Equilibrio electrolítico, función cardiaca, contracción muscular' : 'Electrolyte balance, heart function, muscle contraction' },
    { key: 'zinc_mg', label: 'Zinc', unit: 'mg', rda: 11, icon: '🛡️', color: '#7c3aed', bg: '#f5f3ff', description: es ? 'Inmunidad, síntesis proteica, recuperación muscular' : 'Immunity, protein synthesis, muscle recovery' },
    { key: 'vitamin_c_mg', label: es ? 'Vitamina C' : 'Vitamin C', unit: 'mg', rda: 90, icon: '🍊', color: '#ea580c', bg: '#fff7ed', description: es ? 'Antioxidante, síntesis de colágeno, absorción de hierro' : 'Antioxidant, collagen synthesis, iron absorption' },
    { key: 'vitamin_b12_mcg', label: es ? 'Vitamina B12' : 'B12', unit: 'mcg', rda: 2.4, icon: '🔋', color: '#1d4ed8', bg: '#eff6ff', description: es ? 'Glóbulos rojos, función nerviosa, ADN' : 'Red blood cells, nerve function, DNA' },
    { key: 'vitamin_a_mcg', label: es ? 'Vitamina A' : 'Vitamin A', unit: 'mcg', rda: 900, icon: '👁️', color: '#d97706', bg: '#fef9c3', description: es ? 'Visión, inmunidad, crecimiento celular' : 'Vision, immunity, cell growth' },
    { key: 'folate_mcg', label: es ? 'Folato (B9)' : 'Folate (B9)', unit: 'mcg', rda: 400, icon: '🌿', color: '#16a34a', bg: '#f0fdf4', description: es ? 'Síntesis de ADN, glóbulos rojos, metabolismo' : 'DNA synthesis, red blood cells, metabolism' },
    { key: 'omega3_g', label: 'Omega-3', unit: 'g', rda: 1.6, icon: '🐟', color: '#0284c7', bg: '#f0f9ff', description: es ? 'Antiinflamatorio, función cardiaca y cerebral, recuperación' : 'Anti-inflammatory, heart and brain function, recovery' },
    { key: 'fiber_g', label: es ? 'Fibra' : 'Fiber', unit: 'g', rda: 30, icon: '🌾', color: '#92400e', bg: '#fef3c7', description: es ? 'Salud digestiva, microbioma, saciedad' : 'Digestive health, microbiome, satiety' },
    { key: 'selenium_mcg', label: es ? 'Selenio' : 'Selenium', unit: 'mcg', rda: 55, icon: '💊', color: '#6b7280', bg: '#f3f4f6', description: es ? 'Antioxidante, función tiroidea, inmunidad' : 'Antioxidant, thyroid function, immunity' },
    { key: 'vitamin_e_mg', label: es ? 'Vitamina E' : 'Vitamin E', unit: 'mg', rda: 15, icon: '🌻', color: '#d97706', bg: '#fef3c7', description: es ? 'Antioxidante liposoluble, inmunidad, piel' : 'Fat-soluble antioxidant, immunity, skin health' },
    { key: 'vitamin_k_mcg', label: es ? 'Vitamina K' : 'Vitamin K', unit: 'mcg', rda: 120, icon: '🩹', color: '#15803d', bg: '#f0fdf4', description: es ? 'Coagulación sanguínea, metabolismo óseo' : 'Blood clotting, bone metabolism' },
    { key: 'phosphorus_mg', label: es ? 'Fósforo' : 'Phosphorus', unit: 'mg', rda: 700, icon: '⚗️', color: '#374151', bg: '#f9fafb', description: es ? 'Salud ósea, producción de ATP, función celular' : 'Bone health, ATP production, cell function' },
  ];
}

function getTopFoods(foods: FoodResult[], key: keyof FoodResult, n = 20) {
  return [...foods]
    .filter((f) => typeof f[key] === 'number' && (f[key] as number) > 0)
    .sort((a, b) => ((b[key] as number) ?? 0) - ((a[key] as number) ?? 0))
    .slice(0, n);
}

function rdaPct(value: number, rda: number) {
  return Math.min(100, Math.round((value / rda) * 100));
}

export default function MicronutrientSearch({ onBack }: Props) {
  const { language } = usePreferences();
  const es = language === 'es';

  const micronutrients = useMemo(() => getMicronutrients(es), [es]);

  const [foods, setFoods] = useState<FoodResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Micronutrient>(micronutrients[0]);
  const [search, setSearch] = useState('');
  const [showSupplements, setShowSupplements] = useState(true);
  const [showFoods, setShowFoods] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('foods_v2')
        .select(`
          id, name, name_es, brand, category, calories_kcal, protein_g, carbs_g, fat_g,
          serving_size_g, serving_description, is_supplement,
          vitamin_d_mcg, vitamin_c_mg, calcium_mg, iron_mg, magnesium_mg, potassium_mg,
          zinc_mg, sodium_mg, vitamin_b12_mcg, vitamin_a_mcg, folate_mcg, omega3_g,
          fiber_g, phosphorus_mg, selenium_mcg, vitamin_e_mg, vitamin_k_mcg
        `)
        .eq('is_active', true)
        .limit(2000);
      setFoods((data ?? []) as FoodResult[]);
      setLoading(false);
    })();
  }, []);

  // Keep selected in sync when language changes (match by key)
  useMemo(() => {
    setSelected((prev) => micronutrients.find((m) => m.key === prev.key) ?? micronutrients[0]);
  }, [micronutrients]);

  const results = useMemo(() => {
    let list = getTopFoods(foods, selected.key, 50);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) =>
        f.name.toLowerCase().includes(q) ||
        (f.name_es ?? '').toLowerCase().includes(q) ||
        (f.brand ?? '').toLowerCase().includes(q)
      );
    }
    const supplements = list.filter((f) => f.is_supplement);
    const realFoods = list.filter((f) => !f.is_supplement);
    return { supplements, realFoods };
  }, [foods, selected, search]);

  const topValue = results.realFoods[0]
    ? ((results.realFoods[0][selected.key] as number) ?? 0)
    : ((results.supplements[0]?.[selected.key] as number) ?? 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} />
      </div>
    );
  }

  function FoodRow({ food }: { food: FoodResult }) {
    const value = (food[selected.key] as number) ?? 0;
    const barWidth = topValue > 0 ? (value / topValue) * 100 : 0;
    const rdaVal = selected.rda ? rdaPct(value, selected.rda) : null;
    const isExpanded = expandedId === food.id;
    const displayName = (es ? food.name_es : food.name) || food.name;

    return (
      <div
        className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-sm"
        style={{ border: `1px solid ${selected.bg === '#f9fafb' ? '#e5e7eb' : selected.bg}` }}
        onClick={() => setExpandedId(isExpanded ? null : food.id)}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
            style={{ backgroundColor: selected.bg }}
          >
            {food.is_supplement ? <Pill className="w-5 h-5" style={{ color: selected.color }} /> : <Leaf className="w-5 h-5" style={{ color: selected.color }} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold truncate" style={{ color: '#1f2937' }}>{displayName}</span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-sm font-bold" style={{ color: selected.color }}>
                  {value % 1 === 0 ? value : value.toFixed(1)}
                </span>
                <span className="text-xs" style={{ color: '#9ca3af' }}>{selected.unit}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${barWidth}%`, backgroundColor: selected.color }}
                />
              </div>
              {rdaVal !== null && (
                <span
                  className="text-xs font-medium flex-shrink-0"
                  style={{ color: rdaVal >= 100 ? '#15803d' : rdaVal >= 50 ? '#b45309' : '#9ca3af' }}
                >
                  {rdaVal}% RDA
                </span>
              )}
            </div>
            {food.brand && (
              <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{food.brand}</div>
            )}
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: '#9ca3af' }} /> : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#9ca3af' }} />}
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: '#f3f4f6' }}>
            <div className="pt-3 grid grid-cols-4 gap-2">
              {[
                { label: es ? 'Cal' : 'Cal', val: `${Math.round(food.calories_kcal)}`, unit: 'kcal', color: '#f59e0b' },
                { label: 'Carbs', val: `${Math.round(food.carbs_g)}`, unit: 'g', color: '#3b82f6' },
                { label: es ? 'Prot' : 'Prot', val: `${Math.round(food.protein_g)}`, unit: 'g', color: '#10b981' },
                { label: es ? 'Grasa' : 'Fat', val: `${Math.round(food.fat_g)}`, unit: 'g', color: '#f97316' },
              ].map(({ label, val, unit, color }) => (
                <div key={label} className="text-center rounded-xl py-2" style={{ backgroundColor: '#f9fafb' }}>
                  <div className="text-xs font-bold" style={{ color }}>{val}<span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>{unit}</span></div>
                  <div className="text-xs" style={{ color: '#9ca3af' }}>{label}</div>
                </div>
              ))}
            </div>
            <div className="text-xs mt-2" style={{ color: '#9ca3af' }}>
              {es ? 'Por' : 'Per'} {food.serving_description ?? `${food.serving_size_g ?? 100}g`}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl border hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb' }}>
          <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ecfdf5' }}>
            <Microscope className="w-4 h-4" style={{ color: '#059669' }} />
          </div>
          <div>
            <h1 className="font-heading text-xl" style={{ color: '#1f2937' }}>{es ? 'Búsqueda por Micronutriente' : 'Micronutrient Search'}</h1>
            <p className="text-xs" style={{ color: '#9ca3af' }}>{es ? 'Encuentra alimentos ricos en vitaminas y minerales' : 'Find foods rich in vitamins & minerals'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2" style={{ width: 'max-content' }}>
            {micronutrients.map((m) => (
              <button
                key={m.key as string}
                onClick={() => { setSelected(m); setExpandedId(null); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-medium flex-shrink-0 transition-all"
                style={{
                  borderColor: selected.key === m.key ? m.color : '#e5e7eb',
                  backgroundColor: selected.key === m.key ? m.bg : '#fff',
                  color: selected.key === m.key ? m.color : '#6b7280',
                }}
              >
                <span>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{ backgroundColor: selected.bg, border: `2px solid ${selected.color}20` }}
        >
          <span className="text-2xl flex-shrink-0">{selected.icon}</span>
          <div>
            <div className="font-semibold text-sm" style={{ color: selected.color }}>{selected.label}</div>
            <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{selected.description}</div>
            {selected.rda && (
              <div className="text-xs mt-1 font-medium" style={{ color: selected.color }}>
                RDA: {selected.rda} {selected.unit}/{es ? 'día' : 'day'}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${es ? 'Filtrar' : 'Filter'} ${selected.label}...`}
            className="input-brand pl-10"
          />
        </div>
      </div>

      {results.realFoods.length === 0 && results.supplements.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl" style={{ border: '2px solid #e5e7eb' }}>
          <Microscope className="w-12 h-12 mx-auto mb-3" style={{ color: '#d1d5db' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>{es ? 'Sin datos para este micronutriente en la base de datos' : 'No data for this micronutrient in the database'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.realFoods.length > 0 && (
            <div className="space-y-3">
              <button
                onClick={() => setShowFoods(!showFoods)}
                className="flex items-center justify-between w-full"
              >
                <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#9ca3af' }}>
                  <Leaf className="w-3.5 h-3.5" />
                  {es ? 'Alimentos' : 'Foods'} — top {results.realFoods.length}
                </div>
                {showFoods ? <ChevronUp className="w-4 h-4" style={{ color: '#9ca3af' }} /> : <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} />}
              </button>
              {showFoods && results.realFoods.map((f) => <FoodRow key={f.id} food={f} />)}
            </div>
          )}

          {results.supplements.length > 0 && (
            <div className="space-y-3">
              <button
                onClick={() => setShowSupplements(!showSupplements)}
                className="flex items-center justify-between w-full"
              >
                <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#9ca3af' }}>
                  <Pill className="w-3.5 h-3.5" />
                  {es ? 'Suplementos' : 'Supplements'} — top {results.supplements.length}
                </div>
                {showSupplements ? <ChevronUp className="w-4 h-4" style={{ color: '#9ca3af' }} /> : <ChevronDown className="w-4 h-4" style={{ color: '#9ca3af' }} />}
              </button>
              {showSupplements && results.supplements.map((f) => <FoodRow key={f.id} food={f} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
