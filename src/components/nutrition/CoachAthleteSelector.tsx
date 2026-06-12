import { useState, useEffect } from 'react';
import { Search, Users, ChevronRight, Loader2, Calendar, CloudOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { getCoachAthletes } from '../../lib/hubApi';
import type { HubCoachAthlete } from '../../lib/hubApi';
import { usePreferences } from '../../lib/preferences';
import FullMealEditor from './FullMealEditor';

interface Athlete {
  id: string;
  email: string;
  full_name: string;
  hub_user_id?: string;
  hasLocalProfile: boolean;
}

interface Props {
  onBack: () => void;
}

export default function CoachAthleteSelector({ onBack }: Props) {
  const { profile } = useAuth();
  const { language } = usePreferences();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Athlete | null>(null);
  const [hubFailed, setHubFailed] = useState(false);

  useEffect(() => {
    loadAthletes();
  }, [profile]);

  const loadAthletes = async () => {
    setLoading(true);
    setHubFailed(false);

    // Load local profiles as baseline
    const { data: localProfiles } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, hub_user_id')
      .eq('role', 'athlete')
      .order('full_name');

    const localAthletes: Athlete[] = (localProfiles ?? []).map((p: any) => ({
      id: p.id,
      email: p.email,
      full_name: p.full_name,
      hub_user_id: p.hub_user_id,
      hasLocalProfile: true,
    }));

    // Try to get coach's athlete roster from Hub
    if (profile?.hub_user_id || profile?.email) {
      try {
        const hubRes = await getCoachAthletes(profile.hub_user_id || profile.email);
        const hubAthletes = hubRes.athletes ?? [];

        if (hubAthletes.length > 0) {
          // Merge: Hub athletes that don't have a local profile yet
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

    // Fallback to local only
    setAthletes(localAthletes);
    setLoading(false);
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
    return (
      <FullMealEditor
        onBack={() => setSelected(null)}
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
              {language === 'es' ? 'Planes de Comidas' : 'Meal Plans'}
            </h1>
            <p className="font-body text-xs mt-0.5" style={{ color: '#9ca3af' }}>
              {language === 'es' ? 'Selecciona un atleta para planificar' : 'Select an athlete to plan for'}
            </p>
          </div>
        </div>
      </div>

      {hubFailed && (
        <div className="mb-4 p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d' }}>
          <CloudOff className="w-4 h-4 flex-shrink-0" style={{ color: '#b45309' }} />
          <span className="font-body text-xs" style={{ color: '#92400e' }}>
            {language === 'es'
              ? 'No se pudo conectar con Hub. Mostrando atletas locales.'
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
