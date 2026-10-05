/*
# Race Assignments & Notifications

## Purpose
Extends the Race Planner so coaches can assign races to athletes, push them
to the athlete's Hub calendar, and notify the athlete when a race is created,
edited, or deleted by the coach.

## New Tables

### 1. `race_assignments`
Links a coach-created race (in `competitions`) to a target athlete.
- `id` (uuid, PK)
- `competition_id` (uuid, FK → competitions ON DELETE CASCADE) — the race plan
- `coach_id` (text) — the coach's hub_user_id (matches the athlete_id pattern used across the app)
- `coach_name` (text) — coach display name for the badge
- `athlete_id` (text) — the athlete's hub_user_id (same key used in competitions.athlete_id)
- `athlete_email` (text) — athlete email (used for Hub push)
- `assigned_at` (timestamptz) — when the coach first assigned the race
- `is_new` (boolean, default true) — drives the "New" badge for the athlete
- `status` (text: 'active' | 'edited' | 'deleted') — lifecycle of the assignment
- `last_updated_by` (text) — 'coach' | 'athlete' | null
- `notification_sent` (boolean, default false) — whether the athlete was notified
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### 2. `race_assignment_notifications`
Per-athlete notification feed for race assignment changes.
- `id` (uuid, PK)
- `assignment_id` (uuid, FK → race_assignments ON DELETE CASCADE)
- `athlete_id` (text) — the athlete's hub_user_id (for filtering)
- `competition_id` (uuid) — the race this notification is about
- `type` (text: 'assigned' | 'edited' | 'deleted')
- `message` (text) — human-readable message
- `coach_name` (text)
- `race_name` (text)
- `read` (boolean, default false) — athlete has seen it
- `created_at` (timestamptz, default now())

## Security
- RLS enabled on both tables.
- Policies scoped to `anon, authenticated` (the app uses hub-auth with anon key, matching the existing competitions table pattern).
- All CRUD allowed for anon/authenticated since access control is client-side via athlete_id (same pattern as competitions table).

## Important Notes
1. Both tables use text-based `athlete_id` / `coach_id` matching the existing `competitions.athlete_id` text column pattern.
2. `race_assignments.competition_id` cascades on delete — if a competition is deleted, its assignment and notifications are automatically removed.
3. The `is_new` flag is set to true on creation and flipped to false when the athlete views the race.
4. The `status` field tracks lifecycle: 'active' (initial), 'edited' (coach updated), 'deleted' (coach removed).
*/

CREATE TABLE IF NOT EXISTS race_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid REFERENCES competitions(id) ON DELETE CASCADE,
  coach_id text NOT NULL,
  coach_name text NOT NULL DEFAULT '',
  athlete_id text NOT NULL,
  athlete_email text,
  assigned_at timestamptz DEFAULT now(),
  is_new boolean DEFAULT true,
  status text NOT NULL DEFAULT 'active',
  last_updated_by text,
  notification_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE race_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_race_assignments" ON race_assignments;
CREATE POLICY "anon_select_race_assignments"
ON race_assignments FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_race_assignments" ON race_assignments;
CREATE POLICY "anon_insert_race_assignments"
ON race_assignments FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_race_assignments" ON race_assignments;
CREATE POLICY "anon_update_race_assignments"
ON race_assignments FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_race_assignments" ON race_assignments;
CREATE POLICY "anon_delete_race_assignments"
ON race_assignments FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS race_assignment_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES race_assignments(id) ON DELETE CASCADE,
  athlete_id text NOT NULL,
  competition_id uuid,
  type text NOT NULL DEFAULT 'assigned',
  message text NOT NULL DEFAULT '',
  coach_name text,
  race_name text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE race_assignment_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_race_notifications" ON race_assignment_notifications;
CREATE POLICY "anon_select_race_notifications"
ON race_assignment_notifications FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_race_notifications" ON race_assignment_notifications;
CREATE POLICY "anon_insert_race_notifications"
ON race_assignment_notifications FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_race_notifications" ON race_assignment_notifications;
CREATE POLICY "anon_update_race_notifications"
ON race_assignment_notifications FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_race_notifications" ON race_assignment_notifications;
CREATE POLICY "anon_delete_race_notifications"
ON race_assignment_notifications FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_race_assignments_athlete_id ON race_assignments(athlete_id);
CREATE INDEX IF NOT EXISTS idx_race_assignments_competition_id ON race_assignments(competition_id);
CREATE INDEX IF NOT EXISTS idx_race_assignments_coach_id ON race_assignments(coach_id);
CREATE INDEX IF NOT EXISTS idx_race_notifications_athlete_id ON race_assignment_notifications(athlete_id);
CREATE INDEX IF NOT EXISTS idx_race_notifications_read ON race_assignment_notifications(athlete_id, read);
