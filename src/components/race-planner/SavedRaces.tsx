import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Loader2, Trophy, Droplets, Flame, Pencil, Trash2, ExternalLink, UserCheck, Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import type { Sport, Competition } from '../../types/race';
import { getSportConfig } from '../../config/sports';
import { getTagsForCompetition } from '../../lib/tagService';
import type { Tag } from '../../lib/tagService';
import {
  getAssignmentsForAthlete,
  getUnreadNotifications,
  markNotificationsRead,
  markRaceAssignmentDeleted,
  clearIsNewFlag,
  type RaceAssignment,
  type RaceAssignmentNotification,
} from '../../lib/raceAssignmentService';

interface SavedCompetition {
  id: string;
  sport: Sport;
  race_name: string;
  race_date: string | null;
  race_data: Record<string, unknown>;
  athlete_data: Record<string, unknown>;
  strategy_preferences: Record<string, unknown>;
  strategy_output: {
    carbs?: { recommendedIntakeGH: number };
    hydration?: { fluidIntakeLH: number };
    pacing?: { intensityPercent: number };
    risks?: { level: string }[];
    [key: string]: unknown;
  };
  created_at: string;
  created_by?: string | null;
  athlete_id?: string | null;
}

interface Props {
  onBack: () => void;
  onEdit: (competition: Competition) => void;
}

