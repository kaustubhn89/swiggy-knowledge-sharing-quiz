import { useState, useEffect } from 'react'
import { questions } from '../questions'

const OPTION_COLORS = {
  A: 'var(--teal)',
  B: 'var(--dark-teal)',
  C: 'var(--orange)',
  D: 'var(--purple)'
}

export default function AdminControl({ gameState, players, onNextQuestion, onShowLeaderboard, isLastQuestion }) {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const q = questions[gameState.currentQuestion]
  const totalTime = q.time

  useEffect(() => {
    const tick = () => {
      const elapsed = (Date.now() - gameState.questionStartTime) / 1000
      setTimeRemaining(Math.max(0, totalTime - elapsed))
    }
    tick()
    const interval = setInterval(tick, 200)
    return () => clearInterval(interval)
  }, [gameState.currentQuestion, gameState.questionStartTime, totalTime])

  const playerList = Object.values(players)
  const answeredPlayers = playerList.filter(p => p.answers?.[gameState.currentQuestion])
  const answeredCount = answeredPlayers.length
  const totalPlayers = playerList.length
  const timerExpired = timeRemaining <= 0
  const canAdvance = answeredCount > 0 || timerExpired

  // Answer distribution
  const distribution = { A: 0, B: 0, C: 0, D: 0 }
  answeredPlayers.forEach(p => {
    const ans = p.answers[gameState.currentQuestion]?.answer
    if (ans && distribution[ans] !== undefined) distribution[ans]++
  })

  return (
    <div className="screen-top" style={{ background: 'var(--off-white)', paddingTop: 24 }}>
      <div className="card-wide">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="question-number">Q{gameState.currentQuestion + 1}/{questions.length}</span>
            <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
          </div>
          <div style={{
            background: timerExpired ? 'var(--red)' : timeRemaining < totalTime * 0.25 ? '#fee2e2' : timeRemaining < totalTime * 0.5 ? '#fff7ed' : '#f0fdf4',
            color: timerExpired ? 'white' : timeRemaining < totalTime * 0.25 ? 'var(--red)' : timeRemaining < totalTime * 0.5 ? '#a16207' : 'var(--green)',
            borderRadius: 12,
            padding: '8px 16px',
            fontWeight: 800,
            fontSize: '1.2rem',
            minWidth: 60,
            textAlign: 'center'
          }}>
            {timerExpired ? '⏰' : Math.ceil(timeRemaining) + 's'}
          </div>
        </div>

        {/* Question text */}
        <p className="question-text" style={{ marginBottom: 24, lineHeight: 1.5 }}>
          {q.text}
        </p>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-number">{answeredCount}</div>
            <div className="stat-label">Answered</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalPlayers - answeredCount}</div>
            <div className="stat-label">Waiting</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="text-muted fs-sm">{answeredCount}/{totalPlayers} players answered</span>
            <span className="text-muted fs-sm">{totalPlayers > 0 ? Math.round((answeredCount / totalPlayers) * 100) : 0}%</span>
          </div>
          <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${totalPlayers > 0 ? (answeredCount / totalPlayers) * 100 : 0}%`,
              background: 'var(--teal)',
              borderRadius: 4,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Answer distribution (if anyone answered) */}
        {answeredCount > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              Answer Distribution
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(distribution).map(([letter, count]) => (
                <div key={letter} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: letter === q.correct ? 'var(--green)' : OPTION_COLORS[letter],
                    color: 'white', fontWeight: 700, fontSize: '0.8rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>{letter}</span>
                  <div style={{ flex: 1, height: 22, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${answeredCount > 0 ? (count / answeredCount) * 100 : 0}%`,
                      background: letter === q.correct ? 'var(--green)' : OPTION_COLORS[letter],
                      borderRadius: 4,
                      transition: 'width 0.3s ease',
                      opacity: 0.85
                    }} />
                  </div>
                  <span style={{ width: 24, textAlign: 'right', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                    {count}
                  </span>
                  {letter === q.correct && <span style={{ fontSize: '0.75rem', color: 'var(--green)', fontWeight: 700 }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="divider" />

        {/* Action button */}
        {isLastQuestion ? (
          <button
            className="btn btn-orange"
            onClick={onShowLeaderboard}
            disabled={!canAdvance}
            style={{ fontSize: '1rem' }}
          >
            🏆 Show Leaderboard
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={onNextQuestion}
            disabled={!canAdvance}
            style={{ fontSize: '1rem' }}
          >
            Next Question →
          </button>
        )}

        {!canAdvance && (
          <p className="text-muted text-center mt-12 fs-sm">
            {timerExpired ? 'Loading...' : 'Waiting for at least 1 answer or timer to run out'}
          </p>
        )}
      </div>
    </div>
  )
}
