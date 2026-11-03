import { useEffect, useState } from 'react';
import { ClipboardList, BookOpen, ChevronLeft, Search, UserRound, Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';
import { getCoachAthletes } from '../../lib/hubApi';
import NutritionAnamnesisV2 from './NutritionAnamnesisV2';
import FoodDiary24h from './FoodDiary24h';

interface Props { onBack: () => void; }
interface Athlete { id: string; email: string; full_name: string; }

export default function HubAssessmentsView({ onBack }: Props) {
  const { profile } = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';
  const isProfessional = ['coach', 'trainer', 'nutritionist', 'head_coach', 'admin'].includes(profile?.role || '');
  const [tab, setTab] = useState<'anamnesis' | 'diary'>('anamnesis');
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selected, setSelected] = useState<Athlete | null>(isProfessional ? null : profile ? { id: profile.id, email: profile.email || '', full_name: profile.full_name || '' } : null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(isProfessional);

  useEffect(() => {
    if (!isProfessional) return;
    (async () => {
      try {
        const hub = await getCoachAthletes(profile?.hub_user_id || profile?.email || '');
        const authorizedAthletes = (hub.athletes || []).map((athlete) => ({
          id: athlete.id,
          email: athlete.email,
          full_name: athlete.full_name || athlete.name || athlete.email,
        }));
        setAthletes(authorizedAthletes.sort((a, b) => a.full_name.localeCompare(b.full_name)));
      } catch {
        // Never fall back to the local profiles table: it is not a coach roster.
        setAthletes([]);
      }
      setLoading(false);
    })();
  }, [isProfessional, profile?.email, profile?.hub_user_id]);

  if (!selected) {
    const filtered = athletes.filter(a => `${a.full_name} ${a.email}`.toLowerCase().includes(search.toLowerCase()));
    return <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <button onClick={onBack} className="btn-ghost flex items-center gap-2 mb-6"><ChevronLeft className="w-4 h-4" />{es ? 'Volver' : 'Back'}</button>
      <h1 className="font-heading text-2xl font-bold mb-1" style={{ color: '#1f2937' }}>{es ? 'Anamnesis / 24 horas' : 'Anamnesis / 24 hours'}</h1>
      <p className="text-sm mb-5" style={{ color: '#6b7280' }}>{es ? 'Seleccioná un atleta para consultar o editar sus evaluaciones.' : 'Select an athlete to view or edit their assessments.'}</p>
      <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} /><input value={search} onChange={e => setSearch(e.target.value)} className="input-brand pl-10" placeholder={es ? 'Buscar atleta...' : 'Search athlete...'} /></div>
      {loading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div> : <div className="space-y-2">{filtered.map(athlete => <button key={athlete.id} onClick={() => setSelected(athlete)} className="w-full flex items-center gap-3 p-4 bg-white text-left rounded-xl border hover:border-[#514163]" style={{ borderColor: '#e5e7eb' }}><UserRound className="w-5 h-5" style={{ color: '#514163' }} /><span><b style={{ color: '#1f2937' }}>{athlete.full_name}</b><small className="block" style={{ color: '#9ca3af' }}>{athlete.email}</small></span></button>)}</div>}
    </div>;
  }

  const ref = selected.id || selected.email;
  return <div className="p-4 lg:p-8 max-w-6xl mx-auto">
    <div className="flex items-center gap-3 mb-6"><button onClick={isProfessional ? () => setSelected(null) : onBack} className="btn-ghost p-2"><ChevronLeft className="w-5 h-5" /></button><div><h1 className="font-heading text-2xl font-bold" style={{ color: '#1f2937' }}>{es ? 'Anamnesis / 24 horas' : 'Anamnesis / 24 hours'}</h1><p className="text-sm" style={{ color: '#6b7280' }}>{selected.full_name}</p></div></div>
    <div className="flex gap-2 border-b mb-6" style={{ borderColor: '#e5e7eb' }}>
      <button onClick={() => setTab('anamnesis')} className="flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2" style={{ color: tab === 'anamnesis' ? '#514163' : '#9ca3af', borderColor: tab === 'anamnesis' ? '#fdda36' : 'transparent' }}><ClipboardList className="w-4 h-4" />{es ? 'Anamnesis' : 'Anamnesis'}</button>
      <button onClick={() => setTab('diary')} className="flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2" style={{ color: tab === 'diary' ? '#514163' : '#9ca3af', borderColor: tab === 'diary' ? '#fdda36' : 'transparent' }}><BookOpen className="w-4 h-4" />{es ? '24 horas' : '24 hours'}</button>
    </div>
    {tab === 'anamnesis' ? <NutritionAnamnesisV2 onBack={onBack} targetAthleteId={ref} targetAthleteEmail={selected.email} /> : <FoodDiary24h onClose={onBack} embedded targetAthleteId={ref} targetAthleteEmail={selected.email} />}
  </div>;
}
