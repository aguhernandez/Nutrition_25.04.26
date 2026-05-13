import { useState, useEffect } from 'react';
import { Mountain, Droplets, Save, Loader2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import type { RaceData, RaceCatalogEntry, HydrationStation, ElevationPoint } from '../../../types/race';
import { generateElevationProfile, generateHydrationStations } from '../../../utils/elevationGenerator';
import ElevationProfile from './ElevationProfile';
import HydrationStationEditor from './HydrationStationEditor';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';
import { usePreferences } from '../../../lib/preferences';

interface Props {
  raceData: RaceData;
  catalogEntry?: RaceCatalogEntry;
}

type ViewTab = 'elevation' | 'stations';

export default function RaceCourseView({ raceData, catalogEntry }: Props) {
  const { user } = useAuth();
  const { theme } = usePreferences();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<ViewTab>('elevation');
  const [collapsed, setCollapsed] = useState(false);
  const [elevationPoints, setElevationPoints] = useState<ElevationPoint[]>([]);
  const [stations, setStations] = useState<HydrationStation[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  const distanceKm = raceData.distanceUnit === 'miles'
    ? raceData.distance * 1.60934
    : raceData.distance;

  const elevGain = raceData.elevationGain || catalogEntry?.elevation_gain_m || 0;

  useEffect(() => {
    const seed = raceData.raceName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const pts = generateElevationProfile(distanceKm, elevGain, seed);
    setElevationPoints(pts);

    if (catalogEntry && user) {
      loadSavedProfile(pts);
    } else {
      const defaultStations = generateHydrationStations(distanceKm, pts, catalogEntry);
      setStations(defaultStations);
    }
  }, [raceData.raceName, distanceKm, elevGain]);

  async function loadSavedProfile(pts: ElevationPoint[]) {
    if (!catalogEntry || !user) return;
    const year = raceData.raceDate ? new Date(raceData.raceDate).getFullYear() : new Date().getFullYear();
    const { data } = await supabase
      .from('race_course_profiles')
      .select('*')
      .eq('race_catalog_id', catalogEntry.id)
      .eq('user_id', user.id)
      .eq('edition_year', year)
      .maybeSingle();

    if (data) {
      setProfileId(data.id);
      setStations((data.hydration_stations as HydrationStation[]) ?? []);
      if ((data.elevation_points as ElevationPoint[])?.length > 0) {
        setElevationPoints(data.elevation_points as ElevationPoint[]);
      }
    } else {
      const defaultStations = generateHydrationStations(distanceKm, pts, catalogEntry);
      setStations(defaultStations);
    }
  }

  async function handleSave() {
    if (!user || !catalogEntry) return;
    setSaving(true);
    const year = raceData.raceDate ? new Date(raceData.raceDate).getFullYear() : new Date().getFullYear();
    const payload = {
      race_catalog_id: catalogEntry.id,
      user_id: user.id,
      edition_year: year,
      hydration_stations: stations,
      elevation_points: elevationPoints,
      notes: '',
      updated_at: new Date().toISOString(),
    };

    if (profileId) {
      await supabase.from('race_course_profiles').update(payload).eq('id', profileId);
    } else {
      const { data } = await supabase.from('race_course_profiles').insert(payload).select('id').maybeSingle();
      if (data?.id) setProfileId(data.id);
    }
    setSaving(false);
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 3000);
  }

  function handleReset() {
    const seed = raceData.raceName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const pts = generateElevationProfile(distanceKm, elevGain, seed);
    setElevationPoints(pts);
    setStations(generateHydrationStations(distanceKm, pts, catalogEntry));
  }

  const maxElev = elevationPoints.length > 0 ? Math.max(...elevationPoints.map((p) => p.elevationM)) : 0;
  const minElev = elevationPoints.length > 0 ? Math.min(...elevationPoints.map((p) => p.elevationM)) : 0;

  const climbCount = elevationPoints.reduce((acc, p, i) => {
    if (i === 0) return acc;
    const delta = p.elevationM - elevationPoints[i - 1].elevationM;
    return delta > 0 ? acc + delta : acc;
  }, 0);

  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '2px solid #e5e7eb';
  const cardShadow = isDark ? 'none' : '0 2px 10px rgba(81,65,99,0.06)';
  const textPrimary = isDark ? 'text-white' : 'text-[#1f2937]';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
  const hoverRow = isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-[#fafafa]';

  const innerBg = isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb';
  const innerBorder = isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb';

  const statBg = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6';

  const tabBarBg = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6';

  return (
    <div
      className="rounded-2xl overflow-hidden print:hidden transition-colors"
      style={{ backgroundColor: cardBg, border: cardBorder, boxShadow: cardShadow }}
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${hoverRow}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
            <Mountain className="w-4 h-4 text-white" />
          </div>
          <span className={`font-body font-semibold ${textPrimary}`}>Course Profile & Hydration Stations</span>
          <span
            className="font-body text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : '#f3f4f6', color: isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af' }}
          >
            {distanceKm.toFixed(1)} km &middot; +{Math.round(climbCount)}m
          </span>
        </div>
        <div>
          {collapsed
            ? <ChevronDown className={`w-4 h-4 ${textMuted}`} />
            : <ChevronUp className={`w-4 h-4 ${textMuted}`} />
          }
        </div>
      </button>

      {!collapsed && (
        <div className="px-6 pb-6 space-y-4">
          {/* Tab bar */}
          <div className="flex gap-1 rounded-xl p-1 w-fit" style={{ backgroundColor: tabBarBg }}>
            <button
              onClick={() => setActiveTab('elevation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'elevation'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              Orography
            </button>
            <button
              onClick={() => setActiveTab('stations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'stations'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              Aid Stations
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 ${
                  activeTab === 'stations'
                    ? 'bg-cyan-500/30 text-cyan-400'
                    : isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stations.length}
              </span>
            </button>
          </div>

          {activeTab === 'elevation' && (
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: innerBg, border: `1px solid ${innerBorder}` }}
            >
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Max Elevation', value: maxElev, color: textPrimary },
                  { label: 'Total Gain', value: `+${Math.round(climbCount)}`, color: 'text-red-400' },
                  { label: 'Elev. Range', value: maxElev - minElev, color: textPrimary },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-3 text-center"
                    style={{ backgroundColor: statBg }}
                  >
                    <div className={`text-xs mb-1 ${textMuted}`}>{stat.label}</div>
                    <div className={`text-lg font-bold ${stat.color}`}>{stat.value}<span className={`text-xs ml-1 ${textMuted}`}>m</span></div>
                  </div>
                ))}
              </div>

              {elevationPoints.length > 0 && (
                <ElevationProfile
                  elevationPoints={elevationPoints}
                  hydrationStations={stations}
                  distanceKm={distanceKm}
                  totalElevationGainM={Math.round(climbCount)}
                />
              )}

              {!catalogEntry && (
                <p className={`text-xs mt-3 text-center ${textMuted}`}>
                  Profile is algorithmically generated from total elevation gain. Select a race from the catalog for more accurate data.
                </p>
              )}
            </div>
          )}

          {activeTab === 'stations' && (
            <div
              className="rounded-2xl p-4 space-y-4"
              style={{ backgroundColor: innerBg, border: `1px solid ${innerBorder}` }}
            >
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff', border: `1px solid ${innerBorder}` }}
              >
                <ElevationProfile
                  elevationPoints={elevationPoints}
                  hydrationStations={stations}
                  distanceKm={distanceKm}
                  totalElevationGainM={Math.round(climbCount)}
                />
              </div>

              <div className={`border-t pt-4 ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className={`text-sm font-semibold ${textPrimary}`}>Edit Hydration Stations</p>
                    <p className={`text-xs mt-0.5 ${textMuted}`}>Aid station locations may change year to year. Adjust as needed.</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to default
                  </button>
                </div>
                <HydrationStationEditor
                  stations={stations}
                  distanceKm={distanceKm}
                  onChange={setStations}
                />
              </div>

              {user && catalogEntry && (
                <div className={`flex justify-end pt-2 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      savedOk
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-sky-500/20 text-sky-400 border border-sky-500/30 hover:bg-sky-500/30'
                    }`}
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : savedOk ? (
                      <><Save className="w-4 h-4" /> Saved!</>
                    ) : (
                      <><Save className="w-4 h-4" /> Save stations for this edition</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
