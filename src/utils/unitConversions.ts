export interface UnitOption {
  value: string;
  label_es: string;
  label_en: string;
  toGrams: number;
  isLiquid?: boolean;
}

export const UNIT_OPTIONS: UnitOption[] = [
  { value: 'g', label_es: 'gramos', label_en: 'grams', toGrams: 1 },
  { value: 'kg', label_es: 'kilogramos', label_en: 'kilograms', toGrams: 1000 },
  { value: 'oz', label_es: 'onzas', label_en: 'ounces', toGrams: 28.3495 },
  { value: 'lb', label_es: 'libras', label_en: 'pounds', toGrams: 453.592 },
  { value: 'mg', label_es: 'miligramos', label_en: 'milligrams', toGrams: 0.001 },
  { value: 'ml', label_es: 'mililitros', label_en: 'milliliters', toGrams: 1, isLiquid: true },
  { value: 'l', label_es: 'litros', label_en: 'liters', toGrams: 1000, isLiquid: true },
  { value: 'tsp', label_es: 'cucharadita', label_en: 'teaspoon', toGrams: 5 },
  { value: 'tbsp', label_es: 'cucharada', label_en: 'tablespoon', toGrams: 15 },
  { value: 'cup', label_es: 'taza', label_en: 'cup', toGrams: 240 },
  { value: 'fl_oz', label_es: 'onzas líquidas', label_en: 'fluid ounces', toGrams: 29.5735, isLiquid: true },
  { value: 'pinta', label_es: 'pinta', label_en: 'pint', toGrams: 473.176, isLiquid: true },
  { value: 'slice', label_es: 'rebanada', label_en: 'slice', toGrams: 30 },
  { value: 'piece', label_es: 'pieza', label_en: 'piece', toGrams: 100 },
  { value: 'unit', label_es: 'unidad', label_en: 'unit', toGrams: 100 },
  { value: 'handful', label_es: 'puñado', label_en: 'handful', toGrams: 30 },
  { value: 'can', label_es: 'lata', label_en: 'can', toGrams: 200 },
];

export function convertToGrams(quantity: number, unit: string): number {
  const opt = UNIT_OPTIONS.find((u) => u.value === unit);
  if (!opt) return quantity;
  return Math.round(quantity * opt.toGrams * 100) / 100;
}

export function getUnitLabel(unit: string, es: boolean): string {
  const opt = UNIT_OPTIONS.find((u) => u.value === unit);
  if (!opt) return unit;
  return es ? opt.label_es : opt.label_en;
}
