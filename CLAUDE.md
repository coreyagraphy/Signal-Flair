# SIGNAL FLARE — MENTAL VISION CORP
## Claude Code Master Handoff Document
**Stack:** Next.js 14 · shadcn/ui · Tailwind CSS · TypeScript · Framer Motion
**Brand:** Mental Vision Corp · AI Visibility + Cinematic Creative · Indianapolis, IN
**Tagline:** Discovery Is the First Connection.

---

## MISSION

Build the Signal Flare website for Mental Vision Corp. This is not a template — it is a cinematic, editorial, premium AI agency website with a hero video intro, an interactive robot character, and scroll-driven animations throughout. Every design decision should feel intentional, immersive, and impossible to ignore.

**The robot (ORB-01) is the heart of the experience.** He appears in the hero section, moves with the mouse, waves at the viewer, and makes eye contact. He is the brand mascot and the product metaphor — he finds invisible businesses and makes them visible.

---

## QUICK START

```bash
npx create-next-app@latest signal-flare --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd signal-flare
npx shadcn@latest init
npx shadcn@latest add card
npm install framer-motion @splinetool/react-spline @splinetool/runtime
npm install @fontsource/bebas-neue
```

---

## PROJECT STRUCTURE

```
signal-flare/
├── CLAUDE.md                          ← You are here
├── public/
│   ├── video/
│   │   └── signal-flare-hero.mp4     ← Hero video (Seedance generated)
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                        ← shadcn components
│   │   │   ├── card.tsx
│   │   │   ├── spotlight.tsx
│   │   │   └── spline-scene.tsx
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx        ← Video + ORB-01 + text
│   │   │   ├── TickerSection.tsx      ← Trust ticker
│   │   │   ├── ProblemSection.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── CheckSection.tsx
│   │   │   ├── WorkSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── ProcessSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── FooterSection.tsx
│   │   ├── layout/
│   │   │   └── Navigation.tsx
│   │   └── shared/
│   │       ├── ORB01.tsx              ← Interactive robot canvas
│   │       ├── ScanDemo.tsx           ← Live scan UI card
│   │       └── RevealWrapper.tsx      ← Scroll reveal HOC
│   └── lib/
│       ├── utils.ts
│       └── tokens.ts                  ← Design system tokens
```

---

## DESIGN SYSTEM TOKENS

```typescript
// src/lib/tokens.ts
export const tokens = {
  colors: {
    yellow:   '#F7FF5A',   // Signal energy — primary accent
    orange:   '#FF7A45',   // CTA, hover states
    orange2:  '#E85D04',   // Deep orange, active states
    teal:     '#00A6A6',   // AEO service arm
    pink:     '#FF1177',   // Alerts, blocked indicators ONLY
    cream:    '#FFF6E8',   // Inner section backgrounds
    cream2:   '#F8EEDB',   // Secondary cream
    charcoal: '#171312',   // Dark section backgrounds
    charcoal2:'#2A2220',   // Cards on dark
    white:    '#FFFFFF',
    nearBlack:'#0A0806',   // Hero/intro atmosphere — NOT pure black
  },
  fonts: {
    display: "'Bebas Neue', sans-serif",
    serif:   "'DM Serif Display', serif",
    mono:    "'DM Mono', monospace",
    body:    "'Barlow Condensed', sans-serif",
  },
  // Cloud world (hero background)
  cloudWorld: {
    left:         '#D7E1EA',  // Blue-gray
    right:        '#F6D6E0',  // Blush pink
    bottomRight:  '#FFD4A0',  // Warm peach amber
    robotEye:     '#FF6B35',  // ORB-01 optical lens
  }
}
```

---

## TAILWIND CONFIG

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        yellow:    '#F7FF5A',
        orange:    '#FF7A45',
        'orange-2':'#E85D04',
        teal:      '#00A6A6',
        pink:      '#FF1177',
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
        'eye-pulse':   'eyePulse 2.5s ease-in-out infinite',
        'float':       'float 4s ease-in-out infinite',
        'scan-rotate': 'scanRotate 6s linear infinite',
        'spotlight':   'spotlight 2s ease .75s 1 forwards',
        'aura-pulse':  'auraPulse 4s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        eyePulse: {
          '0%, 100%': { opacity: '0.85', transform: 'translate(-38%, -50%) scale(1)' },
          '50%':      { opacity: '1',    transform: 'translate(-38%, -50%) scale(1.14)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        scanRotate: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        spotlight: {
          '0%':   { opacity: '0', transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -40%) scale(1)' },
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
```

---

## GLOBAL CSS

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400&family=Barlow+Condensed:wght@300;400;700;900&display=swap');

:root {
  --yellow:     #F7FF5A;
  --orange:     #FF7A45;
  --orange2:    #E85D04;
  --teal:       #00A6A6;
  --pink:       #FF1177;
  --cream:      #FFF6E8;
  --cream2:     #F8EEDB;
  --charcoal:   #171312;
  --charcoal2:  #2A2220;
  --near-black: #0A0806;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  background: var(--cream);
  color: var(--charcoal);
  font-family: 'Barlow Condensed', sans-serif;
  overflow-x: hidden;
  cursor: none;
}

/* Grain overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 200;
  pointer-events: none;
  opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 300px;
}

/* Custom cursor */
.cursor-dot, .cursor-ring {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
}
.cursor-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--orange);
}
.cursor-ring {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 122, 69, 0.4);
  z-index: 9998;
  transition: all 0.15s ease;
}
```

---

## COMPONENT — ROOT LAYOUT

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mental Vision Corp — AI Visibility + Cinematic Creative',
  description: 'We find every business the algorithm can\'t see, then build the signal that makes it impossible to ignore.',
  keywords: ['AI visibility', 'AEO', 'llms.txt', 'AI search', 'Indianapolis', 'cinematic creative'],
  openGraph: {
    title: 'Mental Vision Corp — Signal Flare',
    description: 'Discovery Is the First Connection.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

---

## COMPONENT — ROOT PAGE

```tsx
// src/app/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import HeroSection from '@/components/sections/HeroSection'
import TickerSection from '@/components/sections/TickerSection'
import ProblemSection from '@/components/sections/ProblemSection'
import ServicesSection from '@/components/sections/ServicesSection'
import CheckSection from '@/components/sections/CheckSection'
import WorkSection from '@/components/sections/WorkSection'
import StatsSection from '@/components/sections/StatsSection'
import ProcessSection from '@/components/sections/ProcessSection'
import PricingSection from '@/components/sections/PricingSection'
import CTASection from '@/components/sections/CTASection'
import FooterSection from '@/components/sections/FooterSection'

export default function Home() {
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const [heroComplete, setHeroComplete] = useState(false)

  useEffect(() => {
    let ringX = 0, ringY = 0
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${mouseX}px`
        cursorDotRef.current.style.top  = `${mouseY}px`
      }
    }

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = `${ringX}px`
        cursorRingRef.current.style.top  = `${ringY}px`
      }
      requestAnimationFrame(animateRing)
    }

    window.addEventListener('mousemove', moveCursor)
    animateRing()
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  return (
    <>
      {/* Custom cursor */}
      <div ref={cursorDotRef}  className="cursor-dot" />
      <div ref={cursorRingRef} className="cursor-ring" />

      {/* Site navigation — fades in after hero */}
      <Navigation heroComplete={heroComplete} />

      {/* Hero — video + ORB-01 interactive */}
      <HeroSection onComplete={() => setHeroComplete(true)} />

      {/* Main content */}
      <main>
        <TickerSection />
        <ProblemSection />
        <ServicesSection />
        <CheckSection />
        <WorkSection />
        <StatsSection />
        <ProcessSection />
        <PricingSection />
        <CTASection />
      </main>

      <FooterSection />
    </>
  )
}
```

---

## COMPONENT — NAVIGATION

```tsx
// src/components/layout/Navigation.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationProps {
  heroComplete: boolean
}

