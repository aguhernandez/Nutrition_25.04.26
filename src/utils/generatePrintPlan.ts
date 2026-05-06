import type { Competition, StrategyOutput, DayMeal, RiskFlag, CaffeineDose } from '../types/race';
import type { EditablePlan, EditableSegment } from '../types/editablePlan';
import { getSportConfig } from '../config/sports';

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

export function buildSegments(competition: Competition, output: StrategyOutput): EditableSegment[] {
  const { raceData } = competition;
  const { carbs, hydration, caffeine } = output;
  const totalMin = raceData.expectedDurationMin;
  const distKm = raceData.distanceUnit === 'miles' ? raceData.distance * 1.60934 : raceData.distance;
  const interval = getTimeInterval(totalMin);
  const segments: Segment[] = [];

  const choPerInterval = (carbs.recommendedIntakeGH / 60) * interval;
  const fluidPerInterval = (hydration.fluidIntakeLH * 1000 / 60) * interval;
  const sodiumPerInterval = (hydration.sodiumMgH / 60) * interval;

  const caffeineEvents: Map<number, string> = new Map();
  if (caffeine.totalMg > 0) {
    const preMin = -caffeine.preDoseMinBeforeStart;
    caffeineEvents.set(preMin, `Pre-race: ${caffeine.preDoseMg}mg caffeine`);
    caffeine.midRaceDoses.forEach((dose: CaffeineDose) => {
      const key = Math.round(dose.timingMin / interval) * interval;
      caffeineEvents.set(key, `${dose.label}: ${dose.mg}mg caffeine`);
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

function mealsHtml(meals: DayMeal[]): string {
  return meals
    .map(
      (m) =>
        `<tr>
          <td style="padding:4px 8px;color:#555;font-size:11px;white-space:nowrap;">${m.timing}</td>
          <td style="padding:4px 8px;font-size:12px;">${m.description}</td>
          <td style="padding:4px 8px;text-align:right;font-weight:700;color:#b45309;font-size:12px;">${m.carbsG}g</td>
        </tr>`
    )
    .join('');
}

function risksHtml(risks: RiskFlag[]): string {
  if (risks.length === 0)
    return `<p style="color:#166534;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:10px 14px;font-size:12px;margin:0;">No significant risk factors identified.</p>`;
  return risks
    .map(
      (r) =>
        `<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 14px;border-radius:6px;margin-bottom:6px;background:${r.level === 'critical' ? '#fef2f2' : '#fffbeb'};border:1px solid ${r.level === 'critical' ? '#fecaca' : '#fde68a'};">
          <span style="font-weight:800;color:${r.level === 'critical' ? '#dc2626' : '#d97706'};font-size:13px;">${r.level === 'critical' ? '!' : '▲'}</span>
          <span style="font-size:12px;color:${r.level === 'critical' ? '#7f1d1d' : '#78350f'};">${r.message}</span>
        </div>`
    )
    .join('');
}

export function generateFullReportHTML(competition: Competition, editablePlan?: EditablePlan): string {
  const output = competition.strategyOutput as StrategyOutput;
  const cfg = getSportConfig(competition.sport);
  const segments = editablePlan?.segments ?? buildSegments(competition, output);
  const recs = editablePlan?.recommendations;
  const durationLabel = formatDuration(competition.raceData.expectedDurationMin);
  const distKm = competition.raceData.distanceUnit === 'miles'
    ? competition.raceData.distance * 1.60934
    : competition.raceData.distance;

  const segmentRows = segments
    .map(
      (s) =>
        `<tr style="${s.caffeineNote ? 'background:#fffbeb;' : ''}">
          <td style="padding:6px 10px;font-weight:700;white-space:nowrap;">${formatDuration(s.timeMin)}</td>
          <td style="padding:6px 10px;color:#555;">${s.distanceKm} km</td>
          <td style="padding:6px 10px;font-weight:700;color:#b45309;">${s.choG}g</td>
          <td style="padding:6px 10px;color:#1d4ed8;">${s.fluidMl}mL</td>
          <td style="padding:6px 10px;color:#0d9488;">${s.sodiumMg}mg</td>
          <td style="padding:6px 10px;font-size:11px;color:${s.caffeineNote ? '#92400e' : '#aaa'};">${s.caffeineNote || '—'}</td>
        </tr>`
    )
    .join('');

  const preCompDays = output.preComp.plan
    .map(
      (day) =>
        `<div style="margin-bottom:16px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <div style="display:flex;justify-content:space-between;align-items:center;background:#f9fafb;padding:8px 14px;border-bottom:1px solid #e5e7eb;">
            <span style="font-weight:700;font-size:13px;">${day.dayLabel}</span>
            <span style="font-size:12px;color:#555;">${day.totalCarbsG}g carbs · ${day.proteinG}g protein · ${day.totalKcal} kcal</span>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            ${mealsHtml(day.meals)}
          </table>
          ${day.notes ? `<p style="font-size:11px;color:#9ca3af;padding:6px 14px;margin:0;border-top:1px solid #f3f4f6;">${day.notes}</p>` : ''}
        </div>`
    )
    .join('');

  const giSection = output.giTraining
    ? `<div style="margin-bottom:20px;">
        <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#9f1239;margin:0 0 8px 0;border-bottom:2px solid #9f1239;padding-bottom:4px;">GI Training Protocol – ${output.giTraining.weeks} Weeks</h2>
        <p style="font-size:12px;color:#555;margin:0 0 10px 0;">${output.giTraining.notes}</p>
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead>
            <tr style="background:#f9fafb;"><th style="padding:6px 10px;text-align:left;">Week</th><th style="padding:6px 10px;text-align:left;">CHO Target</th><th style="padding:6px 10px;text-align:left;">Duration</th><th style="padding:6px 10px;text-align:left;">Format</th><th style="padding:6px 10px;text-align:left;">Notes</th></tr>
          </thead>
          <tbody>
            ${output.giTraining.sessions.map((s) => `<tr><td style="padding:5px 10px;">W${s.week}</td><td style="padding:5px 10px;font-weight:700;color:#9f1239;">${s.intakeGH}g/h</td><td style="padding:5px 10px;">${s.duration}</td><td style="padding:5px 10px;">${s.format}</td><td style="padding:5px 10px;color:#6b7280;">${s.notes}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>`
    : '';

  const caffeineSection = output.caffeine.totalMg > 0
    ? `<div style="margin-bottom:20px;">
        <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#92400e;margin:0 0 8px 0;border-bottom:2px solid #d97706;padding-bottom:4px;">Caffeine Plan</h2>
        <p style="font-size:12px;color:#555;margin:0 0 8px 0;">Total: <strong>${output.caffeine.totalMg}mg</strong> (${output.caffeine.mgPerKg}mg/kg) · Pre-race dose: <strong>${output.caffeine.preDoseMg}mg</strong>, ${output.caffeine.preDoseMinBeforeStart}min before start</p>
        <ul style="margin:0 0 8px 0;padding-left:18px;">
          ${output.caffeine.sources.map((s) => `<li style="font-size:12px;margin-bottom:3px;">${s}</li>`).join('')}
        </ul>
        ${output.caffeine.notes ? `<p style="font-size:11px;color:#78350f;background:#fffbeb;padding:8px 12px;border-radius:6px;margin:0;">${output.caffeine.notes}</p>` : ''}
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${competition.raceName} – Race Plan</title>
  <style>
    @page { size: A4; margin: 15mm 12mm; }
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; font-size: 13px; line-height: 1.5; margin: 0; }
    table { border-collapse: collapse; width: 100%; }
    thead tr { background: #f3f4f6; }
    th { text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; }
    tbody tr:nth-child(even) { background: #fafafa; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;padding-bottom:12px;border-bottom:3px solid #111;">
    <div>
      <h1 style="font-size:22px;font-weight:800;margin:0 0 4px 0;">${competition.raceName}</h1>
      <p style="font-size:13px;color:#555;margin:0;">${cfg.label} · ${competition.raceData.distance} ${competition.raceData.distanceUnit} (${Math.round(distKm * 10) / 10} km) · ${durationLabel} · ${competition.raceData.temperature}°C / ${competition.raceData.humidity}% RH · Alt. ${competition.raceData.altitude}m</p>
    </div>
    <div style="text-align:right;font-size:11px;color:#9ca3af;">
      <div style="font-weight:700;font-size:13px;color:#111;">Race Plan</div>
      <div>${competition.raceData.raceDate || ''}</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:20px;">
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#f97316;font-weight:700;margin-bottom:2px;">Intensity</div>
      <div style="font-size:20px;font-weight:800;">${output.pacing.intensityPercent}%<span style="font-size:11px;color:#9ca3af;"> VO2</span></div>
    </div>
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#d97706;font-weight:700;margin-bottom:2px;">Carbs</div>
      <div style="font-size:20px;font-weight:800;">${output.carbs.recommendedIntakeGH}<span style="font-size:11px;color:#9ca3af;"> g/h</span></div>
    </div>
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#2563eb;font-weight:700;margin-bottom:2px;">Fluid</div>
      <div style="font-size:20px;font-weight:800;">${output.hydration.fluidIntakeLH}<span style="font-size:11px;color:#9ca3af;"> L/h</span></div>
    </div>
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#0d9488;font-weight:700;margin-bottom:2px;">Sodium</div>
      <div style="font-size:20px;font-weight:800;">${output.hydration.sodiumMgH}<span style="font-size:11px;color:#9ca3af;"> mg/h</span></div>
    </div>
  </div>

  <div style="margin-bottom:20px;">
    <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#111;margin:0 0 8px 0;border-bottom:2px solid #111;padding-bottom:4px;">Pacing</h2>
    <p style="font-size:12px;color:#555;margin:0 0 6px 0;">Target pace: <strong>${formatPace(output.pacing.estimatedPaceMinKm)} min/km</strong> · Zone: <strong>${output.pacing.intensityZone}</strong></p>
    <p style="font-size:12px;color:#333;margin:0;">${recs?.pacingNote || output.pacing.recommendation}</p>
  </div>

  <div style="margin-bottom:20px;">
    <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#111;margin:0 0 8px 0;border-bottom:2px solid #111;padding-bottom:4px;">Race Execution Plan</h2>
    <table style="font-size:12px;">
      <thead>
        <tr>
          <th style="padding:6px 10px;">Time</th>
          <th style="padding:6px 10px;">Distance</th>
          <th style="padding:6px 10px;color:#b45309;">CHO</th>
          <th style="padding:6px 10px;color:#1d4ed8;">Fluid</th>
          <th style="padding:6px 10px;color:#0d9488;">Sodium</th>
          <th style="padding:6px 10px;">Caffeine</th>
        </tr>
      </thead>
      <tbody>
        ${segmentRows}
      </tbody>
    </table>
    <p style="font-size:10px;color:#9ca3af;margin:6px 0 0 0;">Values shown are cumulative totals per interval. Total: ${output.carbs.totalCarbsG}g CHO · ${output.hydration.totalFluidL}L fluid · ${output.hydration.totalSodiumMg}mg sodium</p>
  </div>

  ${caffeineSection}

  <div style="margin-bottom:20px;">
    <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#0f766e;margin:0 0 8px 0;border-bottom:2px solid #0d9488;padding-bottom:4px;">Pre-Competition Nutrition</h2>
    <p style="font-size:12px;color:#555;margin:0 0 10px 0;">${output.preComp.notes}</p>
    ${preCompDays}
    <div style="border:1px solid #d1fae5;border-radius:8px;padding:10px 14px;background:#f0fdf4;">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#065f46;font-weight:700;margin-bottom:4px;">Race Morning Breakfast · ${output.preComp.raceBreakfast.timingBeforeStart}</div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <p style="font-size:12px;margin:0;flex:1;">${output.preComp.raceBreakfast.description}</p>
        <span style="font-size:16px;font-weight:800;color:#b45309;margin-left:16px;">${output.preComp.raceBreakfast.carbsG}g</span>
      </div>
    </div>
  </div>

  ${giSection}

  <div style="margin-bottom:20px;">
    <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#b91c1c;margin:0 0 8px 0;border-bottom:2px solid #b91c1c;padding-bottom:4px;">Risk Flags</h2>
    ${risksHtml(output.risks)}
  </div>

  ${(recs?.carbsNote || recs?.hydrationNote || recs?.caffeineNote || recs?.generalNotes)
    ? `<div style="margin-bottom:20px;">
        <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#374151;margin:0 0 8px 0;border-bottom:2px solid #374151;padding-bottom:4px;">Athlete Notes</h2>
        ${recs?.carbsNote ? `<div style="margin-bottom:8px;"><span style="font-size:10px;font-weight:700;text-transform:uppercase;color:#b45309;">Carbohydrates:</span> <span style="font-size:12px;">${recs.carbsNote}</span></div>` : ''}
        ${recs?.hydrationNote ? `<div style="margin-bottom:8px;"><span style="font-size:10px;font-weight:700;text-transform:uppercase;color:#1d4ed8;">Hydration:</span> <span style="font-size:12px;">${recs.hydrationNote}</span></div>` : ''}
        ${recs?.caffeineNote ? `<div style="margin-bottom:8px;"><span style="font-size:10px;font-weight:700;text-transform:uppercase;color:#92400e;">Caffeine:</span> <span style="font-size:12px;">${recs.caffeineNote}</span></div>` : ''}
        ${recs?.generalNotes ? `<div style="padding:10px 14px;background:#f9fafb;border-radius:6px;font-size:12px;border:1px solid #e5e7eb;">${recs.generalNotes}</div>` : ''}
      </div>`
    : ''}

  <div style="border-top:1px solid #e5e7eb;padding-top:8px;display:flex;justify-content:space-between;font-size:10px;color:#9ca3af;">
    <span>Generated by Asciende Race Planner · ${new Date().toLocaleDateString()}</span>
    <span>${competition.raceName} · ${cfg.label}</span>
  </div>
</body>
</html>`;
}

export function generateCueCardHTML(competition: Competition, editablePlan?: EditablePlan): string {
  const output = competition.strategyOutput as StrategyOutput;
  const segments = editablePlan?.segments ?? buildSegments(competition, output);
  const durationLabel = formatDuration(competition.raceData.expectedDurationMin);

  const segRows = segments
    .map(
      (s, i) =>
        `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'};${s.caffeineNote ? 'background:#fef3c7;' : ''}">
          <td style="padding:5px 8px;font-weight:800;font-size:13px;white-space:nowrap;border-bottom:1px solid #e5e7eb;">${formatDuration(s.timeMin)}</td>
          <td style="padding:5px 8px;font-size:11px;color:#6b7280;border-bottom:1px solid #e5e7eb;">${s.distanceKm}km</td>
          <td style="padding:5px 8px;font-weight:800;font-size:13px;color:#b45309;border-bottom:1px solid #e5e7eb;">${s.choG}g</td>
          <td style="padding:5px 8px;font-size:13px;color:#1d4ed8;border-bottom:1px solid #e5e7eb;">${s.fluidMl}mL</td>
          <td style="padding:5px 8px;font-size:11px;color:#0d9488;border-bottom:1px solid #e5e7eb;">${s.sodiumMg}mg Na</td>
          <td style="padding:5px 8px;font-size:11px;font-weight:${s.caffeineNote ? '700' : '400'};color:${s.caffeineNote ? '#92400e' : '#d1d5db'};border-bottom:1px solid #e5e7eb;">${s.caffeineNote || ''}</td>
        </tr>`
    )
    .join('');

  const warnings = output.risks.filter((r) => r.level === 'critical');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${competition.raceName} – Cue Card</title>
  <style>
    @page { size: A5 landscape; margin: 8mm; }
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; margin: 0; background: #fff; }
  </style>
</head>
<body>
  <div style="border:2px solid #111;border-radius:8px;padding:10px 12px;max-width:100%;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid #111;">
      <div>
        <div style="font-size:16px;font-weight:800;line-height:1.1;">${competition.raceName}</div>
        <div style="font-size:10px;color:#555;margin-top:2px;">${competition.raceData.distance} ${competition.raceData.distanceUnit} · ${durationLabel} · ${competition.raceData.temperature}°C</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px;font-weight:700;">TARGET RATE</div>
        <div style="font-size:13px;font-weight:800;color:#b45309;">${output.carbs.recommendedIntakeGH}g CHO/h</div>
        <div style="font-size:13px;font-weight:800;color:#1d4ed8;">${output.hydration.fluidIntakeLH}L fluid/h</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr auto;gap:10px;">
      <table style="border-collapse:collapse;font-size:12px;width:100%;">
        <thead>
          <tr style="background:#111;color:#fff;">
            <th style="padding:5px 8px;text-align:left;font-size:11px;">TIME</th>
            <th style="padding:5px 8px;text-align:left;font-size:11px;">KM</th>
            <th style="padding:5px 8px;text-align:left;font-size:11px;color:#fcd34d;">CHO</th>
            <th style="padding:5px 8px;text-align:left;font-size:11px;color:#93c5fd;">FLUID</th>
            <th style="padding:5px 8px;text-align:left;font-size:11px;color:#5eead4;">Na</th>
            <th style="padding:5px 8px;text-align:left;font-size:11px;color:#fde68a;">CAFFEINE</th>
          </tr>
        </thead>
        <tbody>
          ${segRows}
        </tbody>
      </table>

      <div style="min-width:130px;">
        <div style="border:1px solid #e5e7eb;border-radius:6px;padding:8px;margin-bottom:8px;background:#f9fafb;">
          <div style="font-size:9px;text-transform:uppercase;font-weight:700;color:#6b7280;margin-bottom:4px;">PACE TARGET</div>
          <div style="font-size:18px;font-weight:800;">${formatPace(output.pacing.estimatedPaceMinKm)}</div>
          <div style="font-size:9px;color:#9ca3af;">min/km · ${output.pacing.intensityZone}</div>
        </div>
        <div style="border:1px solid #e5e7eb;border-radius:6px;padding:8px;margin-bottom:8px;background:#f9fafb;">
          <div style="font-size:9px;text-transform:uppercase;font-weight:700;color:#6b7280;margin-bottom:4px;">SODIUM</div>
          <div style="font-size:16px;font-weight:800;color:#0d9488;">${output.hydration.sodiumMgH}</div>
          <div style="font-size:9px;color:#9ca3af;">mg/h · ${Math.round(output.hydration.sodiumMgH * 0.5)}mg/500mL</div>
        </div>
        ${output.caffeine.totalMg > 0
          ? `<div style="border:1px solid #fde68a;border-radius:6px;padding:8px;background:#fffbeb;">
              <div style="font-size:9px;text-transform:uppercase;font-weight:700;color:#92400e;margin-bottom:4px;">CAFFEINE</div>
              <div style="font-size:14px;font-weight:800;color:#b45309;">${output.caffeine.totalMg}mg</div>
              <div style="font-size:9px;color:#78350f;">Pre: ${output.caffeine.preDoseMg}mg (${output.caffeine.preDoseMinBeforeStart}min)</div>
            </div>`
          : ''}
        ${warnings.length > 0
          ? `<div style="border:2px solid #dc2626;border-radius:6px;padding:8px;background:#fef2f2;margin-top:8px;">
              <div style="font-size:9px;font-weight:800;color:#dc2626;margin-bottom:4px;">ALERTS</div>
              ${warnings.map((w) => `<div style="font-size:9px;color:#7f1d1d;margin-bottom:2px;">${w.message}</div>`).join('')}
            </div>`
          : ''}
      </div>
    </div>

    <div style="margin-top:6px;padding-top:6px;border-top:1px solid #e5e7eb;font-size:9px;color:#9ca3af;display:flex;justify-content:space-between;">
      <span>Asciende Race Planner</span>
      <span>Total: ${output.carbs.totalCarbsG}g CHO · ${output.hydration.totalFluidL}L · ${output.hydration.totalSodiumMg}mg Na</span>
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
