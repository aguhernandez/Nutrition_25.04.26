import { useState, useEffect, useRef } from 'react';
import { Search, X, CheckCircle, Zap, Droplets, Flame } from 'lucide-react';
import type { NutritionProduct, NutritionCategory } from '../../../types/nutrition';

interface Props {
  products: NutritionProduct[];
  categories?: NutritionCategory[];
  selectedId?: string;
  placeholder?: string;
  onSelect: (product: NutritionProduct | null) => void;
}

const categoryLabels: Record<NutritionCategory, string> = {
  drink: 'Sport Drink',
  gel: 'Energy Gel',
  chew: 'Energy Chew',
  bar: 'Energy Bar',
  electrolyte_tablet: 'Electrolyte',
};

const categoryColors: Record<NutritionCategory, string> = {
  drink: 'text-blue-400 bg-blue-400/10',
  gel: 'text-yellow-400 bg-yellow-400/10',
  chew: 'text-orange-400 bg-orange-400/10',
  bar: 'text-emerald-400 bg-emerald-400/10',
  electrolyte_tablet: 'text-teal-400 bg-teal-400/10',
};

const priceColors: Record<string, string> = {
  '$': 'text-green-400',
  '$$': 'text-yellow-400',
  '$$$': 'text-orange-400',
};

export default function ProductSelector({ products, categories, selectedId, placeholder = 'Search products...', onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<NutritionProduct | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedId) {
      const found = products.find((p) => p.id === selectedId);
      if (found) setSelected(found);
    } else {
      setSelected(null);
    }
  }, [selectedId, products]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = products
    .filter((p) => {
      if (categories && !categories.includes(p.category)) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return p.full_name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.notes.toLowerCase().includes(q);
    })
    .slice(0, 12);

  const handleSelect = (p: NutritionProduct) => {
    setSelected(p);
    setQuery(p.full_name);
    setOpen(false);
    onSelect(p);
  };

  const handleClear = () => {
    setSelected(null);
    setQuery('');
    onSelect(null);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {selected ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Search className="w-4 h-4 text-gray-500" />}
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={selected ? selected.full_name : query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); if (selected) { setSelected(null); onSelect(null); } }}
          onFocus={() => setOpen(true)}
          className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-sm bg-gray-800/80 text-white placeholder-gray-500 focus:outline-none transition-all ${selected ? 'border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20' : 'border-gray-700 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/40'}`}
        />
        {(selected || query) && (
          <button onClick={handleClear} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {selected && (
        <div className="mt-1.5 flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 rounded-xl px-3 py-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[selected.category]}`}>
            {categoryLabels[selected.category]}
          </span>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-yellow-400" />{selected.carbs_g}g carbs</span>
            <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-400" />{selected.sodium_mg}mg Na</span>
            {selected.caffeine_mg > 0 && <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" />{selected.caffeine_mg}mg caf</span>}
          </div>
          <span className={`ml-auto text-xs font-bold ${priceColors[selected.price_range]}`}>{selected.price_range}</span>
        </div>
      )}

      {open && !selected && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-4 py-5 text-center text-sm text-gray-500">No products found</div>
          ) : (
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-800/60">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onMouseDown={() => handleSelect(p)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-800/60 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-white truncate">{p.full_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className={`px-1.5 py-0.5 rounded-md ${categoryColors[p.category]}`}>{categoryLabels[p.category]}</span>
                      <span><Flame className="w-2.5 h-2.5 inline text-yellow-400 mr-0.5" />{p.carbs_g}g</span>
                      <span>{p.sodium_mg}mg Na</span>
                      {p.caffeine_mg > 0 && <span className="text-amber-400">{p.caffeine_mg}mg caf</span>}
                    </div>
                    {p.notes && <p className="text-xs text-gray-600 mt-0.5 truncate">{p.notes}</p>}
                  </div>
                  <span className={`text-xs font-bold flex-shrink-0 ${priceColors[p.price_range]}`}>{p.price_range}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
