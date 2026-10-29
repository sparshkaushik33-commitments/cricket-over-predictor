// ─────────────────────────────────────────────────────────────────────────────
// useGameState — central game state machine hook
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useCallback, useRef } from 'react';
import { generateSituation } from '../logic/situationGenerator.js';
import { predictRuns, DEFAULT_DIFFICULTY } from '../logic/predictionModel.js';
import { simulateOver } from '../logic/overSimulator.js';
import { scoreRound, computeStats } from '../logic/scoring.js';

export const GAME_PHASE = {
  START: 'start',
  GUESSING: 'guessing',
  ANIMATING: 'animating',
  ROUND_RESULT: 'round_result',
  END: 'end',
};

const BALL_DELAY_MS = 700; // ms between each ball in animation

export function useGameState() {
  const [phase, setPhase]             = useState(GAME_PHASE.START);
  const [playerName, setPlayerName]   = useState('');
  const [totalRounds, setTotalRounds] = useState(10);
  const [difficulty, setDifficulty]   = useState(DEFAULT_DIFFICULTY);
  const [currentRound, setCurrentRound] = useState(0);
  const [situation, setSituation]     = useState(null);
  const [playerGuess, setPlayerGuess] = useState(8);
  const [modelGuess, setModelGuess]   = useState(null);
  const [overResult, setOverResult]   = useState(null);
  const [animatedBalls, setAnimatedBalls] = useState([]);
  const [roundScore, setRoundScore]   = useState(null);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [modelPoints, setModelPoints]   = useState(0);
  const [streak, setStreak]           = useState(0);
  const [history, setHistory]         = useState([]);
  const [stats, setStats]             = useState(null);
  const [muted, setMuted]             = useState(false);
  const [leaderboard, setLeaderboard] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cricket_lb') || '[]'); }
    catch { return []; }
  });

  // Difficulty is captured at game-start so mid-game changes don't affect it
  const activeDifficulty = useRef(DEFAULT_DIFFICULTY);
  const usedKeys = useRef(new Set());

  // ── Start game ─────────────────────────────────────────────────────────────
  const startGame = useCallback((name, rounds, diff) => {
    usedKeys.current = new Set();
    activeDifficulty.current = diff;

    setPlayerName(name);
    setTotalRounds(rounds);
    setDifficulty(diff);
    setCurrentRound(1);
    setPlayerPoints(0);
    setModelPoints(0);
    setStreak(0);
    setHistory([]);
    setStats(null);
    setPlayerGuess(8);

    const sit = generateSituation(usedKeys.current);
    setSituation(sit);
    setModelGuess(predictRuns(sit, diff));
    setPhase(GAME_PHASE.GUESSING);
  }, []);

  // ── Lock in player guess ───────────────────────────────────────────────────
  const lockIn = useCallback(() => {
    if (phase !== GAME_PHASE.GUESSING) return;

    const result = simulateOver(situation);
    setOverResult(result);
    setAnimatedBalls([]);
    setPhase(GAME_PHASE.ANIMATING);

    // Reveal balls one by one
    result.balls.forEach((ball, i) => {
      setTimeout(() => {
        setAnimatedBalls(prev => [...prev, ball]);
      }, BALL_DELAY_MS * (i + 1));
    });

    // After animation, compute scores
    setTimeout(() => {
      const rs = scoreRound({ playerGuess, modelGuess, actual: result.totalRuns });

      setPlayerPoints(prev => prev + rs.playerPoints);
      setModelPoints(prev  => prev + rs.modelPoints);
      setStreak(prev => rs.roundWinner === 'player' ? prev + 1 : 0);

      setRoundScore({ ...rs, actual: result.totalRuns });
      setHistory(prev => [...prev, {
        round: currentRound,
        playerGuess,
        modelGuess,
        actual: result.totalRuns,
        playerDiff: rs.playerDiff,
        modelDiff:  rs.modelDiff,
        winner: rs.roundWinner,
      }]);
      setPhase(GAME_PHASE.ROUND_RESULT);
    }, BALL_DELAY_MS * (result.balls.length + 1));
  }, [phase, situation, playerGuess, modelGuess, currentRound]);

  // ── Next round or end ──────────────────────────────────────────────────────
  const nextRound = useCallback(() => {
    const nextRoundNum = currentRound + 1;

    if (nextRoundNum > totalRounds) {
      const s = computeStats(history);
      setStats(s);

      const lbEntry = {
        name: playerName,
        score: playerPoints,
        difficulty: activeDifficulty.current,
        rounds: totalRounds,
        avgErr: s?.playerAvgErr ?? 0,
        date: new Date().toLocaleDateString(),
      };
      const newLb = [...leaderboard, lbEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      setLeaderboard(newLb);
      try { localStorage.setItem('cricket_lb', JSON.stringify(newLb)); } catch {}

      setPhase(GAME_PHASE.END);
      return;
    }

    // Next round setup
    setCurrentRound(nextRoundNum);
    setPlayerGuess(8);
    const sit = generateSituation(usedKeys.current);
    setSituation(sit);
    setModelGuess(predictRuns(sit, activeDifficulty.current));
    setAnimatedBalls([]);
    setOverResult(null);
    setRoundScore(null);
    setPhase(GAME_PHASE.GUESSING);
  }, [currentRound, totalRounds, history, playerName, playerPoints, leaderboard]);

  const playAgain = useCallback(() => {
    setPhase(GAME_PHASE.START);
  }, []);

  return {
    // state
    phase, playerName, totalRounds, difficulty, currentRound,
    situation, playerGuess, modelGuess,
    overResult, animatedBalls,
    roundScore, playerPoints, modelPoints, streak,
    history, stats, muted, leaderboard,
    // actions
    setPlayerName, setTotalRounds, setDifficulty, setPlayerGuess,
    startGame, lockIn, nextRound, playAgain,
    setMuted,
  };
}
