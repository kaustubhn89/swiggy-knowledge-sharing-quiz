import { motion, AnimatePresence } from 'framer-motion'
import { T, AVATAR_COLORS, tint } from '../brand'

export default function WaitingRoom({ playerName, players }) {
  const playerList = Object.values(players)

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      backgroundImage: 'radial-gradient(rgba(28,74,87,0.07) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 20
    }}>
      {/* Pulsing center avatar */}
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 20px' }}>
          {[1, 2, 3].map(i => (
            <motion.div key={i}
              animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                border: `2px solid ${T.teal}`
              }}
            />
          ))}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: T.gradPrimary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.2rem', fontWeight: 900, color: '#fff',
            boxShadow: `0 0 30px ${tint(T.teal, 0.45)}`
          }}>
            {playerName.charAt(0).toUpperCase()}
          </div>
        </div>
        <h2 style={{ color: T.ink, fontSize: '1.4rem', fontWeight: 800, marginBottom: 6 }}>
          You're in, <span style={{ color: T.teal }}>{playerName}</span>!
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: T.ink3, fontSize: '0.95rem' }}>
          <span>Waiting for host</span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {[0,1,2].map(i => (
              <motion.span key={i}
                animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: T.teal }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Player list card */}
      <div style={{
        background: T.card,
        borderRadius: 20, padding: '20px 24px',
        width: '100%', maxWidth: 480,
        border: `1.5px solid ${T.line}`,
        boxShadow: T.shadowCard
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ color: T.ink3, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>
            Players Joined
          </span>
          <motion.span
            key={playerList.length}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            style={{
              background: tint(T.teal, 0.12),
              color: T.teal, padding: '4px 12px',
              borderRadius: 20, fontSize: '0.85rem', fontWeight: 800
            }}
          >
            {playerList.length} {playerList.length === 1 ? 'player' : 'players'}
          </motion.span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
          <AnimatePresence>
            {playerList.map((p, i) => {
              const isMe = p.name === playerName
              return (
                <motion.div key={p.name}
                  initial={{ opacity: 0, x: -16, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 12,
                    background: isMe ? tint(T.teal, 0.08) : T.fill,
                    border: isMe ? `1px solid ${tint(T.teal, 0.25)}` : `1px solid ${T.line}`
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 800, color: '#fff', flexShrink: 0
                  }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: T.ink, fontWeight: 600, fontSize: '0.95rem' }}>
                    {p.name}
                    {isMe && <span style={{ color: T.teal, fontSize: '0.75rem', marginLeft: 6 }}>(you)</span>}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {playerList.length === 0 && (
            <p style={{ color: T.ink4, textAlign: 'center', padding: '16px 0', fontSize: '0.9rem' }}>
              No other players yet...
            </p>
          )}
        </div>
      </div>

      <p style={{ color: T.ink3, fontSize: '0.8rem', marginTop: 24, fontWeight: 500 }}>
        Get ready — the quiz starts soon
      </p>
    </div>
  )
}
