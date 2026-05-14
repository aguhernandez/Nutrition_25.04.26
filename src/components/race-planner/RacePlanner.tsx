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
