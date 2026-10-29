import React from 'react';

const EndScreen = ({ playerName, playerPoints, modelPoints, stats, history, leaderboard, onPlayAgain }) => {
  const playerWon  = playerPoints > modelPoints;
  const modelWon   = modelPoints > playerPoints;
  const draw       = playerPoints === modelPoints;

  const headline = playerWon ? `🏆 You beat the AI, ${playerName}!`
                 : modelWon  ? `🤖 The AI wins this time…`
                 : `🤝 It's a Draw!`;
  const subline  = playerWon ? 'Outstanding cricket intuition!'
                 : modelWon  ? 'Better luck next game!'
                 : 'A perfectly matched contest!';

  // Find player's rank in leaderboard
  const rank = leaderboard.findIndex(e => e.name === playerName && e.score === playerPoints) + 1;

  return (
    <div className="end-screen">
      <div className="end-hero">
        <h1 className="end-headline">{headline}</h1>
        <p className="end-subline">{subline}</p>
      </div>

      {/* Final score */}
      <div className="final-score-card">
        <div className="fs-player">
          <div className="fs-label">👤 {playerName}</div>
          <div className="fs-pts">{playerPoints}</div>
          <div className="fs-sub">points</div>
        </div>
        <div className="fs-divider">VS</div>
        <div className="fs-model">
          <div className="fs-label">🤖 AI Model</div>
          <div className="fs-pts">{modelPoints}</div>
          <div className="fs-sub">points</div>
        </div>
      </div>

      {/* Accuracy stats */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.playerAvgErr}</div>
            <div className="stat-label">Your Avg Error</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.modelAvgErr}</div>
            <div className="stat-label">AI Avg Error</div>
          </div>
          <div className="stat-card green">
            <div className="stat-value">R{stats.bestRound}</div>
            <div className="stat-label">Best Round (±{stats.bestDiff})</div>
          </div>
          <div className="stat-card red">
            <div className="stat-value">R{stats.worstRound}</div>
            <div className="stat-label">Worst Round (±{stats.worstDiff})</div>
          </div>
        </div>
      )}

      {/* Round history table */}
      <div className="history-section">
        <h3>Round Breakdown</h3>
        <div className="history-scroll">
          <table className="history-table">
            <thead>
              <tr>
                <th>Rnd</th>
                <th>You</th>
                <th>AI</th>
                <th>Actual</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {history.map(h => (
                <tr key={h.round} className={h.winner === 'player' ? 'won' : h.winner === 'model' ? 'lost' : 'drew'}>
                  <td>{h.round}</td>
                  <td>{h.playerGuess} <small>(±{h.playerDiff})</small></td>
                  <td>{h.modelGuess} <small>(±{h.modelDiff})</small></td>
                  <td><strong>{h.actual}</strong></td>
                  <td>{h.winner === 'player' ? '✅' : h.winner === 'model' ? '❌' : '🤝'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {rank > 0 && rank <= 10 && (
        <div className="rank-badge">
          🏆 You're #{rank} on the leaderboard!
        </div>
      )}

      <button className="btn-primary full-width" onClick={onPlayAgain}>
        🔄 Play Again
      </button>
    </div>
  );
};

export default EndScreen;
