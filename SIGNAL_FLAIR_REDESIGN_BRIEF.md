# Signal Flair Redesign Brief for Claude Code

## Project
Redesign `signalflair.ai`, the public website for **Signal Flair**, an AI visibility scoring system from Mental Vision.

Signal Flair helps businesses understand whether AI engines can find, read, cite, and recommend them across ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews. The site currently has a strong offer and some cinematic elements, but the visual execution feels too close to generic AI/SaaS templates.

The redesign must make the brand feel proprietary, memorable, and premium while preserving direct-response clarity.

## Core Creative Direction
Build the site as:

> **A luxury diagnostic instrument for AI visibility.**

The aesthetic should combine:

- **Signal:** scoring, proof, diagnostics, visibility data, machine-readable infrastructure, audit logic.
- **Flair:** atypical typography, cinematic tension, editorial drama, strange-but-premium art direction.

Avoid the standard AI landing page language of soft gradients, glowing cards, rounded SaaS buttons, friendly pastel dashboards, and generic “future of AI” visuals.

Use this framing:

> **Cinematic Brutalism + Direct Response clarity + Editorial Flair**

## Brand Thesis
Signal Flair is a play on words. The design should make that visible.

**Signal** is the measurable layer:

- AI visibility score
- crawler access
- `llms.txt`
- schema markup
- citation presence
- entity clarity
- engine-by-engine findings

**Flair** is the expressive layer:

- dramatic typography
- visual confidence
- style as differentiation
- memorable presentation
- high-contrast editorial rhythm

The site should feel like an AI visibility scan report that was art-directed by someone with taste.

## Current Site Context
The existing production site includes:

- Next.js-style generated assets
- Hero video: `/video/signal-flair-hero.mp4`
- Hero poster: `/video/hero-poster.jpg`
- Canvas elements already present:
  - `<canvas id="flicker-c"></canvas>`
  - `<canvas id="flare-c"></canvas>`
- Custom cursor elements:
  - `<div id="cursor"></div>`
  - `<div id="cursor-ring"></div>`
- Main sections:
  - `#hero`
  - `#ticker`
  - `#problem`
  - `#signal`
  - `#check`
  - `#stats`
  - `#process`
  - `#pricing`
  - `#cta`
  - `#mv-bridge`
  - `footer`
- Existing CSS uses:
  - `Inter`
  - `Geist Mono`
  - `Instrument Serif`
- Current palette includes:
  - dark charcoal
  - cream
  - orange
  - teal
  - pink
  - neon yellow

The current structure can be reused, but the visual system must be overhauled.

## Non-Negotiable Design Goals
1. The page must no longer feel like an AI template.
2. Typography must be atypical and central to the visual identity.
3. The site must still convert. Do not sacrifice clarity for weirdness.
4. Graphics must feel native to the product, not decorative.
5. The user should immediately understand:
   - “AI may not be finding my business.”
   - “Signal Flair can score that.”
   - “Signal Flair can fix the technical visibility gaps.”
6. The site should look premium enough to support $1,500 to $3,500+ offers.

## Visual Positioning
Use the following visual language:

- Diagnostic dossier
- Cinematic instrument panel
- Editorial audit report
- Machine-readable fashion system
- Brutalist score lab
- AI visibility field report

Do **not** make it feel like:

- Generic SaaS
- Cyberpunk gaming UI
- Crypto dashboard
- Vaporwave AI startup
- Soft-gradient agency template
- Overly friendly local marketing page
- A hacker terminal parody

## Typography System
The typography should explicitly express **Signal vs Flair**.

### Signal Type
Use a strict technical mono for:

- navigation
- labels
- eyebrow text
- score data
- audit rows
- table headers
- pricing metadata
- form microcopy
- engine names
- crawler statuses
- CTA command prefixes

Recommended options:

- `JetBrains Mono`
- `Geist Mono`
- `IBM Plex Mono`
- `Space Mono`
- `Berkeley Mono` if available

If using Google Fonts, prefer `JetBrains Mono` or keep `Geist Mono` only if paired with a much more distinctive display typeface.

### Flair Type
Replace the current familiar serif treatment with a more expressive display face for:

- hero headline
- major section titles
- oversized background words
- key brand phrases
- dramatic numerals where appropriate

Recommended direction:

- high-contrast editorial serif
- sharp condensed serif
- warped or irregular display font
- expressive italic for emphasis
- large, uncomfortable scale

