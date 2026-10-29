import React from 'react';
import { useGameState, GAME_PHASE } from './hooks/useGameState.js';
import { DIFFICULTY_LEVELS } from './logic/predictionModel.js';
import StartScreen    from './components/StartScreen.jsx';
import Scoreboard     from './components/Scoreboard.jsx';
import GuessPanel     from './components/GuessPanel.jsx';
import OverAnimation  from './components/OverAnimation.jsx';
import RoundResult    from './components/RoundResult.jsx';
import EndScreen      from './components/EndScreen.jsx';
import './App.css';

function App() {
  const g = useGameState();

  return (
    <div className="app-root">
      {/* ── Start Screen ───────────────────────────────────── */}
      {g.phase === GAME_PHASE.START && (
        <StartScreen
          playerName={g.playerName}
          setPlayerName={g.setPlayerName}
          totalRounds={g.totalRounds}
          setTotalRounds={g.setTotalRounds}
          difficulty={g.difficulty}
          setDifficulty={g.setDifficulty}
          onStart={g.startGame}
          leaderboard={g.leaderboard}
        />
      )}

      {/* ── Active Game ─────────────────────────────────────── */}
      {(g.phase === GAME_PHASE.GUESSING ||
        g.phase === GAME_PHASE.ANIMATING ||
        g.phase === GAME_PHASE.ROUND_RESULT) && g.situation && (
        <div className="game-layout">
          {/* Top bar */}
          <header className="game-header">
            <div className="header-score">
              <span className="hs-player">
                👤 {g.playerName}: <strong>{g.playerPoints}</strong>
              </span>
              <span className="hs-vs">vs</span>
              <span className="hs-model">
                🤖 AI: <strong>{g.modelPoints}</strong>
              </span>
            </div>
            <div className="header-meta">
              <span className="round-pill">Round {g.currentRound} / {g.totalRounds}</span>
              <span
                className="diff-pill"
                style={{ '--diff-color': DIFFICULTY_LEVELS[g.difficulty]?.color }}
              >
                {DIFFICULTY_LEVELS[g.difficulty]?.label}
              </span>
              {g.streak > 1 && <span className="streak-pill">🔥 {g.streak}</span>}
              <button
                className="mute-btn"
                onClick={() => g.setMuted(m => !m)}
                title={g.muted ? 'Unmute' : 'Mute'}
              >
                {g.muted ? '🔇' : '🔊'}
              </button>
            </div>
          </header>

          <main className="game-main">
            {/* Scoreboard always visible during active game */}
            <Scoreboard situation={g.situation} />

            {/* Guess panel — shown during guessing */}
            {g.phase === GAME_PHASE.GUESSING && (
              <div className="guess-section">
                <GuessPanel
                  guess={g.playerGuess}
                  setGuess={g.setPlayerGuess}
                  onLockIn={g.lockIn}
                  disabled={false}
                  modelGuess={null}
                />
              </div>
            )}

            {/* Over animation — shown during animating */}
            {(g.phase === GAME_PHASE.ANIMATING || g.phase === GAME_PHASE.ROUND_RESULT) && (
              <div className="anim-section">
                {/* Show locked-in guesses side by side while animating */}
                <div className="locked-guesses">
                  <div className="lg-item player">
                    <span className="lg-label">👤 {g.playerName}</span>
                    <span className="lg-val">{g.playerGuess}</span>
                  </div>
                  <div className="lg-sep">vs</div>
                  <div className="lg-item model">
                    <span className="lg-label">🤖 AI Model</span>
                    <span className="lg-val">{g.modelGuess}</span>
                  </div>
                </div>

                <OverAnimation
                  balls={g.animatedBalls}
                  totalRuns={g.overResult?.totalRuns}
                  isAnimating={g.phase === GAME_PHASE.ANIMATING}
                />
              </div>
            )}

            {/* Round result */}
            {g.phase === GAME_PHASE.ROUND_RESULT && (
              <RoundResult
                roundScore={g.roundScore}
                playerGuess={g.playerGuess}
                modelGuess={g.modelGuess}
                playerName={g.playerName}
                playerPoints={g.playerPoints}
                modelPoints={g.modelPoints}
                streak={g.streak}
                currentRound={g.currentRound}
                totalRounds={g.totalRounds}
                onNext={g.nextRound}
              />
            )}
          </main>
        </div>
      )}

      {/* ── End Screen ──────────────────────────────────────── */}
      {g.phase === GAME_PHASE.END && (
        <EndScreen
          playerName={g.playerName}
          playerPoints={g.playerPoints}
          modelPoints={g.modelPoints}
          stats={g.stats}
          history={g.history}
          leaderboard={g.leaderboard}
          onPlayAgain={g.playAgain}
        />
      )}
    </div>
  );
}

export default App;
