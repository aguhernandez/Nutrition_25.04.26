import { useState, useEffect } from 'react';
import { Search, Users, ChevronRight, Loader2, Trophy, CloudOff, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { getCoachAthletes } from '../../lib/hubApi';
import type { HubCoachAthlete } from '../../lib/hubApi';
import { usePreferences } from '../../lib/preferences';

export interface RaceAthlete {
  id: string;
  email: string;
  full_name: string;
  hub_user_id?: string;
  hasLocalProfile: boolean;
}

interface Props {
  onSelect: (athlete: RaceAthlete) => void;
  selectedAthlete: RaceAthlete | null;
  onClear: () => void;
}

export default function CoachRaceAthleteSelector({ onSelect, selectedAthlete, onClear }: Props) {
  const { profile } = useAuth();
  const { language } = usePreferences();
  const [athletes, setAthletes] = useState<RaceAthlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hubFailed, setHubFailed] = useState(false);

  useEffect(() => {
    loadAthletes();
  }, [profile]);

  const loadAthletes = async () => {
    setLoading(true);
    setHubFailed(false);

    const { data: localProfiles } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, hub_user_id')
      .eq('role', 'athlete')
      .order('full_name');

    const localAthletes: RaceAthlete[] = (localProfiles ?? []).map((p: Record<string, string>) => ({
      id: p.id,
      email: p.email,
      full_name: p.full_name,
      hub_user_id: p.hub_user_id,
      hasLocalProfile: true,
    }));

    if (profile?.hub_user_id || profile?.email) {
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
  };

  const handleSelectAthlete = async (athlete: RaceAthlete) => {
    if (!athlete.hasLocalProfile) {
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
        const updated = { ...athlete, id: data.id, hasLocalProfile: true };
        setAthletes((prev) =>
          prev.map((a) => (a.email === athlete.email ? { ...a, id: data.id, hasLocalProfile: true } : a)),
        );
        onSelect(updated);
      } else {
        onSelect(athlete);
      }
    } else {
      onSelect(athlete);
    }
    setShowDropdown(false);
    setSearch('');
  };

  const filtered = athletes.filter(
    (a) =>
      a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()),
  );

  if (selectedAthlete) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4"
        style={{
          backgroundColor: 'rgba(253,218,54,0.12)',
          border: '2px solid rgba(253,218,54,0.35)',
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#514163' }}
        >
          <Trophy className="w-4 h-4" style={{ color: '#fdda36' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body text-xs font-medium" style={{ color: '#92400e' }}>
            {language === 'es' ? 'Planificando para' : 'Planning for'}
          </p>
          <p className="font-heading text-sm font-bold truncate" style={{ color: '#1f2937' }}>
            {selectedAthlete.full_name}
          </p>
        </div>
        <button
          onClick={onClear}
          className="p-1.5 rounded-lg transition-colors hover:bg-white/50"
          style={{ color: '#92400e' }}
          title={language === 'es' ? 'Cambiar atleta' : 'Change athlete'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => setShowDropdown((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white transition-all hover:shadow-md"
        style={{ border: '2px solid #e5e7eb' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(81,65,99,0.08)' }}
        >
          <Users className="w-4 h-4" style={{ color: '#514163' }} />
        </div>
        <div className="flex-1 text-left">
          <p className="font-heading text-sm font-bold" style={{ color: '#1f2937' }}>
            {language === 'es' ? 'Seleccionar Atleta' : 'Select Athlete'}
          </p>
          <p className="font-body text-xs" style={{ color: '#9ca3af' }}>
            {language === 'es' ? 'Elige para quién planificar la carrera' : 'Choose who to plan a race for'}
          </p>
        </div>
        <ChevronRight className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-90' : ''}`} style={{ color: '#9ca3af' }} />
      </button>

      {showDropdown && (
        <div
          className="mt-2 rounded-2xl bg-white overflow-hidden"
          style={{ border: '2px solid #e5e7eb', boxShadow: '0 8px 24px rgba(81,65,99,0.1)' }}
        >
          {hubFailed && (
            <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: '#fef3c7', borderBottom: '1px solid #fcd34d' }}>
              <CloudOff className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#b45309' }} />
              <span className="font-body text-xs" style={{ color: '#92400e' }}>
                {language === 'es' ? 'Hub no disponible. Atletas locales.' : 'Hub unavailable. Local athletes only.'}
              </span>
            </div>
          )}

          <div className="relative p-3">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'es' ? 'Buscar atletas...' : 'Search athletes...'}
              className="input-brand pl-9 py-2"
              autoFocus
            />
          </div>

          <div className="max-h-72 overflow-y-auto px-3 pb-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#514163' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-8 h-8 mx-auto mb-2" style={{ color: '#d1d5db' }} />
                <p className="font-body text-sm" style={{ color: '#9ca3af' }}>
                  {language === 'es' ? 'Sin atletas' : 'No athletes found'}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {filtered.map((athlete) => (
                  <button
                    key={athlete.hub_user_id || athlete.id}
                    onClick={() => handleSelectAthlete(athlete)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-gray-50"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: '#514163', color: '#fdda36' }}
                    >
                      {athlete.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-body font-semibold text-sm truncate" style={{ color: '#1f2937' }}>
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
        </div>
      )}
    </div>
  );
}
