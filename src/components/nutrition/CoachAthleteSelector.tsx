import { useState, useEffect } from 'react';
import { Search, Users, ChevronRight, Loader2, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import FullMealEditor from './FullMealEditor';

interface Athlete {
  id: string;
  email: string;
  full_name: string;
}

interface Props {
  onBack: () => void;
}

export default function CoachAthleteSelector({ onBack }: Props) {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Athlete | null>(null);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('role', 'athlete')
      .order('full_name')
      .then(({ data }) => {
        setAthletes((data ?? []) as Athlete[]);
        setLoading(false);
      });
  }, []);

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
              Meal Plans
            </h1>
            <p className="font-body text-xs mt-0.5" style={{ color: '#9ca3af' }}>
              Select an athlete to plan for
            </p>
          </div>
        </div>
      </div>

      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: '#9ca3af' }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search athletes..."
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
            No athletes found
          </h3>
          <p className="font-body text-sm" style={{ color: '#9ca3af' }}>
            {search ? 'Try a different search term' : 'No athletes are registered yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((athlete) => (
            <button
              key={athlete.id}
              onClick={() => setSelected(athlete)}
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
                <div className="font-body font-semibold" style={{ color: '#1f2937' }}>
                  {athlete.full_name}
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
