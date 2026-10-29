import React, { useState } from 'react';

const HowToPlay = ({ onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-card" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>✕</button>
      <h2 className="modal-title">🏏 How to Play</h2>
      <div className="how-to-steps">
        <div className="step">
          <span className="step-num">1</span>
          <p>A live match situation is shown on the scoreboard — team, score, overs, batters and bowler.</p>
        </div>
        <div className="step">
          <span className="step-num">2</span>
          <p>Use the slider (or ±&nbsp;buttons / arrow keys) to guess how many runs will be scored in the <strong>next over</strong>, then click <strong>Lock In</strong>.</p>
        </div>
        <div className="step">
          <span className="step-num">3</span>
          <p>The AI model's guess is revealed and the over is simulated ball by ball.</p>
        </div>
        <div className="step">
          <span className="step-num">4</span>
          <p>Whoever is <strong>closest to the actual runs</strong> wins the round (+10 pts). Bonus for exact (+5) or within 1 run (+2).</p>
        </div>
        <div className="step">
          <span className="step-num">5</span>
          <p>Ties are <strong>Draws</strong> — no points awarded.</p>
        </div>
      </div>
      <div className="scoring-table">
        <h3>Scoring</h3>
        <table>
          <tbody>
            <tr><td>Round win</td><td><strong>+10 pts</strong></td></tr>
            <tr><td>Exact guess</td><td><strong>+5 bonus</strong></td></tr>
            <tr><td>Within 1 run</td><td><strong>+2 bonus</strong></td></tr>
          </tbody>
        </table>
      </div>
      <div className="tips">
        <h3>Tips 💡</h3>
        <ul>
          <li>Death overs (16-20) often yield 10-15+ runs.</li>
          <li>Few wickets in hand means cautious batting.</li>
          <li>Chase pressure boosts scoring risk.</li>
          <li>Use <kbd>←</kbd> <kbd>→</kbd> arrow keys to adjust. <kbd>Enter</kbd> to lock in.</li>
        </ul>
      </div>
      <button className="btn-primary full-width" onClick={onClose}>Got it, let's play!</button>
    </div>
  </div>
);

export default HowToPlay;
