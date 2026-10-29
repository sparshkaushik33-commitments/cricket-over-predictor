// ─────────────────────────────────────────────────────────────────────────────
// Situation Generator — creates realistic, non-repeating T20 match situations
// ─────────────────────────────────────────────────────────────────────────────
import { TEAMS, BATTERS, BOWLERS } from './teams.js';

/** Randomly pick n items from array without repeating */
function sample(arr, n = 1) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return n === 1 ? out[0] : out;
}

/** Uniform random int in [lo, hi] inclusive */
function randInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

/** Get match phase label from over number (1-indexed, after completion) */
export function getPhase(overCompleted) {
  const over = overCompleted + 1; // next over to be bowled
  if (over <= 6) return 'Powerplay';
  if (over <= 15) return 'Middle';
  return 'Death';
}

/**
 * Generate a single match situation for a round.
 * @param {Set} usedSituationKeys - Keys of situations already used this game
 * @returns {Object} situation object
 */
export function generateSituation(usedSituationKeys) {
  let situation;
  let attempts = 0;

  do {
    situation = _generate();
    attempts++;
    // After many attempts (edge cases) just accept whatever we get
    if (attempts > 50) break;
  } while (usedSituationKeys.has(situation.key));

  usedSituationKeys.add(situation.key);
  return situation;
}

function _generate() {
  // Pick two different teams
  const [battingTeam, bowlingTeam] = sample(TEAMS, 2);

  // Decide innings: 50% chance of second innings (chase)
  const isChasing = Math.random() < 0.5;

  // Overs completed (integer): 0-19 (we always reveal the NEXT over)
  // Avoid overs 0 and 19 so there's a full over to reveal
  const oversCompleted = randInt(1, 18);
  const oversLeft = 20 - oversCompleted;

  // Phase
  const phase = getPhase(oversCompleted);

  // ── Generate a plausible score ──────────────────────────────────────────
  // Expected run rate by phase (cumulative so far)
  const baseRR = phase === 'Powerplay' ? 8.2 : phase === 'Middle' ? 7.8 : 9.0;
  // Score so far = overs * baseRR ± random variance
  const expectedRuns = Math.round(oversCompleted * baseRR);
  const runVariance = randInt(-oversCompleted * 2, oversCompleted * 2);
  const runs = Math.max(oversCompleted * 3, expectedRuns + runVariance);

  // Wickets: broadly follows overs (more overs = more chance of wickets)
  const maxWickets = 9; // 10th wicket ends innings
  const avgWicketsRate = 0.4; // ~0.4 wickets per over on average
  const wickets = Math.min(
    maxWickets,
    Math.max(0, Math.round(oversCompleted * avgWicketsRate + randInt(-1, 2)))
  );

  const wicketsInHand = 10 - wickets;

  // ── Current run rate ────────────────────────────────────────────────────
  const currentRR = oversCompleted > 0 ? +(runs / oversCompleted).toFixed(2) : 0;

  // ── Target & required run rate (if chasing) ─────────────────────────────
  let target = null;
  let requiredRR = null;
  let runsNeeded = null;

  if (isChasing) {
    // Target is based on a first-innings total (runs + something)
    const deficit = randInt(10, 80);
    target = runs + deficit;
    runsNeeded = target - runs;
    requiredRR = oversLeft > 0 ? +(runsNeeded / oversLeft).toFixed(2) : 99;
  }

  // ── Batters at the crease ────────────────────────────────────────────────
  const [batter1, batter2] = sample(BATTERS, 2);

  // Balls faced for each batter (realistic distribution)
  const totalBalls = oversCompleted * 6;
  const b1Balls = Math.min(randInt(4, Math.max(5, totalBalls - 2)), totalBalls - 1);
  const b2Balls = Math.min(randInt(2, Math.max(3, totalBalls - b1Balls)), totalBalls - b1Balls);

  const b1Runs = Math.round(b1Balls * (batter1.strength / 100) * randInt(5, 12) / 10);
  const b2Runs = Math.round(b2Balls * (batter2.strength / 100) * randInt(3, 10) / 10);

  // ── Bowler ───────────────────────────────────────────────────────────────
  const bowler = sample(BOWLERS);

  // Key for deduplication (phase + rough score bucket + chasing)
  const key = `${phase}-${Math.floor(runs / 20) * 20}-${isChasing ? 'chase' : 'first'}-${oversCompleted}`;

  return {
    key,
    battingTeam,
    bowlingTeam,
    oversCompleted,
    oversLeft,
    runs,
    wickets,
    wicketsInHand,
    currentRR,
    target,
    requiredRR,
    runsNeeded,
    isChasing,
    phase,
    batter1: { ...batter1, runs: b1Runs, balls: b1Balls },
    batter2: { ...batter2, runs: b2Runs, balls: b2Balls },
    bowler,
  };
}
