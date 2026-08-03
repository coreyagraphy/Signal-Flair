'use client'

import { useEffect, useState } from 'react'
import { tierFor } from '../../lib/signal-tiers'

/*
  /scorecard — hosted, per-lead Signal Scorecard™ in the premium "instrument" style.
  Reads values from the URL query string so the CRM can link to it with merge fields:
    /scorecard/?company={{contact.company_name}}&score={{contact.signal_score}}
      &access={{contact.layer_access}}&structure={{contact.layer_structure}}
      &entity={{contact.layer_entity}}&answers={{contact.layer_answers}}
      &trust={{contact.layer_trust}}&live={{contact.layer_live}}&agent={{contact.layer_agent}}&date=July%201,%202026
  Pulse variant (4 signals) links the same page with signal_pulse_* values; the three
  layers with no value render honestly as "Pending".
  No score param at all  ->  the marketing "SAMPLE READOUT" view (87, blurbs only).
*/

type Layer = { n: string; key: string; name: string; blurb: string; accent: string }

const LAYERS: Layer[] = [
  { n: '01', key: 'access', name: 'Access & Crawlability', blurb: 'Can machines reach and read it at all.', accent: '#00d2bf' },
  { n: '02', key: 'structure', name: 'Structured Intelligence', blurb: 'Is the meaning machine-legible.', accent: '#37c4ff' },
  { n: '03', key: 'entity', name: 'Entity Clarity', blurb: 'Is the business unmistakably itself.', accent: '#ff3d82' },
  { n: '04', key: 'answers', name: 'Answer Architecture', blurb: 'Is there something to cite.', accent: '#fff45f' },
  { n: '05', key: 'trust', name: 'Trust & Proof Density', blurb: 'How much verifiable evidence exists.', accent: '#00d2bf' },
  { n: '06', key: 'live', name: 'Live AI Visibility', blurb: 'Does it actually surface in answers.', accent: '#ff5a1f' },
  { n: '07', key: 'agent', name: 'Agent & Commerce Readiness', blurb: 'Can an AI agent actually act on it.', accent: '#37c4ff' },
]

const clampScore = (v: string | null): number | null => {
  if (v == null || v.trim() === '') return null
  const n = Math.round(Number(v))
  if (!Number.isFinite(n)) return null
  return Math.max(0, Math.min(100, n))
}

const R = 110
const CIRC = 2 * Math.PI * R

