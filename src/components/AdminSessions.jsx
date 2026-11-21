import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '../questions'
import { T, APP_NAME, tint } from '../brand'
import { Logo, Footer } from './ui'

const STATUS_CFG = {
  waiting:     { label: 'Waiting',     color: T.primary,       bg: tint(T.primary, 0.14) },
  question:    { label: 'In Progress', color: T.correct,       bg: tint(T.correct, 0.14) },
  leaderboard: { label: 'Completed',   color: T.secondaryText, bg: tint(T.secondary, 0.16) }
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
  return `DSP Quiz – ${d}, ${t}`
}

export default function AdminSessions({ sessions, activeSessionId, onNewGame, onContinue, onRerun, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showNameModal, setShowNameModal] = useState(false)
  const [newQuizName,   setNewQuizName]   = useState('')

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

  const primaryBtn = {
    borderRadius: 12, border: 'none', background: T.gradPrimary, color: T.onAccent,
    fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', boxShadow: T.shadowBtn
  }
  const card = { background: T.panel, borderRadius: 20, border: `1px solid ${T.line}`, boxShadow: T.shadowCard }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.dots, backgroundSize: '26px 26px', padding: '26px 20px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 26 }}>
          <div>
            <div style={{ marginBottom: 10 }}><Logo size={26} /></div>
            <h2 style={{ color: T.text, fontWeight: 700, fontSize: '1.5rem', marginBottom: 2 }}>Quiz Sessions</h2>
            <p style={{ color: T.text3, fontSize: '0.85rem' }}>
              {sessionList.length} saved session{sessionList.length !== 1 ? 's' : ''} · {APP_NAME}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={openNameModal}
            style={{ ...primaryBtn, padding: '12px 22px', fontSize: '0.95rem', flexShrink: 0 }}
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
                background: tint(T.primary, 0.08), border: `1.5px solid ${tint(T.primary, 0.35)}`,
                borderRadius: 16, padding: '16px 20px', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap'
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: T.primary, flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: T.primary, fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 2 }}>
                  Active Session
                </div>
                <div style={{ color: T.text, fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeSession.name}
                </div>
                <div style={{ color: T.text3, fontSize: '0.75rem', marginTop: 2 }}>
                  {activeSession.status === 'question'
                    ? `Q${(activeSession.currentQuestion || 0) + 1}/${questions.length} in progress · ${activeSession.playerCount || 0} players`
                    : `${activeSession.playerCount || 0} players · ${STATUS_CFG[activeSession.status]?.label}`}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onContinue(activeSessionId)}
                  style={{ ...primaryBtn, borderRadius: 10, padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  {activeSession.status === 'waiting'  ? '🚪 Open Lobby' :
                   activeSession.status === 'question' ? '▶ Resume'       :
                                                         '🏆 View Results'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDelete(activeSessionId)}
                  aria-label="Delete active session"
                  style={{
                    padding: '10px 14px', borderRadius: 10,
                    border: `1.5px solid ${confirmDelete === activeSessionId ? tint(T.wrong, 0.7) : T.line2}`,
                    background: confirmDelete === activeSessionId ? tint(T.wrong, 0.16) : 'transparent',
                    color: confirmDelete === activeSessionId ? T.wrongText : T.text3,
                    fontWeight: 700, fontSize: '0.85rem', fontFamily: 'inherit', cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {confirmDelete === activeSessionId ? 'Confirm?' : '🗑'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved sessions */}
        {sessionList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ ...card, textAlign: 'center', padding: '60px 20px' }}
          >
            <div style={{ fontSize: '3.2rem', marginBottom: 14 }}>🎛️</div>
            <p style={{ color: T.text, fontSize: '1.05rem', fontWeight: 600, marginBottom: 6 }}>No saved sessions yet</p>
            <p style={{ color: T.text3, fontSize: '0.85rem', marginBottom: 22 }}>Create a quiz to get started</p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={openNameModal}
              style={{ ...primaryBtn, padding: '14px 32px', fontSize: '1rem' }}
            >
              ＋ Create Quiz
            </motion.button>
          </motion.div>
        ) : (
          <div style={{ ...card, overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 110px 60px 1fr',
              padding: '11px 20px', background: T.fill, borderBottom: `1px solid ${T.line}`
            }}>
              {['Session', 'Status', 'Players', 'Actions'].map(h => (
                <span key={h} style={{ color: T.text3, fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
              ))}
            </div>

            {sessionList.map(([id, s], i) => {
              const isActive  = id === activeSessionId
              const cfg       = STATUS_CFG[s.status] || STATUS_CFG.waiting
              const isConfirm = confirmDelete === id

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 280, damping: 24 }}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 110px 60px 1fr',
                    padding: '14px 20px', alignItems: 'center',
                    borderBottom: i < sessionList.length - 1 ? `1px solid ${T.line}` : 'none',
                    background: isActive ? tint(T.primary, 0.06) : 'transparent',
                    borderLeft: `3px solid ${isActive ? T.primary : 'transparent'}`
                  }}
                >
                  <div style={{ paddingRight: 12, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ color: T.text, fontWeight: 500, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.name}
                      </span>
                      {isActive && (
                        <span style={{ background: tint(T.primary, 0.2), color: T.primary, fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 6, flexShrink: 0 }}>
                          LIVE
                        </span>
                      )}
                    </div>
                    <div style={{ color: T.text3, fontSize: '0.72rem' }}>
                      {s.status === 'question' ? `Q${(s.currentQuestion || 0) + 1}/${questions.length} in progress` : formatDate(id)}
                    </div>
                  </div>

                  <span style={{
                    display: 'inline-flex', alignSelf: 'center', padding: '4px 10px', borderRadius: 20,
                    background: cfg.bg, color: cfg.color, fontSize: '0.7rem', fontWeight: 600, width: 'fit-content'
                  }}>
                    {cfg.label}
                  </span>

                  <span style={{ color: T.text2, fontWeight: 500, fontSize: '0.9rem' }}>{s.playerCount || 0}</span>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => onContinue(id)}
                      style={{
                        padding: '6px 11px', borderRadius: 8, border: 'none',
                        background: isActive ? tint(T.primary, 0.18) : T.fill2,
                        color: isActive ? T.primary : T.text2,
                        fontSize: '0.74rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
                      }}
                    >
                      {s.status === 'leaderboard' ? 'Results' : 'Manage'}
                    </button>
                    <button
                      onClick={() => onRerun(id)}
                      style={{
                        padding: '6px 11px', borderRadius: 8, border: 'none',
                        background: tint(T.secondary, 0.16), color: T.secondaryText,
                        fontSize: '0.74rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
                      }}
                    >
                      Rerun
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      style={{
                        padding: '6px 11px', borderRadius: 8, border: 'none',
                        background: isConfirm ? tint(T.wrong, 0.28) : tint(T.wrong, 0.12),
                        color: T.wrongText,
                        fontSize: '0.74rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
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

        <p style={{ color: T.text4, fontSize: '0.75rem', textAlign: 'center', marginTop: 20, marginBottom: 6 }}>
          Sessions are stored in Firebase · Delete removes permanently
        </p>
        <Footer />
      </div>

      {/* ── Name modal ───────────────────────── */}
      <AnimatePresence>
        {showNameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(10,15,22,0.72)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20
            }}
            onClick={e => { if (e.target === e.currentTarget) setShowNameModal(false) }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{
                background: T.panel, borderRadius: 20, padding: '28px 24px',
                width: '100%', maxWidth: 400, border: `1px solid ${T.line2}`, boxShadow: T.shadowModal
              }}
            >
              <h3 style={{ color: T.text, fontWeight: 700, fontSize: '1.15rem', marginBottom: 6 }}>Name this Quiz</h3>
              <p style={{ color: T.text3, fontSize: '0.82rem', marginBottom: 18 }}>
                Give it a name so you can find, save, and rerun it later.
              </p>
              <input
                type="text"
                value={newQuizName}
                onChange={e => setNewQuizName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && newQuizName.trim() && handleStartNewQuiz()}
                maxLength={50}
                autoFocus
                placeholder="e.g. DSP Session 1 – Batch A"
                aria-label="Quiz name"
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: 10,
                  border: `1.5px solid ${T.line2}`, background: T.panel2, color: T.text,
                  fontSize: '0.95rem', fontFamily: 'inherit', fontWeight: 500,
                  outline: 'none', marginBottom: 14
                }}
                onFocus={e => e.target.style.borderColor = T.primary}
                onBlur={e => e.target.style.borderColor = T.line2}
              />
              <button
                onClick={handleStartNewQuiz}
                disabled={!newQuizName.trim()}
                style={{
                  width: '100%', padding: '13px', borderRadius: 10, border: 'none', marginBottom: 8,
                  background: newQuizName.trim() ? T.gradPrimary : T.fill2,
                  color: newQuizName.trim() ? T.onAccent : T.text4,
                  fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit',
                  cursor: newQuizName.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s, color 0.2s'
                }}
              >
                Start Quiz →
              </button>
              <button
                onClick={() => setShowNameModal(false)}
                style={{
                  width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: 'transparent',
                  color: T.text3, fontSize: '0.85rem', fontFamily: 'inherit', cursor: 'pointer'
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
