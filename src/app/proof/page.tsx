import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'
import VerifiedMark from '@/components/VerifiedMark'

export const metadata: Metadata = {
  title: 'Our Live Verified Record — Case Zero | Signal Flair',
  description:
    'Signal Flair published its Signal Proof Page™ on itself first. This is our live, continuously re-verified record — Case Zero, 18/100, audited June 6, 2026 — with a public change log tracked to target. We don’t claim. We show.',
  alternates: { canonical: 'https://signalflair.ai/proof/' },
  openGraph: {
    title: 'Case Zero — Signal Flair’s own live verified record',
    description:
      'We audited ourselves first: 18/100 on June 6, 2026. The full record, source-linked, with a public change log.',
    images: ['/video/hero-poster.jpg'],
  },
}

// Case Zero — REAL baseline (June 6, 2026). Mirrors /proof.json exactly.
const CASE_ZERO = {
  overall: 18,
  scoredOn: '2026-06-06',
  target: 91,
  signals: [
    { signal: 'AI Search Presence', score: 4, status: 'Critical' },
    { signal: 'Entity Clarity', score: 5, status: 'Critical' },
    { signal: 'Crawl Readiness', score: 35, status: 'Needs work' },
    { signal: 'Authority Content', score: 12, status: 'Weak' },
    { signal: 'Review Signal', score: 0, status: 'Missing' },
    { signal: 'Conversion Proof', score: 20, status: 'Partial' },
  ],
}

// AEO-vs-SEO doctrine — the on-site definition AI summarizes (comparison tables are the
// single most-cited content format). Addresses the audit's "Authority Content: Pending".
const DOCTRINE: [string, string, string][] = [
  ['The goal', 'Rank in a list of links', 'Get extracted and cited inside the answer'],
  ['The surface', 'Google results page', 'ChatGPT, Claude, Gemini, Perplexity, AI Overviews'],
  ['What wins', 'Backlinks, keywords, page rank', 'Entity clarity, structure, citable proof'],
  ['Unit of victory', 'A click', 'A recommendation made before the click'],
  ['Worst failure', 'Page two', 'Being mistaken for something else entirely'],
  ['How you’re read', 'By a ranking algorithm', 'By a model that has to trust and summarize you'],
]

// FAQ — ONE source of truth for both the visible section and the FAQPage schema (they must
// mirror exactly). Q2 names the medical-FLAIR entity collision head-on (the audit's #1 finding).
const FAQS: { q: string; a: string }[] = [
  {
    q: 'What is Signal Flair?',
    a: 'Signal Flair is an AI Proof Infrastructure company based in Indianapolis, Indiana, serving businesses and organizations nationwide — the evidence layer underneath SEO and AEO. It measures how clearly AI answer engines — ChatGPT, Claude, Gemini, Perplexity, and Google AI Overviews — can access, understand, verify, and connect a business to the right organization, then builds the missing proof. Signal Flair is a product of Mental Vision.',
  },
  {
    q: 'Is Signal Flair related to FLAIR MRI imaging?',
    a: 'No. Signal Flair is an AI Proof Infrastructure company, not a medical term. It is unrelated to FLAIR (Fluid-Attenuated Inversion Recovery), the MRI pulse sequence used in neuroimaging. If you are asking about Signal Flair, you mean the Indianapolis, Indiana AI-visibility company described here. It is also a separate company from SignalFlare.ai.',
  },
  {
    q: 'What is the difference between AEO and SEO?',
    a: 'SEO ranks you in a list of links; AEO makes you the answer an AI gives. Traditional SEO optimizes for blue-link rankings on a search results page. AEO optimizes an entity and its content so AI systems can extract, trust, and cite it directly inside generated answers — often before any link is clicked.',
  },
  {
    q: 'What is a Signal Proof Page™?',
    a: 'The Signal Proof Page™ is the maintained verification layer behind Signal Flair: a client-owned, continuously re-verified record of your business — published as crawlable pages and machine-readable data — so AI engines and customers can inspect what you do, where you serve, and the proof behind it. It is deployed once on Foundation Build or Start the Rebuild.',
  },
  {
    q: 'What is Stay Found™?',
    a: 'Stay Found™ is monthly proof maintenance — re-verification, change-log updates, schema and llms.txt freshness, and crawler monitoring so your record does not drift. Signal Flair does not guarantee rankings, citations, recommendations, inclusion, or AI visibility.',
  },
  {
    q: 'How does the Signal Flair score work?',
    a: 'Signal Flair rates a business 0–100 with the Signal Protocol™ across seven layers: Access & Crawlability, Structured Intelligence, Entity Clarity, Answer Architecture, Trust & Proof Density, Live AI Visibility, and Agent & Commerce Readiness. The resulting Signal Score™ Audit sets the scope — a build, a rebuild, or ongoing maintenance — so the work matches the actual gap, never a score gate.',
  },
  {
    q: 'Does Signal Flair guarantee placement in ChatGPT or Google AI Overviews?',
    a: 'No. No one can guarantee AI placement. Signal Flair improves verified facts, crawlable evidence, and agent access, and measures visibility movement across AI engines. Our guarantee is delivery-based only — never rankings, leads, or revenue.',
  },
]

