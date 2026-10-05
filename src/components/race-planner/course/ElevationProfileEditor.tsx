import { useState, useRef, useCallback, useMemo } from 'react';
import { Plus, Trash2, Upload, Download, Undo2 } from 'lucide-react';
import type { ElevationPoint } from '../../types/race';
import { usePreferences } from '../../../lib/preferences';

interface Props {
  points: ElevationPoint[];
  distanceKm: number;
  onChange: (points: ElevationPoint[]) => void;
}

const W = 900;
const H = 300;
const PAD = { top: 20, right: 24, bottom: 48, left: 52 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

export default function ElevationProfileEditor({ points, distanceKm, onChange }: Props) {
  const { theme } = usePreferences();
  const isDark = theme === 'dark';
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<ElevationPoint[][]>([]);

  const sorted = useMemo(() => [...points].sort((a, b) => a.km - b.km), [points]);

  const minElev = sorted.length > 0 ? Math.min(...sorted.map((p) => p.elevationM)) : 0;
  const maxElev = sorted.length > 0 ? Math.max(...sorted.map((p) => p.elevationM)) : 100;
  const elevRange = maxElev - minElev || 1;
  const kmMax = distanceKm || 1;

  const toX = (km: number) => PAD.left + (km / kmMax) * PLOT_W;
  const toY = (e: number) => PAD.top + PLOT_H - ((e - minElev) / elevRange) * PLOT_H;
  const fromX = (x: number) => ((x - PAD.left) / PLOT_W) * kmMax;
  const fromY = (y: number) => minElev + (1 - (y - PAD.top) / PLOT_H) * elevRange;

  const pushHistory = () => setHistory((h) => [...h, [...sorted]]);
  const undo = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      onChange(prev);
      return h.slice(0, -1);
    });
  };

  const getSvgCoords = useCallback((e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  }, []);

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    pushHistory();
    setDragIndex(index);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const coords = getSvgCoords(e);
    if (!coords) return;
    if (dragIndex !== null) {
      const newKm = Math.max(0, Math.min(kmMax, Math.round(fromX(coords.x) * 100) / 100));
      const newElev = Math.round(fromY(coords.y));
      onChange(sorted.map((p, i) => i === dragIndex ? { ...p, km: newKm, elevationM: newElev } : p));
    } else {
      const km = fromX(coords.x);
      if (km < 0 || km > kmMax) { setHoverIndex(null); return; }
      const nearest = sorted.reduce((best, p, i) =>
        Math.abs(p.km - km) < Math.abs(sorted[best].km - km) ? i : best, 0);
      setHoverIndex(nearest);
    }
  }, [dragIndex, sorted, kmMax, fromX, fromY, onChange]);

  const handleMouseUp = () => setDragIndex(null);
  const handleMouseLeave = () => { setDragIndex(null); setHoverIndex(null); };

  const addPoint = () => {
    pushHistory();
    const lastKm = sorted.length > 0 ? sorted[sorted.length - 1].km : 0;
    const newKm = Math.min(kmMax, Math.round((lastKm + kmMax / 20) * 100) / 100);
    const newElev = sorted.length > 0 ? Math.round((minElev + maxElev) / 2) : 100;
    onChange([...sorted, { km: newKm, elevationM: newElev }]);
  };

  const deletePoint = (index: number) => {
    pushHistory();
    onChange(sorted.filter((_, i) => i !== index));
  };

  const handleCsvImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.txt';
    input.onchange = async (ev) => {
      const file = (ev.target as HTMLInputElement).files?.[0];
      if (!file) return;
      pushHistory();
      const text = await file.text();
      const lines = text.trim().split(/\n/);
      const pts: ElevationPoint[] = [];
      for (const line of lines) {
        const parts = line.split(/[,;\t]/);
        const km = parseFloat(parts[0]);
        const elev = parseFloat(parts[1]);
        if (!isNaN(km) && !isNaN(elev)) pts.push({ km: Math.round(km * 100) / 100, elevationM: Math.round(elev) });
      }
      if (pts.length > 1) onChange(pts.sort((a, b) => a.km - b.km));
    };
    input.click();
  };

  const handleGpxImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.gpx,.xml';
    input.onchange = async (ev) => {
      const file = (ev.target as HTMLInputElement).files?.[0];
      if (!file) return;
      pushHistory();
      const text = await file.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/xml');
      const trkpts = Array.from(doc.getElementsByTagName('trkpt'));
      const pts: ElevationPoint[] = trkpts.map((pt, i) => {
        const ele = pt.getElementsByTagName('ele')[0]?.textContent ?? '0';
        return { km: Math.round((i / Math.max(1, trkpts.length - 1)) * kmMax * 100) / 100, elevationM: Math.round(parseFloat(ele) || 0) };
      }).filter((p) => !isNaN(p.elevationM));
      if (pts.length > 1) onChange(pts);
    };
    input.click();
  };

  const exportCsv = () => {
    const csv = sorted.map((p) => `${p.km},${p.elevationM}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elevation_profile.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const gridStroke = isDark ? '#374151' : '#e5e7eb';
  const tickTextFill = isDark ? '#6b7280' : '#9ca3af';
  const svgBg = isDark ? '#111827' : '#f8fafc';
  const axisLabelFill = isDark ? '#6b7280' : '#9ca3af';
  const btnCls = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all';
  const btnBase = isDark ? 'bg-white/10 text-gray-300 hover:bg-white/15' : 'bg-gray-100 text-gray-600 hover:bg-gray-200';

  const linePath = sorted.length > 1
    ? sorted.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.km).toFixed(1)},${toY(p.elevationM).toFixed(1)}`).join(' ')
    : '';
  const areaPath = sorted.length > 1
    ? `${linePath} L${toX(sorted[sorted.length - 1].km).toFixed(1)},${(PAD.top + PLOT_H).toFixed(1)} L${toX(sorted[0].km).toFixed(1)},${(PAD.top + PLOT_H).toFixed(1)} Z`
    : '';

  const yTicks = 5;
  const yTickStep = Math.ceil(elevRange / yTicks / 50) * 50;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={addPoint} className={`${btnCls} ${btnBase}`}><Plus className="w-3.5 h-3.5" /> Add Point</button>
        <button onClick={handleCsvImport} className={`${btnCls} ${btnBase}`}><Upload className="w-3.5 h-3.5" /> Import CSV</button>
        <button onClick={handleGpxImport} className={`${btnCls} ${btnBase}`}><Upload className="w-3.5 h-3.5" /> Import GPX</button>
        <button onClick={exportCsv} className={`${btnCls} ${btnBase}`}><Download className="w-3.5 h-3.5" /> Export CSV</button>
        <button onClick={undo} disabled={history.length === 0} className={`${btnCls} ${history.length === 0 ? 'opacity-40 cursor-not-allowed' : btnBase}`}><Undo2 className="w-3.5 h-3.5" /> Undo</button>
        <span className={`text-xs ml-auto ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{sorted.length} points · drag dots to edit</span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full rounded-xl"
        style={{ height: 'auto', cursor: dragIndex !== null ? 'grabbing' : 'crosshair', backgroundColor: svgBg }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id="editElevFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity={isDark ? '0.35' : '0.25'} />
            <stop offset="100%" stopColor="#1e40af" stopOpacity={isDark ? '0.08' : '0.04'} />
          </linearGradient>
        </defs>

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

        {areaPath && <path d={areaPath} fill="url(#editElevFill)" />}
        {linePath && <polyline points={sorted.map((p) => `${toX(p.km).toFixed(1)},${toY(p.elevationM).toFixed(1)}`).join(' ')} fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinejoin="round" />}

        {sorted.map((p, i) => (
          <g key={i}>
            <circle
              cx={toX(p.km)}
              cy={toY(p.elevationM)}
              r={dragIndex === i || hoverIndex === i ? 7 : 5}
              fill={dragIndex === i ? '#f59e0b' : hoverIndex === i ? '#60a5fa' : '#3b82f6'}
              fillOpacity={0.9}
              stroke={isDark ? '#1f2937' : '#ffffff'}
              strokeWidth="2"
              style={{ cursor: 'grab' }}
              onMouseDown={handleMouseDown(i)}
            />
            {(hoverIndex === i || dragIndex === i) && (
              <g>
                <rect x={toX(p.km) + 8} y={toY(p.elevationM) - 22} width="84" height="28" rx="6" fill={isDark ? '#111827' : '#ffffff'} fillOpacity="0.97" stroke={isDark ? '#374151' : '#e5e7eb'} strokeWidth="1" />
                <text x={toX(p.km) + 50} y={toY(p.elevationM) - 11} textAnchor="middle" fontSize="11" fill={isDark ? '#e5e7eb' : '#1f2937'} fontWeight="600">{p.km.toFixed(1)} km</text>
                <text x={toX(p.km) + 50} y={toY(p.elevationM) + 2} textAnchor="middle" fontSize="11" fill="#60a5fa">{p.elevationM}m</text>
              </g>
            )}
            {sorted.length > 2 && (
              <text
                x={toX(p.km)}
                y={toY(p.elevationM) - 14}
                textAnchor="middle"
                fontSize="9"
                fill="#ef4444"
                style={{ cursor: 'pointer', opacity: hoverIndex === i ? 1 : 0 }}
                onClick={() => deletePoint(i)}
              >
                <tspan style={{ fontWeight: 700 }}>×</tspan>
              </text>
            )}
          </g>
        ))}

        <text x={PAD.left + PLOT_W / 2} y={H - 2} textAnchor="middle" fontSize="11" fill={axisLabelFill}>Distance (km)</text>
        <text x={14} y={PAD.top + PLOT_H / 2} textAnchor="middle" fontSize="11" fill={axisLabelFill} transform={`rotate(-90, 14, ${PAD.top + PLOT_H / 2})`}>Elevation (m)</text>
      </svg>

      <div className="flex items-center gap-1 text-xs text-red-400">
        <Trash2 className="w-3 h-3" />
        Hover a point and click the × to delete it. Drag any dot to reposition.
      </div>
    </div>
  );
}
