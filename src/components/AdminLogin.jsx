import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLogin({ onLogin, onBack }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const ok = onLogin(password)
      if (!ok) { setError(true); setPassword('') }
      setLoading(false)
    }, 400)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #14141F 0%, #1C4A57 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          background: '#252535',
          borderRadius: 24, padding: '40px 32px',
          width: '100%', maxWidth: 400,
          border: '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔐</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: 6 }}>Admin Login</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Enter the host password to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <input
              type="password"
              placeholder="Admin password..."
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              autoFocus
              style={{
                width: '100%', padding: '16px 20px',
                borderRadius: 12,
                border: `2px solid ${error ? '#F56565' : 'rgba(255,255,255,0.1)'}`,
                fontSize: '1rem', fontFamily: 'inherit', fontWeight: 600,
                color: '#fff', background: 'rgba(255,255,255,0.06)',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => !error && (e.target.style.borderColor = 'rgba(252,128,25,0.5)')}
              onBlur={e => !error && (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ color: '#F56565', fontSize: '0.85rem', textAlign: 'center', marginBottom: 12, fontWeight: 600 }}
              >
                ✗ Incorrect password. Try again.
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={!password || loading}
            whileHover={password && !loading ? { scale: 1.02 } : {}}
            whileTap={password && !loading ? { scale: 0.97 } : {}}
            style={{
              width: '100%', padding: '16px',
              borderRadius: 12, border: 'none',
              background: password && !loading ? 'linear-gradient(135deg, #FC8019, #E35D34)' : 'rgba(255,255,255,0.08)',
              color: password && !loading ? '#fff' : 'rgba(255,255,255,0.3)',
              fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit',
              cursor: password && !loading ? 'pointer' : 'not-allowed',
              marginBottom: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: password && !loading ? '0 8px 24px rgba(252,128,25,0.3)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Verifying...' : 'Login →'}
          </motion.button>

          <button type="button" onClick={onBack} style={{
            width: '100%', padding: '12px',
            borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: 'rgba(255,255,255,0.4)',
            fontSize: '0.9rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
          }}>
            ← Back
          </button>
        </form>
      </motion.div>
    </div>
  )
}
