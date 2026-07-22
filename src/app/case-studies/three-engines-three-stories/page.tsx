import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

export const metadata: Metadata = {
  title: 'AI Found The Mill — But Told Three Different Stories | Signal Flair',
  description:
    'A real Signal Flair (Proof OS™) AI-visibility audit of The Mill / Amplify Bloomington. It appeared in ChatGPT, Gemini, and Perplexity — and each engine told a different, incomplete story. Baseline Signal Score™ 35/100, with a phased plan to fix it.',
  alternates: { canonical: 'https://signalflair.ai/case-studies/three-engines-three-stories/' },
  openGraph: {
    title: 'AI Found The Mill — But Told Three Different Stories',
    description:
      'One business. Three AI engines. Three different identities. A real baseline Signal Baseline™ audit of The Mill / Amplify Bloomington — showing up by luck, not by design.',
  },
}

// Named case study — published with the client's permission (recorded 2026-07-21).
// Baseline audit only: no remediation has been performed, no improvement is claimed.
// See ANONYMIZED_BASELINE_CASE_INTERNAL.md (repo root, not exported) for history.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://signalflair.ai/case-studies/three-engines-three-stories#article',
      headline: 'AI Found The Mill — But Told Three Different Stories',
      description:
        'A real Signal Flair Proof OS™ AI-visibility audit of The Mill / Amplify Bloomington: it appeared in ChatGPT, Gemini, and Perplexity, and each engine presented a different, incomplete identity. Baseline Signal Score™ 35/100.',
      datePublished: '2026-07-21',
      dateModified: '2026-07-21',
      author: { '@id': 'https://signalflair.ai/#org' },
      publisher: { '@id': 'https://signalflair.ai/#org' },
      about: { '@type': 'Organization', name: 'The Mill', url: 'https://amplifybloomington.org/the-mill' },
      isPartOf: { '@id': 'https://signalflair.ai/#website' },
      mainEntityOfPage: 'https://signalflair.ai/case-studies/three-engines-three-stories/',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://signalflair.ai/case-studies/three-engines-three-stories#webpage',
      url: 'https://signalflair.ai/case-studies/three-engines-three-stories/',
      name: 'AI Found The Mill — But Told Three Different Stories | Signal Flair',
      isPartOf: { '@id': 'https://signalflair.ai/#website' },
      about: { '@id': 'https://signalflair.ai/#org' },
    },
  ],
}

// 7-signal breakdown — live-fetched from the site's own source on the audit date.
const SIGNALS: { n: string; name: string; score: string; note: string }[] = [
  { n: '01', name: 'Crawler Access', score: '15', note: 'robots.txt blanket-disallows the major AI training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot + more). Regular Googlebot is not blocked.' },
  { n: '02', name: 'llms.txt / AI Guidance', score: '10', note: '/llms.txt returns a 404 — no AI-readable map telling engines what matters and how to cite it.' },
  { n: '03', name: 'Structured Data', score: '30', note: 'No hand-written meta description; og:type set to article; no LocalBusiness, FAQ, or Event JSON-LD schema.' },
  { n: '04', name: 'Entity Clarity', score: '35', note: 'Brand split across amplifybloomington.org and the still-live legacy dimensionmill.org; directories still read "Dimension Mill."' },
  { n: '05', name: 'Structured Content', score: '52', note: 'Clean H2/H3 hierarchy, but no answer-shaped FAQ content and key images missing alt text.' },
  { n: '06', name: 'Technical SEO Foundation', score: '66', note: 'Yoast, 8 XML sitemaps, canonicals, custom post types, mobile theme. The strongest signal — a genuinely solid base.' },
  { n: '07', name: 'Authority & Citations', score: '44', note: 'Strong launch earned media, but on a new domain — authority not yet consolidated from the legacy site.' },
]

