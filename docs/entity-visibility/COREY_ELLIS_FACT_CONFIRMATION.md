# Founder Fact Confirmation — only what's actually missing

Everything below blocks or improves a specific published claim. Nothing here blocks the Phase-1 actions. Answer inline and commit, or answer in chat and Claude will update the surfaces.

## Blocking (needed within Week 1)

**1. Founding year of Signal Flair — 2025 or 2026?**
Site schema says `foundingDate: "2026"`; the LinkedIn company page says "Founded 2025". Which is correct (first real operation vs. brand launch)? → Fixes: LinkedIn field, schema, Crunchbase field.
**Answer:** ______

**2. Legal relationship wording.**
Canon records "Mental Vision — parent organization." Is there a legal entity (LLC/Inc/d/b/a) behind either brand, and is Signal Flair legally part of it or a brand of the same sole operation? Publishable wording today is "Signal Flair is a Mental Vision company/product" — confirm that stays the approved phrasing (schema uses `parentOrganization`/`subOrganization`; we deliberately avoid `owns`/`legalName` until this is answered).
*Update 2026-07-11: your Facebook handle is "Mentalvisionllc" — is the legal entity "Mental Vision LLC", and is Signal Flair a d/b/a or brand of that LLC? If yes, `legalName` can be added to schema.*
**Answer:** ______

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
**8. Google Business Profile** — does one exist for either brand already? If not, approve/deny creating SF as a service-area business (Brownsburg, address hidden) — packet §8. **Answer:** ______
**9. Trademark status** — Signal Score™, Stay Found™, etc. are used with ™ (fine unregistered). Confirm none are registered (®) and none are under filing, so no surface over- or under-claims. **Answer:** ______
**10. "Coreyagraphy" scope** — keep as public alias on MV surfaces only (current state), or also add to SF founder schema? **Answer:** ______
**11. Phone number** — proof.json has an empty phone field. Publish one anywhere? (Current recommendation: no, keep email-only.) **Answer:** ______
**12. MV location line** — LinkedIn parent reference says "Indianapolis"; canon mailing is Brownsburg 46112. Confirm Brownsburg everywhere (or Indianapolis-metro wording you prefer). **Answer:** ______

*Not asked because already verifiable:* founder name, both domains, hello@signalflair.ai, Brownsburg IN for SF, pricing, Case Zero numbers/dates (canon-locked), service definitions.
