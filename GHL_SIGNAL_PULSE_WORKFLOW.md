# Signal Pulse — GHL Workflow Build Sheet (current, complete)

Durable spec for the **Signal Pulse** workflow (Inbound Webhook trigger already built +
published; webhook ID `735b672e-53a0-433f-985a-0c69020a446c`). Everything below — custom
fields, mapping, branching, and all three emails (Email A now includes the live scorecard
button) — is current as of 2026-07-01. Rebuild the body from this if it ever gets wiped again.

A ready-to-paste prompt for GHL's **"Ask AI"** workflow builder is at the bottom of this file.

---

## 0. Custom fields to create first
GHL → Settings → Custom Fields → add these (Contact fields). Field KEY must match the
inbound payload key exactly so mapping is clean. `signal_pulse_score` already exists from
the original workflow build — the other 7 below are what's missing:

| Label | Key | Type |
|---|---|---|
| Signal Pulse Score | `signal_pulse_score` | Number *(already exists)* |
| Signal Pulse Access | `signal_pulse_access` | Number |
| Signal Pulse Structure | `signal_pulse_structure` | Number |
| Signal Pulse Trust | `signal_pulse_trust` | Number |
| Signal Pulse Answers | `signal_pulse_answers` | Number |
| Signal Pulse Buckets | `signal_pulse_buckets` | Text (single line) |
| Full Score Optin | `full_score_optin` | Text |
| Signal Pulse Signals | `signal_pulse_signals` | Text (multi-line) |

Website maps to the **standard** Website field (`website_url` → Website).
Company maps to the **standard** Company Name / Business Name field (`business_name` or
however your Create Contact step currently maps it → Company Name).

---

## 1. Trigger (DONE)
- Type: **Inbound Webhook** — name "Signal Pulse"
- URL: `https://services.leadconnectorhq.com/hooks/dmPSx68yJZdbLgQY5Osd/webhook-trigger/735b672e-53a0-433f-985a-0c69020a446c`
- Mapping reference: the sample request already selected.
- **Settings → Allow re-entry: ON** (a visitor who opts in fires the webhook twice — base submit, then opt-in click).

## 2. Update Contact (upsert by email)
Map inbound → contact:
- `email` → Email
- `website_url` → Website
- `signal_pulse_score` → Signal Pulse Score
- `signal_pulse_access` → Signal Pulse Access
- `signal_pulse_structure` → Signal Pulse Structure
- `signal_pulse_trust` → Signal Pulse Trust
- `signal_pulse_answers` → Signal Pulse Answers
- `signal_pulse_buckets` → Signal Pulse Buckets
- `full_score_optin` → Full Score Optin
- `signal_pulse_signals` → Signal Pulse Signals (blank on base submits — fine)

## 3. Drop internal tests
**IF** Email **contains** `@signalflair.ai` → **End**.

## 4. Branch: did they opt in for the full Score?
**IF/ELSE** on `full_score_optin` **is** `yes` (opt-in POST also sends `source = signal-pulse-optin`).

### Branch A — OPT-IN (yes)
1. Add Tag: `Signal Score Optin`
2. Send **Email B** (full Score is being prepared)
3. Create internal task / notify Corey: "Deliver human-verified full Signal Score for {{contact.website}}"
4. End

### Branch B — PREVIEW ONLY (else)
1. Add Tag: `Signal Pulse Request`
2. Send **Email A** (their Pulse + the scorecard link + invite to get the full Score)
3. **Wait 1 day**
4. **IF** contact has tag `Signal Score Optin` → **End** (they opted in meanwhile — Branch A handled them; no double-nudge)
5. **ELSE** Send **Email C** (reminder) → End

---

## Emails
Never name the CRM platform. No ranking/visibility guarantees. Score merge = `{{contact.signal_pulse_score}}`, site = `{{contact.website}}`.

### Email A — "Your Signal Pulse™ score is in"
**Use the HTML version — it has the scorecard button.** Paste the whole file
`ghl-scorecards/email-a-pulse.html` into Email A's **HTML/code view** (not the plain-text below).
It includes a teal **"View your Signal Scorecard →"** button linking to:
```
https://signalflair.ai/scorecard/?score={{contact.signal_pulse_score}}&kind=pulse&access={{contact.signal_pulse_access}}&structure={{contact.signal_pulse_structure}}&trust={{contact.signal_pulse_trust}}&answers={{contact.signal_pulse_answers}}&company={{contact.company_name}}
```
That opens the lead's live, personalized, tier-colored scorecard (Level 1 of 2 — two layers
show locked, teeing up the full Signal Score). `company` must stay **last** in the URL so a
business name with "&" in it doesn't break the link.

**Subject:** Your Signal Pulse™ score is in

