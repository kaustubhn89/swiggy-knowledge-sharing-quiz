import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '../questions'

const ANS_COLORS = { A: '#367588', B: '#1C4A57', C: '#FC8019', D: '#7B5EA7' }
const ANS_GLOW   = { A: '#36758860', B: '#1C4A5760', C: '#FC801960', D: '#7B5EA760' }
const DIFF_COLORS = {
  Easy:   { bg: 'rgba(72,187,120,0.15)',  color: '#48BB78' },
  Medium: { bg: 'rgba(252,128,25,0.15)',  color: '#FC8019' },
  Hard:   { bg: 'rgba(245,101,101,0.15)', color: '#F56565' }
}

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
      const elapsed    = (Date.now() - questionStartTime) / 1000
      const remaining  = Math.max(0, totalTime - elapsed)
      const p          = remaining / totalTime
      setProgress(p)
      setDisplaySecs(Math.ceil(remaining))
      setUrgent(remaining <= 10 && remaining > 0)
      rafRef.current = requestAnimationFrame(update)
    }
    rafRef.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafRef.current)
  }, [totalTime, questionStartTime])

  const color    = progress > 0.5 ? '#367588' : progress > 0.25 ? '#FC8019' : '#F56565'
  const dashoffset = CIRC * (1 - progress)
  const glowSize = Math.round((1 - progress) * 28)

  return (
    <motion.div
      animate={urgent ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={urgent ? { duration: 0.7, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
      style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}
    >
      <div style={{
        position: 'absolute', inset: -6, borderRadius: '50%',
        boxShadow: `0 0 ${glowSize}px ${color}70`,
        transition: 'box-shadow 0.4s ease'
      }} />
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={R} fill="#14141F" />
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
        <circle
          cx="70" cy="70" r={R} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={dashoffset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.05s linear, stroke 0.4s ease', filter: `drop-shadow(0 0 5px ${color})` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <motion.span
          key={displaySecs}
          initial={{ scale: 1.25, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{ fontSize: 36, fontWeight: 900, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}
        >
          {displaySecs}
        </motion.span>
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.06em', marginTop: 2 }}>SEC</span>
      </div>
    </motion.div>
  )
}

export default function QuestionScreen({ gameState, onAnswer, onTimeout }) {
  const q           = questions[gameState.currentQuestion]
  const [selected, setSelected] = useState(null)
  const [timeUp, setTimeUp]     = useState(false)
  const [fastZone, setFastZone] = useState(true)
  const lockedRef    = useRef(false)
  const fastZoneRef  = useRef(true)
  const timeUpRafRef = useRef()

  useEffect(() => {
    lockedRef.current  = false
    fastZoneRef.current = true
    setSelected(null)
    setTimeUp(false)
    setFastZone(true)
  }, [gameState.currentQuestion])

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
  }, [gameState.currentQuestion, gameState.questionStartTime, q.time, onTimeout])

  const handleSelect = useCallback((letter) => {
    if (selected || lockedRef.current) return
    lockedRef.current = true
    setSelected(letter)
    const elapsed    = (Date.now() - gameState.questionStartTime) / 1000
    const remaining  = Math.max(0, q.time - elapsed)
    onAnswer(letter, remaining)
  }, [selected, gameState.questionStartTime, q.time, onAnswer])

  const diff = DIFF_COLORS[q.difficulty] || DIFF_COLORS.Easy

  return (
    <div style={{ minHeight: '100vh', background: '#1A1A2A', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ background: 'rgba(252,128,25,0.15)', color: '#FC8019', padding: '6px 14px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 800 }}>
            Q{gameState.currentQuestion + 1}/{questions.length}
          </div>
          <div style={{ background: diff.bg, color: diff.color, padding: '6px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
            {q.difficulty.toUpperCase()}
          </div>
        </div>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 4 }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: i < gameState.currentQuestion ? '#FC8019' : i === gameState.currentQuestion ? '#fff' : 'rgba(255,255,255,0.15)',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px', maxWidth: 680, margin: '0 auto', width: '100%' }}>

        {/* Timer + Question */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 28 }}>
          <CircularTimer totalTime={q.time} questionStartTime={gameState.questionStartTime} />
          <motion.p
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            style={{ flex: 1, fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)', fontWeight: 800, color: '#fff', lineHeight: 1.45, paddingTop: 8 }}
          >
            {q.text}
          </motion.p>
        </div>

        {/* Scoring hint */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Fast zone badge — switches at 15s */}
          <motion.div
            key={fastZone ? 'fast' : 'slow'}
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.22, type: 'spring', stiffness: 300, damping: 22 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 20,
              background: fastZone ? 'rgba(72,187,120,0.15)' : 'rgba(252,128,25,0.1)',
              border: `1px solid ${fastZone ? 'rgba(72,187,120,0.4)' : 'rgba(252,128,25,0.3)'}`
            }}
          >
            {fastZone && <span style={{ fontSize: '0.82rem' }}>⚡</span>}
            <span style={{
              color: fastZone ? '#48BB78' : '#FC8019',
              fontWeight: 900, fontSize: '0.88rem'
            }}>
              {fastZone ? '+5' : '+3'}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', fontWeight: 500 }}>
              {fastZone ? 'correct · first 15s' : 'correct · after 15s'}
            </span>
          </motion.div>
          {/* Wrong */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, fontSize: '0.8rem' }}>0</span>
            <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.72rem', fontWeight: 500 }}>wrong</span>
          </div>
          {/* No answer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: '#F56565', fontWeight: 800, fontSize: '0.8rem' }}>−1</span>
            <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.72rem', fontWeight: 500 }}>no answer</span>
          </div>
        </div>

        {/* Time's up — hide options and show waiting screen */}
        {timeUp && !selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{
              padding: '28px 20px', borderRadius: 16, textAlign: 'center',
              background: 'rgba(245,101,101,0.07)',
              border: '1px solid rgba(245,101,101,0.2)'
            }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ fontSize: '2.4rem', marginBottom: 10 }}
            >⏰</motion.div>
            <div style={{ color: '#F56565', fontWeight: 800, fontSize: '1.05rem', marginBottom: 6 }}>
              Time&apos;s up!
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
              Waiting for the next question...
            </div>
          </motion.div>
        )}

        {/* Answer grid — hidden once time expires (unless already answered) */}
        {(!timeUp || selected) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {Object.entries(q.options).map(([letter, text], i) => {
            const isSelected = selected === letter
            const isDimmed   = selected && !isSelected

            return (
              <motion.button
                key={letter}
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
                    : { delay: 0.15 + i * 0.07, type: 'spring', stiffness: 260, damping: 22 }
                }
                whileHover={!selected ? { scale: 1.04, y: -3 } : {}}
                whileTap={!selected ? { scale: 0.95 } : {}}
                onClick={() => handleSelect(letter)}
                disabled={!!selected}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '16px 18px', borderRadius: 16,
                  background: ANS_COLORS[letter],
                  border: isSelected ? '2px solid rgba(255,255,255,0.8)' : '2px solid transparent',
                  color: '#fff', fontFamily: 'inherit',
                  fontSize: '0.95rem', fontWeight: 600,
                  cursor: selected ? 'default' : 'pointer',
                  textAlign: 'left', lineHeight: 1.35,
                  filter: isDimmed ? 'blur(1.5px)' : 'none',
                  boxShadow: isSelected
                    ? `0 0 28px ${ANS_GLOW[letter]}, 0 4px 16px rgba(0,0,0,0.3)`
                    : '0 4px 16px rgba(0,0,0,0.25)',
                  transition: 'filter 0.3s ease, border-color 0.15s, box-shadow 0.2s'
                }}
              >
                <motion.span
                  animate={isSelected ? { rotate: [0, -8, 8, 0], scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: 32, height: 32, minWidth: 32, borderRadius: 8,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.9rem', flexShrink: 0
                  }}
                >
                  {isSelected ? '✓' : letter}
                </motion.span>
                <span>{text}</span>
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
                marginTop: 20, padding: '14px 20px',
                background: 'rgba(72,187,120,0.12)',
                border: '1px solid rgba(72,187,120,0.3)',
                borderRadius: 14, textAlign: 'center',
                color: '#48BB78', fontWeight: 700, fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >
              <motion.span
                animate={{ rotate: [0, 12, -8, 0] }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                ✅
              </motion.span>
              Locked in! Waiting for the next question...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
