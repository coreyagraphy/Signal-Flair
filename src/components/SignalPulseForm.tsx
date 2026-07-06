'use client'
/**
 * SignalPulseForm — the instant Signal Pulse™ experience (website + email).
 *
 * On submit it calls the Netlify function (/.netlify/functions/signal-pulse), which fetches
 * the prospect's site server-side and returns a deterministic 0–100 Signal Pulse™ + four
 * bucket scores in a few seconds. The page animates a live gauge. The function also forwards
 * the lead + score to GHL, so the fuller Signal Score™ follow-up is emailed.
 *
 * Robust fallbacks:
 *  - function unavailable (e.g. local dev, or pre-deploy) → post straight to the GHL webhook
 *    and show the "request received, we'll email it" state (no fake score).
 *  - unreachable/invalid URL → clear message; the lead is still captured server-side when possible.
 * Lead routing stays SEPARATE from the website's Field Report intake (source=signal-pulse).
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { track } from '@/lib/analytics'
import { tierFor } from '@/lib/signal-tiers'

const FUNCTION_URL = '/.netlify/functions/signal-pulse'
// Client-side fallback webhook (only used if the function itself can't be reached).
const FALLBACK_WEBHOOK =
  (process.env.NEXT_PUBLIC_SIGNAL_PULSE_WEBHOOK_URL ?? '').trim() ||
  (process.env.NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL ?? '').trim() ||
  (process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL ?? '').trim() ||
  ''
const FALLBACK_EMAIL = 'hello@signalflair.ai'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

type Phase = 'idle' | 'scanning' | 'result' | 'sent'
type Bucket = { key: string; label: string; score: number }
type PulseData = { ok: boolean; pulse: number; buckets: Bucket[]; lowConfidence?: boolean; spaLike?: boolean; url?: string; signals?: Record<string, unknown> }

export default function SignalPulseForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ website_url?: string; email?: string }>({})
  const [result, setResult] = useState<PulseData | null>(null)
  const [email, setEmail] = useState('')
  const [websiteVal, setWebsiteVal] = useState('')
  const [scanDomain, setScanDomain] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')
    const form = formRef.current
    if (!form) return

    const website = String(new FormData(form).get('website_url') || '').trim()
    const emailVal = String(new FormData(form).get('email') || '').trim()
    const errs: { website_url?: string; email?: string } = {}
    if (!website) errs.website_url = 'Required'
    else if (!/\.\w{2,}/.test(website)) errs.website_url = 'Enter a valid website'
    if (!emailVal) errs.email = 'Required'
    else if (!EMAIL_RE.test(emailVal)) errs.email = 'Enter a valid email'
    setFieldErrors(errs)
    if (Object.keys(errs).length) {
      setFormError('Enter your website and a valid email to run your Signal Pulse™.')
      ;(form.querySelector('.ssc-input.invalid') as HTMLInputElement | null)?.focus()
      return
    }

    // hidden context
    const qp = new URLSearchParams(window.location.search)
    const setHidden = (n: string, v: string) => { const el = form.querySelector(`[name="${n}"]`) as HTMLInputElement | null; if (el) el.value = v }
    setHidden('page_url', window.location.href)
    setHidden('utm_source', qp.get('utm_source') || '')
    setHidden('utm_medium', qp.get('utm_medium') || '')
    setHidden('utm_campaign', qp.get('utm_campaign') || '')

    const payload: Record<string, string> = Object.fromEntries(Array.from(new FormData(form).entries()).map(([k, v]) => [k, String(v)]))
    payload.submitted_at = new Date().toISOString()

    setEmail(emailVal)
    setWebsiteVal(website)
    try { setScanDomain(new URL(/^https?:\/\//i.test(website) ? website : 'https://' + website).hostname) } catch { setScanDomain(website) }
    setPhase('scanning')

    // Call the function; keep a minimum on-screen scan time so it feels like a real scan.
    const scan: Promise<PulseData | null> = fetch(FUNCTION_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    }).then((r) => (r.ok ? r.json() : null)).catch(() => null)
    const [res] = await Promise.all([scan, sleep(2000)])

    if (res && res.ok) {
      setResult(res)
      setPhase('result')
      track('signal_pulse_result', { form_id: 'signal-pulse', pulse: res.pulse })
      return
    }
    if (res && !res.ok && ((res as any).reason === 'invalid_url' || (res as any).reason === 'blocked')) {
      setPhase('idle')
      setFormError('We couldn’t read that URL — double-check it and try again.')
      return
    }

    // Function unavailable or site unreachable → make sure the lead is captured, then confirm by email.
    if (res == null && FALLBACK_WEBHOOK) {
      try {
        const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 10000)
        await fetch(FALLBACK_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctrl.signal }).finally(() => clearTimeout(t))
      } catch { /* best effort */ }
    }
    track('form_submit', { form_id: 'signal-pulse', preview_type: 'signal-pulse' })
    setPhase('sent')
  }, [])

  return (
    <div className="ssc-form" id="pulse">
      {phase === 'idle' && (
        <form ref={formRef} noValidate onSubmit={handleSubmit}>
          <div className="ssc-form-head">
            <span className="ssc-form-badge"><span className="ssc-dot" aria-hidden="true" />Signal Pulse™</span>
            <span className="ssc-form-sub">Enter your website and email — your Signal Pulse™ score appears in seconds. The full, human-verified Signal Score™ is an optional next step.</span>
          </div>
          <div className="ssc-field">
            <label className="ssc-label" htmlFor="sp-url">Website URL<span className="ssc-req">*</span></label>
            <input className={`ssc-input${fieldErrors.website_url ? ' invalid' : ''}`} id="sp-url" name="website_url" type="url" inputMode="url" autoComplete="url" placeholder="yourbusiness.com" />
            <span className="ssc-err" aria-live="polite">{fieldErrors.website_url || ''}</span>
          </div>
          <div className="ssc-field">
            <label className="ssc-label" htmlFor="sp-email">Email<span className="ssc-req">*</span></label>
            <input className={`ssc-input${fieldErrors.email ? ' invalid' : ''}`} id="sp-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@yourbusiness.com" />
            <span className="ssc-err" aria-live="polite">{fieldErrors.email || ''}</span>
          </div>
          <input type="hidden" name="source" defaultValue="signal-pulse" />
          <input type="hidden" name="preview_type" defaultValue="signal-pulse" />
          <input type="hidden" name="lead_tag" defaultValue="Signal Pulse Request" />
          <input type="hidden" name="form_type" defaultValue="signal_pulse" />
          <input type="hidden" name="request_type" defaultValue="signal_pulse_preview" />
          <input type="hidden" name="page_url" defaultValue="" />
          <input type="hidden" name="utm_source" defaultValue="" />
          <input type="hidden" name="utm_medium" defaultValue="" />
          <input type="hidden" name="utm_campaign" defaultValue="" />
          <div className="ssc-formerr" aria-live="assertive">{formError}</div>
          <button type="submit" className="ssc-submit">▸ Get My Signal Pulse™</button>
          <div className="ssc-micro">No credit card. No spam. Signal Pulse™ is an instant preview — your full Signal Score™ is human-verified across all six Signal Protocol™ layers.</div>
        </form>
      )}

      {phase === 'scanning' && (
        <div className="ssc-scan" role="status" aria-live="polite">
          <div className="ssc-scan-radar" aria-hidden="true"><i /><i /><i /></div>
          <div className="ssc-scan-title">Reading your AI signals…</div>
          <div className="ssc-scan-sub">{scanDomain}</div>
          <ul className="ssc-scan-steps">
            <li>Access &amp; crawlability</li>
            <li>Structure &amp; schema</li>
            <li>Trust &amp; proof</li>
            <li>Answer-readiness</li>
          </ul>
        </div>
      )}

      {phase === 'result' && result && <PulseResult data={result} email={email} website={websiteVal} />}

      {phase === 'sent' && (
        <div className="ssc-success" role="status" aria-live="polite">
          <div className="ssc-success-mark" aria-hidden="true">✓</div>
          <div className="ssc-success-h">Your Signal Pulse™ request is in.</div>
          <div className="ssc-success-b">We’ve got your site and email. A reviewer will check your first AI-readiness signals and email your Signal Pulse™ — typically within 24 hours. Watch your inbox.</div>
          <a className="ssc-success-link" href="/proof/">See Case Zero — our own 18 → 73 climb →</a>
        </div>
      )}
    </div>
  )
}

