import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

export const metadata: Metadata = {
  title: 'RESTOR Team Case Study | Signal Flair',
  description:
    'See how RESTOR Team used Signal Flair’s Signal Baseline™ and Competitor Signal Snapshot™ to understand its AI-readable proof foundation against a selected market peer.',
  alternates: { canonical: 'https://signalflair.ai/case-studies/restor-team/' },
  openGraph: {
    title: 'RESTOR Team — Founding Partner Snapshot | Signal Flair',
    description:
      'A point-in-time AI proof comparison: where AI systems could read RESTOR Team, and where a selected market peer had the edge.',
  },
}

// Conservative schema only — Article + WebPage referencing the Signal Flair org.
// No competitor is named anywhere. No guaranteed-performance claims.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://signalflair.ai/case-studies/restor-team#article',
      headline: 'RESTOR Team — Founding Partner Snapshot',
      description:
        'How RESTOR Team used Signal Flair’s Signal Baseline™ and Competitor Signal Snapshot™ to measure its AI-readable proof foundation against a selected market peer.',
      datePublished: '2026-06-21',
      dateModified: '2026-06-21',
      author: { '@id': 'https://signalflair.ai/#org' },
      publisher: { '@id': 'https://signalflair.ai/#org' },
      about: { '@type': 'Organization', name: 'RESTOR Team', url: 'https://restorteam.com/' },
      isPartOf: { '@id': 'https://signalflair.ai/#website' },
      mainEntityOfPage: 'https://signalflair.ai/case-studies/restor-team',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://signalflair.ai/case-studies/restor-team#webpage',
      url: 'https://signalflair.ai/case-studies/restor-team',
      name: 'RESTOR Team Case Study | Signal Flair',
      isPartOf: { '@id': 'https://signalflair.ai/#website' },
      about: { '@id': 'https://signalflair.ai/#org' },
    },
  ],
}

