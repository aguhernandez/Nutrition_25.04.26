import { useState, useEffect } from 'react';
import {
  Gauge,
  Flame,
  Droplets,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
  Loader2,
  XCircle,
  Coffee,
  UtensilsCrossed,
  Brain,
  FileText,
  ClipboardList,
  Radio,
} from 'lucide-react';
import type { Competition, StrategyOutput, RaceCatalogEntry, HydrationStation } from '../../../types/race';
import RaceCourseView from '../course/RaceCourseView';
import type { EditablePlan } from '../../../types/editablePlan';
import type { RaceNutritionPlan } from '../../../types/nutrition';
import { getSportConfig } from '../../../config/sports';
import { printFullReport, printCueCard, buildSegments } from '../../../utils/generatePrintPlan';
import EditableSegmentTable from './EditableSegmentTable';
import EditableRecommendationsPanel from './EditableRecommendations';
import NutritionPlanCustomizer from '../nutrition/NutritionPlanCustomizer';
import LiveRaceMode from '../live/LiveRaceMode';
import { generateHydrationStations, generateElevationProfile } from '../../../utils/elevationGenerator';

interface Props {
  competition: Competition;
  catalogEntry?: RaceCatalogEntry;
  onSave: () => Promise<void>;
  onNewRace: () => void;
}

