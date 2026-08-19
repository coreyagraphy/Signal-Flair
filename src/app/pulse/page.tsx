import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'
import SignalPulseForm from '@/components/SignalPulseForm'
import SignalPulseHeroVideo from '@/components/SignalPulseHeroVideo'
import BrandBgVideo from '@/components/BrandBgVideo'

export const metadata: Metadata = {
  title: 'Get Your Pulse | Signal Flair',
  description:
    'See what AI is picking up about your business. Your Signal Pulse™ scores the live signals in seconds — no charge. The Breakdown ($500) is the verified investigation that follows.',
  alternates: { canonical: 'https://signalflair.ai/pulse/' },
  openGraph: {
    title: 'Get Your Pulse | Signal Flair',
    description:
      'See what AI is picking up about your business — in seconds, no charge. Get Your Pulse from Signal Flair.',
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
      '@id': 'https://signalflair.ai/pulse/#webpage',
      name: 'Signal Pulse™ — the quick read on your AI signals',
      url: 'https://signalflair.ai/pulse/',
      description:
        'Signal Pulse™ scores a website’s live AI-readiness signals in seconds, at no charge. The Breakdown is the human-verified investigation across all six Signal Protocol™ layers.',
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
        'Signal Pulse™: an instant, automated read of a website’s AI-readiness signals — access, structure, trust, and answers — at no charge. The entry point to The Breakdown, the human-verified investigation.',
      provider: { '@id': 'https://signalflair.ai/#org' },
      areaServed: { '@type': 'Country', name: 'United States' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Signal Pulse™ — no charge' },
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
        <a className="ssc-nav-cta" href="#pulse">▸ GET YOUR PULSE</a>
      </nav>

      {/* ── IMMERSIVE HERO — brand video background + focal form ── */}
      <header className="ssc-hero ssc-hero--video" id="top">
        <SignalPulseHeroVideo />
        <div className="ssc-hero-scrim" aria-hidden="true" />
        <div className="ssc-hero-inner">
          <div className="ssc-eyebrow"><span className="ssc-dot" aria-hidden="true" />Signal Pulse™ · No charge. Takes seconds.</div>
          <h1 className="ssc-h1">Most businesses are <em>INVISIBLE</em> to AI.</h1>
          <p className="ssc-lead">
            See what AI is picking up about your business. Your Pulse reads the live signals — whether ChatGPT,
            Claude, Gemini, Perplexity, and Google AI can find, read, and trust you — and scores them on this page,
            in seconds.
          </p>

          <SignalPulseForm />

          <p className="ssc-boundary">
            Pulse gives you the quick read. <strong>The Breakdown</strong> — the $500 verified investigation — shows you what&apos;s really going on.
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
          <span className="ssc-kicker">The quick read vs. the investigation</span>
          <h2 className="ssc-h2">Pulse is the <em className="ssc-em-orange">quick read.</em> The Breakdown is <em className="ssc-em-pink">verified.</em></h2>
          <p className="ssc-p">This isn&apos;t another website score. The Breakdown checks what AI can actually find and understand about your business, verifies what&apos;s real, shows you the evidence, and tells you what deserves attention first.</p>
        </div>
        <div className="ssc-vs">
          <div className="ssc-vs-card preview">
            <div className="ssc-vs-tag">Signal Pulse™ · $0</div>
            <div className="ssc-vs-desc">The quick automated read — early signals, scored instantly on the page. Enough to show where you stand. No charge, no call.</div>
            <a className="ssc-vs-cta" href="#pulse">▸ GET YOUR PULSE</a>
          </div>
          <div className="ssc-vs-card full">
            <div className="ssc-vs-tag">The Breakdown · $500</div>
            <div className="ssc-vs-name">The Breakdown</div>
            <div className="ssc-vs-desc">The verified investigation before you spend thousands fixing anything: your full <strong>Signal Score™</strong> across all six layers, human-verified, with the evidence behind every finding — including what could <em>not</em> be verified. Live AI-visibility checks where supported, a prioritized fix order, and a personal walkthrough. <strong>The full $500 credits toward implementation.</strong> The six layers:</div>
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
            <div className="ssc-cz-num"><span className="cz-b">18</span><span className="cz-arrow" aria-hidden="true">→</span><span className="cz-a">91<small>/100</small></span></div>
            <div className="ssc-cz-lbl">Case Zero</div>
          </div>
          <div className="ssc-cz-body">
            <div className="ssc-cz-h">We audited ourselves first.</div>
            <div className="ssc-cz-p">
              Our own protocol read: 18/100 on June 6, 2026 — re-read at 91/100 on August 3, same checkpoints, both
              published with dates on the public change log. Not a marketing before-and-after: a documented record,
              including the layers still open, so you can see the system work on us first.
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
          <h2 className="ssc-h2">Instant <em>Pulse.</em> Verified <em className="ssc-em-pink">Breakdown.</em></h2>
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
            <span className="ssc-step-t">Get The Breakdown — $500</span>
            <div className="ssc-step-d">Pulse gives you the quick read. The Breakdown shows you what&apos;s really going on: your full Signal Score™ across all six layers, human-verified with the evidence — and Corey walks you through it personally. The full $500 credits toward your build.</div>
          </div>
        </div>
      </section>

      {/* ── FINE PRINT + DISCLAIMER ── */}
      <section className="ssc-section ssc-fine">
        <p className="ssc-p">
          Start with your Pulse — no charge, takes seconds. The Breakdown ($500, credited in full toward your
          build) verifies what&apos;s really going on before you spend thousands fixing it. Implementation runs
          from a $1,500 Rebuild to the $3,500 Foundation Build, with Stay Found™ monitoring after.
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
        <a className="ssc-cta-btn" href="#pulse">▸ GET YOUR PULSE</a>
        <div className="ssc-cta-fine">No charge. Takes seconds. The Breakdown — $500, credited toward your build — is there when you want the verified picture.</div>
      </section>

      {/* ── FULL EXPERIENCE — bridge to the main Signal Flair site ── */}
      <section className="ssc-full">
        <span className="ssc-kicker">The full experience</span>
        <h2 className="ssc-full-h">A pulse is just the <em>first signal.</em></h2>
        <p className="ssc-full-p">You’ve felt the Pulse. Now see the whole system — the six-layer Signal Protocol™, Case Zero, pricing, and exactly how Signal Flair makes your business findable, readable, and recommendable by AI.</p>
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
