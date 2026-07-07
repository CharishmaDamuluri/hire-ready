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

function ProgressRing({ score }: { score: number }) {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <svg className="w-32 h-32" width={radius * 2} height={radius * 2}>
      <circle
        stroke="gray"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="currentColor"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        className={getScoreColor(score)}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-xl font-bold"
      >
        {score}%
      </text>
    </svg>
  );
}

export default function ScoreCard({
  matchScore,
  verdict,
  summary,
}: ScoreCardProps) {
  return (
    <div className="bg-white border rounded-xl p-6 flex items-center justify-between gap-6">
      <div className="flex items-center flex-col">
        <ProgressRing score={matchScore} />
        <span className="text-sm font-medium mt-2">
          {verdict}
        </span>
      </div>
      <div className="text-right space-y-2 flex-1">
        <p className="text-sm text-gray-500 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
