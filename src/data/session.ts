import { ALPHABET, type BgLetter } from './letters'
import { EASY_SYLLABLES, EASY_WORDS, HARD_SYLLABLES, HARD_WORDS } from './reading'
import type {
  Category,
  ChoiceExercise,
  Difficulty,
  Exercise,
  NameExercise,
  ReadItem,
  TraceExercise,
  WordExercise,
} from '../types'

/** Rounds per game. Fixed now that the home screen picks difficulty, not length. */
export const ROUND_COUNT = 10

// Letters kept out of the "listen and choose" pool: their names are too similar
// to neighbors for a 5-year-old to reliably tell apart by ear alone.
const CHOICE_EXCLUDED = new Set(['Ь'])

// How many names a "which name is this letter?" round offers. Each one has to
// be listened to and held in mind, so easy keeps it to a pair.
const NAME_OPTION_COUNT: Record<Difficulty, number> = { easy: 2, hard: 4 }

// Letters with no real associated word (Ь's "word" is just its own name again),
// so they can't be the answer in a "which letter does this word start with?" round.
const WORD_EXCLUDED = new Set(['Ь'])

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function pickOptions(correct: BgLetter, pool: BgLetter[], count: number): BgLetter[] {
  const distractors = shuffle(pool.filter((l) => l.letter !== correct.letter)).slice(0, count - 1)
  return shuffle([correct, ...distractors])
}

/**
 * Options for a reading round. Easy picks distractors that look nothing like
 * the answer; hard picks the ones closest to it, so the child has to read the
 * whole thing rather than spot one letter.
 */
function pickReadOptions(target: ReadItem, pool: ReadItem[], count: number, difficulty: Difficulty): ReadItem[] {
  const similar = (item: ReadItem) =>
    target.kind === 'syllable'
      ? item.text[0] === target.text[0] || item.text[1] === target.text[1]
      : item.text[0] === target.text[0]
  const others = shuffle(pool.filter((item) => item.text !== target.text))
  const wanted = difficulty === 'hard'
  const ranked = [...others.filter((item) => similar(item) === wanted), ...others.filter((item) => similar(item) !== wanted)]
  return shuffle([target, ...ranked.slice(0, count - 1)])
}

function buildReadingSession(category: 'syllables' | 'words', difficulty: Difficulty): Exercise[] {
  const hard = difficulty === 'hard'
  const pool = category === 'syllables' ? (hard ? HARD_SYLLABLES : EASY_SYLLABLES) : hard ? HARD_WORDS : EASY_WORDS
  // Syllables have no picture to match against.
  const types = category === 'syllables' ? (['listen', 'sound'] as const) : (['listen', 'sound', 'picture'] as const)

  return shuffle(pool)
    .slice(0, ROUND_COUNT)
    .map((target): Exercise => {
      const type = types[Math.floor(Math.random() * types.length)]
      // Sound buttons each have to be listened to and remembered, and written
      // words are stacked one per row, so both stop at three; the rest fit four.
      const hardCount = type === 'sound' || (type === 'listen' && category === 'words') ? 3 : 4
      const options = pickReadOptions(target, pool, hard ? hardCount : 2, difficulty)
      return { type, target, options, cursive: hard }
    })
}

export function buildSession(category: Category, difficulty: Difficulty): Exercise[] {
  if (category !== 'letters') return buildReadingSession(category, difficulty)

  const letters = shuffle(ALPHABET).slice(0, ROUND_COUNT)
  const choicePool = ALPHABET.filter((l) => !CHOICE_EXCLUDED.has(l.letter))
  const wordPool = ALPHABET.filter((l) => !WORD_EXCLUDED.has(l.letter))

  return letters.map((letter): Exercise => {
    // Roughly even four-way mix, so tracing, listen-and-pick,
    // word-first-letter and name-the-letter rounds all show up in a session.
    const types = ['trace', 'choice', 'word', 'name'] as const
    const type = types[Math.floor(Math.random() * types.length)]
    const cursive = difficulty === 'hard'
    // Handwritten capitals and small letters are genuinely different shapes
    // (А against а, not just a size), so hard alternates between them. Ь is
    // the exception: Bulgarian writes no capital ь, and the chart the
    // handwritten letters come from has no such glyph to trace.
    const lowercase = cursive && (letter.letter === 'Ь' || Math.random() < 0.5)

    if (type === 'choice') {
      const exercise: ChoiceExercise = {
        type: 'choice',
        letter,
        options: pickOptions(letter, choicePool, 4),
        cursive,
        lowercase,
      }
      return exercise
    }
    if (type === 'word' && !WORD_EXCLUDED.has(letter.letter)) {
      const exercise: WordExercise = {
        type: 'word',
        letter,
        options: pickOptions(letter, wordPool, 2),
        cursive,
        lowercase,
      }
      return exercise
    }
    if (type === 'name') {
      const exercise: NameExercise = {
        type: 'name',
        letter,
        options: pickOptions(letter, choicePool, NAME_OPTION_COUNT[difficulty]),
        cursive,
        lowercase,
      }
      return exercise
    }
    const exercise: TraceExercise = { type: 'trace', letter, cursive, lowercase }
    return exercise
  })
}
