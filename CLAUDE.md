# Amazon DSP, from zero: Quiz — Growisto Amazon Ads team

Kahoot-style live quiz for the Amazon DSP knowledge-sharing sessions. This is the
`dsp-quiz` branch: a separate copy of the live "Deals, Data & Decisions" quiz
(`main`), with its own Render site and its own Firebase namespace. Game flow is
unchanged from `main`; only questions, look and feel, and a few fixes differ.

## Where things live
- **Questions (the only file to edit):** `src/data/dspQuestions.js` — `{ topic, question, options[4], correct (0-based), time }`
- **Theme + copy:** `src/brand.js` (navy/orange palette, title, subtitle, footer, answer slot colours + shapes)
- **Firebase namespace:** `src/db.js` → every path is `dsp/...` (`dsp/activeSessionId`, `dsp/sessions/{id}`)
- **Shared UI bits:** `src/components/ui.jsx` (Shape icons, Growisto logo, DSP funnel strip, topic tag, footer)
- **Logo:** `public/growisto-icon-white.png` (+ `public/favicon.png`)

## Do not touch
- `src/firebase.js` — same Firebase project as the live quiz (`swiggy-knowledge-sharing-quiz`, asia-southeast1)
- `main` branch / the `swiggy-knowledge-sharing-quiz` Render service — that's the live Deals, Data & Decisions quiz

## Deploy
- Render static site **growisto-dsp-quiz** builds from branch `dsp-quiz` (`npm install && npm run build`, publishes `dist`)
- Live: https://growisto-dsp-quiz.onrender.com · Host: https://growisto-dsp-quiz.onrender.com/host
- `npm run build` runs `scripts/check-questions.mjs` first; a malformed question bank fails the build, so Render keeps the last good version

## How answers work
- Each phone shows the 4 options in its own order (seeded per player + question, so a refresh keeps the order)
- Colour + shape belong to the screen position (orange ▲, teal ◆, purple ●, blue ■); answers are stored by canonical letter (A = options[0] …) so scoring and the host's answer chart are identical for everyone
- Host screen lists options in canonical order with neutral numbers (no shapes), since every phone differs

## Scoring
+5 correct within 15 s · +3 correct after · 0 wrong · −1 no answer (timer expiry). Time is measured from `questionStartTime` written by the host.

## Admin
- Password `growisto@2026` (in `src/App.jsx`); `/host` (or `?host`) opens the host login directly

## Firebase rules (required)
The app has no auth, so Realtime Database rules must allow public read/write on the paths both quizzes use:
```json
{ "rules": {
    "activeSessionId": { ".read": true, ".write": true },
    "sessions":        { ".read": true, ".write": true },
    "dsp":             { ".read": true, ".write": true } } }
```
"Test mode" rules expire after 30 days — if the app shows "Can't reach the quiz database (permission denied)", re-publish the rules above.

## Dev
```bash
cd ~/Documents/Growisto/Tools/growisto-dsp-quiz   # git worktree of the same repo, on branch dsp-quiz
npm install
npm run dev
```
