import { useState, useEffect, useRef } from 'react';
import { Transcript, AnalysisResult } from './types';
import { api } from './api/client';
import { UploadZone } from './components/UploadZone';
import { TranscriptList } from './components/TranscriptList';
import { AnalysisLoader } from './components/AnalysisLoader';
import { AnalysisPanel } from './components/AnalysisPanel';

export default function App() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [selected, setSelected] = useState<Transcript | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loaderStep, setLoaderStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const stepInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    api.listTranscripts().then(setTranscripts).catch(console.error);
  }, []);

  function handleUploaded(t: Transcript) {
    setTranscripts((prev) => [t, ...prev]);
    handleSelect(t);
  }

  async function handleSelect(t: Transcript) {
    setSelected(t);
    setResult(null);
    setError(null);
    if (t.analyzed) {
      try {
        const r = await api.getAnalysis(t.id);
        setResult(r);
      } catch {
        // not cached yet — will analyze on demand
      }
    }
  }

  async function handleAnalyze() {
    if (!selected) return;
    setError(null);
    setResult(null);
    setAnalyzing(true);
    setLoaderStep(0);
    stepInterval.current = setInterval(() => setLoaderStep((s) => s + 1), 3500);

    try {
      const r = await api.analyze(selected.id);
      setResult(r);
      setTranscripts((prev) =>
        prev.map((t) => (t.id === selected.id ? { ...t, analyzed: true } : t))
      );
      setSelected((s) => s ? { ...s, analyzed: true } : s);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
      if (stepInterval.current) clearInterval(stepInterval.current);
    }
  }

  async function handleDelete(id: string) {
    await api.deleteTranscript(id).catch(console.error);
    setTranscripts((prev) => prev.filter((t) => t.id !== id));
    if (selected?.id === id) {
      setSelected(null);
      setResult(null);
    }
  }

  async function handleReanalyze() {
    if (!selected) return;
    setResult(null);
    setError(null);
    setAnalyzing(true);
    setLoaderStep(0);
    stepInterval.current = setInterval(() => setLoaderStep((s) => s + 1), 3500);
    try {
      const r = await api.analyze(selected.id, true);
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Re-analysis failed');
    } finally {
      setAnalyzing(false);
      if (stepInterval.current) clearInterval(stepInterval.current);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">Insight Engine</span>
            <span className="text-xs text-slate-400 hidden sm:block">AI-powered user research analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{transcripts.length} transcript{transcripts.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
          {/* Left panel */}
          <aside className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Upload Transcript</h2>
              <UploadZone onUploaded={handleUploaded} />
            </div>

            {transcripts.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Transcripts ({transcripts.length})
                </h2>
                <TranscriptList
                  transcripts={transcripts}
                  selectedId={selected?.id ?? null}
                  onSelect={handleSelect}
                  onDelete={handleDelete}
                />
              </div>
            )}
          </aside>

          {/* Right panel */}
          <main className="min-h-[600px]">
            {!selected ? (
              <EmptyState />
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-800">
                      {selected.participantName ?? selected.filename}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selected.wordCount.toLocaleString()} words
                      {selected.projectName && ` · ${selected.projectName}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {result && (
                      <button
                        onClick={handleReanalyze}
                        className="text-xs text-slate-500 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
                      >
                        Re-analyze
                      </button>
                    )}
                    {!analyzing && !result && (
                      <button
                        onClick={handleAnalyze}
                        className="text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl transition-colors shadow-sm"
                      >
                        Analyze with AI
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {analyzing && <AnalysisLoader step={loaderStep} />}

                  {error && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-medium">Analysis failed</p>
                        <p className="text-red-600 mt-0.5">{error}</p>
                      </div>
                    </div>
                  )}

                  {!analyzing && !error && !result && (
                    <div className="text-center py-16">
                      <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Ready to analyze</p>
                      <p className="text-xs text-slate-400 mb-5">
                        Claude will extract insights, themes, quotes, and sentiment from this transcript.
                      </p>
                      <button
                        onClick={handleAnalyze}
                        className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                      >
                        Analyze with AI →
                      </button>
                    </div>
                  )}

                  {result && <AnalysisPanel result={result} />}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center py-24 text-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-2">No transcript selected</h3>
      <p className="text-sm text-slate-500 max-w-xs">
        Upload a research interview transcript and let Claude extract insights, themes, standout quotes, and sentiment patterns.
      </p>
    </div>
  );
}
