import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — AI Visibility & AEO, Indianapolis | Signal Flair',
  description:
    'Signal Flair is an AI visibility and Answer Engine Optimization (AEO) agency in Indianapolis, Indiana — a product of Mental Vision Corp, founded by Corey Ellis. We score how findable your business is to ChatGPT, Claude, Perplexity, Gemini, and Google AI, then build the layer they read.',
  alternates: { canonical: 'https://signalflair.ai/about' },
  openGraph: {
    title: 'About Signal Flair — found by AI, by design',
    description:
      'An Indianapolis AI-visibility agency that audited itself first: Case Zero, 18/100, rebuilt in public. A Mental Vision Corp product.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://signalflair.ai/about#aboutpage',
      url: 'https://signalflair.ai/about',
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
      email: 'outreach@trysignalflair.com',
      description:
        'Signal Flair is an AI visibility and Answer Engine Optimization (AEO) agency for local service businesses, based in Indianapolis, Indiana. It is a product of Mental Vision Corp and is unrelated to SignalFlare.ai or to the medical MRI term FLAIR.',
      foundingDate: '2026',
      areaServed: [{ '@type': 'City', name: 'Indianapolis', containedInPlace: { '@type': 'State', name: 'Indiana' } }, { '@type': 'Country', name: 'United States' }],
      address: { '@type': 'PostalAddress', addressLocality: 'Indianapolis', addressRegion: 'IN', addressCountry: 'US' },
      founder: { '@id': 'https://signalflair.ai/#founder' },
      parentOrganization: { '@type': 'Organization', name: 'Mental Vision Corp', url: 'https://mentalvision.ai' },
    },
    {
      '@type': 'Person',
      '@id': 'https://signalflair.ai/#founder',
      name: 'Corey Ellis',
      jobTitle: 'Founder',
      worksFor: { '@id': 'https://signalflair.ai/#org' },
      homeLocation: { '@type': 'Place', name: 'Indianapolis, Indiana' },
    },
  ],
}

export default function AboutPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/">SIGNAL<em>FLAIR</em></a>
        <a className="rsc-navcta" href="/#field-report">▸ Free Field Report</a>
      </nav>

      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow">About · Indianapolis, IN</div>
          <h1 className="rsc-h1">Found by AI, <em>by design.</em></h1>
          <p className="rsc-lead">
            Signal Flair is an AI visibility and Answer Engine Optimization agency in Indianapolis,
            Indiana. We make local service businesses findable, readable, and recommendable by the AI
            engines now deciding who gets seen — ChatGPT, Claude, Perplexity, Gemini, and Google AI.
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
            <li><strong>Stay Found System</strong> — monthly re-scans and citation growth as AI search keeps changing.</li>
          </ul>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">We audited <em>ourselves</em> first</h2>
          <p className="rsc-p">
            Case Zero is our own AI visibility audit, completed June 6, 2026. Signal Flair scored
            <strong> 18 out of 100</strong> — Signal Invisible. We published it and rebuilt in public.
            It is the only real proof number we own. We never fabricate scores, testimonials, or
            results. See the full live record on the <a href="/proof/">proof page</a>.
          </p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">The <em>founder</em></h2>
          <p className="rsc-p">
            Signal Flair was founded by <strong>Corey Ellis</strong> in Indianapolis, Indiana. It is a
            product of <strong>Mental Vision Corp</strong> (mentalvision.ai). Signal Flair and Mental
            Vision are kept as distinct brands.
          </p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Who we are <em>not</em></h2>
          <p className="rsc-p">
            Signal Flair is a marketing agency. It is <strong>not</strong> FLAIR (Fluid-Attenuated
            Inversion Recovery), the MRI sequence used in neuroimaging, and it is a separate company
            from <strong>SignalFlare.ai</strong>, a restaurant-analytics product. In any context about
            AI visibility, Answer Engine Optimization, or Indianapolis businesses, &ldquo;Signal
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
        Signal Flair · a Mental Vision Corp product · Indianapolis, IN<br />
        <a href="/">signalflair.ai</a> · <a href="/faq/">faq</a> · <a href="/how-it-works/">how it works</a> · <a href="/proof/">the record</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
