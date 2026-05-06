/*
  # Add Micronutrients to Foods Table

  ## Summary
  Extends the existing `foods` table with full micronutrient data columns
  sourced from USDA FoodData Central API. Also adds English/Spanish name
  fields and USDA metadata for deduplication.

  ## Changes to `foods` table

  ### New Name Columns
  - `name_en` - English name (from USDA)
  - `name_es` - Spanish name (translated or manual)

  ### Vitamins (per 100g)
  - `vitamin_a_ug` - Vitamin A (RAE, micrograms)
  - `vitamin_b1_mg` - Thiamin (mg)
  - `vitamin_b2_mg` - Riboflavin (mg)
  - `vitamin_b3_mg` - Niacin (mg)
  - `vitamin_b6_mg` - Vitamin B6 (mg)
  - `vitamin_b12_ug` - Vitamin B12 (micrograms)
  - `vitamin_c_mg` - Vitamin C (mg)
  - `vitamin_d_ug` - Vitamin D (micrograms)
  - `vitamin_e_mg` - Vitamin E (mg)
  - `vitamin_k_ug` - Vitamin K (micrograms)
  - `folate_ug` - Folate / Folic acid (micrograms)

  ### Minerals (per 100g)
  - `calcium_mg` - Calcium (mg)
  - `iron_mg` - Iron (mg)
  - `magnesium_mg` - Magnesium (mg)
  - `phosphorus_mg` - Phosphorus (mg)
  - `potassium_mg` already exists — skipped
  - `zinc_mg` - Zinc (mg)

  ### USDA Metadata
  - `usda_data_type` - SR Legacy, Foundation, Branded, etc.
  - `usda_description` - Original USDA description string

  ## Notes
  - All new columns are nullable (no default) to distinguish "no data" from 0
  - Existing rows are unaffected
  - potassium_mg already exists on the table, no duplicate added
*/

-- Name columns (bilingual)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'foods' AND column_name = 'name_en'
  ) THEN
    ALTER TABLE foods ADD COLUMN name_en text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'foods' AND column_name = 'name_es'
  ) THEN
    ALTER TABLE foods ADD COLUMN name_es text;
  END IF;
END $$;

-- Vitamins
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'vitamin_a_ug') THEN
    ALTER TABLE foods ADD COLUMN vitamin_a_ug numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'vitamin_b1_mg') THEN
    ALTER TABLE foods ADD COLUMN vitamin_b1_mg numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'vitamin_b2_mg') THEN
    ALTER TABLE foods ADD COLUMN vitamin_b2_mg numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'vitamin_b3_mg') THEN
    ALTER TABLE foods ADD COLUMN vitamin_b3_mg numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'vitamin_b6_mg') THEN
    ALTER TABLE foods ADD COLUMN vitamin_b6_mg numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'vitamin_b12_ug') THEN
    ALTER TABLE foods ADD COLUMN vitamin_b12_ug numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'vitamin_c_mg') THEN
    ALTER TABLE foods ADD COLUMN vitamin_c_mg numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'vitamin_d_ug') THEN
    ALTER TABLE foods ADD COLUMN vitamin_d_ug numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'vitamin_e_mg') THEN
    ALTER TABLE foods ADD COLUMN vitamin_e_mg numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'vitamin_k_ug') THEN
    ALTER TABLE foods ADD COLUMN vitamin_k_ug numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'folate_ug') THEN
    ALTER TABLE foods ADD COLUMN folate_ug numeric;
  END IF;
END $$;

-- Minerals
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'calcium_mg') THEN
    ALTER TABLE foods ADD COLUMN calcium_mg numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'iron_mg') THEN
    ALTER TABLE foods ADD COLUMN iron_mg numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'magnesium_mg') THEN
    ALTER TABLE foods ADD COLUMN magnesium_mg numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'phosphorus_mg') THEN
    ALTER TABLE foods ADD COLUMN phosphorus_mg numeric;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'zinc_mg') THEN
    ALTER TABLE foods ADD COLUMN zinc_mg numeric;
  END IF;
END $$;

-- USDA metadata
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'usda_data_type') THEN
    ALTER TABLE foods ADD COLUMN usda_data_type text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'usda_description') THEN
    ALTER TABLE foods ADD COLUMN usda_description text;
  END IF;
END $$;

-- Index for bilingual search
CREATE INDEX IF NOT EXISTS foods_name_en_idx ON foods(name_en);
CREATE INDEX IF NOT EXISTS foods_name_es_idx ON foods(name_es);
CREATE INDEX IF NOT EXISTS foods_usda_fdc_id_idx ON foods(usda_fdc_id);
