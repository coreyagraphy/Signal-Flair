# Signal Flair — Canonical Entity Kit
**Purpose:** break the AI entity collision (AI thinks "Signal Flair" = the medical MRI term **FLAIR**)
by saturating the web's entity graph with one consistent identity. Paste this across Google Business
Profile, LinkedIn, Crunchbase, Bing, and agency directories.

> Generated 2026-06-07. Source of truth for off-site identity. Keep it in sync with the on-site
> schema in `src/app/layout.tsx`.

---

## THE ONE RULE

**Lock the facts. Vary the prose.**

- **NAP must be byte-for-byte identical everywhere** — Name, "address"/locality, Phone, URL.
  Inconsistent NAP is what *keeps* the collision alive; identical NAP is what resolves the entity.
- **The disambiguation line is pasted verbatim, everywhere.** It is the antidote. Do not reword it.
- **The descriptive paragraph may be reworded** per platform (pick the length that fits the field).
  Directories down-rank copy-pasted prose, so use the length variants below — but never change the
  facts or drop the disambiguation line.

---

## 1. CANONICAL NAP / IDENTITY (paste verbatim)

```
Name:           Signal Flair
Category:       AI Visibility & Answer Engine Optimization (AEO) agency
Parent company: Mental Vision
Founder:        Corey Ellis
Founded:        2026
Location:       Brownsburg, Indiana, United States
Service area:   United States — nationwide (remote)
Website:        https://signalflair.ai
Email:          hello@signalflair.ai
Phone:          ⚠️ NEEDS COREY — see "What you must provide" below
```

**Use `hello@signalflair.ai`** as the public contact on every profile (inside GHL — Field Report,
intake, form fallback). Outside/non-GHL outreach uses `outreach@trysignalflair.com` — not on public
profiles unless Corey explicitly chooses it for a non-GHL experiment.

---

## 2. THE DISAMBIGUATION LINE (paste verbatim — this is the fix)

> Signal Flair is an AI visibility / Answer Engine Optimization (AEO) agency in Brownsburg, Indiana.
> It is not the medical imaging term FLAIR (Fluid-Attenuated Inversion Recovery), and is unrelated to
> SignalFlare.ai.

Append this sentence to every "About" / description field that has room. If a field is too short for
the full sentence, use the short form: **"AI visibility agency — not the FLAIR MRI term."**

---

## 3. DESCRIPTION VARIANTS (pick by field length)

**Tagline (≤10 words):**
> Your business, found by AI. — AI visibility, Brownsburg, Indiana.

**Short (~160 chars — meta/Bing/short bios):**
> Signal Flair is a Brownsburg, Indiana AI visibility (AEO) agency. We make local service businesses
> findable and citable across ChatGPT, Claude, Gemini, Perplexity & Google AI.

**Medium (~300 chars — directory listings):**
> Signal Flair is an AI visibility and Answer Engine Optimization (AEO) agency in Brownsburg,
> Indiana, and a product of Mental Vision. We score how findable a local service business is to
> AI answer engines — ChatGPT, Claude, Gemini, Perplexity, and Google AI Overviews — then build the
> structured record those engines need to find, trust, and recommend it. Not the FLAIR MRI term.

**Long (~640 chars — Crunchbase / Google Business Profile, 750 max):**
> Signal Flair is an AI visibility and Answer Engine Optimization (AEO) agency in Brownsburg,
> Indiana — a product of Mental Vision, founded by Corey Ellis. We make local service businesses
> findable, trustworthy, and citable across the AI answer engines that now route customers: ChatGPT,
> Claude, Gemini, Perplexity, and Google AI Overviews. We score a business 0–100 across six signals,
> fix the gaps with structured data, llms.txt, and crawler access, then keep the signal strong.
> Note: Signal Flair is a marketing agency — it is not the medical imaging term FLAIR
> (Fluid-Attenuated Inversion Recovery), and is unrelated to SignalFlare.ai.

