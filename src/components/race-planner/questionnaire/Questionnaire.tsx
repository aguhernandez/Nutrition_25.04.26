import { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import type {
  Sport,
  RaceData,
  AthleteData,
  StrategyPreferences,
  QuestionnaireStep,
  RaceCatalogEntry,
} from '../../../types/race';
import Step1RaceData from './Step1RaceData';
import Step2AthleteData from './Step2AthleteData';
import Step3Strategy from './Step3Strategy';

interface Props {
  sport: Sport;
  onBack: () => void;
  onSubmit: (race: RaceData, athlete: AthleteData, strategy: StrategyPreferences, catalogEntry?: RaceCatalogEntry) => Promise<void>;
}

const defaultRaceData: RaceData = {
  raceName: '', distance: 0, distanceUnit: 'km', elevationGain: 0,
  expectedDurationMin: 0, temperature: 20, humidity: 60, altitude: 0, raceDate: '',
};

const defaultAthleteData: AthleteData = {
  bodyWeightKg: 0, vo2max: 0, thresholdPace: 0, thresholdPower: 0,
  vvo2maxPace: 0, cp: 0, highCarbExperience: 'some', giIssuesHistory: false,
  sweatRateLh: 0, hasSweatRate: false,
};

const defaultStrategy: StrategyPreferences = {
  target: 'finish_strong', caffeineYes: false, gutTrained: false, choType: 'mix',
  preCompDays: 2, trainingVolume: 'moderate', giTrainingWanted: false,
};

const STEP_LABELS = ['Race Details', 'Athlete Profile', 'Strategy'];

export default function Questionnaire({ sport, onBack, onSubmit }: Props) {
  const [step, setStep] = useState<QuestionnaireStep>(1);
  const [raceData, setRaceData] = useState<RaceData>(defaultRaceData);
  const [athleteData, setAthleteData] = useState<AthleteData>(defaultAthleteData);
  const [strategy, setStrategy] = useState<StrategyPreferences>(defaultStrategy);
  const [catalogEntry, setCatalogEntry] = useState<RaceCatalogEntry | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const validateStep = (): boolean => {
    if (step === 1) return raceData.raceName.trim().length > 0 && raceData.distance > 0 && raceData.expectedDurationMin > 0;
    if (step === 2) return athleteData.bodyWeightKg > 0;
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    if (step < 3) {
      setStep((s) => (s + 1) as QuestionnaireStep);
    } else {
      setLoading(true);
      await onSubmit(raceData, athleteData, strategy, catalogEntry);
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as QuestionnaireStep);
    else onBack();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-slide-up">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          {STEP_LABELS.map((label, idx) => {
            const stepNum = (idx + 1) as QuestionnaireStep;
            const active = step === stepNum;
            const done = step > stepNum;
            return (
              <div key={label} className={`flex items-center ${idx < STEP_LABELS.length - 1 ? 'flex-1' : ''}`}>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className="w-7 h-7 rounded-full text-xs font-body font-bold flex items-center justify-center transition-all duration-300"
                    style={
                      done ? { backgroundColor: '#059669', color: '#fff' }
                        : active ? { backgroundColor: '#fdda36', color: '#514163' }
                        : { backgroundColor: '#f3f4f6', color: '#9ca3af' }
                    }
                  >
                    {done ? <CheckCircle className="w-3.5 h-3.5" /> : stepNum}
                  </div>
                  <span
                    className="font-body font-medium text-xs hidden sm:block"
                    style={{ color: active ? '#514163' : done ? '#059669' : '#9ca3af' }}
                  >
                    {label}
                  </span>
                </div>
                {idx < STEP_LABELS.length - 1 && (
                  <div
                    className="flex-1 h-px mx-3 transition-all duration-500"
                    style={{ backgroundColor: done ? '#059669' : '#e5e7eb' }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="h-1.5 bg-[#f3f4f6] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100 + 33}%`, backgroundColor: '#fdda36' }}
          />
        </div>
      </div>

      <div
        className="bg-white rounded-2xl p-6 sm:p-8 min-h-[420px]"
        style={{ border: '2px solid #e5e7eb', boxShadow: '0 4px 16px rgba(81,65,99,0.07)' }}
      >
        {step === 1 && <Step1RaceData sport={sport} data={raceData} onChange={setRaceData} onCatalogSelect={(e) => setCatalogEntry(e ?? undefined)} />}
        {step === 2 && <Step2AthleteData sport={sport} data={athleteData} onChange={setAthleteData} />}
        {step === 3 && <Step3Strategy data={strategy} onChange={setStrategy} />}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-body font-medium text-sm transition-all duration-200 bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={!validateStep() || loading}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-body font-bold text-sm transition-all duration-200"
          style={
            validateStep() && !loading
              ? { backgroundColor: '#fdda36', color: '#514163', boxShadow: '0 2px 10px rgba(253,218,54,0.4)' }
              : { backgroundColor: '#f3f4f6', color: '#d1d5db', cursor: 'not-allowed' }
          }
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Calculating...</>
          ) : step === 3 ? (
            'Generate Plan'
          ) : (
            <>Next <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
