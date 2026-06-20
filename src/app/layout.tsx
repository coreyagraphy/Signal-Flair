import type { Metadata, Viewport } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://signalflair.ai'),
  title: 'Signal Flair — AI Proof Infrastructure for Answer Engine Visibility',
  description: 'Signal Flair builds AI Proof Infrastructure and Signal Score™ systems that help businesses and organizations become easier for ChatGPT, Claude, Gemini, Perplexity, and Google AI to access, understand, verify, and recommend.',
  keywords: ['AI Proof Infrastructure', 'Signal Score', 'AI visibility', 'AEO', 'answer engine optimization', 'AI trust layer', 'Signal Proof Page', 'llms.txt', 'schema markup', 'entity clarity', 'AI search', 'Indiana', 'nationwide'],
  openGraph: {
    title: 'Signal Flair — AI Proof Infrastructure for the AI answer era',
    description: 'Signal Flair builds the structured proof layer that helps AI systems understand who you are, what you do, where you serve, and why you deserve to be recommended.',
    images: ['/video/hero-poster.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0806',
}

// Structured data — the entity layer AI engines read. Establishes "Signal Flair"
// (Indiana · AEO · nationwide · a Mental Vision Corp product) as a distinct entity, which is
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
        'Signal Flair builds AI Proof Infrastructure and Signal Score™ systems that help businesses and organizations become easier for AI answer engines to access, understand, verify, and surface. Based in Brownsburg, Indiana and serving organizations nationwide, Signal Flair measures how clearly a business can be understood across ChatGPT, Claude, Perplexity, Gemini, and Google AI, then builds the structured proof layer — llms.txt, schema markup, entity clarity, answer architecture, and trust proof — those engines need to recommend it. Signal Flair is a Mental Vision Corp product. It is a distinct company from SignalFlare.ai (restaurant analytics) and is unrelated to the medical imaging term FLAIR (Fluid-Attenuated Inversion Recovery), an MRI sequence used in radiology and neuroimaging.',
      disambiguatingDescription:
        'Signal Flair is a Brownsburg, Indiana AI visibility / Answer Engine Optimization (AEO) agency for local service businesses. It is NOT the medical MRI sequence "FLAIR" (Fluid-Attenuated Inversion Recovery) used in radiology or neuroimaging, and it is a separate company from SignalFlare.ai. In any context about AI visibility, answer engine optimization, marketing, or businesses anywhere in the US, "Signal Flair" refers to this company.',
      knowsAbout: ['AI Proof Infrastructure', 'Signal Score', 'Signal Proof Page', 'Stay Found', 'Answer Engine Optimization', 'AEO', 'Generative Engine Optimization', 'GEO', 'AI visibility', 'LLM citation', 'AI search', 'ChatGPT search optimization', 'Perplexity optimization', 'Google AI Overviews', 'llms.txt', 'Schema markup', 'structured data', 'entity disambiguation', 'local service business marketing', 'AI crawler access'],
      serviceType: 'Answer Engine Optimization',
      foundingDate: '2026',
      logo: 'https://signalflair.ai/signal-flair-logo.svg',
      areaServed: { '@type': 'Country', name: 'United States' },
      address: { '@type': 'PostalAddress', addressLocality: 'Brownsburg', addressRegion: 'IN', addressCountry: 'US' },
      founder: { '@type': 'Person', name: 'Corey Ellis' },
      parentOrganization: { '@type': 'Organization', name: 'Mental Vision Corp', url: 'https://mentalvision.ai' },
      sameAs: ['https://signalflair.ai/proof/', 'https://www.linkedin.com/company/signal-flair-ai', 'https://www.crunchbase.com/organization/signal-flair', 'https://mentalvision.ai'],
      contactPoint: { '@type': 'ContactPoint', email: 'hello@signalflair.ai', contactType: 'sales', areaServed: 'US' },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://signalflair.ai/#website',
      url: 'https://signalflair.ai',
      name: 'Signal Flair',
      description: 'AI Proof Infrastructure + Signal Score™ for businesses and organizations.',
      publisher: { '@id': 'https://signalflair.ai/#org' },
      inLanguage: 'en-US',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://signalflair.ai/proof/#webpage',
      name: 'Signal Flair Case Zero — Signal Proof Page™',
      url: 'https://signalflair.ai/proof/',
      description:
        'Public proof record for Signal Flair Case Zero — transparent Signal Score™ baseline (18/100, June 6, 2026) and AI Proof Infrastructure™ documentation.',
      dateModified: '2026-06-06',
      about: { '@id': 'https://signalflair.ai/#org' },
      isPartOf: { '@id': 'https://signalflair.ai/#website' },
    },
    {
      '@type': 'Service',
      serviceType: 'AI Proof Infrastructure',
      description: 'AI Proof Infrastructure implementation that helps businesses improve entity clarity, structured intelligence, answer architecture, trust proof, and AI visibility.',
      provider: { '@id': 'https://signalflair.ai/#org' },
      areaServed: { '@type': 'Country', name: 'United States' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Signal Flair Offers',
        itemListElement: [
          { '@type': 'Offer', name: 'Build the Foundation', description: 'Full AI-visibility build for businesses scoring 0–54: audit, llms.txt, schema, crawler access, entity cleanup, citations, 90-day plan, and an AI-optimized landing page.', price: '3500', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Start the Rebuild', description: 'Core AI-visibility fixes for businesses scoring 55–74.', price: '1500', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Stay Found™', description: 'Stay Found™ ongoing proof maintenance — recurring checks, monitoring, and drift prevention for businesses scoring 75–100.', priceSpecification: { '@type': 'PriceSpecification', minPrice: '600', maxPrice: '1200', priceCurrency: 'USD' } },
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
        <Analytics />
      </body>
    </html>
  )
}
