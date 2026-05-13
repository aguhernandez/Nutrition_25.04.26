import type { Competition, StrategyOutput, DayMeal, RiskFlag, CaffeineDose, ElevationPoint } from '../types/race';
import type { EditablePlan, EditableSegment } from '../types/editablePlan';
import { getSportConfig } from '../config/sports';
import { generateElevationProfile, generateHydrationStations } from './elevationGenerator';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const BRAND = {
  yellow: '#fdda36',
  yellowDark: '#e5c420',
  dark: '#1a1a1a',
  midGray: '#2d2d2d',
  lightGray: '#f5f5f5',
  textPrimary: '#111111',
  textSecondary: '#555555',
  textMuted: '#999999',
  border: '#e5e7eb',
};

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

function getTimeInterval(durationMin: number): number {
  if (durationMin <= 90) return 20;
  if (durationMin <= 360) return 30;
  return 60;
}

// ─── Elevation SVG ────────────────────────────────────────────────────────────
function buildElevationSVG(pts: ElevationPoint[], distKm: number, totalGain: number, stationKms: number[]): string {
  if (pts.length < 2) return '';

  const W = 760, H = 120;
  const PAD = { top: 8, right: 8, bottom: 28, left: 44 };
  const PW = W - PAD.left - PAD.right;
  const PH = H - PAD.top - PAD.bottom;

  const minE = Math.min(...pts.map(p => p.elevationM));
  const maxE = Math.max(...pts.map(p => p.elevationM));
  const eRange = maxE - minE || 1;
  const kmMax = distKm;

  const tx = (km: number) => PAD.left + (km / kmMax) * PW;
  const ty = (e: number) => PAD.top + PH - ((e - minE) / eRange) * PH;

  const linePts = pts.map(p => `${tx(p.km).toFixed(1)},${ty(p.elevationM).toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  const first = pts[0];
  const fillD = `M${tx(first.km).toFixed(1)},${ty(first.elevationM).toFixed(1)} `
    + pts.slice(1).map(p => `L${tx(p.km).toFixed(1)},${ty(p.elevationM).toFixed(1)}`).join(' ')
    + ` L${tx(last.km).toFixed(1)},${(PAD.top + PH).toFixed(1)} L${tx(first.km).toFixed(1)},${(PAD.top + PH).toFixed(1)} Z`;

  const tickInterval = distKm <= 15 ? 5 : distKm <= 50 ? 10 : distKm <= 100 ? 20 : 50;
  const xTicks = Array.from({ length: Math.floor(distKm / tickInterval) + 1 }, (_, i) => i * tickInterval).filter(k => k <= distKm);

  const yTicks = 3;
  const yStep = Math.ceil((eRange) / yTicks / 50) * 50;
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => minE + i * yStep).filter(v => v <= maxE + yStep);

  const stationMarkers = stationKms.map(km => {
    const near = pts.reduce((b, p) => Math.abs(p.km - km) < Math.abs(b.km - km) ? p : b, pts[0]);
    const x = tx(km);
    const y = ty(near.elevationM);
    return `
      <line x1="${x}" y1="${y}" x2="${x}" y2="${PAD.top + PH}" stroke="${BRAND.yellow}" stroke-width="1" stroke-dasharray="2,2" opacity="0.8"/>
      <circle cx="${x}" cy="${y}" r="3.5" fill="${BRAND.yellow}" stroke="white" stroke-width="1"/>`;
  }).join('');

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
  <defs>
    <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BRAND.yellow}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${BRAND.yellow}" stop-opacity="0.05"/>
    </linearGradient>
  </defs>
  ${yTickVals.map(e => {
    const y = ty(e);
    return `<line x1="${PAD.left}" y1="${y.toFixed(1)}" x2="${PAD.left + PW}" y2="${y.toFixed(1)}" stroke="#e5e7eb" stroke-width="0.8"/>
    <text x="${(PAD.left - 4).toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="8" fill="#aaa" font-family="Jost,sans-serif">${Math.round(e)}m</text>`;
  }).join('')}
  ${xTicks.map(km => {
    const x = tx(km);
    return `<line x1="${x.toFixed(1)}" y1="${PAD.top + PH}" x2="${x.toFixed(1)}" y2="${PAD.top + PH + 3}" stroke="#ccc" stroke-width="0.8"/>
    <text x="${x.toFixed(1)}" y="${PAD.top + PH + 12}" text-anchor="middle" font-size="8" fill="#aaa" font-family="Jost,sans-serif">${km}km</text>`;
  }).join('')}
  <path d="${fillD}" fill="url(#eg)"/>
  <polyline points="${linePts}" fill="none" stroke="${BRAND.yellow}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
  ${stationMarkers}
  <text x="${PAD.left}" y="${H - 1}" font-size="7" fill="#bbb" font-family="Jost,sans-serif">+${totalGain}m gain</text>
