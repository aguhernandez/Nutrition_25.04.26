/*
  # LATAM Races Seed

  ## Overview
  Adds principal races from Latin America (Argentina, Chile, Brazil, Colombia, Mexico,
  Peru, Uruguay, Ecuador, Costa Rica, Bolivia, and more) across all supported disciplines:
  running, trail_running, cycling_road, cycling_gravel, cycling_mtb.

  ## Races Added
  - Road Running: ~30 races (marathons, half marathons, 10Ks emblematic)
  - Trail Running: ~25 races
  - Cycling Road: ~15 gran fondos / fondos
  - Cycling Gravel: ~10 races
  - Mountain Bike: ~10 races

  ## Notes
  - All data is based on historical editions
  - typical_month/day are approximate; athletes should verify current-year dates
  - altitude_m is approximate start altitude above sea level
*/

-- ============================================================
-- ROAD RUNNING — ARGENTINA
-- ============================================================
INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
('Maratón de Buenos Aires', 'running', 'Argentina', 'Buenos Aires', 42.2, 60, 10, 13, 18, 75, 25, 'La maratón más grande de Argentina. Corre por los barrios icónicos de Buenos Aires: Palermo, Puerto Madero y la Costanera.'),
('Media Maratón de Buenos Aires', 'running', 'Argentina', 'Buenos Aires', 21.1, 30, 8, 25, 16, 70, 25, 'Media maratón de primer nivel organizada por el gobierno de la Ciudad. Recorre Palermo y el centro porteño.'),
('Maratón Internacional de Rosario', 'running', 'Argentina', 'Rosario', 42.2, 40, 11, 19, 20, 70, 22, 'Maratón a orillas del Río Paraná. Circuito plano y veloz con gran participación popular.'),
('Maratón de Córdoba', 'running', 'Argentina', 'Córdoba', 42.2, 120, 5, 12, 15, 55, 425, 'La maratón más importante del interior de Argentina. Recorre el centro histórico de la ciudad y las sierras chicas.'),
('Maratón de Mar del Plata', 'running', 'Argentina', 'Mar del Plata', 42.2, 80, 3, 16, 22, 80, 20, 'Clásico maratón de verano en la ciudad costera más popular de Argentina. Brisa marina y circuito pintoresco.'),
('Maratón Internacional de Mendoza', 'running', 'Argentina', 'Mendoza', 42.2, 200, 10, 6, 18, 40, 750, 'Maratón en la ciudad vitivinícola con vistas a los Andes. Clima seco y circuito por bodegas y arboledas.'),
('10K Ciudad de Buenos Aires', 'running', 'Argentina', 'Buenos Aires', 10, 30, 5, 26, 18, 65, 25, 'La carrera de 10K más masiva de Argentina. Miles de corredores por el Parque Tres de Febrero y Palermo.'),
('42K del Valle de San Rafael', 'running', 'Argentina', 'San Rafael', 42.2, 250, 9, 8, 16, 40, 690, 'Maratón en el corazón de la vitivinicultura mendocina. Paisajes andinos y viñedos espectaculares.'),
('Maratón Nocturna de Buenos Aires', 'running', 'Argentina', 'Buenos Aires', 21.1, 20, 12, 7, 22, 70, 25, 'Media maratón nocturna por los barrios más iluminados de la capital. Ambiente festivo único.'),
('Maratón de Ushuaia', 'running', 'Argentina', 'Ushuaia', 42.2, 600, 3, 9, 8, 75, 30, 'La maratón más austral del mundo. Recorre las afueras de Ushuaia con vistas al Canal de Beagle y la Cordillera.'),

