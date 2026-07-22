import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'
import VerifiedMark from '@/components/VerifiedMark'

export const metadata: Metadata = {
  title: 'Proof & Cases — Verified Record | Signal Flair',
  description:
    'Real, dated, permission-cleared records only. Case Zero is Signal Flair’s own audit (18/100, tracked to target); The Mill is the first published client baseline (35/100). No fabricated before/afters. Part of the live Signal Proof Page™ record.',
  alternates: { canonical: 'https://signalflair.ai/proof/proof/' },
}

export default function ProofCasesPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 70, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#field-report">▸ Free Signal Pulse™</a>
      </nav>
      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow"><a href="/proof/" className="sl-back">← The record</a> · Proof &amp; cases</div>
          <h1 className="rsc-h1">Real proof. <em>Only.</em></h1>
          <p className="rsc-lead">No illustrative numbers, no fabricated testimonials. Every case here is a real, dated, source-linked record — our own before/after in progress, plus the first client baseline, published with permission.</p>
          <div className="sl-markwrap"><VerifiedMark confirmed={0} total={6} /></div>
        </header>

        <section className="rsc-section">
          <h2 className="rsc-h2">Case Zero — <em>Signal Flair</em></h2>
          <div className="sl-scoreband">
            <div className="sl-scorebig">18<small>/100</small></div>
            <div className="sl-scorearrow" aria-hidden="true">→</div>
            <div className="sl-scoretarget">91<small>/100</small><span className="sl-scoretarget-lbl">Target</span></div>
          </div>
          <p className="rsc-p">
            On <strong>June 6, 2026</strong> we ran our Signal Score™ baseline on our own brand-new site. A
            premium build with near-zero AI visibility — 18/100. That is the exact gap our clients
            have, which is why we made ourselves the first case. We&apos;re documenting the climb to a
            target of 91/100, re-measured at Day 30 and Day 90.
          </p>
          <div className="sl-kv"><span>Date</span><span>2026-06-06</span></div>
          <div className="sl-kv"><span>Before</span><span>18 / 100 (verified baseline)</span></div>
          <div className="sl-kv"><span>Target</span><span>91 / 100</span></div>
          <div className="sl-kv"><span>Status</span><span><span className="sl-verified">verified</span></span></div>
          <div className="sl-kv"><span>Source</span><span><a href="/proof/changelog/">public change log</a></span></div>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">The Mill — <em>first client baseline</em></h2>
          <div className="sl-scoreband">
            <div className="sl-scorebig">35<small>/100</small></div>
            <div className="sl-scorearrow" aria-hidden="true">→</div>
            <div className="sl-scoretarget">80+<small></small><span className="sl-scoretarget-lbl">Projected</span></div>
          </div>
          <p className="rsc-p">
            A real Proof OS™ audit of The Mill — the coworking and event space at the center of Amplify
            Bloomington — published with the client&apos;s permission. It appeared in ChatGPT, Gemini, and
            Perplexity, but each engine told a different, incomplete story: showing up by luck, not by design.
            This is a <strong>baseline</strong> — the before, dated and documented. No remediation has been
            performed yet, so there is no after to claim; the 80+ figure is a modeled target, not a result.
          </p>
          <div className="sl-kv"><span>Client</span><span>The Mill · Amplify Bloomington · Bloomington, IN</span></div>
          <div className="sl-kv"><span>Date</span><span>2026-07-21</span></div>
          <div className="sl-kv"><span>Baseline</span><span>35 / 100 (live-fetched, seven-signal)</span></div>
          <div className="sl-kv"><span>Target</span><span>80+ / 100 (projected, not guaranteed)</span></div>
          <div className="sl-kv"><span>Status</span><span><span className="sl-verified">baseline · before/after pending</span></span></div>
          <div className="sl-kv"><span>Read</span><span><a href="/case-studies/three-engines-three-stories/">The full Mill audit →</a></span></div>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Documented before/afters</h2>
          <p className="rsc-p">
            The Founding Five become the first documented installs — each a real
            before/after, published here only with permission and only once results exist. The Mill is the
            first published baseline; its after joins the record when the remediation and controlled retest
            are complete. Until a case has real results, it stays a labeled baseline, never invented proof.
          </p>
        </section>

        <section className="rsc-cta">
          <h2 className="rsc-cta-h">Be one of the first documented <em>wins.</em></h2>
          <p className="rsc-cta-b">Start with a free Signal Pulse™ — 3 of your 7 signal layers, 24 hours, no call.</p>
          <a className="rsc-cta-btn" href="/#field-report">▸ Run My Signal</a>
        </section>
      </div>
      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Indianapolis, Indiana · serving nationwide<br />
        <a href="/proof/">← back to the record</a> · <a href="/proof.json">/proof.json</a>
      </footer>
    </main>
  )
}
