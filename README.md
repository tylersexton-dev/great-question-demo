# Insight Engine

AI-powered user research analysis. Upload interview transcripts, get back structured insights, themes, standout quotes, and sentiment analysis — powered by Claude.

Built as a demo for Great Question.

## What it does

- **Transcript upload** — drag-and-drop `.txt` or `.md` interview files
- **Insight extraction** — non-obvious findings that should change product decisions
- **Theme clustering** — recurring topics with frequency and representative quotes
- **Quote surfacing** — curated, filterable, copy-ready verbatim quotes ranked by significance
- **Sentiment analysis** — score, breakdown, emotional arc, and key emotional moments
- **Executive summary** — 60-second read for a busy PM, synthesized not just listed

## Stack

| Layer | Tech |
|-------|------|
| Backend | Node.js + Express + TypeScript |
| AI | Claude via `@anthropic-ai/sdk` with structured tool use |
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v3 |
| Storage | In-memory (Map) — stateless, demo-safe |

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd great-question-demo
npm run install:all
```

### 2. Configure environment

```bash
cp .env.example server/.env
# Edit server/.env and add your ANTHROPIC_API_KEY
```

### 3. Run

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001
- Health check: http://localhost:3001/api/health

## Try it

Sample transcripts are in `sample-transcripts/`. Upload either file and click **Analyze with AI**.

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/transcripts` | Upload transcript (multipart, field: `transcript`) |
| `GET` | `/api/transcripts` | List all transcripts |
| `GET` | `/api/transcripts/:id` | Get single transcript |
| `DELETE` | `/api/transcripts/:id` | Delete transcript |
| `POST` | `/api/analysis/:id/analyze` | Run Claude analysis (`?force=true` to re-run) |
| `GET` | `/api/analysis/:id` | Get cached analysis |
| `GET` | `/api/health` | Health check |

## Claude pipeline

One `messages.create` call with a structured tool definition that forces JSON output. Claude extracts insights, themes, quotes, and sentiment in a single pass using a research-methodology-aware system prompt. Model is configurable via `CLAUDE_MODEL` env var (default: `claude-sonnet-4-6`).

## Deploy

1. Set `ANTHROPIC_API_KEY` and `CLIENT_ORIGIN` on the server host
2. Server: `npm run build --prefix server` → `node server/dist/index.js`
3. Client: `npm run build --prefix client` → deploy `client/dist/` to any static host