export default function ScorecardPage() {
  const [ready, setReady] = useState(false)
  const [company, setCompany] = useState('')
  const [asOf, setAsOf] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [layerScores, setLayerScores] = useState<Record<string, number | null>>({})
  const [display, setDisplay] = useState(0)
  const [kind, setKind] = useState('')

  // Read the query string on mount (client-only; static export renders a shell first).
  useEffect(() => {
    const raw = window.location.search.replace(/^\?/, '')
    const p = new URLSearchParams(raw)
    const dec = (s: string | null) => {
      if (!s) return ''
      try { return decodeURIComponent(s.replace(/\+/g, ' ')) } catch { return s }
    }
    // `company` is passed LAST and may contain an unescaped "&" (e.g. "Bolls Heating &
    // Cooling") — capture everything after the final company= so the & doesn't split it.
    const cm = raw.match(/(?:^|&)company=(.*)$/)
    setCompany(cm ? dec(cm[1]) : '')
    setAsOf(dec(p.get('date')))
    setKind(p.get('kind') || '')
    const overall = clampScore(p.get('score'))
    setScore(overall)
    const ls: Record<string, number | null> = {}
    LAYERS.forEach((l) => { ls[l.key] = clampScore(p.get(l.key)) })
    setLayerScores(ls)
    setReady(true)
  }, [])

  const sample = ready && score == null
  const target = sample ? 87 : (score ?? 0)
  const tier = tierFor(target)
  const isPulse = kind === 'pulse'

  // Count-up the gauge number + ring on load.
  useEffect(() => {
    if (!ready) return
    let raf = 0
    const start = performance.now()
    const dur = 1200
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ready, target])

  const offset = CIRC * (1 - display / 100)
  const headline = company || 'The Signal Score™'
  const readoutLabel = sample ? 'Sample readout' : (company || 'Signal Scorecard™')

  return (
    <main className="sfsc">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="sfsc-grid" aria-hidden="true" />

      {/* Brand letterhead — logo (dark variant) + site */}
      <header className="sfsc-header">
        <div className="sfsc-logo" dangerouslySetInnerHTML={{ __html: LOGO }} />
        <a className="sfsc-site" href="https://signalflair.ai" target="_blank" rel="noreferrer">signalflair.ai</a>
      </header>

      <div className="sfsc-wrap">

        {/* LEFT — the instrument */}
        <div className="sfsc-left">
          <div className="sfsc-eyebrow"><span className="sfsc-tick" />{isPulse ? 'Signal Pulse™ · Level 1' : 'The Instrument'}</div>
          <h1 className="sfsc-h1">{headline}</h1>
          <p className="sfsc-sub">
            A single, defensible number across <strong>seven layers</strong> of AI readiness.
            It&apos;s the wedge: a business can&apos;t argue with its own score, and the gap to 100
            is the roadmap.
          </p>

          <div className="sfsc-layers">
            {LAYERS.map((l) => {
              const s = layerScores[l.key]
              const has = !sample && s != null
              const lc = has ? tierFor(s as number).color : l.accent
              const locked = isPulse && !sample && !has
              return (
                <div className={locked ? 'sfsc-layer sfsc-layer--locked' : 'sfsc-layer'} key={l.key}>
                  <div className="sfsc-layer-top">
                    <span className="sfsc-num" style={{ color: locked ? '#ffcf33' : lc, textShadow: `0 0 14px ${(locked ? '#ffcf33' : lc)}66` }}>{l.n}</span>
                    <span className="sfsc-lname" style={locked ? { color: '#ffcf33' } : undefined}>{l.name}</span>
                    {has && <span className="sfsc-lscore" style={{ color: lc }}>{s}<span className="sfsc-l100">/100</span></span>}
                    {locked && <span className="sfsc-locked">🔒 Level 2</span>}
                    {!sample && !has && !isPulse && <span className="sfsc-pending">Pending</span>}
                  </div>
                  <div className="sfsc-lblurb">{l.blurb}</div>
                  {has && (
                    <div className="sfsc-bar">
                      <div className="sfsc-bar-fill" style={{ width: `${s}%`, background: lc, boxShadow: `0 0 12px ${lc}88` }} />
                    </div>
                  )}
                  {locked && <div className="sfsc-bar"><div className="sfsc-bar-locked" /></div>}
                </div>
              )
            })}
          </div>

          {isPulse && (
            <div className="sfsc-level">
              <strong>Level 1: cleared.</strong> You scanned four of seven signals on the spot. Three are still <strong className="sfsc-lock-word">🔒 locked</strong> — <strong>Level&nbsp;2</strong> is your full Signal Score™: the boss fight that cracks them open and hands you the walkthrough to 100.
            </div>
          )}

          <div className="sfsc-foot">
            {asOf ? `As of ${asOf} · ` : ''}{isPulse ? 'Level 1 of 2 · ' : ''}The seven layers are public. The scoring method is not.
          </div>
        </div>

        {/* RIGHT — the gauge */}
        <div className="sfsc-right">
          <div className="sfsc-gauge">
            <svg viewBox="0 0 260 260" className="sfsc-svg">
              <defs>
                <linearGradient id="sfscRing" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={tier.color} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={tier.color} />
                </linearGradient>
                <filter id="sfscGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <circle cx="130" cy="130" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
              <circle
                cx="130" cy="130" r={R} fill="none" stroke="url(#sfscRing)" strokeWidth="12"
                strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset}
                transform="rotate(-90 130 130)" filter="url(#sfscGlow)"
                style={{ transition: 'stroke-dashoffset 90ms linear' }}
              />
            </svg>
            <div className="sfsc-readout">
              <div className="sfsc-score" style={{ color: tier.color }}>{display}</div>
              <div className="sfsc-score-lbl">/ 100 · {isPulse ? 'Signal Pulse' : 'Signal Score'}&trade;</div>
              <div className="sfsc-sample">{readoutLabel}</div>
            </div>
          </div>
          <div className="sfsc-tier" style={{ color: tier.color, borderColor: `${tier.color}66`, background: `${tier.color}14` }}>
            <span className="sfsc-tier-dot" style={{ background: tier.color, boxShadow: `0 0 12px ${tier.color}` }} />
            {tier.name}
          </div>
          <div className="sfsc-verdict" style={{ color: '#ffffff', textShadow: `-0.6px -0.6px 0 ${tier.color}, 0.6px -0.6px 0 ${tier.color}, -0.6px 0.6px 0 ${tier.color}, 0.6px 0.6px 0 ${tier.color}, 0 0 8px ${tier.color}66` }}>&ldquo;{tier.verdict}&rdquo;</div>
        </div>

      </div>
    </main>
  )
}

