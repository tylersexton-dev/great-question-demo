export interface Transcript {
  id: string;
  filename: string;
  content: string;
  uploadedAt: string;
  participantName?: string;
  projectName?: string;
  analyzed: boolean;
  wordCount: number;
}

export interface Insight {
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  evidenceQuotes: string[];
}

export interface Theme {
  name: string;
  description: string;
  frequency: number;
  representativeQuotes: string[];
}

export interface Quote {
  text: string;
  speaker: string;
  significance: 'high' | 'medium' | 'low';
  theme?: string;
  context: string;
}

export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

export interface SentimentMoment {
  text: string;
  sentiment: string;
  significance: string;
}

export interface Sentiment {
  overall: 'positive' | 'neutral' | 'negative' | 'mixed';
  score: number;
  breakdown: SentimentBreakdown;
  emotionalArc: string;
  keyMoments: SentimentMoment[];
}

export interface AnalysisResult {
  transcriptId: string;
  executiveSummary: string;
  insights: Insight[];
  themes: Theme[];
  quotes: Quote[];
  sentiment: Sentiment;
  analyzedAt: string;
  modelUsed: string;
}
