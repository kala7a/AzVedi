import type { ReadItem } from '../types'

const VOWELS = 'аеиоу'
// Easy keeps to the consonants a child meets first in the буквар; hard adds
// the rest.
const EASY_CONSONANTS = 'мнлрбптдксв'
const HARD_CONSONANTS = EASY_CONSONANTS + 'гжзфхцчш'

function openSyllables(consonants: string): ReadItem[] {
  return [...consonants].flatMap((c) => [...VOWELS].map((v): ReadItem => ({ kind: 'syllable', text: c + v })))
}

/** Open consonant + vowel syllables: ма, ме, ми, мо, му … */
export const EASY_SYLLABLES = openSyllables(EASY_CONSONANTS)
export const HARD_SYLLABLES = openSyllables(HARD_CONSONANTS)

const word = (text: string, emoji: string): ReadItem => ({ kind: 'word', text, emoji })

/**
 * Words a child can both read and recognise from a picture. Every emoji is
 * used once, so a picture never fits two of the words on screen.
 */
const WORDS: ReadItem[] = [
  word('кон', '🐴'),
  word('лъв', '🦁'),
  word('нос', '👃'),
  word('ухо', '👂'),
  word('очи', '👀'),
  word('зъб', '🦷'),
  word('мед', '🍯'),
  word('сок', '🧃'),
  word('риба', '🐟'),
  word('жаба', '🐸'),
  word('гъба', '🍄'),
  word('слон', '🐘'),
  word('вълк', '🐺'),
  word('лале', '🌷'),
  word('заек', '🐇'),
  word('хляб', '🍞'),
  word('елха', '🎄'),
  word('ключ', '🔑'),
  word('огън', '🔥'),
  word('куче', '🐶'),
  word('луна', '🌙'),
  word('къща', '🏠'),
  word('кола', '🚗'),
  word('влак', '🚂'),
  word('роза', '🌹'),
  word('коза', '🐐'),
  word('овца', '🐑'),
  word('пиле', '🐥'),
  word('змия', '🐍'),
  word('яйце', '🥚'),
  word('котка', '🐱'),
  word('мишка', '🐭'),
  word('мечка', '🐻'),
  word('панда', '🐼'),
  word('тигър', '🐯'),
  word('крава', '🐄'),
  word('петел', '🐓'),
  word('пчела', '🐝'),
  word('бухал', '🦉'),
  word('акула', '🦈'),
  word('жираф', '🦒'),
  word('торта', '🎂'),
  word('домат', '🍅'),
  word('банан', '🍌'),
  word('балон', '🎈'),
  word('шапка', '🎩'),
  word('лодка', '⛵'),
  word('молив', '✏️'),
  word('топка', '⚽'),
  word('книга', '📖'),
  word('дърво', '🌳'),
  word('чадър', '☂️'),
  word('цвете', '🌸'),
  word('сърце', '❤️'),
  word('слънце', '☀️'),
  word('звезда', '⭐'),
  word('ракета', '🚀'),
  word('ябълка', '🍎'),
  word('грозде', '🍇'),
  word('патица', '🦆'),
  word('делфин', '🐬'),
  word('ананас', '🍍'),
]

/** Easy reads only the short words; hard reads them all. */
export const EASY_WORDS = WORDS.filter((w) => w.text.length <= 4)
export const HARD_WORDS = WORDS
