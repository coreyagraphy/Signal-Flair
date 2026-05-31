'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import LiquidGlass from '@/components/shared/LiquidGlass'

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  // Gate scroll transforms behind mount: SSR and first client render emit no
  // transform (identity at scroll 0 anyway), avoiding a hydration mismatch.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Progress 0 → 1 as the hero scrolls out of the top of the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Background: strong downward lag + gentle zoom-in → the hero image reads as
  // moving slowly (it holds while the page scrolls past it).
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.22])

  // Foreground exits in a stagger, not as one block:
  //   bottom bar fades first → headline group rises + fades mid → chips drift
  //   slower and linger last. Differing rise speeds = the staggered cascade.
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-44%'])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const chipsY = useTransform(scrollYProgress, [0, 1], ['0%', '-26%'])
  const chipsOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0])
  const barOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  const parallaxOn = mounted && !reduceMotion
  const bgStyle = parallaxOn ? { y: bgY, scale: bgScale } : undefined
  const titleStyle = parallaxOn ? { y: titleY, opacity: titleOpacity } : undefined
  const chipsStyle = parallaxOn ? { y: chipsY, opacity: chipsOpacity } : undefined
  const barStyle = parallaxOn ? { opacity: barOpacity } : undefined

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-feature"
    >
      {/* Parallax background layer — full-bleed looping video + legibility scrims */}
      <motion.div style={bgStyle} className="absolute inset-0 will-change-transform">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/video/signal-flare-hero.mp4"
          poster="/video/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* Drifting cloud haze — two parallax layers over the video */}
        <div className="hero-cloud hero-cloud--far" aria-hidden="true" />
        <div className="hero-cloud hero-cloud--near" aria-hidden="true" />
        {/* Legibility scrim — consistent cinematic dark so copy reads in any OS theme */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 12%, rgba(10,8,6,0.15) 0%, rgba(10,8,6,0.55) 60%, rgba(10,8,6,0.82) 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/5"
          style={{ background: 'linear-gradient(0deg, rgba(10,8,6,0.92) 0%, transparent 100%)' }}
        />
      </motion.div>

      {/* Foreground content */}
      <div className="relative z-10 h-full max-w-[1300px] mx-auto px-6 md:px-12 flex flex-col justify-center">
        {/* Headline group — rises and fades mid-scroll */}
        <motion.div style={titleStyle} className="will-change-transform">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[860px]"
          >
            <div className="flex items-center gap-2.5 font-mono text-[8px] md:text-[9px] text-cream/55 tracking-[0.3em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
              Signal Flare System · Indianapolis
            </div>

            <h1 className="font-display uppercase text-cream leading-[0.86] tracking-[-0.01em]
                           text-[clamp(48px,9vw,128px)]">
              If AI can&apos;t see you,<br />
              <span className="text-orange">customers won&apos;t</span> either.
            </h1>

            <p className="font-serif italic text-cream/75 mt-6 max-w-[560px]
                          text-[clamp(15px,2.2vw,22px)] leading-snug">
              We light up the businesses the algorithm can&apos;t see — then build the proof
              that makes them impossible to miss.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-9">
              <a href="#cta"
                 className="font-display text-base md:text-lg tracking-wide px-8 py-3.5 rounded-[2px]
                            bg-orange text-white hover:bg-orange-2 transition-colors">
                RUN MY VISIBILITY SCAN →
              </a>
              <LiquidGlass as="a" href="#aeo-audit"
                 className="font-mono text-[10px] tracking-[0.22em] uppercase px-6 py-4 rounded-[2px] text-cream/80 hover:text-cream transition-colors">
                See What AI Sees
              </LiquidGlass>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating proof chips — drift slower and linger (staggered exit).
            Outer div handles vertical centering so its transform never collides
            with the scroll-parallax transform on the inner layer. */}
        <div className="hidden md:block absolute right-12 top-1/2 -translate-y-1/2">
          <motion.div style={chipsStyle} className="will-change-transform">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-3"
            >
              <LiquidGlass className="rounded-lg px-4 py-3 animate-float">
                <div>
                  <div className="font-display text-3xl text-orange-2 leading-none">23</div>
                  <div className="font-mono text-[7px] text-cream/45 tracking-[0.15em] uppercase mt-1">AI Score</div>
                  <div className="text-[10px] text-cream/60 font-light">Before Mental Vision</div>
                </div>
              </LiquidGlass>
              <LiquidGlass className="rounded-lg px-4 py-3 animate-float [animation-delay:2s]">
                <div>
                  <div className="font-display text-3xl text-teal leading-none">78</div>
                  <div className="font-mono text-[7px] text-cream/45 tracking-[0.15em] uppercase mt-1">AI Score</div>
                  <div className="text-[10px] text-cream/60 font-light">After 7-Day Rebuild</div>
                </div>
              </LiquidGlass>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom signal bar — pinned to the hero floor, fades first on scroll */}
      <motion.div
        style={barStyle}
        className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between
                   px-6 md:px-12 py-3.5 bg-feature/55 backdrop-blur-md border-t border-cream/8"
      >
        <p className="font-serif text-xs md:text-sm text-cream/45 italic">
          <strong className="text-cream not-italic">Discovery</strong> is the first connection.
        </p>
        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <div className="font-display text-xl md:text-2xl text-yellow leading-none">&lt;1%</div>
            <div className="font-mono text-[7px] text-cream/35 tracking-[0.18em] uppercase mt-0.5">Have llms.txt</div>
          </div>
          <a href="#cta"
             className="font-display text-sm tracking-wide px-5 md:px-6 py-2.5 rounded-[2px]
                        bg-orange text-white hover:bg-orange-2 transition-colors">
            FIX MY SIGNAL →
          </a>
        </div>
      </motion.div>
    </section>
  )
}
