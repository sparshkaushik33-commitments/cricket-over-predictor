import React from 'react';

const DIFF_LABELS = {
  easy:   { label: 'Easy',   color: '#4ade80' },
  medium: { label: 'Medium', color: '#f59e0b' },
  hard:   { label: 'Hard',   color: '#ef4444' },
  expert: { label: 'Expert', color: '#c084fc' },
};

const Leaderboard = ({ entries, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-card" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>✕</button>
      <h2 className="modal-title">🏆 Leaderboard</h2>
      {entries.length === 0 ? (
        <p className="empty-lb">No scores yet. Be the first!</p>
      ) : (
        <table className="lb-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Score</th>
              <th>Difficulty</th>
              <th>Avg Err</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => {
              const diff = DIFF_LABELS[e.difficulty] || DIFF_LABELS.medium;
              return (
                <tr key={i} className={i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}>
                  <td>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                  <td>{e.name}</td>
                  <td><strong>{e.score}</strong></td>
                  <td>
                    <span className="lb-diff-tag" style={{ color: diff.color, borderColor: diff.color }}>
                      {diff.label}
                    </span>
                  </td>
                  <td>{e.avgErr}</td>
                  <td>{e.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <button className="btn-secondary full-width mt-16" onClick={onClose}>Close</button>
    </div>
  </div>
);

export default Leaderboard;
