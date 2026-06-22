import { Sentiment } from '../types';
import { Badge } from './Badge';

interface Props {
  sentiment: Sentiment;
}

export function SentimentTab({ sentiment }: Props) {
  const scoreColor =
    sentiment.score >= 0.3 ? 'text-emerald-600' :
    sentiment.score <= -0.3 ? 'text-red-600' :
    'text-slate-600';

  const scorePct = ((sentiment.score + 1) / 2) * 100;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Overall Sentiment</h3>
          <Badge label={sentiment.overall} variant={sentiment.overall} />
        </div>
        <div className="flex items-end gap-3 mb-4">
          <span className={`text-4xl font-bold tabular-nums ${scoreColor}`}>
            {sentiment.score >= 0 ? '+' : ''}{sentiment.score.toFixed(2)}
          </span>
          <span className="text-sm text-slate-400 mb-1">/ 1.00</span>
        </div>
        <div className="relative h-3 bg-gradient-to-r from-red-200 via-slate-200 to-emerald-200 rounded-full overflow-visible">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-brand-500 shadow transition-all duration-500"
            style={{ left: `calc(${scorePct}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Breakdown</h3>
        <div className="flex gap-3 h-28">
          <BarSegment label="Positive" value={sentiment.breakdown.positive} color="bg-emerald-400" />
          <BarSegment label="Neutral" value={sentiment.breakdown.neutral} color="bg-slate-300" />
          <BarSegment label="Negative" value={sentiment.breakdown.negative} color="bg-red-400" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Emotional Arc</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{sentiment.emotionalArc}</p>
      </div>

      {sentiment.keyMoments.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Emotional Moments</h3>
          <div className="space-y-3">
            {sentiment.keyMoments.map((m, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                <blockquote className="font-serif text-sm text-slate-700 italic mb-2">"{m.text}"</blockquote>
                <div className="flex items-start gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ring-1 ring-inset
                    ${m.sentiment === 'positive' ? 'text-emerald-700 bg-emerald-50 ring-emerald-200' :
                      m.sentiment === 'negative' ? 'text-red-700 bg-red-50 ring-red-200' :
                      'text-slate-600 bg-slate-50 ring-slate-200'}`}>
                    {m.sentiment}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.significance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BarSegment({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="w-full flex-1 bg-slate-100 rounded-lg overflow-hidden flex items-end">
        <div
          className={`w-full ${color} rounded-lg transition-all duration-700`}
          style={{ height: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-700">{Math.round(value)}%</span>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}
