# 06 — Crunchbase (20 min)

Why: Crunchbase is one of the highest-weight entity sources answer engines cross-check — SignalFlare.ai has a profile; you don't. Heads-up: a **different Corey Ellis** (Growcer CEO) is already on Crunchbase — create your own person profile with photo + LinkedIn link so engines keep you distinct.

1. Go to https://www.crunchbase.com → create/log in → "Add a Company".
2. Fields:

| Field | Value |
|---|---|
| Company name | `Signal Flair` |
| Website | `https://signalflair.ai` |
| Headquarters | `Indianapolis, Indiana, United States` |
| Founded | `2026` |
| Founder | Corey Ellis (link/create your person profile, with headshot) |
| Industries | Marketing · SEO · Artificial Intelligence |
| Contact email | `hello@signalflair.ai` |
| LinkedIn | `https://www.linkedin.com/company/signal-flair-ai` |
| Logo | `signal-flair-logo.svg` (in `Desktop\signal-flair\public\`) |

3. Description (paste):
```
Signal Flair builds AI Proof Infrastructure™ — measuring AI readiness with the 0–100 Signal Score™ and building the proof layer (llms.txt, schema markup, entity clarity, trust signals) that AI answer engines like ChatGPT, Claude, Perplexity, Gemini, and Google AI need to find, verify, and recommend a business. Based in Indianapolis, Indiana, serving the United States. A Mental Vision company. Not affiliated with SignalFlare.ai.
```

4. **After it's live: send Claude the final Crunchbase URL.** The schema has a marked spot waiting to re-add it to `sameAs` (it was removed because the profile didn't exist — dead links read as fake corroboration).

**Done =** profile live with your person profile attached; URL handed to Claude; redeployed.
