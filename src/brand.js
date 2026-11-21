// ── Amazon DSP quiz — theme + copy ──────────────────────────────────────
// Single source of truth for colours and wording. Components never hard-code
// a colour; they read it from here.

export const APP_NAME     = 'Amazon DSP, from zero: Quiz'
export const APP_SUBTITLE = 'Session 1 knowledge check'
export const FOOTER       = 'Growisto Amazon Ads team'
export const ORG          = 'Growisto'
export const LOGO_ICON    = '/growisto-icon-white.png'
export const FUNNEL       = ['Awareness', 'Consideration', 'Conversion']

export const T = {
  // Surfaces
  bg:     '#232F3E',   // page background (navy)
  panel:  '#2B3A4A',   // cards / panels
  panel2: '#34475A',   // raised elements inside panels (inputs, rows)

  // Accents
  primary:       '#FF9900',  // orange
  primaryHi:     '#FFAD33',
  secondary:     '#00A8A8',  // teal (fills, borders)
  secondaryText: '#33C4C4',  // teal tuned for small text on navy/panels
  purple:        '#8E6CEF',
  blue:          '#3B82F6',

  // Text
  text:  '#FFFFFF',
  text2: '#D5DBDB',
  text3: '#9AA8B1',   // muted labels (≥4.5:1 on panels)
  text4: '#6E7F8C',   // decorative / disabled only
  onAccent: '#0F1720', // text on orange / teal / purple / blue (≥4.7:1 on all four)

  // Lines & fills
  line:  'rgba(213,219,219,0.12)',
  line2: 'rgba(213,219,219,0.22)',
  fill:  'rgba(213,219,219,0.05)',
  fill2: 'rgba(213,219,219,0.09)',

  // Semantic
  correct: '#2ECC71',
  wrong:   '#E74C3C',
  wrongText: '#FF7A6B', // red tuned for small text on navy/panels
  alert:   '#C0392B',  // banner background (white text ≥5:1)

  // Podium
  gold: '#FFD700', silver: '#C0C0C0', bronze: '#CD7F32',

  // Effects
  gradPrimary: 'linear-gradient(135deg, #FFAD33 0%, #FF9900 100%)',
  shadowBtn:   '0 8px 24px rgba(255,153,0,0.25)',
  shadowCard:  '0 10px 30px rgba(0,0,0,0.22)',
  shadowModal: '0 24px 64px rgba(0,0,0,0.45)',
  dots:        'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
}

// Answer slots = positions on the player's phone (top-left → bottom-right).
// Colour + shape belong to the slot; options are shuffled into slots per player.
export const SLOTS = [
  { color: '#FF9900', shape: 'triangle', name: 'orange triangle' },
  { color: '#00A8A8', shape: 'diamond',  name: 'teal diamond' },
  { color: '#8E6CEF', shape: 'circle',   name: 'purple circle' },
  { color: '#3B82F6', shape: 'square',   name: 'blue square' },
]

export const AVATAR_COLORS = ['#FF9900', '#00A8A8', '#8E6CEF', '#3B82F6', '#2ECC71', '#E67E22', '#E74C3C', '#1ABC9C']

// tint('#FF9900', 0.15) → 'rgba(255,153,0,0.15)'
export function tint(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}
