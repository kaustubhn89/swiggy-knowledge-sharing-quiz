import { useState, useEffect, useRef } from 'react'
import { questions } from '../questions'

const OPTION_COLORS = {
  A: 'var(--teal)',
  B: 'var(--dark-teal)',
  C: 'var(--orange)',
  D: 'var(--purple)'
}

function CircularTimer({ totalTime, timeRemaining }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const progress = totalTime > 0 ? timeRemaining / totalTime : 0
  const dashoffset = circumference * (1 - progress)

  let color = 'var(--teal)'
  if (progress < 0.5) color = 'var(--orange)'
  if (progress < 0.25) color = '#ef4444'

  return (
    <div className="timer-wrap">
      <svg viewBox="0 0 100 100" width="88" height="88">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--powder-blue)" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.25s linear, stroke 0.3s' }}
        />
        <text x="50" y="57" textAnchor="middle" fontSize="26" fontWeight="800" fill={color} fontFamily="Inter, sans-serif">
          {Math.ceil(Math.max(0, timeRemaining))}
        </text>
      </svg>
    </div>
  )
}

export default function QuestionScreen({ gameState, onAnswer, answerLocked }) {
  const q = questions[gameState.currentQuestion]
  const totalTimeMs = q.time * 1000
  const [timeRemaining, setTimeRemaining] = useState(totalTimeMs / 1000)
  const [selected, setSelected] = useState(null)
  const lockedRef = useRef(false)

  useEffect(() => {
    lockedRef.current = false
    setSelected(null)

    const tick = () => {
      const elapsed = Date.now() - gameState.questionStartTime
      const remaining = Math.max(0, (totalTimeMs - elapsed) / 1000)
      setTimeRemaining(remaining)
    }

    tick()
    const interval = setInterval(tick, 100)
    return () => clearInterval(interval)
  }, [gameState.currentQuestion, gameState.questionStartTime, totalTimeMs])

  const handleSelect = (letter) => {
    if (selected || answerLocked || lockedRef.current) return
    lockedRef.current = true
    setSelected(letter)
    onAnswer(letter, timeRemaining)
  }

  return (
    <div className="screen" style={{ background: 'var(--off-white)', padding: '16px' }}>
      <div className="card-wide">
        <div className="question-header">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="question-number">
              Q{gameState.currentQuestion + 1}/{questions.length}
            </span>
            <span className={`badge badge-${q.difficulty.toLowerCase()}`}>
              {q.difficulty}
            </span>
          </div>
          <CircularTimer totalTime={q.time} timeRemaining={timeRemaining} />
        </div>

        <p className="question-text" style={{ marginBottom: 8 }}>
          {q.text}
        </p>

        <div className="answer-grid">
          {Object.entries(q.options).map(([letter, text]) => (
            <button
              key={letter}
              className={`answer-btn${selected === letter ? ' selected' : ''}`}
              style={{ background: OPTION_COLORS[letter], opacity: selected && selected !== letter ? 0.55 : 1 }}
              onClick={() => handleSelect(letter)}
              disabled={!!selected || answerLocked || timeRemaining <= 0}
            >
              <span className="answer-label">{letter}</span>
              <span>{text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