-- ============================================================
-- ROAD RUNNING — BRASIL
-- ============================================================
('Maratona de São Paulo', 'running', 'Brasil', 'São Paulo', 42.2, 200, 5, 26, 22, 70, 760, 'La maratona más grande de Brasil. Corre por las avenidas Paulista y 23 de Maio, icónicas del skyline paulistano.'),
('Maratona do Rio de Janeiro', 'running', 'Brasil', 'Rio de Janeiro', 42.2, 200, 6, 23, 25, 75, 10, 'Maratona por la Zona Sul carioca. Pasa por Ipanema, Leblon, y la orla de Copacabana con el Pão de Açúcar de fondo.'),
('Meia Maratona Internacional de São Paulo', 'running', 'Brasil', 'São Paulo', 21.1, 150, 5, 12, 22, 70, 760, 'Media maratona por la Avenida Paulista y barrios históricos de São Paulo.'),
('Maratona de Porto Alegre', 'running', 'Brasil', 'Porto Alegre', 42.2, 100, 6, 16, 16, 70, 46, 'Maratona de la capital gaucha. Circuito por el centro histórico y la costanera del Guaíba.'),
('Maratona de Brasília', 'running', 'Brasil', 'Brasília', 42.2, 150, 6, 2, 22, 50, 1172, 'Maratona en la capital federal. Altitud moderada y clima seco típico del cerrado brasilerño.'),

-- ============================================================
-- ROAD RUNNING — CHILE
-- ============================================================
('Maratón de Santiago', 'running', 'Chile', 'Santiago', 42.2, 150, 4, 14, 16, 65, 567, 'La maratón más importante de Chile. Recorre el Parque O''Higgins, Providencia y el centro histórico con los Andes al fondo.'),
('Maratón Internacional de Valparaíso', 'running', 'Chile', 'Valparaíso', 42.2, 800, 5, 19, 14, 75, 30, 'Maratón en la bohemia ciudad portuaria patrimonio de la humanidad. Circuito por los cerros y el plan de Valparaíso.'),
('Medio Maratón de Santiago', 'running', 'Chile', 'Santiago', 21.1, 80, 9, 10, 14, 60, 567, 'Media maratón masiva por las principales avenidas de Santiago. Clima fresco de primavera chilena.'),

-- ============================================================
-- ROAD RUNNING — COLOMBIA
-- ============================================================
('Maratón de Bogotá CAF', 'running', 'Colombia', 'Bogotá', 42.2, 250, 7, 28, 14, 75, 2600, 'La maratón a mayor altitud de las grandes ciudades latinoamericanas. Recorre la Séptima y el norte de Bogotá.'),
('Media Maratón de Bogotá', 'running', 'Colombia', 'Bogotá', 21.1, 150, 8, 4, 14, 75, 2600, 'La media maratón más grande de Colombia. Decenas de miles de corredores por la Avenida El Dorado y Zona Rosa.'),
('Media Maratón de Medellín', 'running', 'Colombia', 'Medellín', 21.1, 300, 11, 10, 22, 70, 1495, 'Ciudad Eterna de la Primavera. Recorre el Valle de Aburrá con clima perfecto y ambiente festivo antioqueño.'),
('Maratón de Cali', 'running', 'Colombia', 'Cali', 42.2, 150, 10, 25, 26, 75, 995, 'Maratón en la capital mundial de la salsa. Calor tropical y ambiente vibrante en el sur colombiano.'),

-- ============================================================
-- ROAD RUNNING — MÉXICO
-- ============================================================
('Maratón CDMX – Ciudad de México', 'running', 'México', 'Ciudad de México', 42.2, 300, 8, 25, 18, 60, 2240, 'La maratón más grande de México. Recorre el Bosque de Chapultepec, el Paseo de la Reforma y el Zócalo.'),
('Media Maratón CDMX', 'running', 'México', 'Ciudad de México', 21.1, 200, 4, 14, 18, 60, 2240, 'Media maratón por el corazón histórico de la capital mexicana con la Catedral y el Palacio de Bellas Artes.'),
('Maratón de Guadalajara Banorte', 'running', 'México', 'Guadalajara', 42.2, 200, 11, 24, 20, 60, 1566, 'La maratón de la ciudad del tequila y el mariachi. Circuito por el centro tapatío y la Expo Guadalajara.'),
('Maratón Rock ''n'' Roll Monterrey', 'running', 'México', 'Monterrey', 42.2, 200, 12, 1, 18, 55, 538, 'Maratón espectáculo con música en vivo. Recorre la zona financiera y el Parque Fundidora.'),

