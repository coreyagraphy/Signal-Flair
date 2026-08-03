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
    // NOTE: tags deliberately NOT in the upsert payload — GHL upsert REPLACES the whole
    // tag array (verified 2026-07-13: a later upsert wiped earlier funnel tags). Tags are
    // added additively via POST /contacts/{id}/tags below instead.
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

    // Additive tagging (never wipes earlier funnel tags — see NOTE above).
    if (data.contact && data.contact.id) {
      try {
        const ctrlT = new AbortController()
        const tT = setTimeout(() => ctrlT.abort(), 6000)
        await fetch(`${GHL_API}/contacts/${data.contact.id}/tags`, {
          method: 'POST',
          signal: ctrlT.signal,
          headers: { Authorization: `Bearer ${key}`, Version: '2021-07-28', 'Content-Type': 'application/json' },
          body: JSON.stringify({ tags }),
        }).finally(() => clearTimeout(tT))
      } catch (e) { console.error('[lead-intake] add-tags failed', String((e && e.message) || e)) }
    }

    // Signal Flair card — instant confirmation email via the GHL conversations API
    // (sent from hello@signalflair.ai; queued best-effort, never blocks the response).
    // Two variants: the Score-call confirmation (Level 2 opt-in) vs. the Field Report card.
    const contactId = data.contact && data.contact.id
    if (contactId) {
      const isCall = String(body.call_requested || '') === 'yes' || extraTags.includes('signal-score-call-requested')
      const first = firstName || 'there'
      const card = (title, lines, footNote) => `
<div style="background:#f5f1e8;padding:28px 12px;font-family:Menlo,Consolas,monospace">
  <div style="max-width:520px;margin:0 auto;background:#0a0a0a;border-radius:14px;padding:30px 26px;color:#f0ebe0">
    <div style="font-size:11px;letter-spacing:3px;color:#00b8a9;text-transform:uppercase;margin-bottom:14px">SIGNAL FLAIR · AI PROOF INFRASTRUCTURE&trade;</div>
    <div style="font-size:21px;line-height:1.3;font-weight:700;margin-bottom:16px">${title}</div>
    ${lines.map((l) => `<div style="font-size:13px;line-height:1.8;color:rgba(240,235,224,0.85);margin-bottom:10px">${l}</div>`).join('')}
    <div style="margin-top:22px;padding-top:14px;border-top:1px solid rgba(240,235,224,0.15);font-size:10.5px;color:rgba(240,235,224,0.5)">${footNote}<br/>Signal Flair &middot; a Mental Vision product &middot; Indianapolis, Indiana &middot; serving nationwide</div>
  </div>
</div>`
      const subject = isCall
        ? `Locked in, ${first} — your Signal Score™ call is coming`
        : `Got it, ${first} — your Field Report is in motion`
      const html = isCall
        ? card('Your full Signal Score™ walkthrough is locked in.', [
            `Corey personally reviews all six Signal Protocol&trade; layers on your site${payload.website ? ` (${payload.website.replace(/^https?:\/\//, '')})` : ''} — then <strong style="color:#fff45f">calls you to walk through it live</strong>. What&rsquo;s dragging you, what it costs you, and exactly how to fix it.`,
            payload.phone ? `Keep <strong style="color:#00b8a9">${payload.phone}</strong> close — that&rsquo;s where the conversation happens.` : 'Watch your phone — that&rsquo;s where the conversation happens.',
            'No deck. No sales maze. No &ldquo;just circling back.&rdquo; We don&rsquo;t do that here.',
          ], 'You requested this after running your free Signal Pulse&trade; at signalflair.ai/pulse.')
        : card('Your free Field Report is in motion.', [
            `We&rsquo;re scanning 3 critical AI signals on ${payload.website ? payload.website.replace(/^https?:\/\//, '') : 'your site'} across <strong style="color:#fff45f">ChatGPT, Claude, Perplexity, Gemini &amp; Google AI</strong>. Your Field Report lands in this inbox within 24 hours.`,
            payload.phone ? `Corey reviews it personally — and since you left a number, <strong style="color:#00b8a9">expect a call at ${payload.phone}</strong> to talk through what he finds.` : 'Corey reviews every report personally — a real reply, not a sequence.',
            'Meanwhile: can&rsquo;t wait? Run your instant Signal Pulse&trade; at <a href="https://signalflair.ai/pulse/" style="color:#00b8a9">signalflair.ai/pulse</a>.',
          ], 'You requested this at signalflair.ai.')
      try {
        const ctrl3 = new AbortController()
        const t3 = setTimeout(() => ctrl3.abort(), 8000)
        const mail = await fetch(`${GHL_API}/conversations/messages`, {
          method: 'POST',
          signal: ctrl3.signal,
          headers: { Authorization: `Bearer ${key}`, Version: '2021-07-28', 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'Email', contactId, subject, html, emailFrom: 'hello@signalflair.ai' }),
        }).finally(() => clearTimeout(t3))
        console.info('[lead-intake] card email', mail.status, isCall ? 'call-confirm' : 'field-report')
      } catch (e) { console.error('[lead-intake] card email failed', String((e && e.message) || e)) }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, new: !!data.new }) }
  } catch (e) {
    console.error('[lead-intake] error', String((e && e.message) || e))
    return { statusCode: 502, headers, body: JSON.stringify({ ok: false, error: 'ghl_unreachable' }) }
  }
}
