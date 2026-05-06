import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import type { EditableRecommendations } from '../../../types/editablePlan';

interface FieldProps {
  label: string;
  value: string;
  onSave: (val: string) => void;
  colorClass?: string;
}

function EditableField({ label, value, onSave, colorClass }: FieldProps) {
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

  if (editing) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</div>
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="w-full bg-gray-700/80 text-sm text-white rounded-lg px-3 py-2 border border-blue-500 outline-none resize-none leading-relaxed"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={commit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs font-semibold hover:bg-green-500/30 transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Save
          </button>
          <button
            onClick={cancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 text-gray-400 text-xs font-semibold hover:bg-gray-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group bg-gray-800/30 rounded-xl p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
      onClick={() => { setDraft(value); setEditing(true); }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
        <Pencil className="w-3.5 h-3.5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className={`text-sm leading-relaxed ${colorClass ?? 'text-gray-300'}`}>{value || <span className="text-gray-600 italic">Click to add a note…</span>}</p>
    </div>
  );
}

interface Props {
  recommendations: EditableRecommendations;
  onChange: (recs: EditableRecommendations) => void;
  hasCaffeine: boolean;
}

export default function EditableRecommendationsPanel({ recommendations, onChange, hasCaffeine }: Props) {
  const update = (field: keyof EditableRecommendations, val: string) => {
    onChange({ ...recommendations, [field]: val });
  };

  return (
    <div className="space-y-3">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
        <p className="text-xs text-blue-300/70">These notes appear in your PDF export. Click any field to edit.</p>
      </div>
      <EditableField label="Pacing Notes" value={recommendations.pacingNote} onSave={(v) => update('pacingNote', v)} colorClass="text-orange-200/80" />
      <EditableField label="Carbohydrate Notes" value={recommendations.carbsNote} onSave={(v) => update('carbsNote', v)} colorClass="text-yellow-200/80" />
      <EditableField label="Hydration Notes" value={recommendations.hydrationNote} onSave={(v) => update('hydrationNote', v)} colorClass="text-blue-200/80" />
      {hasCaffeine && (
        <EditableField label="Caffeine Notes" value={recommendations.caffeineNote} onSave={(v) => update('caffeineNote', v)} colorClass="text-amber-200/80" />
      )}
      <EditableField label="General / Race-Day Reminders" value={recommendations.generalNotes} onSave={(v) => update('generalNotes', v)} colorClass="text-gray-300" />
    </div>
  );
}
