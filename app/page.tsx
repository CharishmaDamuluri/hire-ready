"use client";

import { useState } from "react";
import { useJobAnalysis } from "./hooks/useJobAnalysis";

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
        {isIdle && <></>}
        {/* PROGRESS - Show the steps */}
        {(analysisState.status === "working" ||
          analysisState.status === "done") && <></>}
        {/* DONE - Show results found */}
        {analysisState.status === "done" && <></>}
      </div>
    </main>
  );
}
