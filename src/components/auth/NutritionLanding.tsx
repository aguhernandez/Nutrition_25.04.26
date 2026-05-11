import { useState, useEffect, useRef } from 'react';
import {
  Zap, Activity, Droplets, Clock, TrendingUp, ChevronRight, ArrowRight,
  BarChart2, Shield, Globe, Users, Layers, Play, Star, Target, Flame,
  Apple, Coffee, Dumbbell, Heart, Award, BookOpen, LogIn,
} from 'lucide-react';
import { usePreferences } from '../../lib/preferences';
import type { Language } from '../../lib/preferences';

interface Props {
  onLogin: () => void;
}

// ─── Translations ─────────────────────────────────────────────────────────────

const copy = {
  nav: {
    fueling: { es: 'Estrategias de Combustible', en: 'Fueling Strategies' },
    performance: { es: 'Rendimiento', en: 'Performance' },
    coaches: { es: 'Para Entrenadores', en: 'For Coaches' },
    login: { es: 'Iniciar Sesión', en: 'Log In' },
    getStarted: { es: 'Comenzar', en: 'Get Started' },
  },
  hero: {
    badge: { es: 'PLATAFORMA DE NUTRICIÓN DEPORTIVA', en: 'SPORTS NUTRITION PLATFORM' },
    headline1: { es: 'Potencia', en: 'Fuel' },
    headline2: { es: 'tu Rendimiento.', en: 'Performance.' },
    sub: {
      es: 'Protocolos de nutrición basados en ciencia para atletas de resistencia. Combustible de carrera, recuperación e hidratación — todo en un ecosistema conectado.',
      en: 'Science-driven nutrition protocols for endurance athletes. Race fueling, recovery, hydration — all in one connected ecosystem.',
    },
    ctaStart: { es: 'Comenzar a Rendir', en: 'Start Fueling' },
    ctaExplore: { es: 'Explorar Estrategias', en: 'Explore Strategies' },
  },
  metrics: {
    energy: { es: 'Energía Diaria', en: 'Daily Energy' },
    carbs: { es: 'Carga de Carbohidratos', en: 'Carb Load' },
    hydration: { es: 'Hidratación', en: 'Hydration' },
    recovery: { es: 'Puntuación Recuperación', en: 'Recovery Score' },
  },
  stats: [
    { value: '50K+', label: { es: 'Atletas potenciados', en: 'Athletes fueled' } },
    { value: '2.1M', label: { es: 'Comidas planificadas', en: 'Meals planned' } },
    { value: '98%', label: { es: 'Adherencia al protocolo', en: 'Protocol adherence' } },
    { value: '142', label: { es: 'Distancias de carrera', en: 'Race distances' } },
  ],
  dashboard: {
    badge: { es: 'PANEL DE RENDIMIENTO', en: 'PERFORMANCE DASHBOARD' },
    heading: { es: 'Tu nutrición, diseñada para el día de carrera.', en: 'Your nutrition, engineered for race day.' },
    energy: { es: 'Energía', en: 'Energy' },
    protein: { es: 'Proteína', en: 'Protein' },
    carbsLabel: { es: 'Carbohidratos', en: 'Carbs' },
    timeline: { es: 'HORARIO DE COMIDAS', en: 'MEAL TIMELINE' },
    meals: {
      breakfast: { es: 'Desayuno Pre-Entrenamiento', en: 'Pre-Run Breakfast' },
      midTraining: { es: 'Combustible a Mitad del Entreno', en: 'Mid-Training Fuel' },
      lunch: { es: 'Almuerzo de Recuperación', en: 'Recovery Lunch' },
      dinner: { es: 'Cena', en: 'Dinner' },
    },
    racePlan: { es: 'PLAN DE CARRERA', en: 'RACE FUEL PLAN' },
    marathon: { es: 'Maratón · Domingo', en: 'Marathon · Sunday' },
    recovery: { es: 'RECUPERACIÓN', en: 'RECOVERY' },
  },
  strategies: {
    badge: { es: 'ESTRATEGIAS DE COMBUSTIBLE', en: 'FUELING STRATEGIES' },
    heading: { es: 'Cada carrera. Cada distancia. Cada atleta.', en: 'Every race. Every distance. Every athlete.' },
    rows: [
      {
        title: { es: 'Combustible de Carrera', en: 'Race Fueling' },
        sub: { es: 'Protocolos basados en evidencia para el día de carrera', en: 'Evidence-based protocols for race day' },
      },
      {
        title: { es: 'Recuperación y Reconstrucción', en: 'Recovery & Rebuilding' },
        sub: { es: 'Ventanas de nutrición post-entrenamiento', en: 'Post-training nutrition windows' },
      },
      {
        title: { es: 'Comidas de Rendimiento', en: 'Performance Meals' },
        sub: { es: 'Nutrición pre-competencia y diaria', en: 'Pre-competition and daily fueling' },
      },
    ],
    seeAll: { es: 'Ver todo', en: 'See all' },
  },
  coach: {
    badge: { es: 'PLATAFORMA ENTRENADOR & ATLETA', en: 'COACH & ATHLETE PLATFORM' },
    heading1: { es: 'Creado para entrenadores.', en: 'Built for coaches.' },
    heading2: { es: 'Diseñado para atletas.', en: 'Designed for athletes.' },
    body: {
      es: 'Nutricionistas y entrenadores gestionan paneles multi-atleta, crean planes de comidas individualizados, hacen seguimiento de adherencia y sincronizan protocolos — todo conectado a los datos de entrenamiento del atleta.',
      en: 'Nutritionists and coaches manage multi-athlete dashboards, build individualized meal plans, track adherence, and sync protocols — all connected to athlete training data.',
    },
    features: [
      {
        label: { es: 'Gestión de múltiples atletas', en: 'Multi-athlete management' },
        desc: { es: 'Gestiona cada cliente desde un solo panel', en: 'Manage every client from one dashboard' },
      },
      {
        label: { es: 'Protocolos individualizados', en: 'Individualized protocols' },
        desc: { es: 'Objetivos calóricos, macros y planes de comidas por atleta', en: 'Calorie targets, macros and meal plans per athlete' },
      },
      {
        label: { es: 'Integración con entrenamiento', en: 'Training integration' },
        desc: { es: 'La nutrición se adapta a la carga de entrenamiento y calendario de carreras', en: 'Nutrition adapts to training load and race calendar' },
      },
      {
        label: { es: 'Seguimiento de hábitos y adherencia', en: 'Habit & adherence tracking' },
        desc: { es: 'Monitorea el cumplimiento nutricional a lo largo del tiempo', en: 'Monitor nutrition compliance over time' },
      },
    ],
    athletes: { es: 'Atletas', en: 'Athletes' },
    active: { es: 'activos', en: 'active' },
    athleteList: [
      { name: 'Maria Santos', sport: { es: 'Maratón', en: 'Marathon' }, plan: { es: 'Semana de Carrera', en: 'Race Week' } },
      { name: 'Carlos Mendez', sport: { es: 'Triatlón', en: 'Triathlon' }, plan: { es: 'Construcción Base', en: 'Base Build' } },
      { name: 'Ana Rivera', sport: { es: 'Ultra Trail', en: 'Ultra Trail' }, plan: { es: 'Fase de Volumen', en: 'Volume Phase' } },
      { name: 'Diego Park', sport: { es: 'Ciclismo', en: 'Cycling' }, plan: { es: 'Recuperación', en: 'Recovery' } },
    ],
  },
  ecosystem: {
    badge: { es: 'ECOSISTEMA CONECTADO', en: 'CONNECTED ECOSYSTEM' },
    heading: { es: 'La nutrición es solo el comienzo.', en: 'Nutrition is just the beginning.' },
    body: {
      es: 'Asciende conecta nutrición con entrenamiento, educación, análisis y gestión de atletas en una sola plataforma.',
      en: 'Asciende connects nutrition with training, education, testing, and athlete management in one platform.',
    },
    items: [
      { name: 'Academy', desc: { es: 'Cursos y educación', en: 'Courses & education' } },
      { name: 'Endurance', desc: { es: 'Planes de entrenamiento', en: 'Training plans' } },
      { name: 'Lab', desc: { es: 'Pruebas y análisis', en: 'Testing & analysis' } },
      { name: 'Hub', desc: { es: 'Gestión de atletas', en: 'Athlete management' } },
    ],
  },
  cta: {
    badge: { es: 'COMIENZA HOY', en: 'START TODAY' },
    heading: { es: 'La recuperación empieza aquí.', en: 'Recovery starts here.' },
    body: {
      es: 'Únete a miles de atletas y entrenadores que usan protocolos de nutrición basados en ciencia para alcanzar el máximo rendimiento.',
      en: 'Join thousands of athletes and coaches using science-driven nutrition protocols to reach peak performance.',
    },
    btn: { es: 'Entrar a la Plataforma', en: 'Enter Platform' },
    sub: { es: 'Conecta a través de Asciende HUB · Autenticación segura de atletas', en: 'Connects via Asciende HUB · Secure athlete authentication' },
  },
  footer: {
    brand: { es: 'Asciende Nutrición', en: 'Asciende Nutrition' },
    copy: { es: 'Plataforma de Nutrición Deportiva', en: 'Sports Nutrition Platform' },
  },
};

