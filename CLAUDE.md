# CLAUDE.md — Signal Flair
# Claude Code reads this at the start of every session.
# Last updated: 2026-06-07 — Cinematic-Brutalism confirmed canonical (per SIGNAL_FLAIR_BRIEFING_COMPLETE.md)

---

## ⚠️ DESIGN DIRECTION — READ FIRST

**Confirmed direction: Cinematic-Brutalism. FINAL — do not change, do not migrate.**

Source of truth: `C:\Users\corey\Downloads\SIGNAL_FLAIR_BRIEFING_COMPLETE.md` (§2),
confirmed from live build screenshots. The cream + dark section mix is intentional — keep
both; do NOT flatten to all-dark or all-light.

- **Palette (live build):** yellow `#fff45f` · orange `#ff5a1f` · teal `#00b8a9` · cream
  `#f0ebe0` (approx) · near-black `#0a0a0a` · pink/magenta for AI-view warning badges. Full table below.
- **Fonts:** Fraunces (display) + Instrument Serif italic (accents) + Geist Mono (mono/diagnostic).
  Do NOT use Inter, Saira Condensed, Hanken Grotesk, or any condensed grotesque.
- **A new logo is coming** — hold all brand-level visual decisions until it lands.

⛔ **DEAD for the website — never use:** Flare-V3 dark tokens `#E5FF00` / `#E85D04` /
`#0D9488` / `#0E1413`. (An earlier in-chat "switch to Flare-V3 dark" call was REVERSED by Corey
in favor of this briefing — Cinematic-Brutalism stands.) Never import dark flare-V3 HTML sections
as-is; reskin to Cinematic-Brutalism first.

---

## What this project is

Signal Flair (signalflair.ai) is an AI Visibility + AEO (Agentic Engine Optimization) service
that makes local service businesses findable, readable, and recommendable by AI engines —
ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews.

It is a product of Mental Vision Corp (mentalvision.ai). Keep the two brands separate.
Signal Flair is NOT Mental Vision. Do not bleed aesthetics or copy between them.

Founder: Corey Ellis, Brownsburg, Indiana.

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

### Palette — Cinematic-Brutalism (live build; SoT = SIGNAL_FLAIR_BRIEFING_COMPLETE.md §2)
| Token | Hex | Usage |
|---|---|---|
| Yellow | `#fff45f` | Primary accent — score gauge, AI engine name highlights, "RIGHT." |
| Orange | `#ff5a1f` | CTAs, italic accents ("right now?", "Weak signal."), logo box, service tags |
| Teal | `#00b8a9` | "Found.", human-view badges, monitoring tags |
| Cream | `#f0ebe0` (approx) | Light section backgrounds (problem/diagnostic) |
| Near-black | `#0a0a0a` | Dark section backgrounds (hero, services, "THREE THINGS") |
| Pink/magenta | — | AI-view warning badges (BLOCKED, MISSING, ABSENT, 0 FOUND) |

The cream + dark mix within the same page is the Cinematic-Brutalism signature. Keep it.

**DEAD for the website — never use:** Flare-V3 dark tokens `#E5FF00` / `#E85D04` / `#0D9488` / `#0E1413`.

**Never use violet, purple, or any variation of #7B2CBF / #8A3FFC.**
That was a bad Grok recommendation. Reject it if it appears anywhere.

### Typography
- Display: Fraunces — distinctive, editorial, heavy weights
- Accent/italic: Instrument Serif italic — emphasis words ("right now?", "Weak signal.", "Found.", "RIGHT.")
- Mono/diagnostic: Geist Mono — diagnostic panels, technical copy, body in dark sections
- Do NOT use: Inter, Saira Condensed, Hanken Grotesk, or any condensed grotesque

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
2. **Wire GHL webhook** — ✅ PREPPED (2026-06-07). Form reads the URL from `NEXT_PUBLIC_GHL_WEBHOOK_URL`. **GO LIVE: set that env var in Netlify (or `.env.local`) — no code edit.** Empty = demo mode preserved. 10s fetch timeout added so a hung webhook can't freeze the submit button.
3. **GA4 analytics** — ✅ SCAFFOLDED (2026-06-07, disabled until ID set). gtag loader = `src/components/Analytics.tsx` (rendered in layout, returns null with no ID); helper = `src/lib/analytics.ts` (`track()`, safe no-op until live). Events wired: `form_submit` (lead form success), `cta_click` (every `#cta` CTA, with label+section), `founding_client_click` (founding apply button). Auto `page_view` covers the resource page. **GO LIVE: set `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` in Netlify env (or `.env.local` for dev) — see `.env.example`.** No code change needed.
4. **Integrate Case Zero section** — replace illustrative proof card with the real self-audit
5. **LinkedIn sameAs** — Corey creates page at linkedin.com/company/setup/new, then add URL to sameAs array in Organization schema
6. **Production deploy** — after DNS confirmed, run build, deploy out/ to Netlify

---

## GHL form wiring (when Corey provides the webhook URL)

**Preferred (no code edit):** set `NEXT_PUBLIC_GHL_WEBHOOK_URL` in Netlify → Environment variables
(or `.env.local` for dev) to the URL from GHL → Automation → Workflows → Inbound Webhook trigger,
then redeploy. The form picks it up automatically. See `.env.example`.

**Quick local test alternative:** paste the URL into `GHL_WEBHOOK_OVERRIDE` in the lead-form block
of `SignalFlairLanding.tsx` (env var takes precedence if both are set).

Empty (both unset) = DEMO MODE preserved (validates, shows success, console.logs payload, no push).

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
Signal Flair = AEO for local businesses, Brownsburg, Indiana.
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
