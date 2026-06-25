import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ref, onValue, set, update, remove } from 'firebase/database'
import { db } from './firebase'
import { questions } from './questions'
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

function genId() {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36)
}

function genSessionName() {
  const now = new Date()
  const d = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const t = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  return `Quiz – ${d}, ${t}`
}

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -18, transition: { duration: 0.2, ease: 'easeIn' } }
}

export default function App() {
  const [userType, setUserType]         = useState(null)
  const [adminAuth, setAdminAuth]       = useState(false)
  const [adminView, setAdminView]       = useState('sessions') // 'sessions' | 'managing'
  const [rulesAcknowledged, setRulesAcknowledged] = useState(false)

  const [playerId] = useState(() => {
    let id = localStorage.getItem('sqPlayerId')
    if (!id) { id = genId(); localStorage.setItem('sqPlayerId', id) }
    return id
  })
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('sqPlayerName') || '')

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

  // Listen to activeSessionId + all sessions
  useEffect(() => {
    const unsubActive = onValue(ref(db, 'activeSessionId'), snap => {
      setActiveSessionId(snap.val() || null)
    })
    const unsubAll = onValue(ref(db, 'sessions'), snap => {
      const data = snap.val() || {}
      const metas = {}
      Object.entries(data).forEach(([id, s]) => {
        if (s?.meta) metas[id] = { ...s.meta, playerCount: Object.keys(s.players || {}).length }
      })
      setAllSessions(metas)
    })
    return () => { unsubActive(); unsubAll() }
  }, [])

  // Listen to active session's game state + players
  useEffect(() => {
    if (!activeSessionId) {
      setGameState({ status: 'waiting', currentQuestion: 0, questionStartTime: 0 })
      setPlayers({})
      return
    }
    const unsubGame = onValue(ref(db, `sessions/${activeSessionId}/meta`), snap => {
      setGameState(snap.val() || { status: 'waiting', currentQuestion: 0, questionStartTime: 0 })
    })
    const unsubPlayers = onValue(ref(db, `sessions/${activeSessionId}/players`), snap => {
      setPlayers(snap.val() || {})
    })
    return () => { unsubGame(); unsubPlayers() }
  }, [activeSessionId])

  // Clear player name when new empty session appears
  useEffect(() => {
    if (userType === 'player' && playerName && gameState.status === 'waiting' && Object.keys(players).length === 0) {
      setPlayerName('')
      localStorage.removeItem('sqPlayerName')
    }
  }, [players, gameState.status, userType, playerName])

  // Question change → show answer reveal
  useEffect(() => {
    if (gameState.currentQuestion !== prevQuestion.current) {
      if (prevQuestion.current >= 0 && userTypeRef.current === 'player') {
        const prevAns = playersRef.current[playerId]?.answers?.[prevQuestion.current]
        if (prevAns) {
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
    if (!activeSessionId) return
    setPlayerName(name)
    localStorage.setItem('sqPlayerName', name)
    await set(ref(db, `sessions/${activeSessionId}/players/${playerId}`), { name, totalScore: 0, answers: {} })
  }

  const handleAnswer = async (answer) => {
    if (answerLocked || !activeSessionId) return
    setAnswerLocked(true)
    setLockedAnswer(answer)

    const q             = questions[gameState.currentQuestion]
    const correct       = answer === q.correct
    const elapsed       = (Date.now() - gameState.questionStartTime) / 1000
    const timeRemaining = Math.max(0, q.time - elapsed)
    // Speed-based: correct = 3–10 pts scaled by time remaining; wrong = -2
    const score = correct
      ? Math.round(10 * Math.max(0.3, timeRemaining / q.time))
      : -2

    const existingAnswers = playersRef.current[playerId]?.answers || {}
    const newAnswers      = { ...existingAnswers, [gameState.currentQuestion]: { answer, timestamp: Date.now(), score } }
    const newTotal        = Object.values(newAnswers).reduce((s, a) => s + (a.score || 0), 0)

    await update(ref(db, `sessions/${activeSessionId}/players/${playerId}`), {
      [`answers/${gameState.currentQuestion}`]: { answer, timestamp: Date.now(), score },
      totalScore: newTotal
    })
  }

  // ── Admin game handlers ────────────────────────────

  const handleStartGame = async () => {
    if (!activeSessionId) return
    await update(ref(db, `sessions/${activeSessionId}/meta`), {
      status: 'question', currentQuestion: 0, questionStartTime: Date.now()
    })
  }

  const handleNextQuestion = async () => {
    if (!activeSessionId) return
    const next = gameState.currentQuestion + 1
    if (next >= questions.length) {
      await update(ref(db, `sessions/${activeSessionId}/meta`), { status: 'leaderboard' })
    } else {
      await update(ref(db, `sessions/${activeSessionId}/meta`), { currentQuestion: next, questionStartTime: Date.now() })
    }
  }

  const handleShowLeaderboard = async () => {
    if (!activeSessionId) return
    await update(ref(db, `sessions/${activeSessionId}/meta`), { status: 'leaderboard' })
  }

  // ── Session management handlers ────────────────────

  const handleNewGame = async (customName) => {
    Object.entries(allSessions).forEach(([id, s]) => {
      if (!s.saved) remove(ref(db, `sessions/${id}`))
    })
    const sessionId = Date.now().toString()
    await set(ref(db, `sessions/${sessionId}`), {
      meta:    { name: customName || genSessionName(), status: 'waiting', currentQuestion: 0, questionStartTime: 0, createdAt: Date.now(), saved: false },
      players: {}
    })
    await set(ref(db, 'activeSessionId'), sessionId)
    setAdminView('managing')
  }

  const handleSaveSession = async () => {
    if (!activeSessionId) return
    await update(ref(db, `sessions/${activeSessionId}/meta`), { saved: true })
    setAdminView('sessions')
  }

  const handleContinueSession = async (sessionId) => {
    await set(ref(db, 'activeSessionId'), sessionId)
    setAdminView('managing')
  }

  const handleRerunSession = async (sessionId) => {
    Object.entries(allSessions).forEach(([id, s]) => {
      if (!s.saved) remove(ref(db, `sessions/${id}`))
    })
    const newSessionId = Date.now().toString()
    const baseName     = (allSessions[sessionId]?.name || 'Quiz').replace(/ \(Rerun.*\)$/, '')
    await set(ref(db, `sessions/${newSessionId}`), {
      meta:    { name: `${baseName} (Rerun)`, status: 'waiting', currentQuestion: 0, questionStartTime: 0, createdAt: Date.now(), saved: false },
      players: {}
    })
    await set(ref(db, 'activeSessionId'), newSessionId)
    setAdminView('managing')
  }

  const handleDeleteSession = async (sessionId) => {
    await remove(ref(db, `sessions/${sessionId}`))
    if (activeSessionId === sessionId) await remove(ref(db, 'activeSessionId'))
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
      if (!rulesAcknowledged && !playerName)                   return 'player-rules'
      if (!playerName)                                         return 'player-join'
      if (!activeSessionId || gameState.status === 'waiting') return 'player-waiting'
      if (revealData)                                          return `reveal-${revealData.questionIdx}`
      if (gameState.status === 'question')                     return `player-q-${gameState.currentQuestion}`
      return 'leaderboard'
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
      return <Leaderboard players={players} isAdmin onPlayAgain={() => setAdminView('sessions')} onSaveSession={handleSaveSession} sessionSaved={allSessions[activeSessionId]?.saved} />
    }

    if (userType === 'player') {
      if (!rulesAcknowledged && !playerName) return <RulesScreen onReady={() => setRulesAcknowledged(true)} />
      if (!playerName) return <PlayerJoin onJoin={handlePlayerJoin} onBack={() => { setUserType(null); setRulesAcknowledged(false) }} noSession={!activeSessionId} />

      if (!activeSessionId || gameState.status === 'waiting') return <WaitingRoom playerName={playerName} players={players} />

      if (gameState.status === 'question') {
        if (revealData) return <AnswerReveal data={revealData} />
        const existingAnswer = players[playerId]?.answers?.[gameState.currentQuestion]
        const isLocked       = answerLocked || !!existingAnswer
        if (isLocked) return <AnswerLocked answer={lockedAnswer || existingAnswer?.answer} currentQuestion={gameState.currentQuestion} />
        return <QuestionScreen gameState={gameState} onAnswer={handleAnswer} />
      }

      return <Leaderboard players={players} isAdmin={false} playerId={playerId} />
    }

    return <Landing onJoinAsPlayer={() => setUserType('player')} onAdminLogin={() => setUserType('admin')} />
  }

  return (
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
  )
}
