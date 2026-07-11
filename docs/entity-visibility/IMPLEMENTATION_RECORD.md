# Implementation Record — 2026-07-11 session

Session: Claude Code (Fable 5), autonomous entity-visibility assignment under THRESHOLD discipline.

## Repo: signal-flair (`C:\Users\corey\OneDrive\Desktop\signal-flair`)
- Branch: `feature/signal-scan-immersive-landing-page` (the de-facto trunk; unpushed). Note: a dedicated side branch was planned but the branch-creation command silently failed; commits were kept on the working branch deliberately — it matches the local-build deploy flow and rollback stays trivial.
- Pre-session HEAD: `455b0cf` (clean tree).

### Commit `fc41eea` — entity: verifiable sameAs only, founder graph links, canonical + metadata repairs
| Change | File(s) | Reason |
|---|---|---|
| Removed Crunchbase from Org `sameAs` (+ explanatory comment) | `src/app/layout.tsx` | Profile doesn't exist — dead sameAs = fake corroboration |
| founder Person `sameAs` → Corey's LinkedIn | `src/app/layout.tsx` | Verifiable founder graph edge |
| `alternateName` → array incl. `SignalFlair` | `src/app/layout.tsx` | Concatenated-variant matching |
| Twitter card + og url/siteName/type | `src/app/layout.tsx` | Missing social card layer |
| `#founder` Person `sameAs` (LinkedIn + mentalvision.ai/about) | `src/app/about/page.tsx` | Cross-site founder resolution |
| AboutPage url → trailing slash | `src/app/about/page.tsx` | URL-form consistency |
| 11 canonicals → trailing slash | about, faq, how-it-works, case-studies/restor-team, resources/llms-txt, proof, proof/{changelog,partner,proof,services,trust} page.tsx | Site serves `trailingSlash:true`; canonicals disagreed with served URLs + sitemap |
| **Deleted** `src/app/about/layout.tsx` | — | create-next-app scaffold nesting a 2nd `<html>/<body>` with `title:'Next.js'` |

### Commit `d38b979` — entity: sync llms.txt Stay Found pricing to the live three-tier canon
`public/llms.txt`: Stay Found line → Monitor $600–800 / Proof $1,200–1,800 / Multi $2,000–3,000 per month (matches live pricing section + commercialization `obj-price-anchor`); Last Updated → 2026-07-11.

### Commit (deliverables) — docs/entity-visibility/* (8 files, this directory)

## Repo: mental-vision-v2 (`C:\Users\corey\OneDrive\Desktop\mental-vision-v2`)
- Branch `main` (no remote). Pre-session HEAD `4ca9a4d` (clean).
### Commit `0ef5e3c` — entity: reciprocal Signal Flair graph edge, enriched Organization schema, llms.txt
- `src/lib/seo.tsx`: Organization JSON-LD gains `@id`, description, Brownsburg 46112 address, areaServed, founder detail (Coreyagraphy alias, CVO title, LinkedIn sameAs), `subOrganization` → Signal Flair.
- `public/llms.txt`: NEW — studio facts sourced only from live v2 copy; Signal Flair relationship section; explicitly no legacy client claims imported.

## Repos NOT touched (holds honored)
- `Grok_SignalFlair_Proof` — read-only per standing no-edit doctrine; 37 dirty files from active workstream preserved untouched. **Operator manual: no update required** — this session changed only public websites, not any Proof OS process (canon check confirmed the walkthrough governs operator process, not marketing copy).
- Legacy `mental-vision-website` — untouched per standing directive.

## Commands run + results
| Command | Result |
|---|---|
| `npm run build` (signal-flair) | ✅ exit 0, all routes prerendered static |
| Built-output assertions (out/) | ✅ 1 `<html>` in about; canonical `/about/`; 0 crunchbase; twitter:card present; alternateName array; founder sameAs; llms.txt 3-tier line |
| `npm run build` (mental-vision-v2) | ✅ exit 0; built HTML contains upgraded Organization schema (subOrganization + founder verified by grep) |
| `git status` both repos | signal-flair: clean except this docs dir pre-commit; MV: clean |
| Existing verifiers | signal-flair has no test script; `aeo-verify.mjs` exists unwired (not run — targets live site; run post-deploy). Proof OS suites not run (repo untouched). |

## Deployment status
**HOLD — deliberate.** Deploys are owner-gated (standing rule + env-var inlining caveat). Both repos left build-verified and deploy-ready. Exact procedures: EXTERNAL_ACTION_PACKET.md §1. **Nothing in this record is claimed live.**

## Known limitations
- LinkedIn URL used in sameAs (`linkedin.com/in/mentalvision-3b4a0ab8`) is from search-indexed profile data; if Corey has a custom vanity URL, swap it (both layout.tsx and about/page.tsx + MV seo.tsx).
- foundingDate "2026" left as-is pending fact #1 (LinkedIn says 2025).
- `Signal Locked` tier label (`src/lib/signal-tiers.ts:12`) is adjacent to the retired "Signal Lock™" term — left in place (it's a score-band label, not the product name); flag if canon tightens.
- Internal `CLAUDE.md` still expands AEO as "Agentic Engine Optimization" (stale); not edited because OWNER_CANON_LOCK excludes it — recommend a one-line fix next owner pass.

## Rollback
- signal-flair: `git revert d38b979 fc41eea` (or `git reset --hard 455b0cf` — branch unpushed, but revert preferred; deliverables commit revert likewise).
- mental-vision-v2: `git revert 0ef5e3c` (or reset to `4ca9a4d`).
- Nothing deployed, so live rollback is not applicable.
