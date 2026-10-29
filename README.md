# 🏏 Cricket Over Predictor

A fun, fully offline browser game where you predict how many runs will be scored in the **next over** of a T20 cricket match — and compete against an AI model to see who has better cricket intuition.

---

## 🚀 Quick Start

```bash
cd cricket-over-predictor
npm install
npm run dev
```

Then open **http://localhost:5173/** in your browser.

No backend, no API keys, no internet required after install.

---

## 🎮 How to Play

1. **Enter your name** and choose **5, 10, or 15 rounds** on the start screen.
2. Each round shows a **realistic T20 match situation** — teams, score, overs, batters, bowler.
3. Use the **slider or ±&nbsp;buttons** (also arrow keys) to guess how many runs the next over will yield (0–36), then click **Lock In**.
4. The **AI model's prediction** is revealed and the over is **simulated ball-by-ball** with a short delay between deliveries.
5. Whoever is **closest to the actual runs** wins the round. Ties are Draws.
6. The game tracks your **running score, win streak**, and saves your **top 10 scores** in `localStorage`.

### Scoring

| Outcome | Points |
|---------|--------|
| Round win (closer to actual) | +10 |
| Exact guess (diff = 0) | +5 bonus |
| Within 1 run | +2 bonus |
| Tie | 0 for both |

---

## 🤖 How the Prediction Model Works

The model lives in [`src/logic/predictionModel.js`](src/logic/predictionModel.js).

### 1. Phase Base Rate

T20 run-scoring varies dramatically by phase:

| Phase | Overs | Base Runs/Over |
|-------|-------|----------------|
| Powerplay | 1–6 | 8.0 |
| Middle | 7–15 | 7.2 |
| Death | 16–20 | 10.5 |

### 2. Multipliers

The base rate is then adjusted by four independent multipliers (all multiplicative):

**Wickets in Hand**  
Fewer wickets → batters play cautiously. In death overs, tail-enders slog regardless, so the penalty is flattened.  
Range: ~0.55 (1 wicket) to ~1.1 (all 10 in hand).

**Batter Strength**  
Each fictional batter has a strength rating (0–100). The average of the two batters at the crease controls a multiplier from ~0.75 (poor batters) to ~1.2 (elite pair).

**Bowler Economy**  
A bowler's career economy rate is compared to the phase baseline. Tight bowlers suppress scoring; expensive bowlers inflate it. Clamped to ±15%.

**Chase Pressure**  
When chasing, the ratio of Required Run Rate to Current Run Rate drives risk-taking:  
- RRR > 1.6× CRR → +20% (desperate slogging)  
- RRR < 0.7× CRR → −8% (cruising)

### 3. Gaussian Noise

A small Box-Muller random perturbation (σ ≈ 7%) is applied so the model is never perfectly predictable. This keeps games interesting.

### 4. Final Output

The raw estimate is clamped to [0, 36] and rounded to the nearest integer.

---

## ⚾ Over Simulator

The actual over outcome is generated in [`src/logic/overSimulator.js`](src/logic/overSimulator.js) via **weighted random ball-by-ball simulation**.

Base delivery probabilities (before phase/situation adjustments):

| Outcome | Probability |
|---------|-------------|
| Dot | 30% |
| 1 run | 30% |
| 2 runs | 9% |
| 3 runs | 2% |
| 4 (boundary) | 15% |
| 6 (six) | 8% |
| Wicket | 4% |
| Wide / No-ball | 1% each |

These weights are then adjusted for: match phase (death overs get more 4s/6s), batter strength, wickets in hand, and bowler economy. This produces realistic distributions — average ~7-9 runs, occasional 15+ overs, rare wickets.

---

## 📁 Project Structure

```
src/
├── logic/
│   ├── teams.js              # Fictional team, batter, bowler data
│   ├── situationGenerator.js # Randomised T20 match situation generator
│   ├── predictionModel.js    # AI prediction formula
│   ├── overSimulator.js      # Ball-by-ball weighted random simulator
│   └── scoring.js            # Point calculation + end-game stats
├── hooks/
│   └── useGameState.js       # Central game state machine (React hook)
├── components/
│   ├── StartScreen.jsx        # Name/rounds input, modals
│   ├── Scoreboard.jsx         # Match situation card
│   ├── GuessPanel.jsx         # Slider + stepper + keyboard input
│   ├── OverAnimation.jsx      # Ball-by-ball delivery display
│   ├── RoundResult.jsx        # Per-round outcome & running score
│   ├── EndScreen.jsx          # Final stats, history table, replay
│   ├── HowToPlay.jsx          # How to Play modal
│   └── Leaderboard.jsx        # Top-10 localStorage leaderboard
├── App.jsx                    # Root component / phase router
├── App.css                    # Dark cricket pitch theme
└── main.jsx                   # React entry point
```

---

## 🎨 Design

- **Dark green pitch background** with subtle grid texture
- **Glassmorphism scoreboard cards** with green glow borders
- **JetBrains Mono** for numbers, **Inter** for text
- Smooth slide/pop animations on every screen transition
- Fully responsive — works on mobile, tablet, desktop, and projector
