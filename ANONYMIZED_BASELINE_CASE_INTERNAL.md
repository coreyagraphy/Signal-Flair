# INTERNAL — Anonymized Multi-Engine Baseline Case (do not publish this file's contents)

> **Status: ANONYMIZED. Written permission from the organization has NOT been recorded.**
> This repo-root file is internal documentation only — root `.md` files are not part of the
> Next.js static export (`out/`), so nothing here ships to signalflair.ai. Keep it that way:
> never move this content into `src/`, `public/`, or any page.

## What this covers

Two public surfaces were added on 2026-07-21, both fully anonymized:

1. Homepage section `#real-world-audit` in `src/components/SignalFlairLanding.tsx`
   ("One business. Three AI engines. Three different identities.")
2. Use-case page `src/app/case-studies/three-engines-three-stories/page.tsx`
   ("AI Found the Business — But Told Three Different Stories")

## Publication restrictions currently in force

Until Corey records **written permission** from the organization, the public site must NOT contain:

- The organization's name, former name, or program names (including its city/region)
- Its logo or any imagery of its space
- The exact baseline score (**35/100** — internal only; public copy says only "weak-signal band (0–54)")
- Screenshots of engine answers or identifiable citations/sources
- Any wording that makes the organization reasonably identifiable
  (public descriptor is deliberately generic: "a community-focused coworking & entrepreneurship organization";
  no state, no city, no founding year, no speaking-engagement context)

## Replacement points once written permission is recorded

In `src/app/case-studies/three-engines-three-stories/page.tsx`:

- Hero + snapshot card: insert organization name and link; add logo if licensed
- "Baseline Signal Score™" row: replace "Weak-signal band (0–54) — exact score withheld…" with **35/100**
- "Audited" row: may state the exact audit date
- Engine sections: add approved quoted excerpts / screenshots of each engine's answer as evidence
- Add approved quotations from the organization, if provided
- Metadata/JSON-LD: add `about: { '@type': 'Organization', name: …, url: … }` (mirror restor-team pattern)

In `src/components/SignalFlairLanding.tsx` (`#real-world-audit`):

- Body copy may name the organization; the three engine cards may cite evidence

When remediation actually happens (do NOT pre-write any of this):

- Corrections performed (list of proof-layer fixes)
- Controlled retest results per engine (same prompts, documented dates)
- Before-and-after Signal Score™
- Client testimonial (only if genuinely given)
- Until then the page must keep its "baseline only — no remediation performed, no improvement claimed" framing

## Speaking-positioning (documented, not built)

The site has **no speaking page or speaking section** (verified 2026-07-21), so per scope rules no
speaking system was created. When one is added, include this talk concept:

- **Title:** AI Can Find Your Business. But Does It Understand It?
- **Description:** A live, practical demonstration showing how ChatGPT, Gemini, and Perplexity can
  interpret the same organization differently — and what businesses must do to establish a clear,
  verifiable AI identity.

Recommended smallest implementation: a `/speaking/` page on the `rsc` layout (same pattern as
`/how-it-works/`), linked from the footer, with this talk plus the Case Zero story.

## "Invisible" language audit (2026-07-21)

Unqualified "invisible" messaging was retired site-wide. Retained occurrences, with rationale:

- **"Signal Invisible" / "invisible to AI" (Case Zero — homepage About card, `/about/`, `/faq/`):**
  retained. Case Zero (18/100, 2026-06-06) documented 0 citations found across 5 engines and
  AI Search Presence 4/100 — Signal Flair genuinely did not appear. Evidence-backed.
- **"invisibly gone every month" (pricing anchor):** idiom about unseen revenue loss, not a claim
  that a business is invisible to AI.
- **CSS/JS code comments** using "invisible" (globals.css, SignalFlairLanding.tsx): visual-state
  comments, not messaging.
