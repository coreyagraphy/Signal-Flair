# Answer-Engine Observation Matrix

**Baseline date:** 2026-07-11 · **Engine actually tested:** the web-search API available in this session (single engine).
**Not testable from this environment (nothing simulated):** ChatGPT search, Perplexity, Gemini, Copilot, Google AI Overviews, Claude web search as a consumer product. These need manual runs — the 30-day plan schedules them (Day 1 and Day 30) with this exact query set so results are comparable.

Labels: **DO** = directly observed this session · **SRE** = search-result evidence · **NT** = not testable here.

| # | Query | SF appeared? | SignalFlare.ai appeared? | Confused? | Corey? | MV? | Sources engine cited | Label | Action |
|---|---|---|---|---|---|---|---|---|---|
| 1 | "Signal Flair" AI visibility | **No** | **Yes — #1** | Yes (substitution) | No | No | signalflare.ai, flare.io, forbes, searchengineland | DO | Indexing + corroboration (P1) |
| 2 | signalflair.ai (exact domain) | **No** | **Yes — dominant** | Severe | No | No | signalflare.ai + its LinkedIn/Crunchbase/CBI | DO | Same; this is the headline defect |
| 3 | "what is Signal Flair" | **No** | Partially ("Signal Flare" CoD wiki) | Yes (MRI FLAIR dominates) | No | No | mrimaster, wikipedia FLAIR, radiology journals | DO | llms.txt MRI disambiguation already anticipates this; needs indexing to fire |
| 4 | "Corey Ellis" "Signal Flair" | **No** | No | n/a — zero founder link exists | Other Corey Ellises only | No | pdga.com, zerohanger, instagram, crunchbase (Growcer) | DO | LinkedIn fixes + Crunchbase (P1–P2) |
| 5 | "Corey Ellis" "Mental Vision" | n/a | No | No | **Yes — LinkedIn** ("Cheif Visionary Officer – Mentalvision", stale) | Yes (via LinkedIn) | linkedin.com/in/mentalvision-3b4a0ab8 | DO | Personal LinkedIn overhaul (P1) |
| 6 | "Mental Vision" mentalvision.ai AI studio | n/a | No | No | No | **Yes — #1, stale title** (old www site: "AI Video Creation & Content Generation Studio") | www.mentalvision.ai | DO | GSC recrawl request (P1) |
| 7 | AI visibility audit company Indiana AEO local business | **No** | No | No | No | No | aimpactnexus.ai, procloser.ai, atomicsocial, favze, scalz.ai | DO | Category-query gap; content exists, indexing doesn't |
| 8 | Who owns Signal Flair? / Is Signal Flair the same as SignalFlare.ai? / What is Signal Score? etc. | — | — | — | — | — | — | **NT** | Manual run Day 1 per protocol below |

## Verified profile/endpoint checks (DO, 2026-07-11)
| Check | Result |
|---|---|
| linkedin.com/company/signal-flair-ai | EXISTS (5 followers) — but 4 field defects (see EXTERNAL_ACTION_PACKET.md §3) |
| crunchbase.com/organization/signal-flair | Very likely DOES NOT EXIST (absent from search; direct check 403-bot-blocked) → removed from sameAs |
| signalflair.ai + www / robots / sitemap / llms.txt / proof.json | All 200, www 301s to apex correctly |
| mentalvision.ai + www / robots / sitemap | All 200; llms.txt was 404 (now built, pending deploy) |
| proof.signalflair.ai | No DNS (000) — expected; Route B CNAME intentionally pending; no public links point at it |
| mental-vision-signal-flare.netlify.app (legacy) | 404 — dead; no stray "Mental Vision Corp" entity record remains live |

## Manual re-test protocol (Corey, Day 1 and Day 30 ≈ 2026-08-10)
Run each in a fresh/logged-out session where possible; screenshot; note date + engine + whether SF/SignalFlare/Corey/MV appeared and which sources were cited. Record in this file under a dated heading.

1. What is Signal Flair?
2. Who founded Signal Flair?
3. Is Signal Flair the same as SignalFlare.ai?
4. What is signalflair.ai?
5. What is a Signal Score?
6. Who is Corey Ellis? / What companies did Corey Ellis found?
7. What is Mental Vision AI? / Who founded Mental Vision?
8. Is Mental Vision connected to Signal Flair?
9. Best AI visibility / AEO company for local service businesses in Indiana
10. What is AI Proof Infrastructure?

Engines: Google (+ AI Overviews if shown), Bing, ChatGPT search, Perplexity, Gemini, Copilot, Claude.
Expectation-setting: with GSC/Bing submission + LinkedIn/Crunchbase fixes live, branded queries (1–4) should begin surfacing signalflair.ai within 2–6 weeks; category queries (9) take longer and depend on corroboration growth. AI answers vary by session, location, and time — one observation is one session, never "all users."
