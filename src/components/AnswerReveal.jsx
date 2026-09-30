import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { questions } from '../questions'
import { T, tint } from '../brand'

export default function AnswerReveal({ data }) {
  const { questionIdx, answer, score, isCorrect } = data
  const q = questions[questionIdx]
  const confettiFired = useRef(false)

  useEffect(() => {
    if (isCorrect && !confettiFired.current) {
      confettiFired.current = true
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.45 }, colors: [T.teal, T.orange, T.green, T.purple, '#FFD700'] })
      })
    }
  }, [isCorrect])

  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
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
        style={{ fontSize: '1.6rem', fontWeight: 800, color: T.ink, marginBottom: 6 }}
      >
        {isCorrect ? 'Correct!' : 'Not quite!'}
      </motion.h2>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ color: T.ink3, fontSize: '0.9rem', marginBottom: 28, textAlign: 'center' }}
      >
        Q{questionIdx + 1}: {q.text.length > 60 ? q.text.slice(0, 57) + '...' : q.text}
      </motion.p>

      {/* Answer display */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 420, marginBottom: 28 }}>
        {Object.entries(q.options).map(([letter, text]) => {
          const isPlayerAnswer  = letter === answer
          const isCorrectAnswer = letter === q.correct
          let bg        = T.card
          let border    = `1.5px solid ${T.line}`
          let textColor = T.ink3
          let icon      = null

          if (isCorrectAnswer)              { bg = tint(T.green, 0.12); border = `1.5px solid ${tint(T.green, 0.40)}`; textColor = T.green; icon = '✓' }
          if (isPlayerAnswer && !isCorrect) { bg = tint(T.red, 0.10);   border = `1.5px solid ${tint(T.red, 0.40)}`;   textColor = T.red;   icon = '✗' }

          return (
            <motion.div
              key={letter}
              initial={{ opacity: 0, x: isPlayerAnswer || isCorrectAnswer ? 0 : -8 }}
              animate={{ opacity: isCorrectAnswer || isPlayerAnswer ? 1 : 0.5, x: 0 }}
              transition={{ delay: 0.1 + Object.keys(q.options).indexOf(letter) * 0.06 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 16px', borderRadius: 12,
                background: bg, border
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                background: isCorrectAnswer ? tint(T.green, 0.22) : isPlayerAnswer ? tint(T.red, 0.22) : T.fill2,
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
          background: isCorrect ? tint(T.green, 0.10) : tint(T.red, 0.06),
          border: `1.5px solid ${isCorrect ? tint(T.green, 0.30) : tint(T.red, 0.18)}`,
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
              color: T.green, whiteSpace: 'nowrap'
            }}
          >
            +{score} pts
          </motion.div>
        )}
        <div style={{ fontSize: '2rem', fontWeight: 900, color: isCorrect ? T.green : T.ink3, fontVariantNumeric: 'tabular-nums' }}>
          {isCorrect ? `+${score}` : '0'} pts
        </div>
        <div style={{ color: isCorrect ? T.green : T.ink3, fontSize: '0.8rem', fontWeight: 600, marginTop: 2, opacity: isCorrect ? 0.85 : 1 }}>
          {isCorrect
            ? score >= 5 ? '⚡ Fast answer — full points!' : 'Correct! Answer faster for +5 next time.'
            : 'Wrong answer — 0 pts. Better luck next one!'}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ color: T.ink3, fontSize: '0.8rem', marginTop: 20, fontWeight: 500 }}
      >
        Next question loading...
      </motion.p>
    </div>
  )
}
