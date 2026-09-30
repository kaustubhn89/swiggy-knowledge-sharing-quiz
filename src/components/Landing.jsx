import { motion } from 'framer-motion'
import { T, APP_NAME, APP_SUBTITLE, ORG, tint } from '../brand'

const floatVariants = {
  animate: (i) => ({
    x: [0, i % 2 === 0 ? 30 : -25, 0],
    y: [0, i % 3 === 0 ? -40 : 35, 0],
    scale: [1, 1.08, 1],
    transition: { duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }
  })
}

const blobs = [
  { w: 420, h: 420, left: '-12%', top: '-18%', bg: tint(T.teal, 0.10),   custom: 0 },
  { w: 300, h: 300, left: '62%',  top: '8%',   bg: tint(T.orange, 0.09), custom: 1 },
  { w: 340, h: 340, left: '4%',   top: '58%',  bg: tint(T.powder, 0.45), custom: 2 },
  { w: 220, h: 220, left: '74%',  top: '64%',  bg: tint(T.purple, 0.08), custom: 3 },
]

export default function Landing({ onJoinAsPlayer, onAdminLogin }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating blobs */}
      {blobs.map((b, i) => (
        <motion.div key={i} custom={i} variants={floatVariants} animate="animate"
          style={{
            position: 'absolute', width: b.w, height: b.h,
            left: b.left, top: b.top,
            borderRadius: '50%', background: b.bg, pointerEvents: 'none'
          }}
        />
      ))}

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 560, textAlign: 'center' }}>
        {/* Logo tile */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          style={{
            width: 80, height: 80, borderRadius: 24,
            background: T.gradPrimary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: '2.2rem',
            boxShadow: T.shadowBtn
          }}
        >
          ⚡
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 800, color: T.ink, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 8 }}>
            {APP_NAME}
          </h1>
          <p style={{ color: T.teal, fontSize: '1rem', fontWeight: 700, marginBottom: 40 }}>
            {APP_SUBTITLE}
          </p>
        </motion.div>

        {/* Two cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}
        >
          {/* Player card */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={onJoinAsPlayer}
            style={{
              background: T.card,
              borderRadius: 20,
              padding: '24px 20px',
              cursor: 'pointer',
              border: `2px solid ${tint(T.teal, 0.35)}`,
              boxShadow: `0 0 30px ${tint(T.teal, 0.14)}, 0 8px 24px rgba(28,74,87,0.10)`,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>📣</div>
            <h3 style={{ color: T.ink, fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>Join the Quiz</h3>
            <p style={{ color: T.ink3, fontSize: '0.8rem', fontWeight: 500, marginBottom: 16 }}>Enter your name & compete</p>
            <div style={{
              background: T.gradPrimary,
              color: '#fff', padding: '10px 0', borderRadius: 10,
              fontWeight: 700, fontSize: '0.9rem'
            }}>
              Play Now →
            </div>
          </motion.div>

          {/* Admin card */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAdminLogin}
            style={{
              background: T.card,
              borderRadius: 20,
              padding: '24px 20px',
              cursor: 'pointer',
              border: `2px solid ${tint(T.orange, 0.35)}`,
              boxShadow: `0 0 30px ${tint(T.orange, 0.10)}, 0 8px 24px rgba(28,74,87,0.10)`,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>⚙️</div>
            <h3 style={{ color: T.ink, fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>Host Controls</h3>
            <p style={{ color: T.ink3, fontSize: '0.8rem', fontWeight: 500, marginBottom: 16 }}>Admin access required</p>
            <div style={{
              background: T.tealDark,
              color: '#fff', padding: '10px 0', borderRadius: 10,
              fontWeight: 700, fontSize: '0.9rem'
            }}>
              Admin Login
            </div>
          </motion.div>
        </motion.div>

        {/* Wordmark */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ color: T.teal, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' }}
        >
          {ORG}
        </motion.p>
      </div>
    </div>
  )
}