</svg>`;
}

// ─── Segment rows ─────────────────────────────────────────────────────────────
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
    segments.push({
      timeMin: segEnd,
      distanceKm: distReached,
      choG: Math.round(choPerInterval),
      fluidMl: Math.round(fluidPerInterval),
      sodiumMg: Math.round(sodiumPerInterval),
      caffeineNote: cafNote,
    });
    if (segEnd >= totalMin) break;
  }

  return segments;
}

// ─── Shared CSS ───────────────────────────────────────────────────────────────
function sharedCSS(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Krona+One&family=Jost:wght@300;400;500;600;700&display=swap');
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Jost', -apple-system, sans-serif;
      color: ${BRAND.textPrimary};
      background: #fff;
      font-size: 12px;
      line-height: 1.55;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    h1, h2, h3 { font-family: 'Krona One', sans-serif; }
    .page { padding: 14mm 14mm 10mm 14mm; }
    .section { margin-bottom: 18px; }
    .section-title {
      font-family: 'Krona One', sans-serif;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: ${BRAND.textMuted};
      padding-bottom: 5px;
      border-bottom: 1px solid ${BRAND.border};
      margin-bottom: 10px;
    }
    .section-title.accent {
      color: ${BRAND.yellow};
      border-bottom-color: ${BRAND.yellow};
    }
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 8.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: ${BRAND.textMuted}; padding: 6px 10px 5px; text-align: left; border-bottom: 1px solid ${BRAND.border}; }
    td { padding: 6px 10px; font-size: 11.5px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    .pill {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 20px;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.04em;
    }
    .pill-yellow { background: ${BRAND.yellow}20; color: #7a6300; border: 1px solid ${BRAND.yellow}40; }
    .pill-blue   { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .pill-teal   { background: #ccfbf1; color: #0f766e; border: 1px solid #99f6e4; }
    .pill-amber  { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .pill-red    { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
    .stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; margin-bottom: 18px; }
    .stat-card { border: 1.5px solid ${BRAND.border}; border-radius: 8px; padding: 10px 12px; }
    .stat-label { font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 3px; }
    .stat-value { font-family: 'Krona One', sans-serif; font-size: 20px; line-height: 1; }
    .stat-unit  { font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 400; color: ${BRAND.textMuted}; margin-left: 2px; }
    .day-card { border: 1.5px solid ${BRAND.border}; border-radius: 8px; margin-bottom: 10px; overflow: hidden; }
    .day-header { background: ${BRAND.lightGray}; padding: 7px 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid ${BRAND.border}; }
    .day-header-title { font-family: 'Krona One', sans-serif; font-size: 10px; }
    .day-header-stats { font-size: 10px; color: ${BRAND.textMuted}; }
    .risk-ok { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; color: #166534; font-size: 11.5px; }
    .risk-warn { display: flex; gap: 8px; padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; }
    .footer { border-top: 1.5px solid ${BRAND.border}; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: ${BRAND.textMuted}; margin-top: 16px; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  `;
}

// ─── Logo SVG (Asciende triangle mark) ────────────────────────────────────────
function logoSVG(size = 28): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <polygon points="20,4 36,34 4,34" fill="none" stroke="${BRAND.yellow}" stroke-width="3.5" stroke-linejoin="round"/>
    <line x1="20" y1="14" x2="20" y2="26" stroke="${BRAND.yellow}" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
}

