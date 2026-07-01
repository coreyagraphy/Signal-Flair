'use client'
/**
 * SignalPulseForm — the Signal Pulse™ request console (website + email only).
 *
 * Lead routing is SEPARATE from the main website's Field Report intake: it posts to a
 * dedicated Signal Pulse webhook first (NEXT_PUBLIC_SIGNAL_PULSE_WEBHOOK_URL), so these
 * landing-page leads can land in their own GHL workflow / notification email. It falls back
 * to the shared webhooks only so a lead is never dropped — and every payload is tagged
 * `source=signal-pulse` / `lead_tag=Signal Pulse Request`, so GHL can still route + notify
 * these separately even on a shared endpoint.
 *
 * There is NO instant score — the site is a static export with no backend, and a browser
 * can't crawl a third-party site (CORS). We capture the request honestly; a real reviewer
 * emails the Signal Pulse™ back (delivery is a GHL follow-up, not automation).
 */
import { useCallback, useRef, useState } from 'react'
import { track } from '@/lib/analytics'

const WEBHOOK_URL =
  (process.env.NEXT_PUBLIC_SIGNAL_PULSE_WEBHOOK_URL ?? '').trim() ||
  (process.env.NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL ?? '').trim() ||
  (process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL ?? '').trim() ||
  ''
const FALLBACK_EMAIL = 'hello@signalflair.ai'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FieldErrors = { website_url?: string; email?: string }

export default function SignalPulseForm() {
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
      setFormError(`Request error. Email ${FALLBACK_EMAIL} and we'll follow up manually.`)
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
      setFormError('Enter your website and a valid email to get your Signal Pulse™.')
      const first = form.querySelector('.ssc-input.invalid') as HTMLInputElement | null
      first?.focus()
      return
    }

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
      track('form_submit', { form_id: 'signal-pulse', preview_type: 'signal-pulse' })
      setSuccess(true)
      setFieldErrors({})
      setFormError('')
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        setFormError(`Request timed out. Email ${FALLBACK_EMAIL} and we'll follow up manually.`)
      } else if (err?.message === 'webhook_not_configured') {
        setFormError(
          process.env.NODE_ENV === 'development'
            ? 'Signal Pulse intake not configured. Set NEXT_PUBLIC_SIGNAL_PULSE_WEBHOOK_URL (or a fallback) in .env.local and restart dev.'
            : `Signal Pulse intake is temporarily unavailable. Email ${FALLBACK_EMAIL} and we'll follow up manually.`,
        )
      } else {
        setFormError(`We couldn't submit your request. Email ${FALLBACK_EMAIL} and we'll follow up manually.`)
      }
    } finally {
      setSubmitting(false)
    }
  }, [])

  return (
    <div className="ssc-form" id="pulse">
      {!success ? (
        <form ref={formRef} noValidate onSubmit={handleSubmit}>
          <div className="ssc-form-head">
            <span className="ssc-form-badge"><span className="ssc-dot" aria-hidden="true" />Signal Pulse™</span>
            <span className="ssc-form-title">Get your free Signal Pulse™</span>
            <span className="ssc-form-sub">Enter your website and email. A real reviewer checks your first AI-readiness signals and emails your Signal Pulse™ preview — no automated black-box score.</span>
          </div>

          <div className="ssc-field">
            <label className="ssc-label" htmlFor="sp-url">Website URL<span className="ssc-req">*</span></label>
            <input
              className={`ssc-input${fieldErrors.website_url ? ' invalid' : ''}`}
              id="sp-url"
              name="website_url"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="yourbusiness.com"
            />
            <span className="ssc-err" aria-live="polite">{fieldErrors.website_url || ''}</span>
          </div>

          <div className="ssc-field">
            <label className="ssc-label" htmlFor="sp-email">Email<span className="ssc-req">*</span></label>
            <input
              className={`ssc-input${fieldErrors.email ? ' invalid' : ''}`}
              id="sp-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@yourbusiness.com"
            />
            <span className="ssc-err" aria-live="polite">{fieldErrors.email || ''}</span>
          </div>

          {/* Hidden context — source tag keeps these leads separable in GHL even on a shared webhook. */}
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
          <div className="ssc-success-h">Your Signal Pulse™ request has been received.</div>
          <div className="ssc-success-b">
            A real reviewer will check your first AI-readiness signals — access, structure, trust, and
            answers — and email your Signal Pulse™ preview, typically within 24 hours. Watch your inbox.
          </div>
          <a className="ssc-success-link" href="/proof/">See Case Zero — our own 18/100 baseline →</a>
        </div>
      )}
    </div>
  )
}
