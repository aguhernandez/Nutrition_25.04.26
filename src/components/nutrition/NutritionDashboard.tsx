import { useState, useEffect } from 'react';
import { Apple, Flame, TrendingUp, ClipboardList, ChevronRight, Zap, Target, Award, BookOpen, MessageCircle, BarChart2, Trophy, MessageSquare, Microscope } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';
import { getAnamnesis, getDiaryRange } from '../../lib/nutritionService';
import type { NutritionAnamnesis, DiaryEntry, Macros } from '../../types/nutritionModule';
import type { NutritionTab } from './NutritionModule';

interface Props {
  onNavigate: (view: NutritionTab) => void;
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getWeekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function sumMacros(entries: DiaryEntry[]): Macros {
  return entries.reduce(
    (acc, e) => ({
      calories_kcal: acc.calories_kcal + e.calories_kcal,
      carbs_g: acc.carbs_g + e.carbs_g,
      protein_g: acc.protein_g + e.protein_g,
      fat_g: acc.fat_g + e.fat_g,
    }),
    { calories_kcal: 0, carbs_g: 0, protein_g: 0, fat_g: 0 }
  );
}

function MacroRing({ label, value, target, color, unit = 'g' }: { label: string; value: number; target: number; color: string; unit?: string }) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#f3f4f6" strokeWidth="5" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold" style={{ color: '#1f2937' }}>{pct}%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold" style={{ color: '#1f2937' }}>{Math.round(value)}{unit}</div>
        <div className="text-xs" style={{ color: '#9ca3af' }}>{label}</div>
        {target > 0 && <div className="text-xs" style={{ color: '#d1d5db' }}>/ {target}{unit}</div>}
      </div>
    </div>
  );
}

function FuelDayBadge({ type, active }: { type: string; active: boolean }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    base: { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
    load: { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' },
    taper: { bg: '#eff6ff', text: '#1d4ed8', border: '#93c5fd' },
    race_day: { bg: '#fdf2f8', text: '#be185d', border: '#f9a8d4' },
    recovery: { bg: '#f5f3ff', text: '#7c3aed', border: '#c4b5fd' },
  };
  const c = colors[type] ?? colors.base;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
      style={{ backgroundColor: active ? c.bg : '#f9fafb', color: active ? c.text : '#9ca3af', borderColor: active ? c.border : '#e5e7eb' }}
    >
      {type.replace('_', ' ')}
    </span>
  );
}