-- ============================================================
-- ROAD RUNNING — PERÚ Y RESTO DE LATAM
-- ============================================================
('Maratón de Lima', 'running', 'Perú', 'Lima', 42.2, 200, 7, 28, 18, 85, 154, 'Maratón por los distritos de Miraflores, San Isidro y el Circuito Mágico del Agua. Clima limeño de invierno.'),
('Maratón de Montevideo', 'running', 'Uruguay', 'Montevideo', 42.2, 80, 9, 15, 16, 70, 20, 'Maratón a orillas del Río de la Plata. Circuito plano por la Rambla montevideana, una de las más largas del mundo.'),
('Maratón de Quito', 'running', 'Ecuador', 'Quito', 42.2, 500, 12, 1, 14, 65, 2850, 'Maratón en la ciudad más alta del mundo con más de 1 millón de habitantes. Circuito por el casco histórico patrimonio UNESCO.');

-- ============================================================
-- TRAIL RUNNING — ARGENTINA
-- ============================================================
INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
('Ultra Trail Nahuel Huapi', 'trail_running', 'Argentina', 'Bariloche', 100, 5800, 2, 10, 14, 65, 765, 'Ultra trail por los senderos vírgenes del Parque Nacional Nahuel Huapi. Cruce de arroyos, bosques de lengas y vistas al lago.'),
('Cruce de los Andes', 'trail_running', 'Argentina', 'San Martín de los Andes', 4, 0, 3, 7, 16, 55, 640, 'Travesía de 4 etapas entre Argentina y Chile cruzando la Cordillera de los Andes. Paisajes patagónicos únicos.'),
('Trail Ushuaia', 'trail_running', 'Argentina', 'Ushuaia', 42, 2800, 2, 17, 8, 75, 30, 'Trail en el Parque Nacional Tierra del Fuego. El trail más austral del mundo con turbales, costas y bosques subantárticos.'),
('Desafío Frontera Ultra', 'trail_running', 'Argentina', 'Mendoza', 100, 5500, 4, 20, 16, 30, 1800, 'Ultra trail en la alta montaña mendocina. Cruce de ríos de deshielo, pasos de altura y vistas al Aconcagua.'),
('Ultra Sierra de las Quijadas', 'trail_running', 'Argentina', 'San Luis', 50, 1800, 5, 18, 20, 40, 700, 'Trail por el Parque Nacional Sierra de las Quijadas. Cañones colorados y flora xerófila del árido sanluiseño.'),
('Patagonia Salvaje Trail 100K', 'trail_running', 'Argentina', 'El Chaltén', 100, 6800, 1, 20, 12, 60, 400, 'Ultra trail en el corazón de la Patagonia con el Fitz Roy y el Cerro Torre de telón de fondo. Vientos legendarios.'),
('Trail de los Comechingones', 'trail_running', 'Argentina', 'Villa de Merlo', 50, 2500, 9, 14, 16, 55, 800, 'Trail por las Sierras de Comechingones en San Luis y Córdoba. Flora serrana y ríos cristalinos.'),
('Maratón de la Montaña Potrerillos', 'trail_running', 'Argentina', 'Potrerillos', 42, 2200, 11, 19, 20, 35, 1350, 'Trail en los faldeos de los Andes mendocinos junto al lago Potrerillos. Alta montaña seca y paisajes de viñedos.'),

