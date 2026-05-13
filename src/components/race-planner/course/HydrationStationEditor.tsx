import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X, Droplets, Utensils } from 'lucide-react';
import type { HydrationStation } from '../../../types/race';
import { usePreferences } from '../../../lib/preferences';

interface Props {
  stations: HydrationStation[];
  distanceKm: number;
  onChange: (stations: HydrationStation[]) => void;
}

function generateId() {
  return `station-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function HydrationStationEditor({ stations, distanceKm, onChange }: Props) {
  const { theme } = usePreferences();
  const isDark = theme === 'dark';

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ km: string; label: string; hasFood: boolean }>({ km: '', label: '', hasFood: false });
  const [addingNew, setAddingNew] = useState(false);
  const [newStation, setNewStation] = useState<{ km: string; label: string; hasFood: boolean }>({ km: '', label: '', hasFood: false });

  const sorted = [...stations].sort((a, b) => a.km - b.km);

  const startEdit = (s: HydrationStation) => {
    setEditingId(s.id);
    setEditValues({ km: String(s.km), label: s.label, hasFood: s.hasFood });
  };

  const commitEdit = () => {
    if (!editingId) return;
    const km = parseFloat(editValues.km);
    if (isNaN(km) || km < 0 || km > distanceKm) return;
    onChange(stations.map((s) => s.id === editingId ? { ...s, km, label: editValues.label || s.label, hasFood: editValues.hasFood } : s));
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const deleteStation = (id: string) => onChange(stations.filter((s) => s.id !== id));

  const commitAdd = () => {
    const km = parseFloat(newStation.km);
    if (isNaN(km) || km < 0 || km > distanceKm) return;
    onChange([...stations, { id: generateId(), km, label: newStation.label || `Aid – ${km}km`, hasFood: newStation.hasFood }]);
    setAddingNew(false);
    setNewStation({ km: '', label: '', hasFood: false });
  };

  const rowBg = isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb';
  const rowBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const editBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.12)' : '#d1d5db';
  const inputText = isDark ? '#f3f4f6' : '#1f2937';
  const labelColor = isDark ? '#9ca3af' : '#6b7280';
  const textPrimary = isDark ? '#f3f4f6' : '#1f2937';
  const textMuted = isDark ? '#6b7280' : '#9ca3af';

  const inputCls = `rounded-lg px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: textMuted }}>
          {sorted.length} station{sorted.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => { setAddingNew(true); setNewStation({ km: '', label: '', hasFood: false }); }}
          className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Add station
        </button>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {sorted.map((station) =>
          editingId === station.id ? (
            <div
              key={station.id}
              className="rounded-xl p-3 space-y-2"
              style={{ backgroundColor: editBg, border: '1px solid rgba(34,211,238,0.4)' }}
            >
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 w-24">
                  <label className="text-xs" style={{ color: labelColor }}>km</label>
                  <input
                    type="number"
                    min={0}
                    max={distanceKm}
                    step={0.1}
                    value={editValues.km}
                    onChange={(e) => setEditValues((v) => ({ ...v, km: e.target.value }))}
                    className={inputCls}
                    style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: inputText }}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs" style={{ color: labelColor }}>Label</label>
                  <input
                    type="text"
                    value={editValues.label}
                    onChange={(e) => setEditValues((v) => ({ ...v, label: e.target.value }))}
                    className={inputCls}
                    style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: inputText }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                  <input
                    type="checkbox"
                    checked={editValues.hasFood}
                    onChange={(e) => setEditValues((v) => ({ ...v, hasFood: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                  Food available
                </label>
                <div className="flex gap-2">
                  <button onClick={commitEdit} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                    <Check className="w-3.5 h-3.5" /> Save
                  </button>
                  <button onClick={cancelEdit} className="flex items-center gap-1 text-xs transition-colors" style={{ color: textMuted }}>
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              key={station.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 group transition-colors"
              style={{ backgroundColor: rowBg, border: `1px solid ${rowBorder}` }}
            >
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${station.hasFood ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: textPrimary }}>{station.label}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono" style={{ color: textMuted }}>{station.km} km</span>
                  {station.hasFood ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <Utensils className="w-2.5 h-2.5" /> food
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-cyan-400">
                      <Droplets className="w-2.5 h-2.5" /> water
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(station)}
                  className="p-1.5 rounded-lg transition-all text-cyan-400"
                  style={{ ':hover': { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6' } } as React.CSSProperties}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteStation(station.id)}
                  className="p-1.5 rounded-lg transition-all text-red-400"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.08)' : '#fef2f2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {addingNew && (
        <div
          className="rounded-xl p-3 space-y-2 mt-2"
          style={{ backgroundColor: editBg, border: '1px solid rgba(52,211,153,0.4)' }}
        >
          <div className="text-xs text-emerald-400 font-semibold mb-2">New hydration station</div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-24">
              <label className="text-xs" style={{ color: labelColor }}>km</label>
              <input
                type="number"
                min={0}
                max={distanceKm}
                step={0.1}
                placeholder="0.0"
                value={newStation.km}
                onChange={(e) => setNewStation((v) => ({ ...v, km: e.target.value }))}
                className={inputCls}
                style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: inputText }}
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs" style={{ color: labelColor }}>Label</label>
              <input
                type="text"
                placeholder="Aid station name"
                value={newStation.label}
                onChange={(e) => setNewStation((v) => ({ ...v, label: e.target.value }))}
                className={inputCls}
                style={{ backgroundColor: inputBg, border: `1px solid ${inputBorder}`, color: inputText }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
              <input
                type="checkbox"
                checked={newStation.hasFood}
                onChange={(e) => setNewStation((v) => ({ ...v, hasFood: e.target.checked }))}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <Utensils className="w-3.5 h-3.5 text-emerald-400" />
              Food available
            </label>
            <div className="flex gap-2">
              <button onClick={commitAdd} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                <Check className="w-3.5 h-3.5" /> Add
              </button>
              <button onClick={() => setAddingNew(false)} className="flex items-center gap-1 text-xs transition-colors" style={{ color: textMuted }}>
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