Plain-text fallback (only if you don't want to use the HTML file):

Hi there,

You just ran a Signal Pulse™ on {{contact.website}} — here's what it means.

**Your Signal Pulse: {{contact.signal_pulse_score}}/100.** That's an instant, automated read of
the first signals AI answer engines (ChatGPT, Claude, Perplexity, Gemini) use to find and
understand your site: access, structure, trust, and answers.

It's a preview — not the full picture. The complete **Signal Score™** measures all six layers
of the Signal Protocol™ and is verified by hand, not a script. That's where you see exactly
what's keeping your site from being surfaced by AI, and what to fix first.

Want your full Signal Score™? Just reply **YES** and I'll get it started — no call required.

— Corey Ellis
Signal Flair · hello@signalflair.ai

### Email B — "Your full Signal Score™ is on the way"
**Subject:** Your full Signal Score™ is on the way

Hi there,

Got it — you're in. Your full **Signal Score™** for {{contact.website}} is being prepared.

Here's what happens next: I verify all six layers of the Signal Protocol™ by hand — Access &
Crawlability, Structured Intelligence, Entity Clarity, Answer Architecture, Trust & Proof
Density, and Live AI Visibility — and send back your complete breakdown with the specific
gaps and the order to fix them.

Because every Score is checked by a person (not auto-generated), give it up to one business
day. No call required — it lands in your inbox.

Questions in the meantime? Just reply.

— Corey Ellis
Signal Flair · hello@signalflair.ai

### Email C — "Still want the full picture on {{contact.website}}?"
**Subject:** Still want the full picture on {{contact.website}}?

Hi there,

Yesterday you ran a Signal Pulse™ on {{contact.website}} and scored
{{contact.signal_pulse_score}}/100.

That number is just the surface — the first four signals, read automatically. The full
**Signal Score™** checks all six layers by hand and shows you exactly why AI engines do (or
don't) surface your business, plus what to fix first.

It's free, and there's no call. Reply **YES** and I'll prepare your full breakdown.

— Corey Ellis
Signal Flair · hello@signalflair.ai

---

## Site wiring (already done — no action needed)
`NEXT_PUBLIC_SIGNAL_PULSE_WEBHOOK_URL` + `SIGNAL_PULSE_WEBHOOK_URL` are already set and
deployed, pointing the live site at this workflow's webhook. Nothing to redeploy for the CRM
side of this build.

---

## ⭐ Paste-ready prompt for GHL's "Ask AI" workflow builder

Copy everything in the box below into the Ask AI / automated builder for the **Signal Pulse**
workflow (the one whose Inbound Webhook trigger is already published). It rebuilds the fields,
mapping, branching, and emails from scratch if needed.

```
Set up the "Signal Pulse" workflow. It already has a published Inbound Webhook trigger named
"Signal Pulse" — do not touch or replace the trigger. Build everything after it:

1. Create these Contact custom fields if they don't already exist (signal_pulse_score already
   exists — skip it):
   - Signal Pulse Access, key signal_pulse_access, type Number
   - Signal Pulse Structure, key signal_pulse_structure, type Number
   - Signal Pulse Trust, key signal_pulse_trust, type Number
   - Signal Pulse Answers, key signal_pulse_answers, type Number
   - Signal Pulse Buckets, key signal_pulse_buckets, type Text (single line)
   - Full Score Optin, key full_score_optin, type Text
   - Signal Pulse Signals, key signal_pulse_signals, type Text (multi-line)

2. Add a "Create/Update Contact" (upsert by email) action mapping these inbound webhook
   fields onto the contact: email -> Email, website_url -> Website, signal_pulse_score ->
   Signal Pulse Score, signal_pulse_access -> Signal Pulse Access, signal_pulse_structure ->
   Signal Pulse Structure, signal_pulse_trust -> Signal Pulse Trust, signal_pulse_answers ->
   Signal Pulse Answers, signal_pulse_buckets -> Signal Pulse Buckets, full_score_optin ->
   Full Score Optin, signal_pulse_signals -> Signal Pulse Signals.

3. Add an If/Else: IF Email contains "@signalflair.ai" -> End. Otherwise continue.

4. Add an If/Else on full_score_optin equals "yes":

   TRUE branch (they opted in for the full Score):
   - Add tag "Signal Score Optin"
   - Send Email B (below)
   - Create an internal task assigned to Corey: "Deliver human-verified full Signal Score for
     {{contact.website}}"
   - End

   FALSE branch (preview only):
   - Add tag "Signal Pulse Request"
   - Send Email A (below, as HTML — it contains a button)
   - Wait 1 day
   - If/Else: contact has tag "Signal Score Optin"? TRUE = End. FALSE = Send Email C (below) -> End

5. Enable "Allow re-entry" on the workflow so a contact who submits and later opts in can pass
   through twice.

6. Never name any CRM or marketing platform in the email copy. Make no guarantees of search
   rankings, citations, or AI recommendations. Sign every email as Corey Ellis / Signal Flair.

EMAIL A — Subject: "Your Signal Pulse™ score is in"
Send as HTML (paste this exact HTML into the email's code/HTML view, don't rewrite it):

<!--PASTE THE FULL CONTENTS OF ghl-scorecards/email-a-pulse.html HERE-->

EMAIL B — Subject: "Your full Signal Score™ is on the way"
Hi there,

Got it — you're in. Your full Signal Score™ for {{contact.website}} is being prepared.

Here's what happens next: I verify all six layers of the Signal Protocol™ by hand — Access &
Crawlability, Structured Intelligence, Entity Clarity, Answer Architecture, Trust & Proof
Density, and Live AI Visibility — and send back your complete breakdown with the specific
gaps and the order to fix them.

Because every Score is checked by a person, give it up to one business day. No call required
— it lands in your inbox.

Questions in the meantime? Just reply.

— Corey Ellis
Signal Flair · hello@signalflair.ai

EMAIL C — Subject: "Still want the full picture on {{contact.website}}?"
Hi there,

Yesterday you ran a Signal Pulse™ on {{contact.website}} and scored
{{contact.signal_pulse_score}}/100.

That number is just the surface — the first four signals, read automatically. The full
Signal Score™ checks all six layers by hand and shows you exactly why AI engines do (or
don't) surface your business, plus what to fix first.

It's free, and there's no call. Reply YES and I'll prepare your full breakdown.

— Corey Ellis
Signal Flair · hello@signalflair.ai

Publish the workflow when done.
```

**Note on Email A:** GHL's Ask AI builder can't reach your local files, so when you paste the
prompt above, open `ghl-scorecards/email-a-pulse.html` in a text editor, copy its full contents,
and paste them in place of the `<!--PASTE THE FULL CONTENTS...-->` line before sending the
prompt to Ask AI (or paste that HTML directly into Email A's code view afterward — either
order works).