-- ============================================================
-- TRAIL RUNNING — CHILE
-- ============================================================
('Torres del Paine Ultra 100K', 'trail_running', 'Chile', 'Torres del Paine', 100, 5200, 11, 15, 10, 65, 200, 'Circunda el macizo del Paine en uno de los parques más espectaculares del mundo. Viento patagónico y glaciares.'),
('Ultra Trail Atacama', 'trail_running', 'Chile', 'San Pedro de Atacama', 100, 2500, 9, 20, 18, 15, 2400, 'Ultra trail en el desierto más árido del mundo. Géiseres, lagunas de sal y volcanes de más de 5000m.'),
('Ultra Trail Cajón del Maipo', 'trail_running', 'Chile', 'San José de Maipo', 70, 4000, 4, 6, 14, 45, 1100, 'Trail en el Cajón del Maipo, el pulmón verde de Santiago. Bordes de ríos, cordillera y bosque nativo.'),
('Ruta de los Parques de la Patagonia', 'trail_running', 'Chile', 'Cochrane', 42, 2400, 2, 8, 12, 70, 200, 'Trail por los nuevos parques patagónicos chilenos. Bosques vírgenes y fauna autóctona de la Carretera Austral.'),

-- ============================================================
-- TRAIL RUNNING — COLOMBIA
-- ============================================================
('Ultra Trail Colombia', 'trail_running', 'Colombia', 'Medellín', 80, 5200, 2, 12, 18, 75, 1495, 'Ultra trail por las montañas antioqueñas con cafetales, páramos y cascadas. UTMB World Series qualifier.'),
('Ultra Trail Santa Elena', 'trail_running', 'Colombia', 'Medellín', 50, 3500, 8, 20, 16, 80, 1495, 'Trail por el corregimiento de Santa Elena y el Parque Arví. Bosque andino y fincas floriculturistas.'),
('Ultra Trail Bogotá', 'trail_running', 'Colombia', 'Bogotá', 60, 3800, 5, 18, 12, 75, 2600, 'Trail en los Cerros Orientales de Bogotá. Páramo de Chingaza y vistas panorámicas de la Sabana.'),
('Salento Ultra Trail', 'trail_running', 'Colombia', 'Salento', 42, 3000, 10, 8, 18, 80, 1895, 'Trail en el Eje Cafetero por los valles de palma de cera en el Valle de Cocora. Patrimonio UNESCO.'),

-- ============================================================
-- TRAIL RUNNING — PERU Y RESTO
-- ============================================================
('Ultra Trail Machu Picchu', 'trail_running', 'Perú', 'Aguas Calientes', 50, 4200, 6, 5, 16, 75, 2050, 'Trail por los senderos incas que rodean la ciudadela de Machu Picchu. Selva de niebla y ruinas arqueológicas.'),
('Inca Trail Race', 'trail_running', 'Perú', 'Cusco', 42, 4200, 8, 10, 12, 65, 3400, 'Carrera por el clásico Camino Inca hasta la Puerta del Sol. Arqueología andina y altiplano de los Andes.'),
('Bolivia Mountain Trail', 'trail_running', 'Bolivia', 'La Paz', 42, 3500, 7, 15, 8, 55, 3600, 'Trail en los alrededores de La Paz, la capital más alta del mundo. Cordillera Real y Altiplano boliviano.'),
('Ultra Trail Ecuador Volcanes', 'trail_running', 'Ecuador', 'Latacunga', 80, 5500, 7, 20, 10, 65, 2900, 'Trail entre los volcanes Cotopaxi y Chimborazo. La avenida de los volcanes ecuatorianos a más de 4000m.'),
('Ultra Trail de México Mazamitla', 'trail_running', 'México', 'Mazamitla', 60, 3200, 10, 12, 18, 65, 2000, 'Trail en el Pueblo Mágico de Mazamitla, Jalisco. Bosques de pinos y barrancas de la Sierra del Tigre.'),
('Ultra Nevado de Toluca', 'trail_running', 'México', 'Toluca', 42, 2800, 9, 14, 12, 55, 2680, 'Trail al volcán Nevado de Toluca, el cuarto volcán más alto de México. Laguna del Sol y cráter imponente.');

