import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

export const metadata: Metadata = {
  title: 'The Truth About llms.txt: What the Data Actually Shows | Signal Flair',
  description:
    'llms.txt is the most over-sold file in AI visibility. A 137,000-domain study found 97% of published llms.txt files are never fetched, and Google says Search ignores them. Here’s what the data shows — and what actually moves AI visibility.',
  alternates: { canonical: 'https://signalflair.ai/resources/llms-txt/' },
  openGraph: {
    title: 'The Truth About llms.txt: What the Data Actually Shows',
    description: '97% of llms.txt files are never fetched. Google ignores them. Here’s what actually moves AI visibility — with sources.',
    images: ['/video/hero-poster.jpg'],
  },
}

// Article + FAQ structured data so this page can be cited and surfaced by AI engines.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'The truth about llms.txt: what the data actually shows',
      description: 'A plain-English, evidence-first guide to llms.txt: what it is, what the adoption data shows, why Signal Flair publishes one but does not sell one, and what actually moves AI visibility.',
      author: { '@type': 'Organization', name: 'Signal Flair', url: 'https://signalflair.ai' },
      publisher: { '@id': 'https://signalflair.ai/#org' },
      mainEntityOfPage: 'https://signalflair.ai/resources/llms-txt/',
      about: ['llms.txt', 'AI visibility', 'Answer Engine Optimization'],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is llms.txt?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'llms.txt is a community-proposed plain-text file placed at the root of a website (yourdomain.com/llms.txt) that offers AI systems a structured summary of the site. It is not a standard: no standards body governs it, and no major AI platform documents reading it.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does llms.txt improve AI visibility or rankings?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'There is no evidence that it does. A June 2026 study of 137,210 domains found 97% of published llms.txt files received zero requests, and Google’s own documentation states that Google Search ignores AI text files like llms.txt. The few real fetches observed come mostly from coding assistants reading developer documentation, not from answer engines choosing businesses.',
          },
        },
        {
          '@type': 'Question',
          name: 'What actually affects whether AI engines can find and recommend a business?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The intervention with peer-reviewed causal support is crawler access: sites that block the crawlers feeding AI answers measurably lose AI visibility (SIGIR 2026, 11,500 real user queries). Beyond that, engines rely on ordinary crawlable pages, a consistent Google Business Profile, and consistent facts across the directories and reviews they cross-reference.',
          },
        },
      ],
    },
  ],
}

