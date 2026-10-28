import { useState } from 'react'
import { glyphFor, type BgLetter } from '../data/letters'
import { buildNamePhrase } from '../data/spokenPhrase'
import { useSpeech } from '../hooks/useSpeech'
import { useSoundEffects } from '../hooks/useSoundEffects'
import KidButton from '../components/KidButton'
import CursiveGlyph from '../components/CursiveGlyph'
import SpeakerIcon from '../components/SpeakerIcon'

interface Props {
  letter: BgLetter
  options: BgLetter[]
  cursive: boolean
  lowercase: boolean
  onComplete: (correctFirstTry: boolean) => void
}

// The buttons all say "Буквата …" and carry the same speaker, so colour is
// what tells them apart — "the blue one" is something a child can hold on to
// while listening to the next.
const BUTTON_COLORS = [
  'bg-sky-400 text-sky-950',
  'bg-amber-300 text-amber-950',
  'bg-pink-400 text-pink-950',
  'bg-lime-400 text-lime-950',
]

export default function NameExercise({ letter, options, cursive, lowercase, onComplete }: Props) {
  const { speak, speaking, supported } = useSpeech()
  const { playCorrect, playWrong } = useSoundEffects()
  const [selected, setSelected] = useState<string | null>(null)
  const [playing, setPlaying] = useState<string | null>(null)
  const [picked, setPicked] = useState(false)
  const [wrongPicks, setWrongPicks] = useState<Set<string>>(new Set())
  const [shakeKey, setShakeKey] = useState<string | null>(null)

  const glyph = glyphFor(letter, lowercase)

  function handleListen(opt: BgLetter) {
    if (picked) return
    setSelected(opt.letter)
    setPlaying(opt.letter)
    speak(buildNamePhrase(opt))
  }

  function handleDone() {
    if (picked || !selected) return
    if (selected === letter.letter) {
      setPicked(true)
      playCorrect()
      setTimeout(() => onComplete(wrongPicks.size === 0), 1200)
    } else {
      playWrong()
      setWrongPicks((prev) => new Set(prev).add(selected))
      setShakeKey(selected)
      setSelected(null)
      setTimeout(() => setShakeKey(null), 400)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-5 px-6 py-4">
      <p className="text-center text-lg font-bold text-violet-800">Как се казва тази буква? 🤔</p>

      <div
        className={`flex h-36 w-36 shrink-0 items-center justify-center rounded-3xl bg-white text-8xl font-extrabold text-violet-700 shadow-lg ${
          picked ? 'animate-pop ring-8 ring-emerald-400' : ''
        }`}
      >
        {cursive ? <CursiveGlyph glyph={glyph} className="h-3/4" /> : glyph}
      </div>

      <div className="grid w-full max-w-xs grid-cols-2 gap-4">
        {options.map((opt, i) => {
          const isWrong = wrongPicks.has(opt.letter)
          const isSelected = selected === opt.letter
          const isPlaying = speaking && playing === opt.letter
          const color = picked && isSelected ? 'bg-emerald-400 text-emerald-950' : BUTTON_COLORS[i % BUTTON_COLORS.length]
          return (
            <KidButton
              key={opt.letter}
              onPress={() => handleListen(opt)}
              disabled={picked || isWrong}
              aria-label={`Чуй вариант ${i + 1}`}
              aria-pressed={isSelected}
              className={`flex h-24 items-center justify-center rounded-3xl shadow-md transition active:scale-95 ${color} ${
                isWrong || (picked && !isSelected) ? 'opacity-30' : ''
              } ${isSelected ? 'scale-105 ring-4 ring-violet-600' : ''} ${shakeKey === opt.letter ? 'animate-shake' : ''}`}
            >
              <SpeakerIcon playing={isPlaying} className="h-14 w-14" />
            </KidButton>
          )
        })}
      </div>

      {!supported && (
        <p className="rounded-2xl bg-white/90 px-4 py-2 text-center text-sm font-semibold text-rose-600">
          Без звук тази игра не става 🔇 — избери който и да е и натисни „Готово“.
        </p>
      )}

      {picked ? (
        <p className="animate-pop py-2 text-3xl font-extrabold text-emerald-600">Точно така! 🎉</p>
      ) : (
        <KidButton
          onPress={handleDone}
          disabled={!selected}
          className="w-full max-w-xs shrink-0 rounded-full bg-emerald-400 px-8 py-3 text-xl font-extrabold text-emerald-900 shadow-[0_6px_0_0_rgba(6,95,70,0.4)] transition active:translate-y-1 active:shadow-[0_2px_0_0_rgba(6,95,70,0.4)] disabled:opacity-40 disabled:active:translate-y-0"
        >
          Готово ✓
        </KidButton>
      )}
    </div>
  )
}