-- ============================================================
-- CYCLING ROAD — ARGENTINA
-- ============================================================
INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
('Gran Fondo Mendoza', 'cycling_road', 'Argentina', 'Mendoza', 160, 2800, 10, 5, 18, 35, 750, 'Fondo por los viñedos y bodegas de Mendoza con los Andes cubiertos de nieve de telón de fondo. Ruta 7 y caminos rurales.'),
('Clásica San Juan Ciclismo', 'cycling_road', 'Argentina', 'San Juan', 180, 3200, 3, 8, 22, 30, 630, 'Fondo en los valles vitivinícolas de San Juan. Ruta hacia el Parque Ischigualasto (Valle de la Luna).'),
('Gran Fondo Bariloche', 'cycling_road', 'Argentina', 'Bariloche', 130, 2200, 2, 15, 20, 55, 765, 'Fondo por la Ruta de los Siete Lagos en la Patagonia andina. Lagos Nahuel Huapi, Espejo y Correntoso.'),
('Vuelta del Valle Catamarca', 'cycling_road', 'Argentina', 'Catamarca', 140, 2500, 8, 12, 20, 30, 500, 'Fondo por los valles del noroeste argentino. Puna, quebradas y paisajes desérticos del NOA.'),

-- ============================================================
-- CYCLING ROAD — CHILE / COLOMBIA / BRASIL
-- ============================================================
('Granfondo Colchagua', 'cycling_road', 'Chile', 'Santa Cruz', 160, 2400, 4, 20, 18, 55, 180, 'Fondo por la región vitivinícola de Colchagua. Viñedos, haciendas coloniales y vistas a la Cordillera.'),
('Granfondo Cartagena', 'cycling_road', 'Colombia', 'Cartagena', 120, 800, 11, 16, 30, 80, 5, 'Fondo por la costa caribeña colombiana cerca de Cartagena. Calor tropical, palmeras y playas.'),
('Granfondo Ruta del Café Colombia', 'cycling_road', 'Colombia', 'Armenia', 150, 3500, 9, 21, 22, 75, 1540, 'Fondo por el Eje Cafetero entre montañas cubiertas de cafetales. Paisajes Patrimonio UNESCO.'),
('Granfondo Camboriú', 'cycling_road', 'Brasil', 'Balneário Camboriú', 130, 2400, 3, 9, 26, 75, 5, 'Fondo en la Costa del Estado de Santa Catarina. Subidas costeras y vistas espectaculares al Atlántico sur.'),
('Granfondo Rio de Janeiro', 'cycling_road', 'Brasil', 'Rio de Janeiro', 150, 1800, 7, 12, 24, 70, 10, 'Fondo por las laderas del Corcovado, la Lagoa Rodrigo de Freitas y la orla de Barra da Tijuca.'),
('Granfondo CDMX', 'cycling_road', 'México', 'Ciudad de México', 140, 2500, 10, 18, 18, 55, 2240, 'Fondo que sale del Bosque de Chapultepec hacia las carreteras del Ajusco. Altura y paisajes volcánicos.');

