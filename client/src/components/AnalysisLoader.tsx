const STEPS = [
  'Parsing transcript structure…',
  'Identifying key insights…',
  'Clustering themes…',
  'Surfacing best quotes…',
  'Analyzing sentiment arc…',
  'Synthesizing executive summary…',
];

interface Props {
  step?: number;
}

export function AnalysisLoader({ step = 0 }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6 animate-fade-in">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
        <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full bg-brand-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-slate-800">Analyzing with Claude</p>
        <p className="text-sm text-slate-500">{STEPS[step % STEPS.length]}</p>
      </div>

      <div className="w-48 space-y-1.5">
        {STEPS.slice(0, 4).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${i <= step ? 'bg-brand-500' : 'bg-slate-200'}`} />
            <p className={`text-xs ${i <= step ? 'text-slate-600' : 'text-slate-300'}`}>{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
