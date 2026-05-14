import { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { PreferencesProvider, usePreferences } from './lib/preferences';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import MobileHeader from './components/layout/MobileHeader';
import type { AppView } from './components/layout/Sidebar';
import RacePlannerView from './components/race-planner/RacePlanner';
import SavedRacesView from './components/race-planner/SavedRaces';
import type { Competition } from './types/race';
import AthletesView from './components/views/AthletesView';
import ReportingView from './components/views/ReportingView';
import SettingsView from './components/views/SettingsView';
import NutritionModule from './components/nutrition/NutritionModule';
import type { NutritionTab } from './components/nutrition/NutritionModule';
import LocalDevMode from './components/auth/LocalDevMode';
import NutritionLanding from './components/auth/NutritionLanding';
import LoginModal from './components/auth/LoginModal';
import { Loader2 } from 'lucide-react';

const VIEW_TITLES_ES: Record<AppView, string> = {
  planner: 'Planificador',
  saved: 'Carreras Guardadas',
  athletes: 'Atletas',
  reporting: 'Reportes',
  settings: 'Configuración',
  nutrition: 'Nutrición',
  'nutrition-dashboard': 'Dashboard',
  'nutrition-recipes': 'Recetas',
  'nutrition-planner': 'Editor de Comidas',
  'nutrition-menu-templates': 'Plantillas de Menú',
  'nutrition-supplements': 'Suplementos',
};

const VIEW_TITLES_EN: Record<AppView, string> = {
  planner: 'Race Planner',
  saved: 'Saved Races',
  athletes: 'Athletes',
  reporting: 'Reporting',
  settings: 'Settings',
  nutrition: 'Nutrition',
  'nutrition-dashboard': 'Dashboard',
  'nutrition-recipes': 'Recipes',
  'nutrition-planner': 'Meal Editor',
  'nutrition-menu-templates': 'Menu Templates',
  'nutrition-supplements': 'Supplements',
};

const VIEW_TO_TAB: Partial<Record<AppView, NutritionTab>> = {
  'nutrition': 'dashboard',
  'nutrition-dashboard': 'dashboard',
  'nutrition-recipes': 'recipes',
  'nutrition-planner': 'planner',
  'nutrition-menu-templates': 'menu-templates',
  'nutrition-supplements': 'supplements',
};

const NUTRITION_VIEWS: AppView[] = [
  'nutrition',
  'nutrition-dashboard',
  'nutrition-recipes',
  'nutrition-planner',
  'nutrition-menu-templates',
  'nutrition-supplements',
];

function AppShell() {
  const { user, profile, loading, hasToken, isDevMode, authError, login, setDevProfile } = useAuth();
  const { theme, language } = usePreferences();
  const isDark = theme === 'dark';
  const VIEW_TITLES = language === 'es' ? VIEW_TITLES_ES : VIEW_TITLES_EN;
  const [activeView, setActiveView] = useState<AppView>('nutrition-dashboard');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isDevMode && !profile) {
    return <LocalDevMode onProfileSelected={setDevProfile} />;
  }

  if (!user && !hasToken && !isDevMode) {
    return (
      <>
        <NutritionLanding onLogin={() => setLoginModalOpen(true)} />
        <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      </>
    );
  }

  if (user && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Creating your profile...</h2>
          <p className="text-gray-500 text-sm">Setting up your account for the first time.</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const role = profile.role;

  const guardedView = (): AppView => {
    if (activeView === 'athletes' && role === 'athlete') return 'nutrition-dashboard';
    if (activeView === 'reporting' && role === 'athlete') return 'nutrition-dashboard';
    return activeView;
  };

  const view = guardedView();
  const isNutritionView = NUTRITION_VIEWS.includes(view);
  const nutritionTab = VIEW_TO_TAB[view] ?? 'dashboard';

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: isDark ? '#150f23' : '#f9fafb' }}>
      <div className="hidden lg:flex">
        <Sidebar activeView={view} onNavigate={(v) => { if (v === 'planner') setEditingCompetition(null); setActiveView(v); }} />
      </div>

      <MobileHeader title={VIEW_TITLES[view]} />

      <main className="flex-1 min-w-0 pt-20 pb-24 lg:pt-0 lg:pb-0">
        {view === 'planner' && (
          <RacePlannerView
            key={editingCompetition?.id ?? 'new'}
            initialCompetition={editingCompetition ?? undefined}
            onBackToSaved={editingCompetition ? () => { setEditingCompetition(null); setActiveView('saved'); } : undefined}
          />
        )}

        {view === 'saved' && (
          <SavedRacesView
            onBack={() => setActiveView('planner')}
            onEdit={(comp) => { setEditingCompetition(comp); setActiveView('planner'); }}
          />
        )}
        {isNutritionView && (
          <NutritionModule
            initialTab={nutritionTab}
            onTabChange={(tab) => {
              const viewMap: Partial<Record<NutritionTab, AppView>> = {
                dashboard: 'nutrition-dashboard',
                recipes: 'nutrition-recipes',
                planner: 'nutrition-planner',
                'menu-templates': 'nutrition-menu-templates',
                supplements: 'nutrition-supplements',
              };
              if (viewMap[tab]) setActiveView(viewMap[tab]!);
            }}
          />
        )}
        {view === 'athletes' && <AthletesView />}
        {view === 'reporting' && <ReportingView />}
        {view === 'settings' && <SettingsView />}
      </main>

      <div className="lg:hidden">
        <MobileNav activeView={view} onNavigate={(v) => { if (v === 'planner') setEditingCompetition(null); setActiveView(v); }} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </PreferencesProvider>
  );
}
