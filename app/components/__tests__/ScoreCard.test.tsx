import React from 'react';
import { render } from '@testing-library/react';
import ScoreCard from '../ScoreCard';

describe('ScoreCard', () => {
  it('renders the score and verdict correctly', () => {
    const score = 85;
    const verdict = 'Excellent';
    const { getByText } = render(<ScoreCard score={score} verdict={verdict} />);

    expect(getByText(`Score: ${score}`)).toBeInTheDocument();
    expect(getByText(`Verdict: ${verdict}`)).toBeInTheDocument();
  });
});
