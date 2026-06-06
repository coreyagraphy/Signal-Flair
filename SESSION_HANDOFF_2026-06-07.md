# Signal Flair — Session Handoff (2026-06-07)

Condensed pickup for the next session. Spans two repos:
**website** = `Desktop\signal-flair` · **outreach pipeline** = `Desktop\mental-vision-pipeline`.

---

## SOURCES OF TRUTH (read these first, in order)
1. `Downloads\SIGNAL_FLAIR_BRIEFING_COMPLETE.md` — the master briefing.
2. `Downloads\files (13).zip` → `SIGNAL_FLAIR_CLAUDE_CODE_PACKAGE.md` — latest update layer (logo + approved cold email). Copy saved at `signal-flair\design-refs\`.
3. Memory notes: `reference_signal_flair_briefing`, `project_signal_flare_website`.

---

## CANONICAL FACTS (locked — do not re-litigate)
- **Two-surface palette (FINAL):**
  - **Website = Cinematic-Brutalism** — cream `#f0ebe0` + dark `#0a0a0a`, yellow `#fff45f`, orange `#ff5a1f`, teal `#00b8a9`; pink/magenta = AI-warning badges. Fonts: Fraunces (display) + Instrument Serif italic + Geist Mono. NO Inter. Flare-V3 dark tokens are DEAD on the website.
  - **Outreach visuals = Flare palette** — teal `#0D9488` / orange `#E85D04` / acid-yellow `#E5FF00` spark / ground `#0E1413`.
- **Pricing (V3):** Build the Foundation $3,500 (0–54) · Start the Rebuild $1,500 (55–74) · Stay Found $600–$1,200/mo (75–100) · Founding Client $1,750 (first 10). DEAD: $2,500/$1,250/$797/$997-flat/$400/$750/$297/$497.
- **Funnel = call-based Field Report:** cold email → reply **"REPORT"** → Field Report (3 badges, no number) → **"See all 6 signals →"** → **GHL-booked call** → live full-audit reveal → score-gated Build. Reply-"YES"/no-call is RETIRED.
- **Brand spelling "Flair" is permanent** (never "Flare"). Never name GoHighLevel client-facing ("CRM access"). Never violet/purple.

---

## DONE THIS SESSION
**Website (`signal-flair`):**
- New logo integrated → `src/components/SignalFlairLogo.tsx` (inline SVG, `onDark` prop), replaced text logo in all 3 spots (hero nav `onDark`, sticky nav light, footer `onDark`). Asset: `public/signal-flair-logo.svg`. Verified via Playwright (3 SVGs, 0 console errors). NOTE: added `onDark` variant because the package's near-black "FLAIR" was illegible on the dark hero/footer.
- LinkedIn wired for entity disambiguation → `https://www.linkedin.com/company/signal-flair-ai` added to Organization `sameAs` in `src/app/layout.tsx` AND `public/llms.txt`. Verified in served HTML.
- CLAUDE.md design + palette sections re-aligned to Cinematic-Brutalism (after a chat directive to go Flare-V3 dark was reversed in favor of the briefing).

**Outreach (`mental-vision-pipeline`):**
- Cold email template APPROVED + wired → `docs/signal-flair-cold-email-template.md` (cold sign-off "Corey / Signal Flair" only; reply "REPORT"; real finding leads; no price/no link/no "book a call").
- Field Report deliverable copy APPROVED + wired → `docs/signal-flair-field-report-spec.md` ("The Field Report deliverable" section: 3 badges only/no composite score, GHL booking CTA, "See all 6 signals").
- `pipeline/email_copy.py` updated (CTA rule 11 → free Field Report; rule 12 sign-off fix; price injection removed; compiles).
- 4 conflicting cold-email doctrines bannered as funnel-superseded + pointed to the new templates: `signal-flare-email-writing-rules.md` (V3.2), `signal-flare-email-doctrine.md`, `signal-flare-doctrine-router.md`, `cold-email-rules.md`. Mechanics (subject scoring, Stop-Slop, 60-word cap, send windows, 85/100 gate) still apply.
- Pricing cascade: `MENTAL_VISION_PRICING_FINAL.md` stubbed; `offer-ladder.md` rewritten to the call-based ladder.

---

## OPEN ITEMS (all gated on Corey)
- [ ] **Tier B positioning docs** — add Field Report as Stage 1 to: `SIGNAL_FLARE_SYSTEM_OVERVIEW.md`, `SIGNAL_FLARE_SYSTEM_ONEPAGER.html`, `README.md`, `MASTER_OPERATING_PROMPT.md`, `skills/mental-vision-offer-hook-engine/SKILL.md`. (Low-risk; can run anytime.)
- [ ] **GHL booking calendar** — Corey sets up, hands link → drop into Field Report CTA (until then: "reply and we'll find 20 minutes" fallback).
- [x] **GHL webhook URL** — ✅ DONE 2026-06-07. Form reads `NEXT_PUBLIC_GHL_WEBHOOK_URL`; **value now SET in Netlify** (verified inlines under real env, grep-only — no push). Demo mode intact when unset; 10s fetch timeout. Committed `dca3bb7`.
- [x] **GA4** — ✅ DONE 2026-06-07. `Analytics.tsx` loader + `lib/analytics.ts` `track()`; events `form_submit` / `cta_click` / `founding_client_click` + auto page_view. **`NEXT_PUBLIC_GA_ID` now SET in Netlify** (`G-5VZR713RKS`; verified real ID injects under env). Committed `dca3bb7`.
- [ ] **More `sameAs`** — Crunchbase, IG/YouTube, Google Business Profile as they go live.
- [ ] **Case Zero** — integrate real 18/100 self-audit into the proof section.
- [ ] **Production deploy** — code committed (`dca3bb7`) + env vars live in Netlify; **only DNS confirm remains.** ⚠️ Deploy via **Netlify build (Path B)** so Netlify env vars inline — a LOCAL `npm run build`+drag (Path A) ships GA/webhook INERT unless a local `.env.local` has both values. No remote configured yet (Path B needs a GitHub/GitLab push first). See `DEPLOY.md`.

---

## HOLDS (do not violate)
- No production `npm run build`/deploy until Corey confirms DNS.
- **Never move nameservers** (kills live email warmup). Repoint A/CNAME only.
- No GHL pushes / no sends.
- HyperForge files + `GoHighLevel_ClaudeCode/` archive = out of scope, do not touch.
- Pricing numbers unchanged without Corey.

---

## DEV / VERIFY NOTES
- Preview MCP is BROKEN on this machine (`spawn cmd.exe ENOENT`). Verify via: `rm -rf .next` then `npm run dev -- -p 3210`, then the Playwright harness at `C:\Users\corey\sf-shot\` (`node shot.mjs` / `shot-logo.mjs`) — it freezes rAF + pauses video before screenshotting (page has perpetual animation that hangs captures).
- Site renders 0 console errors as of this session.
