/*
  # Races Catalog

  ## Overview
  Creates a public catalog of world-known races across all supported disciplines.
  This table is seeded with 100+ real events and serves as the searchable database
  athletes use to pre-fill their race planner.

  ## New Table: races_catalog

  ### Columns
  - `id` - UUID primary key
  - `name` - Full official race name
  - `sport` - Discipline (matches app Sport type: running, trail_running, cycling_road, cycling_gravel, cycling_mtb, swimming, triathlon, hyrox)
  - `country` - Country where the race is held
  - `city` - Host city or region
  - `distance_km` - Official race distance in km
  - `elevation_gain_m` - Total positive elevation in meters
  - `typical_month` - Typical month of year (1-12) based on historical editions
  - `typical_day` - Approximate day of month for the race
  - `avg_temperature_c` - Historical average race-day temperature in Celsius
  - `avg_humidity_pct` - Historical average race-day humidity percentage
  - `altitude_m` - Start altitude above sea level in meters
  - `description` - Short race description
  - `is_verified` - Whether the data has been manually verified
  - `created_at` - Record timestamp

  ## Security
  - RLS enabled
  - Public SELECT allowed (catalog is intentionally public)
  - No INSERT/UPDATE/DELETE for regular users (admin-only via service role)

  ## Notes
  - Seed data includes 100+ races across running, trail, cycling, swimming, triathlon, hyrox
  - Dates are approximate; athletes should verify current-year edition dates
  - Temperature/humidity are historical averages and may vary year to year
*/

CREATE TABLE IF NOT EXISTS races_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sport text NOT NULL,
  country text NOT NULL,
  city text NOT NULL,
  distance_km numeric NOT NULL DEFAULT 0,
  elevation_gain_m numeric NOT NULL DEFAULT 0,
  typical_month integer NOT NULL DEFAULT 1,
  typical_day integer NOT NULL DEFAULT 1,
  avg_temperature_c numeric NOT NULL DEFAULT 20,
  avg_humidity_pct numeric NOT NULL DEFAULT 60,
  altitude_m numeric NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  is_verified boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE races_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to race catalog"
  ON races_catalog FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- SEED DATA: ROAD RUNNING
