import type { Metadata } from 'next'
import SignalFlairLogo from '@/components/SignalFlairLogo'

export const metadata: Metadata = {
  title: 'Founding Partner Pilot Preview — Operator Route Map | Signal Flair',
  description:
    'Internal founder/operator preview: route-to-market categories, prospecting lanes, and pilot-test angles for AI Proof Infrastructure™. Not client-facing sales copy.',
  alternates: { canonical: 'https://signalflair.ai/proof/partner/' },
  robots: { index: false, follow: false },
}

type RouteLane = {
  title: string
  why: string
  examples: string
  angle: string
  offer: string
}

const ROUTE_LANES: RouteLane[] = [
  {
    title: 'Local Service Businesses',
    why: 'These businesses depend on being found, understood, and trusted quickly when customers ask AI systems for recommendations or options.',
    examples: 'HVAC, legal, healthcare, home services, trades.',
    angle: '“Your business may be visible on Google but unclear to AI systems.”',
    offer: 'Signal Score™ audit + Signal Proof Page™ + Stay Found™ monitoring.',
  },
  {
    title: 'Nonprofits',
    why: 'Nonprofits need donors, volunteers, partners, and beneficiaries to understand their mission accurately across search and AI answer systems.',
    examples: 'Youth programs, community development groups, workforce organizations, churches, foundations.',
    angle: '“Make your mission easier for AI systems, funders, and the public to verify.”',
    offer: 'AI Proof Infrastructure™ readiness review + public proof record + donor/partner visibility cleanup.',
  },
  {
    title: 'Civic Organizations',
    why: 'Public trust depends on clear, verifiable information. Civic and municipal organizations need accurate representation when residents search or ask AI systems for answers.',
    examples: 'City departments, chambers, public initiatives, community coalitions, economic development groups.',
    angle: '“Help residents, partners, and AI systems understand what you do, who you serve, and where to verify it.”',
    offer: 'Proof Distribution Layer™ plan + public Signal Proof Page™ + recurring drift checks.',
  },
  {
    title: 'Workforce Programs',
    why: 'Training and placement programs must be discoverable when people ask AI for career paths, certifications, or local job resources.',
    examples: 'Workforce boards, apprenticeship programs, placement nonprofits, skills centers.',
    angle: '“When someone asks AI where to train or get placed, can your program be verified — not confused with a competitor?”',
    offer: 'Signal Score™ baseline + answer architecture for program facts + public proof record.',
  },
  {
    title: 'Funders',
    why: 'Foundations and grantmakers need portfolio organizations to maintain accurate, inspectable proof as discovery shifts toward AI-mediated answers.',
    examples: 'Community foundations, regional grantmakers, corporate giving programs.',
    angle: '“Help grantees stay findable and verifiable — not misread in the layer AI actually reads.”',
    offer: 'Portfolio readiness spot-checks + Proof Distribution Layer™ action plan per grantee cohort.',
  },
  {
    title: 'Community Development Partners',
    why: 'CDCs and economic development groups amplify visibility for the businesses and programs they support — AI clarity multiplies that work.',
    examples: 'CDCs, Main Street programs, small-business support coalitions, chamber-backed initiatives.',
    angle: '“Make the organizations you support easier for AI systems to understand, verify, and recommend when appropriate.”',
    offer: 'Pilot cohort model + shared case-study framework + Signal Proof Page™ template per lane.',
  },
]

const PROOF_STACK = [
  {
    tag: 'Measure',
    name: 'Signal Baseline™',
    body: 'Signal Protocol™ diagnostic. Signal Score™ across seven layers. Prioritized gap list — not a generic PDF.',
  },
  {
    tag: 'Build',
    name: 'Signal Proof Layer™',
    body: 'Signal Proof Page™, schema, machine-readable facts, crawl access, and answer architecture deployed together.',
  },
  {
    tag: 'Maintain',
    name: 'Stay Found™',
    body: 'Recheck schedule, drift monitoring, and visibility observation framework so proof does not decay.',
  },
  {
    tag: 'Document',
    name: 'JSON proof readout',
    body: 'Machine-readable artifact the organization owns — synced with the public Signal Proof Page™.',
  },
]

const MEASUREMENTS = [
  'Signal Score™ — composite 0–100 across seven proof layers',
  'Layer-by-layer readiness: access, structure, entity, answers, trust, visibility',
  'Live AI visibility observations (manual in pilot; automated later)',
  'Before/after proof density on Signal Proof Page™',
  'Category prompt snapshot — competitor mention context, not a ranking guarantee',
]

