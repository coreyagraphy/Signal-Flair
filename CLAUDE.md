# CLAUDE.md — Signal Flair
# Claude Code reads this at the start of every session.
# Last updated: 2026-08-03 — Case Zero 18 → 73 → 91 published; Netlify Forms is the primary lead channel.
# Design direction (Cinematic-Brutalism) unchanged and still canonical.

---

## ⚠️ DESIGN DIRECTION — READ FIRST

**Confirmed direction: Cinematic-Brutalism. FINAL — do not change, do not migrate.**

Source of truth: `C:\Users\corey\Downloads\SIGNAL_FLAIR_BRIEFING_COMPLETE.md` (§2),
confirmed from live build screenshots. The cream + dark section mix is intentional — keep
both; do NOT flatten to all-dark or all-light.

- **Palette (live build):** yellow `#fff45f` · orange `#ff5a1f` · teal `#00b8a9` · cream
  `#f4eadb` · near-black `#0a0a0a` · pink/magenta for AI-view warning badges. Full table below.
- **Fonts:** Fraunces (display) + Instrument Serif italic (accents) + Geist Mono (mono/diagnostic).
  Do NOT use Inter, Saira Condensed, Hanken Grotesk, or any condensed grotesque.
- **A new logo is coming** — hold all brand-level visual decisions until it lands.

⛔ **DEAD for the website — never use:** Flare-V3 dark tokens `#E5FF00` / `#E85D04` /
`#0D9488` / `#0E1413`. (An earlier in-chat "switch to Flare-V3 dark" call was REVERSED by Corey
in favor of this briefing — Cinematic-Brutalism stands.) Never import dark flare-V3 HTML sections
as-is; reskin to Cinematic-Brutalism first.

---

## What this project is

Signal Flair (signalflair.ai) is an AI Visibility + AEO (Answer Engine Optimization) service
that makes local service businesses findable, readable, and recommendable by AI engines —
ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews.

It is a product of Mental Vision (mentalvision.ai). Keep the two brands separate.
Signal Flair is NOT Mental Vision. Do not bleed aesthetics or copy between them.

Founder: Corey Ellis. Public-facing city = Indianapolis, Indiana (Corey-directed 2026-07-22; all client-facing copy, schema, NAP, and llms.txt use Indianapolis — do not reintroduce Brownsburg).

---

## Tech stack

- Framework: Next.js (static export, `output: 'export'`, `trailingSlash: true`)
- Hosting: Netlify (production), git-linked to `coreyagraphy/Signal-Flair` — every push to `main` auto-builds and deploys (no more manual drag-drop). Dev server runs at localhost:3210
- Lead delivery: **Netlify Forms** (primary, no env var needed) → email to `outreach@trysignalflair.com`. GoHighLevel is a parallel secondary and **is being cancelled** — see "Intake form wiring" below
- Serverless: Netlify Functions (`netlify/functions/`) — `signal-pulse` (deterministic scan) and `lead-intake` (GHL Contacts API)
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
| Cream | `#f4eadb` (`--cream` / `--paper`) | Light section backgrounds (problem/diagnostic) |
| Near-black | `#0b0a09` (`--ink`) | Dark section backgrounds (hero, services, "THREE THINGS") |
| Pink/magenta | `#ff1765` (`--pink` / `--red`) | AI-view warning badges (BLOCKED, MISSING, ABSENT, 0 FOUND) · the Case Zero 18 baseline |

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

## 🔒 TERMINOLOGY — FINAL & LOCKED (Signal_Flair_Final_Terminology_Brief.md, 2026-07-31)
Supersedes all earlier terminology recommendations. Do not change without Corey's explicit authorization.

**Category:** AI Proof Infrastructure™ · **Core line:** "AI found your business. It still might have you completely wrong."
**Positioning:** Signal Flair makes your business findable, understandable, verifiable, and actionable across AI systems.

