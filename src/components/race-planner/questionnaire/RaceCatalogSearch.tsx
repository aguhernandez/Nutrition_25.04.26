import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Mountain, Clock, X, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { usePreferences } from '../../../lib/preferences';
import type { RaceCatalogEntry, Sport } from '../../../types/race';

interface Props {
  sport: Sport;
  onSelect: (race: RaceCatalogEntry) => void;
}

const MONTH_NAMES = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function RaceCatalogSearch({ sport, onSelect }: Props) {
  const { theme } = usePreferences();
  const isDark = theme === 'dark';

  const [query, setQuery] = useState('');
  const [allRaces, setAllRaces] = useState<RaceCatalogEntry[]>([]);
  const [filtered, setFiltered] = useState<RaceCatalogEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<RaceCatalogEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('races_catalog')
        .select('*')
        .eq('sport', sport)
        .order('name');
      setAllRaces((data as RaceCatalogEntry[]) ?? []);
      setLoading(false);
    })();
  }, [sport]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFiltered(allRaces.slice(0, 8));
    } else {
      setFiltered(
        allRaces
          .filter(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              r.city.toLowerCase().includes(q) ||
              r.country.toLowerCase().includes(q)
          )
          .slice(0, 8)
      );
    }
  }, [query, allRaces]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (race: RaceCatalogEntry) => {
    setSelected(race);
    setQuery(race.name);
    setOpen(false);
    onSelect(race);
  };

  const handleClear = () => {
    setSelected(null);
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          {selected ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <Search className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
          )}
        </div>
        <input
          type="text"
          placeholder={loading ? 'Loading race catalog...' : 'Search race catalog (e.g. Boston, IRONMAN, UTMB)'}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (selected) setSelected(null);
          }}
          onFocus={() => setOpen(true)}
          className={`w-full pl-10 pr-10 py-3.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
            isDark
              ? 'bg-white/5 text-white placeholder-gray-500 border-white/10'
              : 'bg-white text-gray-800 placeholder-gray-400 border-gray-200'
          } ${
            selected
              ? 'border-green-500/60 focus:ring-green-500/30'
              : isDark
                ? 'focus:ring-blue-500/30 focus:border-blue-500/50'
                : 'focus:ring-blue-500/20 focus:border-blue-400'
          }`}
        />
        {query && (
          <button
            onClick={handleClear}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {selected && (
        <div className="mt-2 flex items-start gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-green-300 leading-relaxed">
            <span className="font-semibold">{selected.name}</span> pre-filled from catalog.{' '}
            {selected.description}
          </div>
        </div>
      )}

      {open && !selected && (
        <div className={`absolute z-50 left-0 right-0 top-full mt-1.5 rounded-2xl shadow-2xl overflow-hidden border ${
          isDark
            ? 'bg-[#1e1a2e] border-white/10'
            : 'bg-white border-gray-200'
        }`}>
          {filtered.length === 0 ? (
            <div className={`px-4 py-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No races found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className={`max-h-72 overflow-y-auto divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
              {filtered.map((race) => (
                <button
                  key={race.id}
                  onMouseDown={() => handleSelect(race)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors group ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{race.name}</div>
                    <div className={`flex items-center gap-3 mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {race.city}, {race.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        {MONTH_NAMES[race.typical_month]}
                      </span>
                      {race.elevation_gain_m > 0 && (
                        <span className="flex items-center gap-1">
                          <Mountain className="w-3 h-3 flex-shrink-0" />
                          {race.elevation_gain_m >= 1000
                            ? `${(race.elevation_gain_m / 1000).toFixed(1)}k`
                            : race.elevation_gain_m}m
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{race.distance_km} km</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{race.avg_temperature_c}°C</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className={`px-4 py-2 border-t ${isDark ? 'border-white/5 bg-white/3' : 'border-gray-100 bg-gray-50'}`}>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {allRaces.length} races in catalog &middot; Data is historical and may vary by edition
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
