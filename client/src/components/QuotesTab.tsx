import { useState } from 'react';
import { Quote } from '../types';
import { Badge } from './Badge';

interface Props {
  quotes: Quote[];
}

export function QuotesTab({ quotes }: Props) {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const filtered = filter === 'all' ? quotes : quotes.filter((q) => q.significance === filter);
  const sorted = [...filtered].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.significance] - order[b.significance];
  });

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center gap-2">
        {(['all', 'high', 'medium', 'low'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors capitalize
              ${filter === f ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {f === 'all' ? `All (${quotes.length})` : `${f} (${quotes.filter((q) => q.significance === f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map((quote, i) => (
          <QuoteCard key={i} quote={quote} />
        ))}
        {sorted.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">No quotes match this filter.</p>
        )}
      </div>
    </div>
  );
}

function QuoteCard({ quote }: { quote: Quote }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(quote.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={`bg-white border rounded-xl p-5 group hover:shadow-md transition-all duration-200
      ${quote.significance === 'high' ? 'border-brand-200 shadow-sm' : 'border-slate-200'}`}>
      <blockquote className="font-serif text-base text-slate-800 leading-relaxed mb-3">
        "{quote.text}"
      </blockquote>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">— {quote.speaker}</span>
          {quote.theme && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-brand-600 font-medium">{quote.theme}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge label={quote.significance} variant={quote.significance} />
          <button
            onClick={copy}
            className="opacity-0 group-hover:opacity-100 text-xs text-slate-400 hover:text-brand-600 transition-all px-2 py-1 rounded hover:bg-brand-50"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      {quote.context && (
        <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">{quote.context}</p>
      )}
    </div>
  );
}
