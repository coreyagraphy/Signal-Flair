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
**DEPLOYED & LIVE-VERIFIED 2026-07-11** (Corey authorized "ship it").
- **signalflair.ai** — `npm run ship` → Netlify `cozy-pie-596a1f`, deploy `6a52b0c3b3f404426cc17c9f` (49 assets + /pulse function). Live checks PASS: new article `/resources/how-ai-engines-verify-a-business/` → 200; homepage schema carries `Mental Vision LLC` + Coreyagraphy Instagram, **0 crunchbase**; `/about/` canonical trailing-slash + single `<html>`; llms.txt shows three-tier pricing + LLC + 2026-07-11.
- **mentalvision.ai** — `netlify deploy --prod --build` → `mental-vision-v2`, deploy `6a52b1287785f62ab0610906`. Live checks PASS: llms.txt → 200 (was 404) with legal name + Signal Flair relationship; homepage schema carries `Mental Vision LLC` + `subOrganization` + `Mentalvisionllc`.
- **IndexNow** re-ping submitted for 8 signalflair.ai URLs → HTTP 200 (Bing/Copilot/Perplexity/Yandex). Google is NOT in IndexNow → still needs GSC "Request indexing" (platforms/02).

## Known limitations
- LinkedIn URL used in sameAs (`linkedin.com/in/corey-ellis-3b4a0ab8`) is from search-indexed profile data; if Corey has a custom vanity URL, swap it (both layout.tsx and about/page.tsx + MV seo.tsx).
- foundingDate "2026" CONFIRMED (Corey 2026-07-11); LinkedIn company page updated to 2026 and live-verified.
- `Signal Locked` tier label (`src/lib/signal-tiers.ts:12`) is adjacent to the retired "Signal Lock™" term — left in place (it's a score-band label, not the product name); flag if canon tightens.
- Internal `CLAUDE.md` still expands AEO as "Agentic Engine Optimization" (stale); not edited because OWNER_CANON_LOCK excludes it — recommend a one-line fix next owner pass.

## Rollback
- signal-flair: `git revert <commit>` then `npm run ship` to redeploy the reverted state. Entity commits: fc41eea, d38b979, ac78882, d63a091 (+ content 1726de0, docs).
- mental-vision-v2: `git revert 0ef5e3c 40d3e57 e837a4b` then `netlify deploy --prod --build`.
- Netlify keeps every deploy; instant rollback also available via the Netlify UI (Deploys → previous deploy → "Publish deploy") with no rebuild.
