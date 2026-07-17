import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

export const metadata: Metadata = {
  title: 'FAQ — Signal Score, Case Zero, Field Report & Signal Proof Page | Signal Flair',
  description:
    'Answers to the core Signal Flair questions: what a Signal Score™ is, what Case Zero (18/100, June 6 2026) is, what a free Field Report includes, and the Founding Partner Pilot. AI Proof Infrastructure for businesses and organizations nationwide.',
  alternates: { canonical: 'https://signalflair.ai/faq/' },
  openGraph: {
    title: 'Signal Flair — Frequently Asked Questions',
    description:
      'What is a Signal Score? What is Case Zero? What is a Field Report? What is a Signal Proof Page™? Straight answers, written to be extracted.',
    images: ['/video/hero-poster.jpg'],
  },
}

// ONE source of truth — feeds both the visible <details> list and the FAQPage schema.
// Google requires structured data to mirror the visible text exactly. Edit here only.
const FAQS: { q: string; a: string }[] = [
  {
    q: 'What is a Signal Score™?',
    a: 'A Signal Score™ is a number from 0 to 100, produced by the Signal Protocol™, that measures how visible and trustworthy your business appears to AI search engines like ChatGPT, Perplexity, Google AI, and Gemini. Most local businesses score under 40 and don’t know it.',
  },
  {
    q: 'What is AI Proof Infrastructure™?',
    a: 'AI Proof Infrastructure is the structured layer of business information, technical signals, trust proof, and public verification assets that helps AI answer engines understand and verify an organization. Signal Flair builds it — not just an audit, but the proof layer that makes you easier for ChatGPT, Claude, Gemini, Perplexity, and Google AI to access, understand, verify, and recommend.',
  },
  {
    q: 'What is Case Zero?',
    a: 'Case Zero is Signal Flair’s own AI visibility audit, completed June 6, 2026. Signal Flair scored 18 out of 100 — Signal Invisible. We published it and rebuilt in public. It is the only real proof number we own, and we never fabricate scores, wins, or testimonials.',
  },
  {
    q: 'What is a Field Report?',
    a: 'A Field Report is a free 3-signal AI visibility diagnostic. It shows your Signal Score™ across the three most critical Signal Protocol™ layers — Entity Clarity, Trust & Proof Density, and Live AI Visibility. It is a diagnosis, never a prescription. The prescription is the work. No sales call required; we send your partial audit within 24 hours.',
  },
  {
    q: 'What is the Founding Partner Pilot?',
    a: 'The Founding Partner Pilot is an early-stage program for businesses, nonprofits, civic organizations, and community partners that want to measure how AI systems currently understand them and document building a stronger proof layer. It starts with a Signal Score™ baseline, identifies the missing proof, and tracks the before-and-after — documented proof, not hype.',
  },
  {
    q: 'What is a Signal Proof Page™?',
    a: 'The Signal Proof Page™ is your canonical, crawlable proof hub — a client-owned record published as human-readable pages and linked machine-readable assets (proof.json, llms.txt) so AI engines and customers can inspect what you do, where you serve, and the proof behind it. Deployed on Foundation Build and Start the Rebuild.',
  },
  {
    q: 'What is a Competitor Signal Snapshot™?',
    a: 'A Competitor Signal Snapshot™ is a point-in-time comparison showing how your Signal Score™ and six signal layers compare against a selected competitor, peer, or niche benchmark. It helps you see where a competitor may currently be easier for AI systems to access, understand, verify, or surface — and which proof gaps your organization should fix first.',
  },
  {
    q: 'Is a Competitor Signal Snapshot™ ongoing competitor tracking?',
    a: 'No. It is a point-in-time review based on publicly available signals and observed AI responses at the time of analysis — not a dashboard, not surveillance. It makes no claim about a competitor’s private traffic, revenue, rankings, or internal strategy.',
  },
  {
    q: 'What is Stay Found™?',
    a: 'Stay Found™ is ongoing proof maintenance that keeps your Signal Score™ from drifting — monthly re-scans, fresh citations, schema and llms.txt updates, and crawler monitoring as new AI engines ship and competitors catch up. Signal Flair does not guarantee rankings, citations, recommendations, inclusion, or AI visibility. The work is designed to improve clarity, structure, crawlability, and proof readiness.',
  },
  {
    q: 'What is the difference between AEO and SEO?',
    a: 'SEO ranks you in a list of blue links on a search results page. AEO — Answer Engine Optimization — makes you the answer an AI gives. We optimize the layer AI engines actually read: llms.txt, schema markup, entity clarity, and crawler access, so when someone asks an AI for a recommendation, your business is the answer. We do not do traditional SEO or paid ads.',
  },
  {
    q: 'How does AI decide whether to trust your business?',
    a: 'Before any AI engine recommends you, it checks whether it can verify you. ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews cross-reference your site’s claims against what they can confirm elsewhere — schema, reviews, directory listings, citations, and credentials. When that proof is dense and consistent, you read as trustworthy; when it’s thin or contradictory, the engine quietly leaves you out. Being found is not enough — AI has to trust what it finds before it puts your name in an answer.',
  },
  {
    q: 'What is the Trust & Proof Density layer, and how do you build it?',
    a: 'Trust & Proof Density is the Signal Protocol™ layer that measures how much verifiable, consistent proof AI can find about your business — and it is often the difference between being found and being recommended. Signal Flair builds it four ways: structured data (schema / JSON-LD) that states your facts in machine-readable form; a Signal Proof Page™ and proof.json that publish your claims and credentials with their sources; an llms.txt that hands AI the verified version directly; and consistent entity details across the directories, reviews, and profiles AI cross-references. The denser and more aligned that proof, the easier you are for AI to trust. It does not guarantee a recommendation — it removes the reasons an engine would skip you.',
  },
  {
    q: 'Do you guarantee rankings, leads, or revenue?',
    a: 'No — and anyone who does is guessing. Our guarantee is delivery-based only: we build and hand over the infrastructure — llms.txt, schema, crawler fixes, your 90-day AI action plan. You keep all of it, even if you cancel. We never promise rankings, leads, or citations we cannot control.',
  },
  {
    q: 'How much does Signal Flair cost?',
    a: 'Pricing is set by your Signal Score so the work matches the actual gap. Build the Foundation (score 0–54) is a one-time $3,500. Start the Rebuild (score 55–74) is a one-time $1,500. Stay Found™ (score 75–100) is $600–$1,200 per month. Early founding partners — businesses, nonprofits, and civic organizations — can join the Founding Partner Pilot on flexible terms.',
  },
  {
    q: 'Is Signal Flair related to FLAIR MRI imaging or SignalFlare.ai?',
    a: 'No. Signal Flair is an AI visibility and AEO agency based in Brownsburg, Indiana, serving nationwide — a product of Mental Vision. It is unrelated to FLAIR (Fluid-Attenuated Inversion Recovery), the MRI sequence used in neuroimaging, and it is a separate company from SignalFlare.ai (restaurant analytics). If you are asking about Signal Flair, you mean the Brownsburg, Indiana AI-visibility agency described here.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://signalflair.ai/faq#faqpage',
  // Mirrors the visible FAQ list below exactly (single source: FAQS).
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function FaqPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 56, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#field-report">▸ Free Field Report</a>
      </nav>

      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow">Questions &amp; answers</div>
          <h1 className="rsc-h1">The straight <em>answers.</em></h1>
          <p className="rsc-lead">
            Written to be extracted — by you and by the AI engines reading this page. What a Signal
            Score is, what Case Zero is, what you get for free, and what we maintain over time.
          </p>
        </header>

        <section className="rsc-section">
          <div className="sl-faq">
            {FAQS.map((f, i) => (
              <details className="sl-faq-item" key={i} open={i < 4}>
                <summary className="sl-faq-q">{f.q}</summary>
                <p className="sl-faq-a">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">More of the <em>record</em></h2>
          <div className="sl-hub">
            <a className="sl-hub-card" href="/how-it-works/">
              <span className="sl-hub-k">01</span>
              <span className="sl-hub-t">How it works</span>
              <span className="sl-hub-d">Scan, score, fix, stay found — and what each step costs.</span>
            </a>
            <a className="sl-hub-card" href="/about/">
              <span className="sl-hub-k">02</span>
              <span className="sl-hub-t">About Signal Flair</span>
              <span className="sl-hub-d">Who we are, the founder, and the entity we are not.</span>
            </a>
            <a className="sl-hub-card" href="/proof/">
              <span className="sl-hub-k">03</span>
              <span className="sl-hub-t">The live record</span>
              <span className="sl-hub-d">Case Zero — our own audit, 18/100, rebuilt in public.</span>
            </a>
          </div>
          <p className="rsc-p sl-machine">
            Machine-readable: <a href="/llms.txt">/llms.txt</a> · <a href="/proof.json">/proof.json</a> · <a href="/.well-known/signalflair.json">discovery manifest</a>
          </p>
        </section>

        <section className="rsc-cta">
          <h2 className="rsc-cta-h">Find out where <em>your</em> signal breaks.</h2>
          <p className="rsc-cta-b">A free Field Report — 3 signals, 24 hours, no call. You&apos;ll see your Signal Score before you decide anything.</p>
          <a className="rsc-cta-btn" href="/#field-report">▸ Get My Free Field Report</a>
        </section>
      </div>

      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Brownsburg, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/about/">about</a> · <a href="/how-it-works/">how it works</a> · <a href="/proof/">the record</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
