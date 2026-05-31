'use client'

import RevealWrapper from '@/components/shared/RevealWrapper'
import { motion } from 'framer-motion'

const services = [
  {
    n: '01', icon: '🔍', title: 'AI Visibility',
    body: 'Make your business impossible to miss in AI search. llms.txt, schema, bot access, citation strategy — all deployed and monitored.',
    tag: 'AEO + llms.txt', color: 'orange',
  },
  {
    n: '02', icon: '📄', title: 'Authority Pages',
    body: 'Turn scattered proof into structured pages AI and customers both trust. Landing pages that convert. Content that feeds the algorithm.',
    tag: 'Content + Conversion', color: 'yellow',
  },
  {
    n: '03', icon: '🎬', title: 'Cinematic Creative',
    body: 'AI-generated, cinema-quality content that stops the scroll and keeps the algorithm fed. UGC video, branded visuals, campaign assets.',
    tag: 'UGC + Brand Film', color: 'teal',
  },
]

export default function ServicesSection() {
  return (
    <section id="creative" className="bg-feature py-20 md:py-24 px-6 md:px-12">
      <div className="max-w-[1300px] mx-auto">
        <RevealWrapper>
          <div className="flex items-center gap-2 font-mono text-[8px] text-on-feature/25 tracking-[0.32em] uppercase mb-3">
            <span className="w-5 h-px bg-orange/50" />
            What Mental Vision Builds
          </div>
          <h2 className="font-display uppercase text-on-feature leading-[0.9] text-[clamp(38px,7vw,58px)]">
            THE SIGNAL<br/>AND THE <span className="text-yellow">SPECTACLE.</span>
          </h2>
        </RevealWrapper>

        <RevealWrapper delay={0.1}>
          <p className="font-mono text-[10px] text-on-feature/30 leading-[1.9] italic max-w-[480px] mt-4 mb-12 md:mb-14">
            AI Visibility gives machines the proof they need to recommend you.
            Cinematic content gives humans the emotion they need to choose you.
            Mental Vision builds both — inside one system.
          </p>
        </RevealWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.07)' }}>
          {services.map((s, i) => (
            <RevealWrapper key={s.n} delay={i * 0.15} className="h-full">
              <motion.div
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                className="bg-feature-2 p-8 md:p-9 transition-colors h-full"
              >
                <div className="font-mono text-[13px] text-on-feature/15 mb-4">{s.n}</div>
                <div className={`w-11 h-11 rounded-md flex items-center justify-center text-lg mb-5 border
                  ${s.color === 'orange' ? 'bg-orange/10 border-orange/20'  : ''}
                  ${s.color === 'yellow' ? 'bg-yellow/10 border-yellow/20'  : ''}
                  ${s.color === 'teal'   ? 'bg-teal/10   border-teal/20'    : ''}`}>
                  {s.icon}
                </div>
                <div className="font-display text-2xl text-on-feature tracking-wide mb-2.5">{s.title}</div>
                <p className="text-[13px] text-on-feature/40 font-light leading-relaxed mb-4">{s.body}</p>
                <span className={`font-mono text-[7px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-[2px]
                  ${s.color === 'orange' ? 'bg-orange/12 text-orange/80' : ''}
                  ${s.color === 'yellow' ? 'bg-yellow/12 text-yellow/80' : ''}
                  ${s.color === 'teal'   ? 'bg-teal/12   text-teal/80'   : ''}`}>
                  {s.tag}
                </span>
              </motion.div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
