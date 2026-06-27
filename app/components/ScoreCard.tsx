import React from 'react';

type ScoreCardProps = {
  score: number;
  playerName: string;
};

const ScoreCard: React.FC<ScoreCardProps> = ({ score, playerName }) => {
  return (
    <div className="score-card">
      <h2>{playerName}</h2>
      <p>Score: {score}</p>
    </div>
  );
};

export default ScoreCard;