-- ============================================================
INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
('Boston Marathon', 'running', 'USA', 'Boston', 42.2, 426, 4, 15, 12, 55, 8, 'The world''s oldest annual marathon, held on Patriots'' Day since 1897. Iconic Heartbreak Hill at km 33.'),
('Berlin Marathon', 'running', 'Germany', 'Berlin', 42.2, 60, 9, 24, 16, 70, 34, 'Flat and fast course through the German capital. Multiple world records have been set here.'),
('Chicago Marathon', 'running', 'USA', 'Chicago', 42.2, 30, 10, 13, 15, 60, 176, 'One of the flattest World Marathon Majors. Course winds through 29 distinctive Chicago neighborhoods.'),
('New York City Marathon', 'running', 'USA', 'New York City', 42.2, 300, 11, 3, 10, 55, 10, 'Iconic five-borough race through NYC. Crosses five bridges and passes through all five boroughs.'),
('London Marathon', 'running', 'UK', 'London', 42.2, 60, 4, 23, 13, 65, 11, 'Passes major landmarks including Tower Bridge and Buckingham Palace. Part of the World Marathon Majors.'),
('Tokyo Marathon', 'running', 'Japan', 'Tokyo', 42.2, 40, 3, 2, 12, 60, 40, 'Starts at Tokyo Metropolitan Government Building and finishes at Tokyo Station. World Marathon Major.'),
('Paris Marathon', 'running', 'France', 'Paris', 42.2, 130, 4, 7, 14, 65, 35, 'Courses through the City of Light past the Eiffel Tower, Arc de Triomphe, and Bois de Boulogne.'),
('Dubai Marathon', 'running', 'UAE', 'Dubai', 42.2, 5, 1, 19, 22, 65, 5, 'One of the world''s richest marathons. Flat course along Sheikh Zayed Road in ideal winter conditions.'),
('Valencia Marathon Trinidad Alfonso', 'running', 'Spain', 'Valencia', 42.2, 40, 12, 1, 14, 70, 15, 'Known as the marathon of the personal best. Flat course through the City of Arts and Sciences.'),
('Barcelona Marathon', 'running', 'Spain', 'Barcelona', 42.2, 200, 3, 16, 14, 65, 10, 'Scenic route through the Catalan capital passing Camp Nou and the Sagrada Familia.'),
('Sydney Marathon', 'running', 'Australia', 'Sydney', 42.2, 200, 9, 17, 18, 65, 30, 'Iconic Australian race crossing the Sydney Harbour Bridge with stunning views of the Opera House.'),
('Amsterdam Marathon', 'running', 'Netherlands', 'Amsterdam', 42.2, 15, 10, 20, 12, 75, 2, 'Starts and finishes in the Olympic Stadium. Course winds through the historic city canals.'),
('Vienna City Marathon', 'running', 'Austria', 'Vienna', 42.2, 80, 4, 28, 15, 60, 171, 'Begins near Schloss Schönbrunn and finishes at the Vienna Burgtheater. Imperial atmosphere throughout.'),
('Seville Marathon', 'running', 'Spain', 'Seville', 42.2, 60, 2, 19, 14, 65, 10, 'Flat and fast course through one of Spain''s most beautiful historic cities.'),
('Houston Marathon', 'running', 'USA', 'Houston', 42.2, 40, 1, 19, 13, 75, 15, 'Flat course through downtown Houston in ideal January conditions. Major qualifier for Boston.'),
('Maratona di Roma', 'running', 'Italy', 'Rome', 42.2, 150, 3, 24, 14, 60, 20, 'Runs past the Colosseum, Vatican, and countless monuments of the Eternal City.'),
('Prague Marathon', 'running', 'Czech Republic', 'Prague', 42.2, 100, 5, 12, 18, 60, 200, 'Scenic course through Prague''s old town, running past Charles Bridge and Wenceslas Square.'),
('Athens Classic Marathon', 'running', 'Greece', 'Athens', 42.2, 350, 11, 10, 20, 55, 65, 'The original marathon route from Marathon village to the Panathenaic Stadium in Athens.'),
('Melbourne Marathon', 'running', 'Australia', 'Melbourne', 42.2, 150, 10, 13, 18, 60, 30, 'Finishes on the iconic MCG cricket ground. Takes in the Tan, St Kilda Road, and Albert Park.'),
('Cape Town Marathon', 'running', 'South Africa', 'Cape Town', 42.2, 300, 9, 15, 18, 60, 10, 'UNESCO-listed route with Table Mountain as backdrop. One of the world''s most scenic marathons.'),
('Los Angeles Marathon', 'running', 'USA', 'Los Angeles', 42.2, 300, 3, 16, 18, 70, 80, 'Runs from Dodger Stadium to Santa Monica Beach. A true coast-to-coast LA experience.'),
('Miami Marathon', 'running', 'USA', 'Miami', 42.2, 30, 2, 9, 22, 75, 2, 'Flat and fast course through South Beach, Little Havana, and Coconut Grove.'),
('Copenhagen Marathon', 'running', 'Denmark', 'Copenhagen', 42.2, 80, 5, 19, 14, 70, 5, 'Runs through Copenhagen''s charming waterfront neighborhoods and historic areas.'),
('Stockholm Marathon', 'running', 'Sweden', 'Stockholm', 42.2, 80, 6, 1, 20, 65, 14, 'Finishes inside the Stockholm Olympic Stadium. Runs through the capital''s scenic archipelago.'),
('Marine Corps Marathon', 'running', 'USA', 'Washington DC', 42.2, 400, 10, 27, 14, 60, 18, 'Known as the ''People''s Marathon''. Route passes the Pentagon, Iwo Jima Memorial, and Lincoln Memorial.'),
('Brussels Marathon', 'running', 'Belgium', 'Brussels', 42.2, 100, 10, 2, 12, 70, 56, 'Historic course through the Belgian capital with the Grand Place and Atomium on route.'),
('Zurich Marathon', 'running', 'Switzerland', 'Zurich', 42.2, 200, 4, 28, 14, 65, 408, 'Scenic course along Lake Zurich with views of the Alps. One of Switzerland''s premier road races.'),
('Gold Coast Marathon', 'running', 'Australia', 'Gold Coast', 42.2, 30, 7, 6, 18, 70, 5, 'One of Australia''s premier marathons. Fast flat course along the Gold Coast beachfront.'),
('Toronto Waterfront Marathon', 'running', 'Canada', 'Toronto', 42.2, 100, 10, 20, 12, 65, 76, 'Scenic Lake Ontario waterfront course. IAAF Gold Label race known for fast times.'),
('Maraton Sevilla', 'running', 'Spain', 'Seville', 42.2, 60, 2, 25, 15, 60, 10, 'February classic through the streets of Seville. One of Spain''s fastest marathon courses.');

