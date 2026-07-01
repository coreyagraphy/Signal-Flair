'use client'
/**
 * SignalScanForm — the scan console on /signal-scan.
 *
 * Asks for ONLY website + email (low friction for cold traffic; the homepage
 * Field Report form asks for seven fields). Posts to the SAME intake webhook as
 * the homepage form, so a Signal Scan™ request lands in the same Field Report →
 * Signal Score™ funnel, tagged `signal-scan` / `signal-pulse`.
 *
 * There is NO instant score. The site is a static export with no backend, and a
 * browser can't crawl a third-party site (CORS). So this captures the request
 * honestly and promises a reviewed Signal Pulse™ follow-up — it never fabricates
 * a number. If real crawler logic is added later, swap the success copy for the
 * "preview is ready" variant.
 */
import { useCallback, useRef, useState } from 'react'
import { track } from '@/lib/analytics'

// Same resolution order as the homepage Field Report form (build-time inlined for
// static export): router endpoint first, GHL inbound webhook as the always-on fallback.
const WEBHOOK_URL =
  (process.env.NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL ?? '').trim() ||
  (process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL ?? '').trim() ||
  ''
const FALLBACK_EMAIL = 'hello@signalflair.ai'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FieldErrors = { website_url?: string; email?: string }

export default function SignalScanForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')
    const form = formRef.current
    if (!form) {
      setFormError(`Scan intake error. Email ${FALLBACK_EMAIL} and we'll follow up manually.`)
      return
    }

    const website = String(new FormData(form).get('website_url') || '').trim()
    const email = String(new FormData(form).get('email') || '').trim()
    const nextErr: FieldErrors = {}
    if (!website) nextErr.website_url = 'Required'
    else if (!/\.\w{2,}/.test(website)) nextErr.website_url = 'Enter a valid website'
    if (!email) nextErr.email = 'Required'
    else if (!EMAIL_RE.test(email)) nextErr.email = 'Enter a valid email'
    setFieldErrors(nextErr)
    if (Object.keys(nextErr).length) {
      setFormError('Enter your website and a valid email to start your Signal Scan™.')
      const first = form.querySelector('.ssc-input.invalid') as HTMLInputElement | null
      first?.focus()
      return
    }

    // Enrich hidden context (page + utm), exactly like the homepage form.
    const qp = new URLSearchParams(window.location.search)
    const setHidden = (n: string, v: string) => {
      const el = form.querySelector(`[name="${n}"]`) as HTMLInputElement | null
      if (el) el.value = v
    }
    setHidden('page_url', window.location.href)
    setHidden('utm_source', qp.get('utm_source') || '')
    setHidden('utm_medium', qp.get('utm_medium') || '')
    setHidden('utm_campaign', qp.get('utm_campaign') || '')

    const payload: Record<string, string> = Object.fromEntries(
      Array.from(new FormData(form).entries()).map(([k, v]) => [k, String(v)]),
    )
    payload.submitted_at = new Date().toISOString()

    setSubmitting(true)
    try {
      if (!WEBHOOK_URL) throw new Error('webhook_not_configured')
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 10000)
      try {
        const res = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: ctrl.signal,
        })
        if (!res.ok) throw new Error('status ' + res.status)
      } finally {
        clearTimeout(timer)
      }
      track('form_submit', { form_id: 'signal-scan', preview_type: 'signal-pulse' })
      setSuccess(true)
      setFieldErrors({})
      setFormError('')
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setFormError(`Request timed out. Email ${FALLBACK_EMAIL} and we'll follow up manually.`)
      } else if (err?.message === 'webhook_not_configured') {
        setFormError(
          process.env.NODE_ENV === 'development'
            ? 'Scan intake not configured. Set NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL or NEXT_PUBLIC_GHL_WEBHOOK_URL in .env.local and restart dev.'
            : `Scan intake is temporarily unavailable. Email ${FALLBACK_EMAIL} and we'll follow up manually.`,
        )
      } else {
        setFormError(`We couldn't submit your request. Email ${FALLBACK_EMAIL} and we'll follow up manually.`)
      }
    } finally {
      setSubmitting(false)
    }
  }, [])

  return (
    <div className="ssc-form" id="scan">
      {!success ? (
        <form ref={formRef} noValidate onSubmit={handleSubmit}>
          <div className="ssc-form-head">
            <span className="ssc-form-badge"><span className="ssc-dot" aria-hidden="true" />Signal Scan™</span>
            <span className="ssc-form-title">Start your free Signal Scan™</span>
            <span className="ssc-form-sub">Enter your website and email. We review your first AI-readiness signals and send your Signal Pulse™ preview with clear next steps.</span>
          </div>

          <div className="ssc-field">
            <label className="ssc-label" htmlFor="ssc-url">Website URL<span className="ssc-req">*</span></label>
            <input
              className={`ssc-input${fieldErrors.website_url ? ' invalid' : ''}`}
              id="ssc-url"
              name="website_url"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="yourbusiness.com"
            />
            <span className="ssc-err" aria-live="polite">{fieldErrors.website_url || ''}</span>
          </div>

          <div className="ssc-field">
            <label className="ssc-label" htmlFor="ssc-email">Email<span className="ssc-req">*</span></label>
            <input
              className={`ssc-input${fieldErrors.email ? ' invalid' : ''}`}
              id="ssc-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@yourbusiness.com"
            />
            <span className="ssc-err" aria-live="polite">{fieldErrors.email || ''}</span>
          </div>

          {/* Hidden context — mirrors the homepage form so leads route + tag identically. */}
          <input type="hidden" name="source" defaultValue="signal-scan" />
          <input type="hidden" name="preview_type" defaultValue="signal-pulse" />
          <input type="hidden" name="lead_tag" defaultValue="Signal Scan Request" />
          <input type="hidden" name="form_type" defaultValue="signal_scan" />
          <input type="hidden" name="request_type" defaultValue="signal_pulse_preview" />
          <input type="hidden" name="page_url" defaultValue="" />
          <input type="hidden" name="utm_source" defaultValue="" />
          <input type="hidden" name="utm_medium" defaultValue="" />
          <input type="hidden" name="utm_campaign" defaultValue="" />

          <div className="ssc-formerr" aria-live="assertive">{formError}</div>
          <button type="submit" className="ssc-submit" disabled={submitting}>
            {submitting ? 'Sending…' : '▸ Get My Signal Pulse™'}
          </button>
          <div className="ssc-micro">
            No credit card. No spam. Signal Pulse™ is a quick preview — your full Signal Score™ is
            verified across all six Signal Protocol™ layers.
          </div>
        </form>
      ) : (
        <div className="ssc-success" role="status" aria-live="polite">
          <div className="ssc-success-mark" aria-hidden="true">✓</div>
          <div className="ssc-success-h">Your Signal Scan™ request has been received.</div>
          <div className="ssc-success-b">
            We&apos;ll review the first AI-readiness signals for your site — access, structure, trust, and
            answers — and follow up with your Signal Pulse™ preview and next steps. Watch your inbox.
          </div>
          <a className="ssc-success-link" href="/proof/">See Case Zero — our own 18/100 baseline →</a>
        </div>
      )}
    </div>
  )
}
