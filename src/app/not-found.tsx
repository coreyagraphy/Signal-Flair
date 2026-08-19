import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

/*
  Branded 404. Before this, the not-found page was Next's bare default — the only
  route on the site with no nav, no footer, and no way back. It reuses the shared
  .rsc-* sub-page shell so it inherits the Cinematic-Brutalism treatment (and any
  future change to it) instead of carrying its own one-off styles.
*/
export const metadata: Metadata = {
  title: 'Page not found · Signal Flair',
  description: 'That page has moved or never existed. Here is where to go instead.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 70, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#cta">▸ Free Signal Pulse™</a>
      </nav>

      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow">404 · Signal lost</div>
          <h1 className="rsc-h1">
            This page isn&apos;t <em>findable.</em>
          </h1>
          <p className="rsc-lead">
            Which is, admittedly, the whole problem we solve. The page you asked for has moved or never
            existed — here&apos;s everything that does.
          </p>
        </header>

        <section className="rsc-section">
          <h2 className="rsc-h2">Where you probably meant to go</h2>
          <ul className="rsc-ul">
            <li><a href="/pulse/"><strong>Free Signal Pulse™</strong></a> — an instant read on how AI engines see your business.</li>
            <li><a href="/how-it-works/"><strong>How it works</strong></a> — the seven Signal Protocol™ layers, start to finish.</li>
            <li><a href="/proof/"><strong>Proof</strong></a> — Case Zero, our own audit, published at the score we actually got.</li>
            <li><a href="/case-studies/three-engines-three-stories/"><strong>Three engines, three stories</strong></a> — one real business, described three different ways.</li>
            <li><a href="/faq/"><strong>FAQ</strong></a> — what a Signal Score™ measures, and what we never promise.</li>
          </ul>
        </section>
      </div>

      <section className="rsc-cta">
        <h2 className="rsc-cta-h">AI can find your business. But does it <em>understand</em> it?</h2>
        <p className="rsc-cta-b">Run your free Signal Pulse™. We&apos;ll run a four-signal read of your live site — Access, Structure, Trust, and Answers.</p>
        <a className="rsc-cta-btn" href="/#cta">▸ Run My Signal</a>
      </section>

      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Indianapolis, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/llms.txt">our llms.txt</a> · <a href="/#cta">Run your free Signal Pulse™</a> · <a href="/privacy/">privacy</a>
      </footer>
    </main>
  )
}