-- ============================================================
-- SEED DATA: TRAIL RUNNING
-- ============================================================
INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
('UTMB - Ultra-Trail du Mont-Blanc', 'trail_running', 'France', 'Chamonix', 171, 10000, 8, 28, 12, 65, 1035, 'The ultimate mountain ultramarathon. 170km around Mont Blanc through France, Italy, and Switzerland.'),
('Western States 100', 'trail_running', 'USA', 'Squaw Valley', 160, 5500, 6, 28, 28, 25, 1890, 'America''s oldest 100-mile trail race. From Squaw Valley to Auburn through the Sierra Nevada.'),
('Hard Rock 100', 'trail_running', 'USA', 'Silverton', 160, 10500, 7, 12, 12, 30, 2835, 'One of the world''s hardest 100-milers. Loops through the San Juan Mountains of Colorado.'),
('Leadville Trail 100 Run', 'trail_running', 'USA', 'Leadville', 160, 4600, 8, 17, 16, 30, 3100, 'The Race Across the Sky at 10,000+ ft elevation. Infamous Hope Pass crossing at mile 50.'),
('CCC – UTMB Race', 'trail_running', 'Italy', 'Courmayeur', 101, 6100, 8, 30, 13, 65, 1224, 'Courmayeur-Champex-Chamonix. Part of the UTMB World Series, one of the most scenic mountain ultras.'),
('Ultra Pirineu', 'trail_running', 'Spain', 'Bagà', 110, 6800, 9, 21, 16, 60, 900, 'Spectacular race through the Pyrenees near Barcelona. Known for technical terrain and stunning views.'),
('Transgrancanaria Advanced', 'trail_running', 'Spain', 'Agaete', 128, 7400, 2, 22, 18, 65, 20, 'North to south traverse of Gran Canaria from sea to sea. Volcanic terrain and gorges.'),
('Marathon des Sables', 'trail_running', 'Morocco', 'Ouarzazate', 250, 1500, 4, 5, 38, 10, 800, 'The toughest footrace on Earth. A 6-day, 250km self-sufficient race across the Sahara Desert.'),
('Comrades Marathon', 'trail_running', 'South Africa', 'Pietermaritzburg', 87, 1800, 6, 11, 22, 60, 668, 'The world''s largest and oldest ultramarathon between Durban and Pietermaritzburg. 90km of road.'),
('Tor des Géants', 'trail_running', 'Italy', 'Courmayeur', 330, 24000, 9, 8, 10, 65, 1224, '330km nonstop race through the Aosta Valley. The longest mountain ultra in the world.'),
('Lavaredo Ultra Trail', 'trail_running', 'Italy', 'Cortina d''Ampezzo', 119, 5800, 6, 28, 14, 60, 1224, 'Night race through the Dolomites with the iconic Tre Cime di Lavaredo. One of Europe''s most beautiful.'),
('La Diagonale des Fous', 'trail_running', 'France', 'Saint-Denis', 165, 10000, 10, 19, 20, 80, 20, 'Crosses the entire island of Réunion from coast to coast through volcanic terrain.'),
('Ultra-Trail Australia', 'trail_running', 'Australia', 'Katoomba', 100, 4400, 5, 17, 16, 70, 1017, 'Through the Blue Mountains west of Sydney. Famous escarpments, canyons, and waterfalls.'),
('Patagonian International Marathon', 'trail_running', 'Chile', 'Torres del Paine', 42, 1700, 11, 9, 8, 55, 150, 'Race through Torres del Paine National Park, one of the world''s most beautiful landscapes.'),
('Zegama-Aizkorri', 'trail_running', 'Spain', 'Zegama', 42, 4000, 5, 26, 12, 75, 438, 'Steep Basque mountain race with 4,000m of elevation on just 42km. Elite skyrunning classic.'),
('Sierre-Zinal', 'trail_running', 'Switzerland', 'Sierre', 31, 2200, 8, 10, 20, 50, 540, 'Classic Swiss mountain race with views of the Matterhorn and Weisshorn. Elite field only.'),
('Transvulcania Ultra Marathon', 'trail_running', 'Spain', 'Los Llanos de Aridane', 73, 4200, 5, 11, 20, 65, 50, 'Volcanic ridge traverse on La Palma island. Stunning Atlantic views on every ridge.'),
('Ultra-Trail Cape Town', 'trail_running', 'South Africa', 'Cape Town', 100, 4200, 12, 1, 22, 55, 10, 'Through the Cape Winelands and Table Mountain National Park. Part of the UTMB World Series.'),
('Oman by UTMB', 'trail_running', 'Oman', 'Muscat', 137, 5200, 1, 12, 20, 40, 50, 'Desert and mountain traverse in the Arabian Peninsula. UTMB World Series qualifier in winter.'),
('The North Face 50 Endurance Challenge', 'trail_running', 'USA', 'Marin County', 80, 3400, 4, 27, 14, 70, 50, 'Iconic Marin Headlands race north of San Francisco. National trail running championship event.'),
('Leki Ultra Trail Andorra', 'trail_running', 'Andorra', 'Andorra la Vella', 170, 12000, 7, 18, 15, 55, 1023, 'Epic Pyrenean ultra circumnavigating the Principality of Andorra. Extreme altitude and terrain.');

