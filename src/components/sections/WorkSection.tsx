'use client'

import RevealWrapper from '@/components/shared/RevealWrapper'
import { motion } from 'framer-motion'

const projects = [
  {
    badge: 'Real Work', client: 'Indianapolis Colts · NFL', name: 'HORSEPOWER',
    desc: 'Official theme song video · Cinematic AI production · Ongoing collaboration',
    bg: 'bg-gradient-to-br from-[#0A1520] to-[#1A2830]',
    visual: '🐎', visualClass: 'font-display text-5xl', href: '#',
  },
  {
    badge: 'Real Work', client: 'Louis Vuitton · Luxury Fashion', name: 'LV AI CAMPAIGN',
    desc: 'Global AI campaign contest winner · Visual identity + creative direction',
    bg: 'bg-gradient-to-br from-[#1A1008] to-[#2A1A05]',
    visual: 'LV', visualClass: 'font-display text-[52px] text-[rgba(218,180,0,0.25)] tracking-[0.2em] leading-none', href: '#',
  },
  {
    badge: 'Concept Build', client: 'HVAC · Indianapolis · Demo', name: 'ZERO TO FOUND',
    desc: 'AEO demo build — 23/100 → 78/100 transformation in 7 days',
    bg: 'bg-gradient-to-br from-[#2A2620] to-[#3A352C]',
    visual: '78', visualClass: 'font-display text-[64px] text-orange/30 leading-none', href: '#',
  },
]

export default function WorkSection() {
  return (
    <section id="work" className="bg-bg py-20 md:py-24 px-6 md:px-12">
      <div className="max-w-[1300px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <RevealWrapper>
            <div className="flex items-center gap-2 font-mono text-[8px] text-ink/30 tracking-[0.32em] uppercase mb-3">
              <span className="w-5 h-px bg-orange/50" />
              Proof + Concepts
            </div>
            <h2 className="font-display uppercase text-ink leading-[0.9] text-[clamp(38px,7vw,58px)]">
              SIGNAL<br/>BUILDS.
            </h2>
          </RevealWrapper>
          <a href="#" className="font-mono text-[9px] text-ink/30 tracking-[0.2em] uppercase hover:text-orange transition-colors">
            View All →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <RevealWrapper key={p.name} delay={i * 0.12} className="h-full">
              <motion.a
                href={p.href}
                whileHover={{ y: -4 }}
                className="block bg-surface border border-ink/10 rounded-sm overflow-hidden group h-full"
              >
                <div className={`h-[210px] relative flex items-center justify-center ${p.bg}`}>
                  <span className={`${p.badge === 'Concept Build' ? 'border-orange/25 text-orange bg-orange/12' : 'border-teal/30 text-teal bg-teal/15'}
                    absolute top-3.5 left-3.5 font-mono text-[7px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-[2px] border`}>
                    {p.badge}
                  </span>
                  <span className={p.visualClass}>{p.visual}</span>
                </div>
                <div className="px-5 py-5 pb-3.5">
                  <div className="font-mono text-[8px] text-ink/30 tracking-[0.18em] uppercase mb-1.5">{p.client}</div>
                  <div className="font-display text-[22px] text-ink mb-1">{p.name}</div>
                  <div className="text-[11px] text-ink/40 font-light">{p.desc}</div>
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-t border-ink/10">
                  <span className="font-mono text-[8px] text-ink/30 tracking-[0.15em] uppercase">View Project</span>
                  <span className="text-ink/20 group-hover:text-orange group-hover:translate-x-1 transition-all">→</span>
                </div>
              </motion.a>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
