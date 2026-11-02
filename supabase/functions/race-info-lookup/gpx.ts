export interface ElevationSample {
  km: number;
  elevationM: number;
}

export interface GpxTrackSummary {
  distanceKm: number;
  elevationGainM: number;
  profile: ElevationSample[];
}

interface TrackPoint {
  lat: number;
  lon: number;
  ele: number | null;
}

const MAX_POINTS = 200000;
const PROFILE_SAMPLES = 400;
const SMOOTHING_WINDOW = 5;
const EARTH_RADIUS_M = 6371000;

function readAttribute(attrs: string, name: string): number | null {
  const match = new RegExp(`\\b${name}="(-?[\\d.]+)"`).exec(attrs);
  return match ? Number(match[1]) : null;
}

function collectPoints(xml: string, tag: "trkpt" | "rtept"): TrackPoint[] {
  const points: TrackPoint[] = [];
  const pattern = new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)</${tag}>`, "g");
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(xml)) !== null) {
    const lat = readAttribute(match[1], "lat");
    const lon = readAttribute(match[1], "lon");
    if (lat === null || lon === null) continue;
    const eleMatch = /<ele>\s*(-?[\d.]+)\s*<\/ele>/.exec(match[2]);
    points.push({ lat, lon, ele: eleMatch ? Number(eleMatch[1]) : null });
    if (points.length >= MAX_POINTS) break;
  }
  return points;
}

function haversineM(a: TrackPoint, b: TrackPoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

function fillMissingElevation(points: TrackPoint[]): number[] | null {
  const values = points.map((p) => p.ele);
  const firstKnown = values.find((v) => v !== null);
  if (firstKnown === undefined || firstKnown === null) return null;
  let last = firstKnown;
  return values.map((v) => {
    if (v !== null) last = v;
    return last;
  });
}

function smooth(values: number[], window: number): number[] {
  const half = Math.floor(window / 2);
  return values.map((_, i) => {
    const from = Math.max(0, i - half);
    const to = Math.min(values.length - 1, i + half);
    let sum = 0;
    for (let j = from; j <= to; j++) sum += values[j];
    return sum / (to - from + 1);
  });
}

export function parseGpxTrack(xml: string): GpxTrackSummary | null {
  let points = collectPoints(xml, "trkpt");
  if (points.length < 2) points = collectPoints(xml, "rtept");
  if (points.length < 2) return null;

  const rawElevation = fillMissingElevation(points);
  if (!rawElevation) return null;
  const elevation = smooth(rawElevation, SMOOTHING_WINDOW);

  const cumulativeM: number[] = [0];
  let gainM = 0;
  for (let i = 1; i < points.length; i++) {
    cumulativeM.push(cumulativeM[i - 1] + haversineM(points[i - 1], points[i]));
    const diff = elevation[i] - elevation[i - 1];
    if (diff > 0) gainM += diff;
  }

  const totalM = cumulativeM[cumulativeM.length - 1];
  if (totalM <= 0) return null;

  const step = Math.max(1, Math.floor(points.length / PROFILE_SAMPLES));
  const profile: ElevationSample[] = [];
  for (let i = 0; i < points.length; i += step) {
    profile.push({
      km: Math.round((cumulativeM[i] / 1000) * 100) / 100,
      elevationM: Math.round(elevation[i] * 10) / 10,
    });
  }
  const last = points.length - 1;
  if (profile[profile.length - 1].km !== Math.round((totalM / 1000) * 100) / 100) {
    profile.push({
      km: Math.round((cumulativeM[last] / 1000) * 100) / 100,
      elevationM: Math.round(elevation[last] * 10) / 10,
    });
  }

  return {
    distanceKm: Math.round((totalM / 1000) * 100) / 100,
    elevationGainM: Math.round(gainM),
    profile,
  };
}
