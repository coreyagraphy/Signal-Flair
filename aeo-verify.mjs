/*
 * aeo-verify.mjs — re-audit the Signal Flair AEO surface in the RAW/RENDERED HTML.
 *
 * Why this exists: a cold audit that scans the dev-server shell (or runs JS-blind)
 * mis-reads this site as "no schema / no meta" — the SPA schema-audit false positive.
 * Signal Flair is a Next.js STATIC EXPORT: the JSON-LD, meta, robots, and sitemap are
 * baked into the raw HTML at build time, so an AI crawler sees them with NO JavaScript.
 * This script proves that, the way an answer engine actually reads the page.
 *
 * No new deps — node:fs + global fetch only.
 *
 * Usage:
 *   npm run build && node aeo-verify.mjs           # audit ./out (production export)
 *   node aeo-verify.mjs https://signalflair.ai     # audit a live origin (AI-bot UA)
 */

import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const arg = process.argv[2]
const AI_UA = 'Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)'

// route → the static-export file under ./out, and the checks its HTML must pass.
const ROUTES = [
  { path: '/', file: 'index.html', must: ['application/ld+json', '"@type":["Organization","ProfessionalService"]', 'FAQPage', '<meta name="description"'] },
  { path: '/faq/', file: 'faq/index.html', must: ['application/ld+json', 'FAQPage', 'What is a Signal Score', '<meta name="description"'] },
  { path: '/about/', file: 'about/index.html', must: ['application/ld+json', 'Corey Ellis', 'Mental Vision', '<meta name="description"'] },
  { path: '/how-it-works/', file: 'how-it-works/index.html', must: ['application/ld+json', 'HowTo', 'Stay Found', '<meta name="description"'] },
  { path: '/proof/', file: 'proof/index.html', must: ['application/ld+json', 'FAQPage', '18', '<meta name="description"'] },
]

// static assets (read from ./public when auditing the build; from the origin when live).
const ROBOTS_MUST = ['OAI-SearchBot', 'GPTBot', 'PerplexityBot', 'Bingbot', 'Googlebot', 'Sitemap:']
const SITEMAP_MUST = ['/faq/', '/about/', '/how-it-works/', '/proof/', '/resources/llms-txt/']

let pass = 0
let fail = 0
const note = (ok, label) => { if (ok) { pass++; console.log(`  PASS ${label}`) } else { fail++; console.log(`  FAIL ${label}`) } }

async function getLive(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': AI_UA } })
    return { status: res.status, body: await res.text() }
  } catch (e) {
    return { status: 0, body: '' }
  }
}

async function getFile(rel) {
  const p = join(process.cwd(), 'out', rel)
  if (!existsSync(p)) return { status: 404, body: '' }
  return { status: 200, body: await readFile(p, 'utf8').catch(() => '') }
}

async function main() {
  const live = !!arg
  console.log(live ? `\nAEO audit (live, AI-bot UA): ${arg}\n` : '\nAEO audit (static export ./out — run `npm run build` first)\n')

  if (!live && !existsSync(join(process.cwd(), 'out'))) {
    console.log('  ./out not found. Run `npm run build` first, or pass a live origin: node aeo-verify.mjs https://signalflair.ai')
    process.exit(2)
  }

  for (const r of ROUTES) {
    const { status, body } = live ? await getLive(arg.replace(/\/$/, '') + r.path) : await getFile(r.file)
    note(status === 200, `${r.path} reachable (HTTP ${status})`)
    for (const m of r.must) note(body.includes(m), `${r.path} contains ${m}`)
  }

  // robots.txt
  const robots = live ? await getLive(arg.replace(/\/$/, '') + '/robots.txt') : await getFile('robots.txt').catch(() => ({ body: '' }))
  const robotsBody = robots.body || (existsSync(join(process.cwd(), 'public', 'robots.txt')) ? await readFile(join(process.cwd(), 'public', 'robots.txt'), 'utf8') : '')
  for (const m of ROBOTS_MUST) note(robotsBody.includes(m), `robots.txt allows / declares ${m}`)

  // sitemap.xml
  const sm = live ? await getLive(arg.replace(/\/$/, '') + '/sitemap.xml') : await getFile('sitemap.xml').catch(() => ({ body: '' }))
  const smBody = sm.body || (existsSync(join(process.cwd(), 'public', 'sitemap.xml')) ? await readFile(join(process.cwd(), 'public', 'sitemap.xml'), 'utf8') : '')
  for (const m of SITEMAP_MUST) note(smBody.includes(m), `sitemap.xml lists ${m}`)

  console.log('')
  console.log(fail === 0 ? `PASS — ${pass} checks passed, 0 failed` : `FAIL — ${pass} passed, ${fail} failed`)
  process.exit(fail === 0 ? 0 : 1)
}

main()
