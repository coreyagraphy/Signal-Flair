# 01 — Deploy both sites (15 min)

> ✅ **DONE 2026-07-11** — both sites deployed and live-verified (SF deploy `6a52b0c3`, MV deploy `6a52b128`); IndexNow pinged. Steps kept below for future redeploys.

Everything from the 2026-07-11 session is committed and build-verified but **not live** until you do this (or tell Claude "ship it").

## Signal Flair
```
cd C:\Users\corey\OneDrive\Desktop\signal-flair
npm run ship
```
- `.env.local` is confirmed present, so GA4 + the GHL webhook bake in.
- Must be `npm run ship` (not drag-drop) — drag-drop drops the /pulse serverless function.
- Never touch nameservers at IONOS.

## Mental Vision
```
cd C:\Users\corey\OneDrive\Desktop\mental-vision-v2
npx --yes netlify-cli deploy --prod --build
```
The repo is already linked to its Netlify site; this builds and publishes in one step.

## 2-minute proof it worked (view page source, Ctrl+U)
- `signalflair.ai/resources/how-ai-engines-verify-a-business/` → the new article is live
- `signalflair.ai/llms.txt` → shows Monitor/Proof/Multi pricing + "Last Updated: 2026-07-11"
- `signalflair.ai/about/` → title is the About title (not "Next.js")
- `mentalvision.ai/llms.txt` → loads (used to be a 404)
- `mentalvision.ai` source contains `subOrganization` → Signal Flair

## After deploy
Tell Claude "deployed" → it re-pings IndexNow (Bing/Copilot/Yandex) with all updated URLs automatically — no account needed.
