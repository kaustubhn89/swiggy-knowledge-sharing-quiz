import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '../questions'

function useCountUp(target, duration = 1200) {
  const countRef = useRef(null)
  const [count, setCount] = [0, () => {}]
  return target // simplified - use motion animate number
}

const PODIUM_CONFIG = [
  { rank: 2, height: 80, color: '#C0C0C0', medal: '🥈', label: '2nd', delay: 0.3 },
  { rank: 1, height: 120, color: '#FFD700', medal: '🥇', label: '1st', delay: 0.1 },
  { rank: 3, height: 60, color: '#CD7F32', medal: '🥉', label: '3rd', delay: 0.5 },
]

function getInitial(name) { return (name || '?').charAt(0).toUpperCase() }

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  show: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.07, type: 'spring', stiffness: 260, damping: 24 } })
}

export default function Leaderboard({ players, isAdmin, onPlayAgain, onSaveSession, sessionSaved, playerId }) {
  const confettiFired = useRef(false)

  const sorted = Object.entries(players)
    .map(([id, p]) => ({
      id, name: p.name,
      totalScore: p.totalScore || 0,
      correctCount: Object.values(p.answers || {}).filter(a => a.score === 3).length
    }))
    .sort((a, b) => b.totalScore - a.totalScore || b.correctCount - a.correctCount)

  useEffect(() => {
    if (confettiFired.current) return
    confettiFired.current = true
    import('canvas-confetti').then(({ default: confetti }) => {
      const fire = (opts) => confetti({ ...opts, colors: ['#FC8019','#FFD700','#48BB78','#367588','#7B5EA7'] })
      fire({ particleCount: 100, spread: 70, origin: { y: 0.65 } })
      setTimeout(() => fire({ particleCount: 80, spread: 100, origin: { x: 0.1, y: 0.6 } }), 400)
      setTimeout(() => fire({ particleCount: 80, spread: 100, origin: { x: 0.9, y: 0.6 } }), 700)
    })
  }, [])

  const podiumPlayers = PODIUM_CONFIG.map(cfg => ({
    ...cfg,
    player: sorted.find((_, i) => i + 1 === cfg.rank) || null
  })).filter(cfg => cfg.player)

  return (
    <div style={{
      minHeight: '100vh', background: '#1A1A2A',
      backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
      backgroundSize: '24px 24px'
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 8 }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '3rem', marginBottom: 12 }}
          >
            🏆
          </motion.div>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #FFD700, #FC8019)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', marginBottom: 6
          }}>
            Final Results
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>
            {sorted.length} players · Swiggy KS Quiz
          </p>
        </motion.div>

        {/* Podium */}
        {sorted.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, margin: '40px 0 32px' }}>
            {podiumPlayers.map(({ rank, height, color, medal, delay, player }) => (
              <div key={rank} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 18, delay }}
                  style={{
                    width: rank === 1 ? 64 : 52, height: rank === 1 ? 64 : 52,
                    borderRadius: '50%',
                    background: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: rank === 1 ? '1.5rem' : '1.2rem',
                    fontWeight: 900, color: '#1A1A2A',
                    boxShadow: `0 0 24px ${color}60`
                  }}
                >
                  {getInitial(player.name)}
                </motion.div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    color: '#fff', fontSize: rank === 1 ? '0.9rem' : '0.8rem',
                    fontWeight: 700, maxWidth: 80, overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {player.name}
                  </div>
                  <div style={{ color: color, fontSize: '0.8rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                    {player.totalScore.toLocaleString()}
                  </div>
                </div>

                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: delay + 0.2, duration: 0.5, ease: 'backOut' }}
                  style={{
                    width: rank === 1 ? 88 : 72, height,
                    background: `linear-gradient(180deg, ${color}30, ${color}15)`,
                    borderRadius: '10px 10px 0 0',
                    border: `1.5px solid ${color}40`,
                    borderBottom: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: rank === 1 ? '2rem' : '1.5rem',
                    transformOrigin: 'bottom'
                  }}
                >
                  {medal}
                </motion.div>
              </div>
            ))}
          </div>
        )}

        {/* Rankings table */}
        <div style={{
          background: '#252535',
          borderRadius: 20, overflow: 'hidden',
          border: '1.5px solid rgba(255,255,255,0.06)',
          marginBottom: 20
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '44px 1fr 90px 72px',
            padding: '12px 20px',
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            {['Rank', 'Player', 'Score', 'Correct'].map(h => (
              <span key={h} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <AnimatePresence>
            {sorted.map((player, index) => {
              const rank = index + 1
              const isMe = player.id === playerId
              const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']
              const rankColor = rankColors[rank - 1] || 'rgba(255,255,255,0.25)'
              const rankLabels = ['🥇', '🥈', '🥉']

              return (
                <motion.div
                  key={player.id}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="show"
                  style={{
                    display: 'grid', gridTemplateColumns: '44px 1fr 90px 72px',
                    padding: '13px 20px', alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: isMe ? 'rgba(252,128,25,0.06)' : 'transparent',
                    borderLeft: rank <= 3 ? `3px solid ${rankColor}` : '3px solid transparent'
                  }}
                >
                  {/* Rank */}
                  <span style={{
                    fontWeight: 800, fontSize: rank <= 3 ? '1.1rem' : '0.9rem',
                    color: rankColor
                  }}>
                    {rank <= 3 ? rankLabels[rank - 1] : `#${rank}`}
                  </span>

                  {/* Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: isMe ? 'linear-gradient(135deg, #FC8019, #E35D34)' : `hsl(${(index * 47) % 360}, 55%, 50%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 800, color: '#fff'
                    }}>
                      {getInitial(player.name)}
                    </div>
                    <span style={{ color: '#fff', fontWeight: isMe ? 700 : 500, fontSize: '0.9rem' }}>
                      {player.name}
                      {isMe && <span style={{ color: '#FC8019', fontSize: '0.7rem', marginLeft: 5 }}>(you)</span>}
                    </span>
                  </div>

                  {/* Score */}
                  <span style={{
                    color: rank <= 3 ? rankColor : '#fff',
                    fontWeight: 800, fontSize: '1rem',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {player.totalScore.toLocaleString()}
                  </span>

                  {/* Correct count */}
                  <span style={{ color: 'rgba(72,187,120,0.7)', fontWeight: 700, fontSize: '0.85rem' }}>
                    {player.correctCount}/{questions.length}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {sorted.length === 0 && (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No players yet</div>
          )}
        </div>

        {/* Admin actions */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {onSaveSession && !sessionSaved && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onSaveSession}
                style={{
                  width: '100%', padding: '16px',
                  borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, #FC8019, #E35D34)',
                  color: '#fff', fontSize: '1rem', fontWeight: 700,
                  fontFamily: 'inherit', cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(252,128,25,0.3)'
                }}
              >
                💾 Save Results
              </motion.button>
            )}
            {sessionSaved && (
              <div style={{
                padding: '14px', borderRadius: 14, textAlign: 'center',
                background: 'rgba(72,187,120,0.1)', border: '1px solid rgba(72,187,120,0.25)',
                color: '#48BB78', fontWeight: 700, fontSize: '0.9rem'
              }}>
                ✓ Session Saved
              </div>
            )}
            <button
              onClick={onPlayAgain}
              style={{
                width: '100%', padding: '14px',
                borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.1)',
                background: 'transparent', color: 'rgba(255,255,255,0.45)',
                fontSize: '0.9rem', fontWeight: 600,
                fontFamily: 'inherit', cursor: 'pointer'
              }}
            >
              ← Back to Sessions
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
