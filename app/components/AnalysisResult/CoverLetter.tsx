"use client";

import { useState } from "react";

interface CoverLetterProps {
  coverLetter: string;
}

export default function CoverLetter({ coverLetter }: CoverLetterProps) {
  const [copied, setCopied] = useState(false);

  // Replace literal \n with actual newlines in case the LLM returns escaped strings
  const formatted = coverLetter.replace(/\\n/g, "\n");

  async function handleCopy() {
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-sm">
          Tailored Cover Letter
        </h3>
        <button
          onClick={handleCopy}
          aria-label="Copy cover letter to clipboard"
          className="text-xs text-blue-500 hover:text-blue-700 transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {formatted}
      </p>
    </div>
  );
}
