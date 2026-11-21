import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { T } from '../brand'
import { Logo } from './ui'

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
      minHeight: '100vh', background: T.bg, backgroundImage: T.dots, backgroundSize: '26px 26px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          background: T.panel, borderRadius: 24, padding: '36px 30px',
          width: '100%', maxWidth: 400,
          border: `1px solid ${T.line}`, boxShadow: T.shadowModal
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><Logo size={30} /></div>
          <div style={{ fontSize: '2.4rem', marginBottom: 8 }}>🔐</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: T.text, marginBottom: 6 }}>Host Login</h2>
          <p style={{ color: T.text3, fontSize: '0.9rem' }}>Enter the host password to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Admin password..."
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            autoFocus
            aria-label="Admin password"
            style={{
              width: '100%', padding: '16px 20px', borderRadius: 12, marginBottom: 14,
              border: `2px solid ${error ? T.wrong : T.line2}`,
              fontSize: '1rem', fontFamily: 'inherit', fontWeight: 600,
              color: T.text, background: T.panel2,
              outline: 'none', transition: 'border-color 0.2s'
            }}
            onFocus={e => !error && (e.target.style.borderColor = T.primary)}
            onBlur={e => !error && (e.target.style.borderColor = T.line2)}
          />

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ color: T.wrongText, fontSize: '0.85rem', textAlign: 'center', marginBottom: 12, fontWeight: 600 }}
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
              width: '100%', padding: '16px', borderRadius: 12, border: 'none', marginBottom: 12,
              background: ready ? T.gradPrimary : T.fill2,
              color: ready ? T.onAccent : T.text4,
              fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit',
              cursor: ready ? 'pointer' : 'not-allowed',
              boxShadow: ready ? T.shadowBtn : 'none', transition: 'all 0.2s'
            }}
          >
            {loading ? 'Verifying...' : 'Login →'}
          </motion.button>

          <button type="button" onClick={onBack} style={{
            width: '100%', padding: '12px', borderRadius: 12,
            border: `1.5px solid ${T.line2}`, background: 'transparent', color: T.text3,
            fontSize: '0.9rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
          }}>
            ← Back
          </button>
        </form>
      </motion.div>
    </div>
  )
}
