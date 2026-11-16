import { useEffect, useRef, useState } from 'react'
import { useSpeech } from '../hooks/useSpeech'

const TEST_PHRASE = 'Здравей! Аз съм гласът на играта.'
// Long enough for a cold speech engine to get going before we call it silent.
const TEST_WAIT_MS = 3000

interface Props {
  onClose: () => void
}

/**
 * What to do when the letters aren't read aloud, for a parent. A web page
 * can't open the phone's settings itself — the browser blocks links into
 * them — so this tests the voice and spells out where to go.
 */
export default function SoundHelp({ onClose }: Props) {
  const { speak, supported } = useSpeech()
  const [result, setResult] = useState<'idle' | 'waiting' | 'started' | 'silent'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  function handleTest() {
    setResult('waiting')
    if (timer.current) clearTimeout(timer.current)
    // The browser reports whether the engine began speaking, not whether a
    // person heard it, so "started" still asks the parent to confirm.
    timer.current = setTimeout(() => setResult((r) => (r === 'waiting' ? 'silent' : r)), TEST_WAIT_MS)
    speak(TEST_PHRASE, () => setResult('started'))
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label="Помощ за звука"
        className="max-h-full w-full max-w-sm overflow-y-auto rounded-3xl bg-white p-5 text-left text-sm text-slate-700 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-extrabold text-violet-700">Няма говор? 🔈</h2>
        <p className="mt-1">
          Играта чете буквите с гласа на телефона. Ако се чува само звънчето при верен отговор, на телефона липсва
          български глас.
        </p>

        <button
          onClick={handleTest}
          disabled={!supported}
          className="mt-3 w-full rounded-full bg-violet-600 px-4 py-3 text-base font-bold text-white active:scale-95 disabled:opacity-40"
        >
          ▶ Пробвай гласа
        </button>
        {!supported && <p className="mt-2 font-semibold text-rose-600">Този браузър изобщо няма говор. Пробвай с Chrome.</p>}
        {result === 'started' && (
          <p className="mt-2 font-semibold text-emerald-600">
            Гласът тръгна. Ако не го чу, усили звука за мултимедия или следвай стъпките долу.
          </p>
        )}
        {result === 'silent' && (
          <p className="mt-2 font-semibold text-rose-600">Гласът не тръгна. Следвай стъпките долу.</p>
        )}

        <h3 className="mt-4 font-extrabold text-violet-700">На Android</h3>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>
            Отвори <b>Настройки</b> и потърси <b>„Синтез на реч“</b> (или „Текст към говор“).
          </li>
          <li>
            За предпочитана машина избери <b>„Услуги за говор от Google“</b>. На някои телефони по подразбиране е
            друга, без български.
          </li>
          <li>
            Натисни зъбчатото колело до нея → <b>„Инсталиране на гласови данни“</b> → <b>български</b> и го изтегли.
          </li>
          <li>Затвори напълно браузъра (или играта) и я отвори отново.</li>
        </ol>

        <h3 className="mt-4 font-extrabold text-violet-700">На iPhone и iPad</h3>
        <p className="mt-1">
          Настройки → Достъпност → Изговорено съдържание → Гласове → български. Провери и дали бутонът за тих режим
          отстрани не е включен.
        </p>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-full bg-slate-100 px-4 py-2.5 text-base font-bold text-slate-600 active:scale-95"
        >
          Затвори
        </button>
      </div>
    </div>
  )
}
