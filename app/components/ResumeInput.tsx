"use client";

import { useState } from "react";
import { extractText } from "unpdf";

interface ResumeInputProps {
  value: string;
  onChange: (text: string) => void;
}

type UploadMode = "upload" | "paste";
type UploadStatus = "idle" | "loading" | "done" | "error";

export default function ResumeInput({ value, onChange }: ResumeInputProps) {
  const allowedFileTypes = ".pdf,.txt,.md";
  const [mode, setMode] = useState<UploadMode>("upload");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [fileName, setFileName] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus("loading");
    setFileName(file.name);

    try {
      let text = "";
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const { text: extracted } = await extractText(
          new Uint8Array(arrayBuffer),
          { mergePages: true },
        );
        text = extracted;
      } else {
        text = await file.text();
      }

      if (!text.trim()) throw new Error("No text could be extracted");

      onChange(text);
      setUploadStatus("done");
    } catch (err) {
      console.error(err);
      setUploadStatus("error");
      setFileName("");
    }
  }

  return (
    <section
      aria-label="Resume input"
      className="bg-white border rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 text-sm">Your Resume</h2>
        <div
          role="tablist"
          aria-label="Input mode"
          className="flex gap-1 bg-gray-100 p-1 rounded-lg"
        >
          <button
            role="tab"
            aria-selected={mode === "upload"}
            onClick={() => setMode("upload")}
            className="px-3 py-1 rounded-md text-xs font-medium transition bg-white text-gray-800 shadow-sm"
          >
            Upload File
          </button>
          <button
            role="tab"
            aria-selected={mode === "paste"}
            onClick={() => setMode("paste")}
            className="px-3 py-1 rounded-md text-xs font-medium transition bg-white text-gray-800 shadow-sm"
          >
            Paste text
          </button>
        </div>
        {mode === "upload" && (
          <div className="border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-xl p-6 text-center transition">
            <input
              id="resume-upload"
              type="file"
              accept="allowedFileTypes"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload resume file"
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer block space-y-2"
            >
              {uploadStatus === "loading" && (
                <p className="text-sm text-gray-400">Extracting text...</p>
              )}
              {uploadStatus === "done" && (
                <>
                  <p className="text-sm font-medium text-green-600">
                    ✅ {fileName}
                  </p>
                  <p className="text-xs text-gray-400">Click to replace</p>
                </>
              )}
              {uploadStatus === "error" && (
                <p className="text-sm text-red-500">
                  Failed to read file. Try again.
                </p>
              )}
              {uploadStatus === "idle" && (
                <>
                  <p className="text-2xl">📄</p>
                  <p className="text-sm text-gray-500">
                    Click to upload PDF or text file
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports .pdf .txt .md
                  </p>
                </>
              )}
            </label>
          </div>
        )}
        {mode === "paste" && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste your resume text here..."
            aria-label="Resume text"
            rows={8}
            className="w-full text-sm border rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        )}

        {value && (
          <p className="text-xs text-gray-400" aria-live="polite">
            {value.length.toLocaleString()} characters ready
          </p>
        )}
      </div>
    </section>
  );
}