function PulseResult({ data, email, website }: { data: PulseData; email: string; website: string }) {
  const [n, setN] = useState(0)
  const [armed, setArmed] = useState(false)
  const [optState, setOptState] = useState<'idle' | 'sending' | 'done'>('idle')
  const pulse = data.pulse

  // Opt-in for the full (human-verified) Signal Score™ conversation — a separate, tagged
  // signal to GHL, distinct from the instant automated Pulse they already have.
  const optIn = async () => {
    setOptState('sending')
    try {
      if (FALLBACK_WEBHOOK) {
        const ctrl = new AbortController()
        const t = setTimeout(() => ctrl.abort(), 10000)
        await fetch(FALLBACK_WEBHOOK, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctrl.signal,
          body: JSON.stringify({
            website_url: website, email,
            source: 'signal-pulse-optin', full_score_optin: 'yes', preview_type: 'signal-pulse',
            lead_tag: 'Signal Score Optin', signal_pulse_score: data.pulse,
            signal_pulse_buckets: (data.buckets || []).map((b) => `${b.label}:${b.score}`).join(', '),
            signal_pulse_access: (data.buckets || []).find((b) => b.key === 'access')?.score ?? '',
            signal_pulse_structure: (data.buckets || []).find((b) => b.key === 'structure')?.score ?? '',
            signal_pulse_trust: (data.buckets || []).find((b) => b.key === 'trust')?.score ?? '',
            signal_pulse_answers: (data.buckets || []).find((b) => b.key === 'answers')?.score ?? '',
            signal_pulse_signals: data.signals ? JSON.stringify(data.signals) : '',
            submitted_at: new Date().toISOString(),
          }),
        }).finally(() => clearTimeout(t))
      }
      track('signal_score_optin', { form_id: 'signal-pulse', pulse: data.pulse })
    } catch { /* best effort */ }
    setOptState('done')
  }

  useEffect(() => {
    setArmed(true)
    let raf = 0
    let start = 0
    const dur = 1400
    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * pulse))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pulse])

  const C = 2 * Math.PI * 52
  const tier = tierFor(pulse)
  const color = tier.color
  const offset = armed ? C * (1 - pulse / 100) : C

  return (
    <div className="ssc-result" role="status" aria-live="polite">
      <div className="ssc-result-badge"><span className="ssc-dot" aria-hidden="true" />Signal Pulse™ · live preview</div>
      <div className="ssc-gauge">
        <svg viewBox="0 0 120 120" className="ssc-gauge-svg" aria-hidden="true">
          <circle className="ssc-gauge-track" cx="60" cy="60" r="52" />
          <circle className="ssc-gauge-arc" cx="60" cy="60" r="52" style={{ stroke: color, strokeDasharray: C, strokeDashoffset: offset }} />
        </svg>
        <div className="ssc-gauge-readout">
          <div className="ssc-gauge-num" style={{ color }}>{n}</div>
          <div className="ssc-gauge-lbl">/ 100</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', margin: '2px 0 22px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 16px', border: `1px solid ${tier.color}66`, background: `${tier.color}14`, borderRadius: '999px', color: tier.color, fontSize: '12px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: tier.color, boxShadow: `0 0 10px ${tier.color}` }} />{tier.name}
        </div>
        <div style={{ fontFamily: "'Caveat','Instrument Serif',cursive", fontWeight: 700, fontSize: '42px', lineHeight: 1.08, color: '#ffffff', textShadow: `-0.6px -0.6px 0 ${tier.color}, 0.6px -0.6px 0 ${tier.color}, -0.6px 0.6px 0 ${tier.color}, 0.6px 0.6px 0 ${tier.color}, 0 0 8px ${tier.color}66`, transform: 'rotate(-2.5deg)', maxWidth: '440px', textAlign: 'center' }}>&ldquo;{tier.verdict}&rdquo;</div>
      </div>
      <div className="ssc-bars">
        {data.buckets.map((b) => (
          <div className="ssc-bar-row" key={b.key}>
            <span className="ssc-bar-lbl">{b.label}</span>
            <span className="ssc-bar"><span className="ssc-bar-fill" style={{ width: armed ? `${b.score}%` : 0, background: tierFor(b.score).color }} /></span>
            <span className="ssc-bar-num">{b.score}</span>
          </div>
        ))}
      </div>
      {data.lowConfidence && (
        <div className="ssc-result-note">
          {data.spaLike
            ? 'Your site renders with JavaScript, so a couple of signals read low here — your full review reads the rendered page.'
            : 'We couldn’t fully reach your site, so this is a partial read — we’ll verify it by hand.'}
        </div>
      )}
      {optState !== 'done' ? (
        <div className="ssc-optin">
          <div className="ssc-optin-tag">Level 1 cleared</div>
          <div className="ssc-optin-h">Ready for <em>Level 2</em>?</div>
          <div className="ssc-optin-b">
            You just cleared Level 1 — the instant four-signal scan. <strong>Level 2</strong> is your full
            <strong> Signal Score™</strong>: all six Signal Protocol™ layers scored, the two locked layers cracked
            open, live AI-visibility tests, what’s dragging you down, and exactly how to fix it. Human-verified,
            sent to your inbox.
          </div>
          <button className="ssc-optin-btn" onClick={optIn} disabled={optState === 'sending'}>
            {optState === 'sending' ? 'Sending…' : '▸ Unlock Level 2 — my full Signal Score™'}
          </button>
          <div className="ssc-optin-fine">Free · no obligation</div>
        </div>
      ) : (
        <div className="ssc-optin ssc-optin--done">
          <div className="ssc-optin-mark" aria-hidden="true">✓</div>
          <div className="ssc-optin-h">Locked in.</div>
          <div className="ssc-optin-b">
            Your full <strong>Signal Score™</strong> breakdown is being prepared for <strong>{email}</strong> — the
            complete card, human-verified. Keep an eye on your inbox.
          </div>
          <a className="ssc-success-link" href="/proof/">See Case Zero — our own 18 → 73 climb →</a>
        </div>
      )}
    </div>
  )
}
