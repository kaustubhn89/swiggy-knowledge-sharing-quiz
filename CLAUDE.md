# Deals, Data & Decisions — Growisto Knowledge Sharing Quiz

Real-time multiplayer (Kahoot-style) quiz app used for Growisto's internal knowledge sharing sessions.
Originally built for a Swiggy Ads session; repurposed in Sept 2026 with new questions + Growisto-neutral branding.
Same repo, same Render URL, same Firebase project.

## Tech Stack
- **Frontend**: React 18 + Vite, framer-motion, canvas-confetti
- **Real-time sync**: Firebase Realtime Database
- **Deployment**: Render (static site) via GitHub — auto-deploys on push to `main`
- **Live URL**: https://swiggy-knowledge-sharing-quiz.onrender.com (service name in `render.yaml` — do not rename, it is the URL)

## Repurposing the quiz again
Only two files need to change:
- `src/questions.js` — question bank (arrays + `correctIndex`; options are seeded-shuffled at load so the correct answer isn't always in the same slot, and all clients see the same order)
- `src/brand.js` — colours (`T`), `APP_NAME`, `APP_SUBTITLE`, `ORG`
Do not touch `src/firebase.js`, `render.yaml`, or the game logic in `src/App.jsx`.

## Firebase Project
- Project: `swiggy-knowledge-sharing-quiz` (name is historical — leave as is)
- Database URL: `https://swiggy-knowledge-sharing-quiz-default-rtdb.asia-southeast1.firebasedatabase.app`
- Rules must allow read/write (open rules for internal use)

## Firebase DB Structure
```
/activeSessionId: string | null        -- pointer to the session players should join

/sessions/{sessionId}/
  meta/
    name: string
    status: "waiting" | "question" | "leaderboard"
    currentQuestion: number
    questionStartTime: number (Unix ms)
    createdAt: number
    saved: boolean                      -- unsaved sessions are cleaned up on next New Quiz
  players/{playerId}/
    name: string
    totalScore: number
    answers/{questionIndex}/
      answer: "A" | "B" | "C" | "D" | null   -- null = timed out
      timestamp: number
      score: number
```

## Scoring
- Correct within first 15s → **+5**
- Correct after 15s → **+3**
- Wrong → **0**
- No answer (timer expires) → **−1**
All clients compute time against `questionStartTime` written by the admin.

## Admin
- Password: `growisto@2026` (in `src/App.jsx`)
- Flow: Sessions list → New Quiz (name it) → Lobby → Start → Next Question… → Show Leaderboard → Save Results / Back to Sessions

## Brand Colors (Growisto)
```
teal:        #367588   (primary)
dark-teal:   #1C4A57
orange:      #E35D34   (accent)
powder-blue: #B8DBD9
off-white:   #F2F0EB   (page background)
purple:      #7B5EA7   (4th answer slot)
```

## Dev
```bash
cd ~/Documents/Growisto/Tools/swiggy-quiz
npm install
npm run dev
```
