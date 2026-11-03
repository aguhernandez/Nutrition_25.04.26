/* Athlete-specific supplement preferences.
   The relation points to the local profile id so Hub identifiers cannot
   accidentally merge two athletes' preferences. */

CREATE TABLE IF NOT EXISTS public.athlete_preferred_supplements (
  athlete_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.nutrition_products(id) ON DELETE CASCADE,
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (athlete_id, product_id)
);

ALTER TABLE public.athlete_preferred_supplements ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_athlete_preferred_supplements_product
  ON public.athlete_preferred_supplements(product_id);

DROP POLICY IF EXISTS "Athletes and professionals can view preferences" ON public.athlete_preferred_supplements;
CREATE POLICY "Athletes and professionals can view preferences"
  ON public.athlete_preferred_supplements FOR SELECT
  TO authenticated
  USING (
    athlete_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role IN ('coach', 'admin')
    )
  );

DROP POLICY IF EXISTS "Athletes and professionals can add preferences" ON public.athlete_preferred_supplements;
CREATE POLICY "Athletes and professionals can add preferences"
  ON public.athlete_preferred_supplements FOR INSERT
  TO authenticated
  WITH CHECK (
    athlete_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role IN ('coach', 'admin')
    )
  );

DROP POLICY IF EXISTS "Athletes and professionals can remove preferences" ON public.athlete_preferred_supplements;
CREATE POLICY "Athletes and professionals can remove preferences"
  ON public.athlete_preferred_supplements FOR DELETE
  TO authenticated
  USING (
    athlete_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role IN ('coach', 'admin')
    )
  );

GRANT SELECT, INSERT, DELETE ON public.athlete_preferred_supplements TO authenticated;

/* This satellite authenticates through the Hub token rather than a Supabase
   Auth session. Keep the same anon-key access convention used by the existing
   race-nutrition tables; the UI resolves the local athlete profile before
   writing rows. A future server-side Hub JWT bridge can replace these policies. */
DROP POLICY IF EXISTS "Satellite can view preferences" ON public.athlete_preferred_supplements;
CREATE POLICY "Satellite can view preferences"
  ON public.athlete_preferred_supplements FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Satellite can add preferences" ON public.athlete_preferred_supplements;
CREATE POLICY "Satellite can add preferences"
  ON public.athlete_preferred_supplements FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Satellite can remove preferences" ON public.athlete_preferred_supplements;
CREATE POLICY "Satellite can remove preferences"
  ON public.athlete_preferred_supplements FOR DELETE TO anon USING (true);

GRANT SELECT, INSERT, DELETE ON public.athlete_preferred_supplements TO anon;
