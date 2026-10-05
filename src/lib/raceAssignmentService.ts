import { supabase } from './supabase';

export interface RaceAssignment {
  id: string;
  competition_id: string;
  coach_id: string;
  coach_name: string;
  athlete_id: string;
  athlete_email: string | null;
  assigned_at: string;
  is_new: boolean;
  status: 'active' | 'edited' | 'deleted';
  last_updated_by: string | null;
  notification_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface RaceAssignmentNotification {
  id: string;
  assignment_id: string;
  athlete_id: string;
  competition_id: string;
  type: 'assigned' | 'edited' | 'deleted';
  message: string;
  coach_name: string | null;
  race_name: string | null;
  read: boolean;
  created_at: string;
}

/**
 * Creates a race assignment linking a coach-created race to an athlete.
 * Also creates a notification for the athlete.
 */
export async function createRaceAssignment(params: {
  competitionId: string;
  coachId: string;
  coachName: string;
  athleteId: string;
  athleteEmail?: string;
  raceName: string;
}): Promise<RaceAssignment | null> {
  const { data, error } = await supabase
    .from('race_assignments')
    .insert({
      competition_id: params.competitionId,
      coach_id: params.coachId,
      coach_name: params.coachName,
      athlete_id: params.athleteId,
      athlete_email: params.athleteEmail ?? null,
      is_new: true,
      status: 'active',
      last_updated_by: 'coach',
      notification_sent: true,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('[raceAssignmentService] create error:', error);
    return null;
  }

  await supabase.from('race_assignment_notifications').insert({
    assignment_id: data.id,
    athlete_id: params.athleteId,
    competition_id: params.competitionId,
    type: 'assigned',
    message: `${params.coachName} te asignó la carrera "${params.raceName}"`,
    coach_name: params.coachName,
    race_name: params.raceName,
    read: false,
  });

  return data as RaceAssignment;
}

/**
 * Updates an existing assignment to 'edited' status and notifies the athlete.
 */
export async function markRaceAssignmentEdited(
  competitionId: string,
  raceName: string,
  coachName: string,
): Promise<void> {
  const { data: assignment } = await supabase
    .from('race_assignments')
    .select('id, athlete_id')
    .eq('competition_id', competitionId)
    .eq('status', 'active')
    .maybeSingle();

  if (!assignment) return;

  await supabase
    .from('race_assignments')
    .update({ status: 'edited', is_new: false, last_updated_by: 'coach', updated_at: new Date().toISOString() })
    .eq('id', assignment.id);

  await supabase.from('race_assignment_notifications').insert({
    assignment_id: assignment.id,
    athlete_id: assignment.athlete_id,
    competition_id: competitionId,
    type: 'edited',
    message: `${coachName} editó la carrera "${raceName}"`,
    coach_name: coachName,
    race_name: raceName,
    read: false,
  });
}

/**
 * Marks an assignment as deleted and notifies the athlete. Does NOT delete the
 * competition row (the caller does that); just updates assignment status.
 */
export async function markRaceAssignmentDeleted(
  competitionId: string,
  raceName: string,
  coachName: string,
): Promise<void> {
  const { data: assignment } = await supabase
    .from('race_assignments')
    .select('id, athlete_id')
    .eq('competition_id', competitionId)
    .eq('status', 'active', )
    .maybeSingle();

  if (!assignment) {
    const { data: editedAssign } = await supabase
      .from('race_assignments')
      .select('id, athlete_id')
      .eq('competition_id', competitionId)
      .maybeSingle();
    if (!editedAssign) return;
    await doDeleteNotification(editedAssign.id, editedAssign.athlete_id, competitionId, raceName, coachName);
    return;
  }

  await doDeleteNotification(assignment.id, assignment.athlete_id, competitionId, raceName, coachName);
}

async function doDeleteNotification(
  assignmentId: string,
  athleteId: string,
  competitionId: string,
  raceName: string,
  coachName: string,
): Promise<void> {
  await supabase
    .from('race_assignments')
    .update({ status: 'deleted', is_new: false, last_updated_by: 'coach', updated_at: new Date().toISOString() })
    .eq('id', assignmentId);

  await supabase.from('race_assignment_notifications').insert({
    assignment_id: assignmentId,
    athlete_id: athleteId,
    competition_id: competitionId,
    type: 'deleted',
    message: `${coachName} eliminó la carrera "${raceName}"`,
    coach_name: coachName,
    race_name: raceName,
    read: false,
  });
}

/**
 * Fetches all assignments for an athlete (for the athlete's SavedRaces view).
 */
export async function getAssignmentsForAthlete(
  athleteId: string,
): Promise<RaceAssignment[]> {
  const { data, error } = await supabase
    .from('race_assignments')
    .select('*')
    .eq('athlete_id', athleteId)
    .in('status', ['active', 'edited'])
    .order('assigned_at', { ascending: false });

  if (error) {
    console.error('[raceAssignmentService] fetch for athlete error:', error);
    return [];
  }
  return (data ?? []) as RaceAssignment[];
}

/**
 * Fetches unread notifications for an athlete.
 */
export async function getUnreadNotifications(
  athleteId: string,
): Promise<RaceAssignmentNotification[]> {
  const { data, error } = await supabase
    .from('race_assignment_notifications')
    .select('*')
    .eq('athlete_id', athleteId)
    .eq('read', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[raceAssignmentService] notifications error:', error);
    return [];
  }
  return (data ?? []) as RaceAssignmentNotification[];
}

/**
 * Marks all notifications for an athlete as read.
 */
export async function markNotificationsRead(athleteId: string): Promise<void> {
  await supabase
    .from('race_assignment_notifications')
    .update({ read: true })
    .eq('athlete_id', athleteId)
    .eq('read', false);
}

/**
 * Clears the "is_new" flag on an assignment (athlete has seen the race).
 */
export async function clearIsNewFlag(competitionId: string): Promise<void> {
  await supabase
    .from('race_assignments')
    .update({ is_new: false })
    .eq('competition_id', competitionId)
    .eq('is_new', true);
}

/**
 * Gets the assignment for a specific competition (if any).
 */
export async function getAssignmentForCompetition(
  competitionId: string,
): Promise<RaceAssignment | null> {
  const { data, error } = await supabase
    .from('race_assignments')
    .select('*')
    .eq('competition_id', competitionId)
    .maybeSingle();

  if (error) {
    console.error('[raceAssignmentService] fetch single error:', error);
    return null;
  }
  return data as RaceAssignment | null;
}
