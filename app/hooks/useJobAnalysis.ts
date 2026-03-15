// Custom Hook : Components should only care about rendering.
// All the complexity of reading tool calls, parsing results,

import { useChat } from "@ai-sdk/react";
import { useMemo } from "react";
import { AgentStep, AnalysisOutput, AnalysisState } from "../types/analysis";

// and deriving state lives here — invisible to the UI layer.
const TOOL_LABELS: Record<string, string> = {
  extractJobRequirements: "📋 Extracting job requirements",
  searchResume: "🔍 Searching resume",
  generateAnalysis: "⚙️ Generating final analysis",
};

export function useJobAnalysis() {
  const { messages, sendMessage, status } = useChat();
  const analysisState: AnalysisState = useMemo(() => {
    if (messages.length === 0) return { status: "idle" };

    // Collecting all tool call parts from all messages
    const allParts = messages.flatMap((m) => m.parts ?? []);

    // Extracting agent steps from tool calls
    // filter only tool call from all parts
    const steps: AgentStep[] = allParts
      .filter((p) => p.type === "tool-invocation")
      .map((p, i) => {
        const toolCall = p as unknown as {
          type: "tool-invocation";
          toolName: string;
          input: Record<string, unknown>;
        };
        return {
          id: i,
          toolName: toolCall.toolName,
          label: TOOL_LABELS[toolCall.toolName] ?? toolCall.toolName,
          // For searchResume to show what it searched for
          detail:
            toolCall.toolName === "searchResume"
              ? `"${(toolCall.input as { query: string }).query}"`
              : undefined,
        };
      });

    const analysisPart = allParts.find((p) => {
      if (p.type !== "tool-invocation") return false;
      const tr = p as unknown as {
        type: "tool-invocation";
        toolName: string;
        state: string;
        output: unknown;
      };
      return tr.toolName === "generateAnalysis" && tr.state === "output";
    });

    if (analysisPart && status === "ready") {
      const toolResult = analysisPart as unknown as {
        type: "tool-invocation";
        output: unknown;
      };
      return {
        status: "done",
        steps,
        result: toolResult.output as AnalysisOutput,
      };
    }
    // Agent is still working
    if (status === "streaming") {
      return { status: "working", steps };
    }
    // Fallback — ready but no result yet
    return { status: "working", steps };
  }, [messages, status]);

  function analyze(resume: string, jobDescription: string) {
    sendMessage({
      text: `Please analyze my resume against this job description.

        RESUME:
        ${resume}

        JOB DESCRIPTION:
        ${jobDescription}`,
    });
  }

  return { analysisState, analyze };
}
