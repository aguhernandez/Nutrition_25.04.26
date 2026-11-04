/*
# Smart plan calendar drafts, append-only status history and transition rules

Phase 5 of smart nutrition planning. Additive only: no existing plan row is changed,
no existing RLS policy is dropped, and the previous quota function is kept as-is.

1. New server-only function `create_smart_calendar_plan_with_quota`
- Creates a 28-day calendar draft (duration_days, plan_mode 'calendar', start_date,
  week_pattern, day_overrides, generation_parameters) in the same transaction as the
  quota ledger row and the request-key idempotency record.
- Same advisory-lock strategy as `create_smart_plan_with_quota`.
- Initial smart_status is derived server-side: personal -> 'suggested',
  professional -> 'under_review'. The caller cannot choose it.

2. New server-only function `transition_smart_plan_status`
- Moves a smart plan through suggested, under_review, approved, published, superseded.
- Row-locked, so concurrent transitions on the same plan are serialized.
- Athletes may only move their own personal plan from suggested to approved (accept).
- Professionals may review, approve, publish and supersede plans. Their roster
  authorization is verified by the edge function before this is called.

3. New table `smart_plan_status_transitions` (append-only history)
- Filled automatically by a trigger on every smart_status change, in the same transaction.
- UPDATE, DELETE and TRUNCATE are rejected by trigger, including for service_role.
- plan_id is not a foreign key so the audit trail survives plan deletion and
  deleting a plan is never blocked by history rows.
- RLS enabled with no policies. No grants to anon or authenticated.

4. Guard on `meal_plans_v2` (trigger `meal_plans_v2_smart_guard`)
- Browser roles (anon, authenticated) cannot insert or change smart fields:
  smart_status, plan_kind, calculator_version, source_snapshot, generation_parameters,
  professional_justification, reviewed_by, reviewed_at, published_at, parent_plan_id.
- Edge functions and server code (service_role, postgres) are not restricted.
- Existing browser editing of titles, goals, day_overrides and meals is unchanged.

5. Security
- Both new functions: EXECUTE revoked from PUBLIC, anon, authenticated; granted to service_role only.
- Ledger and history tables: no browser grants.

6. Important notes
- Idempotent: functions use CREATE OR REPLACE, triggers are dropped before creation,
  and the table uses IF NOT EXISTS.
- The earlier `create_smart_plan_with_quota` remains in place for the currently deployed
  function until the updated edge function is deployed.
*/

