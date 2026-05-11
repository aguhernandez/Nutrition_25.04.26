import { useState, useEffect, useRef } from 'react';
import {
  Zap, Activity, Droplets, Clock, TrendingUp, ChevronRight, ArrowRight,
  BarChart2, Shield, Globe, Users, Layers, Play, Star, Target, Flame,
  Apple, Coffee, Dumbbell, Heart, Award, BookOpen,
} from 'lucide-react';

interface Props {
  onLogin: () => void;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const METRICS = [
  { label: 'Daily Energy', value: '2,840', unit: 'kcal', color: '#f59e0b', icon: Zap, delta: '+4%' },
  { label: 'Carb Load', value: '342', unit: 'g', color: '#16a34a', icon: Activity, delta: 'On target' },
  { label: 'Hydration', value: '3.2', unit: 'L', color: '#0ea5e9', icon: Droplets, delta: '91%' },
  { label: 'Recovery Score', value: '87', unit: '/100', color: '#ef4444', icon: Heart, delta: '+12' },
];

const STRATEGY_CARDS = [
  {
    category: 'Race Fueling',
    title: 'Marathon Carb Strategy',
    subtitle: '90min+ events · CHO-focused',
    color: '#f59e0b',
    icon: Flame,
    tags: ['Race Day', 'Carbs', 'Performance'],
  },
  {
    category: 'Recovery',
    title: 'Post-Workout Rebuild',
    subtitle: 'Protein timing · Glycogen',
    color: '#16a34a',
    icon: Dumbbell,
    tags: ['Recovery', 'Protein', '4hr window'],
  },
  {
    category: 'Hydration',
    title: 'Electrolyte Protocol',
    subtitle: 'Heat adaptation · Sweat rate',
    color: '#0ea5e9',
    icon: Droplets,
    tags: ['Hydration', 'Sodium', 'Heat'],
  },
  {
    category: 'Performance Meals',
    title: 'Pre-Race Breakfast',
    subtitle: '3hr before start · Low fiber',
    color: '#ef4444',
    icon: Apple,
    tags: ['Pre-Race', 'Timing', 'GI Safe'],
  },
  {
    category: 'Travel Nutrition',
    title: 'Competition Travel',
    subtitle: 'Time zones · Jet lag protocol',
    color: '#8b5cf6',
    icon: Globe,
    tags: ['Travel', 'Timing', 'Recovery'],
  },
  {
    category: 'Competition Week',
    title: 'Taper Nutrition',
    subtitle: 'Peak week · Carb loading',
    color: '#ec4899',
    icon: Award,
    tags: ['Taper', 'Carb Load', 'Peak'],
  },
  {
    category: 'Base Training',
    title: 'High Volume Fueling',
    subtitle: 'Periodized nutrition · HA',
    color: '#14b8a6',
    icon: TrendingUp,
    tags: ['Volume', 'Periodized', 'Base'],
  },
  {
    category: 'Gut Training',
    title: 'Race Simulation Fueling',
    subtitle: 'CHO tolerance · Practice',
    color: '#f97316',
    icon: Target,
    tags: ['Gut', 'Training', '60-90g/hr'],
  },
];

const ECOSYSTEM = [
  { name: 'Academy', desc: 'Courses & education', color: '#f59e0b', icon: BookOpen },
  { name: 'Endurance', desc: 'Training plans', color: '#ef4444', icon: Activity },
  { name: 'Lab', desc: 'Testing & analysis', color: '#16a34a', icon: BarChart2 },
  { name: 'Hub', desc: 'Athlete management', color: '#0ea5e9', icon: Users },
];

const STATS = [
  { value: '50K+', label: 'Athletes fueled' },
  { value: '2.1M', label: 'Meals planned' },
  { value: '98%', label: 'Protocol adherence' },
  { value: '142', label: 'Race distances' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ metric, index }: { metric: typeof METRICS[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300 + index * 120);
    return () => clearTimeout(t);
  }, [index]);
  const Icon = metric.icon;
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
        <Icon className="w-4 h-4" style={{ color: metric.color }} />
        <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${metric.color}22`, color: metric.color }}>
          {metric.delta}
        </span>
      </div>
      <div>
        <span className="text-2xl font-bold text-white">{metric.value}</span>
        <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{metric.unit}</span>
      </div>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{metric.label}</p>
    </div>
  );
}

function StrategyCard({ card }: { card: typeof STRATEGY_CARDS[0] }) {
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
      {/* Visual header */}
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
          {card.tags.map((t) => (
            <span key={t} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CarouselRow({ title, subtitle, cards, startIndex = 0 }: {
  title: string;
  subtitle: string;
  cards: typeof STRATEGY_CARDS;
  startIndex?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = [...cards.slice(startIndex), ...cards.slice(0, startIndex)];
  return (
    <div className="mb-10">
      <div className="flex items-end gap-3 mb-4 px-4 lg:px-16">
        <div>
          <h3 className="text-base font-bold text-white">{title}</h3>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{subtitle}</p>
        </div>
        <button className="ml-auto flex items-center gap-1 text-xs font-semibold transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>
          See all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div
        ref={scrollRef}
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

// ─── Main component ────────────────────────────────────────────────────────────

export default function NutritionLanding({ onLogin }: Props) {
  const [scrollY, setScrollY] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const parallax = Math.min(scrollY * 0.25, 60);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080c10', color: '#fff' }}>

      {/* ── Sticky Nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 py-4 transition-all duration-300"
        style={{
          backgroundColor: scrollY > 40 ? 'rgba(8,12,16,0.92)' : 'transparent',
          backdropFilter: scrollY > 40 ? 'blur(16px)' : 'none',
          borderBottom: scrollY > 40 ? '1px solid rgba(255,255,255,0.07)' : 'none',
        }}
      >
        <div className="flex items-center gap-2.5">
          <img src="/Logo_transp.png" alt="Asciende" className="h-7 w-auto" />
          <span className="text-sm font-bold tracking-tight text-white">Nutrition</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <button className="hover:text-white transition-colors">Fueling Strategies</button>
          <button className="hover:text-white transition-colors">Performance</button>
          <button className="hover:text-white transition-colors">For Coaches</button>
        </div>
        <button
          onClick={onLogin}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
          style={{ backgroundColor: '#f59e0b', color: '#000' }}
        >
          <Zap className="w-3.5 h-3.5" />
          Get Started
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* Background gradient layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)',
            transform: `translateY(${parallax}px)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 40% at 20% 80%, rgba(14,165,233,0.08) 0%, transparent 60%)',
          }}
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Pill badge */}
        <div
          className="mb-8 transition-all duration-700 delay-100"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(-12px)',
          }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
            style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            SPORTS NUTRITION PLATFORM
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="font-bold leading-none tracking-tight mb-6 transition-all duration-700 delay-200"
          style={{
            fontSize: 'clamp(3rem, 9vw, 7.5rem)',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <span className="block text-white">Fuel</span>
          <span
            className="block"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Performance.
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
          Science-driven nutrition protocols for endurance athletes.
          Race fueling, recovery, hydration — all in one connected ecosystem.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center gap-3 mb-16 transition-all duration-700 delay-[400ms]"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <button
            onClick={onLogin}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            style={{
              backgroundColor: '#f59e0b',
              color: '#000',
              boxShadow: '0 0 40px rgba(245,158,11,0.3)',
            }}
          >
            Start Fueling <ArrowRight className="w-4 h-4" />
          </button>
          <button
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onClick={() => document.getElementById('strategies')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Play className="w-3.5 h-3.5" /> Explore Strategies
          </button>
        </div>

        {/* Metric preview cards */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-2xl transition-all duration-700 delay-500"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          {METRICS.map((m, i) => <MetricCard key={m.label} metric={m} index={i} />)}
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" style={{ color: 'rgba(255,255,255,0.2)' }}>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-auto" />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dashboard preview strip ── */}
      <section className="py-20 px-0 overflow-hidden">
        <div className="px-6 lg:px-16 mb-10">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#f59e0b' }}>PERFORMANCE DASHBOARD</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight max-w-lg">
            Your nutrition, engineered for race day.
          </h2>
        </div>
        {/* Mock dashboard UI */}
        <div className="px-6 lg:px-16">
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '24px',
            }}
          >
            {/* Top bar mockup */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-1.5">
                {['#ef4444','#f59e0b','#22c55e'].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c, opacity: 0.6 }} />
                ))}
              </div>
              <div className="flex-1 h-6 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.04)', maxWidth: '240px' }} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left panel */}
              <div className="lg:col-span-2 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Energy', value: '2,840 kcal', color: '#f59e0b', pct: 82 },
                    { label: 'Protein', value: '165 g', color: '#ef4444', pct: 91 },
                    { label: 'Carbs', value: '342 g', color: '#16a34a', pct: 88 },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</p>
                      <p className="text-sm font-bold text-white mb-2">{item.value}</p>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Meal timeline */}
                <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>MEAL TIMELINE</p>
                  <div className="space-y-2">
                    {[
                      { time: '07:00', meal: 'Pre-Run Breakfast', kcal: 480, color: '#f59e0b' },
                      { time: '10:30', meal: 'Mid-Training Fuel', kcal: 180, color: '#16a34a' },
                      { time: '13:00', meal: 'Recovery Lunch', kcal: 720, color: '#0ea5e9' },
                      { time: '19:00', meal: 'Dinner', kcal: 650, color: '#ef4444' },
                    ].map((m) => (
                      <div key={m.time} className="flex items-center gap-3">
                        <span className="text-xs font-mono w-12 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.time}</span>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                        <span className="text-xs text-white flex-1">{m.meal}</span>
                        <span className="text-xs font-semibold" style={{ color: m.color }}>{m.kcal}</span>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>kcal</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Right panel */}
              <div className="space-y-3">
                <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <p className="text-xs font-bold text-amber-400">RACE FUEL PLAN</p>
                  </div>
                  <p className="text-sm font-bold text-white mb-0.5">Marathon · Sunday</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>60g CHO/hr · 750ml H₂O/hr</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {['Gels ×6', 'Chews ×2', 'Sports Drink'].map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4" style={{ color: '#ef4444' }} />
                    <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>RECOVERY</p>
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
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#0ea5e9' }}>FUELING STRATEGIES</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight max-w-lg">
            Every race. Every distance. Every athlete.
          </h2>
        </div>
        <CarouselRow title="Race Fueling" subtitle="Evidence-based protocols for race day" cards={STRATEGY_CARDS} startIndex={0} />
        <CarouselRow title="Recovery & Rebuilding" subtitle="Post-training nutrition windows" cards={STRATEGY_CARDS} startIndex={3} />
        <CarouselRow title="Performance Meals" subtitle="Pre-competition and daily fueling" cards={STRATEGY_CARDS} startIndex={5} />
      </section>

      {/* ── Coach workflow ── */}
      <section className="py-20 px-6 lg:px-16" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#16a34a' }}>COACH & ATHLETE PLATFORM</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
                Built for coaches.<br />
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>Designed for athletes.</span>
              </h2>
              <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.7' }}>
                Nutritionists and coaches manage multi-athlete dashboards, build individualized meal plans, track adherence, and sync protocols — all connected to athlete training data.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Users, label: 'Multi-athlete management', desc: 'Manage every client from one dashboard' },
                  { icon: Layers, label: 'Individualized protocols', desc: 'Calorie targets, macros and meal plans per athlete' },
                  { icon: Activity, label: 'Training integration', desc: 'Nutrition adapts to training load and race calendar' },
                  { icon: Shield, label: 'Habit & adherence tracking', desc: 'Monitor nutrition compliance over time' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.2)' }}>
                        <Icon className="w-4 h-4" style={{ color: '#16a34a' }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Athlete workflow mockup */}
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-3xl opacity-30 blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.3) 0%, transparent 70%)' }}
              />
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {/* Header */}
                <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white">Athletes</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(22,163,74,0.15)', color: '#16a34a' }}>12 active</span>
                  </div>
                </div>
                {/* Athlete list */}
                <div className="p-4 space-y-2">
                  {[
                    { name: 'Maria Santos', sport: 'Marathon', plan: 'Race Week', score: 94, color: '#f59e0b' },
                    { name: 'Carlos Mendez', sport: 'Triathlon', plan: 'Base Build', score: 88, color: '#16a34a' },
                    { name: 'Ana Rivera', sport: 'Ultra Trail', plan: 'Volume Phase', score: 76, color: '#0ea5e9' },
                    { name: 'Diego Park', sport: 'Cycling', plan: 'Recovery', score: 91, color: '#ef4444' },
                  ].map((a) => (
                    <div
                      key={a.name}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: `${a.color}22`, color: a.color }}
                      >
                        {a.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{a.name}</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{a.sport} · {a.plan}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold" style={{ color: a.color }}>{a.score}</span>
                        <Star className="w-3 h-3" style={{ color: a.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ecosystem ── */}
      <section className="py-20 px-6 lg:px-16" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>CONNECTED ECOSYSTEM</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Nutrition is just the beginning.
          </h2>
          <p className="text-base mb-12 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Asciende connects nutrition with training, education, testing, and athlete management in one platform.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {ECOSYSTEM.map((eco) => {
              const Icon = eco.icon;
              return (
                <div
                  key={eco.name}
                  className="rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 group"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${eco.color}18`, border: `1px solid ${eco.color}33` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: eco.color }} />
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{eco.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{eco.desc}</p>
                </div>
              );
            })}
          </div>
          {/* Connection line */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {ECOSYSTEM.map((eco, i) => (
              <div key={eco.name} className="flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: `${eco.color}18`, color: eco.color, border: `1px solid ${eco.color}33` }}>
                  {eco.name}
                </span>
                {i < ECOSYSTEM.length - 1 && (
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
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#f59e0b' }}>START TODAY</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Recovery starts here.
          </h2>
          <p className="text-base mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Join thousands of athletes and coaches using science-driven nutrition protocols to reach peak performance.
          </p>
          <button
            onClick={onLogin}
            className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            style={{
              backgroundColor: '#f59e0b',
              color: '#000',
              boxShadow: '0 0 60px rgba(245,158,11,0.25)',
            }}
          >
            <Zap className="w-5 h-5" />
            Enter Platform
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Connects via Asciende HUB · Secure athlete authentication
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 lg:px-16 py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/Logo_transp.png" alt="Asciende" className="h-6 w-auto opacity-60" />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Asciende Nutrition</span>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            &copy; {new Date().getFullYear()} Asciende · Sports Nutrition Platform
          </p>
        </div>
      </footer>

    </div>
  );
}
