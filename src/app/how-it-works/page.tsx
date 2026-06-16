import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works — Scan, Score, Fix, Stay Found | Signal Flair',
  description:
    'How Signal Flair works: we scan your business across five AI engines, score your AI visibility 0–100, fix the machine-readable layer (llms.txt, schema, crawler access), and keep your score true over time. Pricing is set by your score.',
  alternates: { canonical: 'https://signalflair.ai/how-it-works' },
  openGraph: {
    title: 'How Signal Flair works — scan, score, fix, stay found',
    description:
      'Four steps from invisible to found, plus score-gated pricing so the work matches the actual gap.',
  },
}

const STEPS: { k: string; t: string; d: string }[] = [
  {
    k: '01',
    t: 'Scan',
    d: 'We run your business through ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews and check the layer they actually read — llms.txt, schema markup, crawler access, entity clarity, reviews, and authority content.',
  },
  {
    k: '02',
    t: 'Score',
    d: 'You get a Signal Score from 0 to 100 across the core signals, plus exactly what is pulling it down. Most local businesses score under 40 and never knew it. The score sets the entry point so the work matches the real gap.',
  },
  {
    k: '03',
    t: 'Fix',
    d: 'We build the machine-readable layer: llms.txt deployed, schema markup installed, AI crawlers unblocked, entity collisions resolved, and a 90-day AI action plan handed over. Built in 7–14 days, not months. You keep everything, even if you cancel.',
  },
  {
    k: '04',
    t: 'Stay Found',
    d: 'AI search changes constantly. The Stay Found System re-scans monthly, refreshes citations, updates schema and llms.txt, and monitors crawler access — so your Signal Score stays true as new engines ship and competitors catch up.',
  },
]

const TIERS: { name: string; band: string; price: string; type: string }[] = [
  { name: 'Build the Foundation', band: 'Score 0–54', price: '$3,500', type: 'one-time' },
  { name: 'Start the Rebuild', band: 'Score 55–74', price: '$1,500', type: 'one-time' },
  { name: 'Stay Found System', band: 'Score 75–100', price: '$600–$1,200/mo', type: 'recurring' },
  { name: 'Founding Client', band: 'Score 0–54 · first 10', price: '$1,750', type: 'one-time' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'HowTo',
      '@id': 'https://signalflair.ai/how-it-works#howto',
      name: 'How Signal Flair makes your business visible to AI',
      description:
        'The four-step Signal Flair process: scan across five AI engines, score AI visibility 0–100, fix the machine-readable layer, and maintain the score over time.',
      step: STEPS.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.t,
        text: s.d,
      })),
    },
    {
      '@type': 'Service',
      serviceType: 'AI Visibility & Answer Engine Optimization',
      provider: { '@id': 'https://signalflair.ai/#org' },
      areaServed: { '@type': 'Country', name: 'United States' },
      description: 'AI visibility scoring and AEO buildout for local service businesses, priced by Signal Score.',
      offers: TIERS.map((t) => ({
        '@type': 'Offer',
        name: t.name,
        description: `${t.band} — ${t.type}.`,
        price: t.price.replace(/[^0-9–-]/g, ''),
        priceCurrency: 'USD',
      })),
    },
  ],
}

export default function HowItWorksPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/">SIGNAL<em>FLAIR</em></a>
        <a className="rsc-navcta" href="/#field-report">▸ Free Field Report</a>
      </nav>

      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow">How it works</div>
          <h1 className="rsc-h1">Invisible to <em>found,</em> in four steps.</h1>
          <p className="rsc-lead">
            Signal Flair does exactly three things — score your AI visibility, build the layer AI
            reads, and keep it true. Here is the whole process, and what each step costs.
          </p>
        </header>

        <section className="rsc-section">
          <div className="sl-hub">
            {STEPS.map((s) => (
              <div className="sl-hub-card" key={s.k}>
                <span className="sl-hub-k">{s.k}</span>
                <span className="sl-hub-t">{s.t}</span>
                <span className="sl-hub-d">{s.d}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Pricing set by your <em>score</em></h2>
          <p className="rsc-p">
            The Field Report is free. Past that, your Signal Score sets the entry point — so you only
            pay for the gap you actually have. Our guarantee is delivery-based only: we never promise
            rankings, leads, or revenue, and you keep everything we build even if you cancel.
          </p>
          <div className="sl-doctrine-wrap">
            <table className="sl-doctrine">
              <thead><tr><th>Tier</th><th>Score band</th><th>Price</th><th>Type</th></tr></thead>
              <tbody>
                {TIERS.map((t) => (
                  <tr key={t.name}><td>{t.name}</td><td>{t.band}</td><td>{t.price}</td><td>{t.type}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Start with the <em>diagnosis</em></h2>
          <p className="rsc-p">
            A Field Report is a free 3-signal diagnostic — AI Search Presence, Entity Clarity, and
            Review Signal. It is a diagnosis, never a prescription. The prescription is the work. No
            sales call; we send your partial audit within 24 hours.
          </p>
          <p className="rsc-p sl-machine">
            More: <a href="/faq/">FAQ</a> · <a href="/about/">about</a> · <a href="/proof/">the live record</a> · <a href="/llms.txt">/llms.txt</a>
          </p>
        </section>

        <section className="rsc-cta">
          <h2 className="rsc-cta-h">What&apos;s your <em>Signal Score?</em></h2>
          <p className="rsc-cta-b">Find out free — 3 signals, 24 hours, no call.</p>
          <a className="rsc-cta-btn" href="/#field-report">▸ Get My Free Field Report</a>
        </section>
      </div>

      <footer className="rsc-foot">
        Signal Flair · a Mental Vision Corp product · Indiana-based · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/faq/">faq</a> · <a href="/about/">about</a> · <a href="/proof/">the record</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
