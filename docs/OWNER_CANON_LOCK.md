# Owner Canon Lock — Signal Flair Case Zero

**Locked:** 2026-06-19  
**Repo:** `signal-flair`  
**Purpose:** Resolve canon conflicts before Phase 2 content edits.  
**Status:** Report only — no Phase 2 edits applied in this pass.

---

## 1. Final canon decisions

### Score canon

| Value | Role | Public use |
|-------|------|------------|
| **18/100** | Official Case Zero baseline score | **Yes** — primary public baseline everywhere |
| **32/100** | Proof OS provisional readiness (internal) | **No** — not present in live repo today; do not publish unless owner explicitly approves with clear “provisional / in-progress” labeling |
| **91/100** | Post-implementation **next target** (not achieved score) | **Yes** — only with safe target framing (see projected card canon) |
| **78** | Homepage hero gauge animation demo | **Internal/UX only** — marketing animation, not a claimed Signal Score™ |

**Rule:** Do not replace the official **18/100** baseline with **32/100**.

---

### Date canon

| Date | Role | Public use |
|------|------|------------|
| **June 6, 2026** (`2026-06-06`) | Original Case Zero baseline capture | **Yes** — all public Case Zero references |
| **June 19, 2026** (`2026-06-19`) | Production package / implementation package date | **Proof OS & docs only** — not mixed into live site Case Zero narrative |

**Rule:** Do not mix June 6 (baseline event) with June 19 (package workflow date) on public pages.

**Note:** June 19 does **not** appear anywhere in the live `signal-flair` repo today.

---

### Terminology canon

| Term | Public role | Action |
|------|-------------|--------|
| **Signal Proof Page™** | Public proof asset — human-readable record at `/proof/` | **Use** |
| **Stay Found™** | Ongoing maintenance layer | **Use** (normalize from “Stay Found System” where practical) |
| **Signal Lock™** | Legacy internal/product name | **Avoid publicly** — flag for Phase 2 replacement |
| **Beacon** | Internal artifact name (`proof.json` comment) | **Internal only** — keep in `$comment` fields, not customer copy |

**Replacement guide:**

| Context | Replace Signal Lock™ with |
|---------|---------------------------|
| `/proof/` hub, verified record, crawlable proof pages | **Signal Proof Page™** |
| Monthly re-verification, drift monitoring, maintenance | **Stay Found™** |
| FAQ “What is Signal Lock?” | Reframe as **Signal Proof Page™** + **Stay Found™** (split answer) |
| Pricing deliverable bullets mentioning “Signal Lock layer installed” | **Signal Proof Page™** deployed + **Stay Found™** eligible |

---

### Projected card / target canon

**Avoid:** “Projected”, implied live citations, engine “Yes” stamps without verification.

**Use:**

- **Next target** / **Post-implementation target**
- **Target after owned proof assets are published, crawlable, and aligned across the site**
- Always pair with no-guarantee framing where outcomes are implied

**Approved safe copy direction:**

> Next target: improve AI-readiness after owned proof assets are published, crawlable, and aligned across the site. This is a readiness target, not a guaranteed AI ranking, citation, or recommendation.

**Rule:** Target **91/100** may remain as a numeric goal if labeled as **next target**, not as achieved or projected performance. Remove or reword rows that imply current citations (e.g. “Citations found 14”, engine “Yes”) unless backed by Manual Visibility Journal™ evidence.

---

## 2. Where each conflict appears

### Score: 18 vs 32

| Location | Instance | Public? | Conflict? |
|----------|----------|---------|-----------|
| Live repo public surfaces | **18/100** consistently | Yes | ✅ Aligned with canon |
| Live repo | **32/100** | — | ✅ **Not found** in public copy (only CSS/animation coordinates) |
| Proof OS (`Grok_SignalFlair_Proof`) | 32/100 composite | Internal | ⚠️ Must not leak to live site without approval |
| `SignalFlairLanding.tsx` gauge tween | Animates to **78** | Yes (visual) | ⚠️ Not 18 or 32 — clarify as demo, not Case Zero score |
| `proof.json` | `after_target: 91` | Yes (machine) | ⚠️ Target framing — see projected canon |
| `proof/page.tsx`, `proof/proof/page.tsx` | 18 baseline, 91 target | Yes | ⚠️ Target OK with relabel; baseline OK |

