import React, { useState, useEffect, useRef } from 'react';
import HowToPlay from './HowToPlay.jsx';
import Leaderboard from './Leaderboard.jsx';
import { DIFFICULTY_LEVELS } from '../logic/predictionModel.js';

const DIFF_ORDER = ['easy', 'medium', 'hard', 'expert'];
const ROUND_OPTIONS = [5, 10, 15];

const StartScreen = ({
  playerName, setPlayerName,
  totalRounds, setTotalRounds,
  difficulty, setDifficulty,
  onStart, leaderboard,
}) => {
  const [showHTP, setShowHTP] = useState(false);
  const [showLB, setShowLB]   = useState(false);
  const [error, setError]     = useState('');
  const [bestScore, setBestScore] = useState(null);
  const inputRef = useRef(null);

  // Check localStorage for personal best score
  useEffect(() => {
    try {
      if (leaderboard && leaderboard.length > 0) {
        const top = Math.max(...leaderboard.map(e => Number(e.points) || 0));
        setBestScore(top);
      } else {
        const saved = localStorage.getItem('cricket_over_predictor_lb');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const top = Math.max(...parsed.map(e => Number(e.points) || 0));
            setBestScore(top);
          }
        }
      }
    } catch {
      // ignore storage error
    }
  }, [leaderboard]);

  const isNameValid = playerName.trim().length > 0;

  const handleStart = () => {
    const trimmed = playerName.trim();
    if (!trimmed) {
      setError('Please enter your name to begin');
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    setError('');
    onStart(trimmed, totalRounds, difficulty);
  };

  // Keyboard navigation for difficulty radiogroup
  const handleDiffKeyDown = (e, currentKey) => {
    const currentIndex = DIFF_ORDER.indexOf(currentKey);
    let targetIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (currentIndex + 1) % DIFF_ORDER.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (currentIndex - 1 + DIFF_ORDER.length) % DIFF_ORDER.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = DIFF_ORDER.length - 1;
    }

    if (targetIndex !== null) {
      const nextKey = DIFF_ORDER[targetIndex];
      setDifficulty(nextKey);
      const nextEl = document.getElementById(`diff-btn-${nextKey}`);
      if (nextEl) nextEl.focus();
    }
  };

  // Keyboard navigation for rounds radiogroup
  const handleRoundsKeyDown = (e, currentRounds) => {
    const currentIndex = ROUND_OPTIONS.indexOf(currentRounds);
    let targetIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (currentIndex + 1) % ROUND_OPTIONS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (currentIndex - 1 + ROUND_OPTIONS.length) % ROUND_OPTIONS.length;
    }

    if (targetIndex !== null) {
      const nextRounds = ROUND_OPTIONS[targetIndex];
      setTotalRounds(nextRounds);
      const nextEl = document.getElementById(`rounds-btn-${nextRounds}`);
      if (nextEl) nextEl.focus();
    }
  };

  const activeDiff = DIFFICULTY_LEVELS[difficulty] || DIFFICULTY_LEVELS.medium;

  return (
    <main className="start-screen" role="main">
      {/* Ambient background crease lines & atmosphere */}
      <div className="pitch-crease-bg" aria-hidden="true">
        <svg viewBox="0 0 800 600" className="pitch-crease-svg" preserveAspectRatio="xMidYMid slice">
          {/* Outer pitch corridor */}
          <rect x="220" y="40" width="360" height="520" fill="none" stroke="rgba(74, 222, 128, 0.05)" strokeWidth="1.5" rx="6" />
          {/* Popping crease lines */}
          <line x1="160" y1="130" x2="640" y2="130" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="2" />
          <line x1="160" y1="470" x2="640" y2="470" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="2" />
          {/* Bowling creases */}
          <line x1="240" y1="105" x2="560" y2="105" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2.5" />
          <line x1="240" y1="495" x2="560" y2="495" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2.5" />
          {/* Return creases */}
          <line x1="240" y1="80" x2="240" y2="130" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" />
          <line x1="560" y1="80" x2="560" y2="130" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" />
          <line x1="240" y1="470" x2="240" y2="520" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" />
          <line x1="560" y1="470" x2="560" y2="520" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" />
          {/* Pitch center axis */}
          <line x1="400" y1="130" x2="400" y2="470" stroke="rgba(74, 222, 128, 0.05)" strokeWidth="1.5" strokeDasharray="8 8" />
        </svg>
      </div>

      {/* Floating subtle ambient balls */}
      <div className="ambient-spotlight" aria-hidden="true" />
      <div className="ambient-ball ambient-ball-1" aria-hidden="true" />
      <div className="ambient-ball ambient-ball-2" aria-hidden="true" />

      {/* Hero / Branding */}
      <section className="start-hero" aria-label="Game introduction">
        <div className="hero-logo-wrapper">
          <svg
            viewBox="0 0 64 64"
            width="56"
            height="56"
            className="hero-logo-svg"
            aria-label="Cricket bat and ball logo"
            role="img"
          >
            {/* Cricket Bat */}
            <g transform="rotate(-32 30 30)">
              {/* Rubber handle */}
              <rect x="28" y="2" width="6" height="18" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1" />
              <line x1="28" y1="6" x2="34" y2="6" stroke="#fef3c7" strokeWidth="1" />
              <line x1="28" y1="10" x2="34" y2="10" stroke="#fef3c7" strokeWidth="1" />
              <line x1="28" y1="14" x2="34" y2="14" stroke="#fef3c7" strokeWidth="1" />
              {/* Willow blade */}
              <path d="M26 20 C26 18, 36 18, 36 20 L37 54 C37 57, 35 59, 31 59 C27 59, 25 57, 25 54 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
              <line x1="31" y1="22" x2="31" y2="54" stroke="#d97706" strokeWidth="1" strokeDasharray="3 2" />
            </g>
            {/* Cricket Ball */}
            <circle cx="44" cy="42" r="11" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
            {/* Seam stitches */}
            <path d="M36 36 C42 41, 45 45, 52 48" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeDasharray="2 1.5" />
            {/* Gloss highlight */}
            <ellipse cx="40" cy="38" rx="3.5" ry="1.8" fill="#fca5a5" opacity="0.65" transform="rotate(-28 40 38)" />
          </svg>
        </div>

        <h1 className="game-title">Cricket Over Predictor</h1>
        <p className="game-subtitle">Predict runs. Beat the model. Become a legend.</p>
      </section>

      {/* Start Game Setup Card */}
      <section className="start-card" aria-label="Game setup">
        {/* 1. Name Input */}
        <div className="form-group">
          <div className="label-row">
            <label htmlFor="player-name">Your Name</label>
            {playerName.length > 14 && (
              <span className="char-counter" aria-hidden="true">{playerName.length}/20</span>
            )}
          </div>
          <div className="input-wrapper">
            <svg
              className="input-leading-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <input
              ref={inputRef}
              id="player-name"
              className={`text-input with-icon ${error ? 'has-error' : ''}`}
              type="text"
              placeholder="e.g. Virat K."
              value={playerName}
              onChange={e => {
                if (error) setError('');
                setPlayerName(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleStart();
                }
              }}
              maxLength={20}
              autoFocus
              aria-required="true"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'name-error-msg' : undefined}
            />
          </div>
          {error && (
            <span id="name-error-msg" className="input-error" role="alert">
              <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13" aria-hidden="true">
                <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm.75-10.25v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 011.5 0zM8 12a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {error}
            </span>
          )}
        </div>

        {/* 2. Rounds Selector */}
        <div className="form-group">
          <label id="rounds-label">Number of Rounds</label>
          <div
            className="rounds-selector"
            role="radiogroup"
            aria-labelledby="rounds-label"
          >
            {ROUND_OPTIONS.map(r => {
              const isSelected = totalRounds === r;
              return (
                <button
                  key={r}
                  id={`rounds-btn-${r}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  className={`rounds-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setTotalRounds(r)}
                  onKeyDown={e => handleRoundsKeyDown(e, r)}
                >
                  <span className="rounds-num">{r}</span>
                  <span className="rounds-sub">overs</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. AI Difficulty Selector */}
        <div className="form-group">
          <label id="diff-label">AI Difficulty</label>
          <div
            className="difficulty-grid"
            role="radiogroup"
            aria-labelledby="diff-label"
          >
            {DIFF_ORDER.map((key, idx) => {
              const d = DIFFICULTY_LEVELS[key];
              const isSelected = difficulty === key;
              return (
                <button
                  key={key}
                  id={`diff-btn-${key}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  className={`diff-card-btn ${isSelected ? 'active' : ''} diff-theme-${key}`}
                  style={{ '--diff-color': d.color }}
                  onClick={() => setDifficulty(key)}
                  onKeyDown={e => handleDiffKeyDown(e, key)}
                  aria-label={`${d.label} difficulty: ${d.description}`}
                >
                  {/* 4-segment difficulty meter */}
                  <div className="diff-meter" aria-hidden="true">
                    {[1, 2, 3, 4].map(seg => (
                      <span
                        key={seg}
                        className={`diff-meter-bar ${seg <= idx + 1 ? 'filled' : ''}`}
                      />
                    ))}
                  </div>

                  <div className="diff-label-row">
                    <span className="diff-dot" aria-hidden="true" />
                    <span className="diff-name">{d.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Difficulty description helper info strip */}
          <div
            className="diff-info-strip"
            key={difficulty}
            role="status"
            aria-live="polite"
          >
            <svg
              className="diff-info-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="16"
              height="16"
              aria-hidden="true"
              style={{ color: activeDiff.color }}
            >
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="diff-info-text">{activeDiff.description}</span>
          </div>
        </div>

        {/* 4. Primary CTA Button */}
        <div className="cta-wrapper">
          <button
            type="button"
            className={`btn-start-cta ${isNameValid ? 'ready' : 'empty'}`}
            disabled={!isNameValid}
            onClick={handleStart}
            aria-label="Start Game"
          >
            <svg
              className="cta-arrow-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            <span>Start Game</span>
          </button>
          {!isNameValid && (
            <p className="cta-helper-text" aria-live="polite">
              Enter your name to begin
            </p>
          )}
        </div>

        {/* 5. Secondary Actions */}
        <div className="start-actions-row">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setShowHTP(true)}
            aria-label="Open how to play guide"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>How to Play</span>
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={() => setShowLB(true)}
            aria-label="Open leaderboard"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h10v3a5 5 0 01-10 0V4zM3 6a2 2 0 002 2h0M17 6a2 2 0 01-2 2h0M10 12v4m-4 0h8" />
            </svg>
            <span>Leaderboard</span>
          </button>
        </div>
      </section>

      {/* Social Proof & Context Stat Chips */}
      <footer className="start-stat-chips" aria-label="Game features">
        <div className="stat-chip">
          <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15" aria-hidden="true">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <span>T20 Situations</span>
        </div>

        <div className="stat-chip">
          <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15" aria-hidden="true">
            <path d="M13 7H7v6h6V7z" />
            <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5v10h10V5H5z" clipRule="evenodd" />
          </svg>
          <span>Beat the AI</span>
        </div>

        <div className="stat-chip">
          <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15" aria-hidden="true">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Top 10 Leaderboard</span>
        </div>

        {bestScore !== null && (
          <div className="stat-chip stat-chip-best">
            <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Your Best: <strong>{bestScore} pts</strong></span>
          </div>
        )}
      </footer>

      {showHTP && <HowToPlay onClose={() => setShowHTP(false)} />}
      {showLB  && <Leaderboard entries={leaderboard} onClose={() => setShowLB(false)} />}
    </main>
  );
};

export default StartScreen;
