/*
  # Add Bilingual Fields to Recipes Table

  Adds name_es and name_en columns to support bilingual recipe display.
  Also adds a culture column for regional/cultural filtering.

  1. Changes to recipes table:
    - Add name_es (Spanish name)
    - Add name_en (English name)
    - Add culture (text) - e.g., 'kenyan', 'ethiopian', 'latin_american', 'european', 'north_american', 'global'

  2. Migrate existing data:
    - Copy existing name to both name_es and name_en for backwards compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'name_es'
  ) THEN
    ALTER TABLE recipes ADD COLUMN name_es text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'name_en'
  ) THEN
    ALTER TABLE recipes ADD COLUMN name_en text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'culture'
  ) THEN
    ALTER TABLE recipes ADD COLUMN culture text DEFAULT 'global';
  END IF;
END $$;

UPDATE recipes SET name_es = name, name_en = name WHERE name_es = '' OR name_es IS NULL;
