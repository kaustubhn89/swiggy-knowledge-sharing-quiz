export default function AdminLobby({ players, onStartGame }) {
  const playerList = Object.values(players)

  return (
    <div className="screen" style={{ background: 'var(--off-white)' }}>
      <div className="card" style={{ maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>🎛️</div>
          <h2 style={{ color: 'var(--dark-teal)' }}>Admin Lobby</h2>
          <p className="text-muted mt-8">
            Waiting for players to join. Start when everyone's in.
          </p>
        </div>

        <div style={{
          background: 'var(--teal)',
          borderRadius: 14,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--white)',
          marginBottom: 20
        }}>
          <span style={{ fontWeight: 600 }}>Players joined</span>
          <span style={{
            background: 'rgba(255,255,255,0.25)',
            borderRadius: 20,
            padding: '6px 16px',
            fontWeight: 800,
            fontSize: '1.3rem'
          }}>
            {playerList.length}
          </span>
        </div>

        <div className="player-list" style={{ marginBottom: 24 }}>
          {playerList.map((p, i) => (
            <div key={i} className="player-item">
              <div className="player-avatar">{p.name.charAt(0).toUpperCase()}</div>
              <span>{p.name}</span>
            </div>
          ))}
          {playerList.length === 0 && (
            <p className="text-muted text-center" style={{ padding: '16px 0' }}>
              <span className="pulse">●</span> Waiting for players...
            </p>
          )}
        </div>

        <button
          className="btn btn-orange"
          onClick={onStartGame}
          disabled={playerList.length === 0}
          style={{ fontSize: '1.05rem', padding: '16px' }}
        >
          🚀 Start Game ({playerList.length} player{playerList.length !== 1 ? 's' : ''})
        </button>

        {playerList.length === 0 && (
          <p className="text-muted text-center mt-12 fs-sm">
            Need at least 1 player to start
          </p>
        )}
      </div>
    </div>
  )
}