// ─── Static card data ─────────────────────────────────────────────────────────

const STRATEGY_CARDS = {
  es: [
    { category: 'Combustible de Carrera', title: 'Estrategia Carbohidratos Maratón', subtitle: 'Eventos +90min · Foco en CHO', color: '#f59e0b', icon: Flame, tags: ['Día Carrera', 'Carbohidratos', 'Rendimiento'] },
    { category: 'Recuperación', title: 'Reconstrucción Post-Entreno', subtitle: 'Tiempo proteína · Glucógeno', color: '#16a34a', icon: Dumbbell, tags: ['Recuperación', 'Proteína', 'Ventana 4h'] },
    { category: 'Hidratación', title: 'Protocolo de Electrolitos', subtitle: 'Adaptación calor · Tasa sudoración', color: '#0ea5e9', icon: Droplets, tags: ['Hidratación', 'Sodio', 'Calor'] },
    { category: 'Comidas Rendimiento', title: 'Desayuno Pre-Carrera', subtitle: '3h antes del inicio · Bajo en fibra', color: '#ef4444', icon: Apple, tags: ['Pre-Carrera', 'Timing', 'Seguro GI'] },
    { category: 'Viaje con Nutrición', title: 'Viaje a Competencia', subtitle: 'Zonas horarias · Protocolo jet lag', color: '#8b5cf6', icon: Globe, tags: ['Viaje', 'Timing', 'Recuperación'] },
    { category: 'Semana Competencia', title: 'Nutrición de Descarga', subtitle: 'Semana pico · Carga de carbohidratos', color: '#ec4899', icon: Award, tags: ['Descarga', 'Carga CHO', 'Pico'] },
    { category: 'Entrenamiento Base', title: 'Combustible Alto Volumen', subtitle: 'Nutrición periodizada · HA', color: '#14b8a6', icon: TrendingUp, tags: ['Volumen', 'Periodizado', 'Base'] },
    { category: 'Entrenamiento Intestinal', title: 'Simulación Combustible Carrera', subtitle: 'Tolerancia CHO · Práctica', color: '#f97316', icon: Target, tags: ['Intestino', 'Entrenamiento', '60-90g/h'] },
  ],
  en: [
    { category: 'Race Fueling', title: 'Marathon Carb Strategy', subtitle: '90min+ events · CHO-focused', color: '#f59e0b', icon: Flame, tags: ['Race Day', 'Carbs', 'Performance'] },
    { category: 'Recovery', title: 'Post-Workout Rebuild', subtitle: 'Protein timing · Glycogen', color: '#16a34a', icon: Dumbbell, tags: ['Recovery', 'Protein', '4hr window'] },
    { category: 'Hydration', title: 'Electrolyte Protocol', subtitle: 'Heat adaptation · Sweat rate', color: '#0ea5e9', icon: Droplets, tags: ['Hydration', 'Sodium', 'Heat'] },
    { category: 'Performance Meals', title: 'Pre-Race Breakfast', subtitle: '3hr before start · Low fiber', color: '#ef4444', icon: Apple, tags: ['Pre-Race', 'Timing', 'GI Safe'] },
    { category: 'Travel Nutrition', title: 'Competition Travel', subtitle: 'Time zones · Jet lag protocol', color: '#8b5cf6', icon: Globe, tags: ['Travel', 'Timing', 'Recovery'] },
    { category: 'Competition Week', title: 'Taper Nutrition', subtitle: 'Peak week · Carb loading', color: '#ec4899', icon: Award, tags: ['Taper', 'Carb Load', 'Peak'] },
    { category: 'Base Training', title: 'High Volume Fueling', subtitle: 'Periodized nutrition · HA', color: '#14b8a6', icon: TrendingUp, tags: ['Volume', 'Periodized', 'Base'] },
    { category: 'Gut Training', title: 'Race Simulation Fueling', subtitle: 'CHO tolerance · Practice', color: '#f97316', icon: Target, tags: ['Gut', 'Training', '60-90g/hr'] },
  ],
};

