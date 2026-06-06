import type { CSSProperties } from 'react'

/**
 * Signal Flair logotype (2026-06-07 brand logo).
 * Teal circuit "SIGNAL" + heavy serif "FLAIR" + orange→yellow flare swoosh.
 * Source: SIGNAL_FLAIR_CLAUDE_CODE_PACKAGE.md (design-refs/).
 *
 * onDark: set true on dark surfaces (hero nav, footer) so "FLAIR" stays legible
 * (near-black #1a1209 → bone #f8f1e7). SIGNAL teal and the flare swoosh read on both.
 */
export default function SignalFlairLogo({
  className,
  style,
  onDark = false,
}: {
  className?: string
  style?: CSSProperties
  onDark?: boolean
}) {
  const flair = onDark ? '#f8f1e7' : '#1a1209'
  return (
    <svg
      viewBox="0 0 360 148"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="img"
      aria-label="Signal Flair"
    >
      <defs>
        <linearGradient id="flareGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff5a1f" stopOpacity="0.15" />
          <stop offset="25%" stopColor="#ff5a1f" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#fff45f" stopOpacity="1" />
          <stop offset="85%" stopColor="#ff5a1f" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="flareGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fff45f" stopOpacity="0" />
          <stop offset="30%" stopColor="#fff45f" stopOpacity="0.4" />
          <stop offset="65%" stopColor="#fff45f" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff45f" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Circuit dots before SIGNAL */}
      <circle cx="6" cy="23" r="3" fill="#00b8a9" />
      <line x1="11" y1="23" x2="17" y2="23" stroke="#00b8a9" strokeWidth="1.4" />
      <circle cx="20" cy="23" r="2" fill="#00b8a9" opacity="0.7" />
      <line x1="24" y1="23" x2="30" y2="23" stroke="#00b8a9" strokeWidth="1.4" />
      <circle cx="33" cy="23" r="1.5" fill="#00b8a9" opacity="0.45" />
      {/* SIGNAL */}
      <text
        x="40"
        y="32"
        fontFamily="'Geist Mono', 'Courier New', monospace"
        fontWeight="600"
        fontSize="20"
        fill="#00b8a9"
        letterSpacing="7"
      >
        SIGNAL
      </text>
      {/* FLAIR */}
      <text
        x="36"
        y="128"
        fontFamily="Fraunces, 'Palatino Linotype', Georgia, serif"
        fontWeight="900"
        fontSize="104"
        fill={flair}
        letterSpacing="-1"
      >
        FLAIR
      </text>
      {/* Flare swoosh */}
      <path
        d="M 28 118 C 80 100, 170 88, 310 116"
        stroke="url(#flareGrad)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 55 114 C 120 98, 200 90, 300 112"
        stroke="url(#flareGrad2)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="38" cy="116" r="3.5" fill="#ff5a1f" opacity="0.7" />
      <circle cx="38" cy="116" r="6" fill="#ff5a1f" opacity="0.2" />
    </svg>
  )
}
