# Signal Flair Entity Audit — Executive Report

**Date:** 2026-07-11 · **Auditor:** Claude Code (Fable 5), autonomous session under THRESHOLD discipline
**Scope:** signalflair.ai + mentalvision.ai + SignalFlare.ai collision · repos `signal-flair`, `mental-vision-v2`, `Grok_SignalFlair_Proof` (read-only)
**Status line:** `AUDIT: PASS — completed with evidence` · `IMPLEMENTATION: PASS (repo-level, verified builds)` · `DEPLOYMENT: HOLD (owner-gated by standing rule)`

---

## 1. Executive summary

**The problem is not your website. It is that the rest of the internet has never heard of you.**

Signal Flair's on-site entity layer is unusually strong — llms.txt with explicit disambiguation, Organization/Person/FAQ schema, an open robots.txt posture, real founder attribution, honest Case Zero proof. What's missing is everything *off-site*: the site shows no evidence of being indexed for its own brand queries, there are essentially zero third-party corroborating records, and the one external profile that exists (LinkedIn, 5 followers) contradicts current canon in four ways.

Meanwhile SignalFlare.ai (restaurant decision intelligence, New York, founded 2022, Snowflake Startup Challenge 2024 winner, press coverage, LinkedIn + Crunchbase + CB Insights profiles) has a four-year head start of exactly the corroboration Signal Flair lacks. Answer engines resolve ambiguity toward the entity they can verify. Today that is always the other company.

**Fastest responsible path:** (1) get indexed — Search Console + Bing submission for both domains; (2) make the founder graph verifiable — fix the two LinkedIn surfaces, create the Crunchbase profile; (3) let the already-good on-site layer do its work; (4) re-test on a fixed query set at Day 30/90. **What should NOT be done:** mass directories, thin "vs" content farms, attacking SignalFlare.ai, new dashboards, or any guarantee-flavored claims.

## 2. Current visibility status (evidence, 2026-07-11)

| Query (web-search API) | Result |
|---|---|
| `"Signal Flair" AI visibility` | SignalFlare.ai #1; signalflair.ai absent |
| `signalflair.ai` (exact domain) | 100% SignalFlare.ai results; signalflair.ai absent |
| `"what is Signal Flair"` | MRI FLAIR medical results + Call of Duty "Signal Flare"; signalflair.ai absent |
| `"Corey Ellis" "Signal Flair"` | Nothing relevant (other Corey Ellises: disc golf, AFL, music, Growcer CEO) |
| `"Corey Ellis" "Mental Vision"` | His LinkedIn ("Cheif Visionary Officer – Mentalvision" — typo, old positioning) |
| Indiana AEO category query | Competitors only (AImpact Nexus, ProCloser, Atomic Social, Favze, SCALZ) |
| `"Mental Vision" mentalvision.ai` | #1 = `www.mentalvision.ai` with STALE title from the pre-v2 site |

Full matrix with labels: `ANSWER_ENGINE_OBSERVATIONS.md`.

## 3. Major findings

### Entity-confusion risk (severity: high, structural)
1. **Zero brand-query presence.** signalflair.ai did not appear in any of 7 baseline queries, including its own domain string. Consistent with: no Search Console submission, ~5-week-old site, no inbound links.
2. **SignalFlare.ai owns every adjacent SERP** through legitimate, long-accumulated corroboration. Their site has *zero* JSON-LD (Framer) — your structured-data edge is real once indexing exists.
3. **Founder-name ambiguity compounds it:** multiple public Corey Ellises, including one on Crunchbase as CEO of Growcer. Nothing today ties "Corey Ellis" to Signal Flair anywhere off-site.

