// app/components/ScoreCard.tsx
import React from 'react';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, maxScore }) => {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 truncate">{title}</h3>
          <p className="text-sm text-gray-500">Score</p>
        </div>
      </div>
      <div className="flex">
        <span className="text-3xl font-extrabold text-indigo-600">{score}</span>
        <span className="ml-1 text-xl text-gray-500">/ {maxScore}</span>
      </div>
    </div>
  );
};

export default ScoreCard;