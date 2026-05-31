# SIGNAL FLARE — REMAINING COMPONENTS
## Ready-to-paste code for Claude Code
## All files go in src/components/sections/ unless noted

---

## src/lib/utils.ts

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## src/components/sections/ServicesSection.tsx

```tsx
'use client'

import RevealWrapper from '@/components/shared/RevealWrapper'
import { motion } from 'framer-motion'

const services = [
  {
    n: '01',
    icon: '🔍',
    title: 'AI Visibility',
    body: 'Make your business impossible to miss in AI search. llms.txt, schema, bot access, citation strategy — all deployed and monitored.',
    tag: 'AEO + llms.txt',
    color: 'orange',
  },
  {
    n: '02',
    icon: '📄',
    title: 'Authority Pages',
    body: 'Turn scattered proof into structured pages AI and customers both trust. Landing pages that convert. Content that feeds the algorithm.',
    tag: 'Content + Conversion',
    color: 'yellow',
  },
  {
    n: '03',
    icon: '🎬',
    title: 'Cinematic Creative',
    body: 'AI-generated, cinema-quality content that stops the scroll and keeps the algorithm fed. UGC video, branded visuals, campaign assets.',
    tag: 'UGC + Brand Film',
    color: 'teal',
  },
]

export default function ServicesSection() {
  return (
    <section id="creative" className="bg-charcoal py-24 px-12">
      <div className="max-w-[1300px] mx-auto">
        <RevealWrapper>
          <div className="flex items-center gap-2 font-mono text-[8px] text-white/20 tracking-[0.32em] uppercase mb-3">
            <span className="w-5 h-px bg-orange/50" />
            What Mental Vision Builds
          </div>
          <h2 className="font-display text-[58px] leading-[0.9] uppercase text-white">
            THE SIGNAL<br/>AND THE <span className="text-yellow">SPECTACLE.</span>
          </h2>
        </RevealWrapper>

        <RevealWrapper delay={0.1}>
          <p className="font-mono text-[10px] text-white/25 leading-[1.9] italic max-w-[480px] mt-4 mb-14">
            AI Visibility gives machines the proof they need to recommend you.
            Cinematic content gives humans the emotion they need to choose you.
            Mental Vision builds both — inside one system.
          </p>
        </RevealWrapper>

        <div
          className="grid grid-cols-3 gap-px"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          {services.map((s, i) => (
            <RevealWrapper key={s.n} delay={i * 0.15}>
              <motion.div
                whileHover={{ background: '#32302E' }}
                className="bg-charcoal-2 p-9 transition-colors"
              >
                <div className="font-mono text-[13px] text-white/15 mb-4">{s.n}</div>
                <div className={`w-11 h-11 rounded-md flex items-center justify-center text-lg mb-5 border
                  ${s.color === 'orange' ? 'bg-orange/10 border-orange/20'  : ''}
                  ${s.color === 'yellow' ? 'bg-yellow/10 border-yellow/20'  : ''}
                  ${s.color === 'teal'   ? 'bg-teal/10   border-teal/20'    : ''}
                `}>
                  {s.icon}
                </div>
                <div className="font-display text-2xl text-white tracking-wide mb-2.5">{s.title}</div>
                <p className="text-[13px] text-white/35 font-light leading-relaxed mb-4">{s.body}</p>
                <span className={`font-mono text-[7px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-[2px]
                  ${s.color === 'orange' ? 'bg-orange/10 text-orange/70' : ''}
                  ${s.color === 'yellow' ? 'bg-yellow/10 text-yellow/70' : ''}
                  ${s.color === 'teal'   ? 'bg-teal/10   text-teal/70'   : ''}
                `}>
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
```

---

## src/components/sections/CheckSection.tsx

```tsx
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
]

export default function CheckSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-6% 0px' })

  const badgeColor = (b: string) => {
    if (b === 'Critical')   return 'bg-pink/8 text-pink/70'
    if (b === 'High')       return 'bg-orange/8 text-orange/80'
    if (b === 'Medium')     return 'bg-orange/8 text-orange/80'
    return 'bg-teal/8 text-teal/80'
  }

  return (
    <section id="aeo-audit" className="bg-cream-2 py-24 px-12">
      <div className="max-w-[1300px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 font-mono text-[8px] text-charcoal/30 tracking-[0.32em] uppercase mb-3">
              <span className="w-5 h-px bg-orange/50" />
              The Scan
            </div>
            <h2 className="font-display text-[58px] leading-[0.9] uppercase text-charcoal">
              WHAT<br/>WE <span className="text-orange">CHECK.</span>
            </h2>
          </div>
          <p className="font-mono text-[9px] text-charcoal/35 leading-[1.9] max-w-[280px] text-right italic">
            Six signals. Every one determines whether AI recommends your business or your competitor's.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-3 gap-3">
          {categories.map((c, i) => {
            const even = i % 2 === 0
            return (
              <motion.div
                key={c.n}
                initial={{ opacity: 0, rotateY: even ? 18 : -18, x: even ? 40 : -40, scale: 0.95 }}
                animate={inView ? { opacity: 1, rotateY: 0, x: 0, scale: 1 } : {}}
                transition={{ duration: 0.9, delay: Math.floor(i/2) * 0.09, ease: [0.22,1,0.36,1] }}
                whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(23,19,18,0.1)' }}
                className="bg-white border border-charcoal/10 rounded-sm p-7 transition-shadow"
              >
                <div className="font-display text-[48px] text-charcoal/[0.06] leading-none mb-2.5">{c.n}</div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center text-base bg-cream-2 border border-charcoal/10">
                    {c.icon}
                  </div>
                  <span className={`font-mono text-[7px] tracking-[0.15em] uppercase px-2 py-1 rounded-[2px] ${badgeColor(c.badge)}`}>
                    {c.badge}
                  </span>
                </div>
                <div className="font-display text-xl text-charcoal mb-2">{c.title}</div>
                <p className="text-[12px] text-charcoal/45 font-light leading-relaxed">{c.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

---

## src/components/sections/WorkSection.tsx

```tsx
'use client'

import RevealWrapper from '@/components/shared/RevealWrapper'
import { motion } from 'framer-motion'

const projects = [
  {
    badge: 'Real Work',
    client: 'Indianapolis Colts · NFL',
    name: 'HORSEPOWER',
    desc: 'Official theme song video · Cinematic AI production · Ongoing collaboration',
    bg: 'bg-gradient-to-br from-[#0A1520] to-[#1A2830]',
    visual: '🐎',
    visualClass: 'font-display text-5xl',
    href: '#',
  },
  {
    badge: 'Real Work',
    client: 'Louis Vuitton · Luxury Fashion',
    name: 'LV AI CAMPAIGN',
    desc: 'Global AI campaign contest winner · Visual identity + creative direction',
    bg: 'bg-gradient-to-br from-[#1A1008] to-[#2A1A05]',
    visual: 'LV',
    visualClass: 'font-display text-[52px] text-[rgba(218,180,0,0.25)] tracking-[0.2em] leading-none',
    href: '#',
  },
  {
    badge: 'Concept Build',
    client: 'HVAC · Indianapolis · Demo',
    name: 'ZERO TO FOUND',
    desc: 'AEO demo build — 23/100 → 78/100 transformation in 7 days',
    bg: 'bg-gradient-to-br from-[#F0EBE0] to-[#E5DDD0]',
    visual: '78',
    visualClass: 'font-display text-[64px] text-orange/20 leading-none',
    href: '#',
  },
]

export default function WorkSection() {
  return (
    <section id="work" className="bg-cream py-24 px-12">
      <div className="max-w-[1300px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <RevealWrapper>
            <div className="flex items-center gap-2 font-mono text-[8px] text-charcoal/30 tracking-[0.32em] uppercase mb-3">
              <span className="w-5 h-px bg-orange/50" />
              Proof + Concepts
            </div>
            <h2 className="font-display text-[58px] leading-[0.9] uppercase text-charcoal">
              SIGNAL<br/>BUILDS.
            </h2>
          </RevealWrapper>
          <a href="#" className="font-mono text-[9px] text-charcoal/30 tracking-[0.2em] uppercase hover:text-orange transition-colors">
            View All →
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <RevealWrapper key={p.name} delay={i * 0.12}>
              <motion.a
                href={p.href}
                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(23,19,18,0.1)' }}
                className="block bg-white border border-charcoal/10 rounded-sm overflow-hidden group"
              >
                <div className={`h-[210px] relative flex items-center justify-center ${p.bg}`}>
                  <span className={`${p.badge === 'Concept Build' ? 'border-orange/25 text-orange bg-orange/12' : 'border-teal/30 text-teal bg-teal/15'}
                    absolute top-3.5 left-3.5 font-mono text-[7px] tracking-[0.15em] uppercase
                    px-2.5 py-1 rounded-[2px] border`}>
                    {p.badge}
                  </span>
                  <span className={p.visualClass}>{p.visual}</span>
                </div>
                <div className="px-5 py-5 pb-3.5">
                  <div className="font-mono text-[8px] text-charcoal/30 tracking-[0.18em] uppercase mb-1.5">{p.client}</div>
                  <div className="font-display text-[22px] text-charcoal mb-1">{p.name}</div>
                  <div className="text-[11px] text-charcoal/40 font-light">{p.desc}</div>
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-t border-charcoal/8">
                  <span className="font-mono text-[8px] text-charcoal/30 tracking-[0.15em] uppercase">View Project</span>
                  <span className="text-charcoal/20 group-hover:text-orange group-hover:translate-x-1 transition-all">→</span>
                </div>
              </motion.a>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## src/components/sections/StatsSection.tsx

```tsx
'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'
import RevealWrapper from '@/components/shared/RevealWrapper'

const stats = [
  { raw: 17,  display: '#17',  prefix: '#',  suffix: '',  label: 'Global AI Creator Rank', detail: 'Out of 8,500+ creators in the Skool Community.', color: 'text-yellow/90' },
  { raw: 1,   display: '<1%',  prefix: '<',  suffix: '%', label: 'Have llms.txt',           detail: 'The file we build for every client by Day 2.',   color: 'text-[rgba(246,196,216,0.9)]' },
  { raw: 4,   display: '4M',   prefix: '',   suffix: 'M', label: 'AI Searches Daily',       detail: 'Most businesses appear in zero of them.',        color: 'text-[rgba(158,223,255,0.9)]' },
  { raw: 3,   display: '3',    prefix: '',   suffix: '',  label: 'Exclusive Services',      detail: 'llms.txt · AI Bot Audit · Agentic Engine Optimization.', color: 'text-orange/90' },
]

function CountStat({ stat, active }: { stat: typeof stats[0], active: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let start = 0
    const end   = stat.raw
    const dur   = 2400
    const step  = dur / (end * 2)
    const timer = setInterval(() => {
      start += 0.5
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.round(start))
    }, step)
    return () => clearInterval(timer)
  }, [active, stat.raw])

  return (
    <div className={`font-display text-[52px] leading-none mb-1.5 ${stat.color}`}>
      {stat.prefix}{count}{stat.suffix}
    </div>
  )
}

export default function StatsSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <section className="bg-charcoal py-20 px-12">
      <div className="max-w-[1300px] mx-auto">
        <RevealWrapper>
          <div className="flex items-center gap-2 font-mono text-[8px] text-white/20 tracking-[0.32em] uppercase mb-3">
            <span className="w-5 h-px bg-orange/50" />
            By The Numbers
          </div>
          <h2 className="font-display text-[58px] leading-[0.9] uppercase text-white mb-12">
            THE PROOF<br/>IS REAL.
          </h2>
        </RevealWrapper>

        <div
          ref={ref}
          className="grid grid-cols-4 gap-px"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          {stats.map((s, i) => (
            <RevealWrapper key={s.label} delay={i * 0.1}>
              <div className="bg-charcoal-2 px-7 py-9">
                <CountStat stat={s} active={inView} />
                <div className="font-mono text-[8px] text-white/25 tracking-[0.18em] uppercase leading-relaxed">
                  {s.label}
                </div>
                <p className="text-[12px] text-white/18 font-light mt-2 leading-snug">
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
```

---

## src/components/sections/ProcessSection.tsx

```tsx
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
    <section className="bg-cream-2 py-24 px-12">
      <div className="max-w-[1300px] mx-auto">
        <RevealWrapper>
          <div className="flex items-center gap-2 font-mono text-[8px] text-charcoal/30 tracking-[0.32em] uppercase mb-3">
            <span className="w-5 h-px bg-orange/50" />
            How It Works
          </div>
          <h2 className="font-display text-[58px] leading-[0.9] uppercase text-charcoal mb-12">
            FOUR STEPS.<br/>NO GUESSING.
          </h2>
        </RevealWrapper>

        <div ref={ref} className="grid grid-cols-4 border border-charcoal/10">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 55, rotateX: -20 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.9, delay: i * 0.13, ease: [0.22,1,0.36,1] }}
              style={{ transformPerspective: 1000 }}
              className="px-8 py-9 border-r border-charcoal/10 last:border-r-0"
            >
              <div className="font-display text-[48px] text-charcoal/[0.05] leading-none mb-3">{s.n}</div>
              <span className="text-lg mb-3.5 block">{s.icon}</span>
              <div className={`w-7 h-0.5 mb-2.5 ${s.color}`} />
              <div className="font-display text-[22px] text-charcoal tracking-wide mb-2.5">{s.title}</div>
              <p className="font-mono text-[8.5px] text-charcoal/40 leading-[1.9] italic">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## src/components/sections/FooterSection.tsx

```tsx
'use client'

const serviceLinks = ['AI Visibility Scan', 'llms.txt Build', 'AI Bot Audit', 'UGC Production', 'Landing Pages', 'Meta Ad Creative']
const companyLinks = ['About', 'Work', 'Pricing', 'Signal Flare System', 'Contact']
const connectLinks = ['LinkedIn', 'Instagram', 'TikTok', 'YouTube']

export default function FooterSection() {
  return (
    <footer className="bg-charcoal-2 border-t border-white/4 px-12 pt-12 pb-8">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-14 mb-10">
          <div>
            <a href="#hero" className="font-display text-[22px] text-cream tracking-wide block mb-2">
              MENTAL<span className="text-orange">VISION</span>
            </a>
            <p className="font-mono text-[8px] text-white/18 tracking-[0.18em] uppercase leading-[1.9] mb-4">
              AI Visibility + Cinematic Creative<br/>
              Indianapolis, Indiana · Est. 2024<br/>
              #17 of 8,500+ AI Creators · Skool Community
            </p>
            <a
              href="mailto:create@mentalvision.ai"
              className="font-mono text-[9px] text-orange/45 hover:text-orange tracking-[0.1em] transition-colors"
            >
              create@mentalvision.ai
            </a>
          </div>
          {[
            { head: 'Services', links: serviceLinks },
            { head: 'Company',  links: companyLinks },
            { head: 'Connect',  links: connectLinks },
          ].map(({ head, links }) => (
            <div key={head}>
              <div className="font-mono text-[7px] text-white/14 tracking-[0.3em] uppercase mb-3.5 pb-2.5 border-b border-white/4">
                {head}
              </div>
              {links.map(l => (
                <a
                  key={l}
                  href="#"
                  className="block text-[13px] text-white/26 font-light mb-2 hover:text-cream transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-white/4">
          <div className="font-mono text-[8px] text-white/10 tracking-[0.12em]">
            © 2026 Mental Vision Corp · All rights reserved · Indianapolis, IN
          </div>
          <div className="font-mono text-[8px] text-white/7 tracking-[0.1em]">
            AI Visibility + Cinematic Creative · Signal Flare System v3.0
          </div>
        </div>
      </div>
    </footer>
  )
}
```

---

## next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['prod.spline.design'],
  },
}

module.exports = nextConfig
```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "target":          "es5",
    "lib":             ["dom", "dom.iterable", "esnext"],
    "allowJs":         true,
    "skipLibCheck":    true,
    "strict":          true,
    "noEmit":          true,
    "esModuleInterop": true,
    "module":          "esnext",
    "moduleResolution":"bundler",
    "resolveJsonModule":true,
    "isolatedModules": true,
    "jsx":             "preserve",
    "incremental":     true,
    "plugins":         [{ "name": "next" }],
    "paths":           { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## SHADCN INIT COMMAND

Run this after `npm install` to configure shadcn:

```bash
npx shadcn@latest init
# When prompted:
# - Style: Default
# - Base color: Stone
# - CSS variables: Yes
# - tailwind.config location: tailwind.config.ts
# - components alias: @/components
# - utils alias: @/lib/utils

npx shadcn@latest add card
```

---

## FINAL CLAUDE CODE INSTRUCTIONS

1. Run: `npx create-next-app@latest signal-flare --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
2. `cd signal-flare`
3. Copy all component files from CLAUDE.md + this file into their paths
4. Run: `npm install framer-motion @splinetool/react-spline @splinetool/runtime`
5. Run: `npx shadcn@latest init && npx shadcn@latest add card`
6. Copy `SignalFlare_Hero.mp4` to `/public/video/signal-flare-hero.mp4`
7. Run: `npm run dev`
8. Iterate on each section — the structure is complete, details need refinement

**Priority order:**
1. HeroSection + ORB01 canvas robot (mouse tracking must work)
2. Navigation (scroll-triggered)
3. TickerSection (trust proof)
4. ProblemSection + ScanDemo
5. ServicesSection
6. PricingSection (prices are CANONICAL: $1,250 / $2,500 / $797)
7. All remaining sections
8. Mobile responsiveness pass
9. Performance audit (video loading, canvas optimization)

*Signal Flare · Mental Vision Corp · Claude Code Package · v1.0 · May 2026*
