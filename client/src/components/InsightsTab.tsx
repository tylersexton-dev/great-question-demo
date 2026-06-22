import { Insight } from '../types';
import { Badge } from './Badge';

interface Props {
  insights: Insight[];
}

export function InsightsTab({ insights }: Props) {
  const sorted = [...insights].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.impact] - order[b.impact];
  });

  return (
    <div className="space-y-4 animate-slide-up">
      {sorted.map((insight, i) => (
        <InsightCard key={i} insight={insight} index={i} />
      ))}
    </div>
  );
}

function InsightCard({ insight, index }: { insight: Insight; index: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {index + 1}
            </span>
            <h3 className="text-sm font-semibold text-slate-800 leading-snug">{insight.title}</h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge label={`${insight.impact} impact`} variant={insight.impact} />
            <Badge label={`${insight.confidence} confidence`} variant={insight.confidence} />
          </div>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{insight.description}</p>
        {insight.evidenceQuotes.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evidence</p>
            {insight.evidenceQuotes.map((q, i) => (
              <blockquote key={i} className="border-l-2 border-brand-300 pl-3 text-sm text-slate-600 italic">
                "{q}"
              </blockquote>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
