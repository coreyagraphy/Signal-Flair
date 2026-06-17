import type { Metadata } from 'next'
import VerifiedMark from '@/components/VerifiedMark'

export const metadata: Metadata = {
  title: 'Trust Evidence — Verified Record | Signal Flair',
  description:
    'Signal Flair’s operator, parent company, and trust signals — shown honestly, including the gaps. Part of the live Signal Lock verified record.',
  alternates: { canonical: 'https://signalflair.ai/proof/trust' },
}

export default function ProofTrustPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/">SIGNAL<em>FLAIR</em></a>
        <a className="rsc-navcta" href="/#field-report">▸ Free Field Report</a>
      </nav>
      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow"><a href="/proof/" className="sl-back">← The record</a> · Trust evidence</div>
          <h1 className="rsc-h1">Trust, <em>shown honestly.</em></h1>
          <p className="rsc-lead">The trust mark only stamps what a real source backs. Where we don&apos;t have evidence yet, we say so — we never fabricate it.</p>
          <div className="sl-markwrap"><VerifiedMark confirmed={0} total={6} /></div>
        </header>

        <section className="rsc-section">
          <h2 className="rsc-h2">Identity</h2>
          <div className="sl-kv"><span>Business</span><span>Signal Flair</span></div>
          <div className="sl-kv"><span>Operated by</span><span>Mental Vision Corp</span></div>
          <div className="sl-kv"><span>Founder</span><span>Corey Ellis</span></div>
          <div className="sl-kv"><span>Location</span><span>Brownsburg, Indiana, USA — serving nationwide</span></div>
          <div className="sl-kv"><span>Contact</span><span><a href="mailto:outreach@trysignalflair.com">outreach@trysignalflair.com</a></span></div>
          <div className="sl-kv"><span>Also at</span><span><a href="https://www.linkedin.com/company/signal-flair-ai" target="_blank" rel="noopener noreferrer">LinkedIn</a> · <a href="https://mentalvision.ai" target="_blank" rel="noopener noreferrer">mentalvision.ai</a></span></div>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">The honest gaps</h2>
          <p className="rsc-p">Case Zero is a new operation. These signals have no verified source yet, so the trust mark leaves them <strong>unstamped</strong> rather than inventing them. This is the discipline the whole system runs on.</p>
          <div className="sl-rec">
            <div className="sl-rec-h"><span className="sl-rec-name">Review signal</span><span className="sl-unverified">unverified</span></div>
            <p className="rsc-p">No public review record yet — scored 0/100 in Case Zero. We will only publish ratings or review themes once they exist and are source-linked.</p>
          </div>
          <div className="sl-rec">
            <div className="sl-rec-h"><span className="sl-rec-name">Years in business</span><span className="sl-unverified">unverified</span></div>
            <p className="rsc-p">Not yet asserted with a citable source. Left blank rather than estimated.</p>
          </div>
          <div className="sl-rec">
            <div className="sl-rec-h"><span className="sl-rec-name">Licenses &amp; insurance</span><span className="sl-na">not applicable</span></div>
            <p className="rsc-p">Not a licensed trade. For client records in licensed trades, each license and policy is verified against its issuing source before it is stamped.</p>
          </div>
        </section>

        <section className="rsc-cta">
          <h2 className="rsc-cta-h">A record customers and AI can <em>trust.</em></h2>
          <p className="rsc-cta-b">Start with a free Field Report — 3 signals, 24 hours, no call.</p>
          <a className="rsc-cta-btn" href="/#field-report">▸ Get My Free Field Report</a>
        </section>
      </div>
      <footer className="rsc-foot">
        Signal Flair · a Mental Vision Corp product · Brownsburg, Indiana · serving nationwide<br />
        <a href="/proof/">← back to the record</a> · <a href="/proof.json">/proof.json</a>
      </footer>
    </main>
  )
}
