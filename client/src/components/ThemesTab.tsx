import { Theme } from '../types';

interface Props {
  themes: Theme[];
}

const THEME_COLORS = [
  { bg: 'bg-brand-50', border: 'border-brand-200', accent: 'bg-brand-500', text: 'text-brand-700' },
  { bg: 'bg-violet-50', border: 'border-violet-200', accent: 'bg-violet-500', text: 'text-violet-700' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', accent: 'bg-emerald-500', text: 'text-emerald-700' },
  { bg: 'bg-amber-50', border: 'border-amber-200', accent: 'bg-amber-500', text: 'text-amber-700' },
  { bg: 'bg-rose-50', border: 'border-rose-200', accent: 'bg-rose-500', text: 'text-rose-700' },
  { bg: 'bg-cyan-50', border: 'border-cyan-200', accent: 'bg-cyan-500', text: 'text-cyan-700' },
];

export function ThemesTab({ themes }: Props) {
  const maxFreq = Math.max(...themes.map((t) => t.frequency), 1);

  return (
    <div className="space-y-4 animate-slide-up">
      {themes.map((theme, i) => {
        const color = THEME_COLORS[i % THEME_COLORS.length];
        const pct = Math.round((theme.frequency / maxFreq) * 100);
        return (
          <div key={i} className={`${color.bg} border ${color.border} rounded-xl p-5`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className={`text-sm font-bold ${color.text}`}>{theme.name}</h3>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-24 bg-white/60 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full ${color.accent} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-slate-500">{theme.frequency}×</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{theme.description}</p>
            {theme.representativeQuotes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Representative quotes</p>
                {theme.representativeQuotes.map((q, j) => (
                  <blockquote key={j} className="border-l-2 border-current/30 pl-3 text-sm text-slate-600 italic">
                    "{q}"
                  </blockquote>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
