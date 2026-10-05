import { useState } from 'react';
import {
  BookOpen,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Home,
  Apple,
  Sun,
  Moon,
  Globe,
  LayoutGrid,
  Plus,
  Zap,
  Database,
  ChevronDown,
  ChevronRight,
  Fingerprint,
  MapPin,
} from 'lucide-react';
import type { UserRole } from '../../lib/auth';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';

export type AppView =
  | 'planner'
  | 'saved'
  | 'athletes'
  | 'reporting'
  | 'settings'
  | 'nutrition'
  | 'nutrition-dashboard'
  | 'nutrition-recipes'
  | 'nutrition-planner'
  | 'nutrition-menu-templates'
  | 'nutrition-supplements'
  | 'nutrition-food-database'
  | 'passport'
  | 'race-editor';

interface NavItem {
  view: AppView;
  label_es: string;
  label_en: string;
  icon: React.ElementType;
  roles: UserRole[];
  separator?: boolean;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    view: 'nutrition',
    label_es: 'Nutrición',
    label_en: 'Nutrition',
    icon: Apple,
    roles: ['admin', 'coach', 'athlete'],
    children: [
      { view: 'nutrition-dashboard', label_es: 'Dashboard', label_en: 'Dashboard', icon: BarChart2, roles: ['admin', 'coach', 'athlete'] },
      { view: 'nutrition-recipes', label_es: 'Recetas', label_en: 'Recipes', icon: BookOpen, roles: ['admin', 'coach', 'athlete'] },
      { view: 'nutrition-planner', label_es: 'Editor de Comidas', label_en: 'Meal Editor', icon: Plus, roles: ['admin', 'coach', 'athlete'] },
      { view: 'nutrition-menu-templates', label_es: 'Plantillas de Menú', label_en: 'Menu Templates', icon: LayoutGrid, roles: ['admin', 'coach', 'athlete'] },
      { view: 'nutrition-supplements', label_es: 'Suplementos', label_en: 'Supplements', icon: Zap, roles: ['admin', 'coach', 'athlete'] },
      { view: 'nutrition-food-database', label_es: 'Food Database', label_en: 'Food Database', icon: Database, roles: ['admin'] },
    ],
  },
  { view: 'planner', label_es: 'Planificador de Carreras', label_en: 'Race Planner', icon: Home, roles: ['admin', 'coach', 'athlete'], separator: true },
  { view: 'saved', label_es: 'Carreras Guardadas', label_en: 'Saved Races', icon: BookOpen, roles: ['admin', 'coach', 'athlete'] },
  { view: 'race-editor', label_es: 'Editor de Carreras', label_en: 'Race Editor', icon: MapPin, roles: ['admin'] },
  { view: 'athletes', label_es: 'Atletas', label_en: 'Athletes', icon: Users, roles: ['admin', 'coach'] },
  { view: 'passport', label_es: 'Pasaporte Biológico', label_en: 'Biological Passport', icon: Fingerprint, roles: ['admin', 'coach', 'athlete'], separator: true },
  { view: 'reporting', label_es: 'Reportes', label_en: 'Reporting', icon: BarChart2, roles: ['admin', 'coach'] },
  { view: 'settings', label_es: 'Configuración', label_en: 'Settings', icon: Settings, roles: ['admin', 'coach', 'athlete'] },
];

const NUTRITION_VIEWS: AppView[] = [
  'nutrition',
  'nutrition-dashboard',
  'nutrition-recipes',
  'nutrition-planner',
  'nutrition-menu-templates',
  'nutrition-supplements',
  'nutrition-food-database',
];