| Owned term | Plain-language meaning (always pair them) |
|---|---|
| AI Proof Infrastructure™ | The structured evidence layer that helps AI systems accurately understand and trust a business |
| Signal Score™ | A diagnostic showing how clearly and confidently AI systems can understand the business |
| The Proof Stack™ | Verified entity facts, proof assets, structured data, and technical signals in one defensible foundation |
| Stay Found™ | Ongoing monitoring, verification, and maintenance as business facts and AI systems change |
| Answer Engine Optimization | Improves how answer engines discover, interpret, and support claims about the business |
| AI Agent Readiness | Prepares current, **permissioned** business information and actions for agent-assisted experiences |
| Machine-Readable Proof | Evidence organized so machines can retrieve and interpret it |
| Entity Clarity | A consistent understanding of who the business is and how its facts connect |
| AI Visibility | Whether and how accurately a business appears across AI-driven discovery and answers |

**AEO = Answer Engine Optimization.** Define it on first use on every page. AI Agent Readiness is a *separate, more advanced* capability — never merge them.

⛔ **REJECTED — never use:** Agentic Engine Optimization · Agentic AEO · Omni-Signal Protocol · Recommendation Media Structuring · Interest Graph as a Signal Flair offer · "SEO is dead/dying" · claims that a Signal Score or structured entities cause virality or feed distribution · guaranteed rankings/citations/recommendations/traffic/leads/revenue · control over any third-party system · autonomous agent actions without explicit permission and verifiable boundaries.

**SEO framing (required):** "SEO helps businesses rank. AI visibility determines whether machines can understand, trust, and use their information. Signal Flair builds the missing proof layer." SEO agencies = partners, never outdated opponents.

**Media boundary (only defensible bridge):** "Signal Flair helps machines correctly identify, understand, and attribute the media. Mental Vision creates media designed to earn human attention." Signal Flair never becomes a social-content, creative-production, or algorithm-growth agency.

**Differentiator:** "We do not promise to manipulate algorithms. We build and maintain the verified evidence AI systems need to understand a business accurately."

---

### Canonical CTAs — Corey-approved 2026-07-31. Do not replace.
| Slot | Label |
|---|---|
| Nav / primary conversion | **▸ Get Your Signal Score™** |
| Lead-form submit | **▸ Run My Signal** |
| Secondary nav (sub-pages) | ▸ Free Signal Pulse™ |
| Enterprise · Civic card | Pull Up → |
| Agency white-label card | Put Us Behind Your Brand → |
| Founding Five | ▸ Claim My Seat |

The July 31 Terminology Upgrade Brief recommended "See Your Signal Score" and
"Build Your Proof Stack." Corey **declined** the swap: the established labels stay.
"Build Your Proof Stack" may appear as supporting language or a future *secondary*
CTA, but must never displace the primary conversion path above. Never use
"Book a call," "Learn more," "Contact us," or "Let's" in a CTA.

---

## Site map — what is actually built (verified 2026-08-03)

20 static routes. Every public page carries nav + footer + a closing CTA.

| Route | Purpose | Indexed |
|---|---|---|
| `/` | Homepage — hero, diagnosis, one-minute explainer, 7-layer protocol, Mill audit, Case Zero proof, pricing w/ billing toggle, Founding Five, lead form | ✅ |
| `/pulse/` | Signal Pulse™ landing — instant deterministic score via Netlify Function | ✅ |
| `/how-it-works/` · `/about/` · `/faq/` · `/privacy/` | Core sub-pages | ✅ |
| `/proof/` | Signal Proof Page™ hub — Case Zero 18 → 73 → 91 | ✅ |
| `/proof/proof/` · `/proof/services/` · `/proof/trust/` · `/proof/changelog/` | Record detail | ✅ |
| `/proof/partner/` | Internal operator route map — NOT client-facing | ❌ noindex |
| `/case-studies/three-engines-three-stories/` | The Mill audit (35/100, published w/ permission) | ✅ |
| `/case-studies/restor-team/` | RESTOR Team snapshot | ✅ |
| `/resources/llms-txt/` · `/resources/how-ai-engines-verify-a-business/` | Authority articles | ✅ |
| `/scorecard/` | Per-lead hosted scorecard, driven by query params | ❌ noindex |
| `/404` | Branded not-found | ❌ noindex |

