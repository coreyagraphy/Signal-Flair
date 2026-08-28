import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

export const metadata: Metadata = {
  title: 'About — AI Visibility & Answer Engine Optimization | Signal Flair',
  description:
    'Signal Flair is an AI Proof Infrastructure company based in Indianapolis, Indiana, serving nationwide — a product of Mental Vision, founded by Corey Ellis. It works underneath SEO and AEO, connecting your website, profiles, proof, images, video, and entity relationships so AI systems can verify who you are.',
  alternates: { canonical: 'https://signalflair.ai/about/' },
  openGraph: {
    title: 'About Signal Flair — found by AI, by design',
    description:
      'An Indianapolis, Indiana AI Proof Infrastructure company that audited itself first: Case Zero, 18/100, rebuilt in public to 98/100. A Mental Vision product.',
    images: ['/video/hero-poster.jpg'],
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
      email: 'outreach@signalflair.com',
      description:
        'Signal Flair builds AI Proof Infrastructure — the structured proof layer that helps AI answer engines access, understand, verify, and recommend a business. Based in Indianapolis, Indiana and serving organizations nationwide, it is a product of Mental Vision. It is unrelated to SignalFlare.ai and to the medical MRI term FLAIR (Fluid-Attenuated Inversion Recovery).',
      foundingDate: '2026',
      areaServed: { '@type': 'Country', name: 'United States' },
      address: { '@type': 'PostalAddress', addressLocality: 'Indianapolis', addressRegion: 'IN', addressCountry: 'US' },
      founder: { '@id': 'https://signalflair.ai/#founder' },
      parentOrganization: { '@type': 'Organization', name: 'Mental Vision', url: 'https://mentalvision.ai' },
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
  ],
}

export default function AboutPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 70, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#cta">▸ Free Signal Pulse™</a>
      </nav>

      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow">About · Indianapolis, Indiana, nationwide</div>
          <h1 className="rsc-h1">Found by AI, <em>by design.</em></h1>
          <p className="rsc-lead">
            Signal Flair is an AI Proof Infrastructure company based in Indianapolis, Indiana,
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
            machine-readable layer those engines need — crawler access, schema markup, entity clarity, and
            consistent verified facts — so your business becomes the answer, not a missing one.
          </p>
          <ul className="rsc-ul">
            <li><strong>AI Visibility Audit</strong> — your Signal Score across five engines, and exactly what&apos;s pulling it down.</li>
            <li><strong>Foundation Build</strong> — schema, crawler access, and your verified proof layer installed in 7–14 days.</li>
            <li><strong>Stay Found™</strong> — recurring checks and proof maintenance: re-scans on a set schedule and citation growth as AI search keeps changing.</li>
          </ul>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">We audited <em>ourselves</em> first</h2>
          <p className="rsc-p">
            Case Zero is our own AI visibility audit. Signal Flair scored
            <strong> 18 out of 100</strong> on June 6, 2026 — Signal Invisible. We published it, rebuilt
            in public, and re-measured: <strong>73/100</strong> on July 5, <strong>91/100</strong> on
            August 3, and <strong>98/100</strong> on August 19 — read by the public scanner behind
            every Signal Pulse™. Every reading is dated, including the weak ones. We never fabricate scores,
            testimonials, or results. See the full live record on the <a href="/proof/">proof page</a>.
          </p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">We keep the <em>receipts.</em></h2>
          <p className="rsc-lead">
            SEO gets you ranked. AEO — Answer Engine Optimization — gets you quoted. We make sure the machines know who the hell they&apos;re
            talking about — and we keep the receipts so we can prove what changed.
          </p>
          <p className="rsc-p">
            Signal Flair works underneath both — connecting your identity, proof, structure, profiles, images,
            video, and public signals so AI systems can understand the right organization and verify what&apos;s
            true. And we don&apos;t toss the evidence after the audit. We preserve the scores, findings, sources,
            and assessment history so each new review can show what changed, what improved, and what still needs
            fixing. Prior assessments aren&apos;t overwritten — the before-and-after stays inspectable.
          </p>
          <p className="rsc-p">
            The moat is not content volume. It is <em>evidence coherence</em> — across your website, profiles,
            images, video, public proof, and entity relationships — and the history showing how that evidence
            changes over time. Signal Flair does not sell client or prospect data, train AI models on it, or claim
            industry-wide benchmarks, and never publishes private assessment records.
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
            Signal Flair is an AI Proof Infrastructure company. It is <strong>not</strong> FLAIR (Fluid-Attenuated
            Inversion Recovery), the MRI sequence used in neuroimaging, and it is a separate company
            from <strong>SignalFlare.ai</strong>, a restaurant-analytics product. In any context about
            AI visibility, Answer Engine Optimization, or businesses anywhere in the US, &ldquo;Signal
            Flair&rdquo; refers to this company.
          </p>
        </section>

        <section className="rsc-cta">
          <h2 className="rsc-cta-h">See where <em>your</em> business stands.</h2>
          <p className="rsc-cta-b">A free Signal Pulse™ — a four-signal read of your live site, 24 hours, no call. You&apos;ll see what&apos;s breaking your signal.</p>
          <a className="rsc-cta-btn" href="/#cta">▸ Run My Signal</a>
        </section>
      </div>

      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Indianapolis, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/faq/">faq</a> · <a href="/how-it-works/">how it works</a> · <a href="/proof/">the record</a> · <a href="/privacy/">privacy</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
