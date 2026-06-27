# hire-ready — Agent Guidelines

## Stack
- Framework: Next.js 15 App Router — never use Pages Router
- Language: TypeScript strict mode — no any types ever
- AI SDK: Vercel AI SDK v6 — import from 'ai' not 'openai'
- Database: Neon Postgres with @neondatabase/serverless driver
- Vector search: pgvector with <=> cosine distance operator
- Tool schemas: Zod — every tool and API response must have a Zod schema
- Observability: Langfuse — every new tool call must be traced

## API route pattern
Every route is app/api/[name]/route.ts with exported GET/POST:
export async function POST(req: Request) {
  const body = await req.json()
  ...
}

## Database pattern
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.POSTGRES_URL!)
const result = await sql`SELECT * FROM chunks WHERE session_id = ${sessionId}`

## Tool definition pattern
import { z } from 'zod'
const toolName = {
  description: 'what it does',
  parameters: z.object({
    param: z.string().describe('what this param is'),
  }),
  execute: async ({ param }) => {
    // implementation
  },
}

## Langfuse tracing pattern
const span = trace.span({ name: 'toolName', input: params })
const result = await doSomething(params)
span.end({ output: result })

## Component pattern
- All components are in components/
- Components are purely presentational — no business logic
- Business logic lives in hooks/ or lib/
- useJobAnalysis.ts is the main hook — read it before touching agent state

## Naming conventions
- Components: PascalCase (ScoreCard.tsx)
- Hooks: camelCase with use prefix (useJobAnalysis.ts)
- API routes: kebab-case directory (app/api/setup-db/route.ts)
- Lib files: kebab-case (agent-tools.ts)

## Rules
- Never import directly from openai — always use Vercel AI SDK
- Never use fetch inside components — use hooks or server actions
- Never add business logic to components
- Always add Langfuse tracing to new tool calls
- Always add Zod validation to new API routes
- Always read the existing file before writing to it