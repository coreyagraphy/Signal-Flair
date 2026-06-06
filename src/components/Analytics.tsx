'use client'

import Script from 'next/script'
import { GA_ID } from '@/lib/analytics'

// Loads the GA4 gtag.js library and initializes the data layer. Rendered once in the root
// layout. Returns null when NEXT_PUBLIC_GA_ID is unset, so the production export ships with no
// analytics script until Corey drops the ID into the Netlify env — no tracking before then.
//
// `afterInteractive` defers loading until the page is interactive (correct for analytics —
// never block first paint). Works under static export because both scripts run client-side.
export default function Analytics() {
  if (!GA_ID) return null

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  )
}
