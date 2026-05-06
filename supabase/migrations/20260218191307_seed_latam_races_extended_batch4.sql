/*
  # LATAM Races Extended Batch 4 — Cycling Road, Gravel & MTB (massively expanded)
*/

INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
-- CYCLING ROAD — ARGENTINA EXTRA
('Gran Fondo Alta Montaña Mendoza', 'cycling_road', 'Argentina', 'Mendoza', 200, 4500, 10, 12, 18, 30, 750, 'Fondo por la Ruta Alta Montaña hacia las Cumbres Chilenas. Bodegas, viñedos y Puente del Inca.'),
('Fondo Ruta 40 Patagónica', 'cycling_road', 'Argentina', 'El Calafate', 160, 2000, 1, 14, 16, 60, 200, 'Fondo por la legendaria Ruta 40 patagónica entre El Calafate y el Glaciar Perito Moreno.'),
('Gran Fondo Córdoba Clásica', 'cycling_road', 'Argentina', 'Córdoba', 140, 2800, 9, 28, 18, 50, 425, 'Fondo por las Sierras de Córdoba. Alta Gracia, Villa Carlos Paz y el Dique Los Molinos.'),
('Fondo del Litoral Corrientes', 'cycling_road', 'Argentina', 'Corrientes', 120, 200, 8, 10, 22, 70, 75, 'Fondo por el litoral mesopotamico entre Corrientes y Resistencia. Puente General Belgrano.'),
('Gran Fondo Mar y Sierras', 'cycling_road', 'Argentina', 'Tandil', 160, 2200, 11, 8, 20, 60, 400, 'Fondo por las sierras de Tandil y la costa atlántica bonaerense. Queso, dulce de leche y paisajes pampeanos.'),
('Gran Fondo Ruta del Perito', 'cycling_road', 'Argentina', 'Bariloche', 180, 3000, 2, 7, 18, 55, 765, 'Fondo en homenaje a Francisco Moreno por la Ruta de los Siete Lagos. Los lagos más bellos de la Patagonia.'),
('Fondo Jujuy Colonial', 'cycling_road', 'Argentina', 'Jujuy', 130, 2500, 9, 5, 20, 40, 1259, 'Fondo por la Quebrada de Humahuaca y los pueblos colorados del NOA argentino.'),
('Gran Fondo Trasandino', 'cycling_road', 'Argentina', 'Mendoza', 220, 4800, 10, 19, 18, 30, 750, 'Fondo épico cruzando los Andes hacia Chile por el Paso Cristo Redentor. El más alto del continente.'),
('Fondo Esteros del Iberá', 'cycling_road', 'Argentina', 'Corrientes', 120, 100, 7, 15, 20, 70, 75, 'Fondo por los Esteros del Iberá, el gran humedal de Sudamérica. Capybaras y aves en su hábitat.'),
('Gran Fondo Vuelta de Neuquén', 'cycling_road', 'Argentina', 'Neuquén', 150, 2500, 3, 16, 20, 40, 271, 'Fondo por la confluencia y los valles del norte neuquino, tierra de dinosaurios y petroleo.'),
-- CYCLING ROAD — BRASIL EXTRA
('Gran Fondo Serra Gaúcha', 'cycling_road', 'Brasil', 'Bento Gonçalves', 140, 3200, 4, 19, 16, 70, 700, 'Fondo por los viñedos y cantinas de la Serra Gaúcha. La región vitivinícola más importante de Brasil.'),
('Gran Fondo do Circuito das Águas', 'cycling_road', 'Brasil', 'Poços de Caldas', 160, 2800, 7, 12, 18, 65, 1180, 'Fondo por las ciudades balnearias de Minas Gerais con aguas termales sulfurosas y cafés coloniais.'),
('Gran Fondo Florianópolis 180K', 'cycling_road', 'Brasil', 'Florianópolis', 180, 2500, 8, 17, 20, 75, 5, 'Circunvalación completa de la isla de Florianópolis. Las playas más famosas de Santa Catarina.'),
('Gran Fondo Petrópolis-Teresópolis', 'cycling_road', 'Brasil', 'Petrópolis', 120, 3500, 7, 14, 18, 70, 840, 'Fondo por la Serra Fluminense entre la ciudad imperial y la cidade de las flores.'),
('Volta ao Estado do Espírito Santo', 'cycling_road', 'Brasil', 'Vitória', 180, 3000, 8, 11, 24, 75, 10, 'Gran fondo por las costas y montañas del Espírito Santo. Pico da Bandeira y praias capixabas.'),
-- CYCLING ROAD — CHILE EXTRA
('Granfondo de los Lagos', 'cycling_road', 'Chile', 'Puerto Varas', 180, 3200, 3, 21, 16, 70, 75, 'Fondo por el Lake District chileno entre los lagos Llanquihue, Todos los Santos y Rupanco. Volcanes.'),
('Granfondo Carretera Austral', 'cycling_road', 'Chile', 'Coyhaique', 200, 4000, 2, 15, 14, 65, 300, 'Fondo por la mítica Carretera Austral. Los paisajes más remotos e impresionantes del mundo.'),
('Granfondo Atacama Stage', 'cycling_road', 'Chile', 'Antofagasta', 160, 2500, 9, 12, 18, 15, 200, 'Fondo por el desierto de Atacama y la costa del norte chileno. Colosos de la minería del cobre.'),
('Granfondo Elqui Valley', 'cycling_road', 'Chile', 'Vicuña', 140, 2800, 10, 8, 20, 30, 700, 'Fondo por el Valle del Elqui, hogar del pisco y de los mejores cielos estrellados del mundo.'),
('Granfondo Maipo-Cachapoal', 'cycling_road', 'Chile', 'Rancagua', 150, 2500, 11, 7, 18, 55, 480, 'Fondo por los valles vitivinícolas del Maipo y Cachapoal. Bodegas y haciendas históricas del centro.'),
-- CYCLING ROAD — COLOMBIA EXTRA
('Gran Fondo Aparta la Pena', 'cycling_road', 'Colombia', 'Bogotá', 160, 4500, 9, 13, 14, 70, 2600, 'Fondo emblemático desde Bogotá hacia los Llanos Orientales. El descenso del Boqueron del Páramo.'),
('Granfondo de las Flores Medellín', 'cycling_road', 'Colombia', 'Medellín', 150, 4000, 8, 3, 20, 70, 1495, 'Fondo que coincide con la Feria de las Flores. Silleteros, cultura paisa y montañas antioqueñas.'),
('Granfondo Cali-Buenaventura', 'cycling_road', 'Colombia', 'Cali', 120, 3000, 11, 22, 24, 80, 995, 'Fondo desde el valle del Cauca hasta el Pacífico colombiano cruzando la Cordillera Occidental.'),
('Gran Fondo Monserrate Bogotá', 'cycling_road', 'Colombia', 'Bogotá', 100, 3500, 10, 26, 14, 75, 2600, 'Fondo que incluye la subida al cerro Monserrate, el ícono de Bogotá a 3152 msnm.'),
-- CYCLING ROAD — MÉXICO EXTRA
('Gran Fondo Ruta del Tequila', 'cycling_road', 'México', 'Tequila', 130, 2200, 11, 15, 22, 55, 1200, 'Fondo por los campos de agave azul del municipio de Tequila, Patrimonio de la Humanidad UNESCO.'),
('Gran Fondo Monarch Butterfly', 'cycling_road', 'México', 'Angangueo', 120, 3200, 2, 8, 14, 55, 1950, 'Fondo hacia la Reserva de la Biósfera de la Mariposa Monarca. El milagro natural más bello de México.'),
('Gran Fondo Baja California', 'cycling_road', 'México', 'Ensenada', 160, 2000, 10, 19, 20, 65, 10, 'Fondo por la ruta del Valle de Guadalupe y la costa del Pacífico bajacaliforniano.'),
('Gran Fondo de Oaxaca', 'cycling_road', 'México', 'Oaxaca', 140, 3000, 11, 2, 20, 55, 1500, 'Fondo por los Valles Centrales oaxaqueños. Monte Albán zapoteca y mezcalerías rurales de Miahuatlán.'),
-- CYCLING ROAD — PERÚ/OTROS
('Gran Fondo Cusco Sacred Valley', 'cycling_road', 'Perú', 'Cusco', 130, 3500, 7, 8, 16, 50, 3400, 'Fondo por el Valle Sagrado de los Incas. Ollantaytambo, Pisac y las ruinas camino a Machu Picchu.'),
('Gran Fondo Colca Canyon', 'cycling_road', 'Perú', 'Arequipa', 160, 4500, 7, 19, 16, 35, 2335, 'Fondo hacia el Cañón del Colca con la observación del cóndor andino en vuelo sobre el valle.'),
('Gran Fondo Santa Cruz Bolivia', 'cycling_road', 'Bolivia', 'Santa Cruz de la Sierra', 120, 800, 7, 12, 22, 60, 416, 'Fondo por los llanos orientales bolivianos y los valles cruceños de producción soyera.'),

