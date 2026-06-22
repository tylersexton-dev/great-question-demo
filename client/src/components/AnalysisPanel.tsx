import { useState } from 'react';
import { AnalysisResult } from '../types';
import { SummaryTab } from './SummaryTab';
import { InsightsTab } from './InsightsTab';
import { ThemesTab } from './ThemesTab';
import { QuotesTab } from './QuotesTab';
import { SentimentTab } from './SentimentTab';

type Tab = 'summary' | 'insights' | 'themes' | 'quotes' | 'sentiment';

const TABS: { id: Tab; label: string }[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'insights', label: 'Insights' },
  { id: 'themes', label: 'Themes' },
  { id: 'quotes', label: 'Quotes' },
  { id: 'sentiment', label: 'Sentiment' },
];

interface Props {
  result: AnalysisResult;
}

export function AnalysisPanel({ result }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  return (
    <div className="animate-fade-in">
      <nav className="flex gap-1 border-b border-slate-200 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors
              ${activeTab === tab.id
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
          >
            {tab.label}
            {tab.id === 'insights' && (
              <span className="ml-1.5 text-xs bg-brand-100 text-brand-600 rounded px-1.5 py-0.5">
                {result.insights.length}
              </span>
            )}
            {tab.id === 'themes' && (
              <span className="ml-1.5 text-xs bg-violet-100 text-violet-600 rounded px-1.5 py-0.5">
                {result.themes.length}
              </span>
            )}
            {tab.id === 'quotes' && (
              <span className="ml-1.5 text-xs bg-emerald-100 text-emerald-600 rounded px-1.5 py-0.5">
                {result.quotes.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {activeTab === 'summary' && <SummaryTab result={result} />}
      {activeTab === 'insights' && <InsightsTab insights={result.insights} />}
      {activeTab === 'themes' && <ThemesTab themes={result.themes} />}
      {activeTab === 'quotes' && <QuotesTab quotes={result.quotes} />}
      {activeTab === 'sentiment' && <SentimentTab sentiment={result.sentiment} />}
    </div>
  );
}
