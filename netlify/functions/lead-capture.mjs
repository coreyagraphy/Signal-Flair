/**
 * lead-capture — the durable acknowledgement path for every Signal Flair lead.
 *
 * WHY THIS EXISTS: posting a lead straight to Netlify Forms from the browser returns
 * HTTP 200 even when the submission is never recorded (observed 2026-08-19: two posts
 * ~12s apart, the second answered 200 and never landed). A 200 is therefore NOT proof of
 * capture, and the UI must never claim capture from one.
 *
 * WHAT THIS DOES INSTEAD:
 *   1. Writes the lead to a Netlify Blobs store (durable, site-scoped, strong consistency).
 *   2. READS IT BACK and checks the receipt matches — capture is only "accepted" once the
 *      record has been proven readable from the store.
 *   3. Only then mints and returns a receipt id. The UI shows success solely on that id.
 *   4. Separately mirrors the lead into Netlify Forms so exactly ONE notification email
 *      fires per lead. That leg is best-effort and reported honestly as `notified` — a
 *      failed notification never fakes a failed capture, and never fakes a successful one.
 *
 * RUNTIME: this is a Functions **v2** handler on purpose. The legacy Lambda-compat runtime
 * (`export const handler`) never receives NETLIFY_BLOBS_CONTEXT, so getStore() throws
 * "The environment has not been configured to use Netlify Blobs" — verified on this site
 * 2026-08-19 (runtime env showed AWS_LAMBDA_* and no blobs context). Do not convert this
 * back to the legacy signature.
 *
 * The browser no longer posts to Netlify Forms directly; this function is the single
 * writer, which is what keeps the email count at exactly one per lead.
 *
 * BOS: this endpoint is the stable seam. The stored record below is the contract.
 */
import { getStore } from '@netlify/blobs'
import { randomUUID } from 'node:crypto'

const STORE = 'leads'
const FORM_NAME = 'signal-pulse'

const clean = (v, max = 400) => String(v == null ? '' : v).trim().slice(0, max)

const HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: HEADERS })

/** Mirror into Netlify Forms purely to trigger the single notification email. */
async function notify(record, origin) {
  if (!origin) return { notified: false, reason: 'no_origin' }
  const form = new URLSearchParams({
    'form-name': FORM_NAME,
    receipt_id: record.receipt_id,
    captured_at: record.captured_at,
    lead_tag: record.lead_tag,
    lead_type: record.lead_type,
    full_name: record.full_name,
    business_name: record.business_name,
    website_url: record.website_url,
    email: record.email,
    phone: record.phone,
    signal_pulse_score: record.signal_pulse_score,
    signal_pulse_buckets: record.signal_pulse_buckets,
    contact_opt_in: record.contact_opt_in,
    contact_note: record.contact_note,
    source: record.source,
    page_url: record.page_url,
  })
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 8000)
  try {
    const res = await fetch(`${origin}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
      signal: ctrl.signal,
    })
    return { notified: res.ok, status: res.status }
  } catch (e) {
    return { notified: false, reason: String((e && e.message) || e) }
  } finally {
    clearTimeout(t)
  }
}

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: HEADERS })
  if (req.method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' })

  let body = {}
  try { body = await req.json() } catch { return json(400, { ok: false, error: 'bad_json' }) }

  // Honeypot — silently accept-and-drop bots without minting a receipt.
  if (clean(body['bot-field'])) return json(200, { ok: false, error: 'rejected' })

  const email = clean(body.email, 200)
  const website = clean(body.website_url, 300)
  if (!email || !email.includes('@')) return json(400, { ok: false, error: 'missing_email' })
  if (!website) return json(400, { ok: false, error: 'missing_website' })

  const leadType = clean(body.lead_type, 40) === 'breakdown' ? 'breakdown' : 'pulse'
  const receipt_id = `SF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomUUID().slice(0, 8).toUpperCase()}`
  const captured_at = new Date().toISOString()

  // Every field the funnel promises to carry, on BOTH paths.
  const record = {
    receipt_id,
    captured_at,
    lead_type: leadType,
    lead_tag: leadType === 'breakdown' ? 'Breakdown Request' : 'Signal Pulse Request',
    full_name: clean(body.full_name, 200),
    business_name: clean(body.business_name, 200),
    website_url: website,
    email,
    phone: clean(body.phone, 60),
    signal_pulse_score: clean(body.signal_pulse_score, 10),
    signal_pulse_buckets: clean(body.signal_pulse_buckets, 300),
    contact_opt_in: clean(body.contact_opt_in, 10),
    contact_note: clean(body.contact_note, 2000),
    source: clean(body.source, 80) || 'signal-pulse',
    page_url: clean(body.page_url, 500),
    utm: {
      source: clean(body.utm_source, 120),
      medium: clean(body.utm_medium, 120),
      campaign: clean(body.utm_campaign, 120),
    },
    user_agent: clean(req.headers.get('user-agent'), 300),
  }

  // ── 1. Persist ──────────────────────────────────────────────────────────────
  let store
  try {
    store = getStore({ name: STORE, consistency: 'strong' })
    await store.setJSON(receipt_id, record)
  } catch (e) {
    console.error('[lead-capture] write failed', String((e && e.message) || e))
    return json(502, { ok: false, error: 'capture_write_failed' })
  }

  // ── 2. Verify acceptance by reading it back ────────────────────────────────
  // Acceptance is proven, not assumed: no readback, no receipt.
  try {
    const back = await store.get(receipt_id, { type: 'json' })
    if (!back || back.receipt_id !== receipt_id || back.email !== email) {
      console.error('[lead-capture] readback mismatch', receipt_id)
      return json(502, { ok: false, error: 'capture_unverified' })
    }
  } catch (e) {
    console.error('[lead-capture] readback failed', String((e && e.message) || e))
    return json(502, { ok: false, error: 'capture_unverified' })
  }

  // ── 3. Single notification email (best effort, reported honestly) ──────────
  let origin = ''
  try { origin = new URL(req.url).origin } catch { origin = process.env.URL || '' }
  const note = await notify(record, origin)
  if (!note.notified) console.warn('[lead-capture] notification leg failed', receipt_id, JSON.stringify(note))

  // ── 4. Receipt — only reachable once capture was written AND read back ─────
  console.info('[lead-capture] captured', receipt_id, leadType, 'notified=' + note.notified)
  return json(200, { ok: true, receipt_id, captured_at, lead_type: leadType, notified: !!note.notified })
}
