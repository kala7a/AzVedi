import { useEffect } from 'react'
import KidButton from '../components/KidButton'
import StarRing, { STAR_START_MS, STAR_STEP_MS } from '../components/StarRing'
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
  const { speak } = useSpeech()
  const phrase = buildResultPhrase(correct, total)

  useEffect(() => {
    // Once the last star has filled, so the count lands as it's said.
    const fillMs = correct > 0 ? STAR_START_MS + (correct - 1) * STAR_STEP_MS : 0
    const t = setTimeout(() => speak(phrase), fillMs + 600)
    return () => {
      clearTimeout(t)
      // Don't let it carry on over the home screen or the next game.
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrase])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-gradient-to-b from-emerald-400 via-teal-400 to-sky-400 px-6 py-6 text-center">
      {/* Sized by the screen's height as well as its width, so a short phone
          still fits both buttons without scrolling. */}
      <div className="relative aspect-square w-[min(18rem,40dvh)] max-w-full shrink-0">
        <StarRing earned={correct} total={total} />
        <div className="animate-pop absolute inset-0 flex items-center justify-center text-8xl">🏆</div>
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
