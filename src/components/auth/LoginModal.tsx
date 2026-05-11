import { useState, useEffect, useRef } from 'react';
import { X, LogIn, Eye, EyeOff, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const HUB_REGISTER_URL = 'https://hub.asciende.pro';

const copy = {
  title: { es: 'Bienvenido a Asciende', en: 'Welcome to Asciende' },
  subtitle: {
    es: 'Inicia sesión con tu cuenta del Hub para continuar.',
    en: 'Sign in with your Hub account to continue.',
  },
  email: { es: 'Correo electrónico', en: 'Email address' },
  password: { es: 'Contraseña', en: 'Password' },
  submit: { es: 'Iniciar Sesión', en: 'Sign In' },
  submitting: { es: 'Ingresando...', en: 'Signing in...' },
  noAccount: { es: '¿No tienes cuenta?', en: "Don't have an account?" },
  register: { es: 'Registrarse en el Hub', en: 'Register on the Hub' },
  errorGeneric: { es: 'Credenciales incorrectas. Intentá de nuevo.', en: 'Invalid credentials. Please try again.' },
};

function t(entry: { es: string; en: string }, lang: string) {
  return lang === 'en' ? entry.en : entry.es;
}

function LoginModal({ isOpen, onClose }: Props) {
  const { loginWithCredentials } = useAuth();
  const { language } = usePreferences();
  const lang = language ?? 'es';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError(null);
      setLoading(false);
      setTimeout(() => emailRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);

    const result = await loginWithCredentials(email.trim(), password);

    if (result.success) {
      onClose();
    } else {
      setError(result.error ?? t(copy.errorGeneric, lang));
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* header gradient strip */}
        <div
          className="h-1 w-full"
          style={{ background: 'linear-gradient(90deg, #f59e0b, #d97706)' }}
        />

        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-8 pt-8 pb-10">
          {/* logo */}
          <div className="flex justify-center mb-6">
            <img src="/Logo_transp.png" alt="Asciende" className="h-10 w-auto" />
          </div>

          <h2 className="text-xl font-bold text-white text-center mb-1">
            {t(copy.title, lang)}
          </h2>
          <p className="text-sm text-center mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {t(copy.subtitle, lang)}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold mb-1.5 tracking-wide"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                {t(copy.email, lang)}
              </label>
              <input
                ref={emailRef}
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.6)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                disabled={loading}
              />
            </div>

            {/* password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold mb-1.5 tracking-wide"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                {t(copy.password, lang)}
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm text-white outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.6)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}
              >
                {error}
              </div>
            )}

            {/* submit */}
            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200"
              style={{
                backgroundColor: loading || !email.trim() || !password ? 'rgba(245,158,11,0.4)' : '#f59e0b',
                color: '#000',
                cursor: loading || !email.trim() || !password ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => {
                if (!loading && email.trim() && password)
                  e.currentTarget.style.backgroundColor = '#d97706';
              }}
              onMouseLeave={e => {
                if (!loading && email.trim() && password)
                  e.currentTarget.style.backgroundColor = '#f59e0b';
              }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />{t(copy.submitting, lang)}</>
                : <><LogIn className="w-4 h-4" />{t(copy.submit, lang)}</>
              }
            </button>
          </form>

          {/* register link */}
          <div className="mt-6 text-center">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {t(copy.noAccount, lang)}{' '}
            </span>
            <a
              href={HUB_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold transition-colors"
              style={{ color: '#f59e0b' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fbbf24')}
              onMouseLeave={e => (e.currentTarget.style.color = '#f59e0b')}
            >
              {t(copy.register, lang)}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
