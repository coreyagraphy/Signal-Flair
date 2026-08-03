import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

export const metadata: Metadata = {
  title: 'How AI Answer Engines Decide Whether to Trust a Local Business | Signal Flair',
  description:
    'When someone asks ChatGPT or Perplexity "who should I hire?", the engines only recommend businesses they can verify. Here are the seven layers they check — and the fixes any owner can make in 30 days.',
  alternates: { canonical: 'https://signalflair.ai/resources/how-ai-engines-verify-a-business/' },
  openGraph: {
    title: 'How AI answer engines decide whether to trust a local business',
    description: 'The seven layers AI engines check before they recommend anyone — in plain English, with the fixes any owner can make this month.',
  },
}

// Article + author + FAQ structured data — this page exists to be retrieved and cited.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://signalflair.ai/resources/how-ai-engines-verify-a-business/#article',
      headline: 'How AI answer engines decide whether to trust a local business',
      description:
        'What ChatGPT, Claude, Perplexity, Gemini, and Google AI cross-check before recommending a business — the seven layers of AI readiness, what "verifiable" looks like, and 30-day fixes any owner can make.',
      datePublished: '2026-07-11',
      dateModified: '2026-07-11',
      author: {
        '@type': 'Person',
        name: 'Corey Ellis',
        alternateName: 'Coreyagraphy',
        jobTitle: 'Founder',
        url: 'https://signalflair.ai/about/',
        sameAs: ['https://www.linkedin.com/in/corey-ellis-3b4a0ab8', 'https://www.instagram.com/coreyagraphy/'],
      },
      publisher: { '@id': 'https://signalflair.ai/#org' },
      mainEntityOfPage: 'https://signalflair.ai/resources/how-ai-engines-verify-a-business/',
      about: ['AI visibility', 'Answer Engine Optimization', 'AI trust verification', 'Signal Score'],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How is this different from SEO?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SEO optimizes for a ranked page of blue links. Answer engines assemble one answer — there is no page two. They retrieve candidate businesses, then cross-check what they can verify: schema, llms.txt, consistent public facts, reviews, and third-party corroboration. Optimizing that verification layer is Answer Engine Optimization (AEO).',
          },
        },
        {
          '@type': 'Question',
          name: 'Can anyone guarantee AI will recommend my business?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No — and anyone who guarantees rankings, citations, or AI recommendations is guessing. AI answers vary by session, location, account state, and time. What can honestly be delivered is the infrastructure engines need to verify you: structured data, llms.txt, crawler access, consistent entity facts, and trust proof.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the fastest first step for a business owner?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Make your basic facts machine-readable and consistent: one exact business name, location, and service description everywhere (site, Google profile, directories, social), an llms.txt file at your domain root, and Organization schema on your homepage. A free instant read of your AI readiness is available via Signal Pulse at signalflair.ai/pulse.',
          },
        },
      ],
    },
  ],
}

