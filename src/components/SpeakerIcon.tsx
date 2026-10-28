interface Props {
  /** Animates the sound waves while this button's name is being spoken. */
  playing: boolean
  className?: string
}

/**
 * A drawn speaker rather than the 🔊 emoji: the emoji is a different picture
 * on every phone and can't show which button is the one talking right now.
 */
export default function SpeakerIcon({ playing, className }: Props) {
  const wave = playing ? 'animate-sound-wave' : ''
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M8 18h8l11-9v30l-11-9H8a2 2 0 0 1-2-2V20a2 2 0 0 1 2-2z" fill="currentColor" />
      <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <path d="M33 17a10 10 0 0 1 0 14" className={wave} />
        <path d="M38 11a18 18 0 0 1 0 26" className={wave} style={{ animationDelay: '0.15s' }} />
      </g>
    </svg>
  )
}
