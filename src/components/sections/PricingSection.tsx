'use client'

import { motion } from 'framer-motion'
import RevealWrapper from '@/components/shared/RevealWrapper'

/* Deliverables, prices, and guarantee strings are CANONICAL —
   sourced verbatim from pipeline/offers.py (REBUILD / FOUNDATION / STAY_FOUND). */
const tiers = [
  {
    tag: 'Signal Starter', name: '7-Day AI Visibility Rebuild',
    ideal: 'Score 0–54 · Invisible / Weak · Cold default',
    price: '$1,250', cadence: 'one-time · 7-day sprint', accent: 'orange-2',
    desc: 'Fast diagnostic and first visibility layer. Everything delivered in 7 business days so you see the signal move before committing to anything ongoing.',
    items: [
      'AI Visibility Score Report — full 7-category audit (Day 1)',
      'llms.txt file built and deployed at your domain (Day 2)',
      'robots.txt AI bot access fix — all AI crawlers unblocked (Day 2)',
      'Schema markup baseline — Organization + LocalBusiness (Day 3)',
      'Custom branded score card visual asset (Day 3)',
      '1 AI-optimized landing page, Meta-ready (Day 4–5)',
      '1 UGC video concept, 30s via Higgsfield Seedance 2.0 (Day 4–5)',
      '90-Day AI Action Plan (Day 7)',
    ],
    guarantee: 'Every asset above delivered within 7 business days, or Mental Vision continues working at no additional cost until complete.',
    cta: 'START THE REBUILD', featured: false,
  },
  {
    tag: 'AI Visibility Foundation', name: 'Full Build',
    ideal: 'Score 55–100 · Ready to grow · Flagship',
    price: '$2,500', cadence: 'one-time full build', accent: 'ink',
    desc: 'The complete Mental Vision system. Full audit, full technical fix, full cinematic content package — everything needed to become the AI-recommended business in your market.',
    items: [
      'Full LLM audit — ChatGPT, Claude, Perplexity, Google AI Overviews, Copilot',
      'llms.txt file built and deployed',
      'AI bot access fix — all AI crawlers unblocked',
      'Schema markup (full) — Organization, LocalBusiness, FAQPage, AggregateRating',
      '1 AI-optimized landing page, Meta-ready',
      'Meta ad copy — 3 headline variants, 2 body variants, keyword-optimized',
      '1 UGC video ad, 30–60s via Higgsfield + Seedance 2.0',
      'Custom branded visual asset — email header or score card',
      'Social media starter pack — 5 platform-native posts',
      '30-Day AI Visibility Report — before/after score comparison',
      'AI Reputation Hub — testimonial-driven /reviews page with Review + FAQPage schema',
    ],
    guarantee: 'Every asset above delivered within the agreed timeline, or Mental Vision continues working at no additional cost until complete.',
    cta: 'BUILD THE FOUNDATION', featured: true,
  },
  {
    tag: 'Stay Found System', name: 'Retention',
    ideal: 'Post-build only · Never cold · Score 55–74',
    price: '$797', cadence: 'per month · cancel anytime', accent: 'teal',
    desc: 'Continuous monitoring and creative refresh so your signal stays strong as AI platforms evolve and competitors catch up. The post-build protection layer.',
    items: [
      'Monthly AI Visibility Scan across all 5 LLM platforms',
      'Monthly Score Report with competitor comparison in your market',
      'llms.txt updates as services, locations, or team change',
      'AI bot access monitoring — alert if anything gets blocked',
      'Entity building — 3 new authority citations submitted monthly',
      '1 AI visibility content update per month (page, FAQ, or schema)',
      '1 UGC content drop per month via Higgsfield',
      '4 branded, platform-appropriate social posts',
      'Monthly report — what changed, improved, needs attention',
      'Quarterly 20-minute strategy review call',
    ],
    guarantee: "If you don't receive every monthly deliverable within the billing period, that month's fee is credited to the next.",
    cta: 'STAY FOUND', featured: false,
  },
]

const accentText = (a: string) =>
  a === 'orange-2' ? 'text-orange-2' : a === 'teal' ? 'text-teal' : 'text-ink'

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-bg">
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 py-20 md:py-24">
        <RevealWrapper>
          <div className="flex items-center gap-2 font-mono text-[8px] text-ink/30 tracking-[0.32em] uppercase mb-3">
            <span className="w-5 h-px bg-orange/50" />
            Signal Flare Pricing
          </div>
          <h2 className="font-display uppercase text-ink leading-[0.9] text-[clamp(38px,7vw,58px)]">
            THREE OFFERS.<br/>ONE RIGHT FIT.
          </h2>
        </RevealWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 items-stretch">
          {tiers.map((tier, i) => (
            <RevealWrapper key={tier.name} delay={i * 0.12} className="h-full">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-[4px] p-7 md:p-8 border flex flex-col h-full bg-surface
                  ${tier.featured
                    ? 'border-orange shadow-[0_0_0_1px_theme(colors.orange),0_24px_60px_rgba(255,122,69,0.12)]'
                    : 'border-ink/10'}`}
              >
                {tier.featured && (
                  <div className="absolute top-3.5 right-3.5 font-mono text-[7px] text-orange tracking-[0.2em]
                                  px-2 py-1 bg-orange/10 border border-orange/20 rounded-[2px]">
                    ★ FLAGSHIP
                  </div>
                )}
                <div className="font-mono text-[8px] text-ink/35 tracking-[0.15em] mb-2">{tier.tag}</div>
                <div className="font-display text-2xl text-ink mb-1.5">{tier.name}</div>
                <div className="font-mono text-[8px] text-ink/35 tracking-[0.1em] mb-5 pb-5 border-b border-ink/10">
                  {tier.ideal}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`font-display text-[clamp(42px,6vw,52px)] leading-none ${accentText(tier.accent)}`}>
                    {tier.price}
                  </span>
                </div>
                <div className="font-mono text-[9px] text-ink/35 tracking-[0.1em] mb-4">{tier.cadence}</div>
                <p className="text-[12px] text-ink/45 font-light leading-relaxed mb-6">{tier.desc}</p>
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {tier.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-[12px] text-ink/55 font-light leading-snug">
                      <span className={`font-mono text-[9px] mt-0.5 flex-shrink-0 ${accentText(tier.accent)}`}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-mono text-[8.5px] text-ink/40 italic leading-[1.7] mb-6 pt-4 border-t border-ink/10">
                  {tier.guarantee}
                </p>
                <a
                  href="#cta"
                  className={`block text-center font-display text-base tracking-wide py-3.5 rounded-[2px]
                    transition-all duration-200 mt-auto
                    ${tier.featured
                      ? 'bg-ink text-bg hover:bg-orange hover:text-white'
                      : tier.accent === 'teal'
                        ? 'border border-teal text-teal hover:bg-teal hover:text-white'
                        : 'border border-orange-2 text-orange-2 hover:bg-orange-2 hover:text-white'}`}
                >
                  {tier.cta}
                </a>
              </motion.div>
            </RevealWrapper>
          ))}
        </div>

        <RevealWrapper delay={0.4}>
          <p className="font-mono text-[8px] text-ink/35 tracking-[0.12em] text-center mt-6 pt-5 border-t border-ink/10">
            Guarantee: <span className="text-orange">Delivery-based only</span> — never rankings, leads, or revenue. You keep everything built.
          </p>
        </RevealWrapper>
      </div>
    </section>
  )
}
