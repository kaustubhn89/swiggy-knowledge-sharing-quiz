import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { onValue, set, update, remove } from 'firebase/database'
import { dbRef } from './db'
import { questions } from './questions'
import { T } from './brand'
import Landing from './components/Landing'
import RulesScreen from './components/RulesScreen'
import PlayerJoin from './components/PlayerJoin'
import WaitingRoom from './components/WaitingRoom'
import QuestionScreen from './components/QuestionScreen'
import AnswerReveal from './components/AnswerReveal'
import AnswerLocked from './components/AnswerLocked'
import Leaderboard from './components/Leaderboard'
import AdminLogin from './components/AdminLogin'
import AdminLobby from './components/AdminLobby'
import AdminControl from './components/AdminControl'
import AdminSessions from './components/AdminSessions'

const ADMIN_PASSWORD = 'growisto@2026'
const STORE_ID   = 'dspPlayerId'
const STORE_NAME = 'dspPlayerName'

const store = {
  get: (k)    => { try { return localStorage.getItem(k) } catch { return null } },
  set: (k, v) => { try { localStorage.setItem(k, v) } catch { /* private mode */ } },
  del: (k)    => { try { localStorage.removeItem(k) } catch { /* private mode */ } },
}

function genId() {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36)
}

function genSessionName() {
  const now = new Date()
  const d = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const t = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  return `DSP Quiz – ${d}, ${t}`
}

// Opening the site at /host (or ?host) goes straight to the host login
function wantsHost() {
  try {
    return /^\/host\/?$/i.test(window.location.pathname) || new URLSearchParams(window.location.search).has('host')
  } catch { return false }
}

function friendlyDbError(e) {
  const msg = String(e?.code || e?.message || e)
  if (/permission/i.test(msg)) return "Can't reach the quiz database (permission denied). Host: check the Firebase Realtime Database rules."
  return `Quiz database error: ${msg}`
}

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -18, transition: { duration: 0.2, ease: 'easeIn' } }
}

