import { useState } from 'react';
import { Trophy, Loader2, Eye, EyeOff, Dumbbell, Users, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import type { UserRole } from '../../lib/auth';

const DEMO_ROLES: {
  role: UserRole;
  label: string;
  desc: string;
  icon: React.ElementType;
  iconColor: string;
  labelColor: string;
  descColor: string;
  bg: string;
  border: string;
  hoverBg: string;
}[] = [
  {
    role: 'athlete',
    label: 'Athlete',
    desc: 'Plan & execute your race',
    icon: Dumbbell,
    iconColor: '#0369a1',
    labelColor: '#0c4a6e',
    descColor: '#374151',
    bg: '#e0f2fe',
    border: '#7dd3fc',
    hoverBg: '#bae6fd',
  },
  {
    role: 'coach',
    label: 'Coach',
    desc: 'Manage athletes & plans',
    icon: Users,
    iconColor: '#15803d',
    labelColor: '#14532d',
    descColor: '#374151',
    bg: '#dcfce7',
    border: '#86efac',
    hoverBg: '#bbf7d0',
  },
  {
    role: 'admin',
    label: 'Admin',
    desc: 'Full platform access',
    icon: ShieldCheck,
    iconColor: '#b45309',
    labelColor: '#78350f',
    descColor: '#374151',
    bg: '#fef3c7',
    border: '#fcd34d',
    hoverBg: '#fde68a',
  },
];

export default function LoginPage() {
  const { signIn, signInAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<UserRole | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) setError(err);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: '#fdda36', boxShadow: '0 4px 16px rgba(253,218,54,0.4)' }}
          >
            <Trophy className="w-7 h-7" style={{ color: '#514163' }} />
          </div>
          <h1 className="font-heading text-2xl tracking-tight" style={{ color: '#514163' }}>Asciende</h1>
          <p className="font-body text-sm mt-1" style={{ color: '#4b5563' }}>Race Planner</p>
        </div>

        {/* Quick access demo section */}
        <div
          className="mb-4 rounded-2xl overflow-hidden"
          style={{ border: '2px solid #d1d5db', backgroundColor: '#ffffff' }}
        >
          <div
            className="flex items-center gap-2 px-5 py-3"
            style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
          >
            <Zap className="w-4 h-4" style={{ color: '#d97706' }} />
            <span className="text-sm font-bold" style={{ color: '#111827' }}>Quick Access</span>
            <span className="text-xs ml-1" style={{ color: '#6b7280' }}>— sin login</span>
          </div>
          <div className="p-3 grid grid-cols-3 gap-2">
            {DEMO_ROLES.map(({ role, label, desc, icon: Icon, iconColor, labelColor, descColor, bg, border, hoverBg }) => (
              <button
                key={role}
                onClick={() => signInAsDemo(role)}
                onMouseEnter={() => setHovered(role)}
                onMouseLeave={() => setHovered(null)}
                className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl border transition-all text-center"
                style={{
                  backgroundColor: hovered === role ? hoverBg : bg,
                  borderColor: border,
                }}
              >
                <Icon className="w-6 h-6" style={{ color: iconColor }} />
                <div>
                  <div className="text-sm font-bold" style={{ color: labelColor }}>{label}</div>
                  <div className="text-xs leading-tight mt-0.5" style={{ color: descColor }}>{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px" style={{ backgroundColor: '#d1d5db' }} />
          <span className="text-xs font-body" style={{ color: '#6b7280' }}>o inicia sesión con tu cuenta</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#d1d5db' }} />
        </div>

        <div
          className="bg-white rounded-2xl p-8"
          style={{ border: '2px solid #e5e7eb', boxShadow: '0 4px 24px rgba(81,65,99,0.08)' }}
        >
          <h2 className="font-heading text-lg mb-1" style={{ color: '#1f2937' }}>Iniciar sesión</h2>
          <p className="font-body text-sm mb-6" style={{ color: '#6b7280' }}>Accedé a tus planes de carrera y datos de atletas</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body font-medium text-sm mb-1.5" style={{ color: '#374151' }}>
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="input-brand"
              />
            </div>

            <div>
              <label className="block font-body font-medium text-sm mb-1.5" style={{ color: '#374151' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-brand pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#9ca3af' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm font-body"
                style={{ color: '#b91c1c', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-body font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#fdda36',
                color: '#3b2a50',
                boxShadow: loading ? 'none' : '0 2px 8px rgba(253,218,54,0.35)',
              }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Iniciando sesión...</>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-xs mt-6" style={{ color: '#9ca3af' }}>
          Asciende Race Planner &middot; Advanced Race Nutrition & Strategy
        </p>
      </div>
    </div>
  );
}
