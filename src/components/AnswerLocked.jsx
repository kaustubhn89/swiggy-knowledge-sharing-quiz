import { motion } from 'framer-motion'
import { questions, optionOrder } from '../questions'
import { T, SLOTS } from '../brand'
import { Shape } from './ui'

export default function AnswerLocked({ answer, currentQuestion, playerId }) {
  const q    = questions[currentQuestion]
  const slot = answer ? optionOrder(playerId, currentQuestion).indexOf(answer) : -1
  const s    = SLOTS[slot]

  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ fontSize: '3.3rem', marginBottom: 14 }}
      >
        {answer ? '🔒' : '⏰'}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ fontSize: '1.45rem', fontWeight: 700, color: T.text, marginBottom: 8 }}
      >
        {answer ? 'Answer Locked In!' : "Time's up!"}
      </motion.h2>

      {answer && s ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 260 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 22px', borderRadius: 14,
            background: s.color, color: T.onAccent,
            boxShadow: `0 8px 24px ${s.color}55`,
            margin: '16px 0', maxWidth: 360
          }}
        >
          <span style={{
            width: 38, height: 38, minWidth: 38, borderRadius: 10, background: 'rgba(15,23,32,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Shape shape={s.shape} size={20} color={T.onAccent} />
          </span>
          <span style={{ fontWeight: 600, fontSize: '1rem' }}>{q.options[answer]}</span>
        </motion.div>
      ) : (
        <p style={{ color: T.text3, marginTop: 4, marginBottom: 16 }}>No answer this time (−1 pt)</p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          marginTop: 22, padding: '13px 22px', borderRadius: 14,
          background: T.panel, border: `1px solid ${T.line}`,
          color: T.text3, fontSize: '0.9rem', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          {[0, 1, 2].map(i => (
            <motion.span key={i}
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, delay: i * 0.18, repeat: Infinity }}
              style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: T.primary }}
            />
          ))}
        </div>
        Waiting for next question...
      </motion.div>
    </div>
  )
}
