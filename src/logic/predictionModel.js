// ─────────────────────────────────────────────────────────────────────────────
// Prediction Model — estimates runs in the next over
// Supports four manually selectable difficulty levels that control how
// accurately (and noisily) the AI behaves.
// ─────────────────────────────────────────────────────────────────────────────

// ── Difficulty Levels ──────────────────────────────────────────────────────────
// Each level has:
//   noiseSigma     — std dev of Gaussian noise (higher = more random/beatable)
//   multiplierClamp — how aggressively phase multipliers are applied (0-1 scale;
//                     lower = model ignores situation more → dumber)
//   label / description — shown in the UI
export const DIFFICULTY_LEVELS = {
  easy: {
    key: 'easy',
    label: 'Easy',
    description: 'The model guesses with high variance. Great for warming up.',
    noiseSigma: 0.32,       // ±32% random noise — very unpredictable
    multiplierWeight: 0.3,  // ignores 70% of situation signals
    color: '#4ade80',
  },
  medium: {
    key: 'medium',
    label: 'Medium',
    description: 'Balanced predictions with moderate noise and phase awareness.',
    noiseSigma: 0.14,       // ±14% noise
    multiplierWeight: 0.65, // uses 65% of situation signals
    color: '#f59e0b',
  },
  hard: {
    key: 'hard',
    label: 'Hard',
    description: 'Sharp situational reads. Tough to beat.',
    noiseSigma: 0.05,       // ±5% noise — mostly accurate
    multiplierWeight: 0.90, // nearly full situational awareness
    color: '#ef4444',
  },
  expert: {
    key: 'expert',
    label: 'Expert',
    description: 'The model is near-perfect. Only true cricket geniuses win.',
    noiseSigma: 0.015,      // ±1.5% noise — almost deterministic
    multiplierWeight: 1.0,  // full situational awareness
    color: '#c084fc',
  },
};

export const DEFAULT_DIFFICULTY = 'medium';

// ── Phase Base Rates ───────────────────────────────────────────────────────────
/**
 * BASE EXPECTED RUNS per phase (T20 empirical averages):
 *   Powerplay (ov 1-6)  : ~8.0 runs/over — fielding restrictions, early risk
 *   Middle   (ov 7-15)  : ~7.2 runs/over — consolidation, dot-ball battles
 *   Death    (ov 16-20) : ~10.5 runs/over — max-hitting slog overs
 */
const BASE_BY_PHASE = {
  Powerplay: 8.0,
  Middle: 7.2,
  Death: 10.5,
};

// ── Individual Multiplier Functions ───────────────────────────────────────────

/**
 * WICKETS-IN-HAND MULTIPLIER
 * Fewer wickets → batters play more cautiously.
 * In death overs, even tail-enders slog — penalty is flattened.
 * Range: ~0.55 (1 wicket, non-death) → ~1.10 (10 wickets in hand)
 */
function wicketsMultiplier(wicketsInHand, phase) {
  if (phase === 'Death') return 0.75 + wicketsInHand * 0.035;
  return 0.55 + wicketsInHand * 0.055;
}

/**
 * BATTER STRENGTH MULTIPLIER
 * Average T20 impact of the two batters at the crease.
 * 50-strength → 1.0, 100-strength → 1.2, 0-strength → 0.75
 */
function batterMultiplier(batter1, batter2) {
  const avg = (batter1.strength + batter2.strength) / 2;
  return 0.75 + (avg / 100) * 0.45;
}

/**
 * RUN-RATE PRESSURE MULTIPLIER (chasing only)
 * When RRR >> CRR, batters gamble → more scoring opportunities.
 * When team is cruising (RRR << CRR), they preserve wickets → slightly lower.
 */
function rrPressureMultiplier(requiredRR, currentRR) {
  if (!requiredRR || currentRR <= 0) return 1.0;
  const ratio = requiredRR / currentRR;
  if (ratio > 1.6) return 1.20;
  if (ratio > 1.3) return 1.10;
  if (ratio > 1.1) return 1.05;
  if (ratio < 0.7) return 0.92;
  return 1.0;
}

/**
 * BOWLER ECONOMY MULTIPLIER
 * A tight bowler (low economy) suppresses scoring relative to phase baseline.
 * Clamped to ±15% to avoid extreme outliers.
 */
function bowlerMultiplier(bowler, baseRuns) {
  const ratio = bowler.economy / baseRuns;
  return Math.min(1.15, Math.max(0.85, ratio));
}

/**
 * GAUSSIAN NOISE
 * Box-Muller transform → approximately Normal(1.0, sigma²).
 * Larger sigma = more random, more beatable by a human.
 */
function gaussianNoise(sigma) {
  const u = Math.random(), v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u + 1e-9)) * Math.cos(2 * Math.PI * v);
  return 1.0 + z * sigma;
}

// ── Main Prediction Entry Point ────────────────────────────────────────────────
/**
 * Predict runs for the next over.
 *
 * @param {Object} situation  - full match situation from situationGenerator
 * @param {string} difficulty - one of 'easy' | 'medium' | 'hard' | 'expert'
 * @returns {number} whole-number predicted runs (clamped to [0, 36])
 */
export function predictRuns(situation, difficulty = DEFAULT_DIFFICULTY) {
  const cfg = DIFFICULTY_LEVELS[difficulty] ?? DIFFICULTY_LEVELS[DEFAULT_DIFFICULTY];
  const { phase, wicketsInHand, currentRR, requiredRR, isChasing, batter1, batter2, bowler } = situation;

  const base = BASE_BY_PHASE[phase];

  // Compute the "perfect" situational estimate
  const perfectEstimate =
    base
    * wicketsMultiplier(wicketsInHand, phase)
    * batterMultiplier(batter1, batter2)
    * bowlerMultiplier(bowler, base)
    * (isChasing ? rrPressureMultiplier(requiredRR, currentRR) : 1.0);

  // Blend between dumb (base rate only) and smart (full situational) by difficulty
  const w = cfg.multiplierWeight;
  const blendedEstimate = base * (1 - w) + perfectEstimate * w;

  // Apply difficulty-scaled Gaussian noise
  const noisyEstimate = blendedEstimate * gaussianNoise(cfg.noiseSigma);

  return Math.max(0, Math.min(36, Math.round(noisyEstimate)));
}
