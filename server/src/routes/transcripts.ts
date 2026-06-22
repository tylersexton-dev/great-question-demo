import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../services/storage';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt') || file.originalname.endsWith('.md')) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt and .md files are accepted'));
    }
  },
});

router.post('/', upload.single('transcript'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded. Send a .txt or .md file in the "transcript" field.' });
    return;
  }

  const content = req.file.buffer.toString('utf-8').trim();
  if (content.length < 50) {
    res.status(400).json({ error: 'Transcript is too short to analyze.' });
    return;
  }

  const transcript = {
    id: uuidv4(),
    filename: req.file.originalname,
    content,
    uploadedAt: new Date().toISOString(),
    participantName: (req.body.participantName as string | undefined)?.trim(),
    projectName: (req.body.projectName as string | undefined)?.trim(),
    analyzed: false,
    wordCount: content.split(/\s+/).length,
  };

  storage.saveTranscript(transcript);
  res.status(201).json(transcript);
});

router.get('/', (_req: Request, res: Response): void => {
  res.json(storage.getAllTranscripts());
});

router.get('/:id', (req: Request, res: Response): void => {
  const t = storage.getTranscript(req.params.id);
  if (!t) {
    res.status(404).json({ error: 'Transcript not found' });
    return;
  }
  res.json(t);
});

router.delete('/:id', (req: Request, res: Response): void => {
  const deleted = storage.deleteTranscript(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Transcript not found' });
    return;
  }
  res.status(204).send();
});

export default router;
