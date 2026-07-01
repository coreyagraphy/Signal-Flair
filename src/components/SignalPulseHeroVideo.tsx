'use client'
/**
 * SignalPulseHeroVideo — the muted, looping brand video behind the hero.
 *
 * Uses NATIVE autoplay (autoPlay + muted + playsInline + loop) so it starts reliably —
 * the earlier IntersectionObserver-only start (plus a reduced-motion gate on playback) was
 * why it didn't play. A play() nudge covers browsers that need it. Scroll parallax drifts
 * the video slower than the page, driven manually (anime.js v4 onScroll scrubbing binds
 * unreliably) via createAnimatable, and is the ONLY thing gated on prefers-reduced-motion —
 * the video itself still plays. The layer overscans the hero so the drift never reveals an edge.
 */
import { useEffect, useRef } from 'react'
import { createAnimatable } from 'animejs'

export default function SignalPulseHeroVideo() {
  const layerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const layer = layerRef.current
    // autoPlay attr usually starts it; this covers browsers that need an explicit muted play().
    video?.play?.().catch(() => {})

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !layer) return

    const parallax = createAnimatable(layer, { translateY: { duration: 420, ease: 'outQuad' } })
    const cap = () => (layer.offsetHeight || 700) * 0.14
    let ticking = false
    const update = () => {
      ticking = false
      const y = window.scrollY || window.pageYOffset || 0
      parallax.translateY(Math.min(y * 0.3, cap()))
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      ;(parallax as any).revert?.()
    }
  }, [])

  return (
    <div className="ssc-hero-video" ref={layerRef} aria-hidden="true">
      <video
        ref={videoRef}
        className="ssc-hero-video-el"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/video/signal-pulse-poster.jpg"
      >
        <source src="/video/signal-pulse-hero.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