export default function Navigation({ heroComplete }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['AEO Audit', 'Creative', 'Work', 'Pricing']

  return (
    <AnimatePresence>
      {scrolled && heroComplete && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{   y: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-4
                     bg-cream/88 backdrop-blur-xl border-b border-charcoal/10"
        >
          <div>
            <a href="#hero" className="font-display text-xl text-charcoal tracking-wide">
              MENTAL<span className="text-orange">VISION</span>
            </a>
            <div className="font-mono text-[7px] text-charcoal/30 tracking-[0.25em] uppercase mt-0.5">
              AI Visibility + Cinematic Creative
            </div>
          </div>
          <div className="flex items-center gap-6">
            {links.map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="font-mono text-[9px] text-charcoal/40 tracking-[0.18em] uppercase
                           hover:text-charcoal transition-colors"
              >
                {link}
              </a>
            ))}
            <a
              href="#cta"
              className="font-display text-sm tracking-wide px-5 py-2 rounded-[2px]
                         bg-charcoal text-cream hover:bg-orange transition-colors"
            >
              RUN MY SCORE
            </a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
```

---

## COMPONENT — HERO SECTION

```tsx
// src/components/sections/HeroSection.tsx
'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import ORB01 from '@/components/shared/ORB01'

interface HeroSectionProps {
  onComplete: () => void
}

export default function HeroSection({ onComplete }: HeroSectionProps) {
  const videoRef      = useRef<HTMLVideoElement>(null)
  const containerRef  = useRef<HTMLDivElement>(null)
  const [videoEnded, setVideoEnded]   = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [showSkip, setShowSkip]       = useState(false)

  // Mouse spring for ORB-01 interaction
  const mouseX = useSpring(0, { stiffness: 60, damping: 20 })
  const mouseY = useSpring(0, { stiffness: 60, damping: 20 })
  const orbRotateY = useTransform(mouseX, [-1, 1], [-7, 7])
  const orbRotateX = useTransform(mouseY, [-1, 1], [4, -4])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const nx = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2)
    const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
    mouseX.set(nx)
    mouseY.set(ny)
  }, [mouseX, mouseY])

  useEffect(() => {
    if (!showContent) return
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [showContent, handleMouseMove])

  // Show skip button after 1s
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 1000)
    return () => clearTimeout(t)
  }, [])

  const handleVideoEnd = () => {
    setVideoEnded(true)
    setTimeout(() => {
      setShowContent(true)
      onComplete()
    }, 300)
  }

  const handleSkip = () => {
    if (videoRef.current) videoRef.current.pause()
    setVideoEnded(true)
    setTimeout(() => {
      setShowContent(true)
      onComplete()
    }, 300)
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-near-black"
    >
      {/* Hero video */}
      <AnimatePresence>
        {!videoEnded && (
          <motion.div
            className="absolute inset-0 z-10"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <video
              ref={videoRef}
              src="/video/signal-flare-hero.mp4"
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnd}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button */}
      <AnimatePresence>
        {showSkip && !videoEnded && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{   opacity: 0 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 z-20 font-mono text-[9px] text-white/30
                       tracking-[0.3em] uppercase border border-white/15 px-4 py-2
                       hover:text-white/70 transition-colors"
          >
            SKIP INTRO
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero content — cloud world background */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Cloud world CSS background */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 50% 70% at 18% 50%, rgba(180,195,210,0.5) 0%, transparent 55%),
                  radial-gradient(ellipse 55% 80% at 82% 50%, rgba(220,170,185,0.55) 0%, transparent 55%),
                  radial-gradient(ellipse 38% 38% at 82% 82%, rgba(230,170,120,0.35) 0%, transparent 50%),
                  linear-gradient(160deg, #8A9EB5 0%, #B0A0B8 35%, #BC98A8 60%, #B89878 100%)
                `,
                animation: 'heroBreathe 14s ease-in-out infinite alternate',
              }}
            />
            <div className="absolute inset-0 bg-near-black/28" />
            <div
              className="absolute bottom-0 left-0 right-0 h-[30%]"
              style={{ background: 'linear-gradient(0deg, rgba(10,8,6,0.4) 0%, transparent 100%)' }}
            />

            {/* Nav inside hero */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22,1,0.36,1] }}
              className="relative z-10 flex items-center justify-between px-12 py-4
                         bg-near-black/35 backdrop-blur-xl border-b border-white/7"
            >
              <div>
                <div className="font-display text-xl text-yellow tracking-wide">
                  MENTAL<span className="text-orange">VISION</span>
                </div>
                <div className="font-mono text-[7px] text-white/20 tracking-[0.25em] uppercase mt-0.5">
                  AI Visibility + Cinematic Creative · Indianapolis, IN
                </div>
              </div>
              <div className="flex items-center gap-6">
                {['AEO Audit', 'Creative', 'Pricing'].map(l => (
                  <a key={l} href="#" className="font-mono text-[9px] text-white/30 tracking-[0.18em] uppercase hover:text-yellow transition-colors">
                    {l}
                  </a>
                ))}
                <a
                  href="#cta"
                  className="font-display text-sm tracking-wide px-5 py-2 rounded-[2px]
                             bg-orange text-white hover:bg-orange-2 transition-colors"
                >
                  RUN MY SCORE →
                </a>
              </div>
            </motion.nav>

            {/* Hero layout: text | ORB-01 | text */}
            <div className="flex-1 grid grid-cols-[220px_1fr_220px] items-center
                            max-w-[1300px] mx-auto px-10 h-[calc(100vh-60px-60px)]">

              {/* Left text */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0  }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22,1,0.36,1] }}
                className="px-5"
              >
                <div className="flex items-center gap-2 font-mono text-[7px] text-yellow/40
                                tracking-[0.3em] uppercase mb-3">
                  <span className="w-1 h-1 rounded-full bg-orange animate-pulse" />
                  What AI currently sees
                </div>
                <h2 className="font-serif text-[28px] leading-[1.15] text-white mb-3">
                  Trusted<br/>locally.<br/>
                  <span className="italic text-orange">Invisible</span><br/>to AI.
                </h2>
                <p className="font-mono text-[8px] text-white/28 leading-loose">
                  GPTBot blocked.<br/>
                  llms.txt missing.<br/>
                  0 citations across<br/>
                  4 AI platforms.
                </p>
              </motion.div>

              {/* ORB-01 Interactive Robot */}
              <div className="flex flex-col items-center justify-center py-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, rotateX: 12 }}
                  animate={{ opacity: 1, scale: 1,    rotateX: 0  }}
                  transition={{ delay: 0.4, duration: 1.2, ease: [0.22,1,0.36,1] }}
                  style={{
                    rotateY: orbRotateY,
                    rotateX: orbRotateX,
                    transformStyle: 'preserve-3d',
                  }}
                  className="relative cursor-none"
                >
                  <ORB01 />

                  {/* Float cards */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0   }}
                    transition={{ delay: 1.0, duration: 0.6, ease: [0.34,1.56,0.64,1] }}
                    className="absolute -top-2 -right-24 bg-near-black/70 backdrop-blur-xl
                               border border-white/10 rounded-lg px-3.5 py-2.5
                               shadow-xl animate-float"
                  >
                    <div className="font-display text-2xl text-orange-2 leading-none">23</div>
                    <div className="font-mono text-[7px] text-white/30 tracking-[0.15em] uppercase">AI Score</div>
                    <div className="text-[9px] text-white/35 font-light mt-0.5">Before Mental Vision</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0  }}
                    transition={{ delay: 1.1, duration: 0.6, ease: [0.34,1.56,0.64,1] }}
                    className="absolute bottom-14 -left-28 bg-near-black/70 backdrop-blur-xl
                               border border-white/10 rounded-lg px-3.5 py-2.5
                               shadow-xl animate-float [animation-delay:2s]"
                  >
                    <div className="font-display text-2xl text-teal leading-none">78</div>
                    <div className="font-mono text-[7px] text-white/30 tracking-[0.15em] uppercase">AI Score</div>
                    <div className="text-[9px] text-white/35 font-light mt-0.5">After 7-Day Rebuild</div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                  className="font-mono text-[7px] text-white/18 tracking-[0.28em] uppercase mt-5"
                >
                  ORB-01 · Observation Mode · Active
                </motion.div>
              </div>

              {/* Right text */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0  }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22,1,0.36,1] }}
                className="px-5 text-right"
              >
                <div className="flex items-center justify-end gap-2 font-mono text-[7px]
                                text-yellow/40 tracking-[0.3em] uppercase mb-3">
                  After Mental Vision
                  <span className="w-1 h-1 rounded-full bg-orange animate-pulse [animation-delay:1s]" />
                </div>
                <h2 className="font-serif text-[28px] leading-[1.15] text-white mb-3">
                  Scanned.<br/>Structured.<br/>
                  <span className="italic text-teal">Found.</span>
                </h2>
                <p className="font-mono text-[8px] text-white/28 leading-loose">
                  llms.txt live.<br/>
                  Bots unblocked.<br/>
                  Every AI engine<br/>
                  cites you first.
                </p>
              </motion.div>
            </div>

            {/* Bottom bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="absolute bottom-0 left-0 right-0 flex items-center justify-between
                         px-12 py-3.5 bg-near-black/50 backdrop-blur-xl
                         border-t border-white/7"
            >
              <p className="font-serif text-sm text-white/40 italic">
                <strong className="text-white not-italic">If AI can't see you,</strong> customers won't either.
              </p>
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-display text-2xl text-yellow leading-none">&lt;1%</div>
                  <div className="font-mono text-[7px] text-white/20 tracking-[0.18em] uppercase mt-0.5">Have llms.txt</div>
                </div>
                <a
                  href="#cta"
                  className="font-display text-sm tracking-wide px-6 py-2.5 rounded-[2px]
                             bg-orange text-white hover:bg-orange-2 transition-colors"
                >
                  FIX MY SIGNAL →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
```

---

## COMPONENT — ORB-01 INTERACTIVE ROBOT

```tsx
// src/components/shared/ORB01.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'

interface ORB01Props {
  size?: number
  eyeIntensity?: number
}

export default function ORB01({ size = 300, eyeIntensity = 1 }: ORB01Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const eyeGlowRef  = useRef<HTMLDivElement>(null)
  const eyeOuterRef = useRef<HTMLDivElement>(null)
  const [isIdle, setIsIdle] = useState(true)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleAngle = useRef(0)

  // Draw robot on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawORB01(ctx, size, size * (480/300), eyeIntensity)
  }, [size, eyeIntensity])

  // Idle head sway animation
  useAnimationFrame((_, delta) => {
    if (!isIdle || !canvasRef.current) return
    idleAngle.current += delta * 0.0005
  })

  const startIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    setIsIdle(false)
    idleTimer.current = setTimeout(() => setIsIdle(true), 3000)
  }

  useEffect(() => {
    window.addEventListener('mousemove', startIdleTimer)
    return () => {
      window.removeEventListener('mousemove', startIdleTimer)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [])

  const H = size * (480 / 300)

  return (
    <div className="relative" style={{ width: size, height: H }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={H}
        className="absolute inset-0"
      />

      {/* Eye glow overlays */}
      <div
        ref={eyeGlowRef}
        className="absolute pointer-events-none mix-blend-screen animate-eye-pulse"
        style={{
          top:    `${H * 0.215 - 25}px`,
          left:   `${size * 0.5 - 25 + 4}px`,
          width:  50, height: 50,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,110,40,0.9) 0%, rgba(255,60,5,0.4) 40%, transparent 70%)',
          filter: 'blur(2px)',
        }}
      />
      <div
        ref={eyeOuterRef}
        className="absolute pointer-events-none mix-blend-screen animate-eye-pulse [animation-delay:0.1s]"
        style={{
          top:    `${H * 0.215 - 45}px`,
          left:   `${size * 0.5 - 45 + 4}px`,
          width:  90, height: 90,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,90,10,0.18) 0%, transparent 65%)',
          filter: 'blur(8px)',
        }}
      />
    </div>
  )
}

// Canvas drawing function — renders ORB-01 robot
function drawORB01(ctx: CanvasRenderingContext2D, W: number, H: number, eyeIntensity = 1) {
  ctx.clearRect(0, 0, W, H)
  ctx.save()

  // Ground glow
  const gg = ctx.createRadialGradient(W/2, H-5, 0, W/2, H-5, 130)
  gg.addColorStop(0, 'rgba(255,100,30,0.18)')
  gg.addColorStop(1, 'transparent')
  ctx.fillStyle = gg
  ctx.fillRect(0, H-130, W, 130)

  const limb = (x: number, y: number, w: number, h: number, r: number, topColor: string, botColor: string) => {
    const g = ctx.createLinearGradient(x-w/2, y, x+w/2, y)
    g.addColorStop(0, topColor)
    g.addColorStop(1, botColor)
    ctx.fillStyle = g
    ctx.shadowColor = 'rgba(0,0,0,0.25)'
    ctx.shadowBlur  = 10
    ctx.beginPath()
    ctx.roundRect(x-w/2, y, w, h, r)
    ctx.fill()
    ctx.shadowBlur = 0
    const hl = ctx.createLinearGradient(x-w/2, y, x+w/2, y)
    hl.addColorStop(0, 'rgba(255,255,255,0.18)')
    hl.addColorStop(0.5, 'rgba(255,255,255,0.05)')
    hl.addColorStop(1, 'rgba(0,0,0,0.1)')
    ctx.fillStyle = hl
    ctx.beginPath()
    ctx.roundRect(x-w/2, y, w, h, r)
    ctx.fill()
  }

  // LEGS
  limb(W*.36, H*.60, 36, H*.24, 6, '#C8C8C5', '#B8B8B5')
  ctx.fillStyle = '#9E9E9C'
  ctx.beginPath(); ctx.arc(W*.36, H*.73, 11, 0, Math.PI*2); ctx.fill()
  limb(W*.36, H*.73, 30, H*.17, 5, '#C4C4C0', '#B4B4B0')
  ctx.fillStyle = '#1C1C1C'
  ctx.beginPath(); ctx.roundRect(W*.36-21, H*.89, 42, 16, 4); ctx.fill()

  limb(W*.64, H*.60, 36, H*.24, 6, '#C4C4C2', '#B4B4B2')
  ctx.fillStyle = '#9A9A98'
  ctx.beginPath(); ctx.arc(W*.64, H*.73, 11, 0, Math.PI*2); ctx.fill()
  limb(W*.64, H*.73, 30, H*.17, 5, '#C0C0BC', '#B0B0AC')
  ctx.fillStyle = '#1C1C1C'
  ctx.beginPath(); ctx.roundRect(W*.64-21, H*.89, 42, 16, 4); ctx.fill()

  // TORSO
  const tg = ctx.createLinearGradient(W*.28, H*.38, W*.72, H*.38)
  tg.addColorStop(0, '#C8C8C6'); tg.addColorStop(.5, '#E8E8E6'); tg.addColorStop(1, '#B8B8B6')
  ctx.fillStyle = tg; ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 14
  ctx.beginPath(); ctx.roundRect(W*.28, H*.38, W*.44, H*.24, 10); ctx.fill(); ctx.shadowBlur = 0
  const th = ctx.createLinearGradient(W*.28, H*.38, W*.28, H*.44)
  th.addColorStop(0, 'rgba(255,255,255,0.2)'); th.addColorStop(1, 'transparent')
  ctx.fillStyle = th; ctx.beginPath(); ctx.roundRect(W*.28, H*.38, W*.44, H*.10, 10); ctx.fill()
  ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.beginPath(); ctx.roundRect(W*.36, H*.43, W*.28, H*.09, 5); ctx.fill()
  const cg = ctx.createRadialGradient(W*.5, H*.465, 0, W*.5, H*.465, 14)
  cg.addColorStop(0, `rgba(255,120,40,${0.25*eyeIntensity})`); cg.addColorStop(1, 'transparent')
  ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(W*.5, H*.465, 14, 0, Math.PI*2); ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 0.8
  ;[[W*.34,H*.49,W*.66,H*.49],[W*.36,H*.53,W*.64,H*.53]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke()
  })

  // SHOULDERS
  ;[W*.27, W*.73].forEach(sx => {
    ctx.fillStyle = '#AAAAAA'; ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 8
    ctx.beginPath(); ctx.arc(sx, H*.40, 17, 0, Math.PI*2); ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.shadowBlur = 0
    ctx.beginPath(); ctx.arc(sx-3, H*.40-3, 9, 0, Math.PI*2); ctx.fill()
  })

  // ARMS — RAISED (recognition posture)
  limb(W*.17, H*.33, 24, H*.12, 5, '#C4C4C2', '#B4B4B2')
  ctx.fillStyle = '#9A9A98'; ctx.beginPath(); ctx.arc(W*.17, H*.33+H*.12, 9, 0, Math.PI*2); ctx.fill()
  limb(W*.10, H*.44, 20, H*.11, 5, '#BEBEBC', '#AEAEAC')
  ctx.fillStyle = '#ABABAA'; ctx.beginPath(); ctx.roundRect(W*.04, H*.54, 32, 24, 5); ctx.fill()
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#A8A8A6'; ctx.beginPath(); ctx.roundRect(W*.05+i*7, H*.54, 5, 20, 2); ctx.fill()
  }

  limb(W*.83, H*.33, 24, H*.12, 5, '#C0C0BE', '#B0B0AE')
  ctx.fillStyle = '#969694'; ctx.beginPath(); ctx.arc(W*.83, H*.33+H*.12, 9, 0, Math.PI*2); ctx.fill()
  limb(W*.90, H*.44, 20, H*.11, 5, '#BABAB8', '#AAAAA8')
  ctx.fillStyle = '#A7A7A6'; ctx.beginPath(); ctx.roundRect(W*.88, H*.54, 32, 24, 5); ctx.fill()
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#A4A4A2'; ctx.beginPath(); ctx.roundRect(W*.89+i*7, H*.54, 5, 20, 2); ctx.fill()
  }

  // HEAD — large ceramic sphere
  const hg = ctx.createRadialGradient(W*.46, H*.19, 0, W*.50, H*.215, 68)
  hg.addColorStop(0, '#FFFFFF'); hg.addColorStop(.4, '#EEEEEC')
  hg.addColorStop(.85, '#D2D2D0'); hg.addColorStop(1, '#BCBCBA')
  ctx.fillStyle = hg; ctx.shadowColor = 'rgba(0,0,0,0.22)'; ctx.shadowBlur = 18
  ctx.beginPath(); ctx.arc(W*.50, H*.215, 68, 0, Math.PI*2); ctx.fill(); ctx.shadowBlur = 0
  const hhl = ctx.createRadialGradient(W*.42, H*.165, 0, W*.42, H*.165, 38)
  hhl.addColorStop(0, 'rgba(255,255,255,0.5)'); hhl.addColorStop(1, 'transparent')
  ctx.fillStyle = hhl; ctx.beginPath(); ctx.arc(W*.42, H*.165, 38, 0, Math.PI*2); ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.07)'; ctx.lineWidth = 0.6
  ;[[W*.42,H*.10,W*.56,H*.19],[W*.58,H*.14,W*.60,H*.25],[W*.34,H*.22,W*.44,H*.29]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke()
  })

  // OPTICAL LENS — EYE
  ctx.fillStyle = '#1A1412'
  ctx.beginPath(); ctx.arc(W*.50, H*.215, 30, 0, Math.PI*2); ctx.fill()
  ctx.strokeStyle = '#888888'; ctx.lineWidth = 3.5
  ctx.beginPath(); ctx.arc(W*.50, H*.215, 28, 0, Math.PI*2); ctx.stroke()
  const ir = ctx.createRadialGradient(W*.50, H*.215, 0, W*.50, H*.215, 22)
  const ib = eyeIntensity
  ir.addColorStop(0, `rgba(255,255,${Math.round(200*ib)},${ib})`)
  ir.addColorStop(.15, `rgba(255,${Math.round(180*ib)},${Math.round(60*ib)},${ib})`)
  ir.addColorStop(.4, `rgba(255,${Math.round(100*ib)},20,${ib})`)
  ir.addColorStop(.7, `rgba(${Math.round(200*ib)},40,0,${ib})`)
  ir.addColorStop(1, `rgba(30,5,0,${ib})`)
  ctx.fillStyle = ir; ctx.beginPath(); ctx.arc(W*.50, H*.215, 22, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.beginPath(); ctx.arc(W*.50, H*.215, 7, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = `rgba(255,255,220,${0.75*ib})`
  ctx.beginPath(); ctx.arc(W*.47, H*.207, 3, 0, Math.PI*2); ctx.fill()

  // NECK
  const ng = ctx.createLinearGradient(W*.42, H*.285, W*.58, H*.285)
  ng.addColorStop(0, '#999'); ng.addColorStop(1, '#888')
  ctx.fillStyle = ng; ctx.beginPath(); ctx.roundRect(W*.42, H*.285, W*.16, H*.045, 4); ctx.fill()

  ctx.restore()
}
```

---

## COMPONENT — TRUST TICKER

```tsx
// src/components/sections/TickerSection.tsx
'use client'

const items = [
  { text: 'Indianapolis Colts', highlight: true  },
  { text: 'Horsepower Theme Campaign', highlight: false },
  { text: 'Louis Vuitton AI Contest Win', highlight: true  },
  { text: 'Red Print Magazine Cover', highlight: false },
  { text: '#17 of 8,500+ AI Creators', highlight: true  },
  { text: 'A Few Good Men · National Tour', highlight: false },
  { text: 'AEO · llms.txt · AI Bot Access', highlight: true  },
  { text: 'Seedance 2.0 Production', highlight: false },
]

const allItems = [...items, ...items] // duplicate for seamless loop

export default function TickerSection() {
  return (
    <div className="bg-charcoal border-y border-yellow/8 py-3.5 overflow-hidden">
      <div className="flex gap-0 animate-ticker whitespace-nowrap">
        {allItems.map((item, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-5 px-5 font-display text-sm tracking-[0.1em] flex-shrink-0
              ${item.highlight ? 'text-white/55' : 'text-white/20'}`}
          >
            {item.text}
            <span className="w-1 h-1 rounded-full bg-orange flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}
```

---

## COMPONENT — REVEAL WRAPPER

```tsx
// src/components/shared/RevealWrapper.tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export default function RevealWrapper({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36, rotateX: -12 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  )
}
```

---

## COMPONENT — PROBLEM SECTION

```tsx
// src/components/sections/ProblemSection.tsx
'use client'

import RevealWrapper from '@/components/shared/RevealWrapper'
import ScanDemo from '@/components/shared/ScanDemo'

export default function ProblemSection() {
  return (
    <section id="problem" className="bg-cream">
      <div className="max-w-[1300px] mx-auto px-12 py-24">
        <RevealWrapper>
          <div className="flex items-center gap-2 font-mono text-[8px] text-charcoal/30 tracking-[0.32em] uppercase mb-3">
            <span className="w-5 h-px bg-orange/50" />
            The Problem
          </div>
          <h2 className="font-display text-[58px] leading-[0.9] uppercase text-charcoal">
            GREAT BUSINESS.<br/>
            <span className="text-orange">WEAK</span> SIGNAL.
          </h2>
        </RevealWrapper>

        <div className="grid grid-cols-2 gap-20 items-center mt-14">
          <RevealWrapper delay={0.1}>
            <p className="font-mono text-[10px] text-charcoal/40 leading-[2] italic">
              AI engines are making recommendations, booking appointments, and routing
              customers right now. Most local businesses don't appear in a single result —
              not because they're bad, but because AI literally cannot read them.
            </p>
            <div className="flex border border-charcoal/10 mt-7">
              {[
                { num: '<1%', label: 'Have llms.txt' },
                { num: '4M',  label: 'AI Searches Per Day' },
                { num: '0',   label: 'Avg. Citations Found' },
              ].map(({ num, label }) => (
                <div key={label} className="flex-1 px-5 py-5 border-r border-charcoal/10 last:border-r-0 text-center">
                  <div className="font-display text-4xl text-charcoal leading-none">{num}</div>
                  <div className="font-mono text-[7px] text-charcoal/35 tracking-[0.15em] uppercase mt-1 leading-snug">{label}</div>
                </div>
              ))}
            </div>
          </RevealWrapper>

          <RevealWrapper delay={0.2}>
            <ScanDemo />
          </RevealWrapper>
        </div>
      </div>
    </section>
  )
}
```

---

## COMPONENT — SCAN DEMO CARD

```tsx
// src/components/shared/ScanDemo.tsx
'use client'

const findings = [
  { name: 'AI bot access (GPTBot)', status: 'BLOCKED', type: 'bad' },
  { name: 'llms.txt file',          status: 'MISSING', type: 'bad' },
  { name: 'Schema markup',          status: 'ABSENT',  type: 'bad' },
  { name: 'LLM citations — 4 platforms', status: '0 FOUND', type: 'bad' },
  { name: 'Google rating',          status: '4.8 ★ STRONG', type: 'ok' },
  { name: 'Social presence',        status: 'WEAK',    type: 'warn' },
]

export default function ScanDemo() {
  return (
    <div className="bg-cream-2 border border-charcoal/10 rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-4.5 py-3.5 border-b border-charcoal/10">
        <span className="font-mono text-[8px] text-charcoal/40 tracking-[0.2em] uppercase">Live AI Visibility Scan</span>
        <span className="flex items-center gap-1.5 font-mono text-[8px] text-pink tracking-[0.1em]">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
          Scanning
        </span>
      </div>
      <div className="px-4.5 py-3.5 flex flex-col gap-1.5">
        {findings.map(({ name, status, type }) => (
          <div
            key={name}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-[3px] border
              ${type === 'bad'  ? 'border-l-2 border-l-pink/35 border-charcoal/8 bg-pink/[0.02]'   : ''}
              ${type === 'ok'   ? 'border-l-2 border-l-teal/35 border-charcoal/8 bg-teal/[0.02]'   : ''}
              ${type === 'warn' ? 'border-charcoal/10 bg-white' : ''}
            `}
          >
            <span className="text-sm font-body text-charcoal">{name}</span>
            <span className={`font-mono text-[8px] font-bold px-2 py-1 rounded-[2px]
              ${type === 'bad'  ? 'bg-pink/10 text-pink'   : ''}
              ${type === 'ok'   ? 'bg-teal/10 text-teal'   : ''}
              ${type === 'warn' ? 'bg-orange/10 text-orange' : ''}
            `}>
              {status}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-4.5 py-4 border-t border-charcoal/10">
        <div>
          <div className="font-mono text-[7px] text-charcoal/30 tracking-[0.2em] uppercase">AI Visibility Score</div>
          <div className="font-display text-[44px] text-pink leading-none">23</div>
        </div>
        <div className="flex-1 h-1 bg-charcoal/10 rounded-full mx-4 overflow-hidden">
          <div className="h-full w-[23%] rounded-full" style={{ background: 'linear-gradient(90deg, #FF1177, #FF7A45)' }} />
        </div>
        <div className="font-mono text-[8px] text-charcoal/35 italic">Recoverable in 7 days →</div>
      </div>
    </div>
  )
}
```

---

## COMPONENT — PRICING SECTION

```tsx
// src/components/sections/PricingSection.tsx
'use client'

import { motion } from 'framer-motion'
import RevealWrapper from '@/components/shared/RevealWrapper'

const tiers = [
  {
    tag:    'Signal Starter',
    name:   '7-Day Rebuild',
    ideal:  'Score 0–54 · Invisible · Cold default',
    price:  '$1,250',
    cadence:'one-time sprint',
    accent: 'orange-2',
    desc:   'Fast diagnostic and first visibility layer. Everything delivered in 7 days so you see the signal move before committing to anything ongoing.',
    items: [
      'Full AI Visibility Score audit — Day 1',
      'llms.txt built and deployed — Day 2',
      'AI bot access fixed — Day 2',
      'Schema markup: Org + LocalBusiness — Day 3',
      '1 custom landing page — AI-optimized — Day 4–5',
      '1 UGC video ad via Seedance — Day 4–5',
      '5 priority citation submissions — Day 6',
      '90-day handoff action plan — Day 7',
    ],
    cta:    'START THE REBUILD',
    featured: false,
  },
  {
    tag:    'AI Visibility Foundation',
    name:   'Full Build',
    ideal:  'Score 55–100 · Ready to grow · Flagship',
    price:  '$2,500',
    cadence:'one-time full build',
    accent: 'charcoal',
    desc:   'The complete Mental Vision system. Full audit, full technical fix, full cinematic content package — everything needed to become the AI-recommended business in your market.',
    items: [
      'Full LLM audit — 5 AI platforms',
      'llms.txt + robots.txt fully configured',
      'Complete schema installation — 6 types',
      '1 AI-optimized landing page — Meta-ready',
      'Meta ad copy — 5 headlines, 3 body variants',
      '1 UGC video ad (30–60 sec) via Seedance',
      'Custom branded score card visual asset',
      'Social media starter pack — 5 platforms',
      '30-day before/after AI visibility report',
    ],
    cta:    'BUILD THE FOUNDATION',
    featured: true,
  },
  {
    tag:    'Stay Found System',
    name:   'Retention',
    ideal:  'Post-build only · Never cold · Score 55–74',
    price:  '$797',
    cadence:'per month · cancel anytime',
    accent: 'teal',
    desc:   'Continuous monitoring and creative refresh so your signal stays strong as AI platforms evolve and competitors catch up. The post-build protection layer.',
    items: [
      'Monthly AI visibility monitoring — 5 platforms',
      'Monthly score report with competitor data',
      '2 UGC content drops per month',
      '5 new authority citations monthly',
      '1 AI-optimized blog post per month',
      '8 branded social posts per month',
      'Quarterly landing page refresh',
      'Monthly 20-min strategy call',
    ],
    cta:    'STAY FOUND',
    featured: false,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-cream">
      <div className="max-w-[1300px] mx-auto px-12 py-24">
        <RevealWrapper>
          <div className="flex items-center gap-2 font-mono text-[8px] text-charcoal/30 tracking-[0.32em] uppercase mb-3">
            <span className="w-5 h-px bg-orange/50" />
            Signal Flare Pricing
          </div>
          <h2 className="font-display text-[58px] leading-[0.9] uppercase text-charcoal">
            THREE OFFERS.<br/>ONE RIGHT FIT.
          </h2>
        </RevealWrapper>

        <div className="grid grid-cols-3 gap-4 mt-12">
          {tiers.map((tier, i) => (
            <RevealWrapper key={tier.name} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-[4px] p-8 border flex flex-col h-full
                  ${tier.featured
                    ? 'border-orange bg-gradient-to-b from-white to-orange/[0.03] shadow-[0_0_0_1px_theme(colors.orange)]'
                    : 'border-charcoal/10 bg-white'
                  }`}
              >
                {tier.featured && (
                  <div className="absolute top-3.5 right-3.5 font-mono text-[7px] text-orange tracking-[0.2em]
                                  px-2 py-1 bg-orange/10 border border-orange/20 rounded-[2px]">
                    ★ FLAGSHIP
                  </div>
                )}
                <div className="font-mono text-[8px] text-charcoal/35 tracking-[0.15em] mb-2">{tier.tag}</div>
                <div className="font-display text-2xl text-charcoal mb-1.5">{tier.name}</div>
                <div className="font-mono text-[8px] text-charcoal/30 tracking-[0.1em] mb-5 pb-5 border-b border-charcoal/10">
                  {tier.ideal}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`font-display text-[52px] leading-none
                    ${tier.accent === 'orange-2' ? 'text-orange-2' :
                      tier.accent === 'teal'      ? 'text-teal'    : 'text-charcoal'}`}>
                    {tier.price}
                  </span>
                </div>
                <div className="font-mono text-[9px] text-charcoal/35 tracking-[0.1em] mb-4">{tier.cadence}</div>
                <p className="text-[12px] text-charcoal/40 font-light leading-relaxed mb-6 flex-shrink-0">
                  {tier.desc}
                </p>
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {tier.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-[12px] text-charcoal/50 font-light leading-snug">
                      <span className={`font-mono text-[9px] mt-0.5 flex-shrink-0
                        ${tier.accent === 'orange-2' ? 'text-orange-2' :
                          tier.accent === 'teal'      ? 'text-teal'    : 'text-charcoal'}`}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="#cta"
                  className={`block text-center font-display text-base tracking-wide py-3.5 rounded-[2px]
                    transition-all duration-200 mt-auto
                    ${tier.featured
                      ? 'bg-charcoal text-cream hover:bg-orange'
                      : tier.accent === 'teal'
                        ? 'border border-teal text-teal hover:bg-teal hover:text-white'
                        : 'border border-orange-2 text-orange-2 hover:bg-orange-2 hover:text-white'
                    }`}
                >
                  {tier.cta}
                </a>
              </motion.div>
            </RevealWrapper>
          ))}
        </div>

        <RevealWrapper delay={0.4}>
          <p className="font-mono text-[8px] text-charcoal/30 tracking-[0.12em] text-center mt-6 pt-5 border-t border-charcoal/8">
            Guarantee: <span className="text-orange">Delivery-based only</span> — never rankings, leads, or revenue. You keep everything built.
          </p>
        </RevealWrapper>
      </div>
    </section>
  )
}
```

---

## COMPONENT — CTA SECTION

```tsx
// src/components/sections/CTASection.tsx
'use client'