---

### Date: June 6 vs June 19

| Location | Date used | Public? | Conflict? |
|----------|-----------|---------|-----------|
| `SignalFlairLanding.tsx` | June 6 / 06.06.2026 | Yes | ✅ Canon baseline date |
| `faq/page.tsx`, `about/page.tsx` | June 6, 2026 | Yes | ✅ |
| `proof/page.tsx`, `proof/proof/page.tsx`, `proof/changelog/page.tsx` | 2026-06-06 | Yes | ✅ |
| `public/proof.json`, `public/llms.txt`, `VerifiedMark.tsx` | 2026-06-06 | Yes | ✅ |
| `public/sitemap.xml` | 2026-06-06 lastmod on several URLs | Yes (technical) | ✅ |
| Proof OS production package | June 19, 2026 | Internal | ✅ Keep out of live Case Zero copy |
| Live repo | June 19 | — | ✅ **Not found** |

---

### Terminology: Signal Lock™ vs Signal Proof Page™ / Stay Found™

| File | Signal Lock™ count (approx.) | Public? | Phase 2? |
|------|-------------------------------|---------|----------|
| `src/components/SignalFlairLanding.tsx` | **~15** instances | Yes | **Yes — high priority** |
| `src/app/faq/page.tsx` | Title, OG, FAQ Q&A | Yes | **Yes** |
| `src/app/proof/page.tsx` | Metadata, body, FAQ, schema Service | Yes | **Yes** |
| `src/app/proof/services/page.tsx` | Metadata, service descriptions | Yes | **Yes** |
| `src/app/proof/proof/page.tsx` | Metadata, body | Yes | **Yes** |
| `src/app/proof/trust/page.tsx` | Metadata | Yes | **Yes** |
| `src/app/proof/changelog/page.tsx` | Metadata, changelog entry title | Yes | **Yes** |
| `public/llms.txt` | Section header + body | Yes | **Yes** |
| `public/proof.json` | `$comment`, service descriptions | Mixed | **Yes** (public fields only) |
| `public/signalflair-discovery.json` | `$comment` | Internal comment | Low — comment OK |
| `src/app/globals.css` | CSS comments only | No (dev) | Optional |
| `SignalFlair_Foundation.md` | Multiple | Internal doc | **Do not edit** (owner excluded) |

**Signal Proof Page™ today:**

| File | Instance | Public? |
|------|----------|---------|
| `layout.tsx` | keywords, knowsAbout | Yes |
| `SignalFlairLanding.tsx` | Founding pilot bullet (1×) | Yes |
| `/proof/` route | De facto Signal Proof Page — not named in hub copy | Yes |

**Stay Found™ / Stay Found System today:**

| Pattern | Files | Phase 2 action |
|---------|-------|----------------|
| “Stay Found System” | `faq`, `about`, `how-it-works`, `page.tsx`, `layout.tsx` schema, `llms.txt`, `proof.json`, landing pricing | Normalize to **Stay Found™** where copy is updated |
| “Stay Found” (no ™) | Landing sections, pricing | Add ™ on public marketing surfaces |

---

### Projected card / risky target copy

| File | Lines / section | Risk | Public? |
|------|-----------------|------|---------|
| `SignalFlairLanding.tsx` | `#proof` → `proof-card after` | **High** — tag “Projected”, “Citations found 14”, engine “Yes” | Yes |
| `proof/page.tsx` | `CASE_ZERO.target: 91`, “tracked to target” | Medium — numeric target OK with relabel | Yes |
| `proof/proof/page.tsx` | 91 target, “tracked to target” | Medium | Yes |
| `public/proof.json` | `after_target: 91`, `target_state: 91` | Medium — machine-readable target | Yes |
| `public/llms.txt` | “tracked to a target of 91/100” | Medium | Yes |

