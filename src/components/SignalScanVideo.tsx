'use client'
/**
 * SignalScanVideo — the looping, muted brand video in the /signal-scan showcase.
 *
 * - Autoplays muted + loops, but ONLY while on screen (IntersectionObserver), so it
 *   never streams 16 MB offscreen and pauses when scrolled away.
 * - Scroll-driven parallax on the media layer, driven MANUALLY (anime.js v4 onScroll
 *   scrubbing binds unreliably) and smoothed through createAnimatable's setter.
 * - Fully gated on prefers-reduced-motion: no autoplay, no parallax — the poster shows.
 * The video overscans its 16:9 frame (height 140%), so the parallax travel never
 * reveals an edge.
 */
import { useEffect, useRef } from 'react'
import { createAnimatable } from 'animejs'

export default function SignalScanVideo() {
  const frameRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    const media = mediaRef.current
    const video = videoRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Play only while the frame is in view (battery/data friendly; never plays offscreen).
    let io: IntersectionObserver | null = null
    if (video && frame && !reduce) {
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(
          (entries) => entries.forEach((e) => {
            if (e.isIntersecting) video.play().catch(() => {})
            else video.pause()
          }),
          { threshold: 0.15 },
        )
        io.observe(frame)
      } else {
        video.play().catch(() => {})
      }
    }

    // Manual scroll-driven parallax, smoothed by createAnimatable. Skipped under reduced motion.
    let cleanupParallax = () => {}
    if (media && frame && !reduce) {
      const parallax = createAnimatable(media, { translateY: { duration: 520, ease: 'outQuad' } })
      let ticking = false
      const update = () => {
        ticking = false
        const r = frame.getBoundingClientRect()
        const vh = window.innerHeight || 1
        // -1..1 as the frame travels from entering (bottom) to leaving (top) of the viewport
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        const clamped = Math.max(-1, Math.min(1, p))
        parallax.translateY(-clamped * (frame.offsetHeight * 0.12))
      }
      const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
      update()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
      cleanupParallax = () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
        ;(parallax as any).revert?.()
      }
    }

    return () => { io?.disconnect(); cleanupParallax() }
  }, [])

  return (
    <figure className="ssc-video" ref={frameRef} aria-label="Signal Flair — ambient brand loop (muted, looping)">
      <div className="ssc-video-media" ref={mediaRef}>
        <video
          ref={videoRef}
          className="ssc-video-el"
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/signal-scan-poster.jpg"
        >
          <source src="/video/signal-scan-hero.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="ssc-video-scrim" aria-hidden="true" />
    </figure>
  )
}
