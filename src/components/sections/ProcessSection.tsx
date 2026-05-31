'use client'

import RevealWrapper from '@/components/shared/RevealWrapper'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  { n: '01', icon: '🔍', color: 'bg-orange', title: 'SCAN',
    body: 'Live audit across ChatGPT, Claude, Perplexity, and Google AI. robots.txt, llms.txt, schema, social — every gap documented with real data and a score from 0–100.' },
  { n: '02', icon: '📊', color: 'bg-yellow', title: 'SCORE',
    body: '7 categories. Real numbers. The score determines your exact plan — what to fix first, what\'s optional, and what\'s actively hurting your AI recommendations right now.' },
  { n: '03', icon: '⚡', color: 'bg-teal',   title: 'FIX',
    body: 'llms.txt deployed, AI bots unblocked, schema installed, citations submitted. Your signal goes live within 48 hours. Measurable before we touch the creative.' },
  { n: '04', icon: '🎬', color: 'bg-pink',   title: 'CREATE',
    body: 'Cinematic content that keeps you found and makes people act — UGC video, landing pages, Meta ad creative, social packs. The algorithm feeds. Your pipeline fills.' },
]

export default function ProcessSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <section className="bg-surface-2 py-20 md:py-24 px-6 md:px-12">
      <div className="max-w-[1300px] mx-auto">
        <RevealWrapper>
          <div className="flex items-center gap-2 font-mono text-[8px] text-ink/30 tracking-[0.32em] uppercase mb-3">
            <span className="w-5 h-px bg-orange/50" />
            How It Works
          </div>
          <h2 className="font-display uppercase text-ink leading-[0.9] text-[clamp(38px,7vw,58px)] mb-12">
            FOUR STEPS.<br/>NO GUESSING.
          </h2>
        </RevealWrapper>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-ink/10">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 45 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22,1,0.36,1] }}
              className="px-7 md:px-8 py-8 md:py-9 border-r border-b border-ink/10"
            >
              <div className="font-display text-[48px] text-ink/[0.06] leading-none mb-3">{s.n}</div>
              <span className="text-lg mb-3.5 block">{s.icon}</span>
              <div className={`w-7 h-0.5 mb-2.5 ${s.color}`} />
              <div className="font-display text-[22px] text-ink tracking-wide mb-2.5">{s.title}</div>
              <p className="font-mono text-[8.5px] text-ink/45 leading-[1.9] italic">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
