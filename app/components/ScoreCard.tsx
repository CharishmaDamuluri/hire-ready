import React from 'react';

interface ScoreCardProps {
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const getVerdict = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 50) return 'Average';
    return 'Poor';
  };

  const verdict = getVerdict(score);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <svg className="w-24 h-24 mb-4">
        <circle
          className="text-gray-300"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          r="40"
          cx="50%"
          cy="50%"
        />
        <circle
          className={`text-blue-500 ${score >= 75 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (251.2 * score) / 100}
          r="40"
          cx="50%"
          cy="50%"
        />
      </svg>
      <span className="text-xl font-bold">
        {score}%
      </span>
      <span className="text-lg font-medium mt-2">
        {verdict}
      </span>
    </div>
  );
};

export default ScoreCard;
