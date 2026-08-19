'use client'
/**
 * SignalPulseForm — the instant Signal Pulse™ experience (website + email).
 *
 * On submit it calls the Netlify function (/.netlify/functions/signal-pulse), which fetches
 * the prospect's site server-side and returns a deterministic 0–100 Signal Pulse™ + four
 * bucket scores in a few seconds. The page animates a live gauge. Lead delivery is Netlify
 * Forms → email (GHL retired 2026-08-18; BOS will connect to this flow later).
 *
 * Robust fallbacks:
 *  - function unavailable (e.g. local dev, or pre-deploy) → optional fallback webhook
 *    and the "request received, we'll email it" state (no fake score).
 *  - unreachable/invalid URL → clear message; the lead is still captured when possible.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { track } from '@/lib/analytics'
import { tierFor } from '@/lib/signal-tiers'

const FUNCTION_URL = '/.netlify/functions/signal-pulse'
// Client-side fallback webhook (only used if the function itself can't be reached).
const FALLBACK_WEBHOOK =
  (process.env.NEXT_PUBLIC_SIGNAL_PULSE_WEBHOOK_URL ?? '').trim() ||
  (process.env.NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL ?? '').trim() ||
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
  const [fieldErrors, setFieldErrors] = useState<{ website_url?: string; email?: string; full_name?: string }>({})
  const [result, setResult] = useState<PulseData | null>(null)
  const [email, setEmail] = useState('')
  const [websiteVal, setWebsiteVal] = useState('')
  const [scanDomain, setScanDomain] = useState('')
  // signalflair.ai handoff — the homepage form stashes the lead in sessionStorage on
  // submit; when present we skip collection entirely and auto-run their scan.
  const [handoff, setHandoff] = useState<Record<string, string> | null>(null)
  const [prefill, setPrefill] = useState<{ website: string; email: string; name: string }>({ website: '', email: '', name: '' })
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')

  // Shared scan path — used by the visible form AND the handoff auto-run.
  const executeScan = useCallback(async (payload: Record<string, string>, emailVal: string, website: string) => {
    setEmail(emailVal)
    setWebsiteVal(website)
    setLeadName(payload.full_name || '')
    setLeadPhone(payload.phone || '')
    try { setScanDomain(new URL(/^https?:\/\//i.test(website) ? website : 'https://' + website).hostname) } catch { setScanDomain(website) }
    setPhase('scanning')

    // Lead delivery: Netlify Forms → email to outreach@trysignalflair.com. Covers BOTH
    // direct submits and homepage handoffs. (BOS integration will attach here later.)
    try {
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ 'form-name': 'signal-pulse', ...payload }).toString() }).catch(() => {})
    } catch { /* best effort */ }

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

  // Handoff auto-run: legacy sessionStorage handoff from older homepage forms — honored
  // if present so nobody is asked twice. The homepage now links straight to /pulse.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('sf_lead')
      if (!raw) return
      const lead = JSON.parse(raw) as Record<string, string>
      if (!lead || !EMAIL_RE.test(lead.email || '') || !/\.\w{2,}/.test(lead.website_url || '')) return
      setHandoff(lead)
      track('pulse_handoff_autorun', { form_id: 'signal-pulse' })
      executeScan({
        website_url: lead.website_url, email: lead.email,
        full_name: lead.full_name || '', phone: lead.phone || '', business_name: lead.business_name || '',
        source: 'signalflair-handoff', preview_type: 'signal-pulse', lead_tag: 'Signal Pulse Request',
        form_type: 'signal_pulse', request_type: 'signal_pulse_preview',
        page_url: window.location.href, submitted_at: new Date().toISOString(),
      }, lead.email, lead.website_url)
    } catch { /* malformed storage → normal form */ }
  }, [executeScan])

  // "Not your site?" — clear the handoff, prefill the form with what we had, start over.
  const resetHandoff = useCallback(() => {
    try { sessionStorage.removeItem('sf_lead') } catch {}
    setPrefill({ website: handoff?.website_url || '', email: handoff?.email || '', name: handoff?.full_name || '' })
    setHandoff(null)
    setResult(null)
    setFormError('')
    setPhase('idle')
  }, [handoff])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')
    const form = formRef.current
    if (!form) return

    const website = String(new FormData(form).get('website_url') || '').trim()
    const emailVal = String(new FormData(form).get('email') || '').trim()
    const nameVal = String(new FormData(form).get('full_name') || '').trim()
    const errs: { website_url?: string; email?: string; full_name?: string } = {}
    if (!nameVal) errs.full_name = 'Required'
    if (!website) errs.website_url = 'Required'
    else if (!/\.\w{2,}/.test(website)) errs.website_url = 'Enter a valid website'
    if (!emailVal) errs.email = 'Required'
    else if (!EMAIL_RE.test(emailVal)) errs.email = 'Enter a valid email'
    setFieldErrors(errs)
    if (Object.keys(errs).length) {
      setFormError('Your name, website, and a valid email — that’s all the Pulse needs.')
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

    await executeScan(payload, emailVal, website)
  }, [executeScan])

  return (
    <div className="ssc-form" id="pulse">
      {phase === 'idle' && (
        <form name="signal-pulse" data-netlify="true" data-netlify-honeypot="bot-field" ref={formRef} noValidate onSubmit={handleSubmit}>
          {/* Netlify Forms registration (deploy-time parsed) + spam honeypot */}
          <input type="hidden" name="form-name" value="signal-pulse" />
          <p style={{ display: 'none' }} aria-hidden="true"><label>Don&apos;t fill this out: <input name="bot-field" /></label></p>
          <div className="ssc-form-head">
            <span className="ssc-form-badge"><span className="ssc-dot" aria-hidden="true" />Signal Pulse™</span>
            <span className="ssc-form-sub">Tell us who you are and where to look — your Pulse appears in seconds. The Breakdown, the human-verified investigation, is the optional next step.</span>
          </div>
          <div className="ssc-field">
            <label className="ssc-label" htmlFor="sp-name">Your name<span className="ssc-req">*</span></label>
            <input className={`ssc-input${fieldErrors.full_name ? ' invalid' : ''}`} id="sp-name" name="full_name" type="text" autoComplete="name" placeholder="Jane Smith" defaultValue={prefill.name} />
            <span className="ssc-err" aria-live="polite">{fieldErrors.full_name || ''}</span>
          </div>
          <div className="ssc-field">
            <label className="ssc-label" htmlFor="sp-url">Website URL<span className="ssc-req">*</span></label>
            <input className={`ssc-input${fieldErrors.website_url ? ' invalid' : ''}`} id="sp-url" name="website_url" type="url" inputMode="url" autoComplete="url" placeholder="yourbusiness.com" defaultValue={prefill.website} />
            <span className="ssc-err" aria-live="polite">{fieldErrors.website_url || ''}</span>
          </div>
          <div className="ssc-field">
            <label className="ssc-label" htmlFor="sp-email">Email<span className="ssc-req">*</span></label>
            <input className={`ssc-input${fieldErrors.email ? ' invalid' : ''}`} id="sp-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@yourbusiness.com" defaultValue={prefill.email} />
            <span className="ssc-err" aria-live="polite">{fieldErrors.email || ''}</span>
          </div>
          <div className="ssc-field">
            <label className="ssc-label" htmlFor="sp-phone">Best number to reach you</label>
            <input className="ssc-input" id="sp-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(optional)" />
            <span className="ssc-err" aria-live="polite" />
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
          <div className="ssc-micro">No charge. Takes seconds. No spam — and no call required. The Breakdown (the human-verified investigation across all six layers) is optional, after.</div>
        </form>
      )}

      {phase === 'scanning' && (
        <div className="ssc-scan" role="status" aria-live="polite">
          {handoff && <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, opacity: 0.65, marginBottom: '14px' }}>Using the info you just sent — no re-entry needed</div>}
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

      {phase === 'result' && result && (
        <>
          <PulseResult data={result} email={email} website={websiteVal} fromHandoff={!!handoff} fullName={leadName} phoneHint={leadPhone} />
          {handoff && (
            <button type="button" onClick={resetHandoff} style={{ display: 'block', margin: '14px auto 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Geist Mono',monospace", fontSize: '10.5px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, textDecoration: 'underline', opacity: 0.6, color: 'inherit' }}>
              Not your site? Run a different one →
            </button>
          )}
        </>
      )}

      {phase === 'sent' && (
        <div className="ssc-success" role="status" aria-live="polite">
          <div className="ssc-success-mark" aria-hidden="true">✓</div>
          <div className="ssc-success-h">Your Signal Pulse™ request is in.</div>
          <div className="ssc-success-b">We’ve got your site and email. A reviewer will check your first AI-readiness signals and email your Signal Pulse™ — typically within 24 hours. Watch your inbox.</div>
          <a className="ssc-success-link" href="/proof/">See Case Zero — our own 18 → 91 climb →</a>
          {!handoff && <a className="ssc-success-link" href="/#cta">Want a human on it now? Hand it to Corey →</a>}
        </div>
      )}
    </div>
  )
}

function PulseResult({ data, email, website, fromHandoff = false, fullName = '', phoneHint = '' }: { data: PulseData; email: string; website: string; fromHandoff?: boolean; fullName?: string; phoneHint?: string }) {
  const [n, setN] = useState(0)
  const [armed, setArmed] = useState(false)
  const [optState, setOptState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [optPhone, setOptPhone] = useState(phoneHint)
  const [optErr, setOptErr] = useState('')
  const pulse = data.pulse

  // The Breakdown ($500, credited toward the build) is requested here — phone required,
  // because it includes a personal walkthrough. The request lands via the Netlify Forms
  // mirror (email to outreach@). BOS will pick this flow up when it connects.
  const optIn = async () => {
    const phoneVal = optPhone.trim()
    if (phoneVal.replace(/\D/g, '').length < 7) {
      setOptErr('A real number — that’s where the conversation happens.')
      return
    }
    setOptErr('')
    setOptState('sending')
    const pulseFields = {
      website_url: website, email, full_name: fullName, phone: phoneVal,
      source: 'breakdown-request', breakdown_requested: 'yes', call_requested: 'yes', preview_type: 'signal-pulse',
      lead_tag: 'Breakdown Request', signal_pulse_score: String(data.pulse),
      signal_pulse_buckets: (data.buckets || []).map((b) => `${b.label}:${b.score}`).join(', '),
      signal_pulse_access: String((data.buckets || []).find((b) => b.key === 'access')?.score ?? ''),
      signal_pulse_structure: String((data.buckets || []).find((b) => b.key === 'structure')?.score ?? ''),
      signal_pulse_trust: String((data.buckets || []).find((b) => b.key === 'trust')?.score ?? ''),
      signal_pulse_answers: String((data.buckets || []).find((b) => b.key === 'answers')?.score ?? ''),
      submitted_at: new Date().toISOString(),
    }
    // Netlify Forms → email notification to outreach@trysignalflair.com (primary channel).
    try {
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ 'form-name': 'signal-pulse', ...pulseFields }).toString() }).catch(() => {})
    } catch { /* best effort */ }
    try { track('breakdown_request', { form_id: 'signal-pulse', pulse: data.pulse, call_requested: true }) } catch { /* no-op */ }
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
      <div style={{ margin: '14px auto 0', maxWidth: 460, textAlign: 'center', fontFamily: "'Geist Mono',monospace", fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(240,235,224,0.55)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 14px' }}>
        <span>Coverage: 4 of 6 signal layers</span>
        <span aria-hidden="true">·</span>
        <span>automated read{data.lowConfidence ? ' · PARTIAL' : ''}</span>
        <span aria-hidden="true">·</span>
        <span>Entity &amp; Live AI Visibility not covered by Pulse</span>
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
          <div className="ssc-optin-tag">Pulse complete — that was the quick read</div>
          <div className="ssc-optin-h">Ready for <em>The Breakdown</em>? · $500</div>
          <div className="ssc-optin-b">
            Pulse gave you the quick read. <strong>The Breakdown</strong> shows you what&apos;s really going on:
            your full <strong>Signal Score™</strong> across all six layers, <strong>human-verified</strong> — with the
            evidence behind every finding, what could <em>not</em> be verified, live AI-visibility checks where
            supported, and a prioritized fix order. <strong>Corey walks you through it personally.</strong> It&apos;s
            the point where Signal Flair verifies what&apos;s real before you spend thousands fixing it — and if we
            do the work, <strong>the full $500 goes toward your build</strong>.
          </div>
          <div className="ssc-field" style={{ maxWidth: 340, margin: '14px auto 0' }}>
            <label className="ssc-label" htmlFor="opt-phone">Best number for your walkthrough<span className="ssc-req">*</span></label>
            <input className={`ssc-input${optErr ? ' invalid' : ''}`} id="opt-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(317) 555-0136" value={optPhone} onChange={(e) => setOptPhone(e.target.value)} />
            <span className="ssc-err" aria-live="polite">{optErr}</span>
          </div>
          <button className="ssc-optin-btn" onClick={optIn} disabled={optState === 'sending'}>
            {optState === 'sending' ? 'On it…' : '▸ Get The Breakdown — $500'}
          </button>
          <div className="ssc-optin-fine">$500 · credited in full toward your build · a real conversation, not a sales maze</div>
        </div>
      ) : (
        <div className="ssc-optin ssc-optin--done">
          <div className="ssc-optin-mark" aria-hidden="true">✓</div>
          <div className="ssc-optin-h">Locked in.</div>
          <div className="ssc-optin-b">
            Corey will personally call you at <strong>{optPhone.trim()}</strong> to set up your
            <strong> Breakdown</strong> — the verified investigation: all six layers, the evidence, what&apos;s
            dragging you, and the fix order. The $500 credits in full toward your build. Keep the phone close.
          </div>
          <a className="ssc-success-link" href="/proof/">See Case Zero — our own 18 → 91 climb →</a>
        </div>
      )}
    </div>
  )
}
