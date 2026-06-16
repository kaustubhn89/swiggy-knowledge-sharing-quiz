import { useState } from 'react'

export default function AdminLogin({ onLogin, onBack }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    const ok = onLogin(password)
    if (!ok) {
      setError(true)
      setLoading(false)
      setPassword('')
    }
  }

  return (
    <div className="screen landing-bg">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔐</div>
          <h2>Admin Login</h2>
          <p className="text-muted mt-8">Enter the admin password to control the quiz</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            className="input"
            type="password"
            placeholder="Admin password..."
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            autoFocus
            style={{ borderColor: error ? 'var(--red)' : undefined }}
          />
          {error && (
            <p style={{ color: 'var(--red)', fontSize: '0.875rem', textAlign: 'center' }}>
              ✗ Incorrect password. Try again.
            </p>
          )}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!password || loading}
          >
            {loading ? 'Verifying...' : 'Login →'}
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={onBack}
          >
            ← Back
          </button>
        </form>
      </div>
    </div>
  )
}
