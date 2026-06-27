import type { CSSProperties } from 'react'

/**
 * Signal Flair logotype — animated "flare" build (2026-06-26).
 * Cyan circuit "SIGNAL" + rainbow gradient "FLAIR" (cyan→yellow→orange→magenta)
 * + a flare swoosh launching from a glowing flare-source. Transparent vector, so
 * it drops onto any background. The colour-strobe / flare flicker is driven by the
 * `.sf-logo` CSS animation in globals.css (reduced-motion guarded).
 *
 * onDark / pulse kept for backwards-compat with existing call sites (no longer
 * change the colour — FLAIR is the rainbow gradient on every surface).
 */
export default function SignalFlairLogo({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
  /** kept for backwards-compat with existing call sites; no longer affects colour */
  onDark?: boolean
  pulse?: boolean
}) {
  return (
    <svg
      viewBox="0 0 360 152"
      xmlns="http://www.w3.org/2000/svg"
      className={`sf-logo${className ? ` ${className}` : ''}`}
      style={style}
      role="img"
      aria-label="Signal Flair"
    >
      <defs>
        {/* FLAIR rainbow: cyan → yellow → orange → magenta (left to right) */}
        <linearGradient id="sfFlair" x1="0%" y1="0%" x2="100%" y2="10%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="34%" stopColor="#fde047" />
          <stop offset="62%" stopColor="#ff8a1f" />
          <stop offset="100%" stopColor="#ff2d9b" />
        </linearGradient>
        {/* Flare swoosh: yellow → orange → magenta */}
        <linearGradient id="sfSwoosh" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0" />
          <stop offset="14%" stopColor="#fde047" stopOpacity="1" />
          <stop offset="58%" stopColor="#ff8a1f" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ff2d9b" stopOpacity="0.9" />
        </linearGradient>
        {/* Dot connector: yellow → magenta */}
        <linearGradient id="sfDots" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ff2d9b" />
        </linearGradient>
      </defs>

      {/* Circuit dots before SIGNAL — yellow · orange · magenta */}
      <line x1="9" y1="23" x2="33" y2="23" stroke="url(#sfDots)" strokeWidth="1.6" />
      <circle cx="9" cy="23" r="4" fill="#fde047" />
      <circle cx="9" cy="23" r="6.5" fill="none" stroke="#fde047" strokeWidth="1" opacity="0.5" />
      <circle cx="21" cy="23" r="3.4" fill="#ff8a1f" />
      <circle cx="33" cy="23" r="3.4" fill="#ff2d9b" />

      {/* SIGNAL — cyan circuit mono */}
      <text
        x="42"
        y="32"
        fontFamily="'Geist Mono', 'Courier New', monospace"
        fontWeight="600"
        fontSize="20"
        fill="#22d3ee"
        letterSpacing="7"
      >
        SIGNAL
      </text>

      {/* FLAIR — heavy serif, rainbow gradient */}
      <text
        x="36"
        y="130"
        fontFamily="Fraunces, 'Palatino Linotype', Georgia, serif"
        fontWeight="900"
        fontSize="106"
        fill="url(#sfFlair)"
        letterSpacing="-1"
      >
        FLAIR
      </text>

      {/* Flare swoosh launching from the flare-source */}
      <path d="M 30 120 C 90 102, 180 90, 320 118" stroke="url(#sfSwoosh)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M 58 116 C 122 100, 205 92, 312 114" stroke="url(#sfSwoosh)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Flare source (bottom-left burst) */}
      <circle cx="30" cy="120" r="13" fill="none" stroke="#fde047" strokeWidth="1" opacity="0.28" />
      <circle cx="30" cy="120" r="8.5" fill="none" stroke="#fde047" strokeWidth="1.2" opacity="0.55" />
      <circle cx="30" cy="120" r="4" fill="#fff6c2" />
      <circle cx="30" cy="120" r="2" fill="#ffffff" />
      {/* Flare landing dot (bottom-right) */}
      <circle cx="320" cy="118" r="3.2" fill="#ff2d9b" />
      <circle cx="320" cy="118" r="5.5" fill="none" stroke="#ff2d9b" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}
