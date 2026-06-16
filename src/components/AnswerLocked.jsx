import { motion } from 'framer-motion'
import { questions } from '../questions'

const ANS_COLORS = { A: '#367588', B: '#1C4A57', C: '#FC8019', D: '#7B5EA7' }

export default function AnswerLocked({ answer, currentQuestion }) {
  const q = questions[currentQuestion]

  return (
    <div style={{
      minHeight: '100vh', background: '#1A1A2A',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ fontSize: '3.5rem', marginBottom: 16 }}
      >
        🔒
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}
      >
        Answer Locked In!
      </motion.h2>

      {answer ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 260 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 24px', borderRadius: 14,
            background: ANS_COLORS[answer],
            boxShadow: `0 8px 24px ${ANS_COLORS[answer]}60`,
            margin: '16px 0', maxWidth: 340
          }}
        >
          <span style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1rem', color: '#fff', flexShrink: 0
          }}>
            {answer}
          </span>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
            {q.options[answer]}
          </span>
        </motion.div>
      ) : (
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12, marginBottom: 16 }}>You didn't answer in time</p>
      )}

      {/* Pulsing waiting indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          marginTop: 24, padding: '14px 24px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, textAlign: 'center',
          color: 'rgba(255,255,255,0.45)',
          fontSize: '0.9rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 10, maxWidth: 340
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          {[0,1,2].map(i => (
            <motion.span key={i}
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, delay: i * 0.18, repeat: Infinity }}
              style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }}
            />
          ))}
        </div>
        Waiting for next question...
      </motion.div>
    </div>
  )
}
