import { Router, Request, Response } from 'express';
import { storage } from '../services/storage';
import { analyzeTranscript } from '../services/claude';

const router = Router();

router.post('/:transcriptId/analyze', async (req: Request, res: Response): Promise<void> => {
  const { transcriptId } = req.params;
  const transcript = storage.getTranscript(transcriptId);

  if (!transcript) {
    res.status(404).json({ error: 'Transcript not found' });
    return;
  }

  const existing = storage.getAnalysis(transcriptId);
  if (existing && req.query.force !== 'true') {
    res.json(existing);
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' });
    return;
  }

  try {
    const result = await analyzeTranscript(transcript.content, transcriptId);
    storage.saveAnalysis(result);
    storage.markAnalyzed(transcriptId);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error during analysis';
    console.error('[analysis]', message);
    res.status(502).json({ error: 'Analysis failed', details: message });
  }
});

router.get('/:transcriptId', (req: Request, res: Response): void => {
  const result = storage.getAnalysis(req.params.transcriptId);
  if (!result) {
    res.status(404).json({ error: 'No analysis found. Run POST /api/transcripts/:id/analyze first.' });
    return;
  }
  res.json(result);
});

export default router;
