'use client'

import { motion } from 'framer-motion'
import LiquidGlass from '@/components/shared/LiquidGlass'

export default function HeroSection() {
  return (
    <section id="hero" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-feature">
      {/* Full-bleed looping hero video — the standard */}
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

      {/* Legibility scrim — consistent cinematic dark so copy reads in any OS theme */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 12%, rgba(10,8,6,0.15) 0%, rgba(10,8,6,0.55) 60%, rgba(10,8,6,0.82) 100%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-2/5"
           style={{ background: 'linear-gradient(0deg, rgba(10,8,6,0.92) 0%, transparent 100%)' }} />

      {/* Content */}
      <div className="relative z-10 h-full max-w-[1300px] mx-auto px-6 md:px-12 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[860px]"
        >
          <div className="flex items-center gap-2.5 font-mono text-[8px] md:text-[9px] text-cream/55 tracking-[0.3em] uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
            AI Visibility + Cinematic Creative · Indianapolis
          </div>

          <h1 className="font-display uppercase text-cream leading-[0.86] tracking-[-0.01em]
                         text-[clamp(48px,9vw,128px)]">
            If AI can&apos;t see you,<br />
            <span className="text-orange">customers won&apos;t</span> either.
          </h1>

          <p className="font-serif italic text-cream/75 mt-6 max-w-[560px]
                        text-[clamp(15px,2.2vw,22px)] leading-snug">
            We find the businesses the algorithm can&apos;t — then build the signal
            that makes them impossible to ignore.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-9">
            <LiquidGlass as="a" href="#cta" tint="orange"
               className="font-display text-base md:text-lg tracking-wide px-8 py-3.5 rounded-[2px] text-white">
              RUN MY VISIBILITY SCAN →
            </LiquidGlass>
            <LiquidGlass as="a" href="#aeo-audit"
               className="font-mono text-[10px] tracking-[0.22em] uppercase px-6 py-4 rounded-[2px] text-cream/80 hover:text-cream transition-colors">
              See What AI Sees
            </LiquidGlass>
          </div>
        </motion.div>

        {/* Floating proof chips */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-3"
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
      </div>

      {/* Bottom signal bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between
                      px-6 md:px-12 py-3.5 bg-feature/55 backdrop-blur-md border-t border-cream/8">
        <p className="font-serif text-xs md:text-sm text-cream/45 italic">
          <strong className="text-cream not-italic">Discovery</strong> is the first connection.
        </p>
        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <div className="font-display text-xl md:text-2xl text-yellow leading-none">&lt;1%</div>
            <div className="font-mono text-[7px] text-cream/35 tracking-[0.18em] uppercase mt-0.5">Have llms.txt</div>
          </div>
          <LiquidGlass as="a" href="#cta" tint="orange"
             className="font-display text-sm tracking-wide px-5 md:px-6 py-2.5 rounded-[2px] text-white">
            FIX MY SIGNAL →
          </LiquidGlass>
        </div>
      </div>
    </section>
  )
}
