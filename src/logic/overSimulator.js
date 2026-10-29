// ─────────────────────────────────────────────────────────────────────────────
// Over Simulator — simulates 6 deliveries ball-by-ball
// Produces outcomes that average 6-10 runs/over with occasional 15+ and rare
// wickets, reflecting realistic T20 distributions.
// ─────────────────────────────────────────────────────────────────────────────

/** Outcome descriptors */
export const OUTCOME_TYPES = {
  DOT: 'dot',
  ONE: 'one',
  TWO: 'two',
  THREE: 'three',
  FOUR: 'four',
  SIX: 'six',
  WICKET: 'wicket',
  WIDE: 'wide',
  NO_BALL: 'no-ball',
};

/**
 * Build a weighted probability table for a single delivery.
 * Weights are informed by T20 ball-tracking empirical distributions.
 *
 * Base distribution (no modifiers):
 *   Dot    30%   0 runs
 *   1      30%   1 run
 *   2       9%   2 runs
 *   3       2%   3 runs
 *   4      15%   4 runs
 *   6       8%   6 runs
 *   Wicket  4%   0 runs (batter out)
 *   Wide    1%   1 run (extra, re-bowl)
 *   No-ball 1%   1 run (extra, re-bowl)
 */
const BASE_WEIGHTS = [
  { type: OUTCOME_TYPES.DOT,    runs: 0, weight: 30, isExtra: false, isWicket: false },
  { type: OUTCOME_TYPES.ONE,    runs: 1, weight: 30, isExtra: false, isWicket: false },
  { type: OUTCOME_TYPES.TWO,    runs: 2, weight:  9, isExtra: false, isWicket: false },
  { type: OUTCOME_TYPES.THREE,  runs: 3, weight:  2, isExtra: false, isWicket: false },
  { type: OUTCOME_TYPES.FOUR,   runs: 4, weight: 15, isExtra: false, isWicket: false },
  { type: OUTCOME_TYPES.SIX,    runs: 6, weight:  8, isExtra: false, isWicket: false },
  { type: OUTCOME_TYPES.WICKET, runs: 0, weight:  4, isExtra: false, isWicket: true  },
  { type: OUTCOME_TYPES.WIDE,   runs: 1, weight:  1, isExtra: true,  isWicket: false },
  { type: OUTCOME_TYPES.NO_BALL,runs: 1, weight:  1, isExtra: true,  isWicket: false },
];

/**
 * Adjust weights based on the match situation.
 * Returns a new weight array.
 */
function adjustWeights(situation) {
  const { phase, wicketsInHand, batter1, batter2, bowler } = situation;
  const avgStrength = (batter1.strength + batter2.strength) / 2;

  return BASE_WEIGHTS.map(o => {
    let w = o.weight;

    // ── Phase adjustment ──────────────────────────────────────────────────
    if (phase === 'Death') {
      // More 4s and 6s in death overs
      if (o.type === OUTCOME_TYPES.SIX)   w *= 1.6;
      if (o.type === OUTCOME_TYPES.FOUR)  w *= 1.3;
      if (o.type === OUTCOME_TYPES.DOT)   w *= 0.8;
      if (o.type === OUTCOME_TYPES.WICKET)w *= 1.2; // tail slog → more wickets too
    } else if (phase === 'Powerplay') {
      // Moderate aggression with field up
      if (o.type === OUTCOME_TYPES.FOUR)  w *= 1.15;
      if (o.type === OUTCOME_TYPES.SIX)   w *= 1.1;
    }

    // ── Batter strength ───────────────────────────────────────────────────
    // Strong batters hit more 4s/6s and fewer dots
    const strengthFactor = avgStrength / 75; // normalised around 75
    if (o.type === OUTCOME_TYPES.FOUR || o.type === OUTCOME_TYPES.SIX) {
      w *= strengthFactor;
    }
    if (o.type === OUTCOME_TYPES.DOT) {
      w /= strengthFactor;
    }

    // ── Wickets in hand ───────────────────────────────────────────────────
    // Few wickets → tail batters → more dots and wickets
    if (wicketsInHand <= 3 && phase !== 'Death') {
      if (o.type === OUTCOME_TYPES.DOT)   w *= 1.3;
      if (o.type === OUTCOME_TYPES.WICKET)w *= 1.2;
      if (o.type === OUTCOME_TYPES.SIX)  w *= 0.8;
    }

    // ── Bowler economy (tight bowler → more dots) ─────────────────────────
    if (bowler.economy < 7.0) {
      if (o.type === OUTCOME_TYPES.DOT)   w *= 1.15;
      if (o.type === OUTCOME_TYPES.SIX)   w *= 0.85;
    } else if (bowler.economy > 8.5) {
      if (o.type === OUTCOME_TYPES.DOT)   w *= 0.85;
      if (o.type === OUTCOME_TYPES.FOUR)  w *= 1.1;
    }

    return { ...o, weight: Math.max(0.5, w) };
  });
}

/** Weighted random pick from array of { weight, ... } */
function weightedPick(items) {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let rand = Math.random() * total;
  for (const item of items) {
    rand -= item.weight;
    if (rand <= 0) return item;
  }
  return items[items.length - 1];
}

/**
 * Simulate a complete over (6 legal deliveries).
 * Extras add a delivery — the over continues until 6 legal balls are bowled.
 * Returns { balls: Array<{type,runs,isExtra,isWicket}>, totalRuns, wicketsFallen }
 */
export function simulateOver(situation) {
  const weights = adjustWeights(situation);
  const balls = [];
  let legalBalls = 0;
  let totalRuns = 0;
  let wicketsFallen = 0;

  // Safety valve: max 12 deliveries (handles string of extras)
  while (legalBalls < 6 && balls.length < 12) {
    const outcome = weightedPick(weights);
    balls.push(outcome);
    totalRuns += outcome.runs;
    if (outcome.isWicket) wicketsFallen++;
    if (!outcome.isExtra) legalBalls++;
  }

  return { balls, totalRuns, wicketsFallen };
}