**Conversion layer:** lead form (`#lead-form`, Netlify Forms primary — see intake wiring
above), Signal Pulse form on `/pulse`, GA4 events (`form_submit`, `cta_click`,
`billing_toggle`, `founding_client_click`), monthly/annual pricing toggle that writes
`billing_preference` into the payload.

**Machine-readable surface (dogfooding the Foundation Build):** `/llms.txt`, `/proof.json`,
`/.well-known/signalflair.json` + `/signalflair-discovery.json`, `/robots.txt` (explicit-open
to every AI agent), `/sitemap.xml`, and JSON-LD on every page — Organization, Person, WebSite,
Service, OfferCatalog, FAQPage, VideoObject, Article, BreadcrumbList.

**Case Zero is integrated and real:** the homepage proof section is the actual self-audit
(18 → 73 → 91), not an illustrative card. See the proof-record rules below.

---

## Case Zero — the published record (do not drift)

Three dated readings. The composite at each is the **plain average of that reading's layer
scores** — the July 5 layers sum to 436, and 436/6 rounds to the published 73. That is why
layer detail is always attached to the reading it was computed from.

| Reading | Score | Date | Model |
|---|---|---|---|
| Baseline | 18/100 | 2026-06-06 | six-signal (frozen at audit-date model) |
| Re-audit | 73/100 | 2026-07-05 | six-layer |
| Current | 91/100 | 2026-08-03 | six-layer |

- July 5 layers: Access & Crawlability 100 · Structured Intelligence 100 · Answer
  Architecture 77 · Entity Clarity 63 · Live AI Visibility 53 · Trust & Proof Density 43.
- Aug 3 machine-verified layers (re-run `netlify/functions/signal-pulse.mjs` against the
  built site to reproduce): Access & Crawlability 100 · Structured Intelligence 100 ·
  Answer Architecture 90.
- **Never render a six-bar chart under the 91.** The remaining three layers need live engine
  tests and third-party verification; estimating them would not reconcile with the average,
  and any reader can check the arithmetic.
- Next scheduled re-verification: **2026-08-17** — published on `/proof/changelog/` and in
  `proof.json`. Do not move that date in one place only.

---

## Pending tasks (priority order)

1. **Verify the Crunchbase `sameAs`** — see task 5. Everything else on this list is done or blocked on Corey.
2. **Wire intake webhook** — ✅ LIVE (2026-07-18). `NEXT_PUBLIC_GHL_WEBHOOK_URL` is set in Netlify (production, all contexts) to the GHL Signal Pulse inbound webhook (location `dmPSx68yJZdbLgQY5Osd`); the form POSTs real leads on the next build after it was set. Form still reads `NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL` first if a router is ever added. Both unset = real error (no fake success). 10s fetch timeout guards a hung webhook. NOTE: it's a build-time (`NEXT_PUBLIC_`) var — changing it requires a rebuild (push to `main`).
3. **GA4 analytics** — ✅ LIVE (2026-07-18). `NEXT_PUBLIC_GA_ID` set in Netlify (`G-5VZR713RKS`, all contexts). gtag loader = `src/components/Analytics.tsx` (rendered in layout); helper = `src/lib/analytics.ts` (`track()`). Events wired: `form_submit` (lead form success), `cta_click` (every `#cta` CTA, with label+section), `founding_client_click` (founding apply button). Auto `page_view` covers every page. NOTE: build-time (`NEXT_PUBLIC_`) var — changing it requires a rebuild (push to `main`).
4. **Integrate Case Zero section** — ✅ DONE (2026-08-03). The homepage proof section is the real self-audit (18 → 73 → 91); the illustrative card is gone. See "Case Zero — the published record" above.
5. **LinkedIn sameAs** — ✅ DONE (2026-08-03). Page is live at `linkedin.com/company/signal-flair-ai` (Corey-confirmed). Present in the site-wide Organization `sameAs` (`layout.tsx`), the footer, `/proof/trust`, `llms.txt`, `proof.json`, and now the `record.profiles` block in both discovery manifests. **Crunchbase is also confirmed** (2026-08-03) — `crunchbase.com/organization/signal-flair` is a real, claimed, "verified with this company" profile. It stays in `sameAs`. Site schema `foundingDate` tightened from `'2026'` to `'2026-06-07'` to exactly match the profile's founded date, so the two sources corroborate rather than merely not-contradict. Every `sameAs` entry is now verified.
6. **Production deploy** — after DNS confirmed, run build, deploy out/ to Netlify

