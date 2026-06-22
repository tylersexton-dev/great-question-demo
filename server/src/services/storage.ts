import { Transcript, AnalysisResult } from '../types';

const transcripts = new Map<string, Transcript>();
const analyses = new Map<string, AnalysisResult>();

export const storage = {
  saveTranscript(transcript: Transcript): void {
    transcripts.set(transcript.id, transcript);
  },

  getTranscript(id: string): Transcript | undefined {
    return transcripts.get(id);
  },

  getAllTranscripts(): Transcript[] {
    return Array.from(transcripts.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  },

  deleteTranscript(id: string): boolean {
    analyses.delete(id);
    return transcripts.delete(id);
  },

  markAnalyzed(id: string): void {
    const t = transcripts.get(id);
    if (t) transcripts.set(id, { ...t, analyzed: true });
  },

  saveAnalysis(analysis: AnalysisResult): void {
    analyses.set(analysis.transcriptId, analysis);
  },

  getAnalysis(transcriptId: string): AnalysisResult | undefined {
    return analyses.get(transcriptId);
  },
};
