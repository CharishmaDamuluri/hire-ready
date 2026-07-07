import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ScoreCard from './ScoreCard';

const SomePageComponent: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        {/* Other main content */}
        <ScoreCard />
      </main>
      <Footer />
    </div>
  );
};

export default SomePageComponent;