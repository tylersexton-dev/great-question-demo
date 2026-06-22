import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import transcriptRoutes from './routes/transcripts';
import analysisRoutes from './routes/analysis';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/transcripts', transcriptRoutes);
app.use('/api/analysis', analysisRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', model: process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6' });
});

app.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('[server] WARNING: ANTHROPIC_API_KEY is not set — analysis will fail');
  }
});
