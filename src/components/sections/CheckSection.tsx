'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const categories = [
  { n: '01', icon: '🤖', badge: 'Critical', title: 'AI Search Presence',
    body: 'Can ChatGPT, Claude, Perplexity, Gemini, and Google AI describe your business — or do they draw a blank?' },
  { n: '02', icon: '🚪', badge: 'High',     title: 'Crawl Readiness',
    body: 'Are AI bots allowed to access your site? Most businesses unknowingly block them in robots.txt, locking the door on every AI recommendation.' },
  { n: '03', icon: '🏷️', badge: 'High',     title: 'Entity Clarity',
    body: 'Does the internet clearly understand your business name, location, service area, and category? Ambiguity kills AI recommendations.' },
  { n: '04', icon: '⭐', badge: 'Medium',   title: 'Review Signal',
    body: 'What do customers repeatedly say you\'re great at? AI uses review themes to form descriptions. We extract and structure those themes.' },
  { n: '05', icon: '📝', badge: 'Medium',   title: 'Authority Content',
    body: 'Do you have pages that answer the questions AI engines use when forming recommendations? Service clarity, FAQ depth, local relevance.' },
  { n: '06', icon: '📞', badge: 'Conversion', title: 'Conversion Proof',
    body: 'Once AI sends someone your way — does the page close them? We check if your experience turns interest into a booked call.' },
  { n: '07', icon: '🎬', badge: 'Creative', title: 'Creative Signal',
    body: 'Does your brand have scroll-stopping proof assets AI can understand and humans can feel? We check video, visuals, social, and campaign readiness.' },
]

export default function CheckSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-6% 0px' })

  const badgeColor = (b: string) => {
    if (b === 'Critical') return 'bg-pink/10 text-pink'
    if (b === 'High')     return 'bg-orange/10 text-orange'
    if (b === 'Medium')   return 'bg-orange/10 text-orange'
    if (b === 'Creative') return 'bg-yellow/10 text-yellow'
    return 'bg-teal/10 text-teal'
  }

  return (
    <section id="aeo-audit" className="bg-surface-2 py-20 md:py-24 px-6 md:px-12">
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 font-mono text-[8px] text-ink/30 tracking-[0.32em] uppercase mb-3">
              <span className="w-5 h-px bg-orange/50" />
              Visibility Scan
            </div>
            <h2 className="font-display uppercase text-ink leading-[0.9] text-[clamp(38px,7vw,58px)]">
              WHAT<br/>WE <span className="text-orange">CHECK.</span>
            </h2>
          </div>
          <p className="font-mono text-[9px] text-ink/40 leading-[1.9] max-w-[280px] md:text-right italic">
            Seven signals. Every one determines whether AI recommends your business or your competitor&apos;s.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((c, i) => {
            const even = i % 2 === 0
            return (
              <motion.div
                key={c.n}
                initial={{ opacity: 0, rotateY: even ? 14 : -14, x: even ? 30 : -30, scale: 0.96 }}
                animate={inView ? { opacity: 1, rotateY: 0, x: 0, scale: 1 } : {}}
                transition={{ duration: 0.9, delay: Math.floor(i/2) * 0.09, ease: [0.22,1,0.36,1] }}
                whileHover={{ y: -3 }}
                className="bg-surface border border-ink/10 rounded-sm p-6 md:p-7"
              >
                <div className="font-display text-[48px] text-ink/[0.07] leading-none mb-2.5">{c.n}</div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center text-base bg-bg border border-ink/10">
                    {c.icon}
                  </div>
                  <span className={`font-mono text-[7px] tracking-[0.15em] uppercase px-2 py-1 rounded-[2px] ${badgeColor(c.badge)}`}>
                    {c.badge}
                  </span>
                </div>
                <div className="font-display text-xl text-ink mb-2">{c.title}</div>
                <p className="text-[12px] text-ink/50 font-light leading-relaxed">{c.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