export default function SavedRaces({ onBack, onEdit }: Props) {
  const { user, profile } = useAuth();
  const [races, setRaces] = useState<SavedCompetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagsByRaceId, setTagsByRaceId] = useState<Record<string, Tag[]>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteErrorId, setDeleteErrorId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Record<string, RaceAssignment>>({});
  const [notifications, setNotifications] = useState<RaceAssignmentNotification[]>([]);
  const [athleteNames, setAthleteNames] = useState<Record<string, string>>({});

  const isCoach = profile?.role === 'coach' || profile?.role === 'admin';

  const loadRaces = async () => {
    const myId = profile?.hub_user_id || user?.id || null;
    if (!myId) { setLoading(false); return; }

    let query = supabase
      .from('competitions')
      .select('id, sport, race_name, race_date, race_data, athlete_data, strategy_preferences, strategy_output, created_at, created_by, athlete_id')
      .order('created_at', { ascending: false });

    if (isCoach) {
      query = query.or(`athlete_id.eq.${myId},created_by.eq.${myId}`);
    } else {
      query = query.eq('athlete_id', myId);
    }

    const { data, error } = await query;

    if (error) console.error('Load races error:', error);
    const loaded = (data as SavedCompetition[]) ?? [];
    setRaces(loaded);
    setLoading(false);

    loaded.forEach((race) => {
      getTagsForCompetition(race.id).then((tags) => {
        setTagsByRaceId((prev) => ({ ...prev, [race.id]: tags }));
      });
    });

    if (isCoach) {
      const athleteIds = [...new Set(loaded.map((r) => r.athlete_id).filter((id): id is string => !!id && id !== myId))];
      if (athleteIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('hub_user_id, full_name, email')
          .in('hub_user_id', athleteIds);
        const nameMap: Record<string, string> = {};
        for (const p of profilesData ?? []) {
          nameMap[p.hub_user_id] = p.full_name || p.email;
        }
        setAthleteNames(nameMap);
      }

      const { data: myAssigns } = await supabase
        .from('race_assignments')
        .select('*')
        .eq('coach_id', myId)
        .in('status', ['active', 'edited']);
      const assignMap: Record<string, RaceAssignment> = {};
      for (const a of myAssigns ?? []) {
        assignMap[a.competition_id] = a as RaceAssignment;
      }
      setAssignments(assignMap);
    } else {
      const assigns = await getAssignmentsForAthlete(myId);
      const assignMap: Record<string, RaceAssignment> = {};
      for (const a of assigns) {
        assignMap[a.competition_id] = a;
      }
      setAssignments(assignMap);

      const notifs = await getUnreadNotifications(myId);
      setNotifications(notifs);
    }
  };

  useEffect(() => { loadRaces(); }, []);

  const handleViewNotifications = async () => {
    const athleteId = profile?.hub_user_id || user?.id;
    if (!athleteId) return;
    await markNotificationsRead(athleteId);
    setNotifications([]);
  };

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  const handleEdit = (race: SavedCompetition) => {
    const assignment = assignments[race.id];
    if (assignment?.is_new) {
      clearIsNewFlag(race.id);
    }
    const competition: Competition = {
      id: race.id,
      sport: race.sport,
      raceName: race.race_name,
      raceDate: race.race_date ?? (race.race_data.raceDate as string | undefined),
      raceData: race.race_data as Competition['raceData'],
      athleteData: race.athlete_data as Competition['athleteData'],
      strategyPreferences: race.strategy_preferences as Competition['strategyPreferences'],
      strategyOutput: race.strategy_output as Competition['strategyOutput'],
    };
    onEdit(competition);
  };

  const confirmDelete = (id: string) => { setDeleteErrorId(null); setDeleteConfirmId(id); };
  const cancelDelete = () => { setDeleteConfirmId(null); setDeleteErrorId(null); };

  const doDelete = async (id: string) => {
    setDeletingId(id);
    setDeleteErrorId(null);
    const race = races.find((r) => r.id === id);
    const assignment = assignments[id];

    if (assignment) {
      await markRaceAssignmentDeleted(id, race?.race_name ?? '', assignment.coach_name);
    }

    const { data, error } = await supabase
      .from('competitions')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();
    if (error || !data) {
      console.error('Delete race error:', error);
      setDeleteErrorId(id);
      setDeletingId(null);
      return;
    }
    if (data) {
      setRaces((prev) => prev.filter((r) => r.id !== id));
      setTagsByRaceId((prev) => { const n = { ...prev }; delete n[id]; return n; });
      setAssignments((prev) => { const n = { ...prev }; delete n[id]; return n; });
    }
    setDeletingId(null);
    setDeleteConfirmId(null);
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto animate-slide-up">
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-[#1f2937]">Saved Races</h1>
        <p className="font-body text-sm text-[#9ca3af] mt-1">Your competition history and race plans</p>
      </div>

      {notifications.length > 0 && (
        <div
          className="mb-4 rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all hover:shadow-md"
          style={{ backgroundColor: '#eff6ff', border: '2px solid #bfdbfe' }}
          onClick={handleViewNotifications}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#2563eb' }}
          >
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-body font-semibold text-sm" style={{ color: '#1e3a8a' }}>
              {notifications.length} new {notifications.length === 1 ? 'notification' : 'notifications'}
            </p>
            <p className="font-body text-xs mt-0.5" style={{ color: '#3b82f6' }}>
              {notifications.map((n) => n.message).slice(0, 2).join(' · ')}
              {notifications.length > 2 && ` +${notifications.length - 2} more`}
            </p>
          </div>
          <span className="font-body text-xs font-semibold" style={{ color: '#2563eb' }}>Dismiss</span>
        </div>
      )}

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
          <button onClick={onBack} className="btn-primary">Plan a Race</button>
        </div>
      ) : (
        <div className="space-y-3">
          {races.map((race) => {
            const cfg = getSportConfig(race.sport);
            const hasCritical = (race.strategy_output?.risks ?? []).some((r) => r.level === 'critical');
            const hasRisks = (race.strategy_output?.risks ?? []).length > 0;
            const isDeleting = deletingId === race.id;
            const isConfirmingDelete = deleteConfirmId === race.id;
            const distance = race.race_data.distance as number;
            const distanceUnit = race.race_data.distanceUnit as string;
            const durationMin = race.race_data.expectedDurationMin as number;
            const temperature = race.race_data.temperature as number;
            const assignment = assignments[race.id];
            const isCoachAssigned = !!assignment;
            const isNewBadge = assignment?.is_new;
            const athleteId = race.athlete_id;
            const athleteName = athleteId ? athleteNames[athleteId] : null;
            const isCreatedByMe = isCoach && race.created_by === (profile?.hub_user_id || user?.id);

            return (
              <div
                key={race.id}
                className="bg-white rounded-2xl p-5 transition-all duration-200"
                style={{
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(81,65,99,0.05)',
                  ...(isNewBadge ? { borderColor: '#fdba74' } : {}),
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#fdda36';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(253,218,54,0.18)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = isNewBadge ? '#fdba74' : '#e5e7eb';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(81,65,99,0.05)';
                }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: 'rgba(253,218,54,0.18)' }}
                    >
                      <span className="font-heading text-xs font-bold" style={{ color: '#514163' }}>
                        {cfg.label.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-body font-bold text-[#1f2937] truncate">{race.race_name}</h3>
                        {isCoachAssigned && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}
                          >
                            <UserCheck className="w-3 h-3" />
                            {assignment?.status === 'edited' ? 'Updated by Coach' : 'Assigned by Coach'}
                          </span>
                        )}
                        {isCreatedByMe && athleteName && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
                          >
                            <UserCheck className="w-3 h-3" />
                            {athleteName}
                          </span>
                        )}
                        {isNewBadge && (
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold animate-pulse"
                            style={{ backgroundColor: '#fb923c', color: '#fff' }}
                          >
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="font-body text-xs text-[#9ca3af]">{cfg.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
                    {hasCritical ? (
                      <span className="badge badge-red">Critical Flag</span>
                    ) : hasRisks ? (
                      <span className="badge badge-yellow">Warning</span>
                    ) : (
                      <span className="badge badge-green">No Flags</span>
                    )}

                    {!isConfirmingDelete && (
                      <>
                        <button
                          onClick={() => handleEdit(race)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-body text-xs font-medium transition-colors"
                          style={{ backgroundColor: 'rgba(253,218,54,0.15)', color: '#514163', border: '1px solid rgba(253,218,54,0.4)' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(253,218,54,0.3)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(253,218,54,0.15)'; }}
                          title="Open race plan"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Edit Plan
                        </button>
                        <button
                          onClick={() => confirmDelete(race.id)}
                          className="p-1.5 rounded-lg text-[#9ca3af] hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Delete confirmation */}
                {isConfirmingDelete && (
                  <div className="mb-4 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100">
                    <span className="font-body text-xs text-red-600 flex-1">{deleteErrorId === race.id ? 'Could not delete this race. Check your connection and try again.' : 'Delete this race plan? This cannot be undone.'}</span>
                    <button
                      onClick={() => doDelete(race.id)}
                      disabled={isDeleting}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                    >
                      {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      Delete
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="px-3 py-1 rounded-lg bg-white border border-[#e5e7eb] text-xs text-[#6b7280] hover:bg-[#f9fafb] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: MapPin, label: 'Distance', value: `${distance} ${distanceUnit}`, color: '#1f2937' },
                    { icon: Clock, label: 'Duration', value: formatDuration(durationMin), color: '#1f2937' },
                    { icon: Flame, label: 'Carbs', value: `${race.strategy_output?.carbs?.recommendedIntakeGH ?? '–'} g/h`, color: '#b45309' },
                    { icon: Droplets, label: 'Fluid', value: `${race.strategy_output?.hydration?.fluidIntakeLH ?? '–'} L/h`, color: '#2563eb' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="rounded-xl p-3 bg-[#f9fafb] border border-[#f3f4f6]">
                      <div className="font-body text-xs text-[#9ca3af] mb-0.5 flex items-center gap-1">
                        <Icon className="w-3 h-3" /> {label}
                      </div>
                      <div className="font-body font-semibold text-sm" style={{ color }}>{value}</div>
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
                    {(() => {
                      const d = race.race_date || (race.race_data.raceDate as string | undefined);
                      if (!d) return '—';
                      return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      });
                    })()}
                  </div>
                  <div className="font-body text-xs text-[#9ca3af]">
                    {temperature}°C &middot; {race.strategy_output?.pacing?.intensityPercent ?? '–'}% VO2
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
