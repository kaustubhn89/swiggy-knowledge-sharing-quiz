import { motion, AnimatePresence } from 'framer-motion'
import { T, AVATAR_COLORS, tint } from '../brand'
import { FunnelStrip, Footer } from './ui'

export default function WaitingRoom({ playerName, players }) {
  const playerList = Object.values(players)

  return (
    <div style={{
      minHeight: '100vh', background: T.bg, backgroundImage: T.dots, backgroundSize: '26px 26px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      {/* Pulsing avatar */}
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 96, height: 96, margin: '0 auto 18px' }}>
          {[1, 2, 3].map(i => (
            <motion.div key={i}
              animate={{ scale: [1, 1.6, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${T.primary}` }}
            />
          ))}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: T.gradPrimary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.1rem', fontWeight: 800, color: T.onAccent,
            boxShadow: `0 0 30px ${tint(T.primary, 0.45)}`
          }}>
            {playerName.charAt(0).toUpperCase()}
          </div>
        </div>
        <h2 style={{ color: T.text, fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>
          You're in, <span style={{ color: T.primary }}>{playerName}</span>!
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: T.text3, fontSize: '0.95rem' }}>
          <span>Waiting for host</span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {[0, 1, 2].map(i => (
              <motion.span key={i}
                animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: T.primary }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Players list */}
      <div style={{
        background: T.panel, borderRadius: 20, padding: '18px 20px',
        width: '100%', maxWidth: 480,
        border: `1px solid ${T.line}`, boxShadow: T.shadowCard
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ color: T.text3, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Players Joined
          </span>
          <motion.span
            key={playerList.length}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            style={{ background: tint(T.primary, 0.16), color: T.primary, padding: '4px 12px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 700 }}
          >
            {playerList.length} {playerList.length === 1 ? 'player' : 'players'}
          </motion.span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 260, overflowY: 'auto' }}>
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
                    padding: '9px 12px', borderRadius: 12,
                    background: isMe ? tint(T.primary, 0.12) : T.fill,
                    border: `1px solid ${isMe ? tint(T.primary, 0.35) : T.line}`
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 700, color: T.onAccent
                  }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: T.text, fontWeight: 500, fontSize: '0.95rem' }}>
                    {p.name}
                    {isMe && <span style={{ color: T.primary, fontSize: '0.75rem', marginLeft: 6 }}>(you)</span>}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {playerList.length === 0 && (
            <p style={{ color: T.text3, textAlign: 'center', padding: '14px 0', fontSize: '0.9rem' }}>
              No other players yet...
            </p>
          )}
        </div>
      </div>

      <FunnelStrip style={{ marginTop: 26 }} />
      <Footer style={{ marginTop: 18 }} />
    </div>
  )
}
