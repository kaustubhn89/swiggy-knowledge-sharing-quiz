import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PlayerJoin({ onJoin, onBack }) {
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FC8019 0%, #E35D34 35%, #1C4A57 70%, #0f2d38 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: '40px 32px',
          width: '100%', maxWidth: 420,
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ fontSize: '3rem', marginBottom: 12 }}
          >
            👋
          </motion.div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1A1A2A', marginBottom: 6 }}>What's your name?</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 500 }}>This will appear on the live leaderboard</p>
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
            style={{
              width: '100%',
              padding: '16px 20px',
              borderRadius: 50,
              border: '2px solid #e5e7eb',
              fontSize: '1rem',
              fontFamily: 'inherit',
              fontWeight: 600,
              color: '#1A1A2A',
              background: '#f9fafb',
              outline: 'none',
              marginBottom: 16,
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#FC8019'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
          />

          <motion.button
            type="submit"
            disabled={!name.trim() || loading}
            whileHover={name.trim() && !loading ? { scale: 1.02 } : {}}
            whileTap={name.trim() && !loading ? { scale: 0.97 } : {}}
            style={{
              width: '100%', padding: '16px',
              borderRadius: 50, border: 'none',
              background: name.trim() && !loading ? 'linear-gradient(135deg, #FC8019, #E35D34)' : '#e5e7eb',
              color: name.trim() && !loading ? '#fff' : '#9ca3af',
              fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit',
              cursor: name.trim() && !loading ? 'pointer' : 'not-allowed',
              marginBottom: 12,
              boxShadow: name.trim() && !loading ? '0 8px 24px rgba(252,128,25,0.35)' : 'none',
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
                    style={{ display: 'inline-block', width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%' }}
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
            border: '2px solid #e5e7eb', background: 'transparent',
            color: '#6b7280', fontSize: '0.9rem', fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer'
          }}>
            ← Back
          </button>
        </form>
      </motion.div>
    </div>
  )
}
