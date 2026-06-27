import React from 'react';

interface ScoreCardProps {
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const strokeDasharray = `${score} ${100 - score}`;

  return (
    <div className="score-card">
      <svg className="progress-ring" width="120" height="120">
        <circle
          className="progress-ring__circle"
          stroke="blue"
          strokeWidth="4"
          fill="transparent"
          r="54"
          cx="60"
          cy="60"
          style={{ strokeDasharray }}
        />
      </svg>
      <div className="score-card__percentage">
        {score}%
      </div>
    </div>
  );
};

export default ScoreCard;
