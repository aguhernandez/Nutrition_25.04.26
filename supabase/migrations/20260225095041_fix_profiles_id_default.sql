/*
  # Fix profiles table - add UUID default to id column

  The id column was missing a gen_random_uuid() default, causing INSERT failures
  when creating profiles for HUB users returning from OAuth.
*/

ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
