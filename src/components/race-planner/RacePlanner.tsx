import { useState } from 'react';
import type {
  Sport,
  RaceData,
  AthleteData,
  StrategyPreferences,
  Competition,
  RaceCatalogEntry,
} from '../../types/race';
import { calculateRaceStrategy } from '../../engine/raceCalculationEngine';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { pushRacePlan } from '../../lib/hubApi';
import { buildSegments } from '../../utils/generatePrintPlan';
import type { StrategyOutput } from '../../types/race';
import SportSelector from './SportSelector';
import Questionnaire from './questionnaire/Questionnaire';
import ResultsDashboard from './results/ResultsDashboard';
import PostRaceFeedback from './PostRaceFeedback';
import { setTagsForCompetition, syncAthleteTagsToHub } from '../../lib/tagService';
import type { Tag } from '../../lib/tagService';
import TagSelector from '../shared/TagSelector';

type PlannerStep = 'sport' | 'questionnaire' | 'results';

export default function RacePlanner() {
  const { user, profile } = useAuth();
  const [step, setStep] = useState<PlannerStep>('sport');
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [catalogEntry, setCatalogEntry] = useState<RaceCatalogEntry | undefined>(undefined);
  const [raceTags, setRaceTags] = useState<Tag[]>([]);

  const handleSportSelect = (sport: Sport) => {
    setSelectedSport(sport);
    setStep('questionnaire');
  };

  const handleQuestionnaire = async (
    raceData: RaceData,
    athleteData: AthleteData,
    strategy: StrategyPreferences,
    entry?: RaceCatalogEntry
  ) => {
    setCatalogEntry(entry);
    const sport = selectedSport!;
    const output = calculateRaceStrategy(sport, raceData, athleteData, strategy);
    const comp: Competition = {
      sport,
      raceName: raceData.raceName,
      raceData,
      athleteData,
      strategyPreferences: strategy,
      strategyOutput: output,
      raceDate: raceData.raceDate,
    };
    setCompetition(comp);
    setStep('results');
  };

  const handleSave = async () => {
    if (!competition) return;
    const athleteId = profile?.hub_user_id || user?.id || null;

    // 1. Save to Supabase
    const { data, error } = await supabase
      .from('competitions')
      .insert({
        user_id: null,
        athlete_id: athleteId,
        sport: competition.sport,
        race_name: competition.raceName,
        race_data: competition.raceData,
        athlete_data: competition.athleteData,
        strategy_preferences: competition.strategyPreferences,
        strategy_output: competition.strategyOutput,
        race_date: competition.raceDate || null,
      })
      .select('id')
      .maybeSingle();
    if (error) console.error('Save race error:', error);

    if (data?.id) {
      setSavedId(data.id);
      if (raceTags.length > 0) {
        await setTagsForCompetition(data.id, raceTags.map((t) => t.id));
      }
      if (profile?.email && profile?.id) {
        syncAthleteTagsToHub(profile.email, profile.id);
      }
    }

    // 2. Push to Hub (fire-and-forget, non-blocking)
    const athleteEmail = profile?.email || user?.email;
    if (athleteEmail) {
      buildAndPushRacePlanToHub(athleteEmail, competition).catch((e) =>
        console.error('Hub race plan push failed:', e)
      );
    }
  };

  const buildAndPushRacePlanToHub = async (
    athleteEmail: string,
    comp: typeof competition
  ) => {
    if (!comp) return;
    const output = comp.strategyOutput as StrategyOutput;
    const distKm = comp.raceData.distanceUnit === 'miles'
      ? comp.raceData.distance * 1.60934
      : comp.raceData.distance;

    const segments = buildSegments(comp, output);

    await pushRacePlan(athleteEmail, {
      race_name: comp.raceName,
      sport: comp.sport,
      race_date: comp.raceDate || null,
      distance_km: Math.round(distKm * 10) / 10,
      expected_duration_min: comp.raceData.expectedDurationMin,
      temperature_c: comp.raceData.temperature,
      humidity_pct: comp.raceData.humidity,
      altitude_m: comp.raceData.altitude,

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
      athlete_notes: {},
      generated_at: output.generatedAt,
      plan_version: '2.0',
    });
  };

  const handleNewRace = () => {
    setStep('sport');
    setSelectedSport(null);
    setCompetition(null);
    setSavedId(null);
    setShowFeedback(false);
    setCatalogEntry(undefined);
    setRaceTags([]);
  };

  return (
    <div className="min-h-full">
      {step === 'sport' && <SportSelector onSelect={handleSportSelect} />}

      {step === 'questionnaire' && selectedSport && (
        <Questionnaire
          sport={selectedSport}
          onBack={() => setStep('sport')}
          onSubmit={handleQuestionnaire}
        />
      )}

      {step === 'results' && competition && (
        <div className="px-4 sm:px-6 py-4">
          <ResultsDashboard
            competition={competition}
            catalogEntry={catalogEntry}
            onSave={handleSave}
            onNewRace={handleNewRace}
          />
          {!savedId && (
            <div className="mt-4 mb-2">
              <TagSelector
                selectedTags={raceTags}
                onChange={setRaceTags}
                label="Tags for this race plan"
                placeholder="Add tags before saving..."
              />
            </div>
          )}
          {savedId && !showFeedback && (
            <div
              className="mt-4 mb-10 bg-white border-2 border-[#e5e7eb] rounded-2xl p-5 flex items-center justify-between"
              style={{ boxShadow: '0 2px 8px rgba(81,65,99,0.06)' }}
            >
              <div>
                <p className="font-body font-semibold text-[#1f2937] text-sm">Race completed?</p>
                <p className="font-body text-xs text-[#9ca3af] mt-0.5">
                  Add post-race feedback to improve future plans
                </p>
              </div>
              <button
                onClick={() => setShowFeedback(true)}
                className="btn-primary"
              >
                Add Feedback
              </button>
            </div>
          )}
          {showFeedback && savedId && (
            <div className="mt-4 mb-10">
              <PostRaceFeedback
                competitionId={savedId}
                raceName={competition.raceName}
                onClose={() => setShowFeedback(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
