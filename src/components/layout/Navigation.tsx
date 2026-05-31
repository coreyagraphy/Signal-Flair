'use client'

import { useEffect, useState } from 'react'

const links = [
  { label: 'The Scan',  href: '#aeo-audit' },
  { label: 'The Build', href: '#creative' },
  { label: 'Proof',     href: '#work' },
  { label: 'Pricing',   href: '#pricing' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.72)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                  px-6 md:px-12 py-4 transition-colors duration-300
        ${scrolled
          ? 'bg-bg/85 backdrop-blur-xl border-b border-ink/10'
          : 'bg-transparent border-b border-transparent'}`}
    >
      <a href="#hero" className="leading-none">
        <span className={`font-display text-xl tracking-wide ${scrolled ? 'text-ink' : 'text-cream'}`}>
          SIGNAL<span className="text-orange">FLARE</span>
        </span>
        <span className={`block font-mono text-[7px] tracking-[0.25em] uppercase mt-0.5
          ${scrolled ? 'text-ink/40' : 'text-cream/50'}`}>
          by Mental Vision Corp
        </span>
      </a>

      <div className="hidden md:flex items-center gap-6">
        {links.map(l => (
          <a
            key={l.label}
            href={l.href}
            className={`font-mono text-[9px] tracking-[0.18em] uppercase transition-colors
              ${scrolled ? 'text-ink/45 hover:text-ink' : 'text-cream/55 hover:text-cream'}`}
          >
            {l.label}
          </a>
        ))}
      </div>

      <a
        href="#cta"
        className="font-display text-sm tracking-wide px-5 py-2 rounded-[2px]
                   bg-orange text-white hover:bg-orange-2 transition-colors"
      >
        LIGHT THE FLARE
      </a>
    </nav>
  )
}
