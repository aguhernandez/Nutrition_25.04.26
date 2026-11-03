/*
# Smart nutrition planning: plan metadata and quota ledger

1. Changes to `meal_plans_v2`
- `plan_kind` (text, default 'personal'): 'personal' or 'professional'.
- `smart_status` (text, nullable): lifecycle of a smart-generated plan: suggested, under_review, approved, published, superseded. Legacy plans keep NULL.
- `calculator_version` (text): version of the calculator that produced the plan.
- `source_snapshot` (jsonb): frozen copy of the athlete data used to generate the plan.
- `generation_parameters` (jsonb): inputs and targets used by the generator.
- `professional_justification` (text): required for professional plans.
- `reviewed_by` (uuid), `reviewed_at` (timestamptz): professional review trail.
- `published_at` (timestamptz): set when a plan is published.
- `parent_plan_id` (uuid, self reference): links a partial review to the plan it revises.

2. New table `smart_plan_usage_events`
- Ledger of smart generations used for monthly quotas and idempotency.
- `request_key` is unique so a repeated request returns the same result instead of consuming quota twice.

3. Security
- RLS is enabled on the ledger with no policies. Only the service role (edge functions) can read or write it.
- No grants to anon or authenticated on the ledger.
- Existing meal plan policies are unchanged.

4. Important notes
- Constraints are added idempotently. Existing rows get plan_kind 'personal' and NULL smart_status, so no data is changed.
- Professional plans must include a justification. Published plans must have a publication timestamp.
*/

ALTER TABLE public.meal_plans_v2 ADD COLUMN IF NOT EXISTS plan_kind text NOT NULL DEFAULT 'personal';
ALTER TABLE public.meal_plans_v2 ADD COLUMN IF NOT EXISTS smart_status text;
ALTER TABLE public.meal_plans_v2 ADD COLUMN IF NOT EXISTS calculator_version text;
ALTER TABLE public.meal_plans_v2 ADD COLUMN IF NOT EXISTS source_snapshot jsonb;
ALTER TABLE public.meal_plans_v2 ADD COLUMN IF NOT EXISTS generation_parameters jsonb;
ALTER TABLE public.meal_plans_v2 ADD COLUMN IF NOT EXISTS professional_justification text;
ALTER TABLE public.meal_plans_v2 ADD COLUMN IF NOT EXISTS reviewed_by uuid;
ALTER TABLE public.meal_plans_v2 ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
ALTER TABLE public.meal_plans_v2 ADD COLUMN IF NOT EXISTS published_at timestamptz;
ALTER TABLE public.meal_plans_v2 ADD COLUMN IF NOT EXISTS parent_plan_id uuid;

ALTER TABLE public.meal_plans_v2 DROP CONSTRAINT IF EXISTS meal_plans_v2_plan_kind_check;
ALTER TABLE public.meal_plans_v2 ADD CONSTRAINT meal_plans_v2_plan_kind_check
  CHECK (plan_kind IN ('personal', 'professional'));

ALTER TABLE public.meal_plans_v2 DROP CONSTRAINT IF EXISTS meal_plans_v2_smart_status_check;
ALTER TABLE public.meal_plans_v2 ADD CONSTRAINT meal_plans_v2_smart_status_check
  CHECK (smart_status IS NULL OR smart_status IN ('suggested', 'under_review', 'approved', 'published', 'superseded'));

ALTER TABLE public.meal_plans_v2 DROP CONSTRAINT IF EXISTS meal_plans_v2_professional_justification_check;
ALTER TABLE public.meal_plans_v2 ADD CONSTRAINT meal_plans_v2_professional_justification_check
  CHECK (plan_kind <> 'professional' OR (professional_justification IS NOT NULL AND length(trim(professional_justification)) > 0));

ALTER TABLE public.meal_plans_v2 DROP CONSTRAINT IF EXISTS meal_plans_v2_published_at_check;
ALTER TABLE public.meal_plans_v2 ADD CONSTRAINT meal_plans_v2_published_at_check
  CHECK (smart_status IS DISTINCT FROM 'published' OR published_at IS NOT NULL);

ALTER TABLE public.meal_plans_v2 DROP CONSTRAINT IF EXISTS meal_plans_v2_parent_plan_fk;
ALTER TABLE public.meal_plans_v2 ADD CONSTRAINT meal_plans_v2_parent_plan_fk
  FOREIGN KEY (parent_plan_id) REFERENCES public.meal_plans_v2(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS meal_plans_v2_athlete_smart_status_idx ON public.meal_plans_v2 (athlete_id, smart_status);
CREATE INDEX IF NOT EXISTS meal_plans_v2_parent_plan_id_idx ON public.meal_plans_v2 (parent_plan_id);

CREATE TABLE IF NOT EXISTS public.smart_plan_usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_key text NOT NULL UNIQUE,
  athlete_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  requester_hub_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('full', 'partial')),
  plan_id uuid REFERENCES public.meal_plans_v2(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS smart_plan_usage_events_athlete_month_idx ON public.smart_plan_usage_events (athlete_id, kind, created_at);

ALTER TABLE public.smart_plan_usage_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.smart_plan_usage_events FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.smart_plan_usage_events TO service_role;
