import { motion } from 'framer-motion'
import { questions } from '../questions'
import { T, APP_NAME, APP_SUBTITLE, tint } from '../brand'

function RuleItem({ icon, label, sub, accent }) {
  const colors = {
    green:  { bg: tint(T.green, 0.08),  border: tint(T.green, 0.22),  text: T.green },
    red:    { bg: tint(T.red, 0.07),    border: tint(T.red, 0.20),    text: T.red },
    teal:   { bg: tint(T.teal, 0.08),   border: tint(T.teal, 0.22),   text: T.teal },
    none:   { bg: T.fill,               border: T.line,               text: T.ink },
  }
  const c = colors[accent] || colors.none
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '13px 16px', borderRadius: 12,
      background: c.bg, border: `1px solid ${c.border}`
    }}>
      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ color: c.text, fontWeight: 800, fontSize: '0.95rem' }}>{label}</div>
        <div style={{ color: T.ink3, fontSize: '0.78rem', fontWeight: 500, marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  )
}

// Derive the timer label from the question bank so it never goes stale
const TIMES = [...new Set(questions.map(q => q.time))].sort((a, b) => a - b)
const TIMER_LABEL = TIMES.length === 1
  ? `${TIMES[0]} seconds per question`
  : `${TIMES[0]}–${TIMES[TIMES.length - 1]} seconds per question`

export default function RulesScreen({ onReady }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        style={{
          background: T.card,
          borderRadius: 24, padding: '36px 28px',
          width: '100%', maxWidth: 420,
          border: `1px solid ${T.line}`,
          boxShadow: T.shadowModal
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '2.8rem', marginBottom: 12 }}
          >⚡</motion.div>
          <h1 style={{
            color: T.ink, fontSize: '1.55rem', fontWeight: 900,
            letterSpacing: '-0.02em', marginBottom: 5
          }}>
            {APP_NAME}
          </h1>
          <p style={{ color: T.teal, fontWeight: 800, fontSize: '0.95rem' }}>
            {APP_SUBTITLE}
          </p>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: T.line }} />
          <span style={{ color: T.ink3, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            How it works
          </span>
          <div style={{ flex: 1, height: 1, background: T.line }} />
        </div>

        {/* Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          <RuleItem icon="📋" label={`${questions.length} questions`}        sub="Deals, data & decision-making"  accent="teal" />
          <RuleItem icon="⏱️" label={TIMER_LABEL}                            sub="Answer before time runs out!" />
          <RuleItem icon="⚡" label="+5 pts — answer in first 15 seconds"   sub="Fast and correct = full points" accent="green" />
          <RuleItem icon="✅" label="+3 pts — correct after 15 seconds"     sub="Still rewarded, just less"      accent="green" />
          <RuleItem icon="➖" label="0 pts for wrong answer"                sub="No penalty for guessing wrong" />
          <RuleItem icon="⏭️" label="−1 pt if you don't answer"            sub="Time runs out = small penalty"  accent="red" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReady}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 50, border: 'none',
            background: T.gradPrimary,
            color: '#fff', fontSize: '1rem', fontWeight: 800,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: T.shadowBtn,
            letterSpacing: '0.01em'
          }}
        >
          Got it — Enter My Name →
        </motion.button>
      </motion.div>
    </div>
  )
}
