import React from 'react';

interface ScoreCardProps {
  score: number;
  maxScore: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, maxScore }) => {
  const percentage = (score / maxScore) * 100;

  return (
    <div className="score-card">
      <svg width="100" height="100" viewBox="0 0 36 36" className="circular-chart">
        <path
          className="circle-bg"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="3.8"
        />
        <path
          className="circle"
          strokeDasharray={`${percentage}, 100`}
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#00acc1"
          strokeWidth="3.8"
        />
        <text x="18" y="20.35" className="percentage" fontSize="8" fill="#00acc1" textAnchor="middle">
          {`${Math.round(percentage)}%`}
        </text>
      </svg>
    </div>
  );
};

export default ScoreCard;