import type { Metadata } from 'next'
import SignalFlairLanding from '@/components/SignalFlairLanding'

export const metadata: Metadata = {
  alternates: { canonical: 'https://signalflair.ai/' },
}

// FAQPage schema for the homepage. MUST mirror the visible #faq section in
// SignalFlairLanding.tsx exactly (Google requires structured data to match visible text).
// If you edit a homepage FAQ answer, update the matching entry here.
const HOMEPAGE_FAQ: { q: string; a: string }[] = [
  {
    q: 'What does Signal Flair do?',
    a: 'Signal Flair builds The Proof Stack™ — the full infrastructure layer AI reads before it recommends you. We measure how ChatGPT, Claude, Perplexity, Gemini, and Google AI understand your business with a 0–100 Signal Score™, build the machine-readable proof they’re missing, and keep it current — so you show up by design, not by luck.',
  },
  {
    q: 'What is a Signal Score™?',
    a: 'Your Signal Score™ is a 0–100 measure of how findable, readable, and recommendable your business is to AI engines — scored across the seven layers of the Signal Protocol™: Access & Crawlability, Structured Intelligence, Entity Clarity, Answer Architecture, Trust & Proof Density, Live AI Visibility, and Agent & Commerce Readiness. We run you through ChatGPT, Claude, Perplexity, Gemini, and Google AI, then show you the number and exactly what’s pulling it down.',
  },
  {
    q: 'How much does Signal Flair cost?',
    a: 'Signal Pulse™ is free. The full Signal Score™ Audit is free during the founding period ($500 after). Builds are one-time: Rebuild is $3,000; the Foundation Build is $5,500 — or $3,500 when you bundle it with a 12-month Signal Proof plan (save $2,000). Stay Found™ monthly plans: Signal Proof is $1,800/mo and Signal Dominate starts at $3,500/mo. Add a location for $1,500, Satellite included. You keep everything built, even if you cancel.',
  },
  {
    q: 'Why is there a monthly plan?',
    a: 'Because AI search is a moving target. New engines ship, models retrain, competitors catch up, and AI agents are arriving. Stay Found™ plans — Signal Proof and Signal Dominate — run Citation Capture, expand your Answer Architecture™ monthly, compound proof with the Proof Density Engine, and watch drift with Signal Telemetry. And every month ships your Content Payload: premium, done-for-you content engineered for humans and machines — AEO-optimized with machine-readable metadata, including a 30-second commercial — so the foundation you built keeps earning citations.',
  },
  {
    q: 'What are Signal Satellites™?',
    a: 'Signal Satellites™ are lean, per-location micro-sites — each with its own Machine Trust Layer™, Entity Lock™, and Answer Architecture™ — so every branch gets found and cited in its own market instead of hiding behind one homepage. $1,500 per Satellite build (included when you add a location to a build), managed under Signal Dominate, or +$250/mo per Satellite on Signal Proof.',
  },
  {
    q: 'Do you guarantee #1 in ChatGPT?',
    a: 'No — and be wary of anyone who says yes. Nobody controls what an AI engine answers. Our guarantee is delivery-based only: we build and hand over The Proof Stack™ — the Model Ingestion Manifest, Machine Trust Layer™, crawl fixes, and your 90-day plan. You keep all of it, even if you cancel. We never promise rankings, leads, or citations we can’t control.',
  },
  {
    q: 'How fast does it move?',
    a: 'Access fixes land in days. The Signal Score™ typically starts moving within about 14 days of the build, and the compounding work — citations, proof density, authority — runs across the first 90. That’s readiness moving, not a placement promise: we never guarantee rankings or recommendations.',
  },
  {
    q: 'Who is Signal Flair for?',
    a: 'Local service businesses, multi-location brands, nonprofits, and civic organizations — anyone that needs AI systems to access, understand, verify, and recommend them. If customers ask AI before they call, this is for you.',
  },
  {
    q: 'Do you offer a CRM?',
    a: 'No. Signal Flair is AI-visibility infrastructure — we don’t sell or replace a CRM. We build and maintain the layer AI engines read; your CRM, booking, and sales tools stay yours.',
  },
  {
    q: 'What makes Signal Flair different?',
    a: 'SEO gets you ranked. AEO gets you quoted. Signal Flair makes sure the machines know who the hell they’re talking about. We build the proof infrastructure beneath both — The Proof Stack™: structured facts machines can verify (Machine Trust Layer™), one identity everywhere (Entity Lock™), content shaped for extraction (Answer Architecture™), and compounding third-party proof — so AI systems connect the right information to the right organization.',
  },
  {
    q: 'What is a Signal Proof Page™?',
    a: 'A public, crawlable proof asset that shows your current Signal Score™, your proof-layer assets, trust signals, AI-visibility evidence, and a last-updated date — so both people and AI engines can verify you from one place. It stays fresh through Stay Found™ as your score climbs.',
  },
  {
    q: 'How does AI decide whether to trust your business?',
    a: 'Before any AI engine recommends you, it checks whether it can verify you. ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews cross-reference your site’s claims against what they can confirm elsewhere — structured data, reviews, directory listings, citations, and credentials. When that proof is dense and consistent, you read as trustworthy; when it’s thin or contradictory, the engine quietly leaves you out. That’s the Trust & Proof Density layer of the Signal Protocol™ — and it’s the layer Signal Flair builds, so AI can trust what it finds, not just find you.',
  },
  {
    q: 'Do I have to get on a sales call?',
    a: 'No. Run the free Signal Pulse™ and we will send the preview within 24 hours. If you want the full Signal Score™ after that, say so. No forced call. The ball stays in your court.',
  },
]

// VideoObject for the homepage one-minute explainer. Describes only what the
// video visibly contains; transcript mirrors the WebVTT track exactly.
const videoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  '@id': 'https://signalflair.ai/#one-minute-explainer',
  name: 'The One-Minute Version — SEO vs AEO vs Signal Flair',
  description:
    'A one-minute animated explainer: SEO gets you found in a list, AEO gets you used in an answer, and Signal Flair gets you verified — the proof infrastructure AI systems check before they recommend a business.',
  thumbnailUrl: 'https://signalflair.ai/media/signalflair-one-minute-explainer-poster.webp',
  contentUrl: 'https://signalflair.ai/media/signalflair-one-minute-explainer.mp4',
  uploadDate: '2026-07-23',
  duration: 'PT1M14S',
  inLanguage: 'en-US',
  publisher: { '@id': 'https://signalflair.ai/#org' },
  transcript:
    "Somewhere right now, a customer just asked ChatGPT to pick a company like yours — and ChatGPT picked somebody. The question is whether it even knew you exist. Search engines stopped handing out lists and started handing out answers. SEO ranks you in a list; AEO makes you the answer. But here's what nobody tells you: being readable isn't being believable. An AI can quote your website and still refuse to recommend your business. Machines cross-reference. If your address disagrees with your listing and your reviews float around unattached, the machine doesn't argue — it moves on. This is where SignalFlair wins. Instead of guessing, it measures — a Signal Score from zero to one hundred, showing exactly how visible and trustworthy you look to AI. The fix is infrastructure, not vibes: a crawlable Signal Proof page, machine-readable files like llms.txt and proof.json — assets an AI can actually inspect. So: SEO gets you found in a list, AEO gets you used in an answer, and SignalFlair gets you verified — the part the other two depend on. Because AI doesn't warn you before it checks. Stay ready, so you don't have to get ready.",
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://signalflair.ai/#faq',
  mainEntity: HOMEPAGE_FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function Home() {
  return (
    <>
      <SignalFlairLanding />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />
    </>
  )
}
