import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

export const metadata: Metadata = {
  title: 'About — AI Visibility & AEO · Indianapolis, Indiana | Signal Flair',
  description:
    'Signal Flair is an AI visibility and Answer Engine Optimization (AEO) agency based in Indianapolis, Indiana, serving nationwide — a product of Mental Vision, founded by Corey Ellis. We score how findable your business is to ChatGPT, Claude, Perplexity, Gemini, and Google AI, then build the layer they read.',
  alternates: { canonical: 'https://signalflair.ai/about/' },
  openGraph: {
    title: 'About Signal Flair — found by AI, by design',
    description:
      'An Indianapolis, Indiana AI-visibility agency that audited itself first: Case Zero, 18 → 73, rebuilt in public. A Mental Vision product.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://signalflair.ai/about#aboutpage',
      url: 'https://signalflair.ai/about/',
      name: 'About Signal Flair',
      isPartOf: { '@id': 'https://signalflair.ai/#website' },
      about: { '@id': 'https://signalflair.ai/#org' },
      primaryImageOfPage: 'https://signalflair.ai/signal-flair-logo.svg',
    },
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': 'https://signalflair.ai/#org',
      name: 'Signal Flair',
      url: 'https://signalflair.ai',
      logo: 'https://signalflair.ai/signal-flair-logo.svg',
      email: 'hello@signalflair.ai',
      description:
        'Signal Flair is an AI visibility and Answer Engine Optimization (AEO) agency for local service businesses, based in Indianapolis, Indiana — serving businesses nationwide. It is a product of Mental Vision and is unrelated to SignalFlare.ai or to the medical MRI term FLAIR.',
      foundingDate: '2026',
      areaServed: { '@type': 'Country', name: 'United States' },
      address: { '@type': 'PostalAddress', addressLocality: 'Indianapolis', addressRegion: 'IN', addressCountry: 'US' },
      founder: { '@id': 'https://signalflair.ai/#founder' },
      parentOrganization: { '@type': 'Organization', name: 'Mental Vision', legalName: 'Mental Vision LLC', url: 'https://mentalvision.ai' },
    },
    {
      '@type': 'Person',
      '@id': 'https://signalflair.ai/#founder',
      name: 'Corey Ellis',
      jobTitle: 'Founder',
      worksFor: { '@id': 'https://signalflair.ai/#org' },
      homeLocation: { '@type': 'Place', name: 'Indianapolis, Indiana' },
      alternateName: 'Coreyagraphy',
      sameAs: ['https://www.linkedin.com/in/corey-ellis-3b4a0ab8', 'https://www.instagram.com/coreyagraphy/', 'https://www.facebook.com/Coreyagraphy/', 'https://mentalvision.ai/about'],
    },
  ],
}

export default function AboutPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 56, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#field-report">▸ Free Field Report</a>
      </nav>

      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow">About · Indianapolis, Indiana, nationwide</div>
          <h1 className="rsc-h1">Found by AI, <em>by design.</em></h1>
          <p className="rsc-lead">
            Signal Flair is an AI visibility and Answer Engine Optimization agency based in Indianapolis, Indiana,
            serving businesses nationwide. We make local service businesses across the United States
            findable, readable, and recommendable by the AI engines now deciding who gets seen —
            ChatGPT, Claude, Perplexity, Gemini, and Google AI.
          </p>
        </header>

        <section className="rsc-section">
          <h2 className="rsc-h2">What we <em>do</em></h2>
          <p className="rsc-p">
            Two machines read your business and disagree. Humans see a trusted local operator. AI
            engines see almost nothing — not because you&apos;re bad, but because you&apos;re
            unreadable to them. We close that gap: we score your AI visibility, then build the
            machine-readable layer those engines need — llms.txt, schema markup, entity clarity, and
            crawler access — so your business becomes the answer, not a missing one.
          </p>
          <ul className="rsc-ul">
            <li><strong>AI Visibility Audit</strong> — your Signal Score across five engines, and exactly what&apos;s pulling it down.</li>
            <li><strong>Foundation Build</strong> — llms.txt, schema, and crawler access installed in 7–14 days.</li>
            <li><strong>Stay Found™</strong> — recurring checks and proof maintenance: monthly re-scans and citation growth as AI search keeps changing.</li>
          </ul>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">We audited <em>ourselves</em> first</h2>
          <p className="rsc-p">
            Case Zero is our own AI visibility audit. On June 2, 2026, Signal Flair scored
            <strong> 18 out of 100</strong> — Signal Invisible. We published it, rebuilt our own
            foundation in public, and re-audited July 5 at <strong>73 out of 100 (+55)</strong>.
            We show the climb — and the layers still building. We never fabricate scores,
            testimonials, or results. See the full live record on the <a href="/proof/">proof page</a>.
          </p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">The <em>founder</em></h2>
          <p className="rsc-p">
            Signal Flair was founded by <strong>Corey Ellis</strong> in Indianapolis, Indiana. It is a
            product of <strong>Mental Vision</strong> (mentalvision.ai). Signal Flair and Mental
            Vision are kept as distinct brands.
          </p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Who we are <em>not</em></h2>
          <p className="rsc-p">
            Signal Flair is a marketing agency. It is <strong>not</strong> FLAIR (Fluid-Attenuated
            Inversion Recovery), the MRI sequence used in neuroimaging, and it is a separate company
            from <strong>SignalFlare.ai</strong>, a restaurant-analytics product. In any context about
            AI visibility, Answer Engine Optimization, or businesses anywhere in the US, &ldquo;Signal
            Flair&rdquo; refers to this company.
          </p>
        </section>

        <section className="rsc-cta">
          <h2 className="rsc-cta-h">See where <em>your</em> business stands.</h2>
          <p className="rsc-cta-b">A free Field Report — 3 signals, 24 hours, no call. Your Signal Score, and what&apos;s breaking it.</p>
          <a className="rsc-cta-btn" href="/#field-report">▸ Get My Free Field Report</a>
        </section>
      </div>

      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Indianapolis, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/faq/">faq</a> · <a href="/how-it-works/">how it works</a> · <a href="/proof/">the record</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