-- ============================================================
-- SEED DATA: CYCLING ROAD
-- ============================================================
INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
('Étape du Tour', 'cycling_road', 'France', 'Varies', 150, 3500, 7, 14, 20, 55, 1000, 'Ride a legendary Tour de France mountain stage before the professionals. Up to 10,000 participants.'),
('Maratona dles Dolomites', 'cycling_road', 'Italy', 'La Villa', 138, 4230, 7, 6, 18, 50, 1450, 'Iconic Dolomites gran fondo with up to 7 mountain passes. One of the world''s most beautiful rides.'),
('La Marmotte', 'cycling_road', 'France', 'Bourg-d''Oisans', 174, 5000, 7, 6, 22, 50, 720, 'Famous Alpine sportive including Galibier, Croix de Fer, and Alpe d''Huez. A true bucket-list ride.'),
('Cape Argus Cycle Tour', 'cycling_road', 'South Africa', 'Cape Town', 109, 1200, 3, 9, 22, 65, 5, 'The world''s largest individually timed cycling event. Circumnavigates the Cape Peninsula.'),
('Velothon Berlin', 'cycling_road', 'Germany', 'Berlin', 120, 500, 6, 16, 22, 60, 34, 'Mass participation ride through closed streets of Berlin. Multiple distance options available.'),
('Gran Fondo Strade Bianche', 'cycling_road', 'Italy', 'Siena', 184, 3600, 3, 9, 12, 60, 322, 'Follows the professional Strade Bianche race route through Tuscany''s famous white gravel roads.'),
('Gran Fondo New York', 'cycling_road', 'USA', 'New York City', 170, 3400, 5, 18, 18, 65, 10, 'Challenging route through the Hudson Valley with significant climbing. One of USA''s premier fondos.'),
('Granfondo Giro', 'cycling_road', 'Italy', 'Varies', 135, 2000, 5, 25, 16, 65, 500, 'Official gran fondo series associated with the Giro d''Italia. Multiple stages across Italy.'),
('Mallorca 312', 'cycling_road', 'Spain', 'Mallorca', 312, 4800, 4, 6, 18, 60, 5, 'Epic circumnavigation of Mallorca including Sa Calobra and Cap Formentor. Top European sportive.'),
('L''Eroica', 'cycling_road', 'Italy', 'Gaiole in Chianti', 209, 4400, 10, 6, 16, 65, 400, 'Vintage cycling event through Chianti on historic white roads. Participants ride retro bikes.'),
('Étape Caledonia', 'cycling_road', 'UK', 'Pitlochry', 81, 1400, 5, 11, 12, 70, 300, 'Closed road sportive through the Scottish Highlands. One of the UK''s most popular cycling events.'),
('Gran Fondo Liège-Bastogne-Liège', 'cycling_road', 'Belgium', 'Liège', 170, 2600, 4, 28, 12, 70, 75, 'Follows the route of La Doyenne classic. Ardennes climbs including Côte de la Redoute.'),
('Gran Fondo Innsbruck', 'cycling_road', 'Austria', 'Innsbruck', 169, 3310, 9, 28, 16, 65, 574, 'Recreates the UCI World Championship course in the Austrian Alps. Stunning Tyrolean scenery.'),
('New Zealand Gran Fondo', 'cycling_road', 'New Zealand', 'Queenstown', 150, 2500, 2, 16, 18, 60, 310, 'Spectacular ride through Queenstown''s lake district with views of the Southern Alps.'),
('Tour de Suisse Gran Fondo', 'cycling_road', 'Switzerland', 'Varies', 120, 2500, 6, 22, 20, 55, 600, 'Connected to the professional Tour de Suisse. Routes through Swiss mountain cantons.');

