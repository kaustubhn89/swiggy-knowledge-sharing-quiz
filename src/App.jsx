import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ref, onValue, set, update, remove } from 'firebase/database'
import { db } from './firebase'
import { questions } from './questions'
import Landing from './components/Landing'
import PlayerJoin from './components/PlayerJoin'
import WaitingRoom from './components/WaitingRoom'
import QuestionScreen from './components/QuestionScreen'
import AnswerReveal from './components/AnswerReveal'
import AnswerLocked from './components/AnswerLocked'
import Leaderboard from './components/Leaderboard'
import AdminLogin from './components/AdminLogin'
import AdminLobby from './components/AdminLobby'
import AdminControl from './components/AdminControl'

const ADMIN_PASSWORD = 'growisto@2026'

function genId() {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36)
}

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -18, transition: { duration: 0.2, ease: 'easeIn' } }
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
  const [revealData, setRevealData] = useState(null)

  const prevQuestion = useRef(-1)
  const revealTimeoutRef = useRef(null)
  const playersRef = useRef(players)
  const userTypeRef = useRef(userType)
  playersRef.current = players
  userTypeRef.current = userType

  // Firebase listeners
  useEffect(() => {
    const unsubGame = onValue(ref(db, 'game'), snap => {
      setGameState(snap.val() || { status: 'waiting', currentQuestion: 0, questionStartTime: 0 })
    })
    const unsubPlayers = onValue(ref(db, 'players'), snap => {
      setPlayers(snap.val() || {})
    })
    return () => { unsubGame(); unsubPlayers() }
  }, [])

  // Detect Play Again reset
  useEffect(() => {
    if (userType === 'player' && playerName && gameState.status === 'waiting' && Object.keys(players).length === 0) {
      setPlayerName('')
      localStorage.removeItem('sqPlayerName')
    }
  }, [players, gameState.status, userType, playerName])

  // Question change → show answer reveal for players
  useEffect(() => {
    if (gameState.currentQuestion !== prevQuestion.current) {
      if (prevQuestion.current >= 0 && userTypeRef.current === 'player') {
        const prevAns = playersRef.current[playerId]?.answers?.[prevQuestion.current]
        if (prevAns) {
          setRevealData({
            questionIdx: prevQuestion.current,
            answer: prevAns.answer,
            score: prevAns.score || 0,
            isCorrect: prevAns.answer === questions[prevQuestion.current].correct
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

  // Clear reveal when game leaves question state
  useEffect(() => {
    if (gameState.status !== 'question') {
      setRevealData(null)
      if (revealTimeoutRef.current) { clearTimeout(revealTimeoutRef.current); revealTimeoutRef.current = null }
    }
  }, [gameState.status])

  // ── Handlers ──────────────────────────────────────

  const handlePlayerJoin = async (name) => {
    setPlayerName(name)
    localStorage.setItem('sqPlayerName', name)
    await set(ref(db, `players/${playerId}`), { name, totalScore: 0, answers: {} })
  }

  const handleAnswer = async (answer, timeRemaining) => {
    if (answerLocked) return
    setAnswerLocked(true)
    setLockedAnswer(answer)

    const q = questions[gameState.currentQuestion]
    const correct = answer === q.correct
    const score = correct ? 3 : -1

    const existingAnswers = playersRef.current[playerId]?.answers || {}
    const newAnswers = { ...existingAnswers, [gameState.currentQuestion]: { answer, timestamp: Date.now(), score } }
    const newTotal = Object.values(newAnswers).reduce((s, a) => s + (a.score || 0), 0)

    await update(ref(db, `players/${playerId}`), {
      [`answers/${gameState.currentQuestion}`]: { answer, timestamp: Date.now(), score },
      totalScore: newTotal
    })
  }

  const handleStartGame = async () => {
    await set(ref(db, 'game'), { status: 'question', currentQuestion: 0, questionStartTime: Date.now() })
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
    setRevealData(null)
    prevQuestion.current = -1
  }

  const handleAdminLogin = (pwd) => {
    if (pwd === ADMIN_PASSWORD) { setAdminAuth(true); return true }
    return false
  }

  // ── Compute screen key for AnimatePresence ─────────
  const getScreenKey = () => {
    if (!userType) return 'landing'
    if (userType === 'admin') {
      if (!adminAuth) return 'admin-login'
      if (gameState.status === 'waiting') return 'admin-lobby'
      if (gameState.status === 'question') return `admin-q-${gameState.currentQuestion}`
      return 'admin-leaderboard'
    }
    if (userType === 'player') {
      if (!playerName) return 'player-join'
      if (gameState.status === 'waiting') return 'player-waiting'
      if (revealData) return `reveal-${revealData.questionIdx}`
      if (gameState.status === 'question') return `player-q-${gameState.currentQuestion}`
      return 'leaderboard'
    }
    return 'landing'
  }

  // ── Render current screen content ──────────────────
  const renderScreen = () => {
    if (!userType) return <Landing onJoinAsPlayer={() => setUserType('player')} onAdminLogin={() => setUserType('admin')} />

    if (userType === 'admin') {
      if (!adminAuth) return <AdminLogin onLogin={handleAdminLogin} onBack={() => setUserType(null)} />
      if (gameState.status === 'waiting') return <AdminLobby players={players} onStartGame={handleStartGame} />
      if (gameState.status === 'question') return (
        <AdminControl
          gameState={gameState}
          players={players}
          onNextQuestion={handleNextQuestion}
          onShowLeaderboard={handleShowLeaderboard}
          isLastQuestion={gameState.currentQuestion === questions.length - 1}
        />
      )
      return <Leaderboard players={players} isAdmin onPlayAgain={handlePlayAgain} />
    }

    if (userType === 'player') {
      if (!playerName) return <PlayerJoin onJoin={handlePlayerJoin} onBack={() => setUserType(null)} />

      if (gameState.status === 'waiting') return <WaitingRoom playerName={playerName} players={players} />

      if (gameState.status === 'question') {
        if (revealData) return <AnswerReveal data={revealData} />

        const existingAnswer = players[playerId]?.answers?.[gameState.currentQuestion]
        const isLocked = answerLocked || !!existingAnswer
        if (isLocked) {
          return <AnswerLocked answer={lockedAnswer || existingAnswer?.answer} currentQuestion={gameState.currentQuestion} />
        }
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
