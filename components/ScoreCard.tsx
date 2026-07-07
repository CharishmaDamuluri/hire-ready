import React from 'react';

type ScoreCardProps = {
  score: number;
  verdict: string;
};

const ScoreCard: React.FC<ScoreCardProps> = ({ score, verdict }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <svg width="120" height="120" className="mb-2">
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#e5e7eb"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#4f46e5"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="text-lg font-medium text-center">{verdict}</div>
    </div>
  );
};

export default ScoreCard;
