# Founder Fact Confirmation — only what's actually missing

Everything below blocks or improves a specific published claim. Nothing here blocks the Phase-1 actions. Answer inline and commit, or answer in chat and Claude will update the surfaces.

## Blocking (needed within Week 1)

**1. Founding year of Signal Flair — 2025 or 2026?**
✅ ANSWERED 2026-07-11 (Corey): **2026**. Site schema was already correct (`foundingDate: "2026"`) — no code change. Action shifted to the LinkedIn company page, which says 2025 and must be changed to 2026 (platforms/05). Crunchbase + Clutch fields filled with 2026.

**2. Legal relationship wording.**
✅ ANSWERED 2026-07-11 (Corey): legal entity = **Mental Vision LLC**; Signal Flair is a brand of it. Implemented same day: `legalName: "Mental Vision LLC"` added to the Mental Vision Organization schema and to Signal Flair's `parentOrganization` node + both llms.txt files. Signal Flair's own org node deliberately carries NO legalName (it's a brand, not a separate legal entity). Public brand wording unchanged: "Mental Vision" / "a Mental Vision company" — the LLC suffix lives in machine-readable facts only.

**3. Mental Vision public email.**
v2 site + schema publish `create@mentalvision.ai`. A June note deprecated create@ for *Signal Flair outreach* use. Confirm: create@ is monitored and stays MV's public inbox? (If not, tell me the replacement and I'll patch site + schema + llms.txt.)
**Answer:** ______

**4. Mental Vision LinkedIn company page.**
Does one exist (URL)? Your personal profile shows "Mentalvision" as employer, which implies a page. Needed for: MV sameAs, parent-company field on the Signal Flair page, packet §3.
**Answer:** ______

## Non-blocking (Week 2–3)

**5. Preferred founder title string** — "Founder" (SF) + "Founder & Chief Visionary Officer" (MV) is what's live. Keep exactly this split? **Answer:** ______
**6. Approved social handles** — ✅ PARTIALLY ANSWERED 2026-07-11: personal = instagram.com/coreyagraphy + facebook.com/Coreyagraphy ("Coreyagraphy" on all social); MV = facebook.com/Mentalvisionllc + instagram.com/mentalvision.ai. All four wired into schema. Still open: any SIGNAL FLAIR-brand handles (footer placeholders exist) + YouTube/X URLs if any. **Answer:** ______
**7. Founder photo** — 4:5 portrait for the SF about section (slot has been open since June) + square headshot for profiles. Provide file or say "hold." **Answer:** ______
**8. Google Business Profile** — does one exist for either brand already? If not, approve/deny creating SF as a service-area business (Indianapolis, address hidden) — packet §8. **Answer:** ______
**9. Trademark status** — Signal Score™, Stay Found™, etc. are used with ™ (fine unregistered). Confirm none are registered (®) and none are under filing, so no surface over- or under-claims. **Answer:** ______
**10. "Coreyagraphy" scope** — keep as public alias on MV surfaces only (current state), or also add to SF founder schema? **Answer:** ______
**11. Phone number** — proof.json has an empty phone field. Publish one anywhere? (Current recommendation: no, keep email-only.) **Answer:** ______
**12. MV location line** — ✅ RESOLVED (2026-07-12): canon location is **Indianapolis, Indiana (ZIP 46260)** across all Signal Flair + Mental Vision surfaces. Old Brownsburg / 46112 references retired. LinkedIn parent line (already "Indianapolis") now matches.

*Not asked because already verifiable:* founder name, both domains, hello@signalflair.ai, Indianapolis IN for SF, pricing, Case Zero numbers/dates (canon-locked), service definitions.
