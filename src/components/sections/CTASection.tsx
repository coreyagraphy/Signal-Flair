'use client'

import RevealWrapper from '@/components/shared/RevealWrapper'
import LiquidGlass from '@/components/shared/LiquidGlass'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function CTASection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="cta" className="bg-feature relative overflow-hidden py-24 md:py-28 px-6 md:px-12 text-center">
      <motion.div
        ref={ref}
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.22,1,0.36,1] }}
        style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255,122,69,0.10) 0%, transparent 70%)' }}
      />

      <div className="max-w-[900px] mx-auto relative z-10">
        <RevealWrapper>
          <div className="font-mono text-[8px] text-on-feature/30 tracking-[0.35em] uppercase mb-5">
            Signal Flare is the moment you become visible
          </div>
        </RevealWrapper>
        <RevealWrapper delay={0.1}>
          <h2 className="font-serif text-on-feature leading-[1.05] mb-5 text-[clamp(34px,5.5vw,52px)]">
            Can AI find your business{' '}
            <em className="text-yellow not-italic">right now?</em>
          </h2>
        </RevealWrapper>
        <RevealWrapper delay={0.2}>
          <p className="font-mono text-[10px] text-on-feature/30 leading-[2] italic mb-10">
            We scan the dark, expose the gaps, and show exactly what needs to be fixed first.<br/>
            No call required. No pitch. Just your AI Visibility Score — and a clear path forward.
          </p>
        </RevealWrapper>
        <RevealWrapper delay={0.3}>
          <div className="flex gap-3 justify-center flex-wrap">
            <LiquidGlass as="a" href="mailto:create@mentalvision.ai" tint="orange"
               className="font-display text-lg tracking-wide px-10 py-4 rounded-[2px] text-white">
              RUN MY VISIBILITY SCAN →
            </LiquidGlass>
            <LiquidGlass as="a" href="#aeo-audit"
               className="font-mono text-[10px] tracking-[0.2em] uppercase px-7 py-4 rounded-[2px] text-on-feature/60 hover:text-on-feature transition-colors">
              See What AI Sees
            </LiquidGlass>
          </div>
        </RevealWrapper>
      </div>
    </section>
  )
}