-- ============================================================
-- SEED DATA: GRAVEL CYCLING
-- ============================================================
INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
('Unbound Gravel 200', 'cycling_gravel', 'USA', 'Emporia', 322, 4500, 6, 1, 25, 45, 400, 'The world''s most prestigious gravel race. 200 miles of flint gravel roads in the Kansas Flint Hills.'),
('Gravel Worlds', 'cycling_gravel', 'USA', 'Lincoln', 240, 2500, 8, 24, 28, 55, 380, 'World Gravel Championship qualifier in Nebraska. Multiple distances from 25 to 150 miles.'),
('Belgian Waffle Ride Cedar City', 'cycling_gravel', 'USA', 'Cedar City', 273, 5700, 5, 4, 18, 40, 1700, 'Mixed surface ride through southern Utah''s red rock landscape. Extreme climbing on dirt roads.'),
('SBT GRVL', 'cycling_gravel', 'USA', 'Steamboat Springs', 217, 4400, 8, 18, 25, 30, 2070, 'Gravel event in the Colorado Rockies. Black, Blue, and White distance options at altitude.'),
('Land Run 100', 'cycling_gravel', 'USA', 'Stillwater', 160, 1800, 3, 2, 12, 65, 290, 'Red dirt roads of Oklahoma in early spring. Legendary for brutal mud conditions after rain.'),
('Rasputitsa Spring Classic', 'cycling_gravel', 'USA', 'East Burke', 85, 1500, 4, 27, 8, 70, 300, 'Vermont Kingdom Trails in spring mud season. Named after Russian mud season. Brutal Vermont roads.'),
('Grinduro California', 'cycling_gravel', 'USA', 'Quincy', 100, 3000, 10, 7, 16, 45, 1400, 'Unique gravel-enduro format in Plumas National Forest. Timed stages on mixed terrain.'),
('Badlands', 'cycling_gravel', 'Spain', 'Almería', 730, 14000, 6, 14, 32, 25, 600, 'Unsupported ultra across the Bardenas Reales and Tabernas deserts. Spain''s toughest gravel event.'),
('Traka 360', 'cycling_gravel', 'Spain', 'Girona', 360, 6800, 4, 17, 16, 60, 200, 'Multi-day gravel race through the Costa Brava and Pyrenees foothills. UTMB World Series of gravel.');