CREATE OR REPLACE FUNCTION public.smart_plan_guard_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_privileged boolean;
BEGIN
  v_privileged := current_user IN ('postgres', 'service_role', 'supabase_admin')
    OR coalesce(NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', '') = 'service_role';

  IF v_privileged THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.smart_status IS NOT NULL
       OR NEW.plan_kind <> 'personal'
       OR NEW.calculator_version IS NOT NULL
       OR NEW.source_snapshot IS NOT NULL
       OR NEW.generation_parameters IS NOT NULL
       OR NEW.professional_justification IS NOT NULL
       OR NEW.reviewed_by IS NOT NULL
       OR NEW.reviewed_at IS NOT NULL
       OR NEW.published_at IS NOT NULL
       OR NEW.parent_plan_id IS NOT NULL THEN
      RAISE EXCEPTION 'SMART_PLAN_FORBIDDEN';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.smart_status IS DISTINCT FROM OLD.smart_status
     OR NEW.plan_kind IS DISTINCT FROM OLD.plan_kind
     OR NEW.calculator_version IS DISTINCT FROM OLD.calculator_version
     OR NEW.source_snapshot IS DISTINCT FROM OLD.source_snapshot
     OR NEW.generation_parameters IS DISTINCT FROM OLD.generation_parameters
     OR NEW.professional_justification IS DISTINCT FROM OLD.professional_justification
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
     OR NEW.published_at IS DISTINCT FROM OLD.published_at
     OR NEW.parent_plan_id IS DISTINCT FROM OLD.parent_plan_id THEN
    RAISE EXCEPTION 'SMART_PLAN_FORBIDDEN';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS meal_plans_v2_smart_guard ON public.meal_plans_v2;
CREATE TRIGGER meal_plans_v2_smart_guard
  BEFORE INSERT OR UPDATE ON public.meal_plans_v2
  FOR EACH ROW EXECUTE FUNCTION public.smart_plan_guard_fields();

CREATE TABLE IF NOT EXISTS public.smart_plan_status_transitions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  plan_id uuid NOT NULL,
  from_status text,
  to_status text NOT NULL CHECK (to_status IN ('suggested', 'under_review', 'approved', 'published', 'superseded')),
  actor_kind text NOT NULL CHECK (actor_kind IN ('system', 'athlete', 'professional')),
  actor_hub_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS smart_plan_status_transitions_plan_idx
  ON public.smart_plan_status_transitions (plan_id, created_at);

ALTER TABLE public.smart_plan_status_transitions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.smart_plan_status_transitions FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.smart_plan_status_transitions TO service_role;

CREATE OR REPLACE FUNCTION public.smart_plan_history_append_only()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  RAISE EXCEPTION 'SMART_PLAN_HISTORY_APPEND_ONLY';
END;
$$;

DROP TRIGGER IF EXISTS smart_plan_status_transitions_no_update ON public.smart_plan_status_transitions;
CREATE TRIGGER smart_plan_status_transitions_no_update
  BEFORE UPDATE OR DELETE ON public.smart_plan_status_transitions
  FOR EACH ROW EXECUTE FUNCTION public.smart_plan_history_append_only();

DROP TRIGGER IF EXISTS smart_plan_status_transitions_no_truncate ON public.smart_plan_status_transitions;
CREATE TRIGGER smart_plan_status_transitions_no_truncate
  BEFORE TRUNCATE ON public.smart_plan_status_transitions
  FOR EACH STATEMENT EXECUTE FUNCTION public.smart_plan_history_append_only();

CREATE OR REPLACE FUNCTION public.smart_plan_record_status_transition()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_kind text;
  v_actor_hub_id text;
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.smart_status IS NOT DISTINCT FROM NEW.smart_status THEN
    RETURN NULL;
  END IF;

  IF NEW.smart_status IS NULL THEN
    RETURN NULL;
  END IF;

  v_actor_kind := coalesce(NULLIF(current_setting('app.smart_actor_kind', true), ''), 'system');
  v_actor_hub_id := NULLIF(current_setting('app.smart_actor_hub_id', true), '');

  INSERT INTO public.smart_plan_status_transitions (plan_id, from_status, to_status, actor_kind, actor_hub_id)
  VALUES (
    NEW.id,
    CASE WHEN TG_OP = 'UPDATE' THEN OLD.smart_status END,
    NEW.smart_status,
    v_actor_kind,
    v_actor_hub_id
  );

  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.smart_plan_record_status_transition() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.smart_plan_history_append_only() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.smart_plan_guard_fields() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS meal_plans_v2_smart_history ON public.meal_plans_v2;
CREATE TRIGGER meal_plans_v2_smart_history
  AFTER INSERT OR UPDATE OF smart_status ON public.meal_plans_v2
  FOR EACH ROW EXECUTE FUNCTION public.smart_plan_record_status_transition();

CREATE OR REPLACE FUNCTION public.create_smart_calendar_plan_with_quota(
  p_athlete_id uuid,
  p_request_key text,
  p_requester_hub_id text,
  p_title text,
  p_description text,
  p_calories_goal integer,
  p_protein_goal integer,
  p_carbs_goal integer,
  p_fats_goal integer,
  p_plan_kind text,
  p_calculator_version text,
  p_source_snapshot jsonb,
  p_generation_parameters jsonb,
  p_professional_justification text,
  p_parent_plan_id uuid,
  p_coach_id uuid,
  p_start_date date,
  p_week_pattern jsonb,
  p_day_overrides jsonb
)
RETURNS TABLE(status text, plan_id uuid)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_existing_athlete uuid;
  v_existing_plan uuid;
  v_plan_id uuid;
  v_usage_count integer;
  v_month_start timestamptz := date_trunc('month', now() AT TIME ZONE 'UTC');
  v_smart_status text;
BEGIN
  IF p_plan_kind NOT IN ('personal', 'professional') THEN
    RAISE EXCEPTION 'SMART_PLAN_INVALID_KIND';
  END IF;

  IF length(trim(coalesce(p_request_key, ''))) < 8 THEN
    RAISE EXCEPTION 'SMART_PLAN_INVALID_REQUEST_KEY';
  END IF;

  IF p_start_date IS NULL
     OR jsonb_typeof(p_week_pattern) IS DISTINCT FROM 'array'
     OR jsonb_array_length(p_week_pattern) <> 28
     OR jsonb_typeof(p_day_overrides) IS DISTINCT FROM 'object'
     OR (SELECT count(*) FROM jsonb_object_keys(p_day_overrides)) <> 28 THEN
    RAISE EXCEPTION 'SMART_PLAN_INVALID_CALENDAR';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(p_request_key, 0));

  SELECT u.athlete_id, u.plan_id
    INTO v_existing_athlete, v_existing_plan
    FROM public.smart_plan_usage_events u
   WHERE u.request_key = p_request_key;

  IF FOUND THEN
    IF v_existing_athlete <> p_athlete_id THEN
      RAISE EXCEPTION 'SMART_PLAN_REQUEST_KEY_CONFLICT';
    END IF;

    RETURN QUERY SELECT 'existing'::text, v_existing_plan;
    RETURN;
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended(p_athlete_id::text || ':full:' || to_char(v_month_start, 'YYYY-MM'), 0)
  );

  SELECT count(*)::integer
    INTO v_usage_count
    FROM public.smart_plan_usage_events u
   WHERE u.athlete_id = p_athlete_id
     AND u.kind = 'full'
     AND u.created_at >= v_month_start;

  IF v_usage_count >= 1 THEN
    RAISE EXCEPTION 'SMART_PLAN_QUOTA_EXCEEDED';
  END IF;

  v_smart_status := CASE WHEN p_plan_kind = 'personal' THEN 'suggested' ELSE 'under_review' END;

  PERFORM set_config('app.smart_actor_kind', 'system', true);
  PERFORM set_config('app.smart_actor_hub_id', coalesce(p_requester_hub_id, ''), true);

  INSERT INTO public.meal_plans_v2 (
    athlete_id,
    coach_id,
    title,
    description,
    calories_goal,
    protein_goal,
    carbs_goal,
    fats_goal,
    status,
    plan_kind,
    smart_status,
    calculator_version,
    source_snapshot,
    generation_parameters,
    professional_justification,
    parent_plan_id,
    duration_days,
    plan_mode,
    start_date,
    week_pattern,
    day_overrides
  )
  VALUES (
    p_athlete_id,
    p_coach_id,
    p_title,
    p_description,
    p_calories_goal,
    p_protein_goal,
    p_carbs_goal,
    p_fats_goal,
    'draft',
    p_plan_kind,
    v_smart_status,
    p_calculator_version,
    p_source_snapshot,
    p_generation_parameters,
    p_professional_justification,
    p_parent_plan_id,
    28,
    'calendar',
    p_start_date,
    p_week_pattern,
    p_day_overrides
  )
  RETURNING id INTO v_plan_id;

  INSERT INTO public.smart_plan_usage_events (request_key, athlete_id, requester_hub_id, kind, plan_id)
  VALUES (p_request_key, p_athlete_id, p_requester_hub_id, 'full', v_plan_id);

  RETURN QUERY SELECT 'created'::text, v_plan_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_smart_calendar_plan_with_quota(
  uuid, text, text, text, text, integer, integer, integer, integer, text, text, jsonb, jsonb, text, uuid, uuid, date, jsonb, jsonb
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.create_smart_calendar_plan_with_quota(
  uuid, text, text, text, text, integer, integer, integer, integer, text, text, jsonb, jsonb, text, uuid, uuid, date, jsonb, jsonb
) TO service_role;

CREATE OR REPLACE FUNCTION public.transition_smart_plan_status(
  p_plan_id uuid,
  p_to_status text,
  p_actor_kind text,
  p_actor_hub_id text
)
RETURNS TABLE(outcome text, resulting_status text)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_plan_kind text;
  v_from_status text;
  v_allowed boolean;
BEGIN
  IF p_actor_kind NOT IN ('athlete', 'professional') THEN
    RAISE EXCEPTION 'SMART_PLAN_INVALID_ACTOR';
  END IF;

  IF p_to_status NOT IN ('suggested', 'under_review', 'approved', 'published', 'superseded') THEN
    RAISE EXCEPTION 'SMART_PLAN_INVALID_STATUS';
  END IF;

  SELECT m.plan_kind, m.smart_status
    INTO v_plan_kind, v_from_status
    FROM public.meal_plans_v2 m
   WHERE m.id = p_plan_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'SMART_PLAN_NOT_FOUND';
  END IF;

  IF v_from_status IS NULL THEN
    RAISE EXCEPTION 'SMART_PLAN_NOT_SMART';
  END IF;

  IF v_from_status = p_to_status THEN
    RETURN QUERY SELECT 'unchanged'::text, v_from_status;
    RETURN;
  END IF;

  IF p_actor_kind = 'athlete' THEN
    v_allowed := v_plan_kind = 'personal' AND v_from_status = 'suggested' AND p_to_status = 'approved';
  ELSE
    v_allowed := (v_from_status = 'suggested' AND p_to_status = 'under_review')
      OR (v_from_status = 'under_review' AND p_to_status = 'approved')
      OR (v_from_status = 'approved' AND p_to_status = 'published')
      OR (v_from_status IN ('suggested', 'under_review', 'approved', 'published') AND p_to_status = 'superseded');
  END IF;

  IF NOT v_allowed THEN
    RAISE EXCEPTION 'SMART_PLAN_FORBIDDEN_TRANSITION';
  END IF;

  PERFORM set_config('app.smart_actor_kind', p_actor_kind, true);
  PERFORM set_config('app.smart_actor_hub_id', coalesce(p_actor_hub_id, ''), true);

  UPDATE public.meal_plans_v2 m
     SET smart_status = p_to_status,
         reviewed_at = CASE WHEN p_actor_kind = 'professional' THEN now() ELSE m.reviewed_at END,
         published_at = CASE WHEN p_to_status = 'published' THEN now() ELSE m.published_at END
   WHERE m.id = p_plan_id;

  RETURN QUERY SELECT 'changed'::text, p_to_status;
END;
$$;

REVOKE ALL ON FUNCTION public.transition_smart_plan_status(uuid, text, text, text)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.transition_smart_plan_status(uuid, text, text, text)
  TO service_role;
