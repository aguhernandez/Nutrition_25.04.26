import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Loader2, Trophy, Droplets, Flame } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Sport } from '../../types/race';
import { getSportConfig } from '../../config/sports';
import { getTagsForCompetition } from '../../lib/tagService';
import type { Tag } from '../../lib/tagService';

interface SavedCompetition {
  id: string;
  sport: Sport;
  race_name: string;
  race_data: {
    distance: number;
    distanceUnit: string;
    expectedDurationMin: number;
    temperature: number;
    raceDate?: string;
  };
  strategy_output: {
    carbs?: { recommendedIntakeGH: number };
    hydration?: { fluidIntakeLH: number };
    pacing?: { intensityPercent: number };
    risks?: { level: string }[];
  };
  created_at: string;
}

interface Props {
  onBack: () => void;
}

export default function SavedRaces({ onBack }: Props) {
  const [races, setRaces] = useState<SavedCompetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagsByRaceId, setTagsByRaceId] = useState<Record<string, Tag[]>>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('competitions')
        .select('id, sport, race_name, race_data, strategy_output, created_at')
        .order('created_at', { ascending: false });
      const loaded = (data as SavedCompetition[]) ?? [];
      setRaces(loaded);
      setLoading(false);
      loaded.forEach((race) => {
        getTagsForCompetition(race.id).then((tags) => {
          setTagsByRaceId((prev) => ({ ...prev, [race.id]: tags }));
        });
      });
    })();
  }, []);

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto animate-slide-up">
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-[#1f2937]">Saved Races</h1>
        <p className="font-body text-sm text-[#9ca3af] mt-1">Your competition history and race plans</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} />
        </div>
      ) : races.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ backgroundColor: 'rgba(253,218,54,0.15)', border: '2px solid rgba(253,218,54,0.35)' }}
          >
            <Trophy className="w-8 h-8" style={{ color: '#514163' }} />
          </div>
          <h2 className="font-heading text-lg text-[#1f2937] mb-2">No races saved yet</h2>
          <p className="font-body text-sm text-[#9ca3af] mb-6 max-w-xs">
            Plan your first race and save the strategy to see it here.
          </p>
          <button onClick={onBack} className="btn-primary">
            Plan a Race
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {races.map((race) => {
            const cfg = getSportConfig(race.sport);
            const hasCritical = (race.strategy_output?.risks ?? []).some((r) => r.level === 'critical');
            const hasRisks = (race.strategy_output?.risks ?? []).length > 0;

            return (
              <div
                key={race.id}
                className="bg-white rounded-2xl p-5 transition-all duration-200"
                style={{ border: '2px solid #e5e7eb', boxShadow: '0 2px 8px rgba(81,65,99,0.05)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#fdda36';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(253,218,54,0.18)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(81,65,99,0.05)';
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: 'rgba(253,218,54,0.18)' }}
                    >
                      <span className="font-heading text-xs font-bold" style={{ color: '#514163' }}>
                        {cfg.label.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-body font-bold text-[#1f2937]">{race.race_name}</h3>
                      <span className="font-body text-xs text-[#9ca3af]">{cfg.label}</span>
                    </div>
                  </div>
                  {hasCritical ? (
                    <span className="badge badge-red">Critical Flag</span>
                  ) : hasRisks ? (
                    <span className="badge badge-yellow">Warning</span>
                  ) : (
                    <span className="badge badge-green">No Flags</span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: MapPin, label: 'Distance', value: `${race.race_data.distance} ${race.race_data.distanceUnit}`, color: '#1f2937' },
                    { icon: Clock, label: 'Duration', value: formatDuration(race.race_data.expectedDurationMin), color: '#1f2937' },
                    { icon: Flame, label: 'Carbs', value: `${race.strategy_output?.carbs?.recommendedIntakeGH ?? '–'} g/h`, color: '#b45309' },
                    { icon: Droplets, label: 'Fluid', value: `${race.strategy_output?.hydration?.fluidIntakeLH ?? '–'} L/h`, color: '#2563eb' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="rounded-xl p-3 bg-[#f9fafb] border border-[#f3f4f6]">
                      <div className="font-body text-xs text-[#9ca3af] mb-0.5 flex items-center gap-1">
                        <Icon className="w-3 h-3" /> {label}
                      </div>
                      <div className="font-body font-semibold text-sm" style={{ color }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {(tagsByRaceId[race.id] ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(tagsByRaceId[race.id] ?? []).map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: tag.color + '18', color: tag.color, border: `1px solid ${tag.color}33` }}
                      >
                        {tag.name_es || tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f3f4f6]">
                  <div className="flex items-center gap-1 font-body text-xs text-[#9ca3af]">
                    <Calendar className="w-3 h-3" />
                    {new Date(race.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </div>
                  <div className="font-body text-xs text-[#9ca3af]">
                    {race.race_data.temperature}°C &middot; {race.strategy_output?.pacing?.intensityPercent ?? '–'}% VO2
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
