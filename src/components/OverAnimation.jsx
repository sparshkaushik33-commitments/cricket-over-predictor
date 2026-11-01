import React from 'react';
import { OUTCOME_TYPES } from '../logic/overSimulator.js';

const BALL_COLORS = {
  [OUTCOME_TYPES.DOT]:    { bg: '#1e2e22', text: '#6b836e', label: '•' },
  [OUTCOME_TYPES.ONE]:    { bg: '#132e1b', text: '#a3b8a8', label: '1' },
  [OUTCOME_TYPES.TWO]:    { bg: '#1a3a25', text: '#c4a86c', label: '2' },
  [OUTCOME_TYPES.THREE]:  { bg: '#1a3a25', text: '#e8d5a3', label: '3' },
  [OUTCOME_TYPES.FOUR]:   { bg: '#1a3d5a', text: '#6db3e8', label: '4' },
  [OUTCOME_TYPES.SIX]:    { bg: '#3d1a5a', text: '#c9a0e8', label: '6' },
  [OUTCOME_TYPES.WICKET]: { bg: '#5a1a1a', text: '#f5b7b1', label: 'W' },
  [OUTCOME_TYPES.WIDE]:   { bg: '#4a3a1a', text: '#f0c430', label: 'Wd' },
  [OUTCOME_TYPES.NO_BALL]:{ bg: '#4a2e1a', text: '#e8a55a', label: 'Nb' },
};

const BALL_EMOJI = {
  [OUTCOME_TYPES.DOT]:     '·',
  [OUTCOME_TYPES.ONE]:     '1️⃣',
  [OUTCOME_TYPES.TWO]:     '2️⃣',
  [OUTCOME_TYPES.THREE]:   '3️⃣',
  [OUTCOME_TYPES.FOUR]:    '🔵',
  [OUTCOME_TYPES.SIX]:     '💥',
  [OUTCOME_TYPES.WICKET]:  '🔴',
  [OUTCOME_TYPES.WIDE]:    '↔️',
  [OUTCOME_TYPES.NO_BALL]: '⚡',
};

const BallChip = ({ outcome, index }) => {
  const style = BALL_COLORS[outcome.type] || BALL_COLORS[OUTCOME_TYPES.DOT];
  return (
    <div
      className="ball-chip pop-in"
      style={{
        background: style.bg,
        color: style.text,
        animationDelay: `${index * 0.05}s`,
      }}
      title={outcome.type}
    >
      <span className="ball-label">{style.label}</span>
    </div>
  );
};

const OverAnimation = ({ balls, totalRuns, isAnimating }) => {
  // Only show legal balls for the over count
  const legalBalls = balls.filter(b => !b.isExtra);

  return (
    <div className="over-animation">
      <div className="over-anim-header">
        <span className="over-anim-title">⚡ Over in Progress</span>
        {totalRuns !== undefined && !isAnimating && (
          <span className="over-total-badge">{totalRuns} runs</span>
        )}
      </div>

      {/* Over diagram — 6 slots */}
      <div className="over-slots">
        {Array.from({ length: 6 }).map((_, i) => {
          const legalCount = balls.filter((b, bi) => {
            let cnt = 0;
            for (let j = 0; j <= bi; j++) if (!balls[j].isExtra) cnt++;
            return !b.isExtra && cnt === i + 1;
          });
          const ball = legalCount[0];
          return (
            <div key={i} className={`over-slot ${ball ? 'filled' : 'empty'}`}>
              {ball ? (
                <BallChip outcome={ball} index={i} />
              ) : (
                <div className="ball-placeholder">{i + 1}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Full ball sequence including extras */}
      <div className="ball-sequence">
        {balls.map((b, i) => (
          <span
            key={i}
            className="ball-seq-item pop-in"
            style={{ animationDelay: `${i * 0.05}s` }}
            title={b.type}
          >
            {BALL_EMOJI[b.type] || '·'}
            {b.isExtra && <span className="extra-badge">+1</span>}
          </span>
        ))}
      </div>

      {isAnimating && (
        <div className="bowling-indicator">
          <div className="bowling-dot" />
          <div className="bowling-dot" style={{ animationDelay: '0.2s' }} />
          <div className="bowling-dot" style={{ animationDelay: '0.4s' }} />
        </div>
      )}
    </div>
  );
};

export default OverAnimation;
