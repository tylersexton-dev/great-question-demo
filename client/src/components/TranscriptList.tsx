import { Transcript } from '../types';

interface Props {
  transcripts: Transcript[];
  selectedId: string | null;
  onSelect: (t: Transcript) => void;
  onDelete: (id: string) => void;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function TranscriptList({ transcripts, selectedId, onSelect, onDelete }: Props) {
  if (transcripts.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-slate-400">
        No transcripts yet — upload one above
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {transcripts.map((t) => (
        <li key={t.id}>
          <button
            onClick={() => onSelect(t)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 group
              ${selectedId === t.id
                ? 'border-brand-400 bg-brand-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${selectedId === t.id ? 'text-brand-700' : 'text-slate-800'}`}>
                  {t.participantName ?? t.filename}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">{t.wordCount.toLocaleString()} words</span>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs text-slate-400">{relativeTime(t.uploadedAt)}</span>
                  {t.projectName && (
                    <>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-500 font-medium">{t.projectName}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {t.analyzed && (
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 ring-1 ring-emerald-200 px-1.5 py-0.5 rounded">
                    Analyzed
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-red-500 transition-all"
                  aria-label="Delete"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
