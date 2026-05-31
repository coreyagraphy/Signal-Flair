'use client'

import { useEffect, useRef, useState } from 'react'
import { useAnimationFrame } from 'framer-motion'

interface ORB01Props {
  size?: number
  eyeIntensity?: number
}

export default function ORB01({ size = 300, eyeIntensity = 1 }: ORB01Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const eyeGlowRef  = useRef<HTMLDivElement>(null)
  const eyeOuterRef = useRef<HTMLDivElement>(null)
  const [isIdle, setIsIdle] = useState(true)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleAngle = useRef(0)

  const H = size * (480 / 300)

  // Draw robot on canvas (retina-aware)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1
    canvas.width  = size * dpr
    canvas.height = H * dpr
    canvas.style.width  = `${size}px`
    canvas.style.height = `${H}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawORB01(ctx, size, H, eyeIntensity)
  }, [size, H, eyeIntensity])

  // Idle head sway animation
  useAnimationFrame((_, delta) => {
    if (!isIdle || !canvasRef.current) return
    idleAngle.current += delta * 0.0005
  })

  const startIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    setIsIdle(false)
    idleTimer.current = setTimeout(() => setIsIdle(true), 3000)
  }

  useEffect(() => {
    window.addEventListener('mousemove', startIdleTimer)
    return () => {
      window.removeEventListener('mousemove', startIdleTimer)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [])

  return (
    <div className="relative" style={{ width: size, height: H }}>
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Eye glow overlays */}
      <div
        ref={eyeGlowRef}
        className="absolute pointer-events-none mix-blend-screen animate-eye-pulse"
        style={{
          top:    `${H * 0.215 - 25}px`,
          left:   `${size * 0.5 - 25 + 4}px`,
          width:  50, height: 50,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,110,40,0.9) 0%, rgba(255,60,5,0.4) 40%, transparent 70%)',
          filter: 'blur(2px)',
        }}
      />
      <div
        ref={eyeOuterRef}
        className="absolute pointer-events-none mix-blend-screen animate-eye-pulse [animation-delay:0.1s]"
        style={{
          top:    `${H * 0.215 - 45}px`,
          left:   `${size * 0.5 - 45 + 4}px`,
          width:  90, height: 90,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,90,10,0.18) 0%, transparent 65%)',
          filter: 'blur(8px)',
        }}
      />
    </div>
  )
}

// Canvas drawing function — renders ORB-01 robot
function drawORB01(ctx: CanvasRenderingContext2D, W: number, H: number, eyeIntensity = 1) {
  ctx.clearRect(0, 0, W, H)
  ctx.save()

  // Ground glow
  const gg = ctx.createRadialGradient(W/2, H-5, 0, W/2, H-5, 130)
  gg.addColorStop(0, 'rgba(255,100,30,0.18)')
  gg.addColorStop(1, 'transparent')
  ctx.fillStyle = gg
  ctx.fillRect(0, H-130, W, 130)

  const limb = (x: number, y: number, w: number, h: number, r: number, topColor: string, botColor: string) => {
    const g = ctx.createLinearGradient(x-w/2, y, x+w/2, y)
    g.addColorStop(0, topColor)
    g.addColorStop(1, botColor)
    ctx.fillStyle = g
    ctx.shadowColor = 'rgba(0,0,0,0.25)'
    ctx.shadowBlur  = 10
    ctx.beginPath()
    ctx.roundRect(x-w/2, y, w, h, r)
    ctx.fill()
    ctx.shadowBlur = 0
    const hl = ctx.createLinearGradient(x-w/2, y, x+w/2, y)
    hl.addColorStop(0, 'rgba(255,255,255,0.18)')
    hl.addColorStop(0.5, 'rgba(255,255,255,0.05)')
    hl.addColorStop(1, 'rgba(0,0,0,0.1)')
    ctx.fillStyle = hl
    ctx.beginPath()
    ctx.roundRect(x-w/2, y, w, h, r)
    ctx.fill()
  }

  // LEGS
  limb(W*.36, H*.60, 36, H*.24, 6, '#C8C8C5', '#B8B8B5')
  ctx.fillStyle = '#9E9E9C'
  ctx.beginPath(); ctx.arc(W*.36, H*.73, 11, 0, Math.PI*2); ctx.fill()
  limb(W*.36, H*.73, 30, H*.17, 5, '#C4C4C0', '#B4B4B0')
  ctx.fillStyle = '#1C1C1C'
  ctx.beginPath(); ctx.roundRect(W*.36-21, H*.89, 42, 16, 4); ctx.fill()

  limb(W*.64, H*.60, 36, H*.24, 6, '#C4C4C2', '#B4B4B2')
  ctx.fillStyle = '#9A9A98'
  ctx.beginPath(); ctx.arc(W*.64, H*.73, 11, 0, Math.PI*2); ctx.fill()
  limb(W*.64, H*.73, 30, H*.17, 5, '#C0C0BC', '#B0B0AC')
  ctx.fillStyle = '#1C1C1C'
  ctx.beginPath(); ctx.roundRect(W*.64-21, H*.89, 42, 16, 4); ctx.fill()

  // TORSO
  const tg = ctx.createLinearGradient(W*.28, H*.38, W*.72, H*.38)
  tg.addColorStop(0, '#C8C8C6'); tg.addColorStop(.5, '#E8E8E6'); tg.addColorStop(1, '#B8B8B6')
  ctx.fillStyle = tg; ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 14
  ctx.beginPath(); ctx.roundRect(W*.28, H*.38, W*.44, H*.24, 10); ctx.fill(); ctx.shadowBlur = 0
  const th = ctx.createLinearGradient(W*.28, H*.38, W*.28, H*.44)
  th.addColorStop(0, 'rgba(255,255,255,0.2)'); th.addColorStop(1, 'transparent')
  ctx.fillStyle = th; ctx.beginPath(); ctx.roundRect(W*.28, H*.38, W*.44, H*.10, 10); ctx.fill()
  ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.beginPath(); ctx.roundRect(W*.36, H*.43, W*.28, H*.09, 5); ctx.fill()
  const cg = ctx.createRadialGradient(W*.5, H*.465, 0, W*.5, H*.465, 14)
  cg.addColorStop(0, `rgba(255,120,40,${0.25*eyeIntensity})`); cg.addColorStop(1, 'transparent')
  ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(W*.5, H*.465, 14, 0, Math.PI*2); ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 0.8
  ;[[W*.34,H*.49,W*.66,H*.49],[W*.36,H*.53,W*.64,H*.53]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke()
  })

  // SHOULDERS
  ;[W*.27, W*.73].forEach(sx => {
    ctx.fillStyle = '#AAAAAA'; ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 8
    ctx.beginPath(); ctx.arc(sx, H*.40, 17, 0, Math.PI*2); ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.shadowBlur = 0
    ctx.beginPath(); ctx.arc(sx-3, H*.40-3, 9, 0, Math.PI*2); ctx.fill()
  })

  // ARMS — RAISED (recognition posture)
  limb(W*.17, H*.33, 24, H*.12, 5, '#C4C4C2', '#B4B4B2')
  ctx.fillStyle = '#9A9A98'; ctx.beginPath(); ctx.arc(W*.17, H*.33+H*.12, 9, 0, Math.PI*2); ctx.fill()
  limb(W*.10, H*.44, 20, H*.11, 5, '#BEBEBC', '#AEAEAC')
  ctx.fillStyle = '#ABABAA'; ctx.beginPath(); ctx.roundRect(W*.04, H*.54, 32, 24, 5); ctx.fill()
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#A8A8A6'; ctx.beginPath(); ctx.roundRect(W*.05+i*7, H*.54, 5, 20, 2); ctx.fill()
  }

  limb(W*.83, H*.33, 24, H*.12, 5, '#C0C0BE', '#B0B0AE')
  ctx.fillStyle = '#969694'; ctx.beginPath(); ctx.arc(W*.83, H*.33+H*.12, 9, 0, Math.PI*2); ctx.fill()
  limb(W*.90, H*.44, 20, H*.11, 5, '#BABAB8', '#AAAAA8')
  ctx.fillStyle = '#A7A7A6'; ctx.beginPath(); ctx.roundRect(W*.88, H*.54, 32, 24, 5); ctx.fill()
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#A4A4A2'; ctx.beginPath(); ctx.roundRect(W*.89+i*7, H*.54, 5, 20, 2); ctx.fill()
  }

  // HEAD — large ceramic sphere
  const hg = ctx.createRadialGradient(W*.46, H*.19, 0, W*.50, H*.215, 68)
  hg.addColorStop(0, '#FFFFFF'); hg.addColorStop(.4, '#EEEEEC')
  hg.addColorStop(.85, '#D2D2D0'); hg.addColorStop(1, '#BCBCBA')
  ctx.fillStyle = hg; ctx.shadowColor = 'rgba(0,0,0,0.22)'; ctx.shadowBlur = 18
  ctx.beginPath(); ctx.arc(W*.50, H*.215, 68, 0, Math.PI*2); ctx.fill(); ctx.shadowBlur = 0
  const hhl = ctx.createRadialGradient(W*.42, H*.165, 0, W*.42, H*.165, 38)
  hhl.addColorStop(0, 'rgba(255,255,255,0.5)'); hhl.addColorStop(1, 'transparent')
  ctx.fillStyle = hhl; ctx.beginPath(); ctx.arc(W*.42, H*.165, 38, 0, Math.PI*2); ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.07)'; ctx.lineWidth = 0.6
  ;[[W*.42,H*.10,W*.56,H*.19],[W*.58,H*.14,W*.60,H*.25],[W*.34,H*.22,W*.44,H*.29]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke()
  })

  // OPTICAL LENS — EYE
  ctx.fillStyle = '#1A1412'
  ctx.beginPath(); ctx.arc(W*.50, H*.215, 30, 0, Math.PI*2); ctx.fill()
  ctx.strokeStyle = '#888888'; ctx.lineWidth = 3.5
  ctx.beginPath(); ctx.arc(W*.50, H*.215, 28, 0, Math.PI*2); ctx.stroke()
  const ir = ctx.createRadialGradient(W*.50, H*.215, 0, W*.50, H*.215, 22)
  const ib = eyeIntensity
  ir.addColorStop(0, `rgba(255,255,${Math.round(200*ib)},${ib})`)
  ir.addColorStop(.15, `rgba(255,${Math.round(180*ib)},${Math.round(60*ib)},${ib})`)
  ir.addColorStop(.4, `rgba(255,${Math.round(100*ib)},20,${ib})`)
  ir.addColorStop(.7, `rgba(${Math.round(200*ib)},40,0,${ib})`)
  ir.addColorStop(1, `rgba(30,5,0,${ib})`)
  ctx.fillStyle = ir; ctx.beginPath(); ctx.arc(W*.50, H*.215, 22, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.beginPath(); ctx.arc(W*.50, H*.215, 7, 0, Math.PI*2); ctx.fill()
  ctx.fillStyle = `rgba(255,255,220,${0.75*ib})`
  ctx.beginPath(); ctx.arc(W*.47, H*.207, 3, 0, Math.PI*2); ctx.fill()

  // NECK
  const ng = ctx.createLinearGradient(W*.42, H*.285, W*.58, H*.285)
  ng.addColorStop(0, '#999'); ng.addColorStop(1, '#888')
  ctx.fillStyle = ng; ctx.beginPath(); ctx.roundRect(W*.42, H*.285, W*.16, H*.045, 4); ctx.fill()

  ctx.restore()
}
