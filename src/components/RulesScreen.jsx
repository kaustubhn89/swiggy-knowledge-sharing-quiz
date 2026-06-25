import { motion } from 'framer-motion'
import { questions } from '../questions'

function RuleItem({ icon, label, sub, accent }) {
  const colors = {
    green:  { bg: 'rgba(72,187,120,0.08)',  border: 'rgba(72,187,120,0.18)',  text: '#48BB78' },
    red:    { bg: 'rgba(245,101,101,0.08)', border: 'rgba(245,101,101,0.18)', text: '#F56565' },
    orange: { bg: 'rgba(252,128,25,0.08)',  border: 'rgba(252,128,25,0.18)',  text: '#FC8019' },
    none:   { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.06)', text: '#fff' },
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
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', fontWeight: 500, marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  )
}

export default function RulesScreen({ onReady }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FC8019 0%, #E35D34 30%, #1C4A57 70%, #0f2d38 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        style={{
          background: '#1A1A2A',
          borderRadius: 24, padding: '36px 28px',
          width: '100%', maxWidth: 420,
          boxShadow: '0 24px 64px rgba(0,0,0,0.45)'
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
            color: '#fff', fontSize: '1.55rem', fontWeight: 900,
            letterSpacing: '-0.02em', marginBottom: 5
          }}>
            Swiggy Instamart Ads
          </h1>
          <p style={{
            background: 'linear-gradient(135deg, #FC8019, #E35D34)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', fontWeight: 800, fontSize: '0.95rem'
          }}>
            Knowledge Sharing Quiz
          </p>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            How it works
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          <RuleItem icon="📋" label={`${questions.length} questions`}       sub="Swiggy Instamart Ads knowledge" accent="orange" />
          <RuleItem icon="⏱️" label="30 seconds per question"              sub="Answer before time runs out!" />
          <RuleItem icon="⚡" label="+5 pts — answer in first 15 seconds"  sub="Fast and correct = full points" accent="green" />
          <RuleItem icon="✅" label="+3 pts — correct after 15 seconds"    sub="Still rewarded, just less" accent="green" />
          <RuleItem icon="➖" label="0 pts for wrong answer"               sub="No penalty for guessing wrong" />
          <RuleItem icon="⏭️" label="−1 pt if you don't answer"           sub="Time runs out = small penalty" accent="red" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReady}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 50, border: 'none',
            background: 'linear-gradient(135deg, #FC8019, #E35D34)',
            color: '#fff', fontSize: '1rem', fontWeight: 800,
            fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(252,128,25,0.4)',
            letterSpacing: '0.01em'
          }}
        >
          Got it — Enter My Name →
        </motion.button>
      </motion.div>
    </div>
  )
}
