import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

export const metadata: Metadata = {
  title: 'AI Found the Business — But Told Three Different Stories | Signal Flair',
  description:
    'An anonymized baseline audit: one organization appeared in ChatGPT, Gemini, and Perplexity — and each engine described a different, incomplete version of it. Showing up is not the same as being understood.',
  alternates: { canonical: 'https://signalflair.ai/case-studies/three-engines-three-stories/' },
  openGraph: {
    title: 'AI Found the Business — But Told Three Different Stories',
    description:
      'One organization. Three AI engines. Three different identities. An anonymized Signal Baseline™ showing why appearing in AI answers is not the same as being understood.',
  },
}

// Anonymized baseline audit — the audited organization is NOT named anywhere in
// this file, by agreement, until written permission is recorded. See
// ANONYMIZED_BASELINE_CASE_INTERNAL.md (repo root, not exported) before editing.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://signalflair.ai/case-studies/three-engines-three-stories#article',
      headline: 'AI Found the Business — But Told Three Different Stories',
      description:
        'An anonymized Signal Baseline™ audit: one organization appeared in ChatGPT, Gemini, and Perplexity, and each engine presented a different, incomplete identity.',
      datePublished: '2026-07-21',
      dateModified: '2026-07-21',
      author: { '@id': 'https://signalflair.ai/#org' },
      publisher: { '@id': 'https://signalflair.ai/#org' },
      about: ['AI visibility', 'entity clarity', 'Answer Engine Optimization'],
      isPartOf: { '@id': 'https://signalflair.ai/#website' },
      mainEntityOfPage: 'https://signalflair.ai/case-studies/three-engines-three-stories/',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://signalflair.ai/case-studies/three-engines-three-stories#webpage',
      url: 'https://signalflair.ai/case-studies/three-engines-three-stories/',
      name: 'AI Found the Business — But Told Three Different Stories | Signal Flair',
      isPartOf: { '@id': 'https://signalflair.ai/#website' },
      about: { '@id': 'https://signalflair.ai/#org' },
    },
  ],
}

