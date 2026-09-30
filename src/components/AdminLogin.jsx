import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { T } from '../brand'

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

  const ready = !!password && !loading

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          background: T.card,
          borderRadius: 24, padding: '40px 32px',
          width: '100%', maxWidth: 400,
          border: `1px solid ${T.line}`,
          boxShadow: T.shadowModal
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔐</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: T.ink, marginBottom: 6 }}>Admin Login</h2>
          <p style={{ color: T.ink3, fontSize: '0.9rem' }}>Enter the host password to continue</p>
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
                border: `2px solid ${error ? T.red : T.line2}`,
                fontSize: '1rem', fontFamily: 'inherit', fontWeight: 600,
                color: T.ink, background: T.fill,
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => !error && (e.target.style.borderColor = T.teal)}
              onBlur={e => !error && (e.target.style.borderColor = T.line2)}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ color: T.red, fontSize: '0.85rem', textAlign: 'center', marginBottom: 12, fontWeight: 600 }}
              >
                ✗ Incorrect password. Try again.
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={!ready}
            whileHover={ready ? { scale: 1.02 } : {}}
            whileTap={ready ? { scale: 0.97 } : {}}
            style={{
              width: '100%', padding: '16px',
              borderRadius: 12, border: 'none',
              background: ready ? T.gradPrimary : T.disabled,
              color: ready ? '#fff' : T.ink4,
              fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit',
              cursor: ready ? 'pointer' : 'not-allowed',
              marginBottom: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: ready ? T.shadowBtn : 'none',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Verifying...' : 'Login →'}
          </motion.button>

          <button type="button" onClick={onBack} style={{
            width: '100%', padding: '12px',
            borderRadius: 12, border: `1.5px solid ${T.line2}`,
            background: 'transparent', color: T.ink3,
            fontSize: '0.9rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
          }}>
            ← Back
          </button>
        </form>
      </motion.div>
    </div>
  )
}
