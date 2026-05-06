import { useState, useEffect } from 'react';
import { Flame, Droplets, Zap, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import type { NutritionProduct, NutritionCategory, RaceNutritionPlan, FuelType } from '../../../types/nutrition';
import type { Competition } from '../../../types/race';
import { supabase } from '../../../lib/supabase';
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
    const plan = buildPlan();
    onChange(plan);
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

  return (
    <div className="bg-white rounded-2xl overflow-hidden print:hidden" style={{ border: '2px solid #e5e7eb', boxShadow: '0 2px 10px rgba(81,65,99,0.06)' }}>
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-body font-semibold text-[#1f2937]">Nutrition Plan</span>
          <span className="font-body text-xs bg-[#f3f4f6] text-[#9ca3af] px-2 py-0.5 rounded-full">customize &amp; export</span>
        </div>
        <div>
          {collapsed ? <ChevronDown className="w-4 h-4 text-[#9ca3af]" /> : <ChevronUp className="w-4 h-4 text-[#9ca3af]" />}
        </div>
      </button>

      {!collapsed && (
        <div className="px-6 pb-6 space-y-5">
          {/* Targets summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center">
              <div className="text-xs text-yellow-400 font-semibold mb-1">Carb Target</div>
              <div className="text-xl font-bold text-white">{totalCarbsTarget}<span className="text-xs text-gray-500 ml-1">g total</span></div>
              <div className="text-xs text-gray-500">{targetCarbsGH}g/h</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
              <div className="text-xs text-blue-400 font-semibold mb-1">Sodium Target</div>
              <div className="text-xl font-bold text-white">{Math.round(sodiumTarget / 1000 * 10) / 10}<span className="text-xs text-gray-500 ml-1">g total</span></div>
              <div className="text-xs text-gray-500">{output?.hydration.sodiumMgH ?? 0}mg/h</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
              <div className="text-xs text-amber-400 font-semibold mb-1">Duration</div>
              <div className="text-xl font-bold text-white">{Math.floor(durationH)}<span className="text-xs text-gray-500">h </span>{Math.round((durationH % 1) * 60)}<span className="text-xs text-gray-500">m</span></div>
            </div>
          </div>

          {/* Primary fuel type */}
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Primary Fuel Type</div>
            <div className="grid grid-cols-2 gap-2">
              {FUEL_TYPES.map((ft) => (
                <button
                  key={ft.value}
                  onClick={() => setPrimaryFuelType(ft.value)}
                  className={`text-left p-3 rounded-xl border transition-all ${primaryFuelType === ft.value ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/60'}`}
                >
                  <div className={`text-sm font-semibold mb-0.5 ${primaryFuelType === ft.value ? 'text-yellow-300' : 'text-white'}`}>{ft.label}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{ft.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Product selection */}
          <div className="space-y-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Select Products</div>

            {/* Main fuel product */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {primaryFuelType === 'liquid' ? 'Sport Drink' : primaryFuelType === 'gel' ? 'Energy Gel' : primaryFuelType === 'chew' ? 'Energy Chew' : 'Energy Bar'}
                <span className="text-xs text-gray-500 ml-2 font-normal">primary source of carbs</span>
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
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Estimated <span className="text-yellow-400 font-semibold">{servingsNeeded} servings</span> needed to meet {totalCarbsTarget}g carb target
                </p>
              )}
            </div>

            {/* Electrolyte supplement */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Electrolyte Supplement
                <span className="text-xs text-gray-500 ml-2 font-normal">optional, for extra sodium</span>
              </label>
              <ProductSelector
                products={products}
                categories={['electrolyte_tablet', 'drink']}
                selectedId={electrolyteProduct?.id}
                placeholder="Search electrolyte products..."
                onSelect={setElectrolyteProduct}
              />
              {electrolyteProduct && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  ~{Math.round(durationH * 2)} × {electrolyteProduct.sodium_mg}mg Na = <span className="text-blue-400 font-semibold">{Math.round(durationH * 2 * electrolyteProduct.sodium_mg)}mg additional sodium</span>
                </p>
              )}
            </div>

            {/* Caffeine product (if using caffeine) */}
            {output?.caffeine && output.caffeine.totalMg > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
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
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    {caffeineProduct.caffeine_mg}mg per serving · use at key race moments
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Live preview */}
          {mainProduct && (
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Race Nutrition Summary</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Primary fuel</span>
                  <span className="font-semibold text-white">{mainProduct.full_name}</span>
                </div>
                {servingsNeeded !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Servings needed</span>
                    <span className="font-semibold text-yellow-300">{servingsNeeded} × {mainProduct.carbs_g}g = {servingsNeeded * mainProduct.carbs_g}g carbs</span>
                  </div>
                )}
                {electrolyteProduct && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Electrolytes</span>
                    <span className="font-semibold text-blue-300">{Math.round(durationH * 2)} × {electrolyteProduct.product_name}</span>
                  </div>
                )}
                {caffeineProduct && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Caffeine</span>
                    <span className="font-semibold text-amber-300">{caffeineProduct.product_name} · {caffeineProduct.caffeine_mg}mg</span>
                  </div>
                )}
              </div>

              {mainProduct.flavors && mainProduct.flavors.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <div className="text-xs text-gray-500 mb-2">Available flavors</div>
                  <div className="flex flex-wrap gap-1.5">
                    {mainProduct.flavors.slice(0, 8).map((f) => (
                      <span key={f} className="text-xs bg-gray-700/60 text-gray-300 px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                    {mainProduct.flavors.length > 8 && (
                      <span className="text-xs text-gray-600">+{mainProduct.flavors.length - 8} more</span>
                    )}
                  </div>
                </div>
              )}

              {mainProduct.notes && (
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <p className="text-xs text-gray-500 leading-relaxed">{mainProduct.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
