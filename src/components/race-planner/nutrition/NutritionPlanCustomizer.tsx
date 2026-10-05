import { useEffect, useMemo, useState } from 'react';
import {
  Apple,
  Candy,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Droplets,
  Flame,
  MapPin,
  Package,
  Pencil,
  Pill,
  Plus,
  Route,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import type { NutritionCategory, NutritionProduct, RaceNutritionAssignment, RaceNutritionPlan } from '../../../types/nutrition';
import type { Competition } from '../../../types/race';
import { supabase } from '../../../lib/supabase';
import { usePreferences } from '../../../lib/preferences';
import ProductSelector from './ProductSelector';
import {
  createRaceNutritionAssignment,
  deleteRaceNutritionAssignment,
  getRaceNutritionAssignments,
  updateRaceNutritionAssignment,
} from '../../../lib/raceNutritionService';

type TimingMode = RaceNutritionAssignment['timing_mode'];

interface Props {
  competition: Competition;
  onChange: (plan: RaceNutritionPlan) => void;
}

interface Draft {
  product: NutritionProduct | null;
  timingMode: TimingMode;
  timingMinutes: string;
  distanceMarker: string;
  aidStationName: string;
  quantity: string;
  note: string;
}

const categoryLabels: Record<NutritionCategory, string> = {
  gel: 'Gels',
  drink: 'Liquids',
  gummy: 'Gummies',
  chew: 'Chews',
  capsule: 'Capsules / Pills',
  bar: 'Bars',
  real_food: 'Real Food',
  electrolyte_tablet: 'Electrolytes',
};

const categoryIcons: Record<NutritionCategory, typeof Flame> = {
  gel: Flame,
  drink: Droplets,
  gummy: Candy,
  chew: Candy,
  capsule: Pill,
  bar: Package,
  real_food: Apple,
  electrolyte_tablet: Droplets,
};

const categoryColors: Record<NutritionCategory, string> = {
  gel: '#f59e0b',
  drink: '#3b82f6',
  gummy: '#f97316',
  chew: '#fb923c',
  capsule: '#ec4899',
  bar: '#10b981',
  real_food: '#22c55e',
  electrolyte_tablet: '#14b8a6',
};

const emptyDraft: Draft = {
  product: null,
  timingMode: 'time',
  timingMinutes: '45',
  distanceMarker: '',
  aidStationName: '',
  quantity: '1',
  note: '',
};

function formatMinutes(minutes: number | null): string {
  if (minutes === null) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${String(mins).padStart(2, '0')}min` : `${minutes} min`;
}

function getMomentLabel(assignment: RaceNutritionAssignment, distanceUnit: string): string {
  if (assignment.timing_mode === 'time') return formatMinutes(assignment.timing_minutes);
  if (assignment.timing_mode === 'distance') return `${assignment.distance_marker} ${distanceUnit}`;
  return assignment.aid_station_name || 'Aid station';
}

function getSortValue(assignment: RaceNutritionAssignment): number {
  if (assignment.timing_mode === 'time') return assignment.timing_minutes ?? 0;
  if (assignment.timing_mode === 'distance') return (assignment.distance_marker ?? 0) * 100;
  return 100000 + new Date(assignment.created_at).getTime() / 100000000;
}

export default function NutritionPlanCustomizer({ competition, onChange }: Props) {
  const { theme, language } = usePreferences();
  const isDark = theme === 'dark';
  const isSpanish = language === 'es';
  const [collapsed, setCollapsed] = useState(false);
  const [products, setProducts] = useState<NutritionProduct[]>([]);
  const [assignments, setAssignments] = useState<RaceNutritionAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [message, setMessage] = useState<string | null>(null);

  const output = competition.strategyOutput;
  const targetCarbsGH = output?.carbs.recommendedIntakeGH ?? 60;
  const totalCarbsTarget = output?.carbs.totalCarbsG ?? Math.round(targetCarbsGH * (competition.raceData.expectedDurationMin / 60));
  const sodiumTarget = output?.hydration.totalSodiumMg ?? 0;

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase.from('nutrition_products').select('*').order('brand').order('product_name');
      if (error) console.error('[NutritionPlanCustomizer] products error:', error);
      if (active) {
        setProducts((data as NutritionProduct[]) ?? []);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    if (!competition.id) {
      setAssignments([]);
      return () => { active = false; };
    }
    getRaceNutritionAssignments(competition.id).then((items) => {
      if (active) setAssignments(items);
    });
    return () => { active = false; };
  }, [competition.id]);

  useEffect(() => {
    const totalCarbs = assignments.reduce((sum, item) => sum + item.product.carbs_g * item.quantity, 0);
    const totalSodium = assignments.reduce((sum, item) => sum + item.product.sodium_mg * item.quantity, 0);
    const totalCaffeine = assignments.reduce((sum, item) => sum + item.product.caffeine_mg * item.quantity, 0);
    onChange({
      primaryFuelType: 'gel',
      segmentFueling: {},
      totalCarbsG: totalCarbs,
      totalSodiumMg: totalSodium,
      totalCaffeineM: totalCaffeine,
      notes: assignments.map((item) => `${getMomentLabel(item, competition.raceData.distanceUnit)}: ${item.product.full_name}`).join(' · '),
      timeline: assignments,
    });
  }, [assignments, competition.raceData.distanceUnit, onChange]);

  const sortedAssignments = useMemo(
    () => [...assignments].sort((a, b) => getSortValue(a) - getSortValue(b)),
    [assignments],
  );

  const grouped = useMemo(() => {
    const groups = new Map<string, RaceNutritionAssignment[]>();
    sortedAssignments.forEach((item) => {
      const key = `${item.timing_mode}:${getMomentLabel(item, competition.raceData.distanceUnit)}`;
      groups.set(key, [...(groups.get(key) ?? []), item]);
    });
    return Array.from(groups.entries()).map(([key, items]) => ({ key, label: getMomentLabel(items[0], competition.raceData.distanceUnit), mode: items[0].timing_mode, items }));
  }, [sortedAssignments, competition.raceData.distanceUnit]);

  const startAdd = () => {
    setEditingId(null);
    setDraft({ ...emptyDraft, timingMinutes: sortedAssignments.length ? String((sortedAssignments[sortedAssignments.length - 1].timing_minutes ?? 0) + 30) : '45' });
    setMessage(null);
    setShowForm(true);
  };

  const startEdit = (item: RaceNutritionAssignment) => {
    setEditingId(item.id);
    setDraft({
      product: item.product,
      timingMode: item.timing_mode,
      timingMinutes: item.timing_minutes === null ? '' : String(item.timing_minutes),
      distanceMarker: item.distance_marker === null ? '' : String(item.distance_marker),
      aidStationName: item.aid_station_name ?? '',
      quantity: String(item.quantity),
      note: item.note,
    });
    setMessage(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setDraft(emptyDraft);
  };

  const saveAssignment = async () => {
    if (!draft.product) return;
    if (!competition.id) {
      setMessage(isSpanish ? 'Guarda primero el plan de carrera para añadir momentos.' : 'Save the race plan first to add timeline moments.');
      return;
    }
    const quantity = Number(draft.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) return;
    if (draft.timingMode === 'time' && (!draft.timingMinutes || Number(draft.timingMinutes) < 0)) return;
    if (draft.timingMode === 'distance' && (!draft.distanceMarker || Number(draft.distanceMarker) < 0)) return;
    if (draft.timingMode === 'aid_station' && !draft.aidStationName.trim()) return;

    setSaving(true);
    const input = {
      productId: draft.product.id,
      timingMode: draft.timingMode,
      timingMinutes: draft.timingMinutes ? Number(draft.timingMinutes) : null,
      distanceMarker: draft.distanceMarker ? Number(draft.distanceMarker) : null,
      aidStationName: draft.aidStationName,
      quantity,
      note: draft.note,
    };
    const saved = editingId
      ? await updateRaceNutritionAssignment(editingId, input)
      : await createRaceNutritionAssignment({ competitionId: competition.id, ...input });
    setSaving(false);
    if (!saved) {
      setMessage(isSpanish ? 'No se pudo guardar este momento.' : 'This timeline moment could not be saved.');
      return;
    }
    setAssignments((current) => editingId ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
    closeForm();
  };

  const removeAssignment = async (id: string) => {
    if (!(await deleteRaceNutritionAssignment(id))) return;
    setAssignments((current) => current.filter((item) => item.id !== id));
  };

  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '2px solid #e5e7eb';
  const textPrimary = isDark ? 'text-white' : 'text-[#1f2937]';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const innerBg = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb';
  const inputStyle = { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#fff', border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #d1d5db', color: isDark ? '#f3f4f6' : '#1f2937' };

  return (
    <div className="rounded-2xl print:hidden transition-colors" style={{ backgroundColor: cardBg, border: cardBorder, boxShadow: isDark ? 'none' : '0 2px 10px rgba(81,65,99,0.06)' }}>
      <button onClick={() => setCollapsed((value) => !value)} className={`w-full flex items-center justify-between px-6 py-4 ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-[#fafafa]'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"><Flame className="w-4 h-4 text-white" /></div>
          <span className={`font-body font-semibold ${textPrimary}`}>{isSpanish ? 'Plan de Nutrición' : 'Nutrition Plan'}</span>
          <span className={`font-body text-xs px-2 py-0.5 rounded-full ${textMuted}`} style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : '#f3f4f6' }}>{isSpanish ? 'línea de tiempo' : 'timeline planner'}</span>
        </div>
        {collapsed ? <ChevronDown className={`w-4 h-4 ${textMuted}`} /> : <ChevronUp className={`w-4 h-4 ${textMuted}`} />}
      </button>

      {!collapsed && (
        <div className="px-6 pb-6 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}><div className="text-xs text-yellow-500 font-semibold mb-1">{isSpanish ? 'Carbohidratos' : 'Carbs Target'}</div><div className={`text-xl font-bold ${textPrimary}`}>{totalCarbsTarget}<span className={`text-xs ml-1 ${textMuted}`}>g</span></div><div className={`text-xs ${textMuted}`}>{targetCarbsGH}g/h</div></div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}><div className="text-xs text-blue-400 font-semibold mb-1">{isSpanish ? 'Sodio objetivo' : 'Sodium Target'}</div><div className={`text-xl font-bold ${textPrimary}`}>{Math.round(sodiumTarget / 1000 * 10) / 10}<span className={`text-xs ml-1 ${textMuted}`}>g</span></div><div className={`text-xs ${textMuted}`}>{output?.hydration.sodiumMgH ?? 0}mg/h</div></div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}><div className="text-xs text-amber-400 font-semibold mb-1">{isSpanish ? 'Asignaciones' : 'Assignments'}</div><div className={`text-xl font-bold ${textPrimary}`}>{assignments.length}</div><div className={`text-xs ${textMuted}`}>{isSpanish ? 'momentos' : 'race moments'}</div></div>
          </div>

          {message && <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c' }}>{message}</div>}

          {showForm && (
            <div className="rounded-2xl p-4 space-y-4" style={{ backgroundColor: innerBg, border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb' }}>
              <div className="flex items-center justify-between"><h3 className={`font-body font-semibold ${textPrimary}`}>{editingId ? (isSpanish ? 'Editar asignación' : 'Edit assignment') : (isSpanish ? 'Añadir suplemento al timeline' : 'Add supplement to timeline')}</h3><button onClick={closeForm} className={textMuted}><X className="w-4 h-4" /></button></div>
              <ProductSelector products={products} selectedId={draft.product?.id} placeholder={loading ? 'Loading products...' : (isSpanish ? 'Buscar suplementos por nombre o marca...' : 'Search supplements by name or brand...')} onSelect={(product) => setDraft((current) => ({ ...current, product }))} />
              {draft.product && <div className="flex flex-wrap gap-3 text-xs" style={{ color: isDark ? '#d1d5db' : '#6b7280' }}><span>{draft.product.calories_per_serving} kcal</span><span>{draft.product.carbs_g}g carbs</span><span>{draft.product.sodium_mg}mg Na</span>{draft.product.caffeine_mg > 0 && <span className="text-amber-500">{draft.product.caffeine_mg}mg caffeine</span>}</div>}
              <div className="grid grid-cols-3 gap-2">
                {(['time', 'distance', 'aid_station'] as TimingMode[]).map((mode) => {
                  const Icon = mode === 'time' ? Clock3 : mode === 'distance' ? Route : MapPin;
                  const label = mode === 'time' ? (isSpanish ? 'Tiempo' : 'Time') : mode === 'distance' ? (isSpanish ? 'Kilómetro / milla' : 'Kilometer / mile') : (isSpanish ? 'Avituallamiento' : 'Aid station');
                  return <button key={mode} onClick={() => setDraft((current) => ({ ...current, timingMode: mode }))} className="flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold" style={{ backgroundColor: draft.timingMode === mode ? 'rgba(253,218,54,0.2)' : 'transparent', color: draft.timingMode === mode ? '#a16207' : (isDark ? '#9ca3af' : '#6b7280'), border: draft.timingMode === mode ? '1px solid #facc15' : '1px solid #d1d5db' }}><Icon className="w-3.5 h-3.5" />{label}</button>;
                })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {draft.timingMode === 'time' && <label className={`text-xs ${textSecondary}`}>{isSpanish ? 'Minutos desde la salida' : 'Minutes from start'}<input type="number" min="0" value={draft.timingMinutes} onChange={(e) => setDraft((current) => ({ ...current, timingMinutes: e.target.value }))} className="mt-1 w-full rounded-xl px-3 py-2 text-sm" style={inputStyle} /></label>}
                {draft.timingMode === 'distance' && <label className={`text-xs ${textSecondary}`}>{isSpanish ? `Marcador (${competition.raceData.distanceUnit})` : `Marker (${competition.raceData.distanceUnit})`}<input type="number" min="0" step="0.1" value={draft.distanceMarker} onChange={(e) => setDraft((current) => ({ ...current, distanceMarker: e.target.value }))} className="mt-1 w-full rounded-xl px-3 py-2 text-sm" style={inputStyle} /></label>}
                {draft.timingMode === 'aid_station' && <label className={`text-xs ${textSecondary}`}>{isSpanish ? 'Nombre del punto' : 'Checkpoint name'}<input value={draft.aidStationName} onChange={(e) => setDraft((current) => ({ ...current, aidStationName: e.target.value }))} placeholder={isSpanish ? 'Avituallamiento 1' : 'Aid station 1'} className="mt-1 w-full rounded-xl px-3 py-2 text-sm" style={inputStyle} /></label>}
                <label className={`text-xs ${textSecondary}`}>{isSpanish ? 'Cantidad' : 'Quantity'}<input type="number" min="0.25" step="0.25" value={draft.quantity} onChange={(e) => setDraft((current) => ({ ...current, quantity: e.target.value }))} className="mt-1 w-full rounded-xl px-3 py-2 text-sm" style={inputStyle} /></label>
              </div>
              <label className={`block text-xs ${textSecondary}`}>{isSpanish ? 'Nota personalizada' : 'Personalized note'}<input value={draft.note} onChange={(e) => setDraft((current) => ({ ...current, note: e.target.value }))} placeholder={isSpanish ? 'Tomar con agua' : 'Take with water'} className="mt-1 w-full rounded-xl px-3 py-2 text-sm" style={inputStyle} /></label>
              <div className="flex justify-end gap-2"><button onClick={closeForm} className="px-4 py-2 rounded-xl text-sm" style={{ color: isDark ? '#d1d5db' : '#6b7280' }}>{isSpanish ? 'Cancelar' : 'Cancel'}</button><button onClick={saveAssignment} disabled={saving || !draft.product} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 text-[#514163] text-sm font-bold disabled:opacity-50"><Check className="w-4 h-4" />{saving ? (isSpanish ? 'Guardando...' : 'Saving...') : (isSpanish ? 'Guardar momento' : 'Save moment')}</button></div>
            </div>
          )}

          <div className="flex items-center justify-between"><div><h3 className={`font-body font-semibold ${textPrimary}`}>{isSpanish ? 'Timeline de suplementos' : 'Supplement timeline'}</h3><p className={`text-xs mt-1 ${textMuted}`}>{isSpanish ? 'Combina productos y repítelos en los momentos que necesites.' : 'Mix products and repeat them at any moments you need.'}</p></div><button onClick={startAdd} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#514163] text-white text-xs font-bold hover:opacity-90"><Plus className="w-4 h-4" />{isSpanish ? 'Añadir' : 'Add supplement'}</button></div>

          {assignments.length === 0 ? (
            <div className="rounded-2xl py-10 text-center" style={{ backgroundColor: innerBg, border: isDark ? '1px dashed rgba(255,255,255,0.15)' : '1px dashed #d1d5db' }}><Droplets className={`w-8 h-8 mx-auto mb-2 ${textMuted}`} /><p className={`text-sm ${textSecondary}`}>{isSpanish ? 'Aún no hay suplementos asignados' : 'No supplements assigned yet'}</p><p className={`text-xs mt-1 ${textMuted}`}>{isSpanish ? 'Añade un gel, bebida, cápsula o comida a cualquier momento.' : 'Add a gel, drink, capsule, or food to any race moment.'}</p></div>
          ) : (
            <div className="relative pl-7 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-yellow-300">
              {groups.map((group) => {
                const GroupIcon = group.mode === 'time' ? Clock3 : group.mode === 'distance' ? Route : MapPin;
                return <div key={group.key} className="relative"><div className="absolute -left-7 top-2 w-5 h-5 rounded-full bg-yellow-400 border-4 border-white dark:border-[#1e1a2e] flex items-center justify-center"><GroupIcon className="w-2.5 h-2.5 text-[#514163]" /></div><div className="rounded-2xl p-4" style={{ backgroundColor: innerBg, border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb' }}><div className={`font-body font-bold text-sm mb-3 ${textPrimary}`}>{group.label}</div><div className="space-y-2">{group.items.map((item) => { const category = item.product.category as NutritionCategory; const Icon = categoryIcons[category]; const color = categoryColors[category]; return <div key={item.id} className="flex items-start gap-3 rounded-xl p-3" style={{ backgroundColor: cardBg, border: `1px solid ${color}55` }}><div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18`, color }}><Icon className="w-4 h-4" /></div><div className="min-w-0 flex-1"><div className={`font-body font-semibold text-sm ${textPrimary}`}>{item.quantity} × {item.product.full_name}</div><div className={`text-xs mt-0.5 ${textSecondary}`}>{categoryLabels[category]} · {item.product.calories_per_serving} kcal · {item.product.carbs_g * item.quantity}g carbs · {item.product.sodium_mg * item.quantity}mg Na{item.product.caffeine_mg > 0 && ` · ${item.product.caffeine_mg * item.quantity}mg caffeine`}</div>{item.note && <div className={`text-xs mt-1 italic ${textMuted}`}>{item.note}</div>}</div><div className="flex gap-1"><button onClick={() => startEdit(item)} className={`p-1.5 rounded-lg ${textMuted}`} title={isSpanish ? 'Editar' : 'Edit'}><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => removeAssignment(item.id)} className="p-1.5 rounded-lg text-red-400" title={isSpanish ? 'Eliminar' : 'Delete'}><Trash2 className="w-3.5 h-3.5" /></button></div></div>; })}</div></div></div>;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
