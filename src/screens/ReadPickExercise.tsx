import { useEffect, useState } from 'react'
import { buildReadPhrase } from '../data/spokenPhrase'
import { useSpeech } from '../hooks/useSpeech'
import { useSoundEffects } from '../hooks/useSoundEffects'
import KidButton from '../components/KidButton'
import Written from '../components/Written'
import type { ReadItem } from '../types'

interface Props {
  /**
   * `listen`: the target is read aloud and the options are written out.
   * `picture`: the target is written out and the options are pictures.
   */
  mode: 'listen' | 'picture'
  target: ReadItem
  options: ReadItem[]
  cursive: boolean
  onComplete: (correctFirstTry: boolean) => void
}

function titleFor(mode: Props['mode'], target: ReadItem): string {
  if (mode === 'picture') return 'Какво пише тук? 📖'
  return target.kind === 'syllable' ? 'Коя сричка чуваш? 👂' : 'Намери думата 🔎'
}

export default function ReadPickExercise({ mode, target, options, cursive, onComplete }: Props) {
  const { speak, supported } = useSpeech()
  const { playCorrect, playWrong } = useSoundEffects()
  const [picked, setPicked] = useState<string | null>(null)
  const [wrongPicks, setWrongPicks] = useState<Set<string>>(new Set())
  const [shakeKey, setShakeKey] = useState<string | null>(null)
  const phrase = buildReadPhrase(target)
  const listen = mode === 'listen'
  // Written words are too wide to sit two to a row.
  const stacked = listen && target.kind === 'word'

  useEffect(() => {
    // A picture round is a reading test: saying the word first would turn it
    // into a listening one. It is read out once the child has got it.
    if (!listen) return
    const t = setTimeout(() => speak(phrase), 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrase, listen])

  function handlePick(opt: ReadItem) {
    if (picked) return
    if (opt.text === target.text) {
      setPicked(opt.text)
      playCorrect()
      if (!listen) setTimeout(() => speak(phrase), 500)
      setTimeout(() => onComplete(wrongPicks.size === 0), listen ? 1200 : 2000)
    } else {
      playWrong()
      setWrongPicks((prev) => new Set(prev).add(opt.text))
      setShakeKey(opt.text)
      setTimeout(() => setShakeKey(null), 400)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-5 px-6 py-4">
      <p className="text-center text-lg font-bold text-violet-800">{titleFor(mode, target)}</p>

      {listen ? (
        <KidButton
          onPress={() => speak(phrase)}
          disabled={!supported}
          className="animate-wiggle flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white text-6xl shadow-lg active:scale-95 disabled:opacity-50"
        >
          {target.emoji ?? '🔊'}
        </KidButton>
      ) : (
        <div
          className={`flex h-28 max-w-full shrink-0 items-center justify-center rounded-3xl bg-white px-6 text-6xl font-extrabold text-violet-700 shadow-lg ${
            picked ? 'animate-pop ring-8 ring-emerald-400' : ''
          }`}
        >
          <Written text={target.text} cursive={cursive} cursiveClassName="h-3/5 max-w-full" />
        </div>
      )}

      <div className={`w-full max-w-xs ${stacked ? 'flex flex-col gap-3' : 'grid grid-cols-2 gap-4'}`}>
        {options.map((opt) => {
          const isWrong = wrongPicks.has(opt.text)
          const isPicked = picked === opt.text
          return (
            <KidButton
              key={opt.text}
              onPress={() => handlePick(opt)}
              disabled={picked !== null || isWrong}
              className={`flex items-center justify-center rounded-3xl font-extrabold shadow-md transition active:scale-95 ${
                stacked ? 'h-16 px-4 text-4xl' : 'aspect-square text-6xl'
              } ${
                isPicked
                  ? 'animate-pop bg-emerald-400 text-emerald-900'
                  : isWrong
                    ? 'bg-rose-200 text-rose-400 opacity-60'
                    : 'bg-white text-violet-700 hover:bg-violet-50'
              } ${shakeKey === opt.text ? 'animate-shake' : ''}`}
            >
              {listen ? (
                <Written text={opt.text} cursive={cursive} cursiveClassName={stacked ? 'h-4/5 max-w-full' : 'h-1/2 max-w-[85%]'} />
              ) : (
                opt.emoji
              )}
            </KidButton>
          )
        })}
      </div>

      {picked && <p className="animate-pop text-3xl font-extrabold text-emerald-600">Точно така! 🎉</p>}
    </div>
  )
}
