import { useEffect, useState } from 'react'
import { useSoundEffects } from '../hooks/useSoundEffects'

/** Time between one star filling and the next. */
export const STAR_STEP_MS = 220
/** Pause before the first star fills, while the trophy pops in. */
export const STAR_START_MS = 500

const STAR_PATH =
  'M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z'

interface Props {
  /** Stars to fill: one per round won. */
  earned: number
  /** Stars in the ring: one per round played. */
  total: number
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * One star per round, in a ring around the trophy, filling one at a time
 * with a rising note each. A child can count them, and sees the empty ones
 * are rounds still there to win, rather than three stars standing in for a
 * ratio.
 */
export default function StarRing({ earned, total }: Props) {
  const { playStar } = useSoundEffects()
  const [filled, setFilled] = useState(() => (prefersReducedMotion() ? earned : 0))

  useEffect(() => {
    if (filled >= earned) return
    const t = setTimeout(
      () => {
        playStar(filled)
        setFilled(filled + 1)
      },
      filled === 0 ? STAR_START_MS : STAR_STEP_MS,
    )
    return () => clearTimeout(t)
  }, [filled, earned, playStar])

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => {
        // Clockwise from the top.
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2
        const on = i < filled
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className={`absolute h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 ${on ? 'animate-pop' : ''}`}
            style={{ left: `${50 + 41 * Math.cos(angle)}%`, top: `${50 + 41 * Math.sin(angle)}%` }}
          >
            <path
              d={STAR_PATH}
              fill={on ? '#facc15' : 'rgba(255,255,255,0.25)'}
              stroke={on ? '#ca8a04' : 'rgba(255,255,255,0.7)'}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        )
      })}
    </div>
  )
}
