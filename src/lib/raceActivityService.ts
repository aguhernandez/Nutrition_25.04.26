import { supabase } from './supabase';
import type { FuelNotification } from '../engine/fuelNotificationEngine';

export interface RaceActivityRow {
  id: string;
  competition_id: string | null;
  athlete_id: string;
  start_time: string;
  end_time: string | null;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  current_km: number;
  elapsed_time_min: number;
  adaptive_fluid_factor: number;
  conditions: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export async function createRaceActivity(
  competitionId: string | null,
  athleteId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from('race_activity')
    .insert({
      competition_id: competitionId,
      athlete_id: athleteId,
      start_time: new Date().toISOString(),
      status: 'active',
      current_km: 0,
      elapsed_time_min: 0,
      adaptive_fluid_factor: 1.0,
      conditions: {},
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Failed to create race activity:', error.message);
    return null;
  }
  return data?.id ?? null;
}

export async function updateRaceActivity(
  id: string,
  patch: Partial<{
    status: RaceActivityRow['status'];
    current_km: number;
    elapsed_time_min: number;
    adaptive_fluid_factor: number;
    conditions: Record<string, unknown>;
    end_time: string;
  }>
): Promise<void> {
  const { error } = await supabase
    .from('race_activity')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Failed to update race activity:', error.message);
  }
}

export async function logRaceEvent(
  raceActivityId: string,
  athleteId: string,
  notification: FuelNotification,
  firedAtSec: number
): Promise<void> {
  const { error } = await supabase.from('race_events').insert({
    race_activity_id: raceActivityId,
    athlete_id: athleteId,
    event_type: notification.type,
    scheduled_at_sec: notification.scheduledAtSec,
    fired_at_sec: firedAtSec,
    km_mark: notification.kmMark ?? null,
    message: notification.message,
    acknowledged: notification.status === 'acknowledged',
    snoozed_sec: notification.snoozedUntilSec ? notification.snoozedUntilSec - notification.scheduledAtSec : null,
    payload: notification.payload,
  });

  if (error) {
    console.error('Failed to log race event:', error.message);
  }
}

export async function acknowledgeRaceEvent(
  raceActivityId: string,
  notificationId: string
): Promise<void> {
  const { error } = await supabase
    .from('race_events')
    .update({ acknowledged: true })
    .eq('race_activity_id', raceActivityId)
    .eq('id', notificationId);

  if (error) {
    console.error('Failed to acknowledge race event:', error.message);
  }
}