export default function RestorTeamCaseStudy() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 56, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#cta">▸ Get Your Signal Score™</a>
      </nav>

      <div className="rsc-wrap">
        {/* 1 · HERO */}
        <header className="rsc-hero">
          <div className="rsc-eyebrow">Founding Partner Snapshot</div>
          <h1 className="rsc-h1">
            RESTOR Team — <em>Founding Partner Snapshot.</em>
          </h1>
          <p className="rsc-lead">
            RESTOR Team used Signal Flair&apos;s Signal Baseline™ and Competitor Signal Snapshot™ to understand how
            clearly AI systems could access, understand, verify, and surface their business — compared with a selected
            market peer.
          </p>
          <div className="rsc-ctarow" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
            <a className="rsc-navcta" href="/#cta">▸ Get Your Signal Score™</a>
            <a className="sl-back" href="/#founding" style={{ alignSelf: 'center' }}>Explore the Founding Partner Pilot →</a>
          </div>
        </header>

        {/* 2 · SUMMARY CARD */}
        <section className="rsc-section">
          <div className="sl-rec">
            <div className="sl-rec-h">
              <span className="sl-rec-name">Snapshot at a glance</span>
              <span className="sl-verified">Founding Partner</span>
            </div>
            <p className="rsc-p">
              Signal Flair ran a Signal Baseline™ for RESTOR Team and used Competitor Signal Snapshot™ to compare
              RESTOR&apos;s AI-readable proof foundation against a selected market competitor.
            </p>
            <div className="sl-kv"><span>Client</span><span>RESTOR Team — <a href="https://restorteam.com/" target="_blank" rel="noopener noreferrer">restorteam.com</a></span></div>
            <div className="sl-kv"><span>Category</span><span>Exterior restoration · home services (roofing, storm restoration, siding)</span></div>
            <div className="sl-kv"><span>Deliverable</span><span>Signal Baseline™ + Competitor Signal Snapshot™</span></div>
            <div className="sl-kv"><span>Status</span><span>Founding Partner Snapshot</span></div>
            <div className="sl-kv"><span>Visibility type</span><span>Point-in-time AI proof comparison</span></div>
            <div className="sl-kv"><span>Baseline Signal Score™</span><span>23 / 100 — a starting line, with room to climb</span></div>
            <div className="sl-kv"><span>Last updated</span><span>June 21, 2026</span></div>
          </div>
        </section>

        {/* 3 · WHAT WAS MEASURED */}
        <section className="rsc-section">
          <h2 className="rsc-h2">What did Signal Flair <em>measure</em> for RESTOR Team?</h2>
          <p className="rsc-p">
            Signal Flair measured how clearly AI systems could access, understand, verify, and surface RESTOR Team
            across the six Signal Score™ layers:
          </p>
          <ul className="rsc-ul">
            <li><strong>Access &amp; Crawlability</strong> — can AI crawlers reach the site and its machine-readable assets.</li>
            <li><strong>Structured Intelligence</strong> — schema, JSON-LD, and structured data AI can parse.</li>
            <li><strong>Entity Clarity</strong> — a clear, consistent picture of who RESTOR is and where they serve.</li>
            <li><strong>Answer Architecture</strong> — content shaped to answer the questions AI engines actually ask.</li>
            <li><strong>Trust &amp; Proof Density</strong> — verifiable, source-backed proof AI can rely on.</li>
            <li><strong>Live AI Visibility</strong> — how RESTOR surfaces in real AI engine answers.</li>
          </ul>
          <p className="rsc-p">
            Alongside the six layers, the Baseline included an AI-engine visibility review, prompt-based visibility
            checks, the Competitor Signal Snapshot™, a list of the highest-priority proof gaps, and the recommended
            next actions.
          </p>
        </section>

        {/* 4 · COMPETITOR SIGNAL SNAPSHOT */}
        <section className="rsc-section">
          <h2 className="rsc-h2">How did RESTOR compare against a <em>market peer?</em></h2>
          <p className="rsc-p">
            Competitor Signal Snapshot™ gave RESTOR Team a point-in-time view of how its AI-readable proof foundation
            compared against a selected market competitor. The snapshot showed which side appeared easier for AI systems
            to access, understand, verify, or surface at the time of review.
          </p>
          <ul className="rsc-ul">
            <li><strong>Where RESTOR appeared stronger</strong> — RESTOR&apos;s site already exposed structured data and kept its doors open to AI crawlers, a real head start on the technical proof layer.</li>
            <li><strong>Where the market peer appeared stronger</strong> — the peer had already published a machine-readable AI-access file (llms.txt) and fuller trust content, which RESTOR had not yet deployed.</li>
            <li><strong>Which proof gaps mattered most</strong> — entity clarity, answer architecture, and trust &amp; proof density were the layers with the most upside for RESTOR.</li>
            <li><strong>The decision it framed</strong> — protect the structured-data advantage RESTOR already holds, and close the machine-readable-proof gaps first.</li>
          </ul>
          <p className="rsc-p">
            The comparison is directional and based on observable public signals at a single moment in time — it is not a
            verdict on either business.
          </p>
        </section>

        {/* 5 · WHAT THE SNAPSHOT REVEALED */}
        <section className="rsc-section">
          <h2 className="rsc-h2">What did the snapshot <em>reveal?</em></h2>
          <p className="rsc-p">
            The snapshot helped turn RESTOR&apos;s Signal Score™ into a business decision: protect the areas where RESTOR
            was stronger, and close the proof gaps where a market peer appeared more AI-readable.
          </p>
          <ul className="rsc-ul">
            <li>RESTOR&apos;s baseline showed clear, fixable areas where AI-readable proof could be strengthened.</li>
            <li>The market-peer comparison created context for which proof gaps to close first.</li>
            <li>RESTOR already held a structured-data and crawl-access advantage worth protecting.</li>
            <li>The findings pointed toward a structured Signal Proof Layer™ — not a generic SEO checklist.</li>
          </ul>
        </section>

        {/* 6 · RECOMMENDATION */}
        <section className="rsc-section">
          <h2 className="rsc-h2">What did Signal Flair <em>recommend</em> next?</h2>
          <p className="rsc-p">
            Signal Flair recommended strengthening RESTOR&apos;s AI Proof Infrastructure through a focused Signal Proof
            Layer™ buildout and ongoing Stay Found™ monitoring:
          </p>
          <ul className="rsc-ul">
            <li>Strengthen crawlability and machine-readable access (including a deployed llms.txt).</li>
            <li>Improve structured intelligence with aligned schema and proof.json.</li>
            <li>Clarify entity, service, and location signals so AI can verify who RESTOR is.</li>
            <li>Build answer-first service content for the questions AI engines ask.</li>
            <li>Increase trust and proof density with source-backed, verifiable claims.</li>
            <li>Maintain freshness through Stay Found™ and monitor future Signal Score™ movement.</li>
          </ul>
        </section>

        {/* 7 · WHY THIS MATTERS */}
        <section className="rsc-section">
          <h2 className="rsc-h2">Why does this matter for <em>service businesses?</em></h2>
          <p className="rsc-p">
            Service businesses are increasingly evaluated by AI systems before a customer ever clicks, calls, or fills
            out a form. People ask AI for recommendations; the AI compares options and surfaces the ones it can read and
            verify.
          </p>
          <p className="rsc-p">
            When a strong, trusted business is unclear to machines, it becomes harder to recommend — not because the work
            isn&apos;t good, but because the proof isn&apos;t readable. Signal Flair helps businesses build the proof
            layer AI systems can actually verify.
          </p>
        </section>

        {/* 8 · DISCLAIMER */}
        <section className="rsc-section">
          <div className="sl-rec">
            <p className="rsc-p sl-machine" style={{ margin: 0 }}>
              Competitor Signal Snapshot™ is a point-in-time external visibility comparison based on publicly available
              signals and observed AI responses. It is not a claim of private competitor performance, traffic, revenue,
              rankings, or internal strategy. Signal Flair does not guarantee rankings, citations, leads, or revenue.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="rsc-cta">
          <h2 className="rsc-cta-h">See where <em>your</em> signal stands.</h2>
          <p className="rsc-cta-b">Get your Signal Score™ — a baseline read of how AI systems access, understand, verify, and surface your business.</p>
          <a className="rsc-cta-btn" href="/#cta">▸ Get Your Signal Score™</a>
        </section>
      </div>

      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Brownsburg, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/about/">about</a> · <a href="/how-it-works/">how it works</a> · <a href="/proof/">the record</a> · <a href="/faq/">faq</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
