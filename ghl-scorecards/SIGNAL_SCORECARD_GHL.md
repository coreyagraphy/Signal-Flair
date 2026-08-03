# Signal Scorecard — CRM implementation guide

Email-safe HTML Signal Scorecards you paste into a CRM email template. Rebuilt from the
prior Proof OS scorecard + JARVIS OS outreach card, re-engineered so they actually render
in Gmail/Outlook (table layout, 100% inline CSS, no head-styles, no CSS grid/flex, no SVG,
no webfonts, no external images).

## Two ways to deliver a scorecard

**1. Premium hosted page (the ring-gauge look — RECOMMENDED).** A live page at
`https://signalflair.ai/scorecard/` renders the full premium scorecard (dark, Instrument Serif,
the gradient ring gauge, neon-accented six layers) from URL parameters. The CRM email is just a
short note with a **button linking to that URL with merge fields** — the lead's numbers fill in
per-lead. This is the only way to get the gauge/gradients/serif look (email clients strip them).
Page is `noindex`. See "Hosted scorecard URLs" below.

**2. Inline email HTML (renders inside the email, plainer).** Paste one of the table-based HTML
files below straight into an Email Template. No gauge/gradients (email-safe limits), but it shows
up in the email body with zero clicks.

## Files
| File | Use |
|---|---|
| `../src/app/scorecard/page.tsx` | The **premium hosted `/scorecard` page** (route 1). Live in production. |
| `signal-scorecard-full.html` | Inline **full six-layer** email (route 2). You populate the layer scores. |
| `signal-scorecard-pulse.html` | Inline **Signal Pulse™ 4-signal** email (route 2). Auto-fills from the funnel. |
| `_preview-sample.html` | A fake-data render of the inline full card. **Do not** paste this into the CRM. |

## Hosted scorecard URLs (route 1)
Put these behind a button ("View your Signal Scorecard →") in a CRM email. **`company` MUST be
the last parameter** (so a business name with an `&` can't break the link).

**Full six-layer Signal Score™** (you populate the `layer_*` + `signal_score` fields):
```
https://signalflair.ai/scorecard/?score={{contact.signal_score}}&access={{contact.layer_access}}&structure={{contact.layer_structure}}&entity={{contact.layer_entity}}&answers={{contact.layer_answers}}&trust={{contact.layer_trust}}&live={{contact.layer_live}}&date={{contact.scorecard_date}}&company={{contact.company_name}}
```

**Signal Pulse™ (auto, 4 signals)** — Entity Clarity + Live AI Visibility show "Pending" (honest,
since the Pulse only reads 4 of 6 layers):
```
https://signalflair.ai/scorecard/?score={{contact.signal_pulse_score}}&kind=pulse&access={{contact.signal_pulse_access}}&structure={{contact.signal_pulse_structure}}&trust={{contact.signal_pulse_trust}}&answers={{contact.signal_pulse_answers}}&company={{contact.company_name}}
```

With no `score` param the page shows the marketing "SAMPLE READOUT" (87) view.

## How to install a template
1. In the CRM: **Marketing → Emails → Templates → New → Blank/Code**, open the **HTML / code view**.
2. Paste the entire chosen file.
3. Save. The `{{contact.*}}` tags fill per lead automatically; each bar fills to its score %.

---

## Custom fields to create

### For the Pulse scorecard (auto-populated — 4 fields)
Create as **Number** contact fields, then map them in the **Signal Pulse workflow → Create Contact**
step (right where `signal_pulse_score` is mapped). The site already pushes these values as of
2026-07-01 (`signal-pulse.mjs` + the opt-in POST):

| Field key | From payload |
|---|---|
| `signal_pulse_access` | `{{trigger.signal_pulse_access}}` |
| `signal_pulse_structure` | `{{trigger.signal_pulse_structure}}` |
| `signal_pulse_trust` | `{{trigger.signal_pulse_trust}}` |
| `signal_pulse_answers` | `{{trigger.signal_pulse_answers}}` |

(`signal_pulse_score` already exists from the workflow build.)

### For the full Signal Score scorecard (you populate)
Create as **Number** unless noted:

| Field key | Layer |
|---|---|
| `signal_score` | Overall Full Signal Score (0–100) |
| `signal_score_band` | text, e.g. "Signal Weak" *(optional)* |
| `scorecard_date` | text, e.g. "July 1, 2026" *(optional)* |
| `layer_access` | Access & Crawlability |
| `layer_structure` | Structured Intelligence |
| `layer_entity` | Entity Clarity |
| `layer_answers` | Answer Architecture |
| `layer_trust` | Trust & Proof Density |
| `layer_live` | Live AI Visibility |
| `next_step_1` / `next_step_2` / `next_step_3` | text *(optional)* |

`company_name` and `website` are standard CRM contact fields — no need to create them.

---

## How the bars work
Each bar is a two-cell table: the filled cell is `width="{{contact.<field>}}%"` (teal), the rest is
the grey track. So a score of 62 → `width="62%"` → a 62%-filled teal bar. **No math needed** — just
the one score value per signal.

**Pending / empty:** if a field has no value, the bar renders empty (honest "no data") and the number
shows blank — it never fakes a 0. Only send the full scorecard once all six layers are scored.

---

## Delivery — two ways to use these

**A. Inside the Signal Pulse workflow (automated preview).**
Drop `signal-scorecard-pulse.html` into **Email A** (or a new email step) of the Signal Pulse
workflow. Every lead who runs a Pulse gets a branded visual scorecard of their 4 signals with a
CTA to the full Score. Zero manual work once the 4 custom fields are mapped.

**B. As the full Signal Score deliverable (human-verified).**
When you finish a hand-verified six-layer audit, set the `layer_*` fields on that contact, then send
`signal-scorecard-full.html` (as a one-off email or the delivery step of your audit workflow). This is
the "here's your full Signal Score" asset — the payoff for the opt-in.

---

## Guardrails (baked into the copy — keep them)
- **Never name the CRM platform** in any client-facing text. Say "CRM access" internally only.
- **Case Zero = 18/100 on June 6, 2026** is real and published — never change it.
- **No guarantees** of rankings, citations, or AI recommendations. The disclaimer line stays.
- Pulse ≠ Score: the Pulse card says it's an instant automated preview and points to the full
  human-verified Signal Score. Don't present the Pulse as the finished Score.
- Sign-off is the brand chant **"What's your Signal Score?"** (Instrument Serif → Georgia italic
  fallback in email, since email can't load webfonts).

## Notes / limits
- Fonts fall back to the system stack + Georgia italic for the sign-off (email clients don't load
  webfonts) — this is expected and on-brand-adjacent, not a bug.
- Rounded bar corners degrade to square in Outlook desktop — harmless.
- Want the richest fidelity instead (exact site typography, gradients)? The alternative is a hosted
  per-lead page or a rendered PNG from the Proof OS `export:scorecard` pipeline, linked/attached from
  a short email. These email templates are the "works everywhere, native in the CRM" route.
