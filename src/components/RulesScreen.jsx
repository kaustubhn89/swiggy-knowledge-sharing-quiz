import { motion } from 'framer-motion'
import { questions } from '../questions'
import { T, APP_SUBTITLE, tint } from '../brand'
import { Title, Footer } from './ui'

function RuleItem({ icon, label, sub, accent }) {
  const colors = {
    green:  { bg: tint(T.correct, 0.10), border: tint(T.correct, 0.28), text: T.correct },
    red:    { bg: tint(T.wrong, 0.10),   border: tint(T.wrong, 0.30),   text: T.wrongText },
    orange: { bg: tint(T.primary, 0.10), border: tint(T.primary, 0.30), text: T.primary },
    teal:   { bg: tint(T.secondary, 0.10), border: tint(T.secondary, 0.30), text: T.secondaryText },
    none:   { bg: T.fill,                border: T.line,                text: T.text },
  }
  const c = colors[accent] || colors.none
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 16px', borderRadius: 12,
      background: c.bg, border: `1px solid ${c.border}`
    }}>
      <span style={{ fontSize: '1.35rem', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ color: c.text, fontWeight: 700, fontSize: '0.93rem' }}>{label}</div>
        <div style={{ color: T.text3, fontSize: '0.77rem', fontWeight: 500, marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  )
}

// Derived from the question bank so it never goes stale
const TIMES = [...new Set(questions.map(q => q.time))].sort((a, b) => a - b)
const TIMER_LABEL = TIMES.length === 1
  ? `${TIMES[0]} seconds per question`
  : `${TIMES[0]}–${TIMES[TIMES.length - 1]} seconds per question`

export default function RulesScreen({ onReady }) {
  return (
    <div style={{
      minHeight: '100vh', background: T.bg, backgroundImage: T.dots, backgroundSize: '26px 26px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 18
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        style={{
          background: T.panel, borderRadius: 24, padding: '32px 24px',
          width: '100%', maxWidth: 440,
          border: `1px solid ${T.line}`, boxShadow: T.shadowModal
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title as="h1" style={{ fontSize: '1.45rem', marginBottom: 6 }} />
          <p style={{ color: T.text2, fontWeight: 500, fontSize: '0.92rem' }}>{APP_SUBTITLE}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: T.line }} />
          <span style={{ color: T.text3, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            How it works
          </span>
          <div style={{ flex: 1, height: 1, background: T.line }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 26 }}>
          <RuleItem icon="📋" label={`${questions.length} questions`}            sub="Amazon DSP basics"                  accent="orange" />
          <RuleItem icon="⏱️" label={TIMER_LABEL}                                sub="Answer before time runs out!" />
          <RuleItem icon="⚡" label="+5 pts — correct in the first 15 seconds"   sub="Fast and correct = full points"     accent="green" />
          <RuleItem icon="✅" label="+3 pts — correct after 15 seconds"          sub="Still rewarded, just less"          accent="green" />
          <RuleItem icon="➖" label="0 pts for a wrong answer"                   sub="No penalty for guessing wrong" />
          <RuleItem icon="⏭️" label="−1 pt if you don't answer"                 sub="Time runs out = small penalty"      accent="red" />
          <RuleItem icon="🔀" label="Answers are shuffled on every phone"        sub="Read your own screen, not your neighbour's" accent="teal" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReady}
          style={{
            width: '100%', padding: '16px', borderRadius: 50, border: 'none',
            background: T.gradPrimary, color: T.onAccent,
            fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: T.shadowBtn
          }}
        >
          Got it — Enter My Name →
        </motion.button>
      </motion.div>
      <Footer />
    </div>
  )
}
