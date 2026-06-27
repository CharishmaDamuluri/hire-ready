import React from 'react';
import './ScoreCard.css';

const ScoreCard = ({ score, maxScore }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / maxScore) * circumference;

  return (
    <div className="score-card">
      <svg
        className="progress-ring"
        width="120"
        height="120"
      >
        <circle
          className="progress-ring__circle"
          stroke="#4caf50"
          fill="transparent"
          strokeWidth="12"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          r={radius}
          cx="60"
          cy="60"
        />
      </svg>
      <div className="score">{score} / {maxScore}</div>
    </div>
  );
};

export default ScoreCard;
