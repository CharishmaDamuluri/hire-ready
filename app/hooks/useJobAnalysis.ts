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
  const { messages, sendMessage, status, error, setMessages } = useChat();
  const analysisState: AnalysisState = useMemo(() => {
    if (error) {
      return {
        status: "error",
        message: error.message ?? "Something went wrong. Please try again.",
      };
    }

    if (messages.length === 0) return { status: "idle" };

    // Collecting all tool call parts from all messages
    const allParts = messages.flatMap((m) => m.parts ?? []);

    // Extracting agent steps from tool calls
    // filter only tool call from all parts
    const toolParts = allParts.filter((p: unknown) => {
      const part = p as { type: string };
      return part.type.startsWith("tool-");
    });

    const steps: AgentStep[] = toolParts
      .filter((p: any) => (p as { state: string }).state === "output-available")
      .map((p: any, i: number) => {
        const part = p as {
          type: string;
          state: string;
          input?: Record<string, unknown>;
        };
        const toolName = part.type.replace("tool-", "");
        return {
          id: i,
          toolName,
          label: TOOL_LABELS[toolName] ?? toolName,
          detail:
            toolName === "searchResume" && part.input
              ? `"${(part.input as { query: string }).query}"`
              : undefined,
        };
      });

    const analysisPart = toolParts.find((p) => {
      const part = p as { type: string; state: string };
      return (
        part.type === "tool-generateAnalysis" &&
        part.state === "output-available"
      );
    });

    if (analysisPart && status === "ready") {
      const part = analysisPart as { output: unknown };
      return { status: "done", steps, result: part.output as AnalysisOutput };
    }
    // Agent is still working
    if (status === "streaming" || status === "submitted") {
      return { status: "working", steps };
    }

    if (status === "ready" && messages.length > 0 && !analysisPart) {
      return {
        status: "error",
        message: "Analysis did not complete. Please try again.",
      };
    }

    // Fallback — ready but no result yet
    return { status: "working", steps };
  }, [messages, status, error]);

  function analyze(resume: string, jobDescription: string) {
    sendMessage({
      text: `Please analyze my resume against this job description.

        RESUME:
        ${resume}

        JOB DESCRIPTION:
        ${jobDescription}`,
    });
  }

  function reset() {
    setMessages([]);
  }

  return { analysisState, analyze, reset };
}