import RevealWrapper from '@/components/shared/RevealWrapper'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function CTASection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="cta" className="bg-charcoal relative overflow-hidden py-28 px-12 text-center">
      {/* Background radial */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.22,1,0.36,1] }}
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255,122,69,0.07) 0%, transparent 70%)'
        }}
        ref={ref}
      />

      <div className="max-w-[900px] mx-auto relative z-10">
        <RevealWrapper>
          <div className="font-mono text-[8px] text-white/20 tracking-[0.35em] uppercase mb-5">
            The next AI search is happening right now
          </div>
        </RevealWrapper>
        <RevealWrapper delay={0.1}>
          <h2 className="font-serif text-[52px] text-white leading-[1.05] mb-5">
            Can AI find your business{' '}
            <em className="text-yellow not-italic">right now?</em>
          </h2>
        </RevealWrapper>
        <RevealWrapper delay={0.2}>
          <p className="font-mono text-[10px] text-white/25 leading-[2] italic mb-10">
            We scan the signals, expose the gaps, and show exactly what needs to be fixed first.<br/>
            No call required. No pitch. Just your AI Visibility Score — and a clear path forward.
          </p>
        </RevealWrapper>
        <RevealWrapper delay={0.3}>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="mailto:create@mentalvision.ai"
              className="font-display text-lg tracking-wide px-10 py-4 rounded-[2px]
                         bg-orange text-white hover:bg-orange-2 transition-colors"
            >
              RUN MY VISIBILITY SCAN →
            </a>
            <a
              href="#check"
              className="font-mono text-[10px] tracking-[0.2em] uppercase px-7 py-4 rounded-[2px]
                         border border-white/18 text-white/45 hover:border-white/50 hover:text-white
                         transition-colors"
            >
              See What AI Sees
            </a>
          </div>
        </RevealWrapper>
      </div>
    </section>
  )
}
```

---

## SPLINE INTEGRATION (Optional — for 3D ORB-01)

```tsx
// src/components/ui/spline-scene.tsx
'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-orange animate-pulse" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}

