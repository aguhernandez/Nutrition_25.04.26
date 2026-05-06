/*
  # Create Sports Nutrition Products Table

  ## Purpose
  Stores a comprehensive catalog of sports nutrition products used in endurance racing.
  Used for athletes to select specific products for their race nutrition plan.

  ## New Tables

  ### nutrition_products
  - `id` (uuid, primary key)
  - `brand` (text) - Brand name e.g. Maurten, GU, Gatorade
  - `product_name` (text) - Short product name
  - `full_name` (text) - Full product name
  - `category` (text) - drink | gel | chew | bar | electrolyte_tablet
  - `calories_per_serving` (int)
  - `carbs_g` (numeric) - Carbohydrates per serving in grams
  - `sugars_g` (numeric)
  - `sodium_mg` (int)
  - `potassium_mg` (int)
  - `caffeine_mg` (int)
  - `serving_size_ml` (int) - for drinks (null for solids)
  - `serving_size_g` (int) - for solids (null for drinks)
  - `flavors` (jsonb) - array of flavor strings
  - `price_range` (text) - $ | $$ | $$$
  - `notes` (text)
  - `suitable_for` (jsonb) - array of sport strings
  - `is_active` (boolean)

  ## Security
  - RLS enabled
  - Public read access for all
  - Only admins can modify
*/

CREATE TABLE IF NOT EXISTS nutrition_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  product_name text NOT NULL,
  full_name text NOT NULL,
  category text NOT NULL CHECK (category IN ('drink', 'gel', 'chew', 'bar', 'electrolyte_tablet')),
  calories_per_serving integer NOT NULL DEFAULT 0,
  carbs_g numeric(6,1) NOT NULL DEFAULT 0,
  sugars_g numeric(6,1) NOT NULL DEFAULT 0,
  sodium_mg integer NOT NULL DEFAULT 0,
  potassium_mg integer NOT NULL DEFAULT 0,
  caffeine_mg integer NOT NULL DEFAULT 0,
  serving_size_ml integer,
  serving_size_g integer,
  flavors jsonb NOT NULL DEFAULT '[]'::jsonb,
  price_range text NOT NULL DEFAULT '$' CHECK (price_range IN ('$', '$$', '$$$')),
  notes text NOT NULL DEFAULT '',
  suitable_for jsonb NOT NULL DEFAULT '["all"]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nutrition_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read nutrition products"
  ON nutrition_products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE INDEX IF NOT EXISTS idx_nutrition_products_category ON nutrition_products(category);
CREATE INDEX IF NOT EXISTS idx_nutrition_products_brand ON nutrition_products(brand);
