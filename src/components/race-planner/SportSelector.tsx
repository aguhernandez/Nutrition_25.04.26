import {
  Footprints,
  Mountain,
  Bike,
  Waves,
  Zap,
  Dumbbell,
  ArrowRight,
} from 'lucide-react';
import type { Sport } from '../../types/race';
import { SPORTS } from '../../config/sports';

interface Props {
  onSelect: (sport: Sport) => void;
}

const iconMap: Record<string, React.ElementType> = {
  footprints: Footprints,
  mountain: Mountain,
  bike: Bike,
  waves: Waves,
  zap: Zap,
  dumbbell: Dumbbell,
};

const categoryLabels: Record<string, string> = {
  running: 'Running',
  cycling: 'Cycling',
  multisport: 'Multisport',
  other: 'Functional Fitness',
};

const categoryOrder = ['running', 'cycling', 'multisport', 'other'];

const grouped = SPORTS.reduce<Record<string, typeof SPORTS>>((acc, sport) => {
  if (!acc[sport.category]) acc[sport.category] = [];
  acc[sport.category].push(sport);
  return acc;
}, {});

const sportColorMap: Record<string, { bg: string; text: string; border: string }> = {
  running:      { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  trail_running:{ bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  cycling_road: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  cycling_gravel:{ bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  cycling_mtb:  { bg: '#fefce8', text: '#a16207', border: '#fde68a' },
  swimming:     { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc' },
  triathlon:    { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
  hyrox:        { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' },
};

export default function SportSelector({ onSelect }: Props) {
  return (
    <div className="px-4 sm:px-6 py-10 animate-slide-up">
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-semibold mb-5"
          style={{ backgroundColor: 'rgba(253,218,54,0.18)', color: '#92400e' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow inline-block" />
          Race Day Nutrition & Strategy
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl text-[#1f2937] mb-3 leading-tight">
          Race Planner
        </h1>
        <p className="font-body text-[#4b5563] text-base max-w-xl mx-auto leading-relaxed">
          Select your discipline to generate a personalized race-day nutrition and strategy plan.
        </p>
      </div>

      <div className="space-y-8">
        {categoryOrder
          .filter((cat) => grouped[cat])
          .map((category) => {
            const sports = grouped[category];
            return (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-[#e5e7eb]" />
                  <span className="font-body font-semibold text-xs tracking-widest text-[#9ca3af] uppercase px-2">
                    {categoryLabels[category]}
                  </span>
                  <div className="h-px flex-1 bg-[#e5e7eb]" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {sports.map((sport) => {
                    const Icon = iconMap[sport.icon] ?? Zap;
                    const colors = sportColorMap[sport.id] ?? { bg: '#f9fafb', text: '#374151', border: '#e5e7eb' };
                    return (
                      <button
                        key={sport.id}
                        onClick={() => onSelect(sport.id)}
                        className="group relative bg-white rounded-2xl p-5 text-left transition-all duration-200 focus:outline-none"
                        style={{
                          border: `2px solid ${colors.border}`,
                          boxShadow: '0 1px 4px rgba(81,65,99,0.06)',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(81,65,99,0.12)`;
                          (e.currentTarget as HTMLElement).style.borderColor = '#fdda36';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = '';
                          (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(81,65,99,0.06)';
                          (e.currentTarget as HTMLElement).style.borderColor = colors.border;
                        }}
                      >
                        <div
                          className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3"
                          style={{ backgroundColor: colors.bg }}
                        >
                          <Icon className="w-5 h-5" style={{ color: colors.text }} />
                        </div>
                        <div className="font-body font-semibold text-[#1f2937] text-sm leading-tight">
                          {sport.label}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-xs font-body text-[#9ca3af]">
                            {categoryLabels[sport.category]}
                          </span>
                          <ArrowRight
                            className="w-3.5 h-3.5 text-[#9ca3af] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                            style={{ color: '#514163' }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      <div
        className="mt-12 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4"
        style={{ backgroundColor: 'rgba(253,218,54,0.12)', border: '2px solid rgba(253,218,54,0.35)' }}
      >
        <div className="flex-1">
          <p className="font-body font-semibold text-[#514163] text-sm">
            Powered by Asciende&apos;s metabolic science
          </p>
          <p className="font-body text-xs text-[#6b5578] mt-1 leading-relaxed">
            Each plan is calculated using VO2max, threshold data, body weight, sweat rate, and race conditions to give you a precise nutrition strategy.
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ backgroundColor: '#fdda36' }}
        >
          <Zap className="w-6 h-6" style={{ color: '#514163' }} />
        </div>
      </div>
    </div>
  );
}
