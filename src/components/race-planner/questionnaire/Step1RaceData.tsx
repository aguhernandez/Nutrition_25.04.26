import type { RaceData, RaceCatalogEntry, Sport } from '../../../types/race';
import { getSportConfig, isRunningSport, isCyclingSport } from '../../../config/sports';
import RaceCatalogSearch from './RaceCatalogSearch';

interface Props {
  sport: Sport;
  data: RaceData;
  onChange: (data: RaceData) => void;
  onCatalogSelect?: (entry: RaceCatalogEntry | null) => void;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-body font-medium text-sm text-[#374151] mb-1">{label}</label>
      {hint && <p className="font-body text-xs text-[#9ca3af] mb-2">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = 'input-brand';

function getNextRaceDate(month: number, day: number): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const candidate = new Date(currentYear, month - 1, day);
  const nextOccurrence = candidate < now ? new Date(currentYear + 1, month - 1, day) : candidate;
  return nextOccurrence.toISOString().split('T')[0];
}

export default function Step1RaceData({ sport, data, onChange, onCatalogSelect }: Props) {
  const cfg = getSportConfig(sport);
  const isRunning = isRunningSport(sport);
  const isCycling = isCyclingSport(sport);

  const update = (key: keyof RaceData, value: string | number) =>
    onChange({ ...data, [key]: value });

  const handleCatalogSelect = (race: RaceCatalogEntry) => {
    const raceDate = getNextRaceDate(race.typical_month, race.typical_day);
    onChange({
      ...data,
      raceName: race.name,
      distance: race.distance_km,
      distanceUnit: 'km',
      elevationGain: race.elevation_gain_m,
      temperature: race.avg_temperature_c,
      humidity: race.avg_humidity_pct,
      altitude: race.altitude_m,
      raceDate,
      expectedDurationMin: data.expectedDurationMin,
    });
    onCatalogSelect?.(race);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#fdda36' }} />
        <div>
          <h2 className="font-heading text-xl text-[#1f2937]">Race Details</h2>
          <p className="font-body text-sm text-[#9ca3af]">Search the catalog or enter your race manually</p>
        </div>
      </div>

      <div>
        <label className="block font-body font-medium text-sm text-[#374151] mb-2">
          Find Race in Catalog
        </label>
        <RaceCatalogSearch sport={sport} onSelect={handleCatalogSelect} />
        <p className="font-body text-xs text-[#9ca3af] mt-2">
          Selecting a race pre-fills all fields below. You can edit any value manually.
        </p>
      </div>

      <div className="border-t border-[#e5e7eb] pt-6">
        <p className="font-body text-xs text-[#9ca3af] mb-5 uppercase tracking-wider font-semibold">
          Race Information – edit as needed
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Field label="Race Name">
              <input
                type="text"
                placeholder="e.g. Boston Marathon, Leadville 100"
                value={data.raceName}
                onChange={(e) => update('raceName', e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Distance" hint={isRunning ? 'In kilometers or miles' : 'Course distance'}>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="42.2"
                value={data.distance || ''}
                onChange={(e) => update('distance', parseFloat(e.target.value) || 0)}
                className={inputCls}
              />
              <select
                value={data.distanceUnit}
                onChange={(e) => update('distanceUnit', e.target.value as 'km' | 'miles')}
                className="bg-white border-2 border-[#e5e7eb] rounded-xl px-3 py-3 text-[#1f2937] font-body text-sm focus:outline-none focus:border-brand-yellow transition-all"
              >
                <option value="km">km</option>
                <option value="miles">mi</option>
              </select>
            </div>
          </Field>

          <Field label="Expected Duration" hint="Your realistic goal time">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                max="99"
                placeholder="3"
                value={data.expectedDurationMin ? Math.floor(data.expectedDurationMin / 60) || '' : ''}
                onChange={(e) => {
                  const hours = parseInt(e.target.value) || 0;
                  const mins = data.expectedDurationMin ? data.expectedDurationMin % 60 : 0;
                  update('expectedDurationMin', hours * 60 + mins);
                }}
                className={inputCls}
              />
              <span className="font-body text-sm text-[#9ca3af] whitespace-nowrap">h</span>
              <input
                type="number"
                min="0"
                max="59"
                placeholder="30"
                value={data.expectedDurationMin ? data.expectedDurationMin % 60 || '' : ''}
                onChange={(e) => {
                  const mins = Math.min(59, parseInt(e.target.value) || 0);
                  const hours = data.expectedDurationMin ? Math.floor(data.expectedDurationMin / 60) : 0;
                  update('expectedDurationMin', hours * 60 + mins);
                }}
                className={inputCls}
              />
              <span className="font-body text-sm text-[#9ca3af] whitespace-nowrap">min</span>
            </div>
          </Field>

          {(sport === 'trail_running' || isCycling || sport === 'triathlon') && (
            <Field label="Elevation Gain" hint="Total positive elevation in meters">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  placeholder="2500"
                  value={data.elevationGain || ''}
                  onChange={(e) => update('elevationGain', parseInt(e.target.value) || 0)}
                  className={inputCls}
                />
                <span className="font-body text-sm text-[#9ca3af]">m</span>
              </div>
            </Field>
          )}

          <Field label="Temperature" hint="Expected race-day temperature">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="-10"
                max="50"
                placeholder="22"
                value={data.temperature || ''}
                onChange={(e) => update('temperature', parseInt(e.target.value) || 0)}
                className={inputCls}
              />
              <span className="font-body text-sm text-[#9ca3af]">°C</span>
            </div>
          </Field>

          <Field label="Humidity" hint="Approximate relative humidity">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="60"
                value={data.humidity || ''}
                onChange={(e) => update('humidity', parseInt(e.target.value) || 0)}
                className={inputCls}
              />
              <span className="font-body text-sm text-[#9ca3af]">%</span>
            </div>
          </Field>

          <Field label="Altitude" hint="Race start altitude above sea level">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                placeholder="150"
                value={data.altitude || ''}
                onChange={(e) => update('altitude', parseInt(e.target.value) || 0)}
                className={inputCls}
              />
              <span className="font-body text-sm text-[#9ca3af]">m</span>
            </div>
          </Field>

          <Field label="Race Date" hint="When is the competition?">
            <input
              type="date"
              value={data.raceDate}
              onChange={(e) => update('raceDate', e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
