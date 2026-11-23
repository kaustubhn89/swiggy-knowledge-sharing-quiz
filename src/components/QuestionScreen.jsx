import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions, optionOrder } from '../questions'
import { T, SLOTS, tint } from '../brand'
import { Shape, TopicTag, LevelTag } from './ui'

function CircularTimer({ totalTime, questionStartTime }) {
  const R = 58, CIRC = 2 * Math.PI * R
  const [progress, setProgress]       = useState(1)
  const [displaySecs, setDisplaySecs] = useState(totalTime)
  const [urgent, setUrgent]           = useState(false)
  const rafRef = useRef()

  useEffect(() => {
    setProgress(1)
    setDisplaySecs(totalTime)
    setUrgent(false)

    const update = () => {
      const elapsed   = (Date.now() - questionStartTime) / 1000
      const remaining = Math.max(0, totalTime - elapsed)
      setProgress(remaining / totalTime)
      setDisplaySecs(Math.ceil(remaining))
      setUrgent(remaining <= 10 && remaining > 0)
      rafRef.current = requestAnimationFrame(update)
    }
    rafRef.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafRef.current)
  }, [totalTime, questionStartTime])

  const color      = progress > 0.5 ? T.secondary : progress > 0.25 ? T.primary : T.wrong
  const dashoffset = CIRC * (1 - progress)
  const glowSize   = Math.round((1 - progress) * 28)

  return (
    <motion.div
      className="timer"
      animate={urgent ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={urgent ? { duration: 0.7, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
    >
      <div style={{
        position: 'absolute', inset: -6, borderRadius: '50%',
        boxShadow: `0 0 ${glowSize}px ${color}66`, transition: 'box-shadow 0.4s ease'
      }} />
      <svg viewBox="0 0 140 140" aria-hidden="true">
        <circle cx="70" cy="70" r={R} fill={T.panel} />
        <circle cx="70" cy="70" r={R} fill="none" stroke={T.line2} strokeWidth="8" />
        <circle
          cx="70" cy="70" r={R} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={dashoffset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.05s linear, stroke 0.4s ease', filter: `drop-shadow(0 0 5px ${color}99)` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span
          key={displaySecs}
          className="timer-num"
          initial={{ scale: 1.25, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{ fontWeight: 800, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}
        >
          {displaySecs}
        </motion.span>
        <span style={{ fontSize: '0.62rem', color: T.text3, fontWeight: 600, letterSpacing: '0.08em', marginTop: 2 }}>SEC</span>
      </div>
    </motion.div>
  )
}

export default function QuestionScreen({ gameState, playerId, onAnswer, onTimeout }) {
  const cur = gameState.currentQuestion
  const q   = questions[cur]
  // This player's own layout: canonical letters (A–D) in slot order
  const order = useMemo(() => optionOrder(playerId, cur), [playerId, cur])

  const [selected, setSelected] = useState(null)   // canonical letter
  const [timeUp, setTimeUp]     = useState(false)
  const [fastZone, setFastZone] = useState(true)
  const lockedRef    = useRef(false)
  const fastZoneRef  = useRef(true)
  const timeUpRafRef = useRef()

  useEffect(() => {
    lockedRef.current   = false
    fastZoneRef.current = true
    setSelected(null)
    setTimeUp(false)
    setFastZone(true)
  }, [cur])

  useEffect(() => {
    cancelAnimationFrame(timeUpRafRef.current)
    const check = () => {
      const elapsed = (Date.now() - gameState.questionStartTime) / 1000
      if (elapsed >= q.time) {
        setTimeUp(true)
        if (!lockedRef.current) {
          lockedRef.current = true
          onTimeout?.()
        }
        return
      }
      const isFast = elapsed <= 15
      if (isFast !== fastZoneRef.current) { fastZoneRef.current = isFast; setFastZone(isFast) }
      timeUpRafRef.current = requestAnimationFrame(check)
    }
    timeUpRafRef.current = requestAnimationFrame(check)
    return () => cancelAnimationFrame(timeUpRafRef.current)
  }, [cur, gameState.questionStartTime, q.time, onTimeout])

  const handleSelect = useCallback((letter) => {
    if (selected || lockedRef.current) return
    lockedRef.current = true
    setSelected(letter)
    onAnswer(letter)
  }, [selected, onAnswer])

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{
        padding: '14px 18px', gap: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${T.line}`
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
          <div style={{ background: tint(T.primary, 0.16), color: T.primary, padding: '6px 14px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 700 }}>
            Q{cur + 1}/{questions.length}
          </div>
          <TopicTag topic={q.topic} />
          <LevelTag level={q.level} />
        </div>
        <div className="q-dots" style={{ display: 'flex', gap: 4, flexShrink: 0 }} aria-hidden="true">
          {questions.map((_, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: '50%',
              background: i < cur ? T.secondary : i === cur ? T.primary : T.line2,
              transition: 'background 0.3s'
            }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '22px 18px 28px', maxWidth: 780, margin: '0 auto', width: '100%' }}>

        {/* Timer + question */}
        <div className="q-head" style={{ marginBottom: 22 }}>
          <CircularTimer totalTime={q.time} questionStartTime={gameState.questionStartTime} />
          <motion.p
            className="q-text"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            style={{ flex: 1, fontWeight: 700, color: T.text, lineHeight: 1.4 }}
          >
            {q.text}
          </motion.p>
        </div>

        {/* Scoring hint */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <motion.div
            key={fastZone ? 'fast' : 'slow'}
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.22, type: 'spring', stiffness: 300, damping: 22 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 20,
              background: fastZone ? tint(T.correct, 0.14) : tint(T.primary, 0.12),
              border: `1px solid ${fastZone ? tint(T.correct, 0.4) : tint(T.primary, 0.35)}`
            }}
          >
            {fastZone && <span style={{ fontSize: '0.82rem' }}>⚡</span>}
            <span style={{ color: fastZone ? T.correct : T.primary, fontWeight: 800, fontSize: '0.88rem' }}>
              {fastZone ? '+5' : '+3'}
            </span>
            <span style={{ color: T.text3, fontSize: '0.72rem', fontWeight: 500 }}>
              {fastZone ? 'correct · first 15s' : 'correct · after 15s'}
            </span>
          </motion.div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 20, background: T.fill, border: `1px solid ${T.line}` }}>
            <span style={{ color: T.text2, fontWeight: 700, fontSize: '0.8rem' }}>0</span>
            <span style={{ color: T.text3, fontSize: '0.72rem', fontWeight: 500 }}>wrong</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 20, background: T.fill, border: `1px solid ${T.line}` }}>
            <span style={{ color: T.wrongText, fontWeight: 700, fontSize: '0.8rem' }}>−1</span>
            <span style={{ color: T.text3, fontSize: '0.72rem', fontWeight: 500 }}>no answer</span>
          </div>
        </div>

        {/* Time's up — options hidden, wait for the host */}
        {timeUp && !selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{
              padding: '28px 20px', borderRadius: 16, textAlign: 'center',
              background: tint(T.wrong, 0.10), border: `1px solid ${tint(T.wrong, 0.32)}`
            }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ fontSize: '2.4rem', marginBottom: 10 }}
            >⏰</motion.div>
            <div style={{ color: T.wrongText, fontWeight: 700, fontSize: '1.05rem', marginBottom: 6 }}>Time&apos;s up!</div>
            <div style={{ color: T.text3, fontSize: '0.85rem' }}>Waiting for the next question...</div>
          </motion.div>
        )}

        {/* Answer grid — this player's shuffled order; colour + shape belong to the slot */}
        {(!timeUp || selected) && (
          <div className="answers-grid">
            {order.map((letter, slot) => {
              const s          = SLOTS[slot]
              const isSelected = selected === letter
              const isDimmed   = !!selected && !isSelected

              return (
                <motion.button
                  key={letter}
                  type="button"
                  className="answer-btn"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isDimmed ? 0.28 : 1,
                    y: 0,
                    scale: isSelected ? [1, 0.93, 1.06, 1] : 1,
                  }}
                  transition={
                    isSelected
                      ? { scale: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }, opacity: { duration: 0.1 } }
                      : isDimmed
                      ? { duration: 0.3, ease: 'easeOut', delay: 0.05 }
                      : { delay: 0.15 + slot * 0.07, type: 'spring', stiffness: 260, damping: 22 }
                  }
                  whileHover={!selected ? { scale: 1.03, y: -3 } : {}}
                  whileTap={!selected ? { scale: 0.96 } : {}}
                  onClick={() => handleSelect(letter)}
                  disabled={!!selected}
                  aria-label={`${s.name}: ${q.options[letter]}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 16,
                    background: s.color, color: T.onAccent,
                    border: isSelected ? '3px solid #FFFFFF' : '3px solid transparent',
                    fontFamily: 'inherit', fontSize: '1rem', fontWeight: 600,
                    cursor: selected ? 'default' : 'pointer',
                    textAlign: 'left', lineHeight: 1.35,
                    filter: isDimmed ? 'blur(1.5px)' : 'none',
                    boxShadow: isSelected
                      ? `0 0 28px ${s.color}88, 0 6px 18px rgba(0,0,0,0.35)`
                      : '0 6px 18px rgba(0,0,0,0.25)',
                    transition: 'filter 0.3s ease, border-color 0.15s, box-shadow 0.2s'
                  }}
                >
                  <motion.span
                    animate={isSelected ? { rotate: [0, -8, 8, 0], scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: 40, height: 40, minWidth: 40, borderRadius: 10,
                      background: 'rgba(15,23,32,0.14)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1.15rem', flexShrink: 0
                    }}
                  >
                    {isSelected ? '✓' : <Shape shape={s.shape} size={20} color={T.onAccent} />}
                  </motion.span>
                  <span>{q.options[letter]}</span>
                </motion.button>
              )
            })}
          </div>
        )}

        {/* Locked toast */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              style={{
                marginTop: 18, padding: '14px 20px', borderRadius: 14, textAlign: 'center',
                background: tint(T.correct, 0.12), border: `1px solid ${tint(T.correct, 0.35)}`,
                color: T.correct, fontWeight: 600, fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >
              <motion.span animate={{ rotate: [0, 12, -8, 0] }} transition={{ duration: 0.4, delay: 0.1 }}>✅</motion.span>
              Locked in! Waiting for the next question...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
