import { useEffect, useMemo, useState } from 'react';
import { Check, Search, Star, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePreferences } from '../../lib/preferences';
import { getPreferredSupplementIds, isLocalProfileId, setPreferredSupplement } from '../../lib/preferredSupplements';
import type { NutritionProduct } from '../../types/nutrition';

interface Props {
  athleteId: string | null | undefined;
  athleteName?: string;
  editable?: boolean;
  compact?: boolean;
}

export default function PreferredSupplementsPanel({ athleteId, athleteName, editable = true, compact = false }: Props) {
  const { language, theme } = usePreferences();
  const isSpanish = language === 'es';
  const isDark = theme === 'dark';
  const [products, setProducts] = useState<NutritionProduct[]>([]);
  const [preferredIds, setPreferredIds] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      supabase.from('nutrition_products').select('*').order('brand').order('product_name'),
      getPreferredSupplementIds(athleteId),
    ]).then(([productsResult, preferencesResult]) => {
      if (!active) return;
      setProducts((productsResult.data as NutritionProduct[]) ?? []);
      setPreferredIds(preferencesResult.data);
      setLoading(false);
    });
    return () => { active = false; };
  }, [athleteId]);

  const preferredSet = useMemo(() => new Set(preferredIds), [preferredIds]);
  const visibleProducts = useMemo(() => products.filter((product) => {
    const value = query.trim().toLowerCase();
    return !value || `${product.brand} ${product.product_name} ${product.full_name}`.toLowerCase().includes(value);
  }), [products, query]);

  const toggle = async (productId: string) => {
    if (!editable || !isLocalProfileId(athleteId) || savingId) return;
    const nextPreferred = !preferredSet.has(productId);
    setSavingId(productId);
    setPreferredIds((current) => nextPreferred ? [...current, productId] : current.filter((id) => id !== productId));
    const { error } = await setPreferredSupplement(athleteId, productId, nextPreferred);
    if (error) setPreferredIds((current) => nextPreferred ? current.filter((id) => id !== productId) : [...current, productId]);
    setSavingId(null);
  };

  if (!isLocalProfileId(athleteId)) return null;

  return (
    <section className={`rounded-2xl ${compact ? 'p-4' : 'p-5'}`} style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}` }}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-heading text-lg" style={{ color: isDark ? '#fff' : '#514163' }}>
            {isSpanish ? 'Suplementos preferidos' : 'Preferred supplements'}
          </h2>
          <p className="font-body text-xs mt-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
            {athleteName ? `${athleteName} · ` : ''}{isSpanish ? 'aparecen primero al planificar una carrera.' : 'shown first when building a race plan.'}
          </p>
        </div>
        <Star className="w-5 h-5" style={{ color: '#fdda36', fill: '#fdda36' }} />
      </div>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isSpanish ? 'Buscar suplemento...' : 'Search supplement...'} className="w-full rounded-xl pl-9 pr-3 py-2 text-sm outline-none" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f9fafb', color: isDark ? '#fff' : '#1f2937', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}` }} />
      </div>
      {loading ? <div className="flex justify-center py-5"><Loader2 className="w-5 h-5 animate-spin" style={{ color: '#514163' }} /></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
          {visibleProducts.map((product) => {
            const preferred = preferredSet.has(product.id);
            return <button key={product.id} type="button" onClick={() => toggle(product.id)} disabled={!editable || savingId !== null} className="flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors" style={{ backgroundColor: preferred ? (isDark ? 'rgba(253,218,54,0.12)' : '#fffbea') : (isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb'), border: `1px solid ${preferred ? '#fdda36' : (isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb')}`, opacity: savingId && savingId !== product.id ? 0.65 : 1 }}>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: preferred ? '#fdda36' : (isDark ? 'rgba(255,255,255,0.08)' : '#fff'), color: preferred ? '#514163' : '#9ca3af' }}>
                {savingId === product.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : preferred ? <Check className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
              </span>
              <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold" style={{ color: isDark ? '#f3f4f6' : '#1f2937' }}>{product.full_name}</span><span className="block truncate text-[11px]" style={{ color: '#9ca3af' }}>{product.category} · {product.carbs_g}g carbs</span></span>
            </button>;
          })}
        </div>
      )}
    </section>
  );
}
