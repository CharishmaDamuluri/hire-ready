import React from 'react';

interface ScoreCardProps {
  name: string;
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ name, score }) => {
  return (
    <div className="score-card">
      <h2>{name}</h2>
      <p>Score: {score}</p>
    </div>
  );
};

export default ScoreCard;
