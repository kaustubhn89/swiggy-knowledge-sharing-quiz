import { useState } from 'react'

export default function PlayerJoin({ onJoin, onBack }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setLoading(true)
    await onJoin(trimmed)
    setLoading(false)
  }

  return (
    <div className="screen landing-bg">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>👋</div>
          <h2>What's your name?</h2>
          <p className="text-muted mt-8">This will appear on the leaderboard</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            className="input"
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={24}
            autoFocus
            disabled={loading}
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!name.trim() || loading}
          >
            {loading ? 'Joining...' : 'Join Game →'}
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={onBack}
            disabled={loading}
          >
            ← Back
          </button>
        </form>
      </div>
    </div>
  )
}
