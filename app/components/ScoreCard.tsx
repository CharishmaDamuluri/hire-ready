import React from 'react';

interface ScoreCardProps {
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const getVerdict = (score: number): string => {
    if (score > 75) return 'Excellent';
    if (score > 50) return 'Good';
    if (score > 25) return 'Average';
    return 'Poor';
  };

  const getVerdictLabelClass = (score: number): string => {
    if (score > 75) return 'text-green-600';
    if (score > 50) return 'text-blue-600';
    if (score > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full border-4 border-gray-400" style={{ clip: 'rect(0 32px 32px 16px)' }}></div>
        <div className="absolute w-full h-full rounded-full border-4 border-current" style={{ clip: 'rect(0 32px 32px 16px)', transform: `rotate(${(score / 100) * 360}deg)` }}></div>
        <span className="absolute text-lg font-semibold">{score}%</span>
      </div>
      <span className={`mt-2 text-lg font-medium ${getVerdictLabelClass(score)}`}>{getVerdict(score)}</span>
    </div>
  );
};

export default ScoreCard;
