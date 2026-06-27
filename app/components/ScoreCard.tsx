import React from 'react';

interface ScoreCardProps {
  score: number;
  name: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, name }) => {
  return (
    <div className="score-card">
      <h1>{name}'s Score</h1>
      <p>{score}</p>
    </div>
  );
};

export default ScoreCard;
