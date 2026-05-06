/*
  # LATAM Races Extended Batch 2 — Road Running Brasil, Chile, Colombia, México, Perú, resto
*/

INSERT INTO races_catalog (name, sport, country, city, distance_km, elevation_gain_m, typical_month, typical_day, avg_temperature_c, avg_humidity_pct, altitude_m, description) VALUES
-- BRASIL ROAD RUNNING EXTRA
('Maratona de Florianópolis', 'running', 'Brasil', 'Florianópolis', 42.2, 400, 7, 14, 18, 75, 5, 'Maratona na ilha da magia. Circuito pelas lagoas e pontes com vistas para o Atlântico sul.'),
('Maratona de Curitiba', 'running', 'Brasil', 'Curitiba', 42.2, 200, 9, 22, 18, 70, 934, 'Maratona na capital paranaense, referência em planejamento urbano e parques. Clima fresco de outono.'),
('Maratona de Recife', 'running', 'Brasil', 'Recife', 42.2, 50, 8, 6, 28, 80, 10, 'Maratona na Veneza brasileira. Pontes históricas, mangues e litoral pernambucano.'),
('Maratona de Salvador', 'running', 'Brasil', 'Salvador', 42.2, 300, 7, 21, 26, 80, 50, 'Maratona na capital da Bahia com a orla de Ondina e Rio Vermelho como cenário.'),
('Maratona de Fortaleza', 'running', 'Brasil', 'Fortaleza', 42.2, 60, 8, 11, 30, 75, 10, 'Maratona na capital cearense com brisa marítima e orla da Praia de Iracema e Meireles.'),
('Maratona de Belo Horizonte', 'running', 'Brasil', 'Belo Horizonte', 42.2, 400, 7, 7, 20, 65, 852, 'Maratona da capital mineira. Circuito pela Avenida Afonso Pena e Parque Municipal.'),
('Maratona de Manaus', 'running', 'Brasil', 'Manaus', 42.2, 100, 9, 29, 32, 90, 92, 'Maratona no coração da Amazônia. Calor e umidade extremos na capital do Amazonas.'),
('Maratona de Belém', 'running', 'Brasil', 'Belém', 42.2, 30, 10, 12, 30, 85, 15, 'Maratona na cidade do Ver-o-Peso. Amazônia paraense, barcos e mercados ribeirinhos como cenário.'),
('Meia Maratona de Curitiba', 'running', 'Brasil', 'Curitiba', 21.1, 150, 5, 19, 16, 70, 934, 'Meia maratona primaveril pelos parques e biarticulados de Curitiba.'),
('Meia Maratona de Florianópolis', 'running', 'Brasil', 'Florianópolis', 21.1, 250, 5, 18, 20, 70, 5, 'Meia maratona pela ilha da magia, passando pelas praias mais famosas de Santa Catarina.'),
('10K de São Paulo - Adidas', 'running', 'Brasil', 'São Paulo', 10, 80, 4, 6, 22, 65, 760, 'A corrida de 10K mais famosa do Brasil. Avenida Paulista e Parque Trianon como palco.'),
('Volta da Pampulha', 'running', 'Brasil', 'Belo Horizonte', 18, 200, 5, 26, 20, 65, 852, 'Clássico circuito ao redor da Lagoa da Pampulha, obra de Oscar Niemeyer. A corrida mais tradicional de BH.'),
('Corrida de São Silvestre', 'running', 'Brasil', 'São Paulo', 15, 150, 12, 31, 26, 70, 760, 'A corrida de rua mais famosa e tradicional do Brasil e da América Latina, realizada na virada do ano.'),
('Maratona do Cristo Redentor Rio', 'running', 'Brasil', 'Rio de Janeiro', 21.1, 400, 6, 15, 22, 75, 10, 'Meia maratona pelo Corcovado, Santa Teresa e Lapa. Cristo Redentor no horizonte durante todo o percurso.'),
-- CHILE ROAD RUNNING EXTRA
('Maratón de Concepción', 'running', 'Chile', 'Concepción', 42.2, 200, 4, 21, 14, 75, 15, 'Maratón en la capital de la Región del Biobío. Recorre el centro penquista y la costanera del Biobío.'),
('Maratón de Viña del Mar', 'running', 'Chile', 'Viña del Mar', 42.2, 300, 5, 11, 14, 80, 5, 'Maratón en la ciudad jardín de Chile. Costanera del Pacífico y el anfiteatro de la ciudad.'),
('Maratón de Puerto Montt', 'running', 'Chile', 'Puerto Montt', 42.2, 400, 4, 28, 12, 80, 50, 'Maratón en la puerta de la Patagonia. Volcán Osorno y el Seno de Reloncaví de fondo.'),
('Maratón de La Serena', 'running', 'Chile', 'La Serena', 42.2, 100, 5, 18, 14, 65, 30, 'Maratón en el Valle del Elqui. Cielos estrellados y piscos del norte chico chileno.'),
('Maratón del Desierto de Atacama', 'running', 'Chile', 'Copiapó', 42.2, 600, 8, 16, 16, 20, 400, 'Maratón en el desierto florido. Florecimiento del desierto de Atacama como telón de fondo.'),
('Media Maratón Valparaíso', 'running', 'Chile', 'Valparaíso', 21.1, 500, 5, 4, 14, 75, 30, 'Media maratón por los cerros y el plan de Valparaíso Patrimonio UNESCO.'),
-- COLOMBIA ROAD RUNNING EXTRA
('Maratón de Barranquilla', 'running', 'Colombia', 'Barranquilla', 42.2, 80, 11, 8, 30, 80, 15, 'Maratón en la puerta de Colombia al mundo. Caribe colombiano con todo el colorido barranquillero.'),
('Maratón Internacional de Pereira', 'running', 'Colombia', 'Pereira', 42.2, 400, 7, 19, 22, 75, 1410, 'Maratón en la perla del Otún, corazón del Eje Cafetero. Montañas verdes y clima primaveral.'),
('Media Maratón de Cartagena', 'running', 'Colombia', 'Cartagena', 21.1, 50, 1, 12, 30, 80, 5, 'Media maratón en la Ciudad Amurallada. Casco histórico colonial patrimonio UNESCO y playa caribeña.'),
('Maratón de Manizales', 'running', 'Colombia', 'Manizales', 42.2, 600, 9, 14, 18, 75, 2153, 'Maratón en el balcón del mundo caldense. Faldas del Nevado del Ruiz y panorámica cafetera.'),
('Maratón de Bucaramanga', 'running', 'Colombia', 'Bucaramanga', 42.2, 400, 10, 10, 24, 65, 959, 'Maratón en la ciudad bonita. Meseta de Bucaramanga y el cañón del Chicamocha al fondo.'),
('10K Bogotá a Cielo Abierto', 'running', 'Colombia', 'Bogotá', 10, 150, 3, 22, 14, 70, 2600, 'Carrera urbana masiva por la Carrera Séptima cerrada al tráfico. Ciclovía corrida en Bogotá.'),
-- MÉXICO ROAD RUNNING EXTRA
('Maratón de Puebla', 'running', 'México', 'Puebla', 42.2, 300, 11, 17, 18, 55, 2135, 'Maratón en la ciudad de los ángeles. Volcanes Popocatépetl e Iztaccíhuatl de telón de fondo.'),
('Maratón de Cancún', 'running', 'México', 'Cancún', 42.2, 20, 11, 24, 28, 75, 5, 'Maratón en el paraíso del Caribe mexicano. Zona Hotelera con el Mar Caribe turquesa como paisaje.'),
('Maratón de Mérida', 'running', 'México', 'Mérida', 42.2, 30, 1, 26, 26, 70, 8, 'Maratón en la ciudad blanca de Yucatán. Paseo Montejo y haciendas henequeneras del trópico maya.'),
('Media Maratón de Querétaro', 'running', 'México', 'Querétaro', 21.1, 200, 10, 25, 20, 50, 1820, 'Media maratón en la joya colonial del Bajío. Acueducto histórico y calles empedradas de Querétaro.'),
('Maratón de Tijuana', 'running', 'México', 'Tijuana', 42.2, 400, 11, 3, 18, 65, 30, 'Maratón en la frontera norte de México. Ciudad cosmopolita con gastronomía y cultura fronteriza.'),
('Maratón de Acapulco', 'running', 'México', 'Acapulco', 42.2, 200, 2, 16, 30, 80, 10, 'Maratón en el puerto guerrerense. Bahía de Acapulco y La Quebrada como escenario icónico.'),
('Maratón de San Luis Potosí', 'running', 'México', 'San Luis Potosí', 42.2, 200, 10, 18, 18, 50, 1847, 'Maratón en la ciudad potosina. Centro histórico Patrimonio UNESCO y calles coloniales del altiplano.'),
-- PERÚ EXTRA
('Maratón de Cusco', 'running', 'Perú', 'Cusco', 42.2, 600, 6, 28, 14, 55, 3400, 'Maratón en el ombligo del mundo inca. Altiplano andino, ruinas y mercados de la capital arqueológica.'),
('Maratón de Arequipa', 'running', 'Perú', 'Arequipa', 42.2, 400, 8, 11, 16, 40, 2335, 'Maratón en la ciudad blanca del sur peruano. El volcán Misti vigila el recorrido por el centro sillar.'),
('Media Maratón Miraflores Lima', 'running', 'Perú', 'Lima', 21.1, 150, 5, 14, 18, 85, 154, 'Media maratón por los acantilados de Miraflores y el Circuito Mágico del Agua. Lima sobre el Pacífico.'),
-- OTROS PAÍSES
('Maratón de Asunción', 'running', 'Paraguay', 'Asunción', 42.2, 60, 9, 8, 22, 70, 100, 'Maratón en la madre de ciudades. Bahía de Asunción y el casco histórico paraguayo.'),
('Maratón de Guayaquil', 'running', 'Ecuador', 'Guayaquil', 42.2, 100, 10, 19, 28, 80, 5, 'Maratón en el puerto principal de Ecuador. Malecón 2000 y el cerro Santa Ana como paisaje urbano.'),
('Media Maratón de Quito', 'running', 'Ecuador', 'Quito', 21.1, 300, 7, 6, 14, 65, 2850, 'Media maratón en la capital del mundo a casi 3000m. Centro histórico Patrimonio UNESCO de Quito.'),
('Maratón de Caracas', 'running', 'Venezuela', 'Caracas', 42.2, 400, 10, 15, 22, 70, 900, 'Maratón en la capital venezolana. Parque Los Próceres y Avenida Bolívar en el Valle de Caracas.'),
('Maratón de La Paz', 'running', 'Bolivia', 'La Paz', 42.2, 600, 8, 19, 10, 55, 3600, 'La maratón de capital más alta del mundo. El Illimani nevado observa cada kilómetro del recorrido paceño.'),
('Maratón de Cochabamba', 'running', 'Bolivia', 'Cochabamba', 42.2, 300, 9, 21, 18, 50, 2570, 'Maratón en el jardín de Bolivia. Ciudad de la eterna primavera con clima inmejorable todo el año.');
