import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Search, Plus, Trash2, CreditCard as Edit2, X, Save, Loader2, Zap, Filter, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';

interface Props {
  onBack: () => void;
}

interface Supplement {
  id: string;
  name_es: string;
  name_en: string;
  brand: string;
  category: string;
  product_form: string;
  serving_unit: string;
  serving_size_g: number;
  serving_description: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sugar_per_100g: number;
  sodium_mg: number;
  potassium_mg: number;
  magnesium_mg: number;
  calcium_mg: number;
  iron_mg: number;
  zinc_mg: number;
  vitamin_c_mg: number;
  vitamin_d_ug: number;
  vitamin_b12_ug: number;
  caffeine_mg: number;
  beta_alanine_mg: number;
  creatine_mg: number;
  electrolytes_note: string;
  flavors: string[];
  region: string;
  is_supplement: boolean;
  is_verified: boolean;
  antidoping_note: string;
  source: string;
}

type ProductForm = 'powder' | 'gel' | 'bar' | 'tablet' | 'capsule' | 'liquid' | 'chew' | 'strip' | '';
type Region = 'north_america' | 'europe' | 'south_america' | 'east_africa' | 'global' | '';

const SUPPLEMENT_CATEGORIES = [
  { value: '', label_es: 'Todas las Categorías', label_en: 'All Categories' },
  { value: 'whey_protein', label_es: 'Proteína Whey', label_en: 'Whey Protein' },
  { value: 'isolate', label_es: 'Proteína Isolada', label_en: 'Protein Isolate' },
  { value: 'plant_protein', label_es: 'Proteína Vegetal', label_en: 'Plant Protein' },
  { value: 'gel', label_es: 'Geles Energéticos', label_en: 'Energy Gels' },
  { value: 'sports_drink', label_es: 'Bebidas Deportivas', label_en: 'Sports Drinks' },
  { value: 'drink_mix', label_es: 'Mezclas en Polvo', label_en: 'Drink Mixes' },
  { value: 'protein_bar', label_es: 'Barras de Proteína', label_en: 'Protein Bars' },
  { value: 'creatine', label_es: 'Creatina', label_en: 'Creatine' },
  { value: 'caffeine', label_es: 'Cafeína', label_en: 'Caffeine' },
  { value: 'beta_alanine', label_es: 'Beta-Alanina', label_en: 'Beta-Alanine' },
  { value: 'iron', label_es: 'Hierro', label_en: 'Iron Supplements' },
  { value: 'vitamin_c', label_es: 'Vitamina C', label_en: 'Vitamin C' },
  { value: 'vitamin_d', label_es: 'Vitamina D', label_en: 'Vitamin D' },
  { value: 'vitamin_b12', label_es: 'Vitamina B12', label_en: 'Vitamin B12' },
  { value: 'multivitamin', label_es: 'Multivitamínico', label_en: 'Multivitamins' },
];

const REGIONS: { value: Region; label_es: string; label_en: string; flag: string }[] = [
  { value: '', label_es: 'Todas las Regiones', label_en: 'All Regions', flag: '🌍' },
  { value: 'north_america', label_es: 'Norteamérica', label_en: 'North America', flag: '🇺🇸' },
  { value: 'europe', label_es: 'Europa', label_en: 'Europe', flag: '🇪🇺' },
  { value: 'south_america', label_es: 'Sudamérica', label_en: 'South America', flag: '🇦🇷' },
  { value: 'east_africa', label_es: 'África del Este / USN', label_en: 'East Africa / USN', flag: '🇿🇦' },
  { value: 'global', label_es: 'Global', label_en: 'Global', flag: '🌐' },
];

