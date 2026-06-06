# Signal Flair — Deploy Runbook (Netlify + IONOS DNS)

**Host:** Netlify · **Registrar + DNS:** IONOS · **Backend:** GHL (unrelated to this deploy).
Decision: Brand Brief V3 (Corey, 2026-06-02) — Netlify hosts the site; IONOS stays registrar/DNS.

> ⚠️ **READ FIRST — protect the live email warmup.** The email (`corey@signalflair.ai`,
> MX/SPF/DKIM/DMARC) is configured in **IONOS DNS** and warming up. You will change ONLY the
> website records. **Do NOT switch the domain's nameservers to Netlify** — that wipes the IONOS
> records and breaks email mid-warmup. Keep DNS at IONOS; repoint only the site record.

---

## What's already done
- `next.config.js` → `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`.
- `npm run build` produces a static site in **`out/`** (verified: index.html, 404, `_next/`,
  `video/signal-flair-hero.mp4`, brand/pricing correct, zero "Signal Flare" misspellings).
- GA4 + lead-form GHL wiring committed (`dca3bb7`), reads two env vars.

## Environment variables (set in Netlify — required for GA + form to work)
| Variable | Purpose | Status |
|---|---|---|
| `NEXT_PUBLIC_GA_ID` | GA4 measurement (`G-…`) | ✅ set in Netlify |
| `NEXT_PUBLIC_GHL_WEBHOOK_URL` | Lead form → GHL inbound webhook | ✅ set in Netlify |

> ⚠️ **These are inlined at BUILD TIME.** They only reach the bundle if the build runs in an
> environment where they're defined. **Build on Netlify (Path B) so Netlify's env vars apply.**
> If you build LOCALLY for a drag-and-drop deploy (Path A), your machine does NOT have the
> Netlify vars — the site ships inert (no analytics, no GHL push). To use Path A, first create a
> local `.env.local` with both values (see `.env.example`) or the deploy will be dead on those two.

---

## Path A — Fast: drag-and-drop (live in ~2 minutes, no Git)
1. `npm run build` (regenerates `out/`).
2. Go to **app.netlify.com → Add new site → Deploy manually**.
3. Drag the **`out/`** folder onto the drop zone. Site goes live at a `https://<random>.netlify.app` URL with SSL.
4. Confirm it looks right at that netlify.app URL.
5. Add the custom domain (below).

## Path B — Better: Git-connected (auto-deploy on every push)
1. Push the `signal-flare` repo to GitHub/GitLab.
2. Netlify → **Add new site → Import from Git** → pick the repo.
3. Build settings:
   - **Build command:** `next build`
   - **Publish directory:** `out`
   - **Node version:** 18 or 20 (add a `.nvmrc` with `20`, or set env `NODE_VERSION=20`).
   - Static export emits `out/` — you do NOT need the Next SSR runtime plugin. If Netlify
     auto-adds `@netlify/plugin-nextjs` and the build errors, remove it; publishing `out` is enough.
4. Deploy → live at `<site>.netlify.app`. Every future `git push` redeploys automatically.

---

## Connect the custom domain `signalflair.ai`
1. In Netlify: **Site → Domain management → Add a domain** → `signalflair.ai`. Netlify will show
   the exact DNS target(s) — use those if they differ from the defaults below.
2. In **IONOS → Domains → signalflair.ai → DNS**, add/edit ONLY these website records:

   | Type | Host/Name | Value | Note |
   |------|-----------|-------|------|
   | A | `@` (apex) | `75.2.60.5` | Netlify load balancer (use the IP Netlify shows) |
   | CNAME | `www` | `<your-site>.netlify.app` | the site's Netlify subdomain |

   - If IONOS still has an **A record on `@` pointing at the old placeholder/host
     (`74.208.236.70`)**, change that one to `75.2.60.5`. Don't add a second conflicting apex A.
   - **Leave every MX, TXT (SPF/`_dmarc`/DKIM), and CNAME for email UNTOUCHED.**
3. Wait for propagation (minutes to a couple hours). Netlify auto-provisions a Let's Encrypt
   **SSL cert** once it sees the DNS pointing at it — this resolves the earlier apex TLS error.
4. In Netlify, set **HTTPS → Force HTTPS** once the cert is issued. Optionally set the primary
   domain to `signalflair.ai` (apex) and 301 `www → apex` (or vice-versa).

---

## Verify live
- `https://signalflair.ai` serves the real site (not the German IONOS placeholder).
- Padlock / valid SSL (Netlify Let's Encrypt).
- Send a test email from `corey@signalflair.ai` to confirm **email still flows** (proves the
  DNS change didn't disturb the mail records).

## Notes
- Repo folder and package are both `signal-flair` (folder rename done). No remote is configured
  yet — Path B (Git-connect) requires pushing to GitHub/GitLab first.
- Holds that still apply: this is the WEBSITE going live only. Cold **outreach sends** stay
  gated on the Proof Sprint (3 clean manual sends) + warmup — unrelated to this deploy.
