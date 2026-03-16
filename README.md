# HireReady

A job application analyzer built to demonstrate **agentic AI with tool calling**. The LLM doesn't just answer a question — it decides what steps to take, calls tools in sequence, reasons over the results, and produces a structured analysis.

**Live demo:** [HireReadyApp](https://hire-ready-nine.vercel.app/)

---

## The core concept — why this is an agent, not a chatbot

A basic RAG system has a hardcoded flow:

```
embed query → search → inject context → generate answer
```

This app uses an agent where the LLM controls the flow:

```
given a goal + tools → decide what to search → call tools → 
reason over results → decide next step → produce structured output
```

The difference is visible in the UI — you can watch the agent decide what to search for, how many times to search, and in what order. None of that is hardcoded.

---

## The three tools

The agent has access to three tools defined with Zod schemas:

**`extractJobRequirements`** — called first. Signals the LLM to parse the job description and identify required skills, experience level, and responsibilities before touching the resume.

**`searchResume`** — RAG-powered semantic search over the uploaded resume. The agent calls this 3–4 times with different queries it generates itself based on what the job requires. Each call embeds the query and runs cosine similarity search against resume chunks stored in pgvector.

**`generateAnalysis`** — called last. A structured output tool with a Zod schema that forces the LLM to return typed JSON instead of free text:

```ts
{
  matchScore: number,          // 0-100
  matchedSkills: string[],
  missingSkills: string[],
  resumeHighlights: string[],
  coverLetter: string,
  verdict: 'strong fit' | 'good fit' | 'partial fit' | 'weak fit',
  summary: string
}
```

The LLM is instructed to call these in order but decides the search queries, number of searches, and final scores itself.

---

## What it produces

Upload your resume once, paste any job description, and get:

- **Match score** with an overall verdict
- **Matched + missing skills**
- **Resume highlights** — specific bullets to emphasize for this role
- **Tailored cover letter** — written from your actual resume content

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 15 + TypeScript |
| AI SDK | Vercel AI SDK v6 |
| LLM | GPT-4o-mini via Vercel AI Gateway |
| Embeddings | OpenAI text-embedding-3-small |
| Vector DB | pgvector on Neon Postgres |
| Tool schemas | Zod |
| Deployment | Vercel |

---

## Project structure

```
hire-ready/
├── app/api/
│   ├── chat/route.ts        ← agent endpoint — tools + system prompt
│   ├── ingest/route.ts      ← chunk + embed + store resume in pgvector
│   └── clear/route.ts       ← clears chunks on new resume upload
├── components/
│   ├── ResumeInput.tsx      ← PDF upload + text paste
│   ├── AgentProgress.tsx    ← shows each tool call in real time
│   └── AnalysisResult/      ← score, skills, highlights, cover letter
├── hooks/
│   └── useJobAnalysis.ts    ← agent state + tool result parsing
├── lib/
│   ├── agent-tools.ts       ← tool definitions with Zod schemas
│   ├── chunker.ts           ← sliding window text splitter
│   ├── embeddings.ts        ← batch + single embed via OpenAI
│   └── db.ts                ← pgvector insert + similarity search
└── types/
    └── analysis.ts          ← discriminated union for AnalysisState
```

---

## Running locally

```bash
git clone https://github.com/yourusername/hire-ready.git
cd hire-ready
npm install
```

Create `.env.local`:

```bash
AI_GATEWAY_API_KEY=vai_...
POSTGRES_URL=postgresql://...
POSTGRES_URL_NON_POOLING=...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...
```

Initialize the DB once at `http://localhost:3000/api/setup-db` then:

```bash
npm run dev
```

---

## Known limitations

- All users share the same vector table — a `session_id` column would isolate them
- Match score is LLM-reasoned, not a formula — may vary slightly between runs
- Very dense resumes may need a higher `topK` to surface all relevant experience

---

