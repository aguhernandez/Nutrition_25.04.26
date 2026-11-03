import { supabase } from './supabase';
import { KM_PER_MILE, type RaceReference } from '../engine/racePerformanceEstimator';
import type { ElevationPoint, RaceData, Sport } from '../types/race';

interface OpenRace {
  raceName: string;
  raceDate: string;
}

interface CompetitionRow {
  id: string;
  race_name: string;
  race_date: string;
  race_data: Partial<RaceData> | null;
}

/** Loads the athlete's saved races of the same sport with a recorded actual duration, dated before the open race. */
export async function fetchRaceReferences(athleteId: string, sport: Sport, openRace: OpenRace): Promise<RaceReference[]> {
  if (!athleteId || !openRace.raceDate) return [];

  const { data: competitions, error } = await supabase
    .from('competitions')
    .select('id, race_name, race_date, race_data')
    .eq('athlete_id', athleteId)
    .eq('sport', sport)
    .lt('race_date', openRace.raceDate)
    .order('race_date', { ascending: false });
  if (error) throw error;

  // The current race cannot be returned because the query is strictly before its
  // date. Keep prior editions with the same name: they are valid historical
  // references and excluding them leaves athletes without usable evidence.
  const candidates = (competitions ?? []) as CompetitionRow[];
  if (candidates.length === 0) return [];

  const { data: feedback, error: feedbackError } = await supabase
    .from('post_race_feedback')
    .select('competition_id, actual_duration_min')
    .in('competition_id', candidates.map((c) => c.id));
  if (feedbackError) throw feedbackError;

  const durationByCompetition = new Map<string, number>();
  for (const row of feedback ?? []) {
    const minutes = Number(row.actual_duration_min);
    if (minutes > 0 && !durationByCompetition.has(row.competition_id)) {
      durationByCompetition.set(row.competition_id, minutes);
    }
  }

  return candidates.flatMap((c): RaceReference[] => {
    const durationMin = durationByCompetition.get(c.id);
    const raceData = c.race_data ?? {};
    const distance = Number(raceData.distance);
    if (!durationMin || !(distance > 0)) return [];
    const distanceKm = raceData.distanceUnit === 'miles' ? distance * KM_PER_MILE : distance;
    const elevationPoints: ElevationPoint[] | undefined = raceData.elevationPoints?.length ? raceData.elevationPoints : undefined;
    return [{
      id: c.id,
      label: `${c.race_name} (${c.race_date})`,
      date: c.race_date,
      distanceKm,
      durationMin,
      elevationGainM: Number(raceData.elevationGain) || 0,
      elevationPoints,
    }];
  });
}
