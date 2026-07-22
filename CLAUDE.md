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

It is a product of Mental Vision (mentalvision.ai). Keep the two brands separate.
Signal Flair is NOT Mental Vision. Do not bleed aesthetics or copy between them.

Founder: Corey Ellis, Brownsburg, Indiana.

---

## Tech stack

- Framework: Next.js (static export, `output: 'export'`, `trailingSlash: true`)
- Hosting: Netlify (production), git-linked to `coreyagraphy/Signal-Flair` — every push to `main` auto-builds and deploys (no more manual drag-drop). Dev server runs at localhost:3210
- Backend / CRM: GoHighLevel (GHL) — also reachable via a Jarvis/neutral intake router
- Form submissions: POST to the intake webhook — `NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL` (router) → `NEXT_PUBLIC_GHL_WEBHOOK_URL` (fallback); see `SignalFlairLanding.tsx` + "Intake form wiring" below
- Analytics: Google Analytics 4 (GA4)
- No database. No server-side rendering. Static only.

---

## Deployment rules — read before touching anything

- **Never move nameservers.** Only repoint the website A/CNAME record to Netlify.
  Moving nameservers wipes MX/SPF/DKIM/DMARC and kills the live email warmup.
- **Deploy = merge to `main`.** Netlify is git-linked (site `cozy-pie-596a1f`); it runs `next build` and publishes `out/` automatically on every push to `main`. Build config lives in `netlify.toml`. No manual zip/drag-drop.
- Env vars (GA4 ID, GHL webhook) are set in Netlify → Environment variables and inlined at build time — change them there, then trigger a rebuild (any push to `main`).
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
### (Updated 2026-07-21, Corey-approved via the pricing/terminology prompt run. Supersedes the old score-gated table. NO score gates — scope is set by the free audit.)

| Tier | What it is | Price | Type |
|---|---|---|---|
| Signal Pulse™ | Free preview, 3 of 7 layers, 24h (was "Field Report" — renamed in all customer-facing copy; env vars/lead tags keep old identifiers) | $0 | Free |
| Signal Score™ Audit | Full 7-layer diagnostic + Proof OS™ action plan | Free during founding period ($500 after) | Free |
| Rebuild | Lighter-scope build | $3,000 | One-time |
| Foundation Build | Full Proof Stack™ + Smart Site™ rebuild | $5,500 ($3,500 bundled w/ 12-mo Signal Proof — save $2,000; bundle applies to Foundation only) | One-time |
| Signal Proof ⭐ | Stay Found™ monthly — Citation Capture, monthly Answer Architecture™, Proof Density Engine, quarterly re-audit, Content Payload 2 wks (1 location) | $1,800/mo | Recurring |
| Signal Dominate | Everything in Proof at full velocity + multi-location + Mental Vision content bundle + full-month Content Payload + Satellites managed | from $3,500/mo | Recurring |
| Founding Five | 35% off build + first 3 mo of Signal Proof at 50%, for a named case study. 5 seats. Replaces Founding Client/Founding Partner Pilot | — | Time-boxed |

Per-location: add a location $1,500 one-time (Satellite included) · Satellite mgmt +$250/mo on Signal Proof (included in Dominate) · extra-location Content Payload +$450/mo. Annual billing = 2 months free (monthly plans). Enterprise/Civic: from $12K build + $3K/mo, or fixed-scope 90-day builds from $15K. No price ranges on plan cards. NO CRM in any client-facing feature list (privacy-policy data-processor disclosure is the only allowed mention).

**Signal Score™ = 7 layers** (Access & Crawlability, Structured Intelligence, Entity Clarity, Answer Architecture, Trust & Proof Density, Live AI Visibility, Agent & Commerce Readiness) · 28-point diagnostic (7×4). Historical records are FROZEN at their audit-date models: Case Zero (18/100, six signals) and The Mill (35/100, seven Proof OS™ signals).

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
  - Intake webhook (`NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL` → `NEXT_PUBLIC_GHL_WEBHOOK_URL`) — set before going live
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
2. **Wire intake webhook** — ✅ LIVE (2026-07-18). `NEXT_PUBLIC_GHL_WEBHOOK_URL` is set in Netlify (production, all contexts) to the GHL Signal Pulse inbound webhook (location `dmPSx68yJZdbLgQY5Osd`); the form POSTs real leads on the next build after it was set. Form still reads `NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL` first if a router is ever added. Both unset = real error (no fake success). 10s fetch timeout guards a hung webhook. NOTE: it's a build-time (`NEXT_PUBLIC_`) var — changing it requires a rebuild (push to `main`).
3. **GA4 analytics** — ✅ LIVE (2026-07-18). `NEXT_PUBLIC_GA_ID` set in Netlify (`G-5VZR713RKS`, all contexts). gtag loader = `src/components/Analytics.tsx` (rendered in layout); helper = `src/lib/analytics.ts` (`track()`). Events wired: `form_submit` (lead form success), `cta_click` (every `#cta` CTA, with label+section), `founding_client_click` (founding apply button). Auto `page_view` covers every page. NOTE: build-time (`NEXT_PUBLIC_`) var — changing it requires a rebuild (push to `main`).
4. **Integrate Case Zero section** — replace illustrative proof card with the real self-audit
5. **LinkedIn sameAs** — Corey creates page at linkedin.com/company/setup/new, then add URL to sameAs array in Organization schema
6. **Production deploy** — after DNS confirmed, run build, deploy out/ to Netlify

---

## Intake form wiring (GHL/Jarvis intake router)

The form resolves its destination in this order (`SignalFlairLanding.tsx`):
`NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL` → `NEXT_PUBLIC_GHL_WEBHOOK_URL` → `FIELD_REPORT_WEBHOOK_OVERRIDE`.

**Two routing options (no code edit — just env vars in Netlify → Environment variables, or `.env.local` for dev):**
- **Straight to GHL:** set `NEXT_PUBLIC_GHL_WEBHOOK_URL` to the URL from GHL → Automation → Workflows →
  Inbound Webhook trigger. This is the safe default — and stays the automatic fallback.
- **Through a router (Jarvis / neutral intake):** set `NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL` to the router
  endpoint. It is tried **first**; if unset or it errors, GHL catches the lead — so you never drop one.

The form picks the value up automatically (build-time inlined for static export — redeploy after changing). See `.env.example`.

**Quick local test alternative:** paste a URL into `FIELD_REPORT_WEBHOOK_OVERRIDE` in the lead-form block
of `SignalFlairLanding.tsx` (env vars take precedence if set).

Both env vars unset (and no override) = submission fails with a real error and `hello@signalflair.ai` fallback — no fake success.

**Email roles (Phase 10H):** `hello@signalflair.ai` = inside GHL (Field Report, intake, automations, client follow-up, GHL-based outreach, GHL replies, form fallback). `outreach@trysignalflair.com` = outside/non-GHL outreach only (manual prospecting, experiments outside GHL) — not used on the public website. Avoid `connect@signalflair.ai` and `create@mentalvision.ai` unless documented.

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
- Do not bleed Signal Flair and Mental Vision aesthetics together
- Do not send the site to production without DNS confirmation
- Do not replace the Case Zero score (18/100) with different numbers — it is real and documented
