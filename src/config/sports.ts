import type { Sport, SportConfig } from '../types/race';

export const SPORTS: SportConfig[] = [
  {
    id: 'running',
    label: 'Road Running',
    category: 'running',
    icon: 'footprints',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'trail_running',
    label: 'Trail Running',
    category: 'running',
    icon: 'mountain',
    color: 'from-green-600 to-emerald-700',
  },
  {
    id: 'cycling_road',
    label: 'Road Cycling',
    category: 'cycling',
    icon: 'bike',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'cycling_gravel',
    label: 'Gravel Cycling',
    category: 'cycling',
    icon: 'bike',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'cycling_mtb',
    label: 'Mountain Bike',
    category: 'cycling',
    icon: 'bike',
    color: 'from-teal-500 to-green-600',
  },
  {
    id: 'swimming',
    label: 'Swimming',
    category: 'multisport',
    icon: 'waves',
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 'triathlon',
    label: 'Triathlon',
    category: 'multisport',
    icon: 'zap',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'hyrox',
    label: 'Hyrox',
    category: 'other',
    icon: 'dumbbell',
    color: 'from-slate-600 to-gray-700',
  },
];

export const getSportConfig = (id: Sport): SportConfig => {
  return SPORTS.find((s) => s.id === id) ?? SPORTS[0];
};

export const isCyclingSport = (sport: Sport): boolean =>
  sport.startsWith('cycling');

export const isRunningSport = (sport: Sport): boolean =>
  sport === 'running' || sport === 'trail_running';

export const requiresPower = (sport: Sport): boolean =>
  isCyclingSport(sport);
