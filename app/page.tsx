"use client";

import { useState } from "react";
import { useJobAnalysis } from "./hooks/useJobAnalysis";
import ResumeInput from "./components/ResumeInput";
import JobInput from "./components/JobDescription";
import AgentProgress from "./components/AgentProgress";
import AnalysisResult from "./components/AnalysisResult";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const { analysisState, analyze } = useJobAnalysis();

  const isIdle = analysisState.status === "idle";
  const canAnalyze =
    resume.trim().length > 0 && jobDescription.trim().length > 0;

  function handleAnalyze() {
    if (!canAnalyze) return;
    analyze(resume, jobDescription);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">HireReady</h1>
          <p className="text-gray-500 text-sm">
            AI-powered job application analyzer
          </p>
        </header>

        {/* IDLE - Show job input, resume input and analyze match button */}
        {isIdle && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResumeInput value={resume} onChange={setResume} />
              <JobInput value={jobDescription} onChange={setJobDescription} />
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                aria-disabled={!canAnalyze}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-xl text-sm transition"
              >
                Analyze Match
              </button>
            </div>
          </>
        )}
        {/* PROGRESS - Show the steps */}
        {analysisState.status === "working" && (
          <AgentProgress
            steps={analysisState.steps}
            isWorking={analysisState.status === "working"}
          />
        )}
        {/* DONE - Show results found */}
        {analysisState.status === "done" && (
          <>
            <AnalysisResult result={analysisState.result} />
            <div className="flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
              >
                Start over
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
