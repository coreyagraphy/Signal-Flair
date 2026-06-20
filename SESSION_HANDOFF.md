> ⛔ **STALE (2026-05-31). Superseded by `SESSION_HANDOFF_2026-06-07.md` — read that first.**
> Kept for history only; where it conflicts with the 2026-06-07 handoff, the newer file wins.

# Signal Flair / Mental Vision — Session Handoff

You're picking up an in-progress build. Read this, then continue. Date: 2026-05-31.
(Note: `CLAUDE.md` in this repo is the OLD original spec — ignore it where it conflicts with this handoff. This file is source of truth.)

---

## ⭐ CURRENT STATE — Cinematic-Brutalism redesign (latest session; READ FIRST)

**Run:** `npm run dev -- -p 3210` (Strict Mode now OFF — see Fixes). `rm -rf .next` first (OneDrive). Dev only — **holds still apply: no prod build, no GHL pushes.** Canonical files unchanged: `src/components/SignalFlairLanding.tsx` (whole page + one mount `useEffect`, `@ts-nocheck`) + `src/app/globals.css`.

**Design system (locked):** Cinematic Brutalism + Editorial Flair. Fonts = **Fraunces** (display) · **Instrument Serif italic** (accent) · **Geist Mono** (signal/mono). Inter dropped as personality. Palette: ink/paper/hot-yellow #fff45f/orange #ff5a1f/red #ff1765/teal #00b8a9. Deps added: **lenis 1.3.23 + gsap 3.15.0** (Lenis smooth scroll synced to GSAP ScrollTrigger).

