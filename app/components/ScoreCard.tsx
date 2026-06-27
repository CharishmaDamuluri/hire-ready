import React from 'react';
import PropTypes from 'prop-types';
import { ProgressRing, Container, Score, Verdict } from './styledComponents';

const getScoreVerdict = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 50) return 'Good';
  return 'Needs Improvement';
};

const ScoreCard = ({ score }) => (
  <Container>
    <ProgressRing score={score} />
    <Score>{score}</Score>
    <Verdict>{getScoreVerdict(score)}</Verdict>
  </Container>
);

ScoreCard.propTypes = {
  score: PropTypes.number.isRequired,
};

export default ScoreCard;