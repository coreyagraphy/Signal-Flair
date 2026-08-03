# 07 — Indy Chamber (10 min) — you already did the hard part

Your membership exists (portal profile confirmed 2026-07-11, already added to your schema). One problem: the portal URL is a `#/`-style page **search crawlers can't index**. The chamber publishes crawlable public pages at `indychamber.com/member-directory/<name>/` for other members — Signal Flair's returns 404, so the listing just needs to be enabled.

## Email your chamber rep (paste)
Subject: `Enable our public member-directory listing — Signal Flair`
```
Hi [rep name],

Signal Flair is a current Indy Chamber member (member profile 4af79270-4832-4fca-9754-49cb2e88e912). I'd like our public member-directory listing enabled at indychamber.com/member-directory/ — I see other members have public pages there, but ours isn't live yet.

Listing details, if helpful:
Name: Signal Flair
Website: https://signalflair.ai
Location: Indianapolis, Indiana
Email: hello@signalflair.ai
Description: Signal Flair helps businesses get found, verified, and recommended by AI engines like ChatGPT, Gemini, and Perplexity — AI visibility audits, structured data, and ongoing proof maintenance. Based in Indianapolis, serving the Indianapolis region and nationwide.

Thanks!
Corey Ellis, Founder — Signal Flair
```
(Alternatively check the member portal first — GrowthZone portals often have a "directory listing" visibility toggle under your company profile settings.)

## When the public page is live
Send Claude the URL → it replaces the portal link in your schema `sameAs` with the crawlable one.

**Done =** `indychamber.com/member-directory/signal-flair/` (or similar) loads publicly.
