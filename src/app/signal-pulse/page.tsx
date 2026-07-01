import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'
import SignalPulseForm from '@/components/SignalPulseForm'
import SignalPulseHeroVideo from '@/components/SignalPulseHeroVideo'

export const metadata: Metadata = {
  title: 'Free Signal Pulse™ | Signal Flair',
  description:
    'Get a free Signal Pulse™ — a quick preview of your website’s AI readiness. Enter your website and email; a reviewer emails your results. Full Signal Score™ requires manual verification.',
  alternates: { canonical: 'https://www.signalflair.ai/signal-pulse/' },
  openGraph: {
    title: 'Get a Free Signal Pulse™ | Signal Flair',
    description:
      'See whether AI systems can access, understand, and verify your business. Get your free Signal Pulse™ from Signal Flair.',
    images: ['/video/signal-pulse-poster.jpg'],
  },
}

// Four public-facing checkpoints. Plain-English, non-technical — no scoring weights
// exposed (those live in the internal Signal Protocol™ / Proof OS).
const CHECKS: { k: string; t: string; d: string }[] = [
  { k: '01', t: 'Access', d: 'Can AI systems crawl your site? Crawl access, robots.txt, sitemap visibility, and basic indexability.' },
  { k: '02', t: 'Structure', d: 'Can AI understand your business? Page structure, headings, schema, services, and entity clarity.' },
  { k: '03', t: 'Trust', d: 'Can AI verify your claims? Trust signals, proof density, contact clarity, and credibility markers.' },
  { k: '04', t: 'Answers', d: 'Can AI answer with your business? FAQ content, service explanations, and answer-ready page structure.' },
]

// The six verified Signal Protocol™ layers — the full Signal Score™, not the preview.
const LAYERS = [
  'Access & Crawlability',
  'Structured Intelligence',
  'Entity Clarity',
  'Answer Architecture',
  'Trust & Proof Density',
  'Live AI Visibility',
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.signalflair.ai/signal-pulse/#webpage',
      name: 'Free Signal Pulse™ — quick AI-readiness preview',
      url: 'https://www.signalflair.ai/signal-pulse/',
      description:
        'Get a free Signal Pulse™ preview of your website’s AI readiness. The full Signal Score™ requires manual verification across the six Signal Protocol™ layers.',
      isPartOf: { '@id': 'https://signalflair.ai/#website' },
      about: { '@id': 'https://signalflair.ai/#org' },
      primaryImageOfPage: 'https://signalflair.ai/video/signal-pulse-poster.jpg',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://signalflair.ai/' },
        { '@type': 'ListItem', position: 2, name: 'Signal Pulse', item: 'https://www.signalflair.ai/signal-pulse/' },
      ],
    },
    {
      '@type': 'Service',
      serviceType: 'AI readiness preview',
      name: 'Signal Pulse™ — quick AI-readiness preview',
      description:
        'A free Signal Pulse™: a quick, human-reviewed preview of a website’s AI-readiness signals — access, structure, trust, and answers — as the entry point to the full verified Signal Score™.',
      provider: { '@id': 'https://signalflair.ai/#org' },
      areaServed: { '@type': 'Country', name: 'United States' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free Signal Pulse™' },
    },
  ],
}

