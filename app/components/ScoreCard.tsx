import React from 'react';
import './ScoreCard.css';

interface ScoreCardProps {
  score: number;
  maxScore: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, maxScore }) => {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  return (
    <div className="score-card">
      <h2>Your Score</h2>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="progress-ring"
      >
        <circle
          stroke="tomato"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="score">
        {score} / {maxScore}
      </div>
    </div>
  );
};

export default ScoreCard;