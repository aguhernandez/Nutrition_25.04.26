import { useState, useEffect, useRef } from 'react';
import { Users, ChevronRight, Search, MapPin, Calendar, Apple, Trophy, ArrowLeft, Activity, Download, RefreshCw, CloudOff } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { getCoachAthletes } from '../../lib/hubApi';
import TrainingSneakPeek from './TrainingSneakPeek';
import HubBiologicalPassport from '../nutrition/HubBiologicalPassport';
import HubFoodDiary from '../nutrition/HubFoodDiary';
import HubAnamnesisCard from '../nutrition/HubAnamnesisCard';
import HubHabitsCard from '../nutrition/HubHabitsCard';
import HubWellnessCard from '../nutrition/HubWellnessCard';

interface AthleteProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  hub_user_id?: string;
  hasLocalProfile?: boolean;
}

interface Competition {
  id: string;
  athlete_id: string;
  name: string;
  race_type: string;
  race_date: string;
  target_time_minutes: number | null;
  status: string;
  created_at: string;
}

interface MealPlan {
  id: string;
  user_id: string;
  name: string;
  plan_type: string;
  created_at: string;
  days: Record<string, unknown>;
}

interface NutritionAnamnesis {
  id: string;
  user_id: string;
  primary_sport: string;
  training_phase: string;
  body_weight_kg: number;
  weekly_training_hours: number;
  target_calories_kcal: number | null;
  target_carbs_g: number | null;
  target_protein_g: number | null;
  target_fat_g: number | null;
  dietary_pattern: string;
}