export default function ThreeEnginesCaseStudy() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 56, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/#cta">▸ Get Your Signal Score™</a>
      </nav>

      <div className="rsc-wrap">
        {/* 1 · HERO */}
        <header className="rsc-hero">
          <div className="rsc-eyebrow">Anonymized Baseline Audit</div>
          <h1 className="rsc-h1">
            AI found the business — but told <em>three different stories.</em>
          </h1>
          <p className="rsc-lead">
            Signal Flair ran a Signal Baseline™ on a real community-focused coworking and entrepreneurship
            organization. It appeared in ChatGPT, Gemini, and Perplexity — and each engine described a different,
            incomplete version of who it is. Showing up is not the same as being understood, trusted, or
            represented correctly.
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
              <span className="sl-verified">Anonymized Baseline</span>
            </div>
            <p className="rsc-p">
              This is a real audit of a real organization, published with the identifying details removed. The
              organization has not yet authorized public identification, so no name, location, score, or
              screenshot appears here. Everything described below was observed directly in live AI engine answers.
            </p>
            <div className="sl-kv"><span>Subject</span><span>A community-focused coworking &amp; entrepreneurship organization (anonymized)</span></div>
            <div className="sl-kv"><span>Deliverable</span><span>Signal Baseline™ — multi-engine AI visibility audit</span></div>
            <div className="sl-kv"><span>Engines reviewed</span><span>ChatGPT · Perplexity · Gemini</span></div>
            <div className="sl-kv"><span>Status</span><span>Baseline only — no remediation performed yet</span></div>
            <div className="sl-kv"><span>Baseline Signal Score™</span><span>Weak-signal band (0–54) — exact score withheld pending authorization</span></div>
            <div className="sl-kv"><span>Audited</span><span>July 2026</span></div>
          </div>
        </section>

        {/* 3 · THE SITUATION */}
        <section className="rsc-section">
          <h2 className="rsc-h2">The <em>situation</em></h2>
          <p className="rsc-p">
            The organization is established, active, and well regarded in its community. It runs a physical space,
            supports founders and small businesses, and has years of real programming behind it. By every human
            measure, it is easy to find and easy to trust.
          </p>
          <p className="rsc-p">
            Then we asked the AI engines about it. All three responded — no engine drew a blank. But no two engines
            told the same story, and none of them told the whole one.
          </p>
        </section>

        {/* 4 · WHAT EACH ENGINE UNDERSTOOD */}
        <section className="rsc-section">
          <h2 className="rsc-h2">What each engine <em>understood</em></h2>
          <div className="sl-rec">
            <div className="sl-rec-h"><span className="sl-rec-name">ChatGPT</span><span className="sl-verified">Thin version</span></div>
            <p className="rsc-p" style={{ margin: 0 }}>
              ChatGPT found the organization — but only a thin version of it. It could confirm the organization
              exists and roughly what category it belongs to, with little of the substance: the programs, the
              community role, the track record. A stranger reading the answer would learn the organization is real
              and almost nothing else.
            </p>
          </div>
          <div className="sl-rec">
            <div className="sl-rec-h"><span className="sl-rec-name">Perplexity</span><span className="sl-verified">Outdated identity</span></div>
            <p className="rsc-p" style={{ margin: 0 }}>
              Perplexity leaned on an older organizational identity. Its answer described the organization as it
              used to present itself — not as it operates today. The sources it reached for were real, but stale,
              so the story it told was yesterday&apos;s.
            </p>
          </div>
          <div className="sl-rec">
            <div className="sl-rec-h"><span className="sl-rec-name">Gemini</span><span className="sl-verified">Partial picture</span></div>
            <p className="rsc-p" style={{ margin: 0 }}>
              Gemini understood the amenities and the reviews — the physical space, what visitors say about it —
              but missed the broader organizational story. It described a place, not a mission. Accurate as far as
              it went; it just didn&apos;t go far.
            </p>
          </div>
        </section>

        {/* 5 · THE IDENTITY GAP */}
        <section className="rsc-section">
          <h2 className="rsc-h2">The identity <em>gap</em></h2>
          <p className="rsc-p">
            Put the three answers side by side and you get three different organizations: a thin sketch, an
            outdated profile, and a well-reviewed building. None of them is wrong enough to correct. None of them
            is right enough to trust. And the organization controls none of the three.
          </p>
          <p className="rsc-p">
            That is the identity gap: when every AI engine tells a different story, the business does not control
            its AI identity. The engines are assembling it from whatever fragments they can reach — and each engine
            reaches different fragments.
          </p>
        </section>

        {/* 6 · WHY APPEARING IS NOT ENOUGH */}
        <section className="rsc-section">
          <h2 className="rsc-h2">Why appearing is <em>not enough</em></h2>
          <p className="rsc-p">
            A traditional visibility check would have marked this audit a pass: the organization shows up in all
            three engines. But showing up by luck is not the same as showing up by design. Signal Flair&apos;s
            baseline evaluates what actually determines whether AI can represent a business correctly — whether AI
            systems can:
          </p>
          <ul className="rsc-ul">
            <li><strong>Access the business</strong> — reach the site and its machine-readable assets.</li>
            <li><strong>Identify the correct entity</strong> — resolve the right organization, not a look-alike or a former identity.</li>
            <li><strong>Understand what it does</strong> — the services, programs, and role, not just the category.</li>
            <li><strong>Verify important claims</strong> — cross-check what the organization says about itself.</li>
            <li><strong>Find consistent supporting evidence</strong> — the same facts, everywhere the engine looks.</li>
            <li><strong>Recommend it with confidence</strong> — because everything above holds together.</li>
          </ul>
          <p className="rsc-p">
            This organization passed the first check and struggled with the rest. That pattern — found, but not
            understood — is what most &ldquo;AI visibility&rdquo; checks never look for.
          </p>
        </section>

        {/* 7 · WHERE SIGNAL FLAIR SITS */}
        <section className="rsc-section">
          <h2 className="rsc-h2">Where this sits next to <em>SEO and AEO</em></h2>
          <ul className="rsc-ul">
            <li><strong>SEO</strong> helps search engines discover and rank your pages.</li>
            <li><strong>AEO</strong> structures your information so answer engines can extract useful answers from it.</li>
            <li><strong>Signal Flair</strong> builds the proof infrastructure beneath and around both — the access, entity clarity, structured intelligence, answer architecture, trust evidence, and live visibility AI systems need to understand and confidently represent a business.</li>
          </ul>
          <p className="rsc-p">
            Signal Flair does not replace SEO or AEO. This audit is the reason both need a foundation: the
            organization&apos;s pages were discoverable and its information was extractable — and the engines still
            assembled three different identities, because the underlying proof layer was thin, scattered, and
            partly out of date.
          </p>
        </section>

        {/* 8 · HOW SIGNAL FLAIR CORRECTS THE FOUNDATION */}
        <section className="rsc-section">
          <h2 className="rsc-h2">How Signal Flair corrects the <em>foundation</em></h2>
          <p className="rsc-p">
            For a baseline like this one, the correction path is the Signal Proof Layer™: deploy the
            machine-readable assets (llms.txt, aligned schema), resolve the entity signals so every engine lands on
            the current identity, shape answer-first content around the questions engines actually ask, and build
            the density of verifiable, consistent evidence that lets an engine trust what it finds.
          </p>
          <p className="rsc-p">
            To be clear about what this page is: <strong>a baseline, not a before-and-after.</strong> No
            remediation has been performed for this organization, and no improvement is claimed. When corrections
            are made and a controlled retest is run — and when the organization authorizes it — the documented
            results will be published here.
          </p>
        </section>

        {/* 9 · WHAT HAPPENS NEXT */}
        <section className="rsc-section">
          <h2 className="rsc-h2">What happens <em>next</em></h2>
          <p className="rsc-p">
            The findings have been delivered to the organization. If it moves forward, the sequence is the one
            Signal Flair always runs: fix the proof layer, retest against the same engines with the same prompts,
            and preserve both assessments so the change is documented rather than claimed.
          </p>
        </section>

        {/* 10 · DISCLAIMER */}
        <section className="rsc-section">
          <div className="sl-rec">
            <p className="rsc-p sl-machine" style={{ margin: 0 }}>
              This is an anonymized baseline audit based on live AI engine responses observed at a single point in
              time. The organization is unnamed pending written authorization; the exact baseline score is withheld
              for the same reason. No remediation results are claimed. Signal Flair does not guarantee rankings,
              citations, leads, or revenue.
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
        Signal Flair · a Mental Vision product · Brownsburg, Indiana · serving nationwide<br />
        <a href="/">signalflair.ai</a> · <a href="/about/">about</a> · <a href="/how-it-works/">how it works</a> · <a href="/proof/">the record</a> · <a href="/faq/">faq</a>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
