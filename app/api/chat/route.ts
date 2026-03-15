import {
  extractJobRequirementsTool,
  generateAnalysisTool,
  searchResumeTool,
} from "@/app/lib/agent-tools";
import { createGateway } from "@ai-sdk/gateway";
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";
import { NextRequest } from "next/server";

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

export async function POST(req: NextRequest) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: gateway("openai/gpt-4o-mini"),
    stopWhen: stepCountIs(10),
    system: ` You are an expert career coach and recruiter with 15 years 
        of experience matching candidates to roles.
        Your job is to analyze how well a candidate's resume matches a job description.
        ALWAYS follow these steps in order:
        1. Call extractJobRequirements with the job description to understand what the role needs
        2. Call searchResume multiple times (3-4 times) with different queries to thoroughly understand the candidate's background. Search for: technical skills, soft skills, achievements, and specific technologies mentioned in the job
        3. Call generateAnalysis as your FINAL step with everything you have gathered 
        Be honest with the match score. A 60% is not a bad score — it means there are growth areas.
        Never inflate scores to make the candidate feel good.
        When writing the cover letter:
        - Use the candidate's actual experience from the resume
        - Reference specific achievements with numbers when available
        - Keep it under 300 words
        - Do not use generic phrases like "I am a hard worker`,
    messages: await convertToModelMessages(messages),
    tools: {
      extractJobRequirements: extractJobRequirementsTool,
      searchResume: searchResumeTool,
      generateAnalysis: generateAnalysisTool,
    },
  });
  return result.toUIMessageStreamResponse();
}
