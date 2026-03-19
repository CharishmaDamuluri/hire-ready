import {
  extractJobRequirementsTool,
  generateAnalysisTool,
  searchResumeTool,
} from "@/app/lib/agent-tools";
import { langfuse } from "@/app/lib/langfuse";
import { createGateway } from "@ai-sdk/gateway";
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";
import { NextRequest } from "next/server";

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

export async function POST(req: NextRequest) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Create a trace for this entire agent run
  const trace = langfuse.trace({
    name: "resume-analysis",
    metadata: {
      messageCount: messages.length,
      timestamp: new Date().toISOString(),
    },
  });
  const lastUserMessage = messages.filter((m) => m.role === "user").at(-1);
  const messageText = lastUserMessage
    ? Array.isArray(lastUserMessage.parts)
      ? lastUserMessage.parts
          .filter((p) => p.type === "text")
          .map((p) => (p.type === "text" ? p.text : ""))
          .join(" ")
      : ""
    : "";
  // Adding user input preview to trace
  trace.update({
    input: messageText.slice(0, 500),
  });

  const result = streamText({
    model: gateway("openai/gpt-4o-mini"),
    stopWhen: stepCountIs(10),
    system: ` You are an expert career coach and recruiter with 15 years 
        of experience matching candidates to roles.
        Your job is to analyze how well a candidate's resume matches a job description.
        IMPORTANT: If the job description is less than 50 words or does not contain 
clear job requirements, respond with a matchScore of 0, empty skill arrays, 
and a summary explaining that the job description is too vague to analyze.
Do NOT invent or assume requirements.
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
    onStepFinish: async ({ toolResults, usage }) => {
      for (const tr of toolResults ?? []) {
        const toolResult = tr as unknown as {
          toolName: string;
          input: Record<string, unknown>;
          output: unknown;
        };

        // A span is a child inside the trace — think of it as a sub-folder
        const span = trace.span({
          name: toolResult.toolName,
          input: toolResult.input,
          output: toolResult.output,
        });
        span.end();
        // to log token usage per step
        if (usage) {
          trace.update({
            metadata: {
              inputTokens: usage.inputTokens,
              outputTokens: usage.outputTokens,
              totalTokens: usage.inputTokens || "" + usage.outputTokens || "",
            },
          });
        }

        // during last step log output to see verdict and score
        if (toolResult.toolName === "generateAnalysis") {
          trace.update({
            output: toolResult.output,
            metadata: {
              matchScore: (toolResult.output as Record<string, unknown>)
                .matchScore,
              verdict: (toolResult.output as Record<string, unknown>).verdict,
            },
          });
        }
      }
    },
    // fires when entire stream completes
    onFinish: async ({ usage }) => {
      if (usage) {
        trace.update({
          metadata: {
            totalTokens: usage.inputTokens,
            promptTokens: usage.outputTokens,
            completionTokens:
              usage.inputTokens || "" + usage.outputTokens || "",
          },
        });
      }
      // MUST call this as traces disappear without this
      await langfuse.flushAsync();
    },
  });
  return result.toUIMessageStreamResponse();
}
