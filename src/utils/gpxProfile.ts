import type { ElevationPoint } from '../types/race';

const EARTH_RADIUS_M = 6371000;
const MAX_PROFILE_POINTS = 1000;

function haversineM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function parseGpxProfile(xml: string): ElevationPoint[] {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  let pts = Array.from(doc.getElementsByTagName('trkpt'));
  if (pts.length < 2) pts = Array.from(doc.getElementsByTagName('rtept'));
  if (pts.length < 2) return [];

  let lastEle = 0;
  const samples = pts.map((pt) => {
    const eleText = pt.getElementsByTagName('ele')[0]?.textContent;
    const parsed = eleText === undefined ? NaN : parseFloat(eleText);
    if (!Number.isNaN(parsed)) lastEle = parsed;
    return {
      lat: parseFloat(pt.getAttribute('lat') ?? 'NaN'),
      lon: parseFloat(pt.getAttribute('lon') ?? 'NaN'),
      ele: lastEle,
    };
  }).filter((s) => !Number.isNaN(s.lat) && !Number.isNaN(s.lon));

  if (samples.length < 2) return [];

  const cumulativeKm: number[] = [0];
  for (let i = 1; i < samples.length; i++) {
    const prev = samples[i - 1];
    const cur = samples[i];
    cumulativeKm.push(cumulativeKm[i - 1] + haversineM(prev.lat, prev.lon, cur.lat, cur.lon) / 1000);
  }

  const step = Math.max(1, Math.ceil(samples.length / MAX_PROFILE_POINTS));
  const result: ElevationPoint[] = [];
  for (let i = 0; i < samples.length; i += step) {
    result.push({
      km: Math.round(cumulativeKm[i] * 100) / 100,
      elevationM: Math.round(samples[i].ele),
    });
  }
  const lastIdx = samples.length - 1;
  if (result[result.length - 1].km !== Math.round(cumulativeKm[lastIdx] * 100) / 100) {
    result.push({
      km: Math.round(cumulativeKm[lastIdx] * 100) / 100,
      elevationM: Math.round(samples[lastIdx].ele),
    });
  }
  return result;
}