-- ============================================================
-- CYCLING GRAVEL — LATAM EXTRA
-- ============================================================
('Gravel de las Sierras Córdoba', 'cycling_gravel', 'Argentina', 'Villa General Belgrano', 200, 4000, 10, 4, 18, 50, 800, 'Gravel épico por las sierras grandes y sierras chicas cordobesas. Ripieras y huellas de los valles serranos.'),
('Gravel Cuyo Profundo', 'cycling_gravel', 'Argentina', 'San Juan', 250, 5500, 9, 20, 22, 25, 700, 'Gravel por los valles áridos del norte de Mendoza y San Juan. Caminos de tierra entre viñedos y olivares.'),
('Gravel Patagonia Norte', 'cycling_gravel', 'Argentina', 'Junín de los Andes', 240, 5000, 2, 10, 18, 50, 750, 'Gravel por las huellas patagónicas del norte neuquino. Volcán Lanín y los lagos del Parque Nacional.'),
('Gravel Quebrada de los Colorados', 'cycling_gravel', 'Argentina', 'Jujuy', 180, 3500, 5, 18, 18, 35, 2000, 'Gravel por los coloridos cerros de la Quebrada de Humahuaca. Caminos de tierra en altiplano jujeño.'),
('Gravel Litoral Argentino', 'cycling_gravel', 'Argentina', 'Posadas', 160, 600, 6, 14, 20, 75, 150, 'Gravel por los caminos de tierra de Misiones. Selva paranaense entre las Cataratas del Iguazú.'),
('Grava de los Lagos Chile', 'cycling_gravel', 'Chile', 'Osorno', 220, 4500, 3, 14, 14, 70, 50, 'Gravel por los caminos rurales del sur de Chile. Lagos, volcanes y araucarias en la Región de Los Lagos.'),
('Gravel Aysén Expedition', 'cycling_gravel', 'Chile', 'Coyhaique', 350, 7000, 2, 7, 14, 65, 300, 'Gravel expedition por los caminos de ripio de Aysén. Los paisajes más remotos de la Patagonia chilena.'),
('Gravel Cajón del Aconcagua', 'cycling_gravel', 'Chile', 'Los Andes', 180, 4000, 11, 14, 20, 45, 800, 'Gravel por el Cajón del Aconcagua en el lado chileno. Viñedos del Aconcagua y la Ruta 60.'),
('Gravel Norte Chico Elqui', 'cycling_gravel', 'Chile', 'La Serena', 200, 3500, 9, 27, 16, 30, 300, 'Gravel por los valles pisqueros del Norte Chico. Astrónomos y mineros en caminos de tierra.'),
('Gravel Eje Cafetero Colombia', 'cycling_gravel', 'Colombia', 'Pereira', 240, 7000, 9, 12, 20, 75, 1400, 'Gravel épico por los caminos veredales del Eje Cafetero. Cafetales, platanales y miradores andinos.'),
('Gravel Sabana de Bogotá', 'cycling_gravel', 'Colombia', 'Bogotá', 180, 3500, 10, 18, 12, 70, 2600, 'Gravel por los caminos de la Sabana. Embalses de Chingaza y San Rafael en los cerros bogotanos.'),
('Gravel Altiplano Mexicano', 'cycling_gravel', 'México', 'Zacatecas', 220, 3500, 10, 10, 18, 40, 2400, 'Gravel por las minas y haciendas del altiplano mexicano. Caminos de tierra del Bajío y los Altos.'),
('Gravel Oaxaca Mixteca', 'cycling_gravel', 'México', 'Tlaxiaco', 200, 4500, 11, 16, 18, 50, 2300, 'Gravel en la Mixteca oaxaqueña. Comunidades indígenas, mercados y cañadas entre cerros olmecas.'),
('Gravel Caminos del Inca Perú', 'cycling_gravel', 'Perú', 'Huaraz', 250, 6000, 7, 5, 12, 45, 3000, 'Gravel por los caminos del Qhapaq Ñan en los Andes centrales peruanos. Red vial inca a 4000m.'),
('Gravel Misiones Verdes', 'cycling_gravel', 'Argentina', 'Iguazú', 180, 1500, 6, 21, 22, 80, 150, 'Gravel en la selva misionera entre las Cataratas del Iguazú y la frontera con Brasil y Paraguay.'),

