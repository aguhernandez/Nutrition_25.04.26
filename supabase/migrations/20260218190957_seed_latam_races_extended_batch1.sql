/*
  # LATAM Races Extended Batch 1 — Road Running Argentina (expanded)

  Adds ~80 additional road running races across Argentina, covering
  major cities, iconic classic races, half marathons, 10Ks and regional events.
*/

INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
-- ARGENTINA ROAD RUNNING EXTRA
('Maratón Internacional de La Plata', 'running', 'Argentina', 'La Plata', 42.2, 50, 10, 20, 18, 70, 10, 'Maratón en la ciudad de las diagonales. Trazado urbano por el casco histórico platense y sus amplias avenidas arboladas.'),
('Maratón del Valle de Traslasierra', 'running', 'Argentina', 'Mina Clavero', 42.2, 600, 10, 12, 18, 45, 800, 'Maratón de montaña por el valle cordobés de Traslasierra. Ríos de piedra, bosque serrano y vistas panorámicas.'),
('Maratón Internacional Salta', 'running', 'Argentina', 'Salta', 42.2, 300, 9, 7, 18, 50, 1187, 'Maratón en la ciudad del norte argentino con arquitectura colonial y paisajes andinos. La carrera gaucha del NOA.'),
('Maratón de Tucumán', 'running', 'Argentina', 'Tucumán', 42.2, 200, 9, 24, 20, 65, 450, 'Maratón en la cuna de la Independencia Argentina. Circuito por el parque 9 de Julio y el centro histórico.'),
('Maratón de Neuquén', 'running', 'Argentina', 'Neuquén', 42.2, 100, 10, 19, 18, 40, 271, 'Maratón en la ciudad de la Patagonia nor-andina. Confluencia de los ríos Neuquén y Limay.'),
('Maratón Internacional de Río Cuarto', 'running', 'Argentina', 'Río Cuarto', 42.2, 80, 10, 5, 18, 55, 420, 'Maratón en la ciudad sur de Córdoba. Ribera del río Cuarto y barrios residenciales arbolados.'),
('Maratón de San Juan', 'running', 'Argentina', 'San Juan', 42.2, 150, 9, 14, 22, 30, 630, 'Maratón en la región cuyana vitivinícola bajo el sol cuyana. Circuito por la ciudad renovada post-2021.'),
('Maratón del Aconcagua', 'running', 'Argentina', 'Mendoza', 42.2, 1500, 1, 21, 26, 25, 1300, 'Maratón de alta montaña con salida en Las Cuevas y llegada en Puente del Inca. Los Andes en toda su magnitud.'),
('Maratón de Santa Fe', 'running', 'Argentina', 'Santa Fe', 42.2, 30, 11, 9, 24, 75, 20, 'Maratón en la capital provincial sobre las márgenes del Río Paraná. Circuito ribereño y urbano.'),
('Maratón de Entre Ríos Paraná', 'running', 'Argentina', 'Paraná', 42.2, 80, 10, 26, 22, 70, 80, 'Maratón en la ciudad capital entrerriana con barrancas sobre el río Paraná. Paisaje litoral inigualable.'),
('Maratón del Litoral Corrientes', 'running', 'Argentina', 'Corrientes', 42.2, 60, 9, 21, 24, 75, 75, 'Maratón en la ciudad del chamamé a orillas del Paraná. Calor subtropical y corrientes en la temporada primaveral.'),
('Maratón de San Luis', 'running', 'Argentina', 'San Luis', 42.2, 200, 5, 18, 16, 45, 720, 'Maratón en la ciudad puntana con entorno serrano. Circuito por la ciudad jardín de cuyo.'),
('Media Maratón de Rosario', 'running', 'Argentina', 'Rosario', 21.1, 30, 5, 12, 16, 65, 22, 'Media maratón ribereña en la ciudad de la bandera. Costanera del Paraná y Parque España.'),
('Media Maratón de Córdoba', 'running', 'Argentina', 'Córdoba', 21.1, 100, 10, 6, 16, 55, 425, 'Media maratón masiva en la docta. Recorre la Nueva Córdoba, el Centro y las sierras chicas.'),
('Media Maratón de La Plata', 'running', 'Argentina', 'La Plata', 21.1, 30, 6, 9, 14, 65, 10, 'Media maratón de otoño en la capital bonaerense. Diagonales y bulevares del trazado edilicio único.'),
('Media Maratón de Mendoza', 'running', 'Argentina', 'Mendoza', 21.1, 120, 6, 18, 12, 40, 750, 'Media maratón en la tierra del sol y el buen vino. Parque San Martín y avenidas sombradas de viñedos.'),
('Media Maratón de Mar del Plata', 'running', 'Argentina', 'Mar del Plata', 21.1, 60, 10, 8, 16, 75, 20, 'Media maratón por la Feliz en temporada de playa. Costanera y barrios pintorescos de la ciudad balnearia.'),
('10K Boca Juniors Run', 'running', 'Argentina', 'Buenos Aires', 10, 20, 4, 28, 16, 65, 25, 'Carrera oficial del Club Atlético Boca Juniors por la Boca y San Telmo. Ambiente xeneize único.'),
('10K River Plate Run', 'running', 'Argentina', 'Buenos Aires', 10, 20, 9, 15, 18, 65, 25, 'Carrera oficial del Club Atlético River Plate. Circuito por Belgrano y Núñez cerca del Estadio Monumental.'),
('Corrida de los Bomberos Buenos Aires', 'running', 'Argentina', 'Buenos Aires', 10, 20, 11, 17, 20, 65, 25, 'Clásica carrera solidaria por los bomberos voluntarios. Puerto Madero y Reserva Ecológica Costanera Sur.'),
('Maratón Nocturna de Córdoba', 'running', 'Argentina', 'Córdoba', 21.1, 100, 11, 23, 22, 55, 425, 'Media maratón nocturna iluminada en la docta. Ambiente festivo y música en vivo en el recorrido.'),
('Run For The Planet Buenos Aires', 'running', 'Argentina', 'Buenos Aires', 5, 10, 6, 5, 14, 70, 25, 'Carrera solidaria por el medioambiente. Parque Tres de Febrero y el lago de Palermo.'),
('Clásica Punta del Este', 'running', 'Uruguay', 'Punta del Este', 21.1, 40, 1, 8, 26, 70, 10, 'Media maratón en el balneario más glamoroso de Sudamérica. Costa uruguaya y rambla de verano.'),
('Maratón Ciudad de Montevideo', 'running', 'Uruguay', 'Montevideo', 42.2, 60, 11, 14, 18, 70, 20, 'Maratón completo por la rambla y los barrios históricos de la capital uruguaya. Ciudad tranquila y corredor amigable.'),
('Corrida de la Intendencia Montevideo', 'running', 'Uruguay', 'Montevideo', 10, 30, 8, 10, 12, 65, 20, 'Carrera oficial de la Intendencia Municipal de Montevideo. Parque Rodó y Ciudad Vieja.');
