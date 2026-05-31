'use client'

import { useEffect, useRef } from 'react'
import Navigation from '@/components/layout/Navigation'
import HeroSection from '@/components/sections/HeroSection'
import TickerSection from '@/components/sections/TickerSection'
import ProblemSection from '@/components/sections/ProblemSection'
import ServicesSection from '@/components/sections/ServicesSection'
import CheckSection from '@/components/sections/CheckSection'
import WorkSection from '@/components/sections/WorkSection'
import StatsSection from '@/components/sections/StatsSection'
import ProcessSection from '@/components/sections/ProcessSection'
import PricingSection from '@/components/sections/PricingSection'
import CTASection from '@/components/sections/CTASection'
import FooterSection from '@/components/sections/FooterSection'

export default function Home() {
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ringX = 0, ringY = 0
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let raf = 0

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${mouseX}px`
        cursorDotRef.current.style.top  = `${mouseY}px`
      }
    }
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = `${ringX}px`
        cursorRingRef.current.style.top  = `${ringY}px`
      }
      raf = requestAnimationFrame(animateRing)
    }
    window.addEventListener('mousemove', moveCursor)
    raf = requestAnimationFrame(animateRing)
    return () => { window.removeEventListener('mousemove', moveCursor); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div ref={cursorDotRef}  className="cursor-dot" />
      <div ref={cursorRingRef} className="cursor-ring" />

      <Navigation />

      <HeroSection />

      <main>
        <TickerSection />
        <ProblemSection />
        <ServicesSection />
        <CheckSection />
        <WorkSection />
        <StatsSection />
        <ProcessSection />
        <PricingSection />
        <CTASection />
      </main>

      <FooterSection />
    </>
  )
}
