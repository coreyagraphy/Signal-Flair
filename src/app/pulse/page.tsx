import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'
import SignalPulseForm from '@/components/SignalPulseForm'
import SignalPulseHeroVideo from '@/components/SignalPulseHeroVideo'
import BrandBgVideo from '@/components/BrandBgVideo'

export const metadata: Metadata = {
  title: 'Free Signal Pulse™ | Signal Flair',
  description:
    'Get a free Signal Pulse™ — see your website’s AI-readiness score in seconds. The full Signal Score™ is a human-verified review across all seven Signal Protocol™ layers.',
  alternates: { canonical: 'https://signalflair.ai/pulse/' },
  openGraph: {
    title: 'Get a Free Signal Pulse™ | Signal Flair',
    description:
      'See whether AI systems can access, understand, and verify your business. Get your free Signal Pulse™ from Signal Flair.',
    images: ['/video/signal-pulse-poster.jpg'],
  },
}

// Four public-facing checkpoints. Plain-English, non-technical — no scoring weights
// exposed (those live in the internal Signal Protocol™ / Proof OS).
const CHECKS: { k: string; t: string; d: string; hex: string; rgb: string }[] = [
  { k: '1', t: 'Access', d: 'Can AI systems crawl your site? Crawl access, robots.txt, sitemap visibility, and basic indexability.', hex: '#37c4ff', rgb: '55,196,255' },
  { k: '2', t: 'Structure', d: 'Can AI understand your business? Page structure, headings, schema, services, and entity clarity.', hex: '#ffe23a', rgb: '255,226,58' },
  { k: '3', t: 'Trust', d: 'Can AI verify your claims? Trust signals, proof density, contact clarity, and credibility markers.', hex: '#ff3d82', rgb: '255,61,130' },
  { k: '4', t: 'Answers', d: 'Can AI answer with your business? FAQ content, service explanations, and answer-ready page structure.', hex: '#ff6a2b', rgb: '255,106,43' },
]