const PRODUCT_FORMS: { value: ProductForm; label_es: string; label_en: string }[] = [
  { value: '', label_es: 'Todas las Formas', label_en: 'All Forms' },
  { value: 'powder', label_es: 'Polvo', label_en: 'Powder' },
  { value: 'gel', label_es: 'Gel', label_en: 'Gel' },
  { value: 'bar', label_es: 'Barra', label_en: 'Bar' },
  { value: 'tablet', label_es: 'Tableta', label_en: 'Tablet' },
  { value: 'capsule', label_es: 'Cápsula', label_en: 'Capsule' },
  { value: 'liquid', label_es: 'Líquido', label_en: 'Liquid' },
  { value: 'chew', label_es: 'Masticable', label_en: 'Chew' },
];

const FORM_CONFIG: Record<string, { bg: string; color: string; label_es: string; label_en: string }> = {
  powder: { bg: '#fef3c7', color: '#b45309', label_es: 'Polvo', label_en: 'Powder' },
  gel: { bg: '#eff6ff', color: '#2563eb', label_es: 'Gel', label_en: 'Gel' },
  bar: { bg: '#fdf2f8', color: '#be185d', label_es: 'Barra', label_en: 'Bar' },
  tablet: { bg: '#f5f3ff', color: '#7c3aed', label_es: 'Tableta', label_en: 'Tablet' },
  capsule: { bg: '#f0fdf4', color: '#15803d', label_es: 'Cápsula', label_en: 'Capsule' },
  liquid: { bg: '#ecfeff', color: '#0e7490', label_es: 'Líquido', label_en: 'Liquid' },
  chew: { bg: '#fff7ed', color: '#c2410c', label_es: 'Masticable', label_en: 'Chew' },
  strip: { bg: '#fdf2f8', color: '#9d174d', label_es: 'Tira', label_en: 'Strip' },
};

const REGION_CONFIG: Record<string, { bg: string; color: string; label: string; flag: string }> = {
  north_america: { bg: '#eff6ff', color: '#1d4ed8', label: 'NA', flag: '🇺🇸' },
  europe: { bg: '#f0fdf4', color: '#15803d', label: 'EU', flag: '🇪🇺' },
  south_america: { bg: '#fefce8', color: '#b45309', label: 'SA', flag: '🇦🇷' },
  east_africa: { bg: '#fef2f2', color: '#b91c1c', label: 'EA', flag: '🇿🇦' },
  global: { bg: '#f3f4f6', color: '#4b5563', label: 'GLB', flag: '🌐' },
};

const EMPTY_SUPPLEMENT: Omit<Supplement, 'id'> = {
  name_es: '', name_en: '', brand: '', category: 'supplements',
  product_form: 'powder', serving_unit: 'scoop', serving_size_g: 30,
  serving_description: '1 scoop (30g)',
  calories_per_100g: 0, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 0,
  fiber_per_100g: 0, sugar_per_100g: 0, sodium_mg: 0, potassium_mg: 0,
  magnesium_mg: 0, calcium_mg: 0, iron_mg: 0, zinc_mg: 0,
  vitamin_c_mg: 0, vitamin_d_ug: 0, vitamin_b12_ug: 0,
  caffeine_mg: 0, beta_alanine_mg: 0, creatine_mg: 0,
  electrolytes_note: '', flavors: [], region: 'global',
  is_supplement: true, is_verified: false,
  antidoping_note: '', source: 'internal',
};

function fmt(v: number | null | undefined) {
  if (v === null || v === undefined || v === 0) return null;
  return v % 1 === 0 ? String(v) : v.toFixed(1);
}

