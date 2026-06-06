// Google Analytics 4 — measurement layer.
//
// To go live: set NEXT_PUBLIC_GA_ID to the GA4 Measurement ID (looks like "G-XXXXXXXXXX")
// in .env.local locally, or in Netlify → Site settings → Environment variables. Until then
// GA_ID is empty: no gtag script is injected and every track() call is a safe no-op, so this
// commits cleanly with zero analytics traffic and respects the "nothing live yet" posture.
//
// NEXT_PUBLIC_ prefix is required for the value to be inlined into the static export at build
// time (no server runtime exists under output:'export').
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''

type GtagParams = Record<string, string | number | boolean | undefined>

// Fire a GA4 event. Guards on: SSR/no-window (build step), GA disabled (no ID), and gtag not
// yet loaded — in all three cases it silently returns instead of throwing, so callers never
// need to null-check. Safe to call from anywhere on the client.
export function track(event: string, params: GtagParams = {}): void {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag !== 'function') return
  gtag('event', event, params)
}
