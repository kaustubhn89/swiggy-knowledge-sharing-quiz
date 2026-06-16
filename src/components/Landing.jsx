import { motion } from 'framer-motion'

const floatVariants = {
  animate: (i) => ({
    x: [0, i % 2 === 0 ? 30 : -25, 0],
    y: [0, i % 3 === 0 ? -40 : 35, 0],
    scale: [1, 1.08, 1],
    transition: { duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }
  })
}

const blobs = [
  { w: 400, h: 400, left: '-10%', top: '-15%', bg: 'rgba(252,128,25,0.12)', custom: 0 },
  { w: 280, h: 280, left: '60%', top: '10%', bg: 'rgba(54,117,136,0.1)', custom: 1 },
  { w: 320, h: 320, left: '5%', top: '60%', bg: 'rgba(252,128,25,0.08)', custom: 2 },
  { w: 200, h: 200, left: '75%', top: '65%', bg: 'rgba(123,94,167,0.1)', custom: 3 },
]

export default function Landing({ onJoinAsPlayer, onAdminLogin }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FC8019 0%, #E35D34 30%, #1C4A57 70%, #0f2d38 100%)',
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
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          style={{
            width: 80, height: 80, borderRadius: 24,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: '2.2rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        >
          ⚡
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Swiggy Instamart
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 4 }}>
            Knowledge Quiz
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', fontWeight: 500, marginBottom: 40 }}>
            Test your Swiggy Ads knowledge. Compete live.
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
              background: 'rgba(255,255,255,0.97)',
              borderRadius: 20,
              padding: '24px 20px',
              cursor: 'pointer',
              border: '2px solid rgba(54,117,136,0.35)',
              boxShadow: '0 0 30px rgba(54,117,136,0.2), 0 8px 24px rgba(0,0,0,0.15)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>📣</div>
            <h3 style={{ color: '#1A1A2A', fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>Join the Quiz</h3>
            <p style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 500, marginBottom: 16 }}>Enter your name & compete</p>
            <div style={{
              background: 'linear-gradient(135deg, #FC8019, #E35D34)',
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
              background: 'rgba(28,74,87,0.75)',
              backdropFilter: 'blur(16px)',
              borderRadius: 20,
              padding: '24px 20px',
              cursor: 'pointer',
              border: '2px solid rgba(252,128,25,0.3)',
              boxShadow: '0 0 30px rgba(252,128,25,0.1), 0 8px 24px rgba(0,0,0,0.3)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>⚙️</div>
            <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>Host Controls</h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 500, marginBottom: 16 }}>Admin access required</p>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)', padding: '10px 0', borderRadius: 10,
              fontWeight: 700, fontSize: '0.9rem',
              border: '1px solid rgba(255,255,255,0.12)'
            }}>
              Admin Login
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: 500 }}
        >
          Powered by Growisto
        </motion.p>
      </div>
    </div>
  )
}
