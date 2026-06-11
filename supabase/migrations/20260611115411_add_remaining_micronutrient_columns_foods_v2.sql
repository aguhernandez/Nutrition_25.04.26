/*
  # Add remaining micronutrient columns to foods_v2

  Adds: vitamin_b5_mg, vitamin_b7_ug, iodine_ug, choline_mg, beta_carotene_ug
  These complete the full USDA nutrient profile for a nutrition software.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='vitamin_b5_mg') THEN
    ALTER TABLE foods_v2 ADD COLUMN vitamin_b5_mg numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='vitamin_b7_ug') THEN
    ALTER TABLE foods_v2 ADD COLUMN vitamin_b7_ug numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='iodine_ug') THEN
    ALTER TABLE foods_v2 ADD COLUMN iodine_ug numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='choline_mg') THEN
    ALTER TABLE foods_v2 ADD COLUMN choline_mg numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='foods_v2' AND column_name='beta_carotene_ug') THEN
    ALTER TABLE foods_v2 ADD COLUMN beta_carotene_ug numeric;
  END IF;
END $$;
