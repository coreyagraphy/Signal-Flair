/**
 * lead-intake — website Field Report form → GHL contact, DIRECTLY via the Contacts API.
 *
 * Why this exists: the site originally POSTed to a GHL Inbound Webhook trigger, but that
 * webhook turned out to be an ORPHAN (its workflow was deleted; the URL answers
 * "test request received" forever and executes nothing — leads silently vanished).
 * Instead of re-wiring another fragile inbound-webhook, this function upserts the
 * contact through the official API: deterministic create/update + tags, and GHL
 * workflows with "Contact Created" / tag-added triggers (e.g. A-Invisible-Max Urgency)
 * fire off it natively.
 *
 * Env (Netlify → Environment variables, server-side only — NOT NEXT_PUBLIC):
 *   GHL_API_KEY      — Private Integration token (sub-account, contacts scope required)
 *   GHL_LOCATION_ID  — defaults to the Signal Flair sub-account
 *
 * The client treats this endpoint as its primary intake (NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL
 * = /.netlify/functions/lead-intake). Netlify Forms mirroring (client-side) stays as the
 * independent email channel to outreach@trysignalflair.com.
 */

const GHL_API = 'https://services.leadconnectorhq.com'
const LOCATION_ID = (process.env.GHL_LOCATION_ID || 'dmPSx68yJZdbLgQY5Osd').trim()

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
}

const splitName = (full) => {
  const parts = String(full || '').trim().split(/\s+/)
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' }
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'method_not_allowed' }) }
  }
  const key = (process.env.GHL_API_KEY || '').trim()
  if (!key) {
    // Misconfiguration must be loud, not a silent lead drop — the client shows its
    // fallback-email error state on non-2xx.
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: 'ghl_key_not_configured' }) }
  }

  let body = {}
  try { body = JSON.parse(event.body || '{}') } catch { /* ignore */ }
  const email = String(body.email || '').trim()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'invalid_email' }) }
  }

  const { firstName, lastName } = splitName(body.full_name)
  const website = String(body.website_url || '').trim()
  // Base tags + optional caller-supplied extras (e.g. signal-score-call-requested).
  // Sanitized: strings only, trimmed, capped — tags drive GHL workflows, keep them clean.
  const extraTags = Array.isArray(body.extra_tags)
    ? body.extra_tags.filter((t) => typeof t === 'string').map((t) => t.trim().slice(0, 60)).filter(Boolean).slice(0, 5)
    : []
  const tags = [...new Set(['website-lead', String(body.lead_tag || 'Field Report Request'), ...extraTags])]

  const payload = {
    locationId: LOCATION_ID,
    email,
    firstName,
    lastName,
    name: String(body.full_name || '').trim(),
    phone: String(body.phone || '').trim() || undefined,
    companyName: String(body.business_name || '').trim() || undefined,
    website: website ? (/^https?:\/\//i.test(website) ? website : 'https://' + website) : undefined,
    source: String(body.source || 'signalflair.ai'),
    tags,
  }

  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 8000)
    const res = await fetch(`${GHL_API}/contacts/upsert`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).finally(() => clearTimeout(t))
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[lead-intake] GHL upsert failed', res.status, detail.slice(0, 300))
      return { statusCode: 502, headers, body: JSON.stringify({ ok: false, error: 'ghl_upsert_failed', status: res.status }) }
    }
    const data = await res.json().catch(() => ({}))
    // Note (non-PII log): which fields arrived + created-vs-updated, for funnel debugging.
    console.info('[lead-intake] upserted contact', { new: data.new, hasPhone: !!payload.phone, hasCompany: !!payload.companyName, source: payload.source })
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, new: !!data.new }) }
  } catch (e) {
    console.error('[lead-intake] error', String((e && e.message) || e))
    return { statusCode: 502, headers, body: JSON.stringify({ ok: false, error: 'ghl_unreachable' }) }
  }
}
