import { AnalysisResult } from '../types';

interface Props {
  result: AnalysisResult;
}

export function SummaryTab({ result }: Props) {
  const { sentiment } = result;

  const sentimentColor = {
    positive: 'text-emerald-600 bg-emerald-50 ring-emerald-200',
    negative: 'text-red-600 bg-red-50 ring-red-200',
    neutral: 'text-slate-600 bg-slate-50 ring-slate-200',
    mixed: 'text-violet-600 bg-violet-50 ring-violet-200',
  }[sentiment.overall];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-sm font-semibold text-brand-800 uppercase tracking-wider">Executive Summary</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded ring-1 ring-inset ${sentimentColor}`}>
            {sentiment.overall} sentiment
          </span>
        </div>
        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {result.executiveSummary}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Insights" value={result.insights.length} icon="💡" />
        <StatCard label="Themes" value={result.themes.length} icon="🔗" />
        <StatCard label="Key Quotes" value={result.quotes.filter(q => q.significance === 'high').length} icon="💬" />
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Emotional Arc</h3>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-700 leading-relaxed">{sentiment.emotionalArc}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sentiment Breakdown</h3>
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <SentimentBar label="Positive" value={sentiment.breakdown.positive} color="bg-emerald-400" />
          <SentimentBar label="Neutral" value={sentiment.breakdown.neutral} color="bg-slate-300" />
          <SentimentBar label="Negative" value={sentiment.breakdown.negative} color="bg-red-400" />
        </div>
      </div>

      <div className="text-right text-xs text-slate-400">
        Analyzed with {result.modelUsed} · {new Date(result.analyzedAt).toLocaleString()}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

function SentimentBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-14 shrink-0">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium text-slate-600 w-10 text-right">{Math.round(value)}%</span>
    </div>
  );
}
