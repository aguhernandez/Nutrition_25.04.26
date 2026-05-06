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

export interface EditablePlan {
  segments: EditableSegment[];
  recommendations: EditableRecommendations;
}
