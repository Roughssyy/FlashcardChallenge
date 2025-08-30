import React, { useEffect, useState } from 'react';
import { renderWidget } from '@remnote/plugin-sdk';
import { SessionTracker, SessionSnapshot } from './tracker';

declare global {
  interface Window {
    tracker: SessionTracker;
  }
}

const StatsWidget: React.FC = () => {
  const tracker = window.tracker;
  const [stats, setStats] = useState<SessionSnapshot>(tracker.snapshot());

  useEffect(() => {
    const listener = () => setStats(tracker.snapshot());
    tracker.onUpdate(listener);
    return () => tracker.offUpdate(listener);
  }, [tracker]);

  return (
    <div style={{ padding: 8 }}>
      <h3>Session Stats</h3>
      <div>Duration: {stats.duration}s</div>
      <div>Correct: {stats.correct}</div>
      <div>Incorrect: {stats.incorrect}</div>
      <div>Rate: {stats.rate.toFixed(2)} cards/min</div>
      <div>Top Rate: {stats.topRate.toFixed(2)} cards/min</div>
    </div>
  );
};

renderWidget(StatsWidget as any);