interface Props {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

export default function Sidebar({ activeView, onNavigate }: Props) {
  const { profile, logout: signOut } = useAuth();
  const { language, theme, setLanguage, toggleTheme } = usePreferences();
  const [expanded, setExpanded] = useState(false);
  const [nutritionOpen, setNutritionOpen] = useState(NUTRITION_VIEWS.includes(activeView));
  const role = profile?.role ?? 'athlete';

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  const initials = (profile?.full_name || profile?.email || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleLabel: Record<UserRole, string> = {
    admin: 'Admin',
    coach: 'Coach',
    athlete: 'Athlete',
  };

  const isDark = theme === 'dark';

  const sidebarBg = isDark ? '#1a1625' : '#ffffff';
  const sidebarBorder = isDark ? '#2d2640' : '#e5e7eb';
  const textMain = isDark ? '#f3f4f6' : '#1f2937';
  const textMuted = isDark ? '#9ca3af' : '#4b5563';

  const isNutritionActive = NUTRITION_VIEWS.includes(activeView);

  const handleNutritionClick = () => {
    if (!expanded) {
      onNavigate('nutrition-dashboard');
      setNutritionOpen(true);
      return;
    }
    if (nutritionOpen) {
      setNutritionOpen(false);
    } else {
      setNutritionOpen(true);
      if (!isNutritionActive) onNavigate('nutrition-dashboard');
    }
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const label = language === 'es' ? item.label_es : item.label_en;

    if (item.children) {
      const isActive = isNutritionActive;
      return (
        <div key={item.view}>
          {item.separator && (
            <div className="my-2 mx-1" style={{ height: '1px', backgroundColor: sidebarBorder }} />
          )}
          <button
            onClick={handleNutritionClick}
            title={!expanded ? label : undefined}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left"
            style={
              isActive
                ? { backgroundColor: '#fdda36', color: '#514163' }
                : { color: textMuted }
            }
            onMouseEnter={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLElement).style.backgroundColor = isDark ? '#2d2640' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '';
            }}
          >
            <Icon
              className="w-5 h-5 flex-shrink-0"
              style={isActive ? { color: '#514163' } : { color: textMuted }}
            />
            <span
              className="font-body font-medium text-sm truncate transition-all duration-300 flex-1"
              style={{
                opacity: expanded ? 1 : 0,
                maxWidth: expanded ? 120 : 0,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#514163' : textMain,
              }}
            >
              {label}
            </span>
            {expanded && (
              <span style={{ color: isActive ? '#514163' : textMuted, flexShrink: 0 }}>
                {nutritionOpen
                  ? <ChevronDown className="w-4 h-4" />
                  : <ChevronRight className="w-4 h-4" />}
              </span>
            )}
          </button>

          {expanded && nutritionOpen && (
            <div className="ml-3 mt-0.5 space-y-0.5">
              {item.children
                .filter((child) => child.roles.includes(role))
                .map((child) => {
                  const ChildIcon = child.icon;
                  const childLabel = language === 'es' ? child.label_es : child.label_en;
                  const childActive = activeView === child.view;
                  return (
                    <button
                      key={child.view}
                      onClick={() => onNavigate(child.view)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
                      style={
                        childActive
                          ? { backgroundColor: '#514163', color: '#fdda36' }
                          : { color: textMuted }
                      }
                      onMouseEnter={(e) => {
                        if (!childActive)
                          (e.currentTarget as HTMLElement).style.backgroundColor = isDark ? '#2d2640' : '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        if (!childActive) (e.currentTarget as HTMLElement).style.backgroundColor = '';
                      }}
                    >
                      <ChildIcon
                        className="w-4 h-4 flex-shrink-0"
                        style={childActive ? { color: '#fdda36' } : { color: textMuted }}
                      />
                      <span
                        className="font-body font-medium text-sm truncate"
                        style={{
                          fontWeight: childActive ? 700 : 500,
                          color: childActive ? '#fdda36' : textMain,
                        }}
                      >
                        {childLabel}
                      </span>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      );
    }

    const active = activeView === item.view;
    return (
      <div key={item.view}>
        {item.separator && (
          <div className="my-2 mx-1" style={{ height: '1px', backgroundColor: sidebarBorder }} />
        )}
        <button
          onClick={() => onNavigate(item.view)}
          title={!expanded ? label : undefined}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left"
          style={
            active
              ? { backgroundColor: '#fdda36', color: '#514163' }
              : { color: textMuted }
          }
          onMouseEnter={(e) => {
            if (!active)
              (e.currentTarget as HTMLElement).style.backgroundColor = isDark ? '#2d2640' : '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = '';
          }}
        >
          <Icon
            className="w-5 h-5 flex-shrink-0"
            style={active ? { color: '#514163' } : { color: textMuted }}
          />
          <span
            className="font-body font-medium text-sm truncate transition-all duration-300"
            style={{
              opacity: expanded ? 1 : 0,
              maxWidth: expanded ? 160 : 0,
              fontWeight: active ? 700 : 500,
              color: active ? '#514163' : textMain,
            }}
          >
            {label}
          </span>
        </button>
      </div>
    );
  };

  return (
    <>
      <aside
        className="fixed top-0 left-0 h-screen z-30 flex flex-col transition-all duration-300"
        style={{
          width: expanded ? 256 : 80,
          backgroundColor: sidebarBg,
          borderRight: `1px solid ${sidebarBorder}`,
          boxShadow: expanded
            ? `2px 0 16px rgba(81,65,99,0.12)`
            : `1px 0 4px rgba(81,65,99,0.06)`,
        }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div
          className="flex items-center justify-center flex-shrink-0 px-4"
          style={{ height: 120, borderBottom: `1px solid ${sidebarBorder}` }}
        >
          {expanded ? (
            <img src="/Logo_transp.png" alt="Asciende" className="w-full h-auto object-contain" />
          ) : (
            <img src="/Asciendefavicon.png" alt="Asciende" className="w-10 h-10" />
          )}
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
          <div className="space-y-1">
            {visibleItems.map((item) => renderNavItem(item))}
          </div>
        </nav>

        <div
          className="px-3 py-3 space-y-1 flex-shrink-0"
          style={{ borderTop: `1px solid ${sidebarBorder}` }}
        >
          <button
            onClick={toggleTheme}
            title={!expanded ? (isDark ? 'Light mode' : 'Dark mode') : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
            style={{ color: textMuted }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = isDark ? '#2d2640' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '';
            }}
          >
            {isDark ? (
              <Sun className="w-5 h-5 flex-shrink-0" style={{ color: '#fdda36' }} />
            ) : (
              <Moon className="w-5 h-5 flex-shrink-0" style={{ color: textMuted }} />
            )}
            <span
              className="font-body font-medium text-sm transition-all duration-300 truncate"
              style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 160 : 0, color: textMain }}
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          <button
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            title={!expanded ? (language === 'es' ? 'Switch to English' : 'Cambiar a Español') : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
            style={{ color: textMuted }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = isDark ? '#2d2640' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '';
            }}
          >
            <Globe className="w-5 h-5 flex-shrink-0" style={{ color: textMuted }} />
            <div
              className="flex items-center gap-2 transition-all duration-300"
              style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 160 : 0, overflow: 'hidden' }}
            >
              <span
                className="font-body font-semibold text-xs px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: language === 'es' ? '#514163' : 'transparent',
                  color: language === 'es' ? '#fdda36' : textMuted,
                }}
              >
                ES
              </span>
              <span className="font-body text-xs" style={{ color: textMuted }}>/</span>
              <span
                className="font-body font-semibold text-xs px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: language === 'en' ? '#514163' : 'transparent',
                  color: language === 'en' ? '#fdda36' : textMuted,
                }}
              >
                EN
              </span>
            </div>
          </button>

          <div style={{ height: '1px', backgroundColor: sidebarBorder, margin: '4px 4px' }} />

          {expanded ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-body font-semibold text-sm flex-shrink-0"
                style={{ backgroundColor: '#fdda36', color: '#514163' }}
              >
                {initials}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="font-body font-semibold text-sm truncate" style={{ color: textMain }}>
                  {profile?.full_name || profile?.email}
                </div>
                <div className="font-body text-xs" style={{ color: textMuted }}>{roleLabel[role]}</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-body font-semibold text-sm"
                style={{ backgroundColor: '#fdda36', color: '#514163' }}
                title={profile?.email}
              >
                {initials}
              </div>
            </div>
          )}

          <button
            onClick={signOut}
            title={!expanded ? 'Sign out' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
            style={{ color: '#ef4444' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = isDark ? '#3b1f1f' : '#fef2f2';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '';
            }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className="font-body font-medium text-sm transition-all duration-300"
              style={{ opacity: expanded ? 1 : 0, maxWidth: expanded ? 160 : 0 }}
            >
              Sign out
            </span>
          </button>
        </div>
      </aside>

      <div style={{ width: 80 }} className="flex-shrink-0" />
    </>
  );
}
