'use client'
/**
 * BrandBgVideo — a reusable muted, looping brand video for a full-width background band.
 * Native autoplay so it starts reliably; pauses when off-screen (IntersectionObserver) to
 * save battery/data; scroll parallax drifts it slower than the page (driven manually — v4
 * onScroll binding is unreliable) and is the only thing gated on prefers-reduced-motion.
 * The layer overscans its band so the drift never reveals an edge.
 */
import { useEffect, useRef } from 'react'
import { createAnimatable } from 'animejs'

export default function BrandBgVideo({ src, poster }: { src: string; poster: string }) {
  const layerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const layer = layerRef.current
    video?.play?.().catch(() => {})

    // Pause while off-screen.
    let io: IntersectionObserver | null = null
    if (video && layer && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) video.play().catch(() => {}); else video.pause() }),
        { threshold: 0.05 },
      )
      io.observe(layer)
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cleanup = () => {}
    if (!reduce && layer) {
      const parallax = createAnimatable(layer, { translateY: { duration: 440, ease: 'outQuad' } })
      let ticking = false
      const update = () => {
        ticking = false
        const r = layer.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const rel = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        parallax.translateY(-Math.max(-1, Math.min(1, rel)) * (layer.offsetHeight * 0.12))
      }
      const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
      update()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
      cleanup = () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
        ;(parallax as any).revert?.()
      }
    }

    return () => { io?.disconnect(); cleanup() }
  }, [])

  return (
    <div className="ssc-band-video" ref={layerRef} aria-hidden="true">
      <video ref={videoRef} className="ssc-band-video-el" autoPlay muted loop playsInline preload="metadata" poster={poster}>
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
