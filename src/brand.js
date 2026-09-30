// ── Growisto brand tokens ──────────────────────────────────────────────
// Single source of truth for colours + copy. To rebrand the quiz again,
// edit this file and src/questions.js — no component needs to change.

export const APP_NAME     = 'Deals, Data & Decisions'
export const APP_SUBTITLE = 'Knowledge Sharing Quiz · Growisto'
export const ORG          = 'Growisto'

export const T = {
  // Brand palette
  teal:     '#367588',
  tealDark: '#1C4A57',
  orange:   '#E35D34',
  powder:   '#B8DBD9',
  purple:   '#7B5EA7',

  // Surfaces
  bg:   '#F2F0EB',
  card: '#FFFFFF',

  // Text on light surfaces (solid values, contrast-checked against white)
  ink:  '#1C4A57',   // headings / primary      (~8.5:1)
  ink2: '#3F6472',   // body / secondary        (~6.4:1)
  ink3: '#6B8791',   // muted labels            (~3.8:1)
  ink4: '#9AAFB6',   // decorative captions     (~2.3:1 — never for essential text)

  // Lines & fills (teal-tinted neutrals)
  line:  'rgba(28,74,87,0.10)',
  line2: 'rgba(28,74,87,0.18)',
  fill:  'rgba(28,74,87,0.045)',
  fill2: 'rgba(28,74,87,0.08)',
  disabled: '#E6E4DF',

  // Semantic
  green: '#2F855A',
  red:   '#C53030',
  blue:  '#3182CE',

  // Podium
  gold:   '#B8860B',
  silver: '#8E9AAF',
  bronze: '#B5722F',

  // Gradients & shadows
  gradPrimary: 'linear-gradient(135deg, #367588, #1C4A57)',
  gradAccent:  'linear-gradient(135deg, #E35D34, #C94A24)',
  shadowBtn:   '0 8px 24px rgba(54,117,136,0.30)',
  shadowCard:  '0 8px 32px rgba(28,74,87,0.08)',
  shadowModal: '0 24px 64px rgba(28,74,87,0.18)',

  // Answer slots — four distinct brand colours, white text on each
  ans: { A: '#367588', B: '#1C4A57', C: '#E35D34', D: '#7B5EA7' },
}

export const AVATAR_COLORS = ['#367588', '#E35D34', '#7B5EA7', '#2F855A', '#1C4A57', '#B8860B', '#C53030', '#3182CE']

// tint('#367588', 0.12) → 'rgba(54,117,136,0.12)'
export function tint(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}
