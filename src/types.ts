
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
  // Backend response fields
  failureProbability?: number; // Confidence score from backend (0-100)
  likelyCause?: string; // From backend's likely_cause
  probabilities?: { [key: string]: number }; // Probabilities for each class
  // Manual entry fields
  location?: string;
  notes?: string;
  isManual?: boolean;
}

export interface HistoryItem extends AnalysisResult {}