---

## Intake form wiring — Netlify Forms primary, GHL secondary (2026-08-03)

**GHL is being cancelled. Netlify Forms is now the lead channel that must work.**

Both forms fire **both** channels in parallel and report success if **either** one accepts:

| Channel | Where | Destination |
|---|---|---|
| **Primary — Netlify Forms** | `data-netlify` markup on `#lead-form` (name `field-report`) and the /pulse form (name `signal-pulse`) | Netlify → Forms → Notifications → email **`outreach@trysignalflair.com`** |
| Secondary — GHL | `NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL` → `NEXT_PUBLIC_GHL_WEBHOOK_URL` → `FIELD_REPORT_WEBHOOK_OVERRIDE` | GHL sub-account `dmPSx68yJZdbLgQY5Osd` |

Netlify Forms needs no env var — Netlify parses the form out of the static export at deploy
time. Both forms carry a `bot-field` honeypot. **After the first deploy that registers a new
form, the email notification must be (re)confirmed in Netlify → Forms → Notifications.**

**When GHL is cancelled:** unset `NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL`,
`NEXT_PUBLIC_GHL_WEBHOOK_URL` and `GHL_API_KEY` in Netlify, then redeploy. Nothing else
changes — the forms keep delivering to `outreach@trysignalflair.com`.

**GHL secondary path (while still active):** point `NEXT_PUBLIC_FIELD_REPORT_WEBHOOK_URL` at
`/.netlify/functions/lead-intake`, which upserts via the official **GHL Contacts API**
(needs server-side `GHL_API_KEY`). Do **not** go back to the GHL *inbound webhook* — that
webhook was found orphaned (its workflow had been deleted); it answered 200 forever and
executed nothing, so leads sent to it vanished silently.

**Payload fields:** form fields + `submitted_at`, `form_type`/`request_type` (= `field_report`),
UTM params, `lead_tag`, and **`billing_preference`** — `'annual'` / `'monthly'` if the visitor
used the pricing toggle, `'not_selected'` if they never touched it (never a fake default).

**Email roles:** `outreach@trysignalflair.com` = **lead notifications from the website forms**
(post-GHL; supersedes the Phase 10H "not used on the public website" note) plus non-GHL
outreach. `hello@signalflair.ai` = the address shown in on-page fallback copy and used by
GHL-side automations while GHL is live. Avoid `connect@signalflair.ai` and
`create@mentalvision.ai` unless documented.

---

## 📍 /pulse — the Signal Pulse™ landing page (Corey's landing page)

**This page has been declared non-existent twice and lost both times. It is real, it is live,
and it is documented here so that never happens again.** Before touching or doubting it, read
this section and the branch-hygiene rule below.

