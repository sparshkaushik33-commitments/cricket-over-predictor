// ─────────────────────────────────────────────────────────────────────────────
// Scoring logic — calculates points awarded after each round
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the winner of a round and points awarded.
 *
 * Scoring rules:
 *   - Round win (closer to actual):  +10 pts
 *   - Exact guess (diff === 0):      +5 bonus pts (stacks with win)
 *   - Within 1 run (diff === 1):     +2 bonus pts (stacks with win)
 *   - Tie (equal distance):          0 pts for both (Draw)
 */
export function scoreRound({ playerGuess, modelGuess, actual }) {
  const playerDiff = Math.abs(playerGuess - actual);
  const modelDiff  = Math.abs(modelGuess  - actual);

  let playerPoints = 0;
  let modelPoints  = 0;
  let roundWinner  = 'draw'; // 'player' | 'model' | 'draw'

  if (playerDiff < modelDiff) {
    roundWinner = 'player';
    playerPoints += 10;
  } else if (modelDiff < playerDiff) {
    roundWinner = 'model';
    modelPoints += 10;
  }
  // else: tie → 0 pts each, roundWinner stays 'draw'

  // Bonus points for exactness (only the round winner gets them)
  if (roundWinner === 'player' || (roundWinner === 'draw' && playerDiff === 0)) {
    if (playerDiff === 0) playerPoints += 5;
    else if (playerDiff === 1) playerPoints += 2;
  }
  if (roundWinner === 'model' || (roundWinner === 'draw' && modelDiff === 0)) {
    if (modelDiff === 0) modelPoints += 5;
    else if (modelDiff === 1) modelPoints += 2;
  }

  return { playerDiff, modelDiff, roundWinner, playerPoints, modelPoints };
}

/**
 * Compute end-of-game stats from the history array.
 * Each history entry: { playerGuess, modelGuess, actual, playerDiff, modelDiff }
 */
export function computeStats(history) {
  if (!history.length) return null;

  const n = history.length;
  const playerErrors = history.map(h => h.playerDiff);
  const modelErrors  = history.map(h => h.modelDiff);

  const avg = arr => arr.reduce((s, v) => s + v, 0) / arr.length;

  const playerAvgErr = +(avg(playerErrors)).toFixed(2);
  const modelAvgErr  = +(avg(modelErrors)).toFixed(2);

  const bestRound  = history.reduce((b, h, i) => h.playerDiff < b.diff ? { i, diff: h.playerDiff } : b, { i: -1, diff: Infinity });
  const worstRound = history.reduce((b, h, i) => h.playerDiff > b.diff ? { i, diff: h.playerDiff } : b, { i: -1, diff: -Infinity });

  return {
    playerAvgErr,
    modelAvgErr,
    bestRound:  bestRound.i  + 1, // 1-indexed
    worstRound: worstRound.i + 1,
    bestDiff:   bestRound.diff,
    worstDiff:  worstRound.diff,
    totalRounds: n,
  };
}
