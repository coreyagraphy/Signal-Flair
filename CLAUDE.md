# CLAUDE.md — Signal Flair
# Claude Code reads this at the start of every session.
# Last updated: 2026-06-07

---

## ⚠️ DESIGN DIRECTION — READ FIRST

**Confirmed direction: Cinematic-Brutalism (cream base + dark sections).**

This is the build currently in the repo and it is correct. Do not migrate it.
Do not switch to a fully dark palette. Do not swap the fonts.

- Fonts: Fraunces (display) + Instrument Serif italic + Geist Mono (code/mono)
- Palette: #fff45f yellow · #ff5a1f orange · #00b8a9 teal · cream base · dark section accents
- The mix of cream and dark sections within the same page is intentional — keep it.

Note: conversion sections (form, proof, founder, FAQ, Case Zero) were built externally
in a dark flare-V3 palette. When integrating them, restyle to match Cinematic-Brutalism —
cream/dark mix, Fraunces/Instrument Serif, correct palette tokens. Do not import them as-is.

---

## What this project is

Signal Flair (signalflair.ai) is an AI Visibility + AEO (Agentic Engine Optimization) service
that makes local service businesses findable, readable, and recommendable by AI engines —
ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews.

It is a product of Mental Vision Corp (mentalvision.ai). Keep the two brands separate.
Signal Flair is NOT Mental Vision. Do not bleed aesthetics or copy between them.

Founder: Corey Ellis, Indianapolis, Indiana.

---

## Tech stack

- Framework: Next.js (static export, `output: 'export'`, `trailingSlash: true`)
- Hosting: Netlify (production) — dev server runs at localhost:3210
- Backend / CRM: GoHighLevel (GHL)
- Form submissions: POST to GHL inbound webhook (see form component for GHL_WEBHOOK_URL)
- Analytics: Google Analytics 4 (GA4)
- No database. No server-side rendering. Static only.

---

## Deployment rules — read before touching anything

- **Never move nameservers.** Only repoint the website A/CNAME record to Netlify.
  Moving nameservers wipes MX/SPF/DKIM/DMARC and kills the live email warmup.
- Production deploy is gated on DNS propagation. Confirm with Corey before running build.
- Build command: `npm run build` → deploys the `out/` folder to Netlify.
- Dev: `next dev --hostname 0.0.0.0 --port 3210`

---

## Brand — non-negotiable

### Palette
| Token | Hex | Usage |
|---|---|---|
| Yellow | `#fff45f` | Primary accent, highlight, key CTAs |
| Orange | `#ff5a1f` | Secondary accent, urgency, action |
| Teal | `#00b8a9` | Structural UI, links, system color |
| Cream | — | Base background (light sections) |
| Dark | — | Dark section backgrounds (mixed in with cream — intentional) |

The cream + dark mix within the same page is the Cinematic-Brutalism signature. Keep it.

**Never use violet, purple, or any variation of #7B2CBF / #8A3FFC.**
That was a bad Grok recommendation. Reject it if it appears anywhere.

### Typography
- Display: Fraunces — distinctive, editorial, heavy weights
- Accent/italic: Instrument Serif italic — used for emphasis and pull quotes
- Mono: Geist Mono — code blocks, technical tokens (llms.txt examples, scores)
- Do not use Saira Condensed or Hanken Grotesk — those are the wrong direction

### Voice
- Direct. No fluff. No corporate speak. No fake urgency.
- Premium but not pretentious. Cinematic but grounded.
- Never fabricate proof, testimonials, results, or guarantees.

---

## Pricing — do not change without Corey confirming

| Tier | Score band | Price | Type |
|---|---|---|---|
| Build the Foundation | 0–54 | $3,500 | One-time |
| Start the Rebuild | 55–74 | $1,500 | One-time |
| Stay Found System | 75–100 | $600–$1,200/mo | Recurring |
| Founding Client | 0–54 | $1,750 (first 10 only) | One-time |

Guarantee: delivery-based only. Never rankings, leads, or revenue.
Clients keep everything built, even on cancel.

---

## What has been built (session ending 2026-06-06)

### Live on site (deployed to localhost:3210, not yet production):
- Hero section with video background
- Problem section ("INVISIBLE")
- AI Visibility Score / Live Scan mockup
- Three Pillars (What Signal Flair Does)
- Six Signals table
- Four Steps process (SCAN → SCORE → FIX → STAY FOUND)
- Pricing section (three tiers, score-gated)
- Footer with LinkedIn/Instagram/YouTube placeholders

### Built and integrated (conversion layer):
- Lead-capture audit form (replaces all mailto: CTAs)
  - Fields: full name, business name, website URL, email, service (optional), phone (optional)
  - Hidden: source, page_url, utm params, timestamp, lead_tag
  - GHL_WEBHOOK_URL placeholder — MUST be wired before going live
  - Success state: animated confirmation with engine list
