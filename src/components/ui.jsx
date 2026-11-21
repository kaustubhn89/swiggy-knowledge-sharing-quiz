import { useState } from 'react'
import { T, APP_NAME, FUNNEL, FOOTER, ORG, LOGO_ICON, tint } from '../brand'

// Kahoot-style answer shapes (decorative; the button text carries the meaning)
export function Shape({ shape, size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ display: 'block', flexShrink: 0 }}>
      {shape === 'triangle' && <polygon points="12,2.5 22.5,20.5 1.5,20.5" fill={color} />}
      {shape === 'diamond'  && <polygon points="12,1.5 22.5,12 12,22.5 1.5,12" fill={color} />}
      {shape === 'circle'   && <circle cx="12" cy="12" r="10" fill={color} />}
      {shape === 'square'   && <rect x="2.5" y="2.5" width="19" height="19" rx="2.5" fill={color} />}
    </svg>
  )
}

// Growisto mark + wordmark. Falls back to the wordmark alone if the image is missing.
export function Logo({ size = 40, wordmark = true, color = T.text }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.3) }}>
      {imgOk && (
        <img src={LOGO_ICON} width={size} height={size} alt={wordmark ? '' : ORG}
          onError={() => setImgOk(false)} style={{ display: 'block' }} />
      )}
      {(wordmark || !imgOk) && (
        <span style={{ color, fontSize: Math.round(size * 0.62), fontWeight: 500, lineHeight: 1, letterSpacing: '-0.01em' }}>
          {ORG}
        </span>
      )}
    </span>
  )
}

// "Amazon DSP, from zero: Quiz" → "Amazon DSP" in orange, the rest in white
export function Title({ as: Tag = 'h1', style }) {
  const i = APP_NAME.indexOf(',')
  return (
    <Tag style={{ color: T.text, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, textWrap: 'balance', ...style }}>
      {i > 0
        ? <><span style={{ color: T.primary }}>{APP_NAME.slice(0, i)}</span>{APP_NAME.slice(i)}</>
        : APP_NAME}
    </Tag>
  )
}

const FUNNEL_COLORS = [T.primary, T.secondary, T.blue]

export function FunnelStrip({ label = true, style }) {
  return (
    <div style={{ textAlign: 'center', ...style }}>
      {label && (
        <div style={{ color: T.text3, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          The DSP funnel
        </div>
      )}
      <div className="funnel" role="list" aria-label={`DSP funnel: ${FUNNEL.join(', ')}`}>
        {FUNNEL.map((stage, i) => (
          <div key={stage} role="listitem" className="funnel-seg"
            style={{ height: 40 - i * 6, background: tint(FUNNEL_COLORS[i], 0.5), zIndex: FUNNEL.length - i }}>
            {stage}
          </div>
        ))}
      </div>
    </div>
  )
}

export function TopicTag({ topic, small = false }) {
  if (!topic) return null
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: small ? '4px 10px' : '6px 12px', borderRadius: 20,
      background: tint(T.secondary, 0.16), border: `1px solid ${tint(T.secondary, 0.4)}`,
      color: T.secondaryText, fontSize: small ? '0.68rem' : '0.74rem', fontWeight: 700,
      letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap'
    }}>
      {topic}
    </span>
  )
}

export function Footer({ style }) {
  return (
    <p style={{ color: T.text3, fontSize: '0.78rem', fontWeight: 500, textAlign: 'center', ...style }}>
      {FOOTER}
    </p>
  )
}
