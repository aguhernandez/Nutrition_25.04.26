/* Preferences belong to the Supplements Library (foods_v2), not the smaller
   race-planner nutrition_products catalog. */

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

/* Hub authentication is handled outside Supabase Auth in this satellite. */
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