// schema.org JSON-LD — matches the visible text on this hub (Google requirement).
// Review/AggregateRating intentionally omitted: Case Zero Review Signal = 0/100. Never faked.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': 'https://signalflair.ai/#org',
      name: 'Signal Flair',
      url: 'https://signalflair.ai',
      parentOrganization: { '@type': 'Organization', name: 'Mental Vision' },
      description:
        'Signal Flair builds AI Proof Infrastructure — the structured proof layer that helps AI answer engines access, understand, verify, and recommend a business. We publish and continuously re-verify a living record clients own that AI engines and customers can inspect.',
      areaServed: { '@type': 'Country', name: 'United States' },
      knowsAbout: [
        'AI Proof Infrastructure',
        'AI search visibility',
        'answer engine optimization',
        'local reputation',
        'schema markup',
        'AI Agent Readiness',
      ],
    },
    {
      '@type': 'Service',
      serviceType: 'Foundation Build — Signal Proof Page™',
      provider: { '@id': 'https://signalflair.ai/#org' },
      areaServed: { '@type': 'Country', name: 'United States' },
      description:
        'One-time deployment of Signal Proof Page™ and machine-readable proof assets: crawlable proof pages, matching schema, verified record, and forward-compatible surfaces.',
    },
    {
      '@type': 'FAQPage',
      // Mirrors the visible FAQ section below exactly (single source: FAQS).
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

export default function ProofHubPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 70, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#field-report">▸ Free Signal Pulse™</a>
      </nav>

      <div className="rsc-wrap">
        <header className="rsc-hero">
          <div className="rsc-eyebrow">The live record · Case Zero</div>
          <h1 className="rsc-h1">Our own <em>verified record.</em></h1>
          <p className="rsc-lead">
            The Signal Proof Page™ is the maintained verification layer behind Signal Flair. We built
            ours first as Case Zero. This page is the real thing — the same deliverable every client
            gets, kept current and source-linked. We don&apos;t claim. We show.
          </p>
          <div className="sl-markwrap">
            <VerifiedMark
              lastVerified={CASE_ZERO.scoredOn}
              confirmed={0}
              total={6}
              note="Case Zero — our own record at the start. The climb is public."
            />
          </div>
        </header>

        {/* Case Zero score */}
        <section className="rsc-section">
          <h2 className="rsc-h2">Case Zero — <em>18 / 100</em></h2>
          <p className="rsc-p">
            Audited <strong>June 6, 2026</strong>. A premium-looking site with near-zero AI
            visibility — the exact gap we fix. Documented transparently and re-measured at Day 30 and
            Day 90, tracked to a target of <strong>{CASE_ZERO.target}/100</strong>.
          </p>
          <div className="sl-scoreband">
            <div className="sl-scorebig">{CASE_ZERO.overall}<small>/100</small></div>
            <div className="sl-scorearrow" aria-hidden="true">→</div>
            <div className="sl-scoretarget">{CASE_ZERO.target}<small>/100</small><span className="sl-scoretarget-lbl">Target</span></div>
          </div>
          <div className="sl-signals">
            {CASE_ZERO.signals.map((s) => (
              <div className="sl-sig" key={s.signal}>
                <span className="sl-sig-name">{s.signal}</span>
                <span className="sl-sig-bar" aria-hidden="true"><span className="sl-sig-fill" style={{ width: `${s.score}%` }} /></span>
                <span className="sl-sig-score">{s.score}<small>/100</small></span>
                <span className={`sl-sig-status ${s.score < 10 ? 'crit' : s.score < 50 ? 'warn' : 'ok'}`}>{s.status}</span>
              </div>
            ))}
          </div>
          <p className="rsc-p sl-honest">
            <strong>Zero signals independently confirmed at baseline.</strong> That is honest — it&apos;s
            where every record starts before the work. Each one we verify against a real source moves
            the count up, on the public <a href="/proof/changelog/">change log</a>.
          </p>
        </section>

        {/* What this is */}
        <section className="rsc-section">
          <h2 className="rsc-h2">What this record is</h2>
          <p className="rsc-p">
            A client-owned, continuously re-verified record of your business — published as crawlable
            pages and machine-readable data — so AI engines and customers can inspect what you do,
            where you serve, and the proof behind it. Installed once on the Foundation Build, then
            re-verified, dated, and updated every month under Stay Found™.
          </p>
          <ul className="rsc-ul">
            <li><strong>Verified, not claimed</strong> — every fact carries a cited source or is marked unverified. Never stamped without proof.</li>
            <li><strong>Dated &amp; current</strong> — a real last-verified date and a public change log. It doesn&apos;t drift back.</li>
            <li><strong>Inspection-ready</strong> — crawlable HTML first, with forward-compatible machine surfaces for agent-assisted experiences.</li>
          </ul>
          <p className="rsc-p">
            Signal Flair does not guarantee rankings, citations, recommendations, inclusion, or AI
            visibility. The work is designed to improve clarity, structure, crawlability, and proof
            readiness — and we measure visibility movement without promising outcomes.
          </p>
        </section>

        {/* AEO vs SEO doctrine — the on-site definition AI summarizes */}
        <section className="rsc-section">
          <h2 className="rsc-h2">AEO is not <em>SEO.</em></h2>
          <p className="rsc-p">SEO helps businesses rank. AI visibility determines whether machines can understand, trust, and use their information. Signal Flair builds the missing proof layer — underneath both, not instead of either. Answer Engine Optimization makes you the answer an AI gives; Search Engine Optimization makes you a blue link a human might click. They complement each other.</p>
          <div className="sl-doctrine-wrap">
            <table className="sl-doctrine">
              <thead><tr><th>Dimension</th><th>Classic SEO</th><th>AEO · Signal Flair</th></tr></thead>
              <tbody>
                {DOCTRINE.map((r) => (
                  <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ — extractable answers + entity disambiguation (mirrors FAQPage schema) */}
        <section className="rsc-section">
          <h2 className="rsc-h2">Straight <em>answers.</em></h2>
          <p className="rsc-p">Written to be extracted. The second one names the collision head-on — so AI stops confusing us with an MRI sequence.</p>
          <div className="sl-faq">
            {FAQS.map((f, i) => (
              <details className="sl-faq-item" key={i} open={i === 0}>
                <summary className="sl-faq-q">{f.q}</summary>
                <p className="sl-faq-a">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Hub navigation */}
        <section className="rsc-section">
          <h2 className="rsc-h2">The full record</h2>
          <div className="sl-hub">
            <a className="sl-hub-card" href="/proof/services/">
              <span className="sl-hub-k">01</span>
              <span className="sl-hub-t">Services &amp; areas</span>
              <span className="sl-hub-d">What we do, where we serve, on what basis — each source-linked.</span>
            </a>
            <a className="sl-hub-card" href="/proof/trust/">
              <span className="sl-hub-k">02</span>
              <span className="sl-hub-t">Trust evidence</span>
              <span className="sl-hub-d">Operator, parent company, and the review-signal gap — shown honestly.</span>
            </a>
            <a className="sl-hub-card" href="/proof/proof/">
              <span className="sl-hub-k">03</span>
              <span className="sl-hub-t">Proof &amp; cases</span>
              <span className="sl-hub-d">Real, dated records only — Case Zero, plus The Mill, our first client baseline (published with permission).</span>
            </a>
            <a className="sl-hub-card" href="/proof/changelog/">
              <span className="sl-hub-k">04</span>
              <span className="sl-hub-t">Change log</span>
              <span className="sl-hub-d">What was verified or updated, and when. The dated public record.</span>
            </a>
          </div>
          <p className="rsc-p sl-machine">
            Machine-readable: <a href="/proof.json">/proof.json</a> · <a href="/.well-known/signalflair.json">discovery manifest</a> · <a href="/llms.txt">llms.txt</a>
          </p>
        </section>

        <section className="rsc-cta">
          <h2 className="rsc-cta-h">Want a record like this for <em>your</em> business?</h2>
          <p className="rsc-cta-b">Start with a free Signal Pulse™ — 3 of your 7 signal layers, 24 hours, no call. You&apos;ll see exactly where your signal breaks before you decide anything.</p>
          <a className="rsc-cta-btn" href="/#field-report">▸ Run My Signal</a>
        </section>
      </div>

      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Indianapolis, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/proof.json">/proof.json</a> · <a href="/proof/changelog/">change log</a> · <a href="/privacy/">privacy</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
