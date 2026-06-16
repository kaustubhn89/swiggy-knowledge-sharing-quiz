import { useState, useEffect, useRef } from 'react'
import { ref, onValue, set, update, remove } from 'firebase/database'
import { db } from './firebase'
import { questions } from './questions'
import Landing from './components/Landing'
import PlayerJoin from './components/PlayerJoin'
import WaitingRoom from './components/WaitingRoom'
import QuestionScreen from './components/QuestionScreen'
import AnswerLocked from './components/AnswerLocked'
import Leaderboard from './components/Leaderboard'
import AdminLogin from './components/AdminLogin'
import AdminLobby from './components/AdminLobby'
import AdminControl from './components/AdminControl'

const ADMIN_PASSWORD = 'growisto@swiggy2026'

function genId() {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36)
}

export default function App() {
  const [userType, setUserType] = useState(null)
  const [adminAuth, setAdminAuth] = useState(false)
  const [playerId] = useState(() => {
    let id = localStorage.getItem('sqPlayerId')
    if (!id) { id = genId(); localStorage.setItem('sqPlayerId', id) }
    return id
  })
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('sqPlayerName') || '')
  const [gameState, setGameState] = useState({ status: 'waiting', currentQuestion: 0, questionStartTime: 0 })
  const [players, setPlayers] = useState({})
  const [answerLocked, setAnswerLocked] = useState(false)
  const [lockedAnswer, setLockedAnswer] = useState(null)
  const prevQuestion = useRef(-1)

  // Firebase listeners
  useEffect(() => {
    const unsubGame = onValue(ref(db, 'game'), snap => {
      const data = snap.val()
      setGameState(data || { status: 'waiting', currentQuestion: 0, questionStartTime: 0 })
    })
    const unsubPlayers = onValue(ref(db, 'players'), snap => {
      setPlayers(snap.val() || {})
    })
    return () => { unsubGame(); unsubPlayers() }
  }, [])

  // Reset answer state when question changes
  useEffect(() => {
    if (gameState.currentQuestion !== prevQuestion.current) {
      prevQuestion.current = gameState.currentQuestion
      setAnswerLocked(false)
      setLockedAnswer(null)
    }
  }, [gameState.currentQuestion])

  // Detect Play Again reset: if player data gone and game reset to waiting
  useEffect(() => {
    if (
      userType === 'player' &&
      playerName &&
      gameState.status === 'waiting' &&
      Object.keys(players).length === 0
    ) {
      setPlayerName('')
      localStorage.removeItem('sqPlayerName')
    }
  }, [players, gameState.status, userType, playerName])

  // ── Handlers ──────────────────────────────────

  const handlePlayerJoin = async (name) => {
    setPlayerName(name)
    localStorage.setItem('sqPlayerName', name)
    await set(ref(db, `players/${playerId}`), {
      name,
      totalScore: 0,
      answers: {}
    })
  }

  const handleAnswer = async (answer, timeRemaining) => {
    if (answerLocked) return
    setAnswerLocked(true)
    setLockedAnswer(answer)

    const q = questions[gameState.currentQuestion]
    const correct = answer === q.correct
    const speedBonus = correct ? Math.round((timeRemaining / q.time) * 500) : 0
    const score = correct ? 1000 + speedBonus : 0

    const existingAnswers = players[playerId]?.answers || {}
    const newAnswers = {
      ...existingAnswers,
      [gameState.currentQuestion]: { answer, timestamp: Date.now(), score, speedBonus }
    }
    const newTotal = Object.values(newAnswers).reduce((s, a) => s + (a.score || 0), 0)

    await update(ref(db, `players/${playerId}`), {
      [`answers/${gameState.currentQuestion}`]: { answer, timestamp: Date.now(), score, speedBonus },
      totalScore: newTotal
    })
  }

  const handleStartGame = async () => {
    await set(ref(db, 'game'), {
      status: 'question',
      currentQuestion: 0,
      questionStartTime: Date.now()
    })
  }

  const handleNextQuestion = async () => {
    const next = gameState.currentQuestion + 1
    if (next >= questions.length) {
      await update(ref(db, 'game'), { status: 'leaderboard' })
    } else {
      await update(ref(db, 'game'), { currentQuestion: next, questionStartTime: Date.now() })
    }
  }

  const handleShowLeaderboard = async () => {
    await update(ref(db, 'game'), { status: 'leaderboard' })
  }

  const handlePlayAgain = async () => {
    await remove(ref(db, 'players'))
    await set(ref(db, 'game'), { status: 'waiting', currentQuestion: 0, questionStartTime: 0 })
    setAnswerLocked(false)
    setLockedAnswer(null)
  }

  const handleAdminLogin = (pwd) => {
    if (pwd === ADMIN_PASSWORD) { setAdminAuth(true); return true }
    return false
  }

  // ── Render ─────────────────────────────────────

  if (!userType) {
    return (
      <Landing
        onJoinAsPlayer={() => setUserType('player')}
        onAdminLogin={() => setUserType('admin')}
      />
    )
  }

  // Admin flow
  if (userType === 'admin') {
    if (!adminAuth) {
      return <AdminLogin onLogin={handleAdminLogin} onBack={() => setUserType(null)} />
    }
    if (gameState.status === 'waiting') {
      return <AdminLobby players={players} onStartGame={handleStartGame} />
    }
    if (gameState.status === 'question') {
      return (
        <AdminControl
          gameState={gameState}
          players={players}
          onNextQuestion={handleNextQuestion}
          onShowLeaderboard={handleShowLeaderboard}
          isLastQuestion={gameState.currentQuestion === questions.length - 1}
        />
      )
    }
    if (gameState.status === 'leaderboard') {
      return <Leaderboard players={players} isAdmin onPlayAgain={handlePlayAgain} />
    }
  }

  // Player flow
  if (userType === 'player') {
    if (!playerName) {
      return <PlayerJoin onJoin={handlePlayerJoin} onBack={() => setUserType(null)} />
    }

    if (gameState.status === 'waiting') {
      return <WaitingRoom playerName={playerName} players={players} />
    }

    if (gameState.status === 'question') {
      const existingAnswer = players[playerId]?.answers?.[gameState.currentQuestion]
      const isLocked = answerLocked || !!existingAnswer

      if (isLocked) {
        const shownAnswer = lockedAnswer || existingAnswer?.answer || null
        return (
          <AnswerLocked
            answer={shownAnswer}
            currentQuestion={gameState.currentQuestion}
            showResult={false}
          />
        )
      }

      return (
        <QuestionScreen
          gameState={gameState}
          onAnswer={handleAnswer}
          answerLocked={false}
        />
      )
    }

    if (gameState.status === 'leaderboard') {
      return <Leaderboard players={players} isAdmin={false} playerId={playerId} />
    }
  }

  return <Landing onJoinAsPlayer={() => setUserType('player')} onAdminLogin={() => setUserType('admin')} />
}
