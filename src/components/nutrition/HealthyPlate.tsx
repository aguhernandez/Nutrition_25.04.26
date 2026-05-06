import { useState } from 'react';
import { ChevronLeft, Info } from 'lucide-react';

interface Props {
  onBack: () => void;
}

type DivisionMode = 2 | 3 | 4;

interface FoodItem {
  name: string;
  portion: string;
  color: string;
}

const DIVISION_CONFIG = {
  2: {
    label: 'Simple Plate',
    desc: 'Half-plate method',
    sections: [
      { key: 'veg', label: 'Vegetables & Salad', percent: 50, color: '#22c55e', lightColor: '#dcfce7', desc: 'Fill half your plate with colorful non-starchy vegetables', emoji: '🥗', examples: ['Spinach', 'Broccoli', 'Tomatoes', 'Cucumber', 'Bell peppers'] },
      { key: 'main', label: 'Protein + Carbs', percent: 50, color: '#3b82f6', lightColor: '#dbeafe', desc: 'Split between quality protein and complex carbohydrates', emoji: '🍗', examples: ['Chicken', 'Rice', 'Fish', 'Pasta', 'Legumes'] },
    ],
  },
  3: {
    label: 'Athlete Plate',
    desc: 'Standard performance plate',
    sections: [
      { key: 'veg', label: 'Vegetables', percent: 50, color: '#22c55e', lightColor: '#dcfce7', desc: 'Non-starchy vegetables for micronutrients and fiber', emoji: '🥦', examples: ['Broccoli', 'Spinach', 'Zucchini', 'Carrots', 'Tomatoes'] },
      { key: 'protein', label: 'Lean Protein', percent: 25, color: '#ef4444', lightColor: '#fee2e2', desc: 'Quality protein for muscle repair and synthesis', emoji: '🥩', examples: ['Chicken breast', 'Salmon', 'Eggs', 'Greek yogurt', 'Tofu'] },
      { key: 'carbs', label: 'Complex Carbs', percent: 25, color: '#f59e0b', lightColor: '#fef3c7', desc: 'Complex carbohydrates for sustained energy', emoji: '🌾', examples: ['Brown rice', 'Sweet potato', 'Oats', 'Quinoa', 'Whole grain bread'] },
    ],
  },
  4: {
    label: 'Load Day Plate',
    desc: 'High-carb race prep protocol',
    sections: [
      { key: 'veg', label: 'Vegetables', percent: 25, color: '#22c55e', lightColor: '#dcfce7', desc: 'Reduced fiber on high-carb days to avoid GI issues during training', emoji: '🥗', examples: ['Cooked carrots', 'Green beans', 'Zucchini', 'Tomatoes'] },
      { key: 'protein', label: 'Protein', percent: 20, color: '#ef4444', lightColor: '#fee2e2', desc: 'Moderate protein to support muscle without limiting carb space', emoji: '🍗', examples: ['Chicken', 'White fish', 'Egg whites', 'Tuna'] },
      { key: 'carbs', label: 'Carbohydrates', percent: 40, color: '#f59e0b', lightColor: '#fef3c7', desc: 'Prioritize high-glycemic carbs for glycogen loading', emoji: '🍚', examples: ['White rice', 'Pasta', 'Bread', 'Potatoes', 'Fruit'] },
      { key: 'fat', label: 'Healthy Fats', percent: 15, color: '#8b5cf6', lightColor: '#ede9fe', desc: 'Small amount of healthy fats for satiety and fat-soluble vitamins', emoji: '🥑', examples: ['Avocado', 'Olive oil', 'Nuts (small)', 'Chia seeds'] },
    ],
  },
} as const;

const MEAL_CONTEXTS = [
  { id: 'base', label: 'Base Day', desc: 'Normal training day' },
  { id: 'load', label: 'Load Day', desc: 'High-carb / high intensity' },
  { id: 'taper', label: 'Taper', desc: 'Reducing volume' },
  { id: 'race', label: 'Race Day', desc: 'Pre-competition' },
  { id: 'recovery', label: 'Recovery', desc: 'Post-race / rest' },
] as const;

const CONTEXT_DIVISION: Record<string, DivisionMode> = {
  base: 3,
  load: 4,
  taper: 3,
  race: 4,
  recovery: 3,
};

