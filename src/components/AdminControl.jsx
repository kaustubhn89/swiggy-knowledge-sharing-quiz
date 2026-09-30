import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '../questions'
import { T, APP_NAME, AVATAR_COLORS, tint } from '../brand'

const ANS_COLORS  = T.ans
const RANK_COLORS = [T.gold, T.silver, T.bronze]

function getInitial(name) { return (name || '?').charAt(0).toUpperCase() }

export default function AdminControl({ gameState, players, onNextQuestion, onShowLeaderboard, isLastQuestion, onBackToSessions }) {
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

  const playerList      = Object.values(players)
  const answeredPlayers = playerList.filter(p => p.answers?.[gameState.currentQuestion])
  const answeredCount   = answeredPlayers.length
  const totalPlayers    = playerList.length
  const timerExpired    = timeRemaining <= 0
  const canAdvance      = answeredCount > 0 || timerExpired
  const answerProgress  = totalPlayers > 0 ? (answeredCount / totalPlayers) * 100 : 0

  const distribution = { A: 0, B: 0, C: 0, D: 0 }
  answeredPlayers.forEach(p => {
    const ans = p.answers[gameState.currentQuestion]?.answer
    if (ans && ans in distribution) distribution[ans]++
  })

  const timerColor = timeRemaining > totalTime * 0.5 ? T.green : timeRemaining > totalTime * 0.25 ? T.orange : T.red

  // Live leaderboard: sorted by totalScore desc
  const rankedPlayers = Object.entries(players)
    .map(([id, p]) => ({ id, name: p.name, score: p.totalScore || 0, answered: !!p.answers?.[gameState.currentQuestion] }))
    .sort((a, b) => b.score - a.score)

  const sectionLabel = { color: T.ink3, fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }
  const card = { background: T.card, borderRadius: 12, border: `1.5px solid ${T.line}`, boxShadow: T.shadowCard }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex' }}>

      {/* ── Left sidebar: players status ─── */}
      <div style={{
        width: 220, minWidth: 220, background: T.card,
        borderRight: `1px solid ${T.line}`,
        display: 'flex', flexDirection: 'column', padding: '20px 14px',
        overflow: 'hidden'
      }}>
        {/* Back + title */}
        <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${T.line}` }}>
          <button
            onClick={onBackToSessions}
            style={{
              background: 'none', border: 'none', color: T.ink3,
              fontSize: '0.73rem', fontWeight: 600, fontFamily: 'inherit',
              cursor: 'pointer', marginBottom: 10, padding: 0,
              display: 'flex', alignItems: 'center', gap: 4
            }}
          >
            ← Sessions
          </button>
          <div style={{ fontSize: '1.1rem', marginBottom: 5 }}>⚡</div>
          <h3 style={{ color: T.ink, fontWeight: 800, fontSize: '0.88rem', lineHeight: 1.25, marginBottom: 2 }}>{APP_NAME}</h3>
          <p style={{ color: T.ink3, fontSize: '0.72rem' }}>Admin Control</p>
        </div>

        {/* Progress segments */}
        <div style={{ marginBottom: 18 }}>
          <p style={sectionLabel}>Progress</p>
          <div style={{ display: 'flex', gap: 3 }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                height: 4, flex: 1, borderRadius: 3,
                background: i < gameState.currentQuestion ? T.teal : i === gameState.currentQuestion ? T.orange : T.fill2,
                transition: 'background 0.3s'
              }} />
            ))}
          </div>
          <p style={{ color: T.ink3, fontSize: '0.72rem', marginTop: 5 }}>
            Q{gameState.currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Who answered */}
        <p style={sectionLabel}>Players ({totalPlayers})</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto', flex: 1 }}>
          {playerList.map((p, i) => {
            const answered = !!p.answers?.[gameState.currentQuestion]
            return (
              <div key={p.name} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 9px', borderRadius: 8,
                background: answered ? tint(T.green, 0.08) : T.fill
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 800, color: '#fff'
                }}>
                  {getInitial(p.name)}
                </div>
                <span style={{ color: T.ink2, fontSize: '0.77rem', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.name}
                </span>
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: answered ? T.green : T.line2
                }} />
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Main content ────────────────────── */}
      <div style={{ flex: 1, padding: '24px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Top: Q number + timer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ background: tint(T.teal, 0.12), color: T.teal, padding: '6px 14px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 800 }}>
              Q{gameState.currentQuestion + 1}/{questions.length}
            </span>
            {q.difficulty && (
              <span style={{
                background: q.difficulty === 'Easy' ? tint(T.green, 0.12) : q.difficulty === 'Hard' ? tint(T.red, 0.12) : tint(T.orange, 0.12),
                color: q.difficulty === 'Easy' ? T.green : q.difficulty === 'Hard' ? T.red : T.orange,
                padding: '6px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700
              }}>
                {q.difficulty.toUpperCase()}
              </span>
            )}
          </div>
          <div style={{
            background: timerExpired ? tint(T.red, 0.10) : T.card,
            border: `1.5px solid ${timerColor}55`, borderRadius: 12, padding: '7px 16px',
            color: timerColor, fontWeight: 800, fontSize: '1.3rem',
            fontVariantNumeric: 'tabular-nums', transition: 'color 0.4s, border-color 0.4s'
          }}>
            {timerExpired ? '⏰ Time up' : `${Math.ceil(timeRemaining)}s`}
          </div>
        </div>

        {/* Question card (no answer highlight) */}
        <div style={{ ...card, borderRadius: 16, padding: '18px 20px' }}>
          <p style={{ color: T.ink, fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', fontWeight: 700, lineHeight: 1.5, marginBottom: 14 }}>
            {q.text}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {Object.entries(q.options).map(([letter, text]) => (
              <div key={letter} style={{
                display: 'flex', gap: 8, alignItems: 'center',
                padding: '8px 11px', borderRadius: 8,
                background: T.fill,
                border: `1px solid ${T.line}`
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 5, flexShrink: 0,
                  background: ANS_COLORS[letter],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.73rem', color: '#fff'
                }}>
                  {letter}
                </span>
                <span style={{ color: T.ink2, fontSize: '0.8rem', fontWeight: 600 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ ...card, padding: '14px 18px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: T.green, fontVariantNumeric: 'tabular-nums' }}>{answeredCount}</div>
            <div style={{ color: T.ink3, fontSize: '0.75rem', fontWeight: 600, marginTop: 2 }}>Answered</div>
          </div>
          <div style={{ ...card, padding: '14px 18px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: T.orange, fontVariantNumeric: 'tabular-nums' }}>{totalPlayers - answeredCount}</div>
            <div style={{ color: T.ink3, fontSize: '0.75rem', fontWeight: 600, marginTop: 2 }}>Waiting</div>
          </div>
        </div>

        {/* Answer progress + distribution */}
        <div style={{ ...card, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ color: T.ink2, fontSize: '0.78rem', fontWeight: 600 }}>
              {answeredCount}/{totalPlayers} answered
            </span>
            <span style={{ color: T.teal, fontSize: '0.78rem', fontWeight: 800 }}>
              {Math.round(answerProgress)}%
            </span>
          </div>
          <div style={{ height: 7, background: T.fill2, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
            <motion.div
              animate={{ width: `${answerProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ height: '100%', background: T.gradPrimary, borderRadius: 4 }}
            />
          </div>
          {answeredCount > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {Object.entries(distribution).map(([letter, count]) => {
                const pct = answeredCount > 0 ? (count / answeredCount) * 100 : 0
                return (
                  <div key={letter} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                      background: ANS_COLORS[letter],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.7rem', color: '#fff'
                    }}>
                      {letter}
                    </span>
                    <div style={{ flex: 1, height: 16, background: T.fill, borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        style={{ height: '100%', background: ANS_COLORS[letter], borderRadius: 3, opacity: 0.85 }}
                      />
                    </div>
                    <span style={{ width: 16, fontWeight: 700, color: T.ink2, fontSize: '0.78rem', textAlign: 'right' }}>{count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Next button */}
        <motion.button
          whileHover={canAdvance ? { scale: 1.02 } : {}}
          whileTap={canAdvance ? { scale: 0.97 } : {}}
          onClick={isLastQuestion ? onShowLeaderboard : onNextQuestion}
          disabled={!canAdvance}
          animate={canAdvance ? { boxShadow: ['0 8px 24px rgba(54,117,136,0.20)', '0 8px 32px rgba(54,117,136,0.45)', '0 8px 24px rgba(54,117,136,0.20)'] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 14, border: 'none',
            background: canAdvance ? T.gradPrimary : T.disabled,
            color: canAdvance ? '#fff' : T.ink4,
            fontSize: '1rem', fontWeight: 800, fontFamily: 'inherit',
            cursor: canAdvance ? 'pointer' : 'not-allowed',
            transition: 'background 0.3s, color 0.3s'
          }}
        >
          {isLastQuestion ? '🏆 Show Leaderboard' : 'Next Question →'}
        </motion.button>

        {!canAdvance && (
          <p style={{ color: T.ink3, textAlign: 'center', fontSize: '0.78rem', marginTop: -8 }}>
            Waiting for at least 1 answer or timer to expire
          </p>
        )}
      </div>

      {/* ── Right: Live Leaderboard ──────────── */}
      <div style={{
        width: 230, minWidth: 230, background: T.card,
        borderLeft: `1px solid ${T.line}`,
        display: 'flex', flexDirection: 'column', padding: '20px 14px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${T.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, flexShrink: 0 }}
            />
            <span style={{ color: T.ink, fontWeight: 800, fontSize: '0.9rem' }}>Live Standings</span>
          </div>
          <p style={{ color: T.ink3, fontSize: '0.7rem', marginTop: 4 }}>
            Updates as players answer
          </p>
        </div>

        {/* Ranked list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto', flex: 1 }}>
          <AnimatePresence>
            {rankedPlayers.length === 0 && (
              <p style={{ color: T.ink3, fontSize: '0.78rem', textAlign: 'center', marginTop: 20 }}>
                No players yet
              </p>
            )}
            {rankedPlayers.map((p, i) => {
              const rank      = i + 1
              const rankColor = RANK_COLORS[i] || null
              const avatarBg  = AVATAR_COLORS[i % AVATAR_COLORS.length]

              return (
                <motion.div
                  key={p.id}
                  layout
                  layoutId={p.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24, delay: i * 0.04 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', borderRadius: 10,
                    background: p.answered ? tint(T.green, 0.07) : T.fill,
                    border: rankColor ? `1px solid ${rankColor}40` : '1px solid transparent',
                    transition: 'background 0.3s'
                  }}
                >
                  {/* Rank */}
                  <span style={{
                    width: 20, textAlign: 'center', flexShrink: 0,
                    fontWeight: 800,
                    fontSize: rank <= 3 ? '0.85rem' : '0.7rem',
                    color: rankColor || T.ink4
                  }}>
                    {rank <= 3 ? ['🥇','🥈','🥉'][i] : `#${rank}`}
                  </span>

                  {/* Avatar */}
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: avatarBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 800, color: '#fff'
                  }}>
                    {getInitial(p.name)}
                  </div>

                  {/* Name */}
                  <span style={{
                    flex: 1, color: T.ink, fontWeight: 600, fontSize: '0.78rem',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {p.name}
                  </span>

                  {/* Score + answered dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <span style={{
                      color: rankColor || T.ink, fontWeight: 800, fontSize: '0.82rem',
                      fontVariantNumeric: 'tabular-nums'
                    }}>
                      {p.score}
                    </span>
                    {p.answered && (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.green }} />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Footer: answered count */}
        <div style={{
          marginTop: 12, paddingTop: 12,
          borderTop: `1px solid ${T.line}`,
          textAlign: 'center'
        }}>
          <span style={{ color: T.ink3, fontSize: '0.7rem' }}>
            <span style={{ color: T.green, fontWeight: 700 }}>{answeredCount}</span>/{totalPlayers} answered this Q
          </span>
        </div>
      </div>
    </div>
  )
}
