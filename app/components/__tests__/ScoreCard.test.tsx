import React from 'react';
import { render } from '@testing-library/react';
import ScoreCard from '../ScoreCard';

// Mock the CircularProgress component
jest.mock('@mui/material/CircularProgress', () => (props) => (
  <div data-testid="circular-progress">Circular Progress</div>
));

// Helper to validate if CircularProgress is rendered
const isCircularProgressRendered = (container) => container.querySelector('[data-testid="circular-progress"]');

describe('ScoreCard Component', () => {
  it('renders correctly', () => {
    const { container } = render(<ScoreCard score={75} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders a circular progress ring', () => {
    const { container } = render(<ScoreCard score={75} showProgress />);
    expect(isCircularProgressRendered(container)).not.toBeNull();
  });
});