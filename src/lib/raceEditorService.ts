import { supabase } from './supabase';
import type { ElevationPoint, RaceCatalogEntry, HydrationStation } from '../types/race';

export interface AidStationRow {
  id: string;
  race_catalog_id: string;
  name: string;
  distance_km: number;
  altitude_m: number;
  supply_types: string[];
  services: string[];
  sort_order: number;
}

export interface ChangeHistoryRow {
  id: string;
  race_catalog_id: string;
  changed_by: string;
  changed_by_role: string;
  change_type: string;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  summary: string;
  created_at: string;
}

export async function fetchAllRaces(): Promise<RaceCatalogEntry[]> {
  const { data, error } = await supabase
    .from('races_catalog')
    .select('*')
    .order('name');
  if (error) throw error;
  return (data ?? []).map(mapRaceRow);
}

export async function fetchRaceById(id: string): Promise<RaceCatalogEntry | null> {
  const { data, error } = await supabase
    .from('races_catalog')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRaceRow(data) : null;
}

export async function createRace(input: Partial<RaceCatalogEntry>): Promise<RaceCatalogEntry> {
  const { data, error } = await supabase
    .from('races_catalog')
    .insert({
      name: input.name ?? '',
      sport: input.sport ?? 'running',
      country: input.country ?? '',
      city: input.city ?? '',
      distance_km: input.distance_km ?? 0,
      elevation_gain_m: input.elevation_gain_m ?? 0,
      typical_month: input.typical_month ?? 1,
      typical_day: input.typical_day ?? 1,
      avg_temperature_c: input.avg_temperature_c ?? 20,
      avg_humidity_pct: input.avg_humidity_pct ?? 60,
      altitude_m: input.altitude_m ?? 0,
      description: input.description ?? '',
      is_verified: input.is_verified ?? false,
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapRaceRow(data);
}

export async function updateRace(id: string, input: Partial<RaceCatalogEntry>): Promise<void> {
  const { error } = await supabase.from('races_catalog').update({
    name: input.name,
    sport: input.sport,
    country: input.country,
    city: input.city,
    distance_km: input.distance_km,
    elevation_gain_m: input.elevation_gain_m,
    typical_month: input.typical_month,
    typical_day: input.typical_day,
    avg_temperature_c: input.avg_temperature_c,
    avg_humidity_pct: input.avg_humidity_pct,
    altitude_m: input.altitude_m,
    description: input.description,
    is_verified: input.is_verified,
  }).eq('id', id);
  if (error) throw error;
}

export async function deleteRace(id: string): Promise<void> {
  const { error } = await supabase.from('races_catalog').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchElevationData(raceId: string): Promise<ElevationPoint[]> {
  const { data, error } = await supabase
    .from('race_elevation_data')
    .select('elevation_points')
    .eq('race_catalog_id', raceId)
    .maybeSingle();
  if (error) throw error;
  return (data?.elevation_points as ElevationPoint[]) ?? [];
}

export async function saveElevationData(raceId: string, points: ElevationPoint[], source: string, updatedBy: string): Promise<void> {
  const { error } = await supabase
    .from('race_elevation_data')
    .upsert({ race_catalog_id: raceId, elevation_points: points, source, updated_by: updatedBy, updated_at: new Date().toISOString() }, { onConflict: 'race_catalog_id' });
  if (error) throw error;
}

export async function fetchAidStations(raceId: string): Promise<AidStationRow[]> {
  const { data, error } = await supabase
    .from('race_aid_stations')
    .select('*')
    .eq('race_catalog_id', raceId)
    .order('sort_order');
  if (error) throw error;
  return (data ?? []) as AidStationRow[];
}

export async function upsertAidStation(row: Partial<AidStationRow> & { race_catalog_id: string }): Promise<AidStationRow> {
  if (row.id) {
    const { data, error } = await supabase
      .from('race_aid_stations')
      .update({
        name: row.name,
        distance_km: row.distance_km,
        altitude_m: row.altitude_m,
        supply_types: row.supply_types,
        services: row.services,
        sort_order: row.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', row.id)
      .select('*')
      .single();
    if (error) throw error;
    return data as AidStationRow;
  }
  const { data, error } = await supabase
    .from('race_aid_stations')
    .insert({
      race_catalog_id: row.race_catalog_id,
      name: row.name ?? '',
      distance_km: row.distance_km ?? 0,
      altitude_m: row.altitude_m ?? 0,
      supply_types: row.supply_types ?? [],
      services: row.services ?? [],
      sort_order: row.sort_order ?? 0,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as AidStationRow;
}

export async function deleteAidStation(id: string): Promise<void> {
  const { error } = await supabase.from('race_aid_stations').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchChangeHistory(raceId: string): Promise<ChangeHistoryRow[]> {
  const { data, error } = await supabase
    .from('race_change_history')
    .select('*')
    .eq('race_catalog_id', raceId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as ChangeHistoryRow[];
}

export async function logChange(raceId: string, changedBy: string, role: string, entry: { change_type: string; field_name?: string; old_value?: string; new_value?: string; summary: string }): Promise<void> {
  const { error } = await supabase.from('race_change_history').insert({
    race_catalog_id: raceId,
    changed_by: changedBy,
    changed_by_role: role,
    change_type: entry.change_type,
    field_name: entry.field_name ?? null,
    old_value: entry.old_value ?? null,
    new_value: entry.new_value ?? null,
    summary: entry.summary,
  });
  if (error) throw error;
}

export function aidStationToHydration(row: AidStationRow): HydrationStation {
  return {
    id: row.id,
    km: Number(row.distance_km),
    label: row.name,
    hasFood: (row.supply_types ?? []).includes('food'),
    altitudeM: Number(row.altitude_m),
    supplyTypes: row.supply_types ?? [],
    services: row.services ?? [],
  };
}

function mapRaceRow(row: Record<string, unknown>): RaceCatalogEntry {
  return {
    id: row.id as string,
    name: row.name as string,
    sport: row.sport as RaceCatalogEntry['sport'],
    country: row.country as string,
    city: row.city as string,
    distance_km: Number(row.distance_km),
    elevation_gain_m: Number(row.elevation_gain_m),
    typical_month: row.typical_month as number,
    typical_day: row.typical_day as number,
    avg_temperature_c: Number(row.avg_temperature_c),
    avg_humidity_pct: Number(row.avg_humidity_pct),
    altitude_m: Number(row.altitude_m),
    description: row.description as string,
  };
}
