import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '../questions'
import { T, APP_NAME, tint } from '../brand'

const STATUS_CFG = {
  waiting:     { label: 'Waiting',     color: T.orange, bg: tint(T.orange, 0.12) },
  question:    { label: 'In Progress', color: T.green,  bg: tint(T.green, 0.12) },
  leaderboard: { label: 'Completed',   color: T.blue,   bg: tint(T.blue, 0.12) }
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

  const primaryBtn = {
    borderRadius: 12, border: 'none',
    background: T.gradPrimary, color: '#fff',
    fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
    boxShadow: T.shadowBtn
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, padding: '28px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
              <h2 style={{ color: T.ink, fontWeight: 800, fontSize: '1.5rem' }}>Quiz Sessions</h2>
            </div>
            <p style={{ color: T.ink3, fontSize: '0.85rem' }}>
              {sessionList.length} session{sessionList.length !== 1 ? 's' : ''} · {APP_NAME}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={openNameModal}
            style={{
              ...primaryBtn,
              padding: '12px 22px', fontSize: '0.95rem',
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
                background: tint(T.teal, 0.07),
                border: `1.5px solid ${tint(T.teal, 0.30)}`,
                borderRadius: 16, padding: '16px 20px', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap'
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: T.orange, flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: T.orange, fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  Active Session
                </div>
                <div style={{ color: T.ink, fontWeight: 700, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeSession.name}
                </div>
                <div style={{ color: T.ink3, fontSize: '0.75rem', marginTop: 2 }}>
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
                  {activeSession.status === 'waiting'    ? '🚪 Open Lobby' :
                   activeSession.status === 'question'   ? '▶ Resume'       :
                                                           '🏆 View Results'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDelete(activeSessionId)}
                  style={{
                    padding: '10px 14px', borderRadius: 10,
                    border: `1.5px solid ${confirmDelete === activeSessionId ? tint(T.red, 0.6) : T.line2}`,
                    background: confirmDelete === activeSessionId ? tint(T.red, 0.10) : T.card,
                    color: confirmDelete === activeSessionId ? T.red : T.ink3,
                    fontWeight: 700, fontSize: '0.85rem',
                    fontFamily: 'inherit', cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {confirmDelete === activeSessionId ? 'Confirm?' : '🗑'}
                </motion.button>
              </div>
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
              background: T.card, borderRadius: 20,
              border: `1.5px solid ${T.line}`,
              boxShadow: T.shadowCard
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎛️</div>
            <p style={{ color: T.ink, fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>No sessions yet</p>
            <p style={{ color: T.ink3, fontSize: '0.85rem', marginBottom: 24 }}>
              Create your first quiz to get started
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={openNameModal}
              style={{ ...primaryBtn, padding: '14px 32px', fontSize: '1rem' }}
            >
              ＋ Create First Quiz
            </motion.button>
          </motion.div>
        ) : (
          <div style={{ background: T.card, borderRadius: 20, overflow: 'hidden', border: `1.5px solid ${T.line}`, boxShadow: T.shadowCard }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 110px 54px 1fr',
              padding: '11px 20px',
              background: T.fill,
              borderBottom: `1px solid ${T.line}`
            }}>
              {['Session', 'Status', 'Players', 'Actions'].map(h => (
                <span key={h} style={{ color: T.ink3, fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>
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
                    display: 'grid', gridTemplateColumns: '1fr 110px 54px 1fr',
                    padding: '14px 20px', alignItems: 'center',
                    borderBottom: i < sessionList.length - 1 ? `1px solid ${T.line}` : 'none',
                    background: isActive ? tint(T.teal, 0.05) : 'transparent',
                    borderLeft: isActive ? `3px solid ${T.orange}` : '3px solid transparent'
                  }}
                >
                  {/* Name + date */}
                  <div style={{ paddingRight: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ color: T.ink, fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.name}
                      </span>
                      {isActive && (
                        <span style={{ background: tint(T.orange, 0.15), color: T.orange, fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px', borderRadius: 6, flexShrink: 0 }}>
                          LIVE
                        </span>
                      )}
                    </div>
                    <div style={{ color: T.ink3, fontSize: '0.72rem' }}>
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
                  <span style={{ color: T.ink2, fontWeight: 600, fontSize: '0.9rem' }}>
                    {s.playerCount || 0}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => onContinue(id)}
                      style={{
                        padding: '6px 11px', borderRadius: 8, border: 'none',
                        background: isActive ? tint(T.orange, 0.15) : T.fill2,
                        color: isActive ? T.orange : T.ink2,
                        fontSize: '0.73rem', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer'
                      }}
                    >
                      {s.status === 'leaderboard' ? 'Results' : 'Manage'}
                    </button>
                    <button
                      onClick={() => onRerun(id)}
                      style={{
                        padding: '6px 11px', borderRadius: 8, border: 'none',
                        background: tint(T.green, 0.10), color: T.green,
                        fontSize: '0.73rem', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer'
                      }}
                    >
                      Rerun
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      style={{
                        padding: '6px 11px', borderRadius: 8, border: 'none',
                        background: isConfirm ? tint(T.red, 0.20) : tint(T.red, 0.08),
                        color: T.red,
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
        <p style={{ color: T.ink4, fontSize: '0.75rem', textAlign: 'center', marginTop: 20 }}>
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
              background: 'rgba(28,74,87,0.45)',
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
                background: T.card, borderRadius: 20, padding: '28px 24px',
                width: '100%', maxWidth: 400,
                border: `1.5px solid ${T.line}`,
                boxShadow: T.shadowModal
              }}
            >
              <h3 style={{ color: T.ink, fontWeight: 800, fontSize: '1.15rem', marginBottom: 6 }}>
                Name this Quiz
              </h3>
              <p style={{ color: T.ink3, fontSize: '0.82rem', marginBottom: 20 }}>
                Give it a name so you can find, save, and rerun it later.
              </p>
              <input
                type="text"
                value={newQuizName}
                onChange={e => setNewQuizName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && newQuizName.trim() && handleStartNewQuiz()}
                maxLength={50}
                autoFocus
                placeholder={`e.g. ${APP_NAME} – Round 1`}
                style={{
                  width: '100%', padding: '13px 16px',
                  borderRadius: 10, border: `1.5px solid ${T.line2}`,
                  background: T.fill, color: T.ink,
                  fontSize: '0.95rem', fontFamily: 'inherit', fontWeight: 600,
                  outline: 'none', marginBottom: 14, boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = T.teal}
                onBlur={e => e.target.style.borderColor = T.line2}
              />
              <button
                onClick={handleStartNewQuiz}
                disabled={!newQuizName.trim()}
                style={{
                  width: '100%', padding: '13px',
                  borderRadius: 10, border: 'none',
                  background: newQuizName.trim() ? T.gradPrimary : T.disabled,
                  color: newQuizName.trim() ? '#fff' : T.ink4,
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
                  color: T.ink3, fontSize: '0.85rem',
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
