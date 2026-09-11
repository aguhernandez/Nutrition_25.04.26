import { useState, useEffect } from 'react';
import { Fingerprint, Search, ArrowLeft, Users, CloudOff, RefreshCw } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';
import { supabase } from '../../lib/supabase';
import { getCoachAthletes, type HubCoachAthlete } from '../../lib/hubApi';
import HubBiologicalPassport from '../nutrition/HubBiologicalPassport';
import TrainingSneakPeek from './TrainingSneakPeek';

interface AthleteRow {
  id: string;
  email: string;
  full_name: string;
  hub_user_id?: string;
  hasLocalProfile?: boolean;
}

export default function BiologicalPassportView() {
  const { user, profile } = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';

  const role = profile?.role;
  const isCoachOrAdmin = role === 'coach' || role === 'admin' || role === 'trainer' || role === 'nutritionist';

  // Coach state
  const [athletes, setAthletes] = useState<AthleteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [hubFailed, setHubFailed] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AthleteRow | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Athlete own passport
  const ownHubTarget = profile?.hub_user_id ?? user?.email ?? null;
  const ownAthleteId = profile?.id ?? user?.id ?? '';

  useEffect(() => {
    if (!isCoachOrAdmin) {
      setLoading(false);
      return;
    }
    if (!user?.id || user.id.startsWith('demo-')) {
      setLoading(false);
      return;
    }
    (async () => {
      setHubFailed(false);

      const { data: localData } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, hub_user_id')
        .eq('role', 'athlete')
        .order('full_name', { ascending: true });

      const localAthletes: AthleteRow[] = (localData ?? []).map((p: Record<string, unknown>) => ({
        id: p.id as string,
        email: p.email as string,
        full_name: p.full_name as string,
        hub_user_id: p.hub_user_id as string | undefined,
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
    })();
  }, [user?.id, isCoachOrAdmin, profile?.hub_user_id, profile?.email]);

  const openAthlete = async (ap: AthleteRow) => {
    setDetailLoading(true);
    let effectiveId = ap.id;
    if (!ap.hasLocalProfile && ap.hub_user_id) {
      const { data } = await supabase
        .from('profiles')
        .upsert({
          hub_user_id: ap.hub_user_id,
          email: ap.email,
          full_name: ap.full_name,
          role: 'athlete',
          membership_slug: 'inicia',
          membership_name: 'Asciende Inicia',
        }, { onConflict: 'hub_user_id' })
        .select()
        .maybeSingle();
      if (data) {
        effectiveId = data.id;
        setAthletes((prev) =>
          prev.map((a) => a.email === ap.email ? { ...a, id: data.id, hasLocalProfile: true } : a)
        );
      }
    }
    setSelected({ ...ap, id: effectiveId });
    setDetailLoading(false);
  };

  const filtered = athletes.filter(
    (a) =>
      a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      (a.hub_user_id ?? '').toLowerCase().includes(search.toLowerCase())
  );

  // ─── Coach: selected athlete passport ──────────────────────────
  if (isCoachOrAdmin && selected) {
    const hubTarget = selected.hub_user_id ?? selected.email;
    return (
      <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setSelected(null)}
            className="p-2 rounded-xl border transition-all hover:bg-gray-50"
            style={{ borderColor: '#e5e7eb' }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#514163', color: '#fdda36' }}>
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg" style={{ color: '#1f2937' }}>{selected.full_name}</h2>
              <p className="font-body text-xs" style={{ color: '#9ca3af' }}>{selected.email}</p>
            </div>
          </div>
        </div>

        <HubBiologicalPassport athleteEmail={hubTarget} athleteName={selected.full_name} />
        <TrainingSneakPeek athleteId={selected.id} athleteEmail={hubTarget} />
      </div>
    );
  }

  // ─── Coach: athlete search list ──────────────────────────────────
  if (isCoachOrAdmin) {
    return (
      <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#514163' }}>
            <Fingerprint className="w-6 h-6" style={{ color: '#fdda36' }} />
          </div>
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold" style={{ color: '#1f2937' }}>
              {es ? 'Pasaporte Biológico' : 'Biological Passport'}
            </h1>
            <p className="font-body text-sm mt-1" style={{ color: '#6b7280' }}>
              {es ? 'Busca y visualiza el pasaporte biológico de tus atletas asignados' : 'Search and view the biological passport of your assigned athletes'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border bg-white" style={{ borderColor: '#e5e7eb' }}>
          <Search className="w-4 h-4" style={{ color: '#9ca3af' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={es ? 'Buscar por nombre, email o ID...' : 'Search by name, email or ID...'}
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: '#1f2937' }}
          />
        </div>

        {hubFailed && (
          <div className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: '#fef9c3', border: '1px solid #fcd34d' }}>
            <CloudOff className="w-5 h-5 flex-shrink-0" style={{ color: '#b45309' }} />
            <p className="text-sm" style={{ color: '#92400e' }}>
              {es ? 'No se pudo conectar con el Hub. Mostrando solo atletas locales.' : 'Could not reach Hub. Showing local athletes only.'}
            </p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center min-h-64">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#fdda36', borderTopColor: 'transparent' }} />
          </div>
        )}

        {detailLoading && (
          <div className="flex items-center justify-center min-h-32">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#fdda36', borderTopColor: 'transparent' }} />
          </div>
        )}

        {!loading && !detailLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(253,218,54,0.15)', border: '2px solid rgba(253,218,54,0.3)' }}>
              <Users className="w-8 h-8" style={{ color: '#514163' }} />
            </div>
            <h3 className="font-heading text-lg mb-2" style={{ color: '#1f2937' }}>
              {es ? 'Sin resultados' : 'No results'}
            </h3>
            <p className="text-sm max-w-sm" style={{ color: '#9ca3af' }}>
              {search
                ? es ? `No se encontraron atletas para "${search}"` : `No athletes matching "${search}"`
                : es ? 'No tienes atletas asignados todavía.' : 'You have no assigned athletes yet.'}
            </p>
          </div>
        )}

        {!loading && !detailLoading && filtered.length > 0 && (
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
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                      {es ? 'Atleta' : 'Athlete'}
                    </span>
                    {athlete.hasLocalProfile === false && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
                        Hub
                      </span>
                    )}
                  </div>
                </div>
                <Fingerprint className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#9ca3af' }} />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Athlete: own passport ───────────────────────────────────────
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#514163' }}>
          <Fingerprint className="w-6 h-6" style={{ color: '#fdda36' }} />
        </div>
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold" style={{ color: '#1f2937' }}>
            {es ? 'Pasaporte Biológico' : 'Biological Passport'}
          </h1>
          <p className="font-body text-sm mt-1" style={{ color: '#6b7280' }}>
            {es
              ? 'Tus datos fisiológicos, zonas de entrenamiento y gasto calórico desde el Hub'
              : 'Your physiological data, training zones, and caloric expenditure from the Hub'}
          </p>
        </div>
      </div>

      {ownHubTarget ? (
        <>
          <HubBiologicalPassport athleteEmail={ownHubTarget} athleteName={profile?.full_name} />
          <TrainingSneakPeek athleteId={ownAthleteId} athleteEmail={ownHubTarget} />
        </>
      ) : (
        <div className="card-brand p-8 text-center">
          <Fingerprint className="w-12 h-12 mx-auto mb-3" style={{ color: '#d1d5db' }} />
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            {es
              ? 'No hay conexión con el Hub. Inicia sesión para ver tus datos.'
              : 'No Hub connection. Sign in to view your data.'}
          </p>
        </div>
      )}
    </div>
  );
}
