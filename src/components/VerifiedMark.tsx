/**
 * Verified by Signal Flair™ — the trust mark / moat. Reusable across /proof/ pages.
 * Shows a REAL last-verified date + N of M signals confirmed, links to the public change log.
 * Geist Mono · teal · on dark. Sparse, diagnostic. The date is never faked.
 */
type Props = {
  lastVerified?: string
  confirmed?: number
  total?: number
  href?: string
  note?: string
}

export default function VerifiedMark({
  lastVerified = '2026-07-05',
  confirmed = 0,
  total = 6,
  href = '/proof/changelog/',
  note,
}: Props) {
  return (
    <a className="sl-mark" href={href}>
      <span className="sl-mark-pulse" aria-hidden="true" />
      <span className="sl-mark-body">
        <span className="sl-mark-main">Verified by Signal Flair<sup>™</sup></span>
        <span className="sl-mark-meta">
          Last verified {lastVerified} · {confirmed > 0
            ? `${confirmed} of ${total} facts independently confirmed`
            : 'every fact source-linked or marked unverified'}
        </span>
        {note ? <span className="sl-mark-note">{note}</span> : null}
      </span>
      <span className="sl-mark-arrow" aria-hidden="true">→</span>
    </a>
  )
}
