export default function WaitingRoom({ playerName, players }) {
  const playerList = Object.values(players)

  return (
    <div className="screen" style={{ background: 'var(--off-white)' }}>
      <div className="card" style={{ maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>⏳</div>
          <h2 style={{ color: 'var(--dark-teal)' }}>Waiting for host to start...</h2>
          <p className="text-muted mt-8">
            You're in! <span className="pulse">●</span> Game starts when the admin is ready
          </p>
        </div>

        <div style={{
          background: 'var(--teal)',
          borderRadius: 14,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--white)',
          marginBottom: 20
        }}>
          <span style={{ fontWeight: 600 }}>👤 Logged in as: <strong>{playerName}</strong></span>
          <span style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: '0.85rem',
            fontWeight: 700
          }}>
            {playerList.length} player{playerList.length !== 1 ? 's' : ''}
          </span>
        </div>

        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
          Players Joined
        </h3>

        <div className="player-list">
          {playerList.map((p, i) => (
            <div key={i} className="player-item">
              <div className="player-avatar"
                style={{ background: p.name === playerName ? 'var(--orange)' : 'var(--teal)' }}
              >
                {p.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontWeight: p.name === playerName ? 700 : 500 }}>
                {p.name}
                {p.name === playerName && <span style={{ color: 'var(--teal)', fontSize: '0.8rem', marginLeft: 6 }}>(you)</span>}
              </span>
            </div>
          ))}

          {playerList.length === 0 && (
            <p className="text-muted text-center" style={{ padding: '20px 0' }}>
              No players yet...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
