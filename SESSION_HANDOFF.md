# Signal Flare — Session Handoff

You're picking up an in-progress build. Read this, then continue. Today: 2026-05-31.

## What we're building
The **Signal Flare** marketing website for Mental Vision Corp (AI-visibility + cinematic-creative agency, Indianapolis). Active project:

- **`C:\Users\corey\OneDrive\Desktop\signal-flare`** — Next.js 14.2 · React 18 · TypeScript · Tailwind v3 (`darkMode:'media'`) · Framer Motion 11. App Router, `src/`, `@/*` alias.
- Run: `cd signal-flare && npm run dev` → http://localhost:3210. Deps installed. Compiles clean, no console errors in light or dark.

## Current state of the site (just overhauled)
- **Theme: system-preference light/dark, no toggle.** CSS vars in `src/app/globals.css` flip via `@media (prefers-color-scheme: dark)`, surfaced to Tailwind in `tailwind.config.ts` as semantic colors `rgb(var(--x)/<alpha-value>)`. Tokens: `bg, surface, surface-2, ink, line` (flip) + `feature, feature-2, on-feature` (**always dark in both themes** — used for Hero, Ticker, Services, Stats, CTA, Footer for cinematic contrast). Accents fixed: orange `#FF7A45`, orange-2 `#E85D04`, teal `#00A6A6`, yellow `#F7FF5A`, pink `#FF1177`.
- **Hero = full-bleed looping muted video** (`public/video/signal-flare-hero.mp4`) + poster (`public/video/hero-poster.jpg`) + dark scrim. Persistent nav (transparent over hero → solid on scroll). `src/components/sections/HeroSection.tsx`.
- **Sections** (`src/app/page.tsx`): Hero → Ticker → Problem(+ScanDemo) → Services → Check → Work → Stats → Process → Pricing → CTA → Footer. Responsive breakpoints + `clamp()` headings + `prefers-reduced-motion` guard added.
- `src/components/shared/ORB01.tsx` (canvas robot) **exists but is unused** — retired from the hero, kept for a possible cameo.
- Custom cursor + film-grain overlay (auto-disabled on touch).

## Immediate next task (what I was about to do)
Wire **`liquid-glass-react`** (rdev, MIT, 5.1k★, React-18 safe — `npm install liquid-glass-react`) into the hero **CTAs + the 23/78 proof chips + nav pill**, with a `@supports`/Chromium guard so Safari/Firefox degrade to the current solid buttons (displacement refraction is **Chromium-only**). Optional: glass-lettering treatment on the hero headline. Spike on a branch, screenshot before/after.
- Other liquid-glass options researched: `glincker/glinui` (needs React 19 — fits the other project, not this one), `nikdelvin/liquid-glass` (has LiquidText for typography), kube.io blog (best refraction technique writeup).

## NON-NEGOTIABLE constraints (do not violate)
- **Pricing is canonical & locked:** `$1,250` 7-Day AI Visibility Rebuild · `$2,500` AI Visibility Foundation (flagship) · `$797/mo` Stay Found System. Source of truth: `mental-vision-pipeline/pipeline/offers.py`. Deliverables + the 3 guarantee strings in `PricingSection.tsx` are verbatim from there.
- **Guarantee = delivery-based only.** Never rankings / leads / revenue / citation promises (compliance).
- **White-label:** never name GoHighLevel / GHL / LeadConnector in any client-facing copy/UI.
- **Brand locks:** fonts Bebas Neue / DM Serif Display / DM Mono / Barlow Condensed; dark is near-black `#0A0806` (not pure black); pink is alerts-only; contact `create@mentalvision.ai`; work labels "Real Work" (Colts, LV) vs "Concept Build" (HVAC demo).
- Score scale 0–100, 7 categories, labels: Invisible 0–39 / Weak 40–64 / Partially Visible 65–84 / AI-Ready 85–100.

## Known issues / open items
- **Hero video is 83 MB** — too heavy for prod; compress to ~3–6 MB H.264 + WebM before launch (ffmpeg is available).
- CTAs are `mailto:` placeholders — real audit-intake form is future work.
- No mobile nav menu yet (links hidden < md).
- `cursor:none` is an a11y consideration; `ORB01.tsx` is dead code.
- `CODEX_REVIEW_BRIEF.md` (repo root) is ready to send to Codex for independent review.

## Context you usually won't need (other artifacts from this session)
- Earlier Vite site still exists at `mental-vision-website/` (Pastel-Futurist palette; `signal-flare/index.html` is live + a `redesign.html`). The new `signal-flare` Next app is the current direction. **Open decision:** confirm the dark-cinematic house brand here is canonical for mentalvision.ai vs the locked Pastel-Futurist palette.
- `mental-vision-site/` = separate Next 16 / React 19 / three.js orb experiment (already has a `liquid-glass-button.tsx`).
- Pipeline doctrine work (done, not needed for the site): integrated the **Agentic Transaction Layer v1.1** across `mental-vision-pipeline` docs/skills; reconciled stale `$400/$750/$1,500` pricing to canonical; produced system overview + one-pager PDF + agentic Meta ad set.
