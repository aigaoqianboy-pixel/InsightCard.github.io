
export interface InsightStage {
  label: string;
  description: string;
  icon: string;
}

export interface InsightCardData {
  title: string;
  subtitle: string;
  coreInsight: string;
  structureType: 'process' | 'comparison' | 'concept';
  stages: InsightStage[];
  transformation: {
    before: string;
    after: string;
  };
  wisdomQuote: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface GeneratorState {
  isLoading: boolean;
  error: string | null;
  data: InsightCardData | null;
}
