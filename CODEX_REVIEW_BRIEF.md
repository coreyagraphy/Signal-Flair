# Signal Flare — Code & Design Review Brief (for Codex)

**Reviewer:** Codex CLI · **Repo:** `signal-flare/` (Next.js app) · **Date:** 2026-05-31
**Ask:** Independent review of this marketing site — code quality, design/UX, performance, accessibility, responsiveness, and conversion. Be direct and specific; cite file + line. Rank findings by severity (Blocker / High / Medium / Nit).

---

## 1. What this is

The public marketing site for **Mental Vision Corp** — an AI-visibility + cinematic-creative agency in Indianapolis. The product line ("Signal Flare") audits how AI search/agents see a local business, scores it 0–100, and sells a fix. This site's job: make a visitor feel "if AI can't see me, I'm losing customers," then push them to **RUN MY VISIBILITY SCAN** (mailto / future form).

Tagline: *Discovery Is the First Connection.*

---

## 2. Stack & how to run

- **Next.js 14.2** (App Router, `src/`, `@/*` alias) · **React 18** · **TypeScript**
- **Tailwind CSS v3** (`darkMode: 'media'`) · **Framer Motion 11**
- No backend, no DB. Static marketing page (`src/app/page.tsx` is a single client component composing sections).

```bash
npm install
npm run dev      # http://localhost:3210  (script: next dev)
npm run build    # production build — please run this and report any type/build errors
```

---

## 3. Key design decisions (so you review against intent, not assumptions)

1. **Light AND dark, by system preference only — no manual toggle.** Decided deliberately. Implemented with CSS variables that flip in `@media (prefers-color-scheme: dark)` (`src/app/globals.css`), surfaced to Tailwind as semantic colors in `tailwind.config.ts` via `rgb(var(--x) / <alpha-value>)`.
   - Semantic tokens: `bg`, `surface`, `surface-2`, `ink`, `line`.
   - **Feature bands** (`feature`, `feature-2`, `on-feature`) are intentionally **dark in BOTH themes** — used for Hero, Ticker, Services, Stats, CTA, Footer to keep cinematic contrast on a light page. The other sections flip.
   - Fixed accents (read on both themes): orange `#FF7A45`, orange-2 `#E85D04`, teal `#00A6A6`, yellow `#F7FF5A`, pink `#FF1177`.
2. **Hero = full-bleed looping muted video as the standard** (`src/components/sections/HeroSection.tsx`), with an extracted poster (`public/video/hero-poster.jpg`) for first paint and a dark scrim for legibility. It is persistent, not a one-time intro.
3. **Video-led; sections kept, restyled.** An earlier build had an interactive canvas robot (ORB-01) as a play-once hero intro. That was retired from the hero. `src/components/shared/ORB01.tsx` still exists but is **currently unused** (kept for a possible later cameo).
4. Custom cursor + film-grain overlay for a cinematic feel (`globals.css`); both auto-disable under `(hover: none)`. `prefers-reduced-motion` guard included.

Section order (`src/app/page.tsx`): Hero → Ticker → Problem(+ScanDemo) → Services → Check → Work → Stats → Process → Pricing → CTA → Footer.

---

## 4. Hard constraints — do NOT suggest changing these

- **Pricing is canonical and locked:** `$1,250` (7-Day AI Visibility Rebuild) · `$2,500` (AI Visibility Foundation, flagship) · `$797/mo` (Stay Found System). Deliverables and the three guarantee strings in `PricingSection.tsx` are mirrored verbatim from the company's `offers.py` source of truth — flag if they drift, don't rewrite them.
- **Guarantee language is delivery-based only.** Never propose rankings/leads/revenue/citation promises (compliance).
- **Brand locks:** fonts (Bebas Neue / DM Serif Display / DM Mono / Barlow Condensed); dark = near-black `#0A0806`, not pure black; pink is alerts-only; contact email `create@mentalvision.ai`; work labels "Real Work" vs "Concept Build".

---

## 5. Known issues (already on my radar — confirm/expand, don't just re-report)

- **Hero video is 83 MB** (`public/video/signal-flare-hero.mp4`). Known perf problem; compression to ~3–6 MB H.264 + WebM is planned. Comment on LCP/poster strategy, `preload`, and whether to gate the video on connection/`prefers-reduced-motion`.
- CTAs are `mailto:` placeholders; a real audit-intake form is future work.
- `ORB01.tsx` is dead code right now (intentional). Flag if it should be removed vs kept.

---

## 6. What I want feedback on

**A. Code quality** — component structure, the CSS-var→Tailwind token approach, any anti-patterns, effect/interval cleanup (e.g. `StatsSection` count-up, `page.tsx` cursor RAF loop), `'use client'` boundaries, prop typing.

**B. Theming** — is `prefers-color-scheme`-only (no toggle) defensible, or is a manual override expected here? Any tokens that don't read well in one theme (esp. dark `surface` vs `surface-2` contrast, muted text alpha levels)?

**C. Performance** — LCP with the video hero, font loading (Google `@import` in CSS vs `next/font`), Framer Motion bundle, image/poster handling, anything that hurts Core Web Vitals.

**D. Accessibility** — `cursor: none`, video with no captions (decorative/muted — acceptable?), color contrast (WCAG AA) across both themes especially on feature bands, focus states, heading hierarchy, motion.

**E. Responsiveness** — layout from 360px → 1440px. I added `grid-cols-1 → md/lg` breakpoints and `clamp()` headings; check for overflow, the hero proof-chips (hidden < md), nav (no mobile menu yet — flag it).

**F. Conversion / messaging** — hero clarity, CTA strength, pricing legibility, whether the narrative (problem → scan → services → proof → process → pricing → CTA) converts.

---

## 7. Output format I'd like back

```
SEVERITY | FILE:LINE | ISSUE | WHY IT MATTERS | SUGGESTED FIX
```
Plus a short "top 5 things to fix first" list, and a one-paragraph overall verdict (is this launch-ready after the known video fix, or are there blockers?).

---

*Files worth starting with: `src/app/globals.css`, `tailwind.config.ts`, `src/components/sections/HeroSection.tsx`, `src/components/sections/PricingSection.tsx`, `src/app/page.tsx`.*
