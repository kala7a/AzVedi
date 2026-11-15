import CursiveGlyph from './CursiveGlyph'

interface Props {
  /** A syllable or word, in small letters. */
  text: string
  cursive: boolean
  /** Sizes the handwritten drawing; printed text takes the parent's font size. */
  cursiveClassName?: string
}

/**
 * A syllable or word as the child's level writes it: printed capitals on
 * easy, the way a буквар sets its first words, and handwritten small letters
 * on hard.
 */
export default function Written({ text, cursive, cursiveClassName }: Props) {
  if (cursive) return <CursiveGlyph glyph={text} className={cursiveClassName} />
  return <span>{text.toUpperCase()}</span>
}
