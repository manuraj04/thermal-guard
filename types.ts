
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface AnalysisResult {
  id: string;
  timestamp: string; // ISO string
  risk: RiskLevel;
  estimatedTemperature?: number;
  hotspotRegion?: string;
  suggestion?: string;
  imageUrl?: string | null;
  panelName?: string;
  // Manual entry fields
  location?: string;
  notes?: string;
  isManual?: boolean;
}

export interface HistoryItem extends AnalysisResult {}
