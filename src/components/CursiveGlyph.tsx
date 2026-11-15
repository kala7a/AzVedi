import { CURSIVE_STROKES } from '../data/cursiveStrokes'
import { svgPath } from '../data/strokePath'

interface Props {
  /** One letter, or a syllable or word to write out letter by letter. */
  glyph: string
  className?: string
}

/** Pen width for a letter shown rather than traced, in box units. */
const PEN = 7

/**
 * A handwritten letter drawn from the same traced paths the child follows in
 * the tracing rounds, instead of set in a script typeface. No typeface we
 * could bundle agrees with the Bulgarian school chart everywhere — ж is the
 * plainest disagreement — and a child picking a letter here should be
 * looking at the very shape they are being taught to write.
 *
 * The box keeps its full height so a tall letter still looks tall next to a
 * short one, but is trimmed to the letter's own width so narrow letters are
 * not left swimming in space.
 *
 * Longer text is the same letters set side by side. They are not joined up
 * the way a hand would join them: each was traced on its own, and has no
 * entry or exit stroke to meet its neighbour with.
 */
export default function CursiveGlyph({ glyph, className }: Props) {
  const letters = [...glyph].map((ch) => CURSIVE_STROKES[ch])
  // Bulgarian writes no capital ь; anything else missing would be a bug, but
  // text the child can still read beats an empty box either way.
  if (letters.length === 0 || letters.some((strokes) => !strokes?.length)) {
    return <span className={className}>{glyph}</span>
  }

  const pad = PEN / 2 + 1
  let width = 0
  const placed = letters.map((strokes) => {
    const xs = strokes.flat().map((p) => p.x)
    const left = Math.min(...xs) - pad
    const dx = width - left
    width += Math.max(...xs) + pad - left
    return { strokes, dx }
  })

  return (
    <svg viewBox={`0 0 ${width} 100`} className={className} role="img" aria-label={glyph}>
      {placed.map(({ strokes, dx }, li) => (
        <g key={li} transform={`translate(${dx} 0)`}>
          {strokes.map((stroke, i) => (
            <path
              key={i}
              d={svgPath(stroke, true)}
              fill="none"
              stroke="currentColor"
              strokeWidth={PEN}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
      ))}
    </svg>
  )
}
