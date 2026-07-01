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

  // Forward the lead + computed pulse to GHL (best effort; never blocks the response result).
  const hook =
    (process.env.SIGNAL_PULSE_WEBHOOK_URL || '').trim() ||
    (process.env.NEXT_PUBLIC_SIGNAL_PULSE_WEBHOOK_URL || '').trim() ||
    (process.env.NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL || '').trim() ||
    (process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL || '').trim()
  if (hook && (body.email || body.website_url)) {
    try {
      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort(), 6000)
      await fetch(hook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          ...body,
          source: body.source || 'signal-pulse',
          lead_tag: 'Signal Pulse Request',
          preview_type: 'signal-pulse',
          signal_pulse_score: result.ok ? result.pulse : '',
          signal_pulse_buckets: result.ok ? (result.buckets || []).map((b) => `${b.label}:${b.score}`).join(', ') : '',
          signal_pulse_spa: result.spaLike ? 'yes' : 'no',
          submitted_at: new Date().toISOString(),
        }),
      }).finally(() => clearTimeout(t))
    } catch { /* best effort */ }
  }

  return { statusCode: 200, headers, body: JSON.stringify(result) }
}