Possible font references:

- PP Editorial New style
- Canela style
- Migra style
- Cormorant Garamond only if aggressively styled
- Fraunces only if tuned for weirdness
- Editorial New / fashion-magazine-inspired display
- Variable display font with optical-size contrast

Free-ish fallback stack example:

```css
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&display=swap");

:root {
  --font-signal: "JetBrains Mono", "Geist Mono", ui-monospace, monospace;
  --font-flair: "Fraunces", "Instrument Serif", Georgia, serif;
}
```

Use `Fraunces` with `WONK` and optical sizing if custom fonts are unavailable. If custom fonts are available, choose a more premium editorial display font.

### Typography Rules
- Do not use `Inter` as the main personality of the site.
- Avoid “balanced SaaS” type hierarchy.
- Make display text oversized, sometimes cropped, sometimes bleeding.
- Use mono text for credibility and instrumentation.
- Do not overuse tiny unreadable text. The system can feel technical without becoming illegible.
- Use italics as a “flair” intervention, not as decoration everywhere.
- Letter spacing should be deliberate. Avoid generic wide tracking on everything.

## Layout Direction
Refactor the homepage away from smooth SaaS stacking into a more intentional diagnostic grid.

### Structure
Use:

- visible 1px borders
- asymmetrical paneling
- split-screen sections
- audit report modules
- hard horizontal section cuts
- oversized cropped typography
- data tables that feel designed, not default
- score modules that feel like instruments

### Hero Layout
The hero should feel like a cinematic HUD over real footage.

Suggested layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ SIGNAL FLAIR                         AUDIT / SERVICES / RUN  │
├───────────────────────┬──────────────────────────────────────┤
│ AI VISIBILITY         │                                      │
│ SCORE SYSTEM          │       CINEMATIC VIDEO / FLARE         │
│                       │       WITH HUD GRID OVERLAY           │
│ > RUN SCAN            │                                      │
├───────────────────────┼──────────────────────────────────────┤
│ GPTBot: BLOCKED       │ SCORE: 23 / 100                       │
│ llms.txt: MISSING     │ ChatGPT: 0 citations                  │
│ schema: ABSENT        │ Perplexity: 0 citations               │
└───────────────────────┴──────────────────────────────────────┘
```

The existing hero video should remain important, but it should not make the UI look like a template hero. Treat the video like raw field evidence behind an instrument panel.

### Problem Section
The problem section should not just say “Great business. Weak signal.” It should show the diagnosis.

Replace any generic storytelling layout with:

- “What humans see” vs “What AI sees”
- visible missing infrastructure states
- engine-by-engine result panel
- blocked/missing/absent statuses
- score delta before/after

Example:

```text
HUMAN VIEW
4.8 stars / local trust / good reputation

