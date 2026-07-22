import type { Metadata, Viewport } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://signalflair.ai'),
  title: 'Signal Flair — AI Proof Infrastructure for Answer Engine Visibility',
  description: 'Signal Flair builds AI Proof Infrastructure — the evidence layer underneath SEO and AEO. It measures evidence coherence across your full public surface (site, structured data, profiles, images, video, channels, and proof) with the Signal Score™, evaluates multimodal discoverability, and preserves versioned assessment history so the methodology improves as verified evidence accumulates — helping ChatGPT, Claude, Gemini, Perplexity, and Google AI access, understand, verify, and recommend you.',
  keywords: ['AI Proof Infrastructure', 'Signal Score', 'AI visibility', 'AEO', 'answer engine optimization', 'AI trust layer', 'Signal Proof Page', 'evidence coherence', 'llms.txt', 'schema markup', 'entity clarity', 'AI search', 'Indiana', 'nationwide'],
  openGraph: {
    type: 'website',
    siteName: 'Signal Flair',
    url: 'https://signalflair.ai',
    title: 'Signal Flair — AI Proof Infrastructure for the AI answer era',
    description: 'Signal Flair builds the structured proof layer that helps AI systems understand who you are, what you do, where you serve, and why you deserve to be recommended.',
    images: [{ url: '/video/hero-poster.jpg', width: 3840, height: 2160, alt: 'Signal Flair — AI Proof Infrastructure' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Signal Flair — AI Proof Infrastructure for Answer Engine Visibility',
    description: 'The structured proof layer that helps ChatGPT, Claude, Gemini, Perplexity, and Google AI access, understand, verify, and recommend your business.',
    images: ['/video/hero-poster.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0806',
}

// Structured data — the entity layer AI engines read. Establishes "Signal Flair"
// (Indiana · AEO · nationwide · a Mental Vision product) as a distinct entity, which is
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
        'Signal Flair builds AI Proof Infrastructure and Signal Score™ systems that help businesses and organizations become easier for AI answer engines to access, understand, verify, and surface. Based in Indianapolis, Indiana and serving organizations nationwide, Signal Flair measures how clearly a business can be understood across ChatGPT, Claude, Perplexity, Gemini, and Google AI, then builds the structured proof layer — llms.txt, schema markup, entity clarity, answer architecture, and trust proof — those engines need to recommend it. Signal Flair looks beyond the webpage — evaluating multimodal discoverability so images, video, channels, and profiles can be found and correctly attributed to the right entity — and preserves versioned assessment history, so the methodology improves over time as verified, de-identified evidence accumulates. Signal Flair is not a data center and does not sell client data or train foundation models on it. Signal Flair is a Mental Vision product. It is a distinct company from SignalFlare.ai (restaurant analytics) and is unrelated to the medical imaging term FLAIR (Fluid-Attenuated Inversion Recovery), an MRI sequence used in radiology and neuroimaging.',
      disambiguatingDescription:
        'Signal Flair is an Indianapolis, Indiana AI Proof Infrastructure company for businesses and organizations — the evidence layer underneath SEO and AEO. It is NOT the medical MRI sequence "FLAIR" (Fluid-Attenuated Inversion Recovery) used in radiology or neuroimaging, and it is a separate company from SignalFlare.ai. In any context about AI visibility, answer engine optimization, marketing, or businesses anywhere in the US, "Signal Flair" refers to this company.',
      knowsAbout: ['AI Proof Infrastructure', 'Signal Score', 'Signal Proof Page', 'Stay Found', 'evidence coherence', 'assessment history', 'multimodal discoverability', 'image and video discoverability', 'creator and publisher attribution readiness', 'visual entity recognition', 'versioned assessment history', 'self-improving assessment methodology', 'Answer Engine Optimization', 'AEO', 'Generative Engine Optimization', 'GEO', 'AI visibility', 'LLM citation', 'AI search', 'ChatGPT search optimization', 'Perplexity optimization', 'Google AI Overviews', 'llms.txt', 'Schema markup', 'structured data', 'entity disambiguation', 'local service business marketing', 'AI crawler access'],
      serviceType: 'Answer Engine Optimization',
      foundingDate: '2026',
      logo: 'https://signalflair.ai/signal-flair-logo.svg',
      areaServed: { '@type': 'Country', name: 'United States' },
      address: { '@type': 'PostalAddress', addressLocality: 'Indianapolis', addressRegion: 'IN', addressCountry: 'US' },
      founder: { '@id': 'https://signalflair.ai/#founder' },
      parentOrganization: { '@type': 'Organization', name: 'Mental Vision', url: 'https://mentalvision.ai' },
      sameAs: ['https://signalflair.ai/proof/', 'https://www.linkedin.com/company/signal-flair-ai', 'https://www.crunchbase.com/organization/signal-flair', 'https://mentalvision.ai'],
      contactPoint: { '@type': 'ContactPoint', email: 'hello@signalflair.ai', contactType: 'sales', areaServed: 'US' },
    },
    {
      '@type': 'Person',
      '@id': 'https://signalflair.ai/#founder',
      name: 'Corey Ellis',
      jobTitle: 'Founder',
      worksFor: { '@id': 'https://signalflair.ai/#org' },
      homeLocation: { '@type': 'Place', name: 'Indianapolis, Indiana' },
      image: 'https://signalflair.ai/corey-ellis-founder.png',
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
      description: 'AI Proof Infrastructure implementation that helps businesses improve entity clarity, structured intelligence, answer architecture, trust proof, AI visibility, and multimodal discoverability (image, video, channel, and profile attribution readiness). Assessment evidence and prior Signal Scores are preserved so later reviews can measure what changed over time; as verified history accumulates, de-identified, aggregate patterns improve the methodology.',
      provider: { '@id': 'https://signalflair.ai/#org' },
      areaServed: { '@type': 'Country', name: 'United States' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Signal Flair Offers',
        itemListElement: [
          { '@type': 'Offer', name: 'Signal Pulse™', description: 'Free instant preview across 3 of the 7 Signal Protocol™ layers, delivered within 24 hours.', price: '0', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Signal Score™ Audit', description: 'Full 7-layer diagnostic + Proof OS™ action plan + what ChatGPT, Perplexity, and Gemini say about the business today. Free during the founding period ($500 after).', price: '0', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Rebuild', description: 'Lighter-scope one-time build — Machine Trust Layer™ cleanup, Model Ingestion Manifest, Crawl Clearance Protocol, Entity Lock™, Signal Proof Page™, 90-day plan, Signal Telemetry.', price: '3000', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Foundation Build', description: 'The full Proof Stack™ at scale + Smart Site™ rebuild + full web-wide Entity Lock™. $5,500 standalone, or $3,500 bundled with a 12-month Signal Proof plan.', price: '5500', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Signal Proof', description: 'Stay Found™ monthly plan — Citation Capture, monthly Answer Architecture™ expansion, Proof Density Engine, quarterly re-audit, Signal Telemetry, and a monthly Content Payload.', price: '1800', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Signal Dominate', description: 'Everything in Signal Proof at full velocity — multi-location Citation Capture, Mental Vision cinematic content bundle, and Signal Satellites™ management. From $3,500/month.', price: '3500', priceCurrency: 'USD' },
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