export default function SignalPulsePage() {
  return (
    <main className="ssc">
      <div className="ssc-bg" aria-hidden="true" />
      <div className="ssc-scanline" aria-hidden="true" />

      <nav className="ssc-nav">
        <a className="ssc-nav-logo" href="/" aria-label="Signal Flair home">
          <SignalFlairLogo onDark style={{ height: 52, width: 'auto', display: 'block' }} />
        </a>
        <a className="ssc-nav-cta" href="#pulse">▸ Get My Signal Pulse™</a>
      </nav>

      {/* ── IMMERSIVE HERO — brand video background + focal form ── */}
      <header className="ssc-hero ssc-hero--video" id="top">
        <SignalPulseHeroVideo />
        <div className="ssc-hero-scrim" aria-hidden="true" />
        <div className="ssc-hero-inner">
          <div className="ssc-eyebrow"><span className="ssc-dot" aria-hidden="true" />Free Signal Pulse™</div>
          <h1 className="ssc-h1">Most businesses are <em>invisible</em> to AI.</h1>
          <p className="ssc-lead">
            Signal Flair helps AI systems access, understand, verify, and recommend your business. Get your free
            Signal Pulse™ — a fast read on whether ChatGPT, Claude, Gemini, Perplexity, and Google AI can find and
            trust you.
          </p>

          <SignalPulseForm />

          <p className="ssc-boundary">
            Signal Pulse™ is a quick preview. Your full <strong>Signal Score™</strong> requires manual verification.
          </p>
          <div className="ssc-hero-links"><a href="/proof/">See Case Zero →</a></div>
        </div>
      </header>

      {/* ── WHAT YOUR SIGNAL PULSE CHECKS ── */}
      <section className="ssc-section">
        <div className="ssc-sec-head">
          <span className="ssc-kicker">The four signals</span>
          <h2 className="ssc-h2">What your Signal Pulse™ <em>checks</em></h2>
          <p className="ssc-p">Four questions — the same ones an AI engine works through before it recommends anyone.</p>
        </div>
        <div className="ssc-checks">
          {CHECKS.map((c) => (
            <div className="ssc-check" key={c.k}>
              <div className="ssc-check-node">{c.k}</div>
              <span className="ssc-check-t">{c.t}</span>
              <span className="ssc-check-d">{c.d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PREVIEW VS FULL SCORE ── */}
      <section className="ssc-section">
        <div className="ssc-sec-head">
          <span className="ssc-kicker">Preview vs. full score</span>
          <h2 className="ssc-h2">One is a <em>preview.</em> One is <em>verified.</em></h2>
          <p className="ssc-p">Signal Pulse™ is the quick preview. Signal Score™ is the full verified measurement.</p>
        </div>
        <div className="ssc-vs">
          <div className="ssc-vs-card">
            <div className="ssc-vs-tag">Quick preview</div>
            <div className="ssc-vs-name">Signal Pulse™</div>
            <div className="ssc-vs-desc">A fast, human-reviewed read on your first AI-readiness signals — enough to show where you stand and what to fix first.</div>
          </div>
          <div className="ssc-vs-card full">
            <div className="ssc-vs-tag">Full verified score</div>
            <div className="ssc-vs-name">Signal Score™</div>
            <div className="ssc-vs-desc">The complete 0–100 measurement, verified across all six Signal Protocol™ layers:</div>
            <ul className="ssc-layers">
              {LAYERS.map((l) => (<li key={l}>{l}</li>))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CASE ZERO ── */}
      <section className="ssc-section">
        <div className="ssc-cz">
          <div className="ssc-cz-gauge">
            <div className="ssc-cz-num">18<small>/100</small></div>
            <div className="ssc-cz-lbl">Case Zero</div>
          </div>
          <div className="ssc-cz-body">
            <div className="ssc-cz-h">We audited ourselves first.</div>
            <div className="ssc-cz-p">
              Signal Flair started at 18/100. No inflated case study. No fake proof. We’re documenting the rebuild
              publicly — so you can see the system work on us before you trust it with your business.
            </div>
            <a className="ssc-cz-cta" href="/proof/">See Case Zero →</a>
          </div>
        </div>
      </section>

      {/* ── WHAT HAPPENS NEXT (delivery is explicit here) ── */}
      <section className="ssc-section">
        <div className="ssc-sec-head">
          <span className="ssc-kicker">How it works</span>
          <h2 className="ssc-h2">How you get your <em>Signal Pulse™</em></h2>
        </div>
        <div className="ssc-steps">
          <div className="ssc-step">
            <div className="ssc-step-n">01</div>
            <span className="ssc-step-t">Enter your website</span>
            <div className="ssc-step-d">Your URL and email — that’s the whole ask.</div>
          </div>
          <div className="ssc-step">
            <div className="ssc-step-n">02</div>
            <span className="ssc-step-t">We review + email it back</span>
            <div className="ssc-step-d">A real reviewer checks your first AI-readiness signals and emails your Signal Pulse™ — typically within 24 hours. No automated black-box score.</div>
          </div>
          <div className="ssc-step">
            <div className="ssc-step-n">03</div>
            <span className="ssc-step-t">Move into full verification</span>
            <div className="ssc-step-d">If it fits, we recommend a full Signal Score™ review, a Foundation Build, or Stay Found™ maintenance.</div>
          </div>
        </div>
      </section>

      {/* ── FINE PRINT + DISCLAIMER ── */}
      <section className="ssc-section ssc-fine">
        <p className="ssc-p">
          Start with a free Signal Pulse™. Full Signal Score™ reviews and implementation options are recommended
          after your preview. The Foundation Build starts at $3,500 for businesses ready to turn findings into
          working AI Proof Infrastructure™.
        </p>
        <p className="ssc-disclaimer">
          Signal Flair does not guarantee rankings, leads, revenue, citations, recommendations, inclusion, or AI
          visibility in any specific platform. Signal Flair builds proof infrastructure to make businesses easier
          for AI systems to access, understand, verify, and recommend.
        </p>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="ssc-cta">
        <div className="ssc-radar" aria-hidden="true"><i /><i /><i /><i /></div>
        <h2 className="ssc-cta-h">Find out if AI can <em>trust</em> your business.</h2>
        <a className="ssc-cta-btn" href="#pulse">▸ Get My Free Signal Pulse™</a>
        <div className="ssc-cta-fine">Preview only. Full Signal Score™ requires manual verification.</div>
      </section>

      <footer className="ssc-foot">
        Signal Flair · a Mental Vision product · Brownsburg, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/how-it-works/">how it works</a> · <a href="/proof/">the record</a> · <a href="mailto:hello@signalflair.ai">hello@signalflair.ai</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
