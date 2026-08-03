import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

export const metadata: Metadata = {
  title: 'How It Works — Scan, Score, Fix, Stay Found | Signal Flair',
  description:
    'AI visibility across ChatGPT, Gemini & Perplexity: free Signal Score™ Audit, one-time builds from $3,000, Stay Found™ plans from $1,800/mo.',
  alternates: { canonical: 'https://signalflair.ai/how-it-works/' },
  openGraph: {
    title: 'How Signal Flair works — scan, score, fix, stay found',
    description:
      'Four steps from found-by-luck to found-by-design, with pricing set by a free audit so the work matches the actual gap.',
    images: ['/video/hero-poster.jpg'],
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
    d: 'You get a Signal Score™ from 0 to 100 across the seven layers of the Signal Protocol™, plus exactly what is pulling it down. Most local businesses score under 40 and never knew it. The audit sets the scope, so the work matches the real gap.',
  },
  {
    k: '03',
    t: 'Fix',
    d: 'We build The Proof Stack™ — the full infrastructure layer AI reads before it recommends you: Model Ingestion Manifest deployed, Machine Trust Layer™ installed, Crawl Clearance Protocol run, Entity Lock™ resolved, and a 90-day AI action plan handed over. Built in 7–14 days, not months. You keep everything, even if you cancel.',
  },
  {
    k: '04',
    t: 'Stay Found',
    d: 'AI search changes constantly. Stay Found™ plans run Citation Capture — the monthly work of winning and holding AI citations — with the Proof Density Engine compounding third-party proof and Signal Telemetry watching for drift, to help keep your Signal Score™ accurate as new engines ship and competitors catch up. Prior assessments aren’t overwritten: each review is preserved, so you can see what changed and what improved over time.',
  },
]

const TIERS: { name: string; band: string; price: string; type: string; num: string }[] = [
  { name: 'Signal Score™ Audit', band: 'Full 7-layer diagnostic + Proof OS™ action plan', price: 'Free during the founding period ($500 after)', type: 'free', num: '0' },
  { name: 'Rebuild', band: 'Lighter-scope build — set by the audit', price: '$3,000', type: 'one-time', num: '3000' },
  { name: 'Foundation Build', band: 'Full Proof Stack™ + Smart Site™ rebuild', price: '$5,500 ($3,500 with the 12-month bundle)', type: 'one-time', num: '5500' },
  { name: 'Signal Proof', band: 'Stay Found™ monthly · most popular', price: '$1,800/mo', type: 'recurring', num: '1800' },
  { name: 'Signal Dominate', band: 'Stay Found™ monthly · multi-location', price: 'from $3,500/mo', type: 'recurring', num: '3500' },
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
      description: 'AI visibility scoring and proof-infrastructure buildout for local service businesses — scope set by a free Signal Score™ Audit.',
      offers: TIERS.map((t) => ({
        '@type': 'Offer',
        name: t.name,
        description: `${t.band} — ${t.type}.`,
        price: t.num,
        priceCurrency: 'USD',
      })),
    },
  ],
}

export default function HowItWorksPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 70, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#cta">▸ Free Signal Pulse™</a>
      </nav>

      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow">How it works</div>
          <h1 className="rsc-h1">Found by luck to found by <em>design,</em> in four steps.</h1>
          <p className="rsc-lead">
            AI can probably find your business. The real question is whether it understands it — and tells
            the right story. Signal Flair does exactly three things: score your AI visibility, build the
            layer AI reads, and keep it true. Here is the whole process, and what each step costs.
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
          <h2 className="rsc-h2">Pricing set by the <em>audit</em></h2>
          <p className="rsc-p">
            The Signal Pulse™ and the full Signal Score™ Audit are free during the founding period. Past
            that, the audit sets the scope — so you only pay for the gap you actually have, never a score
            gate. Bundle a 12-month Signal Proof plan with your build and the Foundation Build drops from
            $5,500 to $3,500 (save $2,000). Add a location for $1,500, Satellite included. Our guarantee is
            delivery-based only: we never promise rankings, leads, or revenue, and you keep everything we
            build even if you cancel.
          </p>
          <div className="sl-doctrine-wrap">
            <table className="sl-doctrine">
              <thead><tr><th>Tier</th><th>What it is</th><th>Price</th><th>Type</th></tr></thead>
              <tbody>
                {TIERS.map((t) => (
                  <tr key={t.name}><td>{t.name}</td><td>{t.band}</td><td>{t.price}</td><td>{t.type}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">The record gets <em>smarter.</em></h2>
          <p className="rsc-p">
            Most audits disappear into a PDF. Signal Flair preserves the evidence behind each assessment — the
            date, the Signal Score™, the layer-by-layer breakdown, the findings, and the sources — so the next review
            can show what changed, what improved, and what still needs fixing. Prior assessments aren&apos;t
            overwritten, and the methodology is designed to become more useful as verified history accumulates.
            Signal Flair does not sell that data or train AI models on it.
          </p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Start with the <em>diagnosis</em></h2>
          <p className="rsc-p">
            A Signal Pulse™ is a free preview across 3 of your 7 signal layers — Entity Clarity, Trust &amp;
            Proof Density, and Live AI Visibility. It is a diagnosis, never a prescription. The prescription
            is the work. No sales call; we send your preview within 24 hours, and the full 7-layer Signal
            Score™ Audit is free during the founding period.
          </p>
          <p className="rsc-p sl-machine">
            More: <a href="/faq/">FAQ</a> · <a href="/about/">about</a> · <a href="/proof/">the live record</a> · <a href="/llms.txt">/llms.txt</a>
          </p>
        </section>

        <section className="rsc-cta">
          <h2 className="rsc-cta-h">What&apos;s your <em>Signal Score?</em></h2>
          <p className="rsc-cta-b">Find out free — 3 signals, 24 hours, no call.</p>
          <a className="rsc-cta-btn" href="/#cta">▸ Run My Signal</a>
        </section>
      </div>

      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Indianapolis, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/faq/">faq</a> · <a href="/about/">about</a> · <a href="/proof/">the record</a> · <a href="/privacy/">privacy</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
