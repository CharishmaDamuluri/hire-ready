import React from 'react';

interface ScoreCardProps {
  score: number;
  maxScore: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, maxScore }) => {
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="absolute w-full h-full">
        <circle
          className="text-gray-300"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r="36"
          cx="50%"
          cy="50%"
        />
        <circle
          className="text-blue-500"
          strokeWidth="4"
          strokeDasharray="226.2"
          strokeDashoffset={226.2 - (226.2 * percentage) / 100}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="36"
          cx="50%"
          cy="50%"
        />
      </svg>
      <div className="text-center font-bold text-xl">
        {percentage}%
      </div>
    </div>
  );
};

export default ScoreCard;
