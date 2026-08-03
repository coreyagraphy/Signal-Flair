/**
 * Signal Pulse™ — instant deterministic AI-readiness preview (Netlify Function).
 *
 * Runs SERVER-SIDE (no browser CORS limit): fetches the prospect's homepage, robots.txt,
 * and sitemap, then scores four public buckets — Access / Structure / Trust / Answers —
 * from concrete, verifiable signals. Returns a 0–100 Signal Pulse™ in a few seconds.
 *
 * This is intentionally the LIGHTWEIGHT PREVIEW, not the full Signal Score™: it only does
 * deterministic checks on the raw HTML. The full Signal Score™ (live AI-visibility tests
 * across ChatGPT/Claude/Perplexity/Gemini) is the slower, human/Proof-OS follow-up — it is
 * NOT computed here, so nothing is overstated. Also forwards the lead + computed pulse to
 * GHL so the follow-up + CRM have the number.
 */

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)))

function normalize(raw) {
  let u = String(raw || '').trim()
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u
  return new URL(u) // throws on invalid
}

// Basic SSRF guard — refuse localhost / private ranges.
function isBlockedHost(host) {
  const h = host.toLowerCase().replace(/^\[|\]$/g, '')
  if (h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal')) return true
  if (h === '::1' || h === '0.0.0.0') return true
  if (/^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(h)) return true
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true
  return false
}

async function grab(url, ms = 5000) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': 'SignalFlairBot/1.0 (+https://signalflair.ai; AI-readiness preview)' },
    })
    const text = res.ok ? await res.text() : ''
    return { ok: res.ok, status: res.status, text, finalUrl: res.url }
  } catch (e) {
    return { ok: false, status: 0, text: '', error: String((e && e.name) || e) }
  } finally {
    clearTimeout(t)
  }
}

