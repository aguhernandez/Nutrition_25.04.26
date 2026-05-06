import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X, Droplets, Utensils } from 'lucide-react';
import type { HydrationStation } from '../../../types/race';

interface Props {
  stations: HydrationStation[];
  distanceKm: number;
  onChange: (stations: HydrationStation[]) => void;
}

function generateId() {
  return `station-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function HydrationStationEditor({ stations, distanceKm, onChange }: Props) {
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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
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
            <div key={station.id} className="bg-gray-800/80 border border-cyan-500/40 rounded-xl p-3 space-y-2">
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 w-24">
                  <label className="text-xs text-gray-500">km</label>
                  <input
                    type="number"
                    min={0}
                    max={distanceKm}
                    step={0.1}
                    value={editValues.km}
                    onChange={(e) => setEditValues((v) => ({ ...v, km: e.target.value }))}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white w-full focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-gray-500">Label</label>
                  <input
                    type="text"
                    value={editValues.label}
                    onChange={(e) => setEditValues((v) => ({ ...v, label: e.target.value }))}
                    className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white w-full focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
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
                  <button onClick={cancelEdit} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div key={station.id} className="flex items-center gap-3 bg-gray-800/40 border border-gray-700/50 rounded-xl px-3 py-2.5 group">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${station.hasFood ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{station.label}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500 font-mono">{station.km} km</span>
                  {station.hasFood && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <Utensils className="w-2.5 h-2.5" /> food
                    </span>
                  )}
                  {!station.hasFood && (
                    <span className="flex items-center gap-1 text-xs text-cyan-400">
                      <Droplets className="w-2.5 h-2.5" /> water
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(station)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-gray-700 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteStation(station.id)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-700 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {addingNew && (
        <div className="bg-gray-800/80 border border-emerald-500/40 rounded-xl p-3 space-y-2 mt-2">
          <div className="text-xs text-emerald-400 font-semibold mb-2">New hydration station</div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-24">
              <label className="text-xs text-gray-500">km</label>
              <input
                type="number"
                min={0}
                max={distanceKm}
                step={0.1}
                placeholder="0.0"
                value={newStation.km}
                onChange={(e) => setNewStation((v) => ({ ...v, km: e.target.value }))}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white w-full focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-gray-500">Label</label>
              <input
                type="text"
                placeholder="Aid station name"
                value={newStation.label}
                onChange={(e) => setNewStation((v) => ({ ...v, label: e.target.value }))}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white w-full focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
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
              <button onClick={() => setAddingNew(false)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
