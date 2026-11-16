import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import GameSession from './screens/GameSession'
import ResultsScreen from './screens/ResultsScreen'
import VersionBadge from './components/VersionBadge'
import { useSpeech } from './hooks/useSpeech'
import type { Category, Difficulty } from './types'

type Screen =
  | { name: 'home' }
  | { name: 'session'; category: Category; difficulty: Difficulty }
  | { name: 'results'; correct: number; total: number; category: Category; difficulty: Difficulty }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  // What was last played, so going back home doesn't reset the pickers.
  const [lastPlayed, setLastPlayed] = useState<{ category: Category; difficulty: Difficulty }>({
    category: 'letters',
    difficulty: 'easy',
  })
  const { supported, hasBulgarianVoice, warmUp } = useSpeech()

  function startSession(category: Category, difficulty: Difficulty) {
    // Fired on the same tap that starts the session — the user gesture
    // both of these need, and enough head start before the first letter
    // sound is due a few hundred ms later once the round screen has
    // mounted. Fullscreen hides the browser's own toolbar (including its
    // back button) for the rest of the session; best-effort since some
    // browsers restrict or simply don't support it — a young child mashing
    // buttons shouldn't be able to exit the game by accident.
    document.documentElement.requestFullscreen?.().catch(() => {})
    warmUp()
    setLastPlayed({ category, difficulty })
    setScreen({ name: 'session', category, difficulty })
  }

  let content
  if (screen.name === 'session') {
    const { category, difficulty } = screen
    content = (
      <GameSession
        category={category}
        difficulty={difficulty}
        onFinish={(correct, total) => setScreen({ name: 'results', correct, total, category, difficulty })}
        onExit={() => setScreen({ name: 'home' })}
      />
    )
  } else if (screen.name === 'results') {
    content = (
      <ResultsScreen
        correct={screen.correct}
        total={screen.total}
        onPlayAgain={() => startSession(screen.category, screen.difficulty)}
        onHome={() => setScreen({ name: 'home' })}
      />
    )
  } else {
    content = (
      <HomeScreen
        onStart={startSession}
        initialCategory={lastPlayed.category}
        initialDifficulty={lastPlayed.difficulty}
        speechSupported={supported}
        hasBulgarianVoice={hasBulgarianVoice}
      />
    )
  }

  return (
    <>
      {content}
      <VersionBadge />
    </>
  )
}