function StatCard({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-4" style={{ border: '2px solid #e5e7eb', boxShadow: '0 1px 4px rgba(81,65,99,0.05)' }}>
      <div className={`text-xs font-body font-semibold uppercase tracking-wider mb-1 ${color}`}>{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="font-heading text-2xl text-[#1f2937]">{value}</span>
        {unit && <span className="font-body text-sm text-[#9ca3af]">{unit}</span>}
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  color,
  children,
  defaultOpen = true,
  badge,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl overflow-hidden print:border print:border-gray-300 print:break-inside-avoid" style={{ border: '2px solid #e5e7eb', boxShadow: '0 2px 10px rgba(81,65,99,0.06)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition-colors print:pointer-events-none"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="font-body font-semibold text-[#1f2937]">{title}</span>
          {badge && (
            <span className="font-body text-xs bg-[#f3f4f6] text-[#9ca3af] px-2 py-0.5 rounded-full">{badge}</span>
          )}
        </div>
        <div className="print:hidden">
          {open ? <ChevronUp className="w-4 h-4 text-[#9ca3af]" /> : <ChevronDown className="w-4 h-4 text-[#9ca3af]" />}
        </div>
      </button>
      {open && <div className="px-6 pb-6 space-y-4">{children}</div>}
    </div>
  );
}

function formatPace(minPerKm: number): string {
  const mins = Math.floor(minPerKm);
  const secs = Math.round((minPerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function MealRow({ timing, description, carbsG }: { timing: string; description: string; carbsG: number }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-800/60 last:border-0">
      <div className="flex-shrink-0 w-28 text-xs font-semibold text-gray-500 pt-0.5">{timing}</div>
      <div className="flex-1 text-sm text-gray-300 leading-relaxed">{description}</div>
      <div className="flex-shrink-0 text-right">
        <span className="text-sm font-bold text-yellow-300">{carbsG}g</span>
        <span className="text-xs text-gray-600 block">carbs</span>
      </div>
    </div>
  );
}

export default function ResultsDashboard({ competition, catalogEntry, onSave, onNewRace }: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editablePlan, setEditablePlan] = useState<EditablePlan | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<RaceNutritionPlan | undefined>(undefined);
  const [showLiveMode, setShowLiveMode] = useState(false);
  const [hydrationStations, setHydrationStations] = useState<HydrationStation[]>([]);

  const output = competition.strategyOutput as StrategyOutput;
  const cfg = getSportConfig(competition.sport);
  const durationH = competition.raceData.expectedDurationMin / 60;
  const durationLabel = `${Math.floor(durationH)}h ${Math.round((durationH % 1) * 60)}min`;

  useEffect(() => {
    const segments = buildSegments(competition, output);
    setEditablePlan({
      segments,
      recommendations: {
        pacingNote: output.pacing.recommendation,
        carbsNote: output.carbs.timing,
        hydrationNote: '',
        caffeineNote: output.caffeine?.notes ?? '',
        generalNotes: '',
      },
    });
    const distKm = competition.raceData.distanceUnit === 'miles'
      ? competition.raceData.distance * 1.60934
      : competition.raceData.distance;
    const seed = competition.raceName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const pts = generateElevationProfile(distKm, competition.raceData.elevationGain || 0, seed);
    setHydrationStations(generateHydrationStations(distKm, pts, catalogEntry));
  }, [competition]);

  const handleSave = async () => {
    setSaving(true);
    await onSave();
    setSaved(true);
    setSaving(false);
  };

  const handleFullReport = () => printFullReport(competition, editablePlan ?? undefined);
  const handleCueCard = () => printCueCard(competition, editablePlan ?? undefined);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 print:px-0 print:py-4">
      <div className="print:hidden flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${cfg.color}`} />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{cfg.label}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{competition.raceName}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {competition.raceData.distance} {competition.raceData.distanceUnit} &middot; {durationLabel} &middot; {competition.raceData.temperature}°C
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowLiveMode(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:opacity-90"
          >
            <Radio className="w-4 h-4 animate-pulse" /> Start Race
          </button>
          <button
            onClick={handleFullReport}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Full Report PDF
          </button>
          <button
            onClick={handleCueCard}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-all flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" /> Print Cue Card
          </button>
          <button
            onClick={onNewRace}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-all"
          >
            New Race
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${saved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : `bg-gradient-to-r ${cfg.color} text-white hover:opacity-90`}`}
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><BookmarkPlus className="w-4 h-4" /> Save Plan</>}
          </button>
        </div>
      </div>

      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{competition.raceName} – Race Plan</h1>
        <p className="text-gray-500 text-sm mt-1">
          {cfg.label} &middot; {competition.raceData.distance} {competition.raceData.distanceUnit} &middot; {durationLabel} &middot; {competition.raceData.temperature}°C
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Intensity" value={`${output.pacing.intensityPercent}%`} unit="VO2" color="text-orange-400" />
        <StatCard label="Carbs" value={output.carbs.recommendedIntakeGH} unit="g/h" color="text-yellow-400" />
        <StatCard label="Fluid" value={output.hydration.fluidIntakeLH} unit="L/h" color="text-blue-400" />
        <StatCard label="Sodium" value={output.hydration.sodiumMgH} unit="mg/h" color="text-teal-400" />
      </div>

      <div className="mb-4">
        <RaceCourseView raceData={competition.raceData} catalogEntry={catalogEntry} />
      </div>

      <div className="mb-4">
        <NutritionPlanCustomizer competition={competition} onChange={setNutritionPlan} />
      </div>

      <div className="space-y-4">
        <Section icon={Gauge} title="Pacing Strategy" color="from-orange-500 to-red-500">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Target Pace</div>
              <div className="text-xl font-bold text-white">{formatPace(output.pacing.estimatedPaceMinKm)} <span className="text-sm text-gray-500">min/km</span></div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Intensity Zone</div>
              <div className="text-sm font-semibold text-orange-300">{output.pacing.intensityZone}</div>
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Recommendation</div>
            <p className="text-gray-300 text-sm leading-relaxed">{output.pacing.recommendation}</p>
          </div>
        </Section>

        <Section icon={Flame} title="Carbohydrate Strategy" color="from-yellow-500 to-orange-500">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Est. Use</div>
              <div className="text-xl font-bold text-white">{output.carbs.estimatedCarbUseGMin} <span className="text-xs text-gray-500">g/min</span></div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Target Intake</div>
              <div className="text-xl font-bold text-yellow-300">{output.carbs.recommendedIntakeGH} <span className="text-xs text-gray-500">g/h</span></div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Total Carbs</div>
              <div className="text-xl font-bold text-white">{output.carbs.totalCarbsG} <span className="text-xs text-gray-500">g</span></div>
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Sources</div>
            <ul className="space-y-2">
              {output.carbs.sources.map((source, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                  {source}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Timing Protocol</div>
            <p className="text-gray-300 text-sm leading-relaxed">{output.carbs.timing}</p>
          </div>
        </Section>

        <Section icon={Droplets} title="Hydration & Sodium" color="from-blue-500 to-cyan-500">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Sweat Rate</div>
              <div className="text-xl font-bold text-white">{output.hydration.sweatRateLH} <span className="text-xs text-gray-500">L/h</span></div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Intake</div>
              <div className="text-xl font-bold text-blue-300">{output.hydration.fluidIntakeLH} <span className="text-xs text-gray-500">L/h</span></div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Total Fluid</div>
              <div className="text-xl font-bold text-white">{output.hydration.totalFluidL} <span className="text-xs text-gray-500">L</span></div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Mass Loss</div>
              <div className={`text-xl font-bold ${output.hydration.projectedMassLossPct > 2 ? 'text-red-400' : 'text-white'}`}>
                {output.hydration.projectedMassLossPct}<span className="text-xs text-gray-500">%</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Sodium Target</div>
              <div className="text-lg font-bold text-teal-300">
                {output.hydration.sodiumMgH} mg/h <span className="text-sm text-gray-500">({output.hydration.totalSodiumMg} mg total)</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Per 500mL bottle</div>
              <div className="text-sm font-semibold text-gray-300">~{Math.round(output.hydration.sodiumMgH * 0.5)} mg</div>
            </div>
          </div>
        </Section>

        {output.caffeine.totalMg > 0 && (
          <Section icon={Coffee} title="Caffeine Plan" color="from-amber-600 to-yellow-600" defaultOpen={false}>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Total Dose</div>
                <div className="text-xl font-bold text-amber-300">{output.caffeine.totalMg} <span className="text-xs text-gray-500">mg</span></div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Per kg</div>
                <div className="text-xl font-bold text-white">{output.caffeine.mgPerKg} <span className="text-xs text-gray-500">mg/kg</span></div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Pre-Race Dose</div>
                <div className="text-xl font-bold text-white">{output.caffeine.preDoseMg} <span className="text-xs text-gray-500">mg</span></div>
              </div>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Dosing Schedule</div>
              <ul className="space-y-2">
                {output.caffeine.sources.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-200/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            {output.caffeine.notes && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-xs text-amber-300/80 leading-relaxed">{output.caffeine.notes}</p>
              </div>
            )}
          </Section>
        )}

        <Section icon={UtensilsCrossed} title="Pre-Competition Nutrition" color="from-teal-500 to-cyan-600" defaultOpen={false} badge={`${output.preComp.choLoadingDays > 0 ? `${output.preComp.choLoadingDays}-day CHO load` : 'Pre-race meal'}`}>
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 mb-2">
            <p className="text-sm text-teal-200/80 leading-relaxed">{output.preComp.notes}</p>
          </div>
          {output.preComp.plan.map((day) => (
            <div key={day.dayLabel} className="bg-gray-800/30 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-gray-800/60 border-b border-gray-700/60">
                <div>
                  <span className="font-bold text-white text-sm">{day.dayLabel}</span>
                  <span className="text-xs text-gray-500 ml-3">{day.carbsGkg}g CHO/kg</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span><span className="font-semibold text-yellow-300">{day.totalCarbsG}g</span> carbs</span>
                  <span><span className="font-semibold text-blue-300">{day.proteinG}g</span> protein</span>
                  <span className="hidden sm:inline"><span className="font-semibold text-gray-300">{day.totalKcal}</span> kcal</span>
                </div>
              </div>
              <div className="px-5 py-2">
                {day.meals.map((meal, mi) => (
                  <MealRow key={mi} timing={meal.timing} description={meal.description} carbsG={meal.carbsG} />
                ))}
              </div>
              <div className="px-5 py-3 border-t border-gray-800/60">
                <p className="text-xs text-gray-600 leading-relaxed">{day.notes}</p>
              </div>
            </div>
          ))}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Race Morning Breakfast</div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-teal-400 font-semibold mb-1">{output.preComp.raceBreakfast.timingBeforeStart}</div>
                <p className="text-sm text-gray-300 leading-relaxed">{output.preComp.raceBreakfast.description}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-xl font-bold text-yellow-300">{output.preComp.raceBreakfast.carbsG}g</div>
                <div className="text-xs text-gray-600">carbs</div>
              </div>
            </div>
          </div>
        </Section>

        {output.giTraining && (
          <Section icon={Brain} title={`GI Training Protocol – ${output.giTraining.weeks} Weeks`} color="from-rose-500 to-pink-600" defaultOpen={false} badge={`Target: ${output.giTraining.targetGH}g/h`}>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
              <p className="text-sm text-rose-200/80 leading-relaxed">{output.giTraining.notes}</p>
            </div>
            <div className="space-y-3">
              {output.giTraining.sessions.map((s) => (
                <div key={s.week} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-xs font-bold text-rose-300">
                        W{s.week}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{s.intakeGH}g/h CHO</div>
                        <div className="text-xs text-gray-500">{s.duration} &middot; {s.fluidMlH}mL/h fluid</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-1 font-medium">{s.format}</div>
                  <div className="text-xs text-gray-600 leading-relaxed">{s.notes}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {editablePlan && (
          <Section icon={ClipboardList} title="Race Execution Plan" color="from-sky-500 to-blue-600" defaultOpen={false} badge="editable">
            <EditableSegmentTable
              segments={editablePlan.segments}
              onChange={(segments) => setEditablePlan((p) => p ? { ...p, segments } : p)}
            />
          </Section>
        )}

        {editablePlan && (
          <Section icon={FileText} title="Athlete Notes & Reminders" color="from-gray-500 to-gray-600" defaultOpen={false} badge="editable · exported to PDF">
            <EditableRecommendationsPanel
              recommendations={editablePlan.recommendations}
              onChange={(recommendations) => setEditablePlan((p) => p ? { ...p, recommendations } : p)}
              hasCaffeine={output.caffeine.totalMg > 0}
            />
          </Section>
        )}

        <Section
          icon={AlertTriangle}
          title={`Risk Analysis`}
          color={output.risks.some((r) => r.level === 'critical') ? 'from-red-500 to-rose-600' : output.risks.length > 0 ? 'from-amber-500 to-yellow-500' : 'from-green-500 to-emerald-600'}
          badge={`${output.risks.length} flag${output.risks.length !== 1 ? 's' : ''}`}
        >
          {output.risks.length === 0 ? (
            <div className="flex items-center gap-3 text-green-400 bg-green-500/10 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">No significant risk factors identified. Good to go!</span>
            </div>
          ) : (
            <div className="space-y-3">
              {output.risks.map((risk, i) => (
                <div key={i} className={`flex items-start gap-3 rounded-xl p-4 ${risk.level === 'critical' ? 'bg-red-500/10 border border-red-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
                  {risk.level === 'critical' ? (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm leading-relaxed ${risk.level === 'critical' ? 'text-red-300' : 'text-amber-300'}`}>{risk.message}</p>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      {showLiveMode && (
        <LiveRaceMode
          competition={competition}
          nutritionPlan={nutritionPlan}
          hydrationStations={hydrationStations}
          onClose={() => setShowLiveMode(false)}
        />
      )}
    </div>
  );
}
