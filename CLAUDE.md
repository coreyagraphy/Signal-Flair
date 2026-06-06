# Signal Flair Website — Claude Code

⚠️ **This project's old master spec was OBSOLETE and has been removed.** It described the
pre-rebrand Mental Vision site (ORB-01 robot, old fonts, old pricing, "Signal Flare" spelling).
Do **not** follow it.

## Source of truth
Read **`SESSION_HANDOFF.md`** in this repo. It is authoritative. Highlights:

- **Brand:** **Signal Flair** (the misspelling is intentional and permanent — never autocorrect to "Flare"). Standalone AI-Visibility/AEO product brand; a Mental Vision Corp product.
- **Canonical page:** `src/components/SignalFlairLanding.tsx` (whole page in JSX + one anime.js `useEffect`, `@ts-nocheck`) + `src/app/globals.css`. `src/app/page.tsx` renders only `SignalFlairLanding`. *(Renamed 2026-05-31 from `BoldHome.tsx`.)*
- **Pricing (system-wide canonical):** Tier 1 Build the Foundation **$3,500** (score 0–54) · Tier 2 Start the Rebuild **$1,500** (55–74) · Tier 3 Stay Found System **$600–$1,200/mo** (75–100).
- **Fonts:** Instrument Serif (display) · Geist Mono (mono/scores) · Inter (body).
- **Contacts:** hello@signalflair.ai · connect@signalflair.ai. Domain: signalflair.ai.
- **Rules:** never name GoHighLevel/GHL client-facing (render CRM as "CRM access"); Mental Vision appears only in the footer attribution + the one content bridge.
- **Run:** preview MCP launch **"Signal Flair (Next.js)"** (port 3210). `rm -rf .next` before `next dev` (OneDrive EINVAL).

*Signal Flair · a Mental Vision Corp product · signalflair.ai*