---

## 3. Public-facing vs internal classification

### Public-facing (Phase 2 edit candidates)

- All `src/app/**` routes served to signalflair.ai
- `src/components/SignalFlairLanding.tsx`
- `public/llms.txt`
- `public/proof.json` (fields served at `/proof.json`)
- `public/signalflair-discovery.json` (served via redirect)
- `public/sitemap.xml` (lastmod updates only when content changes)

### Internal / do not edit in Phase 2 (unless owner expands scope)

- `SignalFlair_Foundation.md` — **owner excluded**
- `Unique_SignalFlare_Idea.pdf` — **owner excluded**
- `SELF_AUDIT_BASELINE.md`, `SESSION_HANDOFF*.md`, `CLAUDE.md`, `ENTITY_*.md`
- `design-refs/`
- `src/app/globals.css` comments (cosmetic)
- `proof.json` `$comment` Beacon/SIGNAL LOCK headers (optional retention for operators)
- Proof OS repo (`Grok_SignalFlair_Proof`) — separate canon doc lives there

### Operator / agent docs (internal)

- `docs/OWNER_CANON_LOCK.md` (this file)
- `Grok_SignalFlair_Proof/.../internal-do-not-publish.md`

---

## 4. Recommended replacement (by conflict type)

### A. Signal Lock™ → public canon terms

**Example — `faq/page.tsx` FAQ:**

- **Current:** “What is Signal Lock?”
- **Phase 2:** “What is a Signal Proof Page™?” + optional second FAQ “What is Stay Found™?”
- **Answer direction:** Signal Proof Page™ = `/proof/` verified record; Stay Found™ = monthly maintenance.

**Example — `proof/page.tsx` hero:**

- **Current:** “Signal Lock is the maintained verification layer…”
- **Phase 2:** “The Signal Proof Page™ is our maintained, crawlable proof record…”

**Example — `SignalFlairLanding.tsx` `#signal-lock-reveal` block:**

- **Current:** “Signal Lock™ is not a one-time audit…”
- **Phase 2:** “Stay Found™ is not a one-time audit…” (maintenance framing)

### B. Projected card (`#proof` after card)

**Current labels to change:**

| Element | Current | Recommended |
|---------|---------|-------------|
| Card tag | `Projected` | `Next target` |
| Card label | `Target State` | `Post-implementation target` |
| Row: Citations found 14 | `yes` stamp | Remove or replace with “TBD — verified in visibility journal” |
| Rows: ChatGPT/Claude/Perplexity Yes | `yes` stamp | Remove or replace with readiness layers, not outcome claims |
| Footer status | “updated Day 30 & Day 90” | Keep if process is real; add “readiness target, not guaranteed citation” |

**Add disclaimer line under card:**

> Next target: improve AI-readiness after owned proof assets are published, crawlable, and aligned. Not a guaranteed AI ranking, citation, or recommendation.

### C. Stay Found System → Stay Found™

Cosmetic normalization during Phase 2 copy pass — no pricing number changes.

### D. Score 32

**No live replacement needed** — 32 does not exist in public repo. If Proof OS data is synced later, use footnote pattern:

> “Internal provisional readiness (Proof OS): 32/100 — in progress, not a public outcome claim.”

Only with explicit owner approval.

### E. June 19

Keep in Proof OS package metadata only. Live site continues **June 6, 2026** for Case Zero baseline.

---

## 5. Whether each instance should change in Phase 2

| Category | Change in Phase 2? | Priority |
|----------|-------------------|----------|
| 18/100 baseline | **No** — already correct | — |
| 32/100 | **No** — not in live repo | — |
| June 6 baseline date | **No** — already correct | — |
| June 19 | **No** — not in live repo | — |
| Signal Lock™ public copy | **Yes** | P0 |
| Signal Proof Page™ naming on `/proof/` hub | **Yes** | P0 |
| Stay Found™ normalization | **Yes** | P1 |
| Projected card on homepage | **Yes** | P0 |
| 91 target on proof pages | **Relabel only** | P1 |
| Hero gauge 78 animation | **Optional clarify** | P2 |
| `layout.tsx` schema Offer names | **No** in terminology pass unless copy sync required | P2 |
| FAQ additions from Proof OS package | **Yes** (new FAQs only) | P1 |
| `SignalFlair_Foundation.md` | **No** | Excluded |

