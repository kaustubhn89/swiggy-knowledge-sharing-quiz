# Swiggy Knowledge Sharing Quiz

Real-time multiplayer quiz app for Swiggy Ads knowledge sharing sessions at Growisto.

## Tech Stack
- **Frontend**: React 18 + Vite
- **Real-time sync**: Firebase Realtime Database
- **Deployment**: Render (static site) via GitHub

## Firebase Project
- Project: `swiggy-knowledge-sharing-quiz`
- Database URL: `https://swiggy-knowledge-sharing-quiz-default-rtdb.asia-southeast1.firebasedatabase.app`
- Rules must allow read/write (open rules for internal use)

## Firebase DB Structure
```
/game/
  status: "waiting" | "question" | "leaderboard"
  currentQuestion: number (0-7)
  questionStartTime: number (Unix ms timestamp)

/players/{playerId}/
  name: string
  answers/{questionIndex}/
    answer: "A" | "B" | "C" | "D"
    timestamp: number
    score: number        -- base (1000) + speedBonus
    speedBonus: number
  totalScore: number
```

## Scoring
- Correct = 1000 base + Math.round((timeRemaining / totalTime) * 500) speed bonus
- Wrong = 0

## Admin
- Password: `growisto@swiggy2026`
- Controls game flow: start, advance questions, show leaderboard, play again

## Brand Colors
```
teal:        #367588
dark-teal:   #1C4A57
orange:      #E35D34
powder-blue: #B8DBD9
off-white:   #F2F0EB
purple:      #7B5EA7
```

## Dev
```bash
cd ~/Documents/Growisto/Tools/swiggy-quiz
npm install
npm run dev
```
