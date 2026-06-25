import { motion, AnimatePresence } from 'framer-motion'

const AVATAR_COLORS = ['#FC8019','#367588','#7B5EA7','#48BB78','#E35D34','#4299e1']

export default function AdminLobby({ players, onStartGame, sessionName, onBackToSessions }) {
  const playerList = Object.values(players)

  return (
    <div style={{
      minHeight: '100vh', background: '#1A1A2A',
      backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
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
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
              fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
              cursor: 'pointer', marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 5
            }}
          >
            ← Sessions
          </button>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎛️</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>Lobby</h2>
          {sessionName && (
            <div style={{ color: '#FC8019', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>{sessionName}</div>
          )}
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            Share the quiz URL and wait for players to join
          </p>
        </div>

        {/* Player count banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(252,128,25,0.15), rgba(227,93,52,0.1))',
          border: '1.5px solid rgba(252,128,25,0.25)',
          borderRadius: 16, padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20
        }}>
          <span style={{ color: '#fff', fontWeight: 600 }}>Players in lobby</span>
          <motion.span
            key={playerList.length}
            initial={{ scale: 1.4, color: '#FC8019' }}
            animate={{ scale: 1, color: '#FC8019' }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ fontSize: '2rem', fontWeight: 900, color: '#FC8019' }}
          >
            {playerList.length}
          </motion.span>
        </div>

        {/* Player list */}
        <div style={{
          background: '#252535', borderRadius: 16,
          border: '1.5px solid rgba(255,255,255,0.06)',
          marginBottom: 20, overflow: 'hidden'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
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
                    background: 'rgba(255,255,255,0.03)',
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
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ width: 7, height: 7, borderRadius: '50%', background: '#48BB78' }}
                    />
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>online</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {playerList.length === 0 && (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>
                <div style={{ marginBottom: 6 }}>Waiting for players to join...</div>
                <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                  {[0,1,2].map(i => (
                    <motion.span key={i}
                      animate={{ y: [0, -4, 0], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                      style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'rgba(252,128,25,0.5)' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Start button */}
        <motion.button
          whileHover={playerList.length > 0 ? { scale: 1.02 } : {}}
          whileTap={playerList.length > 0 ? { scale: 0.97 } : {}}
          onClick={onStartGame}
          disabled={playerList.length === 0}
          style={{
            width: '100%', padding: '18px',
            borderRadius: 14, border: 'none',
            background: playerList.length > 0
              ? 'linear-gradient(135deg, #FC8019, #E35D34)'
              : 'rgba(255,255,255,0.07)',
            color: playerList.length > 0 ? '#fff' : 'rgba(255,255,255,0.25)',
            fontSize: '1.1rem', fontWeight: 800, fontFamily: 'inherit',
            cursor: playerList.length > 0 ? 'pointer' : 'not-allowed',
            boxShadow: playerList.length > 0 ? '0 8px 32px rgba(252,128,25,0.35)' : 'none',
            transition: 'all 0.25s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
          }}
        >
          {playerList.length > 0 && (
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
