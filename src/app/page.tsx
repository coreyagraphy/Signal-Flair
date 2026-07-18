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
    q: 'What is a Signal Score™?',
    a: 'Your Signal Score™ is a 0–100 measure of how findable, readable, and recommendable your business is to AI engines — scored across the six layers of the Signal Protocol™: Access & Crawlability, Structured Intelligence, Entity Clarity, Answer Architecture, Trust & Proof Density, and Live AI Visibility. We run you through ChatGPT, Claude, Perplexity, Gemini, and Google AI, then show you the number and exactly what’s pulling it down.',
  },
  {
    q: 'What is AI Proof Infrastructure™?',
    a: 'AI Proof Infrastructure is the structured layer of business information, technical signals, trust proof, and public verification assets that helps AI answer engines understand and verify an organization. Signal Flair builds it — so ChatGPT, Claude, Gemini, Perplexity, and Google AI can access, understand, verify, and confidently recommend you.',
  },
  {
    q: 'What is a Signal Proof Page™?',
    a: 'A public, crawlable proof asset that shows your current Signal Score™, your proof-layer assets, trust signals, AI-visibility evidence, and a last-updated date — so both people and AI engines can verify you from one place. It stays fresh through Stay Found™ as your score climbs.',
  },
  {
    q: 'How is Signal Flair different from SEO and AEO?',
    a: 'SEO gets you ranked. AEO gets you quoted. Signal Flair makes sure the machines know who the hell they’re talking about. We work underneath both — connecting your website, structured data, profiles, images, video, public proof, and entity relationships so AI systems can connect the right information to the right organization. That’s AI Proof Infrastructure™.',
  },
  {
    q: 'What about my images, video, and profiles?',
    a: 'Answer engines meet your images, video, logo, channels, and profiles — not just your text. Signal Flair evaluates whether AI can discover, interpret, and correctly connect your full visual and media presence to your organization: image and video discoverability, voice-assistant answers, visual brand recognition, and creator and publisher attribution readiness. It evaluates readiness — not guaranteed rankings, recommendations, or citations.',
  },
  {
    q: 'How does AI decide whether to trust your business?',
    a: 'Before any AI engine recommends you, it checks whether it can verify you. ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews cross-reference your site’s claims against what they can confirm elsewhere — schema, reviews, directory listings, citations, and credentials. When that proof is dense and consistent, you read as trustworthy; when it’s thin or contradictory, the engine quietly leaves you out. That’s the Trust & Proof Density layer of the Signal Protocol™ — and it’s the layer Signal Flair builds: schema, a Signal Proof Page™, llms.txt, and aligned entity signals, so AI can trust what it finds, not just find you.',
  },
  {
    q: 'Do you guarantee rankings, leads, or revenue?',
    a: 'No — and anyone who does is guessing. Our guarantee is delivery-based only: we build and hand over the infrastructure — llms.txt, schema, crawler fixes, your 90-day plan. You keep all of it, even if you cancel. We never promise rankings, leads, or citations we can’t control.',
  },
  {
    q: 'How long does the Foundation Build take?',
    a: '7–14 days, not months. We scan, score, and install the full machine-readable layer — then hand you a 90-day AI action plan.',
  },
  {
    q: 'What happens when AI search changes?',
    a: 'It will — and often. That’s what Stay Found™ is for: recurring proof maintenance — monthly re-scans, fresh citations, schema and llms.txt updates, and crawler monitoring — to help keep your signal current as new engines ship and competitors catch up.',
  },
  {
    q: 'What is the Founding Partner Pilot?',
    a: 'An early-stage program for businesses, nonprofits, civic organizations, and community partners that want to measure how AI systems currently understand them — and document building a stronger proof layer. It starts with a Signal Score™ baseline, identifies the missing proof, and tracks the before-and-after. The goal is documented proof, not hype.',
  },
  {
    q: 'Is Signal Flair only for businesses?',
    a: 'No. Signal Flair supports businesses, nonprofits, civic organizations, and community-facing programs — anyone that needs to become easier for AI systems to access, understand, verify, and recommend.',
  },
  {
    q: 'Do I have to get on a sales call?',
    a: 'No. Request your free Field Report above — we scan 3 critical signals and send your partial audit within 24 hours. No pitch, no pressure. The ball stays in your court.',
  },
]

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
    </>
  )
}
