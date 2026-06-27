import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ScoreCard from '../ScoreCard';

jest.mock('app/hooks/useScores', () => ({
  useScores: () => ({
    scores: [85, 90, 78],
  }),
}));

describe('ScoreCard Component', () => {
  test('renders with correct initial scores', () => {
    const { getByText } = render(<ScoreCard />);
    expect(getByText('85')).toBeInTheDocument();
    expect(getByText('90')).toBeInTheDocument();
    expect(getByText('78')).toBeInTheDocument();
  });

  test('updates display when new score is added', () => {
    const { getByText, getByRole } = render(<ScoreCard />);
    const addButton = getByRole('button', { name: /add score/i });
    fireEvent.click(addButton);
    expect(getByText('New Score: 95')).toBeInTheDocument();
  });

  test('removes score when delete is clicked', () => {
    const { getByText, queryByText } = render(<ScoreCard />);
    const deleteButton = getByText('Delete 78');
    fireEvent.click(deleteButton);
    expect(queryByText('78')).not.toBeInTheDocument();
  });
});