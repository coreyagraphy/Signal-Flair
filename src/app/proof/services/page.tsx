import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'
import VerifiedMark from '@/components/VerifiedMark'

export const metadata: Metadata = {
  title: 'Services & Areas — Verified Record | Signal Flair',
  description:
    'Signal Flair’s services, service areas, and availability — each source-linked. Part of the live Signal Proof Page™ verified record.',
  alternates: { canonical: 'https://signalflair.ai/proof/services/' },
}

const SERVICES = [
  {
    name: 'Foundation Build',
    desc: 'One-time deployment of Signal Proof Page™ and AI Proof Infrastructure for businesses scoring 0–54.',
    areas: 'United States — nationwide (remote)',
    availability: 'Active',
    basis: 'Fixed price',
    source: '/#pricing',
  },
  {
    name: 'Start the Rebuild',
    desc: 'Targeted fixes plus Signal Proof Page™ deployment for businesses scoring 55–74.',
    areas: 'United States — nationwide (remote)',
    availability: 'Active',
    basis: 'Fixed price',
    source: '/#pricing',
  },
  {
    name: 'Stay Found™',
    desc: 'Stay Found™ monthly proof maintenance — re-verification, change-log updates, and visibility monitoring for businesses scoring 75–100.',
    areas: 'United States (remote)',
    availability: 'Active',
    basis: 'Monthly range',
    source: '/#pricing',
  },
]

export default function ProofServicesPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 56, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#field-report">▸ Free Field Report</a>
      </nav>
      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow"><a href="/proof/" className="sl-back">← The record</a> · Services &amp; areas</div>
          <h1 className="rsc-h1">Services &amp; <em>areas.</em></h1>
          <p className="rsc-lead">What we do, where we serve, and on what basis — each line source-linked. Part of the live Signal Proof Page™ record.</p>
          <div className="sl-markwrap"><VerifiedMark confirmed={0} total={6} /></div>
        </header>

        <section className="rsc-section">
          {SERVICES.map((s) => (
            <div className="sl-rec" key={s.name}>
              <div className="sl-rec-h">
                <span className="sl-rec-name">{s.name}</span>
                <span className="sl-verified">verified</span>
              </div>
              <p className="rsc-p">{s.desc}</p>
              <div className="sl-kv"><span>Service area</span><span>{s.areas}</span></div>
              <div className="sl-kv"><span>Availability</span><span>{s.availability}</span></div>
              <div className="sl-kv"><span>Price basis</span><span>{s.basis}</span></div>
              <div className="sl-kv"><span>Source</span><span><a href={s.source}>signalflair.ai{s.source}</a></span></div>
            </div>
          ))}
          <p className="rsc-p sl-machine">Machine-readable: <a href="/proof.json">/proof.json</a> → <code className="rsc-code">services</code></p>
        </section>

        <section className="rsc-cta">
          <h2 className="rsc-cta-h">See where <em>your</em> signal breaks.</h2>
          <p className="rsc-cta-b">A free Field Report scans 3 critical signals and lands in your inbox in 24 hours. No call.</p>
          <a className="rsc-cta-btn" href="/#field-report">▸ Get My Free Field Report</a>
        </section>
      </div>
      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Indianapolis, Indiana · serving nationwide<br />
        <a href="/proof/">← back to the record</a> · <a href="/proof.json">/proof.json</a>
      </footer>
    </main>
  )
}