// ─── Full Report ──────────────────────────────────────────────────────────────
export function generateFullReportHTML(competition: Competition, editablePlan?: EditablePlan): string {
  const output = competition.strategyOutput as StrategyOutput;
  const cfg = getSportConfig(competition.sport);
  const segments = editablePlan?.segments ?? buildSegments(competition, output);
  const recs = editablePlan?.recommendations;
  const durationLabel = formatDuration(competition.raceData.expectedDurationMin);
  const distKm = competition.raceData.distanceUnit === 'miles'
    ? competition.raceData.distance * 1.60934
    : competition.raceData.distance;

  // Generate elevation data
  const seed = competition.raceName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const elevPts: ElevationPoint[] = generateElevationProfile(distKm, competition.raceData.elevationGain || 0, seed);
  const stations = generateHydrationStations(distKm, elevPts, undefined);
  const stationKms = stations.map(s => s.km);
  const maxElev = elevPts.length ? Math.max(...elevPts.map(p => p.elevationM)) : 0;
  const minElev = elevPts.length ? Math.min(...elevPts.map(p => p.elevationM)) : 0;
  const climbTotal = elevPts.reduce((acc, p, i) => {
    if (i === 0) return acc;
    const d = p.elevationM - elevPts[i - 1].elevationM;
    return d > 0 ? acc + d : acc;
  }, 0);

  const elevSVG = buildElevationSVG(elevPts, distKm, Math.round(climbTotal), stationKms);

  // Segment rows
  const segmentRows = segments.map((s, i) => {
    const hasCaf = !!s.caffeineNote;
    const rowBg = hasCaf ? '#fffbeb' : i % 2 !== 0 ? '#fafafa' : '#fff';
    return `<tr style="background:${rowBg};">
      <td style="font-family:'Krona One',sans-serif;font-size:11px;font-weight:400;white-space:nowrap;">${formatDuration(s.timeMin)}</td>
      <td style="color:${BRAND.textMuted};">${s.distanceKm} km</td>
      <td><span class="pill pill-yellow">${s.choG}g</span></td>
      <td style="color:#1d4ed8;font-weight:600;">${s.fluidMl}mL</td>
      <td style="color:#0d9488;font-weight:600;">${s.sodiumMg}mg</td>
      <td style="font-size:10px;color:${hasCaf ? '#92400e' : '#ccc'};font-weight:${hasCaf ? '600' : '400'};">${s.caffeineNote || '—'}</td>
    </tr>`;
  }).join('');

  // Pre-competition days
  const mealsHtml = (meals: DayMeal[]) => meals.map(m =>
    `<tr>
      <td style="color:${BRAND.textMuted};font-size:10.5px;white-space:nowrap;padding:5px 10px;">${m.timing}</td>
      <td style="font-size:11px;padding:5px 10px;">${m.description}</td>
      <td style="text-align:right;font-family:'Krona One',sans-serif;font-size:11px;color:#b45309;padding:5px 10px;">${m.carbsG}g</td>
    </tr>`
  ).join('');

  const preCompDays = output.preComp.plan.map(day =>
    `<div class="day-card">
      <div class="day-header">
        <span class="day-header-title">${day.dayLabel}</span>
        <span class="day-header-stats">${day.carbsGkg}g CHO/kg &nbsp;·&nbsp; ${day.totalCarbsG}g carbs &nbsp;·&nbsp; ${day.proteinG}g protein &nbsp;·&nbsp; ${day.totalKcal} kcal</span>
      </div>
      <table>${mealsHtml(day.meals)}</table>
      ${day.notes ? `<div style="padding:5px 10px;font-size:10px;color:${BRAND.textMuted};border-top:1px solid #f3f4f6;">${day.notes}</div>` : ''}
    </div>`
  ).join('');

  const caffeineSection = output.caffeine.totalMg > 0 ? `
    <div class="section">
      <div class="section-title">Caffeine Plan</div>
      <div style="display:flex;gap:16px;margin-bottom:10px;">
        <div style="flex:1;border:1.5px solid #fde68a;border-radius:8px;padding:10px 12px;background:#fffbeb;">
          <div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#92400e;margin-bottom:4px;">Total Dose</div>
          <div style="font-family:'Krona One',sans-serif;font-size:18px;color:#b45309;">${output.caffeine.totalMg}<span style="font-size:10px;font-family:'Jost',sans-serif;color:#92400e;margin-left:2px;">mg &nbsp; ${output.caffeine.mgPerKg}mg/kg</span></div>
        </div>
        <div style="flex:1;border:1.5px solid ${BRAND.border};border-radius:8px;padding:10px 12px;background:${BRAND.lightGray};">
          <div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${BRAND.textMuted};margin-bottom:4px;">Pre-Race Dose</div>
          <div style="font-family:'Krona One',sans-serif;font-size:18px;">${output.caffeine.preDoseMg}<span style="font-size:10px;font-family:'Jost',sans-serif;color:${BRAND.textMuted};margin-left:2px;">mg · ${output.caffeine.preDoseMinBeforeStart}min before</span></div>
        </div>
      </div>
      <ul style="padding-left:16px;margin-bottom:8px;">
        ${output.caffeine.sources.map(s => `<li style="font-size:11px;margin-bottom:3px;color:${BRAND.textSecondary};">${s}</li>`).join('')}
      </ul>
      ${output.caffeine.notes ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:8px 12px;font-size:11px;color:#78350f;">${output.caffeine.notes}</div>` : ''}
    </div>` : '';

  const giSection = output.giTraining ? `
    <div class="section">
      <div class="section-title">GI Training Protocol — ${output.giTraining.weeks} Weeks &nbsp; <span style="background:${BRAND.yellow}20;color:#7a6300;border:1px solid ${BRAND.yellow}40;padding:1px 6px;border-radius:12px;font-size:8px;font-weight:600;">Target: ${output.giTraining.targetGH}g/h</span></div>
      <p style="font-size:11px;color:${BRAND.textSecondary};margin-bottom:10px;">${output.giTraining.notes}</p>
      <table>
        <thead><tr>
          <th>Week</th><th>CHO Target</th><th>Duration</th><th>Format</th><th>Notes</th>
        </tr></thead>
        <tbody>
          ${output.giTraining.sessions.map((s, i) => `
          <tr style="background:${i % 2 !== 0 ? '#fafafa' : '#fff'};">
            <td><span style="font-family:'Krona One',sans-serif;font-size:11px;">W${s.week}</span></td>
            <td><span class="pill pill-yellow">${s.intakeGH}g/h</span></td>
            <td>${s.duration}</td>
            <td style="font-size:10.5px;">${s.format}</td>
            <td style="font-size:10px;color:${BRAND.textMuted};">${s.notes}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : '';

  const risksHtml = (risks: RiskFlag[]) => {
    if (risks.length === 0) return `<div class="risk-ok">No significant risk factors identified. Good to go.</div>`;
    return risks.map(r => `
      <div class="risk-warn" style="background:${r.level === 'critical' ? '#fef2f2' : '#fffbeb'};border:1.5px solid ${r.level === 'critical' ? '#fecaca' : '#fde68a'};">
        <span style="font-size:13px;font-weight:800;color:${r.level === 'critical' ? '#dc2626' : '#d97706'};">${r.level === 'critical' ? '!' : '▲'}</span>
        <span style="font-size:11px;color:${r.level === 'critical' ? '#7f1d1d' : '#78350f'};">${r.message}</span>
      </div>`).join('');
  };

  const athleteNotes = (recs?.carbsNote || recs?.hydrationNote || recs?.caffeineNote || recs?.generalNotes) ? `
    <div class="section">
      <div class="section-title">Athlete Notes</div>
      ${recs?.carbsNote ? `<div style="margin-bottom:8px;"><span class="pill pill-yellow" style="margin-right:6px;">Carbohydrates</span><span style="font-size:11.5px;">${recs.carbsNote}</span></div>` : ''}
      ${recs?.hydrationNote ? `<div style="margin-bottom:8px;"><span class="pill pill-blue" style="margin-right:6px;">Hydration</span><span style="font-size:11.5px;">${recs.hydrationNote}</span></div>` : ''}
      ${recs?.caffeineNote ? `<div style="margin-bottom:8px;"><span class="pill pill-amber" style="margin-right:6px;">Caffeine</span><span style="font-size:11.5px;">${recs.caffeineNote}</span></div>` : ''}
      ${recs?.generalNotes ? `<div style="padding:10px 14px;background:${BRAND.lightGray};border-radius:8px;font-size:11.5px;border:1.5px solid ${BRAND.border};">${recs.generalNotes}</div>` : ''}
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${competition.raceName} – Race Plan</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Krona+One&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>${sharedCSS()}</style>
</head>
<body>
<div class="page">

  <!-- ── HEADER ─────────────────────────────────────────────────────────────── -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:16px;border-bottom:2.5px solid ${BRAND.dark};">
    <div style="display:flex;align-items:flex-start;gap:12px;">
      ${logoSVG(32)}
      <div>
        <div style="font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:${BRAND.textMuted};margin-bottom:3px;">Asciende Race Planner</div>
        <h1 style="font-family:'Krona One',sans-serif;font-size:22px;line-height:1.1;color:${BRAND.dark};">${competition.raceName}</h1>
        <p style="font-size:11px;color:${BRAND.textSecondary};margin-top:4px;">${cfg.label} &nbsp;·&nbsp; ${competition.raceData.distance} ${competition.raceData.distanceUnit} (${Math.round(distKm * 10) / 10} km) &nbsp;·&nbsp; ${durationLabel} &nbsp;·&nbsp; ${competition.raceData.temperature}°C / ${competition.raceData.humidity}% RH &nbsp;·&nbsp; Alt. ${competition.raceData.altitude}m</p>
      </div>
    </div>
    <div style="text-align:right;">
      <div style="display:inline-block;background:${BRAND.yellow};border-radius:6px;padding:5px 12px;">
        <div style="font-family:'Krona One',sans-serif;font-size:10px;color:${BRAND.dark};letter-spacing:0.05em;">RACE PLAN</div>
      </div>
      <div style="font-size:10px;color:${BRAND.textMuted};margin-top:4px;">${competition.raceData.raceDate || new Date().toISOString().split('T')[0]}</div>
    </div>
  </div>

  <!-- ── KEY STATS ───────────────────────────────────────────────────────────── -->
  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-label" style="color:#f97316;">Intensity</div>
      <div><span class="stat-value">${output.pacing.intensityPercent}%</span><span class="stat-unit">VO2</span></div>
    </div>
    <div class="stat-card" style="border-color:${BRAND.yellow};background:${BRAND.yellow}08;">
      <div class="stat-label" style="color:#b45309;">Carbs</div>
      <div><span class="stat-value">${output.carbs.recommendedIntakeGH}</span><span class="stat-unit">g/h</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-label" style="color:#2563eb;">Fluid</div>
      <div><span class="stat-value">${output.hydration.fluidIntakeLH}</span><span class="stat-unit">L/h</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-label" style="color:#0d9488;">Sodium</div>
      <div><span class="stat-value">${output.hydration.sodiumMgH}</span><span class="stat-unit">mg/h</span></div>
    </div>
  </div>

  <!-- ── COURSE PROFILE ──────────────────────────────────────────────────────── -->
  ${elevPts.length > 1 ? `
  <div class="section">
    <div class="section-title accent">Course Profile &nbsp;·&nbsp; ${distKm.toFixed(1)} km &nbsp;·&nbsp; +${Math.round(climbTotal)}m gain &nbsp;·&nbsp; ${minElev}–${maxElev}m elevation &nbsp;·&nbsp; ${stationKms.length} aid stations</div>
    <div style="border:1.5px solid ${BRAND.border};border-radius:8px;padding:10px 10px 6px;background:${BRAND.lightGray};">
      ${elevSVG}
      <div style="display:flex;gap:14px;margin-top:4px;justify-content:flex-end;">
        <div style="display:flex;align-items:center;gap:4px;font-size:8.5px;color:${BRAND.textMuted};">
          <div style="width:8px;height:8px;border-radius:50%;background:${BRAND.yellow};"></div> Aid station
        </div>
      </div>
    </div>
  </div>` : ''}

  <!-- ── PACING ──────────────────────────────────────────────────────────────── -->
  <div class="section">
    <div class="section-title">Pacing Strategy</div>
    <div style="display:flex;gap:10px;margin-bottom:10px;">
      <div style="flex:1;border:1.5px solid ${BRAND.border};border-radius:8px;padding:10px 12px;">
        <div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#f97316;margin-bottom:3px;">Target Pace</div>
        <div style="font-family:'Krona One',sans-serif;font-size:18px;">${formatPace(output.pacing.estimatedPaceMinKm)}<span style="font-size:10px;font-family:'Jost',sans-serif;color:${BRAND.textMuted};margin-left:4px;">min/km</span></div>
      </div>
      <div style="flex:1;border:1.5px solid ${BRAND.border};border-radius:8px;padding:10px 12px;">
        <div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${BRAND.textMuted};margin-bottom:3px;">Intensity Zone</div>
        <div style="font-family:'Krona One',sans-serif;font-size:14px;color:#f97316;">${output.pacing.intensityZone}</div>
      </div>
      <div style="flex:2;border:1.5px solid ${BRAND.border};border-radius:8px;padding:10px 12px;">
        <div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${BRAND.textMuted};margin-bottom:3px;">Recommendation</div>
        <div style="font-size:11px;color:${BRAND.textSecondary};line-height:1.4;">${recs?.pacingNote || output.pacing.recommendation}</div>
      </div>
    </div>
  </div>

  <!-- ── RACE EXECUTION TABLE ────────────────────────────────────────────────── -->
  <div class="section">
    <div class="section-title">Race Execution Plan</div>
    <table>
      <thead><tr>
        <th>Time</th>
        <th>Distance</th>
        <th style="color:#b45309;">CHO</th>
        <th style="color:#1d4ed8;">Fluid</th>
        <th style="color:#0d9488;">Sodium</th>
        <th>Caffeine Note</th>
      </tr></thead>
      <tbody>${segmentRows}</tbody>
    </table>
    <div style="display:flex;gap:16px;margin-top:8px;padding:8px 10px;background:${BRAND.lightGray};border-radius:6px;">
      <span style="font-size:9.5px;color:${BRAND.textMuted};">TOTALS:</span>
      <span style="font-size:9.5px;"><span style="font-weight:700;color:#b45309;">${output.carbs.totalCarbsG}g</span> CHO</span>
      <span style="font-size:9.5px;"><span style="font-weight:700;color:#1d4ed8;">${output.hydration.totalFluidL}L</span> fluid</span>
      <span style="font-size:9.5px;"><span style="font-weight:700;color:#0d9488;">${output.hydration.totalSodiumMg}mg</span> sodium</span>
      ${output.caffeine.totalMg > 0 ? `<span style="font-size:9.5px;"><span style="font-weight:700;color:#92400e;">${output.caffeine.totalMg}mg</span> caffeine</span>` : ''}
    </div>
  </div>

  <!-- ── CAFFEINE ─────────────────────────────────────────────────────────────── -->
  ${caffeineSection}

  <!-- ── PRE-COMPETITION ─────────────────────────────────────────────────────── -->
  <div class="section">
    <div class="section-title">Pre-Competition Nutrition &nbsp; <span style="background:#ccfbf1;color:#0f766e;border:1px solid #99f6e4;padding:1px 6px;border-radius:12px;font-size:8px;font-weight:600;">${output.preComp.choLoadingDays > 0 ? `${output.preComp.choLoadingDays}-day CHO load` : 'Pre-race meal'}</span></div>
    <p style="font-size:11px;color:${BRAND.textSecondary};margin-bottom:12px;">${output.preComp.notes}</p>
    ${preCompDays}
    <div style="border:1.5px solid ${BRAND.yellow};border-radius:8px;padding:10px 14px;background:${BRAND.yellow}0a;display:flex;justify-content:space-between;align-items:flex-start;margin-top:6px;">
      <div>
        <div style="font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#b45309;margin-bottom:3px;">Race Morning Breakfast &nbsp;·&nbsp; ${output.preComp.raceBreakfast.timingBeforeStart}</div>
        <p style="font-size:11px;color:${BRAND.textSecondary};line-height:1.4;">${output.preComp.raceBreakfast.description}</p>
      </div>
      <div style="text-align:right;margin-left:16px;flex-shrink:0;">
        <div style="font-family:'Krona One',sans-serif;font-size:20px;color:#b45309;">${output.preComp.raceBreakfast.carbsG}g</div>
        <div style="font-size:9px;color:${BRAND.textMuted};">carbs</div>
      </div>
    </div>
  </div>

  <!-- ── GI TRAINING ─────────────────────────────────────────────────────────── -->
  ${giSection}

  <!-- ── RISK FLAGS ──────────────────────────────────────────────────────────── -->
  <div class="section">
    <div class="section-title">Risk Analysis</div>
    ${risksHtml(output.risks)}
  </div>

  <!-- ── ATHLETE NOTES ───────────────────────────────────────────────────────── -->
  ${athleteNotes}

  <!-- ── FOOTER ──────────────────────────────────────────────────────────────── -->
  <div class="footer">
    <div style="display:flex;align-items:center;gap:6px;">
      ${logoSVG(14)}
      <span>Generated by Asciende Race Planner &nbsp;·&nbsp; ${new Date().toLocaleDateString('en-GB')}</span>
    </div>
    <span>${competition.raceName} &nbsp;·&nbsp; ${cfg.label}</span>
  </div>

</div>
</body>
</html>`;
}

// ─── Cue Card ─────────────────────────────────────────────────────────────────
export function generateCueCardHTML(competition: Competition, editablePlan?: EditablePlan): string {
  const output = competition.strategyOutput as StrategyOutput;
  const segments = editablePlan?.segments ?? buildSegments(competition, output);
  const durationLabel = formatDuration(competition.raceData.expectedDurationMin);

  const segRows = segments.map((s, i) => {
    const hasCaf = !!s.caffeineNote;
    return `<tr style="background:${hasCaf ? '#fffbeb' : i % 2 === 0 ? '#fff' : '#fafafa'};">
      <td style="font-family:'Krona One',sans-serif;font-size:10px;white-space:nowrap;border-bottom:1px solid #f0f0f0;padding:5px 8px;">${formatDuration(s.timeMin)}</td>
      <td style="font-size:9.5px;color:${BRAND.textMuted};border-bottom:1px solid #f0f0f0;padding:5px 8px;">${s.distanceKm}km</td>
      <td style="font-weight:700;font-size:11px;color:#b45309;border-bottom:1px solid #f0f0f0;padding:5px 8px;">${s.choG}g</td>
      <td style="font-size:10px;color:#1d4ed8;border-bottom:1px solid #f0f0f0;padding:5px 8px;">${s.fluidMl}mL</td>
      <td style="font-size:10px;color:#0d9488;border-bottom:1px solid #f0f0f0;padding:5px 8px;">${s.sodiumMg}mg</td>
      <td style="font-size:9px;font-weight:${hasCaf ? '700' : '400'};color:${hasCaf ? '#92400e' : '#ddd'};border-bottom:1px solid #f0f0f0;padding:5px 8px;">${s.caffeineNote || ''}</td>
    </tr>`;
  }).join('');

  const warnings = output.risks.filter(r => r.level === 'critical');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${competition.raceName} – Cue Card</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Krona+One&family=Jost:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Krona+One&family=Jost:wght@400;600;700&display=swap');
    @page { size: A5 landscape; margin: 6mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Jost', sans-serif; color: #111; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  </style>
</head>
<body>
<div style="border:2.5px solid ${BRAND.dark};border-radius:10px;padding:10px 12px;height:calc(100vh - 12mm);display:flex;flex-direction:column;">

  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:7px;border-bottom:2px solid ${BRAND.dark};">
    <div style="display:flex;align-items:center;gap:8px;">
      ${logoSVG(20)}
      <div>
        <div style="font-family:'Krona One',sans-serif;font-size:14px;line-height:1.1;">${competition.raceName}</div>
        <div style="font-size:9px;color:${BRAND.textMuted};margin-top:2px;">${competition.raceData.distance} ${competition.raceData.distanceUnit} &nbsp;·&nbsp; ${durationLabel} &nbsp;·&nbsp; ${competition.raceData.temperature}°C</div>
      </div>
    </div>
    <div style="display:flex;gap:8px;align-items:center;">
      <div style="text-align:center;border:1.5px solid ${BRAND.yellow};border-radius:6px;padding:5px 10px;background:${BRAND.yellow}10;">
        <div style="font-size:8px;font-weight:700;text-transform:uppercase;color:#b45309;margin-bottom:1px;">CHO</div>
        <div style="font-family:'Krona One',sans-serif;font-size:14px;color:#b45309;">${output.carbs.recommendedIntakeGH}<span style="font-size:9px;font-family:'Jost',sans-serif;">g/h</span></div>
      </div>
      <div style="text-align:center;border:1.5px solid #bfdbfe;border-radius:6px;padding:5px 10px;background:#eff6ff;">
        <div style="font-size:8px;font-weight:700;text-transform:uppercase;color:#1d4ed8;margin-bottom:1px;">Fluid</div>
        <div style="font-family:'Krona One',sans-serif;font-size:14px;color:#1d4ed8;">${output.hydration.fluidIntakeLH}<span style="font-size:9px;font-family:'Jost',sans-serif;">L/h</span></div>
      </div>
      <div style="text-align:center;border:1.5px solid #99f6e4;border-radius:6px;padding:5px 10px;background:#f0fdfa;">
        <div style="font-size:8px;font-weight:700;text-transform:uppercase;color:#0f766e;margin-bottom:1px;">Sodium</div>
        <div style="font-family:'Krona One',sans-serif;font-size:14px;color:#0d9488;">${output.hydration.sodiumMgH}<span style="font-size:9px;font-family:'Jost',sans-serif;">mg/h</span></div>
      </div>
      <div style="text-align:center;border:1.5px solid ${BRAND.border};border-radius:6px;padding:5px 10px;background:#f9fafb;">
        <div style="font-size:8px;font-weight:700;text-transform:uppercase;color:${BRAND.textMuted};margin-bottom:1px;">Pace</div>
        <div style="font-family:'Krona One',sans-serif;font-size:14px;">${formatPace(output.pacing.estimatedPaceMinKm)}<span style="font-size:9px;font-family:'Jost',sans-serif;color:${BRAND.textMuted};">'/km</span></div>
      </div>
    </div>
  </div>

  <!-- Body -->
  <div style="display:grid;grid-template-columns:1fr auto;gap:10px;flex:1;min-height:0;">
    <div style="overflow:hidden;">
      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <thead>
          <tr style="background:${BRAND.dark};color:#fff;">
            <th style="padding:5px 8px;text-align:left;font-family:'Krona One',sans-serif;font-size:9px;letter-spacing:.05em;font-weight:400;">TIME</th>
            <th style="padding:5px 8px;text-align:left;font-family:'Krona One',sans-serif;font-size:9px;letter-spacing:.05em;font-weight:400;">KM</th>
            <th style="padding:5px 8px;text-align:left;font-family:'Krona One',sans-serif;font-size:9px;letter-spacing:.05em;font-weight:400;color:${BRAND.yellow};">CHO</th>
            <th style="padding:5px 8px;text-align:left;font-family:'Krona One',sans-serif;font-size:9px;letter-spacing:.05em;font-weight:400;color:#93c5fd;">FLUID</th>
            <th style="padding:5px 8px;text-align:left;font-family:'Krona One',sans-serif;font-size:9px;letter-spacing:.05em;font-weight:400;color:#5eead4;">Na</th>
            <th style="padding:5px 8px;text-align:left;font-family:'Krona One',sans-serif;font-size:9px;letter-spacing:.05em;font-weight:400;color:#fde68a;">CAFFEINE</th>
          </tr>
        </thead>
        <tbody>${segRows}</tbody>
      </table>
    </div>

    <div style="min-width:110px;display:flex;flex-direction:column;gap:6px;">
      ${output.caffeine.totalMg > 0 ? `
      <div style="border:1.5px solid #fde68a;border-radius:6px;padding:7px 9px;background:#fffbeb;">
        <div style="font-size:8px;font-weight:700;text-transform:uppercase;color:#92400e;margin-bottom:3px;">Caffeine</div>
        <div style="font-family:'Krona One',sans-serif;font-size:14px;color:#b45309;">${output.caffeine.totalMg}<span style="font-size:8px;font-family:'Jost',sans-serif;">mg total</span></div>
        <div style="font-size:8px;color:#92400e;margin-top:2px;">Pre: ${output.caffeine.preDoseMg}mg (${output.caffeine.preDoseMinBeforeStart}min)</div>
      </div>` : ''}
      ${warnings.length > 0 ? `
      <div style="border:2px solid #dc2626;border-radius:6px;padding:7px 9px;background:#fef2f2;">
        <div style="font-size:8px;font-weight:800;color:#dc2626;margin-bottom:3px;">ALERTS</div>
        ${warnings.map(w => `<div style="font-size:8.5px;color:#7f1d1d;margin-bottom:2px;">${w.message}</div>`).join('')}
      </div>` : ''}
      <div style="border:1.5px solid ${BRAND.border};border-radius:6px;padding:7px 9px;background:#f9fafb;margin-top:auto;">
        <div style="font-size:8px;color:${BRAND.textMuted};margin-bottom:2px;">TOTALS</div>
        <div style="font-size:9.5px;font-weight:700;color:#b45309;">${output.carbs.totalCarbsG}g CHO</div>
        <div style="font-size:9.5px;color:#1d4ed8;">${output.hydration.totalFluidL}L fluid</div>
        <div style="font-size:9.5px;color:#0d9488;">${output.hydration.totalSodiumMg}mg Na</div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div style="border-top:1px solid ${BRAND.border};padding-top:5px;margin-top:6px;display:flex;justify-content:space-between;font-size:8.5px;color:${BRAND.textMuted};align-items:center;">
    <div style="display:flex;align-items:center;gap:4px;">${logoSVG(12)} Asciende Race Planner</div>
    <span>${competition.raceName} &nbsp;·&nbsp; ${durationLabel}</span>
  </div>

</div>
</body>
</html>`;
}

export function printFullReport(competition: Competition, editablePlan?: EditablePlan): void {
  const html = generateFullReportHTML(competition, editablePlan);
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.onload = () => win.print();
}

export function printCueCard(competition: Competition, editablePlan?: EditablePlan): void {
  const html = generateCueCardHTML(competition, editablePlan);
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.onload = () => win.print();
}