**Route:** `/pulse/` (indexed, in `sitemap.xml`). Old `/signal-pulse` and `/signal-pulse/*`
301 → `/pulse/` via `netlify.toml`. Do **not** add a redirect on `/pulse` itself — a
`force = true` redirect there once shadowed the real page.

**What it does:** a visitor enters name / website / email and gets an instant, deterministic
0–100 Signal Pulse™ in seconds — a live preview, not the full Signal Score™ Audit. It is the
top-of-funnel free tool and the only page that scores a prospect on the spot.

### Files (all real — verified 2026-08-03)
| File | Lines | Role |
|---|---|---|
| `src/app/pulse/page.tsx` | 250 | The page — hero, `CHECKS`, `LAYERS`, Case Zero band, JSON-LD |
| `src/components/SignalPulseForm.tsx` | 386 | The form + scan animation + result gauge. Phases: `idle → scanning → result → sent` |
| `src/components/SignalPulseHeroVideo.tsx` | 63 | Hero video |
| `src/components/BrandBgVideo.tsx` | 64 | Background band video |
| `src/lib/signal-tiers.ts` | 16 | Tier names/colors/verdicts — shared with `/scorecard`, single source of truth |
| `netlify/functions/signal-pulse.mjs` | 256 | Server-side deterministic scan (no CORS limit) |
| `src/app/globals.css` | 213 `.ssc-*` rules | Self-contained dark namespace, radar/scanline motifs |
| `public/video/signal-pulse-{hero,band}.mp4` + `-poster.jpg` / `-band-poster.jpg` | — | Media |

### Scoring — deterministic, reproducible, four public buckets
`signal-pulse.mjs` fetches the prospect's homepage, `robots.txt` and sitemap server-side, then
scores four buckets shown to the visitor:

| Bucket | Weight | Question asked |
|---|---|---|
| Access | 0.30 | Can AI systems crawl the site? |
| Structure | 0.30 | Can AI understand the business? |
| Trust | 0.20 | Can AI verify the claims? |
| Answers | 0.20 | Can AI answer *with* the business? |

`pulse = access*0.3 + structure*0.3 + trust*0.2 + answers*0.2`, clamped 0–100.

- This is the **preview only**. The full Signal Score™ is 7 layers (listed in `LAYERS` on the
  page) and is a human/Proof OS follow-up — never computed here, so nothing is overstated.
- SSRF-guarded (refuses localhost/private ranges) and flags `spaLike` / `lowConfidence` rather
  than reporting a misleadingly low score for a JS-rendered site.
- **This same function is how Case Zero layers get re-measured.** Point it at the built site to
  reproduce the Aug 3 numbers — that is what makes the 91 reproducible instead of asserted.

### Lead capture
Form name **`signal-pulse`** (registered in Netlify Forms, `bot-field` honeypot). Fires Netlify
Forms **and** the function in parallel — see the intake-wiring section. Also handles the
homepage → /pulse handoff: the homepage form stashes the lead in `sessionStorage`, and /pulse
auto-runs that scan instead of re-asking.

---

## 🚨 Branch hygiene — do not strand work again

Work has been lost twice by assuming a branch didn't exist. **`git branch -a` only lists refs
this clone has already fetched.** Before concluding a page, file, or feature "was never built":

```bash
git ls-remote --heads origin          # the real list of remote branches
git fetch origin && git log --oneline origin/main..origin/<branch>   # what's stranded
```

Known history: `/pulse` was declared non-existent twice while it sat on
`feature/signal-scan-immersive-landing-page`, along with ~50 other commits. If a remote branch
is ahead of `main`, land it or record why it wasn't — never leave it unexamined.

---

## Entity disambiguation (critical — do not ignore)

Signal Flair is being confused with SignalFlare.ai (a restaurant analytics company by Extropy360).
This is the #1 entity clarity problem. Entity Clarity scored 5/100 at the June 6 baseline and 63/100 at the July 5 re-audit — improving, still the weakest area alongside Trust & Proof Density.

