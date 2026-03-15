import { AnalysisOutput, Verdict } from "@/app/types/analysis";

interface ScoreCardProps {
  matchScore: AnalysisOutput["matchScore"];
  verdict: Verdict;
  summary: AnalysisOutput["summary"];
}

const VERDICT_STYLES: Record<Verdict, string> = {
  "strong fit": "bg-green-100 text-green-700 border-green-200",
  "good fit": "bg-blue-100 text-blue-700 border-blue-200",
  "partial fit": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "weak fit": "bg-red-100 text-red-700 border-red-200",
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

export default function ScoreCard({
  matchScore,
  verdict,
  summary,
}: ScoreCardProps) {
  return (
    <div className="bg-white border rounded-xl p-6 flex items-center justify-between gap-6">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
          Match Score
        </p>
        <p
          className={`text-6xl font-bold ${getScoreColor(matchScore)}`}
          aria-label={`Match score ${matchScore} percent`}
        >
          {matchScore}%
        </p>
      </div>
      <div className="text-right space-y-2 flex-1">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${VERDICT_STYLES[verdict]}`}
        >
          {verdict}
        </span>
        <p className="text-sm text-gray-500 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
