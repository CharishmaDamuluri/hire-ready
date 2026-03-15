import { AgentStep } from "../types/analysis";

interface AgentProgressProps {
  steps: AgentStep[];
  isWorking: boolean;
}

export default function AgentProgress({
  steps,
  isWorking,
}: AgentProgressProps) {
  return (
    <section
      aria-label="Agent progress"
      aria-live="polite"
      className="bg-white border rounded-xl p-5 space-y-3"
    >
      <h2 className="font-semibold text-gray-800 text-sm">
        {isWorking ? "Agent working..." : "✅ Analysis complete"}
      </h2>
      <ol className="space-y-2">
        {steps.map((step) => (
          <li key={step.id} className="flex items-start gap-2 text-sm">
            <span className="text-green-500 mt-0.5" aria-hidden="true">
              ✓
            </span>
            <span className="text-gray-700">
              {step.label}
              {step.detail && (
                <span className="text-gray-400 ml-1 font-normal">
                  {step.detail}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>

      {isWorking && (
        <div
          className="flex items-center gap-2 text-sm text-gray-400"
          aria-label="Loading"
        >
          <span className="animate-spin inline-block">⚙️</span>
          <span>Thinking...</span>
        </div>
      )}
    </section>
  );
}
