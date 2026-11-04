import { useState, useEffect } from 'react';
import { Search, Users, ChevronRight, Loader2, Calendar, CloudOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { getCoachAthletes } from '../../lib/hubApi';
import type { HubCoachAthlete } from '../../lib/hubApi';
import { usePreferences } from '../../lib/preferences';
import FullMealEditor from './FullMealEditor';
import SmartNutritionPlanner from './SmartNutritionPlanner';

interface Athlete {
  id: string;
  email: string;
  full_name: string;
  hub_user_id?: string;
  hasLocalProfile: boolean;
}

interface Props {
  onBack: () => void;
  mode?: 'editor' | 'smart';
}

export default function CoachAthleteSelector({ onBack, mode = 'editor' }: Props) {
  const { profile } = useAuth();
  const { language } = usePreferences();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Athlete | null>(null);
  const [openDraftEditor, setOpenDraftEditor] = useState(false);
  const [hubFailed, setHubFailed] = useState(false);

  useEffect(() => {
    loadAthletes();
  }, [profile]);

  const loadAthletes = async () => {
    setLoading(true);
    setHubFailed(false);

    // The Hub endpoint is the authority for a professional roster. Do not
    // fall back to every local athlete: cached satellite profiles are not an
    // authorization source and could expose an unrelated athlete.
    if (!profile?.hub_user_id && !profile?.email) {
      setAthletes([]);
      setHubFailed(true);
      setLoading(false);
      return;
    }

    try {
      const hubRes = await getCoachAthletes(profile.hub_user_id || profile.email);
      const hubAthletes = hubRes.athletes ?? [];
      if (hubAthletes.length === 0) {
        setAthletes([]);
        setLoading(false);
        return;
      }

      const hubIds = hubAthletes.map((athlete) => athlete.id).filter(Boolean);
      const { data: localProfiles } = hubIds.length > 0
        ? await supabase
            .from('profiles')
            .select('id, email, full_name, hub_user_id')
            .eq('role', 'athlete')
            .in('hub_user_id', hubIds)
        : { data: [] };

      const localByHubId = new Map((localProfiles ?? []).map((row: any) => [row.hub_user_id, row]));

      const authorized: Athlete[] = hubAthletes.map((athlete) => {
        const local = localByHubId.get(athlete.id);
        return {
          id: local?.id ?? athlete.id,
          email: athlete.email,
          full_name: local?.full_name ?? athlete.full_name ?? athlete.name ?? athlete.email.split('@')[0],
          hub_user_id: athlete.id,
          hasLocalProfile: Boolean(local),
        };
      });

      authorized.sort((x, y) => (x.full_name || '').localeCompare(y.full_name || ''));
      setAthletes(authorized);
    } catch {
      setHubFailed(true);
      setAthletes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAthlete = async (athlete: Athlete) => {
    if (!athlete.hasLocalProfile) {
      // Auto-create local profile for this Hub athlete
      const newProfile = {
        id: athlete.hub_user_id || undefined,
        hub_user_id: athlete.hub_user_id || athlete.id,
        email: athlete.email,
        full_name: athlete.full_name,
        role: 'athlete',
        membership_slug: 'inicia',
        membership_name: 'Asciende Inicia',
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(newProfile, { onConflict: 'hub_user_id' })
        .select()
        .maybeSingle();

      if (data) {
        setAthletes((prev) =>
          prev.map((a) =>
            a.email === athlete.email ? { ...a, id: data.id, hasLocalProfile: true } : a
          )
        );
        setSelected({ ...athlete, id: data.id, hasLocalProfile: true });
      } else if (error) {
        console.error('[CoachAthleteSelector] Auto-create profile failed:', error.message);
        // Still try to select with Hub ID
        setSelected(athlete);
      }
    } else {
      setSelected(athlete);
    }
  };

  if (selected) {
    if (mode === 'smart' && !openDraftEditor) {
      return (
        <SmartNutritionPlanner
          athleteId={selected.id}
          athleteName={selected.full_name}
          planKind="professional"
          onBack={() => setSelected(null)}
          onDraftCreated={() => setOpenDraftEditor(true)}
        />
      );
    }

    return (
      <FullMealEditor
        onBack={() => { setOpenDraftEditor(false); setSelected(null); }}
        targetUserId={selected.id}
        targetUserName={selected.full_name}
        targetUserEmail={selected.email}
      />
    );
  }

  const filtered = athletes.filter(
    (a) =>
      a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="btn-ghost p-2 rounded-xl border"
          style={{ borderColor: '#e5e7eb' }}
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#f0fdf4' }}
          >
            <Calendar className="w-5 h-5" style={{ color: '#15803d' }} />
          </div>
          <div>
            <h1 className="font-heading text-xl" style={{ color: '#1f2937' }}>
              {mode === 'smart'
                ? (language === 'es' ? 'Planificación Inteligente' : 'Smart Planning')
                : (language === 'es' ? 'Planes de Comidas' : 'Meal Plans')}
            </h1>
            <p className="font-body text-xs mt-0.5" style={{ color: '#9ca3af' }}>
              {mode === 'smart'
                ? (language === 'es' ? 'Selecciona un atleta autorizado' : 'Select an authorized athlete')
                : (language === 'es' ? 'Selecciona un atleta para planificar' : 'Select an athlete to plan for')}
            </p>
          </div>
        </div>
      </div>

      {hubFailed && (
        <div className="mb-4 p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d' }}>
          <CloudOff className="w-4 h-4 flex-shrink-0" style={{ color: '#b45309' }} />
          <span className="font-body text-xs" style={{ color: '#92400e' }}>
            {language === 'es'
              ? 'No se pudo conectar con Hub. No se muestran atletas hasta recuperar un roster autorizado.'
              : 'Could not reach Hub. Showing local athletes only.'}
          </span>
        </div>
      )}

      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: '#9ca3af' }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={language === 'es' ? 'Buscar atletas...' : 'Search athletes...'}
          className="input-brand pl-10 py-2.5"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-16 bg-white rounded-2xl"
          style={{ border: '2px solid #e5e7eb' }}
        >
          <Users className="w-12 h-12 mx-auto mb-3" style={{ color: '#d1d5db' }} />
          <h3 className="font-heading text-lg mb-1" style={{ color: '#1f2937' }}>
            {language === 'es' ? 'Sin atletas' : 'No athletes found'}
          </h3>
          <p className="font-body text-sm" style={{ color: '#9ca3af' }}>
            {search
              ? (language === 'es' ? 'Intenta con otro termino' : 'Try a different search term')
              : (language === 'es' ? 'No hay atletas registrados' : 'No athletes are registered yet')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((athlete) => (
            <button
              key={athlete.hub_user_id || athlete.id}
              onClick={() => handleSelectAthlete(athlete)}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl text-left transition-all hover:shadow-md"
              style={{ border: '2px solid #e5e7eb' }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = '#514163')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb')
              }
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base flex-shrink-0"
                style={{ backgroundColor: '#514163', color: '#fdda36' }}
              >
                {athlete.full_name?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-body font-semibold" style={{ color: '#1f2937' }}>
                    {athlete.full_name}
                  </span>
                  {!athlete.hasLocalProfile && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
                      Hub
                    </span>
                  )}
                </div>
                <div className="font-body text-xs truncate" style={{ color: '#9ca3af' }}>
                  {athlete.email}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#d1d5db' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
