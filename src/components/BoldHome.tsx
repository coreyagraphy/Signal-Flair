// @ts-nocheck
'use client'
/* eslint-disable */
import { useEffect, useRef } from 'react'
import { animate, createTimeline, createAnimatable, stagger, onScroll } from 'animejs'

/**
 * BoldHome — the canonical Mental Vision homepage.
 * Ported from the approved "mentalvision-bold" design. Markup is JSX; the
 * original intro/robot/scroll logic runs once in the mount effect via anime.js.
 * Styles live in globals.css. Hero background uses /video/signal-flare-hero.mp4.
 */
export default function BoldHome() {
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return // guard React strict-mode double-invoke
    started.current = true

    /* ─── CURSOR ─── */
    const cur = document.getElementById('cursor'), ring = document.getElementById('cursor-ring')
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY })
    ;(function lp() { rx += (mx - rx) * .12; ry += (my - ry) * .12; if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px' } if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px' } requestAnimationFrame(lp) })()
    document.querySelectorAll('a,button,.wcard,.psc,.price-feat').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.transform = 'translate(-50%,-50%) scale(2.2)'; ring.style.borderColor = 'rgba(255,122,69,0.55)' })
      el.addEventListener('mouseleave', () => { ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.borderColor = 'rgba(255,122,69,0.4)' })
    })

    /* ─── DRAW ORB-01 ─── */
    function drawORB01(canvas, eyeIntensity = 1) {
      const c = canvas.getContext('2d'); const W = canvas.width, H = canvas.height
      c.clearRect(0, 0, W, H); c.save()
      const gg = c.createRadialGradient(W / 2, H - 5, 0, W / 2, H - 5, 130)
      gg.addColorStop(0, 'rgba(255,100,30,0.18)'); gg.addColorStop(1, 'transparent')
      c.fillStyle = gg; c.fillRect(0, H - 130, W, 130)
      function limb(x, y, w, h, r, top, bot) {
        const g = c.createLinearGradient(x - w / 2, y, x + w / 2, y)
        g.addColorStop(0, top); g.addColorStop(1, bot)
        c.fillStyle = g; c.shadowColor = 'rgba(0,0,0,0.25)'; c.shadowBlur = 10
        c.beginPath(); c.roundRect(x - w / 2, y, w, h, r); c.fill(); c.shadowBlur = 0
        const hl = c.createLinearGradient(x - w / 2, y, x + w / 2, y)
        hl.addColorStop(0, 'rgba(255,255,255,0.18)'); hl.addColorStop(0.5, 'rgba(255,255,255,0.05)'); hl.addColorStop(1, 'rgba(0,0,0,0.1)')
        c.fillStyle = hl; c.beginPath(); c.roundRect(x - w / 2, y, w, h, r); c.fill()
      }
      limb(W * .36, H * .6, 36, H * .24, 6, '#C8C8C5', '#B8B8B5')
      c.fillStyle = '#9E9E9C'; c.beginPath(); c.arc(W * .36, H * .73, 11, 0, Math.PI * 2); c.fill()
      limb(W * .36, H * .73, 30, H * .17, 5, '#C4C4C0', '#B4B4B0')
      c.fillStyle = '#1C1C1C'; c.beginPath(); c.roundRect(W * .36 - 21, H * .89, 42, 16, 4); c.fill()
      limb(W * .64, H * .6, 36, H * .24, 6, '#C4C4C2', '#B4B4B2')
      c.fillStyle = '#9A9A98'; c.beginPath(); c.arc(W * .64, H * .73, 11, 0, Math.PI * 2); c.fill()
      limb(W * .64, H * .73, 30, H * .17, 5, '#C0C0BC', '#B0B0AC')
      c.fillStyle = '#1C1C1C'; c.beginPath(); c.roundRect(W * .64 - 21, H * .89, 42, 16, 4); c.fill()
      const tg = c.createLinearGradient(W * .28, H * .38, W * .72, H * .38)
      tg.addColorStop(0, '#C8C8C6'); tg.addColorStop(.5, '#E8E8E6'); tg.addColorStop(1, '#B8B8B6')
      c.fillStyle = tg; c.shadowColor = 'rgba(0,0,0,0.2)'; c.shadowBlur = 14
      c.beginPath(); c.roundRect(W * .28, H * .38, W * .44, H * .24, 10); c.fill(); c.shadowBlur = 0
      const th = c.createLinearGradient(W * .28, H * .38, W * .28, H * .44)
      th.addColorStop(0, 'rgba(255,255,255,0.2)'); th.addColorStop(1, 'transparent')
      c.fillStyle = th; c.beginPath(); c.roundRect(W * .28, H * .38, W * .44, H * .1, 10); c.fill()
      c.fillStyle = 'rgba(0,0,0,0.1)'; c.beginPath(); c.roundRect(W * .36, H * .43, W * .28, H * .09, 5); c.fill()
      const cg = c.createRadialGradient(W * .5, H * .465, 0, W * .5, H * .465, 14)
      cg.addColorStop(0, `rgba(255,120,40,${0.25 * eyeIntensity})`); cg.addColorStop(1, 'transparent')
      c.fillStyle = cg; c.beginPath(); c.arc(W * .5, H * .465, 14, 0, Math.PI * 2); c.fill()
      c.strokeStyle = 'rgba(0,0,0,0.12)'; c.lineWidth = 0.8
      ;[[W * .34, H * .49, W * .66, H * .49], [W * .36, H * .53, W * .64, H * .53]].forEach(([x1, y1, x2, y2]) => { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke() })
      ;[W * .27, W * .73].forEach(sx => {
        c.fillStyle = '#AAAAAA'; c.shadowColor = 'rgba(0,0,0,0.2)'; c.shadowBlur = 8
        c.beginPath(); c.arc(sx, H * .40, 17, 0, Math.PI * 2); c.fill()
        c.fillStyle = 'rgba(255,255,255,0.18)'; c.shadowBlur = 0
        c.beginPath(); c.arc(sx - 3, H * .40 - 3, 9, 0, Math.PI * 2); c.fill()
      })
      limb(W * .17, H * .33, 24, H * .12, 5, '#C4C4C2', '#B4B4B2')
      c.fillStyle = '#9A9A98'; c.beginPath(); c.arc(W * .17, H * .33 + H * .12, 9, 0, Math.PI * 2); c.fill()
      limb(W * .10, H * .44, 20, H * .11, 5, '#BEBEBC', '#AEAEAC')
      c.fillStyle = '#ABABAA'; c.beginPath(); c.roundRect(W * .04, H * .54, 32, 24, 5); c.fill()
      for (let i = 0; i < 4; i++) { c.fillStyle = '#A8A8A6'; c.beginPath(); c.roundRect(W * .05 + i * 7, H * .54, 5, 20, 2); c.fill() }
      limb(W * .83, H * .33, 24, H * .12, 5, '#C0C0BE', '#B0B0AE')
      c.fillStyle = '#969694'; c.beginPath(); c.arc(W * .83, H * .33 + H * .12, 9, 0, Math.PI * 2); c.fill()
      limb(W * .90, H * .44, 20, H * .11, 5, '#BABAB8', '#AAAAA8')
      c.fillStyle = '#A7A7A6'; c.beginPath(); c.roundRect(W * .88, H * .54, 32, 24, 5); c.fill()
      for (let i = 0; i < 4; i++) { c.fillStyle = '#A4A4A2'; c.beginPath(); c.roundRect(W * .89 + i * 7, H * .54, 5, 20, 2); c.fill() }
      const hg = c.createRadialGradient(W * .46, H * .19, 0, W * .50, H * .225, 68)
      hg.addColorStop(0, '#FFFFFF'); hg.addColorStop(.4, '#EEEEEC'); hg.addColorStop(.85, '#D2D2D0'); hg.addColorStop(1, '#BCBCBA')
      c.fillStyle = hg; c.shadowColor = 'rgba(0,0,0,0.22)'; c.shadowBlur = 18
      c.beginPath(); c.arc(W * .50, H * .215, 68, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0
      const hhl = c.createRadialGradient(W * .42, H * .165, 0, W * .42, H * .165, 38)
      hhl.addColorStop(0, 'rgba(255,255,255,0.5)'); hhl.addColorStop(1, 'transparent')
      c.fillStyle = hhl; c.beginPath(); c.arc(W * .42, H * .165, 38, 0, Math.PI * 2); c.fill()
      c.strokeStyle = 'rgba(0,0,0,0.07)'; c.lineWidth = 0.6
      ;[[W * .42, H * .10, W * .56, H * .19], [W * .58, H * .14, W * .60, H * .25], [W * .34, H * .22, W * .44, H * .29]].forEach(([x1, y1, x2, y2]) => { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke() })
      c.fillStyle = '#1A1412'; c.beginPath(); c.arc(W * .50, H * .215, 30, 0, Math.PI * 2); c.fill()
      c.strokeStyle = '#888888'; c.lineWidth = 3.5; c.beginPath(); c.arc(W * .50, H * .215, 28, 0, Math.PI * 2); c.stroke()
      const ir = c.createRadialGradient(W * .50, H * .215, 0, W * .50, H * .215, 22); const ib = eyeIntensity
      ir.addColorStop(0, `rgba(255,255,${Math.round(200 * ib)},${ib})`)
      ir.addColorStop(.15, `rgba(255,${Math.round(180 * ib)},${Math.round(60 * ib)},${ib})`)
      ir.addColorStop(.4, `rgba(255,${Math.round(100 * ib)},20,${ib})`)
      ir.addColorStop(.7, `rgba(${Math.round(200 * ib)},40,0,${ib})`)
      ir.addColorStop(1, `rgba(30,5,0,${ib})`)
      c.fillStyle = ir; c.beginPath(); c.arc(W * .50, H * .215, 22, 0, Math.PI * 2); c.fill()
      c.fillStyle = 'rgba(0,0,0,0.65)'; c.beginPath(); c.arc(W * .50, H * .215, 7, 0, Math.PI * 2); c.fill()
      c.fillStyle = `rgba(255,255,220,${0.75 * ib})`; c.beginPath(); c.arc(W * .47, H * .207, 3, 0, Math.PI * 2); c.fill()
      const ng = c.createLinearGradient(W * .42, H * .285, W * .58, H * .285)
      ng.addColorStop(0, '#999'); ng.addColorStop(1, '#888')
      c.fillStyle = ng; c.beginPath(); c.roundRect(W * .42, H * .285, W * .16, H * .045, 4); c.fill()
      c.restore()
    }
    const orbCanvas = document.getElementById('orb-canvas')
    if (orbCanvas) drawORB01(orbCanvas)

    /* ─── INTRO ANIMATION ─── */
    const FC = document.getElementById('flicker-c'), AC = document.getElementById('flare-c')
    const fctx = FC.getContext('2d'), actx = AC.getContext('2d')
    const introEL = document.getElementById('intro'), introClouds = document.getElementById('intro-clouds')
    function resizeC() { FC.width = AC.width = innerWidth; FC.height = AC.height = innerHeight }
    resizeC(); window.addEventListener('resize', resizeC)
    const T = { flickerEnd: 1500, flareStart: 1500, flareDur: 1200, apexHold: 400, descentStart: 3100, descentDur: 1800, outlineStart: 4900, outlineDur: 1600, emergeStart: 6200, emergeDur: 1200, heroStart: 7400, splitStart: 7400, splitDur: 700, introEnd: 8200 }
    let flickerIntv = null, introStart = 0, outlineProgress = 0, robotOpacity = 0, robotScale = 1, introDone = false
    function startFlicker() {
      fctx.fillStyle = '#000'; fctx.fillRect(0, 0, FC.width, FC.height)
      const t0 = Date.now()
      flickerIntv = setInterval(() => {
        const ela = Date.now() - t0, itx = Math.min(0.15, (ela / T.flickerEnd) * 0.15)
        fctx.fillStyle = '#000'; fctx.fillRect(0, 0, FC.width, FC.height)
        for (let i = 0; i < 3; i++) { if (Math.random() < itx * 5) { const y = Math.random() * FC.height, h = Math.random() * 2.5 + 0.5; fctx.fillStyle = `rgba(255,255,255,${Math.random() * itx * 0.9})`; fctx.fillRect(0, y, FC.width, h) } }
        if (Math.random() < itx * 2.5) { fctx.fillStyle = `rgba(255,210,50,${Math.random() * itx * 0.4})`; fctx.fillRect(0, 0, FC.width, FC.height) }
        if (Math.random() < itx * 4) { const nx = Math.random() * FC.width * .7, ny = Math.random() * FC.height; fctx.fillStyle = `rgba(247,255,90,${Math.random() * itx * 0.5})`; fctx.fillRect(nx, ny, Math.random() * 250 + 60, Math.random() * 1.5 + 0.5) }
      }, 55)
    }
    function stopFlicker() { if (flickerIntv) { clearInterval(flickerIntv); flickerIntv = null } fctx.clearRect(0, 0, FC.width, FC.height) }
    function drawFlareBeam(x, headY, tailY, mode = 'ascent') {
      const tl = tailY - headY; if (tl <= 0) return
      const wide = mode === 'descent' ? 1.4 : 1
      const g1 = actx.createLinearGradient(x, headY, x, tailY)
      g1.addColorStop(0, `rgba(255,230,80,${0.5 * wide})`); g1.addColorStop(.15, 'rgba(232,93,4,0.18)'); g1.addColorStop(.5, 'rgba(232,93,4,0.05)'); g1.addColorStop(1, 'transparent')
      actx.fillStyle = g1; actx.fillRect(x - 50 * wide, headY, 100 * wide, tl)
      const g2 = actx.createLinearGradient(x, headY, x, tailY)
      g2.addColorStop(0, 'rgba(255,240,110,0.85)'); g2.addColorStop(.12, 'rgba(255,160,30,0.45)'); g2.addColorStop(.4, 'rgba(232,93,4,0.12)'); g2.addColorStop(1, 'transparent')
      actx.fillStyle = g2; actx.fillRect(x - 18 * wide, headY, 36 * wide, tl)
      const g3 = actx.createLinearGradient(x, headY, x, tailY)
      g3.addColorStop(0, 'rgba(255,255,220,1)'); g3.addColorStop(.08, 'rgba(255,240,120,0.9)'); g3.addColorStop(.3, 'rgba(255,160,30,0.3)'); g3.addColorStop(1, 'transparent')
      actx.fillStyle = g3; actx.fillRect(x - 4, headY, 8, tl)
      const rg = actx.createRadialGradient(x, headY, 0, x, headY, 65 * wide)
      rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(.07, 'rgba(255,250,200,.95)'); rg.addColorStop(.25, 'rgba(255,200,60,.5)'); rg.addColorStop(.55, 'rgba(232,93,4,.1)'); rg.addColorStop(1, 'transparent')
      actx.fillStyle = rg; actx.beginPath(); actx.arc(x, headY, 65 * wide, 0, Math.PI * 2); actx.fill()
      if (mode === 'ascent') { for (let i = 0; i < 6; i++) { const sx = x + (Math.random() - .5) * 16, sy = headY + Math.random() * 25; actx.beginPath(); actx.arc(sx, sy, Math.random() * 2 + .3, 0, Math.PI * 2); actx.fillStyle = `rgba(255,255,200,${Math.random() * .9 + .1})`; actx.fill() } }
    }
    function drawRobotOutline(cx, cy, progress) {
      if (progress <= 0) return
      actx.save(); actx.shadowColor = '#F7FF5A'; actx.shadowBlur = 16; actx.strokeStyle = '#F7FF5A'; actx.lineWidth = 2.5; actx.globalAlpha = Math.min(1, progress * 2)
      const W = AC.width, H = AC.height, rs = Math.min(W, H) * 0.18
      const headP = Math.min(1, progress / 0.35)
      if (headP > 0) { actx.beginPath(); actx.arc(cx, cy - rs * 0.5, rs * 0.6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * headP); actx.stroke() }
      const shoulderP = Math.max(0, Math.min(1, (progress - 0.35) / 0.3))
      if (shoulderP > 0) {
        actx.globalAlpha = Math.min(1, shoulderP * 2); const sw = rs * 1.4
        actx.beginPath(); actx.moveTo(cx - sw * 0.5 * shoulderP, cy + rs * 0.05); actx.lineTo(cx + sw * 0.5 * shoulderP, cy + rs * 0.05); actx.stroke()
        actx.beginPath(); actx.moveTo(cx - sw * 0.5, cy + rs * 0.05); actx.lineTo(cx - sw * 0.7, cy - rs * 0.3 * shoulderP); actx.stroke()
        actx.beginPath(); actx.moveTo(cx + sw * 0.5, cy + rs * 0.05); actx.lineTo(cx + sw * 0.7, cy - rs * 0.3 * shoulderP); actx.stroke()
      }
      const torsoP = Math.max(0, Math.min(1, (progress - 0.65) / 0.35))
      if (torsoP > 0) {
        actx.globalAlpha = Math.min(1, torsoP * 2); const th = rs * 0.9 * torsoP
        actx.beginPath(); actx.moveTo(cx - rs * 0.7, cy + rs * 0.05); actx.lineTo(cx - rs * 0.5, cy + rs * 0.05 + th); actx.stroke()
        actx.beginPath(); actx.moveTo(cx + rs * 0.7, cy + rs * 0.05); actx.lineTo(cx + rs * 0.5, cy + rs * 0.05 + th); actx.stroke()
        actx.beginPath(); actx.moveTo(cx - rs * 0.5, cy + rs * 0.05 + th); actx.lineTo(cx + rs * 0.5, cy + rs * 0.05 + th); actx.stroke()
      }
      actx.restore()
    }
    function drawIntroBotOnAC(cx, cy, opacity, scale) {
      if (opacity <= 0) return
      actx.save(); actx.globalAlpha = Math.min(1, opacity); actx.translate(cx, cy); actx.scale(scale, scale)
      const sz = Math.min(AC.width, AC.height) * 0.12
      actx.fillStyle = 'rgba(230,230,228,0.9)'; actx.shadowColor = 'rgba(0,166,166,0.3)'; actx.shadowBlur = 20
      actx.beginPath(); actx.arc(0, -sz * 2.2, sz, 0, Math.PI * 2); actx.fill()
      actx.beginPath(); actx.roundRect(-sz * .7, -sz * 1.1, sz * 1.4, sz * 2, 8); actx.fill()
      actx.beginPath(); actx.roundRect(-sz * 1.6, -sz * 2, sz * .5, sz * 1.5, 4); actx.fill()
      actx.beginPath(); actx.roundRect(sz * 1.1, -sz * 2, sz * .5, sz * 1.5, 4); actx.fill()
      actx.beginPath(); actx.roundRect(-sz * .75, sz * .9, sz * .6, sz * 1.8, 4); actx.fill()
      actx.beginPath(); actx.roundRect(sz * .15, sz * .9, sz * .6, sz * 1.8, 4); actx.fill()
      actx.fillStyle = `rgba(255,110,30,${opacity})`; actx.shadowColor = 'rgba(255,100,20,0.8)'; actx.shadowBlur = 16
      actx.beginPath(); actx.arc(0, -sz * 2.2, sz * .36, 0, Math.PI * 2); actx.fill()
      actx.restore()
    }
    function runIntro() {
      introStart = Date.now()
      setTimeout(() => { const s = document.getElementById('skip'); if (s) s.style.opacity = '1' }, 700)
      startFlicker()
      function frame() {
        if (introDone) return
        const t = Date.now() - introStart
        actx.clearRect(0, 0, AC.width, AC.height)
        const W = AC.width, H = AC.height, fcx = W / 2, fbaseY = H + 20, apexY = H * 0.15, rbx = W * 0.52, rby = H * 0.48
        if (t >= T.flareStart && t < T.descentStart) {
          const elapsed = t - T.flareStart
          const phase = elapsed < T.flareDur ? 1 - (Math.pow(1 - (elapsed / T.flareDur), 3)) : 1
          drawFlareBeam(fcx, fbaseY + (apexY - fbaseY) * phase, fbaseY, 'ascent')
        }
        if (t >= T.descentStart && t < T.outlineStart) {
          const elapsed = t - T.descentStart, phase = Math.min(1, elapsed / T.descentDur)
          const easedP = 1 - Math.pow(1 - phase, 2)
          const headY = apexY + (rby - apexY) * easedP
          introClouds.style.opacity = Math.min(0.85, phase * 1.2)
          drawFlareBeam(fcx, headY, apexY, 'descent')
          drawIntroBotOnAC(rbx, rby, Math.max(0, (phase - 0.3) / 0.7) * 0.35, 1)
        }
        if (t >= T.outlineStart && t < T.emergeStart) {
          const elapsed = t - T.outlineStart
          outlineProgress = Math.min(1, elapsed / T.outlineDur)
          introClouds.style.opacity = '0.9'
          actx.save(); actx.globalAlpha = 0.3; drawFlareBeam(rbx, rby - 40, rby + 20, 'descent'); actx.restore()
          drawIntroBotOnAC(rbx, rby, 0.45, 1)
          drawRobotOutline(rbx, rby, outlineProgress)
        }
        if (t >= T.emergeStart && t < T.heroStart) {
          const elapsed = t - T.emergeStart, phase = Math.min(1, elapsed / T.emergeDur)
          introClouds.style.opacity = '1'
          robotOpacity = 0.45 + phase * 0.55; robotScale = 1 + phase * 0.06
          drawIntroBotOnAC(rbx, rby - phase * 20, robotOpacity, robotScale)
          const outFade = Math.max(0, 1 - phase * 2)
          if (outFade > 0) drawRobotOutline(rbx, rby, outFade)
        }
        if (t >= T.heroStart && !introDone) {
          introDone = true
          document.getElementById('sl').style.transform = 'translateX(-103%)'
          document.getElementById('sr').style.transform = 'translateX(103%)'
          setTimeout(() => {
            document.getElementById('hero-bg').style.opacity = '1'
            document.getElementById('hero-bg').style.transition = 'opacity 1.2s ease'
          }, 200)
          setTimeout(finishIntro, 900)
          return
        }
        requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
    }
    function finishIntro() {
      animate(introEL, { opacity: [1, 0], duration: 500, onComplete: () => { introEL.style.display = 'none' } })
      const s = document.getElementById('skip'); if (s) s.style.display = 'none'
      revealHero()
    }
    function revealHero() {
      const tl = createTimeline({ defaults: { ease: 'outExpo' } })
      tl
        .add('#hnav', { opacity: [0, 1], translateY: [-20, 0], duration: 700 })
        .add('.h-side.left', { opacity: [0, 1], translateX: [-50, 0], duration: 800 }, 200)
        .add('.h-side.right', { opacity: [0, 1], translateX: [50, 0], duration: 800 }, '<')
        .add('.lens-center', { opacity: [0, 1], scale: [0.88, 1], duration: 900 }, 150)
        .add('.fc-top', { opacity: [0, 1], translateY: [-18, 0], duration: 600, ease: 'outBack(1.3)' }, 500)
        .add('.fc-bot', { opacity: [0, 1], translateY: [18, 0], duration: 600, ease: 'outBack(1.3)' }, '<')
        .add('.lens-lbl', { opacity: [0, 1], duration: 500 }, 700)
        .add('#hfoot', { opacity: [0, 1], translateY: [18, 0], duration: 700 }, 600)
      setTimeout(setupRobotInteraction, 1200)
    }

    /* ─── ORB-01 MOUSE INTERACTION ─── */
    function setupRobotInteraction() {
      const orbWrap = document.getElementById('orb-wrap')
      const eyeG = document.getElementById('eye-glow'), eyeGO = document.getElementById('eye-glow-outer')
      if (!orbWrap) return
      let lc = { x: 0, y: 0 }
      function refreshLC() { const r = orbWrap.getBoundingClientRect(); lc.x = r.left + r.width / 2; lc.y = r.top + r.height / 2 }
      refreshLC(); window.addEventListener('resize', refreshLC); window.addEventListener('scroll', refreshLC, { passive: true })
      const bodyTilt = createAnimatable(orbWrap, { rotateX: { duration: 1400, ease: 'outQuad' }, rotateY: { duration: 1400, ease: 'outQuad' }, translateX: { duration: 900, ease: 'outQuad' }, translateY: { duration: 1000, ease: 'outQuad' } })
      const eyeTilt = createAnimatable(eyeG, { translateX: { duration: 550, ease: 'outQuad' }, translateY: { duration: 650, ease: 'outQuad' } })
      const eyeTiltO = createAnimatable(eyeGO, { translateX: { duration: 550, ease: 'outQuad' }, translateY: { duration: 650, ease: 'outQuad' } })
      let idleTimer = null, idleAnim = null
      document.addEventListener('mousemove', e => {
        if (idleAnim) { idleAnim.cancel(); idleAnim = null } clearTimeout(idleTimer)
        const nx = (e.clientX - innerWidth / 2) / (innerWidth / 2), ny = (e.clientY - innerHeight / 2) / (innerHeight / 2)
        bodyTilt.rotateY(nx * 7); bodyTilt.rotateX(-ny * 4); bodyTilt.translateX(nx * 8); bodyTilt.translateY(ny * 3)
        const ex = nx * 14, ey = ny * 10
        eyeTilt.translateX(ex - 8); eyeTilt.translateY(ey); eyeTiltO.translateX(ex - 8); eyeTiltO.translateY(ey)
        const dist = Math.sqrt((e.clientX - lc.x) ** 2 + (e.clientY - lc.y) ** 2)
        const prox = 1 - Math.min(1, dist / (Math.min(innerWidth, innerHeight) * 0.4))
        eyeG.style.opacity = 0.85 + prox * 0.15
        eyeG.style.transform = `translate(calc(-38% + ${ex}px), calc(-50% + ${ey}px)) scale(${1 + prox * 0.2})`
        idleTimer = setTimeout(startIdle, 3000)
      })
      function startIdle() {
        idleAnim = animate(orbWrap, { rotateY: [{ to: 5, duration: 2800, ease: 'inOutSine' }, { to: -6, duration: 3200, ease: 'inOutSine' }, { to: 2, duration: 2400, ease: 'inOutSine' }, { to: 0, duration: 2000, ease: 'inOutSine' }], rotateX: [{ to: 2, duration: 3500, ease: 'inOutSine' }, { to: -2, duration: 3000, ease: 'inOutSine' }, { to: 0, duration: 2000, ease: 'inOutSine' }], translateX: [{ to: 5, duration: 4000, ease: 'inOutSine' }, { to: -4, duration: 4000, ease: 'inOutSine' }, { to: 0, duration: 3000, ease: 'inOutSine' }], loop: true })
        animate(eyeG, { translateX: [{ to: '-28%', duration: 2800, ease: 'inOutSine' }, { to: '-48%', duration: 3200, ease: 'inOutSine' }, { to: '-38%', duration: 2400, ease: 'inOutSine' }, { to: '-38%', duration: 2000, ease: 'inOutSine' }], translateY: [{ to: '-44%', duration: 3500, ease: 'inOutSine' }, { to: '-55%', duration: 3000, ease: 'inOutSine' }, { to: '-50%', duration: 2000, ease: 'inOutSine' }], loop: true })
      }
      setTimeout(startIdle, 500)
    }

    /* ─── SKIP ─── */
    const skipBtn = document.getElementById('skip')
    if (skipBtn) skipBtn.addEventListener('click', () => {
      introDone = true; stopFlicker(); introEL.style.display = 'none'
      skipBtn.style.display = 'none'
      document.getElementById('sl').style.transform = 'translateX(-103%)'
      document.getElementById('sr').style.transform = 'translateX(103%)'
      const hb = document.getElementById('hero-bg'); if (hb) { hb.style.transition = 'opacity 1.2s ease'; hb.style.opacity = '1' }
      revealHero()
    })

    /* ─── SCROLL REVEALS ─── */
    function watch(el, fn, margin) {
      if (!el) return
      new IntersectionObserver((entries, obs) => { entries.forEach(e => { if (e.isIntersecting) { fn(); obs.unobserve(e.target) } }) }, { rootMargin: margin || '-8% 0px' }).observe(el)
    }
    document.querySelectorAll('.reveal').forEach(el => {
      watch(el, () => { animate(el, { opacity: [0, 1], translateY: [32, 0], rotateX: [-10, 0], duration: 750, ease: 'outExpo', transformPerspective: 1000 }) }, '-6% 0px')
    })

    /* ─── WALLPAPER TEXT PARALLAX ─── */
    setTimeout(() => {
      animate('#prob-wall', { translateX: [0, -60], autoplay: onScroll({ target: '#problem', enter: 'top bottom', leave: 'bottom top', sync: true }) })
    }, 100)

    /* ─── SERVICE ROWS STAGGER ─── */
    watch(document.querySelector('.sig-rows'), () => { animate('.sig-row', { opacity: [0, 1], translateX: [-40, 0], delay: stagger(120), duration: 700, ease: 'outExpo' }) }, '-6% 0px')

    /* ─── DIAGNOSTIC TABLE ROW STAGGER ─── */
    watch(document.querySelector('.chk-tbl'), () => { animate('.chk-tbl tbody tr', { opacity: [0, 1], translateX: [-24, 0], delay: stagger(80), duration: 600, ease: 'outExpo' }) }, '-4% 0px')

    /* ─── WORK CARDS ─── */
    watch(document.querySelector('.work-strip'), () => { animate('.wcard', { opacity: [0, 1], translateY: [48, 0], delay: stagger(140), duration: 850, ease: 'outExpo' }) }, '-6% 0px')

    /* ─── STATS COUNTER ─── */
    watch(document.querySelector('.stats-float'), () => {
      const defs = [{ sel: '#sn1', end: 17, pre: '#', suf: '' }, { sel: '#sn2', end: 1, pre: '<', suf: '%' }, { sel: '#sn3', end: 4, pre: '', suf: 'M' }, { sel: '#sn4', end: 3, pre: '', suf: '' }]
      defs.forEach(d => { const el = document.querySelector(d.sel); if (!el) return; const obj = { v: 0 }; animate(obj, { v: [0, d.end], duration: 2200, ease: 'outExpo', onUpdate: () => { el.textContent = d.pre + Math.round(obj.v) + d.suf } }) })
      animate('.stat-item', { opacity: [0, 1], translateY: [60, 0], delay: stagger(150), duration: 900, ease: 'outExpo' })
    }, '-6% 0px')

    /* ─── PROCESS LIST STAGGER ─── */
    watch(document.querySelector('.proc-list'), () => { animate('.proc-item', { opacity: [0, 1], translateX: [-32, 0], delay: stagger(100), duration: 700, ease: 'outExpo' }) }, '-4% 0px')

    /* ─── PRICING ENTRANCE ─── */
    watch(document.querySelector('.price-feat'), () => {
      animate('.price-feat', { opacity: [0, 1], translateY: [40, 0], duration: 900, ease: 'outExpo' })
      animate('.psc', { opacity: [0, 1], translateY: [30, 0], delay: stagger(120), duration: 750, ease: 'outExpo' })
    }, '-6% 0px')

    /* ─── CTA YELLOW ENTRANCE ─── */
    watch(document.querySelector('#cta'), () => {
      animate('.cta-y-title', { letterSpacing: ['0.06em', 'normal'], opacity: [0, 1], duration: 1000, ease: 'outExpo' })
      animate('.cta-deco', { opacity: [0, 0.04], translateX: [40, 0], duration: 1400, ease: 'outExpo' })
    }, '-8% 0px')

    /* ─── WCARD HOVER TILT ─── */
    document.querySelectorAll('.wcard').forEach(card => {
      const t = createAnimatable(card, { rotateX: { duration: 300, ease: 'outQuad' }, rotateY: { duration: 300, ease: 'outQuad' }, scale: { duration: 300, ease: 'outQuad' } })
      card.addEventListener('mousemove', e => { const r = card.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; t.rotateY(x * 6); t.rotateX(-y * 4); t.scale(1.015) })
      card.addEventListener('mouseleave', () => { t.rotateX(0); t.rotateY(0); t.scale(1) })
    })

    /* ─── STICKY NAV ─── */
    const siteNav = document.getElementById('site-nav')
    window.addEventListener('scroll', () => { siteNav.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8) }, { passive: true })

    /* ─── HERO PARALLAX ─── */
    setTimeout(() => {
      animate('#orb-wrap', { translateY: [0, -80], autoplay: onScroll({ target: '#hero', enter: 'top top', leave: 'bottom top', sync: true }) })
      animate('.fc-top', { translateY: [0, -55], autoplay: onScroll({ target: '#hero', enter: 'top top', leave: 'bottom top', sync: true }) })
      animate('.fc-bot', { translateY: [0, -35], autoplay: onScroll({ target: '#hero', enter: 'top top', leave: 'bottom top', sync: true }) })
    }, 100)

    /* ─── LAUNCH ─── */
    runIntro()
  }, [])

  const snl = { fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgba(23,19,18,0.4)', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none' } as const
  const divider = { width: '100%', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)' } as const

  return (
    <>
      <div id="cursor" />
      <div id="cursor-ring" />

      {/* ═══ INTRO ═══ */}
      <div id="intro">
        <div id="intro-clouds" />
        <canvas id="flicker-c" />
        <canvas id="flare-c" />
        <div id="sl" />
        <div id="sr" />
        <div id="flash-el" />
      </div>
      <button id="skip" style={{ fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '0.5px solid rgba(255,255,255,0.2)', padding: '8px 18px', borderRadius: '100px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)', cursor: 'pointer', opacity: 0, transition: 'opacity 0.5s,all 0.2s', pointerEvents: 'all', position: 'fixed', bottom: '28px', right: '28px', zIndex: 600 }}>SKIP INTRO</button>

      {/* ═══ HERO ═══ */}
      <section id="hero">
        <div id="hero-bg">
          <video id="hero-video" autoPlay muted loop playsInline preload="auto" poster="/video/hero-poster.jpg">
            <source src="/video/signal-flare-hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div id="hero-overlay" />
        <div id="hero-ground" />
        <nav id="hnav">
          <div>
            <div className="nav-logo"><span className="logo-mental">MENTAL</span><span className="logo-vision">VISION</span></div>
            <div className="nav-logo-tag">AI Visibility + Cinematic Creative · Indianapolis, IN</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a className="nl" href="#check">AEO Audit</a>
            <a className="nl" href="#signal">Creative</a>
            <a className="nl" href="#pricing">Pricing</a>
            <a className="ncta" href="#cta">Run My Score →</a>
          </div>
        </nav>
        <div id="hero-layout">
          <div className="h-side left">
            <div className="h-eyebrow"><div className="h-ey-dot" />What AI currently sees</div>
            <div className="h-headline">Trusted<br />locally.<br /><span className="glass-text-orange" style={{ fontStyle: 'italic' }}>Invisible</span><br /><span style={{ WebkitTextFillColor: '#fff' }}>to AI.</span></div>
            <div className="h-sub">GPTBot blocked.<br />llms.txt missing.<br />0 citations across<br />4 AI platforms.<br />Great business.<br />No signal.</div>
          </div>
          <div style={divider} />
          <div className="lens-center">
            <div id="orb-wrap">
              <canvas id="orb-canvas" width={300} height={480} />
              <div id="eye-glow-outer" />
              <div id="eye-glow" />
              <div className="fc fc-top">
                <div className="fc-num or">23</div>
                <div className="fc-label">AI Score</div>
                <div className="fc-sub">Before Mental Vision</div>
              </div>
              <div className="fc fc-bot">
                <div className="fc-num tl">78</div>
                <div className="fc-label">AI Score</div>
                <div className="fc-sub">After 7-Day Rebuild</div>
              </div>
            </div>
            <div className="lens-lbl">ORB-01 · Observation Mode · Active</div>
          </div>
          <div style={divider} />
          <div className="h-side right">
            <div className="h-eyebrow" style={{ justifyContent: 'flex-end' }}><div className="h-ey-dot" style={{ animationDelay: '1s' }} />After Mental Vision</div>
            <div className="h-headline" style={{ textAlign: 'right' }}>Scanned.<br />Structured.<br /><span style={{ fontStyle: 'italic', background: 'linear-gradient(125deg,rgba(0,220,220,1) 0%,rgba(180,255,255,0.9) 30%,rgba(0,200,200,0.95) 60%,rgba(150,255,255,0.85) 100%)', backgroundSize: '250% 250%', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'glass-shimmer 8s 2s ease-in-out infinite', filter: 'drop-shadow(0 0 14px rgba(0,166,166,0.4))' }}>Found.</span></div>
            <div className="h-sub" style={{ textAlign: 'right' }}>llms.txt live.<br />Bots unblocked.<br />Every AI engine<br />cites you first.</div>
          </div>
        </div>
        <div id="hfoot">
          <div className="hf-text"><strong>If AI can&apos;t see you,</strong> customers won&apos;t either.</div>
          <div className="hf-r">
            <div><div className="hf-num">&lt;1%</div><div className="hf-lbl">Have llms.txt</div></div>
            <a className="hf-cta" href="#cta">Fix My Signal →</a>
          </div>
        </div>
      </section>

      {/* ═══ STICKY NAV ═══ */}
      <nav id="site-nav">
        <div>
          <a className="nav-logo" href="#hero" style={{ color: 'var(--charcoal)' }}>MENTAL<em style={{ color: 'var(--orange)', fontStyle: 'normal' }}>VISION</em></a>
          <div className="nav-logo-tag" style={{ color: 'rgba(23,19,18,0.3)' }}>AI Visibility + Cinematic Creative</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#check" style={snl}>Audit</a>
          <a href="#signal" style={snl}>Creative</a>
          <a href="#work" style={snl}>Work</a>
          <a href="#pricing" style={snl}>Pricing</a>
          <a className="ncta" href="#cta">Run My Score</a>
        </div>
      </nav>

      {/* ═══ TICKER ═══ */}
      <div id="ticker">
        <div className="t-row t-row-1">
          {[['Indianapolis Colts', 1], ['Horsepower Campaign', 0], ['Louis Vuitton AI Win', 1], ['Red Print Magazine', 0], ['#17 of 8,500+ Creators', 1], ['A Few Good Men', 0], ['Indianapolis Colts', 1], ['Horsepower Campaign', 0], ['Louis Vuitton AI Win', 1], ['Red Print Magazine', 0], ['#17 of 8,500+ Creators', 1], ['A Few Good Men', 0]].map((it, i) => (
            <div key={i} className={`t-item${it[1] ? ' hi' : ''}`}>{it[0]}<div className="t-sep" /></div>
          ))}
        </div>
        <div className="t-row t-row-2">
          {[['AEO · AI Visibility', 1], ['llms.txt · Schema · Citations', 0], ['Seedance 2.0 · UGC Production', 1], ['Signal Flare System', 0], ['Indianapolis, Indiana', 1], ['Discovery Is The First Connection', 0], ['AEO · AI Visibility', 1], ['llms.txt · Schema · Citations', 0], ['Seedance 2.0 · UGC Production', 1], ['Signal Flare System', 0], ['Indianapolis, Indiana', 1], ['Discovery Is The First Connection', 0]].map((it, i) => (
            <div key={i} className={`t-item${it[1] ? ' hi' : ''}`}>{it[0]}<div className="t-sep" /></div>
          ))}
        </div>
      </div>

      {/* ═══ PROBLEM ═══ */}
      <section id="problem">
        <div className="prob-wall" id="prob-wall">INVISIBLE.</div>
        <div className="prob-inner">
          <div className="reveal">
            <div className="prob-label">The Problem</div>
            <div className="prob-headline">Great business.<br /><em>Weak signal.</em></div>
            <div className="prob-body">AI engines are making recommendations, booking appointments, and routing customers right now. Most local businesses don&apos;t appear in a single result — not because they&apos;re bad, but because AI literally cannot read them.</div>
            <div className="prob-stats">
              <div className="psr"><span className="psr-n">&lt;1%</span><span className="psr-l">Have llms.txt</span></div>
              <div className="psr"><span className="psr-n">4M</span><span className="psr-l">AI Searches<br />Per Day</span></div>
              <div className="psr"><span className="psr-n">0</span><span className="psr-l">Avg. Citations<br />Found</span></div>
            </div>
          </div>
          <div className="reveal">
            <div className="prob-scan">
              <div className="sd-head">
                <div className="sd-title">Live AI Visibility Scan</div>
                <div className="sd-live"><div className="sd-dot" />Scanning</div>
              </div>
              <div className="sd-rows">
                <div className="sd-row fail"><span className="sd-name">AI bot access (GPTBot)</span><span className="sd-status bad">BLOCKED</span></div>
                <div className="sd-row fail"><span className="sd-name">llms.txt file</span><span className="sd-status bad">MISSING</span></div>
                <div className="sd-row fail"><span className="sd-name">Schema markup</span><span className="sd-status bad">ABSENT</span></div>
                <div className="sd-row fail"><span className="sd-name">LLM citations — 4 platforms</span><span className="sd-status bad">0 FOUND</span></div>
                <div className="sd-row pass"><span className="sd-name">Google rating</span><span className="sd-status ok">4.8 ★ STRONG</span></div>
                <div className="sd-row"><span className="sd-name">Social presence</span><span className="sd-status warn">WEAK</span></div>
              </div>
              <div className="sd-score">
                <div><div style={{ fontFamily: "'DM Mono',monospace", fontSize: '7px', color: 'rgba(23,19,18,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>AI Visibility Score</div><div className="sd-snum">23</div></div>
                <div className="sd-sbar"><div className="sd-sfill" /></div>
                <div className="sd-srem">Recoverable in 7 days →</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="signal">
        <div className="sig-top reveal">
          <div>
            <div className="sig-eyebrow">What Mental Vision Builds</div>
            <div className="sig-big">THE SIGNAL<br />AND THE <em>SPECTACLE.</em></div>
          </div>
          <div className="sig-tagline">AI Visibility gives machines the proof they need to recommend you. Cinematic content gives humans the emotion they need to choose you.</div>
        </div>
        <div className="sig-rows">
          <div className="sig-row reveal">
            <div className="sig-rn">01</div><div className="sig-rd" />
            <div className="sig-rtitle">AI<br />VISIBILITY</div>
            <div className="sig-rbody">Make your business easier for AI engines to crawl, understand, and recommend. llms.txt, schema markup, AI bot access, citation strategy — all deployed for you. Your business becomes readable before anything else.</div>
            <div><span className="sig-rtag">AEO + llms.txt</span></div>
          </div>
          <div className="sig-row reveal">
            <div className="sig-rn">02</div><div className="sig-rd" />
            <div className="sig-rtitle">AUTHORITY<br />PAGES</div>
            <div className="sig-rbody">Turn scattered proof into structured pages AI and customers both trust. Landing pages that convert. Content that feeds the algorithm. Every word placed with precision for the machines and the humans reading it.</div>
            <div><span className="sig-rtag">Content + Conversion</span></div>
          </div>
          <div className="sig-row reveal">
            <div className="sig-rn">03</div><div className="sig-rd" />
            <div className="sig-rtitle">CINEMATIC<br />CREATIVE</div>
            <div className="sig-rbody">AI-generated, cinema-quality content that stops the scroll and keeps the algorithm fed. UGC video via Seedance 2.0, branded visuals, Meta ad creative, social packs — made at a pace traditional agencies can&apos;t match.</div>
            <div><span className="sig-rtag">UGC + Brand Film</span></div>
          </div>
        </div>
      </section>

      {/* ═══ CHECK ═══ */}
      <section id="check">
        <div className="chk-top reveal">
          <div><div className="chk-vw-title">WHAT<br />WE <em>CHECK.</em></div></div>
          <div className="chk-meta">Six signals. Every one determines whether AI recommends your business or your competitor&apos;s. We score all of them — then fix the ones that matter first.</div>
        </div>
        <div className="chk-wrap">
          <table className="chk-tbl">
            <thead>
              <tr>
                <th style={{ width: '80px' }}></th>
                <th>Category</th><th>Signal</th><th>Status</th><th>What It Means</th>
              </tr>
            </thead>
            <tbody>
              <tr className="reveal"><td className="ckr-n">01</td><td className="ckr-cat">AI Search<br />Presence</td><td className="ckr-bc"><span className="ckr-badge crit">Critical</span></td><td className="ckr-body">Can ChatGPT, Claude, Perplexity, Gemini, and Google AI describe your business — or do they draw a blank? We test all five and document exactly what each platform knows about you.</td></tr>
              <tr className="reveal"><td className="ckr-n">02</td><td className="ckr-cat">Crawl<br />Readiness</td><td className="ckr-bc"><span className="ckr-badge crit">Critical</span></td><td className="ckr-body">Are AI bots allowed to access your site? Most businesses unknowingly block them in robots.txt — locking the door on every AI recommendation before it even starts.</td></tr>
              <tr className="reveal"><td className="ckr-n">03</td><td className="ckr-cat">Entity<br />Clarity</td><td className="ckr-bc"><span className="ckr-badge high">High</span></td><td className="ckr-body">Does the internet clearly understand your business name, location, service area, and category? Ambiguity kills AI recommendations. We verify all data sources that feed these signals.</td></tr>
              <tr className="reveal"><td className="ckr-n">04</td><td className="ckr-cat">Review<br />Signal</td><td className="ckr-bc"><span className="ckr-badge high">High</span></td><td className="ckr-body">What do customers repeatedly say you&apos;re great at? AI uses review themes to form descriptions. We extract and structure those themes for citation value across every platform.</td></tr>
              <tr className="reveal"><td className="ckr-n">05</td><td className="ckr-cat">Authority<br />Content</td><td className="ckr-bc"><span className="ckr-badge med">Medium</span></td><td className="ckr-body">Do you have pages that answer the questions AI engines use when forming recommendations? Service clarity, FAQ depth, local relevance — all scored against what AI actually pulls from.</td></tr>
              <tr className="reveal"><td className="ckr-n">06</td><td className="ckr-cat">Conversion<br />Proof</td><td className="ckr-bc"><span className="ckr-badge conv">Conversion</span></td><td className="ckr-body">Once AI sends someone your way — does the page close them? We check whether your experience turns interest into a booked call, quote request, or direct contact.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══ WORK ═══ */}
      <section id="work">
        <div className="work-top reveal">
          <div className="work-vw">SIGNAL<br />BUILDS.</div>
          <a className="work-all" href="#">View All Work →</a>
        </div>
        <div className="work-strip">
          <a className="wcard" href="#">
            <div className="wcard-thumb wc-colts"><div className="wcard-badge real">Real Work</div><div className="wv-ring">🐎</div><div className="wcard-idx">01</div></div>
            <div className="wcard-info"><div className="wcard-cli">Indianapolis Colts · NFL</div><div className="wcard-name">HORSEPOWER</div><div className="wcard-desc">Official theme song video · Cinematic AI production · Ongoing collaboration</div></div>
            <div className="wcard-foot"><span className="wcard-lnk">View Project</span><span className="wcard-arr">→</span></div>
          </a>
          <a className="wcard" href="#">
            <div className="wcard-thumb wc-lv"><div className="wcard-badge real">Real Work</div><div className="wv-lv"><div className="wv-lv-m">LV</div><div className="wv-lv-t">AI Campaign Winner</div></div><div className="wcard-idx">02</div></div>
            <div className="wcard-info"><div className="wcard-cli">Louis Vuitton · Luxury Fashion</div><div className="wcard-name">LV AI CAMPAIGN</div><div className="wcard-desc">Global AI campaign contest winner · Visual identity + creative direction</div></div>
            <div className="wcard-foot"><span className="wcard-lnk">View Project</span><span className="wcard-arr">→</span></div>
          </a>
          <a className="wcard" href="#">
            <div className="wcard-thumb wc-demo"><div className="wcard-badge concept">Concept Build</div><div className="wv-demo"><div className="wv-score">78</div><div className="wv-score-lbl">AI Score After</div></div><div className="wcard-idx dk">03</div></div>
            <div className="wcard-info"><div className="wcard-cli">HVAC · Indianapolis · Demo</div><div className="wcard-name">ZERO TO FOUND</div><div className="wcard-desc">23 → 78 AI score rebuild in 7 days</div></div>
            <div className="wcard-foot"><span className="wcard-lnk">View Case Study</span><span className="wcard-arr">→</span></div>
          </a>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section id="stats">
        <div className="stats-bg-word">PROOF.</div>
        <div className="stats-float">
          <div className="stat-item reveal"><span className="stat-n" id="sn1">#17</span><span className="stat-l">Global AI Creator Rank</span><div className="stat-d">Out of 8,500+ creators in the Skool Community.</div></div>
          <div className="stat-item reveal"><span className="stat-n" id="sn2">&lt;1%</span><span className="stat-l">Have llms.txt</span><div className="stat-d">The file we build for every client by Day 2.</div></div>
          <div className="stat-item reveal"><span className="stat-n" id="sn3">4M</span><span className="stat-l">AI Searches Daily</span><div className="stat-d">Most businesses appear in zero of them.</div></div>
          <div className="stat-item reveal"><span className="stat-n" id="sn4">3</span><span className="stat-l">Exclusive Services</span><div className="stat-d">llms.txt · AI Bot Audit · AEO Strategy.</div></div>
        </div>
      </section>

      {/* ═══ PROCESS ═══ */}
      <section id="process">
        <div className="proc-header reveal">
          <div className="proc-vw">FOUR STEPS.<br />NO GUESSING.</div>
          <div className="proc-intro">Most agencies run a slow, expensive audit then disappear. Mental Vision runs the scan, scores the signal, fixes the gaps, and builds the content — inside one system, without the lag.</div>
        </div>
        <ul className="proc-list">
          <li className="proc-item reveal"><div className="proc-num">01</div><div className="proc-right"><div className="proc-bar" /><div className="proc-title">SCAN</div><div className="proc-body">Live audit across ChatGPT, Claude, Perplexity, and Google AI. robots.txt, llms.txt, schema, social — every gap documented with real data and a score from 0–100.</div></div></li>
          <li className="proc-item reveal"><div className="proc-num">02</div><div className="proc-right"><div className="proc-bar" /><div className="proc-title">SCORE</div><div className="proc-body">7 categories. Real numbers. The score determines your exact plan — what to fix first, what&apos;s optional, and what&apos;s actively hurting your AI recommendations right now.</div></div></li>
          <li className="proc-item reveal"><div className="proc-num">03</div><div className="proc-right"><div className="proc-bar" /><div className="proc-title">FIX</div><div className="proc-body">llms.txt deployed, AI bots unblocked, schema installed, citations submitted. Your signal goes live within 48 hours. Measurable before we touch the creative.</div></div></li>
          <li className="proc-item reveal"><div className="proc-num">04</div><div className="proc-right"><div className="proc-bar" /><div className="proc-title">CREATE</div><div className="proc-body">Cinematic content that keeps you found and makes people act. UGC video, landing pages, Meta ad creative, social packs. The algorithm feeds. Your pipeline fills.</div></div></li>
        </ul>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing">
        <div className="pricing-header reveal">
          <div className="pricing-vw">THREE OFFERS.<br />ONE RIGHT FIT.</div>
          <div className="pricing-sub">Every tier is built on the same system. The difference is depth, speed, and how much of the machine we build for you.</div>
        </div>
        <div className="price-feat reveal">
          <div className="pf-left">
            <div className="pf-badge">★ Flagship Offer</div>
            <div className="pf-tag">AI Visibility Foundation</div>
            <div className="pf-name">Full Build</div>
            <div className="pf-ideal">For scores 55–100 · Ready to grow · Most complete offering. The entire Mental Vision system — built for you, not by you.</div>
            <div className="pf-amount">$2,500</div>
            <div className="pf-cadence">one-time full build · everything included</div>
            <a className="pf-btn" href="mailto:create@mentalvision.ai">BUILD THE FOUNDATION →</a>
          </div>
          <div className="pf-right">
            <div className="pf-desc">The complete Mental Vision system. Full audit, full technical fix, full cinematic content package — everything needed to become the AI-recommended business in your market.</div>
            <div className="pf-items">
              <div className="pf-item">Full LLM audit — 5 AI platforms</div>
              <div className="pf-item">llms.txt + robots.txt fully configured</div>
              <div className="pf-item">Complete schema installation — 6 types</div>
              <div className="pf-item">1 AI-optimized landing page — Meta-ready</div>
              <div className="pf-item">Meta ad copy — 5 headlines, 3 body variants</div>
              <div className="pf-item">1 UGC video ad (30–60 sec) via Seedance</div>
              <div className="pf-item">Custom branded score card visual asset</div>
              <div className="pf-item">Social media starter pack — 5 platforms</div>
              <div className="pf-item">30-day before/after AI visibility report</div>
            </div>
          </div>
        </div>
        <div className="price-small">
          <div className="psc reveal">
            <div className="psc-tag">Signal Starter</div>
            <div className="psc-name">7-Day Rebuild</div>
            <div className="psc-ideal">For scores 0–54 · Invisible · Cold default · Fast diagnostic and first visibility layer. Everything in 7 days.</div>
            <div className="psc-price">$1,250</div>
            <div className="psc-cad">one-time sprint</div>
            <div className="psc-items">
              <div className="psci">Full AI Visibility Score audit — Day 1</div>
              <div className="psci">llms.txt built and deployed — Day 2</div>
              <div className="psci">AI bot access fixed — Day 2</div>
              <div className="psci">Schema markup: Org + LocalBusiness — Day 3</div>
              <div className="psci">1 custom landing page — AI-optimized — Day 4–5</div>
              <div className="psci">1 UGC video ad via Seedance — Day 4–5</div>
              <div className="psci">5 priority citation submissions — Day 6</div>
              <div className="psci">90-day handoff action plan — Day 7</div>
            </div>
            <a className="psc-btn" href="mailto:create@mentalvision.ai">START THE REBUILD</a>
          </div>
          <div className="psc reveal">
            <div className="psc-tag">Stay Found System</div>
            <div className="psc-name">Retention</div>
            <div className="psc-ideal">Post-build only · Never cold · Score 55–74 · Continuous monitoring and creative refresh so your signal stays strong.</div>
            <div className="psc-price">$797</div>
            <div className="psc-cad">per month · cancel anytime</div>
            <div className="psc-items">
              <div className="psci">Monthly AI visibility monitoring — 5 platforms</div>
              <div className="psci">Monthly score report with competitor data</div>
              <div className="psci">2 UGC content drops per month</div>
              <div className="psci">5 new authority citation submissions monthly</div>
              <div className="psci">1 AI-optimized blog post per month</div>
              <div className="psci">8 branded social posts per month</div>
              <div className="psci">Quarterly landing page refresh</div>
              <div className="psci">Monthly 20-min strategy call</div>
            </div>
            <a className="psc-btn" href="mailto:create@mentalvision.ai">STAY FOUND</a>
          </div>
        </div>
        <div className="price-guarantee">Guarantee: <em>Delivery-based only</em> — never rankings, leads, or revenue. You keep everything built, even if you cancel.</div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="cta">
        <div className="cta-deco">FOUND.</div>
        <div className="cta-y-pre reveal">The next AI search is happening right now</div>
        <div className="cta-y-title reveal">Can AI find<br />your business<br /><em>right now?</em></div>
        <div className="cta-y-sub reveal">We scan the signals, expose the gaps, and show exactly what needs to be fixed first. No call required. No pitch. Just your AI Visibility Score — and a clear path forward.</div>
        <div className="cta-y-btns reveal">
          <a className="cta-y-primary" href="mailto:create@mentalvision.ai">RUN MY VISIBILITY SCAN →</a>
          <a className="cta-y-ghost" href="#check">SEE WHAT AI SEES</a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer>
        <div className="fi">
          <div>
            <a className="f-logo" href="#hero">MENTAL<em>VISION</em></a>
            <div className="f-tag">AI Visibility + Cinematic Creative<br />Indianapolis, Indiana · Est. 2024<br />#17 of 8,500+ AI Creators · Skool Community</div>
            <a className="f-email" href="mailto:create@mentalvision.ai">create@mentalvision.ai</a>
          </div>
          <div><div className="f-head">Services</div><a className="f-link" href="#">AI Visibility Scan</a><a className="f-link" href="#">llms.txt Build</a><a className="f-link" href="#">AI Bot Audit</a><a className="f-link" href="#">UGC Production</a><a className="f-link" href="#">Landing Pages</a><a className="f-link" href="#">Meta Ad Creative</a></div>
          <div><div className="f-head">Company</div><a className="f-link" href="#">About</a><a className="f-link" href="#">Work</a><a className="f-link" href="#">Pricing</a><a className="f-link" href="#">Signal Flare System</a><a className="f-link" href="#">Contact</a></div>
          <div><div className="f-head">Connect</div><a className="f-link" href="#">LinkedIn</a><a className="f-link" href="#">Instagram</a><a className="f-link" href="#">TikTok</a><a className="f-link" href="#">YouTube</a><a className="f-link" href="mailto:create@mentalvision.ai">Email</a></div>
        </div>
        <div className="fb">
          <div className="fb-l">© 2026 Mental Vision Corp · All rights reserved · Indianapolis, IN</div>
          <div className="fb-r">AI Visibility + Cinematic Creative · Signal Flare System v3.0</div>
        </div>
      </footer>
    </>
  )
}
