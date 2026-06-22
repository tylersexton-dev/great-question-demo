import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { api } from '../api/client';
import { Transcript } from '../types';

interface Props {
  onUploaded: (t: Transcript) => void;
}

export function UploadZone({ onUploaded }: Props) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState('');
  const [projectName, setProjectName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);
    try {
      const t = await api.uploadTranscript(file, { participantName, projectName });
      onUploaded(t);
      setParticipantName('');
      setProjectName('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Participant name (optional)"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        />
        <input
          type="text"
          placeholder="Project name (optional)"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        />
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
          ${dragging ? 'border-brand-500 bg-brand-50 scale-[1.01]' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'}
          ${loading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input ref={inputRef} type="file" accept=".txt,.md" className="hidden" onChange={onChange} />

        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Uploading transcript…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${dragging ? 'bg-brand-100' : 'bg-slate-100'}`}>
              <svg className={`w-6 h-6 ${dragging ? 'text-brand-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                Drop a transcript here, or <span className="text-brand-600">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">.txt or .md · up to 2 MB</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
