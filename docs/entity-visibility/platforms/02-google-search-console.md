# 02 — Google Search Console (20 min) — highest-leverage single action

> **PROGRESS 2026-07-11 (Claude drove this live in your console):**
> - ✅ **Signal Flair apex property `https://signalflair.ai/` VERIFIED** (auto-verified off the existing HTML file) **+ sitemap.xml submitted → Google discovered all 13 pages.** Done.
> - ⏳ **Mental Vision apex `https://mentalvision.ai/`: verification file is now LIVE (200) — needs ONE click from you.** The final VERIFY button loads in a Google iframe Claude's browser can't reach. Finish it: GSC → property dropdown → "Add property" (or the pending mentalvision.ai flow) → URL prefix `https://mentalvision.ai/` → **VERIFY** (it will succeed instantly — the file `google5a5fea2e86d232cd.html` serves correctly). Then submit sitemap `sitemap.xml` for that property.
> - Both apex properties are the FIX for the "0 indexed pages" problem: your verified `www` properties were the wrong scope because the sites canonicalize to the apex (non-www).
> - Optional speed-up: URL-Inspect the homepage + new article and click "Request indexing" (the sitemap already covers them, so this is just faster).


Signal Flair currently shows up for **zero** brand queries — even searching "signalflair.ai" returns the restaurant company. Nothing else in this kit works until Google indexes you.

## Step 0 — check what already exists (5 min)
A URL-prefix property for `https://signalflair.ai` was verified on 2026-06-07 (HTML-file method) and the sitemap was submitted then.
1. Open https://search.google.com/search-console → select the signalflair.ai property.
2. Go to **Indexing → Pages**. Screenshot it.
   - If most pages sit in "Crawled — currently not indexed" → Google has seen you but doesn't trust you yet; the corroboration work in files 04–14 is the fix. Still do the steps below.
   - If pages show "Indexed" → great; the SERP absence is a ranking/corroboration issue, same answer.

## Step 1 — add mentalvision.ai
Add property → **Domain** type → `mentalvision.ai` → verify with the DNS TXT record Google shows you, added at IONOS.
(Adding a TXT record is safe — it is NOT a nameserver change.)

## Step 2 — sitemaps
Sitemaps → submit (or confirm present):
- `https://signalflair.ai/sitemap.xml`
- `https://mentalvision.ai/sitemap.xml`

## Step 3 — request indexing (after you deploy, file 01)
URL Inspection → paste each → "Request indexing":
- `https://signalflair.ai/`
- `https://signalflair.ai/about/`
- `https://signalflair.ai/resources/how-ai-engines-verify-a-business/`  ← new article
- `https://signalflair.ai/proof/`
- `https://signalflair.ai/pulse/`
- `https://mentalvision.ai/` and `https://mentalvision.ai/about`

## What "done" looks like
Within ~2 weeks: pages move to Indexed; the stale old Mental Vision title in Google gets replaced by the v2 title. Re-check weekly; log in the observations file.
