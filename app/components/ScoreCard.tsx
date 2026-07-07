import React from 'react';

interface ScoreCardProps {
  score: number;
  verdict: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, verdict }) => {
  return (
    <div className="score-card">
      <div className="score">Score: {score}</div>
      <div className="verdict">Verdict: {verdict}</div>
    </div>
  );
};

export default ScoreCard;