AI VIEW
GPTBot blocked
llms.txt missing
schema absent
0 citations across 5 engines
```

## Graphics and Visual Assets
The graphics must be product-native.

Use visual motifs such as:

- AI visibility scorecards
- engine citation matrix
- crawler access map
- entity clarity grid
- `llms.txt` file preview
- schema markup fragments
- AI engine response excerpts
- “found / not found” stamps
- signal path diagrams
- diagnostic tags
- scored report cards
- before/after visibility deltas

Avoid:

- abstract glowing orbs
- generic neural network blobs
- floating dashboard cards
- blue-purple gradients
- random AI robot imagery
- decorative waves
- stock business people

### Image Context
Use the existing hero video/poster as atmospheric context, but overlay product-specific graphics.

Recommended image/visual direction:

1. **Cinematic Diagnostic Overlay**
   - Dark footage background
   - Thin white/amber grid lines
   - Cursor spotlight exposing detail
   - Score readout anchored to a hard panel
   - Engine names as scan targets

2. **Editorial Visibility Report**
   - Cream or off-white report background
   - Large black display typography
   - Red/orange stamped failure states
   - Teal recovery states
   - Report rows and marginalia

3. **Signal Map**
   - Business entity at center
   - Lines to AI engines
   - Broken paths for missing schema/crawler blocks
   - Restored paths after Signal Flair

4. **Flair Treatment**
   - One or two expressive typographic moments where words bleed off the viewport
   - Use “FLAIR” as an art object
   - Contrast expressive word shapes against strict audit data

Suggested visual prompt for generating supporting image assets:

```text
High-end cinematic diagnostic interface for an AI visibility scoring system, raw 35mm film texture, dark field footage, sharp brutalist grid overlay, white and amber machine labels, AI engine citation map, luxury editorial typography, no robots, no glowing orb, no generic SaaS dashboard, premium intelligence dossier aesthetic.
```

Suggested poster/hero art direction:

```text
A dark cinematic frame with a localized flare of light revealing technical audit markings over a business listing, thin brutalist grid lines, harsh black negative space, amber and teal diagnostic stamps, editorial fashion-report typography, premium AI visibility scoring brand, not cyberpunk, not crypto, not soft-gradient SaaS.
```

## Color System
Keep a constrained but high-tension palette.

Recommended:

```css
:root {
  --ink: #090807;
  --paper: #f4eadb;
  --paper-hot: #fff45f;
  --signal-orange: #ff5a1f;
  --signal-red: #ff1765;
  --found-teal: #00b8a9;
  --bone: #f8f1e7;
  --line-dark: rgba(9, 8, 7, 0.16);
  --line-light: rgba(248, 241, 231, 0.16);
}
```

Use neon yellow sparingly. It is powerful, but it can become gimmicky.

Use orange/red for missing, blocked, invisible, critical.

Use teal for found, indexed, readable, fixed.

Use cream/paper sections as report surfaces.

Use dark sections as scan surfaces.

## CTA Direction
Replace rounded SaaS pills with command-style CTAs.

Do not make CTAs confusing. Keep them obvious and clickable.

Good:

```text
> RUN VISIBILITY SCAN
> SEE WHAT AI SEES
> BUILD THE FOUNDATION
> STAY FOUND
```

Avoid overusing:

```text
> RUN_VISIBILITY_SCAN [Click to Execute]
```

That can be used as a hover detail or secondary microcopy, but not every CTA should look like a hacker joke.

CTA styling:

- rectangular
- hard borders
- mono text
- no pill radius
- clear hover state
- subtle scan/flicker on hover if performant
- maintain accessibility contrast

## Motion and Interaction
Motion should communicate scanning, detection, and signal recovery.

Use:

- subtle cursor flare/spotlight
- score count-up
- scanline sweep on diagnostic panels
- status changes from blocked/missing to found/live
- restrained flicker on failure states
- hero HUD parallax if performant

Avoid:

- excessive glitch everywhere
- liquid distortion on every link
- motion that prevents reading
- long intro animations that delay conversion
- heavy WebGL unless it is stable and performant

### Cursor Flare
The existing cursor/canvas elements can support a flare effect.

Implement a lightweight version first:

- CSS radial-gradient spotlight following cursor
- optional canvas noise/flicker
- disabled or reduced on mobile
- respects `prefers-reduced-motion`

Example approach:

```css
#hero::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      420px circle at var(--mx, 50%) var(--my, 42%),
      rgba(255, 244, 95, 0.16),
      rgba(255, 90, 31, 0.08) 28%,
      transparent 62%
    );
  mix-blend-mode: screen;
  opacity: 0.9;
  z-index: 3;
}
```

```js
window.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
  document.documentElement.style.setProperty("--my", `${event.clientY}px`);
});
```

Only add WebGL if it does not harm load, scroll, or accessibility.

## Section-by-Section Implementation Guidance

### Hero
Goal: Make the first viewport feel like an AI visibility instrument.

Required changes:

- Replace current centered SaaS composition with split diagnostic grid.
- Keep the video background, but darken and frame it with technical panel borders.
- Make the score module more instrument-like.
- Add engine-by-engine statuses near the score.
- Use one massive expressive “FLAIR” or “FOUND” typographic element partially cropped.
- Use command-style primary CTA.

Hero should answer:

- What is this?
- Why should I care?
- What is my risk?
- What action do I take?

Suggested hero copy:

```text
AI VISIBILITY SCORE SYSTEM

Your business may be trusted by humans and invisible to AI.

We scan ChatGPT, Claude, Perplexity, Gemini, and Google AI to see whether they can find, read, cite, and recommend you.

