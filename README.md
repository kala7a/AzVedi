# Азъ Веди

Named after the first two letters of the Glagolitic alphabet, азъ and
вѣди — "I know".

A small Duolingo-style learning game that teaches the Bulgarian Cyrillic
alphabet to young children (built with a 5-year-old in mind). No backend,
no AI — just a static React app.

## How it works

The home screen picks what to practise — **Букви** (letters), **Срички**
(syllables) or **Думи** (whole words) — and a difficulty: **Лесно** uses
printed capitals, **Трудно** uses handwritten (ръкописни) letters. A play
session is 10 rounds, ending in a star rating (1–3 stars).

**Букви** mixes four exercise types:

1. **Trace** — the child traces a large guide letter on a canvas with a
   finger (or mouse), after an animated demo of the stroke order, while the
   letter's name is read aloud. Finishing a trace always completes the
   round; how much of the letter got covered only changes the celebration
   message, since grading a young child's handwriting precisely wouldn't be
   fair.
2. **Listen & choose** — a letter's name is read aloud and the child taps
   the matching letter out of 4 big options.
3. **First letter** — a word is read aloud (with its emoji), and the child
   picks which of 2 letters it starts with.
4. **Name the letter** — a letter is shown, and the child taps sound
   buttons to hear letter names (2 on Лесно, 4 on Трудно), then presses
   „Готово“ on the one that matches.

**Срички** and **Думи** are reading rounds:

1. **Listen & find** — a syllable is read aloud, or a word is read aloud
   next to its picture, and the child picks how it is written.
2. **How is it read** — a syllable or word is shown written, and the child
   picks the sound button that reads it, then presses „Готово“.
3. **What does it say** (words only) — a word is shown written, with nothing
   read aloud, and the child picks its picture.

Лесно offers 2 options that look nothing like the answer; Трудно offers 3–4
that share letters with it, and uses more syllables and longer words.

Letter audio uses the browser's built-in `SpeechSynthesis` API with a
Bulgarian voice when available (Chrome/Edge on most platforms). No audio
files are shipped. Correct/wrong feedback chimes are synthesized with the
Web Audio API, also with no audio assets.

## Project structure

- `src/data/letters.ts` — the 30-letter Bulgarian alphabet with an example
  word + emoji per letter.
- `src/data/letterStrokes.ts`, `src/data/cursiveStrokes.ts` — stroke paths
  for the printed and handwritten letters, used for tracing, the stroke
  order demo and drawing the handwritten options.
- `src/data/reading.ts` — the syllables and the picture words.
- `src/data/session.ts` — builds a randomized round queue for a session.
- `src/hooks/useSpeech.ts` — Bulgarian text-to-speech wrapper.
- `src/hooks/useSoundEffects.ts` — synthesized correct/wrong chimes.
- `src/components/TraceCanvas.tsx` — the tracing canvas, stroke order demo
  and coverage detection (via an offscreen letter mask).
- `src/screens/` — `HomeScreen`, `GameSession`, `TraceExercise`,
  `ChoiceExercise`, `WordExercise`, `SoundPickExercise`, `ReadPickExercise`,
  `ResultsScreen`.

Adding a new exercise type later means adding a new entry to the
`Exercise` union in `src/types.ts`, a case in `session.ts`, and a new
screen component rendered from `GameSession.tsx`.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint     # oxlint
```
