# Prioritized Action Plan — Entity Visibility

**Date:** 2026-07-11. Owner legend: **[C]** = Claude Code (done or done-pending-deploy) · **[K]** = Corey (human-only). Every [K] item has exact copy/steps in `EXTERNAL_ACTION_PACKET.md`.

## Phase 0 — Correct factual/technical defects (DONE this session)
| Action | Owner | Status | Evidence / acceptance |
|---|---|---|---|
| Remove nonexistent Crunchbase sameAs | [C] | ✅ commit `fc41eea` | built out/ contains 0 crunchbase refs |
| Normalize 11 canonicals to trailing slash | [C] | ✅ `fc41eea` | built about/index.html canonical = `/about/` |
| Delete nested-html about/layout.tsx scaffold | [C] | ✅ `fc41eea` | 1 `<html` in built about page |
| Twitter cards + og url/siteName/type | [C] | ✅ `fc41eea` | `twitter:card` present in out/index.html |
| Founder Person sameAs (root + /about) | [C] | ✅ `fc41eea` | rendered in schema |
| alternateName + "SignalFlair" | [C] | ✅ `fc41eea` | rendered |
| llms.txt Stay Found pricing → three-tier canon | [C] | ✅ `d38b979` | out/llms.txt line 38 |
| MV: Organization schema enrichment + subOrganization edge + llms.txt | [C] | ✅ MV `0ef5e3c` | rendered in .next build |
| **Deploy both sites** | **[K]** | ⏳ HOLD (owner-gated) | packet §1–2; live checks listed there |

## Phase 1 — Establish the canonical entity (Week 1)
| Priority | Action | Owner | Impact/Effort | Dependency | Acceptance |
|---|---|---|---|---|---|
| P1.1 | Google Search Console: verify signalflair.ai + mentalvision.ai, submit sitemaps, request indexing of key URLs | [K] | Very high / 20 min | deploys live | GSC shows pages "Indexed" within ~2 wks |
| P1.2 | Bing Webmaster Tools (import from GSC) | [K] | High / 10 min | P1.1 | site verified, sitemap accepted |
| P1.3 | Personal LinkedIn overhaul (headline typo, Signal Flair founder role, About) | [K] | Very high / 30 min | copy in packet §4 | profile shows both companies, no typo |
| P1.4 | Company LinkedIn fixes (AEO expansion, parent name, tagline, website URL; founded-year after fact #1) | [K] | High / 15 min | facts #1–2 | fields match packet §3 |
| P1.5 | Confirm facts #1–4 (founding year, legal wording, MV email, MV LinkedIn URL) | [K] | Unblocks P1.4/P2.2 / 10 min | — | answers recorded in FACT_CONFIRMATION |
| P1.6 | Day-0 manual answer-engine baseline (10-query protocol) | [K] | Medium / 45 min | — | dated entries in OBSERVATIONS file |

## Phase 2 — Explicit differentiation + corroboration (Weeks 2–3)
| Priority | Action | Owner | Notes |
|---|---|---|---|
| P2.1 | Create Crunchbase org profile; then restore sameAs line in `src/app/layout.tsx` (comment marks spot) + redeploy | [K]→[C-ready] | fields in packet §5 |
| P2.2 | MV /about visible cross-link block ("Also from Mental Vision: Signal Flair…") | [K approves, copy ready] | packet §6 — visible-copy change to an active design workstream, so approval-gated |
| P2.3 | 2–3 quality directory/citation entries only (e.g., Clutch, local Indiana chamber, one AEO/AI-tools directory) — NO mass submissions | [K] | packet §7 |
| P2.4 | Google Business Profile decision (service-area business, Brownsburg, address hidden) | [K] | packet §8; strengthens local entity + Maps-layer retrieval |
| P2.5 | Re-run branded queries; log deltas | [K] | OBSERVATIONS protocol |

## Phase 3 — Founder authority (Weeks 2–4, overlaps)
- P3.1 [K] Publish first founder post (Case Zero story, canon-compliant draft in packet §9).
- P3.2 [K] 1 authoritative article on signalflair.ai (draft brief in packet §10: "How AI answer engines decide whether to trust a local business") + internal links; [C] can implement the page when copy is approved.
- P3.3 [K] Podcast/guest-appearance shortlist (packet §11) — earns the third-party citations engines verify against.
- P3.4 Canonical founder bio adopted on both sites + LinkedIn (packet §4.3).

## Phase 4 — Answer-engine coverage (Week 4+, evidence-gated)
Existing pages already cover who/what/how/pricing/FAQ/methodology. Only add:
- "Signal Flair vs SignalFlare.ai" dedicated page — **only if** Day-30 observations still show substitution *after* indexing lands (avoid premature thin content; FAQ + about already answer it).
- Glossary/definitions expansion — only for terms with observed query demand.

## Phase 5 — Observe & maintain (monthly)
- Monthly 10-query re-test (first Monday); log in OBSERVATIONS.
- Visibility journal Day-30 (≈2026-07-26) and Day-90 (≈2026-09-24) re-baselines already scheduled in HANDOFF.md.
- Quarterly robots.txt UA re-audit (site's own stated policy).
- Keep llms.txt Last-Updated fresh on every meaningful site change (Stay Found™ dogfooding).

## Rejected as unnecessary (deliberate)
- Mass directory/backlink submissions (quality risk, against canon).
- Dozens of thin AEO blog pages (content-standard violation).
- A monitoring dashboard (Proof OS already owns measurement; don't duplicate).
- Any comparative/negative SignalFlare.ai content (legal/tone risk; unnecessary).
- Immediate "vs" page (see P4 gate).
- Renaming/rebranding anything (the collision is solvable with corroboration; the brand is fine).
