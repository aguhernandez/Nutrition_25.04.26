import { useState } from 'react';
import { Settings, User, Shield, Check, Eye, EyeOff, Sun, Moon, Globe, KeyRound, Save } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';

const roleBadge: Record<string, { label: string; bg: string; color: string }> = {
  admin: { label: 'Admin', bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
  coach: { label: 'Coach', bg: 'rgba(59,130,246,0.12)', color: '#2563eb' },
  athlete: { label: 'Athlete', bg: 'rgba(16,185,129,0.12)', color: '#059669' },
};

export default function SettingsView() {
  const { profile } = useAuth();
  const { language, theme, setLanguage, toggleTheme } = usePreferences();
  const badge = roleBadge[profile?.role ?? 'athlete'];
  const isDark = theme === 'dark';

  const PLANNER_TOKEN_KEY = 'hub_planner_token';
  const [plannerToken, setPlannerToken] = useState(localStorage.getItem(PLANNER_TOKEN_KEY) ?? '');
  const [plannerTokenVisible, setPlannerTokenVisible] = useState(false);
  const [plannerTokenSaved, setPlannerTokenSaved] = useState(false);

  const storedPlannerToken = localStorage.getItem(PLANNER_TOKEN_KEY) ?? null;
  const maskedPlannerToken = storedPlannerToken
    ? 'planne' + '•'.repeat(11) + storedPlannerToken.slice(-4)
    : null;

  const handleSavePlannerToken = () => {
    if (!plannerToken.trim()) return;
    localStorage.setItem(PLANNER_TOKEN_KEY, plannerToken.trim());
    setPlannerTokenSaved(true);
    setTimeout(() => setPlannerTokenSaved(false), 2000);
  };

  const cardStyle = {
    backgroundColor: isDark ? '#1e1a2e' : '#ffffff',
    border: `2px solid ${isDark ? '#2d2640' : '#e5e7eb'}`,
    boxShadow: isDark
      ? '0 2px 8px rgba(0,0,0,0.3)'
      : '0 2px 8px rgba(81,65,99,0.06)',
  };

  const labelColor = isDark ? '#9ca3af' : '#9ca3af';
  const valueColor = isDark ? '#f3f4f6' : '#1f2937';
  const headingColor = isDark ? '#f3f4f6' : '#1f2937';
  const dividerColor = isDark ? '#2d2640' : '#f3f4f6';
  const sectionIconBg = isDark ? 'rgba(253,218,54,0.15)' : 'rgba(253,218,54,0.2)';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2
        className="font-heading text-xl mb-6"
        style={{ color: headingColor }}
      >
        {language === 'es' ? 'Configuración' : 'Settings'}
      </h2>

      {/* Profile */}
      <div className="rounded-2xl p-6 mb-4" style={cardStyle}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: sectionIconBg }}>
            <User className="w-4 h-4" style={{ color: '#514163' }} />
          </div>
          <h3 className="font-body font-semibold" style={{ color: headingColor }}>
            {language === 'es' ? 'Perfil' : 'Profile'}
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${dividerColor}` }}>
            <span className="font-body text-sm" style={{ color: labelColor }}>
              {language === 'es' ? 'Nombre' : 'Name'}
            </span>
            <span className="font-body font-medium text-sm" style={{ color: valueColor }}>
              {profile?.full_name || '—'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${dividerColor}` }}>
            <span className="font-body text-sm" style={{ color: labelColor }}>Email</span>
            <span className="font-body font-medium text-sm" style={{ color: valueColor }}>{profile?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="font-body text-sm" style={{ color: labelColor }}>
              {language === 'es' ? 'Rol' : 'Role'}
            </span>
            <span
              className="font-body font-semibold text-xs px-3 py-1 rounded-full"
              style={{ backgroundColor: badge.bg, color: badge.color }}
            >
              {badge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl p-6 mb-4" style={cardStyle}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: sectionIconBg }}>
            <Sun className="w-4 h-4" style={{ color: '#514163' }} />
          </div>
          <h3 className="font-body font-semibold" style={{ color: headingColor }}>
            {language === 'es' ? 'Apariencia' : 'Appearance'}
          </h3>
        </div>

        {/* Theme */}
        <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${dividerColor}` }}>
          <div>
            <p className="font-body font-medium text-sm" style={{ color: valueColor }}>
              {language === 'es' ? 'Tema' : 'Theme'}
            </p>
            <p className="font-body text-xs mt-0.5" style={{ color: labelColor }}>
              {isDark
                ? (language === 'es' ? 'Modo oscuro activo' : 'Dark mode active')
                : (language === 'es' ? 'Modo claro activo' : 'Light mode active')}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-body font-semibold text-sm transition-all"
            style={{
              backgroundColor: isDark ? '#fdda36' : '#514163',
              color: isDark ? '#514163' : '#fdda36',
            }}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark
              ? (language === 'es' ? 'Claro' : 'Light')
              : (language === 'es' ? 'Oscuro' : 'Dark')}
          </button>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-body font-medium text-sm" style={{ color: valueColor }}>
              {language === 'es' ? 'Idioma' : 'Language'}
            </p>
            <p className="font-body text-xs mt-0.5" style={{ color: labelColor }}>
              {language === 'es' ? 'Español activo' : 'English active'}
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: isDark ? '#2d2640' : '#f3f4f6' }}>
            <button
              onClick={() => setLanguage('es')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body font-semibold text-sm transition-all"
              style={{
                backgroundColor: language === 'es' ? '#514163' : 'transparent',
                color: language === 'es' ? '#fdda36' : labelColor,
              }}
            >
              <Globe className="w-3.5 h-3.5" />
              ES
            </button>
            <button
              onClick={() => setLanguage('en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body font-semibold text-sm transition-all"
              style={{
                backgroundColor: language === 'en' ? '#514163' : 'transparent',
                color: language === 'en' ? '#fdda36' : labelColor,
              }}
            >
              <Globe className="w-3.5 h-3.5" />
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Hub Planner Token — admin only */}
      {profile?.role === 'admin' && (
        <div
          className="rounded-2xl p-6 mb-4"
          style={{
            backgroundColor: isDark ? '#1e1a2e' : '#fffdf0',
            border: `2px solid ${isDark ? '#3d3310' : '#fde68a'}`,
            boxShadow: isDark
              ? '0 2px 8px rgba(0,0,0,0.3)'
              : '0 2px 8px rgba(253,218,54,0.12)',
          }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: isDark ? 'rgba(253,218,54,0.2)' : 'rgba(253,218,54,0.35)' }}
            >
              <KeyRound className="w-4 h-4" style={{ color: '#b45309' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-body font-semibold" style={{ color: headingColor }}>
                  Hub Planner Token
                </h3>
                <span
                  className="font-body font-bold text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(253,218,54,0.3)', color: '#92400e' }}
                >
                  ADMIN ONLY
                </span>
              </div>
              <p className="font-body text-xs mt-0.5" style={{ color: labelColor }}>
                {language === 'es'
                  ? 'Token de tipo "endurance" emitido por el Hub (X-Planner-Token)'
                  : '"endurance" type token issued by the Hub (X-Planner-Token)'}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-body text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: labelColor }}>
              {language === 'es' ? 'Valor del Token' : 'Token Value'}
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={plannerTokenVisible ? 'text' : 'password'}
                  value={plannerToken}
                  onChange={e => setPlannerToken(e.target.value)}
                  placeholder={language === 'es' ? 'Pegar token aquí...' : 'Paste token here...'}
                  className="w-full font-mono text-sm px-4 py-3 rounded-xl pr-12 outline-none transition-all"
                  style={{
                    backgroundColor: isDark ? '#0f0d1a' : '#ffffff',
                    border: `1px solid ${isDark ? '#3d3650' : '#d1d5db'}`,
                    color: isDark ? '#f3f4f6' : '#1f2937',
                  }}
                  onKeyDown={e => { if (e.key === 'Enter') handleSavePlannerToken(); }}
                />
                <button
                  onClick={() => setPlannerTokenVisible(!plannerTokenVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                  style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
                >
                  {plannerTokenVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={handleSavePlannerToken}
                disabled={!plannerToken.trim()}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-body font-semibold text-sm transition-all disabled:opacity-40"
                style={{
                  backgroundColor: plannerTokenSaved ? '#15803d' : (isDark ? '#2d2640' : '#f3f4f6'),
                  color: plannerTokenSaved ? '#ffffff' : (isDark ? '#d1d5db' : '#374151'),
                  border: `1px solid ${plannerTokenSaved ? '#15803d' : (isDark ? '#3d3650' : '#e5e7eb')}`,
                }}
              >
                {plannerTokenSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {plannerTokenSaved
                  ? (language === 'es' ? 'Guardado' : 'Saved')
                  : (language === 'es' ? 'Guardar' : 'Save')}
              </button>
            </div>

            {maskedPlannerToken && (
              <p className="font-mono text-xs mt-2" style={{ color: labelColor }}>
                {language === 'es' ? 'Actual:' : 'Current:'}{' '}
                <span style={{ color: isDark ? '#86efac' : '#15803d' }}>{maskedPlannerToken}</span>
              </p>
            )}

            <p className="font-body text-xs mt-3" style={{ color: labelColor }}>
              {language === 'es'
                ? 'Este token se usa en todas las llamadas a planner-hub-api/* como header X-Planner-Token. Pedilo al Hub (tipo: "endurance").'
                : 'This token is used in all calls to planner-hub-api/* as the X-Planner-Token header. Request it from the Hub (type: "endurance").'}
            </p>
          </div>
        </div>
      )}

      {/* Access & Permissions */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: sectionIconBg }}>
            <Shield className="w-4 h-4" style={{ color: '#514163' }} />
          </div>
          <h3 className="font-body font-semibold" style={{ color: headingColor }}>
            {language === 'es' ? 'Acceso y Permisos' : 'Access & Permissions'}
          </h3>
        </div>
        <p className="font-body text-sm leading-relaxed" style={{ color: labelColor }}>
          {profile?.role === 'admin' && (language === 'es'
            ? 'Tienes acceso de administrador completo a todas las funciones, atletas y datos de la plataforma.'
            : 'You have full admin access to all platform features, athletes, and data.')}
          {profile?.role === 'coach' && (language === 'es'
            ? 'Puedes crear y gestionar planes de carrera para tus atletas y ver reportes agregados.'
            : 'You can create and manage race plans for your athletes and view aggregated reports.')}
          {profile?.role === 'athlete' && (language === 'es'
            ? 'Puedes crear y guardar tus propios planes de carrera y ver tu historial de competencias.'
            : 'You can create and save your own race plans and view your competition history.')}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Settings className="w-3.5 h-3.5" style={{ color: labelColor }} />
        <span className="font-body text-xs" style={{ color: labelColor }}>
          {language === 'es' ? 'Más configuraciones próximamente' : 'More settings coming soon'}
        </span>
      </div>
    </div>
  );
}
