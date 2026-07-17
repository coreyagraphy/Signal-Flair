// @ts-nocheck
'use client'
/* eslint-disable */
import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, createTimeline, createAnimatable, stagger, onScroll } from 'animejs'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SignalFlairLogo from './SignalFlairLogo'
import UnfairAdvantage from './UnfairAdvantage'
import { track } from '@/lib/analytics'

/** Build-time inlined (static export). Platform-neutral: Jarvis or other routers can use FIELD_REPORT_WEBHOOK_URL. */
const FIELD_REPORT_WEBHOOK_OVERRIDE = ''
const FIELD_REPORT_WEBHOOK_URL =
  (process.env.NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL ?? '').trim() ||
  (process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL ?? '').trim() ||
  FIELD_REPORT_WEBHOOK_OVERRIDE
const FIELD_REPORT_FALLBACK_EMAIL = 'hello@signalflair.ai'

const LEAD_REQUIRED = ['full_name', 'business_name', 'website_url', 'email', 'primary_service']
const LEAD_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * SignalFlairLanding — the canonical Signal Flair landing page / homepage.
 * Ported from the approved "mentalvision-bold" design. Markup is JSX; the
 * original intro/robot/scroll logic runs once in the mount effect via anime.js.
 * Styles live in globals.css. Hero background uses /video/signal-flair-hero.mp4.
 */
