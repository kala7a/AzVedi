import type { BgLetter } from './data/letters'

/** What a session practises, picked on the home screen. */
export type Category = 'letters' | 'syllables' | 'words'

/** Easy is printed capitals; hard is the handwritten (ръкописни) forms. */
export type Difficulty = 'easy' | 'hard'

/**
 * Whether this round shows its letter handwritten rather than printed. Every
 * option in a round shares it, so a round is never a mix of the two scripts.
 */
interface RoundScript {
  cursive: boolean
  /** Handwritten rounds teach both cases; printed rounds are capitals only. */
  lowercase: boolean
}

export interface TraceExercise extends RoundScript {
  type: 'trace'
  letter: BgLetter
}

export interface ChoiceExercise extends RoundScript {
  type: 'choice'
  letter: BgLetter
  options: BgLetter[]
}

/** Say a word aloud ("слон"), child picks which of 2 letters it starts with. */
export interface WordExercise extends RoundScript {
  type: 'word'
  letter: BgLetter
  options: BgLetter[]
}

/**
 * Show a letter, child taps sound buttons to hear letter names and confirms
 * the one that belongs to it. `options` is in on-screen order.
 */
export interface NameExercise extends RoundScript {
  type: 'name'
  letter: BgLetter
  options: BgLetter[]
}

/** A syllable or a whole word to read, kept in small letters. */
export interface ReadItem {
  kind: 'syllable' | 'word'
  text: string
  /** Words come with a picture; syllables have none. */
  emoji?: string
}

/** A reading round. `options` is in on-screen order and includes `target`. */
interface ReadRound {
  target: ReadItem
  options: ReadItem[]
  /** Written by hand (small letters) rather than in printed capitals. */
  cursive: boolean
}

/** Hear the target (and see its picture, for a word), pick how it is written. */
export interface ListenExercise extends ReadRound {
  type: 'listen'
}

/** See the target written, pick which of the sound buttons reads it. */
export interface SoundExercise extends ReadRound {
  type: 'sound'
}

/** See a word written, pick its picture. Nothing is read aloud first. */
export interface PictureExercise extends ReadRound {
  type: 'picture'
}

export type Exercise =
  | TraceExercise
  | ChoiceExercise
  | WordExercise
  | NameExercise
  | ListenExercise
  | SoundExercise
  | PictureExercise

export interface RoundResult {
  exercise: Exercise
  correct: boolean
}