**Hero:** faint cinematic video (`/video/signal-flair-hero.mp4`, lightened grade); headline **"Can [rotating engine] find your business right now?"** — engine word shuffles 12 names (AI · ChatGPT · Claude · Gemini · Perplexity · Copilot · Grok · DeepSeek · Llama · Mistral · Ollama · Google AI) via `setInterval` text-swap + CSS `eng-rot-in` fade (timer-driven so it can't get stuck invisible). Centerpiece **gauge counts 0→78 and colors red→orange→yellow→teal by value** (GSAP ScrollTrigger, re-arms on scroll-back). Engine-status strip + redundant subline removed (decongested). Bottom = `#hfoot` moving marquee ticker. Hero scales by viewport height (short-laptop `@media max-height`).

**Sections (order):** hero → ticker → problem (**Human View vs AI View** panels) → signal (PROTOCOL rows) → check (scorecard + status stamps + hover slide) → stats (**5+ / 4M+ "& counting"**) → process → **#moat ("THE UNFAIR ADVANTAGE" — 4 color-coded unfair-advantage cards, written via coreyagraphy-skill)** → pricing → cta ("Trusted locally. *Now visible to AI.*") → mv-bridge → footer.

**Pricing:** triage bands; cards distinct colors (Foundation dark/yellow · Rebuild orange · Stay Found teal); **swing-in** elastic entrance; **prices LOCKED — no count-up** (only proof stats/scores count). **"Three Offers / One Right Fit" header is intentionally off-grid** (mixed type, staggered, tilted — `.pricing-vw-wild`). **Stay Found has 3/6/12-mo commitment terms = $1,200 / $900 / $600/mo** (longer = cheaper; replaced "cancel anytime"). Canonical prices intact: Foundation **$3,500** / Rebuild **$1,500** / Stay Found **$600–$1,200/mo**. "CRM access" — GHL never named.

**Interaction:** neon-yellow cursor + 10-dot comet trail that **morphs to orange square on light/cream sections** (`data-cursor="light"` on problem/check/process/pricing/cta). CTA buttons have glow/shadow. **FLAIR wordmark has an orange border box** (nav/sticky/footer). Logo + nav links + all sub-fonts enlarged.

**Fixes (root cause of the gauge/intro flakiness):** **React Strict Mode disabled** in `next.config.js` (`reactStrictMode:false`) — dev double-invoke was binding the imperative intro/canvas effect to stale DOM → `null.style` throw aborted the reveal before the gauge counted. Also: all intro DOM accesses null-guarded; `revealHero()` force-sets `#hero-bg` opacity; safety-net `setTimeout` force-reveals if the intro is ever interrupted. Fresh load is **console-error-clean**. Mobile pass done + verified.

**Env quirks while verifying:** the automation/preview browser forces `prefers-reduced-motion` + freezes rAF → CSS/anime/gsap motion renders static there and screenshots wedge on the looping video; verify motion in a normal Chrome or via DOM/computed-state checks (not the static look).

**Open / possible next:** add more LLM names to the rotator on request; optionally migrate anime.js section reveals to one GSAP system; tune Lenis `lerp`; the older notes below predate this redesign — defer to this section where they conflict.

---

## Project
- **`C:\Users\corey\OneDrive\Desktop\signal-flare`** — Next.js 14.2 · React 18 · TypeScript · Tailwind v3 · **anime.js v4.4.1** · Framer Motion 11 (now legacy/unused). Git repo on **`master`**.
- Run via preview MCP: `preview_start` with launch name **"Signal Flair (Next.js)"**. Port 3210 is occupied by a stale dev server → it auto-assigns a random port. Or `cd signal-flare && npm run dev`.

## What this is now
The **canonical homepage is the "bold" redesign, ported to React**:
- **`src/app/page.tsx`** → renders **`src/components/SignalFlairLanding.tsx`** — the whole page as JSX plus ONE mount `useEffect` running the anime.js intro/scan/scroll logic. It's `@ts-nocheck` + `eslint-disable` on purpose (faithful port of generated markup). Init is guarded with a `started` ref against React strict-mode double-invoke.
- **`src/app/globals.css`** = the complete bold stylesheet (cream/charcoal theme, NOT the old dark-token system) + hero grade + gauge/ring styles.
- **`src/app/layout.tsx`** = metadata only.
- **`public/bold.html`** = original standalone reference (still there; delete once happy).
- The old Framer-Motion components (`sections/*`, `layout/Navigation.tsx`, `shared/*`) and `lib/tokens.ts` + `ui/spline-scene.tsx` have been **DELETED** (were dead code). Only `SignalFlairLanding.tsx` + `lib/utils.ts` remain under components/lib.

## ✅ REBRAND DONE — Signal Flair Finality v1.0 (this is now a SIGNAL FLAIR site, not Mental Vision)
Per `SIGNAL_FLARE_WEBSITE_UPDATE_PROMPT.md` (in Downloads; Finality v1.0). Signal Flair is a standalone AI-Visibility/AEO product brand. Mental Vision now appears ONLY in (a) the footer attribution line and (b) one subtle content-bridge section. Key changes — these SUPERSEDE the older notes below and the old CLAUDE.md:
- **Brand:** nav/sticky/footer logo = **SIGNAL FLAIR** (`logo-mental`="SIGNAL", `logo-vision`="FLAIR"). Tag = "AI Visibility + AEO".
- **Removed everywhere:** Colts/Horsepower, Louis Vuitton, Red Print, #17 of 8,500/Skool, A Few Good Men, Seedance/Higgsfield/UGC/cinematic/video-production, Coreyagraphy, the Work portfolio section (deleted). Ticker + Stats repopulated with SF terms (#17→"5 AI Engines Scored").
- **3 services (`#signal`):** AI Visibility Audit · Foundation Build · Stay Found System (copy from the doc).
- **NEW canonical pricing** (replaces the old $1,250/$2,500/$797 — those are now DEAD for the SF product): **Tier 1 Build the Foundation $3,500** (score 0–54, flagship `price-feat`) · **Tier 2 Start the Rebuild $1,500** (55–74) · **Tier 3 Stay Found System $600–$1,200/mo** (75–100). CRM note rendered as **"CRM access"** — GHL is NOT named (white-label rule held against the doc's literal "(GHL sub-account)").
- **Fonts (Finality):** display/headlines = **Instrument Serif** (italic for emphasis), mono/data/scores = **Geist Mono**, body/UI = **Inter**. Google-fonts `@import` updated. (Replaces Bebas/DM Serif/DM Mono/Barlow.)
- **Gauge:** progress arc is now a **teal #0D9488 → orange #E85D04 gradient** (`<linearGradient id="arc-grad">`); doctrine color bands removed; score number in Geist Mono; counts 0→78 over **2000ms**. Centered stack unchanged.
- **Tagline:** hero strap bar = "**Your business, found by AI.** Discovery is the first connection."
- **Contacts:** `hello@signalflair.ai` = canonical website/GHL contact (real GHL web email — use everywhere public). `outreach@trysignalflair.com` = Jarvis's **separate** outreach identity (active, different system — NOT the website contact). Deprecated/unused: `connect@signalflair.ai`, `create@mentalvision.ai`.
- **Footer attribution (exact):** "Signal Flair is a Mental Vision Corp product | Brownsburg, Indiana | signalflair.ai".
- **Content bridge** (`#mv-bridge`, after CTA / before footer): subtle dark mono band, "AI found you. Now make them stay." → links to https://mentalvision.ai.
- ✅ **Pricing scope RESOLVED (Corey, 2026-05-31):** the new pricing is **system-wide canonical** — it replaces the frozen $1,250/$2,500/$797 everywhere (outreach doctrine, GHL pipeline, score-card templates, email copy). Website is done; the outreach-side cascade is the next task.

## ✅ BRAND SPELLING — "Signal Flair" (intentional misspelling, PERMANENT)
Corey (2026-05-31): the brand is **Signal Flair**, NOT "Signal Flare". The misspelling is intentional and permanent — **never autocorrect to "Flare".** Renamed across this repo: all brand text, logo spans (SIGNAL/FLAIR), emails → **hello@signalflair.ai** (canonical website/GHL contact; `outreach@trysignalflair.com` is Jarvis's separate outreach identity, not the website contact), domain **signalflair.ai**, footer attribution, meta tags, `package.json`/lockfile name (`signal-flair`), preview launch ("Signal Flair (Next.js)"), and the hero video asset (`signal-flair-hero.mp4`). Obsolete docs deleted (`bold.html`, `COMPONENTS.md`, `CODEX_REVIEW_BRIEF.md`); old `CLAUDE.md` replaced with a redirect stub.
- **`drawFlareBeam`** (intro light-beam animation) intentionally KEPT — it's a visual flare, not the brand.
- ⏳ **PENDING physical rename (do at build time, NOT mid-session):** the repo directory is still `…\Desktop\signal-flare`. Renaming it to `signal-flair` breaks the running dev server, the preview-MCP launch path, and git — do it as a deliberate step right before the 24h production build (stop dev, rename, update any absolute paths, re-init preview). All *in-file* path tokens were left pointing at `signal-flare` on purpose until then.

## ⛔ HOLDS (Corey, 2026-05-31)
- **Do NOT `npm run build` for production yet** — domain propagation completes in ~24h. Sequence: configure DNS → point signalflair.ai to GHL → then build.
- **No new prospect research. No GHL pushes.**
- **Next task while domain propagates:** complete the Finality cascade + all file/slug renames on the *outreach* side (doctrine, GHL pipeline, score-card templates, email copy) — reconcile to the new pricing + Flair spelling.

---
### (Older notes — pre-rebrand, kept for history)

## Hero — current state (commit d236558)
- Full-bleed **`/video/signal-flair-hero.mp4`** (1080p H.264, 3.3 MB) background + **grade/LUT** (`#hero-grade` teal→orange soft-light + a subtle filter on `#hero-video`).
- **Flare-ignition intro** (anime.js canvas: flicker → flare beam ascends/descends → doors split → hero reveals). Skippable via `#skip`.
- Before/after hero **text kept**: "TRUSTED LOCALLY / INVISIBLE TO AI" (left) · "SCANNED. STRUCTURED. FOUND." (right). Corey likes this — keep it.
- Brand on this design = **MENTALVISION**. Pricing/guarantee/email all doctrine-correct.

## ✅ DONE — canvas robot removed; hero is now a vertical stack with a centered SCORE GAUGE centerpiece
History: (1) canvas ORB-01 robot deleted entirely (`drawORB01`, `setupRobotInteraction`, `#orb-canvas`/`#eye-glow`, `#orb-wrap` parallax all gone — only robot left is the one in the hero video). (2) Then the whole hero was **restructured from a 3-column (text | robot | text) grid into a centered VERTICAL STACK**: problem text on top → **AI Visibility Score gauge** in the middle → solution text below. The gauge is the centerpiece that separates problem-above from solution-below.

**Hero markup (`SignalFlairLanding.tsx`, `#hero-layout` is now `display:flex; flex-direction:column; align-items:center; text-align:center`):**
- `.h-side.top` — eyebrow "What AI currently sees" + headline "TRUSTED LOCALLY. INVISIBLE TO AI." + one-line sub.
- `#score-gauge .score-gauge` — large circular gauge (`width:min(340px,72vw)`, renders ~336px). SVG ring with the four **doctrine color bands** (`.rz-pink/orange/yellow/teal`) + white progress arc `#ring-prog`. Center readout: `#score-val` (the number) + `.gauge-score-lbl` "Your AI Visibility Score".
- `.h-side.bottom` — eyebrow "After Mental Vision" + headline "SCANNED. STRUCTURED. FOUND." + one-line sub.
- `#hero-center-scrim` — radial dark scrim behind the stack for legibility over the busy video.

**Animation:** on hero reveal (`revealHero` timeline: top text → gauge pop → bottom text), `runScan()` fires at +900ms and **counts the ring + number up 0 → 78** together (`animate({v:[0,78]}, outExpo, 1900ms)`). Ring stroke auto-colors by band via `renderRing` (78 → yellow). `scanned` flag = fires once. Verified in preview: stack order correct, gauge centered (cx ≈ 50%), counts to 78, label present, no console errors.

**Knobs:** target score is hardcoded `78` in `runScan` + the count-up; gauge size in `.score-gauge`; band thresholds in `rColor`. The robot still plays in the background video (right side); centered text crosses it slightly — `#hero-center-scrim` opacity is the dial if more legibility is wanted.

### Open / possible follow-ups
- Robot overlaps the right edge of the headlines a little. If it bugs Corey: widen/darken `#hero-center-scrim`, or shift the video focal point. (The earlier flanking-columns layout is in git history if he prefers that instead of the stack.)

### Video analysis already done (1 fps contact sheet)
Hero video is 12 s, loops. **0–3 s** flare igniting (no robot). **4–7 s** a robot figure forms/stands up in the clouds. **~8–11 s** robot **fully settled, standing, roughly center (slightly right), head upper-center.** So it "stops" ~**8 s**; its head is the overlay target.

### Implementation notes / gotchas for this task
1. In `SignalFlairLanding.tsx` remove: `#orb-canvas`, `#eye-glow`, `#eye-glow-outer` markup; the `drawORB01` fn + its call; `setupRobotInteraction` fn + its call. (Confirm w/ Corey whether the *intro* flare's robot sketch should also go — likely yes given "anywhere," but it's a separate animated moment.)
2. Move `#head-ring` + `#scan-num` OUT of the (removed) `#orb-wrap` → make them **absolute overlays on `#hero`**, positioned by **%** over the video robot's head. CAVEAT: video is `object-fit:cover`, so the robot's screen position is **viewport-aspect-dependent** — tune per breakpoint (or desktop-tune + note it).
3. **Timing/sync**: video plays (muted, loop) during the ~8 s intro, so by hero-reveal it's already several seconds in. To fire the ring exactly when the robot stops, either (a) seek/restart the video on hero reveal so the settle aligns, or (b) trigger the scan when `video.currentTime` passes ~8 s, and decide whether to re-fire each loop.
4. Ring is **textless** (doctrine color bands only). Scan = ring sweep + cyan scan-line + glow over the video robot's head. Number **pops** (currently 78). Existing helpers in `SignalFlairLanding.tsx`: component-scope `RG`/`rang`/`rarc` (ring geometry); effect-scope `runScan`/`renderRing`. Relocate/reuse them.
5. Best fix of all: a **robot-free hero clip** would make the overlay trivial — see Assets note.

## Environment quirks (WILL waste your time — read this)
- **Preview MCP forces `prefers-reduced-motion: reduce`** → CSS animations freeze in preview; anime.js (JS) still runs. Verify motion by reading DOM/transforms via `preview_eval`, not by trusting the static look.
- **Screenshots hang** when the page has perpetual rAF (cursor loop, anime idle, canvas). Workaround: after the sequence finishes, `preview_eval`: `window.requestAnimationFrame=()=>0; document.querySelectorAll('*').forEach(e=>e.style.animationPlayState='paused'); document.querySelector('video')?.pause()`, THEN `preview_screenshot`. Also the renderer **wedges after many reloads** → `preview_stop` + `preview_start` for a fresh one.
- **OneDrive + `.next`**: `next dev` after a `next build` throws `EINVAL readlink .next` → always `rm -rf .next` before starting dev. Build and dev contend on `.next`.
- **Bash cwd resets** between calls → prefix with `cd /c/Users/corey/OneDrive/Desktop/signal-flare &&`. Use inline git identity if committing fails: `git -c user.name=Claude -c user.email=noreply@anthropic.com ...` (already set locally though).
- To view: load fresh for the intro, or click `#skip`. Video robot settles ~8 s.
- Build gate: `npm run build` (passes clean as of d236558). LF→CRLF git warnings are harmless.

## NON-NEGOTIABLE doctrine
- Pricing: **$1,250** 7-Day Rebuild · **$2,500** Foundation (flagship) · **$797/mo** Stay Found.
- Guarantee = **delivery-based only** — never rankings/leads/revenue/citations.
- Never name GoHighLevel / GHL / LeadConnector in client-facing copy.
- Contact **hello@signalflair.ai**. (DEPRECATED: `create@mentalvision.ai`.)
- Score model 0–100, 7 categories, bands: **Invisible 0–39 · Weak 40–64 · Partially Visible 65–84 · AI-Ready 85–100** (the ring's color zones use these).
- Dark = near-black **#0A0806** (not pure black). Pink **#FF1177** alerts-only. Fonts: Bebas Neue / DM Serif Display / DM Mono / Barlow Condensed.

## Assets
- `public/video/signal-flair-hero.mp4` — 3.3 MB 1080p (served hero). The "Upscale_SignalFlaire_Hero.mp4" Corey sent was **byte-identical (md5) to this source** — same video, not a new upscale. A genuinely new clip drops in at this same path with zero code change; **a robot-free clip would simplify the overlay task above.**
- `media-src/` — gitignored 4K source backup.

## Recent git history (master)
```
d236558 robot returns w/ textless head-ring scanner + score pop-up   <- CURRENT (about to be reworked by the next task)
9bc32c2 gauge centerpiece + video grade, robot retired
76e9ff8 Port bold redesign to React as canonical homepage
3b3bd14 bold.html with video wired in
```
Clean rollback baseline: commit `0e1cc47`.

---
That's everything a fresh session needs. Jump straight to the IMMEDIATE NEXT TASK.
