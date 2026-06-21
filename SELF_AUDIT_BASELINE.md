# Signal Flair — Self-Audit Baseline (the "before")

**Date:** 2026-06-06
**Purpose:** Documented baseline for Signal Flair's own AI Visibility Score, captured *before*
running our own Foundation Build on the site. This is the real "before" half of the case study —
"the AI-visibility company that scored 18 on its own audit, then fixed it in public." Strategy =
**fix first, then publish** the real before→after (do NOT publish the naked 18 yet).

## Baseline AI Visibility Score: ~18 / 100  → "Build the Foundation" band (0–54)

| Signal | Score | Note |
|---|---|---|
| AI Search Presence | 4 | Brand doesn't surface; searches return **SignalFlare.ai** (different company) |
| Crawl Readiness | ~35 | Site loads, but llms.txt not deployed + robots.txt unverified at audit time |
| Entity Clarity | 5 | **Name collision with SignalFlare.ai** — the #1 problem |
| Review Signal | 0 | None anywhere yet |
| Authority Content | 12 | Strong service/FAQ copy, but pre-indexed — nothing cited because nothing found |
| Conversion Proof | 20 | Good structure (post-redesign), no social proof, pre-production |

## Root cause
Premium build, near-zero AI visibility — proves the brand thesis: **visibility ≠ design.**
Biggest single issue: entity confusion with **SignalFlare.ai** (Extropy360; restaurant decision
intelligence; Snowflake 2024 Startup Challenge winner; established press/Crunchbase/LinkedIn).

## Fixes shipped 2026-06-06 (the dogfood Foundation Build — website side)
- **Entity Clarity:** Organization + ProfessionalService + WebSite + Service JSON-LD in `src/app/layout.tsx`
  (exact "Signal Flair" · Brownsburg, Indiana · AEO · founder Corey Ellis · parent Mental Vision ·
  explicit "distinct from SignalFlare.ai"). Add real LinkedIn/Crunchbase/directory URLs to `sameAs` next.
- **Crawl Readiness:** `public/robots.txt` (AI crawlers explicitly allowed) + `public/llms.txt`
  (with SignalFlare.ai disambiguation note) + `public/sitemap.xml`.
- **Authority:** llms.txt resource page still TODO (roadmap).

## Still off-site (not website code)
- Real social/Crunchbase/directory profiles → feed `sameAs`.
- Directory listings + differentiated mentions ("Signal Flair · Brownsburg, Indiana · AEO for local businesses").
- These + indexing time drive AI Search Presence up.

## Next
After deploy + indexing, **rescan** and record the "after." When there's a real after (e.g. 18 → 60 → 75+),
publish the real before/after as the `#proof` case-study card (replacing the current illustrative one).