export default function ThreeEnginesCaseStudy() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 70, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#cta">▸ Get Your Signal Score™</a>
      </nav>

      <div className="rsc-wrap">
        {/* 1 · HERO */}
        <header className="rsc-hero">
          <div className="rsc-eyebrow">Real-World AI Visibility Audit</div>
          <h1 className="rsc-h1">
            AI found The Mill — but told <em>three different stories.</em>
          </h1>
          <p className="rsc-lead">
            Signal Flair ran a Proof OS™ audit on The Mill — the coworking and event space at the center of
            Amplify Bloomington. It appeared in ChatGPT, Gemini, and Perplexity — and each engine described a
            different, incomplete version of the business. It isn&apos;t losing the ranking game. It&apos;s showing up
            by luck, not by design, in the engines that now answer for it.
          </p>
          <div className="rsc-ctarow" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
            <a className="rsc-navcta" href="/#cta">▸ See What AI Understands About Your Business</a>
          </div>
        </header>

        {/* 2 · SNAPSHOT */}
        <section className="rsc-section">
          <div className="sl-rec">
            <div className="sl-rec-h">
              <span className="sl-rec-name">Audit at a glance</span>
              <span className="sl-verified">Baseline · used with permission</span>
            </div>
            <p className="rsc-p">
              This is a real Proof OS™ audit, published with The Mill&apos;s permission. Every score was
              live-fetched from the site&apos;s own source on the audit date — robots.txt, sitemaps, headers,
              metadata, and on-page structure — not from memory or a dashboard estimate. It is a baseline: no
              remediation has been performed yet, and no improvement is claimed.
            </p>
            <div className="sl-kv"><span>Subject</span><span>The Mill — coworking &amp; event space, flagship of Amplify Bloomington · Bloomington, IN</span></div>
            <div className="sl-kv"><span>Deliverable</span><span>Proof OS™ Signal Baseline™ — seven-signal AI &amp; search visibility audit</span></div>
            <div className="sl-kv"><span>Engines validated live</span><span>ChatGPT · Perplexity · Gemini</span></div>
            <div className="sl-kv"><span>Baseline Signal Score™</span><span>35 / 100 — showing up by luck, not by design</span></div>
            <div className="sl-kv"><span>AI Visibility Foundation</span><span>22 / 100</span></div>
            <div className="sl-kv"><span>Traditional Search</span><span>49 / 100 — indexable, competent build, dragged by the brand split</span></div>
            <div className="sl-kv"><span>Status</span><span>Baseline complete · phased plan drafted · no remediation performed yet</span></div>
            <div className="sl-kv"><span>Audited</span><span>July 2026</span></div>
          </div>
        </section>

        {/* 3 · THE SITUATION */}
        <section className="rsc-section">
          <h2 className="rsc-h2">The <em>situation</em></h2>
          <p className="rsc-p">
            The Mill built a real headquarters. It sits in Bloomington&apos;s Trades District innovation zone, it
            has strong launch press, and it&apos;s the flagship of Amplify Bloomington — a civic and innovation
            platform launched in early 2026 that grew out of the well-known Dimension Mill brand. By every human
            measure, it&apos;s established and easy to trust.
          </p>
          <p className="rsc-p">
            Then we asked the AI engines. All three answered — none drew a blank. But no two told the same story,
            and none told the whole one. The machines were describing a real headquarters from the sidewalk.
          </p>
        </section>

        {/* 4 · HEADLINE FINDING */}
        <section className="rsc-section">
          <h2 className="rsc-h2">The headline finding: the site&apos;s own robots file says <em>&ldquo;AI — do not enter.&rdquo;</em></h2>
          <p className="rsc-p">
            The single most important line in the audit is in the site&apos;s live robots.txt. It issues a blanket
            disallow to nearly every major AI crawler — GPTBot, ClaudeBot, Google-Extended, CCBot, and more — and
            sets a content signal of <span className="rsc-code">ai-train=no</span>. When someone asks an engine
            &ldquo;where should I cowork in Bloomington?&rdquo;, the crawlers that would let those models
            <em> learn</em> the business are turned away — so the answer runs on a live guess, not real knowledge
            of The Mill.
          </p>
          <p className="rsc-p">
            Regular Googlebot is unaffected, so traditional search still works. This is almost certainly an
            unattended &ldquo;block AI bots&rdquo; default from the site&apos;s CDN — not a decision anyone made on
            purpose. Which makes it the highest-leverage item in the whole report: roughly a one-afternoon fix with
            outsized upside.
          </p>
        </section>

        {/* 5 · WHAT EACH ENGINE UNDERSTOOD (live proof) */}
        <section className="rsc-section">
          <h2 className="rsc-h2">What each engine <em>understood</em></h2>
          <p className="rsc-p">
            We asked all three the same question — &ldquo;coworking in Bloomington, Indiana&rdquo; — live, on the
            audit date. All three surfaced The Mill, and each exposed a different crack in the same foundation.
          </p>
          <div className="sl-rec">
            <div className="sl-rec-h"><span className="sl-rec-name">ChatGPT — found you as a guess</span><span className="sl-verified">Thin, unowned</span></div>
            <p className="rsc-p" style={{ margin: 0 }}>
              ChatGPT surfaced The Mill through a live web search — because its search bot is open even though the
              training crawler is blocked, so the model never actually <em>learned</em> the business. The answer was
              thin and hedged, and listed larger competitors right alongside it: no hours, no pricing, no edge.
              Proves a thin, unowned presence.
            </p>
          </div>
          <div className="sl-rec">
            <div className="sl-rec-h"><span className="sl-rec-name">Perplexity — sent people to the wrong site</span><span className="sl-verified">Wrong domain</span></div>
            <p className="rsc-p" style={{ margin: 0 }}>
              Perplexity listed The Mill — but the link it cited pointed to <span className="rsc-code">dimensionmill.org</span>,
              the legacy domain being retired, not the current amplifybloomington.org. Every AI mention leaks to the
              site the business is trying to move off of. Proves the two-domain brand split.
            </p>
          </div>
          <div className="sl-rec">
            <div className="sl-rec-h"><span className="sl-rec-name">Gemini — reduced you to wifi &amp; coffee</span><span className="sl-verified">Amenities only</span></div>
            <p className="rsc-p" style={{ margin: 0 }}>
              Gemini leaned on the Google Business Profile rather than the website (Google-Extended is blocked), so
              it described The Mill in terms of amenities — &ldquo;wifi, coffee&rdquo; — with no membership, no
              events, and none of the Amplify story, and it listed The Mill beside larger competitors. Proves the
              business is locked out of telling its own story.
            </p>
          </div>
          <p className="rsc-p">
            Three engines, three different failures, one root cause: nothing on the site is built for machines to
            read, and the brand points in two directions. In every answer, The Mill was listed beside its
            competitors — never as <em>the</em> pick.
          </p>
        </section>

        {/* 6 · THE IDENTITY GAP */}
        <section className="rsc-section">
          <h2 className="rsc-h2">The identity <em>gap:</em> one business, three names</h2>
          <p className="rsc-p">
            A brand-new civic platform inherited a well-known coworking brand, and the identity hasn&apos;t
            consolidated yet. Search and AI systems resolve entities by consistency — and right now the signals
            contradict each other across three names and two live domains:
          </p>
          <ul className="rsc-ul">
            <li><strong>Amplify Bloomington</strong> — the new parent brand and domain. Strong press, low domain age, still establishing authority.</li>
            <li><strong>The Mill</strong> — the coworking and event space itself, and the page we audited. A generic term, easily confused.</li>
            <li><strong>Dimension Mill</strong> — the legacy brand on a still-live domain, ranking for the same terms. Directories still use it, and Perplexity cited it instead of the new site.</li>
          </ul>
          <p className="rsc-p">
            All three point at the same building — but no engine is being told they&apos;re the same entity. When
            every AI engine tells a different story, the business does not control its AI identity. The upside: this
            is fixable authority, not lost authority. The press exists and the location is iconic. It just needs to
            be pointed at one target and made machine-legible.
          </p>
        </section>

        {/* 7 · WHY APPEARING IS NOT ENOUGH */}
        <section className="rsc-section">
          <h2 className="rsc-h2">Why appearing is <em>not enough</em></h2>
          <p className="rsc-p">
            A traditional visibility check would have marked this a pass: The Mill shows up in all three engines.
            But showing up by luck is not the same as showing up by design. Proof OS™ evaluates what actually
            determines whether AI can represent a business correctly — whether AI systems can:
          </p>
          <ul className="rsc-ul">
            <li><strong>Access the business</strong> — reach the site and its machine-readable assets.</li>
            <li><strong>Identify the correct entity</strong> — resolve one brand, not a former identity on a retired domain.</li>
            <li><strong>Understand what it does</strong> — the membership, the events, the role, not just &ldquo;wifi and coffee.&rdquo;</li>
            <li><strong>Verify important claims</strong> — cross-check what the business says about itself.</li>
            <li><strong>Find consistent supporting evidence</strong> — the same facts, everywhere the engine looks.</li>
            <li><strong>Recommend it with confidence</strong> — because everything above holds together.</li>
          </ul>
          <p className="rsc-p">
            The Mill passed the first check and struggled with the rest. That pattern — found, but not understood —
            is exactly what most &ldquo;AI visibility&rdquo; checks never look for.
          </p>
        </section>

        {/* 8 · SCORECARD */}
        <section className="rsc-section">
          <h2 className="rsc-h2">Where the score <em>comes from</em></h2>
          <p className="rsc-p">
            The composite leans toward machine-readability — the signals that decide whether an engine can find,
            read, trust, and cite a business — with the brand-split penalty counted against both the AI and
            traditional tracks. A solid technical base still can&apos;t offset a locked front door to AI.
          </p>
          <div className="sl-doctrine-wrap">
            <table className="sl-doctrine">
              <thead><tr><th>#</th><th>Signal</th><th>Score</th><th>What we found</th></tr></thead>
              <tbody>
                {SIGNALS.map((s) => (
                  <tr key={s.n}><td>{s.n}</td><td>{s.name}</td><td>{s.score}</td><td>{s.note}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 9 · SEO vs AEO vs SIGNAL FLAIR */}
        <section className="rsc-section">
          <h2 className="rsc-h2">Where this sits next to <em>SEO and AEO</em></h2>
          <ul className="rsc-ul">
            <li><strong>SEO</strong> helps search engines discover and rank your pages.</li>
            <li><strong>AEO</strong> structures your information so answer engines can extract useful answers from it.</li>
            <li><strong>Signal Flair</strong> builds the proof infrastructure beneath and around both — the access, entity clarity, structured intelligence, answer architecture, trust evidence, and live visibility AI systems need to understand and confidently represent a business.</li>
          </ul>
          <p className="rsc-p">
            Signal Flair does not replace SEO or AEO. The Mill is the reason both need a foundation: its pages were
            indexable and its build was competent — a 49/100 traditional-search track and a genuinely solid technical
            base — and the engines still assembled three different identities, because the underlying proof layer was
            blocked, thin, and split across two domains.
          </p>
        </section>

        {/* 10 · HOW SIGNAL FLAIR CORRECTS THE FOUNDATION */}
        <section className="rsc-section">
          <h2 className="rsc-h2">How Signal Flair corrects the <em>foundation</em></h2>
          <p className="rsc-p">
            The plan is sequenced deliberately — access before structure, structure before authority. There&apos;s no
            point earning citations for a page the engines still aren&apos;t allowed to read.
          </p>
          <ul className="rsc-ul">
            <li><strong>Phase 1 · Days 1–14 · Unlock the door</strong> — remove the AI-crawler block from robots.txt / the CDN, publish a hand-built llms.txt, 301-redirect the legacy domain to the new pages, and align the Google Business Profile and directories to one brand and one address.</li>
            <li><strong>Phase 2 · Days 15–45 · Make it machine-legible</strong> — add LocalBusiness, FAQPage, and Event JSON-LD schema, write unique meta descriptions and image alt text sitewide, fix og:type, and add answer-shaped FAQ blocks to key pages.</li>
            <li><strong>Phase 3 · Days 46–90 · Become the answer</strong> — consolidate the launch earned-media links onto the new domain, run a local citation and review program, add a cinematic content layer for the space, and re-run Proof OS™ to track the Signal Score™ climb.</li>
          </ul>
          <p className="rsc-p">
            To be clear about what this page is: <strong>a baseline, not a before-and-after.</strong> No remediation
            has been performed yet, and no improvement is claimed. The projected targets — 35 today, 55+ by Day 14,
            80+ by Day 90 — are modeled from the fix set, not guaranteed rankings. When the corrections are made and a
            controlled retest is run, the documented results will be published here.
          </p>
        </section>

        {/* 11 · WHAT HAPPENS NEXT */}
        <section className="rsc-section">
          <h2 className="rsc-h2">What happens <em>next</em></h2>
          <p className="rsc-p">
            The jump from 35 to the mid-50s happens the day the crawlers are unblocked and llms.txt ships — no new
            content required, just access restored. The climb into the 80s is the structured-data and authority work
            compounding over the quarter. The infrastructure is roughly 80% built; it&apos;s just pointed away from
            the future of search. The next step is the 14-day emergency sprint, then a re-score at Day 30.
          </p>
        </section>

        {/* 12 · DISCLAIMER */}
        <section className="rsc-section">
          <div className="sl-rec">
            <p className="rsc-p sl-machine" style={{ margin: 0 }}>
              Published with The Mill&apos;s permission. This is a baseline Proof OS™ audit based on the site&apos;s
              live source and on live AI engine responses observed at a single point in time; the ranking snapshot is
              directional, not a rank-tracker time series. No remediation results are claimed. Projected scores are
              modeled targets, not guarantees. Signal Flair does not guarantee rankings, citations, leads, or revenue.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="rsc-cta">
          <h2 className="rsc-cta-h">What story is AI telling about <em>your</em> business?</h2>
          <p className="rsc-cta-b">Get your Signal Score™ — a baseline read of how AI systems access, understand, verify, and surface your business across the engines your customers already ask.</p>
          <a className="rsc-cta-btn" href="/#cta">▸ See What AI Understands About Your Business</a>
        </section>
      </div>

      <footer className="rsc-foot">
        Signal Flair · a Mental Vision product · Indianapolis, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/about/">about</a> · <a href="/how-it-works/">how it works</a> · <a href="/proof/">the record</a> · <a href="/faq/">faq</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
