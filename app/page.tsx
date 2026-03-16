"use client";

import { useState } from "react";
import { useJobAnalysis } from "./hooks/useJobAnalysis";
import ResumeInput from "./components/ResumeInput";
import JobInput from "./components/JobDescription";
import AgentProgress from "./components/AgentProgress";
import AnalysisResult from "./components/AnalysisResult";
import ErrorState from "./components/ErrorState";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const { analysisState, analyze, reset } = useJobAnalysis();
  const [resumeReady, setResumeReady] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const canAnalyze = resumeReady && jobDescription.trim().length > 0;
  const showResults = analysisState.status === "done";
  const showProgress = analysisState.status === "working";
  const showError = analysisState.status === "error";

  function handleAnalyze() {
    if (!canAnalyze) return;
    reset();
    setAnalyzing(true);
    analyze(resume, jobDescription);
  }

  // Try another job - keep resume, just reset analysis
  function handleTryAnotherJob() {
    setAnalyzing(false);
    setJobDescription("");
  }

  // Full reset — new resume needed
  async function handleStartOver() {
    await fetch("/api/clear", { method: "DELETE" });
    setAnalyzing(false);
    setResume("");
    setJobDescription("");
    setResumeReady(false);
    window.location.reload();
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

        {/* Resume upload — always visible, locked after upload */}
        <div
          className={`transition ${resumeReady ? "opacity-60 pointer-events-none" : ""}`}
        >
          <ResumeInput
            value={resume}
            onChange={(text) => {
              setResume(text);
              setResumeReady(true);
            }}
          />
        </div>

        {/* Resume ready indicator + change option */}
        {resumeReady && (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <p className="text-sm text-green-700 font-medium">
              Resume loaded — you can analyze multiple jobs without re-uploading
            </p>
            <button
              onClick={handleStartOver}
              className="text-xs text-green-600 hover:text-green-800 underline"
            >
              Use a different resume
            </button>
          </div>
        )}

        {!analyzing && (
          <JobInput value={jobDescription} onChange={setJobDescription} />
        )}

        {!analyzing && (
          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              aria-disabled={!canAnalyze}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-xl text-sm transition"
            >
              {resumeReady ? "Analyze Match" : "Upload resume first"}
            </button>
          </div>
        )}

        {/* ERROR */}
        {showError && (
          <ErrorState
            message={analysisState.message}
            onRetry={handleTryAnotherJob}
          />
        )}
        {/* PROGRESS - Show the steps */}
        {(showProgress || showResults) && (
          <AgentProgress steps={analysisState.steps} isWorking={showProgress} />
        )}
        {/* DONE - Show results found */}
        {showResults && (
          <>
            <AnalysisResult result={analysisState.result} />

            {/* Two actions after results */}
            <div className="flex justify-center gap-6">
              <button
                onClick={handleTryAnotherJob}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-6 py-2 rounded-xl text-sm transition"
              >
                Try another job description
              </button>
              <button
                onClick={handleStartOver}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
              >
                Use a different resume
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
