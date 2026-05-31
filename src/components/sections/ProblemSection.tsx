'use client'

import RevealWrapper from '@/components/shared/RevealWrapper'
import ScanDemo from '@/components/shared/ScanDemo'

export default function ProblemSection() {
  return (
    <section id="problem" className="bg-bg">
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 py-20 md:py-24">
        <RevealWrapper>
          <div className="flex items-center gap-2 font-mono text-[8px] text-ink/30 tracking-[0.32em] uppercase mb-3">
            <span className="w-5 h-px bg-orange/50" />
            The Blind Spot
          </div>
          <h2 className="font-display uppercase text-ink leading-[0.9] text-[clamp(38px,7vw,58px)]">
            GREAT BUSINESS.<br/>
            <span className="text-orange">WEAK</span> SIGNAL.
          </h2>
        </RevealWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mt-14">
          <RevealWrapper delay={0.1}>
            <p className="font-mono text-[10px] text-ink/45 leading-[2] italic">
              AI engines are making recommendations, booking appointments, and routing
              customers right now. Most local businesses don&apos;t appear in a single result —
              not because they&apos;re bad, but because AI literally cannot read them.
            </p>
            <div className="flex border border-ink/10 mt-7">
              {[
                { num: '<1%', label: 'Have llms.txt' },
                { num: '4M',  label: 'AI Searches Per Day' },
                { num: '0',   label: 'Avg. Citations Found' },
              ].map(({ num, label }) => (
                <div key={label} className="flex-1 px-4 py-5 border-r border-ink/10 last:border-r-0 text-center">
                  <div className="font-display text-3xl md:text-4xl text-ink leading-none">{num}</div>
                  <div className="font-mono text-[7px] text-ink/40 tracking-[0.15em] uppercase mt-1 leading-snug">{label}</div>
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
