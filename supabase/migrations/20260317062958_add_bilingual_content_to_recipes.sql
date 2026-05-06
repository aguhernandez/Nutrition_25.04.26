/*
  # Add Full Bilingual Content to Recipes

  Adds English-specific description and instructions columns to the recipes table,
  enabling full bilingual support (title, description, instructions) per language.

  1. New columns on `recipes`:
    - `description_es` - Spanish description
    - `description_en` - English description
    - `instructions_es` - Spanish step-by-step instructions
    - `instructions_en` - English step-by-step instructions

  2. Data migration:
    - Copy existing `description` into `description_es` and `description_en`
    - Copy existing `instructions` into `instructions_es` and `instructions_en`
    - For description_es/description_en: strip the legacy "|" separator if present
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recipes' AND column_name='description_es') THEN
    ALTER TABLE recipes ADD COLUMN description_es text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recipes' AND column_name='description_en') THEN
    ALTER TABLE recipes ADD COLUMN description_en text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recipes' AND column_name='instructions_es') THEN
    ALTER TABLE recipes ADD COLUMN instructions_es text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recipes' AND column_name='instructions_en') THEN
    ALTER TABLE recipes ADD COLUMN instructions_en text DEFAULT '';
  END IF;
END $$;

UPDATE recipes
SET
  description_es = CASE
    WHEN description LIKE '%|%' THEN TRIM(SPLIT_PART(description, '|', 1))
    ELSE COALESCE(description, '')
  END,
  description_en = CASE
    WHEN description LIKE '%|%' THEN TRIM(SPLIT_PART(description, '|', 2))
    ELSE COALESCE(description, '')
  END,
  instructions_es = COALESCE(instructions, ''),
  instructions_en = COALESCE(instructions, '')
WHERE description_es = '' OR description_es IS NULL;
