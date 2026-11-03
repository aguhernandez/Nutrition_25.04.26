/* The satellite authenticates through Hub rather than Supabase Auth.
   Hub requests use the anon Postgres role, so created_by must remain
   optional until a server-side JWT bridge is available. */

ALTER TABLE public.athlete_preferred_supplements
  ALTER COLUMN created_by DROP NOT NULL,
  ALTER COLUMN created_by DROP DEFAULT;
