import SignalFlairLanding from '@/components/SignalFlairLanding'

// FAQPage schema for the homepage. MUST mirror the visible #faq section in
// SignalFlairLanding.tsx exactly (Google requires structured data to match visible text).
// If you edit a homepage FAQ answer, update the matching entry here.
const HOMEPAGE_FAQ: { q: string; a: string }[] = [
  {
    q: 'What is a Signal Score™?',
    a: 'Your Signal Score™ is a 0–100 measure of how findable, readable, and recommendable your business is to AI engines — scored across the six layers of the Signal Protocol™: Access, Structure, Entity, Architecture, Trust, and Live Visibility. We run you through ChatGPT, Claude, Perplexity, Gemini, and Google AI, then show you the number and exactly what’s pulling it down.',
  },
  {
    q: 'How is this different from SEO?',
    a: 'SEO optimizes for blue links on a results page. We optimize for the layer AI engines actually read — llms.txt, schema, crawler access — so when someone asks an AI for a recommendation, your business is the answer. Different machine, different rules. We don’t do traditional SEO or paid ads.',
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
    a: 'It will — and often. That’s what the Stay Found System is for: monthly re-scans, fresh citations, schema and llms.txt updates, and crawler monitoring so your signal stays strong as new engines ship and competitors catch up.',
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