Fixes in progress:
- llms.txt deployed (describes Signal Flair accurately)
- Schema `sameAs` — ✅ LinkedIn company page live and wired into every surface (2026-08-03). Crunchbase entry still unverified, see pending task 5.
- /resources/llms-txt/ resource page adds authority content
- Founding Client case studies will add more entity signals over time

Do not confuse the two companies in any copy, schema, or content.
Signal Flair = AEO for local businesses, Indianapolis, Indiana.
SignalFlare.ai = restaurant decision intelligence, Texas. Completely different.

---

## Key files reference (verified to exist 2026-08-03)

| File | Purpose |
|---|---|
| `CLAUDE.md` (this file) | Project context for Claude Code |
| `src/components/SignalFlairLanding.tsx` | The homepage — every section, the lead form, the 7-layer protocol data |
| `src/app/globals.css` | All styles. No CSS modules, no Tailwind |
| `src/app/layout.tsx` | Site-wide JSON-LD (Organization, Person, WebSite, Service, OfferCatalog) |
| `src/app/proof/page.tsx` | Signal Proof Page™ hub — the Case Zero trajectory lives here |
| `src/app/proof/changelog/page.tsx` | The dated public record. Every re-audit gets an entry |
| `src/app/pulse/page.tsx` · `src/components/SignalPulseForm.tsx` | The **/pulse landing page** — see its own section above before doubting it exists |
| `src/lib/signal-tiers.ts` | Single source of truth for tier names/colors/verdicts |
| `netlify/functions/signal-pulse.mjs` | Deterministic AI-readiness scan. Also how Case Zero layers are re-measured |
| `netlify/functions/lead-intake.mjs` | GHL Contacts API upsert (secondary channel; GHL being cancelled) |
| `public/llms.txt` · `public/proof.json` | Machine-readable proof surface — keep in sync with the pages |
| `public/.well-known/signalflair.json` | Discovery manifest (+ non-dotted mirror `signalflair-discovery.json`) |
| `netlify.toml` | Build config, redirects, cache headers |
| `DEPLOY.md` | Deployment safety rules (do not move nameservers) |
| `docs/entity-visibility/` | Entity audit + 15 platform action kits (internal) |
| `ANONYMIZED_BASELINE_CASE_INTERNAL.md` | The Mill permission status — what is published vs held back |

⚠️ The previous version of this table listed eight files, seven of which did not exist
(`JARVIS_2026-06-07.md`, `signalflair-conversion-sections.html`, `signalflair-case-zero.html`,
`signalflair-case-zero-copy.md`, `signalflair-llms.txt`, `SIGNAL_FLAIR_IMPLEMENTATION_NOTES.md`,
`verify-conversion.mjs`). If you add a row here, confirm the path first.

---

## Things Corey must do himself (Claude Code cannot do these)

- ~~Create the LinkedIn company page~~ ✅ done — linkedin.com/company/signal-flair-ai
- ~~Confirm the Crunchbase profile~~ ✅ done — real, claimed, verified. Profile hygiene done too (2026-08-03): the off-positioning `Marketing Automation` tag was swapped for `AI infrastructure`, which is the closest match in Crunchbase's fixed taxonomy to the site's own `AI Proof Infrastructure` category (`proof.json` → `business.category`, `llms.txt` → Industry). Crunchbase is now corroborating, not contradicting
- ~~Create the GHL inbound webhook~~ — obsolete. The old inbound webhook was orphaned (workflow deleted, answered 200, executed nothing). Leads now go to Netlify Forms; GHL is being cancelled
- ~~Drop in the founder photo~~ ✅ done — `/founder.jpg` (1024px, 101KB) on the homepage; `/corey-ellis-founder.png` still backs the schema `image`
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
- Do not alter any Case Zero reading (18 · 73 · 91) or its dates without Corey's explicit say-so — each is real and documented. Never publish a layer breakdown that does not average to the score above it
