import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '../questions'
import { T, APP_NAME, AVATAR_COLORS, tint } from '../brand'
import { Logo, Footer } from './ui'

const PODIUM_CONFIG = [
  { rank: 2, height: 84,  color: T.silver, medal: '🥈', delay: 0.3 },
  { rank: 1, height: 124, color: T.gold,   medal: '🥇', delay: 0.1 },
  { rank: 3, height: 64,  color: T.bronze, medal: '🥉', delay: 0.5 },
]
const RANK_COLORS = [T.gold, T.silver, T.bronze]
const RANK_LABELS = ['🥇', '🥈', '🥉']

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
      totalScore:   p.totalScore || 0,
      correctCount: Object.values(p.answers || {}).filter(a => a.score > 0).length
    }))
    .sort((a, b) => b.totalScore - a.totalScore || b.correctCount - a.correctCount)

  useEffect(() => {
    if (confettiFired.current) return
    confettiFired.current = true
    import('canvas-confetti').then(({ default: confetti }) => {
      const fire = (opts) => confetti({ ...opts, colors: [T.primary, T.secondary, T.purple, T.blue, T.gold] })
      fire({ particleCount: 100, spread: 70, origin: { y: 0.65 } })
      setTimeout(() => fire({ particleCount: 80, spread: 100, origin: { x: 0.1, y: 0.6 } }), 400)
      setTimeout(() => fire({ particleCount: 80, spread: 100, origin: { x: 0.9, y: 0.6 } }), 700)
    })
  }, [])

  const podiumPlayers = PODIUM_CONFIG
    .map(cfg => ({ ...cfg, player: sorted[cfg.rank - 1] || null }))
    .filter(cfg => cfg.player)

  return (
    <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.dots, backgroundSize: '26px 26px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '26px 18px 30px' }}>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><Logo size={34} /></div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 8 }}>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '2.8rem', marginBottom: 8 }}
          >
            🏆
          </motion.div>
          <h1 style={{
            fontSize: 'clamp(1.7rem, 5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em',
            background: `linear-gradient(135deg, ${T.gold}, ${T.primary})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: 4
          }}>
            Final Results
          </h1>
          <p style={{ color: T.text3, fontSize: '0.9rem' }}>{sorted.length} players · {APP_NAME}</p>
        </motion.div>

        {/* Podium */}
        {sorted.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, margin: '34px 0 28px' }}>
            {podiumPlayers.map(({ rank, height, color, medal, delay, player }) => (
              <div key={rank} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 18, delay }}
                  style={{
                    width: rank === 1 ? 64 : 52, height: rank === 1 ? 64 : 52, borderRadius: '50%',
                    background: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: rank === 1 ? '1.5rem' : '1.2rem', fontWeight: 800, color: T.onAccent,
                    boxShadow: `0 0 24px ${color}66`
                  }}
                >
                  {getInitial(player.name)}
                </motion.div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    color: T.text, fontSize: rank === 1 ? '0.92rem' : '0.82rem', fontWeight: 600,
                    maxWidth: 96, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {player.name}
                  </div>
                  <div style={{ color, fontSize: '0.85rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {player.totalScore.toLocaleString()}
                  </div>
                </div>
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: delay + 0.2, duration: 0.5, ease: 'backOut' }}
                  style={{
                    width: rank === 1 ? 92 : 76, height,
                    background: `linear-gradient(180deg, ${tint(color, 0.28)}, ${tint(color, 0.10)})`,
                    borderRadius: '10px 10px 0 0', border: `1.5px solid ${tint(color, 0.45)}`, borderBottom: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: rank === 1 ? '2rem' : '1.5rem', transformOrigin: 'bottom'
                  }}
                >
                  {medal}
                </motion.div>
              </div>
            ))}
          </div>
        )}

        {/* Rankings table */}
        <div style={{ background: T.panel, borderRadius: 20, overflow: 'hidden', border: `1px solid ${T.line}`, boxShadow: T.shadowCard, marginBottom: 18 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '46px 1fr 74px 70px',
            padding: '12px 18px', background: T.fill, borderBottom: `1px solid ${T.line}`
          }}>
            {['Rank', 'Player', 'Score', 'Correct'].map(h => (
              <span key={h} style={{ color: T.text3, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>
            ))}
          </div>

          <AnimatePresence>
            {sorted.map((player, index) => {
              const rank      = index + 1
              const isMe      = player.id === playerId
              const rankColor = RANK_COLORS[rank - 1] || T.text3
              return (
                <motion.div
                  key={player.id}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="show"
                  style={{
                    display: 'grid', gridTemplateColumns: '46px 1fr 74px 70px',
                    padding: '12px 18px', alignItems: 'center',
                    borderBottom: `1px solid ${T.line}`,
                    background: isMe ? tint(T.primary, 0.10) : 'transparent',
                    borderLeft: `3px solid ${rank <= 3 ? rankColor : 'transparent'}`
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: rank <= 3 ? '1.1rem' : '0.9rem', color: rankColor }}>
                    {rank <= 3 ? RANK_LABELS[rank - 1] : `#${rank}`}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: isMe ? T.gradPrimary : AVATAR_COLORS[index % AVATAR_COLORS.length],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 700, color: T.onAccent
                    }}>
                      {getInitial(player.name)}
                    </div>
                    <span style={{ color: T.text, fontWeight: isMe ? 700 : 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {player.name}
                      {isMe && <span style={{ color: T.primary, fontSize: '0.72rem', marginLeft: 5 }}>(you)</span>}
                    </span>
                  </div>
                  <span style={{ color: rank <= 3 ? rankColor : T.text, fontWeight: 700, fontSize: '1rem', fontVariantNumeric: 'tabular-nums' }}>
                    {player.totalScore.toLocaleString()}
                  </span>
                  <span style={{ color: T.correct, fontWeight: 600, fontSize: '0.85rem' }}>
                    {player.correctCount}/{questions.length}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {sorted.length === 0 && (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: T.text3 }}>No players yet</div>
          )}
        </div>

        {/* Host actions */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}
          >
            {onSaveSession && !sessionSaved && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onSaveSession}
                style={{
                  width: '100%', padding: '16px', borderRadius: 14, border: 'none',
                  background: T.gradPrimary, color: T.onAccent,
                  fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
                  boxShadow: T.shadowBtn
                }}
              >
                💾 Save Results
              </motion.button>
            )}
            {sessionSaved && (
              <div style={{
                padding: '14px', borderRadius: 14, textAlign: 'center',
                background: tint(T.correct, 0.12), border: `1px solid ${tint(T.correct, 0.3)}`,
                color: T.correct, fontWeight: 600, fontSize: '0.9rem'
              }}>
                ✓ Session Saved
              </div>
            )}
            <button
              onClick={onPlayAgain}
              style={{
                width: '100%', padding: '14px', borderRadius: 14,
                border: `1.5px solid ${T.line2}`, background: 'transparent', color: T.text3,
                fontSize: '0.9rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
              }}
            >
              ← Back to Sessions
            </button>
          </motion.div>
        )}

        <Footer />
      </div>
    </div>
  )
}
