import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import type { EditableRecommendations } from '../../../types/editablePlan';
import { usePreferences } from '../../../lib/preferences';

interface FieldProps {
  label: string;
  value: string;
  onSave: (val: string) => void;
  accentColor: string;
  isDark: boolean;
}

function EditableField({ label, value, onSave, accentColor, isDark }: FieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    onSave(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const fieldBg = isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb';
  const fieldBorder = isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb';
  const fieldHoverBg = isDark ? 'rgba(255,255,255,0.07)' : '#f3f4f6';
  const labelColor = isDark ? '#6b7280' : '#9ca3af';
  const textColor = isDark ? '#d1d5db' : '#374151';
  const placeholderColor = isDark ? '#4b5563' : '#d1d5db';

  if (editing) {
    return (
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: `1px solid #3b82f6` }}
      >
        <div className="text-xs uppercase tracking-wider mb-2" style={{ color: labelColor }}>{label}</div>
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="w-full text-sm rounded-lg px-3 py-2 border border-blue-500/40 outline-none resize-none leading-relaxed transition-colors"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8faff',
            color: isDark ? '#f3f4f6' : '#1f2937',
          }}
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={commit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-500 text-xs font-semibold hover:bg-green-500/30 transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Save
          </button>
          <button
            onClick={cancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : '#f3f4f6', color: isDark ? '#9ca3af' : '#6b7280' }}
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group rounded-xl p-4 cursor-pointer transition-colors"
      style={{ backgroundColor: fieldBg, border: `1px solid ${fieldBorder}` }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = fieldHoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = fieldBg)}
      onClick={() => { setDraft(value); setEditing(true); }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
          <div className="text-xs uppercase tracking-wider" style={{ color: labelColor }}>{label}</div>
        </div>
        <Pencil className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: accentColor }} />
      </div>
      {value ? (
        <p className="text-sm leading-relaxed" style={{ color: textColor }}>{value}</p>
      ) : (
        <p className="text-sm italic" style={{ color: placeholderColor }}>Click to add a note…</p>
      )}
    </div>
  );
}

interface Props {
  recommendations: EditableRecommendations;
  onChange: (recs: EditableRecommendations) => void;
  hasCaffeine: boolean;
}

export default function EditableRecommendationsPanel({ recommendations, onChange, hasCaffeine }: Props) {
  const { theme } = usePreferences();
  const isDark = theme === 'dark';

  const update = (field: keyof EditableRecommendations, val: string) => {
    onChange({ ...recommendations, [field]: val });
  };

  return (
    <div className="space-y-3">
      <div
        className="rounded-xl px-4 py-3"
        style={{
          backgroundColor: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.2)',
        }}
      >
        <p className="text-xs" style={{ color: isDark ? 'rgba(147,197,253,0.8)' : '#3b82f6' }}>
          These notes appear in your PDF export. Click any field to edit.
        </p>
      </div>

      <EditableField
        label="Pacing Notes"
        value={recommendations.pacingNote}
        onSave={(v) => update('pacingNote', v)}
        accentColor="#f97316"
        isDark={isDark}
      />
      <EditableField
        label="Carbohydrate Notes"
        value={recommendations.carbsNote}
        onSave={(v) => update('carbsNote', v)}
        accentColor="#fdda36"
        isDark={isDark}
      />
      <EditableField
        label="Hydration Notes"
        value={recommendations.hydrationNote}
        onSave={(v) => update('hydrationNote', v)}
        accentColor="#60a5fa"
        isDark={isDark}
      />
      {hasCaffeine && (
        <EditableField
          label="Caffeine Notes"
          value={recommendations.caffeineNote}
          onSave={(v) => update('caffeineNote', v)}
          accentColor="#f59e0b"
          isDark={isDark}
        />
      )}
      <EditableField
        label="General / Race-Day Reminders"
        value={recommendations.generalNotes}
        onSave={(v) => update('generalNotes', v)}
        accentColor={isDark ? '#9ca3af' : '#6b7280'}
        isDark={isDark}
      />
    </div>
  );
}
