import React from 'react';

interface ScoreCardProps {
  score: number;
  verdict: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, verdict }) => {
  const getProgressRingColor = (score: number) => {
    if (score > 75) return 'text-green-500';
    if (score > 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg className={`w-32 h-32 ${getProgressRingColor(score)}`} viewBox="0 0 36 36">
          <path
            className="stroke-current"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{score}%</span>
        </div>
      </div>
      <div className="mt-4">
        <span className="text-lg text-gray-700">{verdict}</span>
      </div>
    </div>
  );
};

export default ScoreCard;
