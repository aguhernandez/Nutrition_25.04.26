import type { StrategyPreferences } from '../../../types/race';
import { Target, ShieldCheck, Zap, Coffee, Droplets, Cookie, Layers, Brain, Calendar } from 'lucide-react';

interface Props {
  data: StrategyPreferences;
  onChange: (data: StrategyPreferences) => void;
}

const TARGET_OPTIONS = [
  { value: 'performance' as const, label: 'Peak Performance', description: 'Push limits. Maximize speed. Accept higher risk.', icon: Zap, color: 'from-orange-500 to-red-500', border: 'border-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-300' },
  { value: 'finish_strong' as const, label: 'Finish Strong', description: 'Smart pacing. Negative split. Strong final push.', icon: Target, color: 'from-blue-500 to-cyan-500', border: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-300' },
  { value: 'safe' as const, label: 'Safe & Complete', description: 'Conservative pace. Prioritize finishing. Minimize risk.', icon: ShieldCheck, color: 'from-green-500 to-emerald-600', border: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-300' },
];

const CHO_TYPES = [
  { value: 'mix' as const, label: 'Mix', description: 'Gels + drink + solids', icon: Layers },
  { value: 'gel' as const, label: 'Gels', description: 'Primary gel-based', icon: Zap },
  { value: 'liquid' as const, label: 'Liquid', description: 'Drinks only', icon: Droplets },
  { value: 'solid' as const, label: 'Solid', description: 'Real food + bars', icon: Cookie },
];

const VOLUME_OPTIONS = [
  { value: 'low' as const, label: 'Low', description: '<8h/week' },
  { value: 'moderate' as const, label: 'Moderate', description: '8-15h/week' },
  { value: 'high' as const, label: 'High', description: '>15h/week' },
];

function SectionHeader({ icon: Icon, title, color }: { icon: React.ElementType; title: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <h3 className="font-body font-semibold text-xs text-[#514163] uppercase tracking-wider">{title}</h3>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all font-body"
      style={checked ? { backgroundColor: 'rgba(253,218,54,0.12)', borderColor: '#fdda36', color: '#514163' } : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#4b5563' }}
    >
      <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? 'border-white bg-white' : 'border-gray-600'}`}>
        {checked && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
      </div>
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs mt-0.5 text-gray-500">{description}</div>
      </div>
    </button>
  );
}

export default function Step3Strategy({ data, onChange }: Props) {
  const update = <K extends keyof StrategyPreferences>(key: K, value: StrategyPreferences[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#fdda36' }} />
        <div>
          <h2 className="font-heading text-xl text-[#1f2937]">Strategy Preferences</h2>
          <p className="font-body text-sm text-[#9ca3af]">Race approach, nutrition format, and pre-competition planning</p>
        </div>
      </div>

      <div>
        <SectionHeader icon={Target} title="Race Target" color="from-orange-500 to-red-500" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TARGET_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const selected = data.target === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => update('target', opt.value)}
                className="relative p-5 rounded-2xl border-2 text-left transition-all duration-200"
                style={selected ? { backgroundColor: opt.bg, borderColor: '#fdda36', boxShadow: '0 4px 14px rgba(253,218,54,0.25)' } : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${opt.color} mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-body font-semibold text-sm mb-1" style={{ color: selected ? opt.text : '#4b5563' }}>{opt.label}</div>
                <div className="font-body text-xs text-[#9ca3af] leading-relaxed">{opt.description}</div>
                {selected && <div className={`absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-br ${opt.color}`} />}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SectionHeader icon={Layers} title="CHO Format Preference" color="from-yellow-500 to-orange-500" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CHO_TYPES.map((opt) => {
            const Icon = opt.icon;
            const selected = data.choType === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => update('choType', opt.value)}
                className="p-4 rounded-xl border-2 text-center transition-all font-body"
                style={selected ? { backgroundColor: 'rgba(253,218,54,0.15)', borderColor: '#fdda36', color: '#514163' } : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#4b5563' }}
              >
                <Icon className={`w-5 h-5 mx-auto mb-2 ${selected ? 'text-yellow-300' : 'text-gray-500'}`} />
                <div className="text-sm font-semibold">{opt.label}</div>
                <div className="font-body text-xs text-[#9ca3af] mt-0.5">{opt.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SectionHeader icon={Coffee} title="Caffeine & Gut Training" color="from-amber-600 to-yellow-600" />
        <div className="space-y-3">
          <Toggle
            label="Include Caffeine Strategy"
            description="Calculate optimal dose, timing, and sources based on body weight and race target"
            checked={data.caffeineYes}
            onChange={(v) => update('caffeineYes', v)}
          />
          <Toggle
            label="Gut-Trained for High Carbs"
            description="I regularly train with 90g+/h of carbohydrates during long sessions"
            checked={data.gutTrained}
            onChange={(v) => update('gutTrained', v)}
          />
          <Toggle
            label="Add GI Training Protocol"
            description="Generate a progressive 4-6 week plan to train gut tolerance before race day"
            checked={data.giTrainingWanted}
            onChange={(v) => update('giTrainingWanted', v)}
          />
        </div>
      </div>

      <div>
        <SectionHeader icon={Calendar} title="Pre-Competition Nutrition Plan" color="from-teal-500 to-cyan-600" />
        <div className="space-y-4">
          <div>
            <p className="font-body text-xs text-[#9ca3af] mb-3">How many days of pre-race nutrition planning do you want?</p>
            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 3] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => update('preCompDays', d)}
                  className="py-3 px-4 rounded-xl border-2 text-center transition-all font-body"
                  style={data.preCompDays === d ? { backgroundColor: 'rgba(253,218,54,0.15)', borderColor: '#fdda36', color: '#514163', fontWeight: 700 } : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#4b5563' }}
                >
                  <div className="text-lg font-bold">{d}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {d === 1 ? 'Day before' : d === 2 ? '2 days out' : '3 days out'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-body text-xs text-[#9ca3af] mb-3">Current training volume (calibrates CHO-loading targets)</p>
            <div className="grid grid-cols-3 gap-2">
              {VOLUME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update('trainingVolume', opt.value)}
                  className="py-3 px-4 rounded-xl border-2 text-center transition-all font-body"
                style={data.trainingVolume === opt.value ? { backgroundColor: 'rgba(253,218,54,0.15)', borderColor: '#fdda36', color: '#514163', fontWeight: 700 } : { backgroundColor: '#f9fafb', borderColor: '#e5e7eb', color: '#4b5563' }}
                >
                  <div className="text-sm font-semibold">{opt.label}</div>
                  <div className="font-body text-xs text-[#9ca3af] mt-0.5">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f9fafb] rounded-xl p-4 border border-[#e5e7eb]">
        <div className="flex items-start gap-3">
          <Brain className="w-4 h-4 text-[#9ca3af] mt-0.5 flex-shrink-0" />
          <p className="font-body text-xs text-[#9ca3af] leading-relaxed">
            Future versions will include lab-derived VO2 and lactate data integration, machine learning on personal GI tolerance, and comparison against your historical race performance database.
          </p>
        </div>
      </div>
    </div>
  );
}
