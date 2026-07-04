# Signal Flair Website — Session Handoff

**Written:** 2026-06-27 · **For:** starting a fresh session on the Signal Flair site
**Paste this to open the new session:** *"Read HANDOFF.md in the signal-flair repo, then continue."*

---

## 0. TL;DR (read this first)

- **Project:** `C:\Users\corey\OneDrive\Desktop\signal-flair` — Next.js 14 **static export**, React 18, TS, Tailwind v3, anime.js v4 + GSAP + Lenis.
- **Live site:** https://signalflair.ai (Netlify, manual drag-drop of `out/`).
- **Working branch:** `case-zero-package-phase-3-proof-assets`. `main` is currently **3 commits behind** it.
- **⚠️ State right now:** a batch of updates is **committed + built into `out/` but NOT deployed.** The live site is still the older build.
- **To ship:** `npm run build` → drag `out/` onto the **cozy-pie-596a1f** site's **Deploys** tab.

---

## 1. What's done but not yet live (this session's commits)

Newest first — all committed to the working branch:

| Commit | What |
|---|---|
| `504d466` | **New animated "flare" logo** — rainbow gradient + colour strobe |
| `6d33e54` | Case Zero: viewable **HTML + PDF** of the Live AI Visibility baseline |
| `cbcb186` | Case Zero: dated **Live AI Visibility baseline** (2026-06-26) |
| `43d6b61` | Hero: smoother word-swap (gentle blur-in) |
| `dc341ed` | Hero: independent timers for engine vs verb rotation |
| `f1fc341` | Hero: rotate the verb (**find → read → trust**) with colour change |
| `ae58cca` | FAQ: explain the **trust-layer architecture** (Trust & Proof Density) |
| `74ac9b1` | Polish: tighter "AI" spacing, richer ombré, subtle liquid-glass cards |
| `1fe0c72` | Trust band: glowing ombré "AI" + capitalized "TRUST" |
| `7d1ec09` | Hero gauge: **conic red→orange→yellow→green** scale (bad→good) |
| `20a3fec` | Hero gauge: full gradient ring, gap top-left, smaller number |
| `82f8bc1` | Hero gauge: number → upright Instrument Serif |
| `5086329` | Hero gauge: gradient ring + cleaner readout |
| `4c97763` | Hero rotator: tighten "AI Overviews" word-spacing |
| `51bda4f` | Hero gauge: believable **bad score (34)** with red→green bands |
| `607ae62` | Hero polish: fit bottom line, enlarge rotator words |
| `7c4a876` | Hero: add "Trusted" to Scanned · Structured · Found |
| `0d95bd5` | Hero/trust: add **AI Overviews** to rotator, enlarge eyebrow, TRUST beat |

Earlier in the session (also on the branch): answer-engine question-style headings, **Competitor Signal Snapshot™** deliverable + FAQ, **RESTOR Team** case study (`/case-studies/restor-team`, competitor kept anonymous — "selected market peer"), larger uniform 56px logo sitewide, **"Mental Vision Corp" → "Mental Vision"** everywhere, pricing-header redesign.

---

## 2. The new logo (most recent work — know this)

- File: `src/components/SignalFlairLogo.tsx` — a **transparent inline SVG** (chosen over the raster PNGs so it integrates on any background and can recolour-strobe; a PNG could do neither).
- Design: cyan→yellow→orange→magenta gradient **FLAIR**, cyan circuit **SIGNAL**, yellow/orange/magenta dots, a flare swoosh launching from a glowing flare-source (bottom-left) to a magenta landing dot.
- Animation: `.sf-logo` / `@keyframes sf-flare` in `src/app/globals.css` — hue-rotate + brightness + coloured glow pulse (the "strobe / flare flicker"), **`prefers-reduced-motion` guarded**, plus a subtle dark drop-shadow for legibility on cream pages.
- Used **sitewide** (all navs, footer, subpages, RESTOR case study). `onDark`/`pulse` props kept for call-site compat but no longer affect colour.
- Tunable if asked: strobe **speed**, **hue range** (currently warm↔cool, not full rainbow wheel), or a more subdued cream-page variant.

---

## 3. How to work here — critical gotchas

