import { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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
import SportSelector from './SportSelector';
import Questionnaire from './questionnaire/Questionnaire';
import ResultsDashboard from './results/ResultsDashboard';
import PostRaceFeedback from './PostRaceFeedback';
import { setTagsForCompetition, syncAthleteTagsToHub } from '../../lib/tagService';
import type { Tag } from '../../lib/tagService';
import TagSelector from '../shared/TagSelector';
import CoachRaceAthleteSelector from './CoachRaceAthleteSelector';
import type { RaceAthlete } from './CoachRaceAthleteSelector';
import { pushRacePlan } from '../../lib/hubApi';
import type { HubRacePlanPayload } from '../../lib/hubApi';
import {
  createRaceAssignment,
  markRaceAssignmentEdited,
  getAssignmentForCompetition,
} from '../../lib/raceAssignmentService';

type PlannerStep = 'sport' | 'questionnaire' | 'results';

interface Props {
  initialCompetition?: Competition;
  onBackToSaved?: () => void;
  targetAthleteId?: string;
  targetAthleteEmail?: string;
  targetAthleteName?: string;
  isCoachContext?: boolean;
}

function buildRacePlanPayload(competition: Competition): HubRacePlanPayload {
  const out = competition.strategyOutput;
  const rd = competition.raceData;
  const ad = competition.athleteData;
  const sp = competition.strategyPreferences;

  return {
    race_name: competition.raceName,
    sport: competition.sport,
    race_date: competition.raceDate ?? rd.raceDate ?? null,
    distance_km: rd.distanceUnit === 'miles' ? rd.distance * 1.609 : rd.distance,
    expected_duration_min: rd.expectedDurationMin,
    temperature_c: rd.temperature,
    humidity_pct: rd.humidity,
    altitude_m: rd.altitude,
    intensity_percent: out?.pacing?.intensityPercent ?? 0,
    intensity_zone: out?.pacing?.intensityZone ?? '',
    target_pace_min_km: out?.pacing?.estimatedPaceMinKm ?? 0,
    pacing_recommendation: out?.pacing?.recommendation ?? '',
    carbs_g_per_hour: out?.carbs?.recommendedIntakeGH ?? 0,
    total_carbs_g: out?.carbs?.totalCarbsG ?? 0,
    carb_sources: out?.carbs?.sources ?? [],
    carb_timing: out?.carbs?.timing ?? '',
    fluid_l_per_hour: out?.hydration?.fluidIntakeLH ?? 0,
    total_fluid_l: out?.hydration?.totalFluidL ?? 0,
    sodium_mg_per_hour: out?.hydration?.sodiumMgH ?? 0,
    total_sodium_mg: out?.hydration?.totalSodiumMg ?? 0,
    sweat_rate_l_per_hour: out?.hydration?.sweatRateLH ?? 0,
    projected_mass_loss_pct: out?.hydration?.projectedMassLossPct ?? 0,
    caffeine_total_mg: out?.caffeine?.totalMg ?? 0,
    caffeine_mg_per_kg: out?.caffeine?.mgPerKg ?? 0,
    caffeine_pre_dose_mg: out?.caffeine?.preDoseMg ?? 0,
    caffeine_pre_dose_min_before_start: out?.caffeine?.preDoseMinBeforeStart ?? 0,
    caffeine_mid_race_doses: out?.caffeine?.midRaceDoses ?? [],
    caffeine_sources: out?.caffeine?.sources ?? [],
    caffeine_notes: out?.caffeine?.notes ?? '',
    segments: [],
    pre_comp_notes: out?.preComp?.notes ?? '',
    cho_loading_days: out?.preComp?.choLoadingDays ?? sp.preCompDays,
    pre_comp_days: (out?.preComp?.plan ?? []).map((d) => ({
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
    race_breakfast_timing: out?.preComp?.raceBreakfast?.timingBeforeStart ?? '',
    race_breakfast_description: out?.preComp?.raceBreakfast?.description ?? '',
    race_breakfast_carbs_g: out?.preComp?.raceBreakfast?.carbsG ?? 0,
    gi_training_weeks: out?.giTraining?.weeks ?? null,
    gi_training_target_g_per_hour: out?.giTraining?.targetGH ?? null,
    gi_training_notes: out?.giTraining?.notes ?? null,
    gi_sessions: (out?.giTraining?.sessions ?? []).map((s) => ({
      week: s.week,
      intake_g_per_hour: s.intakeGH,
      duration: s.duration,
      format: s.format,
      notes: s.notes,
    })),
    risks: (out?.risks ?? []).map((r) => ({
      level: r.level,
      message: r.message,
    })),
    athlete_notes: {
      pacing: '',
      carbs: '',
      hydration: '',
      caffeine: '',
      general: '',
    },
    generated_at: out?.generatedAt ?? new Date().toISOString(),
    plan_version: '1.0',
  };
}

export default function RacePlanner({
  initialCompetition,
  onBackToSaved,
  targetAthleteId,
  targetAthleteEmail,
  targetAthleteName,
  isCoachContext = false,
}: Props = {}) {
  const { user, profile } = useAuth();
  const [step, setStep] = useState<PlannerStep>(initialCompetition ? 'results' : 'sport');
  const [selectedSport, setSelectedSport] = useState<Sport | null>(initialCompetition?.sport ?? null);
  const [competition, setCompetition] = useState<Competition | null>(initialCompetition ?? null);
  const [savedId, setSavedId] = useState<string | null>(initialCompetition?.id ?? null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [catalogEntry, setCatalogEntry] = useState<RaceCatalogEntry | undefined>(undefined);
  const [raceTags, setRaceTags] = useState<Tag[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<RaceAthlete | null>(
    isCoachContext && targetAthleteId
      ? {
          id: targetAthleteId,
          email: targetAthleteEmail ?? '',
          full_name: targetAthleteName ?? '',
          hub_user_id: targetAthleteId,
          hasLocalProfile: true,
        }
      : null,
  );
  const [pushingToHub, setPushingToHub] = useState(false);
  const [pushResult, setPushResult] = useState<'success' | 'error' | null>(null);

  const effectiveAthleteId = selectedAthlete?.hub_user_id || selectedAthlete?.id || targetAthleteId || profile?.hub_user_id || user?.id || null;
  const effectiveAthleteEmail = selectedAthlete?.email || targetAthleteEmail || profile?.email || null;
  const effectiveAthleteName = selectedAthlete?.full_name || targetAthleteName || profile?.full_name || '';
  const isCoach = isCoachContext || (profile?.role === 'coach' || profile?.role === 'admin');

  const handleSportSelect = (sport: Sport) => {
    setSelectedSport(sport);
    setStep('questionnaire');
  };

  const handleQuestionnaire = async (
    raceData: RaceData,
    athleteData: AthleteData,
    strategy: StrategyPreferences,
    entry?: RaceCatalogEntry,
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
    const athleteId = effectiveAthleteId;

    if (savedId) {
      const { error } = await supabase
        .from('competitions')
        .update({
          sport: competition.sport,
          race_name: competition.raceName,
          race_data: competition.raceData,
          athlete_data: competition.athleteData,
          strategy_preferences: competition.strategyPreferences,
          strategy_output: competition.strategyOutput,
          race_date: (competition.raceData.raceDate || competition.raceDate || '').trim() || null,
        })
        .eq('id', savedId);
      if (error) console.error('Update race error:', error);

      if (isCoach && selectedAthlete) {
        const existing = await getAssignmentForCompetition(savedId);
        if (existing) {
          await markRaceAssignmentEdited(savedId, competition.raceName, profile?.full_name || 'Coach');
        }
      }
    } else {
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
          race_date: (competition.raceData.raceDate || competition.raceDate || '').trim() || null,
        })
        .select('id')
        .maybeSingle();
      if (error) console.error('Save race error:', error);
      if (data?.id) {
        setSavedId(data.id);
        if (raceTags.length > 0) {
          await setTagsForCompetition(data.id, raceTags.map((t) => t.id));
        }
        if (effectiveAthleteEmail && profile?.id) {
          syncAthleteTagsToHub(effectiveAthleteEmail, profile.id);
        }

        if (isCoach && selectedAthlete) {
          await createRaceAssignment({
            competitionId: data.id,
            coachId: profile?.hub_user_id || user?.id || '',
            coachName: profile?.full_name || 'Coach',
            athleteId: selectedAthlete.hub_user_id || selectedAthlete.id,
            athleteEmail: selectedAthlete.email,
            raceName: competition.raceName,
          });
        }
      }
    }
  };

  const handleSendToCalendar = async () => {
    if (!competition || !savedId) return;
    if (!effectiveAthleteEmail && !effectiveAthleteId) return;

    setPushingToHub(true);
    setPushResult(null);

    try {
      const pushTarget = effectiveAthleteEmail ?? effectiveAthleteId!;
      const payload = buildRacePlanPayload(competition);
      await pushRacePlan(pushTarget, payload);
      setPushResult('success');
      setTimeout(() => setPushResult(null), 4000);
    } catch (err) {
      console.error('[RacePlanner] Send to Calendar error:', err);
      setPushResult('error');
      setTimeout(() => setPushResult(null), 5000);
    } finally {
      setPushingToHub(false);
    }
  };

  const handleNewRace = () => {
    if (onBackToSaved) {
      onBackToSaved();
      return;
    }
    setStep('sport');
    setSelectedSport(null);
    setCompetition(null);
    setSavedId(null);
    setShowFeedback(false);
    setCatalogEntry(undefined);
    setRaceTags([]);
    setPushResult(null);
  };

  return (
    <div className="min-h-full">
      {isCoach && step !== 'sport' && (
        <CoachRaceAthleteSelector
          selectedAthlete={selectedAthlete}
          onSelect={setSelectedAthlete}
          onClear={() => setSelectedAthlete(null)}
        />
      )}

      {step === 'sport' && (
        <>
          {isCoach && (
            <CoachRaceAthleteSelector
              selectedAthlete={selectedAthlete}
              onSelect={setSelectedAthlete}
              onClear={() => setSelectedAthlete(null)}
            />
          )}
          <SportSelector onSelect={handleSportSelect} />
        </>
      )}

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
            hideSendToHub={isCoach}
            onSendToHubResult={(status) => {
              setPushResult(status);
              setTimeout(() => setPushResult(null), 4000);
            }}
            coachSendBanner={isCoach && savedId && selectedAthlete ? (
              <div
                className="mt-4 mb-2 rounded-2xl p-5 flex items-center justify-between"
                style={{ backgroundColor: '#f0fdf4', border: '2px solid #bbf7d0' }}
              >
                <div>
                  <p className="font-body font-semibold text-sm" style={{ color: '#14532d' }}>
                    {pushResult === 'success'
                      ? `Carrera enviada al calendario de ${selectedAthlete.full_name}`
                      : pushResult === 'error'
                        ? 'Error al enviar. Intenta de nuevo.'
                        : `Enviar al calendario de ${selectedAthlete.full_name}`}
                  </p>
                  <p className="font-body text-xs mt-0.5" style={{ color: '#15803d' }}>
                    {pushResult === 'success'
                      ? 'El atleta vera esta carrera en su calendario.'
                      : 'El atleta recibira la carrera en su Hub.'}
                  </p>
                </div>
                {pushResult === 'success' ? (
                  <CheckCircle2 className="w-6 h-6" style={{ color: '#16a34a' }} />
                ) : pushResult === 'error' ? (
                  <AlertCircle className="w-6 h-6" style={{ color: '#dc2626' }} />
                ) : (
                  <button
                    onClick={handleSendToCalendar}
                    disabled={pushingToHub}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-bold text-sm transition-all"
                    style={{
                      backgroundColor: pushingToHub ? '#86efac' : '#16a34a',
                      color: '#fff',
                      cursor: pushingToHub ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {pushingToHub ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send to Calendar</>
                    )}
                  </button>
                )}
              </div>
            ) : null}
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

          {isCoach && savedId && selectedAthlete && (
            <div
              className="mt-4 mb-6 rounded-2xl p-5 flex items-center justify-between"
              style={{ backgroundColor: '#f0fdf4', border: '2px solid #bbf7d0' }}
            >
              <div>
                <p className="font-body font-semibold text-sm" style={{ color: '#14532d' }}>
                  {pushResult === 'success'
                    ? `Carrera enviada al calendario de ${selectedAthlete.full_name}`
                    : pushResult === 'error'
                      ? 'Error al enviar. Intenta de nuevo.'
                      : `Enviar al calendario de ${selectedAthlete.full_name}`}
                </p>
                <p className="font-body text-xs mt-0.5" style={{ color: '#15803d' }}>
                  {pushResult === 'success'
                    ? 'El atleta vera esta carrera en su calendario.'
                    : 'El atleta recibira la carrera en su Hub.'}
                </p>
              </div>
              {pushResult === 'success' ? (
                <CheckCircle2 className="w-6 h-6" style={{ color: '#16a34a' }} />
              ) : pushResult === 'error' ? (
                <AlertCircle className="w-6 h-6" style={{ color: '#dc2626' }} />
              ) : (
                <button
                  onClick={handleSendToCalendar}
                  disabled={pushingToHub}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-bold text-sm transition-all"
                  style={{
                    backgroundColor: pushingToHub ? '#86efac' : '#16a34a',
                    color: '#fff',
                    cursor: pushingToHub ? 'not-allowed' : 'pointer',
                  }}
                >
                  {pushingToHub ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send to Calendar</>
                  )}
                </button>
              )}
            </div>
          )}

          {!isCoach && pushResult && (
            <div
              className="mt-4 mb-6 rounded-2xl p-5 flex items-center gap-3"
              style={{
                backgroundColor: pushResult === 'success' ? '#f0fdf4' : '#fef2f2',
                border: `2px solid ${pushResult === 'success' ? '#bbf7d0' : '#fecaca'}`,
              }}
            >
              {pushResult === 'success' ? (
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: '#16a34a' }} />
              ) : (
                <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#dc2626' }} />
              )}
              <div>
                <p className="font-body font-semibold text-sm" style={{ color: pushResult === 'success' ? '#14532d' : '#991b1b' }}>
                  {pushResult === 'success'
                    ? 'Carrera enviada a tu calendario'
                    : 'Error al enviar. Intenta de nuevo.'}
                </p>
                {pushResult === 'success' && (
                  <p className="font-body text-xs mt-0.5" style={{ color: '#15803d' }}>
                    La carrera aparecera en tu calendario del Hub.
                  </p>
                )}
              </div>
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
