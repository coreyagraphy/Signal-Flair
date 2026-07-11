# 05 — LinkedIn: company pages (20 min)

## A. Signal Flair page
Admin: https://www.linkedin.com/company/130684037/admin/ (public URL: linkedin.com/company/signal-flair-ai)

| Field | Change to |
|---|---|
| Tagline | `Your business, found by AI.` |
| Website | `https://signalflair.ai` (drop the www) |
| Founded | `2026` (currently shows 2025 — wrong; site schema + all profiles use 2026) |
| Location | Brownsburg, IN 46112 (already correct — leave) |
| Description | paste block below |

```
Signal Flair builds AI Proof Infrastructure™ — the structured proof layer that helps AI answer engines find, understand, verify, and recommend your business.

When someone asks ChatGPT, Claude, Perplexity, Gemini, or Google AI for a recommendation, those engines only surface businesses they can verify. We measure how clearly AI can read your business with the 0–100 Signal Score™, then build what's missing: llms.txt, schema markup, entity clarity, answer architecture, and trust proof.

We audited ourselves first — Case Zero: an 18/100 baseline (June 2, 2026), rebuilt in public to 73/100 (July 5, 2026) — a model-informed Signal Score™ read, not a live engine test, not a guarantee. The record is public at signalflair.ai/proof.

Answer Engine Optimization (AEO) for local service businesses — HVAC, roofing, dental, legal, home services — based in Brownsburg, Indiana, serving nationwide. All commitments are delivery-based: we build and hand over the infrastructure. We never guarantee rankings, citations, or AI recommendations.

Signal Flair is a Mental Vision company. It is not affiliated with SignalFlare.ai.
```

## B. Mental Vision page
The Signal Flair page currently shows parent = "**Mental Vision Corp** (Indianapolis, IN)" — that's your old page with the retired name.
1. Open that page's admin → rename to **Mental Vision** (drop "Corp") · location → Brownsburg, IN · website → `https://mentalvision.ai`.
2. Paste description:
```
Mental Vision is a creative technology studio: cinematic video production, AI filmmaking, and human-centered AI adoption — workshops, training, and implementation for teams and small businesses. Founder-led by Corey Ellis in Brownsburg, Indiana. Come see what you think.

Mental Vision is also the parent company of Signal Flair (signalflair.ai), the AI-visibility and Answer Engine Optimization company.
```
3. Send Claude the Mental Vision page's public URL (fact #4) → it goes into mentalvision.ai's schema `sameAs`.

**Done =** no "Corp" anywhere, no "Agentic", both pages cross-linked, founded year consistent with the site.
