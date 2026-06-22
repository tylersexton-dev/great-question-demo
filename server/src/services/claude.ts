import Anthropic from '@anthropic-ai/sdk';
import { AnalysisResult, ClaudeAnalysisInput } from '../types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6';

const ANALYSIS_TOOL: Anthropic.Tool = {
  name: 'analyze_transcript',
  description: 'Extract structured research insights from a user interview transcript',
  input_schema: {
    type: 'object' as const,
    properties: {
      executive_summary: {
        type: 'string',
        description:
          'A 2-3 paragraph executive summary a PM can read in 60 seconds and immediately act on. Lead with the single most important finding. Synthesize — do not merely list.',
      },
      insights: {
        type: 'array',
        description: 'Key insights — non-obvious findings that should change how the team thinks. Min 3.',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Action-oriented title that expresses the insight, not the topic (e.g. "Users build mental models around X, not Y")',
            },
            description: {
              type: 'string',
              description: '2-3 sentences explaining the insight and its product implications',
            },
            confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
            impact: { type: 'string', enum: ['high', 'medium', 'low'] },
            evidence_quotes: {
              type: 'array',
              items: { type: 'string' },
              description: 'Direct verbatim quotes that support this insight',
            },
          },
          required: ['title', 'description', 'confidence', 'impact', 'evidence_quotes'],
        },
      },
      themes: {
        type: 'array',
        description: 'Recurring topics or patterns. Min 3.',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: '2-4 word theme label' },
            description: { type: 'string', description: 'What this theme is and why it matters' },
            frequency: { type: 'number', description: 'Approximate number of mentions/references in the transcript' },
            representative_quotes: {
              type: 'array',
              items: { type: 'string' },
              description: 'Best 2-3 quotes exemplifying this theme',
            },
          },
          required: ['name', 'description', 'frequency', 'representative_quotes'],
        },
      },
      quotes: {
        type: 'array',
        description: 'The most shareable, emotionally resonant, or strategically important verbatim quotes. Min 5.',
        items: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'Verbatim quote' },
            speaker: { type: 'string', description: 'Speaker label (Interviewer, Participant, or name if given)' },
            significance: {
              type: 'string',
              enum: ['high', 'medium', 'low'],
              description: 'How shareable/impactful this quote is',
            },
            theme: { type: 'string', description: 'Which theme this quote belongs to' },
            context: { type: 'string', description: 'One sentence of context for what was being discussed' },
          },
          required: ['text', 'speaker', 'significance', 'context'],
        },
      },
      sentiment: {
        type: 'object',
        properties: {
          overall: { type: 'string', enum: ['positive', 'neutral', 'negative', 'mixed'] },
          score: { type: 'number', description: 'Float from -1.0 (very negative) to 1.0 (very positive)' },
          breakdown: {
            type: 'object',
            properties: {
              positive: { type: 'number', description: 'Percentage 0-100' },
              neutral: { type: 'number', description: 'Percentage 0-100' },
              negative: { type: 'number', description: 'Percentage 0-100' },
            },
            required: ['positive', 'neutral', 'negative'],
          },
          emotional_arc: {
            type: 'string',
            description: "Narrative description of the participant's emotional journey through the interview",
          },
          key_moments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                sentiment: { type: 'string' },
                significance: { type: 'string', description: 'Why this moment is emotionally significant' },
              },
              required: ['text', 'sentiment', 'significance'],
            },
          },
        },
        required: ['overall', 'score', 'breakdown', 'emotional_arc', 'key_moments'],
      },
    },
    required: ['executive_summary', 'insights', 'themes', 'quotes', 'sentiment'],
  },
};

const SYSTEM_PROMPT = `You are an expert user research analyst with deep experience in qualitative methodology, thematic analysis, and transforming raw interview data into product intelligence.

When analyzing transcripts you:
- Separate observations (what was said) from insights (what it means for the product and team)
- Surface non-obvious patterns — things the participant may not have said explicitly but that emerge from how they framed problems
- Curate quotes that are viscerally human: specific, emotional, shareable — the kind that stop a design review cold
- Track the emotional arc, not just the sentiment average
- Write for a busy PM who needs to act, not for a researcher who wants completeness

Your analysis is rigorous but accessible. Every insight is grounded in evidence. The summary can be acted on in 60 seconds.`;

export async function analyzeTranscript(content: string, transcriptId: string): Promise<AnalysisResult> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    tools: [ANALYSIS_TOOL],
    tool_choice: { type: 'any' as const },
    messages: [
      {
        role: 'user',
        content: `Analyze this user research transcript. Extract insights that would genuinely change how a product team makes decisions — not surface-level observations. Quote directly. Be specific.

<transcript>
${content}
</transcript>`,
      },
    ],
  });

  const toolBlock = response.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use');
  if (!toolBlock) {
    throw new Error('Claude did not return a structured analysis. Check the API key and model availability.');
  }

  const raw = toolBlock.input as ClaudeAnalysisInput;

  return {
    transcriptId,
    modelUsed: MODEL,
    executiveSummary: raw.executive_summary,
    insights: raw.insights.map((i) => ({
      title: i.title,
      description: i.description,
      confidence: i.confidence as 'high' | 'medium' | 'low',
      impact: i.impact as 'high' | 'medium' | 'low',
      evidenceQuotes: i.evidence_quotes ?? [],
    })),
    themes: raw.themes.map((t) => ({
      name: t.name,
      description: t.description,
      frequency: t.frequency ?? 1,
      representativeQuotes: t.representative_quotes ?? [],
    })),
    quotes: raw.quotes.map((q) => ({
      text: q.text,
      speaker: q.speaker ?? 'Participant',
      significance: q.significance as 'high' | 'medium' | 'low',
      theme: q.theme,
      context: q.context ?? '',
    })),
    sentiment: {
      overall: raw.sentiment.overall as 'positive' | 'neutral' | 'negative' | 'mixed',
      score: raw.sentiment.score,
      breakdown: raw.sentiment.breakdown,
      emotionalArc: raw.sentiment.emotional_arc,
      keyMoments: raw.sentiment.key_moments ?? [],
    },
    analyzedAt: new Date().toISOString(),
  };
}