- **NEVER run `npm run build` while `next dev` is running.** They share `.next` and it corrupts. Stop dev first.
- **Preview MCP is broken** (`spawn cmd.exe ENOENT`). Run dev via Bash: `npx next dev -p <port>`. Detached dev servers are hard to kill (IPv6-bound; netstat/wmic/taskkill flaky) — just use a fresh port, or reboot to clear.
- **`out/` build can hit EBUSY** — OneDrive locks / a stray server with CWD inside `out/`. Kill such processes; pausing OneDrive sync helps. (Repo lives on the OneDrive-redirected Desktop.)
- **Visual verification = headless Chrome** (the only reliable path):
  `chrome --headless=new --screenshot=out.png --window-size=1440,900 --force-device-scale-factor=2 --virtual-time-budget=8000 "http://localhost:<port>/"` then Read the PNG. Note: **scroll-revealed sections stay hidden** (opacity:0) in static shots — the hero renders fine; test a live server for below-fold content and animation.
- **Deploy = manual drag only.** Drop `out/` onto **cozy-pie-596a1f → Deploys tab** (NOT the team dashboard — that spawns a stray duplicate project). Git-connect is dead.

---

## 4. Deploy / DNS safety (do not violate)

- **NEVER move IONOS nameservers to Netlify.** DNS stays at IONOS; only the website records point at Netlify.
- **NEVER edit MX / SPF / DKIM / DMARC** — email warmup is live; touching these breaks sending.
- Deploy is Netlify-side only (drag `out/`). Nothing about shipping the site should touch DNS or email.

---

## 5. Brand + content canon

- Parent company = **"Mental Vision"** — NEVER "Mental Vision Corp".
- Positioning: **AI Proof Infrastructure™**. **Signal Score™** (0–100) across the six **Signal Protocol™** layers: Access & Crawlability · Structured Intelligence · Entity Clarity · Answer Architecture · Trust & Proof Density · Live AI Visibility.
- Offer: Founding Partner Pilot. Deliverables incl. **Signal Baseline™**, **Competitor Signal Snapshot™** (point-in-time, NOT tracking — keep its disclaimer), **Signal Proof Page™**, **Stay Found™**.
- **Pricing: $3,500 / $1,500 / $600–1,200·mo. `$997` is DEAD — never revive.**
- **Never** claim guaranteed rankings, leads, or citations.
- **Never** name a competitor in client-facing material (use "a selected market peer"). **Never** name GoHighLevel client-facing (say "CRM access").
- Fonts: Fraunces (display), Instrument Serif italic (accents), Geist Mono (mono). Palette (Cinematic-Brutalism): cream `#f0ebe0`, ink `#0a0a0a`, orange `#ff5a1f`, teal `#00b8a9`, yellow `#fff45f`. The rainbow (cyan/magenta) lives in the **logo only**.
- Case Zero is the **before-state** (18/100 technical baseline) — present as a starting line, never as a finished result.

---

## 6. Key files

| Purpose | Path |
|---|---|
| Homepage (hero + mount effect; `@ts-nocheck`) | `src/components/SignalFlairLanding.tsx` |
| Logo | `src/components/SignalFlairLogo.tsx` |
| Global styles + logo strobe keyframes | `src/app/globals.css` |
| Homepage FAQ **JSON-LD** (mirror the visible FAQ) | `src/app/page.tsx` |
| FAQ page | `src/app/faq/page.tsx` |
| Metadata / Org schema | `src/app/layout.tsx` |
| Machine-readable proof | `public/llms.txt`, `public/signalflair-discovery.json` |
| RESTOR case study | `src/app/case-studies/restor-team/page.tsx` |
| Case Zero baseline | `case-zero/live-ai-visibility-baseline-2026-06-26.{md,html,pdf}` |

---

## 7. Proof OS (separate repo — Grok owns the product build)

- Repo: `C:\Users\corey\OneDrive\Desktop\Grok_SignalFlair_Proof` — the **real** scoring engine. Signal Flair is tracked as client `signal-flair-case-zero`.
- 2026-06-26 real crawl run: Access 100 / Structured 100 → **Technical Crawl Score 90**; public score stays canon **18**; **Live AI Visibility ≈ 20** (brand invisible + active **FLAIR-MRI** entity collision). Recorded as an `EARLY_RECHECK` measurement.
- Boundary: **run** its tools; don't rebuild its functionality or commit its gitignored data. Measurement-history page 500 was fixed (`62871de` — the real bug was a `??`/`||` mix, not Grok's trailing-comma guess).

---

## 8. Open / next steps

1. **Deploy** the current `out/` (drag → cozy-pie-596a1f → Deploys). ← the one thing actually pending to go live.
2. **Fast-forward `main`** to the working branch (3 behind).
3. Optional logo tuning (strobe speed / hue range / subdued cream variant).
4. Full six-layer operator audit + per-engine prompt log for a real composite (crawl only measures Access + Structured).
5. **Re-run** the Live AI Visibility baseline at **Day 30 ≈ 2026-07-26** and **Day 90 ≈ 2026-09-24** (same 4 queries; table in the baseline `.md`).
