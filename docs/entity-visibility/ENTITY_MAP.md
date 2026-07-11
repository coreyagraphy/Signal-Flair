# Entity Map — Signal Flair · Mental Vision · Corey Ellis

**Date:** 2026-07-11 · Sources: repo canon (Proof OS commercialization docs, entity registry), live sites, verified external profiles.

## Canonical entities

### Signal Flair
| Field | Canonical value | Source |
|---|---|---|
| Name | **Signal Flair** (two words, "Flair" never "Flare") | brand canon; live site |
| Concatenated variant | `SignalFlair` — identifiers/handles only; now also schema `alternateName` | this session |
| Alternate names (recognize) | "Signal Flair AI Visibility", "SignalFlair" | Org schema |
| Forbidden/confusing variants | "Signal Flare", "SignalFlare", "signalflare.ai" (separate company); "FLAIR" (MRI term); "Agentic Engine Optimization" (stale expansion — AEO = **Answer** Engine Optimization) | canon + llms.txt |
| Domain | **signalflair.ai** (apex canonical; www 301s) | live, verified |
| Category | AI Proof Infrastructure™ / Answer Engine Optimization (AEO) | 53A registry (approved) |
| Founder | Corey Ellis | canon + live |
| Founding date | ⚠ UNCONFIRMED — site schema "2026" vs LinkedIn "2025" | fact-confirmation #1 |
| Parent | Mental Vision (never "Corp") | Proof OS entity registry; proof.json |
| Location | Brownsburg, Indiana — serving nationwide (no street published) | canon |
| Email (only public inbox) | hello@signalflair.ai | canon |
| Logo | https://signalflair.ai/signal-flair-logo.svg | repo |
| Public product terms (approved) | Signal Score™, Signal Proof Page™, Stay Found™, AI Proof Infrastructure™ + six layers (Access & Crawlability, Structured Intelligence, Entity Clarity, Answer Architecture, Trust & Proof Density, Live AI Visibility) | 53A PUBLIC_ALLOWED |
| Live-but-drift-flagged terms | Signal Protocol™, Signal Pulse™, Signal Proof Layer™, Signal Baseline™, Competitor Signal Snapshot™ — usable where already live; don't expand until registry amendment | 53A drift list |
| Internal-only | Proof OS (investor contexts only), Proof Flex™, Engine Lens Matrix™, etc. | 53A INTERNAL_ALLOWED |
| Profiles | LinkedIn: linkedin.com/company/signal-flair-ai (EXISTS, needs edits) · Indy Chamber member profile: portal.indychamber.com/#/public/member-profile/4af79270-4832-4fca-9754-49cb2e88e912 (owner-confirmed 2026-07-11; hash-routed — crawlable indychamber.com/member-directory/ page NOT yet live, see packet §7) · Crunchbase: DOES NOT EXIST YET (removed from sameAs; recreate then restore) | verified 2026-07-11 |

### Mental Vision
| Field | Canonical value | Source |
|---|---|---|
| Name | **Mental Vision** — never "Mental Vision Corp" | standing directive |
| Domain | **mentalvision.ai** (apex canonical; www 301s; v2 site LIVE) | verified |
| Category | Creative technology studio — cinematic production, AI filmmaking, human-centered AI adoption | live v2 |
| Founder | Corey Ellis ("Coreyagraphy"), Founder & Chief Visionary Officer | live v2 /about |
| Email | create@mentalvision.ai (live on v2; confirm monitored — fact #3) | live v2 |
| Location | Brownsburg, IN 46112 (contact schema); ⚠ LinkedIn parent line says Indianapolis — reconcile | live v2 vs LinkedIn |
| Relationship | parent/umbrella of Signal Flair; also houses HyperForge (in-house AEO/content engine — internal, not on v2 site) | Proof OS entity registry |
| Profiles | Facebook facebook.com/Mentalvisionllc + Instagram instagram.com/mentalvision.ai (owner-confirmed 2026-07-11, in schema sameAs); LinkedIn company page URL still unknown (fact #4). Note: FB handle "Mentalvisionllc" suggests legal name "Mental Vision LLC" — confirm (fact #2) | owner-provided |

### Corey Ellis (founder entity)
| Field | Value | Source |
|---|---|---|
| Name | Corey Ellis | canon |
| Descriptor | Founder, Signal Flair · Founder & Chief Visionary Officer, Mental Vision · creative technologist, filmmaker, educator, AI builder | live MV /about |
| Alias | Coreyagraphy — Corey's handle on ALL social media (owner-confirmed 2026-07-11): instagram.com/coreyagraphy + facebook.com/Coreyagraphy (both in Person sameAs) | owner-provided |
| Location | Brownsburg, Indiana | canon |
| LinkedIn | linkedin.com/in/corey-ellis-3b4a0ab8 (EXISTS; typo "Cheif", stale positioning, no Signal Flair) | verified |
| Name-collision risk | Crunchbase "Corey Ellis" = Growcer CEO (different person); disc golfer; AFL player; musician | search evidence |
| Expertise (publishable) | AI visibility / AEO, entity clarity, structured data, AI implementation for small business, AI filmmaking, creative direction | both sites |

### SignalFlare.ai (NOT affiliated — reference only)
Restaurant decision-intelligence platform (POS + spend + trade-area data, agentic AI), New York, founded 2022, CEO Mike Lukianoff (Extropy360). Snowflake Startup Challenge 2024 winner. Strong footprint: LinkedIn, Crunchbase, CB Insights, QSR press. Zero service overlap with Signal Flair. Never criticize; mention only for disambiguation.

## Relationship graph (as published)

```
Corey Ellis ──founderOf──> Mental Vision ──url──> https://mentalvision.ai
Corey Ellis ──founderOf──> Signal Flair ──url──> https://signalflair.ai
Mental Vision ──subOrganization──> Signal Flair      (added to MV schema this session)
Signal Flair ──parentOrganization──> Mental Vision   (already live)
Signal Flair org.founder.sameAs ──> Corey's LinkedIn (added this session)
Signal Flair ──sameAs──> linkedin.com/company/signal-flair-ai, mentalvision.ai, /proof/
Signal Flair ──NOT──> SignalFlare.ai (disambiguatingDescription, llms.txt, /about, /faq)
```

`sameAs` policy: only URLs that verifiably exist and denote the same entity. `worksFor`/`founder`/`subOrganization` used; `owns`/`brand` intentionally not used until the legal relationship wording is confirmed (fact #2).

## Missing facts requiring Corey (full list in COREY_ELLIS_FACT_CONFIRMATION.md)
founding year · legal-entity relationship wording · MV public email confirmation · MV LinkedIn company URL · approved social handles · founder photo asset · GBP existence/intent · trademark register status of the ™ marks.
