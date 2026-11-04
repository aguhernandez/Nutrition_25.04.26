import { HubApiError } from './hubApi';

const SMART_PLAN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smart-nutrition-plan`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const HUB_SESSION_TOKEN_KEY = 'hub_session_token';

export type SmartPlanMode = 'full' | 'partial';
export type SmartPlanKind = 'personal' | 'professional';

export interface SmartNutritionSnapshot {
  weight_kg: number | null;
  height_cm: number | null;
  age_years: number | null;
  sex: 'male' | 'female' | null;
  weekly_training_minutes: number;
  weekly_estimated_impulse: number;
  upcoming_workouts: number;
  anamnesis_complete: boolean;
  diary_entries_24h: number;
  captured_at: string;
}

export interface SmartNutritionTargets {
  calories_goal: number;
  protein_goal: number;
  carbs_goal: number;
  fats_goal: number;
  bmr: number;
  activity_factor: number;
}

export interface SmartNutritionPreflight {
  status: 'ready' | 'needs_data';
  missing: string[];
  snapshot: SmartNutritionSnapshot;
  targets: SmartNutritionTargets | null;
}

export interface SmartPlanRequest {
  athleteId: string;
  planKind: SmartPlanKind;
  mode?: SmartPlanMode;
  professionalJustification?: string;
  parentPlanId?: string;
}

function headers(): HeadersInit {
  const token = localStorage.getItem(HUB_SESSION_TOKEN_KEY);
  if (!token) throw new HubApiError('AUTH_REQUIRED', 'Tu sesión de Hub expiró. Inicia sesión nuevamente.');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    apikey: ANON_KEY,
  };
}

async function request<T>(body: Record<string, unknown>): Promise<T> {
  const response = await fetch(SMART_PLAN_URL, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new HubApiError(payload?.error ?? 'SMART_PLAN_ERROR', payload?.message ?? `HTTP ${response.status}`, payload);
  }
  return payload as T;
}

function bodyFor(input: SmartPlanRequest) {
  return {
    athlete_id: input.athleteId,
    plan_kind: input.planKind,
    mode: input.mode ?? 'full',
    professional_justification: input.professionalJustification,
    parent_plan_id: input.parentPlanId,
  };
}

/** Checks the current Hub-derived data without creating a plan or consuming quota. */
export function preflightSmartNutrition(input: SmartPlanRequest) {
  return request<SmartNutritionPreflight>({ action: 'preflight', ...bodyFor(input) });
}

/** Creates a saved draft after the user has reviewed a successful preflight. */
export function createSmartNutritionDraft(input: SmartPlanRequest) {
  return request<{ status: 'created' | 'existing'; plan: { id: string } & Record<string, unknown> }>({
    action: 'generate',
    request_key: crypto.randomUUID(),
    ...bodyFor(input),
  });
}
