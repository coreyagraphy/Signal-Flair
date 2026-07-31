import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

export const metadata: Metadata = {
  title: 'FAQ — Signal Score, Case Zero, Signal Pulse & Signal Proof Page | Signal Flair',
  description:
    'Answers to the core Signal Flair questions: what a Signal Score™ is, what Case Zero (18/100, June 6 2026) is, what a free Signal Pulse™ includes, and the Founding Five. AI Proof Infrastructure for businesses and organizations nationwide.',
  alternates: { canonical: 'https://signalflair.ai/faq/' },
  openGraph: {
    title: 'Signal Flair — Frequently Asked Questions',
    description:
      'What is a Signal Score? What is Case Zero? What is a Signal Pulse™? What is a Signal Proof Page™? Straight answers, written to be extracted.',
    images: ['/video/hero-poster.jpg'],
  },
}

// ONE source of truth — feeds both the visible <details> list and the FAQPage schema.
// Google requires structured data to mirror the visible text exactly. Edit here only.
const FAQS: { q: string; a: string }[] = [
  {
    q: 'What is a Signal Score™?',
    a: 'A Signal Score™ is a number from 0 to 100, produced by the Signal Protocol™ across seven layers — Access & Crawlability, Structured Intelligence, Entity Clarity, Answer Architecture, Trust & Proof Density, Live AI Visibility, and Agent & Commerce Readiness — that measures how visible and trustworthy your business appears to AI search engines like ChatGPT, Perplexity, Google AI, and Gemini. Most local businesses score under 40 and don’t know it.',
  },
  {
    q: 'What is AI Proof Infrastructure™?',
    a: 'AI Proof Infrastructure is the structured layer of business information, technical signals, trust proof, and public verification assets that helps AI answer engines understand and verify an organization. Signal Flair builds it — not just an audit, but the proof layer that makes you easier for ChatGPT, Claude, Gemini, Perplexity, and Google AI to access, understand, verify, and recommend.',
  },
  {
    q: 'How is Signal Flair different from SEO and AEO?',
    a: 'SEO gets you ranked. AEO — Answer Engine Optimization — gets you quoted. Signal Flair makes sure the machines know who the hell they’re talking about. We work underneath both — connecting your website, structured data, profiles, images, video, public proof, and entity relationships so AI systems can connect the right information to the right organization. That’s AI Proof Infrastructure™.',
  },
  {
    q: 'What does Signal Flair evaluate beyond my website?',
    a: 'Your website is only one witness. AI systems also encounter social profiles, founder information, images, videos, platform channels, third-party references, public proof, and structured data. Signal Flair examines whether those signals agree, support the same claims, and point back to the correct organization.',
  },
  {
    q: 'What is evidence coherence?',
    a: 'Evidence coherence means the organization’s public signals tell the same factual story. The website, profiles, images, video, proof, company information, and founder relationships should reinforce one another instead of giving machines conflicting versions of the organization. The moat is not more content. It is evidence that agrees.',
  },
  {
    q: 'Does Signal Flair evaluate images and video?',
    a: 'Yes, when they are relevant to the organization’s public presence. Signal Flair examines whether important images, videos, channels, transcripts, publisher references, and creator relationships can be discovered, understood, attributed, and connected to the correct entity. Signal Flair does not judge whether the creative is attractive — it evaluates whether machines can identify what the media belongs to.',
  },
  {
    q: 'Does Signal Flair authenticate media or verify creators?',
    a: 'No. Signal Flair does not certify legal identity, decide copyright ownership, detect deepfakes, or claim that it can prove whether media was AI-generated. Signal Flair evaluates attribution readiness: whether public evidence connects an image, video, channel, creator, publisher, and organization clearly enough for machines to resolve the relationship.',
  },
  {
    q: 'Can AI find and understand my images?',
    a: 'Answer engines increasingly surface and reason over images. Signal Flair evaluates whether your important images are crawlable, described, and connected to your organization — so AI can find them, read what they show, and attribute them to you rather than a look-alike. It evaluates image discoverability and understanding readiness; it does not guarantee image-search rankings.',
  },
  {
    q: 'Will voice assistants answer about my business correctly?',
    a: 'Only if your facts are clear and consistent across the surfaces assistants draw from. Signal Flair evaluates whether your organization’s information is legible and non-contradictory enough for a voice assistant to answer about you correctly. It does not guarantee that any assistant will feature you.',
  },
  {
    q: 'Do you help my videos or channel get found?',
    a: 'Signal Flair evaluates video and channel discoverability readiness — whether your videos, channels, transcripts, captions, and website-to-channel relationships let AI surface and correctly attribute them. It does not run your channel, post content, or guarantee recommendations or placements.',
  },
  {
    q: 'What is Case Zero?',
    a: 'Case Zero is Signal Flair’s own AI visibility audit, completed June 6, 2026. Signal Flair scored 18 out of 100 — Signal Invisible. We published it and rebuilt in public. It is the only real proof number we own, and we never fabricate scores, wins, or testimonials.',
  },
  {
    q: 'What is a Signal Pulse™?',
    a: 'A Signal Pulse™ is a free instant-preview diagnostic across 3 of your 7 Signal Protocol™ layers — Entity Clarity, Trust & Proof Density, and Live AI Visibility. It is a diagnosis, never a prescription. The prescription is the work. No sales call required; we send your preview within 24 hours, and the full 7-layer Signal Score™ Audit is free during the founding period ($500 after).',
  },
  {
    q: 'What is the Founding Five?',
    a: 'The Founding Five is Signal Flair’s founding cohort — exactly five seats. Members get 35% off their build and their first 3 months of Signal Proof at 50%, in exchange for permission to publish a named before-and-after case study. Documented proof, not hype.',
  },
  {
    q: 'What are Signal Satellites™?',
    a: 'Signal Satellites™ are lean, per-location micro-sites — each with its own Machine Trust Layer™, Entity Lock™, and Answer Architecture™ — so every branch gets found and cited in its own market instead of hiding behind one homepage. $1,500 per Satellite build (included when you add a location to a build), managed under Signal Dominate, or +$250/mo per Satellite on Signal Proof.',
  },
  {
    q: 'Do you offer a CRM?',
    a: 'No. Signal Flair is AI-visibility infrastructure — we don’t sell or replace a CRM. We build and maintain the layer AI engines read; your CRM, booking, and sales tools stay yours.',
  },
  {
    q: 'What is a Signal Proof Page™?',
    a: 'The Signal Proof Page™ is your canonical, crawlable proof hub — a client-owned record published as human-readable pages and linked machine-readable assets (proof.json, llms.txt) so AI engines and customers can inspect what you do, where you serve, and the proof behind it. Deployed with every build — Rebuild and Foundation Build.',
  },
  {
    q: 'What is Stay Found™?',
    a: 'Stay Found™ is ongoing proof maintenance that keeps your Signal Score™ from drifting — monthly re-scans, fresh citations, schema and llms.txt updates, and crawler monitoring as new AI engines ship and competitors catch up. Signal Flair does not guarantee rankings, citations, recommendations, inclusion, or AI visibility. The work is designed to improve clarity, structure, crawlability, and proof readiness.',
  },
  {
    q: 'What happens to my assessment after it is completed?',
    a: 'We keep the receipts. Signal Flair preserves the date, assessment type, Signal Score™, layer-by-layer breakdown, findings, and supporting evidence instead of replacing the old record with the newest number. Later assessments can show what changed across the website, profiles, images, video, public proof, and entity relationships — and what is still sending mixed messages.',
  },
  {
    q: 'Does Signal Flair track changes over time?',
    a: 'Yes. Repeated assessments compare against the ones before them, so you can see what machines saw before, what improved, which signals moved, and where your organization still sends mixed messages. Under Stay Found™ that history is kept current. Signal Flair does not guarantee rankings, citations, or recommendations.',
  },
  {
    q: 'Are previous Signal Scores overwritten?',
    a: 'No. Signal Flair maintains historical context rather than rewriting it — earlier Signal Scores and their supporting evidence are preserved so the before-and-after stays inspectable. The methodology is designed to become more useful as verified history accumulates.',
  },
  {
    q: 'How does Signal Flair use assessment history?',
    a: 'Private assessment history stays attached to the organization it belongs to. Signal Flair does not sell raw client or prospect records, publish private evidence, or train foundation models on private assessment data. Prior assessments are preserved so your organization can compare future reviews against them.',
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
    a: 'The Signal Pulse™ is free, and the full Signal Score™ Audit is free during the founding period ($500 after). Builds are one-time, scoped by the audit: Rebuild is $3,000; the Foundation Build is $5,500 — or $3,500 bundled with a 12-month Signal Proof plan (save $2,000). Stay Found™ monthly plans: Signal Proof is $1,800/mo and Signal Dominate starts at $3,500/mo. Add a location for $1,500, Satellite included. You keep everything built, even if you cancel.',
  },
  {
    q: 'Is Signal Flair related to FLAIR MRI imaging or SignalFlare.ai?',
    a: 'No. Signal Flair is an AI Proof Infrastructure company based in Indianapolis, Indiana, serving nationwide — a product of Mental Vision, and the evidence layer underneath SEO and AEO. It is unrelated to FLAIR (Fluid-Attenuated Inversion Recovery), the MRI sequence used in neuroimaging, and it is a separate company from SignalFlare.ai (restaurant analytics). If you are asking about Signal Flair, you mean the Indianapolis, Indiana AI Proof Infrastructure company described here.',
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
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 70, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#field-report">▸ Free Signal Pulse™</a>
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
          <p className="rsc-cta-b">A free Signal Pulse™ — 3 of your 7 signal layers, 24 hours, no call. You&apos;ll see your Signal Score before you decide anything.</p>
          <a className="rsc-cta-btn" href="/#field-report">▸ Run My Signal</a>
        </section>
      </div>

      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Indianapolis, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/about/">about</a> · <a href="/how-it-works/">how it works</a> · <a href="/proof/">the record</a> · <a href="/privacy/">privacy</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
