import React from 'react';

const WINNER_CONFIG = {
  player: { icon: '🎉', label: 'You Win!', color: '#3d9956', bg: '#0f2316' },
  model:  { icon: '🤖', label: 'AI Wins!',  color: '#c0392b', bg: '#1e1010' },
  draw:   { icon: '🤝', label: 'Draw!',      color: '#d4a017', bg: '#1e1a0c' },
};

const DiffBadge = ({ diff, winner }) => {
  const color = diff === 0 ? '#3d9956' : diff === 1 ? '#d4a017' : diff <= 3 ? '#e67e22' : '#c0392b';
  return (
    <span className="diff-badge" style={{ color, borderColor: color }}>
      {diff === 0 ? '✓ Exact!' : `±${diff}`}
    </span>
  );
};

const RoundResult = ({
  roundScore, playerGuess, modelGuess, playerName,
  playerPoints, modelPoints, streak, currentRound, totalRounds,
  onNext,
}) => {
  if (!roundScore) return null;

  const { actual, playerDiff, modelDiff, roundWinner, playerPoints: rp, modelPoints: mp } = roundScore;
  const cfg = WINNER_CONFIG[roundWinner];
  const isLast = currentRound >= totalRounds;

  return (
    <div className="round-result" style={{ '--result-bg': cfg.bg }}>
      {/* Winner banner */}
      <div className="result-banner" style={{ borderColor: cfg.color }}>
        <span className="result-icon">{cfg.icon}</span>
        <span className="result-label" style={{ color: cfg.color }}>{cfg.label}</span>
        {rp > 10 && <span className="bonus-label">+{rp - 10} bonus!</span>}
      </div>

      {/* Guess comparison */}
      <div className="guess-comparison">
        <div className={`guess-col ${roundWinner === 'player' ? 'winner-col' : ''}`}>
          <div className="guess-col-title">👤 {playerName}</div>
          <div className="guess-col-value">{playerGuess}</div>
          <DiffBadge diff={playerDiff} />
          {rp > 0 && <div className="pts-earned">+{rp} pts</div>}
        </div>

        <div className="actual-col">
          <div className="guess-col-title">🎯 ACTUAL</div>
          <div className="guess-col-value actual-big">{actual}</div>
          <div className="actual-label">runs</div>
        </div>

        <div className={`guess-col ${roundWinner === 'model' ? 'winner-col' : ''}`}>
          <div className="guess-col-title">🤖 AI Model</div>
          <div className="guess-col-value">{modelGuess}</div>
          <DiffBadge diff={modelDiff} />
          {mp > 0 && <div className="pts-earned model-pts">+{mp} pts</div>}
        </div>
      </div>

      {/* Running score */}
      <div className="running-score">
        <div className="rs-item">
          <span className="rs-name">You</span>
          <span className="rs-pts">{playerPoints}</span>
        </div>
        <div className="rs-sep">:</div>
        <div className="rs-item model">
          <span className="rs-pts">{modelPoints}</span>
          <span className="rs-name">AI</span>
        </div>
      </div>

      {streak > 1 && (
        <div className="streak-badge">
          🔥 {streak}-round win streak!
        </div>
      )}

      <button className="btn-primary full-width next-btn" onClick={onNext}>
        {isLast ? '🏁 See Final Results' : `Next Round →`}
      </button>
    </div>
  );
};

export default RoundResult;
