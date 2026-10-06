import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, ChevronDown, Plus, Save, Trash2, Loader2, Check, Search,
  GripVertical, X, Settings, Copy, Clock, TrendingUp, TrendingDown,
  Minus, Utensils, FlameKindling, Apple, ShoppingBag, BookOpen, Dumbbell,
  RotateCcw, Sliders, Send, LayoutList, Calendar, AlertTriangle, Activity,
} from 'lucide-react';
import TrainingSneakPeek from '../views/TrainingSneakPeek';
import HubHabitsCard from './HubHabitsCard';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';
import { supabase } from '../../lib/supabase';
import { pushNutritionPlan } from '../../lib/hubApi';
import {
  DEFAULT_WEEK_PATTERN, FUEL_DAY_LABELS, getDayTargetMacros, getMealTypeIcon, getMealTypeLabel,
} from '../../utils/nutritionCalculations';
import { getTagsForMealPlan, setTagsForMealPlan, syncAthleteTagsToHub } from '../../lib/tagService';
import type { Tag } from '../../lib/tagService';
import TagSelector from '../shared/TagSelector';

const DAY_NAMES_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DAY_NAMES_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MEAL_SLOTS = [
  { key: 'breakfast', defaultTime: '08:00' },
  { key: 'morning_snack', defaultTime: '10:30' },
  { key: 'pre_training', defaultTime: '12:00' },
  { key: 'lunch', defaultTime: '13:00' },
  { key: 'during_training', defaultTime: '15:00' },
  { key: 'post_training', defaultTime: '16:30' },
  { key: 'afternoon_snack', defaultTime: '17:00' },
  { key: 'dinner', defaultTime: '20:00' },
  { key: 'evening_snack', defaultTime: '22:00' },
];

type FoodTypeTab = 'foods' | 'products' | 'recipes' | 'supplements' | 'templates';

const FOOD_TYPE_TABS: { key: FoodTypeTab; labelEs: string; labelEn: string; icon: React.ReactNode; categories: string[] }[] = [
  {
    key: 'foods',
    labelEs: 'Alimentos',
    labelEn: 'Foods',
    icon: null,
    categories: ['grains', 'fruits_veg', 'meat_fish', 'dairy', 'legumes', 'eggs', 'oils_fats', 'other'],
  },
  {
    key: 'products',
    labelEs: 'Productos',
    labelEn: 'Products',
    icon: null,
    categories: ['products', 'processed', 'dairy_product', 'condiment', 'bakery', 'beverage'],
  },
  {
    key: 'recipes',
    labelEs: 'Recetas',
    labelEn: 'Recipes',
    icon: null,
    categories: ['recipe'],
  },
  {
    key: 'supplements',
    labelEs: 'Suplementos',
    labelEn: 'Supplements',
    icon: null,
    categories: ['supplements', 'supplement'],
  },
  {
    key: 'templates',
    labelEs: 'Templates',
    labelEn: 'Templates',
    icon: null,
    categories: [],
  },
];

const FOOD_SUBCATEGORIES: Record<FoodTypeTab, { value: string; labelEs: string; labelEn: string }[]> = {
  foods: [
    { value: '', labelEs: 'Todos', labelEn: 'All' },
    { value: 'grains', labelEs: 'Granos y Tubérculos', labelEn: 'Grains & Tubers' },
    { value: 'fruits_veg', labelEs: 'Frutas y Verduras', labelEn: 'Fruits & Veg' },
    { value: 'meat_fish', labelEs: 'Carnes y Pescados', labelEn: 'Meat & Fish' },
    { value: 'dairy', labelEs: 'Lácteos', labelEn: 'Dairy' },
    { value: 'legumes', labelEs: 'Legumbres', labelEn: 'Legumes' },
    { value: 'eggs', labelEs: 'Huevos', labelEn: 'Eggs' },
    { value: 'oils_fats', labelEs: 'Aceites y Grasas', labelEn: 'Oils & Fats' },
  ],
  products: [
    { value: '', labelEs: 'Todos', labelEn: 'All' },
    { value: 'dairy_product', labelEs: 'Lácteos Procesados', labelEn: 'Dairy Products' },
    { value: 'bakery', labelEs: 'Panadería', labelEn: 'Bakery' },
    { value: 'beverage', labelEs: 'Bebidas', labelEn: 'Beverages' },
    { value: 'condiment', labelEs: 'Condimentos', labelEn: 'Condiments' },
  ],
  recipes: [
    { value: '', labelEs: 'Todas', labelEn: 'All' },
  ],
  supplements: [
    { value: '', labelEs: 'Todos', labelEn: 'All' },
    { value: 'powder', labelEs: 'Polvo', labelEn: 'Powder' },
    { value: 'gel', labelEs: 'Gel', labelEn: 'Gel' },
    { value: 'bar', labelEs: 'Barra', labelEn: 'Bar' },
    { value: 'capsule', labelEs: 'Cápsula', labelEn: 'Capsule' },
    { value: 'tablet', labelEs: 'Tableta', labelEn: 'Tablet' },
    { value: 'liquid', labelEs: 'Líquido', labelEn: 'Liquid' },
    { value: 'chew', labelEs: 'Masticable', labelEn: 'Chew' },
  ],
  templates: [
    { value: '', labelEs: 'Todos', labelEn: 'All' },
    { value: 'balanced', labelEs: 'Balanceado', labelEn: 'Balanced' },
    { value: 'high_protein', labelEs: 'Alto Proteína', labelEn: 'High Protein' },
    { value: 'endurance', labelEs: 'Resistencia', labelEn: 'Endurance' },
    { value: 'weight_loss', labelEs: 'Pérdida de Peso', labelEn: 'Weight Loss' },
  ],
};

const MACRO_FILTERS = [
  { value: '', label_es: 'Todos', label_en: 'All' },
  { value: 'high_protein', label_es: 'Alto Proteína', label_en: 'High Protein', minPer100: { p: 15 } },
  { value: 'high_carb', label_es: 'Alto Carbo', label_en: 'High Carb', minPer100: { c: 40 } },
  { value: 'low_carb', label_es: 'Bajo Carbo', label_en: 'Low Carb', maxPer100: { c: 10 } },
  { value: 'high_fat', label_es: 'Alto Grasa', label_en: 'High Fat', minPer100: { f: 15 } },
  { value: 'low_fat', label_es: 'Bajo Grasa', label_en: 'Low Fat', maxPer100: { f: 5 } },
];

interface FoodV2 {
  id: string;
  name_es: string;
  name_en: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  source?: string;
  is_verified?: boolean;
  off_product_id?: string;
  product_form?: string;
  brand?: string;
  vitamin_a_mcg?: number;
  vitamin_c_mg?: number;
  vitamin_d_mcg?: number;
  vitamin_e_mg?: number;
  vitamin_k_mcg?: number;
  vitamin_b1_mg?: number;
  vitamin_b2_mg?: number;
  vitamin_b3_mg?: number;
  vitamin_b6_mg?: number;
  vitamin_b12_mcg?: number;
  folate_mcg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  magnesium_mg?: number;
  phosphorus_mg?: number;
  potassium_mg?: number;
  zinc_mg?: number;
  sodium_mg?: number;
}

interface RecipeIngredient {
  name: string;
  name_es?: string;
  quantity_g?: number;
  unit?: string;
}

interface RecipeItem {
  id: string;
  name: string;
  name_es?: string;
  name_en?: string;
  calories_per_100g?: number;
  protein_per_100g?: number;
  carbs_per_100g?: number;
  fat_per_100g?: number;
  is_public?: boolean;
  category?: string;
  servings?: number;
  prep_time_min?: number;
  cook_time_min?: number;
  ingredients?: RecipeIngredient[];
}

interface MealItem {
  id: string;
  food_id: string;
  food_name: string;
  quantity_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  food?: FoodV2;
  item_type?: 'food' | 'recipe' | 'supplement' | 'product';
  brand?: string;
  supplement_type?: string;
  serving_unit?: string;
  recipe_data?: {
    id: string;
    servings?: number;
    prep_time_min?: number;
    cook_time_min?: number;
    ingredients?: RecipeIngredient[];
  };
}

interface Meal {
  id: string;
  name: string;
  type: string;
  time?: string;
  items: MealItem[];
}

interface DayPlan {
  day: number;
  meals: Meal[];
}

