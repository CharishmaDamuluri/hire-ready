import React from 'react';
import PropTypes from 'prop-types';
import './ScoreCard.css';

const ScoreCard = ({ score }) => {
  const size = 100;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  return (
    <div className="score-card">
      <svg
        className="progress-ring"
        height={size}
        width={size}
      >
        <circle
          className="progress-ring__circle"
          stroke="blue"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: progress,
          }}
        />
      </svg>
      <div className="score">{score}</div>
    </div>
  );
};

ScoreCard.propTypes = {
  score: PropTypes.number.isRequired,
};

export default ScoreCard;
