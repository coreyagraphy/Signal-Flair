import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

export const metadata: Metadata = {
  title: 'Privacy & Data Use | Signal Flair',
  description:
    'How Signal Flair collects, uses, and protects your data — and how de-identified, aggregate assessment history improves our methodology. We are not a data center: we never sell your data, publish private records, or train foundation models on private client data.',
  alternates: { canonical: 'https://signalflair.ai/privacy/' },
  openGraph: {
    title: 'Privacy & Data Use — Signal Flair',
    description:
      'Plain-language privacy: what we collect, how we use it, and our data-use commitments. We never sell your data.',
    images: ['/video/hero-poster.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://signalflair.ai/privacy/#webpage',
      url: 'https://signalflair.ai/privacy/',
      name: 'Privacy & Data Use | Signal Flair',
      description:
        'Signal Flair privacy and data-use policy: what is collected, how it is used, de-identified aggregate methodology improvement, and client data commitments.',
      about: { '@id': 'https://signalflair.ai/#org' },
      isPartOf: { '@id': 'https://signalflair.ai/#website' },
      publisher: { '@id': 'https://signalflair.ai/#org' },
      inLanguage: 'en-US',
      dateModified: '2026-07-17',
    },
  ],
}

export default function PrivacyPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 70, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#cta">▸ Free Signal Pulse™</a>
      </nav>

      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow">Privacy &amp; data use · Effective July 17, 2026</div>
          <h1 className="rsc-h1">Your data, <em>handled straight.</em></h1>
          <p className="rsc-lead">
            Signal Flair is AI Proof Infrastructure — a product of Mental Vision, based in Indianapolis,
            Indiana. This page explains, in plain language, what we collect, how we use it, and the
            commitments we hold ourselves to. No dark patterns, no fine-print surprises.
          </p>
        </header>

        <section className="rsc-section">
          <h2 className="rsc-h2">The short <em>version</em></h2>
          <ul className="rsc-ul">
            <li>We collect only what you give us on the Signal Pulse™ form and basic analytics — nothing more.</li>
            <li>We use it to run and deliver your assessment and to follow up about it.</li>
            <li>We preserve your assessment history so <strong>your</strong> future reviews can measure change.</li>
            <li>As verified history accumulates, <strong>de-identified, aggregate</strong> patterns improve our methodology — never to identify, profile, or resell you.</li>
            <li>Signal Flair is <strong>not a data center</strong>. We do not sell your data, publish private records, or train foundation models on private client data.</li>
            <li>You can ask us to access or delete your data any time: <a href="mailto:hello@signalflair.ai">hello@signalflair.ai</a>.</li>
          </ul>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">What we <em>collect</em></h2>
          <p className="rsc-p">
            From the Signal Pulse™ form: your name, business name, website URL, email, and (optionally) service
            type and phone number. Automatically, we collect standard analytics — page views and basic device
            information via Google Analytics — and technical context attached to a submission (referring page and
            campaign parameters). We do not collect payment information on this site.
          </p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">How we <em>use</em> it</h2>
          <p className="rsc-p">
            To run your Signal Score™ assessment and deliver your Signal Pulse™; to follow up about your assessment
            and services you asked about; to improve the site; and to keep a record of your assessments so later
            reviews can show what changed. We do not use your information for unrelated marketing lists.
          </p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Assessment history &amp; our <em>methodology</em></h2>
          <p className="rsc-p">
            Signal Flair preserves the evidence behind each assessment — the date, the Signal Score™, the layer-by-layer
            breakdown, the findings, and the sources — so a later review can measure change instead of starting over.
            Your assessment history stays attached to the organization it belongs to.
          </p>
          <p className="rsc-p">
            As verified history accumulates, Signal Flair may use <strong>de-identified, aggregate</strong> patterns
            to improve its own methodology — to understand which evidence gaps repeatedly matter and how AI systems
            read organizations over time. This work is de-identified and aggregate by design. Signal Flair
            <strong> does not</strong> sell or monetize client or prospect data, publish private assessment records,
            train foundation models on private client data, or claim a large proprietary dataset. Signal Flair is
            not a data center.
          </p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Who we share it <em>with</em></h2>
          <p className="rsc-p">
            Only the service providers that help us operate — our CRM / intake system (to receive and manage your
            request) and our analytics provider (Google Analytics). These providers process data on our behalf under
            their own terms. We do <strong>not</strong> sell your data or share it with advertisers. We may disclose
            information if required by law.
          </p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Your choices &amp; <em>rights</em></h2>
          <p className="rsc-p">
            You can ask us to access, correct, or delete your personal information, or to stop contacting you, at any
            time — email <a href="mailto:hello@signalflair.ai">hello@signalflair.ai</a> and we will honor it. If you
            are in a region with privacy laws such as the GDPR or CCPA/CPRA, those rights apply to you. You can opt
            out of analytics using your browser settings or Google&apos;s opt-out tools.
          </p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Security, retention &amp; <em>children</em></h2>
          <p className="rsc-p">
            We take reasonable measures to protect your information and keep it only as long as needed for the
            purposes above or as required by law. Clients keep everything we build for them, even if they cancel.
            This site is for businesses and organizations; it is not directed at children under 13, and we do not
            knowingly collect their data.
          </p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Changes &amp; <em>contact</em></h2>
          <p className="rsc-p">
            We may update this page as the service evolves; the effective date above will change when we do. Questions
            about privacy or your data? Email <a href="mailto:hello@signalflair.ai">hello@signalflair.ai</a>.
          </p>
        </section>

        <section className="rsc-cta">
          <h2 className="rsc-cta-h">See where <em>your</em> business stands.</h2>
          <p className="rsc-cta-b">A free Signal Pulse™ — a four-signal read of your live site, 24 hours, no call. No credit card, no spam.</p>
          <a className="rsc-cta-btn" href="/#cta">▸ Run My Signal</a>
        </section>
      </div>

      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Indianapolis, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/about/">about</a> · <a href="/faq/">faq</a> · <a href="/how-it-works/">how it works</a> · <a href="/proof/">the record</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
