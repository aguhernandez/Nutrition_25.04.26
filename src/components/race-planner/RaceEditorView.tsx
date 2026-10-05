import { useState, useEffect, useCallback } from 'react';
import {
  MapPin, Plus, Pencil, Trash2, Check, X, Save, Loader2, Search,
  Mountain, Droplets, History, ChevronDown, ChevronRight, AlertCircle, CheckCircle, Upload,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';
import { supabase } from '../../lib/supabase';
import {
  fetchAllRaces, createRace, updateRace, deleteRace,
  fetchElevationData, saveElevationData,
  fetchAidStations, upsertAidStation, deleteAidStation,
  fetchChangeHistory, logChange,
  type AidStationRow, type ChangeHistoryRow,
} from '../../lib/raceEditorService';
import { generateElevationProfile } from '../../utils/elevationGenerator';
import type { RaceCatalogEntry, ElevationPoint, Sport } from '../../types/race';
import ElevationProfile from './course/ElevationProfile';
import ElevationProfileEditor from './course/ElevationProfileEditor';

type Tab = 'details' | 'elevation' | 'aids' | 'history';

const SPORTS: { value: Sport; label: string }[] = [
  { value: 'running', label: 'Running' },
  { value: 'trail_running', label: 'Trail Running' },
  { value: 'cycling_road', label: 'Cycling Road' },
  { value: 'cycling_gravel', label: 'Cycling Gravel' },
  { value: 'cycling_mtb', label: 'Cycling MTB' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'triathlon', label: 'Triathlon' },
  { value: 'hyrox', label: 'Hyrox' },
];

const SUPPLY_TYPES = ['water', 'food', 'energy_gel', 'electrolyte', 'medical', 'drop_bags'];
const SERVICE_TYPES = ['medical_assistance', 'drop_bags', 'restroom', 'crew_access', 'parking', 'timing'];

export default function RaceEditorView() {
  const { profile } = useAuth();
  const { theme, language } = usePreferences();
  const isDark = theme === 'dark';

  const [races, setRaces] = useState<RaceCatalogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('details');
  const [creatingNew, setCreatingNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const editorEmail = profile?.email ?? 'unknown';
  const editorRole = profile?.role ?? 'athlete';

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const loadRaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllRaces();
      setRaces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load races');
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadRaces(); }, [loadRaces]);

  const filtered = races.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.country.toLowerCase().includes(search.toLowerCase()));
  const selected = races.find((r) => r.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setTab('details');
    setCreatingNew(false);
  };

  const handleNew = () => {
    setCreatingNew(true);
    setSelectedId(null);
    setTab('details');
  };

  const handleCreated = (race: RaceCatalogEntry) => {
    setRaces((prev) => [...prev, race].sort((a, b) => a.name.localeCompare(b.name)));
    setSelectedId(race.id);
    setCreatingNew(false);
    showToast(language === 'es' ? 'Carrera creada' : 'Race created');
  };

  const handleUpdated = (id: string, input: Partial<RaceCatalogEntry>) => {
    setRaces((prev) => prev.map((r) => r.id === id ? { ...r, ...input } : r));
  };

  const handleDeleted = (id: string) => {
    setRaces((prev) => prev.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(null);
    showToast(language === 'es' ? 'Carrera eliminada' : 'Race deleted');
  };

  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.12)' : '#d1d5db';
  const inputText = isDark ? '#f3f4f6' : '#1f2937';
  const labelColor = isDark ? '#9ca3af' : '#6b7280';
  const sidebarBg = isDark ? 'rgba(255,255,255,0.02)' : '#f9fafb';
  const activeItemBg = isDark ? 'rgba(96,165,250,0.15)' : 'rgba(96,165,250,0.1)';
  const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6';

  return (
    <div className="min-h-screen p-4 lg:p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${textPrimary} flex items-center gap-3`}>
          <MapPin className="w-7 h-7 text-blue-500" />
          {language === 'es' ? 'Editor de Carreras' : 'Race Editor'}
        </h1>
        <p className={`text-sm mt-1 ${textMuted}`}>
          {language === 'es' ? 'Administra carreras, perfiles de elevación y estaciones de asistencia' : 'Manage races, elevation profiles and aid stations'}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl p-3 flex items-center gap-2 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {toast && (
        <div className="mb-4 rounded-xl p-3 flex items-center gap-2 text-sm" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        {/* Race list sidebar */}
        <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: cardBorder }}>
          <div className="p-3 space-y-2" style={{ borderBottom: cardBorder }}>
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
              <input
                type="text"
                placeholder={language === 'es' ? 'Buscar carrera...' : 'Search race...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }}
              />
            </div>
            <button
              onClick={handleNew}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
            >
              <Plus className="w-4 h-4" /> {language === 'es' ? 'Nueva Carrera' : 'New Race'}
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto" style={{ background: sidebarBg }}>
            {loading ? (
              <div className="flex justify-center p-6"><Loader2 className="w-5 h-5 animate-spin text-blue-500" /></div>
            ) : filtered.length === 0 ? (
              <div className={`p-4 text-center text-sm ${textMuted}`}>{language === 'es' ? 'Sin resultados' : 'No results'}</div>
            ) : (
              filtered.map((race) => (
                <button
                  key={race.id}
                  onClick={() => handleSelect(race.id)}
                  className="w-full text-left px-3 py-2.5 transition-colors border-b"
                  style={{
                    background: selectedId === race.id ? activeItemBg : 'transparent',
                    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6'}`,
                  }}
                  onMouseEnter={(e) => { if (selectedId !== race.id) e.currentTarget.style.background = hoverBg; }}
                  onMouseLeave={(e) => { if (selectedId !== race.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className={`text-sm font-medium truncate ${textPrimary}`}>{race.name}</div>
                  <div className={`text-xs ${textMuted}`}>{race.city}, {race.country} · {race.distance_km}km</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Editor panel */}
        <div>
          {creatingNew ? (
            <RaceDetailsEditor
              isNew
              race={null}
              isDark={isDark}
              language={language}
              editorEmail={editorEmail}
              editorRole={editorRole}
              onSaved={(race) => handleCreated(race)}
              onCancel={() => setCreatingNew(false)}
              themeVars={{ cardBg, cardBorder, inputBg, inputBorder, inputText, labelColor, textPrimary, textMuted, textSecondary }}
            />
          ) : selected ? (
            <RaceEditorPanel
              key={selected.id}
              race={selected}
              isDark={isDark}
              language={language}
              editorEmail={editorEmail}
              editorRole={editorRole}
              tab={tab}
              onTabChange={setTab}
              onUpdated={(input) => handleUpdated(selected.id, input)}
              onDeleted={() => handleDeleted(selected.id)}
              themeVars={{ cardBg, cardBorder, inputBg, inputBorder, inputText, labelColor, textPrimary, textMuted, textSecondary }}
            />
          ) : (
            <div className="rounded-2xl p-12 text-center" style={{ background: cardBg, border: cardBorder }}>
              <MapPin className={`w-12 h-12 mx-auto mb-3 ${textMuted}`} />
              <p className={`text-sm ${textMuted}`}>
                {language === 'es' ? 'Selecciona una carrera para editar o crea una nueva' : 'Select a race to edit or create a new one'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Theme vars type ───
interface ThemeVars {
  cardBg: string; cardBorder: string; inputBg: string; inputBorder: string; inputText: string;
  labelColor: string; textPrimary: string; textMuted: string; textSecondary: string;
}

// ─── Tab navigation ───
function TabBar({ tab, onChange, language, isDark }: { tab: Tab; onChange: (t: Tab) => void; language: string; isDark: boolean }) {
  const tabs: { id: Tab; label_es: string; label_en: string; icon: React.ElementType }[] = [
    { id: 'details', label_es: 'Detalles', label_en: 'Details', icon: Pencil },
    { id: 'elevation', label_es: 'Elevación', label_en: 'Elevation', icon: Mountain },
    { id: 'aids', label_es: 'Estaciones', label_en: 'Aid Stations', icon: Droplets },
    { id: 'history', label_es: 'Historial', label_en: 'Change History', icon: History },
  ];
  const tabBarBg = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6';
  return (
    <div className="flex gap-1 rounded-xl p-1 w-fit flex-wrap" style={{ background: tabBarBg }}>
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Icon className="w-3.5 h-3.5" /> {language === 'es' ? t.label_es : t.label_en}
          </button>
        );
      })}
    </div>
  );
}

// ─── Race Editor Panel (wraps tabs) ───
interface PanelProps {
  race: RaceCatalogEntry;
  isDark: boolean;
  language: string;
  editorEmail: string;
  editorRole: string;
  tab: Tab;
  onTabChange: (t: Tab) => void;
  onUpdated: (input: Partial<RaceCatalogEntry>) => void;
  onDeleted: () => void;
  themeVars: ThemeVars;
}

function RaceEditorPanel({ race, isDark, language, editorEmail, editorRole, tab, onTabChange, onUpdated, onDeleted, themeVars }: PanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className={`text-lg font-bold ${themeVars.textPrimary}`}>{race.name}</h2>
          <p className={`text-xs ${themeVars.textMuted}`}>{race.city}, {race.country} · {race.distance_km}km · +{race.elevation_gain_m}m</p>
        </div>
        <TabBar tab={tab} onChange={onTabChange} language={language} isDark={isDark} />
      </div>

      {tab === 'details' && (
        <RaceDetailsEditor
          isNew={false}
          race={race}
          isDark={isDark}
          language={language}
          editorEmail={editorEmail}
          editorRole={editorRole}
          onSaved={(updated) => onUpdated(updated)}
          onCancel={() => onTabChange('elevation')}
          onDeleted={onDeleted}
          themeVars={themeVars}
        />
      )}
      {tab === 'elevation' && (
        <ElevationEditorTab race={race} isDark={isDark} language={language} editorEmail={editorEmail} editorRole={editorRole} themeVars={themeVars} />
      )}
      {tab === 'aids' && (
        <AidStationManager race={race} isDark={isDark} language={language} editorEmail={editorEmail} editorRole={editorRole} themeVars={themeVars} />
      )}
      {tab === 'history' && (
        <ChangeHistoryTab raceId={race.id} isDark={isDark} language={language} themeVars={themeVars} />
      )}
    </div>
  );
}

// ─── Race Details Editor (create/edit form) ───
interface DetailsProps {
  isNew: boolean;
  race: RaceCatalogEntry | null;
  isDark: boolean;
  language: string;
  editorEmail: string;
  editorRole: string;
  onSaved: (race: RaceCatalogEntry) => void;
  onCancel: () => void;
  onDeleted?: () => void;
  themeVars: ThemeVars;
}

function RaceDetailsEditor({ isNew, race, isDark, language, editorEmail, editorRole, onSaved, onCancel, onDeleted, themeVars }: DetailsProps) {
  const [form, setForm] = useState({
    name: race?.name ?? '',
    sport: race?.sport ?? 'running',
    country: race?.country ?? '',
    city: race?.city ?? '',
    distance_km: race?.distance_km ?? 0,
    elevation_gain_m: race?.elevation_gain_m ?? 0,
    typical_month: race?.typical_month ?? 1,
    typical_day: race?.typical_day ?? 1,
    avg_temperature_c: race?.avg_temperature_c ?? 20,
    avg_humidity_pct: race?.avg_humidity_pct ?? 60,
    altitude_m: race?.altitude_m ?? 0,
    description: race?.description ?? '',
    is_verified: race?.is_verified ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = (field: string, value: string | number | boolean) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        const created = await createRace(form);
        await logChange(created.id, editorEmail, editorRole, { change_type: 'create', summary: `Created race "${created.name}"` });
        onSaved(created);
      } else if (race) {
        const changes: string[] = [];
        const fields: (keyof RaceCatalogEntry)[] = ['name', 'sport', 'country', 'city', 'distance_km', 'elevation_gain_m', 'typical_month', 'typical_day', 'avg_temperature_c', 'avg_humidity_pct', 'altitude_m', 'description'];
        for (const field of fields) {
          if (race[field] !== form[field as string]) {
            changes.push(`${field}: ${String(race[field])} → ${String(form[field as string])}`);
          }
        }
        await updateRace(race.id, form);
        if (changes.length > 0) {
          await logChange(race.id, editorEmail, editorRole, { change_type: 'update', summary: changes.join('; ').slice(0, 500) });
        }
        onSaved({ ...race, ...form } as RaceCatalogEntry);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!race || !onDeleted) return;
    setDeleting(true);
    try {
      await logChange(race.id, editorEmail, editorRole, { change_type: 'delete', summary: `Deleted race "${race.name}"` });
      await deleteRace(race.id);
      onDeleted();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
    setDeleting(false);
  };

  const inputCls = 'w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors';
  const { cardBg, cardBorder, inputBg, inputBorder, inputText, labelColor, textPrimary, textMuted } = themeVars;

  return (
    <div className="rounded-2xl p-5 space-y-4" style={{ background: cardBg, border: cardBorder }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name" language={language} label_es="Nombre" labelColor={labelColor}>
          <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        </Field>
        <Field label="Sport" language={language} label_es="Deporte" labelColor={labelColor}>
          <select value={form.sport} onChange={(e) => set('sport', e.target.value)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }}>
            {SPORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Country" language={language} label_es="País" labelColor={labelColor}>
          <input type="text" value={form.country} onChange={(e) => set('country', e.target.value)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        </Field>
        <Field label="City" language={language} label_es="Ciudad" labelColor={labelColor}>
          <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        </Field>
        <Field label="Distance (km)" language={language} label_es="Distancia (km)" labelColor={labelColor}>
          <input type="number" step="0.1" value={form.distance_km} onChange={(e) => set('distance_km', parseFloat(e.target.value) || 0)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        </Field>
        <Field label="Elevation Gain (m)" language={language} label_es="Desnivel (m)" labelColor={labelColor}>
          <input type="number" value={form.elevation_gain_m} onChange={(e) => set('elevation_gain_m', parseInt(e.target.value) || 0)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        </Field>
        <Field label="Altitude (m)" language={language} label_es="Altitud (m)" labelColor={labelColor}>
          <input type="number" value={form.altitude_m} onChange={(e) => set('altitude_m', parseInt(e.target.value) || 0)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        </Field>
        <Field label="Avg Temperature (°C)" language={language} label_es="Temp. Media (°C)" labelColor={labelColor}>
          <input type="number" value={form.avg_temperature_c} onChange={(e) => set('avg_temperature_c', parseInt(e.target.value) || 0)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        </Field>
        <Field label="Avg Humidity (%)" language={language} label_es="Humedad Media (%)" labelColor={labelColor}>
          <input type="number" value={form.avg_humidity_pct} onChange={(e) => set('avg_humidity_pct', parseInt(e.target.value) || 0)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        </Field>
        <div className="flex gap-2">
          <Field label="Month" language={language} label_es="Mes" labelColor={labelColor}>
            <input type="number" min={1} max={12} value={form.typical_month} onChange={(e) => set('typical_month', parseInt(e.target.value) || 1)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
          </Field>
          <Field label="Day" language={language} label_es="Día" labelColor={labelColor}>
            <input type="number" min={1} max={31} value={form.typical_day} onChange={(e) => set('typical_day', parseInt(e.target.value) || 1)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
          </Field>
        </div>
      </div>

      <Field label="Description" language={language} label_es="Descripción" labelColor={labelColor}>
        <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
      </Field>

      <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
        <input type="checkbox" checked={form.is_verified} onChange={(e) => set('is_verified', e.target.checked)} className="w-4 h-4 accent-blue-500 rounded" />
        {language === 'es' ? 'Carrera verificada' : 'Verified race'}
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {language === 'es' ? 'Guardar' : 'Save'}
        </button>
        <button onClick={onCancel} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`}>
          {language === 'es' ? 'Cancelar' : 'Cancel'}
        </button>
        {!isNew && onDeleted && (
          <div className="ml-auto">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className={`text-xs ${textMuted}`}>{language === 'es' ? '¿Confirmar?' : 'Confirm?'}</span>
                <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50">
                  {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} {language === 'es' ? 'Sí, eliminar' : 'Yes, delete'}
                </button>
                <button onClick={() => setConfirmDelete(false)} className={`px-3 py-1.5 rounded-lg text-xs ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> {language === 'es' ? 'Eliminar' : 'Delete'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, label_es, language, labelColor, children }: { label: string; label_es: string; language: string; labelColor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: labelColor }}>{language === 'es' ? label_es : label}</label>
      {children}
    </div>
  );
}

// ─── Elevation Editor Tab ───
function ElevationEditorTab({ race, isDark, language, editorEmail, editorRole, themeVars }: { race: RaceCatalogEntry; isDark: boolean; language: string; editorEmail: string; editorRole: string; themeVars: ThemeVars }) {
  const [points, setPoints] = useState<ElevationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [source, setSource] = useState('manual');

  const distanceKm = Number(race.distance_km);
  const elevGain = Number(race.elevation_gain_m);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchElevationData(race.id);
        if (cancelled) return;
        if (data.length > 0) {
          setPoints(data);
        } else {
          const seed = race.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
          setPoints(generateElevationProfile(distanceKm, elevGain, seed));
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [race.id, race.name, distanceKm, elevGain]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveElevationData(race.id, points, source, editorEmail);
      await logChange(race.id, editorEmail, editorRole, { change_type: 'elevation_import', summary: `Updated elevation profile (${points.length} points, source: ${source})` });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed');
    }
    setSaving(false);
  };

  const maxElev = points.length > 0 ? Math.max(...points.map((p) => p.elevationM)) : 0;
  const minElev = points.length > 0 ? Math.min(...points.map((p) => p.elevationM)) : 0;

  if (loading) {
    return <div className="rounded-2xl p-8 flex justify-center" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="rounded-2xl p-5 space-y-4" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: language === 'es' ? 'Puntos' : 'Points', value: points.length },
          { label: language === 'es' ? 'Elev. Máx' : 'Max Elev', value: `${maxElev}m` },
          { label: language === 'es' ? 'Rango' : 'Range', value: `${maxElev - minElev}m` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6' }}>
            <div className={`text-xs mb-1 ${themeVars.textMuted}`}>{stat.label}</div>
            <div className={`text-lg font-bold ${themeVars.textPrimary}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <ElevationProfileEditor points={points} distanceKm={distanceKm} onChange={(p) => { setPoints(p); setSource('manual'); }} />

      {points.length > 1 && (
        <div className="rounded-xl p-3" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb' }}>
          <div className={`text-xs mb-2 ${themeVars.textMuted}`}>{language === 'es' ? 'Vista previa' : 'Preview'}</div>
          <ElevationProfile elevationPoints={points} hydrationStations={[]} distanceKm={distanceKm} totalElevationGainM={elevGain} />
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? (language === 'es' ? 'Guardado' : 'Saved') : language === 'es' ? 'Guardar Elevación' : 'Save Elevation'}
        </button>
        <span className={`text-xs ${themeVars.textMuted}`}>
          {language === 'es' ? 'Los datos se guardan como perfil público para esta carrera' : 'Data is saved as the public profile for this race'}
        </span>
      </div>
    </div>
  );
}

// ─── Aid Station Manager ───
function AidStationManager({ race, isDark, language, editorEmail, editorRole, themeVars }: { race: RaceCatalogEntry; isDark: boolean; language: string; editorEmail: string; editorRole: string; themeVars: ThemeVars }) {
  const [stations, setStations] = useState<AidStationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [elevationPoints, setElevationPoints] = useState<ElevationPoint[]>([]);

  const distanceKm = Number(race.distance_km);
  const elevGain = Number(race.elevation_gain_m);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [aidData, elevData] = await Promise.all([fetchAidStations(race.id), fetchElevationData(race.id)]);
      setStations(aidData);
      if (elevData.length > 0) {
        setElevationPoints(elevData);
      } else {
        const seed = race.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        setElevationPoints(generateElevationProfile(distanceKm, elevGain, seed));
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [race.id, race.name, distanceKm, elevGain]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (row: Partial<AidStationRow> & { race_catalog_id: string }) => {
    try {
      const saved = await upsertAidStation(row);
      await logChange(race.id, editorEmail, editorRole, { change_type: row.id ? 'aid_update' : 'aid_add', summary: `${row.id ? 'Updated' : 'Added'} aid station "${row.name}" at ${row.distance_km}km` });
      setStations((prev) => {
        const exists = prev.some((s) => s.id === saved.id);
        return exists ? prev.map((s) => s.id === saved.id ? saved : s) : [...prev, saved].sort((a, b) => a.sort_order - b.sort_order);
      });
      setEditingId(null);
      setAddingNew(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteAidStation(id);
      await logChange(race.id, editorEmail, editorRole, { change_type: 'aid_delete', summary: `Deleted aid station "${name}"` });
      setStations((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  if (loading) {
    return <div className="rounded-2xl p-8 flex justify-center" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>;
  }

  const sorted = [...stations].sort((a, b) => a.sort_order - b.sort_order);
  const hydrationStations = sorted.map((s) => ({ id: s.id, km: Number(s.distance_km), label: s.name, hasFood: (s.supply_types ?? []).includes('food'), altitudeM: Number(s.altitude_m) }));

  return (
    <div className="space-y-4">
      {elevationPoints.length > 1 && (
        <div className="rounded-2xl p-4" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}>
          <ElevationProfile elevationPoints={elevationPoints} hydrationStations={hydrationStations} distanceKm={distanceKm} totalElevationGainM={elevGain} />
        </div>
      )}

      <div className="rounded-2xl p-5 space-y-3" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}>
        <div className="flex items-center justify-between">
          <span className={`text-xs uppercase tracking-wider font-semibold ${themeVars.textMuted}`}>{sorted.length} {language === 'es' ? 'estaciones' : 'stations'}</span>
          <button
            onClick={() => { setAddingNew(true); setEditingId(null); }}
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> {language === 'es' ? 'Añadir estación' : 'Add station'}
          </button>
        </div>

        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {sorted.map((station) => (
            <AidStationRowEditor
              key={station.id}
              station={station}
              distanceKm={distanceKm}
              isDark={isDark}
              language={language}
              editing={editingId === station.id}
              onEdit={() => setEditingId(station.id)}
              onCancel={() => setEditingId(null)}
              onSave={(row) => handleSave({ ...row, id: station.id, race_catalog_id: race.id })}
              onDelete={() => handleDelete(station.id, station.name)}
              themeVars={themeVars}
            />
          ))}
        </div>

        {addingNew && (
          <AidStationRowEditor
            station={null}
            distanceKm={distanceKm}
            isDark={isDark}
            language={language}
            editing
            onEdit={() => {}}
            onCancel={() => setAddingNew(false)}
            onSave={(row) => handleSave({ ...row, race_catalog_id: race.id })}
            onDelete={() => {}}
            themeVars={themeVars}
          />
        )}
      </div>
    </div>
  );
}

function AidStationRowEditor({ station, distanceKm, isDark, language, editing, onEdit, onCancel, onSave, onDelete, themeVars }: {
  station: AidStationRow | null;
  distanceKm: number;
  isDark: boolean;
  language: string;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (row: Partial<AidStationRow>) => void;
  onDelete: () => void;
  themeVars: ThemeVars;
}) {
  const [form, setForm] = useState({
    name: station?.name ?? '',
    distance_km: station?.distance_km ?? 0,
    altitude_m: station?.altitude_m ?? 0,
    supply_types: station?.supply_types ?? [],
    services: station?.services ?? [],
    sort_order: station?.sort_order ?? 0,
  });

  const set = (field: string, value: string | number | string[]) => setForm((f) => ({ ...f, [field]: value }));
  const toggleArray = (field: 'supply_types' | 'services', value: string) => setForm((f) => ({ ...f, [field]: f[field].includes(value) ? f[field].filter((v) => v !== value) : [...f[field], value] }));

  const inputCls = 'w-full rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50';
  const { inputBg, inputBorder, inputText, labelColor, textPrimary, textMuted } = themeVars;

  if (!editing) {
    return (
      <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 group" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}` }}>
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate" style={{ color: isDark ? '#f3f4f6' : '#1f2937' }}>{station!.name}</div>
          <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
            <span>{Number(station!.distance_km)} km</span>
            <span>{Number(station!.altitude_m)} m</span>
            {(station!.supply_types ?? []).length > 0 && <span className="text-cyan-400">{station!.supply_types.join(', ')}</span>}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 rounded-lg text-cyan-400 hover:bg-white/10"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-3 space-y-3" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff', border: '1px solid rgba(34,211,238,0.4)' }}>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 w-28">
          <label className="text-xs" style={{ color: labelColor }}>{language === 'es' ? 'Distancia (km)' : 'Distance (km)'}</label>
          <input type="number" min={0} max={distanceKm} step={0.1} value={form.distance_km} onChange={(e) => set('distance_km', parseFloat(e.target.value) || 0)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs" style={{ color: labelColor }}>{language === 'es' ? 'Nombre' : 'Name'}</label>
          <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        </div>
        <div className="flex flex-col gap-1 w-24">
          <label className="text-xs" style={{ color: labelColor }}>{language === 'es' ? 'Altitud (m)' : 'Altitude (m)'}</label>
          <input type="number" value={form.altitude_m} onChange={(e) => set('altitude_m', parseInt(e.target.value) || 0)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        </div>
      </div>

      <div>
        <label className="text-xs mb-1 block" style={{ color: labelColor }}>{language === 'es' ? 'Tipo de Suministro' : 'Supply Types'}</label>
        <div className="flex gap-2 flex-wrap">
          {SUPPLY_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => toggleArray('supply_types', t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${form.supply_types.includes(t) ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : isDark ? 'bg-white/5 text-gray-500 border border-white/10' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}
            >
              {t.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs mb-1 block" style={{ color: labelColor }}>{language === 'es' ? 'Servicios' : 'Services'}</label>
        <div className="flex gap-2 flex-wrap">
          {SERVICE_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => toggleArray('services', t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${form.services.includes(t) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : isDark ? 'bg-white/5 text-gray-500 border border-white/10' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}
            >
              {t.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 w-24">
          <label className="text-xs" style={{ color: labelColor }}>{language === 'es' ? 'Orden' : 'Sort Order'}</label>
          <input type="number" value={form.sort_order} onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)} className={inputCls} style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => onSave(form)} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"><Check className="w-3.5 h-3.5" /> {language === 'es' ? 'Guardar' : 'Save'}</button>
          <button onClick={onCancel} className="flex items-center gap-1 text-xs transition-colors" style={{ color: textMuted }}><X className="w-3.5 h-3.5" /> {language === 'es' ? 'Cancelar' : 'Cancel'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Change History Tab ───
function ChangeHistoryTab({ raceId, isDark, language, themeVars }: { raceId: string; isDark: boolean; language: string; themeVars: ThemeVars }) {
  const [history, setHistory] = useState<ChangeHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchChangeHistory(raceId);
        if (cancelled) return;
        setHistory(data);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [raceId]);

  if (loading) {
    return <div className="rounded-2xl p-8 flex justify-center" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>;
  }

  if (history.length === 0) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}>
        <History className={`w-10 h-10 mx-auto mb-3 ${themeVars.textMuted}`} />
        <p className={`text-sm ${themeVars.textMuted}`}>{language === 'es' ? 'Sin cambios registrados' : 'No changes recorded'}</p>
      </div>
    );
  }

  const typeColor: Record<string, string> = {
    create: 'text-emerald-400',
    update: 'text-blue-400',
    delete: 'text-red-400',
    elevation_import: 'text-amber-400',
    aid_add: 'text-cyan-400',
    aid_update: 'text-cyan-400',
    aid_delete: 'text-red-400',
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: themeVars.cardBg, border: themeVars.cardBorder }}>
      <div className="max-h-[60vh] overflow-y-auto">
        {history.map((entry) => (
          <div key={entry.id} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'}` }}>
            <button
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
            >
              {expanded === entry.id ? <ChevronDown className="w-4 h-4 flex-shrink-0 text-gray-400" /> : <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-400" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase ${typeColor[entry.change_type] ?? 'text-gray-400'}`}>{entry.change_type.replace(/_/g, ' ')}</span>
                  <span className={`text-sm truncate ${themeVars.textPrimary}`}>{entry.summary}</span>
                </div>
                <div className={`text-xs mt-0.5 ${themeVars.textMuted}`}>
                  {entry.changed_by} · {new Date(entry.created_at).toLocaleString()}
                </div>
              </div>
            </button>
            {expanded === entry.id && (entry.old_value || entry.new_value) && (
              <div className="px-4 pb-3 ml-7 space-y-1">
                {entry.field_name && <div className={`text-xs ${themeVars.textMuted}`}><strong>Field:</strong> {entry.field_name}</div>}
                {entry.old_value && <div className={`text-xs ${themeVars.textMuted}`}><strong className="text-red-400">Old:</strong> {entry.old_value}</div>}
                {entry.new_value && <div className={`text-xs ${themeVars.textMuted}`}><strong className="text-emerald-400">New:</strong> {entry.new_value}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