// Dark-mode variant of /public/signal-flair-logo.svg — FLAIR recolored bone (was near-black,
// invisible on dark), SIGNAL brightened. Inlined so the shared light-site logo file is untouched.
const LOGO = `<svg viewBox="0 0 360 148" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Signal Flair">
<defs>
<linearGradient id="sfscFlare" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ff5a1f" stop-opacity="0.15"/><stop offset="25%" stop-color="#ff5a1f" stop-opacity="0.9"/><stop offset="60%" stop-color="#fff45f" stop-opacity="1"/><stop offset="85%" stop-color="#ff5a1f" stop-opacity="0.6"/><stop offset="100%" stop-color="#ff5a1f" stop-opacity="0"/></linearGradient>
<linearGradient id="sfscFlare2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#fff45f" stop-opacity="0"/><stop offset="30%" stop-color="#fff45f" stop-opacity="0.4"/><stop offset="65%" stop-color="#fff45f" stop-opacity="0.9"/><stop offset="100%" stop-color="#fff45f" stop-opacity="0"/></linearGradient>
</defs>
<circle cx="6" cy="23" r="3" fill="#00d2bf"/><line x1="11" y1="23" x2="17" y2="23" stroke="#00d2bf" stroke-width="1.4"/><circle cx="20" cy="23" r="2" fill="#00d2bf" opacity="0.7"/><line x1="24" y1="23" x2="30" y2="23" stroke="#00d2bf" stroke-width="1.4"/><circle cx="33" cy="23" r="1.5" fill="#00d2bf" opacity="0.45"/>
<text x="40" y="32" font-family="'Geist Mono','Courier New',monospace" font-weight="600" font-size="20" fill="#00d2bf" letter-spacing="7">SIGNAL</text>
<text x="36" y="128" font-family="Fraunces,'Palatino Linotype',Georgia,serif" font-weight="900" font-size="104" fill="#f2f6f4" letter-spacing="-1">FLAIR</text>
<path d="M 28 118 C 80 100, 170 88, 310 116" stroke="url(#sfscFlare)" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M 55 114 C 120 98, 200 90, 300 112" stroke="url(#sfscFlare2)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<circle cx="38" cy="116" r="3.5" fill="#ff5a1f" opacity="0.7"/><circle cx="38" cy="116" r="6" fill="#ff5a1f" opacity="0.2"/>
</svg>`

