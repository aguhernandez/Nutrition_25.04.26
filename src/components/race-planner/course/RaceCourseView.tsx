import { useState, useEffect } from 'react';
import { Map, Mountain, Droplets, Save, Loader2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import type { RaceData, RaceCatalogEntry, HydrationStation, ElevationPoint, RaceCourseProfile } from '../../../types/race';
import { generateElevationProfile, generateHydrationStations } from '../../../utils/elevationGenerator';
import ElevationProfile from './ElevationProfile';
import HydrationStationEditor from './HydrationStationEditor';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';

interface Props {
  raceData: RaceData;
  catalogEntry?: RaceCatalogEntry;
}

type ViewTab = 'elevation' | 'stations';

export default function RaceCourseView({ raceData, catalogEntry }: Props) {
  const { user } = useAuth();
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

  return (
    <div className="bg-white rounded-2xl overflow-hidden print:hidden" style={{ border: '2px solid #e5e7eb', boxShadow: '0 2px 10px rgba(81,65,99,0.06)' }}>
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
            <Mountain className="w-4 h-4 text-white" />
          </div>
          <span className="font-body font-semibold text-[#1f2937]">Course Profile & Hydration Stations</span>
          <span className="font-body text-xs bg-[#f3f4f6] text-[#9ca3af] px-2 py-0.5 rounded-full">
            {distanceKm.toFixed(1)} km &middot; +{Math.round(climbCount)}m
          </span>
        </div>
        <div>
          {collapsed ? <ChevronDown className="w-4 h-4 text-[#9ca3af]" /> : <ChevronUp className="w-4 h-4 text-[#9ca3af]" />}
        </div>
      </button>

      {!collapsed && (
        <div className="px-6 pb-6 space-y-4">
          {/* Tab bar */}
          <div className="flex gap-1 bg-gray-900/60 rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab('elevation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'elevation' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Mountain className="w-3.5 h-3.5" />
              Orography
            </button>
            <button
              onClick={() => setActiveTab('stations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'stations' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Droplets className="w-3.5 h-3.5" />
              Aid Stations
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${activeTab === 'stations' ? 'bg-cyan-500/30 text-cyan-300' : 'bg-gray-700 text-gray-500'}`}>
                {stations.length}
              </span>
            </button>
          </div>

          {activeTab === 'elevation' && (
            <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-700/50">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-800/60 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Max Elevation</div>
                  <div className="text-lg font-bold text-white">{maxElev}<span className="text-xs text-gray-500 ml-1">m</span></div>
                </div>
                <div className="bg-gray-800/60 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Total Gain</div>
                  <div className="text-lg font-bold text-red-400">+{Math.round(climbCount)}<span className="text-xs text-gray-500 ml-1">m</span></div>
                </div>
                <div className="bg-gray-800/60 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Elev. Range</div>
                  <div className="text-lg font-bold text-white">{maxElev - minElev}<span className="text-xs text-gray-500 ml-1">m</span></div>
                </div>
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
                <p className="text-xs text-gray-600 mt-3 text-center">
                  Profile is algorithmically generated from total elevation gain. Select a race from the catalog for more accurate data.
                </p>
              )}
            </div>
          )}

          {activeTab === 'stations' && (
            <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-700/50 space-y-4">
              <div className="bg-gray-800/40 rounded-xl p-4">
                <ElevationProfile
                  elevationPoints={elevationPoints}
                  hydrationStations={stations}
                  distanceKm={distanceKm}
                  totalElevationGainM={Math.round(climbCount)}
                />
              </div>

              <div className="border-t border-gray-700/50 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Edit Hydration Stations</p>
                    <p className="text-xs text-gray-500 mt-0.5">Aid station locations may change year to year. Adjust as needed.</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
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
                <div className="flex justify-end pt-2 border-t border-gray-700/50">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${savedOk ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30'}`}
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
