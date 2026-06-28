import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '../questions'

const STATUS_CFG = {
  waiting:     { label: 'Waiting',     color: '#FC8019', bg: 'rgba(252,128,25,0.15)' },
  question:    { label: 'In Progress', color: '#48BB78', bg: 'rgba(72,187,120,0.15)' },
  leaderboard: { label: 'Completed',   color: '#4299e1', bg: 'rgba(66,153,225,0.15)' }
}

function formatDate(ts) {
  const d = new Date(parseInt(ts))
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) +
    ', ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function genDefaultName() {
  const now = new Date()
  const d = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const t = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  return `Quiz – ${d}, ${t}`
}

export default function AdminSessions({ sessions, activeSessionId, onNewGame, onContinue, onRerun, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showNameModal, setShowNameModal]  = useState(false)
  const [newQuizName,   setNewQuizName]    = useState('')

  const openNameModal = () => {
    setNewQuizName(genDefaultName())
    setShowNameModal(true)
  }

  const handleStartNewQuiz = () => {
    const name = newQuizName.trim()
    if (!name) return
    setShowNameModal(false)
    onNewGame(name)
  }

  const sessionList = Object.entries(sessions)
    .filter(([, s]) => s.saved)
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
  const activeSession = activeSessionId ? sessions[activeSessionId] : null

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      onDelete(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1A1A2A', padding: '28px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
              <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem' }}>Quiz Sessions</h2>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
              {sessionList.length} session{sessionList.length !== 1 ? 's' : ''} · Admin Control
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={openNameModal}
            style={{
              padding: '12px 22px', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, #FC8019, #E35D34)',
              color: '#fff', fontSize: '0.95rem', fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(252,128,25,0.35)',
              display: 'flex', alignItems: 'center', gap: 7
            }}
          >
            ＋ New Quiz
          </motion.button>
        </div>

        {/* Active session banner */}
        <AnimatePresence>
          {activeSession && (
            <motion.div
              key="active-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                background: 'rgba(252,128,25,0.07)',
                border: '1.5px solid rgba(252,128,25,0.3)',
                borderRadius: 16, padding: '16px 20px', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap'
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: '#FC8019', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: 'rgba(252,128,25,0.65)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  Active Session
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeSession.name}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: 2 }}>
                  {activeSession.status === 'question'
                    ? `Q${(activeSession.currentQuestion || 0) + 1}/${questions.length} in progress · ${activeSession.playerCount || 0} players`
                    : `${activeSession.playerCount || 0} players · ${STATUS_CFG[activeSession.status]?.label}`}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onContinue(activeSessionId)}
                style={{
                  padding: '10px 20px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #FC8019, #E35D34)',
                  color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                  fontFamily: 'inherit', cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(252,128,25,0.3)'
                }}
              >
                {activeSession.status === 'waiting'    ? '🚪 Open Lobby' :
                 activeSession.status === 'question'   ? '▶ Resume'       :
                                                         '🏆 View Results'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sessions list */}
        {sessionList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center', padding: '64px 20px',
              background: '#252535', borderRadius: 20,
              border: '1.5px solid rgba(255,255,255,0.06)'
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎛️</div>
            <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>No sessions yet</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', marginBottom: 24 }}>
              Create your first quiz to get started
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={openNameModal}
              style={{
                padding: '14px 32px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #FC8019, #E35D34)',
                color: '#fff', fontSize: '1rem', fontWeight: 700,
                fontFamily: 'inherit', cursor: 'pointer'
              }}
            >
              ＋ Create First Quiz
            </motion.button>
          </motion.div>
        ) : (
          <div style={{ background: '#252535', borderRadius: 20, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.06)' }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 110px 54px 1fr',
              padding: '11px 20px',
              background: 'rgba(255,255,255,0.02)',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              {['Session', 'Status', 'Players', 'Actions'].map(h => (
                <span key={h} style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>
              ))}
            </div>

            {sessionList.map(([id, s], i) => {
              const isActive = id === activeSessionId
              const cfg      = STATUS_CFG[s.status] || STATUS_CFG.waiting
              const isConfirm = confirmDelete === id

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 280, damping: 24 }}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 110px 54px 1fr',
                    padding: '14px 20px', alignItems: 'center',
                    borderBottom: i < sessionList.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: isActive ? 'rgba(252,128,25,0.04)' : 'transparent',
                    borderLeft: isActive ? '3px solid #FC8019' : '3px solid transparent'
                  }}
                >
                  {/* Name + date */}
                  <div style={{ paddingRight: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.name}
                      </span>
                      {isActive && (
                        <span style={{ background: 'rgba(252,128,25,0.2)', color: '#FC8019', fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px', borderRadius: 6, flexShrink: 0 }}>
                          LIVE
                        </span>
                      )}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.72rem' }}>
                      {s.status === 'question' ? `Q${(s.currentQuestion || 0) + 1}/${questions.length} in progress` : formatDate(id)}
                    </div>
                  </div>

                  {/* Status */}
                  <span style={{
                    display: 'inline-flex', alignSelf: 'center',
                    padding: '4px 10px', borderRadius: 20,
                    background: cfg.bg, color: cfg.color,
                    fontSize: '0.7rem', fontWeight: 700, width: 'fit-content'
                  }}>
                    {cfg.label}
                  </span>

                  {/* Players */}
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600, fontSize: '0.9rem' }}>
                    {s.playerCount || 0}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => onContinue(id)}
                      style={{
                        padding: '6px 11px', borderRadius: 8, border: 'none',
                        background: isActive ? 'rgba(252,128,25,0.18)' : 'rgba(255,255,255,0.07)',
                        color: isActive ? '#FC8019' : 'rgba(255,255,255,0.55)',
                        fontSize: '0.73rem', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer'
                      }}
                    >
                      {s.status === 'leaderboard' ? 'Results' : 'Manage'}
                    </button>
                    <button
                      onClick={() => onRerun(id)}
                      style={{
                        padding: '6px 11px', borderRadius: 8, border: 'none',
                        background: 'rgba(72,187,120,0.1)', color: '#48BB78',
                        fontSize: '0.73rem', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer'
                      }}
                    >
                      Rerun
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      style={{
                        padding: '6px 11px', borderRadius: 8, border: 'none',
                        background: isConfirm ? 'rgba(245,101,101,0.25)' : 'rgba(245,101,101,0.08)',
                        color: '#F56565',
                        fontSize: '0.73rem', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      {isConfirm ? 'Confirm?' : '✕ Delete'}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Footer hint */}
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.75rem', textAlign: 'center', marginTop: 20 }}>
          Sessions are stored in Firebase · Delete removes permanently
        </p>
      </div>

      {/* ── Name Modal ───────────────────────── */}
      <AnimatePresence>
        {showNameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.72)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 200, padding: 20
            }}
            onClick={e => { if (e.target === e.currentTarget) setShowNameModal(false) }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{
                background: '#252535', borderRadius: 20, padding: '28px 24px',
                width: '100%', maxWidth: 400,
                border: '1.5px solid rgba(255,255,255,0.1)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
              }}
            >
              <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem', marginBottom: 6 }}>
                Name this Quiz
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', marginBottom: 20 }}>
                Give it a name so you can find, save, and rerun it later.
              </p>
              <input
                type="text"
                value={newQuizName}
                onChange={e => setNewQuizName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && newQuizName.trim() && handleStartNewQuiz()}
                maxLength={50}
                autoFocus
                placeholder="e.g. Instamart Ads – Round 1"
                style={{
                  width: '100%', padding: '13px 16px',
                  borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.05)', color: '#fff',
                  fontSize: '0.95rem', fontFamily: 'inherit', fontWeight: 600,
                  outline: 'none', marginBottom: 14, boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(252,128,25,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
              <button
                onClick={handleStartNewQuiz}
                disabled={!newQuizName.trim()}
                style={{
                  width: '100%', padding: '13px',
                  borderRadius: 10, border: 'none',
                  background: newQuizName.trim() ? 'linear-gradient(135deg, #FC8019, #E35D34)' : 'rgba(255,255,255,0.08)',
                  color: newQuizName.trim() ? '#fff' : 'rgba(255,255,255,0.25)',
                  fontSize: '0.95rem', fontWeight: 700,
                  fontFamily: 'inherit', cursor: newQuizName.trim() ? 'pointer' : 'not-allowed',
                  marginBottom: 8, transition: 'background 0.2s, color 0.2s'
                }}
              >
                Start Quiz →
              </button>
              <button
                onClick={() => setShowNameModal(false)}
                style={{
                  width: '100%', padding: '10px', borderRadius: 10,
                  border: 'none', background: 'transparent',
                  color: 'rgba(255,255,255,0.28)', fontSize: '0.85rem',
                  fontFamily: 'inherit', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