export default function LlmsTxtResourcePage() {
  return (
    <main className="rsc">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 70, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#cta">▸ Free Signal Pulse™</a>
      </nav>

      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow">Resource · AI Visibility · Evidence-first</div>
          <h1 className="rsc-h1">The truth about <span className="rsc-code">llms.txt</span> — what the data <em>actually</em> shows</h1>
          <p className="rsc-lead">It&apos;s the most over-sold file in AI visibility. We publish one on our own site — and we will not sell you one. Here&apos;s why, with sources.</p>
        </header>

        <section className="rsc-section">
          <h2 className="rsc-h2">What it is</h2>
          <p className="rsc-p"><span className="rsc-code">llms.txt</span> is a community-proposed plain-text file placed at the root of a website that offers AI systems a structured summary of the site. The idea sounds sensible — a business card written for machines.</p>
          <p className="rsc-p">But an idea sounding sensible is not the same as machines actually reading it. So instead of repeating the pitch, here is what the measurement shows.</p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">What the data shows</h2>
          <ul className="rsc-ul">
            <li><strong>97% of published llms.txt files are never fetched.</strong> A June 2026 study analyzed 137,210 domains: of the sites that published the file, 97% saw zero requests to it.</li>
            <li><strong>Google says Search ignores it.</strong> Google&apos;s own developer documentation states you don&apos;t need to create machine-readable AI files to appear in AI Overviews or AI Mode — &ldquo;Google Search ignores them.&rdquo;</li>
            <li><strong>Neither OpenAI nor Anthropic documents reading it.</strong> Their published crawler documentation names robots.txt, feeds, and ordinary crawlable pages — never llms.txt.</li>
            <li><strong>The few real fetches come from coding assistants</strong> reading developer documentation — not from answer engines deciding which plumber to recommend.</li>
          </ul>
          <p className="rsc-p">Any vendor selling &ldquo;llms.txt deployment&rdquo; as an AI-visibility fix is selling you a file that, on the best available evidence, nothing you care about will ever read.</p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Why we publish one <em>anyway</em></h2>
          <p className="rsc-p">You&apos;ll find ours at <a href="/llms.txt">signalflair.ai/llms.txt</a>. It costs nothing to serve, it&apos;s honest, and if the standard ever earns real adoption, we&apos;re ready. That&apos;s the right size for this file: a free courtesy — not a line item on your invoice.</p>
          <p className="rsc-p">If we sold it to you as a visibility fix, we&apos;d be selling the myth. Our whole product is that we don&apos;t do that — every finding we hand you is backed by evidence you can check.</p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">What actually moves AI visibility</h2>
          <ul className="rsc-ul">
            <li><strong>Answer-crawler access.</strong> The one fix with peer-reviewed causal support: sites blocking the crawlers that feed AI answers measurably lose AI visibility (SIGIR 2026, 11,500 real user queries). Blocks are usually a security plugin&apos;s default — nobody decided them.</li>
            <li><strong>Ordinary crawlable pages.</strong> Google&apos;s stated requirement for AI features is simply being indexed and snippet-eligible. The engines read your actual site.</li>
            <li><strong>A consistent Google Business Profile.</strong> Google documents that it can update your profile from what the rest of the web reports — and that you can&apos;t manage all Google updates. Inconsistent facts don&apos;t just confuse AI; they invite Google to rewrite you.</li>
            <li><strong>Consistent facts everywhere AI cross-references</strong> — your site, directories, and reviews telling one story, machine-readably.</li>
          </ul>
          <p className="rsc-p">That&apos;s the work Signal Flair does — and every finding carries the fingerprint of the file it came from, so you can verify us the way AI verifies you.</p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">How it compares to robots.txt &amp; schema</h2>
          <ul className="rsc-ul">
            <li><strong>robots.txt</strong> — controls which crawlers are <em>allowed</em> in. This one is load-bearing: it decides whether answer engines can read you at all.</li>
            <li><strong>Schema markup</strong> — machine-readability hygiene that makes your facts legible and earns rich results. Useful; not a citation vending machine.</li>
            <li><strong>llms.txt</strong> — a proposal almost nothing reads today. Publish one if you like; pay for one never.</li>
          </ul>
        </section>
      </div>


        <section className="rsc-section">
          <h2 className="rsc-h2">Read <em>next</em></h2>
          <div className="sl-hub">
            <a className="sl-hub-card" href="/resources/how-ai-engines-verify-a-business/">
              <span className="sl-hub-k">01</span>
              <span className="sl-hub-t">How AI engines decide to trust you</span>
              <span className="sl-hub-d">The six layers engines cross-check before they recommend anyone.</span>
            </a>
            <a className="sl-hub-card" href="/pulse/">
              <span className="sl-hub-k">02</span>
              <span className="sl-hub-t">Free Signal Pulse™</span>
              <span className="sl-hub-d">An instant, deterministic read on how AI engines see your site.</span>
            </a>
            <a className="sl-hub-card" href="/proof/">
              <span className="sl-hub-k">03</span>
              <span className="sl-hub-t">Case Zero</span>
              <span className="sl-hub-d">Our own audit — 18/100 to 91/100, every reading dated.</span>
            </a>
          </div>
          <p className="rsc-p sl-machine">
            Machine-readable: <a href="/llms.txt">/llms.txt</a> · <a href="/proof.json">/proof.json</a> · <a href="/.well-known/signalflair.json">signalflair.json</a>
          </p>
        </section>

      <section className="rsc-cta">
        <h2 className="rsc-cta-h">AI can find your business. But can it <em>read</em> you?</h2>
        <p className="rsc-cta-b">Run your free Signal Pulse™ — a four-signal read of your live site. You&apos;ll see whether the crawlers that feed AI answers can actually reach you, and exactly where your signal breaks.</p>
        <a className="rsc-cta-btn" href="/#cta">▸ Run My Signal</a>
      </section>

      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Indianapolis, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/llms.txt">our llms.txt</a> · <a href="/#cta">Run your free Signal Pulse™</a> · <a href="/privacy/">privacy</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
