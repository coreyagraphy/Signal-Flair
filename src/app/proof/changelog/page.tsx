import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'
import VerifiedMark from '@/components/VerifiedMark'

export const metadata: Metadata = {
  title: 'Change Log — Verified Record | Signal Flair',
  description:
    'The dated public record of what Signal Flair verified or updated, and when. Part of the live Signal Proof Page™ verified record. Next review due 2026-08-17.',
  alternates: { canonical: 'https://signalflair.ai/proof/changelog/' },
}

// REAL entries only. Each is a dated action actually taken.
const LOG = [
  {
    date: '2026-06-06',
    title: 'Signal Proof Page™ layer published',
    body: 'Live verified-record hub shipped: /proof/ pages, machine-readable /proof.json, discovery manifest at /.well-known/signalflair.json, schema.org JSON-LD, and an enhanced llms.txt. The record is now crawlable and inspection-ready.',
  },
  {
    date: '2026-06-06',
    title: 'Case Zero baseline recorded',
    body: 'Signal Flair audited itself first and scored 18/100 across six signals — AI Search Presence 4, Entity Clarity 5, Crawl Readiness 35, Authority Content 12, Review Signal 0, Conversion Proof 20. Recorded as the honest starting point.',
  },
]

export default function ProofChangelogPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 70, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#cta">▸ Free Signal Pulse™</a>
      </nav>
      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow"><a href="/proof/" className="sl-back">← The record</a> · Change log</div>
          <h1 className="rsc-h1">What changed, <em>and when.</em></h1>
          <p className="rsc-lead">The dated public record. This is the moat — not a one-time fix, but a layer kept current. Every verification run lands here.</p>
          <div className="sl-markwrap"><VerifiedMark confirmed={0} total={6} note="Next review due 2026-08-17" /></div>
        </header>

        <section className="rsc-section">
          <div className="sl-cl">
            {LOG.map((e, i) => (
              <div className="sl-cl-row" key={i}>
                <div className="sl-cl-date">{e.date}</div>
                <div className="sl-cl-body">
                  <div className="sl-cl-title">{e.title}</div>
                  <p className="rsc-p">{e.body}</p>
                </div>
              </div>
            ))}
            <div className="sl-cl-row sl-cl-due">
              <div className="sl-cl-date">2026-08-17</div>
              <div className="sl-cl-body">
                <div className="sl-cl-title">Next scheduled re-verification</div>
                <p className="rsc-p">Re-measure: citation share across the five engines, facts re-verified, and the score re-run. Result posts here.</p>
              </div>
            </div>
          </div>
          <p className="rsc-p sl-machine">Machine-readable: <a href="/proof.json">/proof.json</a> → <code className="rsc-code">verification</code></p>
        </section>

        <section className="rsc-cta">
          <h2 className="rsc-cta-h">Your record, kept <em>current.</em></h2>
          <p className="rsc-cta-b">Start with a free Signal Pulse™ — 3 of your 7 signal layers, 24 hours, no call.</p>
          <a className="rsc-cta-btn" href="/#cta">▸ Run My Signal</a>
        </section>
      </div>
      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Indianapolis, Indiana · serving nationwide<br />
        <a href="/proof/">← back to the record</a> · <a href="/proof.json">/proof.json</a>
      </footer>
    </main>
  )
}
