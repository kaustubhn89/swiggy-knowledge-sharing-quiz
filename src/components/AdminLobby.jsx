import { motion, AnimatePresence } from 'framer-motion'
import { T, AVATAR_COLORS, tint } from '../brand'

export default function AdminLobby({ players, onStartGame, sessionName, onBackToSessions }) {
  const playerList = Object.values(players)
  const canStart   = playerList.length > 0

  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      backgroundImage: 'radial-gradient(rgba(28,74,87,0.07) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 500 }}
      >
        {/* Back + Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <button
            onClick={onBackToSessions}
            style={{
              background: 'none', border: 'none', color: T.ink3,
              fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
              cursor: 'pointer', marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 5
            }}
          >
            ← Sessions
          </button>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎛️</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: T.ink, marginBottom: 4 }}>Lobby</h2>
          {sessionName && (
            <div style={{ color: T.teal, fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>{sessionName}</div>
          )}
          <p style={{ color: T.ink3, fontSize: '0.9rem' }}>
            Share the quiz URL and wait for players to join
          </p>
        </div>

        {/* Player count banner */}
        <div style={{
          background: `linear-gradient(135deg, ${tint(T.teal, 0.12)}, ${tint(T.tealDark, 0.07)})`,
          border: `1.5px solid ${tint(T.teal, 0.25)}`,
          borderRadius: 16, padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20
        }}>
          <span style={{ color: T.ink, fontWeight: 600 }}>Players in lobby</span>
          <motion.span
            key={playerList.length}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ fontSize: '2rem', fontWeight: 900, color: T.teal }}
          >
            {playerList.length}
          </motion.span>
        </div>

        {/* Player list */}
        <div style={{
          background: T.card, borderRadius: 16,
          border: `1.5px solid ${T.line}`,
          boxShadow: T.shadowCard,
          marginBottom: 20, overflow: 'hidden'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.line}` }}>
            <span style={{ color: T.ink3, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Joined Players
            </span>
          </div>
          <div style={{ maxHeight: 280, overflowY: 'auto', padding: '8px' }}>
            <AnimatePresence>
              {playerList.map((p, i) => (
                <motion.div key={p.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10,
                    background: T.fill,
                    marginBottom: 4
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 800, color: '#fff'
                  }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: T.ink, fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ width: 7, height: 7, borderRadius: '50%', background: T.green }}
                    />
                    <span style={{ color: T.ink3, fontSize: '0.75rem' }}>online</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {playerList.length === 0 && (
              <div style={{ padding: '24px 0', textAlign: 'center', color: T.ink3, fontSize: '0.9rem' }}>
                <div style={{ marginBottom: 6 }}>Waiting for players to join...</div>
                <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                  {[0,1,2].map(i => (
                    <motion.span key={i}
                      animate={{ y: [0, -4, 0], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                      style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: T.teal }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Start button */}
        <motion.button
          whileHover={canStart ? { scale: 1.02 } : {}}
          whileTap={canStart ? { scale: 0.97 } : {}}
          onClick={onStartGame}
          disabled={!canStart}
          style={{
            width: '100%', padding: '18px',
            borderRadius: 14, border: 'none',
            background: canStart ? T.gradPrimary : T.disabled,
            color: canStart ? '#fff' : T.ink4,
            fontSize: '1.1rem', fontWeight: 800, fontFamily: 'inherit',
            cursor: canStart ? 'pointer' : 'not-allowed',
            boxShadow: canStart ? T.shadowBtn : 'none',
            transition: 'all 0.25s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
          }}
        >
          {canStart && (
            <motion.span
              animate={{ rotate: [0, 15, 0, -15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              🚀
            </motion.span>
          )}
          Start Game ({playerList.length} player{playerList.length !== 1 ? 's' : ''})
        </motion.button>
      </motion.div>
    </div>
  )
}
