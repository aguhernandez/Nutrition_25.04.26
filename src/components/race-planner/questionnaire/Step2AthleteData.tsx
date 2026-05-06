import type { AthleteData, Sport } from '../../../types/race';
import { isCyclingSport, isRunningSport } from '../../../config/sports';

interface Props {
  sport: Sport;
  data: AthleteData;
  onChange: (data: AthleteData) => void;
}

const inputCls = 'input-brand';

function Field({
  label,
  hint,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="font-body font-medium text-sm text-[#374151]">{label}</label>
        {optional && (
          <span className="font-body text-xs text-[#9ca3af] bg-[#f3f4f6] px-2 py-0.5 rounded-full">
            optional
          </span>
        )}
      </div>
      {hint && <p className="font-body text-xs text-[#9ca3af] mb-2">{hint}</p>}
      {children}
    </div>
  );
}

export default function Step2AthleteData({ sport, data, onChange }: Props) {
  const isRunning = isRunningSport(sport);
  const isCycling = isCyclingSport(sport);
  const update = (key: keyof AthleteData, value: string | number | boolean) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#fdda36' }} />
        <div>
          <h2 className="font-heading text-xl text-[#1f2937]">Athlete Profile</h2>
          <p className="font-body text-sm text-[#9ca3af]">Your physiological data for personalized calculations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Body Weight" hint="Used for hydration and sweat loss calculations">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="30"
              max="200"
              placeholder="70"
              value={data.bodyWeightKg || ''}
              onChange={(e) => update('bodyWeightKg', parseFloat(e.target.value) || 0)}
              className={inputCls}
            />
            <span className="text-gray-500 text-sm">kg</span>
          </div>
        </Field>

        <Field label="VO2max" hint="Maximum oxygen uptake (mL/kg/min)" optional>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="20"
              max="90"
              placeholder="55"
              value={data.vo2max || ''}
              onChange={(e) => update('vo2max', parseFloat(e.target.value) || 0)}
              className={inputCls}
            />
            <span className="text-gray-500 text-sm whitespace-nowrap">mL/kg/min</span>
          </div>
        </Field>

        {isRunning && (
          <>
            <Field
              label="Threshold Pace"
              hint="Your lactate threshold pace (min/km)"
              optional
            >
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="2"
                  max="12"
                  step="0.1"
                  placeholder="5.0"
                  value={data.thresholdPace || ''}
                  onChange={(e) => update('thresholdPace', parseFloat(e.target.value) || 0)}
                  className={inputCls}
                />
                <span className="font-body text-sm text-[#9ca3af] whitespace-nowrap">min/km</span>
              </div>
            </Field>

            <Field label="vVO2max Pace" hint="Pace at which you reach VO2max (min/km)" optional>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="2"
                  max="10"
                  step="0.1"
                  placeholder="4.2"
                  value={data.vvo2maxPace || ''}
                  onChange={(e) => update('vvo2maxPace', parseFloat(e.target.value) || 0)}
                  className={inputCls}
                />
                <span className="font-body text-sm text-[#9ca3af] whitespace-nowrap">min/km</span>
              </div>
            </Field>
          </>
        )}

        {isCycling && (
          <>
            <Field label="Threshold Power (FTP)" hint="Your Functional Threshold Power" optional>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="50"
                  max="600"
                  placeholder="280"
                  value={data.thresholdPower || ''}
                  onChange={(e) => update('thresholdPower', parseInt(e.target.value) || 0)}
                  className={inputCls}
                />
                <span className="font-body text-sm text-[#9ca3af]">W</span>
              </div>
            </Field>

            <Field label="Critical Power (CP)" hint="Your Critical Power value" optional>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="50"
                  max="600"
                  placeholder="290"
                  value={data.cp || ''}
                  onChange={(e) => update('cp', parseInt(e.target.value) || 0)}
                  className={inputCls}
                />
                <span className="font-body text-sm text-[#9ca3af]">W</span>
              </div>
            </Field>
          </>
        )}

        <Field label="High Carb Intake Experience" hint="How experienced are you with high-carb fueling?">
          <select
            value={data.highCarbExperience}
            onChange={(e) =>
              update('highCarbExperience', e.target.value as 'none' | 'some' | 'experienced')
            }
            className="input-brand"
          >
            <option value="none">None – new to carb fueling</option>
            <option value="some">Some – used gels/drinks in training</option>
            <option value="experienced">Experienced – 90g+/h in training</option>
          </select>
        </Field>

        <Field
          label="Personal Sweat Rate"
          hint="If you've measured it in a lab or sweat test"
          optional
        >
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={data.hasSweatRate}
              onChange={(e) => update('hasSweatRate', e.target.checked)}
              className="w-4 h-4 rounded accent-blue-500 mr-2"
            />
            <span className="text-gray-400 text-sm mr-3">I know my sweat rate</span>
            {data.hasSweatRate && (
              <>
                <input
                  type="number"
                  min="0.3"
                  max="3"
                  step="0.1"
                  placeholder="1.2"
                  value={data.sweatRateLh || ''}
                  onChange={(e) => update('sweatRateLh', parseFloat(e.target.value) || 0)}
                  className="flex-1 bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <span className="font-body text-sm text-[#9ca3af]">L/h</span>
              </>
            )}
          </div>
        </Field>

        <div className="sm:col-span-2">
          <Field label="GI Issues History" hint="Have you experienced gastrointestinal problems during races or long training?">
            <div className="flex gap-4 mt-2">
              {[
                { val: false, label: 'No issues – strong stomach' },
                { val: true, label: 'Yes – experienced GI problems' },
              ].map(({ val, label }) => (
                <button
                  key={String(val)}
                  onClick={() => update('giIssuesHistory', val)}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-body font-medium transition-all"
                  style={
                    data.giIssuesHistory === val
                      ? { backgroundColor: 'rgba(253,218,54,0.15)', border: '2px solid #fdda36', color: '#514163', fontWeight: 700 }
                      : { backgroundColor: '#f9fafb', border: '2px solid #e5e7eb', color: '#4b5563' }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
}