function MacroPill({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  const f = fmt(value);
  if (!f) return null;
  return (
    <span className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full font-medium"
      style={{ backgroundColor: `${color}18`, color }}>
      {label} {f}{unit}
    </span>
  );
}

function SupplementCard({ supp, onEdit, onDelete, isAdmin, es }: {
  supp: Supplement; onEdit: () => void; onDelete: () => void; isAdmin: boolean; es: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const form = FORM_CONFIG[supp.product_form] ?? { bg: '#f3f4f6', color: '#6b7280', label_es: supp.product_form, label_en: supp.product_form };
  const region = REGION_CONFIG[supp.region] ?? REGION_CONFIG.global;

  const servingKcal = supp.calories_per_100g * supp.serving_size_g / 100;
  const servingProt = supp.protein_per_100g * supp.serving_size_g / 100;
  const servingCarbs = supp.carbs_per_100g * supp.serving_size_g / 100;
  const servingFat = supp.fat_per_100g * supp.serving_size_g / 100;

  return (
    <div className="bg-white rounded-2xl transition-all"
      style={{ border: '1.5px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: form.bg, color: form.color }}>
                {es ? form.label_es : form.label_en}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: region.bg, color: region.color }}>
                {region.flag} {region.label}
              </span>
              {supp.is_verified && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
                  {es ? 'Verificado' : 'Verified'}
                </span>
              )}
              {supp.antidoping_note && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                  {supp.antidoping_note}
                </span>
              )}
            </div>

            <div className="font-heading font-bold text-sm" style={{ color: '#1f2937' }}>
              {es ? (supp.name_es || supp.name_en) : (supp.name_en || supp.name_es)}
            </div>
            {supp.brand && (
              <div className="text-xs mt-0.5 font-medium" style={{ color: '#6b7280' }}>{supp.brand}</div>
            )}

            <div className="text-xs mt-1" style={{ color: '#6b7280' }}>
              {supp.serving_description}
              {servingKcal > 0 && (
                <span className="ml-2 font-medium" style={{ color: '#1f2937' }}>
                  {Math.round(servingKcal)} kcal/{es ? 'porción' : 'serving'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <MacroPill label="P" value={servingProt} unit="g" color="#10b981" />
              <MacroPill label="C" value={servingCarbs} unit="g" color="#3b82f6" />
              <MacroPill label="G" value={servingFat} unit="g" color="#f97316" />
              <MacroPill label="Caf" value={supp.caffeine_mg} unit="mg" color="#7c3aed" />
              <MacroPill label="Creat" value={supp.creatine_mg > 0 ? supp.creatine_mg / 1000 : 0} unit="g" color="#0e7490" />
              <MacroPill label="β-Ala" value={supp.beta_alanine_mg > 0 ? supp.beta_alanine_mg / 1000 : 0} unit="g" color="#be185d" />
              <MacroPill label="Fe" value={supp.iron_mg} unit="mg" color="#b45309" />
              <MacroPill label="VitC" value={supp.vitamin_c_mg > 0 && supp.vitamin_c_mg < 1000 ? supp.vitamin_c_mg : supp.vitamin_c_mg / 1000} unit={supp.vitamin_c_mg >= 1000 ? 'g' : 'mg'} color="#f59e0b" />
              <MacroPill label="VitD" value={supp.vitamin_d_ug} unit="µg" color="#fdba74" />
              <MacroPill label="B12" value={supp.vitamin_b12_ug} unit="µg" color="#818cf8" />
            </div>

            {supp.flavors && supp.flavors.length > 0 && (
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                <span className="text-xs" style={{ color: '#9ca3af' }}>{es ? 'Sabores' : 'Flavors'}:</span>
                {supp.flavors.slice(0, 3).map((f, i) => (
                  <span key={i} className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: '#f9fafb', color: '#6b7280', border: '1px solid #f3f4f6' }}>
                    {f}
                  </span>
                ))}
                {supp.flavors.length > 3 && (
                  <span className="text-xs" style={{ color: '#9ca3af' }}>+{supp.flavors.length - 3} {es ? 'más' : 'more'}</span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-start gap-1 flex-shrink-0">
            {isAdmin && (
              <>
                <button onClick={onEdit}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-all"
                  title={es ? 'Editar' : 'Edit'}>
                  <Edit2 className="w-3.5 h-3.5" style={{ color: '#6b7280' }} />
                </button>
                <button onClick={onDelete}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-all"
                  title={es ? 'Eliminar' : 'Delete'}>
                  <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                </button>
              </>
            )}
            <button onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-all">
              <ChevronDown className="w-3.5 h-3.5 transition-transform"
                style={{ color: '#6b7280', transform: expanded ? 'rotate(180deg)' : '' }} />
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: '#f3f4f6' }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            {[
              { label_es: 'Calorías', label_en: 'Calories', value: `${Math.round(supp.calories_per_100g)} kcal` },
              { label_es: 'Proteína', label_en: 'Protein', value: `${supp.protein_per_100g}g` },
              { label_es: 'Carbos', label_en: 'Carbs', value: `${supp.carbs_per_100g}g` },
              { label_es: 'Grasas', label_en: 'Fat', value: `${supp.fat_per_100g}g` },
            ].map(({ label_es, label_en, value }) => (
              <div key={label_en} className="rounded-xl p-2.5 text-center"
                style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <div className="text-sm font-bold" style={{ color: '#1f2937' }}>{value}</div>
                <div className="text-xs font-medium" style={{ color: '#374151' }}>{es ? label_es : label_en}</div>
                <div className="text-xs" style={{ color: '#9ca3af' }}>{es ? 'por 100g' : 'per 100g'}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {[
              { label_es: 'Sodio', label_en: 'Sodium', value: fmt(supp.sodium_mg), unit: 'mg' },
              { label_es: 'Potasio', label_en: 'Potassium', value: fmt(supp.potassium_mg), unit: 'mg' },
              { label_es: 'Magnesio', label_en: 'Magnesium', value: fmt(supp.magnesium_mg), unit: 'mg' },
              { label_es: 'Calcio', label_en: 'Calcium', value: fmt(supp.calcium_mg), unit: 'mg' },
              { label_es: 'Hierro', label_en: 'Iron', value: fmt(supp.iron_mg), unit: 'mg' },
              { label_es: 'Zinc', label_en: 'Zinc', value: fmt(supp.zinc_mg), unit: 'mg' },
              { label_es: 'Vitamina C', label_en: 'Vitamin C', value: fmt(supp.vitamin_c_mg), unit: 'mg' },
              { label_es: 'Vitamina D', label_en: 'Vitamin D', value: fmt(supp.vitamin_d_ug), unit: 'µg' },
              { label_es: 'Vitamina B12', label_en: 'Vitamin B12', value: fmt(supp.vitamin_b12_ug), unit: 'µg' },
              { label_es: 'Cafeína', label_en: 'Caffeine', value: fmt(supp.caffeine_mg), unit: 'mg' },
              { label_es: 'Creatina', label_en: 'Creatine', value: supp.creatine_mg > 0 ? String(supp.creatine_mg) : null, unit: 'mg' },
              { label_es: 'Beta-Alanina', label_en: 'Beta-Alanine', value: supp.beta_alanine_mg > 0 ? String(supp.beta_alanine_mg) : null, unit: 'mg' },
            ].filter(x => x.value !== null).map(({ label_es, label_en, value, unit }) => (
              <div key={label_en} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
                style={{ backgroundColor: '#f9fafb' }}>
                <span className="text-xs" style={{ color: '#6b7280' }}>
                  {es ? label_es : label_en}
                </span>
                <span className="text-xs font-semibold" style={{ color: '#374151' }}>{value} {unit}</span>
              </div>
            ))}
          </div>

          {supp.electrolytes_note && (
            <div className="mt-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
              {supp.electrolytes_note}
            </div>
          )}

          {supp.flavors && supp.flavors.length > 0 && (
            <div className="mt-2">
              <div className="text-xs font-medium mb-1" style={{ color: '#6b7280' }}>
                {es ? 'Sabores disponibles:' : 'Available flavors:'}
              </div>
              <div className="flex flex-wrap gap-1">
                {supp.flavors.map((f, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface FormProps {
  initial: Omit<Supplement, 'id'>;
  onSave: (data: Omit<Supplement, 'id'>) => Promise<void>;
  onClose: () => void;
  saving: boolean;
  es: boolean;
}

function SupplementForm({ initial, onSave, onClose, saving, es }: FormProps) {
  const [form, setForm] = useState<Omit<Supplement, 'id'>>(initial);
  const [flavorsText, setFlavorsText] = useState((initial.flavors ?? []).join(', '));

  const set = (k: keyof typeof form, v: unknown) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    const flavors = flavorsText.split(',').map((s) => s.trim()).filter(Boolean);
    await onSave({ ...form, flavors });
  };

  const field = (label_es: string, label_en: string, key: keyof typeof form, type = 'text', step?: string) => (
    <div>
      <label className="text-xs font-medium mb-1 block" style={{ color: '#374151' }}>
        {es ? label_es : label_en}
      </label>
      <input
        type={type}
        step={step}
        value={form[key] as string | number}
        onChange={(e) => set(key, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2"
        style={{ borderColor: '#e5e7eb', color: '#1f2937' }}
      />
    </div>
  );

  const isEdit = !!initial.name_es;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: '#e5e7eb' }}>
          <div>
            <h2 className="font-heading text-lg font-bold" style={{ color: '#1f2937' }}>
              {isEdit
                ? (es ? 'Editar Suplemento' : 'Edit Supplement')
                : (es ? 'Agregar Suplemento' : 'Add New Supplement')}
            </h2>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              {isEdit
                ? (es ? 'Modifica los datos del suplemento' : 'Edit Supplement')
                : (es ? 'Agregar nuevo suplemento' : 'Add New Supplement')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Nombre en Español', 'Name in Spanish', 'name_es')}
            {field('Nombre en Inglés', 'Name in English', 'name_en')}
            {field('Marca', 'Brand', 'brand')}
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: '#374151' }}>
                {es ? 'Región' : 'Region'}
              </label>
              <select value={form.region} onChange={(e) => set('region', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: '#e5e7eb' }}>
                {REGIONS.filter(r => r.value).map(r => (
                  <option key={r.value} value={r.value}>{r.flag} {es ? r.label_es : r.label_en}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: '#374151' }}>
                {es ? 'Forma del Producto' : 'Product Form'}
              </label>
              <select value={form.product_form} onChange={(e) => set('product_form', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: '#e5e7eb' }}>
                {PRODUCT_FORMS.filter(f => f.value).map(f => (
                  <option key={f.value} value={f.value}>{es ? f.label_es : f.label_en}</option>
                ))}
              </select>
            </div>
            {field('Tamaño de Porción (g o ml)', 'Serving Size (g or ml)', 'serving_size_g', 'number', '0.1')}
            {field('Unidad de Medida', 'Serving Unit (scoop/tablet/ml/etc)', 'serving_unit')}
            {field('Descripción de Porción', 'Serving Description', 'serving_description')}
          </div>

          <div className="rounded-xl p-4" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
            <div className="text-xs font-semibold mb-3" style={{ color: '#374151' }}>
              {es ? 'Macronutrientes por 100g' : 'Macros per 100g'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {field('Calorías (kcal)', 'Calories', 'calories_per_100g', 'number', '0.1')}
              {field('Proteína (g)', 'Protein (g)', 'protein_per_100g', 'number', '0.1')}
              {field('Carbohidratos (g)', 'Carbs (g)', 'carbs_per_100g', 'number', '0.1')}
              {field('Grasas (g)', 'Fat (g)', 'fat_per_100g', 'number', '0.1')}
              {field('Fibra (g)', 'Fiber (g)', 'fiber_per_100g', 'number', '0.1')}
              {field('Azúcar (g)', 'Sugar (g)', 'sugar_per_100g', 'number', '0.1')}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
            <div className="text-xs font-semibold mb-3" style={{ color: '#374151' }}>
              {es ? 'Electrolitos y Minerales (mg por 100g)' : 'Electrolytes & Minerals (mg per 100g)'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {field('Sodio (mg)', 'Sodium', 'sodium_mg', 'number')}
              {field('Potasio (mg)', 'Potassium', 'potassium_mg', 'number')}
              {field('Magnesio (mg)', 'Magnesium', 'magnesium_mg', 'number')}
              {field('Calcio (mg)', 'Calcium', 'calcium_mg', 'number')}
              {field('Hierro (mg)', 'Iron', 'iron_mg', 'number', '0.1')}
              {field('Zinc (mg)', 'Zinc', 'zinc_mg', 'number', '0.1')}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
            <div className="text-xs font-semibold mb-3" style={{ color: '#374151' }}>
              {es ? 'Vitaminas (por 100g)' : 'Vitamins (per 100g)'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {field('Vitamina C (mg)', 'Vitamin C', 'vitamin_c_mg', 'number')}
              {field('Vitamina D (µg)', 'Vitamin D', 'vitamin_d_ug', 'number', '0.1')}
              {field('Vitamina B12 (µg)', 'Vitamin B12', 'vitamin_b12_ug', 'number', '0.1')}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
            <div className="text-xs font-semibold mb-3" style={{ color: '#374151' }}>
              {es ? 'Compuestos de Rendimiento (mg por porción)' : 'Performance Compounds (mg per serving)'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {field('Cafeína (mg)', 'Caffeine', 'caffeine_mg', 'number')}
              {field('Creatina (mg)', 'Creatine', 'creatine_mg', 'number')}
              {field('Beta-Alanina (mg)', 'Beta-Alanine', 'beta_alanine_mg', 'number')}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: '#374151' }}>
                {es ? 'Sabores (separados por coma)' : 'Flavors (comma-separated)'}
              </label>
              <input
                type="text"
                value={flavorsText}
                onChange={(e) => setFlavorsText(e.target.value)}
                placeholder={es ? 'Chocolate, Vainilla, Frutilla' : 'Chocolate, Vanilla, Strawberry'}
                className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: '#374151' }}>
                {es ? 'Nota de Electrolitos' : 'Electrolytes Note'}
              </label>
              <input type="text" value={form.electrolytes_note}
                onChange={(e) => set('electrolytes_note', e.target.value)}
                placeholder={es ? 'Na 300mg, K 150mg por porción' : 'Na 300mg, K 150mg per serving'}
                className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: '#e5e7eb' }} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: '#374151' }}>
                {es ? 'Certificación Anti-Doping' : 'Anti-Doping Certification'}
              </label>
              <input type="text" value={form.antidoping_note}
                onChange={(e) => set('antidoping_note', e.target.value)}
                placeholder="Informed Sport certified, NSF Certified for Sport, etc"
                className="w-full px-3 py-2 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: '#e5e7eb' }} />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_verified}
                  onChange={(e) => set('is_verified', e.target.checked)}
                  className="w-4 h-4 rounded" />
                <span className="text-sm" style={{ color: '#374151' }}>
                  {es ? 'Verificado' : 'Reviewed'}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t" style={{ borderColor: '#e5e7eb' }}>
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:bg-gray-50"
            style={{ borderColor: '#e5e7eb', color: '#374151' }}>
            {es ? 'Cancelar' : 'Cancel'}
          </button>
          <button onClick={handleSubmit} disabled={saving || !form.name_es.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            style={{ backgroundColor: '#514163', color: '#fdda36' }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {es ? 'Guardar' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SupplementsView({ onBack }: Props) {
  const { profile } = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';
  const isAdmin = profile?.role === 'admin';

  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState<Region>('');
  const [formFilter, setFormFilter] = useState<ProductForm>('');
  const [brandFilter, setBrandFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSupp, setEditingSupp] = useState<Supplement | null>(null);
  const [saving, setSaving] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadSupplements();
  }, []);

  const loadSupplements = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('foods_v2')
      .select('*')
      .eq('is_supplement', true)
      .order('brand')
      .order('name_es');
    setSupplements(data ?? []);
    setLoading(false);
  };

  const brands = useMemo(() => {
    const set = new Set<string>();
    supplements.forEach(s => { if (s.brand) set.add(s.brand); });
    return Array.from(set).sort();
  }, [supplements]);

  const filtered = supplements.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      s.name_es.toLowerCase().includes(q) ||
      s.name_en.toLowerCase().includes(q) ||
      s.brand.toLowerCase().includes(q);
    const matchRegion = !regionFilter || s.region === regionFilter;
    const matchForm = !formFilter || s.product_form === formFilter;
    const matchBrand = !brandFilter || s.brand === brandFilter;
    const matchCat = !categoryFilter || (() => {
      switch (categoryFilter) {
        case 'whey_protein': return s.product_form === 'powder' && s.protein_per_100g > 60 && s.name_en.toLowerCase().includes('whey') && !s.name_en.toLowerCase().includes('isolate');
        case 'isolate': return s.name_en.toLowerCase().includes('isolate') || s.name_en.toLowerCase().includes('iso');
        case 'plant_protein': return s.name_en.toLowerCase().includes('plant') || s.name_en.toLowerCase().includes('pea') || s.name_en.toLowerCase().includes('vegan') || s.name_en.toLowerCase().includes('soy');
        case 'gel': return s.product_form === 'gel';
        case 'sports_drink': return s.product_form === 'liquid';
        case 'drink_mix': return s.product_form === 'powder' && (s.sodium_mg > 100 || s.name_en.toLowerCase().includes('mix') || s.name_en.toLowerCase().includes('electrolyte'));
        case 'protein_bar': return s.product_form === 'bar';
        case 'creatine': return s.creatine_mg > 0 || s.name_en.toLowerCase().includes('creatine');
        case 'caffeine': return s.caffeine_mg > 100 && !['gel', 'bar', 'liquid', 'powder'].includes(s.product_form);
        case 'beta_alanine': return s.beta_alanine_mg > 0;
        case 'iron': return s.iron_mg > 10 && (s.product_form === 'tablet' || s.product_form === 'capsule' || s.product_form === 'liquid');
        case 'vitamin_c': return s.vitamin_c_mg > 500 && (s.product_form === 'tablet' || s.product_form === 'capsule');
        case 'vitamin_d': return s.vitamin_d_ug > 5;
        case 'vitamin_b12': return s.vitamin_b12_ug > 50;
        case 'multivitamin': return s.name_en.toLowerCase().includes('multi') || s.name_en.toLowerCase().includes('pak');
        default: return true;
      }
    })();
    return matchSearch && matchRegion && matchForm && matchBrand && matchCat;
  });

  const handleSave = async (data: Omit<Supplement, 'id'>) => {
    setSaving(true);
    const payload = { ...data, is_supplement: true };
    if (editingSupp) {
      await supabase.from('foods_v2').update(payload).eq('id', editingSupp.id);
    } else {
      await supabase.from('foods_v2').insert(payload);
    }
    await loadSupplements();
    setSaving(false);
    setShowForm(false);
    setEditingSupp(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(es ? '¿Eliminar este suplemento?' : 'Delete this supplement?')) return;
    await supabase.from('foods_v2').delete().eq('id', id);
    setSupplements((prev) => prev.filter((s) => s.id !== id));
  };

  const hasActiveFilters = !!(regionFilter || formFilter || categoryFilter || brandFilter);

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-5">

      <div className="flex items-center gap-3">
        <button onClick={onBack}
          className="p-2 rounded-xl border hover:bg-gray-50 transition-all"
          style={{ borderColor: '#e5e7eb' }}>
          <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#514163' }}>
            <Zap className="w-5 h-5" style={{ color: '#fdda36' }} />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold" style={{ color: '#1f2937' }}>
              {es ? 'Biblioteca de Suplementos' : 'Supplements Library'}
            </h1>
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              {es
                ? `${supplements.length} productos · ${brands.length} marcas`
                : `${supplements.length} products · ${brands.length} brands`}
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditingSupp(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: '#514163', color: '#fdda36' }}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{es ? 'Agregar' : 'Add'}</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} />
          <input
            type="text"
            placeholder={es ? 'Buscar por nombre o marca...' : 'Search by name or brand...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: '#e5e7eb', color: '#1f2937' }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all"
          style={{
            borderColor: hasActiveFilters ? '#514163' : '#e5e7eb',
            color: hasActiveFilters ? '#514163' : '#6b7280',
            backgroundColor: hasActiveFilters ? '#f5f0ff' : 'white',
          }}>
          <Filter className="w-4 h-4" />
          {es ? 'Filtros' : 'Filters'}
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#514163' }} />
          )}
        </button>
      </div>

      {showFilters && (
        <div className="rounded-2xl p-4 space-y-4" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#374151' }}>
                {es ? 'Categoría' : 'Category'}
              </label>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm" style={{ borderColor: '#e5e7eb' }}>
                {SUPPLEMENT_CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{es ? c.label_es : c.label_en}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#374151' }}>
                {es ? 'Marca' : 'Brand'}
              </label>
              <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm" style={{ borderColor: '#e5e7eb' }}>
                <option value="">{es ? 'Todas las Marcas' : 'All Brands'}</option>
                {brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#374151' }}>
                {es ? 'Región' : 'Region'}
              </label>
              <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value as Region)}
                className="w-full px-3 py-2 rounded-xl border text-sm" style={{ borderColor: '#e5e7eb' }}>
                {REGIONS.map(r => (
                  <option key={r.value} value={r.value}>{r.flag} {es ? r.label_es : r.label_en}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#374151' }}>
                {es ? 'Forma' : 'Form'}
              </label>
              <select value={formFilter} onChange={(e) => setFormFilter(e.target.value as ProductForm)}
                className="w-full px-3 py-2 rounded-xl border text-sm" style={{ borderColor: '#e5e7eb' }}>
                {PRODUCT_FORMS.map(f => (
                  <option key={f.value} value={f.value}>{es ? f.label_es : f.label_en}</option>
                ))}
              </select>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => { setRegionFilter(''); setFormFilter(''); setCategoryFilter(''); setBrandFilter(''); }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
              style={{ backgroundColor: '#fef2f2', color: '#b91c1c' }}>
              {es ? 'Limpiar filtros' : 'Clear filters'}
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {REGIONS.filter(r => r.value).map(r => {
          const count = supplements.filter(s => s.region === r.value).length;
          if (count === 0) return null;
          const cfg = REGION_CONFIG[r.value];
          return (
            <button key={r.value}
              onClick={() => setRegionFilter(regionFilter === r.value ? '' : r.value as Region)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: regionFilter === r.value ? cfg.bg : 'white',
                color: regionFilter === r.value ? cfg.color : '#6b7280',
                border: `1.5px solid ${regionFilter === r.value ? cfg.color : '#e5e7eb'}`,
              }}>
              {r.flag} {es ? r.label_es : r.label_en} <span style={{ opacity: 0.7 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#fdda36', borderTopColor: 'transparent' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ border: '2px dashed #e5e7eb', backgroundColor: '#fafafa' }}>
          <Zap className="w-10 h-10 mx-auto mb-3" style={{ color: '#d1d5db' }} />
          <p className="text-sm font-medium" style={{ color: '#6b7280' }}>
            {es ? 'No se encontraron suplementos' : 'No supplements found'}
          </p>
          <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
            {es ? 'Ajusta los filtros para ver más resultados' : 'Try adjusting filters'}
          </p>
        </div>
      ) : (
        <>
          <div className="text-xs" style={{ color: '#9ca3af' }}>
            {es
              ? `Mostrando ${filtered.length} de ${supplements.length} suplementos`
              : `Showing ${filtered.length} of ${supplements.length} supplements`}
          </div>
          <div className="space-y-3">
            {filtered.map((supp) => (
              <SupplementCard
                key={supp.id}
                supp={supp}
                isAdmin={isAdmin}
                onEdit={() => { setEditingSupp(supp); setShowForm(true); }}
                onDelete={() => handleDelete(supp.id)}
                es={es}
              />
            ))}
          </div>
        </>
      )}

      {showForm && (
        <SupplementForm
          initial={editingSupp ?? EMPTY_SUPPLEMENT}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingSupp(null); }}
          saving={saving}
          es={es}
        />
      )}
    </div>
  );
}
