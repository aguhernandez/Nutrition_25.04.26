/*
  # Add supplement fields to foods_v2

  ## Summary
  Adds supplement-specific columns to foods_v2 so sports supplements can be tracked
  with full label detail alongside regular foods.

  ## Changes to foods_v2
  - `brand` — brand/manufacturer name
  - `product_form` — powder, gel, bar, tablet, capsule, liquid, chew, strip
  - `serving_unit` — g, ml, scoop, tablet, capsule, sachet, bar, gel
  - `serving_size_g` — numeric serving size in grams or ml
  - `serving_description` — human label (e.g. "1 scoop (30g)")
  - `caffeine_mg` — caffeine per serving (for gels, pre-workout, caffeine tabs)
  - `sodium_mg` — sodium per 100g (already indirectly tracked, making explicit)
  - `potassium_mg` — potassium per 100g
  - `magnesium_mg` — magnesium per 100g
  - `calcium_mg` — calcium per 100g
  - `iron_mg` — iron per 100g
  - `zinc_mg` — zinc per 100g
  - `vitamin_c_mg` — vitamin C per 100g
  - `vitamin_d_ug` — vitamin D per 100g
  - `vitamin_b12_ug` — vitamin B12 per 100g
  - `beta_alanine_mg` — beta-alanine per serving
  - `creatine_mg` — creatine per serving
  - `electrolytes_note` — free text for electrolyte blend detail
  - `flavors` — JSONB array of available flavors
  - `region` — north_america, europe, south_america, east_africa, global
  - `is_supplement` — boolean flag to distinguish supplements from whole foods
  - `antidoping_note` — e.g. "Informed Sport certified"
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='brand') THEN
    ALTER TABLE foods_v2 ADD COLUMN brand text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='product_form') THEN
    ALTER TABLE foods_v2 ADD COLUMN product_form text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='serving_unit') THEN
    ALTER TABLE foods_v2 ADD COLUMN serving_unit text DEFAULT 'g';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='serving_size_g') THEN
    ALTER TABLE foods_v2 ADD COLUMN serving_size_g numeric DEFAULT 100;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='serving_description') THEN
    ALTER TABLE foods_v2 ADD COLUMN serving_description text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='caffeine_mg') THEN
    ALTER TABLE foods_v2 ADD COLUMN caffeine_mg numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='sodium_mg') THEN
    ALTER TABLE foods_v2 ADD COLUMN sodium_mg numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='potassium_mg') THEN
    ALTER TABLE foods_v2 ADD COLUMN potassium_mg numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='magnesium_mg') THEN
    ALTER TABLE foods_v2 ADD COLUMN magnesium_mg numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='calcium_mg') THEN
    ALTER TABLE foods_v2 ADD COLUMN calcium_mg numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='iron_mg') THEN
    ALTER TABLE foods_v2 ADD COLUMN iron_mg numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='zinc_mg') THEN
    ALTER TABLE foods_v2 ADD COLUMN zinc_mg numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='vitamin_c_mg') THEN
    ALTER TABLE foods_v2 ADD COLUMN vitamin_c_mg numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='vitamin_d_ug') THEN
    ALTER TABLE foods_v2 ADD COLUMN vitamin_d_ug numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='vitamin_b12_ug') THEN
    ALTER TABLE foods_v2 ADD COLUMN vitamin_b12_ug numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='beta_alanine_mg') THEN
    ALTER TABLE foods_v2 ADD COLUMN beta_alanine_mg numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='creatine_mg') THEN
    ALTER TABLE foods_v2 ADD COLUMN creatine_mg numeric DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='electrolytes_note') THEN
    ALTER TABLE foods_v2 ADD COLUMN electrolytes_note text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='flavors') THEN
    ALTER TABLE foods_v2 ADD COLUMN flavors jsonb DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='region') THEN
    ALTER TABLE foods_v2 ADD COLUMN region text DEFAULT 'global';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='is_supplement') THEN
    ALTER TABLE foods_v2 ADD COLUMN is_supplement boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='antidoping_note') THEN
    ALTER TABLE foods_v2 ADD COLUMN antidoping_note text DEFAULT '';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS foods_v2_is_supplement_idx ON foods_v2 (is_supplement);
CREATE INDEX IF NOT EXISTS foods_v2_region_idx ON foods_v2 (region);
CREATE INDEX IF NOT EXISTS foods_v2_category_supp_idx ON foods_v2 (category) WHERE is_supplement = true;
