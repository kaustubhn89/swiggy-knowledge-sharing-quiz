# Deals, Data & Decisions — Knowledge Sharing Quiz · Growisto

Real-time multiplayer quiz for Growisto's internal knowledge sharing sessions.

**GitHub:** https://github.com/kaustubhn89/swiggy-knowledge-sharing-quiz
**Live URL:** https://swiggy-knowledge-sharing-quiz.onrender.com

> The repo / Render service / Firebase project keep their original "swiggy" names — the app itself is Growisto-branded and quiz-agnostic. Swap `src/questions.js` + `src/brand.js` to run a different quiz.

## Quick Start

### Admin (host)
1. Open the app URL → **Host Controls → Admin Login**
2. Password: `growisto@2026`
3. **＋ New Quiz** → give it a name → **Start Quiz**
4. Share the URL; wait for players in the **Lobby**, then **Start Game**
5. **Next Question →** advances (enabled once ≥1 answer is in or the timer expires)
6. After the last question, **🏆 Show Leaderboard**
7. **💾 Save Results** keeps the session in the list (rerun/delete later), or **← Back to Sessions** to discard

### Players
1. Open the same URL on any device → **Join the Quiz**
2. Read the rules → enter your name
3. Wait for the host to start — the quiz begins automatically
4. Tap an answer before the timer runs out
5. Final standings on the leaderboard

## Scoring
| Outcome | Points |
|---------|--------|
| Correct within first 15 s | **+5** |
| Correct after 15 s | **+3** |
| Wrong answer | 0 |
| No answer (timer expires) | **−1** |

## Questions
10 questions on Amazon deals, data reads and decision-making (20 s each, one 30 s). Edit `src/questions.js`.
Answer options are shuffled with a fixed seed at load time, so the correct answer sits in a different slot per question and every player sees the same order.

## Tech Stack
- React 18 + Vite, framer-motion, canvas-confetti
- Firebase Realtime Database (asia-southeast1)
- Deployed on Render (static site) — auto-deploys on push to `main`

## Local Development
```bash
npm install
npm run dev
```

## Deploy to Render
Already connected. Push to `main` and Render rebuilds from `render.yaml` (`npm install && npm run build`, publishes `./dist`).

## Firebase Rules
Realtime Database rules must allow read/write for the app to work:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
_(For internal use only — not for public-facing apps)_
