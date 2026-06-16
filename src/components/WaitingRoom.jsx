import { motion, AnimatePresence } from 'framer-motion'

const AVATAR_COLORS = ['#FC8019','#367588','#7B5EA7','#48BB78','#1C4A57','#E35D34','#F56565','#4299e1']

export default function WaitingRoom({ playerName, players }) {
  const playerList = Object.values(players)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1A1A2A',
      backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
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
                border: '2px solid #FC8019'
              }}
            />
          ))}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'linear-gradient(135deg, #FC8019, #E35D34)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.2rem', fontWeight: 900, color: '#fff',
            boxShadow: '0 0 30px rgba(252,128,25,0.5)'
          }}>
            {playerName.charAt(0).toUpperCase()}
          </div>
        </div>
        <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: 6 }}>
          You're in, <span style={{ color: '#FC8019' }}>{playerName}</span>!
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
          <span>Waiting for host</span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {[0,1,2].map(i => (
              <motion.span key={i}
                animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#FC8019' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Player list card */}
      <div style={{
        background: '#252535',
        borderRadius: 20, padding: '20px 24px',
        width: '100%', maxWidth: 480,
        border: '1.5px solid rgba(255,255,255,0.06)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>
            Players Joined
          </span>
          <motion.span
            key={playerList.length}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            style={{
              background: 'rgba(252,128,25,0.15)',
              color: '#FC8019', padding: '4px 12px',
              borderRadius: 20, fontSize: '0.85rem', fontWeight: 800
            }}
          >
            {playerList.length} {playerList.length === 1 ? 'player' : 'players'}
          </motion.span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
          <AnimatePresence>
            {playerList.map((p, i) => (
              <motion.div key={p.name}
                initial={{ opacity: 0, x: -16, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 12,
                  background: p.name === playerName ? 'rgba(252,128,25,0.1)' : 'rgba(255,255,255,0.04)',
                  border: p.name === playerName ? '1px solid rgba(252,128,25,0.25)' : '1px solid rgba(255,255,255,0.05)'
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
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                  {p.name}
                  {p.name === playerName && <span style={{ color: '#FC8019', fontSize: '0.75rem', marginLeft: 6 }}>(you)</span>}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {playerList.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '16px 0', fontSize: '0.9rem' }}>
              No other players yet...
            </p>
          )}
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', marginTop: 24, fontWeight: 500 }}>
        Get ready — the quiz starts soon
      </p>
    </div>
  )
}