> RUN VISIBILITY SCAN
```

### Ticker
Keep a ticker only if it feels like system telemetry, not decoration.

Reduce the “marquee trend” feeling by:

- making it smaller
- treating it like a data feed
- using mono labels
- adding separators, timestamps, or status codes

Example:

```text
[GPTBot: CHECK] [llms.txt: VERIFY] [Schema: PARSE] [Claude: CITE] [Perplexity: TRACE]
```

### Problem
Make it evidence-first.

Use a before/after or human/AI comparison:

- Humans see: reviews, reputation, service quality
- AI sees: blocked crawler, missing schema, missing citations

### Services
Current three-part service architecture is good:

1. AI Visibility Audit
2. Foundation Build
3. Stay Found System

Keep it, but present it like an operating protocol.

Suggested label:

```text
PROTOCOL 01 / SCORE
PROTOCOL 02 / STRUCTURE
PROTOCOL 03 / STAY FOUND
```

### What We Check
This section is important. Make it feel like a real scorecard/report.

Improve:

- table readability
- status hierarchy
- severity labels
- actual scan categories

Potential categories:

- AI Search Presence
- Crawl Readiness
- Entity Clarity
- Structured Data
- Review Signal
- Authority Content
- Conversion Proof

### Stats
Use stats carefully. Current claims such as “4M AI searches per day” need source confidence if kept.

If uncertain, reframe as internal/product stats:

- 5 AI engines scanned
- 7 visibility categories
- 0-100 score
- 7-14 day foundation build

### Pricing
Keep pricing direct and visible.

Make pricing cards less SaaS-card-like:

- use report panels
- hard borders
- score ranges as triage bands
- show “recommended if your score is X”

Suggested labels:

```text
TRIAGE BAND 01 / SCORE 0-54
Foundation Build

TRIAGE BAND 02 / SCORE 55-74
Start the Rebuild

TRIAGE BAND 03 / SCORE 75-100
Stay Found System
```

### CTA
Make the final CTA stark and memorable.

Suggested:

```text
CAN AI FIND YOU RIGHT NOW?

Run the scan. See the score. Fix the signal.

> RUN VISIBILITY SCAN
```

## Copy Tone
Use language that is:

- direct
- diagnostic
- confident
- slightly cinematic
- not fluffy
- not generic AI hype

Avoid:

- “Unlock the power of AI”
- “Transform your digital presence”
- “Harness cutting-edge technology”
- “Supercharge your visibility”

Prefer:

- “AI cannot recommend what it cannot read.”
- “Trusted locally. Invisible to AI.”
- “We score what AI sees.”
- “Crawler blocked. Schema absent. Citations missing.”
- “Your signal is fixable.”
- “Be found. Be read. Be recommended.”

## Accessibility and Performance Requirements
- Maintain strong contrast.
- Ensure all text remains readable on mobile.
- Do not hide core content behind animation.
- Respect `prefers-reduced-motion`.
- Do not require custom cursor for usability.
- Avoid expensive continuous WebGL on low-powered devices.
- Keep CTA targets obvious.
- Ensure keyboard focus states are visible and match the design language.
- Test desktop and mobile.

## Technical Instructions for Claude Code
1. Locate the source files for the homepage and global CSS.
2. Do not edit generated build artifacts if source files are available.
3. Preserve the existing content architecture unless a small markup change is needed for the new layout.
4. Replace the visual system through source CSS/components.
5. Add any lightweight JavaScript needed for cursor flare or scan effects.
6. Keep changes scoped to the public site redesign.
7. Do not add heavy dependencies unless necessary.
8. Prefer CSS and small React/JS changes over complex animation frameworks.
9. Verify responsive behavior.
10. Run the project build/lint checks if available.

## Implementation Priorities
Work in this order:

1. Typography system and CSS variables.
2. Hero redesign.
3. CTA/button redesign.
4. Problem section as diagnostic proof.
5. Scorecard/table visual refresh.
6. Pricing triage panels.
7. Motion/cursor flare.
8. Mobile tuning.
9. Accessibility pass.
10. Build verification.

## Acceptance Criteria
The redesign is successful when:

- The homepage no longer resembles a generic AI/SaaS template.
- The wordplay “Signal Flair” is visually clear.
- The typography feels distinctive and memorable.
- The hero communicates AI visibility scoring within 5 seconds.
- The graphics look like actual visibility diagnostics.
- CTAs are command-like but still obvious.
- Pricing still feels trustworthy and premium.
- The site works on mobile without cramped or overlapping text.
- Motion enhances the scan concept without getting in the way.
- The final design feels like a premium intelligence product, not a decorative agency page.

## Final Creative North Star
Do not make Signal Flair merely “pretty.”

Make it feel like the business has stepped into a machine that can finally show what AI sees.

The user should leave thinking:

> “This company can see something about my business that I cannot see myself.”

