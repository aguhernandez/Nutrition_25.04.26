import {
  BookOpen,
  Users,
  BarChart2,
  Settings,
  Home,
  MoreHorizontal,
  LogOut,
  Apple,
  Fingerprint,
} from 'lucide-react';
import { useState } from 'react';
import type { AppView } from './Sidebar';
import type { UserRole } from '../../lib/auth';
import { useAuth } from '../../lib/auth';
import { usePreferences } from '../../lib/preferences';

interface NavItem {
  view: AppView;
  label_es: string;
  label_en: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { view: 'nutrition-dashboard', label_es: 'Nutrición', label_en: 'Nutrition', icon: Apple, roles: ['admin', 'coach', 'athlete'] },
  { view: 'planner', label_es: 'Planificador', label_en: 'Planner', icon: Home, roles: ['admin', 'coach', 'athlete'] },
  { view: 'saved', label_es: 'Guardadas', label_en: 'Saved', icon: BookOpen, roles: ['admin', 'coach', 'athlete'] },
  { view: 'passport', label_es: 'Pasaporte', label_en: 'Passport', icon: Fingerprint, roles: ['admin', 'coach', 'athlete'] },
  { view: 'athletes', label_es: 'Atletas', label_en: 'Athletes', icon: Users, roles: ['admin', 'coach'] },
  { view: 'reporting', label_es: 'Reportes', label_en: 'Reports', icon: BarChart2, roles: ['admin', 'coach'] },
  { view: 'settings', label_es: 'Config.', label_en: 'Settings', icon: Settings, roles: ['admin', 'coach', 'athlete'] },
];

interface Props {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

const NUTRITION_VIEWS: AppView[] = [
  'nutrition',
  'nutrition-dashboard',
  'nutrition-recipes',
  'nutrition-planner',
  'nutrition-menu-templates',
  'nutrition-supplements',
  'nutrition-food-database',
];

export default function MobileNav({ activeView, onNavigate }: Props) {
  const { profile, logout: signOut } = useAuth();
  const { language } = usePreferences();
  const [moreOpen, setMoreOpen] = useState(false);
  const role = profile?.role ?? 'athlete';
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const primaryItems = visibleItems.slice(0, 4);
  const extraItems = visibleItems.slice(4);

  const isItemActive = (itemView: AppView) => {
    if (itemView === 'nutrition-dashboard') return NUTRITION_VIEWS.includes(activeView);
    return activeView === itemView;
  };

  const handleNav = (view: AppView) => {
    setMoreOpen(false);
    onNavigate(view);
  };

  return (
    <>
      {moreOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {moreOpen && (
        <div
          className="fixed bottom-20 left-0 right-0 z-50 bg-white border-t border-[#e5e7eb] animate-slide-up"
          style={{ boxShadow: '0 -4px 16px rgba(81,65,99,0.08)' }}
        >
          <div className="max-h-[60vh] overflow-y-auto py-2">
            {extraItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.view);
              const label = language === 'es' ? item.label_es : item.label_en;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNav(item.view)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors"
                  style={active ? { backgroundColor: '#fdda36', color: '#514163' } : { color: '#4b5563' }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-body font-medium text-sm">{label}</span>
                </button>
              );
            })}
            <div className="border-t border-[#e5e7eb] mt-2 pt-2">
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-5 py-3 text-left"
                style={{ color: '#ef4444' }}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className="font-body font-medium text-sm">
                  {language === 'es' ? 'Cerrar sesión' : 'Sign out'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#e5e7eb] flex items-center justify-around"
        style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))', boxShadow: '0 -1px 8px rgba(81,65,99,0.06)' }}
      >
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.view);
          const label = language === 'es' ? item.label_es : item.label_en;
          return (
            <button
              key={item.view}
              onClick={() => handleNav(item.view)}
              className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl transition-all duration-200 min-w-[64px]"
              style={active ? { backgroundColor: '#fdda36', color: '#514163' } : { color: '#4b5563' }}
            >
              <Icon className="w-6 h-6" />
              <span className="font-body font-medium text-xs">{label}</span>
            </button>
          );
        })}

        {extraItems.length > 0 && (
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl transition-all duration-200 min-w-[64px]"
            style={moreOpen ? { backgroundColor: '#fdda36', color: '#514163' } : { color: '#4b5563' }}
          >
            <MoreHorizontal className="w-6 h-6" />
            <span className="font-body font-medium text-xs">
              {language === 'es' ? 'Más' : 'More'}
            </span>
          </button>
        )}
      </nav>
    </>
  );
}