export default function FoundingPartnerPilotPreviewPage() {
  return (
    <main className="rsc sl">
      <nav className="rsc-nav">
        <a className="rsc-logo" href="/" aria-label="Signal Flair home"><SignalFlairLogo style={{ height: 70, width: 'auto', display: 'block' }} /></a>
        <a className="rsc-navcta" href="/proof/">← Proof hub</a>
      </nav>

      <div className="rsc-wrap">
        <div
          className="rsc-p"
          style={{
            margin: '0 0 0',
            padding: '12px 16px',
            background: 'rgba(11,10,9,0.06)',
            borderBottom: '1px solid var(--line-dark)',
            fontSize: '11px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <strong>Founding Partner Pilot Preview</strong> · Internal operator view · Not client-facing sales copy
        </div>

        <header className="rsc-hero">
          <div className="rsc-eyebrow">Founding Partner Pilot · Operator preview</div>
          <h1 className="rsc-h1">
            Map the first proof lanes <em>before the market catches up.</em>
          </h1>
          <p className="rsc-lead">
            Use this preview to identify where Signal Flair can test AI Proof Infrastructure™ in the
            real market. The goal is to find practical pilot partners, document baseline gaps, build
            public proof assets, and turn the findings into repeatable case studies. No visibility
            guarantees.
          </p>
        </header>

        <section className="rsc-section">
          <h2 className="rsc-h2">How to use <em>this</em></h2>
          <p className="rsc-p">
            Use these categories as prospecting lanes, partnership targets, and pilot-test
            opportunities. For each category, identify one organization, run a baseline Signal
            Score™, document the gaps, build the proof asset, and use the before/after findings as a
            case study.
          </p>
          <p className="rsc-p">
            Signal Flair does not guarantee AI rankings, citations, recommendations, inclusion, or
            visibility. The work improves readiness by making the organization easier for AI systems to
            access, understand, verify, and recommend when appropriate.
          </p>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Route-to-Market <em>Opportunities</em></h2>
          {ROUTE_LANES.map((lane) => (
            <div className="sl-rec" key={lane.title}>
              <div className="sl-rec-h">
                <span className="sl-rec-name">{lane.title}</span>
              </div>
              <p className="rsc-p">
                <strong>Why they matter:</strong> {lane.why}
              </p>
              <p className="rsc-p">
                <strong>Examples:</strong> {lane.examples}
              </p>
              <p className="rsc-p">
                <strong>Best angle:</strong> {lane.angle}
              </p>
              <p className="rsc-p">
                <strong>Possible offer:</strong> {lane.offer}
              </p>
            </div>
          ))}
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Proof stack to <em>test</em></h2>
          <p className="rsc-p">Default deliverables to run on each pilot — adjust per lane, not per sales tier.</p>
          {PROOF_STACK.map((item) => (
            <div className="sl-rec" key={item.name}>
              <div className="sl-rec-h">
                <span className="sl-rec-name">{item.name}</span>
                <span className="sl-verified">{item.tag}</span>
              </div>
              <p className="rsc-p">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">What gets <em>measured</em></h2>
          <ul className="rsc-ul">
            {MEASUREMENTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rsc-section">
          <h2 className="rsc-h2">Operator <em>notes</em></h2>
          <ul className="rsc-ul">
            <li>
              <strong>Case study priority:</strong> Pilots with documented before/after become
              reference proof for the lane — with partner approval only.
            </li>
            <li>
              <strong>Protocol feedback:</strong> Vertical-specific gaps should feed back into Signal
              Protocol™ checkpoints — not one-off fixes.
            </li>
            <li>
              <strong>Direct implementation:</strong> Founder-led builds keep the proof layer honest;
              delegate only after the playbook is repeatable.
            </li>
            <li>
              <strong>No outcome guarantees:</strong> Signal Score™ measures readiness and proof
              density — not placement, citations, or revenue.
            </li>
          </ul>
        </section>

        <section className="rsc-cta">
          <h2 className="rsc-cta-h">Back to the <em>record</em></h2>
          <p className="rsc-cta-b">
            Case Zero baseline lives on the Signal Proof Page™. Use it as the proof-before-pitch
            reference when pitching any lane above.
          </p>
          <a className="rsc-cta-btn" href="/proof/">← Signal Proof Page™ hub</a>
        </section>
      </div>

      <footer className="rsc-foot">
        Signal Flair · operator preview · not for public distribution<br />
        <a href="/proof/">proof hub</a> · <a href="/">signalflair.ai</a>
      </footer>
    </main>
  )
}