export default function SignalFlairLanding() {
  const started = useRef(false)
  const leadFormRef = useRef(null)
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadSuccess, setLeadSuccess] = useState(false)
  const [leadFormError, setLeadFormError] = useState('')
  const [leadFieldErrors, setLeadFieldErrors] = useState({})

  const validateLeadField = useCallback((name, val) => {
    const v = (val ?? '').trim()
    if (LEAD_REQUIRED.includes(name) && !v) return 'Required'
    if (name === 'email' && v && !LEAD_EMAIL_RE.test(v)) return 'Enter a valid email'
    if (name === 'website_url' && v && !/\.\w{2,}/.test(v)) return 'Enter a valid website'
    return ''
  }, [])

  const handleLeadSubmit = useCallback(async (e) => {
    e.preventDefault()
    console.info('[Field Report] submit handler fired')
    setLeadFormError('')
    setLeadSuccess(false)

    const form = leadFormRef.current
    if (!form) {
      console.error('[Field Report] form ref missing')
      setLeadFormError(`Field Report intake error. Email ${FIELD_REPORT_FALLBACK_EMAIL} and we'll follow up manually.`)
      return
    }

    console.info('[Field Report] validation started')
    const nextFieldErrors = {}
    let firstInvalid = null
    const inputs = form.querySelectorAll('input:not([type=hidden])')
    inputs.forEach((inp) => {
      const msg = validateLeadField(inp.name, inp.value)
      if (msg) {
        nextFieldErrors[inp.name] = msg
        if (!firstInvalid) firstInvalid = inp
      }
    })
    setLeadFieldErrors(nextFieldErrors)

    if (firstInvalid) {
      console.info('[Field Report] validation failed')
      setLeadFormError('Please complete all required fields (marked with *).')
      firstInvalid.focus()
      return
    }

    console.info('[Field Report] validation passed')
    console.info('[Field Report] webhook configured:', Boolean(FIELD_REPORT_WEBHOOK_URL))

    const qp = new URLSearchParams(window.location.search)
    const setHidden = (n, v) => {
      const el = form.querySelector(`[name="${n}"]`)
      if (el) el.value = v ?? ''
    }
    setHidden('page_url', window.location.href)
    setHidden('utm_source', qp.get('utm_source') || '')
    setHidden('utm_medium', qp.get('utm_medium') || '')
    setHidden('utm_campaign', qp.get('utm_campaign') || '')

    const payload = Object.fromEntries(new FormData(form).entries())
    payload.submitted_at = new Date().toISOString()
    payload.form_type = 'field_report'
    payload.request_type = 'field_report'

    setLeadSubmitting(true)
    try {
      if (!FIELD_REPORT_WEBHOOK_URL) {
        throw new Error('webhook_not_configured')
      }
      console.info('[Field Report] fetch starting')
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 10000)
      try {
        const res = await fetch(FIELD_REPORT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: ctrl.signal,
        })
        if (!res.ok) throw new Error('status ' + res.status)
      } finally {
        clearTimeout(timer)
      }
      console.info('[Field Report] fetch complete')
      track('form_submit', { form_id: 'lead-form', primary_service: payload.primary_service, demo_mode: false })
      setLeadSuccess(true)
      setLeadFormError('')
      setLeadFieldErrors({})
    } catch (err) {
      console.error('[Field Report] submit failed', err)
      if (err?.name === 'AbortError') {
        setLeadFormError(`Request timed out. Email ${FIELD_REPORT_FALLBACK_EMAIL} and we'll follow up manually.`)
      } else if (err?.message === 'webhook_not_configured') {
        setLeadFormError(
          process.env.NODE_ENV === 'development'
            ? 'Field Report webhook not configured. Set NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL or NEXT_PUBLIC_GHL_WEBHOOK_URL in .env.local and restart dev.'
            : `Field Report intake is temporarily unavailable. Email ${FIELD_REPORT_FALLBACK_EMAIL} and we'll follow up manually.`,
        )
      } else {
        setLeadFormError(`We couldn't submit your Field Report request. Email ${FIELD_REPORT_FALLBACK_EMAIL} and we'll follow up manually.`)
      }
    } finally {
      setLeadSubmitting(false)
    }
  }, [validateLeadField])

  useEffect(() => {
    if (started.current) return // guard React strict-mode double-invoke
    started.current = true

    /* ─── LENIS SMOOTH SCROLL + GSAP SCROLLTRIGGER ─── */
    gsap.registerPlugin(ScrollTrigger)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis = null
    if (!reduceMotion) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
      // drive Lenis off GSAP's ticker and keep ScrollTrigger in sync with smooth scroll
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time) => { lenis.raf(time * 1000) })
      gsap.ticker.lagSmoothing(0)
      // route in-page anchor clicks through Lenis (avoids native/smooth double-scroll)
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
          const id = a.getAttribute('href')
          if (id && id.length > 1) { const t = document.querySelector(id); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: 0, duration: 1.1 }) } }
        })
      })
    }

    /* ─── CURSOR ─── */
    const cur = document.getElementById('cursor'), ring = document.getElementById('cursor-ring')
    const heroEl = document.getElementById('hero')
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, lastTheme = 0
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY
      // cursor-flare spotlight — feed pointer position (relative to hero) to the radial gradient
      if (heroEl) { const r = heroEl.getBoundingClientRect(); heroEl.style.setProperty('--mx', (e.clientX - r.left) + 'px'); heroEl.style.setProperty('--my', (e.clientY - r.top) + 'px') }
      // throttle the section hit-test — elementFromPoint+closest on every mousemove is costly and
      // janks the intro/scroll; ~90ms is imperceptible for the orange↔yellow cursor swap.
      const now = Date.now(); if (now - lastTheme > 90) { lastTheme = now; updateCursorTheme(e.clientX, e.clientY) }
    }, { passive: true })
    // neon-yellow comet trail — a chain of fading dots that lag behind the tip
    const TRAIL_N = 10
    const trail = []
    for (let i = 0; i < TRAIL_N; i++) {
      const d = document.createElement('div'); d.className = 'cursor-trail'
      const t = i / (TRAIL_N - 1), sz = 7 - 5.2 * t
      d.style.width = d.style.height = sz + 'px'; d.style.opacity = String(0.5 * (1 - t) + 0.04)
      document.body.appendChild(d); trail.push({ el: d, x: mx, y: my })
    }
    // adaptive cursor color — orange square on light/cream sections, neon-yellow flair on dark
    let cursorLight = null
    function updateCursorTheme(x, y) {
      const hit = document.elementFromPoint(x, y)
      const sec = hit && hit.closest ? hit.closest('[data-cursor]') : null
      const isLight = sec ? sec.getAttribute('data-cursor') === 'light' : false
      if (isLight === cursorLight) return
      cursorLight = isLight
      if (cur) cur.classList.toggle('light', isLight)
      if (ring) ring.classList.toggle('light', isLight)
      trail.forEach(p => p.el.classList.toggle('light', isLight))
    }
    ;(function lp() {
      rx += (mx - rx) * .12; ry += (my - ry) * .12
      if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px' }
      if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px' }
      let px = mx, py = my
      for (let i = 0; i < TRAIL_N; i++) { const p = trail[i]; p.x += (px - p.x) * .34; p.y += (py - p.y) * .34; p.el.style.left = p.x + 'px'; p.el.style.top = p.y + 'px'; px = p.x; py = p.y }
      requestAnimationFrame(lp)
    })()
    document.querySelectorAll('a,button,.psc,.price-feat,.sig-row,.chk-tbl tbody tr').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.transform = 'translate(-50%,-50%) scale(2.3)'; ring.style.borderColor = 'rgba(255,244,95,0.85)' })
      el.addEventListener('mouseleave', () => { ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.borderColor = 'rgba(255,244,95,0.5)' })
    })

    /* ─── AI VISIBILITY SCAN (textless head ring → number pops) ─── */
    const RGG = { cx: 120, cy: 120, r: 92 }
    const rAng = v => 130 + 2.8 * v
    const rPt = (a, r) => [RGG.cx + r * Math.cos(a * Math.PI / 180), RGG.cy + r * Math.sin(a * Math.PI / 180)]
    function rArc(a0, a1, r) { const [x0, y0] = rPt(a0, r), [x1, y1] = rPt(a1, r); const L = (a1 - a0) > 180 ? 1 : 0; return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${L} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}` }
    function rColor(v) { return v < 40 ? '#FF1177' : v < 65 ? '#FF7A45' : v < 85 ? '#F7FF5A' : '#00A6A6' }
    // Ring is a fixed, near-full decorative gradient (set in the SVG markup). The score is
    // conveyed by the number, not the arc length — so the low score never looks like a broken arc.

    // Gauge counter — GSAP ScrollTrigger. Counts 0→34 (ring + number together) when the
    // gauge scrolls into view; re-arms (resets to 0) when scrolled back above the hero.
    let gaugeST = null
    function setupGaugeScroll() {
      if (gaugeST) return
      const el = document.getElementById('score-val')
      const rp = document.getElementById('ring-prog')
      // color by value, matching the scorecard bands: red (bad) → orange → amber → teal (good)
      const colorFor = v => v < 40 ? '#ff4326' : v < 70 ? '#FF5A1F' : v < 85 ? '#FFE23A' : '#00B8A9'
      const counter = { v: 0 }
      const paint = () => {
        const c = colorFor(counter.v)
        if (el) { el.textContent = String(Math.round(counter.v)); el.style.color = c; el.style.textShadow = '0 0 40px ' + c + '70,0 4px 26px rgba(0,0,0,0.72)' }
        // ring keeps its fixed red→amber→teal gradient (CSS); only the number is band-colored
      }
      const tween = gsap.fromTo(counter, { v: 0 }, {
        v: 34, duration: reduceMotion ? 0.8 : 2.2, ease: 'expo.out', paused: true, onUpdate: paint,
        onComplete: paint
      })
      // re-arm on scroll: reset when scrolled above the hero, recount on return
      gaugeST = ScrollTrigger.create({
        trigger: '#score-gauge', start: 'top 85%',
        onEnter: () => tween.restart(),
        onEnterBack: () => tween.restart(),
        onLeaveBack: () => { tween.pause(0); counter.v = 0; paint() }
      })
      // the gauge is on-screen at hero reveal — start the count now (don't wait on a scroll event)
      tween.restart()
    }

    /* ─── (ORB-01 canvas robot removed — the only robot is the one in the hero video) ─── */

    /* ─── INTRO ANIMATION ─── */
    const FC = document.getElementById('flicker-c'), AC = document.getElementById('flare-c')
    const fctx = FC.getContext('2d'), actx = AC.getContext('2d')
    const introEL = document.getElementById('intro'), introClouds = document.getElementById('intro-clouds')
    function resizeC() { FC.width = AC.width = innerWidth; FC.height = AC.height = innerHeight }
    resizeC(); window.addEventListener('resize', resizeC)
    // Intro pacing — ONE knob. The original timeline ran 8.2s to hero (way too slow); dividing
    // every beat by INTRO_SPEED keeps the choreography but compresses it. 2.5 ≈ 3.3s to hero.
    // Raise it to open faster, lower it toward 1 for the original cinematic length.
    const INTRO_SPEED = 3
    const _Tbase = { flickerEnd: 1500, flareStart: 1500, flareDur: 1200, apexHold: 400, descentStart: 3100, descentDur: 1800, outlineStart: 4900, outlineDur: 1600, emergeStart: 6200, emergeDur: 1200, heroStart: 7400, splitStart: 7400, splitDur: 700, introEnd: 8200 }
    const T = Object.fromEntries(Object.entries(_Tbase).map(([k, v]) => [k, Math.round(v / INTRO_SPEED)]))
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
      // safety net — guarantee the hero + gauge reveal even if the intro loop is interrupted
      setTimeout(() => { if (!revealed) { introDone = true; finishIntro() } }, T.introEnd + 2000)
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
          if (introClouds) introClouds.style.opacity = Math.min(0.85, phase * 1.2)
          drawFlareBeam(fcx, headY, apexY, 'descent')
          drawIntroBotOnAC(rbx, rby, Math.max(0, (phase - 0.3) / 0.7) * 0.35, 1)
        }
        if (t >= T.outlineStart && t < T.emergeStart) {
          const elapsed = t - T.outlineStart
          outlineProgress = Math.min(1, elapsed / T.outlineDur)
          if (introClouds) introClouds.style.opacity = '0.9'
          actx.save(); actx.globalAlpha = 0.3; drawFlareBeam(rbx, rby - 40, rby + 20, 'descent'); actx.restore()
          drawIntroBotOnAC(rbx, rby, 0.45, 1)
          drawRobotOutline(rbx, rby, outlineProgress)
        }
        if (t >= T.emergeStart && t < T.heroStart) {
          const elapsed = t - T.emergeStart, phase = Math.min(1, elapsed / T.emergeDur)
          if (introClouds) introClouds.style.opacity = '1'
          robotOpacity = 0.45 + phase * 0.55; robotScale = 1 + phase * 0.06
          drawIntroBotOnAC(rbx, rby - phase * 20, robotOpacity, robotScale)
          const outFade = Math.max(0, 1 - phase * 2)
          if (outFade > 0) drawRobotOutline(rbx, rby, outFade)
        }
        if (t >= T.heroStart && !introDone) {
          introDone = true
          const sl = document.getElementById('sl'); if (sl) sl.style.transform = 'translateX(-103%)'
          const sr = document.getElementById('sr'); if (sr) sr.style.transform = 'translateX(103%)'
          setTimeout(() => {
            const hb = document.getElementById('hero-bg'); if (hb) { hb.style.opacity = '1'; hb.style.transition = 'opacity 1.2s ease' }
          }, 200)
          setTimeout(finishIntro, 900)
          return
        }
        requestAnimationFrame(frame)
      }
      requestAnimationFrame(frame)
    }
    let revealed = false
    function finishIntro() {
      const introEl = document.getElementById('intro')
      if (introEl) animate(introEl, { opacity: [1, 0], duration: 500, onComplete: () => { introEl.style.display = 'none' } })
      const s = document.getElementById('skip'); if (s) s.style.display = 'none'
      revealHero()
    }
    function revealHero() {
      if (revealed) return; revealed = true
      // make sure the hero video is visible on every reveal path (intro, skip, or safety net)
      const hb = document.getElementById('hero-bg'); if (hb) { hb.style.transition = 'opacity 1.2s ease'; hb.style.opacity = '1' }
      const tl = createTimeline({ defaults: { ease: 'outExpo' } })
      tl
        .add('#hnav', { opacity: [0, 1], translateY: [-20, 0], duration: 700 })
        .add('.h-side.top', { opacity: [0, 1], translateY: [-30, 0], duration: 800 }, 150)
        .add('#score-gauge', { opacity: [0, 1], scale: [0.8, 1], duration: 900, ease: 'outBack(1.4)' }, 300)
        .add('.h-side.bottom', { opacity: [0, 1], translateY: [30, 0], duration: 800 }, 450)
        .add('#hfoot', { opacity: [0, 1], translateY: [18, 0], duration: 700 }, 600)
      setTimeout(setupGaugeScroll, 900)
    }

    /* ─── SKIP ─── */
    const skipBtn = document.getElementById('skip')
    if (skipBtn) skipBtn.addEventListener('click', () => {
      introDone = true; stopFlicker()
      const ie = document.getElementById('intro'); if (ie) ie.style.display = 'none'
      skipBtn.style.display = 'none'
      const sl = document.getElementById('sl'); if (sl) sl.style.transform = 'translateX(-103%)'
      const sr = document.getElementById('sr'); if (sr) sr.style.transform = 'translateX(103%)'
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

    /* ─── NUMBER COUNT-UP ON SCROLL — prices, stats, scores tick up when revealed ─── */
    function animateNum(el) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      const parts = []
      let node
      while ((node = walker.nextNode())) {
        if (!/\d/.test(node.nodeValue)) continue
        const toks = [...node.nodeValue.matchAll(/[\d,]+(?:\.\d+)?/g)].map(m => ({ raw: m[0], val: parseFloat(m[0].replace(/,/g, '')), index: m.index }))
        if (toks.length) parts.push({ node, tpl: node.nodeValue, toks })
      }
      if (!parts.length) return
      const fmt = v => Math.round(v).toLocaleString('en-US')
      const obj = { p: 0 }
      animate(obj, { p: [0, 1], duration: 1700, ease: 'outExpo', onUpdate: () => {
        parts.forEach(pt => { let out = '', last = 0; pt.toks.forEach(t => { out += pt.tpl.slice(last, t.index) + fmt(t.val * obj.p); last = t.index + t.raw.length }); out += pt.tpl.slice(last); pt.node.nodeValue = out })
      } })
    }
    document.querySelectorAll('.count').forEach(el => watch(el, () => animateNum(el), '-2% 0px'))

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
      const defs = [{ sel: '#sn1', end: 5, pre: '', suf: '+' }, { sel: '#sn2', end: 1, pre: '<', suf: '%' }, { sel: '#sn3', end: 4, pre: '', suf: 'M+' }, { sel: '#sn4', end: 3, pre: '', suf: '' }]
      defs.forEach(d => { const el = document.querySelector(d.sel); if (!el) return; const obj = { v: 0 }; animate(obj, { v: [0, d.end], duration: 2200, ease: 'outExpo', onUpdate: () => { el.textContent = d.pre + Math.round(obj.v) + d.suf } }) })
      animate('.stat-item', { opacity: [0, 1], translateY: [60, 0], delay: stagger(150), duration: 900, ease: 'outExpo' })
    }, '-6% 0px')

    /* ─── PROCESS LIST STAGGER ─── */
    watch(document.querySelector('.proc-list'), () => { animate('.proc-item', { opacity: [0, 1], translateX: [-32, 0], delay: stagger(100), duration: 700, ease: 'outExpo' }) }, '-4% 0px')

    /* ─── PRICING ENTRANCE ─── */
    watch(document.querySelector('.price-feat'), () => {
      // swing the panels in — drop from a tilt and settle with an elastic pendulum
      animate('.price-feat', { opacity: [0, 1], translateY: [60, 0], rotateX: [-12, 0], duration: 1300, ease: 'outElastic(1, .6)', transformPerspective: 1400 })
      animate('.psc', { opacity: [0, 1], translateY: [46, 0], rotateZ: [-3.5, 0], delay: stagger(150, { start: 150 }), duration: 1200, ease: 'outElastic(1, .55)' })
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

    /* ─── SIGNAL PROTOCOL ACCORDION — drop open on hover (pointer devices); tap still toggles on touch ─── */
    if (window.matchMedia('(hover:hover)').matches) {
      document.querySelectorAll('details.proto-layer').forEach((d) => {
        d.addEventListener('mouseenter', () => { (d as HTMLDetailsElement).open = true })
        d.addEventListener('mouseleave', () => { (d as HTMLDetailsElement).open = false })
      })
    }

    /* ─── STICKY NAV ─── */
    const siteNav = document.getElementById('site-nav')
    window.addEventListener('scroll', () => { siteNav.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8) }, { passive: true })

    /* ─── HERO ENGINE-NAME ROTATOR — keeps shuffling AI · ChatGPT · Claude · Perplexity · Gemini · Google ─── */
    const rotEl = document.getElementById('engine-rot')
    if (rotEl) {
      // final list, fixed ALPHABETICAL order so the cycle is predictable and none get skipped
      const ROT = ['AI Overviews', 'Claude', 'Cohere', 'Gemini', 'GPT', 'Grok', 'Kimi', 'Llama', 'Mistral', 'Perplexity']
      // each swap advances through the flare palette (yellow → orange → teal → pink)...
      const ROT_COLORS = ['#fff45f', '#ff5a1f', '#00d2bf', '#ff3d82']
      // ...and through the three brand fonts, so each word gets a different typeface too
      const ROT_FONTS = [
        { f: "'Fraunces',Georgia,serif", s: 'normal', w: '560', z: '1.02em', ws: '-0.05em' },
        { f: "'Instrument Serif',Georgia,serif", s: 'italic', w: '400', z: '1.1em', ws: '-0.05em' },
        { f: "'Geist Mono',ui-monospace,monospace", s: 'normal', w: '600', z: '0.9em', ws: '-0.24em' },
      ]
      // the verb walks the funnel — find → read → trust — each in its own flare colour
      const verbEl = document.getElementById('verb-rot')
      const VERBS = ['find', 'read', 'trust']
      const VERB_COLORS = ['#fff45f', '#ff8a3d', '#00d2bf']
      let ri = 0, ci = 0, fi = 0, vi = 0
      const paintRot = () => {
        const c = ROT_COLORS[ci], ft = ROT_FONTS[fi]
        rotEl.textContent = ROT[ri]
        rotEl.style.color = c
        rotEl.style.fontFamily = ft.f; rotEl.style.fontStyle = ft.s; rotEl.style.fontWeight = ft.w; rotEl.style.fontSize = ft.z; rotEl.style.wordSpacing = ft.ws
        rotEl.style.textShadow = '0 0 26px ' + c + '7a,0 2px 18px rgba(0,0,0,0.55)'
      }
      const paintVerb = () => {
        if (!verbEl) return
        const vc = VERB_COLORS[vi]
        verbEl.textContent = VERBS[vi]
        verbEl.style.color = vc
        verbEl.style.textShadow = '0 0 24px ' + vc + '70,0 2px 16px rgba(0,0,0,0.5)'
      }
      paintRot(); paintVerb() // show first engine + verb immediately
      // Each word swaps on its OWN timer at a different cadence, so the engine and verb never stay
      // in lockstep — the combo keeps changing and never settles into a fixed pattern. Fades are
      // CSS, so a word can never get stuck invisible the way an anime callback could.
      setInterval(() => {
        ri = (ri + 1) % ROT.length      // sequential alphabetical cycle — every engine, in order
        ci = (ci + 1) % ROT_COLORS.length
        fi = (fi + 1) % ROT_FONTS.length
        paintRot()
        rotEl.classList.remove('rot-swap'); void rotEl.offsetWidth; rotEl.classList.add('rot-swap')
      }, 2000)
      if (verbEl) setInterval(() => {
        vi = (vi + 1) % VERBS.length     // verb funnel + colour cycle, on its own slower cadence
        paintVerb()
        verbEl.classList.remove('rot-swap'); void verbEl.offsetWidth; verbEl.classList.add('rot-swap')
      }, 2700)
    }

    /* ─── LAUNCH ─── */
    if (reduceMotion) {
      // Accessibility: user prefers reduced motion (e.g. Windows "show animations" off).
      // anime.js animations don't apply here, so skip the cinematic intro and reveal the
      // page immediately. The reduced-motion CSS block forces final visible styles; GSAP
      // (which DOES run) still counts the gauge.
      const ie = document.getElementById('intro'); if (ie) ie.style.display = 'none'
      const sb = document.getElementById('skip'); if (sb) sb.style.display = 'none'
      const hb = document.getElementById('hero-bg'); if (hb) { hb.style.transition = 'opacity 0.6s ease'; hb.style.opacity = '1' }
      revealed = true // skip the (no-op) anime reveal timeline
      // show the gauge at its final score directly (no count-up animation under reduced motion)
      const sval = document.getElementById('score-val'), c = '#ff4326'
      if (sval) { sval.textContent = '34'; sval.style.color = c; sval.style.textShadow = '0 0 40px ' + c + '70,0 4px 26px rgba(0,0,0,0.72)' }
    } else {
      // Only play the cinematic once per browser session, and never on weak/mobile devices —
      // refreshes, in-tab navigation, and low-end hardware go straight to the hero (same fast
      // path as the Skip button). First impression keeps the cinematic; everything after is instant.
      const introSeen = (() => { try { return sessionStorage.getItem('sf_intro_seen') === '1' } catch { return false } })()
      const nav = navigator
      const lowEnd = (nav.hardwareConcurrency || 8) <= 2 || (nav.deviceMemory || 8) <= 2 || innerWidth < 560
      if (introSeen || lowEnd) {
        const ie = document.getElementById('intro'); if (ie) ie.style.display = 'none'
        const sb = document.getElementById('skip'); if (sb) sb.style.display = 'none'
        const sl = document.getElementById('sl'); if (sl) sl.style.transform = 'translateX(-103%)'
        const sr = document.getElementById('sr'); if (sr) sr.style.transform = 'translateX(103%)'
        const hb = document.getElementById('hero-bg'); if (hb) { hb.style.transition = 'opacity 0.6s ease'; hb.style.opacity = '1' }
        revealHero()
      } else {
        try { sessionStorage.setItem('sf_intro_seen', '1') } catch {}
        runIntro()
      }
    }

    /* ─── CTA ANALYTICS ─── */
    // Every conversion CTA is an <a href="#cta"> that scrolls to the lead form. Delegate one
    // listener on document: the founding-client apply button fires `founding_client_click`,
    // all other score/build CTAs fire `cta_click` with the button label + section for funnel
    // analysis. No-ops until GA_ID is set (track() guards internally).
    const onCtaClick = (e) => {
      const a = e.target instanceof Element ? e.target.closest('a[href="#cta"]') : null
      if (!a) return
      const label = (a.textContent || '').replace(/[▸\s]+/g, ' ').trim()
      const section = a.closest('section')?.id || a.closest('[id]')?.id || ''
      if (a.classList.contains('founding-cta')) track('founding_client_click', { label, section })
      else track('cta_click', { label, section })
    }
    document.addEventListener('click', onCtaClick)
    return () => document.removeEventListener('click', onCtaClick)
  }, [])

  // Head-ring arc geometry (280° ring, gap at the bottom toward the body).
  // Mirrored in the effect for the scan animation.
  const RG = { cx: 120, cy: 120, r: 92 }
  const rang = (v) => 245 + 3.15 * v
  const rpt = (a, r) => [RG.cx + r * Math.cos(a * Math.PI / 180), RG.cy + r * Math.sin(a * Math.PI / 180)]
  const rarc = (a0, a1, r = RG.r) => { const [x0, y0] = rpt(a0, r), [x1, y1] = rpt(a1, r); const L = (a1 - a0) > 180 ? 1 : 0; return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${L} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}` }

  const snl = { fontFamily: "'Geist Mono',monospace", fontSize: '12px', color: 'rgba(23,19,18,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' } as const
  const hfPhrases = ['Your business, found by AI', 'GPTBot · llms.txt · Schema markup', 'ChatGPT · Claude · Perplexity · Gemini · Google AI', 'Discovery is the first connection', 'Scanned · Structured · Trusted · Found']
  const divider = { width: '100%', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)' } as const

  // The Signal Protocol™ — 24 checkpoints across six signal layers (sums to 100).
  // Drives the #check section; numbers run 01–24 globally.
  const SIGNAL_PROTOCOL = [
    { name: 'Access & Crawlability', pts: 20, q: 'Can AI engines physically reach and read your site?', checks: [
      ['01', 'Robots.txt allows major AI/search crawlers', 'Googlebot · OAI-SearchBot · PerplexityBot · GPTBot'],
      ['02', 'Sitemap exists, is clean, and discoverable', ''],
      ['03', 'Important pages are indexable', 'No accidental noindex, broken canonicals, or blocked priority URLs'],
      ['04', 'Static pages are actually served to bots', 'Not just a JavaScript shell or hidden source-file schema'],
    ] },
    { name: 'Structured Intelligence', pts: 20, q: 'Can machines understand what your business is?', checks: [
      ['05', 'Organization schema is present and accurate', ''],
      ['06', 'LocalBusiness or ProfessionalService schema supports the business type', ''],
      ['07', 'FAQPage schema matches visible on-page content', ''],
      ['08', 'SameAs, proof links, and entity connections reinforce identity', ''],
    ] },
    { name: 'Entity Clarity', pts: 15, q: 'Do AI engines know exactly who you are?', checks: [
      ['09', 'Business name is clear and consistent', ''],
      ['10', 'Location or service area is obvious', ''],
      ['11', 'Category and industry classification are unambiguous', ''],
      ['12', 'Founder, team, about, and ownership signals are visible', ''],
    ] },
    { name: 'Answer Architecture', pts: 20, q: 'Is your content formatted so AI can pull it into a direct answer?', checks: [
      ['13', 'FAQ page is crawlable and answer-first', ''],
      ['14', 'About page tells a clear entity story', ''],
      ['15', 'How-it-works page explains the service step by step', ''],
      ['16', 'Service pages answer buyer questions directly', ''],
    ] },
    { name: 'Trust & Proof Density', pts: 15, q: 'Does the machine have enough evidence to recommend you?', checks: [
      ['17', 'Reviews and testimonials are legible to AI', ''],
      ['18', 'Case studies and results are documented and crawlable', ''],
      ['19', 'Third-party citations, mentions, or directory signals exist', ''],
      ['20', 'Contact information and business legitimacy signals are consistent', ''],
    ] },
    { name: 'Live AI Visibility', pts: 10, q: 'Are you actually appearing when someone asks AI for what you do?', checks: [
      ['21', 'ChatGPT visibility test', ''],
      ['22', 'Claude visibility test', ''],
      ['23', 'Perplexity visibility test', ''],
      ['24', 'Gemini / Google AI visibility test', ''],
    ] },
  ]

  // Per-layer accent colors, all drawn from the brand palette (teal/orange/magenta/
  // gold/cyan/coral — no violet). hex drives text, rgb drives glow/tint via rgba().
  const PROTO_COLORS = [
    { hex: '#00b8a9', rgb: '0,184,169' },   // teal
    { hex: '#ff5a1f', rgb: '255,90,31' },   // orange
    { hex: '#ff3d82', rgb: '255,61,130' },  // magenta
    { hex: '#ffb02e', rgb: '255,176,46' },  // gold
    { hex: '#00d2bf', rgb: '0,210,191' },   // cyan
    { hex: '#ff7a45', rgb: '255,122,69' },  // coral
  ]

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
      <button id="skip" style={{ fontFamily: "'Geist Mono',monospace", fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '0.5px solid rgba(255,255,255,0.2)', padding: '8px 18px', borderRadius: '100px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)', cursor: 'pointer', opacity: 0, transition: 'opacity 0.5s,all 0.2s', pointerEvents: 'all', position: 'fixed', bottom: '28px', right: '28px', zIndex: 600 }}>SKIP INTRO</button>

      {/* ═══ HERO ═══ */}
      <section id="hero">
        <div id="hero-bg">
          <video id="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/video/hero-poster.jpg">
            <source src="/video/signal-flair-hero.mp4" type="video/mp4" />
          </video>
          <div id="hero-grade" />
        </div>
        <div id="hero-overlay" />
        <div id="hero-ground" />
        {/* Center scrim — keeps the stacked centerpiece legible over the busy video */}
        <div id="hero-center-scrim" />
        <nav id="hnav">
          <div>
            <div className="nav-logo"><SignalFlairLogo onDark pulse style={{ height: 56, width: 'auto', display: 'block' }} /></div>
            <div className="nav-logo-tag"><span className="ntag-cat">AI Proof Infrastructure™</span> · Brownsburg, Indiana, serving nationwide</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a className="nl" href="#check">Signal Score</a>
            <a className="nl" href="#signal">Proof Layer</a>
            <a className="nl" href="#founding">Pilot</a>
            <a className="ncta" href="#cta">▸ Get Your Signal Score™</a>
          </div>
        </nav>
        {/* Cinematic instrument panel: DIAGNOSIS above → SCORE GAUGE centerpiece → RECOVERY below */}
        <div id="hero-layout">
          <h1
            className="h-sr-only"
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            Most local businesses are invisible to AI. What&apos;s your Signal Score?
          </h1>
          <div className="hero-word" aria-hidden="true">FOUND.</div>
          <div className="h-side top">
            <div className="h-eyebrow"><div className="h-ey-dot" />AI Proof Infrastructure™</div>
            <div className="h-headline" aria-hidden="true">Can <span id="engine-rot" className="eng-rot">Claude</span> <span id="verb-rot" className="verb-rot">find</span> your business <span className="glass-text-orange">right now?</span></div>
          </div>

          {/* Signal Score gauge — large centered centerpiece */}
          <div id="score-gauge" className="score-gauge">
            <div className="gauge-ring" aria-hidden="true" />
            <div className="gauge-readout">
              <div id="score-val" className="gauge-score">0</div>
              <div className="gauge-score-lbl">/ 100 · Signal Score™</div>
              <div className="gauge-sample">Sample readout</div>
            </div>
          </div>

          <div className="h-side bottom">
            <div className="h-headline" aria-hidden="true">Scanned. Structured. Trusted. <span style={{ fontStyle: 'italic', background: 'linear-gradient(125deg,rgba(0,220,220,1) 0%,rgba(180,255,255,0.9) 30%,rgba(0,200,200,0.95) 60%,rgba(150,255,255,0.85) 100%)', backgroundSize: '250% 250%', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'glass-shimmer 8s 2s ease-in-out infinite', filter: 'drop-shadow(0 0 14px rgba(0,166,166,0.4))' }}>Found.</span></div>
            <div className="h-sub">llms.txt live · bots unblocked · built so AI can find, read &amp; <span className="hsub-trust">trust</span> you</div>
          </div>
        </div>
        <div id="hfoot">
          <div className="hf-ticker" aria-hidden="true">
            <div className="hf-track">
              {[...hfPhrases, ...hfPhrases].map((p, i) => (
                <span className="hf-tk" key={i}>{i % hfPhrases.length === 0 ? <strong>{p}</strong> : p}<span className="hf-tk-dot" /></span>
              ))}
            </div>
          </div>
          <div className="hf-r">
            <div><div className="hf-num count">&lt;1%</div><div className="hf-lbl">Have llms.txt</div></div>
          </div>
        </div>
      </section>

      {/* ═══ STICKY NAV ═══ */}
      <nav id="site-nav">
        <div>
          <a className="nav-logo" href="#hero" style={{ display: 'flex', alignItems: 'center' }}><SignalFlairLogo style={{ height: 56, width: 'auto', display: 'block' }} /></a>
          <div className="nav-logo-tag" style={{ color: 'rgba(23,19,18,0.55)' }}><span className="ntag-cat">AI Proof Infrastructure™</span></div>
        </div>
        <div className="snav-actions" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#check" style={snl}>Signal Score</a>
          <a href="#signal" style={snl}>Proof Layer</a>
          <a href="#founding" style={snl}>Pilot</a>
          <a className="ncta" href="#cta">▸ Get Your Signal Score™</a>
        </div>
      </nav>

      {/* ═══ TICKER ═══ */}
      <div id="ticker">
        <div className="t-row t-row-1">
          {[['AI Visibility Scoring', 1], ['AEO · Agentic Engine Optimization', 0], ['llms.txt Deployment', 1], ['Schema Markup', 0], ['AI Crawler Access', 1], ['Citation Growth', 0], ['AI Visibility Scoring', 1], ['AEO · Agentic Engine Optimization', 0], ['llms.txt Deployment', 1], ['Schema Markup', 0], ['AI Crawler Access', 1], ['Citation Growth', 0]].map((it, i) => (
            <div key={i} className={`t-item${it[1] ? ' hi' : ''}`}>{it[0]}<div className="t-sep" /></div>
          ))}
        </div>
        <div className="t-row t-row-2">
          {[['ChatGPT · Claude · Perplexity', 1], ['Gemini · Google AI Overviews', 0], ['90-Day AI Action Plans', 1], ['Monthly Visibility Monitoring', 0], ['Indiana-Based · Serving Nationwide', 1], ['Discovery Is The First Connection', 0], ['ChatGPT · Claude · Perplexity', 1], ['Gemini · Google AI Overviews', 0], ['90-Day AI Action Plans', 1], ['Monthly Visibility Monitoring', 0], ['Indiana-Based · Serving Nationwide', 1], ['Discovery Is The First Connection', 0]].map((it, i) => (
            <div key={i} className={`t-item${it[1] ? ' hi' : ''}`}>{it[0]}<div className="t-sep" /></div>
          ))}
        </div>
      </div>

      {/* ═══ PROBLEM ═══ */}
      <section id="problem" data-cursor="light">
        <div className="prob-wall" id="prob-wall">INVISIBLE.</div>
        <div className="prob-inner">
          <div className="prob-left reveal">
            <div className="prob-label">The Diagnosis</div>
            <div className="prob-headline">Great business.<br /><em>Weak signal.</em></div>
            <div className="prob-body">Two machines read your business and disagree completely. Humans see a trusted local operator. AI engines — the ones now booking appointments and routing customers — see almost nothing. Not because you&apos;re bad. Because you&apos;re unreadable.</div>
            <div className="prob-stats">
              <div className="psr"><span className="psr-n count">&lt;1%</span><span className="psr-l">Have llms.txt</span></div>
              <div className="psr"><span className="psr-n count">4M+</span><span className="psr-l">AI Searches Daily<br />&amp; Climbing</span></div>
              <div className="psr"><span className="psr-n count">0</span><span className="psr-l">Avg. Citations<br />Found</span></div>
            </div>
          </div>
          <div className="pv reveal">
            <div className="pv-col human">
              <div className="pv-h"><span className="pv-ey">Human View</span><span className="pv-tag">Reads You Fine</span></div>
              <div className="pv-row"><span className="pv-name">Google rating</span><span className="pv-stamp ok">4.8 ★</span></div>
              <div className="pv-row"><span className="pv-name">Local reputation</span><span className="pv-stamp ok">Trusted</span></div>
              <div className="pv-row"><span className="pv-name">Service quality</span><span className="pv-stamp ok">Strong</span></div>
              <div className="pv-row"><span className="pv-name">Word of mouth</span><span className="pv-stamp ok">Active</span></div>
            </div>
            <div className="pv-col ai">
              <div className="pv-h"><span className="pv-ey">AI View</span><span className="pv-tag">Can&apos;t Read You</span></div>
              <div className="pv-row"><span className="pv-name">Live AI Visibility</span><span className="pv-stamp bad">Invisible</span></div>
              <div className="pv-row"><span className="pv-name">Entity Clarity</span><span className="pv-stamp bad">Unclear</span></div>
              <div className="pv-row"><span className="pv-name">Access &amp; Crawlability</span><span className="pv-stamp warn">Partial</span></div>
              <div className="pv-row"><span className="pv-name">Citations · 5 engines</span><span className="pv-stamp bad">0 Found</span></div>
              <div className="pv-foot">
                <div className="pv-score count">18<small>/100</small></div>
                <a className="pv-rec" href="#cta">▸ See my Field Report →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="signal">
        <div className="sig-top reveal">
          <div>
            <div className="sig-eyebrow">What does Signal Flair build?</div>
            <div className="sig-big">THREE THINGS.<br />DONE <em>RIGHT.</em></div>
          </div>
          <div className="sig-tagline">Signal Flair builds AI Proof Infrastructure™ — the structured proof layer that helps AI systems access, understand, verify, and surface your business. We do it in three moves: diagnose the baseline, build the proof, and keep it fresh.</div>
        </div>
        <div className="sig-rows">
          <div className="sig-row reveal">
            <div className="sig-proto"><div className="sig-rn">01</div><div className="sig-plabel">Diagnostic · Signal Score™</div></div><div className="sig-rd" />
            <div className="sig-rtitle">Signal<br />Baseline™</div>
            <div className="sig-rbody"><em>The before-photo of how AI sees you.</em> Your first Signal Score™ — a 0–100 baseline across ChatGPT, Perplexity, Claude, Gemini, and Google AI. We find every gap and show you the number. Most businesses score under 40 — now you&apos;ll know why.</div>
            <div><span className="sig-rtag">Scoring + Reporting</span></div>
          </div>
          <div className="sig-row reveal">
            <div className="sig-proto"><div className="sig-rn">02</div><div className="sig-plabel">Implementation · Proof Layer</div></div><div className="sig-rd" />
            <div className="sig-rtitle">Signal Proof<br />Layer™</div>
            <div className="sig-rbody"><em>The proof layer competitors can&apos;t copy.</em> llms.txt deployed, schema installed, crawlers unblocked, entity and answer architecture rebuilt — the structured proof AI needs to understand, verify, and recommend you. Built in 7–14 days, not months.</div>
            <div><span className="sig-rtag">llms.txt + Schema</span></div>
          </div>
          <div className="sig-row reveal">
            <div className="sig-proto"><div className="sig-rn">03</div><div className="sig-plabel">Maintenance · Stay Found</div></div><div className="sig-rd" />
            <div className="sig-rtitle">Stay<br />Found™</div>
            <div className="sig-rbody"><em>Visibility isn&apos;t a one-time fix.</em> AI search evolves monthly and your competitors are catching up. Stay Found provides recurring checks and maintenance to help keep proof assets current — monthly scans, citation growth, schema updates, and crawler monitoring. Built to reduce proof drift as AI search changes.</div>
            <div><span className="sig-rtag">Monitoring + Citations</span></div>
          </div>
        </div>
        <div className="sig-cta-wrap reveal">
          <a className="sig-cta" href="#cta">▸ Get Your Signal Score™ →</a>
          <span className="sig-cta-note">free baseline · 24 hours · no call</span>
        </div>
      </section>

      {/* ═══ CHECK — THE SIGNAL PROTOCOL™ (24-point diagnostic) ═══ */}
      <section id="check" data-cursor="light">
        <div className="proto-top reveal">
          <div className="proto-eyebrow">THE SIGNAL PROTOCOL™</div>
          <div className="proto-title">24-Point AI Visibility<br /><em>Diagnostic.</em></div>
          <div className="proto-meta">Six signal layers, four checkpoints each — scoring whether AI can find, read, trust, and recommend you.</div>
        </div>
        <div className="proto-grid">
          {SIGNAL_PROTOCOL.map((layer, li) => (
            <details className="proto-layer reveal" key={li} style={{ '--ac': PROTO_COLORS[li].hex, '--acg': PROTO_COLORS[li].rgb }}>
              <summary className="proto-layer-head">
                <span className="proto-layer-n">{String(li + 1).padStart(2, '0')}</span>
                <span className="proto-layer-name">{layer.name}</span>
                <span className="proto-layer-caret" aria-hidden="true" />
              </summary>
              <div className="proto-drop">
                <div className="proto-layer-q">{layer.q}</div>
                <div className="proto-checks">
                  {layer.checks.map((c) => (
                    <div className="proto-check" key={c[0]}>
                      <span className="proto-check-n">{c[0]}</span>
                      <span className="proto-check-body"><span className="proto-check-t">{c[1]}</span>{c[2] ? <span className="proto-check-d">{c[2]}</span> : null}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
        <div className="proto-teaser reveal">
          <div className="proto-teaser-chant">What&apos;s your Signal Score?</div>
          <a className="proto-teaser-cta" href="#cta">▸ Get Your Signal Score™ →</a>
        </div>
      </section>

      {/* ═══ TRUST — the pivot between "found" and "recommended" ═══ */}
      <section id="trust" data-cursor="dark">
        <div className="trust-inner reveal">
          <div className="trust-eyebrow">Found isn&apos;t the finish line</div>
          <h2 className="trust-vw">Before <span className="trust-ai">AI</span> recommends you,<br />it has to <em>TRUST</em> you.</h2>
          <p className="trust-sub">Every engine decides who to surface by what it can verify. The Signal Protocol™ builds the <strong>trust</strong> signals — schema, entities, citations, and proof density — that make your business safe for AI to recommend.</p>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section id="stats">
        <div className="stats-bg-word">PROOF.</div>
        <div className="stats-float">
          <div className="stat-item reveal"><span className="stat-n" id="sn2">&lt;1%</span><span className="stat-l">Have llms.txt</span><div className="stat-d">The file we build and deploy on the Foundation Build.</div></div>
          <div className="stat-item reveal"><span className="stat-n" id="sn3">4M+</span><span className="stat-l">AI Searches Daily</span><div className="stat-d">Most businesses appear in zero of them — and that number climbs every day.</div></div>
        </div>
      </section>

      {/* ═══ PROCESS ═══ */}
      <section id="process" data-cursor="light">
        <div className="proc-header reveal">
          <h2 className="proc-vw">How is your<br /><em>Signal Score™</em> calculated?</h2>
          <p className="proc-intro">
            Signal Flair scores your Signal Score™ across six signal layers and 24 checkpoints — then builds the
            missing infrastructure and keeps it current with Stay Found™. One system, without the lag.
          </p>
        </div>
        <ul className="proc-list">
          <li className="proc-item reveal"><div className="proc-num">01</div><div className="proc-right"><div className="proc-bar" /><div className="proc-title">SCAN</div><div className="proc-body">We run 24 checkpoints across six signal layers — Access · Structure · Entity · Architecture · Trust · Visibility. Every layer scored. Every gap documented. Every finding points to a real visibility issue.</div></div></li>
          <li className="proc-item reveal"><div className="proc-num">02</div><div className="proc-right"><div className="proc-bar" /><div className="proc-title">SCORE</div><div className="proc-body">You receive your Signal Score™ — a number from 0 to 100. Not a guess. Not a vibe. Not a generic SEO grade. A layer-by-layer readout of whether AI can find, understand, trust, and recommend your business.</div></div></li>
          <li className="proc-item reveal"><div className="proc-num">03</div><div className="proc-right"><div className="proc-bar" /><div className="proc-title">BUILD</div><div className="proc-body">For scores under 74, we build the missing infrastructure: schema, crawlability, entity signals, answer architecture, trust proof, and static AI-readable pages. Everything the machine needs to understand you — everything you own, even if you cancel.</div></div></li>
          <li className="proc-item reveal"><div className="proc-num">04</div><div className="proc-right"><div className="proc-bar" /><div className="proc-title">STAY FOUND</div><div className="proc-body">Stay Found™ provides recurring checks and proof maintenance: monthly Signal Score™ verification, continuous monitoring, crawler-access checks, schema and entity drift detection, and live AI visibility spot tests. Visibility is not a destination — it is ongoing maintenance.</div></div></li>
        </ul>
      </section>

      {/* ═══ UNFAIR ADVANTAGE — new self-contained component (replaces the old #moat) ═══ */}
      <UnfairAdvantage />

      {/* ═══ Stay Found™ maintenance reveal — flows straight out of "You can't copy the system." ═══ */}
      <section id="signal-lock-reveal" data-cursor="dark">
        <div className="slr-inner reveal">
          <div className="mr-name">Stay Found<sup className="mr-tm">™</sup> is not a one-time audit.</div>
          <div className="mr-body">An audit is a photograph. It shows you what was true the day the shutter clicked. But your competitors did not stop moving when the photographer left. AI systems did not stop changing. Your reviews, citations, pages, schema, and crawler access did not freeze in place.</div>
          <div className="mr-body"><strong>Stay Found™ is the maintenance layer that helps reduce proof drift over time.</strong> Four maintenance layers:</div>
          <div className="lock-layers">
            <div className="lock-layer"><span className="lock-layer-n">01</span>Monthly Signal Score™ verification</div>
            <div className="lock-layer"><span className="lock-layer-n">02</span>Crawlability and schema monitoring</div>
            <div className="lock-layer"><span className="lock-layer-n">03</span>Entity and trust-signal drift checks</div>
            <div className="lock-layer"><span className="lock-layer-n">04</span>Live AI visibility spot tests</div>
          </div>
          <div className="mr-body">The <strong>Verified by Signal Flair™</strong> mark is what you carry because the score is being maintained — not because it was checked once.</div>
          <div className="mr-kicker">Anyone can tell you your score today. Stay Found™ is built to help keep your proof current.</div>
          <a className="mr-cta" href="#field-report">▸ Start with a free Field Report →</a>
        </div>
      </section>

      {/* ═══ THE ENTERPRISE SECRET — the offensive wedge (standout band, Signal Magenta) ═══ */}
      <section id="enterprise" data-cursor="dark">
        <div className="ent-bloom" aria-hidden="true" />
        <div className="ent-head reveal">
          <div className="ent-eyebrow">The enterprise secret</div>
          <div className="ent-title">THE ENTERPRISE<br />SECRET</div>
        </div>
        <div className="ent-lede reveal">Enterprise-grade visibility audits can run <strong>$15,000–$50,000</strong> when bundled into agency retainers, strategy decks, and implementation plans. For a local business, that model is usually too expensive, too slow, and too disconnected from ownership.</div>
        <div className="ent-photo reveal">It is also a photograph. And a photograph starts getting old the moment the market moves.</div>
        <div className="ent-build reveal">
          <div className="ent-build-lead">Signal Flair built the maintained version that a local business can actually own.</div>
          <div className="ent-terms">
            <div className="ent-term"><span className="ent-term-t">The Signal Protocol™</span> gives the diagnostic structure.</div>
            <div className="ent-term"><span className="ent-term-t">The Signal Score™</span> gives the number.</div>
            <div className="ent-term"><span className="ent-term-t">Stay Found™</span> helps monitor proof assets and reduce drift over time.</div>
          </div>
        </div>
        <div className="ent-turn reveal">Same seriousness. Cleaner ownership.<br /><em>Built to be found now — not after a six-month strategy engagement.</em></div>
        <a className="ent-cta reveal" href="#field-report">▸ Start with a free Field Report →</a>
      </section>

      {/* ═══ PROOF — honest before/after score card (illustrative) ═══ */}
      <section id="proof" data-cursor="light">
        <div className="proof-bgword" aria-hidden="true">PROOF.</div>
        <div className="proof-head reveal">
          <div>
            <div className="proof-eyebrow">Case Zero · the before state</div>
            <div className="proof-title">We ran it on<br /><em>ourselves first.</em></div>
          </div>
          <div className="proof-meta">Case Zero is the starting line — not a finished case study. Signal Flair audited itself first, published the baseline Signal Score™ (18/100), and is documenting the rebuild in public. No fabricated testimonials, no finished-case theater.</div>
        </div>
        <div className="proof-grid reveal">
          <div className="proof-card before">
            <div className="pc-kicker">Case Zero · 06.06.2026</div>
            <div className="pc-top"><span className="pc-label">Before</span><span className="pc-tag">Self-Audit</span></div>
            <span className="pc-score">18<small>/100</small></span>
            <div className="pc-scorelbl">Signal Score™</div>
            <div className="pc-row"><span className="pc-name">AI Search Presence</span><span className="pc-stamp no">4/100</span></div>
            <div className="pc-row"><span className="pc-name">Entity Clarity</span><span className="pc-stamp no">5/100</span></div>
            <div className="pc-row"><span className="pc-name">Crawl Readiness</span><span className="pc-stamp no">35/100</span></div>
            <div className="pc-row"><span className="pc-name">Review Signal</span><span className="pc-stamp no">0/100</span></div>
            <div className="pc-status">We audited ourselves first.</div>
          </div>
          <div className="proof-arrow" aria-hidden="true">→</div>
          <div className="proof-card after">
            <div className="pc-top"><span className="pc-label">Post-implementation target</span><span className="pc-tag">Next target</span></div>
            <span className="pc-score count">91<small>/100</small></span>
            <div className="pc-scorelbl">Signal Score™</div>
            <div className="pc-row"><span className="pc-name">Proof assets</span><span className="pc-stamp no">Target: published &amp; crawlable</span></div>
            <div className="pc-row"><span className="pc-name">Schema &amp; llms.txt</span><span className="pc-stamp no">Target: aligned</span></div>
            <div className="pc-row"><span className="pc-name">Visibility journal</span><span className="pc-stamp no">Ongoing checks</span></div>
            <div className="pc-status">Readiness target · measured Day 30 &amp; Day 90</div>
          </div>
        </div>
        <div className="proof-note reveal">Next target: improve AI-readiness after owned proof assets are published, crawlable, and aligned across the site. <strong>This is a readiness target, not a guarantee of AI ranking, citation, recommendation, or inclusion.</strong></div>
        <div className="proof-note reveal">Signal Flair&apos;s own audit — <strong>June 6, 2026</strong>. This is Case Zero: we ran the system on ourselves first, and we publish the real before-and-after as our own score climbs.</div>
        <a className="proof-live-link reveal" href="/proof/">See our live record →</a>
        <div className="sl-markwrap reveal" style={{ margin: '26px auto 0', maxWidth: 560 }}>
          <a className="sl-mark" href="/case-studies/restor-team/">
            <span className="sl-mark-pulse" aria-hidden="true" />
            <span className="sl-mark-body">
              <span className="sl-mark-main">RESTOR Team — Founding Partner Snapshot</span>
              <span className="sl-mark-meta">Signal Baseline™ · Competitor Signal Snapshot™</span>
              <span className="sl-mark-note">How AI systems read RESTOR Team compared with a selected market peer. View the snapshot →</span>
            </span>
            <span className="sl-mark-arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <div className="founding reveal" id="founding">
          <div className="founding-inner">
            <div className="founding-l">
              <div className="founding-eyebrow">Founding Partner Pilot</div>
              <div className="founding-title">Help build the AI trust layer <em>before the market catches up.</em></div>
              <div className="founding-body">Signal Flair is a new AI Proof Infrastructure venture in Brownsburg, Indiana, serving organizations nationwide. We&apos;re opening a limited founding pilot for businesses, nonprofits, and civic partners that want to see how AI systems understand them — and build the proof layer to fix it. The goal isn&apos;t hype. It&apos;s documented proof: measure the before, build the missing infrastructure, track the after.</div>
              <div className="founding-ask">For: nonprofits, local service businesses, civic &amp; community partners, and trust-based providers — med spas, clinics, law firms, HVAC, electrical, and more. In return: permission to document your before/after (anonymized if you prefer).</div>
              <a className="founding-cta" href="#cta">▸ Explore a Founding Pilot</a>
              <div className="founding-micro">Early-stage &amp; honest · documented proof, not testimonials · Get Your Signal Score™ to start</div>
            </div>
            <div className="founding-r">
              <div className="founding-price-tag">What founding partners receive</div>
              <div className="founding-items">
                <div className="fnd-i">Signal Score™ baseline — your 0–100 starting line</div>
                <div className="fnd-i">AI visibility scan across every major answer engine</div>
                <div className="fnd-i">Entity clarity + trust-signal review</div>
                <div className="fnd-i">Crawlability + structured-data review</div>
                <div className="fnd-i">Signal Proof Layer™ recommendations</div>
                <div className="fnd-i">Optional Signal Proof Page™ — your public proof asset</div>
                <div className="fnd-i">Before-and-after documentation as your score climbs</div>
                <div className="fnd-i">Competitor Signal Snapshot™ — a point-in-time side-by-side against one selected peer or competitor</div>
                <div className="fnd-i">Clear next steps to become easier for AI to verify</div>
              </div>
              <div className="founding-save">Limited founding cohort · flexible terms for pilots &amp; nonprofits</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" data-cursor="light">
        <div className="pricing-header reveal">
          <h2 className="pricing-vw" aria-label="Three offers. One right fit.">
            Three offers.<br />
            One <em className="pv-fit">right fit.</em>
          </h2>
          <div className="pricing-sub">Commercial implementation pricing — one path alongside the Founding Pilot. Your Signal Score™ sets the starting point; most begin with a free baseline, then build the Signal Proof Layer™ at the band it lands in.</div>
        </div>
        <div className="price-how reveal">
          <div className="ph-lead">You don&apos;t pick a package. Your free <em>Field Report</em> sets your starting line.</div>
          <div className="ph-map">
            <div className="ph-step">
              <div className="ph-band">Score 0–54 · Invisible</div>
              <div className="ph-offer">Build the Foundation</div>
              <div className="ph-what">The full machine-readable build — <strong>plus your own AI-optimized landing page.</strong></div>
            </div>
            <div className="ph-step">
              <div className="ph-band">Score 55–74 · Partial</div>
              <div className="ph-offer">Start the Rebuild</div>
              <div className="ph-what">Targeted fixes to the exact signals dragging your score down.</div>
            </div>
            <div className="ph-step">
              <div className="ph-band">Score 75–100 · Visible</div>
              <div className="ph-offer">Stay Found™</div>
              <div className="ph-what">Ongoing proof maintenance and monitoring as AI shifts.</div>
            </div>
          </div>
          <div className="ph-note">Foundation &amp; Rebuild are <strong>one-time builds</strong> — you keep everything, even if you cancel. <strong>Stay Found™</strong> is the ongoing maintenance layer for businesses already visible. Most start with a free Field Report, then begin at the band it lands in.</div>
        </div>
        <div className="price-anchor reveal">
          <div className="pa-lead">Every customer an AI engine routes to your competitor instead of you is a closed job you&apos;ll never see.</div>
          <div className="pa-mid">At the average local service ticket, that&apos;s real money — <em>invisibly gone every month</em> you&apos;re not in the results.</div>
          <div className="pa-anchor">The Foundation Build is $3,500. Once.</div>
          <div className="pa-foot">You keep everything we build, even if you cancel.</div>
        </div>
        <div className="price-feat">
          <div className="pf-left">
            <div className="pf-tag">Signal Proof Layer™ · Foundation Build</div>
            <div className="pf-name">Build the Foundation</div>
            <div className="pf-ideal">For the invisible — businesses scoring 0–54 with no AI footprint. The full infrastructure generative engines need to find, read, and recommend you. Built in 7–14 days.</div>
            <div className="pf-amount">$3,500</div>
            <div className="pf-cadence">one-time build · CRM access optional</div>
            <a className="pf-btn" href="#cta">▸ Build the Foundation</a>
          </div>
          <div className="pf-right">
            <div className="pf-desc">The infrastructure AI actually reads. Full diagnostic, full technical fix, full structure — everything needed to go from invisible to recommendable across every major AI engine.</div>
            <div className="pf-items">
              <div className="pf-item pf-lock">Signal Proof Page™ deployed — your owned, verified record</div>
              <div className="pf-item pf-lock">Verified business record alignment across AI-read sources</div>
              <div className="pf-item pf-lock">AI-readable trust layer + your live /proof/ page</div>
              <div className="pf-item">Full AI Visibility Audit — 5 engines (ChatGPT, Claude, Perplexity, Gemini, Google AI)</div>
              <div className="pf-item">llms.txt written and deployed</div>
              <div className="pf-item">Schema markup installed — Org + LocalBusiness + more</div>
              <div className="pf-item">AI crawlers unblocked — robots.txt fixed</div>
              <div className="pf-item">1 AI-optimized landing page</div>
              <div className="pf-item">Entity clarity cleanup across data sources</div>
              <div className="pf-item">5 priority citation submissions</div>
              <div className="pf-item">90-Day AI Action Plan</div>
              <div className="pf-item">Delivered in 7–14 days</div>
            </div>
          </div>
        </div>
        <div className="price-small">
          <div className="psc">
            <div className="psc-name">Start the Rebuild</div>
            <div className="psc-ideal">For the partially visible — businesses with a foundation that needs sharpening. The core fixes that move your score fastest.</div>
            <div className="psc-price">$1,500</div>
            <div className="psc-cad">one-time rebuild · CRM access included</div>
            <div className="psc-items">
              <div className="psci psci-lock">Signal Proof Page™ deployed</div>
              <div className="psci psci-lock">Verified business record alignment</div>
              <div className="psci">Full AI Visibility Audit — 5 engines</div>
              <div className="psci">llms.txt written and deployed</div>
              <div className="psci">Core schema markup installed</div>
              <div className="psci">AI crawlers unblocked — robots.txt fixed</div>
              <div className="psci">Priority citation submissions</div>
              <div className="psci">90-Day AI Action Plan</div>
              <div className="psci">CRM access included</div>
            </div>
            <a className="psc-btn" href="#cta">▸ Start the Rebuild</a>
          </div>
          <div className="psc">
            <div className="psc-name">Stay Found™</div>
            <div className="psc-ideal">For the AI-ready — businesses already visible who refuse to fall behind. Visibility compounds, so we work in seasons, not one-offs.</div>
            <div className="psc-price">$600–$1,200<span style={{ fontSize: '0.4em' }}>/mo</span></div>
            <div className="psc-cad">monthly · longer commitment, lower rate · CRM access included</div>
            <div className="psc-items">
              <div className="psci psci-lock">Monthly Stay Found™ re-verification + signal-drift monitoring</div>
              <div className="psci psci-lock">Public change-log maintained — Verified by Signal Flair™</div>
              <div className="psci psci-lock">Freshness updates + citation-share movement report</div>
              <div className="psci">Monthly AI visibility scan — every major engine</div>
              <div className="psci">Ongoing citation growth + schema &amp; llms.txt updates</div>
              <div className="psci">AI crawler monitoring · CRM access included</div>
            </div>
            <a className="psc-btn" href="#cta">▸ Stay Found</a>
          </div>
        </div>
        <div className="price-guarantee">Guarantee: <em>Delivery-based only</em> — never rankings, leads, or revenue. You keep everything built, even if you cancel.</div>
      </section>

      {/* ═══ ABOUT — founder / Case Zero proof story ═══ */}
      <section id="about">
        <div className="about-inner">
          <div className="about-photo reveal">
            <img className="about-portrait" src="/founder.jpg" alt="Corey Ellis, founder of Signal Flair" />
            <div className="about-photo-cap">Corey Ellis · Founder</div>
          </div>
          <div className="about-copy reveal">
            <div className="about-eyebrow">The founder · the proof story</div>
            <div className="about-title">I built Signal Flair because<br /><em>I failed my own audit.</em></div>

            <div className="cz-card">
              <div className="cz-k">CASE ZERO · 06.06.2026</div>
              <div className="cz-score">18<small>/100</small></div>
              <div className="cz-state">Signal Invisible</div>
              <div className="cz-note">A company selling AI visibility — invisible to AI. I published the score. I documented the rebuild. I did not hide it.</div>
            </div>

            <div className="about-body fdr-body">
              <p>On June 6, 2026, I ran the Signal Protocol™ on Signal Flair. We scored <strong>18 out of 100</strong>. That number is <strong>Case Zero</strong> — the only proof number I will claim until I earn the next one.</p>
              <p>What I found was bigger than my own site. Most businesses with real customers, strong reputations, and years of work are still unreadable to the machines now making referral decisions. Not because the business is weak — because the infrastructure that lets AI understand and recommend them does not exist.</p>
              <p>Signal Flair builds that infrastructure. Not with random blog posts. Not with vague content strategies. With a number, a protocol, and a maintenance system that keeps the number true.</p>
            </div>

            <div className="fdr-defs">
              <div className="fdr-def"><span className="fdr-def-t">The Signal Score™</span>{' '}<span className="fdr-def-d">is not a ranking. It is a measurement.</span></div>
              <div className="fdr-def"><span className="fdr-def-t">The Signal Protocol™</span>{' '}<span className="fdr-def-d">is not a generic audit. It is a diagnostic instrument.</span></div>
              <div className="fdr-def"><span className="fdr-def-t">Stay Found™</span>{' '}<span className="fdr-def-d">is not a retainer. It is a maintenance system.</span></div>
            </div>

            <p className="fdr-close">I am not selling you visibility. I am handing you the number and showing you exactly what it means.</p>
            <div className="fdr-chant">What&apos;s your Signal Score?</div>

            <div className="about-sign">
              <div>
                <div className="about-sign-name">— Corey Ellis</div>
                <div className="about-sign-role">Founder · Signal Flair · Mental Vision · Brownsburg, Indiana</div>
                <div className="about-sign-loc">Brownsburg, Indiana · serving businesses nationwide</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ — objection-handling accordion ═══ */}
      <section id="faq" data-cursor="light">
        <div className="faq-head reveal">
          <div className="faq-eyebrow">Straight answers</div>
          <div className="faq-title">Questions, <em>answered.</em></div>
        </div>
        <div className="faq-list reveal">
          <details className="faq-item" open>
            <summary className="faq-q">What is a Signal Score™?<span className="faq-ic" aria-hidden="true" /></summary>
            <div className="faq-a">Your Signal Score™ is a 0–100 measure of how findable, readable, and recommendable your business is to AI engines — scored across the six layers of the Signal Protocol™: Access &amp; Crawlability, Structured Intelligence, Entity Clarity, Answer Architecture, Trust &amp; Proof Density, and Live AI Visibility. We run you through ChatGPT, Claude, Perplexity, Gemini, and Google AI, then show you the number and exactly what&apos;s pulling it down.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">What is AI Proof Infrastructure™?<span className="faq-ic" aria-hidden="true" /></summary>
            <div className="faq-a">AI Proof Infrastructure is the structured layer of business information, technical signals, trust proof, and public verification assets that helps AI answer engines understand and verify an organization. Signal Flair builds it — so ChatGPT, Claude, Gemini, Perplexity, and Google AI can access, understand, verify, and confidently recommend you.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">What is a Signal Proof Page™?<span className="faq-ic" aria-hidden="true" /></summary>
            <div className="faq-a">A public, crawlable proof asset that shows your current Signal Score™, your proof-layer assets, trust signals, AI-visibility evidence, and a last-updated date — so both people and AI engines can verify you from one place. It stays fresh through Stay Found™ as your score climbs.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">What is a Competitor Signal Snapshot™?<span className="faq-ic" aria-hidden="true" /></summary>
            <div className="faq-a">A point-in-time comparison of how your Signal Score™ and six signal layers stack up against one selected competitor, peer, or niche benchmark — so you can see where a rival is currently easier for AI to access, understand, verify, or surface, and which proof gaps to fix first. It&apos;s a snapshot, not a tracking dashboard: based on publicly available signals and observed AI responses at the time of review — never a claim about a competitor&apos;s private traffic, revenue, or strategy.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">How is this different from SEO?<span className="faq-ic" aria-hidden="true" /></summary>
            <div className="faq-a">SEO optimizes for blue links on a results page. We optimize for the layer AI engines actually read — llms.txt, schema, crawler access — so when someone asks an AI for a recommendation, your business is the answer. <em>Different machine, different rules.</em> We don&apos;t do traditional SEO or paid ads.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">How does AI decide whether to trust your business?<span className="faq-ic" aria-hidden="true" /></summary>
            <div className="faq-a">Before any AI engine recommends you, it checks whether it can <em>verify</em> you. ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews cross-reference your site&apos;s claims against what they can confirm elsewhere — schema, reviews, directory listings, citations, and credentials. When that proof is dense and consistent, you read as trustworthy; when it&apos;s thin or contradictory, the engine quietly leaves you out. That&apos;s the <strong>Trust &amp; Proof Density</strong> layer of the Signal Protocol™ — and it&apos;s the layer Signal Flair builds: schema, a Signal Proof Page™, llms.txt, and aligned entity signals, so AI can trust what it finds, not just find you.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">Do you guarantee rankings, leads, or revenue?<span className="faq-ic" aria-hidden="true" /></summary>
            <div className="faq-a">No — and anyone who does is guessing. Our guarantee is <strong>delivery-based only</strong>: we build and hand over the infrastructure — llms.txt, schema, crawler fixes, your 90-day plan. You keep all of it, even if you cancel. We never promise rankings, leads, or citations we can&apos;t control.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">How long does the Foundation Build take?<span className="faq-ic" aria-hidden="true" /></summary>
            <div className="faq-a">7–14 days, not months. We scan, score, and install the full machine-readable layer — then hand you a 90-day AI action plan.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">What happens when AI search changes?<span className="faq-ic" aria-hidden="true" /></summary>
            <div className="faq-a">It will — and often. That&apos;s what Stay Found™ is for: recurring proof maintenance — monthly re-scans, fresh citations, schema and llms.txt updates, and crawler monitoring — to help keep your signal current as new engines ship and competitors catch up.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">What is the Founding Partner Pilot?<span className="faq-ic" aria-hidden="true" /></summary>
            <div className="faq-a">An early-stage program for businesses, nonprofits, civic organizations, and community partners that want to measure how AI systems currently understand them — and document building a stronger proof layer. It starts with a Signal Score™ baseline, identifies the missing proof, and tracks the before-and-after. The goal is documented proof, not hype.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">Is Signal Flair only for businesses?<span className="faq-ic" aria-hidden="true" /></summary>
            <div className="faq-a">No. Signal Flair supports businesses, nonprofits, civic organizations, and community-facing programs — anyone that needs to become easier for AI systems to access, understand, verify, and recommend.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-q">Do I have to get on a sales call?<span className="faq-ic" aria-hidden="true" /></summary>
            <div className="faq-a">No. Request your free Field Report above — we scan 3 critical signals and send your partial audit within 24 hours. No pitch, no pressure. <em>The ball stays in your court.</em></div>
          </details>
        </div>
      </section>

      {/* ═══ CTA — lead-capture audit form ═══ */}
      <section id="cta" data-cursor="light">
        <div className="cta-deco">FOUND.</div>
        <div className="cta-inner">
          <div className="cta-left">
            <div className="cta-y-pre reveal">AI Proof Infrastructure™</div>
            <div className="cta-y-title reveal">See what AI <em>actually knows</em><br />about your business — free.</div>
            <div className="cta-y-sub reveal">Three critical AI signals — scanned across every major engine and delivered in 24 hours. No call. No pitch. Just the diagnosis: exactly where your signal breaks.</div>
            <div className="cta-y-btns reveal" style={{ marginTop: '26px' }}>
              <a className="cta-y-ghost" href="#founding">▸ Explore a Founding Pilot →</a>
              <a className="cta-y-ghost" href="#check">▸ See all six layers →</a>
            </div>
          </div>
          <div className="cta-right reveal" id="field-report">
            <div className="lead-card">
              {!leadSuccess && (
              <div id="lead-form-wrap">
                <div className="lead-h">Get Your Free Signal Flair <em>Field Report</em></div>
                <div className="lead-subline">We run 3 critical AI signals on your business and deliver a partial audit within 24 hours — no call required. Most local businesses score under 40. You&apos;ll see exactly where your signal breaks.</div>
                <form id="lead-form" ref={leadFormRef} noValidate onSubmit={handleLeadSubmit}>
                  <div className="lf-field">
                    <label className="lf-label" htmlFor="lf-name">Full Name<span className="req">*</span></label>
                    <input className={`lf-input${leadFieldErrors.full_name ? ' invalid' : ''}`} id="lf-name" name="full_name" type="text" autoComplete="name" placeholder="Jane Smith" />
                    <span className="lf-err" aria-live="polite">{leadFieldErrors.full_name || ''}</span>
                  </div>
                  <div className="lf-field">
                    <label className="lf-label" htmlFor="lf-biz">Business Name<span className="req">*</span></label>
                    <input className={`lf-input${leadFieldErrors.business_name ? ' invalid' : ''}`} id="lf-biz" name="business_name" type="text" autoComplete="organization" placeholder="Smith &amp; Co." />
                    <span className="lf-err" aria-live="polite">{leadFieldErrors.business_name || ''}</span>
                  </div>
                  <div className="lf-field full">
                    <label className="lf-label" htmlFor="lf-url">Website URL<span className="req">*</span></label>
                    <input className={`lf-input${leadFieldErrors.website_url ? ' invalid' : ''}`} id="lf-url" name="website_url" type="url" inputMode="url" autoComplete="url" placeholder="yourbusiness.com" />
                    <span className="lf-err" aria-live="polite">{leadFieldErrors.website_url || ''}</span>
                  </div>
                  <div className="lf-field">
                    <label className="lf-label" htmlFor="lf-email">Email<span className="req">*</span></label>
                    <input className={`lf-input${leadFieldErrors.email ? ' invalid' : ''}`} id="lf-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="jane@yourbusiness.com" />
                    <span className="lf-err" aria-live="polite">{leadFieldErrors.email || ''}</span>
                  </div>
                  <div className="lf-field">
                    <label className="lf-label" htmlFor="lf-phone">Phone</label>
                    <input className="lf-input" id="lf-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(optional)" />
                    <span className="lf-err" aria-live="polite" />
                  </div>
                  <div className="lf-field">
                    <label className="lf-label" htmlFor="lf-service">Primary Service<span className="req">*</span></label>
                    <input className={`lf-input${leadFieldErrors.primary_service ? ' invalid' : ''}`} id="lf-service" name="primary_service" type="text" placeholder="e.g. HVAC, dental, law" />
                    <span className="lf-err" aria-live="polite">{leadFieldErrors.primary_service || ''}</span>
                  </div>
                  <div className="lf-field">
                    <label className="lf-label" htmlFor="lf-city">City / Service Area</label>
                    <input className="lf-input" id="lf-city" name="city" type="text" autoComplete="address-level2" placeholder="(optional)" />
                    <span className="lf-err" aria-live="polite" />
                  </div>
                  <input type="hidden" name="source" defaultValue="signalflair.ai" />
                  <input type="hidden" name="page_url" defaultValue="" />
                  <input type="hidden" name="utm_source" defaultValue="" />
                  <input type="hidden" name="utm_medium" defaultValue="" />
                  <input type="hidden" name="utm_campaign" defaultValue="" />
                  <input type="hidden" name="lead_tag" defaultValue="Field Report Request" />
                  <div className="lead-formerr" id="lead-formerr" aria-live="assertive">{leadFormError}</div>
                  <button type="submit" className="lead-submit" disabled={leadSubmitting}>
                    {leadSubmitting ? 'Running…' : '▸ Run My Field Report'}
                  </button>
                  <div className="lead-micro">No credit card. No spam. Your Field Report lands in your inbox within 24 hours. This covers 3 of the 6 Signal Protocol™ layers — the full breakdown requires the complete audit.</div>
                </form>
              </div>
              )}
              {leadSuccess && (
              <div className="lead-success" id="lead-success" role="status" aria-live="polite" style={{ display: 'block' }}>
                <div className="ls-mark" aria-hidden="true">✓</div>
                <div className="ls-h">Field Report requested.</div>
                <div className="ls-b">We&apos;re scanning your 3 critical signals across <strong>ChatGPT, Claude, Perplexity, Gemini &amp; Google AI</strong>. Your Field Report lands in your inbox within 24 hours — the full 6-signal breakdown comes next.</div>
              </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MENTAL VISION CONTENT BRIDGE — subtle insider tip, routes out to MV ═══ */}
      <section id="mv-bridge">
        <div className="mvb-rule" />
        <div className="mvb-inner">
          <div className="mvb-head">AI found you. Now make them stay.</div>
          <div className="mvb-body">Signal Flair gets you found. What happens when they land is a different conversation — and a different brand. Cinematic campaigns, UGC creative, and AI-generated content live at Mental Vision.</div>
          <a className="mvb-cta" href="https://mentalvision.ai" target="_blank" rel="noopener noreferrer">→ See what Mental Vision builds</a>
        </div>
        <div className="mvb-rule" />
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer>
        <div className="fi">
          <div>
            <a className="f-logo" href="#hero"><SignalFlairLogo onDark style={{ height: 56, width: 'auto', display: 'block' }} /></a>
            <div className="f-tag">AI Proof Infrastructure™<br />Brownsburg, Indiana · Serving businesses nationwide · Est. 2026<br />Your business, found by AI.</div>
            <a className="f-email" href="mailto:hello@signalflair.ai">hello@signalflair.ai</a>
          </div>
          <div><div className="f-head">Services</div><a className="f-link" href="#signal">AI Visibility Audit</a><a className="f-link" href="#signal">Foundation Build</a><a className="f-link" href="#signal">Stay Found™</a><a className="f-link" href="#check">What We Check</a><a className="f-link" href="#pricing">Pricing</a></div>
          <div><div className="f-head">Company</div><a className="f-link" href="#process">How It Works</a><a className="f-link" href="#pricing">Pricing</a><a className="f-link" href="/resources/llms-txt/">llms.txt Guide</a><a className="f-link" href="https://mentalvision.ai" target="_blank" rel="noopener noreferrer">Mental Vision</a><a className="f-link" href="mailto:hello@signalflair.ai">Contact</a></div>
          <div><div className="f-head">Connect</div><a className="f-link" href="https://www.linkedin.com/company/signal-flair-ai" target="_blank" rel="noopener noreferrer">LinkedIn</a><a className="f-link" href="#">Instagram</a><a className="f-link" href="#">YouTube</a><a className="f-link" href="mailto:hello@signalflair.ai">hello@signalflair.ai</a></div>
        </div>
        <div className="f-chant-band">
          <div className="f-chant">What&apos;s your Signal Score?</div>
          <div className="f-tm">Signal Protocol™ · Signal Score™ · Stay Found™ · Verified by Signal Flair™</div>
          <div className="f-privacy">We never share your data. No spam.</div>
        </div>
        <div className="fb">
          <div className="fb-l">Signal Flair is a Mental Vision product | Brownsburg, Indiana · Serving nationwide | signalflair.ai</div>
          <div className="fb-r">AI Proof Infrastructure™ · Signal Flair v1.0</div>
        </div>
      </footer>
    </>
  )
}
