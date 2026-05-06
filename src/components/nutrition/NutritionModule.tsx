import React, { useState, useEffect } from 'react';
import NutritionDashboard from './NutritionDashboard';
import NutritionAnamnesisV2 from './NutritionAnamnesisV2';
import FullMealEditor from './FullMealEditor';
import FoodDiary24h from './FoodDiary24h';
import DailyDiary from './DailyDiary';
import RecipesView from './RecipesView';
import ShoppingList from './ShoppingList';
import NutritionOneOnOne from './NutritionOneOnOne';
import AdminFoodsView from './AdminFoodsView';
import SupplementsView from './SupplementsView';
import RaceNutritionProtocol from './RaceNutritionProtocol';
import CoachNotes from './CoachNotes';
import MicronutrientSearch from './MicronutrientSearch';
import MenuTemplatesView from './MenuTemplatesView';
import CoachAthleteSelector from './CoachAthleteSelector';
import { useAuth } from '../../lib/auth';

export type NutritionTab =
  | 'dashboard'
  | 'recipes'
  | 'planner'
  | 'templates'
  | 'diary'
  | 'shopping'
  | 'anamnesis'
  | 'one-on-one'
  | 'admin-foods'
  | 'menu-templates'
  | 'deliverables'
  | 'review'
  | 'supplements'
  | 'race-protocol'
  | 'coach-notes'
  | 'micronutrients';


interface Props {
  initialTab?: NutritionTab;
  onTabChange?: (tab: NutritionTab) => void;
}

export default function NutritionModule({ initialTab = 'dashboard', onTabChange }: Props) {
  const { profile } = useAuth();
  const [tab, setTab] = useState<NutritionTab>(initialTab);
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const isAdmin = profile?.role === 'admin';
  const isCoach = profile?.role === 'coach';

  useEffect(() => {
    if (initialTab && initialTab !== tab) {
      setTab(initialTab);
    }
  }, [initialTab]);

  const handleSetTab = (newTab: NutritionTab) => {
    setTab(newTab);
    onTabChange?.(newTab);
  };

  const renderTab = () => {
    switch (tab) {
      case 'dashboard':
        return (
          <NutritionDashboard
            onNavigate={(t) => {
              if (t === 'diary') { setShowDiaryModal(true); return; }
              handleSetTab(t);
            }}
          />
        );
      case 'recipes': return <RecipesView onBack={() => handleSetTab('dashboard')} isAdmin={isAdmin} />;
      case 'planner': return isCoach || isAdmin
        ? <CoachAthleteSelector onBack={() => handleSetTab('dashboard')} />
        : <FullMealEditor onBack={() => handleSetTab('dashboard')} />;
      case 'diary': return <DailyDiary onBack={() => handleSetTab('dashboard')} />;
      case 'shopping': return <ShoppingList onBack={() => handleSetTab('dashboard')} />;
      case 'anamnesis': return <NutritionAnamnesisV2 onBack={() => handleSetTab('dashboard')} />;
      case 'one-on-one': return <NutritionOneOnOne onBack={() => handleSetTab('dashboard')} />;
      case 'admin-foods': return <AdminFoodsView onBack={() => handleSetTab('dashboard')} />;
      case 'supplements': return <SupplementsView onBack={() => handleSetTab('dashboard')} />;
      case 'race-protocol': return <RaceNutritionProtocol onBack={() => handleSetTab('dashboard')} />;
      case 'coach-notes': return <CoachNotes onBack={() => handleSetTab('dashboard')} />;
      case 'micronutrients': return <MicronutrientSearch onBack={() => handleSetTab('dashboard')} />;
      case 'menu-templates': return <MenuTemplatesView onBack={() => handleSetTab('dashboard')} />;
      default: return <NutritionDashboard onNavigate={handleSetTab} />;
    }
  };

  return (
    <div className="flex flex-col min-h-full">

      <div className="flex-1">
        {renderTab()}
      </div>

      {showDiaryModal && (
        <FoodDiary24h onClose={() => setShowDiaryModal(false)} />
      )}
    </div>
  );
}
