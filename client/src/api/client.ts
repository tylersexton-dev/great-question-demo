import { Transcript, AnalysisResult } from '../types';

const BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async uploadTranscript(
    file: File,
    meta: { participantName?: string; projectName?: string }
  ): Promise<Transcript> {
    const form = new FormData();
    form.append('transcript', file);
    if (meta.participantName) form.append('participantName', meta.participantName);
    if (meta.projectName) form.append('projectName', meta.projectName);
    return request<Transcript>('/transcripts', { method: 'POST', body: form });
  },

  async listTranscripts(): Promise<Transcript[]> {
    return request<Transcript[]>('/transcripts');
  },

  async getTranscript(id: string): Promise<Transcript> {
    return request<Transcript>(`/transcripts/${id}`);
  },

  async deleteTranscript(id: string): Promise<void> {
    await request<void>(`/transcripts/${id}`, { method: 'DELETE' });
  },

  async analyze(transcriptId: string, force = false): Promise<AnalysisResult> {
    const qs = force ? '?force=true' : '';
    return request<AnalysisResult>(`/analysis/${transcriptId}/analyze${qs}`, { method: 'POST' });
  },

  async getAnalysis(transcriptId: string): Promise<AnalysisResult> {
    return request<AnalysisResult>(`/analysis/${transcriptId}`);
  },
};