const CSS = `
.sfsc{position:relative;min-height:100vh;width:100%;background:#0a0e0e;color:#e8efec;overflow:hidden;
  font-family:'Geist Mono',ui-monospace,'Segoe UI',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:48px 40px;box-sizing:border-box}
.sfsc-header{position:relative;z-index:1;width:100%;max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px}
.sfsc-logo{width:154px;line-height:0}
.sfsc-logo svg{width:100%;height:auto;display:block}
.sfsc-site{font-size:12px;letter-spacing:0.16em;color:#8b9a96;text-decoration:none;display:inline-flex;align-items:center;gap:8px}
.sfsc-site::before{content:"";width:6px;height:6px;border-radius:50%;background:#00d2bf;box-shadow:0 0 8px #00d2bf}
.sfsc-site:hover{color:#00d2bf}
.sfsc-grid{position:absolute;inset:0;pointer-events:none;opacity:0.5;
  background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
  background-size:72px 72px;mask-image:radial-gradient(120% 90% at 70% 40%,#000 30%,transparent 80%);-webkit-mask-image:radial-gradient(120% 90% at 70% 40%,#000 30%,transparent 80%)}
.sfsc-wrap{position:relative;z-index:1;width:100%;max-width:1180px;margin:auto 0;display:grid;grid-template-columns:1.15fr 0.85fr;gap:48px;align-items:center}
.sfsc-left{min-width:0}
.sfsc-eyebrow{display:flex;align-items:center;gap:12px;font-size:12px;letter-spacing:0.34em;text-transform:uppercase;color:#00d2bf;margin-bottom:22px}
.sfsc-tick{width:34px;height:1.5px;background:#00d2bf;box-shadow:0 0 10px #00d2bf}
.sfsc-h1{font-family:'Instrument Serif','Fraunces',Georgia,serif;font-weight:400;font-size:60px;line-height:1.02;letter-spacing:-0.01em;color:#f4f8f6;margin:0 0 20px}
.sfsc-sub{font-size:16px;line-height:1.6;color:#9fb0ab;max-width:520px;margin:0 0 34px}
.sfsc-sub strong{color:#e8efec;font-weight:600}
.sfsc-layers{display:grid;grid-template-columns:1fr 1fr;gap:18px 34px;border-top:1px solid rgba(255,255,255,0.08);padding-top:26px}
.sfsc-layer{min-width:0}
.sfsc-layer-top{display:flex;align-items:baseline;gap:10px}
.sfsc-num{font-size:12px;font-weight:600;letter-spacing:0.05em}
.sfsc-lname{font-size:15px;font-weight:700;color:#f2f6f4;flex:0 1 auto}
.sfsc-lscore{margin-left:auto;font-size:15px;font-weight:700;letter-spacing:0.02em}
.sfsc-l100{font-size:11px;color:#6b7a76;font-weight:400;margin-left:1px}
.sfsc-pending{margin-left:auto;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#7d8a86;border:1px solid rgba(255,255,255,0.14);border-radius:999px;padding:2px 9px}
.sfsc-locked{margin-left:auto;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#ffcf33;border:1px solid rgba(255,207,51,0.42);border-radius:999px;padding:2px 9px;background:rgba(255,207,51,0.09);white-space:nowrap}
.sfsc-level{margin-top:24px;font-size:12.5px;line-height:1.65;color:#aebbb6;max-width:560px;border-left:2px solid #ffcf33;padding-left:14px}
.sfsc-level strong{color:#eef4f1;font-weight:700}
.sfsc-lock-word{color:#ffcf33 !important}
.sfsc-layer--locked{opacity:0.92}
.sfsc-layer--locked .sfsc-lblurb{color:#8a8266}
.sfsc-bar-locked{height:100%;width:100%;border-radius:3px;background:repeating-linear-gradient(45deg,rgba(255,207,51,0.34) 0 5px,rgba(255,207,51,0.07) 5px 10px);background-size:200% 200%;animation:sfscLockShimmer 2.6s linear infinite}
.sfsc-locked{animation:sfscLockPulse 2.6s ease-in-out infinite}
@keyframes sfscLockShimmer{0%{background-position:0 0}100%{background-position:28px 0}}
@keyframes sfscLockPulse{0%,100%{opacity:1;box-shadow:0 0 0 rgba(255,207,51,0)}50%{opacity:0.72;box-shadow:0 0 10px rgba(255,207,51,0.55)}}
@media (prefers-reduced-motion:reduce){.sfsc-bar-locked,.sfsc-locked{animation:none}}
.sfsc-lblurb{font-size:13px;line-height:1.45;color:#7f8e8a;margin-top:3px}
.sfsc-bar{height:4px;border-radius:3px;background:rgba(255,255,255,0.07);margin-top:9px;overflow:hidden}
.sfsc-bar-fill{height:100%;border-radius:3px;transition:width 900ms cubic-bezier(.16,1,.3,1)}
.sfsc-foot{font-size:12px;letter-spacing:0.02em;color:#5f6d69;margin-top:30px;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px}
.sfsc-right{display:flex;flex-direction:column;align-items:center;justify-content:center}
.sfsc-gauge{position:relative;width:360px;height:360px;max-width:100%}
.sfsc-svg{width:100%;height:100%;display:block}
.sfsc-readout{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.sfsc-score{font-family:'Instrument Serif','Fraunces',Georgia,serif;font-size:96px;line-height:0.9;color:#f4f8f6;font-weight:400}
.sfsc-score-lbl{font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#8b9a96;margin-top:10px}
.sfsc-sample{font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#8b9a96;margin-top:8px;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sfsc-tier{margin-top:30px;font-size:13px;font-weight:600;letter-spacing:0.26em;text-transform:uppercase;display:inline-flex;align-items:center;gap:9px;padding:8px 18px;border:1px solid;border-radius:999px}
.sfsc-tier-dot{width:8px;height:8px;border-radius:50%;flex:0 0 auto}
.sfsc-verdict{margin-top:20px;font-family:'Caveat','Instrument Serif',cursive;font-weight:700;font-size:46px;line-height:1.08;max-width:440px;text-align:center;transform:rotate(-2.5deg)}
@media (max-width:900px){
  .sfsc{padding:48px 24px}
  .sfsc-wrap{grid-template-columns:1fr;gap:40px}
  .sfsc-right{order:-1}
  .sfsc-h1{font-size:46px}
  .sfsc-layers{grid-template-columns:1fr}
  .sfsc-gauge{width:300px;height:300px}
  .sfsc-score{font-size:80px}
}
`
