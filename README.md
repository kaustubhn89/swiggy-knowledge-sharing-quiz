# Amazon DSP, from zero: Quiz

**Session 1 knowledge check** · Growisto Amazon Ads team

Live multiplayer quiz (host screen + players on phones), built on the same app as
the Deals, Data & Decisions quiz but deployed separately.

- **Live (players):** https://growisto-dsp-quiz.onrender.com
- **Host:** https://growisto-dsp-quiz.onrender.com/host — password `growisto@2026`
- **Branch:** `dsp-quiz` of https://github.com/kaustubhn89/swiggy-knowledge-sharing-quiz (the live Deals, Data & Decisions quiz stays on `main`)

## Running a session
1. Open the **Host** link on the projector laptop → log in → **＋ New Quiz** → name it → **Start Quiz**
2. The lobby shows a **QR code** and the URL — players scan it, read the rules, enter a name
3. **Start Game** → each question runs on a countdown; the host screen shows answers coming in and live standings
4. **Next Question →** (enabled once someone answers or the timer ends) → after the last one, **🏆 Show Final Results**
5. **💾 Save Results** to keep the session (rerun / delete later from the sessions list)

## Scoring
| Outcome | Points |
|---|---|
| Correct within 15 s | +5 |
| Correct after 15 s | +3 |
| Wrong | 0 |
| No answer before time runs out | −1 |

Answer options are shuffled on every phone, so neighbours can't copy positions.

## Editing the questions
All questions live in **`src/data/dspQuestions.js`** — one object each:
```js
{ "topic": "Audiences", "question": "…", "options": ["…", "…", "…", "…"], "correct": 1, "time": 20 }
```
`correct` is the 0-based position of the right answer in `options`. Run `npm run check:questions` to validate;
the build refuses to deploy a malformed list.

## Tech
React 18 + Vite, framer-motion, canvas-confetti, qrcode.react · Firebase Realtime Database (data under `dsp/`) · Render static site.

## Local development
```bash
npm install
npm run dev
```