- Honest Proof section:
  - Before/after score card (illustrative, labeled as such)
  - Founding Client block ($3,500 anchor → $1,750, first 10)
- Founder / About section (photo slot open — needs real photo from Corey)
- FAQ section (7 questions, accordion, aria-accessible)
- Mid-page CTA strip (between proof and founder sections)

### Built, ready to integrate:
- Case Zero self-audit section (`signalflair-case-zero.html`)
  - Signal Flair's own audit: 18/100, audited 2026-06-06
  - Six signals: AI Search Presence 4 · Entity Clarity 5 · Crawl Readiness 35 ·
    Authority Content 12 · Review Signal 0 · Conversion Proof 20
  - Animated gauge, collision callout, four-node timeline
  - Replaces the illustrative before/after card

### AEO / technical (dogfood Foundation Build):
- `/llms.txt` — Signal Flair's own llms.txt deployed at root
- `robots.txt` — AI crawlers confirmed unblocked
- Organization + LocalBusiness JSON-LD schema on homepage
- Article + FAQPage JSON-LD on /resources/llms-txt/
- `sitemap.xml` updated
- `/resources/llms-txt/` — educational resource page, live and verified

---

## Pending tasks (priority order)

1. **Commit all pending changes** — `git add -A && git commit -m "feat: Foundation Build — [describe what's staged]"`
2. **Wire GHL webhook** — get inbound webhook URL from GHL, replace GHL_WEBHOOK_URL in form component
3. **GA4 analytics** — add GA4 snippet, track: form_submit, cta_click, resource_page_view, founding_client_click
4. **Integrate Case Zero section** — replace illustrative proof card with the real self-audit
5. **LinkedIn sameAs** — Corey creates page at linkedin.com/company/setup/new, then add URL to sameAs array in Organization schema
6. **Production deploy** — after DNS confirmed, run build, deploy out/ to Netlify

---

## GHL form wiring (when Corey provides the webhook URL)

Find the form component. Replace:
```js
const GHL_WEBHOOK_URL = "PASTE_YOUR_GHL_INBOUND_WEBHOOK_URL";
```
With the real URL from GHL → Automation → Workflows → Inbound Webhook trigger.

GHL workflow should:
- Create/Update Contact from payload fields
- Add tag: "AI Visibility Score Request"
- Notify Corey internally
- Start inbound nurture sequence (4-touch — not yet built)

---

## Entity disambiguation (critical — do not ignore)

Signal Flair is being confused with SignalFlare.ai (a restaurant analytics company by Extropy360).
This is the #1 entity clarity problem — score: 5/100.

Fixes in progress:
- llms.txt deployed (describes Signal Flair accurately)
- Schema sameAs array — add LinkedIn URL once Corey creates the company page
- /resources/llms-txt/ resource page adds authority content
- Founding Client case studies will add more entity signals over time

Do not confuse the two companies in any copy, schema, or content.
Signal Flair = AEO for local businesses, Indianapolis.
SignalFlare.ai = restaurant decision intelligence, Texas. Completely different.

---

## Key files reference

| File | Purpose |
|---|---|
| `CLAUDE.md` (this file) | Project context for Claude Code |
| `JARVIS_2026-06-07.md` | Tomorrow's task list |
| `signalflair-conversion-sections.html` | Four drop-in sections (form, proof, founder, FAQ) |
| `signalflair-case-zero.html` | Self-audit case study (ready to integrate) |
| `signalflair-case-zero-copy.md` | Hooks, social posts, video script, objection handlers |
| `signalflair-llms.txt` | Signal Flair's own llms.txt |
| `SIGNAL_FLAIR_IMPLEMENTATION_NOTES.md` | Palette corrections, decisions log |
| `verify-conversion.mjs` | Playwright QA script — bypasses broken preview MCP |
| `DEPLOY.md` | Deployment safety rules (do not move nameservers) |

---

## Things Corey must do himself (Claude Code cannot do these)

- Create the LinkedIn company page at linkedin.com/company/setup/new
- Create the GHL inbound webhook and provide the URL
- Drop in the founder photo (4:5 portrait) for the About section
- Confirm DNS propagation before production deploy
- Approve production deploy

---

## What NOT to do

- Do not use violet or purple anywhere
- Do not move nameservers
- Do not fabricate testimonials, case study results, or before/after numbers
- Do not change pricing without Corey confirming
- Do not bleed Signal Flair and Mental Vision Corp aesthetics together
- Do not send the site to production without DNS confirmation
- Do not replace the Case Zero score (18/100) with different numbers — it is real and documented