export async function scoreSite(input) {
  const url = normalize(input)
  if (isBlockedHost(url.hostname)) throw new Error('blocked_host')
  const origin = url.origin

  const [homeRes, robotsRes] = await Promise.all([grab(url.href), grab(origin + '/robots.txt', 4000)])
  const html = homeRes.text || ''
  const lower = html.toLowerCase()
  const robots = robotsRes.text || ''

  if (!homeRes.ok && !robotsRes.ok) {
    return { ok: false, reason: 'unreachable', url: url.href }
  }

  // — Access —
  let sitemapFound = /^sitemap:\s*http/im.test(robots)
  if (!sitemapFound) {
    const sm = await grab(origin + '/sitemap.xml', 4000)
    sitemapFound = sm.ok && /<urlset|<sitemapindex|<\?xml/i.test(sm.text)
  }
  const blocksAll = /user-agent:\s*\*[\s\S]*?disallow:\s*\/\s*(\n|\r|$)/i.test(robots)
  const bots = ['gptbot', 'oai-searchbot', 'perplexitybot', 'claudebot', 'google-extended', 'googlebot', 'bingbot']
  const botBlocked = (n) => new RegExp('user-agent:\\s*' + n + '[\\s\\S]*?disallow:\\s*/\\s*(\\n|\\r|$)', 'i').test(robots)
  const anyBotBlocked = blocksAll || bots.some(botBlocked)

  // — Structure —
  const jsonLdBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || []
  const jsonLd = jsonLdBlocks.join(' ').toLowerCase()
  const hasJsonLd = jsonLdBlocks.length > 0
  const hasOrgSchema = /"@type"\s*:\s*"?(organization|localbusiness|professionalservice)/i.test(jsonLd)
  const hasFaqSchema = /"@type"\s*:\s*"?faqpage/i.test(jsonLd)
  const hasTitle = /<title[^>]*>[^<]{3,}<\/title>/i.test(html)
  const hasMetaDesc = /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{10,}/i.test(html)
  const h1 = (html.match(/<h1[\s>]/gi) || []).length
  const h2 = (html.match(/<h2[\s>]/gi) || []).length
  const hasOg = /<meta[^>]+property=["']og:/i.test(html)

  // — Trust —
  const hasSameAs = /"sameas"/i.test(jsonLd)
  const hasAddress = /"address"/i.test(jsonLd) || /itemprop=["']address/i.test(lower)
  const hasContact = /mailto:/i.test(html) || /tel:\+?\d/i.test(html) || /"contactpoint"/i.test(jsonLd)
  const social = (lower.match(/(linkedin\.com|instagram\.com|facebook\.com|youtube\.com|x\.com|twitter\.com|crunchbase\.com)/g) || []).length

  // — Answers —
  const textOnly = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')
  const words = (textOnly.match(/\b\w+\b/g) || []).length
  const hasFaqText = hasFaqSchema || /faq|frequently asked questions/i.test(lower)
  const hasLists = /<ul[\s>]|<ol[\s>]/i.test(html)

  // JS-rendered SPA: little visible text + a framework root + no server-side schema → many
  // signals read low even if the rendered site is fine. Flag it so we don't mislead.
  const spaLike = words < 120 && /id=["'](root|__next|app|__nuxt)["']/i.test(html) && !hasJsonLd

  let access = 0
  if (homeRes.ok) access += 45
  if (robotsRes.ok || robots) access += 15
  if (sitemapFound) access += 25
  access += anyBotBlocked ? 0 : 15

  let structure = 0
  if (hasTitle) structure += 15
  if (hasMetaDesc) structure += 15
  if (hasJsonLd) structure += 25
  if (hasOrgSchema) structure += 20
  if (h1 >= 1) structure += 12
  if (h2 >= 2) structure += 8
  if (hasOg) structure += 5

  let trust = 0
  if (hasOrgSchema) trust += 22
  if (hasSameAs) trust += 20
  if (hasAddress) trust += 16
  if (hasContact) trust += 22
  if (social >= 1) trust += 12
  if (social >= 3) trust += 8

  let answers = 0
  if (hasFaqSchema) answers += 30
  else if (hasFaqText) answers += 15
  if (words >= 400) answers += 25
  else if (words >= 150) answers += 12
  if (h2 >= 3) answers += 20
  if (hasLists) answers += 15

  access = clamp(access); structure = clamp(structure); trust = clamp(trust); answers = clamp(answers)
  const pulse = clamp(access * 0.3 + structure * 0.3 + trust * 0.2 + answers * 0.2)

  return {
    ok: true,
    url: url.href,
    reachable: homeRes.ok,
    spaLike,
    lowConfidence: !homeRes.ok || spaLike,
    pulse,
    buckets: [
      { key: 'access', label: 'Access', score: access },
      { key: 'structure', label: 'Structure', score: structure },
      { key: 'trust', label: 'Trust', score: trust },
      { key: 'answers', label: 'Answers', score: answers },
    ],
    signals: { sitemapFound, hasJsonLd, hasOrgSchema, hasFaqSchema, anyBotBlocked, words },
  }
}

export const handler = async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' }
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'method_not_allowed' }) }

  let body = {}
  try { body = JSON.parse(event.body || '{}') } catch { /* ignore */ }
  const website = body.website_url || body.url
  if (!website) return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'missing_url' }) }

  let result
  try {
    result = await scoreSite(website)
  } catch (e) {
    const msg = String((e && e.message) || e)
    return { statusCode: 200, headers, body: JSON.stringify({ ok: false, reason: msg === 'blocked_host' ? 'blocked' : 'invalid_url', error: msg }) }
  }

  // Streamlined spine (2026-07-13): the legacy inbound-webhook forward was OMITTED — that
  // workflow executed without creating contacts. Everything now flows through the Contacts
  // API: upsert w/ tags (workflows key off Contact Created / tags), then the Signal Flair
  // scorecard email goes out directly via the conversations API. Best effort throughout.
  const ghlKey = (process.env.GHL_API_KEY || '').trim()
  if (ghlKey && body.email) {
    let contactId = null
    try {
      const nameParts = String(body.full_name || '').trim().split(/\s+/)
      const ctrl2 = new AbortController()
      const t2 = setTimeout(() => ctrl2.abort(), 6000)
      const up = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
        method: 'POST',
        signal: ctrl2.signal,
        headers: { Authorization: `Bearer ${ghlKey}`, Version: '2021-07-28', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId: (process.env.GHL_LOCATION_ID || 'dmPSx68yJZdbLgQY5Osd').trim(),
          email: String(body.email).trim(),
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          name: String(body.full_name || '').trim() || undefined,
          phone: String(body.phone || '').trim() || undefined,
          companyName: String(body.business_name || '').trim() || undefined,
          website: /^https?:\/\//i.test(website) ? website : 'https://' + website,
          source: body.source || 'signal-pulse',
          // tags NOT here — GHL upsert replaces the whole tag array; added additively below.
        }),
      }).finally(() => clearTimeout(t2))
      const upData = await up.json().catch(() => ({}))
      contactId = upData.contact && upData.contact.id
      console.info('[signal-pulse] contact upsert', up.status)
      if (contactId) {
        const ctrlT = new AbortController()
        const tT = setTimeout(() => ctrlT.abort(), 6000)
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
          method: 'POST',
          signal: ctrlT.signal,
          headers: { Authorization: `Bearer ${ghlKey}`, Version: '2021-07-28', 'Content-Type': 'application/json' },
          body: JSON.stringify({ tags: ['website-lead', 'signal pulse request'] }),
        }).finally(() => clearTimeout(tT))
      }
    } catch (e) { console.error('[signal-pulse] contact upsert failed', String((e && e.message) || e)) }

    // Signal Flair card — the Pulse scorecard email, with their real numbers.
    if (contactId && result.ok) {
      const colorFor = (v) => (v < 40 ? '#ff4326' : v < 70 ? '#FF5A1F' : v < 85 ? '#FFE23A' : '#00B8A9')
      const first = String(body.full_name || '').trim().split(/\s+/)[0] || 'there'
      const domain = website.replace(/^https?:\/\//i, '').replace(/\/.*$/, '')
      const bar = (label, score) => `
        <tr>
          <td style="padding:6px 0;font-size:11px;color:rgba(240,235,224,0.7);width:150px">${label}</td>
          <td style="padding:6px 0">
            <div style="background:rgba(240,235,224,0.12);border-radius:99px;height:8px;width:100%"><div style="background:${colorFor(score)};border-radius:99px;height:8px;width:${Math.max(4, Math.min(100, score))}%"></div></div>
          </td>
          <td style="padding:6px 0 6px 10px;font-size:12px;font-weight:700;color:${colorFor(score)};width:34px;text-align:right">${score}</td>
        </tr>`
      const html = `
<div style="background:#f5f1e8;padding:28px 12px;font-family:Menlo,Consolas,monospace">
  <div style="max-width:520px;margin:0 auto;background:#0a0a0a;border-radius:14px;padding:30px 26px;color:#f0ebe0">
    <div style="font-size:11px;letter-spacing:3px;color:#00b8a9;text-transform:uppercase;margin-bottom:14px">SIGNAL FLAIR &middot; SIGNAL PULSE&trade; CARD</div>
    <div style="font-size:20px;line-height:1.3;font-weight:700;margin-bottom:6px">${domain}</div>
    <div style="font-size:52px;font-weight:700;color:${colorFor(result.pulse)};line-height:1;margin:14px 0 2px">${result.pulse}<span style="font-size:16px;color:rgba(240,235,224,0.5)"> / 100</span></div>
    <div style="font-size:10.5px;letter-spacing:2px;color:rgba(240,235,224,0.55);text-transform:uppercase;margin-bottom:18px">Signal Pulse&trade; &middot; instant preview &middot; Level 1 of 2</div>
    <table style="width:100%;border-collapse:collapse">${(result.buckets || []).map((b) => bar(b.label, b.score)).join('')}</table>
    <div style="font-size:13px;line-height:1.8;color:rgba(240,235,224,0.85);margin-top:20px">Hey ${first} — this is the four-signal instant read. Your full <strong style="color:#fff45f">Signal Score&trade;</strong> covers all six Signal Protocol&trade; layers plus live AI-visibility tests, and <strong style="color:#00b8a9">Corey walks you through it on a call</strong> — not a PDF. Grab it on the results page, or just reply to this email.</div>
    <div style="margin-top:22px;padding-top:14px;border-top:1px solid rgba(240,235,224,0.15);font-size:10.5px;color:rgba(240,235,224,0.5)">Signal Pulse&trade; is an automated preview, not the verified Signal Score&trade;.<br/>Signal Flair &middot; a Mental Vision product &middot; Indianapolis, Indiana &middot; serving nationwide</div>
  </div>
</div>`
      try {
        const ctrl3 = new AbortController()
        const t3 = setTimeout(() => ctrl3.abort(), 8000)
        const mail = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
          method: 'POST',
          signal: ctrl3.signal,
          headers: { Authorization: `Bearer ${ghlKey}`, Version: '2021-07-28', 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'Email', contactId, subject: `${first}, your Signal Pulse™ card: ${domain} scored ${result.pulse}/100`, html, emailFrom: 'hello@signalflair.ai' }),
        }).finally(() => clearTimeout(t3))
        console.info('[signal-pulse] scorecard email', mail.status)
      } catch (e) { console.error('[signal-pulse] scorecard email failed', String((e && e.message) || e)) }
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify(result) }
}
