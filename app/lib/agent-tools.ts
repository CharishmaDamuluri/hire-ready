import { tool } from "ai";
import z from "zod";
import { embedSingle } from "./embeddings";
import { similaritySearch } from "./db";

// TOOL 1 : Search Resume
// The agent calls this to find relevant parts of the uploaded resume - essentially RAG
export const searchResumeTool = tool({
  // LLM reads this and decides if it should call this tool now
  description: `Search the uploaded resume for relevant experience, 
    skills, and achievements. Use this to find what the candidate 
    has done that relates to the job requirements.`,

  // what LLM mush provide while calling this tool
  //.describe() on each field is also for the LLM - it tells the LLM what this parameter means so it fills it in correctly.
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        'What to search for in the resume e.g. "React experience" or "leadership skills"',
      ),
  }),

  execute: async ({ query }) => {
    // RAG - Embed the query, search pgvector, get the top 4 matching chunks
    const embedding = await embedSingle(query);
    const chunks = await similaritySearch(embedding, 4);

    if (chunks.length === 0) {
      return {
        found: false,
        content: "No relevant experience found for this query",
      };
    }

    return {
      found: true,
      content: chunks.map((c) => c.content).join("\n\n"),
      similarity: chunks[0].similarity,
    };
  },
});

// TOOL 2 : Extract Job Requirments
// Simply return the instruction back to LLM as we don't need to handle the extraction part
export const extractJobRequirementsTool = tool({
  description: `Extract structured requirements from a job description.
    Use this first to understand what the job needs before searching the resume.`,
  inputSchema: z.object({
    jobDescription: z.string().describe("The full job description text"),
  }),
  execute: async ({ jobDescription }) => {
    return {
      jobDescription,
      instruction:
        "Extract: required skills, nice-to-have skills, years of experience...",
    };
  },
});

// TOOL 3: Generate Analysis Tool
// Returns response in a structure
export const generateAnalysisTool = tool({
  description: `Call this as the FINAL step after searching the resume 
  and reading the job description. Use everything you have gathered to 
  produce a complete structured analysis.`,
  inputSchema: z.object({
    matchScore: z
      .number()
      .min(0)
      .max(100)
      .describe("Your honest assessment of fit as a percentage"),

    matchedSkills: z
      .array(z.string())
      .describe("Skills the candidate clearly has that the job requires"),

    missingSkills: z
      .array(z.string())
      .describe("Skills the job requires that are not in the resume"),

    resumeHighlights: z
      .array(z.string())
      .describe(
        "Specific bullet points from the resume to emphasize for this role",
      ),

    coverLetter: z
      .string()
      .describe("A tailored cover letter for this specific role and company"),

    verdict: z
      .enum(["strong fit", "good fit", "partial fit", "weak fit"])
      .describe("Overall assessment of the candidate for this role"),

    summary: z
      .string()
      .describe(
        "2-3 sentence summary of why the candidate is or is not a good fit",
      ),
  }),
  execute: async (analysis) => {
    return analysis;
  },
});
