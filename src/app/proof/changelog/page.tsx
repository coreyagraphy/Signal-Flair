import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'
import VerifiedMark from '@/components/VerifiedMark'

export const metadata: Metadata = {
  title: 'Change Log — Verified Record | Signal Flair',
  description:
    'The dated public record of what Signal Flair verified or updated, and when. Part of the live Signal Proof Page™ verified record. Next review due 2026-08-17.',
  alternates: { canonical: 'https://signalflair.ai/proof/changelog/' },
}

// REAL entries only. Each is a dated action actually taken. Newest first.
const LOG = [
  {
    date: '2026-08-19',
    title: 'Case Zero current reading — 98/100, by the public scanner',
    body: 'Read by the deterministic public scanner behind every Signal Pulse™: Access 100, Structure 100, Trust 100, Answers 90 — weighted 30/30/20/20 → 98/100. Three consecutive samples, identical; anyone can reproduce the reading at /pulse. Same day, baseline provenance was settled on the record: the operator-recorded 18 stands as the founder’s call, and the site now says plainly that the June worksheet rows do not average to it rather than retrofitting them.',
  },
  {
    date: '2026-08-03',
    title: 'Case Zero re-audit — 91/100',
    body: 'Second re-audit. The Signal Score™ read 91/100, up from 73 on July 5 and 18 at the June 6 baseline. Three layers were re-measured by the same deterministic scanner that runs every Signal Pulse™, pointed at this site: Access & Crawlability 100, Structured Intelligence 100, Answer Architecture 90 (up from 77). As with every reading, this is a Signal Score™ measurement of the proof layer — not a guarantee of AI ranking, citation, or recommendation.',
  },
  {
    date: '2026-07-05',
    title: 'Case Zero re-audit — 73/100',
    body: 'First re-audit after building the same proof layer we sell: llms.txt, structured data, entity cleanup, crawler access, and a public proof record. The Signal Score™ climbed from 18 to 73 across six layers — Access & Crawlability 100, Structured Intelligence 100, Answer Architecture 77, Entity Clarity 63, Live AI Visibility 53, Trust & Proof Density 43. The two weakest layers are published exactly as measured.',
  },
  {
    date: '2026-06-06',
    title: 'Signal Proof Page™ layer published',
    body: 'Live verified-record hub shipped: /proof/ pages, the /proof.json export, the signalflair.json export at /.well-known/signalflair.json, schema.org JSON-LD, and an enhanced llms.txt. The record is now crawlable and inspection-ready.',
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
          <p className="rsc-cta-b">Start with a free Signal Pulse™ — a four-signal read of your live site, 24 hours, no call.</p>
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
