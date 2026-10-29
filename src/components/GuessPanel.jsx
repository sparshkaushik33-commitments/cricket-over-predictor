import React, { useEffect, useRef } from 'react';

/**
 * Slider + stepper for the player's run guess.
 * Supports keyboard: ← → for ±1, Enter to lock in.
 */
const GuessPanel = ({ guess, setGuess, onLockIn, disabled, modelGuess }) => {
  const sliderRef = useRef(null);

  // Keyboard support
  useEffect(() => {
    const handler = e => {
      if (disabled) return;
      if (e.key === 'ArrowLeft')  setGuess(g => Math.max(0, g - 1));
      if (e.key === 'ArrowRight') setGuess(g => Math.min(36, g + 1));
      if (e.key === 'Enter')      onLockIn();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [disabled, setGuess, onLockIn]);

  const adjust = delta => setGuess(g => Math.max(0, Math.min(36, g + delta)));

  return (
    <div className="guess-panel">
      <div className="guess-header">
        <span className="guess-title">🎯 Your Prediction</span>
        <span className="guess-hint">How many runs in the next over?</span>
      </div>

      {/* Big number display */}
      <div className="guess-display">
        <button
          className="adj-btn"
          onClick={() => adjust(-1)}
          disabled={disabled || guess <= 0}
          aria-label="decrease"
        >−</button>
        <span className="guess-number">{guess}</span>
        <button
          className="adj-btn"
          onClick={() => adjust(1)}
          disabled={disabled || guess >= 36}
          aria-label="increase"
        >+</button>
      </div>

      {/* Slider */}
      <div className="slider-container">
        <input
          ref={sliderRef}
          type="range"
          min={0}
          max={36}
          value={guess}
          disabled={disabled}
          onChange={e => setGuess(Number(e.target.value))}
          className="guess-slider"
          style={{ '--pct': `${(guess / 36) * 100}%` }}
        />
        <div className="slider-labels">
          <span>0</span>
          <span>9</span>
          <span>18</span>
          <span>27</span>
          <span>36</span>
        </div>
      </div>

      {/* Bands hint */}
      <div className="run-bands">
        <span className="band tight">Tight (0-5)</span>
        <span className="band average">Average (6-10)</span>
        <span className="band big">Big (11-18)</span>
        <span className="band monster">Monster (19+)</span>
      </div>

      <button
        className={`btn-primary full-width lock-btn ${disabled ? 'locked' : ''}`}
        onClick={onLockIn}
        disabled={disabled}
      >
        {disabled ? '✅ Locked In' : '🔒 Lock In'}
      </button>

      <p className="keyboard-hint">← → to adjust · Enter to lock in</p>
    </div>
  );
};

export default GuessPanel;
