# SIGNAL FLAIR — CLAUDE CODE UPDATE PACKAGE
# Session: 2026-06-07
# Read this before touching any Signal Flair file.

---

## 1. NEW LOGO — INTEGRATE NOW

### Files delivered
- `signal-flair-logo.svg` — SVG recreation, transparent background, works on cream + dark
- `signal-flair-logo-concept.jpg` — AI-generated concept reference (the direction Corey approved)

### What it looks like
- "SIGNAL" — small, teal (`#00b8a9`), monospace/tech, wide letter-spacing, circuit dots as leader
- "FLAIR" — large, dominant, near-black (`#1a1209`), heavy editorial serif (Fraunces)
- Swoosh — orange-to-yellow gradient arc sweeping under "FLAIR" (the signature flare element)
- No background — transparent, works on both cream and dark surfaces

### Integration instructions

**In the header/nav (Next.js):**
Replace the current "SIGNAL FLAIR" text logo with the SVG.
Use inline SVG (not `<img src>`) so it inherits the page's Fraunces + Geist Mono font loading.

```jsx
// In your header component — replace existing logo text with:
import SignalFlairLogo from '@/components/SignalFlairLogo'

// Or inline the SVG directly into the JSX
```

Create `components/SignalFlairLogo.tsx`:
```tsx
export default function SignalFlairLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 148"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Signal Flair"
    >
      <defs>
        <linearGradient id="flareGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#ff5a1f" stopOpacity="0.15"/>
          <stop offset="25%"  stopColor="#ff5a1f" stopOpacity="0.85"/>
          <stop offset="60%"  stopColor="#fff45f" stopOpacity="1"/>
          <stop offset="85%"  stopColor="#ff5a1f" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="flareGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#fff45f" stopOpacity="0"/>
          <stop offset="30%"  stopColor="#fff45f" stopOpacity="0.4"/>
          <stop offset="65%"  stopColor="#fff45f" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#fff45f" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Circuit dots before SIGNAL */}
      <circle cx="6"  cy="23" r="3"   fill="#00b8a9"/>
      <line   x1="11" y1="23" x2="17" y2="23" stroke="#00b8a9" strokeWidth="1.4"/>
      <circle cx="20" cy="23" r="2"   fill="#00b8a9" opacity="0.7"/>
      <line   x1="24" y1="23" x2="30" y2="23" stroke="#00b8a9" strokeWidth="1.4"/>
      <circle cx="33" cy="23" r="1.5" fill="#00b8a9" opacity="0.45"/>
      {/* SIGNAL */}
      <text x="40" y="32"
        fontFamily="'Geist Mono', 'Courier New', monospace"
        fontWeight="600" fontSize="20" fill="#00b8a9" letterSpacing="7">
        SIGNAL
      </text>
      {/* FLAIR */}
      <text x="36" y="128"
        fontFamily="Fraunces, 'Palatino Linotype', Georgia, serif"
        fontWeight="900" fontSize="104" fill="#1a1209" letterSpacing="-1">
        FLAIR
      </text>
      {/* Swoosh */}
      <path d="M 28 118 C 80 100, 170 88, 310 116"
        stroke="url(#flareGrad)" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M 55 114 C 120 98, 200 90, 300 112"
        stroke="url(#flareGrad2)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="38" cy="116" r="3.5" fill="#ff5a1f" opacity="0.7"/>
      <circle cx="38" cy="116" r="6"   fill="#ff5a1f" opacity="0.2"/>
    </svg>
  )
}
```

**Sizing in nav:** Use `height: 48px` with `width: auto` to keep proportions.
On mobile reduce to `height: 36px`.

**On cream sections:** Logo renders natively — dark "FLAIR" on cream background reads clean.
**On dark sections:** Logo renders natively — "SIGNAL" teal + "FLAIR" near-black stays legible.
The SVG has no background, so it adapts to whatever surface it sits on.

**Remove:** The current "SIGNAL FLAIR" text + orange-bordered box logo. Replace entirely.

**Note:** The JPG concept (`signal-flair-logo-concept.jpg`) is reference only — do not use as
an img src in the site. The SVG is the production asset.

---

## 2. COLD EMAIL TEMPLATE — APPROVED. WIRE INTO TEMPLATE DOCS.

### Rules
- Body ≤60 words including greeting + sign-off
- No em-dashes, no AI jargon (no "AI visibility / LLM / agentic / schema")
- One observation, one offer, one question
- CTA = reply `"REPORT"` (never a link — cold links kill deliverability)
- Never include price, offer stack, or "book a call"
- Opening line = real finding from the prospect's pre-send scan. Never generic.
- Sign-off: `Corey` / `Signal Flair` only — never "a Mental Vision Corp product" in cold email

### Opening finding — use the first TRUE one from the scan

```
1. NOT FOUND:       "When a customer asks AI for a [industry] company in [city],
                     [company] doesn't come up. Your competitors do."

2. WRONG BUSINESS:  "Ask AI about [company] and it describes a different business.
                     It doesn't know who you are."

3. COMPETITOR-NAMED:"When AI recommends a [industry] company in [city], it names
                     your competitors, not you."

4. CAN'T BE READ:   "The AI tools your customers use can't even read
                     [company]'s site right now."
```
If none is true from the scan, the prospect does not receive a cold email.

