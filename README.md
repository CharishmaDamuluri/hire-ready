# HireReady

A job application analyzer built to demonstrate **agentic AI with tool calling**, **RAG-powered retrieval**, **automated evaluation**, and **LLM observability**. The LLM doesn't just answer a question — it decides what steps to take, calls tools in sequence, reasons over the results, and produces a structured analysis.

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

You can analyze multiple job descriptions against the same resume without re-uploading. Change the job description and click Analyze again — the agent runs fresh each time.

---

## Evaluation system

The project includes an automated eval harness that tests the agent against a golden dataset of known resume + job description pairs. Two scoring approaches are combined:

**Reference-based scoring** — pure JavaScript comparisons against expected values:
- Is the match score within the expected range?
- Did it find all required skills?
- Did it correctly identify the skill gaps?
- Is the verdict one of the acceptable options?

**LLM-as-judge scoring** — a second GPT call evaluates qualitative dimensions:
- Are resume highlights specific to this resume or generic?
- Is the cover letter grounded in actual resume content?
- Did the agent hallucinate any facts?
- Overall quality rating (1-5)

Run the eval suite at any time:
```
GET /api/eval           → runs all test cases
GET /api/eval?testId=1  → runs a single test case
```

This lets you measure whether a change to the system prompt, chunking strategy, or retrieval logic actually improved or degraded output quality.

---

## Observability with Langfuse

Every agent run is traced in Langfuse with full input/output logging per tool call:

```
Trace: resume-analysis (11.86s)
  ├── extractJobRequirements — input: job description, output: parsed requirements
  ├── searchResume — query: "React TypeScript experience", output: resume chunks
  ├── searchResume — query: "leadership mentoring", output: resume chunks
  ├── searchResume — query: "AWS cloud deployment", output: resume chunks
  └── generateAnalysis — output: { matchScore: 85, verdict: "strong fit", ... }
```

This enables:
- Debugging bad outputs by inspecting exactly what the agent retrieved
- Tracking token usage and cost per run
- Identifying slow steps via the Timeline view
- Catching regressions by comparing traces before and after system changes

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
| Observability | Langfuse |
| Deployment | Vercel |

---

## Project structure

```
hire-ready/
├── app/api/
│   ├── chat/route.ts        ← agent endpoint with Langfuse tracing
│   ├── ingest/route.ts      ← chunk + embed + store resume in pgvector
│   ├── clear/route.ts       ← clears chunks on new resume upload
│   └── eval/route.ts        ← automated eval harness
├── components/
│   ├── ResumeInput.tsx      ← PDF upload + text paste with auto-ingest
│   ├── AgentProgress.tsx    ← real-time agent step display
│   └── AnalysisResult/      ← score, skills, highlights, cover letter
│       ├── index.tsx
│       ├── ScoreCard.tsx
│       ├── SkillsGrid.tsx
│       ├── ResumeHighlights.tsx
│       └── CoverLetter.tsx
├── hooks/
│   └── useJobAnalysis.ts    ← agent state + tool result parsing
├── lib/
│   ├── agent-tools.ts       ← tool definitions with Zod schemas
│   ├── chunker.ts           ← sliding window text splitter
│   ├── embeddings.ts        ← batch + single embed via OpenAI
│   ├── db.ts                ← pgvector insert + similarity search
│   ├── langfuse.ts          ← Langfuse singleton client
│   └── eval-dataset.ts      ← golden dataset for automated evals
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
# Vercel AI Gateway
AI_GATEWAY_API_KEY=vai_...

# Neon Postgres
POSTGRES_URL=postgresql://...
POSTGRES_URL_NON_POOLING=...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...

# Langfuse observability
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_HOST=https://cloud.langfuse.com
```

Initialize the DB once at `http://localhost:3000/api/setup-db` then:

```bash
npm run dev
```

---

## Key engineering decisions

**Discriminated union for state**
`AnalysisState` uses a discriminated union instead of multiple booleans, making impossible states unrepresentable at the type level.

**Custom hook for agent logic**
`useJobAnalysis` encapsulates all message parsing and tool result extraction. Components are purely presentational.

**Structured output via Zod tool**
`generateAnalysis` forces typed JSON output instead of free text, making results deterministic enough to render as UI components.

**Resume persists across analyses**
The DB is only cleared when a new resume is uploaded — users can test multiple job descriptions without re-uploading.

**Combined eval approach**
Reference-based checks for measurable outputs, LLM-as-judge for qualitative dimensions. Runs against a golden dataset on every change.

**Langfuse tracing with timing**
Tool call start times are captured via `onChunk` and end times via `onStepFinish`, giving accurate per-span latency in the Langfuse timeline view.

---

## Known limitations

- All users share the same vector table — a `session_id` column would isolate them
- Match score is LLM-reasoned, not deterministic — may vary slightly between runs
- Very dense resumes may need a higher `topK` to surface all relevant experience
- Vague job descriptions cause the agent to hallucinate requirements — input validation enforces a minimum length

---