-- ============================================================
-- SEED DATA: MOUNTAIN BIKE
-- ============================================================
INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
('Absa Cape Epic', 'cycling_mtb', 'South Africa', 'Cape Town', 700, 16000, 3, 16, 26, 40, 200, 'The Untamed African MTB Race. 8-day stage race through the Cape Winelands. Called the Tour de France of MTB.'),
('Leadville 100 MTB', 'cycling_mtb', 'USA', 'Leadville', 160, 3800, 8, 10, 18, 30, 3100, 'The Race Across the Sky on bikes. 100 miles at extreme altitude through the Colorado Rockies.'),
('Breck Epic', 'cycling_mtb', 'USA', 'Breckenridge', 364, 12000, 8, 5, 20, 30, 2926, '6-day stage race through Summit County Colorado at 9,600–13,000ft elevation. Pure high altitude MTB.'),
('TransAlp', 'cycling_mtb', 'Germany', 'Memmingen', 620, 18000, 7, 7, 22, 45, 595, '8-day team MTB stage race from Germany to Italy through the Alps. One of the classic European stage races.'),
('La Ruta de los Conquistadores', 'cycling_mtb', 'Costa Rica', 'San José', 530, 12000, 11, 12, 28, 80, 900, '3-day race crossing Costa Rica from Pacific to Caribbean coast. Tropical jungles and volcanoes.'),
('TransRockies Classic', 'cycling_mtb', 'Canada', 'Fernie', 330, 11000, 8, 5, 20, 40, 1000, '6-day point-to-point mountain bike stage race through the Canadian Rockies. Iconic wilderness riding.'),
('Pietermaritzburg UCI MTB World Cup', 'cycling_mtb', 'South Africa', 'Pietermaritzburg', 40, 2400, 3, 24, 24, 60, 668, 'UCI World Cup XC and DH event at Cascades Trail. One of the most watched MTB World Cup rounds.');

-- ============================================================
-- SEED DATA: SWIMMING (OPEN WATER)
-- ============================================================
INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
('Rottnest Channel Swim', 'swimming', 'Australia', 'Cottesloe Beach', 19.7, 0, 2, 22, 22, 80, 0, 'Swim from Cottesloe Beach to Rottnest Island. The world''s largest open water swimming event by participation.'),
('Manhattan Island Marathon Swim', 'swimming', 'USA', 'New York City', 28.5, 0, 6, 15, 22, 70, 0, 'Around Manhattan Island open water swim. One of the world''s most iconic open water challenges.'),
('Midmar Mile', 'swimming', 'South Africa', 'Midmar', 1.6, 0, 2, 9, 22, 65, 800, 'The world''s largest open water swimming event. Held at Midmar Dam in KwaZulu-Natal.'),
('Great North Swim', 'swimming', 'UK', 'Windermere', 10, 0, 6, 14, 18, 75, 40, 'Open water swim in Lake Windermere, England''s largest natural lake. Multiple distances available.'),
('Santa Fe – Coronda Marathon Swim', 'swimming', 'Argentina', 'Santa Fe', 57, 0, 2, 8, 28, 75, 20, 'River marathon along the Coronda River. One of the world''s longest open water swimming races.'),
('Dart 10K', 'swimming', 'UK', 'Dartmouth', 10, 0, 9, 14, 16, 70, 0, 'Open water swim along the River Dart estuary in Devon. Stunning British countryside setting.'),
('Loch Lomond Open Water Swim', 'swimming', 'UK', 'Loch Lomond', 10, 0, 7, 15, 16, 75, 8, 'Iconic Scottish loch swim with beautiful Highland scenery. Cool, clear fresh water conditions.'),
('Bosphorus Cross-Continental Swim', 'swimming', 'Turkey', 'Istanbul', 6.5, 0, 7, 21, 26, 65, 0, 'Swim between two continents from Asia to Europe across the Bosphorus Strait.');

