import { useCallback, useEffect, useState } from 'react'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const bg = voices.find((v) => v.lang.toLowerCase().startsWith('bg'))
  return bg ?? null
}

/**
 * Speaks Bulgarian text aloud via the Web Speech API.
 * Falls back gracefully (no-op + `supported: false`) on browsers without a bg voice,
 * so callers can show a "no sound" hint instead of throwing.
 */
export function useSpeech() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  // Whether the browser has told us about any voices at all yet.
  const [voicesListed, setVoicesListed] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (!supported) return
    const load = () => {
      const voices = window.speechSynthesis.getVoices()
      setVoice(pickVoice(voices))
      setVoicesListed(voices.length > 0)
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  const speak = useCallback(
    (text: string, onStart?: () => void) => {
      if (!supported) return
      const synth = window.speechSynthesis
      // Only cancel if something is actually queued/playing — an
      // unconditional cancel() right before speak() (even on a clean
      // synth) makes the clipped-onset bug below worse, not better.
      if (synth.speaking || synth.pending) synth.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'bg-BG'
      utterance.rate = 0.8
      utterance.pitch = 1.1
      if (voice) utterance.voice = voice
      utterance.onstart = () => {
        setSpeaking(true)
        onStart?.()
      }
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)
      synth.speak(utterance)
    },
    [voice],
  )

  const warmUp = useCallback(() => {
    if (!supported) return
    // Speech engines (Chrome on Android especially) are noticeably more
    // prone to clipping/dropping the very first utterance after a cold
    // start. Queuing an inaudible one right on a user gesture (the play
    // button) gets the engine spun up before the first real letter sound
    // is due, a few hundred ms later.
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance('.')
    utterance.volume = 0
    utterance.lang = 'bg-BG'
    if (voice) utterance.voice = voice
    synth.speak(utterance)
  }, [voice])

  // The list arrives late on Chrome and on some Android builds never arrives,
  // though speech in bg-BG works all the same. Only a list that came back
  // without a Bulgarian voice in it is a reason to warn.
  return { speak, warmUp, speaking, supported, hasBulgarianVoice: voice !== null || !voicesListed }
}
