import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { T, APP_SUBTITLE, AVATAR_COLORS, tint } from '../brand'
import { Logo, Title, FunnelStrip, Footer } from './ui'

const panel = { background: T.panel, borderRadius: 20, border: `1px solid ${T.line}`, boxShadow: T.shadowCard }

export default function AdminLobby({ players, onStartGame, sessionName, onBackToSessions }) {
  const playerList = Object.values(players)
  const canStart   = playerList.length > 0
  const joinUrl    = window.location.origin   // players join at the site root
  const joinLabel  = window.location.host

  return (
    <div style={{
      minHeight: '100vh', background: T.bg, backgroundImage: T.dots, backgroundSize: '26px 26px',
      padding: '20px 24px 26px', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ width: '100%', maxWidth: 1120, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button
            onClick={onBackToSessions}
            style={{ background: 'none', border: 'none', color: T.text3, fontSize: '0.85rem', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', padding: 0 }}
          >
            ← Sessions
          </button>
          <Logo size={32} />
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 18 }}>
          <Title style={{ fontSize: 'clamp(1.7rem, 3.6vw, 2.6rem)', marginBottom: 6 }} />
          <p style={{ color: T.text2, fontSize: '1rem', fontWeight: 500 }}>
            {APP_SUBTITLE}
            {sessionName && <span style={{ color: T.text3 }}> · {sessionName}</span>}
          </p>
        </motion.div>

        <FunnelStrip style={{ marginBottom: 22 }} />

        <div className="lobby-grid" style={{ marginBottom: 18 }}>
          {/* Join panel */}
          <div style={{ ...panel, padding: '22px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ color: T.text3, fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>
              Scan to join
            </div>
            <div style={{ background: '#FFFFFF', padding: 12, borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', marginBottom: 14 }}>
              <QRCodeSVG value={joinUrl} size={200} level="M" marginSize={1} bgColor="#FFFFFF" fgColor="#0F1720" title={`Join at ${joinLabel}`} />
            </div>
            <div style={{ color: T.text3, fontSize: '0.8rem' }}>or open</div>
            <div style={{ color: T.primary, fontSize: 'clamp(1.05rem, 2vw, 1.4rem)', fontWeight: 700, wordBreak: 'break-all' }}>
              {joinLabel}
            </div>
          </div>

          {/* Players panel */}
          <div style={{ ...panel, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${T.line}` }}>
              <span style={{ color: T.text, fontWeight: 600 }}>Players in lobby</span>
              <motion.span
                key={playerList.length}
                initial={{ scale: 1.4 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{ fontSize: '2rem', fontWeight: 800, color: T.primary, lineHeight: 1 }}
              >
                {playerList.length}
              </motion.span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 14, maxHeight: 380 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <AnimatePresence>
                  {playerList.map((p, i) => (
                    <motion.div key={p.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 14px 6px 6px', borderRadius: 30,
                        background: T.panel2, border: `1px solid ${T.line}`
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', fontWeight: 700, color: T.onAccent
                      }}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ color: T.text, fontWeight: 500, fontSize: '0.92rem' }}>{p.name}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {playerList.length === 0 && (
                <div style={{ padding: '56px 0', textAlign: 'center', color: T.text3, fontSize: '0.95rem' }}>
                  <div style={{ marginBottom: 8 }}>Waiting for players to join...</div>
                  <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <motion.span key={i}
                        animate={{ y: [0, -4, 0], opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                        style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: T.primary }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Start */}
        <motion.button
          whileHover={canStart ? { scale: 1.01 } : {}}
          whileTap={canStart ? { scale: 0.98 } : {}}
          onClick={onStartGame}
          disabled={!canStart}
          style={{
            width: '100%', padding: '18px', borderRadius: 16, border: 'none',
            background: canStart ? T.gradPrimary : T.fill2,
            color: canStart ? T.onAccent : T.text4,
            fontSize: '1.15rem', fontWeight: 700, fontFamily: 'inherit',
            cursor: canStart ? 'pointer' : 'not-allowed',
            boxShadow: canStart ? T.shadowBtn : 'none', transition: 'all 0.25s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
          }}
        >
          {canStart && (
            <motion.span animate={{ rotate: [0, 15, 0, -15, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}>🚀</motion.span>
          )}
          Start Game ({playerList.length} player{playerList.length !== 1 ? 's' : ''})
        </motion.button>

        <Footer style={{ marginTop: 16 }} />
      </div>
    </div>
  )
}
