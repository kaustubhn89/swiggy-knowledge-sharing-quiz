// Adapter between the editable question bank (src/data/dspQuestions.js) and
// the shape the game uses. Answers are always stored by CANONICAL letter
// (A = options[0] … D = options[3]) so scoring and the host's answer chart are
// identical for everyone, whatever order each phone shows.
import { dspQuestions } from './data/dspQuestions.js'

export const LETTERS = ['A', 'B', 'C', 'D']

export function validateQuestions(list) {
  if (!Array.isArray(list) || list.length === 0) return ['The question list is empty or not an array.']
  const errors = []
  list.forEach((q, i) => {
    const n = `Question ${i + 1}`
    if (!q || typeof q !== 'object') { errors.push(`${n}: is not an object`); return }
    if (typeof q.question !== 'string' || !q.question.trim()) errors.push(`${n}: "question" text is missing`)
    if (q.topic != null && typeof q.topic !== 'string') errors.push(`${n}: "topic" must be text`)
    if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(`${n}: needs exactly 4 "options"`)
    else if (q.options.some(o => typeof o !== 'string' || !o.trim())) errors.push(`${n}: every option must be non-empty text`)
    else if (new Set(q.options.map(o => o.trim().toLowerCase())).size !== 4) errors.push(`${n}: two options are identical`)
    if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3) errors.push(`${n}: "correct" must be 0, 1, 2 or 3`)
    if (typeof q.time !== 'number' || !Number.isFinite(q.time) || q.time < 5 || q.time > 120) errors.push(`${n}: "time" must be a number of seconds between 5 and 120`)
  })
  return errors
}

const problems = validateQuestions(dspQuestions)
if (problems.length) console.error('[questions] Fix src/data/dspQuestions.js:\n- ' + problems.join('\n- '))

export const questions = dspQuestions.map((q, i) => ({
  id:      i + 1,
  topic:   (q.topic || '').trim(),
  text:    q.question,
  options: { A: q.options[0], B: q.options[1], C: q.options[2], D: q.options[3] },
  correct: LETTERS[q.correct],
  time:    q.time,
}))

// ── Per-player option order ───────────────────────────────────────────────
// Deterministic per (player, question): a refresh shows the same order, but
// neighbours see different layouts. Returns canonical letters in slot order.
const SALT = 'dsp-quiz-v1'

function hash(str) { // FNV-1a, 32-bit
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return h >>> 0
}

function rng(seed) { // mulberry32
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function optionOrder(playerId, questionIdx) {
  const next = rng(hash(`${SALT}|${playerId}|${questionIdx}`))
  const out = LETTERS.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