-- ============================================================
-- CYCLING GRAVEL — LATAM
-- ============================================================
INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
('Grava de los Andes Argentina', 'cycling_gravel', 'Argentina', 'Mendoza', 200, 4500, 11, 8, 20, 30, 750, 'Gravel epíco por las huellas y ripieras de la alta montaña mendocina. Caminos de vino y cerros en 200km sin asfalto.'),
('Gravel del Fin del Mundo', 'cycling_gravel', 'Argentina', 'Ushuaia', 160, 3500, 1, 20, 10, 70, 30, 'Gravel en el extremo austral del mundo. Huellas boscosas y vistas al Canal de Beagle y los glaciares de Tierra del Fuego.'),
('Gravel Ruta de la Sal Atacama', 'cycling_gravel', 'Chile', 'San Pedro de Atacama', 250, 3000, 5, 10, 16, 10, 2400, 'Gravel épico por el salar de Atacama, lagunas de flamencos y volcanes del altiplano. Autosuficiente y extremo.'),
('Gravel Patagonia Ruta de los Parques', 'cycling_gravel', 'Chile', 'Coyhaique', 300, 5500, 2, 12, 14, 60, 300, 'Gravel por la Carretera Austral entre parques nacionales patagónicos. Ríos turquesa y bosques templados lluviosos.'),
('Caminos de Agua Gravel Brasil', 'cycling_gravel', 'Brasil', 'Petrópolis', 180, 4200, 7, 14, 20, 70, 840, 'Gravel por las estradas de tierra de la Serra Fluminense. Cascadas, fazendas históricas y bosque atlántico.'),
('Gravel del Café Colombia', 'cycling_gravel', 'Colombia', 'Manizales', 220, 6500, 9, 27, 18, 75, 2153, 'Gravel por las montañas del Eje Cafetero. Caminos veredes entre cafetales a más de 2000m de altitud.'),
('Gravel Valle de Bravo México', 'cycling_gravel', 'México', 'Valle de Bravo', 180, 4000, 10, 22, 18, 60, 1870, 'Gravel por las terracerías del Estado de México. Bosques de oyamel, cascadas y el lago de Valle de Bravo.'),
('Gravel Lago Titicaca Bolivia-Perú', 'cycling_gravel', 'Bolivia', 'Copacabana', 200, 2000, 6, 18, 10, 55, 3800, 'Gravel a orillas del Lago Titicaca, el lago navegable más alto del mundo. Altiplano andino y comunidades aymaras.');

-- ============================================================
-- MOUNTAIN BIKE — LATAM
-- ============================================================
INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
('TransAndes MTB Challenge', 'cycling_mtb', 'Argentina', 'San Martín de los Andes', 420, 14000, 2, 3, 18, 55, 640, 'Stage race de 5 etapas cruzando los Andes patagónicos entre Argentina y Chile. Paisajes vírgenes y singletrack técnico.'),
('Enduro de los Volcanes Chile', 'cycling_mtb', 'Chile', 'Pucón', 120, 4500, 3, 12, 18, 65, 220, 'Enduro en las laderas del Volcán Villarrica activo. Singletrack técnico entre araucarias milenarias en la Araucanía.'),
('Mega Avalanche Bariloche', 'cycling_mtb', 'Argentina', 'Bariloche', 30, 2200, 1, 15, 20, 50, 1700, 'Mass-start descenso desde el Cerro Catedral. El Mega Avalanche más austral del mundo con nieve y tierra.'),
('Colombia Tierra de Ciclistas MTB', 'cycling_mtb', 'Colombia', 'Medellín', 280, 9500, 3, 18, 22, 70, 1495, 'Stage race de 4 días por las montañas antioqueñas. Singletrack técnico con descensos y paisajes cafeteros.'),
('Marathon das Cataratas MTB Brasil', 'cycling_mtb', 'Brasil', 'Foz do Iguaçu', 80, 1500, 8, 10, 22, 75, 200, 'MTB marathon en las inmediaciones de las Cataratas del Iguazú, Patrimonio de la Humanidad.'),
('Ruta Inca MTB Perú', 'cycling_mtb', 'Perú', 'Cusco', 200, 6500, 7, 20, 16, 55, 3400, 'Stage race de 3 etapas por caminos incas en MTB. Desde los 4800m del altiplano hasta los 2000m de la selva alta.'),
('MTB Cerro Bayo Neuquén', 'cycling_mtb', 'Argentina', 'Villa la Angostura', 60, 2800, 3, 8, 18, 60, 860, 'XC y enduro en los senderos técnicos del Cerro Bayo en Villa la Angostura. Bosque de arrayanes y lago Correntoso.'),
('La Ruta de los Conquistadores Costa Rica', 'cycling_mtb', 'Costa Rica', 'San José', 530, 12000, 11, 12, 28, 80, 900, 'La carrera de MTB más dura del mundo. 3 etapas cruzando Costa Rica del Pacífico al Atlántico por jungla y volcanes.');
