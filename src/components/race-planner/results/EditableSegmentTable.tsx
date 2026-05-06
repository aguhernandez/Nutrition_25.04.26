import { Pencil, Check, X } from 'lucide-react';
import { useState } from 'react';
import type { EditableSegment } from '../../../types/editablePlan';

function formatDuration(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = Math.round(totalMin % 60);
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

interface CellProps {
  value: string | number;
  onSave: (val: string) => void;
  numeric?: boolean;
  colorClass?: string;
}

function EditableCell({ value, onSave, numeric, colorClass }: CellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const commit = () => {
    onSave(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(String(value));
    setEditing(false);
  };

  if (editing) {
    return (
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <input
            autoFocus
            type={numeric ? 'number' : 'text'}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') cancel();
            }}
            className="w-20 bg-gray-700 text-white text-xs rounded px-2 py-1 border border-blue-500 outline-none"
          />
          <button onClick={commit} className="text-green-400 hover:text-green-300">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button onClick={cancel} className="text-red-400 hover:text-red-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    );
  }

  return (
    <td
      className={`px-3 py-2 text-sm cursor-pointer group whitespace-nowrap ${colorClass ?? 'text-gray-300'}`}
      onClick={() => { setDraft(String(value)); setEditing(true); }}
    >
      <span className="relative">
        {value}
        <Pencil className="w-3 h-3 ml-1 inline opacity-0 group-hover:opacity-40 transition-opacity" />
      </span>
    </td>
  );
}

interface Props {
  segments: EditableSegment[];
  onChange: (segments: EditableSegment[]) => void;
}

export default function EditableSegmentTable({ segments, onChange }: Props) {
  const update = (index: number, field: keyof EditableSegment, raw: string) => {
    const updated = segments.map((s, i) => {
      if (i !== index) return s;
      const numFields: (keyof EditableSegment)[] = ['timeMin', 'distanceKm', 'choG', 'fluidMl', 'sodiumMg'];
      if (numFields.includes(field)) {
        return { ...s, [field]: parseFloat(raw) || 0 };
      }
      return { ...s, [field]: raw };
    });
    onChange(updated);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700/60">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-800/80 border-b border-gray-700/60">
            <th className="px-3 py-2.5 text-left font-semibold text-gray-400 uppercase tracking-wider">Time</th>
            <th className="px-3 py-2.5 text-left font-semibold text-gray-400 uppercase tracking-wider">Distance</th>
            <th className="px-3 py-2.5 text-left font-semibold text-yellow-500 uppercase tracking-wider">CHO (g)</th>
            <th className="px-3 py-2.5 text-left font-semibold text-blue-400 uppercase tracking-wider">Fluid (mL)</th>
            <th className="px-3 py-2.5 text-left font-semibold text-teal-400 uppercase tracking-wider">Sodium (mg)</th>
            <th className="px-3 py-2.5 text-left font-semibold text-amber-400 uppercase tracking-wider">Caffeine Note</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((seg, i) => (
            <tr
              key={i}
              className={`border-b border-gray-800/40 last:border-0 ${seg.caffeineNote ? 'bg-amber-500/5' : i % 2 === 0 ? 'bg-transparent' : 'bg-gray-800/20'}`}
            >
              <td className="px-3 py-2 text-sm font-bold text-white whitespace-nowrap">
                {formatDuration(seg.timeMin)}
              </td>
              <td className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap">
                {seg.distanceKm} km
              </td>
              <EditableCell
                value={seg.choG}
                numeric
                colorClass="text-yellow-300 font-semibold"
                onSave={(v) => update(i, 'choG', v)}
              />
              <EditableCell
                value={seg.fluidMl}
                numeric
                colorClass="text-blue-300"
                onSave={(v) => update(i, 'fluidMl', v)}
              />
              <EditableCell
                value={seg.sodiumMg}
                numeric
                colorClass="text-teal-300"
                onSave={(v) => update(i, 'sodiumMg', v)}
              />
              <EditableCell
                value={seg.caffeineNote}
                colorClass={seg.caffeineNote ? 'text-amber-300 font-semibold' : 'text-gray-600'}
                onSave={(v) => update(i, 'caffeineNote', v)}
              />
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-2 bg-gray-800/30 border-t border-gray-700/40">
        <p className="text-xs text-gray-600">Click any value to edit. Changes are saved locally and reflected in PDF export.</p>
      </div>
    </div>
  );
}
