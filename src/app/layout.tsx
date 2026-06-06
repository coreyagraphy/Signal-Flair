import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://signalflair.ai'),
  title: 'Signal Flair — Your business, found by AI.',
  description: 'Signal Flair scores your AI visibility across ChatGPT, Perplexity, Claude, Gemini, and Google AI — then builds the llms.txt, schema, and crawler access generative engines need to find and recommend you.',
  keywords: ['AI visibility', 'AEO', 'agentic engine optimization', 'llms.txt', 'schema markup', 'AI search', 'Indianapolis'],
  openGraph: {
    title: 'Signal Flair — Your business, found by AI.',
    description: 'Discovery is the first connection. We make your business visible to the AI engines deciding who gets recommended.',
    images: ['/video/hero-poster.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0806',
}

// Structured data — the entity layer AI engines read. Establishes "Signal Flair"
// (Indianapolis · AEO · a Mental Vision Corp product) as a distinct entity, which is
// the primary fix for the SignalFlare.ai name collision. Add real LinkedIn/Crunchbase/
// directory URLs to `sameAs` as they go live to strengthen disambiguation further.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': 'https://signalflair.ai/#org',
      name: 'Signal Flair',
      alternateName: 'Signal Flair AI Visibility',
      url: 'https://signalflair.ai',
      email: 'hello@signalflair.ai',
      slogan: 'Your business, found by AI.',
      description:
        'Signal Flair is an AI visibility and Answer Engine Optimization (AEO) company for local service businesses, based in Indianapolis, Indiana. We score how findable a business is across ChatGPT, Claude, Perplexity, Gemini, and Google AI, then deploy the llms.txt, schema markup, and crawler access those engines need to find and recommend it. Signal Flair is a Mental Vision Corp product and is a distinct company from SignalFlare.ai.',
      knowsAbout: ['AI visibility', 'Answer Engine Optimization', 'Generative Engine Optimization', 'llms.txt', 'Schema markup', 'AI search', 'AI crawler access'],
      areaServed: { '@type': 'Country', name: 'United States' },
      address: { '@type': 'PostalAddress', addressLocality: 'Indianapolis', addressRegion: 'IN', addressCountry: 'US' },
      founder: { '@type': 'Person', name: 'Corey Ellis' },
      parentOrganization: { '@type': 'Organization', name: 'Mental Vision Corp', url: 'https://mentalvision.ai' },
      sameAs: ['https://mentalvision.ai'],
      contactPoint: { '@type': 'ContactPoint', email: 'hello@signalflair.ai', contactType: 'sales', areaServed: 'US' },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://signalflair.ai/#website',
      url: 'https://signalflair.ai',
      name: 'Signal Flair',
      description: 'AI visibility + AEO for local businesses.',
      publisher: { '@id': 'https://signalflair.ai/#org' },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Service',
      serviceType: 'AI Visibility & Answer Engine Optimization',
      provider: { '@id': 'https://signalflair.ai/#org' },
      areaServed: { '@type': 'Country', name: 'United States' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Signal Flair Offers',
        itemListElement: [
          { '@type': 'Offer', name: 'Build the Foundation', description: 'Full AI-visibility build for businesses scoring 0–54: audit, llms.txt, schema, crawler access, entity cleanup, citations, 90-day plan, and an AI-optimized landing page.', price: '3500', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Start the Rebuild', description: 'Core AI-visibility fixes for businesses scoring 55–74.', price: '1500', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Stay Found System', description: 'Ongoing monthly AI-visibility monitoring and citation growth for businesses scoring 75–100.', priceSpecification: { '@type': 'PriceSpecification', minPrice: '600', maxPrice: '1200', priceCurrency: 'USD' } },
        ],
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  )
}
