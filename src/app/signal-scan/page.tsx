import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'
import SignalScanForm from '@/components/SignalScanForm'

export const metadata: Metadata = {
  title: 'Free Signal Scan™ | Signal Flair',
  description:
    'Run a free Signal Scan™ and get your Signal Pulse™ preview of your website’s AI readiness. Full Signal Score™ requires manual verification.',
  alternates: { canonical: 'https://www.signalflair.ai/signal-scan/' },
  openGraph: {
    title: 'Run a Free Signal Scan™ | Signal Flair',
    description:
      'See whether AI systems can access, understand, and verify your business. Get your Signal Pulse™ preview from Signal Flair.',
    images: ['/video/hero-poster.jpg'],
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
      '@id': 'https://www.signalflair.ai/signal-scan/#webpage',
      name: 'Free Signal Scan™ — Signal Pulse™ preview',
      url: 'https://www.signalflair.ai/signal-scan/',
      description:
        'Run a free Signal Scan™ and get a Signal Pulse™ preview of your website’s AI readiness. The full Signal Score™ requires manual verification across the six Signal Protocol™ layers.',
      isPartOf: { '@id': 'https://signalflair.ai/#website' },
      about: { '@id': 'https://signalflair.ai/#org' },
      primaryImageOfPage: 'https://signalflair.ai/video/hero-poster.jpg',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://signalflair.ai/' },
        { '@type': 'ListItem', position: 2, name: 'Signal Scan', item: 'https://www.signalflair.ai/signal-scan/' },
      ],
    },
    {
      '@type': 'Service',
      serviceType: 'AI readiness scan',
      name: 'Signal Scan™ — Signal Pulse™ preview',
      description:
        'A free Signal Scan™ that returns a quick Signal Pulse™ preview of a website’s AI-readiness signals — access, structure, trust, and answers — as the entry point to the full verified Signal Score™.',
      provider: { '@id': 'https://signalflair.ai/#org' },
      areaServed: { '@type': 'Country', name: 'United States' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free Signal Scan™' },
    },
  ],
}

export default function SignalScanPage() {
  return (
    <main className="ssc">
      <div className="ssc-bg" aria-hidden="true" />
      <div className="ssc-scanline" aria-hidden="true" />

      <nav className="ssc-nav">
        <a className="ssc-nav-logo" href="/" aria-label="Signal Flair home">
          <SignalFlairLogo onDark style={{ height: 52, width: 'auto', display: 'block' }} />
        </a>
        <a className="ssc-nav-cta" href="#scan">▸ Get My Signal Pulse™</a>
      </nav>

      {/* ── IMMERSIVE HERO ── */}
      <header className="ssc-hero" id="top">
        <div className="ssc-radar" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="ssc-hero-glow" aria-hidden="true" />
        <div className="ssc-hero-inner">
          <div className="ssc-eyebrow"><span className="ssc-dot" aria-hidden="true" />Free Signal Scan™</div>
          <h1 className="ssc-h1">Most businesses are <em>invisible</em> to AI.</h1>
          <p className="ssc-lead">
            Signal Flair helps AI systems access, understand, verify, and recommend your business. Run a free
            Signal Scan™ and get your Signal Pulse™ preview.
          </p>

          <SignalScanForm />

          <p className="ssc-boundary">
            Signal Pulse™ is a quick preview. Your full <strong>Signal Score™</strong> requires manual verification.
          </p>
          <div className="ssc-hero-links"><a href="/proof/">See Case Zero →</a></div>
        </div>
      </header>

      {/* ── VIDEO PLACEHOLDER ── */}
      <section className="ssc-section">
        <div className="ssc-sec-head">
          <span className="ssc-kicker">Watch how Signal Scan™ works</span>
          <h2 className="ssc-h2">See what your site looks like <em>to AI.</em></h2>
          <p className="ssc-p">
            A quick walkthrough will show how Signal Flair checks whether your business is accessible,
            understandable, and verifiable by AI systems.
          </p>
        </div>
        <figure className="ssc-video" role="img" aria-label="Video placeholder — a 60-second Signal Flair walkthrough is coming soon">
          <div className="ssc-video-poster" style={{ backgroundImage: "url('/video/hero-poster.jpg')" }} />
          <div className="ssc-video-scrim" />
          <div className="ssc-video-inner">
            <span className="ssc-play" aria-hidden="true">
              <svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 15 0.5 29.53V0.47L25 15Z" fill="#00d2bf" />
              </svg>
            </span>
            <figcaption className="ssc-video-cap">Video coming soon: 60-second Signal Flair walkthrough</figcaption>
            <span className="ssc-video-sub">A short founder walkthrough on why AI systems need structured proof before they can confidently recommend a business.</span>
          </div>
        </figure>
      </section>

      {/* ── WHAT SIGNAL SCAN CHECKS ── */}
      <section className="ssc-section">
        <div className="ssc-sec-head">
          <span className="ssc-kicker">The scan path</span>
          <h2 className="ssc-h2">What Signal Scan™ <em>checks</em></h2>
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

      {/* ── WHAT IS SIGNAL PULSE ── */}
      <section className="ssc-section">
        <div className="ssc-sec-head">
          <span className="ssc-kicker">Signal Pulse™</span>
          <h2 className="ssc-h2">Your quick <em>AI-readiness preview.</em></h2>
          <p className="ssc-p">
            Signal Pulse™ is a fast preview of your site’s first AI-readiness signals. It checks whether your
            business appears accessible, understandable, and verifiable to AI systems.
          </p>
          <p className="ssc-p">
            <strong>It is not the full Signal Score™.</strong> The full Signal Score™ requires manual verification
            through the complete Signal Protocol™.
          </p>
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

      {/* ── WHAT HAPPENS NEXT ── */}
      <section className="ssc-section">
        <div className="ssc-sec-head">
          <span className="ssc-kicker">After the scan</span>
          <h2 className="ssc-h2">What happens <em>next</em></h2>
        </div>
        <div className="ssc-steps">
          <div className="ssc-step">
            <div className="ssc-step-n">01</div>
            <span className="ssc-step-t">Enter your website</span>
            <div className="ssc-step-d">Start with your URL and email — that’s the whole ask.</div>
          </div>
          <div className="ssc-step">
            <div className="ssc-step-n">02</div>
            <span className="ssc-step-t">Get your Signal Pulse™</span>
            <div className="ssc-step-d">We review your first AI-readiness signals and send the preview.</div>
          </div>
          <div className="ssc-step">
            <div className="ssc-step-n">03</div>
            <span className="ssc-step-t">Move into full verification</span>
            <div className="ssc-step-d">If it fits, we recommend a full Signal Score™, Foundation Build, or Stay Found™ maintenance.</div>
          </div>
        </div>
      </section>

      {/* ── FINE PRINT + DISCLAIMER ── */}
      <section className="ssc-section ssc-fine">
        <p className="ssc-p">
          Start with a free Signal Scan™. Full Signal Score™ reviews and implementation options are recommended
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
        <a className="ssc-cta-btn" href="#scan">▸ Run Free Signal Scan™</a>
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
