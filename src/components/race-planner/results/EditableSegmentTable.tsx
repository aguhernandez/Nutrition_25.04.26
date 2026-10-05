import { Pencil, Check, X } from 'lucide-react';
import { useState } from 'react';
import type { EditableSegment, RaceExecutionItem } from '../../../types/editablePlan';
import { usePreferences } from '../../../lib/preferences';

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
  isDark: boolean;
  inline?: boolean;
}

function EditableCell({ value, onSave, numeric, colorClass, isDark, inline = false }: CellProps) {
  const [editing, setEditing] = useState(false);
  const CellTag = inline ? 'div' : 'td';
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
      <CellTag className="px-3 py-2 whitespace-nowrap">
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
            className={`w-20 text-xs rounded px-2 py-1 border border-blue-500 outline-none ${isDark ? 'bg-white/10 text-white' : 'bg-white text-gray-800'}`}
          />
          <button onClick={commit} className="text-green-500 hover:text-green-400">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button onClick={cancel} className="text-red-400 hover:text-red-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </CellTag>
    );
  }

  return (
    <CellTag
      className={`px-3 py-2 text-sm cursor-pointer group whitespace-nowrap ${colorClass ?? (isDark ? 'text-gray-300' : 'text-gray-600')}`}
      onClick={() => { setDraft(String(value)); setEditing(true); }}
    >
      <span className="relative">
        {value}
        <Pencil className="w-3 h-3 ml-1 inline opacity-0 group-hover:opacity-40 transition-opacity" />
      </span>
    </CellTag>
  );
}

interface Props {
  segments: EditableSegment[];
  executionItems?: RaceExecutionItem[];
  onChange: (segments: EditableSegment[]) => void;
  onExecutionChange?: (items: RaceExecutionItem[]) => void;
}

export default function EditableSegmentTable({ segments, executionItems = [], onChange, onExecutionChange }: Props) {
  const { theme } = usePreferences();
  const isDark = theme === 'dark';

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

  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const headerBg = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6';
  const rowAltBg = isDark ? 'rgba(255,255,255,0.02)' : '#fafafa';
  const cafRowBg = isDark ? 'rgba(245,158,11,0.05)' : 'rgba(245,158,11,0.04)';
  const footerBg = isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';

  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${borderColor}` }}>
      {executionItems.length === 0 && <table className="w-full text-xs">
        <thead>
          <tr style={{ backgroundColor: headerBg, borderBottom: `1px solid ${borderColor}` }}>
            <th className={`px-3 py-2.5 text-left font-semibold uppercase tracking-wider ${textMuted}`}>Time</th>
            <th className={`px-3 py-2.5 text-left font-semibold uppercase tracking-wider ${textMuted}`}>Distance</th>
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
              style={{
                backgroundColor: seg.caffeineNote ? cafRowBg : i % 2 !== 0 ? rowAltBg : 'transparent',
                borderBottom: i < segments.length - 1 ? `1px solid ${borderColor}` : 'none',
              }}
            >
              <td className={`px-3 py-2 text-sm font-bold whitespace-nowrap ${textPrimary}`}>
                {formatDuration(seg.timeMin)}
              </td>
              <td className={`px-3 py-2 text-sm whitespace-nowrap ${textMuted}`}>
                {seg.distanceKm} km
              </td>
              <EditableCell
                value={seg.choG}
                numeric
                colorClass="text-yellow-500 font-semibold"
                onSave={(v) => update(i, 'choG', v)}
                isDark={isDark}
              />
              <EditableCell
                value={seg.fluidMl}
                numeric
                colorClass="text-blue-400"
                onSave={(v) => update(i, 'fluidMl', v)}
                isDark={isDark}
              />
              <EditableCell
                value={seg.sodiumMg}
                numeric
                colorClass="text-teal-400"
                onSave={(v) => update(i, 'sodiumMg', v)}
                isDark={isDark}
              />
              <EditableCell
                value={seg.caffeineNote}
                colorClass={seg.caffeineNote ? 'text-amber-400 font-semibold' : textMuted}
                onSave={(v) => update(i, 'caffeineNote', v)}
                isDark={isDark}
              />
            </tr>
          ))}
        </tbody>
      </table>}
      {executionItems.length > 0 && (
        <div className="border-t p-4" style={{ borderColor, backgroundColor: footerBg }}>
          <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${textMuted}`}>Timeline supplements and meals</div>
          <div className="space-y-2">
            {executionItems.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ backgroundColor: rowAltBg }}>
                <span className={`w-16 text-xs font-bold ${textPrimary}`}>{formatDuration(item.timeMin)}</span>
                <span className={`w-20 text-xs ${textMuted}`}>{item.distanceLabel}</span>
                <EditableCell value={item.title} onSave={(value) => onExecutionChange?.(executionItems.map((current, i) => i === index ? { ...current, title: value } : current))} isDark={isDark} inline />
                <span className={`text-xs ${textMuted}`}>{item.quantity} ×</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={`px-4 py-2 border-t`} style={{ backgroundColor: footerBg, borderColor }}>
        <p className={`text-xs ${textMuted}`}>Click any value to edit. Changes are saved locally and reflected in PDF export.</p>
      </div>
    </div>
  );
}
