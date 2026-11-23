import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions, LETTERS } from '../questions'
import { T, APP_NAME, AVATAR_COLORS, tint } from '../brand'
import { Logo, TopicTag, LevelTag } from './ui'

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

  // Answers are stored by canonical letter, so this is correct whatever order each phone showed
  const distribution = { A: 0, B: 0, C: 0, D: 0 }
  answeredPlayers.forEach(p => {
    const ans = p.answers[gameState.currentQuestion]?.answer
    if (ans && ans in distribution) distribution[ans]++
  })

  const timerColor = timeRemaining > totalTime * 0.5 ? T.correct : timeRemaining > totalTime * 0.25 ? T.primary : T.wrong

  const rankedPlayers = Object.entries(players)
    .map(([id, p]) => ({ id, name: p.name, score: p.totalScore || 0, answered: !!p.answers?.[gameState.currentQuestion] }))
    .sort((a, b) => b.score - a.score)

  const sectionLabel = { color: T.text3, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 7 }
  const card = { background: T.panel, borderRadius: 14, border: `1px solid ${T.line}`, boxShadow: T.shadowCard }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex' }}>

      {/* ── Left sidebar: players status ─── */}
      <div style={{
        width: 220, minWidth: 220, background: T.panel, borderRight: `1px solid ${T.line}`,
        display: 'flex', flexDirection: 'column', padding: '18px 14px', overflow: 'hidden'
      }}>
        <div style={{ marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${T.line}` }}>
          <button
            onClick={onBackToSessions}
            style={{ background: 'none', border: 'none', color: T.text3, fontSize: '0.75rem', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', marginBottom: 12, padding: 0 }}
          >
            ← Sessions
          </button>
          <div style={{ marginBottom: 8 }}><Logo size={22} /></div>
          <h3 style={{ color: T.text, fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.3, marginBottom: 2 }}>{APP_NAME}</h3>
          <p style={{ color: T.text3, fontSize: '0.72rem' }}>Host control</p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <p style={sectionLabel}>Progress</p>
          <div style={{ display: 'flex', gap: 3 }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                height: 5, flex: 1, borderRadius: 3,
                background: i < gameState.currentQuestion ? T.secondary : i === gameState.currentQuestion ? T.primary : T.fill2,
                transition: 'background 0.3s'
              }} />
            ))}
          </div>
          <p style={{ color: T.text3, fontSize: '0.72rem', marginTop: 5 }}>Q{gameState.currentQuestion + 1} of {questions.length}</p>
        </div>

        <p style={sectionLabel}>Players ({totalPlayers})</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto', flex: 1 }}>
          {playerList.map((p, i) => {
            const answered = !!p.answers?.[gameState.currentQuestion]
            return (
              <div key={p.name} style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '7px 9px', borderRadius: 8,
                background: answered ? tint(T.correct, 0.10) : T.fill
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 700, color: T.onAccent
                }}>
                  {getInitial(p.name)}
                </div>
                <span style={{ color: T.text2, fontSize: '0.78rem', fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.name}
                </span>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: answered ? T.correct : T.line2 }} />
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Main content ────────────────────── */}
      <div style={{ flex: 1, padding: '22px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Q number + timer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ background: tint(T.primary, 0.16), color: T.primary, padding: '6px 14px', borderRadius: 20, fontSize: '0.88rem', fontWeight: 700 }}>
            Question {gameState.currentQuestion + 1} of {questions.length}
          </span>
          <div style={{
            background: timerExpired ? tint(T.wrong, 0.14) : T.panel,
            border: `1.5px solid ${timerColor}66`, borderRadius: 12, padding: '6px 18px',
            color: timerColor, fontWeight: 800, fontSize: '1.4rem',
            fontVariantNumeric: 'tabular-nums', transition: 'color 0.4s, border-color 0.4s'
          }}>
            {timerExpired ? '⏰ Time up' : `${Math.ceil(timeRemaining)}s`}
          </div>
        </div>

        {/* Question card — topic in the header, options in canonical order (no answer highlight) */}
        <div style={{ ...card, borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <TopicTag topic={q.topic} />
              <LevelTag level={q.level} />
            </div>
            <span style={{ color: T.text3, fontSize: '0.74rem' }}>🔀 Options are shuffled on every phone</span>
          </div>
          <p style={{ color: T.text, fontSize: 'clamp(1.05rem, 2vw, 1.4rem)', fontWeight: 700, lineHeight: 1.45, marginBottom: 14 }}>
            {q.text}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {LETTERS.map((letter, i) => (
              <div key={letter} style={{
                display: 'flex', gap: 10, alignItems: 'center',
                padding: '10px 12px', borderRadius: 10, background: T.fill, border: `1px solid ${T.line}`
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0, background: T.fill2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.75rem', color: T.text2
                }}>
                  {i + 1}
                </span>
                <span style={{ color: T.text2, fontSize: '0.88rem', fontWeight: 500 }}>{q.options[letter]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ ...card, padding: '14px 18px' }}>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: T.correct, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>{answeredCount}</div>
            <div style={{ color: T.text3, fontSize: '0.76rem', fontWeight: 500, marginTop: 2 }}>Answered</div>
          </div>
          <div style={{ ...card, padding: '14px 18px' }}>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: T.primary, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>{totalPlayers - answeredCount}</div>
            <div style={{ color: T.text3, fontSize: '0.76rem', fontWeight: 500, marginTop: 2 }}>Waiting</div>
          </div>
        </div>

        {/* Progress + distribution */}
        <div style={{ ...card, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ color: T.text2, fontSize: '0.8rem', fontWeight: 500 }}>{answeredCount}/{totalPlayers} answered</span>
            <span style={{ color: T.primary, fontSize: '0.8rem', fontWeight: 700 }}>{Math.round(answerProgress)}%</span>
          </div>
          <div style={{ height: 8, background: T.fill2, borderRadius: 4, overflow: 'hidden', marginBottom: answeredCount > 0 ? 14 : 0 }}>
            <motion.div
              animate={{ width: `${answerProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ height: '100%', background: T.gradPrimary, borderRadius: 4 }}
            />
          </div>
          {answeredCount > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {LETTERS.map((letter, i) => {
                const count = distribution[letter]
                const pct   = (count / answeredCount) * 100
                return (
                  <div key={letter}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                      <span style={{ color: T.text2, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ color: T.text3, fontWeight: 700, marginRight: 7 }}>{i + 1}</span>{q.options[letter]}
                      </span>
                      <span style={{ color: T.text, fontWeight: 700, fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                    </div>
                    <div style={{ height: 10, background: T.fill, borderRadius: 5, overflow: 'hidden' }}>
                      <motion.div
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        style={{ height: '100%', background: T.secondary, borderRadius: 5 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Next */}
        <motion.button
          whileHover={canAdvance ? { scale: 1.01 } : {}}
          whileTap={canAdvance ? { scale: 0.98 } : {}}
          onClick={isLastQuestion ? onShowLeaderboard : onNextQuestion}
          disabled={!canAdvance}
          animate={canAdvance ? { boxShadow: ['0 8px 24px rgba(255,153,0,0.18)', '0 8px 32px rgba(255,153,0,0.45)', '0 8px 24px rgba(255,153,0,0.18)'] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '100%', padding: '17px', borderRadius: 14, border: 'none',
            background: canAdvance ? T.gradPrimary : T.fill2,
            color: canAdvance ? T.onAccent : T.text4,
            fontSize: '1.05rem', fontWeight: 700, fontFamily: 'inherit',
            cursor: canAdvance ? 'pointer' : 'not-allowed',
            transition: 'background 0.3s, color 0.3s'
          }}
        >
          {isLastQuestion ? '🏆 Show Final Results' : 'Next Question →'}
        </motion.button>

        {!canAdvance && (
          <p style={{ color: T.text3, textAlign: 'center', fontSize: '0.78rem', marginTop: -6 }}>
            Waiting for at least 1 answer or the timer to run out
          </p>
        )}
      </div>

      {/* ── Right: live standings ──────────── */}
      <div style={{
        width: 240, minWidth: 240, background: T.panel, borderLeft: `1px solid ${T.line}`,
        display: 'flex', flexDirection: 'column', padding: '18px 14px', overflow: 'hidden'
      }}>
        <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${T.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: '50%', background: T.correct, flexShrink: 0 }}
            />
            <span style={{ color: T.text, fontWeight: 700, fontSize: '0.92rem' }}>Live Standings</span>
          </div>
          <p style={{ color: T.text3, fontSize: '0.7rem', marginTop: 4 }}>Updates as players answer</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto', flex: 1 }}>
          <AnimatePresence>
            {rankedPlayers.length === 0 && (
              <p style={{ color: T.text3, fontSize: '0.78rem', textAlign: 'center', marginTop: 20 }}>No players yet</p>
            )}
            {rankedPlayers.map((p, i) => {
              const rank      = i + 1
              const rankColor = RANK_COLORS[i] || null
              return (
                <motion.div
                  key={p.id}
                  layout
                  layoutId={p.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24, delay: i * 0.04 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 10,
                    background: p.answered ? tint(T.correct, 0.08) : T.fill,
                    border: `1px solid ${rankColor ? tint(rankColor, 0.35) : 'transparent'}`,
                    transition: 'background 0.3s'
                  }}
                >
                  <span style={{
                    width: 20, textAlign: 'center', flexShrink: 0, fontWeight: 700,
                    fontSize: rank <= 3 ? '0.85rem' : '0.72rem', color: rankColor || T.text3
                  }}>
                    {rank <= 3 ? ['🥇', '🥈', '🥉'][i] : `#${rank}`}
                  </span>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700, color: T.onAccent
                  }}>
                    {getInitial(p.name)}
                  </div>
                  <span style={{ flex: 1, color: T.text, fontWeight: 500, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <span style={{ color: rankColor || T.text, fontWeight: 700, fontSize: '0.84rem', fontVariantNumeric: 'tabular-nums' }}>{p.score}</span>
                    {p.answered && <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.correct }} />}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.line}`, textAlign: 'center' }}>
          <span style={{ color: T.text3, fontSize: '0.72rem' }}>
            <span style={{ color: T.correct, fontWeight: 700 }}>{answeredCount}</span>/{totalPlayers} answered this question
          </span>
        </div>
      </div>
    </div>
  )
}
