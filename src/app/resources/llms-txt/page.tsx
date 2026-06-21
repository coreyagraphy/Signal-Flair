import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

export const metadata: Metadata = {
  title: 'What is llms.txt? Why Your Business Is Invisible to AI Without It | Signal Flair',
  description:
    'llms.txt is the file that tells AI engines — ChatGPT, Claude, Perplexity, Gemini, Google AI — who your business is. Fewer than 1% of local businesses have one. Here’s what it is, why it matters, and how to fix it.',
  alternates: { canonical: 'https://signalflair.ai/resources/llms-txt' },
  openGraph: {
    title: 'What is llms.txt? Why Your Business Is Invisible to AI Without It',
    description: 'The simple file that tells AI engines who your business is — and why fewer than 1% of local businesses have one.',
  },
}

// Article + FAQ structured data so this page can be cited and surfaced by AI engines.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'What is llms.txt and why most businesses are invisible to AI without it',
      description: 'A plain-English guide to llms.txt: what it is, what it does, how to create one, and why it matters for AI visibility.',
      author: { '@type': 'Organization', name: 'Signal Flair', url: 'https://signalflair.ai' },
      publisher: { '@id': 'https://signalflair.ai/#org' },
      mainEntityOfPage: 'https://signalflair.ai/resources/llms-txt',
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
            text: 'llms.txt is a plain-text file placed at the root of your website (yourdomain.com/llms.txt) that gives AI engines a clear, structured summary of your business — who you are, what you do, where you serve, and how you want to be described. Think of it as a business card written specifically for AI.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where does the llms.txt file go?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In the root of your website, served at yourdomain.com/llms.txt, the same way robots.txt is served. AI crawlers look for it there.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is llms.txt the same as robots.txt or schema markup?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. robots.txt controls which crawlers are allowed in. Schema markup labels structured data for search engines. llms.txt is a human-readable summary written for AI/answer engines. They work together — Signal Flair deploys all three.',
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
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 56, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#cta">▸ Free Field Report</a>
      </nav>

      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow">Resource · AI Visibility</div>
          <h1 className="rsc-h1">What is <span className="rsc-code">llms.txt</span> — and why most businesses are <em>invisible</em> to AI without it</h1>
          <p className="rsc-lead">Fewer than 1% of local businesses have this file. Here&apos;s what it is, why it matters, and how to fix it — in plain English.</p>
        </header>

        <section className="rsc-section">
          <h2 className="rsc-h2">The problem</h2>
          <p className="rsc-p">AI engines — ChatGPT, Claude, Perplexity, Gemini, and Google AI — are now actively crawling websites to understand and recommend local businesses. The problem? Most sites give them almost nothing useful to work with.</p>
          <p className="rsc-p"><span className="rsc-code">llms.txt</span> is a simple, standardized file that tells AI systems exactly who you are, what you do, where you serve, and how you want to be described. Without it, AI often draws a blank — or makes something up.</p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">What <span className="rsc-code">llms.txt</span> actually does</h2>
          <ul className="rsc-ul">
            <li>Gives AI a <strong>clear, structured summary</strong> of your business</li>
            <li>Reduces hallucination and incorrect information</li>
            <li>Improves how accurately AI describes your services and location</li>
            <li>Becomes a strong signal for AI recommendations</li>
          </ul>
          <p className="rsc-p">Think of it as a business card written specifically for AI.</p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Before vs. <em>after</em></h2>
          <div className="rsc-ba">
            <div className="rsc-bacard before">
              <div className="rsc-balabel">Before · no llms.txt</div>
              <div className="rsc-baquote">&ldquo;A local company in Brownsburg, Indiana that does something with… [vague description].&rdquo;</div>
            </div>
            <div className="rsc-bacard after">
              <div className="rsc-balabel">After · proper llms.txt</div>
              <div className="rsc-baquote">&ldquo;A family-owned HVAC company serving Brownsburg, Indiana and surrounding areas since 2012, specializing in repair and installation — consistently rated 4.9 stars.&rdquo;</div>
            </div>
          </div>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">How to create one</h2>
          <div className="rsc-step"><span className="rsc-num">1</span>Create a plain-text file named <strong><span className="rsc-code">llms.txt</span></strong>.</div>
          <div className="rsc-step"><span className="rsc-num">2</span>Put it in the root of your site, served at <strong>yourdomain.com/llms.txt</strong>.</div>
          <div className="rsc-step"><span className="rsc-num">3</span>Write a clear, accurate summary of your business — name, services, service area, and how you want to be described.</div>
          <div className="rsc-step"><span className="rsc-num">4</span>Update it whenever your business changes.</div>
          <p className="rsc-p" style={{ marginTop: '18px' }}>That&apos;s the basic idea. Doing it <em>well</em> — so AI engines actually trust and cite it — is where the precision matters. (Signal Flair builds and deploys this for clients.)</p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">How it compares to robots.txt &amp; schema</h2>
          <ul className="rsc-ul">
            <li><strong>robots.txt</strong> — controls which crawlers are <em>allowed</em> in.</li>
            <li><strong>Schema markup</strong> — labels structured data for search engines.</li>
            <li><strong>llms.txt</strong> — a human-readable summary written for <em>AI / answer engines</em>.</li>
          </ul>
          <p className="rsc-p">They&apos;re not interchangeable — they work together. A complete AI-visibility foundation deploys all three.</p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Why most businesses still don&apos;t have one</h2>
          <ul className="rsc-ul">
            <li>They don&apos;t know it exists</li>
            <li>They assume traditional SEO is enough</li>
            <li>They assume AI will &ldquo;just figure it out&rdquo;</li>
            <li>Building it properly takes time and precision</li>
          </ul>
          <p className="rsc-p">Which is exactly why Signal Flair exists.</p>
        </section>
      </div>

      <section className="rsc-cta">
        <h2 className="rsc-cta-h">Want to know how visible <em>(or invisible)</em> your business is to AI?</h2>
        <p className="rsc-cta-b">Run your free Field Report. We&apos;ll scan 3 critical signals across ChatGPT, Claude, Perplexity, Gemini, and Google AI — and show you exactly where your business breaks, including whether you have an llms.txt file working for you.</p>
        <a className="rsc-cta-btn" href="/#cta">▸ Get My Free Field Report</a>
      </section>

      <footer className="rsc-foot">
        Signal Flair · a Mental Vision Corp product · Brownsburg, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/llms.txt">our llms.txt</a> · <a href="/#cta">Get your free Field Report</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