-- ============================================================
-- SEED DATA: TRIATHLON
-- ============================================================
INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
('IRONMAN World Championship Kona', 'triathlon', 'USA', 'Kailua-Kona', 226, 1200, 10, 12, 32, 65, 5, 'The Super Bowl of triathlon. 2.4mi swim, 112mi bike, 26.2mi run in brutal Hawaiian lava fields.'),
('Challenge Roth', 'triathlon', 'Germany', 'Roth', 226, 900, 7, 6, 28, 55, 318, 'The fastest full distance triathlon on earth. Multiple world records set here. 220,000 spectators.'),
('IRONMAN Frankfurt', 'triathlon', 'Germany', 'Frankfurt', 226, 1800, 6, 28, 24, 60, 93, 'European Championship full distance in Frankfurt. Hot conditions and challenging bike course.'),
('IRONMAN Lanzarote', 'triathlon', 'Spain', 'Lanzarote', 226, 2600, 5, 18, 24, 60, 10, 'The beast of the Canary Islands. Wind, heat, and 2,600m of climbing through volcanic landscape.'),
('IRONMAN 70.3 Oceanside', 'triathlon', 'USA', 'Oceanside', 113, 800, 4, 5, 18, 70, 5, 'North American half-distance season opener in San Diego County. Rolling ocean and naval base views.'),
('IRONMAN 70.3 World Championship', 'triathlon', 'Varies', 'Varies', 113, 900, 9, 7, 22, 65, 100, 'Annual half-distance world championship. Location rotates between elite global venues.'),
('IRONMAN New Zealand', 'triathlon', 'New Zealand', 'Taupo', 226, 1500, 3, 2, 22, 65, 367, 'Beautiful race in the heart of the North Island. Views of Lake Taupo and volcanic mountains.'),
('IRONMAN Melbourne', 'triathlon', 'Australia', 'Frankston', 226, 1200, 3, 24, 22, 65, 5, 'Full distance in Port Phillip Bay. Quality road surfaces and reliable conditions for fast times.'),
('IRONMAN Cairns', 'triathlon', 'Australia', 'Cairns', 226, 900, 6, 15, 24, 75, 5, 'Tropical setting on the Great Barrier Reef coast. Warm water swim and challenging run in humidity.'),
('IRONMAN Wales', 'triathlon', 'UK', 'Tenby', 226, 2400, 9, 21, 14, 75, 50, 'One of the toughest IRONMAN courses. Brutal Welsh hills, dramatic coastline, and passionate crowds.'),
('IRONMAN Copenhagen', 'triathlon', 'Denmark', 'Copenhagen', 226, 1200, 8, 18, 20, 65, 5, 'Iconic harbour swim past the Little Mermaid. Two-lap run through Copenhagen city center.'),
('IRONMAN Nice', 'triathlon', 'France', 'Nice', 226, 3000, 6, 23, 26, 55, 5, 'French Riviera race with Mediterranean swim and challenging Alpine bike course. Very hot run.'),
('IRONMAN Barcelona', 'triathlon', 'Spain', 'Calella', 226, 1200, 10, 6, 20, 65, 5, 'Late-season full distance on the Costa del Maresme. Flat bike course ideal for fast times.'),
('IRONMAN 70.3 Buenos Aires', 'triathlon', 'Argentina', 'Buenos Aires', 113, 300, 2, 16, 28, 75, 10, 'Southern Hemisphere half-distance on the banks of the Río de la Plata. Hot and humid conditions.'),
('IRONMAN 70.3 Marbella', 'triathlon', 'Spain', 'Marbella', 113, 1400, 4, 27, 20, 60, 5, 'Costa del Sol race with scenic mountain bike course. One of Europe''s top spring 70.3 events.'),
('IRONMAN Texas', 'triathlon', 'USA', 'The Woodlands', 226, 600, 4, 26, 24, 80, 30, 'North American Championship full distance. Lake Woodlands swim, flat bike, hot run through forests.'),
('IRONMAN Florida', 'triathlon', 'USA', 'Panama City Beach', 226, 300, 11, 2, 22, 70, 5, 'Late-season full distance on the Gulf Coast. Warm flat waters, fast bike course, warm run.'),
('IRONMAN 70.3 Pays d''Aix', 'triathlon', 'France', 'Aix-en-Provence', 113, 1200, 6, 9, 26, 50, 220, 'Provence race through lavender fields and historic Aix-en-Provence. Hot summer conditions.'),
('IRONMAN UK', 'triathlon', 'UK', 'Bolton', 226, 2600, 7, 13, 16, 70, 120, 'Full distance in the English countryside. Notorious for steep hilly bike course and variable weather.');

