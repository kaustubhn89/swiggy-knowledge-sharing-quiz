export default function Landing({ onJoinAsPlayer, onAdminLogin }) {
  return (
    <div className="landing-bg screen">
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="landing-logo" style={{ margin: '0 auto 24px' }}>🧠</div>
        <h1 className="landing-title" style={{ color: 'var(--dark-teal)', marginBottom: 6 }}>
          Swiggy Knowledge
        </h1>
        <h1 className="landing-title" style={{ color: 'var(--orange)', marginBottom: 8 }}>
          Sharing Quiz
        </h1>
        <p className="text-muted" style={{ marginBottom: 36 }}>
          Powered by Growisto · 8 Questions · Real-time
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn btn-primary" onClick={onJoinAsPlayer}>
            <span>🎮</span> Join as Player
          </button>
          <button className="btn btn-ghost" onClick={onAdminLogin}>
            🔐 Admin Login
          </button>
        </div>
      </div>
    </div>
  )
}
