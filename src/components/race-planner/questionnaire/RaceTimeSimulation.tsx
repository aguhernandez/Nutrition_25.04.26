import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Pencil } from 'lucide-react';
import {
  ESTIMATOR_MODEL_VERSION,
  KM_PER_MILE,
  estimateRaceTime,
  type EstimatorCourse,
  type RaceReference,
} from '../../../engine/racePerformanceEstimator';
import type { EstimationMethod } from '../../../types/race';
import { fetchElevationData } from '../../../lib/raceEditorService';
import { fetchRaceReferences } from '../../../lib/raceReferenceService';
import type { ElevationPoint, RaceData, Sport } from '../../../types/race';

interface Props {
  sport: Sport;
  raceData: RaceData;
  athleteId: string | null;
  catalogRaceId?: string;
  onChange: (next: RaceData) => void;
}

const STATE_BADGE = {
  individualized: { label: 'Individualized estimate', color: '#059669', bg: '#ecfdf5' },
  limited: { label: 'Limited estimate', color: '#b45309', bg: '#fffbeb' },
  manual_required: { label: 'Manual target required', color: '#514163', bg: '#f3f4f6' },
};

function formatDuration(totalMin: number): string {
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

function formatPace(minPerKm: number): string {
  const whole = Math.floor(minPerKm);
  const seconds = Math.round((minPerKm - whole) * 60);
  return `${whole}:${String(seconds).padStart(2, '0')} /km`;
}

export default function RaceTimeSimulation({ sport, raceData, athleteId, catalogRaceId, onChange }: Props) {
  const [references, setReferences] = useState<RaceReference[]>([]);
  const [referencesStatus, setReferencesStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [catalogPoints, setCatalogPoints] = useState<ElevationPoint[] | undefined>(undefined);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReferencesStatus('loading');
    fetchRaceReferences(athleteId ?? '', sport, { raceName: raceData.raceName, raceDate: raceData.raceDate })
      .then((rows) => {
        if (cancelled) return;
        setReferences(rows);
        setReferencesStatus('ready');
      })
      .catch((err) => {
        console.error('Could not load race references', err);
        if (cancelled) return;
        setReferences([]);
        setReferencesStatus('error');
      });
    return () => { cancelled = true; };
  }, [athleteId, sport, raceData.raceName, raceData.raceDate]);

  useEffect(() => {
    if (!catalogRaceId) return;
    let cancelled = false;
    fetchElevationData(catalogRaceId)
      .then((points) => { if (!cancelled) setCatalogPoints(points); })
      .catch((err) => console.error('Could not load course profile', err));
    return () => { cancelled = true; };
  }, [catalogRaceId]);

  const estimate = useMemo(() => {
    const course: EstimatorCourse = {
      sport,
      distanceKm: raceData.distanceUnit === 'miles' ? raceData.distance * KM_PER_MILE : raceData.distance,
      elevationGainM: raceData.elevationGain,
      // A manually saved course profile is the source of truth. The catalog
      // profile is only a fallback when there is no manual profile.
      elevationPoints: raceData.elevationPoints?.length ? raceData.elevationPoints : catalogPoints,
      maxAltitudeM: raceData.maxAltitude || raceData.altitude,
    };
    const missingDate = !raceData.raceDate ? ['Enter the race date to use your past races as references.'] : [];
    const result = estimateRaceTime(course, referencesStatus === 'ready' ? references : []);
    return missingDate.length && !result.finishTimeMin ? { ...result, warnings: [...missingDate, ...result.warnings] } : result;
  }, [sport, raceData, catalogPoints, references, referencesStatus]);

  const hasDuration = raceData.expectedDurationMin > 0;
  const source: EstimationMethod | null = !hasDuration
    ? null
    : raceData.estimationMethod && raceData.selectedTargetTimeMin === raceData.expectedDurationMin
      ? raceData.estimationMethod
      : 'manual';

  const hasEstimate = estimate.finishTimeMin !== null;
  const showInputs = editing || !hasEstimate || source === 'manual';
  const badge = STATE_BADGE[estimate.state];
  const hours = hasDuration ? Math.floor(raceData.expectedDurationMin / 60) : '';
  const minutes = hasDuration ? raceData.expectedDurationMin % 60 : '';

  const acceptEstimate = () => {
    if (estimate.finishTimeMin === null) return;
    onChange({
      ...raceData,
      expectedDurationMin: estimate.finishTimeMin,
      selectedTargetTimeMin: estimate.finishTimeMin,
      estimatedFinishTimeMin: estimate.finishTimeMin,
      estimationMethod: estimate.state === 'individualized' ? 'individualized' : 'limited',
      estimationModelVersion: ESTIMATOR_MODEL_VERSION,
      estimationInputsSnapshot: estimate.snapshot,
    });
    setEditing(false);
  };

  const setManualTarget = (totalMin: number) => {
    onChange({
      ...raceData,
      expectedDurationMin: totalMin,
      selectedTargetTimeMin: totalMin,
      estimatedFinishTimeMin: estimate.finishTimeMin,
      estimationMethod: 'manual',
      estimationModelVersion: ESTIMATOR_MODEL_VERSION,
      estimationInputsSnapshot: estimate.snapshot,
    });
  };

  const handleHours = (value: string) => {
    const h = Math.max(0, parseInt(value) || 0);
    setManualTarget(h * 60 + (minutes === '' ? 0 : minutes));
  };

  const handleMinutes = (value: string) => {
    const m = Math.min(59, Math.max(0, parseInt(value) || 0));
    setManualTarget((hours === '' ? 0 : hours) * 60 + m);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-body font-semibold text-sm text-[#514163]">Target finish time</h3>
          <p className="font-body text-xs text-[#9ca3af] mt-0.5">Required before generating the plan.</p>
        </div>
        <span
          className="font-body font-semibold text-xs px-3 py-1.5 rounded-full whitespace-nowrap"
          style={{ backgroundColor: badge.bg, color: badge.color }}
        >
          {badge.label}
        </span>
      </div>

      {referencesStatus === 'loading' && (
        <div className="flex items-center gap-2 font-body text-sm text-[#6b7280]">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading your past races...
        </div>
      )}

      {referencesStatus === 'error' && (
        <p className="font-body text-xs text-[#b45309]">Your past races could not be loaded. Enter your target manually.</p>
      )}

      {referencesStatus === 'ready' && references.length > 0 && (
        <div className="rounded-xl border border-[#e5e7eb] p-4">
          <p className="font-body text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">References used</p>
          <ul className="space-y-1">
            {references.map((ref) => (
              <li key={ref.id} className="font-body text-xs text-[#4b5563] flex justify-between gap-3">
                <span className="truncate">{ref.label}</span>
                <span className="whitespace-nowrap">{formatDuration(Math.round(ref.durationMin))} · {ref.distanceKm.toFixed(1)} km</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasEstimate && (
        <div className="rounded-xl p-4 border-2" style={{ borderColor: '#fdda36', backgroundColor: 'rgba(253,218,54,0.08)' }}>
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <p className="font-body text-xs text-[#6b7280]">Estimated finish</p>
              <p className="font-heading text-2xl text-[#514163]">{formatDuration(estimate.finishTimeMin!)}</p>
              <p className="font-body text-xs text-[#6b7280]">{formatPace(estimate.paceMinPerKm!)}</p>
            </div>
            <button
              onClick={acceptEstimate}
              disabled={source === 'individualized' || source === 'limited'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-bold text-sm transition-all disabled:cursor-default"
              style={
                source === 'individualized' || source === 'limited'
                  ? { backgroundColor: '#ecfdf5', color: '#059669' }
                  : { backgroundColor: '#fdda36', color: '#514163' }
              }
            >
              {source === 'individualized' || source === 'limited' ? (
                <><CheckCircle2 className="w-4 h-4" /> Estimate in use</>
              ) : (
                'Use estimate'
              )}
            </button>
          </div>
        </div>
      )}

      {estimate.warnings.length > 0 && (
        <ul className="space-y-2">
          {estimate.warnings.map((warning) => (
            <li key={warning} className="flex items-start gap-2 font-body text-xs text-[#6b7280]">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#b45309]" />
              <span>{warning}</span>
            </li>
          ))}
        </ul>
      )}

      {hasEstimate && !showInputs && (
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 font-body text-xs font-semibold text-[#514163] hover:underline"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit manually
        </button>
      )}

      {showInputs && (
        <div>
          <label className="block font-body font-medium text-sm text-[#374151] mb-2">
            {hasEstimate ? 'Manual target' : 'Your target finish time'}
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              max="99"
              placeholder="3"
              value={hours}
              onChange={(e) => handleHours(e.target.value)}
              className="input-brand"
            />
            <span className="font-body text-sm text-[#9ca3af] whitespace-nowrap">h</span>
            <input
              type="number"
              min="0"
              max="59"
              placeholder="30"
              value={minutes}
              onChange={(e) => handleMinutes(e.target.value)}
              className="input-brand"
            />
            <span className="font-body text-sm text-[#9ca3af] whitespace-nowrap">min</span>
          </div>
        </div>
      )}
    </div>
  );
}
