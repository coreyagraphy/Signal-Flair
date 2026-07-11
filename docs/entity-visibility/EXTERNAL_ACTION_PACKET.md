# External Action Packet — paste-ready

Every action below needs your identity/accounts. Copy is final unless marked [fact-pending]. Email-identity rule applied throughout: `hello@signalflair.ai` = public/inbound · `outreach@trysignalflair.com` = manual outbound pitches · never `connect@`/deprecated addresses.

---

## §1 Deployments + indexing

### §1.1 Deploy Signal Flair (10 min)
Repo is committed and build-verified at `d38b979` on `feature/signal-scan-immersive-landing-page`.
1. `cd Desktop\signal-flair` → confirm `.env.local` has the webhook + GA vars (build inlines them; missing vars ship an inert site — DEPLOY.md rule).
2. `npm run ship` (build + Netlify CLI deploy with functions — drag-drop alone would drop the /pulse function).
3. Never touch nameservers (standing DNS safety rule).

### §1.2 Deploy Mental Vision (10 min)
Committed at `0ef5e3c` on `main`. From `Desktop\mental-vision-v2`: `npm run build` then `npx netlify-cli deploy --prod` (site 8c922dde-ac97-403e-aac7-1092d33c7f6b is already linked via .netlify/state.json).

### §1.3 Google Search Console (20 min) — highest-leverage single action
1. https://search.google.com/search-console → Add property → **Domain** type: `signalflair.ai`. Verify via DNS TXT at IONOS (adding a TXT record is safe — it is not a nameserver change). Repeat for `mentalvision.ai`.
2. Sitemaps → submit `https://signalflair.ai/sitemap.xml` and `https://mentalvision.ai/sitemap.xml`.
3. URL Inspection → **Request indexing** for: `https://signalflair.ai/` · `/about/` · `/faq/` · `/how-it-works/` · `/proof/` · `/pulse/` · `https://mentalvision.ai/` · `/about`.
Acceptance: pages move to "Indexed" (typically days–2 weeks). Also fixes the stale MV title Google still shows.

### §1.4 Bing Webmaster Tools (10 min)
https://www.bing.com/webmasters → "Import from Google Search Console" → both properties. Bing feeds ChatGPT search + Copilot retrieval.

## §2 Post-deploy live verification (5 min, view-source or curl)
- `https://signalflair.ai/about/` → one `<html>`, canonical ends in `/about/`, page title is the About title (not "Next.js")
- `https://signalflair.ai/` → `twitter:card` meta present; schema has `"alternateName":["Signal Flair AI Visibility","SignalFlair"]`; **no crunchbase URL**
- `https://signalflair.ai/llms.txt` → Stay Found shows Monitor/Proof/Multi tiers; Last Updated 2026-07-11
- `https://mentalvision.ai/llms.txt` → 200 (was 404)
- `https://mentalvision.ai/` → schema contains `subOrganization` → Signal Flair