*(Google Business Profile: put the website in the dedicated Website field, not in the description.)*

---

## 4. CATEGORIES / TAGS (per platform)

- **Google Business Profile** — Primary: **Marketing agency**. Secondary: *Internet marketing service*,
  *Marketing consultant*. (The "Marketing agency" category itself reinforces "agency, not a medical term.")
- **Crunchbase** — Type: Company. Categories: *Marketing, Artificial Intelligence, SEO, Digital Marketing,
  Advertising*. HQ: Brownsburg, Indiana.
- **Clutch / Manifest / DesignRush / UpCity** — *Digital Marketing → SEO / AI*, Brownsburg, Indiana.
- **LinkedIn** — Industry: *Marketing Services*. Location: Brownsburg, Indiana.

---

## 5. CROSS-LINK GRAPH (link each profile to the others)

Every profile's "links/social" section should point at these — that's how the entity graph forms:

```
https://signalflair.ai
https://signalflair.ai/proof/
https://www.linkedin.com/company/signal-flair-ai
https://mentalvision.ai          (parent company)
[Crunchbase URL — add once created]
[Google Business Profile URL — add once created]
```

Mirror these back into `sameAs` in `src/app/layout.tsx` as each new profile goes live (Crunchbase and
GBP especially — they feed the knowledge graph).

---

## 6. PRIORITY TARGET LIST (do in this order)

**Tier A — Entity graph (highest impact; these feed AI knowledge). Do first.**
1. **Google Business Profile** — google.com/business — Knowledge Graph + local. *(needs phone)*
2. **LinkedIn company page** — EXISTS → update the tagline, About (Long variant), and location with this kit.
3. **Bing Places** — bingplaces.com — feeds Copilot (you already pinged IndexNow; this reinforces it).
4. **Crunchbase** — crunchbase.com/add-new — explicitly feeds AI training corpora.
5. **Apple Business Connect** — businessconnect.apple.com — Apple Maps / Siri.

**Tier B — Agency authority directories (citations + DR).**
6. Clutch.co  ·  7. The Manifest (themanifest.com)  ·  8. DesignRush  ·  9. UpCity  ·  10. GoodFirms

**Tier C — Local Brownsburg, Indiana (wins "Brownsburg, Indiana AI visibility" queries).**
11. Indy Chamber directory  ·  12. Yelp for Business  ·  13. local Brownsburg, Indiana business listings

**Later (high value, needs notability/press first):**
- **Wikidata** — the strongest knowledge-graph signal, but an item can be deleted if non-notable.
  Revisit once you have press coverage or a few authoritative citations.

---

## 7. REVIEWS (activates the agency profiles — real clients only)

Clutch and Google profiles are weak without reviews. As your first Founding Clients finish, ask each
for one **Google review** and one **Clutch review**. Target 3–5 on each. Never fabricate — that breaks
the trust-mark doctrine and the whole positioning.

---

## 8. WHAT YOU MUST PROVIDE (blocks Tier A)

1. **A business phone number.** Google Business Profile and Bing Places both require one to verify.
   If you don't want to use a personal line, a Google Voice number works. *(Until then, GBP can't go live.)*
2. **Address decision.** Recommend running as a **service-area business** (Brownsburg, Indiana, no public street
   address shown) — GBP supports this. If you have a real business address, list it consistently; if not,
   do NOT invent one.

---

## 9. CONSISTENCY CHECKLIST (before submitting each profile)

- [ ] Name is exactly `Signal Flair` (not "SignalFlair", not "Signal Flare")
- [ ] Locality is exactly `Brownsburg, Indiana, United States`
- [ ] Phone + website match the canonical block byte-for-byte
- [ ] The disambiguation line is present (full or short form)
- [ ] Category names the entity as an *agency / marketing* (reinforces "not a medical term")
- [ ] Links section cross-references the other profiles
- [ ] Prose length fits the field (didn't paste the same paragraph as the last directory)
