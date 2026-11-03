/*
# Athlete preferred supplements from the Supplements Library

1. Plain-English summary
- Athletes can mark supplements from the Supplements Library (foods_v2) with a heart.
- Each mark is one row linking an athlete profile to one library supplement.
- The race planner reads these rows to put preferred supplements first.

2. New table
- `athlete_preferred_library_supplements`
  - `athlete_id` (uuid, required): local profile id. References `profiles(id)`, deleted with the profile.
  - `food_id` (uuid, required): library supplement. References `foods_v2(id)`, deleted with the supplement.
  - `created_by` (uuid, optional): auth user who created the row. Null for Hub sessions, which do not use Supabase Auth.
  - `created_at` (timestamptz): when the preference was saved.
  - Primary key `(athlete_id, food_id)` prevents duplicate preferences.

3. Security
- Row level security is enabled.
- Grants: SELECT, INSERT, DELETE to `anon` and `authenticated`. No UPDATE is needed because a preference is either present or absent.
- Authenticated policies allow an athlete to read, add and remove their own rows, and let coach/admin profiles manage any athlete's rows.
- Anon policies match the satellite's existing Hub convention: the satellite authenticates through Hub, not Supabase Auth, so its requests run as `anon`.

4. Important notes
- 4.1 The anon policies allow any anon client to read or change any athlete's preferences. This is the same trust model as the other Hub-backed tables in this project and should be tightened when a server-side Hub JWT bridge exists.
- 4.2 Indexed by `food_id` so the library can count how many athletes favour a supplement cheaply.
- 4.3 Idempotent: safe to re-run. Policies are dropped before they are created.
*/

CREATE TABLE IF NOT EXISTS public.athlete_preferred_library_supplements (
  athlete_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_id uuid NOT NULL REFERENCES public.foods_v2(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (athlete_id, food_id)
);

ALTER TABLE public.athlete_preferred_library_supplements ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_preferred_library_supplements_food
  ON public.athlete_preferred_library_supplements(food_id);

DROP POLICY IF EXISTS "Authenticated users can view library preferences" ON public.athlete_preferred_library_supplements;
CREATE POLICY "Authenticated users can view library preferences"
  ON public.athlete_preferred_library_supplements FOR SELECT TO authenticated
  USING (
    athlete_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid()) AND profiles.role IN ('coach', 'admin')
    )
  );

DROP POLICY IF EXISTS "Authenticated users can add library preferences" ON public.athlete_preferred_library_supplements;
CREATE POLICY "Authenticated users can add library preferences"
  ON public.athlete_preferred_library_supplements FOR INSERT TO authenticated
  WITH CHECK (
    athlete_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid()) AND profiles.role IN ('coach', 'admin')
    )
  );

DROP POLICY IF EXISTS "Authenticated users can remove library preferences" ON public.athlete_preferred_library_supplements;
CREATE POLICY "Authenticated users can remove library preferences"
  ON public.athlete_preferred_library_supplements FOR DELETE TO authenticated
  USING (
    athlete_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid()) AND profiles.role IN ('coach', 'admin')
    )
  );

DROP POLICY IF EXISTS "Satellite can view library preferences" ON public.athlete_preferred_library_supplements;
CREATE POLICY "Satellite can view library preferences"
  ON public.athlete_preferred_library_supplements FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Satellite can add library preferences" ON public.athlete_preferred_library_supplements;
CREATE POLICY "Satellite can add library preferences"
  ON public.athlete_preferred_library_supplements FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Satellite can remove library preferences" ON public.athlete_preferred_library_supplements;
CREATE POLICY "Satellite can remove library preferences"
  ON public.athlete_preferred_library_supplements FOR DELETE TO anon USING (true);

GRANT SELECT, INSERT, DELETE ON public.athlete_preferred_library_supplements TO anon, authenticated;
