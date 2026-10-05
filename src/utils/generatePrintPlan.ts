import type { Competition, StrategyOutput, DayMeal, RiskFlag, CaffeineDose, ElevationPoint } from '../types/race';
import type { EditablePlan, EditableSegment, RaceExecutionItem } from '../types/editablePlan';
import { getSportConfig } from '../config/sports';
import { generateElevationProfile, generateHydrationStations } from './elevationGenerator';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  yellow:   '#fdda36',
  purple:   '#4a3b6b',
  purpleD:  '#2e2442',
  dark:     '#1a1622',
  white:    '#ffffff',
  offWhite: '#f8f7fc',
  border:   '#e8e4f0',
  muted:    '#9992aa',
  text:     '#1a1622',
  sub:      '#5a5270',
};

// ─── Fetch image as base64 data URI ──────────────────────────────────────────
async function toDataURI(src: string): Promise<string> {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return '';
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPace(minPerKm: number): string {
  const mins = Math.floor(minPerKm);
  const secs = Math.round((minPerKm - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDuration(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = Math.round(totalMin % 60);
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}

function getTimeInterval(durationMin: number): number {
  if (durationMin <= 90) return 20;
  if (durationMin <= 360) return 30;
  return 60;
}

// ─── Elevation SVG ────────────────────────────────────────────────────────────
function buildElevationSVG(
  pts: ElevationPoint[],
  distKm: number,
  totalGain: number,
  stations: { km: number; hasFood: boolean }[],
  width = 740,
  height = 130
): string {
  if (pts.length < 2) return '';

  const PAD = { top: 10, right: 10, bottom: 30, left: 48 };
  const PW = width - PAD.left - PAD.right;
  const PH = height - PAD.top - PAD.bottom;

  const minE = Math.min(...pts.map(p => p.elevationM));
  const maxE = Math.max(...pts.map(p => p.elevationM));
  const eRange = maxE - minE || 1;

  const tx = (km: number) => PAD.left + (km / distKm) * PW;
  const ty = (e: number) => PAD.top + PH - ((e - minE) / eRange) * PH;

  // Gradient segments for climbs
  const windowSize = Math.max(4, Math.floor(pts.length / 25));
  const gradSegs: { start: number; end: number; grade: number }[] = [];
  for (let i = 0; i < pts.length - windowSize; i += windowSize) {
    const a = pts[i], b = pts[Math.min(i + windowSize, pts.length - 1)];
    const distM = (b.km - a.km) * 1000;
    const grade = distM > 0 ? ((b.elevationM - a.elevationM) / distM) * 100 : 0;
    gradSegs.push({ start: a.km, end: b.km, grade });
  }

  const linePts = pts.map(p => `${tx(p.km).toFixed(1)},${ty(p.elevationM).toFixed(1)}`).join(' ');

  // Area fill path
  const first = pts[0], last = pts[pts.length - 1];
  const fillD = `M${tx(first.km).toFixed(1)},${ty(first.elevationM).toFixed(1)} `
    + pts.slice(1).map(p => `L${tx(p.km).toFixed(1)},${ty(p.elevationM).toFixed(1)}`).join(' ')
    + ` L${tx(last.km).toFixed(1)},${(PAD.top + PH).toFixed(1)} L${tx(first.km).toFixed(1)},${(PAD.top + PH).toFixed(1)} Z`;

  // Climb overlay paths
  const climbPaths = gradSegs.filter(s => s.grade >= 4).map(seg => {
    const segPts = pts.filter(p => p.km >= seg.start && p.km <= seg.end);
    if (segPts.length < 2) return '';
    const d = `M${tx(segPts[0].km).toFixed(1)},${ty(segPts[0].elevationM).toFixed(1)} `
      + segPts.slice(1).map(p => `L${tx(p.km).toFixed(1)},${ty(p.elevationM).toFixed(1)}`).join(' ')
      + ` L${tx(segPts[segPts.length-1].km).toFixed(1)},${(PAD.top+PH).toFixed(1)} L${tx(segPts[0].km).toFixed(1)},${(PAD.top+PH).toFixed(1)} Z`;
    return `<path d="${d}" fill="url(#climbG)" />`;
  }).join('');

  // X ticks
  const tickInterval = distKm <= 15 ? 5 : distKm <= 50 ? 10 : distKm <= 100 ? 20 : 50;
  const xTicks = Array.from({ length: Math.floor(distKm / tickInterval) + 1 }, (_, i) => i * tickInterval).filter(k => k <= distKm);

  // Y ticks
  const yStep = Math.ceil((eRange) / 4 / 100) * 100 || Math.ceil((eRange) / 4 / 50) * 50 || 50;
  const yTickVals: number[] = [];
  for (let v = Math.ceil(minE / yStep) * yStep; v <= maxE; v += yStep) yTickVals.push(v);

  // Station markers
  const stationMarkers = stations.map(s => {
    const near = pts.reduce((b, p) => Math.abs(p.km - s.km) < Math.abs(b.km - s.km) ? p : b, pts[0]);
    const x = tx(s.km);
    const y = ty(near.elevationM);
    const col = s.hasFood ? '#34d399' : C.yellow;
    return `
      <line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(PAD.top+PH).toFixed(1)}" stroke="${col}" stroke-width="0.8" stroke-dasharray="2,2" opacity="0.7"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${col}" stroke="white" stroke-width="1.2"/>`;
  }).join('');

  // Finish line
  const finX = tx(distKm);

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
  <defs>
    <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${C.purple}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${C.purple}" stop-opacity="0.03"/>
    </linearGradient>
    <linearGradient id="climbG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ef4444" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0.05"/>
    </linearGradient>
  </defs>

  <!-- Y grid + labels -->
  ${yTickVals.map(e => {
    const y = ty(e);
    return `<line x1="${PAD.left}" y1="${y.toFixed(1)}" x2="${PAD.left+PW}" y2="${y.toFixed(1)}" stroke="#e8e4f0" stroke-width="0.7"/>
    <text x="${(PAD.left-6).toFixed(1)}" y="${(y+3).toFixed(1)}" text-anchor="end" font-size="8" fill="${C.muted}" font-family="Jost,sans-serif">${Math.round(e)}m</text>`;
  }).join('')}

  <!-- X ticks -->
  ${xTicks.map(km => {
    const x = tx(km);
    return `<line x1="${x.toFixed(1)}" y1="${(PAD.top+PH).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(PAD.top+PH+4).toFixed(1)}" stroke="#ccc" stroke-width="0.7"/>
    <text x="${x.toFixed(1)}" y="${(PAD.top+PH+13).toFixed(1)}" text-anchor="middle" font-size="8" fill="${C.muted}" font-family="Jost,sans-serif">${km}km</text>`;
  }).join('')}

  <!-- Finish tick -->
  <line x1="${finX.toFixed(1)}" y1="${PAD.top}" x2="${finX.toFixed(1)}" y2="${(PAD.top+PH).toFixed(1)}" stroke="${C.purple}" stroke-width="1" stroke-dasharray="3,2" opacity="0.4"/>

  <!-- Area fill -->
  <path d="${fillD}" fill="url(#areaG)"/>

  <!-- Climb highlights -->
  ${climbPaths}

  <!-- Elevation line -->
  <polyline points="${linePts}" fill="none" stroke="${C.purple}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>

  <!-- Station markers -->
  ${stationMarkers}

  <!-- Gain label -->
  <text x="${(PAD.left+PW).toFixed(1)}" y="${(PAD.top+PH+28).toFixed(1)}" text-anchor="end" font-size="8" fill="${C.muted}" font-family="Jost,sans-serif">+${totalGain}m gain</text>
</svg>`;
}

// ─── Segment builder ──────────────────────────────────────────────────────────
export function buildSegments(competition: Competition, output: StrategyOutput): EditableSegment[] {
  const { raceData } = competition;
  const { carbs, hydration, caffeine } = output;
  const totalMin = raceData.expectedDurationMin;
  const distKm = raceData.distanceUnit === 'miles' ? raceData.distance * 1.60934 : raceData.distance;
  const interval = getTimeInterval(totalMin);
  const segments: EditableSegment[] = [];

  const choPerInterval = (carbs.recommendedIntakeGH / 60) * interval;
  const fluidPerInterval = (hydration.fluidIntakeLH * 1000 / 60) * interval;
  const sodiumPerInterval = (hydration.sodiumMgH / 60) * interval;

  const caffeineEvents: Map<number, string> = new Map();
  if (caffeine.totalMg > 0) {
    caffeine.midRaceDoses.forEach((dose: CaffeineDose) => {
      const key = Math.round(dose.timingMin / interval) * interval;
      caffeineEvents.set(key, `${dose.label}: ${dose.mg}mg`);
    });
  }

  for (let t = interval; t <= totalMin + interval / 2; t += interval) {
    const segEnd = Math.min(t, totalMin);
    const distReached = Math.round((segEnd / totalMin) * distKm * 10) / 10;
    const cafNote = caffeineEvents.get(t) || caffeineEvents.get(t - Math.floor(interval / 2)) || '';
    segments.push({ timeMin: segEnd, distanceKm: distReached, choG: Math.round(choPerInterval), fluidMl: Math.round(fluidPerInterval), sodiumMg: Math.round(sodiumPerInterval), caffeineNote: cafNote });
    if (segEnd >= totalMin) break;
  }
  return segments;
}

// ─── CSS shared ───────────────────────────────────────────────────────────────
function css(): string {
  return `
@import url('https://fonts.googleapis.com/css2?family=Krona+One&family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
@page { size: A4 portrait; margin: 0; }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Jost', -apple-system, sans-serif;
  color: ${C.text};
  background: #fff;
  font-size: 12px;
  line-height: 1.5;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.page { width: 210mm; min-height: 297mm; position: relative; }

/* ── Cover band ── */
.cover-band {
  background: ${C.dark};
  padding: 10mm 14mm 8mm;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.cover-race-name {
  font-family: 'Krona One', sans-serif;
  font-size: 26px;
  color: ${C.white};
  line-height: 1.05;
  letter-spacing: -0.01em;
  margin-top: 8px;
}
.cover-sub {
  font-family: 'Jost', sans-serif;
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  margin-top: 5px;
  font-weight: 400;
}
.cover-badge {
  background: ${C.yellow};
  color: ${C.purpleD};
  font-family: 'Krona One', sans-serif;
  font-size: 9px;
  letter-spacing: 0.12em;
  padding: 5px 12px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 8px;
}
.cover-date {
  font-size: 10px;
  color: rgba(255,255,255,0.35);
  text-align: right;
  margin-top: 5px;
}

/* ── Yellow accent strip ── */
.accent-strip {
  height: 4px;
  background: ${C.yellow};
}

/* ── KPI bar ── */
.kpi-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: ${C.purpleD};
}
.kpi-cell {
  padding: 10px 14px;
  border-right: 1px solid rgba(255,255,255,0.07);
}
.kpi-cell:last-child { border-right: none; }
.kpi-label {
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 3px;
  opacity: 0.6;
  color: #fff;
}
.kpi-value {
  font-family: 'Krona One', sans-serif;
  font-size: 22px;
  color: ${C.yellow};
  line-height: 1;
}
.kpi-unit {
  font-family: 'Jost', sans-serif;
  font-size: 10px;
  font-weight: 400;
  color: rgba(255,255,255,0.4);
  margin-left: 3px;
}

/* ── Content area ── */
.content { padding: 8mm 14mm 10mm; }
.section { margin-bottom: 16px; }
.section-title {
  font-family: 'Krona One', sans-serif;
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${C.purple};
  padding-bottom: 5px;
  border-bottom: 1.5px solid ${C.purple};
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-badge {
  font-family: 'Jost', sans-serif;
  font-size: 8px;
  font-weight: 600;
  background: ${C.yellow};
  color: ${C.purpleD};
  padding: 1px 7px;
  border-radius: 20px;
  letter-spacing: 0.04em;
  text-transform: none;
}

/* ── Two-col info row ── */
.info-row { display: flex; gap: 8px; margin-bottom: 10px; }
.info-card {
  flex: 1;
  border: 1.5px solid ${C.border};
  border-radius: 8px;
  padding: 9px 12px;
  background: ${C.offWhite};
}
.info-card-label {
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${C.muted};
  margin-bottom: 3px;
}
.info-card-value {
  font-family: 'Krona One', sans-serif;
  font-size: 16px;
  color: ${C.text};
  line-height: 1.1;
}
.info-card-sub {
  font-size: 9px;
  color: ${C.muted};
  margin-top: 1px;
}
.info-card.accent {
  border-color: ${C.yellow};
  background: #fffbe6;
}
.info-card.accent .info-card-value { color: #7a5c00; }

/* ── Elevation box ── */
.elev-box {
  border: 1.5px solid ${C.border};
  border-radius: 8px;
  overflow: hidden;
  background: ${C.offWhite};
}
.elev-header {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid ${C.border};
}
.elev-stat {
  padding: 7px 10px;
  border-right: 1px solid ${C.border};
  text-align: center;
}
.elev-stat:last-child { border-right: none; }
.elev-stat-label { font-size: 7.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: ${C.muted}; margin-bottom: 2px; }
.elev-stat-value { font-family: 'Krona One', sans-serif; font-size: 13px; color: ${C.purple}; }
.elev-legend {
  display: flex;
  gap: 14px;
  padding: 5px 12px;
  border-top: 1px solid ${C.border};
  background: #fff;
}
.elev-legend-item { display: flex; align-items: center; gap: 4px; font-size: 8px; color: ${C.muted}; }

/* ── Table ── */
table { width: 100%; border-collapse: collapse; }
thead tr { background: ${C.purpleD}; }
th {
  padding: 6px 10px;
  text-align: left;
  font-family: 'Krona One', sans-serif;
  font-size: 8px;
  font-weight: 400;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
}
td { padding: 5.5px 10px; font-size: 11px; border-bottom: 1px solid #f0eef8; }
tr:last-child td { border-bottom: none; }
tbody tr:hover { background: #faf9fe; }
.td-time { font-family: 'Krona One', sans-serif; font-size: 11px; color: ${C.text}; white-space: nowrap; }
.td-km { color: ${C.muted}; }
.td-cho { font-weight: 700; color: #7a5c00; }
.cho-pill {
  display: inline-block;
  background: ${C.yellow};
  color: ${C.purpleD};
  font-weight: 700;
  font-size: 10px;
  padding: 1.5px 7px;
  border-radius: 20px;
}
.td-fluid { color: #1d4ed8; font-weight: 600; }
.td-sodium { color: #0d9488; font-weight: 600; }
.td-caf { font-size: 10px; }
.totals-row {
  background: ${C.purpleD};
  display: flex;
  gap: 20px;
  padding: 6px 10px;
  border-radius: 0 0 6px 6px;
}
.totals-item { font-size: 9.5px; color: rgba(255,255,255,0.5); }
.totals-item strong { color: ${C.yellow}; }

/* ── Day card (pre-comp) ── */
.day-card { border: 1.5px solid ${C.border}; border-radius: 8px; margin-bottom: 8px; overflow: hidden; }
.day-header {
  background: ${C.purpleD};
  padding: 7px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.day-title { font-family: 'Krona One', sans-serif; font-size: 10px; color: ${C.yellow}; }
.day-stats { font-size: 9.5px; color: rgba(255,255,255,0.45); }
.meal-row { display: flex; align-items: flex-start; gap: 8px; padding: 5px 12px; border-bottom: 1px solid #f5f3fc; }
.meal-row:last-child { border-bottom: none; }
.meal-timing { font-size: 9.5px; color: ${C.muted}; min-width: 90px; flex-shrink: 0; padding-top: 1px; }
.meal-desc { font-size: 11px; flex: 1; line-height: 1.35; }
.meal-carbs { font-family: 'Krona One', sans-serif; font-size: 11px; color: #7a5c00; white-space: nowrap; }

/* ── Breakfast highlight ── */
.breakfast-card {
  border: 2px solid ${C.yellow};
  border-radius: 8px;
  padding: 10px 14px;
  background: #fffbe6;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 8px;
}
.breakfast-title { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #7a5c00; margin-bottom: 4px; }
.breakfast-desc { font-size: 11px; color: ${C.sub}; line-height: 1.4; }
.breakfast-carbs { font-family: 'Krona One', sans-serif; font-size: 22px; color: #7a5c00; flex-shrink: 0; margin-left: 16px; }

/* ── Caffeine cards ── */
.caff-grid { display: flex; gap: 8px; margin-bottom: 10px; }
.caff-card { flex: 1; border: 1.5px solid #fde68a; border-radius: 8px; padding: 9px 12px; background: #fffbeb; }
.caff-label { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #92400e; margin-bottom: 3px; }
.caff-value { font-family: 'Krona One', sans-serif; font-size: 18px; color: #b45309; }

/* ── GI table ── */
.gi-pill { background: ${C.yellow}; color: ${C.purpleD}; font-weight: 700; font-size: 10px; padding: 1.5px 7px; border-radius: 20px; display: inline-block; }

/* ── Risk ── */
.risk-ok { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; color: #166534; font-size: 11.5px; display: flex; align-items: center; gap: 8px; }
.risk-warn { display: flex; gap: 8px; padding: 8px 12px; border-radius: 8px; margin-bottom: 6px; border: 1.5px solid; align-items: flex-start; }

/* ── Athlete notes ── */
.note-row { display: flex; gap: 10px; align-items: flex-start; padding: 7px 0; border-bottom: 1px solid ${C.border}; }
.note-row:last-child { border-bottom: none; }
.note-tag { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; padding: 2px 8px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
.note-text { font-size: 11px; line-height: 1.45; color: ${C.sub}; }

/* ── Footer ── */
.footer {
  border-top: 1.5px solid ${C.border};
  padding: 7px 14mm;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 9px;
  color: ${C.muted};
  background: ${C.offWhite};
}
.footer-brand { display: flex; align-items: center; gap: 6px; font-weight: 600; color: ${C.sub}; }
`;
}

// ─── Full Report ──────────────────────────────────────────────────────────────
async function buildFullReportHTML(competition: Competition, editablePlan?: EditablePlan): Promise<string> {
  const output = competition.strategyOutput as StrategyOutput;
  const cfg = getSportConfig(competition.sport);
  const segments = editablePlan?.segments ?? buildSegments(competition, output);
  const executionItems = editablePlan?.executionItems ?? [];
  const recs = editablePlan?.recommendations;
  const durationLabel = formatDuration(competition.raceData.expectedDurationMin);
  const distKm = competition.raceData.distanceUnit === 'miles'
    ? competition.raceData.distance * 1.60934
    : competition.raceData.distance;

  // Images
  const logoURI = await toDataURI('/Asciendelogo.png');
  const iconURI = await toDataURI('/AppIcon.png');

  // Elevation
  const seed = competition.raceName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const elevPts = generateElevationProfile(distKm, competition.raceData.elevationGain || 0, seed);
  const stationsRaw = generateHydrationStations(distKm, elevPts, undefined);
  const stationData = stationsRaw.map(s => ({ km: s.km, hasFood: s.hasFood }));
  const maxElev = elevPts.length ? Math.max(...elevPts.map(p => p.elevationM)) : 0;
  const minElev = elevPts.length ? Math.min(...elevPts.map(p => p.elevationM)) : 0;
  const climbTotal = elevPts.reduce((acc, p, i) => {
    if (i === 0) return acc;
    const d = p.elevationM - elevPts[i - 1].elevationM;
    return d > 0 ? acc + d : acc;
  }, 0);
  const elevSVG = buildElevationSVG(elevPts, distKm, Math.round(climbTotal), stationData);

  // Segment rows
  const segRows = segments.map((s, i) => {
    const hasCaf = !!s.caffeineNote;
    return `<tr style="background:${hasCaf ? '#fffbeb' : i % 2 !== 0 ? '#faf9fe' : '#fff'};">
      <td class="td-time">${formatDuration(s.timeMin)}</td>
      <td class="td-km">${s.distanceKm} km</td>
      <td><span class="cho-pill">${s.choG}g</span></td>
      <td class="td-fluid">${s.fluidMl}mL</td>
      <td class="td-sodium">${s.sodiumMg}mg</td>
      <td class="td-caf" style="color:${hasCaf ? '#92400e' : '#ccc'};font-weight:${hasCaf ? '600' : '400'};">${s.caffeineNote || '—'}</td>
    </tr>`;
  }).join('');

  const executionRows = executionItems.map((item, i) => `<tr style="background:${i % 2 !== 0 ? '#faf9fe' : '#fff'};">
    <td class="td-time">${formatDuration(item.timeMin)}</td><td class="td-km">${escapeHtml(item.distanceLabel)}</td><td>${escapeHtml(item.title)}</td><td>${item.quantity}</td>
    <td class="td-cho">${Math.round(item.carbsG)}g</td><td class="td-fluid">${Math.round(item.liquidMl)}mL</td><td class="td-sodium">${Math.round(item.sodiumMg)}mg</td><td>${Math.round(item.calories)} kcal</td>
  </tr>`).join('');
  const executionTotals = executionItems.reduce((totals, item) => ({ calories: totals.calories + item.calories, carbsG: totals.carbsG + item.carbsG, sodiumMg: totals.sodiumMg + item.sodiumMg, liquidMl: totals.liquidMl + item.liquidMl }), { calories: 0, carbsG: 0, sodiumMg: 0, liquidMl: 0 });
  const executionPerHour = (value: number) => competition.raceData.expectedDurationMin > 0 ? value / (competition.raceData.expectedDurationMin / 60) : 0;
  const executionSection = executionItems.length > 0 ? `<div class="section"><div class="section-title">Race Nutrition Timeline</div><table><thead><tr><th>Time</th><th>Distance / Station</th><th>Product or Meal</th><th>Qty</th><th>CHO</th><th>Fluid</th><th>Sodium</th><th>Calories</th></tr></thead><tbody>${executionRows}</tbody></table><div class="totals-row"><span class="totals-item">TOTALS:</span><span class="totals-item"><strong>${Math.round(executionTotals.calories)}</strong> kcal</span><span class="totals-item"><strong>${Math.round(executionTotals.carbsG)}g</strong> CHO</span><span class="totals-item"><strong>${Math.round(executionTotals.liquidMl)}mL</strong> fluid</span><span class="totals-item"><strong>${Math.round(executionTotals.sodiumMg)}mg</strong> sodium</span></div><div style="padding:6px 10px;font-size:9px;color:${C.muted};">Per hour: ${Math.round(executionPerHour(executionTotals.calories))} kcal/h · ${Math.round(executionPerHour(executionTotals.carbsG))}g CHO/h · ${Math.round(executionPerHour(executionTotals.liquidMl))}mL/h · ${Math.round(executionPerHour(executionTotals.sodiumMg))}mg sodium/h</div></div>` : '';

  // Pre-comp meals
  const mealsHtml = (meals: DayMeal[]) => meals.map(m =>
    `<div class="meal-row">
      <div class="meal-timing">${m.timing}</div>
      <div class="meal-desc">${m.description}</div>
      <div class="meal-carbs">${m.carbsG}g</div>
    </div>`
  ).join('');

  const preCompDays = output.preComp.plan.map(day => `
    <div class="day-card">
      <div class="day-header">
        <span class="day-title">${day.dayLabel}</span>
        <span class="day-stats">${day.carbsGkg}g CHO/kg &nbsp;·&nbsp; ${day.totalCarbsG}g carbs &nbsp;·&nbsp; ${day.proteinG}g protein &nbsp;·&nbsp; ${day.totalKcal} kcal</span>
      </div>
      ${mealsHtml(day.meals)}
      ${day.notes ? `<div style="padding:5px 12px;font-size:9.5px;color:${C.muted};border-top:1px solid #f5f3fc;">${day.notes}</div>` : ''}
    </div>`).join('');

  const cafSection = output.caffeine.totalMg > 0 ? `
    <div class="section">
      <div class="section-title">Caffeine Plan</div>
      <div class="caff-grid">
        <div class="caff-card">
          <div class="caff-label">Total Dose</div>
          <div class="caff-value">${output.caffeine.totalMg}<span style="font-family:Jost,sans-serif;font-size:10px;color:#92400e;margin-left:3px;">mg &nbsp;·&nbsp; ${output.caffeine.mgPerKg}mg/kg</span></div>
        </div>
        <div class="caff-card">
          <div class="caff-label">Pre-Race</div>
          <div class="caff-value">${output.caffeine.preDoseMg}<span style="font-family:Jost,sans-serif;font-size:10px;color:#92400e;margin-left:3px;">mg &nbsp;·&nbsp; ${output.caffeine.preDoseMinBeforeStart}min before</span></div>
        </div>
      </div>
      <ul style="padding-left:16px;margin-bottom:8px;">
        ${output.caffeine.sources.map(s => `<li style="font-size:11px;margin-bottom:3px;color:${C.sub};">${s}</li>`).join('')}
      </ul>
      ${output.caffeine.notes ? `<div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:8px;padding:8px 12px;font-size:11px;color:#78350f;">${output.caffeine.notes}</div>` : ''}
    </div>` : '';

  const giSection = output.giTraining ? `
    <div class="section">
      <div class="section-title">GI Training Protocol &nbsp;—&nbsp; ${output.giTraining.weeks} Weeks <span class="section-badge">Target: ${output.giTraining.targetGH}g/h</span></div>
      <p style="font-size:11px;color:${C.sub};margin-bottom:10px;">${output.giTraining.notes}</p>
      <table>
        <thead><tr>
          <th>Week</th><th>CHO Target</th><th>Duration</th><th>Format</th><th>Notes</th>
        </tr></thead>
        <tbody>
          ${output.giTraining.sessions.map((s, i) => `
          <tr style="background:${i % 2 !== 0 ? '#faf9fe' : '#fff'};">
            <td style="font-family:'Krona One',sans-serif;font-size:11px;">W${s.week}</td>
            <td><span class="gi-pill">${s.intakeGH}g/h</span></td>
            <td style="font-size:10.5px;">${s.duration}</td>
            <td style="font-size:10.5px;">${s.format}</td>
            <td style="font-size:9.5px;color:${C.muted};">${s.notes}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : '';

  const risksHtml = (risks: RiskFlag[]) => {
    if (risks.length === 0) return `<div class="risk-ok">✓ No significant risk factors identified. Ready to race.</div>`;
    return risks.map(r => `
      <div class="risk-warn" style="background:${r.level === 'critical' ? '#fef2f2' : '#fffbeb'};border-color:${r.level === 'critical' ? '#fecaca' : '#fde68a'};">
        <span style="font-size:13px;font-weight:800;color:${r.level === 'critical' ? '#dc2626' : '#d97706'};">${r.level === 'critical' ? '!' : '▲'}</span>
        <span style="font-size:11px;color:${r.level === 'critical' ? '#7f1d1d' : '#78350f'};">${r.message}</span>
      </div>`).join('');
  };

  const athleteNotes = (recs?.carbsNote || recs?.hydrationNote || recs?.caffeineNote || recs?.generalNotes || recs?.pacingNote) ? `
    <div class="section">
      <div class="section-title">Athlete Notes</div>
      ${recs?.pacingNote ? `<div class="note-row"><span class="note-tag" style="background:${C.purple}15;color:${C.purple};">Pacing</span><span class="note-text">${recs.pacingNote}</span></div>` : ''}
      ${recs?.carbsNote ? `<div class="note-row"><span class="note-tag" style="background:${C.yellow}40;color:#7a5c00;">Carbs</span><span class="note-text">${recs.carbsNote}</span></div>` : ''}
      ${recs?.hydrationNote ? `<div class="note-row"><span class="note-tag" style="background:#dbeafe;color:#1e40af;">Hydration</span><span class="note-text">${recs.hydrationNote}</span></div>` : ''}
      ${recs?.caffeineNote ? `<div class="note-row"><span class="note-tag" style="background:#fef3c7;color:#92400e;">Caffeine</span><span class="note-text">${recs.caffeineNote}</span></div>` : ''}
      ${recs?.generalNotes ? `<div class="note-row"><span class="note-tag" style="background:#f3f4f6;color:#374151;">General</span><span class="note-text">${recs.generalNotes}</span></div>` : ''}
    </div>` : '';

  const logoImg = logoURI ? `<img src="${logoURI}" alt="Asciende" style="height:28px;object-fit:contain;display:block;">` : `<span style="font-family:'Krona One',sans-serif;font-size:14px;color:#fff;">ASCIENDE</span>`;
  const iconImg = iconURI ? `<img src="${iconURI}" alt="" style="height:32px;width:32px;object-fit:contain;display:block;">` : '';
  const footerLogo = logoURI ? `<img src="${logoURI}" alt="Asciende" style="height:16px;object-fit:contain;display:block;filter:grayscale(100%) opacity(0.5);">` : `<span>ASCIENDE</span>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${competition.raceName} — Race Plan</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Krona+One&family=Jost:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${css()}</style>
</head>
<body>
<div class="page">

  <!-- ══ COVER BAND ══════════════════════════════════════════════════════════ -->
  <div class="cover-band">
    <div style="flex:1;">
      ${logoImg}
      <div class="cover-race-name">${competition.raceName}</div>
      <div class="cover-sub">${cfg.label} &nbsp;·&nbsp; ${competition.raceData.distance} ${competition.raceData.distanceUnit} (${Math.round(distKm * 10) / 10} km) &nbsp;·&nbsp; ${durationLabel} &nbsp;·&nbsp; ${competition.raceData.temperature}°C / ${competition.raceData.humidity}% RH &nbsp;·&nbsp; Alt. ${competition.raceData.altitude}m</div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
      ${iconImg}
      <div class="cover-badge">RACE PLAN</div>
      <div class="cover-date">${competition.raceData.raceDate || new Date().toISOString().split('T')[0]}</div>
    </div>
  </div>
  <div class="accent-strip"></div>

  <!-- ══ KPI BAR ══════════════════════════════════════════════════════════════ -->
  <div class="kpi-bar">
    <div class="kpi-cell">
      <div class="kpi-label">Intensity</div>
      <div><span class="kpi-value">${output.pacing.intensityPercent}%</span><span class="kpi-unit">VO2max</span></div>
    </div>
    <div class="kpi-cell">
      <div class="kpi-label">Carbohydrates</div>
      <div><span class="kpi-value">${output.carbs.recommendedIntakeGH}</span><span class="kpi-unit">g/h</span></div>
    </div>
    <div class="kpi-cell">
      <div class="kpi-label">Fluid</div>
      <div><span class="kpi-value">${output.hydration.fluidIntakeLH}</span><span class="kpi-unit">L/h</span></div>
    </div>
    <div class="kpi-cell">
      <div class="kpi-label">Sodium</div>
      <div><span class="kpi-value">${output.hydration.sodiumMgH}</span><span class="kpi-unit">mg/h</span></div>
    </div>
  </div>

  <!-- ══ CONTENT ══════════════════════════════════════════════════════════════ -->
  <div class="content">

    <!-- COURSE PROFILE -->
    ${elevPts.length > 1 ? `
    <div class="section">
      <div class="section-title">Course Profile <span class="section-badge">${distKm.toFixed(1)} km &nbsp;·&nbsp; +${Math.round(climbTotal)}m &nbsp;·&nbsp; ${minElev}–${maxElev}m &nbsp;·&nbsp; ${stationData.length} aid stations</span></div>
      <div class="elev-box">
        <div class="elev-header">
          <div class="elev-stat"><div class="elev-stat-label">Max Elevation</div><div class="elev-stat-value">${maxElev}<span style="font-size:9px;font-family:Jost,sans-serif;color:${C.muted};margin-left:2px;">m</span></div></div>
          <div class="elev-stat"><div class="elev-stat-label">Total Gain</div><div class="elev-stat-value" style="color:#b45309;">+${Math.round(climbTotal)}<span style="font-size:9px;font-family:Jost,sans-serif;margin-left:2px;">m</span></div></div>
          <div class="elev-stat"><div class="elev-stat-label">Elev. Range</div><div class="elev-stat-value">${maxElev - minElev}<span style="font-size:9px;font-family:Jost,sans-serif;color:${C.muted};margin-left:2px;">m</span></div></div>
          <div class="elev-stat"><div class="elev-stat-label">Aid Stations</div><div class="elev-stat-value">${stationData.length}</div></div>
        </div>
        <div style="padding:10px 8px 2px;">${elevSVG}</div>
        <div class="elev-legend">
          <div class="elev-legend-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="${C.yellow}"/></svg> Water only</div>
          <div class="elev-legend-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#34d399"/></svg> Water + Food</div>
          <div class="elev-legend-item"><svg width="12" height="8"><rect width="12" height="4" y="2" rx="2" fill="#ef444440"/></svg> Climb (&gt;4%)</div>
        </div>
      </div>
    </div>` : ''}

    <!-- PACING -->
    <div class="section">
      <div class="section-title">Pacing Strategy</div>
      <div class="info-row">
        <div class="info-card accent">
          <div class="info-card-label" style="color:#7a5c00;">Target Pace</div>
          <div class="info-card-value" style="font-size:20px;">${formatPace(output.pacing.estimatedPaceMinKm)}<span style="font-family:Jost,sans-serif;font-size:11px;font-weight:400;color:${C.muted};margin-left:4px;">min/km</span></div>
        </div>
        <div class="info-card">
          <div class="info-card-label">Intensity Zone</div>
          <div class="info-card-value" style="font-size:13px;color:${C.purple};">${output.pacing.intensityZone}</div>
          <div class="info-card-sub">${output.pacing.intensityPercent}% VO2max</div>
        </div>
        <div class="info-card" style="flex:2;">
          <div class="info-card-label">Recommendation</div>
          <div style="font-size:11px;color:${C.sub};line-height:1.4;margin-top:2px;">${recs?.pacingNote || output.pacing.recommendation}</div>
        </div>
      </div>
    </div>

    <!-- RACE EXECUTION -->
    ${executionSection}

    <!-- CAFFEINE -->
    ${cafSection}

    <!-- PRE-COMPETITION -->
    <div class="section">
      <div class="section-title">Pre-Competition Nutrition <span class="section-badge">${output.preComp.choLoadingDays > 0 ? `${output.preComp.choLoadingDays}-day CHO load` : 'Pre-race meal'}</span></div>
      <p style="font-size:11px;color:${C.sub};margin-bottom:12px;">${output.preComp.notes}</p>
      ${preCompDays}
      <div class="breakfast-card">
        <div>
          <div class="breakfast-title">Race Morning Breakfast &nbsp;·&nbsp; ${output.preComp.raceBreakfast.timingBeforeStart}</div>
          <div class="breakfast-desc">${output.preComp.raceBreakfast.description}</div>
        </div>
        <div style="text-align:right;">
          <div class="breakfast-carbs">${output.preComp.raceBreakfast.carbsG}g</div>
          <div style="font-size:9px;color:#7a5c00;">carbs</div>
        </div>
      </div>
    </div>

    <!-- GI TRAINING -->
    ${giSection}

    <!-- RISK FLAGS -->
    <div class="section">
      <div class="section-title">Risk Analysis <span class="section-badge">${output.risks.length} flag${output.risks.length !== 1 ? 's' : ''}</span></div>
      ${risksHtml(output.risks)}
    </div>

    <!-- ATHLETE NOTES -->
    ${athleteNotes}

  </div><!-- /content -->

  <!-- ══ FOOTER ═══════════════════════════════════════════════════════════════ -->
  <div class="footer">
    <div class="footer-brand">
      ${footerLogo}
      <span>Asciende Race Planner</span>
    </div>
    <span>${new Date().toLocaleDateString('en-GB')}</span>
    <span>${competition.raceName} &nbsp;·&nbsp; ${cfg.label}</span>
  </div>

</div>
</body>
</html>`;
}

// ─── Cue Card ─────────────────────────────────────────────────────────────────
async function buildCueCardHTML(competition: Competition, editablePlan?: EditablePlan): Promise<string> {
  const output = competition.strategyOutput as StrategyOutput;
  const executionItems = editablePlan?.executionItems ?? [];
  const durationLabel = formatDuration(competition.raceData.expectedDurationMin);

  const iconURI = await toDataURI('/AppIcon.png');

  const segRows = executionItems.map((item, i) => `<tr style="background:${i % 2 === 0 ? '#fff' : '#faf9fe'};">
      <td style="font-family:'Krona One',sans-serif;font-size:10px;white-space:nowrap;padding:5px 8px;border-bottom:1px solid #f0eef8;">${formatDuration(item.timeMin)}</td>
      <td style="font-size:9.5px;color:${C.muted};padding:5px 8px;border-bottom:1px solid #f0eef8;">${escapeHtml(item.distanceLabel)}</td>
      <td style="font-size:10px;font-weight:600;padding:5px 8px;border-bottom:1px solid #f0eef8;">${escapeHtml(item.title)} · ${item.quantity} ×</td>
    </tr>`).join('');

  const warnings = output.risks.filter(r => r.level === 'critical');
  const iconImg = iconURI ? `<img src="${iconURI}" alt="" style="height:28px;width:28px;object-fit:contain;">` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${competition.raceName} — Cue Card</title>
  <link href="https://fonts.googleapis.com/css2?family=Krona+One&family=Jost:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A5 landscape; margin: 6mm; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Jost', sans-serif; color: ${C.text}; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    table { border-collapse: collapse; width: 100%; }
  </style>
</head>
<body>
<div style="border:2.5px solid ${C.dark};border-radius:10px;overflow:hidden;height:calc(100vh - 12mm);display:flex;flex-direction:column;">

  <!-- Header strip -->
  <div style="background:${C.dark};padding:8px 12px;display:flex;justify-content:space-between;align-items:center;">
    <div style="display:flex;align-items:center;gap:10px;">
      ${iconImg}
      <div>
        <div style="font-family:'Krona One',sans-serif;font-size:14px;color:#fff;line-height:1.1;">${competition.raceName}</div>
        <div style="font-size:8.5px;color:rgba(255,255,255,.4);margin-top:2px;">${competition.raceData.distance} ${competition.raceData.distanceUnit} &nbsp;·&nbsp; ${durationLabel} &nbsp;·&nbsp; ${competition.raceData.temperature}°C</div>
      </div>
    </div>
    <div style="display:flex;gap:6px;">
      <div style="background:${C.yellow};border-radius:6px;padding:5px 10px;text-align:center;">
        <div style="font-size:7px;font-weight:700;text-transform:uppercase;color:${C.purpleD};letter-spacing:.08em;">CHO</div>
        <div style="font-family:'Krona One',sans-serif;font-size:14px;color:${C.purpleD};">${output.carbs.recommendedIntakeGH}<span style="font-size:8px;font-family:Jost,sans-serif;">g/h</span></div>
      </div>
      <div style="background:${C.purpleD};border-radius:6px;padding:5px 10px;text-align:center;border:1px solid rgba(255,255,255,.1);">
        <div style="font-size:7px;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,.5);letter-spacing:.08em;">Fluid</div>
        <div style="font-family:'Krona One',sans-serif;font-size:14px;color:#93c5fd;">${output.hydration.fluidIntakeLH}<span style="font-size:8px;font-family:Jost,sans-serif;">L/h</span></div>
      </div>
      <div style="background:${C.purpleD};border-radius:6px;padding:5px 10px;text-align:center;border:1px solid rgba(255,255,255,.1);">
        <div style="font-size:7px;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,.5);letter-spacing:.08em;">Sodium</div>
        <div style="font-family:'Krona One',sans-serif;font-size:14px;color:#5eead4;">${output.hydration.sodiumMgH}<span style="font-size:8px;font-family:Jost,sans-serif;">mg/h</span></div>
      </div>
      <div style="background:${C.purpleD};border-radius:6px;padding:5px 10px;text-align:center;border:1px solid rgba(255,255,255,.1);">
        <div style="font-size:7px;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,.5);letter-spacing:.08em;">Pace</div>
        <div style="font-family:'Krona One',sans-serif;font-size:14px;color:#fff;">${formatPace(output.pacing.estimatedPaceMinKm)}<span style="font-size:8px;color:rgba(255,255,255,.4);">/km</span></div>
      </div>
    </div>
  </div>
  <div style="height:3px;background:${C.yellow};flex-shrink:0;"></div>

  <!-- Body -->
  <div style="flex:1;display:grid;grid-template-columns:1fr 108px;min-height:0;overflow:hidden;">
    <div style="overflow:hidden;">
      <table style="font-size:11px;">
        <thead>
          <tr style="background:${C.purpleD};">
            <th style="padding:5px 8px;text-align:left;font-family:'Krona One',sans-serif;font-size:8px;letter-spacing:.08em;font-weight:400;color:rgba(255,255,255,.5);">TIME</th>
            <th style="padding:5px 8px;text-align:left;font-family:'Krona One',sans-serif;font-size:8px;letter-spacing:.08em;font-weight:400;color:rgba(255,255,255,.5);">KM / STATION</th>
            <th style="padding:5px 8px;text-align:left;font-family:'Krona One',sans-serif;font-size:8px;letter-spacing:.08em;font-weight:400;color:${C.yellow};">SUPPLEMENT OR MEAL</th>
          </tr>
        </thead>
        <tbody>${segRows}</tbody>
      </table>
    </div>

    <!-- Right panel -->
    <div style="background:${C.offWhite};border-left:1px solid ${C.border};padding:10px;display:flex;flex-direction:column;gap:8px;">
      ${output.caffeine.totalMg > 0 ? `
      <div style="border:1.5px solid #fde68a;border-radius:6px;padding:7px 8px;background:#fffbeb;">
        <div style="font-size:7.5px;font-weight:700;text-transform:uppercase;color:#92400e;margin-bottom:2px;letter-spacing:.06em;">Caffeine</div>
        <div style="font-family:'Krona One',sans-serif;font-size:13px;color:#b45309;">${output.caffeine.totalMg}<span style="font-size:8px;font-family:Jost,sans-serif;">mg</span></div>
        <div style="font-size:8px;color:#92400e;margin-top:2px;">Pre: ${output.caffeine.preDoseMg}mg (${output.caffeine.preDoseMinBeforeStart}min)</div>
      </div>` : ''}
      ${warnings.length > 0 ? `
      <div style="border:1.5px solid #fecaca;border-radius:6px;padding:7px 8px;background:#fef2f2;">
        <div style="font-size:7.5px;font-weight:800;color:#dc2626;margin-bottom:3px;text-transform:uppercase;">ALERT</div>
        ${warnings.map(w => `<div style="font-size:8.5px;color:#7f1d1d;">${w.message}</div>`).join('')}
      </div>` : ''}
      <div style="border:1.5px solid ${C.border};border-radius:6px;padding:7px 8px;background:#fff;margin-top:auto;">
        <div style="font-size:7.5px;color:${C.muted};font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Race Totals</div>
        <div style="font-size:9.5px;font-weight:700;color:#7a5c00;">${output.carbs.totalCarbsG}g CHO</div>
        <div style="font-size:9.5px;color:#1d4ed8;">${output.hydration.totalFluidL}L fluid</div>
        <div style="font-size:9.5px;color:#0d9488;">${output.hydration.totalSodiumMg}mg Na</div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div style="border-top:1px solid ${C.border};padding:4px 12px;display:flex;justify-content:space-between;align-items:center;font-size:8.5px;color:${C.muted};background:${C.offWhite};flex-shrink:0;">
    <span style="font-weight:600;color:${C.sub};">Asciende Race Planner</span>
    <span>${competition.raceName} &nbsp;·&nbsp; ${durationLabel}</span>
  </div>

</div>
</body>
</html>`;
}

// ─── Public exports ───────────────────────────────────────────────────────────
export function generateFullReportHTML(competition: Competition, editablePlan?: EditablePlan): string {
  // sync fallback (not used directly, kept for type compat)
  return '';
}

export function generateCueCardHTML(competition: Competition, editablePlan?: EditablePlan): string {
  return '';
}

export async function printFullReport(competition: Competition, editablePlan?: EditablePlan): Promise<void> {
  const html = await buildFullReportHTML(competition, editablePlan);
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  // Wait for fonts to load before printing
  win.onload = () => {
    setTimeout(() => win.print(), 800);
  };
}

export async function printCueCard(competition: Competition, editablePlan?: EditablePlan): Promise<void> {
  const html = await buildCueCardHTML(competition, editablePlan);
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.onload = () => {
    setTimeout(() => win.print(), 800);
  };
}
