import React from 'react';

/**
 * Cricket scoreboard card showing the current match situation.
 */
const Scoreboard = ({ situation }) => {
  const {
    battingTeam, bowlingTeam,
    oversCompleted, oversLeft,
    runs, wickets, wicketsInHand,
    currentRR, target, requiredRR, runsNeeded,
    isChasing, phase,
    batter1, batter2, bowler,
  } = situation;

  const phaseColor = phase === 'Powerplay' ? '#4caf50' : phase === 'Middle' ? '#ff9800' : '#f44336';
  const nextOver = oversCompleted + 1;

  return (
    <div className="scoreboard-card">
      {/* Header — teams */}
      <div className="sb-header">
        <div className="sb-team batting">
          <span className="team-dot" style={{ background: battingTeam.color }} />
          <span className="team-name">{battingTeam.city ? `${battingTeam.city} ` : ''}{battingTeam.name}</span>
          <span className="team-role">BAT</span>
        </div>
        <div className="sb-vs">VS</div>
        <div className="sb-team bowling">
          <span className="team-role">BOWL</span>
          <span className="team-name">{bowlingTeam.city ? `${bowlingTeam.city} ` : ''}{bowlingTeam.name}</span>
          <span className="team-dot" style={{ background: bowlingTeam.color }} />
        </div>
      </div>

      {/* Main score */}
      <div className="sb-score-row">
        <div className="sb-big-score">
          <span className="score-runs">{runs}</span>
          <span className="score-sep">/</span>
          <span className="score-wickets">{wickets}</span>
        </div>
        <div className="sb-overs">
          <span className="overs-done">{oversCompleted}.0</span>
          <span className="overs-label">overs</span>
        </div>
      </div>

      {/* Phase + over info */}
      <div className="sb-phase-row">
        <span className="phase-badge" style={{ background: phaseColor }}>
          {phase}
        </span>
        <span className="over-info">Over {nextOver} to be bowled • {oversLeft} overs left</span>
      </div>

      {/* Run rates */}
      <div className="sb-rr-row">
        <div className="rr-item">
          <span className="rr-label">CRR</span>
          <span className="rr-value">{currentRR}</span>
        </div>
        {isChasing && target && (
          <>
            <div className="rr-item highlight">
              <span className="rr-label">TARGET</span>
              <span className="rr-value">{target}</span>
            </div>
            <div className="rr-item danger">
              <span className="rr-label">NEED</span>
              <span className="rr-value">{runsNeeded} off {oversLeft * 6} balls</span>
            </div>
            <div className="rr-item">
              <span className="rr-label">RRR</span>
              <span className="rr-value" style={{ color: requiredRR > 10 ? '#f44336' : requiredRR > 8 ? '#ff9800' : '#4caf50' }}>
                {requiredRR}
              </span>
            </div>
          </>
        )}
        {!isChasing && (
          <div className="rr-item">
            <span className="rr-label">INNINGS</span>
            <span className="rr-value">1st</span>
          </div>
        )}
      </div>

      {/* Batters */}
      <div className="sb-players">
        <div className="player-section">
          <div className="player-header">AT THE CREASE</div>
          <div className="batter-row">
            <span className="batter-name">🏏 {batter1.name}</span>
            <span className="batter-stats">{batter1.runs} ({batter1.balls})</span>
          </div>
          <div className="batter-row">
            <span className="batter-name">🏏 {batter2.name}</span>
            <span className="batter-stats">{batter2.runs} ({batter2.balls})</span>
          </div>
        </div>
        <div className="player-divider" />
        <div className="player-section">
          <div className="player-header">BOWLING</div>
          <div className="batter-row">
            <span className="batter-name">⚡ {bowler.name}</span>
            <span className="batter-stats">Eco {bowler.economy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