interface AthleteDetail {
  profile: AthleteProfile;
  competitions: Competition[];
  mealPlans: MealPlan[];
  anamnesis: NutritionAnamnesis | null;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatMinutes(minutes: number | null) {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function PlanTypeBadge({ type }: { type: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    base: { bg: '#f0fdf4', text: '#15803d' },
    load: { bg: '#fef3c7', text: '#b45309' },
    taper: { bg: '#eff6ff', text: '#1d4ed8' },
    race_day: { bg: '#fdf2f8', text: '#be185d' },
    recovery: { bg: '#f5f3ff', text: '#7c3aed' },
  };
  const c = colors[type] ?? { bg: '#f3f4f6', text: '#6b7280' };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize" style={{ backgroundColor: c.bg, color: c.text }}>
      {type.replace('_', ' ')}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    planned: { bg: '#eff6ff', text: '#1d4ed8' },
    active: { bg: '#f0fdf4', text: '#15803d' },
    completed: { bg: '#f3f4f6', text: '#6b7280' },
    cancelled: { bg: '#fef2f2', text: '#b91c1c' },
  };
  const c = map[status] ?? map.planned;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize" style={{ backgroundColor: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

function AthleteDetailView({ detail, onBack }: { detail: AthleteDetail; onBack: () => void }) {
  const { profile, competitions, mealPlans, anamnesis } = detail;
  const athleteId = profile.id;
  const [hubPullKey, setHubPullKey] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const pullTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePullHub = () => {
    setIsPulling(true);
    setHubPullKey((k) => k + 1);
    if (pullTimeoutRef.current) clearTimeout(pullTimeoutRef.current);
    pullTimeoutRef.current = setTimeout(() => setIsPulling(false), 3000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border transition-all hover:bg-gray-50"
          style={{ borderColor: '#e5e7eb' }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base" style={{ backgroundColor: '#514163', color: '#fdda36' }}>
            {profile.full_name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h2 className="font-heading text-lg" style={{ color: '#1f2937' }}>{profile.full_name}</h2>
            <p className="font-body text-xs" style={{ color: '#9ca3af' }}>{profile.email}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
          {profile.role}
        </span>
        <button
          onClick={handlePullHub}
          disabled={isPulling}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all disabled:opacity-60"
          style={{ backgroundColor: '#514163', color: '#fdda36', border: 'none' }}
        >
          {isPulling
            ? <RefreshCw className="w-4 h-4 animate-spin" />
            : <Download className="w-4 h-4" />
          }
          {isPulling ? 'Consultando Hub...' : 'Pull desde Hub'}
        </button>
      </div>

      {/* Nutrition Profile */}
      {anamnesis ? (
        <div className="card-brand p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
              <Apple className="w-4 h-4" style={{ color: '#d97706' }} />
            </div>
            <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Nutrition Profile</span>
            <PlanTypeBadge type={anamnesis.training_phase} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Sport', value: anamnesis.primary_sport },
              { label: 'Body Weight', value: `${anamnesis.body_weight_kg} kg` },
              { label: 'Training hrs/wk', value: `${anamnesis.weekly_training_hours}h` },
              { label: 'Diet Pattern', value: anamnesis.dietary_pattern },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <div className="text-xs mb-1" style={{ color: '#9ca3af' }}>{label}</div>
                <div className="text-sm font-semibold capitalize" style={{ color: '#1f2937' }}>{value}</div>
              </div>
            ))}
          </div>
          {(anamnesis.target_calories_kcal ?? 0) > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Calories', value: anamnesis.target_calories_kcal, unit: 'kcal', color: '#f59e0b' },
                { label: 'Carbs', value: anamnesis.target_carbs_g, unit: 'g', color: '#3b82f6' },
                { label: 'Protein', value: anamnesis.target_protein_g, unit: 'g', color: '#10b981' },
                { label: 'Fat', value: anamnesis.target_fat_g, unit: 'g', color: '#f97316' },
              ].map(({ label, value, unit, color }) => (
                <div key={label} className="text-center rounded-xl py-3" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <div className="text-base font-bold" style={{ color }}>{value ?? 0}<span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>{unit}</span></div>
                  <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card-brand p-5 text-center">
          <Apple className="w-8 h-8 mx-auto mb-2" style={{ color: '#d1d5db' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>No nutrition anamnesis on file</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Race Plans */}
        <div className="card-brand p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
              <Trophy className="w-4 h-4" style={{ color: '#2563eb' }} />
            </div>
            <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Race Plans</span>
            <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>
              {competitions.length}
            </span>
          </div>
          {competitions.length === 0 ? (
            <div className="text-center py-6">
              <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: '#d1d5db' }} />
              <p className="text-sm" style={{ color: '#9ca3af' }}>No race plans yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {competitions.slice(0, 5).map((comp) => (
                <div key={comp.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#eff6ff' }}>
                    <MapPin className="w-4 h-4" style={{ color: '#2563eb' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm truncate" style={{ color: '#1f2937' }}>{comp.name}</span>
                      <StatusBadge status={comp.status} />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs" style={{ color: '#9ca3af' }}>
                        <Calendar className="w-3 h-3 inline mr-1" />{formatDate(comp.race_date)}
                      </span>
                      {comp.race_type && (
                        <span className="text-xs capitalize" style={{ color: '#9ca3af' }}>{comp.race_type}</span>
                      )}
                      {comp.target_time_minutes && (
                        <span className="text-xs font-medium" style={{ color: '#6b7280' }}>
                          Goal: {formatMinutes(comp.target_time_minutes)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {competitions.length > 5 && (
                <p className="text-xs text-center py-1" style={{ color: '#9ca3af' }}>+{competitions.length - 5} more races</p>
              )}
            </div>
          )}
        </div>

        {/* Nutrition Plans */}
        <div className="card-brand p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
              <Apple className="w-4 h-4" style={{ color: '#15803d' }} />
            </div>
            <span className="font-heading text-sm" style={{ color: '#1f2937' }}>Meal Plans</span>
            <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>
              {mealPlans.length}
            </span>
          </div>
          {mealPlans.length === 0 ? (
            <div className="text-center py-6">
              <Apple className="w-8 h-8 mx-auto mb-2" style={{ color: '#d1d5db' }} />
              <p className="text-sm" style={{ color: '#9ca3af' }}>No meal plans yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mealPlans.slice(0, 5).map((plan) => (
                <div key={plan.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f0fdf4' }}>
                    <Activity className="w-4 h-4" style={{ color: '#15803d' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm truncate" style={{ color: '#1f2937' }}>{plan.name}</span>
                      <PlanTypeBadge type={plan.plan_type} />
                    </div>
                    <span className="text-xs" style={{ color: '#9ca3af' }}>
                      Created {formatDate(plan.created_at)}
                    </span>
                  </div>
                </div>
              ))}
              {mealPlans.length > 5 && (
                <p className="text-xs text-center py-1" style={{ color: '#9ca3af' }}>+{mealPlans.length - 5} more plans</p>
              )}
            </div>
          )}
        </div>
      </div>

      <TrainingSneakPeek key={`training-${hubPullKey}`} athleteId={athleteId} athleteEmail={profile.hub_user_id ?? profile.email} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <HubWellnessCard key={`wellness-${hubPullKey}`} athleteEmail={profile.email} athleteName={profile.full_name} />
        <HubHabitsCard key={`habits-${hubPullKey}`} athleteEmail={profile.email} athleteName={profile.full_name} />
      </div>

      <HubBiologicalPassport key={`passport-${hubPullKey}`} athleteEmail={profile.email} athleteName={profile.full_name} />

      <HubFoodDiary key={`diary-${hubPullKey}`} athleteEmail={profile.email} athleteName={profile.full_name} />

      <HubAnamnesisCard key={`anamnesis-${hubPullKey}`} athleteEmail={profile.email} />
    </div>
  );
}

export default function AthletesView() {
  const { profile, user } = useAuth();
  const [athletes, setAthletes] = useState<AthleteProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AthleteDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [hubFailed, setHubFailed] = useState(false);

  const isAdmin = profile?.role === 'admin';
  const isCoach = profile?.role === 'coach';

  useEffect(() => {
    if (!user?.id || user.id.startsWith('demo-')) {
      setLoading(false);
      return;
    }
    (async () => {
      setHubFailed(false);

      // Load local profiles as baseline
      const { data: localData } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, hub_user_id')
        .eq('role', 'athlete')
        .order('full_name', { ascending: true });

      const localAthletes: AthleteProfile[] = (localData ?? []).map((p: any) => ({
        ...p,
        hasLocalProfile: true,
      }));

      // Try Hub for coach's full athlete roster
      if ((isCoach || isAdmin) && (profile?.hub_user_id || profile?.email)) {
        try {
          const hubRes = await getCoachAthletes(profile.hub_user_id || profile.email);
          const hubAthletes = hubRes.athletes ?? [];

          if (hubAthletes.length > 0) {
            const localEmails = new Set(localAthletes.map((a) => a.email.toLowerCase()));
            const localHubIds = new Set(localAthletes.map((a) => a.hub_user_id).filter(Boolean));

            const merged = [...localAthletes];

            for (const ha of hubAthletes) {
              const emailMatch = localEmails.has(ha.email.toLowerCase());
              const idMatch = ha.id && localHubIds.has(ha.id);
              if (!emailMatch && !idMatch) {
                merged.push({
                  id: ha.id,
                  email: ha.email,
                  full_name: ha.full_name || ha.name || ha.email.split('@')[0],
                  role: 'athlete',
                  hub_user_id: ha.id,
                  hasLocalProfile: false,
                });
              }
            }

            merged.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
            setAthletes(merged);
            setLoading(false);
            return;
          }
        } catch {
          setHubFailed(true);
        }
      }

      setAthletes(localAthletes);
      setLoading(false);
    })();
  }, [user?.id, isAdmin, isCoach]);

  const openAthlete = async (ap: AthleteProfile) => {
    setDetailLoading(true);

    // Auto-create local profile if needed
    let effectiveId = ap.id;
    if (!ap.hasLocalProfile) {
      const newProfile = {
        id: ap.hub_user_id || undefined,
        hub_user_id: ap.hub_user_id || ap.id,
        email: ap.email,
        full_name: ap.full_name,
        role: 'athlete',
        membership_slug: 'inicia',
        membership_name: 'Asciende Inicia',
      };
      const { data } = await supabase
        .from('profiles')
        .upsert(newProfile, { onConflict: 'hub_user_id' })
        .select()
        .maybeSingle();
      if (data) {
        effectiveId = data.id;
        setAthletes((prev) =>
          prev.map((a) => a.email === ap.email ? { ...a, id: data.id, hasLocalProfile: true } : a)
        );
      }
    }

    const [compRes, planRes, anamRes] = await Promise.all([
      supabase.from('competitions').select('*').eq('athlete_id', effectiveId).order('race_date', { ascending: false }),
      supabase.from('meal_plans').select('id, user_id, name, plan_type, created_at, meals').eq('user_id', effectiveId).order('created_at', { ascending: false }),
      supabase.from('nutrition_anamnesis').select('*').eq('user_id', effectiveId).maybeSingle(),
    ]);
    setSelected({
      profile: { ...ap, id: effectiveId },
      competitions: compRes.data ?? [],
      mealPlans: planRes.data ?? [],
      anamnesis: anamRes.data ?? null,
    });
    setDetailLoading(false);
  };

  const filtered = athletes.filter(
    (a) =>
      a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    return <AthleteDetailView detail={selected} onBack={() => setSelected(null)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#fdda36', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl" style={{ color: '#1f2937' }}>Athletes</h1>
          <p className="font-body text-sm mt-1" style={{ color: '#6b7280' }}>
            {isAdmin ? 'All athletes on the platform' : 'Your assigned athletes'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white" style={{ borderColor: '#e5e7eb' }}>
          <Search className="w-4 h-4" style={{ color: '#9ca3af' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search athletes..."
            className="bg-transparent text-sm outline-none w-44"
            style={{ color: '#1f2937' }}
          />
        </div>
      </div>

      {user?.id?.startsWith('demo-') && (
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: '#fef9c3', border: '1px solid #fcd34d' }}>
          <Users className="w-5 h-5 flex-shrink-0" style={{ color: '#b45309' }} />
          <p className="text-sm" style={{ color: '#92400e' }}>
            You're in demo mode. Real athlete data requires a Supabase connection.
          </p>
        </div>
      )}

      {hubFailed && (
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: '#fef9c3', border: '1px solid #fcd34d' }}>
          <CloudOff className="w-5 h-5 flex-shrink-0" style={{ color: '#b45309' }} />
          <p className="text-sm" style={{ color: '#92400e' }}>
            Could not reach Hub. Showing local athletes only.
          </p>
        </div>
      )}

      {detailLoading && (
        <div className="flex items-center justify-center min-h-32">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#fdda36', borderTopColor: 'transparent' }} />
        </div>
      )}

      {!detailLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(253,218,54,0.15)', border: '2px solid rgba(253,218,54,0.3)' }}>
            <Users className="w-8 h-8" style={{ color: '#514163' }} />
          </div>
          <h3 className="font-heading text-lg mb-2" style={{ color: '#1f2937' }}>
            {search ? 'No athletes found' : 'No athletes yet'}
          </h3>
          <p className="text-sm max-w-sm" style={{ color: '#9ca3af' }}>
            {search
              ? `No athletes matching "${search}"`
              : 'Athletes will appear here once they register and complete their profiles.'}
          </p>
        </div>
      )}

      {!detailLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((athlete) => (
            <button
              key={athlete.id}
              onClick={() => openAthlete(athlete)}
              className="card-brand p-5 flex items-start gap-4 text-left group hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ backgroundColor: '#514163', color: '#fdda36' }}>
                {athlete.full_name?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading text-sm truncate" style={{ color: '#1f2937' }}>{athlete.full_name}</div>
                <div className="font-body text-xs mt-0.5 truncate" style={{ color: '#9ca3af' }}>{athlete.email}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
                    {athlete.role}
                  </span>
                  {athlete.hasLocalProfile === false && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
                      Hub
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#9ca3af' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