### Technical findings (all fixed this session — see IMPLEMENTATION_RECORD.md)
4. `sameAs` pointed to a **Crunchbase profile that does not exist** — fake-corroboration risk. Removed pending creation.
5. **11 canonical URLs** lacked the trailing slash the server actually serves (canonical↔URL mismatch on every content page except home and /pulse).
6. `src/app/about/layout.tsx` was create-next-app scaffold **nesting a second `<html>/<body>`** and carrying `title: 'Next.js'`.
7. **llms.txt Stay Found pricing was stale** ($600–1,200 vs the live three-tier $600–3,000 canon).
8. No Twitter/X card metadata (og-only).

### External-surface findings (prepared for Corey — see EXTERNAL_ACTION_PACKET.md)
9. **LinkedIn company page drift:** "Agentic Engine Optimization" (canon: *Answer* Engine Optimization), parent "**Mental Vision Corp** (Indianapolis)" (banned name + location conflict), "Founded 2025" (site schema says 2026), old tagline.
10. **Personal LinkedIn:** "Cheif Visionary Officer" typo, photography-era positioning, no Signal Flair role at all. This is currently the single most visible founder record on the internet.
11. **Google's index of mentalvision.ai is stale** — serving the old `www` title; v2 (live) has never been recrawled. Search Console fixes this.

### Founder-entity findings
12. On-site founder layer is now solid on both sites (Person schema + sameAs added this session; MV already had Person + "Coreyagraphy" alias on /about).
13. No canonical founder biography exists that both sites + LinkedIn + future profiles can reuse — drafted in EXTERNAL_ACTION_PACKET.md; needs approval, not writing.
14. Missing facts block some markup: founding year, legal entity relationship, MV company-page URL. Listed in COREY_ELLIS_FACT_CONFIRMATION.md — none of them block the actions above.

### Mental Vision relationship findings
15. Canon (Proof OS entity registry + live proof.json) records **Mental Vision as parent/umbrella, Signal Flair as its AI Proof Infrastructure™ offer**. The SF site says this everywhere; **MV said it nowhere** — the graph edge was one-directional. Fixed at schema level (`subOrganization` + founder cross-reference + llms.txt); visible-copy cross-link block is drafted for approval since MV's site is an active design workstream.
16. Legacy "Mental Vision Corp" surfaces are dead (legacy Netlify subdomain 404s). The banned name survives only on LinkedIn (item 9).

## 4. Competitor differentiation (SignalFlare.ai)
Restaurant-vertical decision-intelligence platform (POS/spend/trade-area data, agentic analytics), NY, founded 2022, by Extropy360/Mike Lukianoff. Zero overlap with AEO for local service businesses. Differentiation needs only: consistent spelling, the existing neutral disambiguation line, and enough corroboration that engines can see two distinct entities. No comparative content warranted; nothing negative published.

## 5. Immediate recommendations (ranked)
1. Google Search Console: verify both domains, submit sitemaps (Corey, ~20 min) — single highest-leverage action.
2. Bing Webmaster Tools import (~10 min) — feeds ChatGPT/Copilot retrieval.
3. Fix personal LinkedIn (copy ready) — founder graph's most-crawled node.
4. Fix company LinkedIn fields (copy ready).
5. Deploy the committed SF fixes (`npm run ship` after review); deploy MV entity package.
6. Create Crunchbase profile (fields ready), then restore the sameAs line (comment marks the spot).
7. Confirm the 4 blocking facts (founding year, legal relationship wording, MV email, MV LinkedIn URL).
8. Start the Day-0 observation baseline (query set + dates already recorded) and re-run at Day 30 (≈2026-08-10).

## 6. Limitations of this audit
- Search evidence comes from one web-search API; ChatGPT, Perplexity, Gemini, Copilot, and Google AI Overviews were **not testable** from this environment and are labeled as such — nothing was simulated.
- LinkedIn company-page fields were read through a fetch that may lag live edits.
- Crunchbase nonexistence is inferred from search absence + bot-blocked direct check (403) — verify once logged in.
- No Search Console/analytics access → indexing conclusions are inferred from SERP absence, not crawl logs.