## §3 LinkedIn — Signal Flair company page (15 min)
URL: linkedin.com/company/signal-flair-ai (you're admin). Current defects → replacements:
| Field | Current | Paste this |
|---|---|---|
| Tagline | "Can AI find your Business, Right NOW?" | `Your business, found by AI.` |
| Website | https://www.signalflair.ai | `https://signalflair.ai` |
| Founded | 2025 | [fact-pending #1 — set to confirmed year] |
| Description | "Agentic Engine Optimization…" | see block below |
| Parent company | "Mental Vision Corp (Indianapolis, IN)" | see §3b |

**Description (paste whole block):**
> Signal Flair builds AI Proof Infrastructure™ — the structured proof layer that helps AI answer engines find, understand, verify, and recommend your business.
>
> When someone asks ChatGPT, Claude, Perplexity, Gemini, or Google AI for a recommendation, those engines only surface businesses they can verify. We measure how clearly AI can read your business with the 0–100 Signal Score™, then build what's missing: llms.txt, schema markup, entity clarity, answer architecture, and trust proof.
>
> We audited ourselves first — Case Zero: an 18/100 baseline (June 2, 2026), rebuilt in public to 73/100 (July 5, 2026) — a model-informed Signal Score™ read, not a live engine test, not a guarantee. The record is public at signalflair.ai/proof.
>
> Answer Engine Optimization (AEO) for local service businesses — HVAC, roofing, dental, legal, home services — based in Brownsburg, Indiana, serving nationwide. All commitments are delivery-based: we build and hand over the infrastructure. We never guarantee rankings, citations, or AI recommendations.
>
> Signal Flair is a Mental Vision company. It is not affiliated with SignalFlare.ai.

### §3b Mental Vision company page
The parent reference "Mental Vision Corp (Indianapolis, IN)" implies an old page you own. Rename it to **Mental Vision** (Corp is retired), set location Brownsburg IN, website `https://mentalvision.ai`, and paste:
> Mental Vision is a creative technology studio: cinematic video production, AI filmmaking, and human-centered AI adoption — workshops, training, and implementation for teams and small businesses. Founder-led by Corey Ellis in Brownsburg, Indiana. Come see what you think. Mental Vision is also the parent company of Signal Flair (signalflair.ai), the AI-visibility and Answer Engine Optimization company.
If no MV page exists, create one with these fields, then link it as parent on the Signal Flair page (fact #4).

## §4 LinkedIn — personal profile (30 min)
URL: linkedin.com/in/corey-ellis-3b4a0ab8

**§4.1 Headline (fixes the "Cheif" typo):**
`Founder, Signal Flair — AI Proof Infrastructure™ | Founder & Chief Visionary Officer, Mental Vision | Making businesses findable, verifiable, and recommendable to AI engines`

**§4.2 About:**
> I run two companies from Brownsburg, Indiana.
>
> Signal Flair (signalflair.ai) makes businesses findable to AI engines. When someone asks ChatGPT or Perplexity "who should I hire?", the engines only recommend businesses they can verify — most local businesses are invisible to them. We measure that gap with the 0–100 Signal Score™ and build the proof layer that closes it: llms.txt, schema, entity clarity, trust signals. We audited ourselves first and published the whole thing — 18/100 baseline, rebuilt in public to 73/100 (a model-informed read, not a live engine test, not a guarantee): signalflair.ai/proof.
>
> Mental Vision (mentalvision.ai) is the studio side: cinematic video production, AI filmmaking, and AI adoption workshops that help small businesses use these tools without fear.
>
> No guarantees, no black boxes — delivery-based work with public proof. If AI can't find your business, let's fix that: hello@signalflair.ai
**Experience entries:** add `Founder — Signal Flair · [year, fact #1]–present · Brownsburg, IN` (2-line summary from §3 description); keep/rename MV role to `Founder & Chief Visionary Officer — Mental Vision`.
**Featured:** signalflair.ai/proof/ · signalflair.ai · mentalvision.ai.

**§4.3 Canonical founder bio (reuse everywhere — sites, podcasts, events):**
- Short (~50w): *Corey Ellis is the founder of Signal Flair, an AI-visibility company that helps businesses get found, verified, and recommended by AI engines, and Mental Vision, a creative technology studio for cinematic production and practical AI adoption. He works from Brownsburg, Indiana, and publishes his methods in public.*
- One-liner: *Corey Ellis makes businesses findable to AI engines — founder of Signal Flair and Mental Vision.*

## §5 Crunchbase (20 min)
crunchbase.com → Add a Company. Note: a different "Corey Ellis" (Growcer) exists on Crunchbase — create your person profile with photo + LinkedIn link so the entities stay distinct.
Fields: Name `Signal Flair` · website `https://signalflair.ai` · HQ `Brownsburg, Indiana` · Founded [fact #1] · Founder `Corey Ellis` · Industries: Marketing, SEO, Artificial Intelligence · Contact `hello@signalflair.ai` · LinkedIn `linkedin.com/company/signal-flair-ai` · Logo: `signal-flair-logo.svg` from the repo/public folder.
Short description: `Signal Flair builds AI Proof Infrastructure™ — measuring AI readiness with the 0–100 Signal Score™ and building the proof layer (llms.txt, schema, entity clarity, trust signals) that AI answer engines need to find, verify, and recommend a business.`
**Then:** in `src/app/layout.tsx`, restore `'https://www.crunchbase.com/organization/signal-flair'` (or the actual slug Crunchbase assigns) to the `sameAs` array — a comment marks the exact spot — and redeploy. Ask Claude to do it in any session.

## §6 Mental Vision /about cross-link (approval, then Claude implements)
Add after the founder narrative on mentalvision.ai/about:
> **Also from Mental Vision:** [Signal Flair](https://signalflair.ai) — our AI-visibility company. It measures how clearly AI engines like ChatGPT, Claude, Perplexity, Gemini, and Google AI can find and verify a business (the 0–100 Signal Score™), then builds the proof layer those engines read. Separate brand, same founder.

## §7 Quality citations (pick 2–3; identical NAP block everywhere)
NAP block: `Signal Flair · Brownsburg, Indiana 46112 · hello@signalflair.ai · https://signalflair.ai · AI visibility / Answer Engine Optimization (AEO) for local service businesses`
Targets in priority order: 1) **Clutch.co** (agency profile, category Digital Marketing/SEO) 2) **Brownsburg or Indy Chamber of Commerce** member directory (real-world corroboration engines weight heavily) 3) **UpCity or DesignRush** (one, not both). Use the §3 description. Skip everything else — no mass submissions.

## §8 Google Business Profile (decision + 30 min)
If approved (fact #8): business.google.com → service-area business `Signal Flair` · hide address · service area: Indianapolis metro (Brownsburg, Hendricks County + surrounding) · category `Marketing agency` (secondary: `Internet marketing service`) · website + hello@ · description from §3 (trim to 750 chars). Verification: video or postcard to the Brownsburg address — your call to proceed.

## §9 Founder post drafts (LinkedIn, one per week)
**9.1 Case Zero:** *We audited our own company before auditing anyone else's. June 2: Signal Score™ 18/100 — AI engines could barely see us. Five weeks of building the proof layer we sell — llms.txt, schema, entity cleanup, public change-log — and the July 5 re-audit read 73/100. That's a model-informed read, not a live engine test, and not a guarantee. But every step is public: signalflair.ai/proof. If you'd hire a contractor whose own house is falling down, ignore this post.*
**9.2 AEO vs SEO:** *SEO optimizes for a page of blue links. AEO optimizes for the layer AI engines actually read — llms.txt, schema, crawler access, verifiable facts. When someone asks ChatGPT "who should I call?", there's no page two. Either the engine can verify you, or it recommends someone else. Different machine, different rules.*
**9.3 Article share:** *New on signalflair.ai: how AI answer engines decide whether to trust a local business — the six layers they check, in plain English, with the exact things you can fix this month. [link]*
**9.4 Six layers:** *Your Signal Score™ is six layers: Access & Crawlability (can AI reach you), Structured Intelligence (can it parse you), Entity Clarity (does it know which "you"), Answer Architecture (do you answer real questions), Trust & Proof Density (can it verify you), Live AI Visibility (does it actually surface you). Most local businesses fail three of six without knowing. That's fixable.*

## §10 Authority article brief (Claude drafts on approval)
Title: **How AI answer engines decide whether to trust a local business**. URL: `/how-ai-engines-verify-a-business/` (or under /resources/). Intent: "why doesn't ChatGPT recommend my business", "how does AI choose businesses". 1,200–1,800 words. H2s: How answers get assembled → What engines cross-check (schema/reviews/citations/consistency) → The six layers → What "verifiable" looks like (llms.txt + schema example) → What we fixed on our own site (Case Zero, with caption) → 30-day fixes any owner can do. Schema: Article + author → #founder Person + FAQPage (3 Qs). Internal links: /how-it-works/, /proof/, /faq/, /pulse. Rules: no guarantees, observation-variability line included, cite public engine docs (OpenAI/Google crawler documentation) only.

## §11 Podcast/guest pitches (send 2, from outreach@trysignalflair.com)
Targets: local-business podcasts (home services/trades marketing), Indiana small-business shows, marketing/SEO podcasts covering AI search.
**Pitch draft:** Subject: `Your listeners are invisible to ChatGPT — and it's measurable`
> Hi [Name] — Corey Ellis, founder of Signal Flair in Brownsburg, Indiana. When someone asks ChatGPT or Perplexity for a [plumber/roofer/dentist] recommendation, most local businesses simply don't exist to those engines — and owners have no idea. I measure that gap for a living (we scored our own company first: 18/100, published the whole rebuild in public). Happy to walk your audience through the five checks any owner can run free in ten minutes. No pitch, no jargon — [3 episode-specific sentences]. Proof of everything I'd talk about: signalflair.ai/proof. — Corey
Acceptance: 2 sent, logged in the weekly checklist; any booking = a third-party page engines can verify.
