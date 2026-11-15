import { useMemo, useState } from 'react'
import { buildSession } from '../data/session'
import TraceExercise from './TraceExercise'
import ChoiceExercise from './ChoiceExercise'
import WordExercise from './WordExercise'
import SoundPickExercise from './SoundPickExercise'
import ReadPickExercise from './ReadPickExercise'
import CursiveGlyph from '../components/CursiveGlyph'
import Written from '../components/Written'
import { glyphFor } from '../data/letters'
import { buildNamePhrase, buildReadPhrase } from '../data/spokenPhrase'
import type { Category, Difficulty } from '../types'

interface Props {
  category: Category
  difficulty: Difficulty
  onFinish: (correct: number, total: number) => void
}

export default function GameSession({ category, difficulty, onFinish }: Props) {
  const exercises = useMemo(() => buildSession(category, difficulty), [category, difficulty])
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const exercise = exercises[index]

  function handleRoundComplete(correct: boolean) {
    const nextCorrect = correctCount + (correct ? 1 : 0)
    setCorrectCount(nextCorrect)
    if (index + 1 >= exercises.length) {
      onFinish(nextCorrect, exercises.length)
    } else {
      setIndex(index + 1)
    }
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-violet-100 to-pink-100">
      <div className="flex shrink-0 items-center gap-3 px-6 pt-4">
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/70">
          <div
            className="h-full rounded-full bg-violet-500 transition-all duration-500"
            style={{ width: `${(index / exercises.length) * 100}%` }}
          />
        </div>
        <span className="text-lg font-bold text-violet-700">
          {index + 1}/{exercises.length}
        </span>
      </div>

      <div key={index} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {exercise.type === 'trace' && (
          <TraceExercise
            letter={exercise.letter}
            cursive={exercise.cursive}
            lowercase={exercise.lowercase}
            onComplete={handleRoundComplete}
          />
        )}
        {exercise.type === 'choice' && (
          <ChoiceExercise
            letter={exercise.letter}
            options={exercise.options}
            cursive={exercise.cursive}
            lowercase={exercise.lowercase}
            onComplete={handleRoundComplete}
          />
        )}
        {exercise.type === 'word' && (
          <WordExercise
            letter={exercise.letter}
            options={exercise.options}
            cursive={exercise.cursive}
            lowercase={exercise.lowercase}
            onComplete={handleRoundComplete}
          />
        )}
        {exercise.type === 'name' && (
          <SoundPickExercise
            title="Как се казва тази буква? 🤔"
            options={exercise.options.map((opt) => ({ key: opt.letter, phrase: buildNamePhrase(opt) }))}
            answer={exercise.letter.letter}
            onComplete={handleRoundComplete}
          >
            {exercise.cursive ? (
              <CursiveGlyph glyph={glyphFor(exercise.letter, exercise.lowercase)} className="h-3/4" />
            ) : (
              glyphFor(exercise.letter, exercise.lowercase)
            )}
          </SoundPickExercise>
        )}
        {exercise.type === 'sound' && (
          <SoundPickExercise
            title={exercise.target.kind === 'syllable' ? 'Как се чете тази сричка? 🤔' : 'Как се чете тази дума? 🤔'}
            options={exercise.options.map((opt) => ({ key: opt.text, phrase: buildReadPhrase(opt) }))}
            answer={exercise.target.text}
            onComplete={handleRoundComplete}
          >
            <span className={exercise.target.kind === 'word' ? 'text-6xl' : ''}>
              <Written text={exercise.target.text} cursive={exercise.cursive} cursiveClassName="h-20 max-w-full" />
            </span>
          </SoundPickExercise>
        )}
        {(exercise.type === 'listen' || exercise.type === 'picture') && (
          <ReadPickExercise
            mode={exercise.type}
            target={exercise.target}
            options={exercise.options}
            cursive={exercise.cursive}
            onComplete={handleRoundComplete}
          />
        )}
      </div>
    </div>
  )
}
