# Swiggy Knowledge Sharing Quiz

Real-time multiplayer quiz for Swiggy Ads knowledge sharing sessions at Growisto.

**Live URL:** _(add after Render deploy)_

## Quick Start

### Admin
1. Open the app URL
2. Click **Admin Login**
3. Password: `growisto@swiggy2026`
4. Wait for players to join, then click **Start Game**
5. Use **Next Question** to advance (enabled after ≥1 answer or timer expires)
6. Click **Show Leaderboard** after Q8
7. **Play Again** resets everything

### Players
1. Open the same URL on any device
2. Click **Join as Player**
3. Enter your name
4. Wait for the admin to start — quiz begins automatically
5. Tap an answer before the timer runs out
6. Final scores shown on the leaderboard

## Scoring
| Outcome | Points |
|---------|--------|
| Correct answer | 1000 + speed bonus |
| Speed bonus | (time remaining / total time) × 500 |
| Wrong / no answer | 0 |

## Tech Stack
- React 18 + Vite
- Firebase Realtime Database (asia-southeast1)
- Deployed on Render (static site)

## Local Development
```bash
npm install
npm run dev
```

## Deploy to Render (one-time setup)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New → Static Site**
3. Connect your GitHub repo `swiggy-knowledge-sharing-quiz`
4. Render auto-detects `render.yaml` — click **Deploy**
5. Done. Update the Live URL above once deployed.

## Firebase Rules
Set Realtime Database rules to allow read/write for the app to work:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
_(For internal use only — not for public-facing apps)_
