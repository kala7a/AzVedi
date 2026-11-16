import { useEffect, useRef, useState } from 'react'

const HOLD_MS = 1500
const HINT_MS = 2500
const RING = 2 * Math.PI * 17

interface Props {
  onExit: () => void
}

/**
 * The way out of a session, for a parent. It has to be held down: a child
 * pressing everything on the screen taps it and nothing happens, bar a hint
 * for the adult reading over their shoulder. The ring fills while it is held,
 * so it is plain that something is under way and how long is left.
 */
export default function HoldToExitButton({ onExit }: Props) {
  const [holding, setHolding] = useState(false)
  const [hint, setHint] = useState(false)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current)
      if (hintTimer.current) clearTimeout(hintTimer.current)
    },
    [],
  )

  function start() {
    if (holdTimer.current) return
    setHolding(true)
    setHint(false)
    holdTimer.current = setTimeout(onExit, HOLD_MS)
  }

  function cancel() {
    if (!holdTimer.current) return
    clearTimeout(holdTimer.current)
    holdTimer.current = null
    setHolding(false)
    setHint(true)
    if (hintTimer.current) clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => setHint(false), HINT_MS)
  }

  return (
    <div className="relative shrink-0">
      <button
        aria-label="Изход — задръж, за да излезеш"
        className="relative flex h-9 w-9 select-none items-center justify-center rounded-full bg-white/60 text-base font-bold text-violet-400"
        style={{ touchAction: 'none', WebkitTouchCallout: 'none' }}
        onPointerDown={(e) => {
          e.preventDefault()
          start()
        }}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (!e.repeat && (e.key === 'Enter' || e.key === ' ')) start()
        }}
        onKeyUp={cancel}
        onBlur={cancel}
      >
        ✕
        <svg viewBox="0 0 36 36" className="pointer-events-none absolute inset-0 -rotate-90" aria-hidden="true">
          <circle
            cx="18"
            cy="18"
            r="17"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={holding ? 0 : RING}
            style={{ transition: holding ? `stroke-dashoffset ${HOLD_MS}ms linear` : 'none' }}
          />
        </svg>
      </button>
      {hint && (
        <p className="animate-pop absolute left-0 top-full z-20 mt-2 whitespace-nowrap rounded-xl bg-violet-700 px-3 py-1.5 text-sm font-semibold text-white shadow-lg">
          Задръж, за да излезеш
        </p>
      )}
    </div>
  )
}
