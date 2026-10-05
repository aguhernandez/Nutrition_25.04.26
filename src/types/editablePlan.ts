export interface EditableSegment {
  timeMin: number;
  distanceKm: number;
  choG: number;
  fluidMl: number;
  sodiumMg: number;
  caffeineNote: string;
}

export interface EditableRecommendations {
  pacingNote: string;
  carbsNote: string;
  hydrationNote: string;
  caffeineNote: string;
  generalNotes: string;
}

export interface RaceExecutionItem {
  id: string;
  timeMin: number;
  distanceLabel: string;
  title: string;
  quantity: number;
  calories: number;
  carbsG: number;
  sodiumMg: number;
  liquidMl: number;
}

export interface EditablePlan {
  segments: EditableSegment[];
  executionItems?: RaceExecutionItem[];
  recommendations: EditableRecommendations;
}