### Subject line formulas (≤55 chars)
```
Trusted in [City]. Invisible to AI.
[X] five-star reviews. AI can't find you.
Your competitors show up in AI. You don't.
[Y] years in [City]. AI doesn't know you exist.
```

### Email 1 — First touch
```
Hey [first_name],

[FINDING LINE — real, from the scan]

That isn't a reviews problem. It's how AI reads your site.

I put together a free Signal Flair Field Report for [company]. It shows exactly
what AI returns when it looks for you, and the one gap costing you the most.

Want it? Just reply "REPORT."

Corey
Signal Flair
```

### Email 2 — T+3 business days, no reply
```
Subject: [company], still want your Field Report?

Hey [first_name],

Sent you a free Signal Flair Field Report a few days back. It shows what AI says
about [company] when a customer asks for a [industry] company in [city].

Still happy to send it. Just reply "REPORT."

Corey
```

### Email 3 — T+4 after Email 2, final touch
```
Subject: Last note on this

Hey [first_name],

Not going to keep emailing. Your Signal Flair Field Report is ready whenever
you want to see what AI says about [company].

Reply anytime and it's yours.

Corey
```

### Inbound variant (website / warm traffic — NOT cold)
```
Get your free Signal Flair Field Report → [signalflair.ai/#cta form]
See exactly what AI returns when it looks for [company].
```

### Send windows
Mon–Fri 8:30–11:30 AM recipient-local (secondary: Mon–Thu 1:00–3:30 PM).
Generate anytime, send in-window only, sequence on business days.
Stop sequence immediately on any reply.

---

## 3. THE FIELD REPORT MODEL — CANONICAL

### What it is
A free 3-signal partial scan. Not the full audit.
Entry point for all cold outreach. Delivers in 24 hours.
Called: **Signal Flair Field Report** (never "free scan" or "free tier").

### The 4-stage ladder
```
Stage 1  Signal Flair Field Report   3-signal partial   Free
Stage 2  Full Signal Audit           All 6 signals      Included in Stage 3/4
Stage 3  Foundation Build            Full install       $3,500 / $1,750 founding
         Start the Rebuild           Core fixes         $1,500
Stage 4  Stay Found System           Monthly ongoing    $600–$1,200/mo
```

### The 3 signals in the Field Report (partial — free)
1. AI Search Presence — can the 5 engines find them?
2. Entity Clarity — are they being confused with a different business?
3. Crawl Readiness — are AI bots blocked from their site?

### What is NEVER in the Field Report
- Schema fix instructions
- Authority Content or Review Signal scores
- Specific technical fixes they could DIY
- The full gap roadmap
- The 90-day action plan

**Rule: give the diagnosis. Never the prescription.**

### Cold-to-close flow
```
Cold email → reply "REPORT"
         → Corey runs 3-signal scan (24hr)
         → Field Report delivered by email
         → Report: partial score + most alarming gap + "3 of 6 signals"
         → CTA: "See the full audit" → books a call
         → Call: full 6-signal reveal → score-gated tier → close
```

---

## 4. PALETTE — TWO SURFACES, TWO PALETTES (FINAL)

### Website — Cinematic-Brutalism
| Token | Hex |
|---|---|
| Yellow | `#fff45f` |
| Orange | `#ff5a1f` |
| Teal | `#00b8a9` |
| Cream | `#f0ebe0` approx |
| Near-black | `#0a0a0a` |
| Pink/magenta | — (AI view warning badges) |

Typography: Fraunces (display) · Instrument Serif italic (accents) · Geist Mono (mono/diagnostic)

### Outreach visuals / score cards / Field Report — Flare palette
| Token | Hex |
|---|---|
| Teal | `#0D9488` |
| Orange | `#E85D04` |
| Acid yellow | `#E5FF00` (thin strokes/glows only — never a fill) |
| Ground | `#0E1413` |

The website earns trust. The outreach creates urgency. Different jobs, different palettes.

---

## 5. PRICING — CANONICAL V3. DO NOT CHANGE.

| Tier | Score | Price | Type |
|---|---|---|---|
| Build the Foundation | 0–54 | $3,500 | One-time |
| Start the Rebuild | 55–74 | $1,500 | One-time |
| Stay Found System | 75–100 | $600–$1,200/mo | Recurring |
| Founding Client | 0–54 | $1,750 (first 10) | One-time |

Dead: `$2,500 / $1,250 / $797 / $997-flat / $400 / $750 / $297 / $497`

---

## 6. WHAT TO DO RIGHT NOW (priority order)

- [ ] Integrate new logo — replace current text logo with `SignalFlairLogo` component
- [ ] Wire cold email template into template docs (sign-off: Corey / Signal Flair only)
- [ ] Wire GHL webhook — form is still in demo mode, leads going nowhere
- [ ] GA4 conversion tracking — form_submit, cta_click, founding_client_click
- [ ] Integrate Case Zero section (real 18/100 self-audit data)

## 7. DO NOT TOUCH

- Nameservers (email warmup live — moving them kills it)
- Pricing numbers without Corey confirming
- HyperForge files (separate brand, out of scope)
- GoHighLevel_ClaudeCode/ archive
- Production deploy until DNS confirmed by Corey
- Field Report content — never give the full fix roadmap in the partial scan

---

*Signal Flair · Mental Vision Corp · Brownsburg, Indiana*
*Package compiled: 2026-06-07*
