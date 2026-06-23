import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '..', '.env') });
import express from 'express';
import cors from 'cors';
import transcriptRoutes from './routes/transcripts';
import analysisRoutes from './routes/analysis';

const app = express();
const PORT = process.env.PORT ?? 3002;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/transcripts', transcriptRoutes);
app.use('/api/analysis', analysisRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', model: process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6' });
});

if (isProd) {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('[server] WARNING: ANTHROPIC_API_KEY is not set — analysis will fail');
  }
});
