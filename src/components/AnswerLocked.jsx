import { questions } from '../questions'

const OPTION_COLORS = {
  A: 'var(--teal)',
  B: 'var(--dark-teal)',
  C: 'var(--orange)',
  D: 'var(--purple)'
}

export default function AnswerLocked({ answer, currentQuestion, showResult }) {
  const q = questions[currentQuestion]

  return (
    <div className="screen" style={{ background: 'var(--off-white)' }}>
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="lock-icon">✅</div>
        <h2 style={{ color: 'var(--dark-teal)' }}>Answer Locked In!</h2>

        {answer ? (
          <>
            <p className="text-muted mt-8">You selected:</p>
            <div
              className="answer-display"
              style={{
                background: showResult
                  ? (answer === q.correct ? 'var(--green)' : 'var(--red)')
                  : OPTION_COLORS[answer],
                margin: '16px auto',
              }}
            >
              <span style={{
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 8,
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700,
                flexShrink: 0
              }}>{answer}</span>
              <span>{q.options[answer]}</span>
              {showResult && (
                <span style={{ marginLeft: 4 }}>
                  {answer === q.correct ? '✓' : '✗'}
                </span>
              )}
            </div>
            {showResult && answer !== q.correct && (
              <p className="text-muted fs-sm">
                Correct: <strong style={{ color: 'var(--green)' }}>{q.correct} – {q.options[q.correct]}</strong>
              </p>
            )}
          </>
        ) : (
          <p className="text-muted mt-8">You didn't answer in time</p>
        )}

        <div style={{
          marginTop: 28,
          padding: '14px 16px',
          background: 'var(--off-white)',
          borderRadius: 12,
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}>
          <span className="pulse">●</span>
          Waiting for next question...
        </div>
      </div>
    </div>
  )
}
