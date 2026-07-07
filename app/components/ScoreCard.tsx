import React from 'react';
import { CircularProgress } from '@material-ui/core';

interface ScoreCardProps {
  score: number;
  maxScore: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, maxScore }) => {
  const percentage = (score / maxScore) * 100;
  const verdict = percentage > 75 ? 'Excellent' : percentage > 50 ? 'Good' : 'Needs Improvement';

  return (
    <div className="score-card">
      <CircularProgress variant="determinate" value={percentage} />
      <div className="score">{score} / {maxScore}</div>
      <div className="verdict">{verdict}</div>
    </div>
  );
};

export default ScoreCard;