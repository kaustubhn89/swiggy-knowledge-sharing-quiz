import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '../questions'

const ANS_COLORS = { A: '#367588', B: '#1C4A57', C: '#FC8019', D: '#7B5EA7' }
const AVATAR_COLORS = ['#FC8019','#367588','#7B5EA7','#48BB78','#E35D34','#4299e1']

export default function AdminControl({ gameState, players, onNextQuestion, onShowLeaderboard, isLastQuestion }) {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const rafRef = useRef()
  const q = questions[gameState.currentQuestion]
  const totalTime = q.time

  useEffect(() => {
    const update = () => {
      const elapsed = (Date.now() - gameState.questionStartTime) / 1000
      setTimeRemaining(Math.max(0, totalTime - elapsed))
      rafRef.current = requestAnimationFrame(update)
    }
    rafRef.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafRef.current)
  }, [gameState.currentQuestion, gameState.questionStartTime, totalTime])

  const playerList = Object.values(players)
  const answeredPlayers = playerList.filter(p => p.answers?.[gameState.currentQuestion])
  const answeredCount = answeredPlayers.length
  const totalPlayers = playerList.length
  const timerExpired = timeRemaining <= 0
  const canAdvance = answeredCount > 0 || timerExpired
  const answerProgress = totalPlayers > 0 ? (answeredCount / totalPlayers) * 100 : 0

  const distribution = { A: 0, B: 0, C: 0, D: 0 }
  answeredPlayers.forEach(p => {
    const ans = p.answers[gameState.currentQuestion]?.answer
    if (ans && ans in distribution) distribution[ans]++
  })

  const timerColor = timeRemaining > totalTime * 0.5 ? '#48BB78' : timeRemaining > totalTime * 0.25 ? '#FC8019' : '#F56565'

  return (
    <div style={{ minHeight: '100vh', background: '#1A1A2A', display: 'flex' }}>
      {/* ── Sidebar ─────────────────────────────── */}
      <div style={{
        width: 260, minWidth: 260, background: '#14141F',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', padding: '24px 16px',
        overflow: 'hidden'
      }}
        className="admin-sidebar"
      >
        {/* Title */}
        <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>⚡</div>
          <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', marginBottom: 2 }}>Swiggy KS Quiz</h3>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>Admin Control Panel</p>
        </div>

        {/* Progress segments */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Progress
          </p>
          <div style={{ display: 'flex', gap: 4 }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                height: 5, flex: 1, borderRadius: 3,
                background: i < gameState.currentQuestion ? '#FC8019' : i === gameState.currentQuestion ? '#fff' : 'rgba(255,255,255,0.1)',
                transition: 'background 0.3s'
              }} />
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: 6 }}>
            Q{gameState.currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Players */}
        <div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Players ({totalPlayers})
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
            {playerList.map((p, i) => {
              const answered = !!p.answers?.[gameState.currentQuestion]
              return (
                <div key={p.name} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px', borderRadius: 8,
                  background: answered ? 'rgba(72,187,120,0.08)' : 'rgba(255,255,255,0.03)'
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800, color: '#fff'
                  }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </span>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: answered ? '#48BB78' : 'rgba(255,255,255,0.15)'
                  }} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────── */}
      <div style={{ flex: 1, padding: '28px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Top: Q number + timer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{
              background: 'rgba(252,128,25,0.15)', color: '#FC8019',
              padding: '6px 14px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 800
            }}>
              Q{gameState.currentQuestion + 1}/{questions.length}
            </span>
            <span style={{
              background: q.difficulty === 'Easy' ? 'rgba(72,187,120,0.12)' : q.difficulty === 'Hard' ? 'rgba(245,101,101,0.12)' : 'rgba(252,128,25,0.12)',
              color: q.difficulty === 'Easy' ? '#48BB78' : q.difficulty === 'Hard' ? '#F56565' : '#FC8019',
              padding: '6px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700
            }}>
              {q.difficulty.toUpperCase()}
            </span>
          </div>
          <div style={{
            background: timerExpired ? 'rgba(245,101,101,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1.5px solid ${timerColor}40`,
            borderRadius: 12, padding: '8px 16px',
            color: timerColor, fontWeight: 800, fontSize: '1.4rem',
            fontVariantNumeric: 'tabular-nums',
            transition: 'color 0.4s, border-color 0.4s'
          }}>
            {timerExpired ? '⏰ Time up' : `${Math.ceil(timeRemaining)}s`}
          </div>
        </div>

        {/* Question card */}
        <div style={{
          background: '#252535', borderRadius: 16, padding: '20px 22px',
          border: '1.5px solid rgba(255,255,255,0.06)'
        }}>
          <p style={{
            color: '#fff', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            fontWeight: 700, lineHeight: 1.5, marginBottom: 16
          }}>
            {q.text}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {Object.entries(q.options).map(([letter, text]) => (
              <div key={letter} style={{
                display: 'flex', gap: 8, alignItems: 'center',
                padding: '8px 12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 5, flexShrink: 0,
                  background: ANS_COLORS[letter] + '40',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.75rem', color: '#fff'
                }}>
                  {letter}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', fontWeight: 600 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: '#252535', borderRadius: 14, padding: '16px 20px', border: '1.5px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#48BB78', fontVariantNumeric: 'tabular-nums' }}>{answeredCount}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', fontWeight: 600, marginTop: 2 }}>Answered</div>
          </div>
          <div style={{ background: '#252535', borderRadius: 14, padding: '16px 20px', border: '1.5px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FC8019', fontVariantNumeric: 'tabular-nums' }}>{totalPlayers - answeredCount}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', fontWeight: 600, marginTop: 2 }}>Waiting</div>
          </div>
        </div>

        {/* Answer progress bar */}
        <div style={{ background: '#252535', borderRadius: 14, padding: '16px 20px', border: '1.5px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600 }}>
              {answeredCount}/{totalPlayers} players answered
            </span>
            <span style={{ color: '#FC8019', fontSize: '0.8rem', fontWeight: 800 }}>
              {Math.round(answerProgress)}%
            </span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${answerProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #FC8019, #E35D34)', borderRadius: 4 }}
            />
          </div>

          {/* Distribution */}
          {answeredCount > 0 && (
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(distribution).map(([letter, count]) => {
                const pct = answeredCount > 0 ? (count / answeredCount) * 100 : 0
                return (
                  <div key={letter} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 5, flexShrink: 0,
                      background: ANS_COLORS[letter] + '40',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.72rem', color: '#fff'
                    }}>
                      {letter}
                    </span>
                    <div style={{ flex: 1, height: 18, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        style={{ height: '100%', background: ANS_COLORS[letter], borderRadius: 3, opacity: 0.8 }}
                      />
                    </div>
                    <span style={{ width: 18, fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textAlign: 'right' }}>{count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Action button */}
        <motion.button
          whileHover={canAdvance ? { scale: 1.02 } : {}}
          whileTap={canAdvance ? { scale: 0.97 } : {}}
          onClick={isLastQuestion ? onShowLeaderboard : onNextQuestion}
          disabled={!canAdvance}
          animate={canAdvance ? { boxShadow: ['0 8px 24px rgba(252,128,25,0.2)', '0 8px 32px rgba(252,128,25,0.5)', '0 8px 24px rgba(252,128,25,0.2)'] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '100%', padding: '18px',
            borderRadius: 14, border: 'none',
            background: canAdvance ? 'linear-gradient(135deg, #FC8019, #E35D34)' : 'rgba(255,255,255,0.07)',
            color: canAdvance ? '#fff' : 'rgba(255,255,255,0.2)',
            fontSize: '1.05rem', fontWeight: 800, fontFamily: 'inherit',
            cursor: canAdvance ? 'pointer' : 'not-allowed',
            transition: 'background 0.3s, color 0.3s'
          }}
        >
          {isLastQuestion ? '🏆 Show Leaderboard' : 'Next Question →'}
        </motion.button>

        {!canAdvance && (
          <p style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', fontSize: '0.8rem' }}>
            Waiting for at least 1 answer or timer to expire
          </p>
        )}
      </div>
    </div>
  )
}