export default function NutritionDashboard({ onNavigate }: Props) {
  const { user } = useAuth();
  const { language } = usePreferences();
  const [anamnesis, setAnamnesis] = useState<NutritionAnamnesis | null>(null);
  const [todayEntries, setTodayEntries] = useState<DiaryEntry[]>([]);
  const [weekEntries, setWeekEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || user.id.startsWith('demo-')) {
      setLoading(false);
      return;
    }
    (async () => {
      const today = getTodayStr();
      const weekStart = getWeekStart();
      const [aResult, todayResult, weekResult] = await Promise.all([
        getAnamnesis(user.id),
        getDiaryRange(user.id, today, today),
        getDiaryRange(user.id, weekStart, today),
      ]);
      setAnamnesis(aResult.data);
      setTodayEntries(todayResult.data);
      setWeekEntries(weekResult.data);
      setLoading(false);
    })();
  }, [user?.id]);

  const todayMacros = sumMacros(todayEntries);
  const targets = anamnesis
    ? {
        calories_kcal: anamnesis.target_calories_kcal ?? 0,
        carbs_g: anamnesis.target_carbs_g ?? 0,
        protein_g: anamnesis.target_protein_g ?? 0,
        fat_g: anamnesis.target_fat_g ?? 0,
      }
    : { calories_kcal: 0, carbs_g: 0, protein_g: 0, fat_g: 0 };

  const hasTargets = targets.calories_kcal > 0;

  const weekDays = (() => {
    const days: { date: string; macros: Macros; adherence: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayEntries = weekEntries.filter((e) => e.diary_date === dateStr);
      const macros = sumMacros(dayEntries);
      const adherence = hasTargets && targets.calories_kcal > 0
        ? Math.min(100, Math.round((macros.calories_kcal / targets.calories_kcal) * 100))
        : dayEntries.length > 0 ? 60 : 0;
      days.push({ date: dateStr, macros, adherence });
    }
    return days;
  })();

  const today = getTodayStr();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#fdda36', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const es = language === 'es';

  const QUICK_CARDS = [
    {
      id: 'anamnesis' as NutritionTab,
      icon: ClipboardList,
      title: es ? 'Anamnesis' : 'Anamnesis',
      desc: es ? 'Evaluación nutricional' : 'Nutritional assessment',
      highlight: false,
    },
    {
      id: 'diary' as NutritionTab,
      icon: BookOpen,
      title: es ? 'Diario 24-48h' : '24-48h Diary',
      desc: es ? 'Registro con IA' : 'AI-powered logging',
      highlight: false,
    },
    {
      id: 'planner' as NutritionTab,
      icon: BarChart2,
      title: es ? 'Crear Plan' : 'Create Plan',
      desc: es ? 'Plan de nutrición' : 'Nutrition plan',
      highlight: false,
    },
    {
      id: 'one-on-one' as NutritionTab,
      icon: MessageCircle,
      title: es ? 'Coaching 1:1' : 'Nutritional 1:1',
      desc: es ? 'Coaching nutricional con profesional' : 'Nutritional coaching by a professional',
      highlight: true,
    },
  ];

  const FEATURE_CARDS = [
    {
      id: 'race-protocol' as NutritionTab,
      icon: Trophy,
      title: es ? 'Protocolo de Carrera' : 'Race Protocol',
      desc: es ? 'Plan nutricional pre, durante y post carrera' : 'Pre, during & post race nutrition plan',
      color: '#be185d',
      bg: '#fdf2f8',
    },
    {
      id: 'micronutrients' as NutritionTab,
      icon: Microscope,
      title: es ? 'Búsqueda Micronutriente' : 'Micronutrient Search',
      desc: es ? 'Alimentos ricos en Vitamina D, Hierro, Calcio' : 'Find foods rich in Vitamin D, Iron, Calcium & more',
      color: '#059669',
      bg: '#ecfdf5',
    },
    {
      id: 'coach-notes' as NutritionTab,
      icon: MessageSquare,
      title: es ? 'Notas del Coach' : 'Coach Notes',
      desc: es ? 'Indicaciones y ajustes nutricionales' : 'Nutrition notes from your coach',
      color: '#15803d',
      bg: '#f0fdf4',
    },
  ];

  const dayLetters = es
    ? ['L', 'M', 'X', 'J', 'V', 'S', 'D']
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold" style={{ color: '#1f2937' }}>
            {es ? 'Dashboard de Nutrición' : 'Nutrition Dashboard'}
          </h1>
          <p className="font-body text-sm mt-1" style={{ color: '#6b7280' }}>
            {es ? 'Optimiza tu nutrición con precisión' : 'Optimize your nutrition with precision'}
          </p>
        </div>
        {anamnesis && (
          <button
            onClick={() => onNavigate('anamnesis')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
            style={{ borderColor: '#e5e7eb', color: '#6b7280', backgroundColor: '#ffffff' }}
          >
            {es ? 'Editar perfil' : 'Edit Profile'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_CARDS.map(({ id, icon: Icon, title, desc, highlight }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className="relative overflow-hidden flex flex-col items-start gap-3 p-5 bg-white rounded-2xl text-left transition-all hover:shadow-md hover:-translate-y-0.5 group"
            style={
              highlight
                ? { border: '2px solid #fdda36', boxShadow: '0 4px 16px rgba(253,218,54,0.25)' }
                : { border: '2px solid #e5e7eb' }
            }
          >
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: '#9ca3af' }} />
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full opacity-10" style={{ backgroundColor: '#9ca3af' }} />
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
              style={{ backgroundColor: highlight ? '#fdda36' : '#514163' }}
            >
              <Icon className="w-6 h-6" style={{ color: highlight ? '#3b2a50' : '#ffffff' }} />
            </div>
            <div className="relative z-10">
              <div className="font-heading font-bold text-base" style={{ color: '#1f2937' }}>{title}</div>
              <div className="text-xs mt-0.5 leading-relaxed" style={{ color: '#9ca3af' }}>{desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5" style={{ border: '2px solid #e5e7eb', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef9c3' }}>
              <Flame className="w-4 h-4" style={{ color: '#ca8a04' }} />
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ color: '#1f2937' }}>
                {es ? 'Nutrición de Hoy' : "Today's Nutrition"}
              </div>
              <div className="text-xs" style={{ color: '#9ca3af' }}>{today}</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('diary')}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
            style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}
          >
            {es ? 'Registrar' : 'Log food'} <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {todayEntries.length === 0 ? (
          <div className="text-center py-6">
            <Apple className="w-10 h-10 mx-auto mb-2" style={{ color: '#d1d5db' }} />
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              {es ? 'Sin alimentos registrados hoy' : 'No food logged today yet'}
            </p>
            <button
              onClick={() => onNavigate('diary')}
              className="mt-3 text-sm font-medium px-4 py-2 rounded-xl transition-all"
              style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
            >
              {es ? 'Comenzar registro' : 'Start logging'}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-around py-2">
              <MacroRing label={es ? 'Calorías' : 'Calories'} value={todayMacros.calories_kcal} target={targets.calories_kcal} color="#f59e0b" unit="kcal" />
              <MacroRing label={es ? 'Carbos' : 'Carbs'} value={todayMacros.carbs_g} target={targets.carbs_g} color="#3b82f6" />
              <MacroRing label={es ? 'Proteína' : 'Protein'} value={todayMacros.protein_g} target={targets.protein_g} color="#10b981" />
              <MacroRing label={es ? 'Grasa' : 'Fat'} value={todayMacros.fat_g} target={targets.fat_g} color="#f97316" />
            </div>
            {!hasTargets && (
              <p className="text-center text-xs mt-2" style={{ color: '#9ca3af' }}>
                {es ? 'Establece metas en tu perfil para ver el progreso' : 'Set targets in your profile for adherence tracking'}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5" style={{ border: '2px solid #e5e7eb', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
            <TrendingUp className="w-4 h-4" style={{ color: '#2563eb' }} />
          </div>
          <span className="font-semibold text-sm" style={{ color: '#1f2937' }}>
            {es ? 'Esta Semana' : 'This Week'}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, i) => {
            const isToday = day.date === today;
            const letter = dayLetters[i];
            const h = Math.max(4, Math.round((day.adherence / 100) * 48));
            return (
              <button
                key={i}
                onClick={() => onNavigate('diary')}
                className="flex flex-col items-center gap-1 py-2 rounded-xl transition-all hover:bg-gray-50"
              >
                <span className="text-xs font-medium" style={{ color: isToday ? '#1f2937' : '#9ca3af' }}>{letter}</span>
                <div className="w-full flex flex-col items-center justify-end" style={{ height: '52px' }}>
                  <div
                    className="w-5 rounded-t-full transition-all"
                    style={{
                      height: `${h}px`,
                      backgroundColor: day.adherence === 0 ? '#f3f4f6' : day.adherence >= 80 ? '#10b981' : day.adherence >= 50 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                <span className="text-xs" style={{ color: isToday ? '#1f2937' : '#d1d5db' }}>
                  {day.macros.calories_kcal > 0 ? `${Math.round(day.macros.calories_kcal)}` : '--'}
                </span>
                {isToday && <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#fdda36' }} />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: '#f3f4f6' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
            <span className="text-xs" style={{ color: '#6b7280' }}>{es ? 'En meta' : 'On track'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
            <span className="text-xs" style={{ color: '#6b7280' }}>{es ? 'Parcial' : 'Partial'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f3f4f6' }} />
            <span className="text-xs" style={{ color: '#6b7280' }}>{es ? 'Sin datos' : 'No data'}</span>
          </div>
        </div>
      </div>

      {anamnesis && (
        <div className="bg-white rounded-2xl p-5" style={{ border: '2px solid #e5e7eb', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
              <Award className="w-4 h-4" style={{ color: '#d97706' }} />
            </div>
            <span className="font-semibold text-sm" style={{ color: '#1f2937' }}>
              {es ? 'Perfil Nutricional' : 'Nutrition Profile'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: es ? 'Peso Corporal' : 'Body Weight', value: `${anamnesis.body_weight_kg}kg` },
              { label: es ? 'Horas entren./semana' : 'Training hrs/wk', value: `${anamnesis.weekly_training_hours}h` },
              { label: es ? 'Tolerancia GI' : 'GI Tolerance', value: anamnesis.gi_history },
              { label: es ? 'GI Entrenado' : 'Gut Trained', value: anamnesis.gut_trained ? (es ? 'Sí' : 'Yes') : 'No' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3" style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                <div className="text-xs mb-1" style={{ color: '#9ca3af' }}>{label}</div>
                <div className="text-sm font-semibold capitalize" style={{ color: '#1f2937' }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <FuelDayBadge type={anamnesis.training_phase} active />
            {anamnesis.dietary_pattern !== 'omnivore' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" style={{ backgroundColor: '#f0fdf4', color: '#15803d', borderColor: '#86efac' }}>
                {anamnesis.dietary_pattern}
              </span>
            )}
            {anamnesis.food_allergies.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" style={{ backgroundColor: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' }}>
                {anamnesis.food_allergies.length} {es ? 'alergia' : 'allergy'}
              </span>
            )}
            {anamnesis.current_supplements.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#93c5fd' }}>
                <Zap className="w-3 h-3" />{anamnesis.current_supplements.length} {es ? 'suplementos' : 'supplements'}
              </span>
            )}
          </div>

          {hasTargets && (
            <div className="mt-4 pt-4 border-t grid grid-cols-4 gap-2" style={{ borderColor: '#f3f4f6' }}>
              {[
                { label: es ? 'Calorías' : 'Calories', value: targets.calories_kcal, unit: 'kcal', color: '#f59e0b' },
                { label: es ? 'Carbos' : 'Carbs', value: targets.carbs_g, unit: 'g', color: '#3b82f6' },
                { label: es ? 'Proteína' : 'Protein', value: targets.protein_g, unit: 'g', color: '#10b981' },
                { label: es ? 'Grasa' : 'Fat', value: targets.fat_g, unit: 'g', color: '#f97316' },
              ].map(({ label, value, unit, color }) => (
                <div key={label} className="text-center rounded-xl py-2" style={{ backgroundColor: '#f9fafb' }}>
                  <div className="text-base font-bold" style={{ color }}>{value}<span className="text-xs ml-0.5" style={{ color: '#9ca3af' }}>{unit}</span></div>
                  <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl p-5" style={{ border: '2px solid #e5e7eb', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fdf2f8' }}>
            <Zap className="w-4 h-4" style={{ color: '#be185d' }} />
          </div>
          <span className="font-semibold text-sm" style={{ color: '#1f2937' }}>
            {es ? 'Herramientas Avanzadas' : 'Advanced Tools'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FEATURE_CARDS.map(({ id, icon: Icon, title, desc, color, bg }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex flex-col items-start gap-2 p-4 rounded-2xl text-left transition-all hover:shadow-sm hover:-translate-y-0.5"
              style={{ backgroundColor: bg, border: `2px solid ${color}20` }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'white' }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <div className="font-semibold text-sm leading-tight" style={{ color: '#1f2937' }}>{title}</div>
                <div className="text-xs mt-1 leading-relaxed" style={{ color: '#9ca3af' }}>{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!anamnesis && (
        <div
          className="rounded-2xl p-6 flex flex-col items-center text-center"
          style={{ background: 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)', border: '2px solid #fcd34d' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#fdda36' }}>
            <Target className="w-7 h-7" style={{ color: '#3b2a50' }} />
          </div>
          <h3 className="font-heading text-lg mb-2" style={{ color: '#1f2937' }}>
            {es ? 'Comienza tu Perfil Nutricional' : 'Start your Nutrition Profile'}
          </h3>
          <p className="text-sm mb-4 max-w-sm" style={{ color: '#6b7280' }}>
            {es
              ? 'Completa tu anamnesis para recibir metas de macros personalizadas, planes de carga y recomendaciones nutricionales para tu carrera.'
              : 'Complete your anamnesis to receive personalized macro targets, fuel day plans, and race nutrition recommendations tailored to your body and training load.'}
          </p>
          <button
            onClick={() => onNavigate('anamnesis')}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: '#3b2a50', color: '#fdda36' }}
          >
            {es ? 'Completar Anamnesis' : 'Complete Anamnesis'}
          </button>
        </div>
      )}
    </div>
  );
}