export default function App() {
  const [userType, setUserType]   = useState(() => (wantsHost() ? 'admin' : null))
  const [adminAuth, setAdminAuth] = useState(false)
  const [adminView, setAdminView] = useState('sessions') // 'sessions' | 'managing'
  const [rulesAcknowledged, setRulesAcknowledged] = useState(false)
  const [dbError, setDbError] = useState(null)

  const [playerId] = useState(() => {
    let id = store.get(STORE_ID)
    if (!id) { id = genId(); store.set(STORE_ID, id) }
    return id
  })
  const [playerName, setPlayerName] = useState(() => store.get(STORE_NAME) || '')

  const [activeSessionId, setActiveSessionId] = useState(null)
  const [allSessions, setAllSessions]         = useState({})
  const [gameState, setGameState] = useState({ status: 'waiting', currentQuestion: 0, questionStartTime: 0 })
  const [players, setPlayers]     = useState({})
  const [answerLocked, setAnswerLocked] = useState(false)
  const [lockedAnswer, setLockedAnswer] = useState(null)
  const [revealData, setRevealData]     = useState(null)

  const prevQuestion     = useRef(-1)
  const revealTimeoutRef = useRef(null)
  const playersRef       = useRef(players)
  const userTypeRef      = useRef(userType)
  playersRef.current  = players
  userTypeRef.current = userType

  const reportDbError = useCallback((e) => {
    console.error(e)
    setDbError(friendlyDbError(e))
  }, [])

  // Listen to activeSessionId + all sessions (everything under the dsp/ namespace)
  useEffect(() => {
    const unsubActive = onValue(dbRef('activeSessionId'), snap => {
      setActiveSessionId(snap.val() || null)
    }, reportDbError)
    const unsubAll = onValue(dbRef('sessions'), snap => {
      const data = snap.val() || {}
      const metas = {}
      Object.entries(data).forEach(([id, s]) => {
        if (s?.meta) metas[id] = { ...s.meta, playerCount: Object.keys(s.players || {}).length }
      })
      setAllSessions(metas)
    }, reportDbError)
    return () => { unsubActive(); unsubAll() }
  }, [reportDbError])

  // Listen to the active session's game state + players
  useEffect(() => {
    if (!activeSessionId) {
      setGameState({ status: 'waiting', currentQuestion: 0, questionStartTime: 0 })
      setPlayers({})
      return
    }
    const unsubGame = onValue(dbRef(`sessions/${activeSessionId}/meta`), snap => {
      setGameState(snap.val() || { status: 'waiting', currentQuestion: 0, questionStartTime: 0 })
    }, reportDbError)
    const unsubPlayers = onValue(dbRef(`sessions/${activeSessionId}/players`), snap => {
      setPlayers(snap.val() || {})
    }, reportDbError)
    return () => { unsubGame(); unsubPlayers() }
  }, [activeSessionId, reportDbError])

  // A player who is waiting but isn't registered in the current session (a new
  // session started, or a returning phone from an earlier one) re-enters the
  // name flow instead of sitting unregistered in the waiting room.
  useEffect(() => {
    if (userType === 'player' && playerName && gameState.status === 'waiting' && !players[playerId]) {
      setPlayerName('')
      setRulesAcknowledged(false)
      store.del(STORE_NAME)
    }
  }, [players, gameState.status, userType, playerName, playerId])

  // Question change → show the previous question's reveal to players who answered
  useEffect(() => {
    if (gameState.currentQuestion !== prevQuestion.current) {
      if (prevQuestion.current >= 0 && userTypeRef.current === 'player') {
        const prevAns = playersRef.current[playerId]?.answers?.[prevQuestion.current]
        // Firebase drops null fields, so a timed-out answer comes back with `answer` missing
        if (prevAns && prevAns.answer != null) {
          setRevealData({
            questionIdx: prevQuestion.current,
            answer:      prevAns.answer,
            score:       prevAns.score || 0,
            isCorrect:   prevAns.answer === questions[prevQuestion.current].correct
          })
          if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current)
          revealTimeoutRef.current = setTimeout(() => {
            setRevealData(null)
            revealTimeoutRef.current = null
          }, 2800)
        }
      }
      prevQuestion.current = gameState.currentQuestion
      setAnswerLocked(false)
      setLockedAnswer(null)
    }
  }, [gameState.currentQuestion, playerId])

  useEffect(() => {
    if (gameState.status !== 'question') {
      setRevealData(null)
      if (revealTimeoutRef.current) { clearTimeout(revealTimeoutRef.current); revealTimeoutRef.current = null }
    }
  }, [gameState.status])

  // ── Player handlers ────────────────────────────────

  const handlePlayerJoin = async (name) => {
    if (!activeSessionId || gameState.status === 'leaderboard') return
    setPlayerName(name)
    store.set(STORE_NAME, name)
    try {
      await set(dbRef(`sessions/${activeSessionId}/players/${playerId}`), { name, totalScore: 0, answers: {} })
    } catch (e) { reportDbError(e) }
  }

  // `answer` is the canonical letter (A = options[0] …), whatever slot it was shown in
  const handleAnswer = async (answer) => {
    if (answerLocked || !activeSessionId) return
    setAnswerLocked(true)
    setLockedAnswer(answer)

    const q       = questions[gameState.currentQuestion]
    const correct = answer === q.correct
    const elapsed = (Date.now() - gameState.questionStartTime) / 1000
    // +5 if correct within 15s, +3 if correct after 15s, 0 if wrong
    const score = correct ? (elapsed <= 15 ? 5 : 3) : 0

    const existingAnswers = playersRef.current[playerId]?.answers || {}
    const newAnswers      = { ...existingAnswers, [gameState.currentQuestion]: { answer, timestamp: Date.now(), score } }
    const newTotal        = Object.values(newAnswers).reduce((s, a) => s + (a.score || 0), 0)

    try {
      await update(dbRef(`sessions/${activeSessionId}/players/${playerId}`), {
        [`answers/${gameState.currentQuestion}`]: { answer, timestamp: Date.now(), score },
        totalScore: newTotal
      })
    } catch (e) { reportDbError(e) }
  }

  const handleTimeout = useCallback(async () => {
    if (answerLocked || !activeSessionId) return
    setAnswerLocked(true)

    const qIdx            = gameState.currentQuestion
    const existingAnswers = playersRef.current[playerId]?.answers || {}
    if (existingAnswers[qIdx]) return

    const newAnswers = { ...existingAnswers, [qIdx]: { answer: null, timestamp: Date.now(), score: -1 } }
    const newTotal   = Object.values(newAnswers).reduce((s, a) => s + (a.score || 0), 0)

    try {
      await update(dbRef(`sessions/${activeSessionId}/players/${playerId}`), {
        [`answers/${qIdx}`]: { answer: null, timestamp: Date.now(), score: -1 },
        totalScore: newTotal
      })
    } catch (e) { reportDbError(e) }
  }, [answerLocked, activeSessionId, gameState.currentQuestion, playerId, reportDbError])

  // ── Admin game handlers ────────────────────────────

  const handleStartGame = async () => {
    if (!activeSessionId) return
    try {
      await update(dbRef(`sessions/${activeSessionId}/meta`), { status: 'question', currentQuestion: 0, questionStartTime: Date.now() })
    } catch (e) { reportDbError(e) }
  }

  const handleNextQuestion = async () => {
    if (!activeSessionId) return
    const next = gameState.currentQuestion + 1
    try {
      if (next >= questions.length) {
        await update(dbRef(`sessions/${activeSessionId}/meta`), { status: 'leaderboard' })
      } else {
        await update(dbRef(`sessions/${activeSessionId}/meta`), { currentQuestion: next, questionStartTime: Date.now() })
      }
    } catch (e) { reportDbError(e) }
  }

  const handleShowLeaderboard = async () => {
    if (!activeSessionId) return
    try {
      await update(dbRef(`sessions/${activeSessionId}/meta`), { status: 'leaderboard' })
    } catch (e) { reportDbError(e) }
  }

  // ── Session management handlers ────────────────────

  const removeUnsavedSessions = () => {
    Object.entries(allSessions).forEach(([id, s]) => {
      if (!s.saved) remove(dbRef(`sessions/${id}`)).catch(reportDbError)
    })
  }

  const handleNewGame = async (customName) => {
    removeUnsavedSessions()
    const sessionId = Date.now().toString()
    try {
      await set(dbRef(`sessions/${sessionId}`), {
        meta:    { name: customName || genSessionName(), status: 'waiting', currentQuestion: 0, questionStartTime: 0, createdAt: Date.now(), saved: false },
        players: {}
      })
      await set(dbRef('activeSessionId'), sessionId)
      setAdminView('managing')
    } catch (e) { reportDbError(e) }
  }

  const handleSaveSession = async () => {
    if (!activeSessionId) return
    try {
      await update(dbRef(`sessions/${activeSessionId}/meta`), { saved: true })
      await remove(dbRef('activeSessionId'))
      setAdminView('sessions')
    } catch (e) { reportDbError(e) }
  }

  const handleAdminLeaveLeaderboard = async () => {
    try { await remove(dbRef('activeSessionId')) } catch (e) { reportDbError(e) }
    setAdminView('sessions')
  }

  const handleContinueSession = async (sessionId) => {
    try {
      await set(dbRef('activeSessionId'), sessionId)
      setAdminView('managing')
    } catch (e) { reportDbError(e) }
  }

  const handleRerunSession = async (sessionId) => {
    removeUnsavedSessions()
    const newSessionId = Date.now().toString()
    const baseName     = (allSessions[sessionId]?.name || 'Quiz').replace(/ \(Rerun.*\)$/, '')
    try {
      await set(dbRef(`sessions/${newSessionId}`), {
        meta:    { name: `${baseName} (Rerun)`, status: 'waiting', currentQuestion: 0, questionStartTime: 0, createdAt: Date.now(), saved: false },
        players: {}
      })
      await set(dbRef('activeSessionId'), newSessionId)
      setAdminView('managing')
    } catch (e) { reportDbError(e) }
  }

  const handleDeleteSession = async (sessionId) => {
    try {
      await remove(dbRef(`sessions/${sessionId}`))
      if (activeSessionId === sessionId) await remove(dbRef('activeSessionId'))
    } catch (e) { reportDbError(e) }
  }

  const handleAdminLogin = (pwd) => {
    if (pwd === ADMIN_PASSWORD) { setAdminAuth(true); return true }
    return false
  }

  // ── Screen key ─────────────────────────────────────
  const getScreenKey = () => {
    if (!userType) return 'landing'
    if (userType === 'admin') {
      if (!adminAuth)                      return 'admin-login'
      if (adminView === 'sessions')        return 'admin-sessions'
      if (gameState.status === 'waiting')  return 'admin-lobby'
      if (gameState.status === 'question') return `admin-q-${gameState.currentQuestion}`
      return 'admin-leaderboard'
    }
    if (userType === 'player') {
      if (!rulesAcknowledged && !playerName)                        return 'player-rules'
      if (!playerName)                                               return 'player-join'
      if (!activeSessionId || gameState.status === 'waiting')       return 'player-waiting'
      if (gameState.status === 'leaderboard' && !players[playerId]) return 'player-waiting-post'
      if (gameState.status === 'leaderboard')                       return 'leaderboard'
      if (revealData)                                                return `reveal-${revealData.questionIdx}`
      if (gameState.status === 'question')                          return `player-q-${gameState.currentQuestion}`
      return 'player-waiting'
    }
    return 'landing'
  }

  // ── Render ─────────────────────────────────────────
  const renderScreen = () => {
    if (!userType) return <Landing onJoinAsPlayer={() => setUserType('player')} onAdminLogin={() => setUserType('admin')} />

    if (userType === 'admin') {
      if (!adminAuth) return <AdminLogin onLogin={handleAdminLogin} onBack={() => setUserType(null)} />

      if (adminView === 'sessions') return (
        <AdminSessions
          sessions={allSessions}
          activeSessionId={activeSessionId}
          onNewGame={handleNewGame}
          onContinue={handleContinueSession}
          onRerun={handleRerunSession}
          onDelete={handleDeleteSession}
        />
      )

      if (gameState.status === 'waiting') return (
        <AdminLobby
          players={players}
          onStartGame={handleStartGame}
          sessionName={allSessions[activeSessionId]?.name || ''}
          onBackToSessions={() => setAdminView('sessions')}
        />
      )
      if (gameState.status === 'question') return (
        <AdminControl
          gameState={gameState}
          players={players}
          onNextQuestion={handleNextQuestion}
          onShowLeaderboard={handleShowLeaderboard}
          isLastQuestion={gameState.currentQuestion === questions.length - 1}
          onBackToSessions={() => setAdminView('sessions')}
        />
      )
      return <Leaderboard players={players} isAdmin onPlayAgain={handleAdminLeaveLeaderboard} onSaveSession={handleSaveSession} sessionSaved={allSessions[activeSessionId]?.saved} />
    }

    if (userType === 'player') {
      if (!rulesAcknowledged && !playerName) return <RulesScreen onReady={() => setRulesAcknowledged(true)} />
      if (!playerName) return <PlayerJoin onJoin={handlePlayerJoin} onBack={() => { setUserType(null); setRulesAcknowledged(false) }} noSession={!activeSessionId || gameState.status === 'leaderboard'} />

      if (!activeSessionId || gameState.status === 'waiting') return <WaitingRoom playerName={playerName} players={players} />

      if (gameState.status === 'leaderboard') {
        // Only players who took part in this game see its results
        if (players[playerId]) return <Leaderboard players={players} isAdmin={false} playerId={playerId} />
        return <WaitingRoom playerName={playerName} players={{}} />
      }

      if (gameState.status === 'question') {
        if (revealData) return <AnswerReveal data={revealData} playerId={playerId} />
        const existingAnswer = players[playerId]?.answers?.[gameState.currentQuestion]
        const isLocked       = answerLocked || !!existingAnswer
        if (isLocked) return <AnswerLocked answer={lockedAnswer || existingAnswer?.answer} currentQuestion={gameState.currentQuestion} playerId={playerId} />
        return <QuestionScreen gameState={gameState} playerId={playerId} onAnswer={handleAnswer} onTimeout={handleTimeout} />
      }

      return <WaitingRoom playerName={playerName} players={players} />
    }

    return <Landing onJoinAsPlayer={() => setUserType('player')} onAdminLogin={() => setUserType('admin')} />
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={getScreenKey()}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ minHeight: '100vh' }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {dbError && (
        <div role="alert" style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          background: T.alert, color: '#FFFFFF', padding: '10px 48px 10px 16px',
          fontSize: '0.86rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.4,
          boxShadow: '0 4px 16px rgba(0,0,0,0.35)'
        }}>
          ⚠ {dbError}
          <button onClick={() => setDbError(null)} aria-label="Dismiss" style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '1.3rem', lineHeight: 1, cursor: 'pointer', padding: 6
          }}>×</button>
        </div>
      )}
    </>
  )
}
