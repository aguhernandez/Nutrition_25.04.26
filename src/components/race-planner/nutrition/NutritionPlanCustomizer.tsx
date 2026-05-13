import { useState, useEffect } from 'react';
import { Flame, Droplets, Zap, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import type { NutritionProduct, NutritionCategory, RaceNutritionPlan, FuelType } from '../../../types/nutrition';
import type { Competition } from '../../../types/race';
import { supabase } from '../../../lib/supabase';
import { usePreferences } from '../../../lib/preferences';
import ProductSelector from './ProductSelector';

interface Props {
  competition: Competition;
  onChange: (plan: RaceNutritionPlan) => void;
}

const FUEL_TYPES: { value: FuelType; label: string; desc: string }[] = [
  { value: 'gel', label: 'Gels', desc: 'Fast-acting, easy to carry, widely available at aid stations' },
  { value: 'liquid', label: 'Liquid / Sport Drink', desc: 'Hydration + carbs in one, easy on stomach, no chewing' },
  { value: 'chew', label: 'Chews / Gummies', desc: 'Real food feel, slower absorption, satisfying' },
  { value: 'bar', label: 'Bars / Solid Food', desc: 'Best for cycling, lower intensity, or very long events' },
];

export default function NutritionPlanCustomizer({ competition, onChange }: Props) {
  const { theme } = usePreferences();
  const isDark = theme === 'dark';

  const [collapsed, setCollapsed] = useState(false);
  const [products, setProducts] = useState<NutritionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [primaryFuelType, setPrimaryFuelType] = useState<FuelType>('gel');
  const [primaryGelProduct, setPrimaryGelProduct] = useState<NutritionProduct | null>(null);
  const [primaryDrinkProduct, setPrimaryDrinkProduct] = useState<NutritionProduct | null>(null);
  const [electrolyteProduct, setElectrolyteProduct] = useState<NutritionProduct | null>(null);
  const [caffeineProduct, setCaffeineProduct] = useState<NutritionProduct | null>(null);

  const output = competition.strategyOutput;
  const targetCarbsGH = output?.carbs.recommendedIntakeGH ?? 60;
  const durationH = competition.raceData.expectedDurationMin / 60;
  const totalCarbsTarget = output?.carbs.totalCarbsG ?? Math.round(targetCarbsGH * durationH);
  const sodiumTarget = output?.hydration.totalSodiumMg ?? 0;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('nutrition_products').select('*').order('brand').order('product_name');
      setProducts((data as NutritionProduct[]) ?? []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    onChange(buildPlan());
  }, [primaryFuelType, primaryGelProduct, primaryDrinkProduct, electrolyteProduct, caffeineProduct]);

  function buildPlan(): RaceNutritionPlan {
    const mainProduct = primaryFuelType === 'liquid' ? primaryDrinkProduct : primaryGelProduct;
    const carbsPerUnit = mainProduct?.carbs_g ?? (primaryFuelType === 'liquid' ? 40 : 25);
    const sodiumPerUnit = mainProduct?.sodium_mg ?? 50;
    const cafPerUnit = caffeineProduct?.caffeine_mg ?? 0;

    const servingsNeeded = carbsPerUnit > 0 ? Math.ceil(totalCarbsTarget / carbsPerUnit) : 0;
    const actualCarbs = servingsNeeded * carbsPerUnit;
    const actualSodium = servingsNeeded * sodiumPerUnit + (electrolyteProduct ? Math.round(durationH * 2) * (electrolyteProduct.sodium_mg) : 0);

    return {
      primaryFuelType,
      primaryGelProductId: primaryGelProduct?.id,
      primaryDrinkProductId: primaryDrinkProduct?.id,
      electrolyteProductId: electrolyteProduct?.id,
      segmentFueling: {},
      totalCarbsG: actualCarbs,
      totalSodiumMg: actualSodium,
      totalCaffeineM: cafPerUnit > 0 ? cafPerUnit * Math.min(3, Math.floor(durationH)) : 0,
      notes: buildNotes(mainProduct, electrolyteProduct, caffeineProduct, servingsNeeded, durationH),
    };
  }

  function buildNotes(main: NutritionProduct | null, elec: NutritionProduct | null, caf: NutritionProduct | null, servings: number, hours: number): string {
    const parts: string[] = [];
    if (main) {
      const unit = main.category === 'drink' ? `bottle${servings !== 1 ? 's' : ''}` : `serving${servings !== 1 ? 's' : ''}`;
      parts.push(`${servings} × ${main.full_name} (${unit})`);
    }
    if (elec) parts.push(`${Math.round(hours * 2)} × ${elec.full_name}`);
    if (caf) parts.push(`${Math.min(3, Math.floor(hours))} × ${caf.full_name} (key moments)`);
    return parts.join(' · ');
  }

  const fuelCategories = (type: FuelType): NutritionCategory[] => {
    if (type === 'gel') return ['gel'];
    if (type === 'liquid') return ['drink'];
    if (type === 'chew') return ['chew'];
    return ['bar'];
  };

  const mainProduct = primaryFuelType === 'liquid' ? primaryDrinkProduct : primaryGelProduct;
  const servingsNeeded = mainProduct && mainProduct.carbs_g > 0 ? Math.ceil(totalCarbsTarget / mainProduct.carbs_g) : null;

  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '2px solid #e5e7eb';
  const cardShadow = isDark ? 'none' : '0 2px 10px rgba(81,65,99,0.06)';

  const textPrimary = isDark ? 'text-white' : 'text-[#1f2937]';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';

  const innerBg = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb';
  const innerBorder = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb';

  const labelCls = `text-xs uppercase tracking-wider font-semibold ${textMuted}`;

  return (
    <div
      className="rounded-2xl overflow-hidden print:hidden transition-colors"
      style={{ backgroundColor: cardBg, border: cardBorder, boxShadow: cardShadow }}
    >
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-[#fafafa]'}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className={`font-body font-semibold ${textPrimary}`}>Nutrition Plan</span>
          <span
            className="font-body text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : '#f3f4f6', color: isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af' }}
          >
            customize &amp; export
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
        <div className="px-6 pb-6 space-y-5">
          {/* Targets summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
              <div className="text-xs text-yellow-500 font-semibold mb-1">Carb Target</div>
              <div className={`text-xl font-bold ${textPrimary}`}>{totalCarbsTarget}<span className={`text-xs ml-1 ${textMuted}`}>g total</span></div>
              <div className={`text-xs ${textMuted}`}>{targetCarbsGH}g/h</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <div className="text-xs text-blue-400 font-semibold mb-1">Sodium Target</div>
              <div className={`text-xl font-bold ${textPrimary}`}>{Math.round(sodiumTarget / 1000 * 10) / 10}<span className={`text-xs ml-1 ${textMuted}`}>g total</span></div>
              <div className={`text-xs ${textMuted}`}>{output?.hydration.sodiumMgH ?? 0}mg/h</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="text-xs text-amber-400 font-semibold mb-1">Duration</div>
              <div className={`text-xl font-bold ${textPrimary}`}>{Math.floor(durationH)}<span className={`text-xs ${textMuted}`}>h </span>{Math.round((durationH % 1) * 60)}<span className={`text-xs ${textMuted}`}>m</span></div>
            </div>
          </div>

          {/* Primary fuel type */}
          <div>
            <div className={`${labelCls} mb-3`}>Primary Fuel Type</div>
            <div className="grid grid-cols-2 gap-2">
              {FUEL_TYPES.map((ft) => {
                const isSelected = primaryFuelType === ft.value;
                return (
                  <button
                    key={ft.value}
                    onClick={() => setPrimaryFuelType(ft.value)}
                    className="text-left p-3 rounded-xl border transition-all"
                    style={{
                      border: isSelected
                        ? '1px solid rgba(234,179,8,0.5)'
                        : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb',
                      backgroundColor: isSelected
                        ? 'rgba(234,179,8,0.1)'
                        : isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
                    }}
                  >
                    <div className={`text-sm font-semibold mb-0.5 ${isSelected ? 'text-yellow-500' : textPrimary}`}>{ft.label}</div>
                    <div className={`text-xs leading-relaxed ${textMuted}`}>{ft.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product selection */}
          <div className="space-y-4">
            <div className={labelCls}>Select Products</div>

            {/* Main fuel product */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {primaryFuelType === 'liquid' ? 'Sport Drink' : primaryFuelType === 'gel' ? 'Energy Gel' : primaryFuelType === 'chew' ? 'Energy Chew' : 'Energy Bar'}
                <span className={`text-xs ml-2 font-normal ${textMuted}`}>primary source of carbs</span>
              </label>
              <ProductSelector
                products={products}
                categories={fuelCategories(primaryFuelType)}
                selectedId={primaryFuelType === 'liquid' ? primaryDrinkProduct?.id : primaryGelProduct?.id}
                placeholder={loading ? 'Loading products...' : `Search ${primaryFuelType === 'liquid' ? 'sport drinks' : primaryFuelType + 's'}...`}
                onSelect={(p) => {
                  if (primaryFuelType === 'liquid') setPrimaryDrinkProduct(p);
                  else setPrimaryGelProduct(p);
                }}
              />
              {servingsNeeded !== null && (
                <p className={`text-xs mt-1.5 flex items-center gap-1 ${textMuted}`}>
                  <RefreshCw className="w-3 h-3" />
                  Estimated <span className="text-yellow-500 font-semibold">{servingsNeeded} servings</span> needed to meet {totalCarbsTarget}g carb target
                </p>
              )}
            </div>

            {/* Electrolyte supplement */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Electrolyte Supplement
                <span className={`text-xs ml-2 font-normal ${textMuted}`}>optional, for extra sodium</span>
              </label>
              <ProductSelector
                products={products}
                categories={['electrolyte_tablet', 'drink']}
                selectedId={electrolyteProduct?.id}
                placeholder="Search electrolyte products..."
                onSelect={setElectrolyteProduct}
              />
              {electrolyteProduct && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${textMuted}`}>
                  <Droplets className="w-3 h-3 text-blue-400" />
                  ~{Math.round(durationH * 2)} × {electrolyteProduct.sodium_mg}mg Na = <span className="text-blue-400 font-semibold">{Math.round(durationH * 2 * electrolyteProduct.sodium_mg)}mg additional sodium</span>
                </p>
              )}
            </div>

            {/* Caffeine product */}
            {output?.caffeine && output.caffeine.totalMg > 0 && (
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Caffeine Product
                  <span className="text-xs text-amber-400 ml-2 font-normal">target: {output.caffeine.totalMg}mg total</span>
                </label>
                <ProductSelector
                  products={products.filter((p) => p.caffeine_mg > 0)}
                  selectedId={caffeineProduct?.id}
                  placeholder="Search caffeinated products..."
                  onSelect={setCaffeineProduct}
                />
                {caffeineProduct && (
                  <p className={`text-xs mt-1 flex items-center gap-1 ${textMuted}`}>
                    <Zap className="w-3 h-3 text-amber-400" />
                    {caffeineProduct.caffeine_mg}mg per serving · use at key race moments
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Live preview */}
          {mainProduct && (
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: innerBg, border: innerBorder }}
            >
              <div className={`text-xs uppercase tracking-wider font-semibold mb-3 ${textMuted}`}>Race Nutrition Summary</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={textSecondary}>Primary fuel</span>
                  <span className={`font-semibold ${textPrimary}`}>{mainProduct.full_name}</span>
                </div>
                {servingsNeeded !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className={textSecondary}>Servings needed</span>
                    <span className="font-semibold text-yellow-500">{servingsNeeded} × {mainProduct.carbs_g}g = {servingsNeeded * mainProduct.carbs_g}g carbs</span>
                  </div>
                )}
                {electrolyteProduct && (
                  <div className="flex items-center justify-between text-sm">
                    <span className={textSecondary}>Electrolytes</span>
                    <span className="font-semibold text-blue-400">{Math.round(durationH * 2)} × {electrolyteProduct.product_name}</span>
                  </div>
                )}
                {caffeineProduct && (
                  <div className="flex items-center justify-between text-sm">
                    <span className={textSecondary}>Caffeine</span>
                    <span className="font-semibold text-amber-400">{caffeineProduct.product_name} · {caffeineProduct.caffeine_mg}mg</span>
                  </div>
                )}
              </div>

              {mainProduct.flavors && mainProduct.flavors.length > 0 && (
                <div className={`mt-3 pt-3 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                  <div className={`text-xs mb-2 ${textMuted}`}>Available flavors</div>
                  <div className="flex flex-wrap gap-1.5">
                    {mainProduct.flavors.slice(0, 8).map((f) => (
                      <span
                        key={f}
                        className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-white/8 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {f}
                      </span>
                    ))}
                    {mainProduct.flavors.length > 8 && (
                      <span className={`text-xs ${textMuted}`}>+{mainProduct.flavors.length - 8} more</span>
                    )}
                  </div>
                </div>
              )}

              {mainProduct.notes && (
                <div className={`mt-3 pt-3 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                  <p className={`text-xs leading-relaxed ${textMuted}`}>{mainProduct.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
