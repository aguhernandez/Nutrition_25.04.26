/*
# Atomic smart nutrition plan generation

Creates the meal-plan row and its quota-ledger row in a single transaction.
A per-request-key lock preserves idempotency; a per-athlete/month/kind lock makes
monthly quota enforcement correct under concurrent requests. Only service_role may
execute this function; browser roles remain unable to read or write the ledger.
*/

CREATE OR REPLACE FUNCTION public.create_smart_plan_with_quota(
  p_athlete_id uuid,
  p_request_key text,
  p_requester_hub_id text,
  p_kind text,
  p_title text,
  p_description text,
  p_calories_goal integer,
  p_protein_goal integer,
  p_carbs_goal integer,
  p_fats_goal integer,
  p_plan_kind text,
  p_smart_status text,
  p_calculator_version text,
  p_source_snapshot jsonb,
  p_generation_parameters jsonb,
  p_professional_justification text,
  p_parent_plan_id uuid,
  p_coach_id uuid DEFAULT NULL
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
  v_quota integer;
  v_month_start timestamptz := date_trunc('month', now() AT TIME ZONE 'UTC');
BEGIN
  IF p_kind NOT IN ('full', 'partial') THEN
    RAISE EXCEPTION 'SMART_PLAN_INVALID_KIND';
  END IF;

  IF p_plan_kind NOT IN ('personal', 'professional') THEN
    RAISE EXCEPTION 'SMART_PLAN_INVALID_KIND';
  END IF;

  IF length(trim(coalesce(p_request_key, ''))) < 8 THEN
    RAISE EXCEPTION 'SMART_PLAN_INVALID_REQUEST_KEY';
  END IF;

  -- Serialize retries of the same request key, even if a client accidentally
  -- reuses it for a different athlete.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_request_key, 0));

  SELECT athlete_id, plan_id
    INTO v_existing_athlete, v_existing_plan
    FROM public.smart_plan_usage_events
   WHERE request_key = p_request_key;

  IF FOUND THEN
    IF v_existing_athlete <> p_athlete_id THEN
      RAISE EXCEPTION 'SMART_PLAN_REQUEST_KEY_CONFLICT';
    END IF;

    RETURN QUERY SELECT 'existing'::text, v_existing_plan;
    RETURN;
  END IF;

  -- Serialize quota consumption for one athlete, calendar month and generation kind.
  PERFORM pg_advisory_xact_lock(
    hashtextextended(
      p_athlete_id::text || ':' || p_kind || ':' || to_char(v_month_start, 'YYYY-MM'),
      0
    )
  );

  v_quota := CASE p_kind WHEN 'full' THEN 1 ELSE 2 END;

  SELECT count(*)::integer
    INTO v_usage_count
    FROM public.smart_plan_usage_events
   WHERE athlete_id = p_athlete_id
     AND kind = p_kind
     AND created_at >= v_month_start;

  IF v_usage_count >= v_quota THEN
    RAISE EXCEPTION 'SMART_PLAN_QUOTA_EXCEEDED';
  END IF;

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
    parent_plan_id
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
    p_smart_status,
    p_calculator_version,
    p_source_snapshot,
    p_generation_parameters,
    p_professional_justification,
    p_parent_plan_id
  )
  RETURNING id INTO v_plan_id;

  INSERT INTO public.smart_plan_usage_events (
    request_key,
    athlete_id,
    requester_hub_id,
    kind,
    plan_id
  )
  VALUES (
    p_request_key,
    p_athlete_id,
    p_requester_hub_id,
    p_kind,
    v_plan_id
  );

  RETURN QUERY SELECT 'created'::text, v_plan_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_smart_plan_with_quota(
  uuid, text, text, text, text, text, integer, integer, integer, integer,
  text, text, text, jsonb, jsonb, text, uuid, uuid
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.create_smart_plan_with_quota(
  uuid, text, text, text, text, text, integer, integer, integer, integer,
  text, text, text, jsonb, jsonb, text, uuid, uuid
) TO service_role;