---

## 6. Risky claims to avoid (locked)

- Publishing **32/100** as if it replaces **18/100**
- Mixing **June 19** into Case Zero baseline story
- Leaving **“Projected”** + **“Citations found 14”** + engine **“Yes”** as if current
- Public **Signal Lock™** as primary product name (use Signal Proof Page™ + Stay Found™)
- Guaranteeing AI rankings, citations, or recommendations
- Implying **91/100** is achieved vs **next target**
- Treating hero gauge **78** as official Case Zero or client score
- Fabricating reviews (live correctly shows 0 — preserve)

---

## 7. Exact files that will need Phase 2 edits

### P0 — terminology + projected card

```
src/components/SignalFlairLanding.tsx   # Signal Lock blocks, #proof after card, footer ™ line
src/app/faq/page.tsx                    # Signal Lock FAQ + metadata title
src/app/proof/page.tsx                  # Hub copy, FAQ, schema serviceType strings
src/app/proof/proof/page.tsx            # Case Zero copy, metadata
public/llms.txt                         # Signal Lock section → Proof Page + Stay Found
```

### P1 — proof subpages + machine-readable sync

```
src/app/proof/services/page.tsx
src/app/proof/trust/page.tsx
src/app/proof/changelog/page.tsx
public/proof.json                       # service descriptions, update_policy (not scores)
public/signalflair-discovery.json       # if public-facing strings reference Signal Lock
```

### P1 — Stay Found™ normalization (copy-only)

```
src/app/about/page.tsx
src/app/how-it-works/page.tsx
src/app/page.tsx                        # HOMEPAGE_FAQ only if Stay Found wording touched
src/app/layout.tsx                      # Offer name "Stay Found System" — optional ™ sync
```

### P2 — optional / lower risk

```
src/components/VerifiedMark.tsx           # default lastVerified date — only if baseline refreshed
public/sitemap.xml                      # lastmod after content deploy
src/app/resources/llms-txt/page.tsx     # if it references Signal Lock
```

### Explicitly out of Phase 2 scope (this canon lock)

```
SignalFlair_Foundation.md
Unique_SignalFlare_Idea.pdf
proof.json / llms.txt / schema — score number changes
pricing dollar amounts
FAQ answer rewrites beyond terminology + new FAQ additions
deploy / hosting
```

---

## 8. Phase 2 readiness checklist

| Gate | Status |
|------|--------|
| Score canon locked (18 public, 32 internal) | ✅ |
| Date canon locked (June 6 public, June 19 package-only) | ✅ |
| Terminology canon locked | ✅ |
| Projected card canon locked | ✅ |
| Conflict inventory complete | ✅ |
| Phase 2 file list defined | ✅ |
| Owner excluded files documented | ✅ |
| Phase 1 technical (canonical + H1) | ✅ Assumed complete per owner |

**Phase 2 is ready to begin** after owner confirms this document — still **no deploy** until staging review.

---

## 9. Suggested Phase 2 execution order

1. **Terminology pass** — Signal Lock™ → Signal Proof Page™ / Stay Found™ (`proof/` hub + FAQ first)
2. **Projected card pass** — homepage `#proof` after card only
3. **Machine-readable sync** — `llms.txt` + `proof.json` public fields mirror visible `/proof/` copy
4. **Stay Found™ normalization** — System → ™
5. **New FAQs** from Proof OS package (Engine Lens, Proof Distribution, etc.) — additive only
6. **Build + diff review** — `npm run build`, verify no score/pricing drift
7. **Post-Phase-2** — crawl re-audit + visibility journal (Phase 3)

---

*Canon lock report only. No Phase 2 content edits applied. No deploy.*