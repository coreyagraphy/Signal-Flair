import type { Config } from 'tailwindcss'

/** Semantic colors resolve to CSS variables that flip with prefers-color-scheme.
 *  Accent colors are fixed (they read on both light and dark). */
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`

const config: Config = {
  darkMode: 'media',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // semantic (theme-aware)
        bg:          v('--bg'),
        surface:     v('--surface'),
        'surface-2': v('--surface-2'),
        ink:         v('--ink'),
        line:        v('--line'),
        // always-dark cinematic feature band (dark in BOTH themes)
        feature:      v('--feature'),
        'feature-2':  v('--feature-2'),
        'on-feature': v('--on-feature'),
        // fixed accents
        yellow:    '#F7FF5A',
        orange:    '#FF7A45',
        'orange-2':'#E85D04',
        teal:      '#00A6A6',
        pink:      '#FF1177',
        // legacy literals (kept for any stragglers)
        cream:     '#FFF6E8',
        'cream-2': '#F8EEDB',
        charcoal:  '#171312',
        'charcoal-2': '#2A2220',
        'near-black': '#0A0806',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        serif:   ['DM Serif Display', 'serif'],
        mono:    ['DM Mono', 'monospace'],
        body:    ['Barlow Condensed', 'sans-serif'],
      },
      animation: {
        'ticker':      'ticker 28s linear infinite',
        'float':       'float 4s ease-in-out infinite',
        'aura-pulse':  'auraPulse 4s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        auraPulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
