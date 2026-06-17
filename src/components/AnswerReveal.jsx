import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { questions } from '../questions'

const ANS_COLORS = { A: '#367588', B: '#1C4A57', C: '#FC8019', D: '#7B5EA7' }

export default function AnswerReveal({ data }) {
  const { questionIdx, answer, score, isCorrect } = data
  const q = questions[questionIdx]
  const confettiFired = useRef(false)

  useEffect(() => {
    if (isCorrect && !confettiFired.current) {
      confettiFired.current = true
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.45 }, colors: ['#FC8019', '#48BB78', '#367588', '#FFD700'] })
      })
    }
  }, [isCorrect])

  return (
    <div style={{
      minHeight: '100vh', background: '#1A1A2A',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      {/* Result icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        style={{ fontSize: '4rem', marginBottom: 16 }}
      >
        {isCorrect ? '🎉' : '😔'}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: 6 }}
      >
        {isCorrect ? 'Correct!' : 'Not quite!'}
      </motion.h2>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginBottom: 28 }}
      >
        Q{questionIdx + 1}: {q.text.length > 60 ? q.text.slice(0, 57) + '...' : q.text}
      </motion.p>

      {/* Answer display */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 420, marginBottom: 28 }}>
        {Object.entries(q.options).map(([letter, text]) => {
          const isPlayerAnswer = letter === answer
          const isCorrectAnswer = letter === q.correct
          let bg = 'rgba(255,255,255,0.05)'
          let border = '1.5px solid rgba(255,255,255,0.06)'
          let textColor = 'rgba(255,255,255,0.4)'
          let icon = null

          if (isCorrectAnswer) { bg = 'rgba(72,187,120,0.15)'; border = '1.5px solid rgba(72,187,120,0.4)'; textColor = '#48BB78'; icon = '✓' }
          if (isPlayerAnswer && !isCorrect) { bg = 'rgba(245,101,101,0.15)'; border = '1.5px solid rgba(245,101,101,0.4)'; textColor = '#F56565'; icon = '✗' }

          return (
            <motion.div
              key={letter}
              initial={{ opacity: 0, x: isPlayerAnswer || isCorrectAnswer ? 0 : -8 }}
              animate={{ opacity: isCorrectAnswer || isPlayerAnswer ? 1 : 0.35, x: 0 }}
              transition={{ delay: 0.1 + Object.keys(q.options).indexOf(letter) * 0.06 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 16px', borderRadius: 12,
                background: bg, border
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                background: isCorrectAnswer ? 'rgba(72,187,120,0.25)' : isPlayerAnswer ? 'rgba(245,101,101,0.25)' : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.85rem', color: textColor
              }}>
                {letter}
              </span>
              <span style={{ color: textColor, fontWeight: isCorrectAnswer || isPlayerAnswer ? 700 : 500, fontSize: '0.9rem', flex: 1 }}>
                {text}
              </span>
              {icon && <span style={{ fontWeight: 800, color: textColor }}>{icon}</span>}
            </motion.div>
          )
        })}
      </div>

      {/* Score reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 250, damping: 20 }}
        style={{
          background: isCorrect ? 'rgba(72,187,120,0.12)' : 'rgba(245,101,101,0.08)',
          border: `1.5px solid ${isCorrect ? 'rgba(72,187,120,0.3)' : 'rgba(245,101,101,0.2)'}`,
          borderRadius: 16, padding: '16px 28px', textAlign: 'center',
          position: 'relative', overflow: 'hidden'
        }}
      >
        {isCorrect && (
          <motion.div
            animate={{ y: [-60, -120], opacity: [1, 0] }}
            transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              pointerEvents: 'none', fontSize: '1.4rem', fontWeight: 900,
              color: '#48BB78', whiteSpace: 'nowrap'
            }}
          >
            +{score} pts
          </motion.div>
        )}
        <div style={{ fontSize: '2rem', fontWeight: 900, color: isCorrect ? '#48BB78' : '#F56565', fontVariantNumeric: 'tabular-nums' }}>
          {isCorrect ? '+3' : '−1'} pts
        </div>
        <div style={{ color: isCorrect ? 'rgba(72,187,120,0.7)' : 'rgba(245,101,101,0.6)', fontSize: '0.8rem', fontWeight: 600, marginTop: 2 }}>
          {isCorrect ? 'Nice work! Keep it up.' : 'Better luck on the next one!'}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 0.6 }}
        style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginTop: 20, fontWeight: 500 }}
      >
        Next question loading...
      </motion.p>
    </div>
  )
}
