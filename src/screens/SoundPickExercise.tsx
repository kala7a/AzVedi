import { useState, type ReactNode } from 'react'
import { useSpeech } from '../hooks/useSpeech'
import { useSoundEffects } from '../hooks/useSoundEffects'
import KidButton from '../components/KidButton'
import SpeakerIcon from '../components/SpeakerIcon'

export interface SoundOption {
  key: string
  /** What the button says when tapped. */
  phrase: string
}

interface Props {
  title: string
  /** The written letter, syllable or word the child is finding the sound of. */
  children: ReactNode
  options: SoundOption[]
  /** `key` of the option that reads what is shown. */
  answer: string
  onComplete: (correctFirstTry: boolean) => void
}

// The buttons all open the same way ("Буквата …") and carry the same speaker, so colour is
// what tells them apart — "the blue one" is something a child can hold on to
// while listening to the next.
const BUTTON_COLORS = [
  'bg-sky-400 text-sky-950',
  'bg-amber-300 text-amber-950',
  'bg-pink-400 text-pink-950',
  'bg-lime-400 text-lime-950',
]

/**
 * Shows something written and a row of sound buttons. Tapping a button says
 * its phrase and selects it; „Готово“ checks the selected one.
 */
export default function SoundPickExercise({ title, children, options, answer, onComplete }: Props) {
  const { speak, speaking, supported } = useSpeech()
  const { playCorrect, playWrong } = useSoundEffects()
  const [selected, setSelected] = useState<string | null>(null)
  const [playing, setPlaying] = useState<string | null>(null)
  const [picked, setPicked] = useState(false)
  const [wrongPicks, setWrongPicks] = useState<Set<string>>(new Set())
  const [shakeKey, setShakeKey] = useState<string | null>(null)

  function handleListen(opt: SoundOption) {
    if (picked) return
    setSelected(opt.key)
    setPlaying(opt.key)
    speak(opt.phrase)
  }

  function handleDone() {
    if (picked || !selected) return
    if (selected === answer) {
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
      <p className="text-center text-lg font-bold text-violet-800">{title}</p>

      <div
        className={`flex h-36 min-w-36 max-w-full shrink-0 items-center justify-center rounded-3xl bg-white px-5 text-8xl font-extrabold text-violet-700 shadow-lg ${
          picked ? 'animate-pop ring-8 ring-emerald-400' : ''
        }`}
      >
        {children}
      </div>

      {/* Three sit in one row; in two columns the third would hang alone. */}
      <div className={`grid w-full max-w-xs gap-4 ${options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {options.map((opt, i) => {
          const isWrong = wrongPicks.has(opt.key)
          const isSelected = selected === opt.key
          const isPlaying = speaking && playing === opt.key
          const color = picked && isSelected ? 'bg-emerald-400 text-emerald-950' : BUTTON_COLORS[i % BUTTON_COLORS.length]
          return (
            <KidButton
              key={opt.key}
              onPress={() => handleListen(opt)}
              disabled={picked || isWrong}
              aria-label={`Чуй вариант ${i + 1}`}
              aria-pressed={isSelected}
              className={`flex h-24 items-center justify-center rounded-3xl shadow-md transition active:scale-95 ${color} ${
                isWrong || (picked && !isSelected) ? 'opacity-30' : ''
              } ${isSelected ? 'scale-105 ring-4 ring-violet-600' : ''} ${shakeKey === opt.key ? 'animate-shake' : ''}`}
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
