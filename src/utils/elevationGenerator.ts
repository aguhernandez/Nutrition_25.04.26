import type { ElevationPoint, HydrationStation, RaceCatalogEntry } from '../types/race';

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateElevationProfile(
  distanceKm: number,
  totalElevationGainM: number,
  seed = 42
): ElevationPoint[] {
  const rand = seededRandom(seed);
  const points = Math.min(200, Math.max(40, Math.round(distanceKm * 2)));
  const step = distanceKm / (points - 1);

  const raw: number[] = [0];
  let accumulated = 0;

  for (let i = 1; i < points; i++) {
    const progress = i / (points - 1);
    const targetAccum = totalElevationGainM * progress;
    const noise = (rand() - 0.4) * (totalElevationGainM / points) * 3;
    const delta = (targetAccum - accumulated) / (points - i) + noise;
    accumulated += Math.max(-80, Math.min(150, delta));
    raw.push(raw[i - 1] + (delta > 0 ? delta : delta * 0.3));
  }

  const minVal = Math.min(...raw);
  const normalized = raw.map((v) => v - minVal);

  return normalized.map((elev, i) => ({
    km: Math.round(i * step * 100) / 100,
    elevationM: Math.round(elev),
  }));
}

export function generateHydrationStations(
  distanceKm: number,
  elevationPoints: ElevationPoint[],
  catalogEntry?: RaceCatalogEntry
): HydrationStation[] {
  const stations: HydrationStation[] = [];

  if (catalogEntry) {
    const known = getKnownHydrationStations(catalogEntry.name, distanceKm);
    if (known.length > 0) return known;
  }

  const intervalKm = distanceKm <= 10 ? 3 : distanceKm <= 21.1 ? 4 : distanceKm <= 42.2 ? 5 : distanceKm <= 100 ? 10 : 15;

  let km = intervalKm;
  let idx = 0;
  while (km < distanceKm - 1) {
    const nearestPoint = elevationPoints.reduce((best, p) =>
      Math.abs(p.km - km) < Math.abs(best.km - km) ? p : best
    , elevationPoints[0]);

    const isAfterClimb = nearestPoint && elevationPoints[Math.max(0, elevationPoints.findIndex(p => p.km >= nearestPoint.km) - 5)]
      ? (nearestPoint.elevationM - elevationPoints[Math.max(0, elevationPoints.findIndex(p => p.km >= nearestPoint.km) - 5)].elevationM) > 50
      : false;

    stations.push({
      id: `station-${idx}`,
      km: Math.round(km * 10) / 10,
      label: isAfterClimb ? `Aid ${idx + 1} (post-climb)` : `Aid ${idx + 1}`,
      hasFood: distanceKm > 21 ? idx % 2 === 0 : false,
    });
    idx++;
    km += intervalKm;
  }

  return stations;
}

