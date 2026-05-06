/*
  # Drop foreign key constraint from profiles.id to auth.users

  This app uses HUB-based authentication, not Supabase auth.users.
  The foreign key profiles_id_fkey (id -> auth.users.id) prevents
  inserting profiles for HUB users since they have no corresponding
  Supabase auth.users row.

  Changes:
  - Drop FOREIGN KEY constraint profiles_id_fkey on profiles(id)
  - profiles.id will remain a UUID primary key with gen_random_uuid() default
*/

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
