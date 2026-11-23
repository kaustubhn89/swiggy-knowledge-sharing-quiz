import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { questions, optionOrder } from '../questions'
import { T, SLOTS, tint } from '../brand'
import { Shape, TopicTag, LevelTag } from './ui'

export default function AnswerReveal({ data, playerId }) {
  const { questionIdx, answer, score, isCorrect } = data
  const q     = questions[questionIdx]
  const order = optionOrder(playerId, questionIdx)
  const confettiFired = useRef(false)

  useEffect(() => {
    if (isCorrect && !confettiFired.current) {
      confettiFired.current = true
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.45 }, colors: [T.primary, T.secondary, T.purple, T.blue, T.correct] })
      })
    }
  }, [isCorrect])

  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        style={{ fontSize: '3.6rem', marginBottom: 12 }}
      >
        {isCorrect ? '🎉' : '😔'}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ fontSize: '1.6rem', fontWeight: 700, color: isCorrect ? T.correct : T.text, marginBottom: 8 }}
      >
        {isCorrect ? 'Correct!' : 'Not quite!'}
      </motion.h2>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 22, maxWidth: 460, textAlign: 'center' }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          <TopicTag topic={q.topic} small />
          <LevelTag level={q.level} small />
        </div>
        <p style={{ color: T.text2, fontSize: '0.92rem' }}>Q{questionIdx + 1}: {q.text}</p>
      </motion.div>

      {/* Options in this player's order */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, width: '100%', maxWidth: 460, marginBottom: 24 }}>
        {order.map((letter, slot) => {
          const s               = SLOTS[slot]
          const isPlayerAnswer  = letter === answer
          const isCorrectAnswer = letter === q.correct
          const highlighted     = isCorrectAnswer || isPlayerAnswer
          let bg        = T.panel
          let border    = `1.5px solid ${T.line}`
          let textColor = T.text3
          let icon      = null

          if (isCorrectAnswer)              { bg = tint(T.correct, 0.14); border = `1.5px solid ${tint(T.correct, 0.5)}`; textColor = T.correct;   icon = '✓' }
          if (isPlayerAnswer && !isCorrect) { bg = tint(T.wrong, 0.14);   border = `1.5px solid ${tint(T.wrong, 0.5)}`;   textColor = T.wrongText; icon = '✗' }

          return (
            <motion.div
              key={letter}
              initial={{ opacity: 0, x: highlighted ? 0 : -8 }}
              animate={{ opacity: highlighted ? 1 : 0.55, x: 0 }}
              transition={{ delay: 0.1 + slot * 0.06 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: bg, border }}
            >
              <span style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: s.color, opacity: highlighted ? 1 : 0.6,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Shape shape={s.shape} size={15} color={T.onAccent} />
              </span>
              <span style={{ color: textColor, fontWeight: highlighted ? 700 : 500, fontSize: '0.92rem', flex: 1 }}>
                {q.options[letter]}
              </span>
              {icon && <span style={{ fontWeight: 800, color: textColor }}>{icon}</span>}
            </motion.div>
          )
        })}
      </div>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 250, damping: 20 }}
        style={{
          background: isCorrect ? tint(T.correct, 0.12) : tint(T.wrong, 0.08),
          border: `1.5px solid ${isCorrect ? tint(T.correct, 0.35) : tint(T.wrong, 0.25)}`,
          borderRadius: 16, padding: '14px 28px', textAlign: 'center',
          position: 'relative', overflow: 'hidden'
        }}
      >
        {isCorrect && (
          <motion.div
            animate={{ y: [-60, -120], opacity: [1, 0] }}
            transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              pointerEvents: 'none', fontSize: '1.4rem', fontWeight: 800, color: T.correct, whiteSpace: 'nowrap'
            }}
          >
            +{score} pts
          </motion.div>
        )}
        <div style={{ fontSize: '1.9rem', fontWeight: 800, color: isCorrect ? T.correct : T.text3, fontVariantNumeric: 'tabular-nums' }}>
          {isCorrect ? `+${score}` : '0'} pts
        </div>
        <div style={{ color: isCorrect ? T.correct : T.text3, fontSize: '0.8rem', fontWeight: 500, marginTop: 2 }}>
          {isCorrect
            ? score >= 5 ? '⚡ Fast answer — full points!' : 'Correct! Answer faster for +5 next time.'
            : 'Wrong answer — 0 pts. Better luck next one!'}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ color: T.text3, fontSize: '0.8rem', marginTop: 18, fontWeight: 500 }}
      >
        Next question loading...
      </motion.p>
    </div>
  )
}