function getKnownHydrationStations(raceName: string, distanceKm: number): HydrationStation[] {
  const name = raceName.toLowerCase();

  if (name.includes('boston marathon')) {
    return [
      { id: 's1', km: 5, label: 'Aid 1 – Framingham', hasFood: false },
      { id: 's2', km: 10, label: 'Aid 2 – Natick', hasFood: false },
      { id: 's3', km: 15, label: 'Aid 3 – Wellesley', hasFood: false },
      { id: 's4', km: 20, label: 'Aid 4 – Newton Lower Falls', hasFood: true },
      { id: 's5', km: 25, label: 'Aid 5 – Newton Hills', hasFood: false },
      { id: 's6', km: 30, label: 'Aid 6 – Heartbreak Hill', hasFood: true },
      { id: 's7', km: 35, label: 'Aid 7 – Brookline', hasFood: false },
      { id: 's8', km: 40, label: 'Aid 8 – Kenmore', hasFood: false },
    ];
  }

  if (name.includes('berlin marathon')) {
    return [
      { id: 's1', km: 5, label: 'Aid 1 – Mitte', hasFood: false },
      { id: 's2', km: 10, label: 'Aid 2 – Kreuzberg', hasFood: false },
      { id: 's3', km: 15, label: 'Aid 3 – Neukölln', hasFood: false },
      { id: 's4', km: 20, label: 'Aid 4 – Tempelhof', hasFood: true },
      { id: 's5', km: 25, label: 'Aid 5 – Schöneberg', hasFood: false },
      { id: 's6', km: 30, label: 'Aid 6 – Charlottenburg', hasFood: true },
      { id: 's7', km: 35, label: 'Aid 7 – Tiergarten', hasFood: false },
      { id: 's8', km: 40, label: 'Aid 8 – Mitte finish', hasFood: false },
    ];
  }

  if (name.includes('utmb') || name.includes('ultra-trail')) {
    return [
      { id: 's1', km: 8, label: 'Les Houches', hasFood: true },
      { id: 's2', km: 22, label: 'Saint-Gervais', hasFood: true },
      { id: 's3', km: 32, label: 'Les Contamines', hasFood: true },
      { id: 's4', km: 49, label: 'La Balme', hasFood: true },
      { id: 's5', km: 66, label: 'Courmayeur (major)', hasFood: true },
      { id: 's6', km: 80, label: 'Arnuva', hasFood: true },
      { id: 's7', km: 91, label: 'La Fouly', hasFood: true },
      { id: 's8', km: 102, label: 'Champex-Lac', hasFood: true },
      { id: 's9', km: 119, label: 'Vallorcine', hasFood: true },
      { id: 's10', km: 140, label: 'La Flégère', hasFood: true },
      { id: 's11', km: 154, label: 'Chamonix finish', hasFood: true },
    ];
  }

  if (name.includes('ironman') || name.includes('iron man')) {
    return [
      { id: 's1', km: 20, label: 'Aid 1 – Bike 20km', hasFood: true },
      { id: 's2', km: 40, label: 'Aid 2 – Bike 40km', hasFood: true },
      { id: 's3', km: 60, label: 'Aid 3 – Bike 60km', hasFood: true },
      { id: 's4', km: 80, label: 'Aid 4 – Bike 80km', hasFood: true },
      { id: 's5', km: 100, label: 'Aid 5 – Bike 100km', hasFood: true },
      { id: 's6', km: 120, label: 'Aid 6 – Bike 120km', hasFood: true },
      { id: 's7', km: 140, label: 'Aid 7 – Bike 140km', hasFood: true },
      { id: 's8', km: 160, label: 'Aid 8 – T2', hasFood: true },
      { id: 's9', km: 168, label: 'Aid 9 – Run 8km', hasFood: true },
      { id: 's10', km: 175, label: 'Aid 10 – Run 15km', hasFood: true },
      { id: 's11', km: 183, label: 'Aid 11 – Run 23km', hasFood: true },
      { id: 's12', km: 190, label: 'Aid 12 – Run 30km', hasFood: true },
      { id: 's13', km: 197, label: 'Aid 13 – Run 37km', hasFood: true },
    ];
  }

  if (name.includes('western states')) {
    return [
      { id: 's1', km: 8, label: 'Lyon Ridge', hasFood: false },
      { id: 's2', km: 19, label: 'Red Star Ridge', hasFood: true },
      { id: 's3', km: 30, label: 'Duncan Canyon', hasFood: true },
      { id: 's4', km: 38, label: 'Robinson Flat', hasFood: true },
      { id: 's5', km: 51, label: 'Last Chance', hasFood: false },
      { id: 's6', km: 61, label: 'Devil\'s Thumb', hasFood: true },
      { id: 's7', km: 72, label: 'Michigan Bluff', hasFood: true },
      { id: 's8', km: 84, label: 'Foresthill', hasFood: true },
      { id: 's9', km: 97, label: 'Rucky Chucky', hasFood: true },
      { id: 's10', km: 107, label: 'Green Gate', hasFood: true },
      { id: 's11', km: 117, label: 'Auburn Lake Trails', hasFood: true },
      { id: 's12', km: 124, label: 'Pointed Rocks', hasFood: false },
      { id: 's13', km: 130, label: 'Auburn Finish', hasFood: true },
    ];
  }

  return [];
}
