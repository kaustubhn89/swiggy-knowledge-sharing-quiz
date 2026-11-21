import { motion } from 'framer-motion'
import { T, APP_SUBTITLE, SLOTS, tint } from '../brand'
import { Logo, Title, Footer, Shape } from './ui'

const floatVariants = {
  animate: (i) => ({
    x: [0, i % 2 === 0 ? 30 : -25, 0],
    y: [0, i % 3 === 0 ? -40 : 35, 0],
    scale: [1, 1.08, 1],
    transition: { duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }
  })
}

const blobs = [
  { w: 440, h: 440, left: '-14%', top: '-18%', bg: tint(T.primary, 0.08) },
  { w: 300, h: 300, left: '64%',  top: '6%',   bg: tint(T.secondary, 0.09) },
  { w: 340, h: 340, left: '2%',   top: '60%',  bg: tint(T.purple, 0.07) },
  { w: 240, h: 240, left: '74%',  top: '64%',  bg: tint(T.blue, 0.08) },
]

const card = {
  background: T.panel, borderRadius: 20, padding: '26px 20px 22px',
  cursor: 'pointer', textAlign: 'center', color: T.text,
  fontFamily: 'inherit', width: '100%', boxShadow: T.shadowCard
}

export default function Landing({ onJoinAsPlayer, onAdminLogin }) {
  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '28px 20px', position: 'relative', overflow: 'hidden'
    }}>
      {blobs.map((b, i) => (
        <motion.div key={i} custom={i} variants={floatVariants} animate="animate"
          style={{ position: 'absolute', width: b.w, height: b.h, left: b.left, top: b.top, borderRadius: '50%', background: b.bg, pointerEvents: 'none' }}
        />
      ))}

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 580, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}
        >
          <Logo size={42} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
          <Title style={{ fontSize: 'clamp(1.85rem, 6vw, 2.7rem)', marginBottom: 10 }} />
          <p style={{ color: T.text2, fontSize: '1.02rem', fontWeight: 500, marginBottom: 36 }}>{APP_SUBTITLE}</p>
        </motion.div>

        <motion.div
          className="landing-cards"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}
          style={{ marginBottom: 32 }}
        >
          {/* Player card */}
          <motion.button
            type="button" whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}
            onClick={onJoinAsPlayer}
            style={{ ...card, border: `2px solid ${tint(T.primary, 0.45)}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, height: 22, alignItems: 'center', marginBottom: 14 }}>
              {SLOTS.map(s => <Shape key={s.shape} shape={s.shape} size={20} color={s.color} />)}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>Join the Quiz</h3>
            <p style={{ color: T.text3, fontSize: '0.82rem', fontWeight: 500, marginBottom: 16 }}>Enter your name & compete</p>
            <div style={{ background: T.gradPrimary, color: T.onAccent, padding: '11px 0', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem' }}>
              Play Now →
            </div>
          </motion.button>

          {/* Host card */}
          <motion.button
            type="button" whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}
            onClick={onAdminLogin}
            style={{ ...card, border: `2px solid ${tint(T.secondary, 0.4)}` }}
          >
            <div style={{ height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: 14 }}>⚙️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>Host Controls</h3>
            <p style={{ color: T.text3, fontSize: '0.82rem', fontWeight: 500, marginBottom: 16 }}>Admin access required</p>
            <div style={{ border: `1.5px solid ${T.secondary}`, color: T.secondaryText, padding: '9.5px 0', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem' }}>
              Admin Login
            </div>
          </motion.button>
        </motion.div>

        <Footer />
      </div>
    </div>
  )
}
