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
  Send,
  AlertCircle,
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
import { generateHydrationStations, generateElevationProfile } from '../../../utils/elevationGenerator';
import { usePreferences } from '../../../lib/preferences';
import { useAuth } from '../../../lib/auth';
import { pushRacePlan } from '../../../lib/hubApi';

interface Props {
  competition: Competition;
  catalogEntry?: RaceCatalogEntry;
  onSave: () => Promise<void>;
  onNewRace: () => void;
}

function StatCard({ label, value, unit, color, isDark }: { label: string; value: string | number; unit?: string; color: string; isDark: boolean }) {
  return (
    <div
      className="rounded-xl p-4 transition-colors"
      style={{
        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '2px solid #e5e7eb',
        boxShadow: isDark ? 'none' : '0 1px 4px rgba(81,65,99,0.05)',
      }}
    >
      <div className={`text-xs font-body font-semibold uppercase tracking-wider mb-1 ${color}`}>{label}</div>
      <div className="flex items-baseline gap-1">
        <span className={`font-heading text-2xl ${isDark ? 'text-white' : 'text-[#1f2937]'}`}>{value}</span>
        {unit && <span className={`font-body text-sm ${isDark ? 'text-gray-400' : 'text-[#9ca3af]'}`}>{unit}</span>}
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
  isDark,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  isDark: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-2xl overflow-hidden print:border print:border-gray-300 print:break-inside-avoid transition-colors"
      style={{
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '2px solid #e5e7eb',
        boxShadow: isDark ? 'none' : '0 2px 10px rgba(81,65,99,0.06)',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-6 py-4 transition-colors print:pointer-events-none ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-[#fafafa]'}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className={`font-body font-semibold ${isDark ? 'text-white' : 'text-[#1f2937]'}`}>{title}</span>
          {badge && (
            <span
              className="font-body text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : '#f3f4f6',
                color: isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af',
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <div className="print:hidden">
          {open
            ? <ChevronUp className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-[#9ca3af]'}`} />
            : <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-[#9ca3af]'}`} />
          }
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

function MealRow({ timing, description, carbsG, isDark }: { timing: string; description: string; carbsG: number; isDark: boolean }) {
  return (
    <div className={`flex items-start gap-3 py-3 last:border-0 ${isDark ? 'border-b border-white/5' : 'border-b border-gray-100'}`}>
      <div className={`flex-shrink-0 w-28 text-xs font-semibold pt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{timing}</div>
      <div className={`flex-1 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{description}</div>
      <div className="flex-shrink-0 text-right">
        <span className="text-sm font-bold text-yellow-500">{carbsG}g</span>
        <span className={`text-xs block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>carbs</span>
      </div>
    </div>
  );
}

function InfoCard({ children, isDark, className = '' }: { children: React.ReactNode; isDark: boolean; className?: string }) {
  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
        border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb',
      }}
    >
      {children}
    </div>
  );
}

function Label({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
  return (
    <div className={`text-xs mb-1 uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
      {children}
    </div>
  );
}

type HubPushStatus = 'idle' | 'pushing' | 'success' | 'error';

export default function ResultsDashboard({ competition, catalogEntry, onSave, onNewRace }: Props) {
  const { theme, language } = usePreferences();
  const { user, profile } = useAuth();
  const isDark = theme === 'dark';

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editablePlan, setEditablePlan] = useState<EditablePlan | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<RaceNutritionPlan | undefined>(undefined);
  const [hydrationStations, setHydrationStations] = useState<HydrationStation[]>([]);
  const [hubPushStatus, setHubPushStatus] = useState<HubPushStatus>('idle');
  const [hubPushError, setHubPushError] = useState<string | null>(null);

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

  const handleSendToHub = async () => {
    const athleteEmail = profile?.email || user?.email;
    if (!athleteEmail) {
      setHubPushError('No athlete email found. Make sure you are logged in.');
      setHubPushStatus('error');
      return;
    }
    setHubPushStatus('pushing');
    setHubPushError(null);
    try {
      const output = competition.strategyOutput as StrategyOutput;
      const distKm = competition.raceData.distanceUnit === 'miles'
        ? competition.raceData.distance * 1.60934
        : competition.raceData.distance;
      const segments = buildSegments(competition, output);

      const raceDateResolved = (competition.raceData.raceDate || competition.raceDate || '').trim() || null;
      console.log('[Hub Push] race_date debug:', {
        'competition.raceDate': competition.raceDate,
        'competition.raceData.raceDate': competition.raceData.raceDate,
        'resolved race_date': raceDateResolved,
      });

      await pushRacePlan(athleteEmail, {
        race_name: competition.raceName,
        sport: competition.sport,
        race_date: raceDateResolved,
        distance_km: Math.round(distKm * 10) / 10,
        expected_duration_min: competition.raceData.expectedDurationMin,
        temperature_c: competition.raceData.temperature,
        humidity_pct: competition.raceData.humidity,
        altitude_m: competition.raceData.altitude,

        intensity_percent: output.pacing.intensityPercent,
        intensity_zone: output.pacing.intensityZone,
        target_pace_min_km: output.pacing.estimatedPaceMinKm,
        pacing_recommendation: output.pacing.recommendation,

        carbs_g_per_hour: output.carbs.recommendedIntakeGH,
        total_carbs_g: output.carbs.totalCarbsG,
        carb_sources: output.carbs.sources,
        carb_timing: output.carbs.timing,

        fluid_l_per_hour: output.hydration.fluidIntakeLH,
        total_fluid_l: output.hydration.totalFluidL,
        sodium_mg_per_hour: output.hydration.sodiumMgH,
        total_sodium_mg: output.hydration.totalSodiumMg,
        sweat_rate_l_per_hour: output.hydration.sweatRateLH,
        projected_mass_loss_pct: output.hydration.projectedMassLossPct,

        caffeine_total_mg: output.caffeine.totalMg,
        caffeine_mg_per_kg: output.caffeine.mgPerKg,
        caffeine_pre_dose_mg: output.caffeine.preDoseMg,
        caffeine_pre_dose_min_before: output.caffeine.preDoseMinBeforeStart,
        caffeine_mid_race_doses: output.caffeine.midRaceDoses.map((d) => ({
          label: d.label,
          timing_min: d.timingMin,
          mg: d.mg,
        })),
        caffeine_sources: output.caffeine.sources,
        caffeine_notes: output.caffeine.notes,

        segments: segments.map((s) => ({
          time_min: s.timeMin,
          distance_km: s.distanceKm,
          cho_g: s.choG,
          fluid_ml: s.fluidMl,
          sodium_mg: s.sodiumMg,
          caffeine_note: s.caffeineNote,
        })),

        pre_comp_notes: output.preComp.notes,
        cho_loading_days: output.preComp.choLoadingDays,
        pre_comp_days: output.preComp.plan.map((d) => ({
          day_label: d.dayLabel,
          carbs_gkg: d.carbsGkg,
          total_carbs_g: d.totalCarbsG,
          protein_g: d.proteinG,
          total_kcal: d.totalKcal,
          meals: d.meals.map((m) => ({
            timing: m.timing,
            description: m.description,
            carbs_g: m.carbsG,
          })),
          notes: d.notes,
        })),
        race_breakfast_timing: output.preComp.raceBreakfast.timingBeforeStart,
        race_breakfast_description: output.preComp.raceBreakfast.description,
        race_breakfast_carbs_g: output.preComp.raceBreakfast.carbsG,

        gi_training_weeks: output.giTraining?.weeks ?? null,
        gi_training_target_g_per_hour: output.giTraining?.targetGH ?? null,
        gi_training_notes: output.giTraining?.notes ?? null,
        gi_sessions: output.giTraining?.sessions.map((s) => ({
          week: s.week,
          intake_g_per_hour: s.intakeGH,
          duration: s.duration,
          format: s.format,
          notes: s.notes,
        })) ?? null,

        risks: output.risks,
        athlete_notes: editablePlan?.recommendations
          ? {
              pacing: editablePlan.recommendations.pacingNote || undefined,
              carbs: editablePlan.recommendations.carbsNote || undefined,
              hydration: editablePlan.recommendations.hydrationNote || undefined,
              caffeine: editablePlan.recommendations.caffeineNote || undefined,
              general: editablePlan.recommendations.generalNotes || undefined,
            }
          : {},
        generated_at: output.generatedAt,
        plan_version: '2.0',
      });
      setHubPushStatus('success');
    } catch (err) {
      setHubPushError(err instanceof Error ? err.message : 'Error sending to Hub');
      setHubPushStatus('error');
    }
  };

  const btnSecondary = isDark
    ? 'bg-white/8 hover:bg-white/12 text-gray-200 border border-white/10'
    : 'bg-gray-100 hover:bg-gray-200 text-gray-700';

  const textPrimary = isDark ? 'text-white' : 'text-[#1f2937]';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 print:px-0 print:py-4">
      <div className="print:hidden flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${cfg.color}`} />
            <span className={`text-xs font-semibold uppercase tracking-wider ${textMuted}`}>{cfg.label}</span>
          </div>
          <h1 className={`text-2xl font-bold ${textPrimary}`}>{competition.raceName}</h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>
            {competition.raceData.distance} {competition.raceData.distanceUnit} &middot; {durationLabel} &middot; {competition.raceData.temperature}°C
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex flex-col gap-1">
            <button
              onClick={handleSendToHub}
              disabled={hubPushStatus === 'pushing' || hubPushStatus === 'success'}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg ${
                hubPushStatus === 'success'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-none'
                  : hubPushStatus === 'error'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-none hover:bg-red-500/30'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-blue-500/20 hover:opacity-90'
              }`}
            >
              {hubPushStatus === 'pushing' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
              ) : hubPushStatus === 'success' ? (
                <><CheckCircle className="w-4 h-4" /> Sent to Hub!</>
              ) : hubPushStatus === 'error' ? (
                <><AlertCircle className="w-4 h-4" /> Retry Send</>
              ) : (
                <><Send className="w-4 h-4" /> {language === 'es' ? 'Enviar al Hub' : 'Send to Hub'}</>
              )}
            </button>
            {hubPushStatus === 'error' && hubPushError && (
              <p className="text-xs text-red-400 px-1">{hubPushError}</p>
            )}
          </div>
          <button
            onClick={handleFullReport}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${btnSecondary}`}
          >
            <FileText className="w-4 h-4" /> Full Report PDF
          </button>
          <button
            onClick={handleCueCard}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${btnSecondary}`}
          >
            <ClipboardList className="w-4 h-4" /> Print Cue Card
          </button>
          <button
            onClick={onNewRace}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${btnSecondary}`}
          >
            New Race
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${saved ? 'bg-green-500/20 text-green-500 border border-green-500/30' : `bg-gradient-to-r ${cfg.color} text-white hover:opacity-90`}`}
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
        <StatCard label="Intensity" value={`${output.pacing.intensityPercent}%`} unit="VO2" color="text-orange-400" isDark={isDark} />
        <StatCard label="Carbs" value={output.carbs.recommendedIntakeGH} unit="g/h" color="text-yellow-500" isDark={isDark} />
        <StatCard label="Fluid" value={output.hydration.fluidIntakeLH} unit="L/h" color="text-blue-400" isDark={isDark} />
        <StatCard label="Sodium" value={output.hydration.sodiumMgH} unit="mg/h" color="text-teal-400" isDark={isDark} />
      </div>

      <div className="mb-4">
        <RaceCourseView raceData={competition.raceData} catalogEntry={catalogEntry} />
      </div>

      <div className="mb-4">
        <NutritionPlanCustomizer competition={competition} onChange={setNutritionPlan} />
      </div>

      <div className="space-y-4">
        {/* Pacing */}
        <Section icon={Gauge} title="Pacing Strategy" color="from-orange-500 to-red-500" isDark={isDark}>
          <div className="grid grid-cols-2 gap-3">
            <InfoCard isDark={isDark}>
              <Label isDark={isDark}>Target Pace</Label>
              <div className={`text-xl font-bold ${textPrimary}`}>
                {formatPace(output.pacing.estimatedPaceMinKm)} <span className={`text-sm ${textMuted}`}>min/km</span>
              </div>
            </InfoCard>
            <InfoCard isDark={isDark}>
              <Label isDark={isDark}>Intensity Zone</Label>
              <div className="text-sm font-semibold text-orange-400">{output.pacing.intensityZone}</div>
            </InfoCard>
          </div>
          <InfoCard isDark={isDark}>
            <Label isDark={isDark}>Recommendation</Label>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{output.pacing.recommendation}</p>
          </InfoCard>
        </Section>

        {/* Carbs */}
        <Section icon={Flame} title="Carbohydrate Strategy" color="from-yellow-500 to-orange-500" isDark={isDark}>
          <div className="grid grid-cols-3 gap-3">
            <InfoCard isDark={isDark}>
              <Label isDark={isDark}>Est. Use</Label>
              <div className={`text-xl font-bold ${textPrimary}`}>{output.carbs.estimatedCarbUseGMin} <span className={`text-xs ${textMuted}`}>g/min</span></div>
            </InfoCard>
            <InfoCard isDark={isDark}>
              <Label isDark={isDark}>Target Intake</Label>
              <div className="text-xl font-bold text-yellow-500">{output.carbs.recommendedIntakeGH} <span className={`text-xs ${textMuted}`}>g/h</span></div>
            </InfoCard>
            <InfoCard isDark={isDark}>
              <Label isDark={isDark}>Total Carbs</Label>
              <div className={`text-xl font-bold ${textPrimary}`}>{output.carbs.totalCarbsG} <span className={`text-xs ${textMuted}`}>g</span></div>
            </InfoCard>
          </div>
          <InfoCard isDark={isDark}>
            <Label isDark={isDark}>Sources</Label>
            <ul className="space-y-2">
              {output.carbs.sources.map((source, i) => (
                <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                  {source}
                </li>
              ))}
            </ul>
          </InfoCard>
          <InfoCard isDark={isDark}>
            <Label isDark={isDark}>Timing Protocol</Label>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{output.carbs.timing}</p>
          </InfoCard>
        </Section>

        {/* Hydration */}
        <Section icon={Droplets} title="Hydration & Sodium" color="from-blue-500 to-cyan-500" isDark={isDark}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Sweat Rate', value: output.hydration.sweatRateLH, unit: 'L/h', color: textPrimary },
              { label: 'Intake', value: output.hydration.fluidIntakeLH, unit: 'L/h', color: 'text-blue-400' },
              { label: 'Total Fluid', value: output.hydration.totalFluidL, unit: 'L', color: textPrimary },
              {
                label: 'Mass Loss',
                value: `${output.hydration.projectedMassLossPct}%`,
                unit: '',
                color: output.hydration.projectedMassLossPct > 2 ? 'text-red-400' : textPrimary,
              },
            ].map((item) => (
              <InfoCard key={item.label} isDark={isDark}>
                <Label isDark={isDark}>{item.label}</Label>
                <div className={`text-xl font-bold ${item.color}`}>{item.value} <span className={`text-xs ${textMuted}`}>{item.unit}</span></div>
              </InfoCard>
            ))}
          </div>
          <InfoCard isDark={isDark} className="flex items-center justify-between">
            <div>
              <Label isDark={isDark}>Sodium Target</Label>
              <div className="text-lg font-bold text-teal-400">
                {output.hydration.sodiumMgH} mg/h <span className={`text-sm ${textSecondary}`}>({output.hydration.totalSodiumMg} mg total)</span>
              </div>
            </div>
            <div className="text-right">
              <Label isDark={isDark}>Per 500mL bottle</Label>
              <div className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>~{Math.round(output.hydration.sodiumMgH * 0.5)} mg</div>
            </div>
          </InfoCard>
        </Section>

        {/* Caffeine */}
        {output.caffeine.totalMg > 0 && (
          <Section icon={Coffee} title="Caffeine Plan" color="from-amber-600 to-yellow-600" defaultOpen={false} isDark={isDark}>
            <div className="grid grid-cols-3 gap-3">
              <InfoCard isDark={isDark}>
                <Label isDark={isDark}>Total Dose</Label>
                <div className="text-xl font-bold text-amber-400">{output.caffeine.totalMg} <span className={`text-xs ${textMuted}`}>mg</span></div>
              </InfoCard>
              <InfoCard isDark={isDark}>
                <Label isDark={isDark}>Per kg</Label>
                <div className={`text-xl font-bold ${textPrimary}`}>{output.caffeine.mgPerKg} <span className={`text-xs ${textMuted}`}>mg/kg</span></div>
              </InfoCard>
              <InfoCard isDark={isDark}>
                <Label isDark={isDark}>Pre-Race Dose</Label>
                <div className={`text-xl font-bold ${textPrimary}`}>{output.caffeine.preDoseMg} <span className={`text-xs ${textMuted}`}>mg</span></div>
              </InfoCard>
            </div>
            <InfoCard isDark={isDark}>
              <Label isDark={isDark}>Dosing Schedule</Label>
              <ul className="space-y-2">
                {output.caffeine.sources.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </InfoCard>
            {output.caffeine.notes && (
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4">
                <p className="text-xs text-amber-400 leading-relaxed">{output.caffeine.notes}</p>
              </div>
            )}
          </Section>
        )}

        {/* Pre-Competition */}
        <Section
          icon={UtensilsCrossed}
          title="Pre-Competition Nutrition"
          color="from-teal-500 to-cyan-600"
          defaultOpen={false}
          badge={`${output.preComp.choLoadingDays > 0 ? `${output.preComp.choLoadingDays}-day CHO load` : 'Pre-race meal'}`}
          isDark={isDark}
        >
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 mb-2">
            <p className="text-sm text-teal-400 leading-relaxed">{output.preComp.notes}</p>
          </div>
          {output.preComp.plan.map((day) => (
            <div
              key={day.dayLabel}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb',
              }}
            >
              <div
                className={`flex items-center justify-between px-5 py-3 border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6' }}
              >
                <div>
                  <span className={`font-bold text-sm ${textPrimary}`}>{day.dayLabel}</span>
                  <span className={`text-xs ml-3 ${textMuted}`}>{day.carbsGkg}g CHO/kg</span>
                </div>
                <div className={`flex items-center gap-4 text-xs ${textSecondary}`}>
                  <span><span className="font-semibold text-yellow-500">{day.totalCarbsG}g</span> carbs</span>
                  <span><span className="font-semibold text-blue-400">{day.proteinG}g</span> protein</span>
                  <span className="hidden sm:inline"><span className={`font-semibold ${textPrimary}`}>{day.totalKcal}</span> kcal</span>
                </div>
              </div>
              <div className="px-5 py-2">
                {day.meals.map((meal, mi) => (
                  <MealRow key={mi} timing={meal.timing} description={meal.description} carbsG={meal.carbsG} isDark={isDark} />
                ))}
              </div>
              <div className={`px-5 py-3 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                <p className={`text-xs leading-relaxed ${textMuted}`}>{day.notes}</p>
              </div>
            </div>
          ))}
          <InfoCard isDark={isDark}>
            <div className={`text-xs uppercase tracking-wider mb-3 ${textMuted}`}>Race Morning Breakfast</div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-teal-400 font-semibold mb-1">{output.preComp.raceBreakfast.timingBeforeStart}</div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{output.preComp.raceBreakfast.description}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-xl font-bold text-yellow-500">{output.preComp.raceBreakfast.carbsG}g</div>
                <div className={`text-xs ${textMuted}`}>carbs</div>
              </div>
            </div>
          </InfoCard>
        </Section>

        {/* GI Training */}
        {output.giTraining && (
          <Section
            icon={Brain}
            title={`GI Training Protocol – ${output.giTraining.weeks} Weeks`}
            color="from-rose-500 to-pink-600"
            defaultOpen={false}
            badge={`Target: ${output.giTraining.targetGH}g/h`}
            isDark={isDark}
          >
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
              <p className="text-sm text-rose-400 leading-relaxed">{output.giTraining.notes}</p>
            </div>
            <div className="space-y-3">
              {output.giTraining.sessions.map((s) => (
                <InfoCard key={s.week} isDark={isDark}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-xs font-bold text-rose-400">
                        W{s.week}
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${textPrimary}`}>{s.intakeGH}g/h CHO</div>
                        <div className={`text-xs ${textMuted}`}>{s.duration} &middot; {s.fluidMlH}mL/h fluid</div>
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs mb-1 font-medium ${textSecondary}`}>{s.format}</div>
                  <div className={`text-xs leading-relaxed ${textMuted}`}>{s.notes}</div>
                </InfoCard>
              ))}
            </div>
          </Section>
        )}

        {/* Race Execution Plan */}
        {editablePlan && (
          <Section icon={ClipboardList} title="Race Execution Plan" color="from-sky-500 to-blue-600" defaultOpen={false} badge="editable" isDark={isDark}>
            <EditableSegmentTable
              segments={editablePlan.segments}
              onChange={(segments) => setEditablePlan((p) => p ? { ...p, segments } : p)}
            />
          </Section>
        )}

        {/* Athlete Notes */}
        {editablePlan && (
          <Section icon={FileText} title="Athlete Notes & Reminders" color="from-gray-500 to-gray-600" defaultOpen={false} badge="editable · exported to PDF" isDark={isDark}>
            <EditableRecommendationsPanel
              recommendations={editablePlan.recommendations}
              onChange={(recommendations) => setEditablePlan((p) => p ? { ...p, recommendations } : p)}
              hasCaffeine={output.caffeine.totalMg > 0}
            />
          </Section>
        )}

        {/* Risk Analysis */}
        <Section
          icon={AlertTriangle}
          title="Risk Analysis"
          color={output.risks.some((r) => r.level === 'critical') ? 'from-red-500 to-rose-600' : output.risks.length > 0 ? 'from-amber-500 to-yellow-500' : 'from-green-500 to-emerald-600'}
          badge={`${output.risks.length} flag${output.risks.length !== 1 ? 's' : ''}`}
          isDark={isDark}
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
                  <p className={`text-sm leading-relaxed ${risk.level === 'critical' ? 'text-red-400' : 'text-amber-400'}`}>{risk.message}</p>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

    </div>
  );
}
