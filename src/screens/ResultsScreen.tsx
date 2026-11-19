import { useEffect } from 'react'
import KidButton from '../components/KidButton'
import { buildResultPhrase, gradeFor } from '../data/resultPhrase'
import { useSpeech } from '../hooks/useSpeech'

interface Props {
  correct: number
  total: number
  onPlayAgain: () => void
  onHome: () => void
}

export default function ResultsScreen({ correct, total, onPlayAgain, onHome }: Props) {
  const grade = gradeFor(correct, total)
  const { stars } = grade
  const { speak } = useSpeech()
  const phrase = buildResultPhrase(correct, total)

  useEffect(() => {
    // After the stars have popped in, so the child is looking at them.
    const t = setTimeout(() => speak(phrase), 700)
    return () => {
      clearTimeout(t)
      // Don't let it carry on over the home screen or the next game.
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrase])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-gradient-to-b from-emerald-400 via-teal-400 to-sky-400 px-6 py-10 text-center">
      <div className="animate-pop text-7xl">🏆</div>

      <div className="flex gap-2 text-6xl">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i < stars ? 'animate-pop' : 'opacity-30'} style={{ animationDelay: `${i * 0.15}s` }}>
            ⭐
          </span>
        ))}
      </div>

      <h2 className="text-3xl font-extrabold text-white drop-shadow">{grade.title} {grade.emoji}</h2>

      <p className="rounded-3xl bg-white/90 px-8 py-4 text-2xl font-bold text-teal-700 shadow-md">
        {correct} от {total} точки
      </p>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <KidButton
          onPress={onPlayAgain}
          className="rounded-full bg-yellow-300 px-8 py-4 text-2xl font-extrabold text-teal-700 shadow-[0_6px_0_0_rgba(180,120,0,0.5)] transition active:translate-y-1 active:shadow-[0_2px_0_0_rgba(180,120,0,0.5)]"
        >
          🔁 Играй пак
        </KidButton>
        <KidButton
          onPress={onHome}
          className="rounded-full bg-white/80 px-8 py-3 text-xl font-bold text-teal-700 shadow active:scale-95"
        >
          🏠 Начало
        </KidButton>
      </div>
    </div>
  )
}
