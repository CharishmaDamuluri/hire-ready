export type Verdict = "strong fit" | "good fit" | "partial fit" | "weak fit";

export interface AnalysisOutput {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  resumeHighlights: string[];
  coverLetter: string;
  verdict: Verdict;
  summary: string;
}

// discriminated union
// Instead of three boolean to maintain the state of the app which can have only one state at a time
export type AnalysisState =
  | { status: "idle" }
  | { status: "working"; steps: AgentStep[] }
  | { status: "done"; steps: AgentStep[]; result: AnalysisOutput }
  | { status: "error"; message: string };

export interface AgentStep {
  id: number;
  toolName: string;
  label: string;
  detail?: string;
}
