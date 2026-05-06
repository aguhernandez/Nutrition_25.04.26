import { ChevronLeft, MessageCircle, Star, Shield, Clock, CheckCircle2, ArrowRight, Calendar, User } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const PLANS = [
  {
    id: 'basic',
    name: 'Starter',
    price: '$79',
    period: '/month',
    desc: 'Perfect for athletes beginning their nutrition journey',
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#93c5fd',
    features: [
      '1 initial nutritional assessment (anamnesis)',
      'Personalized macro targets',
      '1 meal plan template (base day)',
      '2 message exchanges per week',
      'Access to recipe library',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'performance',
    name: 'Performance',
    price: '$149',
    period: '/month',
    desc: 'For competitive athletes who want race-week optimization',
    color: '#514163',
    bg: 'linear-gradient(135deg, #514163 0%, #6b5578 100%)',
    border: '#514163',
    features: [
      'Full nutritional anamnesis + quarterly update',
      'Personalized macro & micro targets by phase',
      'Weekly meal plans (base, load, taper, race day)',
      'Unlimited messaging with your nutritionist',
      'Pre-race nutrition protocols',
      'Post-race recovery plans',
      'Shopping list generation',
    ],
    cta: 'Start Now',
    popular: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '$299',
    period: '/month',
    desc: 'Full-service nutrition coaching for high-performance athletes',
    color: '#b45309',
    bg: '#fef3c7',
    border: '#fcd34d',
    features: [
      'Everything in Performance',
      'Weekly 1:1 video call (30 min)',
      'Real-time race nutrition adjustments',
      'Blood work interpretation',
      'Supplement protocol design',
      'Integration with Asciende race planning',
      'Priority response within 2 hours',
    ],
    cta: 'Apply Now',
    popular: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Martina G.',
    sport: 'Ironman athlete',
    text: 'I finally understood what to eat the week before a race. My energy levels during the marathon portion improved dramatically.',
    rating: 5,
  },
  {
    name: 'Carlos R.',
    sport: 'Trail runner',
    text: 'The personalized approach made all the difference. No more GI issues mid-race. The 1:1 coaching paid for itself in my first race.',
    rating: 5,
  },
  {
    name: 'Sofia M.',
    sport: 'Cyclist / duathlete',
    text: 'Having a nutritionist who understands endurance sports is a game changer. My power numbers are up and recovery is faster.',
    rating: 5,
  },
];

export default function NutritionOneOnOne({ onBack }: Props) {
  return (
    <div className="animate-slide-up">
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #514163 0%, #3b2a50 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #fdda36 0%, transparent 60%), radial-gradient(circle at 80% 20%, #fdda36 0%, transparent 40%)' }}
        />
        <div className="relative px-4 lg:px-8 py-12 lg:py-16 max-w-5xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-8 font-body text-sm font-medium transition-all"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Nutrition
          </button>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fdda36' }}>
              <MessageCircle className="w-7 h-7" style={{ color: '#514163' }} />
            </div>
            <div>
              <h1 className="font-heading text-3xl lg:text-4xl text-white mb-2">Nutritional 1:1</h1>
              <p className="font-body text-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Personal coaching from certified sports nutritionists
              </p>
            </div>
          </div>

          <p className="font-body text-base max-w-2xl mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Get a fully personalized nutrition plan designed for your body, your sport, and your race calendar.
            Our nutritionists specialize in endurance sports and understand exactly what your body needs — from base training to race day.
          </p>

          <div className="flex flex-wrap gap-6">
            {[
              { icon: Shield, text: 'Certified sports nutritionists' },
              { icon: Clock, text: 'Plans in 48h or less' },
              { icon: CheckCircle2, text: 'Race-specific protocols' },
              { icon: Star, text: '4.9/5 athlete satisfaction' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#fdda36' }} />
                <span className="font-body text-sm font-medium text-white">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="px-4 lg:px-8 py-10 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl" style={{ color: '#1f2937' }}>Choose your coaching plan</h2>
          <p className="font-body text-sm mt-2" style={{ color: '#9ca3af' }}>All plans include a free 15-min intro call. No commitment required.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl overflow-hidden relative"
              style={{
                border: `2px solid ${plan.border}`,
                boxShadow: plan.popular ? '0 8px 32px rgba(81,65,99,0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              {plan.popular && (
                <div
                  className="text-center py-2 font-body text-xs font-bold tracking-wider uppercase"
                  style={{ backgroundColor: '#fdda36', color: '#514163' }}
                >
                  Most popular
                </div>
              )}
              <div
                className="p-6"
                style={{
                  background: plan.popular ? plan.bg : '#ffffff',
                }}
              >
                <div className="mb-4">
                  <div
                    className="font-heading text-xl mb-1"
                    style={{ color: plan.popular ? '#ffffff' : '#1f2937' }}
                  >
                    {plan.name}
                  </div>
                  <div className="flex items-end gap-1 mb-2">
                    <span
                      className="font-heading text-4xl"
                      style={{ color: plan.popular ? '#fdda36' : plan.color }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className="font-body text-sm mb-1.5"
                      style={{ color: plan.popular ? 'rgba(255,255,255,0.6)' : '#9ca3af' }}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className="font-body text-xs"
                    style={{ color: plan.popular ? 'rgba(255,255,255,0.7)' : '#6b7280' }}
                  >
                    {plan.desc}
                  </p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: plan.popular ? '#fdda36' : plan.color }}
                      />
                      <span
                        className="font-body text-xs"
                        style={{ color: plan.popular ? 'rgba(255,255,255,0.85)' : '#374151' }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className="w-full py-3 rounded-xl font-body font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={
                    plan.popular
                      ? { backgroundColor: '#fdda36', color: '#514163', boxShadow: '0 4px 12px rgba(253,218,54,0.4)' }
                      : { backgroundColor: plan.bg, color: plan.color, border: `1.5px solid ${plan.border}` }
                  }
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl p-6 mb-8" style={{ border: '2px solid #e5e7eb' }}>
          <h3 className="font-heading text-xl mb-5" style={{ color: '#1f2937' }}>How it works</h3>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { step: '01', icon: MessageCircle, title: 'Intro call', desc: 'Free 15-min call to understand your goals and match you with the right nutritionist' },
              { step: '02', icon: User, title: 'Anamnesis', desc: 'Complete your nutritional profile: body composition, training load, dietary preferences' },
              { step: '03', icon: Calendar, title: 'Receive your plan', desc: 'Get your personalized macro targets and meal plans within 48 hours' },
              { step: '04', icon: CheckCircle2, title: 'Ongoing support', desc: 'Adjust and refine weekly based on your performance and feedback' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-heading text-sm"
                    style={{ backgroundColor: 'rgba(253,218,54,0.15)', color: '#514163' }}
                  >
                    {step}
                  </div>
                  <Icon className="w-4 h-4" style={{ color: '#514163' }} />
                </div>
                <div className="font-body font-bold text-sm mb-1" style={{ color: '#1f2937' }}>{title}</div>
                <p className="font-body text-xs" style={{ color: '#6b7280' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <h3 className="font-heading text-xl mb-4" style={{ color: '#1f2937' }}>What athletes say</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-5" style={{ border: '2px solid #e5e7eb' }}>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400" style={{ color: '#f59e0b' }} />
                ))}
              </div>
              <p className="font-body text-sm mb-4 leading-relaxed" style={{ color: '#374151' }}>"{t.text}"</p>
              <div>
                <div className="font-body font-bold text-sm" style={{ color: '#1f2937' }}>{t.name}</div>
                <div className="font-body text-xs" style={{ color: '#9ca3af' }}>{t.sport}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(253,218,54,0.15) 0%, rgba(81,65,99,0.08) 100%)', border: '2px solid rgba(253,218,54,0.4)' }}
        >
          <div className="font-heading text-2xl mb-2" style={{ color: '#1f2937' }}>Ready to level up your nutrition?</div>
          <p className="font-body text-sm mb-5 max-w-md mx-auto" style={{ color: '#6b7280' }}>
            Book your free intro call today. No commitment, no pressure — just a conversation about your goals.
          </p>
          <button
            className="btn-primary text-base px-8 py-3 inline-flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Book Free Intro Call
          </button>
          <p className="font-body text-xs mt-3" style={{ color: '#9ca3af' }}>15 min · No credit card required · Available in English & Spanish</p>
        </div>
      </div>
    </div>
  );
}
