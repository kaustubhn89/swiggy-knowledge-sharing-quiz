import { useEffect } from 'react'
import confetti from 'canvas-confetti'

function getInitial(name) {
  return (name || '?').charAt(0).toUpperCase()
}

function getRankStyle(rank) {
  if (rank === 1) return { background: '#fef9c3', color: '#a16207' }
  if (rank === 2) return { background: '#f1f5f9', color: '#475569' }
  if (rank === 3) return { background: '#fff7ed', color: '#9a3412' }
  return { background: 'transparent', color: 'var(--text-muted)' }
}

export default function Leaderboard({ players, isAdmin, onPlayAgain, playerId }) {
  const sorted = Object.entries(players)
    .map(([id, p]) => ({
      id,
      name: p.name,
      totalScore: p.totalScore || 0,
      speedBonus: Object.values(p.answers || {}).reduce((s, a) => s + (a.speedBonus || 0), 0)
    }))
    .sort((a, b) => b.totalScore - a.totalScore || b.speedBonus - a.speedBonus)

  const top3 = sorted.slice(0, 3)
  const podiumOrder = top3.length >= 2
    ? [top3[1], top3[0], top3[2]].filter(Boolean)
    : top3

  useEffect(() => {
    const launch = () => {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#367588', '#E35D34', '#B8DBD9', '#7B5EA7', '#f59e0b'] })
    }
    launch()
    const t = setTimeout(launch, 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="screen-top" style={{ background: 'var(--off-white)', gap: 0 }}>
      <div className="card-wide" style={{ marginTop: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏆</div>
          <h2 style={{ color: 'var(--dark-teal)' }}>Final Leaderboard</h2>
          <p className="text-muted mt-8">Swiggy KS Quiz · {sorted.length} players</p>
        </div>

        {/* Podium */}
        {sorted.length > 0 && (
          <div className="podium">
            {podiumOrder.map((player, i) => {
              const realRank = sorted.findIndex(p => p.id === player.id) + 1
              const classes = ['podium-2', 'podium-1', 'podium-3']
              const medals = ['🥈', '🥇', '🥉']
              const cls = classes[i] || 'podium-2'
              const medal = medals[i] || ''

              return (
                <div key={player.id} className={`podium-slot ${cls}`}>
                  <div className="podium-avatar">
                    {getInitial(player.name)}
                  </div>
                  <div className="podium-name" title={player.name}>{player.name}</div>
                  <div className="podium-score">{player.totalScore.toLocaleString()} pts</div>
                  <div className="podium-block">{medal}</div>
                </div>
              )
            })}
          </div>
        )}

        <div className="divider" />

        {/* Full table */}
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
              <th>Speed Rank</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((player, index) => {
              const rank = index + 1
              const speedRank = [...sorted].sort((a, b) => b.speedBonus - a.speedBonus).findIndex(p => p.id === player.id) + 1
              const isMe = player.id === playerId
              const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null

              return (
                <tr key={player.id} className={isMe ? 'my-row' : ''}>
                  <td>
                    <span className="rank-badge" style={getRankStyle(rank)}>
                      {medalEmoji || `#${rank}`}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="player-avatar" style={{ width: 28, height: 28, fontSize: '0.75rem', background: isMe ? 'var(--orange)' : 'var(--teal)' }}>
                        {getInitial(player.name)}
                      </div>
                      <span style={{ fontWeight: isMe ? 700 : 500 }}>
                        {player.name}{isMe && <span style={{ color: 'var(--teal)', fontSize: '0.75rem', marginLeft: 4 }}>(you)</span>}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--dark-teal)' }}>
                    {player.totalScore.toLocaleString()}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>#{speedRank}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {isAdmin && (
          <div style={{ marginTop: 24 }}>
            <button className="btn btn-orange" onClick={onPlayAgain}>
              🔄 Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