// The seven verified Signal Protocol™ layers — the full Signal Score™, not the preview.
const LAYERS = [
  'Access & Crawlability',
  'Structured Intelligence',
  'Entity Clarity',
  'Answer Architecture',
  'Trust & Proof Density',
  'Live AI Visibility',
  'Agent & Commerce Readiness',
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://signalflair.ai/pulse/#webpage',
      name: 'Free Signal Pulse™ — quick AI-readiness preview',
      url: 'https://signalflair.ai/pulse/',
      description:
        'Get a free Signal Pulse™ preview of your website’s AI readiness. The full Signal Score™ requires manual verification across the seven Signal Protocol™ layers.',
      isPartOf: { '@id': 'https://signalflair.ai/#website' },
      about: { '@id': 'https://signalflair.ai/#org' },
      primaryImageOfPage: 'https://signalflair.ai/video/signal-pulse-poster.jpg',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://signalflair.ai/' },
        { '@type': 'ListItem', position: 2, name: 'Signal Pulse', item: 'https://signalflair.ai/pulse/' },
      ],
    },
    {
      '@type': 'Service',
      serviceType: 'AI readiness preview',
      name: 'Signal Pulse™ — quick AI-readiness preview',
      description:
        'A free Signal Pulse™: an instant, automated preview of a website’s AI-readiness signals — access, structure, trust, and answers — the entry point to the full human-verified Signal Score™.',
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
          <SignalFlairLogo onDark style={{ height: 68, width: 'auto', display: 'block' }} />
        </a>
        <a className="ssc-nav-cta" href="#pulse">▸ Get My Signal Pulse™</a>
      </nav>

      {/* ── IMMERSIVE HERO — brand video background + focal form ── */}
      <header className="ssc-hero ssc-hero--video" id="top">
        <SignalPulseHeroVideo />
        <div className="ssc-hero-scrim" aria-hidden="true" />
        <div className="ssc-hero-inner">
          <div className="ssc-eyebrow"><span className="ssc-dot" aria-hidden="true" />Free Signal Pulse™</div>
          <h1 className="ssc-h1">Most businesses are <em>INVISIBLE</em> to AI.</h1>
          <p className="ssc-lead">
            Signal Flair helps AI systems access, understand, verify, and recommend your business. Get your free
            Signal Pulse™ — a fast read on whether ChatGPT, Claude, Gemini, Perplexity, and Google AI can find and
            trust you.
          </p>

          <SignalPulseForm />

          <p className="ssc-boundary">
            Signal Pulse™ is an instant preview. Your full <strong>Signal Score™</strong> is human-verified — on request.
          </p>
          <div className="ssc-hero-links"><a href="/proof/">▸ See Case Zero!</a></div>
        </div>
      </header>

      {/* ── FOUR SIGNALS — second video band + floating glass cards ── */}
      <section className="ssc-band">
        <BrandBgVideo src="/video/signal-pulse-band.mp4" poster="/video/signal-pulse-band-poster.jpg" />
        <div className="ssc-band-scrim" aria-hidden="true" />
        <div className="ssc-band-inner">
          <div className="ssc-sec-head">
            <span className="ssc-kicker">The four signals</span>
            <h2 className="ssc-h2">What your Signal Pulse™ <em>checks</em></h2>
            <p className="ssc-p">Four questions — the same ones an AI engine works through before it recommends anyone.</p>
          </div>
          <div className="ssc-checks">
            {CHECKS.map((c) => (
              <div className="ssc-check" key={c.k} style={{ '--ac': c.hex, '--acg': c.rgb } as any}>
                <span className="ssc-check-num" style={{ color: c.hex }}>{c.k}</span>
                <span className="ssc-check-t">{c.t}</span>
                <span className="ssc-check-d">{c.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREVIEW VS FULL SCORE ── */}
      <section className="ssc-section">
        <div className="ssc-sec-head">
          <span className="ssc-kicker">Preview vs. full score</span>
          <h2 className="ssc-h2">One is a <em className="ssc-em-orange">preview.</em> One is <em className="ssc-em-pink">verified.</em></h2>
          <p className="ssc-p">Signal Pulse™ is the quick preview. Signal Score™ is the full verified measurement.</p>
        </div>
        <div className="ssc-vs">
          <div className="ssc-vs-card preview">
            <div className="ssc-vs-tag">Quick preview</div>
            <div className="ssc-vs-desc">A fast, automated read on your first AI-readiness signals — enough to show where you stand and what to fix first. Instant, in seconds.</div>
            <a className="ssc-vs-cta" href="#pulse">▸ Get My Free Signal Pulse™</a>
          </div>
          <div className="ssc-vs-card full">
            <div className="ssc-vs-tag">Full verified score</div>
            <div className="ssc-vs-name">Signal Score™</div>
            <div className="ssc-vs-desc">The complete 0–100 measurement, verified across all seven Signal Protocol™ layers:</div>
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
            <div className="ssc-cz-num"><span className="cz-b">18</span><span className="cz-arrow" aria-hidden="true">→</span><span className="cz-a">73<small>/100</small></span></div>
            <div className="ssc-cz-lbl">Case Zero</div>
          </div>
          <div className="ssc-cz-body">
            <div className="ssc-cz-h">We audited ourselves first.</div>
            <div className="ssc-cz-p">
              Signal Flair started at 18/100 and rebuilt in public to 91/100 (+73). No inflated case study. No fake
              proof — we document the climb, and the layers still building, so you can see the system work on us
              before you trust it with your business.
            </div>
            <a className="ssc-cz-cta" href="/proof/">▸ See Case Zero! →</a>
          </div>
        </div>
      </section>

      {/* ── THE DIFFERENCE — we don't just score, we prove ── */}
      <section className="ssc-section">
        <div className="ssc-sec-head">
          <span className="ssc-kicker">The difference</span>
          <h2 className="ssc-h2">Most tools <em className="ssc-em-orange">score</em> you. We <em className="ssc-em-pink">prove it.</em></h2>
          <p className="ssc-p">
            Anyone can hand you a number. Signal Flair re-measures the same way after the work and gives you a verified
            before/after record — so you can see exactly what changed. It’s proof of the work, not a promise of rankings —
            and it’s the receipt no other tool ships.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS — instant Pulse, then opt-in Score ── */}
      <section className="ssc-section">
        <div className="ssc-sec-head">
          <span className="ssc-kicker">How it works</span>
          <h2 className="ssc-h2">Instant <em>Pulse.</em> Verified <em className="ssc-em-pink">Score.</em></h2>
        </div>
        <div className="ssc-steps">
          <div className="ssc-step">
            <div className="ssc-step-n" style={{ color: '#00d2bf' }}>01</div>
            <span className="ssc-step-t">Enter your website</span>
            <div className="ssc-step-d">Your URL and email. That’s the whole ask.</div>
          </div>
          <div className="ssc-step">
            <div className="ssc-step-n" style={{ color: '#ffe23a' }}>02</div>
            <span className="ssc-step-t">See your Signal Pulse™ — instantly</span>
            <div className="ssc-step-d">Your automated AI-readiness score appears on the gauge in seconds — access, structure, trust, and answers.</div>
          </div>
          <div className="ssc-step">
            <div className="ssc-step-n" style={{ color: '#ff3d82' }}>03</div>
            <span className="ssc-step-t">Opt in for your full Signal Score™</span>
            <div className="ssc-step-d">Want the complete picture? The Signal Score™ is a human-verified measurement across all seven layers, plus live AI-visibility tests — and Corey walks you through it personally on a call. Not a PDF in your inbox. A working session, on request.</div>
          </div>
        </div>
      </section>

      {/* ── FINE PRINT + DISCLAIMER ── */}
      <section className="ssc-section ssc-fine">
        <p className="ssc-p">
          Start with a free, instant Signal Pulse™. A full Signal Score™ review and implementation options come
          next — when you’re ready. The Foundation Build starts at $3,500 for businesses ready to turn findings
          into working AI Proof Infrastructure™.
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
        <div className="ssc-cta-fine">Instant preview. Your full Signal Score™ is human-verified — on request.</div>
      </section>

      {/* ── FULL EXPERIENCE — bridge to the main Signal Flair site ── */}
      <section className="ssc-full">
        <span className="ssc-kicker">The full experience</span>
        <h2 className="ssc-full-h">A pulse is just the <em>first signal.</em></h2>
        <p className="ssc-full-p">You’ve felt the Pulse. Now see the whole system — the seven-layer Signal Protocol™, Case Zero, pricing, and exactly how Signal Flair makes your business findable, readable, and recommendable by AI.</p>
        <a className="ssc-full-btn" href="/">▸ Explore the full Signal Flair →</a>
      </section>

      <footer className="ssc-foot">
        Signal Flair · a Mental Vision product · Indianapolis, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/how-it-works/">how it works</a> · <a href="/proof/">the record</a> · <a href="mailto:hello@signalflair.ai">hello@signalflair.ai</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