-- ============================================================
-- MOUNTAIN BIKE — LATAM EXTRA
-- ============================================================
('Copa Argentina XCO MTB', 'cycling_mtb', 'Argentina', 'Mendoza', 30, 1200, 10, 12, 20, 35, 800, 'Circuito de cross country olímpico en los senderos serranos de Mendoza. Copa nacional de mountain bike.'),
('MTB Cuatro Refugios Bariloche', 'cycling_mtb', 'Argentina', 'Bariloche', 120, 5000, 2, 8, 16, 55, 765, 'Marathon MTB entre los cuatro refugios del Cerro Catedral. El MTB más técnico de la Patagonia.'),
('Enduro del Valle de Uco', 'cycling_mtb', 'Argentina', 'Tunuyán', 80, 3500, 11, 15, 20, 30, 1000, 'Enduro MTB en los faldeos del Valle de Uco mendocino. Singletrack técnico entre viñedos de altura.'),
('MTB del Noroeste Salta', 'cycling_mtb', 'Argentina', 'Salta', 100, 4000, 8, 21, 18, 40, 1187, 'MTB marathon por los cerros del NOA. Yungas, Valles Calchaquíes y paisajes multicolor.'),
('Ultra MTB Córdoba 200K', 'cycling_mtb', 'Argentina', 'Córdoba', 200, 6000, 9, 5, 18, 50, 700, 'Ultra marathon MTB de 200km por las sierras cordobesas en una sola jornada. Circuito épico.'),
('MTB Tierra del Fuego 100K', 'cycling_mtb', 'Argentina', 'Ushuaia', 100, 3500, 1, 12, 10, 70, 30, 'MTB marathon en el Parque Nacional Tierra del Fuego. El MTB más austral del planeta.'),
('Copa de MTB Andes Chilenos', 'cycling_mtb', 'Chile', 'Santiago', 40, 2000, 4, 19, 16, 55, 700, 'Competencia XCO en los cerros de Las Condes y Vitacura. Singletrack técnico a metros del skyline santiaguino.'),
('Enduro Valle Nevado Chile', 'cycling_mtb', 'Chile', 'Las Condes', 50, 4000, 4, 12, 10, 40, 2800, 'Enduro en el centro de esquí del Valle Nevado a 3000m. Descensos extremos en terreno esquiable.'),
('MTB Carretera Austral Stage Race', 'cycling_mtb', 'Chile', 'Coyhaique', 400, 12000, 2, 18, 14, 65, 300, 'Stage race de 5 días en la Carretera Austral chilena. El MTB de stage race más remoto de Sudamérica.'),
('Copa MTB Colombia XCM', 'cycling_mtb', 'Colombia', 'Bogotá', 60, 3500, 10, 10, 14, 70, 2600, 'Maratón de MTB por los cerros bogotanos. Páramo y reserva de Los Cerros Orientales.'),
('MTB Eje Cafetero Colombia', 'cycling_mtb', 'Colombia', 'Armenia', 80, 4500, 8, 24, 20, 75, 1540, 'Marathon MTB por fincas, cañadas y montañas del Eje Cafetero colombiano.'),
('MTB Desafío Cumbres México', 'cycling_mtb', 'México', 'Monterrey', 80, 4000, 11, 18, 20, 50, 600, 'MTB marathon por la Sierra Madre Oriental en Nuevo León. Cumbres de Monterrey y La Huasteca.'),
('MTB Ruta Maya Yucatán', 'cycling_mtb', 'México', 'Mérida', 100, 800, 1, 20, 26, 70, 8, 'MTB por los caminos entre cenotes y ruinas mayas de Yucatán. Cultura maya y selva de la peninsula.'),
('MTB La Leyenda Perú', 'cycling_mtb', 'Perú', 'Huancayo', 100, 5000, 7, 14, 14, 50, 3270, 'MTB marathon en los Andes centrales peruanos. Valles del Mantaro y mesetas a 4000m de altitud.'),
('MTB Costa Verde Lima', 'cycling_mtb', 'Perú', 'Lima', 50, 1000, 7, 19, 16, 80, 154, 'MTB por los acantilados de la Costa Verde limeña. Playas del Pacífico y el skyline de Miraflores.'),
('MTB Pantanal Brasil', 'cycling_mtb', 'Brasil', 'Bonito', 80, 1200, 7, 15, 24, 60, 300, 'MTB por las estradas do Pantanal mato-grossense. El mayor humedal tropical del mundo en bici.'),
('MTB Serra da Canastra', 'cycling_mtb', 'Brasil', 'Delfinópolis', 100, 3500, 7, 5, 16, 60, 1200, 'MTB por el Parque Nacional Serra da Canastra. Nascente do Rio São Francisco y canion da fumaça.'),
('MTB Estrada Real Minas', 'cycling_mtb', 'Brasil', 'Ouro Preto', 120, 4000, 7, 12, 18, 65, 1200, 'MTB por el camino histórico de la Estrada Real colonial de Minas Gerais. Oro y diamantes barrocos.');
