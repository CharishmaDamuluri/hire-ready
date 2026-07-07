import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Typography, Box } from '@mui/material';

interface ScoreCardProps {
  teamName: string;
  matchScore: number;
  maxScore: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ teamName, matchScore, maxScore }) => {
  const scorePercentage = (matchScore / maxScore) * 100;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      <Typography variant="h6">{teamName}</Typography>
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" value={scorePercentage} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">
            {`${Math.round(scorePercentage)}%`}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="textSecondary">
        Score: {matchScore} / {maxScore}
      </Typography>
    </Box>
  );
};

ScoreCard.propTypes = {
  teamName: PropTypes.string.isRequired,
  matchScore: PropTypes.number.isRequired,
  maxScore: PropTypes.number.isRequired,
};

export default ScoreCard;