const ECOSYSTEM_ICONS = [BookOpen, Activity, BarChart2, Users];
const ECOSYSTEM_COLORS = ['#f59e0b', '#ef4444', '#16a34a', '#0ea5e9'];
const COACH_FEATURE_ICONS = [Users, Layers, Activity, Shield];
const COACH_FEATURE_COLORS = ['#16a34a', '#16a34a', '#16a34a', '#16a34a'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function t(obj: { es: string; en: string }, lang: Language) {
  return lang === 'es' ? obj.es : obj.en;
}

function MetricCard({ label, value, unit, color, icon: Icon, delta, index }: {
  label: string; value: string; unit: string; color: string;
  icon: React.ElementType; delta: string; index: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300 + index * 120);
    return () => clearTimeout(timer);
  }, [index]);
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2 transition-all duration-700"
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center justify-between">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${color}22`, color }}>
          {delta}
        </span>
      </div>
      <div>
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{unit}</span>
      </div>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
    </div>
  );
}

function StrategyCard({ card }: { card: typeof STRATEGY_CARDS['en'][0] }) {
  const Icon = card.icon;
  return (
    <div
      className="flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1"
      style={{
        width: '220px',
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="h-28 flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: `${card.color}18` }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(circle at 30% 70%, ${card.color} 0%, transparent 60%)` }}
        />
        <Icon className="w-10 h-10 relative z-10 group-hover:scale-110 transition-transform duration-300" style={{ color: card.color }} />
        <span className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${card.color}33`, color: card.color }}>
          {card.category}
        </span>
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm text-white mb-0.5">{card.title}</p>
        <p className="text-xs mb-2.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{card.subtitle}</p>
        <div className="flex flex-wrap gap-1">
          {card.tags.map((tg) => (
            <span key={tg} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
              {tg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CarouselRow({ title, subtitle, cards, startIndex = 0, seeAllLabel }: {
  title: string; subtitle: string; cards: typeof STRATEGY_CARDS['en'];
  startIndex?: number; seeAllLabel: string;
}) {
  const items = [...cards.slice(startIndex), ...cards.slice(0, startIndex)];
  return (
    <div className="mb-10">
      <div className="flex items-end gap-3 mb-4 px-4 lg:px-16">
        <div>
          <h3 className="text-base font-bold text-white">{title}</h3>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{subtitle}</p>
        </div>
        <button className="ml-auto flex items-center gap-1 text-xs font-semibold transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {seeAllLabel} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div
        className="flex gap-3 overflow-x-auto px-4 lg:px-16 pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((card, i) => (
          <StrategyCard key={`${card.title}-${i}`} card={card} />
        ))}
      </div>
    </div>
  );
}

// ─── Language selector ────────────────────────────────────────────────────────

function LangButton({ current, onChange }: { current: Language; onChange: (l: Language) => void }) {
  return (
    <div
      className="flex items-center rounded-lg overflow-hidden"
      style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      {(['es', 'en'] as Language[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className="px-3 py-1.5 text-xs font-bold transition-all duration-200"
          style={{
            backgroundColor: current === l ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: current === l ? '#fff' : 'rgba(255,255,255,0.45)',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NutritionLanding({ onLogin }: Props) {
  const { language, setLanguage } = usePreferences();
  const lang = language;

  const [scrollY, setScrollY] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const parallax = Math.min(scrollY * 0.25, 60);
  const cards = STRATEGY_CARDS[lang];

  const metrics = [
    { label: t(copy.metrics.energy, lang), value: '2,840', unit: 'kcal', color: '#f59e0b', icon: Zap, delta: '+4%' },
    { label: t(copy.metrics.carbs, lang), value: '342', unit: 'g', color: '#16a34a', icon: Activity, delta: lang === 'es' ? 'En objetivo' : 'On target' },
    { label: t(copy.metrics.hydration, lang), value: '3.2', unit: 'L', color: '#0ea5e9', icon: Droplets, delta: '91%' },
    { label: t(copy.metrics.recovery, lang), value: '87', unit: '/100', color: '#ef4444', icon: Heart, delta: '+12' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080c10', color: '#fff' }}>

      {/* ── Sticky Nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 lg:px-16 py-4 transition-all duration-300"
        style={{
          backgroundColor: scrollY > 40 ? 'rgba(8,12,16,0.92)' : 'transparent',
          backdropFilter: scrollY > 40 ? 'blur(16px)' : 'none',
          borderBottom: scrollY > 40 ? '1px solid rgba(255,255,255,0.07)' : 'none',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src="/Logo_transp.png" alt="Asciende" className="h-7 w-auto" />
          <span className="text-sm font-bold tracking-tight text-white">Nutrition</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <button
            className="hover:text-white transition-colors"
            onClick={() => document.getElementById('strategies')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t(copy.nav.fueling, lang)}
          </button>
          <button
            className="hover:text-white transition-colors"
            onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t(copy.nav.performance, lang)}
          </button>
          <button
            className="hover:text-white transition-colors"
            onClick={() => document.getElementById('coaches')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t(copy.nav.coaches, lang)}
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2.5">
          <LangButton current={lang} onChange={setLanguage} />

          {/* Login button */}
          <button
            onClick={onLogin}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t(copy.nav.login, lang)}</span>
          </button>

          {/* Get started button */}
          <button
            onClick={onLogin}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: '#f59e0b', color: '#000' }}
          >
            <Zap className="w-3.5 h-3.5" />
            {t(copy.nav.getStarted, lang)}
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)',
            transform: `translateY(${parallax}px)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 40% at 20% 80%, rgba(14,165,233,0.08) 0%, transparent 60%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Badge */}
        <div
          className="mb-8 transition-all duration-700 delay-100"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(-12px)' }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
            style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {t(copy.hero.badge, lang)}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-bold leading-none tracking-tight mb-6 transition-all duration-700 delay-200"
          style={{
            fontSize: 'clamp(3rem, 9vw, 7.5rem)',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <span className="block text-white">{t(copy.hero.headline1, lang)}</span>
          <span
            className="block"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t(copy.hero.headline2, lang)}
          </span>
        </h1>

        <p
          className="max-w-xl mb-10 text-base lg:text-lg transition-all duration-700 delay-300"
          style={{
            color: 'rgba(255,255,255,0.5)',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          {t(copy.hero.sub, lang)}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center gap-3 mb-16 transition-all duration-700 delay-[400ms]"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <button
            onClick={onLogin}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: '#f59e0b', color: '#000', boxShadow: '0 0 40px rgba(245,158,11,0.3)' }}
          >
            {t(copy.hero.ctaStart, lang)} <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => document.getElementById('strategies')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Play className="w-3.5 h-3.5" /> {t(copy.hero.ctaExplore, lang)}
          </button>
        </div>

        {/* Metric cards */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-2xl transition-all duration-700 delay-500"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(24px)' }}
        >
          {metrics.map((m, i) => <MetricCard key={m.label} {...m} index={i} />)}
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2" style={{ color: 'rgba(255,255,255,0.2)' }}>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-auto animate-pulse" />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {copy.stats.map((s) => (
            <div key={s.value}>
              <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t(s.label, lang)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dashboard preview ── */}
      <section id="dashboard" className="py-20 px-0">
        <div className="px-6 lg:px-16 mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#f59e0b' }}>{t(copy.dashboard.badge, lang)}</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight max-w-lg">
            {t(copy.dashboard.heading, lang)}
          </h2>
        </div>
        <div className="px-6 lg:px-16">
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '24px',
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-1.5">
                {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c, opacity: 0.6 }} />
                ))}
              </div>
              <div className="flex-1 h-6 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.04)', maxWidth: '240px' }} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: t(copy.dashboard.energy, lang), value: '2,840 kcal', color: '#f59e0b', pct: 82 },
                    { label: t(copy.dashboard.protein, lang), value: '165 g', color: '#ef4444', pct: 91 },
                    { label: t(copy.dashboard.carbsLabel, lang), value: '342 g', color: '#16a34a', pct: 88 },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</p>
                      <p className="text-sm font-bold text-white mb-2">{item.value}</p>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{t(copy.dashboard.timeline, lang)}</p>
                  <div className="space-y-2">
                    {[
                      { time: '07:00', mealKey: 'breakfast' as const, kcal: 480, color: '#f59e0b' },
                      { time: '10:30', mealKey: 'midTraining' as const, kcal: 180, color: '#16a34a' },
                      { time: '13:00', mealKey: 'lunch' as const, kcal: 720, color: '#0ea5e9' },
                      { time: '19:00', mealKey: 'dinner' as const, kcal: 650, color: '#ef4444' },
                    ].map((m) => (
                      <div key={m.time} className="flex items-center gap-3">
                        <span className="text-xs font-mono w-12 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.time}</span>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                        <span className="text-xs text-white flex-1">{t(copy.dashboard.meals[m.mealKey], lang)}</span>
                        <span className="text-xs font-semibold" style={{ color: m.color }}>{m.kcal}</span>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>kcal</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <p className="text-xs font-bold text-amber-400">{t(copy.dashboard.racePlan, lang)}</p>
                  </div>
                  <p className="text-sm font-bold text-white mb-0.5">{t(copy.dashboard.marathon, lang)}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>60g CHO/hr · 750ml H₂O/hr</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {['Gels ×6', 'Chews ×2', 'Sports Drink'].map((tg) => (
                      <span key={tg} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>{tg}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4" style={{ color: '#ef4444' }} />
                    <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{t(copy.dashboard.recovery, lang)}</p>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-white">87</span>
                    <span className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>/100</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: '87%', background: 'linear-gradient(90deg, #16a34a, #22c55e)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Strategy carousels ── */}
      <section id="strategies" className="py-16">
        <div className="px-6 lg:px-16 mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#0ea5e9' }}>{t(copy.strategies.badge, lang)}</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight max-w-lg">
            {t(copy.strategies.heading, lang)}
          </h2>
        </div>
        {copy.strategies.rows.map((row, i) => (
          <CarouselRow
            key={i}
            title={t(row.title, lang)}
            subtitle={t(row.sub, lang)}
            cards={cards}
            startIndex={i * 3}
            seeAllLabel={t(copy.strategies.seeAll, lang)}
          />
        ))}
      </section>

      {/* ── Coach workflow ── */}
      <section id="coaches" className="py-20 px-6 lg:px-16" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#16a34a' }}>{t(copy.coach.badge, lang)}</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
                {t(copy.coach.heading1, lang)}<br />
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>{t(copy.coach.heading2, lang)}</span>
              </h2>
              <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.7' }}>
                {t(copy.coach.body, lang)}
              </p>
              <div className="space-y-4">
                {copy.coach.features.map((feature, i) => {
                  const Icon = COACH_FEATURE_ICONS[i];
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.2)' }}>
                        <Icon className="w-4 h-4" style={{ color: '#16a34a' }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{t(feature.label, lang)}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{t(feature.desc, lang)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Athlete management mockup */}
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-30 blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.3) 0%, transparent 70%)' }}
              />
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white">{t(copy.coach.athletes, lang)}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(22,163,74,0.15)', color: '#16a34a' }}>
                      12 {t(copy.coach.active, lang)}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {copy.coach.athleteList.map((a, i) => {
                    const colors = ['#f59e0b', '#16a34a', '#0ea5e9', '#ef4444'];
                    const scores = [94, 88, 76, 91];
                    const c = colors[i];
                    return (
                      <div
                        key={a.name}
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: `${c}22`, color: c }}
                        >
                          {a.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{a.name}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {t(a.sport, lang)} · {t(a.plan, lang)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold" style={{ color: c }}>{scores[i]}</span>
                          <Star className="w-3 h-3" style={{ color: c }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ecosystem ── */}
      <section className="py-20 px-6 lg:px-16" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>{t(copy.ecosystem.badge, lang)}</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">{t(copy.ecosystem.heading, lang)}</h2>
          <p className="text-base mb-12 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>{t(copy.ecosystem.body, lang)}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {copy.ecosystem.items.map((eco, i) => {
              const Icon = ECOSYSTEM_ICONS[i];
              const color = ECOSYSTEM_COLORS[i];
              return (
                <div
                  key={eco.name}
                  className="rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 group"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${color}18`, border: `1px solid ${color}33` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{eco.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{t(eco.desc, lang)}</p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {copy.ecosystem.items.map((eco, i) => (
              <div key={eco.name} className="flex items-center gap-3">
                <span
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: `${ECOSYSTEM_COLORS[i]}18`, color: ECOSYSTEM_COLORS[i], border: `1px solid ${ECOSYSTEM_COLORS[i]}33` }}
                >
                  {eco.name}
                </span>
                {i < copy.ecosystem.items.length - 1 && (
                  <div className="w-6 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-6 text-center relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
        />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>{t(copy.cta.badge, lang)}</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">{t(copy.cta.heading, lang)}</h2>
          <p className="text-base mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>{t(copy.cta.body, lang)}</p>
          <button
            onClick={onLogin}
            className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: '#f59e0b', color: '#000', boxShadow: '0 0 60px rgba(245,158,11,0.25)' }}
          >
            <Zap className="w-5 h-5" />
            {t(copy.cta.btn, lang)}
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{t(copy.cta.sub, lang)}</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 lg:px-16 py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/Logo_transp.png" alt="Asciende" className="h-6 w-auto opacity-60" />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>{t(copy.footer.brand, lang)}</span>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            &copy; {new Date().getFullYear()} Asciende · {t(copy.footer.copy, lang)}
          </p>
        </div>
      </footer>

    </div>
  );
}






export default NutritionLanding