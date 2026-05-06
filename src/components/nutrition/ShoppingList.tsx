import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Check, ShoppingCart, RefreshCw, Loader2, X, BookOpen } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';
import {
  getShoppingList, insertShoppingItem, updateShoppingItem,
  deleteShoppingItem, clearCheckedItems, getRecipes,
} from '../../lib/nutritionService';
import type { ShoppingListItem, ShoppingCategory, Recipe } from '../../types/nutritionModule';

interface Props {
  onBack: () => void;
}

const CATEGORIES: { value: ShoppingCategory; label_en: string; label_es: string; icon: string; color: string; bg: string; border: string }[] = [
  { value: 'produce', label_en: 'Produce', label_es: 'Verduras', icon: '🥦', color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
  { value: 'protein', label_en: 'Protein', label_es: 'Proteínas', icon: '🥩', color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
  { value: 'dairy', label_en: 'Dairy', label_es: 'Lácteos', icon: '🥛', color: '#0369a1', bg: '#e0f2fe', border: '#7dd3fc' },
  { value: 'grains', label_en: 'Grains', label_es: 'Granos', icon: '🌾', color: '#b45309', bg: '#fef3c7', border: '#fcd34d' },
  { value: 'fats', label_en: 'Fats & Oils', label_es: 'Grasas y Aceites', icon: '🥑', color: '#15803d', bg: '#f0fdf4', border: '#86efac' },
  { value: 'supplements', label_en: 'Supplements', label_es: 'Suplementos', icon: '💊', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  { value: 'beverages', label_en: 'Beverages', label_es: 'Bebidas', icon: '💧', color: '#1d4ed8', bg: '#eff6ff', border: '#93c5fd' },
  { value: 'frozen', label_en: 'Frozen', label_es: 'Congelados', icon: '🧊', color: '#0e7490', bg: '#ecfeff', border: '#a5f3fc' },
  { value: 'pantry', label_en: 'Pantry', label_es: 'Despensa', icon: '🫙', color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  { value: 'other', label_en: 'Other', label_es: 'Otros', icon: '🛒', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
];

const QUICK_ADD_SUGGESTIONS = [
  { name_en: 'Bananas', name_es: 'Bananas', category: 'produce' as ShoppingCategory, unit: 'kg' },
  { name_en: 'Rice', name_es: 'Arroz', category: 'grains' as ShoppingCategory, unit: 'kg' },
  { name_en: 'Chicken breast', name_es: 'Pechuga de pollo', category: 'protein' as ShoppingCategory, unit: 'kg' },
  { name_en: 'Greek yogurt', name_es: 'Yogur griego', category: 'dairy' as ShoppingCategory, unit: 'units' },
  { name_en: 'Oats', name_es: 'Avena', category: 'grains' as ShoppingCategory, unit: 'kg' },
  { name_en: 'Eggs', name_es: 'Huevos', category: 'protein' as ShoppingCategory, unit: 'dozen' },
  { name_en: 'Olive oil', name_es: 'Aceite de oliva', category: 'fats' as ShoppingCategory, unit: 'L' },
  { name_en: 'Sweet potato', name_es: 'Batata', category: 'produce' as ShoppingCategory, unit: 'kg' },
  { name_en: 'Electrolyte tabs', name_es: 'Tabletas electrolitos', category: 'supplements' as ShoppingCategory, unit: 'box' },
  { name_en: 'Protein powder', name_es: 'Proteína en polvo', category: 'supplements' as ShoppingCategory, unit: 'kg' },
];

function RecipeImportModal({
  userId,
  onImport,
  onClose,
  es,
}: {
  userId: string;
  onImport: (items: Omit<ShoppingListItem, 'id' | 'created_at'>[]) => void;
  onClose: () => void;
  es: boolean;
}) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    getRecipes(userId).then(({ data }) => { setRecipes(data); setLoading(false); });
  }, [userId]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  function ingredientToCategory(name: string): ShoppingCategory {
    const n = name.toLowerCase();
    if (/chicken|beef|pork|tuna|salmon|fish|egg|turkey|meat|pollo|carne|cerdo|atún|salmón|pescado|huevo/.test(n)) return 'protein';
    if (/milk|yogurt|cheese|dairy|leche|queso|cream|crema/.test(n)) return 'dairy';
    if (/rice|pasta|bread|oat|flour|arroz|pan|avena|harina|quinoa|barley/.test(n)) return 'grains';
    if (/oil|butter|aceite|manteca|mantequilla|avocado|aguacate|nuts|almonds|walnuts|peanut/.test(n)) return 'fats';
    if (/protein powder|creatine|caffeine|supplement|whey|casein|bcaa/.test(n)) return 'supplements';
    if (/water|juice|tea|coffee|agua|jugo|té|café|sport|drink/.test(n)) return 'beverages';
    if (/frozen|ice|congelado/.test(n)) return 'frozen';
    if (/sugar|salt|pepper|sauce|vinegar|spice|azucar|sal|pimienta|salsa|vinagre|especia/.test(n)) return 'pantry';
    return 'produce';
  }

  const handleImport = () => {
    setImporting(true);
    const selectedRecipes = recipes.filter((r) => selected.has(r.id));
    const ingredientMap = new Map<string, { qty: number; unit: string; cat: ShoppingCategory }>();
    for (const recipe of selectedRecipes) {
      for (const ing of recipe.ingredients) {
        const key = ing.name.toLowerCase().trim();
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.qty += ing.quantity;
        } else {
          ingredientMap.set(key, { qty: ing.quantity, unit: ing.unit, cat: ingredientToCategory(ing.name) });
        }
      }
    }
    const items: Omit<ShoppingListItem, 'id' | 'created_at'>[] = Array.from(ingredientMap.entries()).map(([name, { qty, unit, cat }], i) => ({
      user_id: userId,
      meal_plan_id: null,
      item_name: name.charAt(0).toUpperCase() + name.slice(1),
      quantity: Math.round(qty * 10) / 10,
      unit,
      category: cat,
      is_checked: false,
      sort_order: i,
      notes: `${es ? 'De' : 'From'}: ${selectedRecipes.filter((r) => r.ingredients.some((ing) => ing.name.toLowerCase().trim() === name)).map((r) => r.name_es || r.name).join(', ')}`,
    }));
    onImport(items);
    setImporting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col" style={{ border: '2px solid #e5e7eb' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white" style={{ borderColor: '#f3f4f6' }}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: '#b45309' }} />
            <div>
              <h3 className="font-semibold" style={{ color: '#1f2937' }}>{es ? 'Importar desde Recetas' : 'Import from Recipes'}</h3>
              <p className="text-xs" style={{ color: '#9ca3af' }}>
                {selected.size} {es ? `receta${selected.size !== 1 ? 's' : ''} seleccionada${selected.size !== 1 ? 's' : ''}` : `recipe${selected.size !== 1 ? 's' : ''} selected`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#514163' }} /></div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-8 text-sm" style={{ color: '#9ca3af' }}>{es ? 'No hay recetas disponibles' : 'No recipes available'}</div>
          ) : recipes.map((recipe) => {
            const isSelected = selected.has(recipe.id);
            const displayName = recipe.name_es || recipe.name;
            return (
              <button
                key={recipe.id}
                onClick={() => toggle(recipe.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all"
                style={{
                  borderColor: isSelected ? '#b45309' : '#e5e7eb',
                  backgroundColor: isSelected ? '#fef3c7' : '#fff',
                }}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all"
                  style={{
                    borderColor: isSelected ? '#b45309' : '#d1d5db',
                    backgroundColor: isSelected ? '#b45309' : 'transparent',
                  }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate" style={{ color: '#1f2937' }}>{displayName}</div>
                  <div className="text-xs" style={{ color: '#9ca3af' }}>
                    {recipe.ingredients.length} {es ? 'ingredientes' : 'ingredients'} · {Math.round(recipe.calories_kcal)} kcal
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-5 py-4 border-t" style={{ borderColor: '#f3f4f6' }}>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border font-medium text-sm" style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
              {es ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              onClick={handleImport}
              disabled={importing || selected.size === 0}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
              {es ? `Generar lista (${selected.size})` : `Generate list (${selected.size})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShoppingList({ onBack }: Props) {
  const { user } = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';

  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showRecipeImport, setShowRecipeImport] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    item_name: '',
    quantity: 1,
    unit: 'unit',
    category: 'other' as ShoppingCategory,
    notes: '',
  });

  useEffect(() => {
    if (!user?.id || user.id.startsWith('demo-')) {
      setLoading(false);
      return;
    }
    getShoppingList(user.id).then(({ data }) => {
      setItems(data);
      setLoading(false);
    });
  }, [user?.id]);

  const handleToggle = async (item: ShoppingListItem) => {
    const updated = { ...item, is_checked: !item.is_checked };
    await updateShoppingItem(item.id, { is_checked: updated.is_checked });
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  };

  const handleDelete = async (id: string) => {
    await deleteShoppingItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearChecked = async () => {
    if (!user?.id) return;
    await clearCheckedItems(user.id);
    setItems((prev) => prev.filter((i) => !i.is_checked));
  };

  const handleAdd = async () => {
    if (!user?.id || !form.item_name.trim()) return;
    setSaving(true);
    const { data } = await insertShoppingItem({
      user_id: user.id,
      meal_plan_id: null,
      is_checked: false,
      sort_order: items.length,
      ...form,
    });
    if (data) setItems((prev) => [...prev, data]);
    setSaving(false);
    setShowAdd(false);
    setForm({ item_name: '', quantity: 1, unit: 'unit', category: 'other', notes: '' });
  };

  const handleRecipeImport = async (newItems: Omit<ShoppingListItem, 'id' | 'created_at'>[]) => {
    if (!user?.id) return;
    const inserted: ShoppingListItem[] = [];
    for (const item of newItems) {
      const { data } = await insertShoppingItem(item);
      if (data) inserted.push(data);
    }
    setItems((prev) => [...prev, ...inserted]);
    setShowRecipeImport(false);
  };

  const handleQuickAdd = async (suggestion: typeof QUICK_ADD_SUGGESTIONS[0]) => {
    if (!user?.id) return;
    const { data } = await insertShoppingItem({
      user_id: user.id,
      meal_plan_id: null,
      item_name: es ? suggestion.name_es : suggestion.name_en,
      quantity: 1,
      unit: suggestion.unit,
      category: suggestion.category,
      is_checked: false,
      sort_order: items.length,
      notes: '',
    });
    if (data) setItems((prev) => [...prev, data]);
  };

  const checkedCount = items.filter((i) => i.is_checked).length;
  const totalCount = items.length;

  const groupedItems = CATEGORIES.reduce((acc, cat) => {
    const catItems = items.filter((i) => i.category === cat.value);
    if (catItems.length > 0) acc[cat.value] = catItems;
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl border hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb' }}>
          <ChevronLeft className="w-4 h-4" style={{ color: '#6b7280' }} />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fdf2f8' }}>
            <ShoppingCart className="w-4 h-4" style={{ color: '#be185d' }} />
          </div>
          <div>
            <h1 className="font-heading text-xl" style={{ color: '#1f2937' }}>{es ? 'Lista de Compras' : 'Shopping List'}</h1>
            {totalCount > 0 && (
              <p className="text-xs" style={{ color: '#9ca3af' }}>{checkedCount}/{totalCount} {es ? 'items marcados' : 'items checked'}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {checkedCount > 0 && (
            <button
              onClick={handleClearChecked}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all hover:bg-gray-50"
              style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
            >
              <RefreshCw className="w-3 h-3" /> {es ? 'Limpiar' : 'Clear'}
            </button>
          )}
          <button
            onClick={() => setShowRecipeImport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all hover:bg-gray-50"
            style={{ borderColor: '#b45309', color: '#b45309', backgroundColor: '#fef3c7' }}
          >
            <BookOpen className="w-3.5 h-3.5" /> {es ? 'De Recetas' : 'From Recipes'}
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}
          >
            <Plus className="w-4 h-4" /> {es ? 'Agregar' : 'Add'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(checkedCount / totalCount) * 100}%`,
                backgroundColor: checkedCount === totalCount ? '#10b981' : '#fdda36',
              }}
            />
          </div>
        </div>
      )}

      {/* Quick Add Suggestions */}
      {items.length === 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9ca3af' }}>{es ? 'Agregar rápido' : 'Quick Add'}</div>
          <div className="flex flex-wrap gap-2">
            {QUICK_ADD_SUGGESTIONS.map((s) => (
              <button
                key={s.name_en}
                onClick={() => handleQuickAdd(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all hover:bg-gray-50"
                style={{ borderColor: '#e5e7eb', color: '#374151' }}
              >
                <Plus className="w-3 h-3" /> {es ? s.name_es : s.name_en}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {items.length === 0 && (
        <div className="text-center py-10 bg-white rounded-2xl" style={{ border: '2px solid #e5e7eb' }}>
          <ShoppingCart className="w-12 h-12 mx-auto mb-3" style={{ color: '#d1d5db' }} />
          <h3 className="font-semibold mb-1" style={{ color: '#1f2937' }}>{es ? 'Tu lista está vacía' : 'Your list is empty'}</h3>
          <p className="text-sm mb-4" style={{ color: '#9ca3af' }}>{es ? 'Agrega items manualmente o usa las sugerencias de arriba' : 'Add items manually or use quick-add suggestions above'}</p>
          <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-semibold text-sm" style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}>
            {es ? 'Agregar primer item' : 'Add First Item'}
          </button>
        </div>
      )}

      {/* Grouped Items */}
      {Object.entries(groupedItems).map(([catValue, catItems]) => {
        const cat = CATEGORIES.find((c) => c.value === catValue)!;
        return (
          <div key={catValue} className="bg-white rounded-2xl overflow-hidden" style={{ border: '2px solid #e5e7eb' }}>
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ backgroundColor: cat.bg, borderBottom: `1px solid ${cat.border}` }}
            >
              <span>{cat.icon}</span>
              <span className="text-sm font-semibold" style={{ color: cat.color }}>{es ? cat.label_es : cat.label_en}</span>
              <span className="text-xs ml-auto" style={{ color: cat.color, opacity: 0.7 }}>
                {catItems.filter((i) => i.is_checked).length}/{catItems.length}
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: '#f9fafb' }}>
              {catItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3 group hover:bg-gray-50 transition-all"
                >
                  <button
                    onClick={() => handleToggle(item)}
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderColor: item.is_checked ? '#10b981' : '#d1d5db',
                      backgroundColor: item.is_checked ? '#10b981' : 'transparent',
                    }}
                  >
                    {item.is_checked && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: item.is_checked ? '#9ca3af' : '#1f2937',
                        textDecoration: item.is_checked ? 'line-through' : 'none',
                      }}
                    >
                      {item.item_name}
                    </span>
                    <span className="text-xs ml-2" style={{ color: '#9ca3af' }}>
                      {item.quantity} {item.unit}
                    </span>
                    {item.notes && <p className="text-xs" style={{ color: '#9ca3af' }}>{item.notes}</p>}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Add Item Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl w-full max-w-md" style={{ border: '2px solid #e5e7eb' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#f3f4f6' }}>
              <h3 className="font-semibold" style={{ color: '#1f2937' }}>{es ? 'Agregar Item' : 'Add Item'}</h3>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" style={{ color: '#6b7280' }} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{es ? 'Nombre del item *' : 'Item Name *'}</label>
                <input
                  type="text"
                  value={form.item_name}
                  onChange={(e) => setForm((f) => ({ ...f, item_name: e.target.value }))}
                  placeholder={es ? 'ej. Bananas' : 'e.g. Bananas'}
                  className="input-brand"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{es ? 'Cantidad' : 'Quantity'}</label>
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={form.quantity}
                    onChange={(e) => setForm((f) => ({ ...f, quantity: parseFloat(e.target.value) || 1 }))}
                    className="input-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{es ? 'Unidad' : 'Unit'}</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                    placeholder={es ? 'kg, caja, unidad...' : 'kg, box, unit...'}
                    className="input-brand"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>{es ? 'Categoría' : 'Category'}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, category: c.value }))}
                      className="flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all"
                      style={{
                        borderColor: form.category === c.value ? c.color : '#e5e7eb',
                        backgroundColor: form.category === c.value ? c.bg : '#ffffff',
                        color: form.category === c.value ? c.color : '#374151',
                      }}
                    >
                      <span>{c.icon}</span> {es ? c.label_es : c.label_en}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>{es ? 'Notas' : 'Notes'}</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder={es ? 'opcional' : 'optional'}
                  className="input-brand"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl border font-medium text-sm" style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
                  {es ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={handleAdd}
                  disabled={saving || !form.item_name.trim()}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#fdda36', color: '#3b2a50' }}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {es ? 'Agregar Item' : 'Add Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRecipeImport && user?.id && (
        <RecipeImportModal
          userId={user.id}
          onImport={handleRecipeImport}
          onClose={() => setShowRecipeImport(false)}
          es={es}
        />
      )}
    </div>
  );
}