// Usage: Replace ORB01 canvas with Spline scene when 3D model is ready
// <SplineScene scene="https://prod.spline.design/YOUR_SCENE/scene.splinecode" className="w-full h-full" />
```

---

## REMAINING SECTIONS — IMPLEMENTATION NOTES

Claude Code should implement these remaining sections following the same patterns:

### ServicesSection.tsx
- Dark background `charcoal`
- 3-column grid of service cards
- Staggered entrance with `RevealWrapper`
- Services: AI Visibility · Authority Pages · Cinematic Creative
- Each card: numbered, icon, title, body, colored tag

### CheckSection.tsx
- Cream-2 background
- 3×2 grid of scan category cards
- Alternating rotateY entrance (left cards from left, right from right)
- 6 categories: AI Search Presence · Crawl Readiness · Entity Clarity · Review Signal · Authority Content · Conversion Proof
- Each: number, icon, status badge, title, body

### WorkSection.tsx
- Cream background
- 3 work cards in a row
- Cards: Indianapolis Colts (Real Work) · Louis Vuitton AI Campaign (Real Work) · HVAC Demo (Concept Build — labeled)
- Hover: translateY(-4px) + shadow lift

### StatsSection.tsx
- Dark background `charcoal`
- 4 stat blocks in a row
- Numbers: #17 · <1% · 4M · 3
- Counter animation with Framer Motion on scroll entry
- Colored accents per stat (yellow/pink/blue/orange)

### ProcessSection.tsx
- Cream-2 background
- 4 horizontal steps in a bordered grid
- Steps: SCAN · SCORE · FIX · CREATE
- Large background numbers (01-04) at low opacity
- Staggered cascade entrance left to right

### FooterSection.tsx
- `charcoal-2` background
- 4-column grid: brand info · Services · Company · Connect
- Brand: MENTAL**VISION** logo in cream/orange
- Email: create@mentalvision.ai
- Footer bar: copyright + Signal Flare version note

---

## IMPLEMENTATION PRIORITIES FOR CLAUDE CODE

1. **Scaffold the project** using the Quick Start commands
2. **Place the video** at `/public/video/signal-flare-hero.mp4`
3. **Implement the layout files** (layout.tsx, globals.css, tailwind.config.ts)
4. **Build HeroSection first** — this is the hero experience
5. **Implement ORB01 canvas robot** — test mouse tracking
6. **Add Navigation** with scroll-based visibility
7. **Build all sections** from top to bottom using RevealWrapper
8. **Add PricingSection** with the correct Signal Flare prices ($1,250 / $2,500 / $797)
9. **Wire up CTASection** with mailto:create@mentalvision.ai
10. **Test mobile responsiveness** — add responsive breakpoints

---

## BRAND RULES — NEVER VIOLATE

- **Prices are canonical:** $1,250 · $2,500 · $797/mo — never change these
- **NOT pure black backgrounds** — use `#0A0806` (near-black) for dark moments
- **Fonts are non-negotiable:** Bebas Neue · DM Serif Display · DM Mono · Barlow Condensed
- **The robot's eye is orange** — `#FF6B35` — never change
- **Pink is for alerts only** — `#FF1177` — never for decorative use
- **Work section labels:** "Real Work" for Colts and LV, "Concept Build" for demos
- **Email:** create@mentalvision.ai — never change
- **No SEO/analytics framing** — this is a visual storyteller and AI creative pioneer

---

## KNOWN ISSUES + SOLUTIONS

**Video doesn't autoplay on mobile:**
Add `playsInline` and `muted` attributes (already included). iOS requires user gesture for autoplay with sound — keep video muted.

**Canvas robot blurry on retina:**
```tsx
const dpr = window.devicePixelRatio || 1
canvas.width  = size * dpr
canvas.height = H    * dpr
ctx.scale(dpr, dpr)
```

**Ticker animation flickers:**
Ensure `animation-timing-function: linear` and use `will-change: transform` on the ticker track.

**Framer Motion and `use client` errors:**
All components using Framer Motion must have `'use client'` directive at the top.

---

*Mental Vision Corp · Signal Flare Website · Claude Code Handoff Package · v1.0 · May 2026*
*Stack: Next.js 14 · shadcn/ui · Tailwind CSS · TypeScript · Framer Motion*
*Contact: create@mentalvision.ai · www.mentalvision.ai*
