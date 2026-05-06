import { useState } from 'react';
import { CheckCircle, Loader2, ClipboardList } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { PostRaceFeedback as FeedbackType } from '../../types/race';

interface Props {
  competitionId: string;
  raceName: string;
  onClose: () => void;
}

const defaultFeedback: Omit<FeedbackType, 'competitionId'> = {
  actualDurationMin: 0,
  averageHr: 0,
  giIssues: false,
  actualCarbIntakeGH: 0,
  actualTemperature: 0,
  notes: '',
};

export default function PostRaceFeedback({ competitionId, raceName, onClose }: Props) {
  const [feedback, setFeedback] = useState(defaultFeedback);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof typeof defaultFeedback>(key: K, value: (typeof defaultFeedback)[K]) =>
    setFeedback((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('post_race_feedback').insert({
      competition_id: competitionId,
      actual_duration_min: feedback.actualDurationMin,
      average_hr: feedback.averageHr,
      gi_issues: feedback.giIssues,
      actual_carb_intake_g_h: feedback.actualCarbIntakeGH,
      actual_temperature: feedback.actualTemperature,
      notes: feedback.notes,
    });
    setSaved(true);
    setSaving(false);
  };

  if (saved) {
    return (
      <div
        className="bg-white rounded-2xl p-8 text-center"
        style={{ border: '2px solid #e5e7eb', boxShadow: '0 2px 8px rgba(81,65,99,0.06)' }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'rgba(16,185,129,0.12)' }}
        >
          <CheckCircle className="w-7 h-7" style={{ color: '#059669' }} />
        </div>
        <h3 className="font-heading text-lg text-[#1f2937] mb-2">Feedback Saved</h3>
        <p className="font-body text-sm text-[#9ca3af] mb-6">
          Your post-race data has been recorded. This helps improve future race plans.
        </p>
        <button onClick={onClose} className="btn-secondary">
          Close
        </button>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '2px solid #e5e7eb', boxShadow: '0 2px 8px rgba(81,65,99,0.06)' }}
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#e5e7eb]">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(253,218,54,0.2)' }}
        >
          <ClipboardList className="w-4 h-4" style={{ color: '#514163' }} />
        </div>
        <div>
          <h3 className="font-body font-semibold text-[#1f2937]">Post-Race Feedback</h3>
          <p className="font-body text-xs text-[#9ca3af]">{raceName}</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { key: 'actualDurationMin' as const, label: 'Actual Duration', unit: 'min', placeholder: '215' },
            { key: 'averageHr' as const, label: 'Average Heart Rate', unit: 'bpm', placeholder: '158' },
            { key: 'actualCarbIntakeGH' as const, label: 'Actual Carb Intake', unit: 'g/h', placeholder: '75' },
            { key: 'actualTemperature' as const, label: 'Actual Temperature', unit: '°C', placeholder: '24' },
          ].map(({ key, label, unit, placeholder }) => (
            <div key={key}>
              <label className="block font-body font-medium text-sm text-[#374151] mb-1.5">{label}</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  placeholder={placeholder}
                  value={(feedback[key] as number) || ''}
                  onChange={(e) => update(key, parseFloat(e.target.value) || 0)}
                  className="input-brand"
                />
                <span className="font-body text-sm text-[#9ca3af] whitespace-nowrap">{unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block font-body font-medium text-sm text-[#374151] mb-2">GI Issues During Race</label>
          <div className="flex gap-3">
            {[
              { val: false, label: 'None' },
              { val: true, label: 'Yes – had issues' },
            ].map(({ val, label }) => (
              <button
                key={String(val)}
                onClick={() => update('giIssues', val)}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-body font-medium transition-all"
                style={
                  feedback.giIssues === val
                    ? { backgroundColor: 'rgba(253,218,54,0.15)', border: '2px solid #fdda36', color: '#514163', fontWeight: 700 }
                    : { backgroundColor: '#f9fafb', border: '2px solid #e5e7eb', color: '#4b5563' }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-body font-medium text-sm text-[#374151] mb-1.5">Notes</label>
          <textarea
            rows={3}
            placeholder="What went well? What would you change? How did you feel at key moments?"
            value={feedback.notes}
            onChange={(e) => update('notes', e.target.value)}
            className="input-brand resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 btn-secondary py-3">
            Skip
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl font-body font-bold text-sm transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: '#fdda36', color: '#514163' }}
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              'Save Feedback'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
