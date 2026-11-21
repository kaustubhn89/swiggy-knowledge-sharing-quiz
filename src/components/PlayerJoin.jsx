import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { T } from '../brand'
import { Footer } from './ui'

export default function PlayerJoin({ onJoin, onBack, noSession }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setLoading(true)
    await onJoin(trimmed)
    setLoading(false)
  }

  const ready = !!name.trim() && !loading

  return (
    <div style={{
      minHeight: '100vh', background: T.bg, backgroundImage: T.dots, backgroundSize: '26px 26px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 18
    }}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          background: T.panel, borderRadius: 24, padding: '36px 28px',
          width: '100%', maxWidth: 420,
          border: `1px solid ${T.line}`, boxShadow: T.shadowModal
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ fontSize: '2.8rem', marginBottom: 10 }}
          >
            👋
          </motion.div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: T.text, marginBottom: 6 }}>What's your name?</h2>
          <p style={{ color: T.text3, fontSize: '0.9rem', fontWeight: 500 }}>
            {noSession ? "Quiz hasn't started yet — enter your name to be ready" : 'This will appear on the live leaderboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={24}
            autoFocus
            disabled={loading}
            aria-label="Your name"
            style={{
              width: '100%', padding: '16px 20px', borderRadius: 50,
              border: `2px solid ${T.line2}`,
              fontSize: '1.02rem', fontFamily: 'inherit', fontWeight: 600,
              color: T.text, background: T.panel2,
              outline: 'none', marginBottom: 14, transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = T.primary}
            onBlur={e => e.target.style.borderColor = T.line2}
          />

          <motion.button
            type="submit"
            disabled={!ready}
            whileHover={ready ? { scale: 1.02 } : {}}
            whileTap={ready ? { scale: 0.97 } : {}}
            style={{
              width: '100%', padding: '16px', borderRadius: 50, border: 'none',
              background: ready ? T.gradPrimary : T.fill2,
              color: ready ? T.onAccent : T.text4,
              fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit',
              cursor: ready ? 'pointer' : 'not-allowed',
              marginBottom: 12, boxShadow: ready ? T.shadowBtn : 'none',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block', width: 18, height: 18, border: '2.5px solid rgba(15,23,32,0.3)', borderTopColor: T.onAccent, borderRadius: '50%' }}
                  />
                  Joining...
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Join Game →
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button type="button" onClick={onBack} style={{
            width: '100%', padding: '12px', borderRadius: 50,
            border: `2px solid ${T.line2}`, background: 'transparent',
            color: T.text3, fontSize: '0.9rem', fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer'
          }}>
            ← Back
          </button>
        </form>
      </motion.div>
      <Footer />
    </div>
  )
}