export default function HowAiVerifiesPage() {
  return (
    <main className="rsc">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 56, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#cta">▸ Free Signal Pulse™</a>
      </nav>

      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow">Resource · AI Visibility · by Corey Ellis · July 11, 2026</div>
          <h1 className="rsc-h1">How AI answer engines decide whether to <em>trust</em> a local business</h1>
          <p className="rsc-lead">When someone asks ChatGPT &ldquo;who should I call?&rdquo;, there is no page two. The engine recommends the businesses it can verify — and quietly skips the ones it can&apos;t. Here&apos;s what it checks, in plain English.</p>
        </header>

        <section className="rsc-section">
          <h2 className="rsc-h2">The moment of recommendation</h2>
          <p className="rsc-p">Ask an AI engine for a plumber, a roofer, a dentist, or a lawyer and you get a short list — usually three to five names, each with a one-line reason. That list wasn&apos;t ranked the way Google ranks links. It was <em>assembled</em>: the engine retrieved candidates from what it knows and what it can read right now, then kept the ones whose facts it could confirm.</p>
          <p className="rsc-p">That second step — confirmation — is where most local businesses fall out. Not because they&apos;re bad businesses. Because the engine literally cannot verify who they are, what they do, or where they serve.</p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">What engines cross-check before they recommend anyone</h2>
          <p className="rsc-p">Before your name appears in an answer, engines like ChatGPT, Claude, Perplexity, Gemini, and Google AI cross-reference what your website claims against what they can confirm elsewhere:</p>
          <p className="rsc-p"><strong>Structured data (schema markup).</strong> Machine-readable labels on your site that say &ldquo;this is an organization, this is its name, founder, location, services.&rdquo; Without it, the engine is guessing from prose.</p>
          <p className="rsc-p"><strong>llms.txt.</strong> A plain-text file at your domain root written specifically for AI systems — your facts, in the format they read first. (Full explainer: <a href="/resources/llms-txt/">what is llms.txt?</a>)</p>
          <p className="rsc-p"><strong>Crawler access.</strong> If your robots.txt blocks AI crawlers — or your site only renders in JavaScript — engines may see a blank page where your business should be.</p>
          <p className="rsc-p"><strong>Consistency.</strong> The same exact name, location, and description on your site, your Google profile, your chamber listing, your LinkedIn, your directories. Every mismatch is doubt.</p>
          <p className="rsc-p"><strong>Third-party corroboration.</strong> Reviews, memberships, citations, press — records the engine can check that <em>aren&apos;t you talking about yourself</em>. Dense, consistent proof reads as trustworthy. Thin or contradictory proof gets you quietly left out.</p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">The seven layers of AI readiness</h2>
          <p className="rsc-p">We measure this as a 0–100 Signal Score™ across seven layers: <strong>Access &amp; Crawlability</strong> (can AI reach your site), <strong>Structured Intelligence</strong> (can it parse your facts), <strong>Entity Clarity</strong> (does it know which &ldquo;you&rdquo; you are — critical if your name resembles anyone else&apos;s), <strong>Answer Architecture</strong> (does your site answer the questions people actually ask), <strong>Trust &amp; Proof Density</strong> (can it verify you through third parties), <strong>Live AI Visibility</strong> (does it actually surface you today), and <strong>Agent &amp; Commerce Readiness</strong> (when an AI agent tries to book or buy on a customer’s behalf, can it). Most local businesses fail three of seven without knowing. The full method is on <a href="/how-it-works/">how it works</a>.</p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">We ran this on ourselves first</h2>
          <p className="rsc-p">Signal Flair&apos;s own baseline audit — Case Zero — scored <strong>18/100</strong> on June 2, 2026. A premium-looking site, nearly invisible to AI. We spent five weeks building the same proof layer we sell: llms.txt, schema, entity cleanup, crawler access, a public proof record. The July 5 re-audit read <strong>73/100</strong> — a model-informed Signal Score™ read, not a live engine test, and not a guarantee of AI ranking, citation, or recommendation. The work performed between measurements correlates with the change; it does not prove engine behavior changed. Every step is public at <a href="/proof/">signalflair.ai/proof</a>.</p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Fixes any owner can make in 30 days</h2>
          <p className="rsc-p"><strong>1.</strong> Pick one exact business name and use it everywhere — no variants, no abbreviations.</p>
          <p className="rsc-p"><strong>2.</strong> Add Organization schema to your homepage: name, location, services, founder, contact.</p>
          <p className="rsc-p"><strong>3.</strong> Publish an llms.txt at your domain root with your verified facts.</p>
          <p className="rsc-p"><strong>4.</strong> Check robots.txt — make sure AI crawlers aren&apos;t blocked by accident.</p>
          <p className="rsc-p"><strong>5.</strong> Reconcile your Google Business Profile, chamber listing, and social bios to the exact same facts.</p>
          <p className="rsc-p"><strong>6.</strong> Answer real customer questions in visible text on your site — not just in images or sliders.</p>
          <p className="rsc-p">One honest caveat: AI answers vary by session, location, and time. One observation represents one session, one location, one moment — never &ldquo;all users.&rdquo; That&apos;s why this is infrastructure work, not a trick.</p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">See where you stand</h2>
          <p className="rsc-p">Signal Pulse™ gives you a free instant read of your AI readiness at <a href="/pulse/">signalflair.ai/pulse</a>, and the free Signal Score™ Audit goes deeper — <a href="/#cta">request one here</a>. More questions? The <a href="/faq/">FAQ</a> covers what a Signal Score™ measures and what we never promise: we build and hand over the infrastructure — we don&apos;t guarantee rankings, citations, or AI recommendations.</p>
        </section>
      </div>

      <section className="rsc-cta">
        <h2 className="rsc-cta-h">AI can find your business. But does it <em>understand</em> it?</h2>
        <p className="rsc-cta-b">Run your free Signal Pulse™. We&apos;ll scan 3 of the 7 Signal Protocol™ layers across ChatGPT, Claude, Perplexity, Gemini, and Google AI — and show you exactly which of the checks above your business fails today.</p>
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
