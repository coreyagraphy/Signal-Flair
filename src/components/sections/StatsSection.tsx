'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'
import RevealWrapper from '@/components/shared/RevealWrapper'

const stats = [
  { raw: 17, prefix: '#', suffix: '',  label: 'Global AI Creator Rank', detail: 'Out of 8,500+ creators in the Skool Community.', color: 'text-yellow' },
  { raw: 1,  prefix: '<', suffix: '%', label: 'Have llms.txt',           detail: 'The file we build for every client by Day 2.',   color: 'text-pink' },
  { raw: 4,  prefix: '',  suffix: 'M', label: 'AI Searches Daily',       detail: 'Most businesses appear in zero of them.',        color: 'text-teal' },
  { raw: 3,  prefix: '',  suffix: '',  label: 'Exclusive Services',      detail: 'llms.txt · AI Bot Audit · Agentic Engine Optimization.', color: 'text-orange' },
]

function CountStat({ stat, active }: { stat: typeof stats[0], active: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const end = stat.raw
    const timer = setInterval(() => {
      start += 0.5
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.round(start))
    }, 2400 / (end * 2))
    return () => clearInterval(timer)
  }, [active, stat.raw])
  return (
    <div className={`font-display text-[clamp(40px,6vw,52px)] leading-none mb-1.5 ${stat.color}`}>
      {stat.prefix}{count}{stat.suffix}
    </div>
  )
}

export default function StatsSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <section className="bg-feature py-18 md:py-20 px-6 md:px-12">
      <div className="max-w-[1300px] mx-auto">
        <RevealWrapper>
          <div className="flex items-center gap-2 font-mono text-[8px] text-on-feature/25 tracking-[0.32em] uppercase mb-3">
            <span className="w-5 h-px bg-orange/50" />
            Signal Proof
          </div>
          <h2 className="font-display uppercase text-on-feature leading-[0.9] text-[clamp(38px,7vw,58px)] mb-12">
            THE PROOF<br/>IS REAL.
          </h2>
        </RevealWrapper>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.07)' }}>
          {stats.map((s, i) => (
            <RevealWrapper key={s.label} delay={i * 0.1} className="h-full">
              <div className="bg-feature-2 px-6 md:px-7 py-8 md:py-9 h-full">
                <CountStat stat={s} active={inView} />
                <div className="font-mono text-[8px] text-on-feature/30 tracking-[0.18em] uppercase leading-relaxed">
                  {s.label}
                </div>
                <p className="text-[12px] text-on-feature/25 font-light mt-2 leading-snug">
                  {s.detail}
                </p>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
