/** @type {import('next').NextConfig} */
const nextConfig = {
  // The canonical landing component runs imperative anime.js/canvas in one mount effect
  // with no teardown; React Strict Mode's dev-only double-invoke bound it to stale DOM
  // nodes (broke the intro reveal + gauge count). Off = dev matches production behavior.
  reactStrictMode: false,
  // Static export for IONOS hosting (Brand Brief V3 — Corey 2026-05-31).
  // `next build` emits a fully static site to ./out — upload that to IONOS.
  // No SSR / API routes / next/image optimization under export (none used here).
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Emit folder-based routes (out/<route>/index.html) so Apache/IONOS static
  // hosting serves clean URLs without per-route rewrites.
  trailingSlash: true,
}

module.exports = nextConfig
