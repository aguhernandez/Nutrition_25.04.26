import { useState, useRef, useCallback } from 'react';
import type { ElevationPoint, HydrationStation } from '../../../types/race';
import { usePreferences } from '../../../lib/preferences';

interface Props {
  elevationPoints: ElevationPoint[];
  hydrationStations: HydrationStation[];
  distanceKm: number;
  totalElevationGainM: number;
}

const W = 900;
const H = 260;
const PAD = { top: 20, right: 24, bottom: 48, left: 52 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

function buildPath(points: ElevationPoint[], minElev: number, maxElev: number): string {
  if (points.length < 2) return '';
  const elevRange = maxElev - minElev || 1;
  const kmMax = points[points.length - 1].km || 1;

  const toX = (km: number) => PAD.left + (km / kmMax) * PLOT_W;
  const toY = (e: number) => PAD.top + PLOT_H - ((e - minElev) / elevRange) * PLOT_H;

  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.km).toFixed(1)},${toY(p.elevationM).toFixed(1)}`)
    .join(' ');

  const last = points[points.length - 1];
  const first = points[0];
  return `${d} L${toX(last.km).toFixed(1)},${(PAD.top + PLOT_H).toFixed(1)} L${toX(first.km).toFixed(1)},${(PAD.top + PLOT_H).toFixed(1)} Z`;
}

function getGradientSegments(points: ElevationPoint[]): { start: number; end: number; grade: number }[] {
  const segments: { start: number; end: number; grade: number }[] = [];
  const windowSize = Math.max(5, Math.floor(points.length / 20));
  for (let i = 0; i < points.length - windowSize; i += windowSize) {
    const a = points[i];
    const b = points[Math.min(i + windowSize, points.length - 1)];
    const distM = (b.km - a.km) * 1000;
    const grade = distM > 0 ? ((b.elevationM - a.elevationM) / distM) * 100 : 0;
    segments.push({ start: a.km, end: b.km, grade });
  }
  return segments;
}

export default function ElevationProfile({ elevationPoints, hydrationStations, distanceKm, totalElevationGainM }: Props) {
  const { theme } = usePreferences();
  const isDark = theme === 'dark';

  const [tooltip, setTooltip] = useState<{ x: number; y: number; km: number; elev: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const minElev = Math.min(...elevationPoints.map((p) => p.elevationM));
  const maxElev = Math.max(...elevationPoints.map((p) => p.elevationM));
  const elevRange = maxElev - minElev || 1;
  const kmMax = distanceKm;

  const toX = (km: number) => PAD.left + (km / kmMax) * PLOT_W;
  const toY = (e: number) => PAD.top + PLOT_H - ((e - minElev) / elevRange) * PLOT_H;

  const fillPath = buildPath(elevationPoints, minElev, maxElev);
  const gradientSegments = getGradientSegments(elevationPoints);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const km = ((svgX - PAD.left) / PLOT_W) * kmMax;
    if (km < 0 || km > kmMax) { setTooltip(null); return; }
    const nearest = elevationPoints.reduce((best, p) =>
      Math.abs(p.km - km) < Math.abs(best.km - km) ? p : best
    , elevationPoints[0]);
    if (!nearest) return;
    setTooltip({ x: toX(nearest.km), y: toY(nearest.elevationM), km: nearest.km, elev: nearest.elevationM });
  }, [elevationPoints, kmMax]);

  const yTicks = 5;
  const yTickStep = Math.ceil(elevRange / yTicks / 50) * 50;

  const climbSegments = gradientSegments.filter((s) => s.grade >= 4);
  const descentSegments = gradientSegments.filter((s) => s.grade <= -4);

  // Theme colors
  const gridStroke = isDark ? '#374151' : '#e5e7eb';
  const tickTextFill = isDark ? '#6b7280' : '#9ca3af';
  const axisLabelFill = isDark ? '#6b7280' : '#9ca3af';
  const svgBg = isDark ? '#111827' : '#f8fafc';
  const tooltipBg = isDark ? '#111827' : '#ffffff';
  const tooltipBorder = isDark ? '#374151' : '#e5e7eb';
  const tooltipTextFill = isDark ? '#e5e7eb' : '#1f2937';
  const legendTextColor = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-6 mb-3 px-1 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-red-400 to-orange-400 opacity-80" />
          <span className={`text-xs ${legendTextColor}`}>Climb (&gt;4%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-sky-400 to-blue-400 opacity-80" />
          <span className={`text-xs ${legendTextColor}`}>Descent (&lt;-4%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-cyan-400" />
          <span className={`text-xs ${legendTextColor}`}>Water only</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className={`text-xs ${legendTextColor}`}>Water + Food</span>
        </div>
        <div className={`ml-auto text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          +{totalElevationGainM}m gain &middot; {maxElev - minElev}m total range
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full rounded-xl"
        style={{ height: 'auto', cursor: 'crosshair', backgroundColor: svgBg }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="elevFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity={isDark ? '0.35' : '0.25'} />
            <stop offset="100%" stopColor="#1e40af" stopOpacity={isDark ? '0.08' : '0.04'} />
          </linearGradient>
          <linearGradient id="climbFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f87171" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="descentFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const elev = minElev + i * yTickStep;
          if (elev > maxElev + yTickStep) return null;
          const y = toY(elev);
          return (
            <g key={i}>
              <line x1={PAD.left} y1={y} x2={PAD.left + PLOT_W} y2={y} stroke={gridStroke} strokeWidth="1" strokeDasharray="4,4" />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill={tickTextFill}>{Math.round(elev)}m</text>
            </g>
          );
        })}

        {/* X axis ticks */}
        {Array.from({ length: Math.min(10, Math.floor(distanceKm / 5)) + 1 }).map((_, i) => {
          const tickInterval = distanceKm <= 15 ? 2 : distanceKm <= 50 ? 5 : distanceKm <= 100 ? 10 : 20;
          const km = i * tickInterval;
          if (km > distanceKm) return null;
          const x = toX(km);
          return (
            <g key={i}>
              <line x1={x} y1={PAD.top + PLOT_H} x2={x} y2={PAD.top + PLOT_H + 5} stroke={isDark ? '#4b5563' : '#d1d5db'} strokeWidth="1" />
              <text x={x} y={PAD.top + PLOT_H + 18} textAnchor="middle" fontSize="11" fill={tickTextFill}>{km}km</text>
            </g>
          );
        })}

        {/* Main area fill */}
        <path d={fillPath} fill="url(#elevFill)" />

        {/* Climb overlays */}
        {climbSegments.map((seg, i) => {
          const pts = elevationPoints.filter((p) => p.km >= seg.start && p.km <= seg.end);
          if (pts.length < 2) return null;
          const segPath = buildPath(pts, minElev, maxElev);
          return <path key={`climb-${i}`} d={segPath} fill="url(#climbFill)" />;
        })}

        {/* Descent overlays */}
        {descentSegments.map((seg, i) => {
          const pts = elevationPoints.filter((p) => p.km >= seg.start && p.km <= seg.end);
          if (pts.length < 2) return null;
          const segPath = buildPath(pts, minElev, maxElev);
          return <path key={`desc-${i}`} d={segPath} fill="url(#descentFill)" />;
        })}

        {/* Elevation line */}
        <polyline
          points={elevationPoints.map((p) => `${toX(p.km).toFixed(1)},${toY(p.elevationM).toFixed(1)}`).join(' ')}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Hydration station markers */}
        {hydrationStations.map((station) => {
          const nearestPoint = elevationPoints.reduce((best, p) =>
            Math.abs(p.km - station.km) < Math.abs(best.km - station.km) ? p : best
          , elevationPoints[0]);
          const x = toX(station.km);
          const y = nearestPoint ? toY(nearestPoint.elevationM) : PAD.top + PLOT_H;
          const color = station.hasFood ? '#34d399' : '#22d3ee';
          return (
            <g key={station.id}>
              <line x1={x} y1={y - 2} x2={x} y2={PAD.top + PLOT_H} stroke={color} strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.5" />
              <circle cx={x} cy={y - 2} r="5" fill={color} fillOpacity="0.9" stroke={isDark ? '#1f2937' : '#ffffff'} strokeWidth="1.5" />
              <text x={x} y={PAD.top + PLOT_H + 32} textAnchor="middle" fontSize="9" fill={color} fontWeight="600">
                {station.km}
              </text>
            </g>
          );
        })}

        {/* Tooltip crosshair */}
        {tooltip && (
          <g>
            <line x1={tooltip.x} y1={PAD.top} x2={tooltip.x} y2={PAD.top + PLOT_H} stroke={isDark ? '#9ca3af' : '#9ca3af'} strokeWidth="1" strokeDasharray="4,3" />
            <circle cx={tooltip.x} cy={tooltip.y} r="4" fill="#60a5fa" stroke={isDark ? '#1f2937' : '#ffffff'} strokeWidth="2" />
            <rect x={tooltip.x + 8} y={tooltip.y - 22} width="80" height="28" rx="6" fill={tooltipBg} fillOpacity="0.97" stroke={tooltipBorder} strokeWidth="1" />
            <text x={tooltip.x + 48} y={tooltip.y - 11} textAnchor="middle" fontSize="11" fill={tooltipTextFill} fontWeight="600">{tooltip.km.toFixed(1)} km</text>
            <text x={tooltip.x + 48} y={tooltip.y + 2} textAnchor="middle" fontSize="11" fill="#60a5fa">{tooltip.elev}m</text>
          </g>
        )}

        {/* Axis labels */}
        <text x={PAD.left + PLOT_W / 2} y={H - 2} textAnchor="middle" fontSize="11" fill={axisLabelFill}>Distance (km)</text>
        <text x={14} y={PAD.top + PLOT_H / 2} textAnchor="middle" fontSize="11" fill={axisLabelFill} transform={`rotate(-90, 14, ${PAD.top + PLOT_H / 2})`}>Elevation (m)</text>
      </svg>
    </div>
  );
}