interface DayOverride {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface ActivePlan {
  id: string;
  title: string;
  athlete_name?: string;
  calories_goal: number;
  protein_goal: number;
  carbs_goal: number;
  fats_goal: number;
  duration_days: number;
  start_date: string;
  plan_mode: 'template' | 'calendar';
  day_names: Record<string, string>;
  week_pattern: Array<'green' | 'yellow' | 'red'>;
  day_overrides: Record<string, DayOverride>;
}

interface MealPlanTemplate {
  id: string;
  name: string;
  name_es: string;
  calories_target: number;
  focus: string;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  days: any;
}

interface Props {
  onBack: () => void;
  targetUserId?: string;
  targetUserName?: string;
  targetUserEmail?: string;
}

function calcItemMacros(food: FoodV2 | RecipeItem, qty: number) {
  const r = qty / 100;
  const f = food as FoodV2;
  return {
    calories: Math.round((f.calories_per_100g || 0) * r),
    protein_g: Math.round((f.protein_per_100g || 0) * r * 10) / 10,
    carbs_g: Math.round((f.carbs_per_100g || 0) * r * 10) / 10,
    fat_g: Math.round((f.fat_per_100g || 0) * r * 10) / 10,
  };
}

function sumMeals(meals: Meal[]) {
  return meals.reduce(
    (acc, m) => {
      m.items.forEach((i) => {
        acc.calories += i.calories;
        acc.protein_g += i.protein_g;
        acc.carbs_g += i.carbs_g;
        acc.fat_g += i.fat_g;
      });
      return acc;
    },
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  );
}

function applyMacroFilter(food: FoodV2, filter: string): boolean {
  if (!filter) return true;
  const f = MACRO_FILTERS.find((m) => m.value === filter);
  if (!f) return true;
  if (f.minPer100) {
    if ((f.minPer100 as any).p && food.protein_per_100g < (f.minPer100 as any).p) return false;
    if ((f.minPer100 as any).c && food.carbs_per_100g < (f.minPer100 as any).c) return false;
    if ((f.minPer100 as any).f && food.fat_per_100g < (f.minPer100 as any).f) return false;
    if ((f.minPer100 as any).kcal && food.calories_per_100g < (f.minPer100 as any).kcal) return false;
  }
  if (f.maxPer100) {
    if ((f.maxPer100 as any).c !== undefined && food.carbs_per_100g > (f.maxPer100 as any).c) return false;
    if ((f.maxPer100 as any).f !== undefined && food.fat_per_100g > (f.maxPer100 as any).f) return false;
  }
  return true;
}

function isFoodInTab(food: FoodV2, tab: FoodTypeTab): boolean {
  const cat = food.category?.toLowerCase() || '';
  if (tab === 'supplements') return cat.includes('supplement');
  if (tab === 'recipes') return cat === 'recipe';
  if (tab === 'products') {
    return cat.includes('product') || cat.includes('processed') || cat.includes('condiment') ||
      cat.includes('bakery') || cat === 'beverage' || cat === 'yogurt' || cat === 'cheese';
  }
  return !cat.includes('supplement') && cat !== 'recipe' &&
    !cat.includes('product') && !cat.includes('processed') &&
    !cat.includes('condiment') && cat !== 'bakery' && cat !== 'beverage';
}

function calcMicronutrients(weekPlans: DayPlan[], selectedDay: number) {
  const day = weekPlans[selectedDay];
  if (!day) return null;

  let vA = 0, vB1 = 0, vB2 = 0, vB3 = 0, vB6 = 0, vB12 = 0, vC = 0, vD = 0, vE = 0, vK = 0, folate = 0;
  let calcium = 0, iron = 0, magnesium = 0, phosphorus = 0, potassium = 0, zinc = 0, sodium = 0;

  day.meals.forEach((m) => {
    m.items.forEach((item) => {
      const food = item.food;
      if (!food) return;
      const r = item.quantity_g / 100;
      vA += (food.vitamin_a_mcg || 0) * r;
      vB1 += (food.vitamin_b1_mg || 0) * r;
      vB2 += (food.vitamin_b2_mg || 0) * r;
      vB3 += (food.vitamin_b3_mg || 0) * r;
      vB6 += (food.vitamin_b6_mg || 0) * r;
      vB12 += (food.vitamin_b12_mcg || 0) * r;
      vC += (food.vitamin_c_mg || 0) * r;
      vD += (food.vitamin_d_mcg || 0) * r;
      vE += (food.vitamin_e_mg || 0) * r;
      vK += (food.vitamin_k_mcg || 0) * r;
      folate += (food.folate_mcg || 0) * r;
      calcium += (food.calcium_mg || 0) * r;
      iron += (food.iron_mg || 0) * r;
      magnesium += (food.magnesium_mg || 0) * r;
      phosphorus += (food.phosphorus_mg || 0) * r;
      potassium += (food.potassium_mg || 0) * r;
      zinc += (food.zinc_mg || 0) * r;
      sodium += (food.sodium_mg || 0) * r;
    });
  });

  return {
    vitamins: [
      { name: 'Vitamin A', value: vA, unit: 'mcg', rdi: 900 },
      { name: 'Vitamin B1', value: vB1, unit: 'mg', rdi: 1.2 },
      { name: 'Vitamin B2', value: vB2, unit: 'mg', rdi: 1.3 },
      { name: 'Vitamin B3', value: vB3, unit: 'mg', rdi: 16 },
      { name: 'Vitamin B6', value: vB6, unit: 'mg', rdi: 1.7 },
      { name: 'Vitamin B12', value: vB12, unit: 'mcg', rdi: 2.4 },
      { name: 'Vitamin C', value: vC, unit: 'mg', rdi: 90 },
      { name: 'Vitamin D', value: vD, unit: 'mcg', rdi: 20 },
      { name: 'Vitamin E', value: vE, unit: 'mg', rdi: 15 },
      { name: 'Vitamin K', value: vK, unit: 'mcg', rdi: 120 },
      { name: 'Folate', value: folate, unit: 'mcg', rdi: 400 },
    ],
    minerals: [
      { name: 'Calcium', value: calcium, unit: 'mg', rdi: 1000 },
      { name: 'Iron', value: iron, unit: 'mg', rdi: 8 },
      { name: 'Magnesium', value: magnesium, unit: 'mg', rdi: 420 },
      { name: 'Phosphorus', value: phosphorus, unit: 'mg', rdi: 700 },
      { name: 'Potassium', value: potassium, unit: 'mg', rdi: 3400 },
      { name: 'Zinc', value: zinc, unit: 'mg', rdi: 11 },
      { name: 'Sodium', value: sodium, unit: 'mg', rdi: 2300 },
    ],
  };
}

export default function FullMealEditor({ onBack, targetUserId, targetUserName, targetUserEmail }: Props) {
  const { profile } = useAuth();
  const { language } = usePreferences();
  const es = language === 'es';
  const effectiveUserId = targetUserId ?? profile?.id;
  const isDemo = !effectiveUserId || effectiveUserId.startsWith('demo-');
  const resolvedEmail = targetUserEmail ?? profile?.email;
  const resolvedName = targetUserName ?? profile?.full_name;

  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const [weekPlans, setWeekPlans] = useState<DayPlan[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(1);
  const totalWeeks = activePlan ? Math.ceil(activePlan.duration_days / 7) : 1;
  const [foods, setFoods] = useState<FoodV2[]>([]);
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [foodSearch, setFoodSearch] = useState('');
  const [foodTypeTab, setFoodTypeTab] = useState<FoodTypeTab>('foods');
  const [foodSubCategory, setFoodSubCategory] = useState('');
  const [macroFilter, setMacroFilter] = useState('');
  const [offResults, setOffResults] = useState<FoodV2[]>([]);
  const [offLoading, setOffLoading] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState<{ itemId: string; fromMealId: string } | null>(null);
  const [draggingFood, setDraggingFood] = useState<FoodV2 | null>(null);
  const [dragOverMealId, setDragOverMealId] = useState<string | null>(null);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [showCustomizeDays, setShowCustomizeDays] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [foodModalMealId, setFoodModalMealId] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [dayOverrides, setDayOverrides] = useState<Record<string, DayOverride>>({});
  const [newPlanForm, setNewPlanForm] = useState({
    title: '', calories_goal: 2000, protein_goal: 150, carbs_goal: 250, fats_goal: 70, duration_days: 7,
    week_pattern: [...DEFAULT_WEEK_PATTERN] as Array<'green' | 'yellow' | 'red'>,
  });
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [customDayNames, setCustomDayNames] = useState<Record<string, string>>({});
  const [customWeekPattern, setCustomWeekPattern] = useState<Array<'green' | 'yellow' | 'red'>>(DEFAULT_WEEK_PATTERN);
  const [pushingToHub, setPushingToHub] = useState(false);
  const [pushHubResult, setPushHubResult] = useState<'success' | 'error' | null>(null);
  const [allPlans, setAllPlans] = useState<{ id: string; title: string; duration_days: number; created_at: string; status: string }[]>([]);
  const [showPlansPanel, setShowPlansPanel] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<MealPlanTemplate[]>([]);
  const [templateFocusFilter, setTemplateFocusFilter] = useState('');
  const [suppFormFilter, setSuppFormFilter] = useState('');
  const [suppPage, setSuppPage] = useState(0);
  const [showTemplateModal, setShowTemplateModal] = useState<MealPlanTemplate | null>(null);
  const [showTrainingDrawer, setShowTrainingDrawer] = useState(false);
  const [planStartDate, setPlanStartDate] = useState<string>('');
  const [editingStartDate, setEditingStartDate] = useState(false);
  const [planMode, setPlanMode] = useState<'template' | 'calendar'>('template');
  const [planTags, setPlanTags] = useState<Tag[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = (esStr: string, en: string) => es ? esStr : en;
  const dayNames = es ? DAY_NAMES_ES : DAY_NAMES_EN;

  const getDayDate = (dayIndex: number): Date | null => {
    if (planMode !== 'calendar' || !planStartDate) return null;
    const base = new Date(planStartDate + 'T12:00:00');
    const d = new Date(base);
    d.setDate(base.getDate() + dayIndex);
    return d;
  };

  const formatDayLabel = (dayIndex: number): { main: string; sub: string } => {
    const date = getDayDate(dayIndex);
    const customName = activePlan?.day_names?.[`day_${dayIndex + 1}`];
    if (!date) {
      return { main: customName || `${t('Día', 'Day')} ${dayIndex + 1}`, sub: '' };
    }
    const dowEs = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const dowEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dow = es ? dowEs[date.getDay()] : dowEn[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return { main: dow, sub: `${day}/${month}` };
  };

  const formatWeekDateRange = (weekNum: number): string => {
    if (!planStartDate) return `${t('Semana', 'Week')} ${weekNum} ${t('de', 'of')} ${totalWeeks}`;
    const startIdx = (weekNum - 1) * 7;
    const endIdx = Math.min(startIdx + 6, (activePlan?.duration_days ?? 7) - 1);
    const startDate = getDayDate(startIdx);
    const endDate = getDayDate(endIdx);
    if (!startDate || !endDate) return `${t('Semana', 'Week')} ${weekNum}`;
    const monthsEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = es ? monthsEs : monthsEn;
    const startStr = `${startDate.getDate()} ${months[startDate.getMonth()]}`;
    const endStr = `${endDate.getDate()} ${months[endDate.getMonth()]}`;
    return `${startStr} – ${endStr}`;
  };

  const isTodayIndex = (dayIndex: number): boolean => {
    const date = getDayDate(dayIndex);
    if (!date) return false;
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
  };

  useEffect(() => {
    if (isDemo) { setLoading(false); return; }
    loadAllPlans();
    loadFoods();
    loadRecipes();
    loadTemplates();
  }, [effectiveUserId]);

  const loadAllPlans = async () => {
    const { data } = await supabase
      .from('meal_plans_v2')
      .select('id, title, duration_days, created_at, status')
      .eq('athlete_id', effectiveUserId!)
      .order('created_at', { ascending: false });
    const plans = (data || []) as { id: string; title: string; duration_days: number; created_at: string; status: string }[];
    setAllPlans(plans);
    const active = plans.find((p) => p.status === 'active') || plans[0] || null;
    if (active) {
      await loadPlanById(active.id);
    } else {
      setLoading(false);
    }
  };

  const loadPlanById = async (planId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from('meal_plans_v2')
      .select('*')
      .eq('id', planId)
      .maybeSingle();

    if (!data) { setLoading(false); return; }

    const plan: ActivePlan = {
      id: data.id,
      title: data.title,
      calories_goal: data.calories_goal,
      protein_goal: data.protein_goal,
      carbs_goal: data.carbs_goal,
      fats_goal: data.fats_goal,
      duration_days: data.duration_days,
      start_date: data.start_date || new Date().toISOString().split('T')[0],
      plan_mode: (data.plan_mode as 'template' | 'calendar') || 'template',
      day_names: (data.day_names as Record<string, string>) || {},
      week_pattern: (data.week_pattern as Array<'green' | 'yellow' | 'red'>) || DEFAULT_WEEK_PATTERN,
      day_overrides: (data.day_overrides as Record<string, DayOverride>) || {},
    };
    setActivePlan(plan);
    setPlanStartDate(plan.start_date);
    setPlanMode(plan.plan_mode);
    setCustomDayNames(plan.day_names);
    setCustomWeekPattern(plan.week_pattern);
    setDayOverrides((data.day_overrides as Record<string, DayOverride>) || {});
    if (data.id) {
      getTagsForMealPlan(data.id).then(setPlanTags);
    }

    const { data: mealsData } = await supabase
      .from('meal_plan_meals')
      .select('*')
      .eq('plan_id', data.id)
      .order('day_number')
      .order('sort_order');

    const mealIds = (mealsData || []).map((m: any) => m.id);
    let itemsData: any[] = [];
    if (mealIds.length > 0) {
      const { data: items } = await supabase
        .from('meal_plan_items')
        .select('*')
        .in('meal_id', mealIds)
        .order('sort_order');
      itemsData = items || [];
    }

    const days: DayPlan[] = Array.from({ length: data.duration_days }, (_, i) => ({ day: i + 1, meals: [] }));
    (mealsData || []).forEach((m: any) => {
      const dayIdx = m.day_number - 1;
      if (dayIdx >= 0 && dayIdx < days.length) {
        days[dayIdx].meals.push({
          id: m.id,
          name: m.meal_name || m.meal_type,
          type: m.meal_type,
          time: m.meal_time,
          items: itemsData
            .filter((item) => item.meal_id === m.id)
            .map((item) => ({
              id: item.id,
              food_id: item.food_id || '',
              food_name: item.food_name,
              quantity_g: item.quantity_g,
              calories: item.calories,
              protein_g: item.protein_g,
              carbs_g: item.carbs_g,
              fat_g: item.fat_g,
            })),
        });
      }
    });

    setWeekPlans(days);
    setLoading(false);
  };

  const loadFoods = async () => {
    const all: FoodV2[] = [];
    let from = 0;
    const PAGE = 1000;
    while (true) {
      const { data } = await supabase.from('foods_v2').select('*').order('name_es').range(from, from + PAGE - 1);
      if (!data || data.length === 0) break;
      all.push(...(data as FoodV2[]));
      if (data.length < PAGE) break;
      from += PAGE;
    }
    setFoods(all);
  };

  const loadRecipes = async () => {
    const { data } = await supabase
      .from('recipes')
      .select('id, name, name_es, name_en, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, is_public, category, servings, prep_time_min, cook_time_min, ingredients')
      .or(`user_id.eq.${effectiveUserId},is_public.eq.true`)
      .order('name')
      .limit(200);
    setRecipes((data || []) as RecipeItem[]);
  };

  const loadTemplates = async () => {
    const { data } = await supabase
      .from('meal_plan_templates')
      .select('id, name, name_es, calories_target, focus, protein_g, carbs_g, fat_g, days')
      .eq('is_active', true)
      .order('calories_target');
    setTemplates((data || []) as MealPlanTemplate[]);
  };

  const filteredFoods = foods.filter((f) => {
    const q = foodSearch.toLowerCase();
    const matchName = (f.name_es || '').toLowerCase().includes(q) || (f.name_en || '').toLowerCase().includes(q);
    const matchTab = isFoodInTab(f, foodTypeTab);
    const matchSubCat = !foodSubCategory || f.category === foodSubCategory;
    const matchMacro = applyMacroFilter(f, macroFilter);
    return matchName && matchTab && matchSubCat && matchMacro;
  });

  const filteredRecipes = recipes.filter((r) => {
    const q = foodSearch.toLowerCase();
    const nameEn = (r.name_en || r.name || '').toLowerCase();
    const nameEs = (r.name_es || r.name || '').toLowerCase();
    return nameEn.includes(q) || nameEs.includes(q);
  });

  const filteredSupplements = foods.filter((f) => {
    const q = foodSearch.toLowerCase();
    const matchName = (f.name_es || '').toLowerCase().includes(q) || (f.name_en || '').toLowerCase().includes(q);
    const matchCat = f.category?.toLowerCase().includes('supplement');
    const matchForm = !suppFormFilter || f.product_form === suppFormFilter;
    return matchName && matchCat && matchForm;
  });

  const suppPageSize = 15;
  const suppTotalPages = Math.ceil(filteredSupplements.length / suppPageSize);
  const pagedSupplements = filteredSupplements.slice(suppPage * suppPageSize, (suppPage + 1) * suppPageSize);

  const filteredTemplates = templates.filter((tmpl) => {
    const q = foodSearch.toLowerCase();
    const name = es ? (tmpl.name_es || tmpl.name) : tmpl.name;
    const matchName = name.toLowerCase().includes(q);
    const matchFocus = !templateFocusFilter || tmpl.focus === templateFocusFilter;
    return matchName && matchFocus;
  });

  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    if (foodSearch.length >= 3 && filteredFoods.length < 5 && foodTypeTab === 'foods') {
      searchDebounce.current = setTimeout(() => searchOpenFoodFacts(foodSearch), 600);
    } else {
      setOffResults([]);
    }
  }, [foodSearch, foodTypeTab]);

  const searchOpenFoodFacts = async (query: string) => {
    setOffLoading(true);
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`
      );
      const data = await res.json();
      const results: FoodV2[] = (data.products || [])
        .filter((p: any) => p.nutriments && p.product_name)
        .slice(0, 5)
        .map((p: any) => ({
          id: `off_${p.code || crypto.randomUUID()}`,
          name_es: p.product_name_es || p.product_name,
          name_en: p.product_name_en || p.product_name,
          category: 'other',
          calories_per_100g: p.nutriments['energy-kcal_100g'] || 0,
          protein_per_100g: p.nutriments.proteins_100g || 0,
          carbs_per_100g: p.nutriments.carbohydrates_100g || 0,
          fat_per_100g: p.nutriments.fat_100g || 0,
          source: 'open_food_facts',
          is_verified: false,
          off_product_id: p.code,
        }));
      setOffResults(results);
    } catch { setOffResults([]); }
    setOffLoading(false);
  };

  const saveOFFFood = async (food: FoodV2): Promise<FoodV2> => {
    if (isDemo) return food;
    const { data } = await supabase.from('foods_v2').insert({
      name_es: food.name_es, name_en: food.name_en, category: food.category,
      calories_per_100g: food.calories_per_100g, protein_per_100g: food.protein_per_100g,
      carbs_per_100g: food.carbs_per_100g, fat_per_100g: food.fat_per_100g,
      source: 'open_food_facts', off_product_id: food.off_product_id, created_by: effectiveUserId,
    }).select().maybeSingle();
    if (data) { setFoods((p) => [...p, data as FoodV2]); return data as FoodV2; }
    return food;
  };

  const addFoodToMeal = useCallback(async (food: FoodV2, qty = 100, mealId?: string) => {
    const targetMealId = mealId || selectedMealId;
    if (!targetMealId) return;
    let savedFood = food;
    if (food.id.startsWith('off_') && !isDemo) savedFood = await saveOFFFood(food);
    const macros = calcItemMacros(savedFood, qty);
    const resolvedItemType: MealItem['item_type'] =
      savedFood.category === 'supplement' ? 'supplement'
      : savedFood.category === 'product' ? 'product'
      : savedFood.category === 'recipe' ? 'recipe'
      : 'food';
    const newItem: MealItem = {
      id: crypto.randomUUID(),
      food_id: savedFood.id,
      food_name: es ? savedFood.name_es : savedFood.name_en,
      quantity_g: qty,
      food: savedFood,
      item_type: resolvedItemType,
      brand: savedFood.brand,
      supplement_type: savedFood.category === 'supplement' ? (savedFood.source || undefined) : undefined,
      serving_unit: savedFood.product_form || undefined,
      ...macros,
    };
    setWeekPlans((prev) => prev.map((day) => ({
      ...day,
      meals: day.meals.map((m) => m.id === targetMealId ? { ...m, items: [...m.items, newItem] } : m),
    })));
  }, [selectedMealId, isDemo, es]);

  const addRecipeToMeal = useCallback((recipe: RecipeItem, qty = 100, mealId?: string) => {
    const targetMealId = mealId || selectedMealId;
    if (!targetMealId) return;
    const food: FoodV2 = {
      id: recipe.id,
      name_es: recipe.name_es || recipe.name,
      name_en: recipe.name_en || recipe.name,
      category: 'recipe',
      calories_per_100g: recipe.calories_per_100g || 0,
      protein_per_100g: recipe.protein_per_100g || 0,
      carbs_per_100g: recipe.carbs_per_100g || 0,
      fat_per_100g: recipe.fat_per_100g || 0,
    };
    const macros = calcItemMacros(food, qty);
    const newItem: MealItem = {
      id: crypto.randomUUID(),
      food_id: recipe.id,
      food_name: es ? (recipe.name_es || recipe.name) : (recipe.name_en || recipe.name),
      quantity_g: qty,
      food,
      item_type: 'recipe',
      recipe_data: {
        id: recipe.id,
        servings: recipe.servings,
        prep_time_min: recipe.prep_time_min,
        cook_time_min: recipe.cook_time_min,
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      },
      ...macros,
    };
    setWeekPlans((prev) => prev.map((day) => ({
      ...day,
      meals: day.meals.map((m) => m.id === targetMealId ? { ...m, items: [...m.items, newItem] } : m),
    })));
  }, [selectedMealId, es]);

  const removeFoodFromMeal = (mealId: string, itemId: string) => {
    setWeekPlans((prev) => prev.map((day) => ({
      ...day,
      meals: day.meals.map((m) => m.id === mealId ? { ...m, items: m.items.filter((i) => i.id !== itemId) } : m),
    })));
  };

  const updateItemQty = (mealId: string, itemId: string, qty: number) => {
    setWeekPlans((prev) => prev.map((day) => ({
      ...day,
      meals: day.meals.map((m) => {
        if (m.id !== mealId) return m;
        return {
          ...m,
          items: m.items.map((item) => {
            if (item.id !== itemId) return item;
            const food = item.food || foods.find((f) => f.id === item.food_id);
            if (!food) return { ...item, quantity_g: qty };
            return { ...item, quantity_g: qty, ...calcItemMacros(food, qty) };
          }),
        };
      }),
    })));
  };

  const addMeal = (mealType: string) => {
    const slot = MEAL_SLOTS.find((s) => s.key === mealType);
    const newMeal: Meal = {
      id: crypto.randomUUID(),
      name: mealType.startsWith('other') ? t('Otra Comida', 'Other Meal') : getMealTypeLabel(mealType, es ? 'es' : 'en'),
      type: mealType,
      time: slot?.defaultTime || '12:00',
      items: [],
    };
    setWeekPlans((prev) => prev.map((day, i) =>
      i === selectedDay ? { ...day, meals: [...day.meals, newMeal] } : day
    ));
    setSelectedMealId(newMeal.id);
  };

  const addOtherMeal = () => {
    const currentDay = weekPlans[selectedDay];
    const otherCount = currentDay ? currentDay.meals.filter((m) => m.type.startsWith('other')).length : 0;
    const newMeal: Meal = {
      id: crypto.randomUUID(),
      name: t('Otra Comida', 'Other Meal'),
      type: `other_${otherCount + 1}`,
      time: '12:00',
      items: [],
    };
    setWeekPlans((prev) => prev.map((day, i) =>
      i === selectedDay ? { ...day, meals: [...day.meals, newMeal] } : day
    ));
    setSelectedMealId(newMeal.id);
  };

  const removeMeal = (mealId: string) => {
    setWeekPlans((prev) => prev.map((day, i) =>
      i === selectedDay ? { ...day, meals: day.meals.filter((m) => m.id !== mealId) } : day
    ));
    if (selectedMealId === mealId) setSelectedMealId(null);
  };

  const updateMealTime = (mealId: string, time: string) => {
    setWeekPlans((prev) => prev.map((day) => ({
      ...day,
      meals: day.meals.map((m) => m.id === mealId ? { ...m, time } : m),
    })));
  };

  const updateMealName = (mealId: string, name: string) => {
    setWeekPlans((prev) => prev.map((day) => ({
      ...day,
      meals: day.meals.map((m) => m.id === mealId ? { ...m, name } : m),
    })));
  };

  const applyTemplate = (tmpl: MealPlanTemplate, assignments: Record<number, number>) => {
    const templateDays: any[] = Array.isArray(tmpl.days) ? tmpl.days : [];
    setWeekPlans((prev) => {
      const next = prev.map((day) => ({ ...day, meals: [...day.meals] }));
      Object.entries(assignments).forEach(([tmplIdxStr, planIdx]) => {
        const tmplIdx = parseInt(tmplIdxStr);
        if (planIdx < 0 || planIdx >= next.length) return;
        const tmplDay = templateDays[tmplIdx];
        if (!tmplDay || !Array.isArray(tmplDay.meals)) return;
        const newMeals: Meal[] = tmplDay.meals.map((m: any) => {
          const slotType = m.slot || m.meal_type || 'other';
          const mealName = es ? (m.name_es || m.name || slotType) : (m.name_en || m.name_es || m.name || slotType);
          const foods: any[] = Array.isArray(m.foods) ? m.foods : [];
          const items: MealItem[] = foods.map((f: any) => ({
            id: crypto.randomUUID(),
            food_id: f.food_id || '',
            food_name: es ? (f.name_es || f.name || '') : (f.name_en || f.name_es || f.name || ''),
            quantity_g: f.quantity_g || 100,
            calories: f.calories || 0,
            protein_g: f.protein_g || 0,
            carbs_g: f.carbs_g || 0,
            fat_g: f.fat_g || 0,
          }));
          return {
            id: crypto.randomUUID(),
            name: mealName,
            type: slotType,
            time: m.meal_time || undefined,
            items,
          };
        });
        next[planIdx] = { ...next[planIdx], meals: [...next[planIdx].meals, ...newMeals] };
      });
      return next;
    });
    setShowTemplateModal(null);
  };

  const handleDragStart = useCallback((itemId: string, mealId: string) => {
    setDragging({ itemId, fromMealId: mealId });
  }, []);

  const handleFoodDragStart = useCallback((food: FoodV2) => {
    setDraggingFood(food);
  }, []);

  const handleDrop = useCallback((toMealId: string) => {
    if (draggingFood) {
      addFoodToMeal(draggingFood, 100, toMealId);
      setDraggingFood(null);
      setDragOverMealId(null);
      return;
    }
    if (!dragging || dragging.fromMealId === toMealId) {
      setDragging(null); setDragOverMealId(null); return;
    }
    setWeekPlans((prev) => {
      let draggedItem: MealItem | null = null;
      const next = prev.map((day) => ({
        ...day,
        meals: day.meals.map((m) => {
          if (m.id === dragging.fromMealId) {
            draggedItem = m.items.find((i) => i.id === dragging.itemId) || null;
            return { ...m, items: m.items.filter((i) => i.id !== dragging.itemId) };
          }
          return m;
        }),
      }));
      if (!draggedItem) return prev;
      const item = draggedItem;
      return next.map((day) => ({
        ...day,
        meals: day.meals.map((m) => m.id === toMealId ? { ...m, items: [...m.items, item] } : m),
      }));
    });
    setDragging(null); setDragOverMealId(null);
  }, [dragging, draggingFood, addFoodToMeal]);

  const duplicateWeek = () => {
    if (!activePlan) return;

    const daysInCurrentWeek = Math.min(7, activePlan.duration_days - (currentWeek - 1) * 7);
    const startDay = (currentWeek - 1) * 7;
    const endDay = startDay + daysInCurrentWeek;

    const weekToDuplicate = weekPlans.slice(startDay, endDay);
    const nextDayNumber = activePlan.duration_days + 1;

    const duplicatedWeek = weekToDuplicate.map((day, idx) => ({
      day: nextDayNumber + idx,
      meals: day.meals.map((m) => ({
        ...m,
        id: crypto.randomUUID(),
        items: m.items.map((item) => ({ ...item, id: crypto.randomUUID() })),
      })),
    }));

    setWeekPlans((prev) => [...prev, ...duplicatedWeek]);
    setActivePlan((prev) => prev ? { ...prev, duration_days: prev.duration_days + daysInCurrentWeek } : null);
    setTimeout(() => setCurrentWeek((w) => w + 1), 50);
  };

  const addBlankWeek = () => {
    if (!activePlan) return;
    const newDays = Array.from({ length: 7 }, (_, i) => ({
      day: activePlan.duration_days + i + 1,
      meals: [] as Meal[],
    }));
    setWeekPlans((prev) => [...prev, ...newDays]);
    setActivePlan((prev) => prev ? { ...prev, duration_days: prev.duration_days + 7 } : null);
    setTimeout(() => setCurrentWeek((w) => w + 1), 50);
  };

  const deleteCurrentWeek = () => {
    if (!activePlan || totalWeeks <= 1) return;
    const startIdx = (currentWeek - 1) * 7;
    const endIdx = Math.min(startIdx + 7, activePlan.duration_days);
    const daysToRemove = endIdx - startIdx;
    const newPlans = [
      ...weekPlans.slice(0, startIdx),
      ...weekPlans.slice(endIdx).map((d, i) => ({ ...d, day: startIdx + i + 1 })),
    ];
    setWeekPlans(newPlans);
    setActivePlan((prev) => prev ? { ...prev, duration_days: prev.duration_days - daysToRemove } : null);
    if (currentWeek > Math.ceil(newPlans.length / 7)) {
      setCurrentWeek((w) => Math.max(1, w - 1));
    }
    setSelectedDay(Math.min(selectedDay, newPlans.length - 1));
  };

  const deleteDay = (dayIdx: number) => {
    if (!activePlan || activePlan.duration_days <= 1) return;
    const newPlans = [
      ...weekPlans.slice(0, dayIdx),
      ...weekPlans.slice(dayIdx + 1).map((d, i) => ({ ...d, day: dayIdx + i + 1 })),
    ];
    setWeekPlans(newPlans);
    setActivePlan((prev) => prev ? { ...prev, duration_days: prev.duration_days - 1 } : null);
    setSelectedDay((prev) => Math.min(prev, newPlans.length - 1));
    if (expandedDay === dayIdx) setExpandedDay(null);
    const newTotalWeeks = Math.ceil(newPlans.length / 7);
    if (currentWeek > newTotalWeeks) setCurrentWeek(newTotalWeeks);
  };

  const handleDeletePlan = async (planId: string) => {
    setDeletingPlanId(planId);
    await supabase.from('meal_plan_items').delete().in(
      'meal_id',
      (await supabase.from('meal_plan_meals').select('id').eq('plan_id', planId)).data?.map((r: any) => r.id) || []
    );
    await supabase.from('meal_plan_meals').delete().eq('plan_id', planId);
    await supabase.from('meal_plans_v2').delete().eq('id', planId);
    const updated = allPlans.filter((p) => p.id !== planId);
    setAllPlans(updated);
    if (activePlan?.id === planId) {
      setActivePlan(null);
      setWeekPlans([]);
      if (updated.length > 0) {
        await loadPlanById(updated[0].id);
      }
    }
    setConfirmDeleteId(null);
    setDeletingPlanId(null);
  };

  const handleSwitchPlan = async (planId: string) => {
    if (activePlan?.id === planId) { setShowPlansPanel(false); return; }
    setShowPlansPanel(false);
    setSelectedDay(0);
    setCurrentWeek(1);
    await loadPlanById(planId);
  };

  const handleSave = async () => {
    if (!activePlan || isDemo) return;
    setSaving(true);
    try {
      await supabase.from('meal_plan_meals').delete().eq('plan_id', activePlan.id);
      for (const day of weekPlans) {
        for (let mi = 0; mi < day.meals.length; mi++) {
          const meal = day.meals[mi];
          const { data: mealRow } = await supabase.from('meal_plan_meals').insert({
            plan_id: activePlan.id, meal_type: meal.type, meal_name: meal.name,
            meal_time: meal.time, sort_order: mi, day_number: day.day,
            calories: Math.round(meal.items.reduce((a, i) => a + i.calories, 0)),
            protein: meal.items.reduce((a, i) => a + i.protein_g, 0),
            carbs: meal.items.reduce((a, i) => a + i.carbs_g, 0),
            fat: meal.items.reduce((a, i) => a + i.fat_g, 0),
          }).select().maybeSingle();
          if (mealRow && meal.items.length > 0) {
            await supabase.from('meal_plan_items').insert(
              meal.items.map((item, idx) => ({
                meal_id: mealRow.id, food_id: item.food_id || null, food_name: item.food_name,
                quantity_g: item.quantity_g, calories: item.calories, protein_g: item.protein_g,
                carbs_g: item.carbs_g, fat_g: item.fat_g, sort_order: idx,
              }))
            );
          }
        }
      }
      await supabase.from('meal_plans_v2').update({
        day_names: customDayNames, week_pattern: customWeekPattern,
        day_overrides: dayOverrides, start_date: planStartDate, plan_mode: planMode, updated_at: new Date().toISOString(),
      }).eq('id', activePlan.id);
      await setTagsForMealPlan(activePlan.id, planTags.map((t) => t.id));
      setActivePlan((p) => p ? { ...p, day_names: customDayNames, week_pattern: customWeekPattern, day_overrides: dayOverrides, start_date: planStartDate, plan_mode: planMode } : p);
      const hubTarget = targetUserEmail ?? profile?.email;
      const localId = targetUserId ?? profile?.id;
      if (hubTarget && localId) {
        syncAthleteTagsToHub(hubTarget, localId);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handlePushToHub = async () => {
    if (!activePlan || !profile?.email) return;
    setPushingToHub(true);
    setPushHubResult(null);
    try {
      const today = new Date().toISOString().split('T')[0];

      const buildItem = (item: MealItem) => {
        const itemType = item.item_type || (item.food?.category === 'recipe' ? 'recipe' : item.food?.category === 'supplement' ? 'supplement' : item.food?.category === 'product' ? 'product' : 'food');
        const base = {
          item_type: itemType,
          quantity_g: item.quantity_g,
          calories: item.calories,
          protein_g: item.protein_g,
          carbs_g: item.carbs_g,
          fat_g: item.fat_g,
        };
        if (itemType === 'recipe') {
          return {
            ...base,
            recipe_name: item.food_name,
            recipe_id: item.food_id,
            servings: item.recipe_data?.servings,
            prep_time_min: item.recipe_data?.prep_time_min,
            cook_time_min: item.recipe_data?.cook_time_min,
            ingredients: (item.recipe_data?.ingredients || []).map((ing) => ({
              name: ing.name_es || ing.name,
              quantity_g: ing.quantity_g,
              unit: ing.unit,
            })),
          };
        }
        if (itemType === 'supplement') {
          return {
            ...base,
            product_name: item.food_name,
            brand: item.brand || item.food?.brand,
            supplement_type: item.supplement_type || item.food?.source,
            serving_unit: item.serving_unit || item.food?.product_form,
          };
        }
        if (itemType === 'product') {
          return {
            ...base,
            product_name: item.food_name,
            brand: item.brand || item.food?.brand,
            serving_unit: item.serving_unit || item.food?.product_form,
          };
        }
        return {
          ...base,
          food_name: item.food_name,
        };
      };

      const days = weekPlans.map((dayPlan) => {
        const dayKey = `day_${dayPlan.day}`;
        const dayName = activePlan.day_names?.[dayKey] || `Day ${dayPlan.day}`;
        const dayOverride = activePlan.day_overrides?.[dayKey];
        const calDate = planMode === 'calendar' && planStartDate
          ? (() => {
              const base = new Date(planStartDate + 'T12:00:00');
              base.setDate(base.getDate() + (dayPlan.day - 1));
              return base.toISOString().split('T')[0];
            })()
          : null;
        return {
          day: dayPlan.day,
          day_name: planMode === 'calendar' && calDate
            ? new Date(calDate + 'T12:00:00').toLocaleDateString(es ? 'es-AR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })
            : dayName,
          day_label: dayName,
          date: calDate,
          training_intensity: activePlan.week_pattern?.[dayPlan.day - 1] || null,
          day_targets: dayOverride ? {
            target_kcal: dayOverride.calories,
            target_protein_g: dayOverride.protein,
            target_carbs_g: dayOverride.carbs,
            target_fat_g: dayOverride.fat,
          } : null,
          meals: dayPlan.meals.map((meal) => {
            const mealKcal = meal.items.reduce((sum, i) => sum + i.calories, 0);
            const mealProtein = meal.items.reduce((sum, i) => sum + i.protein_g, 0);
            const mealCarbs = meal.items.reduce((sum, i) => sum + i.carbs_g, 0);
            const mealFat = meal.items.reduce((sum, i) => sum + i.fat_g, 0);
            return {
              meal_type: meal.type,
              meal_name: meal.name,
              meal_time: meal.time,
              kcal: Math.round(mealKcal),
              protein_g: Math.round(mealProtein * 10) / 10,
              carbs_g: Math.round(mealCarbs * 10) / 10,
              fat_g: Math.round(mealFat * 10) / 10,
              items: meal.items.map(buildItem),
            };
          }),
        };
      });

      const totalKcal = weekPlans.reduce((sum, day) => sum + day.meals.reduce((s, m) => s + m.items.reduce((a, i) => a + i.calories, 0), 0), 0);
      const avgKcal = weekPlans.length > 0 ? Math.round(totalKcal / weekPlans.length) : 0;

      const pushTarget = targetUserEmail ?? targetUserId ?? profile.email;
      await pushNutritionPlan(pushTarget, {
        plan_date: today,
        plan_name: activePlan.title,
        plan_duration_days: activePlan.duration_days,
        plan_mode: planMode,
        ...(planMode === 'calendar' && planStartDate ? { start_date: planStartDate } : {}),
        summary: {
          target_kcal: activePlan.calories_goal,
          target_protein_g: activePlan.protein_goal,
          target_carbs_g: activePlan.carbs_goal,
          target_fat_g: activePlan.fats_goal,
          avg_daily_kcal: avgKcal,
        },
        plan_data: { days },
        notes: `Enviado desde Satélite Nutrición — ${new Date().toLocaleDateString()}`,
      });
      setPushHubResult('success');
      setTimeout(() => setPushHubResult(null), 3000);
    } catch (e) {
      console.error('[PushToHub]', e);
      setPushHubResult('error');
      setTimeout(() => setPushHubResult(null), 4000);
    }
    setPushingToHub(false);
  };

  const handleCreatePlan = async () => {
    if (isDemo || !newPlanForm.title.trim()) return;
    setCreatingPlan(true);
    const patternToUse = newPlanForm.week_pattern.slice(0, newPlanForm.duration_days);
    const { data, error } = await supabase.from('meal_plans_v2').insert({
      athlete_id: effectiveUserId!, title: newPlanForm.title,
      calories_goal: newPlanForm.calories_goal, protein_goal: newPlanForm.protein_goal,
      carbs_goal: newPlanForm.carbs_goal, fats_goal: newPlanForm.fats_goal,
      duration_days: newPlanForm.duration_days, status: 'active', week_pattern: patternToUse,
    }).select().maybeSingle();
    if (error) { console.error('[CreatePlan] error:', error); setCreatingPlan(false); return; }
    if (data) {
      const savedPattern = (data.week_pattern as Array<'green' | 'yellow' | 'red'>) || patternToUse;
      const newPlan = {
        id: data.id, title: data.title,
        calories_goal: data.calories_goal, protein_goal: data.protein_goal,
        carbs_goal: data.carbs_goal, fats_goal: data.fats_goal,
        duration_days: data.duration_days, day_names: {}, week_pattern: savedPattern, day_overrides: {},
      };
      setActivePlan(newPlan);
      setAllPlans((prev) => [{ id: data.id, title: data.title, duration_days: data.duration_days, created_at: data.created_at, status: data.status }, ...prev]);
      setCustomWeekPattern(savedPattern);
      setDayOverrides({});
      setWeekPlans(Array.from({ length: data.duration_days }, (_, i) => ({ day: i + 1, meals: [] })));
      setSelectedDay(0);
      setCurrentWeek(1);
      setNewPlanForm({ title: '', calories_goal: 2000, protein_goal: 150, carbs_goal: 250, fats_goal: 70, duration_days: 7, week_pattern: [...DEFAULT_WEEK_PATTERN] });
      setShowCreatePlan(false);
      setShowPlansPanel(false);
      loadFoods();
      loadRecipes();
    }
    setCreatingPlan(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#514163' }} />
      </div>
    );
  }

  if (!activePlan) {
    return (
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="p-2 rounded-xl border hover:bg-gray-50 transition-all" style={{ borderColor: '#e5e7eb' }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h1 className="font-heading text-xl flex-1" style={{ color: '#1f2937' }}>{t('Editor de Comidas', 'Meal Editor')}</h1>
          {allPlans.length > 0 && (
            <button
              onClick={() => setShowPlansPanel(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:bg-gray-50"
              style={{ borderColor: '#514163', color: '#514163' }}
            >
              <LayoutList className="w-3.5 h-3.5" />
              {t('Ver Planes', 'View Plans')} ({allPlans.length})
            </button>
          )}
        </div>
        {isDemo ? (
          <div className="rounded-2xl p-8 text-center" style={{ border: '2px solid #e5e7eb', backgroundColor: '#fafafa' }}>
            <Utensils className="w-14 h-14 mx-auto mb-4" style={{ color: '#d1d5db' }} />
            <h3 className="font-heading text-lg mb-2" style={{ color: '#1f2937' }}>
              {t('Inicia sesión para crear planes', 'Sign in to create plans')}
            </h3>
          </div>
        ) : (
          <div className="rounded-2xl p-8 text-center" style={{ border: '2px dashed #e5e7eb', backgroundColor: '#fafafa' }}>
            <Utensils className="w-14 h-14 mx-auto mb-4" style={{ color: '#d1d5db' }} />
            <h3 className="font-heading text-xl mb-2" style={{ color: '#1f2937' }}>
              {t('No hay plan activo', 'No active plan')}
            </h3>
            <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
              {t('Crea tu primer plan semanal para organizar tus comidas.', 'Create your first weekly plan to organize your meals.')}
            </p>
            <button onClick={() => setShowCreatePlan(true)} className="btn-primary flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              {t('Crear Plan', 'Create Plan')}
            </button>
          </div>
        )}
        {showCreatePlan && (
          <CreatePlanModal
            form={newPlanForm} setForm={setNewPlanForm}
            onClose={() => setShowCreatePlan(false)} onCreate={handleCreatePlan}
            creating={creatingPlan} t={t} es={es}
          />
        )}
        {showPlansPanel && (
          <div className="fixed inset-0 z-50 flex items-start justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => { setShowPlansPanel(false); setConfirmDeleteId(null); }}>
            <div className="h-full w-full max-w-sm bg-white flex flex-col" style={{ boxShadow: '-4px 0 24px rgba(0,0,0,0.12)' }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#f3f4f6', backgroundColor: '#fafafa' }}>
                <div className="flex items-center gap-2">
                  <LayoutList className="w-5 h-5" style={{ color: '#514163' }} />
                  <h2 className="font-heading text-base" style={{ color: '#1f2937' }}>{t('Planes de Alimentación', 'Meal Plans')}</h2>
                </div>
                <button onClick={() => { setShowPlansPanel(false); setConfirmDeleteId(null); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all">
                  <X className="w-4 h-4" style={{ color: '#6b7280' }} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {allPlans.map((plan) => {
                  const isConfirmDelete = confirmDeleteId === plan.id;
                  const isDeleting = deletingPlanId === plan.id;
                  return (
                    <div key={plan.id} className="rounded-xl border p-3 flex items-center gap-3" style={{ borderColor: '#e5e7eb' }}>
                      <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: '#9ca3af' }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-sm truncate" style={{ color: '#1f2937' }}>{plan.title}</p>
                        <p className="font-body text-xs" style={{ color: '#9ca3af' }}>{plan.duration_days} {t('días', 'days')}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleSwitchPlan(plan.id)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' }}>
                          {t('Abrir', 'Open')}
                        </button>
                        {!isConfirmDelete ? (
                          <button onClick={() => setConfirmDeleteId(plan.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-all">
                            <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 rounded-lg px-2 py-1" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                            <button onClick={() => handleDeletePlan(plan.id)} disabled={isDeleting} className="text-xs font-bold" style={{ color: '#ef4444' }}>
                              {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : t('Confirmar', 'Confirm')}
                            </button>
                            <button onClick={() => setConfirmDeleteId(null)} className="text-xs" style={{ color: '#9ca3af' }}>
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t" style={{ borderColor: '#f3f4f6' }}>
                <button onClick={() => { setShowPlansPanel(false); setShowCreatePlan(true); }} className="w-full btn-primary flex items-center justify-center gap-2 py-3">
                  <Plus className="w-4 h-4" />
                  {t('Crear Nuevo Plan', 'Create New Plan')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const weekPattern = activePlan.week_pattern || DEFAULT_WEEK_PATTERN;
  const currentDay = weekPlans[selectedDay];
  const dayMacros = currentDay ? sumMeals(currentDay.meals) : { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
  const fuelType = weekPattern[selectedDay % weekPattern.length] || 'yellow';

  const getEffectiveTargets = (dayIdx: number) => {
    const key = `day_${dayIdx + 1}`;
    if (dayOverrides[key]) return dayOverrides[key];
    const pt = weekPattern[dayIdx % weekPattern.length] || 'yellow';
    return getDayTargetMacros(activePlan.calories_goal, activePlan.protein_goal, activePlan.carbs_goal, activePlan.fats_goal, pt);
  };

  const dayTargets = getEffectiveTargets(selectedDay);
  const micronutrients = calcMicronutrients(weekPlans, selectedDay);
  const athleteName = targetUserName || activePlan.athlete_name || profile?.full_name || t('Atleta', 'Athlete');

  const fuelColors = {
    green: { bg: '#f0fdf4', border: '#86efac', text: '#16a34a' },
    yellow: { bg: '#fefce8', border: '#fcd34d', text: '#ca8a04' },
    red: { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626' },
  };
  const fc = fuelColors[fuelType];

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* Top Header */}
      <div className="bg-white border-b px-4 lg:px-6 py-3" style={{ borderColor: '#e5e7eb' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 rounded-xl px-4 py-2.5 flex items-center gap-3" style={{ border: '2px solid #86efac', backgroundColor: '#f0fdf4' }}>
            <FlameKindling className="w-5 h-5 flex-shrink-0" style={{ color: '#16a34a' }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: '#6b7280' }}>{t('Editor de Comidas para:', 'Meal Editor for:')}</p>
              <p className="font-heading text-sm truncate" style={{ color: '#1f2937' }}>{athleteName} — {activePlan.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Plan mode toggle */}
            <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
              <button
                onClick={async () => {
                  const newMode = 'template';
                  setPlanMode(newMode);
                  if (activePlan && !isDemo) {
                    await supabase.from('meal_plans_v2').update({ plan_mode: newMode }).eq('id', activePlan.id);
                    setActivePlan((p) => p ? { ...p, plan_mode: newMode } : p);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold transition-all"
                style={{
                  backgroundColor: planMode === 'template' ? '#1f2937' : '#fff',
                  color: planMode === 'template' ? '#fdda36' : '#6b7280',
                }}
                title={t('Plan de ejemplo (Día 1, Día 2...)', 'Example plan (Day 1, Day 2...)')}
              >
                <BookOpen className="w-3 h-3" />
                {t('Ejemplo', 'Example')}
              </button>
              <button
                onClick={async () => {
                  const newMode = 'calendar';
                  setPlanMode(newMode);
                  if (activePlan && !isDemo) {
                    await supabase.from('meal_plans_v2').update({ plan_mode: newMode }).eq('id', activePlan.id);
                    setActivePlan((p) => p ? { ...p, plan_mode: newMode } : p);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold transition-all"
                style={{
                  backgroundColor: planMode === 'calendar' ? '#1f2937' : '#fff',
                  color: planMode === 'calendar' ? '#fdda36' : '#6b7280',
                }}
                title={t('Plan con calendario real', 'Calendar-anchored plan')}
              >
                <Calendar className="w-3 h-3" />
                {t('Calendario', 'Calendar')}
              </button>
            </div>

            {/* Start date picker — only in calendar mode */}
            {planMode === 'calendar' && (
              editingStartDate ? (
                <div className="flex items-center gap-1.5 border rounded-xl px-2 py-1" style={{ borderColor: '#16a34a', backgroundColor: '#f0fdf4' }}>
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#16a34a' }} />
                  <input
                    type="date"
                    value={planStartDate}
                    onChange={(e) => setPlanStartDate(e.target.value)}
                    onBlur={async () => {
                      setEditingStartDate(false);
                      if (activePlan && !isDemo) {
                        await supabase.from('meal_plans_v2').update({ start_date: planStartDate }).eq('id', activePlan.id);
                        setActivePlan((p) => p ? { ...p, start_date: planStartDate } : p);
                      }
                    }}
                    autoFocus
                    className="text-xs font-bold bg-transparent outline-none"
                    style={{ color: '#16a34a', minWidth: '120px' }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setEditingStartDate(true)}
                  className="flex items-center gap-1.5 border rounded-xl px-2 py-1.5 hover:bg-gray-50 transition-all"
                  style={{ borderColor: planStartDate ? '#86efac' : '#fcd34d', backgroundColor: planStartDate ? '#fff' : '#fefce8' }}
                  title={t('Cambiar fecha de inicio', 'Change start date')}
                >
                  <Calendar className="w-3.5 h-3.5" style={{ color: planStartDate ? '#16a34a' : '#ca8a04' }} />
                  <span className="text-xs font-semibold" style={{ color: planStartDate ? '#16a34a' : '#ca8a04' }}>
                    {planStartDate
                      ? new Date(planStartDate + 'T12:00:00').toLocaleDateString(es ? 'es-AR' : 'en-US', { day: 'numeric', month: 'short' })
                      : t('Definir inicio', 'Set start date')}
                  </span>
                </button>
              )
            )}

            {/* Week navigator */}
            <div className="flex items-center gap-1 border rounded-xl px-2 py-1.5" style={{ borderColor: '#e5e7eb' }}>
              <button
                onClick={() => setCurrentWeek((w) => Math.max(1, w - 1))}
                className="p-1 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-30"
                disabled={currentWeek === 1}
              >
                <ChevronLeft className="w-3.5 h-3.5" style={{ color: '#514163' }} />
              </button>
              <div className="text-center px-1">
                <span className="text-xs font-bold block whitespace-nowrap" style={{ color: '#374151' }}>
                  {planMode === 'calendar' && planStartDate
                    ? formatWeekDateRange(currentWeek)
                    : `${t('Semana', 'Week')} ${currentWeek} ${t('de', 'of')} ${totalWeeks}`}
                </span>
                {planMode === 'calendar' && planStartDate && (
                  <span className="text-xs block" style={{ color: '#9ca3af' }}>
                    {t('Sem.', 'Wk')} {currentWeek}/{totalWeeks}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCurrentWeek((w) => Math.min(totalWeeks, w + 1))}
                className="p-1 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-30"
                disabled={currentWeek === totalWeeks}
              >
                <ChevronRight className="w-3.5 h-3.5" style={{ color: '#514163' }} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPlansPanel(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:bg-gray-50"
            style={{ borderColor: '#e5e7eb', color: '#374151' }}
            title={t('Gestionar planes', 'Manage plans')}
          >
            <LayoutList className="w-3.5 h-3.5" />
            {t('Planes', 'Plans')}
            {allPlans.length > 1 && (
              <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#514163', color: '#fdda36' }}>
                {allPlans.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowCustomizeDays(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:bg-gray-50"
            style={{ borderColor: '#514163', color: '#514163' }}
          >
            <Settings className="w-3.5 h-3.5" />
            {t('Personalizar', 'Customize')}
          </button>
          <button
            onClick={duplicateWeek}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:bg-gray-50"
            style={{ borderColor: '#e5e7eb', color: '#374151' }}
          >
            <Copy className="w-3.5 h-3.5" />
            {t('Duplicar Semana', 'Duplicate Week')}
          </button>
          <button
            onClick={addBlankWeek}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:bg-gray-50"
            style={{ borderColor: '#e5e7eb', color: '#374151' }}
          >
            <Calendar className="w-3.5 h-3.5" />
            {t('+ Semana Vacía', '+ Blank Week')}
          </button>
          {totalWeeks > 1 && (
            <button
              onClick={deleteCurrentWeek}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all hover:bg-red-50"
              style={{ borderColor: '#fecaca', color: '#ef4444' }}
              title={t(`Eliminar semana ${currentWeek}`, `Delete week ${currentWeek}`)}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t(`− Sem. ${currentWeek}`, `− Wk ${currentWeek}`)}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || isDemo}
            className="btn-primary flex items-center gap-1.5 py-2 px-4 text-xs disabled:opacity-50 ml-auto"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? t('¡Guardado!', 'Saved!') : t('Guardar Plan', 'Save Plan')}
          </button>
          <button
            onClick={handlePushToHub}
            disabled={pushingToHub || isDemo}
            className="flex items-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all disabled:opacity-50"
            style={
              pushHubResult === 'success'
                ? { backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' }
                : pushHubResult === 'error'
                ? { backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }
                : { backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }
            }
            title={t('Enviar plan al Hub', 'Push plan to Hub')}
          >
            {pushingToHub
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : pushHubResult === 'success'
              ? <Check className="w-3.5 h-3.5" />
              : <Send className="w-3.5 h-3.5" />
            }
            {pushHubResult === 'success'
              ? t('¡Enviado!', 'Pushed!')
              : pushHubResult === 'error'
              ? t('Error', 'Error')
              : t('Hub', 'Hub')
            }
          </button>
        </div>
      </div>

      {/* Day Strip */}
      <div className="bg-white border-b" style={{ borderColor: '#e5e7eb' }}>
        <div className="px-4 lg:px-6 py-3">
          <div className="flex items-start gap-2">
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1" style={{ scrollbarWidth: 'none' }}>
            {weekPlans.map((day, i) => {
              const pt = weekPattern[i % weekPattern.length] || 'yellow';
              const pl = FUEL_DAY_LABELS[pt];
              const dm = sumMeals(day.meals);
              const tg = getEffectiveTargets(i);
              const isSelected = selectedDay === i;
              const isExpanded = expandedDay === i;
              const hasOverride = !!dayOverrides[`day_${i + 1}`];
              const isToday = isTodayIndex(i);
              const dayLabel = formatDayLabel(i);

              return (
                <div key={i} className="flex-shrink-0 group relative" style={{ minWidth: '108px' }}>
                  {isToday && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-1.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap" style={{ backgroundColor: '#16a34a', color: 'white', fontSize: '9px' }}>
                        {t('HOY', 'TODAY')}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setSelectedDay(i);
                      setExpandedDay(isExpanded ? null : i);
                    }}
                    className="w-full rounded-xl px-3 py-2.5 text-left transition-all"
                    style={{
                      border: isSelected ? '2px solid #fdda36' : isToday ? '2px solid #16a34a' : '2px solid #e5e7eb',
                      backgroundColor: isSelected ? '#fffbeb' : isToday ? '#f0fdf4' : '#fff',
                      boxShadow: isSelected ? '0 2px 8px rgba(253,218,54,0.3)' : isToday ? '0 2px 8px rgba(22,163,74,0.15)' : 'none',
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${pl.dot}`} />
                      <span className="text-xs font-bold truncate flex-1" style={{ color: isSelected ? '#1f2937' : '#374151' }}>{dayLabel.main}</span>
                      {hasOverride && (
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#514163' }} title={t('Objetivos personalizados', 'Custom targets')} />
                      )}
                    </div>
                    {dayLabel.sub && (
                      <p className="text-xs mb-1" style={{ color: isToday ? '#16a34a' : '#9ca3af', fontWeight: isToday ? 700 : 400 }}>{dayLabel.sub}</p>
                    )}
                    <p className="text-xs font-semibold" style={{ color: '#f59e0b' }}>
                      {dm.calories > 0 ? `${Math.round(dm.calories)} kcal` : `${tg.calories} kcal`}
                    </p>
                    <div className="flex gap-1 mt-0.5">
                      <span className="text-xs" style={{ color: '#ef4444' }}>{dm.calories > 0 ? `${dm.protein_g.toFixed(0)}P` : `${tg.protein}P`}</span>
                      <span className="text-xs" style={{ color: '#16a34a' }}>{dm.calories > 0 ? `${dm.carbs_g.toFixed(0)}C` : `${tg.carbs}C`}</span>
                      <span className="text-xs" style={{ color: '#ca8a04' }}>{dm.calories > 0 ? `${dm.fat_g.toFixed(0)}F` : `${tg.fat}F`}</span>
                    </div>
                    <div className="flex items-center justify-center mt-1.5">
                      <ChevronDown
                        className="w-3 h-3 transition-transform"
                        style={{ color: '#9ca3af', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </div>
                  </button>
                  {activePlan.duration_days > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteDay(i); }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      style={{ backgroundColor: '#ef4444', border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                      title={t('Eliminar día', 'Delete day')}
                    >
                      <X className="w-2.5 h-2.5" style={{ color: 'white' }} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {(resolvedEmail || effectiveUserId) && !isDemo && (
            <button
              onClick={() => setShowTrainingDrawer((v) => !v)}
              className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 rounded-xl px-4 py-3 transition-all hover:opacity-90"
              style={{
                border: showTrainingDrawer ? '2px solid #2563eb' : '2px solid #bfdbfe',
                backgroundColor: showTrainingDrawer ? '#eff6ff' : '#f0f6ff',
                minWidth: '116px',
                minHeight: '80px',
              }}
              title={t('Ver entrenamientos y hábitos', 'View training & habits')}
            >
              <Activity className="w-5 h-5" style={{ color: '#2563eb' }} />
              <span className="font-body font-bold text-center leading-tight" style={{ color: '#2563eb', fontSize: '12px' }}>
                {t('Entrenamiento', 'Training')}
              </span>
              <span className="font-body font-bold text-center leading-tight" style={{ color: '#2563eb', fontSize: '12px' }}>
                {t('& Hábitos', '& Habits')}
              </span>
            </button>
          )}
          </div>
        </div>

        {/* Expandable Day Macro Panel */}
        {expandedDay !== null && weekPlans[expandedDay] && (
          <DayMacroPanel
            key={expandedDay}
            dayLabel={activePlan.day_names?.[`day_${expandedDay + 1}`] || `${t('Día', 'Day')} ${expandedDay + 1}`}
            fuelType={weekPattern[expandedDay % weekPattern.length] || 'yellow'}
            basePlan={activePlan}
            currentOverride={dayOverrides[`day_${expandedDay + 1}`] || null}
            actualMacros={sumMeals(weekPlans[expandedDay].meals)}
            onSave={(override) => {
              const key = `day_${expandedDay + 1}`;
              setDayOverrides((prev) => ({ ...prev, [key]: override }));
              setExpandedDay(null);
            }}
            onReset={() => {
              const key = `day_${expandedDay + 1}`;
              setDayOverrides((prev) => { const n = { ...prev }; delete n[key]; return n; });
              setExpandedDay(null);
            }}
            onClose={() => setExpandedDay(null)}
            t={t}
            es={es}
          />
        )}
      </div>

      {/* Plan Tags Strip */}
      {activePlan && (
        <div className="bg-white border-b px-4 lg:px-6 py-2.5" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center gap-2 flex-wrap">
            {planTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: `${tag.color}22`, color: tag.color, border: `1px solid ${tag.color}44` }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
                {es && tag.name_es ? tag.name_es : tag.name}
                {(targetUserId || targetUserEmail) && (
                  <button
                    onClick={() => setPlanTags((prev) => prev.filter((t) => t.id !== tag.id))}
                    className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {(targetUserId || targetUserEmail) && (
              <button
                onClick={() => setShowTagSelector((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors"
                style={{
                  backgroundColor: showTagSelector ? '#f3f4f6' : 'transparent',
                  color: '#6b7280',
                  border: '1.5px dashed #d1d5db',
                }}
              >
                <Plus className="w-3 h-3" />
                {planTags.length === 0 ? t('Agregar tags al plan', 'Add tags to plan') : t('Agregar tag', 'Add tag')}
              </button>
            )}
            {showTagSelector && (targetUserId || targetUserEmail) && (
              <div className="w-full mt-1">
                <TagSelector
                  selectedTags={planTags}
                  onChange={(tags) => { setPlanTags(tags); }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plan vs Actual */}
      <div className="bg-white border-b px-4 lg:px-6 py-3" style={{ borderColor: '#e5e7eb' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
            {t('Plan vs Real', 'Plan vs Actual')}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{
            backgroundColor: fc.bg, color: fc.text, border: `1px solid ${fc.border}`,
          }}>
            {FUEL_DAY_LABELS[fuelType][es ? 'es' : 'en']}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: t('Calorías', 'Calories'), actual: Math.round(dayMacros.calories), target: dayTargets.calories, unit: 'kcal', color: '#f59e0b' },
            { label: t('Proteínas', 'Protein'), actual: Math.round(dayMacros.protein_g), target: dayTargets.protein, unit: 'g', color: '#ef4444' },
            { label: t('Carbos', 'Carbs'), actual: Math.round(dayMacros.carbs_g), target: dayTargets.carbs, unit: 'g', color: '#16a34a' },
            { label: t('Grasas', 'Fats'), actual: Math.round(dayMacros.fat_g), target: dayTargets.fat, unit: 'g', color: '#ca8a04' },
          ].map(({ label, actual, target, unit, color }) => {
            const delta = actual - target;
            const pct = target > 0 ? Math.round((actual / target) * 100) : 0;
            const isGood = pct >= 85 && pct <= 115;
            return (
              <div key={label} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#6b7280' }}>{label}</p>
                <p className="text-base font-bold" style={{ color }}>
                  {actual}<span className="text-xs font-normal ml-0.5" style={{ color: '#9ca3af' }}>{unit}</span>
                </p>
                <p className="text-xs" style={{ color: '#d1d5db' }}>/ {target}{unit}</p>
                <div className="flex items-center justify-center gap-0.5 mt-1">
                  {delta > 0
                    ? <TrendingUp className="w-3 h-3" style={{ color: isGood ? '#16a34a' : '#dc2626' }} />
                    : delta < 0
                    ? <TrendingDown className="w-3 h-3" style={{ color: '#dc2626' }} />
                    : <Minus className="w-3 h-3" style={{ color: '#9ca3af' }} />}
                  <span className="text-xs font-bold" style={{ color: isGood ? '#16a34a' : delta !== 0 ? '#dc2626' : '#9ca3af' }}>
                    {delta > 0 ? '+' : ''}{delta}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3-column main area */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 280px)' }}>

        {/* LEFT: Food Library */}
        <div
          className="hidden lg:flex flex-col flex-shrink-0 border-r bg-white"
          style={{ width: '300px', borderColor: '#e5e7eb' }}
        >
          {/* Header + Search */}
          <div className="p-3 border-b" style={{ borderColor: '#f3f4f6' }}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-sm font-bold" style={{ color: '#1f2937' }}>
                {t('Biblioteca', 'Food Library')}
              </span>
              {offLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: '#514163' }} />}
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
              <input
                type="text"
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                placeholder={t('Buscar...', 'Search...')}
                className="w-full pl-8 pr-8 py-2 rounded-xl border text-sm transition-all focus:outline-none"
                style={{ borderColor: '#e5e7eb', fontSize: '13px' }}
              />
              {foodSearch && (
                <button onClick={() => setFoodSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X className="w-3 h-3" style={{ color: '#9ca3af' }} />
                </button>
              )}
            </div>
          </div>

          {/* Type selector — segmented control style */}
          <div className="p-2 border-b" style={{ borderColor: '#f3f4f6', backgroundColor: '#f9fafb' }}>
            <div className="grid grid-cols-3 gap-1 mb-1">
              {FOOD_TYPE_TABS.slice(0, 3).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setFoodTypeTab(tab.key); setFoodSubCategory(''); setSuppFormFilter(''); setSuppPage(0); }}
                  className="py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    backgroundColor: foodTypeTab === tab.key ? '#514163' : '#fff',
                    color: foodTypeTab === tab.key ? '#fdda36' : '#6b7280',
                    border: foodTypeTab === tab.key ? '1.5px solid #514163' : '1.5px solid #e5e7eb',
                    boxShadow: foodTypeTab === tab.key ? '0 1px 4px rgba(81,65,99,0.18)' : 'none',
                  }}
                >
                  {es ? tab.labelEs : tab.labelEn}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {FOOD_TYPE_TABS.slice(3).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setFoodTypeTab(tab.key); setFoodSubCategory(''); setSuppFormFilter(''); setSuppPage(0); }}
                  className="py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    backgroundColor: foodTypeTab === tab.key ? '#514163' : '#fff',
                    color: foodTypeTab === tab.key ? '#fdda36' : '#6b7280',
                    border: foodTypeTab === tab.key ? '1.5px solid #514163' : '1.5px solid #e5e7eb',
                    boxShadow: foodTypeTab === tab.key ? '0 1px 4px rgba(81,65,99,0.18)' : 'none',
                  }}
                >
                  {es ? tab.labelEs : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory pills — wrap (no horizontal scroll) */}
          {(foodTypeTab === 'foods' || foodTypeTab === 'products' || foodTypeTab === 'supplements' || foodTypeTab === 'templates') && (
            <div className="px-2 py-2 border-b" style={{ borderColor: '#f3f4f6' }}>
              <div className="flex flex-wrap gap-1">
                {foodTypeTab === 'supplements'
                  ? FOOD_SUBCATEGORIES.supplements.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => { setSuppFormFilter(suppFormFilter === c.value ? '' : c.value); setSuppPage(0); }}
                      className="px-2 py-1 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        backgroundColor: suppFormFilter === c.value ? '#514163' : '#f3f4f6',
                        color: suppFormFilter === c.value ? '#fdda36' : '#374151',
                      }}
                    >
                      {es ? c.labelEs : c.labelEn}
                    </button>
                  ))
                  : foodTypeTab === 'templates'
                  ? FOOD_SUBCATEGORIES.templates.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setTemplateFocusFilter(templateFocusFilter === c.value ? '' : c.value)}
                      className="px-2 py-1 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        backgroundColor: templateFocusFilter === c.value ? '#514163' : '#f3f4f6',
                        color: templateFocusFilter === c.value ? '#fdda36' : '#374151',
                      }}
                    >
                      {es ? c.labelEs : c.labelEn}
                    </button>
                  ))
                  : FOOD_SUBCATEGORIES[foodTypeTab].map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setFoodSubCategory(foodSubCategory === c.value ? '' : c.value)}
                      className="px-2 py-1 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        backgroundColor: foodSubCategory === c.value ? '#514163' : '#f3f4f6',
                        color: foodSubCategory === c.value ? '#fdda36' : '#374151',
                      }}
                    >
                      {es ? c.labelEs : c.labelEn}
                    </button>
                  ))
                }
              </div>
            </div>
          )}

          {/* Macro filter pills — only for foods/products */}
          {(foodTypeTab === 'foods' || foodTypeTab === 'products') && (
            <div className="px-2 py-2 border-b" style={{ borderColor: '#f3f4f6' }}>
              <div className="flex flex-wrap gap-1">
                {MACRO_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setMacroFilter(macroFilter === f.value ? '' : f.value)}
                    className="px-2 py-0.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: macroFilter === f.value ? '#16a34a' : '#f3f4f6',
                      color: macroFilter === f.value ? '#fff' : '#374151',
                    }}
                  >
                    {es ? f.label_es : f.label_en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!selectedMealId && foodTypeTab !== 'templates' && (
            <div className="mx-3 mt-2 px-2 py-1.5 rounded-lg text-xs text-center" style={{ backgroundColor: '#fef9c3', color: '#92400e' }}>
              {t('Selecciona una comida para agregar', 'Select a meal to add items')}
            </div>
          )}

          {/* Food list */}
          <div className="flex-1 overflow-y-auto">
            {foodTypeTab === 'recipes' ? (
              filteredRecipes.length > 0 ? filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onAdd={(r, qty) => addRecipeToMeal(r, qty)}
                  disabled={!selectedMealId}
                  es={es}
                />
              )) : (
                <div className="text-center py-10 px-4">
                  <p className="text-sm" style={{ color: '#9ca3af' }}>
                    {t('Sin recetas. Agrega desde Recetas.', 'No recipes found.')}
                  </p>
                </div>
              )
            ) : foodTypeTab === 'supplements' ? (
              <>
                {pagedSupplements.length > 0 ? pagedSupplements.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    es={es}
                    onAdd={addFoodToMeal}
                    disabled={!selectedMealId}
                    isOFF={false}
                    onDragStart={handleFoodDragStart}
                  />
                )) : (
                  <div className="text-center py-10 px-4">
                    <p className="text-sm" style={{ color: '#9ca3af' }}>{t('Sin resultados', 'No results')}</p>
                  </div>
                )}
                {suppTotalPages > 1 && (
                  <div className="flex items-center justify-between px-3 py-2 border-t sticky bottom-0 bg-white" style={{ borderColor: '#f3f4f6' }}>
                    <button
                      disabled={suppPage === 0}
                      onClick={() => setSuppPage((p) => p - 1)}
                      className="p-1.5 rounded-lg transition-all disabled:opacity-30"
                      style={{ backgroundColor: '#f3f4f6' }}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" style={{ color: '#514163' }} />
                    </button>
                    <span className="text-xs font-semibold" style={{ color: '#6b7280' }}>
                      {suppPage + 1} / {suppTotalPages}
                    </span>
                    <button
                      disabled={suppPage >= suppTotalPages - 1}
                      onClick={() => setSuppPage((p) => p + 1)}
                      className="p-1.5 rounded-lg transition-all disabled:opacity-30"
                      style={{ backgroundColor: '#f3f4f6' }}
                    >
                      <ChevronRight className="w-3.5 h-3.5" style={{ color: '#514163' }} />
                    </button>
                  </div>
                )}
              </>
            ) : foodTypeTab === 'templates' ? (
              filteredTemplates.length > 0 ? filteredTemplates.map((tmpl) => (
                <TemplateCard
                  key={tmpl.id}
                  template={tmpl}
                  es={es}
                  onApply={() => setShowTemplateModal(tmpl)}
                />
              )) : (
                <div className="text-center py-10 px-4">
                  <p className="text-sm" style={{ color: '#9ca3af' }}>{t('Sin templates', 'No templates found')}</p>
                </div>
              )
            ) : (
              <>
                {[...filteredFoods, ...offResults].map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    es={es}
                    onAdd={addFoodToMeal}
                    disabled={!selectedMealId}
                    isOFF={food.id.startsWith('off_')}
                    onDragStart={handleFoodDragStart}
                  />
                ))}
                {filteredFoods.length === 0 && offResults.length === 0 && !offLoading && (
                  <div className="text-center py-10 px-4">
                    <p className="text-sm" style={{ color: '#9ca3af' }}>
                      {foodSearch ? t('Sin resultados', 'No results') : t('Busca un alimento', 'Search for a food')}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* CENTER: Meals */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentDay && (
            <>
              {currentDay.meals.length === 0 && (
                <div className="rounded-2xl py-12 text-center" style={{ border: '2px dashed #e5e7eb', backgroundColor: '#fafafa' }}>
                  <Utensils className="w-10 h-10 mx-auto mb-3" style={{ color: '#d1d5db' }} />
                  <p className="text-sm font-semibold mb-1" style={{ color: '#6b7280' }}>
                    {t('No hay comidas para este día', 'No meals for this day')}
                  </p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>
                    {t('Agrega una comida usando el botón de abajo', 'Add a meal using the button below')}
                  </p>
                </div>
              )}

              {currentDay.meals.map((meal) => {
                const mt = meal.items.reduce(
                  (a, i) => ({ cal: a.cal + i.calories, p: a.p + i.protein_g, c: a.c + i.carbs_g, f: a.f + i.fat_g }),
                  { cal: 0, p: 0, c: 0, f: 0 }
                );
                const isSelected = selectedMealId === meal.id;
                const isDragOver = dragOverMealId === meal.id;

                return (
                  <div
                    key={meal.id}
                    className="bg-white rounded-2xl overflow-hidden transition-all"
                    style={{
                      border: isDragOver ? '2px dashed #514163' : isSelected ? '2px solid #514163' : '2px solid #e5e7eb',
                      boxShadow: isSelected ? '0 0 0 4px rgba(81,65,99,0.08)' : 'none',
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragOverMealId(meal.id); }}
                    onDragLeave={() => setDragOverMealId(null)}
                    onDrop={() => handleDrop(meal.id)}
                  >
                    {/* Meal header */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                      style={{ borderBottom: '1px solid #f3f4f6' }}
                      onClick={() => setSelectedMealId(isSelected ? null : meal.id)}
                    >
                      <span className="text-xl leading-none flex-shrink-0">
                        {meal.type.startsWith('other') ? '🍴' : getMealTypeIcon(meal.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={meal.name}
                          onChange={(e) => { e.stopPropagation(); updateMealName(meal.id, e.target.value); }}
                          onClick={(e) => e.stopPropagation()}
                          placeholder={t('Nombre de la comida...', 'Meal name...')}
                          className="block w-full font-bold text-sm bg-transparent border-none outline-none focus:ring-0 p-0"
                          style={{ color: '#1f2937' }}
                        />
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Clock className="w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
                        <input
                          type="time"
                          value={meal.time || '12:00'}
                          onChange={(e) => updateMealTime(meal.id, e.target.value)}
                          className="text-xs font-semibold border-none bg-transparent outline-none focus:ring-0 cursor-pointer"
                          style={{ color: '#374151', width: '60px' }}
                        />
                      </div>
                      {mt.cal > 0 && (
                        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>{Math.round(mt.cal)}</span>
                          <span className="text-xs font-semibold" style={{ color: '#ef4444' }}>{mt.p.toFixed(0)}P</span>
                          <span className="text-xs font-semibold" style={{ color: '#16a34a' }}>{mt.c.toFixed(0)}C</span>
                          <span className="text-xs font-semibold" style={{ color: '#ca8a04' }}>{mt.f.toFixed(0)}F</span>
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeMeal(meal.id); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-all flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                      </button>
                    </div>

                    {/* Items */}
                    <div className="px-3 pb-3 pt-2 space-y-1.5">
                      {meal.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 py-1.5 px-2 rounded-xl group hover:bg-gray-50 transition-colors"
                          draggable
                          onDragStart={() => handleDragStart(item.id, meal.id)}
                          style={{ opacity: dragging?.itemId === item.id ? 0.4 : 1, cursor: 'grab' }}
                        >
                          <GripVertical className="w-3.5 h-3.5 opacity-20 group-hover:opacity-50 flex-shrink-0" style={{ color: '#9ca3af' }} />
                          <span className="flex-1 text-sm font-medium truncate" style={{ color: '#1f2937' }}>{item.food_name}</span>
                          <input
                            type="number"
                            value={item.quantity_g}
                            onChange={(e) => updateItemQty(meal.id, item.id, parseFloat(e.target.value) || 100)}
                            min={1}
                            className="w-14 text-center rounded-lg border py-1 text-xs font-bold"
                            style={{ borderColor: '#e5e7eb', color: '#374151' }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-xs flex-shrink-0" style={{ color: '#9ca3af' }}>g</span>
                          <div className="hidden sm:flex items-center gap-1.5 text-xs flex-shrink-0">
                            <span style={{ color: '#f59e0b' }}>{Math.round(item.calories)}</span>
                            <span style={{ color: '#ef4444' }}>{item.protein_g.toFixed(0)}P</span>
                            <span style={{ color: '#16a34a' }}>{item.carbs_g.toFixed(0)}C</span>
                          </div>
                          <button
                            onClick={() => removeFoodFromMeal(meal.id, item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 transition-all flex-shrink-0"
                          >
                            <X className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                          </button>
                        </div>
                      ))}

                      {/* Drop zone */}
                      <div
                        className="rounded-xl py-3 text-center transition-all"
                        style={{
                          border: '2px dashed',
                          borderColor: isDragOver ? '#514163' : isSelected ? '#c4b5d4' : '#e5e7eb',
                          backgroundColor: isDragOver ? '#f9f7fb' : 'transparent',
                        }}
                      >
                        <p className="text-xs" style={{ color: '#9ca3af' }}>
                          {isDragOver ? t('Soltar aquí', 'Drop here') : t('Arrastra alimentos aquí', 'Drag foods here')}
                        </p>
                      </div>

                      {/* Add Food button — opens modal */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMealId(meal.id);
                          setFoodModalMealId(meal.id);
                          setShowFoodModal(true);
                        }}
                        className="w-full rounded-xl py-2.5 text-xs font-bold transition-all hover:shadow-sm flex items-center justify-center gap-2"
                        style={{ border: '2px solid #514163', color: '#514163', backgroundColor: '#f9f7fb' }}
                      >
                        <Search className="w-3.5 h-3.5" />
                        {t('Agregar Alimento', 'Add Food')}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Meal section */}
              <div className="bg-white rounded-2xl p-4" style={{ border: '2px solid #e5e7eb' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#9ca3af' }}>
                  {t('+ Agregar Comida', '+ Add Meal')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {MEAL_SLOTS
                    .filter((s) => !currentDay.meals.some((m) => m.type === s.key))
                    .map((slot) => (
                      <button
                        key={slot.key}
                        onClick={() => addMeal(slot.key)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all hover:shadow-sm"
                        style={{ borderColor: '#e5e7eb', color: '#514163', backgroundColor: '#f9f7fb' }}
                      >
                        <span>{getMealTypeIcon(slot.key)}</span>
                        {getMealTypeLabel(slot.key, es ? 'es' : 'en')}
                      </button>
                    ))}
                  {/* Always-available "Other" button */}
                  <button
                    onClick={addOtherMeal}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all hover:shadow-sm"
                    style={{ borderColor: '#fdda36', color: '#92400e', backgroundColor: '#fffbeb' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t('Otra Comida', 'Other Meal')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Global Analysis */}
        <div
          className="hidden lg:flex flex-col flex-shrink-0 border-l bg-white"
          style={{ width: '256px', borderColor: '#e5e7eb' }}
        >
          <div className="p-3 border-b" style={{ borderColor: '#f3f4f6' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
              {t('Análisis Global', 'Global Analysis')}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: '#374151' }}>{t('Macronutrientes', 'Macronutrients')}</p>
              {[
                { label: 'Kcal', actual: Math.round(dayMacros.calories), target: dayTargets.calories, color: '#f59e0b' },
                { label: t('Prot', 'Prot'), actual: Math.round(dayMacros.protein_g), target: dayTargets.protein, color: '#ef4444' },
                { label: t('Carbs', 'Carbs'), actual: Math.round(dayMacros.carbs_g), target: dayTargets.carbs, color: '#16a34a' },
                { label: t('Grasa', 'Fat'), actual: Math.round(dayMacros.fat_g), target: dayTargets.fat, color: '#ca8a04' },
              ].map(({ label, actual, target, color }) => {
                const pct = target > 0 ? Math.min(100, Math.round((actual / target) * 100)) : 0;
                return (
                  <div key={label} className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: '#374151' }}>{label}</span>
                      <span className="text-xs" style={{ color: '#9ca3af' }}>{actual}/{target}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                    <div className="text-right mt-0.5">
                      <span className="text-xs font-bold" style={{ color: pct >= 85 ? '#16a34a' : '#dc2626' }}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {micronutrients && (
              <>
                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: '#374151' }}>{t('Vitaminas', 'Vitamins')}</p>
                  <div className="space-y-1.5">
                    {micronutrients.vitamins.map((v) => {
                      const pct = v.rdi > 0 ? Math.min(200, Math.round((v.value / v.rdi) * 100)) : 0;
                      return <MicroRow key={v.name} name={v.name} value={v.value} unit={v.unit} pct={pct} hasData={v.value > 0} />;
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: '#374151' }}>{t('Minerales', 'Minerals')}</p>
                  <div className="space-y-1.5">
                    {micronutrients.minerals.map((m) => {
                      const pct = m.rdi > 0 ? Math.min(200, Math.round((m.value / m.rdi) * 100)) : 0;
                      return <MicroRow key={m.name} name={m.name} value={m.value} unit={m.unit} pct={pct} hasData={m.value > 0} />;
                    })}
                  </div>
                </div>
              </>
            )}

            {!micronutrients && (
              <div className="text-center py-6">
                <p className="text-xs" style={{ color: '#9ca3af' }}>
                  {t('Agrega alimentos para ver micronutrientes', 'Add foods to see micronutrients')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Food Search Modal */}
      {showFoodModal && (
        <FoodSearchModal
          foods={foods}
          recipes={recipes}
          offResults={offResults}
          offLoading={offLoading}
          es={es}
          mealId={foodModalMealId}
          onAddFood={(food, qty) => addFoodToMeal(food, qty, foodModalMealId || undefined)}
          onAddRecipe={(recipe, qty) => addRecipeToMeal(recipe, qty, foodModalMealId || undefined)}
          onSearchExternal={searchOpenFoodFacts}
          onClose={() => { setShowFoodModal(false); setFoodModalMealId(null); }}
          t={t}
        />
      )}

      {/* Customize Days Modal */}
      {showCustomizeDays && (
        <CustomizeDaysModal
          weekPlans={weekPlans}
          dayNames={dayNames}
          customDayNames={customDayNames}
          setCustomDayNames={setCustomDayNames}
          customWeekPattern={customWeekPattern}
          setCustomWeekPattern={setCustomWeekPattern}
          onClose={() => setShowCustomizeDays(false)}
          onSave={() => {
            setActivePlan((p) => p ? { ...p, day_names: customDayNames, week_pattern: customWeekPattern } : p);
            setShowCustomizeDays(false);
          }}
          t={t}
        />
      )}

      {showCreatePlan && (
        <CreatePlanModal
          form={newPlanForm} setForm={setNewPlanForm}
          onClose={() => setShowCreatePlan(false)} onCreate={handleCreatePlan}
          creating={creatingPlan} t={t} es={es}
        />
      )}

      {showTemplateModal && activePlan && (
        <TemplateApplyModal
          template={showTemplateModal}
          weekPlans={weekPlans}
          activePlan={activePlan}
          onApply={(assignments) => applyTemplate(showTemplateModal, assignments)}
          onClose={() => setShowTemplateModal(null)}
          es={es}
        />
      )}

      {showPlansPanel && (
        <div className="fixed inset-0 z-50 flex items-start justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => { setShowPlansPanel(false); setConfirmDeleteId(null); }}>
          <div
            className="h-full w-full max-w-sm bg-white flex flex-col animate-slide-up"
            style={{ boxShadow: '-4px 0 24px rgba(0,0,0,0.12)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#f3f4f6', backgroundColor: '#fafafa' }}>
              <div className="flex items-center gap-2">
                <LayoutList className="w-5 h-5" style={{ color: '#514163' }} />
                <h2 className="font-heading text-base" style={{ color: '#1f2937' }}>{t('Planes de Alimentación', 'Meal Plans')}</h2>
              </div>
              <button onClick={() => { setShowPlansPanel(false); setConfirmDeleteId(null); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all">
                <X className="w-4 h-4" style={{ color: '#6b7280' }} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {allPlans.length === 0 ? (
                <div className="text-center py-8">
                  <Utensils className="w-10 h-10 mx-auto mb-3" style={{ color: '#d1d5db' }} />
                  <p className="font-body text-sm" style={{ color: '#9ca3af' }}>{t('No hay planes aún', 'No plans yet')}</p>
                </div>
              ) : (
                allPlans.map((plan) => {
                  const isActive = activePlan?.id === plan.id;
                  const isConfirmDelete = confirmDeleteId === plan.id;
                  const isDeleting = deletingPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      className="rounded-xl border transition-all"
                      style={{
                        borderColor: isActive ? '#514163' : '#e5e7eb',
                        backgroundColor: isActive ? '#f5f3ff' : '#fff',
                      }}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: isActive ? '#514163' : '#f3f4f6' }}
                        >
                          <Calendar className="w-4 h-4" style={{ color: isActive ? '#fdda36' : '#9ca3af' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-semibold text-sm truncate" style={{ color: '#1f2937' }}>{plan.title}</p>
                          <p className="font-body text-xs" style={{ color: '#9ca3af' }}>
                            {plan.duration_days} {t('días', 'days')} · {Math.ceil(plan.duration_days / 7)} {t('sem.', 'wks')}
                            {isActive && <span className="ml-1 text-green-600 font-semibold">· {t('activo', 'active')}</span>}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!isActive && (
                            <button
                              onClick={() => handleSwitchPlan(plan.id)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                              style={{ backgroundColor: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' }}
                            >
                              {t('Abrir', 'Open')}
                            </button>
                          )}
                          {!isConfirmDelete ? (
                            <button
                              onClick={() => setConfirmDeleteId(plan.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-all"
                              title={t('Eliminar plan', 'Delete plan')}
                            >
                              <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 rounded-lg px-2 py-1" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                              <AlertTriangle className="w-3 h-3 flex-shrink-0" style={{ color: '#ef4444' }} />
                              <button
                                onClick={() => handleDeletePlan(plan.id)}
                                disabled={isDeleting}
                                className="text-xs font-bold transition-all"
                                style={{ color: '#ef4444' }}
                              >
                                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : t('Confirmar', 'Confirm')}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-xs"
                                style={{ color: '#9ca3af' }}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t" style={{ borderColor: '#f3f4f6' }}>
              <button
                onClick={() => { setShowPlansPanel(false); setShowCreatePlan(true); }}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3"
              >
                <Plus className="w-4 h-4" />
                {t('Crear Nuevo Plan', 'Create New Plan')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Training Sneak Peek Drawer */}
      {showTrainingDrawer && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
            onClick={() => setShowTrainingDrawer(false)}
          />
          <div
            className="fixed top-0 right-0 h-full z-50 flex flex-col"
            style={{
              width: 'min(480px, 95vw)',
              backgroundColor: '#ffffff',
              boxShadow: '-4px 0 32px rgba(0,0,0,0.15)',
              animation: 'slideInFromRight 0.25s ease-out',
            }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: '#e5e7eb' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
                  <Activity className="w-4 h-4" style={{ color: '#2563eb' }} />
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold" style={{ color: '#1f2937' }}>
                    {t('Entrenamiento & Hábitos', 'Training & Habits')}
                  </h2>
                  {targetUserName && (
                    <p className="font-body text-xs" style={{ color: '#9ca3af' }}>{targetUserName}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowTrainingDrawer(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" style={{ color: '#6b7280' }} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <TrainingSneakPeek
                athleteId={effectiveUserId ?? ''}
                athleteEmail={resolvedEmail}
              />
              {(resolvedEmail || resolvedName) && (
                <HubHabitsCard
                  athleteEmail={resolvedEmail ?? resolvedName ?? ''}
                  athleteName={resolvedName}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const MACRO_PRESETS = [
  { key: 'balanced', labelEs: 'Equilibrado', labelEn: 'Balanced', p: 25, c: 45, f: 30 },
  { key: 'high_protein', labelEs: 'Alto en Proteínas', labelEn: 'High Protein', p: 35, c: 40, f: 25 },
  { key: 'low_carb', labelEs: 'Bajo en Carbos', labelEn: 'Low Carb', p: 30, c: 25, f: 45 },
  { key: 'high_carb', labelEs: 'Alto en Carbos', labelEn: 'High Carb', p: 20, c: 55, f: 25 },
  { key: 'keto', labelEs: 'Cetogénico', labelEn: 'Keto', p: 25, c: 5, f: 70 },
];

function GkgInput({
  perKg, gkgStep, gkgMin, gkgMax, color, bodyWeight, onSet,
}: {
  perKg: number; gkgStep: number; gkgMin: number; gkgMax: number;
  color: string; bodyWeight: number; onSet: (v: number) => void;
}) {
  const [text, setText] = useState(String(perKg));

  useEffect(() => {
    setText(String(perKg));
  }, [perKg]);

  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        const parsed = parseFloat(text);
        if (!isNaN(parsed) && bodyWeight > 0) {
          const clamped = Math.max(gkgMin, Math.min(gkgMax, parsed));
          onSet(Math.round(clamped * bodyWeight));
          setText(String(Math.round(clamped * 10) / 10));
        } else {
          setText(String(perKg));
        }
      }}
      className="w-16 text-center rounded-lg border py-1 text-xs font-bold focus:outline-none"
      style={{ borderColor: color, color, backgroundColor: 'white' }}
    />
  );
}

function MacroSlider({
  value, min, max, step, color, unit,
  onChange,
}: {
  value: number; min: number; max: number; step: number;
  color: string; unit: string;
  onChange: (v: number) => void;
}) {
  const pct = Math.round(((value - min) / (max - min)) * 100);
  const trackStyle = {
    background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
  };

  return (
    <div className="relative">
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full appearance-none cursor-pointer"
        style={{
          height: '8px',
          borderRadius: '9999px',
          outline: 'none',
          ...trackStyle,
          WebkitAppearance: 'none',
        }}
      />
      <style>{`
        input[type=range].macro-slider-${color.replace('#', '')}::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid ${color};
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid ${color};
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        input[type=range]::-moz-range-thumb {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid ${color};
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
      `}</style>
      <div className="flex justify-between text-xs mt-1.5" style={{ color: '#9ca3af' }}>
        <span>{min}{unit}</span>
        <span style={{ color, fontWeight: 700 }}>{value}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

function useNumericInput(initial: number, min: number, max: number, isFloat = false) {
  const [value, setValue] = useState(initial);
  const [text, setText] = useState(String(initial));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    const parsed = isFloat ? parseFloat(text) : parseInt(text);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      setValue(clamped);
      setText(String(clamped));
    } else {
      setText(String(value));
    }
  };

  const set = (v: number) => {
    const clamped = Math.max(min, Math.min(max, v));
    setValue(clamped);
    setText(String(clamped));
  };

  return { value, text, handleChange, handleBlur, set };
}

function DayMacroPanel({
  dayLabel, fuelType, basePlan, currentOverride, actualMacros,
  onSave, onReset, onClose, t, es,
}: {
  dayLabel: string;
  fuelType: 'green' | 'yellow' | 'red';
  basePlan: ActivePlan;
  currentOverride: DayOverride | null;
  actualMacros: { calories: number; protein_g: number; carbs_g: number; fat_g: number };
  onSave: (override: DayOverride) => void;
  onReset: () => void;
  onClose: () => void;
  t: (esStr: string, en: string) => string;
  es: boolean;
}) {
  const baseTargets = getDayTargetMacros(basePlan.calories_goal, basePlan.protein_goal, basePlan.carbs_goal, basePlan.fats_goal, fuelType);
  const initial = currentOverride || baseTargets;

  const bw = useNumericInput(70, 30, 250, true);
  const cal = useNumericInput(initial.calories, 800, 8000);
  const prot = useNumericInput(initial.protein, 30, 400);
  const carb = useNumericInput(initial.carbs, 20, 1200);
  const fat = useNumericInput(initial.fat, 20, 300);

  const bodyWeight = bw.value;
  const calories = cal.value;
  const protein = prot.value;
  const carbs = carb.value;

  const [proteinMode, setProteinMode] = useState<'g' | 'gkg'>('g');
  const [carbsMode, setCarbsMode] = useState<'g' | 'gkg'>('g');
  const [fatMode, setFatMode] = useState<'g' | 'gkg'>('g');

  const fatValue = fat.value;

  const proteinPerKg = bodyWeight > 0 ? Math.round((protein / bodyWeight) * 10) / 10 : 0;
  const carbsPerKg = bodyWeight > 0 ? Math.round((carbs / bodyWeight) * 10) / 10 : 0;
  const fatPerKg = bodyWeight > 0 ? Math.round((fatValue / bodyWeight) * 10) / 10 : 0;

  const totalFromMacros = Math.round(protein * 4 + carbs * 4 + fatValue * 9);
  const totalPct = calories > 0 ? Math.round((totalFromMacros / calories) * 100) : 0;
  const proteinPct = calories > 0 ? Math.round((protein * 4 / calories) * 100) : 0;
  const carbsPct = calories > 0 ? Math.round((carbs * 4 / calories) * 100) : 0;
  const fatPct = calories > 0 ? Math.round((fatValue * 9 / calories) * 100) : 0;

  const applyPreset = (preset: typeof MACRO_PRESETS[0]) => {
    prot.set(Math.round((calories * preset.p / 100) / 4));
    carb.set(Math.round((calories * preset.c / 100) / 4));
    fat.set(Math.round((calories * preset.f / 100) / 9));
  };

  const fuelColors = {
    green: { bg: '#f0fdf4', border: '#86efac', text: '#16a34a' },
    yellow: { bg: '#fefce8', border: '#fcd34d', text: '#ca8a04' },
    red: { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626' },
  };
  const fc = fuelColors[fuelType];

  const calPct = Math.round(((calories - 800) / (8000 - 800)) * 100);
  const calTrack = {
    background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${calPct}%, #e5e7eb ${calPct}%, #e5e7eb 100%)`,
  };

  const macroItems = [
    {
      key: 'protein',
      label: t('Proteínas', 'Protein'),
      numInput: prot,
      actual: actualMacros.protein_g,
      perKg: proteinPerKg,
      mode: proteinMode, setMode: setProteinMode,
      min: 30, max: 400, step: 5,
      gkgMin: 0.8, gkgMax: 4.0, gkgStep: 0.1,
      color: '#ef4444', bgColor: '#fef2f2',
      unit: 'g', kcalFactor: 4,
    },
    {
      key: 'carbs',
      label: t('Carbohidratos', 'Carbohydrates'),
      numInput: carb,
      actual: actualMacros.carbs_g,
      perKg: carbsPerKg,
      mode: carbsMode, setMode: setCarbsMode,
      min: 20, max: 1200, step: 5,
      gkgMin: 1, gkgMax: 14, gkgStep: 0.5,
      color: '#16a34a', bgColor: '#f0fdf4',
      unit: 'g', kcalFactor: 4,
    },
    {
      key: 'fat',
      label: t('Grasas', 'Fats'),
      numInput: fat,
      actual: actualMacros.fat_g,
      perKg: fatPerKg,
      mode: fatMode, setMode: setFatMode,
      min: 20, max: 300, step: 2,
      gkgMin: 0.5, gkgMax: 4.0, gkgStep: 0.1,
      color: '#ca8a04', bgColor: '#fefce8',
      unit: 'g', kcalFactor: 9,
    },
  ];

  return (
    <div
      className="border-t px-4 lg:px-6 py-5"
      style={{
        borderColor: '#e5e7eb',
        backgroundColor: '#f8f9fa',
        animation: 'slideDown 0.2s ease-out',
      }}
    >
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.18);
        }
        input[type=range]::-moz-range-thumb {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.18);
          border: none;
        }
      `}</style>

      {/* Panel header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <Sliders className="w-4 h-4 flex-shrink-0" style={{ color: '#514163' }} />
          <span className="font-bold text-sm" style={{ color: '#1f2937' }}>
            {t('Objetivos de', 'Targets for')} {dayLabel}
          </span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: fc.bg, color: fc.text, border: `1px solid ${fc.border}` }}
          >
            {fuelType === 'green' ? t('Alto CHO', 'High CHO') : fuelType === 'yellow' ? t('Mod CHO', 'Mod CHO') : t('Bajo CHO', 'Low CHO')}
          </span>
          {currentOverride && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#ede9fe', color: '#6d28d9', border: '1px solid #c4b5fd' }}>
              {t('Personalizado', 'Custom')}
            </span>
          )}
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200 transition-all flex-shrink-0">
          <X className="w-4 h-4" style={{ color: '#6b7280' }} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* COL 1: Calories + Body Weight + Presets */}
        <div className="space-y-3">

          {/* Body weight */}
          <div className="bg-white rounded-2xl p-4" style={{ border: '2px solid #e5e7eb' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#514163' }} />
              <span className="text-sm font-bold" style={{ color: '#1f2937' }}>
                {t('Peso Corporal', 'Body Weight')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={bw.text}
                onChange={bw.handleChange}
                onBlur={bw.handleBlur}
                className="flex-1 text-center rounded-xl border py-2 text-lg font-bold focus:outline-none"
                style={{ borderColor: '#514163', color: '#514163', backgroundColor: '#f9f7fb' }}
              />
              <span className="text-sm font-bold" style={{ color: '#9ca3af' }}>kg</span>
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: '#9ca3af' }}>
              {t('Ingresa el peso para calcular g/kg', 'Enter weight to calculate g/kg')}
            </p>
          </div>

          {/* Calories */}
          <div className="bg-white rounded-2xl p-4" style={{ border: '2px solid #e5e7eb' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold" style={{ color: '#1f2937' }}>
                {t('Calorías', 'Calories')}
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  inputMode="numeric"
                  value={cal.text}
                  onChange={cal.handleChange}
                  onBlur={cal.handleBlur}
                  className="w-20 text-center rounded-xl border py-1.5 text-base font-bold focus:outline-none"
                  style={{ borderColor: '#fdda36', color: '#92400e', backgroundColor: '#fffbeb' }}
                />
                <span className="text-xs font-bold" style={{ color: '#9ca3af' }}>kcal</span>
              </div>
            </div>

            <div className="mb-3">
              <input
                type="range"
                min={800} max={8000} step={50}
                value={calories}
                onChange={(e) => cal.set(parseInt(e.target.value))}
                className="w-full appearance-none cursor-pointer"
                style={{ height: '8px', borderRadius: '9999px', outline: 'none', WebkitAppearance: 'none', ...calTrack }}
              />
              <style>{`
                input[type=range]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  width: 20px; height: 20px;
                  border-radius: 50%;
                  background: white;
                  border: 3px solid #f59e0b;
                  cursor: pointer;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }
                input[type=range]::-moz-range-thumb {
                  width: 20px; height: 20px;
                  border-radius: 50%;
                  background: white;
                  border: 3px solid #f59e0b;
                  cursor: pointer;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }
              `}</style>
              <div className="flex justify-between text-xs mt-1.5" style={{ color: '#9ca3af' }}>
                <span>800</span>
                <span className="font-bold" style={{ color: '#f59e0b' }}>{calories} kcal</span>
                <span>8000</span>
              </div>
            </div>

            {/* Actual calories */}
            {actualMacros.calories > 0 && (
              <div className="flex items-center justify-between text-xs pt-2 border-t" style={{ borderColor: '#f3f4f6' }}>
                <span style={{ color: '#9ca3af' }}>{t('Real:', 'Actual:')}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold" style={{ color: '#f59e0b' }}>{Math.round(actualMacros.calories)}</span>
                  <span
                    className="px-1.5 py-0.5 rounded-lg font-bold"
                    style={{
                      backgroundColor: Math.abs(actualMacros.calories - calories) / calories < 0.1 ? '#f0fdf4' : '#fef2f2',
                      color: Math.abs(actualMacros.calories - calories) / calories < 0.1 ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {actualMacros.calories > calories ? '+' : ''}{Math.round(actualMacros.calories - calories)}
                  </span>
                </div>
              </div>
            )}

            {/* Macro distribution bar */}
            <div className="mt-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="flex-1 h-3 rounded-full overflow-hidden bg-gray-100 flex" style={{ border: '1px solid #e5e7eb' }}>
                  <div className="h-full transition-all" style={{ width: `${proteinPct}%`, backgroundColor: '#ef4444' }} />
                  <div className="h-full transition-all" style={{ width: `${carbsPct}%`, backgroundColor: '#16a34a' }} />
                  <div className="h-full transition-all" style={{ width: `${fatPct}%`, backgroundColor: '#ca8a04' }} />
                </div>
                <span
                  className="text-xs font-bold flex-shrink-0 px-1.5 py-0.5 rounded-lg"
                  style={{
                    backgroundColor: totalPct > 105 ? '#fef2f2' : totalPct < 90 ? '#fefce8' : '#f0fdf4',
                    color: totalPct > 105 ? '#dc2626' : totalPct < 90 ? '#ca8a04' : '#16a34a',
                  }}
                >
                  {totalPct}%
                </span>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="font-semibold" style={{ color: '#ef4444' }}>P {proteinPct}%</span>
                <span className="font-semibold" style={{ color: '#16a34a' }}>C {carbsPct}%</span>
                <span className="font-semibold" style={{ color: '#ca8a04' }}>F {fatPct}%</span>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="bg-white rounded-2xl p-3" style={{ border: '2px solid #e5e7eb' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#9ca3af' }}>
              {t('Plantillas', 'Presets')}
            </p>
            <div className="space-y-1.5">
              {MACRO_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => applyPreset(preset)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-gray-50 active:scale-95"
                  style={{ border: '1.5px solid #e5e7eb', color: '#374151' }}
                >
                  <span>{es ? preset.labelEs : preset.labelEn}</span>
                  <span style={{ color: '#9ca3af' }}>{preset.p}·{preset.c}·{preset.f}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLS 2–4: Macro sliders */}
        <div className="lg:col-span-3 space-y-3">
          {macroItems.map((m) => {
            const val = m.numInput.value;
            const pct = val > 0 ? Math.min(100, Math.round((m.actual / val) * 100)) : 0;
            const isOnTarget = pct >= 85 && pct <= 115;
            const kcals = Math.round(val * m.kcalFactor);

            return (
              <div key={m.key} className="bg-white rounded-2xl p-4" style={{ border: '2px solid #e5e7eb' }}>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                    <span className="font-bold text-sm" style={{ color: '#1f2937' }}>{m.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-lg font-semibold" style={{ backgroundColor: m.bgColor, color: m.color }}>
                      {kcals} kcal
                    </span>
                  </div>

                  {/* g/kg toggle */}
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: '#e5e7eb' }}>
                      <button
                        onClick={() => m.setMode('g')}
                        className="px-2.5 py-1 text-xs font-bold transition-all"
                        style={{
                          backgroundColor: m.mode === 'g' ? m.color : 'transparent',
                          color: m.mode === 'g' ? 'white' : '#9ca3af',
                        }}
                      >
                        g
                      </button>
                      <button
                        onClick={() => m.setMode('gkg')}
                        className="px-2.5 py-1 text-xs font-bold transition-all"
                        style={{
                          backgroundColor: m.mode === 'gkg' ? m.color : 'transparent',
                          color: m.mode === 'gkg' ? 'white' : '#9ca3af',
                        }}
                      >
                        g/kg
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => m.numInput.set(val - m.step)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-gray-100 border font-bold text-base"
                        style={{ borderColor: '#e5e7eb', color: '#374151' }}
                      >
                        −
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={m.numInput.text}
                        onChange={m.numInput.handleChange}
                        onBlur={m.numInput.handleBlur}
                        className="w-16 text-center rounded-xl border py-1.5 text-sm font-bold focus:outline-none"
                        style={{ borderColor: m.color, color: m.color, backgroundColor: m.bgColor }}
                      />
                      <button
                        onClick={() => m.numInput.set(val + m.step)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-gray-100 border font-bold text-base"
                        style={{ borderColor: '#e5e7eb', color: '#374151' }}
                      >
                        +
                      </button>
                      <span className="text-xs font-semibold w-4" style={{ color: '#9ca3af' }}>g</span>
                    </div>
                  </div>
                </div>

                {/* g/kg info row */}
                {m.mode === 'gkg' && (
                  <div
                    className="flex items-center gap-3 mb-3 px-3 py-2 rounded-xl flex-wrap"
                    style={{ backgroundColor: m.bgColor, border: `1px solid ${m.color}30` }}
                  >
                    <span className="text-xs font-semibold" style={{ color: m.color }}>
                      {m.perKg} g/kg
                    </span>
                    <span className="text-xs" style={{ color: '#9ca3af' }}>
                      {t('con', 'with')} {bodyWeight} kg
                    </span>
                    <div className="flex-1" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs" style={{ color: '#9ca3af' }}>{t('Ajustar:', 'Set:')}</span>
                      <GkgInput
                        perKg={m.perKg}
                        gkgStep={m.gkgStep}
                        gkgMin={m.gkgMin}
                        gkgMax={m.gkgMax}
                        color={m.color}
                        bodyWeight={bodyWeight}
                        onSet={m.numInput.set}
                      />
                      <span className="text-xs font-semibold" style={{ color: m.color }}>g/kg</span>
                    </div>
                  </div>
                )}

                {/* Slider track */}
                <div className="mb-2">
                  <MacroSlider
                    value={val}
                    min={m.min}
                    max={m.max}
                    step={m.step}
                    color={m.color}
                    unit={m.unit}
                    onChange={m.numInput.set}
                  />
                </div>

                {/* Actual vs target */}
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: '#9ca3af' }}>{t('Real hoy:', 'Actual:')}</span>
                      <span className="text-xs font-bold" style={{ color: m.actual > 0 ? m.color : '#d1d5db' }}>
                        {m.actual.toFixed(0)}g
                        {m.actual > 0 && bodyWeight > 0 && (
                          <span className="font-normal ml-1" style={{ color: '#9ca3af' }}>
                            ({(m.actual / bodyWeight).toFixed(1)} g/kg)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: m.actual > 0 ? m.color : '#e5e7eb' }}
                      />
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold flex-shrink-0 px-2 py-1 rounded-lg min-w-[36px] text-center"
                    style={{
                      backgroundColor: m.actual > 0 ? (isOnTarget ? '#f0fdf4' : '#fef2f2') : '#f9fafb',
                      color: m.actual > 0 ? (isOnTarget ? '#16a34a' : '#dc2626') : '#9ca3af',
                    }}
                  >
                    {m.actual > 0 ? `${pct}%` : '—'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
        {currentOverride && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all hover:bg-gray-50"
            style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t('Restablecer', 'Reset to Default')}
          </button>
        )}
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl border text-xs font-bold transition-all hover:bg-gray-50"
          style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
        >
          {t('Cancelar', 'Cancel')}
        </button>
        <button
          onClick={() => onSave({ calories: cal.value, protein: prot.value, carbs: carb.value, fat: fat.value })}
          className="btn-primary flex items-center gap-1.5 px-5 py-2 text-xs ml-auto"
        >
          <Check className="w-3.5 h-3.5" />
          {t('Aplicar Objetivos', 'Apply Targets')}
        </button>
      </div>
    </div>
  );
}

function FoodSearchModal({
  foods, recipes, offResults, offLoading, es, mealId,
  onAddFood, onAddRecipe, onSearchExternal, onClose, t,
}: {
  foods: FoodV2[];
  recipes: RecipeItem[];
  offResults: FoodV2[];
  offLoading: boolean;
  es: boolean;
  mealId: string | null;
  onAddFood: (food: FoodV2, qty: number) => void;
  onAddRecipe: (recipe: RecipeItem, qty: number) => void;
  onSearchExternal: (q: string) => void;
  onClose: () => void;
  t: (esStr: string, en: string) => string;
}) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FoodTypeTab>('foods');
  const [subCat, setSubCat] = useState('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    if (search.length >= 3) {
      searchRef.current = setTimeout(() => onSearchExternal(search), 600);
    }
  }, [search]);

  const tabIcons: Record<FoodTypeTab, React.ReactNode> = {
    foods: <Apple className="w-3.5 h-3.5" />,
    products: <ShoppingBag className="w-3.5 h-3.5" />,
    recipes: <BookOpen className="w-3.5 h-3.5" />,
    supplements: <Dumbbell className="w-3.5 h-3.5" />,
  };

  const tabLabels: Record<FoodTypeTab, string> = {
    foods: t('Alimentos', 'Foods'),
    products: t('Productos', 'Products'),
    recipes: t('Recetas', 'Recipes'),
    supplements: t('Suplementos', 'Supplements'),
  };

  const tabDescriptions: Record<FoodTypeTab, string> = {
    foods: t('Alimentos naturales: frutas, verduras, carnes, granos...', 'Natural foods: fruits, vegetables, meat, grains...'),
    products: t('Alimentos procesados: yogurt, aceite, pan...', 'Processed foods: yogurt, oil, bread...'),
    recipes: t('Preparaciones: huevo revuelto, arroz primavera...', 'Preparations: scrambled eggs, spring rice...'),
    supplements: t('Suplementos deportivos y médicos: geles, creatina...', 'Sports & medical supplements: gels, creatine...'),
  };

  const filteredFoods = foods.filter((f) => {
    const q = search.toLowerCase();
    const name = es ? f.name_es : f.name_en;
    const matchName = !q || name.toLowerCase().includes(q);
    const matchTab = isFoodInTab(f, activeTab);
    const matchSub = !subCat || f.category === subCat;
    return matchName && matchTab && matchSub;
  });

  const filteredRecipes = recipes.filter((r) => {
    const q = search.toLowerCase();
    return !q || r.name.toLowerCase().includes(q);
  });

  const handleAddFood = (food: FoodV2, qty: number) => {
    onAddFood(food, qty);
    setAddedIds((p) => new Set([...p, food.id]));
  };

  const handleAddRecipe = (recipe: RecipeItem, qty: number) => {
    onAddRecipe(recipe, qty);
    setAddedIds((p) => new Set([...p, recipe.id]));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ width: '100%', maxWidth: '640px', maxHeight: '85vh', border: '2px solid #e5e7eb' }}
      >
        {/* Modal header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: '#f3f4f6' }}>
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: '#514163' }} />
          <h3 className="font-heading text-base flex-1" style={{ color: '#1f2937' }}>
            {t('Buscar Alimento', 'Search Food')}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all">
            <X className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
        </div>

        {/* Search input */}
        <div className="px-5 pt-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Buscar por nombre...', 'Search by name...')}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all focus:outline-none"
              style={{ borderColor: '#e5e7eb' }}
              autoFocus
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4" style={{ color: '#9ca3af' }} />
              </button>
            )}
            {offLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" style={{ color: '#514163' }} />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 pb-3 border-b" style={{ borderColor: '#f3f4f6' }}>
          <div className="flex gap-2">
            {(Object.keys(tabLabels) as FoodTypeTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSubCat(''); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all flex-1 justify-center"
                style={{
                  backgroundColor: activeTab === tab ? '#514163' : '#f3f4f6',
                  color: activeTab === tab ? '#fdda36' : '#6b7280',
                  border: activeTab === tab ? '2px solid #514163' : '2px solid transparent',
                }}
              >
                {tabIcons[tab]}
                {tabLabels[tab]}
              </button>
            ))}
          </div>
          <p className="text-xs mt-2 px-1" style={{ color: '#9ca3af' }}>
            {tabDescriptions[activeTab]}
          </p>
        </div>

        {/* Subcategory pills */}
        {(activeTab === 'foods' || activeTab === 'products') && FOOD_SUBCATEGORIES[activeTab].length > 1 && (
          <div className="px-5 py-2 border-b overflow-x-auto" style={{ borderColor: '#f3f4f6' }}>
            <div className="flex gap-1.5 min-w-max">
              {FOOD_SUBCATEGORIES[activeTab].map((c) => (
                <button
                  key={c.value}
                  onClick={() => setSubCat(subCat === c.value ? '' : c.value)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                  style={{
                    backgroundColor: subCat === c.value ? '#514163' : '#f3f4f6',
                    color: subCat === c.value ? '#fdda36' : '#374151',
                  }}
                >
                  {es ? c.labelEs : c.labelEn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results list */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'recipes' ? (
            filteredRecipes.length > 0 ? (
              <div className="divide-y" style={{ borderColor: '#f3f4f6' }}>
                {filteredRecipes.map((recipe) => (
                  <ModalRecipeRow
                    key={recipe.id}
                    recipe={recipe}
                    onAdd={handleAddRecipe}
                    added={addedIds.has(recipe.id)}
                    es={es}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: '#d1d5db' }} />
                <p className="text-sm" style={{ color: '#9ca3af' }}>
                  {t('No hay recetas disponibles', 'No recipes available')}
                </p>
              </div>
            )
          ) : (
            <div className="divide-y" style={{ borderColor: '#f3f4f6' }}>
              {[...filteredFoods, ...offResults].map((food) => (
                <ModalFoodRow
                  key={food.id}
                  food={food}
                  es={es}
                  onAdd={handleAddFood}
                  isOFF={food.id.startsWith('off_')}
                  added={addedIds.has(food.id)}
                />
              ))}
              {filteredFoods.length === 0 && offResults.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-10 h-10 mx-auto mb-3" style={{ color: '#d1d5db' }} />
                  <p className="text-sm font-semibold mb-1" style={{ color: '#6b7280' }}>
                    {search ? t('Sin resultados', 'No results') : t('Escribe para buscar', 'Type to search')}
                  </p>
                  {search && search.length >= 3 && !offLoading && (
                    <p className="text-xs" style={{ color: '#9ca3af' }}>
                      {t('Buscando en base de datos externa...', 'Searching external database...')}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModalFoodRow({
  food, es, onAdd, isOFF, added,
}: { food: FoodV2; es: boolean; onAdd: (f: FoodV2, qty: number) => void; isOFF?: boolean; added: boolean }) {
  const [qty, setQty] = useState(100);
  const name = es ? food.name_es : food.name_en;
  const r = qty / 100;
  const cal = Math.round(food.calories_per_100g * r);
  const p = Math.round(food.protein_per_100g * r * 10) / 10;
  const c = Math.round(food.carbs_per_100g * r * 10) / 10;

  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-sm font-semibold truncate" style={{ color: '#1f2937' }}>{name}</p>
          {isOFF && <span className="text-xs px-1.5 py-0.5 rounded font-bold flex-shrink-0" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>OFF</span>}
          {food.source === 'usda' && <span className="text-xs px-1.5 py-0.5 rounded font-bold flex-shrink-0" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>USDA</span>}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold" style={{ color: '#f59e0b' }}>{cal} kcal</span>
          <span style={{ color: '#ef4444' }}>P: {p}g</span>
          <span style={{ color: '#16a34a' }}>C: {c}g</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(parseFloat(e.target.value) || 100)}
            min={1}
            className="w-14 text-center rounded-lg border py-1 text-xs font-bold"
            style={{ borderColor: '#e5e7eb', color: '#374151' }}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="text-xs" style={{ color: '#9ca3af' }}>g</span>
        </div>
        <button
          onClick={() => onAdd(food, qty)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          style={{
            backgroundColor: added ? '#f0fdf4' : '#514163',
            color: added ? '#16a34a' : '#fdda36',
            border: added ? '2px solid #86efac' : '2px solid transparent',
          }}
        >
          {added ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );

}

function ModalRecipeRow({
  recipe, onAdd, added, es,
}: { recipe: RecipeItem; onAdd: (r: RecipeItem, qty: number) => void; added: boolean; es: boolean }) {
  const [qty, setQty] = useState(100);
  const cal = Math.round((recipe.calories_per_100g || 0) * qty / 100);

  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-sm font-semibold truncate" style={{ color: '#1f2937' }}>{recipe.name}</p>
          {recipe.is_public && (
            <span className="text-xs px-1.5 py-0.5 rounded font-bold flex-shrink-0" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              {es ? 'Sistema' : 'System'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold" style={{ color: '#f59e0b' }}>{cal} kcal</span>
          <span style={{ color: '#9ca3af' }}>{qty}g</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(parseFloat(e.target.value) || 100)}
            min={1}
            className="w-14 text-center rounded-lg border py-1 text-xs font-bold"
            style={{ borderColor: '#e5e7eb', color: '#374151' }}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="text-xs" style={{ color: '#9ca3af' }}>g</span>
        </div>
        <button
          onClick={() => onAdd(recipe, qty)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          style={{
            backgroundColor: added ? '#f0fdf4' : '#514163',
            color: added ? '#16a34a' : '#fdda36',
            border: added ? '2px solid #86efac' : '2px solid transparent',
          }}
        >
          {added ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

function MicroRow({ name, value, unit, pct, hasData }: { name: string; value: number; unit: string; pct: number; hasData: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs flex-1 truncate" style={{ color: '#6b7280', minWidth: 0 }}>{name}</span>
      <span className="text-xs font-semibold flex-shrink-0" style={{ color: hasData ? (pct >= 100 ? '#16a34a' : '#dc2626') : '#d1d5db', minWidth: '70px', textAlign: 'right' }}>
        {hasData ? `${value.toFixed(1)} ${unit}` : '—'}
      </span>
      <span className="text-xs font-bold flex-shrink-0" style={{ color: hasData ? (pct >= 100 ? '#16a34a' : '#dc2626') : '#d1d5db', minWidth: '32px', textAlign: 'right' }}>
        {hasData ? `${pct}%` : '—'}
      </span>
    </div>
  );
}

function FoodCard({
  food, es, onAdd, disabled, isOFF, onDragStart,
}: { food: FoodV2; es: boolean; onAdd: (f: FoodV2, qty: number) => void; disabled: boolean; isOFF?: boolean; onDragStart?: (f: FoodV2) => void }) {
  const [qty, setQty] = useState(100);
  const primaryName = es ? (food.name_es || food.name_en) : (food.name_en || food.name_es);
  const altName = es ? (food.name_en || '') : (food.name_es || '');
  const hasAlt = altName && altName !== primaryName;
  const scaled = calcItemMacros(food, qty);

  return (
    <div
      className="px-3 py-3 border-b transition-colors hover:bg-gray-50"
      style={{ borderColor: '#f3f4f6', cursor: 'grab' }}
      draggable
      onDragStart={() => onDragStart?.(food)}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug" style={{ color: '#1f2937' }}>{primaryName}</p>
          {hasAlt && <p className="text-xs leading-snug" style={{ color: '#9ca3af' }}>{altName}</p>}
          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
            {isOFF && <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>OFF</span>}
            {food.source === 'usda' && <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>USDA</span>}
            {food.is_verified && <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>✓</span>}
          </div>
        </div>
        <button
          disabled={disabled}
          onClick={() => !disabled && onAdd(food, qty)}
          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ backgroundColor: disabled ? '#f3f4f6' : '#514163', color: disabled ? '#9ca3af' : '#fdda36' }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs mb-2">
        <span className="font-bold" style={{ color: '#f59e0b' }}>{scaled.calories} kcal</span>
        <span style={{ color: '#ef4444' }}>P:{scaled.protein_g}g</span>
        <span style={{ color: '#16a34a' }}>C:{scaled.carbs_g}g</span>
        <span style={{ color: '#ca8a04' }}>G:{scaled.fat_g}g</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range" min={10} max={500} step={5} value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="flex-1 h-1.5 rounded-full appearance-none"
          style={{ accentColor: '#514163' }}
        />
        <div className="flex items-center gap-1 flex-shrink-0">
          <input
            type="number" value={qty}
            onChange={(e) => setQty(parseFloat(e.target.value) || 100)}
            min={1}
            className="w-14 text-center rounded-lg border py-1 text-xs font-bold"
            style={{ borderColor: '#e5e7eb', color: '#374151' }}
          />
          <span className="text-xs" style={{ color: '#9ca3af' }}>g</span>
        </div>
      </div>
    </div>
  );
}

function RecipeCard({
  recipe, onAdd, disabled, es,
}: { recipe: RecipeItem; onAdd: (r: RecipeItem, qty: number) => void; disabled: boolean; es?: boolean }) {
  const [qty, setQty] = useState(100);
  const cal = Math.round((recipe.calories_per_100g || 0) * qty / 100);
  const primaryName = es ? (recipe.name_es || recipe.name_en || recipe.name) : (recipe.name_en || recipe.name_es || recipe.name);
  const altName = es ? (recipe.name_en || recipe.name || '') : (recipe.name_es || '');
  const hasAlt = altName && altName !== primaryName;

  return (
    <div className="px-3 py-3 border-b transition-colors hover:bg-gray-50" style={{ borderColor: '#f3f4f6' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug" style={{ color: '#1f2937' }}>{primaryName}</p>
          {hasAlt && <p className="text-xs leading-snug" style={{ color: '#9ca3af' }}>{altName}</p>}
          {recipe.is_public && (
            <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              {es ? 'Sistema' : 'System'}
            </span>
          )}
        </div>
        <button
          disabled={disabled}
          onClick={() => !disabled && onAdd(recipe, qty)}
          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ backgroundColor: disabled ? '#f3f4f6' : '#514163', color: disabled ? '#9ca3af' : '#fdda36' }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs mb-2">
        <span className="font-bold" style={{ color: '#f59e0b' }}>{cal} kcal</span>
        <span style={{ color: '#9ca3af' }}>{qty}g</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range" min={10} max={500} step={5} value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="flex-1 h-1.5 rounded-full appearance-none"
          style={{ accentColor: '#514163' }}
        />
        <div className="flex items-center gap-1 flex-shrink-0">
          <input
            type="number" value={qty}
            onChange={(e) => setQty(parseFloat(e.target.value) || 100)}
            min={1}
            className="w-14 text-center rounded-lg border py-1 text-xs font-bold"
            style={{ borderColor: '#e5e7eb', color: '#374151' }}
          />
          <span className="text-xs" style={{ color: '#9ca3af' }}>g</span>
        </div>
      </div>
    </div>
  );
}

function CustomizeDaysModal({
  weekPlans, dayNames, customDayNames, setCustomDayNames,
  customWeekPattern, setCustomWeekPattern, onClose, onSave, t,
}: {
  weekPlans: DayPlan[]; dayNames: string[];
  customDayNames: Record<string, string>; setCustomDayNames: (v: Record<string, string>) => void;
  customWeekPattern: Array<'green' | 'yellow' | 'red'>; setCustomWeekPattern: (v: Array<'green' | 'yellow' | 'red'>) => void;
  onClose: () => void; onSave: () => void;
  t: (es: string, en: string) => string;
}) {
  const fuelOptions: Array<{ value: 'green' | 'yellow' | 'red'; label: string; color: string; bg: string }> = [
    { value: 'green', label: 'High CHO', color: '#16a34a', bg: '#f0fdf4' },
    { value: 'yellow', label: 'Mod CHO', color: '#ca8a04', bg: '#fefce8' },
    { value: 'red', label: 'Low CHO', color: '#dc2626', bg: '#fef2f2' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" style={{ border: '2px solid #e5e7eb', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#f3f4f6' }}>
          <h3 className="font-heading text-lg" style={{ color: '#1f2937' }}>{t('Personalizar Días', 'Customize Days')}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all">
            <X className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {weekPlans.map((_, i) => {
            const defaultName = dayNames[i] || `Day ${i + 1}`;
            const currentFuel = customWeekPattern[i] || 'yellow';
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <span className="text-xs font-bold w-6 text-center" style={{ color: '#9ca3af' }}>{i + 1}</span>
                <input
                  type="text"
                  value={customDayNames[`day_${i + 1}`] ?? ''}
                  onChange={(e) => setCustomDayNames({ ...customDayNames, [`day_${i + 1}`]: e.target.value })}
                  placeholder={defaultName}
                  className="flex-1 px-3 py-2 rounded-xl border text-sm font-semibold focus:outline-none transition-all"
                  style={{ borderColor: '#e5e7eb', color: '#1f2937' }}
                />
                <div className="flex gap-1">
                  {fuelOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        const np = [...customWeekPattern] as Array<'green' | 'yellow' | 'red'>;
                        np[i] = opt.value;
                        setCustomWeekPattern(np);
                      }}
                      className="px-2 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        backgroundColor: currentFuel === opt.value ? opt.bg : '#f3f4f6',
                        color: currentFuel === opt.value ? opt.color : '#9ca3af',
                        border: currentFuel === opt.value ? `2px solid ${opt.color}` : '2px solid transparent',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 px-5 py-4 border-t" style={{ borderColor: '#f3f4f6' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold" style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
            {t('Cancelar', 'Cancel')}
          </button>
          <button onClick={onSave} className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            {t('Aplicar', 'Apply')}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreatePlanModal({
  form, setForm, onClose, onCreate, creating, t, es,
}: {
  form: any; setForm: any; onClose: () => void;
  onCreate: () => void; creating: boolean;
  t: (esStr: string, en: string) => string; es: boolean;
}) {
  const days = es ? DAY_NAMES_ES : DAY_NAMES_EN;
  const fuelOptions: Array<{ value: 'green' | 'yellow' | 'red'; labelEs: string; labelEn: string; color: string; bg: string; border: string }> = [
    { value: 'green', labelEs: 'Alto CHO', labelEn: 'High CHO', color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
    { value: 'yellow', labelEs: 'Mod CHO', labelEn: 'Mod CHO', color: '#ca8a04', bg: '#fefce8', border: '#fcd34d' },
    { value: 'red', labelEs: 'Bajo CHO', labelEn: 'Low CHO', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
  ];

  const numDays = Math.min(Math.max(form.duration_days || 7, 1), 14);

  const setDayFuel = (idx: number, val: 'green' | 'yellow' | 'red') => {
    setForm((f: any) => {
      const np = [...(f.week_pattern as Array<'green' | 'yellow' | 'red'>)];
      while (np.length < numDays) np.push('yellow');
      np[idx] = val;
      return { ...f, week_pattern: np };
    });
  };

  const handleDurationChange = (val: number) => {
    const clamped = Math.min(Math.max(val || 7, 1), 14);
    setForm((f: any) => {
      const base = [...(f.week_pattern as Array<'green' | 'yellow' | 'red'>)];
      while (base.length < clamped) base.push('yellow');
      return { ...f, duration_days: clamped, week_pattern: base.slice(0, clamped) };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" style={{ border: '2px solid #e5e7eb', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#f3f4f6' }}>
          <h3 className="font-heading text-lg" style={{ color: '#1f2937' }}>{t('Nuevo Plan', 'New Plan')}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all">
            <X className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#374151' }}>{t('Título *', 'Title *')}</label>
            <input
              type="text" value={form.title}
              onChange={(e) => setForm((f: any) => ({ ...f, title: e.target.value }))}
              placeholder={t('ej. Semana de carga', 'e.g. Load week')}
              className="input-brand" autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>{t('Calorías/día', 'Calories/day')}</label>
              <input type="number" className="input-brand text-sm" value={form.calories_goal}
                onChange={(e) => setForm((f: any) => ({ ...f, calories_goal: +e.target.value || 2000 }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>{t('Días del plan', 'Plan duration (days)')}</label>
              <input type="number" min={1} max={14} className="input-brand text-sm" value={form.duration_days}
                onChange={(e) => handleDurationChange(+e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>{t('Proteínas (g)', 'Protein (g)')}</label>
              <input type="number" className="input-brand text-sm" value={form.protein_goal}
                onChange={(e) => setForm((f: any) => ({ ...f, protein_goal: +e.target.value || 150 }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>{t('Carbohidratos (g)', 'Carbs (g)')}</label>
              <input type="number" className="input-brand text-sm" value={form.carbs_goal}
                onChange={(e) => setForm((f: any) => ({ ...f, carbs_goal: +e.target.value || 250 }))} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1" style={{ color: '#374151' }}>{t('Grasas (g)', 'Fat (g)')}</label>
              <input type="number" className="input-brand text-sm" value={form.fats_goal}
                onChange={(e) => setForm((f: any) => ({ ...f, fats_goal: +e.target.value || 70 }))} />
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#514163' }}>
              {t('Patrón CHO por día', 'CHO pattern per day')}
            </p>
            <div className="space-y-2">
              {Array.from({ length: numDays }, (_, i) => {
                const current = (form.week_pattern as Array<'green' | 'yellow' | 'red'>)[i] || 'yellow';
                const dayLabel = days[i % 7] || `${t('Día', 'Day')} ${i + 1}`;
                return (
                  <div key={i} className="flex items-center gap-3 py-1.5 px-3 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                    <span className="text-xs font-bold w-20 flex-shrink-0" style={{ color: '#374151' }}>{dayLabel}</span>
                    <div className="flex gap-1.5 flex-1">
                      {fuelOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setDayFuel(i, opt.value)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                          style={{
                            backgroundColor: current === opt.value ? opt.bg : '#f3f4f6',
                            color: current === opt.value ? opt.color : '#9ca3af',
                            border: `2px solid ${current === opt.value ? opt.border : 'transparent'}`,
                          }}
                        >
                          {es ? opt.labelEs : opt.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 py-4 border-t" style={{ borderColor: '#f3f4f6' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold" style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
            {t('Cancelar', 'Cancel')}
          </button>
          <button
            onClick={onCreate} disabled={creating || !form.title.trim()}
            className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {t('Crear Plan', 'Create Plan')}
          </button>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({
  template, es, onApply,
}: { template: MealPlanTemplate; es: boolean; onApply: () => void }) {
  const name = es ? (template.name_es || template.name) : template.name;
  const focusLabels: Record<string, { es: string; en: string; color: string; bg: string }> = {
    balanced: { es: 'Balanceado', en: 'Balanced', color: '#2563eb', bg: '#eff6ff' },
    high_protein: { es: 'Alto Proteína', en: 'High Protein', color: '#dc2626', bg: '#fef2f2' },
    endurance: { es: 'Resistencia', en: 'Endurance', color: '#16a34a', bg: '#f0fdf4' },
    weight_loss: { es: 'Pérd. Peso', en: 'Weight Loss', color: '#ca8a04', bg: '#fefce8' },
  };
  const focus = focusLabels[template.focus] || { es: template.focus, en: template.focus, color: '#6b7280', bg: '#f3f4f6' };

  return (
    <div className="px-3 py-3 border-b transition-colors hover:bg-gray-50" style={{ borderColor: '#f3f4f6' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug mb-1" style={{ color: '#1f2937' }}>{name}</p>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-bold"
            style={{ backgroundColor: focus.bg, color: focus.color }}
          >
            {es ? focus.es : focus.en}
          </span>
        </div>
        <button
          onClick={onApply}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
          style={{ backgroundColor: '#514163', color: '#fdda36' }}
        >
          {es ? 'Usar' : 'Use'}
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1 text-xs mt-1">
        <div className="rounded-lg px-1.5 py-1 text-center" style={{ backgroundColor: '#fef9c3' }}>
          <p className="font-bold" style={{ color: '#92400e' }}>{template.calories_target}</p>
          <p style={{ color: '#a16207', fontSize: '10px' }}>kcal</p>
        </div>
        <div className="rounded-lg px-1.5 py-1 text-center" style={{ backgroundColor: '#fef2f2' }}>
          <p className="font-bold" style={{ color: '#dc2626' }}>{template.protein_g}g</p>
          <p style={{ color: '#ef4444', fontSize: '10px' }}>{es ? 'Prot' : 'Prot'}</p>
        </div>
        <div className="rounded-lg px-1.5 py-1 text-center" style={{ backgroundColor: '#f0fdf4' }}>
          <p className="font-bold" style={{ color: '#16a34a' }}>{template.carbs_g}g</p>
          <p style={{ color: '#22c55e', fontSize: '10px' }}>{es ? 'Carb' : 'Carb'}</p>
        </div>
        <div className="rounded-lg px-1.5 py-1 text-center" style={{ backgroundColor: '#fffbeb' }}>
          <p className="font-bold" style={{ color: '#ca8a04' }}>{template.fat_g}g</p>
          <p style={{ color: '#f59e0b', fontSize: '10px' }}>{es ? 'Gras' : 'Fat'}</p>
        </div>
      </div>
    </div>
  );
}

function TemplateApplyModal({
  template, weekPlans, activePlan, onApply, onClose, es,
}: {
  template: MealPlanTemplate;
  weekPlans: DayPlan[];
  activePlan: ActivePlan;
  onApply: (assignments: Record<number, number>) => void;
  onClose: () => void;
  es: boolean;
}) {
  const t = (esStr: string, en: string) => es ? esStr : en;
  const dayNamesEs = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const dayNamesEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const shortDays = es ? dayNamesEs : dayNamesEn;

  const templateDays: any[] = Array.isArray(template.days) ? template.days : [];
  const [assignments, setAssignments] = useState<Record<number, number>>({});

  const name = es ? (template.name_es || template.name) : template.name;

  const planDayCount = activePlan.duration_days;
  const planDays = Array.from({ length: planDayCount }, (_, i) => i);

  const calcTotalMacros = (dayData: any) => {
    if (dayData?.total_calories !== undefined) {
      return {
        cal: dayData.total_calories || 0,
        p: dayData.total_protein_g || 0,
        c: dayData.total_carbs_g || 0,
        f: dayData.total_fat_g || 0,
      };
    }
    if (!dayData || !Array.isArray(dayData.meals)) return { cal: 0, p: 0, c: 0, f: 0 };
    let cal = 0, p = 0, c = 0, f = 0;
    dayData.meals.forEach((m: any) => {
      const entries: any[] = Array.isArray(m.foods) ? m.foods : Array.isArray(m.items) ? m.items : [];
      entries.forEach((item: any) => {
        cal += item.calories || 0;
        p += item.protein_g || 0;
        c += item.carbs_g || 0;
        f += item.fat_g || 0;
      });
    });
    return { cal: Math.round(cal), p: Math.round(p), c: Math.round(c), f: Math.round(f) };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" style={{ border: '2px solid #e5e7eb', maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#f3f4f6' }}>
          <div>
            <h3 className="font-heading text-base" style={{ color: '#1f2937' }}>{t('Aplicar Template', 'Apply Template')}</h3>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all">
            <X className="w-4 h-4" style={{ color: '#6b7280' }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Summary of each template day */}
          <div>
            <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: '#6b7280' }}>
              {t('Días en el template', 'Template days')}
            </p>
            <div className="space-y-2">
              {templateDays.map((dayData: any, idx: number) => {
                const macros = calcTotalMacros(dayData);
                return (
                  <div key={idx} className="rounded-xl px-3 py-2.5 flex items-center gap-3" style={{ backgroundColor: '#f9fafb', border: '1.5px solid #e5e7eb' }}>
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#514163', color: '#fdda36' }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: '#1f2937' }}>
                        {dayData.day_name || dayData.name || `${t('Día', 'Day')} ${idx + 1}`}
                      </p>
                      <div className="flex gap-2 mt-0.5 text-xs">
                        <span style={{ color: '#f59e0b' }}>{macros.cal} kcal</span>
                        <span style={{ color: '#ef4444' }}>P:{macros.p}g</span>
                        <span style={{ color: '#16a34a' }}>C:{macros.c}g</span>
                        <span style={{ color: '#ca8a04' }}>G:{macros.f}g</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assignment: pick which plan day each template day goes to */}
          <div>
            <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: '#6b7280' }}>
              {t('Asignar a días del plan', 'Assign to plan days')}
            </p>
            <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>
              {t('Elige en qué día del plan colocar cada día del template. Puedes asignar el mismo día a múltiples días del plan.', 'Choose which plan day to place each template day. You can assign the same template day to multiple plan days.')}
            </p>
            <div className="space-y-2">
              {templateDays.map((_: any, tmplIdx: number) => (
                <div key={tmplIdx} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-20 text-xs font-semibold rounded-lg px-2 py-1.5 text-center" style={{ backgroundColor: '#514163', color: '#fdda36' }}>
                    {t('Día', 'Day')} {tmplIdx + 1}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#9ca3af' }} />
                  <div className="flex flex-wrap gap-1">
                    {planDays.map((planIdx) => {
                      const assigned = assignments[tmplIdx] === planIdx;
                      const dayLabel = activePlan.day_names?.[planIdx] || shortDays[planIdx % 7] || `${planIdx + 1}`;
                      return (
                        <button
                          key={planIdx}
                          onClick={() => setAssignments((prev) => ({ ...prev, [tmplIdx]: assigned ? -1 : planIdx }))}
                          className="px-2 py-1 rounded-lg text-xs font-bold transition-all"
                          style={{
                            backgroundColor: assigned ? '#514163' : '#f3f4f6',
                            color: assigned ? '#fdda36' : '#374151',
                            border: assigned ? '1.5px solid #514163' : '1.5px solid transparent',
                          }}
                        >
                          {dayLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t" style={{ borderColor: '#f3f4f6' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm font-semibold" style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
            {t('Cancelar', 'Cancel')}
          </button>
          <button
            onClick={() => onApply(assignments)}
            disabled={Object.keys(assignments).length === 0}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
            style={{ backgroundColor: '#514163', color: '#fdda36' }}
          >
            {t('Aplicar', 'Apply')}
          </button>
        </div>
      </div>
    </div>
  );
}
