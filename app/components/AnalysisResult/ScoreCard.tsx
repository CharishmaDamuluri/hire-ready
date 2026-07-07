"use client";

interface ScoreCardProps {
  matchScore: number;
  verdict: string;
  summary: string;
}

const VERDICT_STYLES: Record<string, string> = {
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
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#f3f4f6"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#10b981"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{
          strokeDashoffset,
          transition: 'stroke-dashoffset 1.2s ease'
        }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className={`text-xl font-bold ${getScoreColor(score)}`}
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
      <div className="flex flex-col items-center">
        <ProgressRing score={matchScore} />
        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium border ${VERDICT_STYLES[verdict]}`}
        >
          {verdict}
        </span>
      </div>
      <div className="text-right space-y-2 flex-1">
        <p className="text-sm text-gray-500 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
