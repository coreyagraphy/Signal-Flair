import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'
import VerifiedMark from '@/components/VerifiedMark'

export const metadata: Metadata = {
  title: 'Proof & Cases — Verified Record | Signal Flair',
  description:
    'Real before/after only. Case Zero is the first documented case — Signal Flair’s own audit, 18/100 on June 2, 2026, rebuilt in public to 73/100 on July 5 (+55). Part of the live Signal Proof Page™ record.',
  alternates: { canonical: 'https://signalflair.ai/proof/proof/' },
}

export default function ProofCasesPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 56, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#field-report">▸ Free Field Report</a>
      </nav>
      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow"><a href="/proof/" className="sl-back">← The record</a> · Proof &amp; cases</div>
          <h1 className="rsc-h1">Real proof. <em>Only.</em></h1>
          <p className="rsc-lead">No illustrative numbers, no fabricated testimonials. Every case here is a real, dated, source-linked record. Right now there is exactly one: ours.</p>
          <div className="sl-markwrap"><VerifiedMark lastVerified="2026-07-05" confirmed={0} total={6} /></div>
        </header>

        <section className="rsc-section">
          <h2 className="rsc-h2">Case Zero — <em>Signal Flair</em></h2>
          <div className="sl-scoreband">
            <div className="sl-scorebig">18<small>/100</small><span className="sl-scoretarget-lbl">Before · Jun 2</span></div>
            <div className="sl-scorearrow" aria-hidden="true">→</div>
            <div className="sl-scoretarget">73<small>/100</small><span className="sl-scoretarget-lbl">After · Jul 5</span></div>
          </div>
          <p className="rsc-p">
            On <strong>June 2, 2026</strong> we ran our Signal Score™ baseline on our own brand-new site. A
            premium build with near-zero AI visibility — 18/100. That is the exact gap our clients
            have, which is why we made ourselves the first case. We rebuilt our own AI proof foundation
            in public, and the <strong>July 5</strong> re-audit came back <strong>73/100 (+55).</strong>{' '}
            Still climbing, tracked to a target of 91/100.
          </p>
          <div className="sl-kv"><span>Baseline</span><span>18 / 100 · June 2, 2026 (verified)</span></div>
          <div className="sl-kv"><span>Re-audit</span><span>73 / 100 · July 5, 2026 (+55)</span></div>
          <div className="sl-kv"><span>Strongest layers</span><span>Access &amp; Crawlability 100 · Structured Intelligence 100</span></div>
          <div className="sl-kv"><span>Still building</span><span>Trust &amp; Proof Density 43 · Live AI Visibility 53</span></div>
          <div className="sl-kv"><span>Target</span><span>91 / 100</span></div>
          <div className="sl-kv"><span>Evidence</span><span>Model-informed Signal Score™ — not a live engine test</span></div>
          <div className="sl-kv"><span>Source</span><span><a href="/proof/changelog/">public change log</a></span></div>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Client cases</h2>
          <p className="rsc-p">
            The first ten Founding Clients become the first ten documented installs — each a real
            before/after, published here only with permission and only once results exist. Until then,
            this space stays empty rather than filled with invented proof.
          </p>
        </section>

        <section className="rsc-cta">
          <h2 className="rsc-cta-h">Be one of the first documented <em>wins.</em></h2>
          <p className="rsc-cta-b">Start with a free Field Report — 3 signals, 24 hours, no call.</p>
          <a className="rsc-cta-btn" href="/#field-report">▸ Get My Free Field Report</a>
        </section>
      </div>
      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Brownsburg, Indiana · serving nationwide<br />
        <a href="/proof/">← back to the record</a> · <a href="/proof.json">/proof.json</a>
      </footer>
    </main>
  )
}