-- ============================================================
-- SEED DATA: HYROX
-- ============================================================
INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
('HYROX World Championship Hamburg', 'hyrox', 'Germany', 'Hamburg', 8, 0, 5, 18, 18, 65, 5, 'The HYROX World Championship. 8x 1km run + 8 functional fitness stations. The ultimate fitness race.'),
('HYROX Berlin', 'hyrox', 'Germany', 'Berlin', 8, 0, 10, 26, 16, 65, 34, 'HYROX season event in the German capital. Indoor venue at Berlin Arena.'),
('HYROX London', 'hyrox', 'UK', 'London', 8, 0, 11, 9, 12, 70, 11, 'HYROX UK season event at London Excel or similar venue. Large British contingent.'),
('HYROX Amsterdam', 'hyrox', 'Netherlands', 'Amsterdam', 8, 0, 2, 15, 8, 75, 2, 'HYROX Dutch season event. Indoor venue in Amsterdam RAI or similar.'),
('HYROX New York', 'hyrox', 'USA', 'New York City', 8, 0, 1, 18, 6, 65, 10, 'HYROX North America season opener. Indoor venue in New York.'),
('HYROX Chicago', 'hyrox', 'USA', 'Chicago', 8, 0, 3, 8, 8, 65, 176, 'HYROX Midwest event in Chicago. Indoor venue in the convention district.'),
('HYROX Los Angeles', 'hyrox', 'USA', 'Los Angeles', 8, 0, 4, 19, 20, 65, 80, 'HYROX West Coast event. Indoor venue in LA Convention Center or similar.'),
('HYROX Sydney', 'hyrox', 'Australia', 'Sydney', 8, 0, 6, 21, 16, 65, 30, 'HYROX Oceania event. First Australian HYROX season race. Indoor venue in Sydney.'),
('HYROX Dubai', 'hyrox', 'UAE', 'Dubai', 8, 0, 1, 25, 24, 60, 5, 'HYROX Middle East event at Dubai World Trade Centre. Air-conditioned indoor venue.'),
('HYROX Munich', 'hyrox', 'Germany', 'Munich', 8, 0, 12, 14, 4, 75, 520, 'HYROX Bavarian season finale event. Held at Olympiahalle or similar Munich venue.'),
('HYROX Copenhagen', 'hyrox', 'Denmark', 'Copenhagen', 8, 0, 3, 22, 8, 65, 5, 'HYROX Scandinavian event in Copenhagen. Indoor venue in the Danish capital.'),
('HYROX Frankfurt', 'hyrox', 'Germany', 'Frankfurt', 8, 0, 11, 23, 8, 70, 93, 'HYROX event in Germany''s financial capital. Indoor venue in the Frankfurt Messe.');