function PlateSVG({ mode, activeSection, onSectionClick }: {
  mode: DivisionMode;
  activeSection: string | null;
  onSectionClick: (key: string) => void;
}) {
  const cx = 160;
  const cy = 160;
  const r = 140;
  const config = DIVISION_CONFIG[mode];

  function polarToXY(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function buildArcPath(startAngle: number, endAngle: number, outerR: number, innerR = 0) {
    const s = polarToXY(startAngle, outerR);
    const e = polarToXY(endAngle, outerR);
    const ls = innerR > 0 ? polarToXY(startAngle, innerR) : { x: cx, y: cy };
    const le = innerR > 0 ? polarToXY(endAngle, innerR) : { x: cx, y: cy };
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    if (innerR > 0) {
      return `M ${s.x} ${s.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${e.x} ${e.y} L ${le.x} ${le.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ls.x} ${ls.y} Z`;
    }
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${e.x} ${e.y} Z`;
  }

  let cumulativeAngle = 0;

  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-xs mx-auto drop-shadow-xl">
      {/* Plate shadow */}
      <ellipse cx={cx} cy={cy + 4} rx={r + 8} ry={r + 8} fill="rgba(0,0,0,0.08)" />
      {/* Plate rim */}
      <circle cx={cx} cy={cy} r={r + 8} fill="#f9fafb" stroke="#e5e7eb" strokeWidth="2" />

      {config.sections.map((section) => {
        const startAngle = cumulativeAngle;
        const sweepAngle = (section.percent / 100) * 360;
        const endAngle = cumulativeAngle + sweepAngle;
        cumulativeAngle = endAngle;

        const isActive = activeSection === section.key;
        const mid = startAngle + sweepAngle / 2;
        const labelPos = polarToXY(mid, r * 0.62);

        return (
          <g key={section.key}>
            <path
              d={buildArcPath(startAngle, endAngle, r)}
              fill={isActive ? section.color : section.lightColor}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200"
              style={{ filter: isActive ? `drop-shadow(0 2px 8px ${section.color}60)` : 'none' }}
              onClick={() => onSectionClick(section.key)}
            />
            {/* Label */}
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={sweepAngle >= 90 ? 11 : 9}
              fontWeight="600"
              fill={isActive ? 'white' : section.color}
              className="pointer-events-none select-none"
            >
              {section.percent}%
            </text>
          </g>
        );
      })}

      {/* Center circle */}
      <circle cx={cx} cy={cy} r={28} fill="white" stroke="#f3f4f6" strokeWidth="2" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={18}>🍽</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={7} fill="#9ca3af" fontWeight="500">PLATE</text>
    </svg>
  );
}

export default function HealthyPlate({ onBack }: Props) {
  const [mode, setMode] = useState<DivisionMode>(3);
  const [context, setContext] = useState('base');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const config = DIVISION_CONFIG[mode];
  const activeConfig = config.sections.find((s) => s.key === activeSection);

  const handleContextChange = (c: string) => {
    setContext(c);
    const newMode = CONTEXT_DIVISION[c];
    if (newMode !== mode) {
      setMode(newMode);
      setActiveSection(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-slide-up">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-xl border btn-ghost" style={{ borderColor: '#e5e7eb' }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-heading text-2xl" style={{ color: '#1f2937' }}>Healthy Plate</h1>
          <p className="font-body text-sm mt-0.5" style={{ color: '#9ca3af' }}>
            Visual guide to plate composition based on your training context
          </p>
        </div>
      </div>

      {/* Meal Context selector */}
      <div className="mb-6">
        <div className="text-xs font-body font-semibold uppercase tracking-wider mb-3" style={{ color: '#9ca3af' }}>Training Context</div>
        <div className="flex flex-wrap gap-2">
          {MEAL_CONTEXTS.map((c) => (
            <button
              key={c.id}
              onClick={() => handleContextChange(c.id)}
              className="px-4 py-2 rounded-xl text-sm font-body font-semibold border transition-all duration-200"
              style={
                context === c.id
                  ? { backgroundColor: '#514163', color: '#fdda36', borderColor: '#514163' }
                  : { backgroundColor: '#ffffff', color: '#4b5563', borderColor: '#e5e7eb' }
              }
            >
              {c.label}
              <span className="font-normal text-xs ml-1.5 opacity-60">{c.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Division mode selector */}
      <div className="mb-6">
        <div className="text-xs font-body font-semibold uppercase tracking-wider mb-3" style={{ color: '#9ca3af' }}>Plate Division</div>
        <div className="flex gap-3">
          {([2, 3, 4] as DivisionMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setActiveSection(null); }}
              className="flex-1 p-3 rounded-xl border-2 text-left transition-all duration-200"
              style={
                mode === m
                  ? { borderColor: '#fdda36', backgroundColor: 'rgba(253,218,54,0.08)' }
                  : { borderColor: '#e5e7eb', backgroundColor: '#ffffff' }
              }
            >
              <div className="font-body font-bold text-base mb-0.5" style={{ color: mode === m ? '#514163' : '#1f2937' }}>
                {m} sections
              </div>
              <div className="font-body text-xs" style={{ color: '#9ca3af' }}>
                {DIVISION_CONFIG[m].label}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Plate Visual */}
        <div className="bg-white rounded-2xl p-6" style={{ border: '2px solid #e5e7eb' }}>
          <div className="text-center mb-4">
            <div className="font-heading text-lg" style={{ color: '#1f2937' }}>{config.label}</div>
            <div className="font-body text-xs mt-1" style={{ color: '#9ca3af' }}>{config.desc} · Click a section to learn more</div>
          </div>
          <PlateSVG mode={mode} activeSection={activeSection} onSectionClick={(key) => setActiveSection(key === activeSection ? null : key)} />

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {config.sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key === activeSection ? null : s.key)}
                className="flex items-center gap-2 p-2 rounded-xl transition-all"
                style={{
                  backgroundColor: activeSection === s.key ? s.lightColor : '#f9fafb',
                  border: `1px solid ${activeSection === s.key ? s.color : '#f3f4f6'}`,
                }}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <div className="text-left">
                  <div className="font-body text-xs font-semibold" style={{ color: s.color }}>{s.percent}%</div>
                  <div className="font-body text-xs" style={{ color: '#374151' }}>{s.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section Details */}
        <div className="space-y-3">
          {activeConfig ? (
            <div
              className="rounded-2xl p-5 transition-all animate-fade-in"
              style={{ backgroundColor: activeConfig.lightColor, border: `2px solid ${activeConfig.color}40` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{activeConfig.emoji}</span>
                <div>
                  <div className="font-heading text-lg" style={{ color: '#1f2937' }}>
                    {activeConfig.label}
                    <span className="font-body text-sm font-normal ml-2" style={{ color: activeConfig.color }}>{activeConfig.percent}%</span>
                  </div>
                  <div className="font-body text-sm mt-0.5" style={{ color: '#4b5563' }}>{activeConfig.desc}</div>
                </div>
              </div>
              <div>
                <div className="font-body text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9ca3af' }}>Example foods</div>
                <div className="flex flex-wrap gap-2">
                  {activeConfig.examples.map((ex) => (
                    <span
                      key={ex}
                      className="badge"
                      style={{ backgroundColor: `${activeConfig.color}20`, color: activeConfig.color }}
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-5 flex items-start gap-3" style={{ backgroundColor: '#f9fafb', border: '2px dashed #e5e7eb' }}>
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#9ca3af' }} />
              <p className="font-body text-sm" style={{ color: '#9ca3af' }}>Click on a plate section to see guidelines and food examples for that portion.</p>
            </div>
          )}

          {/* All sections summary */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '2px solid #e5e7eb' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: '#f3f4f6', backgroundColor: '#f9fafb' }}>
              <span className="font-body font-semibold text-sm" style={{ color: '#1f2937' }}>Plate Breakdown</span>
            </div>
            {config.sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key === activeSection ? null : s.key)}
                className="w-full flex items-center gap-3 px-4 py-3 border-b last:border-0 transition-all hover:bg-gray-50 text-left"
                style={{ borderColor: '#f3f4f6' }}
              >
                <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <div className="flex-1">
                  <div className="font-body font-semibold text-sm" style={{ color: '#1f2937' }}>{s.label}</div>
                  <div className="font-body text-xs mt-0.5 line-clamp-1" style={{ color: '#9ca3af' }}>{s.desc}</div>
                </div>
                <div
                  className="font-heading text-lg font-bold flex-shrink-0"
                  style={{ color: s.color }}
                >
                  {s.percent}%
                </div>
              </button>
            ))}
          </div>

          {/* Context-specific tips */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(253,218,54,0.08)', border: '2px solid rgba(253,218,54,0.3)' }}>
            <div className="font-body font-semibold text-sm mb-2" style={{ color: '#514163' }}>
              Tips for {MEAL_CONTEXTS.find((c) => c.id === context)?.label}
            </div>
            <ul className="space-y-1.5">
              {context === 'load' && (
                <>
                  <li className="font-body text-xs" style={{ color: '#4b5563' }}>• Aim for 8-10g carbs/kg body weight today</li>
                  <li className="font-body text-xs" style={{ color: '#4b5563' }}>• Choose low-fiber carb sources to avoid GI issues</li>
                  <li className="font-body text-xs" style={{ color: '#4b5563' }}>• Reduce fat and fiber to make room for carbs</li>
                </>
              )}
              {context === 'race' && (
                <>
                  <li className="font-body text-xs" style={{ color: '#4b5563' }}>• Eat 3-4h before race start</li>
                  <li className="font-body text-xs" style={{ color: '#4b5563' }}>• Prioritize familiar, tested foods</li>
                  <li className="font-body text-xs" style={{ color: '#4b5563' }}>• Light, easily digestible carbohydrates</li>
                </>
              )}
              {context === 'recovery' && (
                <>
                  <li className="font-body text-xs" style={{ color: '#4b5563' }}>• Eat within 30-45 min post-exercise</li>
                  <li className="font-body text-xs" style={{ color: '#4b5563' }}>• 3:1 carb-to-protein ratio is ideal</li>
                  <li className="font-body text-xs" style={{ color: '#4b5563' }}>• Include antioxidant-rich vegetables</li>
                </>
              )}
              {(context === 'base' || context === 'taper') && (
                <>
                  <li className="font-body text-xs" style={{ color: '#4b5563' }}>• Prioritize whole, minimally processed foods</li>
                  <li className="font-body text-xs" style={{ color: '#4b5563' }}>• Adjust portions based on training volume</li>
                  <li className="font-body text-xs" style={{ color: '#4b5563' }}>• Maintain consistent meal timing</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
